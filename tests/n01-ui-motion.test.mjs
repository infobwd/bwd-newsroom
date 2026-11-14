import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const styles = read('assets/styles.css');
const script = read('assets/ui-motion.js');
for (const page of ['index.html', 'gallery.html']) {
  const html = read(page);
  assert.match(html, /<script defer src="\.\/assets\/ui-motion\.js"><\/script>/, page + ' loads UI motion');
  assert.match(html, /<div class="hero-art" aria-hidden="true">/, page + ' decorative art');
  assert.match(html, /class="hero-book-scene"/, page + ' has 3D scene');
  assert.match(html, /class="paper-flap"/, page + ' has opening cover');
  assert.match(html, /class="paper paper-verso"/, page + ' has visible inside cover');
  assert.match(html, /class="paper-inside"/, page + ' has readable inside page');
  assert.match(html, /class="head-nav"/, page + ' preserves site navigation');
}
assert.match(styles, /\.site-header\.is-compact/, 'compact state styled');
assert.match(styles, /position:sticky/, 'desktop navbar stays pinned');
assert.match(styles, /@keyframes bwd-book-open/, 'page-opening animation exists');
assert.match(styles, /prefers-reduced-motion:reduce/, 'reduced motion fallback exists');
assert.match(script, /window\.scrollY > 110/, 'scroll threshold with hysteresis');
assert.match(script, /passive: true/, 'passive scroll listener');
assert.match(script, /pointer: fine/, 'tilt restricted to fine pointer');
assert.doesNotMatch(read('reader.html'), /ui-motion\.js/, 'immersive reader unchanged');
assert.doesNotMatch(script, /fetch\s*\(|localStorage|drive\.google|supabase/i, 'no data or credentials');
console.log('UI motion static contracts PASS');
