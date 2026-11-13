import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCatalogue, validAsset, isRealDate } from '../scripts/validate-catalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data/catalog.json'), 'utf8'));
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/styles.css'), 'utf8');
assert.deepEqual(validateCatalogue(catalog), []);
assert.equal(catalog.issues.length, 0, 'N01 must not invent or publish sample news without approval');
assert.equal(isRealDate('2026-11-13'), true);
assert.equal(isRealDate('2026-02-30'), false);
assert.equal(validAsset('assets/issues/WDNEWS-2569-0001/page-01-v01.webp'), true);
assert.equal(validAsset('https://drive.google.com/file/preview'), false);
assert.equal(validAsset('../private/image.png'), false);
const fixture = {
 id: 'WDNEWS-2569-0001',
 title_th: 'ข่าวที่ผ่านการตรวจรับ (fixture only)',
 excerpt_th: 'ข้อความสรุปตัวอย่างใช้เฉพาะใน test เท่านั้น',
 date: '2026-11-13',
 category: 'activity',
 template_code: 'WD-01',
 status: 'published',
 visibility_approved_at: '2026-11-13T12:00:00+07:00',
 approved_version: 'v01',
 published_at: '2026-11-13T13:00:00+07:00',
 tags: ['ทดสอบ'],
 pages: [{ page_no: 1, web_image: 'assets/issues/WDNEWS-2569-0001/page-01-v01.webp', alt_th: 'ภาพสำหรับทดสอบ' }]
};
assert.deepEqual(validateCatalogue({ schema_version: 1, issues: [fixture] }, { checkFiles: false }), []);
for (const wrong of [
  { ...fixture, status: 'draft' },
  { ...fixture, visibility_approved_at: null },
  { ...fixture, pages: [{ ...fixture.pages[0], web_image: 'https://drive.google.com/uc?id=xxx' }] },
  { ...fixture, pages: [{ ...fixture.pages[0], page_no: 2 }] },
  { ...fixture, id: 'WDNEWS-2568-0001' }
]) {
 assert.notEqual(validateCatalogue({ schema_version: 1, issues: [wrong] }, { checkFiles: false }).length, 0);
}
assert.ok(index.includes('id="search"') && index.includes('id="news-grid"') && index.includes('id="issue-dialog"'));
assert.ok(index.includes('./assets/styles.css') && index.includes('./assets/app.js'));
assert.ok(app.includes("fetch('./data/catalog.json'"));
assert.ok(app.includes('validIssue(issue)') && app.includes('published'));
assert.ok(css.includes('@media(max-width:630px)') && css.includes('prefers-reduced-motion'));
console.log('PASS: N01 schema, no unapproved news, static shell, app wiring and responsive CSS');
