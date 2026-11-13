// T10 Oceans and Life lab specs (L1–L5).
import * as O from '../../engines/domain/ocean.js';
import { Chart } from '../../engines/chart.js';
import { d3, forceGraphSvg } from '../../engines/viz.js';
import { fmt, esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });

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
      plate: {
        src: 'assets/images/plates/t10-tides.jpg',
        en: 'Indian Ocean high-tide jetty, open sea & low-tide mudflats — tap pins to shift lunar phase between Spring and Neap tides.',
        hi: 'उच्च ज्वार बंदरगाह, खुला सागर व निम्न ज्वार तट — वृहत् व निम्न ज्वार की चंद्र स्थिति बदलने हेतु पिन पर टैप करें।',
        spots: [
          { x: 22, y: 66, en: 'New Moon Spring High Tide', hi: 'अमावस्या वृहत् उच्च ज्वार', detail: b('Sun and Moon align on one side — boats ride maximum high tide right up to the jetty.', 'सूर्य और चंद्रमा एक सीध में — दोनों के खिंचाव जुड़कर अधिकतम ज्वार लाते हैं।'), set: { phase: '0' } },
          { x: 58, y: 46, en: 'First Quarter Neap Tide', hi: 'अष्टमी निम्न ज्वार', detail: b('Sun and Moon pull at 90°, giving milder swells across the open harbour.', 'सूर्य-चंद्रमा 90° पर होने से आंशिक कटौती होती है और छोटा ज्वारीय परिसर मिलता है।'), set: { phase: '90' } },
          { x: 88, y: 68, en: 'Full Moon Extreme Low Mudflat', hi: 'पूर्णिमा वृहत् निम्न जल तट', detail: b('Spring tides bring both the highest flood tides and the widest exposed low-tide flats.', 'पूर्णिमा पर उच्चतम ज्वार के साथ सबसे विस्तृत निम्न-जल तट भी उभरते हैं।'), set: { phase: '180' } },
        ],
      },
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
        en: 'Offshore tsunami sensor buoy and elevated coastal emergency shelter — tap pins to compare deep-ocean speed vs near-shore shoaling.',
        hi: 'समुद्री सुनामी चेतावनी बोया और ऊँचा आपातकालीन आश्रय — गहरे समुद्र व उथले तट की गति परखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 54, en: 'DART Deep-Ocean Sensor (4,000 m)', hi: 'गहरा समुद्री सेंसर (4,000 मी)', detail: b('In 4,000 m water a tsunami races at jet speed (~713 km/h) yet stays under 1 m tall.', '4,000 मी गहरे पानी में सुनामी ~713 किमी/घं की जेट गति से चलती है पर ऊँचाई कम होती है।'), set: { depth: 4000, dist: 1000, siren: 25 } },
          { x: 56, y: 66, en: 'Shallow Near-Shore Shoaling (20 m)', hi: 'तट के पास उथला जल (20 मी)', detail: b('As depth shrinks to 20 m, speed brakes sharply while kinetic energy piles the wave steeply upward!', '20 मी गहराई पर गति अचानक घटती है और ऊर्जा लहर को ऊँची दीवार बना देती है!'), set: { depth: 20, dist: 50, siren: 25 } },
          { x: 82, y: 38, en: 'Elevated Coastal Shelter', hi: 'ऊँचा तटीय आश्रय', detail: b('Pre-planned evacuation paths clear low beaches well before distant warnings arrive.', 'पहले से तय निकासी मार्ग चेतावनी के बाद समय रहते लोगों को सुरक्षित ऊँचाई तक पहुँचाते हैं।'), set: { depth: 4000, dist: 1200, siren: 20 } },
        ],
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
      plate: {
        src: 'assets/images/plates/t10-oceanfloor.jpg',
        en: '3D oceanic trench, mid-ocean ridge volcanic vent and continental shelf — tap any seafloor feature pin to adjust depth.',
        hi: 'समुद्र-तल उच्चावच: किसी भी पिन पर टैप करके मग्नतट, गहन मैदान, कटक व गर्त की गहराई बदलें।',
        spots: [
          { x: 22, y: 42, en: 'Sunlit Continental Shelf', hi: 'महाद्वीपीय मग्नतट (<200 मी)', detail: b('Widen the shallow sunlit shelf to 160 km where plankton & reefs thrive.', 'उथला 160 किमी मग्नतट जहाँ धूप से प्रवाल व मत्स्य जीवन फलता है।'), set: { shelfKm: 160 } },
          { x: 44, y: 66, en: 'Abyssal Plain & ROV', hi: 'गहन समुद्री मैदान', detail: b('Vast flat deep-sea sediment basin miles beneath surface ships.', 'सतह से मीलों नीचे फैला समतल अवसादी महासागरीय मैदान।'), set: { shelfKm: 80, ridgeHeight: 2200, trenchDepth: 8500 } },
          { x: 60, y: 56, en: 'Mid-Ocean Ridge Vent', hi: 'मध्य-महासागरीय कटक', detail: b('Raise volcanic divergent ridge to 3,200 m relief as plates spread.', 'प्लेटों के दूर हटने पर 3,200 मी ऊँचा ज्वालामुखी कटक उभरता है।'), set: { ridgeHeight: 3200 } },
          { x: 82, y: 72, en: 'Deep Subduction Trench', hi: 'गहन अधोगमन गर्त', detail: b('Drop trench depth to 10,750 m where dense oceanic plate bends down.', 'अधोगमन सीमा पर 10,750 मी गहरा महासागरीय गर्त देखें।'), set: { trenchDepth: 10750 } },
        ],
      },
      svg: `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="oc-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#0369a1"/></linearGradient></defs>${g}</svg>`,
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
      plate: {
        src: 'assets/images/plates/t10-fisheries.jpg',
        en: 'Coastal fishing boats beside Kerala mangrove nurseries — tap pins to test co-managed nets vs trawling collapse.',
        hi: 'केरल में मैंग्रोव जड़ों के पास मछुआरा नावें — टिकाऊ जाल व अति-मत्स्यन की तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 44, en: 'Mangrove Fish Nursery (90%)', hi: 'मैंग्रोव मत्स्य नर्सरी (90%)', detail: b('Tangled submerged roots shield young fry from predators & cyclones.', 'जटिल मैंग्रोव जड़ें छोटी मछलियों को सुरक्षित प्रजनन-स्थल देती हैं।'), set: { mangrove: 90, closed: 3 } },
          { x: 54, y: 66, en: 'Selective 55 mm Nets', hi: 'बड़े 55 मिमी जाल', detail: b('45 boats + 55 mm mesh spare juvenile fish so yields hold steady for 25 yrs.', '45 नावें व बड़े छेद का जाल युवा मछलियाँ बचाकर 25 वर्षों तक आय सुरक्षित रखते हैं।'), set: { boats: 45, mesh: 55, closed: 2 } },
          { x: 80, y: 58, en: 'Overfishing + Fine Mesh Crisis', hi: 'अति-मत्स्यन संकट', detail: b('110 boats + 20 mm fine mesh + 0 closed months collapses fish stocks!', '110 नावें व छोटे 20 मिमी जाल बिना बंद ऋतु के पूरा मत्स्य भंडार समाप्त कर देते हैं!'), set: { boats: 110, mesh: 20, closed: 0, mangrove: 20 } },
        ],
      },
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
    return {
      plate: {
        src: 'assets/images/plates/t10-tides.jpg',
        en: 'Indian Ocean harbour, open sea lanes & coastal mangrove radar — tap pins to explore UNCLOS, tsunami alerts & blue economy.',
        hi: 'हिंद महासागर बंदरगाह, समुद्री मार्ग व तटीय मैंग्रोव राडार — समुद्री कानून, सुनामी चेतावनी व नीली अर्थव्यवस्था देखें।',
        spots: [
          { x: 58, y: 46, en: 'UNCLOS 200-nm Sea Lanes', hi: 'UNCLOS 200 नॉटिकल मील मार्ग', detail: b('Defines peaceful coastal resource rights alongside open high-seas navigation.', 'तटीय संसाधन अधिकार व खुले समुद्र की शांतिपूर्ण नौवहन स्वतंत्रता तय करता है।'), set: { focus: 'law' } },
          { x: 92, y: 38, en: 'Coastal Cyclone & Tsunami Radar', hi: 'चक्रवात व सुनामी चेतावनी केंद्र', detail: b('Cross-border warning buoys & radar broadcast seismic sea alerts across Indian Ocean coasts.', 'सीमा-पार सेंसर बोया पूरे हिंद महासागर तटों को समय पर चेतावनी भेजते हैं।'), set: { focus: 'rescue' } },
          { x: 24, y: 66, en: 'Fisher Harbour & Blue Economy', hi: 'मछुआरा बंदरगाह व नीली अर्थव्यवस्था', detail: b('Sustainable coastal ports and mangrove nurseries keep fisheries thriving.', 'टिकाऊ बंदरगाह व मैंग्रोव नर्सरी मत्स्य जीवन की रक्षा करते हैं।'), set: { focus: 'blue' } },
        ],
      },
      svg, aria: `Maritime cooperation node ${S.focus}`, lines: [desc[S.focus]],
    };
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
