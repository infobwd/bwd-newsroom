# N02-MOBILE — Immersive Paper Reader checkpoint

**Date:** 13 November 2026 (Asia/Bangkok)
**Branch:** `feat/n02-mobile-immersive-reader`
**Base:** `main` after N01/N02 merge
**Status:** Implementation complete in feature branch; public release and device validation pending.

## Scope implemented
- Dedicated edge-to-edge digital reader: compact topbar, one-page portrait on phones and portrait tablets, two-page spread in supported landscape tablet/desktop layouts.
- Viewport-fit layout using dynamic viewport height and iOS safe-area insets.
- StPageFlip geometry calculated per device in `assets/reader-geometry.js` and tested for 440×955 iPhone, small iPhone, 768×1024 iPad portrait, 1024×768 iPad landscape, desktop.
- 760 ms page flipping with curved sheet/shadow from StPageFlip; mobile vertical touch scrolling supported.
- Safe recreation of the flip host after `StPageFlip.destroy()`, addressing the previous detached-element defect when switching reading modes.
- Next/previous, keyboard arrows, page indicator, bookmarkable page, table-of-contents dialog, detailed-info dialog, fullscreen where browser supports it.
- Zoom buttons (100–250% in 25% steps); 2-finger pinch/double-click in scroll mode. Zooming while flipping changes to scroll mode to avoid gesture conflict.
- Reduced-motion users go directly to scroll mode; reading remains functional when the StPageFlip library fails.
- Explicit demo route `reader.html?demo=1` contains text-only invented *UI demo labels*, not fake school news.
- No approved student pictures, actual PDFs, private Drive links or secret keys copied to the public branch.

## QA and approval gate
- JavaScript syntax check in development V8: PASS.
- Repository GitHub Actions now runs Node syntax, N01/N02 regressions and `tests/n02-mobile.test.mjs`; check the **actual** run result on the PR (do not infer PASS).
- Physical iPhone/iPad Safari touch QA, rotation, pinch, and visual comparison with the school-provided private 17-page PDF: **NOT RUN**.
- Publication gate: review the PR and test the demo before merge. Private source PDFs are **not** part of this PR.
- PDF corpus is in school Google Drive intake folder “ปีการศึกษา 2569” (17 files), reserved for controlled internal QA. Do not register them as published without specific school review.
- Historical sample sources have academic-year 2568 and 2569 dates; confirm metadata per actual news issue rather than inferring the public year from upload-folder name.

## Known limitations
- Browser fullscreen API may be absent on iPhone Safari; UI hides the action when unavailable. Full-height CSS still applies.
- StPageFlip is a third-party MIT canvas/HTML engine; paper thickness and physics are simulated, not fully material-based. Compare against WD Books and tune after real device QA.
- Touch two-finger zoom on the flip surface switches to the scroll surface. Pinch gesture accuracy needs physical device test.
- Use high-quality approved raster images for real PDF-derived books to preserve typography.

## Next step
1. GitHub Actions CI (and any necessary fixes).
2. School owner tests live demo only after approved PR merge/deployment.
3. Real 17-page PDF remains private, with separately approved eventual public export and issue metadata.
