# BWD Newsroom — Sharing v1 checkpoint (15 พฤศจิกายน 2569)

**Work ID:** BN-SHARE-2569-01  
**Base main:** `4be003da2d3d68ad3c5fb7cac3ad8b2fef1fe69b`  
**Branch:** `feat/line-share-newsroom-20261115`  
**PR:** [#22 — LINE Sharing v1](https://github.com/infobwd/bwd-newsroom/pull/22)
**Status:** Feature implemented with passing source-only CI; **not approved for merge/public release by this request**.  
**Assets:** Only existing approved `data/catalog.json` issue records, page WebP and PDF. Source images, QR, Canva/Drive, IDs and approvals remain untouched.

## Working share flows

- On opening an approved published issue, `assets/share.js` prepares JPEG `File` objects from the same-origin approved WebP page(s) using Canvas. This only happens on the local user's device; the conversion does not write personal media to a server.
- The main image share button is enabled only when image preparation succeeds and `navigator.canShare({files})` is true. A real click invokes `navigator.share({files,title,text,url})` synchronously from user interaction. The OS target picker is user-controlled. LINE may **drop the accompanying text** when receiving media; a successful promise means handing off to share UI, **not delivery confirmation**.
- Separate **Copy text + open LINE** button copies approved news summary + share link and navigates to official `https://line.me/R/share?text=...`. LINE recipient choice and final Send remain the user's action. This route shares text/link, not image bytes.
- Copy text and download first approved news page as JPEG remain available even if native file sharing is unsupported. Original Flipbook and approved PDF download preserved.
- Per-news `share/WDNEWS-*.html` pages contain static article-specific OG title, description and `og:image` pointing at existing publicly approved **WebP** files. These are issue-specific rather than fragment-only links. Readers are client-side redirected back to canonical `/#issue=...`. LINE may not render WebP images reliably on every client; a future publication export should provide approved JPEG/PNG social previews and a LINE on-device check.
- Use `node scripts/generate-share-pages.mjs` after adding a newly approved issue. Run `node scripts/generate-share-pages.mjs --check` in CI; never generate for drafts/unapproved issues.

## LIFF Share Target Picker — blocked external setup, do not claim enabled

True image + text messages directly through the LINE picker require a school-owned LINE Login channel, LIFF ID/endpoint and shareTargetPicker consent, plus publicly reachable JPEG/PNG URLs for **both** original and preview images within LINE limits. The connected environment has no verified school LIFF ID or consent. Do **not** ship a fake ID, temporary previews, token, or promise of automatic image+text delivery. Integrate only after school account approval and LINE test.
Documentation: https://developers.line.biz/en/docs/liff/developing-liff-apps/ and https://developers.line.biz/en/reference/messaging-api/#image-message

## QA / release gates

- GitHub Actions source tests: **PASS** on [run 43678444755](https://github.com/infobwd/bwd-newsroom/actions/runs/43678444755) for head `839cca7da37190d549452aa237e52fdc1733f3e0` (JS syntax, approved catalogue, static share page sync, regression and share contracts). A subsequent documentation-only head still requires the final check.
- Existing live Pages baseline smoke **PASS** on [run 43678444683](https://github.com/infobwd/bwd-newsroom/actions/runs/43678444683). It does NOT verify unpublished share UI/OG previews.
- Real iPhone Safari, LINE app native file share, LINE text share, LINE spider OG images, LINE installed/PWA mode and Android: **NOT RUN** until release/device QA.
- Confirm photo appears as a real LINE chat attachment and verify accompanying text separately; never infer from browser share promise or link preview alone.
- Merge/deploy: **NOT AUTHORIZED in this turn**; prior explicit merge requests applied to older PRs only.
- Rollback: revert PR; no public catalog migration. Update PWA shell version as needed for returning clients.
