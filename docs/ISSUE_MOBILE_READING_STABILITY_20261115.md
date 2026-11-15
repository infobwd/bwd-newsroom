# BWD Newsroom — iPhone Issue Reading Stability (15 พฤศจิกายน 2569)

**Work ID:** BN-APP-2569-11  
**Base `main` SHA:** `d8e187f2f490bce298ad6bcd96f8ba172b786a85`  
**Feature branch:** `fix/issue-mobile-reading-stability-20261115`  
**Pull request:** [#33](https://github.com/infobwd/bwd-newsroom/pull/33)  
**Authorization:** เจ้าของโรงเรียนสั่งให้ดำเนินการตามผลวิเคราะห์ภาพหน้าจอ iPhone พร้อมอนุญาต Merge ในแชท วันที่ 15 พฤศจิกายน 2569  
**Scope:** cosmetic + mobile interaction, no content changes

## Problem reproduced from user evidence / source inspection
- On the full-screen issue dialog, Close (×) was in the top-right while the single persistent Share CTA was at the bottom; hard to operate with one hand.
- `setupEvents()` toggled `issue-title-collapsed` when content `scrollTop>72`; CSS animated header height/padding and hid the title. This could cause text to jump while touch-scrolling. Image loading placeholders also shimmered.
- The article text rendered at 13px on iPhone, less readable than preferred.

The screenshot is a *static observation*, not video or confirmed hardware root cause. The above are plausible UI causes grounded in code.

## Implemented
1. In `assets/app.js`, create `dialog-close-mobile` beside the Share CTA in `dialog-actions`; retain desktop top close, Escape/history handling. Do not add a second Share CTA.
2. Remove the scroll-driven shrinking header logic; use the modal's existing constrained `dialog-content` scroller and background lock.
3. Reserve 794×1123 (A4 portrait) image geometry before decode, eagerly load the first page, retain lazy loading for later pages, suppress animated image loading placeholder on phone.
4. In `assets/styles.css`, a fixed-height header while reading, 16px/1.7 Thai text, two-column safe-area-aware sticky bottom share/close bar, 96px close target, and clear text scroll room. Correctly align the header options popup after hiding the old top-right close on mobile.
5. In `sw.js`, bump the **public app-shell** cache from `v17-bwd-notify` to `v18-issue-mobile-reading` for installed PWA users. Never cache images, PDFs, private Drive files, tokens or catalogues.
6. Update `tests/issue-image-first.test.mjs`, `tests/bwd-notify.test.mjs`; add `tests/issue-mobile-stability.test.mjs` to `.github/workflows/static-qa.yml`.

## Verification and release gates
- **PASS — Static QA** for PR head `d98254c035ba049482ca9c9636db08acffa712e4`: GitHub Actions run **43723535553**. Includes `issue-image-first`, `issue-mobile-stability`, existing N01/N02/Notify/PWA and catalogue regression checks.
- **PASS — PR live Pages smoke workflow**, run **43723535513**; this is a smoke check and **does not establish deployed PR layout or physical iPhone rendering**.
- **NOT RUN — hardware:** iPhone Safari and Add-to-Home-Screen PWA, 360/390/393/430px, portrait/landscape, rubber-band oscillation at previously collapsed 72px, full text scroll-to-end, native share sheet return, VoiceOver, keyboard/Escape, reduced motion. Owner must visually recheck the original symptom.
- **Editorial/content:** no news, Canva design, QR, Drive originals, Gallery, PDF bytes or public issue JSON changed. Previous publication approval remains scoped to the same immutable content.
- **Release:** Merge explicitly requested; report final merge SHA and Pages post-merge deploy separately. CI passing is not a substitute for device QA.

## Rollback
Revert only PR #33 if verified regression occurs; do not alter published content manifest or original approved imagery. Installed PWA version changes only after user accepts the site's update prompt.
