import unittest
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SIZES = [(1290,2796),(1179,2556),(1170,2532)]

class StartupImageTest(unittest.TestCase):
    def test_startup_pngs_load_and_match_iphone_resolution(self):
        for width, height in SIZES:
            path = ROOT / "icons" / f"startup-{width}x{height}.png"
            with self.subTest(path=path.name):
                self.assertTrue(path.is_file())
                with Image.open(path) as image:
                    self.assertEqual(image.format,"PNG")
                    self.assertEqual(image.size,(width,height))
                    image.load()
                    self.assertIn(image.getpixel((width//2,height//2)), range(3))

if __name__=="__main__":
    unittest.main()
