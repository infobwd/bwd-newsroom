# BWD Newsroom — App Experience v1.3: Launch, Header and Gallery Footer (15 พฤศจิกายน 2569)

**Work ID:** BN-APP-2569-04  
**Base main:** `a6c2265e9231b2d3b310e787f256fe4b8cdfcf74`  
**Branch:** `fix/app-v13-launch-header-gallery-20261115`  
**PR:** [#24](https://github.com/infobwd/bwd-newsroom/pull/24) (Merge explicitly authorized by school owner)  
**Approval:** School owner explicitly authorized this UI change and Merge in chat (15 พฤศจิกายน 2569).  
**Scope:** Cosmetic/mobile browser shell only. No news, Gallery records, approved Canva/media assets, QR, PDF, source Drive images or LINE share text changes.

## Evidence and changes
1. **Repeated Splash:** `index.html` and `gallery.html` had an unconditional inline `display-mode: standalone` test that applied the `app-launching` class on *every navigation*. With `#app-launch` and its CSS, every Gallery ↔ Home transition drew an extra splash over the iOS native startup screen. Remove the HTML overlay and the unconditional launch class. Preserve iPhone `apple-touch-startup-image` files for actual OS cold launches, and preserve skeleton loaders for each page/data/image. Keep `BWDLoading.finishLaunch()` as backwards-compatible no-op cleanup; remove 10s artificial HTML overlay timeout.
2. **Gold dot below Header:** `.brand-mark` was a one-column CSS Grid with two child items (WD text and a separate `.brand-dot`), causing a second row outside its 42px mobile height. Make the mark a flex-centered relative box; position the gold point absolutely inside the mark. Include a subtle gold → pale navy 2px masthead rule and a non-interactive top-right gradient on phone screens; touch targets/labels remain unchanged.
3. **Blank bottom strip / Gallery covered:** `assets/app-shell.css` had phone `body` bottom padding of 74px, then 110px in later v1.1 rules — *after* the dark Footer. This created a white band between Footer and fixed app Bottom Navigation. Remove body trailing padding, reserve nav-safe space inside the dark Footer, and keep Gallery content bottom separation. Preserve the 4-tab nav, scroll padding and picture lightbox behavior.
4. **PWA update:** Bump shell cache name to `v11-share-v13` so returning Home Screen users can opt into the latest CSS/JS. No image or data catalogues in Service Worker cache.

## QA and release gates
- Source & regression checks (GitHub Actions): **PASS** for initial PR head `c6430ff158c7fd0c8c6297c42742a30d7cda4eb6` at [Static QA run #43683369277](https://github.com/infobwd/bwd-newsroom/actions/runs/43683369277). Includes v1.3 contract, revised v1.2 skeleton tests, public manifest validation and prior N01/N02/Gallery/Share/PWA tests. The final documentation-only head requires a second successful CI run before Merge.
- [Live Pages smoke #43683369184](https://github.com/infobwd/bwd-newsroom/actions/runs/43683369184): **PASS for current deployed `main` baseline only**. This is not the unpublished v1.3 layout.
- Public Pages deployment status: verify separately after explicit merged PR; do not equate CI green with iPhone visual acceptance.
- Hardware QA: **NOT RUN**: actual standalone cold launch vs switching Gallery/Home, Safari, notch/Dynamic Island overlap, 360/390/430px safe area, screen rotation, bottom nav and footer at maximum scroll, reduced motion and VoiceOver. These require school iPhone/iPad review.
- No screenshots/visual previews from physical devices claimed.

## Rollback
Revert scoped PR on UI regression. Previously installed app users update on next online PWA update; native startup images are retained and unchanged. No content migrations.
