// 2D explorers for Class X (SVG + HTML, d3-shape / d3-hierarchy / d3-sankey). Each factory returns { el, relabel() }.
// Everything is keyboard reachable, bilingual and readable without colour alone.
import * as d3p from '../../vendor/d3/d3-plus.esm.js';
import { d3 } from '../engines/viz.js';
import { h } from '../core/dom.js';
import { pair } from '../core/i18n.js';
import { PALETTE } from '../engines/stage.js';

const NS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs = {}, ...kids) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) if (v != null) e.setAttribute(k, v); for (const c of kids.flat()) if (c != null) e.append(c.nodeType ? c : document.createTextNode(c)); return e; };
const T = (o) => (typeof o === 'string' ? o : pair(o.en, o.hi));
const chips = (items, active, on) => h('div', { class: 'xchips', role: 'group' }, ...items.map((it, i) => h('button', { type: 'button', class: 'xchip', 'aria-pressed': i === active ? 'true' : 'false', onclick: () => on(i) }, T(it))));
const fmt = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : v);
function widget(render) { const el = h('div', { class: 'x2d' }); const draw = () => el.replaceChildren(...[render(draw)].flat().filter(Boolean)); draw(); return { el, relabel: draw }; }

function timeline(spec) {
  let cur = 0;
  return widget((draw) => {
    const ev = spec.events[cur], go = (i) => { cur = (i + spec.events.length) % spec.events.length; draw(); };
    return [
      h('div', { class: 'tl-rail', role: 'group', 'aria-label': 'Timeline' }, ...spec.events.map((e, i) => h('button', { type: 'button', class: 'tl-dot', 'aria-pressed': i === cur ? 'true' : 'false', onclick: () => go(i) }, h('b', {}, e.y)))),
      h('div', { class: 'tl-card', 'aria-live': 'polite' }, h('span', { class: 'tl-year' }, ev.y), h('h4', {}, T(ev)), ev.d ? h('p', {}, T(ev.d)) : null),
      h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn ghost', onclick: () => go(cur - 1) }, '← ', pair('Earlier', 'पहले')), h('button', { type: 'button', class: 'btn primary', onclick: () => go(cur + 1) }, pair('Later', 'आगे'), ' →')),
    ];
  });
}

function bars(spec) {
  let cur = 0;
  return widget((draw) => {
    const S = spec.series[cur], max = S.max || Math.max(...S.values);
    return [
      spec.series.length > 1 ? chips(spec.series, cur, (i) => { cur = i; draw(); }) : null,
      h('div', { class: 'hbars', role: 'list' }, ...spec.cats.map((c, i) => h('div', { class: 'hbar', role: 'listitem' },
        h('span', { class: 'hbar-l' }, T(c)),
        h('span', { class: 'hbar-t' }, h('span', { class: 'hbar-f', style: `width:${Math.max(1.5, (S.values[i] / max) * 100)}%;background:${c.color || PALETTE[i % PALETTE.length]}` })),
        h('b', { class: 'hbar-v' }, `${fmt(S.values[i])}${S.suffix || ''}`)))),
      S.unit ? h('p', { class: 'note' }, S.unit) : null,
    ];
  });
}

function donut(spec) {
  let cur = -1;
  return widget((draw) => {
    const total = d3.sum(spec.parts, (p) => p.v), arcs = d3.pie().sort(null).value((p) => p.v).padAngle(0.02)(spec.parts), arc = d3.arc().innerRadius(72).outerRadius(118).cornerRadius(5);
    const sel = cur >= 0 ? spec.parts[cur] : null;
    const svg = s('svg', { viewBox: '-130 -130 260 260', class: 'donut', role: 'img', 'aria-label': T(spec.title || { en: 'Share chart', hi: 'हिस्सेदारी चार्ट' }) },
      ...arcs.map((a, i) => { const p = s('path', { d: arc(a), fill: spec.parts[i].color || PALETTE[i % PALETTE.length], opacity: cur < 0 || cur === i ? 1 : 0.35, tabindex: 0, role: 'button', 'aria-label': `${T(spec.parts[i])} ${spec.parts[i].v}` }); const pick = () => { cur = cur === i ? -1 : i; draw(); }; p.addEventListener('click', pick); p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } }); return p; }),
      s('text', { 'text-anchor': 'middle', y: -4, class: 'donut-n' }, sel ? `${fmt((sel.v / total) * 100)}%` : fmt(total) + (spec.suffix || '')),
      s('text', { 'text-anchor': 'middle', y: 20, class: 'donut-c' }, sel ? T(sel).slice(0, 26) : T(spec.center || { en: 'Total', hi: 'कुल' })));
    return h('div', { class: 'donut-wrap' }, svg, h('ul', { class: 'legend' }, ...spec.parts.map((p, i) => h('li', {}, h('i', { style: `background:${p.color || PALETTE[i % PALETTE.length]}` }), T(p), ' ', h('b', {}, `${fmt(p.v)}${spec.suffix || ''}`)))));
  });
}

function tree(spec) {
  let sel = null;
  return widget((draw) => {
    const root = d3p.hierarchy(spec.root), leaves = root.leaves().length, Hh = Math.max(260, leaves * 34), Wd = 860;
    d3p.tree().size([Hh - 30, Wd - 330])(root);
    const link = d3.linkHorizontal().x((d) => d.y + 110).y((d) => d.x + 15);
    const onPath = (d) => sel && sel.ancestors().includes(d);
    const svg = s('svg', { viewBox: `0 0 ${Wd} ${Hh}`, class: 'xtree', role: 'img', 'aria-label': T(spec.root) },
      ...root.links().map((l) => s('path', { d: link(l), class: `tr-link${sel && onPath(l.target) ? ' on' : ''}` })),
      ...root.descendants().map((d) => {
        const g = s('g', { transform: `translate(${d.y + 110},${d.x + 15})`, class: `tr-node d${d.depth}${onPath(d) ? ' on' : ''}`, tabindex: 0, role: 'button' },
          s('circle', { r: d.depth === 0 ? 9 : 6, fill: d.depth === 0 ? '#f5c451' : PALETTE[root.children.indexOf(d.ancestors().find((a) => a.depth === 1)) % PALETTE.length] }),
          s('text', { x: d.children ? -12 : 12, dy: '.32em', 'text-anchor': d.children ? 'end' : 'start' }, T(d.data)));
        const pick = () => { sel = d; draw(); };
        g.addEventListener('click', pick); g.addEventListener('keydown', (e) => { if (e.key === 'Enter') pick(); });
        return g;
      }));
    return [h('div', { class: 'scroll-x' }, svg), h('p', { class: 'tl-card small', 'aria-live': 'polite' }, sel?.data.d ? T(sel.data.d) : pair('Select a branch to read its example.', 'उदाहरण पढ़ने के लिए कोई शाखा चुनें।'))];
  });
}

function sankey(spec) {
  return widget(() => {
    const W = 860, Hh = 380;
    const g = d3p.sankey().nodeId((d) => d.id).nodeWidth(18).nodePadding(18).nodeAlign(d3p.sankeyJustify).extent([[8, 12], [W - 8, Hh - 12]])({ nodes: spec.nodes.map((d) => ({ ...d })), links: spec.links.map((d) => ({ ...d })) });
    const col = (n) => n.color || PALETTE[n.index % PALETTE.length];
    return h('div', { class: 'scroll-x' }, s('svg', { viewBox: `0 0 ${W} ${Hh}`, class: 'xsankey', role: 'img', 'aria-label': T(spec.title) },
      ...g.links.map((l) => s('path', { d: d3p.sankeyLinkHorizontal()(l), fill: 'none', stroke: col(l.source), 'stroke-opacity': 0.38, 'stroke-width': Math.max(1, l.width) }, s('title', {}, `${T(l.source)} → ${T(l.target)}: ${l.value}`))),
      ...g.nodes.map((n) => s('g', {}, s('rect', { x: n.x0, y: n.y0, width: n.x1 - n.x0, height: Math.max(2, n.y1 - n.y0), rx: 4, fill: col(n) }),
        s('text', { x: n.x0 < W / 2 ? n.x1 + 8 : n.x0 - 8, y: (n.y0 + n.y1) / 2, dy: '.35em', 'text-anchor': n.x0 < W / 2 ? 'start' : 'end' }, T(n))))));
  });
}

// Sliders stay mounted while only the output panel re-renders, so dragging is never interrupted.
function live(sliders, st, out) {
  const el = h('div', { class: 'x2d' });
  function draw() {
    const outEl = h('div', { 'aria-live': 'polite' });
    const paint = () => outEl.replaceChildren(...[out()].flat());
    const ctl = sliders.map((c, i) => {
      const id = `xs-${Math.random().toString(36).slice(2, 8)}`, b = h('b', {}, c.show(st[c.key]));
      return h('div', { class: 'ctl' }, h('label', { for: id }, c.n ? `${i + 1}. ` : '', T(c.label), ' ', b), h('input', { id, type: 'range', min: c.min, max: c.max, step: c.step, value: st[c.key], oninput: (e) => { st[c.key] = +e.target.value; b.textContent = c.show(st[c.key]); paint(); } }));
    });
    paint(); el.replaceChildren(h('div', { class: 'loan' }, h('div', {}, ...ctl), outEl));
  }
  draw(); return { el, relabel: draw };
}

function loan() {
  const st = { p: 50000, m: 12, f: 9, i: 5 };
  const bar = (label, v, max, c) => h('div', { class: 'hbar' }, h('span', { class: 'hbar-l' }, T(label)), h('span', { class: 'hbar-t' }, h('span', { class: 'hbar-f', style: `width:${(v / max) * 100}%;background:${c}` })), h('b', { class: 'hbar-v' }, `₹${fmt(Math.round(v))}`));
  return live([
    { key: 'p', label: { en: 'Loan amount', hi: 'ऋण राशि' }, min: 5000, max: 200000, step: 5000, show: (v) => `₹${fmt(v)}` },
    { key: 'm', label: { en: 'Months', hi: 'महीने' }, min: 3, max: 36, step: 1, show: (v) => String(v) },
    { key: 'f', label: { en: 'Bank / SHG rate per year', hi: 'बैंक / SHG दर प्रति वर्ष' }, min: 4, max: 18, step: 0.5, show: (v) => `${v}%` },
    { key: 'i', label: { en: 'Moneylender rate per month', hi: 'साहूकार दर प्रति माह' }, min: 2, max: 10, step: 0.5, show: (v) => `${v}%` },
  ], st, () => {
    const formal = st.p * (1 + (st.f / 100) * (st.m / 12)), informal = st.p * (1 + (st.i / 100) * st.m), max = Math.max(formal, informal);
    return [
      h('div', { class: 'hbars' }, bar({ en: 'Formal source: total to repay', hi: 'औपचारिक स्रोत: कुल चुकौती' }, formal, max, '#4fd1c5'), bar({ en: 'Informal source: total to repay', hi: 'अनौपचारिक स्रोत: कुल चुकौती' }, informal, max, '#ff7a6b')),
      h('p', { class: 'tl-card small' }, pair(`Extra cost of informal credit: ₹${fmt(Math.round(informal - formal))}. A high cost of borrowing can push a borrower into a debt trap.`, `अनौपचारिक ऋण की अतिरिक्त लागत: ₹${fmt(Math.round(informal - formal))}। ऊँची ब्याज दर ऋणी को कर्ज़-जाल में धकेल सकती है।`)),
      h('p', { class: 'note' }, pair('Simple-interest classroom model with rates you choose; not actual market rates.', 'आपकी चुनी दरों वाला साधारण-ब्याज कक्षा मॉडल; वास्तविक बाज़ार दरें नहीं।')),
    ];
  });
}

function radar(spec) {
  const st = Object.fromEntries(spec.axes.map((_, i) => [i, 3])), n = spec.axes.length, R = 105;
  const pt = (i, v) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return [Math.cos(a) * R * (v / 5), Math.sin(a) * R * (v / 5)]; };
  return live(spec.axes.map((a, i) => ({ key: i, label: a, n: true, min: 1, max: 5, step: 1, show: (v) => `${v}/5` })), st, () => {
    const val = spec.axes.map((_, i) => st[i]), avg = d3.sum(val) / n;
    return [
      s('svg', { viewBox: '-150 -135 300 270', class: 'radar', role: 'img', 'aria-label': T(spec.title) },
        ...[1, 2, 3, 4, 5].map((k) => s('polygon', { points: spec.axes.map((_, i) => pt(i, k).join(',')).join(' '), class: 'rd-grid' })),
        ...spec.axes.map((_, i) => s('line', { x1: 0, y1: 0, x2: pt(i, 5)[0], y2: pt(i, 5)[1], class: 'rd-grid' })),
        s('polygon', { points: val.map((v, i) => pt(i, v).join(',')).join(' '), class: 'rd-shape' }),
        ...val.map((v, i) => s('circle', { cx: pt(i, v)[0], cy: pt(i, v)[1], r: 4.5, fill: '#f5c451' })),
        ...spec.axes.map((_, i) => { const [x, y] = pt(i, 5.9); return s('text', { x, y, 'text-anchor': 'middle', dy: '.35em', class: 'rd-num' }, String(i + 1)); })),
      h('p', { class: 'tl-card small' }, pair(`Your average rating: ${avg.toFixed(1)} / 5. Give one piece of evidence for your highest and your lowest score.`, `आपकी औसत रेटिंग: ${avg.toFixed(1)} / 5। सबसे ऊँचे और सबसे कम अंक के लिए एक-एक प्रमाण दीजिए।`)),
    ];
  });
}

function steps(spec) {
  let cur = 0;
  return widget((draw) => [
    h('ol', { class: 'steps' }, ...spec.steps.map((st, i) => h('li', { class: i === cur ? 'on' : i < cur ? 'done' : '' }, h('button', { type: 'button', class: 'step-b', 'aria-pressed': i === cur ? 'true' : 'false', onclick: () => { cur = i; draw(); } }, h('span', { class: 'step-n' }, String(i + 1)), h('span', {}, T(st)))))),
    h('p', { class: 'tl-card small', 'aria-live': 'polite' }, T(spec.steps[cur].d)),
  ]);
}

const KINDS = { timeline, bars, donut, tree, sankey, loan, radar, steps };
export const create2d = (spec) => KINDS[spec.kind](spec);
