// Political Science lab specs: T06 (L1-L4), T07 (L1, L3, L4)
import * as I from '../../engines/domain/institutions.js';
import * as E from '../../engines/domain/election.js';
import * as S_ from '../../engines/domain/society.js';
import { worldMapSvg, forceGraphSvg } from '../../engines/viz.js';
import { esc, fmt } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });

// ------------------------------------------------------------------ T06.L1 Democracy concept map & case assessor
const DEMO_CASES = [
  { id: 'custom', en: 'Custom test case', hi: 'कस्टम परीक्षण केस' },
  { id: 'full', en: 'Case A: Fair elections + Free press', hi: 'केस A: निष्पक्ष चुनाव + स्वतंत्र मीडिया', freeVote: true, multipleParties: true, freeMedia: true, equalLaw: true },
  { id: 'oneparty', en: 'Case B: Single-party rule', hi: 'केस B: एक-दलीय शासन', freeVote: true, multipleParties: false, freeMedia: false, equalLaw: false },
  { id: 'pressban', en: 'Case C: Elections held, press silenced', hi: 'केस C: चुनाव पर मीडिया पर रोक', freeVote: true, multipleParties: true, freeMedia: false, equalLaw: true },
];
export const democracyMap = {
  id: 'T06.L1',
  objective: b('Test whether a fictional polity meets all four core criteria of democracy: free elections, multi-party choice, free media, and equal rule of law.', 'परखें कि कोई काल्पनिक राज्यतंत्र लोकतंत्र के चारों मुख्य मानदंड पूरे करता है या नहीं: स्वतंत्र चुनाव, बहु-दलीय विकल्प, स्वतंत्र मीडिया और कानून के समक्ष समानता।'),
  note: { kind: 'fictional', en: 'Fictional test cases illustrating the four minimal criteria of modern constitutional democracy.', hi: 'आधुनिक संवैधानिक लोकतंत्र के चार न्यूनतम मानदंडों को दर्शाने वाले काल्पनिक परीक्षण केस।' },
  init: () => ({ preset: 'full', freeVote: true, multipleParties: true, freeMedia: true, equalLaw: true }),
  controls: [
    { id: 'preset', type: 'chips', label: b('Load case', 'केस चुनें'), options: DEMO_CASES.map((c) => opt(c.id, c.en, c.hi)) },
    { id: 'freeVote', type: 'toggle', label: b('Universal free & fair vote', 'सार्वभौमिक स्वतंत्र व निष्पक्ष मतदान') },
    { id: 'multipleParties', type: 'toggle', label: b('Real choice of opposition parties', 'विपक्षी दलों का वास्तविक विकल्प') },
    { id: 'freeMedia', type: 'toggle', label: b('Independent courts & free media', 'स्वतंत्र न्यायालय व मुक्त मीडिया') },
    { id: 'equalLaw', type: 'toggle', label: b('Equal rule of law for rulers too', 'शासकों पर भी समान कानून') },
  ],
  view(S) {
    const p = DEMO_CASES.find((c) => c.id === S.preset);
    const st = S.preset !== 'custom' && p ? { freeVote: p.freeVote, multipleParties: p.multipleParties, freeMedia: p.freeMedia, equalLaw: p.equalLaw } : S;
    const res = S_.assessDemocracyCase(st);
    const nodes = [
      { id: 'dem', fx: 320, fy: 130, rw: 120, fill: res.score === 4 ? '#dcfce7' : res.score >= 2 ? '#fef3c7' : '#fee2e2', stroke: res.score === 4 ? '#15803d' : res.score >= 2 ? '#b45309' : '#b91c1c', label: P(`Score ${res.score}/4`, `अंक ${res.score}/4`) },
      { id: 'v', fx: 130, fy: 60, rw: 128, fill: st.freeVote ? '#dbeafe' : '#f1f5f9', stroke: st.freeVote ? '#0369a1' : '#94a3b8', label: P('Free Vote', 'स्वतंत्र मत') },
      { id: 'm', fx: 510, fy: 60, rw: 128, fill: st.multipleParties ? '#dbeafe' : '#f1f5f9', stroke: st.multipleParties ? '#0369a1' : '#94a3b8', label: P('Multi-Party', 'बहु-दल') },
      { id: 'p', fx: 130, fy: 200, rw: 128, fill: st.freeMedia ? '#dbeafe' : '#f1f5f9', stroke: st.freeMedia ? '#0369a1' : '#94a3b8', label: P('Free Media', 'मुक्त मीडिया') },
      { id: 'l', fx: 510, fy: 200, rw: 128, fill: st.equalLaw ? '#dbeafe' : '#f1f5f9', stroke: st.equalLaw ? '#0369a1' : '#94a3b8', label: P('Rule of Law', 'विधि-शासन') },
    ];
    const links = [
      { source: 'v', target: 'dem', label: st.freeVote ? 'OK' : 'X' },
      { source: 'm', target: 'dem', label: st.multipleParties ? 'OK' : 'X' },
      { source: 'p', target: 'dem', label: st.freeMedia ? 'OK' : 'X' },
      { source: 'l', target: 'dem', label: st.equalLaw ? 'OK' : 'X' },
    ];
    const svg = forceGraphSvg({ w: 640, h: 260, nodes, links, activeId: 'dem', aria: P('Democracy pillars concept graph', 'लोकतंत्र के स्तंभ अवधारणा ग्राफ़') });
    const cls = res.verdict === 'democratic' ? 'balanced' : res.verdict === 'flawed' ? 'warn' : 'warn';
    return {
      svg,
      aria: `Democracy score ${res.score} of 4: ${res.verdict}`,
      lines: [
        { en: `Pillars satisfied: ${res.score} of 4 (${res.verdict === 'democratic' ? 'Full Constitutional Democracy' : res.verdict === 'flawed' ? 'Electoral / Flawed System — missing safeguards' : 'Non-Democratic Regime'}).`, hi: `पूर्ण स्तंभ: 4 में से ${res.score} (${res.verdict === 'democratic' ? 'पूर्ण संवैधानिक लोकतंत्र' : res.verdict === 'flawed' ? 'त्रुटिपूर्ण प्रणाली — सुरक्षा-कवच अधूरे' : 'अलोकतांत्रिक शासन'})।`, cls },
        { en: 'Even if voting takes place, silencing journalists or banning opposition parties breaks democratic accountability.', hi: 'भले ही मतदान हो, पर पत्रकारों को चुप कराना या विपक्षी दलों पर रोक लगाना लोकतांत्रिक जवाबदेही तोड़ देता है।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Keep Free Vote ON and turn Free Media OFF. Why is voting alone not enough for a full democracy?', 'स्वतंत्र मत चालू रखें और मुक्त मीडिया बंद करें। पूर्ण लोकतंत्र के लिए केवल मतदान ही क्यों पर्याप्त नहीं?'),
    b('Compare Case B and Case C to see how missing one pillar alters accountability.', 'एक स्तंभ कम होने से जवाबदेही कैसे बदलती है, यह देखने के लिए केस B और C की तुलना करें।'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('If a government holds elections every 5 years, bans opposition criticism in newspapers, and puts leaders above the law, how many of the 4 criteria are met?', 'यदि सरकार हर 5 वर्ष चुनाव कराए, पर अखबारों में विपक्ष की आलोचना रोके और नेताओं को कानून से ऊपर रखे, तो 4 में से कितने मानदंड पूरे होंगे?'),
    options: [opt('four', 'All 4 — elections alone are enough', 'सभी 4 — केवल चुनाव काफी हैं'), opt('one', 'Only 1 — flawed / non-democratic', 'केवल 1 — त्रुटिपूर्ण / अलोकतांत्रिक')],
    run: (S) => { S.preset = 'custom'; S.freeVote = true; S.multipleParties = false; S.freeMedia = false; S.equalLaw = false; return S_.assessDemocracyCase(S).score === 1 ? 'one' : 'four'; },
    explain: () => b('Only 1 of 4 criteria holds: without opposition choice, free press, and equal rule of law, voters cannot hold rulers accountable.', '4 में से केवल 1 मानदंड पूरा है: विपक्ष, स्वतंत्र मीडिया और समान कानून के बिना मतदाता शासकों को जवाबदेह नहीं ठहरा सकते।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Which feature ensures elected leaders cannot ignore citizens between elections?', 'कौन-सी विशेषता सुनिश्चित करती है कि चुने हुए नेता चुनावों के बीच नागरिकों की अनदेखी न कर सकें?'),
    correct: 'law',
    options: [
      opt('law', 'Independent courts, free media, and rule of law', 'स्वतंत्र न्यायालय, मुक्त मीडिया और विधि का शासन'),
      opt('onlyvote', 'Voting once every decade without free press', 'स्वतंत्र मीडिया के बिना हर दशक में एक बार मतदान', b('Voting without information or legal checks leaves citizens powerless between elections.', 'सूचना और कानूनी नियंत्रण के बिना नागरिक चुनावों के बीच शक्तिहीन रहते हैं।')),
    ],
    explain: b('Rule of law and free media protect citizen rights every day, not just on polling day.', 'विधि का शासन और स्वतंत्र मीडिया केवल मतदान के दिन नहीं बल्कि हर दिन नागरिकों के अधिकारों की रक्षा करते हैं।'),
    hint: b('Look at the bottom two nodes in the pillar graph.', 'स्तंभ ग्राफ़ के निचले दो नोड देखें।'),
  }],
  reflect: b('Which of the four democratic pillars feels most vital in a school student council? Explain why.', 'विद्यालय की छात्र-परिषद में लोकतंत्र के चारों स्तंभों में से कौन-सा सबसे आवश्यक लगता है? कारण बताएँ।'),
};

// ------------------------------------------------------------------ T06.L2 Early Indian Democratic Traditions Gallery
const TRADITIONS = [
  { id: 'sabha', year: '~1200–600 BCE', en: 'Vedic Sabha & Samiti', hi: 'वैदिक सभा और समिति', place: 'Indus-Ganga Plains', src: 'Rigveda & Atharvaveda references', descEn: 'Elders and general assemblies deliberated on public affairs, law, and selecting or advising the rajan.', descHi: 'जन-मामलों, न्याय और राजा के चयन व परामर्श पर वरिष्ठों की सभा और जन-समिति विचार-विमर्श करती थी।' },
  { id: 'vajji', year: '~6th Century BCE', en: 'Vajji Sangha / Gana (Vaishali)', hi: 'वज्जि संघ / गण (वैशाली)', place: 'Vaishali (Bihar)', src: 'Buddhist Mahaparinibbana Sutta', descEn: 'A confederacy governed by an assembly of thousands of rajas who met in the Santhagara hall to decide by discussion and consensus or vote.', descHi: 'संथागार में एकत्र हजारों राजाओं की सभा द्वारा चर्चा, सहमति या मत से निर्णय लेने वाला प्राचीन गणसंघ।' },
  { id: 'uttara', year: 'c. 920 CE', en: 'Uttaramerur Kudavolai Inscription', hi: 'उत्तरमेरूर कुडवोलाई शिलालेख', place: 'Kanchipuram (Tamil Nadu)', src: 'Vaikuntha Perumal Temple Stone Inscriptions (Chola period)', descEn: 'Carved rules for choosing village sabha committees via palm-leaf lots drawn from a pot, with age, property, and audit qualifications.', descHi: 'ग्राम-सभा समितियों के चुनाव हेतु घड़े से ताड़पत्र की पर्ची (कुडवोलाई) निकालने, योग्यता और लेखा-परीक्षा के शिलालेखित नियम।' },
];
export const earlyTraditions = {
  id: 'T06.L2',
  objective: b('Examine documented early Indian deliberative and participatory institutions (Sabha-Samiti, Vajji Gana-Sangha, and Uttaramerur village sabha).', 'भारत की प्रारंभिक विमर्शकारी व सहभागी संस्थाओं (सभा-समिति, वज्जि गणसंघ और उत्तरमेरूर ग्राम-सभा) के प्रमाणों का अध्ययन करें।'),
  note: { kind: 'documented', en: 'Based on attested textual and epigraphic records (Vedic texts, Buddhist canon, and the c. 920 CE Chola temple inscription at Uttaramerur).', hi: 'प्रमाणित साहित्यिक व अभिलेखीय स्रोतों (वैदिक ग्रंथ, बौद्ध ग्रंथ और लगभग 920 ई. के चोल उत्तरमेरूर शिलालेख) पर आधारित।' },
  init: () => ({ trad: 'uttara', step: 2 }),
  controls: [
    { id: 'trad', type: 'chips', label: b('Select tradition', 'परंपरा चुनें'), options: TRADITIONS.map((tr) => opt(tr.id, tr.en, tr.hi)) },
    { id: 'step', type: 'slider', label: b('Inspect rule stage (1–3)', 'नियम चरण देखें (1–3)'), min: 1, max: 3, step: 1 },
  ],
  view(S) {
    const tr = TRADITIONS.find((x) => x.id === S.trad) || TRADITIONS[2];
    const boxes = S.trad === 'uttara'
      ? [P('1. Eligibility & Audit Check', '1. योग्यता व हिसाब जांच'), P('2. Kudavolai Pot Draw', '2. कुडवोलाई घड़े से पर्ची'), P('3. 1-Year Rotating Term', '3. 1-वर्षीय क्रमिक कार्यकाल')]
      : S.trad === 'vajji'
      ? [P('1. Santhagara Assembly', '1. संथागार सभा में बैठक'), P('2. Debate & Consensus', '2. खुला विमर्श व सहमति'), P('3. Shalaka Ballot Sticks', '3. शलाका (मत-दंड) से मतदान')]
      : [P('1. Samiti (General Folk)', '1. समिति (जन-सभा)'), P('2. Sabha (Council of Elders)', '2. सभा (वरिष्ठ परिषद)'), P('3. Advisory Rajadharma', '3. परामर्श व राजधर्म')];
    const g = boxes.map((txt, i) => {
      const act = i + 1 <= S.step;
      const x = 24 + i * 204;
      return `<rect x="${x}" y="84" width="184" height="86" rx="10" fill="${act ? '#1d4ed8' : '#e2e8f0'}" fill-opacity="${act ? '.14' : '.7'}" stroke="${act ? '#1d4ed8' : '#94a3b8'}" stroke-width="${act ? '2.5' : '1.5'}"/>`
        + `<text class="txt b" x="${x + 92}" y="122" text-anchor="middle">${esc(txt.split(' / ')[0])}</text>`
        + (i < 2 ? `<line x1="${x + 186}" y1="127" x2="${x + 202}" y2="127" stroke="#64748b" stroke-width="2"/>` : '');
    }).join('');
    const svg = `<svg viewBox="0 0 640 210" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">`
      + `<rect x="16" y="14" width="608" height="48" rx="8" fill="#fef3c7" stroke="#b45309"/>`
      + `<text class="txt b" x="30" y="36">${esc(P(tr.en, tr.hi))} · ${esc(tr.year)}</text>`
      + `<text class="txt sm mut" x="30" y="54">${esc(tr.place)} · ${esc(tr.src)}</text>${g}</svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t06-democracy.jpg',
        en: S.trad === 'uttara'
          ? 'Chola stone mandapa inscriptions and Uttaramerur Kudavolai palm-leaf ballot pot (c. 920 CE).'
          : 'Early Indian deliberative stone mandapa and community assembly tradition.',
        hi: S.trad === 'uttara'
          ? 'चोल मंडप शिलालेख और ताड़पत्र पर्चियों वाला उत्तरमेरूर कुडवोलाई घड़ा (ल. 920 ई.)।'
          : 'भारत की प्रारंभिक विमर्शकारी मंडप व सामुदायिक सभा परंपरा।',
      },
      svg,
      aria: `${tr.en} (${tr.year}) at ${tr.place}`,
      lines: [
        { en: `${tr.en} (${tr.year}, ${tr.place}): ${tr.descEn}`, hi: `${tr.hi} (${tr.year}): ${tr.descHi}` },
        { en: `Important distinction: unlike modern universal adult franchise, ancient assemblies excluded enslaved persons, non-citizens, or (at Uttaramerur) non-landholders — showing both early roots and historical limits.`, hi: `महत्वपूर्ण भेद: आधुनिक सार्वभौमिक वयस्क मताधिकार के विपरीत, प्राचीन सभाओं में सभी वर्ग शामिल नहीं थे — यह प्राचीन जड़ों के साथ-साथ उनकी ऐतिहासिक सीमाएँ भी दिखाता है।`, cls: 'note' },
      ],
    };
  },
  discover: [
    b('Inspect Uttaramerur and compare its committee selection rules with Vajji’s assembly.', 'उत्तरमेरूर के समिति-चयन नियमों की तुलना वज्जि की सभा से करें।'),
    b('Why did Uttaramerur require outgoing members to clear past accounts before standing again?', 'उत्तरमेरूर में पुनः पात्र होने से पहले पिछले खातों की जांच क्यों अनिवार्य थी?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('Which ancient Tamil Nadu inscription records detailed rules for electing village committee members by drawing lots from a pot (Kudavolai)?', 'तमिलनाडु का कौन-सा प्राचीन शिलालेख घड़े से पर्चियाँ (कुडवोलाई) निकालकर ग्राम समिति चुनने के नियम दर्ज करता है?'),
    options: [opt('uttara', 'Uttaramerur inscription (~920 CE)', 'उत्तरमेरूर शिलालेख (~920 ई.)'), opt('hathigumpha', 'Hathigumpha inscription', 'हाथीगुम्फा शिलालेख')],
    run: (S) => { S.trad = 'uttara'; S.step = 3; return 'uttara'; },
    explain: () => b('The c. 920 CE Chola-period Uttaramerur inscriptions lay out Kudavolai eligibility, disqualification for unpaid dues, and rotation.', 'लगभग 920 ई. का चोल-कालीन उत्तरमेरूर शिलालेख कुडवोलाई पात्रता, बकाया होने पर अयोग्यता और कार्यकाल-चक्र बताता है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('How do ancient Indian ganasanghas differ from modern Indian constitutional democracy?', 'प्राचीन भारतीय गणसंघ आधुनिक भारतीय संवैधानिक लोकतंत्र से किस प्रकार भिन्न थे?'),
    correct: 'univ',
    options: [
      opt('univ', 'Modern democracy grants equal universal adult franchise (18+) regardless of property, caste, or gender.', 'आधुनिक लोकतंत्र संपत्ति, जाति या लिंग से परे सभी वयस्कों (18+) को समान मताधिकार देता है।'),
      opt('none', 'Ancient republics had no rules or assemblies at all.', 'प्राचीन गणराज्यों में कोई नियम या सभा नहीं थी।', b('Texts and inscriptions clearly show rules and assemblies in Vaishali and Uttaramerur.', 'ग्रंथों व शिलालेखों में वैशाली व उत्तरमेरूर की सभाओं के स्पष्ट नियम मिलते हैं।')),
    ],
    explain: b('Ancient Indian assemblies pioneered collective deliberation, while universal equal citizenship is a modern constitutional achievement.', 'प्राचीन भारतीय सभाओं ने सामूहिक विमर्श का मार्ग प्रशस्त किया, जबकि सार्वभौमिक समान नागरिकता आधुनिक संवैधानिक उपलब्धि है।'),
    hint: b('Read the comparison note below the stages.', 'चरणों के नीचे तुलना टिप्पणी देखें।'),
  }],
  reflect: b('Why is rotating office-holders and auditing accounts useful even in a school club today?', 'आज किसी विद्यालय क्लब में भी पदाधिकारियों का क्रमिक परिवर्तन और हिसाब-जांच क्यों उपयोगी है?'),
};

// ------------------------------------------------------------------ T06.L4 Country Comparison
const COUNTRIES = [
  { id: 'in', en: 'India', hi: 'भारत', iso: '356', lon: 79, lat: 22, sys: 'Parliamentary Republic', sysHi: 'संसदीय गणतंत्र', hos: 'President (indirect)', hog: 'Prime Minister (majority in Lok Sabha)', fed: 'Federal (Union + States)' },
  { id: 'us', en: 'USA', hi: 'अमेरिका (USA)', iso: '840', lon: -98, lat: 39, sys: 'Presidential Republic', sysHi: 'अध्यक्षीय गणतंत्र', hos: 'President (direct/Electoral College)', hog: 'President (same person, fixed 4-yr term)', fed: 'Federal (50 States)' },
  { id: 'fr', en: 'France', hi: 'फ़्रांस', iso: '250', lon: 2, lat: 47, sys: 'Semi-Presidential Republic', sysHi: 'अर्ध-अध्यक्षीय गणतंत्र', hos: 'President (direct 5-yr vote)', hog: 'Prime Minister (needs Assembly confidence)', fed: 'Unitary with regions' },
  { id: 'ca', en: 'Canada', hi: 'कनाडा', iso: '124', lon: -106, lat: 56, sys: 'Parliamentary Constitutional Monarchy', sysHi: 'संसदीय संवैधानिक राजतंत्र', hos: 'Monarch / Governor-General', hog: 'Prime Minister (Commons majority)', fed: 'Federal (Provinces)' },
  { id: 'ru', en: 'Russia', hi: 'रूस', iso: '643', lon: 95, lat: 60, sys: 'Semi-Presidential (concentrated executive)', sysHi: 'अर्ध-अध्यक्षीय (केंद्रित कार्यपालिका)', hos: 'President (dominant executive role)', hog: 'Prime Minister (appointed with Duma)', fed: 'Federal (asymmetric)' },
];
export const countryCompare = {
  id: 'T06.L4',
  objective: b('Locate India, USA, France, Canada, and Russia on the world map and compare how their executives, legislatures, and heads of state are structured.', 'विश्व मानचित्र पर भारत, अमेरिका, फ़्रांस, कनाडा और रूस को पहचानें और उनकी कार्यपालिका, विधायिका तथा राष्ट्राध्यक्ष संरचना की तुलना करें।'),
  note: { kind: 'documented', en: 'Constitutional structures as documented (2026 textbook framing). Actual democratic practice depends on rights, courts, and free elections.', hi: 'संवैधानिक संरचनाओं का दस्तावेज़ी तुलना-चित्र। वास्तविक लोकतांत्रिक अभ्यास अधिकारों, न्यायालयों और स्वतंत्र चुनावों पर निर्भर करता है।' },
  init: () => ({ country: 'in' }),
  controls: [
    { id: 'country', type: 'chips', label: b('Country', 'देश'), options: COUNTRIES.map((c) => opt(c.id, c.en, c.hi)) },
  ],
  view(S) {
    const c = COUNTRIES.find((x) => x.id === S.country) || COUNTRIES[0];
    const markers = COUNTRIES.map((x) => ({
      lon: x.lon, lat: x.lat, label: P(x.en, x.hi),
      r: x.id === c.id ? 7 : 4, fill: x.id === c.id ? '#dc2626' : '#0369a1',
    }));
    const svg = worldMapSvg({
      markers, countryFills: { [c.iso]: '#fca5a5' },
      aria: P('World map locating five comparative constitutional systems', 'पाँच संवैधानिक प्रणालियों वाला विश्व मानचित्र'),
    });
    return {
      svg,
      aria: `${c.en}: ${c.sys}. Head of state: ${c.hos}; Head of government: ${c.hog}`,
      lines: [
        { en: `${c.en} — ${c.sys} (${c.fed}).`, hi: `${c.hi} — ${c.sysHi}।`, cls: 'balanced' },
        { en: `Head of State: ${c.hos} | Head of Government: ${c.hog}.`, hi: `राष्ट्राध्यक्ष: ${c.hos} | शासनाध्यक्ष: ${c.hog}।`, cls: 'note' },
      ],
    };
  },
  discover: [
    b('Compare India and Canada: both are parliamentary democracies, yet one is a republic and one is a constitutional monarchy.', 'भारत और कनाडा की तुलना करें: दोनों संसदीय हैं, पर एक गणतंत्र है और एक संवैधानिक राजतंत्र।'),
    b('Compare USA and France: in France, a Prime Minister shares executive roles with an elected President.', 'अमेरिका और फ़्रांस की तुलना करें: फ़्रांस में निर्वाचित राष्ट्रपति के साथ एक प्रधानमंत्री भी होता है।'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('In which of these countries are the Head of State and Head of Government the SAME person serving a fixed 4-year term?', 'इनमें से किस देश में राष्ट्राध्यक्ष और शासनाध्यक्ष एक ही व्यक्ति होता है जिसका 4-वर्षीय निश्चित कार्यकाल होता है?'),
    options: [opt('us', 'USA', 'अमेरिका'), opt('in', 'India', 'भारत')],
    run: (S) => { S.country = 'us'; return 'us'; },
    explain: () => b('In the USA’s presidential system, the President is both Head of State and Head of Government; in India the President and Prime Minister hold separate offices.', 'अमेरिका की अध्यक्षीय प्रणाली में राष्ट्रपति ही राष्ट्राध्यक्ष और शासनाध्यक्ष दोनों होता है; भारत में राष्ट्रपति और प्रधानमंत्री अलग पद हैं।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('India and Canada share a parliamentary system because…', 'भारत और कनाडा दोनों में संसदीय प्रणाली है क्योंकि…'),
    correct: 'leg',
    options: [
      opt('leg', 'The Prime Minister and Cabinet must keep the confidence of the lower house of Parliament.', 'प्रधानमंत्री और मंत्रिमंडल को संसद के निचले सदन का विश्वास बनाए रखना होता है।'),
      opt('fixed', 'No election can be held early for any reason.', 'किसी भी कारण से समय-पूर्व चुनाव नहीं हो सकता।', b('Parliamentary houses can be dissolved early if no majority exists.', 'बहुमत न रहने पर संसदीय सदन समय से पहले भंग हो सकता है।')),
    ],
    explain: b('Executive accountability to an elected Parliament is the defining hallmark of parliamentary governance.', 'निर्वाचित संसद के प्रति कार्यपालिका की जवाबदेही संसदीय शासन की मुख्य पहचान है।'),
    hint: b('Look at Head of Government across India and Canada.', 'भारत और कनाडा के शासनाध्यक्ष देखें।'),
  }],
  reflect: b('Why did India choose a parliamentary republic with an indirectly elected President rather than a hereditary monarch?', 'भारत ने वंशानुगत सम्राट के बजाय अप्रत्यक्ष रूप से निर्वाचित राष्ट्रपति वाला संसदीय गणतंत्र क्यों चुना?'),
};

// ------------------------------------------------------------------ T07.L1 Election Process Timeline & ECI Workflow
const ECI_STAGES = [
  { id: 1, en: '1. Delimitation & Voter Roll Update', hi: '1. परिसीमन व मतदाता सूची', law: 'RPA 1950 & 1951', descEn: 'ECI and enumerators revise electoral rolls so every eligible citizen 18+ can register without bias.', descHi: 'चुनाव आयोग व प्रगणक मतदाता सूची अद्यतन करते हैं ताकि 18+ हर पात्र नागरिक का नाम जुड़ सके।' },
  { id: 2, en: '2. Notification & Model Code of Conduct', hi: '2. अधिसूचना व आचार संहिता', law: 'Article 324 & MCC', descEn: 'Dates announced; Model Code bars rulers from using government machinery or freebies to sway voters.', descHi: 'तिथियाँ घोषित होते ही आचार संहिता लागू होती है ताकि सत्ताधारी सरकारी संसाधनों का दुरुपयोग न कर सकें।' },
  { id: 3, en: '3. Nominations, Scrutiny & Campaigning', hi: '3. नामांकन, जांच व प्रचार', law: 'RPA 1951 (Sec 33–36)', descEn: 'Candidates file affidavits disclosing assets & criminal cases; 14-day public campaign ends 48h before poll.', descHi: 'उम्मीदवार संपत्ति व आपराधिक मामलों का शपथपत्र देते हैं; मतदान से 48 घंटे पहले प्रचार रुकता है।' },
  { id: 4, en: '4. Polling, EVM/VVPAT & Counting', hi: '4. मतदान, ईवीएम/वीवीपैट व मतगणना', law: 'Article 326 (Universal Suffrage)', descEn: 'Secret ballot at accessible booths; VVPAT paper slips verified before Returning Officer certifies results.', descHi: 'सुलभ बूथों पर गुप्त मतदान; वीवीपैट पर्ची मिलान के बाद रिटर्निंग अधिकारी परिणाम घोषित करते हैं।' },
];
export const electionTimeline = {
  id: 'T07.L1',
  objective: b('Trace the Indian election workflow led by the Election Commission of India (ECI) under Article 324 and the Representation of the People Acts (1950, 1951).', 'अनुच्छेद 324 और जनप्रतिनिधित्व अधिनियम (1950, 1951) के अंतर्गत भारत निर्वाचन आयोग (ECI) की चुनाव प्रक्रिया का चरणबद्ध अध्ययन करें।'),
  note: { kind: 'documented', en: 'Grounded in Constitutional Articles 324–329 and the Representation of the People Acts of 1950 & 1951.', hi: 'संविधान के अनुच्छेद 324–329 तथा जनप्रतिनिधित्व अधिनियम 1950 व 1951 पर आधारित।' },
  init: () => ({ stage: 2, independentEci: true }),
  controls: [
    { id: 'stage', type: 'slider', label: b('Election stage (1–4)', 'चुनाव चरण (1–4)'), min: 1, max: 4, step: 1 },
    { id: 'independentEci', type: 'toggle', label: b('Independent ECI & Model Code enforced', 'स्वतंत्र ECI व आचार संहिता लागू') },
  ],
  view(S) {
    const st = ECI_STAGES[S.stage - 1] || ECI_STAGES[0];
    const g = ECI_STAGES.map((x, i) => {
      const y = 18 + i * 52, active = x.id === S.stage;
      const fill = !S.independentEci && active ? '#b91c1c' : active ? '#1d4ed8' : '#f1f5f9';
      return `<rect x="24" y="${y}" width="592" height="42" rx="8" fill="${fill}" fill-opacity="${active ? '.18' : '1'}" stroke="${active ? (S.independentEci ? '#1d4ed8' : '#b91c1c') : '#cbd5e1'}" stroke-width="${active ? '2.5' : '1.2'}"/>`
        + `<text class="txt b" x="40" y="${y + 20}">${esc(P(x.en, x.hi))}</text>`
        + `<text class="txt sm mut" x="598" y="${y + 22}" text-anchor="end">${esc(x.law)}</text>`;
    }).join('');
    const svg = `<svg viewBox="0 0 640 232" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t07-elections.jpg',
        en: 'Indian polling station courtyard: shaded voting booth, neat citizen queue and secret ballot box.',
        hi: 'भारतीय मतदान केंद्र: छायादार मतदान बूथ, शांतिपूर्ण नागरिक कतार व गुप्त मतपेटी।',
      },
      svg,
      aria: `Stage ${st.id}: ${st.en}. Independent ECI: ${S.independentEci}`,
      lines: [
        { en: `${st.en} (${st.law}): ${st.descEn}`, hi: `${st.hi}: ${st.descHi}`, cls: S.independentEci ? 'balanced' : 'warn' },
        { en: S.independentEci ? 'Because the ECI is constitutionally autonomous, the ruling party and opposition compete on equal legal terms.' : 'Warning: if election supervision answers to the ruling cabinet, voter rolls, booth security, and code enforcement lose public trust.', hi: S.independentEci ? 'ECI की संवैधानिक स्वायत्तता के कारण सत्तापक्ष व विपक्ष समान कानूनी शर्तों पर चुनाव लड़ते हैं।' : 'चेतावनी: यदि चुनाव तंत्र सत्ताधारी मंत्रिमंडल के अधीन हो, तो मतदाता सूची और निष्पक्षता पर विश्वास टूट जाता है।', cls: S.independentEci ? 'note' : 'warn' },
      ],
    };
  },
  discover: [
    b('Walk through stages 1 to 4 and note which Representation of the People Act governs voter rolls (1950) vs candidate conduct & counting (1951).', 'चरण 1 से 4 तक देखें कि मतदाता सूची (1950) बनाम उम्मीदवारी व मतगणना (1951) किस अधिनियम में आते हैं।'),
    b('Toggle Independent ECI off to examine why constitutional protection under Article 324 matters.', 'अनुच्छेद 324 की संवैधानिक सुरक्षा का महत्व समझने के लिए स्वतंत्र ECI बंद करके देखें।'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('Once the Model Code of Conduct comes into force on poll announcement, may a Chief Minister announce brand-new state schemes to woo voters?', 'चुनाव घोषणा के साथ आचार संहिता लागू होने पर क्या मुख्यमंत्री मतदाताओं को लुभाने के लिए नई सरकारी योजनाएँ घोषित कर सकते हैं?'),
    options: [opt('no', 'No — the Model Code bars new policy announcements', 'नहीं — आचार संहिता नई योजनाओं पर रोक लगाती है'), opt('yes', 'Yes — ruling leaders face no restrictions', 'हाँ — सत्ताधारी नेताओं पर कोई रोक नहीं')],
    run: (S) => { S.stage = 2; S.independentEci = true; return 'no'; },
    explain: () => b('The Model Code of Conduct stops incumbent governments from using public funds or new announcements for electoral advantage.', 'आदर्श आचार संहिता सत्तासीन सरकारों को चुनावी लाभ हेतु सरकारी धन या नई घोषणाओं के उपयोग से रोकती है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Which Article of India’s Constitution grants universal adult suffrage (every citizen 18+ gets one vote)?', 'भारतीय संविधान का कौन-सा अनुच्छेद सार्वभौमिक वयस्क मताधिकार (18+ हर नागरिक को एक मत) प्रदान करता है?'),
    correct: '326',
    options: [
      opt('326', 'Article 326', 'अनुच्छेद 326'),
      opt('1950', 'Only local municipal by-laws', 'केवल स्थानीय नगरपालिका उप-नियम', b('Universal adult franchise is guaranteed directly by Article 326 of the Constitution.', 'सार्वभौमिक वयस्क मताधिकार सीधे संविधान के अनुच्छेद 326 द्वारा गारंटीकृत है।')),
    ],
    explain: b('Article 324 establishes the ECI; Article 326 guarantees adult suffrage regardless of caste, wealth, or gender.', 'अनुच्छेद 324 चुनाव आयोग की स्थापना करता है; अनुच्छेद 326 बिना किसी भेदभाव के वयस्क मताधिकार की गारंटी देता है।'),
    hint: b('Check Stage 4 in the workflow.', 'प्रक्रिया में चरण 4 देखें।'),
  }],
  reflect: b('Why is candidate disclosure of assets and criminal cases before voting helpful for citizens?', 'मतदान से पहले उम्मीदवारों द्वारा संपत्ति और आपराधिक मामलों की घोषणा नागरिकों के लिए क्यों उपयोगी है?'),
};

// ------------------------------------------------------------------ T07.L3 Delimitation & Electoral Roll Enumerator
export const delimitationLab = {
  id: 'T07.L3',
  objective: b('Explore how drawing constituency boundaries (delimitation) shapes seat outcomes from identical block votes, and check voter-roll eligibility rules.', 'देखें कि एक जैसे मतों के बावजूद निर्वाचन क्षेत्र की सीमाएँ (परिसीमन) बदलने से सीट परिणाम कैसे बदल जाते हैं, और मतदाता सूची पात्रता जाँचें।'),
  note: { kind: 'fictional', en: 'Toy 9-block city (460 Party A votes = 51.1%, 440 Party B votes = 48.9%). Real Indian delimitation uses non-partisan Commissions and strict population parity.', hi: 'काल्पनिक 9-ब्लॉक शहर (दल A = 460 मत / 51.1%, दल B = 440 मत / 48.9%)। भारत में वास्तविक परिसीमन गैर-पक्षपातपूर्ण आयोग और जनसंख्या समानता से होता है।' },
  init: () => ({ scheme: 'rows', voterAge: 19, resident: true }),
  controls: [
    { id: 'scheme', type: 'chips', label: b('Boundary map', 'सीमा मानचित्र'), options: [
      opt('rows', 'Fair Horizontal (300/dist)', 'समान क्षैतिज (300/सीट)'),
      opt('cols', 'Fair Vertical (300/dist)', 'समान ऊर्ध्वाधर (300/सीट)'),
      opt('packedA', 'Gerrymandered (Pack A)', 'पक्षपातपूर्ण (A को समेटना)'),
      opt('unequal', 'Unequal Pop (Malapportion)', 'असमान जनसंख्या'),
    ] },
    { id: 'voterAge', type: 'slider', label: b('Citizen age (enumerator check)', 'नागरिक आयु (प्रगणक जांच)'), min: 15, max: 25, step: 1 },
    { id: 'resident', type: 'toggle', label: b('Ordinarily resident in constituency', 'निर्वाचन क्षेत्र का सामान्य निवासी') },
  ],
  view(S) {
    const res = S_.delimitationOutcome(S.scheme);
    const roll = S_.checkVoterRoll({ age: S.voterAge, resident: S.resident, citizen: true });
    const distCol = ['#dbeafe', '#fef3c7', '#dcfce7'], distStroke = ['#1d4ed8', '#b45309', '#15803d'];
    let cells = '';
    res.districts.forEach((d, di) => {
      d.blocks.forEach((bid) => {
        const blk = S_.TOY_BLOCKS[bid], r = Math.floor(bid / 3), c = bid % 3;
        const x = 36 + c * 92, y = 22 + r * 66;
        cells += `<rect x="${x}" y="${y}" width="84" height="58" rx="6" fill="${distCol[di]}" stroke="${distStroke[di]}" stroke-width="2.5"/>`
          + `<text class="txt sm b" x="${x + 42}" y="${y + 22}" text-anchor="middle">D${di + 1} · ${blk.a > blk.b ? 'A' : 'B'}</text>`
          + `<text class="txt sm mut" x="${x + 42}" y="${y + 42}" text-anchor="middle">A:${blk.a} B:${blk.b}</text>`;
      });
    });
    const summary = res.districts.map((d, di) => {
      const y = 32 + di * 62;
      return `<rect x="336" y="${y}" width="284" height="48" rx="8" fill="${distCol[di]}" stroke="${distStroke[di]}" stroke-width="1.8"/>`
        + `<text class="txt b" x="350" y="${y + 22}">D${di + 1}: Pop ${d.pop} → Winner: ${d.winner}</text>`
        + `<text class="txt sm mut" x="350" y="${y + 39}">A ${d.votesA} vs B ${d.votesB}</text>`;
    }).join('');
    const svg = `<svg viewBox="0 0 640 232" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${cells}${summary}</svg>`;
    return {
      svg,
      aria: `Delimitation ${S.scheme}: Seats A ${res.seatsA}, B ${res.seatsB}. Population spread ${res.popSpread}.`,
      lines: [
        { en: `Result: Party A (51.1% votes) wins ${res.seatsA} seats; Party B (48.9%) wins ${res.seatsB} seats. Population gap across constituencies: ${res.popSpread}.`, hi: `परिणाम: दल A (51.1% मत) को ${res.seatsA} सीटें; दल B (48.9% मत) को ${res.seatsB} सीटें। जनसंख्या अंतर: ${res.popSpread}।`, cls: res.mismatch || res.popSpread > 0 ? 'warn' : 'balanced' },
        { en: `Enumerator check (Age ${S.voterAge}, Resident ${S.resident ? 'Yes' : 'No'}): ${roll.eligible ? 'ELIGIBLE to be entered on electoral roll.' : `NOT eligible (${roll.reason}).`}`, hi: `प्रगणक जांच (आयु ${S.voterAge}, निवासी ${S.resident ? 'हाँ' : 'नहीं'}): ${roll.eligible ? 'मतदाता सूची में नाम जोड़ने योग्य।' : 'अपत्र (' + roll.reason + ')।'}`, cls: roll.eligible ? 'note' : 'warn' },
      ],
    };
  },
  discover: [
    b('Compare "Fair Horizontal" and "Gerrymandered (Pack A)": notice the votes inside every block never change, yet the seat winner flips!', '“समान क्षैतिज” और “पक्षपातपूर्ण (A को समेटना)” की तुलना करें: किसी ब्लॉक के मत नहीं बदले, फिर भी विजेता बदल गया!'),
    b('Try "Unequal Pop" and explain why India’s Delimitation Commission keeps constituency populations roughly equal.', '“असमान जनसंख्या” चुनें और समझें कि भारत का परिसीमन आयोग जनसंख्या लगभग समान क्यों रखता है।'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('When Party A’s voters are packed tightly into 1 constituency while Party B wins 2 narrower ones, who wins more seats despite fewer total votes?', 'जब दल A के मतदाताओं को 1 ही क्षेत्र में समेट दिया जाए और दल B अन्य 2 क्षेत्रों में थोड़ा आगे रहे, तो कम कुल मत के बावजूद कौन अधिक सीटें जीतता है?'),
    options: [opt('B', 'Party B wins 2–1', 'दल B 2–1 से जीतता है'), opt('A', 'Party A still wins 2–1', 'दल A अब भी 2–1 से जीतता है')],
    run: (S) => { S.scheme = 'packedA'; return S_.delimitationOutcome('packedA').mismatch ? 'B' : 'A'; },
    explain: () => b('Packing wastes Party A’s surplus votes in D1 (210–90), handing D2 and D3 to Party B — illustrating why independent Delimitation Commissions protect fairness.', 'पैकिंग से D1 में दल A के अतिरिक्त मत व्यर्थ हो जाते हैं और D2 व D3 दल B को मिल जाते हैं — यही स्वतंत्र परिसीमन आयोग की आवश्यकता सिद्ध करता है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('What is the main purpose of an independent Delimitation Commission in India?', 'भारत में स्वतंत्र परिसीमन आयोग का मुख्य उद्देश्य क्या है?'),
    correct: 'parity',
    options: [
      opt('parity', 'Ensure each constituency has roughly equal population and boundaries are not manipulated for party advantage.', 'सुनिश्चित करना कि प्रत्येक क्षेत्र की जनसंख्या लगभग समान रहे और सीमाओं से दलीय लाभ न उठाया जाए।'),
      opt('count', 'Count ballot papers on election night.', 'मतगणना की रात मतपत्र गिनना।', b('Returning Officers count votes; Delimitation draws boundaries periodically.', 'मतगणना रिटर्निंग अधिकारी करते हैं; परिसीमन समय-समय पर सीमाएँ तय करता है।')),
    ],
    explain: b('Equal constituency population preserves “one person, one vote, one value” and blocks partisan gerrymandering.', 'समान जनसंख्या वाले क्षेत्र “एक व्यक्ति, एक मत, एक मूल्य” की रक्षा करते हैं।'),
    hint: b('Look at the population spread readout between the modes.', 'मोड के बीच जनसंख्या अंतर देखें।'),
  }],
  reflect: b('Why must a voter roll enumerator visit households regularly to add new 18-year-olds and update addresses?', 'प्रगणक को घर-घर जाकर नए 18-वर्षीय मतदाताओं के नाम जोड़ना व पते अद्यतन करना क्यों आवश्यक है?'),
};

// ------------------------------------------------------------------ Existing T06.L3 & T07.L4
const ACT = { voters: b('Voters', 'मतदाता'), legislature: b('Legislature', 'विधायिका'), executive: b('Government', 'सरकार'), headOfState: b('Head of state', 'राष्ट्राध्यक्ष'), judiciary: b('Judiciary', 'न्यायपालिका') };
const REL = { elect: b('elect', 'चुनते हैं'), forms: b('government formed from', 'से सरकार बनती है'), answerable: b('answerable to', 'के प्रति जवाबदेह'), appoints: b('appoints', 'नियुक्त करता है'), checks: b('reviews', 'समीक्षा करती है'), veto: b('can veto laws of', 'के कानूनों पर वीटो कर सकता है'), impeach: b('impeach only for grave offences', 'केवल गंभीर अपराध पर महाभियोग') };
const POS = { parliamentary: { voters: [320, 30], legislature: [110, 150], executive: [530, 150], headOfState: [530, 30], judiciary: [320, 260] }, presidential: { voters: [320, 30], legislature: [110, 150], executive: [530, 150], judiciary: [320, 260] } };
const SYS = { parliamentary: b('Parliamentary (e.g. India’s Union government)', 'संसदीय (जैसे भारत की केंद्र सरकार)'), presidential: b('Presidential (e.g. the USA)', 'अध्यक्षीय (जैसे अमेरिका)') };
export const institutions = {
  id: 'T06.L3',
  objective: b('Compare how the executive and the legislature are related in a parliamentary and a presidential system, and what happens when the government loses the legislature’s support.', 'संसदीय और अध्यक्षीय प्रणालियों में कार्यपालिका और विधायिका के संबंध की तुलना करें, और सरकार के विधायिका का समर्थन खोने पर क्या होता है।'),
  note: { kind: 'documented', en: 'Simplified textbook models. Real constitutions have many more rules; the seat numbers here are fictional.', hi: 'सरलीकृत पाठ्यपुस्तकीय मॉडल। वास्तविक संविधानों में कहीं अधिक नियम होते हैं; यहाँ सीटों की संख्या काल्पनिक है।' },
  init: () => ({ system: 'parliamentary', support: 62, vote: false }),
  controls: [
    { id: 'system', type: 'chips', label: b('System', 'प्रणाली'), options: I.SYSTEMS.map((id) => ({ id, ...SYS[id] })) },
    { id: 'support', type: 'slider', label: b('Legislators (out of 100) who support the government', 'सरकार का समर्थन करने वाले विधायक (100 में से)'), min: 0, max: 100, step: 1 },
    { id: 'vote', type: 'toggle', label: b('Hold a vote of no confidence', 'अविश्वास प्रस्ताव पर मतदान कराएँ') },
  ],
  view(S) {
    const sys = S.system, pos = POS[sys], total = 100, cv = I.confidenceVote(sys, { total, supportExec: S.support }), lp = I.lawPassage(sys, { total, supportExec: S.support });
    const fell = S.vote && cv.lost && sys === 'parliamentary';
    let g = `<defs><marker id="ar" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="var(--mut)"/></marker></defs>`;
    const w = 200, hgt = 46, edgePt = (a, bb) => { const [x1, y1] = pos[a], [x2, y2] = pos[bb], dx = x2 - x1, dy = y2 - y1, k = Math.max(Math.abs(dx) / (w / 2 + 4), Math.abs(dy) / (hgt / 2 + 4)); return [x1 + dx / k, y1 + dy / k, x2 - dx / k, y2 - dy / k]; };
    I.RELATIONS[sys].forEach(([a, bb, k], i) => {
      let [x1, y1, x2, y2] = edgePt(a, bb); const horiz = Math.abs(x2 - x1) >= Math.abs(y2 - y1), o = (i % 2 ? 1 : -1) * 11;
      if (horiz) { y1 += o; y2 += o; } else { x1 += o * 1.6; x2 += o * 1.6; }
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (horiz ? (o < 0 ? -5 : 14) : 0), cut = fell && ((a === 'legislature' && bb === 'executive') || (a === 'executive' && bb === 'legislature' && k === 'answerable'));
      g += `<line class="edge${cut ? ' x' : ''}" x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" marker-end="url(#ar)"/><text class="txt sm mut" x="${(mx + (horiz ? 0 : (o > 0 && mx < 480 ? 6 : -6))).toFixed(0)}" y="${my.toFixed(0)}" text-anchor="${horiz ? 'middle' : o > 0 && mx < 480 ? 'start' : 'end'}">${esc(P(REL[k].en, REL[k].hi))}</text>`;
    });
    for (const a of I.ACTORS[sys]) { const [x, y] = pos[a]; const bad = fell && a === 'executive'; g += `<rect class="box${bad ? ' bad' : ''}" x="${x - w / 2}" y="${y - hgt / 2}" width="${w}" height="${hgt}" rx="8"/><text class="txt b" x="${x}" y="${y + 4}" text-anchor="middle">${esc(P(ACT[a].en, ACT[a].hi))}</text>`; }
    const bar = `<rect class="bar-s" x="20" y="322" width="${(S.support / 100) * 600}" height="14"/><rect class="bar-bad" x="${20 + (S.support / 100) * 600}" y="322" width="${((100 - S.support) / 100) * 600}" height="14" opacity=".55"/><line x1="320" x2="320" y1="314" y2="344" stroke="var(--ink)" stroke-width="2"/><text class="txt sm" x="20" y="358">${esc(P('Supporters', 'समर्थक'))} ${S.support}</text><text class="txt sm" x="620" y="358" text-anchor="end">${esc(P('Others', 'अन्य'))} ${100 - S.support}</text><text class="txt sm b" x="320" y="312" text-anchor="middle">${esc(P('majority = 51', 'बहुमत = 51'))}</text>`;
    const lines = [];
    if (S.vote) lines.push(sys === 'parliamentary'
      ? (cv.lost ? { en: `The government has only ${S.support} of 100: it LOSES the confidence vote, so it must resign. The head of state invites an alternative government or calls a fresh election.`, hi: `सरकार के पास 100 में से केवल ${S.support} हैं: वह विश्वासमत हार जाती है, इसलिए उसे त्यागपत्र देना होगा। राष्ट्राध्यक्ष वैकल्पिक सरकार को आमंत्रित करता है या नया चुनाव कराता है।`, cls: 'warn' }
        : { en: `With ${S.support} of 100 supporters the government WINS the vote and continues.`, hi: `100 में से ${S.support} समर्थकों के साथ सरकार मतदान जीतती है और जारी रहती है।`, cls: 'balanced' })
      : { en: 'In a presidential system the legislature cannot remove the president by an ordinary no-confidence vote: the president serves a fixed term and can be removed only by impeachment for grave offences, which needs a very large majority.', hi: 'अध्यक्षीय प्रणाली में विधायिका सामान्य अविश्वास मत से राष्ट्रपति को नहीं हटा सकती: राष्ट्रपति निश्चित कार्यकाल पूरा करता है और केवल गंभीर अपराधों पर महाभियोग से हटाया जा सकता है, जिसके लिए बहुत बड़ा बहुमत चाहिए।', cls: 'balanced' });
    lines.push(sys === 'parliamentary'
      ? (lp.passes ? { en: 'The government commands a majority, so its bills can pass: executive and legislature work together.', hi: 'सरकार के पास बहुमत है, इसलिए उसके विधेयक पारित हो सकते हैं: कार्यपालिका और विधायिका साथ काम करती हैं।' } : { en: 'Without a majority the government cannot be sure of passing laws and can be voted out at any time.', hi: 'बहुमत के बिना सरकार कानून पारित होने का भरोसा नहीं कर सकती और कभी भी हटाई जा सकती है।', cls: 'warn' })
      : (lp.passes ? { en: 'The president’s party has a majority, so laws pass easily.', hi: 'राष्ट्रपति की पार्टी के पास बहुमत है, इसलिए कानून आसानी से पारित होते हैं।' } : { en: 'The legislature is controlled by others (divided government): laws may stall (gridlock), but the president stays in office.', hi: 'विधायिका पर अन्य का नियंत्रण है (विभाजित सरकार): कानून अटक सकते हैं (गतिरोध), पर राष्ट्रपति पद पर बना रहता है।', cls: 'warn' }));
    return {
      plate: {
        src: 'assets/images/plates/t06-parliament.jpg',
        en: 'India’s circular sandstone Parliament colonnade — where the elected Lok Sabha holds the Union Council of Ministers accountable.',
        hi: 'भारत के संसद भवन का स्तंभ-मंडप — जहाँ निर्वाचित लोकसभा केंद्रीय मंत्रिपरिषद की जवाबदेही तय करती है।',
      },
      svg: `<svg viewBox="0 0 640 368" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}${bar}</svg>`, aria: `${sys} system with ${S.support} of 100 supporters. ${S.vote ? cv.outcome : 'No vote.'}`, lines };
  },
  discover: [b('In the parliamentary system set support to 40 and hold a no-confidence vote. Then switch to the presidential system with the same numbers.', 'संसदीय प्रणाली में समर्थन 40 करें और अविश्वास मत कराएँ। फिर वही संख्याएँ रखकर अध्यक्षीय प्रणाली चुनें।'), b('Which system can end up with a government that cannot pass its laws but stays in office?', 'किस प्रणाली में ऐसी सरकार हो सकती है जो कानून पारित न करा पाए पर पद पर बनी रहे?')],
  predictions: [{ id: 'p1', stem: b('In a PARLIAMENTARY system, the government has 45 of 100 legislators and faces a no-confidence vote. What happens?', 'संसदीय प्रणाली में सरकार के 100 में से 45 विधायक हैं और उसके विरुद्ध अविश्वास मत आता है। क्या होता है?'), options: [opt('falls', 'The government must resign', 'सरकार को त्यागपत्र देना होगा'), opt('stays', 'The government continues until the next election', 'सरकार अगले चुनाव तक चलती है')],
    run: (S) => { S.system = 'parliamentary'; S.support = 45; S.vote = true; return I.confidenceVote('parliamentary', { total: 100, supportExec: 45 }).lost ? 'falls' : 'stays'; }, explain: () => ({ en: 'In a parliamentary system the government exists only while it has the confidence of a majority of the legislature (51 of 100).', hi: 'संसदीय प्रणाली में सरकार तभी तक रहती है जब तक उसे विधायिका के बहुमत (100 में से 51) का विश्वास प्राप्त है।' }) }],
  exit: [{ id: 'e1', stem: b('Which statement about a presidential system is correct?', 'अध्यक्षीय प्रणाली के बारे में कौन-सा कथन सही है?'), correct: 'fixed', options: [
    { id: 'fixed', ...b('The president is elected separately and serves a fixed term, even without a majority in the legislature.', 'राष्ट्रपति अलग से चुना जाता है और विधायिका में बहुमत न होने पर भी निश्चित कार्यकाल पूरा करता है।') },
    { id: 'confidence', ...b('The president must resign whenever the legislature passes a no-confidence motion.', 'विधायिका के अविश्वास प्रस्ताव पारित करते ही राष्ट्रपति को त्यागपत्र देना पड़ता है।'), why: b('That describes a parliamentary system. Try the no-confidence vote in the presidential diagram.', 'यह संसदीय प्रणाली का वर्णन है। अध्यक्षीय आरेख में अविश्वास मत आज़माएँ।') }],
    explain: b('The president and the legislature are elected separately; each has its own source of power.', 'राष्ट्रपति और विधायिका अलग-अलग चुने जाते हैं; दोनों की सत्ता का अपना स्रोत है।'), hint: b('Look at the “elect” arrows into the executive.', 'कार्यपालिका की ओर जाने वाले “चुनते हैं” तीरों को देखें।') }],
  reflect: b('Which system makes the government more answerable to the legislature, and what is one cost of that?', 'कौन-सी प्रणाली सरकार को विधायिका के प्रति अधिक जवाबदेह बनाती है, और उसकी एक कीमत क्या है?'),
};
const PNAME = { R: b('Party R', 'दल R'), B: b('Party B', 'दल B'), G: b('Party G', 'दल G'), Y: b('Party Y', 'दल Y') };
const SYSN = { fptp: b('First-past-the-post', 'सर्वाधिक मत से जीत (FPTP)'), runoff: b('Two-round runoff', 'दो-चरणीय चुनाव'), pr: b('Proportional', 'आनुपातिक') };
export const coalition = {
  id: 'T07.L4',
  objective: b('Find which parties can form a government when no party wins a majority of seats, and examine how the Anti-Defection Law promotes stability.', 'पता करें कि जब किसी दल को सीटों का बहुमत नहीं मिलता तो कौन-से दल मिलकर सरकार बना सकते हैं, और दलबदल-रोधी कानून स्थिरता कैसे लाता है।'),
  note: { kind: 'fictional', en: 'All parties, votes and seats are fictional. A government needs more than half the seats (6 of 10). Includes India’s 10th Schedule Anti-Defection principle.', hi: 'सभी दल, मत और सीटें काल्पनिक हैं। सरकार के लिए आधे से अधिक सीटें (10 में से 6) चाहिए। भारत की 10वीं अनुसूची के दलबदल-रोधी सिद्धांत सहित।' },
  init: () => ({ system: 'proportional', swing: 0 }),
  controls: [
    { id: 'system', type: 'chips', label: b('Electoral system', 'चुनाव-प्रणाली'), options: [opt('fptp', ...Object.values(SYSN.fptp)), opt('runoff', ...Object.values(SYSN.runoff)), opt('proportional', ...Object.values(SYSN.pr))] },
    { id: 'swing', type: 'slider', label: b('Vote swing from R to B (points)', 'R से B की ओर मत-झुकाव (अंक)'), min: -10, max: 15, step: 1, fmt: (v) => (v > 0 ? `+${v}` : `${v}`) },
  ],
  view(S) {
    const r = E.run(S.system, S.swing), mw = E.minimalWinningCoalitions(r.seats), single = E.PARTIES.find((p) => r.seats[p] >= mw.need);
    const max = 10, pcol = { R: '#dc2626', B: '#2563eb', G: '#16a34a', Y: '#d97706' };
    // Build 10-seat semicircular Parliamentary Hemicycle
    const seatParties = E.PARTIES.flatMap((p) => Array(r.seats[p]).fill(p));
    let g = `<path d="M210,112 A110,110 0 0,1 430,112" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="4 4"/>`;
    seatParties.forEach((p, idx) => {
      const ang = Math.PI - (idx + 0.5) / 10 * Math.PI;
      const sx = (320 + Math.cos(ang) * 92).toFixed(1), sy = (112 - Math.sin(ang) * 86).toFixed(1);
      g += `<circle cx="${sx}" cy="${sy}" r="11" fill="${pcol[p]}" stroke="#fff" stroke-width="2"/><text class="txt sm b" x="${sx}" y="${(Number(sy) + 4).toFixed(1)}" text-anchor="middle" fill="#fff">${p}</text>`;
    });
    g += `<text class="txt sm b" x="320" y="114" text-anchor="middle">${esc(P('10-Seat House (Need 6)', '10-सीट सदन (बहुमत 6)'))}</text>`;
    E.PARTIES.forEach((p, i) => { const y = 136 + i * 44; g += `<text class="lbl" x="10" y="${y + 20}">${esc(P(PNAME[p].en, PNAME[p].hi))}</text><rect x="130" y="${y}" width="${(r.seats[p] / max) * 420}" height="28" rx="6" fill="${pcol[p]}" opacity="${r.seats[p] >= mw.need ? 1 : 0.82}"/><text class="txt b" x="${138 + (r.seats[p] / max) * 420}" y="${y + 20}">${r.seats[p]} ${esc(P('seats', 'सीटें'))} · ${fmt(r.voteShare[p] * 100, 0)}% ${esc(P('votes', 'मत'))}</text>`; });
    g += `<line x1="${130 + (mw.need / max) * 420}" x2="${130 + (mw.need / max) * 420}" y1="128" y2="314" stroke="var(--bad)" stroke-width="3" stroke-dasharray="6 4"/><text class="txt sm b" x="${130 + (mw.need / max) * 420}" y="330" text-anchor="middle" fill="var(--bad)">${esc(P('majority: 6', 'बहुमत: 6'))}</text>`;
    const names = (c) => c.parties.map((p) => PNAME[p].en).join(' + '), namesHi = (c) => c.parties.map((p) => PNAME[p].hi).join(' + ');
    const lines = [single ? { en: `${PNAME[single].en} has ${r.seats[single]} of 10 seats: a single-party majority government. No coalition is needed.`, hi: `${PNAME[single].hi} के पास 10 में से ${r.seats[single]} सीटें हैं: एकल-दल बहुमत की सरकार। गठबंधन की आवश्यकता नहीं।`, cls: 'balanced' }
      : { en: `No party reaches ${mw.need} seats (a hung house). Possible minimal coalitions: ${mw.coalitions.map((c) => `${names(c)} (${c.seats})`).join('; ') || 'none'}.`, hi: `कोई दल ${mw.need} सीटों तक नहीं पहुँचता (त्रिशंकु सदन)। संभावित न्यूनतम गठबंधन: ${mw.coalitions.map((c) => `${namesHi(c)} (${c.seats})`).join('; ') || 'कोई नहीं'}।`, cls: 'warn' },
      r.mismatch ? { en: 'The party with the most votes does not have the most seats: the system, not the voters’ wishes alone, shaped the result.', hi: 'सबसे अधिक मत पाने वाले दल के पास सबसे अधिक सीटें नहीं हैं: परिणाम केवल मतदाताओं की इच्छा से नहीं, प्रणाली से भी बना।', cls: 'warn' } : { en: 'The party with the most votes also has the most seats here.', hi: 'यहाँ सबसे अधिक मत पाने वाले दल के पास सबसे अधिक सीटें भी हैं।', cls: 'note' },
      { en: 'Anti-Defection Law (10th Schedule, 1985): if individual legislators defect after an election for personal gain, they lose their seat — curbing instability while party mergers still require a two-thirds threshold.', hi: 'दलबदल-रोधी कानून (10वीं अनुसूची, 1985): चुनाव के बाद व्यक्तिगत लाभ के लिए दलबदल करने वाले सदस्य की सीट समाप्त हो जाती है — इससे सरकार की अस्थिरता रुकती है।', cls: 'note' }];
    return {
      plate: {
        src: 'assets/images/plates/t07-coalition.jpg',
        en: 'Semicircular parliamentary chamber showing rainbow coalition benches reaching a governing majority.',
        hi: 'अर्धवृत्ताकार संसद कक्ष जहाँ विभिन्न दलों के सदस्य मिलकर बहुमत गठबंधन बनाते हैं।',
      },
      svg: `<svg viewBox="0 0 640 342" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`, aria: `Seats: ${E.PARTIES.map((p) => `${p} ${r.seats[p]}`).join(', ')}.`, lines };
  },
  discover: [b('Switch to proportional representation. How many parties do you need to form a government now?', 'आनुपातिक प्रतिनिधित्व चुनें। अब सरकार बनाने के लिए कितने दल चाहिए?'), b('Switch to first-past-the-post and move the swing slider until the majority party changes.', 'FPTP चुनें और झुकाव स्लाइडर तब तक बदलें जब तक बहुमत वाला दल न बदल जाए।')],
  predictions: [{ id: 'p1', stem: b('With proportional representation and no swing, does any single party win 6 or more of the 10 seats?', 'आनुपातिक प्रतिनिधित्व और शून्य झुकाव पर क्या किसी एक दल को 10 में से 6 या अधिक सीटें मिलती हैं?'), options: [opt('yes', 'Yes, one party has a majority', 'हाँ, एक दल के पास बहुमत है'), opt('no', 'No, a coalition is needed', 'नहीं, गठबंधन चाहिए')],
    run: (S) => { S.system = 'proportional'; S.swing = 0; const r = E.run('proportional', 0); return Object.values(r.seats).some((v) => v >= 6) ? 'yes' : 'no'; }, explain: () => { const r = E.run('proportional', 0); return { en: `Proportional seats are ${E.PARTIES.map((p) => `${p} ${r.seats[p]}`).join(', ')}: seats follow vote shares, so no party reaches 6 and a coalition is needed.`, hi: `आनुपातिक सीटें ${E.PARTIES.map((p) => `${p} ${r.seats[p]}`).join(', ')} हैं: सीटें मत-अनुपात का अनुपात रखती हैं, इसलिए कोई दल 6 तक नहीं पहुँचता और गठबंधन चाहिए।` }; } }],
  exit: [{ id: 'e1', stem: b('Why can a coalition government be less stable than a single-party majority government?', 'गठबंधन सरकार एकल-दल बहुमत सरकार से कम स्थिर क्यों हो सकती है?'), correct: 'a', options: [
    { id: 'a', ...b('If one partner leaves, the government may lose its majority.', 'यदि कोई साझेदार हट जाए तो सरकार का बहुमत समाप्त हो सकता है।') }, { id: 'b', ...b('Coalitions are not allowed to pass laws.', 'गठबंधनों को कानून पारित करने की अनुमति नहीं होती।'), why: b('Coalitions can pass laws; the risk is losing the majority when a partner leaves.', 'गठबंधन कानून पारित कर सकते हैं; जोखिम यह है कि साझेदार के हटने पर बहुमत चला जाता है।') }],
    explain: b('A coalition’s majority depends on every partner staying, so each partner has bargaining power.', 'गठबंधन का बहुमत हर साझेदार के बने रहने पर निर्भर है, इसलिए हर साझेदार के पास मोलभाव की शक्ति होती है।'), hint: b('Check the seat count of the smallest coalition.', 'सबसे छोटे गठबंधन की सीट-संख्या जाँचें।') }],
  reflect: b('Should a country prefer clear, quick majorities or fair representation of every vote? Give one reason.', 'क्या किसी देश को स्पष्ट, शीघ्र बहुमत पसंद करना चाहिए या हर मत का न्यायपूर्ण प्रतिनिधित्व? एक कारण दें।'),
};
