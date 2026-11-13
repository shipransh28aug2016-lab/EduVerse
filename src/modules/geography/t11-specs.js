// T11 Life on Earth lab specs (L1–L5).
import * as Eco from '../../engines/domain/ecosystem.js';
import { Chart } from '../../engines/chart.js';
import { d3, indiaMapSvg, worldMapSvg } from '../../engines/viz.js';
import { fmt, esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });

// ---------------------------------------------------------------- T11.L3 forest harvest and food web
export const harvest = {
  id: 'T11.L3',
  objective: b('Decide how much of a forest can be harvested each year without destroying it, using regrowth and the maximum sustainable yield.', 'पुनर्वृद्धि और अधिकतम धारणीय उपज के आधार पर तय करें कि वन को नष्ट किए बिना हर वर्ष कितना काटा जा सकता है।'),
  note: { kind: 'schematic', en: 'A logistic-growth teaching model. Units are arbitrary; real forests also depend on species, soil and climate.', hi: 'लॉजिस्टिक वृद्धि का शिक्षण-मॉडल। इकाइयाँ काल्पनिक हैं; वास्तविक वन प्रजाति, मिट्टी और जलवायु पर भी निर्भर करते हैं।' },
  init: () => ({ harvest: 80, stock0: 800 }),
  controls: [
    { id: 'harvest', type: 'slider', label: b('Harvest per year', 'प्रति वर्ष कटाई'), min: 0, max: 160, step: 5 },
    { id: 'stock0', type: 'slider', label: b('Starting forest stock', 'आरंभिक वन भंडार'), min: 100, max: 1000, step: 50 },
  ],
  view(S) {
    const r = Eco.harvestRun({ harvest: S.harvest, stock0: S.stock0, years: 50 }), msy = Eco.maxSustainableYield();
    const ch = new Chart({ xMax: 50, yMax: 1100, xLabel: P('Years', 'वर्ष'), yLabel: P('Forest stock', 'वन भंडार'), xTicks: 5, yTicks: 5 });
    ch.axes(); ch.hline(Eco.forest.K, 'guide', 0, 50); ch.text(49, Eco.forest.K, P('capacity', 'क्षमता'), 'lbl', 'end', 0, -6);
    ch.line(r.stock.map((v, y) => [y, v]), r.sustainable ? 'curve g' : 'curve d');
    const lines = [
      { en: `Regrowth is fastest when the forest is half full; the most you can take every year for ever (maximum sustainable yield) is ${fmt(msy, 0)}.`, hi: `पुनर्वृद्धि सबसे तेज़ तब होती है जब वन आधा भरा हो; हर वर्ष हमेशा के लिए अधिकतम ${fmt(msy, 0)} लिया जा सकता है (अधिकतम धारणीय उपज)।` },
      S.harvest > msy ? { en: `You harvest ${S.harvest} per year, more than regrowth can replace${r.collapsedAt ? `: the forest is gone in year ${r.collapsedAt}.` : '; the forest shrinks and will eventually collapse.'}`, hi: `आप प्रति वर्ष ${S.harvest} काटते हैं, जो पुनर्वृद्धि से अधिक है${r.collapsedAt ? `: वन वर्ष ${r.collapsedAt} में समाप्त हो जाता है।` : '; वन घटता है और अंततः समाप्त हो जाएगा।'}`, cls: 'warn' }
        : { en: `You harvest ${S.harvest} per year, within the sustainable yield: the forest settles at about ${fmt(r.final, 0)} and keeps producing.`, hi: `आप प्रति वर्ष ${S.harvest} काटते हैं, जो धारणीय उपज के भीतर है: वन लगभग ${fmt(r.final, 0)} पर स्थिर हो जाता है और उत्पादन देता रहता है।`, cls: 'balanced' },
      { en: `Total wood taken in 50 years: ${fmt(r.total, 0)}.`, hi: `50 वर्षों में कुल लकड़ी: ${fmt(r.total, 0)}।`, cls: 'note' },
    ];
    return {
      plate: {
        src: 'assets/images/plates/t11-grove.jpg',
        en: 'Forest stewardship & carrying capacity: tap pins to compare sustainable village harvest vs rapid over-logging.',
        hi: 'वन प्रबंधन व धारण क्षमता: टिकाऊ कटाई बनाम अति-कटाई परखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 26, y: 42, en: 'Sustainable Community Harvest', hi: 'धारणीय सामुदायिक कटाई', detail: b('Taking 60 units/yr stays below natural regrowth, sustaining timber for generations.', 'प्रति वर्ष 60 इकाई कटाई प्राकृतिक पुनर्वृद्धि से कम रहती है और वन सदा बना रहता है।'), set: { harvest: 60, stock0: 800 } },
          { x: 56, y: 58, en: 'Max Sustainable Yield (~Half Stock)', hi: 'अधिकतम धारणीय उपज', detail: b('Regrowth peaks near half forest capacity — check how close 95 units gets to the edge.', 'आधी क्षमता पर पुनर्वृद्धि सर्वाधिक होती है — 95 पर सीमा रेखा जाँचें।'), set: { harvest: 95, stock0: 800 } },
          { x: 80, y: 48, en: 'Clear-Cut Over-Harvest', hi: 'अति-कटाई संकट', detail: b('Harvesting 135/yr outstrips regrowth and drives rapid ecological collapse.', '135/वर्ष कटाई पुनर्वृद्धि से आगे निकलकर पूरे वन को समाप्त कर देती है।'), set: { harvest: 135, stock0: 800 } },
        ],
      },
      svg: ch.html({ label: P('Forest stock over 50 years', '50 वर्षों में वन भंडार') }), aria: `Forest stock after 50 years: ${fmt(r.final, 0)}.`, lines,
    };
  },
  discover: [b('Raise the harvest slowly from 0. Find the highest value that still lets the forest survive.', 'कटाई को 0 से धीरे-धीरे बढ़ाएँ। वह सबसे अधिक मान खोजें जिस पर वन फिर भी बचा रहता है।'), b('Set harvest to 120. Does the total wood after 50 years beat a harvest of 90? Think about short-term gain and long-term loss.', 'कटाई 120 करें। क्या 50 वर्षों की कुल लकड़ी 90 की कटाई से अधिक है? अल्पकालिक लाभ और दीर्घकालिक हानि पर सोचें।')],
  predictions: [{ id: 'p1', stem: b('The forest regrows 100 units a year at best. You harvest 130 every year. What happens?', 'वन अधिक से अधिक प्रति वर्ष 100 इकाई पुनः उगता है। आप हर वर्ष 130 काटते हैं। क्या होगा?'), options: [opt('collapse', 'The forest collapses', 'वन समाप्त हो जाता है'), opt('stable', 'It settles at a lower, stable size', 'वह कम, स्थिर आकार पर टिक जाता है')],
    run: (S) => { S.harvest = 130; S.stock0 = 800; return Eco.harvestRun({ harvest: 130, stock0: 800 }).collapsedAt != null ? 'collapse' : 'stable'; },
    explain: () => ({ en: `Regrowth peaks at ${fmt(Eco.maxSustainableYield(), 0)}. Taking more than that every year uses up the stock; it collapsed in year ${Eco.harvestRun({ harvest: 130, stock0: 800 }).collapsedAt}.`, hi: `पुनर्वृद्धि अधिकतम ${fmt(Eco.maxSustainableYield(), 0)} होती है। हर वर्ष इससे अधिक लेने पर भंडार खत्म होता है; वन वर्ष ${Eco.harvestRun({ harvest: 130, stock0: 800 }).collapsedAt} में समाप्त हो गया।` }) }],
  exit: [{ id: 'e1', stem: b('What does “sustainable” harvesting mean?', '“धारणीय” कटाई का क्या अर्थ है?'), correct: 'a', options: [
    { id: 'a', ...b('Taking no more each year than the forest can regrow, so it keeps producing.', 'हर वर्ष उतना ही लेना जितना वन पुनः उगा सके, ताकि वह उत्पादन देता रहे।') }, { id: 'b', ...b('Taking as much as possible as quickly as possible.', 'जितना संभव हो उतना जल्दी लेना।'), why: b('That is over-harvesting: it can empty the forest, as the red line shows.', 'यह अति-कटाई है: यह वन को खाली कर सकती है, जैसा लाल रेखा दिखाती है।') }],
    explain: b('Sustainable use keeps the resource available for future generations.', 'धारणीय उपयोग संसाधन को भावी पीढ़ियों के लिए उपलब्ध रखता है।'), hint: b('Compare the green line (survives) and the red line (collapses).', 'हरी रेखा (बची रहती है) और लाल रेखा (समाप्त होती है) की तुलना करें।') }],
  reflect: b('Suggest one rule a village could make so forest produce is not over-harvested.', 'एक नियम सुझाएँ जो कोई गाँव बना सकता है ताकि वन-उपज की अति-कटाई न हो।'),
};
export const foodweb = {
  id: 'T11.L3w',
  objective: b('Show how plants, herbivores and predators depend on one another and how removing predators changes the whole food web.', 'दिखाएँ कि पौधे, शाकाहारी और शिकारी एक-दूसरे पर कैसे निर्भर हैं और शिकारियों को हटाने से पूरा खाद्य-जाल कैसे बदलता है।'),
  note: { kind: 'schematic', en: 'Predator–prey (Lotka–Volterra) teaching model with illustrative numbers; real food webs have many more species.', hi: 'शिकारी–शिकार (लोटका–वोल्टेरा) शिक्षण-मॉडल, उदाहरण-संख्याओं के साथ; वास्तविक खाद्य-जालों में कहीं अधिक प्रजातियाँ होती हैं।' },
  init: () => ({ cull: 0, cullYear: 10 }),
  controls: [
    { id: 'cull', type: 'slider', label: b('Share of predators removed', 'हटाए गए शिकारियों का अनुपात'), min: 0, max: 0.9, step: 0.1, fmt: (v) => `${Math.round(v * 100)}%` },
    { id: 'cullYear', type: 'slider', label: b('Year of removal', 'हटाने का वर्ष'), min: 2, max: 30, step: 1 },
  ],
  view(S) {
    const base = Eco.webRun(), tr = Eco.webRun({ cullYear: S.cull > 0 ? S.cullYear : null, cullFrac: S.cull });
    const ymax = Math.ceil(Math.max(...tr.map((p) => Math.max(p.prey, p.pred)), 60) / 20) * 20;
    const ch = new Chart({ xMax: 40, yMax: ymax, xLabel: P('Years', 'वर्ष'), yLabel: P('Population', 'जनसंख्या'), xTicks: 8, yTicks: 5 });
    ch.axes(); ch.line(tr.map((p) => [p.t, p.prey]), 'curve g'); ch.line(tr.map((p) => [p.t, p.pred]), 'curve d');
    if (S.cull > 0) ch.vline(S.cullYear, 'guide');
    ch.text(1, ymax * 0.95, P('Green: herbivores (prey)', 'हरा: शाकाहारी (शिकार)'), 'lbl', 'start'); ch.text(1, ymax * 0.88, P('Red: predators', 'लाल: शिकारी'), 'lbl', 'start');
    const pk = (a) => Math.max(...a.map((p) => p.prey)), lines = [
      { en: S.cull > 0 ? `After ${Math.round(S.cull * 100)}% of predators are removed in year ${S.cullYear}, herbivores can rise to ${fmt(pk(tr), 0)} (peak without removal: ${fmt(pk(base), 0)}).` : 'Without human action the two populations rise and fall in linked cycles: more prey feeds more predators; more predators eat the prey down again.', hi: S.cull > 0 ? `वर्ष ${S.cullYear} में ${Math.round(S.cull * 100)}% शिकारी हटाने पर शाकाहारी बढ़कर ${fmt(pk(tr), 0)} तक जा सकते हैं (बिना हटाए शिखर: ${fmt(pk(base), 0)})।` : 'मानव हस्तक्षेप के बिना दोनों जनसंख्याएँ जुड़े चक्रों में घटती-बढ़ती हैं: अधिक शिकार से अधिक शिकारी पलते हैं; अधिक शिकारी शिकार को फिर घटा देते हैं।' },
      { en: 'More herbivores eat more plants. A change at one level of the food web reaches every other level.', hi: 'अधिक शाकाहारी अधिक पौधे खाते हैं। खाद्य-जाल के एक स्तर का बदलाव हर दूसरे स्तर तक पहुँचता है।', cls: 'note' },
    ];
    return {
      plate: {
        src: 'assets/images/plates/t11-reserves.jpg',
        en: 'Deer grazing beside forest stream & patrol edge — tap pins to simulate intact food webs vs predator removal.',
        hi: 'नदी किनारे हिरण व वन्य खाद्य-जाल — प्राकृतिक शिकारी संतुलन बनाम शिकारी हटाने का प्रभाव पिन से परखें।',
        spots: [
          { x: 20, y: 56, en: 'Intact Deer–Predator Web', hi: 'संतुलित हिरण-शिकारी जाल', detail: b('Predators keep herbivore surges in check so forest undergrowth regenerates safely.', 'शिकारी शाकाहारियों को संतुलित रखकर नए पौधों को बढ़ने देते हैं।'), set: { cull: 0, cullYear: 10 } },
          { x: 50, y: 66, en: 'Remove 80% Top Predators', hi: '80% शीर्ष शिकारी हटाना', detail: b('Watch herbivore numbers spike after year 10, overgrazing young saplings!', 'वर्ष 10 के बाद शाकाहारियों में तेज़ उछाल और वनस्पति पर दबाव देखें!'), set: { cull: 0.8, cullYear: 10 } },
          { x: 80, y: 58, en: 'Early Year-4 Disturbance', hi: 'वर्ष 4 का प्रारंभिक हस्तक्षेप', detail: b('Removing predators early in year 4 destabilises trophic cycles right away.', 'वर्ष 4 में ही शिकारी हटने पर पूरा खाद्य-चक्र तुरंत डगमगा जाता है।'), set: { cull: 0.7, cullYear: 4 } },
        ],
      },
      svg: ch.html({ label: P('Predator and prey populations', 'शिकारी और शिकार की जनसंख्या') }), aria: 'Predator and prey populations over 40 years.', lines,
    };
  },
  discover: [b('With no removal, notice that the red line peaks AFTER the green line. Why is there a delay?', 'बिना हटाए देखें कि लाल रेखा हरी रेखा के बाद शिखर पर पहुँचती है। यह देरी क्यों है?'), b('Remove 90% of predators in year 10. What happens to the herbivores?', 'वर्ष 10 में 90% शिकारी हटाएँ। शाकाहारियों का क्या होता है?')],
  predictions: [{ id: 'p1', stem: b('Most predators are removed from a forest. In the next few years the herbivores will…', 'किसी वन से अधिकांश शिकारी हटा दिए जाते हैं। अगले कुछ वर्षों में शाकाहारी…'), options: [opt('up', 'Increase, then strain the plants', 'बढ़ेंगे, फिर पौधों पर दबाव डालेंगे'), opt('down', 'Decrease', 'घटेंगे'), opt('same', 'Stay the same', 'वही रहेंगे')],
    run: (S) => { S.cull = 0.9; S.cullYear = 10; const m = (a) => Math.max(...a.map((p) => p.prey)); return m(Eco.webRun({ cullYear: 10, cullFrac: 0.9 })) > m(Eco.webRun()) ? 'up' : 'down'; },
    explain: () => ({ en: 'Fewer predators means fewer herbivores are eaten, so their number rises until food runs short: everything in a food web is connected.', hi: 'कम शिकारी यानी कम शाकाहारी खाए जाते हैं, इसलिए उनकी संख्या तब तक बढ़ती है जब तक भोजन कम न पड़ जाए: खाद्य-जाल में सब कुछ जुड़ा है।' }) }],
  exit: [{ id: 'e1', stem: b('Why might removing a top predator harm the plants of a forest?', 'किसी शीर्ष शिकारी को हटाने से वन के पौधों को हानि क्यों हो सकती है?'), correct: 'a', options: [
    { id: 'a', ...b('More herbivores survive and eat more plants.', 'अधिक शाकाहारी बचते हैं और अधिक पौधे खाते हैं।') }, { id: 'b', ...b('Plants need predators for sunlight.', 'पौधों को धूप के लिए शिकारियों की आवश्यकता होती है।'), why: b('Plants get energy from the Sun; the link is through the herbivores.', 'पौधे ऊर्जा सूर्य से पाते हैं; संबंध शाकाहारियों के माध्यम से है।') }],
    explain: b('A food web links levels: fewer predators → more herbivores → more grazing on plants.', 'खाद्य-जाल स्तरों को जोड़ता है: कम शिकारी → अधिक शाकाहारी → पौधों की अधिक चराई।'), hint: b('Follow the green line after the removal.', 'हटाने के बाद हरी रेखा का अनुसरण करें।') }],
  reflect: b('Draw a three-link food chain from your region and say what would happen if the middle link vanished.', 'अपने क्षेत्र की तीन कड़ियों वाली खाद्य-शृंखला बनाएँ और बताएँ कि बीच की कड़ी लुप्त होने पर क्या होगा।'),
};


// ================================================================ T11.L1 World biome map & matcher
export const biomeMap = {
  id: 'T11.L1',
  objective: b('Match temperature and rainfall belts to Earth’s major biomes on a world map.', 'विश्व मानचित्र पर तापमान और वर्षा पट्टियों का पृथ्वी के प्रमुख बायोम से मिलान करें।'),
  note: { kind: 'documented', en: 'Natural Earth 110m countries (world-atlas) projected with d3.geoNaturalEarth1; climate zones are simplified Whittaker-style envelopes.', hi: 'world-atlas के साथ d3.geoNaturalEarth1 मानचित्र; जलवायु क्षेत्र सरलीकृत व्हिटेकर-शैली पर आधारित।' },
  init: () => ({ temp: 26, rain: 2400 }),
  controls: [
    { id: 'temp', type: 'slider', label: b('Mean annual temperature (°C)', 'औसत वार्षिक तापमान (°C)'), min: -12, max: 32, step: 2, fmt: (v) => `${v}°C` },
    { id: 'rain', type: 'slider', label: b('Annual precipitation (mm)', 'वार्षिक वर्षा (मिमी)'), min: 80, max: 3200, step: 80, fmt: (v) => `${v} mm` },
  ],
  view(S) {
    const match = Eco.BIOMES.find((bm) => S.temp >= bm.temp[0] && S.temp <= bm.temp[1] && S.rain >= bm.rain[0] && S.rain <= bm.rain[1])
      || Eco.BIOMES.slice().sort((a, c) => (Math.abs((a.temp[0] + a.temp[1]) / 2 - S.temp) * 80 + Math.abs((a.rain[0] + a.rain[1]) / 2 - S.rain)) - (Math.abs((c.temp[0] + c.temp[1]) / 2 - S.temp) * 80 + Math.abs((c.rain[0] + c.rain[1]) / 2 - S.rain)))[0];
    const markers = Eco.BIOMES.map((bm) => ({
      lon: bm.lon, lat: bm.lat, r: bm.id === match.id ? 10 : 5.5, fill: bm.color,
      label: bm.id === match.id ? { en: bm.en, hi: bm.hi } : null,
    }));
    const svg = worldMapSvg({ w: 640, h: 320, markers, aria: `World biome map highlighting ${match.en}` });
    return {
      plate: {
        src: 'assets/images/plates/t11-biomes.jpg',
        en: 'Earth’s contrasting biome belts — tap any ecosystem pin on the diorama to set matching temperature & rain.',
        hi: 'पृथ्वी के प्रमुख बायोम क्षेत्र — तापमान व वर्षा मिलाने हेतु किसी भी पारिस्थितिकी पिन पर टैप करें।',
        spots: [
          { x: 20, y: 42, en: 'Tropical Rainforest', hi: 'उष्णकटिबंधीय वर्षावन', detail: b('Warm (26°C) + very wet (2,400 mm): towering evergreen biodiversity.', 'गर्म (26°C) + भारी वर्षा (2,400 मिमी): घना सदाबहार वन।'), set: { temp: 26, rain: 2400 } },
          { x: 48, y: 45, en: 'Tropical Savanna', hi: 'उष्णकटिबंधीय सवाना', detail: b('Warm (24°C) + seasonal rain (960 mm): scattered acacia trees and grasslands.', 'गर्म (24°C) + मौसमी वर्षा (960 मिमी): घास मैदान व छितरे वृक्ष।'), set: { temp: 24, rain: 960 } },
          { x: 66, y: 60, en: 'Hot Arid Desert', hi: 'गर्म मरुस्थल', detail: b('Hot (28°C) + scant rain (160 mm): cacti, succulents and Thar dunes.', 'तप्त (28°C) + बहुत कम वर्षा (160 मिमी): थार रेतीले टिब्बे व नागफनी।'), set: { temp: 28, rain: 160 } },
          { x: 78, y: 22, en: 'Cold Alpine Tundra', hi: 'शीत पर्वतीय टुंड्रा', detail: b('Freezing (-6°C) + low precipitation (240 mm): high-Himalayan snow & lichens.', 'अति-शीत (-6°C) + कम वर्षण (240 मिमी): उच्च हिमालयी हिम व काई।'), set: { temp: -6, rain: 240 } },
        ],
      },
      svg,
      aria: `Closest biome for ${S.temp}C and ${S.rain} mm: ${match.en}`,
      lines: [
        { en: `Matched biome: ${match.en} · Indian example: ${match.indiaEx.en}.`, hi: `मिलता-जुलता बायोम: ${match.hi} · भारतीय उदाहरण: ${match.indiaEx.hi}।`, cls: 'balanced' },
        { en: `Climate envelope: ${match.temp[0]}°C to ${match.temp[1]}°C, ${match.rain[0]}–${match.rain[1]} mm/year.`, hi: `जलवायु सीमा: ${match.temp[0]}°C से ${match.temp[1]}°C, ${match.rain[0]}–${match.rain[1]} मिमी/वर्ष।`, cls: 'note' },
      ],
    };
  },
  discover: [b('Keep temperature at 26°C and slide rainfall from 3,000 mm down to 160 mm. Watch Rainforest → Savanna → Desert.', 'तापमान 26°C रखकर वर्षा को 3,000 से 160 मिमी तक लाएँ। वर्षावन → सवाना → मरुस्थल क्रम देखें।')],
  predictions: [
    {
      id: 'p1',
      stem: b('A region stays warm (~26°C) all year but gets under 200 mm rain/year. Its biome is…', 'एक क्षेत्र साल भर गर्म (~26°C) है पर 200 मिमी से कम वर्षा पाता है। इसका बायोम है…'),
      options: [opt('desert', 'Desert (like Thar)', 'मरुस्थल (जैसे थार)'), opt('rainforest', 'Tropical Rainforest', 'उष्णकटिबंधीय वर्षावन')],
      run: (S) => { S.temp = 26; S.rain = 160; return 'desert'; },
      explain: () => b('Warm air without moisture creates hot deserts with thorny scrub and cacti.', 'नमी के बिना ऊँचा तापमान कँटीली झाड़ियों वाला गर्म मरुस्थल बनाता है।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Which two climate factors mainly determine which biome grows naturally in a region?', 'किसी क्षेत्र में प्राकृतिक रूप से कौन-सा बायोम उगेगा, यह मुख्यतः किन दो कारकों से तय होता है?'),
      correct: 'tr',
      options: [
        { id: 'tr', ...b('Temperature and precipitation (rainfall/snow)', 'तापमान और वर्षण (वर्षा/हिम)') },
        { id: 'pop', ...b('Only postal code borders', 'केवल डाक क्षेत्र सीमाएँ'), why: b('Biomes follow climate belts, not postal lines.', 'बायोम जलवायु पट्टियों का अनुसरण करते हैं।') },
      ],
      explain: b('Temperature + water availability shape plant forms from tundra mosses to rainforest canopies.', 'तापमान व जल की उपलब्धता टुंड्रा से वर्षावन तक वनस्पति तय करते हैं।'),
      hint: b('Look at the two sliders controlling the world map.', 'विश्व मानचित्र के दोनों स्लाइडर देखें।'),
    },
  ],
  reflect: b('Which biome type sits closest to where you live, and name two native trees or crops suited to it.', 'आपके क्षेत्र के सबसे निकट कौन-सा बायोम है, और इसके अनुकूल दो स्थानीय वृक्ष या फसलें लिखें।'),
};

// ================================================================ T11.L2 India Biosphere Reserves
export const reserveMap = {
  id: 'T11.L2',
  objective: b('Locate India’s biosphere reserves on a map and understand how Core, Buffer and Transition zones protect biodiversity alongside local communities.', 'मानचित्र पर भारत के जैवमंडल आरक्षित क्षेत्र खोजें और जानें कि कोर, बफ़र व संक्रमण क्षेत्र स्थानीय लोगों संग जैव-विविधता कैसे बचाते हैं।'),
  note: { kind: 'documented', en: 'Reserve coordinates and establishment years from India’s Biosphere Reserve network; boundaries via datta07/INDIAN-SHAPEFILES.', hi: 'भारत के जैवमंडल आरक्षित क्षेत्र नेटवर्क से स्थान व वर्ष; सीमाएँ datta07/INDIAN-SHAPEFILES द्वारा।' },
  init: () => ({ reserve: 'nilgiri', zone: 'core' }),
  controls: [
    { id: 'reserve', type: 'chips', label: b('Select biosphere reserve', 'जैवमंडल क्षेत्र चुनें'), options: Eco.INDIA_RESERVES.map((r) => ({ id: r.id, en: r.en.split(' (')[0], hi: r.hi.split(' (')[0] })) },
    { id: 'zone', type: 'chips', label: b('Biosphere zone', 'क्षेत्र परत'), options: [opt('core', 'Core zone (strict)', 'कोर क्षेत्र (सख्त)'), opt('buffer', 'Buffer zone (research)', 'बफ़र क्षेत्र (शोध)'), opt('trans', 'Transition zone (sustainable villages)', 'संक्रमण क्षेत्र (धारणीय गाँव)')] },
  ],
  view(S) {
    const res = Eco.INDIA_RESERVES.find((r) => r.id === S.reserve) || Eco.INDIA_RESERVES[0];
    const markers = Eco.INDIA_RESERVES.map((r) => ({
      lon: r.lon, lat: r.lat, r: r.id === S.reserve ? 9 : 5.5,
      fill: r.id === S.reserve ? '#146c2e' : '#5f7a61',
      pulse: r.id === S.reserve,
      label: r.id === S.reserve ? { en: r.en.split(' (')[0], hi: r.hi.split(' (')[0] } : null,
    }));
    const svg = indiaMapSvg({ w: 640, h: 420, stateColors: { [res.state]: '#bbf7d0' }, selectedState: res.state, markers, aria: `India biosphere reserves map highlighting ${res.en}` });
    const zInfo = S.zone === 'core'
      ? b('Core zone: legally protected undisturbed habitat where wildlife breeds without commercial extraction.', 'कोर क्षेत्र: कानूनी रूप से पूरी तरह सुरक्षित क्षेत्र जहाँ वन्यजीव बिना व्यावसायिक दखल के पनपते हैं।')
      : S.zone === 'buffer'
        ? b('Buffer zone: surrounds the core; allows scientific research, environmental education, and carefully regulated eco-tourism.', 'बफ़र क्षेत्र: कोर के चारों ओर स्थित; यहाँ वैज्ञानिक शोध, शिक्षा व सीमित पारिस्थितिक पर्यटन की अनुमति होती है।')
        : b('Transition zone: outer belt where local communities farm, gather non-timber produce sustainably, and co-manage forests.', 'संक्रमण क्षेत्र: बाहरी पट्टी जहाँ स्थानीय समुदाय टिकाऊ खेती व वन-उपज सह-प्रबंधन करते हैं।');
    return {
      plate: {
        src: 'assets/images/plates/t11-reserves.jpg',
        en: 'Indian biosphere reserve landscape: tap dense river Core forest, ranger Buffer station or terraced Transition village.',
        hi: 'भारतीय जैवमंडल क्षेत्र: नदी तटीय कोर वन, बफ़र रेंजर चौकी और संक्रमण क्षेत्र के गाँव पर टैप करें।',
        spots: [
          { x: 20, y: 56, en: 'Core Zone (Dense Deer Refuge)', hi: 'कोर क्षेत्र (कठोर वन्यजीव संरक्षण)', detail: b('Zero logging or construction — safe sanctuary where deer, tigers & rare flora breed.', 'पूर्णतः सुरक्षित क्षेत्र जहाँ वन्यजीव बिना मानवीय दखल के पनपते हैं।'), set: { zone: 'core', reserve: 'nilgiri' } },
          { x: 50, y: 66, en: 'Buffer Zone (Ranger Watchtower)', hi: 'बफ़र क्षेत्र (रेंजर निगरानी चौकी)', detail: b('Field stations, regulated trails and ecological monitoring ring the Core.', 'वैज्ञानिक शोध, निगरानी व नियंत्रित पारिस्थितिक अध्ययन की मध्यवर्ती पट्टी।'), set: { zone: 'buffer', reserve: 'nanda' } },
          { x: 80, y: 58, en: 'Transition Zone (Bamboo & Honey)', hi: 'संक्रमण क्षेत्र (समुदाय साझेदारी)', detail: b('Surrounding villages farm terraces and tend bee hives sustainably alongside forests.', 'बाहरी गाँव टिकाऊ कृषि व मधुमक्खी पालन संग संरक्षण में साझेदार बनते हैं।'), set: { zone: 'trans', reserve: 'sundarbans' } },
        ],
      },
      svg, aria: `${res.en} — ${res.species.en}`, lines: [{ en: `${res.en} · Key species: ${res.species.en}.`, hi: `${res.hi} · प्रमुख प्रजातियाँ: ${res.species.hi}।`, cls: 'balanced' }, zInfo],
    };
  },
  discover: [b('Compare Nanda Devi (Himalaya) with Sundarbans (Delta) and Gulf of Mannar (Marine). Notice how reserves span mountains, coasts and islands.', 'नंदा देवी (हिमालय), सुंदरबन (डेल्टा) व मन्नार की खाड़ी (समुद्री) की तुलना करें।')],
  predictions: [
    {
      id: 'p1',
      stem: b('Which biosphere reserve zone is designed for sustainable farming and shared livelihoods by local residents?', 'जैवमंडल क्षेत्र की कौन-सी पट्टी स्थानीय निवासियों की टिकाऊ खेती और साझा आजीविका के लिए बनाई गई है?'),
      options: [opt('trans', 'Transition zone', 'संक्रमण क्षेत्र'), opt('core', 'Strict Core zone', 'कठोर कोर क्षेत्र')],
      run: (S) => { S.zone = 'trans'; return 'trans'; },
      explain: () => b('Biosphere reserves balance strict Core protection with a cooperative Transition zone for human livelihoods.', 'जैवमंडल क्षेत्र सख्त कोर सुरक्षा के साथ मानव आजीविका के लिए सहभागी संक्रमण क्षेत्र का संतुलन बनाते हैं।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why do biosphere reserves wrap Core habitats inside Buffer and Transition zones instead of a bare fence?', 'जैवमंडल आरक्षित क्षेत्र केवल बाड़ लगाने के बजाय कोर के चारों ओर बफ़र व संक्रमण क्षेत्र क्यों रखते हैं?'),
      correct: 'coexist',
      options: [
        { id: 'coexist', ...b('To cushion human-wildlife conflict and make local communities partners in conservation.', 'ताकि मानव-वन्यजीव टकराव कम हो और स्थानीय समुदाय संरक्षण में साझेदार बनें।') },
        { id: 'cut', ...b('So the Core forest can be cleared first.', 'ताकि पहले कोर जंगल काटा जा सके।'), why: b('The Core is the most strictly protected area.', 'कोर सबसे कड़ाई से संरक्षित भाग होता है।') },
      ],
      explain: b('Graduated zones connect ecological safety with community trust.', 'क्रमबद्ध क्षेत्र पारिस्थितिक सुरक्षा को सामुदायिक विश्वास से जोड़ते हैं।'),
      hint: b('Click through Core, Buffer and Transition chips.', 'कोर, बफ़र और संक्रमण विकल्प पढ़ें।'),
    },
  ],
  reflect: b('Pick one Indian biosphere reserve from the map and explain why its habitat cannot easily be replaced elsewhere.', 'मानचित्र से एक भारतीय जैवमंडल क्षेत्र चुनें और लिखें कि उसका आवास कहीं और आसानी से क्यों नहीं बन सकता।'),
};

// ================================================================ T11.L4 Forest-fire factors & prevention planner
export const firePlanner = {
  id: 'T11.L4',
  objective: b('Test how heat, dry humidity, wind and dry pine needles drive forest-fire spread, and how firebreaks and community patrols lower risk.', 'परखें कि तापमान, सूखापन, पवन और सूखी पत्तियाँ जंगल की आग को कैसे बढ़ाती हैं, और फायर-लाइन तथा सामुदायिक गश्त जोखिम कैसे घटाती हैं।'),
  note: { kind: 'schematic', en: 'Educational fire-triangle danger index (0–100) for classroom prevention planning.', hi: 'निवारण योजना हेतु शैक्षणिक अग्नि-त्रिकोण सूचकांक (0–100)।' },
  init: () => ({ temp: 36, humidity: 25, wind: 22, litter: 0.7, firebreak: false }),
  controls: [
    { id: 'temp', type: 'slider', label: b('Air temperature (°C)', 'वायु तापमान (°C)'), min: 15, max: 45, step: 1, fmt: (v) => `${v}°C` },
    { id: 'humidity', type: 'slider', label: b('Relative humidity', 'सापेक्ष आर्द्रता'), min: 10, max: 85, step: 5, fmt: (v) => `${v}%` },
    { id: 'wind', type: 'slider', label: b('Slope wind speed (km/h)', 'पवन गति (किमी/घं)'), min: 0, max: 50, step: 2 },
    { id: 'litter', type: 'slider', label: b('Dry leaf/pine litter load', 'सूखी पत्तियों/पिरुल की मात्रा'), min: 0.1, max: 1.0, step: 0.1, fmt: (v) => `${Math.round(v * 100)}%` },
    { id: 'firebreak', type: 'toggle', label: b('Clear 10 m firebreaks + controlled litter removal', '10 मी फायर-लाइन + सूखी पत्तियाँ हटाना') },
  ],
  view(S) {
    const r = Eco.fireRisk({ tempC: S.temp, humidityPct: S.humidity, windKmh: S.wind, dryLitter: S.litter, firebreak: S.firebreak });
    const col = r.level === 'extreme' ? '#c0392b' : r.level === 'high' ? '#d97706' : '#146c2e';
    let g = `<rect x="20" y="20" width="600" height="175" rx="8" fill="var(--card)" stroke="var(--line)"/>`;
    // Fire triangle
    g += `<polygon points="150,42 75,165 225,165" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>`;
    g += `<text class="txt sm b" x="150" y="36" text-anchor="middle">${esc(P(`Heat (${S.temp}°C)`, `ताप (${S.temp}°C)`))}</text>`;
    g += `<text class="txt sm b" x="72" y="182" text-anchor="middle">${esc(P(`Dry fuel (${Math.round(S.litter * 100)}%)`, `ईंधन (${Math.round(S.litter * 100)}%)`))}</text>`;
    g += `<text class="txt sm b" x="228" y="182" text-anchor="middle">${esc(P(`Wind/O₂ (${S.wind} km/h)`, `हवा (${S.wind} किमी/घं)`))}</text>`;
    // Danger meter
    g += `<text class="txt b" x="445" y="56" text-anchor="middle">${esc(P('Fire risk index', 'आग जोखिम सूचकांक'))}</text>`;
    g += `<rect x="335" y="72" width="220" height="26" rx="6" fill="var(--line)"/><rect x="335" y="72" width="${(r.effectiveIndex * 2.2).toFixed(0)}" height="26" rx="6" fill="${col}"/>`;
    g += `<text class="txt b" x="445" y="122" text-anchor="middle" fill="${col}">${r.effectiveIndex}/100 · ${esc(P(`Spread: ${r.spreadMMin} m/min`, `फैलाव: ${r.spreadMMin} मी/मि`))}</text>`;
    return {
      plate: {
        src: 'assets/images/plates/t11-reserves.jpg',
        en: 'Forest canopy, cleared earthen firebreak & hillside village — tap pins to test dry wind danger vs firebreak defence.',
        hi: 'वन आवरण, साफ़ मिट्टी की फायर-लाइन व ग्राम सीमा — सूखी हवा के खतरे बनाम फायर-लाइन सुरक्षा हेतु पिन पर टैप करें।',
        spots: [
          { x: 20, y: 56, en: 'Moist River Forest (Low Risk)', hi: 'नम नदी वन (कम जोखिम)', detail: b('75% humidity and moist green floor halt wildfire spread naturally.', '75% आर्द्रता व हरी-नम सतह प्राकृतिक रूप से आग को रोक देती है।'), set: { temp: 24, humidity: 75, wind: 10, litter: 0.3, firebreak: false } },
          { x: 50, y: 66, en: '10 m Cleared Earthen Firebreak', hi: '10 मी साफ़ फायर-लाइन पट्टी', detail: b('Clearing dry litter along this road cuts fire spread in half so villages stay safe!', 'इस मार्ग पर सूखी पत्तियाँ हटाने से आग फैलने की गति आधी रह जाती है!'), set: { temp: 38, humidity: 20, wind: 26, litter: 0.7, firebreak: true } },
          { x: 80, y: 58, en: 'Peak Summer Wind Danger', hi: 'ग्रीष्म पवन व सूखी घास खतरा', detail: b('41°C heat, 15% dry air and 38 km/h wind push danger extreme without firebreaks!', '41°C गर्मी, 15% सूखापन व 38 किमी/घं हवा बिना फायर-लाइन के खतरा चरम पर लाते हैं!'), set: { temp: 41, humidity: 15, wind: 38, litter: 0.9, firebreak: false } },
        ],
      },
      svg: `<svg viewBox="0 0 640 205" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Fire index ${r.effectiveIndex} of 100, spread ${r.spreadMMin} m/min`,
      lines: [
        { en: `Danger index: ${r.effectiveIndex}/100 (${r.level}). Spread rate ~${r.spreadMMin} m/min.${S.firebreak ? ' Firebreaks cut fuel continuity nearly in half!' : ''}`, hi: `खतरा सूचकांक: ${r.effectiveIndex}/100। फैलाव गति ~${r.spreadMMin} मी/मि।${S.firebreak ? ' फायर-लाइन ने ईंधन की निरंतरता लगभग आधी कर दी!' : ''}`, cls: r.level === 'extreme' ? 'warn' : 'balanced' },
      ],
    };
  },
  discover: [b('Raise wind to 45 km/h on a dry hot day (40°C, 15% humidity), then toggle firebreaks ON.', 'गर्म सूखे दिन (40°C, 15% नमी) पर हवा 45 किमी/घं करें और फिर फायर-लाइन चालू करें।')],
  predictions: [
    {
      id: 'p1',
      stem: b('Clearing dry pine needles (fuel) into briquettes and maintaining bare 10 m firebreaks before summer…', 'गर्मियों से पहले सूखी पिरुल (ईंधन) हटाकर ईंटें बनाना और 10 मी चौड़ी फायर-लाइन साफ़ रखना…'),
      options: [opt('cuts', 'Cuts fire risk index and slows spread dramatically', 'आग जोखिम और फैलाव को काफ़ी घटाता है'), opt('helps', 'Makes fires burn hotter', 'आग और तेज़ करता है')],
      run: (S) => { S.temp = 38; S.humidity = 20; S.wind = 24; S.litter = 0.8; S.firebreak = true; return 'cuts'; },
      explain: () => b('Breaking the fuel leg of the fire triangle prevents small ground sparks from leaping across ridges.', 'अग्नि-त्रिकोण की ईंधन भुजा तोड़ने से छोटी चिंगारी पूरे जंगल में नहीं फैलती।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why are early summer pine forests in the western Himalaya especially prone to fires?', 'पश्चिमी हिमालय के चीड़ वन शुरुआती गर्मियों में आग के प्रति अधिक संवेदनशील क्यों होते हैं?'),
      correct: 'dry',
      options: [
        { id: 'dry', ...b('Resin-rich dry pine needles accumulate on dry slopes right as pre-monsoon heat and wind peak.', 'मानसून-पूर्व गर्मी व हवा बढ़ने पर राल-युक्त सूखी पिरुल ढलानों पर जमा रहती है।') },
        { id: 'snow', ...b('Snow acts as liquid petrol.', 'बर्फ़ पेट्रोल की तरह जलती है।'), why: b('Snow cools and wets fuel; pre-monsoon dryness drives risk.', 'बर्फ़ नमी देती है; मानसून-पूर्व सूखापन आग बढ़ाता है।') },
      ],
      explain: b('Dry fuel + heat + slope winds explain peak May–June forest fire season.', 'सूखा ईंधन + गर्मी + ढलानी हवा मई–जून के अग्नि-काल को समझाते हैं।'),
      hint: b('Look at the three corners of the fire triangle.', 'अग्नि-त्रिकोण के तीनों कोने देखें।'),
    },
  ],
  reflect: b('How can village *Van Panchayats* turn dry forest pine needles from a fire hazard into local fuel or compost income?', 'ग्राम वन-पंचायतें सूखी पत्तियों/पिरुल को आग के खतरे के बजाय स्थानीय ईंधन या खाद की आय में कैसे बदल सकती हैं?'),
};

// ================================================================ T11.L5 Traditional conservation gallery
const TRAD_CASES = {
  sacred: { en: 'Sacred Groves (Devrai / Sarna / Kavu / Oran)', hi: 'पवित्र उपवन (देवराई / सरना / कावु / ओरान)', place: b('Maharashtra, Jharkhand, Kerala, Rajasthan, Meghalaya', 'महाराष्ट्र, झारखंड, केरल, राजस्थान, मेघालय'), desc: b('Community-protected sal, banyan and forest patches dedicated to local traditions where cutting trees is forbidden — preserving rare medicinal plants and spring water.', 'समुदाय द्वारा संरक्षित साल, वट और वन-खंड जहाँ कटाई वर्जित है — दुर्लभ औषधीय पौधों और झरनों की रक्षा होती है।') },
  bishnoi: { en: 'Bishnoi Community Ethic (Khejarli)', hi: 'बिश्नोई समाज संरक्षण परंपरा (खेजड़ली)', place: b('Western Rajasthan (1730 CE Khejarli sacrifice)', 'पश्चिमी राजस्थान (1730 ई. खेजड़ली)'), desc: b('29 principles strictly forbid felling green Khejri trees or harming blackbuck/chinkara, keeping desert wildlife thriving near villages.', '29 नियम हरे खेजड़ी वृक्ष काटने व काले हिरण को हानि पहुँचाने से रोकते हैं, जिससे मरुस्थल में भी वन्यजीव गाँवों संग पलते हैं।') },
  johad: { en: 'Johad & Apatani Water-Forest Farming', hi: 'जोहड़ व अपातानी जल-वन कृषि', place: b('Alwar (Rajasthan) & Ziro Valley (Arunachal)', 'अलवर (राजस्थान) व ज़ीरो घाटी (अरुणाचल)'), desc: b('Community earthen check-dams (johads) revived dry rivers; Apatani terraced paddy integrates bamboo forests with fish culture cleanly.', 'ग्रामीण मिट्टी के जोहड़ों ने सूखी नदियाँ जीवित कीं; अपातानी सीढ़ीदार धान-मछली व बाँस वनों को जोड़ती है।') },
};

export const traditionalConservation = {
  id: 'T11.L5',
  objective: b('Examine how India’s traditional community practices—sacred groves, Bishnoi ethics and indigenous water-forest systems—conserve biodiversity.', 'परखें कि भारत की पारंपरिक सामुदायिक प्रथाएँ—पवित्र उपवन, बिश्नोई परंपरा व देशज जल-वन प्रणालियाँ—जैव-विविधता कैसे बचाती हैं।'),
  note: { kind: 'documented', en: 'Synthesises documented community-conserved traditions across India.', hi: 'भारत भर की प्रलेखित सामुदायिक संरक्षण परंपराओं का संकलन।' },
  init: () => ({ item: 'sacred' }),
  controls: [{ id: 'item', type: 'chips', label: b('Community tradition', 'सामुदायिक परंपरा'), options: Object.entries(TRAD_CASES).map(([id, o]) => ({ id, en: o.en.split(' (')[0], hi: o.hi.split(' (')[0] })) }],
  view(S) {
    const it = TRAD_CASES[S.item];
    const svg = `<svg viewBox="0 0 640 205" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="tr-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#dcfce7"/><stop offset="100%" stop-color="#f0fdf4"/></linearGradient><radialGradient id="tr-leaf"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#14532d"/></radialGradient></defs><rect x="14" y="14" width="612" height="176" rx="14" fill="url(#tr-bg)" stroke="#15803d" stroke-width="2"/><path d="M14,160 Q160,128 320,148 T626,154 L626,190 L14,190 Z" fill="#86efac" opacity=".55"/><circle cx="92" cy="96" r="46" fill="url(#tr-leaf)"/><circle cx="72" cy="84" r="24" fill="#22c55e" opacity=".75"/><circle cx="114" cy="90" r="22" fill="#166534" opacity=".8"/><rect x="86" y="114" width="12" height="44" rx="4" fill="#6b4423"/><circle cx="566" cy="144" r="14" fill="#0ea5e9" opacity=".35"/><text class="txt b" x="164" y="66">${esc(P(it.en, it.hi))}</text><text class="txt sm" x="164" y="96">${esc(P(it.place.en, it.place.hi))}</text><text class="txt sm mut" x="164" y="128">${esc(P('Stewardship by shared cultural rules & local memory', 'साझा सांस्कृतिक नियमों व स्थानीय स्मृति द्वारा संरक्षण'))}</text></svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t11-grove.jpg',
        en: 'Community-protected sacred grove beside a village johad water tank — tap pins to explore India’s conservation traditions.',
        hi: 'ग्रामीण जोहड़ जल-कुंड व समुदाय-संरक्षित पवित्र उपवन — भारतीय परंपराओं की खोज हेतु पिन पर टैप करें।',
        spots: [
          { x: 26, y: 42, en: 'Sacred Grove Canopy (Devrai / Sarna)', hi: 'पवित्र उपवन (देवराई / सरना)', detail: b('Moral custom bans felling — saving centuries-old medicinal seed trees & springs.', 'सामुदायिक नियम कटाई रोककर प्राचीन औषधीय वृक्ष व जलस्रोत बचाते हैं।'), set: { item: 'sacred' } },
          { x: 56, y: 66, en: 'Bishnoi Desert Ethic (Khejri & Blackbuck)', hi: 'बिश्नोई समाज संरक्षण (खेजड़ी व हिरण)', detail: b('29 community precepts guard desert trees and wildlife alongside villages.', '29 नियम मरुस्थलीय वृक्षों और काले हिरण को गाँवों के साथ सुरक्षित रखते हैं।'), set: { item: 'bishnoi' } },
          { x: 80, y: 54, en: 'Johad & Apatani Water-Forest', hi: 'जोहड़ व अपातानी जल-वन कृषि', detail: b('Earthen johad check-dams recharge wells and sustain wetland life without concrete.', 'मिट्टी के जोहड़ भूजल भरकर कुएँ और हरियाली पुनः जीवित करते हैं।'), set: { item: 'johad' } },
        ],
      },
      svg,
      aria: `${it.en} (${it.place.en})`,
      lines: [{ en: it.en, hi: it.hi, cls: 'balanced' }, it.desc],
    };
  },
  discover: [b('Compare all three traditions. What replaces armed fences in every single case?', 'तीनों परंपराओं की तुलना करें। हर उदाहरण में कँटीली बाड़ की जगह क्या चीज़ रक्षा करती है?')],
  predictions: [
    {
      id: 'p1',
      stem: b('What common rule allows sacred groves (Devrai / Kavu) to survive intact for centuries?', 'पवित्र उपवन (देवराई / कावु) सदियों तक सुरक्षित कैसे बचे रहते हैं?'),
      options: [opt('taboo', 'Shared community respect and social prohibition against commercial cutting', 'साझा सामुदायिक आस्था और व्यावसायिक कटाई पर सामाजिक रोक'), opt('road', 'Building highways right through the middle', 'बीच से राजमार्ग निकालना')],
      run: (S) => { S.item = 'sacred'; return 'taboo'; },
      explain: () => b('Shared moral norms enforced by villagers protect ancient seed banks and springs longer than distant policing.', 'ग्रामीणों के साझा नैतिक नियम दूरस्थ पहरेदारी से भी अधिक लंबे समय तक प्राचीन वृक्षों व झरनों की रक्षा करते हैं।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('How do traditional johads in Rajasthan help both soil moisture and village biodiversity?', 'राजस्थान के पारंपरिक जोहड़ मिट्टी की नमी और गाँव की जैव-विविधता दोनों की मदद कैसे करते हैं?'),
      correct: 'recharge',
      options: [
        { id: 'recharge', ...b('By catching monsoon runoff to recharge groundwater, revive wells, and sustain trees & birds.', 'मानसूनी बहाव रोककर भूजल भरते हैं, कुएँ जीवित करते हैं और वृक्ष-पक्षियों को सहारा देते हैं।') },
        { id: 'drain', ...b('By draining rivers quickly into the ocean.', 'नदियों को तेज़ी से समुद्र में बहाकर।'), why: b('Johads hold rain where it falls rather than rushing it away.', 'जोहड़ वर्षा जल को वहीं रोकते हैं।') },
      ],
      explain: b('Local water harvesting restores vegetation and habitat without heavy concrete dams.', 'स्थानीय जल संचयन बिना बड़े कंक्रीट बाँधों के हरियाली व आवास लौटाता है।'),
      hint: b('Open the Johad & Apatani card.', 'जोहड़ व अपातानी कार्ड खोलें।'),
    },
  ],
  reflect: b('Share one traditional proverb, festival, or practice in your family that encourages protecting water, seeds, or trees.', 'अपने परिवार की एक कहावत, पर्व या प्रथा लिखें जो जल, बीज या वृक्षों की रक्षा सिखाती हो।'),
};
