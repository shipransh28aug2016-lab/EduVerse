// T09 — The Price Puzzle: What Drives the Market. Four labs on one shared model file (models.js):
//   market (L1 demand/supply/equilibrium, L2 price ceiling, L3 real-world deviations), externality (L4), public goods (L5), information asymmetry (L6).
import { h, esc, fmt } from '../../core/dom.js';
import * as i18n from '../../core/i18n.js';
import { t, pairHtml } from '../../core/i18n.js';
import * as store from '../../core/store.js';
import { Chart, sampleCurve } from '../../engines/chart.js';
import { slider, button, toggle, chips, tabs, bi, relabelBi, predict, mcq, biHtml } from '../../components/widgets.js';
import * as M from './models.js';
import { OPT, EXIT, REFLECT } from './content.js';

const INIT = () => ({
  market: M.initialMarket(),
  ext: { kind: 'negative', x: 18 },
  pg: { k: 3, tax: false, items: {} },
  info: { g: 0.6, inspect: false },
  done: {},
});

export function mount(root, ctx) {
  const S = store.simState('T09', INIT());
  S.done ??= {}; S.pg.items ??= {};
  const prog = store.progress('T09');
  const persist = () => store.saveSim();
  const ticks = []; let raf = 0; const disposers = [];
  const opt = (id) => ({ id, ...OPT[id] });
  const reduced = () => store.get().reducedMotion;

  // ============================ MARKET LAB (L1–L3) ============================
  const mk = (() => {
    const m = S.market;
    const chartBox = h('div', { class: 'chart-box', 'aria-live': 'off' });
    const legend = h('div', { class: 'legend' },
      h('span', { class: 'lg d' }, h('i'), h('b', { 'data-term': 'demand' }, i18n.term('demand'))),
      h('span', { class: 'lg s' }, h('i'), h('b', { 'data-term': 'supply' }, i18n.term('supply'))),
      h('span', { class: 'lg g' }, h('i'), h('b', { 'data-k': 'mk.legend.ghost' }, t('mk.legend.ghost'))),
      h('span', { class: 'lg e' }, h('i'), h('b', { 'data-k': 'mk.legend.eq' }, t('mk.legend.eq'))));
    const read = h('div', { class: 'readout', role: 'status', 'aria-live': 'polite' });
    const tableBox = h('div', { class: 'table-wrap' });
    const desc = h('p', { class: 'sr-only', id: 'mk-desc' });

    const sc = chips({ name: 'scen', value: m.scenario, options: M.SCENARIO_IDS.map((id) => ({ id, key: `mk.sc.${id}` })), onSelect: (id) => { m.scenario = id; clampShifts(); sync(); } });
    const scNote = h('p', { class: 'note', 'data-k': 'mk.sc.base.note' });
    const sPrice = slider({ id: 'mk-price', labelKey: 'mk.ctl.price', min: 10, max: 95, step: 1, value: m.price, format: (v) => `₹${v}`, onInput: (v) => { m.price = v; draw(); } });
    const sD = slider({ id: 'mk-sd', labelKey: 'mk.ctl.shiftD', min: -40, max: 40, step: 1, value: m.sD, format: (v) => (v > 0 ? `+${v}` : `${v}`), onInput: (v) => { m.sD = v; draw(); }, hintKey: 'mk.ctl.shiftD.hint' });
    const sS = slider({ id: 'mk-ss', labelKey: 'mk.ctl.shiftS', min: -40, max: 40, step: 1, value: m.sS, format: (v) => (v > 0 ? `+${v}` : `${v}`), onInput: (v) => { m.sS = v; draw(); }, hintKey: 'mk.ctl.shiftS.hint' });
    const tCeil = toggle({ id: 'mk-ceil-on', labelKey: 'mk.ctl.ceilOn', checked: m.ceilingOn, onChange: (v) => { m.ceilingOn = v; sync(); } });
    const sCeil = slider({ id: 'mk-ceil', labelKey: 'mk.ctl.ceil', min: 10, max: 95, step: 1, value: m.ceiling, format: (v) => `₹${v}`, onInput: (v) => { m.ceiling = v; draw(); } });
    const bSnap = button('mk.btn.snap', () => snap(), 'btn primary');
    const bReset = button('btn.reset', () => { Object.assign(m, M.initialMarket()); sync(); }, 'btn');
    const bExpUp = button('mk.btn.expUp', () => { expect(+1); }, 'btn ghost');
    const bExpDn = button('mk.btn.expDn', () => { expect(-1); }, 'btn ghost');

    function clampShifts() {
      const lim = M.shiftLimit(m.scenario);
      m.sD = Math.max(-lim, Math.min(lim, m.sD)); m.sS = Math.max(-lim, Math.min(lim, m.sS));
      sD.setRange(-lim, lim); sS.setRange(-lim, lim);
    }
    function expect(dir) { // expectation of a coming price rise: buyers buy now (demand right), sellers hold stock back (supply left)
      const lim = M.shiftLimit(m.scenario); m.sD = Math.round(Math.min(lim, 15) * dir); m.sS = -Math.round(Math.min(lim, 10) * dir); sync();
    }
    function snap() {
      const target = Math.round(M.equilibrium(m).P * 10) / 10;
      if (reduced()) { m.price = target; sync(); return; }
      cancelAnimationFrame(raf);
      const from = m.price, t0 = performance.now(), dur = 900;
      const step = (now) => { const k = Math.min(1, (now - t0) / dur), e = 1 - (1 - k) ** 3; m.price = from + (target - from) * e; sPrice.set(Math.round(m.price)); draw(); if (k < 1) raf = requestAnimationFrame(step); else { m.price = target; sync(); } };
      raf = requestAnimationFrame(step);
    }
    function sync() { clampShifts(); sc.select(m.scenario); sPrice.set(Math.round(m.price)); sD.set(m.sD); sS.set(m.sS); tCeil.set(m.ceilingOn); sCeil.set(m.ceiling); sCeil.input.disabled = !m.ceilingOn; draw(); }

    const status = (st) => ({ surplus: t('mk.st.surplus'), shortage: t('mk.st.shortage'), balanced: t('mk.st.balanced') }[st]);

    function draw() {
      persist();
      scNote.dataset.k = `mk.sc.${m.scenario}.note`; scNote.textContent = t(`mk.sc.${m.scenario}.note`);
      const c = M.compute(m), { eq, at } = c, sc0 = { ...m, sD: 0, sS: 0 };
      const ch = new Chart({ xMax: M.QMAX, yMax: M.PMAX, xLabel: t('mk.axis.q'), yLabel: t('mk.axis.p'), yPrefix: '₹', xTicks: 6, yTicks: 5 });
      ch.axes();
      // ghost (original) curves make shift vs movement visible
      if (m.sD !== 0) ch.line(sampleCurve((p) => M.qd(sc0, p), 0, 100, 50), 'curve ghost', { dash: true });
      if (m.sS !== 0) ch.line(sampleCurve((p) => M.qs(sc0, p), 0, 100, 50), 'curve ghost', { dash: true });
      // wedge between the curves at the chosen price
      if (at.status !== 'balanced') ch.poly([[at.Qd, at.P], [at.Qs, at.P], [eq.Q, eq.P]], at.status === 'surplus' ? 'wedge surplus' : 'wedge shortage');
      ch.line(sampleCurve((p) => M.qd(m, p), 0, 100, 80), 'curve d');
      ch.line(sampleCurve((p) => M.qs(m, p), 0, 100, 80), 'curve s');
      ch.text(Math.min(M.qd(m, 90), 112) + 1.5, 90, 'D', 'curve-lbl d', 'start', 0, 4);
      ch.text(Math.min(M.qs(m, 96), 112) + 1.5, 96, 'S', 'curve-lbl s', 'start', 0, 4);
      // equilibrium guides
      ch.add(`<line class="guide" x1="${ch.X(eq.Q)}" x2="${ch.X(eq.Q)}" y1="${ch.Y(eq.P)}" y2="${ch.Y(0)}"/><line class="guide" x1="${ch.X(0)}" x2="${ch.X(eq.Q)}" y1="${ch.Y(eq.P)}" y2="${ch.Y(eq.P)}"/>`);
      ch.dot(eq.Q, eq.P, 'eqdot', 7);
      ch.text(eq.Q, 0, `Q*=${fmt(eq.Q, 0)}`, 'guide-lbl', 'middle', 0, -6);
      ch.text(0, eq.P, `P*=₹${fmt(eq.P, 0)}`, 'guide-lbl', 'start', 6, -5);
      // price line (draggable)
      ch.add(`<line class="priceline" x1="${ch.X(0)}" x2="${ch.X(M.QMAX)}" y1="${ch.Y(at.P)}" y2="${ch.Y(at.P)}"/>`);
      ch.dot(at.Qd, at.P, 'pt d', 5); ch.dot(at.Qs, at.P, 'pt s', 5);
      ch.text(at.Qd, at.P, `Qd=${fmt(at.Qd, 0)}`, 'pt-lbl d', at.Qd <= at.Qs ? 'end' : 'start', at.Qd <= at.Qs ? -8 : 8, -9);
      ch.text(at.Qs, at.P, `Qs=${fmt(at.Qs, 0)}`, 'pt-lbl s', at.Qd <= at.Qs ? 'start' : 'end', at.Qd <= at.Qs ? 8 : -8, -9);
      if (at.status !== 'balanced') ch.text((at.Qd + at.Qs) / 2, at.P, status(at.status).toUpperCase(), 'wedge-lbl', 'middle', 0, at.status === 'surplus' ? 20 : -14);
      ch.add(`<g class="handle" tabindex="-1"><circle cx="${ch.X(M.QMAX) - 14}" cy="${ch.Y(at.P)}" r="13"/><text x="${ch.X(M.QMAX) - 14}" y="${ch.Y(at.P) + 4}" text-anchor="middle">₹</text></g>`);
      if (m.ceilingOn) { ch.add(`<line class="ceilline" x1="${ch.X(0)}" x2="${ch.X(M.QMAX)}" y1="${ch.Y(m.ceiling)}" y2="${ch.Y(m.ceiling)}"/>`); ch.text(M.QMAX, m.ceiling, `${t('mk.ceilLabel')} ₹${m.ceiling}`, 'ceil-lbl', 'end', -4, 15); }
      if (c.blackMarketPrice != null && c.blackMarketPrice <= M.PMAX + 8) { ch.dot(at.traded, c.blackMarketPrice, 'bmdot', 6); ch.text(at.traded, c.blackMarketPrice, `${t('mk.bm')} ₹${fmt(c.blackMarketPrice, 0)}`, 'bm-lbl', 'start', 9, 4); }
      chartBox.innerHTML = ch.html({ label: t('mk.chart.aria') });
      chartBox.querySelector('svg').dataset.ymap = JSON.stringify({ top: ch.m.t, bottom: ch.h - ch.m.b, ymax: M.PMAX, h: ch.h });
      // readout (numbers from the model)
      const num = { P: fmt(at.P, 0), Qd: fmt(at.Qd, 0), Qs: fmt(at.Qs, 0), eqP: fmt(eq.P, 0), eqQ: fmt(eq.Q, 0), sur: fmt(at.surplus, 0), sho: fmt(at.shortage, 0), tr: fmt(at.traded, 0), bm: c.blackMarketPrice != null ? fmt(c.blackMarketPrice, 0) : '', cap: fmt(m.ceiling, 0) };
      let html = `<div class="ro-line">${esc(t('mk.ro.at', num))}</div>`;
      html += `<div class="ro-line status ${at.status}">${esc(t(`mk.ro.${at.status}`, num))}</div>`;
      if (c.capped && c.binding) html += `<div class="ro-line warn">${esc(t('mk.ro.capped', num))}</div>`;
      if (c.binding && c.blackMarketPrice != null) html += `<div class="ro-line warn">${esc(t('mk.ro.bm', num))}</div>`;
      if (m.ceilingOn && !c.binding) html += `<div class="ro-line">${esc(t('mk.ro.notbinding', num))}</div>`;
      html += `<div class="ro-line eq">${esc(t('mk.ro.eq', num))}</div>`;
      read.innerHTML = html;
      desc.textContent = t('mk.ro.at', num) + '. ' + t(`mk.ro.${at.status}`, num);
      chartBox.firstChild?.setAttribute('aria-describedby', 'mk-desc');
      // price–quantity table
      let tb = `<table class="tbl"><caption class="sr-only">${esc(t('mk.tbl.cap'))}</caption><thead><tr><th>${esc(t('mk.tbl.p'))}</th><th>${esc(t('mk.tbl.qd'))}</th><th>${esc(t('mk.tbl.qs'))}</th><th>${esc(t('mk.tbl.st'))}</th></tr></thead><tbody>`;
      for (const r of c.rows) tb += `<tr class="${r.status}${Math.abs(r.P - at.P) < 5 ? ' cur' : ''}"><td>₹${r.P}</td><td>${fmt(r.Qd, 0)}</td><td>${fmt(r.Qs, 0)}</td><td>${esc(status(r.status))}</td></tr>`;
      tableBox.innerHTML = tb + '</tbody></table>';
    }
    // drag the price line directly on the graph
    chartBox.addEventListener('pointerdown', (e) => {
      const svg = chartBox.querySelector('svg'); if (!svg) return;
      const move = (ev) => {
        const r = svg.getBoundingClientRect(); const meta = JSON.parse(svg.dataset.ymap);
        const py = ((ev.clientY - r.top) / r.height) * meta.h;
        const frac = (meta.bottom - py) / (meta.bottom - meta.top); const p = Math.round(frac * meta.ymax);
        m.price = Math.max(10, Math.min(95, p)); sPrice.set(m.price); draw();
      };
      chartBox.setPointerCapture?.(e.pointerId); move(e);
      const up = () => { chartBox.removeEventListener('pointermove', move); chartBox.removeEventListener('pointerup', up); chartBox.removeEventListener('pointercancel', up); };
      chartBox.addEventListener('pointermove', move); chartBox.addEventListener('pointerup', up); chartBox.addEventListener('pointercancel', up);
    });

    // ---- predictions: answer is computed from the model, never hard-coded ----
    const run = {
      p1: () => { m.price = 75; m.ceilingOn = false; sync(); return M.statusAt(m, 75).status; },
      p2: () => { const b = M.equilibrium(m); m.sD = Math.min(M.shiftLimit(m.scenario), m.sD + 20); sync(); return dir(b, M.equilibrium(m)); },
      p3: () => { const b = M.equilibrium(m); m.sS = Math.max(-M.shiftLimit(m.scenario), m.sS - 20); sync(); return dir(b, M.equilibrium(m)); },
      p4: () => { const e = M.equilibrium(m); m.ceilingOn = true; m.ceiling = Math.round(e.P * 0.7); m.price = Math.round(Math.min(95, e.P + 25)); sync(); const c = M.compute(m); return c.binding ? 'shortage' : 'noeffect'; },
      p5: () => {
        const a = { ...M.initialMarket(), scenario: 'base', sD: -15 }, b = { ...M.initialMarket(), scenario: 'perishable', sD: -15 };
        const fa = M.P0 - M.equilibrium(a).P, fb = M.P0 - M.equilibrium(b).P;
        Object.assign(m, M.initialMarket(), { scenario: 'perishable', sD: -15, price: 50 }); sync();
        return Math.abs(fb - fa) < 0.05 ? 'sameFall' : fb > fa ? 'moreFall' : 'lessFall';
      },
    };
    const dir = (a, b) => `P${b.P > a.P + 1e-9 ? 'u' : 'd'}Q${b.Q > a.Q + 1e-9 ? 'u' : 'd'}`;
    const preds = [
      { id: 'p1', stem: { en: 'The price is raised to ₹75 (the equilibrium is ₹50). What happens in the market?', hi: 'कीमत बढ़ाकर ₹75 कर दी जाती है (संतुलन ₹50 है)। बाज़ार में क्या होगा?' }, options: ['surplus', 'shortage', 'balanced'].map(opt), run: run.p1,
        explain: () => { const a = M.statusAt(m, 75); return { en: `At ₹75 buyers want ${fmt(a.Qd, 0)} units but sellers offer ${fmt(a.Qs, 0)}: ${a.status === 'surplus' ? `${fmt(a.surplus, 0)} units stay unsold, so sellers have to cut the price.` : a.status}`, hi: `₹75 पर खरीदार ${fmt(a.Qd, 0)} इकाई चाहते हैं पर विक्रेता ${fmt(a.Qs, 0)} देते हैं: ${a.status === 'surplus' ? `${fmt(a.surplus, 0)} इकाई बिना बिकी रहती हैं, इसलिए विक्रेताओं को कीमत घटानी पड़ती है।` : a.status}` }; } },
      { id: 'p2', stem: { en: 'Festival season: demand shifts RIGHT by 20 units at every price. What happens to the equilibrium price and quantity?', hi: 'त्योहार का मौसम: हर कीमत पर माँग 20 इकाई दाईं ओर खिसकती है। संतुलन कीमत और मात्रा का क्या होगा?' }, options: ['PuQu', 'PuQd', 'PdQu', 'PdQd'].map(opt), run: run.p2,
        explain: () => { const e = M.equilibrium(m); return { en: `The whole demand curve moved (see the dashed original). The new crossing is at ₹${fmt(e.P, 0)} and ${fmt(e.Q, 0)} units: the price rose and sellers moved UP along their supply curve.`, hi: `पूरा माँग वक्र खिसक गया (धराशायी मूल रेखा देखें)। नया कटाव-बिंदु ₹${fmt(e.P, 0)} और ${fmt(e.Q, 0)} इकाई पर है: कीमत बढ़ी और विक्रेता अपने पूर्ति वक्र पर ऊपर की ओर चले।` }; } },
      { id: 'p3', stem: { en: 'A poor harvest: supply shifts LEFT by 20 units at every price. What happens to the equilibrium?', hi: 'खराब फ़सल: हर कीमत पर पूर्ति 20 इकाई बाईं ओर खिसकती है। संतुलन का क्या होगा?' }, options: ['PuQu', 'PuQd', 'PdQu', 'PdQd'].map(opt), run: run.p3,
        explain: () => { const e = M.equilibrium(m); return { en: `Fewer goods are on offer at every price, so the new crossing is at a higher price (₹${fmt(e.P, 0)}) and a smaller quantity (${fmt(e.Q, 0)}).`, hi: `हर कीमत पर कम माल उपलब्ध है, इसलिए नया कटाव-बिंदु ऊँची कीमत (₹${fmt(e.P, 0)}) और कम मात्रा (${fmt(e.Q, 0)}) पर है।` }; } },
      { id: 'p4', stem: { en: 'The government fixes a maximum price about 30% below equilibrium. What happens?', hi: 'सरकार संतुलन से लगभग 30% नीचे अधिकतम कीमत तय करती है। क्या होगा?' }, options: ['shortage', 'surplus', 'noeffect'].map(opt), run: run.p4,
        explain: () => { const c = M.compute(m); return { en: `At the capped price ₹${fmt(c.at.P, 0)} buyers want ${fmt(c.at.Qd, 0)} but sellers offer only ${fmt(c.at.Qs, 0)}: a shortage of ${fmt(c.at.shortage, 0)}. Buyers would even pay about ₹${c.blackMarketPrice != null ? fmt(c.blackMarketPrice, 0) : '-'} for the few units available, which is the pressure behind a black market.`, hi: `सीमित कीमत ₹${fmt(c.at.P, 0)} पर खरीदार ${fmt(c.at.Qd, 0)} चाहते हैं पर विक्रेता केवल ${fmt(c.at.Qs, 0)} देते हैं: ${fmt(c.at.shortage, 0)} की कमी। उपलब्ध थोड़े माल के लिए खरीदार लगभग ₹${c.blackMarketPrice != null ? fmt(c.blackMarketPrice, 0) : '-'} तक देने को तैयार होते हैं; यही काला बाज़ार का दबाव है।` }; } },
      { id: 'p5', stem: { en: 'Fish (a perishable item): demand falls by 15 units. Compared with a non-perishable good, what happens to the price?', hi: 'मछली (शीघ्र नष्ट होने वाली वस्तु): माँग 15 इकाई घटती है। शीघ्र न नष्ट होने वाली वस्तु की तुलना में कीमत का क्या होगा?' }, options: ['moreFall', 'lessFall', 'sameFall'].map(opt), run: run.p5,
        explain: () => { const e = M.equilibrium(m); return { en: `Sellers cannot hold stock back, so supply barely falls with price and the whole drop lands on the price: it falls to ₹${fmt(e.P, 0)} (from ₹50).`, hi: `विक्रेता माल रोक नहीं सकते, इसलिए कीमत गिरने पर पूर्ति बहुत कम घटती है और पूरा झटका कीमत पर आता है: कीमत ₹50 से घटकर ₹${fmt(e.P, 0)} हो जाती है।` }; } },
    ];
    const predBox = h('div', { class: 'predicts' });
    const predEls = preds.map((p) => { const el = predict(p, { done: S.done, onDone: persist }); predBox.append(el); return el; });

    const left = h('div', { class: 'lab-main' }, chartBox, legend, read, h('details', { class: 'fold' }, h('summary', { 'data-k': 'mk.tbl.title' }, t('mk.tbl.title')), tableBox), desc);
    const right = h('div', { class: 'lab-side' },
      h('h3', { 'data-k': 'mk.h.scen' }, t('mk.h.scen')), sc.root, scNote,
      h('h3', { 'data-k': 'mk.h.vars' }, t('mk.h.vars')), sPrice.root, sD.root, sS.root,
      h('div', { class: 'row wrap' }, bSnap, bExpUp, bExpDn),
      h('h3', { 'data-k': 'mk.h.ceil' }, t('mk.h.ceil')), tCeil.root, sCeil.root,
      h('div', { class: 'row' }, bReset));
    sync();
    const el = h('div', { class: 'lab' }, h('div', { class: 'lab-grid' }, left, right),
      h('section', { class: 'subsec' }, h('h3', { 'data-k': 'predict.h' }, t('predict.h')), predBox));
    return { el, relabel() { predEls.forEach((p) => p.relabel()); draw(); }, snapshot: () => ({ m: { ...m }, c: M.compute(m) }) };
  })();

  // ============================ EXTERNALITY LAB (L4) ============================
  const ex = (() => {
    const e = S.ext;
    const box = h('div', { class: 'chart-box' }), read = h('div', { class: 'readout', role: 'status', 'aria-live': 'polite' });
    const kind = chips({ name: 'ek', value: e.kind, options: [{ id: 'negative', key: 'ex.neg' }, { id: 'positive', key: 'ex.pos' }], onSelect: (v) => { e.kind = v; draw(); } });
    const sx = slider({ id: 'ex-x', labelKey: 'ex.ctl.x', min: 0, max: 40, step: 1, value: e.x, format: (v) => `₹${v}`, onInput: (v) => { e.x = v; draw(); }, hintKey: 'ex.ctl.x.hint' });
    function draw() {
      persist();
      const r = M.externality(e), neg = e.kind === 'negative';
      const ch = new Chart({ xMax: 100, yMax: 120, xLabel: t('ex.axis.q'), yLabel: t('ex.axis.p'), yPrefix: '₹', xTicks: 5, yTicks: 6 });
      ch.axes();
      const pts = (f) => { const a = []; for (let q = 0; q <= 100; q += 2) { const y = f(q); if (y >= 0 && y <= 120) a.push([q, y]); } return a; };
      const dwl = neg ? [[r.Qopt, M.mb(r.Qopt)], [r.Qm, M.mb(r.Qm)], [r.Qm, M.mpc(r.Qm) + e.x]] : [[r.Qm, M.mb(r.Qm)], [r.Qm, M.mb(r.Qm) + e.x], [r.Qopt, M.mpc(r.Qopt)]];
      if (e.x > 0) ch.poly(dwl, 'wedge dwl');
      ch.line(pts(M.mb), 'curve d'); ch.line(pts(M.mpc), 'curve s');
      if (e.x > 0) ch.line(pts(neg ? (q) => M.mpc(q) + e.x : (q) => M.mb(q) + e.x), neg ? 'curve soc' : 'curve soc2', { dash: true });
      ch.dot(r.Qm, r.Pm, 'eqdot', 7); ch.vline(r.Qm, 'guide', 0, r.Pm);
      if (e.x > 0) { ch.dot(r.Qopt, r.Popt, 'optdot', 7); ch.vline(r.Qopt, 'guide opt', 0, r.Popt); }
      ch.text(6, 98, neg ? t('ex.lbl.mb') : t('ex.lbl.mb'), 'curve-lbl d', 'start'); ch.text(98, M.mpc(98) + 3, t('ex.lbl.mpc'), 'curve-lbl s', 'end', 0, 6);
      if (e.x > 0) ch.text(r.Qopt, 0, `Q*=${fmt(r.Qopt, 1)}`, 'guide-lbl opt', 'middle', 0, -6);
      ch.text(r.Qm, 0, `Qm=${fmt(r.Qm, 0)}`, 'guide-lbl', 'middle', 0, -20);
      box.innerHTML = ch.html({ label: t('ex.chart.aria') });
      const num = { x: fmt(e.x, 0), Qm: fmt(r.Qm, 0), Qo: fmt(r.Qopt, 1), gap: fmt(Math.abs(r.gap), 1), dwl: fmt(r.dwl, 0) };
      let html = `<div class="ro-line">${esc(t('ex.ro.market', num))}</div>`;
      html += e.x === 0 ? `<div class="ro-line">${esc(t('ex.ro.none'))}</div>` : `<div class="ro-line status ${neg ? 'surplus' : 'shortage'}">${esc(t(neg ? 'ex.ro.neg' : 'ex.ro.pos', num))}</div><div class="ro-line warn">${esc(t('ex.ro.dwl', num))}</div>`;
      read.innerHTML = html;
    }
    const pr = predict({ id: 'e1', stem: { en: 'A factory’s smoke costs neighbours ₹18 for every unit it makes, and the factory does not pay it. Compared with the socially best quantity, the market produces…', hi: 'एक कारखाने का धुआँ पड़ोसियों पर हर इकाई ₹18 की लागत डालता है और कारखाना उसे नहीं चुकाता। सामाजिक रूप से सर्वश्रेष्ठ मात्रा की तुलना में बाज़ार उत्पादन करेगा…' },
      options: ['more', 'less', 'same'].map(opt), run: () => { e.kind = 'negative'; e.x = 18; kind.select('negative'); sx.set(18); draw(); const r = M.externality(e); return r.gap < -1e-9 ? 'more' : r.gap > 1e-9 ? 'less' : 'same'; },
      explain: () => { const r = M.externality({ kind: 'negative', x: 18 }); return { en: `The factory counts only its own cost, so it makes ${fmt(r.Qm, 0)} units. Counting the neighbours’ cost too, the best quantity is ${fmt(r.Qopt, 0)}. The ${fmt(r.Qm - r.Qopt, 0)} extra units cost society more than they are worth: a welfare loss of ₹${fmt(r.dwl, 0)} per day.`, hi: `कारखाना केवल अपनी लागत गिनता है, इसलिए ${fmt(r.Qm, 0)} इकाई बनाता है। पड़ोसियों की लागत भी जोड़ें तो सर्वश्रेष्ठ मात्रा ${fmt(r.Qopt, 0)} है। ये अतिरिक्त ${fmt(r.Qm - r.Qopt, 0)} इकाइयाँ समाज को अपने मूल्य से अधिक महँगी पड़ती हैं: प्रतिदिन ₹${fmt(r.dwl, 0)} की कल्याण-हानि।` }; } }, { done: S.done, onDone: persist });
    draw();
    const el = h('div', { class: 'lab' }, h('p', { class: 'lead' }, bi({ en: 'Some costs and benefits fall on people who are not part of the deal. The market ignores them. Slide the outside cost (or benefit) and compare the market quantity with the quantity that is best for society.', hi: 'कुछ लागतें और लाभ उन लोगों पर पड़ते हैं जो सौदे में शामिल नहीं हैं। बाज़ार उन्हें अनदेखा करता है। बाहरी लागत (या लाभ) बदलें और बाज़ार की मात्रा की तुलना समाज के लिए सर्वश्रेष्ठ मात्रा से करें।' }, { tag: 'span' })),
      h('div', { class: 'lab-grid' }, h('div', { class: 'lab-main' }, box, read), h('div', { class: 'lab-side' }, h('h3', { 'data-k': 'ex.h.kind' }, t('ex.h.kind')), kind.root, sx.root, h('div', { class: 'row' }, button('btn.reset', () => { Object.assign(e, { kind: 'negative', x: 18 }); kind.select('negative'); sx.set(18); draw(); })))),
      h('section', { class: 'subsec' }, h('h3', { 'data-k': 'predict.h' }, t('predict.h')), pr));
    return { el, relabel() { pr.relabel(); relabelBi(el); draw(); } };
  })();

  // ============================ PUBLIC GOODS (L5) ============================
  const pg = (() => {
    const itemsBox = h('div', { class: 'cards' });
    const NAMES = {
      streetlight: { en: 'Street lighting on a road', hi: 'सड़क पर प्रकाश (स्ट्रीट लाइट)' }, lighthouse: { en: 'A lighthouse', hi: 'प्रकाश-स्तंभ' }, park: { en: 'An open public park', hi: 'खुला सार्वजनिक पार्क' },
      mango: { en: 'A mango bought from a vendor', hi: 'विक्रेता से खरीदा आम' }, cinema: { en: 'A cinema seat', hi: 'सिनेमा की सीट' }, tuition: { en: 'A seat in a paid tuition class', hi: 'सशुल्क ट्यूशन कक्षा में एक सीट' },
    };
    const WHY_HI = {
      streetlight: 'रोशनी सड़क पर चलने वाले सभी पर पड़ती है; एक और राहगीर से वह घटती नहीं, और भुगतान न करने वालों को रोका नहीं जा सकता।',
      lighthouse: 'हर जहाज़ चेतावनी-प्रकाश का उपयोग कर सकता है; भुगतान न करने वाले जहाज़ों को रोका नहीं जा सकता, और एक के उपयोग से दूसरे का उपयोग घटता नहीं।',
      park: 'खुला सार्वजनिक पार्क: कोई भी अंदर आ सकता है और (भीड़ न हो तो) एक आगंतुक से दूसरे का आनंद कम नहीं होता। अधिक भीड़ इसे कुछ हद तक प्रतिद्वंद्वी बना देती है।',
      mango: 'विक्रेता भुगतान न करने पर मना कर सकता है, और आपका खाया आम किसी और को उपलब्ध नहीं रहता: निजी वस्तु।',
      cinema: 'केवल टिकटधारी अंदर जाते हैं, और एक की ली हुई सीट दूसरा उपयोग नहीं कर सकता।',
      tuition: 'शिक्षक भुगतान न करने वाले विद्यार्थी को मना कर सकता है और छोटी कक्षा में सीटें सीमित होती हैं।',
    };
    const cardEls = M.PUBLIC_GOOD_ITEMS.map((it) => {
      const st = (S.pg.items[it.id] ??= { ex: null, ri: null, checked: false });
      const mkSel = (field, qKey) => {
        const grp = h('div', { class: 'yn', role: 'radiogroup', 'aria-label': t(qKey) });
        const lab = h('div', { class: 'yn-q', 'data-k': qKey }, t(qKey));
        ['yes', 'no'].forEach((v) => { const b = h('button', { type: 'button', role: 'radio', class: 'opt small', 'aria-checked': st[field] === v ? 'true' : 'false', 'data-k': `yn.${v}`, onclick: () => { st[field] = v; persist(); [...grp.children].forEach((x) => x.setAttribute('aria-checked', x.dataset.v === st[field] ? 'true' : 'false')); } }, t(`yn.${v}`)); b.dataset.v = v; grp.append(b); });
        return h('div', { class: 'yn-row' }, lab, grp);
      };
      const fb = h('div', { class: 'feedback', 'aria-live': 'polite' });
      const nm = h('h4', {}); nm.dataset.bi = JSON.stringify(NAMES[it.id]); nm.dataset.inline = ''; nm.innerHTML = pairHtml(NAMES[it.id].en, NAMES[it.id].hi);
      const show = () => {
        if (!st.checked) return;
        const exOk = st.ex === (it.excludable ? 'yes' : 'no'), riOk = st.ri === (it.rival ? 'yes' : 'no');
        const pub = M.isPublicGood(it);
        fb.className = 'feedback ' + (exOk && riOk ? 'ok' : 'try');
        fb.innerHTML = `<strong data-k="${exOk && riOk ? 'fb.right' : 'fb.notquite'}">${esc(t(exOk && riOk ? 'fb.right' : 'fb.notquite'))}</strong> <span data-k="${pub ? 'pg.verdict.pub' : 'pg.verdict.priv'}">${esc(t(pub ? 'pg.verdict.pub' : 'pg.verdict.priv'))}</span> ${biHtml({ en: it.why, hi: WHY_HI[it.id] }, { block: true })}`;
      };
      const chk = h('button', { type: 'button', class: 'btn', 'data-k': 'btn.check', onclick: () => { if (!st.ex || !st.ri) { fb.className = 'feedback hint'; fb.textContent = t('pg.answerBoth'); return; } st.checked = true; persist(); show(); } }, t('btn.check'));
      show();
      return h('div', { class: 'card' }, nm, mkSel('ex', 'pg.q.excl'), mkSel('ri', 'pg.q.rival'), h('div', { class: 'row' }, chk), fb);
    });
    cardEls.forEach((c) => itemsBox.append(c));

    // free-rider street light (fictional numbers)
    const g = S.pg; const frBox = h('div', { class: 'chart-box fr' }), frRead = h('div', { class: 'readout', role: 'status', 'aria-live': 'polite' });
    const sk = slider({ id: 'pg-k', labelKey: 'pg.ctl.k', min: 0, max: M.FR.households, step: 1, value: g.k, format: (v) => `${v} / ${M.FR.households}`, onInput: (v) => { g.k = v; draw(); } });
    const tx = toggle({ id: 'pg-tax', labelKey: 'pg.ctl.tax', checked: g.tax, onChange: (v) => { g.tax = v; draw(); } });
    function draw() {
      persist(); sk.input.disabled = g.tax;
      const r = M.freeRider(g.k, g.tax), n = M.FR.households;
      let svg = `<svg viewBox="0 0 640 210" class="chart" role="img" aria-label="${esc(t('pg.chart.aria'))}" xmlns="http://www.w3.org/2000/svg">`;
      svg += `<rect x="0" y="0" width="640" height="210" class="sky ${r.lit ? 'day' : 'night'}"/>`;
      svg += `<line class="axis" x1="30" x2="610" y1="168" y2="168"/><rect x="316" y="48" width="8" height="120" class="pole"/>`;
      svg += `<circle cx="320" cy="42" r="${r.lit ? 26 : 12}" class="lamp ${r.lit ? 'on' : 'off'}"/>`;
      if (r.lit) svg += `<polygon class="beam" points="320,56 210,168 430,168"/>`;
      for (let i = 0; i < n; i++) {
        const payer = g.tax || i < g.k, x = 38 + i * 58;
        svg += `<g transform="translate(${x},118)"><rect width="42" height="50" class="house ${payer ? 'payer' : 'free'}"/><polygon points="-4,0 21,-24 46,0" class="roof"/><text x="21" y="32" text-anchor="middle" class="house-t">${payer ? '₹' : '—'}</text></g>`;
      }
      svg += '</svg>';
      frBox.innerHTML = svg;
      const num = { k: g.k, n, col: fmt(r.collected, 0), need: M.FR.cost, pay: M.FR.pay, val: M.FR.value, pn: fmt(r.payerNet, 0), fn: r.nonPayerNet == null ? '' : fmt(r.nonPayerNet, 0), minp: r.needed, share: r.share != null ? fmt(r.share, 0) : '' };
      let html = '';
      if (g.tax) html += `<div class="ro-line status balanced">${esc(t('pg.ro.tax', num))}</div>`;
      else {
        html += `<div class="ro-line">${esc(t('pg.ro.col', num))}</div><div class="ro-line status ${r.lit ? 'balanced' : 'shortage'}">${esc(t(r.lit ? 'pg.ro.on' : 'pg.ro.off', num))}</div>`;
        html += `<div class="ro-line">${esc(t('pg.ro.net', num))}</div>`;
        if (r.lit && g.k < n) html += `<div class="ro-line warn">${esc(t('pg.ro.free', num))}</div>`;
      }
      frRead.innerHTML = html;
    }
    const pr = predict({ id: 'g1', stem: { en: 'The street light costs ₹60 a month to run. Each of 10 households is asked to pay ₹10 voluntarily, and 5 of them agree. Does the light stay on?', hi: 'सड़क की बत्ती चलाने का खर्च ₹60 प्रति माह है। 10 परिवारों से स्वेच्छा से ₹10 देने को कहा जाता है और 5 सहमत होते हैं। क्या बत्ती जलती रहेगी?' },
      options: ['yes', 'no'].map(opt), run: () => { g.tax = false; g.k = 5; tx.set(false); sk.set(5); draw(); return M.freeRider(5).lit ? 'yes' : 'no'; },
      explain: () => { const r = M.freeRider(5); return { en: `5 × ₹10 = ₹${fmt(r.collected, 0)}, less than the ₹60 needed, so the light stays off. Each household hopes the others will pay (free-riding), and if too many wait, nobody gets the light. At least ${r.needed} must pay, or the cost can be collected from everyone as a tax.`, hi: `5 × ₹10 = ₹${fmt(r.collected, 0)}, जो ज़रूरी ₹60 से कम है, इसलिए बत्ती बंद रहती है। हर परिवार आशा करता है कि दूसरे भुगतान करेंगे (फ्री-राइडिंग), और अधिक लोग रुकें तो किसी को बत्ती नहीं मिलती। कम से कम ${r.needed} को भुगतान करना होगा, या खर्च सबसे कर के रूप में वसूला जा सकता है।` }; } }, { done: S.done, onDone: persist });
    draw();
    const el = h('div', { class: 'lab' },
      h('section', { class: 'subsec' }, h('h3', { 'data-k': 'pg.h.classify' }, t('pg.h.classify')), h('p', { class: 'note' }, bi({ en: 'A public good is BOTH non-excludable and non-rival. Decide each question for every item, then check.', hi: 'सार्वजनिक वस्तु अपवर्जन-रहित और प्रतिद्वंद्विता-रहित दोनों होती है। हर वस्तु के लिए दोनों प्रश्न तय करें, फिर जाँचें।' }, { tag: 'span' })), itemsBox),
      h('section', { class: 'subsec' }, h('h3', { 'data-k': 'pg.h.fr' }, t('pg.h.fr')), h('div', { class: 'lab-grid' }, h('div', { class: 'lab-main' }, frBox, frRead), h('div', { class: 'lab-side' }, sk.root, tx.root, h('p', { class: 'note', 'data-k': 'pg.fictional' }, t('pg.fictional')), h('div', { class: 'row' }, button('btn.reset', () => { g.k = 3; g.tax = false; sk.set(3); tx.set(false); draw(); })))),
        h('h3', { 'data-k': 'predict.h' }, t('predict.h')), pr));
    return { el, relabel() { pr.relabel(); relabelBi(el); i18n.apply(el); draw(); } };
  })();

  // ============================ INFORMATION ASYMMETRY (L6) ============================
  const ia = (() => {
    const i = S.info; const box = h('div', { class: 'chart-box' }), read = h('div', { class: 'readout', role: 'status', 'aria-live': 'polite' });
    const sg = slider({ id: 'ia-g', labelKey: 'ia.ctl.g', min: 0, max: 100, step: 5, value: Math.round(i.g * 100), format: (v) => `${v}%`, onInput: (v) => { i.g = v / 100; draw(); } });
    const ti = toggle({ id: 'ia-insp', labelKey: 'ia.ctl.insp', checked: i.inspect, onChange: (v) => { i.inspect = v; draw(); } });
    function draw() {
      persist();
      const r = M.usedBikes(i.g, i.inspect), B = M.BIKE;
      const W = 640, x = (v) => 40 + (v / 80) * 560;
      let svg = `<svg viewBox="0 0 ${W} 190" class="chart" role="img" aria-label="${esc(t('ia.chart.aria'))}" xmlns="http://www.w3.org/2000/svg"><line class="axis" x1="40" x2="600" y1="120" y2="120"/>`;
      for (let v = 0; v <= 80; v += 10) svg += `<line class="grid v" x1="${x(v)}" x2="${x(v)}" y1="40" y2="120"/><text class="tick" x="${x(v)}" y="140" text-anchor="middle">₹${v}k</text>`;
      const mark = (v, cls, label, row) => `<line class="${cls}" x1="${x(v)}" x2="${x(v)}" y1="${60 + row * 0}" y2="120"/><text class="mk-lbl ${cls}" x="${x(v)}" y="${52 - row * 0}" text-anchor="middle">${esc(label)}</text>`;
      svg += mark(B.bad.seller, 'mk bad', t('ia.m.badS'), 0) + mark(B.bad.buyer, 'mk bad', t('ia.m.badB'), 0) + mark(B.good.seller, 'mk good', t('ia.m.goodS'), 0) + mark(B.good.buyer, 'mk good', t('ia.m.goodB'), 0);
      if (!i.inspect) svg += `<line class="offer" x1="${x(r.offer)}" x2="${x(r.offer)}" y1="30" y2="120"/><path d="M${x(r.offer) - 8},18 h16 l-8,12 z" class="offer-head"/><text x="${x(r.offer)}" y="14" class="offer-lbl" text-anchor="middle">${esc(t('ia.m.offer'))} ₹${fmt(r.offer, 0)}k</text>`;
      svg += `<text x="320" y="172" text-anchor="middle" class="tick">${esc(t('ia.axis'))}</text></svg>`;
      box.innerHTML = svg;
      let html;
      if (i.inspect) html = `<div class="ro-line status balanced">${esc(t('ia.ro.insp', { gp: fmt(r.goodPrice, 0), bp: fmt(r.badPrice, 0) }))}</div>`;
      else html = `<div class="ro-line">${esc(t('ia.ro.offer', { g: Math.round(i.g * 100), offer: fmt(r.offer, 0) }))}</div><div class="ro-line status ${r.goodTrades ? 'balanced' : 'shortage'}">${esc(t(r.goodTrades ? 'ia.ro.stay' : 'ia.ro.leave', { need: Math.round(M.goodShareNeeded() * 100) }))}</div>`;
      read.innerHTML = html;
    }
    const pr = predict({ id: 'i1', stem: { en: 'Only 50 of every 100 used bikes are good, and buyers cannot tell which. Sellers of good bikes want at least ₹60k. What happens to good bikes?', hi: 'हर 100 पुरानी बाइकों में केवल 50 अच्छी हैं और खरीदार पहचान नहीं सकते। अच्छी बाइक के विक्रेता कम से कम ₹60 हज़ार चाहते हैं। अच्छी बाइकों का क्या होगा?' },
      options: ['fair', 'withdraw'].map(opt), run: () => { i.g = 0.5; i.inspect = false; sg.set(50); ti.set(false); draw(); return M.usedBikes(0.5, false).goodTrades ? 'fair' : 'withdraw'; },
      explain: () => { const r = M.usedBikes(0.5, false); return { en: `Buyers can only offer the average value, ₹${fmt(r.offer, 0)}k, which is below the ₹60k that good-bike owners want. They withdraw, mostly poor bikes remain, and the market shrinks. Switch on “inspection report” to see trade return.`, hi: `खरीदार केवल औसत मूल्य ₹${fmt(r.offer, 0)} हज़ार दे सकते हैं, जो अच्छी बाइक के मालिकों के ₹60 हज़ार से कम है। वे बाइक हटा लेते हैं, ज़्यादातर खराब बाइकें बचती हैं और बाज़ार सिकुड़ जाता है। “निरीक्षण रिपोर्ट” चालू करके देखें कि व्यापार वापस आ जाता है।` }; } }, { done: S.done, onDone: persist });
    draw();
    const el = h('div', { class: 'lab' }, h('p', { class: 'lead' }, bi({ en: 'When the seller knows more than the buyer, the buyer can only offer an average price. Move the share of good bikes and see who leaves the market.', hi: 'जब विक्रेता खरीदार से अधिक जानता है, तो खरीदार केवल औसत कीमत दे सकता है। अच्छी बाइकों का अनुपात बदलें और देखें कि कौन बाज़ार छोड़ता है।' }, { tag: 'span' })),
      h('div', { class: 'lab-grid' }, h('div', { class: 'lab-main' }, box, read), h('div', { class: 'lab-side' }, sg.root, ti.root, h('p', { class: 'note', 'data-k': 'ia.fictional' }, t('ia.fictional')), h('div', { class: 'row' }, button('btn.reset', () => { i.g = 0.6; i.inspect = false; sg.set(60); ti.set(false); draw(); })))),
      h('section', { class: 'subsec' }, h('h3', { 'data-k': 'predict.h' }, t('predict.h')), pr));
    return { el, relabel() { pr.relabel(); relabelBi(el); draw(); } };
  })();

  // ============================ EXIT TICKET + REFLECTION ============================
  const exitBox = h('div', { class: 'exit' });
  const mcqs = EXIT.map((q) => { const el = mcq(q, { done: S.done, onDone: (id, v) => { prog.exit[id] = v; store.saveProgress(); persist(); } }); exitBox.append(h('div', { class: 'exit-q' }, el)); return el; });
  const ta = h('textarea', { class: 'reflect', rows: 4, 'data-k-aria': 'reflect.aria', placeholder: t('reflect.ph') }); ta.value = prog.reflection || '';
  ta.addEventListener('input', () => { prog.reflection = ta.value; store.saveProgress(); });
  const exitSec = h('section', { class: 'subsec' }, h('h3', { 'data-k': 'exit.h' }, t('exit.h')), exitBox, h('h3', { 'data-k': 'reflect.h' }, t('reflect.h')), bi(REFLECT, { tag: 'p', cls: 'note' }), ta, h('p', { class: 'note', 'data-k': 'reflect.local' }, t('reflect.local')));

  const tb = tabs({ active: S.tab || 'market', onChange: (id) => { S.tab = id; persist(); },
    tabs: [{ id: 'market', key: 'T09.tab.market', el: mk.el }, { id: 'ext', key: 'T09.tab.ext', el: ex.el }, { id: 'pg', key: 'T09.tab.pg', el: pg.el }, { id: 'ia', key: 'T09.tab.ia', el: ia.el }] });
  root.append(tb.root, exitSec);
  i18n.apply(root);

  return {
    relabel() { mk.relabel(); ex.relabel(); pg.relabel(); ia.relabel(); mcqs.forEach((q) => q.relabel()); relabelBi(root); i18n.apply(root); ta.placeholder = t('reflect.ph'); },
    destroy() { cancelAnimationFrame(raf); },
    // test hook (used by e2e): read-only model snapshot
    debug: () => ({ market: mk.snapshot(), S }),
  };
}
