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
  let scrollFrame=0;
  window.addEventListener('scroll',()=>{
    if(scrollFrame)return;
    scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;updateActive();});
  },{passive:true});
  window.addEventListener('hashchange',()=>requestAnimationFrame(updateActive));
  window.addEventListener('pageshow',updateActive);
  updateActive();

  const search=document.querySelector('.app-quick-search');
  search?.addEventListener('click',()=>{
    const field=document.getElementById(isGallery?'gallery-search':'search');
    if(field && !document.body.classList.contains('is-album-open'))setTimeout(()=>field.focus({preventScroll:true}),0);
  });
  const banner=document.getElementById('app-network-banner');
  const setOnline=()=>{if(banner)banner.hidden=navigator.onLine;};
  window.addEventListener('online',setOnline);
  window.addEventListener('offline',setOnline);
  setOnline();

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
