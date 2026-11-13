# Published Gallery manifests (N01-G)

This folder holds **only** event Gallery JSON records explicitly approved for public release; do not store drafts, source photos, Google Drive file/folder IDs, uploader identities, student data or confidential approval evidence here.

- Public ID: WDGal in uppercase format \`WDGAL-2569-0001\`, corresponding to one approved album.
- Source record: \`data/galleries/WDGAL-2569-0001.json\` with the full approved manifest.
- Generated public index: \`data/galleries.json\` (must include the exact approved source records).
- Each record references an event ID \`EVT-2569-XXXX\` and *derived* images exclusively under \`assets/galleries/<gallery-id>/\`.
- \`status=published\`, \`visibility_approved_at\`, \`approved_version\` and \`published_at\` are all required. Gallery approval is **separate** from newsletter approval.
- Each photo has stable public \`photo_id\`, thumbnail and reader path, alt text, width/height and SHA-256 of the published reader image. Cover is a thumbnail from the same record.
- Test fixtures belong in \`tests/\`, never in this public folder. An empty catalogue is intentional until a real album is approved.
- Run \`node scripts/validate-galleries.mjs\` and \`node tests/n01-gallery.test.mjs\` before staging the site. The secured editorial importer will later generate this approved-only output.

Use \`docs/GALLERY_CHAT_UI_PWA_PLAN.md\` and \`docs/PUBLISHING_AND_QA.md\` for workflow and consent gates. Do not expose Drive thumbnails or original image URLs to public Pages.
