# BWD Newsroom — WD’NEWS → Gallery CTA (15 พฤศจิกายน 2569)

**Work ID:** BN-APP-2569-12  
**Base main SHA:** `46d15f6c5d3fb7ba70f7e8c013f6d8ef08d81fc8`  
**Branch:** `feat/issue-approved-gallery-cta-20261115`  
**Pull Request:** [#34](https://github.com/infobwd/bwd-newsroom/pull/34)  
**Authorization:** เจ้าของโครงการยืนยันดำเนินการพร้อม Merge ในแชท 15 พ.ย. 2569 (UI/navigation only)  

## Source-backed design
- The existing `data/galleries.json` already has `linked_issue_ids` for two approved, publicly available albums; no manifest changes necessary.
- `WDNEWS-2569-0002` → `WDGAL-2569-0002`: 11 approved public images (ประชุมคณะกรรมการสถานศึกษาฯ).
- `WDNEWS-2569-0001` → `WDGAL-2569-0001`: 5 approved public images (งานทอดกฐิน).
- Use the Gallery manifest as the single linkage source, not numerical ID inference, unapproved Drive originals or Canva previews.

## Implementation
1. Within the existing `openIssue` native modal, render the A4 issue page(s), then a nonfloating full-width **“ชมภาพกิจกรรมทั้งหมด”** link (stacked-photos SVG, approved image count and album title), then the accessible Thai article text.
2. Resolve `issueId → approved galleries` using the already-existing homepage fetch of the public `data/galleries.json`: only link a published issue to published albums with approval timestamps and revisions; hide the link when there is no verified relationship or Gallery fetch fails.
3. The link opens `gallery.html#album=WDGAL-...` directly. Save the issue ID and its own `dialog-content.scrollTop` in temporary `sessionStorage`; on returning without BFCache, restore the modal scroll after reopening via `#issue=...`. With BFCache, preserve the original in-memory dialog and clear obsolete saved fallback on `pageshow`.
4. Keep fixed mobile footer **Share | × ปิด**, modal header, reading copy and source QR/logo unaffected; add keyboard focus styling and 44px+ tap target.
5. Bump the public-only PWA app-shell version from `v18` to `v19`. No student imagery, approved media, PDF, public catalog, token or private Drive material is precached.
6. Add source and synthetic approval/relationship tests to `tests/issue-gallery-link.test.mjs`, and wire into static QA.

## QA gates (evidence separated)
- **Source QA:** verify existing published linked issues, counts 11 / 5, reject draft/unapproved/duplicate/unlinked entries, exact image-first placement, back/forward fallback, CSS accessibly focusable and public-only PWA cache.
- **PR Static CI:** verify GitHub Actions *after final source/doc commit*; passing earlier runs alone is not final release evidence.
- **PR live Pages smoke workflow:** verify GitHub Actions result; a PR smoke run does not establish the new UI is live.
- **Live Pages after Merge:** inspect live page and cached assets separately.
- **Actual iPhone Safari/LINE/PWA:** **NOT YET TESTED** — check 360/390/393/430px, page image and caption, 11/5 CTA counts, absence for unlinked news, gallery deep link, browser Back and news scroll, bottom fixed controls, reduced motion, VoiceOver/keyboard and older cached PWA versions.

## Content protection
No edits to Canva templates/design IDs, saved PNG/PDF exports, logos, QR codes, Drive originals, approved photo bytes or immutable `data/catalog.json` / `data/galleries.json` metadata. This change only exposes navigation to *already-approved* public albums.

## Rollback
Revert PR #34 if needed, preserving the existing news and Gallery catalogue/assets. No data migration or unpublishing action is required. Installed PWA users see updated shell only after their update flow.
