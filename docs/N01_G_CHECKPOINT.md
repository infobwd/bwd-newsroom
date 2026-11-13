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
