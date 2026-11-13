// T03 Atmosphere and climate, T10 Oceans, T11 Ecosystems: lab specs over the atmosphere, ocean and ecosystem engines.
import { Chart } from '../../engines/chart.js';
import * as A from '../../engines/domain/atmosphere.js';
import * as O from '../../engines/domain/ocean.js';
import * as Eco from '../../engines/domain/ecosystem.js';
import { fmt, esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';
const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi) => ({ id, en, hi });
const LAYER = { troposphere: b('Troposphere', 'क्षोभमंडल'), stratosphere: b('Stratosphere', 'समतापमंडल'), mesosphere: b('Mesosphere', 'मध्यमंडल'), thermosphere: b('Thermosphere', 'तापमंडल') };
const LAYER_NOTE = {
  troposphere: b('Weather happens here; air is densest and temperature falls with height.', 'मौसम यहीं बनता है; वायु सबसे सघन है और ऊँचाई के साथ तापमान घटता है।'),
  stratosphere: b('Contains the ozone layer that absorbs harmful ultraviolet rays; temperature rises with height.', 'इसमें ओज़ोन परत है जो हानिकारक पराबैंगनी किरणें सोखती है; ऊँचाई के साथ तापमान बढ़ता है।'),
  mesosphere: b('Meteors burn up here; the coldest part of the atmosphere.', 'उल्काएँ यहाँ जल जाती हैं; वायुमंडल का सबसे ठंडा भाग।'),
  thermosphere: b('Very thin air; temperature is very high but there is too little air to feel hot. Auroras occur here.', 'वायु बहुत विरल; तापमान बहुत ऊँचा पर इतनी कम वायु कि गर्मी महसूस नहीं होती। ध्रुवीय ज्योति यहीं होती है।'),
};
// ---------------------------------------------------------------- T03.L1 atmosphere cutaway
export const cutaway = {
  id: 'T03.L1',
  objective: b('Describe the layers of the atmosphere and show how temperature, air pressure and the amount of air change with altitude.', 'वायुमंडल की परतों का वर्णन करें और दिखाएँ कि ऊँचाई के साथ तापमान, वायुदाब और वायु की मात्रा कैसे बदलती है।'),
  note: { kind: 'documented', en: 'Follows the International Standard Atmosphere (1976); layer boundaries are rounded averages that vary with latitude and season.', hi: 'अंतर्राष्ट्रीय मानक वायुमंडल (1976) के अनुसार; परतों की सीमाएँ पूर्णांकित औसत हैं जो अक्षांश और ऋतु के साथ बदलती हैं।' },
  init: () => ({ alt: 0 }),
  controls: [{ id: 'alt', type: 'slider', label: b('Altitude (km)', 'ऊँचाई (किमी)'), min: 0, max: 100, step: 0.5, fmt: (v) => `${fmt(v, 1)} km` }],
  view(S) {
    const W = 640, H = 420, x0 = 90, x1 = 600, yTop = 20, yBot = 380, Y = (km) => yBot - (Math.min(km, 100) / 100) * (yBot - yTop);
    const TX = (c) => x0 + ((c + 100) / 130) * (x1 - x0);
    const cols = { troposphere: 'layer-t', stratosphere: 'layer-s', mesosphere: 'layer-m', thermosphere: 'layer-h' };
    let g = '';
    for (const l of A.LAYERS) { const a = Math.min(l.from, 100), z = Math.min(l.to, 100); if (a >= 100) continue; g += `<rect class="${cols[l.id]}" x="${x0}" y="${Y(z)}" width="${x1 - x0}" height="${Y(a) - Y(z)}"/><text class="txt b" x="${x1 - 6}" y="${Y(z) + 16}" text-anchor="end">${esc(P(LAYER[l.id].en, LAYER[l.id].hi))}</text>`; }
    let d = ''; for (let km = 0; km <= 100; km += 1) d += `${km ? 'L' : 'M'}${TX(A.temperatureC(km)).toFixed(1)},${Y(km).toFixed(1)}`;
    g += `<path class="curve d" d="${d}" fill="none" stroke-width="4"/>`;
    for (const t of [-100, -50, 0, 15]) g += `<text class="txt sm mut" x="${TX(t)}" y="${yBot + 16}" text-anchor="middle">${t}°C</text><line class="grid" x1="${TX(t)}" x2="${TX(t)}" y1="${yTop}" y2="${yBot}"/>`;
    for (const km of [0, 12, 50, 85]) g += `<text class="txt sm mut" x="${x0 - 8}" y="${Y(km) + 4}" text-anchor="end">${km} km</text>`;
    const T = A.temperatureC(S.alt);
    g += `<line class="guide" x1="${x0}" x2="${x1}" y1="${Y(S.alt)}" y2="${Y(S.alt)}"/><circle class="probe-dot" cx="${TX(T)}" cy="${Y(S.alt)}" r="8"/>`;
    g += `<text class="txt sm b" x="${(x0 + x1) / 2}" y="${H - 6}" text-anchor="middle">${esc(P('Temperature (°C) — red line', 'तापमान (°C) — लाल रेखा'))}</text>`;
    const l = A.layerAt(S.alt), pr = A.pressureHPa(S.alt), mass = A.massBelow(S.alt) * 100;
    return {
      svg: `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`, aria: `Atmosphere at ${S.alt} km: ${l.id}, ${fmt(T, 0)} degrees Celsius, ${fmt(pr, 0)} hectopascals.`,
      lines: [
        { en: `At ${fmt(S.alt, 1)} km you are in the ${LAYER[l.id].en}. Temperature ${fmt(T, 0)} °C, pressure ${pr >= 10 ? fmt(pr, 0) : fmt(pr, 2)} hPa (sea level = 1013 hPa).`, hi: `${fmt(S.alt, 1)} किमी पर आप ${LAYER[l.id].hi} में हैं। तापमान ${fmt(T, 0)} °C, दाब ${pr >= 10 ? fmt(pr, 0) : fmt(pr, 2)} hPa (समुद्र तल = 1013 hPa)।` },
        { en: `${fmt(mass, 0)}% of all the air in the atmosphere lies BELOW you.`, hi: `वायुमंडल की कुल वायु का ${fmt(mass, 0)}% आपके नीचे है।` },
        LAYER_NOTE[l.id],
        { en: 'Dry air: nitrogen 78%, oxygen 21%, argon 0.9%, carbon dioxide about 0.04%.', hi: 'शुष्क वायु: नाइट्रोजन 78%, ऑक्सीजन 21%, आर्गन 0.9%, कार्बन डाइऑक्साइड लगभग 0.04%।', cls: 'note' },
      ],
    };
  },
  discover: [b('Slide to 8.8 km (the height of Mount Everest). How much of sea-level pressure is left?', '8.8 किमी (माउंट एवरेस्ट की ऊँचाई) तक खिसकाएँ। समुद्र तल के दाब का कितना भाग बचा है?'), b('Find the altitude where the temperature stops falling. What is the name of the layer above it?', 'वह ऊँचाई खोजें जहाँ तापमान गिरना बंद हो जाता है। उसके ऊपर की परत का नाम क्या है?'), b('Which layer has its temperature rising with height, and why does that matter for life on Earth (ozone)?', 'किस परत में ऊँचाई के साथ तापमान बढ़ता है, और पृथ्वी के जीवन के लिए यह क्यों महत्त्वपूर्ण है (ओज़ोन)?')],
  predictions: [
    { id: 'p1', stem: b('On top of Mount Everest (8.8 km) the air pressure is about…', 'माउंट एवरेस्ट की चोटी (8.8 किमी) पर वायुदाब लगभग…'), options: [opt('half', 'Half of sea level', 'समुद्र तल का आधा'), opt('third', 'One third of sea level', 'समुद्र तल का एक तिहाई'), opt('tenth', 'One tenth of sea level', 'समुद्र तल का दसवाँ भाग')],
      run: (S) => { S.alt = 8.8; const r = A.pressureHPa(8.8) / 1013.25; return r > 0.42 ? 'half' : r > 0.2 ? 'third' : 'tenth'; },
      explain: () => ({ en: `Air is squeezed by the weight above it, so it thins quickly: only ${fmt((A.pressureHPa(8.8) / 1013.25) * 100, 0)}% of sea-level pressure remains. That is why climbers need extra oxygen.`, hi: `वायु ऊपर की वायु के भार से दबी रहती है, इसलिए वह तेज़ी से विरल होती है: समुद्र तल के दाब का केवल ${fmt((A.pressureHPa(8.8) / 1013.25) * 100, 0)}% बचता है। इसीलिए पर्वतारोहियों को अतिरिक्त ऑक्सीजन चाहिए।` }) },
    { id: 'p2', stem: b('Where is most of the mass of the atmosphere?', 'वायुमंडल का अधिकांश द्रव्यमान कहाँ है?'), options: [opt('troposphere', 'In the lowest layer, the troposphere', 'सबसे निचली परत, क्षोभमंडल में'), opt('stratosphere', 'Mostly in the stratosphere', 'अधिकतर समतापमंडल में'), opt('even', 'Spread evenly up to 100 km', '100 किमी तक समान रूप से फैला')],
      run: (S) => { S.alt = 12; return A.massBelow(12) > 0.75 ? 'troposphere' : 'even'; },
      explain: () => ({ en: `About ${fmt(A.massBelow(12) * 100, 0)}% of the air is below 12 km, in the thin lowest layer.`, hi: `लगभग ${fmt(A.massBelow(12) * 100, 0)}% वायु 12 किमी से नीचे, पतली सबसे निचली परत में है।` }) },
  ],
  exit: [{ id: 'e1', stem: b('Why do most weather events such as clouds and rain occur in the troposphere?', 'बादल और वर्षा जैसी अधिकांश मौसमी घटनाएँ क्षोभमंडल में क्यों होती हैं?'), correct: 'a', options: [
    { id: 'a', ...b('It holds most of the air and almost all the water vapour, and warm air can rise and cool there.', 'इसमें अधिकांश वायु और लगभग सारा जलवाष्प है, और यहाँ गर्म हवा उठकर ठंडी हो सकती है।') },
    { id: 'b', ...b('It is the layer closest to the Sun.', 'यह सूर्य के सबसे निकट की परत है।'), why: b('The Sun is far away; being 12 km higher makes no real difference. The reason is the air and water vapour it holds.', 'सूर्य बहुत दूर है; 12 किमी ऊँचाई से कोई वास्तविक अंतर नहीं पड़ता। कारण इसमें मौजूद वायु और जलवाष्प है।') }],
    explain: b('Almost all water vapour and most of the air are in the troposphere, where rising air cools and forms clouds.', 'लगभग सारा जलवाष्प और अधिकांश वायु क्षोभमंडल में है, जहाँ उठती हवा ठंडी होकर बादल बनाती है।'), hint: b('Look at the mass-below readout at 12 km.', '12 किमी पर "नीचे की वायु" का आँकड़ा देखें।') }],
  reflect: b('How would a mountaineer’s body feel the changes you saw as altitude increases? Write two sentences.', 'ऊँचाई बढ़ने पर आपने जो बदलाव देखे, उन्हें पर्वतारोही का शरीर कैसे महसूस करेगा? दो वाक्य लिखें।'),
};
// ---------------------------------------------------------------- T03.L4 land-sea breeze
const hourLabel = (h) => `${String(Math.floor(h) % 24).padStart(2, '0')}:00`;
export const breeze = {
  id: 'T03.L4',
  objective: b('Explain why the wind near a coast reverses between day and night using the different heating of land and sea.', 'भूमि और समुद्र के असमान तापन के आधार पर समझाएँ कि तट के पास हवा दिन और रात में क्यों उलट जाती है।'),
  note: { kind: 'schematic', en: 'Temperatures and wind speeds are illustrative values for a warm coastal place.', hi: 'तापमान और हवा की गति किसी गर्म तटीय स्थान के लिए उदाहरण-मान हैं।' },
  init: () => ({ hour: 15, cloud: 0, mean: 28 }),
  controls: [
    { id: 'hour', type: 'slider', label: b('Time of day', 'दिन का समय'), min: 0, max: 23, step: 1, fmt: hourLabel },
    { id: 'cloud', type: 'slider', label: b('Cloud cover', 'बादल आवरण'), min: 0, max: 1, step: 0.1, fmt: (v) => `${Math.round(v * 100)}%`, hint: b('Clouds block sunlight, so the land heats less by day.', 'बादल धूप रोकते हैं, इसलिए दिन में भूमि कम गर्म होती है।') },
  ],
  view(S) {
    const cur = A.localWind({ hour: S.hour, mean: S.mean, cloud: S.cloud });
    const ch = new Chart({ xMax: 24, yMax: 40, yMin: 15, xLabel: P('Hour of the day', 'दिन का घंटा'), yLabel: P('Temperature (°C)', 'तापमान (°C)'), xTicks: 6, yTicks: 5 });
    ch.axes();
    const L = [], Sx = []; for (let hh = 0; hh <= 24; hh++) { const w = A.localWind({ hour: hh % 24, mean: S.mean, cloud: S.cloud }); L.push([hh, w.land]); Sx.push([hh, w.sea]); }
    ch.line(L, 'curve d'); ch.line(Sx, 'curve s'); ch.vline(S.hour, 'guide'); ch.dot(S.hour, cur.land, 'pt d', 6); ch.dot(S.hour, cur.sea, 'pt s', 6);
    ch.text(1, 38, P('Land', 'भूमि'), 'curve-lbl d', 'start'); ch.text(1, 35, P('Sea', 'समुद्र'), 'curve-lbl s', 'start');
    const dir = cur.kind === 'sea-breeze' ? 1 : cur.kind === 'land-breeze' ? -1 : 0, ax = 322, ay = 330, ln = 20 + cur.speed * 6;
    const arrow = dir ? `<line class="edge" style="stroke:var(--pri);stroke-width:5" x1="${ax - dir * ln}" y1="${ay}" x2="${ax + dir * ln}" y2="${ay}"/><path d="M${ax + dir * ln},${ay} l${-dir * 12},-8 l0,16 z" fill="var(--pri)"/>` : '';
    const diagram = `<svg viewBox="0 0 640 110" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><rect class="sea-fill" x="0" y="40" width="320" height="70"/><rect class="land-fill" x="320" y="40" width="320" height="70"/><text class="txt b" x="160" y="95" text-anchor="middle">${esc(P('Sea', 'समुद्र'))} ${fmt(cur.sea, 0)}°C</text><text class="txt b" x="480" y="95" text-anchor="middle">${esc(P('Land', 'भूमि'))} ${fmt(cur.land, 0)}°C</text>${dir ? `<line x1="${320 - dir * 110}" y1="24" x2="${320 + dir * 110}" y2="24" stroke="var(--pri)" stroke-width="5"/><path d="M${320 + dir * 110},24 l${-dir * 12},-8 l0,16 z" fill="var(--pri)"/>` : ''}<text class="txt sm" x="320" y="12" text-anchor="middle">${esc(cur.kind === 'sea-breeze' ? P('Sea breeze (surface wind from sea)', 'समुद्री समीर (सतह पर समुद्र से आती हवा)') : cur.kind === 'land-breeze' ? P('Land breeze (surface wind from land)', 'स्थलीय समीर (सतह पर भूमि से आती हवा)') : P('Calm', 'शांत'))}</text></svg>`;
    return {
      svg: diagram + ch.html({ label: P('Land and sea temperature through the day', 'दिनभर भूमि और समुद्र का तापमान') }), aria: `At ${hourLabel(S.hour)} land ${fmt(cur.land, 0)} degrees, sea ${fmt(cur.sea, 0)} degrees: ${cur.kind}.`,
      lines: [
        { en: `At ${hourLabel(S.hour)} the land is ${fmt(cur.land, 0)} °C and the sea ${fmt(cur.sea, 0)} °C.`, hi: `${hourLabel(S.hour)} बजे भूमि ${fmt(cur.land, 0)} °C और समुद्र ${fmt(cur.sea, 0)} °C है।` },
        cur.kind === 'sea-breeze' ? { en: 'Warm land air rises, pressure falls over land, so cooler sea air flows inland: a SEA BREEZE.', hi: 'भूमि की गर्म हवा उठती है, भूमि पर दाब घटता है, इसलिए समुद्र की ठंडी हवा भीतर बहती है: समुद्री समीर।', cls: 'balanced' }
          : cur.kind === 'land-breeze' ? { en: 'At night the land cools faster, so air over the warmer sea rises and cool land air flows out to sea: a LAND BREEZE.', hi: 'रात में भूमि जल्दी ठंडी होती है, इसलिए गर्म समुद्र की हवा उठती है और भूमि की ठंडी हवा समुद्र की ओर बहती है: स्थलीय समीर।', cls: 'balanced' }
            : { en: 'Land and sea are almost equally warm, so there is little pressure difference and little wind.', hi: 'भूमि और समुद्र लगभग समान गर्म हैं, इसलिए दाब-अंतर और हवा बहुत कम है।' },
        { en: `Temperature difference ${fmt(Math.abs(cur.dT), 1)} °C → wind about ${fmt(cur.speed, 0)} m/s.`, hi: `तापमान-अंतर ${fmt(Math.abs(cur.dT), 1)} °C → हवा लगभग ${fmt(cur.speed, 0)} मी/से।`, cls: 'note' },
      ],
    };
  },
  discover: [b('Move the time from 3 am to 3 pm. Watch the two temperature lines cross. What happens to the wind direction?', 'समय को रात 3 बजे से दोपहर 3 बजे तक ले जाएँ। दोनों तापमान-रेखाओं को एक-दूसरे को काटते देखें। हवा की दिशा का क्या होता है?'), b('Increase cloud cover to 100% at 3 pm. Why does the sea breeze weaken?', 'दोपहर 3 बजे बादल आवरण 100% करें। समुद्री समीर क्यों कमज़ोर होती है?')],
  predictions: [
    { id: 'p1', stem: b('At 3 pm on a sunny day, the surface wind at the coast blows…', 'धूप वाले दिन दोपहर 3 बजे तट पर सतही हवा बहती है…'), options: [opt('sea', 'From the sea towards the land', 'समुद्र से भूमि की ओर'), opt('land', 'From the land towards the sea', 'भूमि से समुद्र की ओर')],
      run: (S) => { S.hour = 15; S.cloud = 0; return A.localWind({ hour: 15 }).kind === 'sea-breeze' ? 'sea' : 'land'; }, explain: () => ({ en: 'Land is hotter than the sea in the afternoon, so air rises over land and cooler sea air moves in.', hi: 'दोपहर में भूमि समुद्र से अधिक गर्म होती है, इसलिए भूमि पर हवा उठती है और समुद्र की ठंडी हवा भीतर आती है।' }) },
    { id: 'p2', stem: b('At 2 am the surface wind at the coast blows…', 'रात 2 बजे तट पर सतही हवा बहती है…'), options: [opt('sea', 'From the sea towards the land', 'समुद्र से भूमि की ओर'), opt('land', 'From the land towards the sea', 'भूमि से समुद्र की ओर')],
      run: (S) => { S.hour = 2; S.cloud = 0; return A.localWind({ hour: 2 }).kind === 'land-breeze' ? 'land' : 'sea'; }, explain: () => ({ en: 'The land loses heat quickly after sunset and becomes cooler than the sea, so the wind reverses.', hi: 'सूर्यास्त के बाद भूमि जल्दी ऊष्मा खोकर समुद्र से ठंडी हो जाती है, इसलिए हवा उलट जाती है।' }) },
  ],
  exit: [{ id: 'e1', stem: b('Why does land heat up and cool down faster than the sea?', 'भूमि समुद्र की तुलना में जल्दी गर्म और ठंडी क्यों होती है?'), correct: 'a', options: [
    { id: 'a', ...b('Water takes much more heat to warm up and mixes the heat downwards, so it changes temperature slowly.', 'जल को गर्म होने में बहुत अधिक ऊष्मा चाहिए और वह ऊष्मा को नीचे तक मिला देता है, इसलिए उसका तापमान धीरे बदलता है।') },
    { id: 'b', ...b('The Sun shines only on the land.', 'सूर्य केवल भूमि पर चमकता है।'), why: b('Sunlight falls on both; the difference is in how each one stores and spreads heat.', 'धूप दोनों पर पड़ती है; अंतर यह है कि दोनों ऊष्मा को कैसे संचित और वितरित करते हैं।') }],
    explain: b('Water has a high heat capacity and its currents spread heat, so the sea changes temperature far more slowly than land.', 'जल की ऊष्माधारिता अधिक होती है और उसकी धाराएँ ऊष्मा फैलाती हैं, इसलिए समुद्र का तापमान भूमि से बहुत धीमे बदलता है।'), hint: b('Compare how wide the two temperature curves swing.', 'दोनों तापमान-वक्रों के उतार-चढ़ाव की चौड़ाई की तुलना करें।') }],
  reflect: b('Why are coastal cities usually cooler in summer afternoons than places inland? Use the words “sea breeze”.', 'तटीय शहर गर्मियों की दोपहर में भीतरी स्थानों से प्रायः ठंडे क्यों होते हैं? “समुद्री समीर” शब्द का प्रयोग करें।'),
};
// ---------------------------------------------------------------- T10.L2 tides
const PH = { 0: b('New moon', 'अमावस्या'), 90: b('First quarter', 'शुक्ल अष्टमी (पहला चतुर्थांश)'), 180: b('Full moon', 'पूर्णिमा'), 270: b('Last quarter', 'कृष्ण अष्टमी (अंतिम चतुर्थांश)') };
export const tides = {
  id: 'T10.L2',
  objective: b('Explain how the Moon and Sun produce tides and why the tidal range is largest at new and full moon (spring tides) and smallest at the quarters (neap tides).', 'समझाएँ कि चंद्रमा और सूर्य ज्वार कैसे बनाते हैं और अमावस्या-पूर्णिमा पर ज्वारीय परिसर (वृहत् ज्वार) सबसे अधिक तथा अष्टमी पर (निम्न ज्वार) सबसे कम क्यों होता है।'),
  note: { kind: 'documented', en: 'Uses the real lunar (12 h 25 min) and solar (12 h) tidal periods and the Sun’s tidal strength about 46% of the Moon’s. Real coasts differ with shape and depth.', hi: 'वास्तविक चंद्र (12 घं 25 मि) और सौर (12 घं) ज्वारीय अवधियों तथा चंद्रमा की तुलना में सूर्य के लगभग 46% ज्वारीय बल का उपयोग। वास्तविक तटों पर आकार और गहराई से अंतर होता है।' },
  init: () => ({ phase: '0' }),
  controls: [{ id: 'phase', type: 'chips', label: b('Moon phase', 'चंद्र कला'), options: Object.entries(PH).map(([deg, o]) => ({ id: deg, ...o })) }],
  view(S) {
    const psi = +S.phase, series = O.tideSeries(psi, 72, 0.25), range = O.tidalRange(psi), spring = psi === 0 || psi === 180;
    const ch = new Chart({ xMax: 72, yMax: 2, yMin: -2, xLabel: P('Hours', 'घंटे'), yLabel: P('Water level (m)', 'जलस्तर (मी)'), xTicks: 6, yTicks: 4 });
    ch.axes(); ch.line(series.map((p) => [p.t, p.h]), 'curve s');
    const hi = Math.max(...series.map((p) => p.h)), lo = Math.min(...series.map((p) => p.h));
    ch.hline(hi, 'guide', 0, 72); ch.hline(lo, 'guide', 0, 72);
    const rad = (d) => (d * Math.PI) / 180, ex = 140, ey = 60, mx = ex + 90 * Math.cos(rad(psi + 0)), my = ey - 90 * Math.sin(rad(psi + 0));
    const small = `<svg viewBox="0 0 280 120" class="chart" role="img" xmlns="http://www.w3.org/2000/svg" style="max-height:140px"><circle class="sunmoon" cx="262" cy="60" r="14"/><text class="txt sm" x="262" y="92" text-anchor="middle">${esc(P('Sun', 'सूर्य'))}</text><circle class="earth" cx="${ex}" cy="${ey}" r="14"/><circle class="moon" cx="${mx.toFixed(0)}" cy="${my.toFixed(0)}" r="8"/><text class="txt sm" x="${ex}" y="${ey + 30}" text-anchor="middle">${esc(P('Earth', 'पृथ्वी'))}</text><text class="txt sm" x="${mx.toFixed(0)}" y="${(my - 12).toFixed(0)}" text-anchor="middle">${esc(P('Moon', 'चंद्रमा'))}</text></svg>`;
    return {
      svg: small + ch.html({ label: P('Tide height over three days', 'तीन दिन में ज्वार की ऊँचाई') }), aria: `Tide range ${fmt(range, 2)} metres at ${PH[psi].en}.`,
      lines: [
        { en: `${PH[psi].en}: tidal range ${fmt(range, 2)} m (high minus low).`, hi: `${PH[psi].hi}: ज्वारीय परिसर ${fmt(range, 2)} मी (उच्च घटा निम्न)।` },
        spring ? { en: 'Sun, Earth and Moon line up, so the Sun’s pull adds to the Moon’s: SPRING tides, the highest highs and lowest lows.', hi: 'सूर्य, पृथ्वी और चंद्रमा एक सीध में आते हैं, इसलिए सूर्य का खिंचाव चंद्रमा के खिंचाव में जुड़ता है: वृहत् (बड़े) ज्वार, सबसे ऊँचा और सबसे नीचा जल।', cls: 'warn' }
          : { en: 'Sun and Moon pull at right angles, so they partly cancel: NEAP tides with a smaller range.', hi: 'सूर्य और चंद्रमा समकोण पर खिंचाव डालते हैं, इसलिए आंशिक रूप से कट जाते हैं: निम्न ज्वार, छोटा परिसर।', cls: 'balanced' },
        { en: 'Most coasts have two high tides a day, about 12 h 25 min apart.', hi: 'अधिकांश तटों पर दिन में दो उच्च ज्वार आते हैं, लगभग 12 घं 25 मि के अंतर पर।', cls: 'note' },
      ],
    };
  },
  discover: [b('Compare the vertical gap between the guide lines for new moon and first quarter.', 'अमावस्या और अष्टमी के लिए निर्देश-रेखाओं के बीच ऊर्ध्वाधर अंतर की तुलना करें।'), b('Count the high tides in 24 hours on the graph. Do they come at the same clock time every day?', 'ग्राफ़ पर 24 घंटे में उच्च ज्वार गिनें। क्या वे हर दिन घड़ी के उसी समय आते हैं?')],
  predictions: [{ id: 'p1', stem: b('At FULL moon the tidal range compared with the first quarter is…', 'पूर्णिमा पर ज्वारीय परिसर, अष्टमी की तुलना में…'), options: [opt('larger', 'Larger', 'अधिक'), opt('smaller', 'Smaller', 'कम'), opt('same', 'The same', 'समान')],
    run: (S) => { S.phase = '180'; const a = O.tidalRange(180), c = O.tidalRange(90); return a > c + 0.01 ? 'larger' : a < c - 0.01 ? 'smaller' : 'same'; },
    explain: () => ({ en: `Spring range ${fmt(O.tidalRange(180), 2)} m vs neap range ${fmt(O.tidalRange(90), 2)} m: at full moon the Sun and Moon pull along the same line.`, hi: `वृहत् ज्वार परिसर ${fmt(O.tidalRange(180), 2)} मी बनाम निम्न ज्वार ${fmt(O.tidalRange(90), 2)} मी: पूर्णिमा पर सूर्य और चंद्रमा एक ही रेखा में खिंचाव डालते हैं।` }) }],
  exit: [{ id: 'e1', stem: b('Fishing communities plan boat launches around tides. Which moon phase brings the lowest low tides?', 'मछुआरे ज्वार के अनुसार नाव उतारने की योजना बनाते हैं। किस चंद्र कला पर सबसे नीचे निम्न जल आता है?'), correct: 'new', options: [
    { id: 'new', ...b('New moon or full moon (spring tides)', 'अमावस्या या पूर्णिमा (वृहत् ज्वार)') }, { id: 'q', ...b('The quarter moons (neap tides)', 'अष्टमी (निम्न ज्वार)'), why: b('Quarter moons give the smallest range: the highs are lower and the lows are higher.', 'अष्टमी पर परिसर सबसे छोटा होता है: उच्च जल कम और निम्न जल ऊँचा रहता है।') }],
    explain: b('At new and full moon the pulls add, giving both the highest highs and the lowest lows.', 'अमावस्या और पूर्णिमा पर खिंचाव जुड़ते हैं, जिससे उच्चतम उच्च जल और निम्नतम निम्न जल मिलता है।'), hint: b('Which phases show the biggest gap between the guide lines?', 'किन कलाओं में निर्देश-रेखाओं के बीच सबसे बड़ा अंतर दिखता है?') }],
  reflect: b('Name one activity near the coast that depends on knowing the tide table.', 'तट के पास की एक ऐसी गतिविधि बताएँ जो ज्वार-सारणी जानने पर निर्भर है।'),
};
// ---------------------------------------------------------------- T10.L4 tsunami
export const tsunami = {
  id: 'T10.L4',
  objective: b('Calculate how fast a tsunami travels, why it slows near the coast, and how much time a community has to evacuate after a warning.', 'गणना करें कि सुनामी कितनी तेज़ चलती है, तट के पास क्यों धीमी हो जाती है, और चेतावनी के बाद समुदाय के पास निकलने के लिए कितना समय है।'),
  note: { kind: 'documented', en: 'Speed = √(g × depth) for long waves. Distances and depths are chosen examples, not a forecast for any coast.', hi: 'लंबी तरंगों के लिए गति = √(g × गहराई)। दूरी और गहराई उदाहरण हैं, किसी तट का पूर्वानुमान नहीं।' },
  init: () => ({ depth: 4000, dist: 1000, siren: 20 }),
  controls: [
    { id: 'depth', type: 'slider', label: b('Ocean depth (m)', 'महासागर की गहराई (मी)'), min: 10, max: 6000, step: 10, fmt: (v) => `${fmt(v, 0)} m` },
    { id: 'dist', type: 'slider', label: b('Distance to the coast (km)', 'तट तक दूरी (किमी)'), min: 50, max: 5000, step: 50, fmt: (v) => `${fmt(v, 0)} km` },
    { id: 'siren', type: 'slider', label: b('Minutes needed to reach high ground', 'ऊँचे स्थान तक पहुँचने के लिए आवश्यक मिनट'), min: 0, max: 180, step: 5, fmt: (v) => `${v} min` },
  ],
  view(S) {
    const kmh = O.tsunamiKmh(S.depth), w = O.warning({ distKm: S.dist, depthM: S.depth, sirenMinutes: S.siren }), ok = w.timeToEvacuate > 0 || S.siren === 0, wave = O.windWaveSpeed(100) * 3.6;
    const items = [[P('Tsunami (this depth)', 'सुनामी (इस गहराई पर)'), kmh, 'bar-bad'], [P('Tsunami near shore (10 m)', 'सुनामी तट के पास (10 मी)'), O.tsunamiKmh(10), 'bar-w'], [P('Wind wave (100 m wavelength)', 'पवन-तरंग (100 मी तरंगदैर्घ्य)'), wave, 'bar-n'], [P('Car on a highway', 'राजमार्ग पर कार'), 100, 'bar-s'], [P('Jet aircraft', 'जेट विमान'), 800, 'bar-s']];
    const max = 900; let g = '', y = 20;
    for (const [lab, v, cls] of items) { const wdt = (Math.min(v, max) / max) * 380; g += `<text class="txt sm" x="10" y="${y + 14}">${esc(lab)}</text><rect class="${cls}" x="230" y="${y}" width="${wdt.toFixed(0)}" height="22"/><text class="txt sm b" x="${236 + wdt}" y="${y + 16}">${fmt(v, 0)} km/h</text>`; y += 34; }
    const lines = [
      { en: `In ${fmt(S.depth, 0)} m of water a tsunami moves at about ${fmt(kmh, 0)} km/h (${fmt(O.tsunamiSpeed(S.depth), 0)} m/s).`, hi: `${fmt(S.depth, 0)} मी गहरे जल में सुनामी लगभग ${fmt(kmh, 0)} किमी/घं (${fmt(O.tsunamiSpeed(S.depth), 0)} मी/से) से चलती है।` },
      { en: `It reaches a coast ${fmt(S.dist, 0)} km away in about ${fmt(w.minutes, 0)} minutes (${fmt(w.hours, 1)} h) if the depth stayed constant.`, hi: `यदि गहराई स्थिर रहे तो यह ${fmt(S.dist, 0)} किमी दूर तट तक लगभग ${fmt(w.minutes, 0)} मिनट (${fmt(w.hours, 1)} घं) में पहुँचती है।` },
      ok ? { en: `If people need ${S.siren} minutes to reach high ground, ${fmt(w.timeToEvacuate, 0)} minutes of margin remain.`, hi: `यदि लोगों को ऊँचे स्थान तक पहुँचने में ${S.siren} मिनट लगते हैं, तो ${fmt(w.timeToEvacuate, 0)} मिनट का अंतर बचता है।`, cls: 'balanced' }
        : { en: 'The wave arrives before people can reach high ground: warning must come earlier or the route must be shorter.', hi: 'लोगों के ऊँचे स्थान तक पहुँचने से पहले लहर आ जाती है: चेतावनी पहले मिलनी चाहिए या मार्ग छोटा होना चाहिए।', cls: 'warn' },
      { en: 'Near the shore the wave slows (shallow water) but its height grows; the water can keep rushing in for many minutes.', hi: 'तट के पास लहर धीमी हो जाती है (उथला जल) पर उसकी ऊँचाई बढ़ती है; जल कई मिनटों तक भीतर बहता रह सकता है।', cls: 'note' },
    ];
    return {
      plate: {
        src: 'assets/images/plates/t10-tsunami.jpg',
        en: 'Offshore tsunami sensor buoy and elevated coastal emergency shelter protecting shoreline villages.',
        hi: 'तटीय गाँवों की रक्षा हेतु समुद्र में सुनामी चेतावनी बोया और ऊँचा आपातकालीन आश्रय केंद्र।',
      },
      svg: `<svg viewBox="0 0 640 ${y + 10}" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Tsunami speed ${fmt(kmh, 0)} km/h; arrival ${fmt(w.minutes, 0)} minutes.`,
      lines,
    };
  },
  discover: [b('Drag the depth from 4000 m down to 10 m. What happens to the speed? Why does the wave pile up near the shore?', 'गहराई 4000 मी से घटाकर 10 मी तक लाएँ। गति का क्या होता है? लहर तट के पास क्यों ऊँची हो जाती है?'), b('Set the distance to 300 km. Can people who need 60 minutes reach safety?', 'दूरी 300 किमी करें। क्या 60 मिनट चाहने वाले लोग सुरक्षित स्थान तक पहुँच सकते हैं?')],
  predictions: [{ id: 'p1', stem: b('A tsunami crossing the deep ocean (4000 m) travels…', 'गहरे महासागर (4000 मी) को पार करती सुनामी चलती है…'), options: [opt('slow', 'About as fast as a car (100 km/h)', 'लगभग कार जितनी तेज़ (100 किमी/घं)'), opt('jet', 'About as fast as a jet aircraft (700+ km/h)', 'लगभग जेट विमान जितनी तेज़ (700+ किमी/घं)'), opt('light', 'Much faster than any aircraft (3000 km/h)', 'किसी भी विमान से कहीं तेज़ (3000 किमी/घं)')],
    run: (S) => { S.depth = 4000; const v = O.tsunamiKmh(4000); return v < 300 ? 'slow' : v < 1500 ? 'jet' : 'light'; },
    explain: () => ({ en: `√(9.81 × 4000) ≈ ${fmt(O.tsunamiSpeed(4000), 0)} m/s ≈ ${fmt(O.tsunamiKmh(4000), 0)} km/h: as fast as a jet, but the wave is only about a metre high in open water.`, hi: `√(9.81 × 4000) ≈ ${fmt(O.tsunamiSpeed(4000), 0)} मी/से ≈ ${fmt(O.tsunamiKmh(4000), 0)} किमी/घं: जेट जितनी तेज़, पर खुले जल में लहर केवल लगभग एक मीटर ऊँची होती है।` }) }],
  exit: [{ id: 'e1', stem: b('A tsunami warning is issued when the wave is 1000 km offshore in deep water. Roughly how long until it arrives?', 'जब लहर गहरे जल में तट से 1000 किमी दूर है तब सुनामी चेतावनी जारी होती है। लगभग कितने समय में यह पहुँचेगी?'), correct: 'h', options: [
    { id: 'h', ...b('About 1½ hours', 'लगभग डेढ़ घंटे') }, { id: 'm', ...b('About 5 minutes', 'लगभग 5 मिनट'), why: b('That would need a speed of 12,000 km/h. Use speed ≈ 700 km/h.', 'इसके लिए 12,000 किमी/घं की गति चाहिए। गति ≈ 700 किमी/घं लें।') }, { id: 'd', ...b('About 2 days', 'लगभग 2 दिन'), why: b('Too slow: at 700 km/h, 1000 km takes about 1.4 hours.', 'बहुत धीमा: 700 किमी/घं पर 1000 किमी में लगभग 1.4 घंटे लगते हैं।') }],
    explain: b('Time = distance ÷ speed = 1000 ÷ ~700 ≈ 1.4 hours. This is why warning systems and evacuation drills save lives.', 'समय = दूरी ÷ गति = 1000 ÷ ~700 ≈ 1.4 घंटे। इसी कारण चेतावनी प्रणाली और निकासी-अभ्यास जीवन बचाते हैं।'), hint: b('Use the distance and speed in the readout.', 'आँकड़े में दिए दूरी और गति का प्रयोग करें।') }],
  reflect: b('Write two things a coastal school could do so students can reach high ground within the time you calculated.', 'दो काम लिखें जो तटीय विद्यालय कर सके ताकि विद्यार्थी आपकी गणना के समय में ऊँचे स्थान पर पहुँच सकें।'),
};
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
    return { svg: ch.html({ label: P('Forest stock over 50 years', '50 वर्षों में वन भंडार') }), aria: `Forest stock after 50 years: ${fmt(r.final, 0)}.`, lines };
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
    return { svg: ch.html({ label: P('Predator and prey populations', 'शिकारी और शिकार की जनसंख्या') }), aria: 'Predator and prey populations over 40 years.', lines };
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
