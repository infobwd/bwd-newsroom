# WD'NEWS Gallery release — WDGAL-2569-0003

- School-approved instruction received 2026-11-15, timezone Asia/Bangkok: publish a six-photo album and merge the scoped PR (Gallery approval distinct from previously published WDNEWS-2569-0003).
- Event: EVT-2569-0003, 11 November 2026. Linked approved issue: WDNEWS-2569-0003; no Canva design changes.
- Six visually reviewed school Drive original JPGs remained in the restricted source folder. Only six selected images were derived; no other student photos, private IDs, original filenames, staff identities, or source permissions entered the public repo.
- 6 WebP reader images at 1599×1200 plus 6 560×420 WebP thumbnails; original proportions preserved; PIL conversion removed EXIF/GPS. SHA-256 reader image hashes recorded in canonical album JSON.
- Source/index parity: data/galleries/WDGAL-2569-0003.json and data/galleries.json; frontend reuses existing Gallery reader and WDNEWS reverse link based on linked_issue_ids.
- QA before merge: GitHub Actions Gallery validation and Node regression. Source image decode/dimension/metadata checks PASS; actual deployed Pages and iPhone/iPad browser checks remain separate gates.
- Rollback: revert this scoped gallery PR; existing approved newsletters and two prior Gallery albums unchanged.
- Base SHA: cd5510c8f43c61385e520c0d4f2bd4279516b66a; branch: publish/wdgal-2569-0003-thaifoods-v01.
