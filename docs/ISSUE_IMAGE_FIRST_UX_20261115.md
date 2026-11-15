# BWD Newsroom — Issue Image-first UX (15 November 2026)

**Work ID:** BN-APP-2569-09  
**Scope:** Existing `infobwd/bwd-newsroom` issue modal, not Canva/news content.  
**Starting main:** `318bb843e8cd86649c98e1aa51779700c472f000` (later main commits must be integrated before merge).  
**Feature branch:** `feat/issue-image-first-share-25691115`  
**Editorial approval:** No new issue, image, PDF, student photo, QR or published metadata was changed. The owner explicitly authorized this UI improvement and merge in chat.

## User requirement / implementation

- Remove the permanent reader/LINE/download/expander button stack from the **mobile issue viewer**. The only default footer control is the main share action, `แชร์ภาพข่าวพร้อมข้อความ`. A transient share error/status may appear only when needed.
- Preserve `อ่านแบบพลิกหน้า`, `คัดลอกข้อความ + เปิด LINE`, approved PDF link, image download and copy text in the accessible `⋯` header details menu. The menu has a 44px target, can close on Escape/outside tap, and does not occupy footer height when closed.
- The modal title and metadata remain readable initially. After scrolling issue content 72px, the header visually collapses to WD’NEWS plus menu/close. Scrolling back or opening menu restores it. The true heading remains in the accessible tree for the dialog name.
- Keep approved page-image order, `object-fit:contain`, page scrolling, background scroll lock, 100dvh layout and safe-area bottom padding. Do not modify N02 flipbook or the public image/content catalogue.
- Native image + text share is attempted directly in a click (no pre-share asynchronous await). If a browser cannot send image files, label explicitly changes to `แชร์ข้อความข่าว (ไม่แนบภาพ)` and falls back to LINE text link. Target apps may independently ignore a supplied text payload; do not guarantee LINE always receives both.
- Ignore obsolete image-preparation resolutions when users switch between issues. Increment PWA public shell cache version without caching photos or drafts.

## Files

`index.html`; `assets/app.js`; `assets/styles.css`; `sw.js`; legacy share/mobile tests; `tests/issue-image-first.test.mjs`; `.github/workflows/static-qa.yml`.

## QA gates

- **Source QA / regression tests:** pending GitHub Actions result on PR head. Node syntax, approved-only catalogue validation and prior N02 reader regressions are included in existing workflow.
- **PR merge:** authorized by school owner for this UI change, subject to source checks and conflict-free merge.
- **iPhone Safari, installed PWA, other mobiles / VoiceOver:** NOT RUN by source-only tests; verify physical behavior after deployment, including compact header, native image sharing versus LINE text fallback, scroll restoration and no image crop.
- **Live Pages image parity / deployed version:** NOT VERIFIED by this document. A passed GitHub Action does not imply device/live acceptance.
- **Rollback:** revert the scoped merge commit if browser QA reveals regressions. News assets and approved revisions are unchanged.
