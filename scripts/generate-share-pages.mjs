/* Per-issue LINE link previews for approved public BWD Newsroom issues.
   Usage: node scripts/generate-share-pages.mjs [--check] */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const h=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const site='https://infobwd.github.io/bwd-newsroom/';
function page(i){
const title=h(i.title_th+' | WD’NEWS โรงเรียนบ้านวังด้ง');
const desc=h(i.excerpt_th||'ข่าวประชาสัมพันธ์โรงเรียนบ้านวังด้ง');
const first=i.pages[0];const img=site+first.web_image;
const address=site+'share/'+i.id+'.html';
const goto='../#issue='+i.id;
return [
'<!doctype html>','<html lang="th">','<head>','  <meta charset="utf-8">',
'  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
'  <meta name="theme-color" content="#112b4e">',
'  <title>'+title+'</title>',
'  <meta name="description" content="'+desc+'">',
'  <link rel="canonical" href="'+address+'">',
'  <meta property="og:type" content="article">',
'  <meta property="og:url" content="'+address+'">',
'  <meta property="og:title" content="'+title+'">',
'  <meta property="og:description" content="'+desc+'">',
'  <meta property="og:image" content="'+img+'">',
'  <meta property="og:image:alt" content="'+h(first.alt_th)+'">',
'  <meta name="twitter:card" content="summary_large_image">',
'  <meta name="twitter:title" content="'+title+'">',
'  <meta name="twitter:description" content="'+desc+'">',
'  <meta name="twitter:image" content="'+img+'">',
'  <link rel="icon" href="../favicon.svg" type="image/svg+xml">',
'  <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f7fa;color:#112b4e;font:16px/1.7 system-ui,sans-serif;padding:24px;box-sizing:border-box}main{max-width:440px;text-align:center;background:white;border:1px solid #e0e6ee;border-radius:18px;padding:20px}img{max-width:100%;max-height:550px;object-fit:contain}h1{font-size:22px;line-height:1.35}p{color:#57687e}a{display:inline-block;background:#112b4e;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none}</style>',
'</head>','<body><main>',
'  <h1>'+h(i.title_th)+'</h1>',
'  <p>'+desc+'</p>',
'  <img src="../'+h(first.web_image)+'" alt="'+h(first.alt_th)+'">',
'  <p><a href="'+goto+'">เปิดอ่านจดหมายข่าวฉบับเต็ม</a></p>',
'</main>',
'<script>window.location.replace('+JSON.stringify(goto)+');</script>',
'</body>','</html>',''
].join('\n');
}
const data=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.json'),'utf8'));
if(data.schema_version!==1||!Array.isArray(data.issues))throw Error('Invalid catalog');
const valid=i=>Boolean(i&&i.status==='published'&&i.visibility_approved_at&&i.published_at&&
  /^WDNEWS-\d{4}-\d{4}$/.test(i.id||'')&&
  typeof i.title_th==='string'&&i.title_th.trim()&&
  typeof i.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(i.date)&&
  Array.isArray(i.pages)&&i.pages.length&&
  i.pages.every((p,n)=>p.page_no===n+1&&typeof p.web_image==='string'&&
    p.web_image.startsWith('assets/issues/'+i.id+'/')&&
    /^[A-Za-z0-9._-]+\.(?:webp|png|jpe?g)$/i.test(p.web_image.split('/').pop())&&
    !p.web_image.includes('..')));
if(!data.issues.every(valid))throw Error('Unapproved or invalid issue in public catalogue');
const dir=path.join(root,'share');const check=process.argv.includes('--check');
if(!check)fs.mkdirSync(dir,{recursive:true});
const expected=new Set();
for(const i of data.issues){
 const filename=i.id+'.html';expected.add(filename);const full=path.join(dir,filename);
 const html=page(i);
 if(check){if(!fs.existsSync(full)||fs.readFileSync(full,'utf8')!==html)throw Error('Share page drift: '+filename);}
 else fs.writeFileSync(full,html,'utf8');
}
if(check){
 const others=fs.readdirSync(dir).filter(x=>/^WDNEWS-\d{4}-\d{4}\.html$/.test(x));
 if(others.some(x=>!expected.has(x)))throw Error('Stale unpublished share page');
}
console.log('PASS share pages for '+data.issues.length+' approved published issue(s)');
