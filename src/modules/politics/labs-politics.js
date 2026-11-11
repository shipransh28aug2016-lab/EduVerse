// T06.L3 parliamentary vs presidential systems; T07.L4 coalition formation (institutions + election engines).
import * as I from '../../engines/domain/institutions.js';
import * as E from '../../engines/domain/election.js';
import { esc, fmt } from '../../core/dom.js';
import { pair as P } from '../../core/i18n.js';
const b = (en, hi) => ({ en, hi });
const opt = (id, en, hi) => ({ id, en, hi });
const ACT = { voters: b('Voters', 'मतदाता'), legislature: b('Legislature', 'विधायिका'), executive: b('Government', 'सरकार'), headOfState: b('Head of state', 'राष्ट्राध्यक्ष'), judiciary: b('Judiciary', 'न्यायपालिका') };
const REL = { elect: b('elect', 'चुनते हैं'), forms: b('government formed from', 'से सरकार बनती है'), answerable: b('answerable to', 'के प्रति जवाबदेह'), appoints: b('appoints', 'नियुक्त करता है'), checks: b('reviews', 'समीक्षा करती है'), veto: b('can veto laws of', 'के कानूनों पर वीटो कर सकता है'), impeach: b('impeach only for grave offences', 'केवल गंभीर अपराध पर महाभियोग') };
const POS = { parliamentary: { voters: [320, 30], legislature: [110, 150], executive: [530, 150], headOfState: [530, 30], judiciary: [320, 260] }, presidential: { voters: [320, 30], legislature: [110, 150], executive: [530, 150], judiciary: [320, 260] } };
const SYS = { parliamentary: b('Parliamentary (e.g. India’s Union government)', 'संसदीय (जैसे भारत की केंद्र सरकार)'), presidential: b('Presidential (e.g. the USA)', 'अध्यक्षीय (जैसे अमेरिका)') };
export const institutions = {
  id: 'T06.L3',
  objective: b('Compare how the executive and the legislature are related in a parliamentary and a presidential system, and what happens when the government loses the legislature’s support.', 'संसदीय और अध्यक्षीय प्रणालियों में कार्यपालिका और विधायिका के संबंध की तुलना करें, और सरकार के विधायिका का समर्थन खोने पर क्या होता है।'),
  note: { kind: 'documented', en: 'Simplified textbook models. Real constitutions have many more rules; the seat numbers here are fictional.', hi: 'सरलीकृत पाठ्यपुस्तकीय मॉडल। वास्तविक संविधानों में कहीं अधिक नियम होते हैं; यहाँ सीटों की संख्या काल्पनिक है।' },
  init: () => ({ system: 'parliamentary', support: 62, vote: false }),
  controls: [
    { id: 'system', type: 'chips', label: b('System', 'प्रणाली'), options: I.SYSTEMS.map((id) => ({ id, ...SYS[id] })) },
    { id: 'support', type: 'slider', label: b('Legislators (out of 100) who support the government', 'सरकार का समर्थन करने वाले विधायक (100 में से)'), min: 0, max: 100, step: 1 },
    { id: 'vote', type: 'toggle', label: b('Hold a vote of no confidence', 'अविश्वास प्रस्ताव पर मतदान कराएँ') },
  ],
  view(S) {
    const sys = S.system, pos = POS[sys], total = 100, cv = I.confidenceVote(sys, { total, supportExec: S.support }), lp = I.lawPassage(sys, { total, supportExec: S.support });
    const fell = S.vote && cv.lost && sys === 'parliamentary';
    let g = `<defs><marker id="ar" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="var(--mut)"/></marker></defs>`;
    const w = 200, hgt = 46, edgePt = (a, bb) => { const [x1, y1] = pos[a], [x2, y2] = pos[bb], dx = x2 - x1, dy = y2 - y1, k = Math.max(Math.abs(dx) / (w / 2 + 4), Math.abs(dy) / (hgt / 2 + 4)); return [x1 + dx / k, y1 + dy / k, x2 - dx / k, y2 - dy / k]; };
    I.RELATIONS[sys].forEach(([a, bb, k], i) => {
      let [x1, y1, x2, y2] = edgePt(a, bb); const horiz = Math.abs(x2 - x1) >= Math.abs(y2 - y1), o = (i % 2 ? 1 : -1) * 11;
      if (horiz) { y1 += o; y2 += o; } else { x1 += o * 1.6; x2 += o * 1.6; }
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (horiz ? (o < 0 ? -5 : 14) : 0), cut = fell && ((a === 'legislature' && bb === 'executive') || (a === 'executive' && bb === 'legislature' && k === 'answerable'));
      g += `<line class="edge${cut ? ' x' : ''}" x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" marker-end="url(#ar)"/><text class="txt sm mut" x="${(mx + (horiz ? 0 : (o > 0 && mx < 480 ? 6 : -6))).toFixed(0)}" y="${my.toFixed(0)}" text-anchor="${horiz ? 'middle' : o > 0 && mx < 480 ? 'start' : 'end'}">${esc(P(REL[k].en, REL[k].hi))}</text>`;
    });
    for (const a of I.ACTORS[sys]) { const [x, y] = pos[a]; const bad = fell && a === 'executive'; g += `<rect class="box${bad ? ' bad' : ''}" x="${x - w / 2}" y="${y - hgt / 2}" width="${w}" height="${hgt}" rx="8"/><text class="txt b" x="${x}" y="${y + 4}" text-anchor="middle">${esc(P(ACT[a].en, ACT[a].hi))}</text>`; }
    const bar = `<rect class="bar-s" x="20" y="322" width="${(S.support / 100) * 600}" height="14"/><rect class="bar-bad" x="${20 + (S.support / 100) * 600}" y="322" width="${((100 - S.support) / 100) * 600}" height="14" opacity=".55"/><line x1="320" x2="320" y1="314" y2="344" stroke="var(--ink)" stroke-width="2"/><text class="txt sm" x="20" y="358">${esc(P('Supporters', 'समर्थक'))} ${S.support}</text><text class="txt sm" x="620" y="358" text-anchor="end">${esc(P('Others', 'अन्य'))} ${100 - S.support}</text><text class="txt sm b" x="320" y="312" text-anchor="middle">${esc(P('majority = 51', 'बहुमत = 51'))}</text>`;
    const lines = [];
    if (S.vote) lines.push(sys === 'parliamentary'
      ? (cv.lost ? { en: `The government has only ${S.support} of 100: it LOSES the confidence vote, so it must resign. The head of state invites an alternative government or calls a fresh election.`, hi: `सरकार के पास 100 में से केवल ${S.support} हैं: वह विश्वासमत हार जाती है, इसलिए उसे त्यागपत्र देना होगा। राष्ट्राध्यक्ष वैकल्पिक सरकार को आमंत्रित करता है या नया चुनाव कराता है।`, cls: 'warn' }
        : { en: `With ${S.support} of 100 supporters the government WINS the vote and continues.`, hi: `100 में से ${S.support} समर्थकों के साथ सरकार मतदान जीतती है और जारी रहती है।`, cls: 'balanced' })
      : { en: 'In a presidential system the legislature cannot remove the president by an ordinary no-confidence vote: the president serves a fixed term and can be removed only by impeachment for grave offences, which needs a very large majority.', hi: 'अध्यक्षीय प्रणाली में विधायिका सामान्य अविश्वास मत से राष्ट्रपति को नहीं हटा सकती: राष्ट्रपति निश्चित कार्यकाल पूरा करता है और केवल गंभीर अपराधों पर महाभियोग से हटाया जा सकता है, जिसके लिए बहुत बड़ा बहुमत चाहिए।', cls: 'balanced' });
    lines.push(sys === 'parliamentary'
      ? (lp.passes ? { en: 'The government commands a majority, so its bills can pass: executive and legislature work together.', hi: 'सरकार के पास बहुमत है, इसलिए उसके विधेयक पारित हो सकते हैं: कार्यपालिका और विधायिका साथ काम करती हैं।' } : { en: 'Without a majority the government cannot be sure of passing laws and can be voted out at any time.', hi: 'बहुमत के बिना सरकार कानून पारित होने का भरोसा नहीं कर सकती और कभी भी हटाई जा सकती है।', cls: 'warn' })
      : (lp.passes ? { en: 'The president’s party has a majority, so laws pass easily.', hi: 'राष्ट्रपति की पार्टी के पास बहुमत है, इसलिए कानून आसानी से पारित होते हैं।' } : { en: 'The legislature is controlled by others (divided government): laws may stall (gridlock), but the president stays in office.', hi: 'विधायिका पर अन्य का नियंत्रण है (विभाजित सरकार): कानून अटक सकते हैं (गतिरोध), पर राष्ट्रपति पद पर बना रहता है।', cls: 'warn' }));
    return { svg: `<svg viewBox="0 0 640 368" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}${bar}</svg>`, aria: `${sys} system with ${S.support} of 100 supporters. ${S.vote ? cv.outcome : 'No vote.'}`, lines };
  },
  discover: [b('In the parliamentary system set support to 40 and hold a no-confidence vote. Then switch to the presidential system with the same numbers.', 'संसदीय प्रणाली में समर्थन 40 करें और अविश्वास मत कराएँ। फिर वही संख्याएँ रखकर अध्यक्षीय प्रणाली चुनें।'), b('Which system can end up with a government that cannot pass its laws but stays in office?', 'किस प्रणाली में ऐसी सरकार हो सकती है जो कानून पारित न करा पाए पर पद पर बनी रहे?')],
  predictions: [{ id: 'p1', stem: b('In a PARLIAMENTARY system, the government has 45 of 100 legislators and faces a no-confidence vote. What happens?', 'संसदीय प्रणाली में सरकार के 100 में से 45 विधायक हैं और उसके विरुद्ध अविश्वास मत आता है। क्या होता है?'), options: [opt('falls', 'The government must resign', 'सरकार को त्यागपत्र देना होगा'), opt('stays', 'The government continues until the next election', 'सरकार अगले चुनाव तक चलती है')],
    run: (S) => { S.system = 'parliamentary'; S.support = 45; S.vote = true; return I.confidenceVote('parliamentary', { total: 100, supportExec: 45 }).lost ? 'falls' : 'stays'; }, explain: () => ({ en: 'In a parliamentary system the government exists only while it has the confidence of a majority of the legislature (51 of 100).', hi: 'संसदीय प्रणाली में सरकार तभी तक रहती है जब तक उसे विधायिका के बहुमत (100 में से 51) का विश्वास प्राप्त है।' }) }],
  exit: [{ id: 'e1', stem: b('Which statement about a presidential system is correct?', 'अध्यक्षीय प्रणाली के बारे में कौन-सा कथन सही है?'), correct: 'fixed', options: [
    { id: 'fixed', ...b('The president is elected separately and serves a fixed term, even without a majority in the legislature.', 'राष्ट्रपति अलग से चुना जाता है और विधायिका में बहुमत न होने पर भी निश्चित कार्यकाल पूरा करता है।') },
    { id: 'confidence', ...b('The president must resign whenever the legislature passes a no-confidence motion.', 'विधायिका के अविश्वास प्रस्ताव पारित करते ही राष्ट्रपति को त्यागपत्र देना पड़ता है।'), why: b('That describes a parliamentary system. Try the no-confidence vote in the presidential diagram.', 'यह संसदीय प्रणाली का वर्णन है। अध्यक्षीय आरेख में अविश्वास मत आज़माएँ।') }],
    explain: b('The president and the legislature are elected separately; each has its own source of power.', 'राष्ट्रपति और विधायिका अलग-अलग चुने जाते हैं; दोनों की सत्ता का अपना स्रोत है।'), hint: b('Look at the “elect” arrows into the executive.', 'कार्यपालिका की ओर जाने वाले “चुनते हैं” तीरों को देखें।') }],
  reflect: b('Which system makes the government more answerable to the legislature, and what is one cost of that?', 'कौन-सी प्रणाली सरकार को विधायिका के प्रति अधिक जवाबदेह बनाती है, और उसकी एक कीमत क्या है?'),
};
const PNAME = { R: b('Party R', 'दल R'), B: b('Party B', 'दल B'), G: b('Party G', 'दल G'), Y: b('Party Y', 'दल Y') };
const SYSN = { fptp: b('First-past-the-post', 'सर्वाधिक मत से जीत (FPTP)'), runoff: b('Two-round runoff', 'दो-चरणीय चुनाव'), pr: b('Proportional', 'आनुपातिक') };
export const coalition = {
  id: 'T07.L4',
  objective: b('Find which parties can form a government when no party wins a majority of seats, and see how the electoral system changes the possibilities.', 'पता करें कि जब किसी दल को सीटों का बहुमत नहीं मिलता तो कौन-से दल मिलकर सरकार बना सकते हैं, और चुनाव-प्रणाली संभावनाओं को कैसे बदलती है।'),
  note: { kind: 'fictional', en: 'All parties, votes and seats are fictional. A government needs more than half the seats (6 of 10).', hi: 'सभी दल, मत और सीटें काल्पनिक हैं। सरकार के लिए आधे से अधिक सीटें (10 में से 6) चाहिए।' },
  init: () => ({ system: 'proportional', swing: 0 }),
  controls: [
    { id: 'system', type: 'chips', label: b('Electoral system', 'चुनाव-प्रणाली'), options: [opt('fptp', ...Object.values(SYSN.fptp)), opt('runoff', ...Object.values(SYSN.runoff)), opt('proportional', ...Object.values(SYSN.pr))] },
    { id: 'swing', type: 'slider', label: b('Vote swing from R to B (points)', 'R से B की ओर मत-झुकाव (अंक)'), min: -10, max: 15, step: 1, fmt: (v) => (v > 0 ? `+${v}` : `${v}`) },
  ],
  view(S) {
    const r = E.run(S.system, S.swing), mw = E.minimalWinningCoalitions(r.seats), single = E.PARTIES.find((p) => r.seats[p] >= mw.need);
    const max = 10; let g = '';
    E.PARTIES.forEach((p, i) => { const y = 20 + i * 52; g += `<text class="txt b" x="10" y="${y + 20}">${esc(P(PNAME[p].en, PNAME[p].hi))}</text><rect class="bar-n" x="130" y="${y}" width="${(r.seats[p] / max) * 440}" height="30" opacity="${r.seats[p] >= mw.need ? 1 : 0.75}"/><text class="txt b" x="${136 + (r.seats[p] / max) * 440}" y="${y + 21}">${r.seats[p]} ${esc(P('seats', 'सीटें'))} · ${fmt(r.voteShare[p] * 100, 0)}% ${esc(P('votes', 'मत'))}</text>`; });
    g += `<line x1="${130 + (mw.need / max) * 440 - 0}" x2="${130 + (mw.need / max) * 440}" y1="10" y2="228" stroke="var(--bad)" stroke-width="3" stroke-dasharray="6 4"/><text class="txt sm b" x="${130 + (mw.need / max) * 440}" y="244" text-anchor="middle" fill="var(--bad)">${esc(P('majority: 6', 'बहुमत: 6'))}</text>`;
    const names = (c) => c.parties.map((p) => PNAME[p].en).join(' + '), namesHi = (c) => c.parties.map((p) => PNAME[p].hi).join(' + ');
    const lines = [single ? { en: `${PNAME[single].en} has ${r.seats[single]} of 10 seats: a single-party majority government. No coalition is needed.`, hi: `${PNAME[single].hi} के पास 10 में से ${r.seats[single]} सीटें हैं: एकल-दल बहुमत की सरकार। गठबंधन की आवश्यकता नहीं।`, cls: 'balanced' }
      : { en: `No party reaches ${mw.need} seats (a hung house). Possible minimal coalitions: ${mw.coalitions.map((c) => `${names(c)} (${c.seats})`).join('; ') || 'none'}.`, hi: `कोई दल ${mw.need} सीटों तक नहीं पहुँचता (त्रिशंकु सदन)। संभावित न्यूनतम गठबंधन: ${mw.coalitions.map((c) => `${namesHi(c)} (${c.seats})`).join('; ') || 'कोई नहीं'}।`, cls: 'warn' },
      r.mismatch ? { en: 'The party with the most votes does not have the most seats: the system, not the voters’ wishes alone, shaped the result.', hi: 'सबसे अधिक मत पाने वाले दल के पास सबसे अधिक सीटें नहीं हैं: परिणाम केवल मतदाताओं की इच्छा से नहीं, प्रणाली से भी बना।', cls: 'warn' } : { en: 'The party with the most votes also has the most seats here.', hi: 'यहाँ सबसे अधिक मत पाने वाले दल के पास सबसे अधिक सीटें भी हैं।', cls: 'note' },
      { en: 'In a coalition, parties must agree on a programme and share ministries; a party leaving can end the government.', hi: 'गठबंधन में दलों को कार्यक्रम पर सहमत होना और मंत्रालय बाँटना पड़ता है; किसी दल के हटने से सरकार गिर सकती है।', cls: 'note' }];
    return { svg: `<svg viewBox="0 0 640 255" class="chart" role="img" xmlns="http://www.w3.org/2000/svg">${g}</svg>`, aria: `Seats: ${E.PARTIES.map((p) => `${p} ${r.seats[p]}`).join(', ')}.`, lines };
  },
  discover: [b('Switch to proportional representation. How many parties do you need to form a government now?', 'आनुपातिक प्रतिनिधित्व चुनें। अब सरकार बनाने के लिए कितने दल चाहिए?'), b('Switch to first-past-the-post and move the swing slider until the majority party changes.', 'FPTP चुनें और झुकाव स्लाइडर तब तक बदलें जब तक बहुमत वाला दल न बदल जाए।')],
  predictions: [{ id: 'p1', stem: b('With proportional representation and no swing, does any single party win 6 or more of the 10 seats?', 'आनुपातिक प्रतिनिधित्व और शून्य झुकाव पर क्या किसी एक दल को 10 में से 6 या अधिक सीटें मिलती हैं?'), options: [opt('yes', 'Yes, one party has a majority', 'हाँ, एक दल के पास बहुमत है'), opt('no', 'No, a coalition is needed', 'नहीं, गठबंधन चाहिए')],
    run: (S) => { S.system = 'proportional'; S.swing = 0; const r = E.run('proportional', 0); return Object.values(r.seats).some((v) => v >= 6) ? 'yes' : 'no'; }, explain: () => { const r = E.run('proportional', 0); return { en: `Proportional seats are ${E.PARTIES.map((p) => `${p} ${r.seats[p]}`).join(', ')}: seats follow vote shares, so no party reaches 6 and a coalition is needed.`, hi: `आनुपातिक सीटें ${E.PARTIES.map((p) => `${p} ${r.seats[p]}`).join(', ')} हैं: सीटें मत-अनुपात का अनुसरण करती हैं, इसलिए कोई दल 6 तक नहीं पहुँचता और गठबंधन चाहिए।` }; } }],
  exit: [{ id: 'e1', stem: b('Why can a coalition government be less stable than a single-party majority government?', 'गठबंधन सरकार एकल-दल बहुमत सरकार से कम स्थिर क्यों हो सकती है?'), correct: 'a', options: [
    { id: 'a', ...b('If one partner leaves, the government may lose its majority.', 'यदि कोई साझेदार हट जाए तो सरकार का बहुमत समाप्त हो सकता है।') }, { id: 'b', ...b('Coalitions are not allowed to pass laws.', 'गठबंधनों को कानून पारित करने की अनुमति नहीं होती।'), why: b('Coalitions can pass laws; the risk is losing the majority when a partner leaves.', 'गठबंधन कानून पारित कर सकते हैं; जोखिम यह है कि साझेदार के हटने पर बहुमत चला जाता है।') }],
    explain: b('A coalition’s majority depends on every partner staying, so each partner has bargaining power.', 'गठबंधन का बहुमत हर साझेदार के बने रहने पर निर्भर है, इसलिए हर साझेदार के पास मोलभाव की शक्ति होती है।'), hint: b('Check the seat count of the smallest coalition.', 'सबसे छोटे गठबंधन की सीट-संख्या जाँचें।') }],
  reflect: b('Should a country prefer clear, quick majorities or fair representation of every vote? Give one reason.', 'क्या किसी देश को स्पष्ट, शीघ्र बहुमत पसंद करना चाहिए या हर मत का न्यायपूर्ण प्रतिनिधित्व? एक कारण दें।'),
};
