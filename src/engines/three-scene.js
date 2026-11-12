// Small, dependency-free orbit-controlled three.js scene host.
//  • three.js is loaded lazily on first use (heavy asset), from the vendored copy: no CDN needed, works offline.
//  • renders on demand (no continuous loop) → light on phone batteries; animation loops only while `playing`.
//  • pointer (mouse + touch), pinch/wheel zoom and keyboard orbit; camera presets; full dispose().
let threePromise;
export const loadThree = () => (threePromise ??= import('../../vendor/three/three.module.min.js'));

export async function createScene(host, { lowGraphics = false, reducedMotion = false, onTick, onAfterRender } = {}) {
  const THREE = await loadThree();
  const renderer = new THREE.WebGLRenderer({ antialias: !lowGraphics, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(lowGraphics ? 1 : Math.min(2, window.devicePixelRatio || 1));
  renderer.domElement.className = 'gl'; renderer.domElement.tabIndex = 0;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  const target = new THREE.Vector3(0, -0.8, 0);
  const view = { az: 0.55, pol: 1.2, r: 22 };
  const goal = { ...view };
  let raf = 0, dirty = true, tween = null, disposed = false;
  const owned = []; // geometries/materials/textures created through track()

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a94a8, 0.8));
  const sun = new THREE.DirectionalLight(0xfff4e0, 1.15); sun.position.set(6, 12, 9); scene.add(sun);
  const rim = new THREE.DirectionalLight(0x9cc4ff, 0.35); rim.position.set(-8, 5, -7); scene.add(rim);
  // Soft image-based reflections for standard (PBR) materials; skipped in low-graphics mode.
  let envRT = null;
  if (!lowGraphics) {
    try {
      const { RoomEnvironment } = await import('../../vendor/three/three-fx.esm.js');
      const pmrem = new THREE.PMREMGenerator(renderer); envRT = pmrem.fromScene(new RoomEnvironment(), 0.04); pmrem.dispose();
      scene.environment = envRT.texture; scene.environmentIntensity = 0.3;
    } catch { /* lighting above is sufficient */ }
  }

  function place() {
    const s = Math.sin(view.pol);
    camera.position.set(target.x + view.r * s * Math.sin(view.az), target.y + view.r * Math.cos(view.pol), target.z + view.r * s * Math.cos(view.az));
    camera.lookAt(target);
  }
  function resize() {
    const w = host.clientWidth || 600, h = host.clientHeight || 400;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); dirty = true; schedule();
  }
  const ro = new ResizeObserver(resize); ro.observe(host);
  function frame() {
    raf = 0; if (disposed) return;
    if (tween) {
      const k = Math.min(1, (performance.now() - tween.t0) / tween.dur), e = 1 - (1 - k) ** 3;
      view.az = tween.from.az + (tween.to.az - tween.from.az) * e; view.pol = tween.from.pol + (tween.to.pol - tween.from.pol) * e; view.r = tween.from.r + (tween.to.r - tween.from.r) * e;
      if (k >= 1) tween = null; dirty = true;
    }
    onTick?.(performance.now());
    if (dirty) { place(); renderer.render(scene, camera); dirty = false; onAfterRender?.(); }
    if (tween || api.playing) schedule();
  }
  function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(frame); }
  const api = {
    THREE, scene, camera, renderer, target, playing: false,
    invalidate() { dirty = true; schedule(); },
    track(o) { owned.push(o); return o; },
    setPlaying(v) { api.playing = v; if (v) schedule(); },
    preset(p) {
      const to = { overview: { az: 0.55, pol: 1.2, r: 22 }, close: { az: 0.3, pol: 1.25, r: 13 }, section: { az: 0, pol: Math.PI / 2, r: 21 }, top: { az: 0, pol: 0.25, r: 20 } }[p] || { az: 0.55, pol: 1.2, r: 22 };
      Object.assign(goal, to);
      if (reducedMotion) { Object.assign(view, to); dirty = true; schedule(); } else { tween = { from: { ...view }, to, t0: performance.now(), dur: 600 }; schedule(); }
    },
    project(v3) { const v = v3.clone().project(camera); return { x: (v.x * 0.5 + 0.5) * host.clientWidth, y: (-v.y * 0.5 + 0.5) * host.clientHeight, visible: v.z < 1 }; },
    dispose() {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => { x.map?.dispose?.(); x.dispose?.(); }); });
      owned.forEach((o) => o.dispose?.());
      envRT?.dispose();
      renderer.dispose(); renderer.forceContextLoss?.(); renderer.domElement.remove();
    },
  };
  // ---- orbit input (mouse, touch, wheel, keyboard) ----
  const el = renderer.domElement; const ptrs = new Map(); let pinch = 0;
  el.style.touchAction = 'none';
  el.addEventListener('pointerdown', (e) => { el.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); tween = null; if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); } });
  el.addEventListener('pointermove', (e) => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    if (ptrs.size === 1) { view.az -= (e.clientX - p.x) * 0.007; view.pol = Math.min(Math.PI - 0.05, Math.max(0.12, view.pol - (e.clientY - p.y) * 0.007)); }
    p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch) view.r = Math.min(40, Math.max(7, view.r * (pinch / d))); pinch = d; }
    api.invalidate();
  });
  const end = (e) => { ptrs.delete(e.pointerId); pinch = 0; };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('wheel', (e) => { e.preventDefault(); view.r = Math.min(40, Math.max(7, view.r * (1 + Math.sign(e.deltaY) * 0.08))); api.invalidate(); }, { passive: false });
  el.addEventListener('keydown', (e) => {
    const k = { ArrowLeft: () => (view.az -= 0.12), ArrowRight: () => (view.az += 0.12), ArrowUp: () => (view.pol = Math.max(0.12, view.pol - 0.1)), ArrowDown: () => (view.pol = Math.min(Math.PI - 0.05, view.pol + 0.1)), '+': () => (view.r = Math.max(7, view.r * 0.9)), '-': () => (view.r = Math.min(40, view.r * 1.1)) }[e.key];
    if (k) { e.preventDefault(); k(); api.invalidate(); }
  });
  resize(); place();
  return api;
}
