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
  let issueScrollY = null;
  let lastIssueInputWasPointer = false;
  let activeIssueRequest = 0;

  // iOS standalone Safari can rubber-band the page behind a native dialog.
  // Freeze it at its current scroll offset; restore that offset on every close path.
  function lockIssueBackground() {
    if (issueScrollY !== null) return;
    issueScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
    document.body.style.setProperty('--issue-locked-top', '-' + issueScrollY + 'px');
    document.documentElement.classList.add('issue-overlay-open');
    document.body.classList.add('issue-background-locked');
  }
  function unlockIssueBackground() {
    if (issueScrollY === null) return;
    const savedY = issueScrollY;
    issueScrollY = null;
    document.body.classList.remove('issue-background-locked');
    document.body.style.removeProperty('--issue-locked-top');
    document.documentElement.classList.remove('issue-overlay-open');
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, savedY);
    document.documentElement.style.scrollBehavior = previousBehavior;
  }

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
    const thumb = textEl('div', '', 'issue-thumb bwd-image-pending');
    const image = document.createElement('img');
    image.src = new URL('./' + issue.pages[0].web_image, document.baseURI).href;
    image.alt = issue.pages[0].alt_th; image.loading = 'lazy'; image.decoding = 'async';
    image.addEventListener('load',()=>thumb.classList.remove('bwd-image-pending'),{once:true});
    image.addEventListener('error', () => {
      thumb.classList.remove('bwd-image-pending');image.remove();
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
    const requestToken = ++activeIssueRequest;
    dialog.classList.remove('issue-title-collapsed');
    $('dialog-tools').open = false;
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
    // One persistent action at the bottom; secondary actions live in the header menu.
    const more=$('dialog-tools');
    const moreOptions=$('dialog-tools-options');
    moreOptions.replaceChildren();
    const driveLink = publicFileLink(issue.public_pdf_url);
    if (driveLink) {
      const localPdf = typeof issue.public_pdf_url === 'string' && /^assets\/issues\//.test(issue.public_pdf_url);
      const a = textEl('a', localPdf ? 'ดาวน์โหลด PDF ฉบับเต็ม' : 'เปิด PDF ต้นฉบับ ↗'); a.href = driveLink; a.target = '_blank'; a.rel = 'noopener noreferrer';
      if (localPdf) a.download = issue.id + '-' + issue.approved_version + '.pdf';
      moreOptions.append(a);
    }
    const shareKit=window.BWDShare;
    const status=textEl('p','','dialog-share-status');status.hidden=true;
    // Toasts are nonblocking and overlay the open native issue dialog.
    // Inline status remains a safe fallback if the shared notifier fails to load.
    const report=(message,type='info')=>{
      status.textContent=message;
      status.hidden=!message || Boolean(window.BWDNotify);
      if(message && window.BWDNotify)window.BWDNotify.toast(message,{
        type,mount:dialog,key:'issue-'+issue.id+'-'+message
      });
    };
    let files=null;
    const photoShare=textEl('button','กำลังเตรียมภาพข่าว…','dialog-share-primary');
    photoShare.type='button';photoShare.disabled=true;
    photoShare.addEventListener('click',()=>{
      if(!shareKit)return;
      if(files?.length && shareKit.canShareFiles(files)){
        try{
          // The native share request must stay inside the actual click gesture.
          const request=shareKit.shareFiles(issue,files);
          Promise.resolve(request).then(()=>report('ปิดหน้าต่างแชร์แล้ว โปรดตรวจสอบปลายทางก่อนส่ง','success'))
            .catch(err=>{if(err?.name!=='AbortError')report('แชร์ภาพไม่สำเร็จ ใช้เมนูเพิ่มเติมเพื่อเปิด LINE หรือดาวน์โหลดภาพได้','error');});
        }catch(_){report('แชร์ภาพไม่สำเร็จ ใช้เมนูเพิ่มเติมเพื่อดาวน์โหลดภาพได้','error');}
      }else{
        // Text-only fallback is explicit in the button label; never claim the image was attached.
        window.location.assign(shareKit.lineTextUrl(issue));
      }
    });
    const line=textEl('button','คัดลอกข้อความ + เปิด LINE','dialog-line-action');
    line.type='button';
    line.addEventListener('click',()=>{
      if(!shareKit)return;
      // The LINE URL pre-fills the message even when clipboard permission is denied.
      const url=shareKit.lineTextUrl(issue);
      const navigate=()=>{window.location.assign(url);};
      shareKit.copyText(shareKit.message(issue)).then(navigate).catch(navigate);
    });
    moreOptions.append(line);
    const downloadImage=textEl('button','ดาวน์โหลดภาพข่าว','dialog-image-download');
    downloadImage.type='button';downloadImage.disabled=true;
    downloadImage.addEventListener('click',()=>{if(files?.length)shareKit.downloadFile(files[0]);});
    moreOptions.append(downloadImage);
    const copy=textEl('button','คัดลอกข้อความ','dialog-copy-action');
    copy.type='button';
    copy.addEventListener('click',async()=>{
      if(!shareKit)return;
      try{await shareKit.copyText(shareKit.message(issue));report('คัดลอกข้อความข่าวแล้ว สามารถวางลงใน LINE ได้','success');}
      catch(_){report('ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาใช้ปุ่มเปิด LINE','error');}
    });
    moreOptions.append(copy);
    const read = textEl('a', 'อ่านแบบพลิกหน้า ↗', 'dialog-read');
    read.href = './reader.html?issue=' + encodeURIComponent(issue.id);
    moreOptions.prepend(read);
    actions.append(photoShare,status);
    if(shareKit){
      shareKit.prepareFiles(issue).then(result=>{
        if(requestToken!==activeIssueRequest)return; // Ignore a previous issue's async file result.
        files=result;
        downloadImage.disabled=!files.length;
        photoShare.disabled=false;
        photoShare.textContent=shareKit.canShareFiles(files)
          ? 'แชร์ภาพข่าวพร้อมข้อความ' : 'แชร์ข้อความข่าว (ไม่แนบภาพ)';
        report('');
      }).catch(()=>{
        if(requestToken!==activeIssueRequest)return;
        photoShare.disabled=false;
        photoShare.textContent='แชร์ข้อความข่าว (ไม่แนบภาพ)';
        report('');
      });
    }else{
      photoShare.textContent='ไม่สามารถเปิดการแชร์ได้';
    }
    content.scrollTop = 0;
    actions.scrollTop = 0;
    if (!dialog.open) {
      lockIssueBackground();
      try { dialog.showModal(); }
      catch (e) { unlockIssueBackground(); throw e; }
    }
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
    // Preserve keyboard focus while clearing touch-only Safari outlines on modal close.
    document.addEventListener('pointerdown',()=>{lastIssueInputWasPointer=true;},{passive:true});
    document.addEventListener('keydown',()=>{lastIssueInputWasPointer=false;});
    [search, year, category, template].forEach(el => el.addEventListener(el === search ? 'input' : 'change', render));
    $('filters').addEventListener('reset', () => setTimeout(render, 0));
    const issueContent=$('dialog-content'), issueTools=$('dialog-tools');
    const syncIssueHeading=()=>{
      dialog.classList.toggle('issue-title-collapsed',issueContent.scrollTop>72 && !issueTools.open);
    };
    issueContent.addEventListener('scroll',syncIssueHeading,{passive:true});
    issueTools.addEventListener('toggle',syncIssueHeading);
    dialog.addEventListener('keydown',e=>{
      if(e.key==='Escape' && issueTools.open){e.preventDefault();issueTools.open=false;}
    });
    dialog.addEventListener('click',e=>{
      if(issueTools.open && !issueTools.contains(e.target))issueTools.open=false;
    });
    $('dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      unlockIssueBackground();
      if (lastIssueInputWasPointer) {
        requestAnimationFrame(()=>{
          const active=document.activeElement;
          if (active?.closest?.('.app-latest-track')) active.blur();
        });
      }
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
      const card=textEl('article','','books-card'),cover=textEl('div','','books-card-cover bwd-image-pending');
      const img=document.createElement('img');img.src=new URL('./'+b.pages[0].web_image,document.baseURI).href;
      img.alt=b.pages[0].alt_th||'ปกหนังสือ';img.loading='lazy';
      img.addEventListener('load',()=>cover.classList.remove('bwd-image-pending'),{once:true});
      img.addEventListener('error',()=>{cover.classList.remove('bwd-image-pending');img.replaceWith(textEl('p','ภาพปกไม่พร้อมใช้งาน'));},{once:true});
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
    // "published" is approved-only and sorted newest first by init().
    const latest=published.slice(0,5);
    const track=textEl('div','','app-latest-track');
    track.tabIndex=0;
    track.setAttribute('role','region');
    track.setAttribute('aria-roledescription','carousel');
    track.setAttribute('aria-label','จดหมายข่าวล่าสุด ปัดซ้ายหรือขวาเพื่อดูฉบับถัดไป');
    const cards=[];
    latest.forEach((issue,index)=>{
      const card=textEl('a','','app-featured-issue');
      card.href='#issue='+encodeURIComponent(issue.id);
      card.setAttribute('aria-label','อ่านจดหมายข่าว '+(index+1)+' จาก '+latest.length+' '+issue.title_th);
      card.addEventListener('click',e=>{e.preventDefault();openIssue(issue.id,true);});
      const img=document.createElement('img');
      img.src=new URL('./'+issue.pages[0].web_image,document.baseURI).href;
      img.alt=issue.pages[0].alt_th;img.loading=index===0?'eager':'lazy';img.decoding='async';
      img.addEventListener('error',()=>img.replaceWith(textEl('span','ภาพปกไม่พร้อมใช้งาน','app-loading')),{once:true});
      const body=textEl('div','','app-featured-issue-body');
      body.append(textEl('time',dateThai(issue.date)),textEl('h3',issue.title_th),textEl('p',issue.excerpt_th||'เปิดอ่านจดหมายข่าวฉบับเต็ม'));
      body.append(textEl('span','เปิดอ่าน','app-card-open'));
      card.append(img,body);track.append(card);cards.push(card);
    });
    holder.append(track);
    if(cards.length===1)return;
    const controls=textEl('div','','app-carousel-controls');
    controls.setAttribute('role','group');
    controls.setAttribute('aria-label','เลือกจดหมายข่าวล่าสุด');
    const dots=latest.map((issue,index)=>{
      const dot=textEl('button','','app-carousel-dot');
      dot.type='button';
      dot.setAttribute('aria-label','ไปยังจดหมายข่าวที่ '+(index+1)+' '+issue.title_th);
      dot.addEventListener('click',()=>{pauseForInteraction();go(index);});
      controls.append(dot);
      return dot;
    });
    const position=textEl('span','1 / '+cards.length,'app-carousel-position visually-hidden');
    position.setAttribute('aria-live','off');
    const play=textEl('button','Ⅱ','app-carousel-play-toggle');
    play.type='button';
    play.setAttribute('aria-label','หยุดเลื่อนข่าวอัตโนมัติ');
    play.setAttribute('aria-pressed','false');
    controls.append(play,position);
    const currentIndex=()=>{
      let closest=0,distance=Infinity;
      cards.forEach((card,index)=>{
        const delta=Math.abs((card.offsetLeft-cards[0].offsetLeft)-track.scrollLeft);
        if(delta<distance){closest=index;distance=delta;}
      });
      return closest;
    };
    const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const AUTO_DELAY=5500, INTERACTION_PAUSE=9000;
    let autoTimer=0,resumeTimer=0,autoDirection=1;
    let inViewport=typeof IntersectionObserver==='undefined';
    let pausedByUser=false,manualDelay=false,hovered=false,keyboardFocus=false,pointerInput=false;
    const stopAuto=()=>{window.clearTimeout(autoTimer);autoTimer=0;};
    const allowedToAuto=()=>inViewport&&!document.hidden&&!dialog?.open&&!reducedMotion?.matches&&
      !pausedByUser&&!manualDelay&&!hovered&&!keyboardFocus;
    const updatePosition=()=>{
      const current=currentIndex();
      position.textContent=(current+1)+' / '+cards.length;
      dots.forEach((dot,index)=>{
        if(index===current)dot.setAttribute('aria-current','true');
        else dot.removeAttribute('aria-current');
      });
    };
    const go=(index)=>{
      const target=cards[Math.max(0,Math.min(cards.length-1,index))];
      track.scrollTo({
        left:target.offsetLeft-cards[0].offsetLeft,
        behavior:reducedMotion?.matches?'auto':'smooth'
      });
    };
    const scheduleAuto=()=>{
      stopAuto();
      if(!allowedToAuto())return;
      autoTimer=window.setTimeout(()=>{
        if(!allowedToAuto())return;
        let next=currentIndex()+autoDirection;
        if(next<0||next>=cards.length){autoDirection*=-1;next=currentIndex()+autoDirection;}
        go(next);scheduleAuto();
      },AUTO_DELAY);
    };
    const pauseForInteraction=()=>{
      manualDelay=true;stopAuto();
      window.clearTimeout(resumeTimer);
      resumeTimer=window.setTimeout(()=>{manualDelay=false;scheduleAuto();},INTERACTION_PAUSE);
    };
    play.addEventListener('click',()=>{
      pausedByUser=!pausedByUser;
      play.textContent=pausedByUser?'▶':'Ⅱ';
      play.setAttribute('aria-pressed',String(pausedByUser));
      play.setAttribute('aria-label',pausedByUser?'เริ่มเลื่อนข่าวอัตโนมัติ':'หยุดเลื่อนข่าวอัตโนมัติ');
      if(pausedByUser)stopAuto();
      else {manualDelay=false;window.clearTimeout(resumeTimer);scheduleAuto();}
    });
    // Manual swipes, dots and keyboard navigation defer autoplay.
    holder.addEventListener('pointerdown',()=>{pointerInput=true;pauseForInteraction();},{passive:true});
    holder.addEventListener('keydown',()=>{pointerInput=false;pauseForInteraction();});
    track.addEventListener('keydown',event=>{
      if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
        event.preventDefault();go(currentIndex()+(event.key==='ArrowRight'?1:-1));
      }
    });
    holder.addEventListener('focusin',()=>{
      if(!pointerInput){keyboardFocus=true;stopAuto();}
    });
    holder.addEventListener('focusout',()=>{
      window.setTimeout(()=>{
        if(!holder.contains(document.activeElement)){keyboardFocus=false;scheduleAuto();}
      },0);
    });
    holder.addEventListener('mouseenter',()=>{if(window.matchMedia?.('(hover: hover)').matches){hovered=true;stopAuto();}});
    holder.addEventListener('mouseleave',()=>{hovered=false;scheduleAuto();});
    let scheduled=false;
    track.addEventListener('scroll',()=>{
      if(scheduled)return;
      scheduled=true;
      requestAnimationFrame(()=>{scheduled=false;updatePosition();});
    },{passive:true});
    if(typeof IntersectionObserver!=='undefined'){
      const observer=new IntersectionObserver(entries=>{
        inViewport=entries[0]?.intersectionRatio>=0.45;
        if(inViewport)scheduleAuto();else stopAuto();
      },{threshold:[0,0.45,0.75]});
      observer.observe(track);
    }
    document.addEventListener('visibilitychange',scheduleAuto);
    dialog?.addEventListener('close',scheduleAuto);
    window.addEventListener('pagehide',stopAuto);
    window.addEventListener('pageshow',scheduleAuto);
    const syncMotion=()=>{play.hidden=Boolean(reducedMotion?.matches);scheduleAuto();};
    reducedMotion?.addEventListener?.('change',syncMotion);
    holder.append(controls);
    updatePosition();
    syncMotion();
  }
  // Only specifically reviewed wide shots from already approved PUBLIC galleries.
  // Never load a Drive original or an unapproved/gallery-draft image into the hero.
  const HERO_PHOTO_ALLOWLIST=Object.freeze({
    'WDGAL-2569-0002':['P01','P02','P11'],
    'WDGAL-2569-0001':['P01','P02','P03','P04']
  });
  function setWelcomeSessionPhoto(galleries){
    const welcome=document.querySelector('#app-home .app-welcome');
    if(!welcome||!Array.isArray(galleries))return;
    const candidates=[];
    galleries.forEach(g=>{
      if(!g||g.status!=='published'||!g.visibility_approved_at||
         !g.approved_version||!g.published_at||!Array.isArray(g.photos))return;
      if(!Object.hasOwn(HERO_PHOTO_ALLOWLIST,g.gallery_id))return;
      const allowed=HERO_PHOTO_ALLOWLIST[g.gallery_id];
      g.photos.forEach(photo=>{
        if(!photo||!allowed.includes(photo.photo_id)||typeof photo.alt_th!=='string'||!photo.alt_th.trim())return;
        const path=photo.thumb_image;
        if(typeof path!=='string')return;
        const prefix='assets/galleries/'+g.gallery_id+'/';
        if(!path.startsWith(prefix)||!/^photo[0-9]{2}-thumb-v[0-9]{2}\.webp$/.test(path.slice(prefix.length)))return;
        candidates.push(path);
      });
    });
    if(!candidates.length)return; // Keep navy gradient when no eligible public photo exists.
    candidates.sort();
    const SESSION_KEY='bwd-hero-photo-session-v1', LAST_KEY='bwd-hero-photo-last-v1';
    let selected='',previous='';
    try{
      selected=sessionStorage.getItem(SESSION_KEY)||'';
      previous=localStorage.getItem(LAST_KEY)||'';
    }catch(_){/* Storage may be disabled in private browsing. */}
    if(!candidates.includes(selected)){
      const available=candidates.filter(path=>path!==previous);
      const pool=available.length?available:candidates;
      selected=pool[Math.floor(Math.random()*pool.length)];
      try{
        sessionStorage.setItem(SESSION_KEY,selected);
        localStorage.setItem(LAST_KEY,selected);
      }catch(_){/* Nonpersistent fallback is a new choice per page load. */}
    }
    const asset=new URL('./'+selected,document.baseURI);
    // Load after approval/path validation: a missing thumbnail never replaces fallback.
    const preview=new Image();
    preview.onload=()=>{
      welcome.style.setProperty('--bwd-welcome-image','url("'+asset.href+'")');
      welcome.classList.add('has-approved-hero-photo');
    };
    preview.onerror=()=>{welcome.classList.remove('has-approved-hero-photo');};
    preview.src=asset.href;
  }

  async function renderAppGalleries(){
    const holder=$('app-latest-galleries');if(!holder)return;
    try{
      const response=await fetch('./data/galleries.json',{cache:'no-store'});
      if(!response.ok)throw new Error('Gallery unavailable');
      const data=await response.json();
      if(data.schema_version!==1||!Array.isArray(data.galleries))throw new Error('Invalid Gallery catalogue');
      setWelcomeSessionPhoto(data.galleries);
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