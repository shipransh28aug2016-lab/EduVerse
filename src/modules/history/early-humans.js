// T04 — Early Humans and Beginning of Civilisation:
// L1 Deep-time clock, L2 Evidence vs inference, L3 Settlement sim, L4 3D Harappan City Planner, L5 Comparative Civilisation Atlas.
import { h, esc, fmt } from '../../core/dom.js';
import * as i18n from '../../core/i18n.js';
import { t } from '../../core/i18n.js';
import * as store from '../../core/store.js';
import { chips, tabs, bi, relabelBi, predict, mcq, biHtml } from '../../components/widgets.js';
import { createLab } from '../../components/lab-kit.js';
import { createThreeLab } from '../../components/three-lab.js';
import { createHarappan3d } from './harappan-3d.js';
import { loadGeoAll } from '../../engines/viz.js';
import * as M from './models.js';
import { settlementLab, harappanCity, civAtlas } from './labs-history-early.js';

const o = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });
const COL = { palaeo: '#b5651d', meso: '#8a9a3a', neo: '#2e8b57', harappa: '#7b3fa0', later: '#555' };
const ITEMS = [
  { id: 'i1', kind: 'evidence', en: 'Stone blades were found in one layer of a cave floor.', hi: 'गुफ़ा के फ़र्श की एक परत में पत्थर के फलक मिले।', why: { en: 'This is directly observed: the blades exist and we know the layer they came from.', hi: 'यह सीधे देखा गया है: फलक मौजूद हैं और हमें उनकी परत पता है।' } },
  { id: 'i2', kind: 'inference', en: 'The people who made the blades hunted animals.', hi: 'फलक बनाने वाले लोग जानवरों का शिकार करते थे।', why: { en: 'Blades alone do not prove it. This is a conclusion that needs more evidence, such as animal bones with cut marks.', hi: 'केवल फलकों से यह सिद्ध नहीं होता। यह निष्कर्ष है जिसके लिए और प्रमाण चाहिए, जैसे कटे निशान वाली जानवरों की हड्डियाँ।' } },
  { id: 'i3', kind: 'evidence', en: 'Animal bones with cut marks lie beside the blades.', hi: 'फलकों के पास कटे निशान वाली जानवरों की हड्डियाँ पड़ी हैं।', why: { en: 'Bones and marks are physical things found at the site.', hi: 'हड्डियाँ और निशान स्थल पर मिली भौतिक वस्तुएँ हैं।' } },
  { id: 'i4', kind: 'inference', en: 'These people lived in groups and shared food.', hi: 'ये लोग समूहों में रहते और भोजन बाँटते थे।', why: { en: 'We cannot see this directly; it is an interpretation of how the site was used.', hi: 'इसे हम सीधे नहीं देख सकते; यह स्थल के उपयोग की व्याख्या है।' } },
  { id: 'i5', kind: 'evidence', en: 'Grinding stones and burnt wheat grains were found inside a house.', hi: 'एक घर के भीतर चक्की के पत्थर और जले हुए गेहूँ के दाने मिले।', why: { en: 'Both objects were found and recorded at the site.', hi: 'दोनों वस्तुएँ स्थल पर मिलीं और दर्ज की गईं।' } },
  { id: 'i6', kind: 'inference', en: 'The villagers had begun farming.', hi: 'गाँव के लोगों ने खेती शुरू कर दी थी।', why: { en: 'A reasonable conclusion from the grains and tools, but it is still an interpretation; wild grains can also be gathered.', hi: 'दानों और औज़ारों से निकला उचित निष्कर्ष, पर यह फिर भी व्याख्या है; जंगली दाने भी इकट्ठा किए जा सकते हैं।' } },
];
const EXIT = [
  { id: 'h1', stem: { en: 'Which is an inference, not direct evidence?', hi: 'कौन-सा निष्कर्ष है, सीधा प्रमाण नहीं?' }, correct: 'b',
    options: [o('a', 'A stone tool was found in a cave.', 'गुफ़ा में पत्थर का औज़ार मिला।', { en: 'That is something found and recorded: evidence.', hi: 'यह मिली और दर्ज की गई वस्तु है: प्रमाण।' }), o('b', 'The cave people hunted together.', 'गुफ़ा के लोग मिलकर शिकार करते थे।'), o('c', 'A bone has cut marks on it.', 'एक हड्डी पर कटे निशान हैं।', { en: 'The marks can be seen on the bone: evidence.', hi: 'निशान हड्डी पर देखे जा सकते हैं: प्रमाण।' })],
    explain: { en: 'Hunting together is a conclusion we draw from the evidence; we did not observe it.', hi: 'मिलकर शिकार करना हमारा निकाला निष्कर्ष है; हमने इसे देखा नहीं।' }, hint: { en: 'Ask: could I hold it, photograph it or measure it?', hi: 'पूछें: क्या मैं इसे पकड़, खींच या माप सकता हूँ?' } },
  { id: 'h2', stem: { en: 'Why do we call a time of 12,000 years ago “recent” in the story of humans?', hi: '12,000 वर्ष पहले के समय को मानव-कथा में “हाल का” क्यों कहते हैं?' }, correct: 'sm',
    options: [o('sm', 'It is a tiny fraction of the 2 million years of human tool-making.', 'यह मानव द्वारा औज़ार बनाने के 20 लाख वर्षों का बहुत छोटा अंश है।'), o('lg', 'It is about half of human history.', 'यह मानव-इतिहास का लगभग आधा है।', { en: '12,000 is only 0.6% of 2,000,000 years.', hi: '12,000, 20,00,000 वर्षों का केवल 0.6% है।' })],
    explain: { en: '12,000 ÷ 2,000,000 = 0.6%, which on a 24-hour clock is about the last 9 minutes.', hi: '12,000 ÷ 20,00,000 = 0.6%, जो 24 घंटे की घड़ी पर लगभग अंतिम 9 मिनट है।' }, hint: { en: 'Divide 12,000 by 2,000,000.', hi: '12,000 को 20,00,000 से भाग दें।' } },
];
const REFLECT = { en: 'Pick one object from the evidence tab and write one inference and one thing that would make you more sure.', hi: 'प्रमाण-टैब से एक वस्तु चुनें और एक निष्कर्ष तथा एक ऐसी बात लिखें जिससे आप अधिक निश्चित हो सकें।' };

export function mount(root) {
  const S = store.simState('T04', { tab: 'time', mark: 'farming', ev: {}, done: {} }); S.ev ??= {}; S.done ??= {};
  const prog = store.progress('T04'); const persist = () => store.saveSim();
  const aname = (id) => t(`tl.age.${id}`);
  let alive = true;

  i18n.register({
    'T04.tab.settle': { en: 'Settlement sim (L3)', hi: 'बस्ती प्रयोग (L3)' },
    'T04.tab.city': { en: '3D Harappan city (L4)', hi: '3D हड़प्पा नगर (L4)' },
    'T04.tab.atlas': { en: 'Civilisation atlas (L5)', hi: 'सभ्यता मानचित्र (L5)' },
  });

  // ---- L1 clock
  const tl = (() => {
    const box = h('div', { class: 'chart-box' }), read = h('div', { class: 'readout', role: 'status', 'aria-live': 'polite' });
    const ch = chips({ name: 'ms', value: S.mark, options: M.MILESTONES.filter((m) => m.id !== 'now').map((m) => ({ id: m.id, key: `tl.ms.${m.id}` })), onSelect: (id) => { S.mark = id; draw(); } });
    function bar(pos, y, label, mark) {
      const x0 = 30, w = 580; let s = `<text class="lbl" x="${x0}" y="${y - 8}">${esc(label)}</text>`;
      M.AGES.forEach((a) => { const l = Math.min(pos(a.from), pos(a.to)), r = Math.max(pos(a.from), pos(a.to)); s += `<rect x="${x0 + l * w}" y="${y}" width="${Math.max(1.5, (r - l) * w)}" height="26" fill="${COL[a.id]}"/>`; });
      const mx = x0 + pos(mark) * w; return s + `<line x1="${mx}" x2="${mx}" y1="${y - 4}" y2="${y + 34}" stroke="currentColor" stroke-width="3"/><circle cx="${mx}" cy="${y + 13}" r="6" fill="#fff" stroke="currentColor" stroke-width="3"/>`;
    }
    function draw() {
      persist();
      const ya = M.MILESTONES.find((m) => m.id === S.mark).ya, c = M.clockLabel(ya);
      const minLeft = M.minutesBeforeMidnight(ya);
      const angDeg = Math.min(359, Math.max(0.5, (minLeft / 60) * 30)); // wedge on 12-hour analog clock near midnight
      const rad = ((90 + angDeg) * Math.PI) / 180;
      const wx = (555 + 42 * Math.cos(rad)).toFixed(1), wy = (95 - 42 * Math.sin(rad)).toFixed(1);
      const dial = `<circle cx="555" cy="95" r="52" fill="#f8fafc" stroke="var(--ink)" stroke-width="2.5"/><path d="M555,95 L555,53 A42,42 0 ${angDeg > 180 ? 1 : 0},0 ${wx},${wy} Z" fill="${COL[M.ageOf(ya) ?? 'later']}" opacity=".38"/><line x1="555" y1="95" x2="555" y2="54" stroke="var(--ink)" stroke-width="2.5"/><line x1="555" y1="95" x2="${wx}" y2="${wy}" stroke="var(--d)" stroke-width="2.5"/><text class="txt sm b" x="555" y="164" text-anchor="middle">${esc(c.text)}</text>`;
      const barNarrow = (pos, y, label, mark) => {
        const x0 = 26, w = 440; let s = `<text class="lbl" x="${x0}" y="${y - 8}">${esc(label)}</text>`;
        M.AGES.forEach((a) => { const l = Math.min(pos(a.from), pos(a.to)), r = Math.max(pos(a.from), pos(a.to)); s += `<rect x="${x0 + l * w}" y="${y}" width="${Math.max(1.5, (r - l) * w)}" height="24" rx="3" fill="${COL[a.id]}"/>`; });
        const mx = x0 + pos(mark) * w; return s + `<line x1="${mx}" x2="${mx}" y1="${y - 4}" y2="${y + 32}" stroke="currentColor" stroke-width="3"/><circle cx="${mx}" cy="${y + 12}" r="6" fill="#fff" stroke="currentColor" stroke-width="3"/>`;
      };
      box.innerHTML = `<svg viewBox="0 0 640 190" class="chart" role="img" aria-label="${esc(t('tl.aria'))}" xmlns="http://www.w3.org/2000/svg" style="color:var(--ink)">${barNarrow(M.linearPos, 40, t('tl.lin'), ya)}${barNarrow(M.logPos, 120, t('tl.log'), ya)}${dial}<text class="tick" x="26" y="180">${esc(t('tl.left'))}</text><text class="tick" x="466" y="180" text-anchor="end">${esc(t('tl.right'))}</text></svg>` + `<div class="legend">${M.AGES.map((a) => `<span class="lg"><i style="background:${COL[a.id]}"></i><b>${esc(aname(a.id))}</b></span>`).join('')}</div>`;
      read.innerHTML = `<div class="ro-line">${esc(t('tl.ro.ya', { ya: fmt(ya, 0), age: aname(M.ageOf(ya) ?? 'later') }))}</div><div class="ro-line"><strong>${esc(t('tl.ro.clock', { time: c.text, min: fmt(c.minutes, 1) }))}</strong></div><div class="ro-line note">${esc(t('tl.note'))}</div>`;
    }
    const tlImg = h('img', {
      src: 'assets/images/plates/t04-timeline.jpg',
      alt: i18n.pair('24-hour deep-time clock compressing human prehistory alongside miniature stone tools and clay grains.', '20 लाख वर्ष के मानव इतिहास को 24-घंटे की घड़ी और पाषाण-युग से आरंभिक खेती के मॉडलों में दर्शाता चित्र।'),
      loading: 'eager',
      decoding: 'async',
    });
    const tlPlate = h('figure', { class: 'lab-plate' },
      tlImg,
      h('figcaption', { class: 'lab-plate-cap' }, bi({ en: 'Two million years of stone-tool history compressed onto one 24-hour dial — farming and cities appear only minutes before midnight.', hi: '20 लाख वर्षों का पाषाण इतिहास 24 घंटे की घड़ी पर — खेती और नगर मध्यरात्रि से कुछ ही मिनट पहले दिखते हैं।' })));
    const pr = predict({ id: 't1', stem: { en: 'Squeeze the last 2 million years into ONE day (midnight = today). Farming began about 8,000 years ago. How long before midnight is that?', hi: 'पिछले 20 लाख वर्षों को एक दिन में समेट दें (मध्यरात्रि = आज)। खेती लगभग 8,000 वर्ष पहले शुरू हुई। यह मध्यरात्रि से कितना पहले है?' }, options: [o('min', 'A few minutes', 'कुछ मिनट'), o('hour', 'About an hour', 'लगभग एक घंटा'), o('hours', 'Several hours', 'कई घंटे')],
      run: () => { S.mark = 'farming'; ch.select('farming'); draw(); const m = M.minutesBeforeMidnight(8000); return m < 30 ? 'min' : m < 180 ? 'hour' : 'hours'; },
      explain: () => ({ en: `8,000 ÷ 2,000,000 × 24 hours = ${fmt(M.minutesBeforeMidnight(8000), 1)} minutes. Almost the whole story of human tool-making happened before farming; farming, cities and writing all fit in the last few minutes.`, hi: `8,000 ÷ 20,00,000 × 24 घंटे = ${fmt(M.minutesBeforeMidnight(8000), 1)} मिनट। मानव द्वारा औज़ार बनाने की लगभग पूरी कहानी खेती से पहले की है; खेती, नगर और लेखन सब अंतिम कुछ मिनटों में आते हैं।` }) }, { done: S.done, onDone: persist });
    draw();
    const el = h('div', { class: 'lab' }, h('p', { class: 'lead' }, bi({ en: 'Pick a moment and see where it falls on a straight timeline and on a stretched (log) timeline.', hi: 'कोई क्षण चुनें और देखें कि वह सीधी समय-रेखा और खिंची हुई (लघुगणकीय) समय-रेखा पर कहाँ आता है।' })), h('div', { class: 'lab-grid' }, h('div', { class: 'lab-main' }, tlPlate, box, read), h('div', { class: 'lab-side' }, h('h3', { 'data-k': 'tl.h' }, t('tl.h')), ch.root)), h('section', { class: 'subsec' }, h('h3', { 'data-k': 'predict.h' }, t('predict.h')), pr));
    return { el, relabel() { tlImg.alt = i18n.pair('24-hour deep-time clock compressing human prehistory alongside miniature stone tools and clay grains.', '20 लाख वर्ष के मानव इतिहास को 24-घंटे की घड़ी और पाषाण-युग से आरंभिक खेती के मॉडलों में दर्शाता चित्र।'); pr.relabel(); relabelBi(el); i18n.apply(el); draw(); } };
  })();

  // ---- L2 evidence vs inference
  const ev = (() => {
    const list = h('div', { class: 'ev-list' });
    function render() {
      list.replaceChildren(...ITEMS.map((it) => {
        const ans = S.ev[it.id], card = h('div', { class: 'card ev' }), fb = h('div', { class: 'feedback', 'aria-live': 'polite' });
        card.append(bi({ en: it.en, hi: it.hi }, { tag: 'p', cls: 'ev-t' }));
        const row = h('div', { class: 'row' });
        ['evidence', 'inference'].forEach((k) => row.append(h('button', { type: 'button', class: 'btn' + (ans === k ? ' picked' : ''), 'aria-pressed': ans === k ? 'true' : 'false', 'data-k': `ev.${k}`, disabled: ans ? true : null, onclick: () => { S.ev[it.id] = k; persist(); render(); } }, t(`ev.${k}`))));
        card.append(row, fb);
        if (ans) { const ok = ans === it.kind; fb.className = 'feedback ' + (ok ? 'ok' : 'try'); fb.innerHTML = `<strong data-k="${ok ? 'fb.right' : 'fb.notquite'}">${esc(t(ok ? 'fb.right' : 'fb.notquite'))}</strong> <span data-k="ev.is.${it.kind}">${esc(t('ev.is.' + it.kind))}</span> ` + biHtml(it.why, { block: true }); }
        return card;
      }));
    }
    render();
    const plate = h('figure', { class: 'lab-plate' },
      h('img', { src: 'assets/images/plates/t04-tools.jpg', alt: i18n.pair('Bhimbetka cave art, Palaeolithic handaxe, microliths, Neolithic axe and charred wheat grains.', 'भीमबेटका गुफ़ा चित्र, पुरापाषाण हस्त-कुठार, सूक्ष्म-पाषाण, नवपाषाण कुल्हाड़ी व जले गेहूँ के दाने।'), loading: 'eager', decoding: 'async' }),
      h('figcaption', { class: 'lab-plate-cap' }, bi({ en: 'Material finds (cave art, stone blades, polished axe, charred grain) form direct archaeological evidence before interpretation.', hi: 'भौतिक अवशेष (गुफ़ा चित्र, पाषाण फलक, पॉलिश कुल्हाड़ी, जले दाने) व्याख्या से पहले के प्रत्यक्ष पुरातात्विक प्रमाण हैं।' })),
    );
    const el = h('div', { class: 'lab' }, h('p', { class: 'lead' }, bi({ en: 'Archaeologists find things (evidence) and then explain them (inference). Sort each statement.', hi: 'पुरातत्वविद् वस्तुएँ पाते हैं (प्रमाण) और फिर उनकी व्याख्या करते हैं (निष्कर्ष)। हर कथन को छाँटें।' })), plate, list, h('p', { class: 'note', 'data-k': 'ev.fictional' }, t('ev.fictional')), h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn', 'data-k': 'btn.reset', onclick: () => { S.ev = {}; persist(); render(); } }, t('btn.reset'))));
    return { el, relabel() { render(); relabelBi(el); i18n.apply(el); } };
  })();

  // ---- L3, L4 (3D+2D), L5
  const lab3 = createLab(settlementLab, 'T04');
  const lab4 = createThreeLab(harappanCity, 'T04', createHarappan3d);
  const lab5 = createLab(civAtlas, 'T04');

  loadGeoAll().then(() => { if (alive) lab5.draw(); });

  const exitBox = h('div', { class: 'exit' });
  const mcqs = EXIT.map((q) => { const e = mcq(q, { done: S.done, onDone: (id, v) => { prog.exit[id] = v; store.saveProgress(); persist(); } }); exitBox.append(h('div', { class: 'exit-q' }, e)); return e; });
  const ta = h('textarea', { class: 'reflect', rows: 3, 'data-k-aria': 'reflect.aria', placeholder: t('reflect.ph') }); ta.value = prog.reflection || ''; ta.addEventListener('input', () => { prog.reflection = ta.value; store.saveProgress(); });

  const onTab = (id) => {
    S.tab = id; persist();
    if (id === 'city') lab4.enable(); else lab4.disable();
  };
  const tb = tabs({
    active: S.tab || 'time',
    onChange: onTab,
    tabs: [
      { id: 'time', key: 'T04.tab.time', el: tl.el },
      { id: 'evid', key: 'T04.tab.evid', el: ev.el },
      { id: 'settle', key: 'T04.tab.settle', el: lab3.el },
      { id: 'city', key: 'T04.tab.city', el: lab4.el },
      { id: 'atlas', key: 'T04.tab.atlas', el: lab5.el },
    ],
  });
  root.append(tb.root, h('section', { class: 'subsec' }, h('h3', { 'data-k': 'exit.h' }, t('exit.h')), exitBox, h('h3', { 'data-k': 'reflect.h' }, t('reflect.h')), bi(REFLECT, { tag: 'p', cls: 'note' }), ta, h('p', { class: 'note', 'data-k': 'reflect.local' }, t('reflect.local'))));
  i18n.apply(root);
  if (S.tab === 'city') lab4.enable();

  return {
    relabel() { tl.relabel(); ev.relabel(); lab3.relabel(); lab4.relabel(); lab5.relabel(); mcqs.forEach((q) => q.relabel()); relabelBi(root); i18n.apply(root); ta.placeholder = t('reflect.ph'); },
    destroy() { alive = false; lab4.destroy(); },
    debug: () => ({ S, settle: lab3.debug(), city: lab4.debug(), atlas: lab5.debug() }),
  };
}
