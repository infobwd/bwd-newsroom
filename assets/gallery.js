/* BWD Newsroom N01-G: approved-only public Gallery. No private Drive endpoints or credentials. */
(function () {
  'use strict';
  const CATEGORY_NAMES = Object.freeze({
    academic: 'วิชาการ', activity: 'กิจกรรม', sports: 'กีฬา',
    community: 'ชุมชน', administration: 'บริหาร', awards: 'รางวัล', other: 'ทั่วไป'
  });
  const $ = id => document.getElementById(id);
  const section = $('gallery-list'), detail = $('album-view');
  const grid = $('gallery-grid'), empty = $('gallery-empty'), error = $('gallery-error');
  const search = $('gallery-search'), year = $('gallery-year'), category = $('gallery-category');
  const count = $('gallery-count'), lightbox = $('gallery-lightbox');
  let galleries = [];
  let issueIds = new Set();
  let currentAlbum = null;
  let currentPhoto = 0;
  let swipeStart = null;
  let loadFailed = false;

  function dateValid(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(s + 'T00:00:00Z');
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }
  function validPath(path, id) {
    return typeof path === 'string' &&
      new RegExp('^assets/galleries/' + id + '/[A-Za-z0-9_-]+(?:\\.[A-Za-z0-9_-]+)*\\.(?:webp|png|jpe?g)$', 'i').test(path) &&
      !path.includes('..');
  }
  function validGallery(g) {
    if (!g || typeof g !== 'object' || g.status !== 'published' ||
        !/^WDGAL-\d{4}-\d{4}$/.test(g.gallery_id || '') || !/^EVT-\d{4}-\d{4}$/.test(g.event_id || '') ||
        !dateValid(g.date) || Number(g.gallery_id.slice(6, 10)) !== Number(g.date.slice(0, 4)) + 543) return false;
    if (!['title_th','description_th','visibility_approved_at','approved_version','published_at']
      .every(k => typeof g[k] === 'string' && g[k].trim())) return false;
    if (!Object.hasOwn(CATEGORY_NAMES, g.category) || !Array.isArray(g.tags) ||
        !g.tags.every(t => typeof t === 'string' && t.length <= 80)) return false;
    if (!Array.isArray(g.photos) || !g.photos.length || !validPath(g.cover_image, g.gallery_id)) return false;
    const ids = new Set();
    for (const p of g.photos) {
      if (!p || typeof p.photo_id !== 'string' || !/^P\d{2,4}$/.test(p.photo_id) || ids.has(p.photo_id) ||
          !validPath(p.thumb_image, g.gallery_id) || !validPath(p.web_image, g.gallery_id) ||
          typeof p.alt_th !== 'string' || !p.alt_th.trim() ||
          typeof p.width !== 'number' || p.width < 1 || typeof p.height !== 'number' || p.height < 1 ||
          !/^[a-f0-9]{64}$/i.test(p.sha256 || '')) return false;
      ids.add(p.photo_id);
    }
    return g.photos.some(p => p.thumb_image === g.cover_image);
  }
  function textEl(tag, value, className) {
    const el = document.createElement(tag);
    el.textContent = value == null ? '' : String(value);
    if (className) el.className = className;
    return el;
  }
  function imgEl(path, alt, loading = 'lazy') {
    const el = document.createElement('img');
    el.src = new URL('./' + path, document.baseURI).href;
    el.alt = alt; el.loading = loading; el.decoding = 'async';
    el.addEventListener('error', () => el.replaceWith(textEl('span', 'ภาพไม่พร้อมใช้งาน', 'gallery-image-fallback')), { once: true });
    return el;
  }
  function dateThai(iso) {
    const [y,m,d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
      day:'numeric', month:'long', year:'numeric', timeZone:'Asia/Bangkok'
    }).format(new Date(Date.UTC(y,m-1,d,5)));
  }
  function optionsFor(el, values) {
    const placeholder = el.options[0];
    el.replaceChildren(placeholder);
    values.forEach(([value,label]) => {
      const opt = document.createElement('option');
      opt.value = value; opt.textContent = label; el.append(opt);
    });
  }
  function initFilters() {
    const years = Array.from(new Set(galleries.map(g => String(Number(g.date.slice(0,4))+543))))
      .sort((a,b) => Number(b)-Number(a));
    optionsFor(year, years.map(y => [y,'พ.ศ. '+y]));
    const cats = Array.from(new Set(galleries.map(g => g.category))).sort();
    optionsFor(category, cats.map(c => [c, CATEGORY_NAMES[c] || 'อื่น ๆ']));
  }
  function card(g) {
    const root = textEl('article', '', 'gallery-card');
    const cover = textEl('div', '', 'gallery-cover');
    const coverPhoto = g.photos.find(p => p.thumb_image === g.cover_image);
    cover.append(imgEl(g.cover_image, coverPhoto.alt_th));
    cover.append(textEl('span', String(g.photos.length) + ' ภาพ', 'gallery-pill'));
    const body = textEl('div', '', 'gallery-card-body');
    body.append(textEl('time', dateThai(g.date)), textEl('h3',g.title_th),
      textEl('p',g.description_th));
    const open = textEl('button','ชมภาพกิจกรรม ↗','gallery-open');
    open.type='button';open.setAttribute('aria-label','เปิดอัลบั้ม '+g.title_th);
    open.addEventListener('click', () => { location.hash='album='+encodeURIComponent(g.gallery_id); });
    body.append(open); root.append(cover,body);
    return root;
  }
  function renderList() {
    if (loadFailed) return;
    const term = search.value.trim().normalize('NFC').toLocaleLowerCase('th');
    const items = galleries.filter(g => {
      const text = [g.title_th,g.description_th,CATEGORY_NAMES[g.category],...(g.tags||[])]
        .join(' ').normalize('NFC').toLocaleLowerCase('th');
      return (!term || text.includes(term)) &&
        (!year.value || String(Number(g.date.slice(0,4))+543)===year.value) &&
        (!category.value || g.category === category.value);
    });
    const fragment = document.createDocumentFragment();
    items.forEach(g => fragment.append(card(g)));
    grid.replaceChildren(fragment);
    grid.setAttribute('aria-busy','false');
    count.textContent = 'พบ '+items.length.toLocaleString('th-TH')+' อัลบั้ม';
    empty.hidden = !!items.length;
    if (!items.length) {
      $('gallery-empty-title').textContent = galleries.length ?
        'ไม่พบอัลบั้มที่ตรงกับคำค้นหา' : 'ยังไม่มีอัลบั้มที่เผยแพร่';
      $('gallery-empty-description').textContent = galleries.length ?
        'ลองเปลี่ยนคำค้นหาหรือเลือกหมวดใหม่' :
        'ภาพกิจกรรมจะปรากฏที่นี่หลังโรงเรียนตรวจสอบและอนุมัติให้เผยแพร่';
    }
  }
  function renderAlbum(g) {
    currentAlbum = g;
    $('album-title').textContent = g.title_th;
    $('album-meta').textContent = dateThai(g.date)+' · '+(CATEGORY_NAMES[g.category]||'กิจกรรม')+
      ' · '+g.photos.length.toLocaleString('th-TH')+' ภาพ';
    $('album-description').textContent = g.description_th;
    const related = $('album-related');
    related.replaceChildren();
    (g.linked_issue_ids || []).filter(id => issueIds.has(id)).forEach(id => {
      const link = textEl('a', 'อ่านจดหมายข่าว '+id+' ↗');
      link.href='./#issue='+encodeURIComponent(id);
      related.append(link);
    });
    const fragment = document.createDocumentFragment();
    g.photos.forEach((p,i) => {
      const btn = textEl('button','','album-photo');
      btn.type='button';btn.setAttribute('aria-label','ดูภาพที่ '+(i+1)+' '+p.alt_th);
      btn.append(imgEl(p.thumb_image,p.alt_th));
      btn.append(textEl('span',p.caption_th || p.alt_th));
      btn.addEventListener('click', () => openPhoto(i));
      fragment.append(btn);
    });
    $('album-photos').replaceChildren(fragment);
    section.hidden=true;detail.hidden=false;
    window.scrollTo({top:0,behavior:'instant'});
  }
  function lightboxPhoto() {
    if (!currentAlbum || !currentAlbum.photos[currentPhoto]) return;
    const p = currentAlbum.photos[currentPhoto];
    const img=$('lightbox-image');
    img.src=new URL('./'+p.web_image,document.baseURI).href;
    img.alt=p.alt_th;
    $('lightbox-caption').textContent=p.caption_th || p.alt_th;
    $('lightbox-counter').textContent=(currentPhoto+1)+' / '+currentAlbum.photos.length;
    $('lightbox-prev').disabled=currentPhoto===0;
    $('lightbox-next').disabled=currentPhoto===currentAlbum.photos.length-1;
  }
  function openPhoto(i) {
    if (!currentAlbum || !lightbox || typeof lightbox.showModal!=='function') return;
    currentPhoto=i;lightboxPhoto();
    if (!lightbox.open) lightbox.showModal();
  }
  function movePhoto(delta) {
    if (!currentAlbum || !lightbox.open) return;
    const next=currentPhoto+delta;
    if (next>=0 && next<currentAlbum.photos.length) {
      currentPhoto=next;lightboxPhoto();
    }
  }
  function route() {
    const hash=location.hash.slice(1);
    let albumId='';
    if (hash.startsWith('album=')) {
      try {albumId=decodeURIComponent(hash.slice(6));} catch (_) { albumId=''; }
    }
    const album=galleries.find(g => g.gallery_id===albumId);
    if (lightbox.open) lightbox.close();
    if (album) renderAlbum(album);
    else {currentAlbum=null;detail.hidden=true;section.hidden=false;}
  }
  async function init() {
    search.addEventListener('input',renderList);
    year.addEventListener('change',renderList);
    category.addEventListener('change',renderList);
    $('gallery-filters').addEventListener('reset',()=>setTimeout(renderList,0));
    $('lightbox-close').addEventListener('click',()=>lightbox.close());
    $('lightbox-prev').addEventListener('click',()=>movePhoto(-1));
    $('lightbox-next').addEventListener('click',()=>movePhoto(1));
    lightbox.addEventListener('keydown', e => {
      if (e.key==='ArrowLeft') {e.preventDefault();movePhoto(-1);}
      if (e.key==='ArrowRight') {e.preventDefault();movePhoto(1);}
    });
    lightbox.addEventListener('touchstart',e=>{
      if(e.touches.length===1)swipeStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
    },{passive:true});
    lightbox.addEventListener('touchend',e=>{
      if(!swipeStart||!e.changedTouches.length)return;
      const dx=e.changedTouches[0].clientX-swipeStart.x,dy=e.changedTouches[0].clientY-swipeStart.y;
      swipeStart=null;
      if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)movePhoto(dx<0?1:-1);
    },{passive:true});
    window.addEventListener('hashchange',route);
    window.addEventListener('popstate',route);
    try {
      const response=await fetch('./data/galleries.json',{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();
      if(data.schema_version!==1||!Array.isArray(data.galleries))throw new Error('Invalid Gallery catalogue');
      const seen=new Set();
      galleries=data.galleries.filter(g=>{
        if(!validGallery(g)||seen.has(g.gallery_id))return false;
        seen.add(g.gallery_id);return true;
      }).sort((a,b)=>b.date.localeCompare(a.date)||a.gallery_id.localeCompare(b.gallery_id));
      try {
        const issues=await fetch('./data/catalog.json',{cache:'no-store'});
        if(issues.ok) {
          const publicData=await issues.json();
          if(Array.isArray(publicData.issues)) {
            issueIds=new Set(publicData.issues.filter(i=>i.status==='published'&&i.visibility_approved_at&&i.published_at)
              .map(i=>i.id));
          }
        }
      }catch (_) { /* Gallery remains browsable without issue crosslinks. */ }
      initFilters();renderList();route();
    }catch(e){
      console.error('Gallery catalogue unavailable',e);
      loadFailed=true;grid.setAttribute('aria-busy','false');
      error.hidden=false;empty.hidden=true;count.textContent='โหลดข้อมูลไม่สำเร็จ';
    }
  }
  init();
}());