/* N02: Validate published book manifests against approved immutable issue revisions. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const validBookImage=p=>typeof p==='string'&&/^assets\/(?:issues|books)\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+\.(?:webp|png|jpe?g)$/i.test(p)&&!p.includes('..');
const trueDate=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return false;const d=new Date(s+'T12:00:00+07:00');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s;};
export function validateBooks(data, catalog, options={}) {
  const errs=[];const checkFiles=options.checkFiles!==false;
  if(!data||data.schema_version!==1||!Array.isArray(data.books))return ['Invalid books schema_version or books array'];
  if(!catalog||catalog.schema_version!==1||!Array.isArray(catalog.issues))return ['Missing valid issue catalog'];
  const published=new Map(catalog.issues.filter(i=>i.status==='published'&&i.visibility_approved_at&&i.approved_version&&i.published_at).map(i=>[i.id,i]));
  const ids=new Set();
  for(const b of data.books){
    if(!b||typeof b!=='object'){errs.push('Non-object book');continue;}
    const id=String(b.id||'');
    if(!/^WDBOOK-\d{4}-(?:\d{2}[ABM]|Y|S[12])$/.test(id))errs.push(id+': invalid ID');
    if(ids.has(id))errs.push(id+': duplicate ID');ids.add(id);
    if(b.status!=='published'||!b.approved_at||!b.published_at||!b.revision)errs.push(id+': missing publication gate');
    if(typeof b.title_th!=='string'||!b.title_th.trim())errs.push(id+': missing title');
    if(!['biweekly','monthly','semester','annual'].includes(b.type))errs.push(id+': invalid period');
    if(!trueDate(b.date_start)||!trueDate(b.date_end)||b.date_start>b.date_end)errs.push(id+': invalid dates');
    if(!Array.isArray(b.contents)||b.contents.length===0)errs.push(id+': empty contents');
    else {const seen=new Set();for(const c of b.contents){
      if(!c||!c.issue_id||seen.has(c.issue_id)){errs.push(id+': duplicated/invalid content');continue;}
      seen.add(c.issue_id);const i=published.get(c.issue_id);
      if(!i||i.approved_version!==c.approved_version)errs.push(id+': non-approved issue revision '+c.issue_id);
      if(i&&(i.date<b.date_start||i.date>b.date_end))errs.push(id+': issue out of period '+c.issue_id);
    }}
    if(!Array.isArray(b.pages)||b.pages.length===0)errs.push(id+': empty pages');
    else b.pages.forEach((p,n)=>{if(!p||p.page_no!==n+1||!validBookImage(p.web_image)||typeof p.alt_th!=='string'||!p.alt_th.trim())errs.push(id+': invalid page '+(n+1));
      else if(checkFiles&&!fs.existsSync(path.join(root,p.web_image)))errs.push(id+': missing image '+p.web_image);
    });
  }
  return errs;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const books=JSON.parse(fs.readFileSync(path.join(root,'data/books.json'),'utf8'));
  const cat=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.json'),'utf8'));
  const problems=validateBooks(books,cat);
  if(problems.length){console.error('FAIL N02 book manifest:\n'+problems.join('\n'));process.exitCode=1;}
  else console.log('PASS N02 manifest ('+books.books.length+' published books)');
}
