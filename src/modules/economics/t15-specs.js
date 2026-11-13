// T15 From Ideas to Startups lab specs (L1–L5).
import { Chart } from '../../engines/chart.js';
import * as S_ from '../../engines/domain/startup.js';
import { indiaMapSvg } from '../../engines/viz.js';
import { esc, fmt } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';

const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });
const rs = (v) => `₹${fmt(v, 0)}`;

// ------------------------------------------------------------------ T15.L2 unit economics
export const unit = {
  id: 'T15.L2',
  objective: b('Use price, variable cost, fixed cost and units sold to find a small business’s profit and break-even point.', 'मूल्य, परिवर्ती लागत, स्थिर लागत और बिकी इकाइयों से किसी छोटे व्यवसाय का लाभ और सम-विच्छेद बिंदु ज्ञात करें।'),
  note: { kind: 'fictional', en: 'A fictional school-fair juice stall; all amounts are invented for teaching.', hi: 'विद्यालय मेले का काल्पनिक जूस स्टॉल; सभी राशियाँ शिक्षण हेतु गढ़ी गई हैं।' },
  init: () => ({ price: 40, varCost: 25, fixed: 1500, units: 120 }),
  controls: [
    { id: 'price', type: 'slider', label: b('Selling price per glass (₹)', 'प्रति गिलास बिक्री मूल्य (₹)'), min: 10, max: 80, step: 1, fmt: rs },
    { id: 'varCost', type: 'slider', label: b('Ingredients cost per glass (₹)', 'प्रति गिलास सामग्री लागत (₹)'), min: 5, max: 60, step: 1, fmt: rs },
    { id: 'fixed', type: 'slider', label: b('Fixed costs: stall rent and juicer (₹)', 'स्थिर लागत: स्टॉल किराया और जूसर (₹)'), min: 0, max: 4000, step: 100, fmt: rs },
    { id: 'units', type: 'slider', label: b('Glasses sold', 'बिके गिलास'), min: 0, max: 300, step: 5 },
  ],
  view(S) {
    const u = S_.unitEconomics(S), ymax = Math.max(8000, Math.ceil(Math.max(u.revenue, u.totalCost, S.price * 300) / 2000) * 2000);
    const ch = new Chart({ xMax: 300, yMax: ymax, xLabel: P('Glasses sold', 'बिके गिलास'), yLabel: P('Rupees', 'रुपये'), yPrefix: '₹', xTicks: 6, yTicks: 5 });
    ch.axes(); const sr = S_.series({ price: S.price, varCost: S.varCost, fixed: S.fixed, maxUnits: 300 });
    ch.line(sr.map((p) => [p.units, p.revenue]), 'curve g'); ch.line(sr.map((p) => [p.units, p.cost]), 'curve d'); ch.vline(S.units, 'guide');
    if (Number.isFinite(u.breakEven) && u.breakEven <= 300) { ch.dot(u.breakEven, S.price * u.breakEven, 'eqdot', 7); ch.text(u.breakEven, S.price * u.breakEven, P('break-even', 'सम-विच्छेद'), 'guide-lbl', 'start', 8, 18); }
    ch.text(2, ymax * 0.94, P('Green: money in (revenue)', 'हरा: आय (राजस्व)'), 'lbl', 'start'); ch.text(2, ymax * 0.87, P('Red: money out (total cost)', 'लाल: कुल लागत'), 'lbl', 'start');
    const lines = [{ en: `Each glass earns ₹${u.contribution} after ingredients (contribution). Revenue ${rs(u.revenue)} − total cost ${rs(u.totalCost)} = ${u.profit >= 0 ? 'profit' : 'loss'} of ${rs(Math.abs(u.profit))}.`, hi: `सामग्री के बाद हर गिलास ₹${u.contribution} कमाता है (योगदान)। आय ${rs(u.revenue)} − कुल लागत ${rs(u.totalCost)} = ${rs(Math.abs(u.profit))} का ${u.profit >= 0 ? 'लाभ' : 'हानि'}।`, cls: u.profit > 0 ? 'balanced' : u.profit < 0 ? 'warn' : '' },
      Number.isFinite(u.breakEven) ? { en: `Break-even: you must sell at least ${u.breakEven} glasses just to cover the fixed costs (${rs(S.fixed)} ÷ ₹${u.contribution}). You have sold ${S.units}.`, hi: `सम-विच्छेद: केवल स्थिर लागत (${rs(S.fixed)} ÷ ₹${u.contribution}) निकालने के लिए भी कम से कम ${u.breakEven} गिलास बेचने होंगे। आपने ${S.units} बेचे हैं।` } : { en: 'The price is not above the ingredient cost, so every glass adds to the loss: raise the price or cut the cost.', hi: 'मूल्य सामग्री लागत से ऊपर नहीं है, इसलिए हर गिलास हानि बढ़ाता है: मूल्य बढ़ाएँ या लागत घटाएँ।', cls: 'warn' },
      { en: 'Profit margin: ' + fmt(u.marginPct, 0) + '% of revenue.', hi: 'लाभ-मार्जिन: आय का ' + fmt(u.marginPct, 0) + '%।', cls: 'note' }];
    return {
      plate: {
        src: 'assets/images/plates/t15-startup.jpg',
        en: 'School-fair enterprise workbench — tap pins to inspect selling price, variable fruit cost & fixed stall rent.',
        hi: 'उद्यम कार्यमेज़ — बिक्री मूल्य, परिवर्ती सामग्री लागत व स्थिर किराए का प्रभाव देखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 36, y: 48, en: 'Cut Variable Cost (₹25 → ₹18)', hi: 'सामग्री लागत घटाएँ (₹25 → ₹18)', detail: b('Bulk ingredient sourcing lifts contribution per cup and lowers break-even!', 'थोक खरीद से प्रति गिलास योगदान बढ़ता और सम-विच्छेद घटता है!'), set: { price: 40, varCost: 18, fixed: 1500, units: 120 } },
          { x: 54, y: 68, en: 'Price ₹50 & 140 Cups Profit', hi: '₹50 मूल्य व 140 गिलास बिक्री', detail: b('Notice profit steepens fast once fixed rent is covered past break-even.', 'स्थिर किराया निकलते ही बिक्री बढ़ने पर लाभ तेज़ी से बढ़ता है।'), set: { price: 50, varCost: 25, fixed: 1500, units: 140 } },
          { x: 68, y: 86, en: 'High Fixed Rent Trap (₹3,000)', hi: 'उच्च स्थिर किराया जाल (₹3,000)', detail: b('Doubling stall rent doubles the break-even glasses needed just to hit ₹0!', 'किराया दोगुना होने पर लागत निकालने के लिए भी दोगुने गिलास बेचने पड़ते हैं!'), set: { price: 40, varCost: 25, fixed: 3000, units: 120 } },
        ],
      },
      svg: ch.html({ label: P('Revenue and cost against glasses sold', 'बिके गिलासों के सापेक्ष आय और लागत') }), aria: `Profit ${u.profit} rupees; break-even ${u.breakEven} glasses.`, lines,
    };
  },
  discover: [b('Raise the price by ₹10. How does the break-even number change?', 'मूल्य ₹10 बढ़ाएँ। सम-विच्छेद की संख्या कैसे बदलती है?'), b('Double the fixed costs. Which line moves, and what happens to the break-even point?', 'स्थिर लागत दोगुनी करें। कौन-सी रेखा खिसकती है और सम-विच्छेद बिंदु का क्या होता है?'), b('Set the price equal to the ingredient cost. Can the stall ever make a profit?', 'मूल्य को सामग्री लागत के बराबर रखें। क्या स्टॉल कभी लाभ कमा सकता है?')],
  predictions: [{ id: 'p1', stem: b('If the price per glass rises (cost and fixed costs unchanged), the break-even number of glasses…', 'यदि प्रति गिलास मूल्य बढ़ता है (लागत और स्थिर लागत वही), तो सम-विच्छेद के गिलासों की संख्या…'), options: [opt('falls', 'Falls', 'घटती है'), opt('rises', 'Rises', 'बढ़ती है'), opt('same', 'Stays the same', 'वही रहती है')],
    run: (S) => { const a = S_.unitEconomics({ ...S, units: 0 }).breakEven; S.price = Math.min(80, S.price + 10); const c = S_.unitEconomics({ ...S, units: 0 }).breakEven; return c < a ? 'falls' : c > a ? 'rises' : 'same'; },
    explain: (S) => ({ en: `Each glass now contributes ₹${S.price - S.varCost}, so the fixed costs are recovered sooner: break-even is ${S_.unitEconomics(S).breakEven} glasses.`, hi: `अब हर गिलास ₹${S.price - S.varCost} का योगदान देता है, इसलिए स्थिर लागत जल्दी वसूल होती है: सम-विच्छेद ${S_.unitEconomics(S).breakEven} गिलास पर है।` }) }],
  exit: [{ id: 'e1', stem: b('Rent for the stall is a FIXED cost. What does that mean?', 'स्टॉल का किराया स्थिर लागत है। इसका क्या अर्थ है?'), correct: 'a', options: [
    { id: 'a', ...b('It must be paid however many glasses are sold.', 'कितने भी गिलास बिकें, इसे चुकाना ही पड़ता है।') }, { id: 'b', ...b('It grows with every glass sold.', 'यह हर बिके गिलास के साथ बढ़ता है।'), why: b('That describes variable cost, such as fruit and sugar.', 'यह परिवर्ती लागत, जैसे फल और चीनी, का वर्णन है।') }],
    explain: b('Fixed costs stay the same; variable costs rise with units sold.', 'स्थिर लागत वही रहती है; परिवर्ती लागत बिकी इकाइयों के साथ बढ़ती है।'), hint: b('Move the “glasses sold” slider and see which cost line stays flat at the start.', '“बिके गिलास” स्लाइडर चलाएँ और देखें शुरू में कौन-सी लागत-रेखा समतल रहती है।') }],
  reflect: b('Suggest one way a small business could lower its break-even point.', 'एक तरीका सुझाएँ जिससे छोटा व्यवसाय अपना सम-विच्छेद बिंदु घटा सके।'),
};
// ------------------------------------------------------------------ T15.L5 profit and loss statement
export const pnl = {
  id: 'T15.L5',
  objective: b('Read a simple profit-and-loss statement: income minus every cost gives profit or loss, and the order of subtraction shows where money goes.', 'सरल लाभ-हानि विवरण पढ़ें: आय में से हर लागत घटाने पर लाभ या हानि मिलती है, और घटाने का क्रम दिखाता है कि पैसा कहाँ जाता है।'),
  note: { kind: 'fictional', en: 'A fictional tailoring shop for one month; amounts are invented.', hi: 'एक महीने की काल्पनिक सिलाई की दुकान; राशियाँ गढ़ी गई हैं।' },
  init: () => ({ jobs: 60, rate: 400, cloth: 8000, wages: 9000, rent: 4000 }),
  controls: [
    { id: 'jobs', type: 'slider', label: b('Garments stitched', 'सिले गए कपड़े'), min: 0, max: 120, step: 5 },
    { id: 'rate', type: 'slider', label: b('Charge per garment (₹)', 'प्रति कपड़ा शुल्क (₹)'), min: 100, max: 800, step: 25, fmt: rs },
    { id: 'cloth', type: 'slider', label: b('Cloth and thread (₹)', 'कपड़ा और धागा (₹)'), min: 0, max: 20000, step: 500, fmt: rs },
    { id: 'wages', type: 'slider', label: b('Helper wages (₹)', 'सहायक की मज़दूरी (₹)'), min: 0, max: 20000, step: 500, fmt: rs },
    { id: 'rent', type: 'slider', label: b('Shop rent and electricity (₹)', 'दुकान किराया और बिजली (₹)'), min: 0, max: 10000, step: 500, fmt: rs },
  ],
  view(S) {
    const income = S.jobs * S.rate, costs = [[P('Cloth & thread', 'कपड़ा और धागा'), S.cloth], [P('Wages', 'मज़दूरी'), S.wages], [P('Rent & power', 'किराया और बिजली')]];
    const rows = [[P('Income (sales)', 'आय (बिक्री)'), income, 'bar-s'], [P('Cloth & thread', 'कपड़ा और धागा'), -S.cloth, 'bar-w'], [P('Wages', 'मज़दूरी'), -S.wages, 'bar-w'], [P('Rent & power', 'किराया और बिजली'), -S.rent, 'bar-w']];
    const profit = income - S.cloth - S.wages - S.rent, scale = Math.max(income, S.cloth + S.wages + S.rent, 1); let y = 14, run = 0, g = '';
    const X = (v) => 190 + (v / scale) * 380;
    for (const [lab, v, cls] of rows) { const x0 = X(Math.min(run, run + v)), w = Math.abs(X(run + v) - X(run)); g += `<text class="txt sm" x="8" y="${y + 17}">${esc(lab)}</text><rect class="${cls}" x="${x0.toFixed(1)}" y="${y}" width="${Math.max(w, 1).toFixed(1)}" height="26"/><text class="txt sm b" x="${(x0 + w + 6).toFixed(1)}" y="${y + 18}">${v >= 0 ? '+' : '−'}${rs(Math.abs(v))}</text>`; run += v; y += 40; }
    g += `<text class="txt b" x="8" y="${y + 17}">${esc(profit >= 0 ? P('PROFIT', 'लाभ') : P('LOSS', 'हानि'))}</text><rect class="${profit >= 0 ? 'bar-s' : 'bar-bad'}" x="${X(Math.min(0, profit)).toFixed(1)}" y="${y}" width="${Math.max(Math.abs(X(profit) - X(0)), 1).toFixed(1)}" height="26"/><text class="txt b" x="${(X(Math.max(0, profit)) + 6).toFixed(1)}" y="${y + 18}">${rs(Math.abs(profit))}</text><line x1="${X(0)}" x2="${X(0)}" y1="4" y2="${y + 34}" stroke="var(--ink)"/>`;
    return {
      plate: {
        src: 'assets/images/plates/t15-ecosystem.jpg',
        en: 'Small tailoring workshop waterfall — tap pins to simulate festival stitching orders, balanced months or overhead loss.',
        hi: 'लघु सिलाई कार्यशाला — त्योहारी ऑर्डर, सामान्य माह व धीमे माह की लाभ-हानि परखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 48, y: 64, en: 'Festival Rush (90 Garments)', hi: 'त्योहारी भीड़ (90 कपड़े)', detail: b('High garment orders lift total income far above cloth, wages & shop rent.', 'अधिक ऑर्डर से आय कपड़ा, मज़दूरी व किराए से कहीं ऊपर निकल जाती है।'), set: { jobs: 90, rate: 400, rent: 4000 } },
          { x: 20, y: 68, en: 'Balanced Normal Month (60 Garments)', hi: 'सामान्य संतुलित माह (60 कपड़े)', detail: b('Modest profit covers owner’s household margin after paying helpers.', 'सहायक की मज़दूरी व किराए के बाद मालिक के लिए ₹3,000 शुद्ध लाभ।'), set: { jobs: 60, rate: 400, cloth: 8000, wages: 9000, rent: 4000 } },
          { x: 88, y: 56, en: 'Slow Month Loss (30 Garments)', hi: 'मंदा माह हानि (30 कपड़े)', detail: b('Rent and wages keep running even when orders fall, creating a monthly loss.', 'ऑर्डर घटने पर भी किराया व मज़दूरी चलती रहती है, जिससे हानि होती है।'), set: { jobs: 30, rate: 400, cloth: 5000, wages: 9000, rent: 6000 } },
        ],
      },
      svg: `<svg viewBox="0 0 640 ${y + 44}" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`, aria: `Income ${income}, profit ${profit}.`, lines: [
      { en: `Income ${rs(income)} − cloth ${rs(S.cloth)} − wages ${rs(S.wages)} − rent ${rs(S.rent)} = ${profit >= 0 ? 'profit' : 'loss'} ${rs(Math.abs(profit))}.`, hi: `आय ${rs(income)} − कपड़ा ${rs(S.cloth)} − मज़दूरी ${rs(S.wages)} − किराया ${rs(S.rent)} = ${profit >= 0 ? 'लाभ' : 'हानि'} ${rs(Math.abs(profit))}।`, cls: profit >= 0 ? 'balanced' : 'warn' },
      { en: profit >= 0 ? 'Profit is what the owner keeps (before the owner’s own tax and savings).' : 'A loss means the shop spent more than it earned; the owner must use savings or borrow to cover it.', hi: profit >= 0 ? 'लाभ वह है जो मालिक के पास रहता है (मालिक के अपने कर और बचत से पहले)।' : 'हानि का अर्थ है कि दुकान ने कमाई से अधिक खर्च किया; मालिक को बचत या उधार से इसकी भरपाई करनी होगी।', cls: 'note' }] };
  },
  discover: [b('Find the smallest number of garments that gives zero profit.', 'सबसे कम कपड़ों की वह संख्या खोजें जिस पर लाभ शून्य हो।'), b('Which cost could the owner cut most easily? Which could she not?', 'मालिक कौन-सी लागत सबसे आसानी से घटा सकती है? कौन-सी नहीं?')],
  predictions: [{ id: 'p1', stem: b('Income is ₹24,000 and total costs are ₹21,000. The shop makes…', 'आय ₹24,000 और कुल लागत ₹21,000 है। दुकान…'), options: [opt('profit', 'A profit of ₹3,000', '₹3,000 का लाभ कमाती है'), opt('loss', 'A loss of ₹3,000', '₹3,000 की हानि उठाती है')],
    run: (S) => { S.jobs = 60; S.rate = 400; S.cloth = 8000; S.wages = 9000; S.rent = 4000; return S.jobs * S.rate - S.cloth - S.wages - S.rent > 0 ? 'profit' : 'loss'; }, explain: () => ({ en: '₹24,000 − ₹21,000 = ₹3,000 profit: income is larger than all costs together.', hi: '₹24,000 − ₹21,000 = ₹3,000 लाभ: आय सभी लागतों के योग से अधिक है।' }) }],
  exit: [{ id: 'e1', stem: b('Profit is…', 'लाभ है…'), correct: 'a', options: [
    { id: 'a', ...b('Income minus all the costs of running the business.', 'आय में से व्यवसाय चलाने की सभी लागतें घटाने पर जो बचे।') }, { id: 'b', ...b('The same as income.', 'आय के समान।'), why: b('Income is the money coming in; profit is what is left after costs.', 'आय आने वाला पैसा है; लाभ लागत के बाद बचा पैसा है।') }],
    explain: b('Profit = income − costs.', 'लाभ = आय − लागत।'), hint: b('Follow the bars from left to right.', 'पट्टियों को बाएँ से दाएँ देखें।') }],
  reflect: b('Pick a small business in your neighbourhood and list its likely income and costs.', 'अपने मोहल्ले का कोई छोटा व्यवसाय चुनें और उसकी संभावित आय और लागतें लिखें।'),
};

// ------------------------------------------------------------------ T15.L1 Business plan builder
export const planBuilder = {
  id: 'T15.L1',
  objective: b('Walk through the stages of turning an everyday problem into a viable enterprise using a business plan.', 'दैनिक जीवन की समस्या से व्यवसाय-योजना (बिज़नेस प्लान) के चरणों द्वारा एक सक्षम उद्यम बनाने की प्रक्रिया समझें।'),
  note: { kind: 'fictional', en: 'Illustrative venture-readiness checklist scoring idea clarity, customer proof, unit margins, and working capital.', hi: 'समस्या स्पष्टता, ग्राहक प्रमाण, इकाई मार्जिन और कार्यशील पूंजी की जांच करने वाला काल्पनिक उद्यम मॉडल।' },
  init: () => ({ problemClarity: 4, customerProof: 3, unitMarginOk: true, capitalBufferMonths: 4 }),
  controls: [
    { id: 'problemClarity', type: 'slider', label: b('1. Problem & solution clarity (1–5)', '1. समस्या व समाधान स्पष्टता (1–5)'), min: 1, max: 5, step: 1 },
    { id: 'customerProof', type: 'slider', label: b('2. Customer survey & prototype tests (1–5)', '2. ग्राहक जांच व प्रोटोटाइप परीक्षण (1–5)'), min: 1, max: 5, step: 1 },
    { id: 'unitMarginOk', type: 'toggle', label: b('3. Price exceeds unit cost (positive margin)', '3. मूल्य इकाई लागत से अधिक (सकारात्मक मार्जिन)') },
    { id: 'capitalBufferMonths', type: 'slider', label: b('4. Working capital runway (months)', '4. कार्यशील पूंजी बैकअप (माह)'), min: 0, max: 6, step: 1 },
  ],
  view(S) {
    const res = S_.planReadiness(S);
    const stages = [
      { lab: P('1. Spot Real Problem', '1. वास्तविक समस्या पहचानें'), val: S.problemClarity * 20 },
      { lab: P('2. Prototype & Feedback', '2. प्रोटोटाइप व प्रतिक्रिया'), val: S.customerProof * 20 },
      { lab: P('3. Unit Pricing Plan', '3. इकाई मूल्य योजना'), val: S.unitMarginOk ? 100 : 20 },
      { lab: P('4. Capital & Operations', '4. पूंजी व संचालन योजना'), val: Math.round((S.capitalBufferMonths / 6) * 100) },
    ];
    let g = '';
    stages.forEach((st, i) => {
      const y = 18 + i * 44;
      g += `<text class="txt sm" x="20" y="${y + 18}">${esc(st.lab)}</text>`
        + `<rect x="230" y="${y}" width="${st.val * 3.6}" height="24" rx="4" fill="${st.val >= 65 ? '#15803d' : st.val >= 40 ? '#d97706' : '#b91c1c'}"/>`
        + `<text class="txt sm b" x="${238 + st.val * 3.6}" y="${y + 17}">${st.val}%</text>`;
    });
    const col = res.stage === 'launch-ready' ? '#15803d' : res.stage === 'pilot-needed' ? '#b45309' : '#b91c1c';
    g += `<rect x="20" y="194" width="600" height="32" rx="8" fill="${col}" fill-opacity=".14" stroke="${col}"/><text class="txt b" x="320" y="215" text-anchor="middle">${esc(P(`Readiness Score: ${res.score}/100 (${res.stage})`, `तैयारी स्कोर: ${res.score}/100`))}</text>`;
    return {
      plate: {
        src: 'assets/images/plates/t15-startup.jpg',
        en: 'Craft-tech founders building bamboo water filters & solar lamps — tap pins to stress-test customer proof, margin & runway.',
        hi: 'बाँस फ़िल्टर व सौर लैंप प्रोटोटाइप — ग्राहक प्रमाण, लाभ-मार्जिन व पूंजी बफर परखने हेतु पिन पर टैप करें।',
        spots: [
          { x: 36, y: 48, en: 'Strong MVP & Survey Proof', hi: 'मज़बूत प्रोटोटाइप व ग्राहक जांच', detail: b('Clear water-filtration need + village testing lifts score into launch-ready.', 'स्पष्ट समस्या व प्रोटोटाइप परीक्षण उद्यम को लॉन्च-रेडी बनाते हैं।'), set: { problemClarity: 5, customerProof: 5, unitMarginOk: true, capitalBufferMonths: 4 } },
          { x: 54, y: 68, en: 'Low-Runway Cash Pinch (0 Mo)', hi: 'शून्य कार्यशील पूंजी संकट', detail: b('Zero cash runway means one delayed customer payment stalls wages!', 'शून्य पूंजी बफर होने पर भुगतान में थोड़ी भी देरी काम रोक देती है!'), set: { capitalBufferMonths: 0 } },
          { x: 68, y: 86, en: 'Negative Unit Margin Trap', hi: 'नकारात्मक इकाई मार्जिन खतरा', detail: b('Selling below unit cost causes every extra order to lose more money!', 'लागत से कम कीमत रखने पर हर अतिरिक्त बिक्री घाटा बढ़ाती है!'), set: { unitMarginOk: false } },
        ],
      },
      svg: `<svg viewBox="0 0 640 236" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`,
      aria: `Business plan readiness ${res.score} out of 100 (${res.stage})`,
      lines: [
        { en: `Venture readiness: ${res.score}/100 — ${res.stage === 'launch-ready' ? 'Ready to launch small pilot and track cash flow.' : res.stage === 'pilot-needed' ? 'Run a tiny test batch first before committing large savings.' : 'Strengthen customer validation and positive unit margins before spending capital.'}`, hi: `उद्यम तैयारी: ${res.score}/100 — ${res.stage === 'launch-ready' ? 'छोटे पायलट लॉन्च के लिए तैयार।' : res.stage === 'pilot-needed' ? 'बड़ी पूंजी लगाने से पहले छोटा परीक्षण करें।' : 'खर्च से पहले ग्राहक प्रमाण और इकाई लाभ सुनिश्चित करें।'}`, cls: res.stage === 'launch-ready' ? 'balanced' : 'warn' },
        { en: 'Entrepreneurs combine land/workspace, labour, capital, and organisation while taking calculated risk to create jobs and solutions.', hi: 'उद्यमी स्थान, श्रम, पूंजी और संगठन को जोड़कर जोखिम उठाते हैं और नए समाधान व रोज़गार रचते हैं।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Toggle Unit Pricing Plan off while setting Problem Clarity to 5. Why does a popular idea still fail if unit margin is negative?', 'समस्या स्पष्टता 5 रखकर इकाई मूल्य योजना बंद करें। हर बिक्री पर घाटा होने से लोकप्रिय विचार भी क्यों डूब जाता है?'),
    b('Lower working capital runway to 0 months: what happens if customers pay late?', 'कार्यशील पूंजी 0 माह करके देखें: ग्राहक देर से भुगतान करें तो क्या होगा?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('Which stage comes BEFORE renting a large factory and hiring full-time staff?', 'बड़ा कारखाना किराए पर लेने और पूरा स्टाफ रखने से पहले कौन-सा चरण आना चाहिए?'),
    options: [opt('proto', 'Validate customer need with a low-cost prototype & check unit economics', 'कम लागत वाले प्रोटोटाइप से ग्राहक मांग व इकाई लाभ जांचना'), opt('spend', 'Spend all savings on advertising first', 'पहले पूरी बचत विज्ञापन पर खर्च करना')],
    run: (S) => { S.customerProof = 4; S.unitMarginOk = true; return 'proto'; },
    explain: () => b('Testing demand cheaply and verifying positive margin lowers failure risk dramatically.', 'सस्ते में मांग परखने और लाभ की पुष्टि करने से व्यावसायिक जोखिम बहुत घटता है।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Why does a business plan include a working-capital cash buffer?', 'बिज़नेस प्लान में कार्यशील पूंजी (वर्किंग कैपिटल) बफर क्यों रखा जाता है?'),
    correct: 'gap',
    options: [
      opt('gap', 'To pay rent, raw materials, and wages during early months before steady sales arrive.', 'नियमित बिक्री शुरू होने से पहले शुरुआती महीनों का किराया, कच्चा माल व मज़दूरी चुकाने के लिए।'),
      opt('decor', 'To decorate the office sign.', 'कार्यालय का बोर्ड सजाने के लिए।', b('Working capital covers real timing gaps between cash out and cash in.', 'कार्यशील पूंजी खर्च और आय के बीच के समय-अंतर को संभालती है।')),
    ],
    explain: b('Many profitable-on-paper startups run out of cash simply because they lacked working capital.', 'कई अच्छे उद्यम केवल कार्यशील पूंजी की कमी से रुक जाते हैं।'),
    hint: b('Inspect slider 4 in the readiness controls.', 'तैयारी नियंत्रण में स्लाइडर 4 देखें।'),
  }],
  reflect: b('Think of one everyday inconvenience at school and outline a tiny 1-week pilot to test if classmates would use your solution.', 'विद्यालय की किसी दैनिक असुविधा पर 1-सप्ताह का छोटा पायलट विचार लिखें।'),
};

// ------------------------------------------------------------------ T15.L3 India Startup Ecosystem & MSME Gallery
const ECO_GALLERY = [
  { id: 'hubs', en: 'Startup India & Digital India Hubs', hi: 'स्टार्टअप इंडिया व डिजिटल इंडिया केंद्र', descEn: 'Digital payments (UPI), broadband, and DPIIT recognition helped startups expand beyond metros into Tier-2/3 cities.', descHi: 'यूपीआई, डिजिटल अवसंरचना व स्टार्टअप इंडिया ने छोटे शहरों तक नए उद्यमों की पहुँच बढ़ाई।' },
  { id: 'msme', en: 'Make in India & MSME Clusters', hi: 'मेक इन इंडिया व एमएसएमई क्लस्टर', descEn: 'Micro, Small and Medium Enterprises manufacture textiles, ceramics, tools, and food — forming India’s industrial backbone and creating massive local employment.', descHi: 'सूक्ष्म, लघु और मध्यम उद्यम (MSME) वस्त्र, औज़ार व खाद्य प्रसंस्करण द्वारा बड़े पैमाने पर स्थानीय रोज़गार देते हैं।' },
  { id: 'unorg', en: 'Unorganised Sector Workers & Artisans', hi: 'असंगठित क्षेत्र के श्रमिक व कारीगर', descEn: 'Tailors, street vendors, handloom weavers, and farm-gate workers form the majority of India’s workforce — needing fair credit, social security, and market access.', descHi: 'दर्जी, रेहड़ी-पटरी वाले, हथकरघा बुनकर व कारीगर भारत के कार्यबल का बड़ा हिस्सा हैं जिन्हें सस्ते ऋण व सामाजिक सुरक्षा की आवश्यकता है।' },
];
export const ecosystemMap = {
  id: 'T15.L3',
  objective: b('Locate India’s diverse startup & MSME clusters and compare how Startup India, Make in India, Digital India, MSMEs, and the unorganised sector create jobs.', 'भारत के स्टार्टअप व एमएसएमई केंद्रों को मानचित्र पर देखें और समझें कि स्टार्टअप इंडिया, मेक इन इंडिया, एमएसएमई व असंगठित क्षेत्र रोज़गार कैसे रचते हैं।'),
  note: { kind: 'documented', en: 'Representative Indian startup & MSME clusters alongside documented policy pillars (Startup India, Make in India, Digital India).', hi: 'भारत के प्रतिनिधि स्टार्टअप व एमएसएमई क्लस्टर तथा प्रलेखित नीति स्तंभ (स्टार्टअप इंडिया, मेक इन इंडिया, डिजिटल इंडिया)।' },
  init: () => ({ focus: 'hubs', hubIdx: 0 }),
  controls: [
    { id: 'focus', type: 'chips', label: b('Sector lens', 'क्षेत्र दृष्टिकोण'), options: ECO_GALLERY.map((g) => opt(g.id, g.en, g.hi)) },
    { id: 'hubIdx', type: 'slider', label: b('Highlight cluster (1–6)', 'क्लस्टर चुनें (1–6)'), min: 0, max: S_.STARTUP_HUBS.length - 1, step: 1, fmt: (i) => S_.STARTUP_HUBS[i]?.state || '' },
  ],
  view(S) {
    const cur = S_.STARTUP_HUBS[S.hubIdx] || S_.STARTUP_HUBS[0];
    const info = ECO_GALLERY.find((x) => x.id === S.focus) || ECO_GALLERY[0];
    const svg = indiaMapSvg({
      markers: S_.STARTUP_HUBS.map((h, i) => ({
        lon: h.lon, lat: h.lat, label: i === S.hubIdx ? P(h.en, h.hi) : h.state,
        r: i === S.hubIdx ? 7.5 : 4.5, fill: i === S.hubIdx ? '#dc2626' : '#0369a1',
      })),
      stateColors: { [cur.state]: '#fed7aa' },
      selectedState: cur.state,
      aria: P('India startup and MSME hubs map', 'भारत स्टार्टअप और एमएसएमई केंद्र मानचित्र'),
    });
    return {
      plate: {
        src: 'assets/images/plates/t15-ecosystem.jpg',
        en: 'India’s enterprise ecosystem — tap EV/UPI startups, textile MSME workshop or rural artisan shipping hub.',
        hi: 'भारत का उद्यम पारिस्थितिकी तंत्र — EV/UPI स्टार्टअप, वस्त्र MSME कार्यशाला व कारीगर पैकिंग केंद्र पर टैप करें।',
        spots: [
          { x: 20, y: 68, en: 'Startup India & UPI Tech Hubs', hi: 'स्टार्टअप इंडिया व डिजिटल केंद्र', detail: b('Explore DPIIT startups powered by instant digital payments across hubs.', 'UPI व डिजिटल अवसंरचना से जुड़े स्टार्टअप केंद्र देखें।'), set: { focus: 'hubs', hubIdx: 0 } },
          { x: 48, y: 64, en: 'Make in India MSME Clusters', hi: 'मेक इन इंडिया MSME क्लस्टर', detail: b('Inspect Surat/Coimbatore-style small factories creating widespread local jobs.', 'स्थानीय रोज़गार रचने वाले लघु व मध्यम उद्योग क्लस्टर देखें।'), set: { focus: 'msme', hubIdx: 3 } },
          { x: 88, y: 56, en: 'Artisans & Unorganised Sector', hi: 'असंगठित क्षेत्र व कारीगर', detail: b('See how formal bank credit & e-commerce uplift small craft workers.', 'बैंक ऋण व डिजिटल पहुँच से कारीगरों को मिलने वाली शक्ति देखें।'), set: { focus: 'unorg', hubIdx: 5 } },
        ],
      },
      svg,
      aria: `${cur.en}, lens ${info.en}`,
      lines: [
        { en: `Cluster: ${cur.en} (${cur.state}).`, hi: `क्लस्टर: ${cur.hi} (${cur.state})।`, cls: 'balanced' },
        { en: `${info.en}: ${info.descEn}`, hi: `${info.hi}: ${info.descHi}`, cls: 'note' },
      ],
    };
  },
  discover: [
    b('Step across all 6 hubs on the India map — notice how MSMEs in Surat and agri-craft in Patna/Jaipur complement metro tech hubs.', 'मानचित्र पर सभी 6 केंद्र देखें — सूरत के एमएसएमई और पटना/जयपुर के कृषि-शिल्प उद्यम महानगरों के टेक केंद्रों के पूरक हैं।'),
    b('Compare MSMEs with the unorganised sector: how does formal registration help an enterprise get bank credit?', 'एमएसएमई की तुलना असंगठित क्षेत्र से करें: औपचारिक पंजीकरण से उद्यम को बैंक ऋण मिलने में कैसे मदद होती है?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('How does Digital India (such as UPI instant payments and ONDC/e-commerce) directly help a small town artisan or MSME?', 'डिजिटल इंडिया (जैसे UPI त्वरित भुगतान और ई-कॉमर्स) किसी छोटे शहर के कारीगर या एमएसएमई की सीधे कैसे मदद करता है?'),
    options: [opt('reach', 'It lowers transaction costs and connects local makers to buyers nationwide', 'लेन-देन लागत घटती है और स्थानीय निर्माता देश भर के खरीदारों से जुड़ते हैं'), opt('stop', 'It forces artisans to close workshops', 'यह कारीगरों की कार्यशालाएँ बंद करवाता है')],
    run: (S) => { S.focus = 'hubs'; S.hubIdx = 5; return 'reach'; },
    explain: () => b('Low-cost digital payments and networks let rural MSMEs and craft producers accept orders beyond their local market.', 'सस्ते डिजिटल भुगतान और नेटवर्क ग्रामीण कारीगरों को स्थानीय बाज़ार से बाहर भी ग्राहक दिलाते हैं।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('Why is supporting the unorganised sector and MSMEs vital for inclusive growth in India?', 'भारत में समावेशी विकास के लिए असंगठित क्षेत्र और एमएसएमई को सशक्त बनाना क्यों महत्वपूर्ण है?'),
    correct: 'jobs',
    options: [
      opt('jobs', 'Together they employ the vast majority of workers and spread entrepreneurship across every district.', 'दोनों मिलकर देश के अधिकांश श्रमिकों को रोज़गार देते हैं और हर जिले में उद्यमिता फैलाते हैं।'),
      opt('tax', 'Only five mega-cities contain all workers.', 'सभी श्रमिक केवल पाँच महानगरों में रहते हैं।', b('Employment is heavily distributed across small enterprises and rural/semi-urban towns.', 'रोज़गार छोटे उद्यमों और कस्बों में व्यापक रूप से फैला है।')),
    ],
    explain: b('MSMEs and informal artisans drive widespread livelihoods alongside formal startups.', 'औपचारिक स्टार्टअप के साथ-साथ एमएसएमई और कारीगर व्यापक आजीविका के आधार हैं।'),
    hint: b('Switch Sector lens to MSMEs and Unorganised Sector.', 'क्षेत्र दृष्टिकोण को एमएसएमई व असंगठित क्षेत्र पर बदलें।'),
  }],
  reflect: b('Name one local product made by an MSME or artisan near your home and how digital payments might help them.', 'अपने आसपास के किसी एमएसएमई या कारीगर के एक उत्पाद का नाम लिखें और बताएँ डिजिटल भुगतान उनकी कैसे मदद कर सकता है।'),
};

// ------------------------------------------------------------------ T15.L4 Creative destruction
export const creativeDestruction = {
  id: 'T15.L4',
  objective: b('Model "creative destruction": see how new innovations displace older industries while creating new jobs and higher productivity — and how worker retraining softens disruption.', '“सृजनात्मक विनाश” का मॉडल देखें: नई तकनीक पुराने उद्योगों को विस्थापित करते हुए नए रोज़गार व उत्पादकता कैसे लाती है, और कौशल-पुनर्प्रशिक्षण संक्रमण को कैसे आसान बनाता है।'),
  note: { kind: 'fictional', en: 'Illustrative 10-year Schumpeterian innovation curve (e.g. hand-type setting → digital publishing, or horse carts → EV/logistics).', hi: '10-वर्षीय नवाचार वक्र का काल्पनिक मॉडल (जैसे पुरानी मुद्रण प्रणाली → डिजिटल प्रकाशन)।' },
  init: () => ({ techSpeed: 60, retrainSupport: 50 }),
  controls: [
    { id: 'techSpeed', type: 'slider', label: b('Speed of new technology adoption (%)', 'नई तकनीक अपनाने की गति (%)'), min: 20, max: 100, step: 10, fmt: (v) => `${v}%` },
    { id: 'retrainSupport', type: 'slider', label: b('Worker upskilling & transition support (%)', 'श्रमिक पुनर्प्रशिक्षण सहायता (%)'), min: 0, max: 100, step: 10, fmt: (v) => `${v}%` },
  ],
  view(S) {
    const res = S_.creativeDestruction(S);
    const ch = new Chart({ xMax: 10, yMax: 240, xLabel: P('Years', 'वर्ष'), yLabel: P('Index (Jobs / Output)', 'सूचकांक (रोज़गार / उत्पादन)'), xTicks: 5, yTicks: 6 });
    ch.axes();
    ch.line(res.oldJobs, 'curve d');
    ch.line(res.newJobs, 'curve g');
    ch.line(res.output, 'ghost', { dash: true });
    ch.text(10, res.oldJobs[10][1], P('old-tech jobs', 'पुरानी तकनीक रोज़गार'), 'lbl', 'end', -4, -6);
    ch.text(10, res.newJobs[10][1], P('new-tech jobs', 'नई तकनीक रोज़गार'), 'lbl', 'end', -4, 14);
    ch.text(10, res.output[10][1], P('total output', 'कुल उत्पादन'), 'lbl', 'end', -4, -8);
    return {
      plate: {
        src: 'assets/images/plates/t15-ecosystem.jpg',
        en: 'Creative destruction across traditional shops & EV/digital startups — tap pins to test disruption vs worker reskilling.',
        hi: 'सृजनात्मक विनाश व तकनीकी परिवर्तन — बिना प्रशिक्षण विस्थापन बनाम कौशल-उन्नयन की तुलना हेतु पिन पर टैप करें।',
        spots: [
          { x: 48, y: 64, en: 'Fast Tech + Zero Reskilling (Stress)', hi: 'तेज़ बदलाव, शून्य प्रशिक्षण', detail: b('Old jobs vanish quickly while new roles lag behind — painful displacement!', 'पुरानी नौकरियाँ घटती हैं पर कौशल न मिलने से नए अवसर छूटते हैं!'), set: { techSpeed: 80, retrainSupport: 10 } },
          { x: 20, y: 68, en: 'Fast Tech + 90% Upskilling Boost', hi: 'तेज़ बदलाव + 90% पुनर्प्रशिक्षण', detail: b('Vocational training turns disruption into net job expansion & rising output!', 'कौशल प्रशिक्षण विस्थापन को शुद्ध रोज़गार व उत्पादन वृद्धि में बदलता है!'), set: { techSpeed: 80, retrainSupport: 90 } },
          { x: 88, y: 56, en: 'Gradual Steady Adaptation (30%)', hi: 'धीमा क्रमिक तकनीकी बदलाव', detail: b('Slower adoption softens short-term shocks while lifting output moderately.', 'धीमा परिवर्तन अल्पकालिक झटका कम कर मध्यम वृद्धि देता है।'), set: { techSpeed: 30, retrainSupport: 50 } },
        ],
      },
      svg: ch.html({ label: P('Creative destruction jobs and output over 10 years', '10 वर्षों में सृजनात्मक विनाश के रोज़गार व उत्पादन वक्र') }),
      aria: `Final combined jobs index ${res.finalNetJobs}, displaced peak ${res.displacedPeak}`,
      lines: [
        { en: `Year 10 combined jobs index: ${res.finalNetJobs} (starting 100), while transition displacement stress peaks around ${res.displacedPeak}%.`, hi: `10वें वर्ष में कुल रोज़गार सूचकांक: ${res.finalNetJobs} (प्रारंभ 100), जबकि संक्रमण काल में विस्थापन दबाव ~${res.displacedPeak}% तक जाता है।`, cls: res.displacedPeak > 45 ? 'warn' : 'balanced' },
        { en: 'Joseph Schumpeter’s insight: innovation destroys outdated firms/jobs (“destruction”) even as it lifts living standards and opens new industries (“creation”) — making reskilling vital.', hi: 'नवाचार पुरानी पद्धतियों को बदलकर (“विनाश”) अधिक उत्पादकता व नए उद्योग (“सृजन”) लाता है — इसलिए श्रमिकों का कौशल-उन्नयन आवश्यक है।', cls: 'note' },
      ],
    };
  },
  discover: [
    b('Set Retraining Support to 0% vs 100% while Technology Speed is 80%: compare Year-10 new jobs.', 'तकनीक गति 80% रखकर पुनर्प्रशिक्षण को 0% बनाम 100% करके 10वें वर्ष के नए रोज़गार देखें।'),
    b('Think of UPI replacing paper cheques or smartphones replacing standalone film cameras: who gained and who had to adapt?', 'कागज़ी चेक की जगह UPI या फिल्म कैमरे की जगह स्मार्टफोन का उदाहरण सोचें: किसे लाभ हुआ और किसे कौशल बदलना पड़ा?'),
  ],
  predictions: [{
    id: 'p1',
    stem: b('When a faster new technology displaces an old craft, what raises the number of workers successfully moving into new jobs?', 'जब नई तकनीक पुराने कौशल को विस्थापित करती है, तो अधिक श्रमिकों को नए रोज़गारों से जोड़ने में क्या मदद करता है?'),
    options: [opt('skill', 'Active reskilling, vocational training, and transition support', 'सक्रिय पुनर्प्रशिक्षण, व्यावसायिक शिक्षा और संक्रमण सहायता'), opt('hide', 'Pretending the new technology does not exist', 'यह मान लेना कि नई तकनीक आई ही नहीं')],
    run: (S) => { S.retrainSupport = 90; return 'skill'; },
    explain: () => b('Upskilling raises the new-jobs curve (green) so productivity gains are broadly shared.', 'कौशल-उन्नयन नए रोज़गार वक्र (हरा) को ऊपर उठाता है ताकि प्रगति का लाभ सभी को मिले।'),
  }],
  exit: [{
    id: 'e1',
    stem: b('What does "creative destruction" describe in economics?', 'अर्थशास्त्र में “सृजनात्मक विनाश” किसे दर्शाता है?'),
    correct: 'sch',
    options: [
      opt('sch', 'New innovations replacing older products and business models while creating new industries and higher productivity.', 'नए नवाचारों द्वारा पुराने उत्पादों व मॉडलों को बदलते हुए नए उद्योग व उच्च उत्पादकता का निर्माण करना।'),
      opt('storm', 'Floods destroying factories.', 'बाढ़ से कारखानों का टूटना।', b('Natural disasters are physical shocks, whereas creative destruction comes from innovation.', 'प्राकृतिक आपदा भौतिक संकट है, जबकि सृजनात्मक विनाश नवाचार से आता है।')),
    ],
    explain: b('Creative destruction drives long-run progress while requiring social policies to help displaced workers adapt.', 'सृजनात्मक विनाश दीर्घकालिक प्रगति लाता है और विस्थापित श्रमिकों के लिए पुनर्प्रशिक्षण नीतियाँ माँगता है।'),
    hint: b('Watch the crossing red and green curves on the chart.', 'चार्ट पर लाल और हरे वक्र का कटाव देखें।'),
  }],
  reflect: b('Give one real example of a job or tool that disappeared in your parents’ lifetime and a new job that replaced it.', 'अपने माता-पिता के समय से समाप्त हुए एक कार्य/उपकरण और उसकी जगह आए एक नए रोज़गार का उदाहरण लिखें।'),
};
