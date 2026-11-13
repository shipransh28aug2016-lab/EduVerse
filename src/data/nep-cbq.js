// NEP 2020 + NCF-SE 2023 Competency Matrix, Class IX -> Class X (2026-27) Synergy Bridge,
// Guided 3D/VR Field Tour Stops, and CBSE 50% Competency-Based Questions (Assertion-Reason & Case-Based) for T01–T16.

const b = (en, hi) => ({ en, hi });

export const CG_META = {
  CG1: b('Important phases in Indian history', 'भारतीय इतिहास के प्रमुख चरण'),
  CG2: b('Important phases in world history', 'विश्व इतिहास के प्रमुख चरण'),
  CG3: b('Idea of nation & modern India', 'राष्ट्र का विचार व आधुनिक भारत'),
  CG4: b('Human–environment relationship & sustainability', 'मानव–पर्यावरण अंतर्संबंध व संधारणीयता'),
  CG5: b('Indian Constitution & democratic governance', 'भारतीय संविधान व लोकतांत्रिक शासन'),
  CG6: b('Unity in diversity, equity & social justice', 'विविधता में एकता, समता व सामाजिक न्याय'),
  CG7: b('Structure of national economy & sectors', 'राष्ट्रीय अर्थव्यवस्था व क्षेत्रक'),
  CG8: b('Economic development, inclusion & human welfare', 'आर्थिक विकास, समावेशन व जन-कल्याण'),
  CG9: b('India’s contributions to Social Science & IKS', 'सामाजिक विज्ञान व भारतीय ज्ञान परंपरा में योगदान'),
};

export const THEME_NEP = {
  T01: {
    cgs: ['CG4', 'CG5', 'CG8', 'CG9'],
    codes: ['C1.1', 'C4.4', 'C7.1', 'C9.1'],
    skill: b('Multidisciplinary Systems Thinking', 'बहुविषयक प्रणालीगत चिंतन'),
    classX: {
      chapters: b('Class X Bridge: Ch.1 Resources & Development · Ch.1 Power Sharing · Ch.1 Development', 'कक्षा X सेतु: संसाधन व विकास · सत्ता की साझेदारी · विकास'),
      summary: b('Class IX opens by fusing Geography, History, Civics, and Economics around real Indian places; Class X deepens these into sustainable resource planning, federal power sharing, and human development.', 'कक्षा IX एक ही स्थान को चार विषयों से जोड़ती है; कक्षा X इसी नींव को संसाधन नियोजन, संघवाद और मानव विकास तक ले जाती है।'),
    },
    tours: [
      { az: -0.65, pol: 1.05, r: 15, en: 'Step 1 · Geography Lens: Plateau hills & river catchment anchor water and farms.', hi: 'चरण 1 · भूगोल दृष्टि: पठारी पहाड़ियाँ व नदी जलग्रहण खेती और जीवन तय करते हैं।' },
      { az: 0.25, pol: 1.15, r: 14, en: 'Step 2 · Civics & History: Gram Sabha pavilion beside the ancient stone arch.', hi: 'चरण 2 · नागरिक व इतिहास: प्राचीन स्मारक द्वार के पास ग्राम सभा लोकतंत्र।' },
      { az: 1.15, pol: 1.0, r: 15, en: 'Step 3 · Economics Lens: Homes, bazaar stalls & resource decisions interact daily.', hi: 'चरण 3 · अर्थशास्त्र दृष्टि: घर, बाज़ार और दैनिक आर्थिक निर्णय परस्पर जुड़े हैं।' },
    ],
    ar: {
      id: 'cbq-t01-ar',
      assertion: b('Understanding a flood in a town like Ranchi or Varanasi requires Geography, Economics, and Political Science together.', 'राँची या वाराणसी जैसे शहर की बाढ़ को समझने के लिए भूगोल, अर्थशास्त्र और राजनीति विज्ञान तीनों की आवश्यकता होती है।'),
      reason: b('Geography explains slope and rainfall, Economics tracks livelihood damage, and Political Science explains civic drainage and disaster relief.', 'भूगोल ढलान व वर्षा समझाता है, अर्थशास्त्र आजीविका हानि मापता है, और राजनीति विज्ञान स्थानीय निकाय व राहत नीति बताता है।'),
      correct: 'A',
      explain: b('Both A and R are true and R correctly explains why Social Science treats society as an interconnected system (NEP 2020 multidisciplinary goal).', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या करता है — यही NEP 2020 का बहुविषयक दृष्टिकोण है।'),
    },
    caseQ: {
      id: 'cbq-t01-case',
      passage: b('Source Case: When a river on the Chotanagpur plateau shrinks in May, handpumps dry up, vegetable prices double in the weekly haat, and the Gram Sabha votes to build a check-dam.', 'स्रोत प्रसंग: जब छोटानागपुर पठार की नदी मई में सूखने लगती है, हैंडपंप सूखते हैं, साप्ताहिक हाट में सब्ज़ियाँ महँगी होती हैं और ग्राम सभा चेक-डैम बनाने का प्रस्ताव पारित करती है।'),
      stem: b('Which discipline link best captures "prices doubled in the haat → Gram Sabha check-dam decision"?', '“हाट में दाम दोगुने → ग्राम सभा का चेक-डैम निर्णय” किन दो विषयों का सीधा अंतर्संबंध दिखाता है?'),
      options: [
        { id: 'ec', ...b('Economics (scarcity pricing) + Political Science (local democratic decision)', 'अर्थशास्त्र (दुर्लभता मूल्य) + राजनीति विज्ञान (स्थानीय लोकतांत्रिक निर्णय)') },
        { id: 'only', ...b('Purely Physical Geology with no human role', 'केवल भौतिक भूविज्ञान, बिना मानवीय भूमिका के'), why: b('Markets and elected Gram Sabhas are human economic and civic institutions.', 'हाट और ग्राम सभा मानवीय आर्थिक व लोकतांत्रिक संस्थाएँ हैं।') },
      ],
      correct: 'ec',
      explain: b('Water scarcity triggers price signals (Economics), which citizens resolve collectively through local governance (Political Science).', 'जल की कमी बाज़ार मूल्य (अर्थशास्त्र) बदलती है, जिसका समाधान नागरिक ग्राम सभा (राजनीति विज्ञान) से करते हैं।'),
    },
  },

  T02: {
    cgs: ['CG4'],
    codes: ['C4.1', 'C4.2'],
    skill: b('3D Spatial Geo-Reasoning & Hazard Preparedness', 'त्रि-आयामी भू-स्थानिक तर्क व आपदा तैयारी'),
    classX: {
      chapters: b('Class X Bridge: Ch.1 Resources & Development (Soil/Land) · Ch.5 Minerals & Energy Resources', 'कक्षा X सेतु: संसाधन व विकास (मृदा) · खनिज व ऊर्जा संसाधन'),
      summary: b('Plate tectonics, rock weathering, and river/plateau landforms directly create Class X’s alluvial soils, Deccan black regur soil, and Chotanagpur mineral belts.', 'प्लेट विवर्तनिकी व अपक्षय सीधे कक्षा X की जलोढ़, काली रेगुर मिट्टी तथा छोटानागपुर खनिज पट्टियों का निर्माण करते हैं।'),
    },
    tours: [
      { az: 0.58, pol: 1.15, r: 21, en: 'Step 1 · Lithosphere Overview: Two crustal slabs floating over warm convecting mantle.', hi: 'चरण 1 · स्थलमंडल दृश्य: गर्म संवहनी मैंटल पर तैरती भूपर्पटी प्लेटें।' },
      { az: 0.0, pol: 1.52, r: 17, en: 'Step 2 · Cross-Section View: Watch subduction zones generate deep quakes and volcanoes.', hi: 'चरण 2 · अनुप्रस्थ काट: धँसाव क्षेत्र में गहरे भूकंप और ज्वालामुखी देखें।' },
      { az: 0.3, pol: 0.35, r: 18, en: 'Step 3 · Top Aerial View: Trace ridge crust creation or transform fault offset from orbit.', hi: 'चरण 3 · शीर्ष हवाई दृश्य: ऊपर से दरार व भ्रंश विस्थापन का अवलोकन करें।' },
    ],
    ar: {
      id: 'cbq-t02-ar',
      assertion: b('The Himalaya is seismically more active than the Peninsular Deccan Plateau.', 'प्रायद्वीपीय दक्कन पठार की तुलना में हिमालय भूकंपीय दृष्टि से अधिक सक्रिय है।'),
      reason: b('The Indian plate continues to converge into the Eurasian plate along the Himalayan belt, accumulating tectonic stress.', 'भारतीय प्लेट हिमालयी सीमा पर यूरेशियाई प्लेट से लगातार टकरा रही है, जिससे विवर्तनिक तनाव बढ़ता है।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A: active continent-continent convergence builds mountains and triggers earthquakes.', 'A और R दोनों सत्य हैं तथा सक्रिय प्लेट अभिसरण भूकंपों व पर्वत निर्माण का मुख्य कारण है।'),
    },
    caseQ: {
      id: 'cbq-t02-case',
      passage: b('Source Case: In Sikkim and Uttarakhand, warming accelerates melting of high-altitude glaciers, swelling moraine-dammed alpine lakes above narrow river valleys.', 'स्रोत प्रसंग: सिक्किम और उत्तराखंड में बढ़ते तापमान से हिमनद तेजी से पिघलते हैं और संकरी घाटियों के ऊपर हिमोढ़-बंध झीलें भरती जाती हैं।'),
      stem: b('Which hazard and mitigation strategy matches this Class IX–X Himalayan scenario?', 'इस हिमालयी परिदृश्य के लिए कौन-सी आपदा और शमन रणनीति उपयुक्त है?'),
      options: [
        { id: 'glof', ...b('GLOF (Glacial Lake Outburst Flood) — install lake-level sensors, drainage channels & valley early warnings', 'GLOF (हिमनद झील विस्फोट बाढ़) — झील स्तर सेंसर, जल-निकासी व घाटी पूर्व चेतावनी') },
        { id: 'tsun', ...b('Coastal Tsunami — build coral reefs inside alpine valleys', 'तटीय सुनामी — पर्वतीय घाटियों में प्रवाल भित्तियाँ लगाना'), why: b('Tsunamis affect coasts; alpine moraine-dam bursts cause GLOFs.', 'सुनामी समुद्र तटों पर आती है; हिमनद झील टूटने से GLOF होता है।') },
      ],
      correct: 'glof',
      explain: b('GLOF monitoring, controlled siphoning, and hazard zoning protect downstream Himalayan communities.', 'झील निगरानी, नियंत्रित जल-निकासी और पूर्व चेतावनी GLOF से जीवन बचाती है।'),
    },
  },

  T03: {
    cgs: ['CG4', 'CG8'],
    codes: ['C4.3', 'C4.4', 'C4.5', 'C8.5'],
    skill: b('Climate Data Interpretation & Sustainability', 'जलवायु आँकड़ा व्याख्या व संधारणीयता'),
    classX: {
      chapters: b('Class X Bridge: Ch.3 Water Resources (Dams/Harvesting) · Ch.4 Agriculture (Kharif/Rabi Cropping)', 'कक्षा X सेतु: जल संसाधन (बाँध/संचयन) · कृषि (खरीफ़/रबी फ़सलें)'),
      summary: b('Class IX atmospheric lapse rate, monsoon winds, and runoff directly govern Class X irrigation dams, cropping seasons, and climate resilience.', 'कक्षा IX का मानसून व वर्षा-अपवाह सीधे कक्षा X की सिंचाई परियोजनाओं और कृषि ऋतुओं को तय करता है।'),
    },
    tours: [
      { az: 0.45, pol: 1.05, r: 16, en: 'Step 1 · Atmospheric Layers: Notice thin air below 12 km holding most weather.', hi: 'चरण 1 · वायुमंडल परतें: 12 किमी के नीचे सबसे सघन हवा में सारा मौसम बनता है।' },
      { az: -0.7, pol: 1.12, r: 17, en: 'Step 2 · Ozone Shield: Stratosphere ozone absorbs ultraviolet solar rays.', hi: 'चरण 2 · ओज़ोन ढाल: समतापमंडल की ओज़ोन पराबैंगनी किरणें रोकती है।' },
      { az: 0.9, pol: 0.85, r: 16, en: 'Step 3 · High Frontier: Thin upper atmosphere where meteors burn & auroras glow.', hi: 'चरण 3 · ऊँचा आकाश: विरल ऊपरी मंडल जहाँ उल्काएँ जलती हैं।' },
    ],
    ar: {
      id: 'cbq-t03-ar',
      assertion: b('Concreting over urban floodplains sharply increases peak flood discharge after heavy monsoon rain.', 'शहरी बाढ़-मैदानों को कंक्रीट से ढकने पर भारी मानसूनी वर्षा के बाद बाढ़ का चरम प्रवाह तेज़ी से बढ़ता है।'),
      reason: b('Impervious surfaces reduce infiltration into soil and send rainwater rapidly into drains as surface runoff.', 'अभेद्य सतहें मिट्टी में जल रिसाव रोकती हैं और वर्षा जल को सीधे तेज़ अपवाह के रूप में नालों में भेजती हैं।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A: forests, wetlands, and permeable soil buffer storm runoff.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है: वन व कच्ची मिट्टी वर्षा-जल सोखकर बाढ़ रोकते हैं।'),
    },
    caseQ: {
      id: 'cbq-t03-case',
      passage: b('Data Case: Station A (Mumbai, coastal) records 25°C in Jan and 30°C in May; Station B (Delhi, inland) records 14°C in Jan and 40°C in May.', 'आँकड़ा प्रसंग: तटीय मुंबई में जनवरी 25°C व मई 30°C रहता है, जबकि अंतःस्थलीय दिल्ली में जनवरी 14°C व मई 40°C तक पहुँचता है।'),
      stem: b('Why does Mumbai show a much smaller annual temperature range than Delhi?', 'दिल्ली की तुलना में मुंबई का वार्षिक तापांतर बहुत कम क्यों है?'),
      options: [
        { id: 'sea', ...b('Moderating influence of the sea & land–sea breezes keeps coastal air temperature steady', 'समुद्र का समकारी प्रभाव और थल-समुद्र समीर तटीय तापमान को संतुलित रखते हैं') },
        { id: 'alt', ...b('Mumbai is at a much higher Himalayan altitude than Delhi', 'मुंबई दिल्ली से बहुत अधिक हिमालयी ऊँचाई पर है'), why: b('Mumbai sits at sea level; proximity to water moderates temperature.', 'मुंबई समुद्र तल पर है; जल की उच्च ऊष्माधारिता तापमान को स्थिर रखती है।') },
      ],
      correct: 'sea',
      explain: b('Water heats and cools far more slowly than land (continental vs maritime climate).', 'जल भूमि की तुलना में धीमे गर्म व ठंडा होता है, जिससे तटीय जलवायु सम रहती है।'),
    },
  },

  T04: {
    cgs: ['CG1', 'CG2'],
    codes: ['C1.2', 'C2.1', 'C2.2', 'C2.3'],
    skill: b('Archaeological Evidence vs Inference & 3D Urban Heritage', 'पुरातात्विक प्रमाण बनाम निष्कर्ष व 3D नगर विरासत'),
    classX: {
      chapters: b('Class X Bridge: Ch.3 The Making of a Global World (Ancient Trade & Food Crops)', 'कक्षा X सेतु: भूमंडलीकृत विश्व का बनना (प्राचीन व्यापार व खाद्य यात्रा)'),
      summary: b('From Neolithic crop domestication to Harappan seals trading with Mesopotamia, early cities launched the global exchange networks studied in Class X History.', 'नवपाषाण कृषि और हड़प्पा–मेसोपोटामिया व्यापार ने उस प्राचीन वैश्विक संपर्क की नींव रखी जिसे कक्षा X में पढ़ा जाता है।'),
    },
    tours: [
      { az: -0.9, pol: 1.0, r: 15, en: 'Step 1 · Raised Citadel: Western mud-brick platform housing the Great Bath & Granary.', hi: 'चरण 1 · दुर्ग टीला: पश्चिमी ऊँचा चबूतरा जहाँ विशाल स्नानागार व अन्नागार हैं।' },
      { az: 0.75, pol: 1.05, r: 16, en: 'Step 2 · Lower Town Grid: Right-angle lanes, brick houses & shared courtyard wells.', hi: 'चरण 2 · निचला नगर ग्रिड: समकोण सड़कें, पक्की ईंट के घर और कुएँ।' },
      { az: 0.0, pol: 0.35, r: 17, en: 'Step 3 · Urban Sanitation View: Inspect covered street drains running below city blocks.', hi: 'चरण 3 · स्वच्छता निरीक्षण: नगर की सड़कों के नीचे ढकी हुई नालियाँ देखें।' },
    ],
    ar: {
      id: 'cbq-t04-ar',
      assertion: b('Standardised baked bricks, covered street drains, and right-angle lanes in Harappan cities point to coordinated civic planning.', 'हड़प्पा नगरों में मानक पक्की ईंटें, ढकी नालियाँ और समकोण सड़कें सुसंगठित नगर-नियोजन को दर्शाती हैं।'),
      reason: b('Unlike written chronicles, Harappan script remains undeciphered, so archaeologists rely on material remains to infer governance.', 'हड़प्पा लिपि अभी तक अपठित होने के कारण इतिहासकार भौतिक साक्ष्यों से ही प्रशासनिक व्यवस्था का अनुमान लगाते हैं।'),
      correct: 'B',
      explain: b('Both A and R are true, but R explains HOW archaeologists infer planning rather than WHY bricks were standardised.', 'A और R दोनों सत्य हैं, पर R यह नहीं बताता कि नालियाँ क्यों बनीं — वह पुरातात्विक स्रोत की सीमा बताता है।'),
    },
    caseQ: {
      id: 'cbq-t04-case',
      passage: b('Source Case: At Lothal (Gujarat), excavators uncovered a large brick-lined basin connected by a sluice channel, weights of uniform chert, and round Persian Gulf seals.', 'स्रोत प्रसंग: लोथल (गुजरात) में उत्खननकर्ताओं को पक्की ईंटों का जल-बेसिन, नहर द्वार, एकसमान बाट और फ़ारस की खाड़ी की गोल मुहरें मिलीं।'),
      stem: b('Which inference is directly supported by combining the basin + weights + Gulf seals?', 'बेसिन + मानक बाट + फ़ारसी मुहरों के प्रमाण से कौन-सा निष्कर्ष सीधे सिद्ध होता है?'),
      options: [
        { id: 'port', ...b('Lothal served as an organised maritime dockyard & long-distance trading port', 'लोथल एक संगठित समुद्री गोदीवाड़ा और दूरस्थ व्यापारिक बंदरगाह था') },
        { id: 'fort', ...b('Harappans never engaged in overseas exchange', 'हड़प्पावासी कभी समुद्र-पार व्यापार नहीं करते थे'), why: b('Persian Gulf seals and dock infrastructure prove active maritime commerce.', 'खाड़ी की मुहरें व गोदीवाड़ा सक्रिय समुद्री व्यापार सिद्ध करते हैं।') },
      ],
      correct: 'port',
      explain: b('Material evidence (dock basin + standard weights + foreign seals) confirms overseas Bronze Age trade.', 'भौतिक प्रमाण (गोदीवाड़ा, बाट, विदेशी मुहरें) प्राचीन समुद्री व्यापार की पुष्टि करते हैं।'),
    },
  },

  T05: {
    cgs: ['CG1', 'CG2', 'CG3', 'CG9'],
    codes: ['C1.3', 'C1.4', 'C2.3', 'C3.1', 'C9.1'],
    skill: b('Primary Source Critique & Knowledge Heritage', 'प्राथमिक स्रोत विश्लेषण व ज्ञान धरोहर'),
    classX: {
      chapters: b('Class X Bridge: Ch.5 Print Culture & Modern World · Ch.2 Nationalism in India (Heritage & Cultural Unity)', 'कक्षा X सेतु: मुद्रण संस्कृति · भारत में राष्ट्रवाद (सांस्कृतिक एकता)'),
      summary: b('From Ashokan edicts and palm-leaf manuscripts to Takshashila, Nalanda, and trade guilds, T05 builds the cultural-institutional root for Class X Print Culture and Nationhood.', 'अशोक के शिलालेखों व ताड़पत्रों से नालंदा और व्यापार श्रेणियों तक, T05 कक्षा X की मुद्रण संस्कृति व राष्ट्र-निर्माण की नींव रखता है।'),
    },
    tours: [
      { az: -0.75, pol: 1.05, r: 15, en: 'Step 1 · Ancient Stupa: Hemispherical brick architecture preserving early communal memory.', hi: 'चरण 1 · प्राचीन स्तूप: ईंटों की गुंबद वास्तुकला जो प्रारंभिक परंपरा सहेजती है।' },
      { az: 0.35, pol: 1.08, r: 14, en: 'Step 2 · Ashokan Pillar Edict: Public Prakrit/Brahmi messages engraved along trade roads.', hi: 'चरण 2 · अशोक स्तंभ लेख: व्यापार मार्गों पर जन-जन के लिए प्राकृत/ब्राह्मी संदेश।' },
      { az: 1.1, pol: 1.05, r: 15, en: 'Step 3 · Palm-Leaf Archive: Classical mathematics, medicine & guild charters recorded.', hi: 'चरण 3 · ताड़पत्र अभिलेख: गणित, आयुर्वेद व श्रेणी नियमों का लेखन।' },
    ],
    ar: {
      id: 'cbq-t05-ar',
      assertion: b('Ashoka engraved his Dhamma edicts on pillars and rocks in Prakrit using regional scripts like Brahmi and Kharoshthi.', 'अशोक ने अपने धम्म अभिलेख क्षेत्रीय लिपियों (ब्राह्मी, खरोष्ठी) और प्राकृत भाषा में शिलाओं व स्तंभों पर खुदवाए।'),
      reason: b('He wanted ordinary people across diverse regions of his empire to read and understand royal ethical policies directly.', 'वे चाहते थे कि साम्राज्य के विविध क्षेत्रों के सामान्य नागरिक राज्य के नैतिक संदेश स्वयं पढ़ और समझ सकें।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A: everyday spoken Prakrit rather than elite language maximised public reach.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है: जनसामान्य की भाषा का उपयोग व्यापक संवाद के लिए था।'),
    },
    caseQ: {
      id: 'cbq-t05-case',
      passage: b('Source Case: Inscriptions from ancient India record shrenis (merchant & craft guilds) acting almost like early banks — accepting deposits, paying steady interest, and funding temples or roads.', 'स्रोत प्रसंग: प्राचीन भारतीय अभिलेखों में “श्रेणियों” (व्यापारी व शिल्प संघों) का उल्लेख है जो जमा स्वीकार करती थीं, ब्याज देती थीं और सार्वजनिक कार्यों में धन लगाती थीं।'),
      stem: b('What does this evidence reveal about India’s economy before 1000 CE?', 'यह प्रमाण 1000 ई. से पूर्व भारत की अर्थव्यवस्था के बारे में क्या दर्शाता है?'),
      options: [
        { id: 'guild', ...b('Organised credit, craft specialisation & self-governing trade guilds linked rural and urban markets', 'संगठित ऋण व्यवस्था, शिल्प विशेषज्ञता व स्वायत्त श्रेणियाँ बाज़ारों को जोड़ती थीं') },
        { id: 'barter', ...b('Only isolated subsistence barter existed across the entire subcontinent', 'पूरे उपमहाद्वीप में केवल अलग-थलग वस्तु-विनिमय ही होता था'), why: b('Interest-bearing guild deposits and coin hoards prove monetised credit networks.', 'ब्याज वाले जमा और सिक्के विकसित व्यापार तंत्र सिद्ध करते हैं।') },
      ],
      correct: 'guild',
      explain: b('Shrenis provided trusted institutional rules, quality standards, and capital across long routes like Uttarapatha.', 'श्रेणियों ने उत्तरपथ जैसे मार्गों पर गुणवत्ता, विश्वास और पूंजी की संस्थागत व्यवस्था दी।'),
    },
  },

  T06: {
    cgs: ['CG5'],
    codes: ['C5.1', 'C5.2', 'C5.4'],
    skill: b('Constitutional & Institutional Comparison', 'संवैधानिक व संस्थागत तुलना'),
    classX: {
      chapters: b('Class X Bridge: Ch.1 Power Sharing · Ch.2 Federalism · Ch.5 Outcomes of Democracy', 'कक्षा X सेतु: सत्ता की साझेदारी · संघवाद · लोकतंत्र के परिणाम'),
      summary: b('Evaluating democracies vs non-democracies and parliamentary vs presidential accountability directly prepares students for Class X’s Power Sharing and Outcomes of Democracy.', 'लोकतांत्रिक कसौटी व संसदीय जवाबदेही कक्षा X के सत्ता की साझेदारी और लोकतंत्र के परिणाम अध्यायों की सीधी तैयारी है।'),
    },
    tours: [
      { az: 0.0, pol: 1.02, r: 16, en: 'Step 1 · Parliamentary Rotunda: Colonnade chamber uniting elected representatives.', hi: 'चरण 1 · संसदीय मंडप: निर्वाचित प्रतिनिधियों को जोड़ने वाला स्तंभ-कक्ष।' },
      { az: 0.85, pol: 0.95, r: 15, en: 'Step 2 · Majority vs Opposition Seats: Watch green & red benches shift with confidence support.', hi: 'चरण 2 · बहुमत व विपक्ष: समर्थन प्रतिशत बदलने पर सीटों का संतुलन देखें।' },
      { az: -0.75, pol: 0.55, r: 16, en: 'Step 3 · Speaker & Executive Podium: Executive stays accountable to the legislature daily.', hi: 'चरण 3 · कार्यपालिका मंच: संसदीय प्रणाली में सरकार सदन के प्रति उत्तरदायी है।' },
    ],
    ar: {
      id: 'cbq-t06-ar',
      assertion: b('Holding regular elections alone does not guarantee that a country is truly democratic.', 'केवल नियमित चुनाव करा लेने भर से कोई देश सच्चा लोकतंत्र नहीं बन जाता।'),
      reason: b('A genuine democracy also requires equal voting weight, free opposition/media, protection of rights, and rule of law.', 'सच्चे लोकतंत्र के लिए समान मताधिकार, स्वतंत्र विपक्ष व मीडिया, अधिकारों की सुरक्षा और कानून का शासन भी अनिवार्य है।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — elections must offer real choice under fair constitutional rules.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या करता है।'),
    },
    caseQ: {
      id: 'cbq-t06-case',
      passage: b('Source Case: The 920 CE Uttaramerur stone inscription in Tamil Nadu describes village sabha committee selection using kudavolai (palm-leaf lots inside a mud pot) alongside strict eligibility and corruption disqualification rules.', 'स्रोत प्रसंग: तमिलनाडु के 920 ई. के उत्तरमेरूर अभिलेख में कुडावोलई (मिट्टी के घड़े से ताड़पत्र पर्ची द्वारा चुनाव) तथा ईमानदारी व योग्यता के कड़े नियमों का वर्णन है।'),
      stem: b('What democratic principle does the Uttaramerur inscription demonstrate in early India?', 'उत्तरमेरूर अभिलेख प्राचीन भारत में किस लोकतांत्रिक सिद्धांत को दर्शाता है?'),
      options: [
        { id: 'rules', ...b('Written accountability, fair selection & anti-corruption checks in local self-governance', 'स्थानीय स्वशासन में लिखित नियम, निष्पक्ष चयन और भ्रष्टाचार-रोधी जवाबदेही') },
        { id: 'dyn', ...b('Hereditary lifetime monarchy inside villages', 'गाँवों में वंशानुगत आजीवन राजतंत्र'), why: b('Eligibility rules, rotation, and disqualifications prevented monopoly.', 'नियम और चक्रानुक्रम किसी एक के एकाधिकार को रोकते थे।') },
      ],
      correct: 'rules',
      explain: b('Early Indian sabhas, ganas, and sanghas practised rule-bound deliberation long before modern constitutions.', 'प्राचीन भारतीय सभाओं, गणों और संघों में नियमबद्ध लोकतांत्रिक निर्णय की गहरी परंपरा थी।'),
    },
  },

  T07: {
    cgs: ['CG5', 'CG6', 'CG9'],
    codes: ['C5.2', 'C5.3', 'C5.4', 'C5.5', 'C6.2', 'C9.1'],
    skill: b('Electoral Data Literacy & Fair Representation', 'निर्वाचन आँकड़ा साक्षरता व निष्पक्ष प्रतिनिधित्व'),
    classX: {
      chapters: b('Class X Bridge: Ch.4 Political Parties · Ch.1 Power Sharing (Coalitions)', 'कक्षा X सेतु: राजनीतिक दल · सत्ता की साझेदारी (गठबंधन)'),
      summary: b('FPTP vs Proportional Representation, party systems, and coalition dynamics in T07 feed directly into Class X’s Political Parties and Coalition Federalism.', 'निर्वाचन प्रणालियाँ, दलीय व्यवस्था और गठबंधन वार्ता सीधे कक्षा X के राजनीतिक दल अध्याय से जुड़ते हैं।'),
    },
    tours: [
      { az: 0.55, pol: 1.05, r: 16, en: 'Step 1 · Constituency Hex Grid: Each tower represents one geographic parliamentary seat.', hi: 'चरण 1 · निर्वाचन क्षेत्र ग्रिड: हर षट्कोणीय स्तंभ एक भौगोलिक सीट दर्शाता है।' },
      { az: -0.75, pol: 0.95, r: 15, en: 'Step 2 · Seat Height & Winner Effect: Small vote swings can flip close FPTP seats dramatically.', hi: 'चरण 2 · स्विंग प्रभाव: छोटे मत-अंतर से FPTP में कई सीटें बदल सकती हैं।' },
      { az: 0.0, pol: 0.3, r: 18, en: 'Step 3 · Top-Down Delimitation View: Compare balanced seats vs skewed boundaries.', hi: 'चरण 3 · शीर्ष परिसीमन दृश्य: संतुलित और असंतुलित क्षेत्रों की तुलना करें।' },
    ],
    ar: {
      id: 'cbq-t07-ar',
      assertion: b('In a First-Past-The-Post (FPTP) system, a party with 40% of total votes can still win over 60% of seats.', 'फर्स्ट-पास्ट-द-पोस्ट (FPTP) प्रणाली में 40% कुल मत पाने वाला दल भी 60% से अधिक सीटें जीत सकता है।'),
      reason: b('FPTP awards each single-member constituency separately to whichever candidate gets the most votes there, not proportionally nationwide.', 'FPTP में हर क्षेत्र अलग विजेता चुनता है; सीटें देशव्यापी मत-प्रतिशत के अनुपात में नहीं बँटतीं।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — fragmented opposition votes let a plurality winner sweep seats.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है: मतों के विभाजन से बहुलता विजेता अधिक सीटें पा सकता है।'),
    },
    caseQ: {
      id: 'cbq-t07-case',
      passage: b('Data Case: A 100-seat Assembly has Party A (38 seats), Party B (34 seats), Party C (18 seats), and Party D (10 seats). No single party holds 51 seats.', 'आँकड़ा प्रसंग: 100 सीटों वाली विधानसभा में दल A को 38, दल B को 34, दल C को 18 और दल D को 10 सीटें मिलीं। किसी एक के पास 51 सीटें नहीं हैं।'),
      stem: b('Which minimal winning coalition gives Party A a stable majority without an unnecessary surplus partner?', 'बिना अनावश्यक अतिरिक्त सहयोगी के दल A को न्यूनतम बहुमत गठबंधन कौन देता है?'),
      options: [
        { id: 'ac', ...b('Party A + Party C (38 + 18 = 56 seats)', 'दल A + दल C (38 + 18 = 56 सीटें)') },
        { id: 'ad', ...b('Party A + Party D (38 + 10 = 48 seats)', 'दल A + दल D (38 + 10 = 48 सीटें)'), why: b('48 is still short of the 51-seat majority mark.', '48 सीटें 51 के बहुमत से कम हैं।') },
      ],
      correct: 'ac',
      explain: b('38 + 18 = 56 seats passes the 51-seat halfway threshold cleanly with two partners (Anti-Defection Tenth Schedule also binds whips).', '38 + 18 = 56 सीटें स्पष्ट बहुमत देती हैं; दलबदल-रोधी 10वीं अनुसूची स्थिरता सुनिश्चित करती है।'),
    },
  },

  T08: {
    cgs: ['CG8'],
    codes: ['C8.2', 'C8.5'],
    skill: b('Trade-Off Analysis & Welfare Economics', 'विकल्प-लागत विश्लेषण व कल्याण अर्थशास्त्र'),
    classX: {
      chapters: b('Class X Bridge: Ch.1 Development (Income + Human Indicators) · Ch.2 Sectors of Indian Economy', 'कक्षा X सेतु: विकास (आय व मानव सूचकांक) · भारतीय अर्थव्यवस्था के क्षेत्रक'),
      summary: b('Scarcity, opportunity cost, mixed-economy safety nets, and human well-being beyond money lead straight into Class X’s Development (HDI/IMR/literacy) and Sectors.', 'दुर्लभता, अवसर-लागत व कल्याण सुरक्षा-जाल सीधे कक्षा X के विकास व क्षेत्रक अध्यायों की नींव रखते हैं।'),
    },
    tours: [
      { az: -0.6, pol: 1.05, r: 16, en: 'Step 1 · Grain vs Vegetable Plots: Resources shifted to one crop reduce the other (PPF trade-off).', hi: 'चरण 1 · अनाज बनाम सब्ज़ी: एक फसल बढ़ाने पर दूसरी घटती है (अवसर लागत)।' },
      { az: 0.7, pol: 1.0, r: 15, en: 'Step 2 · Solar Tech House: Better technology pushes the entire production frontier outward.', hi: 'चरण 2 · सौर तकनीक घर: नई तकनीक से कुल उत्पादन क्षमता बाहर की ओर बढ़ती है।' },
      { az: 0.1, pol: 0.4, r: 18, en: 'Step 3 · Island Frontier View: Spot idle capacity inside vs efficient points along the edge.', hi: 'चरण 3 · सीमांत दृश्य: अप्रयुक्त क्षमता बनाम पूर्ण दक्षता बिंदु देखें।' },
    ],
    ar: {
      id: 'cbq-t08-ar',
      assertion: b('Even a wealthy household or national government faces the economic problem of scarcity.', 'धनी परिवार हो या राष्ट्रीय सरकार, सभी को दुर्लभता की आर्थिक समस्या का सामना करना पड़ता है।'),
      reason: b('Human wants and public goals are limitless relative to the finite time, land, labour, and budgets available at any moment.', 'किसी भी समय उपलब्ध भूमि, श्रम, समय और बजट सीमित होते हैं, जबकि मानवीय आवश्यकताएँ और लक्ष्य असीमित हैं।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — scarcity applies whenever resources are finite against competing uses.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है — सीमित संसाधनों के कारण चयन सदैव अनिवार्य है।'),
    },
    caseQ: {
      id: 'cbq-t08-case',
      passage: b('Source Case: A farm family earns ₹14,000/month. A sudden hospital bill of ₹15,000 hits during a crop pest attack. With public health insurance + subsidised ration (PDS), 70% of the shock is absorbed.', 'स्रोत प्रसंग: एक किसान परिवार की मासिक आय ₹14,000 है। फसल नुकसान के बीच ₹15,000 का अचानक अस्पताल खर्च आता है, जिसमें सरकारी स्वास्थ्य बीमा व राशन प्रणाली (PDS) 70% बोझ संभालती है।'),
      stem: b('How does a social safety net prevent long-term poverty in this mixed-economy example?', 'इस मिश्रित अर्थव्यवस्था के उदाहरण में सामाजिक सुरक्षा-जाल दीर्घकालिक गरीबी कैसे रोकता है?'),
      options: [
        { id: 'debt', ...b('It prevents high-interest distress borrowing and sale of farm tools/land after a temporary shock', 'यह अस्थायी संकट के बाद उच्च ब्याज वाले कर्ज़-जाल और खेत/औज़ार बिकने से बचाता है') },
        { id: 'ban', ...b('It bans private markets completely', 'यह निजी बाज़ारों को पूरी तरह बंद कर देता है'), why: b('Mixed-economy safety nets protect vulnerable families alongside markets.', 'सुरक्षा-जाल बाज़ारों के साथ कमज़ोर परिवारों की रक्षा करता है।') },
      ],
      correct: 'debt',
      explain: b('Targeted social protection preserves household assets and human capital during health or climate shocks.', 'लक्षित सामाजिक सुरक्षा संकट के समय परिवार की संपत्ति और स्वास्थ्य दोनों बचाती है।'),
    },
  },

  T09: {
    cgs: ['CG7'],
    codes: ['C7.1'],
    skill: b('Market Equilibrium Modelling & Policy Impact Analysis', 'बाज़ार संतुलन मॉडलिंग व नीति प्रभाव विश्लेषण'),
    classX: {
      chapters: b('Class X Bridge: Ch.3 Money & Credit · Ch.4 Globalisation & Indian Economy · Ch.5 Consumer Rights', 'कक्षा X सेतु: मुद्रा व साख · वैश्वीकरण · उपभोक्ता अधिकार'),
      summary: b('Supply/demand equilibrium, market failures, information asymmetry, and consumer protection directly prepare students for Class X Credit Markets, Global Competition, and Consumer Rights.', 'माँग-पूर्ति संतुलन, सूचना असमानता व बाज़ार विफलता सीधे कक्षा X के ऋण बाज़ार व उपभोक्ता अधिकारों से जुड़ते हैं।'),
    },
    tours: [
      { az: 0.4, pol: 1.08, r: 15, en: 'Step 1 · Market Balance Scale: Left demand crate vs right supply crate tipping with price.', hi: 'चरण 1 · मंडी संतुलन तराजू: कीमत बदलने पर माँग व पूर्ति पलड़ों का झुकाव देखें।' },
      { az: -0.7, pol: 1.0, r: 15, en: 'Step 2 · Equilibrium Pivot: At P*, buyer willingness matches seller supply cleanly.', hi: 'चरण 2 · संतुलन धुरी: P* पर खरीदार की माँग और विक्रेता की पूर्ति बराबर होती है।' },
      { az: 0.2, pol: 0.65, r: 17, en: 'Step 3 · Streetlight Village View (Public Goods tab): Shared light serves payers & free-riders alike.', hi: 'चरण 3 · सार्वजनिक बत्ती दृश्य: साझे प्रकाश से हर घर लाभ उठाता है।' },
    ],
    ar: {
      id: 'cbq-t09-ar',
      assertion: b('A binding price ceiling set sharply below market equilibrium often creates queues or black-market pressure.', 'संतुलन कीमत से काफी नीचे तय की गई अनिवार्य कीमत सीमा प्रायः कतारें या काला-बाज़ारी का दबाव बनाती है।'),
      reason: b('At the artificially low price, quantity demanded rises while suppliers cut production, leaving an excess demand shortage.', 'कम कीमत पर उपभोक्ता अधिक माँग करते हैं जबकि उत्पादक पूर्ति घटाते हैं, जिससे कमी उत्पन्न होती है।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — disequilibrium gaps create rationing problems unless supply expands.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है — माँग-पूर्ति अंतर से कमी जन्म लेती है।'),
    },
    caseQ: {
      id: 'cbq-t09-case',
      passage: b('Source Case: When a city installs solar streetlights on a public road, one resident walking at night does not reduce light for the next passerby, and non-taxpayers cannot easily be blocked from using the beam.', 'स्रोत प्रसंग: किसी सड़क पर सौर स्ट्रीटलाइट लगने पर एक राहगीर के चलने से दूसरे की रोशनी कम नहीं होती, और कर न देने वाले को भी रोशनी से रोका नहीं जा सकता।'),
      stem: b('Which two economic traits classify this streetlamp as a "Public Good"?', 'कौन-सी दो आर्थिक विशेषताएँ इसे “सार्वजनिक वस्तु” बनाती हैं?'),
      options: [
        { id: 'pub', ...b('Non-excludable and Non-rival → leads to free-riding unless funded collectively', 'अपवर्जन-रहित व प्रतिद्वंद्विता-रहित → सामूहिक कर के बिना फ्री-राइडर समस्या') },
        { id: 'priv', ...b('Excludable and Rival like a mango in a shop', 'दुकान के आम की तरह अपवर्जनीय व प्रतिद्वंद्वी'), why: b('Public road lighting serves everyone simultaneously without exclusion.', 'सड़क का प्रकाश एक साथ सभी को बिना किसी रोक-टोक के मिलता है।') },
      ],
      correct: 'pub',
      explain: b('Because private firms cannot easily charge non-payers, local governments finance public goods via taxes.', 'निजी विक्रेता भुगतान न करने वालों को रोक नहीं सकते, इसलिए सरकार करों से सार्वजनिक वस्तुएँ उपलब्ध कराती है।'),
    },
  },

  T10: {
    cgs: ['CG4'],
    codes: ['C4.1', 'C4.2'],
    skill: b('3D Bathymetry, Blue Economy & Coastal Disaster Readiness', '3D महासागर उच्चावच, नीली अर्थव्यवस्था व तटीय सुरक्षा'),
    classX: {
      chapters: b('Class X Bridge: Ch.7 Lifelines of National Economy (Major Sea Ports) · Ch.5 Offshore Energy (Mumbai High)', 'कक्षा X सेतु: राष्ट्रीय अर्थव्यवस्था की जीवन रेखाएँ (बंदरगाह) · अपतटीय तेल क्षेत्र'),
      summary: b('Continental shelves host Class X’s Mumbai High oilfields and rich fisheries; deep ports like Visakhapatnam, Paradip, Haldia, and Kochi anchor India’s maritime lifelines.', 'महाद्वीपीय मग्नतट मुंबई हाई तेल क्षेत्र व मत्स्यन का आधार हैं; विशाखापत्तनम, पारादीप व कोच्चि भारत के प्रमुख समुद्री बंदरगाह हैं।'),
    },
    tours: [
      { az: -0.8, pol: 1.05, r: 17, en: 'Step 1 · Continental Shelf: Shallow sunlit coastal ledge teeming with fish & ports.', hi: 'चरण 1 · महाद्वीपीय मग्नतट: उथला सूर्य-प्रकाशित तट जहाँ मछलियाँ व बंदरगाह हैं।' },
      { az: 0.35, pol: 1.15, r: 16, en: 'Step 2 · Deep Ocean Trench: Abyssal subduction drop thousands of metres below sea level.', hi: 'चरण 2 · गहरा समुद्री गर्त: प्लेट धँसाव से बना हजारों मीटर गहरा गर्त।' },
      { az: 0.95, pol: 0.85, r: 17, en: 'Step 3 · Mid-Ocean Ridge: Divergent volcanic spine forming fresh ocean crust.', hi: 'चरण 3 · मध्य-महासागरीय कटक: अपसारी सीमा जहाँ नई समुद्री पर्पटी बनती है।' },
    ],
    ar: {
      id: 'cbq-t10-ar',
      assertion: b('Tsunami waves look small and harmless over the open ocean but rise destructively near shallow coastlines.', 'गहरे खुले समुद्र में सुनामी तरंगें छोटी व शांत दिखती हैं, पर उथले तट के पास विनाशकारी ऊँचाई ले लेती हैं।'),
      reason: b('Because wave speed slows sharply as water depth drops (v = √(g·d)), trailing wave energy piles up vertically near shore.', 'गहराई घटने पर तरंग गति तेजी से घटती है (v = √(g·d)), जिससे पीछे आती ऊर्जा तट पर ऊँची दीवार बन जाती है।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — early deep-sea buoy warnings buy vital minutes for coastal evacuation.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है — गहरे समुद्र के सेंसर तटीय बचाव के लिए बहुमूल्य समय देते हैं।'),
    },
    caseQ: {
      id: 'cbq-t10-case',
      passage: b('Source Case: A coastal town harvests 60% above its Maximum Sustainable Yield (MSY) for 4 seasons in a row using fine-mesh trawlers, while warming waters stress coral nurseries.', 'स्रोत प्रसंग: एक तटीय कस्बा लगातार 4 वर्षों तक अधिकतम टिकाऊ उपज (MSY) से 60% अधिक मत्स्यन करता है, जिससे प्रवाल शिशु-क्षेत्र भी प्रभावित होते हैं।'),
      stem: b('What is the long-run ecological and economic outcome under UNCLOS sustainable fisheries principles?', 'संधारणीय मत्स्य प्रबंधन (UNCLOS) के अनुसार इसका दीर्घकालिक परिणाम क्या होगा?'),
      options: [
        { id: 'coll', ...b('Fish stocks collapse, shrinking future catches and fisherfolk incomes unless seasonal bans & mesh rules restore balance', 'मत्स्य भंडार घटकर भविष्य की पकड़ व आजीविका गिराएगा, जब तक मौसमी रोक व नियम संतुलन न लौटाएँ') },
        { id: 'inf', ...b('Marine fish stocks multiply infinitely regardless of catch size', 'पकड़ चाहे जितनी हो, मछलियाँ असीमित रूप से बढ़ती रहती हैं'), why: b('Overfishing past MSY depletes breeding adults faster than regeneration.', 'MSY से अधिक शिकार प्रजनन क्षमता को नष्ट करता है।') },
      ],
      correct: 'coll',
      explain: b('Fishing at or below MSY with seasonal monsoon bans keeps both marine biodiversity and fisher livelihoods alive.', 'MSY सीमा व मानसूनी मत्स्य-विराम जैव-विविधता और मछुआरा आजीविका दोनों को सुरक्षित रखते हैं।'),
    },
  },

  T11: {
    cgs: ['CG4', 'CG6', 'CG9'],
    codes: ['C4.3', 'C4.4', 'C4.5', 'C4.6', 'C9.1'],
    skill: b('Biodiversity Conservation & Indigenous Ecological Knowledge', 'जैव-विविधता संरक्षण व पारंपरिक पारिस्थितिक ज्ञान'),
    classX: {
      chapters: b('Class X Bridge: Ch.2 Forest and Wildlife Resources (Sacred Groves, JFM, Project Tiger, Reserves)', 'कक्षा X सेतु: वन एवं वन्य जीव संसाधन (पवित्र उपवन, प्रोजेक्ट टाइगर, JFM)'),
      summary: b('Class IX biomes, biosphere reserves, and Sarna/sacred groves map almost 1-to-1 into Class X’s Forest & Wildlife Resources and Joint Forest Management (JFM).', 'कक्षा IX के बायोम, जैवमंडल क्षेत्र और सरना/पवित्र उपवन सीधे कक्षा X के वन व वन्यजीव संरक्षण अध्याय से जुड़ते हैं।'),
    },
    tours: [
      { az: 0.0, pol: 1.02, r: 15, en: 'Step 1 · Sacred Sal Grove: Community-protected stone ring & ancient trees.', hi: 'चरण 1 · पवित्र साल उपवन: समुदाय द्वारा संरक्षित देव-कुंज व पुराने वृक्ष।' },
      { az: 0.85, pol: 1.0, r: 16, en: 'Step 2 · Forest Watchtower: Fire-risk prevention & wildlife corridor monitoring.', hi: 'चरण 2 · वन निरीक्षण मीनार: वनाग्नि रोकथाम व वन्यजीव गलियारे की निगरानी।' },
      { az: -0.75, pol: 0.55, r: 17, en: 'Step 3 · Canopy & Stream Overview: Healthy forest cover protects soil moisture and biodiversity.', hi: 'चरण 3 · कैनोपी व धारा: घना वन आवरण नमी और जैव-विविधता बचाता है।' },
    ],
    ar: {
      id: 'cbq-t11-ar',
      assertion: b('Community-protected sacred groves like Jharkhand’s Sarna forests and Rajasthan’s Orans often harbour rare medicinal plants lost elsewhere.', 'झारखंड के सरना उपवन व राजस्थान के ओरन जैसे सामुदायिक पवित्र वनों में दुर्लभ औषधीय पौधे बचे रहते हैं।'),
      reason: b('Customary cultural norms prohibit tree felling and hunting inside groves, turning local faith into active ecological conservation.', 'पारंपरिक सामुदायिक नियम इन उपवनों में कटाई व शिकार रोकते हैं, जिससे संस्कृति संरक्षण का माध्यम बनती है।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — highlighted directly in both Class IX T11 and Class X Ch.2.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है — यह कक्षा IX व X दोनों में प्रमुख विषय है।'),
    },
    caseQ: {
      id: 'cbq-t11-case',
      passage: b('Source Case: Inside Palamau / Betla Biosphere Zone, local villagers form a Joint Forest Management (JFM) committee, clear dry leaf litter along firelines before April, and earn income from ecotourism & minor forest produce.', 'स्रोत प्रसंग: पलामू/बेतला क्षेत्र में ग्रामीण संयुक्त वन प्रबंधन (JFM) समिति बनाकर अप्रैल से पहले सूखी पत्तियों की फायरलाइन साफ करते हैं तथा पारिस्थितिक पर्यटन व वनोपज से आय पाते हैं।'),
      stem: b('Why does involving forest-dwelling communities improve conservation outcomes over strict exclusion alone?', 'केवल कठोर रोक की तुलना में वनवासी समुदायों को जोड़ने से संरक्षण बेहतर क्यों होता है?'),
      options: [
        { id: 'jfm', ...b('Shared livelihoods and Forest Rights security turn local residents into active guardians against fires & poaching', 'साझा आजीविका व वन अधिकार सुरक्षा स्थानीय निवासियों को वनाग्नि व शिकार के विरुद्ध सक्रिय रक्षक बनाते हैं') },
        { id: 'clear', ...b('Because JFM encourages clearing all forests into concrete highways', 'क्योंकि JFM सारे वन काटकर हाईवे बनाता है'), why: b('JFM balances sustainable non-timber produce and community stewardship with biodiversity.', 'JFM टिकाऊ वनोपज और सामुदायिक संरक्षण का संतुलन है।') },
      ],
      correct: 'jfm',
      explain: b('Co-management links human dignity, legal forest rights, and fire/poaching prevention.', 'सह-प्रबंधन मानवीय आजीविका, वन अधिकार और जैव-विविधता सुरक्षा को जोड़ता है।'),
    },
  },

  T12: {
    cgs: ['CG1', 'CG3', 'CG9'],
    codes: ['C1.3', 'C1.4', 'C3.1'],
    skill: b('Architectural Analysis & Regional Synthesis (1000–1700 CE)', 'स्थापत्य विश्लेषण व क्षेत्रीय संश्लेषण'),
    classX: {
      chapters: b('Class X Bridge: Ch.2 Nationalism in India · Ch.5 Print Culture (Bhakti & Regional Languages)', 'कक्षा X सेतु: भारत में राष्ट्रवाद · मुद्रण संस्कृति (भक्ति साहित्य व क्षेत्रीय भाषाएँ)'),
      summary: b('Bhakti poetry in Marathi, Tamil, Hindi, Bengali, and Punjabi knitted shared cultural threads across India that later fuelled Print Culture and mass unity in Class X.', 'भक्ति आंदोलन की क्षेत्रीय भाषाओं ने जो सांस्कृतिक सूत्र बुने, वे कक्षा X में मुद्रण संस्कृति व जन-राष्ट्रवाद का आधार बने।'),
    },
    tours: [
      { az: 0.2, pol: 1.05, r: 16, en: 'Step 1 · Bent Defensive Gate (Hatipol): Forces charging attackers to turn sharply under watch.', hi: 'चरण 1 · टेढ़ा प्रवेश द्वार: हमलावरों की गति तोड़ने वाली रणनीतिक सुरक्षा रचना।' },
      { az: 1.15, pol: 0.95, r: 15, en: 'Step 2 · Round Corner Bastions: Rounded stone burj give defenders wide field of view.', hi: 'चरण 2 · गोल बुर्ज व प्राचीर: चारों दिशाओं में निगरानी और सुरक्षा देने वाले स्तंभ।' },
      { az: -0.45, pol: 0.38, r: 16, en: 'Step 3 · Rock-Cut Water Cisterns: Rainwater harvesting inside hill forts sustained long sieges.', hi: 'चरण 3 · चट्टानी जल कुंड: पहाड़ी किलों में वर्षा जल संचयन से लंबी घेराबंदी झेली जाती थी।' },
    ],
    ar: {
      id: 'cbq-t12-ar',
      assertion: b('Indian hill forts from Chittorgarh and Raigad to Golconda placed rock-cut water tanks and granaries high inside the ramparts.', 'चित्तौड़गढ़ व रायगढ़ से गोलकुंडा तक भारतीय पहाड़ी दुर्गों में प्राचीरों के भीतर ही जल-कुंड व अन्नागार बनाए जाते थे।'),
      reason: b('Self-sufficient water and grain reserves allowed defenders to withstand months-long sieges without descending to plains.', 'भीतर ही जल व अनाज का भंडार होने से रक्षक बिना नीचे उतरे महीनों तक घेराबंदी का सामना कर सकते थे।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — military engineering combined geography, hydrology, and stone architecture.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है — दुर्ग निर्माण में भूगोल और जल प्रबंधन का गहरा मेल था।'),
    },
    caseQ: {
      id: 'cbq-t12-case',
      passage: b('Source Case: Saints like Kabir, Mirabai, Ravidas, Guru Nanak, and Tukaram composed dohas and abhangs in everyday spoken dialects rather than courtly Sanskrit or Persian.', 'स्रोत प्रसंग: कबीर, मीराबाई, रविदास, गुरु नानक और तुकाराम ने दरबारी भाषाओं के बजाय जनसामान्य की बोलियों में दोहे व अभंग रचे।'),
      stem: b('What social and historical effect did composing in vernacular languages achieve across 1000–1700 CE?', '1000–1700 ई. में लोकभाषाओं में रचना करने का क्या सामाजिक व ऐतिहासिक प्रभाव पड़ा?'),
      options: [
        { id: 'bhakti', ...b('Expanded participation across castes, regions, and women while enriching regional literature & shared unity', 'जाति-क्षेत्र की सीमाओं से परे आम लोगों व महिलाओं की भागीदारी बढ़ी और क्षेत्रीय भाषाएँ समृद्ध हुईं') },
        { id: 'isol', ...b('Stopped all trade and travel across Indian kingdoms', 'भारतीय राज्यों के बीच सारा व्यापार व यात्रा बंद हो गई'), why: b('Bhakti networks actually bridged north, west, east, and south India.', 'भक्ति परंपरा ने उत्तर से दक्षिण तक सांस्कृतिक संवाद जोड़ा।') },
      ],
      correct: 'bhakti',
      explain: b('Bhakti traditions reshaped regional identities and egalitarian ideals across the subcontinent.', 'भक्ति परंपरा ने समता मूलक आदर्शों और लोकभाषा साहित्य को सशक्त किया।'),
    },
  },

  T13: {
    cgs: ['CG1', 'CG2', 'CG6', 'CG9'],
    codes: ['C1.2', 'C1.4', 'C2.3', 'C6.1', 'C9.1'],
    skill: b('Global Network Mapping & IKS Provenance Analysis', 'वैश्विक नेटवर्क मानचित्रण व भारतीय ज्ञान परंपरा विश्लेषण'),
    classX: {
      chapters: b('Class X Bridge (IDP Core): Ch.3 Making of a Global World · Ch.4 Globalisation · Ch.7 Lifelines', 'कक्षा X सेतु (IDP केंद्र): भूमंडलीकृत विश्व · वैश्वीकरण · अर्थव्यवस्था की जीवन रेखाएँ'),
      summary: b('Directly underpins the CBSE Class X Interdisciplinary Project: trace how pre-modern Indian Ocean spice/cotton routes transformed into modern maritime ports, IT hubs, and global supply chains.', 'यह सीधे कक्षा X के अंतर्विषयक प्रोजेक्ट से जुड़ता है — प्राचीन मसाला/कपास मार्ग कैसे आधुनिक बंदरगाहों व वैश्वीकरण में बदले।'),
    },
    tours: [
      { az: 0.1, pol: 1.15, r: 14, en: 'Step 1 · Indian Port Crossroads: Lothal, Muziris & Tamralipti anchoring monsoon trade.', hi: 'चरण 1 · भारतीय बंदरगाह संगम: लोथल, मुज़िरिस व ताम्रलिप्ति मानसून व्यापार के केंद्र।' },
      { az: -0.75, pol: 1.05, r: 15, en: 'Step 2 · Westward Spice Arc: Pepper, textiles & Indian numerals travelling to Red Sea & Rome.', hi: 'चरण 2 · पश्चिमी मसाला मार्ग: काली मिर्च, वस्त्र व भारतीय अंक लाल सागर व रोम तक गए।' },
      { az: 0.85, pol: 1.05, r: 15, en: 'Step 3 · Suvarnabhumi Arc: Cultural, script & architectural ties across Southeast Asia.', hi: 'चरण 3 · सुवर्णभूमि मार्ग: दक्षिण-पूर्व एशिया के साथ लिपि, कला व सांस्कृतिक आदान-प्रदान।' },
    ],
    ar: {
      id: 'cbq-t13-ar',
      assertion: b('Discovery of seasonal reversing monsoon winds turned the Indian Ocean into a fast oceanic highway well before steamships.', 'भाप इंजन से बहुत पहले ही मौसमी मानसून हवाओं की समझ ने हिंद महासागर को तेज़ समुद्री राजमार्ग बना दिया।'),
      reason: b('Sailors could ride Southwest monsoon winds eastward to India in summer and catch Northeast monsoon winds westward in winter.', 'नाविक गर्मियों में दक्षिण-पश्चिम मानसून से भारत की ओर और सर्दियों में उत्तर-पूर्व मानसून से पश्चिम की ओर लौट सकते थे।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — predictable seasonal wind reversal powered Muziris–Alexandria and Bay of Bengal voyages.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है — नियमित पवन-दिशा परिवर्तन से समुद्री व्यापार फला-फूला।'),
    },
    caseQ: {
      id: 'cbq-t13-case',
      passage: b('Source Case: Excavations at Arikamedu (Puducherry) yielded Roman amphora jars and Arretine pottery alongside Indian beads and fine cotton goods.', 'स्रोत प्रसंग: अरिकमेडु (पुदुचेरी) की खुदाई में भारतीय मनकों व सूती कपड़ों के साथ रोमन सुराहियाँ (एम्फोरा) और मिट्टी के बर्तन मिले हैं।'),
      stem: b('What does this mix of Roman and Tamil artefacts at one coastal port prove?', 'एक ही तटीय बंदरगाह पर रोमन और भारतीय वस्तुओं का साथ मिलना क्या सिद्ध करता है?'),
      options: [
        { id: 'twoway', ...b('Active two-way maritime commerce linking South Indian ports with the Mediterranean world', 'दक्षिण भारतीय बंदरगाहों और भूमध्यसागरीय विश्व के बीच सक्रिय दोतरफ़ा समुद्री व्यापार') },
        { id: 'oneway', ...b('No ships ever crossed the Arabian Sea before 1800 CE', '1800 ई. से पहले कोई जहाज़ अरब सागर पार नहीं करता था'), why: b('Roman wine/olive amphorae alongside Sangam accounts prove active first-century sea trade.', 'रोमन एम्फोरा और संगम साहित्य ईसा की आरंभिक सदियों के व्यापार को सिद्ध करते हैं।') },
      ],
      correct: 'twoway',
      explain: b('Physical imports + Sangam poetry confirm vibrant trade connecting Muziris, Arikamedu, Rome, and Southeast Asia.', 'पुरातत्व और संगम साहित्य दोनों प्राचीन भारत–विश्व समुद्री व्यापार की पुष्टि करते हैं।'),
    },
  },

  T14: {
    cgs: ['CG5'],
    codes: ['C5.1', 'C5.2', 'C5.3'],
    skill: b('Constitutional Accountability & Ethical Civic Reasoning', 'संवैधानिक जवाबदेही व नैतिक नागरिक तर्क'),
    classX: {
      chapters: b('Class X Bridge: Ch.1 Power Sharing · Ch.2 Federalism · Ch.5 Outcomes of Democracy', 'कक्षा X सेतु: सत्ता की साझेदारी · संघवाद · लोकतंत्र के परिणाम'),
      summary: b('Balancing Danda (state authority) with Nyaya (justice) and citizen participation underpins Class X’s Constitutional checks, decentralized federalism, and accountable democratic outcomes.', 'दंड और न्याय का संतुलन तथा नागरिक भागीदारी सीधे कक्षा X के संघवाद व लोकतंत्र की जवाबदेही से जुड़ती है।'),
    },
    tours: [
      { az: 0.45, pol: 1.05, r: 16, en: 'Step 1 · Citizens & Local Sabha Base: Authority begins with accountable local public desks.', hi: 'चरण 1 · नागरिक व ग्राम सभा आधार: वैध प्राधिकार की नींव जवाबदेह स्थानीय सभा से शुरू होती है।' },
      { az: -0.5, pol: 1.0, r: 15, en: 'Step 2 · Appeal & Judicial Tiers: Escalating checks protect fundamental rights.', hi: 'चरण 2 · अपीलीय न्यायालय स्तर: उच्च स्तर नागरिक अधिकारों की संवैधानिक रक्षा करते हैं।' },
      { az: 0.0, pol: 0.8, r: 14, en: 'Step 3 · Golden Scales of Nyaya: Force without justice loses legitimacy.', hi: 'चरण 3 · न्याय की तुला: न्याय के बिना बल अपनी वैधता खो देता है।' },
    ],
    ar: {
      id: 'cbq-t14-ar',
      assertion: b('Both Kautilya’s Arthashastra and India’s modern Constitution stress that authority loses legitimacy when divorced from justice (Nyaya).', 'कौटिल्य का अर्थशास्त्र और आधुनिक भारतीय संविधान दोनों मानते हैं कि न्याय से अलग होने पर सत्ता अपनी वैधता खो देती है।'),
      reason: b('Unchecked coercive power breeds fear and instability, whereas fair, welfare-oriented law earns voluntary citizen trust.', 'नियंत्रण-रहित बल भय व अस्थिरता फैलाता है, जबकि न्यायपूर्ण व कल्याणकारी कानून नागरिकों का विश्वास जीतता है।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — linking India’s classical statecraft with Constitutional Rule of Law.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है — यही विधि के शासन की नींव है।'),
    },
    caseQ: {
      id: 'cbq-t14-case',
      passage: b('Source Case: A municipal clinic denies free essential medicine listed on the Citizen Charter. Residents file a transparent grievance first at the ward office and escalate to the district helpline.', 'स्रोत प्रसंग: एक नगर चिकित्सालय नागरिक चार्टर में दर्ज मुफ़्त दवा देने से इनकार करता है। नागरिक पहले वार्ड कार्यालय में लिखित शिकायत दर्ज कराते हैं और समाधान न होने पर ज़िला हेल्पलाइन तक जाते हैं।'),
      stem: b('Which concept best describes citizens using lawful channels to hold public offices accountable?', 'नागरिकों द्वारा वैधानिक माध्यमों से सार्वजनिक कार्यालय को जवाबदेह ठहराना क्या दर्शाता है?'),
      options: [
        { id: 'const', ...b('Welfare-oriented authority + active constitutional citizenship', 'कल्याणकारी प्राधिकार व सक्रिय संवैधानिक नागरिकता') },
        { id: 'force', ...b('Arbitrary rule without public checks', 'बिना किसी जवाबदेही के मनमाना शासन'), why: b('Lawful escalation and Citizen Charters exemplify democratic accountability.', 'नागरिक चार्टर और अपीलीय प्रक्रिया लोकतांत्रिक जवाबदेही के स्तंभ हैं।') },
      ],
      correct: 'const',
      explain: b('Rights thrive when citizens know institutional escalation paths and fulfil civic duties responsibly.', 'अधिकार तब सशक्त होते हैं जब नागरिक वैध संस्थागत मार्गों का उपयोग व कर्तव्यों का पालन करते हैं।'),
    },
  },

  T15: {
    cgs: ['CG7'],
    codes: ['C7.3'],
    skill: b('Entrepreneurial Unit Economics & Innovation Analysis', 'उद्यमिता इकाई-अर्थशास्त्र व नवाचार विश्लेषण'),
    classX: {
      chapters: b('Class X Bridge: Ch.2 Sectors of Indian Economy (Organised/Unorganised) · Ch.4 Globalisation (MSME Competition)', 'कक्षा X सेतु: भारतीय अर्थव्यवस्था के क्षेत्रक (संगठित/असंगठित) · वैश्वीकरण'),
      summary: b('Startups, MSMEs, unorganised artisans, and break-even economics in T15 feed directly into Class X’s analysis of employment sectors, formal credit, and MSME resilience in global markets.', 'स्टार्टअप, MSME व असंगठित क्षेत्र की इकाई-अर्थशास्त्र समझ सीधे कक्षा X के क्षेत्रक व वैश्वीकरण अध्यायों से जुड़ती है।'),
    },
    tours: [
      { az: -0.6, pol: 1.05, r: 15, en: 'Step 1 · Solar Craft Workshop: Prototype using clean solar energy & local skills.', hi: 'चरण 1 · सौर शिल्प कार्यशाला: स्वच्छ ऊर्जा और स्थानीय कौशल से उद्यम।' },
      { az: 0.55, pol: 1.05, r: 15, en: 'Step 2 · Revenue vs Cost Towers: Profit emerges only once the green Revenue tower passes red Cost.', hi: 'चरण 2 · आय बनाम लागत स्तंभ: जब हरा आय स्तंभ लाल लागत से ऊपर निकले तभी लाभ होता है।' },
      { az: 0.0, pol: 0.45, r: 17, en: 'Step 3 · Break-Even Overview: Scale units or lower unit cost to cross break-even.', hi: 'चरण 3 · सम-विच्छेद दृश्य: बिक्री बढ़ाने या इकाई लागत घटाने से उद्यम लाभ में आता है।' },
    ],
    ar: {
      id: 'cbq-t15-ar',
      assertion: b('Supporting MSMEs and unorganised-sector artisans with low-cost credit and digital payments strengthens inclusive economic growth.', 'सस्ते ऋण और डिजिटल भुगतान से MSME तथा असंगठित क्षेत्र के कारीगरों को सहारा देने से समावेशी विकास मज़बूत होता है।'),
      reason: b('MSMEs and small enterprises employ far more workers per rupee of capital than mega automated factories.', 'बड़े स्वचालित कारखानों की तुलना में MSME और छोटे उद्यम प्रति रुपया निवेश पर कहीं अधिक रोज़गार पैदा करते हैं।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — core link between Class IX T15 and Class X Sectors of the Economy.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है — यह कक्षा IX व X अर्थशास्त्र की मुख्य कड़ी है।'),
    },
    caseQ: {
      id: 'cbq-t15-case',
      passage: b('Data Case: A student craft co-op has ₹2,000 fixed rent/month, ₹30 variable material cost per notebook, and sells notebooks at ₹50 each.', 'आँकड़ा प्रसंग: एक छात्र शिल्प सहकारी का मासिक स्थायी किराया ₹2,000 है, प्रति कॉपी सामग्री लागत ₹30 है और बिक्री मूल्य ₹50 है।'),
      stem: b('How many notebooks must the co-op sell in a month simply to break even (Profit = ₹0)?', 'केवल सम-विच्छेद (लाभ = ₹0) तक पहुँचने के लिए माह में कितनी कॉपियाँ बेचनी होंगी?'),
      options: [
        { id: '100', ...b('100 notebooks (₹2,000 ÷ (₹50 − ₹30 contribution margin))', '100 कॉपियाँ (₹2,000 ÷ ₹20 प्रति इकाई अंशदान)') },
        { id: '40', ...b('40 notebooks (₹2,000 ÷ ₹50)', '40 कॉपियाँ (₹2,000 ÷ ₹50)'), why: b('Each unit also costs ₹30 to make, so it contributes ₹20 toward fixed rent, not ₹50.', 'हर कॉपी पर ₹30 सामग्री लागत भी आती है, इसलिए किराये के लिए केवल ₹20 बचते हैं।') },
      ],
      correct: '100',
      explain: b('Break-even = Fixed Cost ÷ (Price − Variable Cost) = 2000 ÷ 20 = 100 units.', 'सम-विच्छेद बिंदु = स्थायी लागत ÷ (मूल्य − परिवर्ती लागत) = 2000 ÷ 20 = 100 इकाइयाँ।'),
    },
  },

  T16: {
    cgs: ['CG8'],
    codes: ['CG8', 'C8.1'],
    skill: b('Personal Financial Literacy & Compounding Maths', 'व्यक्तिगत वित्तीय साक्षरता व चक्रवृद्धि गणित'),
    classX: {
      chapters: b('Class X Bridge: Ch.3 Money & Credit (Formal vs Informal Interest) · Ch.5 Consumer Rights', 'कक्षा X सेतु: मुद्रा व साख (औपचारिक बनाम अनौपचारिक ब्याज) · उपभोक्ता अधिकार'),
      summary: b('Budgeting, inflation, compound interest, risk-pooling insurance, and taxes in T16 translate directly into Class X Money & Credit (understanding debt traps vs formal SHG/bank loans).', 'बजट, मुद्रास्फीति, चक्रवृद्धि ब्याज और बीमा सीधे कक्षा X के मुद्रा व साख (कर्ज़-जाल बनाम बैंक/SHG ऋण) को समझाते हैं।'),
    },
    tours: [
      { az: -0.5, pol: 1.05, r: 16, en: 'Step 1 · Needs vs Wants Jars: Watch essential needs & discretionary wants fill their cylinders.', hi: 'चरण 1 · आवश्यकता बनाम इच्छा जार: आय में से खर्च के अनुपात देखें।' },
      { az: 0.75, pol: 1.05, r: 15, en: 'Step 2 · Savings Jar & Compound Tree: Regular saving grows exponentially over decades.', hi: 'चरण 2 · बचत जार व चक्रवृद्धि वृक्ष: समय के साथ बचत तेज़ी से बढ़ती है।' },
      { az: 0.0, pol: 0.5, r: 18, en: 'Step 3 · Overview Balance: Keep savings resilient against inflation & surprise shocks.', hi: 'चरण 3 · समग्र संतुलन: मुद्रास्फीति व आकस्मिक संकट के विरुद्ध बचत मजबूत रखें।' },
    ],
    ar: {
      id: 'cbq-t16-ar',
      assertion: b('Keeping all long-term savings as cash locked in a cupboard loses real purchasing power over 15 years.', '15 वर्षों तक सारी बचत नकद अलमारी में बंद रखने से उसकी वास्तविक क्रय-शक्ति घट जाती है।'),
      reason: b('Inflation steadily raises everyday goods prices, so cash earning 0% interest buys fewer goods each passing year.', 'मुद्रास्फीति से दैनिक वस्तुओं के दाम बढ़ते हैं, इसलिए 0% ब्याज वाली नकदी से हर साल कम सामान आता है।'),
      correct: 'A',
      explain: b('Both A and R are true and R explains A — real return equals nominal interest minus inflation.', 'A और R दोनों सत्य हैं तथा R, A की सही व्याख्या है — वास्तविक प्रतिफल = ब्याज दर − मुद्रास्फीति।'),
    },
    caseQ: {
      id: 'cbq-t16-case',
      passage: b('Data Case: Using the Rule of 72 (approx. doubling years ≈ 72 ÷ rate%), compare Bank FD at 6% p.a. vs informal moneylender debt compounding at 24% p.a.', 'आँकड़ा प्रसंग: 72 के नियम (दोगुना होने के वर्ष ≈ 72 ÷ ब्याज दर%) से 6% वार्षिक बैंक FD बनाम 24% वार्षिक अनौपचारिक सूदखोर कर्ज़ की तुलना करें।'),
      stem: b('How fast does a 24% informal loan double if unpaid compared with 6% savings?', '6% बचत की तुलना में 24% वाला अनौपचारिक कर्ज़ बिना चुकाए कितने समय में दोगुना हो जाता है?'),
      options: [
        { id: '3yr', ...b('Loan doubles in ~3 years (72 ÷ 24), vs ~12 years for 6% savings — explaining why high-rate debt traps families', 'कर्ज़ मात्र ~3 वर्ष (72 ÷ 24) में दोगुना होता है, जबकि 6% बचत ~12 वर्ष में — यही कर्ज़-जाल का कारण है') },
        { id: '24yr', ...b('Loan takes 24 years to double while 6% takes 6 years', 'कर्ज़ 24 वर्ष में दोगुना होता है और 6% बचत 6 वर्ष में'), why: b('Higher rate means faster doubling: divide 72 by the interest rate.', 'ब्याज दर जितनी ऊँची, दोगुना होने का समय उतना कम (72 ÷ दर)।') },
      ],
      correct: '3yr',
      explain: b('Understanding compounding protects students against predatory informal loans (Class X Money & Credit core takeaway).', 'चक्रवृद्धि दरों की समझ छात्रों को महँगे अनौपचारिक कर्ज़-जाल से बचाती है।'),
    },
  },
};
