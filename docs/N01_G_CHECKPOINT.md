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
