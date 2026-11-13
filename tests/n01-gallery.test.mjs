/* N01-G regression: approved-only Gallery, no real school images in fixture. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isRealISODate,isPublicGalleryAsset,validateGalleries,validateSourceParity} from '../scripts/validate-galleries.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(ROOT,'data/galleries.json'),'utf8'));
const index=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const html=fs.readFileSync(path.join(ROOT,'gallery.html'),'utf8');
const js=fs.readFileSync(path.join(ROOT,'assets/gallery.js'),'utf8');
const css=fs.readFileSync(path.join(ROOT,'assets/gallery.css'),'utf8');
const publishedNews=JSON.parse(fs.readFileSync(path.join(ROOT,'data/catalog.json'),'utf8'));
const knownIssueIds=new Set((publishedNews.issues||[]).filter(i=>i.status==='published').map(i=>i.id));
assert.deepEqual(validateGalleries(data,{root:ROOT,knownIssueIds}),[]);
assert.deepEqual(validateSourceParity(data,{root:ROOT}),[]);
assert.ok(data.galleries.every(g => g.status === 'published' && g.visibility_approved_at && g.approved_version && g.published_at),
  'N01-G public albums must be approved published Galleries; genuine approved albums are allowed');
assert.equal(isRealISODate('2026-11-13'),true);
assert.equal(isRealISODate('2026-02-30'),false);
assert.equal(isPublicGalleryAsset('assets/galleries/WDGAL-2569-0001/cover-v01.webp','WDGAL-2569-0001'),true);
assert.equal(isPublicGalleryAsset('../private/image.webp','WDGAL-2569-0001'),false);
assert.equal(isPublicGalleryAsset('https://drive.google.com/uc?id=secret','WDGAL-2569-0001'),false);
assert.equal(isPublicGalleryAsset('assets/galleries/WDGAL-2569-0002/cover-v01.webp','WDGAL-2569-0001'),false);
const fixture={
  gallery_id:'WDGAL-2569-0001',event_id:'EVT-2569-0001',
  title_th:'ทดสอบอัลบั้ม (ไม่ใช่ข่าวจริง)', date:'2026-11-13',
  description_th:'ภาพทดสอบภายในชุดทดสอบเท่านั้น',
  category:'activity',tags:['test'],status:'published',
  approved_version:'v01',visibility_approved_at:'2026-11-13T08:00:00+07:00',
  published_at:'2026-11-13T09:00:00+07:00',
  cover_image:'assets/galleries/WDGAL-2569-0001/photo01-thumb-v01.webp',
  linked_issue_ids:[],
  photos:[{
    photo_id:'P01',
    thumb_image:'assets/galleries/WDGAL-2569-0001/photo01-thumb-v01.webp',
    web_image:'assets/galleries/WDGAL-2569-0001/photo01-web-v01.webp',
    alt_th:'ภาพทดสอบที่ไม่มีภาพนักเรียนจริง',caption_th:'ตัวอย่างเฉพาะหน่วยทดสอบ',
    width:1280,height:960,sha256:'a'.repeat(64)
  }]
};
const valid={schema_version:1,generated_at:'2026-11-13',galleries:[fixture]};
assert.deepEqual(validateGalleries(valid,{checkFiles:false,knownIssueIds}),[]);
// A real approved issue may be linked from a Gallery after the first newsletter is published.
if (knownIssueIds.size) {
  const approvedIssueId = [...knownIssueIds][0];
  assert.deepEqual(validateGalleries({
    ...valid, galleries: [{...fixture, linked_issue_ids: [approvedIssueId]}]
  }, {checkFiles:false,knownIssueIds}), []);
}
assert.ok(!knownIssueIds.has('WDNEWS-2569-9999'), 'Reserved unknown-link test ID must remain unregistered');
const invalid=[
  {...fixture,status:'draft'},
  {...fixture,visibility_approved_at:null},
  {...fixture,photos:[]},
  {...fixture,cover_image:'assets/galleries/WDGAL-2569-0001/other-v01.webp'},
  {...fixture,private_drive_folder_id:'sensitive'},
  {...fixture,event_id:'EVT-2568-0001'},
  {...fixture,linked_issue_ids:['WDNEWS-2569-9999']},
  {...fixture,photos:[{...fixture.photos[0],original_drive_file_id:'sensitive'}]},
  {...fixture,photos:[{...fixture.photos[0],web_image:'https://drive.google.com/uc?id=xxx'}]},
  {...fixture,photos:[{...fixture.photos[0],web_image:'assets/galleries/WDGAL-2569-0001/photo01-web-v02.webp'}]},
  {...fixture,photos:[{...fixture.photos[0],sha256:'abc'}]}
];
invalid.forEach((g,i)=>{
  const errors=validateGalleries({schema_version:1,generated_at:'2026-11-13',galleries:[g]},
    {checkFiles:false,knownIssueIds});
  assert.ok(errors.length,'invalid fixture '+i+' was not rejected');
});
assert.ok(validateGalleries({schema_version:1,generated_at:'2026-11-13',galleries:[fixture,fixture]},
  {checkFiles:false}).length);
for(const tag of ['id="gallery-filters"','id="gallery-grid"','id="gallery-empty"','id="album-view"','id="gallery-lightbox"']){
  assert.ok(html.includes(tag),'missing '+tag);
}
assert.ok(index.includes('./gallery.html'),'main site links to Gallery');
assert.ok(html.includes('./assets/gallery.css')&&html.includes('./assets/gallery.js'));
assert.ok(js.includes("fetch('./data/galleries.json'")&&js.includes("g.status !== 'published'"));
assert.ok(js.includes('ArrowLeft')&&js.includes('touchend'));
assert.ok(css.includes('@media(max-width:630px)')&&css.includes('prefers-reduced-motion'));
// Unified design guard: Gallery reuses homepage's real brand/hero/filters,
// not a second 2000px-wide desktop design system.
assert.ok(html.includes('<body class="gallery-page">'));
assert.ok(html.includes('class="hero gallery-hero"'));
assert.ok(html.includes('class="wrap hero-grid gallery-hero-grid"'));
assert.ok(html.includes('class="hero-intro gallery-hero-intro"'));
assert.ok(html.includes('class="hero-art" aria-hidden="true"'));
assert.ok(html.includes('class="paper paper-front"'));
assert.ok(html.includes('class="filters gallery-filters"'));
assert.ok(html.includes('class="empty gallery-empty"'));
assert.ok(html.includes('class="empty-symbol gallery-empty-symbol"'));
assert.ok(css.includes('body.gallery-page') && css.includes('min-height:100dvh'));
assert.ok(css.includes('var(--deep)') && css.includes('grid-template-columns:repeat(3,minmax(0,1fr))'));
assert.ok(!css.includes('2000px') && !css.includes('repeat(4,minmax(0,1fr))'));
assert.ok(css.includes('@media(max-width:900px)') && css.includes('@media(max-width:630px)'));

assert.ok(!html.includes('drive.google.com')&&!js.includes('drive.google.com'),'no public Drive hotlink');
console.log('PASS N01-G: approved-only schema, source parity, security fixtures, UI routes and responsive styles');
