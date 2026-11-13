# WD’NEWS issue-export preflight (staging only)

**Status:** developer utility, no automatic website publication  
**First issue:** \`WDNEWS-2569-0001\` | canonical Canva design \`DAHa0P1ymZs\` | event \`2026-11-08\`

## Why this exists

The Canva connector currently exposes the saved design and its photos/text, but **does not provide a verified high-resolution exported PNG or print PDF**. A Canva thumbnail, signed preview URL, Drive preview image or raw photo collage is **not** a substitute for the saved Canva export. School policy requires the official saved page, original logo/QR, correct Thai, uncropped people and authorized images.

This script makes a versioned EXIF-free WebP and a **private** JSON release-candidate report only when both the official full-resolution Canva PNG and one-page PDF are supplied together with a verified private QA file. It does not write \`data/catalog.json\`, merge a PR, deploy GitHub Pages or mark an issue published.

## Step 1: export and inspect the same Canva design

1. Open the *existing* canonical WD-04 Canva design. Do not duplicate it or change the QR without instruction.
2. Inspect saved layout visually: title, date 8 พฤศจิกายน 2569, five real event photographs, face crops, font Kanit, school name, logo, existing website/Facebook QR, footer.
3. Export **PNG (A4 portrait, high resolution; minimum 1600×2260)** and **PDF Print (A4, 1 page)** from the same saved design. Do not use the low-resolution thumbnail.
4. Store both exports only in the restricted school draft folder \`04_News_Drafts/WDNEWS-2569-0001_งานทอดกฐิน_2569-11-08\`. Compare the export with the saved design before proceeding.
5. Obtain school confirmation of the exact selected photographs' publication permission. School permission for the newsletter is separate from Gallery permission.

Existing newsletters in the school's 17-PDF historical set provide *reference* branding (including website/Facebook QR blocks), **not automatic proof** that Canva's current QR elements are identical. Never silently regenerate or alter the source QR.

## Step 2: private QA attestation

Create a local \`issue-qa.json\` next to the two exports, NOT in the public repository:

\`\`\`json
{
  "issue_id": "WDNEWS-2569-0001",
  "design_id": "DAHa0P1ymZs",
  "approved_version": "v01",
  "png_sha256": "REPLACE_WITH_REAL_64_CHAR_SHA256",
  "pdf_sha256": "REPLACE_WITH_REAL_64_CHAR_SHA256",
  "saved_canva_checked": false,
  "canva_export_checked": false,
  "thai_text_checked": false,
  "photo_crop_checked": false,
  "school_logo_checked": false,
  "original_qr_checked": false,
  "image_permission_checked": false,
  "school_editorial_approved": false
}
\`\`\`

Set each flag true only after evidence-based QA; never prefill all flags with true. For a PDF generated from a *different* design, never claim export parity.

## Step 3: stage approved web assets locally

Install \`Pillow\` and \`PyMuPDF\` (or use the GitHub Actions Python environment). Run from the repository root after files pass QA:

\`\`\`bash
python scripts/prepare-issue-export.py \
  --issue-id WDNEWS-2569-0001 \
  --version v01 \
  --design-id DAHa0P1ymZs \
  --date 2026-11-08 \
  --title "ร่วมบุญ ร่วมใจ สานสัมพันธ์วัดและชุมชน" \
  --excerpt "โรงเรียนบ้านวังด้งร่วมจัดโรงทานในงานทอดกฐินสามัคคี" \
  --source-png /PRIVATE/WDNEWS-2569-0001-v01.png \
  --source-pdf /PRIVATE/WDNEWS-2569-0001-v01.pdf \
  --qa-json /PRIVATE/issue-qa.json \
  --output-dir /PRIVATE/news-release-staging
\`\`\`

Expected outputs:

- \`assets/issues/WDNEWS-2569-0001/page-01-v01.webp\`: optimized image, max 1800 pixels wide, with metadata removed
- \`_private_release_candidate/WDNEWS-2569-0001-v01.json\`: hashes, dimensions, candidate issue data and \`STAGED_NOT_PUBLISHED\`

The script refuses approval mismatches, hash changes, low-res thumbnail input, wrong page count/ratio, invalid ID and overwriting a released version. Run \`python -m unittest discover -s tests -p test_prepare_issue_export.py -v\`.

## Step 4: separate public-release PR (not automatic)

Only after another visual check, stage the approved WebP under \`assets/issues/\`, add the vetted Thai article as searchable \`body_th\`, and populate \`data/catalog.json\` with proper \`status=published\`, \`visibility_approved_at\`, \`approved_version\` and actual \`published_at\` timestamps. Never include the private QA JSON, original Drive IDs or Canva edit link. Add PDF only via a separately approved public file link if permission and access were tested.

Run all repository validation/tests, review the scoped PR, merge under school authorization, verify deployed GitHub Pages issue and responsive reader on desktop/iPhone/iPad, then record SHA, version and live URL. Gallery remains a separately approved release.

**Rollback:** revert only the issue's website-asset + catalog publication commit. Preserve original exports and previous approved versions in restricted Drive.
