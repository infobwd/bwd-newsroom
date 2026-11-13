# BWD Newsroom — AI Development Loop (13 พฤศจิกายน 2569)

**Purpose:** วางระบบทำงานแบบต่อเนื่องสำหรับการพัฒนา BWD Newsroom และ GitHub Pages ตามแผน N00–N04 คล้าย WD Curriculum AI Loop แต่แยกงานและหลักฐานจากกันโดยสิ้นเชิง

## Source of truth (read fresh EVERY iteration)
- GitHub: https://github.com/infobwd/bwd-newsroom (main, PRs, commit, README.md, AGENTS.md)
- docs/MASTER_PLAN.md, docs/DATA_AND_STORAGE.md, docs/PUBLISHING_AND_QA.md
- docs/N01_CHECKPOINT.md (ถ้ามี) และ README status table
- Drive ของโรงเรียน: BWD Newsroom | คลังจดหมายข่าวโรงเรียนบ้านวังด้ง, โฟลเดอร์ Brand/Canva/Source/Drafts/Published/Archive; อย่าใช้รายการจากความจำแทนการอ่าน metadata
- Canva: ดีไซน์ข่าวรายฉบับที่ผู้ใช้เลือก โดยตรวจ ID, ข้อความ, จำนวนหน้า, preview persisted และรูปภาพจริง
- Reader reference: infobwd/manual, docs/WD_BOOKS_FLIP03_CORNER_DRAG_PILOT_2569.md และ FLIP04_MOBILE_READING_POLISH_2569.md
- Current technical constraints: GitHub Pages static, Google Drive private by default, no client-side OAuth secret; review Google API and GitHub docs when implementation materially depends on changes.

## One-loop algorithm

**L0 — Orient**: Inspect main branch head, open PRs, last QA checkpoint, remaining checklist; do not duplicate work completed earlier. Check repo state live rather than using memory.

**L1 — Choose**: Select exactly one highest-priority unfinished task, preferring current milestone and actionable blockers. If there is an open PR, continue/review it rather than spawning duplicates. Work packages N01 (archive) → N02 (flipbook) → N03 (PDF books) → N04 (guarded import/automation). Do not advance milestones merely due to time.

**L2 — Execute**: Read source files and approval state; implement a small scoped change in a feature branch or draft PR. If blocked by lack of approved news/Drive assets, progress code/tests/docs that need no private data. Don't invent example news, consent, dates, image assets or approval. No publishing or main merge without explicit approval.

**L3 — QA**: Validate schemas and source/derived asset links, Thai copy, mobile/readability, PDF page order, access control and privacy. Mark each test PASS, FAIL or NOT RUN with evidence. Static checks are not browser, device or live Pages checks.

**L4 — Record**: Update checkpoint in repo with work ID, initial SHA, final SHA, branch/PR, changed files, checks performed, status, blockers and next action. Keep versions of approved issues immutable. Provide a compact user report with actual links.

**L5 — Gate**: Stop content-related modification at READY_FOR_SCHOOL_REVIEW when the change requires school/publication approval; continue independent coding or verification only. Do not mark APPROVED/PUBLISHED on behalf of the school. Avoid repeating updates if no meaningful changes.

## Milestone acceptance

N01: Responsive public archive UI; published-only schema/catalog; Thai date/search/filter; detail image viewer; empty/error/loading states; local assets; GitHub Pages subpath safe; tests; no unapproved sample issues. Use one real issue ONLY when a saved Canva export and publication approval actually exist.

N02: Self-hosted StPageFlip, responsive, keyboard/touch, reduced motion and static scroll fallback, QA on real devices.

N03: Compile only approved high-res images into immutable PDF biweekly/monthly/annual volumes, with cover/TOC/order, SHA, screen/print variants, secure Drive archive links and PDF QA.

N04: Semi-automated import using authenticated tool or controlled server-side process, with human approval gate, stable public derivative images, optional PWA and monitoring.

## Image / PDF Google Drive import contract

**Recommended:** authenticated Google Drive read via account connector/manual admin workflow → inspect MIME and permissions → download original image/PDF using authorized source → validate ownership and public-release approval → export/convert to web derivative locally → commit optimized public derivative to repo (or dedicated public image host) → record approved Drive PDF link when public.
- For native Docs/Sheets/Slides exported PDF use Drive export; for stored image/PDF use media download. Do not mistake Google Doc exports for binary PDFs.
- Direct image hotlinking to drive.google.com or public preview links is NOT primary site rendering; it may fail due to cookies/access, throttling, link behavior or cross-origin limitations. Do not put service tokens or credentials into client JavaScript.
- For a public PDF, link only the approved file, not the whole Drive folder. A Google Drive file/d/FILE_ID/view URL may be shown to readers if permissions intentionally allow it.
- PDF inside a private Drive file must NOT be fetched from a public site without an authenticated backend. Do not bypass restrictions or auto-publicize originals.
- Keep public issue JSON free of internal Drive IDs; maintain private intake register in a restricted file if needed.

## Checkpoint format

- Loop ID: BN-LOOP-YYYYMMDD-NN
- Target: N01/N02/N03/N04 + work package
- Read from: GitHub SHA + source IDs/URLs
- Work: files/commit/PR links
- QA: PASS/FAIL/NOT RUN and reasons
- Editorial approval: PENDING/APPROVED; never infer approval
- Deploy/device test: NOT STARTED/PENDING/PASS/FAIL
- Blockers and most useful next step
- Stop state if review needed

## Scheduled mode (when enabled)

A repeated automation may run every 2 hours to read latest state and perform one safe loop. Preserve rules above and do not auto-merge or auto-deploy without explicit user approval; only report material progress or blockers. Follow next-run state from the actual task, not assumptions. At each run, if N01 needs a human-approved photo/publication decision and no independent work is available, report READY_FOR_SCHOOL_REVIEW once and stop redundant changes.
