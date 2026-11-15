/* Synthetic, source-only checks. These are NOT iPhone Safari or Pages QA. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const home=read('index.html'), gallery=read('gallery.html');
const app=read('assets/app.js'), galleryApp=read('assets/gallery.js');
const css=read('assets/styles.css'), galleryCss=read('assets/gallery.css');
const reader=read('assets/reader.js');

assert.match(home,/id="dialog-content" class="dialog-content"/);
assert.match(home,/id="dialog-actions" class="dialog-actions"/);
assert(home.indexOf('id="dialog-content"') < home.indexOf('id="dialog-actions"'));
assert.match(app,/const actions = \$\('dialog-actions'\)/);
assert.match(app,/actions\.replaceChildren\(\)/);
assert.match(app,/actions\.prepend\(read\)/);
assert.match(app,/content\.scrollTop = 0/);
assert.match(css,/Mobile UI polish \(15 Nov 2026\)/);
assert.match(css,/height:100dvh;max-height:100vh;max-height:100dvh/);
assert.match(css,/env\(safe-area-inset-bottom\)/);
assert.match(css,/#issue-dialog \.dialog-content[\s\S]*?overflow-y:auto/);
assert.match(css,/#issue-dialog \.dialog-actions[\s\S]*?grid-template-columns/);
assert.match(css,/\.site-header \.head-nav a:nth-child\(n\)/);
assert.match(css,/\.hero-art \{height:166px/);
assert.match(galleryCss,/\.gallery-cover img \{object-fit:contain\}/);
assert.match(galleryCss,/\.gallery-grid \{gap:13px\}/);
assert.match(galleryApp,/classList\.toggle\('is-album-open', Boolean\(album\)\)/);
assert.match(gallery,/id="gallery-lightbox"/);
assert.match(reader,/St\.PageFlip|StPageFlip|PageFlip/);
console.log('PASS Mobile UI source contracts (not browser/device QA)');
