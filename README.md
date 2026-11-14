# BWD Newsroom — คลังจดหมายข่าวประชาสัมพันธ์โรงเรียนบ้านวังด้ง

**Project:** โรงเรียนบ้านวังด้ง สพป.กาญจนบุรี เขต 4  
**Repo:** https://github.com/infobwd/bwd-newsroom  
**Target GitHub Pages:** https://infobwd.github.io/bwd-newsroom/  
**Status (14 Nov 2026, GitHub readback):** N01/N02/N02-MOBILE and N01-G UI are merged; the first school-approved WD’NEWS issue `WDNEWS-2569-0001` and its five-photo `WDGAL-2569-0001` album are published. Static QA and live public HTTP image/PDF checks passed; actual iPhone/iPad visual QA remains separate. Chat-led photo review is in use; authenticated teacher upload UI, Drive-direct public image hosting, PDF collection compiler and PWA offline are not yet implemented.

BWD Newsroom is planned as a public, mobile-first archive of approved WD’NEWS school newsletters, with a searchable issue catalogue, multi-layout Canva templates, photo-based e-books, realistic page-turn reading like WD Books, and compiled PDFs by **half-month (รายปักษ์)**, month, semester, and year.

## Documents and next steps

1. [MASTER PLAN](docs/MASTER_PLAN.md) — vision, site features, page-flip reader, publication periods, architecture, implementation phases.
2. [DATA & STORAGE](docs/DATA_AND_STORAGE.md) — news/book IDs, image and PDF contracts, Drive folder layout and access rules.
3. [PUBLISHING & QA](docs/PUBLISHING_AND_QA.md) — Canva saved-preview check, photo/Thai-text checks, PDF generation verification and live Pages gates.
4. [AGENTS.md](AGENTS.md) — Codex/AI and contributor instructions.
5. [AI DEVELOPMENT LOOP](docs/AI_DEVELOPMENT_LOOP.md) — L0–L5 evidence-led iterative workflow, Drive import policy, checkpoints.
6. [GALLERY + CHAT + UI/PWA PLAN](docs/GALLERY_CHAT_UI_PWA_PLAN.md) — ChatGPT-directed photo selection, secure teacher intake, public Gallery and incremental PWA.

## Ownership boundaries

- **Canva:** design masters WD-01–WD-05, single canonical Design ID per news issue; do not confuse draft preview with persisted design.
- **Google Drive:** the school-selected academic-year Shared Drive is the primary activity-photo / existing-PDF intake, with restricted review and approved-version WebP storage. A pre-existing separate BWD Newsroom archive may keep Canva exports and approval evidence, but not duplicate the same original photo binaries. Drive folder IDs and restricted records are not published here.
- **GitHub Pages:** deployed news/Gallery/reader, public catalogue metadata, approved optimized web images and the first vetted one-page PDF. Larger future print/PDF collections may use carefully approved public file-level storage elsewhere. Direct Drive WebP serving is a *pilot*, not the current production image provider.

## Phases

| Phase | Deliverable | Status |
|---|---|---|
| N00 | Structure, integration/storage plan, publication policy | COMPLETED (documentation) |
| N01 | Searchable responsive WD’NEWS archive | MERGED; public QA separate |
| N02 | Flipbook + N02-MOBILE immersive reader (merged PR #3) | MERGED; real-device QA separate |
| N03 | Image-to-PDF biweekly / monthly book workflow | NOT STARTED |
| N04 | Guarded import, long-term archive; N04-P photo chat workflow | IMPLEMENTATION PENDING |
| N01-G | Public activity Gallery | MERGED; 1 approved public event album (5 photos); live HTTP QA pass |
| N04-W | Installable read-only PWA | PLANNED; not implemented |
| Deploy | GitHub Pages live/device QA | LIVE HTTP PASS for approved issue and Gallery; manual iPhone/iPad QA PENDING |

**รายปักษ์** is defined for planning as days 1–15 and 16–the last day of each month, not a rolling 14-day window.

## Critical rules

1. The public repo/site contains only approved school media; no student private records, hidden Drive originals or credentials.
2. Web images are derived from approved Canva exports; do not point image tags at temporary Canva thumbnails or Drive preview endpoints.
3. Each issue has stable WDNEWS-2569-XXXX ID; compiled books have WDBOOK-2569-11A/11B-like IDs and immutable approved versions.
4. Before a release, verify saved Canva preview, Thai copy, image count/placement, unchanged QR, readable web image, PDF page ordering, mobile reader and actual public link.
5. A written plan is not a deployed web site, completed PDF, or device QA. Add production files through reviewed scoped PRs.

## Reuse existing work

WD Books source: https://github.com/infobwd/manual. Its StPageFlip 2.0.7 based experiments and associated mobile interaction tests are reference implementations, not files to copy without checking licenses and touch behavior.

## Operational next step

Keep the first approved issue/Gallery available with verified public URLs. Next: manual iPhone/iPad QA, guarded teacher intake, storage review, and N03 book compiler. Do not publish unapproved source images or treat Drive file links as permanent image endpoints.

## N01/N02 checkpoint and Gallery/PWA extension (13 Nov 2026)

- PR #1 (N01), PR #2 (N02) and PR #3 (N02-MOBILE) have been merged; keep existing archive, bookshelf and immersive demo reader. This is not evidence any real student photo/PDF is published.
- Current N02-MOBILE source/checkpoint in main guides safe-area, page flip, zoom and fallback behavior; do not replace it for Gallery/PWA.
- Historical checkpoint (13 Nov): no real news was published at that time. As of 14 Nov, the first real issue and approved Gallery are published; only actual-device visual QA is still pending.
- Google Drive images/PDF can be imported through an authenticated editorial workflow, then optimized approved public web images go into Pages. Direct private Drive hotlinking is not production image delivery; link approved PDF files individually when permitted.
- AI Loop runtime/schedule is separate from repository documentation; check actual Automation state when running it. Do not disable other automations as part of this Gallery/PWA work.


## Integrated Gallery and PWA plan (documentation only)

- **N01-G:** Approved-only Gallery added inside existing BWD Newsroom; search albums, view images and link the same event to WDNEWS/Canva.
- **N04-P:** Teachers upload to school Shared Drive through authenticated mobile UI; image curation and separate Gallery/newsletter approval run **by command in ChatGPT**, not via an extra Curator Dashboard.
- **N04-W:** Future public-reading PWA with install metadata, project-scoped offline shell/cache and update notification. Preserve N02-MOBILE immersive reader. No new Supabase project for MVP.
- Keep the academic-year selected Drive folder's existing 17 PDFs untouched; never automatically expose original school/student photos.
- Detailed contract: [docs/GALLERY_CHAT_UI_PWA_PLAN.md](docs/GALLERY_CHAT_UI_PWA_PLAN.md). N01-G public Gallery now exists; upload service/PWA remain pending.

## N01-G Public Gallery implementation (feature branch)

- Branch `feat/n01-g-public-gallery`: approved-only `gallery.html` with album search/year/category filters, responsive cards, deep link `#album=WDGAL-...`, full-screen lightbox and related WDNEWS links.
- Historical implementation checkpoint: `data/galleries.json` was empty before approval. It now holds one approved public album; the site's public images are versioned derivatives, never the original Drive photos.
- Validation: `node scripts/validate-galleries.mjs` and `node tests/n01-gallery.test.mjs`. These checks also run in GitHub Actions.
- This is **N01-G only**; authenticated teacher upload, AI image curation through ChatGPT and installation/offline PWA remain N04-P/N04-W.
- Checkpoint: [N01-G](docs/N01_G_CHECKPOINT.md). Publication and real-device/browser QA are independent gates; feature branch/PR is not automatically live.

## Drive-first WebP pilot (14 Nov 2026)

The school-owner-selected academic-year Shared Drive now stores versioned WebP derivatives in `03_ภาพเว็บ_รอตรวจ` and `04_ภาพเว็บ_เผยแพร่`. These files do **not** prove anonymous access or reliable hotlink delivery. Existing GitHub Pages image paths remain live; no auto-publication from Drive, and no new backend was deployed. See [Drive-first WebP pilot](docs/DRIVE_FIRST_WEBP_PILOT.md).
