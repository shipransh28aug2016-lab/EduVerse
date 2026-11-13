// History Labs Part 2: T12.L1–L5 (Resistance & Resilience 1000–1700 CE) + T13.L2–L4 (India and the World-I).
import * as H from '../../engines/domain/history.js';
import { Chart } from '../../engines/chart.js';
import { indiaMapSvg, worldMapSvg, forceGraphSvg } from '../../engines/viz.js';
import { esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi) => ({ id, en, hi });

// ================================================================ T12.L1 Regional political maps & alliance scenario
const T12_MAPS = {
  1050: {
    en: 'c. 1050 CE: Chola Maritime Realm, Paramaras, Palas & Western Chalukyas',
    hi: 'लगभग 1050 ई.: चोल समुद्री राज्य, परमार, पाल व चालुक्य',
    states: { 'Tamil Nadu': '#0ea5e9', 'Andhra Pradesh': '#38bdf8', Karnataka: '#eab308', 'Madhya Pradesh': '#f59e0b', Bihar: '#22c55e', 'West Bengal': '#16a34a' },
    pts: [{ lon: 79.1, lat: 10.8, l: b('Thanjavur (Chola)', 'तंजावुर (चोल)') }, { lon: 77.4, lat: 23.2, l: b('Dhara / Bhojpur', 'धार / भोजपुर') }, { lon: 85.1, lat: 25.1, l: b('Vikramashila / Pala', 'विक्रमशिला / पाल') }],
    note: b('Multiple strong regional centres Patronised regional languages, temple towns, and Indian Ocean diplomacy.', 'कई मज़बूत क्षेत्रीय शक्तियों ने क्षेत्रीय भाषाओं, मंदिर नगरों और समुद्री कूटनीति को संरक्षण दिया।'),
  },
  1350: {
    en: 'c. 1350 CE: Delhi Sultanate, Vijayanagara, Bahmani & Eastern Ganga (Odisha)',
    hi: 'लगभग 1350 ई.: दिल्ली सल्तनत, विजयनगर, बहमनी व गजपति/गंग ओडिशा',
    states: { Delhi: '#dc2626', 'Uttar Pradesh': '#ef4444', Karnataka: '#f59e0b', 'Andhra Pradesh': '#fbbf24', Maharashtra: '#8b5cf6', Odisha: '#10b981', Assam: '#059669' },
    pts: [{ lon: 77.2, lat: 28.6, l: b('Delhi', 'दिल्ली') }, { lon: 76.5, lat: 15.3, l: b('Hampi (Vijayanagara)', 'हम्पी (विजयनगर)') }, { lon: 94.6, lat: 26.9, l: b('Ahom (Assam)', 'अहोम (असम)') }],
    note: b('As Sultanate control stretched thin, Vijayanagara, Bahmani, Mewar and the Ahom kingdom consolidated resilient regional governance.', 'सल्तनत विस्तार के बीच विजयनगर, बहमनी, मेवाड़ और अहोम राज्यों ने मज़बूत क्षेत्रीय प्रतिरोध व शासन खड़ा किया।'),
  },
  1680: {
    en: 'c. 1680 CE: Mughal Empire, Maratha Swarajya, Rajput & Ahom Resistance',
    hi: 'लगभग 1680 ई.: मुगल साम्राज्य, मराठा स्वराज्य, राजपूत व अहोम प्रतिरोध',
    states: { Delhi: '#7c3aed', 'Uttar Pradesh': '#8b5cf6', Maharashtra: '#ea580c', Rajasthan: '#f59e0b', Assam: '#10b981', Punjab: '#0284c7' },
    pts: [{ lon: 73.4, lat: 18.2, l: b('Raigad (Maratha)', 'रायगढ़ (मराठा)') }, { lon: 74.6, lat: 24.9, l: b('Chittor / Mewar', 'चित्तौड़ / मेवाड़') }, { lon: 91.7, lat: 26.1, l: b('Saraighat (Ahom)', 'सरायघाट (अहोम)') }],
    note: b('Hill-fort networks (Raigad, Chittor), riverine tactics (Lachit Borphukan at Saraighat) and local alliances preserved regional autonomy.', 'पहाड़ी दुर्ग नेटवर्क, नदी रणनीति (सरायघाट में लचित बोरफुकन) और स्थानीय गठबंधनों ने स्वायत्तता बचाई।'),
  },
};

export const regionalPolitiesMap = {
  id: 'T12.L1',
  objective: b('Compare dated political maps of India (1000–1700 CE) and analyse why terrain and local alliances shaped resistance and resilience.', '1000–1700 ई. के भारत के ऐतिहासिक मानचित्रों की तुलना करें और समझें कि भूभाग व गठबंधनों ने प्रतिरोध को कैसे आकार दिया।'),
  note: { kind: 'reconstruction', en: 'Approximate regional spheres over modern Indian states (datta07/INDIAN-SHAPEFILES).', hi: 'अनुमानित क्षेत्रीय विस्तार आधुनिक राज्य सीमाओं पर दर्शाया गया है।' },
  init: () => ({ year: '1350', alliance: true }),
  controls: [
    { id: 'year', type: 'chips', label: b('Snapshot year', 'वर्ष चुनें'), options: [opt('1050', 'c. 1050 CE', '1050 ई.'), opt('1350', 'c. 1350 CE', '1350 ई.'), opt('1680', 'c. 1680 CE', '1680 ई.')] },
    { id: 'alliance', type: 'toggle', label: b('Cross-community & terrain defence pact', 'स्थानीय गठबंधन व भूभाग रक्षा नीति') },
  ],
  view(S) {
    const m = T12_MAPS[S.year];
    const markers = m.pts.map((p) => ({ lon: p.lon, lat: p.lat, r: 7.5, fill: '#b91c1c', pulse: true, label: p.l }));
    const svg = indiaMapSvg({ w: 640, h: 410, stateColors: m.states, markers, aria: m.en });
    return {
      plate: {
        src: 'assets/images/plates/t12-heritage.jpg',
        en: 'Regional capitals & fortifications (1000–1700 CE) — tap pins to shift historical snapshot and test alliances.',
        hi: '1000–1700 ई. की क्षेत्रीय शक्तियाँ व दुर्ग — ऐतिहासिक वर्ष व रक्षा गठबंधन बदलने हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 52, en: 'c. 1050 CE Chola & Paramara Realms', hi: 'ल. 1050 ई. चोल व परमार राज्य', detail: b('Maritime Cholas, Dhara & Pala universities flourished across vibrant regions.', 'तंजावुर, धार व पाल केंद्रों ने कला व समुद्री कूटनीति बढ़ाई।'), set: { year: '1050' } },
          { x: 52, y: 42, en: 'c. 1350 CE Hampi, Mewar & Ahom', hi: 'ल. 1350 ई. हम्पी, मेवाड़ व अहोम', detail: b('Vijayanagara, Eastern Ganga & Ahom fortified regional states resiliently.', 'विजयनगर, ओडिशा व अहोम ने सुदृढ़ क्षेत्रीय स्वायत्तता खड़ी की।'), set: { year: '1350' } },
          { x: 74, y: 66, en: 'c. 1680 CE Maratha Swarajya & Saraighat', hi: 'ल. 1680 ई. मराठा व सरायघाट', detail: b('Hill forts and Brahmaputra river tactics checked imperial overreach.', 'पहाड़ी दुर्ग व नदी युद्ध नीति ने साम्राज्य विस्तार को रोका।'), set: { year: '1680', alliance: true } },
        ],
      },
      svg,
      aria: m.en,
      lines: [
        { en: m.en, hi: m.hi, cls: 'balanced' },
        m.note,
        S.alliance
          ? b('Alliance scenario: combining hill forts, river fleets and local agricultural trust raises regional resilience sharply.', 'गठबंधन स्थिति: पहाड़ी दुर्ग, नदी बेड़ा और स्थानीय किसानों का विश्वास क्षेत्रीय दृढ़ता बढ़ाते हैं।')
          : b('Fragmented scenario: rival neighbouring chiefs acting alone face higher risk of piecemeal defeat.', 'विभाजित स्थिति: आपस में लड़ते पड़ोसी शासकों के अलग-अलग हारने का जोखिम बढ़ता है।'),
      ],
    };
  },
  discover: [b('Compare 1350 CE and 1680 CE maps. Notice which forested/hill regions (Assam, Western Ghats, Mewar) repeatedly checked imperial expansion.', '1350 और 1680 ई. के मानचित्र देखें। किन पहाड़ी/वनाच्छादित क्षेत्रों ने बार-बार अपनी स्वायत्तता बचाई?')],
  predictions: [
    {
      id: 'p1',
      stem: b('How did the Ahom kingdom defeat larger invading armies at Saraighat (1671) along the Brahmaputra?', 'अहोम राज्य ने 1671 में सरायघाट पर विशाल आक्रमणकारी सेना को कैसे रोका?'),
      options: [opt('river', 'By using monsoon floods, river-boat warfare, bamboo stockades and hill terrain to their advantage', 'मानसूनी बाढ़, नदी-नौका युद्ध, बाँस की बाड़ व पहाड़ी भूभाग का कुशल उपयोग कर'), opt('desert', 'By fighting on open flat sand dunes', 'खुले रेगिस्तानी टीलों पर लड़कर')],
      run: (S) => { S.year = '1680'; S.alliance = true; return 'river'; },
      explain: () => b('Ahom commander Lachit Borphukan lured the heavy fleet into narrow Brahmaputra river bends where nimble boats prevailed.', 'अहोम सेनापति लचित बोरफुकन ने ब्रह्मपुत्र के संकरे मोड़ पर चुस्त नौकाओं से भारी बेड़े को हराया।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why was no single ruler able to easily erase regional kingdoms across India between 1000 and 1700 CE?', '1000 से 1700 ई. के बीच कोई भी एक सत्ता पूरे भारत के क्षेत्रीय राज्यों को आसानी से समाप्त क्यों नहीं कर पाई?'),
      correct: 'geo',
      options: [
        { id: 'geo', ...b('Mountain/river geography (Western Ghats, Aravalli, Brahmaputra) plus deep-rooted local identities and forts.', 'पर्वत-नदी भूगोल, सुदृढ़ दुर्ग और गहरी स्थानीय सांस्कृतिक जड़ें।') },
        { id: 'empty', ...b('There were no towns or armies outside Delhi.', 'दिल्ली के बाहर कोई नगर या सेना ही नहीं थी।'), why: b('Hampi, Thanjavur, Chittor and Garhgaon were wealthy, fortified capitals.', 'हम्पी, तंजावुर, चित्तौड़ व गढ़गाँव समृद्ध दुर्ग-नगर थे।') },
      ],
      explain: b('Geographic diversity and strong regional governance fostered persistent political and cultural resilience.', 'भौगोलिक विविधता व मज़बूत क्षेत्रीय शासन ने निरंतर दृढ़ता बनाए रखी।'),
      hint: b('Look at the three markers on the 1680 CE map.', '1680 ई. के मानचित्र के तीन चिह्न देखें।'),
    },
  ],
  reflect: b('Why is studying regional powers like Vijayanagara, Ahoms, Mewar and the Marathas essential alongside Delhi/Agra chronicles?', 'दिल्ली/आगरा के विवरणों के साथ विजयनगर, अहोम, मेवाड़ और मराठा जैसे क्षेत्रीय राज्यों का अध्ययन क्यों ज़रूरी है?'),
};

// ================================================================ T12.L2 3D Fort Cutaway & Design Challenge
export const fortBuilder = {
  id: 'T12.L2',
  objective: b('Design an Indian hill fort balancing bastions, bent defensive gates, double walls, rainwater cisterns and grain storage against long sieges.', 'लंबे घेरे से बचने के लिए बुर्ज, टेढ़े द्वार, दोहरी प्राचीर, वर्षा-जल कुंड व अन्न भंडार के साथ भारतीय पहाड़ी दुर्ग का डिज़ाइन बनाएँ।'),
  note: { kind: 'reconstruction', en: 'Inspired by Chittorgarh, Kumbhalgarh, Raigad and Golconda fort engineering; paired with 3D model.', hi: 'चित्तौड़गढ़, कुंभलगढ़, रायगढ़ व गोलकोंडा के दुर्ग अभियांत्रिकी से प्रेरित; 3D मॉडल सहित।' },
  init: () => ({ bastions: 4, bentGate: true, cisterns: 3, granaryMonths: 8, doubleWall: true }),
  controls: [
    { id: 'bastions', type: 'slider', label: b('Corner/flank bastions (burj)', 'बुर्ज संख्या'), min: 2, max: 8, step: 1 },
    { id: 'bentGate', type: 'toggle', label: b('Zig-zag bent gate (stops elephant charges)', 'टेढ़ा मुख्य द्वार (हाथी हमले रोकने हेतु)') },
    { id: 'doubleWall', type: 'toggle', label: b('Double concentric inner rampart', 'दोहरी भीतरी प्राचीर') },
    { id: 'cisterns', type: 'slider', label: b('Rock-cut rainwater cisterns (baori/tanka)', 'वर्षा जल कुंड / बावड़ी'), min: 0, max: 5, step: 1 },
    { id: 'granaryMonths', type: 'slider', label: b('Stored grain supply (months)', 'अन्न भंडार (महीने)'), min: 2, max: 14, step: 2 },
  ],
  view(S) {
    const f = H.fortDesign(S);
    let g = `<rect x="20" y="16" width="600" height="220" rx="10" fill="#e7e5e4" stroke="#78716c"/>`;
    // Plan view of fort
    g += `<rect x="70" y="34" width="320" height="184" rx="10" fill="#d6b48c" stroke="#7c2d12" stroke-width="5"/>`;
    if (S.doubleWall) g += `<rect x="115" y="64" width="230" height="124" rx="6" fill="none" stroke="#9a3412" stroke-width="4" stroke-dasharray="10 4"/>`;
    for (let i = 0; i < S.bastions; i++) {
      const ang = (i / S.bastions) * Math.PI * 2;
      const bx = 230 + Math.cos(ang) * 155, by = 126 + Math.sin(ang) * 88;
      g += `<circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="11" fill="#7c2d12" stroke="#fff" stroke-width="1.5"/>`;
    }
    if (S.bentGate) g += `<path d="M210,218 L210,235 L252,235" fill="none" stroke="#1e293b" stroke-width="6"/><text class="txt sm b" x="230" y="210" text-anchor="middle">${esc(P('Bent gate', 'टेढ़ा द्वार'))}</text>`;
    for (let i = 0; i < S.cisterns; i++) g += `<rect x="${145 + i * 32}" y="135" width="22" height="22" rx="3" fill="#0284c7" stroke="#fff"/>`;
    g += `<rect x="180" y="84" width="100" height="34" rx="4" fill="#a16207"/><text class="txt sm b" x="230" y="105" text-anchor="middle" fill="#fff">${esc(P('Granary', 'अन्नागार'))}</text>`;
    // Score readouts on right
    const col = f.overall >= 75 ? '#146c2e' : f.overall >= 50 ? '#d97706' : '#c0392b';
    g += `<text class="txt b" x="505" y="68" text-anchor="middle">${esc(P('Defence', 'रक्षा'))}: ${f.defence}%</text>`;
    g += `<text class="txt b" x="505" y="108" text-anchor="middle">${esc(P('Siege endurance', 'घेराबंदी सहन'))}: ${f.siegeEndurance}%</text>`;
    g += `<text class="txt b" x="505" y="158" text-anchor="middle" fill="${col}">${esc(P('Overall fort score', 'कुल दुर्ग स्कोर'))}: ${f.overall}%</text>`;
    return {
      plate: {
        src: 'assets/images/t12.jpg',
        en: 'Indian sandstone hill-fort bastions, double ramparts and stepped cistern — tap pins to configure siege defences.',
        hi: 'पहाड़ी दुर्ग के बुर्ज, दोहरी प्राचीर व वर्षा-जल कुंड — घेराबंदी रक्षा परखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 28, y: 44, en: '8 Flank Bastions + Double Rampart', hi: '8 बुर्ज व दोहरी प्राचीर', detail: b('Layered circular bastions give defenders cross-fire coverage.', 'गोलाकार बुर्ज व दोहरी दीवारें चारों ओर से रक्षकों को सुरक्षित कोण देती हैं।'), set: { bastions: 8, doubleWall: true } },
          { x: 56, y: 64, en: 'Zig-Zag Bent Gate (Hathipol)', hi: 'टेढ़ा द्वार (हाथीपोल)', detail: b('Sharp 90° turn breaks war-elephant ramming charges instantly.', '90° का मोड़ भारी दरवाज़ों पर हाथी के सीधे प्रहार का वेग तोड़ देता है।'), set: { bentGate: true } },
          { x: 80, y: 58, en: '5 Baori Cisterns + 12-Mo Granary', hi: '5 जल बावड़ी व 12 माह अन्न', detail: b('Captured monsoon rock cisterns let defenders outlast dry-season sieges.', 'चट्टानी वर्षा-जल कुंड सूखे मौसम की लंबी घेराबंदी में भी जीवन बचाते हैं।'), set: { cisterns: 5, granaryMonths: 12 } },
        ],
      },
      svg: `<svg viewBox="0 0 640 250" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Fort design score ${f.overall}%: defence ${f.defence}%, endurance ${f.siegeEndurance}%`,
      lines: [
        { en: `Fort readiness ${f.overall}% (Wall defence ${f.defence}%, Water & grain siege survival ${f.siegeEndurance}%).`, hi: `दुर्ग तत्परता ${f.overall}% (प्राचीर रक्षा ${f.defence}%, जल व अन्न सहनशक्ति ${f.siegeEndurance}%)।`, cls: f.overall >= 75 ? 'balanced' : 'warn' },
        b('Forts rarely fell to direct wall assault—most sieges hinged on whether cisterns and granaries lasted until monsoon.', 'अधिकतर दुर्ग सीधी दीवार टूटने से नहीं, बल्कि जल और अन्न समाप्त होने पर ही घिरते थे।'),
      ],
    };
  },
  discover: [b('Give your fort 8 bastions and double walls, then set cisterns to 0. Why does siege endurance drop dramatically?', '8 बुर्ज व दोहरी दीवार रखकर जल कुंड 0 कर दें। घेराबंदी क्षमता तेज़ी से क्यों गिरती है?')],
  predictions: [
    {
      id: 'p1',
      stem: b('Why did Indian hill forts build L-shaped or zig-zag gateways (like Hathipol) rather than straight entrances?', 'भारतीय पहाड़ी दुर्गों में सीधे प्रवेश द्वार के बजाय L-आकार या टेढ़ा द्वार क्यों बनाया जाता था?'),
      options: [opt('charge', 'To block war elephants from charging at full speed into wooden gates while exposing attackers to flanking walls', 'ताकि युद्ध-हाथी पूरी गति से लकड़ी के फाटक न तोड़ सकें और हमलावर दीवारों की मार में आएँ'), opt('view', 'So carts could drive faster', 'ताकि गाड़ियाँ तेज़ निकल सकें')],
      run: (S) => { S.bentGate = true; return 'charge'; },
      explain: () => b('A 90-degree turn kills momentum before battering the iron-spiked teak doors.', '90 डिग्री का मोड़ दरवाज़े तोड़ने की गति को खत्म कर देता था।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('What single inner feature let hill forts like Chittorgarh or Raigad endure months-long sieges far above rivers?', 'नदियों से बहुत ऊँचाई पर स्थित चित्तौड़गढ़ या रायगढ़ जैसे दुर्गों को महीनों की घेराबंदी सहने की शक्ति किसने दी?'),
      correct: 'water',
      options: [
        { id: 'water', ...b('Rock-cut rainwater cisterns, stepwells (baoris) and underground granaries catching monsoon rain.', 'मानसूनी वर्षा सहेजने वाले पहाड़ी जल कुंड, बावड़ियाँ व भूमिगत अन्नागार।') },
        { id: 'tunnel', ...b('Plastic water pipes pumped by diesel engines.', 'डीज़ल पंप से चलने वाले प्लास्टिक पाइप।'), why: b('Medieval forts engineered gravity catchment channels into stone reservoirs.', 'मध्यकालीन दुर्गों ने ढलान चैनलों से पत्थर के कुंडों में वर्षा जल संचित किया।') },
      ],
      explain: b('Water engineering on stone summits was as decisive as thick bastions.', 'पहाड़ी शिखर पर जल अभियांत्रिकी मोटी दीवारों जितनी ही निर्णायक थी।'),
      hint: b('Slide Rock-cut cisterns from 0 to 4.', 'वर्षा जल कुंड स्लाइडर को 0 से 4 पर ले जाएँ।'),
    },
  ],
  reflect: b('Notice how a fort is both a military shelter and a miniature planned water-harvesting city. What happens inside if water runs out?', 'ध्यान दें कि दुर्ग केवल किला नहीं बल्कि एक लघु जल-संचयन नगर भी है। जल समाप्त होने पर भीतर क्या स्थिति होगी?'),
};

// ================================================================ T12.L3 Art, architecture & literature gallery
const HERITAGE_T12 = {
  arch: { en: 'Temple & Indo-Islamic Synthesis Architecture', hi: 'मंदिर व इंडो-इस्लामिक स्थापत्य संश्लेषण', ex: b('Hampi stone chariot & musical pillars (Vijayanagara), Konark wheel, Qutb/Gol Gumbaz arches, stepwells (Rani ki Vav) blending stone corbelling, domes and carvings.', 'हम्पी का पाषाण रथ व संगीत स्तंभ, कोणार्क चक्र, गोल गुंबज़ व रानी की वाव—पत्थर नक्काशी, मेहराब व गुंबद का अद्भुत संगम।') },
  paint: { en: 'Miniature Painting Schools (Mughal, Rajasthani, Pahari)', hi: 'लघु चित्रकला शैलियाँ (मुगल, राजस्थानी, पहाड़ी)', ex: b('Natural mineral pigments on handmade paper illustrating epics, ragamala music moods, nature birds and court chronicles.', 'हस्तनिर्मित कागज़ पर खनिज रंगों से महाकाव्यों, रागमाला, पक्षियों व दरबारी प्रसंगों का सूक्ष्म अंकन।') },
  lit: { en: 'Rise of Regional Languages & Literature', hi: 'क्षेत्रीय भाषाओं व साहित्य का उत्कर्ष', ex: b('Tamil (Kamban), Marathi (Jnaneshwari), Awadhi (Tulsidas/Jayasi), Assamese (Sankardev Ankia Nat), Kannada Vachanas and Persian histories brought literature to everyday citizens.', 'तमिल, मराठी, अवधी, असमिया, कन्नड़ वचन और फ़ारसी इतिहास ने साहित्य को जनसामान्य की भाषा में पहुँचाया।') },
};

export const heritageGallery = {
  id: 'T12.L3',
  objective: b('Examine continuity and innovation in Indian art, architecture and regional languages between 1000 and 1700 CE.', '1000 से 1700 ई. के बीच भारतीय कला, स्थापत्य और क्षेत्रीय भाषाओं में निरंतरता व नवाचार का अन्वेषण करें।'),
  note: { kind: 'documented', en: 'Curated synthesis of UNESCO & NCERT heritage monuments and literary traditions.', hi: 'यूनेस्को व एनसीईआरटी धरोहर स्मारकों और साहित्य परंपराओं का संकलित विवरण।' },
  init: () => ({ cat: 'arch' }),
  controls: [{ id: 'cat', type: 'chips', label: b('Heritage gallery', 'धरोहर दीर्घा'), options: Object.entries(HERITAGE_T12).map(([id, o]) => ({ id, en: o.en.split(' (')[0], hi: o.hi.split(' (')[0] })) }],
  view(S) {
    const h = HERITAGE_T12[S.cat];
    const svg = `<svg viewBox="0 0 640 180" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="16" width="604" height="148" rx="12" fill="#fae8ff" stroke="#7e22ce" stroke-width="2.5"/><text class="txt b" x="320" y="68" text-anchor="middle">${esc(P(h.en, h.hi))}</text><text class="txt sm mut" x="320" y="106" text-anchor="middle">${esc(P('Craft Guilds · Patronage · Multilingual Exchange', 'शिल्पी संघ · संरक्षण · बहुभाषी आदान-प्रदान'))}</text></svg>`;
    const plate = S.cat === 'arch'
      ? {
          src: 'assets/images/plates/t12-heritage.jpg',
          en: 'Carved mandapa pillars, scalloped arches & stepped reservoir — tap pins to explore Architecture, Painting & Literature.',
          hi: 'तराशे मंडप स्तंभ, मेहराब व सीढ़ीदार कुंड — स्थापत्य, चित्रकला व साहित्य देखने हेतु पिन पर टैप करें।',
          spots: [
            { x: 14, y: 52, en: 'Stone-Carved Pillars & Corbels', hi: 'तराशे पाषाण स्तंभ', detail: b('Indigenous craft guilds blended lotus carvings into Indo-Islamic arches.', 'भारतीय शिल्पियों ने स्थानीय नक्काशी को मेहराबों व गुंबदों से जोड़ा।'), set: { cat: 'arch' } },
            { x: 46, y: 40, en: 'Miniature Painting Workshops', hi: 'लघु चित्रकला शालाएँ', detail: b('Switch exhibit to mineral-pigment court & hill miniatures.', 'खनिज रंगों की मुगल, राजस्थानी व पहाड़ी लघुचित्र शैली देखें।'), set: { cat: 'paint' } },
            { x: 70, y: 74, en: 'Regional Vernacular Literature', hi: 'क्षेत्रीय लोकभाषा साहित्य', detail: b('Switch exhibit to Tamil, Marathi, Awadhi, Kannada & Assamese classics.', 'तमिल, मराठी, अवधी, कन्नड़ व असमिया साहित्य का उत्कर्ष देखें।'), set: { cat: 'lit' } },
          ],
        }
      : {
          src: 'assets/images/plates/t12-miniature.jpg',
          en: 'Artisan painting a regional miniature using mineral pigments — tap pins to switch gallery exhibits.',
          hi: 'खनिज रंगों से लघुचित्र बनाते कलाकार — प्रदर्श बदलने हेतु पिन पर टैप करें।',
          spots: [
            { x: 30, y: 46, en: 'Stone & Stepwell Architecture', hi: 'स्थापत्य संश्लेषण', detail: b('Inspect Hampi, Konark & Rani ki Vav craft traditions.', 'हम्पी, कोणार्क व रानी की वाव स्थापत्य परंपरा देखें।'), set: { cat: 'arch' } },
            { x: 58, y: 58, en: 'Mineral Pigments & Ragamala Art', hi: 'खनिज रंग व लघुचित्र', detail: b('Inspect Mughal, Rajasthani & Pahari miniature albums.', 'मुगल, राजस्थानी व पहाड़ी चित्रकला शैली देखें।'), set: { cat: 'paint' } },
            { x: 82, y: 66, en: 'Vernacular Epics & Plays', hi: 'लोकभाषा महाकाव्य व नाटक', detail: b('Inspect everyday spoken tongues replacing court exclusivity.', 'जनसामान्य की बोलियों में रचे गए साहित्य का विस्तार देखें।'), set: { cat: 'lit' } },
          ],
        };
    return { plate, svg, aria: h.en, lines: [{ en: h.en, hi: h.hi, cls: 'balanced' }, h.ex] };
  },
  discover: [b('Inspect Architecture, Paintings and Literature. How did temple/fort artisans borrow motifs across regions?', 'स्थापत्य, चित्रकला व साहित्य देखें। शिल्पकारों ने विभिन्न क्षेत्रों की शैलियों को आपस में कैसे जोड़ा?')],
  predictions: [
    {
      id: 'p1',
      stem: b('Why did literature in Marathi, Awadhi, Tamil, Bengali and Assamese flourish rapidly during 1100–1700 CE?', '1100–1700 ई. में मराठी, अवधी, तमिल, बांग्ला व असमिया साहित्य इतनी तेज़ी से क्यों फला-फूला?'),
      options: [opt('people', 'Poets and saints composed songs, plays and epics in spoken regional tongues everyone understood', 'संतों और कवियों ने जनसामान्य की बोलचाल की भाषाओं में गीत व काव्य रचे'), opt('ban', 'All books were burned', 'सभी पुस्तकें जला दी गईं')],
      run: (S) => { S.cat = 'lit'; return 'people'; },
      explain: () => b('Vernacular poetry carried philosophical debates directly from scholar halls to villages and craftsfolk.', 'लोकभाषा काव्य ने दार्शनिक विचारों को गाँवों व शिल्पियों के घरों तक पहुँचाया।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('What does the blend of stone brackets, domes, stepwells and floral calligraphy in 15th–17th century Indian buildings show?', '15वीं–17वीं सदी की इमारतों में पत्थर के तोड़े, गुंबद, बावड़ी व बेलबूटे का मिश्रण क्या दर्शाता है?'),
      correct: 'synth',
      options: [
        { id: 'synth', ...b('Artisan workshops merged indigenous stone-carving skills with West/Central Asian arches and domes.', 'भारतीय कारीगरों ने स्वदेशी पत्थर-शिल्प को पश्चिम/मध्य एशियाई मेहराब व गुंबद तकनीकों से जोड़ा।') },
        { id: 'copy', ...b('No local artisans worked on any building.', 'किसी स्थानीय कारीगर ने काम नहीं किया।'), why: b('Local stone masons carved motifs like lotuses, bells and jharokhas into shared designs.', 'स्थानीय संगतराशों ने कमल, झरोखे व कलश जैसी आकृतियाँ रचीं।') },
      ],
      explain: b('Cultural interaction produced distinctive Indian regional and imperial styles.', 'सांस्कृतिक संवाद से विशिष्ट भारतीय स्थापत्य शैलियाँ जन्मीं।'),
      hint: b('Open the Architecture card.', 'स्थापत्य कार्ड खोलें।'),
    },
  ],
  reflect: b('Name one monument, painting style, or song tradition from your state and what makes it distinctive.', 'अपने राज्य के किसी एक स्मारक, चित्रकला शैली या लोकगीत परंपरा का नाम व विशेषता लिखें।'),
};

// ================================================================ T12.L4 Bhakti tradition network map
const BHAKTI_SAINTS = [
  { id: 'alvar', lon: 79.1, lat: 10.8, en: 'Alvars & Nayanars (Tamil Nadu, 6th–9th c.)', hi: 'अलवार व नयनार (तमिलनाडु)' },
  { id: 'basava', lon: 75.7, lat: 16.8, en: 'Basavanna & Akka Mahadevi (Karnataka, 12th c.)', hi: 'बसवन्ना व अक्का महादेवी (कर्नाटक)' },
  { id: 'warkari', lon: 75.3, lat: 17.7, en: 'Jnaneshwar, Tukaram & Janabai (Maharashtra)', hi: 'ज्ञानेश्वर, तुकाराम व जनाबाई (महाराष्ट्र)' },
  { id: 'kabir', lon: 83.0, lat: 25.3, en: 'Kabir, Ravidas & Tulsidas (Varanasi)', hi: 'कबीर व रविदास (वाराणसी)' },
  { id: 'nanak', lon: 74.8, lat: 31.6, en: 'Guru Nanak Dev (Punjab, Langar equality)', hi: 'गुरु नानक देव (पंजाब)' },
  { id: 'mira', lon: 73.9, lat: 25.8, en: 'Mirabai (Merta / Mewar, Rajasthan)', hi: 'मीराबाई (मेवाड़, राजस्थान)' },
  { id: 'sankardev', lon: 92.8, lat: 26.5, en: 'Srimanta Sankardev (Assam Namghar)', hi: 'श्रीमंत शंकरदेव (असम नामघर)' },
];

export const bhaktiNetwork = {
  id: 'T12.L4',
  objective: b('Map how Bhakti and Sufi traditions travelled across regions from South to North and East India, challenging caste/ritual barriers through vernacular devotion.', 'मानचित्र पर देखें कि भक्ति व सूफी परंपराएँ दक्षिण से उत्तर व पूर्व भारत में कैसे फैलीं और लोकभाषा द्वारा समता का संदेश दिया।'),
  note: { kind: 'documented', en: 'Approximate centres mapped on datta07/INDIAN-SHAPEFILES; dates span 7th to 17th centuries CE.', hi: '7वीं से 17वीं सदी ई. तक के प्रमुख केंद्र मानचित्र पर दर्शाए गए हैं।' },
  init: () => ({ focus: 'warkari' }),
  controls: [{ id: 'focus', type: 'chips', label: b('Saint / movement', 'संत / परंपरा चुनें'), options: BHAKTI_SAINTS.map((s) => ({ id: s.id, en: s.en.split(' (')[0], hi: s.hi.split(' (')[0] })) }],
  view(S) {
    const cur = BHAKTI_SAINTS.find((x) => x.id === S.focus) || BHAKTI_SAINTS[0];
    const paths = [{ coords: BHAKTI_SAINTS.map((x) => [x.lon, x.lat]), stroke: '#c026d3', width: 2.8, dash: '6 4' }];
    const markers = BHAKTI_SAINTS.map((x) => ({ lon: x.lon, lat: x.lat, r: x.id === S.focus ? 9.5 : 5.5, fill: x.id === S.focus ? '#9333ea' : '#64748b', pulse: x.id === S.focus, label: x.id === S.focus ? { en: x.en.split(' (')[0], hi: x.hi.split(' (')[0] } : null }));
    const svg = indiaMapSvg({ w: 640, h: 410, paths, markers, aria: `Bhakti network map highlighting ${cur.en}` });
    return {
      plate: {
        src: 'assets/images/plates/t12-bhakti.jpg',
        en: 'Bhakti community gathering in spoken vernaculars — tap pins to spotlight Warkari, Kabir/Ravidas or Guru Nanak traditions.',
        hi: 'लोकभाषा में भक्ति कीर्तन समागम — वारकरी, कबीर/रविदास व गुरु नानक परंपरा देखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 26, y: 54, en: 'Maharashtra Warkari Abhangs', hi: 'महाराष्ट्र वारकरी अभंग', detail: b('Jnaneshwar, Tukaram & Janabai carried Marathi verse to pilgrims across castes.', 'ज्ञानेश्वर, तुकाराम व जनाबाई ने मराठी अभंगों से समता का संदेश दिया।'), set: { focus: 'warkari' } },
          { x: 54, y: 48, en: 'Varanasi Nirguna Verse (Kabir/Ravidas)', hi: 'कबीर व रविदास (वाराणसी)', detail: b('Artisan-poets challenged empty ritual and caste division in sharp couplets.', 'बुनकर व चर्मकार संतों ने दोहों से आडंबर व जाति-भेद को चुनौती दी।'), set: { focus: 'kabir' } },
          { x: 80, y: 60, en: 'Punjab Langar Equality (Guru Nanak)', hi: 'गुरु नानक व लंगर (पंजाब)', detail: b('Shared community meals made social equality everyday lived practice.', 'साझा लंगर ने समानता को कविता से दैनिक जीवन में उतारा।'), set: { focus: 'nanak' } },
        ],
      },
      svg,
      aria: cur.en,
      lines: [
        { en: cur.en, hi: cur.hi, cls: 'balanced' },
        b('Common thread across every centre: devotion open to all castes and women, sung in everyday spoken languages, shared via pilgrims, Langars & Namghars.', 'सभी केंद्रों का साझा सूत्र: हर जाति व महिला के लिए खुली भक्ति, लोकभाषा में गीत, व लंगर/नामघर जैसे साझा मंच।'),
      ],
    };
  },
  discover: [b('Trace the dashed route from Tamil Nadu → Karnataka → Maharashtra → Rajasthan/UP/Punjab → Assam.', 'तमिलनाडु से कर्नाटक, महाराष्ट्र, उत्तर भारत और असम तक जाती बिंदुकित रेखा देखें।')],
  predictions: [
    {
      id: 'p1',
      stem: b('How did Guru Nanak’s Langar and Sankardev’s Namghar reshape everyday community life?', 'गुरु नानक के लंगर और शंकरदेव के नामघर ने सामुदायिक जीवन को कैसे बदला?'),
      options: [opt('eq', 'Everyone sat and ate or sang side by side regardless of caste or wealth', 'जाति या धन के भेदभाव बिना सब साथ बैठकर भोजन व कीर्तन करते थे'), opt('sep', 'They closed doors to ordinary villagers', 'वे आम ग्रामीणों के लिए बंद थे')],
      run: (S) => { S.focus = 'nanak'; return 'eq'; },
      explain: () => b('Shared kitchens and community prayer halls turned equality from poetry into daily practice.', 'साझा रसोई व सभा-घरों ने समानता को कविता से दैनिक जीवन में उतारा।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why did Bhakti poets sing in Tamil, Marathi, Hindi/Awadhi and Assamese rather than keeping teachings locked in scholarly treatises?', 'भक्ति संतों ने उपदेश केवल कठिन शास्त्रों के बजाय तमिल, मराठी, अवधी और असमिया गीतों में क्यों गाए?'),
      correct: 'reach',
      options: [
        { id: 'reach', ...b('So farmers, artisans and families everywhere could understand, remember and sing them together.', 'ताकि किसान, शिल्पकार और सभी परिवार उन्हें समझ सकें, याद रख सकें व साथ गा सकें।') },
        { id: 'forget', ...b('So nobody could understand them.', 'ताकि कोई समझ न सके।'), why: b('Vernacular songs made philosophy accessible across regions.', 'लोकभाषा के गीतों ने दर्शन को सर्वसुलभ बनाया।') },
      ],
      explain: b('Oral songs carried ideas of compassion and dignity across the subcontinent.', 'मौखिक पदों ने करुणा व समानता के विचार पूरे उपमहाद्वीप में पहुँचाए।'),
      hint: b('Click through three saints on the India map.', 'मानचित्र पर तीन संतों को चुनें।'),
    },
  ],
  reflect: b('Recall any couplet (doha), abhang, vachana or bhajan you have heard in your home region and what social message it gives.', 'अपने क्षेत्र का कोई दोहा, अभंग, वचन या भजन याद करें और बताएँ कि वह क्या सामाजिक संदेश देता है।'),
};

// ================================================================ T12.L5 Continuity-and-change timeline
export const continuityTimeline = {
  id: 'T12.L5',
  objective: b('Distinguish continuities from changes in economy, agriculture, currency and state governance across 1000–1700 CE.', '1000–1700 ई. में अर्थव्यवस्था, कृषि, मुद्रा और राज्य शासन में निरंतरता तथा परिवर्तन की पहचान करें।'),
  note: { kind: 'documented', en: 'Key economic and institutional shifts across seven centuries.', hi: 'सात शताब्दियों के प्रमुख आर्थिक व संस्थागत बदलाव।' },
  init: () => ({ area: 'agri' }),
  controls: [{ id: 'area', type: 'chips', label: b('Domain of change', 'क्षेत्र चुनें'), options: [opt('agri', 'Agriculture & irrigation', 'कृषि व सिंचाई'), opt('money', 'Coins, Hundis & trade', 'मुद्रा, हुंडी व व्यापार'), opt('state', 'Village council vs state', 'ग्राम समाज व राज्य')] }],
  view(S) {
    const info = {
      agri: { c: b('Continuity: Monsoon farming, village ploughs & traditional tanks.', 'निरंतरता: मानसूनी खेती, हल व पारंपरिक तालाब।'), ch: b('Change: Persian wheel (rahat) lifted well water deeper; New-World crops (potato, chilli, maize) arrived in 16th–17th c.', 'परिवर्तन: रहट (पर्शियन व्हील) से गहरे कुओं से सिंचाई; 16वीं–17वीं सदी में आलू, मिर्च, मक्का जैसी नई फसलें आईं।') },
      money: { c: b('Continuity: Indian spices, cotton textiles & coastal ports remained prized globally.', 'निरंतरता: भारतीय मसाले, सूती वस्त्र व तटीय बंदरगाह विश्व-प्रसिद्ध बने रहे।'), ch: b('Change: Standard silver tanka/rupaiya coins + Hundi (paper bills of exchange) linked Surat, Agra & Dhaka banks.', 'परिवर्तन: मानक चाँदी का टंका/रुपया और हुंडी (कागज़ी विनिमय पत्र) ने सूरत, आगरा व ढाका के व्यापार को जोड़ा।') },
      state: { c: b('Continuity: Village panchayats & caste/craft guilds settled most daily local disputes.', 'निरंतरता: ग्राम पंचायतें व शिल्पी संघ रोज़मर्रा के स्थानीय विवाद सुलझाते रहे।'), ch: b('Change: Written land-revenue registers (zabt / Todar Mal surveys), gun-powder artillery & mansab/jagirdari ranks.', 'परिवर्तन: लिखित भूमि-राजस्व पंजिका (ज़ब्त प्रणाली), बारूद तोपखाना व मनसबदारी व्यवस्था आई।') },
    }[S.area];
    const svg = `<svg viewBox="0 0 640 190" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><line x1="50" y1="95" x2="590" y2="95" stroke="var(--pri)" stroke-width="5"/><g data-set='{"area":"agri"}' role="button" tabindex="0"><circle cx="90" cy="95" r="${S.area === 'agri' ? 14 : 10}" fill="var(--pri)"/><text class="txt sm b" x="90" y="68" text-anchor="middle">1000 CE · ${esc(P('Farms & Rahat', 'कृषि व रहट'))}</text></g><g data-set='{"area":"money"}' role="button" tabindex="0"><circle cx="320" cy="95" r="${S.area === 'money' ? 14 : 10}" fill="var(--pri)"/><text class="txt sm b" x="320" y="68" text-anchor="middle">1350 CE · ${esc(P('Coins & Hundi', 'मुद्रा व हुंडी'))}</text></g><g data-set='{"area":"state"}' role="button" tabindex="0"><circle cx="550" cy="95" r="${S.area === 'state' ? 14 : 10}" fill="var(--pri)"/><text class="txt sm b" x="550" y="68" text-anchor="middle">1700 CE · ${esc(P('Panchayat & Zabt', 'पंचायत व ज़ब्त'))}</text></g><text class="txt b" x="320" y="148" text-anchor="middle">${esc(P('Both enduring village roots & accelerating innovations', 'ग्रामीण निरंतरता और तेज़ नवाचार दोनों एक साथ'))}</text></svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t12-heritage.jpg',
        en: 'Seven centuries of continuity & transformation (1000–1700 CE) — tap pins or timeline nodes below.',
        hi: '1000–1700 ई. में निरंतरता व परिवर्तन — नीचे पिन या समय-बिंदुओं पर टैप करके क्षेत्र बदलें।',
        spots: [
          { x: 26, y: 54, en: 'Persian Wheel & Columbian Crops', hi: 'रहट सिंचाई व नई फसलें', detail: b('Monsoon farming stayed rooted while chillies, potatoes & rahat wheels transformed farms.', 'मानसूनी खेती बनी रही पर रहट व आलू-मिर्च जैसी नई फसलों ने क्रांति लाई।'), set: { area: 'agri' } },
          { x: 54, y: 44, en: 'Silver Tanka/Rupaiya & Hundi Bills', hi: 'टंका/रुपया व हुंडी साख-पत्र', detail: b('Indian textiles kept global leadership while Sarraf Hundi paper settled long-distance trade.', 'सूती वस्त्र अग्रणी रहे और हुंडी से बिना भारी सिक्के ढोए व्यापार चला।'), set: { area: 'money' } },
          { x: 76, y: 74, en: 'Village Panchayats vs Land Registers', hi: 'ग्राम पंचायत बनाम ज़ब्त पंजिका', detail: b('Local councils settled everyday disputes even as Zabt surveys central-taxed crops.', 'केंद्रीय भूमि-पंजिका के बावजूद ग्राम पंचायतें दैनिक विवाद निपटाती रहीं।'), set: { area: 'state' } },
        ],
      },
      svg, aria: `Continuity and change in ${S.area}`, lines: [info.c, info.ch],
    };
  },
  discover: [b('Look across Agriculture, Currency and Governance. Notice daily village continuity persisted even when emperors changed!', 'कृषि, मुद्रा व शासन तीनों देखें। ध्यान दें कि सम्राट बदलने पर भी ग्रामीण ढाँचा कैसे टिका रहा!')],
  predictions: [
    {
      id: 'p1',
      stem: b('How did a merchant in 1650 safely send money from Agra to Surat without hauling heavy bags of silver coins over bandit roads?', '1650 ई. में कोई व्यापारी आगरा से सूरत बिना भारी चाँदी के थैले ढोए सुरक्षित धन कैसे भेजता था?'),
      options: [opt('hundi', 'By buying a paper Hundi (credit bill of exchange) from a banker redeemable in Surat', 'सराफ़ से हुंडी (कागज़ी साख-पत्र) खरीदकर जिसे सूरत में भुनाया जाता था'), opt('wire', 'By internet mobile app', 'मोबाइल ऐप द्वारा')],
      run: (S) => { S.area = 'money'; return 'hundi'; },
      explain: () => b('Sarrafs (indigenous bankers) operated trusted Hundi networks spanning major Indian cities and even Red Sea ports.', 'सराफ़ों का भरोसेमंद हुंडी नेटवर्क पूरे भारत और पश्चिमी बंदरगाहों तक काम करता था।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Which everyday crops now central to Indian cooking actually arrived only after 1500 CE via global sea routes?', 'भारतीय रसोई की कौन-सी आम फसलें वास्तव में 1500 ई. के बाद समुद्री मार्गों से भारत पहुँचीं?'),
      correct: 'chillies',
      options: [
        { id: 'chillies', ...b('Chillies, potatoes, tomatoes and maize (originally from the Americas)', 'मिर्च, आलू, टमाटर और मक्का (मूलतः अमेरिका महाद्वीप से)') },
        { id: 'rice', ...b('Rice and black pepper', 'चावल और काली मिर्च'), why: b('Rice and black pepper were native to India millennia earlier.', 'चावल और काली मिर्च हज़ारों वर्ष पहले से भारत की उपज हैं।') },
      ],
      explain: b('The Columbian Exchange reshaped Indian farms and kitchens during the 16th–17th centuries.', '16वीं–17वीं सदी के वैश्विक आदान-प्रदान ने भारतीय खेती और खान-पान को नया रूप दिया।'),
      hint: b('Check the Agriculture & irrigation timeline card.', 'कृषि व सिंचाई कार्ड पढ़ें।'),
    },
  ],
  reflect: b('Give one example from your family or village of something that has stayed similar for centuries and one thing that changed completely.', 'अपने घर या गाँव से एक ऐसी चीज़ बताएँ जो सदियों से लगभग वैसी है और एक जो पूरी तरह बदल गई।'),
};

// ================================================================ T13.L2 Cultural exchange & idea-tracing map
const EXCH_IDEAS = {
  numerals: { en: 'Decimal Numerals & Zero → West Asia & Europe', hi: 'दशमलव अंक व शून्य → पश्चिम एशिया व यूरोप', coords: [[78, 25], [64, 30], [44.4, 33.3], [31.2, 30.0], [12.5, 41.9]], desc: b('Indian base-10 numerals and zero reached Baghdad’s House of Wisdom (Al-Khwarizmi, 9th c.) and spread globally as “Hindu-Arabic” numerals.', 'भारतीय दशमलव अंक व शून्य बगदाद (अल-ख्वारिज़्मी, 9वीं सदी) होते हुए पूरे विश्व में पहुँचे।') },
  buddhism: { en: 'Buddhist Monks, Art & Texts → Central Asia, China, SE Asia', hi: 'बौद्ध भिक्षु, कला व ग्रंथ → मध्य एशिया, चीन व द.-पू. एशिया', coords: [[85.1, 25.6], [72.8, 33.7], [76.0, 39.5], [108.9, 34.3]], desc: b('Carried by pilgrims like Kumarajiva, Faxian & Xuanzang along mountain passes and sea lanes; Gandhara blended Greek & Indian sculpture.', 'कुमारजीव, फ़ाह्यान व ह्वेनसांग जैसे यात्रियों से दर्रों व समुद्र मार्गों से विचार फैले।') },
  stories: { en: 'Panchatantra Fables & Chaturanga (Chess)', hi: 'पंचतंत्र की कथाएँ व चतुरंग (शतरंज)', coords: [[76, 24], [51.4, 35.7], [44.4, 33.3], [31.2, 30.0]], desc: b('Sanskrit Panchatantra was translated into Middle Persian (Kalila wa Dimna), Arabic, and dozens of European languages; Chaturanga evolved into Shatranj & Chess.', 'पंचतंत्र का फ़ारसी (कलीला व दिम्ना) व अरबी में अनुवाद हुआ; चतुरंग से शतरंज बना।') },
};

export const exchangeMap = {
  id: 'T13.L2',
  objective: b('Trace how ideas—zero/numerals, Buddhism, Panchatantra stories and chess—travelled between India and the wider world (1900 BCE–1200 CE).', 'मानचित्र पर देखें कि शून्य/अंक, बौद्ध विचार, पंचतंत्र कथाएँ व शतरंज भारत और विश्व के बीच कैसे यात्रा करते थे।'),
  note: { kind: 'documented', en: 'Natural Earth 110m map (world-atlas); lines indicate broad historical transmission corridors.', hi: 'world-atlas मानचित्र पर ऐतिहासिक विचार-प्रवाह मार्ग।' },
  init: () => ({ idea: 'numerals' }),
  controls: [{ id: 'idea', type: 'chips', label: b('Idea traced', 'प्रवाहित विचार'), options: Object.entries(EXCH_IDEAS).map(([id, o]) => ({ id, en: o.en.split(' →')[0], hi: o.hi.split(' →')[0] })) }],
  view(S) {
    const it = EXCH_IDEAS[S.idea];
    const arcs = [{ coords: it.coords, stroke: '#7c3aed', width: 3.5 }];
    const markers = it.coords.map((c, i) => ({ lon: c[0], lat: c[1], r: i === 0 ? 8 : 5.5, fill: i === 0 ? '#ea580c' : '#0284c7' }));
    const svg = worldMapSvg({ w: 640, h: 310, arcs, markers, aria: it.en });
    return {
      plate: {
        src: 'assets/images/plates/t13-silkspice.jpg',
        en: 'Silk Road caravans and Indian Ocean dhows — tap pins to trace numerals, Buddhism or Panchatantra stories across Asia.',
        hi: 'रेशम मार्ग व हिंद महासागर जहाज़ — शून्य, बौद्ध विचार व पंचतंत्र कथाओं की यात्रा देखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 26, y: 48, en: 'Decimal Numerals & Zero → Baghdad', hi: 'दशमलव व शून्य → बगदाद', detail: b('Indian place-value arithmetic travelled to Baghdad’s House of Wisdom & Europe.', 'भारतीय स्थानीय मान गणित बगदाद होते हुए विश्व के गणित की भाषा बना।'), set: { idea: 'numerals' } },
          { x: 54, y: 52, en: 'Pilgrims & Gandhara Synthesis', hi: 'बौद्ध यात्री व गांधार कला', detail: b('Faxian, Xuanzang & monks carried manuscripts over passes & sea lanes.', 'फ़ाह्यान व ह्वेनसांग जैसे यात्रियों ने पर्वत दर्रों व समुद्र से ग्रंथ साझा किए।'), set: { idea: 'buddhism' } },
          { x: 80, y: 56, en: 'Panchatantra Fables & Chess', hi: 'पंचतंत्र कथाएँ व शतरंज', detail: b('Animal fables & Chaturanga travelled via Persian/Arabic into global classics.', 'पंचतंत्र व चतुरंग फ़ारसी-अरबी अनुवादों से विश्व साहित्य व शतरंज बने।'), set: { idea: 'stories' } },
        ],
      },
      svg, aria: it.en, lines: [{ en: it.en, hi: it.hi, cls: 'balanced' }, it.desc],
    };
  },
  discover: [b('Compare how all three ideas moved alongside merchant caravans and monsoon ships.', 'तीनों विचारों की यात्रा देखें—कैसे वे व्यापारी काफ़िलों और मानसूनी जहाजों के साथ चले।')],
  predictions: [
    {
      id: 'p1',
      stem: b('Through which city’s translation scholars did Indian decimal numerals reach Arabic and later European mathematics?', 'किस नगर के अनुवाद विद्वानों के माध्यम से भारतीय दशमलव अंक अरबी और बाद में यूरोपीय गणित में पहुँचे?'),
      options: [opt('baghdad', 'Baghdad (9th century House of Wisdom)', 'बगदाद (9वीं सदी, बैत-उल-हिकमा)'), opt('sydney', 'Sydney', 'सिडनी')],
      run: (S) => { S.idea = 'numerals'; return 'baghdad'; },
      explain: () => b('Al-Khwarizmi wrote a celebrated treatise on Indian calculation (al-hisab al-hindi) in Baghdad around 825 CE.', 'अल-ख्वारिज़्मी ने लगभग 825 ई. में बगदाद में भारतीय गणना पद्धति पर प्रसिद्ध ग्रंथ लिखा।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why is ancient cultural exchange described as a two-way street rather than isolation?', 'प्राचीन सांस्कृतिक आदान-प्रदान को एकतरफ़ा न मानकर दो-तरफ़ा संवाद क्यों कहा जाता है?'),
      correct: 'two',
      options: [
        { id: 'two', ...b('India shared numerals, cotton, Buddhism and fables outward while absorbing Greco-Roman coin styles, astronomy terms and West Asian crafts.', 'भारत ने अंक, कपास व कथाएँ बाहर भेजीं तथा यूनानी-रोमन सिक्का शैली, खगोल व शिल्प ग्रहण भी किए।') },
        { id: 'one', ...b('No foreign traders ever visited Indian ports.', 'कोई विदेशी व्यापारी कभी भारतीय बंदरगाह नहीं आया।'), why: b('Pattanam/Muziris, Arikamedu and Nalanda prove lively two-way contact.', 'मुज़िरिस, अरिकामेडु और नालंदा जीवंत दो-तरफ़ा संपर्क सिद्ध करते हैं।') },
      ],
      explain: b('Trade hubs incubated creative synthesis across language, art and science.', 'व्यापार केंद्रों ने भाषा, कला व विज्ञान में रचनात्मक संश्लेषण को जन्म दिया।'),
      hint: b('Click through all three ideas.', 'तीनों विचारों को देखें।'),
    },
  ],
  reflect: b('Name one everyday word, food, or mathematical symbol you use today that travelled across continents long ago.', 'कोई एक शब्द, भोजन या गणितीय चिह्न बताएँ जो सदियों पहले महाद्वीपों पार यात्रा कर आज हमारे दैनिक उपयोग में है।'),
};

// ================================================================ T13.L3 Indian Knowledge Systems gallery (source wording preserved)
const IKS_SRC = {
  aryabhata: {
    en: 'Aryabhata — Aryabhatiya (499 CE, Golapada v.9)',
    hi: 'आर्यभट — आर्यभटीय (499 ई., गोलपाद 9)',
    quote: b('Source wording: “Just as a man in a boat moving forward sees the stationary objects on the shore as moving backward, so are the stationary stars seen by people at Lanka as moving westward.”', 'मूल भाव: “जैसे आगे चलती नाव में बैठा व्यक्ति किनारे की स्थिर वस्तुओं को पीछे जाता देखता है, वैसे ही पृथ्वी के घूमने से स्थिर तारे पश्चिम जाते दिखते हैं।”'),
    context: b('Explained apparent daily motion of stars via Earth’s own axial rotation.', 'पृथ्वी के अपनी धुरी पर घूर्णन से तारों की आभासी गति की वैज्ञानिक व्याख्या की।'),
  },
  sushruta: {
    en: 'Sushruta Samhita — Sutrasthana (surgical instruments & training)',
    hi: 'सुश्रुत संहिता — सूत्रस्थान (शल्य उपकरण व अभ्यास)',
    quote: b('Source wording: “A surgeon must be bold, possess clean instruments, steady hands, and practise incisions on gourds, cucumbers and leather bags before treating patients.”', 'मूल भाव: “शल्य-चिकित्सक को निर्भीक, स्वच्छ उपकरणों से युक्त होना चाहिए और रोगी से पहले कद्दू, ककड़ी व चमड़े के थैलों पर चीरा लगाने का अभ्यास करना चाहिए।”'),
    context: b('Stressed hands-on simulation models, sterile tool care, and anatomical dissection.', 'रोगी-सुरक्षा हेतु व्यावहारिक मॉडल-अभ्यास और स्वच्छ उपकरणों पर ज़ोर दिया।'),
  },
  steel: {
    en: 'Wootz Crucible Steel & Delhi Iron Pillar (c. 4th–5th c. CE)',
    hi: 'वुट्ज़ इस्पात व महरौली लौह स्तंभ (ल. 4थी–5वीं सदी ई.)',
    quote: b('Inscription wording (Mehrauli Pillar): Records King Chandra erecting the standard (dhvaja) on Vishnupada hill — forged of ~98% pure wrought iron with corrosion-resisting phosphorus film.', 'अभिलेख उल्लेख: राजा चंद्र द्वारा विष्णुपद पर्वत पर स्थापित ध्वज-स्तंभ — ~98% शुद्ध पिटवाँ लोहे व फॉस्फोरस परत से 1,600 वर्षों से जंग-रहित।'),
    context: b('South Indian crucible high-carbon steel (ukku/wootz) was exported as raw ingots to Damascus swordsmiths.', 'दक्षिण भारतीय वुट्ज़ इस्पात की सिल्लियाँ दमिश्क तक निर्यात होती थीं।'),
  },
};

export const iksGallery = {
  id: 'T13.L3',
  objective: b('Read preserved primary source descriptions of Indian Knowledge Systems in astronomy, surgery and metallurgy.', 'खगोलशास्त्र, शल्य-चिकित्सा और धातुकर्म में भारतीय ज्ञान प्रणालियों के मूल स्रोत-उद्धरण पढ़ें।'),
  note: { kind: 'documented', en: 'Source wording preserved in translation; connects textual claims with physical artefacts.', hi: 'मूल ग्रंथ व अभिलेख का भाव सुरक्षित रखते हुए भौतिक प्रमाणों से जोड़ा गया।' },
  init: () => ({ src: 'aryabhata' }),
  controls: [{ id: 'src', type: 'chips', label: b('Source exhibit', 'स्रोत प्रदर्श'), options: Object.entries(IKS_SRC).map(([id, o]) => ({ id, en: o.en.split(' —')[0], hi: o.hi.split(' —')[0] })) }],
  view(S) {
    const it = IKS_SRC[S.src];
    const svg = `<svg viewBox="0 0 640 170" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="16" width="604" height="138" rx="12" fill="#ecfdf5" stroke="#047857" stroke-width="2.5"/><text class="txt b" x="320" y="64" text-anchor="middle">${esc(P(it.en, it.hi))}</text><text class="txt sm mut" x="320" y="102" text-anchor="middle">${esc(P('Empirical Observation · Technical Manuals · Preserved Inscriptions', 'प्रत्यक्ष प्रेक्षण · तकनीकी ग्रंथ · सुरक्षित अभिलेख'))}</text></svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t13-iks.jpg',
        en: 'Mehrauli Iron Pillar, armillary sphere, Wootz steel ingots & Sushruta tools — tap pins to read original texts.',
        hi: 'महरौली लौह स्तंभ, खगोल यंत्र, वुट्ज़ इस्पात व सुश्रुत उपकरण — मूल स्रोत पढ़ने हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 50, en: 'Aryabhata (499 CE) Boat Simile', hi: 'आर्यभट (499 ई.) नाव उपमा', detail: b('Explained stars appearing to spin westward via Earth’s own eastward rotation.', 'चलती नाव के उदाहरण से पृथ्वी के अपनी धुरी पर घूमने की व्याख्या की।'), set: { src: 'aryabhata' } },
          { x: 54, y: 58, en: 'Sushruta Surgical Training Models', hi: 'सुश्रुत शल्य प्रशिक्षण मॉडल', detail: b('Practising stitches on gourds and leather before surgery protected real patients.', 'लौकी व चमड़े के थैलों पर अभ्यास कर सुरक्षित शल्य-कौशल सिखाया जाता था।'), set: { src: 'sushruta' } },
          { x: 80, y: 44, en: 'Mehrauli Iron Pillar & Wootz Steel', hi: 'महरौली स्तंभ व वुट्ज़ इस्पात', detail: b('98% wrought iron with protective passive film resisted rust for 1,600 years.', 'फॉस्फोरस परत से युक्त लौह स्तंभ 1,600 वर्षों से बिना जंग के खड़ा है।'), set: { src: 'steel' } },
        ],
      },
      svg,
      aria: it.en,
      lines: [it.quote, it.context],
    };
  },
  discover: [b('Compare Aryabhata’s boat analogy with how you feel when a train next to yours starts moving.', 'आर्यभट की नाव उपमा की तुलना पास की ट्रेन चलने पर होने वाले अनुभव से करें।')],
  predictions: [
    {
      id: 'p1',
      stem: b('How did Sushruta recommend apprentice surgeons gain skill safely before operating on people?', 'सुश्रुत ने प्रशिक्षु चिकित्सकों को मनुष्य पर शल्य-चिकित्सा से पहले सुरक्षित अभ्यास कैसे करने को कहा?'),
      options: [opt('model', 'Practise incisions and suturing on vegetables (gourds) and water-filled skins', 'लौकी, ककड़ी व जल-भरे थैलों पर चीरा लगाने व टांके का अभ्यास कर'), opt('skip', 'Start without any practice at all', 'बिना किसी अभ्यास के सीधे शुरुआत कर')],
      run: (S) => { S.src = 'sushruta'; return 'model'; },
      explain: () => b('Using botanical/leather models prevented patient harm while teaching steady technique.', 'सब्ज़ियों व चमड़े के मॉडलों से अभ्यास कर रोगी की सुरक्षा सुनिश्चित की जाती थी।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('What scientific phenomenon does Aryabhata’s moving-boat simile explain?', 'आर्यभट की चलती नाव वाली उपमा किस वैज्ञानिक घटना को समझाती है?'),
      correct: 'rot',
      options: [
        { id: 'rot', ...b('Stars appear to wheel westward only because Earth itself spins eastward.', 'तारे पश्चिम जाते इसलिए दिखते हैं क्योंकि पृथ्वी स्वयं पूर्व की ओर घूमती है।') },
        { id: 'flat', ...b('Stars are painted on an unmoving tent.', 'तारे एक स्थिर तंबू पर चित्रित हैं।'), why: b('Aryabhata explicitly attributed apparent stellar motion to Earth’s rotation.', 'आर्यभट ने इसे पृथ्वी के घूर्णन का परिणाम बताया।') },
      ],
      explain: b('Relative motion explains why a rotating Earth makes the sky appear to rotate around us.', 'सापेक्ष गति समझाती है कि पृथ्वी के घूमने पर आकाश घूमता हुआ प्रतीत होता है।'),
      hint: b('Read the Aryabhata quote carefully.', 'आर्यभट का उद्धरण ध्यान से पढ़ें।'),
    },
  ],
  reflect: b('Why is checking the exact original source wording important before claiming what an ancient text discovered?', 'किसी प्राचीन ग्रंथ की खोज का दावा करने से पहले उसके मूल शब्दों की जाँच क्यों आवश्यक है?'),
};

// ================================================================ T13.L4 Artefact provenance activity
const ARTEFACTS = {
  aurei: { en: 'Hoard of Roman Gold Coins (Aurei) found near Coimbatore, Tamil Nadu', hi: 'कोयंबटूर (तमिलनाडु) के पास मिले रोमन स्वर्ण सिक्कों का ढेर', origin: 'roman', clue: b('Latin portrait of Augustus/Tiberius (~1st c. CE) found in South India alongside pepper ports.', '1ली सदी ई. के रोमन सम्राट अंकित सिक्के, दक्षिण भारतीय मसाला बंदरगाहों के पास मिले।'), conclusion: b('Mediterranean traders paid gold bullion for Malabar black pepper, ivory and beryl gems.', 'भूमध्यसागरीय व्यापारी मालाबार की काली मिर्च व रत्नों के बदले सोना देते थे।') },
  bead: { en: 'Long Etched Carnelian Beads from Harappa found in Royal Cemetery of Ur (Iraq)', hi: 'उर (इराक़) के शाही क़ब्रिस्तान में मिले हड़प्पा के कारनेलियन मनके', origin: 'indus', clue: b('Distinctive alkaline-etched red agate stone native to Gujarat (Lothal/Chanhudaro) excavated in Mesopotamia (~2400 BCE).', 'गुजरात के लोथल/चन्हूदड़ो की विशिष्ट पॉलिश लाल अकीक तकनीक से बने मनके मेसोपोटामिया में मिले।'), conclusion: b('Proves Harappan craft workshops exported luxury beads across Persian Gulf sea routes.', 'सिंधु-मेसोपोटामिया के बीच समुद्री विलासिता-व्यापार को सिद्ध करता है।') },
  amphora: { en: 'Roman Terracotta Wine Amphora Shards at Arikamedu (Puducherry)', hi: 'अरिकामेडु (पुदुचेरी) में मिले रोमन टेराकोटा मदिरा पात्र (एम्फ़ोरा) के टुकड़े', origin: 'roman', clue: b('Double-handled pointed clay shipping jars stamped with Mediterranean kiln marks beside local Indian bead-making furnaces.', 'भारतीय मनका भट्टियों के पास दो हत्थों वाले भूमध्यसागरीय मदिरा मटकों के अवशेष।'), conclusion: b('Shows foreign sailors stayed seasonally at Coromandel ports waiting for monsoon winds.', 'दर्शाता है कि विदेशी नाविक मानसूनी हवाओं के इंतजार में कोरोमंडल बंदरगाहों पर ठहरते थे।') },
};

export const artefactProvenance = {
  id: 'T13.L4',
  objective: b('Deduce an artefact’s provenance—where it was made, where it was found and how trade moved it—from physical clues.', 'भौतिक सुरागों से किसी पुरावशेष की उत्पत्ति (कहाँ बना, कहाँ मिला और किस व्यापार मार्ग से आया) का निष्कर्ष निकालें।'),
  note: { kind: 'documented', en: 'Based on famous documented finds at Arikamedu, Coimbatore and Ur.', hi: 'अरिकामेडु, कोयंबटूर और उर में मिले प्रलेखित पुरावशेषों पर आधारित।' },
  init: () => ({ art: 'aurei' }),
  controls: [{ id: 'art', type: 'chips', label: b('Select excavated find', 'उत्खनित अवशेष चुनें'), options: Object.entries(ARTEFACTS).map(([id, o]) => ({ id, en: o.en.split(' found')[0].split(' at')[0].split(' from')[0], hi: o.hi.split(' में')[0].split(' के')[0] })) }],
  view(S) {
    const a = ARTEFACTS[S.art];
    const svg = `<svg viewBox="0 0 640 175" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="16" width="604" height="142" rx="10" fill="var(--card)" stroke="#b5651d" stroke-width="2.5"/><text class="txt b" x="320" y="64" text-anchor="middle">${esc(P(a.en, a.hi))}</text><text class="txt sm" x="320" y="102" text-anchor="middle">${esc(P(`Material origin: ${a.origin === 'roman' ? 'Mediterranean / Rome' : 'Gujarat / Indus Valley'}`, `निर्माण स्रोत: ${a.origin === 'roman' ? 'रोम / भूमध्यसागर' : 'गुजरात / सिंधु क्षेत्र'}`))}</text></svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t13-artefacts.jpg',
        en: 'Excavated Roman amphora, gold Aurei coins & carnelian beads — tap any relic pin to trace its provenance.',
        hi: 'उत्खनित रोमन एम्फ़ोरा, स्वर्ण सिक्के व कारनेलियन मनके — उत्पत्ति व व्यापार मार्ग जानने हेतु पिन पर टैप करें।',
        spots: [
          { x: 28, y: 56, en: 'Coimbatore Roman Gold Hoard', hi: 'कोयंबटूर रोमन स्वर्ण सिक्के', detail: b('Roman silver & gold coins paid directly for Malabar black pepper & beryl gems.', 'रोमन व्यापारियों ने केरल की काली मिर्च व रत्नों के बदले स्वर्ण सिक्के दिए।'), set: { art: 'aurei' } },
          { x: 54, y: 62, en: 'Ur Royal Grave Indus Beads', hi: 'उर क़ब्रिस्तान में हड़प्पा मनके', detail: b('Gujarat carnelian beads excavated in Mesopotamia prove 2400 BCE sea trade.', 'मेसोपोटामिया में गुजरात के लाल अकीक मनके 2400 ई.पू. के समुद्री व्यापार का प्रमाण हैं।'), set: { art: 'bead' } },
          { x: 78, y: 52, en: 'Arikamedu Wine Amphora Shards', hi: 'अरिकामेडु मदिरा पात्र अवशेष', detail: b('Mediterranean kiln-stamped jars beside Tamil bead kilns show seasonal sailor quarters.', 'तमिल मनका भट्टियों के पास भूमध्यसागरीय मटके अंतर्राष्ट्रीय बंदरगाह दिखाते हैं।'), set: { art: 'amphora' } },
        ],
      },
      svg,
      aria: a.en,
      lines: [a.clue, { ...a.conclusion, cls: 'balanced' }],
    };
  },
  discover: [b('Compare the Coimbatore gold coins and the Ur carnelian beads. Notice how trade moved treasures in both directions!', 'कोयंबटूर के स्वर्ण सिक्के और उर के मनकों की तुलना करें। व्यापार दोनों दिशाओं में चलता था!')],
  predictions: [
    {
      id: 'p1',
      stem: b('If double-handled wine amphorae made in Italy turn up beside Tamil bead workshops at Arikamedu, archaeologists conclude…', 'यदि अरिकामेडु की तमिल मनका कार्यशाला के पास इटली में बने मदिरा पात्र मिलें, तो पुरातत्त्वविद् क्या निष्कर्ष निकालते हैं?'),
      options: [opt('port', 'Arikamedu was an active coastal entrepôt trading directly with Mediterranean merchants', 'अरिकामेडु भूमध्यसागरीय व्यापारियों से जुड़ा सक्रिय तटीय बंदरगाह था'), opt('error', 'Romans lived in Puducherry during the Stone Age', 'रोमन पाषाण युग में पुदुचेरी में रहते थे')],
      run: (S) => { S.art = 'amphora'; return 'port'; },
      explain: () => b('Imported pottery containers + local export bead workshops show an international maritime trading hub c. 1st century CE.', 'आयातित मटके व स्थानीय मनका भट्टियाँ 1ली सदी ई. के अंतर्राष्ट्रीय समुद्री बंदरगाह का प्रमाण हैं।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('What is the difference between where an artefact was MADE and its PROVENANCE (find-spot & context)?', 'किसी पुरावशेष के निर्माण स्थान और उसके प्राप्ति-संदर्भ (प्रोवेनेंस) में क्या अंतर है?'),
      correct: 'ctx',
      options: [
        { id: 'ctx', ...b('Where it was made shows technology/origin; finding it far away in a dated layer proves trade or travel.', 'निर्माण स्थान तकनीक बताता है; दूर किसी तिथि-परत में मिलना व्यापार या यात्रा सिद्ध करता है।') },
        { id: 'same', ...b('Objects never move after they are made.', 'वस्तुएँ बनने के बाद कभी एक जगह से दूसरी जगह नहीं जातीं।'), why: b('Trade, gifts and migrations carry artefacts thousands of kilometres.', 'व्यापार व यात्राओं से वस्तुएँ हजारों किलोमीटर दूर पहुँचती हैं।') },
      ],
      explain: b('Comparing origin vs find-spot reconstructs ancient trade networks.', 'मूल स्थान और प्राप्ति-स्थल की तुलना प्राचीन व्यापार तंत्र को उजागर करती है।'),
      hint: b('Examine the Ur carnelian bead find.', 'उर में मिले कारनेलियन मनके का विवरण पढ़ें।'),
    },
  ],
  reflect: b('Think of one object in your home (like a spice, fabric or phone part) that was made in one place and used in another—what will future archaeologists infer?', 'अपने घर की एक ऐसी वस्तु सोचें जो कहीं और बनी हो—भविष्य के पुरातत्त्वविद् उससे क्या अनुमान लगाएंगे?'),
};
