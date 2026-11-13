// T08 Building Blocks in Economics lab specs (L1–L5).
import { Chart } from '../../engines/chart.js';
import * as M from '../../engines/domain/market.js';
import { forceGraphSvg } from '../../engines/viz.js';
import { esc, fmt } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });
const rs = (v) => `₹${fmt(v, 0)}`;

// ------------------------------------------------------------------ T08.L2 PPF
const AMAX = 10, BMAX = 10;
export const ppf = {
  id: 'T08.L2',
  objective: b('Use a production possibility frontier to show scarcity, choice and opportunity cost: producing more of one good means giving up some of another.', 'उत्पादन संभावना वक्र से दुर्लभता, चयन और अवसर-लागत दिखाएँ: एक वस्तु अधिक बनाने का अर्थ दूसरी का कुछ त्यागना है।'),
  note: { kind: 'fictional', en: 'A farm that can grow wheat or vegetables; the numbers are fictional.', hi: 'एक खेत जो गेहूँ या सब्ज़ियाँ उगा सकता है; संख्याएँ काल्पनिक हैं।' },
  init: () => ({ a: 4, b: 5, tech: false }),
  controls: [
    { id: 'a', type: 'slider', label: b('Wheat grown (tonnes)', 'उगाया गया गेहूँ (टन)'), min: 0, max: 13, step: 0.5 },
    { id: 'b', type: 'slider', label: b('Vegetables grown (tonnes)', 'उगाई गई सब्ज़ियाँ (टन)'), min: 0, max: 13, step: 0.5 },
    { id: 'tech', type: 'toggle', label: b('Better seeds and tools (+30% capacity)', 'बेहतर बीज और औज़ार (+30% क्षमता)') },
  ],
  view(S) {
    const k = S.tech ? 1.3 : 1, am = AMAX * k, bm = BMAX * k, pt = M.ppfPoint(S.a, S.b, am, bm);
    const ch = new Chart({ xMax: 14, yMax: 14, xLabel: P('Wheat (tonnes)', 'गेहूँ (टन)'), yLabel: P('Vegetables (tonnes)', 'सब्ज़ियाँ (टन)'), xTicks: 7, yTicks: 7 });
    ch.axes();
    const pts = []; for (let a = 0; a <= am + 1e-9; a += am / 40) pts.push([a, M.ppfB(a, am, bm)]);
    ch.poly([...pts, [0, 0]], 'fillG'); ch.line(pts, 'curve g');
    if (S.tech) { const old = []; for (let a = 0; a <= AMAX + 1e-9; a += AMAX / 40) old.push([a, M.ppfB(a, AMAX, BMAX)]); ch.line(old, 'ghost', { dash: true }); }
    ch.dot(S.a, S.b, pt.status === 'efficient' ? 'optdot' : pt.status === 'inefficient' ? 'eqdot' : 'bmdot', 9);
    const oc = M.opportunityCost(Math.min(S.a, am - 0.5), 0.5, am, bm);
    const lines = [{ en: `Point (${S.a} t wheat, ${S.b} t vegetables): ${pt.status === 'efficient' ? 'ON the frontier: all resources used well.' : pt.status === 'inefficient' ? 'INSIDE the frontier: resources are idle or wasted; you could grow more of both.' : 'OUTSIDE the frontier: not possible with this land, labour and technology.'}`, hi: `बिंदु (${S.a} टन गेहूँ, ${S.b} टन सब्ज़ी): ${pt.status === 'efficient' ? 'वक्र पर: सभी संसाधनों का अच्छा उपयोग।' : pt.status === 'inefficient' ? 'वक्र के भीतर: संसाधन बेकार या निष्क्रिय हैं; आप दोनों अधिक उगा सकते थे।' : 'वक्र के बाहर: इस भूमि, श्रम और तकनीक से संभव नहीं।'}`, cls: pt.status === 'efficient' ? 'balanced' : pt.status === 'inefficient' ? 'note' : 'warn' },
      { en: `Giving up the next 0.5 t of vegetables at this point buys only ${fmt(1 / (oc || Infinity) * 0.5 * 0 + 0.5, 1)} t more wheat; each extra tonne of wheat costs about ${fmt(oc, 2)} t of vegetables (opportunity cost).`, hi: `इस बिंदु पर अगला 0.5 टन गेहूँ बढ़ाने की कीमत लगभग ${fmt(oc * 0.5, 2)} टन सब्ज़ी है; यानी हर अतिरिक्त टन गेहूँ की अवसर-लागत लगभग ${fmt(oc, 2)} टन सब्ज़ी है।` },
      { en: 'The curve bends because land is better suited to one crop than the other: the more wheat you grow, the more vegetable land you give up per tonne.', hi: 'वक्र मुड़ा हुआ इसलिए है कि भूमि एक फ़सल के लिए दूसरी से अधिक उपयुक्त है: जितना अधिक गेहूँ उगाते हैं, प्रति टन उतनी अधिक सब्ज़ी भूमि छोड़नी पड़ती है।', cls: 'note' }];
    lines[1] = { en: `Moving from ${S.a} to ${S.a + 0.5} t of wheat along the frontier costs ${fmt(oc * 0.5, 2)} t of vegetables, so one more tonne of wheat costs about ${fmt(oc, 2)} t of vegetables (opportunity cost).`, hi: `सीमा-रेखा पर गेहूँ ${S.a} से ${S.a + 0.5} टन करने पर ${fmt(oc * 0.5, 2)} टन सब्ज़ी छोड़नी पड़ती है, यानी एक और टन गेहूँ की अवसर-लागत लगभग ${fmt(oc, 2)} टन सब्ज़ी है।` };
    return {
      plate: {
        src: 'assets/images/plates/t08-ppf.jpg',
        en: 'Dividing one finite farm between golden wheat & fresh vegetables — tap pins to jump inside, onto, or beyond the frontier.',
        hi: 'सीमित खेत को गेहूँ व सब्ज़ियों में बाँटना — वक्र के भीतर, ऊपर या बाहर जाने हेतु पिन पर टैप करें।',
        spots: [
          { x: 26, y: 56, en: 'On Frontier (Full Efficiency)', hi: 'वक्र पर (पूर्ण दक्षता)', detail: b('6 t wheat + 8 t vegetables uses every acre — getting more wheat means sacrificing vegetables.', '6 टन गेहूँ + 8 टन सब्ज़ी पूरी क्षमता से उत्पादन है; एक बढ़ाने पर दूसरा घटेगा।'), set: { a: 6, b: 8, tech: false } },
          { x: 54, y: 48, en: 'Inside Frontier (Idle Land)', hi: 'वक्र के भीतर (बेकार संसाधन)', detail: b('At (3, 4) farmland sits idle — we could grow more of BOTH without trade-off!', '(3, 4) पर भूमि बेकार है — बिना त्याग के दोनों फ़सलें बढ़ाई जा सकती हैं!'), set: { a: 3, b: 4, tech: false } },
          { x: 80, y: 46, en: 'Hybrid Seeds & Drip Tech (+30%)', hi: 'नई तकनीक व सिंचाई (+30% विस्तार)', detail: b('Better seeds shift the entire boundary outward so (8, 8) becomes achievable!', 'उन्नत बीज व तकनीक पूरी उत्पादन संभावना सीमा को बाहर खिसका देते हैं!'), set: { a: 8, b: 8, tech: true } },
        ],
      },
      svg: ch.html({ label: P('Production possibility frontier', 'उत्पादन संभावना वक्र') }), aria: `Wheat ${S.a}, vegetables ${S.b}: ${pt.status}.`, lines,
    };
  },
  discover: [b('Place the point on the curve at 1 t of wheat, then at 8 t. Which move costs more vegetables per extra tonne of wheat?', 'बिंदु को वक्र पर 1 टन गेहूँ और फिर 8 टन पर रखें। गेहूँ के प्रति अतिरिक्त टन पर किसमें अधिक सब्ज़ी छोड़नी पड़ती है?'), b('Move the point outside the curve, then switch on “better seeds and tools”. What changed?', 'बिंदु को वक्र के बाहर ले जाएँ, फिर “बेहतर बीज और औज़ार” चालू करें। क्या बदला?')],
  predictions: [{ id: 'p1', stem: b('Moving along the frontier, the opportunity cost of one more tonne of wheat is…', 'वक्र पर चलते हुए एक और टन गेहूँ की अवसर-लागत…'), options: [opt('rises', 'Higher the more wheat you already grow', 'जितना अधिक गेहूँ पहले से उगे, उतनी अधिक'), opt('same', 'The same everywhere', 'हर जगह समान'), opt('falls', 'Lower the more wheat you already grow', 'जितना अधिक गेहूँ पहले से उगे, उतनी कम')],
    run: (S) => { S.a = 8; S.b = Math.round(M.ppfB(8, AMAX, BMAX) * 2) / 2; S.tech = false; const lo = M.opportunityCost(1, 1, AMAX, BMAX), hi = M.opportunityCost(8, 1, AMAX, BMAX); return hi > lo * 1.05 ? 'rises' : hi < lo * 0.95 ? 'falls' : 'same'; },
    explain: () => ({ en: `Between 1 and 2 t of wheat you give up ${fmt(M.opportunityCost(1, 1, AMAX, BMAX), 2)} t of vegetables per tonne; between 8 and 9 t you give up ${fmt(M.opportunityCost(8, 1, AMAX, BMAX), 2)} t. Resources are not equally good at both jobs.`, hi: `1 से 2 टन गेहूँ के बीच प्रति टन ${fmt(M.opportunityCost(1, 1, AMAX, BMAX), 2)} टन सब्ज़ी छोड़नी पड़ती है; 8 से 9 टन के बीच ${fmt(M.opportunityCost(8, 1, AMAX, BMAX), 2)} टन। संसाधन दोनों कामों में समान उपयुक्त नहीं होते।` }) }],
  exit: [{ id: 'e1', stem: b('A point INSIDE the frontier means…', 'वक्र के भीतर का बिंदु दर्शाता है…'), correct: 'idle', options: [
    { id: 'idle', ...b('Resources are unemployed or wasted; more of both goods could be produced.', 'संसाधन बेकार या अपव्ययी हैं; दोनों वस्तुएँ अधिक बनाई जा सकती थीं।') }, { id: 'best', ...b('The best possible use of resources.', 'संसाधनों का सर्वोत्तम उपयोग।'), why: b('The best use is ON the frontier, not inside it.', 'सर्वोत्तम उपयोग वक्र पर होता है, भीतर नहीं।') }],
    explain: b('Inside the frontier the economy could gain more of one good without giving up any of the other.', 'वक्र के भीतर अर्थव्यवस्था दूसरी वस्तु छोड़े बिना एक वस्तु अधिक पा सकती है।'), hint: b('Move the point inside the curve and read the message.', 'बिंदु को वक्र के भीतर ले जाकर संदेश पढ़ें।') }],
  reflect: b('Describe a choice in your own life where choosing one thing meant giving up another. What was the opportunity cost?', 'अपने जीवन का ऐसा चयन बताएँ जहाँ एक चीज़ चुनने का मतलब दूसरी छोड़ना था। अवसर-लागत क्या थी?'),
};

// ------------------------------------------------------------------ T08.L1 Scarcity allocation board
export const scarcityGame = {
  id: 'T08.L1',
  objective: b('Allocate a fixed ₹100 weekly allowance across books, snacks, and mobile data to feel scarcity, trade-offs, and opportunity cost firsthand.', 'पुस्तकों, नाश्ते और मोबाइल डेटा के बीच सीमित ₹100 के साप्ताहिक बजट का बँटवारा करके दुर्लभता, विकल्प-चयन और अवसर-लागत को समझें।'),
  note: { kind: 'fictional', en: 'Fictional ₹100 weekly student allowance demonstrating that unlimited wants face scarce budgets.', hi: 'काल्पनिक ₹100 का साप्ताहिक छात्र बजट जो दर्शाता है कि असीमित इच्छाओं के सामने संसाधन सीमित होते हैं।' },
  init: () => ({ books: 40, snack: 30, data: 20 }),
  controls: [
    { id: 'books', type: 'slider', label: b('Stationery & books (₹)', 'कॉपी व पुस्तकें (₹)'), min: 0, max: 100, step: 10, fmt: rs },
    { id: 'snack', type: 'slider', label: b('Treats & snacks (₹)', 'नाश्ता व मिठाई (₹)'), min: 0, max: 100, step: 10, fmt: rs },
    { id: 'data', type: 'slider', label: b('Study / media data pack (₹)', 'अध्ययन / मीडिया डेटा (₹)'), min: 0, max: 100, step: 10, fmt: rs },
  ],
  view(S) {
    const r = M.scarcityAllocate({ budget: 100, ...S });
    const items = [
      { lab: P('Books', 'पुस्तकें'), val: S.books, fill: '#15803d' },
      { lab: P('Snacks', 'नाश्ता'), val: S.snack, fill: '#d97706' },
      { lab: P('Data', 'डेटा'), val: S.data, fill: '#0369a1' },
    ];
    let g = `<rect x="24" y="28" width="592" height="30" rx="6" fill="#e2e8f0"/>`;
    let x = 24;
    items.forEach((it) => {
      const w = (Math.min(120, it.val) / 100) * 592;
      if (w > 0) g += `<rect x="${x.toFixed(1)}" y="28" width="${Math.min(592 - (x - 24), w).toFixed(1)}" height="30" fill="${it.fill}"/>`;
      x += w;
    });
    g += `<line x1="616" y1="18" x2="616" y2="70" stroke="var(--bad)" stroke-width="3"/><text class="txt sm b" x="616" y="84" text-anchor="end">${esc(P('Budget Limit ₹100', 'बजट सीमा ₹100'))}</text>`;
    items.forEach((it, i) => {
      const y = 104 + i * 38;
      g += `<text class="txt sm b" x="24" y="${y + 18}">${esc(it.lab)}</text>`
        + `<rect x="140" y="${y}" width="${(it.val / 100) * 420}" height="24" rx="4" fill="${it.fill}"/>`
        + `<text class="txt sm" x="${148 + (it.val / 100) * 420}" y="${y + 17}">${rs(it.val)}</text>`;
    });
    const svg = `<svg viewBox="0 0 640 225" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t08-choices.jpg',
        en: 'Everyday student scarcity trade-offs — tap pins to compare study-first vs balanced vs overspent ₹100 plans.',
        hi: 'दैनिक छात्र चयन — ₹100 के बजट में अध्ययन, संतुलन व अधिक खर्च की तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 54, en: 'Books Priority (₹60 + ₹20 + ₹20)', hi: 'पुस्तक प्राथमिकता (₹60+20+20)', detail: b('Fits ₹100 cleanly with the highest learning utility score.', '₹100 में सटीक फिट और उच्चतम अध्ययन उपयोगिता स्कोर।'), set: { books: 60, snack: 20, data: 20 } },
          { x: 54, y: 48, en: '₹10 Savings Buffer (₹40+30+20)', hi: '₹10 बचत बफर (₹40+30+20)', detail: b('Leaves ₹10 unspent for unexpected pencil/bus expenses.', 'आकस्मिक आवश्यकता के लिए ₹10 सुरक्षित बचते हैं।'), set: { books: 40, snack: 30, data: 20 } },
          { x: 80, y: 58, en: '₹130 Deficit Trap', hi: '₹130 बजट घाटा जाल', detail: b('Wanting ₹50 books + ₹40 snacks + ₹40 data overshoots ₹100 — scarcity bites!', 'सभी इच्छाएँ एक साथ पूरी करने पर ₹30 का घाटा दिखता है!'), set: { books: 50, snack: 40, data: 40 } },
        ],
      },
      svg,
      aria: `Spent ${r.spent} of 100 rupees; ${r.over ? 'over budget' : `${r.remaining} unspent`}; utility index ${r.wellBeing}`,
      lines: [
        r.over
          ? { en: `Overspent by ${rs(-r.remaining)}! Total is ${rs(r.spent)} against ₹100 budget — scarcity means you must cut one choice to pay for another.`, hi: `${rs(-r.remaining)} अधिक खर्च हो गए! ₹100 के बजट में कुल खर्च ${rs(r.spent)} है — दुर्लभता के कारण एक विकल्प घटाना ही होगा।`, cls: 'warn' }
          : { en: `Allocated ${rs(r.spent)} of ₹100 (${rs(r.remaining)} saved). Educational & balanced utility score: ${r.wellBeing}.`, hi: `₹100 में से ${rs(r.spent)} आवंटित (${rs(r.remaining)} बचत)। संतुलित उपयोगिता स्कोर: ${r.wellBeing}।`, cls: 'balanced' },
        { en: 'Opportunity cost rule: choosing ₹30 more of snacks means giving up ₹30 worth of books or savings — the next best alternative foregone.', hi: 'अवसर-लागत नियम: नाश्ते पर ₹30 अधिक खर्च करने का अर्थ ₹30 की पुस्तक या बचत का त्याग करना है।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Push Snacks to ₹60 while Books are ₹50 and notice the budget deficit warning.', 'नाश्ता ₹60 और पुस्तकें ₹50 करके बजट-घाटे की चेतावनी देखें।'),
    b('Keep total spending at ₹100 and see what happens to Books if you double Data.', 'कुल खर्च ₹100 रखते हुए डेटा दोगुना करें और देखें पुस्तकों का क्या होता है।'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('You have ₹100 total and already plan ₹60 for books and ₹20 for data. What is the maximum you can spend on snacks without going into deficit?', 'कुल ₹100 में से ₹60 पुस्तकों और ₹20 डेटा के लिए तय हैं। घाटे के बिना नाश्ते पर अधिकतम कितना खर्च हो सकता है?'),
    options: [opt('20', '₹20', '₹20'), opt('40', '₹40', '₹40')],
    run: (S) => { S.books = 60; S.data = 20; S.snack = 20; return M.scarcityAllocate({ budget: 100, ...S }).remaining === 0 ? '20' : '40'; },
    explain: () => b('₹100 − ₹60 − ₹20 = ₹20. Scarcity forces choices within available resources.', '₹100 − ₹60 − ₹20 = ₹20। सीमित संसाधनों में चयन अनिवार्य है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('What does "opportunity cost" mean when making a choice?', 'चयन करते समय “अवसर-लागत” का क्या अर्थ है?'),
    correct: 'next',
    options: [
      opt('next', 'The value of the next-best alternative you give up when you choose one option.', 'एक विकल्प चुनने पर छोड़े गए अगले सर्वोत्तम विकल्प का मूल्य।'),
      opt('zero', 'Everything costs ₹0 once you decide.', 'निर्णय लेने के बाद हर चीज़ ₹0 की हो जाती है।', b('Even time and budget spent on one option carry the cost of what else they could have done.', 'किसी एक विकल्प पर खर्च समय या धन दूसरे अवसर के त्याग की लागत रखता है।')),
    ],
    explain: b('Scarcity creates trade-offs; opportunity cost measures the best foregone alternative.', 'दुर्लभता चयन की स्थिति बनाती है; अवसर-लागत त्यागे गए सर्वोत्तम विकल्प को मापती है।'),
    hint: b('Read the second readout line on the budget bar.', 'बजट पट्टी के नीचे दूसरी पंक्ति देखें।'),
  }],
  reflect: b('When you spend 1 extra hour scrolling videos before an exam, what is the opportunity cost of that hour?', 'परीक्षा से पहले 1 अतिरिक्त घंटा वीडियो देखने की अवसर-लागत क्या है?'),
};

// ------------------------------------------------------------------ T08.L3 What / How / For Whom flow
export const econFlow = {
  id: 'T08.L3',
  objective: b('Analyse the three central problems of every economy — What to produce, How to produce (labour vs machines), and For Whom to produce.', 'हर अर्थव्यवस्था की तीन केंद्रीय समस्याओं का विश्लेषण करें — क्या उत्पादन करें, कैसे उत्पादन करें (श्रम बनाम मशीनें), और किसके लिए उत्पादन करें।'),
  note: { kind: 'schematic', en: 'Circular flow connecting households, producers, technology choice, and distribution.', hi: 'परिवारों, उत्पादकों, तकनीक चयन और वितरण को जोड़ने वाला चक्रीय प्रवाह मॉडल।' },
  init: () => ({ consumerShare: 65, labourShare: 60, equityTransfer: 30 }),
  controls: [
    { id: 'consumerShare', type: 'slider', label: b('WHAT: Food & daily goods vs Capital machines (%)', 'क्या: दैनिक उपभोग बनाम मशीनें (%)'), min: 20, max: 90, step: 5 },
    { id: 'labourShare', type: 'slider', label: b('HOW: Labour-intensive vs Automated (%)', 'कैसे: श्रम-प्रधान बनाम स्वचालित (%)'), min: 10, max: 90, step: 5 },
    { id: 'equityTransfer', type: 'slider', label: b('FOR WHOM: Broad wage & welfare reach (%)', 'किसके लिए: व्यापक मज़दूरी व कल्याण पहुँच (%)'), min: 10, max: 90, step: 5 },
  ],
  view(S) {
    const jobs = Math.round(40 + S.labourShare * 0.55);
    const futureGrowth = Math.round(100 - S.consumerShare * 0.5 + (100 - S.labourShare) * 0.25);
    const nodes = [
      { id: 'hh', fx: 105, fy: 130, rw: 120, fill: '#dcfce7', stroke: '#15803d', label: P('Households', 'परिवार') },
      { id: 'what', fx: 255, fy: 60, rw: 126, fill: '#dbeafe', stroke: '#0369a1', label: P(`WHAT ${S.consumerShare}%`, `क्या ${S.consumerShare}%`) },
      { id: 'how', fx: 410, fy: 60, rw: 124, fill: '#fef3c7', stroke: '#b45309', label: P(`HOW ${S.labourShare}%`, `कैसे ${S.labourShare}%`) },
      { id: 'prod', fx: 535, fy: 130, rw: 120, fill: '#dbeafe', stroke: '#1d4ed8', label: P('Producers', 'उत्पादक') },
      { id: 'whom', fx: 320, fy: 205, rw: 146, fill: '#f3e8ff', stroke: '#7e22ce', label: P(`FOR WHOM ${S.equityTransfer}%`, `किसके लिए ${S.equityTransfer}%`) },
    ];
    const links = [
      { source: 'hh', target: 'what', label: P('demand', 'माँग') },
      { source: 'what', target: 'how', label: P('mix', 'मिश्रण') },
      { source: 'how', target: 'prod', label: P('tech', 'तकनीक') },
      { source: 'prod', target: 'whom', label: P('output', 'उत्पादन') },
      { source: 'whom', target: 'hh', label: P('wages & goods', 'आय व वस्तुएँ') },
    ];
    const svg = forceGraphSvg({ w: 640, h: 265, nodes, links, activeId: 'prod', aria: P('Three central economic problems flow', 'अर्थव्यवस्था की तीन केंद्रीय समस्याओं का प्रवाह') });
    return {
      plate: {
        src: 'assets/images/plates/t08-economy.jpg',
        en: 'Interconnected local economy: weavers, grain traders & workshops — tap pins to shift What, How & For Whom.',
        hi: 'स्थानीय अर्थव्यवस्था: बुनकर, अनाज व्यापारी व कार्यशालाएँ — क्या, कैसे व किसके लिए बदलने हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 50, en: 'WHAT: Consumer Food vs Machines', hi: 'क्या: दैनिक उपभोग बनाम मशीनें', detail: b('Heavy consumer focus feeds today’s families; shifting toward machines raises future growth.', 'अधिक उपभोग आज का पेट भरता है जबकि मशीनें भविष्य की क्षमता बढ़ाती हैं।'), set: { consumerShare: 80, labourShare: 60 } },
          { x: 52, y: 48, en: 'HOW: Handloom Labour vs Factory', hi: 'कैसे: श्रम-प्रधान बनाम स्वचालित', detail: b('85% labour-intensive production maximises immediate rural jobs.', '85% श्रम-प्रधान विधि तात्कालिक रोज़गार को अधिकतम करती है।'), set: { labourShare: 85 } },
          { x: 78, y: 56, en: 'FOR WHOM: Broad Wage & Welfare', hi: 'किसके लिए: व्यापक मज़दूरी व समता', detail: b('Stronger wage & welfare reach spreads produced goods to vulnerable homes.', 'मज़दूरी व कल्याण का विस्तार ज़रूरतमंद परिवारों तक पहुँच बढ़ाता है।'), set: { equityTransfer: 80 } },
        ],
      },
      svg,
      aria: `What ${S.consumerShare}% consumer goods, How ${S.labourShare}% labour, For Whom ${S.equityTransfer}% reach. Jobs index ${jobs}, growth index ${futureGrowth}`,
      lines: [
        { en: `Outcomes — Immediate jobs index: ${jobs}/100 | Future productive capacity index: ${futureGrowth}/100 | Inclusive reach: ${S.equityTransfer}%.`, hi: `परिणाम — तात्कालिक रोज़गार सूचकांक: ${jobs}/100 | भावी क्षमता सूचकांक: ${futureGrowth}/100 | समावेशी पहुँच: ${S.equityTransfer}%।`, cls: 'balanced' },
        { en: 'Economists study how production (using land, labour, capital, enterprise), distribution (who receives income), and consumption balance present needs against future growth.', hi: 'अर्थशास्त्री अध्ययन करते हैं कि उत्पादन, वितरण और उपभोग वर्तमान आवश्यकताओं तथा भविष्य की वृद्धि के बीच संतुलन कैसे बनाते हैं।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Slide HOW toward labour-intensive (85%) vs automated (15%) and watch the immediate jobs vs capacity indices.', '“कैसे” को श्रम-प्रधान (85%) बनाम स्वचालित (15%) पर ले जाकर रोज़गार और क्षमता के सूचकांक देखें।'),
    b('Why is producing more machines today sometimes necessary to make more consumer goods tomorrow?', 'कल अधिक उपभोग वस्तुएँ बनाने के लिए आज मशीनों का उत्पादन क्यों आवश्यक हो सकता है?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('If a developing country with abundant workers chooses a 100% automated factory method over labour-intensive production, what rises immediately?', 'यदि श्रमिक-बहुल देश श्रम-प्रधान के बजाय 100% स्वचालित तकनीक चुन ले, तो तुरंत क्या बढ़ता है?'),
    options: [opt('unemp', 'Short-term worker unemployment risk if workers are not absorbed elsewhere', 'अल्पकाल में श्रमिक बेरोज़गारी का जोखिम'), opt('all', 'Every unskilled worker gets hired inside the automated line', 'प्रत्येक अकुशल श्रमिक स्वचालित लाइन में भर्ती होता है')],
    run: (S) => { S.labourShare = 15; return 'unemp'; },
    explain: () => b('Capital-intensive (automated) methods replace manual tasks quickly unless new sectors or retraining absorb workers.', 'पूंजी-प्रधान (स्वचालित) तकनीक श्रम की आवश्यकता घटाती है; इसलिए “कैसे उत्पादन करें” अर्थव्यवस्था का मुख्य प्रश्न है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Which question asks about "For Whom to Produce"?', '“किसके लिए उत्पादन करें” किस प्रश्न से संबंधित है?'),
    correct: 'dist',
    options: [
      opt('dist', 'How goods and incomes are distributed across rich, middle, and vulnerable households.', 'उत्पादित वस्तुएँ और आय विभिन्न वर्गों व परिवारों में कैसे वितरित होती हैं।'),
      opt('soil', 'Which type of soil grows wheat fastest.', 'किस मिट्टी में गेहूँ सबसे तेज़ उगता है।', b('Soil/technique is "How to produce"; distribution is "For whom".', 'तकनीक “कैसे” है; वितरण “किसके लिए” है।')),
    ],
    explain: b('“For whom to produce” addresses equity, wages, prices, and social safety nets.', '“किसके लिए उत्पादन करें” समता, मज़दूरी और वितरण व्यवस्था से जुड़ा है।'),
    hint: b('Check the bottom purple node in the circular flow.', 'चक्र में नीचे बैंगनी नोड देखें।'),
  }],
  reflect: b('In your town or village, give one example of a labour-intensive job and one capital-intensive job.', 'अपने शहर या गाँव में श्रम-प्रधान और पूंजी-प्रधान कार्य का एक-एक उदाहरण दें।'),
};

// ------------------------------------------------------------------ T08.L4 Economic Systems Comparison
const ESYS = [
  { id: 'market', en: 'Free Market Economy', hi: 'मुक्त बाज़ार अर्थव्यवस्था', owner: 'Private individuals & firms', ownerHi: 'निजी व्यक्ति व कंपनियाँ', price: 'Supply & demand prices', priceHi: 'माँग व पूर्ति से कीमत', pro: 'High efficiency & rapid innovation', proHi: 'उच्च दक्षता व नवाचार', risk: 'Inequality & neglect of public goods', riskHi: 'असमानता व सार्वजनिक वस्तुओं की उपेक्षा', eff: 88, eq: 38, free: 92 },
  { id: 'planned', en: 'Centrally Planned Economy', hi: 'केंद्रीयकृत नियोजित अर्थव्यवस्था', owner: 'State / Government owns key resources', ownerHi: 'प्रमुख संसाधनों पर राज्य का स्वामित्व', price: 'State planners set targets & prices', priceHi: 'सरकारी योजनाकार लक्ष्य व कीमतें तय करते हैं', pro: 'Focus on basic needs & low inequality', proHi: 'बुनियादी आवश्यकताओं व समता पर बल', risk: 'Shortages, waste, slow innovation', riskHi: 'कमी, अपव्यय व धीमा नवाचार', eff: 46, eq: 78, free: 24 },
  { id: 'mixed', en: 'Mixed Economy (e.g., India)', hi: 'मिश्रित अर्थव्यवस्था (जैसे भारत)', owner: 'Private enterprise + Public sector', ownerHi: 'निजी उद्यम + सार्वजनिक क्षेत्र', price: 'Market prices + govt regulation & welfare', priceHi: 'बाज़ार मूल्य + सरकारी नियमन व कल्याण', pro: 'Balances growth, infrastructure & safety nets', proHi: 'विकास, अवसंरचना व सुरक्षा-जाल में संतुलन', risk: 'Requires steady regulation to balance profit and welfare', riskHi: 'लाभ व कल्याण के संतुलन हेतु सुदृढ़ नियमन आवश्यक', eff: 78, eq: 72, free: 74 },
];
export const econSystems = {
  id: 'T08.L4',
  objective: b('Compare free-market, centrally planned, and mixed economic systems on ownership, price signals, efficiency, and equity.', 'स्वामित्व, मूल्य तंत्र, दक्षता और समता के आधार पर मुक्त बाज़ार, केंद्रीयकृत नियोजित और मिश्रित आर्थिक प्रणालियों की तुलना करें।'),
  note: { kind: 'documented', en: 'Conceptual textbook comparison across economic systems; real countries blend features to different degrees.', hi: 'आर्थिक प्रणालियों की पाठ्यपुस्तकीय तुलना; वास्तविक देश विभिन्न मात्रा में तत्वों का मिश्रण अपनाते हैं।' },
  init: () => ({ sys: 'mixed' }),
  controls: [
    { id: 'sys', type: 'chips', label: b('Economic system', 'आर्थिक प्रणाली'), options: ESYS.map((e) => opt(e.id, e.en, e.hi)) },
  ],
  view(S) {
    const e = ESYS.find((x) => x.id === S.sys) || ESYS[2];
    const bars = [
      { lab: P('Efficiency & Innovation', 'दक्षता व नवाचार'), val: e.eff, col: '#0369a1' },
      { lab: P('Equity & Basic Security', 'समता व बुनियादी सुरक्षा'), val: e.eq, col: '#15803d' },
      { lab: P('Consumer / Firm Choice', 'उपभोक्ता व उद्यम स्वतंत्रता'), val: e.free, col: '#7e22ce' },
    ];
    let g = `<rect x="20" y="14" width="600" height="56" rx="8" fill="#fef3c7" stroke="#b45309"/>`
      + `<text class="txt b" x="34" y="36">${esc(P(e.en, e.hi))}</text>`
      + `<text class="txt sm mut" x="34" y="57">${esc(P(e.owner, e.ownerHi))} · ${esc(P(e.price, e.priceHi))}</text>`;
    bars.forEach((br, i) => {
      const y = 92 + i * 44;
      g += `<text class="txt sm b" x="24" y="${y + 18}">${esc(br.lab)}</text>`
        + `<rect x="240" y="${y}" width="330" height="24" rx="6" fill="#e2e8f0"/>`
        + `<rect x="240" y="${y}" width="${br.val * 3.3}" height="24" rx="6" fill="${br.col}"/>`
        + `<text class="txt sm b" x="${248 + br.val * 3.3}" y="${y + 17}" fill="#0f172a">${br.val}/100</text>`;
    });
    const svg = `<svg viewBox="0 0 640 225" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t08-economy.jpg',
        en: 'Market stalls, public cooperatives & mixed shops — tap pins to compare Free Market, Centrally Planned & Mixed economies.',
        hi: 'बाज़ार दुकानें व सार्वजनिक उपक्रम — मुक्त बाज़ार, नियोजित व मिश्रित अर्थव्यवस्था की तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 52, en: 'Free Market (Private Price Signals)', hi: 'मुक्त बाज़ार अर्थव्यवस्था', detail: b('Fast efficiency & choice (92), but lowest equity (38) without welfare.', 'तेज़ दक्षता व विकल्प, पर कल्याण के बिना असमानता अधिक।'), set: { sys: 'market' } },
          { x: 52, y: 46, en: 'Centrally Planned (State Targets)', hi: 'केंद्रीयकृत नियोजित प्रणाली', detail: b('Higher basic equity (78), but suffers bottlenecks & low efficiency (46).', 'बुनियादी समता अधिक, पर आपूर्ति में कमी व धीमी दक्षता का जोखिम।'), set: { sys: 'planned' } },
          { x: 78, y: 54, en: 'Mixed Economy (India’s Path)', hi: 'मिश्रित अर्थव्यवस्था (भारत)', detail: b('Pairs private markets & startups with public infrastructure & safety nets.', 'निजी बाज़ार व स्टार्टअप के साथ सार्वजनिक अवसंरचना व सुरक्षा-जाल।'), set: { sys: 'mixed' } },
        ],
      },
      svg,
      aria: `${e.en}: efficiency ${e.eff}, equity ${e.eq}, choice ${e.free}`,
      lines: [
        { en: `Strength: ${e.pro}. Risk: ${e.risk}.`, hi: `विशेषता: ${e.proHi}। जोखिम: ${e.riskHi}।`, cls: S.sys === 'mixed' ? 'balanced' : 'note' },
        { en: 'India follows a mixed economy: private startups and markets drive most goods while government builds public infrastructure, regulates monopolies, and runs welfare safety nets.', hi: 'भारत मिश्रित अर्थव्यवस्था अपनाता है: निजी बाज़ार अधिकांश वस्तुएँ बनाते हैं जबकि सरकार सार्वजनिक ढाँचा, नियमन और कल्याण योजनाएँ चलाती है।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Compare the three bars across Market, Centrally Planned, and Mixed systems.', 'बाज़ार, नियोजित और मिश्रित प्रणालियों में तीनों पट्टियों की तुलना करें।'),
    b('Why do pure free markets struggle to supply streetlights or clean rural water on their own?', 'शुद्ध मुक्त बाज़ार अकेले स्ट्रीटलाइट या ग्रामीण पेयजल उपलब्ध कराने में क्यों जूझते हैं?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('In a mixed economy like India, who provides roads, courts, and targeted food support alongside private businesses?', 'भारत जैसी मिश्रित अर्थव्यवस्था में निजी व्यवसायों के साथ-साथ सड़कें, न्यायालय और लक्षित खाद्य सहायता कौन प्रदान करता है?'),
    options: [opt('mix', 'Public institutions (government) alongside regulated private markets', 'नियमित निजी बाज़ारों के साथ सार्वजनिक संस्थाएँ (सरकार)'), opt('none', 'Nobody — private firms build every public court', 'कोई नहीं — हर सार्वजनिक न्यायालय निजी कंपनियाँ बनाती हैं')],
    run: (S) => { S.sys = 'mixed'; return 'mix'; },
    explain: () => b('Mixed economies pair market dynamism with public regulation, infrastructure, and welfare.', 'मिश्रित अर्थव्यवस्था बाज़ार की गतिशीलता को सार्वजनिक ढाँचे, नियमन और कल्याण से जोड़ती है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Which weakness is most common in a strictly centrally planned system with zero private prices?', 'शून्य निजी मूल्य वाली पूर्णतः केंद्रीयकृत नियोजित प्रणाली में कौन-सी कमज़ोरी सबसे आम है?'),
    correct: 'info',
    options: [
      opt('info', 'Central planners struggle to know millions of local shortages and surpluses in real time, causing queues or waste.', 'केंद्रीय योजनाकार करोड़ों स्थानीय कमियों व अधिशेषों का समय पर अनुमान नहीं लगा पाते, जिससे कतारें या अपव्यय होता है।'),
      opt('over', 'Too many private startups compete.', 'बहुत अधिक निजी स्टार्टअप प्रतिस्पर्धा करते हैं।', b('Private firms do not drive a strictly centrally planned system.', 'पूर्णतः नियोजित प्रणाली निजी प्रतिस्पर्धा पर नहीं चलती।')),
    ],
    explain: b('Prices in markets automatically signal scarcity; removing all price signals burdens central planners.', 'बाज़ार कीमतें स्वतः दुर्लभता का संकेत देती हैं; इन्हें हटाने से योजनाकारों पर भारी सूचना-बोझ आता है।'),
    hint: b('Click Centrally Planned and inspect the Risk line.', 'केंद्रीयकृत नियोजित चुनें और जोखिम पंक्ति पढ़ें।'),
  }],
  reflect: b('Name one service in your city that is best run privately and one best run as a public service.', 'अपने शहर की एक सेवा बताएँ जो निजी क्षेत्र में बेहतर चलती है और एक जो सार्वजनिक सेवा के रूप में।'),
};

// ------------------------------------------------------------------ T08.L5 Household shock & social safety net
export const safetyNet = {
  id: 'T08.L5',
  objective: b('Test how a social safety net (health insurance, crop/disaster aid, PDS food security) prevents a sudden household shock from trapping a family in poverty debt.', 'जाँचें कि सामाजिक सुरक्षा-जाल (स्वास्थ्य बीमा, फसल/आपदा सहायता, राशन प्रणाली) किसी अचानक आए संकट को परिवार को कर्ज़ के जाल में फँसाने से कैसे बचाता है।'),
  note: { kind: 'fictional', en: 'Fictional household budget demonstrating welfare economics and social safety nets.', hi: 'कल्याणकारी अर्थशास्त्र और सामाजिक सुरक्षा-जाल दर्शाने वाला काल्पनिक पारिवारिक बजट।' },
  init: () => ({ shockCost: 12000, safetyNetCoverPct: 60 }),
  controls: [
    { id: 'shockCost', type: 'slider', label: b('Sudden medical / crop shock cost (₹)', 'अचानक चिकित्सा / फसल नुकसान लागत (₹)'), min: 2000, max: 20000, step: 1000, fmt: rs },
    { id: 'safetyNetCoverPct', type: 'slider', label: b('Public safety-net coverage (%)', 'सामाजिक सुरक्षा-जाल सहायता (%)'), min: 0, max: 90, step: 10, fmt: (v) => `${v}%` },
  ],
  view(S) {
    const r = M.householdShock({ monthlyIncome: 12000, savings: 6000, ...S });
    const g = `<text class="txt sm" x="24" y="42">${esc(P('Household Buffer (Savings ₹6,000)', 'पारिवारिक बचत (₹6,000)'))}</text>`
      + `<rect x="24" y="54" width="240" height="28" rx="4" fill="#15803d"/>`
      + `<text class="txt sm" x="24" y="114">${esc(P('Out-of-Pocket Shock after Safety Net', 'सुरक्षा-जाल के बाद जेब पर भार'))}</text>`
      + `<rect x="24" y="126" width="${Math.min(580, (r.netShock / 20000) * 580)}" height="28" rx="4" fill="${r.debtRisk ? '#b91c1c' : '#0369a1'}"/>`
      + `<text class="txt sm b" x="${34 + Math.min(580, (r.netShock / 20000) * 580)}" y="145">${rs(r.netShock)}</text>`
      + `<rect x="24" y="172" width="592" height="40" rx="8" fill="${r.debtRisk ? '#fee2e2' : '#dcfce7'}" stroke="${r.debtRisk ? '#b91c1c' : '#15803d'}"/>`
      + `<text class="txt b" x="320" y="197" text-anchor="middle">${esc(r.debtRisk ? P(`Debt Trap Risk: Needs ${rs(r.gap)} High-Interest Loan (${r.monthsToRecover} mo recovery)`, `कर्ज़ संकट: ${rs(r.gap)} उधार की आवश्यकता (${r.monthsToRecover} माह सुधार)`) : P(`Shock Absorbed! Remaining Savings: ${rs(r.savingsLeft)}`, `संकट संभाला गया! शेष बचत: ${rs(r.savingsLeft)}`))}</text>`;
    return {
      plate: {
        src: 'assets/images/plates/t08-safetynet.jpg',
        en: 'Solar village health clinic, community grain bank & women’s SHG — tap pins to stress-test a household against medical shocks.',
        hi: 'ग्राम स्वास्थ्य केंद्र, सामुदायिक अन्न बैंक व महिला सहायता समूह — संकट सुरक्षा-जाल परखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 42, y: 24, en: 'Public Health Clinic (70% Cover)', hi: 'जन-स्वास्थ्य केंद्र (70% सुरक्षा)', detail: b('Public health insurance shrinks a ₹15,000 hospital shock to ₹4,500 — absorbed by savings!', 'स्वास्थ्य बीमा ₹15,000 के संकट को ₹4,500 कर देता है — बचत से पूरा!'), set: { shockCost: 15000, safetyNetCoverPct: 70 } },
          { x: 62, y: 25, en: 'Grain Bank Buffer (₹8,000 Shock)', hi: 'सामुदायिक अन्न बैंक (₹8,000 संकट)', detail: b('Food rations & 50% cover keep crop-loss bills well below household savings.', 'राशन व 50% सहायता से छोटा संकट बिना कर्ज़ के पार हो जाता है।'), set: { shockCost: 8000, safetyNetCoverPct: 50 } },
          { x: 48, y: 72, en: 'Zero Safety Net Debt Trap (0%)', hi: 'शून्य सुरक्षा-जाल: कर्ज़ जाल (0%)', detail: b('Without coverage a ₹15,000 bill wipes ₹6,000 savings and forces high-interest debt!', 'बिना सुरक्षा के ₹15,000 का बिल परिवार को महँगे कर्ज़ में धकेल देता है!'), set: { shockCost: 15000, safetyNetCoverPct: 0 } },
        ],
      },
      svg: `<svg viewBox="0 0 640 225" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Net shock ${r.netShock} rupees; debt risk ${r.debtRisk}`,
      lines: [
        { en: `Raw shock ${rs(S.shockCost)} − ${S.safetyNetCoverPct}% safety net = ${rs(r.netShock)} paid by family (savings ₹6,000).`, hi: `कुल संकट ${rs(S.shockCost)} − ${S.safetyNetCoverPct}% सहायता = परिवार द्वारा देय ${rs(r.netShock)} (बचत ₹6,000)।`, cls: r.debtRisk ? 'warn' : 'balanced' },
        { en: 'In a welfare economy, social safety nets (public health, subsidised food grains, emergency relief) stop temporary bad luck from becoming permanent poverty.', hi: 'कल्याणकारी अर्थव्यवस्था में सामाजिक सुरक्षा-जाल (सार्वजनिक स्वास्थ्य, राशन, आपदा राहत) अस्थायी संकट को स्थायी गरीबी बनने से रोकते हैं।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Set shock cost to ₹15,000 with 0% safety net, then slide coverage up to 60% and watch the debt gap disappear.', '₹15,000 के संकट पर 0% सहायता रखकर देखें, फिर सहायता को 60% तक बढ़ाएँ और कर्ज़-अंतर समाप्त होते देखें।'),
    b('Why is recovery from high-interest informal debt much slower than keeping small savings intact?', 'अनौपचारिक महँगे कर्ज़ से उबरना छोटी बचत सुरक्षित रखने की तुलना में कहीं अधिक कठिन क्यों होता है?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('A family has ₹6,000 saved when a ₹15,000 medical shock hits. With 60% public health coverage, what is their out-of-pocket cost?', 'एक परिवार के पास ₹6,000 बचत है और ₹15,000 का चिकित्सा खर्च आता है। 60% जन-स्वास्थ्य सुरक्षा मिलने पर उन्हें अपनी जेब से कितना देना होगा?'),
    options: [opt('6k', '₹6,000 (covered by savings, zero debt)', '₹6,000 (बचत से पूरा, शून्य कर्ज़)'), opt('15k', '₹15,000 (forced into ₹9,000 debt)', '₹15,000 (₹9,000 कर्ज़ की मजबूरी)')],
    run: (S) => { S.shockCost = 15000; S.safetyNetCoverPct = 60; return M.householdShock({ monthlyIncome: 12000, savings: 6000, ...S }).debtRisk ? '15k' : '6k'; },
    explain: () => b('40% of ₹15,000 = ₹6,000, matching savings exactly and keeping the household out of high-interest debt.', '₹15,000 का 40% = ₹6,000, जो बचत के बराबर है और परिवार को महँगे कर्ज़ से बचाता है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('What is the primary goal of a social safety net in a welfare economy?', 'कल्याणकारी अर्थव्यवस्था में सामाजिक सुरक्षा-जाल का मुख्य लक्ष्य क्या है?'),
    correct: 'floor',
    options: [
      opt('floor', 'Protect households against catastrophic shocks (illness, job loss, crop failure) so families stay above a dignified floor.', 'परिवारों को अचानक आपदा, बीमारी या फसल नुकसान से बचाकर गरिमापूर्ण जीवन स्तर बनाए रखना।'),
      opt('ban', 'Ban private savings accounts.', 'निजी बचत खातों पर रोक लगाना।', b('Safety nets work alongside personal savings.', 'सुरक्षा-जाल निजी बचत के पूरक हैं।')),
    ],
    explain: b('Safety nets cushion vulnerable shocks so families stay productive and children stay in school.', 'सुरक्षा-जाल संकट को संभालते हैं ताकि परिवार उत्पादक रहें और बच्चों की पढ़ाई न रुके।'),
    hint: b('Check what changed when you raised the coverage slider.', 'कवरेज स्लाइडर बढ़ाने पर जो बदला, उसे देखें।'),
  }],
  reflect: b('Name one social safety-net programme in India (e.g. midday meal, public rations, health insurance) and how it helps families.', 'भारत की किसी एक सामाजिक सुरक्षा योजना (जैसे मध्याह्न भोजन, राशन प्रणाली, स्वास्थ्य बीमा) का नाम लिखें और बताएँ वह कैसे मदद करती है।'),
};
