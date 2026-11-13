# AGENTS.md — BWD Newsroom Implementation Guardrails

Applies to this repository and all subdirectories.

## Mission
Maintain BWD Newsroom as the public, accessible, mobile-first archive for โรงเรียนบ้านวังด้ง news issues and compiled PDF/flipbook publications. Read docs/MASTER_PLAN.md, docs/DATA_AND_STORAGE.md and docs/PUBLISHING_AND_QA.md before making changes.

## Verified integrations / context
- Public repository: infobwd/bwd-newsroom; default branch main
- Target (not yet verified live): https://infobwd.github.io/bwd-newsroom/
- Google Drive school-owned folder: "BWD Newsroom | คลังจดหมายข่าวโรงเรียนบ้านวังด้ง", with source, drafts, approved and archive subfolders. Its IDs and private contents are intentionally not in this public repo.
- Canva: each issue has one canonical design ID, templates WD-01..WD-05 are separate from actual news; the originally approved QR stays unchanged unless requested
- Reusable flipbook patterns exist in infobwd/manual (WD Books): self-hosted StPageFlip v2.0.7, corner drag, desktop spread, mobile single-page; read its FLIP-03/FLIP-04 docs rather than copy untested behavior blindly

## Nonnegotiable
1. Public content only. Never publish unapproved student/person details, private photos, Google Drive draft files, tokens, passwords, editing collaboration links or hidden source folders.
2. Only issues status=published with approved assets may appear in the public catalogue; drafts and placeholders must not be bundled into public output.
3. Keep source images in Drive; only optimized, approved web derivatives go into public assets. Avoid temporary Canva/Drive preview URLs as production img src.
4. Use stable issue IDs (WDNEWS-2569-0001) and book IDs (WDBOOK-2569-11A). Store deterministic manifest, frozen revision and checksum.
5. Canonical date is Gregorian YYYY-MM-DD with timezone Asia/Bangkok; Thai dates use B.E. +543. "รายปักษ์" = 1–15 and 16–last-day of month unless revised.
6. Do not change brand/logo/QR/Thai typography or generate fictitious news facts. Palette navy blue/yellow/gold; header Kanit.
7. For Canva changes, show preview for review before committing a Canva editing transaction; after save, inspect persisted design and exported assets.
8. Before public release test GitHub Pages subpath /bwd-newsroom/; do not assume root-relative /assets paths will work.
9. Flipbook MUST have button and scroll-reader fallbacks for iPhone/old browser and reduced-motion preferences.
10. Don't claim site live, export delivered, PR merged, or device QA passed unless actual verification supports it.

## Implementation order
N00 documentation (complete) -> N01 static news catalogue -> N02 flipbook -> N03 approved image-to-PDF biweekly book pipeline -> N04 guarded automation, annual archive and optional PWA.

## Development workflow
- Inspect current main and open PRs before changing behavior.
- Prefer small scoped branches/PRs and local-first tests.
- For implementation work: include user-visible preview and QA evidence; do not merge/deploy without explicit approval.
- No blind schema guesses: add JSON schema and tests for issues/books before consuming data.
- Include a rollback note in every significant change.
- Never commit large print-quality masters or annual PDFs into GitHub Pages unless space budget is analyzed and explicitly approved.
- Do not add Supabase/login/backend just to publish the first catalogue; it is intentionally static.
- Keep progress and limitations written in README; absence of a live site is NOT a failure hidden by optimistic labels.


## Additional rules — Gallery + Chat + PWA

Read `docs/GALLERY_CHAT_UI_PWA_PLAN.md` with the other three governance docs. N01-G, N04-P and N04-W extend existing N00–N04; do not create a second Photo Hub product or separate AI Curator Dashboard. ChatGPT is the user's photo-selection/review/publication command plane; secure teacher upload is a minimal separate authenticated surface. `EVT-...` ties one private Drive original set to independent approved Gallery and WDNEWS photo selections.

Preserve N02-MOBILE merged reader mechanics, safe areas and page geometry; UI remains navy/gold Kanit editorial style. PWA must stay on public `/bwd-newsroom/` scope and read-only offline, never storing private originals, tokens, huge PDFs, unpublished school photos or unrelated app state. Plans are not feature delivery; require actual QA, owner approval and release evidence.
