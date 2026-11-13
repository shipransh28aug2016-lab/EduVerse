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

// ================================================================ T05.L1 Historical Geography up to 1000 CE (Sapta-Sindhu -> Chola Assemblies)
const T05_ERAS = {
  earlyVedic: { year: '1500–1000 BCE', yearHi: '1500–1000 ई.पू.', en: 'Early Vedic (Sapta-Sindhu)', hi: 'ऋग्वैदिक काल (सप्त-सिंधु)', form: b('Kin Assemblies (Sabha & Samiti)', 'कबीलाई सभा व समिति'), states: { Punjab: '#eab308', Haryana: '#eab308', 'Jammu & Kashmir': '#fde047' }, pts: [{ lon: 74.8, lat: 31.6, l: b('Sapta-Sindhu rivers', 'सप्त-सिंधु नदियाँ') }], desc: b('Pastoral clans along Indus tributaries governed through oral deliberation in Sabha (elders/council) & Samiti (general assembly).', 'सिंधु नदियों के किनारे पशुपालक जन सभा व समिति में संवाद से निर्णय लेते थे।') },
  janapada: { year: '600–400 BCE', yearHi: '600–400 ई.पू.', en: '16 Mahajanapadas (Magadha & Vajji)', hi: '16 महाजनपद (मगध व वज्जि)', form: b('Kingdoms vs Gana-Sangha Republics', 'राजतंत्र बनाम गणसंघ'), states: { Bihar: '#f97316', 'Uttar Pradesh': '#fb923c', 'Madhya Pradesh': '#fed7aa' }, pts: [{ lon: 85.1, lat: 25.6, l: b('Rajagriha / Pataliputra (Magadha)', 'राजगृह / पाटलिपुत्र (मगध)') }, { lon: 85.1, lat: 26.2, l: b('Vaishali (Vajji Gana-Sangha)', 'वैशाली (वज्जि गणसंघ)') }, { lon: 75.8, lat: 23.2, l: b('Ujjayini (Avanti)', 'उज्जयिनी (अवंति)') }], desc: b('Iron ploughshares & punch-marked coins fuelled cities; Vaishali ruled by collective Gana-Sangha debate alongside monarchies like Magadha.', 'लोहे के हल और आहत सिक्कों से नगर बसे; मगध राजतंत्र के साथ वैशाली में सामूहिक गणसंघ सभा थी।') },
  maurya: { year: '321–185 BCE', yearHi: '321–185 ई.पू.', en: 'Mauryan Empire & Ashokan Edicts', hi: 'मौर्य साम्राज्य व अशोक अभिलेख', form: b('Centralised Subcontinental Empire', 'केंद्रीकृत साम्राज्य'), states: { Bihar: '#b45309', 'Uttar Pradesh': '#d97706', Odisha: '#f59e0b', 'Madhya Pradesh': '#f59e0b', Maharashtra: '#fbbf24', Karnataka: '#fde68a', Gujarat: '#fbbf24' }, pts: [{ lon: 85.1, lat: 25.6, l: b('Pataliputra (Capital)', 'पाटलिपुत्र') }, { lon: 85.8, lat: 20.2, l: b('Kalinga (Dhauli edict)', 'कलिंग (धौली)') }, { lon: 76.5, lat: 14.5, l: b('Brahmagiri edict', 'ब्रह्मगिरि') }], desc: b('Salaried provincial Kumara governors, Uttarapatha highway, and stone edicts inscribed in spoken Prakrit (Brahmi/Kharoshthi) for public accountability.', 'वेतनभोगी प्रांतीय प्रशासन, उत्तरापथ राजमार्ग और जन-संवाद हेतु प्राकृत (ब्राह्मी) में पत्थर अभिलेख।') },
  gupta: { year: '320–650 CE', yearHi: '320–650 ई.', en: 'Gupta, Sangam & Harsha Era', hi: 'गुप्त, संगम व हर्ष काल', form: b('Samanta Autonomy + Regional Kings', 'सामंत स्वायत्तता व क्षेत्रीय राज्य'), states: { Bihar: '#7c3aed', 'Uttar Pradesh': '#8b5cf6', 'Madhya Pradesh': '#a78bfa', 'Tamil Nadu': '#10b981', Kerala: '#34d399' }, pts: [{ lon: 85.4, lat: 25.1, l: b('Nalanda University', 'नालंदा विश्वविद्यालय') }, { lon: 78.1, lat: 9.9, l: b('Madurai (Sangam Pandya)', 'मदुरै (संगम)') }, { lon: 79.9, lat: 27.0, l: b('Kanauj (Harsha)', 'कन्नौज (हर्ष)') }], desc: b('Tax-free grants sustained Nalanda; Aryabhata/Varahamihira advanced astronomy while Sangam Chera-Chola-Pandya ports boomed with Indian Ocean ships.', 'कर-मुक्त ग्राम दान से नालंदा चला; आर्यभट के खगोल व संगम बंदरगाहों ने विश्व को जोड़ा।') },
  chola1000: { year: '700–1000 CE', yearHi: '700–1000 ई.', en: 'Pala, Rashtrakuta & Chola Assemblies', hi: 'पाल, राष्ट्रकूट व चोल ग्राम सभाएँ', form: b('Tripartite States + Village Self-Rule', 'त्रिपक्षीय राज्य व ग्राम स्वशासन'), states: { 'Tamil Nadu': '#059669', Karnataka: '#0d9488', Maharashtra: '#14b8a6', Bihar: '#2563eb', 'West Bengal': '#3b82f6' }, pts: [{ lon: 79.7, lat: 12.6, l: b('Uttaramerur Sabha (Kudavolai)', 'उत्तरमेरूर चोल सभा') }, { lon: 77.2, lat: 17.2, l: b('Manyakheta (Rashtrakuta)', 'मान्यखेत (राष्ट्रकूट)') }, { lon: 87.2, lat: 25.3, l: b('Vikramashila (Pala)', 'विक्रमशिला (पाल)') }], desc: b('By 1000 CE, Chola temple inscriptions (Uttaramerur, c. 920 CE) record Kudavolai palm-leaf lottery elections for local tank, garden & justice committees.', '1000 ई. तक उत्तरमेरूर के चोल अभिलेखों (920 ई.) में ग्राम सभा व कुदावोलई (ताड़पत्र लॉटरी) चुनावों का प्रमाण मिलता है।') },
};

export const vedicDatedMap = {
  id: 'T05.L1',
  objective: b('Trace how political institutions evolved from Sapta-Sindhu assemblies and Vajji republics to Mauryan highways and 10th-century Chola village self-rule.', 'सप्त-सिंधु सभाओं और वज्जि गणसंघ से मौर्य राजमार्गों और 10वीं सदी के चोल ग्राम स्वशासन तक राजनीतिक संस्थाओं का विकास मानचित्र पर देखें।'),
  note: { kind: 'reconstruction', en: 'Historical cores up to 1000 CE mapped onto modern Indian state boundaries; boundaries shifted over decades.', hi: '1000 ई. तक के ऐतिहासिक क्षेत्र आधुनिक राज्य सीमाओं पर दर्शाए गए हैं।' },
  init: () => ({ era: 'earlyVedic', showTrade: true }),
  controls: [
    { id: 'era', type: 'chips', label: b('Historical period (up to 1000 CE)', 'ऐतिहासिक काल (1000 ई. तक)'), options: Object.entries(T05_ERAS).map(([id, o]) => ({ id, en: o.year, hi: o.yearHi })) },
    { id: 'showTrade', type: 'toggle', label: b('Overlay river & maritime trade links', 'नदी व समुद्री व्यापार मार्ग दिखाएँ') },
  ],
  view(S) {
    const e = T05_ERAS[S.era] || T05_ERAS.earlyVedic;
    const markers = e.pts.map((p) => ({ lon: p.lon, lat: p.lat, r: 7.5, fill: '#b91c1c', pulse: true, label: p.l }));
    const paths = S.showTrade ? [
      { coords: [[72.8, 33.7], [77.2, 28.6], [85.1, 25.6], [87.9, 22.3]], stroke: '#b45309', width: 2.5, dash: '6 4' },
      { coords: [[85.1, 25.6], [75.8, 23.2], [73.0, 21.7], [78.1, 9.9], [79.8, 11.1]], stroke: '#0284c7', width: 2.5, dash: '5 4' },
    ] : [];
    const svg = indiaMapSvg({ w: 640, h: 410, stateColors: e.states, markers, paths, aria: `Historical geography of India during ${e.en}` });
    return {
      svg,
      aria: `${e.en} (${e.year})`,
      lines: [
        { en: `${e.en} (${e.year}) · Governance: ${e.form.en}.`, hi: `${e.hi} (${e.yearHi}) · शासन रूप: ${e.form.hi}।`, cls: 'balanced' },
        e.desc,
      ],
    };
  },
  discover: [b('Step from 1500–1000 BCE all the way to 700–1000 CE. Notice how local assemblies reappear from Vedic Sabhas to Vajji and Chola Uttaramerur!', '1500 ई.पू. से 700–1000 ई. तक क्रम से देखें। वैदिक सभा से वज्जि और चोल उत्तरमेरूर तक स्थानीय सभाएँ बार-बार कैसे उभरीं!')],
  predictions: [
    {
      id: 'p1',
      stem: b('When you advance to 700–1000 CE in Tamil Nadu (Uttaramerur), what surprising civic institution appears carved in temple stone?', 'तमिलनाडु (उत्तरमेरूर, 700–1000 ई.) में मंदिर शिलालेख पर कौन-सी अनोखी नागरिक संस्था खुदी मिलती है?'),
      options: [opt('kudavolai', 'Village Sabha committees chosen by Kudavolai (palm-leaf lotteries) with strict public ethics rules', 'ग्राम सभा समितियाँ जो कुदावोलई (ताड़पत्र लॉटरी) व सख्त आचार नियमों से चुनी जाती थीं'), opt('secret', 'No village administration at all', 'कोई ग्राम प्रशासन नहीं था')],
      run: (S) => { S.era = 'chola1000'; return 'kudavolai'; },
      explain: () => b('Parantaka Chola I’s Uttaramerur inscriptions (919–921 CE) specify voter qualifications, lottery pot selection, and financial accountability.', 'चोल नरेश परांतक प्रथम के उत्तरमेरूर अभिलेख (919–921 ई.) में योग्यता, लॉटरी घड़े व हिसाब-किताब की पूरी विधि अंकित है।'),
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
      explain: b('Ancient India featured both monarchical mahajanapadas and collective republican gana-sanghas.', 'प्राचीन भारत में राजतंत्रात्मक महाजनपदों के साथ गण-संघ भी विद्यमान थे।'),
      hint: b('Open the 600–400 BCE Mahajanapadas period.', '600–400 ई.पू. महाजनपद काल चुनें।'),
    },
  ],
  reflect: b('Instead of memorising dynasty dates, explain WHY political centres grew where fertile floodplains, iron ore, and river/sea routes met.', 'वंशावली रटने के बजाय समझाएँ कि उपजाऊ मैदान, लोहा व नदी-समुद्र मार्ग मिलने वाले क्षेत्रों में ही बड़े राज्य क्यों पनपे?'),
};

// ================================================================ T05.L2 Primary Source & Corroboration Workbench
const SOURCES_T05 = {
  inscription: {
    en: 'Epigraphy: Ashoka Rock Edict XII & Uttaramerur Kudavolai (920 CE)',
    hi: 'अभिलेख: अशोक शिलालेख XII व उत्तरमेरूर कुदावोलई अभिलेख (920 ई.)',
    excerpt: b('Stone edicts capture contemporaneous civic policies: Ashoka urges inter-sect concord (samavaya), while Uttaramerur lists rules disqualifying corrupt officials from village lottery elections.', 'शिलालेख समकालीन नियम दर्ज करते हैं: अशोक सद्भाव (समवाय) की अपील करते हैं, और उत्तरमेरूर भ्रष्ट अधिकारियों को ग्राम चुनाव से अयोग्य ठहराता है।'),
    biasAlert: b('Limit: Stone messages record official rules, not necessarily whether every villager always obeyed them.', 'सीमा: शिलालेख आधिकारिक नियम दिखाते हैं, यह नहीं कि हर व्यक्ति उनका पालन करता था या नहीं।'),
  },
  text: {
    en: 'Literature & Travelogues: Sangam Poetry & Xuanzang (7th CE)',
    hi: 'साहित्य व यात्रा-वृत्तांत: संगम काव्य व ह्वेनसांग (7वीं सदी ई.)',
    excerpt: b('Purananuru celebrates Tamil poets like Avvaiyar & coastal trade; Chinese monk Xuanzang documented Nalanda’s 10,000+ residents & open logical debates.', 'पुरनानूरु कवयित्री अव्वैयार व तटीय व्यापार का वर्णन करता है; चीनी यात्री ह्वेनसांग ने नालंदा के छात्र-जीवन व तर्क-शास्त्रार्थ लिखा।'),
    biasAlert: b('Limit: Poets praise patrons and oral hymns were compiled later; travellers describe only places they personally visited.', 'सीमा: कवि प्रायः आश्रयदाता की प्रशंसा करते थे और यात्री केवल देखे गए स्थलों का वर्णन करते हैं।'),
  },
  material: {
    en: 'Material Evidence: Karshapana Coins, Roman Gold & NBPW Bowls',
    hi: 'भौतिक साक्ष्य: आहत सिक्के, रोमन स्वर्ण व काले मृद्भांड',
    excerpt: b('Stamped silver coins, Mediterranean amphorae at Arikamedu, and glossy black bowls preserve daily artisan and merchant life across strata.', 'चाँदी के आहत सिक्के, अरिकामेडु में रोमन पात्र और चमकदार मृद्भांड आम शिल्पियों व व्यापारियों का जीवन दर्शाते हैं।'),
    biasAlert: b('Limit: Mute artefacts cannot directly tell us their makers’ names, debates, or religious philosophy.', 'सीमा: मौन पुरावशेष अपने निर्माताओं के नाम या विचार सीधे नहीं बोल सकते।'),
  },
  prashasti: {
    en: 'Royal Eulogy: Samudragupta’s Prayaga Prashasti (c. 350 CE)',
    hi: 'राजप्रशस्ति: समुद्रगुप्त का प्रयाग प्रशस्ति स्तंभ (ल. 350 ई.)',
    excerpt: b('Composed in ornate Sanskrit by court poet Harishena, praising the emperor as undefeated across dozens of kings — an essential political map, yet clearly court-authored praise.', 'राजकवि हरिषेण द्वारा संस्कृत में रचित स्तंभलेख जो सम्राट को अजेय बताता है — महत्त्वपूर्ण मानचित्र है पर दरबारी प्रशंसा भी।'),
    biasAlert: b('AI-Era Warning: Treating a royal prashasti alone as balanced fact mirrors trusting one-sided PR!', 'चेतावनी: केवल दरबारी प्रशस्ति को पूर्ण सत्य मानना एकतरफ़ा प्रचार पर भरोसा करने जैसा है!'),
  },
};

export const sourceRoom = {
  id: 'T05.L2',
  objective: b('Practise historian triangulation: compare inscriptions, texts, material finds and royal prashastis to spot bias and raise confidence.', 'इतिहासकार की त्रिकोणीय जाँच सीखें: अभिलेख, ग्रंथ, पुरावशेष और प्रशस्ति की तुलना कर पक्षपात पहचानें।'),
  note: { kind: 'documented', en: 'Demonstrates historical corroboration — checking independent evidence classes before accepting a claim.', hi: 'ऐतिहासिक प्रमाण-मिलान दर्शाता है — किसी भी दावे से पहले स्वतंत्र स्रोतों की जाँच।' },
  init: () => ({ src: 'inscription', corroborate: true }),
  controls: [
    { id: 'src', type: 'chips', label: b('Evidence category', 'साक्ष्य वर्ग'), options: [opt('inscription', 'Stone Edicts', 'शिलालेख'), opt('text', 'Texts / Travelogues', 'ग्रंथ / यात्रा-लेख'), opt('material', 'Coins & Pottery', 'सिक्के व मृद्भांड'), opt('prashasti', 'Royal Prashasti', 'राजप्रशस्ति')] },
    { id: 'corroborate', type: 'toggle', label: b('Triangulate with other independent sources', 'अन्य स्वतंत्र स्रोतों से मिलान करें') },
  ],
  view(S) {
    const it = SOURCES_T05[S.src] || SOURCES_T05.inscription;
    const col = S.src === 'inscription' ? '#92400e' : S.src === 'text' ? '#4c1d95' : S.src === 'material' ? '#065f46' : '#b91c1c';
    const conf = S.corroborate ? (S.src === 'prashasti' ? 86 : 95) : (S.src === 'prashasti' ? 35 : 54);
    const barW = Math.round((conf / 100) * 440);
    const svg = `<svg viewBox="0 0 640 210" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="14" width="604" height="182" rx="10" fill="var(--card)" stroke="${col}" stroke-width="3"/><text class="txt b" x="36" y="46" fill="${col}">${esc(P(it.en, it.hi))}</text><rect x="36" y="68" width="560" height="44" rx="8" fill="var(--bg)" stroke="var(--line)"/><text class="txt sm" x="50" y="95">${esc(P(S.corroborate ? 'Corroboration ON: Texts + Stone + Excavations cross-checked' : 'Single Source ONLY: High risk of royal praise or blindspot!', S.corroborate ? 'मिलान चालू: ग्रंथ + अभिलेख + उत्खनन जाँचे गए' : 'केवल एक स्रोत: पक्षपात या अधूरी तस्वीर का जोखिम!'))}</text><text class="txt sm b" x="36" y="138">${esc(P(`Historical Confidence: ${conf}%`, `ऐतिहासिक विश्वसनीयता: ${conf}%`))}</text><rect x="36" y="148" width="440" height="16" rx="8" fill="#e2e8f0"/><rect x="36" y="148" width="${barW}" height="16" rx="8" fill="${conf >= 80 ? '#16a34a' : '#d97706'}"/></svg>`;
    const plate = S.src === 'inscription'
      ? { src: 'assets/images/plates/t05-sources.jpg', en: 'Carved stone relief, tied palm-leaf manuscript and black ceramic bowl with punch-marked silver coins.', hi: 'तराशा गया पत्थर अभिलेख, ताड़पत्र पांडुलिपि और आहत चाँदी के सिक्कों वाला काला मृद्भांड।' }
      : S.src === 'text'
        ? { src: 'assets/images/plates/t05-knowledge.jpg', en: 'Bound palm-leaf manuscript and brick vihara courtyard — classical textual & monastic archive.', hi: 'ताड़पत्र पांडुलिपि और प्राचीन विहार अध्ययन कक्ष।' }
        : { src: 'assets/images/plates/t13-artefacts.jpg', en: 'Excavated coins, pottery shards and trade beads — silent physical proof of everyday exchange.', hi: 'उत्खनित सिक्के, मृद्भांड व मनके — दैनिक जीवन के भौतिक साक्ष्य।' };
    return { plate, svg, aria: `${it.en}, confidence ${conf}%`, lines: [it.excerpt, { ...it.biasAlert, cls: S.corroborate ? 'balanced' : 'warn' }] };
  },
  discover: [b('Pick Royal Prashasti and toggle cross-checking OFF vs ON. Notice confidence jumps from 35% to 86% once corroborated!', 'राजप्रशस्ति चुनें और मिलान बंद बनाम चालू करें। त्रिकोणीय जाँच से विश्वसनीयता 35% से 86% तक बढ़ते देखें!')],
  predictions: [
    {
      id: 'p1',
      stem: b('Suppose you read Samudragupta’s Prayaga Prashasti claiming effortless conquests everywhere. How would a 21st-century historian test its accuracy?', 'मान लीजिए आप प्रयाग प्रशस्ति पढ़ते हैं जिसमें हर राजा पर सहज विजय का दावा है। आधुनिक इतिहासकार इसकी जाँच कैसे करेगा?'),
      options: [opt('cross', 'Cross-check against local dynasties’ inscriptions, coins & geography to separate royal praise from verified control', 'स्थानीय राजवंशों के अभिलेखों, सिक्कों व भूगोल से मिलान कर प्रशंसा और वास्तविक नियंत्रण में अंतर करेगा'), opt('copy', 'Repeat every poetic adjective word-for-word as literal fact', 'हर काव्यात्मक विशेषण को ज्यों का त्यों तथ्य मान लेगा')],
      run: (S) => { S.src = 'prashasti'; S.corroborate = true; return 'cross'; },
      explain: () => b('Royal eulogies are precious clues to imperial ideology, yet must always be cross-checked against independent inscriptions and coins.', 'राजप्रशस्ति सम्राट के आदर्श बताती है पर वास्तविक सीमा जानने को अन्य सिक्कों व अभिलेखों से मिलान आवश्यक है।'),
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
      hint: b('Switch on Triangulate with other independent sources.', 'अन्य स्वतंत्र स्रोतों से मिलान चालू करें।'),
    },
  ],
  reflect: b('Imagine a historian 1,000 years from now studying our era from ONLY viral AI posts vs corroborated public archives—how would their story differ?', 'कल्पना करें 1,000 वर्ष बाद का इतिहासकार हमारे युग को केवल वायरल पोस्ट बनाम प्रमाणित अभिलेखों से पढ़े—क्या अंतर होगा?'),
};

// ================================================================ T05.L3 Saptanga & State-vs-Society Governance Lab
export const empireAdmin = {
  id: 'T05.L3',
  objective: b('Test Kautilya’s Saptanga statecraft model up to 1000 CE: balance taxes, highways, irrigation and local assemblies (Gana, Maurya, Samanta, Chola Sabha).', '1000 ई. तक के सप्तांग राज्य-मॉडल को परखें: कर, राजमार्ग, सिंचाई और स्थानीय सभाओं (गणसंघ, मौर्य, सामंत, चोल सभा) में संतुलन बनाएँ।'),
  note: { kind: 'schematic', en: 'Models Arthashastra Saptanga limbs + Chola Uttaramerur local assembly trade-offs.', hi: 'अर्थशास्त्र सप्तांग सिद्धांत और चोल ग्राम सभा के संतुलन का शिक्षण-मॉडल।' },
  init: () => ({ govMode: 'maurya', taxRate: 17, roadsInvest: 50, irrigationInvest: 50 }),
  controls: [
    { id: 'govMode', type: 'chips', label: b('State architecture', 'शासन प्रणाली'), options: [opt('gana', 'Gana-Sangha (Vajji)', 'गणसंघ (वज्जि)'), opt('maurya', 'Mauryan Central', 'मौर्य केंद्रीकृत'), opt('samanta', 'Samanta Feudatory', 'सामंत प्रणाली'), opt('chola', 'Chola + Village Sabha', 'चोल + ग्राम सभा')] },
    { id: 'taxRate', type: 'slider', label: b('Agricultural tax (bhaga %)', 'कृषि कर (भाग %)'), min: 8, max: 40, step: 1, fmt: (v) => `${v}%` },
    { id: 'roadsInvest', type: 'slider', label: b('Highways, inns & wells (%)', 'राजमार्ग, सराय व कुएँ (%)'), min: 10, max: 90, step: 10, fmt: (v) => `${v}%` },
    { id: 'irrigationInvest', type: 'slider', label: b('Canals & village tanks (%)', 'नहरें व ग्राम तालाब (%)'), min: 10, max: 90, step: 10, fmt: (v) => `${v}%` },
  ],
  view(S) {
    const r = H.saptangaEmpireSim({ governanceMode: S.govMode, taxRate: S.taxRate, roadsInvest: S.roadsInvest, irrigationInvest: S.irrigationInvest });
    const nodes = [
      { id: 'king', label: b(S.govMode === 'gana' ? 'Assembly Rajas' : 'Samrat & Council', S.govMode === 'gana' ? 'गणसंघ सभा' : 'सम्राट व परिषद'), rw: 145, stroke: '#b45309' },
      { id: 'prov', label: b(S.govMode === 'samanta' ? 'Autonomous Samantas' : S.govMode === 'chola' ? 'Nadu / Village Sabha' : 'Kumara Officials', S.govMode === 'samanta' ? 'स्वायत्त सामंत' : S.govMode === 'chola' ? 'नाडु व ग्राम सभा' : 'प्रांतीय अधिकारी'), rw: 142, stroke: '#0b5cad' },
      { id: 'village', label: b('Farmers & Artisans', 'कृषक व शिल्पी'), rw: 132, stroke: '#2e8b57' },
      { id: 'works', label: b('Canals & Highways', 'नहरें व राजमार्ग'), rw: 136, stroke: '#0284c7' },
    ];
    const links = [
      { source: 'village', target: 'prov', label: b(`${S.taxRate}% bhaga`, `${S.taxRate}% भाग`) },
      { source: 'prov', target: 'king', label: b(S.govMode === 'samanta' ? 'feudatory tribute' : 'revenue & order', S.govMode === 'samanta' ? 'सामंत कर' : 'राजस्व व व्यवस्था') },
      { source: 'king', target: 'works', label: b(`${Math.round((S.roadsInvest + S.irrigationInvest) / 2)}% works`, 'लोक व्यय') },
      { source: 'works', target: 'village', label: b('water & trade', 'जल व व्यापार') },
    ];
    const netSvg = forceGraphSvg({ w: 640, h: 250, nodes, links, activeId: r.legitimacy < 45 ? 'village' : 'king', aria: 'State and society resource circulation diagram' });
    const bars = r.limbs.map((lb, idx) => {
      const y = 18 + idx * 24;
      const bw = Math.round((lb.val / 100) * 320);
      const col = lb.val >= 65 ? '#16a34a' : lb.val >= 40 ? '#d97706' : '#dc2626';
      return `<text class="txt sm b" x="14" y="${y + 12}">${esc(P(lb.en, lb.hi))}</text><rect x="230" y="${y}" width="320" height="14" rx="7" fill="var(--bg)" stroke="var(--line)"/><rect x="230" y="${y}" width="${bw}" height="14" rx="7" fill="${col}"/><text class="txt sm b" x="560" y="${y + 12}">${lb.val}%</text>`;
    }).join('');
    const barSvg = `<svg viewBox="0 0 640 148" class="chart" role="img" aria-label="${esc(P('Saptanga state health indicators', 'सप्तांग राज्य स्वास्थ्य सूचक'))}" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="632" height="140" rx="10" fill="var(--card)" stroke="var(--line)"/>${bars}</svg>`;
    return {
      svg: netSvg + barSvg,
      aria: `${S.govMode}: legitimacy ${r.legitimacy}%, village ${r.villageResilience}%, breakaway risk ${r.breakawayRisk}%`,
      lines: [
        { en: `Legitimacy ${r.legitimacy}% · Village Tank/Crop Resilience ${r.villageResilience}% · Treasury ${r.treasury}% · Breakaway Risk ${r.breakawayRisk}%.`, hi: `प्रजा विश्वास ${r.legitimacy}% · ग्राम कृषि स्थिरता ${r.villageResilience}% · राजकोष ${r.treasury}% · विखंडन जोखिम ${r.breakawayRisk}%।`, cls: r.legitimacy < 45 || r.breakawayRisk > 60 ? 'warn' : 'balanced' },
        S.govMode === 'chola'
          ? b('Chola model combines imperial reach with self-governing village Sabhas & tank committees — sustaining local resilience!', 'चोल मॉडल साम्राज्य के साथ स्वायत्त ग्राम सभा व तालाब समितियों को जोड़ता है — स्थानीय स्थिरता बढ़ती है!')
          : S.govMode === 'samanta'
            ? b('Samanta autonomy lowers central administration cost, yet powerful feudatories risk breaking away if central oversight weakens.', 'सामंत स्वायत्तता केंद्रीय खर्च घटाती है पर शक्तिशाली सामंत स्वतंत्र होने का जोखिम बढ़ाते हैं।')
            : b('Traditional Arthashastra bhaga (~1/6 = 16.7%) keeps citizens supportive; heavy taxes (>28%) erode long-term revenue.', 'पारंपरिक 1/6 (16.7%) कर व लोक निर्माण राज्य-समाज संतुलन बनाए रखते हैं; अत्यधिक कर (>28%) विश्वास तोड़ता है।'),
      ],
    };
  },
  discover: [b('Compare Chola + Village Sabha vs Samanta Feudatory at 24% tax and 70% canal investment. Watch breakaway risk vs village resilience!', '24% कर व 70% सिंचाई पर सामंत बनाम चोल ग्राम सभा देखें। विखंडन जोखिम और ग्राम स्थिरता में अंतर परखें!')],
  predictions: [
    {
      id: 'p1',
      stem: b('According to Arthashastra Saptanga logic, if a ruler pushes tax above 35% while cutting irrigation and roads…', 'अर्थशास्त्र सप्तांग तर्क के अनुसार यदि शासक सिंचाई व सड़कें घटाकर 35% से अधिक कर वसूले…'),
      options: [opt('collapse', 'Citizen trust (Janapada) plunges and breakaway risk spikes', 'जन-विश्वास (जनपद) गिरता है और विद्रोह/विखंडन जोखिम तेजी से बढ़ता है'), opt('eternal', 'Treasury stays permanently strong', 'राजकोष हमेशा के लिए मजबूत रहता है')],
      run: (S) => { S.taxRate = 38; S.roadsInvest = 10; S.irrigationInvest = 10; return 'collapse'; },
      explain: () => b('Kautilya’s Saptanga treats prosperous citizens (Janapada) as the root of Kosha (treasury); squeezing farmers ruins both.', 'कौटिल्य के सप्तांग में समृद्ध प्रजा ही राजकोष की जड़ है; अत्यधिक कर दोनों को नष्ट कर देता है।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why did Chola inscriptions highlight local Kudavolai village committees alongside the king’s army and treasury?', 'चोल अभिलेखों में राजा की सेना व कोष के साथ स्थानीय कुदावोलई ग्राम समितियों का इतना महत्त्व क्यों था?'),
      correct: 'local',
      options: [
        { id: 'local', ...b('Village Sabhas maintained irrigation tanks, justice and fair taxes locally across centuries.', 'ग्राम सभाएँ सदियों तक सिंचाई तालाबों, स्थानीय न्याय व करों की देखरेख करती थीं।') },
        { id: 'ignore', ...b('Because Chola villages had zero agriculture.', 'क्योंकि चोल गाँवों में खेती नहीं होती थी।'), why: b('Kaveri delta wet-rice irrigation depended directly on village tank committees.', 'कावेरी डेल्टा की धान सिंचाई ग्राम तालाब समितियों पर निर्भर थी।') },
      ],
      explain: b('Effective states before 1000 CE coupled higher coordination with resilient self-governing communities.', '1000 ई. से पूर्व सफल राज्यों ने केंद्रीय समन्वय को मजबूत स्थानीय ग्राम संस्थाओं से जोड़ा।'),
      hint: b('Select Chola + Village Sabha and watch the Janapada bar.', 'चोल + ग्राम सभा चुनकर जनपद पट्टी देखें।'),
    },
  ],
  reflect: b('Which principle from Saptanga or Chola village assemblies matters most for democratic municipal governance in your town today?', 'सप्तांग या चोल ग्राम सभा का कौन-सा सिद्धांत आज आपके नगर या पंचायत शासन के लिए सबसे प्रासंगिक है?'),
};

// ================================================================ T05.L4 Indian Knowledge Systems & AI Parallels
const KT_ITEMS = {
  lang: {
    en: 'Panini’s Ashtadhyayi (c. 5th BCE) · Generative Rules',
    hi: 'पाणिनि की अष्टाध्यायी · सूत्र-आधारित भाषा प्रणाली',
    body: b('Encoded Sanskrit grammar in ~4,000 algebraic sutras using meta-rules & recursion — recognised globally as an ancient ancestor of formal programming & NLP syntax.', 'लगभग 4,000 संक्षिप्त सूत्रों में संस्कृत व्याकरण का वैज्ञानिक व्यवस्थीकरण — आधुनिक औपचारिक व्याकरण व एआई भाषा-नियमों का प्राचीन पूर्वज।'),
    aiParallel: b('AI Parallel: Just like modern parsers generate valid sentences from compact rules, Panini derived vast vocabulary algorithmically from root stems.', 'एआई समानता: आधुनिक कंप्यूटर पार्सर की तरह पाणिनि ने संक्षिप्त नियमों से संपूर्ण भाषा-संरचना उत्पन्न की।'),
  },
  math: {
    en: 'Zero, Aryabhata (499 CE) & Brahmagupta (628 CE)',
    hi: 'शून्य, आर्यभट (499 ई.) व ब्रह्मगुप्त (628 ई.)',
    body: b('Decimal place-value with zero, negative numbers, rules of zero arithmetic, π ≈ 3.1416, and Earth’s daily axial rotation causing apparent star motion.', 'दशमलव स्थानीय मान व शून्य के नियम, ऋणात्मक संख्याएँ, π ≈ 3.1416 और पृथ्वी के अपनी धुरी पर घूमने की खोज।'),
    aiParallel: b('AI Parallel: Binary & decimal place-value notation plus algorithmic step-by-step calculation underpin every computer chip today.', 'एआई समानता: स्थानीय मान व चरणबद्ध कलन-विधि (एल्गोरिदम) आज के हर प्रोसेसर की आधारशिला हैं।'),
  },
  med: {
    en: 'Charaka & Sushruta Samhitas (Empirical Medicine)',
    hi: 'चरक व सुश्रुत संहिता (आयुर्वेद विज्ञान)',
    body: b('Systematic observation of symptoms, dietetics, hundreds of medicinal plants, sterile wound care, and 120+ surgical instruments (including reconstructive rhinoplasty).', 'रोग लक्षणों का व्यवस्थित अवलोकन, औषधीय पौधे, शल्य-चिकित्सा के 120+ यंत्र और नासिका-पुनर्निर्माण विधियाँ।'),
    aiParallel: b('AI Parallel: Clinical triage follows decision trees—observe evidence, test hypotheses, and track patient outcomes before prescribing.', 'एआई समानता: आधुनिक नैदानिक निर्णय-वृक्ष की तरह प्रमाण देखें, परिकल्पना परखें और परिणाम जांचें।'),
  },
  metal: {
    en: 'Mehrauli Iron Pillar (c. 400 CE) & Wootz Crucible Steel',
    hi: 'महरौली लौह स्तंभ व वूट्ज़ इस्पात धातुकर्म',
    body: b('A 7.2-metre 6-tonne forge-welded iron pillar standing outdoors in Delhi for 1,600+ years without rust thanks to phosphorus-iron passive film; South Indian crucible Wootz steel traded worldwide.', '1,600 वर्षों से बिना जंग लगे खड़ा 7.2 मीटर महरौली स्तंभ (फॉस्फोरस-युक्त लौह परत) और दक्षिण भारत का विश्वप्रसिद्ध वूट्ज़ इस्पात।'),
    aiParallel: b('AI Parallel: Materials engineering combines controlled heat chemistry and empirical testing — proving ancient craft labs did rigorous experiments.', 'एआई समानता: नियंत्रित ताप-रसायन व परीक्षण दिखाते हैं कि प्राचीन शिल्पशालाएँ वास्तविक प्रयोगशालाएँ थीं।'),
  },
  uni: {
    en: 'Takshashila, Nalanda & Vikramashila (up to 1000 CE)',
    hi: 'तक्षशिला, नालंदा व विक्रमशिला विश्वविद्यालय',
    body: b('Residential international centres (up to 1000 CE) funded by village grants, drawing scholars from China, Tibet, Korea & Central Asia for logic (nyaya), astronomy & open Shastrartha debates.', 'ग्राम-दान से पोषित आवासीय केंद्र जहाँ चीन, तिब्बत व कोरिया के विद्वान तर्कशास्त्र, खगोल व खुले शास्त्रार्थ में भाग लेते थे।'),
    aiParallel: b('AI Parallel: Shastrartha (rules of structured counter-argument & testing flaws) works exactly like peer review and adversarial AI fact-checking!', 'एआई समानता: शास्त्रार्थ (तर्क व खंडन से त्रुटि पकड़ना) आधुनिक वैज्ञानिक सहकर्मी-समीक्षा और एआई तथ्य-जाँच जैसा ही है!'),
  },
};

export const knowledgeGallery = {
  id: 'T05.L4',
  objective: b('Explore India’s ancient knowledge systems up to 1000 CE — grammar algorithms, zero, surgery, metallurgy & Nalanda/Vikramashila debates — and connect them to AI-era thinking.', '1000 ई. तक की भारतीय ज्ञान परंपराओं — व्याकरण सूत्र, शून्य, शल्य-चिकित्सा, धातुकर्म और नालंदा-विक्रमशिला शास्त्रार्थ — को एआई युग की सोच से जोड़ें।'),
  note: { kind: 'documented', en: 'Historically attested treatises and sites; dates are scholarly estimates.', hi: 'प्रमाणित प्राचीन ग्रंथ व स्थल; तिथियाँ विद्वानों द्वारा आकलित हैं।' },
  init: () => ({ topic: 'lang', compareAi: true }),
  controls: [
    { id: 'topic', type: 'chips', label: b('Knowledge tradition', 'ज्ञान परंपरा'), options: Object.entries(KT_ITEMS).map(([id, o]) => ({ id, en: o.en.split(' (')[0].split(' ·')[0], hi: o.hi.split(' (')[0].split(' ·')[0] })) },
    { id: 'compareAi', type: 'toggle', label: b('Highlight 21st-century AI & STEM connection', '21वीं सदी एआई / विज्ञान जुड़ाव दिखाएँ') },
  ],
  view(S) {
    const it = KT_ITEMS[S.topic] || KT_ITEMS.lang;
    const badge = S.compareAi ? '⚡ 21st-Century Algorithmic & Empirical Method' : 'Observation · Logic · Manuscript Tradition';
    const badgeHi = S.compareAi ? '⚡ 21वीं सदी एल्गोरिदमिक व प्रयोग-आधारित दृष्टिकोण' : 'प्रेक्षण · तर्क · पांडुलिपि परंपरा';
    const svg = `<svg viewBox="0 0 640 190" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="14" width="604" height="162" rx="12" fill="${S.compareAi ? '#eff6ff' : '#fef9c3'}" stroke="${S.compareAi ? '#0b5cad' : '#ca8a04'}" stroke-width="2.5"/><text class="txt b" x="320" y="64" text-anchor="middle">${esc(P(it.en, it.hi))}</text><rect x="64" y="88" width="512" height="40" rx="8" fill="var(--card)" stroke="var(--line)"/><text class="txt sm b" x="320" y="113" text-anchor="middle">${esc(P(badge, badgeHi))}</text><text class="txt sm mut" x="320" y="156" text-anchor="middle">${esc(P('Rule Systems · Debate (Shastrartha) · Cross-Cultural Exchange', 'नियम-प्रणाली · शास्त्रार्थ · वैश्विक ज्ञान आदान-प्रदान'))}</text></svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t05-knowledge.jpg',
        en: 'Palm-leaf grammar/astronomy manuscript, Ayurvedic mortar & brass armillary sphere at a brick vihara.',
        hi: 'ताड़पत्र पांडुलिपि, आयुर्वेदिक खरल और ईंट विहार में पीतल का खगोल यंत्र।',
      },
      svg,
      aria: it.en,
      lines: [
        { en: it.en, hi: it.hi, cls: 'balanced' },
        it.body,
        ...(S.compareAi ? [{ ...it.aiParallel, cls: 'balanced' }] : []),
      ],
    };
  },
  discover: [b('Inspect Panini’s Grammar and Vikramashila/Nalanda with the 21st-Century AI toggle ON. Why is rule-based testing + open debate still essential in the AI era?', 'पाणिनि व नालंदा कार्ड पर एआई जुड़ाव चालू कर देखें। आज के एआई युग में नियम-जाँच और खुला शास्त्रार्थ क्यों ज़रूरी है?')],
  predictions: [
    {
      id: 'p1',
      stem: b('Why did scholars from China, Tibet and Korea travel thousands of kilometres to Nalanda and Vikramashila up to 1000 CE?', '1000 ई. तक चीन, तिब्बत और कोरिया से विद्वान हजारों किलोमीटर चलकर नालंदा व विक्रमशिला क्यों आते थे?'),
      options: [opt('uni', 'To study vast residential libraries, logic (nyaya), medicine & challenge ideas in open Shastrartha debates', 'विशाल पुस्तकालय, न्याय-तर्क, चिकित्सा पढ़ने और खुले शास्त्रार्थ में विचारों की परख करने'), opt('weapons', 'To mine coal in the library courtyard', 'पुस्तकालय में कोयला खोदने')],
      run: (S) => { S.topic = 'uni'; return 'uni'; },
      explain: () => b('Nalanda and Vikramashila were collaborative, tax-funded learning ecosystems where ideas had to survive rigorous questioning.', 'नालंदा व विक्रमशिला में हर विचार को खुले प्रश्न-उत्तर और तर्क की कसौटी पर खरा उतरना पड़ता था।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('How is Panini’s Ashtadhyayi connected to modern computer science and AI language technology?', 'पाणिनि की अष्टाध्यायी आधुनिक कंप्यूटर विज्ञान और एआई भाषा तकनीक से कैसे जुड़ी है?'),
      correct: 'rules',
      options: [
        { id: 'rules', ...b('It expressed complex human language using ~4,000 compact generative rules & recursion — like formal syntax engines.', 'इसने लगभग 4,000 संक्षिप्त जनरेटिव नियमों व आवर्तन से जटिल भाषा व्यक्त की — औपचारिक सिंटैक्स इंजन की तरह।') },
        { id: 'electricity', ...b('Panini built silicon microchips in Taxila.', 'पाणिनि ने तक्षशिला में सिलिकॉन चिप बनाई।'), why: b('Panini worked with formal symbolic logic on palm/oral systems centuries before electricity.', 'पाणिनि ने बिजली से सदियों पहले अमूर्त तार्किक नियम-प्रणाली रची।') },
      ],
      explain: b('Formal rule systems and recursive substitution invented in grammar laid intellectual foundations recognised by computer scientists.', 'व्याकरण में विकसित औपचारिक नियम-प्रणाली को आज भी कंप्यूटर वैज्ञानिक आदर्श मानते हैं।'),
      hint: b('Click the Panini card with the AI connection toggle ON.', 'एआई जुड़ाव चालू करके पाणिनि कार्ड देखें।'),
    },
  ],
  reflect: b('How is ancient Indian Shastrartha (testing arguments for contradictions) a superpower against blindly believing AI chatbots today?', 'प्राचीन भारतीय शास्त्रार्थ (तर्क में दोष खोजना) आज एआई चैटबॉट पर आँख मूंदकर भरोसा करने से कैसे बचाता है?'),
};

// ================================================================ T05.L5 Trade routes, Shreni guilds & Bay of Bengal Commerce
export const guildTrade = {
  id: 'T05.L5',
  objective: b('Simulate overland and maritime commerce along Uttarapatha, Dakshinapatha & Bay of Bengal guild routes up to 1000 CE (Shreni, Manigramam, Ayyavole 500).', '1000 ई. तक उत्तरापथ, दक्षिणापथ व बंगाल की खाड़ी मार्गों पर श्रेणी, मणिग्रामम व अय्यावोले संघों के व्यापार व जोखिम का अनुकरण करें।'),
  note: { kind: 'reconstruction', en: 'Historic corridors on datta07/INDIAN-SHAPEFILES; financial figures are schematic teaching units.', hi: 'ऐतिहासिक गलियारे; आर्थिक आंकड़े शिक्षण-सरलीकरण हैं।' },
  init: () => ({ route: 'uttarapatha', shreniJoin: true, monsoonInsurance: false, cargoValue: 120 }),
  controls: [
    { id: 'route', type: 'chips', label: b('Trade corridor (up to 1000 CE)', 'व्यापार मार्ग (1000 ई. तक)'), options: [opt('uttarapatha', 'Uttarapatha (Taxila → Tamralipti)', 'उत्तरापथ'), opt('dakshinapatha', 'Dakshinapatha (Barygaza / Muziris)', 'दक्षिणापथ'), opt('maritime', 'Chola / Pala Bay of Bengal Sea Guilds', 'समुद्री व्यापार (कावेरीपट्टिनम → पूर्व)')] },
    { id: 'cargoValue', type: 'slider', label: b('Shipment capital (gold units)', 'व्यापार पूंजी (स्वर्ण इकाई)'), min: 60, max: 240, step: 20 },
    { id: 'shreniJoin', type: 'toggle', label: b('Join a Guild (Shreni / Manigramam)', 'श्रेणी / व्यापार संघ में शामिल हों') },
    { id: 'monsoonInsurance', type: 'toggle', label: b('Pooled caravan / sea risk fund', 'सामूहिक जोखिम सुरक्षा कोष') },
  ],
  view(S) {
    const ut = S.route === 'uttarapatha', sea = S.route === 'maritime';
    const coords = ut
      ? [[72.8, 33.7], [77.2, 28.6], [77.7, 27.5], [83.0, 25.3], [85.1, 25.6], [87.9, 22.3]]
      : sea
        ? [[87.9, 22.3], [85.8, 20.1], [80.3, 13.0], [79.8, 11.1], [86.0, 10.5], [93.5, 9.2]]
        : [[85.1, 25.6], [78.6, 23.8], [75.8, 23.2], [73.0, 21.7], [76.2, 10.2]];
    const markers = ut
      ? [{ lon: 77.7, lat: 27.5, r: 6, fill: '#b45309', label: b('Mathura', 'मथुरा') }, { lon: 85.1, lat: 25.6, r: 7, fill: '#b45309', label: b('Pataliputra', 'पाटलिपुत्र') }, { lon: 87.9, lat: 22.3, r: 7, fill: '#0369a1', label: b('Tamralipti', 'ताम्रलिप्ति') }]
      : sea
        ? [{ lon: 87.9, lat: 22.3, r: 6.5, fill: '#0369a1', label: b('Tamralipti (Pala)', 'ताम्रलिप्ति') }, { lon: 79.8, lat: 11.1, r: 7.5, fill: '#059669', label: b('Kaveripattinam (Chola)', 'कावेरीपट्टिनम') }, { lon: 93.0, lat: 9.5, r: 6, fill: '#7c3aed', label: b('To Suvarnabhumi →', 'सुवर्णभूमि की ओर →') }]
        : [{ lon: 75.8, lat: 23.2, r: 6.5, fill: '#b45309', label: b('Ujjayini', 'उज्जयिनी') }, { lon: 73.0, lat: 21.7, r: 7, fill: '#0369a1', label: b('Barygaza', 'भृगुकच्छ') }, { lon: 76.2, lat: 10.2, r: 7, fill: '#0369a1', label: b('Muziris', 'मुज़िरिस') }];
    const sim = H.guildRiskSim({ route: S.route, shreniJoin: S.shreniJoin, cargoValue: S.cargoValue, monsoonInsurance: S.monsoonInsurance });
    const svg = indiaMapSvg({ w: 640, h: 410, paths: [{ coords, stroke: ut ? '#b45309' : sea ? '#059669' : '#7c3aed', width: 4 }], markers, aria: `${S.route} trade corridor across India` });
    return {
      plate: {
        src: 'assets/images/plates/t05-guilds.jpg',
        en: 'Ancient merchant guild (shreni): spice sacks, terracotta jars, silver punch-marked coins and ivory trade seal.',
        hi: 'प्राचीन श्रेणी (व्यापारी संघ): मसालों की बोरियाँ, घड़े, चाँदी के आहत सिक्के व व्यापारिक मुहर।',
      },
      svg,
      aria: `${S.route} net ${sim.netReturn}, risk ${sim.riskPct}%`,
      lines: [
        ut ? b('Uttarapatha carried horses, lapis, wool, Ganga textiles & bowls to the Bay of Bengal port of Tamralipti.', 'उत्तरापथ से घोड़े, ऊन, रत्न व वस्त्र बंगाल की खाड़ी के ताम्रलिप्ति बंदरगाह तक जाते थे।')
          : sea
            ? b('By 800–1000 CE, South Indian merchant guilds (Manigramam & Ayyavole 500) sailed across the Bay of Bengal linking Kaveripattinam & Bengal with Southeast Asia.', '800–1000 ई. तक मणिग्रामम व अय्यावोले 500 जैसे दक्षिण भारतीय संघ कावेरीपट्टिनम व बंगाल से दक्षिण-पूर्व एशिया तक समुद्री व्यापार करते थे।')
            : b('Dakshinapatha linked northern cities via Ujjayini to western ports (Barygaza) and Kerala spice harbours (Muziris).', 'दक्षिणापथ उज्जयिनी से होकर भृगुकच्छ और मुज़िरिस मसाला बंदरगाहों को जोड़ता था।'),
        { en: `Net return: ${sim.netReturn} units · Loss Risk: ${sim.riskPct}% · Guild/Pool Fee: ${sim.fee} units. Pooling escorts and guild credit beats going alone on high-value routes.`, hi: `शुद्ध लाभ: ${sim.netReturn} इकाई · हानि जोखिम: ${sim.riskPct}% · संघ शुल्क: ${sim.fee} इकाई। सामूहिक सुरक्षा व साख से लंबी दूरी का व्यापार सुरक्षित बनता है।`, cls: sim.riskPct > 30 ? 'warn' : 'balanced' },
      ],
    };
  },
  discover: [b('Select Bay of Bengal Sea Guilds with high cargo capital (240). Toggle Shreni & Pooled Risk Fund ON vs OFF to see risk drop!', 'उच्च पूंजी (240) पर समुद्री व्यापार चुनकर श्रेणी और सुरक्षा कोष चालू-बंद करें। जोखिम घटते देखें!')],
  predictions: [
    {
      id: 'p1',
      stem: b('How did ancient Indian shrenis and early medieval guilds (Manigramam, Ayyavole 500) support long-distance trade?', 'प्राचीन श्रेणियों और मणिग्रामम/अय्यावोले जैसे संघों ने लंबी दूरी के व्यापार में कैसे मदद की?'),
      options: [opt('bank', 'They accepted deposits, lent working capital, hired caravan/ship guards and guaranteed craft quality', 'वे जमा स्वीकार करतीं, ऋण देतीं, काफ़िला/जहाज़ सुरक्षा रखतीं और गुणवत्ता की गारंटी देती थीं'), opt('forbid', 'They banned ships from using rivers', 'उन्होंने नदियों में नावें बंद कर दीं')],
      run: (S) => { S.shreniJoin = true; return 'bank'; },
      explain: () => b('Inscriptions at Mathura, Nasik and South India record guilds acting as self-governing banks, courts and charitable endowments.', 'मथुरा, नासिक व दक्षिण भारत के अभिलेख दिखाते हैं कि श्रेणियाँ बैंक, गुणवत्ता नियम और दान निधियाँ चलाती थीं।'),
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
  reflect: b('Why are shared institutional trust, quality standards and pooled insurance just as vital as physical highways and ports?', 'भौतिक सड़कों व बंदरगाहों जितना ही महत्त्वपूर्ण साझा संस्थागत विश्वास और गुणवत्ता मानक क्यों होते हैं?'),
};

// ================================================================ T05.L6 AI-Era Historian Audit Studio (Non-Rote Source Critique)
const AI_CLAIMS = {
  ashoka: {
    botTitle: b('AI Bot Output #1: “Ashoka’s 260 BCE Paper Flyers”', 'एआई बॉट दावा #1: “अशोक के 260 ई.पू. के कागज़ी पर्चे”'),
    claim: b('“In 260 BCE, Emperor Ashoka printed thousands of paper pamphlets in Sanskrit to force every citizen into one uniform religion.”', '“260 ई.पू. में सम्राट अशोक ने संस्कृत में हजारों कागज़ी पर्चे छपवाकर हर नागरिक पर एक धर्म थोप दिया।”'),
    fix: b('Truth from Evidence: Printing & rag paper did not exist in India in 260 BCE (Anachronism!). Edicts were carved in spoken Prakrit/Greek/Aramaic on pillars & rocks advocating inter-sect harmony (Dhamma/Samavaya).', 'प्रमाणित सत्य: 260 ई.पू. में मुद्रण व कागज़ नहीं थे (काल-दोष!)। अशोक ने स्तंभों-शिलाओं पर जनसामान्य की प्राकृत भाषा में सभी संप्रदायों के सद्भाव (धम्म/समवाय) का संदेश खुदवाया।'),
  },
  samanta: {
    botTitle: b('AI Bot Output #2: “Zero Local Assemblies Before 1000 CE”', 'एआई बॉट दावा #2: “1000 ई. से पूर्व कोई स्थानीय सभा नहीं”'),
    claim: b('“Before modern elections, ordinary villagers in ancient India up to 1000 CE had zero organised rules, votes, or local committees.”', '“आधुनिक चुनावों से पहले 1000 ई. तक प्राचीन भारत के गाँवों में कोई नियम, मतदान या स्थानीय समिति नहीं थी।”'),
    fix: b('Truth from Evidence: Omission bias! Vajji Gana-Sangha debates (6th BCE) and Chola Uttaramerur temple inscriptions (919–921 CE) prove Kudavolai palm-leaf lottery committees with strict voter & audit rules.', 'प्रमाणित सत्य: तथ्य-लोप पक्षपात! वज्जि गणसंघ की सभाएँ और उत्तरमेरूर चोल अभिलेख (919–921 ई.) कुदावोलई ताड़पत्र चुनाव व लेखा-जाँच समितियों को सिद्ध करते हैं।'),
  },
  science: {
    botTitle: b('AI Bot Output #3: “Pure Poetry With No Method Before 1000 CE”', 'एआई बॉट दावा #3: “1000 ई. से पूर्व केवल काव्य, कोई विज्ञान नहीं”'),
    claim: b('“Indian writings before 1000 CE contained only mythological tales with no mathematical algorithms, grammar rules, or metallurgy.”', '“1000 ई. से पूर्व भारतीय लेखन में केवल पौराणिक कथाएँ थीं — कोई गणितीय सूत्र, व्याकरण नियम या धातुकर्म नहीं था।”'),
    fix: b('Truth from Evidence: Panini’s 4,000 generative sutras, Aryabhata/Brahmagupta’s zero & π rules, Sushruta surgical tools, and the rust-free Mehrauli Iron Pillar prove empirical & formal rule traditions.', 'प्रमाणित सत्य: पाणिनि के 4,000 सूत्र, आर्यभट-ब्रह्मगुप्त के शून्य नियम, सुश्रुत शल्य-उपकरण और जंग-रहित महरौली स्तंभ वैज्ञानिक परंपरा प्रमाणित करते हैं।'),
  },
};

export const aiAuditLab = {
  id: 'T05.L6',
  objective: b('Train AI-era historical discernment: audit plausible-sounding AI bot summaries using epigraphy, chronology and material remains instead of rote recall.', 'एआई युग का इतिहास-विवेक विकसित करें: रटने के बजाय अभिलेख, कालक्रम और पुरावशेषों से आकर्षक एआई दावों की तथ्य-जाँच करें।'),
  note: { kind: 'documented', en: 'Inspired by 21st-century lateral reading & source-corroboration pedagogy — never accept an unverified summary blindly.', hi: 'आधुनिक स्रोत-जाँच शिक्षण पर आधारित — किसी भी सारांश को प्रमाण जाँचे बिना स्वीकार न करें।' },
  init: () => ({ claimId: 'ashoka', checkEpigraphy: true, checkChronology: false, checkMaterial: false }),
  controls: [
    { id: 'claimId', type: 'chips', label: b('Choose AI bot claim to fact-check', 'जाँचने हेतु एआई दावा चुनें'), options: [opt('ashoka', 'Claim 1: Ashoka Pamphlets', 'दावा 1: अशोक पर्चे'), opt('samanta', 'Claim 2: No Village Rules', 'दावा 2: कोई ग्राम सभा नहीं'), opt('science', 'Claim 3: Zero Science', 'दावा 3: कोई विज्ञान नहीं')] },
    { id: 'checkEpigraphy', type: 'toggle', label: b('Verify Stone & Copper Inscriptions', 'शिलालेख व ताम्रपत्र जाँचें') },
    { id: 'checkChronology', type: 'toggle', label: b('Run Material & Date Anachronism Check', 'तिथि व तकनीक काल-दोष जाँचें') },
    { id: 'checkMaterial', type: 'toggle', label: b('Verify Excavated Artefacts & Coins', 'उत्खनित पुरावशेष व सिक्के जाँचें') },
  ],
  view(S) {
    const c = AI_CLAIMS[S.claimId] || AI_CLAIMS.ashoka;
    const sim = H.sourceAuditSim(S);
    const pill = (x, label, ok) => `<rect x="${x}" y="86" width="184" height="44" rx="8" fill="${ok ? '#dcfce7' : '#f1f5f9'}" stroke="${ok ? '#16a34a' : '#94a3b8'}" stroke-width="2"/><text class="txt sm b" x="${x + 92}" y="112" text-anchor="middle" fill="${ok ? '#14532d' : '#475569'}">${esc(label)}</text>`;
    const svg = `<svg viewBox="0 0 640 206" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="12" width="612" height="182" rx="12" fill="var(--card)" stroke="${sim.status === 'debunked' ? '#16a34a' : '#d97706'}" stroke-width="3"/><text class="txt b" x="32" y="42">${esc(P(c.botTitle.en, c.botTitle.hi))}</text><text class="txt sm mut" x="32" y="64">${esc(P(`Forensic Checks Active: ${sim.checksDone}/3 · Flaws Exposed: ${sim.caught}/${sim.totalFlaws}`, `सक्रिय जाँच: ${sim.checksDone}/3 · पकड़ी गई त्रुटियाँ: ${sim.caught}/${sim.totalFlaws}`))}</text>${pill(28, P(S.checkEpigraphy ? '✓ Epigraphy Checked' : '○ Epigraphy Off', S.checkEpigraphy ? '✓ अभिलेख जाँच' : '○ अभिलेख बंद'), S.checkEpigraphy)}${pill(228, P(S.checkChronology ? '✓ Chronology Checked' : '○ Chronology Off', S.checkChronology ? '✓ कालक्रम जाँच' : '○ कालक्रम बंद'), S.checkChronology)}${pill(428, P(S.checkMaterial ? '✓ Artefacts Checked' : '○ Artefacts Off', S.checkMaterial ? '✓ पुरावशेष जाँच' : '○ पुरावशेष बंद'), S.checkMaterial)}<rect x="28" y="148" width="584" height="30" rx="8" fill="${sim.status === 'debunked' ? '#dcfce7' : sim.status === 'partial' ? '#fef3c7' : '#fee2e2'}"/><text class="txt sm b" x="320" y="168" text-anchor="middle" fill="#1e293b">${esc(P(sim.status === 'debunked' ? `✓ HALLUCINATION EXPOSED (${sim.verifiedPct}% confidence)` : sim.status === 'partial' ? `⚠ Partial clues (${sim.caught}/${sim.totalFlaws}) — run another check!` : 'Unchecked Bot Claim — Do NOT copy blindly!', sim.status === 'debunked' ? `✓ एआई भ्रम पकड़ा गया (${sim.verifiedPct}% प्रमाणित)` : sim.status === 'partial' ? `⚠ आंशिक जाँच — एक और प्रमाण जाँचें!` : 'अप्रमाणित एआई दावा — बिना जाँचे न मानें!'))}</text></svg>`;
    return {
      svg,
      aria: `${c.botTitle.en}, flaws caught ${sim.caught} of ${sim.totalFlaws}`,
      lines: [
        { en: c.claim.en, hi: c.claim.hi, cls: 'note' },
        sim.status === 'debunked'
          ? { en: c.fix.en, hi: c.fix.hi, cls: 'balanced' }
          : b('Switch ON Epigraphy, Chronology and Artefacts checks above to expose every factual distortion in this AI output.', 'ऊपर अभिलेख, कालक्रम और पुरावशेष जाँच चालू कर इस एआई दावे की सभी त्रुटियाँ उजागर करें।'),
      ],
    };
  },
  discover: [b('Audit all 3 AI claims by toggling the 3 forensic verification switches. Notice how fluent AI sentences hide anachronisms until cross-checked!', 'तीनों एआई दावों पर तीनों प्रमाण-जाँच चालू करें। देखें कि सुंदर वाक्यों में छिपे काल-दोष कैसे पकड़े जाते हैं!')],
  predictions: [
    {
      id: 'p1',
      stem: b('When an AI claims Ashoka distributed “printed Sanskrit paper pamphlets in 260 BCE”, which TWO checks immediately shatter that claim?', 'जब कोई एआई कहता है कि अशोक ने “260 ई.पू. में छपे कागज़ी संस्कृत पर्चे” बाँटे, तो कौन-सी दो जाँचें तुरंत इस दावे को तोड़ती हैं?'),
      options: [opt('epichron', 'Chronology check (no printing press in 260 BCE) + Epigraphy check (stone pillars in spoken Prakrit)', 'कालक्रम जाँच (260 ई.पू. में प्रिंटिंग प्रेस नहीं थी) + अभिलेख जाँच (प्राकृत शिलालेख)'), opt('font', 'Checking font colour on the screen', 'स्क्रीन के रंग बदलना')],
      run: (S) => { S.claimId = 'ashoka'; S.checkEpigraphy = true; S.checkChronology = true; return 'epichron'; },
      explain: () => b('Combining technology timelines (chronology) with real primary edicts (epigraphy) instantly exposes AI anachronisms and language errors.', 'तकनीकी कालक्रम और वास्तविक शिलालेखों का मिलान एआई की काल्पनिक गलतियाँ तुरंत पकड़ लेता है।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('In the AI era, why is learning how to verify inscriptions, material remains and dates MORE valuable than memorising textbook summaries?', 'एआई युग में पाठ्यपुस्तक रटने से अधिक उपयोगी अभिलेखों, पुरावशेषों और तिथियों से जाँच करना क्यों है?'),
      correct: 'verify',
      options: [
        { id: 'verify', ...b('Because AI generates fast summaries — including confident errors — so only citizens skilled in corroboration can separate fact from fiction.', 'क्योंकि एआई तेज़ सारांश तो बना देता है पर गलतियाँ भी गढ़ सकता है; केवल प्रमाण-मिलान जानने वाला विद्यार्थी ही सच-झूठ परख सकता है।') },
        { id: 'obsolete', ...b('Because primary inscriptions never existed.', 'क्योंकि प्राचीन अभिलेख कभी थे ही नहीं।'), why: b('Ashokan and Chola inscriptions remain physical stone evidence anyone can verify.', 'अशोक व चोल अभिलेख आज भी प्रत्यक्ष पत्थर प्रमाण हैं।') },
      ],
      explain: b('Historical thinking transforms you from a passive consumer of summaries into an active verifier of evidence.', 'ऐतिहासिक सोच आपको निष्क्रिय पाठक से सक्रिय प्रमाण-परीक्षक बनाती है।'),
      hint: b('Activate all three forensic checks and review the Truth from Evidence verdict.', 'तीनों जाँच चालू करके प्रमाणित सत्य पढ़ें।'),
    },
  ],
  reflect: b('Next time you use an AI assistant to study history, list the 3 verification questions you will ask before trusting its answer.', 'अगली बार इतिहास पढ़ने के लिए एआई का उपयोग करते समय आप उत्तर पर भरोसा करने से पहले कौन-से 3 जाँच-प्रश्न पूछेंगे?'),
};

