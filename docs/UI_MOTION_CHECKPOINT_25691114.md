# BWD Newsroom — Desktop UI Motion Polish checkpoint

- **Date:** 2026-11-14 (Asia/Bangkok) / 14 พฤศจิกายน 2569
- **Scope:** Navbar + visual hero only, News and Gallery browsing pages
- **Source branch:** `main` at `529d17dacc3de0bb2280ee4f4325f0b1e9c49fbb`
- **Feature branch:** `feat/desktop-sticky-nav-3d-hero`
- **Draft PR:** https://github.com/infobwd/bwd-newsroom/pull/18
- **Implementation head before checkpoint:** `3f7ff6d94b77dd3782889b83417008447e5efa96`
- **Editorial approval:** no content/publication change requested; school visual release gate PENDING
- **Merge / deployment:** NOT DONE

## Work performed
1. Shared desktop `site-header` sticky at top and compact (84px to 64px) with 110px down / 24px up hysteresis, subtle shadow, brand shrink and gold active underline.
2. The two existing `hero-art` illustrations become CSS 3D books: the cover opens once, pauses at an open angle and exposes inside pages. No school photos, generated fake issues, third-party animation libraries or remote previews added.
3. Fine-pointer desktop parallax is modest; no mouse motion on touch; mobile/tablet use static-open illustration; reduced-motion is static.
4. `assets/ui-motion.js` is loaded only by `index.html` and `gallery.html`, not by `reader.html`, preserving the N02-MOBILE reader.
5. Added `tests/n01-ui-motion.test.mjs` to `.github/workflows/static-qa.yml`.

## Changed files
- `index.html`
- `gallery.html`
- `assets/styles.css`
- `assets/ui-motion.js` (new)
- `tests/n01-ui-motion.test.mjs` (new)
- `.github/workflows/static-qa.yml`

## QA evidence
| Check | State | Evidence |
|---|---|---|
| GitHub persisted-file readback, two hero variants, nav anchors, static isolation | PASS | Re-read feature branch after updates; 17 source checks |
| JavaScript syntax | PASS | Parsed new JS in V8 |
| CSS delimiter consistency | PASS | Curly braces balance verified |
| CI Node script + N01/N02 regressions | PASS | GitHub Actions Static QA run #53: https://github.com/infobwd/bwd-newsroom/actions/runs/43581158427 (success) |
| Live public Pages content smoke | PASS (existing main only) | PR-triggered smoke run #17: https://github.com/infobwd/bwd-newsroom/actions/runs/43581158531 (success); this is NOT branch preview nor live UI verification |
| Desktop browser 1280+/1440 hover + scroll screenshot | NOT RUN | Browser visual session needed |
| Tablet/mobile responsive, real-device reduced motion | NOT RUN | Must verify mobile 360–430, tablet 768–1024 |
| Reader StPageFlip/zoom/touch/TOC interaction | NOT RUN | Reader files untouched is source isolation, not device QA |
| Public deployment and production browser QA | NOT DONE | PR is draft; no merge/deploy |

## Next gate
Review the visual header behavior and keyboard/scroll experience in a browser. Resolve issues within the SAME PR. Confirm UI and release before merge; after merge, verify public Pages and preserve existing two news issues and approved Galleries. Never infer browser/device QA or production adoption from CI.

## Rollback
Revert this scoped UI change through the PR/commit history. Do not replace published content, Canva source assets or N02 reader implementation.
