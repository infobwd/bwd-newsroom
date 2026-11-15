# BWD Newsroom — Mobile UI Polish checkpoint (15 พฤศจิกายน 2569)

**Work ID:** BN-UI-MOBILE-20261115-01
**Base SHA:** `f300fb7094f89bddbca12902c69114b9fa106f4d`
**Branch:** `fix/mobile-ui-polish-20261115`
**PR:** [#19](https://github.com/infobwd/bwd-newsroom/pull/19) (draft, awaiting school approval)
**Status:** READY_FOR_SCHOOL_REVIEW after code/test review; not merged or published.

## Scope and rationale
Five supplied iPhone screenshots show an attractive navy/gold editorial layout but overly tall mobile hero, large Gallery cards and an issue modal that makes the newsletter image/controls harder to reach. Preserve brand, source assets, canonical issue/gallery IDs, QR and the merged N02 Flipbook reader.

## Changes
- `assets/styles.css`: compact phone header/hero, all four primary navigation links, shorter distance to news; responsive fullscreen issue dialog with safe-area aware non-scrolling header, independently scrollable image-first content and fixed action footer.
- `index.html`, `assets/app.js`: move existing issue actions out of scrolling body, keep copy/PDF/flipbook links, prioritize the flipbook action, reset content scroll when opening an issue.
- `assets/gallery.css`, `assets/gallery.js`: compact phone Gallery covers/cards/filter spacing, use contain rather than crop for album covers, reduce top whitespace on album detail while preserving two photo columns and full-photo lightbox.
- `tests/mobile-ui-polish.test.mjs`, `.github/workflows/static-qa.yml`: source contract regression checks in existing CI.

## QA and release gate
- Source contract QA: PASS in initial GitHub Actions run [43672815641](https://github.com/infobwd/bwd-newsroom/actions/runs/43672815641); final follow-up commit still requires its own CI.
- JavaScript syntax + existing N01/N01-G/N02 static regressions: PASS in initial CI run, final commit pending.
- Real device iPhone Safari 360/390/430px, iPad portrait/landscape, desktop: NOT RUN.
- Live Pages/incognito, keyboard focus, touch swipe, image/PDF link behavior and no horizontal overflow: NOT RUN.
- Editorial media/assets/Canva/Drive/approval: UNCHANGED.
- Deployment / merge: NOT AUTHORIZED under this change request; wait for school release approval.

## Rollback
Revert the Mobile UI Polish PR's commit if visual/device regressions appear. No public asset or content manifest migration is involved.
