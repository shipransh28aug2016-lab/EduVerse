// Opening questions for all 16 themes (Observe → Question). Hindi is draft; needs subject-teacher review. T02/T09 modules carry richer content.
const q = (en, hi) => ({ en, hi });
export const OPENINGS = {
  T01: q('You belong to a family, a village or city, and a country. Which questions about your own life need history, geography, politics AND economics together?', 'आप एक परिवार, गाँव या शहर और देश का हिस्सा हैं। अपने जीवन के कौन-से प्रश्नों के लिए इतिहास, भूगोल, राजनीति और अर्थशास्त्र चारों साथ चाहिए?'),
  T02: q('Mount Everest’s rocks contain sea fossils, yet the sea is 1,000 km away. How can the floor of an ancient sea end up at the top of the world?', 'माउंट एवरेस्ट की चट्टानों में समुद्री जीवाश्म मिलते हैं, जबकि समुद्र 1,000 किमी दूर है। प्राचीन समुद्र का तल दुनिया की चोटी पर कैसे पहुँच गया?'),
  T03: q('Why can it be pleasant in one city and stifling hot in another city on the same day?', 'एक ही दिन एक शहर में मौसम सुहावना और दूसरे में असहनीय गर्मी क्यों हो सकती है?'),
  T04: q('Imagine a world with no shops, no houses and no fixed food supply. How would you live, and what would you need to invent first?', 'ऐसी दुनिया सोचिए जिसमें न दुकानें हैं, न घर, न निश्चित भोजन। आप कैसे रहेंगे, और सबसे पहले क्या खोजना पड़ेगा?'),
  T05: q('Who decides the rules in a society, and how do people accept or challenge them?', 'समाज में नियम कौन तय करता है, और लोग उन्हें कैसे मानते या चुनौती देते हैं?'),
  T06: q('If 30 students must choose one class trip, what makes the way you decide fair?', 'यदि 30 विद्यार्थियों को एक कक्षा-यात्रा चुननी हो, तो निर्णय का कौन-सा तरीका निष्पक्ष बनाता है?'),
  T07: q('One candidate wins with the most votes, but most voters chose someone else. Is that fair, and how could an election be designed differently?', 'एक उम्मीदवार सबसे अधिक मत पाकर जीतता है, पर अधिकांश मतदाताओं ने किसी और को चुना। क्या यह निष्पक्ष है, और चुनाव अलग ढंग से कैसे बनाया जा सकता है?'),
  T08: q('You have ₹100 for a month. What do you choose, what do you give up, and who else is affected by your choice?', 'आपके पास महीने के लिए ₹100 हैं। आप क्या चुनेंगे, क्या छोड़ेंगे, और आपके चुनाव से और किस पर असर पड़ेगा?'),
  T09: q('Why does the price of tomatoes jump after heavy rain, but the price of salt hardly moves?', 'भारी बारिश के बाद टमाटर के दाम क्यों उछल जाते हैं, जबकि नमक के दाम लगभग नहीं बदलते?'),
  T10: q('Why do people say the ocean is the planet’s life support? What would change if the oceans were different?', 'लोग महासागर को पृथ्वी की जीवन-रेखा क्यों कहते हैं? महासागर अलग होते तो क्या बदलता?'),
  T11: q('Why are some places full of forests and others deserts, and how do living things depend on one another?', 'कुछ स्थान वनों से भरे और कुछ मरुस्थल क्यों हैं, और जीव एक-दूसरे पर कैसे निर्भर हैं?'),
  T12: q('When people face a powerful ruler or a crisis, how do they resist, adapt and survive?', 'जब लोग शक्तिशाली शासक या संकट का सामना करते हैं, तो वे कैसे प्रतिरोध करते, ढलते और टिके रहते हैं?'),
  T13: q('Long before airplanes, goods and ideas travelled across continents. How did India connect with the wider world?', 'हवाई जहाज़ों से बहुत पहले वस्तुएँ और विचार महाद्वीपों में पहुँचते थे। भारत शेष विश्व से कैसे जुड़ा था?'),
  T14: q('Why do we follow a rule even when nobody is watching? What gives someone the right to give orders?', 'कोई देख न रहा हो तब भी हम नियम क्यों मानते हैं? आदेश देने का अधिकार किसी को क्या देता है?'),
  T15: q('Spot a daily problem around you. How could an idea to solve it grow into a small business?', 'अपने आसपास की किसी रोज़ की समस्या को पहचानिए। उसे सुलझाने का विचार छोटे व्यवसाय में कैसे बढ़ सकता है?'),
  T16: q('You receive ₹1,000 as a gift. How do you decide what to spend, save or share?', 'आपको उपहार में ₹1,000 मिलते हैं। आप कैसे तय करेंगे कि क्या खर्च, बचत या बाँटना है?'),
};
