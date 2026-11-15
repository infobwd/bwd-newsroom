/* BWD Newsroom app-like browsing shell, no private data or tracking. */
(() => {
  'use strict';
  const isGallery=location.pathname.endsWith('/gallery.html');
  const tabs=Array.from(document.querySelectorAll('.app-bottom-nav [data-app-tab]'));
  const root=document.getElementById('app-home'),news=document.getElementById('news'),books=document.getElementById('books');
  function mark(tab){
    tabs.forEach(a=>{
      if(a.dataset.appTab===tab)a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
  }
  function updateActive(){
    if(isGallery){mark('gallery');return;}
    if(location.hash.startsWith('#issue=')){mark('news');return;}
    const threshold=innerHeight*.28;
    if(books && books.getBoundingClientRect().top<=threshold){mark('books');return;}
    if(news && news.getBoundingClientRect().top<=threshold){mark('news');return;}
    if(root){mark('home');}
  }
  // An app-like compact header reuses the existing navbar; it never replaces
  // native navigation or shifts search focus into a separate overlay.
  const appHeader=document.querySelector('.site-header');
  const mobileHeaderQuery=window.matchMedia('(max-width:630px)');
  function updateCompactHeader(){
    appHeader?.classList.toggle('is-app-compact',mobileHeaderQuery.matches&&window.scrollY>112);
  }
  let scrollFrame=0;
  window.addEventListener('scroll',()=>{
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{
      scrollFrame=0;updateActive();updateCompactHeader();
    });
  },{passive:true});
  window.addEventListener('hashchange',()=>requestAnimationFrame(updateActive));
  window.addEventListener('pageshow',()=>{updateActive();updateCompactHeader();});
  window.addEventListener('resize',()=>requestAnimationFrame(updateCompactHeader),{passive:true});
  updateActive();updateCompactHeader();

  const search=document.querySelector('.app-quick-search');
  search?.addEventListener('click',event=>{
    // Do not combine anchor navigation, smooth scrolling and asynchronous focus:
    // iOS Safari can zoom/pan a sub-16px search field during keyboard opening.
    // Keep focus synchronous within the tap, which also preserves iOS keyboard access.
    if(document.body.classList.contains('is-album-open'))return;
    const field=document.getElementById(isGallery?'gallery-search':'search');
    if(!field)return;
    event.preventDefault();
    const rootStyle=document.documentElement.style;
    const originalBehavior=rootStyle.scrollBehavior;
    rootStyle.scrollBehavior='auto';
    field.scrollIntoView({block:'start',behavior:'auto'});
    field.focus({preventScroll:true});
    rootStyle.scrollBehavior=originalBehavior;
  });
  const banner=document.getElementById('app-network-banner');
  const setOnline=()=>{if(banner)banner.hidden=navigator.onLine;};
  window.addEventListener('online',setOnline);
  window.addEventListener('offline',setOnline);
  setOnline();

  // Original select controls remain the single source of filter state and desktop UI.
  // The mobile dialog mirrors their options only while open; it never maintains a second catalogue.
  const filterForm=document.getElementById(isGallery?'gallery-filters':'filters');
  const filterTrigger=filterForm?.querySelector('.app-filter-trigger');
  const filterDialog=document.getElementById('app-filter-sheet');
  const filterIds=isGallery?['gallery-year','gallery-category']:['year','category','template'];
  const updateFilterCount=()=>{
    if(!filterTrigger)return;
    const count=filterIds.filter(id=>Boolean(document.getElementById(id)?.value)).length;
    const output=filterTrigger.querySelector('.app-filter-count');
    if(output){output.hidden=count===0;output.textContent=String(count);}
    filterTrigger.setAttribute('aria-label','ตัวกรอง'+(count?' ใช้อยู่ '+count+' รายการ':''));
  };
  filterTrigger?.addEventListener('click',()=>{
    if(!filterDialog||filterDialog.open||typeof filterDialog.showModal!=='function')return;
    const fields=document.getElementById('app-filter-fields');
    fields.replaceChildren();
    for(const id of filterIds){
      const original=document.getElementById(id);if(!original)continue;
      const label=document.createElement('label');
      label.textContent=original.getAttribute('aria-label')||'เลือกตัวกรอง';
      const select=document.createElement('select');
      select.setAttribute('aria-label',label.textContent);
      for(const option of original.options){
        const item=document.createElement('option');
        item.value=option.value;item.textContent=option.textContent;
        select.append(item);
      }
      select.value=original.value;
      select.addEventListener('change',()=>{
        original.value=select.value;
        original.dispatchEvent(new Event('change',{bubbles:true}));
        updateFilterCount();
      });
      label.append(select);fields.append(label);
    }
    filterDialog.showModal();
    fields.querySelector('select')?.focus();
  });
  document.getElementById('app-filter-close')?.addEventListener('click',()=>filterDialog?.close());
  document.getElementById('app-filter-apply')?.addEventListener('click',()=>filterDialog?.close());
  document.getElementById('app-filter-reset')?.addEventListener('click',()=>{
    filterForm?.reset();
    for(const originalId of filterIds){
      const original=document.getElementById(originalId);
      const i=filterIds.indexOf(originalId),copy=document.getElementById('app-filter-fields')?.querySelectorAll('select')[i];
      if(original&&copy)copy.value=original.value;
    }
    setTimeout(updateFilterCount,0);
  });
  filterDialog?.addEventListener('click',event=>{
    if(event.target===filterDialog)filterDialog.close();
  });
  filterForm?.addEventListener('change',updateFilterCount);
  filterForm?.addEventListener('reset',()=>setTimeout(updateFilterCount,0));
  updateFilterCount();


  const installButton=document.getElementById('app-install-button');
  const installGuide=document.getElementById('app-install-guide');
  const standalone=matchMedia('(display-mode: standalone)').matches || navigator.standalone===true;
  if(standalone && installGuide)installGuide.hidden=true;
  let deferredInstall=null;
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();deferredInstall=event;
    if(installButton && !standalone)installButton.hidden=false;
  });
  installButton?.addEventListener('click',async()=>{
    if(!deferredInstall)return;
    const prompt=deferredInstall;deferredInstall=null;installButton.hidden=true;
    await prompt.prompt();
  });
  window.addEventListener('appinstalled',()=>{if(installGuide)installGuide.hidden=true;});

  if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
  navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(reg=>{
    let updateShown=false;
    function notifyUpdate(){
      if(!reg.waiting||!navigator.serviceWorker.controller||updateShown)return;
      updateShown=true;
      const region=document.createElement('div');
      region.className='app-update-notice';
      region.setAttribute('role','status');
      region.textContent='มีเวอร์ชันใหม่ของ BWD Newsroom';
      const button=document.createElement('button');button.type='button';button.textContent='อัปเดต';
      region.append(button);document.body.append(region);
      let requested=false;
      button.addEventListener('click',()=>{
        if(document.querySelector('dialog[open]')){region.firstChild.textContent='ปิดหน้าที่กำลังอ่านก่อนอัปเดต';return;}
        requested=true;reg.waiting?.postMessage({type:'SKIP_WAITING'});
      });
      navigator.serviceWorker.addEventListener('controllerchange',()=>{if(requested)location.reload();},{once:true});
    }
    reg.addEventListener('updatefound',()=>{
      const worker=reg.installing;
      worker?.addEventListener('statechange',()=>{if(worker.state==='installed')notifyUpdate();});
    });
    notifyUpdate();
  }).catch(err=>console.warn('PWA registration unavailable',err));
})();
