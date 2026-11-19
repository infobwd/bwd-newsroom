# N01-G — Gallery MVP QA readback checkpoint

**Checked:** 2026-11-13 (Asia/Bangkok), automation loop L0–L5
**Verified main SHA before this review:** `2ef99e9a2a7cc6a3c2f810720f8163daf4fbd20f`
**Original N01-G:** PR #5 **MERGED / CLOSED**; do not reopen or duplicate original feature work.
**Review-only branch:** `chore/n01-g-qa-readback-20261113` (not merged)
**Public content:** `data/galleries.json` is approved-only and contains no real albums (verify catalogue again before future publishing).

## L0 — Evidence readback
- GitHub API main commit SHA: `2ef99e9a2a7cc6a3c2f810720f8163daf4fbd20f`.
- GitHub API open pull requests: `[]`; PR #5: `state=closed, merged=true, draft=false`.
- GitHub Actions for that main SHA: **BWD Newsroom static QA SUCCESS**, run https://github.com/infobwd/bwd-newsroom/actions/runs/43443252014.
- GitHub Pages build/deployment workflow for that SHA: **SUCCESS**, run https://github.com/infobwd/bwd-newsroom/actions/runs/43443250480. A workflow success is **not** browser, mobile Safari or actual rendered public-route verification.
- Read fresh from main: README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT and N01_CHECKPOINT. N01_G_CHECKPOINT and README still described N01-G as draft/planned even though PR #5 merged: this checkpoint corrects the status.
- Google Drive school connector read: **BLOCKED** (`link_id must identify an eligible linked account` from Drive profile/list). Cannot verify Shared Drive contents, access, 17 PDF list or photo folder metadata in this run; do not claim inspected.
- Canva persisted design/pages: **NOT RUN** (no approved issue/design ID provided in this run; no new public issue).
- WD Books FLIP03/FLIP04 reference: **NOT RUN** (no page-turn code modified this run).

## L1–L2 — Single selected task: N01-G acceptance status reconciliation
No duplicate PR #5 and no Gallery feature rewrite. This branch updates only the checkpoint after live GitHub readback. Existing Gallery remains an empty approved-only public catalogue pending school-reviewed photos. The teacher upload/AI Chat workflow (N04-P) and PWA (N04-W) remain independent planned work; no student images, Drive originals or PDF files are imported.

## L3 — QA result table

| Check | Result | Evidence / limitation |
|---|---|---|
| Main SHA, PR #5 merge, open PR list | PASS | GitHub API readback above |
| Static tests on main | PASS | GitHub Actions run 43443252014 |
| Pages deployment workflow | PASS | GitHub Actions run 43443250480 |
| Browser-visible Gallery route/empty state | NOT RUN | External live page not accessible from this execution environment |
| iPhone/iPad Safari layout, touch, accessibility | NOT RUN | No physical device or remote browser evidence |
| Shared Drive photos/folder permissions | BLOCKED | Google Drive linked-account error |
| Canva persisted pages/export, QR parity | NOT RUN | No approved real issue selected |
| Approved album publication | NOT RUN | No school-approved album or real photos |
| Node validator local rerun | NOT RUN | No local checkout; CI pass is recorded separately |

## L4–L5 — Gate and next action
**READY_FOR_SCHOOL_REVIEW / REAL-DEVICE QA PENDING**. School review should test Gallery page on desktop/iPhone/iPad and public/incognito route; approve any individual real Gallery album/photo set separately. Do not mark approved/published, merge this review PR or expose private Drive folder links. If Drive account access is restored, read Shared Drive `ปีการศึกษา 2569/01_ภาพกิจกรรม/<BE-month>/<EVT-id>_<short-title>` with authenticated permissions and leave existing PDFs untouched. No automated public photo publication.

**Rollback:** This change is documentation-only; closing the review PR or reverting this file restores the prior checkpoint without changing the deployed Gallery.


## 2026-11-14 00:01 Asia/Bangkok — follow-up readback (L0–L5)

**Selected task:** N01-G acceptance evidence reconciliation in existing draft PR #6. This section supersedes the older Drive BLOCKED finding above, without rewriting historical observations. No new PR, no public content change, no merge.

### L0 — current source evidence
- GitHub main HEAD **`87ec0eef35b1edf9886bec60ba950b924c753cf4`**, later than the previously recorded N01-G merge SHA; latest main change is `style(n01-g): unify Gallery with Newsroom homepage`. Open PRs: **#6 only**, draft, head `1d753a5c80d88b52c52f6fac9d10796debe5d6f3` before this checkpoint update. PR #5 merged (`2ef99e9...`); PR #3 merged (`0bbfc9c...`). No duplicate feature PR.
- Read current main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN and main N01_G_CHECKPOINT; reviewed PR #6 checkpoint and Gallery HTML source.
- Main GitHub Actions static QA: **PASS** run [43451723763](https://github.com/infobwd/bwd-newsroom/actions/runs/43451723763) for current main SHA. Public Gallery catalogue `data/galleries.json`: `galleries: []`, **PASS** no real album listed.
- School Google Drive account `info@bwd.ac.th` **read access restored / PASS for listing**. The Newsroom root contains six expected folders (Brand, Canva Templates, Source Photos index, Drafts, Published, Archive). Shared Drive academic-year root contains **17 PDFs** plus the photo intake folder; total PDF metadata size **33,693,148 bytes**. Under `01_ภาพกิจกรรม/2569-11_พฤศจิกายน` is one event folder with event ID `EVT-2569-0001`; its listing contains **17 JPEG files**, total **16,445,695 bytes**. Folder and file names/IDs, private links and image bytes are intentionally omitted from this public checkpoint. No source files were moved, downloaded, or published.
- **Permission boundary:** listing is confirmed for the school account; per-file sharing/consent and public visibility are **NOT VERIFIED** (`source_visibility_status=access_not_verified`). Listing is not approval. Event metadata/date, image content, uploader provenance, duplicate checks, EXIF, student consent and Canva persisted design/page verification are **NOT RUN**. Canva discovery alone does not establish an approved canonical issue ID.
- The repository Gallery HTML source is readable from GitHub. **Rendered live GitHub Pages, actual Safari/Chrome interaction, iPhone/iPad rotation, lightbox, network/performance and keyboard accessibility are NOT RUN**; raw HTML and successful CI are not browser proof.
- WD Books FLIP03/FLIP04: **NOT RUN**; no flipbook code touched.

### L1–L3 — one safe change and QA
- **PASS**: GitHub main SHA/PR reconciliation; Drive folder structure, MIME and count readback; public empty-gallery catalogue; current main static CI.
- **NOT RUN**: local Node validator, live browser/mobile, full permissions audit, actual photo QA, Canva saved pages, student-image approval, PDF rendering.
- **BLOCKER**: N01-G acceptance requires real browser/mobile verification and school editorial/consent review. The 17 JPEG originals remain private, as do the 17 PDFs. No automatic Gallery ingestion or N04-P/PWA rollout.
- The earlier statement that the Drive connector was unavailable was specific to that previous run and is **resolved for metadata listing only**.

### L4–L5 — gate
**READY_FOR_SCHOOL_REVIEW / N01-G MOBILE AND PUBLICATION QA PENDING.** Keep this checkpoint PR #6 draft and unmerged. Next iteration should validate the actual Gallery route on desktop and mobile (or capture an explicit NOT RUN with reason), then inspect private event photo permissions/consent with school authority before proposing any individual album for approval. Never add private Shared Drive URLs or IDs to the public repo.

## 2026-11-14 02:00 Asia/Bangkok — live-source QA reconciliation (L0–L5)

**Single task chosen:** N01-G acceptance evidence update in **existing draft PR #6**. No new feature PR or publication. Previous checkpoints remain historical evidence.

### L0 — current facts (fresh read)
- **main HEAD:** `630b9638ff139cfa99c18ca2123ba78c52404f44` (newer than the prior checkpoint's `87ec0eef`). Existing open draft PRs: **#6** (`de28f39387243261078b9beabe4ee7fe6cf92afd` before this edit) and **#10** (`24cb5d3a49d2682d49c303a55f274a550ed33256`, separate first-issue Canva export preflight). Original N01-G **#5 merged**, N02-MOBILE **#3 merged**. Do not duplicate any of them.
- Current main static QA **PASS**, GitHub Actions [43472403839](https://github.com/infobwd/bwd-newsroom/actions/runs/43472403839); Pages build/deployment workflow **PASS** [43472402014](https://github.com/infobwd/bwd-newsroom/actions/runs/43472402014). These do not prove visual Safari/mobile functionality.
- Freshly read current main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT; read branch #6 checkpoint, current Gallery HTML/JS and `data/galleries.json`. **PASS:** catalogue has `galleries: []` (no real album publicly registered). N04-P and PWA remain separate future milestones.
- School `info@bwd.ac.th` Drive account: **PASS** metadata listing of six BWD Newsroom root folders and Shared Drive academic-year root (17 PDF files plus `01_ภาพกิจกรรม`). **PASS** event-folder hierarchy listing under November 2569 with an Event ID folder. No files moved, uploaded, copied, or published. Private folder IDs/URLs are intentionally excluded from this public checkpoint. `source_visibility_status=access_not_verified` remains **NOT VERIFIED** for the inspected folders/files.
- Canva design discovery returned no confirmed canonical issue design in this run. Saved design pages, persisted QA, QR comparison, and exports **NOT RUN**. WD Books FLIP03/FLIP04 **NOT RUN** (no reader code changes).

### L1–L3 — acceptance QA
| Check | Status | Evidence |
|---|---|---|
| GitHub main SHA, PR #3/#5 merged and #6/#10 open draft | PASS | GitHub branch and PR API |
| Main static CI and Pages deployment workflow | PASS | Actions runs linked above |
| Gallery HTML/JS present and public catalogue empty | PASS | GitHub main file readback |
| Shared Drive folder layout and November Event ID folder | PASS | School-account Drive listing |
| Per-file photo sharing, consent, student privacy, rights | NOT VERIFIED | Listing does not prove permission |
| Actual live Gallery HTTP rendering | NOT RUN | External page fetch unavailable from execution environment |
| iPhone/iPad Safari, lightbox, touch, orientation, performance | NOT RUN | No real-device/browser session |
| Local Node Gallery validator rerun | NOT RUN | Only remote CI evidence collected |
| Canva persisted pages, PDF/photo visual and QR QA | NOT RUN | No approved canonical issue or export |
| Approved Gallery publication | NOT RUN | No school-reviewed album |

### L4–L5 — gate and next step
**READY_FOR_SCHOOL_REVIEW — N01-G real-browser/mobile and photo-rights QA still pending.** Preserve PR #6 as **draft**; no main merge or Pages change. Next run should obtain actual browser/mobile evidence (including Safari iPhone/iPad) or a documented device QA artifact, then inspect event-file sharing and school consent before any public album proposal. Existing 17 PDF files remain untouched. PR #10 is independent and must not be treated as an N01-G duplicate.


## 2026-11-14 04:02 Asia/Bangkok — N01-G source-photo readiness QA (L0–L5)

**One selected task:** verify the existing November Event ID source-photo inventory and privacy boundary; append results to existing **draft PR #6** only. This is not a new N01-G implementation or an approval to publish.

### L0 — fresh evidence
- Main HEAD: `630b9638ff139cfa99c18ca2123ba78c52404f44`; open draft PRs: **#6** (QA checkpoint) and **#10** (separate Canva preflight). PR #5 (N01-G) and #3 (N02-MOBILE) already merged; no duplicate PR.
- Read current main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT, and PR #6 checkpoint. The public `data/galleries.json` remains `galleries: []`.
- School-account Drive metadata listing confirmed the Newsroom root's six folders, Shared Drive academic-year root with **17 original PDFs** and `01_ภาพกิจกรรม`, November year-month folder, and one event subfolder with ID `EVT-2569-0001`. Existing PDFs were not moved or changed.
- Directly listed the event folder **this run**: **17 files, all `image/jpeg`, total 16,445,695 bytes**, each marked `can_download=true` and **all 17 `source_visibility_status=access_not_verified`**. These are metadata-only observations; they do **not** establish image safety, parental consent, public sharing rights, provenance, content suitability or authorization to publish. Private names, file IDs, links and images are deliberately omitted from this public document.
- GitHub Actions latest static QA for current main: [run 43472403839](https://github.com/infobwd/bwd-newsroom/actions/runs/43472403839) **SUCCESS**; Pages workflow for same main: [run 43472402014](https://github.com/infobwd/bwd-newsroom/actions/runs/43472402014) **SUCCESS**. PR #6 latest pre-edit static QA: [run 43488075685](https://github.com/infobwd/bwd-newsroom/actions/runs/43488075685) **SUCCESS**. A workflow success is not live/browser or device QA.
- Canva canonical approved issue/design ID and persisted page/export validation: **NOT RUN** (no approved news issue selected). WD Books FLIP03/FLIP04: **NOT RUN**, since reader mechanics were unchanged.

### L1–L3 — QA and decision
| Test | Status | Evidence |
|---|---|---|
| Actual main, draft PR list, public Gallery catalogue empty | PASS | GitHub branch/PR/content readback |
| 17 PDFs preserved in academic-year root | PASS (metadata) | School Shared Drive root listing |
| Event ID hierarchy, 17 JPEG MIME entries and aggregate size | PASS (metadata) | Direct school-account event folder listing |
| All 17 photos explicitly approved for public release | **NOT VERIFIED** | All 17 visibility statuses are `access_not_verified`; no school consent/release record read |
| Image bytes, EXIF/GPS, face/privacy review, duplicate detection | NOT RUN | No original image bytes fetched |
| Live Gallery HTML rendering, Chrome/Safari/iPhone/iPad interaction, performance and keyboard | NOT RUN | No actual browser/device run in this iteration |
| Canva saved design/pages, QR and PDF visual parity | NOT RUN | No canonical approved issue |
| Local Node validator | NOT RUN | Remote static QA above is separate |

### L4–L5 — gate and next action
**READY_FOR_SCHOOL_REVIEW / N01-G real-device QA and rights evidence pending.** Keep PR #6 **draft and unmerged**. The next independent acceptance task should collect desktop and iPhone/iPad screenshots/interaction evidence for the public Gallery empty state (navigation, search, filters, lightbox disabled without albums, focus, rotation and Safari safe areas). Before any real event album proposal, school authority must verify rights and consent **per image**, check image bytes and GPS EXIF, and approve the exact selected photo set. N04-P teacher upload must not bypass this gate. No public images, PDF, Drive URLs, private file IDs or secrets were committed.

**Rollback:** documentation-only update in PR #6; no deployed application behavior or Drive contents changed.


## 2026-11-14 06:00 Asia/Bangkok — first public Gallery readback (L0–L5)

**One selected task:** reconcile N01-G acceptance checkpoint with **newly published** Gallery evidence on actual main. This supersedes earlier statements that the public Gallery is empty; historical entries above describe earlier snapshots. No feature PR, publication, or merge performed in this iteration.

### L0 — fresh source evidence
- **Main HEAD:** `6f5a89bc7c0a0509c3261ecaa584e42dc62c75bd` (PR #14 merged). Open draft PRs: **#6** (this QA record, head `2aa59a79e7e9e39ba1041d32cf1799ba7946d1b1` before this update) and **#15** (Drive-first WebP/chat-led publishing documentation). Earlier PR #10 is now **merged**, not open. PR #5 (N01-G feature) and #3 (mobile reader) remain merged.
- **New substantive changes since last checkpoint:** PR #11 merged first newsletter `WDNEWS-2569-0001`; PR #13 merged **first public Gallery** `WDGAL-2569-0001` with **five published WebP photos** and explicit publication timestamps in public JSON; PR #14 merged automated live Gallery/photo-asset smoke checks. These are *repository publication records*, not proof that original private files are safe to republish elsewhere.
- **Public Gallery catalogue is NO LONGER EMPTY:** `data/galleries.json` schema 1 now lists **one** published gallery, event `EVT-2569-0001`, with five approved-version photo entries and local `assets/galleries/...` paths. Previous assertions of `galleries: []` are obsolete.
- Main SHA GitHub Actions **static QA SUCCESS** [run 43518219545](https://github.com/infobwd/bwd-newsroom/actions/runs/43518219545), **live Pages smoke SUCCESS** [run 43518219331](https://github.com/infobwd/bwd-newsroom/actions/runs/43518219331), **Pages deployment SUCCESS** [run 43518218173](https://github.com/infobwd/bwd-newsroom/actions/runs/43518218173). The smoke workflow is stronger than CI alone but is not an iPhone/iPad Safari visual or touch test.
- Read current main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT, and this draft-PR checkpoint. Canva search identified existing master/template/draft designs, including draft issue `WDNEWS-2569-0001` design `DAHa0P1ymZs`; **saved-page visual, export parity, QR and consent verification NOT RUN** this iteration. Canva thumbnail URLs were not reused as assets.
- School `info@bwd.ac.th` Drive listing **PASS** for Newsroom six root folders and academic-year root's four categorized subfolders; `01_ภาพกิจกรรม/2569-11_พฤศจิกายน` now contains **two event-ID folders**, `EVT-2569-0001` and **new `EVT-2569-0002`**. This iteration did not enumerate event photo bytes or verify per-image permissions. The old PDF inventory was **not independently recounted** this iteration; existing PDFs were not moved, deleted or published by this run. Private Drive IDs and URLs intentionally omitted from public checkpoint.
- WD Books FLIP03/FLIP04 **NOT RUN**, as this task did not modify page-turning.

### L1–L3 — acceptance QA
| Check | Status | Evidence / limitation |
|---|---|---|
| Actual main SHA and open draft PR #6/#15 | PASS | GitHub API |
| PR #11/#13/#14 merged and public Gallery contains one album/five photos | PASS | GitHub merged PR and current main catalogue readback |
| Main static CI, live Pages smoke, Pages deployment | PASS | Three Actions runs linked above |
| Authenticated school Drive root/year/month event-ID folder listing | PASS (metadata) | Two event folders; no private IDs stored |
| Source photo sharing/consent, EXIF, public suitability | NOT VERIFIED | School editorial approval record and image bytes not independently reviewed here |
| Physical iPhone/iPad Safari, rotation, touch, image rendering | NOT RUN | No real device/browser session in this iteration |
| Canva persisted saved-page QA, QR parity, PDF visual review | NOT RUN | Design discovery only; no export inspection |
| Local Node validator | NOT RUN | Remote Actions test evidence recorded separately |

### L4–L5 — gate and next action
**READY_FOR_SCHOOL_REVIEW — real-device/mobile and source-rights evidence pending.** The first album **is already public from PR #13**; do not claim an empty public Gallery or try to reverse publication without a separate explicit safety decision. Preserve this PR #6 as **draft/unmerged**. Next independent task: review actual published five-photo Gallery on iPhone/iPad Safari (layout, image loading, lightbox, keyboard and touch) and audit exact source-photo consent/rights and EXIF with school authority; independently assess the new event `EVT-2569-0002` before any proposed publication. No additional photos, PDF files, Drive links or secrets were published by this checkpoint.


## 2026-11-14 08:03 Asia/Bangkok — current public catalogue reconciliation (L0–L5)

**Single task:** N01-G acceptance/status reconciliation on existing **draft PR #6**. This entry supersedes older statements above that the public Gallery is empty. No new PR, no publication or main merge.

### L0 — verified fresh sources
- GitHub main HEAD **`529d17dacc3de0bb2280ee4f4325f0b1e9c49fbb`**. Open draft PRs **#6** (this QA checkpoint) and **#15** (Drive-first WebP/chat publishing documentation). Original N01-G #5 and N02-MOBILE #3 were merged earlier. The main SHA is newer than all previous checkpoints.
- Read main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT, N02_MOBILE_CHECKPOINT and current `data/galleries.json` / `data/catalog.json`. Some baseline documentation still describes the Gallery as planned/empty; current catalogues are authoritative for **public metadata**.
- **Current public manifests:** `WDGAL-2569-0001` has **5** registered WebP photos; `WDGAL-2569-0002` has **11** registered WebP photos. Both are marked `published` with non-null `visibility_approved_at`. `WDNEWS-2569-0001` and `WDNEWS-2569-0002` are also marked `published`. These are *metadata claims*, not independent evidence of consent or school authorization.
- Main SHA GitHub Actions **PASS**: static QA [43531529386](https://github.com/infobwd/bwd-newsroom/actions/runs/43531529386), live Pages smoke [43531529398](https://github.com/infobwd/bwd-newsroom/actions/runs/43531529398), Pages deployment [43531527815](https://github.com/infobwd/bwd-newsroom/actions/runs/43531527815). Workflow smoke PASS is not physical iPhone/iPad Safari proof.
- School-account Drive metadata **PASS**: Newsroom root contains six expected folders; academic-year Shared Drive root has `01_ภาพกิจกรรม`, `02_จดหมายข่าวย้อนหลัง_PDF`, `03_ภาพเว็บ_รอตรวจ`, `04_ภาพเว็บ_เผยแพร่`. November 2569 photo folder contains two Event ID folders `EVT-2569-0001` and `EVT-2569-0002`. Private IDs/links are deliberately not recorded in this public checkpoint. The original PDFs were not moved or changed.
- Canva saved canonical design/pages, exported image parity and QR: **NOT RUN**; no Canva edits. WD Books reference: **NOT RUN** because no flipbook code changes.

### L1–L3 — QA
| Check | Result | Evidence / limitation |
|---|---|---|
| Actual main SHA and two existing draft PRs | PASS | GitHub branch and PR API |
| Public Gallery/issue catalogue readback | PASS | 2 galleries / 16 photo entries; 2 published issue entries |
| Main static CI, Pages smoke, deployment workflows | PASS | Three successful runs above |
| School Shared Drive folder layout and Event ID presence | PASS | School-account metadata listing |
| Browser-rendered visual/touch, Safari iPhone/iPad, performance | NOT RUN | No real-device or browser session performed in this loop |
| Per-photo consent, authorization, GPS/EXIF and image visual QA | NOT VERIFIED | Published manifest flags do not independently prove source rights |
| Canva persisted design, export and QR parity | NOT RUN | No canonical design inspection this loop |
| Local Node validator re-execution | NOT RUN | GitHub Actions evidence used, not a local checkout |

### L4–L5 — gate and next action
**READY_FOR_SCHOOL_REVIEW — published content exists; source-permission and real-device QA remain unverified.** Do not describe the public Gallery as empty. No automatic photo upload, no additional public manifest, no modification of published images, no merge/deploy. Preserve PR #6 draft. Next loop should prioritize independent permission evidence and iPhone/iPad Safari Gallery review for the two existing published albums; investigate any mismatch before proposing more images. Keep private Drive URLs, source photo identifiers and consent records out of the public repository.


## 2026-11-14 09:57 Asia/Bangkok — publication-permission audit gate (L0–L5)

**One scoped task:** Reconcile public publication metadata with actual school Drive permission evidence, without changing public content. Existing draft PR #6 retained; no new PR, main merge, deploy or photo upload.

- **L0 PASS (repository readback):** Read current main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT, N02_MOBILE_CHECKPOINT, and actual public `data/galleries.json` / `data/catalog.json`. Open PRs remain #6 and #15. Baseline README/N01_G_CHECKPOINT still contain historical 'empty Gallery' language: current public JSON is authoritative.
- **L1:** Prioritize N01-G **permission/evidence reconciliation** before N04-P rollout. Public JSON currently lists two `published` albums (5 + 11 = 16 WebP photo entries) and two `published` WDNEWS issues. Both issue records also contain `public_pdf_url` pointing at local site PDFs. These manifest fields alone do not independently establish photo consent or PDF school approval.
- **L2/L3 PASS:** Read school-account Drive folder listings for the academic-year source and Newsroom root. Academic-year root includes `01_ภาพกิจกรรม`, `02_จดหมายข่าวย้อนหลัง_PDF`, `03_ภาพเว็บ_รอตรวจ`, `04_ภาพเว็บ_เผยแพร่`; Newsroom root includes six expected editorial folders. **Visibility/anonymous access NOT VERIFIED** for Shared Drive folders because Google did not return sufficient permission metadata (`access_not_verified`). Newsroom folders were listable; their listing is not a public-release authorization. No files moved or altered.
- **L3 NOT RUN:** Real iPhone/iPad Safari, browser visual/touch/performance, per-photo EXIF, independent consent/rights records, public PDF contents and per-file release authorization, saved Canva design/pages, and local Node validator. No fresh CI execution claimed.
- **L4:** Checkpoint-only update in existing draft PR #6. No source/photo/public manifest modifications; previous production content unchanged.
- **L5 READY_FOR_SCHOOL_REVIEW:** School authority must audit **all 16 publicly indexed images and both public issue PDFs** against exact permission/approval evidence and real rendered output; if a privacy mismatch is confirmed, handle via separately authorized corrective release. Next loop: verify specific published assets and real-device Gallery/reader behavior; only then proceed to N04-P teacher upload implementation.


## 2026-11-15 08:03 Asia/Bangkok — Drive-first WebP derivative metadata audit

**One selected task:** inspect the existing first Gallery event's Drive-first approved-derivative folder for actual file metadata and privacy boundaries; update existing draft PR #6 only. This is a read-only audit plus checkpoint correction, not publication authorization.

### L0 — fresh source readback
- Read main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT and public `data/galleries.json`; read existing PR #6 checkpoint and PR #15. PR #3 and #5 are merged; PR #6 and #15 remain open **draft**. PR #18 is merged as commit `f300fb7094f89bddbca12902c69114b9fa106f4d`, but this run did **not** independently resolve current main HEAD; do not equate a discovered commit with HEAD.
- Current main public catalogue has **two `published` Gallery records, 16 image entries total**. This is a publication *manifest state*, not independent proof of photo consent, anonymous asset delivery or browser/device QA. Historical empty-catalogue statements above and in main README are obsolete.
- School account metadata listing: Newsroom root has six expected folders; academic-year Shared Drive root has four categorized subfolders (activity photos, historical PDFs, review derivatives, published derivatives). Folder visibility metadata remains `access_not_verified`; no blanket-public permission inferred. Original 17-PDF count was **not recounted** this run.

### L1–L3 — direct derivative inventory QA
| Check | Result | Evidence / limitation |
|---|---|---|
| First event approved-derivative folder exists | PASS (metadata) | Direct school-account Shared Drive listing, event-ID subfolder |
| 10 expected derivative files | PASS (metadata) | Five `photo01..05-web-v01.webp` plus five matching `photo01..05-thumb-v01.webp` |
| MIME and byte sizes | PASS (metadata) | All 10 `image/webp`; full-image bytes 430368, 309692, 278396, 367376, 377338; thumbnail bytes 64724, 47650, 48650, 51988, 53226 |
| Anonymous file access and public delivery | **NOT VERIFIED** | All ten have `source_visibility_status=access_not_verified`; no unauthenticated `image/webp` response checked |
| Image content, EXIF/GPS, checksum, school consent | NOT RUN | No image bytes or release records inspected |
| Live Pages, iPhone/iPad Safari, lightbox, touch, performance | NOT RUN | No rendered-browser/device evidence in this iteration |
| Local Node validators, Canva persisted pages, PDF visual parity | NOT RUN | No local build, selected Canva issue or PDF processing in this iteration |

### L4–L5 — gate
**READY_FOR_SCHOOL_REVIEW.** The direct Drive listing corroborates PR #15's *file count/MIME* for the first-event WebP derivatives, but does **not** clear public access or consent gates. Keep PR #6 and #15 draft; no new N01-G PR, merge, deploy, source-photo move, permission change or Gallery manifest edit. Next action: obtain anonymous per-file delivery evidence and school image-rights approval; independently run live browser/mobile QA. The existing published catalogue should be treated as already public-facing, not as an empty demo.


## 2026-11-15 — live access and Drive-connection gate recheck

**One selected task:** N01-G public Gallery and school Drive access verification, without changing media, publication state, or deployment.

- **L0 PASS (readback):** Fetched main README.md, AGENTS.md, docs/MASTER_PLAN.md, docs/DATA_AND_STORAGE.md, docs/PUBLISHING_AND_QA.md, docs/AI_DEVELOPMENT_LOOP.md, docs/GALLERY_CHAT_UI_PWA_PLAN.md, docs/N01_G_CHECKPOINT.md and this existing PR #6 checkpoint. GitHub open PR search returned #6 and #15; no duplicate N01-G PR created. This pass did not independently resolve main HEAD SHA or run CI; those are NOT VERIFIED/NOT RUN.
- **L1:** Retain N01-G access/privacy QA as highest priority before N04-P teacher uploads.
- **L2/L3 BLOCKED (Drive):** Attempted authenticated folder listings for school-selected academic-year Shared Drive and BWD Newsroom root. Both calls failed with `link_id must identify an eligible linked account`. No current file-level permissions, image bytes, MIME, or consent evidence can be inferred from this attempt. Prior inventory evidence remains historical, not reconfirmed today.
- **L3 NOT VERIFIED (live Pages):** Attempted external GET/read of `/bwd-newsroom/gallery.html` and `/bwd-newsroom/data/galleries.json`; the web inspection tool returned inaccessible/internal error for both. This is an inspection limitation, not proof of site outage, HTTP 404, or broken images.
- **L3 NOT RUN:** Real Safari iPhone/iPad, rendered lightbox/swipe/performance, EXIF/GPS and actual image consent, anonymous per-file WebP delivery, PDF approval, Canva persisted saved pages, local JS/schema validators and new CI execution.
- **L4:** Checkpoint-only documentation update in existing draft PR #6; no app/public manifest/assets, Drive permissions, PDF or originals changed; no merge/deploy.
- **L5 READY_FOR_SCHOOL_REVIEW:** Restore eligible school Drive connection for authenticated metadata and per-file release audit; obtain independent anonymous image delivery and real-device QA. School approval of photo/PDF release remains a separate gate. Do not proceed to automated N04-P publication.


## 2026-11-15 10:01 Asia/Bangkok — school Drive folder reconciliation and public QA boundary

**Selected work:** N01-G source/derivative location and access-gate audit. No public content or permissions changed.

- **L0 PASS:** Read main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT and data/galleries.json. GitHub open PR search returned existing #6 and #15. Main README and checkpoint are historically stale; public manifest contains two published Gallery records. Main HEAD SHA was not independently resolved this run.
- **L1/L2 PASS (authenticated folder listing):** School Google Drive connection `info@bwd.ac.th` worked. Academic-year Shared Drive root has four folders: `01_ภาพกิจกรรม`, `02_จดหมายข่าวย้อนหลัง_PDF`, `03_ภาพเว็บ_รอตรวจ`, `04_ภาพเว็บ_เผยแพร่`. Newsroom root has six expected editorial folders. Approved-web-derivative folder contains three event/issue subfolders (WDGAL-2569-0001, WDGAL-2569-0002, WDNEWS-2569-0002). Activity-photo root contains month `2569-11_พฤศจิกายน`.
- **L3 PASS (PDF inventory):** Direct listing of `02_จดหมายข่าวย้อนหลัง_PDF` shows historical `1.pdf` through `17.pdf` all present, plus five other files: WDNEWS-2569-0002 issue-v01 PDF, two draft PDFs, two draft PNGs. Historical 17 PDFs were not moved or modified. File names and MIME are metadata evidence, not approval or contents QA.
- **L3 NOT VERIFIED (permissions):** Google returned `access_not_verified` for the relevant folders/files; this does not imply blocked access or permission to publish. No anonymous per-file read test or independent release authorization was completed.
- **L3 NOT VERIFIED (public site):** HTTPS attempts for live Gallery HTML, JSON, and a WebP image failed at DNS resolution in the execution environment. No HTTP status, browser rendering or outage conclusion can be inferred.
- **L3 NOT RUN:** Real-device iPhone/iPad Safari, photo EXIF and consent, PDF page/content verification, Canva saved pages, local validator/CI, and web image performance.
- **L4:** Checkpoint-only commit in existing draft PR #6; no new PR, public assets/manifest edit, merge, deploy or Drive share change.
- **L5 READY_FOR_SCHOOL_REVIEW:** Verify individual photo/PDF publication rights and anonymous public delivery; perform real-device Gallery QA before N04-P release. Keep all original and draft folders restricted.


### 15 Nov 2026 12:03 Asia/Bangkok — L0/L3 state audit, N04-P dual-Google-identity gate

- **L0 PASS (source readback):** Read current main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT, and actual \`data/galleries.json\`. GitHub commit search's latest returned commit is \`1dce71fe5e9ddb266df87b20c3b1c4a4bbe27f13\` (Merge PR #22, 15 Nov 2026 04:53 UTC); **main HEAD itself not independently verified** by branch-ref API. Open PR search returned #6 and #15, not old #5. Main N01-G checkpoint still contains pre-merge claims; treat as stale historical text.
- **L1 selected:** N01-G evidence/QA reconciliation on existing PR #6, not a second Gallery PR or production N04-P build. Public Gallery manifest contains two records marked \`published\` (not an empty Gallery); status labels alone do not establish original photo consent or anonymous public delivery.
- **L2 PASS (private Drive metadata read):** School account \`info@bwd.ac.th\` successfully listed both designated Drive roots. Academic-year root retains four top-level folders (activity originals, historical PDFs, pending web images, published web derivatives); legacy Newsroom root remains accessible. No files, permissions or publication statuses changed.
- **L3 NOT VERIFIED:** Returned Drive metadata has \`source_visibility_status=access_not_verified\`; no public per-file permission/consent audit. No physical Safari/Android, anonymous live Pages, EXIF, Canva persisted-design, local Node validator or PDF-content QA this run. Previous checkpoint's 17-PDF inventory is prior evidence, **not re-listed in this run**.
- **New N04-P requirement recorded:** School and personal Gmail identities both permitted to authenticate, but uploader access requires private allowlist + server-side RBAC; deny unapproved Gmail. Native teacher interface stays on GitHub Pages; backend choice pending actual authenticated cross-origin upload and restricted Drive-write feasibility tests. Architecture decision committed on same PR #6 branch at \`2c4e750e938290109132cb38fd607752c05e005d\`.
- **L5 READY_FOR_SCHOOL_REVIEW:** Obtain evidence of photo-by-photo publication authorization and real-device/live browser QA; separately perform P0 identity and upload security spike before N04-P production. No merge, deployment, new public media, credential change or permission change.


## 2026-11-15 19:56 Asia/Bangkok — live main/PR drift gate
- **Verified main HEAD via GitHub compare API:** \`d8e187f2f490bce298ad6bcd96f8ba172b786a85\` (Merge PR #32, BWD Notify). This replaces earlier "main SHA not verified" claims for this checkpoint.
- **Open PRs:** #6 (this QA docs branch) and #15 (Drive-first WebP pilot). PR #5 was merged at \`2ef99e9a2a7cc6a3c2f810720f8163daf4fbd20f\`; do not duplicate N01-G.
- **Important merge gate:** comparing \`main...chore/n01-g-qa-readback-20261113\` reports \`diverged\`, branch **13 ahead / 165 behind**, merge-base \`2ef99e9a...\`. This is a **stale PR branch**. Reconcile/rebase against current main and review only the intended documentation diff before any merge; never force-update main or blindly merge this branch. Comparison lists changed \`docs/GALLERY_CHAT_UI_PWA_PLAN.md\` and \`docs/N01_G_CHECKPOINT.md\` only.
- **Manifest truth:** main \`data/galleries.json\` currently contains 2 albums marked \`published\`; historical "empty gallery" language is stale. Manifest status is **not** independent school image-consent evidence.
- **School Drive readback:** authenticated school account can list both original Newsroom root and academic-year root; the latter contains \`01_ภาพกิจกรรม\`, \`02_จดหมายข่าวย้อนหลัง_PDF\`, \`03_ภาพเว็บ_รอตรวจ\`, \`04_ภาพเว็บ_เผยแพร่\`. Folder visibility reports \`access_not_verified\`; public anonymous permissions remain NOT VERIFIED. PDF file-by-file inventory not rechecked this run; do not infer deletion or completeness from root listing.
- **QA:** PASS — GitHub main SHA via compare, PR discovery, main source docs and manifest read, school Drive root listing. NOT VERIFIED — image-by-image approval, anonymous image delivery. NOT RUN — physical iPhone/Android, local Node validators, persisted Canva design inspection. Public Gallery URL request via web tool returned inaccessible from tool environment; **not** proof of site outage or live PASS.
- **L1/L5:** N01-G QA reconciliation remains the one selected task. READY_FOR_SCHOOL_REVIEW for media rights and device/live QA; no new image, merge, deploy or permission change. Next: review 165-commit drift and rebase PR #6 safely, then test live Gallery and mobile/permissions with real evidence. N04-P P0 identity policy (school Google + personal Gmail, private allowlist) remains planned only.


## 2026-11-15 21:55 Asia/Bangkok — L0/L3 source drift verification
- **L0 PASS:** Compared known merged N01-G SHA \`2ef99e9a2a7cc6a3c2f810720f8163daf4fbd20f\` to current \`main\`: GitHub reports \`main\` **186 commits ahead**, none behind. Independently compared \`main...chore/n01-g-qa-readback-20261113\`: verified **main HEAD \`e3e568e0095d7d7627f64b2ad4d6709c34ce3192\`**, PR #6 branch **14 ahead / 186 behind**, diverged at original N01-G merge commit. The previous checkpoint's 165-behind figure is obsolete. Do not blindly merge/rebase without review.
- **PRs:** current open search returns **#6 and #15 only**. No duplicate N01-G PR created. Current \`main\` README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT, \`data/galleries.json\` and issue-gallery-link checkpoint read. Main N01_G_CHECKPOINT remains a historical pre-merge snapshot and must not be treated as live PR state.
- **Manifest:** current main Gallery manifest contains two gallery records; their \`published\` flags are not proof of image-by-image authorization, public anonymous delivery or real-device acceptance.
- **School Drive:** account \`info@bwd.ac.th\` successfully listed academic-year and legacy Newsroom roots, plus \`01_ภาพกิจกรรม\`, which currently contains month folder \`2569-11_พฤศจิกายน\`. Root also contains historical PDF, pending derivative and published derivative folders. **No contents, ACLs or originals modified.** This is a folder listing only; 17 PDF inventory and per-file anonymous permission/consent remain NOT VERIFIED this run.
- **L1 chosen task:** N01-G evidence/PR-drift reconciliation on existing PR #6. **L2:** recorded refreshed source evidence in this checkpoint only, not app/media changes. **L3 PASS:** GitHub compare/PR/file reads and Drive folder listings. **L3 NOT VERIFIED:** anonymous live Pages, student-image permission/consent, PDF inventory, Canva persisted pages. **L3 NOT RUN:** Safari/Android hardware, Node validators, end-to-end N04-P identity/Drive upload. No inference from historical CI.
- **L5 READY_FOR_SCHOOL_REVIEW:** current branch is 186 behind main; first reconcile PR #6 against current main without losing newer work. Next collect anonymous Gallery/asset QA and school photo approval evidence. Do not merge, deploy, change ACL, upload or auto-publish.


## 2026-11-15 23:58 Asia/Bangkok — L0/L3 new public-manifest drift
- **L0 PASS:** Fresh GitHub compare shows main advanced **6 commits** since verified SHA `e3e568e0095d7d7627f64b2ad4d6709c34ce3192`; fresh comparison `main...chore/n01-g-qa-readback-20261113` reports **15 ahead / 192 behind**. PR search still returns only open #6 and #15. Read current main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT and Gallery manifest. No duplicate N01-G PR.
- **L1 selected task:** N01-G release-evidence and branch-drift reconciliation, not N04-P implementation. **L2:** update this existing PR #6 checkpoint only; do not touch media/public manifests, merge, deploy or ACLs.
- **L3 PASS:** Current `data/galleries.json` has **three** records (not two): `WDGAL-2569-0003`, `WDGAL-2569-0002`, `WDGAL-2569-0001`, all marked `published`. Record 0003 has a 2026-11-15 23:33 +07:00 approval/publication timestamp in JSON; this is *metadata only*, not independent consent or anonymous-live delivery proof. Fresh school-account Drive root listings confirmed `ปีการศึกษา 2569` contains photo, PDF, pending derivative and published derivative folders; legacy Newsroom root retains template/source/draft/published/archive folders. Canva WDNEWS design search returned draft designs; persisted page contents were not inspected.
- **L3 NOT VERIFIED:** independent image consent, public per-file access and anonymous Gallery/live asset delivery. Public `gallery.html` web fetch was inaccessible to the checking tool, which is not evidence of outage. **NOT RUN:** real iPhone/Android device QA, local Node validator, authenticated school/personal Gmail upload and per-file ACL inspection. Existing 17 PDF inventory not re-counted.
- **L5 READY_FOR_SCHOOL_REVIEW:** reconcile 192-behind PR #6 without blind merge; obtain image-level authorization and real-device/live QA, especially for newly present gallery 0003. Do not infer approval from `published` fields. No new PR, media release or permission changes.


## 2026-11-17 18:00 Asia/Bangkok — live-source readback (L0–L5)

**Selected work:** N01-G acceptance evidence reconciliation in existing draft PR #6 only. Original PR #5 and N02-MOBILE PR #3 remain merged. No duplicate PR or public content change.

- **L0 PASS:** GitHub main HEAD `01270ad5f39e97b5eda50212cdb3d5bcfd319a93` (PR #37 merged). PR #6 and PR #15 remain open/draft; PR #3 and PR #5 merged. Read current main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT and `data/galleries.json`, plus existing PR #6 checkpoint.
- **L1 PASS:** Selected the outstanding N01-G acceptance/checkpoint task, not N04-P implementation. Main Gallery manifest now includes published `WDGAL-2569-0004`, linked to `EVT-2569-0004`, with eight listed WebP images. Earlier checkpoints describing an empty Gallery are historical, **not current**. Manifest fields alone do not independently prove individual photo consent or a successful public-browser render.
- **L2 PASS (metadata only):** School-account Drive read confirms BWD Newsroom root and academic-year Shared Drive root. BWD Newsroom root metadata returns `anyone=writer` (public edit permission): **confirmed security risk**, no permission changed. Academic-year Shared Drive permissions are `null` / `access_not_verified`; do not infer public visibility or consent. Its four current top-level folders include activity originals, PDF archive, pending web derivatives and published web derivatives. No source photos or PDFs moved, copied or published. Private Drive IDs deliberately omitted.
- **L3 PASS:** GitHub main SHA, individual PR state, source documentation, Gallery manifest structure readback and Drive root permission metadata. **NOT VERIFIED:** school consent per photo, anonymous read-only access to Shared Drive derivatives, and actual live Pages Gallery. **NOT RUN:** local Node validator, iPhone/iPad Safari, Android/desktop interactive visual QA, accessibility/performance, persisted Canva pages and PDF/reader regression. No new CI or deployment claim.
- **L4:** This documentation-only checkpoint is recorded on existing PR #6 branch; do not merge the branch without explicit owner approval. The branch is historically behind main and must be reconciled before any future merge.
- **L5: READY_FOR_SCHOOL_REVIEW.** Prioritize remediation of confirmed `anyone=writer` permission with school authorization; separately verify public Gallery and image consent, then continue N04-P guarded teacher intake. Never auto-publish teacher uploads or put private folder links/credentials in Pages.


## 2026-11-19 10:04 Asia/Bangkok — school risk acknowledgement and continued N01-G QA (L0–L5)

**School decision (chat):** The school owner explicitly acknowledges and accepts the previously reported Drive permission risk for continuing development. **Scope:** proceed with safe QA/documentation work; this is **not** authorization to keep public edit access indefinitely, grant permissions, publish additional student photos/PDFs, mark assets approved, merge PRs or deploy. The confirmed `anyone=writer` ACL remains an **OPEN SECURITY RISK**, not a PASS.

- **L0 PASS:** Fresh GitHub commit search: main HEAD `01270ad5f39e97b5eda50212cdb3d5bcfd319a93` (merged PR #37). Open PR search returns #6 (existing N01-G QA) and #15 (Drive-first pilot); no duplicate PR. Re-read main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT and `data/galleries.json`; read this PR #6 checkpoint. Main README and main N01_G_CHECKPOINT contain stale pre-merge/no-gallery statements and must not override current manifest/commit evidence.
- **L1:** One task only: reconcile N01-G acceptance/risk status in existing PR #6 checkpoint. N04-P upload implementation deferred.
- **L2 PASS (read-only):** School-account Drive metadata confirms legacy BWD Newsroom root has `anyone=writer`, `source_visibility_status=permission_metadata_available`. Academic-year Shared Drive root listing confirms four source/derivative/PDF category folders; permissions for listed Shared Drive items are `null` with `access_not_verified` (insufficient metadata, not proof of blocked access or consent). No ACL, files, manifest or public website changed. No private folder links/IDs stored here.
- **L3 PASS:** Current GitHub main commit/PR readback, required governance file readback, current manifest contains `WDGAL-2569-0004` / `EVT-2569-0004` with eight WebP photo entries, and Drive root ACL metadata. **NOT VERIFIED:** live anonymous Gallery/image delivery, image-level rights/consent, per-file public sharing. **NOT RUN:** local Node validators, physical iPhone/iPad/Android interaction, full visual/accessibility/performance QA, Canva saved-page/export/QR QA, PDF count/visual checks. A `published` JSON field is not independent school-release evidence.
- **L4:** Documentation-only checkpoint update in existing draft PR #6. No new PR, public photo/PDF release, ACL change, merge or deployment. The existing review branch is historically behind main; reconcile before any merge.
- **L5: READY_FOR_SCHOOL_REVIEW / QA PENDING.** Next task: collect independent anonymous Gallery and image-asset HTTP/browser evidence, then physical iOS/mobile interaction and per-image consent review. Keep Drive risk explicitly open and recommend narrowing `anyone=writer` separately with explicit school authorization. Retain 17 legacy PDFs and private originals untouched.

**Rollback:** revert this checkpoint-only commit in PR #6; no production files or permissions are affected.


## 2026-11-19 10:10 Asia/Bangkok — independent Live Gallery attempt and catalogue inventory

**L1 single task:** N01-G live/public Gallery QA, continuing existing draft PR #6; no feature or publication change.

- **L0 PASS:** Fresh GitHub main HEAD `01270ad5f39e97b5eda50212cdb3d5bcfd319a93`; open PRs #6 and #15. The current main `data/galleries.json` contains **four** published-marked album records: `WDGAL-2569-0001` (5 photos), `0002` (11), `0003` (6), `0004` (8): **30 photo records / 60 referenced web+thumbnail asset paths**. These are manifest entries, not live URL or consent proof.
- **L2/L3 live probe attempted:** Public `gallery.html` and `data/galleries.json` via external web reader both returned tool-level **not accessible**, without a reliable HTTP status; a separate HTTPS request from the execution container failed DNS resolution. Browser connector refused access because no originating browser/extension context was present. **Result: NOT VERIFIED**, not FAIL and not evidence of a website outage.
- **L3 PASS (source inspection):** Current Gallery validator `scripts/validate-galleries.mjs` includes published-only fields, versioned local image-path constraints, file existence checks and source/index parity. **NOT RUN:** executing Node validator, verifying all 60 referenced asset bytes/HTTP statuses, public/incognito rendering, Safari/iPhone/iPad, performance and accessibility. The static schema readback is not execution.
- **L4:** Documentation-only evidence appended to existing PR #6. No new PR, ACL adjustment, media, merge or deployment.
- **L5 READY_FOR_SCHOOL_REVIEW / LIVE QA BLOCKED BY BROWSER ACCESS:** Next obtain a browser session with the connected extension or a school-provided real-device QA capture, run the validator in a checkout/CI, and inspect all asset responses plus explicit per-photo rights. Do not automatically publish or change Drive access. The separately confirmed legacy root `anyone=writer` risk remains open.

**Rollback:** revert this checkpoint-only edit; no production behavior changes.


## 2026-11-19 12:00 Asia/Bangkok — L0–L5 manifest consistency audit (no release)

**L0:** Re-read current main HEAD `01270ad5f39e97b5eda50212cdb3d5bcfd319a93`, open PR #6/#15, README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, main N01_G_CHECKPOINT, PR #6 checkpoint, `data/galleries.json`, `data/catalog.json`, Gallery validator source and static QA workflow. School-account Drive read again confirmed the legacy root six folders and its `anyone=writer` ACL, plus the academic-year Shared Drive's four category folders. The latter returned `permissions=null` and `access_not_verified`; do not interpret that as publication authorization. No original photos or 17 historical PDFs touched.

**L1 single task:** N01-G public-manifest consistency QA, an independently executable safe check while live-browser access is unavailable.

**L2/L3 new PASS (in-memory source-data audit):** Parsed current public Gallery JSON and news catalogue. All **4 published-marked albums / 30 photo records / 60 unique WebP paths** pass the checked consistency assertions: Gallery/Event ID format, approval/published fields present, cover matches an album thumbnail, image paths constrained to their own Gallery directory with approved version suffix, SHA-256 field format, nonempty alt text, positive image dimensions, and linked news issue IDs existing in the current catalogue. **0 errors found.** This is a lightweight independent source-data audit; it does **not** execute `node scripts/validate-galleries.mjs`, inspect actual WebP bytes, validate SHA-256 against bytes, verify school consent or certify the published approval fields.

**L3 NOT VERIFIED:** Actual anonymous HTTP response for Gallery and 60 assets. External web reader could not access Gallery/JSON; do not infer site outage. **NOT RUN:** Safari/iPhone/iPad/Android interactive QA, local Node validator, accessibility/performance, Canva persisted-page visual/QR QA and PDF byte-level audit.

**L4:** Append only this evidence to existing draft PR #6. No new PR, no public asset/manifest change, no merge, no deployment, no permission adjustment.

**L5 READY_FOR_SCHOOL_REVIEW:** Obtain independent browser/CI artifact delivery evidence and actual mobile-device QA, then confirm image-level release rights. The school's acknowledgement of the `anyone=writer` risk permits development to continue, but the risk stays OPEN and does not grant image/PDF publication approval.


## 2026-11-19 14:03 Asia/Bangkok — Gallery static QA and PDF inventory delta

**Single task:** N01-G acceptance source-data and safety QA in existing draft PR #6; no new feature PR or publication.

- **L0 PASS:** Current main commit `01270ad5f39e97b5eda50212cdb3d5bcfd319a93`, open PRs #6 and #15; read current main README, AGENTS, MASTER_PLAN, DATA_AND_STORAGE, PUBLISHING_AND_QA, AI_DEVELOPMENT_LOOP, GALLERY_CHAT_UI_PWA_PLAN, N01_G_CHECKPOINT, public Gallery manifest and this branch checkpoint. Main documentation still has historical draft/no-album claims; manifest is authoritative for the current catalogue.
- **L1–L3 PASS (static manifest check, not Node execution):** 4 published-marked Gallery records, 30 photo entries and 60 WebP asset-path references. Independently checked album/event ID formats, required publication timestamp presence, each image path's local gallery prefix and WebP extension, and SHA-256 field format: **zero detected errors** in these specific checks. **NOT RUN:** repository Node validator, actual file hashes, 60 image HTTP/MIME/byte responses, browser/mobile rendering.
- **L2–L3 PASS (authenticated school Drive metadata):** Legacy Newsroom root has six expected folders and retains confirmed `anyone=writer` permission (OPEN SECURITY RISK). Shared Drive academic-year root has four category folders with `access_not_verified` visibility metadata. The **PDF archive folder currently contains 22 files: original `1.pdf`–`17.pdf` all still present, three additional named PDF exports, and two PNG draft exports**. Thus the prior shorthand “17 PDFs total” is outdated: there are **20 PDFs**, of which **17 are the protected historical set**. Newer exports' DRAFT names are not approval or publication evidence. No file was moved, modified or exposed.
- **L3 PASS (Canva saved data read):** Design `DAHbHxLxopo` is titled `WDNEWS-2569-0004` and marked DRAFT, one saved 794×1123 page, with Mittraphap Games 2569 text. **NOT RUN:** saved-page visual inspection, PNG export parity, QR check, rights review. No temporary thumbnail URL was reused.
- **L3 NOT VERIFIED:** Live public Gallery reader was inaccessible via web reader; container DNS resolution failed; connected browser requires an originating browser context. These are tool-environment limitations, **not proof of site failure**. Per-photo rights, consent and per-file public ACL remain unverified. Real Safari/Android QA NOT RUN.
- **L4:** Append factual checkpoint only to existing PR #6; no main merge, Pages deploy, ACL change, PDF/asset upload, public manifest edit or automatic approval.
- **L5 READY_FOR_SCHOOL_REVIEW:** Prioritize live anonymous Gallery/asset tests when a browser context is available, run Node validator on checkout/CI, review image-level consent, and separately remediate legacy `anyone=writer` with explicit permission-change authorization. The 17 historical PDFs remain untouched.

**Rollback:** revert this documentation-only checkpoint commit; no production behavior changed.


## 2026-11-19 15:56 Asia/Bangkok — branch divergence and QA tooling boundary

**L0 PASS:** Re-read current main SHA `01270ad5f39e97b5eda50212cdb3d5bcfd319a93`, open PR #6/#15, all eight governance/readme files and existing branch checkpoint. GitHub compare `main...chore/n01-g-qa-readback-20261113` reports **diverged, 21 commits ahead and 195 behind**; merge base `2ef99e9a2a7cc6a3c2f810720f8163daf4fbd20f`. Diff lists only `docs/GALLERY_CHAT_UI_PWA_PLAN.md` and `docs/N01_G_CHECKPOINT.md`. Do not merge stale PR #6 blindly.

**L1 selected task:** N01-G independent live-delivery/QA feasibility check, no N04-P deployment.

**L2/L3 evidence:** Reattempted public `gallery.html` and `data/galleries.json` with an independent web reader; both returned tool-level inaccessible, without trustworthy HTTP status (**NOT VERIFIED**, not outage proof). Direct container `git ls-remote` failed DNS resolution for github.com; this environment cannot run checkout-based Node validator. GitHub `fetch_file` on a WebP failed with UTF-8 decode error, so binary asset bytes/HTTP content type and SHA-256 **NOT VERIFIED** by that connector. GitHub combined status and commit workflow-runs queries for current main returned empty arrays; this is **NOT VERIFIED** CI, not CI failure. GitHub comparison and metadata checks **PASS**. School-account Drive metadata read again: legacy Newsroom root still `anyone=writer` (risk accepted for continued work, not remediation), academic-year Shared Drive permissions `null` / `access_not_verified`, four expected top-level folders present. No file-level approval inferred.

**L4:** Checkpoint-only edit to existing PR #6; no duplicate PR, production asset, ACL, deployment, or main change.

**L5 READY_FOR_SCHOOL_REVIEW / QA PENDING:** Obtain independent real browser/CI runner and physical iOS/Android evidence; verify asset HTTP 200, content type, image dimensions, cache, privacy and per-image school approval. Rebase/reconcile review branch against main only with conflict-aware review. Keep 17 original PDFs and private originals untouched.

**Rollback:** revert checkpoint commit only.
