/* iPhone issue overlay stability contracts: static checks, not physical Safari QA. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html'), app=read('assets/app.js');
const css=read('assets/styles.css'), loadCss=read('assets/loading.css');
const sw=read('sw.js'), ci=read('.github/workflows/static-qa.yml');
const open=app.slice(app.indexOf('  function openIssue('),app.indexOf('  function routeHash()'));
const events=app.slice(app.indexOf('  function setupEvents()'),app.indexOf('  function renderBooks('));
assert(open.length>1000&&events.length>200,'issue view and handlers exist');

// A screen-height modal uses the centre pane for vertical scrolling, not the footer.
assert.match(html,/id="dialog-content" class="dialog-content"/);
assert.match(html,/id="dialog-actions" class="dialog-actions"/);
assert.match(css,/height:100dvh;max-height:100vh;max-height:100dvh/);
assert.match(css,/#issue-dialog \.dialog-content\{[\s\S]*?overflow-y:auto/);
assert.match(css,/#issue-dialog \.dialog-actions\{[\s\S]*?grid-template-columns:minmax\(0,1fr\) 96px/);
assert.match(css,/#issue-dialog \.dialog-actions \.dialog-close-mobile\{[\s\S]*?grid-column:2;order:0;display:flex/);
assert.match(css,/#issue-dialog \.dialog-close\{display:none\}/,'no competing upper-right close on phone');
assert.match(css,/safe-area-inset-bottom/,'Home indicator clearance must remain');
assert.match(open,/actions\.append\(photoShare, closeMobile, status\)/);
assert.match(open,/closeMobile\.setAttribute\('aria-label', 'ปิดรายละเอียดข่าว'\)/);
assert.match(open,/closeMobile\.addEventListener\('click', \(\) => dialog\.close\(\)\)/);
assert.match(events,/\$\('dialog-close'\)\.addEventListener\('click', \(\) => dialog\.close\(\)\)/,'desktop close preserved');
assert.match(events,/if\(e\.key==='Escape' && issueTools\.open\)/,'Escape still dismisses header menu');

// The header must never jump between heights at an arbitrary scroll threshold.
assert.doesNotMatch(app,/issue-title-collapsed|syncIssueHeading/);
assert.doesNotMatch(events,/issueContent\.addEventListener\('scroll'/);
assert.match(css,/#issue-dialog \.dialog-top\{\s*flex:0 0 auto;\s*transition:none!important/);

// Reserve the A4-portrait shape before loading; avoid shimmer while reading text.
assert.match(open,/image\.width = 794; image\.height = 1123/);
assert.match(open,/image\.loading = pageIndex === 0 \? 'eager' : 'lazy'/);
assert.match(open,/image\.decoding = 'async'/);
assert.match(css,/#issue-dialog \.dialog-images \.bwd-page-pending:before\{[\s\S]*?animation:none!important/);
assert.match(css,/font-size:16px;line-height:1\.7/);
assert.match(loadCss,/@media\(prefers-reduced-motion:reduce\)/);
assert.match(css, /touch-action:pan-y/);
assert.match(app,/lockIssueBackground\(\)/);
assert.match(events,/unlockIssueBackground\(\)/);

// A fresh PWA shell version surfaces the fix without caching school photographs.
assert(Number(sw.match(/const VERSION='bwd-public-shell-2569-11-15-v(\d+)/)?.[1])>=18,'PWA shell retains mobile reading stability fix');
const shell=sw.slice(sw.indexOf('const SHELL='),sw.indexOf('const PATHS='));
assert(!/assets\/issues\/|assets\/galleries\/|data\/|\.pdf/.test(shell),'never precache public photo/PDF bytes');
assert.match(ci,/node tests\/issue-mobile-stability\.test\.mjs/);
console.log('PASS iPhone issue footer, stable header, A4 preload and readable text contracts (device QA NOT RUN)');
