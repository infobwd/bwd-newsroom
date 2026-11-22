# N01-G acceptance evidence — 2026-11-22 20:04 Asia/Bangkok

Scope: documentation-only L0–L5 readback on existing draft PR #6. No approval, public content change, merge or deployment authorized.

## L0 — verified current source
- GitHub main HEAD: `01270ad5f39e97b5eda50212cdb3d5bcfd319a93`. Original N01-G PR #5 merged (`2ef99e9a2a7cc6a3c2f810720f8163daf4fbd20f`); N02-MOBILE PR #3 merged (`0bbfc9cd8c13b9f836a6e1f9a226f2ca463f20d8`). Open draft PRs: #6 and #15; both reported `mergeable=false` at readback. No duplicate PR.
- Re-read main README.md, AGENTS.md, docs/MASTER_PLAN.md, docs/DATA_AND_STORAGE.md, docs/PUBLISHING_AND_QA.md, docs/AI_DEVELOPMENT_LOOP.md, docs/GALLERY_CHAT_UI_PWA_PLAN.md, docs/N01_G_CHECKPOINT.md and data/galleries.json. Historical README and N01_G_CHECKPOINT.md are stale (describe Gallery as planned/draft/empty); do not treat those statements as current.
- Main public Gallery manifest has **four** records marked `published`: WDGAL-2569-0001 (5 photos), -0002 (11), -0003 (6), -0004 (8); **30 listed photos total**. Manifest approval timestamps are data assertions, not independent evidence of individual image consent or school editorial approval. Do not change publication status in this review.
- For main HEAD, GitHub Actions reports SUCCESS: static QA run 43986910926, live Pages smoke run 43986910910, and Pages build/deployment run 43986910599. These are workflow results, not proof of real-device manual inspection.
- School Drive account `info@bwd.ac.th` metadata read: original Newsroom root has a permission `type=anyone, role=writer` (security concern; no permission change performed). School-selected academic-year Shared Drive root is accessible for listing and contains four top-level folders including `01_ภาพกิจกรรม`, PDF archive, pending web images, and approved web images. Shared Drive `source_visibility_status=access_not_verified` because full permission metadata was not returned. This does not mean school-account read access failed. No private Drive URLs, file IDs, student images, or consent records are stored here.

## L1–L3 — one selected task: N01-G evidence reconciliation
- PASS: current main SHA and merged/open PR readback; four published manifest records and counts; workflow conclusions; school Drive root metadata/listing.
- NOT VERIFIED: individual photo rights/consent and public visibility, anonymous live Gallery rendered image URLs, actual Safari/Android behavior, per-photo WebP quality and EXIF; persisted Canva saved design/pages (no issue design ID selected).
- NOT RUN: local Node validator, physical mobile/browser QA, PDF rasterization, WD Books page-flip regression (no page-turn changes).
- Blockers: `anyone=writer` permission on old Newsroom root requires authorized security remediation; individual image permissions and school review still required. Draft PR #6 and #15 have merge conflicts according to current PR metadata; do not merge.
- The old 13 Nov assertion of an empty Gallery is superseded by the four published records currently on main; no automatic unpublish or new publish is authorized.

## L4–L5 — gate
Status: **READY_FOR_SCHOOL_REVIEW — NOT APPROVED BY THIS LOOP**. Next round: perform anonymous/live image route and mobile acceptance QA and verify consent/permissions for individual published assets with authorized school records. Escalate overly broad Drive writer access to the school owner; do not change permissions without explicit approval. Keep existing 17 PDFs untouched, keep source photos private, and do not merge/deploy or expose hidden Drive IDs.
