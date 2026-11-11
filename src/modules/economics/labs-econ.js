// T08.L2 production possibility frontier, T15 startup unit economics + profit/loss, T16 budget, interest and inflation.
import { Chart } from '../../engines/chart.js';
import * as M from '../../engines/domain/market.js';
import * as S_ from '../../engines/domain/startup.js';
import * as F from '../../engines/domain/finance.js';
import { fmt, esc } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';
const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi) => ({ id, en, hi });
const rs = (v) => `₹${fmt(v, 0)}`;
// ------------------------------------------------------------------ T08.L2 PPF
const AMAX = 10, BMAX = 10;
export const ppf = {
  id: 'T08.L2',
  objective: b('Use a production possibility frontier to show scarcity, choice and opportunity cost: producing more of one good means giving up some of another.', 'उत्पादन संभावना वक्र से दुर्लभता, चयन और अवसर-लागत दिखाएँ: एक वस्तु अधिक बनाने का अर्थ दूसरी का कुछ त्यागना है।'),
  note: { kind: 'fictional', en: 'A farm that can grow wheat or vegetables; the numbers are fictional.', hi: 'एक खेत जो गेहूँ या सब्ज़ियाँ उगा सकता है; संख्याएँ काल्पनिक हैं।' },
  init: () => ({ a: 4, b: 5, tech: false }),
  controls: [
    { id: 'a', type: 'slider', label: b('Wheat grown (tonnes)', 'उगाया गया गेहूँ (टन)'), min: 0, max: 13, step: 0.5 },
    { id: 'b', type: 'slider', label: b('Vegetables grown (tonnes)', 'उगाई गई सब्ज़ियाँ (टन)'), min: 0, max: 13, step: 0.5 },
    { id: 'tech', type: 'toggle', label: b('Better seeds and tools (+30% capacity)', 'बेहतर बीज और औज़ार (+30% क्षमता)') },
  ],
  view(S) {
    const k = S.tech ? 1.3 : 1, am = AMAX * k, bm = BMAX * k, pt = M.ppfPoint(S.a, S.b, am, bm);
    const ch = new Chart({ xMax: 14, yMax: 14, xLabel: P('Wheat (tonnes)', 'गेहूँ (टन)'), yLabel: P('Vegetables (tonnes)', 'सब्ज़ियाँ (टन)'), xTicks: 7, yTicks: 7 });
    ch.axes();
    const pts = []; for (let a = 0; a <= am + 1e-9; a += am / 40) pts.push([a, M.ppfB(a, am, bm)]);
    ch.poly([...pts, [0, 0]], 'fillG'); ch.line(pts, 'curve g');
    if (S.tech) { const old = []; for (let a = 0; a <= AMAX + 1e-9; a += AMAX / 40) old.push([a, M.ppfB(a, AMAX, BMAX)]); ch.line(old, 'ghost', { dash: true }); }
    ch.dot(S.a, S.b, pt.status === 'efficient' ? 'optdot' : pt.status === 'inefficient' ? 'eqdot' : 'bmdot', 9);
    const oc = M.opportunityCost(Math.min(S.a, am - 0.5), 0.5, am, bm);
    const lines = [{ en: `Point (${S.a} t wheat, ${S.b} t vegetables): ${pt.status === 'efficient' ? 'ON the frontier: all resources used well.' : pt.status === 'inefficient' ? 'INSIDE the frontier: resources are idle or wasted; you could grow more of both.' : 'OUTSIDE the frontier: not possible with this land, labour and technology.'}`, hi: `बिंदु (${S.a} टन गेहूँ, ${S.b} टन सब्ज़ी): ${pt.status === 'efficient' ? 'वक्र पर: सभी संसाधनों का अच्छा उपयोग।' : pt.status === 'inefficient' ? 'वक्र के भीतर: संसाधन बेकार या निष्क्रिय हैं; आप दोनों अधिक उगा सकते थे।' : 'वक्र के बाहर: इस भूमि, श्रम और तकनीक से संभव नहीं।'}`, cls: pt.status === 'efficient' ? 'balanced' : pt.status === 'inefficient' ? 'note' : 'warn' },
      { en: `Giving up the next 0.5 t of vegetables at this point buys only ${fmt(1 / (oc || Infinity) * 0.5 * 0 + 0.5, 1)} t more wheat; each extra tonne of wheat costs about ${fmt(oc, 2)} t of vegetables (opportunity cost).`, hi: `इस बिंदु पर अगला 0.5 टन गेहूँ बढ़ाने की कीमत लगभग ${fmt(oc * 0.5, 2)} टन सब्ज़ी है; यानी हर अतिरिक्त टन गेहूँ की अवसर-लागत लगभग ${fmt(oc, 2)} टन सब्ज़ी है।` },
      { en: 'The curve bends because land is better suited to one crop than the other: the more wheat you grow, the more vegetable land you give up per tonne.', hi: 'वक्र मुड़ा हुआ इसलिए है कि भूमि एक फ़सल के लिए दूसरी से अधिक उपयुक्त है: जितना अधिक गेहूँ उगाते हैं, प्रति टन उतनी अधिक सब्ज़ी भूमि छोड़नी पड़ती है।', cls: 'note' }];
    lines[1] = { en: `Moving from ${S.a} to ${S.a + 0.5} t of wheat along the frontier costs ${fmt(oc * 0.5, 2)} t of vegetables, so one more tonne of wheat costs about ${fmt(oc, 2)} t of vegetables (opportunity cost).`, hi: `सीमा-रेखा पर गेहूँ ${S.a} से ${S.a + 0.5} टन करने पर ${fmt(oc * 0.5, 2)} टन सब्ज़ी छोड़नी पड़ती है, यानी एक और टन गेहूँ की अवसर-लागत लगभग ${fmt(oc, 2)} टन सब्ज़ी है।` };
    return { svg: ch.html({ label: P('Production possibility frontier', 'उत्पादन संभावना वक्र') }), aria: `Wheat ${S.a}, vegetables ${S.b}: ${pt.status}.`, lines };
  },
  discover: [b('Place the point on the curve at 1 t of wheat, then at 8 t. Which move costs more vegetables per extra tonne of wheat?', 'बिंदु को वक्र पर 1 टन गेहूँ और फिर 8 टन पर रखें। गेहूँ के प्रति अतिरिक्त टन पर किसमें अधिक सब्ज़ी छोड़नी पड़ती है?'), b('Move the point outside the curve, then switch on “better seeds and tools”. What changed?', 'बिंदु को वक्र के बाहर ले जाएँ, फिर “बेहतर बीज और औज़ार” चालू करें। क्या बदला?')],
  predictions: [{ id: 'p1', stem: b('Moving along the frontier, the opportunity cost of one more tonne of wheat is…', 'वक्र पर चलते हुए एक और टन गेहूँ की अवसर-लागत…'), options: [opt('rises', 'Higher the more wheat you already grow', 'जितना अधिक गेहूँ पहले से उगे, उतनी अधिक'), opt('same', 'The same everywhere', 'हर जगह समान'), opt('falls', 'Lower the more wheat you already grow', 'जितना अधिक गेहूँ पहले से उगे, उतनी कम')],
    run: (S) => { S.a = 8; S.b = Math.round(M.ppfB(8, AMAX, BMAX) * 2) / 2; S.tech = false; const lo = M.opportunityCost(1, 1, AMAX, BMAX), hi = M.opportunityCost(8, 1, AMAX, BMAX); return hi > lo * 1.05 ? 'rises' : hi < lo * 0.95 ? 'falls' : 'same'; },
    explain: () => ({ en: `Between 1 and 2 t of wheat you give up ${fmt(M.opportunityCost(1, 1, AMAX, BMAX), 2)} t of vegetables per tonne; between 8 and 9 t you give up ${fmt(M.opportunityCost(8, 1, AMAX, BMAX), 2)} t. Resources are not equally good at both jobs.`, hi: `1 से 2 टन गेहूँ के बीच प्रति टन ${fmt(M.opportunityCost(1, 1, AMAX, BMAX), 2)} टन सब्ज़ी छोड़नी पड़ती है; 8 से 9 टन के बीच ${fmt(M.opportunityCost(8, 1, AMAX, BMAX), 2)} टन। संसाधन दोनों कामों में समान उपयुक्त नहीं होते।` }) }],
  exit: [{ id: 'e1', stem: b('A point INSIDE the frontier means…', 'वक्र के भीतर का बिंदु दर्शाता है…'), correct: 'idle', options: [
    { id: 'idle', ...b('Resources are unemployed or wasted; more of both goods could be produced.', 'संसाधन बेकार या अपव्ययी हैं; दोनों वस्तुएँ अधिक बनाई जा सकती थीं।') }, { id: 'best', ...b('The best possible use of resources.', 'संसाधनों का सर्वोत्तम उपयोग।'), why: b('The best use is ON the frontier, not inside it.', 'सर्वोत्तम उपयोग वक्र पर होता है, भीतर नहीं।') }],
    explain: b('Inside the frontier the economy could gain more of one good without giving up any of the other.', 'वक्र के भीतर अर्थव्यवस्था दूसरी वस्तु छोड़े बिना एक वस्तु अधिक पा सकती है।'), hint: b('Move the point inside the curve and read the message.', 'बिंदु को वक्र के भीतर ले जाकर संदेश पढ़ें।') }],
  reflect: b('Describe a choice in your own life where choosing one thing meant giving up another. What was the opportunity cost?', 'अपने जीवन का ऐसा चयन बताएँ जहाँ एक चीज़ चुनने का मतलब दूसरी छोड़ना था। अवसर-लागत क्या थी?'),
};
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
    return { svg: ch.html({ label: P('Revenue and cost against glasses sold', 'बिके गिलासों के सापेक्ष आय और लागत') }), aria: `Profit ${u.profit} rupees; break-even ${u.breakEven} glasses.`, lines };
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
    return { svg: `<svg viewBox="0 0 640 ${y + 44}" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`, aria: `Income ${income}, profit ${profit}.`, lines: [
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
    return { svg: `<svg viewBox="0 0 640 195" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`, aria: `Savings ${r.savings} rupees a month.`, lines: [
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
    return { svg: ch.html({ label: P('Simple and compound interest', 'साधारण और चक्रवृद्धि ब्याज') }), aria: `After ${S.years} years: simple ${fmt(end.simple, 0)}, compound ${fmt(end.compound, 0)}.`, lines: [
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
    return { svg: ch.html({ label: P('Buying power over time', 'समय के साथ क्रय-शक्ति') }), aria: `After ${S.years} years ₹1000 cash buys ${fmt(last.cash, 0)} rupees worth; saved buys ${fmt(last.saved, 0)}.`, lines: [
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
