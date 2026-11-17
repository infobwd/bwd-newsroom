# WDGAL-2569-0004 — มิตรภาพเกมส์ 2569 (v01)

- Event: EVT-2569-0004; gallery: WDGAL-2569-0004; event date 2026-11-16.
- School owner explicitly authorized publishing the eight real activity photos in the public website Gallery on 2026-11-17.
- Source JPEG originals retained in restricted school Google Drive; this PR publishes 8 WebP images and 8 thumbnails re-encoded without embedded EXIF/GPS. No temporary Canva/Drive URL in public assets.
- 8 image SHA256 hashes are recorded in the approved-only public manifest. No student names included.
- Gallery is intentionally **not yet linked to** WDNEWS-2569-0004: the corresponding newsletter issue is still a draft, not published. Update linkage in a later approved issue release.
- The suggested gallery cover is the photo of event guests/administrators, not proof of a named minister. Do not identify public figures until independently verified.
- QA local preflight: image decoding and absence of EXIF/ICC/XMP: PASS; file count and paths: PASS.
- GitHub Actions CI and live Pages / anonymous / real-device checks: verify after reviewed PR and merge; do not claim from commit alone.
- Rollback: revert the scoped gallery release commit while retaining earlier approved albums.
