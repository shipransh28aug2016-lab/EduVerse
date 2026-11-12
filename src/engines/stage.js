// Cinematic 3D stage: PBR lighting from a room environment, soft shadows, ACES tone mapping, bloom post-processing,
// damped orbit controls with gentle auto-rotation, HTML labels (CSS2D) and hover picking.
// Renders only while on screen; honours reduced-motion; full dispose(). three.js and its addons load lazily from /vendor.
import { loadThree } from './three-scene.js';
import { pair } from '../core/i18n.js';

let fxPromise;
export const loadFx = () => (fxPromise ??= import('../../vendor/three/three-fx.esm.js'));
export const PALETTE = ['#f5c451', '#4fd1c5', '#ff7a6b', '#a78bfa', '#60a5fa', '#86efac', '#f9a8d4', '#fdba74'];

export async function createStage(host, { reducedMotion = false, bloom = 0.5, background = 0x060b1a, fov = 38, shadows = true, lift = 0.08 } = {}) {
  const [THREE, FX] = await Promise.all([loadThree(), loadFx()]);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = shadows; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement; canvas.className = 'stage-canvas'; canvas.tabIndex = 0;
  host.append(canvas);

  const scene = new THREE.Scene(); scene.background = new THREE.Color(background);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new FX.RoomEnvironment(), 0.04); scene.environment = envRT.texture; scene.environmentIntensity = 0.55;
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 400);
  camera.position.set(0, 6, 12);

  scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x1a1408, 0.55));
  const key = new THREE.DirectionalLight(0xfff1d6, 1.7); key.position.set(7, 12, 8); key.castShadow = shadows;
  key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03;
  Object.assign(key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 0.5, far: 50 });
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5b8cff, 0.9); rim.position.set(-9, 5, -8); scene.add(rim);

  const controls = new FX.OrbitControls(camera, canvas);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.07, enablePan: false, autoRotate: !reducedMotion, autoRotateSpeed: 0.55, rotateSpeed: 0.7, zoomSpeed: 0.7 });
  controls.addEventListener('start', () => { controls.autoRotate = false; });

  const composer = new FX.EffectComposer(renderer);
  composer.addPass(new FX.RenderPass(scene, camera));
  const bloomPass = new FX.UnrealBloomPass(new THREE.Vector2(256, 256), bloom, 0.7, 0.92); composer.addPass(bloomPass);
  composer.addPass(new FX.OutputPass());

  const css = new FX.CSS2DRenderer(); css.domElement.className = 'stage-labels'; host.append(css.domElement);
  const tip = document.createElement('div'); tip.className = 'stage-tip'; tip.hidden = true; host.append(tip);

  const labels = [], frames = new Set(), tweens = new Set(), pickables = [];
  let raf = 0, disposed = false, visible = true, last = performance.now(), hoverCb = null, hovered = null;
  const text = (v) => (typeof v === 'string' ? v : typeof v === 'function' ? v() : pair(v.en, v.hi));

  function resize() {
    const w = host.clientWidth || 640, h = host.clientHeight || 420;
    renderer.setSize(w, h, false); composer.setSize(w, h); css.setSize(w, h);
    camera.aspect = w / h; camera.fov = Math.min(72, fov / Math.min(1, (w / h) ** 0.85)); // widen on portrait phones so the subject still fits
    if (lift) camera.setViewOffset(w, h, 0, Math.round(h * lift), w, h); // keep the subject clear of the bottom controls
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize); ro.observe(host);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); }); io.observe(host);

  function frame(now) {
    raf = 0; if (disposed || !visible || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    for (const tw of tweens) { const k = Math.min(1, (now - tw.t0) / tw.dur); tw.fn(1 - (1 - k) ** 3); if (k >= 1) { tweens.delete(tw); tw.done?.(); } }
    for (const f of frames) f(now / 1000, dt);
    controls.update(); composer.render(); css.render(scene, camera);
    loop();
  }
  function loop() { if (!raf && !disposed) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  const onVis = () => { if (!document.hidden) loop(); }; document.addEventListener('visibilitychange', onVis);

  // hover picking
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = pickables.length ? ray.intersectObjects(pickables, false)[0]?.object ?? null : null;
    if (hit !== hovered) { hovered = hit; canvas.style.cursor = hit ? 'pointer' : 'grab'; const s = hoverCb?.(hit); tip.hidden = !s; if (s) tip.textContent = s; }
    if (hit) { tip.style.left = `${e.clientX - r.left}px`; tip.style.top = `${e.clientY - r.top}px`; }
  }
  canvas.addEventListener('pointermove', pick);
  canvas.addEventListener('pointerleave', () => { hovered = null; tip.hidden = true; hoverCb?.(null); });

  const api = {
    THREE, FX, scene, camera, controls, renderer, key, pickables, host,
    onFrame(f) { frames.add(f); return () => frames.delete(f); },
    onHover(cb) { hoverCb = cb; },
    tween(dur, fn, done) { if (reducedMotion) { fn(1); done?.(); return; } tweens.add({ t0: performance.now(), dur, fn, done }); },
    /** HTML label anchored to a 3D point. `txt` is a string, a () => string, or a bilingual {en, hi}. */
    label(txt, pos, cls = '', parent = scene) {
      const el = document.createElement('div'); el.className = `lbl3d ${cls}`; el.textContent = text(txt);
      const o = new FX.CSS2DObject(el); o.position.copy(pos); o.userData.txt = txt; parent.add(o); labels.push(o); return o;
    },
    setLabel(o, txt) { o.userData.txt = txt; o.element.textContent = text(txt); },
    relabel() { for (const o of labels) o.element.textContent = text(o.userData.txt); },
    /** Remove a group and free its GPU resources and labels. */
    clear(group) {
      group.traverse((o) => {
        if (o.isCSS2DObject) { o.element.remove(); const i = labels.indexOf(o); if (i >= 0) labels.splice(i, 1); }
        const pi = pickables.indexOf(o); if (pi >= 0) pickables.splice(pi, 1);
        o.geometry?.dispose?.(); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => { x.map?.dispose?.(); x.dispose?.(); });
      });
      group.removeFromParent();
    },
    /** Smoothly move the camera to `pos` looking at `target`. */
    flyTo(pos, target = controls.target.clone(), dur = 1100) {
      const p0 = camera.position.clone(), t0 = controls.target.clone();
      api.tween(dur, (k) => { camera.position.lerpVectors(p0, pos, k); controls.target.lerpVectors(t0, target, k); });
    },
    stars(n = 1400, r = 90) {
      const p = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { const u = Math.random() * 2 - 1, a = Math.random() * 6.283, s = Math.sqrt(1 - u * u); p.set([r * s * Math.cos(a), r * u, r * s * Math.sin(a)], i * 3); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xcfe0ff, size: 0.35, sizeAttenuation: true, transparent: true, opacity: 0.85 }));
      scene.add(pts); return pts;
    },
    setBloom(v) { bloomPass.strength = v; },
    dispose() {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis);
      controls.dispose(); api.clear(scene); envRT.dispose(); pmrem.dispose(); composer.dispose?.();
      renderer.dispose(); renderer.forceContextLoss?.(); canvas.remove(); css.domElement.remove(); tip.remove();
    },
  };
  resize(); loop();
  return api;
}
