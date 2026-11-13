# N01-G — Public Gallery MVP checkpoint

**Date:** 13 November 2026 Asia/Bangkok
**Branch:** feat/n01-g-public-gallery
**Base:** main (following merged docs-only PR #4)
**Status:** DRAFT PR #5 OPEN; GitHub Actions static QA PASS; school visual/release approval and real-device/live QA still pending. No student images imported or published.

## Implemented in this branch
- \`gallery.html\`: standalone Gallery route within existing BWD Newsroom top navigation; search/year/category filters, empty/error states, album view and full-screen photo dialog.
- \`assets/gallery.css\`: navy/gold/Kanit editorial design, 360–430px, iPad and desktop styles, accessible focus, preserved image aspect ratios.
- \`assets/gallery.js\`: only records marked published + approved are rendered; album URL \`#album=<gallery-id>\`, Thai date, caption/alt, keyboard arrows/mobile swipe, related published issue links; no private Google Drive images in browser.
- \`data/galleries.json\`: intentionally empty approved-only public catalogue; no fabricated event, real student images or public private-folder metadata.
- \`data/galleries/README.md\`: publication record contract for future approved \`WDGAL-...\` records.
- \`scripts/validate-galleries.mjs\` and \`tests/n01-gallery.test.mjs\`: public-only IDs/dates/approval/version/photo dimensions/SHA/file-path/privacy guard, source/index parity, mock-only security fixtures, DOM wiring checks.
- \`index.html\` and \`assets/styles.css\`: Gallery entry points on existing Newsroom home; unchanged N02-MOBILE reader and books pipeline.
- CI workflow: Node Gallery syntax/schema/fixtures alongside existing N01/N02 checks.

## Privacy and status gates
- Public Gallery is completely empty until a real reviewed Gallery is approved. Existing 17 school Drive PDFs are untouched; they are not automatically source photo albums.
- Teacher upload, AI image curation through ChatGPT, Canva photo transfer and PWA are **N04-P/N04-W**, NOT implemented by N01-G.
- Do not publish \`data/galleries/*.json\` containing drafts/unapproved photos or private Drive IDs. Public asset paths must use \`assets/galleries/WDGAL-.../\` and versioned compressed local images.
- This branch does not alter reader.html, assets/reader.js, reader.css or GitHub Pages settings.

## QA evidence to collect
- GitHub connector readback / diff: PASS — 12 scoped files on branch versus main, no N02 reader changes.
- Node: \`node --check assets/gallery.js && node --check scripts/validate-galleries.mjs\`
- Data and regression: \`node scripts/validate-galleries.mjs && node tests/n01-gallery.test.mjs\`.
- Existing N01/N02 tests: PASS in the same GitHub Actions job (validated job id 131934220862, conclusion success).
- Manual desktop/iPhone/iPad/real image Gallery visual/touch QA: NOT RUN.
- Deploy/live Pages: NOT VERIFIED; no newly approved album.

## Next gates
1. Follow Draft PR #5 (https://github.com/infobwd/bwd-newsroom/pull/5); initial Actions CI completed successfully. Any fixes stay in the same PR.
2. School reviews Gallery empty-state design and mobile interaction.
3. Merge code only after school release approval. Merge does not authorize any real student photos.
4. Secure teacher upload (N04-P) may follow independently after the empty public Gallery UI is stable.
