/* Public HTTP smoke check for BWD Newsroom's first approved issue.
   Uses only public GitHub Pages content; no school Drive IDs or credentials.
   Run: node scripts/verify-live-pages.mjs
*/
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const base = 'https://infobwd.github.io/bwd-newsroom/';
const issueId = 'WDNEWS-2569-0001';
const expectedHashes = {
  'assets/issues/WDNEWS-2569-0001/page-01-v01.webp': '22db1c988e97865e1e106a708c7ba35ba9eb03fbee8bd7eb8a08e66876f8ecd7',
  'assets/issues/WDNEWS-2569-0001/issue-v01.pdf': 'ccff54123cfdf0e548db02f1b2151243d324286342a10908f7bb7dc91835c08b'
};

async function get(path, asBytes = false) {
  const url = new URL(path, base);
  if (!asBytes) url.searchParams.set('_qa', String(Date.now()));
  const response = await fetch(url, { cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, url + ' returned HTTP ' + response.status);
  assert.equal(response.url.startsWith(base), true, 'Unexpected redirect away from public Pages');
  const body = new Uint8Array(await response.arrayBuffer());
  assert.ok(body.length > 100, 'Empty public asset: ' + path);
  return { response, body, text: asBytes ? null : new TextDecoder().decode(body) };
}

async function checkLive() {
  const catalog = await get('data/catalog.json');
  const data = JSON.parse(catalog.text);
  assert.equal(data.schema_version, 1);
  const issue = data.issues.find(i => i.id === issueId);
  assert.ok(issue, 'First news issue not yet present in deployed catalog');
  assert.equal(issue.status, 'published');
  assert.equal(issue.approved_version, 'v01');
  assert.equal(issue.date, '2026-11-08');
  assert.equal(issue.pages.length, 1);
  assert.equal(issue.pages[0].web_image, 'assets/issues/WDNEWS-2569-0001/page-01-v01.webp');
  assert.equal(issue.public_pdf_url, 'assets/issues/WDNEWS-2569-0001/issue-v01.pdf');
  assert.ok(issue.body_th.includes('วัดพระพุทธเมตตาอุดมธรรม'), 'Thai article text absent');

  const [site, reader, app, webp, pdf] = await Promise.all([
    get('index.html'),
    get('reader.html?issue=' + issueId),
    get('assets/app.js'),
    get(issue.pages[0].web_image, true),
    get(issue.public_pdf_url, true)
  ]);
  assert.ok(site.text.includes('news-grid'), 'News listing markup missing');
  assert.ok(reader.text.includes('reader-toc'), 'Flipbook route markup missing');
  assert.ok(app.text.includes('publicFileLink'), 'PDF/download app logic missing');
  assert.equal(new TextDecoder().decode(webp.body.slice(0, 4)), 'RIFF', 'Not a WebP container');
  assert.equal(new TextDecoder().decode(webp.body.slice(8, 12)), 'WEBP', 'Not a WebP image');
  assert.equal(new TextDecoder().decode(pdf.body.slice(0, 5)), '%PDF-', 'Not a valid PDF header');
  for (const [path, hash] of Object.entries(expectedHashes)) {
    const bytes = path.endsWith('.webp') ? webp.body : pdf.body;
    const actual = createHash('sha256').update(bytes).digest('hex');
    assert.equal(actual, hash, 'Public asset checksum mismatch: ' + path);
  }
  const pdfText = new TextDecoder('latin1').decode(pdf.body);
  assert.equal(pdfText.includes('DAHa0P1ymZs'), false, 'Internal Canva reference leaked into PDF');
  assert.equal(pdfText.includes('BAE_jFYspt0'), false, 'Internal Canva brand reference leaked into PDF');
  console.log('PASS LIVE: Homepage, public catalog, Thai issue, reader, image, PDF, checksums and metadata');
  console.log('Public issue: ' + base + '#issue=' + issueId);
  console.log('PDF: ' + new URL(issue.public_pdf_url, base));
  console.log('Image: ' + new URL(issue.pages[0].web_image, base));
}

let last;
for (let attempt = 1; attempt <= 18; attempt++) {
  try {
    await checkLive();
    process.exit(0);
  } catch (error) {
    last = error;
    console.error('Live check ' + attempt + '/18: ' + String(error?.message || error));
    if (attempt < 18) await new Promise(resolve => setTimeout(resolve, 8000));
  }
}
console.error('FAIL LIVE: ' + (last?.stack || last));
process.exit(1);
