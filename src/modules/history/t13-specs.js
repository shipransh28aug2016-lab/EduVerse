// T13 India and the World-I lab specs (L2–L4).
import { worldMapSvg } from '../../engines/viz.js';
import { esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });

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
