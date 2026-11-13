// T01 — Understanding Social Science (integrated):
// T01.L1 Society system map (d3-force), T01.L2 Four-lens India explorer (d3-geo), T01.L3 Discipline question sorter.
import { mountLabs } from '../../components/lab-kit.js';
import * as i18n from '../../core/i18n.js';
import { pair as P } from '../../core/i18n.js';
import { esc } from '../../core/dom.js';
import { forceGraphSvg, indiaMapSvg, loadGeoAll } from '../../engines/viz.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi) => ({ id, en, hi });

const SYS_NODES = [
  { id: 'people', label: b('People', 'जनता'), rw: 112, stroke: '#0b5cad' },
  { id: 'place', label: b('Place & Nature', 'स्थान व प्रकृति'), rw: 128, stroke: '#2e8b57' },
  { id: 'time', label: b('Time & Past', 'समय व अतीत'), rw: 118, stroke: '#b5651d' },
  { id: 'resources', label: b('Resources', 'संसाधन'), rw: 114, stroke: '#c0392b' },
  { id: 'institutions', label: b('Institutions', 'संस्थाएँ'), rw: 122, stroke: '#7b3fa0' },
  { id: 'decisions', label: b('Collective Choices', 'सामूहिक निर्णय'), rw: 138, stroke: '#0b5cad' },
];
const SYS_LINKS = [
  { source: 'people', target: 'place', label: b('adapt & shape', 'ढलते व बदलते') },
  { source: 'place', target: 'resources', label: b('provides', 'देता है') },
  { source: 'resources', target: 'decisions', label: b('requires choices', 'चुनाव माँगता') },
  { source: 'people', target: 'institutions', label: b('build rules', 'नियम बनाते') },
  { source: 'institutions', target: 'decisions', label: b('make laws', 'कानून बनाते') },
  { source: 'time', target: 'institutions', label: b('evolves over time', 'समय संग विकसित') },
  { source: 'time', target: 'people', label: b('memory & culture', 'स्मृति व संस्कृति') },
];
const SYS_CASES = {
  people: b('When citizens organise water committees, both nature and institutions respond.', 'जब नागरिक जल समितियाँ बनाते हैं, तो प्रकृति और संस्थाएँ दोनों प्रभावित होती हैं।'),
  place: b('A Himalayan valley or coastal delta shapes crops, travel routes, and flood risks.', 'हिमालयी घाटी या तटीय डेल्टा फसलें, यात्रा-मार्ग और बाढ़-जोखिम तय करते हैं।'),
  time: b('Today’s street names, borders, and laws carry decisions made centuries ago.', 'आज के शहर, सीमाएँ और कानून सदियों पुराने निर्णयों की छाप रखते हैं।'),
  resources: b('Clean water, fertile soil, and electricity are scarce, so trade-offs arise.', 'स्वच्छ जल, उपजाऊ मिट्टी और बिजली सीमित हैं, इसलिए चुनाव करने पड़ते हैं।'),
  institutions: b('Gram Sabhas, courts, markets, and schools coordinate millions of strangers.', 'ग्राम सभा, न्यायालय, बाज़ार और विद्यालय लाखों लोगों में तालमेल बनाते हैं।'),
  decisions: b('Building a bridge vs protecting a wetland involves geography, history, politics, and economics.', 'पुल बनाना या आर्द्रभूमि बचाना—इसमें भूगोल, इतिहास, राजनीति और अर्थशास्त्र चारों जुड़ते हैं।'),
};

export const systemMap = {
  id: 'T01.L1',
  objective: b('See society as one connected system linking people, place, time, resources, institutions and collective decisions.', 'समाज को लोगों, स्थान, समय, संसाधनों, संस्थाओं और सामूहिक निर्णयों से जुड़ी एक प्रणाली के रूप में देखें।'),
  note: { kind: 'schematic', en: 'Conceptual network laid out with d3-force; real societies contain many feedback loops.', hi: 'd3-force द्वारा रचित अवधारणात्मक तंत्र; वास्तविक समाजों में कई प्रतिपुष्टि चक्र होते हैं।' },
  init: () => ({ focus: 'decisions', shock: false }),
  controls: [
    { id: 'focus', type: 'chips', label: b('Highlight node', 'नोड चुनें'), options: SYS_NODES.map((n) => ({ id: n.id, ...n.label })) },
    { id: 'shock', type: 'toggle', label: b('Simulate drought shock on Place & Resources', 'स्थान व संसाधन पर सूखे का प्रभाव देखें') },
  ],
  view(S) {
    const nodes = SYS_NODES.map((n) => ({
      ...n,
      fill: S.shock && (n.id === 'place' || n.id === 'resources' || n.id === 'decisions') ? 'var(--warn-bg)' : undefined,
    }));
    const svg = forceGraphSvg({ w: 640, h: 350, nodes, links: SYS_LINKS, activeId: S.focus, aria: 'Six-node system map of society' });
    const lines = [
      SYS_CASES[S.focus],
      S.shock
        ? { en: 'Drought cascade: lower rainfall (Place) shrinks harvest (Resources) → households struggle (People) → Panchayats & ration stores adjust relief (Institutions & Decisions).', hi: 'सूखे की शृंखला: कम वर्षा (स्थान) से फसल घटती है (संसाधन) → परिवार प्रभावित होते हैं (जनता) → पंचायत व राशन प्रणाली राहत तय करते हैं (संस्थाएँ व निर्णय)।', cls: 'warn' }
        : { en: 'Every link between nodes shows how no single discipline explains society alone.', hi: 'नोड्स के बीच की हर कड़ी दिखाती है कि कोई एक विषय अकेले पूरे समाज को नहीं समझा सकता।', cls: 'balanced' },
    ];
    return {
      plate: {
        src: 'assets/images/hero.jpg',
        en: 'One interconnected Indian landscape: rivers & hills (Geography), heritage (History), civic assembly (Politics) and bazaar (Economics).',
        hi: 'एक जुड़ा हुआ भारतीय परिदृश्य: नदियाँ व पहाड़ (भूगोल), धरोहर (इतिहास), ग्राम-सभा (राजनीति) और बाज़ार (अर्थशास्त्र)।',
        spots: [
          { x: 24, y: 46, en: 'Place & Nature', hi: 'स्थान व प्रकृति', detail: b('Monsoon valley and river plain create water & fertile soil — click to test a drought cascade.', 'मानसूनी घाटी व नदी मैदान जल व उपजाऊ मिट्टी देते हैं — सूखे का प्रभाव जाँचें।'), set: { focus: 'place', shock: true } },
          { x: 48, y: 52, en: 'Institutions & Rules', hi: 'संस्थाएँ व नियम', detail: b('Panchayats, markets and laws coordinate how communities share water and infrastructure.', 'पंचायतें, बाज़ार और कानून तय करते हैं कि समुदाय संसाधन कैसे साझा करें।'), set: { focus: 'institutions', shock: false } },
          { x: 74, y: 58, en: 'People & Collective Choices', hi: 'जनता व सामूहिक निर्णय', detail: b('Citizens, farmers and weavers connect geography, past rules and livelihoods in daily choices.', 'नागरिक, किसान व बुनकर रोज़मर्रा के निर्णयों में चारों विषयों को जोड़ते हैं।'), set: { focus: 'decisions', shock: false } },
        ],
      },
      svg,
      aria: `Society system map focusing on ${S.focus}`,
      lines,
    };
  },
  discover: [
    b('Click each node from People to Decisions and notice how every part connects to at least two others.', 'जनता से सामूहिक निर्णय तक हर नोड चुनें और देखें कि हर भाग कम से कम दो अन्य भागों से जुड़ा है।'),
    b('Turn on the drought shock toggle. Why does a weather event quickly become an economic and political question?', 'सूखे का प्रभाव चालू करें। एक मौसमी घटना तुरंत आर्थिक और राजनीतिक प्रश्न कैसे बन जाती है?'),
  ],
  predictions: [
    {
      id: 'p1',
      stem: b('If a severe drought reduces river water (Place), which other parts of the system feel the effect?', 'यदि भीषण सूखे से नदी का जल (स्थान) घटता है, तो प्रणाली के किन अन्य भागों पर असर पड़ता है?'),
      options: [opt('onlyGeo', 'Only geography and weather maps', 'केवल भूगोल और मौसम मानचित्र'), opt('all', 'Resources, people’s incomes, and government decisions together', 'संसाधन, लोगों की आय और सरकारी निर्णय सभी एक साथ')],
      run: (S) => { S.focus = 'place'; S.shock = true; return 'all'; },
      explain: () => b('Lower water shifts farming (Economics), pushes civic relief policy (Political Science), and often echoes historical canal plans (History).', 'कम जल खेती (अर्थशास्त्र), राहत नीति (राजनीति विज्ञान) और पुरानी नहर योजनाओं (इतिहास) सबको जोड़ देता है।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why do we study Geography, History, Political Science, and Economics as one Social Science?', 'हम भूगोल, इतिहास, राजनीति विज्ञान और अर्थशास्त्र को एक समेकित सामाजिक विज्ञान के रूप में क्यों पढ़ते हैं?'),
      correct: 'linked',
      options: [
        { id: 'linked', ...b('Real human events involve places, past traditions, rules/power, and scarce resources at the same time.', 'वास्तविक मानवीय घटनाओं में स्थान, अतीत, नियम/सत्ता और सीमित संसाधन एक साथ जुड़े होते हैं।') },
        { id: 'same', ...b('Because all four subjects ask the exact same questions.', 'क्योंकि चारों विषय बिल्कुल एक जैसे प्रश्न पूछते हैं।'), why: b('Each discipline has a distinct lens, yet real problems combine them.', 'हर विषय का दृष्टिकोण अलग है, पर वास्तविक समस्याएँ उन्हें जोड़ती हैं।') },
      ],
      explain: b('Each discipline offers a distinct lens; together they give a complete picture of society.', 'हर विषय एक अलग लेंस देता है; मिलकर वे समाज का पूरा चित्र बनाते हैं।'),
      hint: b('Look at how Institutions connect to Time, People, and Decisions on the graph.', 'ग्राफ़ पर देखें संस्थाएँ कैसे समय, जनता और निर्णयों से जुड़ती हैं।'),
    },
  ],
  reflect: b('Describe one local issue in your neighbourhood (like drinking water or bus routes) using at least two nodes from the map.', 'अपने मोहल्ले की एक समस्या (जैसे पेयजल या बस मार्ग) को मानचित्र के कम से कम दो नोड्स की मदद से समझाएँ।'),
};

const PLACES = {
  varanasi: {
    lon: 83.0, lat: 25.3, state: 'Uttar Pradesh', en: 'Varanasi (Ganga Plain)', hi: 'वाराणसी (गंगा मैदान)',
    geo: b('Alluvial Ganga river curve, seasonal monsoon floods and fertile silt.', 'गंगा नदी का जलोढ़ मोड़, मौसमी मानसूनी बाढ़ और उपजाऊ गाद।'),
    hist: b('One of the world’s oldest continuously inhabited cities; ancient Mahajanapada of Kashi & handloom silk guilds.', 'विश्व के प्राचीनतम निरंतर बसे नगरों में से एक; प्राचीन काशी महाजनपद व रेशम बुनकर श्रेणियाँ।'),
    pol: b('Municipal corporation, river-cleanliness regulations, and Lok Sabha constituency debates.', 'नगर निगम, नदी-स्वच्छता नियम और लोक सभा निर्वाचन क्षेत्र की चर्चाएँ।'),
    econ: b('Banarasi weaving clusters, pilgrimage tourism, river transport, and wholesale grain markets.', 'बनारसी बुनकर समूह, तीर्थ-पर्यटन, नदी परिवहन और थोक अनाज मंडियाँ।'),
  },
  leh: {
    lon: 77.6, lat: 34.2, state: 'Ladakh', en: 'Leh (High Himalaya)', hi: 'लेह (उच्च हिमालय)',
    geo: b('Cold high-altitude desert (~3,500 m) in the Himalayan rain shadow; glacial melt streams.', 'हिमालयी वृष्टि-छाया में उच्च-ऊँचाई शीत मरुस्थल (~3,500 मी); हिमनद नाले।'),
    hist: b('Crossroads on high mountain Silk Road branches linking Kashmir, Tibet, and Central Asia.', 'कश्मीर, तिब्बत और मध्य एशिया को जोड़ने वाले उच्च पर्वतीय रेशम मार्ग का चौराहा।'),
    pol: b('Autonomous Hill Development Council balancing local grazing rights and border infrastructure.', 'स्वायत्त पर्वतीय विकास परिषद जो स्थानीय चराई अधिकार और सीमा-संपर्क संतुलित करती है।'),
    econ: b('Summer eco-tourism, Pashmina wool herding, apricot orchards, and solar microgrids.', 'ग्रीष्मकालीन पारिस्थितिक पर्यटन, पश्मीना ऊन पालन, खुबानी बाग और सौर ग्रिड।'),
  },
  sundarbans: {
    lon: 88.9, lat: 21.9, state: 'West Bengal', en: 'Sundarbans Delta', hi: 'सुंदरबन डेल्टा',
    geo: b('World’s largest tidal mangrove delta where Ganga-Brahmaputra meets the Bay of Bengal; cyclone-prone.', 'गंगा-ब्रह्मपुत्र और बंगाल की खाड़ी के संगम पर विश्व का सबसे बड़ा ज्वारीय मैंग्रोव डेल्टा; चक्रवात-संवेदनशील।'),
    hist: b('Eighteenth-century forest clearing, embankment building, and river-island folk shrines (Bonbibi).', 'अठारहवीं सदी में जंगल कटाई, तटबंध निर्माण और नदी-द्वीप लोक परंपराएँ।'),
    pol: b('Biosphere reserve zoning, cyclone evacuation panchayats, and transboundary river sharing.', 'जैवमंडल आरक्षित क्षेत्र नियम, चक्रवात बचाव पंचायतें और सीमा-पार नदी सहयोग।'),
    econ: b('Paddy farming, honey collection, tidal fisheries, and climate-resilient salt-tolerant seeds.', 'धान की खेती, शहद संग्रह, ज्वारीय मत्स्य पालन और लवण-सहिष्णु बीज।'),
  },
  bengaluru: {
    lon: 77.6, lat: 13.0, state: 'Karnataka', en: 'Bengaluru (Deccan Plateau)', hi: 'बेंगलुरु (दक्कन पठार)',
    geo: b('900 m Deccan granite plateau with mild climate and chain of man-made rainwater lakes (keres).', '900 मी ऊँचा दक्कन ग्रेनाइट पठार, सुखद जलवायु और मानव-निर्मित वर्षा-झीलों की शृंखला।'),
    hist: b('1537 Kempegowda mud fort & tank network evolving into cantonment, science institutes, and tech capital.', '1537 का केम्पेगौड़ा किला व तालाब नेटवर्क, जो विज्ञान संस्थानों और तकनीक केंद्र में बदला।'),
    pol: b('Urban municipal governance, lake-restoration citizen petitions, and metro transit planning.', 'नगरीय शासन, झील-पुनरुद्धार नागरिक याचिकाएँ और मेट्रो परिवहन योजना।'),
    econ: b('Software exports, aerospace/biotech startups, silk weaving, and urban service jobs.', 'सॉफ़्टवेयर निर्यात, अंतरिक्ष/जैव-तकनीक स्टार्टअप, रेशम बुनाई और शहरी सेवाएँ।'),
  },
  chotanagpur: {
    lon: 85.3, lat: 23.3, state: 'Jharkhand', en: 'Chotanagpur Plateau (Ranchi)', hi: 'छोटानागपुर पठार (राँची)',
    geo: b('Ancient undulating granite-gneiss plateau (~650 m), Subarnarekha and Damodar river valleys, Hundru waterfall nickpoints, and sal-forest hills.', 'प्राचीन ग्रेनाइट पठार (~650 मी), सुवर्णरेखा व दामोदर घाटियाँ, हुंडरू जलप्रपात व साल वन।'),
    hist: b('Rich stone-shelter art and iron-working heritage alongside community forest movements and landmark Chotanagpur land-tenancy protections.', 'शैलचित्र व लौह-शिल्प परंपरा, सामुदायिक वन आंदोलन और भूमि-अधिकार संरक्षण की ऐतिहासिक विरासत।'),
    pol: b('Gram Sabhas, PESA local self-governance institutions, and mineral-royalty & forest-conservation councils.', 'ग्राम सभाएँ, पेसा (PESA) स्थानीय स्वशासन संस्थाएँ और खनिज-वन संरक्षण परिषदें।'),
    econ: b('Iron-steel & mineral hubs, tussar silk and lac cooperatives, non-timber forest produce, and lively weekly haat markets.', 'इस्पात व खनिज केंद्र, तसर रेशम व लाख सहकारी समितियाँ, वनोपज और साप्ताहिक हाट बाज़ार।'),
  },
};
const LENS_LBL = {
  geo: b('Geography (Where & Why There)', 'भूगोल (कहाँ व क्यों)'),
  hist: b('History (How It Changed)', 'इतिहास (कैसे बदला)'),
  pol: b('Political Science (Who Decides)', 'राजनीति विज्ञान (निर्णय कौन करे)'),
  econ: b('Economics (Livelihoods & Choices)', 'अर्थशास्त्र (आजीविका व चुनाव)'),
};

export const lensExplorer = {
  id: 'T01.L2',
  objective: b('Investigate a single Indian place through all four Social Science lenses on an interactive India map.', 'इंटरैक्टिव भारत मानचित्र पर किसी एक स्थान को सामाजिक विज्ञान के चारों लेंसों से परखें।'),
  note: { kind: 'documented', en: 'State outlines from datta07/INDIAN-SHAPEFILES (MIT) projected via d3.geoMercator; place summaries are classroom syntheses.', hi: 'राज्य सीमाएँ datta07/INDIAN-SHAPEFILES से d3.geoMercator द्वारा; विवरण कक्षा-संश्लेषण हैं।' },
  init: () => ({ place: 'varanasi', lens: 'geo' }),
  controls: [
    { id: 'place', type: 'chips', label: b('Select Indian place', 'भारतीय स्थान चुनें'), options: Object.entries(PLACES).map(([id, p]) => ({ id, en: p.en, hi: p.hi })) },
    { id: 'lens', type: 'chips', label: b('Choose analytical lens', 'विश्लेषण लेंस चुनें'), options: Object.entries(LENS_LBL).map(([id, o]) => ({ id, ...o })) },
  ],
  view(S) {
    const p = PLACES[S.place];
    const lensCol = { geo: '#2e8b57', hist: '#b5651d', pol: '#7b3fa0', econ: '#c0392b' }[S.lens];
    const markers = Object.entries(PLACES).map(([id, pl]) => ({
      lon: pl.lon, lat: pl.lat, r: id === S.place ? 9 : 5.5,
      fill: id === S.place ? lensCol : '#4a5560',
      pulse: id === S.place,
      label: { en: pl.en.split(' (')[0], hi: pl.hi.split(' (')[0] },
    }));
    const stateColors = { [p.state]: lensCol + '55' };
    const svg = indiaMapSvg({ w: 640, h: 430, stateColors, selectedState: p.state, markers, aria: `India map highlighting ${p.en} through the ${S.lens} lens` });
    return {
      plate: {
        src: 'assets/images/plates/t01-lenses.jpg',
        en: 'Four lenses at one place: river basin (Geography), heritage stone (History), civic hall (Politics), vibrant market (Economics).',
        hi: 'एक ही स्थान पर चार दृष्टिकोण: नदी-पहाड़ (भूगोल), धरोहर (इतिहास), ग्राम सभा (राजनीति), बाज़ार (अर्थशास्त्र)।',
        spots: [
          { x: 18, y: 52, en: 'Geography lens', hi: 'भूगोल लेंस', detail: b('Examines terrain, rivers, rainfall and climate constraints shaping settlement.', 'भू-आकृति, नदी, वर्षा और जलवायु की भूमिका परखता है।'), set: { lens: 'geo' } },
          { x: 42, y: 46, en: 'History lens', hi: 'इतिहास लेंस', detail: b('Traces how craft traditions, trade highways and local monuments evolved over centuries.', 'देखता है कि शिल्प परंपराएँ, व्यापार मार्ग और स्मारक कैसे विकसित हुए।'), set: { lens: 'hist' } },
          { x: 65, y: 50, en: 'Political Science lens', hi: 'राजनीति विज्ञान लेंस', detail: b('Asks who decides public rules, conservation laws and citizen rights.', 'पूछता है कि नियम, संरक्षण कानून और नागरिक अधिकार कौन तय करता है।'), set: { lens: 'pol' } },
          { x: 86, y: 56, en: 'Economics lens', hi: 'अर्थशास्त्र लेंस', detail: b('Analyses weavers, tourism, wages, markets and scarce resource trade-offs.', 'बुनकरों, मज़दूरी, बाज़ार और सीमित संसाधनों के चुनाव का विश्लेषण करता है।'), set: { lens: 'econ' } },
        ],
      },
      svg,
      aria: `${p.en} — ${LENS_LBL[S.lens].en}`,
      lines: [
        { en: `${p.en} · ${LENS_LBL[S.lens].en}:`, hi: `${p.hi} · ${LENS_LBL[S.lens].hi}:`, cls: 'balanced' },
        p[S.lens],
        { en: 'Switch lenses without changing the place to notice how four truths coexist at the exact same coordinates.', hi: 'स्थान बदले बिना लेंस बदलकर देखें कि एक ही स्थान पर चारों दृष्टिकोण कैसे साथ रहते हैं।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Pick Sundarbans and read Geography, then Political Science, then Economics. How do cyclones tie all three together?', 'सुंदरबन चुनें और भूगोल, फिर राजनीति विज्ञान, फिर अर्थशास्त्र पढ़ें। चक्रवात तीनों को कैसे जोड़ते हैं?'),
    b('Compare Varanasi and Leh through the History lens. Why did both lie on major historical routes despite opposite terrain?', 'वाराणसी और लेह की इतिहास लेंस से तुलना करें। विपरीत भूभाग के बावजूद दोनों प्रमुख मार्गों पर क्यों थे?'),
  ],
  predictions: [
    {
      id: 'p1',
      stem: b('Which lens directly asks who has authority to restore Bengaluru’s historic lakes and pass anti-encroachment rules?', 'कौन-सा लेंस सीधे यह पूछता है कि बेंगलुरु की ऐतिहासिक झीलों को बचाने और अतिक्रमण-रोधी नियम बनाने का अधिकार किसके पास है?'),
      options: [opt('pol', 'Political Science', 'राजनीति विज्ञान'), opt('geo', 'Geography', 'भूगोल')],
      run: (S) => { S.place = 'bengaluru'; S.lens = 'pol'; return 'pol'; },
      explain: () => b('Geography explains the granite plateau and lake slopes, History tells who built the tanks, Economics measures water cost—and Political Science explains civic authority and laws.', 'भूगोल ढाल समझाता है, इतिहास निर्माण बताता है, अर्थशास्त्र लागत—और राजनीति विज्ञान नागरिक अधिकार व कानून समझाता है।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Studying why Banarasi silk weavers face competition from powerlooms mainly uses which pair of lenses?', 'बनारसी रेशम बुनकरों को पावरलूम से प्रतिस्पर्धा क्यों झेलनी पड़ती है—यह मुख्यतः किस लेंस-युग्म से समझा जाता है?'),
      correct: 'he',
      options: [
        { id: 'he', ...b('History and Economics', 'इतिहास और अर्थशास्त्र') },
        { id: 'onlyGeo', ...b('Only physical climate geography', 'केवल भौतिक जलवायु भूगोल'), why: b('Climate alone does not explain guild craft traditions or market pricing.', 'केवल जलवायु से शिल्प परंपरा या बाज़ार कीमत स्पष्ट नहीं होती।') },
      ],
      explain: b('Guild craft traditions come from History; costs, technology and consumer demand come from Economics.', 'शिल्प परंपराएँ इतिहास से, तथा लागत, तकनीक व माँग अर्थशास्त्र से समझी जाती हैं।'),
      hint: b('Look at Varanasi’s History and Economics notes.', 'वाराणसी के इतिहास और अर्थशास्त्र बिंदु देखें।'),
    },
  ],
  reflect: b('Pick your own home town or village and write one short sentence about it under Geography and one under Economics.', 'अपने नगर या गाँव को चुनकर उस पर एक वाक्य भूगोल और एक वाक्य अर्थशास्त्र की दृष्टि से लिखें।'),
};

const QUESTIONS = [
  { id: 'q1', q: b('“Why do coastal farmers in Odisha plant salt-tolerant paddy after cyclones?”', '“चक्रवात के बाद ओडिशा के तटीय किसान लवण-सहिष्णु धान क्यों बोते हैं?”'), primary: 'geo', overlap: ['geo', 'econ'], why: b('Links monsoon/cyclone Geography with crop livelihood Economics.', 'मानसून/चक्रवात भूगोल को फसल आजीविका अर्थशास्त्र से जोड़ता है।') },
  { id: 'q2', q: b('“Why did 19th-century railways follow ancient Grand Trunk caravan corridors?”', '“19वीं सदी की रेल लाइनों ने प्राचीन उत्तरापथ व्यापार मार्गों का अनुसरण क्यों किया?”'), primary: 'hist', overlap: ['hist', 'geo', 'econ'], why: b('Links History of routes with pass Geography and trade Economics.', 'मार्गों के इतिहास को दर्रों के भूगोल और व्यापार अर्थशास्त्र से जोड़ता है।') },
  { id: 'q3', q: b('“Who decides how municipal buses are priced for students vs commuters?”', '“छात्रों बनाम दैनिक यात्रियों के लिए नगर बस का किराया कौन तय करता है?”'), primary: 'pol', overlap: ['pol', 'econ'], why: b('Links public authority (Political Science) with pricing & subsidies (Economics).', 'लोक प्राधिकार (राजनीति विज्ञान) को कीमत व सब्सिडी (अर्थशास्त्र) से जोड़ता है।') },
  { id: 'q4', q: b('“Why does onion supply spike or crash after unseasonal hail?”', '“बेमौसम ओलावृष्टि के बाद प्याज़ की कीमतें अचानक क्यों उछलती हैं?”'), primary: 'econ', overlap: ['econ', 'geo'], why: b('Links weather shocks (Geography) with supply-demand pricing (Economics).', 'मौसमी झटके (भूगोल) को माँग-पूर्ति कीमत (अर्थशास्त्र) से जोड़ता है।') },
];
const DISC_COLS = { geo: '#2e8b57', hist: '#b5651d', pol: '#7b3fa0', econ: '#c0392b' };
const DISC_NAMES = { geo: b('Geography', 'भूगोल'), hist: b('History', 'इतिहास'), pol: b('Political Science', 'राजनीति विज्ञान'), econ: b('Economics', 'अर्थशास्त्र') };

export const questionSorter = {
  id: 'T01.L3',
  objective: b('Classify real-world questions by primary discipline and uncover why multiple disciplines overlap.', 'वास्तविक प्रश्नों को मुख्य विषय के अनुसार वर्गीकृत करें और देखें कि कई विषय आपस में क्यों जुड़ते हैं।'),
  note: { kind: 'schematic', en: 'Illustrates interdisciplinary overlap across CBSE Social Science strands.', hi: 'सीबीएसई सामाजिक विज्ञान की चारों धाराओं के अंतर्संबंध को दर्शाता है।' },
  init: () => ({ qid: 'q1', guess: 'geo' }),
  controls: [
    { id: 'qid', type: 'chips', label: b('Pick inquiry question', 'जाँच का प्रश्न चुनें'), options: QUESTIONS.map((x, idx) => ({ id: x.id, en: `Q${idx + 1}`, hi: `प्र.${idx + 1}` })) },
    { id: 'guess', type: 'chips', label: b('Which discipline leads first?', 'पहला मुख्य विषय कौन-सा?'), options: Object.entries(DISC_NAMES).map(([id, o]) => ({ id, ...o })) },
  ],
  view(S) {
    const q = QUESTIONS.find((x) => x.id === S.qid) || QUESTIONS[0];
    const match = S.guess === q.primary;
    const discs = ['geo', 'hist', 'pol', 'econ'];
    let g = `<text class="txt b" x="320" y="28" text-anchor="middle">${esc(P(q.q.en, q.q.hi))}</text>`;
    discs.forEach((d, i) => {
      const cx = 100 + i * 145, cy = 120;
      const inOverlap = q.overlap.includes(d);
      const isPrimary = d === q.primary;
      const isPicked = d === S.guess;
      g += `<g data-set='${esc(JSON.stringify({ guess: d }))}' role="button" tabindex="0" aria-label="${esc(P(DISC_NAMES[d].en, DISC_NAMES[d].hi))}">`;
      g += `<circle cx="${cx}" cy="${cy}" r="${isPrimary ? 52 : 42}" fill="${DISC_COLS[d]}" opacity="${inOverlap ? 0.85 : 0.2}"/>`;
      if (isPicked) g += `<circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="var(--ink)" stroke-width="3" stroke-dasharray="6 4"/>`;
      g += `<text class="txt sm b" x="${cx}" y="${cy + 4}" text-anchor="middle" fill="#fff">${esc(P(DISC_NAMES[d].en, DISC_NAMES[d].hi))}</text>`;
      if (isPrimary) g += `<text class="txt sm b" x="${cx}" y="${cy + 74}" text-anchor="middle">${esc(P('Lead lens', 'मुख्य लेंस'))}</text>`;
      g += `</g>`;
    });
    return {
      plate: {
        src: 'assets/images/plates/t01-lenses.jpg',
        en: 'Tap any pin or click a coloured discipline circle below to test how real questions span multiple Social Science lenses.',
        hi: 'किसी भी पिन या नीचे रंगीन विषय-चक्र पर क्लिक कर परखें कि वास्तविक प्रश्न कैसे कई विषयों को जोड़ते हैं।',
        spots: [
          { x: 18, y: 52, en: 'Q1: Coastal Paddy & Cyclones', hi: 'प्र.1: तटीय धान व चक्रवात', detail: b('Load Question 1 — watch Geography lead while Economics overlaps.', 'प्रश्न 1 खोलें — देखें कैसे भूगोल के साथ अर्थशास्त्र जुड़ता है।'), set: { qid: 'q1', guess: 'geo' } },
          { x: 42, y: 46, en: 'Q2: Railways on Trade Routes', hi: 'प्र.2: प्राचीन मार्गों पर रेल', detail: b('Load Question 2 — connects History of corridors, terrain passes and commerce.', 'प्रश्न 2 खोलें — मार्गों के इतिहास को भूगोल व व्यापार से जोड़ता है।'), set: { qid: 'q2', guess: 'hist' } },
          { x: 65, y: 50, en: 'Q3: Municipal Bus Fares', hi: 'प्र.3: नगर बस किराया', detail: b('Load Question 3 — blends civic authority (Politics) and subsidies (Economics).', 'प्रश्न 3 खोलें — नागरिक अधिकार व सब्सिडी अर्थशास्त्र को जोड़ता है।'), set: { qid: 'q3', guess: 'pol' } },
          { x: 86, y: 56, en: 'Q4: Hail & Onion Price Spike', hi: 'प्र.4: ओलावृष्टि व प्याज़ दाम', detail: b('Load Question 4 — climate shocks drive market scarcity and price spikes.', 'प्रश्न 4 खोलें — मौसम का झटका बाज़ार कीमत उछाल देता है।'), set: { qid: 'q4', guess: 'econ' } },
        ],
      },
      svg: `<svg viewBox="0 0 640 215" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `${q.q.en} — primary ${q.primary}, overlap ${q.overlap.join('+')}`,
      lines: [
        q.q,
        match
          ? { en: `Spot on: ${DISC_NAMES[q.primary].en} leads, and ${q.overlap.map((d) => DISC_NAMES[d].en).join(' + ')} overlap.`, hi: `बिल्कुल सही: ${DISC_NAMES[q.primary].hi} मुख्य है, और ${q.overlap.map((d) => DISC_NAMES[d].hi).join(' + ')} आपस में जुड़ते हैं।`, cls: 'balanced' }
          : { en: `You picked ${DISC_NAMES[S.guess].en}; ${DISC_NAMES[q.primary].en} leads this question, though ${q.overlap.map((d) => DISC_NAMES[d].en).join(' + ')} all help answer it.`, hi: `आपने ${DISC_NAMES[S.guess].hi} चुना; यहाँ ${DISC_NAMES[q.primary].hi} मुख्य है, यद्यपि ${q.overlap.map((d) => DISC_NAMES[d].hi).join(' + ')} सब सहायता करते हैं।`, cls: 'note' },
        q.why,
      ],
    };
  },
  discover: [
    b('Step through Q1 to Q4. Notice that zero questions touch only one single bubble!', 'प्र.1 से प्र.4 देखें। ध्यान दें कि कोई भी प्रश्न केवल एक विषय तक सीमित नहीं रहता!'),
  ],
  predictions: [
    {
      id: 'p1',
      stem: b('When studying why a municipal bus fare changes, which combination is essential?', 'नगर बस के किराए में बदलाव समझने के लिए किन विषयों का मेल आवश्यक है?'),
      options: [opt('pe', 'Political Science + Economics', 'राजनीति विज्ञान + अर्थशास्त्र'), opt('onlyH', 'History only', 'केवल इतिहास')],
      run: (S) => { S.qid = 'q3'; S.guess = 'pol'; return 'pe'; },
      explain: () => b('Public transit fares involve civic rules and subsidies (Political Science) plus fuel/operating costs and demand (Economics).', 'सार्वजनिक बस किराए में नागरिक नियम व सब्सिडी (राजनीति) तथा लागत व माँग (अर्थशास्त्र) दोनों शामिल हैं।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('What does “interdisciplinary overlap” mean when analysing an unseasonal crop price jump?', 'बेमौसम फसल से कीमत उछाल के विश्लेषण में “अंतर्विषयक संबंध” का क्या अर्थ है?'),
      correct: 'both',
      options: [
        { id: 'both', ...b('Climate/geography explains crop loss while economics explains market price movement.', 'जलवायु/भूगोल फसल हानि समझाता है जबकि अर्थशास्त्र बाज़ार कीमत का उतार-चढ़ाव समझाता है।') },
        { id: 'none', ...b('One subject replaces the other completely.', 'एक विषय दूसरे की पूरी जगह ले लेता है।'), why: b('Subjects complement each other rather than replacing one another.', 'विषय एक-दूसरे की जगह नहीं लेते बल्कि एक-दूसरे को पूरा करते हैं।') },
      ],
      explain: b('Combining lenses gives both cause (hail/monsoon) and effect (shortage and price spike).', 'लेंस जोड़ने से कारण (ओलावृष्टि/मानसून) और प्रभाव (कमी व कीमत वृद्धि) दोनों समझ आते हैं।'),
      hint: b('Check Question 4 on the chart.', 'चार्ट पर प्रश्न 4 देखें।'),
    },
  ],
  reflect: b('Write one question about India today that requires at least three of the four disciplines to answer well.', 'आज के भारत पर एक प्रश्न लिखें जिसके अच्छे उत्तर के लिए चारों में से कम से कम तीन विषय लगें।'),
};

export function mount(root) {
  const res = mountLabs(root, 'T01', [systemMap, lensExplorer, questionSorter], [
    b('Society system map', 'समाज प्रणाली मानचित्र'),
    b('4-lens India explorer', 'चार-लेंस भारत मानचित्र'),
    b('Question sorter', 'प्रश्न वर्गीकरण'),
  ]);
  let alive = true;
  loadGeoAll().then(() => { if (alive) res.relabel(); });
  return { ...res, destroy() { alive = false; res.destroy?.(); } };
}
