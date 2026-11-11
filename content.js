// T02 content (English + draft Hindi, needs subject-teacher review). Model-derived numbers are computed in code, never hard-coded in answers.
export const PLATE_HI = { AF: 'अफ्रीकी', AN: 'अंटार्कटिक', IN: 'भारतीय', AU: 'ऑस्ट्रेलियाई', EU: 'यूरेशियाई', NA: 'उत्तर अमेरिकी', SA: 'दक्षिण अमेरिकी', PA: 'प्रशांत' };
export const T02_OPENING = {
  en: 'Mount Everest’s rocks contain sea fossils, yet the sea is 1,000 km away. How can the floor of an ancient sea end up at the top of the world?',
  hi: 'माउंट एवरेस्ट की चट्टानों में समुद्री जीवाश्म मिलते हैं, जबकि समुद्र 1,000 किमी दूर है। प्राचीन समुद्र का तल दुनिया की चोटी पर कैसे पहुँच गया?',
};
export const T02_LIMITS = {
  en: 'Schematic models, not to scale. Distances (1 cm/yr = 10 km per million years) are exact arithmetic; heights, start times and earthquake cycles are teaching simplifications and are not forecasts. Plate outlines are simplified from the PB2002 model.',
  hi: 'ये योजनाबद्ध मॉडल हैं, पैमाने के अनुसार नहीं। दूरी (1 सेमी/वर्ष = 10 किमी प्रति दस लाख वर्ष) सटीक गणित है; ऊँचाई, आरंभ-समय और भूकंप-चक्र शिक्षण-सरलीकरण हैं, पूर्वानुमान नहीं। प्लेट की रूपरेखा PB2002 मॉडल से सरल की गई है।',
};
export const T02_TEACHER = {
  flow: [
    { en: 'Hook (3 min): show the Everest fossil question; students write a guess.', hi: 'प्रश्न (3 मिनट): एवरेस्ट के जीवाश्म का प्रश्न दिखाएँ; विद्यार्थी अनुमान लिखें।' },
    { en: 'Map (7 min): find the eight major plates; discuss why continents are not the same as plates.', hi: 'मानचित्र (7 मिनट): आठ प्रमुख प्लेटें खोजें; चर्चा करें कि महाद्वीप और प्लेट एक नहीं हैं।' },
    { en: 'Boundaries (15 min): predict, then run each of the four boundary types; compare.', hi: 'सीमाएँ (15 मिनट): पहले अनुमान, फिर चारों सीमा-प्रकार चलाएँ; तुलना करें।' },
    { en: 'Interior (5 min): depth explorer; connect the flowing mantle to plate motion.', hi: 'भीतरी भाग (5 मिनट): गहराई-अन्वेषक; बहते मैंटल को प्लेट-गति से जोड़ें।' },
    { en: 'Exit ticket and reflection (5 min).', hi: 'निकास-टिकट और चिंतन (5 मिनट)।' },
  ],
  misconceptions: [
    { en: '“Continents float on the sea.” They are parts of plates that move on the slowly flowing mantle.', hi: '“महाद्वीप समुद्र पर तैरते हैं।” वे प्लेटों के भाग हैं जो धीरे बहते मैंटल पर चलती हैं।' },
    { en: '“The mantle is liquid.” It is solid rock that flows very slowly; only the outer core is liquid.', hi: '“मैंटल द्रव है।” यह ठोस चट्टान है जो बहुत धीमे बहती है; केवल बाह्य क्रोड द्रव है।' },
    { en: '“Volcanoes happen anywhere.” Most occur along plate boundaries, shown here at the subduction and rift settings.', hi: '“ज्वालामुखी कहीं भी होते हैं।” अधिकांश प्लेट-सीमाओं पर होते हैं।' },
  ],
};
const o = (id, en, hi, why) => ({ id, en, hi, ...(why ? { why } : {}) });
export const PRED = {
  dist: { en: 'Two plates move toward each other at 5 cm per year. How far do they close in 40 million years?', hi: 'दो प्लेटें 5 सेमी प्रति वर्ष की गति से एक-दूसरे की ओर बढ़ती हैं। 40 दस लाख वर्षों में वे कितनी पास आएँगी?', opts: [o('20', '20 km', '20 किमी'), o('200', '200 km', '200 किमी'), o('2000', '2,000 km', '2,000 किमी')] },
  crust: { en: 'At which type of boundary is new crust created?', hi: 'किस प्रकार की सीमा पर नई भूपर्पटी बनती है?', opts: [o('conv-oc', 'Where an ocean plate sinks under a continent', 'जहाँ महासागरीय प्लेट महाद्वीप के नीचे धँसती है'), o('div', 'Where two plates move apart', 'जहाँ दो प्लेटें दूर जाती हैं'), o('trans', 'Where plates slide past each other', 'जहाँ प्लेटें एक-दूसरे के बगल से फिसलती हैं')] },
  mantle: { en: 'Is the mantle, which makes up most of the Earth’s volume, liquid or solid?', hi: 'पृथ्वी के अधिकांश आयतन वाला मैंटल द्रव है या ठोस?', opts: [o('liquid', 'Liquid, like lava', 'द्रव, लावा की तरह'), o('flows', 'Solid, but it flows very slowly', 'ठोस, पर बहुत धीमे बहता है')] },
};
export const EXIT = [
  { id: 'e1', stem: { en: 'Which boundary type best explains the rise of the Himalayas?', hi: 'हिमालय के उठने की सबसे अच्छी व्याख्या कौन-सी सीमा करती है?' }, correct: 'cc',
    options: [o('oc', 'Ocean plate sinking under a continent', 'महासागरीय प्लेट का महाद्वीप के नीचे धँसना', { en: 'That builds volcanic mountain arcs such as the Andes. The Himalayas formed where two continental plates met.', hi: 'इससे एंडीज़ जैसी ज्वालामुखी पर्वत-श्रेणियाँ बनती हैं। हिमालय दो महाद्वीपीय प्लेटों के मिलने से बना।' }), o('cc', 'Two continental plates colliding', 'दो महाद्वीपीय प्लेटों का टकराना'), o('div', 'Two plates moving apart', 'दो प्लेटों का दूर जाना', { en: 'Moving apart makes rifts and ridges, not high folded mountains.', hi: 'दूर जाने से दरार और कटक बनते हैं, ऊँचे वलित पर्वत नहीं।' })],
    explain: { en: 'Both plates are light continental crust, so neither sinks easily; the rock is squeezed and folded upward. Sea-floor rocks were lifted into the range.', hi: 'दोनों प्लेटें हल्की महाद्वीपीय पर्पटी हैं, इसलिए कोई आसानी से नहीं धँसती; चट्टानें दबकर ऊपर मुड़ती हैं। समुद्र-तल की चट्टानें पर्वत में उठ गईं।' }, hint: { en: 'Think of two light, thick slabs pushed together.', hi: 'दो हल्की, मोटी पट्टियों को आपस में धकेलने की कल्पना करें।' } },
  { id: 'e2', stem: { en: 'Which layer of the Earth is liquid?', hi: 'पृथ्वी की कौन-सी परत द्रव है?' }, correct: 'outer_core',
    options: [o('mantle', 'Mantle', 'मैंटल', { en: 'The mantle is solid rock that flows very slowly.', hi: 'मैंटल ठोस चट्टान है जो बहुत धीमे बहती है।' }), o('outer_core', 'Outer core', 'बाह्य क्रोड'), o('inner_core', 'Inner core', 'आंतरिक क्रोड', { en: 'The inner core is solid because of the very high pressure.', hi: 'अत्यधिक दाब के कारण आंतरिक क्रोड ठोस है।' })],
    explain: { en: 'The outer core (about 2,900 to 5,150 km deep) is liquid iron-nickel.', hi: 'बाह्य क्रोड (लगभग 2,900 से 5,150 किमी गहराई) द्रव लोहा-निकल है।' }, hint: { en: 'It sits between the solid mantle and the solid inner core.', hi: 'यह ठोस मैंटल और ठोस आंतरिक क्रोड के बीच है।' } },
  { id: 'e3', stem: { en: 'A plate moves 4 cm per year. How far does it move in 10 million years?', hi: 'एक प्लेट 4 सेमी प्रति वर्ष चलती है। 10 दस लाख वर्षों में वह कितना चलेगी?' }, correct: '400',
    options: [o('40', '40 km', '40 किमी', { en: '1 cm per year is 10 km per million years, so 4 cm per year over 10 million years is 4 × 10 × 10.', hi: '1 सेमी/वर्ष = 10 किमी प्रति दस लाख वर्ष, इसलिए 4 × 10 × 10।' }), o('400', '400 km', '400 किमी'), o('4000', '4,000 km', '4,000 किमी', { en: 'Check the factor: 1 cm per year is 10 km per million years.', hi: 'गुणक जाँचें: 1 सेमी/वर्ष = 10 किमी प्रति दस लाख वर्ष।' })],
    explain: { en: '4 cm/yr × 10 km per Myr per cm/yr × 10 Myr = 400 km.', hi: '4 सेमी/वर्ष × 10 किमी × 10 दस लाख वर्ष = 400 किमी।' }, hint: { en: 'Use 1 cm per year = 10 km per million years.', hi: '1 सेमी/वर्ष = 10 किमी प्रति दस लाख वर्ष का प्रयोग करें।' } },
];
export const HAZARD = { en: 'Choose a place near a plate boundary. Name one hazard it faces and one thing a family or town can do to reduce harm (for example, earthquake-resistant building, drills, warning systems).', hi: 'प्लेट-सीमा के पास का कोई स्थान चुनें। उसका एक खतरा और हानि घटाने के लिए परिवार या कस्बा क्या कर सकता है (जैसे भूकंप-रोधी निर्माण, अभ्यास, चेतावनी-प्रणाली), लिखें।' };
export const REFLECT = { en: 'Write one sentence: how can sea fossils end up on a mountain top?', hi: 'एक वाक्य लिखें: समुद्री जीवाश्म पर्वत की चोटी पर कैसे पहुँच सकते हैं?' };
