# BWD Newsroom — App Experience v1 checkpoint (15 พฤศจิกายน 2569)
**Work:** BN-APP-2569-01
**Base SHA:** `0e5898e803a581d5f607877c1919553577961835`
**Branch:** `feat/app-experience-v1-20261115`
**PR:** [#20 — App Experience v1](https://github.com/infobwd/bwd-newsroom/pull/20)
**Status:** User authorized implementation and merge. Static QA completed successfully; actual device tests remain pending. No new student images or issue content introduced.

## Features
- Mobile (<631px): existing desktop editorial hero remains for larger screens; phone gets compact app header, approved-only recent news/gallery home cards, news feed, books shortcut and bottom navigation.
- Navigation holds home/news/gallery/books; avoids overlaying `reader.html` or gallery full-screen lightbox; Gallery restores list scroll on return.
- N04-W shell PWA manifest scoped to GitHub Pages subpath `/bwd-newsroom/` via relative URLs, native install metadata, iOS Add to Home Screen guidance, 192/512 icons, user-triggered SW update.
- Worker caches only public HTML/CSS/JS, minimal icons and offline fallback. **No caching** of `data/`, any news/gallery/books media, any PDF, Drive URLs or private teacher upload. Reader still loads from network and retains immersive touch behavior.

## QA
- **PASS:** [GitHub Actions static QA run 43674885030](https://github.com/infobwd/bwd-newsroom/actions/runs/43674885030): JavaScript syntax, approved-only JSON validation, regression, icon sizes and public shell cache exclusions.
- **PASS (production baseline only):** [Live Pages smoke run 43674884155](https://github.com/infobwd/bwd-newsroom/actions/runs/43674884155). This does not validate the unpublished PR UI or installation.
- Live Pages loading after merge: independently check deployment and smoke.
- Actual iPhone Safari/iPad Safari, home-screen install, update handling, offline, reduced-motion, gesture/reader, and app bar safe-area: **NOT RUN until device testing**.
- Performance note: shell cache only; no permission revocation of images can be defeated by cached copies because media is excluded.
- Rollback: revert this PR, which removes SW registration; previously installed SW may remain until users revisit online. A follow-on release may use explicit unregister/cache cleanup for withdrawal. School content approvals and PDF versions unchanged.
