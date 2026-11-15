# BWD Newsroom — App Experience v1.1 mobile UX checkpoint (15 พฤศจิกายน 2569)

**Work ID:** BN-APP-2569-02
**Base main:** `1ab3f3689e1c241fbcdf1c96e2d073af3b14088c` (PR #20)
**Branch:** `feat/app-experience-v11-mobile-refinement`
**Release authorization:** User explicitly requested implementation and merge on 15 November 2569.
**Public data scope:** UI-only; no changes to news, Gallery, books manifests, photos, approved Canva assets, or teacher uploads.

## Implemented
1. Mobile bottom navigation uses opaque white surface, explicit full end-of-page/safe-area scroll room, and bottom scroll padding. Reader modal and photo lightbox remain independent and fullscreen.
2. Home Gallery previews use 4:3 no-crop frame; Gallery listing becomes compact horizontal cards with intrinsic 4:3 containment to avoid forced cropping.
3. On mobile, search stays inline, filter button opens native `dialog` Bottom Sheet (news: year/category/template, Gallery: year/category). Existing original form selections remain the single source of truth; the sheet mirrors choices, dispatches existing change handlers and reset uses the existing form. Desktop retains original inline filters.
4. Reader Focus Mode explicitly toggles to hide toolbar/mode row while preserving previous/next controls and always-visible restore button. Flip engine geometry is refreshed at preserved current page; scroll fallback keeps current position. Touch and zoom engine otherwise unchanged.
5. Worker shell version bumped to v11 so an installed PWA can request a safe user-controlled update. No additional offline media caching.

## QA gates
- GitHub Actions syntax, public manifest validation, existing N01/N02/Gallery/PWA regressions and v1.1 source contracts: **PENDING** until green CI on final PR head.
- GitHub Pages deployment/live smoke: **PENDING** until after merge; a baseline smoke run is not a mobile-device test.
- Real iPhone Safari (360–430px), iPad/Android, focus-mode flip geometry, keyboard/VoiceOver, install/offline and photo crop check: **NOT RUN** from GitHub CI.
- Security/privacy: no new media, Drive source originals, tokens or private URLs committed.

## Rollback
Revert this scoped PR if browser regression occurs. Public manifests unchanged. Service worker version can be rolled forward safely; previously installed users may require an online reload to update shell.
