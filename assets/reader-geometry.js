/* Pure viewport model for N02-MOBILE. Kept separate for Node regression tests. */
(function (root) {
  'use strict';
  function bounded(n, low, high) { return Math.min(high, Math.max(low, n)); }
  function layout(params) {
    const stageWidth = Math.max(240, Math.floor(Number(params.stageWidth) || 0));
    const stageHeight = Math.max(230, Math.floor(Number(params.stageHeight) || 0));
    const viewportWidth = Math.max(240, Math.floor(Number(params.viewportWidth) || stageWidth));
    const viewportHeight = Math.max(230, Math.floor(Number(params.viewportHeight) || stageHeight));
    const portrait = viewportHeight >= viewportWidth || stageWidth < 820;
    const maxHeight = Math.max(180, stageHeight - 12);
    const maxWidth = bounded(Math.floor(maxHeight / (665 / 470)), 140, 470);
    const hostWidth = Math.min(stageWidth, Math.floor(maxWidth * (portrait ? 1.52 : 2.05)));
    const hostHeight = Math.min(stageHeight, Math.round(maxWidth * (665 / 470)) + 12);
    const minWidth = portrait
      ? bounded(Math.ceil(hostWidth / 2) + 2, 105, maxWidth)
      : bounded(Math.floor(maxWidth * 0.55), 105, maxWidth);
    return {
      portrait, hostWidth, hostHeight, pageWidth: maxWidth, pageHeight: Math.round(maxWidth * 665 / 470),
      minWidth, minHeight: Math.round(minWidth * 665 / 470),
      maxWidth, maxHeight: Math.round(maxWidth * 665 / 470),
      flippingTime: 760
    };
  }
  root.BWDReaderGeometry = Object.freeze({layout});
})(typeof window !== 'undefined' ? window : globalThis);
