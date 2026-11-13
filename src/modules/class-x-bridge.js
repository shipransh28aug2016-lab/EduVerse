// CBSE Class IX -> Class X (2026-27) Board Bridge (#/bridge) & NEP 2020 Student Portfolio (#/portfolio).
import { h, esc } from '../core/dom.js';
import * as i18n from '../core/i18n.js';
import { t, pair } from '../core/i18n.js';
import * as store from '../core/store.js';
import { playTap, playWin, playTry } from '../core/sound.js';
import { indiaMapSvg, indiaProjection, loadGeoAll } from '../engines/viz.js';
import { bi, relabelBi } from '../components/widgets.js';
import { CG_META, THEME_NEP } from '../data/nep-cbq.js';

export const BOARD_MAP_PINS = [
  { id: 'calcutta-1920', cat: 'hist', lon: 88.36, lat: 22.57, en: 'Calcutta (Sept 1920 INC Session)', hi: 'कलकत्ता (सितंबर 1920 कांग्रेस अधिवेशन)', noteEn: 'Class X Nationalism in India — Non-Cooperation resolution passed.', noteHi: 'कक्षा 10 भारत में राष्ट्रवाद — असहयोग प्रस्ताव पारित।' },
  { id: 'nagpur-1920', cat: 'hist', lon: 79.09, lat: 21.15, en: 'Nagpur (Dec 1920 INC Session)', hi: 'नागपुर (दिसंबर 1920 कांग्रेस अधिवेशन)', noteEn: 'Class X Nationalism in India — Non-Cooperation programme adopted.', noteHi: 'कक्षा 10 — असहयोग कार्यक्रम को अंतिम रूप।' },
  { id: 'champaran', cat: 'hist', lon: 84.51, lat: 26.65, en: 'Champaran, Bihar (1917 Indigo Satyagraha)', hi: 'चंपारण, बिहार (1917 नील सत्याग्रह)', noteEn: 'Gandhiji’s first Satyagraha in India against tinkathia indigo oppression.', noteHi: 'तिनकठिया नील प्रणाली के विरुद्ध गांधीजी का प्रथम सत्याग्रह।' },
  { id: 'kheda', cat: 'hist', lon: 72.69, lat: 22.75, en: 'Kheda, Gujarat (1917 Peasant Satyagraha)', hi: 'खेड़ा, गुजरात (1917 किसान सत्याग्रह)', noteEn: 'Revenue remission demand during crop failure and plague.', noteHi: 'फसल विफलता के दौरान लगान माफी आंदोलन।' },
  { id: 'amritsar', cat: 'hist', lon: 74.87, lat: 31.63, en: 'Amritsar (1919 Jallianwala Bagh)', hi: 'अमृतसर (1919 जलियाँवाला बाग)', noteEn: 'Turning point against colonial Rowlatt Act repression.', noteHi: 'रॉलेट एक्ट दमन के विरुद्ध निर्णायक मोड़।' },
  { id: 'dandi', cat: 'hist', lon: 72.80, lat: 20.89, en: 'Dandi, Gujarat (1930 Salt March)', hi: 'दांडी, गुजरात (1930 नमक सत्याग्रह)', noteEn: 'Launch of Civil Disobedience Movement breaking the salt law.', noteHi: 'नमक कानून तोड़कर सविनय अवज्ञा आंदोलन का आरंभ।' },
  { id: 'bhakra', cat: 'water', lon: 76.43, lat: 31.41, en: 'Bhakra Nangal Dam (Sutlej)', hi: 'भाखड़ा नांगल बाँध (सतलुज)', noteEn: 'Class IX Drainage + Class X Water Resources multipurpose project.', noteHi: 'कक्षा 9 अपवाह + कक्षा 10 जल संसाधन बहुउद्देशीय परियोजना।' },
  { id: 'tehri', cat: 'water', lon: 78.48, lat: 30.38, en: 'Tehri Dam (Bhagirathi)', hi: 'टिहरी बाँध (भागीरथी)', noteEn: 'Highest rock-fill dam in India; Himalayan seismic-zone planning.', noteHi: 'भारत का सबसे ऊँचा बाँध; हिमालयी भूकंपीय नियोजन।' },
  { id: 'hirakud', cat: 'water', lon: 83.87, lat: 21.53, en: 'Hirakud Dam (Mahanadi, Odisha)', hi: 'हीराकुड बाँध (महानदी, ओडिशा)', noteEn: 'Longest earthen dam; flood control and delta irrigation.', noteHi: 'सबसे लंबा मिट्टी का बाँध; बाढ़ नियंत्रण और सिंचाई।' },
  { id: 'bokaro', cat: 'ind', lon: 86.15, lat: 23.67, en: 'Bokaro Steel Plant (Jharkhand)', hi: 'बोकारो इस्पात संयंत्र (झारखंड)', noteEn: 'Chota Nagpur industrial belt — coal, iron ore, and Damodar water.', noteHi: 'छोटानागपुर औद्योगिक पट्टी — कोयला, लौह अयस्क और दामोदर जल।' },
  { id: 'kalpakkam', cat: 'ind', lon: 80.17, lat: 12.56, en: 'Kalpakkam Nuclear Power Plant (TN)', hi: 'कलपक्कम परमाणु ऊर्जा केंद्र (तमिलनाडु)', noteEn: 'Class X Minerals & Energy Resources — coastal nuclear station.', noteHi: 'कक्षा 10 खनिज व ऊर्जा संसाधन — तटीय परमाणु केंद्र।' },
  { id: 'kandla', cat: 'ind', lon: 70.22, lat: 23.03, en: 'Deendayal / Kandla Port (Gujarat)', hi: 'दीनदयाल / कांडला बंदरगाह (गुजरात)', noteEn: 'Class X Lifelines — first tidal port developed post-Independence.', noteHi: 'कक्षा 10 जीवन रेखाएँ — स्वतंत्रता के बाद विकसित प्रथम ज्वारीय पतन।' },
];

const CAT_FILL = { hist: '#dc2626', water: '#2563eb', ind: '#059669' };

export function renderBridge(root, curriculum) {
  root.replaceChildren();
  const s = store.get();
  let mode = 'explore'; // 'explore' | 'quiz'
  let cat = 'all';
  let quizIdx = 0;
  let activePin = BOARD_MAP_PINS[0];

  const mapBox = h('div', { class: 'bridge-map-host' });
  const detailBox = h('div', { class: 'bridge-pin-info' });
  const quizBanner = h('div', { class: 'bridge-quiz-bar', hidden: true });

  const filtered = () => cat === 'all' ? BOARD_MAP_PINS : BOARD_MAP_PINS.filter((p) => p.cat === cat);
  const currentTarget = () => {
    const list = filtered();
    return list[quizIdx % list.length] || BOARD_MAP_PINS[0];
  };

  function selectPin(pin) {
    activePin = pin;
    const hits = store.get().mapHits || {};
    if (mode === 'quiz') {
      const target = currentTarget();
      if (pin.id === target.id) {
        store.recordMapHit(pin.id);
        store.awardStar(`map:${pin.id}`);
        playWin();
        quizBanner.className = 'bridge-quiz-bar feedback ok';
        quizBanner.textContent = `✓ ${pair(pin.en, pin.hi)} — ${t('bridge.hitOk')}`;
        quizIdx++;
      } else {
        playTry();
        quizBanner.className = 'bridge-quiz-bar feedback try';
        quizBanner.textContent = `${t('bridge.hitTry')} (${pair(pin.en, pin.hi)})`;
      }
      renderMap();
    } else {
      store.recordMapHit(pin.id);
      playTap();
      renderMap();
    }
    const foundNow = !!hits[pin.id] || store.get().mapHits?.[pin.id];
    detailBox.replaceChildren(
      h('div', { class: 'bridge-pin-head' },
        h('strong', {}, pair(pin.en, pin.hi)),
        h('span', { class: `badge ${foundNow ? 'done' : ''}` }, foundNow ? t('bridge.located') : t('bridge.tapPin'))),
      bi({ en: pin.noteEn, hi: pin.noteHi }, { tag: 'p', cls: 'note' }));
  }

  function renderMap() {
    const list = filtered();
    const hits = store.get().mapHits || {};
    const w = 640, hSvg = 430;
    const proj = indiaProjection(w, hSvg, 20);
    let extra = '';
    for (const p of list) {
      const pt = proj([p.lon, p.lat]);
      if (!pt) continue;
      const [x, y] = pt;
      const hit = !!hits[p.id];
      const isSel = activePin?.id === p.id && mode === 'explore';
      const fill = hit ? '#16a34a' : (CAT_FILL[p.cat] || 'var(--pri)');
      const labelTxt = mode === 'quiz' && !hit ? '?' : p.en.split(',')[0].split('(')[0].trim();
      extra += `<g class="bridge-pin" data-pin="${esc(p.id)}" tabindex="0" role="button" aria-label="${esc(p.en)}">`;
      if (isSel) extra += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="${fill}" opacity=".25"/>`;
      extra += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${fill}" stroke="#fff" stroke-width="2"/>`;
      extra += `<text class="txt sm b" x="${(x + 9).toFixed(1)}" y="${(y + 4).toFixed(1)}" style="paint-order:stroke;stroke:var(--card);stroke-width:3px">${esc(labelTxt)}</text>`;
      extra += `</g>`;
    }
    mapBox.innerHTML = indiaMapSvg({ w, h: hSvg, extraSvg: extra, aria: t('bridge.mapAria') });
    mapBox.querySelectorAll('.bridge-pin').forEach((gEl) => {
      const pin = BOARD_MAP_PINS.find((x) => x.id === gEl.dataset.pin);
      if (!pin) return;
      gEl.addEventListener('click', () => selectPin(pin));
      gEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPin(pin); }
      });
    });

    if (mode === 'quiz') {
      const tgt = currentTarget();
      quizBanner.hidden = false;
      if (!quizBanner.className.includes('ok') && !quizBanner.className.includes('try')) {
        quizBanner.className = 'bridge-quiz-bar feedback hint';
        quizBanner.textContent = `🎯 ${t('bridge.locatePrompt')}: ${pair(tgt.en, tgt.hi)}`;
      }
    } else {
      quizBanner.hidden = true;
    }
  }

  const modeBar = h('div', { class: 'row' },
    h('button', {
      type: 'button',
      class: 'btn primary',
      'data-k': 'bridge.modeExplore',
      onclick: () => { mode = 'explore'; quizBanner.className = 'bridge-quiz-bar'; renderMap(); },
    }, t('bridge.modeExplore')),
    h('button', {
      type: 'button',
      class: 'btn',
      'data-k': 'bridge.modeQuiz',
      onclick: () => { mode = 'quiz'; quizBanner.className = 'bridge-quiz-bar'; renderMap(); },
    }, t('bridge.modeQuiz')),
    ...['all', 'hist', 'water', 'ind'].map((c) => h('button', {
      type: 'button',
      class: 'btn ghost',
      'data-k': `bridge.cat.${c}`,
      onclick: () => { cat = c; quizIdx = 0; quizBanner.className = 'bridge-quiz-bar'; renderMap(); },
    }, t(`bridge.cat.${c}`))));

  const mapSection = h('section', { class: 'bridge-card' },
    h('h2', { 'data-k': 'bridge.mapTitle' }, t('bridge.mapTitle')),
    h('p', { class: 'note', 'data-k': 'bridge.mapLead' }, t('bridge.mapLead')),
    modeBar,
    quizBanner,
    mapBox,
    detailBox);

  // CBSE Interdisciplinary Project (IDP) Matrix + Class IX -> X 2026-27 Alignment Table
  const idpRows = [
    ['T01 · Earth & Latitudes / Maps', 'Ch. 7 Geography: Lifelines of National Economy', 'GIS Trade Corridor StoryMap (Digital / VR)'],
    ['T04 · Early Agrarian & Trade Routes', 'Ch. 3 History: The Making of a Global World', 'Silk Route + Monsoon Maritime Timeline'],
    ['T05 · Artisans, Guilds & Urban Markets', 'Ch. 4 History: The Age of Industrialisation', 'Pre-colonial Guild vs Factory Output Audit'],
    ['T13 · Trade, Silk & Spice Routes', 'Ch. 4 Economics: Globalisation & the Indian Economy', 'Local-to-Global Value Chain Supply Case Study'],
    ['T16 · Money, Banks & Compound Interest', 'Ch. 3 Economics: Money and Credit', 'SHG Credit vs Informal Moneylender Risk Model'],
  ];

  const idpSection = h('section', { class: 'bridge-card' },
    h('h2', { 'data-k': 'bridge.idpTitle' }, t('bridge.idpTitle')),
    h('p', { class: 'note', 'data-k': 'bridge.idpLead' }, t('bridge.idpLead')),
    h('div', { class: 'bridge-idp-grid' },
      ...idpRows.map(([c9, c10, proj]) => h('article', { class: 'idp-item' },
        h('div', { class: 'idp-c9' }, c9),
        h('div', { class: 'idp-arrow' }, '→ ' + c10),
        h('div', { class: 'idp-task' }, '📌 ' + proj)))));

  const matrixSection = h('section', { class: 'bridge-card' },
    h('h2', { 'data-k': 'bridge.matrixTitle' }, t('bridge.matrixTitle')),
    h('div', { class: 'bridge-matrix' },
      ...(curriculum?.themes || []).map((th) => {
        const nep = THEME_NEP[th.id];
        return h('a', { class: 'bridge-row', href: `#/theme/${th.id}` },
          h('span', { class: 't-num' }, th.id),
          bi(th.title, { tag: 'strong' }),
          h('span', { class: 'note' }, nep ? pair(nep.classX.chapters.en, nep.classX.chapters.hi) : ''));
      })));

  root.append(
    h('div', { class: 'bridge-head' },
      h('a', { class: 'back', href: '#/', 'data-k': 'nav.back' }, t('nav.back')),
      h('h1', { 'data-k': 'bridge.h1' }, t('bridge.h1')),
      h('p', { class: 'lead', 'data-k': 'bridge.lead' }, t('bridge.lead'))),
    mapSection,
    idpSection,
    matrixSection);

  selectPin(activePin);
  loadGeoAll().then(() => { if (root.isConnected) renderMap(); }).catch(() => {});

  return {
    relabel() {
      i18n.apply(root);
      relabelBi(root);
      renderMap();
    },
    destroy() {},
  };
}

export function renderPortfolio(root, curriculum) {
  root.replaceChildren();
  const stats = store.summaryStats();

  // Compute real mastery across CG1–CG9 from progress across mapped themes
  const cgList = Object.entries(CG_META).map(([code, desc]) => {
    const mapped = Object.entries(THEME_NEP).filter(([, m]) => m.cgs.includes(code)).map(([id]) => id);
    let score = 0;
    const totalPossible = Math.max(1, mapped.length * 3);
    for (const id of mapped) {
      const p = store.progress(id);
      if (p.visited) score += 1;
      if (Object.values(p.cbq || {}).some((v) => v?.ok)) score += 1;
      if (Object.keys(p.sim || {}).length > 0 || Object.values(p.mcq || {}).some((v) => v?.ok)) score += 1;
    }
    const pct = Math.min(100, Math.round((score / totalPossible) * 100));
    return { code, desc, mapped, pct };
  });

  function exportJson() {
    playTap();
    const payload = {
      exportedAt: new Date().toISOString(),
      board: 'CBSE Social Science (087) Class IX -> Class X Bridge (2026-27)',
      summary: store.summaryStats(),
      curricularGoals: cgList.map(({ code, pct, mapped }) => ({ code, pct, themes: mapped })),
      state: store.get(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduverse-nep-portfolio-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  root.append(
    h('div', { class: 'bridge-head' },
      h('a', { class: 'back', href: '#/', 'data-k': 'nav.back' }, t('nav.back')),
      h('h1', { 'data-k': 'port.h1' }, t('port.h1')),
      h('p', { class: 'lead', 'data-k': 'port.lead' }, t('port.lead')),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn primary', 'data-k': 'port.export', onclick: exportJson }, t('port.export')),
        h('button', { type: 'button', class: 'btn', 'data-k': 'port.print', onclick: () => { playTap(); window.print?.(); } }, t('port.print')),
        h('a', { class: 'btn ghost', href: '#/bridge', 'data-k': 'nep.goBridge' }, t('nep.goBridge')))),
    h('section', { class: 'port-kpis' },
      h('div', { class: 'kpi-card' }, h('strong', {}, `${stats.visitedCount} / 16`), h('span', { 'data-k': 'port.kVisited' }, t('port.kVisited'))),
      h('div', { class: 'kpi-card' }, h('strong', {}, `${stats.starCount}`), h('span', { 'data-k': 'port.kStars' }, t('port.kStars'))),
      h('div', { class: 'kpi-card' }, h('strong', {}, `${stats.cbqSolved} / 32`), h('span', { 'data-k': 'port.kCbq' }, t('port.kCbq'))),
      h('div', { class: 'kpi-card' }, h('strong', {}, `${stats.mapCount} / ${BOARD_MAP_PINS.length}`), h('span', { 'data-k': 'port.kMap' }, t('port.kMap')))),
    h('section', { class: 'bridge-card' },
      h('h2', { 'data-k': 'port.cgTitle' }, t('port.cgTitle')),
      h('div', { class: 'cg-bars' },
        ...cgList.map((cg) => h('div', { class: 'cg-row' },
          h('div', { class: 'cg-head' }, h('strong', {}, cg.code), bi(cg.desc, { tag: 'span' }), h('span', { class: 'cg-pct' }, `${cg.pct}%`)),
          h('div', { class: 'cg-track' }, h('div', { class: 'cg-fill', style: `width:${cg.pct}%` })))))),
    h('section', { class: 'bridge-card' },
      h('h2', { 'data-k': 'port.logTitle' }, t('port.logTitle')),
      h('div', { class: 'bridge-matrix' },
        ...(curriculum?.themes || []).map((th) => {
          const p = store.progress(th.id);
          const cbqs = Object.values(p.cbq || {}).filter((x) => x?.ok).length;
          return h('a', { class: 'bridge-row', href: `#/theme/${th.id}` },
            h('span', { class: 't-num' }, th.id),
            bi(th.title, { tag: 'strong' }),
            h('span', { class: `badge ${p.visited ? 'done' : ''}` }, p.visited ? '✓ Visited' : 'Pending'),
            h('span', { class: 'badge' }, `CBQ ${cbqs}/2`));
        }))));

  return {
    relabel() { i18n.apply(root); relabelBi(root); },
    destroy() {},
  };
}
