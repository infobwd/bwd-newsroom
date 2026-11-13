# BWD Newsroom — Unified Photo Gallery, Chat Workflow, UI & PWA Plan
**Plan ID:** BN-PLAN-20261113-GALLERY-CHAT-PWA
**Date:** 13 November 2026 (Asia/Bangkok)
**Status (updated 14 Nov 2026):** N01-G Gallery and its first approved five-photo album are published; project-chat photo curation has been used for this pilot. Teacher upload web UI, Drive-hosted public image delivery, automatic syncing and offline PWA remain **NOT IMPLEMENTED**.
**Repository:** infobwd/bwd-newsroom
**Related milestones:** N01-G (public Gallery), N02-MOBILE (preserved), N03 (unchanged), N04-P (chat/photo workflow), N04-W (PWA)
**Change boundary:** extend existing N00–N04; do NOT create a duplicate Photo Hub product, new repository, separate AI selection dashboard or parallel publication database.

## 1. Decision and non-overlap map

| Existing capability | Extension | Owner/source of truth |
|---|---|---|
| N01 searchable approved WD'NEWS issues | **N01-G** approved activity albums, photos, linked issues | GitHub public approved manifests only |
| N02 bookshelf, StPageFlip and N02-MOBILE immersive reader | Preserve existing reader and touch geometry; link from Gallery, do not rebuild it | Existing reader code / approved books |
| N03 half-month/month/semester/year PDF compilation | Reuse approved high-res issue exports, never original album thumbnails | Existing issue/book manifest and Drive masters |
| N04 guarded Drive ingestion and publishing | **N04-P** teacher submissions + ChatGPT-mediated selection/approval + secure import; **N04-W** PWA | Private Drive originals and private intake registry; GitHub public snapshots |
| Canva WD-01..WD-05 | Select approved images by event for an issue; canonical issue design ID, one design per issue | Canva design workspace |

One event may produce a Gallery only, a WD'NEWS issue only, or both. Separate explicit publication decisions for Gallery photo set versus issue pages. No event content becomes public merely because a teacher uploaded it or an AI selected it.

## 2. End-to-end editor flow (chat is the control plane)

1. Teacher opens a mobile upload link (may arrive in school LINE group), authenticates, selects an existing event or creates a proposed event with event date/title/short description and uploads multiple images. The upload UI shows previews, progress, retries, duplicates, and adds to an existing event without repeated form entry.
2. Authorized server-side uploader stores ORIGINALS in school-owned Google Shared Drive under year/month/event; writes a private event/file registry with upload provenance and permission flags. Public site NEVER handles write credentials.
3. School owner asks in ChatGPT: “วิเคราะห์ภาพกิจกรรม [event] คัด 20 รูปสำหรับ Gallery และ 5 รูปสำหรับ WD’NEWS พร้อมเหตุผล”. An authorized connector/editor job reads *actual image bytes* and metadata, not filenames alone, with bounded batches and documented inability when image access is unavailable.
4. AI returns reviewable thumbnails, per-photo reason (focus, light, composition, story coverage, diversity, near-duplicates, orientation), a suggested cover and captions, plus a “needs manual safety/publication check” flag. No facial identification, no inference about student identity; inspect rights and privacy before sending sensitive images to external models.
5. The school owner reviews the proposed set **in chat**, may exclude/add images, and explicitly approves the Gallery selection and/or the newsletter selection separately. Do NOT build a second AI Curator Dashboard.
6. Authenticated publish job derives resized clean WebP/JPEG thumbnails and reader images from approved originals; strip GPS EXIF; validate file hashes and manifest; stage a reviewed PR for public images/JSON and preview. No raw Drive thumbnails/hotlinks.
7. After owner authorizes public release, merge/deploy and verify public/incognito live URLs. A ChatGPT reply MUST report actual GitHub commit/PR, release status, live Gallery URL and any QA not run; never claim published from approval alone.
8. Canva workflow reuses the SAME event photo IDs and approved subset, creates/updates one canonical issue design per WDNEWS ID, checks saved-preview/export and then enters existing issue/PDF/book publishing pipeline.

**Chat commands accepted semantically:** find event/folder; analyze photos; compare selections; choose Gallery cover; show review; approve/reject individual photos; approve public Gallery; use selected photos in Canva; check publication status; revise an already-published album as a versioned change. Never treat vague “choose pictures” as permission to make private student photos public.

**Scope limitation:** ChatGPT turns are interactive, not a continuously running uploader/publisher; any future recurring or event-triggered processing must be configured explicitly through a supported backend/automation. If connector cannot return original image bytes, pause AI visual scoring and show truthful blocker rather than ranking by filename.

## 3. Single event and data model

- **Event ID**: `EVT-2569-0001` (BE display, generated unique; independent of folder name); ISO date `YYYY-MM-DD` for sorting, Asia/Bangkok timezone.
- **Private registry** (Drive/authorized editor storage): event_id, title_th, date, category, capture_date, private_source_folder_ref, image records [private_drive_file_id, mime, sha256, dimensions, upload_time, uploader, permission_review, ai_suggestion, private_selection_state], moderation and approval log. Do not commit this raw registry to public GitHub.
- **Public Gallery ID**: `WDGAL-2569-0001`. Public manifest `data/galleries/<gallery-id>.json` with gallery_id, event_id (non-sensitive stable key), title_th, date, description_th, category/tags, cover, public photos [immutable derivative path, width/height, alt_th, caption, content hash], linked_issue_ids, approved_version, visibility_approved_at, published_at and revision. No private Drive IDs, teacher accounts, consent notes, tokens or internal comments.
- **Public issue** remains `WDNEWS-2569-XXXX` and `WDBOOK-...` per existing contracts; optionally add `event_id` and `related_gallery_ids` as cross-references without making Gallery a precondition for news.
- An event is not identical to a public gallery; Gallery and issue approvals, versions and approved image subsets are **independent**. Stable IDs allow changes to be audited without renaming files silently.
- Publication state machine for event asset: RECEIVED -> CURATED -> READY_FOR_REVIEW -> APPROVED_FOR_GALLERY/APPROVED_FOR_ISSUE (separate) -> STAGED -> PUBLISHED; rejected/private assets stay private. Only approved+published public manifests enter the site catalogue.

**Drive organization:** preserve school-selected Shared Drive academic-year folder `ปีการศึกษา 2569` and its 17 existing PDFs intact; within it create a photo intake folder such as `01_ภาพกิจกรรม/<BE-month>/<event-id>_<short-title>` only when implementation is authorized. The pre-existing Newsroom `03_Source_Photos` folder is a logical reference/shortcut/index, NOT an independent copy of the same originals. Keep draft/approved/high-res Canva/PDF folders separately per DATA_AND_STORAGE. Never put private IDs/URLs in public docs/config.

## 4. Architecture and boundaries

- **Teacher upload interface:** small authentication-protected mobile-first web form hosted by Google Apps Script or equivalent vetted server-side backend; school-account authority performs Shared Drive operations, verifies real user permissions (do not assume identity information is always available in Apps Script execution modes), logs uploader and uses bounded batches / retry for big uploads. Do NOT collect private student information beyond what activity submission needs.
- **Chat/editorial workflow:** use authorized Google Drive + GitHub + Canva capabilities where available. For bulk analysis, a controlled server-side worker can process authorized, minimal image bytes; keep secrets on server, never browser or public GitHub. A ChatGPT connector being present is not evidence that visual access, all image upload operations, or automated Canva exports work.
- **Public website:** static GitHub Pages `/bwd-newsroom/`; public gallery images and catalogue are build artifacts derived from approved private assets. Need only approved public data, no Supabase for initial Gallery/PWA.
- **Public gallery:** mobile-first album cards, year/month/category/keyword filters, photo grid (adaptive aspect ratios), progressive/lazy image loading, accessible full-screen lightbox, image caption/alt and a reverse link to related WD'NEWS issue/flipbook. No download of high-resolution originals by default.
- **Build pipeline:** private authorized fetch -> scan/orientation/dedup -> generate optimized derivative -> staged PR -> validation -> editorial publish gate -> GitHub Pages deploy -> real-link validation. Avoid large originals/annual PDFs in repository. Document GitHub Pages size/bandwidth and budget image count/size.

## 5. UI/UX visual direction — unify, do not redesign

Use the existing N01 public brand and CSS tokens: navy `#112b4e`, deep navy `#0b203a`, gold `#d9b15b`, white/light canvas; Kanit headings and readable Thai body (currently Noto Sans Thai fallback). Keep magazine/editorial feel rather than adding a generic enterprise dashboard.
- Desktop: top navigation (จดหมายข่าว / ภาพกิจกรรม / หนังสือรวมเล่ม / เกี่ยวกับ), restrained feature hero, card grids and album detail.
- Mobile: compact header and optional bottom navigation with safe-area padding **for browsing pages only**; avoid duplicate competing top/bottom controls. Large touch targets, meaningful empty/loading/error states, accessible focus, correct Thai line wrapping and contrast; easy return to search results.
- Gallery: first image as approved cover, date/category/photo-count, lazy thumbnails, fullscreen/lightbox with swipe and keyboard next/prev, pinch/zoom if proven on devices, shareable album link; retain aspect ratios and avoid face crops. Ask user to approve real selected images, not generated stock/demo pictures.
- Teacher upload is a *separate authenticated surface*, not a new public Newsroom tab; small steps, progress, retry, upload receipts, safe handling when network fails.
- **Preserve N02-MOBILE merged behavior:** existing full-height/100dvh safe-area immersive reader, phone and portrait iPad one A4 page, landscape iPad/desktop spread, ~760 ms paper flip, TOC bottom sheet, zoom 100–250%, scroll fallback/reduced motion. Gallery/PWA navigation MUST NOT overlay reader controls, steal swipe gestures, change StPageFlip geometry or reset current page. Reader may provide return to Gallery with current album/issue context.
- No fake publicly listed school albums. Use explicit demo-only content only in non-public test contexts.

## 6. PWA — N04-W (incremental, public-reading first)

This complements N01/N02, not a separate app and not a requirement for initial Gallery.
- Web manifest: `name`, `short_name`, `id`, `scope`, `start_url` restricted to `/bwd-newsroom/`, `display: standalone`, theme/background colors, valid 192/512 PNG and maskable icon, optional shortcuts to approved News/Gallery/Books. Keep consistent brand icon.
- Service worker scope limited to GitHub Pages project path. Precache only app shell/static CSS/JS/icons/offline fallback and tiny public assets; do not cache private source URLs, admin/upload flow, auth tokens, entire galleries, all book pages or huge PDFs.
- Public catalogues (`data/issues`, `data/books`, `data/galleries`) use **network-first** with conservative fallback and clear offline/staleness indicator. Versioned immutable thumbnails may use cache-first + bounded expiration; no blind cache of content with withdrawn publication permission.
- Offline is **read-only**: show shell, explicit offline message and optionally previously opened approved previews within storage budget; new uploads, AI selection, Canva editing and public publishing require network and authenticated server process. No claim of offline submissions.
- New service worker version prompts **อัปเดตแอป**; do not force reload mid-reading, while typing, or while an upload runs. Manage cache version, cleanup and “remove offline copies”/unpublish withdrawal strategy.
- Installation: Android/desktop conditional supported native install prompt; iPhone/iPad explicit Share -> Add to Home Screen instructions (do not promise `beforeinstallprompt` on iOS). PWA must still work in ordinary browser/LINE in-app browser; explain if installation needs Safari/browser.
- UI: mobile safe areas, offline banner, app-like nav; disable bottom nav inside immersive reader, respect reduced motion and screen readers.
- Acceptance: manifest valid/icons resolve; service worker offline shell & online refresh; scope limited to project, no broken root paths; install Android and iOS manual check; no private assets/hidden Drive IDs in cache; publication changes and revocations do not remain indefinitely stale; test iPhone Safari and iPad Safari reader before release.

## 7. Milestones, dependencies, test gates

| Work package | Description | Depends on | Exit evidence |
|---|---|---|---|
| N01-G | approved-only gallery schema, list/detail/search/lightbox, link issues | N01 shell, image approval contract | manifest tests + mobile/desktop preview + no private photo exposure |
| N04-P1 | authenticated teacher intake, private Drive registry, event ID | Drive permission model | upload/retry/duplicate/permission QA with test images |
| N04-P2 | ChatGPT photo review & curation, Gallery/issue separate approval | actual image access, event registry | visual selection evidence + owner approval log |
| N04-P3 | optimized publish pipeline, GitHub PR, cross-link Canva | N01-G, N04-P2, existing N04 guarded import | checksum/schema/assets audit + live URL verification |
| N04-W | PWA shell/install/offline policy | stable N01/N02/N01-G routes | offline/install/cache/reader nonregression QA |
| N03 | PDF book compilation | approved issues | unchanged existing N03 criteria |

Order pragmatically: document/contracts -> N01-G empty approved-only public UI -> N04-P1 secure upload -> N04-P2 selected-photo chat review -> N04-P3 publish -> N04-W PWA after UI/data stabilized. N03 can advance independently using already approved issue exports.

**Publication blockers:** no actual student photos, AI-generated model example photos, source PDFs or draft gallery content on Pages without explicit school authorization. Verify real image bytes/rights, useful Thai title/alt, image count, no leaked student ID/GPS, no accidental face crop, commit and on-device behavior.

**Rollback:** revert only affected web manifest/gallery release; preserve private Drive originals, independent WDNEWS/WDBOOK manifests and previous approved revisions. Service worker version rollback must clear stale app shell safely.

## 8. Status provenance

Verified from GitHub connected reads on 13 Nov 2026: PR #3 N02-MOBILE has merged (merge commit `0bbfc9cd8c13b9f836a6e1f9a226f2ca463f20d8`); public `index.html`, `reader.html`, `assets/styles.css`, `assets/reader.css` already carry navy/gold UI and N02 mobile reader. `sw.js` absent when checked; no PWA implementation asserted. Main README phase labels may lag actual merge status. A Pages deployment or physical device QA must be separately checked, not inferred from repository merge.

## 9. References

- `docs/MASTER_PLAN.md`, `docs/DATA_AND_STORAGE.md`, `docs/PUBLISHING_AND_QA.md`, `docs/AI_DEVELOPMENT_LOOP.md`
- `docs/N02_MOBILE_CHECKPOINT.md` and existing reader code
- MDN installability: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- MDN caching: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching

## 9. Drive-first WebP folder pilot — documented 14 Nov 2026

The school-selected Shared Drive has 17 original event images in the existing `01_ภาพกิจกรรม/<month>/<event>` tree. Separate `03_ภาพเว็บ_รอตรวจ` (internal candidates) and `04_ภาพเว็บ_เผยแพร่` (approved derivatives) now exist, and the first five approved photos' 10 versioned WebPs (thumb/full) were uploaded. This **does not** give Google Drive a verified publicly anonymous image-serving endpoint. Publication permission for a photo and anonymous HTTP access to bytes are distinct.

Maintain the current public GitHub image assets, including live tests, unless a later tested and authorized delivery route can serve stable `image/webp` bytes (without relying on private previews, cookies, temporary thumbnailLink or public source folders). The project-chat interface remains the owner-selected primary editorial control plane, not an autonomous Drive-to-public synchronizer. See [Drive-first pilot](DRIVE_FIRST_WEBP_PILOT.md) for go/no-go gates and rollbacks.
