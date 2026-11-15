# BWD Newsroom — คลังจดหมายข่าวประชาสัมพันธ์โรงเรียนบ้านวังด้ง

**Project:** โรงเรียนบ้านวังด้ง สพป.กาญจนบุรี เขต 4  
**Repo:** https://github.com/infobwd/bwd-newsroom  
**Target GitHub Pages:** https://infobwd.github.io/bwd-newsroom/  
**Status (13 Nov 2026, GitHub readback):** N01/N02/N02-MOBILE PR #3 merged (PR #3 merge commit `0bbfc9cd`); publication/site-device verification must be confirmed separately. Gallery/photo workflow/PWA are planned, not implemented.

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
- **Google Drive:** school account folder named **BWD Newsroom | คลังจดหมายข่าวโรงเรียนบ้านวังด้ง** for originals, drafts, high-resolution published exports, PDFs, archive. Private folder identifiers and draft contents are deliberately not published here.
- **GitHub Pages:** search, public catalogue metadata, approved low-size web images and flipbook display; large print PDFs remain in school Drive and are publicly linked only at file level after approval.

## Phases

| Phase | Deliverable | Status |
|---|---|---|
| N00 | Structure, integration/storage plan, publication policy | COMPLETED (documentation) |
| N01 | Searchable responsive WD’NEWS archive | MERGED; public QA separate |
| N02 | Flipbook + N02-MOBILE immersive reader (merged PR #3) | MERGED; real-device QA separate |
| N03 | Image-to-PDF biweekly / monthly book workflow | NOT STARTED |
| N04 | Guarded import, long-term archive; N04-P photo chat workflow | IMPLEMENTATION PENDING |
| N01-G | Public activity Gallery | PLANNED; no live school Gallery |
| N04-W | Installable read-only PWA | PLANNED; not implemented |
| Deploy | GitHub Pages live/device QA | VERIFY INDEPENDENTLY FROM MERGE |

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

Verify N02 demo reader and GitHub Pages deployment. Publish real news only after Canva export and school approval; never publish a fabricated issue.

## N01/N02 checkpoint and Gallery/PWA extension (13 Nov 2026)

- PR #1 (N01), PR #2 (N02) and PR #3 (N02-MOBILE) have been merged; keep existing archive, bookshelf and immersive demo reader. This is not evidence any real student photo/PDF is published.
- Current N02-MOBILE source/checkpoint in main guides safe-area, page flip, zoom and fallback behavior; do not replace it for Gallery/PWA.
- No real news published yet; Canva/Drive export approval and actual deployed browser/device QA are still required.
- Google Drive images/PDF can be imported through an authenticated editorial workflow, then optimized approved public web images go into Pages. Direct private Drive hotlinking is not production image delivery; link approved PDF files individually when permitted.
- AI Loop runtime/schedule is separate from repository documentation; check actual Automation state when running it. Do not disable other automations as part of this Gallery/PWA work.


## Integrated Gallery and PWA plan (documentation only)

- **N01-G:** Approved-only Gallery added inside existing BWD Newsroom; search albums, view images and link the same event to WDNEWS/Canva.
- **N04-P:** Teachers upload to school Shared Drive through authenticated mobile UI; image curation and separate Gallery/newsletter approval run **by command in ChatGPT**, not via an extra Curator Dashboard.
- **N04-W:** Future public-reading PWA with install metadata, project-scoped offline shell/cache and update notification. Preserve N02-MOBILE immersive reader. No new Supabase project for MVP.
- Keep the academic-year selected Drive folder's existing 17 PDFs untouched; never automatically expose original school/student photos.
- Detailed contract: [docs/GALLERY_CHAT_UI_PWA_PLAN.md](docs/GALLERY_CHAT_UI_PWA_PLAN.md). This plan does NOT deliver a new upload service, live Gallery or PWA yet.

## N01-G Public Gallery implementation (feature branch)

- Branch `feat/n01-g-public-gallery`: approved-only `gallery.html` with album search/year/category filters, responsive cards, deep link `#album=WDGAL-...`, full-screen lightbox and related WDNEWS links.
- New `data/galleries.json` catalogue is deliberately empty until the school approves actual albums. Future per-album records live at `data/galleries/<gallery-id>.json`. No Drive originals or student photos are published by the UI work.
- Validation: `node scripts/validate-galleries.mjs` and `node tests/n01-gallery.test.mjs`. These checks also run in GitHub Actions.
- This is **N01-G only**; authenticated teacher upload, AI image curation through ChatGPT and installation/offline PWA remain N04-P/N04-W.
- Checkpoint: [N01-G](docs/N01_G_CHECKPOINT.md). Publication and real-device/browser QA are independent gates; feature branch/PR is not automatically live.

## App Experience v1.1 — 15 November 2026

Follow-up to merged PR #20: mobile-safe bottom navigation, compact no-crop Gallery cards, native Bottom Sheet filters for news and Gallery, and a reversible reader Focus Mode with page-geometry refresh. The public content manifests/Canva/Drive original assets are unchanged. See [v1.1 QA checkpoint](docs/APP_EXPERIENCE_V11_20261115.md) for tested and untested gates. Device Safari and actual PWA-install acceptance remain independent of source-only CI.

## LINE sharing (proposal branch, 15 November 2026)

New native image + text sharing, official LINE text handoff and per-issue link previews are scoped in [Sharing v1 checkpoint](docs/LINE_SHARING_V1_20261115.md). Image/text bundling is dependent on the target app. LIFF is **not enabled** without a school-owned LINE Login channel and verified JPEG/PNG share URLs. No publication or rights status is changed.

## App Experience v1.2 — Loading & Launch UX

Phone launch uses native iPhone portrait startup PNGs for supported screen sizes plus a standalone-only, no-delay branded HTML loading overlay. News, Gallery, reader, modal images and bookshelf now have reduced-motion-aware skeleton/error states; optional share actions are collapsed without changing LINE message content. See [v1.2 QA checkpoint](docs/APP_EXPERIENCE_V12_20261115.md). Real-device validation remains outstanding after source CI.

## App Experience v1.3 — Launch & Header Refinement (15 November 2026)

Fix the repeating in-page splash on installed iPhones (retain native OS startup), keep skeletons, position the gold logo dot inside the WD mark, add a subtle navy/gold phone header flourish and remove the blank area between Gallery Footer and fixed app navigation. Source tests and release checkpoint: [App Experience v1.3](docs/APP_EXPERIENCE_V13_20261115.md). Physical iOS device QA remains distinct from CI.

## N04-P teacher photo upload — accepted direction (15 Nov 2026)

The school-approved direction recorded in [the N04-P architecture decision](docs/GALLERY_CHAT_UI_PWA_PLAN.md#10-n04-p-architecture-decision-record--github-pages-single-surface-teacher-upload-15-nov-2026) is **GitHub Pages as the teacher-facing upload surface**, with an independently secured server-side intake writing originals to school-controlled Drive. Both managed school Google and personal Gmail accounts may authenticate via a verified Google identity provider, but authorization always requires a private school-managed allowlist, individual role and per-event permission checks. No public anonymous upload, owner-privileged open Apps Script endpoint, embedded private Drive API keys, or new publishing dashboard. Backend choice is **P0 feasibility-gated**, not decided by this plan; Apps Script cross-origin credentialed intake must be proven under the actual school account and browser policy, otherwise compare a vetted authenticated API. No P0 live endpoint or deployment is confirmed here.

Plan-only acceptance is separate from actual uploader implementation and proof of security. Do not merge the old divergent history or overwrite newer Mobile UX releases when continuing N04-P.
