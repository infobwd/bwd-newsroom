#!/usr/bin/env python3
"""Prepare a PRIVATE release candidate from a saved, QA-approved Canva PNG/PDF.

Never reads private Drive URLs, publishes directly, or writes a published record.
Run only with actual Canva exports (not thumbnail/preview images).
Dependencies: Pillow, PyMuPDF.
"""
import argparse
import hashlib
import json
import re
from datetime import datetime
from pathlib import Path

import fitz
from PIL import Image, ImageOps, ImageChops, ImageStat

ISSUE_PATTERN = re.compile(r"^WDNEWS-(\d{4})-(\d{4})$")
VERSION_PATTERN = re.compile(r"^v\d{2}$")
DESIGN_PATTERN = re.compile(r"^D[a-zA-Z0-9_-]{10}$")
QA_REQUIRED = (
    "saved_canva_checked", "canva_export_checked", "thai_text_checked",
    "photo_crop_checked", "school_logo_checked", "original_qr_checked",
    "image_permission_checked", "school_editorial_approved",
)


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def prepare(args):
    match = ISSUE_PATTERN.fullmatch(args.issue_id)
    if not match or not VERSION_PATTERN.fullmatch(args.version) or not DESIGN_PATTERN.fullmatch(args.design_id):
        raise ValueError("Invalid issue ID, version, or canonical Canva design ID")
    if int(match.group(1)) != int(args.date[:4]) + 543:
        raise ValueError("Issue Buddhist year and event ISO date do not match")
    try:
        datetime.strptime(args.date, "%Y-%m-%d")
    except ValueError as exc:
        raise ValueError("Invalid activity date") from exc

    source_png = Path(args.source_png).resolve()
    source_pdf = Path(args.source_pdf).resolve()
    qa_path = Path(args.qa_json).resolve()
    for p in (source_png, source_pdf, qa_path):
        if not p.is_file():
            raise ValueError(f"Required input missing: {p.name}")
    approval = json.loads(qa_path.read_text(encoding="utf-8"))
    if approval.get("issue_id") != args.issue_id or approval.get("design_id") != args.design_id:
        raise ValueError("Approval manifest does not match canonical issue/design")
    if approval.get("approved_version") != args.version:
        raise ValueError("Approval version mismatch")
    missing = [key for key in QA_REQUIRED if approval.get(key) is not True]
    if missing:
        raise ValueError("Release blocked by incomplete explicit QA: " + ", ".join(missing))
    png_hash, pdf_hash = sha256(source_png), sha256(source_pdf)
    if approval.get("png_sha256") != png_hash or approval.get("pdf_sha256") != pdf_hash:
        raise ValueError("Approved hashes do not match source Canva exports")

    with Image.open(source_png) as opened:
        if opened.format != "PNG":
            raise ValueError("Input must be a genuine full-resolution PNG export")
        image = ImageOps.exif_transpose(opened).convert("RGB")
    width, height = image.size
    if width < 1400 or height < 1950 or abs(width / height - 0.7071) > 0.025:
        raise ValueError("Source image must be at least 1400x1950 and A4 portrait; thumbnail is forbidden")
    pdf = fitz.open(source_pdf)
    try:
        if len(pdf) != 1 or pdf.is_encrypted:
            raise ValueError("Expected one unencrypted A4 Canva PDF page")
        page = pdf[0]
        if abs(page.rect.width / page.rect.height - 0.7071) > 0.025:
            raise ValueError("PDF aspect ratio does not match A4 portrait")
        # Both formats must be exports of the SAME saved Canva page, not merely two A4 files.
        pix = page.get_pixmap(matrix=fitz.Matrix(width / page.rect.width, height / page.rect.height),
                              colorspace=fitz.csRGB, alpha=False)
        rendered = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        if rendered.size != image.size:
            rendered = rendered.resize(image.size, Image.Resampling.LANCZOS)
        differences = ImageStat.Stat(ImageChops.difference(image, rendered)).mean
        parity_mean_abs_diff = sum(differences) / len(differences)
        # Allow ordinary PDF rasterisation anti-aliasing; reject materially different layouts.
        if parity_mean_abs_diff > 18:
            raise ValueError(f"PNG/PDF layout mismatch (mean difference {parity_mean_abs_diff:.1f})")
    finally:
        pdf.close()

    root = Path(args.output_dir).resolve()
    out = root / "assets" / "issues" / args.issue_id
    out.mkdir(parents=True, exist_ok=True)
    dest = out / f"page-01-{args.version}.webp"
    if dest.exists():
        raise ValueError("Versioned web asset already exists: use a new approved version")
    image.thumbnail((1800, 2546), Image.Resampling.LANCZOS)
    image.save(dest, "WEBP", quality=86, method=6, exif=b"")
    with Image.open(dest) as derivative:
        if derivative.size[0] > 1800 or derivative.getexif():
            raise ValueError("Public derivative verification failed")

    # This is a PRIVATE candidate, not the public published catalog.
    record = {
        "id": args.issue_id,
        "date": args.date,
        "title_th": args.title,
        "excerpt_th": args.excerpt,
        "category": "community",
        "template_code": "WD-04",
        "tags": ["กฐิน", "โรงทาน", "จิตอาสา"],
        "pages": [{
            "page_no": 1,
            "web_image": f"assets/issues/{args.issue_id}/{dest.name}",
            "alt_th": "จดหมายข่าวโรงเรียนบ้านวังด้งร่วมจัดโรงทานในงานทอดกฐิน วันที่ 8 พฤศจิกายน 2569",
        }],
    }
    qa_dir = root / "_private_release_candidate"
    qa_dir.mkdir(exist_ok=True)
    report = {
        "status": "STAGED_NOT_PUBLISHED",
        "canonical_design_id": args.design_id,
        "issue_id": args.issue_id,
        "approved_version": args.version,
        "original_png_sha256": png_hash,
        "original_pdf_sha256": pdf_hash,
        "derivative_sha256": sha256(dest),
        "source_dimensions": [width, height],
        "png_pdf_mean_abs_diff": round(parity_mean_abs_diff, 3),
        "web_dimensions": list(image.size),
        "public_record_candidate": record,
        "next_gate": "Recheck final image/QR and stage approved content with published timestamps in a separate PR; verify live Pages after merge",
    }
    report_path = qa_dir / f"{args.issue_id}-{args.version}.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return dest, report_path


def cli():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ("issue-id", "version", "design-id", "date", "title", "excerpt", "source-png", "source-pdf", "qa-json", "output-dir"):
        parser.add_argument("--" + name, required=True)
    args = parser.parse_args()
    try:
        dest, report = prepare(args)
        print(f"STAGED only (not published): {dest}\nPrivate QA report: {report}")
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        parser.exit(1, f"BLOCKED: {exc}\n")


if __name__ == "__main__":
    cli()
