/* BWD Notify synthetic DOM + public UI regression contracts.
 * These are not real iPhone Safari / PWA-device checks. */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

class FakeNode{
  constructor(tag,doc){
    this.tagName=tag;this.doc=doc;this.nodeType=1;this.parentNode=null;
    this.children=[];this.dataset={};this.attributes={};this.className='';
    this.eventHandlers=new Map();this.textContent='';this.isConnected=true;
    this.returnValue='';this.open=false;
    this.classList={
      contains:value=>this.className.split(/\s+/).includes(value),
      add:value=>{if(!this.classList.contains(value))this.className=(this.className+' '+value).trim();},
      toggle:(value,force)=>{
        const has=this.classList.contains(value),next=force===undefined?!has:Boolean(force);
        this.className=this.className.split(/\s+/).filter(x=>x&&x!==value).join(' ');
        if(next)this.classList.add(value);
        return next;
      }
    };
  }
  append(...elements){for(const el of elements){el.parentNode=this;this.children.push(el);}}
  remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(x=>x!==this);}this.parentNode=null;this.isConnected=false;}
  get lastChild(){return this.children.at(-1)||null;}
  get firstElementChild(){return this.children[0]||null;}
  setAttribute(key,val){this.attributes[key]=String(val);}
  addEventListener(name,handler){const handlers=this.eventHandlers.get(name)||[];handlers.push(handler);this.eventHandlers.set(name,handlers);}
  fire(name,extras={}){for(const h of this.eventHandlers.get(name)||[])h({type:name,target:this,relatedTarget:null,...extras});}
  contains(child){for(let current=child;current;current=current.parentNode)if(current===this)return true;return false;}
  querySelector(selector){
    const test=el=>selector.startsWith('.')?el.classList.contains(selector.slice(1)):selector.startsWith('#')?el.id===selector.slice(1):false;
    const walk=el=>{for(const child of el.children){if(test(child))return child;const found=walk(child);if(found)return found;}return null;};
    return walk(this);
  }
  focus(){this.doc.activeElement=this;}
  showModal(){this.open=true;}
  close(value=''){this.returnValue=value;this.open=false;this.fire('close');}
}
const doc={readyState:'complete',activeElement:null,createElement(tag){return new FakeNode(tag,this);}};
doc.body=new FakeNode('body',doc);doc.body.focus();const watchers={};
const timers=new Map();let nextTimer=1;
const host={
  document:doc,navigator:{onLine:true},
  addEventListener:(event,cb)=>{watchers[event]=cb;},
  setTimeout:(callback,delay)=>{const id=nextTimer++;timers.set(id,{callback,delay});return id;},
  clearTimeout:id=>timers.delete(id)
};
vm.runInNewContext(read('assets/notify.js'),{window:host,console});
const notify=host.BWDNotify;
assert.deepEqual(Object.keys(notify).sort(),['banner','confirm','dismissBanner','toast']);
notify.toast('คัดลอกข้อความสำเร็จ',{type:'success'});
assert.equal(doc.body.querySelector('.bwd-notify-toasts').children.length,1);
let first=doc.body.querySelector('.bwd-notify-toast');
assert.equal(first.attributes.role,'status');
assert.equal(first.querySelector('.bwd-notify-message').textContent,'คัดลอกข้อความสำเร็จ');
notify.toast('โหลดภาพผิดพลาด',{type:'error'});
assert.equal(doc.body.querySelector('.bwd-notify-toasts').children.length,2);
assert.equal(doc.body.querySelector('.bwd-notify-toast').attributes.role,'status');
notify.toast('แจ้งเตือนที่สาม',{type:'warning'});
assert.equal(doc.body.querySelector('.bwd-notify-toasts').children.length,2,'limit transient notifications to two');
const modal=doc.createElement('dialog');doc.body.append(modal);
notify.toast('แชร์ภาพไม่สำเร็จ',{mount:modal,type:'error'});
assert.equal(modal.querySelector('.bwd-notify-toast').attributes.role,'alert','error is announced in open dialog top layer');
notify.banner('network-offline','ออฟไลน์',{type:'warning'});
assert(doc.body.classList.contains('bwd-has-notify-banner'));
assert.equal(doc.body.querySelector('.bwd-notify-banners').children.length,1);
notify.banner('network-offline','ออฟไลน์อีกครั้ง',{type:'warning'});
assert.equal(doc.body.querySelector('.bwd-notify-banners').children.length,1,'banner ID is deduplicated');
assert(notify.dismissBanner('network-offline'));
assert(!doc.body.classList.contains('bwd-has-notify-banner'));
host.navigator.onLine=false;watchers.offline();
assert(doc.body.querySelector('.bwd-notify-banners'),'offline uses persistent notice');
host.navigator.onLine=true;watchers.online();
assert(!doc.body.querySelector('.bwd-notify-banners'),'online dismisses persistent notice');

const firstConfirm=notify.confirm({title:'ยืนยัน',message:'ต้องการดำเนินการต่อหรือไม่'});
let dialog=doc.body.querySelector('.bwd-notify-confirm');
assert(dialog?.open,'native custom dialog opens');
dialog.querySelector('.bwd-notify-confirm-cancel').fire('click');
assert.equal(await firstConfirm,false,'cancel never confirms');
const secondConfirm=notify.confirm({title:'ทดสอบยืนยัน'});
dialog=doc.body.querySelector('.bwd-notify-confirm');
dialog.querySelector('.bwd-notify-confirm-accept').fire('click');
assert.equal(await secondConfirm,true,'explicit accept confirms');
const thirdConfirm=notify.confirm({title:'Escape'});
doc.body.querySelector('.bwd-notify-confirm').close('cancel');
assert.equal(await thirdConfirm,false,'dismissed dialog never confirms');

const htmls=['index.html','gallery.html','reader.html'].map(read);
for(const html of htmls){
  assert(html.includes('./assets/notify.js'));
  assert(html.includes('./assets/notify.css'));
}
const [home,gallery,reader]=htmls;
assert(home.indexOf('assets/notify.js')<home.indexOf('assets/app-shell.js'));
assert(gallery.indexOf('assets/notify.js')<gallery.indexOf('assets/gallery.js'));
assert(reader.indexOf('assets/notify.js')<reader.indexOf('assets/reader.js'));
assert(!home.includes('id="app-network-banner"'));
assert(!gallery.includes('id="app-network-banner"'));
const app=read('assets/app.js'),galleryJs=read('assets/gallery.js'),readerJs=read('assets/reader.js'),shell=read('assets/app-shell.js');
assert.match(app,/window\.BWDNotify\.toast\(message/);
assert.match(app,/status\.hidden=!message \|\| Boolean\(window\.BWDNotify\)/);
assert.match(galleryJs,/window\.BWDNotify\?\.toast\(/);
assert.match(readerJs,/window\.BWDNotify\?\.toast\(/);
assert.match(shell,/window\.BWDNotify\?\.banner\('pwa-update'/);
assert.match(shell,/if\(reading\)/,'never force PWA reload while dialog is open');
assert.match(read('assets/notify.css'),/prefers-reduced-motion:reduce/);
assert.match(read('assets/notify.css'),/safe-area-inset-bottom/);
assert.doesNotMatch(read('assets/notify.js'),/innerHTML\s*=|window\.alert\(|window\.confirm\(/);
const sw=read('sw.js');
assert(Number(sw.match(/const VERSION='bwd-public-shell-2569-11-15-v(\d+)/)?.[1])>=17,'Notify remains in the updated PWA shell');
const precache=sw.slice(sw.indexOf('const SHELL='),sw.indexOf('const PATHS='));
assert(precache.includes("'./assets/notify.js'")&&precache.includes("'./assets/notify.css'"));
assert.doesNotMatch(precache,/assets\/issues\/|assets\/galleries\/|data\/|\.pdf/);
const ci=read('.github/workflows/static-qa.yml');
assert(ci.includes('node tests/bwd-notify.test.mjs'));
console.log('PASS BWD Notify toast/banner/confirm synthetic interactions and cross-page source contracts (not device QA)');
