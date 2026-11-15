/* BWD Newsroom N01 | Public approved-only catalogue. No credentials and no Drive API calls in browser. */
(function () {
  'use strict';
  const CATEGORY_NAMES = Object.freeze({
    academic: 'วิชาการ', activity: 'กิจกรรม', sports: 'กีฬา',
    community: 'ชุมชน', administration: 'บริหาร', awards: 'รางวัล',
    other: 'ทั่วไป'
  });
  const TEMPLATE_NAMES = Object.freeze({
    'WD-01': 'Classic Official', 'WD-02': 'Premium Magazine',
    'WD-03': 'Modern Minimal', 'WD-04': 'Photo Story',
    'WD-05': 'Special Event'
  });
  const $ = (id) => document.getElementById(id);
  const grid = $('news-grid'), empty = $('empty'), error = $('error');
  const search = $('search'), year = $('year'), category = $('category'), template = $('template');
  const count = $('result-count'), dialog = $('issue-dialog');
  let published = [];
  let loadFailed = false;

  function validAsset(path) {
    return typeof path === 'string' && /^assets\/issues\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+\.(?:png|jpe?g|webp)$/i.test(path) && !path.includes('..');
  }
  function validIssue(issue) {
    if (!issue || typeof issue !== 'object' || issue.status !== 'published') return false;
    if (!/^WDNEWS-\d{4}-\d{4}$/.test(issue.id || '') || !/^\d{4}-\d{2}-\d{2}$/.test(issue.date || '')) return false;
    const d = new Date(issue.date + 'T12:00:00+07:00');
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== issue.date) return false;
    if (typeof issue.title_th !== 'string' || !issue.title_th.trim()) return false;
    if (typeof issue.visibility_approved_at !== 'string' || !issue.visibility_approved_at) return false;
    if (typeof issue.approved_version !== 'string' || !issue.approved_version.trim()) return false;
    if (typeof issue.published_at !== 'string' || !issue.published_at) return false;
    if (!Object.hasOwn(TEMPLATE_NAMES, issue.template_code)) return false;
    return Array.isArray(issue.pages) && issue.pages.length > 0 &&
      issue.pages.every((p, i) => p.page_no === i + 1 && validAsset(p.web_image) && typeof p.alt_th === 'string' && p.alt_th.trim());
  }
  function dateThai(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Bangkok' }).format(new Date(Date.UTC(y, m - 1, d, 5)));
  }
  function textEl(tag, value, className) {
    const el = document.createElement(tag); el.textContent = value == null ? '' : String(value);
    if (className) el.className = className;
    return el;
  }
  function appendOptions(select, options) {
    select.replaceChildren(select.options[0]);
    options.forEach(([value, label]) => {
      const option = document.createElement('option'); option.value = value; option.textContent = label;
      select.append(option);
    });
  }
  function buildFilters() {
    const years = Array.from(new Set(published.map(x => String(Number(x.date.slice(0, 4)) + 543)))).sort((a, b) => Number(b) - Number(a));
    appendOptions(year, years.map(y => [y, 'พ.ศ. ' + y]));
    const cats = Array.from(new Set(published.map(x => x.category))).sort();
    appendOptions(category, cats.map(c => [c, CATEGORY_NAMES[c] || 'หมวดอื่น']));
    const templates = Array.from(new Set(published.map(x => x.template_code))).sort();
    appendOptions(template, templates.map(code => [code, code + ' · ' + TEMPLATE_NAMES[code]]));
  }
  function cardFor(issue) {
    const card = textEl('article', '', 'issue-card');
    const thumb = textEl('div', '', 'issue-thumb');
    const image = document.createElement('img');
    image.src = new URL('./' + issue.pages[0].web_image, document.baseURI).href;
    image.alt = issue.pages[0].alt_th; image.loading = 'lazy'; image.decoding = 'async';
    image.addEventListener('error', () => {
      image.remove();
      thumb.append(textEl('p', 'ไม่สามารถแสดงภาพฉบับนี้ได้', 'error'));
    }, { once: true });
    thumb.append(image);
    thumb.append(textEl('span', issue.template_code, 'tag'));
    const body = textEl('div', '', 'issue-card-body');
    body.append(textEl('time', dateThai(issue.date)));
    const heading = textEl('h3', issue.title_th);
    body.append(heading);
    body.append(textEl('p', issue.excerpt_th || 'อ่านจดหมายข่าวประชาสัมพันธ์ฉบับเต็ม'));
    const open = textEl('button', 'เปิดอ่านจดหมายข่าว ↗', 'issue-open'); open.type = 'button';
    open.setAttribute('aria-label', 'เปิดอ่าน ' + issue.title_th);
    open.addEventListener('click', () => openIssue(issue.id, true));
    body.append(open);
    card.append(thumb, body);
    return card;
  }
  function render() {
    if (loadFailed) return;
    const query = search.value.trim().normalize('NFC').toLocaleLowerCase('th');
    const items = published.filter(item => {
      const matchesText = !query || [item.title_th, item.excerpt_th, item.body_th, ...(item.tags || [])].join(' ').normalize('NFC').toLocaleLowerCase('th').includes(query);
      return matchesText && (!year.value || String(Number(item.date.slice(0, 4)) + 543) === year.value) &&
        (!category.value || item.category === category.value) &&
        (!template.value || item.template_code === template.value);
    });
    const fragment = document.createDocumentFragment();
    items.forEach(item => fragment.append(cardFor(item)));
    grid.replaceChildren(fragment);
    grid.setAttribute('aria-busy', 'false');
    count.textContent = 'พบ ' + items.length.toLocaleString('th-TH') + ' ฉบับ';
    empty.hidden = items.length > 0;
    if (!items.length) {
      $('empty-title').textContent = published.length ? 'ไม่พบจดหมายข่าวที่ตรงกับตัวกรอง' : 'ยังไม่มีจดหมายข่าวที่เผยแพร่';
      $('empty-description').textContent = published.length ? 'ลองเปลี่ยนคำค้นหา หรือกดล้างตัวกรองเพื่อดูข่าวทั้งหมด' : 'จดหมายข่าวจะปรากฏที่นี่เมื่อผ่านการตรวจทานและอนุมัติเรียบร้อยแล้ว';
    }
  }
  function publicFileLink(value) {
    if (typeof value !== 'string') return null;
    if (/^assets\/issues\/WDNEWS-\d{4}-\d{4}\/issue-v\d{2,}\.pdf$/.test(value))
      return new URL('./' + value, document.baseURI).href;
    try {
      const u = new URL(value);
      if (u.protocol !== 'https:') return null;
      if (u.hostname === 'drive.google.com' && /^\/file\/d\/[A-Za-z0-9_-]+\/view\/?$/.test(u.pathname)) return u.href;
      return null;
    } catch (_) { return null; }
  }
  function openIssue(id, updateHash) {
    const issue = published.find(x => x.id === id);
    if (!issue || !dialog || typeof dialog.showModal !== 'function') return;
    $('dialog-title').textContent = issue.title_th;
    $('dialog-meta').textContent = dateThai(issue.date) + ' · ' + (CATEGORY_NAMES[issue.category] || 'ข่าวโรงเรียน') + ' · ' + issue.template_code;
    const content = $('dialog-content');
    content.replaceChildren();
    if (issue.body_th) content.append(textEl('p', issue.body_th, 'dialog-issue-copy'));
    const images = textEl('div', '', 'dialog-images');
    issue.pages.forEach(page => {
      const figure = document.createElement('figure');
      figure.classList.add('bwd-page-pending');
      const image = document.createElement('img');
      image.src = new URL('./' + page.web_image, document.baseURI).href;
      image.alt = page.alt_th; image.loading = 'lazy'; image.decoding = 'async';
      image.addEventListener('load',()=>figure.classList.remove('bwd-page-pending'),{once:true});
      image.addEventListener('error',()=>{figure.classList.remove('bwd-page-pending');image.replaceWith(textEl('p','ภาพไม่พร้อมใช้งาน','app-dashboard-error'));},{once:true});
      const caption = textEl('figcaption', 'หน้า ' + page.page_no, 'dialog-image-label');
      figure.append(image, caption); images.append(figure);
    });
    content.append(images);
    const actions = $('dialog-actions');
    actions.replaceChildren();
    const more=document.createElement('details');more.className='dialog-share-more';
    const summary=textEl('summary','เพิ่มเติม · ดาวน์โหลด / คัดลอก','');
    more.append(summary);
    const moreOptions=textEl('div','','dialog-share-more-options');more.append(moreOptions);
    const driveLink = publicFileLink(issue.public_pdf_url);
    if (driveLink) {
      const localPdf = typeof issue.public_pdf_url === 'string' && /^assets\/issues\//.test(issue.public_pdf_url);
      const a = textEl('a', localPdf ? 'ดาวน์โหลด PDF ฉบับเต็ม' : 'เปิด PDF ต้นฉบับ ↗'); a.href = driveLink; a.target = '_blank'; a.rel = 'noopener noreferrer';
      if (localPdf) a.download = issue.id + '-' + issue.approved_version + '.pdf';
      moreOptions.append(a);
    }
    const shareKit=window.BWDShare;
    const status=textEl('p','','dialog-share-status');status.hidden=true;
    const report=(message)=>{status.textContent=message;status.hidden=!message;};
    let files=null;
    const photoShare=textEl('button','กำลังเตรียมภาพข่าว…','dialog-share-primary');
    photoShare.type='button';photoShare.disabled=true;
    photoShare.addEventListener('click',()=>{
      if(!files||!shareKit?.canShareFiles(files))return;
      try{
        const request=shareKit.shareFiles(issue,files);
        Promise.resolve(request).then(()=>report('เปิดการแชร์แล้ว โปรดตรวจข้อความและผู้รับใน LINE ก่อนส่ง'))
          .catch(err=>{if(err?.name!=='AbortError')report('แชร์ไฟล์ไม่สำเร็จ ลองใช้ปุ่มส่งข้อความเข้า LINE หรือดาวน์โหลดภาพ');});
      }catch(_){report('อุปกรณ์นี้ไม่รองรับการแชร์ไฟล์ กรุณาดาวน์โหลดภาพแทน');}
    });
    actions.append(photoShare);
    const line=textEl('button','คัดลอกข้อความ + เปิด LINE','dialog-line-action');
    line.type='button';
    line.addEventListener('click',()=>{
      if(!shareKit)return;
      // The LINE URL pre-fills the message even when clipboard permission is denied.
      const url=shareKit.lineTextUrl(issue);
      const navigate=()=>{window.location.assign(url);};
      shareKit.copyText(shareKit.message(issue)).then(navigate).catch(navigate);
    });
    actions.append(line);
    const downloadImage=textEl('button','ดาวน์โหลดภาพข่าว','dialog-image-download');
    downloadImage.type='button';downloadImage.disabled=true;
    downloadImage.addEventListener('click',()=>{if(files?.length)shareKit.downloadFile(files[0]);});
    moreOptions.append(downloadImage);
    const copy=textEl('button','คัดลอกข้อความ','dialog-copy-action');
    copy.type='button';
    copy.addEventListener('click',async()=>{
      if(!shareKit)return;
      try{await shareKit.copyText(shareKit.message(issue));report('คัดลอกข้อความข่าวแล้ว สามารถวางลงใน LINE ได้');}
      catch(_){report('ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาใช้ปุ่มเปิด LINE');}
    });
    moreOptions.append(copy);
    const read = textEl('a', 'อ่านแบบพลิกหน้า ↗', 'dialog-read');
    read.href = './reader.html?issue=' + encodeURIComponent(issue.id);
    actions.prepend(read);
    actions.append(more,status);
    if(shareKit){
      shareKit.prepareFiles(issue).then(result=>{
        files=result;
        downloadImage.disabled=!files.length;
        if(shareKit.canShareFiles(files)){
          photoShare.disabled=false;
          photoShare.textContent='แชร์ภาพข่าวพร้อมข้อความ';
          report('');
        }else{
          photoShare.textContent='อุปกรณ์ไม่รองรับแชร์ภาพโดยตรง';
          report('ยังดาวน์โหลดภาพและส่งข้อความเข้า LINE ได้');
        }
      }).catch(()=>{photoShare.textContent='เตรียมไฟล์ภาพไม่สำเร็จ';
        report('โหลดไฟล์ภาพไม่สำเร็จ กรุณาลองเมื่อออนไลน์หรือเปิด PDF');});
    }
    content.scrollTop = 0;
    if (!dialog.open) dialog.showModal();
    if (updateHash) history.pushState(null, '', '#issue=' + encodeURIComponent(issue.id));
  }
  function routeHash() {
    const hash = location.hash.slice(1);
    if (hash.startsWith('issue=')) {
      const id = decodeURIComponent(hash.slice(6));
      if (published.some(x => x.id === id)) openIssue(id, false);
    } else if (dialog.open) dialog.close();
  }
  function setupEvents() {
    [search, year, category, template].forEach(el => el.addEventListener(el === search ? 'input' : 'change', render));
    $('filters').addEventListener('reset', () => setTimeout(render, 0));
    $('dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      if (location.hash.startsWith('#issue=')) history.replaceState(null, '', location.pathname + location.search + '#news');
    });
    window.addEventListener('hashchange', routeHash);
    window.addEventListener('popstate', routeHash);
  }

  function renderBooks(data) {
    const node=$('books-list'), emptyNode=$('books-empty');if(!node||!emptyNode)return;
    const bookAsset=p=>typeof p==='string'&&/^assets\/(?:issues|books)\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+\.(?:png|jpe?g|webp)$/i.test(p)&&!p.includes('..');
    const books=Array.isArray(data?.books)?data.books.filter(b=>b&&b.status==='published'&&b.approved_at&&b.published_at&&
      typeof b.title_th==='string'&&b.title_th.trim()&&Array.isArray(b.contents)&&b.contents.length&&
      b.contents.every(c=>published.some(i=>i.id===c.issue_id&&i.approved_version===c.approved_version))&&
      Array.isArray(b.pages)&&b.pages.length&&b.pages.every((p,i)=>p.page_no===i+1&&bookAsset(p.web_image))):[];
    books.sort((a,b)=>String(b.date_end).localeCompare(String(a.date_end)));
    node.replaceChildren();
    books.forEach(b=>{
      const card=textEl('article','','books-card'),cover=textEl('div','','books-card-cover');
      const img=document.createElement('img');img.src=new URL('./'+b.pages[0].web_image,document.baseURI).href;
      img.alt=b.pages[0].alt_th||'ปกหนังสือ';img.loading='lazy';img.addEventListener('error',()=>{img.replaceWith(textEl('p','ภาพปกไม่พร้อมใช้งาน'));},{once:true});
      cover.append(img);const body=textEl('div','','books-card-body');
      body.append(textEl('h3',b.title_th),textEl('p',(b.contents.length)+' ข่าว · '+b.pages.length+' หน้า'));
      const open=textEl('a','เปิดอ่านแบบพลิกหน้า ↗');open.href='./reader.html?book='+encodeURIComponent(b.id);
      body.append(open);card.append(cover,body);node.append(card);
    });node.setAttribute('aria-busy','false');emptyNode.hidden=books.length>0;
  }

  /* Mobile dashboard previews are sourced exclusively from approved catalogues. */
  function renderAppHome() {
    const holder=$('app-latest-issue'); if(!holder)return;
    holder.replaceChildren();
    if(!published.length){holder.append(textEl('p','ยังไม่มีจดหมายข่าวที่เผยแพร่','app-loading'));return;}
    const issue=published[0], card=textEl('article','','app-featured-issue');
    const img=document.createElement('img');
    img.src=new URL('./'+issue.pages[0].web_image,document.baseURI).href;
    img.alt=issue.pages[0].alt_th;img.loading='lazy';img.decoding='async';
    img.addEventListener('error',()=>img.replaceWith(textEl('span','ภาพปกไม่พร้อมใช้งาน','app-loading')),{once:true});
    const body=textEl('div','','app-featured-issue-body');
    body.append(textEl('time',dateThai(issue.date)),textEl('h3',issue.title_th),textEl('p',issue.excerpt_th||'เปิดอ่านจดหมายข่าวฉบับเต็ม'));
    const open=textEl('button','เปิดอ่าน','');open.type='button';
    open.setAttribute('aria-label','เปิดอ่าน '+issue.title_th);
    open.addEventListener('click',()=>openIssue(issue.id,true));
    body.append(open);card.append(img,body);holder.append(card);
  }
  async function renderAppGalleries(){
    const holder=$('app-latest-galleries');if(!holder)return;
    try{
      const response=await fetch('./data/galleries.json',{cache:'no-store'});
      if(!response.ok)throw new Error('Gallery unavailable');
      const data=await response.json();
      if(data.schema_version!==1||!Array.isArray(data.galleries))throw new Error('Invalid Gallery catalogue');
      const albums=data.galleries.filter(g=>{
        if(!g||g.status!=='published'||!g.visibility_approved_at||!g.published_at||!g.approved_version||
          typeof g.title_th!=='string'||!g.title_th.trim()||typeof g.gallery_id!=='string'||
          !g.gallery_id.startsWith('WDGAL-')||!Array.isArray(g.photos)||!g.photos.length||
          typeof g.date!=='string'||g.date.length!==10||typeof g.cover_image!=='string')return false;
        const prefix='assets/galleries/'+g.gallery_id+'/';
        const filename=g.cover_image.slice(prefix.length);
        return g.cover_image.startsWith(prefix)&&!filename.includes('/')&&!filename.includes('..')&&
          ['.webp','.png','.jpg','.jpeg'].some(ext=>filename.toLowerCase().endsWith(ext))&&
          g.photos.some(p=>p&&p.thumb_image===g.cover_image);
      }).sort((a,b)=>b.date.localeCompare(a.date)||a.gallery_id.localeCompare(b.gallery_id)).slice(0,2);
      holder.replaceChildren();
      if(!albums.length){holder.append(textEl('p','ยังไม่มีอัลบั้มที่เผยแพร่','app-loading'));return;}
      albums.forEach(g=>{
        const link=textEl('a','','app-album-card');
        link.href='./gallery.html#album='+encodeURIComponent(g.gallery_id);
        link.setAttribute('aria-label','เปิดอัลบั้ม '+g.title_th);
        const img=document.createElement('img');
        img.src=new URL('./'+g.cover_image,document.baseURI).href;
        img.alt=(g.photos.find(p=>p.thumb_image===g.cover_image)||{}).alt_th||'ภาพปกกิจกรรม';
        img.loading='lazy';img.decoding='async';
        img.addEventListener('error',()=>img.replaceWith(textEl('span','ภาพไม่พร้อมใช้งาน','app-loading')),{once:true});
        link.append(img,textEl('strong',g.title_th),textEl('time',dateThai(g.date)));
        holder.append(link);
      });
    }catch(e){
      console.warn('App Gallery preview unavailable',e);
      holder.replaceChildren(textEl('p','ไม่สามารถโหลดอัลบั้มล่าสุดได้','app-dashboard-error'));
    }
  }
  async function init() {
    setupEvents();
    try {
      const response = await fetch('./data/catalog.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load catalog: ' + response.status);
      const catalogue = await response.json();
      if (catalogue.schema_version !== 1 || !Array.isArray(catalogue.issues)) throw new Error('Invalid catalog');
      const ids = new Set();
      published = catalogue.issues.filter(issue => {
        if (!validIssue(issue) || ids.has(issue.id)) return false;
        ids.add(issue.id); return true;
      }).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
      buildFilters(); render(); renderAppHome(); void renderAppGalleries(); routeHash();
      try {const bres=await fetch('./data/books.json',{cache:'no-store'});if(!bres.ok)throw new Error('Book manifest unavailable');const bdata=await bres.json();renderBooks(bdata);} catch(e) { console.warn('BWD bookshelf loading error',e);$('books-list')?.replaceChildren();$('books-list')?.setAttribute('aria-busy','false');$('books-empty').hidden=false; }
    } catch (e) {
      console.error('BWD Newsroom catalog error', e);
      loadFailed = true; grid.replaceChildren();grid.setAttribute('aria-busy', 'false'); error.hidden = false;
      count.textContent = 'โหลดข้อมูลไม่สำเร็จ';
      const home=$('app-latest-issue');if(home)home.replaceChildren(textEl('p','ไม่สามารถโหลดจดหมายข่าวล่าสุดได้','app-dashboard-error'));
      void renderAppGalleries();
      $('books-list')?.replaceChildren();$('books-list')?.setAttribute('aria-busy','false');$('books-empty').hidden=false;
    } finally { window.BWDLoading?.finishLaunch(); }
  }
  init();
}());