// T13.L1 time-filtered trade routes (tradeRoutes engine over the existing simplified land polygons).
import * as R from '../../engines/domain/tradeRoutes.js';
import { fmt, esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';
const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi) => ({ id, en, hi });
export const LAND = { polys: null };                                         // filled by the module after fetch; the view degrades to a plain grid without it
const COL = { 'indus-mesopotamia': '#b5651d', 'silk-road': '#7b3fa0', 'silk-india-branch': '#a0509f', 'roman-india': '#1f6fb2', barygaza: '#2e8b57', 'bay-of-bengal': '#c0392b' };
const W = 640, Hh = 330;
const year = (v) => R.yearLabel(v);
export const trade = {
  id: 'T13.L1',
  objective: b('Use a time filter to see which trade routes were in use in different periods, what goods and ideas moved along them, and how long journeys took by caravan and ship.', 'समय-फ़िल्टर से देखें कि अलग-अलग कालों में कौन-से व्यापार-मार्ग प्रचलित थे, उन पर कौन-सी वस्तुएँ और विचार चले, और कारवाँ तथा जहाज़ से यात्राएँ कितनी लंबी थीं।'),
  note: { kind: 'reconstruction', en: 'Dates are approximate spans of documented use. Routes are straight lines between documented places, not the exact paths travelled. Journey times assume an average 30 km/day for caravans and 120 km/day for ships and ignore stops and detours, so real journeys took longer.', hi: 'तिथियाँ प्रलेखित उपयोग की अनुमानित अवधियाँ हैं। मार्ग प्रलेखित स्थानों के बीच सीधी रेखाएँ हैं, यात्रा के सटीक पथ नहीं। यात्रा-समय कारवाँ के लिए औसत 30 किमी/दिन और जहाज़ के लिए 120 किमी/दिन मानता है तथा पड़ाव व घुमाव छोड़ देता है, इसलिए वास्तविक यात्राएँ अधिक लंबी थीं।' },
  init: () => ({ year: -2000 }),
  controls: [{ id: 'year', type: 'slider', label: b('Year (BCE negative)', 'वर्ष (ई.पू. ऋणात्मक)'), min: -2700, max: 1500, step: 50, fmt: year }],
  view(S) {
    const active = R.activeRoutes(S.year), pj = (c) => R.project(R.CITIES[c], W, Hh);
    let g = `<defs><linearGradient id="tr-sea" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#cde9fc"/><stop offset="100%" stop-color="#e8f5ff"/></linearGradient></defs><rect class="sea-fill" x="0" y="0" width="${W}" height="${Hh}" style="fill:url(#tr-sea)" rx="8"/>`;
    for (let lon = 30; lon <= 120; lon += 30) { const [x] = R.project({ lat: 0, lon }, W, Hh); g += `<line class="grid" x1="${x}" x2="${x}" y1="0" y2="${Hh}"/><text class="txt sm mut" x="${x + 3}" y="${Hh - 4}">${lon}°E</text>`; }
    for (let lat = 0; lat <= 40; lat += 20) { const [, y] = R.project({ lat, lon: 20 }, W, Hh); g += `<line class="grid" x1="0" x2="${W}" y1="${y}" y2="${y}"/><text class="txt sm mut" x="3" y="${y - 3}">${lat}°N</text>`; }
    if (LAND.polys) for (const poly of LAND.polys) { const d = 'M' + poly[0].map(([lo, la]) => R.project({ lat: la, lon: lo }, W, Hh).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z'; g += `<path class="land-fill" d="${d}"/>`; }
    const used = new Set();
    for (const r of active) { const pts = r.stops.map(pj); g += `<path class="route" style="stroke:${COL[r.id]};opacity:.22;stroke-width:8" d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join('L')}"/><path class="route" style="stroke:${COL[r.id]}${r.mode === 'caravan' ? ';stroke-dasharray:9 6' : ''}" d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join('L')}"/>`; r.stops.forEach((s) => used.add(s)); }
    for (const s of used) { const [x, y] = pj(s), c = R.CITIES[s]; g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="#f59e0b" opacity=".25"/><circle class="stop" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/><text class="txt sm b" x="${(x + 7).toFixed(1)}" y="${(y - 6).toFixed(1)}">${esc(P(c.en, c.hi))}</text>`; }
    g += `<text class="txt b" x="${W - 8}" y="20" text-anchor="end">${esc(year(S.year))}</text>`;
    const lines = [];
    if (!active.length) lines.push({ en: `${year(S.year)}: none of the routes in this lab were in use yet (or any more). Move the year.`, hi: `${year(S.year)}: इस प्रयोगशाला का कोई मार्ग अभी प्रचलित नहीं था (या अब नहीं रहा)। वर्ष बदलें।`, cls: 'warn' });
    for (const r of active) {
      const km = R.routeKm(r), d = R.travelDays(r), m = R.MODES[r.mode], names = r.stops.map((s) => R.CITIES[s]);
      lines.push({ en: `${names.map((c) => c.en).join(' → ')} (${m.en}): about ${fmt(km, 0)} km in straight legs, at least ${fmt(d, 0)} days. Goods: ${r.goods.map((x) => x.en).join(', ')}. ${r.note.en}`, hi: `${names.map((c) => c.hi).join(' → ')} (${m.hi}): सीधी रेखाओं में लगभग ${fmt(km, 0)} किमी, कम से कम ${fmt(d, 0)} दिन। वस्तुएँ: ${r.goods.map((x) => x.hi).join(', ')}। ${r.note.hi}` });
    }
    lines.push({ en: 'Solid line = sea route; dashed line = overland caravan route.', hi: 'ठोस रेखा = समुद्री मार्ग; बिंदुकित रेखा = स्थल कारवाँ मार्ग।', cls: 'note' });
    return {
      plate: {
        src: 'assets/images/plates/t13-silkspice.jpg',
        en: 'Overland Silk Road camel caravan and coastal Indian Ocean spice dhow routes trading across continents.',
        hi: 'महाद्वीपों को जोड़ते रेशम मार्ग के कारवाँ और हिंद महासागर के मसाला व्यापारिक जहाज़।',
      },
      svg: `<svg viewBox="0 0 ${W} ${Hh}" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`, aria: `Trade routes active in ${year(S.year)}: ${active.map((r) => r.id).join(', ') || 'none'}.`, lines };
  },
  discover: [b('Set the year to 2000 BCE, then 100 CE. Which routes appear and disappear?', 'वर्ष 2000 ई.पू. और फिर 100 ई. करें। कौन-से मार्ग प्रकट और लुप्त होते हैं?'), b('Compare the sea route Berenike → Muziris with the overland Silk Road. Which one carried goods across more distance per day?', 'बेरेनिके → मुज़िरिस समुद्री मार्ग की तुलना स्थल रेशम मार्ग से करें। कौन-सा प्रतिदिन अधिक दूरी तय करता था?'), b('The monsoon winds made the sea voyage to India practical. Why would sailors wait for the right season?', 'मानसूनी हवाओं ने भारत की समुद्री यात्रा को व्यावहारिक बनाया। नाविक सही ऋतु की प्रतीक्षा क्यों करते थे?')],
  predictions: [
    { id: 'p1', stem: b('Around 2000 BCE, which of these links is documented for the Harappan civilisation?', 'लगभग 2000 ई.पू. हड़प्पा सभ्यता के लिए इनमें से कौन-सा संपर्क प्रलेखित है?'), options: [opt('mes', 'Sea trade with Mesopotamia via the Gulf', 'खाड़ी के रास्ते मेसोपोटामिया से समुद्री व्यापार'), opt('silk', 'The Silk Road to China', 'चीन तक रेशम मार्ग'), opt('rome', 'Voyages to the Roman Empire', 'रोमन साम्राज्य की यात्राएँ')],
      run: (S) => { S.year = -2000; const ids = R.activeRoutes(-2000).map((r) => r.id); return ids.includes('indus-mesopotamia') ? 'mes' : 'silk'; }, explain: () => ({ en: 'Seals, beads and cuneiform texts show Indus–Mesopotamia trade between about 2600 and 1900 BCE. The Silk Road and Roman voyages came much later.', hi: 'मुहरें, मनके और कीलाक्षर पाठ लगभग 2600 से 1900 ई.पू. के बीच सिंधु–मेसोपोटामिया व्यापार दिखाते हैं। रेशम मार्ग और रोमन यात्राएँ बहुत बाद की हैं।' }) },
    { id: 'p2', stem: b('A caravan covering 30 km a day goes the full Silk Road from Chang’an to Antioch (straight-line legs). Roughly how long?', 'प्रतिदिन 30 किमी चलने वाला कारवाँ चांगान से एंटिओक तक पूरा रेशम मार्ग (सीधी रेखाओं में) तय करता है। लगभग कितना समय?'), options: [opt('weeks', 'A few weeks', 'कुछ सप्ताह'), opt('months', 'Many months (more than half a year)', 'कई महीने (आधे वर्ष से अधिक)'), opt('years', 'More than 3 years', '3 वर्ष से अधिक')],
      run: (S) => { S.year = 100; const d = R.travelDays(R.ROUTES.find((r) => r.id === 'silk-road')); return d < 60 ? 'weeks' : d < 1000 ? 'months' : 'years'; }, explain: () => ({ en: `About ${fmt(R.routeKm(R.ROUTES.find((r) => r.id === 'silk-road')), 0)} km at 30 km/day is ${fmt(R.travelDays(R.ROUTES.find((r) => r.id === 'silk-road')), 0)} days even before detours, so goods usually passed through many hands rather than one trader making the whole journey.`, hi: `लगभग ${fmt(R.routeKm(R.ROUTES.find((r) => r.id === 'silk-road')), 0)} किमी 30 किमी/दिन पर घुमाव से पहले भी ${fmt(R.travelDays(R.ROUTES.find((r) => r.id === 'silk-road')), 0)} दिन होता है, इसलिए माल प्रायः कई हाथों से गुज़रता था, कोई एक व्यापारी पूरी यात्रा नहीं करता था।` }) },
  ],
  exit: [{ id: 'e1', stem: b('What travelled along these routes besides goods?', 'इन मार्गों पर वस्तुओं के अलावा और क्या यात्रा करता था?'), correct: 'ideas', options: [
    { id: 'ideas', ...b('Ideas, religions, technologies and skills (for example Buddhist teachings).', 'विचार, धर्म, तकनीकें और कौशल (जैसे बौद्ध शिक्षाएँ)।') }, { id: 'nothing', ...b('Nothing else; only goods moved.', 'और कुछ नहीं; केवल वस्तुएँ चलती थीं।'), why: b('Traders, monks and travellers also carried beliefs and knowledge; see the Buddhist branch toward Taxila.', 'व्यापारी, भिक्षु और यात्री विश्वास और ज्ञान भी ले जाते थे; तक्षशिला की ओर बौद्ध शाखा देखें।') }],
    explain: b('Trade routes were also routes of cultural exchange.', 'व्यापार-मार्ग सांस्कृतिक आदान-प्रदान के मार्ग भी थे।'), hint: b('Read the note on the Silk Road branch to Taxila.', 'तक्षशिला की रेशम मार्ग शाखा का नोट पढ़ें।') }],
  reflect: b('Choose one good from the map. Write how it could have reached a buyer far from where it was made.', 'मानचित्र से एक वस्तु चुनें। लिखें कि वह अपने निर्माण-स्थान से दूर किसी खरीदार तक कैसे पहुँची होगी।'),
};
