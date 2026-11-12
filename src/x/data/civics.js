// Class X Political Science — Democratic Politics II (NCERT). Figures are those printed in the textbook chapters.
import { b, C, pt, f, grp, idea, q, node, step } from './_h.js';

export default [
  {
    id: 'P1', unit: 'civics', no: 1, icon: 'Handshake', en: 'Power-sharing', hi: 'सत्ता की साझेदारी',
    hook: b('Belgium and Sri Lanka both had language groups in tension. One shared power, the other did not. What happened next?', 'बेल्जियम और श्रीलंका, दोनों में भाषाई समूहों में तनाव था। एक ने सत्ता बाँटी, दूसरे ने नहीं। फिर क्या हुआ?'),
    scenes: [
      { t: b('Two countries, two choices', 'दो देश, दो रास्ते'), kind: 'globe', dist: 2.6, layers: [
        { en: 'Belgium: accommodation', hi: 'बेल्जियम: समायोजन', focus: f(50.6, 4.6), dist: 2.3, highlight: { Belgium: C.gold, Netherlands: '#3b6a99', France: '#3b6a99', Germany: '#3b6a99', Luxembourg: '#3b6a99' }, points: [pt(50.85, 4.35, 'Brussels: 80% French-speaking, 20% Dutch-speaking', 'ब्रसेल्स: 80% फ़्रेंच-भाषी, 20% डच-भाषी'), pt(51.15, 4.6, 'Flemish region: Dutch 59% of the country', 'फ़्लेमिश क्षेत्र: डच, देश का 59%', C.teal), pt(50.3, 5.2, 'Wallonia region: French 40%', 'वालोनिया क्षेत्र: फ़्रेंच 40%', C.coral)] },
        { en: 'Sri Lanka: majoritarianism', hi: 'श्रीलंका: बहुसंख्यकवाद', focus: f(8, 80.7), dist: 2.3, highlight: { 'Sri Lanka': C.coral, India: '#3b6a99' }, points: [pt(6.93, 79.86, 'Colombo: Sinhala speakers 74%', 'कोलंबो: सिंहली-भाषी 74%', C.gold), pt(9.66, 80.02, 'North and east: Sri Lankan Tamils 13%', 'उत्तर और पूर्व: श्रीलंकाई तमिल 13%', C.teal)] },
      ] },
      { t: b('Four forms of power-sharing', 'सत्ता की साझेदारी के चार रूप'), kind: 'diorama', name: 'tiers', levels: [
        { ...b('Among organs of government (horizontal)', 'शासन के अंगों के बीच (क्षैतिज)'), color: C.gold, items: [b('Legislature', 'विधायिका'), b('Executive', 'कार्यपालिका'), b('Judiciary', 'न्यायपालिका')] },
        { ...b('Among levels of government (vertical)', 'शासन के स्तरों के बीच (ऊर्ध्वाधर)'), color: C.teal, items: [b('Union', 'संघ'), b('State', 'राज्य'), b('Local', 'स्थानीय')] },
        { ...b('Among social groups', 'सामाजिक समूहों के बीच'), color: C.coral, items: [b('Community government in Belgium', 'बेल्जियम की सामुदायिक सरकार'), b('Reserved constituencies in India', 'भारत में आरक्षित निर्वाचन क्षेत्र')] },
        { ...b('Among parties, pressure groups and movements', 'दलों, दबाव समूहों और आंदोलनों के बीच'), color: C.violet, items: [b('Coalition governments', 'गठबंधन सरकारें'), b('Interest groups', 'हित समूह'), b('Movements', 'आंदोलन')] },
      ] },
    ],
    ideas: [
      idea('Majoritarianism in Sri Lanka', 'श्रीलंका में बहुसंख्यकवाद', 'The 1956 Act made Sinhala the only official language; government jobs and university places favoured Sinhalas. Distrust grew into a civil war.', '1956 के क़ानून ने सिंहली को एकमात्र राजभाषा बनाया; सरकारी नौकरियों और विश्वविद्यालयों में सिंहलियों को वरीयता मिली। अविश्वास गृहयुद्ध में बदल गया।'),
      idea('Accommodation in Belgium', 'बेल्जियम में समायोजन', 'Between 1970 and 1993 the constitution was amended four times: equal ministers, strong state governments, a separate Brussels government and a community government.', '1970 से 1993 के बीच संविधान चार बार संशोधित हुआ: बराबर मंत्री, मज़बूत राज्य सरकारें, ब्रसेल्स की अलग सरकार और सामुदायिक सरकार।'),
      idea('Prudential reason', 'युक्तिपरक कारण', 'Power-sharing reduces the possibility of conflict between social groups and so ensures political stability.', 'सत्ता की साझेदारी सामाजिक समूहों के टकराव की आशंका घटाती है और राजनीतिक स्थिरता देती है।'),
      idea('Moral reason', 'नैतिक कारण', 'Power-sharing is the very spirit of democracy: people have a right to be consulted on how they are governed.', 'सत्ता की साझेदारी लोकतंत्र की आत्मा है: लोगों को अधिकार है कि शासन के ढंग पर उनसे सलाह ली जाए।'),
    ],
    explore: [
      { t: b('Who lives where?', 'कौन कहाँ रहता है?'), kind: 'bars', cats: [{ ...b('Belgium: Dutch-speaking', 'बेल्जियम: डच-भाषी'), color: C.teal }, { ...b('Belgium: French-speaking', 'बेल्जियम: फ़्रेंच-भाषी'), color: C.coral }, { ...b('Belgium: German-speaking', 'बेल्जियम: जर्मन-भाषी'), color: C.violet }, { ...b('Sri Lanka: Sinhala-speaking', 'श्रीलंका: सिंहली-भाषी'), color: C.gold }, { ...b('Sri Lanka: Sri Lankan Tamils', 'श्रीलंका: श्रीलंकाई तमिल'), color: C.sky }, { ...b('Sri Lanka: Indian Tamils', 'श्रीलंका: भारतीय तमिल'), color: C.green }], series: [{ ...b('Share of population', 'जनसंख्या में हिस्सा'), values: [59, 40, 1, 74, 13, 5], suffix: '%', max: 100 }] },
      { t: b('How Belgium shared power', 'बेल्जियम ने सत्ता कैसे बाँटी'), kind: 'steps', steps: [
        step('Equal ministers', 'बराबर मंत्री', 'Dutch- and French-speaking ministers are equal in number in the central government; some laws need a majority from each group.', 'केंद्र सरकार में डच और फ़्रेंच-भाषी मंत्री बराबर संख्या में; कुछ क़ानूनों के लिए दोनों समूहों का बहुमत ज़रूरी।'),
        step('Strong state governments', 'मज़बूत राज्य सरकारें', 'Many powers were given to the state governments of the two regions; they are not subordinate to the centre.', 'दोनों क्षेत्रों की राज्य सरकारों को कई शक्तियाँ दी गईं; वे केंद्र के अधीन नहीं हैं।'),
        step('A separate government for Brussels', 'ब्रसेल्स की अलग सरकार', 'Both communities have equal representation in it.', 'इसमें दोनों समुदायों का बराबर प्रतिनिधित्व है।'),
        step('Community government', 'सामुदायिक सरकार', 'Elected by one language community, it has power over cultural, educational and language-related issues.', 'एक भाषा समुदाय द्वारा चुनी जाती है; संस्कृति, शिक्षा और भाषा के मामलों पर इसका अधिकार है।'),
      ] },
    ],
    quiz: [
      q('A belief that the majority community should rule a country in whichever way it wants is called', 'यह मान्यता कि बहुसंख्यक समुदाय जैसे चाहे देश पर शासन करे, कहलाती है', [['Federalism', 'संघवाद'], ['Majoritarianism', 'बहुसंख्यकवाद'], ['Secularism', 'धर्मनिरपेक्षता'], ['Pluralism', 'बहुलवाद']], 1, 'It disregards the wishes and needs of the minority.', 'यह अल्पसंख्यकों की इच्छाओं और ज़रूरतों की अनदेखी करती है।'),
      q('Belgium’s “community government” has power over', 'बेल्जियम की “सामुदायिक सरकार” का अधिकार किन पर है?', [['Defence', 'रक्षा'], ['Cultural, educational and language-related issues', 'संस्कृति, शिक्षा और भाषा संबंधी मुद्दे'], ['Foreign affairs', 'विदेश मामले'], ['Currency', 'मुद्रा']], 1, 'It is elected by people belonging to one language community.', 'इसे एक भाषा समुदाय के लोग चुनते हैं।'),
      q('Power shared among legislature, executive and judiciary is called', 'विधायिका, कार्यपालिका और न्यायपालिका के बीच सत्ता का बँटवारा कहलाता है', [['Vertical distribution', 'ऊर्ध्वाधर वितरण'], ['Horizontal distribution', 'क्षैतिज वितरण'], ['Coalition', 'गठबंधन'], ['Decentralisation', 'विकेंद्रीकरण']], 1, 'Each organ checks the others: a system of checks and balances.', 'हर अंग दूसरे पर अंकुश रखता है: नियंत्रण और संतुलन की व्यवस्था।'),
      q('“Power-sharing is the very spirit of democracy” is a', '“सत्ता की साझेदारी लोकतंत्र की आत्मा है”, यह कौन-सा कारण है?', [['Prudential reason', 'युक्तिपरक कारण'], ['Moral reason', 'नैतिक कारण'], ['Economic reason', 'आर्थिक कारण'], ['Legal reason', 'क़ानूनी कारण']], 1, 'Moral reasons stress the act of power-sharing as valuable in itself.', 'नैतिक कारण सत्ता की साझेदारी को अपने आप में मूल्यवान मानते हैं।'),
    ],
    note: b('Population shares are the rounded figures printed in the NCERT chapter.', 'जनसंख्या के हिस्से NCERT अध्याय में छपे पूर्णांकित आँकड़े हैं।'),
  },
  {
    id: 'P2', unit: 'civics', no: 2, icon: 'Network', en: 'Federalism', hi: 'संघवाद',
    hook: b('Who decides your school syllabus, your city’s water supply and the country’s defence? Not the same government.', 'आपके विद्यालय का पाठ्यक्रम, नगर की जल आपूर्ति और देश की रक्षा कौन तय करता है? एक ही सरकार नहीं।'),
    scenes: [
      { t: b('Three tiers of government', 'शासन के तीन स्तर'), kind: 'diorama', name: 'tiers', levels: [
        { ...b('Union Government: Union List', 'संघ सरकार: संघ सूची'), color: C.gold, items: [b('Defence', 'रक्षा'), b('Foreign affairs', 'विदेश मामले'), b('Banking', 'बैंकिंग'), b('Communications', 'संचार'), b('Currency', 'मुद्रा')] },
        { ...b('State Governments: State List', 'राज्य सरकारें: राज्य सूची'), color: C.teal, items: [b('Police', 'पुलिस'), b('Trade', 'व्यापार'), b('Commerce', 'वाणिज्य'), b('Agriculture', 'कृषि'), b('Irrigation', 'सिंचाई')] },
        { ...b('Local Governments: Panchayats and Municipalities', 'स्थानीय सरकारें: पंचायतें और नगरपालिकाएँ'), color: C.coral, items: [b('Gram Panchayat', 'ग्राम पंचायत'), b('Panchayat Samiti', 'पंचायत समिति'), b('Zilla Parishad', 'ज़िला परिषद'), b('Municipality', 'नगरपालिका'), b('Municipal Corporation', 'नगर निगम')] },
      ] },
      { t: b('The Union of States', 'राज्यों का संघ'), kind: 'india', layers: [
        { en: 'States created in 2000 and 2014', hi: '2000 और 2014 में बने राज्य', groups: [grp('Created in 2000', '2000 में बने', C.gold, ['Chhattisgarh', 'Uttarakhand', 'Jharkhand']), grp('Created in 2014', '2014 में बना', C.teal, ['Telangana'])] },
        { en: 'States with special provisions', hi: 'विशेष प्रावधान वाले राज्य', groups: [grp('Special powers under Article 371', 'अनुच्छेद 371 के अंतर्गत विशेष शक्तियाँ', C.violet, ['Assam', 'Nagaland', 'Arunachal Pradesh', 'Mizoram'])] },
        { en: 'Some Union Territories', hi: 'कुछ केंद्र शासित प्रदेश', groups: [grp('Run with special powers of the Union', 'संघ की विशेष शक्तियों से शासित', C.coral, ['Chandigarh', 'Lakshadweep', 'Delhi', 'Andaman & Nicobar', 'Puducherry'], 1.6)] },
      ] },
    ],
    ideas: [
      idea('What makes a federation', 'संघ क्या है', 'Two or more levels of government, each with its own jurisdiction guaranteed by the constitution; courts settle disputes between them.', 'शासन के दो या अधिक स्तर, जिनका अपना अधिकार क्षेत्र संविधान से सुरक्षित है; विवाद न्यायालय सुलझाते हैं।'),
      idea('Three lists', 'तीन सूचियाँ', 'Union List, State List and Concurrent List (education, forest, trade unions, marriage, adoption, succession). Residuary subjects go to the Union.', 'संघ सूची, राज्य सूची और समवर्ती सूची (शिक्षा, वन, मज़दूर संघ, विवाह, गोद लेना, उत्तराधिकार)। अवशिष्ट विषय संघ के पास हैं।'),
      idea('How federalism is practised', 'संघवाद का व्यवहार', 'Linguistic states, a flexible language policy and changing centre–state relations under coalition governments made Indian federalism work.', 'भाषाई राज्यों, लचीली भाषा नीति और गठबंधन सरकारों के दौर में बदलते केंद्र–राज्य संबंधों ने भारतीय संघवाद को सफल बनाया।'),
      idea('Decentralisation, 1992', 'विकेंद्रीकरण, 1992', 'The Constitution was amended to create a third tier: regular elections, reserved seats for SCs, STs and OBCs, and at least one-third of all positions for women.', 'संविधान संशोधन से तीसरा स्तर बना: नियमित चुनाव, अनुसूचित जाति, जनजाति और पिछड़े वर्गों के लिए आरक्षण, और कम से कम एक-तिहाई पद महिलाओं के लिए।'),
    ],
    explore: [
      { t: b('Scheduled languages of India (Census 2011)', 'भारत की अनुसूचित भाषाएँ (जनगणना 2011)'), kind: 'bars', cats: [b('Hindi', 'हिंदी'), b('Bengali', 'बांग्ला'), b('Marathi', 'मराठी'), b('Telugu', 'तेलुगु'), b('Tamil', 'तमिल'), b('Gujarati', 'गुजराती'), b('Urdu', 'उर्दू'), b('Kannada', 'कन्नड़'), b('Odia', 'ओड़िया'), b('Malayalam', 'मलयालम'), b('Punjabi', 'पंजाबी'), b('Assamese', 'असमिया')], series: [{ ...b('Speakers as a share of total population', 'कुल जनसंख्या में बोलने वालों का हिस्सा'), values: [43.63, 8.03, 6.86, 6.7, 5.7, 4.58, 4.19, 3.61, 3.1, 2.88, 2.74, 1.26], suffix: '%' }] },
      { t: b('Who makes laws on what?', 'किस विषय पर क़ानून कौन बनाता है?'), kind: 'tree', root: node('Division of legislative powers', 'विधायी शक्तियों का विभाजन', [
        node('Union List', 'संघ सूची', [node('Defence, foreign affairs, banking, communications, currency', 'रक्षा, विदेश मामले, बैंकिंग, संचार, मुद्रा')], 'Subjects of national importance that need a uniform policy; only the Union Government makes laws.', 'राष्ट्रीय महत्त्व के विषय जिन पर एक समान नीति चाहिए; केवल संघ सरकार क़ानून बनाती है।'),
        node('State List', 'राज्य सूची', [node('Police, trade, commerce, agriculture, irrigation', 'पुलिस, व्यापार, वाणिज्य, कृषि, सिंचाई')], 'Subjects of state and local importance; only the State Governments make laws.', 'राज्य और स्थानीय महत्त्व के विषय; केवल राज्य सरकारें क़ानून बनाती हैं।'),
        node('Concurrent List', 'समवर्ती सूची', [node('Education, forest, trade unions, marriage, adoption, succession', 'शिक्षा, वन, मज़दूर संघ, विवाह, गोद लेना, उत्तराधिकार')], 'Both can make laws; if they conflict, the Union law prevails.', 'दोनों क़ानून बना सकते हैं; टकराव होने पर संघ का क़ानून मान्य होता है।'),
        node('Residuary subjects', 'अवशिष्ट विषय', [node('For example, computer software', 'उदाहरण: कंप्यूटर सॉफ़्टवेयर')], 'Subjects that came up after the Constitution was made; the Union Government legislates.', 'संविधान बनने के बाद उभरे विषय; क़ानून संघ सरकार बनाती है।'),
      ]) },
    ],
    quiz: [
      q('Who has the power to legislate on residuary subjects?', 'अवशिष्ट विषयों पर क़ानून बनाने की शक्ति किसके पास है?', [['State Governments', 'राज्य सरकारें'], ['Union Government', 'संघ सरकार'], ['Local governments', 'स्थानीय सरकारें'], ['Supreme Court', 'सर्वोच्च न्यायालय']], 1, 'For example, computer software.', 'जैसे कंप्यूटर सॉफ़्टवेयर।'),
      q('India is an example of which kind of federation?', 'भारत किस प्रकार के संघ का उदाहरण है?', [['Coming together', 'साथ आकर बना'], ['Holding together', 'साथ रखकर बना'], ['Unitary', 'एकात्मक'], ['Confederation', 'परिसंघ']], 1, 'A large country divides its power between the national government and the states. The USA is a “coming together” federation.', 'बड़ा देश अपनी शक्ति राष्ट्रीय सरकार और राज्यों में बाँटता है। अमेरिका “साथ आकर बना” संघ है।'),
      q('A major step towards decentralisation was taken in', 'विकेंद्रीकरण की दिशा में बड़ा क़दम कब उठा?', [['1947', '1947'], ['1956', '1956'], ['1992', '1992'], ['2014', '2014']], 2, 'The third tier of democracy was made more powerful and effective.', 'लोकतंत्र के तीसरे स्तर को अधिक शक्तिशाली और प्रभावी बनाया गया।'),
      q('In local government bodies, what share of positions is reserved for women?', 'स्थानीय निकायों में महिलाओं के लिए कितने पद आरक्षित हैं?', [['At least one-tenth', 'कम से कम दसवाँ हिस्सा'], ['At least one-third', 'कम से कम एक-तिहाई'], ['One-half', 'आधे'], ['None', 'कोई नहीं']], 1, 'This is a constitutional requirement since 1992.', 'यह 1992 से संवैधानिक अनिवार्यता है।'),
    ],
    note: b('State outlines are simplified. The list examples follow the NCERT chapter.', 'राज्य सीमाएँ सरलीकृत हैं। सूचियों के उदाहरण NCERT अध्याय के अनुसार हैं।'),
  },
  {
    id: 'P3', unit: 'civics', no: 3, icon: 'Users', en: 'Gender, Religion and Caste', hi: 'जाति, धर्म और लैंगिक मसले',
    hook: b('Social differences exist in every society. When do they strengthen a democracy, and when do they harm it?', 'सामाजिक भिन्नताएँ हर समाज में होती हैं। वे लोकतंत्र को कब मज़बूत करती हैं और कब नुक़सान पहुँचाती हैं?'),
    scenes: [{ t: b('Population by religion, Census 2011', 'धर्म के अनुसार जनसंख्या, जनगणना 2011'), kind: 'towers', cats: [b('Hindu', 'हिंदू'), b('Muslim', 'मुस्लिम'), b('Christian', 'ईसाई'), b('Sikh', 'सिख'), b('Buddhist', 'बौद्ध'), b('Jain', 'जैन')], series: [{ ...b('Share of population', 'जनसंख्या में हिस्सा'), values: [79.8, 14.2, 2.3, 1.7, 0.7, 0.4], unit: '%', suffix: '%' }] }],
    ideas: [
      idea('Gender division', 'लैंगिक विभाजन', 'A sexual division of labour gives women the main responsibility for housework. Feminist movements demand equal rights and opportunities.', 'श्रम के लैंगिक विभाजन में घर के काम की मुख्य ज़िम्मेदारी महिलाओं पर है। नारीवादी आंदोलन समान अधिकार और अवसर माँगते हैं।'),
      idea('Women’s representation', 'महिलाओं का प्रतिनिधित्व', 'The share of women in the Lok Sabha touched 14.36 per cent for the first time in 2019. In local bodies, one-third of seats are reserved for women.', 'लोकसभा में महिलाओं का हिस्सा 2019 में पहली बार 14.36 प्रतिशत तक पहुँचा। स्थानीय निकायों में एक-तिहाई सीटें महिलाओं के लिए आरक्षित हैं।'),
      idea('Communalism and the secular state', 'सांप्रदायिकता और धर्मनिरपेक्ष राज्य', 'Communal politics treats religion as the principal basis of community. The Constitution gives India no official religion and bans discrimination on religious grounds.', 'सांप्रदायिक राजनीति धर्म को समुदाय का मुख्य आधार मानती है। संविधान में भारत का कोई राजकीय धर्म नहीं और धर्म के आधार पर भेदभाव वर्जित है।'),
      idea('Caste and politics', 'जाति और राजनीति', 'Parties consider caste when choosing candidates, but no parliamentary constituency has a clear majority of one caste; caste alone cannot decide elections.', 'दल उम्मीदवार चुनते समय जाति देखते हैं, पर किसी संसदीय क्षेत्र में एक जाति का स्पष्ट बहुमत नहीं; केवल जाति से चुनाव तय नहीं होते।'),
    ],
    explore: [{
      t: b('Three social divisions in politics', 'राजनीति में तीन सामाजिक विभाजन'), kind: 'tree', root: node('Social divisions', 'सामाजिक विभाजन', [
        node('Gender', 'लिंग', [node('Unequal literacy and pay', 'असमान साक्षरता और वेतन', null, 'The Equal Remuneration Act, 1976 provides that equal wages should be paid for equal work.', 'समान पारिश्रमिक अधिनियम 1976 के अनुसार समान काम के लिए समान वेतन मिलना चाहिए।'), node('Political representation', 'राजनीतिक प्रतिनिधित्व', null, 'Women’s organisations demand reservation of at least one-third of seats in the Lok Sabha and State Assemblies.', 'महिला संगठन लोकसभा और विधानसभाओं में कम से कम एक-तिहाई सीटों का आरक्षण माँगते रहे हैं।')]),
        node('Religion', 'धर्म', [node('Communalism', 'सांप्रदायिकता', null, 'It ranges from everyday prejudice to political mobilisation and communal violence.', 'यह रोज़मर्रा के पूर्वाग्रह से राजनीतिक गोलबंदी और सांप्रदायिक हिंसा तक जाती है।'), node('Secular state', 'धर्मनिरपेक्ष राज्य', null, 'Freedom to profess, practise and propagate any religion, or to follow none.', 'किसी भी धर्म को मानने, पालन करने और प्रचार करने, या किसी को न मानने की स्वतंत्रता।')]),
        node('Caste', 'जाति', [node('Caste in politics', 'राजनीति में जाति', null, 'Caste is one of several factors in elections.', 'चुनावों में जाति कई कारकों में से एक है।'), node('Politics in caste', 'जाति में राजनीति', null, 'Politics also changes caste: groups form coalitions and new identities such as “backward” and “forward”.', 'राजनीति भी जाति को बदलती है: समूह गठबंधन बनाते हैं और “पिछड़ा” व “अगड़ा” जैसी नई पहचानें बनती हैं।')]),
      ]),
    }],
    quiz: [
      q('A person who believes in equal rights and opportunities for women and men is a', 'जो व्यक्ति स्त्री-पुरुष के समान अधिकारों और अवसरों में विश्वास रखे, वह है', [['Feminist', 'नारीवादी'], ['Communalist', 'सांप्रदायिक'], ['Casteist', 'जातिवादी'], ['Patriarch', 'पितृसत्तावादी']], 0, 'Feminist movements aim at equality in personal and family life as well.', 'नारीवादी आंदोलन निजी और पारिवारिक जीवन में भी समानता चाहते हैं।'),
      q('Which feature makes India a secular state?', 'कौन-सी विशेषता भारत को धर्मनिरपेक्ष राज्य बनाती है?', [['It has an official religion', 'इसका एक राजकीय धर्म है'], ['It has no official religion', 'इसका कोई राजकीय धर्म नहीं'], ['It bans all religions', 'यह सभी धर्मों पर रोक लगाता है'], ['Only one religion may be practised', 'केवल एक धर्म का पालन हो सकता है']], 1, 'Unlike Sri Lanka (Buddhism) or Pakistan (Islam).', 'श्रीलंका (बौद्ध) या पाकिस्तान (इस्लाम) के विपरीत।'),
      q('The Equal Remuneration Act, 1976 provides for', 'समान पारिश्रमिक अधिनियम 1976 किसका प्रावधान करता है?', [['Equal wages for equal work', 'समान काम के लिए समान वेतन'], ['Reservation in jobs', 'नौकरियों में आरक्षण'], ['Free education', 'निःशुल्क शिक्षा'], ['Voting rights', 'मताधिकार']], 0, 'Yet women are still often paid less than men.', 'फिर भी महिलाओं को प्रायः पुरुषों से कम वेतन मिलता है।'),
      q('In India, seats in local government bodies are reserved for women to the extent of', 'भारत में स्थानीय निकायों में महिलाओं के लिए कितनी सीटें आरक्षित हैं?', [['One-fourth', 'एक-चौथाई'], ['One-third', 'एक-तिहाई'], ['One-half', 'आधी'], ['Two-thirds', 'दो-तिहाई']], 1, 'There are now more than 10 lakh elected women representatives.', 'अब 10 लाख से अधिक निर्वाचित महिला प्रतिनिधि हैं।'),
    ],
    note: b('Census 2011 shares as printed in the NCERT chapter; “others” and “religion not stated” are left out of the towers.', 'जनगणना 2011 के हिस्से NCERT अध्याय के अनुसार; “अन्य” और “धर्म नहीं बताया” स्तंभों में शामिल नहीं हैं।'),
  },
  {
    id: 'P4', unit: 'civics', no: 4, icon: 'Vote', en: 'Political Parties', hi: 'राजनीतिक दल',
    hook: b('Could a democracy of 90 crore voters work if every candidate stood alone, with no party?', '90 करोड़ मतदाताओं का लोकतंत्र क्या चल पाएगा यदि हर उम्मीदवार बिना दल के अकेला खड़ा हो?'),
    scenes: [
      { t: b('Party systems around the world', 'दुनिया की दलीय प्रणालियाँ'), kind: 'globe', dist: 3.1, layers: [
        { en: 'One-party system', hi: 'एकदलीय प्रणाली', focus: f(34, 104), highlight: { China: C.coral }, points: [pt(39.9, 116.4, 'China: only the Communist Party is allowed to rule', 'चीन: केवल कम्युनिस्ट पार्टी को शासन की अनुमति', C.coral)] },
        { en: 'Two-party system', hi: 'द्विदलीय प्रणाली', focus: f(45, -40), highlight: { 'United States of America': C.sky, 'United Kingdom': C.sky }, points: [pt(38.9, -77.04, 'United States of America', 'संयुक्त राज्य अमेरिका', C.sky), pt(51.5, -0.13, 'United Kingdom', 'यूनाइटेड किंगडम', C.sky)] },
        { en: 'Multiparty system', hi: 'बहुदलीय प्रणाली', focus: f(22, 79), highlight: { India: C.gold }, points: [pt(28.61, 77.21, 'India: coalitions and alliances', 'भारत: गठबंधन और मोर्चे')] },
      ] },
      { t: b('Inside a political party', 'राजनीतिक दल के भीतर'), kind: 'diorama', name: 'tiers', levels: [
        { ...b('The leaders', 'नेता'), color: C.gold, items: [b('Decide policies', 'नीतियाँ तय करते हैं'), b('Select candidates', 'उम्मीदवार चुनते हैं')] },
        { ...b('The active members', 'सक्रिय सदस्य'), color: C.teal, items: [b('Campaign', 'प्रचार'), b('Organise meetings', 'सभाएँ आयोजित करना'), b('Mobilise support', 'समर्थन जुटाना'), b('Raise issues', 'मुद्दे उठाना')] },
        { ...b('The followers', 'अनुयायी'), color: C.violet, items: [b('Vote', 'मतदान'), b('Support', 'समर्थन'), b('Give feedback', 'प्रतिक्रिया देना'), b('Donate', 'चंदा देना'), b('Volunteer', 'स्वयंसेवा'), b('Discuss', 'चर्चा')] },
      ] },
    ],
    ideas: [
      idea('What parties do', 'दल क्या करते हैं', 'Contest elections, put forward policies, make laws, form and run governments, play the role of opposition and shape public opinion.', 'चुनाव लड़ते हैं, नीतियाँ रखते हैं, क़ानून बनाते हैं, सरकार बनाते और चलाते हैं, विपक्ष की भूमिका निभाते हैं और जनमत गढ़ते हैं।'),
      idea('National and state parties', 'राष्ट्रीय और राज्य दल', 'A party that secures at least 6% of votes in Lok Sabha or Assembly elections in four states and wins at least four Lok Sabha seats is recognised as a national party.', 'जो दल चार राज्यों के लोकसभा या विधानसभा चुनावों में कम से कम 6% मत पाए और लोकसभा की कम से कम चार सीटें जीते, उसे राष्ट्रीय दल की मान्यता मिलती है।'),
      idea('Challenges', 'चुनौतियाँ', 'Lack of internal democracy, dynastic succession, the role of money and muscle power, and lack of a meaningful choice for voters.', 'आंतरिक लोकतंत्र का अभाव, वंशवादी उत्तराधिकार, धन और बाहुबल की भूमिका, और मतदाताओं के लिए सार्थक विकल्प की कमी।'),
      idea('Reforms', 'सुधार', 'The anti-defection law, affidavits on property and criminal cases ordered by the Supreme Court, and Election Commission rules on organisational elections and income tax returns.', 'दल-बदल विरोधी क़ानून, सर्वोच्च न्यायालय के आदेश से संपत्ति और आपराधिक मामलों का हलफ़नामा, और संगठन चुनाव व आयकर विवरणी पर चुनाव आयोग के नियम।'),
    ],
    explore: [{
      t: b('Functions, challenges and reforms', 'कार्य, चुनौतियाँ और सुधार'), kind: 'tree', root: node('Political parties', 'राजनीतिक दल', [
        node('Functions', 'कार्य', [node('Contest elections', 'चुनाव लड़ना', null, 'In most democracies elections are fought mainly among candidates put up by parties.', 'अधिकांश लोकतंत्रों में चुनाव मुख्यतः दलों के उम्मीदवारों के बीच होते हैं।'), node('Form and run governments', 'सरकार बनाना और चलाना', null, 'Parties recruit leaders, train them and make them ministers.', 'दल नेता तैयार करते हैं, उन्हें प्रशिक्षित करते और मंत्री बनाते हैं।'), node('Act as opposition', 'विपक्ष की भूमिका', null, 'Parties that lose voice different views and criticise the government.', 'हारे हुए दल अलग राय रखते हैं और सरकार की आलोचना करते हैं।')]),
        node('Challenges', 'चुनौतियाँ', [node('Lack of internal democracy', 'आंतरिक लोकतंत्र का अभाव', null, 'Power concentrates in one or a few leaders at the top.', 'सत्ता शीर्ष के एक या कुछ नेताओं में सिमट जाती है।'), node('Money and muscle power', 'धन और बाहुबल', null, 'Parties tend to nominate candidates who have or can raise a lot of money.', 'दल ऐसे उम्मीदवार उतारते हैं जिनके पास बहुत धन हो या जो जुटा सकें।')]),
        node('Reforms', 'सुधार', [node('Anti-defection law', 'दल-बदल विरोधी क़ानून', null, 'Elected MLAs and MPs who change parties lose their seat in the legislature.', 'दल बदलने वाले निर्वाचित विधायक और सांसद सदन की सदस्यता खो देते हैं।'), node('Affidavit of assets and cases', 'संपत्ति और मामलों का हलफ़नामा', null, 'Every candidate must file details of property and pending criminal cases.', 'हर उम्मीदवार को संपत्ति और लंबित आपराधिक मामलों का विवरण देना होता है।')]),
      ]),
    }],
    quiz: [
      q('A system in which several parties compete and more than two have a reasonable chance of coming to power is a', 'जिस प्रणाली में कई दल प्रतिस्पर्धा करें और दो से अधिक के सत्ता में आने की ठीक-ठाक संभावना हो, वह है', [['One-party system', 'एकदलीय प्रणाली'], ['Two-party system', 'द्विदलीय प्रणाली'], ['Multiparty system', 'बहुदलीय प्रणाली'], ['No-party system', 'दलविहीन प्रणाली']], 2, 'India has a multiparty system.', 'भारत में बहुदलीय प्रणाली है।'),
      q('Changing party allegiance after being elected is called', 'निर्वाचित होने के बाद दल बदलना कहलाता है', [['Defection', 'दल-बदल'], ['Coalition', 'गठबंधन'], ['Affidavit', 'हलफ़नामा'], ['Partisanship', 'पक्षधरता']], 0, 'The Constitution was amended to prevent it.', 'इसे रोकने के लिए संविधान संशोधित किया गया।'),
      q('Who recognises and allots symbols to political parties in India?', 'भारत में राजनीतिक दलों को मान्यता और चुनाव चिह्न कौन देता है?', [['Parliament', 'संसद'], ['Election Commission', 'चुनाव आयोग'], ['Supreme Court', 'सर्वोच्च न्यायालय'], ['President', 'राष्ट्रपति']], 1, 'Every party has to register with the Election Commission.', 'हर दल को चुनाव आयोग में पंजीकरण कराना होता है।'),
      q('Which of these is a component of a political party?', 'इनमें से कौन राजनीतिक दल का घटक है?', [['The leaders', 'नेता'], ['The active members', 'सक्रिय सदस्य'], ['The followers', 'अनुयायी'], ['All of these', 'ये सभी']], 3, 'A party has all three components.', 'दल में ये तीनों घटक होते हैं।'),
    ],
    note: b('Which parties are recognised as national parties changes after elections; check the current Election Commission list.', 'किन दलों को राष्ट्रीय दल की मान्यता है, यह चुनावों के बाद बदलता है; चुनाव आयोग की वर्तमान सूची देखें।'),
  },
  {
    id: 'P5', unit: 'civics', no: 5, icon: 'Target', en: 'Outcomes of Democracy', hi: 'लोकतंत्र के परिणाम',
    hook: b('Democracy is slower than dictatorship at taking decisions. Is that a weakness or a strength?', 'लोकतंत्र निर्णय लेने में तानाशाही से धीमा है। यह कमज़ोरी है या ताक़त?'),
    scenes: [{ t: b('Economic growth by type of regime, 1950–2000', 'शासन के प्रकार के अनुसार आर्थिक वृद्धि, 1950–2000'), kind: 'towers', cats: [{ ...b('All democratic regimes', 'सभी लोकतांत्रिक शासन'), color: C.teal }, { ...b('All dictatorial regimes', 'सभी तानाशाही शासन'), color: C.coral }, { ...b('Poor countries under dictatorship', 'तानाशाही वाले ग़रीब देश'), color: C.orange }, { ...b('Poor countries under democracy', 'लोकतंत्र वाले ग़रीब देश'), color: C.gold }], series: [{ ...b('Growth rate', 'वृद्धि दर'), values: [3.95, 4.42, 4.34, 4.28], unit: '% per year', suffix: '%', max: 5 }] }],
    ideas: [
      idea('Accountable, responsive, legitimate', 'उत्तरदायी, ज़िम्मेदार, वैध', 'Democracy produces a government that follows procedures, can be questioned by citizens and is the people’s own government.', 'लोकतंत्र ऐसी सरकार देता है जो प्रक्रिया मानती है, जिससे नागरिक सवाल पूछ सकते हैं और जो लोगों की अपनी सरकार है।'),
      idea('Growth and inequality', 'वृद्धि और असमानता', 'Dictatorships have a slightly higher growth rate, but among poor countries the difference is negligible. Democracies have not been very successful in reducing economic inequalities.', 'तानाशाहियों की वृद्धि दर थोड़ी अधिक है, पर ग़रीब देशों में अंतर नगण्य है। आर्थिक असमानता घटाने में लोकतंत्र बहुत सफल नहीं रहे।'),
      idea('Accommodating diversity', 'विविधता का समायोजन', 'Democracies develop procedures to conduct competition peacefully; the majority must work with the minority.', 'लोकतंत्र शांतिपूर्ण प्रतिस्पर्धा की प्रक्रियाएँ विकसित करते हैं; बहुमत को अल्पमत के साथ मिलकर काम करना होता है।'),
      idea('Dignity and freedom', 'गरिमा और स्वतंत्रता', 'Democracy stands much superior in promoting the dignity and freedom of the individual; people’s complaints are themselves a sign that it is working.', 'व्यक्ति की गरिमा और स्वतंत्रता बढ़ाने में लोकतंत्र कहीं बेहतर है; लोगों की शिकायतें स्वयं इसके कारगर होने का संकेत हैं।'),
    ],
    explore: [{
      t: b('Your scorecard for democracy', 'लोकतंत्र के लिए आपका अंक-पत्र'), kind: 'radar', title: b('Democracy scorecard', 'लोकतंत्र अंक-पत्र'), axes: [b('Accountable government', 'उत्तरदायी सरकार'), b('Responsive government', 'ज़िम्मेदार सरकार'), b('Economic growth', 'आर्थिक वृद्धि'), b('Reducing inequality and poverty', 'असमानता और ग़रीबी घटाना'), b('Accommodating social diversity', 'सामाजिक विविधता का समायोजन'), b('Dignity and freedom of citizens', 'नागरिकों की गरिमा और स्वतंत्रता')],
    }],
    quiz: [
      q('The most basic outcome expected of democracy is a government that is', 'लोकतंत्र से सबसे बुनियादी अपेक्षा ऐसी सरकार की है जो हो', [['Fast and secret', 'तेज़ और गोपनीय'], ['Accountable to citizens', 'नागरिकों के प्रति उत्तरदायी'], ['Run by experts only', 'केवल विशेषज्ञों द्वारा संचालित'], ['Free from elections', 'चुनावों से मुक्त']], 1, 'And responsive to their needs and expectations.', 'और उनकी ज़रूरतों व अपेक्षाओं के प्रति संवेदनशील।'),
      q('The right of citizens to examine the process of decision-making is known as', 'निर्णय-प्रक्रिया की जाँच करने का नागरिकों का अधिकार कहलाता है', [['Transparency', 'पारदर्शिता'], ['Legitimacy', 'वैधता'], ['Majority rule', 'बहुमत का शासन'], ['Equality', 'समानता']], 0, 'It is often missing from non-democratic governments.', 'यह अलोकतांत्रिक सरकारों में प्रायः नहीं होती।'),
      q('On economic growth, the evidence shows that democracies', 'आर्थिक वृद्धि पर प्रमाण दिखाते हैं कि लोकतंत्र', [['Always grow faster than dictatorships', 'हमेशा तानाशाही से तेज़ बढ़ते हैं'], ['Do not guarantee higher growth', 'ऊँची वृद्धि की गारंटी नहीं देते'], ['Never grow', 'कभी नहीं बढ़ते'], ['Grow only when poor', 'केवल ग़रीब होने पर बढ़ते हैं']], 1, 'Growth depends on many factors such as population, global situation and economic priorities.', 'वृद्धि जनसंख्या, वैश्विक स्थिति और आर्थिक प्राथमिकताओं जैसे कई कारकों पर निर्भर है।'),
      q('In which respect is democracy clearly superior to any other form of government?', 'किस पहलू में लोकतंत्र किसी भी अन्य शासन से स्पष्ट रूप से बेहतर है?', [['Speed of decisions', 'निर्णयों की गति'], ['Promoting dignity and freedom of the individual', 'व्यक्ति की गरिमा और स्वतंत्रता बढ़ाना'], ['Ending all inequality', 'सारी असमानता समाप्त करना'], ['Avoiding all conflict', 'हर टकराव टालना']], 1, 'The passion for respect and freedom is the basis of democracy.', 'सम्मान और स्वतंत्रता की चाह ही लोकतंत्र का आधार है।'),
    ],
    note: b('Growth rates are from the table in the NCERT chapter (Przeworski and others). The scorecard records your opinion, not a measurement.', 'वृद्धि दरें NCERT अध्याय की तालिका (प्रेज़वोर्स्की व अन्य) से हैं। अंक-पत्र आपकी राय दर्ज करता है, कोई माप नहीं।'),
  },
];
