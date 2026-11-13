// Interactive orbit-controlled Three.js scene host with hemisphere lighting, clickable raycasting, smooth camera presets & auto-spin.
//  • three.js is loaded lazily on first use from the vendored copy: no CDN needed, works offline.
//  • renders on demand (or smoothly while playing) → battery friendly; pointer/touch drag, wheel zoom, keyboard orbit & full dispose().
let threePromise;
export const loadThree = () => (threePromise ??= import('../../vendor/three/three.module.min.js'));

export async function createScene(host, { lowGraphics = false, reducedMotion = false, onTick, onAfterRender, onPick, view: initView, autoRotate = false } = {}) {
  const THREE = await loadThree();
  const renderer = new THREE.WebGLRenderer({ antialias: !lowGraphics, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(lowGraphics ? 1 : Math.min(2, window.devicePixelRatio || 1));
  renderer.domElement.className = 'gl'; renderer.domElement.tabIndex = 0;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  const target = new THREE.Vector3(0, -0.6, 0);
  const view = { az: initView?.az ?? 0.58, pol: initView?.pol ?? 1.15, r: initView?.r ?? 21 };
  const goal = { ...view };
  let raf = 0, dirty = true, tween = null, disposed = false;
  let rotating = autoRotate && !reducedMotion;
  const owned = [];
  const pickables = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // Warm sunlit hemisphere + key sun + cool rim light for rich 3D miniature depth
  const hemi = new THREE.HemisphereLight(0xe6f4ff, 0x7e6243, 0.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff4de, 1.25);
  sun.position.set(8, 14, 10);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x90caf9, 0.45);
  rim.position.set(-10, 6, -9);
  scene.add(rim);

  function place() {
    const s = Math.sin(view.pol);
    camera.position.set(
      target.x + view.r * s * Math.sin(view.az),
      target.y + view.r * Math.cos(view.pol),
      target.z + view.r * s * Math.cos(view.az),
    );
    camera.lookAt(target);
  }
  function resize() {
    const w = host.clientWidth || 600, h = host.clientHeight || 380;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); dirty = true; schedule();
  }
  const ro = new ResizeObserver(resize); ro.observe(host);
  let lastNow = performance.now();
  function frame(now = performance.now()) {
    raf = 0; if (disposed) return;
    const dt = Math.min(0.08, (now - lastNow) / 1000);
    lastNow = now;
    if (tween) {
      const k = Math.min(1, (now - tween.t0) / tween.dur), e = 1 - (1 - k) ** 3;
      view.az = tween.from.az + (tween.to.az - tween.from.az) * e;
      view.pol = tween.from.pol + (tween.to.pol - tween.from.pol) * e;
      view.r = tween.from.r + (tween.to.r - tween.from.r) * e;
      if (k >= 1) tween = null; dirty = true;
    }
    if (rotating && !tween && !reducedMotion) {
      view.az += dt * 0.24;
      dirty = true;
    }
    onTick?.(now, dt);
    if (dirty || api.playing) { place(); renderer.render(scene, camera); dirty = false; onAfterRender?.(); }
    if (tween || api.playing || rotating) schedule();
  }
  function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(frame); }

  const api = {
    THREE, scene, camera, renderer, target, playing: false,
    invalidate() { dirty = true; schedule(); },
    track(o) { owned.push(o); return o; },
    markPickable(mesh, info) { mesh.userData.pickInfo = info; pickables.push(mesh); return mesh; },
    clearPickables() { pickables.length = 0; },
    setPlaying(v) { api.playing = !!v; if (v) schedule(); },
    setAutoRotate(v) { rotating = !!v && !reducedMotion; if (rotating) schedule(); },
    isAutoRotate: () => rotating,
    preset(p) {
      const to = {
        overview: { az: initView?.az ?? 0.58, pol: initView?.pol ?? 1.15, r: initView?.r ?? 21 },
        close: { az: 0.32, pol: 1.22, r: 13 },
        section: { az: 0, pol: Math.PI / 2, r: 20 },
        top: { az: 0, pol: 0.25, r: 19 },
      }[p] || { az: 0.58, pol: 1.15, r: 21 };
      Object.assign(goal, to);
      if (reducedMotion) { Object.assign(view, to); dirty = true; schedule(); }
      else { tween = { from: { ...view }, to, t0: performance.now(), dur: 550 }; schedule(); }
    },
    project(v3) {
      const v = v3.clone().project(camera);
      return { x: (v.x * 0.5 + 0.5) * (host.clientWidth || 600), y: (-v.y * 0.5 + 0.5) * (host.clientHeight || 380), visible: v.z < 1 };
    },
    dispose() {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => { x.map?.dispose?.(); x.dispose?.(); }); });
      owned.forEach((o) => o.dispose?.());
      renderer.dispose(); renderer.forceContextLoss?.(); renderer.domElement.remove();
    },
  };

  // ---- orbit + tap-to-pick input ----
  const el = renderer.domElement; const ptrs = new Map(); let pinch = 0; let downPos = null;
  el.style.touchAction = 'none';
  el.addEventListener('pointerdown', (e) => {
    el.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    downPos = { x: e.clientX, y: e.clientY };
    tween = null;
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
  });
  el.addEventListener('pointermove', (e) => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    if (ptrs.size === 1) {
      view.az -= (e.clientX - p.x) * 0.007;
      view.pol = Math.min(Math.PI - 0.08, Math.max(0.12, view.pol - (e.clientY - p.y) * 0.007));
    }
    p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch) view.r = Math.min(38, Math.max(7, view.r * (pinch / d)));
      pinch = d;
    }
    api.invalidate();
  });
  const end = (e) => {
    if (downPos && ptrs.size === 1 && onPick && pickables.length) {
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (dist < 6) {
        const rect = el.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(pickables, true);
        let obj = hits[0]?.object;
        while (obj && !obj.userData?.pickInfo) obj = obj.parent;
        if (obj?.userData?.pickInfo) onPick(obj.userData.pickInfo);
      }
    }
    downPos = null;
    ptrs.delete(e.pointerId); pinch = 0;
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('wheel', (e) => { e.preventDefault(); view.r = Math.min(38, Math.max(7, view.r * (1 + Math.sign(e.deltaY) * 0.08))); api.invalidate(); }, { passive: false });
  el.addEventListener('keydown', (e) => {
    const k = { ArrowLeft: () => (view.az -= 0.12), ArrowRight: () => (view.az += 0.12), ArrowUp: () => (view.pol = Math.max(0.12, view.pol - 0.1)), ArrowDown: () => (view.pol = Math.min(Math.PI - 0.08, view.pol + 0.1)), '+': () => (view.r = Math.max(7, view.r * 0.9)), '-': () => (view.r = Math.min(38, view.r * 1.1)) }[e.key];
    if (k) { e.preventDefault(); k(); api.invalidate(); }
  });
  resize(); place();
  if (rotating) schedule();
  return api;
}
