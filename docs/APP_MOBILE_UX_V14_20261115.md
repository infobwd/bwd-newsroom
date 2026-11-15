# BWD Newsroom — Mobile UX v1.4: Latest News Carousel & Issue Scroll Lock

**Work ID:** BN-APP-2569-05  
**Date:** 2026-11-15 (Asia/Bangkok)  
**Base main:** fed3abd74a308fedabf27619d6f6ec46ee97afc7  
**Feature branch:** feat/app-v14-latest-carousel-scroll-lock-20261115  
**Authorization:** School owner explicitly requested implementation **and Merge** in chat on 15 พฤศจิกายน 2569.  
**PR:** https://github.com/infobwd/bwd-newsroom/pull/25
**QA code-head:** de90b7c3417b94755cc08a32adc2039196f2ed0a
**Static QA:** PASS https://github.com/infobwd/bwd-newsroom/actions/runs/43686540084
**Live Pages smoke:** PASS for previous deployed main only https://github.com/infobwd/bwd-newsroom/actions/runs/43686540108

## Scope and protections

- Mobile dashboard: show up to **five** verified published issues (newest first) in a native horizontal swipe carousel with CSS scroll snap, a partially visible next card, keyboard arrows, previous/next controls and a live position indicator.
- The dashboard draws from the existing approved-only public catalogue; at implementation time it contains two published issues. Do not invent sample issues to fill five.
- Tapping the entire card opens the existing issue dialog (including approved copy, image, LINE, native share, PDF and flipbook); no parallel reader or second data store.
- Freeze background scroll at its saved Y offset while the single-issue dialog is open, contain image/action scrolling on iPhone, restore the exact position when the modal closes (including Escape and history/navigation paths).
- Compact the issue action area without hiding any functions; optional actions can scroll within that region.
- Bump public shell version so installed PWA clients can update. The service worker continues to exclude news/gallery images, PDFs, JSON catalogues and private Drive content.
- No changes to approved news assets, Canva, QR, source Drive, public content records or the N02 flipbook.

## Changes

- assets/app.js — carousel, modal background lock, scroll restoration
- assets/app-shell.css — horizontal snap cards and controls on phones
- assets/styles.css — modal-only scrolling boundaries
- sw.js — public shell cache version
- .github/workflows/static-qa.yml — add v1.4 regression
- tests/app-ux-v14.test.mjs — explicit static UI and policy contracts

## QA / release gates

- Static: JavaScript syntax checks, approved-only catalogue validators, previous N01/N02/Gallery/LINE/PWA tests and the v1.4 contracts must pass in Actions before Merge.
- Physical device verification (NOT RUN by this workflow): actual iPhone Safari and installed PWA on 360/390/430px; swipe two through five cards, buttons, browser back, modal top/bottom rubber-band lock, saved scroll return, LINE native share and orientation changes.
- Public deployment checks are separate from source tests. Merge requires explicit authorization, given here; do not report new media as editorially approved.
- Rollback: revert only this UI PR. Previously installed app users may need to approve the available PWA update on next online session.

## Release tracking

- Branch source checked against main at fed3abd74a308fedabf27619d6f6ec46ee97afc7; prior PR #24 remains intact.
- Previous app-v1.1/v1.2/v1.3 hard-coded cache-version tests were updated to accept a monotonically advancing shell version rather than freeze older releases.
- The final documentation commit must pass the same CI before Merge; record the actual merge SHA and post-merge Pages deployment separately. Physical device QA is still pending.
