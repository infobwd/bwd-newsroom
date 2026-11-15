# BWD Newsroom — Mobile UX v1.7: Approved Photo Hero and App-Like Header

**Work ID:** BN-APP-2569-08  
**Date:** 2026-11-15, timezone Asia/Bangkok  
**Base main:** `0e4d7a32bed3638bec5bc18fea9866b3d733c4c1` (merged Mobile UX v1.6).  
**Branch:** `feat/app-v17-hero-session-mobile-polish-20261115`  
**Authorization:** School owner requested implementation **and Merge** on 15 พฤศจิกายน 2569.

## Scope and actual source evidence

School owner identified the **เรื่องราวของวังด้ง** navy Welcome card as the priority for a quiet real-photo background changing on each new entry, plus lighter native-app behavior. Source of truth for public imagery is **data/galleries.json**, not private Drive/Canva thumbnails. At baseline, two public galleries are approved and published: `WDGAL-2569-0002` (11 images) and `WDGAL-2569-0001` (5 images). The implementation specifically curates seven already approved wide-angle images: `0002:P01,P02,P11` and `0001:P01,P02,P03,P04`; avoids the item involving children and closer portraits; does not add public media.

## Implemented

1. **Photo hero:** Only use a selected approved + published Gallery thumbnail from an allowlist and safe local path. Reuse existing `renderAppGalleries` data fetch. No Drive previews, new assets, duplicates, PDF/Canva changes, or personal media API. If there is no valid approved image or the thumb fails to load, keep the existing navy gradient.
2. **Session rotation:** Store the selected public thumbnail path in `sessionStorage`. Reloading/navigating within a tab maintains the same background; opening a new session picks one randomly while avoiding the previous session's image stored in `localStorage` (when browser storage is available). Gracefully fall back if storage is blocked. Background does not change every few seconds.
3. **Visual treatment:** Photo is purely decorative, about 15% opacity with slight desaturation and gold/navy atmospherics. Text remains in an opaque navy gradient; a short reveal only when the public photo is loaded. `prefers-reduced-motion` disables the new motion.
4. **Compact mobile header:** Make the existing header sticky and reduce its dimensions only after scrolling beyond 112px on the phone. Preserve logo, brand name, search and 44px touch targets where practical. Increase scroll margin of the existing 16px News/Gallery search fields for header clearance—no search-overlay replacement.
5. **Micro-interactions:** Subtle active-state shifts for bottom tabs, section links and bookshelf; no changing article/Flipbook behavior, no forced refresh, no second app or backend.
6. **PWA:** Advance the public-only shell cache version. Thumbnails, originals, JSON and PDFs remain excluded from the Service Worker cache.

## QA status / acceptance

- **Static contract and simulated session tests:** `node tests/app-ux-v17.test.mjs` validates approval gating, curated Gallery IDs, session stability, new-session non-repeat, fallback for unapproved records, CSS motion and sticky-header behavior. Added to existing GitHub CI. Final head must PASS before Merge.
- **Not run by source tests:** Physical iPhone Safari & installed PWA; image composition/readability at 360/390/430px, actual close/reopen behavior, offscreen image request, search with keyboard under sticky header, scroll position persistence, reduced-motion/VoiceOver.
- **Publishing:** No new image approval or news publication is implied, only an expressly authorized website layout reusing previously public Gallery derivative assets. School can withdraw photos in public manifest, after which a new session will not select withdrawn images. No changes to image sources, consent records, master templates or QR.
- **Rollback:** Revert the scoped PR; existing approved material remains unmodified.

## QA evidence before merge

- **PR:** https://github.com/infobwd/bwd-newsroom/pull/28
- **Static QA:** PASS, https://github.com/infobwd/bwd-newsroom/actions/runs/43690199373 (PR source head `6fd0f5c4fae8aff8e3cbb9178ba58afd2939c0ed`).
- **Live Pages smoke:** PASS for the previously deployed public baseline only, https://github.com/infobwd/bwd-newsroom/actions/runs/43690199366. It is not a screenshot or guarantee of the new PR experience.
- **New regression tests:** simulated approved-only photo selection, stable session, nonrepeat on next session, withdrawal fallback, plus static header/keyboard-safe margin and reduced-motion checks.
- **Device acceptance:** NOT RUN; still requires actual iPhone Safari/PWA and visual assessment.
- This docs-only evidence update requires **another Static QA PASS at the final PR head** before merging.
