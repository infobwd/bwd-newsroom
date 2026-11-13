# BWD Newsroom — Publishing & QA Gates (13 Nov 2026)

Status: baseline governance plan (no deployed code yet).

## A. Intake: Canva + Drive

1. Receive event facts (title, B.E./Gregorian date, location, people, objective, outcome), original photos and their publication permission.
2. Allocate unique WDNEWS-2569-XXXX before page layout.
3. Choose WD-01..WD-05 style; confirm the selected Canva **master template** is copied to a new **issue** design. Record canonical Canva design ID for the issue. Avoid copying again without a reason and new revision linkage.
4. Keep the template source separate, lock brand logo / contacts / QR as practical, and **do not modify existing QR unless explicitly requested**.
5. Edit all intended pages within the same design and inspect **draft** previews; every relevant page needs visual review.
6. Commit/save the Canva editing transaction only after user review/approval when applicable; retrieve **saved** design metadata and fresh page thumbnails afterward, not draft-only previews.
7. Compare the exported PNG visually with the saved Canva page. Temporary preview URL is not final output; if PNG export is not available in the connected workflow, state it plainly and leave the issue awaiting manual export.
8. Place print-quality master PNG/PDF in restricted Drive, then create production web derivative images from **approved export** only.

## B. Status gates

- DRAFT: information gathered, not public
- READY_FOR_QA: all planned images and copy complete
- APPROVED: school owner confirms actual layout/content (capture who/when and approved version; avoid putting sensitive approval evidence in public repo)
- PUBLISHED: public issue manifest, optimized images, and site link verified
- ARCHIVED: no longer featured, but historically accessible if valid

Changes requiring new approval: name/date/title/factual copy, adding/replacing student photos, QR, main page composition, source asset, PDF book pages. Cosmetic CSS improvements may be regression-tested without changing news editorial approval, but must not silently alter published content.

## C. Canva QA checklist

- [ ] Correct canonical Canva design ID and issue ID; no parallel duplicate selected as primary
- [ ] Design title, date, school name, director designation, activity facts accurate
- [ ] All intended photographs present in correct order and placement
- [ ] No unintentionally stretched image / face crop / covered subjects
- [ ] Kanit Thai header and readable Thai body, no tofu glyphs or overflow
- [ ] No missing logo/footer, color palette navy-blue/yellow-gold preserved
- [ ] Existing QR preserved unless instructed otherwise
- [ ] Page count and page order correct
- [ ] After saving Canva, reload and inspect new saved thumbnail for every page
- [ ] Export high-res PNG for every page and compare against post-save previews
- [ ] Do not claim successful export if connector does not support file delivery

## D. Website/news QA checklist

- [ ] Source asset from approved revision, not Canva temporary thumbnail nor Google Drive preview hotlink
- [ ] Every image URL returns image bytes, no 403/404 and no broken icon
- [ ] Mobile 360–430 px, tablet 768–1024 px, desktop 1280+ px
- [ ] Search Thai keywords, clear filters, sort by published date, year B.E. labels
- [ ] Page links work with Github Pages subpath /bwd-newsroom/ and browser reload
- [ ] News text included as HTML not only baked into images (for search/accessibility)
- [ ] alt text meaningful, keyboard focus visible, loading/empty/error state
- [ ] Public/incognito check confirms no login needed and no unintended private Drive exposure
- [ ] No new data leaks (full student names where unnecessary, GPS EXIF, draft comments, internal metadata)

## E. Flipbook QA checklist

- [ ] Front cover appears on right in desktop spread, without duplicate content page
- [ ] Mobile uses one page, continuous scroll of the viewport still works
- [ ] Touch swipes/corner drag and next/previous buttons operate reliably on iPhone Safari and iPad Safari
- [ ] Desktop Chrome/Edge mouse corners, Arrow keys, TOC page jump, browser back, deep link all work
- [ ] Last page, back cover, odd/even padding, real page numbers validated
- [ ] Reduced-motion preference uses brief/disabled animations and reliable button fallback
- [ ] Resize/orientation retains the same or near same news/page, no random reset
- [ ] Alternate scroll reader available when flip engine fails; PDF download independent from engine
- [ ] No horizontal overflow, missing page image, large cumulative layout shifts
- [ ] Verify on actual iOS device; static smoke pass ≠ device QA pass

References: existing WD Books infobwd/manual docs/WD_BOOKS_FLIP03_CORNER_DRAG_PILOT_2569.md and docs/WD_BOOKS_FLIP04_MOBILE_READING_POLISH_2569.md.

## F. PDF compilation acceptance

- [ ] Date-bound filter: 1–15 and 16–end monthly; verify Dec/Feb leap year and New Year boundary
- [ ] Only approved published records, deterministic order, no duplicate pages
- [ ] PDF image pages match Canva-export approved source image and page order
- [ ] Cover, TOC and page numbering match actual PDF page indices
- [ ] A4 media boxes correct, no unintended stretch/crop/rotation, Thai title readable
- [ ] PDF opens on iPhone Safari and desktop browser; link downloads/opens
- [ ] Confirm source dimensions and total PDF filesize; if print variant is large, distribute by explicit Drive file link
- [ ] Hash output PDF, record issue versions and book revision in manifest
- [ ] PDF metadata title/creator/year and accessible descriptive book contents
- [ ] Inspect at least cover, first issue, last issue, a middle page and all edge-case page sizes

## G. Publishing and rollback

1. Import approved asset set -> generate JSON -> validate schema -> build site -> local smoke.
2. Send preview + QA report for explicit confirmation before public release.
3. Commit/PR after approval; preserve prior published data. Main deployment only with user authorization.
4. Verify live Pages URL and individual issue/flipbook/PDF links in incognito and mobile.
5. On broken deployment, revert only offending commit/PR; protect previous published PDF versions.
6. No background automation or scheduled creation until deliberately configured.
7. Never equate writing plan, merging PR, enabling Pages, deployment success, and real-device acceptance as the same thing.

## H. Release evidence log template

- Release ID / commit SHA:
- Changed files / news IDs / book IDs:
- Canva design ID and saved export parity:
- Drive approved archive path (private reference; do not expose publicly):
- Static tests (PASS/FAIL):
- Live Pages (PASS/FAIL/NOT ENABLED):
- iPhone / iPad / desktop manual QA:
- PDF checks (pages/dimensions/checksum):
- Approval decision / timestamp:
- Rollback reference:
