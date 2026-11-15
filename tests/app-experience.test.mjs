import assert from 'node:assert/strict';
import{readFileSync,existsSync}from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('manifest.webmanifest'));
assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./?source=pwa');
assert.equal(manifest.display,'standalone');
assert.deepEqual(manifest.icons.map(i=>i.sizes),['192x192','512x512']);
for(const icon of manifest.icons){
  const path=icon.src.replace(/^\.\//,'');
  assert(existsSync(new URL('../'+path,import.meta.url)),path);
  const b=readFileSync(new URL('../'+path,import.meta.url));
  assert.equal(b.subarray(1,4).toString(),'PNG');
  const size=Number(icon.sizes.split('x')[0]);
  assert.equal(b.readUInt32BE(16),size);
  assert.equal(b.readUInt32BE(20),size);
}
const worker=read('sw.js'), shell=read('assets/app-shell.js');
assert.match(worker,/registration\.scope/);
const shellEntries=worker.slice(worker.indexOf('const SHELL='),worker.indexOf('const PATHS='));
assert(!shellEntries.includes('data/'), 'no published catalogues in precache');
assert(!shellEntries.includes('assets/issues/'), 'no issue media in precache');
assert(!shellEntries.includes('assets/galleries/'), 'no photo media in precache');
assert(worker.includes('data') && worker.includes('issues|galleries|books') && worker.includes('pdf'), 'worker excludes public media and PDFs');
assert.match(worker,/cache\.addAll\(SHELL\)/);
assert.doesNotMatch(worker,/https:\/\/drive\.google\.com|private_source|client_secret|auth_token/i);
assert.match(shell,/serviceWorker\.register\('\.\/sw\.js',\{scope:'\.\/'\}\)/);
assert.match(shell,/beforeinstallprompt/);
assert.match(shell,/SKIP_WAITING/);
assert.doesNotMatch(read('reader.html'),/app-bottom-nav|app-shell\.js|sw\.js/);
for(const name of ['index.html','gallery.html']){
  const html=read(name);
  assert.match(html,/rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(html,/class="app-bottom-nav"/);
  assert.match(html,/data-app-tab="home"/);
  assert.match(html,/data-app-tab="news"/);
  assert.match(html,/data-app-tab="gallery"/);
  assert.match(html,/data-app-tab="books"/);
  assert.match(html,/assets\/app-shell\.js/);
}
assert.match(read('index.html'),/id="app-home"/);
assert.match(read('assets/app.js'),/renderAppHome\(\)/);
assert.match(read('assets/app.js'),/renderAppGalleries\(\)/);
assert.match(read('assets/gallery.js'),/galleryListScroll/);
assert.match(read('assets/app-shell.css'),/safe-area-inset-bottom/);
console.log('App Experience v1 contracts PASS (static, not device QA)');