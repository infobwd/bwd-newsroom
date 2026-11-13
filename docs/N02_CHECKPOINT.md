# N02 — Bookshelf & flipbook checkpoint (13 Nov 2026)

**Loop:** BN-LOOP-20261113-N02-01  
**Branch:** feat/n02-bookshelf-flipbook  
**Base:** N01 merge ab90ebcca0aaae11d541dd0eeb7ecb913c3e7eb7  
**Scope:** Public bookshelf and single-issue/book flipbook based on WD Books StPageFlip v2.0.7 (MIT). 

## Implemented
- reader.html and reader JS/CSS: self-hosted image-based StPageFlip, desktop spread/mobile portrait where supported, next/prev, keyboard, page selector, scroll fallback and deep link page.
- Explicit demo via reader.html?demo=1. **No real news is used in demo**; placeholder pages illustrate interactions without asserting approval or publication.
- data/books.json: empty approved-only book manifest; validator and regression tests.
- index.html and assets/app.js: books section from valid manifest, demo entry point, and reader link for published news; never list private content.
- vendored StPageFlip v2.0.7 from infobwd/manual with MIT license and attribution.

## Gate and QA
- N01 main merge: completed (source code only). Live Pages URL not verified here.
- N02 static source syntax and manifest checks: see work report/PR.
- Node test invocation: pending execution in a connected runner after commit.
- Actual iPhone Safari/iPad/desktop visual and swipe QA: pending.
- No approved original photos, individual newsletters or compiled PDF imported yet.
- No fabricated news, student photos, QR, or Drive credentials published.
- N03 PDF compilation remains separate from N02.

## Next loop
Inspect latest PR/commits. Verify live GitHub Pages configuration (main/root), run Node scripts and browser/mobile QA, then publish the empty archive shell and demo reader after review. Add first genuine newsletter only after approved Canva export and school publication gate. Continue N03 build code independently if assets are unavailable.
