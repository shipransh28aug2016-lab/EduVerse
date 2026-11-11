// T09 content (English + draft Hindi, needs subject-teacher review). Numbers shown to students come from models.js, never from this file.
const b = (en, hi) => ({ en, hi });
export const T09_LIMITS = b(
  'Straight-line teaching models with fictional numbers. Real markets have many goods, changing tastes and incomes, and curves that are not straight; use these labs to reason about direction and cause, not to predict real prices.',
  'ये काल्पनिक संख्याओं वाले सीधी-रेखा शिक्षण-मॉडल हैं। वास्तविक बाज़ारों में अनेक वस्तुएँ, बदलती रुचियाँ और आय होती हैं और वक्र सीधे नहीं होते; इन प्रयोगों से दिशा और कारण समझें, वास्तविक कीमतों का पूर्वानुमान न लगाएँ।');
export const T09_TEACHER = {
  flow: [
    b('Hook (3 min): show the opening question; students write a guess.', 'प्रश्न (3 मिनट): आरंभिक प्रश्न दिखाएँ; विद्यार्थी अनुमान लिखें।'),
    b('Market lab (15 min): drag the price line to find surplus and shortage, then shift demand and supply; predict before each run.', 'बाज़ार-प्रयोग (15 मिनट): कीमत-रेखा खींचकर अधिशेष और कमी खोजें, फिर माँग और पूर्ति खिसकाएँ; हर बार पहले अनुमान लगाएँ।'),
    b('Price ceiling (5 min): switch on the maximum price and discuss the shortage and black-market pressure.', 'मूल्य-सीमा (5 मिनट): अधिकतम कीमत चालू करें और कमी तथा काला बाज़ार के दबाव पर चर्चा करें।'),
    b('When markets fail (12 min): side effects, public goods and the used-bike market, one prediction each.', 'जब बाज़ार विफल होते हैं (12 मिनट): बाहरी प्रभाव, सार्वजनिक वस्तुएँ और पुरानी बाइक का बाज़ार, प्रत्येक में एक अनुमान।'),
    b('Exit ticket and reflection (5 min).', 'निकास-टिकट और चिंतन (5 मिनट)।'),
  ],
  misconceptions: [
    b('“A higher price means demand has fallen.” A price change moves buyers ALONG the demand curve; the curve itself shifts only when something other than price changes.', '“कीमत बढ़ी यानी माँग घट गई।” कीमत बदलने से खरीदार माँग वक्र पर ही चलते हैं; वक्र तभी खिसकता है जब कीमत के अलावा कुछ और बदले।'),
    b('“A maximum price always helps buyers.” Below equilibrium it creates a shortage: some buyers get the good cheaply, others get none.', '“अधिकतम कीमत हमेशा खरीदारों की मदद करती है।” संतुलन से नीचे यह कमी पैदा करती है: कुछ खरीदारों को वस्तु सस्ती मिलती है, कुछ को मिलती ही नहीं।'),
    b('“A public good is anything the government provides.” It is defined by two tests: nobody can be kept out, and one person’s use does not reduce another’s.', '“सरकार जो भी दे वह सार्वजनिक वस्तु है।” इसकी परिभाषा दो कसौटियों से है: किसी को रोका नहीं जा सकता, और एक के उपयोग से दूसरे का उपयोग नहीं घटता।'),
  ],
};
// prediction option labels, keyed by the answer id that the model returns
export const OPT = {
  surplus: b('A surplus: unsold goods', 'अधिशेष: बिना बिका माल'),
  shortage: b('A shortage: not enough goods', 'कमी: पर्याप्त माल नहीं'),
  balanced: b('The market stays balanced', 'बाज़ार संतुलित रहता है'),
  noeffect: b('Nothing changes', 'कुछ नहीं बदलता'),
  PuQu: b('Price up, quantity up', 'कीमत ऊपर, मात्रा ऊपर'),
  PuQd: b('Price up, quantity down', 'कीमत ऊपर, मात्रा नीचे'),
  PdQu: b('Price down, quantity up', 'कीमत नीचे, मात्रा ऊपर'),
  PdQd: b('Price down, quantity down', 'कीमत नीचे, मात्रा नीचे'),
  moreFall: b('The price falls more', 'कीमत अधिक गिरती है'),
  lessFall: b('The price falls less', 'कीमत कम गिरती है'),
  sameFall: b('The price falls by the same amount', 'कीमत उतनी ही गिरती है'),
  more: b('More than is best for society', 'समाज के लिए सर्वश्रेष्ठ से अधिक'),
  less: b('Less than is best for society', 'समाज के लिए सर्वश्रेष्ठ से कम'),
  same: b('Exactly the best quantity', 'ठीक सर्वश्रेष्ठ मात्रा'),
  yes: b('Yes', 'हाँ'),
  no: b('No', 'नहीं'),
  fair: b('They sell at a fair price', 'वे उचित कीमत पर बिकती हैं'),
  withdraw: b('Their owners withdraw them from the market', 'उनके मालिक उन्हें बाज़ार से हटा लेते हैं'),
};
const o = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });
export const EXIT = [
  { id: 'x1', stem: b('At the current price, sellers offer more than buyers want. What is this called, and which way does the price tend to move?', 'वर्तमान कीमत पर विक्रेता उससे अधिक माल देते हैं जितना खरीदार चाहते हैं। इसे क्या कहते हैं और कीमत किस ओर जाती है?'), correct: 'surdown',
    options: [o('surdown', 'A surplus; the price tends to fall', 'अधिशेष; कीमत गिरने लगती है'), o('surup', 'A surplus; the price tends to rise', 'अधिशेष; कीमत बढ़ने लगती है', b('Sellers with unsold stock cut the price to attract buyers.', 'बिना बिके माल वाले विक्रेता खरीदार खींचने के लिए कीमत घटाते हैं।')), o('shodown', 'A shortage; the price tends to fall', 'कमी; कीमत गिरने लगती है', b('A shortage is the opposite case: buyers want more than sellers offer.', 'कमी उलटी स्थिति है: खरीदार उससे अधिक चाहते हैं जितना विक्रेता देते हैं।'))],
    explain: b('Unsold goods are a surplus. Sellers lower the price until the quantity demanded equals the quantity supplied.', 'बिना बिका माल अधिशेष है। विक्रेता कीमत तब तक घटाते हैं जब तक माँगी गई मात्रा पूर्ति की मात्रा के बराबर न हो जाए।'), hint: b('Think about what a shopkeeper does with stock that is not selling.', 'सोचें कि दुकानदार न बिकने वाले माल का क्या करता है।') },
  { id: 'x2', stem: b('Which of these SHIFTS the whole demand curve for umbrellas?', 'इनमें से क्या छातों का पूरा माँग वक्र खिसकाता है?'), correct: 'rain',
    options: [o('price', 'The price of umbrellas falls', 'छातों की कीमत घटती है', b('A change in the good’s own price moves buyers along the same curve; it does not shift it.', 'वस्तु की अपनी कीमत बदलने से खरीदार उसी वक्र पर चलते हैं; वक्र नहीं खिसकता।')), o('rain', 'The monsoon arrives', 'मानसून आ जाता है'), o('stock', 'Shops hold more umbrellas in stock', 'दुकानें अधिक छाते रखती हैं', b('That changes supply, not demand.', 'इससे पूर्ति बदलती है, माँग नहीं।'))],
    explain: b('Rain makes people want more umbrellas at every price, so the whole curve moves right.', 'बारिश में लोग हर कीमत पर अधिक छाते चाहते हैं, इसलिए पूरा वक्र दाईं ओर खिसकता है।'), hint: b('Look for a cause other than the umbrella’s own price.', 'छाते की अपनी कीमत के अलावा कोई कारण खोजें।') },
  { id: 'x3', stem: b('Why is street lighting usually paid for from taxes rather than sold to each user?', 'सड़क की रोशनी का खर्च प्रत्येक उपयोगकर्ता को बेचने के बजाय प्रायः कर से क्यों चुकाया जाता है?'), correct: 'free',
    options: [o('cost', 'Because it is too expensive for any market', 'क्योंकि यह किसी भी बाज़ार के लिए बहुत महँगी है', b('Cost is not the reason; many expensive things are sold in markets.', 'कारण लागत नहीं है; कई महँगी वस्तुएँ बाज़ार में बिकती हैं।')), o('free', 'Because non-payers cannot be kept out, people wait for others to pay', 'क्योंकि भुगतान न करने वालों को रोका नहीं जा सकता, लोग दूसरों के भुगतान की प्रतीक्षा करते हैं'), o('rival', 'Because one person’s use leaves less light for others', 'क्योंकि एक के उपयोग से दूसरों के लिए रोशनी कम बचती है', b('The light is not used up; that is exactly why it is a public good.', 'रोशनी खर्च नहीं होती; इसी कारण यह सार्वजनिक वस्तु है।'))],
    explain: b('It is non-excludable and non-rival, so everyone is tempted to free-ride. Collecting the cost from all as a tax solves this.', 'यह अपवर्जन-रहित और प्रतिद्वंद्विता-रहित है, इसलिए हर कोई फ्री-राइडिंग के लिए ललचाता है। सबसे कर के रूप में खर्च वसूलना इसका हल है।'), hint: b('Remember the street-light game with 10 households.', '10 परिवारों वाला स्ट्रीट-लाइट खेल याद करें।') },
];
export const REFLECT = b(
  'Think of something whose price changed recently where you live. Was it a change in demand, in supply, or a rule set by the government? Write two sentences.',
  'अपने आसपास की किसी ऐसी वस्तु के बारे में सोचें जिसकी कीमत हाल में बदली। यह माँग में बदलाव था, पूर्ति में, या सरकार का कोई नियम? दो वाक्य लिखें।');
