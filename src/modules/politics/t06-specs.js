// T06 Democracy lab specs (L1–L4).
import * as I from '../../engines/domain/institutions.js';
import * as S_ from '../../engines/domain/society.js';
import { worldMapSvg, forceGraphSvg } from '../../engines/viz.js';
import { esc } from '../../core/dom.js';
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
      plate: {
        src: 'assets/images/plates/t06-pillars.jpg',
        en: 'Constitutional democracy in action — tap polling queue, court scales of justice or free press desk to stress-test all 4 pillars.',
        hi: 'संवैधानिक लोकतंत्र के स्तंभ — मतदान कतार, न्याय तराजू व स्वतंत्र प्रेस मेज़ पर टैप कर चारों मानदंड परखें।',
        spots: [
          { x: 18, y: 60, en: 'Full Democracy (4/4 Pillars)', hi: 'पूर्ण लोकतंत्र (4/4 स्तंभ)', detail: b('Free vote + multi-party competition + free press + equal law keep rulers accountable.', 'निष्पक्ष चुनाव, बहु-दलीय विकल्प, स्वतंत्र मीडिया व समान कानून जवाबदेही रखते हैं।'), set: { preset: 'full' } },
          { x: 50, y: 64, en: 'Single-Party Ballot Trap', hi: 'एक-दलीय चुनाव जाल', detail: b('Notice voting alone without opposition or independent courts scores only 1/4!', 'विपक्ष और स्वतंत्र न्यायपालिका बिना केवल मतदान 4 में से 1 ही अंक देता है!'), set: { preset: 'oneparty' } },
          { x: 84, y: 68, en: 'Media Censorship Failure', hi: 'मीडिया सेंसरशिप विफलता', detail: b('Silencing journalists blinds citizens between elections even with rival parties.', 'पत्रकारों को चुप कराना चुनावों के बीच नागरिकों की निगरानी छीन लेता है।'), set: { preset: 'pressban' } },
        ],
      },
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
          ? 'Chola stone mandapa inscriptions and Uttaramerur Kudavolai ballot pot — tap pins to inspect Vedic, Vajji and Chola rules.'
          : 'Early Indian deliberative stone mandapa — tap pins to compare Sabha-Samiti, Vajji Sangha and Uttaramerur.',
        hi: S.trad === 'uttara'
          ? 'चोल मंडप शिलालेख व उत्तरमेरूर कुडवोलाई घड़ा — वैदिक, वज्जि व चोल सभाएँ देखने हेतु पिन पर टैप करें।'
          : 'प्राचीन भारतीय सभा-मंडप — सभा-समिति, वज्जि व उत्तरमेरूर की तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 22, y: 46, en: 'Vedic Sabha & Samiti', hi: 'वैदिक सभा व समिति', detail: b('Council of elders & general folk assembly advising the rajan.', 'वरिष्ठों की सभा और जन-समिति द्वारा सार्वजनिक मामलों पर विमर्श।'), set: { trad: 'sabha', step: 3 } },
          { x: 52, y: 68, en: 'Uttaramerur Kudavolai (c. 920 CE)', hi: 'उत्तरमेरूर कुडवोलाई (ल. 920 ई.)', detail: b('Palm-leaf lotteries from a pot with public audit disqualifications.', 'घड़े से ताड़पत्र पर्ची व पिछले खातों की सख्त लेखा-परीक्षा के नियम।'), set: { trad: 'uttara', step: 3 } },
          { x: 80, y: 54, en: 'Vajji Santhagara Republic', hi: 'वज्जि संथागार गणसंघ', detail: b('Assemblies in Vaishali deciding collective policy through open debate & ballot sticks.', 'वैशाली की संथागार सभा में खुले विमर्श व शलाका मत-दंड से निर्णय।'), set: { trad: 'vajji', step: 3 } },
        ],
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
      plate: {
        src: 'assets/images/t06.jpg',
        en: 'Global constitutional systems: tap pins to compare India, USA, France and Canada on the world map.',
        hi: 'विश्व की संवैधानिक प्रणालियाँ: भारत, अमेरिका, फ़्रांस व कनाडा की तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 52, en: 'India: Parliamentary Republic', hi: 'भारत: संसदीय गणतंत्र', detail: b('Union + States federal structure; indirect President & PM accountable to Lok Sabha.', 'संघीय ढाँचा; अप्रत्यक्ष राष्ट्रपति व लोकसभा के प्रति उत्तरदायी प्रधानमंत्री।'), set: { country: 'in' } },
          { x: 50, y: 46, en: 'USA: Presidential Republic', hi: 'अमेरिका: अध्यक्षीय गणतंत्र', detail: b('Same person is Head of State & Government with a fixed 4-year term.', 'एक ही राष्ट्रपति राष्ट्राध्यक्ष व शासनाध्यक्ष होता है (निश्चित 4-वर्षीय कार्यकाल)।'), set: { country: 'us' } },
          { x: 76, y: 52, en: 'France & Canada Contrasts', hi: 'फ़्रांस (अर्ध-अध्यक्षीय) व कनाडा', detail: b('France blends direct President + PM; switch chips to inspect Canada & Russia too.', 'फ़्रांस में प्रत्यक्ष राष्ट्रपति व प्रधानमंत्री दोनों; कनाडा संवैधानिक राजतंत्र है।'), set: { country: 'fr' } },
        ],
      },
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
        en: 'India’s circular sandstone Parliament colonnade — tap pins to contrast parliamentary confidence vs presidential fixed terms.',
        hi: 'भारत का संसद भवन मंडप — संसदीय विश्वासमत बनाम अध्यक्षीय निश्चित कार्यकाल की तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 26, y: 50, en: 'Parliamentary Majority (62/100)', hi: 'संसदीय बहुमत (62/100)', detail: b('Cabinet holds Lok Sabha majority — bills pass & government stays secure.', 'लोकसभा बहुमत रहने तक मंत्रिपरिषद विधेयक पारित करती व कार्यरत रहती है।'), set: { system: 'parliamentary', support: 62, vote: false } },
          { x: 54, y: 42, en: 'No-Confidence Resignation (42/100)', hi: 'अविश्वास मत इस्तीफ़ा (42/100)', detail: b('In a parliamentary system losing majority confidence forces immediate resignation.', 'संसदीय प्रणाली में बहुमत खोते ही सरकार को त्यागपत्र देना पड़ता है।'), set: { system: 'parliamentary', support: 42, vote: true } },
          { x: 78, y: 56, en: 'Presidential Gridlock (42/100)', hi: 'अध्यक्षीय गतिरोध (42/100)', detail: b('A President stays for the fixed term even when opposition controls Congress.', 'विधायिका में बहुमत न होने पर भी राष्ट्रपति निश्चित कार्यकाल पूरा करता है।'), set: { system: 'presidential', support: 42, vote: true } },
        ],
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
