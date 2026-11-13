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
      const image = document.createElement('img');
      image.src = new URL('./' + page.web_image, document.baseURI).href;
      image.alt = page.alt_th; image.loading = 'lazy'; image.decoding = 'async';
      const caption = textEl('figcaption', 'หน้า ' + page.page_no, 'dialog-image-label');
      figure.append(image, caption); images.append(figure);
    });
    content.append(images);
    const actions = textEl('div', '', 'dialog-actions');
    const driveLink = publicFileLink(issue.public_pdf_url);
    if (driveLink) {
      const a = textEl('a', 'เปิด PDF ต้นฉบับ ↗'); a.href = driveLink; a.target = '_blank'; a.rel = 'noopener noreferrer';
      actions.append(a);
    }
    const copy = textEl('button', 'คัดลอกลิงก์ข่าว'); copy.type = 'button';
    copy.addEventListener('click', async () => {
      const link = new URL(location.href); link.hash = 'issue=' + encodeURIComponent(issue.id);
      try { await navigator.clipboard.writeText(link.href); copy.textContent = 'คัดลอกแล้ว'; }
      catch (_) { copy.textContent = 'ไม่สามารถคัดลอกอัตโนมัติได้'; }
    });
    actions.append(copy); content.append(actions);
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
      buildFilters(); render(); routeHash();
    } catch (e) {
      console.error('BWD Newsroom catalog error', e);
      loadFailed = true; grid.setAttribute('aria-busy', 'false'); error.hidden = false;
      count.textContent = 'โหลดข้อมูลไม่สำเร็จ';
    }
  }
  init();
}());