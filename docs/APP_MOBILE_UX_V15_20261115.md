# BWD Newsroom — Mobile UX v1.5: Dots, Autoplay, Touch Focus & Hero Motion

**Work ID:** BN-APP-2569-06  
**Date:** 2026-11-15, Asia/Bangkok  
**Baseline main:** `b1ef00ec4cdb762eb34c9f207c6c71e3bdc16416` (merged PR #25).  
**Branch:** `feat/app-v15-dots-autoplay-focus-hero-20261115`  
**Authorization:** The school owner explicitly requested implementation **and Merge** in this chat on 15 พฤศจิกายน 2569.  
**Scope:** App shell UI only. No approved issue/gallery manifests, source photos, students' information, Canva designs, QR codes, PDFs or WD Books flip engine modified.

## Improvements

1. **Compact interactive dots** replace oversized previous/next arrows and numerical pager. Active dot gold, other dots slate gray, actual visible size 8px but touch target at least 40x44px. Each dot has a Thai accessibility label; active position uses `aria-current`. Source is the same approved-only catalogue and remains capped at 5 issues.
2. **Autoplay, 5.5 seconds** uses a smooth **ping-pong** direction between first and last card (no hard jump). A manual swipe/tap/dot/key interaction defers automatic changes for 9 seconds; pointer hover and keyboard focus pause while active. A small permanent play/pause toggle meets user autonomy and auto-moving-content requirements. No slide changes while tab hidden, dialog open or carousel offscreen. `prefers-reduced-motion` disables autoplay and hides the play toggle. IntersectionObserver avoids offscreen timers.
3. **Touch focus cleanup** only after a pointer-initiated dialog dismissal, after browser focus restoration, blurs the old card/track focus on Safari. `:focus-visible` remains for keyboard navigation; no persistent gold focus frame after tapping.
4. **Premium subtle mobile hero motion:** one 650ms fade/lift at render, navy gradient shift over 20 seconds and very faint moving golden atmospheric highlight. All motion disabled under `prefers-reduced-motion`.
5. **PWA public shell cache update** so installed iPhone Home Screen clients can elect to refresh. Service-worker policy still excludes source Drive media, catalogues, photos and PDFs.

## QA and release

- Added `tests/app-ux-v15.test.mjs` into the existing Static QA workflow; previous v1.4 PWA-version assertion now accepts newer shell revisions instead of pinning obsolete cache names.
- Before Merge, require current-head Static QA success: JS syntax, manifest validators, all prior N01/N02/LINE/Gallery/PWA regression checks, and v1.5 contracts.
- Physical iPhone/iPad QA remains **NOT RUN** without a connected device: tap dots, swipe to last/first, confirm pauses/resumes and offscreen stop, close modal without gold frame, VoiceOver, Safari standalone/Home Screen, reduced-motion preference.
- The Live Pages workflow checks the currently deployed baseline and does not prove the PR's unpublished UX works on device; post-merge deployment status must be checked separately.
- Rollback by reverting the scoped PR; no public content migration or student image permission changes.
