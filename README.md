# BWD Newsroom — คลังจดหมายข่าวประชาสัมพันธ์โรงเรียนบ้านวังด้ง

**Project:** โรงเรียนบ้านวังด้ง สพป.กาญจนบุรี เขต 4  
**Repo:** https://github.com/infobwd/bwd-newsroom  
**Target GitHub Pages:** https://infobwd.github.io/bwd-newsroom/  
**Status (13 Nov 2026):** PLAN READY / WEBSITE NOT YET IMPLEMENTED OR VERIFIED LIVE.

BWD Newsroom is planned as a public, mobile-first archive of approved WD’NEWS school newsletters, with a searchable issue catalogue, multi-layout Canva templates, photo-based e-books, realistic page-turn reading like WD Books, and compiled PDFs by **half-month (รายปักษ์)**, month, semester, and year.

## Documents and next steps

1. [MASTER PLAN](docs/MASTER_PLAN.md) — vision, site features, page-flip reader, publication periods, architecture, implementation phases.
2. [DATA & STORAGE](docs/DATA_AND_STORAGE.md) — news/book IDs, image and PDF contracts, Drive folder layout and access rules.
3. [PUBLISHING & QA](docs/PUBLISHING_AND_QA.md) — Canva saved-preview check, photo/Thai-text checks, PDF generation verification and live Pages gates.
4. [AGENTS.md](AGENTS.md) — Codex/AI and contributor instructions.

## Ownership boundaries

- **Canva:** design masters WD-01–WD-05, single canonical Design ID per news issue; do not confuse draft preview with persisted design.
- **Google Drive:** school account folder named **BWD Newsroom | คลังจดหมายข่าวโรงเรียนบ้านวังด้ง** for originals, drafts, high-resolution published exports, PDFs, archive. Private folder identifiers and draft contents are deliberately not published here.
- **GitHub Pages:** search, public catalogue metadata, approved low-size web images and flipbook display; large print PDFs remain in school Drive and are publicly linked only at file level after approval.

## Phases

| Phase | Deliverable | Status |
|---|---|---|
| N00 | Structure, integration/storage plan, publication policy | COMPLETED (documentation) |
| N01 | Searchable responsive WD’NEWS archive | NOT STARTED |
| N02 | Flipbook reader (based on WD Books self-hosted StPageFlip patterns) | NOT STARTED |
| N03 | Image-to-PDF biweekly / monthly book workflow | NOT STARTED |
| N04 | Guarded import, long-term archive, optional PWA | NOT STARTED |
| Deploy | GitHub Pages enable + real URL / iPhone/iPad/desktop QA | NOT VERIFIED |

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

Implement N01 as a separate PR: site shell + searchable catalogue + JSON validation + one verified, approved sample issue. Do not publish a fabricated issue or automatically expose files from Drive.
