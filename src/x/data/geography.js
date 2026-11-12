// Class X Geography — Contemporary India II (NCERT). State groupings are teaching simplifications: real regions cross state borders.
import { b, C, pt, route, grp, idea, q, node, step } from './_h.js';

export default [
  {
    id: 'G1', unit: 'geography', no: 1, icon: 'Layers', en: 'Resources and Development', hi: 'संसाधन एवं विकास',
    hook: b('The same field can feed a family for centuries or turn barren in a decade. What decides which?', 'एक ही खेत सदियों तक परिवार को खिला सकता है या एक दशक में बंजर हो सकता है। यह किससे तय होता है?'),
    scenes: [{
      t: b('Soils and land on the map', 'मानचित्र पर मृदा और भूमि'), kind: 'india', layers: [
        { en: 'Dominant soil (simplified)', hi: 'प्रमुख मृदा (सरलीकृत)', groups: [
          grp('Alluvial: khadar and bangar', 'जलोढ़: खादर और बांगर', C.gold, ['Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Assam', 'Delhi']),
          grp('Black (regur): cotton', 'काली (रेगर): कपास', '#6b7280', ['Maharashtra', 'Madhya Pradesh', 'Gujarat', 'Telangana']),
          grp('Red and yellow', 'लाल और पीली', C.coral, ['Odisha', 'Chhattisgarh', 'Jharkhand', 'Tamil Nadu', 'Andhra Pradesh', 'Karnataka']),
          grp('Laterite: tea, coffee, cashew', 'लेटराइट: चाय, कॉफ़ी, काजू', C.orange, ['Kerala', 'Goa', 'Meghalaya']),
          grp('Arid', 'मरुस्थली', '#e7cf9a', ['Rajasthan']),
          grp('Forest and mountain', 'वन और पर्वतीय', C.green, ['Jammu & Kashmir', 'Ladakh', 'Himachal Pradesh', 'Uttarakhand', 'Sikkim', 'Arunachal Pradesh', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura'])] },
        { en: 'Causes of land degradation', hi: 'भूमि निम्नीकरण के कारण', groups: [
          grp('Mining and deforestation', 'खनन और वनोन्मूलन', C.violet, ['Jharkhand', 'Chhattisgarh', 'Madhya Pradesh', 'Odisha']),
          grp('Overgrazing', 'अति पशुचारण', C.orange, ['Gujarat', 'Rajasthan', 'Maharashtra']),
          grp('Over-irrigation: waterlogging, salinity', 'अति सिंचाई: जलाक्रांतता, लवणता', C.sky, ['Punjab', 'Haryana', 'Uttar Pradesh'])] },
      ],
    }],
    ideas: [
      idea('Sustainable development', 'सतत पोषणीय विकास', 'Development should happen without damaging the environment and without compromising the needs of future generations (Rio Earth Summit 1992, Agenda 21).', 'विकास पर्यावरण को हानि पहुँचाए बिना और भावी पीढ़ियों की ज़रूरतों से समझौता किए बिना हो (रियो पृथ्वी सम्मेलन 1992, एजेंडा 21)।'),
      idea('Resource planning', 'संसाधन नियोजन', 'Identify and inventory resources, build a planning structure with technology and institutions, and match resource plans with national development plans.', 'संसाधनों की पहचान और तालिका, तकनीक और संस्थाओं वाला नियोजन ढाँचा, और संसाधन योजनाओं का राष्ट्रीय विकास योजनाओं से मेल।'),
      idea('Soil as a resource', 'संसाधन के रूप में मृदा', 'Alluvial soil is the most widespread and fertile; black soil holds moisture and suits cotton; laterite forms by intense leaching.', 'जलोढ़ मृदा सबसे विस्तृत और उपजाऊ है; काली मृदा नमी रोकती है और कपास के अनुकूल है; लेटराइट तीव्र निक्षालन से बनती है।'),
      idea('Soil conservation', 'मृदा संरक्षण', 'Contour ploughing, terrace farming, strip cropping and shelter belts slow down wind and water erosion.', 'समोच्च जुताई, सीढ़ीदार खेती, पट्टी कृषि और रक्षक मेखला वायु और जल अपरदन को धीमा करती हैं।'),
    ],
    explore: [{
      t: b('How resources are classified', 'संसाधनों का वर्गीकरण'), kind: 'tree', root: node('Resources', 'संसाधन', [
        node('By origin', 'उत्पत्ति के आधार पर', [node('Biotic', 'जैव', null, 'Obtained from the biosphere and have life: flora, fauna, fisheries, livestock.', 'जैवमंडल से प्राप्त और सजीव: वनस्पति, प्राणी, मत्स्य, पशुधन।'), node('Abiotic', 'अजैव', null, 'Composed of non-living things: rocks and metals.', 'निर्जीव वस्तुओं से बने: चट्टानें और धातुएँ।')]),
        node('By exhaustibility', 'समाप्यता के आधार पर', [node('Renewable', 'नवीकरण योग्य', null, 'Can be renewed or reproduced: solar and wind energy, water, forests.', 'पुनः उत्पन्न हो सकते हैं: सौर और पवन ऊर्जा, जल, वन।'), node('Non-renewable', 'अनवीकरण योग्य', null, 'Take millions of years to form: minerals and fossil fuels.', 'बनने में लाखों वर्ष लगते हैं: खनिज और जीवाश्म ईंधन।')]),
        node('By ownership', 'स्वामित्व के आधार पर', [node('Individual', 'व्यक्तिगत', null, 'Owned privately: farmland, houses, plantations.', 'निजी स्वामित्व: खेत, घर, बागान।'), node('Community', 'सामुदायिक', null, 'Accessible to all members of a community: grazing grounds, village ponds.', 'समुदाय के सभी सदस्यों के लिए: चरागाह, गाँव के तालाब।'), node('National', 'राष्ट्रीय', null, 'All resources within the country’s political boundary and territorial waters.', 'देश की राजनीतिक सीमा और क्षेत्रीय जल के भीतर के सभी संसाधन।'), node('International', 'अंतरराष्ट्रीय', null, 'Oceanic resources beyond 200 nautical miles of the Exclusive Economic Zone.', 'अनन्य आर्थिक क्षेत्र के 200 समुद्री मील से आगे के महासागरीय संसाधन।')]),
        node('By status of development', 'विकास के स्तर के आधार पर', [node('Potential', 'संभावी', null, 'Found in a region but not yet utilised: wind and solar energy in Rajasthan and Gujarat.', 'क्षेत्र में मौजूद पर अभी उपयोग नहीं: राजस्थान और गुजरात में पवन और सौर ऊर्जा।'), node('Developed', 'विकसित', null, 'Surveyed, with quality and quantity determined for use.', 'सर्वेक्षित, उपयोग के लिए गुणवत्ता और मात्रा निर्धारित।'), node('Stock and reserves', 'भंडार और संचित कोष', null, 'Stock cannot be used with present technology; reserves can be, but are kept for the future.', 'भंडार वर्तमान तकनीक से उपयोग नहीं हो सकते; संचित कोष हो सकते हैं पर भविष्य के लिए रखे जाते हैं।')]),
      ]),
    }],
    quiz: [
      q('Agenda 21 was adopted at the Earth Summit held in', 'एजेंडा 21 किस पृथ्वी सम्मेलन में स्वीकृत हुआ?', [['Rio de Janeiro, 1992', 'रियो डी जेनेरो, 1992'], ['Kyoto, 1997', 'क्योटो, 1997'], ['Paris, 2015', 'पेरिस, 2015'], ['Stockholm, 1972', 'स्टॉकहोम, 1972']], 0, 'It aims at global sustainable development.', 'इसका लक्ष्य वैश्विक सतत पोषणीय विकास है।'),
      q('Which soil is also called regur and is ideal for cotton?', 'किस मृदा को रेगर भी कहते हैं और जो कपास के लिए आदर्श है?', [['Alluvial', 'जलोढ़'], ['Black', 'काली'], ['Laterite', 'लेटराइट'], ['Arid', 'मरुस्थली']], 1, 'Black soil is typical of the Deccan trap region.', 'काली मृदा दक्कन ट्रैप क्षेत्र की विशेषता है।'),
      q('The newer, more fertile alluvium is called', 'नई, अधिक उपजाऊ जलोढ़ को कहते हैं', [['Bangar', 'बांगर'], ['Khadar', 'खादर'], ['Regur', 'रेगर'], ['Kankar', 'कंकर']], 1, 'Bangar is the older alluvium with more kankar nodules.', 'बांगर पुरानी जलोढ़ है जिसमें कंकर ग्रंथियाँ अधिक हैं।'),
      q('The main cause of land degradation in Punjab is', 'पंजाब में भूमि निम्नीकरण का मुख्य कारण है', [['Mining', 'खनन'], ['Overgrazing', 'अति पशुचारण'], ['Over-irrigation', 'अति सिंचाई'], ['Deforestation', 'वनोन्मूलन']], 2, 'It causes waterlogging and increases salinity and alkalinity.', 'इससे जलाक्रांतता होती है और लवणता व क्षारीयता बढ़ती है।'),
    ],
    note: b('Each state shows one dominant soil or cause. Real soil regions are mixed and cross state borders; use the textbook map for map work.', 'हर राज्य में एक प्रमुख मृदा या कारण दिखाया है। वास्तविक मृदा क्षेत्र मिश्रित हैं और राज्य सीमाएँ पार करते हैं; मानचित्र कार्य के लिए पाठ्यपुस्तक का मानचित्र देखें।'),
  },
  {
    id: 'G2', unit: 'geography', no: 2, icon: 'Trees', en: 'Forest and Wildlife Resources', hi: 'वन एवं वन्य जीव संसाधन',
    hook: b('Who protects a forest better: a guard with a rulebook or a village that depends on it?', 'वन की बेहतर रक्षा कौन करता है: नियम-पुस्तिका वाला पहरेदार या उस पर निर्भर गाँव?'),
    scenes: [{
      t: b('Conservation on the map', 'मानचित्र पर संरक्षण'), kind: 'india', layers: [
        { en: 'Project Tiger reserves', hi: 'प्रोजेक्ट टाइगर रिज़र्व', groups: [grp('States with these reserves', 'इन रिज़र्व वाले राज्य', C.green, ['Uttarakhand', 'West Bengal', 'Madhya Pradesh', 'Rajasthan', 'Assam', 'Kerala'])], points: [pt(29.53, 78.77, 'Corbett National Park', 'कॉर्बेट राष्ट्रीय उद्यान', C.gold), pt(21.95, 88.9, 'Sunderbans National Park', 'सुंदरबन राष्ट्रीय उद्यान', C.gold), pt(23.72, 81.02, 'Bandhavgarh National Park', 'बांधवगढ़ राष्ट्रीय उद्यान', C.gold), pt(27.32, 76.43, 'Sariska Wildlife Sanctuary', 'सरिस्का वन्य जीव अभयारण्य', C.gold), pt(26.72, 91.0, 'Manas Tiger Reserve', 'मानस बाघ रिज़र्व', C.gold), pt(9.46, 77.24, 'Periyar Tiger Reserve', 'पेरियार बाघ रिज़र्व', C.gold)] },
        { en: 'Communities conserve', hi: 'समुदाय द्वारा संरक्षण', groups: [grp('Community action', 'सामुदायिक पहल', C.teal, ['Rajasthan', 'Uttarakhand', 'Odisha'])], points: [pt(27.45, 76.4, 'Alwar: Bhairodev Dakav “Sonchuri”', 'अलवर: भैरोंदेव डाकव “सोंचुरी”', C.teal), pt(30.4, 79.3, 'Chipko movement', 'चिपको आंदोलन', C.green), pt(30.38, 78.48, 'Tehri: Beej Bachao Andolan', 'टिहरी: बीज बचाओ आंदोलन', C.gold, 0.5), pt(20.5, 84.5, 'Odisha 1988: first Joint Forest Management resolution', 'ओडिशा 1988: संयुक्त वन प्रबंधन का पहला प्रस्ताव', C.coral)] },
      ],
    }],
    ideas: [
      idea('Why conserve?', 'संरक्षण क्यों?', 'Conservation preserves ecological diversity and our life-support systems: water, air and soil.', 'संरक्षण पारिस्थितिक विविधता और हमारे जीवन-आधार तंत्र — जल, वायु और मृदा — को बचाता है।'),
      idea('Laws and projects', 'क़ानून और परियोजनाएँ', 'The Indian Wildlife (Protection) Act, 1972 protects habitats and lists protected species. Project Tiger began in 1973.', 'भारतीय वन्यजीव (संरक्षण) अधिनियम 1972 आवासों की रक्षा करता है और संरक्षित प्रजातियों की सूची देता है। प्रोजेक्ट टाइगर 1973 में शुरू हुआ।'),
      idea('Three kinds of forest', 'वनों के तीन प्रकार', 'Reserved forests (more than half of forest land), protected forests (almost one-third) and unclassed forests.', 'आरक्षित वन (वन भूमि के आधे से अधिक), रक्षित वन (लगभग एक-तिहाई) और अवर्गीकृत वन।'),
      idea('People as partners', 'लोग साझेदार के रूप में', 'Sacred groves, the Chipko movement and Joint Forest Management show that local communities are central to conservation.', 'पवित्र उपवन, चिपको आंदोलन और संयुक्त वन प्रबंधन दिखाते हैं कि स्थानीय समुदाय संरक्षण के केंद्र में हैं।'),
    ],
    explore: [{
      t: b('How forests are classified', 'वनों का वर्गीकरण'), kind: 'tree', root: node('Forest and wasteland', 'वन और बंजर भूमि', [
        node('Reserved forests', 'आरक्षित वन', [node('More than half of total forest land', 'कुल वन भूमि के आधे से अधिक')], 'Regarded as the most valuable for conserving forest and wildlife resources.', 'वन और वन्य जीव संसाधनों के संरक्षण के लिए सबसे मूल्यवान माने जाते हैं।'),
        node('Protected forests', 'रक्षित वन', [node('Almost one-third of total forest area', 'कुल वन क्षेत्र का लगभग एक-तिहाई')], 'Protected from any further depletion.', 'इन्हें और अधिक क्षरण से बचाया जाता है।'),
        node('Unclassed forests', 'अवर्गीकृत वन', [node('Government, private and community land', 'सरकारी, निजी और सामुदायिक भूमि')], 'Other forests and wastelands; common in the north-eastern states and parts of Gujarat.', 'अन्य वन और बंजर भूमि; पूर्वोत्तर राज्यों और गुजरात के कुछ भागों में सामान्य।'),
      ]),
    }],
    quiz: [
      q('Project Tiger was launched in', 'प्रोजेक्ट टाइगर कब शुरू हुआ?', [['1952', '1952'], ['1973', '1973'], ['1988', '1988'], ['1992', '1992']], 1, 'It was one of the best-publicised wildlife campaigns in the world.', 'यह विश्व के सबसे चर्चित वन्यजीव अभियानों में था।'),
      q('Which state passed the first resolution for Joint Forest Management, in 1988?', '1988 में संयुक्त वन प्रबंधन का पहला प्रस्ताव किस राज्य ने पारित किया?', [['Kerala', 'केरल'], ['Rajasthan', 'राजस्थान'], ['Odisha', 'ओडिशा'], ['Assam', 'असम']], 2, 'JFM involves local communities in managing degraded forests.', 'JFM में स्थानीय समुदाय क्षरित वनों के प्रबंधन में शामिल होते हैं।'),
      q('Which forests are regarded as the most valuable for conservation?', 'संरक्षण के लिए कौन-से वन सबसे मूल्यवान माने जाते हैं?', [['Unclassed', 'अवर्गीकृत'], ['Protected', 'रक्षित'], ['Reserved', 'आरक्षित'], ['Private', 'निजी']], 2, 'They make up more than half of the total forest land.', 'ये कुल वन भूमि के आधे से अधिक हैं।'),
      q('The Chipko movement is associated with', 'चिपको आंदोलन किससे जुड़ा है?', [['The Himalayas', 'हिमालय'], ['The Thar desert', 'थार मरुस्थल'], ['The Sunderbans', 'सुंदरबन'], ['The Western Ghats', 'पश्चिमी घाट']], 0, 'It resisted deforestation and promoted community afforestation.', 'इसने वनों की कटाई का विरोध किया और सामुदायिक वनीकरण को बढ़ावा दिया।'),
    ],
    note: b('Pins mark approximate locations. Only the reserves named in the NCERT chapter are shown; India has many more.', 'पिन अनुमानित स्थान दिखाते हैं। केवल NCERT अध्याय में नामित रिज़र्व दिखाए हैं; भारत में और भी बहुत हैं।'),
  },
  {
    id: 'G3', unit: 'geography', no: 3, icon: 'Droplets', en: 'Water Resources', hi: 'जल संसाधन',
    hook: b('Three-fourths of the Earth is covered with water. So why do taps run dry?', 'पृथ्वी का तीन-चौथाई भाग जल से ढका है। फिर नल सूखे क्यों रह जाते हैं?'),
    scenes: [
      { t: b('Inside a multipurpose dam', 'बहुउद्देशीय बाँध के भीतर'), kind: 'diorama', name: 'dam' },
      { t: b('Dams and rainwater harvesting', 'बाँध और वर्षा जल संग्रहण'), kind: 'india', layers: [
        { en: 'Major dams', hi: 'प्रमुख बाँध', points: [pt(31.41, 76.43, 'Bhakra Nangal: Sutlej', 'भाखड़ा नांगल: सतलुज', C.sky), pt(33.14, 74.81, 'Salal: Chenab', 'सलाल: चेनाब', C.sky, 0.4), pt(30.38, 78.48, 'Tehri: Bhagirathi', 'टिहरी: भागीरथी', C.sky, 0.2), pt(24.92, 75.58, 'Rana Pratap Sagar: Chambal', 'राणा प्रताप सागर: चंबल', C.sky), pt(21.83, 73.75, 'Sardar Sarovar: Narmada', 'सरदार सरोवर: नर्मदा', C.coral), pt(21.57, 83.87, 'Hirakud: Mahanadi', 'हीराकुड: महानदी', C.sky), pt(17.4, 73.75, 'Koyna', 'कोयना', C.sky, 0.3), pt(16.57, 79.31, 'Nagarjuna Sagar: Krishna', 'नागार्जुन सागर: कृष्णा', C.sky), pt(15.26, 76.33, 'Tungabhadra', 'तुंगभद्रा', C.sky, 0.3), pt(11.8, 77.8, 'Mettur: Kaveri', 'मेट्टूर: कावेरी', C.sky)] },
        { en: 'Rainwater harvesting', hi: 'वर्षा जल संग्रहण', groups: [grp('Traditional and rooftop systems', 'पारंपरिक और छत-आधारित प्रणालियाँ', C.teal, ['Rajasthan', 'Meghalaya', 'Tamil Nadu', 'Karnataka', 'Himachal Pradesh'])], points: [pt(28.02, 73.31, 'Bikaner, Phalodi, Barmer: tankas', 'बीकानेर, फलोदी, बाड़मेर: टाँके', C.gold), pt(26.9, 70.9, 'Jaisalmer: khadins', 'जैसलमेर: खादीन', C.orange), pt(25.57, 91.88, 'Shillong: rooftop harvesting; bamboo drip irrigation', 'शिलांग: छत जल संग्रहण; बाँस ड्रिप सिंचाई', C.green), pt(12.3, 76.65, 'Gendathur, Mysuru: rooftop systems', 'गंडाथूर, मैसूरु: छत प्रणालियाँ', C.teal), pt(11.2, 78.6, 'Tamil Nadu: rooftop structures compulsory', 'तमिलनाडु: छत संरचना अनिवार्य', C.coral), pt(32, 77.1, 'Western Himalaya: guls and kuls', 'पश्चिमी हिमालय: गुल और कुल', C.sky)] },
      ] },
    ],
    ideas: [
      idea('Scarcity amid plenty', 'प्रचुरता में अभाव', 'Water scarcity comes from over-exploitation, excessive use and unequal access, not only from low rainfall.', 'जल की कमी केवल कम वर्षा से नहीं, अति-दोहन, अत्यधिक उपयोग और असमान पहुँच से भी होती है।'),
      idea('Multipurpose projects', 'बहुउद्देशीय परियोजनाएँ', 'Dams serve irrigation, electricity, water supply, flood control, navigation and fish breeding. Jawaharlal Nehru called them the “temples of modern India”.', 'बाँध सिंचाई, बिजली, जल आपूर्ति, बाढ़ नियंत्रण, नौवहन और मत्स्य पालन के काम आते हैं। जवाहरलाल नेहरू ने इन्हें “आधुनिक भारत के मंदिर” कहा।'),
      idea('The costs of big dams', 'बड़े बाँधों की क़ीमत', 'Dams fragment rivers, submerge vegetation and displace communities; the Narmada Bachao Andolan and the Tehri Dam Andolan raised these issues.', 'बाँध नदियों को खंडित करते हैं, वनस्पति डुबोते हैं और समुदायों को विस्थापित करते हैं; नर्मदा बचाओ आंदोलन और टिहरी बाँध आंदोलन ने ये प्रश्न उठाए।'),
      idea('Harvesting the rain', 'वर्षा का संग्रहण', 'Tankas, khadins, johads, guls and rooftop systems store rain where it falls and recharge groundwater.', 'टाँके, खादीन, जोहड़, गुल और छत प्रणालियाँ वर्षा को वहीं सँजोती हैं और भूजल पुनर्भरण करती हैं।'),
    ],
    explore: [{
      t: b('Rooftop rainwater harvesting, step by step', 'छत वर्षा जल संग्रहण, चरण-दर-चरण'), kind: 'steps', steps: [
        step('Collect on the roof', 'छत पर संग्रह', 'Rain falling on the roof is collected using a PVC pipe.', 'छत पर गिरा वर्षा जल PVC पाइप से एकत्र किया जाता है।'),
        step('Filter', 'छानना', 'The water is filtered using sand and bricks.', 'जल को रेत और ईंटों से छाना जाता है।'),
        step('Store in a sump', 'हौदी में भंडारण', 'An underground pipe takes the water to a sump for immediate use.', 'भूमिगत पाइप जल को तुरंत उपयोग के लिए हौदी तक ले जाता है।'),
        step('Send the excess to a well', 'अतिरिक्त जल कुएँ में', 'Excess water from the sump is taken to a well.', 'हौदी का अतिरिक्त जल कुएँ तक ले जाया जाता है।'),
        step('Recharge groundwater', 'भूजल पुनर्भरण', 'Water from the well recharges the underground water.', 'कुएँ का जल भूमिगत जल का पुनर्भरण करता है।'),
        step('Use it later', 'बाद में उपयोग', 'Stored water can be drawn in the dry months.', 'संचित जल सूखे महीनों में निकाला जा सकता है।'),
      ],
    }],
    quiz: [
      q('Who called dams the “temples of modern India”?', 'बाँधों को “आधुनिक भारत के मंदिर” किसने कहा?', [['Mahatma Gandhi', 'महात्मा गाँधी'], ['Jawaharlal Nehru', 'जवाहरलाल नेहरू'], ['Sardar Patel', 'सरदार पटेल'], ['B.R. Ambedkar', 'भीमराव अंबेडकर']], 1, 'He saw them as integrating agriculture with industry.', 'उन्होंने इन्हें कृषि और उद्योग को जोड़ने वाला माना।'),
      q('The Narmada Bachao Andolan opposed which dam?', 'नर्मदा बचाओ आंदोलन ने किस बाँध का विरोध किया?', [['Hirakud', 'हीराकुड'], ['Tehri', 'टिहरी'], ['Sardar Sarovar', 'सरदार सरोवर'], ['Bhakra Nangal', 'भाखड़ा नांगल']], 2, 'It focused on the displacement of people and the environment.', 'इसका केंद्र लोगों का विस्थापन और पर्यावरण था।'),
      q('Underground tanks called tankas are a tradition of', 'टाँका कहे जाने वाले भूमिगत टैंक कहाँ की परंपरा हैं?', [['Meghalaya', 'मेघालय'], ['Kerala', 'केरल'], ['Western Rajasthan', 'पश्चिमी राजस्थान'], ['Assam', 'असम']], 2, 'Especially in Bikaner, Phalodi and Barmer.', 'विशेषकर बीकानेर, फलोदी और बाड़मेर में।'),
      q('Which state first made rooftop rainwater harvesting structures compulsory for all houses?', 'किस राज्य ने सबसे पहले सभी घरों के लिए छत वर्षा जल संग्रहण अनिवार्य किया?', [['Tamil Nadu', 'तमिलनाडु'], ['Gujarat', 'गुजरात'], ['Punjab', 'पंजाब'], ['Bihar', 'बिहार']], 0, 'There are legal provisions to punish defaulters.', 'उल्लंघन करने वालों को दंडित करने के क़ानूनी प्रावधान हैं।'),
    ],
    note: b('The dam is a schematic of a multipurpose river project. Pins mark approximate dam sites.', 'बाँध बहुउद्देशीय नदी परियोजना का योजनाबद्ध मॉडल है। पिन बाँधों के अनुमानित स्थान दिखाते हैं।'),
  },
  {
    id: 'G4', unit: 'geography', no: 4, icon: 'Wheat', en: 'Agriculture', hi: 'कृषि',
    hook: b('Why does Punjab grow wheat, Assam grow tea and Kerala grow rubber?', 'पंजाब में गेहूँ, असम में चाय और केरल में रबड़ क्यों उगता है?'),
    scenes: [{
      t: b('Crop regions of India', 'भारत के फ़सल क्षेत्र'), kind: 'india', layers: [
        { en: 'Rice', hi: 'चावल', groups: [grp('Major rice-producing states', 'प्रमुख चावल उत्पादक राज्य', C.green, ['West Bengal', 'Uttar Pradesh', 'Andhra Pradesh', 'Punjab', 'Tamil Nadu', 'Bihar', 'Assam', 'Odisha', 'Chhattisgarh', 'Telangana', 'Kerala'])] },
        { en: 'Wheat', hi: 'गेहूँ', groups: [grp('Major wheat-producing states', 'प्रमुख गेहूँ उत्पादक राज्य', C.gold, ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar', 'Rajasthan'])] },
        { en: 'Tea and coffee', hi: 'चाय और कॉफ़ी', groups: [grp('Tea', 'चाय', C.teal, ['Assam', 'West Bengal', 'Tamil Nadu', 'Kerala']), grp('Coffee', 'कॉफ़ी', '#b08968', ['Karnataka'])], points: [pt(27.04, 88.26, 'Darjeeling hills', 'दार्जिलिंग पहाड़ियाँ', C.teal), pt(13.4, 75.7, 'Baba Budan Hills: coffee first grown', 'बाबा बूदन पहाड़ियाँ: कॉफ़ी की शुरुआत', C.orange)] },
        { en: 'Cotton and jute', hi: 'कपास और जूट', groups: [grp('Cotton', 'कपास', '#e5e7eb', ['Maharashtra', 'Gujarat', 'Madhya Pradesh', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Punjab', 'Haryana']), grp('Jute: the golden fibre', 'जूट: सुनहरा रेशा', C.gold, ['West Bengal', 'Bihar', 'Assam', 'Odisha', 'Meghalaya'])] },
        { en: 'Sugarcane and rubber', hi: 'गन्ना और रबड़', groups: [grp('Sugarcane', 'गन्ना', C.pink, ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Bihar', 'Punjab', 'Haryana']), grp('Rubber', 'रबड़', C.violet, ['Kerala', 'Andaman & Nicobar'])] },
      ],
    }],
    ideas: [
      idea('Types of farming', 'कृषि के प्रकार', 'Primitive subsistence (slash and burn), intensive subsistence (high labour, high inputs) and commercial farming including plantations.', 'प्रारंभिक जीविका निर्वाह (कर्तन-दहन), गहन जीविका (अधिक श्रम, अधिक निवेश) और वाणिज्यिक कृषि, जिसमें रोपण कृषि शामिल है।'),
      idea('Three cropping seasons', 'तीन फ़सल ऋतुएँ', 'Rabi (winter), kharif (monsoon) and zaid (short summer season between the two).', 'रबी (शीत), ख़रीफ़ (मानसून) और ज़ायद (दोनों के बीच की छोटी ग्रीष्म ऋतु)।'),
      idea('Crops need conditions', 'फ़सलों को चाहिए परिस्थितियाँ', 'Rice needs high temperature (above 25°C) and rainfall above 100 cm; wheat needs a cool growing season and bright sunshine at ripening.', 'चावल को उच्च तापमान (25°C से अधिक) और 100 सेमी से अधिक वर्षा चाहिए; गेहूँ को ठंडा वृद्धि काल और पकते समय तेज़ धूप।'),
      idea('Reforms', 'सुधार', 'Land reforms, the Green Revolution, the White Revolution (Operation Flood), minimum support prices and crop insurance supported farmers.', 'भूमि सुधार, हरित क्रांति, श्वेत क्रांति (ऑपरेशन फ़्लड), न्यूनतम समर्थन मूल्य और फ़सल बीमा ने किसानों को सहारा दिया।'),
    ],
    explore: [
      { t: b('The cropping calendar', 'फ़सल कैलेंडर'), kind: 'steps', steps: [
        step('Kharif: sown with the monsoon', 'ख़रीफ़: मानसून के साथ बुआई', 'Sown at the onset of the monsoon and harvested in September–October: paddy, maize, jowar, bajra, tur, moong, urad, cotton, jute, groundnut, soyabean.', 'मानसून के आगमन पर बोई और सितंबर–अक्टूबर में काटी जाती हैं: धान, मक्का, ज्वार, बाजरा, अरहर, मूँग, उड़द, कपास, जूट, मूँगफली, सोयाबीन।'),
        step('Rabi: sown in winter', 'रबी: शीत में बुआई', 'Sown from October to December and harvested from April to June: wheat, barley, peas, gram, mustard.', 'अक्टूबर से दिसंबर में बोई और अप्रैल से जून में काटी जाती हैं: गेहूँ, जौ, मटर, चना, सरसों।'),
        step('Zaid: the short summer season', 'ज़ायद: छोटी ग्रीष्म ऋतु', 'Between rabi and kharif: watermelon, muskmelon, cucumber, vegetables, fodder crops.', 'रबी और ख़रीफ़ के बीच: तरबूज़, खरबूज़ा, खीरा, सब्ज़ियाँ, चारे की फ़सलें।'),
      ] },
      { t: b('Farming systems', 'कृषि प्रणालियाँ'), kind: 'tree', root: node('Farming in India', 'भारत में कृषि', [
        node('Primitive subsistence', 'प्रारंभिक जीविका निर्वाह', [node('Jhumming, bewar, podu, kumari', 'झूम, बेवर, पोडु, कुमारी')], 'Small patches, primitive tools, family labour; depends on monsoon and natural soil fertility.', 'छोटे टुकड़े, आदिम औज़ार, पारिवारिक श्रम; मानसून और प्राकृतिक उर्वरता पर निर्भर।'),
        node('Intensive subsistence', 'गहन जीविका', [node('High population pressure on land', 'भूमि पर जनसंख्या का अधिक दबाव')], 'Labour-intensive farming with high doses of biochemical inputs and irrigation.', 'श्रम-गहन खेती जिसमें जैव-रासायनिक निवेश और सिंचाई अधिक होती है।'),
        node('Commercial', 'वाणिज्यिक', [node('Plantation: tea, coffee, rubber, sugarcane, banana', 'रोपण: चाय, कॉफ़ी, रबड़, गन्ना, केला')], 'Higher doses of modern inputs for high productivity; a single crop is grown on a large area in plantations.', 'उच्च उत्पादकता के लिए आधुनिक निवेश की अधिक मात्रा; रोपण में बड़े क्षेत्र पर एक ही फ़सल।'),
      ]) },
    ],
    quiz: [
      q('Slash and burn agriculture in north-eastern India is called', 'पूर्वोत्तर भारत में कर्तन-दहन कृषि को कहते हैं', [['Jhumming', 'झूम'], ['Zaid', 'ज़ायद'], ['Plantation', 'रोपण'], ['Horticulture', 'बाग़वानी']], 0, 'It has different local names across India.', 'भारत में इसके अलग-अलग स्थानीय नाम हैं।'),
      q('Which of these is a rabi crop?', 'इनमें से रबी फ़सल कौन-सी है?', [['Paddy', 'धान'], ['Cotton', 'कपास'], ['Wheat', 'गेहूँ'], ['Jute', 'जूट']], 2, 'Rabi crops are sown in winter and harvested in summer.', 'रबी फ़सलें शीत में बोई और ग्रीष्म में काटी जाती हैं।'),
      q('Which fibre is known as the golden fibre?', 'किस रेशे को सुनहरा रेशा कहते हैं?', [['Cotton', 'कपास'], ['Jute', 'जूट'], ['Silk', 'रेशम'], ['Hemp', 'सन']], 1, 'It grows well on well-drained fertile soils in flood plains.', 'यह बाढ़ के मैदानों की जल-निकास वाली उपजाऊ मृदा में अच्छा उगता है।'),
      q('India is the second largest producer of rice in the world after', 'भारत विश्व में चावल का दूसरा सबसे बड़ा उत्पादक है, किसके बाद?', [['USA', 'अमेरिका'], ['China', 'चीन'], ['Brazil', 'ब्राज़ील'], ['Thailand', 'थाईलैंड']], 1, 'Rice is the staple food crop of a majority of people in India.', 'चावल भारत के अधिकांश लोगों का मुख्य खाद्य है।'),
    ],
    note: b('Whole states are highlighted for the producing regions named in the NCERT chapter; crops are actually grown in parts of each state.', 'NCERT अध्याय में नामित उत्पादक क्षेत्रों के लिए पूरे राज्य उभारे गए हैं; फ़सलें वास्तव में राज्य के कुछ भागों में उगती हैं।'),
  },
  {
    id: 'G5', unit: 'geography', no: 5, icon: 'Pickaxe', en: 'Minerals and Energy Resources', hi: 'खनिज तथा ऊर्जा संसाधन',
    hook: b('A toothpaste tube, a phone and a pressure cooker all begin in a mine. Can we keep digging for ever?', 'टूथपेस्ट की ट्यूब, फ़ोन और प्रेशर कुकर, सबकी शुरुआत खान से होती है। क्या हम हमेशा खोदते रह सकते हैं?'),
    scenes: [{
      t: b('Mineral and energy map', 'खनिज और ऊर्जा मानचित्र'), kind: 'india', layers: [
        { en: 'Iron ore belts', hi: 'लौह अयस्क पेटियाँ', groups: [grp('Odisha–Jharkhand belt', 'ओडिशा–झारखंड पेटी', C.coral, ['Odisha', 'Jharkhand']), grp('Durg–Bastar–Chandrapur belt', 'दुर्ग–बस्तर–चंद्रपुर पेटी', C.orange, ['Chhattisgarh', 'Maharashtra']), grp('Ballari–Chitradurga–Chikkamagaluru–Tumakuru belt', 'बल्लारि–चित्रदुर्ग–चिक्कमगलूरु–तुमकूरु पेटी', C.gold, ['Karnataka']), grp('Maharashtra–Goa belt', 'महाराष्ट्र–गोवा पेटी', C.pink, ['Goa'])], points: [pt(18.6, 81.2, 'Bailadila', 'बैलाडीला', C.orange), pt(13.25, 75.25, 'Kudremukh', 'कुद्रेमुख', C.gold), pt(21.9, 86.2, 'Badampahar, Mayurbhanj', 'बादाम पहाड़, मयूरभंज', C.coral)] },
        { en: 'Coal', hi: 'कोयला', groups: [grp('Gondwana coal: Damodar, Godavari, Mahanadi, Son, Wardha valleys', 'गोंडवाना कोयला: दामोदर, गोदावरी, महानदी, सोन, वर्धा घाटियाँ', '#9ca3af', ['Jharkhand', 'West Bengal', 'Odisha', 'Chhattisgarh', 'Madhya Pradesh', 'Telangana']), grp('Tertiary coal', 'टरशियरी कोयला', C.violet, ['Meghalaya', 'Assam', 'Arunachal Pradesh', 'Nagaland'])], points: [pt(23.75, 86.42, 'Jharia', 'झरिया', C.gold), pt(23.62, 87.13, 'Raniganj', 'रानीगंज', C.gold, 0.4), pt(11.6, 79.5, 'Neyveli: lignite', 'नैवेली: लिग्नाइट', C.orange)] },
        { en: 'Petroleum', hi: 'पेट्रोलियम', groups: [grp('Oil-producing regions', 'तेल उत्पादक क्षेत्र', C.gold, ['Gujarat', 'Assam'])], points: [pt(19.4, 71.3, 'Mumbai High (offshore)', 'मुंबई हाई (अपतटीय)', C.coral), pt(21.62, 73.0, 'Ankeleshwar', 'अंकलेश्वर', C.gold), pt(27.39, 95.62, 'Digboi: oldest oil field', 'डिगबोई: सबसे पुराना तेल क्षेत्र', C.gold)] },
        { en: 'Nuclear and non-conventional', hi: 'परमाणु और गैर-परंपरागत', points: [pt(19.83, 72.65, 'Tarapur', 'तारापुर', C.violet), pt(24.87, 75.61, 'Rawatbhata', 'रावतभाटा', C.violet), pt(28.16, 78.4, 'Narora', 'नरौरा', C.violet), pt(21.24, 73.35, 'Kakrapar', 'काकरापार', C.violet, 0.4), pt(14.86, 74.44, 'Kaiga', 'कैगा', C.violet), pt(12.55, 80.17, 'Kalpakkam', 'कलपक्कम', C.violet), pt(8.18, 77.43, 'Nagercoil: wind farms', 'नागरकोइल: पवन फ़ार्म', C.teal), pt(26.9, 70.9, 'Jaisalmer: wind farms', 'जैसलमेर: पवन फ़ार्म', C.teal), pt(32.03, 77.35, 'Manikaran: geothermal', 'मणिकरण: भूतापीय', C.coral), pt(33.22, 78.32, 'Puga Valley: geothermal', 'पूगा घाटी: भूतापीय', C.coral, 0.4)] },
      ],
    }],
    ideas: [
      idea('Where minerals occur', 'खनिज कहाँ मिलते हैं', 'In veins and lodes of igneous and metamorphic rocks, in beds or layers of sedimentary rocks, as residual masses (bauxite), in placer deposits and in ocean waters.', 'आग्नेय और कायांतरित चट्टानों की शिराओं में, अवसादी चट्टानों की परतों में, अवशिष्ट पिंड (बॉक्साइट) के रूप में, प्लेसर निक्षेपों और महासागरीय जल में।'),
      idea('Ferrous and non-ferrous', 'लौह और अलौह', 'Iron ore and manganese support the steel industry; copper, bauxite, lead and gold are non-ferrous.', 'लौह अयस्क और मैंगनीज़ इस्पात उद्योग के आधार हैं; ताँबा, बॉक्साइट, सीसा और सोना अलौह हैं।'),
      idea('Conventional energy', 'परंपरागत ऊर्जा', 'Coal, petroleum, natural gas and electricity (thermal and hydel) meet most commercial energy needs.', 'कोयला, पेट्रोलियम, प्राकृतिक गैस और बिजली (ताप और जल) अधिकांश वाणिज्यिक ऊर्जा ज़रूरतें पूरी करते हैं।'),
      idea('Conserve and switch', 'संरक्षण और परिवर्तन', 'Minerals are finite and non-renewable. Solar, wind, tidal, geothermal and biogas reduce pressure on fossil fuels: “energy saved is energy produced”.', 'खनिज सीमित और अनवीकरणीय हैं। सौर, पवन, ज्वारीय, भूतापीय और बायोगैस जीवाश्म ईंधनों पर दबाव घटाते हैं: “ऊर्जा की बचत ही ऊर्जा का उत्पादन है”।'),
    ],
    explore: [{
      t: b('Classification of minerals', 'खनिजों का वर्गीकरण'), kind: 'tree', root: node('Minerals', 'खनिज', [
        node('Metallic', 'धात्विक', [node('Ferrous: iron ore, manganese, nickel, cobalt', 'लौह: लौह अयस्क, मैंगनीज़, निकल, कोबाल्ट'), node('Non-ferrous: copper, lead, tin, bauxite', 'अलौह: ताँबा, सीसा, टिन, बॉक्साइट'), node('Precious: gold, silver, platinum', 'बहुमूल्य: सोना, चाँदी, प्लैटिनम')], 'Metallic minerals contain metal.', 'धात्विक खनिजों में धातु होती है।'),
        node('Non-metallic', 'अधात्विक', [node('Mica, salt, potash, sulphur, limestone, marble, sandstone', 'अभ्रक, नमक, पोटाश, गंधक, चूना पत्थर, संगमरमर, बलुआ पत्थर')], 'Limestone is the basic raw material of the cement industry.', 'चूना पत्थर सीमेंट उद्योग का आधारभूत कच्चा माल है।'),
        node('Energy minerals', 'ऊर्जा खनिज', [node('Coal, petroleum, natural gas', 'कोयला, पेट्रोलियम, प्राकृतिक गैस')], 'Used to generate power.', 'शक्ति उत्पादन में प्रयुक्त।'),
      ]),
    }],
    quiz: [
      q('Khetri in Rajasthan is famous for', 'राजस्थान का खेतड़ी किसके लिए प्रसिद्ध है?', [['Copper', 'ताँबा'], ['Coal', 'कोयला'], ['Bauxite', 'बॉक्साइट'], ['Petroleum', 'पेट्रोलियम']], 0, 'The Khetri mines are a leading copper producer.', 'खेतड़ी की खानें ताँबे की प्रमुख उत्पादक हैं।'),
      q('Koderma in Jharkhand is a leading producer of', 'झारखंड का कोडरमा किसका अग्रणी उत्पादक है?', [['Iron ore', 'लौह अयस्क'], ['Mica', 'अभ्रक'], ['Gold', 'सोना'], ['Limestone', 'चूना पत्थर']], 1, 'In the Koderma–Gaya–Hazaribagh belt.', 'कोडरमा–गया–हज़ारीबाग़ पेटी में।'),
      q('Which is the oldest oil-producing area of India?', 'भारत का सबसे पुराना तेल उत्पादक क्षेत्र कौन-सा है?', [['Mumbai High', 'मुंबई हाई'], ['Ankeleshwar', 'अंकलेश्वर'], ['Assam (Digboi)', 'असम (डिगबोई)'], ['Krishna–Godavari basin', 'कृष्णा–गोदावरी बेसिन']], 2, 'Digboi, Naharkatiya and Moran–Hugrijan are its important fields.', 'डिगबोई, नहरकटिया और मोरान–हुगरीजन इसके प्रमुख क्षेत्र हैं।'),
      q('The Monazite sands of Kerala are rich in', 'केरल की मोनाज़ाइट रेत किसमें समृद्ध है?', [['Uranium', 'यूरेनियम'], ['Thorium', 'थोरियम'], ['Coal', 'कोयला'], ['Copper', 'ताँबा']], 1, 'Thorium is used to generate nuclear power.', 'थोरियम का उपयोग परमाणु ऊर्जा उत्पादन में होता है।'),
    ],
    note: b('Belts are shown by whole states and pins are approximate. Use the textbook map for exact map work.', 'पेटियाँ पूरे राज्यों से दिखाई हैं और पिन अनुमानित हैं। सटीक मानचित्र कार्य के लिए पाठ्यपुस्तक का मानचित्र देखें।'),
  },
  {
    id: 'G6', unit: 'geography', no: 6, icon: 'Cog', en: 'Manufacturing Industries', hi: 'विनिर्माण उद्योग',
    hook: b('Cotton leaves the farm at one price and returns as a shirt at twenty times that. Where is the value added?', 'कपास खेत से एक दाम पर निकलती है और क़मीज़ बनकर बीस गुना दाम पर लौटती है। मूल्य कहाँ जुड़ता है?'),
    scenes: [{
      t: b('Industrial India', 'औद्योगिक भारत'), kind: 'india', layers: [
        { en: 'Iron and steel plants', hi: 'लोहा और इस्पात संयंत्र', groups: [grp('Chotanagpur plateau region', 'छोटानागपुर पठार क्षेत्र', C.coral, ['Jharkhand', 'West Bengal', 'Odisha', 'Chhattisgarh'])], points: [pt(22.8, 86.2, 'Jamshedpur', 'जमशेदपुर', C.gold), pt(23.67, 86.15, 'Bokaro', 'बोकारो', C.gold, 0.5), pt(23.52, 87.31, 'Durgapur', 'दुर्गापुर', C.gold), pt(22.26, 84.85, 'Rourkela', 'राउरकेला', C.gold), pt(21.21, 81.38, 'Bhilai', 'भिलाई', C.gold), pt(17.69, 83.22, 'Vishakhapatnam', 'विशाखापट्टनम', C.gold), pt(15.18, 76.65, 'Vijaynagar', 'विजयनगर', C.gold), pt(13.85, 75.7, 'Bhadravati', 'भद्रावती', C.gold, 0.4), pt(11.66, 78.15, 'Salem', 'सेलम', C.gold)] },
        { en: 'Cotton textiles', hi: 'सूती वस्त्र', groups: [grp('Cotton-growing belt of Maharashtra and Gujarat', 'महाराष्ट्र और गुजरात की कपास पेटी', C.teal, ['Maharashtra', 'Gujarat'])], points: [pt(19.08, 72.88, 'Mumbai', 'मुंबई', C.teal), pt(23.03, 72.58, 'Ahmedabad', 'अहमदाबाद', C.teal), pt(21.17, 72.83, 'Surat', 'सूरत', C.teal, 0.4), pt(11.0, 76.96, 'Coimbatore', 'कोयंबटूर', C.teal), pt(26.45, 80.33, 'Kanpur', 'कानपुर', C.teal), pt(9.93, 78.12, 'Madurai', 'मदुरै', C.teal)] },
        { en: 'Software technology parks', hi: 'सॉफ़्टवेयर प्रौद्योगिकी पार्क', points: [pt(12.97, 77.59, 'Bengaluru: electronic capital', 'बेंगलुरु: इलेक्ट्रॉनिक राजधानी', C.sky), pt(17.39, 78.49, 'Hyderabad', 'हैदराबाद', C.sky), pt(18.52, 73.86, 'Pune', 'पुणे', C.sky), pt(13.08, 80.27, 'Chennai', 'चेन्नई', C.sky), pt(28.54, 77.39, 'Noida', 'नोएडा', C.sky), pt(22.57, 88.36, 'Kolkata', 'कोलकाता', C.sky), pt(8.52, 76.94, 'Thiruvananthapuram', 'तिरुवनंतपुरम', C.sky), pt(20.3, 85.82, 'Bhubaneshwar', 'भुवनेश्वर', C.sky), pt(30.7, 76.72, 'Mohali', 'मोहाली', C.sky)] },
      ],
    }],
    ideas: [
      idea('Why manufacturing matters', 'विनिर्माण क्यों महत्त्वपूर्ण', 'It modernises agriculture, reduces dependence on farm income, creates jobs, expands exports and adds value to raw materials.', 'यह कृषि को आधुनिक बनाता है, कृषि आय पर निर्भरता घटाता है, रोज़गार देता है, निर्यात बढ़ाता है और कच्चे माल में मूल्य जोड़ता है।'),
      idea('Where industries locate', 'उद्योग कहाँ लगते हैं', 'Raw material, labour, capital, power and market decide location; cities offer agglomeration economies.', 'कच्चा माल, श्रम, पूँजी, शक्ति और बाज़ार स्थान तय करते हैं; नगर समूहन बचत देते हैं।'),
      idea('Agro-based and mineral-based', 'कृषि-आधारित और खनिज-आधारित', 'Cotton, jute and sugar are agro-based; iron and steel, aluminium and cement are mineral-based. Steel is a basic industry.', 'कपास, जूट और चीनी कृषि-आधारित हैं; लोहा-इस्पात, एल्युमिनियम और सीमेंट खनिज-आधारित। इस्पात आधारभूत उद्योग है।'),
      idea('Pollution and its control', 'प्रदूषण और नियंत्रण', 'Industries cause air, water, thermal and noise pollution. Treating effluents, reusing water and fitting filters and scrubbers reduce the damage.', 'उद्योग वायु, जल, तापीय और ध्वनि प्रदूषण करते हैं। अपशिष्ट का शोधन, जल का पुनः उपयोग और फ़िल्टर व स्क्रबर हानि घटाते हैं।'),
    ],
    explore: [{
      t: b('Value addition in the textile industry', 'वस्त्र उद्योग में मूल्य संवर्धन'), kind: 'steps', steps: [
        step('Fibre production', 'रेशा उत्पादन', 'Raw fibre such as cotton comes from the farm.', 'कपास जैसा कच्चा रेशा खेत से आता है।'),
        step('Spinning', 'कताई', 'Spinning mills turn the fibre into yarn.', 'कताई मिलें रेशे से धागा बनाती हैं।'),
        step('Weaving', 'बुनाई', 'Handlooms, powerlooms and mills weave yarn into fabric.', 'हथकरघे, पावरलूम और मिलें धागे से कपड़ा बुनती हैं।'),
        step('Dyeing and finishing', 'रँगाई और परिष्करण', 'The fabric is dyed, printed and finished.', 'कपड़े को रँगा, छापा और तैयार किया जाता है।'),
        step('Garment manufacture', 'परिधान निर्माण', 'Fabric is designed and stitched into garments: each step adds value.', 'कपड़े को डिज़ाइन और सिलकर परिधान बनते हैं: हर चरण मूल्य जोड़ता है।'),
      ],
    }],
    quiz: [
      q('Which industry is called a basic industry?', 'किस उद्योग को आधारभूत उद्योग कहते हैं?', [['Sugar', 'चीनी'], ['Iron and steel', 'लोहा और इस्पात'], ['Jute', 'जूट'], ['Software', 'सॉफ़्टवेयर']], 1, 'All other industries depend on it for their machinery.', 'अन्य सभी उद्योग अपनी मशीनरी के लिए इस पर निर्भर हैं।'),
      q('Advantages offered by urban centres to industries are called', 'नगरीय केंद्रों से उद्योगों को मिलने वाले लाभ कहलाते हैं', [['Agglomeration economies', 'समूहन बचत'], ['Value addition', 'मूल्य संवर्धन'], ['Liberalisation', 'उदारीकरण'], ['Subsidies', 'अनुदान']], 0, 'Industries come together to share services such as banking and transport.', 'उद्योग बैंकिंग और परिवहन जैसी सेवाएँ साझा करने के लिए एक साथ आते हैं।'),
      q('Where was the first successful textile mill established in 1854?', '1854 में पहली सफल वस्त्र मिल कहाँ लगी?', [['Kolkata', 'कोलकाता'], ['Ahmedabad', 'अहमदाबाद'], ['Mumbai', 'मुंबई'], ['Kanpur', 'कानपुर']], 2, 'Raw cotton, port facilities and a moist climate helped.', 'कच्ची कपास, बंदरगाह सुविधा और नम जलवायु सहायक रहीं।'),
      q('Which city is known as the electronic capital of India?', 'किस नगर को भारत की इलेक्ट्रॉनिक राजधानी कहते हैं?', [['Pune', 'पुणे'], ['Bengaluru', 'बेंगलुरु'], ['Noida', 'नोएडा'], ['Chennai', 'चेन्नई']], 1, 'It is a major centre of the IT and electronics industry.', 'यह IT और इलेक्ट्रॉनिक उद्योग का प्रमुख केंद्र है।'),
    ],
    note: b('Pins show a selection of centres named in the NCERT chapter at approximate locations.', 'पिन NCERT अध्याय में नामित चुने हुए केंद्र अनुमानित स्थानों पर दिखाते हैं।'),
  },
  {
    id: 'G7', unit: 'geography', no: 7, icon: 'TrainFront', en: 'Lifelines of National Economy', hi: 'राष्ट्रीय अर्थव्यवस्था की जीवन रेखाएँ',
    hook: b('A mango from Ratnagiri can be in a Delhi market tomorrow. What makes that journey possible?', 'रत्नागिरी का आम कल दिल्ली के बाज़ार में हो सकता है। यह यात्रा कैसे संभव होती है?'),
    scenes: [{
      t: b('Transport networks', 'परिवहन जाल'), kind: 'india', layers: [
        { en: 'Golden Quadrilateral', hi: 'स्वर्णिम चतुर्भुज', points: [pt(28.61, 77.21, 'Delhi', 'दिल्ली'), pt(22.57, 88.36, 'Kolkata', 'कोलकाता'), pt(13.08, 80.27, 'Chennai', 'चेन्नई'), pt(19.08, 72.88, 'Mumbai', 'मुंबई')], routes: [route([[28.61, 77.21], [26.45, 80.33], [25.3, 83.0], [22.57, 88.36], [20.3, 85.82], [17.69, 83.22], [13.08, 80.27], [12.97, 77.59], [15.85, 74.5], [18.52, 73.86], [19.08, 72.88], [23.03, 72.58], [26.9, 75.8]], C.gold, { closed: true })] },
        { en: 'North–South and East–West corridors', hi: 'उत्तर–दक्षिण और पूर्व–पश्चिम गलियारे', points: [pt(34.08, 74.8, 'Srinagar', 'श्रीनगर', C.teal), pt(8.09, 77.54, 'Kanniyakumari', 'कन्याकुमारी', C.teal), pt(24.83, 92.78, 'Silchar', 'सिलचर', C.coral), pt(21.64, 69.61, 'Porbandar', 'पोरबंदर', C.coral)], routes: [route([[34.08, 74.8], [30.9, 75.85], [28.61, 77.21], [25.45, 78.57], [21.15, 79.09], [17.39, 78.49], [12.97, 77.59], [8.09, 77.54]], C.teal), route([[24.83, 92.78], [26.14, 91.74], [26.7, 88.4], [26.12, 85.4], [26.85, 80.95], [25.45, 78.57], [24.6, 73.7], [21.64, 69.61]], C.coral)] },
        { en: 'Major sea ports', hi: 'प्रमुख समुद्री पत्तन', points: [pt(23.03, 70.22, 'Kandla (Deendayal): tidal port', 'कांडला (दीनदयाल): ज्वारीय पत्तन', C.sky), pt(18.95, 72.84, 'Mumbai and Jawaharlal Nehru Port', 'मुंबई और जवाहरलाल नेहरू पत्तन', C.sky), pt(15.41, 73.8, 'Marmagao: iron ore export', 'मार्मागाओ: लौह अयस्क निर्यात', C.sky), pt(12.92, 74.81, 'New Mangalore', 'न्यू मंगलौर', C.sky), pt(9.97, 76.27, 'Kochchi: natural harbour', 'कोच्चि: प्राकृतिक पोताश्रय', C.sky), pt(8.76, 78.13, 'Tuticorin', 'तूतीकोरिन', C.teal), pt(13.1, 80.3, 'Chennai: oldest artificial port', 'चेन्नई: सबसे पुराना कृत्रिम पत्तन', C.teal), pt(17.69, 83.3, 'Vishakhapatnam: deepest landlocked port', 'विशाखापट्टनम: सबसे गहरा स्थल-रुद्ध पत्तन', C.teal), pt(20.26, 86.67, 'Paradwip', 'पारादीप', C.teal), pt(22.2, 88.2, 'Haldia and Kolkata: riverine port', 'हल्दिया और कोलकाता: नदीय पत्तन', C.teal)] },
        { en: 'Air links', hi: 'हवाई संपर्क', points: [pt(28.56, 77.1, 'Delhi', 'दिल्ली'), pt(19.09, 72.87, 'Mumbai', 'मुंबई'), pt(22.65, 88.45, 'Kolkata', 'कोलकाता'), pt(12.99, 80.17, 'Chennai', 'चेन्नई'), pt(13.2, 77.7, 'Bengaluru', 'बेंगलुरु'), pt(26.1, 91.59, 'Guwahati', 'गुवाहाटी')], routes: [route([[28.56, 77.1], [19.09, 72.87]], C.violet, { arc: true }), route([[28.56, 77.1], [22.65, 88.45]], C.violet, { arc: true }), route([[19.09, 72.87], [12.99, 80.17]], C.violet, { arc: true }), route([[22.65, 88.45], [26.1, 91.59]], C.violet, { arc: true }), route([[28.56, 77.1], [13.2, 77.7]], C.violet, { arc: true })] },
      ],
    }],
    ideas: [
      idea('Transport, communication, trade', 'परिवहन, संचार, व्यापार', 'They complement each other: goods and services move from supply locations to demand locations.', 'ये एक-दूसरे के पूरक हैं: वस्तुएँ और सेवाएँ आपूर्ति स्थल से माँग स्थल तक पहुँचती हैं।'),
      idea('Roads reach the doorstep', 'सड़कें घर तक पहुँचती हैं', 'Roads are cheaper to build than railways, cross difficult terrain and provide door-to-door service; they feed other modes.', 'सड़कें रेल से सस्ती बनती हैं, कठिन भू-भाग पार करती हैं और घर-घर सेवा देती हैं; ये अन्य साधनों की पूरक हैं।'),
      idea('Railways, pipelines, waterways', 'रेल, पाइपलाइन, जलमार्ग', 'Railways are the principal mode for freight and passengers; pipelines carry crude oil and gas; waterways are the cheapest for heavy, bulky goods.', 'रेल माल और यात्रियों का प्रमुख साधन है; पाइपलाइनें कच्चा तेल और गैस ले जाती हैं; भारी और स्थूल माल के लिए जलमार्ग सबसे सस्ते हैं।'),
      idea('Trade and tourism', 'व्यापार और पर्यटन', 'International trade is an economic barometer of a country; tourism earns foreign exchange and supports local handicrafts.', 'अंतरराष्ट्रीय व्यापार देश का आर्थिक बैरोमीटर है; पर्यटन विदेशी मुद्रा कमाता है और स्थानीय हस्तशिल्प को सहारा देता है।'),
    ],
    explore: [{
      t: b('Means of transport', 'परिवहन के साधन'), kind: 'tree', root: node('Means of transport', 'परिवहन के साधन', [
        node('Land', 'स्थल', [node('Roadways', 'सड़क मार्ग', null, 'National and State Highways, district roads, rural roads and border roads.', 'राष्ट्रीय और राज्य राजमार्ग, ज़िला सड़कें, ग्रामीण सड़कें और सीमांत सड़कें।'), node('Railways', 'रेल मार्ग', null, 'The principal mode of transport for freight and passengers.', 'माल और यात्रियों के परिवहन का प्रमुख साधन।'), node('Pipelines', 'पाइपलाइन', null, 'Carry crude oil, petroleum products and natural gas; low running costs.', 'कच्चा तेल, पेट्रोलियम उत्पाद और प्राकृतिक गैस ले जाती हैं; संचालन लागत कम।')]),
        node('Water', 'जल', [node('Inland waterways', 'आंतरिक जलमार्ग', null, 'National Waterway No. 1: the Ganga between Allahabad and Haldia.', 'राष्ट्रीय जलमार्ग संख्या 1: इलाहाबाद और हल्दिया के बीच गंगा।'), node('Overseas: sea ports', 'समुद्रपार: समुद्री पत्तन', null, 'Most of India’s foreign trade by volume moves by sea.', 'मात्रा के हिसाब से भारत का अधिकांश विदेशी व्यापार समुद्र से होता है।')]),
        node('Air', 'वायु', [node('Domestic', 'घरेलू', null, 'Fastest and most comfortable; reaches difficult terrain.', 'सबसे तेज़ और आरामदायक; कठिन भू-भाग तक पहुँच।'), node('International', 'अंतरराष्ट्रीय', null, 'Links India with the rest of the world.', 'भारत को शेष विश्व से जोड़ता है।')]),
      ]),
    }],
    quiz: [
      q('The Golden Quadrilateral links', 'स्वर्णिम चतुर्भुज किन्हें जोड़ता है?', [['Delhi, Kolkata, Chennai, Mumbai', 'दिल्ली, कोलकाता, चेन्नई, मुंबई'], ['Srinagar and Kanniyakumari', 'श्रीनगर और कन्याकुमारी'], ['Silchar and Porbandar', 'सिलचर और पोरबंदर'], ['All state capitals', 'सभी राज्य राजधानियाँ']], 0, 'It is a six-lane super highway project.', 'यह छह लेन वाली महा राजमार्ग परियोजना है।'),
      q('Which was the first port developed soon after Independence?', 'स्वतंत्रता के तुरंत बाद विकसित पहला पत्तन कौन-सा था?', [['Mumbai', 'मुंबई'], ['Kandla', 'कांडला'], ['Chennai', 'चेन्नई'], ['Paradwip', 'पारादीप']], 1, 'It eased the pressure on Mumbai after the loss of Karachi port.', 'कराची पत्तन के जाने के बाद इसने मुंबई पर दबाव घटाया।'),
      q('The East–West Corridor connects', 'पूर्व–पश्चिम गलियारा किन्हें जोड़ता है?', [['Silchar and Porbandar', 'सिलचर और पोरबंदर'], ['Delhi and Mumbai', 'दिल्ली और मुंबई'], ['Srinagar and Kanniyakumari', 'श्रीनगर और कन्याकुमारी'], ['Kolkata and Chennai', 'कोलकाता और चेन्नई']], 0, 'The North–South Corridor links Srinagar and Kanniyakumari.', 'उत्तर–दक्षिण गलियारा श्रीनगर और कन्याकुमारी को जोड़ता है।'),
      q('Which mode is the cheapest for carrying heavy and bulky goods?', 'भारी और स्थूल माल ढोने का सबसे सस्ता साधन कौन-सा है?', [['Airways', 'वायु मार्ग'], ['Roadways', 'सड़क मार्ग'], ['Waterways', 'जलमार्ग'], ['Pipelines', 'पाइपलाइन']], 2, 'It is fuel-efficient and environment-friendly.', 'यह ईंधन-कुशल और पर्यावरण-अनुकूल है।'),
    ],
    note: b('Routes are simplified lines between a few cities, not the surveyed alignment of the highways.', 'मार्ग कुछ नगरों के बीच सरल रेखाएँ हैं, राजमार्गों का सर्वेक्षित संरेखण नहीं।'),
  },
];
