import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateBooks,validBookImage} from '../scripts/validate-books.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const books=JSON.parse(fs.readFileSync(path.join(root,'data/books.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/catalog.json'),'utf8'));
assert.deepEqual(validateBooks(books,catalog),[]);
assert.ok(books.books.every(book => book.status === 'published' && book.approved_at && book.published_at && book.revision),
  'N02 public books must be approved published volumes; genuine approved books are allowed');
assert.equal(validBookImage('assets/books/WDBOOK-2569-11A/cover-v01.webp'),true);
assert.equal(validBookImage('https://drive.google.com/some-image'),false);
assert.equal(validBookImage('../private/cover.png'),false);
const issue={id:'WDNEWS-2569-0001',date:'2026-11-13',status:'published',visibility_approved_at:'yes',approved_version:'v01',published_at:'yes'};
const book={id:'WDBOOK-2569-11A',type:'biweekly',title_th:'หนังสือทดสอบ',date_start:'2026-11-01',date_end:'2026-11-15',status:'published',approved_at:'yes',published_at:'yes',revision:'v01',contents:[{issue_id:issue.id,approved_version:'v01'}],pages:[{page_no:1,web_image:'assets/books/WDBOOK-2569-11A/cover-v01.webp',alt_th:'ภาพปก'}]};
assert.deepEqual(validateBooks({schema_version:1,books:[book]},{schema_version:1,issues:[issue]},{checkFiles:false}),[]);
for(const wrong of [
  {...book,status:'draft'},
  {...book,contents:[{issue_id:issue.id,approved_version:'v99'}]},
  {...book,pages:[{...book.pages[0],page_no:2}]},
  {...book,pages:[{...book.pages[0],web_image:'https://drive.google.com/file'}]},
  {...book,date_start:'2026-11-16'},
]) assert.ok(validateBooks({schema_version:1,books:[wrong]},{schema_version:1,issues:[issue]},{checkFiles:false}).length>0);
const html=fs.readFileSync(path.join(root,'reader.html'),'utf8');
const js=fs.readFileSync(path.join(root,'assets/reader.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(html.includes('./vendor/page-flip.browser.min.js')&&html.includes('id="reader-toc"'));
assert.ok(js.includes('loadFromImages')&&js.includes('loadFromHTML')&&js.includes("qs.get('demo')"));
assert.ok(js.includes("status==='published'")&&js.includes('approved_version'));
assert.ok(index.includes('id="books-list"')&&index.includes('reader.html?demo=1'));
console.log('PASS N02 approved-only books, demo flipbook, self-hosted reader and regressions');
