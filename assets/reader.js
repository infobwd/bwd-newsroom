/* N02-MOBILE | Immersive reader. Public approved-only manifests, no Drive credentials. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const qs = new URLSearchParams(location.search);
  const isDemo = qs.get('demo') === '1';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = {pages:[],labels:[],current:0,engine:null,mode:'scroll',zoom:1};
  const imgPath = p => typeof p==='string' && /^assets\/(?:issues|books)\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+\.(?:webp|png|jpe?g)$/i.test(p) && !p.includes('..');
  const validIssue = i => i && i.status==='published' && i.visibility_approved_at && i.published_at && i.approved_version && Array.isArray(i.pages) && i.pages.length && i.pages.every((p,n)=>p.page_no===n+1 && imgPath(p.web_image));
  const demo = [
    {title:'BWD NEWSROOM',body:'ตัวอย่างหน้าปกสำหรับทดสอบระบบพลิกหน้ากระดาษ',foot:'DEMO · ไม่ใช่จดหมายข่าวจริง'},
    {title:'เปิดอ่านอย่างเป็นธรรมชาติ',body:'บนคอมพิวเตอร์เปิดแบบหน้าคู่ บนโทรศัพท์ปรับเป็นหน้าเดียว',foot:'EXAMPLE / PAGE 01'},
    {title:'บันทึกทุกเรื่องราว',body:'ข่าวที่โรงเรียนอนุมัติแล้วจะถูกนำมาเรียงตามลำดับในหนังสือรวมเล่ม',foot:'EXAMPLE / PAGE 02'},
    {title:'อ่านได้หลายรูปแบบ',body:'พลิกหน้า ใช้ปุ่มลูกศร หรือเปลี่ยนเป็นโหมดอ่านแบบเลื่อนหน้า',foot:'EXAMPLE / PAGE 03'}
  ];
  const make=(tag,cls,value)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e;};
  const urlImage=file=>new URL('./'+file,document.baseURI).href;
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  let resizeTimer=null, scrollPending=false, pinch=null;

  function makeDemoSheet(item,i){
    const page=make('div','html-sheet'+(i===0?' demo-cover':''));
    page.append(make('small','',item.foot),make('div','demo-rule'),make('h2','',item.title),make('p','',item.body),make('small','','โรงเรียนบ้านวังด้ง · BWD NEWSROOM'));
    return page;
  }
  function updateTocCurrent(){
    byId('reader-toc').value=String(state.current);
    byId('reader-toc-list').querySelectorAll('button').forEach((b,i)=>{
      if(i===state.current)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
  }
  function setCurrent(n,updateUrl=true){
    if(!state.pages.length)return;
    state.current=clamp(Math.round(Number(n)||0),0,state.pages.length-1);
    byId('page-indicator').textContent=(state.current+1)+' / '+state.pages.length;
    byId('reader-progress-fill').style.width=((state.current+1)/state.pages.length*100)+'%';
    byId('reader-prev').disabled=state.current===0;
    byId('reader-next').disabled=state.current===state.pages.length-1;
    updateTocCurrent();
    if(updateUrl){const u=new URL(location.href);u.searchParams.set('page',String(state.current+1));history.replaceState(null,'',u);}
  }
  function buildToc(){
    const select=byId('reader-toc'),list=byId('reader-toc-list');
    select.replaceChildren();list.replaceChildren();
    state.labels.forEach((label,i)=>{
      const option=make('option','',label);option.value=String(i);select.append(option);
      const item=make('button','reader-toc-item',(i+1)+'. '+label);item.type='button';
      item.addEventListener('click',()=>{byId('reader-toc-dialog').close();jump(i);});
      list.append(item);
    });
  }
  function drawScroll(){
    const surface=byId('scroll-stage');surface.replaceChildren();
    state.pages.forEach((page,i)=>{
      const fig=make('figure','scroll-page');fig.id='reading-page-'+(i+1);
      if(isDemo)fig.append(makeDemoSheet(demo[i],i));
      else {
        const img=make('img');img.src=urlImage(page.web_image);img.alt=page.alt_th||'หน้า '+(i+1);img.loading=i?'lazy':'eager';img.decoding='async';
        img.addEventListener('error',()=>img.replaceWith(make('p','reader-message','ภาพหน้านี้ไม่สามารถโหลดได้')), {once:true});
        fig.append(img);
      }
      fig.append(make('figcaption','','หน้า '+(i+1)));
      surface.append(fig);
    });
  }
  function resetFlipHost(){
    const stage=byId('flip-stage');stage.replaceChildren();
    const host=make('div','flip-engine');host.id='flip-engine';stage.append(host);return host;
  }
  function stopEngine(){
    if(state.engine){try{state.engine.destroy();}catch(e){console.warn('Reader cleanup',e);}state.engine=null;}
    return resetFlipHost(); // StPageFlip.destroy() removes its block; never reuse a detached host.
  }
  function flipAvailable(){return !reduced && window.St && typeof window.St.PageFlip==='function' && window.BWDReaderGeometry;}
  function startFlip(){
    const stage=byId('flip-stage');
    const host=stopEngine();
    const size=window.BWDReaderGeometry.layout({
      stageWidth:stage.clientWidth-12,stageHeight:stage.clientHeight-12,
      viewportWidth:window.innerWidth,viewportHeight:window.innerHeight
    });
    host.style.width=size.hostWidth+'px';host.style.height=size.hostHeight+'px';
    const engine=new window.St.PageFlip(host,{
      width:470,height:665,size:'stretch',minWidth:size.minWidth,maxWidth:size.maxWidth,
      minHeight:size.minHeight,maxHeight:size.maxHeight,showCover:true,usePortrait:true,
      mobileScrollSupport:true,swipeDistance:35,flippingTime:size.flippingTime,
      drawShadow:true,maxShadowOpacity:0.45,showPageCorners:true,
      clickEventForward:false
    });
    engine.on('flip',e=>setCurrent(Number(e.data)||0));
    if(isDemo){
      const nodes=demo.map((page,i)=>makeDemoSheet(page,i));
      nodes.forEach(node=>host.append(node));
      engine.loadFromHTML(nodes);
    }else{
      engine.loadFromImages(state.pages.map(page=>urlImage(page.web_image)));
    }
    state.engine=engine;
    if(state.current>0)engine.turnToPage(state.current);
    setCurrent(state.current,false);
  }
  function setModeButtons(){
    byId('mode-flip').setAttribute('aria-pressed',String(state.mode==='flip'));
    byId('mode-scroll').setAttribute('aria-pressed',String(state.mode==='scroll'));
    byId('flip-stage').hidden=state.mode!=='flip';
    byId('scroll-stage').hidden=state.mode!=='scroll';
    byId('reader-hint').textContent=state.mode==='flip'
      ?'ลากมุมกระดาษเพื่อพลิกหน้า · ใช้ลูกศรซ้ายขวาได้'
      :'เลื่อนอ่านต่อเนื่อง · ซูมสองนิ้วหรือแตะสองครั้ง';
  }
  function scrollToCurrent(smooth=false){
    const surface=byId('scroll-stage'),fig=byId('reading-page-'+(state.current+1));
    if(!fig || surface.hidden)return;
    const delta=fig.getBoundingClientRect().top-surface.getBoundingClientRect().top;
    surface.scrollTo({top:surface.scrollTop+delta,behavior:smooth&&!reduced?'smooth':'auto'});
  }
  function activate(mode,{retainPosition=true}={}){
    if(!state.pages.length)return;
    if(mode==='flip' && !flipAvailable())mode='scroll';
    if(mode==='flip' && state.zoom>1)setZoom(1);
    if(state.mode==='flip')stopEngine();
    state.mode=mode==='flip'?'flip':'scroll';
    setModeButtons();
    byId('reader-message').hidden=true;
    if(state.mode==='scroll'){requestAnimationFrame(()=>scrollToCurrent(false));setCurrent(state.current,false);return;}
    try{startFlip();}
    catch(e){
      console.error('BWD Reader page flip error',e);
      stopEngine();state.mode='scroll';setModeButtons();
      byId('reader-message').textContent='อุปกรณ์นี้ยังไม่พร้อมสำหรับการพลิกหน้า กำลังแสดงแบบเลื่อนหน้าแทน';
      byId('reader-message').hidden=false;
      requestAnimationFrame(()=>scrollToCurrent(false));
    }
  }
  function jump(n){
    if(!state.pages.length)return;
    const next=clamp(n,0,state.pages.length-1);
    if(next===state.current)return;
    if(state.mode==='flip'&&state.engine)state.engine.flip(next);
    else{setCurrent(next);scrollToCurrent(true);}
  }
  function setZoom(next){
    state.zoom=clamp(Math.round(next*4)/4,1,2.5);
    if(state.zoom>1 && state.mode==='flip')activate('scroll');
    const value=Math.round(state.zoom*100);
    byId('reader-zoom-value').textContent=value+'%';
    byId('reader-zoom-out').disabled=state.zoom<=1;
    byId('reader-zoom-in').disabled=state.zoom>=2.5;
    const surface=byId('scroll-stage');
    surface.querySelectorAll('.scroll-page').forEach(fig=>{
      fig.style.width=value+'%';
      fig.style.maxWidth=Math.round(730*state.zoom)+'px';
    });
  }
  function currentByScroll(){
    if(state.mode!=='scroll'||!state.pages.length)return;
    const surface=byId('scroll-stage'),y=surface.getBoundingClientRect().top+22;
    let best=0,dist=Infinity;
    surface.querySelectorAll('.scroll-page').forEach((fig,i)=>{
      const top=fig.getBoundingClientRect().top,metric=Math.abs(top-y);
      if(metric<dist){best=i;dist=metric;}
    });
    if(best!==state.current)setCurrent(best);
  }
  function openSheet(id){const dialog=byId(id);if(!dialog.open)dialog.showModal();}
  function setup(){
    byId('reader-prev').addEventListener('click',()=>jump(state.current-1));
    byId('reader-next').addEventListener('click',()=>jump(state.current+1));
    byId('reader-toc').addEventListener('change',e=>{byId('reader-toc-dialog').close();jump(Number(e.target.value));});
    byId('reader-toc-open').addEventListener('click',()=>openSheet('reader-toc-dialog'));
    byId('reader-toc-close').addEventListener('click',()=>byId('reader-toc-dialog').close());
    byId('reader-info-open').addEventListener('click',()=>openSheet('reader-info-dialog'));
    byId('reader-info-close').addEventListener('click',()=>byId('reader-info-dialog').close());
    for(const id of ['reader-toc-dialog','reader-info-dialog']){
      const dialog=byId(id);
      dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    }
    byId('mode-scroll').addEventListener('click',()=>activate('scroll'));
    byId('mode-flip').addEventListener('click',()=>activate('flip'));
    byId('reader-zoom-in').addEventListener('click',()=>setZoom(state.zoom+0.25));
    byId('reader-zoom-out').addEventListener('click',()=>setZoom(state.zoom-0.25));
    const full=byId('reader-fullscreen');
    if(typeof document.documentElement.requestFullscreen!=='function')full.hidden=true;
    else{
      full.addEventListener('click',async()=>{
        try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
        catch(e){console.warn('Fullscreen not available',e);}
      });
      document.addEventListener('fullscreenchange',()=>full.setAttribute('aria-label',document.fullscreenElement?'ออกจากเต็มจอ':'เปิดเต็มจอ'));
    }
    document.addEventListener('keydown',e=>{
      if(e.altKey||e.ctrlKey||e.metaKey||byId('reader-toc-dialog').open||byId('reader-info-dialog').open||
        ['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName))return;
      if(e.key==='ArrowRight'){e.preventDefault();jump(state.current+1);}
      if(e.key==='ArrowLeft'){e.preventDefault();jump(state.current-1);}
    });
    const scroll=byId('scroll-stage');
    scroll.addEventListener('scroll',()=>{
      if(scrollPending)return;scrollPending=true;
      requestAnimationFrame(()=>{scrollPending=false;currentByScroll();});
    },{passive:true});
    scroll.addEventListener('dblclick',e=>{
      if(e.target.closest('.scroll-page')){e.preventDefault();setZoom(state.zoom===1?1.5:1);}
    });
    const distance=touches=>Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
    scroll.addEventListener('touchstart',e=>{if(e.touches.length===2)pinch={distance:distance(e.touches),zoom:state.zoom};},{passive:true});
    scroll.addEventListener('touchmove',e=>{
      if(pinch&&e.touches.length===2){if(e.cancelable)e.preventDefault();setZoom(pinch.zoom*distance(e.touches)/pinch.distance);}
    },{passive:false});
    scroll.addEventListener('touchend',e=>{if(e.touches.length<2)pinch=null;},{passive:true});
    byId('flip-stage').addEventListener('touchstart',e=>{
      if(e.touches.length===2){activate('scroll');setZoom(1.5);}
    },{passive:true});
    window.addEventListener('resize',()=>{
      if(state.mode!=='flip'||!state.engine)return;
      clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(state.mode==='flip')activate('flip');},160);
    });
  }
  function ready(title,subtitle){
    byId('reader-title').textContent=title;
    byId('reader-subtitle').textContent=subtitle;
    byId('reader-info-copy').textContent=title+' — '+subtitle;
    const page=Number(qs.get('page')||'1');
    state.current=Number.isSafeInteger(page)?clamp(page-1,0,state.pages.length-1):0;
    buildToc();drawScroll();setZoom(1);setCurrent(state.current,false);
    byId('mode-flip').disabled=!flipAvailable();
    activate(flipAvailable()?'flip':'scroll');
  }
  function fail(message){
    byId('reader-title').textContent='ยังไม่มีหนังสือที่เปิดอ่านได้';
    byId('reader-subtitle').textContent='กลับไปที่ชั้นหนังสือเพื่อเลือกฉบับที่ได้รับอนุมัติ';
    byId('reader-message').textContent=message;byId('reader-message').hidden=false;
    byId('flip-stage').hidden=true;byId('scroll-stage').hidden=true;
    ['reader-prev','reader-next','mode-flip','mode-scroll','reader-toc-open','reader-zoom-in','reader-zoom-out'].forEach(id=>byId(id).disabled=true);
  }
  async function init(){
    setup();
    if(isDemo){
      state.pages=demo.map((page,i)=>({page_no:i+1}));
      state.labels=demo.map((page,i)=>i===0?'หน้าปกทดลอง':page.title);
      ready('ทดลองอ่านแบบพลิกหน้ากระดาษ','DEMO · ตัวอย่างทดสอบ ไม่ใช่จดหมายข่าวจริงหรือข่าวที่ได้รับอนุมัติ');
      return;
    }
    try{
      const [cr,br]=await Promise.all([fetch('./data/catalog.json',{cache:'no-store'}),fetch('./data/books.json',{cache:'no-store'})]);
      if(!cr.ok||!br.ok)throw new Error('catalog unavailable');
      const [catalog,bookData]=await Promise.all([cr.json(),br.json()]);
      if(catalog.schema_version!==1||!Array.isArray(catalog.issues)||bookData.schema_version!==1||!Array.isArray(bookData.books))throw new Error('invalid catalogs');
      const issues=catalog.issues.filter(validIssue);
      const issueId=qs.get('issue'),bookId=qs.get('book');
      if(issueId){
        const issue=issues.find(i=>i.id===issueId);
        if(!issue){fail('ยังไม่มีจดหมายข่าวฉบับนี้ในทะเบียนเผยแพร่');return;}
        state.pages=issue.pages;state.labels=issue.pages.map(p=>'หน้า '+p.page_no);
        ready(issue.title_th,'จดหมายข่าว · '+issue.template_code+' · '+issue.pages.length+' หน้า');return;
      }
      if(bookId){
        const book=bookData.books.find(b=>b.id===bookId&&b.status==='published'&&b.approved_at&&b.published_at&&
          Array.isArray(b.contents)&&b.contents.length&&Array.isArray(b.pages)&&b.pages.length&&
          b.pages.every((p,n)=>p.page_no===n+1&&imgPath(p.web_image))&&
          b.contents.every(c=>issues.some(i=>i.id===c.issue_id&&i.approved_version===c.approved_version)));
        if(!book){fail('เล่มนี้ยังไม่ได้รับอนุมัติให้เผยแพร่ หรือภาพบางหน้าไม่พร้อม');return;}
        state.pages=book.pages;state.labels=book.pages.map(p=>p.title_th||'หน้า '+p.page_no);
        ready(book.title_th,'หนังสือรวมเล่ม · '+book.pages.length+' หน้า');return;
      }
      fail('กรุณาเลือกจดหมายข่าวหรือหนังสือรวมเล่มจากคลังข่าว');
    }catch(e){console.error('BWD Reader data error',e);fail('โหลดทะเบียนหนังสือไม่สำเร็จ กรุณาลองใหม่');}
  }
  init();
})();
