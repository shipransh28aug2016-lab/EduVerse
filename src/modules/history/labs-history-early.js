// History Labs Part 1: T04.L3–L5 (Settlement, Harappan City, River Civilisations) + T05.L1–L5 (State & Society up to 1000 CE).
import * as H from '../../engines/domain/history.js';
import { Chart } from '../../engines/chart.js';
import { indiaMapSvg, worldMapSvg, forceGraphSvg } from '../../engines/viz.js';
import { fmt, esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi) => ({ id, en, hi });

// ================================================================ T04.L3 Settlement sim
export const settlementLab = {
  id: 'T04.L3',
  objective: b('Compare mobile foraging bands with early farming villages across food surplus, storage, population growth and harvest shocks.', 'भोजन अधिशेष, भंडारण, जनसंख्या वृद्धि और फसल जोखिम के आधार पर घुमंतू संग्राहक समूहों और आरंभिक कृषि गाँवों की तुलना करें।'),
  note: { kind: 'schematic', en: '15-year teaching simulation of early Neolithic transition trade-offs.', hi: 'नवपाषाण संक्रमण के लाभ-हानि को दर्शाता 15-वर्षीय शिक्षण-मॉडल।' },
  init: () => ({ mode: 'farmer', rainVar: 0.35, storage: 0.6 }),
  controls: [
    { id: 'mode', type: 'chips', label: b('Subsistence strategy', 'जीवन-निर्वाह पद्धति'), options: [opt('forager', 'Mobile hunter-gatherers', 'घुमंतू शिकारी-संग्राहक'), opt('farmer', 'Settled Neolithic farmers', 'स्थायी नवपाषाण कृषक')] },
    { id: 'rainVar', type: 'slider', label: b('Weather / rainfall variability', 'मौसम / वर्षा उतार-चढ़ाव'), min: 0.1, max: 0.8, step: 0.1, fmt: (v) => `${Math.round(v * 100)}%` },
    { id: 'storage', type: 'slider', label: b('Granary storage capacity', 'अन्नागार भंडारण क्षमता'), min: 0.1, max: 1.0, step: 0.1, fmt: (v) => `${Math.round(v * 100)}%` },
  ],
  view(S) {
    const r = H.settlementSim({ mode: S.mode, rainfallVar: S.rainVar, storage: S.storage });
    const ch = new Chart({ xMax: 15, yMax: 180, xLabel: P('Years', 'वर्ष'), yLabel: P('Population / Food store', 'जनसंख्या / अन्न भंडार'), xTicks: 5, yTicks: 5 });
    ch.axes();
    ch.line(r.series.map((p) => [p.y, p.pop]), 'curve g');
    ch.line(r.series.map((p) => [p.y, p.foodStore]), 'curve s');
    ch.text(1, 168, P('Green: population · Blue: stored grain', 'हरा: जनसंख्या · नीला: संचित अनाज'), 'lbl', 'start');
    return {
      plate: {
        src: 'assets/images/plates/t04-tools.jpg',
        en: 'From Palaeolithic handaxe and microlith blades to polished Neolithic celts and charred wheat.',
        hi: 'पुरापाषाण हस्त-कुठार व सूक्ष्म-पाषाण से नवपाषाण पॉलिश कुल्हाड़ी व जले गेहूँ तक।',
      },
      svg: ch.html({ label: P('Forager vs farmer population and storage over 15 years', '15 वर्षों में जनसंख्या व अन्न भंडार') }),
      aria: `${S.mode}: final population ${r.finalPop}, stored food ${r.finalStore}`,
      lines: [
        S.mode === 'farmer'
          ? b(`Settled farming reaches population ${r.finalPop} with ${r.finalStore} food stored — enabling craft specialists, yet vulnerability if granaries run dry or crowd disease rises.`, `स्थायी खेती जनसंख्या ${r.finalPop} और ${r.finalStore} अन्न भंडार तक पहुँचती है — जिससे शिल्पकार पनपे, पर सूखे व भीड़ से रोगों का जोखिम बढ़ा।`)
          : b(`Foraging stays smaller (${r.finalPop}) and more flexible across lean years (${r.finalStore} reserve) because bands move toward wild food.`, `शिकारी-संग्राहक समूह छोटे (${r.finalPop}) और सूखे वर्षों में अधिक लचीले रहते हैं क्योंकि वे भोजन की खोज में स्थान बदल सकते हैं।`),
      ],
    };
  },
  discover: [b('Raise weather variability to 80% with low granary storage (10%), then raise storage to 90%. What changes for settled farmers?', 'कम भंडारण (10%) पर मौसम उतार-चढ़ाव 80% करें, फिर भंडारण 90% बढ़ाएँ। किसानों के लिए क्या बदलता है?')],
  predictions: [
    {
      id: 'p1',
      stem: b('Why did settled farming villages need clay pots and pit granaries far more than mobile hunter-gatherers?', 'घुमंतू संग्राहकों की तुलना में स्थायी कृषक गाँवों को मिट्टी के बर्तनों और अन्नागारों की अधिक आवश्यकता क्यों पड़ी?'),
      options: [opt('harvest', 'Farming produces a seasonal harvest all at once that must last all year', 'खेती से उपज एक ही ऋतु में मिलती है जिसे वर्ष भर बचाना पड़ता है'), opt('walk', 'To carry heavy pots while moving daily', 'प्रतिदिन चलते समय भारी घड़े ढोने के लिए')],
      run: (S) => { S.mode = 'farmer'; S.storage = 0.8; return 'harvest'; },
      explain: () => b('Seasonal grain surpluses required pottery, baskets, and granaries—supporting permanent houses and larger families.', 'मौसमी अन्न अधिशेष को सँभालने के लिए बर्तन और अन्नागार बने, जिससे स्थायी घर और बड़ी बस्तियाँ बसीं।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('What is one major trade-off when humans shifted from foraging to farming?', 'शिकार-संग्रह से खेती की ओर बढ़ने का एक प्रमुख लाभ-हानि क्या था?'),
      correct: 'trade',
      options: [
        { id: 'trade', ...b('Larger populations and food surpluses became possible, but people became tied to one spot and local crop failures.', 'अधिक जनसंख्या व अन्न अधिशेष संभव हुआ, पर लोग एक स्थान और फसल-जोखिम से बँध गए।') },
        { id: 'none', ...b('Farming ended all droughts forever.', 'खेती ने सूखे हमेशा के लिए खत्म कर दिए।'), why: b('Farmers remained deeply vulnerable to monsoon or rain variation.', 'किसान वर्षा के उतार-चढ़ाव पर अधिक निर्भर रहे।') },
      ],
      explain: b('Surpluses enabled towns and specialists while demanding storage and irrigation.', 'अधिशेष ने नगर व शिल्पकार बनाए पर भंडारण व सिंचाई की आवश्यकता भी बढ़ाई।'),
      hint: b('Switch between Mobile and Settled chips.', 'दोनों जीवन-निर्वाह विकल्पों में बदलें।'),
    },
  ],
  reflect: b('Why did pottery, polished stone axes and permanent houses appear together in the Neolithic period?', 'नवपाषाण काल में मिट्टी के बर्तन, पॉलिश कुल्हाड़ियाँ और स्थायी घर एक साथ क्यों दिखाई दिए?'),
};

// ================================================================ T04.L4 Harappan city planner
export const harappanCity = {
  id: 'T04.L4',
  objective: b('Plan an Indus-Sarasvati (Harappan) town with Citadel, Great Bath, Granary, right-angle grid streets and covered drains, and inspect its 3D layout.', 'दुर्ग, विशाल स्नानागार, अन्नागार, समकोण ग्रिड सड़कों और ढकी नालियों के साथ हड़प्पा नगर की योजना बनाएँ और उसका 3D रूप देखें।'),
  note: { kind: 'reconstruction', en: 'Archaeological city-planning principles observed at Mohenjo-daro, Harappa, Dholavira and Lothal.', hi: 'मोहनजोदड़ो, हड़प्पा, धोलावीरा और लोथल में प्राप्त नगर-योजना सिद्धांतों पर आधारित पुनर्निर्माण।' },
  init: () => ({ gridStreets: true, coveredDrains: true, granary: true, greatBath: true, wells: 2 }),
  controls: [
    { id: 'gridStreets', type: 'toggle', label: b('Right-angle north–south / east–west grid', 'समकोण उत्तर–दक्षिण / पूर्व–पश्चिम ग्रिड') },
    { id: 'coveredDrains', type: 'toggle', label: b('Kiln-brick covered drains & soak-pits', 'पक्की ईंट की ढकी नालियाँ व सोख्ता-गड्ढे') },
    { id: 'granary', type: 'toggle', label: b('Raised Citadel granary platform', 'दुर्ग पर ऊँचा अन्नागार चबूतरा') },
    { id: 'greatBath', type: 'toggle', label: b('Bitumen-lined Great Bath reservoir', 'विशाल स्नानागार (जलरोधी ईंट)') },
    { id: 'wells', type: 'slider', label: b('Brick wells per neighbourhood block', 'प्रति मोहल्ला ईंट के कुएँ'), min: 0, max: 3, step: 1 },
  ],
  view(S) {
    const score = H.harappanPlan(S);
    let g = `<rect x="16" y="16" width="608" height="218" rx="8" fill="#ebd9b4" stroke="#8c5b32" stroke-width="2"/>`;
    // Citadel on West
    g += `<rect x="34" y="32" width="180" height="186" rx="6" fill="#c78254" stroke="#5c351c" stroke-width="2"/>`;
    g += `<text class="txt sm b" x="124" y="50" text-anchor="middle" fill="#fff">${esc(P('Citadel (High)', 'दुर्ग (ऊँचा)'))}</text>`;
    if (S.greatBath) g += `<rect x="56" y="64" width="136" height="58" rx="4" fill="#38bdf8" stroke="#0369a1" stroke-width="2"/><text class="txt sm b" x="124" y="97" text-anchor="middle">${esc(P('Great Bath', 'विशाल स्नानागार'))}</text>`;
    if (S.granary) g += `<rect x="56" y="138" width="136" height="60" rx="4" fill="#9a522a" stroke="#451a03" stroke-width="2"/><text class="txt sm b" x="124" y="172" text-anchor="middle" fill="#fff">${esc(P('Granary', 'अन्नागार'))}</text>`;
    // Lower Town
    g += `<rect x="242" y="32" width="364" height="186" rx="6" fill="#d8b88a" stroke="#7c5332"/>`;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        const jx = S.gridStreets ? 0 : ((r + c) % 2 ? 12 : -10);
        const jy = S.gridStreets ? 0 : (c % 2 ? -8 : 8);
        const bx = 264 + c * 112 + jx, by = 50 + r * 86 + jy;
        g += `<rect x="${bx}" y="${by}" width="84" height="62" rx="3" fill="#b46039" stroke="#5c2d16"/>`;
        for (let w = 0; w < S.wells; w++) g += `<circle cx="${bx + 16 + w * 22}" cy="${by + 30}" r="5" fill="#0284c7" stroke="#fff"/>`;
      }
    }
    if (S.coveredDrains) g += `<line x1="250" y1="124" x2="598" y2="124" stroke="#334155" stroke-width="6" stroke-dasharray="10 4"/><text class="txt sm b" x="424" y="140" text-anchor="middle">${esc(P('Covered street drain', 'ढकी सड़क नाली'))}</text>`;
    return {
      plate: {
        src: 'assets/images/t04.jpg',
        en: 'Harappan baked-brick urban grid, Great Bath courtyard and covered street drains.',
        hi: 'हड़प्पा की पक्की ईंटों की नगर योजना, महास्नानागार आँगन व ढकी नालियाँ।',
      },
      svg: `<svg viewBox="0 0 640 250" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Harappan town plan: sanitation ${score.sanitation}%, flood safety ${score.floodSafety}%`,
      lines: [
        { en: `Town score: ${score.overall}% (Sanitation ${score.sanitation}%, Flood & food resilience ${score.floodSafety}%).`, hi: `नगर स्कोर: ${score.overall}% (स्वच्छता ${score.sanitation}%, बाढ़ व अन्न सुरक्षा ${score.floodSafety}%)।`, cls: score.overall >= 80 ? 'balanced' : 'warn' },
        b('Notice standardized 1:2:4 baked bricks, household bathing rooms feeding covered street drains, and elevated brick citadels above flood levels.', 'ध्यान दें: 1:2:4 मानक पक्की ईंटें, ढकी नालियाँ और बाढ़ से ऊँचे दुर्ग चबूतरे।'),
      ],
    };
  },
  discover: [b('Switch off covered drains and grid streets, then rotate the 3D city model. How does drainage change?', 'ढकी नालियाँ व ग्रिड सड़कें बंद करें और 3D नगर घुमाकर देखें। जल-निकासी कैसे प्रभावित होती है?')],
  predictions: [
    {
      id: 'p1',
      stem: b('Why were Harappan cities like Mohenjo-daro built with raised platforms and covered brick street drains?', 'मोहनजोदड़ो जैसे हड़प्पा नगर ऊँचे चबूतरों और ढकी ईंट नालियों के साथ क्यों बनाए गए थे?'),
      options: [opt('hygiene', 'To prevent river floods from ruining houses and to carry wastewater hygienically away', 'बाढ़ से घरों को बचाने और गंदे पानी को स्वच्छ ढंग से बाहर निकालने के लिए'), opt('secret', 'As underground roads for bullock carts', 'बैलगाड़ियों की भूमिगत सड़कों के लिए')],
      run: (S) => { S.gridStreets = true; S.coveredDrains = true; S.granary = true; return 'hygiene'; },
      explain: () => b('Harappan engineers graded drains with inspection manholes and soak pits, keeping narrow streets clean.', 'हड़प्पा अभियंताओं ने ढाल वाली ढकी नालियाँ और सोख्ता गड्ढे बनाए ताकि गलियाँ स्वच्छ रहें।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('What do uniform 1:2:4 brick proportions across towns 1,000 km apart suggest about Harappan society?', '1,000 किमी दूर अलग-अलग हड़प्पा नगरों में एक समान 1:2:4 अनुपात की ईंटें क्या दर्शाती हैं?'),
      correct: 'coord',
      options: [
        { id: 'coord', ...b('Shared civic standards, weights, and coordinated urban planning across the region.', 'पूरे क्षेत्र में साझा नागरिक मानक, बाट-माप और समन्वित नगर-योजना।') },
        { id: 'accident', ...b('Pure coincidence with no measurement tools.', 'बिना किसी माप-उपकरण के शुद्ध संयोग।'), why: b('Standardised chert cube weights and copper scales were found across Harappan sites.', 'हड़प्पा स्थलों से मानकीकृत पत्थर के बाट व तराजू मिले हैं।') },
      ],
      explain: b('Uniform bricks, weights and seals testify to shared civic coordination.', 'समान ईंटें, बाट और मुहरें साझा नागरिक समन्वय का प्रमाण हैं।'),
      hint: b('Examine both the Citadel and Lower Town grid.', 'दुर्ग और निचले नगर ग्रिड दोनों देखें।'),
    },
  ],
  reflect: b('Which one Harappan urban engineering feature do modern Indian cities still struggle with today?', 'हड़प्पा की कौन-सी एक नगर-योजना विशेषता आज के आधुनिक भारतीय शहरों के लिए भी एक सीख है?'),
};

// ================================================================ T04.L5 Comparative civilisation atlas
export const civAtlas = {
  id: 'T04.L5',
  objective: b('Compare the four Bronze Age river-valley civilisations—Harappan, Mesopotamia, Egypt and Shang China—on a world atlas.', 'विश्व मानचित्र पर चार कांस्य-युगीन नदी-घाटी सभ्यताओं—हड़प्पा, मेसोपोटामिया, मिस्र और शांग चीन—की तुलना करें।'),
  note: { kind: 'documented', en: 'Natural Earth 110m map (world-atlas) via d3-geo; dates are approximate archaeological spans.', hi: 'world-atlas के साथ d3-geo मानचित्र; तिथियाँ अनुमानित पुरातात्त्विक अवधियाँ हैं।' },
  init: () => ({ civ: 'harappan' }),
  controls: [{ id: 'civ', type: 'chips', label: b('Select river civilisation', 'नदी सभ्यता चुनें'), options: H.RIVER_CIVS.map((c) => ({ id: c.id, en: c.en.split(' (')[0], hi: c.hi })) }],
  view(S) {
    const cur = H.RIVER_CIVS.find((c) => c.id === S.civ) || H.RIVER_CIVS[0];
    const markers = H.RIVER_CIVS.map((c) => ({
      lon: c.lon, lat: c.lat, r: c.id === S.civ ? 10 : 6,
      fill: c.id === S.civ ? '#b5651d' : '#64748b',
      label: { en: c.en.split(' (')[0], hi: c.hi },
    }));
    const svg = worldMapSvg({ w: 640, h: 310, markers, arcs: [{ coords: [[68.1, 27.3], [56, 25], [48, 29], [44.4, 32.5]], stroke: '#0284c7', dash: '6 4', width: 2.5 }], aria: `Bronze Age river civilisations highlighting ${cur.en}` });
    return {
      svg,
      aria: `${cur.en} (${cur.span}) on ${cur.river.en}`,
      lines: [
        { en: `${cur.en} (${cur.span}) · River: ${cur.river.en}.`, hi: `${cur.hi} (${cur.span}) · नदी: ${cur.river.hi}।`, cls: 'balanced' },
        { en: `Writing: ${cur.writing.en}. Hallmark: ${cur.trait.en}.`, hi: `लिपि: ${cur.writing.hi}। विशेषता: ${cur.trait.hi}।`, cls: 'note' },
      ],
    };
  },
  discover: [b('Compare all four sites. Notice every civilisation sits near ~25°N–36°N along major perennial river valleys!', 'चारों सभ्यताओं की तुलना करें। देखें कि सभी ~25°N–36°N के बीच प्रमुख सदानीरा नदी घाटियों पर स्थित थीं!')],
  predictions: [
    {
      id: 'p1',
      stem: b('Which pair of Bronze Age civilisations traded carnelian beads, timber and textiles by sea across the Persian Gulf around 2200 BCE?', 'लगभग 2200 ई.पू. किन दो सभ्यताओं के बीच फ़ारस की खाड़ी से समुद्री व्यापार के प्रमाण मिले हैं?'),
      options: [opt('hm', 'Harappan & Mesopotamia', 'हड़प्पा और मेसोपोटामिया'), opt('ec', 'Egypt & China directly by Atlantic', 'मिस्र और चीन अटलांटिक से')],
      run: (S) => { S.civ = 'harappan'; return 'hm'; },
      explain: () => b('Mesopotamian cuneiform tablets mention Meluhha (Indus region), and Harappan seals turned up in Mesopotamia.', 'मेसोपोटामिया के कीलाक्षर लेखों में मेलुहा (सिंधु क्षेत्र) का उल्लेख है और हड़प्पा मुहरें वहाँ मिली हैं।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why did all four early Bronze Age civilisations arise in river valleys?', 'चारों आरंभिक कांस्य-युगीन सभ्यताएँ नदी घाटियों में ही क्यों उभरीं?'),
      correct: 'silt',
      options: [
        { id: 'silt', ...b('Annual fertile silt, irrigation water for grain surpluses, and flat boat transport routes.', 'वार्षिक उपजाऊ जलोढ़ मिट्टी, सिंचाई जल से अन्न अधिशेष व नौका परिवहन।') },
        { id: 'ice', ...b('Because frozen glaciers kept crops fresh.', 'क्योंकि हिमनद फसल को जमा देते थे।'), why: b('Warm fertile river floodplains supported multiple harvests.', 'गर्म उपजाऊ नदी मैदानों ने भरपूर उपज दी।') },
      ],
      explain: b('Reliable river irrigation created food surpluses that funded cities, bronze craft, and writing.', 'नदी सिंचाई ने अन्न अधिशेष दिया जिससे नगर, कांस्य शिल्प और लेखन पनपे।'),
      hint: b('Look at the dashed Gulf line and river labels.', 'मानचित्र की खाड़ी रेखा और नदियों के नाम देखें।'),
    },
  ],
  reflect: b('How is the Harappan script different from Mesopotamian cuneiform or Egyptian hieroglyphs for historians today?', 'आज के इतिहासकारों के लिए हड़प्पा लिपि मेसोपोटामिया की कीलाक्षर या मिस्र की चित्रलिपि से किस तरह अलग चुनौती है?'),
};

// ================================================================ T05.L1 Vedic & Early India dated map
const T05_ERAS = {
  earlyVedic: { year: 'c. 1500–1000 BCE', yearHi: 'लगभग 1500–1000 ई.पू.', en: 'Early Vedic (Sapta-Sindhu)', hi: 'ऋग्वैदिक काल (सप्त-सिंधु)', states: { Punjab: '#eab308', Haryana: '#eab308', 'Jammu & Kashmir': '#fde047' }, pts: [{ lon: 74.8, lat: 31.6, l: b('Sapta-Sindhu rivers', 'सप्त-सिंधु नदियाँ') }], desc: b('Pastoral cattle-rearing clans along Indus tributaries; Sabha & Samiti assemblies; oral hymns composed in Sanskrit.', 'सिंधु सहायक नदियों के किनारे पशुपालक कबीले; सभा व समिति; संस्कृत में मौखिक ऋचाएँ।') },
  janapada: { year: 'c. 600–400 BCE', yearHi: 'लगभग 600–400 ई.पू.', en: '16 Mahajanapadas (Magadha, Vajji, Kashi)', hi: '16 महाजनपद (मगध, वज्जि, काशी)', states: { Bihar: '#f97316', 'Uttar Pradesh': '#fb923c', 'Madhya Pradesh': '#fed7aa' }, pts: [{ lon: 85.1, lat: 25.6, l: b('Rajagriha / Pataliputra (Magadha)', 'राजगृह / पाटलिपुत्र (मगध)') }, { lon: 85.1, lat: 26.0, l: b('Vaishali (Vajji Gana-Sangha)', 'वैशाली (वज्जि गणसंघ)') }, { lon: 75.8, lat: 23.2, l: b('Ujjayini (Avanti)', 'उज्जयिनी (अवंति)') }], desc: b('Iron ploughshares cleared dense Ganga plains; second urbanisation brought walled cities, punch-marked coins, Buddhism & Jainism.', 'लोहे के हल से गंगा मैदान साफ हुए; द्वितीय नगरीकरण, आहत सिक्के, बौद्ध व जैन दर्शन का उदय।') },
  maurya: { year: 'c. 321–185 BCE', yearHi: 'लगभग 321–185 ई.पू.', en: 'Mauryan Empire & Ashokan Edicts', hi: 'मौर्य साम्राज्य व अशोक के अभिलेख', states: { Bihar: '#b45309', 'Uttar Pradesh': '#d97706', Odisha: '#f59e0b', 'Madhya Pradesh': '#f59e0b', Maharashtra: '#fbbf24', Karnataka: '#fde68a', Gujarat: '#fbbf24' }, pts: [{ lon: 85.1, lat: 25.6, l: b('Pataliputra (Capital)', 'पाटलिपुत्र (राजधानी)') }, { lon: 85.8, lat: 20.2, l: b('Kalinga (Dhauli edict)', 'कलिंग (धौली अभिलेख)') }, { lon: 76.5, lat: 14.5, l: b('Brahmagiri edict', 'ब्रह्मगिरि अभिलेख') }], desc: b('First pan-Indian imperial administrative network spanning from Taxila to Karnataka; stone pillar & rock edicts inscribed in Prakrit/Brahmi.', 'तक्षशिला से कर्नाटक तक फैला पहला अखिल भारतीय प्रशासन; प्राकृत व ब्राह्मी लिपि में स्तंभ व शिलालेख।') },
  gupta: { year: 'c. 320–550 CE & Sangam South', yearHi: 'लगभग 320–550 ई. व संगम दक्षिण', en: 'Gupta Empire & Sangam South', hi: 'गुप्त काल व संगम दक्षिण', states: { Bihar: '#7c3aed', 'Uttar Pradesh': '#8b5cf6', 'Madhya Pradesh': '#a78bfa', 'Tamil Nadu': '#10b981', Kerala: '#34d399' }, pts: [{ lon: 85.1, lat: 25.6, l: b('Pataliputra / Nalanda', 'पाटलिपुत्र / नालंदा') }, { lon: 78.1, lat: 9.9, l: b('Madurai (Sangam Pandya)', 'मदुरै (संगम पांड्य)') }], desc: b('Flourishing Sanskrit kavya, Aryabhata astronomy, Chola-Chera-Pandya Sangam trade, and early Nalanda monastery.', 'संस्कृत काव्य, आर्यभट खगोलशास्त्र, संगम तमिल व्यापार व नालंदा महाविहार का उत्कर्ष।') },
};

export const vedicDatedMap = {
  id: 'T05.L1',
  objective: b('Track historical geography shifts from Sapta-Sindhu pastoral clans to Ganga Mahajanapadas, Mauryan edicts and classical kingdoms up to 1000 CE.', 'सप्त-सिंधु के कबीलों से गंगा महाजनपदों, मौर्य अभिलेखों और 1000 ई. तक के राज्यों तक भारत के ऐतिहासिक भूगोल को मानचित्र पर देखें।'),
  note: { kind: 'reconstruction', en: 'Approximate cultural/political core regions mapped onto modern Indian state boundaries (datta07/INDIAN-SHAPEFILES).', hi: 'अनुमानित ऐतिहासिक क्षेत्रों को आधुनिक भारतीय राज्य सीमाओं पर दर्शाया गया है।' },
  init: () => ({ era: 'earlyVedic' }),
  controls: [{ id: 'era', type: 'chips', label: b('Historical period', 'ऐतिहासिक काल'), options: Object.entries(T05_ERAS).map(([id, o]) => ({ id, en: o.year, hi: o.yearHi })) }],
  view(S) {
    const e = T05_ERAS[S.era];
    const markers = e.pts.map((p) => ({ lon: p.lon, lat: p.lat, r: 7.5, fill: '#b91c1c', pulse: true, label: p.l }));
    const svg = indiaMapSvg({ w: 640, h: 410, stateColors: e.states, markers, aria: `Historical geography of India during ${e.en}` });
    return { svg, aria: `${e.en} (${e.year})`, lines: [{ en: `${e.en} (${e.year})`, hi: `${e.hi} (${e.yearHi})`, cls: 'balanced' }, e.desc] };
  },
  discover: [b('Step through all four periods. Watch the political centre shift from northwest rivers eastward into the fertile iron-rich Ganga basin.', 'चारों कालों को क्रम से देखें। देखें कि राजनीतिक केंद्र उत्तर-पश्चिम नदियों से पूर्व की ओर उपजाऊ गंगा मैदान में कैसे आया।')],
  predictions: [
    {
      id: 'p1',
      stem: b('Why did the Ganga basin (Magadha) rise as the dominant power base by c. 500 BCE?', 'लगभग 500 ई.पू. तक गंगा मैदान (मगध) सबसे शक्तिशाली केंद्र क्यों बन गया?'),
      options: [opt('iron', 'Fertile alluvial soil, iron ore/elephants nearby, and river-boat highways', 'उपजाऊ जलोढ़ भूमि, पास में लौह अयस्क/हाथी और नदी परिवहन मार्ग'), opt('snow', 'Heavy desert dunes prevented farming', 'मरुस्थलीय रेत ने खेती रोक दी')],
      run: (S) => { S.era = 'janapada'; return 'iron'; },
      explain: () => b('Magadha combined iron weapons/ploughs from Jharkhand, river trade on Ganga-Son, and dense rice yields.', 'मगध को उपजाऊ धान भूमि, निकटवर्ती लोहा, जंगल से हाथी और गंगा-सोन नदी व्यापार का लाभ मिला।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('What made Vajji (Vaishali) different from hereditary kingdoms like Magadha?', 'वज्जि (वैशाली) मगध जैसे वंशानुगत राज्यों से किस प्रकार भिन्न था?'),
      correct: 'gana',
      options: [
        { id: 'gana', ...b('It was a Gana-Sangha (republic) where multiple rajas ruled collectively by assembly.', 'यह एक गण-संघ था जहाँ अनेक राजा सभा द्वारा सामूहिक रूप से शासन करते थे।') },
        { id: 'emperor', ...b('It had one absolute emperor for life.', 'यहाँ आजीवन एक ही निरंकुश सम्राट होता था।'), why: b('Buddhist and Jain texts specifically record Vaishali’s collective assembly.', 'बौद्ध व जैन ग्रंथ वैशाली की सामूहिक सभा का स्पष्ट उल्लेख करते हैं।') },
      ],
      explain: b('Ancient India featured both monarchical mahajanapadas and oligarchic/republican gana-sanghas.', 'प्राचीन भारत में राजतंत्रात्मक महाजनपदों के साथ गण-संघ भी विद्यमान थे।'),
      hint: b('Open the 600–400 BCE Mahajanapadas period.', '600–400 ई.पू. महाजनपद काल चुनें।'),
    },
  ],
  reflect: b('Why did Emperor Ashoka place rock and pillar edicts along major highways and pilgrimage routes?', 'सम्राट अशोक ने अपने शिलालेख और स्तंभलेख प्रमुख राजमार्गों और तीर्थ मार्गों पर ही क्यों लगवाए?'),
};

// ================================================================ T05.L2 Source reading room
const SOURCES_T05 = {
  inscription: {
    en: 'Epigraphy: Ashoka’s Rock Edict XII (c. 250 BCE, Prakrit/Brahmi)',
    hi: 'अभिलेख: अशोक का शिलालेख XII (लगभग 250 ई.पू., प्राकृत/ब्राह्मी)',
    excerpt: b('“Whoever honours his own sect and disparages another’s merely out of attachment does great harm to his own sect. Concord (samavaya) is praiseworthy.”', '“जो अपने संप्रदाय का आदर और दूसरे की निंदा केवल आसक्ति से करता है, वह अपने ही संप्रदाय को हानि पहुँचाता है। सद्भाव (समवाय) ही श्रेयस्कर है।”'),
    strength: b('Dated direct stone engraving ordered by the ruler himself, unaffected by later scribal copying errors.', 'शासक द्वारा सीधे पत्थर पर खुदवाया समकालीन प्रमाण, जो बाद की प्रतिलिपि भूलों से सुरक्षित रहता है।'),
  },
  text: {
    en: 'Textual Source: Sangam Poetry (Purananuru, c. 100 BCE–300 CE)',
    hi: 'साहित्यिक स्रोत: संगम काव्य (पुरनानूरु, लगभग 100 ई.पू.–300 ई.)',
    excerpt: b('Poems praised generous chieftains, salt-cart traders, coastal Muchiri pepper ports, and women poets (Avvaiyar).', 'कविताओं में उदार सरदारों, नमक-व्यापारी गाड़ियों, मुचिरी मसाला बंदरगाह और कवयित्री अव्वैयार का वर्णन मिलता है।'),
    strength: b('Captures vivid everyday emotions, poets, and social values, though oral works were written down later.', 'दैनिक भावनाओं, कवियों व सामाजिक मूल्यों को सजीव दिखाता है, यद्यपि बाद में लिपिबद्ध हुआ।'),
  },
  material: {
    en: 'Material Evidence: Silver Punch-Marked Coins (Karshapana) & NBPW Pottery',
    hi: 'भौतिक साक्ष्य: चाँदी के आहत सिक्के (कार्षापण) व उत्तरी कृष्ण मार्जित मृद्भांड',
    excerpt: b('Excavated coins stamped with sun, mountain, and tree symbols plus glossy black bowls found across North & South India.', 'सूर्य, पर्वत व वृक्ष चिह्नों वाले आहत सिक्के और चमकदार काले कटोरे उत्तर से दक्षिण तक खुदाई में मिले।'),
    strength: b('Reveals trade volume and craft daily life of ordinary people whom royal inscriptions often omit.', 'सामान्य लोगों के व्यापार व शिल्प को दर्शाता है जिन्हें राज्याभिलेख अक्सर छोड़ देते हैं।'),
  },
};

export const sourceRoom = {
  id: 'T05.L2',
  objective: b('Compare inscriptions, literary texts and material artefacts as historical sources—identifying what each reveals and hides.', 'अभिलेखों, साहित्यिक ग्रंथों और भौतिक पुरावशेषों की तुलना करें—प्रत्येक क्या दिखाता और क्या छोड़ता है।'),
  note: { kind: 'documented', en: 'Translated summaries of historical source classes; inspect strengths & limits of each.', hi: 'ऐतिहासिक स्रोत-वर्गों के सार; प्रत्येक की शक्ति व सीमा देखें।' },
  init: () => ({ src: 'inscription' }),
  controls: [{ id: 'src', type: 'chips', label: b('Source type', 'स्रोत प्रकार'), options: [opt('inscription', 'Inscriptions (stone/copper)', 'अभिलेख'), opt('text', 'Literary texts', 'साहित्यिक ग्रंथ'), opt('material', 'Coins & pottery', 'सिक्के व मृद्भांड')] }],
  view(S) {
    const it = SOURCES_T05[S.src];
    const col = S.src === 'inscription' ? '#92400e' : S.src === 'text' ? '#4c1d95' : '#065f46';
    const svg = `<svg viewBox="0 0 640 190" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="16" width="604" height="158" rx="10" fill="var(--card)" stroke="${col}" stroke-width="3"/><rect x="38" y="38" width="84" height="114" rx="8" fill="${col}" opacity=".16"/><text class="txt b" x="80" y="102" text-anchor="middle" fill="${col}">${esc(S.src === 'inscription' ? '🪨' : S.src === 'text' ? '📜' : '🪙')}</text><text class="txt b" x="142" y="58">${esc(P(it.en, it.hi))}</text><text class="txt sm mut" x="142" y="92">${esc(P('Cross-check texts + stones + excavations for full truth', 'पूर्ण सत्य के लिए ग्रंथ + पत्थर + उत्खनन का मिलान करें'))}</text></svg>`;
    const plate = S.src === 'inscription'
      ? { src: 'assets/images/plates/t05-sources.jpg', en: 'Carved stone relief, tied palm-leaf manuscript and black ceramic bowl with punch-marked silver coins.', hi: 'तराशा गया पत्थर अभिलेख, ताड़पत्र पांडुलिपि और आहत चाँदी के सिक्कों वाला काला मृद्भांड।' }
      : S.src === 'text'
        ? { src: 'assets/images/plates/t05-knowledge.jpg', en: 'Bound palm-leaf Sanskrit manuscript and early vihara library veranda.', hi: 'ताड़पत्र पांडुलिपि और प्राचीन विहार का अध्ययन कक्ष।' }
        : { src: 'assets/images/plates/t13-artefacts.jpg', en: 'Excavated coins, pottery shards and trade beads — daily-life archaeological record.', hi: 'उत्खनित सिक्के, मृद्भांड व मनके — दैनिक जीवन के पुरातात्विक प्रमाण।' };
    return { plate, svg, aria: it.en, lines: [it.excerpt, it.strength] };
  },
  discover: [b('Compare all three sources. Which one tells us about ordinary artisans and farmers whom kings rarely carved on pillars?', 'तीनों स्रोतों की तुलना करें। साधारण शिल्पियों व किसानों के बारे में कौन-सा स्रोत बताता है?')],
  predictions: [
    {
      id: 'p1',
      stem: b('Why must historians cross-check a king’s royal inscription (e.g. a victory pillar) against archaeological remains and independent texts?', 'इतिहासकारों को राजा की प्रशस्ति या स्तंभलेख का मिलान पुरावशेषों व स्वतंत्र ग्रंथों से क्यों करना पड़ता है?'),
      options: [opt('bias', 'Royal inscriptions often exaggerate triumphs and reflect the ruler’s official point of view', 'राज्याभिलेख प्रायः विजय बढ़ा-चढ़ाकर दिखाते हैं और शासक का पक्ष प्रस्तुत करते हैं'), opt('fake', 'Stone cannot hold letters', 'पत्थर पर अक्षर नहीं टिकते')],
      run: (S) => { S.src = 'inscription'; return 'bias'; },
      explain: () => b('Epigraphy gives exact contemporary dates and official edicts, yet cross-checking avoids one-sided royal propaganda.', 'अभिलेख सटीक तिथि व राज्यादेश देते हैं, पर अन्य स्रोतों से मिलान करके एकतरफ़ा प्रशंसा से बचा जाता है।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Finding Roman gold coins and Sangam poetry praising foreign ships in Tamil Nadu is an example of…', 'तमिलनाडु में रोमन सोने के सिक्के और विदेशी जहाजों की प्रशंसा करती संगम कविता मिलना किसका उदाहरण है?'),
      correct: 'corroborate',
      options: [
        { id: 'corroborate', ...b('Independent material and literary sources confirming the same historical trade link.', 'स्वतंत्र भौतिक और साहित्यिक स्रोतों द्वारा एक ही व्यापारिक संपर्क की पुष्टि।') },
        { id: 'contradict', ...b('Sources contradicting each other completely.', 'स्रोतों का पूरी तरह खंडन।'), why: b('Coins and poems align to prove flourishing sea trade.', 'सिक्के और कविता दोनों समृद्ध समुद्री व्यापार की पुष्टि करते हैं।') },
      ],
      explain: b('Historians gain highest confidence when texts, inscriptions and excavated artefacts agree.', 'जब ग्रंथ, अभिलेख और उत्खनित वस्तुएँ मेल खाती हैं तब ऐतिहासिक निष्कर्ष सबसे मज़बूत होता है।'),
      hint: b('Compare Textual Source and Material Evidence.', 'साहित्यिक व भौतिक साक्ष्य देखें।'),
    },
  ],
  reflect: b('Imagine a historian 1,000 years from now studying our era from ONLY advertisements vs ONLY rubbish dumps—how would their story differ?', 'कल्पना करें 1,000 वर्ष बाद का इतिहासकार हमारे समय को केवल विज्ञापनों बनाम केवल कचरे के अवशेषों से पढ़े—क्या अंतर होगा?'),
};

// ================================================================ T05.L3 Early empire administration flow
export const empireAdmin = {
  id: 'T05.L3',
  objective: b('Trace how early empires (such as Mauryan & Gupta states) organised revenue, provinces, roads and justice, and test over-taxation risks.', 'समझें कि प्राचीन साम्राज्यों (मौर्य व गुप्त) ने राजस्व, प्रांत, सड़कें और न्याय कैसे संगठित किए, और अत्यधिक कर के जोखिम परखें।'),
  note: { kind: 'reconstruction', en: 'Inspired by Arthashastra & Ashokan edicts; illustrative administrative simulation.', hi: 'अर्थशास्त्र व अशोक अभिलेखों से प्रेरित; प्रशासनिक शिक्षण-मॉडल।' },
  init: () => ({ taxRate: 17, roadsInvest: 50, decentralized: false }),
  controls: [
    { id: 'taxRate', type: 'slider', label: b('Agricultural tax share (bhaga %)', 'कृषि कर अंश (भाग %)'), min: 8, max: 40, step: 1, fmt: (v) => `${v}%` },
    { id: 'roadsInvest', type: 'slider', label: b('Public works (canals, roads, inns)', 'लोक निर्माण (नहरें, सड़कें, सराय)'), min: 10, max: 90, step: 10, fmt: (v) => `${v}%` },
    { id: 'decentralized', type: 'toggle', label: b('Samanta / local provincial autonomy', 'सामंत / प्रांतीय स्वायत्तता') },
  ],
  view(S) {
    const leg = Math.max(5, Math.min(100, Math.round(75 - (S.taxRate - 16) * 2.1 + S.roadsInvest * 0.35)));
    const treasury = Math.round(S.taxRate * (1 - S.roadsInvest * 0.004) * (S.decentralized ? 0.8 : 1.05) * 4);
    const nodes = [
      { id: 'king', label: b('Samrat & Mantriparishad', 'सम्राट व मंत्रिपरिषद'), rw: 145, stroke: '#b45309' },
      { id: 'prov', label: b(S.decentralized ? 'Local Samantas' : 'Kumara Governors', S.decentralized ? 'स्थानीय सामंत' : 'प्रांतीय कुमार'), rw: 132, stroke: '#0b5cad' },
      { id: 'village', label: b('Gramika & Farmers', 'ग्रामिक व कृषक'), rw: 130, stroke: '#2e8b57' },
      { id: 'works', label: b('Irrigation & Highways', 'सिंचाई व राजमार्ग'), rw: 138, stroke: '#0284c7' },
    ];
    const links = [
      { source: 'village', target: 'prov', label: b(`${S.taxRate}% bhaga`, `${S.taxRate}% भाग`) },
      { source: 'prov', target: 'king', label: b('tribute/report', 'कर व सूचना') },
      { source: 'king', target: 'works', label: b(`${S.roadsInvest}% budget`, `${S.roadsInvest}% व्यय`) },
      { source: 'works', target: 'village', label: b('water & trade', 'जल व व्यापार') },
    ];
    const svg = forceGraphSvg({ w: 640, h: 300, nodes, links, activeId: leg < 45 ? 'village' : 'king', aria: 'Empire administration flow between ruler, provinces, farmers and public works' });
    return {
      svg,
      aria: `Tax ${S.taxRate}%, public works ${S.roadsInvest}%, legitimacy ${leg}%`,
      lines: [
        { en: `Tax ${S.taxRate}% (traditional norm ~1/6 = 16.7%): Citizen loyalty ${leg}%, Treasury balance ${treasury} units.`, hi: `कर ${S.taxRate}% (पारंपरिक मान ~1/6 = 16.7%): प्रजा संतोष ${leg}%, राजकोष ${treasury} इकाई।`, cls: leg < 45 ? 'warn' : 'balanced' },
        S.decentralized ? b('Note: Gupta-era samanta decentralisation lowered imperial costs yet allowed strong local chiefs to break away later.', 'नोट: गुप्तकालीन सामंत प्रणाली से केंद्रीय खर्च घटा पर स्थानीय शासकों के स्वतंत्र होने का जोखिम बढ़ा।') : b('Mauryan salaried officials answered to Pataliputra directly, requiring steady tax flow and efficient roads.', 'मौर्य वेतनभोगी अधिकारी सीधे पाटलिपुत्र के अधीन थे, जिसके लिए नियमित कर व सड़क संपर्क आवश्यक था।'),
      ],
    };
  },
  discover: [b('Raise agricultural tax from 16% to 38% with low public works. Watch citizen loyalty drop!', 'कम लोक-निर्माण पर कृषि कर 16% से 38% बढ़ाएँ। प्रजा संतोष गिरते देखें!')],
  predictions: [
    {
      id: 'p1',
      stem: b('According to ancient treatises like Arthashastra, if a king raises taxes far above the customary 1/6th share without building irrigation or safety…', 'अर्थशास्त्र जैसे प्राचीन ग्रंथों के अनुसार यदि राजा सिंचाई व सुरक्षा दिए बिना पारंपरिक छठे भाग से बहुत अधिक कर वसूले…'),
      options: [opt('revolt', 'Farmers abandon fields or rebel, shrinking long-term revenue', 'किसान खेत छोड़ते या विद्रोह करते हैं, जिससे दीर्घकालिक राजस्व घटता है'), opt('happy', 'Everyone grows richer', 'सब अधिक धनी हो जाते हैं')],
      run: (S) => { S.taxRate = 38; S.roadsInvest = 10; return 'revolt'; },
      explain: () => b('Kautilya compared fair taxation to picking ripe fruit without uprooting the orchard.', 'कौटिल्य ने न्यायसंगत कर की तुलना पके फल तोड़ने से की—पेड़ को जड़ से उखाड़ने से नहीं।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why did the Mauryan empire invest heavily in the Uttarapatha highway and roadside wells/inns?', 'मौर्य साम्राज्य ने उत्तरापथ राजमार्ग व सड़क किनारे कुओं-सरायों पर भारी निवेश क्यों किया?'),
      correct: 'admin',
      options: [
        { id: 'admin', ...b('Fast communication, trade tax collection, and movement of officials across a vast subcontinent.', 'तेज़ संवाद, व्यापार कर संग्रह व विशाल उपमहाद्वीप में प्रशासनिक नियंत्रण के लिए।') },
        { id: 'fun', ...b('Only for chariots to race on Sundays.', 'केवल रथ दौड़ प्रतियोगिताओं के लिए।'), why: b('Highways tied distant provinces and ports together.', 'राजमार्गों ने दूरस्थ प्रांतों और बंदरगाहों को जोड़ा।') },
      ],
      explain: b('Infrastructure turned geographic expanse into a connected state and trade network.', 'सड़क व सराय नेटवर्क ने विशाल भूभाग को एक जुड़े हुए राज्य व बाज़ार में बदला।'),
      hint: b('Move the Public works slider up and read the loyalty index.', 'लोक निर्माण स्लाइडर ऊपर ले जाकर पढ़ें।'),
    },
  ],
  reflect: b('Why did emperors appoint officers like Dhamma-mahamattas or maintain secret reporters alongside tax collectors?', 'सम्राटों ने कर संग्रहकर्ताओं के साथ धम्म-महामात्र जैसे अधिकारी या गुप्तचर क्यों नियुक्त किए?'),
};

// ================================================================ T05.L4 Knowledge traditions gallery
const KT_ITEMS = {
  lang: { en: 'Panini’s Ashtadhyayi (c. 5th BCE)', hi: 'पाणिनि की अष्टाध्यायी (ल. 5वीं शती ई.पू.)', body: b('Systematised Sanskrit grammar in ~4,000 compact algebraic rules (sutras), centuries before modern formal language theory.', 'लगभग 4,000 सूत्र-नियमों में संस्कृत व्याकरण का वैज्ञानिक व्यवस्थीकरण, आधुनिक औपचारिक भाषा सिद्धांत से सदियों पहले।') },
  med: { en: 'Charaka & Sushruta Samhitas (Ayurveda)', hi: 'चरक व सुश्रुत संहिता (आयुर्वेद)', body: b('Classified medicinal herbs, diet, diagnostic methods, and surgical instruments (including rhinoplasty & cataract couching).', 'औषधीय पौधों, आहार, निदान तथा शल्य-चिकित्सा उपकरणों व विधियों का विस्तृत वर्णन।') },
  math: { en: 'Zero, Place-Value & Aryabhata (499 CE)', hi: 'शून्य, स्थानीय मान व आर्यभट (499 ई.)', body: b('Decimal place-value notation with zero, π approximation (3.1416), and Aryabhata’s insight that Earth rotates on its axis.', 'दशमलव स्थानीय मान व शून्य, π का मान (3.1416) तथा पृथ्वी के अपनी धुरी पर घूमने की खोज।') },
  uni: { en: 'Takshashila & Nalanda Mahavihara', hi: 'तक्षशिला व नालंदा महाविहार', body: b('Residential centres attracting scholars from China, Tibet, Korea & Central Asia to debate logic, medicine, astronomy & Buddhist texts.', 'चीन, तिब्बत, कोरिया व मध्य एशिया से आए विद्वानों के आवासीय केंद्र जहाँ तर्क, चिकित्सा व खगोल पढ़ाए जाते थे।') },
};

export const knowledgeGallery = {
  id: 'T05.L4',
  objective: b('Explore India’s early knowledge traditions across grammar, medicine, mathematics/astronomy and residential universities.', 'व्याकरण, चिकित्सा, गणित/खगोल और आवासीय विश्वविद्यालयों में भारत की प्राचीन ज्ञान परंपराओं का अन्वेषण करें।'),
  note: { kind: 'documented', en: 'Historically attested works and sites up to 1000 CE; exact dates debated by scholars.', hi: '1000 ई. तक के प्रमाणित ग्रंथ व संस्थान; सटीक तिथियों पर शोध जारी है।' },
  init: () => ({ topic: 'math' }),
  controls: [{ id: 'topic', type: 'chips', label: b('Knowledge strand', 'ज्ञान क्षेत्र'), options: Object.entries(KT_ITEMS).map(([id, o]) => ({ id, en: o.en.split(' (')[0], hi: o.hi.split(' (')[0] })) }],
  view(S) {
    const it = KT_ITEMS[S.topic];
    const svg = `<svg viewBox="0 0 640 180" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="16" width="604" height="148" rx="12" fill="#fef9c3" stroke="#ca8a04" stroke-width="2.5"/><text class="txt b" x="320" y="68" text-anchor="middle">${esc(P(it.en, it.hi))}</text><text class="txt sm mut" x="320" y="106" text-anchor="middle">${esc(P('Observation · Logic · Debate · Oral & Manuscript Transmission', 'प्रेक्षण · तर्क · शास्त्रार्थ · मौखिक व पांडुलिपि परंपरा'))}</text></svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t05-knowledge.jpg',
        en: 'Palm-leaf grammar/astronomy manuscript, Ayurvedic mortar & brass armillary sphere at a brick vihara.',
        hi: 'ताड़पत्र पांडुलिपि, आयुर्वेदिक खरल और ईंट विहार में पीतल का खगोल यंत्र।',
      },
      svg,
      aria: it.en,
      lines: [{ en: it.en, hi: it.hi, cls: 'balanced' }, it.body],
    };
  },
  discover: [b('Click through all four cards. Notice how scholars across medicine, grammar and mathematics used structured rule systems.', 'चारों कार्ड देखें। ध्यान दें कि चिकित्सा, व्याकरण और गणित में नियमबद्ध प्रणालियाँ प्रयोग हुईं।')],
  predictions: [
    {
      id: 'p1',
      stem: b('Why was Nalanda famous across Asia by the 7th century CE?', 'सातवीं सदी ई. तक नालंदा पूरे एशिया में क्यों प्रसिद्ध था?'),
      options: [opt('uni', 'It was a vast residential library & debating centre attracting international scholars like Xuanzang', 'यह विशाल आवासीय पुस्तकालय व वाद-विवाद केंद्र था जहाँ ह्वेनसांग जैसे विदेशी विद्वान आते थे'), opt('fort', 'It was an iron foundry for cannons', 'यह तोप ढालने का कारखाना था')],
      run: (S) => { S.topic = 'uni'; return 'uni'; },
      explain: () => b('Nalanda housed thousands of monks and students supported by tax-free village grants, teaching diverse philosophies.', 'नालंदा में हजारों छात्र रहते थे जहाँ तर्कशास्त्र, दर्शन, चिकित्सा और खगोल का गहन अध्ययन होता था।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Which breakthrough made large astronomical calculations in ancient India vastly simpler than Roman numerals?', 'प्राचीन भारत की किस खोज ने बड़ी गणनाओं को रोमन अंकों की तुलना में बहुत सरल बना दिया?'),
      correct: 'dec',
      options: [
        { id: 'dec', ...b('The decimal place-value system with zero', 'शून्य के साथ दशमलव स्थानीय मान प्रणाली') },
        { id: 'tally', ...b('Counting solely on stones', 'केवल पत्थरों से गिनना'), why: b('Zero as a placeholder unlocked modern arithmetic worldwide.', 'शून्य के स्थानीय मान ने आधुनिक अंकगणित का मार्ग खोला।') },
      ],
      explain: b('From India, decimal place-value travelled through West Asian scholars to transform global science and trade.', 'भारत से दशमलव प्रणाली पश्चिम एशिया के विद्वानों द्वारा पूरे विश्व में पहुँची।'),
      hint: b('Open the Zero, Place-Value & Aryabhata card.', 'शून्य व आर्यभट कार्ड खोलें।'),
    },
  ],
  reflect: b('Why is open debate (shastrartha) important for keeping knowledge traditions alive and self-correcting?', 'ज्ञान परंपराओं को जीवित व त्रुटि-सुधार योग्य रखने के लिए खुला शास्त्रार्थ क्यों ज़रूरी है?'),
};

// ================================================================ T05.L5 Trade routes & guilds (shreni)
export const guildTrade = {
  id: 'T05.L5',
  objective: b('Plan caravan and coastal shipments along India’s ancient Uttarapatha and Dakshinapatha routes and understand how merchant guilds (shrenis) lowered risk.', 'प्राचीन भारत के उत्तरापथ व दक्षिणापथ मार्गों पर व्यापार योजना बनाएँ और जानें कि श्रेणी (व्यापारी संघ) ने जोखिम कैसे घटाया।'),
  note: { kind: 'reconstruction', en: 'Historic arteries mapped on datta07/INDIAN-SHAPEFILES; prices/profits are schematic teaching units.', hi: 'ऐतिहासिक मार्ग; कीमतें व लाभ शिक्षण-इकाइयाँ हैं।' },
  init: () => ({ route: 'uttarapatha', shreniJoin: true }),
  controls: [
    { id: 'route', type: 'chips', label: b('Trade corridor', 'व्यापार गलियारा'), options: [opt('uttarapatha', 'Uttarapatha (Taxila → Tamralipti)', 'उत्तरापथ (तक्षशिला → ताम्रलिप्ति)'), opt('dakshinapatha', 'Dakshinapatha (Pataliputra → Barygaza / Muziris)', 'दक्षिणापथ (पाटलिपुत्र → भृगुकच्छ / मुज़िरिस)')] },
    { id: 'shreniJoin', type: 'toggle', label: b('Operate inside a Shreni (merchant guild)', 'श्रेणी (व्यापारी संघ) में शामिल हों') },
  ],
  view(S) {
    const ut = S.route === 'uttarapatha';
    const coords = ut
      ? [[72.8, 33.7], [77.2, 28.6], [77.7, 27.5], [83.0, 25.3], [85.1, 25.6], [87.9, 22.3]]
      : [[85.1, 25.6], [78.6, 23.8], [75.8, 23.2], [73.0, 21.7], [76.2, 10.2]];
    const markers = ut
      ? [{ lon: 77.7, lat: 27.5, r: 6, fill: '#b45309', label: b('Mathura', 'मथुरा') }, { lon: 85.1, lat: 25.6, r: 7, fill: '#b45309', label: b('Pataliputra', 'पाटलिपुत्र') }, { lon: 87.9, lat: 22.3, r: 7, fill: '#0369a1', label: b('Tamralipti port', 'ताम्रलिप्ति') }]
      : [{ lon: 75.8, lat: 23.2, r: 6.5, fill: '#b45309', label: b('Ujjayini', 'उज्जयिनी') }, { lon: 73.0, lat: 21.7, r: 7, fill: '#0369a1', label: b('Barygaza (Bharuch)', 'भृगुकच्छ') }, { lon: 76.2, lat: 10.2, r: 7, fill: '#0369a1', label: b('Muziris', 'मुज़िरिस') }];
    const svg = indiaMapSvg({ w: 640, h: 410, paths: [{ coords, stroke: ut ? '#b45309' : '#7c3aed', width: 4 }], markers, aria: `${S.route} trade corridor across India` });
    const profit = S.shreniJoin ? 145 : 80;
    const risk = S.shreniJoin ? 'low (pooled escorts + guild credit)' : 'high (lone trader risk)';
    return {
      plate: {
        src: 'assets/images/plates/t05-guilds.jpg',
        en: 'Ancient Uttarapatha merchant guild (shreni): spice sacks, terracotta jars, silver punch-marked coins and ivory trade seal.',
        hi: 'प्राचीन उत्तरापथ की श्रेणी (व्यापारी संघ): मसालों की बोरियाँ, मिट्टी के घड़े, चाँदी के आहत सिक्के व व्यापारिक मुहर।',
      },
      svg,
      aria: `${S.route} with shreni=${S.shreniJoin}`,
      lines: [
        ut ? b('Uttarapatha carried horses, lapis, wool, Ganga textiles & fine bowls toward the Bay of Bengal port of Tamralipti.', 'उत्तरापथ से घोड़े, ऊन, रत्न व गंगा वस्त्र बंगाल की खाड़ी के ताम्रलिप्ति बंदरगाह तक जाते थे।')
          : b('Dakshinapatha linked northern cities via Ujjayini to western ports (Barygaza/Bharuch) and Kerala spice ports (Muziris).', 'दक्षिणापथ उज्जयिनी से होते हुए भृगुकच्छ और केरल के मुज़िरिस मसाला बंदरगाह को जोड़ता था।'),
        { en: `Net shipment outcome: ${profit} gold-unit score · Risk: ${risk}. Shrenis acted like early banks, setting quality rules & lending at fixed interest.`, hi: `अनुमानित व्यापार परिणाम: ${profit} · जोखिम: ${S.shreniJoin ? 'कम (सामूहिक सुरक्षा व ऋण)' : 'अधिक'}। श्रेणियाँ आरंभिक बैंकों व गुणवत्ता मानकों का काम करती थीं।`, cls: S.shreniJoin ? 'balanced' : 'warn' },
      ],
    };
  },
  discover: [b('Compare profits and risks with the Shreni toggle ON vs OFF.', 'श्रेणी विकल्प चालू और बंद कर लाभ व जोखिम की तुलना करें।')],
  predictions: [
    {
      id: 'p1',
      stem: b('How did ancient Indian shrenis (craft and merchant guilds) support long-distance trade?', 'प्राचीन भारतीय श्रेणियों (शिल्प व व्यापारी संघों) ने लंबी दूरी के व्यापार में कैसे मदद की?'),
      options: [opt('bank', 'They accepted deposits, lent working capital, hired caravan guards and guaranteed craft quality', 'वे जमा स्वीकार करतीं, ऋण देतीं, काफ़िला सुरक्षा रखतीं और गुणवत्ता की गारंटी देती थीं'), opt('forbid', 'They banned ships from using rivers', 'उन्होंने नदियों में नावें बंद कर दीं')],
      run: (S) => { S.shreniJoin = true; return 'bank'; },
      explain: () => b('Inscriptions at Mathura and Nasik record guilds managing endowments and reliable financial trust.', 'मथुरा व नासिक अभिलेखों से पता चलता है कि श्रेणियाँ ब्याज व दान निधियों का भरोसेमंद संचालन करती थीं।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Which city acted as a key junction connecting the northern plains to western sea ports along the Dakshinapatha?', 'दक्षिणापथ पर उत्तरी मैदानों को पश्चिमी समुद्री बंदरगाहों से जोड़ने वाला प्रमुख केंद्र कौन-सा था?'),
      correct: 'ujj',
      options: [
        { id: 'ujj', ...b('Ujjayini (Ujjain)', 'उज्जयिनी (उज्जैन)') },
        { id: 'leh', ...b('Leh glacier pass', 'लेह हिमनद दर्रा'), why: b('Leh sits in high Ladakh; Ujjayini linked the Narmada route to Barygaza.', 'उज्जयिनी ने गंगा मैदान को भृगुकच्छ बंदरगाह से जोड़ा।') },
      ],
      explain: b('Ujjayini was both a trade hub and astronomical centre linking north and west India.', 'उज्जयिनी उत्तर और पश्चिम भारत के व्यापार और खगोल अध्ययन का संगम था।'),
      hint: b('Select Dakshinapatha on the map.', 'मानचित्र पर दक्षिणापथ चुनें।'),
    },
  ],
  reflect: b('Why are shared trade trusts and standard weights almost as vital as good roads for expanding commerce?', 'व्यापार बढ़ाने के लिए अच्छी सड़कों जितना ही महत्त्वपूर्ण साझा विश्वास और मानक बाट क्यों होते हैं?'),
};
