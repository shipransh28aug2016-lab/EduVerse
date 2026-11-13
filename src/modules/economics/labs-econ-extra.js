// Remaining Economics lab specs: T08 (L1, L3, L4, L5), T15 (L1, L3, L4), T16 (L4, L5).
import { Chart } from '../../engines/chart.js';
import * as M from '../../engines/domain/market.js';
import * as S_ from '../../engines/domain/startup.js';
import * as F from '../../engines/domain/finance.js';
import { indiaMapSvg, forceGraphSvg } from '../../engines/viz.js';
import { esc, fmt } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });
const rs = (v) => `₹${fmt(v, 0)}`;

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

// ------------------------------------------------------------------ T15.L1 Business plan builder
export const planBuilder = {
  id: 'T15.L1',
  objective: b('Walk through the stages of turning an everyday problem into a viable enterprise using a business plan.', 'दैनिक जीवन की समस्या से व्यवसाय-योजना (बिज़नेस प्लान) के चरणों द्वारा एक सक्षम उद्यम बनाने की प्रक्रिया समझें।'),
  note: { kind: 'fictional', en: 'Illustrative venture-readiness checklist scoring idea clarity, customer proof, unit margins, and working capital.', hi: 'समस्या स्पष्टता, ग्राहक प्रमाण, इकाई मार्जिन और कार्यशील पूंजी की जांच करने वाला काल्पनिक उद्यम मॉडल।' },
  init: () => ({ problemClarity: 4, customerProof: 3, unitMarginOk: true, capitalBufferMonths: 4 }),
  controls: [
    { id: 'problemClarity', type: 'slider', label: b('1. Problem & solution clarity (1–5)', '1. समस्या व समाधान स्पष्टता (1–5)'), min: 1, max: 5, step: 1 },
    { id: 'customerProof', type: 'slider', label: b('2. Customer survey & prototype tests (1–5)', '2. ग्राहक जांच व प्रोटोटाइप परीक्षण (1–5)'), min: 1, max: 5, step: 1 },
    { id: 'unitMarginOk', type: 'toggle', label: b('3. Price exceeds unit cost (positive margin)', '3. मूल्य इकाई लागत से अधिक (सकारात्मक मार्जिन)') },
    { id: 'capitalBufferMonths', type: 'slider', label: b('4. Working capital runway (months)', '4. कार्यशील पूंजी बैकअप (माह)'), min: 0, max: 6, step: 1 },
  ],
  view(S) {
    const res = S_.planReadiness(S);
    const stages = [
      { lab: P('1. Spot Real Problem', '1. वास्तविक समस्या पहचानें'), val: S.problemClarity * 20 },
      { lab: P('2. Prototype & Feedback', '2. प्रोटोटाइप व प्रतिक्रिया'), val: S.customerProof * 20 },
      { lab: P('3. Unit Pricing Plan', '3. इकाई मूल्य योजना'), val: S.unitMarginOk ? 100 : 20 },
      { lab: P('4. Capital & Operations', '4. पूंजी व संचालन योजना'), val: Math.round((S.capitalBufferMonths / 6) * 100) },
    ];
    let g = '';
    stages.forEach((st, i) => {
      const y = 18 + i * 44;
      g += `<text class="txt sm" x="20" y="${y + 18}">${esc(st.lab)}</text>`
        + `<rect x="230" y="${y}" width="${st.val * 3.6}" height="24" rx="4" fill="${st.val >= 65 ? '#15803d' : st.val >= 40 ? '#d97706' : '#b91c1c'}"/>`
        + `<text class="txt sm b" x="${238 + st.val * 3.6}" y="${y + 17}">${st.val}%</text>`;
    });
    const col = res.stage === 'launch-ready' ? '#15803d' : res.stage === 'pilot-needed' ? '#b45309' : '#b91c1c';
    g += `<rect x="20" y="194" width="600" height="32" rx="8" fill="${col}" fill-opacity=".14" stroke="${col}"/><text class="txt b" x="320" y="215" text-anchor="middle">${esc(P(`Readiness Score: ${res.score}/100 (${res.stage})`, `तैयारी स्कोर: ${res.score}/100`))}</text>`;
    return {
      plate: {
        src: 'assets/images/plates/t15-startup.jpg',
        en: 'Craft-tech founders building bamboo water filters & solar lamps — tap pins to stress-test customer proof, margin & runway.',
        hi: 'बाँस फ़िल्टर व सौर लैंप प्रोटोटाइप — ग्राहक प्रमाण, लाभ-मार्जिन व पूंजी बफर परखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 36, y: 48, en: 'Strong MVP & Survey Proof', hi: 'मज़बूत प्रोटोटाइप व ग्राहक जांच', detail: b('Clear water-filtration need + village testing lifts score into launch-ready.', 'स्पष्ट समस्या व प्रोटोटाइप परीक्षण उद्यम को लॉन्च-रेडी बनाते हैं।'), set: { problemClarity: 5, customerProof: 5, unitMarginOk: true, capitalBufferMonths: 4 } },
          { x: 54, y: 68, en: 'Low-Runway Cash Pinch (0 Mo)', hi: 'शून्य कार्यशील पूंजी संकट', detail: b('Zero cash runway means one delayed customer payment stalls wages!', 'शून्य पूंजी बफर होने पर भुगतान में थोड़ी भी देरी काम रोक देती है!'), set: { capitalBufferMonths: 0 } },
          { x: 68, y: 86, en: 'Negative Unit Margin Trap', hi: 'नकारात्मक इकाई मार्जिन खतरा', detail: b('Selling below unit cost causes every extra order to lose more money!', 'लागत से कम कीमत रखने पर हर अतिरिक्त बिक्री घाटा बढ़ाती है!'), set: { unitMarginOk: false } },
        ],
      },
      svg: `<svg viewBox="0 0 640 236" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Business plan readiness ${res.score} out of 100 (${res.stage})`,
      lines: [
        { en: `Venture readiness: ${res.score}/100 — ${res.stage === 'launch-ready' ? 'Ready to launch small pilot and track cash flow.' : res.stage === 'pilot-needed' ? 'Run a tiny test batch first before committing large savings.' : 'Strengthen customer validation and positive unit margins before spending capital.'}`, hi: `उद्यम तैयारी: ${res.score}/100 — ${res.stage === 'launch-ready' ? 'छोटे पायलट लॉन्च के लिए तैयार।' : res.stage === 'pilot-needed' ? 'बड़ी पूंजी लगाने से पहले छोटा परीक्षण करें।' : 'खर्च से पहले ग्राहक प्रमाण और इकाई लाभ सुनिश्चित करें।'}`, cls: res.stage === 'launch-ready' ? 'balanced' : 'warn' },
        { en: 'Entrepreneurs combine land/workspace, labour, capital, and organisation while taking calculated risk to create jobs and solutions.', hi: 'उद्यमी स्थान, श्रम, पूंजी और संगठन को जोड़कर जोखिम उठाते हैं और नए समाधान व रोज़गार रचते हैं।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Toggle Unit Pricing Plan off while setting Problem Clarity to 5. Why does a popular idea still fail if unit margin is negative?', 'समस्या स्पष्टता 5 रखकर इकाई मूल्य योजना बंद करें। हर बिक्री पर घाटा होने से लोकप्रिय विचार भी क्यों डूब जाता है?'),
    b('Lower working capital runway to 0 months: what happens if customers pay late?', 'कार्यशील पूंजी 0 माह करके देखें: ग्राहक देर से भुगतान करें तो क्या होगा?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('Which stage comes BEFORE renting a large factory and hiring full-time staff?', 'बड़ा कारखाना किराए पर लेने और पूरा स्टाफ रखने से पहले कौन-सा चरण आना चाहिए?'),
    options: [opt('proto', 'Validate customer need with a low-cost prototype & check unit economics', 'कम लागत वाले प्रोटोटाइप से ग्राहक मांग व इकाई लाभ जांचना'), opt('spend', 'Spend all savings on advertising first', 'पहले पूरी बचत विज्ञापन पर खर्च करना')],
    run: (S) => { S.customerProof = 4; S.unitMarginOk = true; return 'proto'; },
    explain: () => b('Testing demand cheaply and verifying positive margin lowers failure risk dramatically.', 'सस्ते में मांग परखने और लाभ की पुष्टि करने से व्यावसायिक जोखिम बहुत घटता है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Why does a business plan include a working-capital cash buffer?', 'बिज़नेस प्लान में कार्यशील पूंजी (वर्किंग कैपिटल) बफर क्यों रखा जाता है?'),
    correct: 'gap',
    options: [
      opt('gap', 'To pay rent, raw materials, and wages during early months before steady sales arrive.', 'नियमित बिक्री शुरू होने से पहले शुरुआती महीनों का किराया, कच्चा माल व मज़दूरी चुकाने के लिए।'),
      opt('decor', 'To decorate the office sign.', 'कार्यालय का बोर्ड सजाने के लिए।', b('Working capital covers real timing gaps between cash out and cash in.', 'कार्यशील पूंजी खर्च और आय के बीच के समय-अंतर को संभालती है।')),
    ],
    explain: b('Many profitable-on-paper startups run out of cash simply because they lacked working capital.', 'कई अच्छे उद्यम केवल कार्यशील पूंजी की कमी से रुक जाते हैं।'),
    hint: b('Inspect slider 4 in the readiness controls.', 'तैयारी नियंत्रण में स्लाइडर 4 देखें।'),
  }],
  reflect: b('Think of one everyday inconvenience at school and outline a tiny 1-week pilot to test if classmates would use your solution.', 'विद्यालय की किसी दैनिक असुविधा पर 1-सप्ताह का छोटा पायलट विचार लिखें।'),
};

// ------------------------------------------------------------------ T15.L3 India Startup Ecosystem & MSME Gallery
const ECO_GALLERY = [
  { id: 'hubs', en: 'Startup India & Digital India Hubs', hi: 'स्टार्टअप इंडिया व डिजिटल इंडिया केंद्र', descEn: 'Digital payments (UPI), broadband, and DPIIT recognition helped startups expand beyond metros into Tier-2/3 cities.', descHi: 'यूपीआई, डिजिटल अवसंरचना व स्टार्टअप इंडिया ने छोटे शहरों तक नए उद्यमों की पहुँच बढ़ाई।' },
  { id: 'msme', en: 'Make in India & MSME Clusters', hi: 'मेक इन इंडिया व एमएसएमई क्लस्टर', descEn: 'Micro, Small and Medium Enterprises manufacture textiles, ceramics, tools, and food — forming India’s industrial backbone and creating massive local employment.', descHi: 'सूक्ष्म, लघु और मध्यम उद्यम (MSME) वस्त्र, औज़ार व खाद्य प्रसंस्करण द्वारा बड़े पैमाने पर स्थानीय रोज़गार देते हैं।' },
  { id: 'unorg', en: 'Unorganised Sector Workers & Artisans', hi: 'असंगठित क्षेत्र के श्रमिक व कारीगर', descEn: 'Tailors, street vendors, handloom weavers, and farm-gate workers form the majority of India’s workforce — needing fair credit, social security, and market access.', descHi: 'दर्जी, रेहड़ी-पटरी वाले, हथकरघा बुनकर व कारीगर भारत के कार्यबल का बड़ा हिस्सा हैं जिन्हें सस्ते ऋण व सामाजिक सुरक्षा की आवश्यकता है।' },
];
export const ecosystemMap = {
  id: 'T15.L3',
  objective: b('Locate India’s diverse startup & MSME clusters and compare how Startup India, Make in India, Digital India, MSMEs, and the unorganised sector create jobs.', 'भारत के स्टार्टअप व एमएसएमई केंद्रों को मानचित्र पर देखें और समझें कि स्टार्टअप इंडिया, मेक इन इंडिया, एमएसएमई व असंगठित क्षेत्र रोज़गार कैसे रचते हैं।'),
  note: { kind: 'documented', en: 'Representative Indian startup & MSME clusters alongside documented policy pillars (Startup India, Make in India, Digital India).', hi: 'भारत के प्रतिनिधि स्टार्टअप व एमएसएमई क्लस्टर तथा प्रलेखित नीति स्तंभ (स्टार्टअप इंडिया, मेक इन इंडिया, डिजिटल इंडिया)।' },
  init: () => ({ focus: 'hubs', hubIdx: 0 }),
  controls: [
    { id: 'focus', type: 'chips', label: b('Sector lens', 'क्षेत्र दृष्टिकोण'), options: ECO_GALLERY.map((g) => opt(g.id, g.en, g.hi)) },
    { id: 'hubIdx', type: 'slider', label: b('Highlight cluster (1–6)', 'क्लस्टर चुनें (1–6)'), min: 0, max: S_.STARTUP_HUBS.length - 1, step: 1, fmt: (i) => S_.STARTUP_HUBS[i]?.state || '' },
  ],
  view(S) {
    const cur = S_.STARTUP_HUBS[S.hubIdx] || S_.STARTUP_HUBS[0];
    const info = ECO_GALLERY.find((x) => x.id === S.focus) || ECO_GALLERY[0];
    const svg = indiaMapSvg({
      markers: S_.STARTUP_HUBS.map((h, i) => ({
        lon: h.lon, lat: h.lat, label: i === S.hubIdx ? P(h.en, h.hi) : h.state,
        r: i === S.hubIdx ? 7.5 : 4.5, fill: i === S.hubIdx ? '#dc2626' : '#0369a1',
      })),
      stateColors: { [cur.state]: '#fed7aa' },
      selectedState: cur.state,
      aria: P('India startup and MSME hubs map', 'भारत स्टार्टअप और एमएसएमई केंद्र मानचित्र'),
    });
    return {
      plate: {
        src: 'assets/images/t15.jpg',
        en: 'India’s enterprise ecosystem — tap pins to jump between Startup India hubs, MSME workshops and unorganised artisans.',
        hi: 'भारत का उद्यम पारिस्थितिकी तंत्र — स्टार्टअप केंद्र, एमएसएमई क्लस्टर व असंगठित कारीगर देखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 50, en: 'Startup India & UPI Tech Hubs', hi: 'स्टार्टअप इंडिया व डिजिटल केंद्र', detail: b('Explore DPIIT startups powered by instant digital payments across hubs.', 'UPI व डिजिटल अवसंरचना से जुड़े स्टार्टअप केंद्र देखें।'), set: { focus: 'hubs', hubIdx: 0 } },
          { x: 54, y: 46, en: 'Make in India MSME Clusters', hi: 'मेक इन इंडिया MSME क्लस्टर', detail: b('Inspect Surat/Coimbatore-style small factories creating widespread local jobs.', 'स्थानीय रोज़गार रचने वाले लघु व मध्यम उद्योग क्लस्टर देखें।'), set: { focus: 'msme', hubIdx: 3 } },
          { x: 80, y: 56, en: 'Artisans & Unorganised Sector', hi: 'असंगठित क्षेत्र व कारीगर', detail: b('See how formal bank credit & e-commerce uplift small craft workers.', 'बैंक ऋण व डिजिटल पहुँच से कारीगरों को मिलने वाली शक्ति देखें।'), set: { focus: 'unorg', hubIdx: 5 } },
        ],
      },
      svg,
      aria: `${cur.en}, lens ${info.en}`,
      lines: [
        { en: `Cluster: ${cur.en} (${cur.state}).`, hi: `क्लस्टर: ${cur.hi} (${cur.state})।`, cls: 'balanced' },
        { en: `${info.en}: ${info.descEn}`, hi: `${info.hi}: ${info.descHi}`, cls: 'note' },
      ],
    };
  },
  discover: [
    b('Step across all 6 hubs on the India map — notice how MSMEs in Surat and agri-craft in Patna/Jaipur complement metro tech hubs.', 'मानचित्र पर सभी 6 केंद्र देखें — सूरत के एमएसएमई और पटना/जयपुर के कृषि-शिल्प उद्यम महानगरों के टेक केंद्रों के पूरक हैं।'),
    b('Compare MSMEs with the unorganised sector: how does formal registration help an enterprise get bank credit?', 'एमएसएमई की तुलना असंगठित क्षेत्र से करें: औपचारिक पंजीकरण से उद्यम को बैंक ऋण मिलने में कैसे मदद होती है?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('How does Digital India (such as UPI instant payments and ONDC/e-commerce) directly help a small town artisan or MSME?', 'डिजिटल इंडिया (जैसे UPI त्वरित भुगतान और ई-कॉमर्स) किसी छोटे शहर के कारीगर या एमएसएमई की सीधे कैसे मदद करता है?'),
    options: [opt('reach', 'It lowers transaction costs and connects local makers to buyers nationwide', 'लेन-देन लागत घटती है और स्थानीय निर्माता देश भर के खरीदारों से जुड़ते हैं'), opt('stop', 'It forces artisans to close workshops', 'यह कारीगरों की कार्यशालाएँ बंद करवाता है')],
    run: (S) => { S.focus = 'hubs'; S.hubIdx = 5; return 'reach'; },
    explain: () => b('Low-cost digital payments and networks let rural MSMEs and craft producers accept orders beyond their local market.', 'सस्ते डिजिटल भुगतान और नेटवर्क ग्रामीण कारीगरों को स्थानीय बाज़ार से बाहर भी ग्राहक दिलाते हैं।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Why is supporting the unorganised sector and MSMEs vital for inclusive growth in India?', 'भारत में समावेशी विकास के लिए असंगठित क्षेत्र और एमएसएमई को सशक्त बनाना क्यों महत्वपूर्ण है?'),
    correct: 'jobs',
    options: [
      opt('jobs', 'Together they employ the vast majority of workers and spread entrepreneurship across every district.', 'दोनों मिलकर देश के अधिकांश श्रमिकों को रोज़गार देते हैं और हर जिले में उद्यमिता फैलाते हैं।'),
      opt('tax', 'Only five mega-cities contain all workers.', 'सभी श्रमिक केवल पाँच महानगरों में रहते हैं।', b('Employment is heavily distributed across small enterprises and rural/semi-urban towns.', 'रोज़गार छोटे उद्यमों और कस्बों में व्यापक रूप से फैला है।')),
    ],
    explain: b('MSMEs and informal artisans drive widespread livelihoods alongside formal startups.', 'औपचारिक स्टार्टअप के साथ-साथ एमएसएमई और कारीगर व्यापक आजीविका के आधार हैं।'),
    hint: b('Switch Sector lens to MSMEs and Unorganised Sector.', 'क्षेत्र दृष्टिकोण को एमएसएमई व असंगठित क्षेत्र पर बदलें।'),
  }],
  reflect: b('Name one local product made by an MSME or artisan near your home and how digital payments might help them.', 'अपने आसपास के किसी एमएसएमई या कारीगर के एक उत्पाद का नाम लिखें और बताएँ डिजिटल भुगतान उनकी कैसे मदद कर सकता है।'),
};

// ------------------------------------------------------------------ T15.L4 Creative destruction
export const creativeDestruction = {
  id: 'T15.L4',
  objective: b('Model "creative destruction": see how new innovations displace older industries while creating new jobs and higher productivity — and how worker retraining softens disruption.', '“सृजनात्मक विनाश” का मॉडल देखें: नई तकनीक पुराने उद्योगों को विस्थापित करते हुए नए रोज़गार व उत्पादकता कैसे लाती है, और कौशल-पुनर्प्रशिक्षण संक्रमण को कैसे आसान बनाता है।'),
  note: { kind: 'fictional', en: 'Illustrative 10-year Schumpeterian innovation curve (e.g. hand-type setting → digital publishing, or horse carts → EV/logistics).', hi: '10-वर्षीय नवाचार वक्र का काल्पनिक मॉडल (जैसे पुरानी मुद्रण प्रणाली → डिजिटल प्रकाशन)।' },
  init: () => ({ techSpeed: 60, retrainSupport: 50 }),
  controls: [
    { id: 'techSpeed', type: 'slider', label: b('Speed of new technology adoption (%)', 'नई तकनीक अपनाने की गति (%)'), min: 20, max: 100, step: 10, fmt: (v) => `${v}%` },
    { id: 'retrainSupport', type: 'slider', label: b('Worker upskilling & transition support (%)', 'श्रमिक पुनर्प्रशिक्षण सहायता (%)'), min: 0, max: 100, step: 10, fmt: (v) => `${v}%` },
  ],
  view(S) {
    const res = S_.creativeDestruction(S);
    const ch = new Chart({ xMax: 10, yMax: 240, xLabel: P('Years', 'वर्ष'), yLabel: P('Index (Jobs / Output)', 'सूचकांक (रोज़गार / उत्पादन)'), xTicks: 5, yTicks: 6 });
    ch.axes();
    ch.line(res.oldJobs, 'curve d');
    ch.line(res.newJobs, 'curve g');
    ch.line(res.output, 'ghost', { dash: true });
    ch.text(10, res.oldJobs[10][1], P('old-tech jobs', 'पुरानी तकनीक रोज़गार'), 'lbl', 'end', -4, -6);
    ch.text(10, res.newJobs[10][1], P('new-tech jobs', 'नई तकनीक रोज़गार'), 'lbl', 'end', -4, 14);
    ch.text(10, res.output[10][1], P('total output', 'कुल उत्पादन'), 'lbl', 'end', -4, -8);
    return {
      plate: {
        src: 'assets/images/t15.jpg',
        en: 'Creative destruction over 10 years — tap pins to compare fast disruption without reskilling vs supported worker transition.',
        hi: '10 वर्षों में सृजनात्मक विनाश — बिना प्रशिक्षण तेज़ बदलाव बनाम कौशल-उन्नयन की तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 50, en: 'Fast Tech + Zero Reskilling (Stress)', hi: 'तेज़ बदलाव, शून्य प्रशिक्षण', detail: b('Old jobs vanish quickly while new roles lag behind — painful displacement!', 'पुरानी नौकरियाँ घटती हैं पर कौशल न मिलने से नए अवसर छूटते हैं!'), set: { techSpeed: 80, retrainSupport: 10 } },
          { x: 54, y: 46, en: 'Fast Tech + 90% Upskilling Boost', hi: 'तेज़ बदलाव + 90% पुनर्प्रशिक्षण', detail: b('Vocational training turns disruption into net job expansion & rising output!', 'कौशल प्रशिक्षण विस्थापन को शुद्ध रोज़गार व उत्पादन वृद्धि में बदलता है!'), set: { techSpeed: 80, retrainSupport: 90 } },
          { x: 80, y: 54, en: 'Gradual Steady Adaptation (30%)', hi: 'धीमा क्रमिक तकनीकी बदलाव', detail: b('Slower adoption softens short-term shocks while lifting output moderately.', 'धीमा परिवर्तन अल्पकालिक झटका कम कर मध्यम वृद्धि देता है।'), set: { techSpeed: 30, retrainSupport: 50 } },
        ],
      },
      svg: ch.html({ label: P('Creative destruction jobs and output over 10 years', '10 वर्षों में सृजनात्मक विनाश के रोज़गार व उत्पादन वक्र') }),
      aria: `Final combined jobs index ${res.finalNetJobs}, displaced peak ${res.displacedPeak}`,
      lines: [
        { en: `Year 10 combined jobs index: ${res.finalNetJobs} (starting 100), while transition displacement stress peaks around ${res.displacedPeak}%.`, hi: `10वें वर्ष में कुल रोज़गार सूचकांक: ${res.finalNetJobs} (प्रारंभ 100), जबकि संक्रमण काल में विस्थापन दबाव ~${res.displacedPeak}% तक जाता है।`, cls: res.displacedPeak > 45 ? 'warn' : 'balanced' },
        { en: 'Joseph Schumpeter’s insight: innovation destroys outdated firms/jobs (“destruction”) even as it lifts living standards and opens new industries (“creation”) — making reskilling vital.', hi: 'नवाचार पुरानी पद्धतियों को बदलकर (“विनाश”) अधिक उत्पादकता व नए उद्योग (“सृजन”) लाता है — इसलिए श्रमिकों का कौशल-उन्नयन आवश्यक है।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Set Retraining Support to 0% vs 100% while Technology Speed is 80%: compare Year-10 new jobs.', 'तकनीक गति 80% रखकर पुनर्प्रशिक्षण को 0% बनाम 100% करके 10वें वर्ष के नए रोज़गार देखें।'),
    b('Think of UPI replacing paper cheques or smartphones replacing standalone film cameras: who gained and who had to adapt?', 'कागज़ी चेक की जगह UPI या फिल्म कैमरे की जगह स्मार्टफोन का उदाहरण सोचें: किसे लाभ हुआ और किसे कौशल बदलना पड़ा?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('When a faster new technology displaces an old craft, what raises the number of workers successfully moving into new jobs?', 'जब नई तकनीक पुराने कौशल को विस्थापित करती है, तो अधिक श्रमिकों को नए रोज़गारों से जोड़ने में क्या मदद करता है?'),
    options: [opt('skill', 'Active reskilling, vocational training, and transition support', 'सक्रिय पुनर्प्रशिक्षण, व्यावसायिक शिक्षा और संक्रमण सहायता'), opt('hide', 'Pretending the new technology does not exist', 'यह मान लेना कि नई तकनीक आई ही नहीं')],
    run: (S) => { S.retrainSupport = 90; return 'skill'; },
    explain: () => b('Upskilling raises the new-jobs curve (green) so productivity gains are broadly shared.', 'कौशल-उन्नयन नए रोज़गार वक्र (हरा) को ऊपर उठाता है ताकि प्रगति का लाभ सभी को मिले।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('What does "creative destruction" describe in economics?', 'अर्थशास्त्र में “सृजनात्मक विनाश” किसे दर्शाता है?'),
    correct: 'sch',
    options: [
      opt('sch', 'New innovations replacing older products and business models while creating new industries and higher productivity.', 'नए नवाचारों द्वारा पुराने उत्पादों व मॉडलों को बदलते हुए नए उद्योग व उच्च उत्पादकता का निर्माण करना।'),
      opt('storm', 'Floods destroying factories.', 'बाढ़ से कारखानों का टूटना।', b('Natural disasters are physical shocks, whereas creative destruction comes from innovation.', 'प्राकृतिक आपदा भौतिक संकट है, जबकि सृजनात्मक विनाश नवाचार से आता है।')),
    ],
    explain: b('Creative destruction drives long-run progress while requiring social policies to help displaced workers adapt.', 'सृजनात्मक विनाश दीर्घकालिक प्रगति लाता है और विस्थापित श्रमिकों के लिए पुनर्प्रशिक्षण नीतियाँ माँगता है।'),
    hint: b('Watch the crossing red and green curves on the chart.', 'चार्ट पर लाल और हरे वक्र का कटाव देखें।'),
  }],
  reflect: b('Give one real example of a job or tool that disappeared in your parents’ lifetime and a new job that replaced it.', 'अपने माता-पिता के समय से समाप्त हुए एक कार्य/उपकरण और उसकी जगह आए एक नए रोज़गार का उदाहरण लिखें।'),
};

// ------------------------------------------------------------------ T16.L4 Instruments, risk-return & insurance pool
export const riskReturn = {
  id: 'T16.L4',
  objective: b('Compare savings accounts, fixed deposits, government bonds, and equity index funds across risk and return, and calculate how insurance pools risk across many households.', 'बचत खाता, सावधि जमा (FD), सरकारी बॉन्ड और इक्विटी इंडेक्स फंड के बीच जोखिम व प्रतिफल की तुलना करें, और बीमा द्वारा जोखिम-विभाजन की गणना करें।'),
  note: { kind: 'fictional', en: 'Hypothetical illustrative returns and fictional 200-family insurance risk pool — not live bank or market rates.', hi: 'काल्पनिक प्रतिफल दरें और 200 परिवारों का काल्पनिक बीमा जोखिम-पूल — ये वास्तविक बैंक या बाज़ार दरें नहीं हैं।' },
  init: () => ({ horizon: 10, poolSize: 200, claimProbPct: 3 }),
  controls: [
    { id: 'horizon', type: 'slider', label: b('Investment horizon (years)', 'निवेश अवधि (वर्ष)'), min: 1, max: 20, step: 1 },
    { id: 'poolSize', type: 'slider', label: b('Families in insurance pool', 'बीमा पूल में परिवार'), min: 50, max: 500, step: 50 },
    { id: 'claimProbPct', type: 'slider', label: b('Annual accident risk (%)', 'वार्षिक दुर्घटना जोखिम (%)'), min: 1, max: 10, step: 1, fmt: (v) => `${v}%` },
  ],
  view(S) {
    const pool = F.insurancePool({ poolSize: S.poolSize, claimProbPct: S.claimProbPct, claimAmount: 40000 });
    // Risk-Return 2D Quadrant Scatter + Horizon Bar Growth + Insurance Pool Shield Banner
    let g = `<rect x="16" y="12" width="608" height="170" rx="10" fill="#f8fafc" stroke="var(--line)"/>`
      + `<line x1="64" y1="158" x2="600" y2="158" stroke="var(--ink)" stroke-width="1.5"/><line x1="64" y1="22" x2="64" y2="158" stroke="var(--ink)" stroke-width="1.5"/>`
      + `<text class="txt sm mut" x="330" y="175" text-anchor="middle">${esc(P('Volatility / Risk Index →', 'जोखिम सूचकांक →'))}</text>`
      + `<text class="txt sm mut" transform="translate(28,90) rotate(-90)" text-anchor="middle">${esc(P(`Value of ₹10,000 (${S.horizon}y)`, `${S.horizon} वर्ष में ₹10,000`))}</text>`;
    const cols = ['#0ea5e9', '#15803d', '#0369a1', '#b45309'];
    const dots = [];
    const curvePts = F.INSTRUMENTS.map((ins, i) => {
      const val = F.compoundAmount(10000, ins.returnPct, S.horizon);
      const cx = (78 + (ins.risk / 75) * 490).toFixed(1);
      const cy = (154 - Math.min(1, val / 85000) * 124).toFixed(1);
      dots.push(`<circle cx="${cx}" cy="${cy}" r="${Math.min(20, 9 + val / 8000).toFixed(1)}" fill="${cols[i % cols.length]}" opacity=".86" stroke="#fff" stroke-width="2"/>`
        + `<text class="txt sm b" x="${cx}" y="${(Number(cy) - 14).toFixed(1)}" text-anchor="middle">${esc(P(ins.en.split(' (')[0], ins.hi.split(' (')[0]))} (${rs(val)})</text>`);
      return `${cx},${cy}`;
    });
    g += `<polyline points="${curvePts.join(' ')}" fill="none" stroke="var(--mut)" stroke-width="2" stroke-dasharray="5 4"/>` + dots.join('');
    g += `<rect x="16" y="192" width="608" height="40" rx="10" fill="#dcfce7" stroke="#15803d" stroke-width="1.5"/>`
      + `<text class="txt sm b" x="320" y="217" text-anchor="middle">${esc(P(`🛡️ Insurance Pool: ${S.poolSize} families × ₹40,000 cover → Fair premium ≈ ${rs(pool.fairPremium)}/yr`, `🛡️ बीमा पूल: ${S.poolSize} परिवार × ₹40,000 सुरक्षा → उचित प्रीमियम ≈ ${rs(pool.fairPremium)}/वर्ष`))}</text>`;
    return {
      plate: {
        src: 'assets/images/t16.jpg',
        en: 'Instruments, risk-return & insurance pooling — tap pins to shift from short-term safety to 18-yr compounding or shock pooling.',
        hi: 'निवेश साधन, जोखिम-प्रतिफल व बीमा पूल — अल्पकालिक सुरक्षा, दीर्घकालिक चक्रवृद्धि व जोखिम-विभाजन हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 50, en: '2-Year Horizon (Safety First)', hi: '2-वर्षीय लक्ष्य (सुरक्षा पहले)', detail: b('Short goals need steady Savings/FD rather than short-term equity swings.', 'अल्पकालिक लक्ष्यों के लिए स्थिर बचत या FD उपयुक्त है।'), set: { horizon: 2, poolSize: 200, claimProbPct: 3 } },
          { x: 52, y: 46, en: '18-Year Wealth Gap (Index Curve)', hi: '18-वर्षीय दीर्घकालिक वृद्धि', detail: b('Over decades higher-return compounding pulls dramatically ahead of plain cash!', 'दशकों में उच्च प्रतिफल चक्रवृद्धि सुरक्षित विकल्पों से कहीं आगे निकलता है!'), set: { horizon: 18, poolSize: 200, claimProbPct: 3 } },
          { x: 80, y: 54, en: 'High-Risk Insurance Pool (8%)', hi: 'उच्च जोखिम बीमा पूल (8%)', detail: b('Watch 200 households pool together to absorb frequent ₹40,000 shocks safely.', '200 परिवार मिलकर ₹40,000 के संकट को सहज वार्षिक प्रीमियम में बाँट लेते हैं।'), set: { poolSize: 200, claimProbPct: 8 } },
        ],
      },
      svg: `<svg viewBox="0 0 640 242" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Over ${S.horizon} years ₹10,000 grows fastest in higher-risk index fund; insurance fair premium ${pool.fairPremium} rupees`,
      lines: [
        { en: `Risk-Return Trade-off (${S.horizon} yrs on ₹10,000): Safe FDs/Bonds give steady modest growth, while Equity Index Funds offer higher average returns with short-term volatility (risk 65).`, hi: `जोखिम-प्रतिफल संबंध (${S.horizon} वर्ष में ₹10,000): FD व बॉन्ड स्थिर बढ़त देते हैं, जबकि इंडेक्स फंड अधिक औसत लाभ के साथ अल्पकालिक उतार-चढ़ाव (जोखिम 65) रखते हैं।`, cls: 'note' },
        { en: `Insurance Pooling: Instead of 1 unlucky family facing a catastrophic ₹40,000 bill alone, ${S.poolSize} families each chip in ${rs(pool.fairPremium)}/year to cover ~${pool.expectedClaims} claims.`, hi: `बीमा जोखिम-विभाजन: किसी 1 परिवार पर ₹40,000 का भारी संकट पड़ने के बजाय ${S.poolSize} परिवार प्रति वर्ष ~${rs(pool.fairPremium)} मिलाकर ~${pool.expectedClaims} दावों का भार बाँट लेते हैं।`, cls: 'balanced' },
      ],
    };
  },
  discover: [
    b('Compare Savings A/c vs Index Fund at 1 year vs 20 years: why do short-term goals need low-risk FDs rather than volatile stocks?', '1 वर्ष बनाम 20 वर्ष पर बचत खाता और इंडेक्स फंड की तुलना करें: अल्पकालिक लक्ष्यों के लिए कम जोखिम वाली FD क्यों बेहतर है?'),
    b('Raise annual accident risk from 2% to 8% and see how the fair premium scales proportionally.', 'वार्षिक जोखिम 2% से 8% करके देखें कि उचित प्रीमियम कैसे बढ़ता है।'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('If 200 families share a ₹40,000 emergency risk that strikes 3% of families each year (6 claims total), what is each family’s fair yearly share?', 'यदि 200 परिवार ₹40,000 का वार्षिक जोखिम साझा करें जो हर वर्ष 3% परिवारों (कुल 6 दावे) को प्रभावित करता है, तो प्रति परिवार उचित हिस्सा कितना होगा?'),
    options: [opt('1200', '₹1,200/year (shared across 200 families)', '₹1,200/वर्ष (200 परिवारों में बँटा)'), opt('40000', '₹40,000/year', '₹40,000/वर्ष')],
    run: (S) => { S.poolSize = 200; S.claimProbPct = 3; return F.insurancePool({ poolSize: 200, claimProbPct: 3, claimAmount: 40000 }).fairPremium === 1200 ? '1200' : '40000'; },
    explain: () => b('6 expected claims × ₹40,000 = ₹2,40,000 total pool ÷ 200 families = ₹1,200 each — turning catastrophe into a predictable cost.', '6 संभावित दावे × ₹40,000 = ₹2,40,000 ÷ 200 परिवार = ₹1,200 प्रति परिवार।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Which rule describes the general relationship between risk and expected return?', 'जोखिम और संभावित प्रतिफल के बीच सामान्य संबंध कौन-सा नियम बताता है?'),
    correct: 'up',
    options: [
      opt('up', 'Higher potential long-term returns generally carry higher risk of short-term loss or fluctuation.', 'उच्च दीर्घकालिक प्रतिफल की संभावना के साथ सामान्यतः अल्पकालिक उतार-चढ़ाव व जोखिम भी अधिक होता है।'),
      opt('free', 'High returns always come with zero risk.', 'उच्च प्रतिफल सदैव शून्य जोखिम के साथ आता है।', b('Guaranteed high returns with zero risk are usually a warning sign of financial fraud!', 'शून्य जोखिम में अत्यधिक निश्चित प्रतिफल अक्सर वित्तीय धोखाधड़ी का संकेत होता है!')),
    ],
    explain: b('Diversification across safe instruments (emergency FD) and long-term investments balances risk and goals.', 'आपातकालीन FD और दीर्घकालिक निवेश में विविधीकरण जोखिम और लक्ष्य को संतुलित करता है।'),
    hint: b('Compare the Risk number next to each bar.', 'प्रत्येक पट्टी के आगे दी गई जोखिम संख्या देखें।'),
  }],
  reflect: b('Why should a family build an emergency Fixed Deposit and buy health insurance BEFORE chasing high-risk investments?', 'उच्च जोखिम वाले निवेश से पहले किसी परिवार को आपातकालीन बचत व स्वास्थ्य बीमा क्यों रखना चाहिए?'),
};

// ------------------------------------------------------------------ T16.L5 Income tax concept flow (strictly unitless conceptual slabs)
export const taxFlow = {
  id: 'T16.L5',
  objective: b('Understand the concept of personal income tax, progressive slab tiers, and how citizen taxes fund shared public goods like schools, roads, and healthcare.', 'व्यक्तिगत आयकर, प्रगतिशील कर-स्तरों (स्लैब) की अवधारणा और नागरिकों के कर से विद्यालय, सड़कें व स्वास्थ्य सेवाएँ कैसे चलती हैं, इसे समझें।'),
  note: { kind: 'fictional', en: 'Strictly conceptual unitless income-slab illustration — NOT current statutory Income Tax slabs (consult latest official Finance Act for exact figures).', hi: 'केवल अवधारणात्मक इकाई-रहित कर-स्तर चित्रण — ये वास्तविक वैधानिक आयकर दरें नहीं हैं।' },
  init: () => ({ incomeUnits: 14, progressivity: 1 }),
  controls: [
    { id: 'incomeUnits', type: 'slider', label: b('Annual income index (abstract units)', 'वार्षिक आय सूचकांक (काल्पनिक इकाइयाँ)'), min: 2, max: 24, step: 1 },
    { id: 'progressivity', type: 'chips', label: b('Tax fairness structure', 'कर संरचना'), options: [opt(1, 'Progressive Slabs', 'प्रगतिशील स्तर (स्लैब)'), opt(0, 'Zero Tax (No Public Pool)', 'शून्य कर (कोई सार्वजनिक कोष नहीं)')] },
  ],
  view(S) {
    const r = F.taxConceptAlloc(S);
    const total = Math.max(1, S.incomeUnits);
    const exW = (r.exempt / total) * 560, midW = (r.mid / total) * 560, topW = (r.top / total) * 560;
    const g = `<text class="txt sm b" x="24" y="34">${esc(P(`Income Index: ${S.incomeUnits} units sliced across conceptual tiers`, `आय सूचकांक: ${S.incomeUnits} इकाइयाँ अवधारणात्मक स्तरों में विभाजित`))}</text>`
      + `<rect x="24" y="46" width="${exW.toFixed(1)}" height="34" fill="#15803d"/>`
      + `<rect x="${(24 + exW).toFixed(1)}" y="46" width="${midW.toFixed(1)}" height="34" fill="#0369a1"/>`
      + `<rect x="${(24 + exW + midW).toFixed(1)}" y="46" width="${topW.toFixed(1)}" height="34" fill="#b45309"/>`
      + `<text class="txt sm mut" x="24" y="102">${esc(P('Green: Basic Exempt (0%) | Blue: Middle Tier | Amber: Higher Tier', 'हरा: कर-मुक्त मूल स्तर (0%) | नीला: मध्यम स्तर | एम्बर: उच्च स्तर'))}</text>`
      + `<rect x="24" y="124" width="286" height="66" rx="8" fill="#f1f5f9" stroke="#64748b"/>`
      + `<text class="txt b" x="38" y="150">${esc(P(`Tax Contributed: ${r.effectiveTax} units (${r.effectivePct}%)`, `कर योगदान: ${r.effectiveTax} इकाइयाँ (${r.effectivePct}%)`))}</text>`
      + `<text class="txt sm mut" x="38" y="172">${esc(P(`Net Take-Home: ${r.takeHome} units`, `कर-पश्चात शेष: ${r.takeHome} इकाइयाँ`))}</text>`
      + `<rect x="328" y="124" width="288" height="66" rx="8" fill="#dcfce7" stroke="#15803d"/>`
      + `<text class="txt sm b" x="342" y="148">${esc(P('Funds Shared Public Services:', 'साझा सार्वजनिक सेवाओं का वित्तपोषण:'))}</text>`
      + `<text class="txt sm" x="342" y="170">${esc(P('Roads, Schools, Hospitals, Courts & Security', 'सड़कें, विद्यालय, अस्पताल, न्यायालय व सुरक्षा'))}</text>`;
    return {
      plate: {
        src: 'assets/images/plates/t16-tax.jpg',
        en: 'Public schools, health clinics, roads, bridges & clean water towers — tap any landmark to test progressive tax slabs vs zero-tax.',
        hi: 'सरकारी विद्यालय, चिकित्सालय, सड़क-पुल व जल मीनार — प्रगतिशील कर-स्तर बनाम शून्य कर परखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 20, y: 42, en: 'Basic Exempt Tier (4 Units = 0% Tax)', hi: 'कर-मुक्त मूल स्तर (0% कर)', detail: b('First 4 income units stay 100% exempt so basic needs are never squeezed.', 'प्रथम 4 आय इकाइयाँ पूरी तरह कर-मुक्त रहती हैं ताकि मूल आवश्यकताएँ सुरक्षित रहें।'), set: { incomeUnits: 4, progressivity: 1 } },
          { x: 65, y: 42, en: 'Clinic & Middle Income (12 Units)', hi: 'मध्यम आय व जन-चिकित्सालय (12)', detail: b('Only units above the threshold pay moderate tax, leaving higher take-home income.', 'केवल सीमा से ऊपर की आय पर मध्यम कर लगता है, जिससे शेष आय बढ़ती है।'), set: { incomeUnits: 12, progressivity: 1 } },
          { x: 48, y: 68, en: 'Highway Bridge & Top Tier (22 Units)', hi: 'उच्च स्तर व पुल निर्माण (22)', detail: b('Progressive upper slices fund major public highways, bridges & schools fairly.', 'ऊपरी स्तर का योगदान बड़े राजमार्ग, पुल व विद्यालय बनाता है।'), set: { incomeUnits: 22, progressivity: 1 } },
          { x: 88, y: 26, en: 'Zero Public Pool Test', hi: 'शून्य कर कोष परीक्षण', detail: b('Turn off taxes — household take-home looks full, yet shared schools & water dry up!', 'कर शून्य करते ही साझा जल, सड़क व विद्यालयों का कोष समाप्त हो जाता है!'), set: { incomeUnits: 14, progressivity: 0 } },
        ],
      },
      svg: `<svg viewBox="0 0 640 212" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Income ${S.incomeUnits} units, conceptual tax ${r.effectiveTax} (${r.effectivePct}%), take-home ${r.takeHome}`,
      lines: [
        S.progressivity === 0
          ? { en: 'With zero taxes, take-home equals full income, but public schools, highways, courts, and water supply lose stable funding.', hi: 'शून्य कर होने पर शेष आय पूरी रहती है, पर सरकारी विद्यालय, राजमार्ग, न्यायालय और पेयजल बिना कोष के रुक जाते हैं।', cls: 'warn' }
          : { en: `Ability-to-pay principle: basic subsistence (first 4 units) pays 0%, middle income pays a modest share, and only upper slices pay higher tiers — keeping effective rate at ${r.effectivePct}%.`, hi: `भुगतान-क्षमता सिद्धांत: मूल जीवन-निर्वाह स्तर (प्रथम 4 इकाइयाँ) पर 0% कर है और केवल ऊपरी स्तरों पर दर बढ़ती है — प्रभावी दर ${r.effectivePct}% रहती है।`, cls: 'balanced' },
        { en: 'Paying honest income tax is both a legal duty and a civic contribution to shared national infrastructure.', hi: 'ईमानदारी से आयकर चुकाना कानूनी कर्तव्य होने के साथ-साथ साझा राष्ट्रीय अवसंरचना में नागरिक योगदान भी है।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Keep income at 4 units or less under Progressive Slabs and verify the effective tax is 0%. Why does every progressive tax keep a basic exempt slice?', 'प्रगतिशील स्तरों में आय 4 या उससे कम रखकर देखें कि प्रभावी कर 0% रहता है। मूल कर-मुक्त सीमा क्यों रखी जाती है?'),
    b('Slide income from 6 to 20 units: notice only the extra upper units enter the higher amber tier, never pulling down take-home income.', 'आय 6 से 20 इकाइयों तक बढ़ाएँ: केवल अतिरिक्त ऊपरी भाग ही उच्च स्तर में जाता है, कर-पश्चात आय कभी घटती नहीं।'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('In a progressive tax-slab system, if your income crosses from the exempt slice into the middle slice, which part of your income is taxed?', 'प्रगतिशील कर-स्तर प्रणाली में जब आय कर-मुक्त सीमा पार करके मध्यम स्तर में आती है, तो किस भाग पर कर लगता है?'),
    options: [opt('top', 'Only the portion above the exempt threshold', 'केवल कर-मुक्त सीमा से ऊपर का अतिरिक्त भाग'), opt('all', 'The basic exempt slice is punished too, making you poorer overall', 'मूल कर-मुक्त भाग भी दंडित होकर कुल आय घटा देता है')],
    run: (S) => { S.incomeUnits = 6; S.progressivity = 1; return F.taxConceptAlloc({ incomeUnits: 6, progressivity: 1 }).takeHome > 4 ? 'top' : 'all'; },
    explain: () => b('Marginal slabs apply only to the extra income above each threshold, so earning more always leaves higher take-home pay.', 'सीमांत कर-स्तर केवल सीमा से ऊपर की अतिरिक्त आय पर लागू होते हैं, इसलिए अधिक कमाने पर कुल शेष आय हमेशा बढ़ती है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Why are citizens required to pay personal income tax?', 'नागरिकों के लिए व्यक्तिगत आयकर चुकाना क्यों आवश्यक है?'),
    correct: 'pub',
    options: [
      opt('pub', 'To pool fair contributions based on ability to pay so government can fund public schools, roads, hospitals, and national security.', 'भुगतान-क्षमता के अनुसार साझा योगदान से विद्यालय, सड़कें, अस्पताल व सुरक्षा जैसी सार्वजनिक सेवाएँ चलाने के लिए।'),
      opt('burn', 'To destroy currency notes.', 'मुद्रा नोट नष्ट करने के लिए।', b('Taxes circulate directly back into public services and welfare.', 'कर सीधे सार्वजनिक सेवाओं और कल्याण कार्यों में उपयोग होते हैं।')),
    ],
    explain: b('Taxes finance the public goods and infrastructure that markets alone cannot equitably supply.', 'कर उन सार्वजनिक वस्तुओं और अवसंरचना का वित्तपोषण करते हैं जिन्हें बाज़ार अकेले समान रूप से नहीं दे सकते।'),
    hint: b('Look at the green Public Services box on the right.', 'दाईं ओर हरा सार्वजनिक सेवा बॉक्स देखें।'),
  }],
  reflect: b('List three public facilities near your home that could not run well without tax funding.', 'अपने घर के पास तीन ऐसी सार्वजनिक सुविधाएँ लिखें जो कर-वित्तपोषण के बिना नहीं चल सकतीं।'),
};
