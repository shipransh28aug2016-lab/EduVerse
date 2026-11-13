// T02 — Shaping of the Earth's Surface. Three labs: plate map (L1), boundary explorer 3D + 2D (L2), Earth interior (L3).
import { h, esc, fmt, clamp } from '../../core/dom.js';
import * as i18n from '../../core/i18n.js';
import { t } from '../../core/i18n.js';
import * as store from '../../core/store.js';
import { slider, button, toggle, chips, tabs, bi, relabelBi, predict, mcq } from '../../components/widgets.js';
import { createInteractivePlate } from '../../components/lab-kit.js';
import { webglAvailable } from '../../engines/webgl.js';
import { xrSupport } from '../../engines/xr.js';
import { createScene } from '../../engines/three-scene.js';
import { THEME_NEP } from '../../data/nep-cbq.js';
import * as M from './models.js';
import { profile } from './plate-profiles.js';
import { svgProfile } from './plate-svg.js';
import { createPlateView } from './plate-3d.js';
import { PLATE_HI, PRED, EXIT, HAZARD, REFLECT } from './content.js';
import { UI_T02 } from '../../i18n/modules/t02.js';

i18n.register(UI_T02);

const GEO = { plates: null, land: null };
async function loadGeo() {
  if (GEO.plates) return GEO;
  const base = new URL('../../../data/geo/', import.meta.url);
  const [p, l] = await Promise.all([fetch(new URL('plates.simplified.json', base)).then((r) => r.json()), fetch(new URL('land.simplified.json', base)).then((r) => r.json())]);
  GEO.plates = p.plates; GEO.land = l.land; return GEO;
}
const INIT = () => ({ ...M.initialTectonics(), tab: 'map', depth: 0, trueScale: true, plateLayer: true, landLayer: true, done: {} });
const b = (en, hi) => ({ en, hi });
const TYPE_KEYS = M.BOUNDARY_TYPES.map((id) => ({ id, key: `pb.type.${id}` }));
const PLATE_COLORS = ['#9ec5e8', '#f2c27b', '#a8d5a2', '#e8a0b4', '#c3b1e1', '#f7e08a', '#8fd3c8', '#f0a58f'];

export function mount(root, ctx = {}) {
  const S = store.simState('T02', INIT());
  S.done ??= {};
  const prog = store.progress('T02');
  const persist = () => store.saveSim();
  const disposers = []; let playTimer = 0; let destroyed = false;
  const lowG = () => store.get().lowGraphics || !webglAvailable();

  // ============================ PLATE MAP (L1) ============================
  const map = (() => {
    const box = h('div', { class: 'map-box' }, h('p', { class: 'note', 'data-k': 'pm.loading' }, t('pm.loading')));
    const read = h('div', { class: 'readout', role: 'status', 'aria-live': 'polite' });
    const quiz = { target: null, score: 0, asked: 0 };
    let plates = [];
    const tp = toggle({ id: 'pm-plates', labelKey: 'pm.plates', checked: S.plateLayer, onChange: (v) => { S.plateLayer = v; persist(); draw(); } });
    const tl = toggle({ id: 'pm-land', labelKey: 'pm.land', checked: S.landLayer, onChange: (v) => { S.landLayer = v; persist(); draw(); } });
    const qBtn = button('pm.quiz.start', () => nextQ(), 'btn primary');
    const qLine = h('div', { class: 'readout', 'aria-live': 'polite' });
    const X = (lon) => ((lon + 180) * 2).toFixed(1), Y = (lat) => ((90 - lat) * 2).toFixed(1);
    const ring = (r) => 'M' + r.map(([lo, la]) => `${X(lo)},${Y(la)}`).join('L') + 'Z';
    const pname = (p) => (p.major && PLATE_HI[p.code] ? i18n.pair(`${p.name}`, PLATE_HI[p.code]) : p.name);
    function draw() {
      if (!plates.length) return;
      let s = `<svg viewBox="0 0 720 360" class="chart worldmap" role="img" aria-label="${esc(t('pm.aria'))}" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="360" class="sea"/>`;
      if (S.plateLayer) plates.forEach((p, i) => { const d = p.polygons.map((poly) => ring(poly[0])).join(''); s += `<path class="plate${p.major ? ' major' : ''}${S.selPlate === p.code ? ' sel' : ''}" data-code="${esc(p.code)}" d="${d}" style="fill:${PLATE_COLORS[i % PLATE_COLORS.length]}" tabindex="${p.major ? 0 : -1}" role="button" aria-label="${esc(p.name)}"/>`; });
      if (S.landLayer) s += `<path class="land" d="${GEO.land.map((poly) => ring(poly[0])).join('')}"/>`;
      box.innerHTML = s + '</svg>';
      box.querySelectorAll('.plate').forEach((el) => {
        const pick = () => choose(el.dataset.code);
        el.addEventListener('click', pick); el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      });
    }
    function choose(code) {
      const p = plates.find((x) => x.code === code); if (!p) return;
      if (quiz.target) { // quiz mode
        quiz.asked++;
        const ok = code === quiz.target.code; if (ok) quiz.score++;
        qLine.className = 'readout ' + (ok ? 'ok' : 'try');
        qLine.textContent = t(ok ? 'pm.quiz.right' : 'pm.quiz.wrong', { picked: p.name, target: quiz.target.name, score: quiz.score, asked: quiz.asked });
        quiz.target = null; qBtn.textContent = t('pm.quiz.next'); qBtn.dataset.k = 'pm.quiz.next'; return;
      }
      S.selPlate = code; persist(); draw();
      read.textContent = t('pm.sel', { name: p.major && PLATE_HI[p.code] ? i18n.pair(p.name, PLATE_HI[p.code]) : p.name, kind: t(p.major ? 'pm.major' : 'pm.minor') });
    }
    function nextQ() {
      const majors = plates.filter((p) => p.major); if (!majors.length) return;
      quiz.target = majors[Math.floor(Math.random() * majors.length)];
      qLine.className = 'readout'; qLine.textContent = t('pm.quiz.ask', { name: quiz.target.name });
    }
    loadGeo().then((g) => { if (destroyed) return; plates = g.plates; draw(); }).catch(() => { box.innerHTML = `<p class="note" data-k="pm.err">${esc(t('pm.err'))}</p>`; });
    const mapPlate = createInteractivePlate(() => ({
      src: 'assets/images/plates/t02-hazards.jpg',
      en: 'Himalayan convergent relief: tap pins to inspect major tectonic plates shaping uplift and quakes.',
      hi: 'हिमालयी अभिसारी उच्चावच: पर्वत-निर्माण व भूकंप रचने वाली प्रमुख प्लेटों को पिन पर टैप करके चुनें।',
      spots: [
        { x: 70, y: 24, en: 'Indo-Australian Plate', hi: 'भारत-ऑस्ट्रेलियाई प्लेट', detail: b('Pushes northward ~5 cm/yr against Eurasia, crumpling the Himalaya.', 'लगभग 5 सेमी/वर्ष उत्तर की ओर बढ़कर हिमालय को ऊपर उठाती है।'), set: { selPlate: 'IN' } },
        { x: 35, y: 30, en: 'Eurasian Plate', hi: 'यूरेशियाई प्लेट', detail: b('Receives Himalayan collision stress across Tibet and Central Asia.', 'तिब्बत व मध्य एशिया में टक्कर का दबाव सहती विशाल महाद्वीपीय प्लेट।'), set: { selPlate: 'EU' } },
        { x: 50, y: 66, en: 'Pacific Ring of Fire', hi: 'प्रशांत अग्नि-वलय', detail: b('Dense oceanic subduction zones ringing the Pacific Basin.', 'प्रशांत महासागर के चारों ओर गहरे गर्तों व ज्वालामुखियों की पट्टी।'), set: { selPlate: 'PA' } },
      ],
    }), (patch) => { if (patch.selPlate && plates.length) choose(patch.selPlate); });
    const el = h('div', { class: 'lab' },
      h('p', { class: 'lead' }, bi({ en: 'The Earth’s surface is broken into large moving slabs called plates. Tap a plate to name it, then test yourself.', hi: 'पृथ्वी की सतह बड़ी गतिशील पट्टियों में टूटी है जिन्हें प्लेट कहते हैं। प्लेट पर टैप करके नाम जानें, फिर स्वयं को परखें।' })),
      h('div', { class: 'lab-grid' }, h('div', { class: 'lab-main' }, mapPlate.el, box, read), h('div', { class: 'lab-side' }, tp.root, tl.root, h('div', { class: 'row' }, qBtn), qLine, h('p', { class: 'note', 'data-k': 'pm.note' }, t('pm.note')))));
    return { el, relabel() { mapPlate.relabel(); relabelBi(el); i18n.apply(el); draw(); qBtn.textContent = t(qBtn.dataset.k); } };
  })();

  // ============================ BOUNDARY EXPLORER (L2) ============================
  const bx = (() => {
    const sec = h('div', { class: 'sec-box' }); // 2D section / fallback
    const glHost = h('div', { class: 'gl-host', 'aria-label': t('pb.gl.aria'), 'data-k-aria': 'pb.gl.aria' });
    const glLabels = h('div', { class: 'gl-labels', 'aria-hidden': 'true' });
    const inspectPill = h('div', { class: 'gl-inspect', hidden: true });
    const tourPill = h('div', { class: 'gl-tour-pill', hidden: true });
    const view3d = h('div', { class: 'view3d', hidden: true }, glHost, glLabels, inspectPill, tourPill);
    const read = h('div', { class: 'readout', role: 'status', 'aria-live': 'polite' });
    const modeNote = h('p', { class: 'note' });
    let api = null, pv = null, lastPick = null, tourIdx = -1, currentStop = null;
    const stops = THEME_NEP.T02.tours;

    const ch = chips({ name: 'btype', value: S.type, options: TYPE_KEYS, onSelect: (id) => { S.type = id; refresh(); } });
    const sSpeed = slider({ id: 'pb-speed', labelKey: 'pb.ctl.speed', min: M.SPEED.min, max: M.SPEED.max, step: M.SPEED.step, value: S.speed, format: (v) => `${v} cm/yr`, onInput: (v) => { S.speed = v; refresh(); } });
    const sTime = slider({ id: 'pb-time', labelKey: 'pb.ctl.time', min: M.TIME.min, max: M.TIME.max, step: M.TIME.step, value: S.time, format: (v) => `${v} Myr`, onInput: (v) => { S.time = v; refresh(); } });
    const tLab = toggle({ id: 'pb-labels', labelKey: 'pb.ctl.labels', checked: S.labels, onChange: (v) => { S.labels = v; refresh(); } });
    const bPlay = button('pb.btn.play', () => togglePlay(), 'btn primary');
    const bReset = button('btn.reset', () => { Object.assign(S, M.initialTectonics()); sync(); }, 'btn');
    const bStereo = h('button', { type: 'button', class: 'btn ghost vr-btn', 'data-k': 'vr.stereo', 'aria-pressed': 'false', onclick: () => { if (!api) return; const on = api.setStereo(!api.isStereo()); bStereo.setAttribute('aria-pressed', on ? 'true' : 'false'); view3d.classList.toggle('gl-stereo', on); } }, t('vr.stereo'));
    const bTour = h('button', { type: 'button', class: 'btn ghost vr-btn', 'data-k': 'vr.tour', onclick: () => { if (!api || !stops.length) return; tourIdx = (tourIdx + 1) % stops.length; currentStop = stops[tourIdx]; api.flyTo(currentStop, 900); tourPill.textContent = `🥽 (${tourIdx + 1}/${stops.length}) ${i18n.pair(currentStop.en, currentStop.hi)}`; tourPill.hidden = false; } }, t('vr.tour'));
    const bXr = h('button', { type: 'button', class: 'btn primary vr-btn', 'data-k': 'vr.enter', hidden: true, onclick: async () => { await api?.enterWebXR?.(); } }, t('vr.enter'));
    xrSupport().then((sup) => { if (!destroyed && sup.vr) bXr.hidden = false; }).catch(() => {});
    const presets = h('div', { class: 'row' }, ...['overview', 'close', 'section', 'top'].map((p) => button(`pb.cam.${p}`, () => { currentStop = null; tourPill.hidden = true; api?.preset(p); }, 'btn ghost')), bTour, bStereo, bXr);
    presets.hidden = true;

    function stepPlay() { if (S.time >= M.TIME.max) { togglePlay(false); return; } S.time = Math.min(M.TIME.max, S.time + (store.get().reducedMotion ? 5 : 1)); sTime.set(S.time); refresh(); }
    function togglePlay(on = !playTimer) {
      clearInterval(playTimer); playTimer = 0;
      if (on) { if (S.time >= M.TIME.max) { S.time = 0; sTime.set(0); } playTimer = setInterval(stepPlay, store.get().reducedMotion ? 600 : 120); }
      bPlay.dataset.k = on ? 'pb.btn.pause' : 'pb.btn.play'; bPlay.textContent = t(bPlay.dataset.k); bPlay.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    function sync() { ch.select(S.type); sSpeed.set(S.speed); sTime.set(S.time); tLab.set(S.labels); togglePlay(false); refresh(); }

    function refresh() {
      persist();
      const p = profile(S.type, S.speed, S.time), st = p.state;
      sec.innerHTML = svgProfile(p, { labels: S.labels });
      if (pv && api) { pv.update(p, { showLabels: S.labels }); }
      const dist = M.convergenceKm(S.speed, S.time);
      const key = S.type === 'div' ? 'pb.ro.div' : S.type === 'trans' ? 'pb.ro.trans' : 'pb.ro.conv';
      read.innerHTML = `<div class="ro-line">${esc(t(key, { km: fmt(dist, 0), speed: S.speed, time: S.time }))}</div><div class="ro-line note">${esc(t('pb.desc.' + S.type))}</div>`;
    }
    async function enable3D() {
      if (api || lowG()) return;
      view3d.hidden = false; sec.classList.add('compact');
      try {
        api = await createScene(glHost, {
          lowGraphics: store.get().lowGraphics,
          reducedMotion: store.get().reducedMotion,
          vrStage: true,
          onAfterRender: (st) => pv?.place(S.labels && !st),
          onPick: (info) => { if (!info) return; lastPick = info; inspectPill.textContent = i18n.pair(info.en, info.hi); inspectPill.hidden = false; },
        });
        if (destroyed) { api.dispose(); api = null; return; }
        pv = createPlateView(api, glLabels); presets.hidden = false; modeNote.textContent = t('pb.mode.3d'); modeNote.dataset.k = 'pb.mode.3d';
        refresh();
      } catch (e) {
        api = null; pv = null; view3d.hidden = true; sec.classList.remove('compact'); modeNote.textContent = t('pb.mode.2d'); modeNote.dataset.k = 'pb.mode.2d';
      }
    }
    function disable3D() { if (!api) return; pv?.dispose(); api.dispose(); api = null; pv = null; lastPick = null; currentStop = null; tourIdx = -1; glHost.replaceChildren(); glLabels.replaceChildren(); inspectPill.hidden = true; tourPill.hidden = true; view3d.classList.remove('gl-stereo'); bStereo.setAttribute('aria-pressed', 'false'); view3d.hidden = true; sec.classList.remove('compact'); presets.hidden = true; modeNote.textContent = t('pb.mode.2d'); modeNote.dataset.k = 'pb.mode.2d'; }
    const applyMode = () => { if (lowG()) { disable3D(); modeNote.textContent = t('pb.mode.2d'); modeNote.dataset.k = 'pb.mode.2d'; } else enable3D(); };
    modeNote.textContent = t(lowG() ? 'pb.mode.2d' : 'pb.mode.load'); modeNote.dataset.k = lowG() ? 'pb.mode.2d' : 'pb.mode.load';

    const pr1 = predict({ id: 'p1', stem: { en: PRED.dist.en, hi: PRED.dist.hi }, options: PRED.dist.opts,
      run: () => { S.type = 'conv-oc'; S.speed = 5; S.time = 40; sync(); const d = M.convergenceKm(5, 40); return d >= 1000 ? '2000' : d >= 100 ? '200' : '20'; },
      explain: () => ({ en: `1 cm per year is 10 km per million years. 5 cm/yr × 10 × 40 Myr = ${fmt(M.convergenceKm(5, 40), 0)} km, about the distance from Delhi to Kerala’s south tip and beyond.`, hi: `1 सेमी/वर्ष = 10 किमी प्रति दस लाख वर्ष। 5 × 10 × 40 = ${fmt(M.convergenceKm(5, 40), 0)} किमी।` }) }, { done: S.done, onDone: persist });
    const pr2 = predict({ id: 'p2', stem: { en: PRED.crust.en, hi: PRED.crust.hi }, options: PRED.crust.opts,
      run: () => { S.type = 'div'; S.speed = 4; S.time = 30; sync(); return 'div'; },
      explain: () => ({ en: `Magma rises in the gap and cools into new crust: ${fmt(M.convergenceKm(4, 30), 0)} km of new sea floor after 30 Myr at 4 cm/yr. Subduction destroys crust; at a transform boundary crust is neither made nor destroyed.`, hi: `दरार में मैग्मा ऊपर उठकर ठंडा होता है और नई पर्पटी बनती है: 4 सेमी/वर्ष पर 30 दस लाख वर्षों में ${fmt(M.convergenceKm(4, 30), 0)} किमी नया समुद्र-तल। धँसाव में पर्पटी नष्ट होती है; रूपांतर सीमा पर न बनती है न नष्ट होती है।` }) }, { done: S.done, onDone: persist });
    const ta = h('textarea', { class: 'reflect', rows: 3, 'data-k-aria': 'hz.aria', 'aria-label': t('hz.aria') }); ta.value = prog.hazard || '';
    ta.addEventListener('input', () => { prog.hazard = ta.value; store.saveProgress(); });
    const bxPlate = createInteractivePlate(() => ({
      src: 'assets/images/plates/t02-boundaries.jpg',
      en: 'Tectonic landscapes: tap Himalayan fold peaks, deep ocean subduction trench or seafloor spreading rift.',
      hi: 'विवर्तनिक भू-दृश्य: हिमालयी वलित पर्वत, महासागरीय गर्त या अपसारी दरार पर टैप कर सीमा मॉडल बदलें।',
      spots: [
        { x: 25, y: 34, en: 'Continent Collision (Himalaya)', hi: 'महाद्वीपीय टक्कर (हिमालय)', detail: b('Two buoyant continents buckle upward into fold peaks instead of sinking.', 'दो हल्के महाद्वीप धँसने के बजाय ऊपर मुड़कर वलित पर्वत बनाते हैं।'), set: { type: 'conv-cc', speed: 5, time: 45 } },
        { x: 54, y: 48, en: 'Ocean–Continent Subduction', hi: 'महासागर-महाद्वीप अधोगमन', detail: b('Dense oceanic slab bends into the mantle, forming deep trenches & volcanoes.', 'भारी समुद्री प्लेट नीचे धँसकर गहरा गर्त व ज्वालामुखी चाप बनाती है।'), set: { type: 'conv-oc', speed: 6, time: 30 } },
        { x: 82, y: 54, en: 'Divergent Seafloor Rift', hi: 'अपसारी समुद्र-तल दरार', detail: b('Plates pull apart while rising magma freezes into fresh oceanic crust.', 'प्लेटें दूर हटती हैं और उठता मैग्मा नई समुद्री पर्पटी बनाता है।'), set: { type: 'div', speed: 4, time: 30 } },
      ],
    }), (patch) => { Object.assign(S, patch); sync(); });
    sync();
    const el = h('div', { class: 'lab' },
      h('p', { class: 'lead' }, bi({ en: 'Pick a boundary, set the speed, then move the time slider to watch millions of years pass. Drag the 3D view to look around.', hi: 'सीमा चुनें, गति तय करें, फिर समय-स्लाइडर से लाखों वर्ष बीतते देखें। चारों ओर देखने के लिए 3D दृश्य को खींचें।' })),
      h('div', { class: 'lab-grid' },
        h('div', { class: 'lab-main' }, bxPlate.el, view3d, presets, sec, read, modeNote),
        h('div', { class: 'lab-side' }, ch.root, sSpeed.root, sTime.root, tLab.root, h('div', { class: 'row' }, bPlay, bReset), h('p', { class: 'note', 'data-k': 'pb.limits' }, t('pb.limits')))),
      h('section', { class: 'subsec' }, h('h3', { 'data-k': 'predict.h' }, t('predict.h')), pr1, pr2),
      h('section', { class: 'subsec' }, h('h3', { 'data-k': 'hz.h' }, t('hz.h')), bi(HAZARD, { tag: 'p', cls: 'note' }), ta));
    return {
      el, enable: applyMode, pause: () => togglePlay(false), disable: disable3D,
      relabel() { bxPlate.relabel(); pr1.relabel(); pr2.relabel(); relabelBi(el); i18n.apply(el); bPlay.textContent = t(bPlay.dataset.k); ta.setAttribute('aria-label', t('hz.aria')); modeNote.textContent = t(modeNote.dataset.k); if (lastPick && !inspectPill.hidden) inspectPill.textContent = i18n.pair(lastPick.en, lastPick.hi); if (currentStop && !tourPill.hidden) tourPill.textContent = `🥽 (${tourIdx + 1}/${stops.length}) ${i18n.pair(currentStop.en, currentStop.hi)}`; pv?.relabel(); refresh(); },
      debug: () => ({ api: !!api, canvas: !!glHost.querySelector('canvas'), type: S.type, speed: S.speed, time: S.time, km: M.convergenceKm(S.speed, S.time) }),
      host: glHost,
    };
  })();

  // ============================ EARTH INTERIOR (L3) ============================
  const it = (() => {
    const box = h('div', { class: 'chart-box' }), read = h('div', { class: 'readout', role: 'status', 'aria-live': 'polite' });
    const sDepth = slider({ id: 'in-depth', labelKey: 'in.ctl.depth', min: 0, max: M.EARTH_RADIUS_KM, step: 10, value: S.depth, format: (v) => `${fmt(v, 0)} km`, onInput: (v) => { S.depth = v; draw(); } });
    const tScale = toggle({ id: 'in-true', labelKey: 'in.ctl.true', checked: S.trueScale, onChange: (v) => { S.trueScale = v; draw(); } });
    function radius(d) { // map depth (km) to drawn radius; schematic mode widens the thin crust so it is visible
      const R = 150, f = 1 - d / M.EARTH_RADIUS_KM;
      if (S.trueScale) return R * f;
      const pts = [0, 70, 2900, 5150, 6371], rr = [1, 0.84, 0.5, 0.22, 0];
      for (let i = 1; i < pts.length; i++) if (d <= pts[i]) return R * (rr[i - 1] + (rr[i] - rr[i - 1]) * (d - pts[i - 1]) / (pts[i] - pts[i - 1]));
      return 0;
    }
    const intPlate = createInteractivePlate(() => ({
      src: 'assets/images/plates/t02-interior.jpg',
      en: '3D layered cutaway: tap any depth pin on the globe to jump the seismic probe inside Earth.',
      hi: 'पृथ्वी की अनुप्रस्थ काट: किसी भी गहराई बिंदु पर टैप कर सीस्मिक प्रोब को सीधे उस परत में भेजें।',
      spots: [
        { x: 38, y: 26, en: 'Thin Solid Crust (0–70 km)', hi: 'पतली ठोस भूपर्पटी (0–70 किमी)', detail: b('Paper-thin rocky outer shell where continents, oceans and quakes occur.', 'महाद्वीपों व महासागरों को धारण करने वाला बहुत पतला चट्टानी आवरण।'), set: { depth: 20 } },
        { x: 64, y: 42, en: 'Convecting Mantle (70–2900 km)', hi: 'संवहनशील मैंटल (70–2900 किमी)', detail: b('Solid silicate rock under high heat that creeps slowly to drive tectonic plates.', 'उच्च दाब पर ठोस पर लाखों वर्षों में धीरे बहकर प्लेटें चलाने वाला स्तर।'), set: { depth: 1500 } },
        { x: 56, y: 54, en: 'Liquid Outer Core (2900–5150 km)', hi: 'द्रव बाह्य क्रोड (2900–5150 किमी)', detail: b('Churning molten iron-nickel alloy that blocks S-waves & generates Earth’s magnetic field.', 'घूमता पिघला लोहा-निकेल जो भूकंपीय S-तरंगें रोकता व चुंबकीय क्षेत्र बनाता है।'), set: { depth: 3800 } },
        { x: 50, y: 52, en: 'Solid Inner Core (5150–6371 km)', hi: 'ठोस आंतरिक क्रोड (5150–6371 किमी)', detail: b('Crushing pressure locks white-hot iron alloy solid at the very centre.', 'अत्यधिक दाब के कारण 5,000°C से अधिक पर भी ठोस लौह-निकेल केंद्र।'), set: { depth: 5900 } },
      ],
    }), (patch) => { Object.assign(S, patch); sDepth.set(S.depth); draw(); });
    function draw() {
      persist();
      const cx = 170, cy = 170, l = M.layerAtDepth(S.depth);
      let s = `<svg viewBox="0 0 340 340" class="chart interior" role="img" aria-label="${esc(t('in.aria'))}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g-mantle"><stop offset="35%" stop-color="#f97316"/><stop offset="100%" stop-color="#b45309"/></radialGradient><radialGradient id="g-ocore"><stop offset="30%" stop-color="#facc15"/><stop offset="100%" stop-color="#ea580c"/></radialGradient><radialGradient id="g-icore"><stop offset="0%" stop-color="#fef9c3"/><stop offset="100%" stop-color="#f59e0b"/></radialGradient></defs>`;
      const fills = { crust: '#78563c', mantle: 'url(#g-mantle)', outer_core: 'url(#g-ocore)', inner_core: 'url(#g-icore)' };
      M.LAYERS.forEach((L) => { s += `<circle class="ly ly-${L.id}${L.id === l.id ? ' on' : ''}" cx="${cx}" cy="${cy}" r="${radius(L.from).toFixed(1)}" style="fill:${fills[L.id]}"/>`; });
      const r = radius(S.depth); s += `<circle class="probe" cx="${cx}" cy="${cy}" r="${r.toFixed(1)}"/><line class="probe-line" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 150}"/><circle class="probe-dot" cx="${cx}" cy="${(cy - r).toFixed(1)}" r="7"/></svg>`;
      box.innerHTML = s;
      read.innerHTML = `<div class="ro-line"><strong>${esc(t('in.ro.depth', { d: fmt(S.depth, 0) }))}</strong> ${esc(t('layer.' + l.id))} (${esc(t('state.' + l.state))})</div><div class="ro-line note">${esc(t('layer.' + l.id + '.note'))}${l.ambiguous ? ' ' + esc(t('in.ro.vary')) : ''}</div>`;
    }
    const prM = predict({ id: 'p3', stem: { en: PRED.mantle.en, hi: PRED.mantle.hi }, options: PRED.mantle.opts,
      run: () => { S.depth = 1500; sDepth.set(1500); draw(); return M.layerAtDepth(1500).state === 'solid' ? 'flows' : 'liquid'; },
      explain: () => ({ en: 'At 1,500 km the mantle is hot but under huge pressure, so it is solid; over millions of years it flows slowly, like very thick dough. Only the outer core (2,900–5,150 km) is liquid.', hi: '1,500 किमी पर मैंटल गर्म पर भारी दाब में होने से ठोस है; लाखों वर्षों में यह गाढ़े आटे की तरह धीरे बहता है। केवल बाह्य क्रोड (2,900–5,150 किमी) द्रव है।' }) }, { done: S.done, onDone: persist });
    draw();
    const el = h('div', { class: 'lab' }, h('p', { class: 'lead' }, bi({ en: 'Travel down from the surface. Which layer are you in, and is it solid or liquid? Switch scale to see how thin the crust really is.', hi: 'सतह से नीचे जाएँ। आप किस परत में हैं, और वह ठोस है या द्रव? पैमाना बदलकर देखें कि भूपर्पटी वास्तव में कितनी पतली है।' })),
      h('div', { class: 'lab-grid' }, h('div', { class: 'lab-main' }, intPlate.el, box, read), h('div', { class: 'lab-side' }, sDepth.root, tScale.root, h('p', { class: 'note', 'data-k': 'in.note' }, t('in.note')))),
      h('section', { class: 'subsec' }, h('h3', { 'data-k': 'predict.h' }, t('predict.h')), prM));
    return { el, relabel() { intPlate.relabel(); prM.relabel(); relabelBi(el); i18n.apply(el); draw(); } };
  })();

  // ============================ EXIT + TABS ============================
  const exitBox = h('div', { class: 'exit' });
  const mcqs = EXIT.map((q) => { const e = mcq(q, { done: S.done, onDone: (id, v) => { prog.exit[id] = v; store.saveProgress(); persist(); } }); exitBox.append(h('div', { class: 'exit-q' }, e)); return e; });
  const ta = h('textarea', { class: 'reflect', rows: 4, 'data-k-aria': 'reflect.aria', placeholder: t('reflect.ph') }); ta.value = prog.reflection || '';
  ta.addEventListener('input', () => { prog.reflection = ta.value; store.saveProgress(); });
  const exitSec = h('section', { class: 'subsec' }, h('h3', { 'data-k': 'exit.h' }, t('exit.h')), exitBox, h('h3', { 'data-k': 'reflect.h' }, t('reflect.h')), bi(REFLECT, { tag: 'p', cls: 'note' }), ta, h('p', { class: 'note', 'data-k': 'reflect.local' }, t('reflect.local')));
  const onTab = (id) => { S.tab = id; persist(); if (id === 'boundary') bx.enable(); else { bx.pause(); bx.disable(); } };
  const tb = tabs({ active: S.tab || 'map', onChange: onTab, tabs: [{ id: 'map', key: 'T02.tab.map', el: map.el }, { id: 'boundary', key: 'T02.tab.boundary', el: bx.el }, { id: 'interior', key: 'T02.tab.interior', el: it.el }] });
  root.append(tb.root, exitSec);
  i18n.apply(root);
  const offLow = store.subscribe((s, keys) => { if (keys.includes('lowGraphics') && S.tab === 'boundary') { bx.disable(); bx.enable(); } });
  disposers.push(offLow);

  return {
    relabel() { map.relabel(); bx.relabel(); it.relabel(); mcqs.forEach((q) => q.relabel()); relabelBi(root); i18n.apply(root); ta.placeholder = t('reflect.ph'); },
    destroy() { destroyed = true; clearInterval(playTimer); bx.disable(); disposers.forEach((f) => f()); },
    debug: () => ({ boundary: bx.debug(), S }),
  };
}
