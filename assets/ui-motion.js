/* Shared browsing-only motion: desktop sticky/compact navbar and light hero tilt.
   Not loaded in the immersive N02 reader. No network/data dependencies. */
(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const desktop = window.matchMedia('(min-width: 901px)');
  if (header) {
    let scheduled = false;
    const syncHeader = () => {
      const compact = header.classList.contains('is-compact');
      const next = desktop.matches && (compact ? window.scrollY > 24 : window.scrollY > 110);
      header.classList.toggle('is-compact', next);
      scheduled = false;
    };
    window.addEventListener('scroll', () => {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(syncHeader);
      }
    }, { passive: true });
    window.addEventListener('resize', syncHeader, { passive: true });
    syncHeader();
  }
  const art = document.querySelector('.hero-art');
  const hover = window.matchMedia('(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!art) return;
  const resetTilt = () => {
    art.style.setProperty('--bwd-tilt-x', '0deg');
    art.style.setProperty('--bwd-tilt-y', '0deg');
  };
  let tiltFrame = 0;
  art.addEventListener('pointermove', event => {
    if (!hover.matches) return;
    if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
    tiltFrame = window.requestAnimationFrame(() => {
      const rect = art.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      art.style.setProperty('--bwd-tilt-x', (y * -3).toFixed(2) + 'deg');
      art.style.setProperty('--bwd-tilt-y', (x * 4).toFixed(2) + 'deg');
      tiltFrame = 0;
    });
  }, { passive: true });
  art.addEventListener('pointerleave', () => {
    if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    resetTilt();
  });
  window.addEventListener('resize', () => { if (!hover.matches) resetTilt(); }, { passive: true });
})();
