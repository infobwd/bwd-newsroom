/* N02 BWD Newsroom image flipbook reader. No private Drive requests or credentials. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const qs = new URLSearchParams(location.search);
  const isDemo = qs.get('demo') === '1';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = {pages: [], labels: [], current: 0, engine: null, mode: 'scroll', kind: '', id: ''};
  const imgPath = p => typeof p === 'string' && /^assets\/(?:issues|books)\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+\.(?:webp|png|jpe?g)$/i.test(p) && !p.includes('..');
  const validIssue = i => i && i.status === 'published' && i.visibility_approved_at && i.published_at && i.approved_version && Array.isArray(i.pages) && i.pages.length && i.pages.every((p,n) => p.page_no === n+1 && imgPath(p.web_image));
  const demo = [
    {title:'BWD NEWSROOM',body:'ตัวอย่างหน้าปกสำหรับทดสอบระบบพลิกหน้ากระดาษ',foot:'DEMO · ไม่ใช่จดหมายข่าวจริง'},
    {title:'เปิดอ่านอย่างเป็นธรรมชาติ',body:'บนคอมพิวเตอร์เปิดแบบหน้าคู่ บนโทรศัพท์ปรับเป็นหน้าเดียว',foot:'EXAMPLE / PAGE 01'},
    {title:'บันทึกทุกเรื่องราว',body:'ข่าวที่โรงเรียนอนุมัติแล้วจะถูกนำมาเรียงตามลำดับในหนังสือรวมเล่ม',foot:'EXAMPLE / PAGE 02'},
    {title:'อ่านได้หลายรูปแบบ',body:'พลิกหน้า ใช้ปุ่มลูกศร หรือเปลี่ยนเป็นโหมดอ่านแบบเลื่อนหน้า',foot:'EXAMPLE / PAGE 03'}
  ];
  const make = (tag, cls, value) => { const el=document.createElement(tag); if(cls) el.className=cls; if(value!==undefined) el.textContent=value; return el; };
  const urlImage = file => new URL('./'+file, document.baseURI).href;
  function makeDemoSheet(item, i) {
    const page=make('div','html-sheet'+(i===0?' demo-cover':''));
    page.append(make('small','',item.foot),make('div','demo-rule'),make('h2','',item.title),make('p','',item.body),make('small','','โรงเรียนบ้านวังด้ง · BWD NEWSROOM'));
    return page;
  }
  function setCurrent(n, updateUrl=true) {
    state.current=Math.max(0,Math.min(state.pages.length-1,n));
    byId('page-indicator').textContent=state.pages.length ? 'หน้า '+(state.current+1)+' / '+state.pages.length : 'ไม่มีหน้า';
    byId('reader-progress-fill').style.width=(state.pages.length ? ((state.current+1)/state.pages.length*100) : 0)+'%';
    byId('reader-prev').disabled=state.current===0;
    byId('reader-next').disabled=state.current>=state.pages.length-1;
    byId('reader-toc').value=String(state.current);
    if(updateUrl && state.pages.length) {const u=new URL(location.href);u.searchParams.set('page',String(state.current+1));history.replaceState(null,'',u);}
  }
  function buildToc() {
    const select=byId('reader-toc');select.replaceChildren();
    state.labels.forEach((label,i)=> {const option=make('option','',label);option.value=String(i);select.append(option);});
  }
  function scrollView() {
    const surface=byId('scroll-stage');surface.replaceChildren();
    state.pages.forEach((p,i)=> {
      const f=make('figure','scroll-page');f.id='reading-page-'+(i+1);
      if (isDemo) f.append(makeDemoSheet(demo[i],i));
      else {const img=make('img'); img.src=urlImage(p.web_image);img.alt=p.alt_th || 'หน้า '+(i+1);img.loading=i?'lazy':'eager';img.decoding='async';img.addEventListener('error',()=>{img.replaceWith(make('p','reader-message','ภาพหน้านี้ไม่สามารถโหลดได้'));},{once:true});f.append(img);}
      f.append(make('figcaption','','หน้า '+(i+1)));surface.append(f);
    });
  }
  function stopEngine() {if(state.engine){try{state.engine.destroy();}catch(_){} state.engine=null;}byId('flip-engine').replaceChildren();}
  function activate(mode) {
    const useFlip=mode==='flip' && window.St && typeof window.St.PageFlip==='function' && !reduced;
    state.mode=useFlip?'flip':'scroll';
    byId('mode-flip').setAttribute('aria-pressed',String(state.mode==='flip'));
    byId('mode-scroll').setAttribute('aria-pressed',String(state.mode==='scroll'));
    byId('flip-stage').hidden=state.mode!=='flip';
    byId('scroll-stage').hidden=state.mode!=='scroll';
    if(state.mode==='scroll'){stopEngine();setCurrent(state.current,false);return;}
    stopEngine();
    try{
      const stage=byId('flip-engine');
      const engine=new window.St.PageFlip(stage,{width:470,height:665,size:'stretch',minWidth:230,maxWidth:470,minHeight:326,maxHeight:665,showCover:true,usePortrait:true,mobileScrollSupport:false,swipeDistance:30,flippingTime:520,clickEventForward:false});
      engine.on('flip',e=>setCurrent(Number(e.data)||0));
      if(isDemo){const els=demo.map((p,i)=>makeDemoSheet(p,i));els.forEach(el=>stage.append(el));engine.loadFromHTML(els);}
      else engine.loadFromImages(state.pages.map(p=>urlImage(p.web_image)));
      state.engine=engine;
      if(state.current>0) engine.flip(state.current);
      setCurrent(state.current,false);
    }catch(e){
      console.error('BWD Reader flip initialization',e);
      state.mode='scroll';byId('flip-stage').hidden=true;byId('scroll-stage').hidden=false;
      byId('mode-flip').setAttribute('aria-pressed','false');byId('mode-scroll').setAttribute('aria-pressed','true');
      byId('reader-message').hidden=false;byId('reader-message').textContent='โหมดพลิกหน้าไม่พร้อมใช้งานบนอุปกรณ์นี้ กำลังแสดงแบบเลื่อนหน้าแทน';
      stopEngine();
    }
  }
  function jump(n) {
    const next=Math.max(0,Math.min(state.pages.length-1,n));
    if(state.mode==='flip' && state.engine) {state.engine.flip(next);setCurrent(next);}
    else {setCurrent(next);const el=byId('reading-page-'+(next+1));if(el)el.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});}
  }
  function setup() {
    byId('reader-prev').addEventListener('click',()=>jump(state.current-1));
    byId('reader-next').addEventListener('click',()=>jump(state.current+1));
    byId('reader-toc').addEventListener('change',e=>jump(Number(e.target.value)));
    byId('mode-scroll').addEventListener('click',()=>activate('scroll'));
    byId('mode-flip').addEventListener('click',()=>activate('flip'));
    document.addEventListener('keydown',e=>{
      if(e.altKey||e.ctrlKey||e.metaKey||['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName))return;
      if(e.key==='ArrowRight'){e.preventDefault();jump(state.current+1);}
      if(e.key==='ArrowLeft'){e.preventDefault();jump(state.current-1);}
    });
  }
  function ready(title,subtitle){
    byId('reader-title').textContent=title;
    byId('reader-subtitle').textContent=subtitle;
    const page=Number(qs.get('page')||'1');
    state.current=Number.isSafeInteger(page)?Math.max(0,Math.min(state.pages.length-1,page-1)):0;
    buildToc();scrollView();setCurrent(state.current,false);activate(reduced?'scroll':'flip');
  }
  function fail(message) {
    byId('reader-title').textContent='ไม่พบหนังสือที่เผยแพร่';
    byId('reader-subtitle').textContent='กลับไปที่ชั้นหนังสือเพื่อเลือกฉบับที่เปิดอ่านได้';
    byId('reader-message').textContent=message;byId('reader-message').hidden=false;
    byId('flip-stage').hidden=true;byId('scroll-stage').hidden=true;
    byId('reader-prev').disabled=true;byId('reader-next').disabled=true;
    byId('mode-flip').disabled=true;byId('mode-scroll').disabled=true;
  }
  async function init() {
    setup();
    if(isDemo){state.pages=demo.map((p,i)=>({page_no:i+1}));state.labels=demo.map((p,i)=>i===0?'หน้าปกทดลอง':p.title);ready('ทดลองอ่านแบบพลิกหน้ากระดาษ','ตัวอย่างระบบ N02 · ไม่ใช่จดหมายข่าวจริงหรือข่าวที่ได้รับอนุมัติ');return;}
    try {
      const [cr,br]=await Promise.all([fetch('./data/catalog.json',{cache:'no-store'}),fetch('./data/books.json',{cache:'no-store'})]);
      if(!cr.ok||!br.ok)throw new Error('catalog unavailable');
      const [catalog,bookData]=await Promise.all([cr.json(),br.json()]);
      if(catalog.schema_version!==1||!Array.isArray(catalog.issues)||bookData.schema_version!==1||!Array.isArray(bookData.books))throw new Error('invalid catalogs');
      const issues=catalog.issues.filter(validIssue);
      const issueId=qs.get('issue'), bookId=qs.get('book');
      if(issueId){
        const issue=issues.find(i=>i.id===issueId);
        if(!issue){fail('ยังไม่มีจดหมายข่าวฉบับนี้ในทะเบียนเผยแพร่');return;}
        state.pages=issue.pages;state.labels=issue.pages.map(p=>'หน้า '+p.page_no);ready(issue.title_th,'จดหมายข่าว · '+issue.template_code+' · '+issue.pages.length+' หน้า');return;
      }
      if(bookId){
        const book=bookData.books.find(b=>b.id===bookId&&b.status==='published'&&b.approved_at&&b.published_at&&Array.isArray(b.contents)&&b.contents.length&&Array.isArray(b.pages)&&b.pages.length&&b.pages.every((p,n)=>p.page_no===n+1&&imgPath(p.web_image))&&b.contents.every(c=>issues.some(i=>i.id===c.issue_id&&i.approved_version===c.approved_version)));
        if(!book){fail('เล่มนี้ยังไม่ได้รับอนุมัติให้เผยแพร่ หรือภาพบางหน้าไม่พร้อม');return;}
        state.pages=book.pages;state.labels=book.pages.map(p=>p.title_th||'หน้า '+p.page_no);ready(book.title_th,'หนังสือรวมเล่ม · '+book.pages.length+' หน้า');return;
      }
      fail('กรุณาเลือกจดหมายข่าวหรือหนังสือรวมเล่มจากคลังข่าว');
    }catch(e){console.error('BWD Reader data error',e);fail('โหลดทะเบียนหนังสือไม่สำเร็จ กรุณากลับมาลองใหม่');}
  }
  init();
})(); 
