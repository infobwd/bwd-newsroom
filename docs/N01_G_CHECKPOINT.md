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
