# WDNEWS-2569-0001 — First real issue release checkpoint

**Recorded:** 13 November 2026 (Asia/Bangkok)  
**Status:** `DRAFT / READY_FOR_QA_BLOCKED` — **NOT PUBLISHED**  
**Scope:** school newsletter first-issue import. This checkpoint does not authorize public media publication.

## Grounded editorial record

- Event: โรงเรียนบ้านวังด้งร่วมจัดโรงทานในงานทอดกฐินสามัคคี ณ วัดพระพุทธเมตตาอุดมธรรม อำเภอบ่อพลอย จังหวัดกาญจนบุรี.
- Event date: `2026-11-08` (confirmed by the school owner in conversation).
- Intended issue ID: `WDNEWS-2569-0001`; template: `WD-04 Photo Story`.
- One-page A4 Canva issue design exists separately from the template library and is the sole canonical issue design. Do not create another copy or publish a private edit link in this public repository.
- School's original event set contains 17 JPEGs in restricted Drive. Five photos were selected for the issue; the school owns the Canva media copies. **This does not grant consent to publish every source photo.**
- Do not expose private Drive IDs, source-folder paths, original photos or internal approval details in public assets/manifests.

## Evidence-based checks

| Check | Result | Evidence / blocker |
| --- | --- | --- |
| Thai article text, venue and 8 Nov 2026 date saved in Canva | PASS (text readback) | Saved design content / owner-confirmed date |
| 1 page and five inserted event photos | PASS (metadata readback) | Canva page list and saved media IDs |
| Accurate logo, unchanged official QR and QR functionality | **NOT VERIFIED** | Brand-assets source not yet available for comparison; QR design elements need manual inspection |
| Full-page visual QA, Thai wrapping, cropping/face visibility | **NOT VERIFIED** | Text and element metadata do not replace inspecting the saved raster |
| Canonical high-resolution PNG/PDF exported from Canva | **BLOCKED** | Connected Canva workflow does not expose a verified export |
| Public image consent and school editorial release record | **PENDING REVIEW** | Do not infer consent from upload or publication request alone |
| Optimized versioned web asset checked against exported Canva page | **NOT RUN** | Requires approved PNG/PDF source |
| Public `data/catalog.json` issue record | **NOT STAGED** | Remains intentionally empty until asset + editorial QA are complete |
| Browser / actual iPhone and iPad / live GitHub Pages | **NOT RUN** | Must be tested on the real published issue |

## Technical first-publication gate

The original N01/N02/N01-G regression tests assumed public collections must stay empty forever, which would reject the first genuinely approved issue, book or album. Draft PR #9 removes these fixed-empty assumptions without weakening approved-only manifest validation or exposing photos. GitHub Actions `BWD Newsroom static QA` completed **SUCCESS** on branch `fix/first-real-news-publication-gates`, run [43470110546](https://github.com/infobwd/bwd-newsroom/actions/runs/43470110546). The PR is not merged.

## Next required gates (in order)

1. Verify the existing Canva design against the school's original logo/QR and visually inspect every photo, typography, safe crop and all page elements.
2. Export a high-resolution PNG and print-quality PDF of **that same saved Canva design** and store them in the school's restricted `04_News_Drafts` folder under the issue ID. Reopen and compare both against the saved design; do not use a temporary thumbnail as the public issue image.
3. Record issue-level editorial approval, public-image rights/permission, approved version and timestamp in the restricted register.
4. Derive versioned, EXIF/GPS-free web image(s); stage only the approved derivatives and validated public record in a new reviewed publication PR. Never commit an original or a private collaboration URL.
5. Run all static tests, publish only after the approved release gate, and verify the actual `/bwd-newsroom/` news URL, thumbnail, flipbook link, reader interactions and privacy on mobile/iPad/desktop.
6. Gallery is a separate publication approval. The original album is private until individually selected images and its own approval version pass review.

**Status transitions:** `DRAFT` → `READY_FOR_QA` → `APPROVED` → `PUBLISHED` only when each gate has supporting evidence. Publishing intent alone is not proof of export, device QA or live availability.

**Rollback:** On a failed public release, revert only the issue's publishing commit while preserving Canva/Drive originals and prior approved versions. Do not touch separate PR #6 or existing N02 reader code.
