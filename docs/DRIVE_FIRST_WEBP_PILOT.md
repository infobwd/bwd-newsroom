# Drive-first WebP pilot — BWD Newsroom (14 Nov 2026)

**Status:** FILE STORAGE VERIFIED / DIRECT PUBLIC DELIVERY NOT VERIFIED / NO SITE MIGRATION  
**Scope:** school-selected academic-year Shared Drive, the existing N01-G Gallery, first approved album `WDGAL-2569-0001`; not a new photo system or repository.

## Goal and source of truth

- Google Drive is the school-owned source of originals and may be a second, versioned store for approved **WebP derivatives**.
- GitHub `infobwd/bwd-newsroom` remains the authoritative **public publication manifest**, versions, build rules, release SHA, reader/Gallery code and live QA.
- Canva remains authoritative for the canonical WD'NEWS page designs; issue approval and public-Gallery image approval are separate decisions.
- The owner's ChatGPT **project chat** is the editorial command/review interface. A school-authorized uploader may be added if justified, but no extra AI-selection dashboard, new repo, database or secret in browser code.

## Actual Drive folder structure (names only; no private IDs/URLs in public repo)

```text
ปีการศึกษา 2569/
├── 01_ภาพกิจกรรม/
│   └── 2569-11_พฤศจิกายน/
│       └── EVT-2569-0001_งานทอดกฐิน_วัดพระพุทธเมตตาอุดมธรรม/
│           └── 17 original JPEGs (PRIVATE)
├── 02_จดหมายข่าวย้อนหลัง_PDF/
│   └── 1.pdf … 17.pdf (unchanged original file IDs)
├── 03_ภาพเว็บ_รอตรวจ/
│   └── WDGAL-2569-0001_งานทอดกฐิน_2569-11-08/
│       └── internal review bundle / candidate files (PRIVATE)
└── 04_ภาพเว็บ_เผยแพร่/
    └── WDGAL-2569-0001_งานทอดกฐิน_2569-11-08/
        ├── photo01-thumb-v01.webp … photo05-thumb-v01.webp
        └── photo01-web-v01.webp … photo05-web-v01.webp
```

**Pilot evidence:** All ten versioned, EXIF-free approved WebP derivatives have been uploaded and their presence verified by reading the last folder. Five reader images are 1600×1200; five thumbnails are 560×420. Their locally calculated SHA-256 values correspond to the approved N01-G record for the full images. The existing public GitHub-hosted version remains unchanged and verified by GitHub Actions.

## Publication permission and delivery are *two different gates*

1. **Editorial rights**: only a school-approved subset of event photos may be promoted to the approved-derivative folder; never make the original/source or review folder public.
2. **Public file access**: adding a file to a folder labelled “เผยแพร่” does **not** mean public anonymous Viewer access has been set. Check per-file `anyone with link / viewer` through authorized school controls, if policy allows. Do not make a whole folder public by default because future unapproved children could inherit access.
3. **Website image delivery**: a Google Drive `/file/d/.../view` link serves a **viewer page**, not a stable `image/webp` HTTP endpoint. API `thumbnailLink` is short-lived and not intended for direct web use because of CORS. Unauthenticated raw media may be restricted or redirected; do not use it in the public Gallery merely because the Drive Viewer link works.
4. The connected Drive sharing tool in this ChatGPT run does **not** expose “anyone with link / viewer” and file metadata could not independently confirm anonymous access. **Therefore public direct-Drive delivery remains unverified.** Do not claim the website fetches from Drive, do not change current `data/galleries.json` paths and do not expose private Drive IDs in the repo.
5. A future service/edge-cache or dedicated object image host may be tested on one file with the school's explicit approval, a public anonymous image response, bounded caching, cost/security review and revocation process. No client-side Drive tokens, CORS hacks, temporary preview or cookie-dependent link.

## Go/no-go gate for *any* migration from current GitHub-hosted media

- [ ] Named school owner approves the migration itself, not only the photo rights.
- [ ] Per-file anonymous Viewer access tested without school login; no public parent/original access.
- [ ] Image test URL returns HTTP 200 and image bytes with stable `Content-Type: image/webp`, usable for ordinary `<img>` and without expired redirects.
- [ ] Verify at least one thumbnail and full-resolution image on anonymous Chrome / iPhone Safari / iPad Safari; test reload, cache, CORS if required, mobile bandwidth and quota pressure.
- [ ] Approved, versioned public-domain allowlist + immutable mapping; publish only vetted URLs and public content hashes, never connector credentials, internal folder links or source IDs.
- [ ] Build URL/asset validation and real public HTTP smoke in a separate scoped PR; preserve local GitHub images as fallback until stable and reversible.
- [ ] Withdrawal/consent-removal test, cache invalidation and rolled-back links confirmed. No silent replacement of published `v01` URLs.

**Current decision:** `image_provider = github_pages` remains in effect. Drive WebPs are organized *storage*, not automatically a public-image CDN.

## Chat-first operating loop (manual commands, supported apps only)

1. Read current GitHub `main` + open PRs, then confirm the owner-selected Drive year/event folder and Canva canonical design when applicable.
2. Read real original image bytes, select a reviewable subset for news and a separate subset for Gallery; inspect crop, blur, student privacy, permission and duplicates. No assumptions based on filenames alone.
3. Present the review list/gallery *in chat*; seek explicit approval for new images or new public-album revision. Preserve event/image IDs and the approved version.
4. Generate and QA versioned WebP thumbnails/full images, strip GPS/EXIF and compare hashes; put candidates in `03_ภาพเว็บ_รอตรวจ`; promote only approved derivatives to `04_ภาพเว็บ_เผยแพร่` and record restricted evidence.
5. Keep publication manifest and approved URLs in GitHub, in a staged PR. Merge/deploy only after specific release authorization. Verify public Pages and actual image bytes after deployment.
6. Report exact counts, hashes, PR/commit/live status and blockers. Chat tasks are **not** automatic background synchronization; no Drive additions automatically trigger public publishing.

## Capacity guard (incremental, no new provider required)

The current released site has only a few MB of images. Record the size of `assets/galleries`, `assets/issues`, entire published output and oversized media on each release; flag review around 200 MB of published static media and reassess provider at 500 MB or earlier if traffic warrants it. These are **school policy review thresholds**, not GitHub's published service limits.

This pilot only organizes approved data. It does not implement authentication, a cloud proxy, PWA offline support or a public Drive hotlink.
