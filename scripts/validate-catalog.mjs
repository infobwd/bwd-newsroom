/* N01 static public catalog validator. Run: node scripts/validate-catalog.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ID = /^WDNEWS-\d{4}-\d{4}$/;
const ASSET = /^assets\/issues\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+\.(?:png|jpe?g|webp)$/i;
const TEMPLATE = new Set(['WD-01','WD-02','WD-03','WD-04','WD-05']);
const CATEGORY = new Set(['academic','activity','sports','community','administration','awards','other']);
const DIGIT_DATE = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE_MIMES = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const FORBIDDEN = /(?:\/\.\.|\\|\.\.\/|drive\.google\.com\/uc\?|canva\.com\/design\/|https?:\/\/)/i;

export function isRealDate(date) {
  if (typeof date !== 'string' || !DIGIT_DATE.test(date)) return false;
  const d = new Date(date + 'T00:00:00Z');
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === date;
}
export function validAsset(asset) {
  return typeof asset === 'string' && ASSET.test(asset) && !FORBIDDEN.test(asset) && !asset.includes('..');
}
export function validateCatalogue(data, { root = ROOT, checkFiles = true } = {}) {
  const errors = [];
  if (!data || data.schema_version !== 1 || !Array.isArray(data.issues)) return ['catalog requires schema_version=1 and issues array'];
  const ids = new Set();
  for (const [index, issue] of data.issues.entries()) {
    const at = 'issues[' + index + ']';
    if (!issue || typeof issue !== 'object') { errors.push(at + ': invalid issue'); continue; }
    if (!ID.test(issue.id || '')) errors.push(at + ': invalid stable issue id');
    if (ids.has(issue.id)) errors.push(at + ': duplicate issue id ' + issue.id);
    ids.add(issue.id);
    if (issue.status !== 'published') errors.push(at + ': public catalog cannot contain draft/unapproved content');
    if (!isRealDate(issue.date)) errors.push(at + ': invalid ISO date');
    if (isRealDate(issue.date) && ID.test(issue.id || '') && Number(issue.id.slice(7, 11)) !== Number(issue.date.slice(0, 4)) + 543) errors.push(at + ': ID year does not match Buddhist calendar date');
    for (const key of ['title_th', 'excerpt_th', 'visibility_approved_at', 'approved_version', 'published_at']) {
      if (typeof issue[key] !== 'string' || !issue[key].trim()) errors.push(at + ': missing ' + key);
    }
    if (!TEMPLATE.has(issue.template_code)) errors.push(at + ': unknown Canva template');
    if (!CATEGORY.has(issue.category)) errors.push(at + ': unknown category');
    if (!Array.isArray(issue.tags) || !issue.tags.every(x => typeof x === 'string' && x.length <= 80)) errors.push(at + ': tags must be array of short strings');
    if (!Array.isArray(issue.pages) || issue.pages.length < 1) { errors.push(at + ': missing pages'); continue; }
    for (const [pidx, p] of issue.pages.entries()) {
      const label = at + '.pages[' + pidx + ']';
      if (!p || p.page_no !== pidx + 1) errors.push(label + ': page order mismatch');
      if (!p || !validAsset(p.web_image)) { errors.push(label + ': invalid web image path'); continue; }
      if (typeof p.alt_th !== 'string' || !p.alt_th.trim()) errors.push(label + ': missing alt text');
      if (path.extname(p.web_image).toLowerCase() && !IMAGE_MIMES.has(path.extname(p.web_image).toLowerCase())) errors.push(label + ': invalid image type');
      if (checkFiles && !fs.existsSync(path.join(root, p.web_image))) errors.push(label + ': missing local web image');
    }
    if (issue.public_pdf_url) {
      let u; try { u = new URL(issue.public_pdf_url); } catch (_) { errors.push(at + ': invalid PDF link'); }
      if (u && !(u.protocol === 'https:' && u.hostname === 'drive.google.com' && /^\/file\/d\/[A-Za-z0-9_-]+\/view\/?$/.test(u.pathname))) errors.push(at + ': PDF link must be an explicitly approved Google Drive file view URL');
    }
    if (Object.hasOwn(issue, 'private_drive_folder_id') || Object.hasOwn(issue, 'original_drive_file_id')) errors.push(at + ': private Drive IDs belong in restricted operational records, not public JSON');
  }
  return errors;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalogue = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/catalog.json'), 'utf-8'));
  const errors = validateCatalogue(catalogue);
  if (errors.length) {
    console.error('FAILED: public catalog validation:\n' + errors.map(x => ' - ' + x).join('\n'));
    process.exitCode = 1;
  } else {
    console.log('PASS: N01 public catalog (' + catalogue.issues.length + ' approved published issues)');
  }
}
