// T04 Early Humans lab specs (L3–L5).
import * as H from '../../engines/domain/history.js';
import { Chart } from '../../engines/chart.js';
import { worldMapSvg } from '../../engines/viz.js';
import { fmt, esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });

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
        en: 'From Palaeolithic handaxe and microlith blades to polished Neolithic celts and charred wheat — tap pins to compare nomadic vs farming bands.',
        hi: 'पुरापाषाण हस्त-कुठार से नवपाषाण कुल्हाड़ी व जले गेहूँ तक — घुमंतू बनाम स्थायी कृषक जीवन की तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 42, en: 'Mobile Hunter-Gatherer Band', hi: 'घुमंतू शिकारी-संग्राहक', detail: b('Smaller group (~25–40) stays flexible by moving where wild fruit & game thrive.', 'छोटा समूह मौसमी भोजन के अनुसार स्थान बदलकर सूखे वर्षों में लचीला रहता है।'), set: { mode: 'forager', rainVar: 0.4, storage: 0.2 } },
          { x: 52, y: 66, en: 'Settled Neolithic Village (High Granary)', hi: 'स्थायी नवपाषाण गाँव', detail: b('80% pit-granary storage absorbs drought dips, allowing population & crafts to grow.', '80% अन्नागार भंडारण सूखे की मार झेलकर जनसंख्या व शिल्प को बढ़ाता है।'), set: { mode: 'farmer', rainVar: 0.3, storage: 0.9 } },
          { x: 78, y: 60, en: 'Famine Shock (Low Storage)', hi: 'कम भंडारण संकट', detail: b('Fixed village + 70% weather swings + tiny granary exposes crop failure risk!', 'अत्यधिक मौसम उतार-चढ़ाव व कम भंडारण पर स्थायी गाँव पर अकाल का संकट आता है!'), set: { mode: 'farmer', rainVar: 0.7, storage: 0.1 } },
        ],
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
        src: 'assets/images/plates/t04-harappa.jpg',
        en: 'Indus Valley city reconstruction: tap the raised western Citadel, checkerboard grid streets or sunken Great Bath tank.',
        hi: 'हड़प्पा नगर पुनर्निर्माण: ऊँचे पश्चिमी दुर्ग, समकोण सड़क ग्रिड व महास्नानागार पर टैप कर नगर योजना परखें।',
        spots: [
          { x: 24, y: 38, en: 'Raised Brick Citadel & Granary', hi: 'ऊँचा दुर्ग व अन्नागार', detail: b('Elevated mud-and-baked brick citadel keeps public halls and grain safe above river floods.', 'नदी बाढ़ से ऊपर सुरक्षित दुर्ग चबूतरे पर सार्वजनिक भवन व अन्नागार बने थे।'), set: { greatBath: true, granary: true } },
          { x: 52, y: 52, en: 'Checkerboard Grid & Drains', hi: 'समकोण सड़क व ढकी नालियाँ', detail: b('Kiln-brick street drains slope smoothly with inspection traps for civic hygiene.', 'पक्की ईंट की ढकी नालियाँ निरीक्षण हौजों संग गलियों को स्वच्छ रखती थीं।'), set: { gridStreets: true, coveredDrains: true } },
          { x: 80, y: 62, en: 'Great Bath & Hygiene Test', hi: 'महास्नानागार व स्वच्छता जांच', detail: b('Watertight bitumen-lined stepped tank; toggle streets/drains off to see sanitation plunge!', 'डामर से जलरोधी स्नानागार; सड़क-नाली बंद कर स्वच्छता गिरावट देखें!'), set: { gridStreets: false, coveredDrains: false } },
        ],
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
      plate: {
        src: 'assets/images/plates/t04-rivercivs.jpg',
        en: 'Four Bronze Age river civilisations in one display — tap any museum relic to inspect its river valley on the world map.',
        hi: 'चार कांस्य-युगीन नदी सभ्यताएँ — विश्व मानचित्र पर देखने हेतु किसी भी पुरातात्त्विक प्रदर्श पर टैप करें।',
        spots: [
          { x: 20, y: 62, en: 'Indus Seals & Brick Drain', hi: 'हड़प्पा मुहर व ईंट नाली', detail: b('Harappan (c. 2600–1900 BCE): planned brick towns & undeciphered seal script.', 'हड़प्पा: नियोजित ईंट नगर, मानकीकृत बाट व चित्रलिपि मुहरें।'), set: { civ: 'harappan' } },
          { x: 42, y: 56, en: 'Mesopotamian Cuneiform Tablet', hi: 'मेसोपोटामिया कीलाक्षर पट्टिका', detail: b('Tigris-Euphrates clay ledger recording barley rations and Meluhha sea trade.', 'दजला-फ़रात घाटी में जौ के हिसाब व मेलुहा समुद्री व्यापार का लेख।'), set: { civ: 'mesopotamia' } },
          { x: 60, y: 62, en: 'Egyptian Nile Reed Boat', hi: 'मिस्र की नील नदी नौका', detail: b('Annual predictable Nile floods sustained unified kingdoms and hieroglyphs.', 'नील नदी की नियमित बाढ़ से पिरामिड व चित्रलिपि सभ्यता पनपी।'), set: { civ: 'egypt' } },
          { x: 82, y: 56, en: 'Shang Bronze Ritual Vessel', hi: 'शांग कांस्य पात्र', detail: b('Yellow River cities famed for piece-mould bronze casting & oracle bones.', 'पीली नदी घाटी में उत्कृष्ट कांस्य ढलाई व अस्थि-लेख।'), set: { civ: 'china' } },
        ],
      },
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
