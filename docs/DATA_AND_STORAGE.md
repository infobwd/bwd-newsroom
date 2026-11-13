# BWD Newsroom — Data Contract & Storage (2569)

## 1. Three systems / no duplicate sources of truth

- **GitHub infobwd/bwd-newsroom**: source of truth for public news manifest, public publication status, searchable news copy, approved asset path, version and compiled book manifest.
- **Google Drive: BWD Newsroom | คลังจดหมายข่าวโรงเรียนบ้านวังด้ง**: source of truth for original photos, approved full-resolution Canva PNG/PDF, book PDFs, archival files; the school account manages access.
- **Canva**: layout/design workspace; one canonical design ID per published news issue and independent master design(s) for WD-01..WD-05.
- Never use a temporary Canva thumbnail URL as a permanent public asset. Never hotlink a Google Drive preview URL as a production image.
- Private Drive folder IDs, private Canva collaboration tokens, credentials and individual consent records must not be committed into this public repository.

## 2. Drive folder plan (created 13 Nov 2026 in the school account)

- 01_Brand_Assets — official logo, fonts usage notes, original QR, graphics
- 02_Canva_Templates — master design references, template preview, brand guidance
- 03_Source_Photos — originals organized by Thai year / month / event / capture date
- 04_News_Drafts — drafts, approval evidence, work-in-progress output
- 05_Published_News — approved PNG/PDF, completed book exports; suggested year/month subfolders
- 06_Archive — replaced revisions, print masters, old releases

Drive content stays private by default. Public links are given only to approved specific files as needed; do not make entire source or draft folders public.

## 3. News issue ID, fields, example

Stable ID: WDNEWS-2569-0001 (B.E. year and sequential ID).
Canonical file path once implemented: data/issues/WDNEWS-2569-0001.json
Date serialization uses ISO Gregorian YYYY-MM-DD for machine sorting; display uses Thai Buddhist year (B.E. +543). All dates Asia/Bangkok.

Example schema-like sample (illustrative placeholder only; never publish as a real issue):

{
  "id": "WDNEWS-2569-0001",
  "title_th": "ตัวอย่างชื่อข่าว (ห้ามเผยแพร่เป็นข่าวจริง)",
  "date": "2026-11-13",
  "category": "academic",
  "template_code": "WD-01",
  "status": "draft",
  "canva_design_id": null,
  "canva_view_url": null,
  "excerpt_th": "",
  "body_th": "",
  "tags": [],
  "pages": [
    {
      "page_no": 1,
      "web_image": null,
      "thumb_image": null,
      "original_drive_file_id": null,
      "alt_th": "",
      "sha256": null,
      "width": null,
      "height": null
    }
  ],
  "visibility_approved_at": null,
  "approved_version": null,
  "published_at": null,
  "replaces_issue_version": null
}

Validation: no status=published without approval timestamp/version, valid uploaded web image path, nonempty alt/title/date, and explicit public content check. Only published-approved records enter public generated catalog; reject placeholders.

## 4. Book ID, fields, example

- Biweekly A (1–15) book ID: WDBOOK-2569-11A
- Biweekly B (16–month-end): WDBOOK-2569-11B
- Monthly: WDBOOK-2569-11M; annual: WDBOOK-2569-Y
- Each book manifest freezes an ordered list of issue ID and approved_version, plus explicit page image paths/hashes.
- Book: { id, title_th, type, date_start, date_end, cover_asset, contents, pages, pdf_uri, pdf_sha256, file_size, revision, approved_at, published_at }
- Catalogue order is publication date then stable issue ID, not filesystem creation order.
- A compiled PDF may be stored externally (Drive single approved public file), with stable public download URL recorded; avoid putting each high-res PDF inside Pages.

## 5. Image policy

- Canva exported high-resolution original PNG is the print and archival source. If an issue is multi-page, preserve ordered page 1..N in master.
- A4 portrait 300 dpi target 2480 x 3508 px where original quality supports it; do not upscale low-res uploads and pretend they are print-quality.
- Derive two web images: thumbnail (small, quick preview) and reader image (text legible on phones). Use WebP or efficient JPEG/PNG as typography demands; do visual compare after compression.
- Avoid arbitrary hard file-size thresholds that make Thai headlines unreadable. Verify reader quality with mobile zoom and text details, not merely byte size.
- Strip unnecessary EXIF (especially GPS) from public derivative images; retain approved originals in restricted Drive.
- Asset filenames include stable issue id / page / approved version and never silently reuse a filename for visually different image content.
- Use cache-busting revisioned filenames or content hash URLs; old revision archives remain discoverable but not primary.
- All public image paths must resolve relative to GitHub Pages project base /bwd-newsroom/; verify on deployed URL, not only localhost.

## 6. PDF assembly policy

- Build book from approved full-res page images only, not cropped thumbnails.
- Preflight: color mode, orientation, dimensions, missing pages, ordering, duplicates, image rotation, embedded font if generating text cover/TOC.
- Use A4 portrait media boxes and calculate contain/fit without unintended crop; support landscape source via explicit layout decision.
- Provide screen-optimized PDF and print-quality PDF as separate optional profiles. Use actual file size budget and human QA.
- TOC records issue title and its final PDF start page, including cover/TOC offset. Bookmarks and text layer/search metadata are beneficial additions but image pages remain images unless OCR/text overlay is deliberately implemented.
- For large books use a controlled Python/local build process with image-to-PDF library and deterministic manifests. Browser-side PDF is optional for a small selection only, not the canonical annual volume pipeline.
- Output naming: BWD_NEWSROOM_2569_11_A_v01_screen.pdf or _print.pdf; record SHA256 and count.
- Updating prior issue images requires new book revision and approval; archived PDFs are immutable.

## 7. Public/privacy contract

- Publication of student faces and names requires school-approved publication policy and image permissions; avoid personal data that is unnecessary to the news.
- Never expose original photos, private metadata, unpublished drafts, student IDs, phone lists, or editable Drive contents through the public site.
- Only use Canva edit links in private operational contexts, and use approved public view link only if permitted.
- README and public docs should not contain private folder IDs or unrestricted access paths.
- Any public PDF link on the site requires deliberate file-level permission (not public folder permission).

## 8. Future integration decisions

- MVP does not require Supabase, OAuth, or backend. A static catalogue is safer, lower-cost and works on GitHub Pages.
- If editor UI becomes necessary, design a separate authenticated admin/backend; never put write credentials or Google OAuth secrets in public JavaScript.
- Keep a clear separation of source/master data, approved output, and derived published web assets.


## 9. Additional accepted source type — existing PDF in Google Drive (decision 13 Nov 2026)

BWD Newsroom may ingest **either approved PNG/JPG/WebP images OR an existing PDF file** from the school's authorized Google Drive account. Ingestion is editorial/admin-side, not by anonymous public browser JavaScript.

Workflow for source images:
1. Read file metadata and real access permission from Drive.
2. Download authorized original through connector/Drive API; check dimensions/orientation.
3. Confirm school publication approval and expected article/page order.
4. Generate approved thumbnails + reader images (with versioned paths) for Pages; retain originals in Drive.

Workflow for source PDF:
1. Read metadata/MIME (application/pdf), authorized download, page count and security/access status.
2. Inspect PDF pages; if PDF has text/vector content, retain the original PDF; for Flipbook render each page to an optimized image at legible resolution using an offline/admin build.
3. Preserve logical page order, page proportions, and colors; check Thai glyph integrity and that pages are not accidentally clipped or blank.
4. Store approved source PDF privately in Drive; publish only optimized page images and an explicitly approved public PDF link if the school authorizes public download.
5. Record source kind: image_pages or pdf, original document revision checksum (restricted register), derived public page checksums, and reviewed version.

Never use temporary Drive thumbnail URLs as published images, expose Drive bearer access tokens in site JS, or make an entire private source folder public. A PDF that contains sensitive material stays private; web flipbook cannot bypass that restriction.

**Implementation milestone:** N01 stores the schema/policy and public display only. Authorized file fetching, PDF rasterization, and publication workflow remain N03/N04 implementation tasks requiring testing and source approval.

## 10. School-selected PDF intake (13 Nov 2026)

The school owner has selected a different Google Shared Drive folder named **ปีการศึกษา 2569** as the intended intake location for PDF files and flipbook tests. Its private folder URL/ID should be kept in the authenticated automation configuration rather than the public repository.

- Source and test PDFs for academic year 2569 go to this selected folder, not automatically to `04_News_Drafts`.
- The original `04_News_Drafts` and `05_Published_News` folders remain available for Canva drafts and archival exports. Do not move or delete existing files automatically.
- PDF intake does not imply school approval. Verify contents, permissions, rights, and student privacy before processing and publishing.
- Generate approved optimized web page images from the PDF in an authenticated editorial pipeline. Keep source PDF in Drive. Only individually approved public PDF links may appear in the public website.
- The AI Loop may inspect the designated academic-year intake folder if connected; keep the public catalogue and approval status in the GitHub repo.


## 11. Event/Photo/Gallery data contract extension (N01-G / N04-P)

Full specification: [GALLERY_CHAT_UI_PWA_PLAN.md](GALLERY_CHAT_UI_PWA_PLAN.md). Do not create another independent photo source of truth. Keep the 17 academic-year source PDFs unchanged.

- **Private** activity ID `EVT-2569-XXXX` maps to a single school Shared Drive event folder, source image File IDs, hashes, upload audit, permissions and candidate/approval records. Secure school-side registry; never commit it to GitHub Pages.
- **Public** Gallery ID `WDGAL-2569-XXXX`, stored when approved as `data/galleries/<gallery-id>.json`: title_th, ISO event date, category/tags, public image path/caption/alt/dimensions/hash, cover, approved_version, published_at and optional `linked_issue_ids`. No private File IDs, uploader identities, consent evidence, hidden folder links or GPS metadata.
- Existing WDNEWS issue may reference `event_id` and `related_gallery_ids`, but an issue remains valid without a Gallery. Gallery and issue image subsets/approval gates are separate.
- The academic-year school Shared Drive can receive `01_ภาพกิจกรรม/<month>/<event-id>` in a later implementation. Existing `03_Source_Photos` should index/shortcut original files, not duplicate large image binaries.
- Publishing generates approved optimized web image derivatives, with stable versioned paths and separate approval history; do not hotlink Google Drive thumbnails. PWA may cache only bounded public derivatives, never private originals.
