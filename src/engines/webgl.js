// WebGL capability detection. `?nowebgl=1` forces the fallback (used by tests and for teachers on very old devices).
let cached = null;
export function webglAvailable() {
  if (cached !== null) return cached;
  if (new URLSearchParams(location.search).has('nowebgl')) return (cached = false);
  try { const c = document.createElement('canvas'); cached = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch { cached = false; }
  return cached;
}
