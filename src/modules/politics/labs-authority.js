// Political Science T14 Authority labs: L1 Kautilya & Shukraniti, L2 Concept Map, L3 Timeline, L4 Authority Types, L5 Citizen Workflow.
import * as S_ from '../../engines/domain/society.js';
import { forceGraphSvg } from '../../engines/viz.js';
import { esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });

// ------------------------------------------------------------------ T14.L1 Kautilya & Shukraniti Explorer
const TEXTS = [
  { id: 'kautilya', en: 'Kautilya’s Arthashastra (~300 BCE)', hi: 'कौटिल्य का अर्थशास्त्र (~300 ई.पू.)', concept: 'Danda (measured discipline) must uphold Nyaya (justice) and prevent Matsya-nyaya (law of the fish, where big devours small).', conceptHi: 'दंड (नियंत्रित अनुशासन) को न्याय की रक्षा करनी चाहिए और मत्स्य-न्याय (बड़े द्वारा छोटे को निगलने) को रोकना चाहिए।' },
  { id: 'shukra', en: 'Shukraniti (Classical Polity Treatise)', hi: 'शुक्रनीति (प्राचीन नीति ग्रंथ)', concept: 'The ruler holds Bala (capacity/strength) not for private whim, but as a salaried servant of dharma and public welfare (Yoga-kshema).', conceptHi: 'शासक के पास बल (शक्ति) निजी स्वार्थ के लिए नहीं, बल्कि धर्म व लोक-कल्याण (योगक्षेम) के सेवक के रूप में होता है।' },
];
export const kautilyaExplorer = {
  id: 'T14.L1',
  objective: b('Interpret classical Indian political thought (Kautilya and Shukraniti) on how Danda (discipline), Nyaya (justice), and Bala (capacity) prevent disorder when balanced.', 'कौटिल्य और शुक्रनीति के संदर्भ में दंड (अनुशासन), न्याय और बल (सामर्थ्य) के संतुलन को समझें जो अव्यवस्था को रोकता है।'),
  note: { kind: 'documented', en: 'Sourced to Kautilya’s Arthashastra and the Shukraniti tradition on Rajadharma and Yoga-kshema (welfare).', hi: 'कौटिल्य के अर्थशास्त्र और शुक्रनीति परंपरा के राजधर्म व योगक्षेम सिद्धांतों पर आधारित।' },
  init: () => ({ text: 'kautilya', danda: 55, nyaya: 80 }),
  controls: [
    { id: 'text', type: 'chips', label: b('Treatise', 'ग्रंथ'), options: TEXTS.map((t) => opt(t.id, t.en, t.hi)) },
    { id: 'danda', type: 'slider', label: b('Danda / State Force (%)', 'दंड / राज्य बल (%)'), min: 0, max: 100, step: 5 },
    { id: 'nyaya', type: 'slider', label: b('Nyaya / Fairness & Accountability (%)', 'न्याय / निष्पक्षता व जवाबदेही (%)'), min: 0, max: 100, step: 5 },
  ],
  view(S) {
    const tx = TEXTS.find((x) => x.id === S.text) || TEXTS[0];
    const order = S.danda < 25 ? 'matsya' : S.nyaya < 40 && S.danda > 60 ? 'tyranny' : S.nyaya >= 60 && S.danda >= 40 ? 'rajadharma' : 'fragile';
    const col = order === 'rajadharma' ? '#15803d' : order === 'fragile' ? '#b45309' : '#b91c1c';
    const dW = (S.danda / 100) * 420, nW = (S.nyaya / 100) * 420;
    const svg = `<svg viewBox="0 0 640 220" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">`
      + `<rect x="20" y="16" width="600" height="44" rx="8" fill="#fef3c7" stroke="#b45309"/><text class="txt b" x="34" y="43">${esc(P(tx.en, tx.hi))}</text>`
      + `<text class="txt sm" x="24" y="92">${esc(P('Danda (Force/Law)', 'दंड (बल/नियम)'))}</text><rect x="180" y="76" width="${dW}" height="24" rx="4" fill="#0369a1"/><text class="txt sm b" x="${188 + dW}" y="93">${S.danda}%</text>`
      + `<text class="txt sm" x="24" y="132">${esc(P('Nyaya (Justice)', 'न्याय'))}</text><rect x="180" y="116" width="${nW}" height="24" rx="4" fill="#15803d"/><text class="txt sm b" x="${188 + nW}" y="133">${S.nyaya}%</text>`
      + `<rect x="24" y="160" width="592" height="42" rx="8" fill="${col}" fill-opacity=".14" stroke="${col}" stroke-width="2"/><text class="txt b" x="320" y="186" text-anchor="middle">${esc(order === 'rajadharma' ? P('Balanced Authority (Yoga-kshema / Public Welfare)', 'संतुलित प्राधिकार (योगक्षेम / लोक-कल्याण)') : order === 'tyranny' ? P('Harsh Force without Justice → Unrest', 'न्याय के बिना कठोर बल → असंतोष') : order === 'matsya' ? P('Weak Enforcement → Matsya-nyaya (Chaos)', 'कमज़ोर नियम → मत्स्य-न्याय (अराजकता)') : P('Fragile Balance — Strengthen Justice & Clarity', 'कमज़ोर संतुलन — न्याय सुदृढ़ करें'))}</text></svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t14-authority.jpg',
        en: 'Palm-leaf Arthashastra treatise, brass scales of Nyaya (justice) and royal Dharma Chakra emblem.',
        hi: 'ताड़पत्र अर्थशास्त्र ग्रंथ, न्याय की पीतल तराजू और राजधर्म चक्र प्रतीक।',
      },
      svg,
      aria: `${tx.en}: Danda ${S.danda}%, Nyaya ${S.nyaya}% gives ${order}`,
      lines: [
        { en: `${tx.en}: ${tx.concept}`, hi: `${tx.hi}: ${tx.conceptHi}`, cls: order === 'rajadharma' ? 'balanced' : 'warn' },
        { en: 'Kautilya warns: an overly severe ruler causes resentment, an overly mild ruler invites contempt, while measured Danda guided by Nyaya brings security.', hi: 'कौटिल्य चेतावनी देते हैं: अत्यंत कठोर दंड से रोष और अत्यंत शिथिल दंड से अवज्ञा होती है; न्याययुक्त संतुलित दंड ही सुरक्षा देता है।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Lower Danda below 20% and observe Matsya-nyaya (when no rule protects the weak).', 'दंड को 20% से नीचे लाकर मत्स्य-न्याय की स्थिति देखें।'),
    b('Raise Danda to 90% while lowering Nyaya to 20%. Why does force without fairness fail?', 'दंड को 90% और न्याय को 20% करें। निष्पक्षता के बिना बल क्यों विफल होता है?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('In Kautilya’s Arthashastra, what prevents "Matsya-nyaya" (the big fish swallowing the small)?', 'कौटिल्य के अर्थशास्त्र में "मत्स्य-न्याय" (बड़ी मछली द्वारा छोटी को निगलना) को क्या रोकता है?'),
    options: [opt('bal', 'Measured Danda guided by Nyaya (just law)', 'न्याय से संचालित संतुलित दंड'), opt('chaos', 'Removing all rules and courts', 'सभी नियम व न्यायालय हटा देना')],
    run: (S) => { S.danda = 55; S.nyaya = 80; return 'bal'; },
    explain: () => b('Fairly enforced law (Danda + Nyaya) protects weaker citizens from coercion by the powerful.', 'न्यायपूर्ण रूप से लागू कानून (दंड + न्याय) कमजोर नागरिकों को शक्तिशाली के शोषण से बचाता है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('How does Shukraniti view the authority of a ruler?', 'शुक्रनीति शासक के प्राधिकार को किस रूप में देखती है?'),
    correct: 'service',
    options: [
      opt('service', 'As duty-bound service for the people’s welfare (Yoga-kshema), governed by dharma and counsel.', 'धर्म व परामर्श से बंधी लोक-कल्याण (योगक्षेम) की सेवा के रूप में।'),
      opt('private', 'As personal property with zero accountability.', 'बिना किसी जवाबदेही की निजी संपत्ति के रूप में।', b('Classical texts treat kingship as a public trust bound by dharma.', 'प्राचीन नीति ग्रंथ राजत्व को धर्म से बंधा लोक-न्यास मानते हैं।')),
    ],
    explain: b('In both Kautilya and Shukraniti, public welfare is the test of rightful authority.', 'कौटिल्य और शुक्रनीति दोनों में लोक-कल्याण ही वैध प्राधिकार की कसौटी है।'),
    hint: b('Switch Treatise to Shukraniti and read its concept line.', 'ग्रंथ को शुक्रनीति पर बदलें और विवरण पढ़ें।'),
  }],
  reflect: b('Give one example from school rules where fair enforcement helps weaker students feel safe.', 'विद्यालय के नियमों का एक उदाहरण दें जहाँ निष्पक्ष अनुशासन कमजोर छात्रों को सुरक्षित महसूस कराता है।'),
};

// ------------------------------------------------------------------ T14.L2 Concept Map
export const authorityMap = {
  id: 'T14.L2',
  objective: b('Connect authority, legitimacy, law, justice, security, and citizen participation in a causal diagram and test what happens when one link breaks.', 'प्राधिकार, वैधता, कानून, न्याय, सुरक्षा और नागरिक भागीदारी को एक कारण-संबंध आरेख में जोड़ें और देखें कि एक कड़ी टूटने पर क्या होता है।'),
  note: { kind: 'schematic', en: 'Conceptual governance feedback map linking citizens to constitutional authority.', hi: 'नागरिकों को संवैधानिक प्राधिकार से जोड़ने वाला अवधारणात्मक शासन-संबंध मानचित्र।' },
  init: () => ({ focus: 'legitimacy', citizenVoice: true }),
  controls: [
    { id: 'focus', type: 'chips', label: b('Highlight pillar', 'स्तंभ चुनें'), options: [
      opt('legitimacy', 'Legitimacy', 'वैधता'),
      opt('law', 'Rule of Law', 'विधि-शासन'),
      opt('justice', 'Justice & Rights', 'न्याय व अधिकार'),
    ] },
    { id: 'citizenVoice', type: 'toggle', label: b('Citizen participation & consent active', 'नागरिक भागीदारी व सहमति सक्रिय') },
  ],
  view(S) {
    const nodes = [
      { id: 'cit', fx: 100, fy: 130, rw: 112, fill: S.citizenVoice ? '#dcfce7' : '#f1f5f9', stroke: S.citizenVoice ? '#15803d' : '#94a3b8', label: P('Citizens', 'नागरिक') },
      { id: 'leg', fx: 240, fy: 60, rw: 116, fill: '#dbeafe', stroke: '#0369a1', label: P('Legitimacy', 'वैधता') },
      { id: 'auth', fx: 400, fy: 60, rw: 116, fill: '#fef3c7', stroke: '#b45309', label: P('Authority', 'प्राधिकार') },
      { id: 'law', fx: 535, fy: 130, rw: 110, fill: '#dbeafe', stroke: '#0369a1', label: P('Law', 'कानून') },
      { id: 'jus', fx: 400, fy: 205, rw: 110, fill: '#dbeafe', stroke: '#0369a1', label: P('Justice', 'न्याय') },
      { id: 'sec', fx: 240, fy: 205, rw: 110, fill: '#f3e8ff', stroke: '#7e22ce', label: P('Security', 'सुरक्षा') },
    ];
    const links = [
      { source: 'cit', target: 'leg', label: S.citizenVoice ? P('consent', 'सहमति') : 'X' },
      { source: 'leg', target: 'auth', label: S.citizenVoice ? P('mandate', 'जनादेश') : 'X' },
      { source: 'auth', target: 'law', label: P('enacts', 'निर्माण') },
      { source: 'law', target: 'jus', label: P('protects', 'रक्षा') },
      { source: 'jus', target: 'sec', label: P('trust', 'विश्वास') },
      { source: 'sec', target: 'cit', label: S.citizenVoice ? P('peace', 'शांति') : 'X' },
    ];
    const svg = forceGraphSvg({ w: 640, h: 265, nodes, links, activeId: S.focus === 'legitimacy' ? 'leg' : S.focus === 'law' ? 'law' : 'jus', aria: P('Authority and citizen cycle', 'प्राधिकार और नागरिक चक्र') });
    return {
      svg,
      aria: `Authority cycle focused on ${S.focus}, citizen voice ${S.citizenVoice}`,
      lines: [
        { en: S.citizenVoice ? 'Power backed by citizen consent becomes legitimate Authority; fair Law and Justice create lasting public Security.' : 'Power without citizen consent relies on fear alone — Legitimacy drops and public trust breaks down.', hi: S.citizenVoice ? 'नागरिक सहमति से समर्थित शक्ति वैध प्राधिकार बनती है; निष्पक्ष कानून और न्याय स्थायी सुरक्षा देते हैं।' : 'नागरिक सहमति के बिना शक्ति केवल भय पर टिकती है — वैधता घटती है और जन-विश्वास टूटता है।', cls: S.citizenVoice ? 'balanced' : 'warn' },
        { en: 'Power is merely the ability to compel; Authority is rightful, law-bound power that citizens accept as fair.', hi: 'शक्ति केवल बाध्य करने की क्षमता है; प्राधिकार वह वैध व कानून-बद्ध शक्ति है जिसे नागरिक न्यायसंगत मानते हैं।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Toggle citizen participation off and trace which arrows break in the loop.', 'नागरिक भागीदारी बंद करें और देखें चक्र के कौन-से तीर टूटते हैं।'),
    b('Explain in one line the difference between raw Power and legitimate Authority.', 'कच्ची शक्ति और वैध प्राधिकार में अंतर एक पंक्ति में समझाएँ।'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('What turns raw power into legitimate authority in a democracy?', 'लोकतंत्र में कच्ची शक्ति को वैध प्राधिकार कौन बनाता है?'),
    options: [opt('cons', 'Citizen consent, elections, and adherence to constitutional law', 'नागरिक सहमति, चुनाव और संवैधानिक कानून का पालन'), opt('fear', 'Secrecy and force without courts', 'न्यायालयों के बिना गोपनीयता और बल')],
    run: (S) => { S.citizenVoice = true; return 'cons'; },
    explain: () => b('Legitimacy arises when authority is earned through constitutional rules and citizen consent.', 'वैधता तब उत्पन्न होती है जब प्राधिकार संवैधानिक नियमों और नागरिक सहमति से प्राप्त होता है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Which order best reflects a legitimate constitutional cycle?', 'वैध संवैधानिक चक्र का सही क्रम कौन-सा है?'),
    correct: 'cyc',
    options: [
      opt('cyc', 'Citizens give consent → Authority makes fair Law → Courts ensure Justice → Public Security.', 'नागरिक सहमति देते हैं → प्राधिकार निष्पक्ष कानून बनाता है → न्यायालय न्याय सुनिश्चित करते हैं → जन-सुरक्षा।'),
      opt('opp', 'Force ignores law → Citizens have no rights → Lasting legitimacy.', 'बल कानून को अनदेखा करता है → नागरिकों के अधिकार नहीं → स्थायी वैधता।', b('Ignoring law destroys legitimacy.', 'कानून की अनदेखी वैधता नष्ट कर देती है।')),
    ],
    explain: b('Lawful accountability connects authority back to citizens.', 'कानूनी जवाबदेही प्राधिकार को वापस नागरिकों से जोड़ती है।'),
    hint: b('Follow the green arrow out of Citizens.', 'नागरिकों से निकलने वाला हरा तीर देखें।'),
  }],
  reflect: b('Why do traffic police have authority to fine a driver, whereas a stranger on the street does not?', 'सड़क पर किसी यातायात पुलिसकर्मी को चालान करने का प्राधिकार क्यों है, जबकि किसी राहगीर को नहीं?'),
};

// ------------------------------------------------------------------ T14.L3 Historical-to-Constitutional Timeline
const AUTH_ERAS = [
  { id: 'early', label: 'Janapada & Kautilya (~600–300 BCE)', hi: 'जनपद व कौटिल्य (~600–300 ई.पू.)', x: 80, en: 'Deliberative ganasanghas alongside Arthashastra statecraft balancing Danda and welfare.', hiD: 'गणसंघ की विमर्श परंपरा और दंड व कल्याण का संतुलन रखने वाला अर्थशास्त्र।' },
  { id: 'med', label: 'Medieval Local Councils (900–1700 CE)', hi: 'मध्यकालीन स्थानीय परिषदें (900–1700 ई.)', x: 240, en: 'Chola sabhas, panchayats, and guild courts resolved local disputes under customary law.', hiD: 'चोल ग्राम-सभाओं, पंचायतों और श्रेणी न्यायालयों ने स्थानीय विवाद सुलझाए।' },
  { id: 'col', label: 'Colonial Extraction (1757–1947)', hi: 'औपनिवेशिक शासन (1757–1947)', x: 400, en: 'Law imposed without Indian consent; unequal justice and emergency policing triggered the freedom movement.', hiD: 'भारतीय सहमति के बिना थोपे गए कानून व असमान न्याय से स्वतंत्रता संग्राम उपजा।' },
  { id: 'rep', label: 'Indian Constitution (1950–Present)', hi: 'भारतीय संविधान (1950–वर्तमान)', x: 560, en: 'We the People give ourselves Fundamental Rights (Art 14–32), independent Judiciary, and universal elections.', hiD: 'हम भारत के लोगों ने मौलिक अधिकार (अनु. 14–32), स्वतंत्र न्यायपालिका व वयस्क मताधिकार अपनाया।' },
];
export const authorityTimeline = {
  id: 'T14.L3',
  objective: b('Trace how Indian authority evolved from early assemblies and medieval local councils through colonial rule to the 1950 Constitutional Republic.', 'भारत में प्राधिकार के विकास को प्राचीन सभाओं व मध्यकालीन परिषदों से औपनिवेशिक काल होते हुए 1950 के संवैधानिक गणतंत्र तक देखें।'),
  note: { kind: 'documented', en: 'Historical milestones culminating in the Constitution of India enacted on 26 January 1950.', hi: '26 जनवरी 1950 को लागू भारतीय संविधान तक पहुँचने वाले ऐतिहासिक पड़ाव।' },
  init: () => ({ eraIdx: 3 }),
  controls: [
    { id: 'eraIdx', type: 'slider', label: b('Historical stage (1–4)', 'ऐतिहासिक चरण (1–4)'), min: 0, max: 3, step: 1, fmt: (i) => AUTH_ERAS[i]?.label || '' },
  ],
  view(S) {
    const cur = AUTH_ERAS[S.eraIdx] || AUTH_ERAS[3];
    let g = `<line x1="60" y1="110" x2="580" y2="110" stroke="var(--mut)" stroke-width="3"/>`;
    AUTH_ERAS.forEach((e, i) => {
      const act = i === S.eraIdx;
      g += `<circle cx="${e.x}" cy="110" r="${act ? 14 : 9}" fill="${act ? '#1d4ed8' : '#64748b'}" stroke="#fff" stroke-width="2.5"/>`
        + `<text class="txt sm ${act ? 'b' : 'mut'}" x="${e.x}" y="${i % 2 ? 152 : 76}" text-anchor="middle">${esc(e.label.split(' (')[0])}</text>`
        + `<text class="txt sm mut" x="${e.x}" y="${i % 2 ? 168 : 92}" text-anchor="middle">${esc('(' + (e.label.split(' (')[1] || ''))}</text>`;
    });
    const svg = `<svg viewBox="0 0 640 205" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
    return {
      svg,
      aria: `${cur.label}: ${cur.en}`,
      lines: [
        { en: `${cur.label}: ${cur.en}`, hi: `${cur.hi}: ${cur.hiD}`, cls: S.eraIdx === 2 ? 'warn' : 'balanced' },
        { en: 'Key transition in 1950: security and justice became enforceable citizen rights (Articles 14 & 21) rather than ruler favours.', hi: '1950 का बड़ा बदलाव: सुरक्षा और न्याय शासक की कृपा नहीं, बल्कि अनुच्छेद 14 व 21 के अंतर्गत प्रवर्तनीय नागरिक अधिकार बने।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Compare stage 3 (Colonial rule) with stage 4 (1950 Constitution): what changed in who holds ultimate sovereignty?', 'चरण 3 (औपनिवेशिक शासन) और चरण 4 (1950 संविधान) की तुलना करें: अंतिम संप्रभुता किसके हाथ आई?'),
    b('Which Articles protect equality before law (Art 14) and life/personal liberty (Art 21)?', 'कौन-से अनुच्छेद विधि के समक्ष समानता (अनु. 14) और प्राण व दैहिक स्वतंत्रता (अनु. 21) की रक्षा करते हैं?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('Under the Constitution of India (1950), if police detain a citizen unlawfully, who can enforce Article 21 liberty rights?', 'भारतीय संविधान (1950) के तहत यदि पुलिस किसी नागरिक को अवैध रूप से हिरासत में ले, तो अनुच्छेद 21 के अधिकार कौन लागू कर सकता है?'),
    options: [opt('court', 'Independent High Courts and the Supreme Court (writ jurisdiction)', 'स्वतंत्र उच्च न्यायालय व सर्वोच्च न्यायालय (रिट अधिकारिता)'), opt('none', 'Nobody — citizens cannot challenge officials', 'कोई नहीं — नागरिक अधिकारियों को चुनौती नहीं दे सकते')],
    run: (S) => { S.eraIdx = 3; return 'court'; },
    explain: () => b('Articles 32 and 226 empower courts to issue habeas corpus and enforce Fundamental Rights against arbitrary authority.', 'अनुच्छेद 32 और 226 न्यायालयों को मनमाने प्राधिकार के विरुद्ध बंदी प्रत्यक्षीकरण जारी कर मौलिक अधिकार लागू करने की शक्ति देते हैं।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('What made colonial authority fundamentally illegitimate in the eyes of India’s freedom struggle?', 'स्वतंत्रता संग्राम की दृष्टि में औपनिवेशिक प्राधिकार मूलतः अवैध क्यों था?'),
    correct: 'no-cons',
    options: [
      opt('no-cons', 'Laws were imposed without Indian consent or equal accountability to citizens.', 'कानून भारतीय सहमति या नागरिकों के प्रति समान जवाबदेही के बिना थोपे गए थे।'),
      opt('fast', 'Laws changed too slowly.', 'कानून बहुत धीरे बदलते थे।', b('The core grievance was lack of swaraj / self-rule and equality before law.', 'मुख्य मुद्दा स्वराज और विधि के समक्ष समानता का अभाव था।')),
    ],
    explain: b('Swaraj meant authority accountable to Indians through constitutional democracy.', 'स्वराज का अर्थ संवैधानिक लोकतंत्र के माध्यम से भारतीयों के प्रति जवाबदेह प्राधिकार था।'),
    hint: b('Inspect stage 3 on the timeline.', 'समय-रेखा पर चरण 3 देखें।'),
  }],
  reflect: b('Why do the opening words of India’s Constitution begin with "We, the People of India"?', 'भारतीय संविधान की शुरुआत "हम, भारत के लोग" शब्दों से क्यों होती है?'),
};

// ------------------------------------------------------------------ T14.L4 Authority Type Comparison
const ATYPES = [
  { id: 'functional', en: 'Functional Authority', hi: 'कार्यात्मक प्राधिकार', ex: 'Traffic signal officer / School exam invigilator', exHi: 'यातायात अधिकारी / परीक्षा निरीक्षक', descEn: 'Focused on coordinating rules efficiently and fairly within a defined domain.', descHi: 'निश्चित क्षेत्र में नियमों का कुशल और निष्पक्ष संचालन सुनिश्चित करना।', trust: 78, fairness: 82 },
  { id: 'sensitive', en: 'Sensitive Authority', hi: 'संवेदनशील प्राधिकार', ex: 'School counsellor / Community mediator', exHi: 'विद्यालय परामर्शदाता / सामुदायिक मध्यस्थ', descEn: 'Listens empathetically to circumstances and protects dignity while upholding norms.', descHi: 'परिस्थितियों को सहानुभूति से सुनकर नियमों के साथ व्यक्ति की गरिमा की रक्षा करना।', trust: 88, fairness: 86 },
  { id: 'welfare', en: 'Welfare-Oriented Authority', hi: 'कल्याणकारी प्राधिकार', ex: 'District Relief & Public Health Board', exHi: 'जिला राहत एवं जन-स्वास्थ्य बोर्ड', descEn: 'Uses public resources proactively to uplift vulnerable citizens (Yoga-kshema).', descHi: 'कमज़ोर नागरिकों के उत्थान व जन-कल्याण (योगक्षेम) के लिए सार्वजनिक संसाधनों का सक्रिय उपयोग।', trust: 92, fairness: 90 },
];
export const authorityTypes = {
  id: 'T14.L4',
  objective: b('Compare functional, sensitive, and welfare-oriented forms of authority across real everyday institutions.', 'रोज़मर्रा की संस्थाओं में कार्यात्मक, संवेदनशील और कल्याणकारी प्राधिकार के रूपों की तुलना करें।'),
  note: { kind: 'schematic', en: 'Illustrative civic typology comparing how authority behaves across roles.', hi: 'विभिन्न भूमिकाओं में प्राधिकार के व्यवहार की तुलना करने वाला नागरिक वर्गीकरण।' },
  init: () => ({ atype: 'welfare', listening: true }),
  controls: [
    { id: 'atype', type: 'chips', label: b('Authority type', 'प्राधिकार प्रकार'), options: ATYPES.map((a) => opt(a.id, a.en, a.hi)) },
    { id: 'listening', type: 'toggle', label: b('Public transparency & hearing enabled', 'जन-सुनवाई व पारदर्शिता लागू') },
  ],
  view(S) {
    const a = ATYPES.find((x) => x.id === S.atype) || ATYPES[0];
    const trust = Math.max(25, a.trust - (S.listening ? 0 : 35)), fair = Math.max(20, a.fairness - (S.listening ? 0 : 40));
    const svg = `<svg viewBox="0 0 640 215" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">`
      + `<rect x="20" y="16" width="600" height="58" rx="8" fill="#e0f2fe" stroke="#0369a1"/><text class="txt b" x="34" y="39">${esc(P(a.en, a.hi))}</text><text class="txt sm mut" x="34" y="60">${esc(P(a.ex, a.exHi))}</text>`
      + `<text class="txt sm" x="24" y="114">${esc(P('Citizen Trust', 'नागरिक विश्वास'))}</text><rect x="170" y="96" width="${trust * 4}" height="24" rx="4" fill="#15803d"/><text class="txt sm b" x="${178 + trust * 4}" y="113">${trust}%</text>`
      + `<text class="txt sm" x="24" y="156">${esc(P('Perceived Fairness', 'निष्पक्षता बोध'))}</text><rect x="170" y="138" width="${fair * 4}" height="24" rx="4" fill="#1d4ed8"/><text class="txt sm b" x="${178 + fair * 4}" y="155">${fair}%</text>`
      + `<text class="txt sm mut" x="24" y="196">${esc(P(a.descEn, a.descHi))}</text></svg>`;
    return {
      svg,
      aria: `${a.en}: trust ${trust}%, fairness ${fair}%`,
      lines: [
        { en: `${a.en} (${a.ex}): ${a.descEn}`, hi: `${a.hi} (${a.exHi}): ${a.descHi}`, cls: S.listening ? 'balanced' : 'warn' },
        { en: S.listening ? 'Public transparency boosts trust across every style — functional rules still feel just when explained openly.' : 'Without public hearing, even welfare programmes suffer mistrust and error.', hi: S.listening ? 'जन-पारदर्शिता हर प्रकार में विश्वास बढ़ाती है — खुले स्पष्टीकरण से नियम भी न्यायपूर्ण लगते हैं।' : 'जन-सुनवाई के बिना कल्याणकारी योजनाएँ भी अविश्वास व त्रुटियों का शिकार होती हैं।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Compare all three styles with public hearing on vs off.', 'जन-सुनवाई चालू व बंद करके तीनों शैलियों की तुलना करें।'),
    b('Why do democracies need all three — functional order, sensitive listening, and welfare goals?', 'लोकतंत्र को तीनों — कार्यात्मक व्यवस्था, संवेदनशील सुनवाई और कल्याण लक्ष्य — की आवश्यकता क्यों है?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('A disaster relief team distributes food prioritising elderly and injured residents while explaining rules clearly. Which type of authority is strongest?', 'एक आपदा राहत दल बुज़ुर्गों व घायलों को प्राथमिकता देते हुए नियम स्पष्ट करता है। कौन-सा प्राधिकार प्रमुख है?'),
    options: [opt('wel', 'Welfare-oriented & sensitive authority', 'कल्याणकारी व संवेदनशील प्राधिकार'), opt('sec', 'Blind force without listening', 'बिना सुने अंधा बल')],
    run: (S) => { S.atype = 'welfare'; S.listening = true; return 'wel'; },
    explain: () => b('Serving public need while treating citizens with dignity combines welfare-oriented and sensitive authority.', 'नागरिकों की गरिमा रखते हुए जन-हित में कार्य करना कल्याणकारी व संवेदनशील प्राधिकार का संगम है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Which best illustrates "functional authority"?', '“कार्यात्मक प्राधिकार” का सबसे अच्छा उदाहरण कौन-सा है?'),
    correct: 'traf',
    options: [
      opt('traf', 'An umpire enforcing cricket rules impartially so every player plays safely.', 'निष्पक्ष रूप से क्रिकेट नियम लागू करने वाला अंपायर ताकि सभी सुरक्षित खेलें।'),
      opt('boss', 'Punishing only one team regardless of the rules.', 'नियमों की अनदेखी कर एक ही टीम को दंडित करना।', b('That is arbitrary misuse, not functional authority.', 'यह मनमाना दुरुपयोग है, कार्यात्मक प्राधिकार नहीं।')),
    ],
    explain: b('Functional authority exists to make collective activities fair, orderly, and predictable.', 'कार्यात्मक प्राधिकार सामूहिक गतिविधियों को निष्पक्ष व सुव्यवस्थित रखने के लिए होता है।'),
    hint: b('Check the Functional Authority card.', 'कार्यात्मक प्राधिकार कार्ड देखें।'),
  }],
  reflect: b('Which style of authority works best when resolving a disagreement between two classmates?', 'दो सहपाठियों के बीच विवाद सुलझाते समय प्राधिकार की कौन-सी शैली सबसे अच्छी काम करती है?'),
};

// ------------------------------------------------------------------ T14.L5 Citizen-to-Institution Grievance Workflow
export const citizenScenario = {
  id: 'T14.L5',
  objective: b('Walk through a citizen’s peaceful, lawful escalation from local ward office to ombudsperson and judicial review when a public service fails.', 'सार्वजनिक सेवा विफल होने पर नागरिक की स्थानीय वार्ड कार्यालय से लोकपाल और न्यायिक समीक्षा तक शांतिपूर्ण व कानूनी प्रक्रिया का अभ्यास करें।'),
  note: { kind: 'fictional', en: 'Fictional civic grievance escalation model demonstrating citizen discipline, due process, and institutional accountability.', hi: 'नागरिक अनुशासन, उचित प्रक्रिया और संस्थागत जवाबदेही दर्शाने वाला काल्पनिक जन-शिकायत मॉडल।' },
  init: () => ({ issue: 'water', daysWaited: 15, escalated: false }),
  controls: [
    { id: 'issue', type: 'chips', label: b('Civic issue', 'नागरिक समस्या'), options: [opt('water', 'Broken water pipe', 'टूटी जल पाइपलाइन'), opt('road', 'Unlit broken road', 'अँधेरी टूटी सड़क'), opt('ration', 'Delayed ration card', 'विलंबित राशन कार्ड')] },
    { id: 'daysWaited', type: 'slider', label: b('Days since lawful complaint filed', 'कानूनी शिकायत दर्ज होने के दिन'), min: 1, max: 35, step: 1 },
    { id: 'escalated', type: 'toggle', label: b('Escalate formally with RTI / petition', 'सूचना का अधिकार / याचिका से औपचारिक अपील') },
  ],
  view(S) {
    const wf = S_.citizenWorkflow(S);
    const g = wf.stages.map((st, i) => {
      const done = i <= wf.activeStage, y = 20 + i * 50;
      return `<rect x="24" y="${y}" width="592" height="38" rx="8" fill="${done ? '#15803d' : '#f1f5f9'}" fill-opacity="${done ? '.16' : '1'}" stroke="${done ? '#15803d' : '#cbd5e1'}" stroke-width="${done ? '2.4' : '1.2'}"/>`
        + `<text class="txt b" x="40" y="${y + 24}">${esc(P(st.en, st.hi))}</text>`
        + `<text class="txt sm" x="598" y="${y + 24}" text-anchor="end">${done ? esc(P('Active / Logged', 'सक्रिय / दर्ज')) : esc(P('Next step', 'अगला चरण'))}</text>`;
    }).join('');
    const svg = `<svg viewBox="0 0 640 225" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
    return {
      svg,
      aria: `Issue ${S.issue}, stage ${wf.activeStage + 1}, resolution likelihood ${wf.resolutionChance}%`,
      lines: [
        { en: `Current escalation level: ${wf.stages[wf.activeStage].en} — documented grievance resolution likelihood ~${wf.resolutionChance}%.`, hi: `वर्तमान स्तर: ${wf.stages[wf.activeStage].hi} — लिखित शिकायत समाधान संभावना ~${wf.resolutionChance}%।`, cls: 'balanced' },
        { en: 'Disciplined civic action (keeping receipts, filing peaceful RTI/appeals, and respecting courts) strengthens democracy far more than silent resignation or vandalism.', hi: 'अनुशासित नागरिक आचरण (रसीद रखना, शांतिपूर्ण आरटीआई/अपील और न्यायालय का सम्मान) चुप्पी या तोड़फोड़ की तुलना में लोकतंत्र को कहीं अधिक मजबूत करता है।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Slide days waited from 5 to 30 and switch on formal RTI/appeal to see how documented escalation advances the issue.', 'दिन 5 से 30 तक बढ़ाएँ और औपचारिक अपील चालू करके देखें कि लिखित प्रक्रिया समस्या को कैसे आगे बढ़ाती है।'),
    b('Why is keeping a complaint number or receipt essential before appealing to an Ombudsperson?', 'लोकपाल के पास अपील करने से पहले शिकायत संख्या या रसीद रखना क्यों आवश्यक है?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('If a municipal office ignores a water-pipe complaint for 30 days, what lawful step raises institutional accountability?', 'यदि नगर कार्यालय 30 दिनों तक जल-पाइप शिकायत पर ध्यान न दे, तो कौन-सा वैध कदम संस्थागत जवाबदेही बढ़ाता है?'),
    options: [opt('rti', 'Escalate with written receipt / RTI to appellate authority or Ombudsperson', 'लिखित रसीद / आरटीआई के साथ अपीलीय अधिकारी या लोकपाल के पास जाना'), opt('break', 'Damage public water tanks', 'सार्वजनिक पानी की टंकी को नुकसान पहुँचाना')],
    run: (S) => { S.daysWaited = 30; S.escalated = true; return 'rti'; },
    explain: () => b('Lawful, documented escalation preserves citizen discipline while forcing institutions to account for delays.', 'वैध व प्रलेखित अपील नागरिक अनुशासन बनाए रखते हुए संस्थाओं को देरी के लिए जवाबदेह बनाती है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('How do Fundamental Duties and Citizen Discipline connect to Rights?', 'मौलिक कर्तव्य और नागरिक अनुशासन अधिकारों से कैसे जुड़ते हैं?'),
    correct: 'both',
    options: [
      opt('both', 'Rights flourish when citizens uphold laws, pay taxes honestly, protect public property, and use peaceful accountability tools.', 'अधिकार तब फलते-फूलते हैं जब नागरिक कानून का पालन करें, सार्वजनिक संपत्ति की रक्षा करें और शांतिपूर्ण जवाबदेही अपनाएँ।'),
      opt('one', 'Citizens only need rights and never duties.', 'नागरिकों को केवल अधिकार चाहिए, कोई कर्तव्य नहीं।', b('Unchecked neglect weakens the very institutions that protect rights.', 'उपेक्षा से वे ही संस्थाएँ कमजोर होती हैं जो अधिकारों की रक्षा करती हैं।')),
    ],
    explain: b('Rights and duties reinforce one another in a constitutional republic.', 'संवैधानिक गणतंत्र में अधिकार और कर्तव्य एक-दूसरे को सशक्त करते हैं।'),
    hint: b('Look at the second readout line.', 'आँकड़े की दूसरी पंक्ति देखें।'),
  }],
  reflect: b('Draft a 2-sentence respectful complaint letter to a local ward office reporting a broken streetlight.', 'टूटी स्ट्रीटलाइट की शिकायत हेतु स्थानीय वार्ड कार्यालय को 2-वाक्य का विनम्र पत्र लिखें।'),
};
