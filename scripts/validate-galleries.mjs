/* N01-G public Gallery validator; no private Drive source may be published.
   Usage: node scripts/validate-galleries.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GALLERY_ID = /^WDGAL-\d{4}-\d{4}$/;
const EVENT_ID = /^EVT-\d{4}-\d{4}$/;
const ISSUE_ID = /^WDNEWS-\d{4}-\d{4}$/;
const ALLOWED_CATEGORIES = new Set(['academic','activity','sports','community','administration','awards','other']);
const RECORD_KEYS = new Set([
  'gallery_id','event_id','title_th','date','description_th','category','tags','status',
  'approved_version','visibility_approved_at','published_at','cover_image','photos','linked_issue_ids'
]);
const PHOTO_KEYS = new Set(['photo_id','thumb_image','web_image','alt_th','caption_th','width','height','sha256']);
const SHA256 = /^[a-f0-9]{64}$/i;
const PHOTONAME = /^P\d{2,4}$/;

export function isRealISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value+'T00:00:00Z');
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10) === value;
}
export function isPublicGalleryAsset(value, galleryId) {
  return typeof value === 'string' && GALLERY_ID.test(galleryId || '') &&
    new RegExp('^assets/galleries/'+galleryId+'/[A-Za-z0-9_-]+(?:\\.[A-Za-z0-9_-]+)*\\.(?:webp|png|jpe?g)$','i').test(value) &&
    !value.includes('..');
}
function photoVersioned(asset, version) {
  const file=asset.split('/').at(-1);
  return file && new RegExp('[-_]'+version.replace(/[^\da-z]/gi,'')+'\\.(?:webp|png|jpe?g)$','i').test(file);
}
function timestamp(v) {return typeof v==='string' && !!v.trim() && Number.isFinite(Date.parse(v));}
function requiredText(value) {return typeof value === 'string' && value.trim().length > 0;}

export function validateGalleries(data, { root=ROOT, checkFiles=true, knownIssueIds=null }={}) {
  const errors=[];
  if(!data || data.schema_version!==1 || !isRealISODate(data.generated_at) || !Array.isArray(data.galleries))
    return ['Gallery catalogue requires schema_version=1, valid generated_at and galleries array'];
  const seen=new Set();
  for(const [index,g] of data.galleries.entries()){
    const at='galleries['+index+']';
    if(!g || typeof g!=='object' || Array.isArray(g)){errors.push(at+': record must be an object');continue;}
    for(const key of Object.keys(g))if(!RECORD_KEYS.has(key))errors.push(at+': forbidden/nonpublic key '+key);
    if(!GALLERY_ID.test(g.gallery_id||''))errors.push(at+': invalid Gallery ID');
    if(seen.has(g.gallery_id))errors.push(at+': duplicate Gallery ID');
    seen.add(g.gallery_id);
    if(!EVENT_ID.test(g.event_id||''))errors.push(at+': invalid event ID');
    if(!isRealISODate(g.date))errors.push(at+': invalid event date');
    if(isRealISODate(g.date)&&GALLERY_ID.test(g.gallery_id||'') &&
      Number(g.gallery_id.slice(6,10))!==Number(g.date.slice(0,4))+543)errors.push(at+': Gallery ID year differs from event date');
    if(isRealISODate(g.date)&&EVENT_ID.test(g.event_id||'') &&
      Number(g.event_id.slice(4,8))!==Number(g.date.slice(0,4))+543)errors.push(at+': event ID year differs from event date');
    if(g.status!=='published')errors.push(at+': only published/approved Gallery allowed in public index');
    for(const key of ['title_th','description_th'])if(!requiredText(g[key]))errors.push(at+': missing '+key);
    if(!ALLOWED_CATEGORIES.has(g.category))errors.push(at+': unknown category');
    if(!Array.isArray(g.tags)||!g.tags.every(t=>typeof t==='string'&&t.length<=80))errors.push(at+': invalid tags');
    if(!/^v\d{2,}$/.test(g.approved_version||''))errors.push(at+': invalid approved version');
    if(!timestamp(g.visibility_approved_at)||!timestamp(g.published_at))errors.push(at+': approval/published timestamps required');
    if(!Array.isArray(g.linked_issue_ids)||!g.linked_issue_ids.every(id=>ISSUE_ID.test(id)))errors.push(at+': invalid linked_issue_ids');
    else {
      if(new Set(g.linked_issue_ids).size!==g.linked_issue_ids.length)errors.push(at+': duplicate linked issue');
      if(knownIssueIds)for(const id of g.linked_issue_ids)if(!knownIssueIds.has(id))errors.push(at+': linked issue not published '+id);
    }
    if(!Array.isArray(g.photos)||!g.photos.length){errors.push(at+': public album has no photos');continue;}
    if(!isPublicGalleryAsset(g.cover_image,g.gallery_id))errors.push(at+': invalid cover path');
    const photoIds=new Set(), images=new Set();
    for(const [pidx,p] of g.photos.entries()){
      const atp=at+'.photos['+pidx+']';
      if(!p||typeof p!=='object'||Array.isArray(p)){errors.push(atp+': invalid photo record');continue;}
      for(const key of Object.keys(p))if(!PHOTO_KEYS.has(key))errors.push(atp+': forbidden/nonpublic key '+key);
      if(!PHOTONAME.test(p.photo_id||''))errors.push(atp+': invalid photo ID');
      if(photoIds.has(p.photo_id))errors.push(atp+': duplicate photo ID');
      photoIds.add(p.photo_id);
      for(const key of ['thumb_image','web_image']) {
        if(!isPublicGalleryAsset(p[key],g.gallery_id)){errors.push(atp+': invalid '+key);continue;}
        if(!photoVersioned(p[key],g.approved_version))errors.push(atp+': image file must include approved version');
        if(checkFiles&&!fs.existsSync(path.join(root,p[key])))errors.push(atp+': published asset not found '+p[key]);
      }
      if(images.has(p.web_image))errors.push(atp+': reused web image');
      images.add(p.web_image);
      if(!requiredText(p.alt_th))errors.push(atp+': missing alt text');
      if(p.caption_th!=null && (typeof p.caption_th!=='string'||p.caption_th.length>500))errors.push(atp+': invalid caption');
      if(!Number.isInteger(p.width)||p.width<=0||!Number.isInteger(p.height)||p.height<=0)errors.push(atp+': invalid reader dimensions');
      if(!SHA256.test(p.sha256||''))errors.push(atp+': invalid SHA-256');
    }
    if(!g.photos.some(p=>p && p.thumb_image===g.cover_image))errors.push(at+': cover must be one approved thumbnail');
  }
  return errors;
}

export function validateSourceParity(data,{root=ROOT}={}){
  const source=path.join(root,'data/galleries');
  if(!fs.existsSync(source))return data.galleries.length?['missing per-Gallery source records']:[] ;
  const files=fs.readdirSync(source).filter(x=>x.endsWith('.json')).sort();
  const records=[],errors=[];
  for(const file of files){
    try {
      const item=JSON.parse(fs.readFileSync(path.join(source,file),'utf8'));
      if(file!==item.gallery_id+'.json')errors.push('source filename mismatch: '+file);
      records.push(item);
    }catch(e){errors.push('cannot parse Gallery source '+file);}
  }
  const normalized=records.sort((a,b)=>b.date.localeCompare(a.date)||a.gallery_id.localeCompare(b.gallery_id));
  const indexed=[...data.galleries].sort((a,b)=>b.date.localeCompare(a.date)||a.gallery_id.localeCompare(b.gallery_id));
  if(JSON.stringify(normalized)!==JSON.stringify(indexed))errors.push('public galleries.json index differs from approved source JSON records');
  return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const data=JSON.parse(fs.readFileSync(path.join(ROOT,'data/galleries.json'),'utf8'));
  const issueCatalogue=JSON.parse(fs.readFileSync(path.join(ROOT,'data/catalog.json'),'utf8'));
  const knownIssueIds=new Set((issueCatalogue.issues||[])
    .filter(i=>i.status==='published'&&i.visibility_approved_at&&i.published_at).map(i=>i.id));
  const errors=[...validateGalleries(data,{knownIssueIds}),...validateSourceParity(data)];
  if(errors.length){console.error('FAIL N01-G Gallery validation:\n'+errors.map(e=>' - '+e).join('\n'));process.exitCode=1;}
  else console.log('PASS N01-G: '+data.galleries.length+' approved published Gallery album(s), source parity and asset paths');
}
