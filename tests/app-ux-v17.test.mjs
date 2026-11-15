import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const app=read('assets/app.js'),shell=read('assets/app-shell.js');
const css=read('assets/app-shell.css'),sw=read('sw.js');
const workflow=read('.github/workflows/static-qa.yml');
const catalog=JSON.parse(read('data/galleries.json'));
const start=app.indexOf('  const HERO_PHOTO_ALLOWLIST=');
const end=app.indexOf('  async function renderAppGalleries(){',start);
assert(start>=0&&end>start,'approved-only hero photo picker is registered');
const block=app.slice(start,end);
assert.match(block,/status!=='published'/);
assert.match(block,/visibility_approved_at/);
assert.match(block,/approved_version/);
assert.match(block,/published_at/);
assert.match(block,/Object\.hasOwn\(HERO_PHOTO_ALLOWLIST,g\.gallery_id\)/,'do not resolve prototype keys from gallery manifest');
assert.match(block,/thumb_image/,'only public optimized thumbnail paths');
assert.match(block,/^/);
assert.doesNotMatch(block,/drive\.google\.com|source_photos|previewUrl/i);
assert.match(app,/setWelcomeSessionPhoto\(data\.galleries\)/,'reuse Gallery public fetch rather than a second request');
const curated={
  'WDGAL-2569-0002':['P01','P02','P11'],
  'WDGAL-2569-0001':['P01','P02','P03','P04']
};
for(const [galleryId,photos] of Object.entries(curated)){
 const g=catalog.galleries.find(item=>item.gallery_id===galleryId);
 assert(g&&g.status==='published'&&g.visibility_approved_at&&g.approved_version&&g.published_at, galleryId+' must be approved published');
 for(const id of photos){
   const photo=g.photos.find(item=>item.photo_id===id);
   assert(photo&&photo.alt_th&&photo.thumb_image.endsWith('.webp'), 'approved thumb missing: '+galleryId+':'+id);
 }
}
const makeStorage=map=>({
 getItem:key=>map.get(key)||null,
 setItem:(key,value)=>map.set(key,String(value))
});
const persisted=new Map();
const navSession=()=>{
 const selected=new Map();
 const welcome={
   attrs:new Map(),
   style:{setProperty(k,value){this[k]=value}},
   classList:{add(){},remove(){}}
 };
 const env={
   URL,Math:{floor:Math.floor,random:()=>0},
   document:{baseURI:'https://infobwd.github.io/bwd-newsroom/',
     querySelector:selector=>selector==='#app-home .app-welcome'?welcome:null},
   sessionStorage:makeStorage(selected),localStorage:makeStorage(persisted),
   Image:class{set src(url){this.url=url;if(this.onload)this.onload();}}
 };
 const pick=vm.runInNewContext(block+'\nsetWelcomeSessionPhoto;',env);
 return {pick,selected,welcome};
};
const first=navSession();
first.pick(catalog.galleries);
const firstPath=first.selected.get('bwd-hero-photo-session-v1');
assert(firstPath&&firstPath.startsWith('assets/galleries/'),'first session must choose a self-hosted approved image');
const firstStyle=first.welcome.style['--bwd-welcome-image'];
assert(firstStyle.includes(firstPath),'chosen photo is rendered behind the welcome card');
first.pick(catalog.galleries);
assert.equal(first.selected.get('bwd-hero-photo-session-v1'),firstPath,'a reload in the same session retains the same photo');
const second=navSession();
second.pick(catalog.galleries);
assert.notEqual(second.selected.get('bwd-hero-photo-session-v1'),firstPath,'a new session should not immediately repeat the previous image');
const rejected=navSession();
const fake=[{...catalog.galleries[0],status:'draft'},{...catalog.galleries[1],visibility_approved_at:''}];
rejected.pick(fake);
assert.equal(rejected.selected.size,0,'unapproved images cannot become public hero backgrounds');
assert.equal(rejected.welcome.style['--bwd-welcome-image'],undefined,'gradient stays in place without eligible photos');
assert.match(css,/\.app-welcome\.has-approved-hero-photo::before/);
assert.match(css,/background-image:var\(--bwd-welcome-image\)/);
assert.match(css,/opacity:\.15/,'photo stays subtle behind legible navy text');
assert.match(css,/\.app-welcome,\.app-welcome::after\{animation:none!important\}/,'existing reduced-motion hero control remains');
assert.match(css,/\.app-welcome\.has-approved-hero-photo::before\{animation:none!important/);
assert.match(css,/\.site-header\.is-app-compact/);
assert.match(css,/\.site-header\{\s*position:sticky/,'compact mobile header is sticky');
assert.match(shell,/function updateCompactHeader\(\)/);
assert.match(shell,/window\.scrollY>112/);
assert.match(shell,/window\.addEventListener\('resize',/);
assert.match(css,/scroll-margin-top:calc\(76px \+ env\(safe-area-inset-top\)\)/,'search remains clear of compact header');
assert.match(css,/\.app-bottom-nav a:active\{transform:scale\(\.96\)\}/);
assert.match(css,/prefers-reduced-motion:reduce/);
assert(Number(sw.match(/const VERSION='bwd-public-shell-2569-11-15-v(\d+)/)?.[1])>=15,'PWA shell retains v1.7 or newer');
const precache=sw.slice(sw.indexOf('const SHELL='),sw.indexOf('const PATHS='));
assert.doesNotMatch(precache,/assets\/galleries\/|data\/|assets\/issues\/|\.pdf/,'no private media or manifest caching');
assert.match(workflow,/node tests\/app-ux-v17\.test\.mjs/);
console.log('PASS Mobile UX v1.7 approved-photo session/rotation, fallback, compact header and accessibility contracts (not device QA)');
