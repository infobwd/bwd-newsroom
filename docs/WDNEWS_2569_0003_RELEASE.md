# Release WDNEWS-2569-0003 — ไทยฟู้ดส์ ใส่ใจสังคม

- Event date: 2026-11-11 (โรงเรียนบ้านวังด้ง)
- Design: Canva `DAHa2gG99-8` (WD-01, persisted single-page revision)
- School publication instruction: 2026-11-15, explicit user request to publish uploaded PNG/PDF to the public site.
- Issue: `WDNEWS-2569-0003`, approved version `v01`.
- Source: Canva exported PNG 1414x2000 px, 775427 bytes, SHA-256 `86a9093e968420d9e16e71120c96b3d15e7bc6ec134ebf97a8e5ed0f2d5b8b25`.
- Source PDF: single A4 portrait page, SHA-256 `2a5b2525bf4d24b9d0cc4ff5a96391b2bf83584cf64789c3e8243efd3b584c15`.
- Public reading image: metadata-stripped PNG `page-01-v01.png`, 1414x2000 px, SHA-256 `41087ded3d84d5fe7f2a7181b1e83616dbdf5cf57303c1f331ea761539eb9bd2`.
- Public thumbnail: metadata-stripped PNG `page-01-thumb-v01.png`, 480x679 px, SHA-256 `bc29189b49818c5d73c9d246017625198605b1eafc148f8df14e9827cbe76e4d`.
- Text, 10,000 THB amount, event date and names in catalogue reproduce the received Canva export.
- Original school event photos remain in restricted Drive; no public links to source-photo folders.

## QA before merge

- PASS: user-supplied PNG and PDF read; PDF has one A4 portrait page and extractable Thai text.
- PASS: page photo positions/content, Thai names/date, official logo, school contacts and QR visibly match exported PNG/PDF; QR artwork unmodified.
- PASS: public image derivatives are stripped of PNG metadata, including Canva XMP IDs.
- PASS: published catalogue references only versioned project-local static assets; no private Drive URLs or tokens.
- PENDING: GitHub static CI and GitHub Pages live issue, PDF and mobile verification after merge.
- Note: PNG source is approximately 171 dpi, below the 300 dpi print target; original Canva PDF is retained for print and download.

School editorial approval applies to this uploaded issue only; no Gallery release or unreviewed photo album is implied.
