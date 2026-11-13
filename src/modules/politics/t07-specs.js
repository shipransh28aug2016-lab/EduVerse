// T07 Elections lab specs (L1, L3, L4).
import * as E from '../../engines/domain/election.js';
import * as S_ from '../../engines/domain/society.js';
import { esc, fmt } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });

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
        en: 'Indian polling station courtyard: tap pins to walk step-by-step through the 4 ECI election phases.',
        hi: 'भारतीय मतदान केंद्र: निर्वाचन आयोग के चारों चुनावी चरणों को देखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 20, y: 60, en: 'Stage 1: Voter Roll Revision', hi: 'चरण 1: मतदाता सूची संशोधन', detail: b('Every citizen 18+ enters the roll under RPA 1950 before polls open.', 'RPA 1950 के अंतर्गत 18+ प्रत्येक पात्र नागरिक का नाम मतदाता सूची में दर्ज होता है।'), set: { stage: 1, independentEci: true } },
          { x: 44, y: 44, en: 'Stage 2: Model Code of Conduct', hi: 'चरण 2: आदर्श आचार संहिता', detail: b('Article 324 freezes new ruling-party schemes once polling dates are announced.', 'तिथि घोषित होते ही सत्तापक्ष नई योजनाओं से सरकारी संसाधनों का लाभ नहीं उठा सकता।'), set: { stage: 2, independentEci: true } },
          { x: 66, y: 54, en: 'Stage 3: Affidavits & Campaign', hi: 'चरण 3: शपथपत्र व चुनाव प्रचार', detail: b('Candidates disclose assets & legal records; campaigning pauses 48h pre-poll.', 'उम्मीदवार संपत्ति व आपराधिक विवरण देते हैं; मतदान से 48 घंटे पहले प्रचार बंद।'), set: { stage: 3, independentEci: true } },
          { x: 84, y: 58, en: 'Stage 4: EVM/VVPAT Secret Ballot', hi: 'चरण 4: EVM/VVPAT गुप्त मतदान', detail: b('Article 326 guarantees equal universal suffrage with paper-trail audit.', 'अनुच्छेद 326 कागज़ी पर्ची मिलान संग समान सार्वभौमिक मताधिकार देता है।'), set: { stage: 4, independentEci: true } },
        ],
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
      plate: {
        src: 'assets/images/plates/t07-delimitation.jpg',
        en: 'Delimitation Commission workbench: tap district puzzle, voter roll or surveyor compass to test boundary drawing fairness.',
        hi: 'परिसीमन आयोग कार्यमेज़: सीमा-मानचित्र, मतदाता सूची या दिशासूचक पर टैप कर निष्पक्षता परखें।',
        spots: [
          { x: 46, y: 56, en: 'Fair Horizontal Boundaries (300/seat)', hi: 'समान क्षैतिज परिसीमन', detail: b('Equal-population districts reflect the 51.1% vote majority cleanly.', 'समान जनसंख्या क्षेत्र 51.1% बहुमत के अनुरूप निष्पक्ष सीटें देते हैं।'), set: { scheme: 'rows' } },
          { x: 16, y: 28, en: 'Voter Roll Eligibility Check (18+)', hi: 'मतदाता सूची पात्रता जांच', detail: b('Test citizen age & ordinary residence under enumerator rules.', 'प्रगणक नियमों के तहत आयु (18+) और सामान्य निवास पात्रता परखें।'), set: { voterAge: 18, resident: true } },
          { x: 86, y: 72, en: 'Gerrymandering Trap (Pack A)', hi: 'पक्षपातपूर्ण परिसीमन (पैकिंग)', detail: b('Identical votes, twisted lines — watch the 48.9% minority win 2 of 3 seats!', 'वही मत, टेढ़ी रेखाएँ — 48.9% मत वाला दल 3 में से 2 सीटें जीत लेता है!'), set: { scheme: 'packedA' } },
        ],
      },
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
        en: 'Semicircular parliamentary chamber: tap pins to compare hung Proportional coalition benches vs FPTP swing majority.',
        hi: 'अर्धवृत्ताकार संसद कक्ष: आनुपातिक गठबंधन बनाम FPTP बहुमत देखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 26, y: 52, en: 'Proportional Hung House (Coalition)', hi: 'आनुपातिक त्रिशंकु सदन (गठबंधन)', detail: b('No single party hits 6/10 seats — partners negotiate a joint coalition.', 'कोई दल 6 सीटों तक नहीं पहुँचता — साझा कार्यक्रम पर गठबंधन बनता है।'), set: { system: 'proportional', swing: 0 } },
          { x: 54, y: 44, en: 'FPTP Single-Party Majority', hi: 'FPTP एकल-दल बहुमत', detail: b('With the exact same votes, FPTP hands one party 7/10 seats!', 'इन्हीं मतों से FPTP एक ही दल को 10 में से 7 सीटें दे देता है!'), set: { system: 'fptp', swing: 0 } },
          { x: 78, y: 60, en: '+10% Voter Swing Shift', hi: '+10% मत-झुकाव प्रभाव', detail: b('Watch a modest vote swing flip seat control across parties.', 'थोड़ा-सा मत-झुकाव भी सदन में बहुमत की तस्वीर कैसे बदलता है।'), set: { system: 'fptp', swing: 10 } },
        ],
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
