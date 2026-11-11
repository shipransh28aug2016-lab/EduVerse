// T02.L4 Weathering, erosion and deposition sandbox (terrain engine).
import { Chart } from '../../engines/chart.js';
import * as G from '../../engines/domain/terrain.js';
import { fmt } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';
const b = (en, hi) => ({ en, hi });
const AG = { river: b('River', 'नदी'), wind: b('Wind', 'पवन'), glacier: b('Glacier', 'हिमनद'), waves: b('Sea waves', 'सागरीय तरंगें') };
const RK = { soft: b('Soft rock', 'मुलायम चट्टान'), medium: b('Medium rock', 'मध्यम चट्टान'), hard: b('Hard rock', 'कठोर चट्टान') };
const pct = (v) => `${Math.round(v * 100)}%`;
const AGENT_NOTE = {
  river: b('A river cuts down where the slope is steep (V-shaped valleys, waterfalls) and drops its load where the slope flattens (floodplains, delta).', 'नदी तीव्र ढाल पर नीचे काटती है (V-आकार की घाटियाँ, जलप्रपात) और ढाल समतल होने पर अवसाद जमा करती है (बाढ़ का मैदान, डेल्टा)।'),
  wind: b('Wind works slowly and mostly in dry, bare places; it lifts fine sand and silt and drops it as dunes and loess.', 'पवन धीमे काम करती है और अधिकतर शुष्क, नंगे स्थानों में; यह महीन रेत और गाद उठाकर बालू-टिब्बों और लोयस के रूप में गिराती है।'),
  glacier: b('A glacier grinds the valley floor and walls as it flows, leaving U-shaped valleys and piles of unsorted debris (moraines).', 'हिमनद बहते हुए घाटी का तल और दीवारें घिसता है, जिससे U-आकार की घाटियाँ और अव्यवस्थित मलबे के ढेर (हिमोढ़) बनते हैं।'),
  waves: b('Waves hammer and undercut coastal rock into cliffs and wave-cut platforms, and carry sand to build beaches elsewhere.', 'तरंगें तटीय चट्टान पर प्रहार कर उसे काटकर भृगु और तरंग-कटे चबूतरे बनाती हैं और रेत को दूसरी जगह ले जाकर पुलिन बनाती हैं।'),
};
function view(S) {
  const r = G.run({ rain: S.rain, rock: S.rock, agent: S.agent, vegetation: S.veg, relief: 100 }, S.years), p0 = G.initialProfile(100);
  const ch = new Chart({ xMax: G.N - 1, yMax: 110, xLabel: P('Source → mouth (downstream)', 'स्रोत → मुहाना (अनुप्रवाह)'), yLabel: P('Height (units)', 'ऊँचाई (इकाई)'), xTicks: 4, yTicks: 5 });
  ch.axes();
  ch.line(p0.map((y, i) => [i, y]), 'orig');
  const top = r.profile.map((y, i) => [i, y]);
  ch.poly([...top, [G.N - 1, 0], [0, 0]], `rock ${S.rock === 'soft' ? 'soft' : S.rock === 'hard' ? 'hard' : ''}`);
  ch.line(top, 'curve k');
  r.profile.forEach((y, i) => { if (y > p0[i] + 0.4) ch.poly([[i - 0.5, y], [i + 0.5, y], [i + 0.5, p0[i]], [i - 0.5, p0[i]]], 'dep'); });
  ch.text(G.N - 2, 104, P('- - original surface', '- - मूल धरातल'), 'lbl', 'end');
  const lowered = ((p0[0] - r.profile[0]) / p0[0]) * 100, lines = [
    { en: `After ${S.years} years: ${fmt(r.eroded, 0)} units weathered and carried away (erosion), ${fmt(r.deposited, 0)} units laid down on the way (deposition), ${fmt(r.sea, 0)} units reached the sea.`, hi: `${S.years} वर्ष बाद: ${fmt(r.eroded, 0)} इकाई घिसकर बहाई गई (अपरदन), ${fmt(r.deposited, 0)} इकाई रास्ते में जमा हुई (निक्षेपण), ${fmt(r.sea, 0)} इकाई समुद्र तक पहुँची।` },
    { en: `The source has been lowered by ${fmt(lowered, 0)}%. Dashed line = the starting land surface; tan blocks = new deposits.`, hi: `स्रोत ${fmt(lowered, 0)}% नीचे हो गया। बिंदुकित रेखा = शुरुआती धरातल; पीले खंड = नया निक्षेपण।`, cls: 'note' },
    AGENT_NOTE[S.agent],
  ];
  return { svg: ch.html({ label: P('Land profile', 'भूमि का परिच्छेद') }), aria: `Land profile after ${S.years} years: ${fmt(r.eroded, 0)} eroded, ${fmt(r.deposited, 0)} deposited.`, lines };
}
const run = (S, o) => G.run({ rain: S.rain, rock: S.rock, agent: S.agent, vegetation: S.veg, ...o }, S.years);
export const gradation = {
  id: 'T02.L4',
  objective: b('Explain how weathering, erosion and deposition reshape land, and how rock type, rainfall, vegetation and the agent of gradation change the result.', 'समझाएँ कि अपक्षय, अपरदन और निक्षेपण भूमि को कैसे बदलते हैं, और चट्टान का प्रकार, वर्षा, वनस्पति तथा अपरदन-कारक परिणाम को कैसे प्रभावित करते हैं।'),
  note: { kind: 'schematic', en: 'Teaching units; real rates vary enormously with climate, rock and time.', hi: 'शिक्षण-इकाइयाँ; वास्तविक दरें जलवायु, चट्टान और समय के अनुसार बहुत भिन्न होती हैं।' },
  init: () => ({ agent: 'river', rock: 'medium', rain: 0.5, veg: 0.2, years: 40 }),
  controls: [
    { id: 'agent', type: 'chips', label: b('Agent of gradation', 'अपरदन का कारक'), options: Object.entries(AG).map(([id, o]) => ({ id, ...o })) },
    { id: 'rock', type: 'chips', label: b('Rock type', 'चट्टान का प्रकार'), options: Object.entries(RK).map(([id, o]) => ({ id, ...o })) },
    { id: 'rain', type: 'slider', label: b('Rainfall', 'वर्षा'), min: 0, max: 1, step: 0.05, fmt: pct },
    { id: 'veg', type: 'slider', label: b('Vegetation cover', 'वनस्पति आवरण'), min: 0, max: 1, step: 0.05, fmt: pct, hint: b('Roots and leaves hold soil in place.', 'जड़ें और पत्ते मिट्टी को थामे रखते हैं।') },
    { id: 'years', type: 'slider', label: b('Time passed (years)', 'बीता समय (वर्ष)'), min: 0, max: 100, step: 1 },
  ],
  view,
  discover: [b('Set vegetation to 0% then 100% and watch the eroded total. What do forests do for hillsides?', 'वनस्पति को 0% और फिर 100% करें और अपरदन की कुल मात्रा देखें। वन पहाड़ी ढलानों के लिए क्या करते हैं?'), b('Switch between soft and hard rock. Which one keeps its height longer?', 'मुलायम और कठोर चट्टान के बीच बदलें। कौन-सी अपनी ऊँचाई अधिक समय तक बनाए रखती है?'), b('Find where the tan deposits build up. Is it near the steep source or the gentle mouth?', 'देखें पीले निक्षेप कहाँ जमा होते हैं। क्या वे तीव्र स्रोत के पास हैं या समतल मुहाने के पास?')],
  predictions: [
    { id: 'p1', stem: b('Rainfall rises from 30% to 90% (everything else the same). In 40 years the land will be eroded…', 'वर्षा 30% से 90% हो जाती है (बाकी सब वही)। 40 वर्षों में भूमि का अपरदन होगा…'), options: [{ id: 'more', ...b('More', 'अधिक') }, { id: 'less', ...b('Less', 'कम') }, { id: 'same', ...b('The same', 'समान') }],
      run: (S) => { const a = run(S, { rain: 0.3 }).eroded; S.rain = 0.9; const c = run(S, {}).eroded; S.years = 40; return c > a * 1.05 ? 'more' : c < a * 0.95 ? 'less' : 'same'; },
      explain: (S) => ({ en: `Rain adds running water to wash loosened material downslope: ${fmt(run(S, {}).eroded, 0)} units moved now compared with ${fmt(run(S, { rain: 0.3 }).eroded, 0)} at 30% rain.`, hi: `वर्षा बहता जल जोड़ती है जो ढीली सामग्री को ढलान से नीचे बहा देता है: अब ${fmt(run(S, {}).eroded, 0)} इकाई खिसकी, जबकि 30% वर्षा पर ${fmt(run(S, { rain: 0.3 }).eroded, 0)} इकाई।` }) },
    { id: 'p2', stem: b('Along a river, where is most material DEPOSITED?', 'नदी के साथ-साथ अधिकतर पदार्थ कहाँ जमा होता है?'), options: [{ id: 'upper', ...b('Steep upper course', 'तीव्र ऊपरी मार्ग') }, { id: 'lower', ...b('Gentle lower course and mouth', 'समतल निचला मार्ग और मुहाना') }],
      run: (S) => { S.agent = 'river'; S.years = 60; const r = run(S, {}), p0 = G.initialProfile(100); let up = 0, lo = 0; r.profile.forEach((y, i) => { const d = Math.max(0, y - p0[i]); if (i < G.N / 2) up += d; else lo += d; }); return lo >= up ? 'lower' : 'upper'; },
      explain: () => ({ en: 'Where the slope flattens the water slows and can no longer carry its load, so sand and silt settle: floodplains and deltas.', hi: 'जहाँ ढाल समतल होती है वहाँ जल धीमा होकर अपना भार नहीं ढो पाता, इसलिए रेत और गाद बैठ जाती है: बाढ़ के मैदान और डेल्टा।' }) },
  ],
  exit: [
    { id: 'e1', stem: b('Which statement correctly separates weathering from erosion?', 'कौन-सा कथन अपक्षय और अपरदन को सही अलग करता है?'), correct: 'a', options: [
      { id: 'a', ...b('Weathering breaks rock down in place; erosion carries the pieces away.', 'अपक्षय चट्टान को वहीं तोड़ता है; अपरदन टुकड़ों को दूर ले जाता है।') },
      { id: 'b', ...b('Weathering carries rock away; erosion breaks it down in place.', 'अपक्षय चट्टान को दूर ले जाता है; अपरदन उसे वहीं तोड़ता है।'), why: b('That is reversed: breaking down in place is weathering.', 'यह उलटा है: वहीं टूटना अपक्षय है।') },
      { id: 'c', ...b('They are two names for the same process.', 'ये एक ही प्रक्रिया के दो नाम हैं।'), why: b('They are different: one breaks rock, the other moves it.', 'ये अलग हैं: एक चट्टान तोड़ता है, दूसरा उसे हटाता है।') }],
      explain: b('Weathering = breakdown in place. Erosion = removal and transport. Deposition = laying material down.', 'अपक्षय = वहीं टूटना। अपरदन = हटाना और ढोना। निक्षेपण = सामग्री जमा करना।'), hint: b('Which one needs a moving agent such as water, wind or ice?', 'किसे जल, पवन या हिम जैसे गतिशील कारक की आवश्यकता होती है?') },
    { id: 'e2', stem: b('Why do forests reduce soil erosion on a hillside?', 'वन पहाड़ी ढलान पर मिट्टी का कटाव क्यों घटाते हैं?'), correct: 'roots', options: [
      { id: 'roots', ...b('Roots bind the soil and leaves soften the impact of rain.', 'जड़ें मिट्टी को बाँधती हैं और पत्ते वर्षा की चोट को कम करते हैं।') },
      { id: 'more', ...b('Forests bring more rain, which holds soil down.', 'वन अधिक वर्षा लाते हैं जो मिट्टी को दबाए रखती है।'), why: b('Rain on bare soil causes more erosion, not less. Check the vegetation slider.', 'नंगी मिट्टी पर वर्षा से अपरदन अधिक होता है, कम नहीं। वनस्पति स्लाइडर देखें।') }],
      explain: b('Plant cover protects and holds the surface, so the same rain moves much less soil.', 'वनस्पति आवरण सतह की रक्षा करता और उसे थामे रखता है, इसलिए उसी वर्षा से बहुत कम मिट्टी खिसकती है।'), hint: b('Compare 0% and 100% vegetation on the graph.', 'ग्राफ़ पर 0% और 100% वनस्पति की तुलना करें।') },
  ],
  reflect: b('Name a place near you where soil is being removed or deposited and say which agent is responsible.', 'अपने आसपास का कोई स्थान बताएँ जहाँ मिट्टी हट रही या जमा हो रही है और कौन-सा कारक ज़िम्मेदार है।'),
};
