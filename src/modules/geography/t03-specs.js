// T03 Atmosphere and Climate lab specs (L1–L6).
import * as A from '../../engines/domain/atmosphere.js';
import { Chart } from '../../engines/chart.js';
import { d3, indiaMapSvg } from '../../engines/viz.js';
import { fmt, esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });
const LAYER = { troposphere: b('Troposphere', 'क्षोभमंडल'), stratosphere: b('Stratosphere', 'समतापमंडल'), mesosphere: b('Mesosphere', 'मध्यमंडल'), thermosphere: b('Thermosphere', 'तापमंडल') };
const LAYER_NOTE = {
  troposphere: b('Weather happens here; air is densest and temperature falls with height.', 'मौसम यहीं बनता है; वायु सबसे सघन है और ऊँचाई के साथ तापमान घटता है।'),
  stratosphere: b('Contains the ozone layer that absorbs harmful ultraviolet rays; temperature rises with height.', 'इसमें ओज़ोन परत है जो हानिकारक पराबैंगनी किरणें सोखती है; ऊँचाई के साथ तापमान बढ़ता है।'),
  mesosphere: b('Meteors burn up here; the coldest part of the atmosphere.', 'उल्काएँ यहाँ जल जाती हैं; वायुमंडल का सबसे ठंडा भाग।'),
  thermosphere: b('Very thin air; temperature is very high but there is too little air to feel hot. Auroras occur here.', 'वायु बहुत विरल; तापमान बहुत ऊँचा पर इतनी कम वायु कि गर्मी महसूस नहीं होती। ध्रुवीय ज्योति यहीं होती है।'),
};
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

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
    let g = `<defs><linearGradient id="atm-t" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#bae6fd"/><stop offset="100%" stop-color="#e0f2fe"/></linearGradient><linearGradient id="atm-s" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="40%" stop-color="#a5f3fc" stop-opacity=".65"/><stop offset="100%" stop-color="#c7d2fe"/></linearGradient><linearGradient id="atm-m" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#c7d2fe"/><stop offset="100%" stop-color="#6366f1" stop-opacity=".45"/></linearGradient><linearGradient id="atm-h" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#312e81" stop-opacity=".42"/><stop offset="100%" stop-color="#0f172a" stop-opacity=".82"/></linearGradient></defs>`;
    const fills = { troposphere: 'url(#atm-t)', stratosphere: 'url(#atm-s)', mesosphere: 'url(#atm-m)', thermosphere: 'url(#atm-h)' };
    for (const l of A.LAYERS) { const a = Math.min(l.from, 100), z = Math.min(l.to, 100); if (a >= 100) continue; g += `<rect class="${cols[l.id]}" x="${x0}" y="${Y(z)}" width="${x1 - x0}" height="${Y(a) - Y(z)}" style="fill:${fills[l.id]}"/><text class="txt b" x="${x1 - 6}" y="${Y(z) + 16}" text-anchor="end">${esc(P(LAYER[l.id].en, LAYER[l.id].hi))}</text>`; }
    // Iconic atmospheric depth markers: Everest peak, commercial jet, ozone band, meteor trail
    g += `<polygon points="110,${Y(0)} 135,${Y(8.8)} 160,${Y(0)}" fill="#64748b" opacity=".6"/><text class="txt sm" x="165" y="${Y(6)}">${esc(P('Mt Everest 8.8 km', 'माउंट एवरेस्ट 8.8 किमी'))}</text>`;
    g += `<rect x="${x0}" y="${Y(30)}" width="${x1 - x0}" height="18" fill="#06b6d4" opacity=".22"/><text class="txt sm" x="${x0 + 8}" y="${Y(27)}">${esc(P('Ozone belt (~20–30 km)', 'ओज़ोन परत (~20–30 किमी)'))}</text>`;
    g += `<line x1="210" y1="${Y(78)}" x2="250" y2="${Y(64)}" stroke="#f97316" stroke-width="3" stroke-linecap="round"/><circle cx="250" cy="${Y(64)}" r="4" fill="#fbbf24"/>`;
    let d = ''; for (let km = 0; km <= 100; km += 1) d += `${km ? 'L' : 'M'}${TX(A.temperatureC(km)).toFixed(1)},${Y(km).toFixed(1)}`;
    g += `<path class="curve d" d="${d}" fill="none" stroke-width="4"/>`;
    for (const t of [-100, -50, 0, 15]) g += `<text class="txt sm mut" x="${TX(t)}" y="${yBot + 16}" text-anchor="middle">${t}°C</text><line class="grid" x1="${TX(t)}" x2="${TX(t)}" y1="${yTop}" y2="${yBot}"/>`;
    for (const km of [0, 12, 50, 85]) g += `<text class="txt sm mut" x="${x0 - 8}" y="${Y(km) + 4}" text-anchor="end">${km} km</text>`;
    const T = A.temperatureC(S.alt);
    g += `<line class="guide" x1="${x0}" x2="${x1}" y1="${Y(S.alt)}" y2="${Y(S.alt)}"/><circle class="probe-dot" cx="${TX(T)}" cy="${Y(S.alt)}" r="8"/>`;
    g += `<text class="txt sm b" x="${(x0 + x1) / 2}" y="${H - 6}" text-anchor="middle">${esc(P('Temperature (°C) — red line', 'तापमान (°C) — लाल रेखा'))}</text>`;
    const l = A.layerAt(S.alt), pr = A.pressureHPa(S.alt), mass = A.massBelow(S.alt) * 100;
    return {
      plate: {
        src: 'assets/images/plates/t03-atmosphere.jpg',
        en: 'Atmospheric layers from clouds in the troposphere through the ozone jet belt up to aurora space — tap any pin to jump the probe.',
        hi: 'क्षोभमंडल के बादलों व समतापमंडल के ओज़ोन स्तर से अंतरिक्ष तक परतें — प्रोब भेजने हेतु पिन पर टैप करें।',
        spots: [
          { x: 28, y: 78, en: 'Mt Everest & Weather (8.8 km)', hi: 'माउंट एवरेस्ट व मौसम (8.8 किमी)', detail: b('Troposphere: densest air, weather clouds & ~75% of atmospheric mass.', 'क्षोभमंडल: सबसे सघन वायु, बादल और वायुमंडल का ~75% द्रव्यमान।'), set: { alt: 8.8 } },
          { x: 48, y: 54, en: 'Ozone Belt (25 km)', hi: 'ओज़ोन परत (25 किमी)', detail: b('Stratosphere: ozone absorbs UV light so temperature actually rises here.', 'समतापमंडल: ओज़ोन UV किरणें सोखती है जिससे तापमान ऊपर जाने पर बढ़ता है।'), set: { alt: 25 } },
          { x: 65, y: 32, en: 'Meteor Burn Zone (65 km)', hi: 'उल्का दहन क्षेत्र (65 किमी)', detail: b('Mesosphere: coldest layer where space dust glows as shooting stars.', 'मध्यमंडल: सबसे ठंडा स्तर जहाँ उल्काएँ घर्षण से जलती हैं।'), set: { alt: 65 } },
          { x: 78, y: 16, en: 'Aurora Zone (95 km)', hi: 'ध्रुवीय ज्योति (95 किमी)', detail: b('Thermosphere: ultra-thin ionised gas glowing with auroras.', 'तापमंडल: अत्यंत विरल आयनित गैस जहाँ ध्रुवीय ज्योति चमकती है।'), set: { alt: 95 } },
        ],
      },
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
    const dir = cur.kind === 'sea-breeze' ? 1 : cur.kind === 'land-breeze' ? -1 : 0;
    const isDay = S.hour >= 6 && S.hour <= 18;
    const sunX = isDay ? Math.round(90 + ((S.hour - 6) / 12) * 460) : 540;
    const skyTop = isDay ? '#38bdf8' : '#0f172a', skyBot = isDay ? '#e0f2fe' : '#1e293b';
    const cloudOp = Math.min(0.88, S.cloud * 0.85).toFixed(2);
    const plumeX = cur.kind === 'sea-breeze' ? 485 : cur.kind === 'land-breeze' ? 160 : 0;
    const plume = plumeX ? `<path d="M${plumeX - 18},88 q-8,-14 4,-26 t4,-24 M${plumeX + 18},88 q-8,-14 4,-26 t4,-24" fill="none" stroke="#f97316" stroke-width="2.5" stroke-dasharray="4 3" opacity=".85"/>` : '';
    const clouds = S.cloud > 0.05 ? `<g opacity="${cloudOp}" fill="#ffffff"><ellipse cx="190" cy="30" rx="46" ry="14"/><ellipse cx="220" cy="24" rx="34" ry="12"/><ellipse cx="445" cy="34" rx="50" ry="14"/></g>` : '';
    const orb = isDay
      ? `<circle cx="${sunX}" cy="28" r="13" fill="#fbbf24"/><circle cx="${sunX}" cy="28" r="19" fill="#fde047" opacity=".32"/>`
      : `<circle cx="${sunX}" cy="26" r="11" fill="#fef08a"/><circle cx="${sunX - 4}" cy="23" r="9" fill="${skyTop}"/><circle cx="110" cy="22" r="1.5" fill="#fff"/><circle cx="290" cy="18" r="1.5" fill="#fff"/>`;
    const breezeArrow = dir ? `<line x1="${320 - dir * 115}" y1="48" x2="${320 + dir * 115}" y2="48" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/><path d="M${320 + dir * 122},48 l${-dir * 16},-9 l0,18 z" fill="#0284c7"/>` : '';
    const diagram = `<svg viewBox="0 0 640 132" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="brz-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${skyTop}"/><stop offset="100%" stop-color="${skyBot}"/></linearGradient><linearGradient id="brz-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient><linearGradient id="brz-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#84cc16"/><stop offset="100%" stop-color="#b45309"/></linearGradient></defs><rect x="0" y="0" width="640" height="78" fill="url(#brz-sky)"/>${orb}${clouds}<path d="M0,78 Q40,72 80,78 T160,78 T240,78 T320,78 L320,132 L0,132 Z" fill="url(#brz-sea)"/><path d="M320,78 Q420,76 500,66 Q575,54 640,68 L640,132 L320,132 Z" fill="url(#brz-land)"/>${plume}${breezeArrow}<text class="txt b" x="155" y="114" fill="#ffffff" text-anchor="middle">${esc(P('Sea', 'समुद्र'))} ${fmt(cur.sea, 0)}°C</text><text class="txt b" x="485" y="114" fill="#ffffff" text-anchor="middle">${esc(P('Land', 'भूमि'))} ${fmt(cur.land, 0)}°C</text><rect x="170" y="4" width="300" height="22" rx="11" fill="#ffffff" opacity=".88"/><text class="txt sm b" x="320" y="19" text-anchor="middle">${esc(cur.kind === 'sea-breeze' ? P('Sea breeze (surface wind from sea)', 'समुद्री समीर (सतह पर समुद्र से आती हवा)') : cur.kind === 'land-breeze' ? P('Land breeze (surface wind from land)', 'स्थलीय समीर (सतह पर भूमि से आती हवा)') : P('Calm', 'शांत'))}</text></svg>`;
    return {
      plate: {
        src: 'assets/images/plates/t03-wind.jpg',
        en: 'Sunlit coastal breeze corridor: tap pins to jump between afternoon sea breeze, cloudy coast and night land breeze.',
        hi: 'तटीय पवन गलियारा: दोपहर की समुद्री समीर, बादल व रात की स्थलीय समीर देखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 18, y: 66, en: 'Daytime Heated Beach (15:00)', hi: 'दिन में तप्त तट (15:00)', detail: b('Sand warms quickly under afternoon sun, lifting warm air so cool sea wind rushes inland.', 'धूप में भूमि जल्दी गर्म होती है और हवा ऊपर उठने से ठंडी समुद्री समीर अंदर आती है।'), set: { hour: 15, cloud: 0 } },
          { x: 25, y: 22, en: 'Inland Cloud Blanket', hi: 'घने बादल आवरण', detail: b('80% clouds shade the coast, flattening the land–sea temperature contrast.', '80% बादल धूप रोककर भूमि-समुद्र तापमान अंतर घटाते हैं।'), set: { hour: 15, cloud: 0.8 } },
          { x: 68, y: 60, en: 'Night Fishing Boats (02:00)', hi: 'रात्रि नौका पवन (02:00)', detail: b('By 2 am land cools faster than ocean water, reversing wind outward as a land breeze.', 'रात 2 बजे भूमि समुद्र से ठंडी होकर तट से समुद्र की ओर स्थलीय समीर चलाती है।'), set: { hour: 2, cloud: 0 } },
        ],
      },
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
      plate: {
        src: 'assets/images/plates/t03-pressure.jpg',
        en: 'Global atmospheric pressure belts — tap equatorial storm clouds, subtropical desert high or temperate polar front.',
        hi: 'वैश्विक वायुदाब व पवन कटिबंध — विषुवतीय निम्न दाब, उपोष्ण उच्च दाब व ध्रुवीय वाताग्र पर टैप करें।',
        spots: [
          { x: 26, y: 38, en: 'Mumbai (Humid Monsoon Low)', hi: 'मुंबई (तटीय मानसून निम्न दाब)', detail: b('Warm rising ocean-fed clouds keep Mumbai wet & mild year-round.', 'गर्म उठती समुद्री हवा मुंबई में भारी मानसूनी वर्षा व सम तापमान रखती है।'), set: { station: 'mumbai', compare: 'jaipur' } },
          { x: 52, y: 58, en: 'Jaipur (Subtropical Dry Belt)', hi: 'जयपुर (उपोष्ण शुष्क उच्च दाब)', detail: b('Descending dry air inland gives scorching summers and wide seasonal swings.', 'उतरती शुष्क हवा व समुद्र से दूरी जयपुर में तीव्र गर्मी-सर्दी लाती है।'), set: { station: 'jaipur', compare: 'mumbai' } },
          { x: 76, y: 48, en: 'Leh (High Cold Polar-Like)', hi: 'लेह (उच्च पर्वतीय शीत क्षेत्र)', detail: b('Thin alpine air at ~3,500 m drops winter nights far below freezing.', '~3,500 मी ऊँचाई की विरल हवा तापमान को शून्य से नीचे गिरा देती है।'), set: { station: 'leh', compare: 'mumbai' } },
        ],
      },
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
      plate: {
        src: 'assets/images/plates/t03-monsoon.jpg',
        en: 'Advancing monsoon rain curtains sweeping across Sahyadri hills — tap pins to toggle SW/NE winds and crops.',
        hi: 'सह्याद्रि पहाड़ियों पर बरसते मानसूनी बादल — द.-प./उ.-पू. मानसून और आजीविका बदलने हेतु पिन पर टैप करें।',
        spots: [
          { x: 28, y: 38, en: 'Orographic Cloudburst (SW)', hi: 'पर्वतीय वर्षा (द.-प.)', detail: b('June–Sept winds slam against Western Ghats, soaking paddy terraces.', 'जून–सितं की हवाएँ पश्चिमी घाट से टकराकर धान खेतों को सींचती हैं।'), set: { season: 'sw', crop: 'rice' } },
          { x: 64, y: 48, en: 'Retreating Bay Winds (NE)', hi: 'लौटता मानसून (उ.-पू.)', detail: b('Oct–Dec winds pick up Bay of Bengal moisture for Tamil Nadu winter crops.', 'अक्टू–दिसं की हवाएँ बंगाल की खाड़ी से नमी लेकर तमिलनाडु को वर्षा देती हैं।'), set: { season: 'ne', crop: 'rice' } },
          { x: 46, y: 74, en: 'Rain-Shadow Millets', hi: 'वृष्टि-छाया मोटे अनाज', detail: b('Inland Deccan farms rely on drought-hardy jowar, bajra & ragi.', 'आंतरिक दक्कन में सूखा-सहिष्णु ज्वार, बाजरा व रागी बोई जाती हैं।'), set: { season: 'sw', crop: 'millet' } },
        ],
      },
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
      plate: {
        src: 'assets/images/plates/t03-watershed.jpg',
        en: 'Forested watershed hills and check-dam — tap pins to compare sponge forest, paved runoff and check-dam storage.',
        hi: 'वन आच्छादित जलग्रहण और चेक-डैम — हरित सोख्ता, कंक्रीट अपवाह व बांध संचय की तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 26, y: 32, en: 'Forested Sponge Hills', hi: 'वन आच्छादित पहाड़ियाँ', detail: b('70% forest + 4 check-dams soak monsoon storms smoothly into aquifers.', '70% वन व 4 चेक-डैम तूफ़ानी बारिश को भूजल में उतारते हैं।'), set: { forest: 70, paved: 5, dams: 4 } },
          { x: 54, y: 56, en: 'Check-Dam Reservoir', hi: 'चेक-डैम जलाशय', detail: b('Stone bunds trap silt and retain water months after monsoon ends.', 'पत्थर बंध मानसून के महीनों बाद तक जल संचित रखते हैं।'), set: { forest: 45, paved: 20, dams: 5 } },
          { x: 78, y: 68, en: 'Urban Paved Flash Flood', hi: 'शहरी पक्की सतह बाढ़', detail: b('75% concrete with no ponds sends storm surge straight down drains!', '75% कंक्रीट व शून्य तालाब से सारा जल तुरंत बाढ़ बन जाता है!'), set: { forest: 10, paved: 75, dams: 0, rain: 200 } },
        ],
      },
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
      plate: {
        src: 'assets/images/plates/t03-solar.jpg',
        en: 'Clean energy & transit: tap rooftop solar, electric bus or bicycles to simulate cutting your annual emissions.',
        hi: 'स्वच्छ ऊर्जा व परिवहन: छत सौर पैनल, इलेक्ट्रिक बस या साइकिल पर टैप कर वार्षिक उत्सर्जन घटते देखें।',
        spots: [
          { x: 76, y: 24, en: 'Rooftop Solar Array', hi: 'छत सौर ऊर्जा पैनल', detail: b('Raise clean electricity share to 80% — slashing grid coal emissions.', '80% स्वच्छ सौर बिजली से कोयला उत्सर्जन भारी घटता है।'), set: { solar: 80 } },
          { x: 56, y: 62, en: 'Public Electric Bus', hi: 'सार्वजनिक इलेक्ट्रिक बस', detail: b('Shift 120 weekly km from car to shared public transit.', 'सप्ताह के 120 किमी निजी कार से बस/मेट्रो में बदलें।'), set: { car: 0, bus: 120 } },
          { x: 80, y: 78, en: 'Bicycle + Low-Carbon Diet', hi: 'साइकिल व कम-कार्बन आहार', detail: b('Combine local veg diet with cycling & solar for minimum footprint.', 'स्थानीय शाकाहारी आहार, साइकिल व सौर ऊर्जा से न्यूनतम उत्सर्जन।'), set: { car: 0, bus: 30, solar: 90, diet: 'veg' } },
        ],
      },
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
