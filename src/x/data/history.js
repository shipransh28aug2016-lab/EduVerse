// Class X History — India and the Contemporary World II (NCERT). Dates and facts follow the textbook chapters.
import { b, C, pt, arc, route, f, grp, idea, ev, q } from './_h.js';

export default [
  {
    id: 'H1', unit: 'history', no: 1, icon: 'Flag', en: 'The Rise of Nationalism in Europe', hi: 'यूरोप में राष्ट्रवाद का उदय',
    hook: b('In 1789 most Europeans were subjects of kings. By 1871 many called themselves citizens of nations. What changed?', '1789 में अधिकांश यूरोपवासी राजाओं की प्रजा थे। 1871 तक अनेक लोग स्वयं को राष्ट्रों के नागरिक कहने लगे। क्या बदला?'),
    scenes: [{
      t: b('Europe on the globe', 'ग्लोब पर यूरोप'), kind: 'globe', dist: 2.6, layers: [
        { en: 'France 1789–1815', hi: 'फ़्रांस 1789–1815', focus: f(47, 6), highlight: { France: C.gold, Austria: C.violet }, points: [pt(48.86, 2.35, 'Paris 1789: French Revolution', 'पेरिस 1789: फ़्रांसीसी क्रांति'), pt(48.21, 16.37, 'Vienna 1815: Congress of Vienna', 'वियना 1815: वियना कांग्रेस', C.violet)] },
        { en: 'Germany unifies 1866–71', hi: 'जर्मनी का एकीकरण 1866–71', focus: f(51, 10), highlight: { Germany: C.teal }, points: [pt(52.52, 13.4, 'Berlin: Prussia leads under Bismarck', 'बर्लिन: बिस्मार्क के नेतृत्व में प्रशा', C.teal), pt(50.11, 8.68, 'Frankfurt 1848: Parliament', 'फ़्रैंकफ़र्ट 1848: संसद', C.teal), pt(48.8, 2.12, 'Versailles 1871: German Empire proclaimed', 'वर्साय 1871: जर्मन साम्राज्य की घोषणा')] },
        { en: 'Italy unifies 1859–70', hi: 'इटली का एकीकरण 1859–70', focus: f(42, 12), highlight: { Italy: C.green }, points: [pt(45.07, 7.69, 'Turin: Sardinia-Piedmont, Cavour', 'ट्यूरिन: सार्डिनिया-पीडमॉण्ट, कावूर', C.green), pt(37.6, 14.0, 'Sicily 1860: Garibaldi', 'सिसिली 1860: गैरीबाल्डी', C.coral), pt(41.9, 12.5, 'Rome 1870', 'रोम 1870', C.green)] },
        { en: 'Greece and the Balkans', hi: 'यूनान और बाल्कन', focus: f(41, 22), highlight: { Greece: C.sky, Serbia: C.coral, Bulgaria: C.coral, Romania: C.coral, Montenegro: C.coral, 'Bosnia and Herz.': C.coral, Croatia: C.coral, Slovenia: C.coral, Macedonia: C.coral, Albania: C.coral, Kosovo: C.coral }, points: [pt(37.98, 23.73, 'Greece: independent nation, 1832', 'यूनान: स्वतंत्र राष्ट्र, 1832', C.sky), pt(44.0, 20.5, 'Balkans: rivalries lead towards 1914', 'बाल्कन: प्रतिद्वंद्विता 1914 की ओर', C.coral)] },
      ],
    }],
    ideas: [
      idea('From subject to citizen', 'प्रजा से नागरिक तक', 'The French Revolution moved sovereignty from the monarch to the people: la patrie (the fatherland) and le citoyen (the citizen), a tricolour flag, and uniform laws.', 'फ़्रांसीसी क्रांति ने संप्रभुता राजा से जनता को दी: ला पात्री (पितृभूमि) और ल सितोयेन (नागरिक), तिरंगा झंडा और समान क़ानून।'),
      idea('Liberals against conservatives', 'उदारवादी बनाम रूढ़िवादी', 'After 1815 the Congress of Vienna restored monarchies. Liberals demanded constitutions, a free press and markets without internal customs barriers (Zollverein, 1834).', '1815 के बाद वियना कांग्रेस ने राजतंत्र बहाल किए। उदारवादियों ने संविधान, स्वतंत्र प्रेस और आंतरिक शुल्क-रहित बाज़ार (ज़ॉलवेराइन, 1834) माँगे।'),
      idea('Culture builds the nation', 'संस्कृति से राष्ट्र-निर्माण', 'Romantic artists, folk tales collected by the Grimm brothers, music and language (as in Poland) created a feeling of shared heritage.', 'रूमानी कलाकारों, ग्रिम बंधुओं की लोककथाओं, संगीत और भाषा (जैसे पोलैंड में) ने साझी विरासत की भावना बनाई।'),
      idea('Unification from above', 'ऊपर से एकीकरण', 'Germany (Bismarck, three wars, 1871) and Italy (Cavour, Garibaldi, Victor Emmanuel II) were unified by states and armies; Britain became a nation-state gradually.', 'जर्मनी (बिस्मार्क, तीन युद्ध, 1871) और इटली (कावूर, गैरीबाल्डी, विक्टर इमेनुएल द्वितीय) राज्यों और सेनाओं से एक हुए; ब्रिटेन धीरे-धीरे राष्ट्र-राज्य बना।'),
    ],
    explore: [{
      t: b('Timeline: 1789 to 1914', 'समयरेखा: 1789 से 1914'), kind: 'timeline', events: [
        ev('1789', 'French Revolution', 'फ़्रांसीसी क्रांति', 'Sovereignty passes from the monarchy to a body of French citizens.', 'संप्रभुता राजतंत्र से फ़्रांसीसी नागरिकों को मिलती है।'),
        ev('1804', 'Napoleonic (Civil) Code', 'नेपोलियन की नागरिक संहिता', 'Ends privileges of birth, establishes equality before law and secures the right to property.', 'जन्म पर आधारित विशेषाधिकार समाप्त, क़ानून के सामने समानता और संपत्ति का अधिकार सुरक्षित।'),
        ev('1815', 'Congress of Vienna', 'वियना कांग्रेस', 'Hosted by the Austrian Chancellor Duke Metternich; restores conservative monarchies after Napoleon’s defeat.', 'ऑस्ट्रिया के चांसलर ड्यूक मैटरनिख़ की मेज़बानी; नेपोलियन की हार के बाद रूढ़िवादी राजतंत्र बहाल।'),
        ev('1821', 'Greek struggle begins', 'यूनानी संघर्ष का आरंभ', 'Greeks fight for independence from the Ottoman Empire.', 'यूनानी ऑटोमन साम्राज्य से स्वतंत्रता के लिए लड़ते हैं।'),
        ev('1832', 'Treaty of Constantinople', 'कुस्तुनतुनिया की संधि', 'Recognises Greece as an independent nation.', 'यूनान को स्वतंत्र राष्ट्र की मान्यता।'),
        ev('1834', 'Zollverein', 'ज़ॉलवेराइन', 'A customs union formed at the initiative of Prussia abolishes tariff barriers and reduces the number of currencies.', 'प्रशा की पहल पर बना शुल्क संघ शुल्क-अवरोध हटाता है और मुद्राओं की संख्या घटाता है।'),
        ev('1848', 'Revolutions of the liberals', 'उदारवादियों की क्रांतियाँ', 'The Frankfurt Parliament drafts a constitution for a German nation; the Prussian king rejects the crown.', 'फ़्रैंकफ़र्ट संसद जर्मन राष्ट्र का संविधान बनाती है; प्रशा का राजा ताज ठुकरा देता है।'),
        ev('1861', 'Kingdom of Italy', 'इटली का राज्य', 'Victor Emmanuel II is proclaimed king of united Italy.', 'विक्टर इमेनुएल द्वितीय एकीकृत इटली के राजा घोषित।'),
        ev('1871', 'German Empire', 'जर्मन साम्राज्य', 'The Prussian king William I is proclaimed German Emperor at Versailles.', 'प्रशा के राजा विलियम प्रथम वर्साय में जर्मन सम्राट घोषित।'),
        ev('1914', 'First World War', 'प्रथम विश्व युद्ध', 'Nationalism allied with imperialism and Balkan rivalries leads Europe to disaster.', 'साम्राज्यवाद से जुड़ा राष्ट्रवाद और बाल्कन प्रतिद्वंद्विता यूरोप को विनाश की ओर ले जाती है।'),
      ],
    }],
    quiz: [
      q('Who hosted the Congress of Vienna in 1815?', '1815 की वियना कांग्रेस की मेज़बानी किसने की?', [['Duke Metternich', 'ड्यूक मैटरनिख़'], ['Otto von Bismarck', 'ऑटो वॉन बिस्मार्क'], ['Napoleon', 'नेपोलियन'], ['Giuseppe Mazzini', 'ज्युसेपे मेत्सिनी']], 0, 'The Austrian Chancellor Duke Metternich hosted it.', 'ऑस्ट्रिया के चांसलर ड्यूक मैटरनिख़ ने मेज़बानी की।'),
      q('What was the Zollverein (1834)?', 'ज़ॉलवेराइन (1834) क्या था?', [['A secret society', 'एक गुप्त संगठन'], ['A customs union', 'एक शुल्क संघ'], ['A parliament', 'एक संसद'], ['An army', 'एक सेना']], 1, 'It abolished tariff barriers among most German states.', 'इसने अधिकांश जर्मन राज्यों के बीच शुल्क-अवरोध समाप्त किए।'),
      q('Marianne was the female allegory of which nation?', 'मारीआन किस राष्ट्र का नारी रूपक थी?', [['Germany', 'जर्मनी'], ['Italy', 'इटली'], ['France', 'फ़्रांस'], ['Britain', 'ब्रिटेन']], 2, 'Marianne stood for France; Germania stood for Germany.', 'मारीआन फ़्रांस का और जर्मेनिया जर्मनी का रूपक थी।'),
      q('Where was the German Empire proclaimed in January 1871?', 'जनवरी 1871 में जर्मन साम्राज्य की घोषणा कहाँ हुई?', [['Berlin', 'बर्लिन'], ['Frankfurt', 'फ़्रैंकफ़र्ट'], ['Vienna', 'वियना'], ['Versailles', 'वर्साय']], 3, 'In the Hall of Mirrors at Versailles.', 'वर्साय के शीशमहल (हॉल ऑफ़ मिरर्स) में।'),
    ],
    note: b('The globe uses present-day country outlines; nineteenth-century borders were different.', 'ग्लोब पर आज की देश-सीमाएँ हैं; उन्नीसवीं सदी की सीमाएँ भिन्न थीं।'),
  },
  {
    id: 'H2', unit: 'history', no: 2, icon: 'Flame', en: 'Nationalism in India', hi: 'भारत में राष्ट्रवाद',
    hook: b('How did a pinch of salt, picked up on a beach in Gujarat, shake an empire?', 'गुजरात के समुद्र-तट पर उठाई गई चुटकी भर नमक ने एक साम्राज्य को कैसे हिला दिया?'),
    scenes: [{
      t: b('The movement on the map', 'मानचित्र पर आंदोलन'), kind: 'india', layers: [
        { en: 'First satyagrahas 1917–18', hi: 'पहले सत्याग्रह 1917–18', groups: [grp('Peasants and workers organise', 'किसान और मज़दूर संगठित', C.teal, ['Bihar', 'Gujarat'])], points: [pt(26.65, 84.92, 'Champaran 1917: indigo planters', 'चंपारण 1917: नील बागान', C.teal), pt(22.75, 72.68, 'Kheda 1918: revenue relief', 'खेड़ा 1918: लगान में राहत', C.gold), pt(23.03, 72.58, 'Ahmedabad 1918: mill workers', 'अहमदाबाद 1918: मिल मज़दूर', C.coral, 0.5)] },
        { en: 'Non-Cooperation 1919–22', hi: 'असहयोग 1919–22', groups: [grp('Rowlatt Satyagraha to Non-Cooperation', 'रॉलट सत्याग्रह से असहयोग तक', C.coral, ['Punjab', 'Uttar Pradesh', 'West Bengal', 'Maharashtra'])], points: [pt(31.63, 74.87, 'Amritsar, 13 April 1919: Jallianwala Bagh', 'अमृतसर, 13 अप्रैल 1919: जलियाँवाला बाग़', C.coral), pt(22.57, 88.36, 'Calcutta, Sept 1920', 'कलकत्ता, सितंबर 1920', C.gold), pt(21.15, 79.09, 'Nagpur, Dec 1920: programme adopted', 'नागपुर, दिसंबर 1920: कार्यक्रम स्वीकृत', C.gold), pt(26.65, 83.58, 'Chauri Chaura 1922: movement withdrawn', 'चौरी चौरा 1922: आंदोलन वापस', C.violet)] },
        { en: 'Civil Disobedience 1930', hi: 'सविनय अवज्ञा 1930', groups: [grp('Salt March province', 'नमक यात्रा का प्रांत', C.gold, ['Gujarat'])], points: [pt(23.06, 72.58, 'Sabarmati Ashram: 12 March', 'साबरमती आश्रम: 12 मार्च', C.gold, 0.5), pt(20.89, 72.8, 'Dandi: 6 April, salt law broken', 'दांडी: 6 अप्रैल, नमक क़ानून भंग', C.teal), pt(21.12, 73.11, 'Bardoli 1928', 'बारदोली 1928', C.coral, 0.25)], routes: [route([[23.06, 72.58], [22.3, 72.9], [21.6, 72.95], [20.89, 72.8]], C.gold)] },
        { en: 'Quit India 1942', hi: 'भारत छोड़ो 1942', groups: [grp('“Do or Die”', '“करो या मरो”', C.violet, ['Maharashtra'])], points: [pt(18.96, 72.82, 'Bombay, August 1942: Quit India resolution', 'बंबई, अगस्त 1942: भारत छोड़ो प्रस्ताव', C.violet)] },
      ],
    }],
    ideas: [
      idea('Satyagraha', 'सत्याग्रह', 'The power of truth and non-violence: appeal to the conscience of the oppressor instead of using physical force.', 'सत्य और अहिंसा की शक्ति: शारीरिक बल के स्थान पर उत्पीड़क की अंतरात्मा को जगाना।'),
      idea('Different groups, different swaraj', 'अलग समूह, अलग स्वराज', 'Peasants in Awadh, tribals in the Gudem Hills, plantation workers in Assam and business groups each read their own hopes into swaraj.', 'अवध के किसान, गूडेम पहाड़ियों के आदिवासी, असम के बागान मज़दूर और व्यापारी वर्ग, सबने स्वराज में अपनी आशाएँ देखीं।'),
      idea('Limits of the movement', 'आंदोलन की सीमाएँ', 'Dalit groups under Dr B.R. Ambedkar sought separate electorates (Poona Pact, 1932); many Muslim organisations felt alienated after the 1920s.', 'डॉ. भीमराव अंबेडकर के नेतृत्व में दलित समूहों ने पृथक निर्वाचिका माँगी (पूना पैक्ट, 1932); 1920 के दशक के बाद कई मुस्लिम संगठन अलग-थलग पड़े।'),
      idea('A sense of collective belonging', 'सामूहिक अपनेपन का भाव', 'Bharat Mata, Vande Mataram, folk songs, the tricolour and a reinterpreted history helped people imagine one nation.', 'भारत माता, वंदे मातरम्, लोकगीत, तिरंगा और इतिहास की नई व्याख्या ने लोगों को एक राष्ट्र की कल्पना कराई।'),
    ],
    explore: [{
      t: b('Timeline: 1915 to 1942', 'समयरेखा: 1915 से 1942'), kind: 'timeline', events: [
        ev('1915', 'Gandhiji returns to India', 'गाँधीजी की भारत वापसी', 'He returns from South Africa in January 1915.', 'वे जनवरी 1915 में दक्षिण अफ़्रीका से लौटे।'),
        ev('1917', 'Champaran', 'चंपारण', 'Satyagraha against the oppressive plantation system in Bihar.', 'बिहार में दमनकारी बागान व्यवस्था के विरुद्ध सत्याग्रह।'),
        ev('1919', 'Rowlatt Act and Jallianwala Bagh', 'रॉलट एक्ट और जलियाँवाला बाग़', 'The Act allowed detention without trial for two years. On 13 April General Dyer fired on a peaceful crowd in Amritsar.', 'इस क़ानून ने बिना मुक़दमे दो वर्ष तक क़ैद की अनुमति दी। 13 अप्रैल को जनरल डायर ने अमृतसर में शांत भीड़ पर गोली चलवाई।'),
        ev('1920', 'Non-Cooperation and Khilafat', 'असहयोग और ख़िलाफ़त', 'Adopted at the Nagpur session of the Congress in December 1920.', 'दिसंबर 1920 में कांग्रेस के नागपुर अधिवेशन में स्वीकृत।'),
        ev('1922', 'Chauri Chaura', 'चौरी चौरा', 'After violence at Chauri Chaura, Gandhiji withdraws the movement in February 1922.', 'चौरी चौरा की हिंसा के बाद गाँधीजी ने फ़रवरी 1922 में आंदोलन वापस लिया।'),
        ev('1928', 'Simon Commission arrives', 'साइमन कमीशन का आगमन', 'Greeted with “Go back Simon”: it had no Indian member.', '“साइमन वापस जाओ” से स्वागत: इसमें कोई भारतीय सदस्य नहीं था।'),
        ev('1929', 'Lahore Congress', 'लाहौर कांग्रेस', 'Under Jawaharlal Nehru the demand for Purna Swaraj is formalised.', 'जवाहरलाल नेहरू की अध्यक्षता में पूर्ण स्वराज की माँग औपचारिक बनी।'),
        ev('1930', 'Salt March', 'नमक यात्रा', '78 volunteers walk 240 miles from Sabarmati to Dandi; on 6 April the salt law is broken.', '78 स्वयंसेवक साबरमती से दांडी तक 240 मील चले; 6 अप्रैल को नमक क़ानून तोड़ा गया।'),
        ev('1931', 'Gandhi–Irwin Pact', 'गाँधी–इरविन समझौता', 'Gandhiji agrees to attend the Second Round Table Conference in London.', 'गाँधीजी लंदन के दूसरे गोलमेज़ सम्मेलन में भाग लेने को सहमत हुए।'),
        ev('1932', 'Poona Pact', 'पूना पैक्ट', 'Reserved seats for the Depressed Classes, to be voted in by the general electorate.', 'दलित वर्गों के लिए आरक्षित सीटें, जिन पर मतदान सामान्य निर्वाचिका करेगी।'),
        ev('1942', 'Quit India', 'भारत छोड़ो', 'The “Do or Die” call is given in Bombay in August 1942.', 'अगस्त 1942 में बंबई में “करो या मरो” का आह्वान।'),
      ],
    }],
    quiz: [
      q('Why was the Rowlatt Act (1919) opposed?', 'रॉलट एक्ट (1919) का विरोध क्यों हुआ?', [['It raised the salt tax', 'इसने नमक कर बढ़ाया'], ['It allowed detention without trial', 'इसने बिना मुक़दमे क़ैद की अनुमति दी'], ['It partitioned Bengal', 'इसने बंगाल का विभाजन किया'], ['It banned khadi', 'इसने खादी पर रोक लगाई']], 1, 'Political prisoners could be detained without trial for two years.', 'राजनीतिक क़ैदियों को दो वर्ष तक बिना मुक़दमे क़ैद रखा जा सकता था।'),
      q('Which incident led Gandhiji to withdraw the Non-Cooperation Movement?', 'किस घटना के बाद गाँधीजी ने असहयोग आंदोलन वापस लिया?', [['Jallianwala Bagh', 'जलियाँवाला बाग़'], ['Simon Commission', 'साइमन कमीशन'], ['Chauri Chaura', 'चौरी चौरा'], ['Dandi March', 'दांडी यात्रा']], 2, 'A violent clash at Chauri Chaura in 1922.', '1922 में चौरी चौरा की हिंसक घटना।'),
      q('How far did the Salt March go from Sabarmati to Dandi?', 'साबरमती से दांडी तक नमक यात्रा कितनी लंबी थी?', [['24 miles', '24 मील'], ['100 miles', '100 मील'], ['240 miles', '240 मील'], ['500 miles', '500 मील']], 2, 'About 240 miles, walked in 24 days.', 'लगभग 240 मील, 24 दिनों में।'),
      q('The Poona Pact (1932) was an agreement between Gandhiji and', 'पूना पैक्ट (1932) गाँधीजी और किसके बीच हुआ?', [['Lord Irwin', 'लॉर्ड इरविन'], ['Dr B.R. Ambedkar', 'डॉ. भीमराव अंबेडकर'], ['M.A. Jinnah', 'मो. अ. जिन्ना'], ['Motilal Nehru', 'मोतीलाल नेहरू']], 1, 'It gave the Depressed Classes reserved seats in legislatures.', 'इससे दलित वर्गों को विधायिकाओं में आरक्षित सीटें मिलीं।'),
    ],
    note: b('Places are shown on present-day state outlines. Lahore (1929) is now in Pakistan and appears in the timeline only.', 'स्थान आज की राज्य-सीमाओं पर दिखाए गए हैं। लाहौर (1929) अब पाकिस्तान में है और केवल समयरेखा में है।'),
  },
  {
    id: 'H3', unit: 'history', no: 3, icon: 'Earth', en: 'The Making of a Global World', hi: 'भूमंडलीकृत विश्व का बनना',
    hook: b('The potato in your sabzi and the chilli in your curry are travellers. Where did they come from?', 'आपकी सब्ज़ी का आलू और करी की मिर्च यात्री हैं। वे कहाँ से आए?'),
    scenes: [{
      t: b('Routes that linked the world', 'दुनिया को जोड़ने वाले मार्ग'), kind: 'globe', layers: [
        { en: 'Silk routes', hi: 'रेशम मार्ग', focus: f(36, 62), highlight: { China: C.coral, India: C.gold }, points: [pt(34.3, 108.9, 'China: silk, pottery', 'चीन: रेशम, मृद्भांड', C.coral), pt(39.65, 66.97, 'Central Asia', 'मध्य एशिया'), pt(41.01, 28.98, 'West Asia to Europe', 'पश्चिम एशिया से यूरोप'), pt(22, 78, 'India: textiles, spices', 'भारत: वस्त्र, मसाले')], arcs: [arc([34.3, 108.9], [39.65, 66.97], C.gold), arc([39.65, 66.97], [41.01, 28.98], C.gold), arc([41.01, 28.98], [41.9, 12.5], C.gold), arc([22, 78], [39.65, 66.97], C.teal)] },
        { en: 'Food travels', hi: 'भोजन की यात्रा', focus: f(25, -40), highlight: { Peru: C.green, Mexico: C.green, Ireland: C.coral, Spain: C.gold }, points: [pt(-10, -75, 'Americas: potato, maize, tomato, chillies', 'अमेरिका: आलू, मक्का, टमाटर, मिर्च', C.green), pt(53.3, -8, 'Ireland: potato famine, 1840s', 'आयरलैंड: आलू अकाल, 1840 का दशक', C.coral)], arcs: [arc([-10, -75], [40.4, -3.7], C.green), arc([19, -99], [40.4, -3.7], C.green), arc([40.4, -3.7], [22, 78], C.gold)] },
        { en: 'Indentured labour', hi: 'गिरमिटिया मज़दूर', focus: f(5, 60), highlight: { India: C.gold, 'Trinidad and Tobago': C.coral, Guyana: C.coral, Suriname: C.coral, Fiji: C.coral }, points: [pt(25.5, 84, 'Eastern UP, Bihar, central India, Tamil Nadu', 'पूर्वी उ.प्र., बिहार, मध्य भारत, तमिलनाडु'), pt(10.5, -61.3, 'Trinidad, Guyana, Surinam', 'त्रिनिदाद, गुयाना, सूरीनाम', C.coral), pt(-20.2, 57.5, 'Mauritius', 'मॉरीशस', C.coral), pt(-18, 178, 'Fiji', 'फ़िजी', C.coral)], arcs: [arc([22.57, 88.36], [10.5, -61.3], C.coral), arc([22.57, 88.36], [-20.2, 57.5], C.coral), arc([13.08, 80.27], [-18, 178], C.coral)] },
        { en: 'Bretton Woods 1944', hi: 'ब्रेटन वुड्स 1944', focus: f(42, -72), highlight: { 'United States of America': C.sky }, points: [pt(44.26, -71.44, 'Bretton Woods: IMF and World Bank', 'ब्रेटन वुड्स: IMF और विश्व बैंक', C.sky)] },
      ],
    }],
    ideas: [
      idea('Three flows', 'तीन प्रवाह', 'Economists identify three movements in the nineteenth-century world economy: trade in goods, migration of labour, and movement of capital.', 'अर्थशास्त्री उन्नीसवीं सदी की विश्व अर्थव्यवस्था में तीन प्रवाह पहचानते हैं: वस्तुओं का व्यापार, श्रम का प्रवास और पूँजी का प्रवाह।'),
      idea('Technology shrinks distance', 'तकनीक से दूरी घटी', 'Railways, steamships, the telegraph and refrigerated ships carried food cheaply from distant farms to European markets.', 'रेलवे, भाप के जहाज़, टेलीग्राफ़ और रेफ्रिजरेटर वाले जहाज़ दूर के खेतों से भोजन सस्ते में यूरोपीय बाज़ारों तक ले गए।'),
      idea('Conquest, disease and trade', 'विजय, बीमारी और व्यापार', 'Smallpox helped the conquest of the Americas; rinderpest (cattle plague) destroyed African livelihoods in the 1890s.', 'चेचक ने अमेरिका की विजय में मदद की; रिंडरपेस्ट (मवेशी प्लेग) ने 1890 के दशक में अफ़्रीकी आजीविकाएँ नष्ट कीं।'),
      idea('Depression and a new order', 'महामंदी और नई व्यवस्था', 'The Great Depression (from 1929) wrecked trade. In 1944 the Bretton Woods conference set up the IMF and the World Bank.', 'महामंदी (1929 से) ने व्यापार तबाह किया। 1944 के ब्रेटन वुड्स सम्मेलन ने IMF और विश्व बैंक की स्थापना की।'),
    ],
    explore: [{
      t: b('Timeline of a connected world', 'जुड़ती दुनिया की समयरेखा'), kind: 'timeline', events: [
        ev('Ancient', 'Silk routes', 'रेशम मार्ग', 'Land and sea routes link Asia with Europe and North Africa before the Christian Era.', 'ईसा पूर्व से ही स्थल और समुद्री मार्ग एशिया को यूरोप और उत्तरी अफ़्रीका से जोड़ते थे।'),
        ev('1500s', 'Americas enter world trade', 'अमेरिका विश्व व्यापार में', 'European sailors reach the Americas; new crops and precious metals transform lives elsewhere.', 'यूरोपीय नाविक अमेरिका पहुँचे; नई फ़सलों और क़ीमती धातुओं ने अन्यत्र जीवन बदला।'),
        ev('1840s', 'Irish potato famine', 'आयरलैंड का आलू अकाल', 'Around 10 lakh people die of starvation and twice as many emigrate.', 'लगभग 10 लाख लोग भूख से मरे और इससे दुगुने प्रवास कर गए।'),
        ev('1885', 'Africa divided', 'अफ़्रीका का बँटवारा', 'European powers meet in Berlin to carve up Africa among themselves.', 'यूरोपीय शक्तियों ने बर्लिन में अफ़्रीका को आपस में बाँटा।'),
        ev('1890s', 'Rinderpest in Africa', 'अफ़्रीका में रिंडरपेस्ट', 'The cattle plague kills about 90 per cent of the cattle.', 'मवेशी प्लेग से लगभग 90 प्रतिशत मवेशी मारे गए।'),
        ev('1914–18', 'First World War', 'प्रथम विश्व युद्ध', 'The first modern industrial war; the US turns from debtor to creditor.', 'पहला आधुनिक औद्योगिक युद्ध; अमेरिका क़र्ज़दार से क़र्ज़दाता बना।'),
        ev('1929', 'Great Depression', 'महामंदी', 'Agricultural overproduction and the withdrawal of US loans deepen a worldwide slump.', 'कृषि अति-उत्पादन और अमेरिकी क़र्ज़ों की वापसी ने विश्वव्यापी मंदी गहरी की।'),
        ev('1944', 'Bretton Woods', 'ब्रेटन वुड्स', 'A UN conference in New Hampshire, USA, establishes the IMF and the World Bank.', 'न्यू हैम्पशायर, अमेरिका के सम्मेलन ने IMF और विश्व बैंक स्थापित किए।'),
        ev('1947', 'Twins begin work', 'जुड़वाँ संस्थाएँ शुरू', 'The IMF and the World Bank commence financial operations.', 'IMF और विश्व बैंक ने वित्तीय कामकाज आरंभ किया।'),
      ],
    }],
    quiz: [
      q('Rinderpest, which arrived in Africa in the late 1880s, was', 'रिंडरपेस्ट, जो 1880 के दशक के अंत में अफ़्रीका पहुँचा, क्या था?', [['A cattle plague', 'मवेशियों का प्लेग'], ['A locust attack', 'टिड्डी हमला'], ['A cotton disease', 'कपास का रोग'], ['A trade treaty', 'व्यापार संधि']], 0, 'It killed about 90 per cent of African cattle.', 'इससे अफ़्रीका के लगभग 90 प्रतिशत मवेशी मारे गए।'),
      q('Which two institutions are called the Bretton Woods twins?', 'किन दो संस्थाओं को ब्रेटन वुड्स की जुड़वाँ संतानें कहा जाता है?', [['UN and WTO', 'UN और WTO'], ['IMF and World Bank', 'IMF और विश्व बैंक'], ['G-77 and NAM', 'G-77 और NAM'], ['WHO and ILO', 'WHO और ILO']], 1, 'Both were set up by the 1944 conference.', 'दोनों 1944 के सम्मेलन से बनीं।'),
      q('Nineteenth-century indenture has been described as', 'उन्नीसवीं सदी की गिरमिटिया प्रथा को क्या कहा गया है?', [['Free migration', 'स्वतंत्र प्रवास'], ['A new system of slavery', 'दासता की नई व्यवस्था'], ['A trade union', 'मज़दूर संघ'], ['A land reform', 'भूमि सुधार']], 1, 'Workers were bound by contract and lived in harsh conditions.', 'मज़दूर अनुबंध से बँधे थे और कठोर स्थितियों में रहते थे।'),
      q('Which food reached Europe and Asia from the Americas?', 'कौन-सा खाद्य अमेरिका से यूरोप और एशिया पहुँचा?', [['Rice', 'चावल'], ['Wheat', 'गेहूँ'], ['Potato', 'आलू'], ['Tea', 'चाय']], 2, 'Along with maize, tomatoes, chillies, groundnuts and sweet potatoes.', 'मक्का, टमाटर, मिर्च, मूँगफली और शकरकंद के साथ।'),
    ],
    note: b('Arcs join regions, not exact ports, and use present-day borders.', 'चाप क्षेत्रों को जोड़ते हैं, ठीक-ठीक बंदरगाहों को नहीं, और आज की सीमाएँ दिखाते हैं।'),
  },
  {
    id: 'H4', unit: 'history', no: 4, icon: 'Factory', en: 'The Age of Industrialisation', hi: 'औद्योगीकरण का युग',
    hook: b('Factories did not replace hand workers overnight. Why did hand labour survive for so long?', 'कारख़ानों ने हाथ के कारीगरों को रातोंरात नहीं हटाया। हाथ का श्रम इतने समय तक क्यों टिका रहा?'),
    scenes: [{ t: b('A steam-age cotton mill', 'भाप-युग की सूती मिल'), kind: 'diorama', name: 'factory' }],
    ideas: [
      idea('Proto-industrialisation', 'आदि-औद्योगीकरण', 'Before factories, merchants gave work to peasant households in the countryside to produce for an international market.', 'कारख़ानों से पहले व्यापारी ग्रामीण किसान परिवारों से अंतरराष्ट्रीय बाज़ार के लिए उत्पादन कराते थे।'),
      idea('A slow change', 'धीमा बदलाव', 'New technology was expensive and often broke down. Where labour was abundant, industrialists preferred hand workers.', 'नई तकनीक महँगी थी और अक्सर ख़राब होती थी। जहाँ मज़दूर अधिक थे, उद्योगपति हाथ के कारीगर पसंद करते थे।'),
      idea('Manchester comes to India', 'मैनचेस्टर भारत आया', 'Indian weavers lost export markets and faced cheap machine-made imports; the gomastha supervised them for the Company.', 'भारतीय बुनकरों का निर्यात बाज़ार गया और सस्ते मशीनी आयात आए; गुमाश्ता कंपनी की ओर से उन पर निगरानी रखता था।'),
      idea('Indian entrepreneurs and workers', 'भारतीय उद्यमी और मज़दूर', 'Dwarkanath Tagore, Dinshaw Petit and J.N. Tata built industries; the jobber recruited workers from villages for the mills.', 'द्वारकानाथ टैगोर, दिनशॉ पेटिट और जे.एन. टाटा ने उद्योग खड़े किए; जॉबर गाँवों से मिलों के लिए मज़दूर भर्ती करता था।'),
    ],
    explore: [
      { t: b('Timeline of machines and mills', 'मशीनों और मिलों की समयरेखा'), kind: 'timeline', events: [
        ev('1730s', 'Earliest factories in England', 'इंग्लैंड के शुरुआती कारख़ाने', 'Their number multiplies only in the late eighteenth century.', 'इनकी संख्या अठारहवीं सदी के अंत में ही तेज़ी से बढ़ी।'),
        ev('1764', 'Spinning Jenny', 'स्पिनिंग जेनी', 'Devised by James Hargreaves; it speeds up spinning and reduces labour demand.', 'जेम्स हरग्रीव्ज़ ने बनाई; कताई तेज़ हुई और मज़दूरों की माँग घटी।'),
        ev('1781', 'Watt’s steam engine', 'वॉट का भाप इंजन', 'James Watt patents an improved steam engine; Matthew Boulton manufactures it.', 'जेम्स वॉट ने बेहतर भाप इंजन पेटेंट कराया; मैथ्यू बूल्टन ने इसका निर्माण किया।'),
        ev('1854', 'First cotton mill in Bombay', 'बंबई की पहली सूती मिल', 'It goes into production two years later.', 'इसमें दो वर्ष बाद उत्पादन शुरू हुआ।'),
        ev('1855', 'First jute mill in Bengal', 'बंगाल की पहली जूट मिल', 'Another follows in 1862.', 'दूसरी 1862 में लगी।'),
        ev('1874', 'Madras mill', 'मद्रास की मिल', 'The first spinning and weaving mill of Madras begins production.', 'मद्रास की पहली कताई-बुनाई मिल में उत्पादन शुरू।'),
        ev('1912', 'Iron and steel at Jamshedpur', 'जमशेदपुर में लोहा-इस्पात', 'J.N. Tata’s enterprise sets up the first iron and steel works in India.', 'जे.एन. टाटा के उद्यम ने भारत का पहला लोहा-इस्पात कारख़ाना लगाया।'),
      ] },
      { t: b('Steam engines in England, early 1800s', 'इंग्लैंड में भाप इंजन, 1800 के आरंभ में'), kind: 'donut', suffix: '', center: b('engines in all', 'कुल इंजन'), parts: [{ ...b('Cotton industries', 'सूती उद्योग'), v: 80 }, { ...b('Wool industries', 'ऊनी उद्योग'), v: 9 }, { ...b('Mining, canal works and iron works', 'खनन, नहर और लोहा कारख़ाने'), v: 232 }] },
    ],
    quiz: [
      q('Proto-industrialisation refers to', 'आदि-औद्योगीकरण का अर्थ है', [['The first steel plants', 'पहले इस्पात कारख़ाने'], ['Large-scale production for international markets before factories', 'कारख़ानों से पहले अंतरराष्ट्रीय बाज़ार के लिए बड़े पैमाने का उत्पादन'], ['The use of electricity', 'बिजली का उपयोग'], ['Railway building', 'रेल निर्माण']], 1, 'It was based in the countryside, not in factories.', 'यह कारख़ानों में नहीं, ग्रामीण इलाक़ों में आधारित था।'),
      q('Who was a jobber?', 'जॉबर कौन था?', [['A machine', 'एक मशीन'], ['A cloth merchant', 'कपड़ा व्यापारी'], ['An old, trusted worker who recruited new workers', 'पुराना भरोसेमंद मज़दूर जो नए मज़दूर भर्ती करता था'], ['A tax collector', 'कर संग्राहक']], 2, 'Industrialists employed jobbers to get new recruits.', 'उद्योगपति नई भर्ती के लिए जॉबर रखते थे।'),
      q('Who devised the Spinning Jenny in 1764?', '1764 में स्पिनिंग जेनी किसने बनाई?', [['James Watt', 'जेम्स वॉट'], ['Richard Arkwright', 'रिचर्ड आर्कराइट'], ['James Hargreaves', 'जेम्स हरग्रीव्ज़'], ['Matthew Boulton', 'मैथ्यू बूल्टन']], 2, 'Women who lived by hand spinning attacked the new machines.', 'हाथ से कताई पर निर्भर महिलाओं ने नई मशीनों पर हमले किए।'),
      q('The gomastha was', 'गुमाश्ता था', [['A paid servant who supervised weavers', 'बुनकरों पर निगरानी रखने वाला वेतनभोगी कर्मचारी'], ['A village headman', 'गाँव का मुखिया'], ['A British governor', 'ब्रिटिश गवर्नर'], ['A mill owner', 'मिल मालिक']], 0, 'The East India Company appointed gomasthas to control weavers and supplies.', 'ईस्ट इंडिया कंपनी ने बुनकरों और आपूर्ति पर नियंत्रण के लिए गुमाश्ते नियुक्त किए।'),
    ],
    note: b('The mill is a schematic composite, not a model of one real building.', 'यह मिल एक योजनाबद्ध मिश्रित मॉडल है, किसी एक वास्तविक इमारत का नहीं।'),
  },
  {
    id: 'H5', unit: 'history', no: 5, icon: 'Printer', en: 'Print Culture and the Modern World', hi: 'मुद्रण संस्कृति और आधुनिक दुनिया',
    hook: b('Before print, a book could take months to copy by hand. What happens to ideas when copying takes minutes?', 'छपाई से पहले एक किताब की हाथ से नक़ल में महीनों लगते थे। जब नक़ल मिनटों में होने लगे तो विचारों का क्या होता है?'),
    scenes: [{ t: b('The hand printing press', 'हाथ का छापाख़ाना'), kind: 'diorama', name: 'press' }],
    ideas: [
      idea('Print begins in East Asia', 'छपाई पूर्वी एशिया से', 'Woodblock printing developed in China, Japan and Korea; the Diamond Sutra (AD 868) is the oldest Japanese book.', 'काठ की तख़्ती की छपाई चीन, जापान और कोरिया में विकसित हुई; डायमंड सूत्र (868 ई.) सबसे पुरानी जापानी पुस्तक है।'),
      idea('The print revolution', 'मुद्रण क्रांति', 'Gutenberg’s press (1430s–1448) used movable metal type; the Bible was the first book printed. Books became cheaper and reached a new reading public.', 'गुटेनबर्ग के छापेख़ाने (1430 का दशक–1448) में चल धातु टाइप लगे; पहली छपी पुस्तक बाइबिल थी। किताबें सस्ती हुईं और नया पाठक वर्ग बना।'),
      idea('Debate and dissent', 'बहस और असहमति', 'Luther’s Ninety Five Theses (1517) spread through print and led to the Reformation; the Church kept an Index of Prohibited Books from 1558.', 'लूथर की पिच्चानवे स्थापनाएँ (1517) छपाई से फैलीं और धर्म-सुधार हुआ; चर्च ने 1558 से प्रतिबंधित पुस्तकों की सूची रखी।'),
      idea('Print and nationalism in India', 'भारत में छपाई और राष्ट्रवाद', 'Newspapers carried reform debates and nationalist ideas; the Vernacular Press Act (1878) tried to censor the Indian-language press.', 'अख़बारों ने सुधार की बहसें और राष्ट्रवादी विचार फैलाए; वर्नाक्युलर प्रेस एक्ट (1878) ने भारतीय भाषाओं के प्रेस पर सेंसर लगाना चाहा।'),
    ],
    explore: [{
      t: b('Timeline of print', 'छपाई की समयरेखा'), kind: 'timeline', events: [
        ev('594', 'Woodblock printing in China', 'चीन में तख़्ती की छपाई', 'From AD 594 books are printed by rubbing paper against inked woodblocks.', '594 ई. से स्याही लगी काठ की तख़्ती पर काग़ज़ रगड़कर किताबें छापी जाने लगीं।'),
        ev('768–770', 'Print reaches Japan', 'छपाई जापान पहुँची', 'Buddhist missionaries from China introduce hand-printing technology.', 'चीन के बौद्ध प्रचारक हाथ की छपाई की तकनीक लाए।'),
        ev('868', 'Diamond Sutra', 'डायमंड सूत्र', 'The oldest Japanese book, with six sheets of text and woodcut illustrations.', 'सबसे पुरानी जापानी पुस्तक, जिसमें पाठ के छह पन्ने और काठ पर खुदे चित्र हैं।'),
        ev('1295', 'Marco Polo returns to Italy', 'मार्को पोलो इटली लौटा', 'He brings back knowledge of woodblock printing from China.', 'वह चीन से तख़्ती की छपाई का ज्ञान लाया।'),
        ev('1448', 'Gutenberg’s Bible', 'गुटेनबर्ग की बाइबिल', 'About 180 copies are printed; it takes three years to produce them.', 'लगभग 180 प्रतियाँ छपीं; इन्हें बनाने में तीन वर्ष लगे।'),
        ev('1517', 'Ninety Five Theses', 'पिच्चानवे स्थापनाएँ', 'Martin Luther criticises practices of the Roman Catholic Church; print spreads his ideas.', 'मार्टिन लूथर ने रोमन कैथोलिक चर्च की प्रथाओं की आलोचना की; छपाई ने उनके विचार फैलाए।'),
        ev('1780', 'Bengal Gazette', 'बंगाल गज़ट', 'James Augustus Hickey begins a weekly magazine in India.', 'जेम्स ऑगस्टस हिक्की ने भारत में साप्ताहिक पत्रिका शुरू की।'),
        ev('1821', 'Sambad Kaumudi', 'संवाद कौमुदी', 'Published by Rammohun Roy to argue for reform.', 'राममोहन राय ने सुधार के पक्ष में प्रकाशित की।'),
        ev('1878', 'Vernacular Press Act', 'वर्नाक्युलर प्रेस एक्ट', 'Modelled on the Irish Press Laws; gives the government power to censor the vernacular press.', 'आयरिश प्रेस क़ानूनों के ढर्रे पर; सरकार को देशी भाषाओं के प्रेस पर सेंसर का अधिकार।'),
      ],
    }],
    quiz: [
      q('What was the first book printed by Gutenberg?', 'गुटेनबर्ग ने सबसे पहले कौन-सी पुस्तक छापी?', [['The Bible', 'बाइबिल'], ['Diamond Sutra', 'डायमंड सूत्र'], ['Ninety Five Theses', 'पिच्चानवे स्थापनाएँ'], ['An almanac', 'पंचांग']], 0, 'About 180 copies were printed.', 'लगभग 180 प्रतियाँ छपीं।'),
      q('Who said, “Printing is the ultimate gift of God and the greatest one”?', 'किसने कहा, “मुद्रण ईश्वर की दी हुई महानतम देन है”?', [['Erasmus', 'इरैस्मस'], ['Martin Luther', 'मार्टिन लूथर'], ['Gutenberg', 'गुटेनबर्ग'], ['Marco Polo', 'मार्को पोलो']], 1, 'Print helped spread his Reformation ideas.', 'छपाई ने उनके धर्म-सुधार के विचार फैलाए।'),
      q('The Vernacular Press Act of 1878 was modelled on', 'वर्नाक्युलर प्रेस एक्ट 1878 किस पर आधारित था?', [['French law', 'फ़्रांसीसी क़ानून'], ['Irish Press Laws', 'आयरिश प्रेस क़ानून'], ['The Rowlatt Act', 'रॉलट एक्ट'], ['German law', 'जर्मन क़ानून']], 1, 'It let the government censor reports in the vernacular press.', 'इससे सरकार देशी प्रेस की रिपोर्टों पर सेंसर लगा सकती थी।'),
      q('Who brought the first printing press to India (Goa)?', 'भारत (गोवा) में पहला छापाख़ाना कौन लाया?', [['Dutch traders', 'डच व्यापारी'], ['English officials', 'अंग्रेज़ अधिकारी'], ['Portuguese missionaries', 'पुर्तगाली धर्म-प्रचारक'], ['French soldiers', 'फ़्रांसीसी सैनिक']], 2, 'In the mid-sixteenth century.', 'सोलहवीं सदी के मध्य में।'),
    ],
    note: b('The press is a simplified model of a screw hand press; parts are enlarged for clarity.', 'यह पेंच वाले हाथ के छापेख़ाने का सरल मॉडल है; स्पष्टता के लिए हिस्से बड़े दिखाए गए हैं।'),
  },
];
