/* BWD Newsroom N04-W: offline shell only, project-scoped. No media, PDF, Drive or catalogue cache. */
const VERSION='bwd-public-shell-2569-11-15-v11-share-v13';
const ROOT=self.registration.scope;
const SHELL=[
  './','./index.html','./gallery.html','./offline.html',
  './assets/styles.css','./assets/gallery.css','./assets/reader.css',
  './assets/app-shell.css','./assets/app-shell.js','./assets/loading.css','./assets/loading.js','./assets/share.js','./assets/app.js',
  './assets/gallery.js','./assets/ui-motion.js','./favicon.svg',
  './manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png',
  './icons/startup-1290x2796.png','./icons/startup-1179x2556.png','./icons/startup-1170x2532.png'
];
const PATHS=new Set(SHELL.map(p=>new URL(p,ROOT).pathname));
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(SHELL)));
  // Updates remain waiting until a user explicitly chooses "อัปเดต".
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith('bwd-public-shell-')&&name!==VERSION).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('message',event=>{
  if(event.data && event.data.type==='SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url),base=new URL(ROOT);
  if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
  // Never cache published catalogues, school/person photographs, issue pages, PDFs, or auth/upload.
  if(/\/data\/|\/assets\/(?:issues|galleries|books)\/|\.pdf(?:$|\?)/i.test(url.pathname))return;
  if(req.mode==='navigate'){
    // Reader is network-only; the offline fallback does not pretend to cache its pages.
    event.respondWith(fetch(req).catch(async()=>{
      const cache=await caches.open(VERSION);
      return cache.match('./offline.html');
    }));
    return;
  }
  if(PATHS.has(url.pathname)){
    event.respondWith((async()=>{
      const cache=await caches.open(VERSION);
      try{
        const live=await fetch(req);
        if(live.ok)await cache.put(req,live.clone());
        return live;
      }catch(_){return (await cache.match(req))||Response.error();}
    })());
  }
});
