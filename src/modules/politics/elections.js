// T07 — Elections. L2: one fictional vote set, three electoral systems. Students predict, then switch the system and compare seats with votes.
import { h, esc, fmt } from '../../core/dom.js';
import * as i18n from '../../core/i18n.js';
import { t } from '../../core/i18n.js';
import * as store from '../../core/store.js';
import { slider, button, chips, bi, relabelBi, predict, mcq } from '../../components/widgets.js';
import { createInteractivePlate } from '../../components/lab-kit.js';
import * as M from './models.js';

const SYS = ['fptp', 'runoff', 'pr'];
const PN = { R: ['Red party', 'लाल दल'], B: ['Blue party', 'नीला दल'], G: ['Green party', 'हरा दल'], Y: ['Yellow party', 'पीला दल'] };
const COLOR = { R: '#c0392b', B: '#1f6fb2', G: '#2e8b57', Y: '#d4a017' };
const pname = (p) => i18n.pair(PN[p][0], PN[p][1]);
const o = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });
const PARTY_OPTS = M.PARTIES.map((p) => o(p, PN[p][0], PN[p][1]));
const EXIT = [
  { id: 'x1', stem: { en: 'Which system gives each party a share of seats closest to its share of votes?', hi: 'कौन-सी प्रणाली हर दल को उसके मत-प्रतिशत के सबसे निकट सीटें देती है?' }, correct: 'pr',
    options: [o('fptp', 'First-past-the-post', 'सर्वाधिक मत से जीत (FPTP)', { en: 'FPTP rewards the party that wins the most constituencies, however narrowly, so seats can differ a lot from votes.', hi: 'FPTP उस दल को पुरस्कृत करता है जो सबसे अधिक क्षेत्र जीतता है, भले ही कम अंतर से, इसलिए सीटें और मत काफ़ी अलग हो सकते हैं।' }), o('runoff', 'Two-round (runoff) system', 'दो-चरण (पुनर्मतदान) प्रणाली', { en: 'Each seat still goes to one winner, so small parties can still get nothing.', hi: 'हर सीट अब भी एक विजेता को मिलती है, इसलिए छोटे दलों को अब भी कुछ नहीं मिल सकता।' }), o('pr', 'Proportional representation', 'समानुपातिक प्रतिनिधित्व')],
    explain: { en: 'Proportional representation allocates seats in proportion to votes, so a party with about 13% of votes gets about 1 of 10 seats.', hi: 'समानुपातिक प्रतिनिधित्व में सीटें मतों के अनुपात में बँटती हैं, इसलिए लगभग 13% मत वाले दल को 10 में से लगभग 1 सीट मिलती है।' }, hint: { en: 'Compare the vote bar and the seat bar for each party.', hi: 'हर दल की मत-पट्टी और सीट-पट्टी की तुलना करें।' } },
  { id: 'x2', stem: { en: 'In first-past-the-post, a candidate wins a constituency by…', hi: 'FPTP में उम्मीदवार किसी निर्वाचन क्षेत्र में कैसे जीतता है…' }, correct: 'most',
    options: [o('most', 'getting more votes than any other candidate', 'किसी भी अन्य उम्मीदवार से अधिक मत पाकर'), o('half', 'getting more than half of all votes', 'कुल मतों के आधे से अधिक पाकर', { en: 'That is a majority. FPTP needs only a plurality: the most votes, even if under half.', hi: 'यह बहुमत है। FPTP में केवल बहुलता चाहिए: सबसे अधिक मत, भले ही आधे से कम हों।' })],
    explain: { en: 'FPTP needs only the most votes (a plurality). That is how a party with 40% of a constituency’s votes can win it.', hi: 'FPTP में केवल सबसे अधिक मत (बहुलता) चाहिए। इसी तरह 40% मत पाने वाला दल क्षेत्र जीत सकता है।' }, hint: { en: 'Look at constituency 1: the winner has 40 out of 100.', hi: 'क्षेत्र 1 देखें: विजेता के 100 में से 40 मत हैं।' } },
];
const REFLECT = { en: 'In one sentence: is it fair that a party can win most seats without winning most votes? Give a reason.', hi: 'एक वाक्य में: क्या यह उचित है कि कोई दल सबसे अधिक मत पाए बिना सबसे अधिक सीटें जीत ले? कारण दें।' };

export function mount(root) {
  const S = store.simState('T07', { ...M.initialElection(), done: {} }); S.done ??= {};
  const prog = store.progress('T07'); const persist = () => store.saveSim();
  const box = h('div', { class: 'chart-box' }), read = h('div', { class: 'readout', role: 'status', 'aria-live': 'polite' }), wins = h('div', { class: 'wins', 'aria-label': t('el.wins') });
  const ch = chips({ name: 'sys', value: S.system, options: SYS.map((id) => ({ id, key: `el.sys.${id}` })), onSelect: (id) => { S.system = id; draw(); } });
  const sw = slider({ id: 'el-swing', labelKey: 'el.ctl.swing', min: -15, max: 15, step: 1, value: S.swing, format: (v) => (v > 0 ? `+${v}` : `${v}`), onInput: (v) => { S.swing = v; draw(); }, hintKey: 'el.ctl.swing.hint' });
  const bReset = button('btn.reset', () => { Object.assign(S, M.initialElection()); ch.select(S.system); sw.set(0); draw(); }, 'btn');

  function draw() {
    persist();
    const r = M.run(S.system, S.swing), W = 640, rowH = 54, x0 = 150, wMax = 440;
    let s = `<svg viewBox="0 0 ${W} ${M.PARTIES.length * rowH + 36}" class="chart" role="img" aria-label="${esc(t('el.chart.aria'))}" xmlns="http://www.w3.org/2000/svg">`;
    M.PARTIES.forEach((p, i) => {
      const y = 12 + i * rowH, vs = r.voteShare[p], ss = r.seats[p] / M.SEATS;
      s += `<text class="lbl" x="${x0 - 8}" y="${y + 20}" text-anchor="end">${esc(pname(p))}</text>`;
      s += `<rect x="${x0}" y="${y}" width="${(vs * wMax).toFixed(1)}" height="18" fill="${COLOR[p]}" opacity=".45"/><text class="tick" x="${x0 + vs * wMax + 6}" y="${y + 14}">${esc(t('el.votes'))} ${fmt(vs * 100, 1)}%</text>`;
      s += `<rect x="${x0}" y="${y + 22}" width="${(ss * wMax).toFixed(1)}" height="18" fill="${COLOR[p]}"/><text class="tick" x="${x0 + ss * wMax + 6}" y="${y + 36}">${esc(t('el.seats'))} ${r.seats[p]}/${M.SEATS}</text>`;
    });
    const hx = x0 + 0.5 * wMax; s += `<line class="guide" x1="${hx}" x2="${hx}" y1="6" y2="${M.PARTIES.length * rowH + 4}"/><text class="tick" x="${hx}" y="${M.PARTIES.length * rowH + 24}" text-anchor="middle">${esc(t('el.half'))}</text></svg>`;
    box.innerHTML = s;
    const winners = S.system === 'fptp' ? M.fptp(r.consts).winners : S.system === 'runoff' ? M.runoff(r.consts).winners : null;
    wins.innerHTML = winners ? `<div class="win-h">${esc(t('el.wins'))}</div>` + winners.map((w, i) => `<span class="win" style="background:${COLOR[w]}" title="${esc(PN[w][0])}">${i + 1}<b>${w}</b></span>`).join('') : `<div class="note">${esc(t('el.pr.note'))}</div>`;
    read.innerHTML = `<div class="ro-line">${esc(t('el.ro.most', { votes: pname(r.topVotes), seats: pname(r.topSeats) }))}</div>` + (r.mismatch ? `<div class="ro-line warn">${esc(t('el.ro.mismatch'))}</div>` : `<div class="ro-line balanced">${esc(t('el.ro.match'))}</div>`) + (S.system === 'runoff' ? `<div class="ro-line note">${esc(t('el.assump'))}</div>` : '');
  }
  const p1 = predict({ id: 'q1', stem: { en: 'Here is a fictional election with 10 constituencies. Under first-past-the-post, which party wins the MOST SEATS?', hi: 'यह 10 निर्वाचन क्षेत्रों वाला काल्पनिक चुनाव है। FPTP में कौन-सा दल सबसे अधिक सीटें जीतेगा?' }, options: PARTY_OPTS,
    run: () => { S.system = 'fptp'; S.swing = 0; ch.select('fptp'); sw.set(0); draw(); return M.run('fptp', 0).topSeats; },
    explain: () => { const r = M.run('fptp', 0); return { en: `${PN[r.topSeats][0]} wins ${r.seats[r.topSeats]} of 10 seats with only ${fmt(r.voteShare[r.topSeats] * 100, 1)}% of votes, while ${PN[r.topVotes][0]} has the most votes (${fmt(r.voteShare[r.topVotes] * 100, 1)}%) but just ${r.seats[r.topVotes]} seats. It wins its three seats by huge margins; the winner took seven seats narrowly.`, hi: `${PN[r.topSeats][1]} केवल ${fmt(r.voteShare[r.topSeats] * 100, 1)}% मतों से 10 में से ${r.seats[r.topSeats]} सीटें जीतता है, जबकि सबसे अधिक मत (${fmt(r.voteShare[r.topVotes] * 100, 1)}%) ${PN[r.topVotes][1]} के पास हैं पर सीटें केवल ${r.seats[r.topVotes]}। वह अपनी तीन सीटें भारी अंतर से जीतता है; विजेता ने सात सीटें कम अंतर से जीतीं।` }; } }, { done: S.done, onDone: persist });
  const p2 = predict({ id: 'q2', stem: { en: 'Now switch to proportional representation. What happens to the Yellow party, which wins no seat under first-past-the-post?', hi: 'अब समानुपातिक प्रतिनिधित्व पर जाएँ। पीला दल, जो FPTP में एक भी सीट नहीं जीतता, उसका क्या होगा?' },
    options: [o('none', 'Still no seats', 'अब भी कोई सीट नहीं'), o('some', 'It gets some seats', 'उसे कुछ सीटें मिलती हैं')],
    run: () => { S.system = 'pr'; S.swing = 0; ch.select('pr'); sw.set(0); draw(); return M.run('pr', 0).seats.Y > 0 ? 'some' : 'none'; },
    explain: () => { const r = M.run('pr', 0); return { en: `With ${fmt(r.voteShare.Y * 100, 1)}% of votes the Yellow party now gets ${r.seats.Y} of 10 seat(s): seats follow votes. The cost is that no single constituency has its own winner.`, hi: `${fmt(r.voteShare.Y * 100, 1)}% मतों के साथ पीला दल अब 10 में से ${r.seats.Y} सीट पाता है: सीटें मतों के अनुसार बँटती हैं। कीमत यह है कि किसी एक क्षेत्र का अपना विजेता नहीं होता।` }; } }, { done: S.done, onDone: persist });
  const exitBox = h('div', { class: 'exit' });
  const mcqs = EXIT.map((q) => { const e = mcq(q, { done: S.done, onDone: (id, v) => { prog.exit[id] = v; store.saveProgress(); persist(); } }); exitBox.append(h('div', { class: 'exit-q' }, e)); return e; });
  const ta = h('textarea', { class: 'reflect', rows: 3, 'data-k-aria': 'reflect.aria', placeholder: t('reflect.ph') }); ta.value = prog.reflection || '';
  ta.addEventListener('input', () => { prog.reflection = ta.value; store.saveProgress(); });
  const elPlate = createInteractivePlate(() => ({
    src: 'assets/images/plates/t07-elections.jpg',
    en: 'One set of votes, three counting rules — tap pins to switch between FPTP, Runoff and Proportional systems live.',
    hi: 'एक ही मत-समूह, मतगणना के तीन नियम — FPTP, दो-चरण और आनुपातिक प्रणाली बदलने हेतु पिन पर टैप करें।',
    spots: [
      { x: 26, y: 54, en: 'First-Past-The-Post (Plurality)', hi: 'सर्वाधिक मत से जीत (FPTP)', detail: { en: 'Most votes in each constituency wins — can create wide gap between vote% and seat%!', hi: 'हर क्षेत्र में सबसे आगे रहने वाला जीतता है — मत% व सीट% में बड़ा अंतर संभव!' }, set: { system: 'fptp', swing: 0 } },
      { x: 54, y: 46, en: 'Two-Round Runoff (>50% Check)', hi: 'दो-चरणीय चुनाव (>50% बहुमत)', detail: { en: 'Top two candidates face a second round so every constituency winner tops 50%.', hi: 'शीर्ष दो उम्मीदवारों में पुनः मतदान ताकि हर सीट विजेता 50% पार करे।' }, set: { system: 'runoff', swing: 0 } },
      { x: 80, y: 58, en: 'Proportional Representation', hi: 'समानुपातिक प्रतिनिधित्व', detail: { en: 'Seats match national vote share so smaller parties like Yellow gain fair seats.', hi: 'सीटें राष्ट्रीय मत-हिस्से से मिलती हैं जिससे छोटे दल भी प्रतिनिधित्व पाते हैं।' }, set: { system: 'pr', swing: 0 } },
    ],
  }), (patch) => { Object.assign(S, patch); ch.select(S.system); sw.set(S.swing); draw(); });
  draw();
  root.append(h('div', { class: 'lab' },
    h('p', { class: 'lead' }, bi({ en: 'One set of fictional votes, three ways to turn votes into seats. Change the system and compare the bars.', hi: 'काल्पनिक मतों का एक ही समूह, मतों को सीटों में बदलने के तीन तरीके। प्रणाली बदलें और पट्टियों की तुलना करें।' })),
    h('div', { class: 'lab-grid' }, h('div', { class: 'lab-main' }, elPlate.el, box, read, wins), h('div', { class: 'lab-side' }, h('h3', { 'data-k': 'el.h.sys' }, t('el.h.sys')), ch.root, sw.root, h('div', { class: 'row' }, bReset), h('p', { class: 'note', 'data-k': 'el.fictional' }, t('el.fictional')))),
    h('section', { class: 'subsec' }, h('h3', { 'data-k': 'predict.h' }, t('predict.h')), p1, p2),
    h('section', { class: 'subsec' }, h('h3', { 'data-k': 'exit.h' }, t('exit.h')), exitBox, h('h3', { 'data-k': 'reflect.h' }, t('reflect.h')), bi(REFLECT, { tag: 'p', cls: 'note' }), ta, h('p', { class: 'note', 'data-k': 'reflect.local' }, t('reflect.local')))));
  i18n.apply(root);
  return { relabel() { elPlate.relabel(); p1.relabel(); p2.relabel(); mcqs.forEach((q) => q.relabel()); relabelBi(root); i18n.apply(root); ta.placeholder = t('reflect.ph'); draw(); }, destroy() {}, debug: () => ({ S, run: M.run(S.system, S.swing) }) };
}
