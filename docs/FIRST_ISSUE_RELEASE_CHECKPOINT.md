# WDNEWS-2569-0001 — First real issue release checkpoint

**Recorded:** 13 November 2026; updated 14 November 2026 (Asia/Bangkok)  
**Status:** `READY_FOR_QA_BLOCKED` — exports inspected, **NOT PUBLISHED**  
**Scope:** school newsletter first-issue import. This checkpoint does not authorize public media publication.

## Grounded editorial record

- Event: โรงเรียนบ้านวังด้งร่วมจัดโรงทานในงานทอดกฐินสามัคคี ณ วัดพระพุทธเมตตาอุดมธรรม อำเภอบ่อพลอย จังหวัดกาญจนบุรี.
- Event date: `2026-11-08` (confirmed by the school owner in conversation).
- Intended issue ID: `WDNEWS-2569-0001`; template: `WD-04 Photo Story`.
- One-page A4 Canva issue design exists separately from the template library and is the sole canonical issue design. Do not create another copy or publish a private edit link in this public repository.
- School's original event set contains 17 JPEGs in restricted Drive. Five photos were selected for the issue; the school owns the Canva media copies. **This does not grant consent to publish every source photo.**
- Do not expose private Drive IDs, source-folder paths, original photos or internal approval details in public assets/manifests.

## Evidence-based checks — updated 14 Nov 2026

| Check | Result | Evidence / blocker |
| --- | --- | --- |
| Event facts and date 8 Nov 2026 in saved Canva | **PASS** | Existing canonical 1-page WD-04 issue |
| Five selected event photographs | **PASS** | Media and saved export visual readback |
| Official logo, unchanged Website/Facebook QR destinations | **PASS (readback)** | Compared current export's two QR decoded destinations against previous school newsletter; both match the references |
| Thai title and body visibly readable | **PASS (visual)** | Reviewed Canva PNG and independent A4 PDF render |
| Canva PNG/PDF export received in restricted school Drive | **PASS** | PNG 1414×2000 pixels (approximately 171 DPI); 1-page A4 PDF 595.5×842.25 pt |
| PNG/PDF layout equivalence | **PASS (technical)** | Full-page mean absolute pixel difference approximately 6.405/255 after PDF rasterisation |
| Optimized web image | **STAGED PRIVATELY** | Versioned WebP approximately 371 kB; source EXIF/XMP not propagated; **not in public GitHub** |
| All photo crops and publication permission for identifiable children | **PENDING SCHOOL REVIEW** | Lower photo row shows children; school must confirm child-image policy/rights and safe crop before web publication |
| Final issue-level layout acceptance | **PENDING** | Explicit publication intent is known, but exported visual and image-rights gates require final documented acceptance |
| Public issue JSON record, GitHub image asset | **NOT STAGED** | `data/catalog.json` intentionally remains empty until review is complete |
| Live browser, iPhone/iPad, flipbook, link QA | **NOT RUN** | Requires actual published issue |

## Technical first-publication gate

- PR #9 merged into `main`, merge commit `630b9638ff139cfa99c18ca2123ba78c52404f44`. It removed test assumptions that genuine published collections must remain empty; all published-only validation remains enforced.
- Draft PR #10 adds a fail-closed, source-hash/approval-checked Canva PNG/PDF-to-WebP staging utility and synthetic CI tests. It does not publish real school photographs or change `data/catalog.json`.
- Canva image/export technical receipt is independent of any student-image disclosure rights; do not set `image_permission_checked=true` by assumption.
- The 1414×2000 Canva export is sufficient as a **web image source** but is not described as a 300 DPI print PNG; use the A4 PDF as the print source.

## Next required gates (in order)

1. School reviews the exported page specifically for faces cropped at the frame edge and confirms appropriate permissions for identifiable child photos. Do not assume the public event automatically grants permission.
2. Record final image/publication rights, approved version and approval time in a restricted register, excluding personal consent records from GitHub.
3. Check the saved Canva PNG/PDF visually one last time; if the image is revised, require a new export and new hash/version review.
4. Transfer the EXIF-free web derivative from restricted Drive into a **scoped publication PR only after the preceding gates**. Add searchable Thai `body_th` and only approved public catalog metadata; no private Drive source IDs, QR screenshots or Canva edit URLs.
5. Run all static tests, merge/deploy under school authorization, verify actual `/bwd-newsroom/` page and flipbook on mobile/iPad/desktop.
6. Gallery remains a separately approved release; private source photos are never automatically public.

**Status transitions:** `DRAFT` → `READY_FOR_QA` → `APPROVED` → `PUBLISHED` only when each gate has supporting evidence. Publishing intent alone is not proof of export, device QA or live availability.

**Rollback:** On a failed public release, revert only the issue's publishing commit while preserving Canva/Drive originals and prior approved versions. Do not touch separate PR #6 or existing N02 reader code.
