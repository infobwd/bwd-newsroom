# BWD Newsroom — App Experience v1.2 (15 พฤศจิกายน 2569)

**Work ID:** BN-APP-2569-03  
**Base main:** `1dce71fe5e9ddb266df87b20c3b1c4a4bbe27f13` (LINE Sharing v1 PR #22)  
**Branch:** `feat/app-experience-v12-loading-launch`  
**Scope:** Skeleton Loading, native iPhone Startup Images, standalone Launch Overlay and compact issue share commands. Owner authorized implementation **and Merge** during this conversation.

## Changes
1. **Initial data skeletons** are present in static HTML for app Dashboard (issue + two albums), news archive (3 cards), Gallery archive (3 cards), and bookshelf (cover). Existing render code removes placeholders on success; error paths remove or replace them instead of trapping users in an infinite loading state.
2. **Individual image placeholders** cover news thumbs, Gallery cards, album photos, lightbox, book covers and issue modal images until load/error, preserving layout. Images still reference approved public content only.
3. **Immersive Reader**: static page-sized paper placeholder until the first approved current page image loads; demo removes it as soon as demo content is ready; failed catalogue uses error state. All original page-turning/zoom/scroll controls remain.
4. **Native iPhone startup**: 3 portrait PNG launch images sized 1290×2796, 1179×2556 and 1170×2532, linked with exact media queries. Other iPhone sizes use iOS native generated fallback. Standalone-only navy/gold browser launch overlay disappears immediately after initial data loads/fails; 10-second safety timeout prevents a stuck screen. No arbitrary wait or forced animation.
5. **Issue share dialog**: "Share image" and LINE text handoff remain prominent. Existing PDF, JPEG download and copy text are retained in native **details** under "เพิ่มเติม". All approved news content, LINE message wording and URL logic unchanged.
6. Motion is disabled under `prefers-reduced-motion: reduce`; images, PDFs and private Drive URLs are never added to service-worker precache. Shell version bumped for existing installed PWA updates.

## QA / release gates
- **PENDING:** GitHub Actions final PR syntax, manifest checks, regression, CSS and PNG-decoding synthetic tests.
- **NOT RUN:** iPhone/iPad hardware Safari, actual Home Screen launch, VoiceOver, native startup image rendering, reader first-page visual timing and LINE native photo/text share behavior; require device review.
- **Privacy:** No original photos, Canva assets, QR, publication registry, credentials or approval state changed.
- **Rollback:** Revert scoped PR; installed PWA service workers should update on an online visit. Do not call synthetic CI a device QA pass.

## Reference and continuity
Retain `docs/APP_EXPERIENCE_V11_20261115.md` and `docs/LINE_SHARING_V1_20261115.md` as prior-release checkpoints; no competing project, backend, auth or database.
