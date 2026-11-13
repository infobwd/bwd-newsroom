/* N01-G: verify the ACTUAL public Gallery album and all approved derivatives.
   No private Drive access, credentials, source image IDs or student names.
   Run: node scripts/verify-live-gallery.mjs
*/
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const BASE = 'https://infobwd.github.io/bwd-newsroom/';
const ALBUM_ID = 'WDGAL-2569-0001';
const ISSUE_ID = 'WDNEWS-2569-0001';
const expectedThumbHashes = {
  P01:'f7ebcd636b4e6cd78af937ff8a89f939787204a8749ffee02fc298d9cb8e2124',
  P02:'a80461fcde21412b6c48488d1c46d4e984140bbad73eb05b62ba11224b092c46',
  P03:'539e9e2c49cf0f9f65a6ccc9f6b6b939ddba1acad56c43287a002ade9d5b94a2',
  P04:'925feda7f5edf32b516747fb4bbcbc5fe750f1ee3a31ab4836b7ffdf8ce526a0',
  P05:'ff47c33e68899439ff4df48082117fe501d2aeed8cadcd1db2ab525bfe725f5b'
};

async function get(path) {
  const url=new URL(path,BASE);
  url.searchParams.set('_qa',String(Date.now()));
  const response=await fetch(url,{cache:'no-store',redirect:'follow',signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200,url+' HTTP '+response.status);
  assert.ok(response.url.startsWith(BASE),'Unexpected redirect away from Pages: '+response.url);
  const bytes=new Uint8Array(await response.arrayBuffer());
  assert.ok(bytes.length>100,'Empty Gallery resource: '+path);
  return {response,bytes};
}
const readUtf8 = r=>new TextDecoder().decode(r.bytes);
const hash = body=>createHash('sha256').update(body).digest('hex');
function validPublicAsset(path) {
 return typeof path==='string' && /^assets\/galleries\/WDGAL-2569-0001\/photo\d{2}-(?:thumb|web)-v01\.webp$/.test(path);
}
function assertWebP(resource,path,expected) {
  const ascii=new TextDecoder();
  assert.equal(ascii.decode(resource.bytes.slice(0,4)),'RIFF','Invalid RIFF '+path);
  assert.equal(ascii.decode(resource.bytes.slice(8,12)),'WEBP','Invalid WebP '+path);
  assert.equal(hash(resource.bytes),expected,'Public SHA256 mismatch '+path);
}
async function verify() {
 const [catalog,news,html,js]=await Promise.all([
   get('data/galleries.json'),get('data/catalog.json'),get('gallery.html'),get('assets/gallery.js')
 ]);
 const galleries=JSON.parse(readUtf8(catalog));
 const newsData=JSON.parse(readUtf8(news));
 assert.equal(galleries.schema_version,1);
 assert.ok(Array.isArray(galleries.galleries));
 const album=galleries.galleries.find(g=>g.gallery_id===ALBUM_ID);
 assert.ok(album,'Public Kathin album missing');
 assert.equal(album.event_id,'EVT-2569-0001');
 assert.equal(album.date,'2026-11-08');
 assert.equal(album.status,'published');
 assert.equal(album.approved_version,'v01');
 assert.ok(album.visibility_approved_at && album.published_at,'Album must be approved and published');
 assert.ok(album.linked_issue_ids.includes(ISSUE_ID),'Published newsletter backlink missing');
 assert.ok(newsData.issues.some(i=>i.id===ISSUE_ID&&i.status==='published'),'Linked approved issue missing');
 assert.equal(album.photos.length,5,'Only the five curated photographs may be public');
 assert.equal(album.cover_image,album.photos[0].thumb_image,'Wrong cover photo');
 assert.ok(readUtf8(html).includes('id="gallery-grid"'),'Gallery grid missing from public page');
 assert.ok(readUtf8(html).includes('id="gallery-lightbox"'),'Gallery lightbox missing from public page');
 assert.ok(readUtf8(js).includes("fetch('./data/galleries.json'"),'Public album loader missing');
 const serialized=JSON.stringify(galleries);
 assert.equal(/drive\.google\.com|original_drive_file_id|private_drive_folder_id/.test(serialized),false,'Private source leaked in manifest');
 const results=await Promise.all(album.photos.flatMap(p=>{
  assert.ok(validPublicAsset(p.web_image) && validPublicAsset(p.thumb_image),'Invalid Gallery path');
  assert.ok(/^P0[1-5]$/.test(p.photo_id),'Unexpected photo ID');
  assert.equal(p.width,1600);
  assert.equal(p.height,1200);
  assert.ok(p.alt_th.trim() && p.caption_th.trim(),'Photo captions missing');
  return [get(p.web_image),get(p.thumb_image)];
 }));
 for (let i=0;i<album.photos.length;i++) {
  const p=album.photos[i];
  assertWebP(results[2*i],p.web_image,p.sha256);
  assertWebP(results[2*i+1],p.thumb_image,expectedThumbHashes[p.photo_id]);
 }
 console.log('PASS LIVE GALLERY: 1 approved album / 5 photos / 10 verified WebP HTTP 200 + SHA256');
 console.log('PASS Gallery page, lightbox script, approved newsletter link and no private manifest data');
 console.log('Public album: '+BASE+'gallery.html#album='+ALBUM_ID);
}
let last;
for(let i=1;i<=15;i++){
 try {await verify();process.exit(0);}
 catch(e){last=e;console.error('Gallery check '+i+'/15: '+(e?.message||e));if(i<15)await new Promise(resolve=>setTimeout(resolve,8000));}
}
console.error('FAIL LIVE GALLERY: '+(last?.stack||last));
process.exit(1);
