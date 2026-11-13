// Interactive orbit-controlled Three.js scene host with WebXR VR, Cardboard Stereo VR, Gyro head-look, tap-to-inspect raycasting & camera tours.
//  • three.js loads lazily offline from vendor/three/three.module.min.js.
//  • renders on demand (or smoothly while playing / in stereo / auto-spin) → battery friendly.
import { startWebXRSession } from './xr.js';

let threePromise;
export const loadThree = () => (threePromise ??= import('../../vendor/three/three.module.min.js'));

export async function createScene(host, { lowGraphics = false, reducedMotion = false, onTick, onAfterRender, onPick, view: initView, autoRotate = false, vrStage = false } = {}) {
  const THREE = await loadThree();
  const renderer = new THREE.WebGLRenderer({ antialias: !lowGraphics, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(lowGraphics ? 1 : Math.min(2, window.devicePixelRatio || 1));
  renderer.domElement.className = 'gl'; renderer.domElement.tabIndex = 0;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  const stereo = new THREE.StereoCamera();
  stereo.aspect = 0.5;
  stereo.eyeSep = 0.064;
  const target = new THREE.Vector3(0, -0.6, 0);
  const view = { az: initView?.az ?? 0.58, pol: initView?.pol ?? 1.15, r: initView?.r ?? 21 };
  let raf = 0, dirty = true, tween = null, disposed = false;
  let rotating = autoRotate && !reducedMotion;
  let stereoOn = false, xrSession = null, gyroBase = null, gyroOn = false;
  const owned = [];
  const pickables = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // Warm sunlit hemisphere + key sun + cool rim light for rich 3D miniature depth
  const hemi = new THREE.HemisphereLight(0xe6f4ff, 0x7e6243, 0.92);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff4de, 1.25);
  sun.position.set(8, 14, 10);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x90caf9, 0.45);
  rim.position.set(-10, 6, -9);
  scene.add(rim);

  // Subtle VR spatial horizon ring only when vrStage requested (cleanly kept inside scene & disposed)
  let horizonRing = null;
  if (vrStage) {
    horizonRing = new THREE.GridHelper(32, 16, 0x94a3b8, 0xcbd5e1);
    horizonRing.position.y = -3.05;
    if (horizonRing.material) { horizonRing.material.transparent = true; horizonRing.material.opacity = 0.25; }
    scene.add(horizonRing);
  }

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
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dirty = true;
    schedule();
  }
  const ro = new ResizeObserver(resize); ro.observe(host);
  let lastNow = performance.now();

  function renderView(now) {
    place();
    if (stereoOn && !xrSession) {
      const w = host.clientWidth || 600, h = host.clientHeight || 380;
      const hw = Math.floor(w / 2);
      camera.updateMatrixWorld();
      stereo.update(camera);
      renderer.setScissorTest(true);
      renderer.setScissor(0, 0, hw, h);
      renderer.setViewport(0, 0, hw, h);
      renderer.render(scene, stereo.cameraL);
      renderer.setScissor(hw, 0, w - hw, h);
      renderer.setViewport(hw, 0, w - hw, h);
      renderer.render(scene, stereo.cameraR);
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, w, h);
    } else {
      renderer.setScissorTest(false);
      renderer.render(scene, camera);
    }
    onAfterRender?.(stereoOn);
  }

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
    if (dirty || api.playing) { renderView(now); dirty = false; }
    if (tween || api.playing || rotating || stereoOn) schedule();
  }
  function schedule() { if (!raf && !disposed && !xrSession) raf = requestAnimationFrame(frame); }

  const onGyro = (ev) => {
    if (!gyroOn || ev.alpha == null || ev.beta == null) return;
    if (!gyroBase) gyroBase = { a: ev.alpha, b: ev.beta, az: view.az, pol: view.pol };
    const dAz = ((ev.alpha - gyroBase.a) * Math.PI) / 180;
    const dPol = ((ev.beta - gyroBase.b) * Math.PI) / 180;
    view.az = gyroBase.az - dAz;
    view.pol = Math.min(Math.PI - 0.1, Math.max(0.15, gyroBase.pol + dPol * 0.6));
    dirty = true;
    schedule();
  };

  const api = {
    THREE, scene, camera, renderer, target, playing: false,
    invalidate() { dirty = true; schedule(); },
    track(o) { owned.push(o); return o; },
    markPickable(mesh, info) { mesh.userData.pickInfo = info; pickables.push(mesh); return mesh; },
    clearPickables() { pickables.length = 0; },
    setPlaying(v) { api.playing = !!v; if (v) schedule(); },
    setAutoRotate(v) { rotating = !!v && !reducedMotion; if (rotating) schedule(); },
    isAutoRotate: () => rotating,
    setStereo(v) {
      stereoOn = !!v;
      gyroOn = stereoOn && typeof window.DeviceOrientationEvent !== 'undefined';
      gyroBase = null;
      if (gyroOn) window.addEventListener('deviceorientation', onGyro);
      else window.removeEventListener('deviceorientation', onGyro);
      dirty = true;
      schedule();
      return stereoOn;
    },
    isStereo: () => stereoOn,
    flyTo(toView, dur = 850) {
      const to = {
        az: toView.az ?? view.az,
        pol: toView.pol ?? view.pol,
        r: toView.r ?? view.r,
      };
      if (reducedMotion) { Object.assign(view, to); dirty = true; schedule(); }
      else { tween = { from: { ...view }, to, t0: performance.now(), dur }; schedule(); }
    },
    async enterWebXR(onEnd) {
      if (xrSession) { await xrSession.end().catch(() => {}); return false; }
      const s = await startWebXRSession(renderer, () => {
        xrSession = null;
        renderer.setAnimationLoop(null);
        dirty = true;
        schedule();
        onEnd?.();
      });
      if (!s) return false;
      xrSession = s;
      cancelAnimationFrame(raf); raf = 0;
      renderer.setAnimationLoop((now) => {
        onTick?.(now || performance.now(), 0.016);
        renderer.render(scene, camera);
      });
      return true;
    },
    preset(p) {
      const to = {
        overview: { az: initView?.az ?? 0.58, pol: initView?.pol ?? 1.15, r: initView?.r ?? 21 },
        close: { az: 0.32, pol: 1.22, r: 13 },
        section: { az: 0, pol: Math.PI / 2, r: 20 },
        top: { az: 0, pol: 0.25, r: 19 },
      }[p] || { az: 0.58, pol: 1.15, r: 21 };
      api.flyTo(to, 550);
    },
    project(v3) {
      const v = v3.clone().project(camera);
      const w = host.clientWidth || 600, h = host.clientHeight || 380;
      return { x: (v.x * 0.5 + 0.5) * (stereoOn ? w / 2 : w), y: (-v.y * 0.5 + 0.5) * h, visible: v.z < 1 };
    },
    dispose() {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener('deviceorientation', onGyro);
      if (xrSession) { try { xrSession.end(); } catch {} xrSession = null; }
      renderer.setAnimationLoop(null);
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
        let nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
        if (stereoOn) nx = nx < 0 ? (nx + 0.5) * 2 : (nx - 0.5) * 2;
        pointer.x = nx;
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
