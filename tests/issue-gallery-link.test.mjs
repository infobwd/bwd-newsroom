/* WD'NEWS issue -> approved Gallery CTA (source + synthetic mapping tests).
 * This cannot establish real iOS Safari history/BFCache visual behavior. */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const app=read('assets/app.js'),styles=read('assets/styles.css');
const galleryJs=read('assets/gallery.js'),worker=read('sw.js');
const workflow=read('.github/workflows/static-qa.yml');
const catalogue=JSON.parse(read('data/catalog.json'));
const galleryCatalogue=JSON.parse(read('data/galleries.json'));
const start=app.indexOf('  function approvedIssueGalleryLinks(');
const end=app.indexOf('  function rememberGalleryReturn(',start);
assert(start>0 && end>start,'approved-only Gallery resolver should exist');
const resolver=vm.runInNewContext(app.slice(start,end)+'\napprovedIssueGalleryLinks;');
const issues=catalogue.issues,galleries=galleryCatalogue.galleries;
const links=resolver(galleries,issues);
assert.equal(links.size,2,'both existing approved news issues should link to existing Gallery');
assert.equal(links.get('WDNEWS-2569-0002')?.[0]?.id,'WDGAL-2569-0002');
assert.equal(links.get('WDNEWS-2569-0002')?.[0]?.count,11);
assert.equal(links.get('WDNEWS-2569-0001')?.[0]?.id,'WDGAL-2569-0001');
assert.equal(links.get('WDNEWS-2569-0001')?.[0]?.count,5);

// Fail closed when either side is draft, unpublished, unapproved or unlinked.
const g=galleries[0], issue=issues.find(item=>g.linked_issue_ids?.includes(item.id));
assert.ok(issue,'fixture must choose an existing news issue linked by the approved gallery');
for(const patch of [
  {status:'draft'}, {visibility_approved_at:''}, {approved_version:''},
  {published_at:''}, {linked_issue_ids:[]}, {linked_issue_ids:['WDNEWS-2569-9999']},
  {gallery_id:'../private'}, {photos:[]}
]){
  const invalid=resolver([{...g,...patch}],issues);
  assert.equal(invalid.size,0,'gallery patch should not produce public CTA: '+JSON.stringify(patch));
}
for(const patch of [
  {status:'draft'},{visibility_approved_at:''},{approved_version:''},{published_at:''}
]){
  assert.equal(resolver([g],[{...issue,...patch}]).size,0,'unapproved issue must not produce CTA');
}
assert.equal(resolver([g,g],issues).get(issue.id).length,1,'duplicate album not repeated');
assert.equal(resolver([],issues).size,0,'no gallery means no link');
assert.equal(resolver(null,issues).size,0,'invalid response means no link');

// Link is directly after the image/caption and before the Thai body text.
const open=app.slice(app.indexOf('  function openIssue('),app.indexOf('  function routeHash()'));
const imageAppend=open.indexOf('content.append(images,gallerySlot)');
const linkRender=open.indexOf('renderIssueGalleryLinks(gallerySlot,issue.id)');
const bodyAppend=open.indexOf('content.append(bodyCopy)');
assert(imageAppend>0 && linkRender>imageAppend && bodyAppend>linkRender,'CTA must follow page images before copy');
assert.match(app,/renderIssueGalleryLinks\(slot,dialog\.dataset\.issueId\)/,'async catalogue refreshes any open issue');
assert.match(app,/approvedGalleriesByIssue = approvedIssueGalleryLinks\(data\.galleries,published\)/);
assert.match(app,/link\.href = '\.\/gallery\.html#album=' \+ encodeURIComponent\(g\.id\)/);
assert.match(app,/link\.setAttribute\('aria-label','ชมภาพกิจกรรมทั้งหมด '/);
assert.match(app,/dialog-gallery-icon/);
assert.match(styles,/#issue-dialog \.dialog-gallery-link\{[\s\S]*?min-height:66px/);
assert.match(styles,/#issue-dialog \.dialog-gallery-link:focus-visible/);
assert.match(styles,/#issue-dialog \.dialog-gallery-links:empty\{display:none\}/);
assert.match(styles,/#issue-dialog \.dialog-gallery-links\{order:1/);
assert.match(styles,/#issue-dialog \.dialog-issue-copy\{order:2/);

// Return fallback is guarded session-only, not new public content or a URL token.
assert.match(app,/const RETURN_TO_ISSUE_KEY = 'bwd-issue-gallery-return-v1'/);
assert.match(app,/link\.addEventListener\('click',\(\)=>rememberGalleryReturn\(issueId\)\)/);
assert.match(app,/scrollTop:\$\('dialog-content'\)\.scrollTop/);
assert.match(open,/else restoreGalleryReturn\(issue\.id,content\)/);
assert.match(app,/window\.addEventListener\('pageshow',event=>/);
assert.match(app,/if\(event\.persisted && dialog\.open\)/);
assert.match(galleryJs,/hash\.startsWith\('album='\)/);
assert.match(galleryJs,/link\.href='\.\/#issue='\+encodeURIComponent\(id\)/);

// Installed app gets a new cache, but no source photos or catalogues in shell.
assert.match(worker,/v19-issue-gallery-cta/);
const shell=worker.slice(worker.indexOf('const SHELL='),worker.indexOf('const PATHS='));
assert.doesNotMatch(shell,/assets\/issues\/|assets\/galleries\/|data\/|\.pdf/);
assert.match(workflow,/node tests\/issue-gallery-link\.test\.mjs/);
console.log('PASS approved-only issue Gallery links, image-first placement and return contracts (device QA NOT RUN)');
