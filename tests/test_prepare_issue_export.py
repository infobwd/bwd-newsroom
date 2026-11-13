"""Synthetic-only checks: no real school/news images are used in CI."""
import json
import runpy
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

import fitz
from PIL import Image

MODULE = runpy.run_path(str(Path(__file__).resolve().parents[1] / 'scripts' / 'prepare-issue-export.py'))
prepare = MODULE['prepare']
sha256 = MODULE['sha256']


class ExportPreparationTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.png = self.root / 'canva-export.png'
        self.pdf = self.root / 'canva-export.pdf'
        self.qa = self.root / 'qa.json'
        Image.new('RGB', (1700, 2404), color='white').save(self.png, 'PNG')
        d = fitz.open()
        d.new_page(width=595, height=842)
        d.save(self.pdf)
        d.close()
        self.approval = {
            'issue_id': 'WDNEWS-2569-0001', 'design_id': 'DAHa0P1ymZs',
            'approved_version': 'v01',
            'png_sha256': sha256(self.png), 'pdf_sha256': sha256(self.pdf),
            **{k: True for k in MODULE['QA_REQUIRED']},
        }
        self.args = SimpleNamespace(issue_id='WDNEWS-2569-0001', version='v01',
            design_id='DAHa0P1ymZs', date='2026-11-08', title='ทดสอบ',
            excerpt='เนื้อหาสำหรับทดสอบเท่านั้น', source_png=str(self.png),
            source_pdf=str(self.pdf), qa_json=str(self.qa),
            output_dir=str(self.root / 'out'))
        self.write_qa()

    def write_qa(self):
        self.qa.write_text(json.dumps(self.approval), encoding='utf-8')

    def test_valid_approved_export_creates_private_candidate_only(self):
        output, report = prepare(self.args)
        self.assertTrue(output.exists())
        self.assertTrue(report.exists())
        info = json.loads(report.read_text(encoding='utf-8'))
        self.assertEqual(info['status'], 'STAGED_NOT_PUBLISHED')
        self.assertEqual(info['public_record_candidate']['date'], '2026-11-08')
        self.assertNotIn('status', info['public_record_candidate'])
        with Image.open(output) as web:
            self.assertLessEqual(web.width, 1800)
            self.assertEqual(web.getexif(), {})
        with self.assertRaisesRegex(ValueError, 'already exists'):
            prepare(self.args)

    def test_approval_failure_refuses_export(self):
        self.approval['original_qr_checked'] = False
        self.write_qa()
        with self.assertRaisesRegex(ValueError, 'original_qr_checked'):
            prepare(self.args)
        self.assertFalse((self.root / 'out').exists())

    def test_sha_mismatch_refuses_export(self):
        self.approval['png_sha256'] = '0' * 64
        self.write_qa()
        with self.assertRaisesRegex(ValueError, 'hashes do not match'):
            prepare(self.args)

    def test_thumbnail_refused(self):
        Image.new('RGB', (376, 532), color='white').save(self.png, 'PNG')
        self.approval['png_sha256'] = sha256(self.png)
        self.write_qa()
        with self.assertRaisesRegex(ValueError, 'thumbnail is forbidden'):
            prepare(self.args)


if __name__ == '__main__':
    unittest.main()
