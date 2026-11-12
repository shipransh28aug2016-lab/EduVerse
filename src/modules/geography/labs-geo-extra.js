// Remaining Geography labs:
// T03.L2 Climate grapher, T03.L3 India Monsoon & livelihoods map, T03.L5 Catchment flood model, T03.L6 Carbon footprint;
// T10.L1 Ocean-floor relief cutaway, T10.L3 Marine fisheries livelihoods, T10.L5 Maritime cooperation concept map;
// T11.L1 World biome map & matcher, T11.L2 India biosphere reserves map, T11.L4 Forest fire planner, T11.L5 Traditional conservation gallery.
import * as A from '../../engines/domain/atmosphere.js';
import * as O from '../../engines/domain/ocean.js';
import * as Eco from '../../engines/domain/ecosystem.js';
import { Chart } from '../../engines/chart.js';
import { d3, indiaMapSvg, worldMapSvg, forceGraphSvg } from '../../engines/viz.js';
import { fmt, esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi) => ({ id, en, hi });
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

// ================================================================ T03.L2 Climate Grapher
export const climateGrapher = {
  id: 'T03.L2',
  objective: b('Read and compare temperature-rainfall climographs across contrasting Indian stations shaped by latitude, altitude, coast and relief.', 'तट, ऊँचाई, अक्षांश और उच्चावच से प्रभावित विभिन्न भारतीय केंद्रों के तापमान-वर्षा जलवायु आरेखों की तुलना करें।'),
  note: { kind: 'schematic', en: 'Representative monthly climatology normals for classroom comparison of coastal, arid, cold-desert and orographic stations.', hi: 'तटीय, शुष्क, शीत-मरुस्थल व पर्वतीय केंद्रों की कक्षा-तुलना हेतु प्रतिनिधि मासिक औसत।' },
  init: () => ({ station: 'mumbai', compare: 'jaipur' }),
  controls: [
    { id: 'station', type: 'chips', label: b('Primary station', 'मुख्य केंद्र'), options: Object.entries(A.STATIONS).map(([id, s]) => ({ id, en: s.en.split(' (')[0], hi: s.hi.split(' (')[0] })) },
    { id: 'compare', type: 'chips', label: b('Compare temperature line', 'तुलना केंद्र (तापमान)'), options: Object.entries(A.STATIONS).map(([id, s]) => ({ id, en: s.en.split(' (')[0], hi: s.hi.split(' (')[0] })) },
  ],
  view(S) {
    const st = A.stationSummary(S.station), cmp = A.stationSummary(S.compare);
    const W = 640, H = 280, x0 = 52, x1 = 580, yTop = 22, yBot = 242;
    const xScale = d3.scaleBand().domain(MONTHS.map((_, i) => i)).range([x0, x1]).padding(0.24);
    const maxR = Math.max(800, Math.max(...st.rain) * 1.1);
    const rScale = d3.scaleLinear().domain([0, maxR]).range([yBot, yTop]);
    const tScale = d3.scaleLinear().domain([-15, 42]).range([yBot, yTop]);

    let g = `<line class="axis" x1="${x0}" y1="${yBot}" x2="${x1}" y2="${yBot}"/><line class="axis" x1="${x0}" y1="${yTop}" x2="${x0}" y2="${yBot}"/><line class="axis" x1="${x1}" y1="${yTop}" x2="${x1}" y2="${yBot}"/>`;
    for (let t = -10; t <= 40; t += 10) {
      const y = tScale(t);
      g += `<line class="grid" x1="${x0}" x2="${x1}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text class="txt sm mut" x="${x0 - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${t}°</text>`;
    }
    st.rain.forEach((r, i) => {
      const bx = xScale(i), bw = xScale.bandwidth(), by = rScale(r);
      g += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${(yBot - by).toFixed(1)}" fill="#3b82f6" opacity=".68" rx="2"/>`;
      g += `<text class="txt sm" x="${(bx + bw / 2).toFixed(1)}" y="${yBot + 16}" text-anchor="middle">${MONTHS[i]}</text>`;
    });
    const lineGen = d3.line().x((_, i) => xScale(i) + xScale.bandwidth() / 2).y((d) => tScale(d)).curve(d3.curveMonotoneX);
    g += `<path d="${lineGen(cmp.temp)}" fill="none" stroke="var(--mut)" stroke-width="2.5" stroke-dasharray="6 4"/>`;
    g += `<path d="${lineGen(st.temp)}" fill="none" stroke="var(--d)" stroke-width="3.5"/>`;
    g += `<text class="txt sm b" x="${x1 - 4}" y="16" text-anchor="end" fill="#2563eb">${esc(P('Bars: Rainfall (mm)', 'पट्टियाँ: वर्षा (मिमी)'))} · ${esc(P('Red: Primary °C', 'लाल: मुख्य °C'))}</text>`;
    return {
      svg: `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `${st.en}: annual rain ${st.totalRain} mm, temp ${st.minT} to ${st.maxT} C`,
      lines: [
        { en: `${st.en} (elev. ${st.elev} m): annual rainfall ${fmt(st.totalRain, 0)} mm; temp ${st.minT}°C to ${st.maxT}°C (annual range ${st.rangeT}°C).`, hi: `${st.hi} (ऊँचाई ${st.elev} मी): वार्षिक वर्षा ${fmt(st.totalRain, 0)} मिमी; तापमान ${st.minT}°C से ${st.maxT}°C (वार्षिक अंतर ${st.rangeT}°C)।`, cls: 'balanced' },
        { en: `Comparison (${cmp.en}): annual range ${cmp.rangeT}°C, annual rainfall ${fmt(cmp.totalRain, 0)} mm.`, hi: `तुलना (${cmp.hi}): वार्षिक अंतर ${cmp.rangeT}°C, वार्षिक वर्षा ${fmt(cmp.totalRain, 0)} मिमी।`, cls: 'note' },
      ],
    };
  },
  discover: [
    b('Compare Mumbai (coastal) with Jaipur (inland). Why is Mumbai’s annual temperature swing much smaller?', 'मुंबई (तटीय) की जयपुर (आंतरिक) से तुलना करें। मुंबई का वार्षिक तापमान अंतर बहुत कम क्यों है?'),
    b('Pick Chennai and look at October–December bars. Why does Chennai peak later than Mumbai?', 'चेन्नई चुनें और अक्टूबर–दिसंबर की पट्टियाँ देखें। चेन्नई में वर्षा मुंबई से बाद में क्यों चरम पर होती है?'),
  ],
  predictions: [
    {
      id: 'p1',
      stem: b('Which city has the smallest temperature difference between winter and summer?', 'सर्दी और गर्मी के बीच सबसे कम तापमान-अंतर किस शहर में है?'),
      options: [opt('mumbai', 'Mumbai (moderated by Arabian Sea)', 'मुंबई (अरब सागर के प्रभाव से)'), opt('jaipur', 'Jaipur (far from sea)', 'जयपुर (समुद्र से दूर)')],
      run: (S) => { S.station = 'mumbai'; S.compare = 'jaipur'; return A.stationSummary('mumbai').rangeT < A.stationSummary('jaipur').rangeT ? 'mumbai' : 'jaipur'; },
      explain: () => b(`Mumbai swings only ${A.stationSummary('mumbai').rangeT}°C across the year vs Jaipur’s ${A.stationSummary('jaipur').rangeT}°C because ocean water warms and cools slowly.`, `सागर धीरे गर्म-ठंडा होने से मुंबई में केवल ${A.stationSummary('mumbai').rangeT}°C का अंतर रहता है, जबकि जयपुर में ${A.stationSummary('jaipur').rangeT}°C।`),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why is Leh much colder than Jaipur even though both have low rainfall?', 'कम वर्षा होने के बावजूद लेह जयपुर से इतना ठंडा क्यों है?'),
      correct: 'alt',
      options: [
        { id: 'alt', ...b('Leh sits at ~3,500 m altitude in the Himalaya, where thinner air cools ~6.5°C per km.', 'लेह हिमालय में ~3,500 मी ऊँचाई पर है, जहाँ विरल हवा ऊँचाई के साथ ठंडी होती है।') },
        { id: 'sea', ...b('Leh is closer to the Bay of Bengal.', 'लेह बंगाल की खाड़ी के अधिक निकट है।'), why: b('Leh is deep inland; altitude and latitude explain its cold climate.', 'लेह समुद्र से बहुत दूर है; उसकी ठंड का कारण ऊँचाई है।') },
      ],
      explain: b('Altitude lowers temperature rapidly even in sunny high deserts.', 'अधिक ऊँचाई पर सूर्य की धूप के बावजूद तापमान कम रहता है।'),
      hint: b('Check Leh’s elevation in the readout.', 'लेह की ऊँचाई पढ़ें।'),
    },
  ],
  reflect: b('Describe your local climate across the year: which 2–3 months bring most rain and when is the warmest month?', 'अपने क्षेत्र की वार्षिक जलवायु बताएँ: किन 2–3 महीनों में सर्वाधिक वर्षा होती है और सबसे गर्म महीना कौन-सा है?'),
};

// ================================================================ T03.L3 India Monsoon Map
export const monsoonMap = {
  id: 'T03.L3',
  objective: b('Trace India’s advancing (SW) and retreating (NE) monsoon winds on an India map and link rainfall seasons to farming and coastal livelihoods.', 'भारत के मानचित्र पर दक्षिण-पश्चिम और उत्तर-पूर्व मानसूनी पवनों की दिशा देखें और ऋतुओं को कृषि व आजीविका से जोड़ें।'),
  note: { kind: 'schematic', en: 'India boundaries via datta07/INDIAN-SHAPEFILES (MIT); monsoon arrows show textbook seasonal corridors.', hi: 'भारत सीमाएँ datta07/INDIAN-SHAPEFILES द्वारा; तीर पाठ्यपुस्तकीय मौसमी मानसून पथ दिखाते हैं।' },
  init: () => ({ season: 'sw', crop: 'rice' }),
  controls: [
    { id: 'season', type: 'chips', label: b('Monsoon season', 'मानसून ऋतु'), options: [opt('sw', 'Advancing SW Monsoon (Jun–Sep)', 'आता द.-प. मानसून (जून–सितं)'), opt('ne', 'Retreating NE Monsoon (Oct–Dec)', 'लौटता उ.-पू. मानसून (अक्टू–दिसं)')] },
    { id: 'crop', type: 'chips', label: b('Livelihood focus', 'आजीविका'), options: [opt('rice', 'Kharif paddy & deltas', 'खरीफ़ धान व डेल्टा'), opt('millet', 'Rainfed millets (Deccan/Thar)', 'वर्षा-आधारित बाजरा'), opt('fishing', 'Coastal monsoon ban & catch', 'तटीय मत्स्य ऋतु')] },
  ],
  view(S) {
    const sw = S.season === 'sw';
    const paths = sw
      ? [
          { coords: [[67, 9], [73, 12], [75, 19], [72, 23]], stroke: '#0284c7', width: 4 },
          { coords: [[82, 8], [88, 16], [90, 23], [84, 26], [77, 29]], stroke: '#0369a1', width: 4 },
        ]
      : [
          { coords: [[78, 30], [82, 24], [85, 17], [80, 12]], stroke: '#b45309', width: 4, dash: '8 5' },
        ];
    const stateColors = sw
      ? { Kerala: '#86efac', Maharashtra: '#93c5fd', Assam: '#60a5fa', Meghalaya: '#3b82f6', Bihar: '#93c5fd', 'West Bengal': '#60a5fa', Rajasthan: '#fde68a' }
      : { 'Tamil Nadu': '#60a5fa', 'Andhra Pradesh': '#93c5fd', Odisha: '#bfdbfe' };
    const markers = sw
      ? [{ lon: 76.2, lat: 10.5, r: 7, fill: '#0284c7', label: b('Kerala onset ~Jun 1', 'केरल आगमन ~1 जून') }, { lon: 91.6, lat: 25.3, r: 7, fill: '#1d4ed8', label: b('Meghalaya hills', 'मेघालय पहाड़ियाँ') }]
      : [{ lon: 80.3, lat: 13.1, r: 8, fill: '#b45309', label: b('Coromandel winter rain', 'कोरोमंडल शीत वर्षा') }];
    const svg = indiaMapSvg({ w: 640, h: 420, stateColors, paths, markers, aria: `India map showing ${sw ? 'Advancing Southwest' : 'Retreating Northeast'} monsoon` });
    const liveNote = S.crop === 'rice'
      ? b('Kharif rice relies on reliable June–September SW monsoon rain across the Ganga plain and coastal deltas; Tamil Nadu also gets Oct–Dec samba water.', 'खरीफ़ धान जून–सितंबर की द.-प. वर्षा पर निर्भर है; तमिलनाडु को अक्टू–दिसं में लौटते मानसून से भी सिंचाई मिलती है।')
      : S.crop === 'millet'
        ? b('Rain-shadow regions (interior Maharashtra, Karnataka, Rajasthan) grow drought-resilient millets (jowar, bajra, ragi).', 'वृष्टि-छाया क्षेत्रों (आंतरिक दक्कन, राजस्थान) में सूखा-सहिष्णु मोटे अनाज (ज्वार, बाजरा, रागी) उगाए जाते हैं।')
        : b('Rough SW monsoon seas prompt a seasonal trawling ban to protect fish breeding; calmer post-monsoon waters resume full coastal catch.', 'तेज़ द.-प. मानसूनी समुद्र में प्रजनन रक्षा हेतु मत्स्य-निषेध रहता है; शांत मौसम में तटीय मछुआरे लौटते हैं।');
    return {
      svg,
      aria: `${sw ? 'SW monsoon' : 'NE monsoon'} and ${S.crop} livelihoods`,
      lines: [
        sw ? b('June–Sept: Warm moist ocean air blows SW → NE in two branches (Arabian Sea & Bay of Bengal), bringing ~75% of India’s annual rain.', 'जून–सितं: समुद्र से नम हवाएँ द.-प. से दो शाखाओं (अरब सागर व बंगाल की खाड़ी) में चलती हैं और भारत की ~75% वर्षा लाती हैं।')
          : b('Oct–Dec: Cooling northern land pushes dry NE winds back, picking up Bay of Bengal moisture to rain on the Coromandel coast (Tamil Nadu).', 'अक्टू–दिसं: उत्तरी भूमि ठंडी होने से उ.-पू. हवाएँ लौटती हैं और बंगाल की खाड़ी से नमी लेकर तमिलनाडु तट पर बरसती हैं।'),
        liveNote,
      ],
    };
  },
  discover: [
    b('Toggle between SW and NE monsoon. Watch which coast turns dark blue during Oct–Dec.', 'द.-प. और उ.-पू. मानसून के बीच बदलें। देखें अक्टू–दिसं में कौन-सा तट नीला होता है।'),
  ],
  predictions: [
    {
      id: 'p1',
      stem: b('Which Indian coast receives its main rainy season from the Retreating Northeast Monsoon (Oct–Dec)?', 'लौटते उत्तर-पूर्व मानसून (अक्टू–दिसं) से मुख्य वर्षा किस भारतीय तट पर होती है?'),
      options: [opt('coro', 'Tamil Nadu / Coromandel coast', 'तमिलनाडु / कोरोमंडल तट'), opt('raj', 'Western Rajasthan', 'पश्चिमी राजस्थान')],
      run: (S) => { S.season = 'ne'; return 'coro'; },
      explain: () => b('Northeast winds cross the Bay of Bengal, gather moisture, and strike Tamil Nadu and coastal Andhra Pradesh.', 'उ.-पू. हवाएँ बंगाल की खाड़ी से नमी लेकर तमिलनाडु व तटीय आंध्र प्रदेश पर बरसती हैं।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why does interior Maharashtra receive much less rain than Konkan just across the Western Ghats?', 'पश्चिमी घाट के ठीक पार कोंकण की तुलना में आंतरिक महाराष्ट्र में इतनी कम वर्षा क्यों होती है?'),
      correct: 'shadow',
      options: [
        { id: 'shadow', ...b('Moisture-laden Arabian Sea winds rise and rain on the western windward slope, leaving dry air on the leeward rain-shadow.', 'अरब सागर की नम हवाएँ पश्चिमी ढाल पर बरस जाती हैं, जिससे दूसरी ओर वृष्टि-छाया क्षेत्र सूखा रह जाता है।') },
        { id: 'noocean', ...b('There is no ocean west of India.', 'भारत के पश्चिम में कोई महासागर नहीं है।'), why: b('The Arabian Sea lies directly west of Konkan.', 'कोंकण के ठीक पश्चिम में अरब सागर स्थित है।') },
      ],
      explain: b('Orographic rainfall drops heavy rain windward and creates a rain shadow leeward.', 'पर्वतीय वर्षा पवनमुखी ढाल पर भारी वर्षा करती है और विमुख ओर वृष्टि-छाया बनाती है।'),
      hint: b('Switch to SW monsoon and look at the blue Western Ghats arrow.', 'द.-प. मानसून में पश्चिमी घाट के तीर देखें।'),
    },
  ],
  reflect: b('Why do farmers call the arrival date of the monsoon the most important calendar event of the year?', 'किसान मानसून के आगमन की तिथि को वर्ष की सबसे महत्त्वपूर्ण घटना क्यों मानते हैं?'),
};

// ================================================================ T03.L5 Flood catchment
export const catchment = {
  id: 'T03.L5',
  objective: b('Test how forests, paved surfaces and check-dams change rainwater infiltration versus flash-flood surface runoff.', 'परखें कि वन, पक्की सड़कें और चेक-डैम वर्षा-जल रिसाव बनाम आकस्मिक बाढ़ अपवाह को कैसे बदलते हैं।'),
  note: { kind: 'schematic', en: 'Mass-conserving water balance: Rain = Infiltration + Check-dam Storage + Surface Runoff.', hi: 'द्रव्यमान-संरक्षी जल बजट: वर्षा = भूमिगत रिसाव + चेक-डैम संचय + सतही अपवाह।' },
  init: () => ({ rain: 140, forest: 45, paved: 25, dams: 2 }),
  controls: [
    { id: 'rain', type: 'slider', label: b('Storm rainfall (mm)', 'तूफ़ानी वर्षा (मिमी)'), min: 20, max: 250, step: 10, fmt: (v) => `${v} mm` },
    { id: 'forest', type: 'slider', label: b('Forest & soil cover', 'वन व मिट्टी आवरण'), min: 0, max: 80, step: 5, fmt: (v) => `${v}%` },
    { id: 'paved', type: 'slider', label: b('Concrete / paved roads', 'कंक्रीट / पक्की सतह'), min: 0, max: 80, step: 5, fmt: (v) => `${v}%` },
    { id: 'dams', type: 'slider', label: b('Check-dams / ponds', 'चेक-डैम / तालाब'), min: 0, max: 5, step: 1 },
  ],
  view(S) {
    const paved = Math.min(S.paved, 100 - S.forest);
    const r = A.catchmentRunoff({ rainMm: S.rain, forestPct: S.forest, pavedPct: paved, checkDams: S.dams });
    const bars = [
      { k: P('Groundwater infiltration', 'भूमिगत रिसाव'), v: r.infiltrated, col: '#146c2e' },
      { k: P('Check-dam storage', 'चेक-डैम संचय'), v: r.damStored, col: '#0b5cad' },
      { k: P('Flood surface runoff', 'बाढ़ सतही अपवाह'), v: r.surfaceRunoff, col: r.floodRisk === 'high' ? '#c0392b' : '#d97706' },
    ];
    let g = `<text class="txt b" x="320" y="24" text-anchor="middle">${esc(P(`Storm total: ${r.rainMm} mm`, `कुल वर्षा: ${r.rainMm} मिमी`))}</text>`;
    bars.forEach((it, i) => {
      const y = 46 + i * 50, w = Math.max(2, (it.v / 250) * 340);
      g += `<text class="txt sm" x="15" y="${y + 18}">${esc(it.k)}</text><rect x="215" y="${y}" width="${w.toFixed(1)}" height="26" rx="4" fill="${it.col}"/><text class="txt sm b" x="${(223 + w).toFixed(1)}" y="${y + 18}">${fmt(it.v, 0)} mm</text>`;
    });
    return {
      svg: `<svg viewBox="0 0 640 205" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Rain ${r.rainMm} mm: ${fmt(r.infiltrated, 0)} mm infiltrated, ${fmt(r.damStored, 0)} mm stored, ${fmt(r.surfaceRunoff, 0)} mm flood runoff`,
      lines: [
        { en: `Budget conserved: ${fmt(r.infiltrated, 0)} mm soaked underground + ${fmt(r.damStored, 0)} mm stored in ponds + ${fmt(r.surfaceRunoff, 0)} mm rushing into drains (${r.floodRisk} flood risk).`, hi: `संरक्षित बजट: ${fmt(r.infiltrated, 0)} मिमी भूमिगत रिसाव + ${fmt(r.damStored, 0)} मिमी तालाब संचय + ${fmt(r.surfaceRunoff, 0)} मिमी तेज़ बाढ़ अपवाह।`, cls: r.floodRisk === 'high' ? 'warn' : 'balanced' },
      ],
    };
  },
  discover: [b('Increase paved concrete from 10% to 75% and watch groundwater soak shrink while flood runoff jumps.', 'कंक्रीट सतह 10% से 75% करें और देखें कैसे भूमिगत रिसाव घटता और बाढ़ अपवाह उछलता है।')],
  predictions: [
    {
      id: 'p1',
      stem: b('If a town paves over gardens and fills village ponds while rainfall stays the same, flood runoff…', 'यदि कोई शहर बगीचों पर कंक्रीट बिछा दे और तालाब पाट दे जबकि वर्षा वही रहे, तो बाढ़ अपवाह…'),
      options: [opt('up', 'Increases sharply and recharges less groundwater', 'तेज़ी से बढ़ता है और भूजल रिसाव घटता है'), opt('dn', 'Disappears completely', 'पूरी तरह समाप्त होता है')],
      run: (S) => { const a = A.catchmentRunoff({ rainMm: 160, forestPct: 50, pavedPct: 10, checkDams: 3 }).surfaceRunoff; S.rain = 160; S.forest = 10; S.paved = 75; S.dams = 0; return A.catchmentRunoff({ rainMm: 160, forestPct: 10, pavedPct: 75, checkDams: 0 }).surfaceRunoff > a ? 'up' : 'dn'; },
      explain: () => b('Paved surfaces block water from soaking in, sending almost every drop straight into streets.', 'पक्की सतहें पानी को भीतर जाने से रोकती हैं, जिससे लगभग हर बूँद सड़कों पर बह निकलती है।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('How do check-dams and forest belts help BOTH floods and dry summers?', 'चेक-डैम और वन पट्टियाँ बाढ़ और गर्मी के सूखे दोनों में कैसे मदद करती हैं?'),
      correct: 'soak',
      options: [
        { id: 'soak', ...b('They slow runoff during storms and soak water into aquifers for dry months.', 'वे तूफ़ान में बहाव धीमा करती हैं और सूखे महीनों के लिए भूजल भरती हैं।') },
        { id: 'evap', ...b('They instantly boil all rain into clouds.', 'वे तुरंत सारा जल उबालकर बादल बना देती हैं।'), why: b('They capture and infiltrate rainwater underground.', 'वे वर्षा जल रोककर धरती में रिसाव बढ़ाती हैं।') },
      ],
      explain: b('Slowing water down reduces peak flood height and replenishes wells.', 'पानी की गति धीमी करने से बाढ़ शिखर घटता है और कुएँ रिचार्ज होते हैं।'),
      hint: b('Move the Check-dams slider to 5.', 'चेक-डैम स्लाइडर को 5 तक ले जाएँ।'),
    },
  ],
  reflect: b('Look around your school or home: where does rainwater go during a heavy downpour?', 'अपने स्कूल या घर के आसपास देखें: तेज़ बारिश में पानी कहाँ जाता है—मिट्टी में या नाली में?'),
};

// ================================================================ T03.L6 Carbon footprint
export const carbonFootprint = {
  id: 'T03.L6',
  objective: b('Calculate household greenhouse emissions across electricity, travel and food, and link emissions to sea-level and glacier risks.', 'बिजली, यात्रा और भोजन से होने वाले उत्सर्जन की गणना करें और इसे समुद्र-स्तर व हिमनद जोखिम से जोड़ें।'),
  note: { kind: 'schematic', en: 'Illustrative annual emission factors (kg CO₂e/yr) for educational comparison.', hi: 'शिक्षण-तुलना हेतु अनुमानित वार्षिक उत्सर्जन गुणांक (किग्रा CO₂e/वर्ष)।' },
  init: () => ({ kwh: 140, car: 40, bus: 50, solar: 20, diet: 'veg' }),
  controls: [
    { id: 'kwh', type: 'slider', label: b('Monthly grid electricity (kWh)', 'मासिक बिजली खपत (यूनिट)'), min: 30, max: 400, step: 10 },
    { id: 'solar', type: 'slider', label: b('Rooftop solar / clean share', 'सौर / स्वच्छ ऊर्जा हिस्सा'), min: 0, max: 100, step: 10, fmt: (v) => `${v}%` },
    { id: 'car', type: 'slider', label: b('Weekly car km', 'साप्ताहिक कार दूरी (किमी)'), min: 0, max: 200, step: 10 },
    { id: 'bus', type: 'slider', label: b('Weekly bus/metro km', 'साप्ताहिक बस/मेट्रो दूरी (किमी)'), min: 0, max: 200, step: 10 },
    { id: 'diet', type: 'chips', label: b('Diet pattern', 'आहार प्रकार'), options: [opt('veg', 'Plant-rich / veg', 'शाकाहारी'), opt('mixed', 'Mixed diet', 'मिश्रित'), opt('highMeat', 'High meat/dairy', 'अधिक मांस-डेयरी')] },
  ],
  view(S) {
    const f = A.carbonFootprint({ electricityKwh: S.kwh, carKm: S.car, busKm: S.bus, diet: S.diet, solarPct: S.solar });
    const items = [
      { k: P('Electricity', 'बिजली'), v: f.electricity, c: '#f59e0b' },
      { k: P('Transport', 'परिवहन'), v: f.transport, c: '#0b5cad' },
      { k: P('Food', 'भोजन'), v: f.food, c: '#2e8b57' },
    ];
    let g = `<text class="txt b" x="320" y="26" text-anchor="middle">${esc(P(`Total: ${fmt(f.total, 0)} kg CO₂e / year`, `कुल: ${fmt(f.total, 0)} किग्रा CO₂e / वर्ष`))}</text>`;
    items.forEach((it, i) => {
      const y = 50 + i * 48, w = Math.min(340, (it.v / 3500) * 340);
      g += `<text class="txt sm" x="15" y="${y + 18}">${esc(it.k)}</text><rect x="180" y="${y}" width="${w.toFixed(1)}" height="26" rx="4" fill="${it.c}"/><text class="txt sm b" x="${(188 + w).toFixed(1)}" y="${y + 18}">${fmt(it.v, 0)} kg</text>`;
    });
    return {
      svg: `<svg viewBox="0 0 640 205" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Annual footprint ${fmt(f.total, 0)} kg CO2e`,
      lines: [
        { en: `Annual total: ${fmt(f.total, 0)} kg CO₂e (${fmt(f.total / 1000, 2)} tonnes). Higher global totals accelerate Himalayan glacier melt, extreme rainfall, and sea-level rise.`, hi: `वार्षिक कुल: ${fmt(f.total, 0)} किग्रा CO₂e (${fmt(f.total / 1000, 2)} टन)। अधिक वैश्विक उत्सर्जन हिमनद पिघलने, अतिवृष्टि और समुद्र-स्तर वृद्धि को तेज़ करता है।`, cls: f.total > 3200 ? 'warn' : 'balanced' },
      ],
    };
  },
  discover: [b('Compare 100 km/week by private car vs 100 km/week by public bus/metro. How big is the transport emission gap?', 'सप्ताह में 100 किमी निजी कार बनाम बस/मेट्रो की तुलना करें। परिवहन उत्सर्जन में कितना अंतर है?')],
  predictions: [
    {
      id: 'p1',
      stem: b('If a household shifts 80% of its electricity to rooftop solar and rides metro instead of car, its annual footprint…', 'यदि एक परिवार 80% बिजली सौर ऊर्जा से ले और कार की जगह मेट्रो अपनाए, तो उसका वार्षिक उत्सर्जन…'),
      options: [opt('drops', 'Drops substantially', 'काफ़ी घटता है'), opt('rises', 'Doubles', 'दोगुना होता है')],
      run: (S) => { const a = A.carbonFootprint({ electricityKwh: 200, carKm: 120, busKm: 0, solarPct: 0 }).total; S.kwh = 200; S.solar = 80; S.car = 0; S.bus = 120; return A.carbonFootprint({ electricityKwh: 200, carKm: 0, busKm: 120, solarPct: 80 }).total < a ? 'drops' : 'rises'; },
      explain: () => b('Clean solar power and shared public transit slash per-person fossil fuel combustion.', 'स्वच्छ सौर ऊर्जा और सार्वजनिक परिवहन प्रति व्यक्ति जीवाश्म ईंधन उत्सर्जन को बहुत घटाते हैं।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('How are rising greenhouse emissions connected to coastal India and Himalayan valleys?', 'बढ़ते ग्रीनहाउस उत्सर्जन का तटीय भारत और हिमालयी घाटियों से क्या संबंध है?'),
      correct: 'warm',
      options: [
        { id: 'warm', ...b('Trapped heat warms oceans (raising sea level) and melts mountain glaciers faster (GLOF & flood risks).', 'रोकी गई ऊष्मा महासागर गर्म करती है (समुद्र स्तर बढ़ता है) और पर्वतीय हिमनद तेज़ी से पिघलाती है।') },
        { id: 'none', ...b('Emissions stay only in cities and never affect oceans or mountains.', 'उत्सर्जन केवल शहरों में रहता है और समुद्र या पहाड़ों को नहीं छूता।'), why: b('Greenhouse gases mix globally through the atmosphere.', 'ग्रीनहाउस गैसें पूरे वायुमंडल में वैश्विक स्तर पर फैलती हैं।') },
      ],
      explain: b('Earth’s atmosphere mixes globally, linking local energy choices to planetary climate hazards.', 'पृथ्वी का वायुमंडल वैश्विक है, जो स्थानीय ऊर्जा चुनावों को वैश्विक जलवायु जोखिमों से जोड़ता है।'),
      hint: b('Read the summary readout line.', 'सारांश पंक्ति पढ़ें।'),
    },
  ],
  reflect: b('Name one realistic change your school or family could make this year to lower electricity or travel emissions.', 'इस वर्ष आपका विद्यालय या परिवार बिजली या यात्रा उत्सर्जन घटाने के लिए कौन-सा एक व्यावहारिक कदम उठा सकता है?'),
};

// ================================================================ T10.L1 Ocean-floor cutaway
export const oceanRelief = {
  id: 'T10.L1',
  objective: b('Identify the main zones of the ocean floor—continental shelf, slope, abyssal plain, mid-ocean ridge and trench—and relate depth to plate processes.', 'महासागर तल के प्रमुख भागों—महाद्वीपीय मग्नतट, ढाल, गहन मैदान, मध्य-महासागरीय कटक और गर्त—की पहचान करें और प्लेट विवर्तनिकी से जोड़ें।'),
  note: { kind: 'schematic', en: 'Vertical scale exaggerated relative to horizontal distance; paired with interactive 3D seafloor slab.', hi: 'क्षैतिज दूरी की तुलना में ऊर्ध्वाधर पैमाना बढ़ाकर दिखाया गया; 3D समुद्र-तल मॉडल के साथ।' },
  init: () => ({ shelfKm: 80, trenchDepth: 8500, ridgeHeight: 2500, waterOpaque: true }),
  controls: [
    { id: 'shelfKm', type: 'slider', label: b('Continental shelf width (km)', 'महाद्वीपीय मग्नतट चौड़ाई (किमी)'), min: 20, max: 200, step: 10 },
    { id: 'ridgeHeight', type: 'slider', label: b('Mid-ocean ridge relief (m)', 'मध्य-महासागरीय कटक ऊँचाई (मी)'), min: 1000, max: 3400, step: 200 },
    { id: 'trenchDepth', type: 'slider', label: b('Ocean trench depth (m)', 'महासागरीय गर्त गहराई (मी)'), min: 5500, max: 11000, step: 250 },
    { id: 'waterOpaque', type: 'toggle', label: b('Tint deep ocean water layer', 'गहरे समुद्री जल परत को रंगें') },
  ],
  view(S) {
    const pts = O.oceanProfile({ shelfKm: S.shelfKm, trenchDepthM: S.trenchDepth, ridgeHeightM: S.ridgeHeight });
    const W = 640, H = 260, X = (x) => 35 + (x / 100) * 580, Y = (d) => 36 + (d / 11500) * 200;
    const polyPts = pts.map((p) => `${X(p.x).toFixed(1)},${Y(p.depthM).toFixed(1)}`).join(' ');
    let g = `<rect fill="${S.waterOpaque ? '#bae6fd' : '#e0f2fe'}" x="35" y="36" width="580" height="205"/>`;
    g += `<polygon points="35,242 ${polyPts} 615,242" fill="#7c5e42" stroke="#3f2e1e" stroke-width="2.5"/>`;
    g += `<text class="txt sm b" x="75" y="28">${esc(P('Shelf', 'मग्नतट'))}</text><text class="txt sm b" x="230" y="135">${esc(P('Abyssal plain', 'गहन मैदान'))}</text><text class="txt sm b" x="${X(52).toFixed(0)}" y="${(Y(3900 - S.ridgeHeight) - 8).toFixed(0)}" text-anchor="middle">${esc(P('Ridge (divergent)', 'कटक (अपसारी)'))}</text><text class="txt sm b" x="${X(78).toFixed(0)}" y="${(Y(S.trenchDepth) + 14).toFixed(0)}" text-anchor="middle" fill="#fff">${esc(P('Trench (subduction)', 'गर्त (अधोगमन)'))}</text>`;
    return {
      svg: `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Ocean floor profile: shelf ${S.shelfKm} km, trench ${S.trenchDepth} m`,
      lines: [
        { en: `Shallow continental shelf (~0–200 m depth, ${S.shelfKm} km wide) holds sunlit fisheries and oil/gas beds; deepest trench reaches ${fmt(S.trenchDepth, 0)} m where a plate subducts.`, hi: `उथला महाद्वीपीय मग्नतट (~0–200 मी गहराई, ${S.shelfKm} किमी चौड़ा) मत्स्य और खनिजों का केंद्र है; सबसे गहरा गर्त ${fmt(S.trenchDepth, 0)} मी तक जाता है जहाँ प्लेट धँसती है।`, cls: 'balanced' },
      ],
    };
  },
  discover: [b('Increase ridge relief and trench depth. Notice how seafloor relief rivals Mount Everest (~8,849 m)!', 'कटक की ऊँचाई और गर्त की गहराई बढ़ाएँ। देखें कि समुद्र-तल का उच्चावच माउंट एवरेस्ट (~8,849 मी) से भी अधिक है!')],
  predictions: [
    {
      id: 'p1',
      stem: b('Which shallow seafloor zone receives sunlight and yields most of the world’s marine fish catch?', 'समुद्र तल के किस उथले भाग में धूप पहुँचती है और सर्वाधिक समुद्री मछलियाँ मिलती हैं?'),
      options: [opt('shelf', 'Continental shelf (< 200 m)', 'महाद्वीपीय मग्नतट (< 200 मी)'), opt('trench', 'Deep ocean trench (> 7,000 m)', 'गहरा महासागरीय गर्त (> 7,000 मी)')],
      run: (S) => { S.shelfKm = 140; return 'shelf'; },
      explain: () => b('Sunlight penetrates ~200 m on the continental shelf, fueling plankton and rich marine food webs.', 'महाद्वीपीय मग्नतट के उथले जल (~200 मी) में सूर्य-प्रकाश पहुँचने से प्लवक और समृद्ध मत्स्य जीवन पनपता है।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Deep ocean trenches form mainly where…', 'गहरे महासागरीय गर्त मुख्यतः कहाँ बनते हैं?'),
      correct: 'sub',
      options: [
        { id: 'sub', ...b('One tectonic plate bends and sinks beneath another (subduction)', 'जहाँ एक विवर्तनिक प्लेट दूसरी के नीचे धँसती है (अधोगमन)') },
        { id: 'river', ...b('Rivers drop delta mud at beaches', 'नदियाँ तटों पर डेल्टा की मिट्टी जमा करती हैं'), why: b('Deltas build shallow shelves; trenches mark deep subduction zones.', 'डेल्टा उथले तट बनाते हैं; गर्त गहरे अधोगमन क्षेत्रों में बनते हैं।') },
      ],
      explain: b('Trenches mark convergent subduction boundaries; mid-ocean ridges mark divergent spreading centres.', 'गर्त अभिसारी अधोगमन सीमाओं पर तथा मध्य-महासागरीय कटक अपसारी सीमाओं पर बनते हैं।'),
      hint: b('Look at the labels on the trench and ridge.', 'गर्त और कटक के नाम देखें।'),
    },
  ],
  reflect: b('Why is the ocean floor just as mountainous and varied as the continents above sea level?', 'समुद्र का तल महाद्वीपों जितना ही ऊँचा-नीचा और विविध क्यों है?'),
};

// ================================================================ T10.L3 Marine resources & fisheries
export const fisheries = {
  id: 'T10.L3',
  objective: b('Balance fishing fleet size, net mesh rules, closed spawning seasons and mangrove nurseries to sustain coastal livelihoods.', 'तटीय आजीविका टिकाए रखने के लिए नावों की संख्या, जाल के आकार, प्रजनन-काल बंद और मैंग्रोव संरक्षण का संतुलन समझें।'),
  note: { kind: 'schematic', en: '25-year coastal fish-stock simulation combining logistic growth and mangrove nursery capacity.', hi: 'लॉजिस्टिक वृद्धि व मैंग्रोव नर्सरी क्षमता पर आधारित 25-वर्षीय तटीय मत्स्य मॉडल।' },
  init: () => ({ boats: 45, mesh: 45, closed: 2, mangrove: 60 }),
  controls: [
    { id: 'boats', type: 'slider', label: b('Fishing boats', 'मछली पकड़ने की नावें'), min: 15, max: 120, step: 5 },
    { id: 'mesh', type: 'slider', label: b('Net mesh size (mm)', 'जाल का छेद (मिमी)'), min: 20, max: 70, step: 5, hint: b('Small mesh catches juvenile fish before they breed.', 'छोटे छेद युवा मछलियाँ भी पकड़ लेते हैं।') },
    { id: 'closed', type: 'slider', label: b('Monsoon closed months', 'मानसून प्रजनन-बंद (महीने)'), min: 0, max: 4, step: 1 },
    { id: 'mangrove', type: 'slider', label: b('Coastal mangrove cover', 'तटीय मैंग्रोव आवरण'), min: 10, max: 100, step: 10, fmt: (v) => `${v}%` },
  ],
  view(S) {
    const r = O.fisheryRun({ boats: S.boats, meshMm: S.mesh, closedMonths: S.closed, mangrovePct: S.mangrove, years: 25 });
    const ch = new Chart({ xMax: 25, yMax: 1100, xLabel: P('Years', 'वर्ष'), yLabel: P('Fish stock', 'मत्स्य भंडार'), xTicks: 5, yTicks: 5 });
    ch.axes();
    ch.hline(r.K * 0.3, 'guide', 0, 25);
    ch.line(r.series.map((v, y) => [y, v]), r.sustainable ? 'curve g' : 'curve d');
    return {
      svg: ch.html({ label: P('25-year coastal fish stock', '25 वर्षों में तटीय मत्स्य भंडार') }),
      aria: `Final fish stock ${fmt(r.finalStock, 0)}, total catch ${fmt(r.totalCatch, 0)}`,
      lines: [
        r.sustainable
          ? { en: `Sustainable fishery: after 25 years stock stays healthy at ${fmt(r.finalStock, 0)}, yielding ${fmt(r.totalCatch, 0)} total catch.`, hi: `टिकाऊ मत्स्यन: 25 वर्षों बाद भंडार ${fmt(r.finalStock, 0)} पर सुरक्षित, कुल उपज ${fmt(r.totalCatch, 0)}।`, cls: 'balanced' }
          : { en: `Depleted stock (${fmt(r.finalStock, 0)} remaining): overfishing + fine nets or mangrove loss reduce future fisher incomes!`, hi: `क्षीण भंडार (केवल ${fmt(r.finalStock, 0)} शेष): अति-मत्स्यन व महीन जाल भविष्य की आजीविका घटाते हैं!`, cls: 'warn' },
      ],
    };
  },
  discover: [b('Compare 20 mm fine nets with 55 mm nets at 80 boats. Why do fisher cooperatives enforce minimum mesh sizes?', '80 नावों पर 20 मिमी महीन जाल और 55 मिमी जाल की तुलना करें। मछुआरा समितियाँ न्यूनतम जाल आकार क्यों लागू करती हैं?')],
  predictions: [
    {
      id: 'p1',
      stem: b('When coastal mangroves are cleared (down to 10%) and 100 boats fish year-round with tiny 20 mm nets, fish stocks…', 'जब तटीय मैंग्रोव कट जाएँ (10%) और 100 नावें साल भर 20 मिमी के छोटे जाल से मछली पकड़ें, तो भंडार…'),
      options: [opt('crash', 'Collapse sharply, hurting future fisher livelihoods', 'तेज़ी से गिरता है जिससे भविष्य की आजीविका संकट में पड़ती है'), opt('boom', 'Grow faster forever', 'हमेशा बढ़ता रहता है')],
      run: (S) => { S.mangrove = 10; S.boats = 100; S.mesh = 20; S.closed = 0; return O.fisheryRun({ boats: 100, meshMm: 20, closedMonths: 0, mangrovePct: 10 }).sustainable ? 'boom' : 'crash'; },
      explain: () => b('Destroying nurseries and catching juveniles breaks reproduction, collapsing the catch.', 'नर्सरी नष्ट होने और छोटी मछलियों के पकड़े जाने से प्रजनन चक्र टूट जाता है।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why do coastal states enforce a seasonal fishing ban during monsoon breeding months?', 'तटीय राज्य मानसून प्रजनन महीनों में मछली पकड़ने पर अस्थायी रोक क्यों लगाते हैं?'),
      correct: 'breed',
      options: [
        { id: 'breed', ...b('To let adult fish spawn and young fish grow so catches remain steady all year.', 'ताकि बड़ी मछलियाँ अंडे दे सकें और छोटी बढ़ सकें, जिससे वर्ष भर उपज बनी रहे।') },
        { id: 'salt', ...b('Because seawater loses its salt in monsoon.', 'क्योंकि मानसून में समुद्र का नमक गायब हो जाता है।'), why: b('Closed seasons protect spawning stock and rough-weather safety.', 'बंद ऋतु प्रजनन भंडार और नाविक सुरक्षा के लिए होती है।') },
      ],
      explain: b('Resting the sea during spawning safeguards long-term livelihoods.', 'प्रजनन काल में विराम दीर्घकालिक आजीविका की रक्षा करता है।'),
      hint: b('Move the Monsoon closed months slider from 0 to 3.', 'मानसून बंद महीने स्लाइडर को 0 से 3 पर ले जाएँ।'),
    },
  ],
  reflect: b('Give one reason why restoring mangroves helps coastal fishing villages both ecologically and economically.', 'मैंग्रोव पुनर्बहाली तटीय मछुआरा गाँवों की पारिस्थितिक और आर्थिक दोनों तरह से मदद कैसे करती है?'),
};

// ================================================================ T10.L5 Maritime cooperation concept map
const MAR_NODES = [
  { id: 'ocean', label: b('Shared Ocean Commons', 'साझा महासागर'), rw: 145, stroke: '#0b5cad' },
  { id: 'trade', label: b('Sea Lanes & Ports', 'समुद्री मार्ग व बंदरगाह'), rw: 130, stroke: '#146c2e' },
  { id: 'rescue', label: b('Cyclone & Tsunami Alerts', 'चक्रवात-सुनामी चेतावनी'), rw: 152, stroke: '#c0392b' },
  { id: 'law', label: b('UNCLOS Maritime Law', 'समुद्री कानून (UNCLOS)'), rw: 145, stroke: '#7b3fa0' },
  { id: 'blue', label: b('Blue Economy & Reefs', 'नीली अर्थव्यवस्था व प्रवाल'), rw: 148, stroke: '#0284c7' },
];
const MAR_LINKS = [
  { source: 'ocean', target: 'law', label: b('sets zones (EEZ)', 'सीमा तय') },
  { source: 'law', target: 'trade', label: b('safe passage', 'सुरक्षित मार्ग') },
  { source: 'ocean', target: 'rescue', label: b('shared buoys', 'साझा सेंसर') },
  { source: 'blue', target: 'ocean', label: b('clean reefs', 'स्वच्छ रीफ') },
  { source: 'trade', target: 'blue', label: b('green shipping', 'हरित पोत') },
];

export const maritimeCoop = {
  id: 'T10.L5',
  objective: b('Map why nations cooperate on maritime trade, cyclone/tsunami warning, coral conservation and ocean law.', 'समझें कि समुद्री व्यापार, आपदा चेतावनी, प्रवाल संरक्षण और समुद्री कानून पर अंतर्राष्ट्रीय सहयोग क्यों आवश्यक है।'),
  note: { kind: 'documented', en: 'Force-directed network (d3-force) of maritime commons governance under UNCLOS principles.', hi: 'UNCLOS सिद्धांतों पर आधारित समुद्री साझा संसाधन तंत्र (d3-force)।' },
  init: () => ({ focus: 'law' }),
  controls: [{ id: 'focus', type: 'chips', label: b('Focus pillar', 'स्तंभ चुनें'), options: MAR_NODES.map((n) => ({ id: n.id, ...n.label })) }],
  view(S) {
    const svg = forceGraphSvg({ w: 640, h: 320, nodes: MAR_NODES, links: MAR_LINKS, activeId: S.focus, aria: 'Maritime cooperation concept network' });
    const desc = {
      ocean: b('No single country owns the high seas; fish stocks, plastic waste, and currents cross every border.', 'खुले महासागर का स्वामी कोई एक देश नहीं; मछलियाँ, धाराएँ और प्रदूषण सभी सीमाएँ पार करते हैं।'),
      trade: b('Over 80% of global goods by volume travel by ship through shared straits like Malacca, Hormuz, and Indian Ocean lanes.', 'विश्व का 80% से अधिक माल साझा समुद्री जलडमरूमध्यों से जहाजों द्वारा जाता है।'),
      rescue: b('Indian Ocean tsunami warning buoys share real-time seismic data across coastal countries within minutes.', 'हिंद महासागर सुनामी चेतावनी केंद्र मिनटों में सभी तटीय देशों को साझा संकेत भेजते हैं।'),
      law: b('UNCLOS defines 12-nautical-mile Territorial Sea, 200-nm Exclusive Economic Zone (EEZ), and freedom of high-seas navigation.', 'UNCLOS 12 नॉटिकल मील प्रादेशिक सागर और 200 नॉटिकल मील अनन्य आर्थिक क्षेत्र (EEZ) तय करता है।'),
      blue: b('Sustainable fisheries, coral restoration, and marine protected areas guard ocean food security.', 'टिकाऊ मत्स्यन और समुद्री संरक्षित क्षेत्र महासागरीय खाद्य सुरक्षा बचाते हैं।'),
    };
    return { svg, aria: `Maritime cooperation node ${S.focus}`, lines: [desc[S.focus]] };
  },
  discover: [b('Select UNCLOS Maritime Law, then Cyclone Alerts. Why can neither work without cross-border sharing?', 'समुद्री कानून और फिर आपदा चेतावनी चुनें। दोनों सीमा-पार सहयोग के बिना क्यों अधूरे हैं?')],
  predictions: [
    {
      id: 'p1',
      stem: b('Under UNCLOS, a coastal nation’s Exclusive Economic Zone (EEZ) for fisheries and seabed resources extends up to…', 'UNCLOS के तहत मछली व समुद्री संसाधनों के लिए अनन्य आर्थिक क्षेत्र (EEZ) तट से कितनी दूर तक होता है?'),
      options: [opt('200', '200 nautical miles', '200 नॉटिकल मील'), opt('2', '2 nautical miles', '2 नॉटिकल मील')],
      run: (S) => { S.focus = 'law'; return '200'; },
      explain: () => b('UNCLOS sets a 12-nm territorial sea and a 200-nm EEZ while keeping the open high seas shared by all.', 'UNCLOS 12 नॉटिकल मील प्रादेशिक समुद्र व 200 नॉटिकल मील EEZ तय करता है और खुले समुद्र को साझा रखता है।'),
    },
  ],
  exit: [
    {
      id: 'e1',
      stem: b('Why must tsunami warning networks in the Indian Ocean be international rather than single-country?', 'हिंद महासागर में सुनामी चेतावनी नेटवर्क किसी एक देश के बजाय अंतर्राष्ट्रीय क्यों होना चाहिए?'),
      correct: 'cross',
      options: [
        { id: 'cross', ...b('An undersea earthquake off one coast sends waves across the whole basin at 700+ km/h.', 'एक तट पर आया भूकंप 700+ किमी/घं से पूरे महासागर में लहरें भेजता है।') },
        { id: 'stop', ...b('Tsunamis stop at maritime borders.', 'सुनामी समुद्री सीमाओं पर रुक जाती हैं।'), why: b('Ocean waves ignore political borders.', 'महासागरीय लहरें राजनीतिक सीमाएँ नहीं मानतीं।') },
      ],
      explain: b('Deep-ocean sensors near Sumatra or Makran give coastal neighbours across the Indian Ocean crucial warning minutes.', 'सुमात्रा या मकरान के गहरे समुद्री सेंसर पूरे हिंद महासागर के पड़ोसियों को बचाव का समय देते हैं।'),
      hint: b('Click Cyclone & Tsunami Alerts on the network.', 'नेटवर्क पर चक्रवात-सुनामी चेतावनी चुनें।'),
    },
  ],
  reflect: b('Give one example of how the Indian Ocean connects India with neighbouring island and coastal nations.', 'एक उदाहरण दें कि हिंद महासागर भारत को पड़ोसी द्वीपीय व तटीय देशों से कैसे जोड़ता है।'),
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
      svg,
      aria: `${res.en} — ${res.species.en}`,
      lines: [
        { en: `${res.en} · Key species: ${res.species.en}.`, hi: `${res.hi} · प्रमुख प्रजातियाँ: ${res.species.hi}।`, cls: 'balanced' },
        zInfo,
      ],
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
  sacred: { en: 'Sacred Groves (Devrai / Kavu / Oran)', hi: 'पवित्र उपवन (देवराई / कावु / ओरान)', place: b('Maharashtra, Kerala, Rajasthan, Meghalaya', 'महाराष्ट्र, केरल, राजस्थान, मेघालय'), desc: b('Community-protected forest patches dedicated to local deities where cutting trees is forbidden — preserving rare medicinal plants and spring water.', 'स्थानीय देवों को समर्पित समुदाय-संरक्षित वन-खंड जहाँ कटाई वर्जित है — दुर्लभ औषधीय पौधों और झरनों की रक्षा होती है।') },
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
    const svg = `<svg viewBox="0 0 640 190" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="16" width="608" height="158" rx="12" fill="var(--ok-bg)" stroke="var(--ok)" stroke-width="2"/><circle cx="88" cy="95" r="42" fill="#146c2e"/><circle cx="72" cy="85" r="24" fill="#2e8b57"/><circle cx="105" cy="90" r="22" fill="#4fa36a"/><rect x="83" y="110" width="10" height="32" fill="#6b4423"/><text class="txt b" x="155" y="64">${esc(P(it.en, it.hi))}</text><text class="txt sm" x="155" y="92">${esc(P(it.place.en, it.place.hi))}</text><text class="txt sm mut" x="155" y="124">${esc(P('Stewardship by shared cultural rules & local memory', 'साझा सांस्कृतिक नियमों व स्थानीय स्मृति द्वारा संरक्षण'))}</text></svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t11-grove.jpg',
        en: 'Community-protected sacred grove beside a village johad water tank and blackbuck habitat.',
        hi: 'ग्रामीण जोहड़ जल-कुंड व काले हिरण आवास के किनारे समुदाय-संरक्षित पवित्र उपवन।',
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
