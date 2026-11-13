// T16 Smart Ways to Manage Your Finances lab specs (L1–L5).
import { Chart } from '../../engines/chart.js';
import * as F from '../../engines/domain/finance.js';
import { esc, fmt } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });
const rs = (v) => `₹${fmt(v, 0)}`;

// ------------------------------------------------------------------ T16.L1 budget
export const budget = {
  id: 'T16.L1',
  objective: b('Plan a monthly budget by splitting income into needs, wants and savings, and see what happens when spending is larger than income.', 'आय को आवश्यकताओं, इच्छाओं और बचत में बाँटकर मासिक बजट बनाएँ, और देखें कि खर्च आय से अधिक होने पर क्या होता है।'),
  note: { kind: 'fictional', en: 'A fictional household income. The 50-30-20 split is a common rule of thumb, not a law.', hi: 'काल्पनिक पारिवारिक आय। 50-30-20 विभाजन एक प्रचलित अनुमान-नियम है, कानून नहीं।' },
  init: () => ({ income: 20000, needs: 11000, wants: 5000 }),
  controls: [
    { id: 'income', type: 'slider', label: b('Monthly income (₹)', 'मासिक आय (₹)'), min: 5000, max: 60000, step: 1000, fmt: rs },
    { id: 'needs', type: 'slider', label: b('Needs: food, rent, school, transport (₹)', 'आवश्यकताएँ: भोजन, किराया, शिक्षा, यातायात (₹)'), min: 0, max: 60000, step: 500, fmt: rs },
    { id: 'wants', type: 'slider', label: b('Wants: outings, gadgets, treats (₹)', 'इच्छाएँ: सैर-सपाटा, गैजेट, मिठाई (₹)'), min: 0, max: 40000, step: 500, fmt: rs },
  ],
  view(S) {
    const r = F.budgetSplit(S), tgt = F.RULE_50_30_20, seg = (v) => Math.max(0, v) / S.income;
    const bar = (y, vals, label) => { let x = 20, g = `<text class="txt sm b" x="20" y="${y - 6}">${esc(label)}</text>`; for (const [v, cls, t] of vals) { const w = Math.max(0, v) * 600; g += `<rect class="${cls}" x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="34"/>${w > 54 ? `<text class="txt sm b" x="${(x + w / 2).toFixed(1)}" y="${y + 21}" text-anchor="middle">${esc(t)}</text>` : ''}`; x += w; } return g; };
    const you = [[seg(S.needs), 'bar-n', `${P('Needs', 'आवश्यकता')} ${fmt(r.needsPct, 0)}%`], [seg(S.wants), 'bar-w', `${P('Wants', 'इच्छा')} ${fmt(r.wantsPct, 0)}%`], [Math.max(0, r.savings) / S.income, 'bar-s', `${P('Savings', 'बचत')} ${fmt(Math.max(0, r.savingsPct), 0)}%`]];
    const ref = [[tgt.needs / 100, 'bar-n', `${tgt.needs}%`], [tgt.wants / 100, 'bar-w', `${tgt.wants}%`], [tgt.savings / 100, 'bar-s', `${tgt.savings}%`]];
    const g = bar(34, you, P('Your plan', 'आपकी योजना')) + bar(110, ref, P('Rule of thumb 50 / 30 / 20', 'अनुमान-नियम 50 / 30 / 20')) + (r.deficit ? `<text class="txt b" x="20" y="180" fill="var(--bad)">${esc(P('Spending is more than income!', 'खर्च आय से अधिक है!'))}</text>` : '');
    const yr = Math.max(0, r.savings) * 12;
    return {
      plate: {
        src: 'assets/images/plates/t16-finance.jpg',
        en: 'Household financial ledger (गृहस्थी खाता), clay gullak & savings — tap pins to compare 50-30-20 vs surplus vs overspending.',
        hi: 'गृहस्थी खाता बही, मिट्टी की गुल्लक व बचत — 50-30-20 संतुलन व अधिक खर्च परखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 38, y: 72, en: 'Balanced 50 / 30 / 20 Budget', hi: 'संतुलित 50 / 30 / 20 बजट', detail: b('₹10,000 needs + ₹6,000 wants leaves ₹4,000 (20%) monthly savings.', '₹10,000 आवश्यकता + ₹6,000 इच्छा के बाद ₹4,000 (20%) मासिक बचत बचती है।'), set: { income: 20000, needs: 10000, wants: 6000 } },
          { x: 50, y: 26, en: 'Gullak Booster (40% Saved)', hi: 'गुल्लक बचत संवर्धन (40% बचत)', detail: b('Trimming wants to ₹3,000 builds ₹96,000/yr emergency cushion!', 'इच्छाएँ ₹3,000 रखने से सालाना ₹96,000 का मज़बूत सुरक्षा कोष बनता है!'), set: { income: 20000, needs: 9000, wants: 3000 } },
          { x: 72, y: 74, en: 'Overspending Deficit Debt', hi: 'अति-व्यय से कर्ज़ घाटा', detail: b('When Needs + Wants exceed ₹20,000, household falls into debt.', 'जब आवश्यकता + इच्छा ₹20,000 पार करें, तो उधार लेना पड़ता है।'), set: { income: 20000, needs: 13000, wants: 10000 } },
        ],
      },
      svg: `<svg viewBox="0 0 640 195" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Savings ${r.savings} rupees a month.`, lines: [
      r.deficit ? { en: `Needs + wants = ${rs(S.needs + S.wants)} is ${rs(-r.savings)} MORE than income. The gap must come from savings or borrowing, and borrowing costs interest.`, hi: `आवश्यकताएँ + इच्छाएँ = ${rs(S.needs + S.wants)}, आय से ${rs(-r.savings)} अधिक है। यह कमी बचत या उधार से पूरी होगी, और उधार पर ब्याज लगता है।`, cls: 'warn' }
        : { en: `Left for savings: ${rs(r.savings)} a month (${fmt(r.savingsPct, 0)}% of income), about ${rs(yr)} a year.`, hi: `बचत के लिए बचा: ${rs(r.savings)} प्रति माह (आय का ${fmt(r.savingsPct, 0)}%), लगभग ${rs(yr)} प्रति वर्ष।`, cls: r.savingsPct >= 20 ? 'balanced' : '' },
      { en: 'Needs are what you must pay to live and learn; wants are nice to have. Savings protect you against shocks like illness.', hi: 'आवश्यकताएँ वे हैं जो जीने और सीखने के लिए ज़रूरी हैं; इच्छाएँ अच्छी लगने वाली चीज़ें हैं। बचत बीमारी जैसे झटकों से बचाती है।', cls: 'note' }] };
  },
  discover: [b('Raise the wants until savings reach zero. What gets squeezed?', 'इच्छाएँ तब तक बढ़ाएँ जब तक बचत शून्य न हो जाए। किस पर दबाव पड़ता है?'), b('Lower the income by ₹5,000 (a shock). What must you cut first, needs or wants?', 'आय ₹5,000 घटाएँ (एक झटका)। पहले क्या घटाना चाहिए, आवश्यकताएँ या इच्छाएँ?')],
  predictions: [{ id: 'p1', stem: b('Income ₹20,000, needs ₹11,000, wants ₹5,000. How much is left to save each month?', 'आय ₹20,000, आवश्यकताएँ ₹11,000, इच्छाएँ ₹5,000। हर महीने बचत के लिए कितना बचता है?'), options: [opt('4k', '₹4,000', '₹4,000'), opt('9k', '₹9,000', '₹9,000'), opt('0', 'Nothing', 'कुछ नहीं')],
    run: (S) => { S.income = 20000; S.needs = 11000; S.wants = 5000; const s = F.budgetSplit(S).savings; return s === 4000 ? '4k' : s === 9000 ? '9k' : '0'; }, explain: () => ({ en: '₹20,000 − ₹11,000 − ₹5,000 = ₹4,000, which is 20% of income.', hi: '₹20,000 − ₹11,000 − ₹5,000 = ₹4,000, जो आय का 20% है।' }) }],
  exit: [{ id: 'e1', stem: b('Which is a NEED rather than a want?', 'इनमें से कौन आवश्यकता है, इच्छा नहीं?'), correct: 'food', options: [
    { id: 'food', ...b('Basic food and school fees', 'बुनियादी भोजन और स्कूल की फ़ीस') }, { id: 'phone', ...b('A new phone when the old one still works', 'पुराना फ़ोन चलता हो तब भी नया फ़ोन'), why: b('If the old phone works, a new one is a want.', 'यदि पुराना फ़ोन चलता है तो नया फ़ोन इच्छा है।') }],
    explain: b('Needs are the things you cannot go without to live and learn.', 'आवश्यकताएँ वे चीज़ें हैं जिनके बिना जीना और सीखना संभव नहीं।'), hint: b('Ask: could we manage without it this month?', 'पूछें: क्या हम इस महीने इसके बिना काम चला सकते हैं?') }],
  reflect: b('Make a one-week plan for ₹500 of pocket money: needs, wants and savings.', '₹500 जेब-खर्च की एक सप्ताह की योजना बनाएँ: आवश्यकताएँ, इच्छाएँ और बचत।'),
};
// ------------------------------------------------------------------ T16.L3 interest
export const interest = {
  id: 'T16.L3',
  objective: b('Compare simple and compound interest over time and see why starting to save early matters.', 'समय के साथ साधारण और चक्रवृद्धि ब्याज की तुलना करें और देखें कि जल्दी बचत शुरू करना क्यों मायने रखता है।'),
  note: { kind: 'fictional', en: 'The interest rates here are examples only, not rates offered by any bank or scheme.', hi: 'यहाँ ब्याज दरें केवल उदाहरण हैं, किसी बैंक या योजना की दरें नहीं।' },
  init: () => ({ principal: 10000, rate: 8, years: 20 }),
  controls: [
    { id: 'principal', type: 'slider', label: b('Money saved at the start (₹)', 'आरंभ में जमा धन (₹)'), min: 1000, max: 100000, step: 1000, fmt: rs },
    { id: 'rate', type: 'slider', label: b('Interest rate per year (%)', 'प्रति वर्ष ब्याज दर (%)'), min: 1, max: 20, step: 0.5, fmt: (v) => `${v}%` },
    { id: 'years', type: 'slider', label: b('Years', 'वर्ष'), min: 1, max: 40, step: 1 },
  ],
  view(S) {
    const sr = F.interestSeries(S.principal, S.rate, S.years), end = sr[sr.length - 1], d = F.doublingYears(S.rate);
    const ymax = Math.ceil(end.compound / 10000) * 10000 || 10000;
    const ch = new Chart({ xMax: S.years, yMax: ymax, xLabel: P('Years', 'वर्ष'), yLabel: P('Amount (₹)', 'राशि (₹)'), xTicks: Math.min(S.years, 8), yTicks: 5 });
    ch.axes(); ch.line(sr.map((p) => [p.year, p.simple]), 'curve s'); ch.line(sr.map((p) => [p.year, p.compound]), 'curve g');
    ch.text(S.years, end.compound, P('compound', 'चक्रवृद्धि'), 'lbl', 'end', -4, -8); ch.text(S.years, end.simple, P('simple', 'साधारण'), 'lbl', 'end', -4, 18);
    return {
      plate: {
        src: 'assets/images/plates/t16-finance.jpg',
        en: 'Compounding wealth over time — tap pins to compare 5 years vs 20 years vs 35 years of steady saving.',
        hi: 'समय के साथ चक्रवृद्धि वृद्धि — 5 वर्ष, 20 वर्ष व 35 वर्ष की बचत तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 38, y: 72, en: '5 Years (Curves Stay Close)', hi: '5 वर्ष (अंतर अभी छोटा)', detail: b('Early on simple and compound interest look nearly alike — patience pays later!', 'शुरू में साधारण और चक्रवृद्धि ब्याज लगभग बराबर दिखते हैं!'), set: { principal: 10000, rate: 8, years: 5 } },
          { x: 50, y: 26, en: '20 Years at 8% (Doubles ×2.2)', hi: '8% पर 20 वर्ष (तीव्र उछाल)', detail: b('Rule of 72 (~9 yrs to double) compounds past ₹46,000 on ₹10,000 saved!', '72 के नियम से धन दोगुना होकर तेज़ी से बढ़ता है!'), set: { principal: 10000, rate: 8, years: 20 } },
          { x: 72, y: 74, en: '35 Years at 12% (Snowball Curve)', hi: '12% पर 35 वर्ष (विशाल छलांग)', detail: b('Interest-on-interest rockets ₹10,000 past ₹5.2 lakh over 35 years!', 'ब्याज पर ब्याज 35 वर्षों में ₹10,000 को ₹5.2 लाख से ऊपर ले जाता है!'), set: { principal: 10000, rate: 12, years: 35 } },
        ],
      },
      svg: ch.html({ label: P('Simple and compound interest', 'साधारण और चक्रवृद्धि ब्याज') }), aria: `After ${S.years} years: simple ${fmt(end.simple, 0)}, compound ${fmt(end.compound, 0)}.`, lines: [
      { en: `After ${S.years} years: simple interest gives ${rs(end.simple)}; compound interest gives ${rs(end.compound)}, which is ${rs(end.compound - end.simple)} more.`, hi: `${S.years} वर्ष बाद: साधारण ब्याज से ${rs(end.simple)}; चक्रवृद्धि ब्याज से ${rs(end.compound)}, जो ${rs(end.compound - end.simple)} अधिक है।` },
      { en: 'Simple interest is paid only on the original sum. Compound interest is also paid on interest already earned, so the curve bends upward.', hi: 'साधारण ब्याज केवल मूल राशि पर मिलता है। चक्रवृद्धि ब्याज पहले से मिले ब्याज पर भी मिलता है, इसलिए वक्र ऊपर की ओर मुड़ता है।', cls: 'note' },
      { en: `At ${S.rate}% money doubles in about ${fmt(d.exact, 1)} years (rule of 72: 72 ÷ ${S.rate} = ${fmt(d.rule72, 1)}).`, hi: `${S.rate}% पर धन लगभग ${fmt(d.exact, 1)} वर्षों में दोगुना होता है (72 का नियम: 72 ÷ ${S.rate} = ${fmt(d.rule72, 1)})।`, cls: 'balanced' }] };
  },
  discover: [b('Set years to 5, then 40. When does the gap between the two curves become large?', 'वर्ष 5 और फिर 40 करें। दोनों वक्रों का अंतर कब बड़ा हो जाता है?'), b('Keep the years at 30 and compare 4% with 12%. What does a higher rate do to the compound curve?', 'वर्ष 30 रखकर 4% और 12% की तुलना करें। ऊँची दर चक्रवृद्धि वक्र का क्या करती है?')],
  predictions: [{ id: 'p1', stem: b('₹10,000 earns 8% a year for 30 years. Compound interest will give about…', '₹10,000 पर 30 वर्ष तक 8% प्रति वर्ष। चक्रवृद्धि ब्याज से लगभग मिलेगा…'), options: [opt('34k', '₹34,000 (about the same as simple)', '₹34,000 (लगभग साधारण जितना)'), opt('100k', '₹1,00,000 (about 10 times)', '₹1,00,000 (लगभग 10 गुना)'), opt('300k', '₹3,00,000 or more', '₹3,00,000 या अधिक')],
    run: (S) => { S.principal = 10000; S.rate = 8; S.years = 30; const v = F.compoundAmount(10000, 8, 30); return v < 50000 ? '34k' : v < 200000 ? '100k' : '300k'; }, explain: () => ({ en: `₹10,000 × 1.08³⁰ = ${rs(F.compoundAmount(10000, 8, 30))}, versus ${rs(F.simpleAmount(10000, 8, 30))} with simple interest: interest on interest makes the difference.`, hi: `₹10,000 × 1.08³⁰ = ${rs(F.compoundAmount(10000, 8, 30))}, जबकि साधारण ब्याज से ${rs(F.simpleAmount(10000, 8, 30))}: ब्याज पर ब्याज से अंतर बनता है।` }) }],
  exit: [{ id: 'e1', stem: b('Two friends save the same amount at the same rate; one starts 10 years earlier. Why does the early starter end with much more?', 'दो मित्र समान राशि समान दर पर बचाते हैं; एक 10 वर्ष पहले शुरू करता है। जल्दी शुरू करने वाले के पास बहुत अधिक क्यों होता है?'), correct: 'a', options: [
    { id: 'a', ...b('Compound interest has more time to earn interest on interest.', 'चक्रवृद्धि ब्याज को ब्याज पर ब्याज कमाने का अधिक समय मिलता है।') }, { id: 'b', ...b('Banks pay a higher rate to early savers.', 'बैंक जल्दी बचाने वालों को ऊँची दर देते हैं।'), why: b('The rate is the same; the extra years are what compound.', 'दर समान है; अतिरिक्त वर्ष ही चक्रवृद्धि करते हैं।') }],
    explain: b('Time is the key ingredient of compounding.', 'समय चक्रवृद्धि का मुख्य घटक है।'), hint: b('Look at how the green curve steepens in later years.', 'देखें हरा वक्र बाद के वर्षों में कैसे तीखा होता है।') }],
  reflect: b('Why might a person choose to start saving a small amount now rather than a larger amount later?', 'कोई व्यक्ति बाद में बड़ी राशि के बजाय अभी छोटी राशि बचाना क्यों चुन सकता है?'),
};
// ------------------------------------------------------------------ T16.L2 inflation
export const inflation = {
  id: 'T16.L2',
  objective: b('Show how rising prices (inflation) reduce what a fixed amount of money can buy, and why interest must beat inflation to grow real wealth.', 'दिखाएँ कि बढ़ती कीमतें (मुद्रास्फीति) किसी निश्चित धनराशि की क्रय-शक्ति कैसे घटाती हैं, और वास्तविक संपत्ति बढ़ाने के लिए ब्याज को मुद्रास्फीति से अधिक क्यों होना चाहिए।'),
  note: { kind: 'fictional', en: 'Inflation and interest rates are examples; real rates change over time and place.', hi: 'मुद्रास्फीति और ब्याज दरें उदाहरण हैं; वास्तविक दरें समय और स्थान के साथ बदलती हैं।' },
  init: () => ({ infl: 6, nominal: 7, years: 10 }),
  controls: [
    { id: 'infl', type: 'slider', label: b('Inflation per year (%)', 'प्रति वर्ष मुद्रास्फीति (%)'), min: 0, max: 15, step: 0.5, fmt: (v) => `${v}%` },
    { id: 'nominal', type: 'slider', label: b('Interest earned per year (%)', 'प्रति वर्ष अर्जित ब्याज (%)'), min: 0, max: 15, step: 0.5, fmt: (v) => `${v}%` },
    { id: 'years', type: 'slider', label: b('Years', 'वर्ष'), min: 1, max: 30, step: 1 },
  ],
  view(S) {
    const rows = Array.from({ length: S.years + 1 }, (_, y) => ({ y, cash: F.realValue(1000, S.infl, y), saved: F.realValue(F.compoundAmount(1000, S.nominal, y), S.infl, y), price: F.priceAfter(100, S.infl, y) }));
    const ymax = Math.max(1200, Math.ceil(Math.max(...rows.map((r) => r.saved)) / 200) * 200);
    const ch = new Chart({ xMax: S.years, yMax: ymax, xLabel: P('Years', 'वर्ष'), yLabel: P('Buying power of ₹1,000 (today’s ₹)', '₹1,000 की क्रय-शक्ति (आज के ₹)'), xTicks: Math.min(S.years, 6), yTicks: 5 });
    ch.axes(); ch.hline(1000, 'guide', 0, S.years); ch.line(rows.map((r) => [r.y, r.cash]), 'curve d'); ch.line(rows.map((r) => [r.y, r.saved]), 'curve g');
    const last = rows[rows.length - 1], rr = F.realRate(S.nominal, S.infl);
    ch.text(S.years, last.cash, P('kept as cash', 'नकद रखा'), 'lbl', 'end', -4, 18); ch.text(S.years, last.saved, P('saved with interest', 'ब्याज के साथ बचाया'), 'lbl', 'end', -4, -8);
    return {
      plate: {
        src: 'assets/images/plates/t16-inflation.jpg',
        en: 'Cash box, grocery basket & compound savings tree — tap pins to see cupboard cash shrink vs inflation-beating saving.',
        hi: 'नकद बक्सा, राशन टोकरी व बढ़ता बचत पौधा — महँगाई में नकद घटने बनाम चक्रवृद्धि सुरक्षा हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 58, en: 'Idle Cash Eroding (0% vs 6% Infl)', hi: 'अलमारी में नकद (0% ब्याज)', detail: b('₹1,000 kept as notes buys half as much after ~12 years at 6% inflation!', '6% महँगाई पर अलमारी में रखे नोटों की क्रय-शक्ति 12 वर्ष में आधी रह जाती है!'), set: { infl: 6, nominal: 0, years: 15 } },
          { x: 54, y: 42, en: 'Negative Real Return (4% vs 6%)', hi: 'नकारात्मक वास्तविक लाभ (4% vs 6%)', detail: b('Even earning 4% interest loses real purchasing power if prices rise at 6%!', 'यदि कीमतें 6% बढ़ें और ब्याज 4% मिले, तब भी क्रय-शक्ति घटती है!'), set: { infl: 6, nominal: 4, years: 15 } },
          { x: 76, y: 58, en: 'Positive Real Growth (9% vs 6%)', hi: 'वास्तविक धन वृद्धि (9% vs 6%)', detail: b('Beating inflation grows real purchasing power steadily over time.', 'मुद्रास्फीति से अधिक दर पर ही वास्तविक क्रय-शक्ति बढ़ती है।'), set: { infl: 6, nominal: 9, years: 15 } },
        ],
      },
      svg: ch.html({ label: P('Buying power over time', 'समय के साथ क्रय-शक्ति') }), aria: `After ${S.years} years ₹1000 cash buys ${fmt(last.cash, 0)} rupees worth; saved buys ${fmt(last.saved, 0)}.`, lines: [
      { en: `A basket costing ₹100 today will cost about ${rs(last.price)} after ${S.years} years. So ₹1,000 kept as cash buys only what ₹${fmt(last.cash, 0)} buys today.`, hi: `जिस टोकरी की कीमत आज ₹100 है, ${S.years} वर्ष बाद लगभग ${rs(last.price)} होगी। इसलिए नकद रखे ₹1,000 से उतना ही ख़रीदा जा सकेगा जितना आज ₹${fmt(last.cash, 0)} से।` },
      rr >= 0 ? { en: `Interest (${S.nominal}%) beats inflation (${S.infl}%): the real return is ${fmt(rr, 1)}% a year, so buying power grows.`, hi: `ब्याज (${S.nominal}%) मुद्रास्फीति (${S.infl}%) से अधिक है: वास्तविक प्रतिफल ${fmt(rr, 1)}% प्रति वर्ष है, इसलिए क्रय-शक्ति बढ़ती है।`, cls: 'balanced' }
        : { en: `Inflation (${S.infl}%) is higher than interest (${S.nominal}%): the real return is ${fmt(rr, 1)}% a year, so even saved money loses buying power.`, hi: `मुद्रास्फीति (${S.infl}%) ब्याज (${S.nominal}%) से अधिक है: वास्तविक प्रतिफल ${fmt(rr, 1)}% प्रति वर्ष है, इसलिए बचाए गए धन की क्रय-शक्ति भी घटती है।`, cls: 'warn' }] };
  },
  discover: [b('Set inflation to 0%. What happens to the cash line? Now set it to 10%.', 'मुद्रास्फीति 0% करें। नकद रेखा का क्या होता है? अब इसे 10% करें।'), b('Find an interest rate that just keeps buying power flat for 6% inflation.', 'वह ब्याज दर खोजें जो 6% मुद्रास्फीति पर क्रय-शक्ति को ठीक स्थिर रखे।')],
  predictions: [{ id: 'p1', stem: b('With 6% inflation for 10 years, ₹1,000 kept in a cupboard buys what ₹… buys today?', '10 वर्ष तक 6% मुद्रास्फीति में अलमारी में रखे ₹1,000 से उतना ख़रीदा जा सकेगा जितना आज ₹… से?'), options: [opt('800', 'About ₹800', 'लगभग ₹800'), opt('560', 'About ₹560', 'लगभग ₹560'), opt('1000', 'Still ₹1,000', 'अब भी ₹1,000')],
    run: (S) => { S.infl = 6; S.years = 10; const v = F.realValue(1000, 6, 10); return v > 900 ? '1000' : v > 700 ? '800' : '560'; }, explain: () => ({ en: `₹1,000 ÷ 1.06¹⁰ ≈ ${rs(F.realValue(1000, 6, 10))}: the notes are the same but each one buys less.`, hi: `₹1,000 ÷ 1.06¹⁰ ≈ ${rs(F.realValue(1000, 6, 10))}: नोट वही हैं पर हर नोट से कम ख़रीदा जाता है।` }) }],
  exit: [{ id: 'e1', stem: b('Interest is 5% and inflation is 7%. Over time your savings…', 'ब्याज 5% और मुद्रास्फीति 7% है। समय के साथ आपकी बचत…'), correct: 'lose', options: [
    { id: 'lose', ...b('Grow in rupees but lose buying power.', 'रुपयों में बढ़ती है पर क्रय-शक्ति खोती है।') }, { id: 'gain', ...b('Gain buying power.', 'क्रय-शक्ति पाती है।'), why: b('Prices rise faster than your savings, so you can buy less.', 'कीमतें आपकी बचत से तेज़ बढ़ती हैं, इसलिए आप कम ख़रीद पाते हैं।') }],
    explain: b('The real return is about −1.9% a year when inflation is higher than interest.', 'जब मुद्रास्फीति ब्याज से अधिक हो तो वास्तविक प्रतिफल लगभग −1.9% प्रति वर्ष होता है।'), hint: b('Compare the two rates in the readout.', 'आँकड़े में दोनों दरों की तुलना करें।') }],
  reflect: b('Ask an elder what a common item cost when they were young and compare it with today’s price.', 'किसी बुज़ुर्ग से पूछें कि उनकी युवावस्था में कोई सामान्य वस्तु कितने की थी और आज की कीमत से तुलना करें।'),
};


// ------------------------------------------------------------------ T16.L4 Instruments, risk-return & insurance pool
export const riskReturn = {
  id: 'T16.L4',
  objective: b('Compare savings accounts, fixed deposits, government bonds, and equity index funds across risk and return, and calculate how insurance pools risk across many households.', 'बचत खाता, सावधि जमा (FD), सरकारी बॉन्ड और इक्विटी इंडेक्स फंड के बीच जोखिम व प्रतिफल की तुलना करें, और बीमा द्वारा जोखिम-विभाजन की गणना करें।'),
  note: { kind: 'fictional', en: 'Hypothetical illustrative returns and fictional 200-family insurance risk pool — not live bank or market rates.', hi: 'काल्पनिक प्रतिफल दरें और 200 परिवारों का काल्पनिक बीमा जोखिम-पूल — ये वास्तविक बैंक या बाज़ार दरें नहीं हैं।' },
  init: () => ({ horizon: 10, poolSize: 200, claimProbPct: 3 }),
  controls: [
    { id: 'horizon', type: 'slider', label: b('Investment horizon (years)', 'निवेश अवधि (वर्ष)'), min: 1, max: 20, step: 1 },
    { id: 'poolSize', type: 'slider', label: b('Families in insurance pool', 'बीमा पूल में परिवार'), min: 50, max: 500, step: 50 },
    { id: 'claimProbPct', type: 'slider', label: b('Annual accident risk (%)', 'वार्षिक दुर्घटना जोखिम (%)'), min: 1, max: 10, step: 1, fmt: (v) => `${v}%` },
  ],
  view(S) {
    const pool = F.insurancePool({ poolSize: S.poolSize, claimProbPct: S.claimProbPct, claimAmount: 40000 });
    // Risk-Return 2D Quadrant Scatter + Horizon Bar Growth + Insurance Pool Shield Banner
    let g = `<rect x="16" y="12" width="608" height="170" rx="10" fill="#f8fafc" stroke="var(--line)"/>`
      + `<line x1="64" y1="158" x2="600" y2="158" stroke="var(--ink)" stroke-width="1.5"/><line x1="64" y1="22" x2="64" y2="158" stroke="var(--ink)" stroke-width="1.5"/>`
      + `<text class="txt sm mut" x="330" y="175" text-anchor="middle">${esc(P('Volatility / Risk Index →', 'जोखिम सूचकांक →'))}</text>`
      + `<text class="txt sm mut" transform="translate(28,90) rotate(-90)" text-anchor="middle">${esc(P(`Value of ₹10,000 (${S.horizon}y)`, `${S.horizon} वर्ष में ₹10,000`))}</text>`;
    const cols = ['#0ea5e9', '#15803d', '#0369a1', '#b45309'];
    const dots = [];
    const curvePts = F.INSTRUMENTS.map((ins, i) => {
      const val = F.compoundAmount(10000, ins.returnPct, S.horizon);
      const cx = (78 + (ins.risk / 75) * 490).toFixed(1);
      const cy = (154 - Math.min(1, val / 85000) * 124).toFixed(1);
      dots.push(`<circle cx="${cx}" cy="${cy}" r="${Math.min(20, 9 + val / 8000).toFixed(1)}" fill="${cols[i % cols.length]}" opacity=".86" stroke="#fff" stroke-width="2"/>`
        + `<text class="txt sm b" x="${cx}" y="${(Number(cy) - 14).toFixed(1)}" text-anchor="middle">${esc(P(ins.en.split(' (')[0], ins.hi.split(' (')[0]))} (${rs(val)})</text>`);
      return `${cx},${cy}`;
    });
    g += `<polyline points="${curvePts.join(' ')}" fill="none" stroke="var(--mut)" stroke-width="2" stroke-dasharray="5 4"/>` + dots.join('');
    g += `<rect x="16" y="192" width="608" height="40" rx="10" fill="#dcfce7" stroke="#15803d" stroke-width="1.5"/>`
      + `<text class="txt sm b" x="320" y="217" text-anchor="middle">${esc(P(`🛡️ Insurance Pool: ${S.poolSize} families × ₹40,000 cover → Fair premium ≈ ${rs(pool.fairPremium)}/yr`, `🛡️ बीमा पूल: ${S.poolSize} परिवार × ₹40,000 सुरक्षा → उचित प्रीमियम ≈ ${rs(pool.fairPremium)}/वर्ष`))}</text>`;
    return {
      plate: {
        src: 'assets/images/plates/t16-inflation.jpg',
        en: 'Emergency cash, growing compound sapling & brass insurance shield — tap pins to match horizon & risk protection.',
        hi: 'आपातकालीन नकद, बढ़ता निवेश पौधा व बीमा कवच — अवधि व जोखिम सुरक्षा मिलाने हेतु पिन पर टैप करें।',
        spots: [
          { x: 24, y: 58, en: '2-Year Horizon (Safety First)', hi: '2-वर्षीय लक्ष्य (सुरक्षा पहले)', detail: b('Short goals need steady Savings/FD rather than short-term equity swings.', 'अल्पकालिक लक्ष्यों के लिए स्थिर बचत या FD उपयुक्त है।'), set: { horizon: 2, poolSize: 200, claimProbPct: 3 } },
          { x: 54, y: 42, en: '18-Year Wealth Gap (Index Curve)', hi: '18-वर्षीय दीर्घकालिक वृद्धि', detail: b('Over decades higher-return compounding pulls dramatically ahead of plain cash!', 'दशकों में उच्च प्रतिफल चक्रवृद्धि सुरक्षित विकल्पों से कहीं आगे निकलता है!'), set: { horizon: 18, poolSize: 200, claimProbPct: 3 } },
          { x: 76, y: 58, en: 'High-Risk Insurance Shield (8%)', hi: 'उच्च जोखिम बीमा पूल (8%)', detail: b('Watch 200 households pool together to absorb frequent ₹40,000 shocks safely.', '200 परिवार मिलकर ₹40,000 के संकट को सहज वार्षिक प्रीमियम में बाँट लेते हैं।'), set: { poolSize: 200, claimProbPct: 8 } },
        ],
      },
      svg: `<svg viewBox="0 0 640 242" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Over ${S.horizon} years ₹10,000 grows fastest in higher-risk index fund; insurance fair premium ${pool.fairPremium} rupees`,
      lines: [
        { en: `Risk-Return Trade-off (${S.horizon} yrs on ₹10,000): Safe FDs/Bonds give steady modest growth, while Equity Index Funds offer higher average returns with short-term volatility (risk 65).`, hi: `जोखिम-प्रतिफल संबंध (${S.horizon} वर्ष में ₹10,000): FD व बॉन्ड स्थिर बढ़त देते हैं, जबकि इंडेक्स फंड अधिक औसत लाभ के साथ अल्पकालिक उतार-चढ़ाव (जोखिम 65) रखते हैं।`, cls: 'note' },
        { en: `Insurance Pooling: Instead of 1 unlucky family facing a catastrophic ₹40,000 bill alone, ${S.poolSize} families each chip in ${rs(pool.fairPremium)}/year to cover ~${pool.expectedClaims} claims.`, hi: `बीमा जोखिम-विभाजन: किसी 1 परिवार पर ₹40,000 का भारी संकट पड़ने के बजाय ${S.poolSize} परिवार प्रति वर्ष ~${rs(pool.fairPremium)} मिलाकर ~${pool.expectedClaims} दावों का भार बाँट लेते हैं।`, cls: 'balanced' },
      ],
    };
  },
  discover: [
    b('Compare Savings A/c vs Index Fund at 1 year vs 20 years: why do short-term goals need low-risk FDs rather than volatile stocks?', '1 वर्ष बनाम 20 वर्ष पर बचत खाता और इंडेक्स फंड की तुलना करें: अल्पकालिक लक्ष्यों के लिए कम जोखिम वाली FD क्यों बेहतर है?'),
    b('Raise annual accident risk from 2% to 8% and see how the fair premium scales proportionally.', 'वार्षिक जोखिम 2% से 8% करके देखें कि उचित प्रीमियम कैसे बढ़ता है।'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('If 200 families share a ₹40,000 emergency risk that strikes 3% of families each year (6 claims total), what is each family’s fair yearly share?', 'यदि 200 परिवार ₹40,000 का वार्षिक जोखिम साझा करें जो हर वर्ष 3% परिवारों (कुल 6 दावे) को प्रभावित करता है, तो प्रति परिवार उचित हिस्सा कितना होगा?'),
    options: [opt('1200', '₹1,200/year (shared across 200 families)', '₹1,200/वर्ष (200 परिवारों में बँटा)'), opt('40000', '₹40,000/year', '₹40,000/वर्ष')],
    run: (S) => { S.poolSize = 200; S.claimProbPct = 3; return F.insurancePool({ poolSize: 200, claimProbPct: 3, claimAmount: 40000 }).fairPremium === 1200 ? '1200' : '40000'; },
    explain: () => b('6 expected claims × ₹40,000 = ₹2,40,000 total pool ÷ 200 families = ₹1,200 each — turning catastrophe into a predictable cost.', '6 संभावित दावे × ₹40,000 = ₹2,40,000 ÷ 200 परिवार = ₹1,200 प्रति परिवार।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Which rule describes the general relationship between risk and expected return?', 'जोखिम और संभावित प्रतिफल के बीच सामान्य संबंध कौन-सा नियम बताता है?'),
    correct: 'up',
    options: [
      opt('up', 'Higher potential long-term returns generally carry higher risk of short-term loss or fluctuation.', 'उच्च दीर्घकालिक प्रतिफल की संभावना के साथ सामान्यतः अल्पकालिक उतार-चढ़ाव व जोखिम भी अधिक होता है।'),
      opt('free', 'High returns always come with zero risk.', 'उच्च प्रतिफल सदैव शून्य जोखिम के साथ आता है।', b('Guaranteed high returns with zero risk are usually a warning sign of financial fraud!', 'शून्य जोखिम में अत्यधिक निश्चित प्रतिफल अक्सर वित्तीय धोखाधड़ी का संकेत होता है!')),
    ],
    explain: b('Diversification across safe instruments (emergency FD) and long-term investments balances risk and goals.', 'आपातकालीन FD और दीर्घकालिक निवेश में विविधीकरण जोखिम और लक्ष्य को संतुलित करता है।'),
    hint: b('Compare the Risk number next to each bar.', 'प्रत्येक पट्टी के आगे दी गई जोखिम संख्या देखें।'),
  }],
  reflect: b('Why should a family build an emergency Fixed Deposit and buy health insurance BEFORE chasing high-risk investments?', 'उच्च जोखिम वाले निवेश से पहले किसी परिवार को आपातकालीन बचत व स्वास्थ्य बीमा क्यों रखना चाहिए?'),
};

// ------------------------------------------------------------------ T16.L5 Income tax concept flow (strictly unitless conceptual slabs)
export const taxFlow = {
  id: 'T16.L5',
  objective: b('Understand the concept of personal income tax, progressive slab tiers, and how citizen taxes fund shared public goods like schools, roads, and healthcare.', 'व्यक्तिगत आयकर, प्रगतिशील कर-स्तरों (स्लैब) की अवधारणा और नागरिकों के कर से विद्यालय, सड़कें व स्वास्थ्य सेवाएँ कैसे चलती हैं, इसे समझें।'),
  note: { kind: 'fictional', en: 'Strictly conceptual unitless income-slab illustration — NOT current statutory Income Tax slabs (consult latest official Finance Act for exact figures).', hi: 'केवल अवधारणात्मक इकाई-रहित कर-स्तर चित्रण — ये वास्तविक वैधानिक आयकर दरें नहीं हैं।' },
  init: () => ({ incomeUnits: 14, progressivity: 1 }),
  controls: [
    { id: 'incomeUnits', type: 'slider', label: b('Annual income index (abstract units)', 'वार्षिक आय सूचकांक (काल्पनिक इकाइयाँ)'), min: 2, max: 24, step: 1 },
    { id: 'progressivity', type: 'chips', label: b('Tax fairness structure', 'कर संरचना'), options: [opt(1, 'Progressive Slabs', 'प्रगतिशील स्तर (स्लैब)'), opt(0, 'Zero Tax (No Public Pool)', 'शून्य कर (कोई सार्वजनिक कोष नहीं)')] },
  ],
  view(S) {
    const r = F.taxConceptAlloc(S);
    const total = Math.max(1, S.incomeUnits);
    const exW = (r.exempt / total) * 560, midW = (r.mid / total) * 560, topW = (r.top / total) * 560;
    const g = `<text class="txt sm b" x="24" y="34">${esc(P(`Income Index: ${S.incomeUnits} units sliced across conceptual tiers`, `आय सूचकांक: ${S.incomeUnits} इकाइयाँ अवधारणात्मक स्तरों में विभाजित`))}</text>`
      + `<rect x="24" y="46" width="${exW.toFixed(1)}" height="34" fill="#15803d"/>`
      + `<rect x="${(24 + exW).toFixed(1)}" y="46" width="${midW.toFixed(1)}" height="34" fill="#0369a1"/>`
      + `<rect x="${(24 + exW + midW).toFixed(1)}" y="46" width="${topW.toFixed(1)}" height="34" fill="#b45309"/>`
      + `<text class="txt sm mut" x="24" y="102">${esc(P('Green: Basic Exempt (0%) | Blue: Middle Tier | Amber: Higher Tier', 'हरा: कर-मुक्त मूल स्तर (0%) | नीला: मध्यम स्तर | एम्बर: उच्च स्तर'))}</text>`
      + `<rect x="24" y="124" width="286" height="66" rx="8" fill="#f1f5f9" stroke="#64748b"/>`
      + `<text class="txt b" x="38" y="150">${esc(P(`Tax Contributed: ${r.effectiveTax} units (${r.effectivePct}%)`, `कर योगदान: ${r.effectiveTax} इकाइयाँ (${r.effectivePct}%)`))}</text>`
      + `<text class="txt sm mut" x="38" y="172">${esc(P(`Net Take-Home: ${r.takeHome} units`, `कर-पश्चात शेष: ${r.takeHome} इकाइयाँ`))}</text>`
      + `<rect x="328" y="124" width="288" height="66" rx="8" fill="#dcfce7" stroke="#15803d"/>`
      + `<text class="txt sm b" x="342" y="148">${esc(P('Funds Shared Public Services:', 'साझा सार्वजनिक सेवाओं का वित्तपोषण:'))}</text>`
      + `<text class="txt sm" x="342" y="170">${esc(P('Roads, Schools, Hospitals, Courts & Security', 'सड़कें, विद्यालय, अस्पताल, न्यायालय व सुरक्षा'))}</text>`;
    return {
      plate: {
        src: 'assets/images/plates/t16-tax.jpg',
        en: 'Public schools, health clinics, roads, bridges & clean water towers — tap any landmark to test progressive tax slabs vs zero-tax.',
        hi: 'सरकारी विद्यालय, चिकित्सालय, सड़क-पुल व जल मीनार — प्रगतिशील कर-स्तर बनाम शून्य कर परखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 20, y: 42, en: 'Basic Exempt Tier (4 Units = 0% Tax)', hi: 'कर-मुक्त मूल स्तर (0% कर)', detail: b('First 4 income units stay 100% exempt so basic needs are never squeezed.', 'प्रथम 4 आय इकाइयाँ पूरी तरह कर-मुक्त रहती हैं ताकि मूल आवश्यकताएँ सुरक्षित रहें।'), set: { incomeUnits: 4, progressivity: 1 } },
          { x: 65, y: 42, en: 'Clinic & Middle Income (12 Units)', hi: 'मध्यम आय व जन-चिकित्सालय (12)', detail: b('Only units above the threshold pay moderate tax, leaving higher take-home income.', 'केवल सीमा से ऊपर की आय पर मध्यम कर लगता है, जिससे शेष आय बढ़ती है।'), set: { incomeUnits: 12, progressivity: 1 } },
          { x: 48, y: 68, en: 'Highway Bridge & Top Tier (22 Units)', hi: 'उच्च स्तर व पुल निर्माण (22)', detail: b('Progressive upper slices fund major public highways, bridges & schools fairly.', 'ऊपरी स्तर का योगदान बड़े राजमार्ग, पुल व विद्यालय बनाता है।'), set: { incomeUnits: 22, progressivity: 1 } },
          { x: 88, y: 26, en: 'Zero Public Pool Test', hi: 'शून्य कर कोष परीक्षण', detail: b('Turn off taxes — household take-home looks full, yet shared schools & water dry up!', 'कर शून्य करते ही साझा जल, सड़क व विद्यालयों का कोष समाप्त हो जाता है!'), set: { incomeUnits: 14, progressivity: 0 } },
        ],
      },
      svg: `<svg viewBox="0 0 640 212" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Income ${S.incomeUnits} units, conceptual tax ${r.effectiveTax} (${r.effectivePct}%), take-home ${r.takeHome}`,
      lines: [
        S.progressivity === 0
          ? { en: 'With zero taxes, take-home equals full income, but public schools, highways, courts, and water supply lose stable funding.', hi: 'शून्य कर होने पर शेष आय पूरी रहती है, पर सरकारी विद्यालय, राजमार्ग, न्यायालय और पेयजल बिना कोष के रुक जाते हैं।', cls: 'warn' }
          : { en: `Ability-to-pay principle: basic subsistence (first 4 units) pays 0%, middle income pays a modest share, and only upper slices pay higher tiers — keeping effective rate at ${r.effectivePct}%.`, hi: `भुगतान-क्षमता सिद्धांत: मूल जीवन-निर्वाह स्तर (प्रथम 4 इकाइयाँ) पर 0% कर है और केवल ऊपरी स्तरों पर दर बढ़ती है — प्रभावी दर ${r.effectivePct}% रहती है।`, cls: 'balanced' },
        { en: 'Paying honest income tax is both a legal duty and a civic contribution to shared national infrastructure.', hi: 'ईमानदारी से आयकर चुकाना कानूनी कर्तव्य होने के साथ-साथ साझा राष्ट्रीय अवसंरचना में नागरिक योगदान भी है।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Keep income at 4 units or less under Progressive Slabs and verify the effective tax is 0%. Why does every progressive tax keep a basic exempt slice?', 'प्रगतिशील स्तरों में आय 4 या उससे कम रखकर देखें कि प्रभावी कर 0% रहता है। मूल कर-मुक्त सीमा क्यों रखी जाती है?'),
    b('Slide income from 6 to 20 units: notice only the extra upper units enter the higher amber tier, never pulling down take-home income.', 'आय 6 से 20 इकाइयों तक बढ़ाएँ: केवल अतिरिक्त ऊपरी भाग ही उच्च स्तर में जाता है, कर-पश्चात आय कभी घटती नहीं।'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('In a progressive tax-slab system, if your income crosses from the exempt slice into the middle slice, which part of your income is taxed?', 'प्रगतिशील कर-स्तर प्रणाली में जब आय कर-मुक्त सीमा पार करके मध्यम स्तर में आती है, तो किस भाग पर कर लगता है?'),
    options: [opt('top', 'Only the portion above the exempt threshold', 'केवल कर-मुक्त सीमा से ऊपर का अतिरिक्त भाग'), opt('all', 'The basic exempt slice is punished too, making you poorer overall', 'मूल कर-मुक्त भाग भी दंडित होकर कुल आय घटा देता है')],
    run: (S) => { S.incomeUnits = 6; S.progressivity = 1; return F.taxConceptAlloc({ incomeUnits: 6, progressivity: 1 }).takeHome > 4 ? 'top' : 'all'; },
    explain: () => b('Marginal slabs apply only to the extra income above each threshold, so earning more always leaves higher take-home pay.', 'सीमांत कर-स्तर केवल सीमा से ऊपर की अतिरिक्त आय पर लागू होते हैं, इसलिए अधिक कमाने पर कुल शेष आय हमेशा बढ़ती है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Why are citizens required to pay personal income tax?', 'नागरिकों के लिए व्यक्तिगत आयकर चुकाना क्यों आवश्यक है?'),
    correct: 'pub',
    options: [
      opt('pub', 'To pool fair contributions based on ability to pay so government can fund public schools, roads, hospitals, and national security.', 'भुगतान-क्षमता के अनुसार साझा योगदान से विद्यालय, सड़कें, अस्पताल व सुरक्षा जैसी सार्वजनिक सेवाएँ चलाने के लिए।'),
      opt('burn', 'To destroy currency notes.', 'मुद्रा नोट नष्ट करने के लिए।', b('Taxes circulate directly back into public services and welfare.', 'कर सीधे सार्वजनिक सेवाओं और कल्याण कार्यों में उपयोग होते हैं।')),
    ],
    explain: b('Taxes finance the public goods and infrastructure that markets alone cannot equitably supply.', 'कर उन सार्वजनिक वस्तुओं और अवसंरचना का वित्तपोषण करते हैं जिन्हें बाज़ार अकेले समान रूप से नहीं दे सकते।'),
    hint: b('Look at the green Public Services box on the right.', 'दाईं ओर हरा सार्वजनिक सेवा बॉक्स देखें।'),
  }],
  reflect: b('List three public facilities near your home that could not run well without tax funding.', 'अपने घर के पास तीन ऐसी सार्वजनिक सुविधाएँ लिखें जो कर-वित्तपोषण के बिना नहीं चल सकतीं।'),
};
