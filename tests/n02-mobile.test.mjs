import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const context={window:{}};
vm.runInNewContext(read('assets/reader-geometry.js'),context);
const {layout}=context.window.BWDReaderGeometry;

const sizes=[
  {name:'iPhone 16 Pro Max portrait',stageWidth:428,stageHeight:710,viewportWidth:440,viewportHeight:955,portrait:true},
  {name:'small iPhone portrait',stageWidth:308,stageHeight:360,viewportWidth:320,viewportHeight:568,portrait:true},
  {name:'iPad portrait',stageWidth:744,stageHeight:845,viewportWidth:768,viewportHeight:1024,portrait:true},
  {name:'iPad landscape',stageWidth:1004,stageHeight:600,viewportWidth:1024,viewportHeight:768,portrait:false},
  {name:'desktop',stageWidth:1360,stageHeight:730,viewportWidth:1440,viewportHeight:900,portrait:false}
];
for(const input of sizes){
  const x=layout(input);
  assert.equal(x.portrait,input.portrait,input.name+' orientation');
  assert.ok(x.hostWidth<=input.stageWidth,input.name+' host fits viewport');
  assert.ok(x.hostHeight<=input.stageHeight,input.name+' host height fits');
  assert.ok(x.minWidth<=x.maxWidth,input.name+' page width range');
  assert.ok(x.pageHeight<=input.stageHeight,input.name+' A4 height');
  assert.ok(x.portrait?2*x.minWidth>x.hostWidth:2*x.minWidth<=x.hostWidth,input.name+' StPageFlip spread switch');
  assert.ok(x.flippingTime>=700&&x.flippingTime<=850,input.name+' paper turn speed');
}

const html=read('reader.html'),css=read('assets/reader.css'),js=read('assets/reader.js');
for(const id of ['flip-stage','flip-engine','scroll-stage','reader-toc-dialog','reader-toc-list','reader-zoom-in','reader-zoom-out','reader-fullscreen','reader-prev','reader-next','reader-info-dialog'])
  assert.ok(html.includes('id="'+id+'"'),'Missing '+id);
assert.ok(html.indexOf('reader-geometry.js')<html.indexOf('reader.js'),'Geometry must load first');
assert.ok(css.includes('100dvh')&&css.includes('env(safe-area-inset-bottom'),'Safe viewport height');
assert.ok(css.includes('@media(orientation:landscape)'),'Landscape spacing');
assert.ok(js.includes('stage.replaceChildren()'),'Re-create destroyed StPageFlip host');
assert.ok(js.includes('mobileScrollSupport:true'),'Vertical touch support');
assert.ok(js.includes('flippingTime:size.flippingTime'),'Geometry controls timing');
assert.ok(js.includes("pinch.zoom*distance(e.touches)/pinch.distance"),'Two finger zoom');
assert.ok(js.includes("window.matchMedia('(prefers-reduced-motion: reduce)')"),'Reduced motion fallback');
assert.ok(js.includes("status==='published'")&&js.includes('approved_version'),'Approved manifest gate');
assert.ok(!js.includes('api_key')&&!js.includes('private.googleapis.com'),'No browser secrets');
console.log('PASS N02-MOBILE: 5 viewport geometries, accessible controls and privacy guards');
