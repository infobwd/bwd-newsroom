# BWD Newsroom — Mobile UX v1.6: iPhone Search Focus and Zoom Fix

**Work ID:** BN-APP-2569-07  
**Date:** 2026-11-15 (Asia/Bangkok)  
**Base main:** `161f957b7e7d780e8e61c2e3f2d664ef88a7aadf` (Mobile UX v1.5 PR #26).  
**Branch:** `fix/app-v16-ios-search-zoom-20261115`  
**Authorization:** School owner explicitly authorized implementation **and Merge** on 15 พฤศจิกายน 2569.  
**Scope:** Frontend UI only for approved News and Gallery search. No change to published content, approved photos, Canva, QR, private Drive, PDFs, books, data catalogues or sharing flows.

## Issue observed on physical iPhone screenshots

The user demonstrated iOS automatic zoom after focusing the archive Search Input, enlarged/clipped news cards, and keyboard obscuring content. Source review confirms `font-size:13px` for the news search box, and smaller inherited text for Gallery search and native filter selects. iOS Safari commonly zooms focused inputs below 16px. The header quick-search also triggered both native `#news` anchor navigation and a `setTimeout` to focus, which competes with smooth scrolling and keyboard opening.

## Changes

1. Mobile **News and Gallery** Search Inputs use `font-size:16px`, same compact 46px height and bounded `min-width:0` so the filter button remains beside the search field.
2. Mobile Bottom Sheet filter selects use 16px. Do not globally enlarge all cards or disable user zoom.
3. Quick-search tap now prevents double anchor navigation when the search field is available, synchronously scrolls the input near the safe top edge without smooth animation, then focuses it in the same user gesture using `preventScroll:true`. The page's previous scroll behavior is restored immediately afterward.
4. Gallery album-view navigation remains intact when its list search is not available.
5. Bump public PWA shell cache name so installed iPhone users can apply the new CSS/JS. No media, JSON, PDF or private Drive files are precached.

## Test and release criteria

- GitHub Actions Static QA must pass at the **final PR head**: JS syntax, all prior N01/N02/Gallery/LINE/PWA tests, manifest validations, and added `tests/app-ux-v16.test.mjs`.
- Mobile device checklist (NOT RUN by code-only process): iPhone Safari and Home Screen PWA, 360/390/430px, News and Gallery, quick-search tap from top, keyboard open/close, search input remains in view, page stays at native scale, filter button visible and working, news list not clipped, return from Gallery album and no unwanted auto-zoom.
- Preserve pinch zoom/accessibility: do not set `user-scalable=no`, `maximum-scale=1`, or force viewport scale in JavaScript.
- Distinguish successful CI/merge from deployed Pages version and physical-device acceptance. Live Pages smoke on an unmerged PR checks previous deployed main, not unpublished changes.
- Rollback: revert only this UI PR. Previous public media and catalogue versions remain unaffected.
