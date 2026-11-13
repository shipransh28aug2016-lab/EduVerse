// Part 1 Theme 3D Diorama Builders (T01, T03, T05, T06, T07, T08).
export const PART1_BUILDERS = {
  // T01: Interconnected Valley Island (People, Place, Time, Resources, Institutions, Decisions)
  T01(tk, S) {
    const { group, mat, box, cyl, cone, sph, addTree, addHouse, addLabel, addPlinth, pick, animated } = tk;
    const shock = !!S.shock;
    addPlinth(shock ? 0xb59c5c : 0x5ca05b, 0x6b4e3d, 15.5, 10.5);
    // Granite hill plateau ridge
    const hill = cone(3.8, 3.3, 7, mat(shock ? 0x9b8259 : 0x4d8b55, { rough: 0.9 }), -4.3, -0.35, -2.0);
    group.add(hill);
    pick(hill, 'Place & Plateau Hills', 'स्थान व पठारी पहाड़ियाँ');
    // Winding river slab
    const river = box(14.8, 0.26, shock ? 0.8 : 1.75, mat(shock ? 0x60a5fa : 0x0284c7, { rough: 0.2, metal: 0.15 }), 0, -1.8, 0.8);
    group.add(river);
    pick(river, 'River & Water Resources', 'नदी व जल संसाधन');
    // Gram Sabha pavilion under sal/banyan tree
    const sabha = cyl(1.25, 1.35, 0.4, 8, mat(0xd4a373), -1.8, -1.68, -2.2);
    const roof = cone(1.5, 0.85, 8, mat(0x7b3fa0), -1.8, -0.5, -2.2);
    group.add(sabha, roof, cyl(0.1, 0.1, 1.0, 6, mat(0x8d6e63), -2.5, -1.1, -2.2), cyl(0.1, 0.1, 1.0, 6, mat(0x8d6e63), -1.1, -1.1, -2.2));
    pick(sabha, 'Institutions (Gram Sabha)', 'संस्थाएँ (ग्राम सभा)');
    addTree(-3.4, -1.85, -2.5, 1.15, 0x2e7d32);
    // Ancient stone torana arch (History)
    group.add(box(0.32, 1.8, 0.32, mat(0xb5651d), 2.3, -1.0, -2.4), box(0.32, 1.8, 0.32, mat(0xb5651d), 3.7, -1.0, -2.4), box(2.1, 0.32, 0.42, mat(0xc27046), 3.0, -0.05, -2.4));
    // Village homes & bazaar stalls (People & Economics)
    addHouse(4.6, -1.88, 2.3, 0xf3e0c2, 0xc0392b, 1.05);
    addHouse(2.7, -1.88, 2.6, 0xead5b4, 0xd97706, 0.95);
    addTree(5.4, -1.88, -1.5, 0.95, 0x388e3c);
    // Highlight beacon over focused node/lens
    const focusMap = {
      people: [4.6, 0.2, 2.3], place: [-4.3, 1.8, -2.0], time: [3.0, 1.1, -2.4],
      resources: [0, -0.4, 0.8], institutions: [-1.8, 0.7, -2.2], decisions: [0, 0.6, 0],
      varanasi: [0, 0.2, 0.8], leh: [-4.3, 1.8, -2.0], ranchi: [-2.2, 0.8, -1.8], chotanagpur: [-2.2, 0.8, -1.8], sundarbans: [4.6, 0.2, 2.3], bengaluru: [2.7, 0.2, 2.6],
    };
    const bp = focusMap[S.focus || S.place || 'decisions'] || [0, 0.6, 0];
    const beacon = sph(0.45, mat(0xffca28, { emissive: 0xffa000, emissiveIntensity: 0.85 }), bp[0], bp[1], bp[2]);
    group.add(beacon);
    animated.push({ fn: (t) => { beacon.position.y = bp[1] + Math.sin(t * 3.2) * 0.25; } });
    addLabel(new tk.THREE.Vector3(-4.3, 1.8, -2.0), 'Hills & Climate', 'पहाड़ व जलवायु');
    addLabel(new tk.THREE.Vector3(-1.8, 0.6, -2.2), 'Civic Sabha', 'नागरिक सभा');
    addLabel(new tk.THREE.Vector3(3.0, 0.7, -2.4), 'Heritage Arch', 'ऐतिहासिक द्वार');
    addLabel(new tk.THREE.Vector3(4.0, 0.0, 2.5), 'Market & Homes', 'बाज़ार व बस्ती');
  },

  // T03: Atmosphere Globe + Monsoon Watershed Valley
  T03(tk, S) {
    const { THREE, group, mat, box, cyl, cone, sph, addTree, addLabel, addPlinth, pick, animated } = tk;
    const isAtm = S.alt !== undefined;
    if (isAtm) {
      // Glowing Earth + concentric atmosphere shells + probe marker
      group.add(sph(2.2, mat(0x1f7a8c, { rough: 0.45 }), 0, -0.6, 0));
      group.add(sph(2.25, mat(0x4caf50, { rough: 0.8 }), 0.6, -0.4, 1.1));
      const shells = [
        [2.7, 0x38bdf8, 0.22, 'Troposphere', 'क्षोभमंडल'],
        [3.35, 0xa855f7, 0.16, 'Stratosphere (Ozone)', 'समतापमंडल (ओज़ोन)'],
        [4.0, 0xec4899, 0.12, 'Mesosphere', 'मध्यमंडल'],
      ];
      for (const [r, col, op, en, hi] of shells) {
        const sh = sph(r, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, wireframe: false, depthWrite: false }), 0, -0.6, 0);
        group.add(sh);
        pick(sh, en, hi);
      }
      const probeY = -0.6 + 2.25 + Math.min(2.3, (S.alt / 100) * 2.3);
      const probe = sph(0.28, mat(0xfbbf24, { emissive: 0xf59e0b, emissiveIntensity: 0.9 }), 0, probeY, 0);
      group.add(probe);
      addLabel(new THREE.Vector3(0, probeY + 0.5, 0), `Probe ${S.alt} km`, `जाँच यान ${S.alt} किमी`);
    } else {
      addPlinth(0x4f9153, 0x5d4436, 15.5, 10);
      const forestCount = Math.round(((S.forestPct ?? 45) / 100) * 14);
      const hill = cone(4.5, 3.0, 7, mat(0x528258), -4.2, -0.45, -1.2);
      group.add(hill);
      for (let i = 0; i < forestCount; i++) {
        addTree(-6.2 + (i % 5) * 1.15, -1.8 + (i < 5 ? 0.8 : 0.2), -2.8 + Math.floor(i / 5) * 1.8, 0.85);
      }
      // Dam & blue reservoir water level rising with checkDams & rain
      const dams = S.checkDams ?? 2;
      const waterH = 0.25 + Math.min(1.3, ((S.rainMm ?? 120) / 250) * 0.9);
      if (dams > 0) group.add(box(0.55, 1.35, 3.6, mat(0x78716c), 1.4, -1.25, 0.6));
      const pool = box(4.2, waterH, 3.4, mat(0x0284c7, { transparent: true, opacity: 0.8 }), -0.7, -1.9 + waterH / 2, 0.6);
      group.add(pool);
      pick(pool, 'Check-Dam Reservoir', 'चेक-डैम जलाशय');
      // Solar panels if S.solarPct > 0
      const solar = S.solarPct ?? 40;
      if (solar > 0) {
        const roof = box(2.4, 0.18, 1.6, mat(0x1d4ed8, { metal: 0.6, emissive: 0x1e3a8a, emissiveIntensity: 0.35 }), 4.6, -0.6, 1.6);
        roof.rotation.x = 0.35;
        group.add(box(2.6, 1.1, 2.0, mat(0xf4e4c1), 4.6, -1.35, 1.6), roof);
      }
      // Floating monsoon clouds
      const clouds = new THREE.Group();
      for (let i = 0; i < 3; i++) clouds.add(sph(0.75, mat(0xf8fafc), -4.5 + i * 0.9, 2.2 + (i % 2) * 0.25, -1.0));
      group.add(clouds);
      animated.push({ fn: (t) => { clouds.position.x = Math.sin(t * 0.7) * 1.4; } });
      addLabel(new THREE.Vector3(-4.2, 2.8, -1.0), 'Monsoon Clouds', 'मानसूनी बादल');
      addLabel(new tk.THREE.Vector3(1.4, -0.2, 0.6), 'Watershed Check-Dam', 'चेक-डैम जल संचयन');
    }
  },

  // T05: Living State & Society Courtyard (Vedic Sabha -> Mahajanapada -> Mauryan Pillar/Stupa -> Nalanda/Iron Pillar -> Chola Kudavolai + Shreni Trade + AI Fact-Check)
  T05(tk, S) {
    const { THREE, group, mat, box, cyl, cone, sph, addTree, addHouse, addLabel, addPlinth, pick, animated } = tk;
    const isVedic = S.era === 'earlyVedic';
    const isJan = S.era === 'janapada';
    const isChola = S.era === 'chola1000' || S.govMode === 'chola';
    const isSea = S.route === 'maritime';
    addPlinth(isChola ? 0xd9e8c8 : 0xd6be94, 0x7c5c43, 15.5, 10.5);

    // 1. Centerpiece Architecture adapting to Era / Tab
    if (isVedic) {
      // Sapta-Sindhu silver-blue river ribbon + Timber Sabha circular assembly + glowing Agni altar
      const river = box(15.2, 0.09, 2.2, mat(0x38bdf8, { rough: 0.25 }), 0, -1.86, -3.5);
      group.add(river);
      pick(river, 'Sapta-Sindhu River Valley', 'सप्त-सिंधु नदी घाटी');
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const post = cyl(0.18, 0.2, 1.8, 10, mat(0x8a5a2b), Math.cos(a) * 3.1 - 2.6, -1.0, Math.sin(a) * 2.7);
        group.add(post);
      }
      const altar = box(1.2, 0.4, 1.2, mat(0xb45309), -2.6, -1.7, 0);
      const flame = cone(0.42, 0.9, 10, mat(0xf97316, { emissive: 0xea580c, emissiveIntensity: 0.7 }), -2.6, -1.05, 0);
      group.add(altar, flame);
      pick(altar, 'Sabha & Samiti Assembly', 'सभा व समिति जन-सभा');
      animated.push({ fn: (t) => { flame.scale.y = 0.85 + Math.sin(t * 7) * 0.2; } });
      addLabel(new THREE.Vector3(-2.6, 0.4, 0), 'Sabha & Samiti', 'सभा व समिति');
    } else if (isJan) {
      // Fortified Mahajanapada Brick Gate + Vaishali Gana-Sangha Council Hall + Iron Smelter
      const gateL = box(1.3, 3.0, 1.4, mat(0xb45309), -4.5, -0.4, 0);
      const gateR = box(1.3, 3.0, 1.4, mat(0xb45309), -1.8, -0.4, 0);
      const lintel = box(4.4, 0.65, 1.5, mat(0x9a3412), -3.15, 1.25, 0);
      const council = cyl(2.1, 2.2, 0.45, 16, mat(0xd97706), 1.6, -1.68, -1.8);
      group.add(gateL, gateR, lintel, council);
      pick(lintel, 'Mahajanapada Fortified City', 'महाजनपद प्राचीर नगर');
      pick(council, 'Vaishali Gana-Sangha Assembly', 'वैशाली गणसंघ सभा');
      addLabel(new THREE.Vector3(-3.15, 2.1, 0), 'Mahajanapada Gate', 'महाजनपद द्वार');
      addLabel(new THREE.Vector3(1.6, -0.6, -1.8), 'Vajji Gana-Sangha', 'वज्जि गणसंघ');
    } else if (isChola) {
      // Chola Stone Temple Vimana + Irrigation Tank Sluice + Kudavolai Village Ballot Pot!
      const base = box(3.4, 1.4, 3.4, mat(0x94a3b8), -3.4, -1.2, -0.6);
      const tier1 = box(2.5, 1.1, 2.5, mat(0xa8a29e), -3.4, 0.05, -0.6);
      const tier2 = box(1.6, 0.9, 1.6, mat(0xd6d3d1), -3.4, 1.05, -0.6);
      const kalasha = cone(0.45, 0.85, 12, mat(0xeab308, { metal: 0.6 }), -3.4, 1.9, -0.6);
      const tank = box(4.2, 0.2, 2.8, mat(0x0284c7, { rough: 0.2 }), 2.2, -1.78, -2.5);
      const pot = cyl(0.55, 0.72, 1.1, 18, mat(0xc2410c, { metal: 0.25 }), 0.2, -1.35, 1.9);
      const palm = box(0.26, 0.6, 0.08, mat(0xfef08a), 0.2, -0.55, 1.9);
      group.add(base, tier1, tier2, kalasha, tank, pot, palm);
      pick(base, 'Uttaramerur Temple Inscription', 'उत्तरमेरूर मंदिर शिलालेख');
      pick(pot, 'Kudavolai Palm-Leaf Ballot Pot', 'कुदावोलई ताड़पत्र चुनाव घड़ा');
      pick(tank, 'Sabha Village Irrigation Tank', 'ग्राम सभा सिंचाई तालाब');
      animated.push({ fn: (t) => { palm.rotation.y = t * 1.4; } });
      addLabel(new THREE.Vector3(-3.4, 2.6, -0.6), 'Chola Inscription', 'चोल मंदिर अभिलेख');
      addLabel(new THREE.Vector3(0.2, 0.35, 1.9), 'Kudavolai Election Pot', 'कुदावोलई चुनाव घड़ा');
    } else {
      // Mauryan / Gupta Core: Sanchi Stupa + Stone Torana + Nalanda / Mehrauli Iron Pillar
      const drum = cyl(2.5, 2.6, 0.8, 24, mat(0xb86843), -3.4, -1.48, -0.5);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(2.25, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xc9885b));
      dome.position.set(-3.4, -1.1, -0.5);
      const harmika = box(0.88, 0.52, 0.88, mat(0xe6c38d), -3.4, 1.3, -0.5);
      const torL = box(0.28, 2.1, 0.28, mat(0xd9b07e), -1.1, -0.85, -0.1);
      const torR = box(0.28, 2.1, 0.28, mat(0xd9b07e), -1.1, -0.85, -0.9);
      const torTop = box(0.22, 0.26, 1.45, mat(0xd9b07e), -1.1, 0.25, -0.5);
      group.add(drum, dome, harmika, torL, torR, torTop);
      pick(dome, 'Ancient Brick Stupa & Torana', 'प्राचीन स्तूप व तोरण द्वार');
      addLabel(new THREE.Vector3(-3.4, 1.95, -0.5), 'Monument & Stupa', 'स्मारक व स्तूप');
    }

    // 2. Ashokan Sandstone Pillar OR Gupta Rust-Free Iron Pillar
    const ironMode = S.topic === 'metal';
    const shaft = cyl(ironMode ? 0.24 : 0.32, ironMode ? 0.28 : 0.44, 4.1, 18, mat(ironMode ? 0x334155 : 0xd9b07e, { rough: 0.3, metal: ironMode ? 0.8 : 0.18 }), 2.0, 0.15, -0.1);
    const cap = cyl(0.58, 0.4, 0.5, 14, mat(0xeab308, { metal: 0.5 }), 2.0, 2.35, -0.1);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.07, 8, 20), mat(0xfacc15, { metal: 0.6 }));
    wheel.position.set(2.0, 3.05, -0.1);
    group.add(shaft, cap, wheel);
    animated.push({ fn: (t) => { wheel.rotation.z = t * 0.5; } });
    pick(shaft, ironMode ? 'Mehrauli Rustless Iron Pillar' : 'Ashokan Edict Pillar', ironMode ? 'जंग-रहित महरौली लौह स्तंभ' : 'अशोक धम्म स्तंभ अभिलेख');
    addLabel(new THREE.Vector3(2.0, 3.7, -0.1), ironMode ? 'Gupta Iron Pillar' : 'Ashokan Edict Pillar', ironMode ? 'महरौली लौह स्तंभ' : 'शिलालेख स्तंभ');

    // 3. Knowledge / AI Audit Desk & Trade Guild / Saptanga Highway
    const isDebunked = S.claimId && S.checkEpigraphy && (S.checkChronology || S.checkMaterial);
    const desk = box(2.4, 0.48, 1.4, mat(0x9a7b56), 5.1, -1.65, 2.1);
    const scroll = box(1.4, 0.12, 0.65, mat(isDebunked ? 0x86efac : S.corroborate ? 0x93c5fd : 0xfff1c9), 5.1, -1.34, 2.1);
    group.add(desk, scroll);
    pick(desk, 'Palm-Leaf & Epigraphy Archive', 'ताड़पत्र व प्रमाण अभिलेखागार');
    addLabel(new THREE.Vector3(5.1, -0.65, 2.1), S.claimId ? 'Evidence Verification Desk' : 'Nalanda & IKS Archive', S.claimId ? 'प्रमाण सत्यापन मेज़' : 'नालंदा ज्ञान अभिलेख');

    // Highway + Shreni Guild Caravan / Maritime Dock
    const roadW = S.roadsInvest ? 0.8 + (S.roadsInvest / 100) * 1.4 : 1.1;
    const road = box(14.6, 0.08, roadW, mat(isSea ? 0x0284c7 : 0xa8916b), 0, -1.87, 3.5);
    group.add(road);
    if (S.shreniJoin || isSea || S.taxRate) {
      const taxAlert = (S.taxRate ?? 17) > 28;
      addHouse(-5.4, -1.85, 2.8, taxAlert ? 0xfca5a5 : 0xfde68a, taxAlert ? 0xb91c1c : 0x16a34a, 0.82, !taxAlert);
      const cart = box(1.3, 0.6, 0.8, mat(S.shreniJoin ? 0xd97706 : 0x64748b), 2.8, -1.52, 3.5);
      group.add(cart);
      if (isSea) {
        const sail = cone(0.65, 1.4, 4, mat(0xfef3c7), 2.8, -0.6, 3.5);
        group.add(sail);
      }
      pick(cart, S.shreniJoin ? 'Shreni Guild Caravan / Ship' : 'Uninsured Solo Trader', S.shreniJoin ? 'श्रेणी व्यापारी काफ़िला / जहाज़' : 'अकेला व्यापारी जोखिम');
      animated.push({ fn: (t) => { cart.position.x = 1.5 + Math.sin(t * 0.9) * 2.4; } });
    }
    addTree(-6.0, -1.85, -3.2, 1.0, 0x4b8f4c);
  },

  // T06: Circular Parliament & Gram Sabha Rotunda
  T06(tk, S) {
    const { THREE, group, mat, box, cyl, sph, addLabel, addPlinth, pick } = tk;
    addPlinth(0xdcc5a1, 0x6b5344, 15, 10.5);
    const support = S.support ?? 62;
    const fell = !!(S.vote && support < 51 && (S.system || 'parliamentary') === 'parliamentary');
    // Concentric sandstone colonnade pillars
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 1.4 - Math.PI * 0.7;
      const pil = cyl(0.24, 0.28, 3.2, 12, mat(0xd49b6a), Math.sin(a) * 6.0, -0.3, -Math.cos(a) * 4.5);
      group.add(pil);
    }
    // 20 MP / citizen seats lighting green (support) vs coral (opposition)
    const greenN = Math.round((support / 100) * 20);
    for (let i = 0; i < 20; i++) {
      const row = i < 10 ? 0 : 1;
      const idx = i % 10;
      const ang = -1.25 + (idx / 9) * 2.5;
      const rad = 2.6 + row * 1.3;
      const col = i < greenN ? 0x16a34a : 0xdc2626;
      const seat = box(0.68, 0.55 + row * 0.35, 0.62, mat(col), Math.sin(ang) * rad, -1.6 + row * 0.2, Math.cos(ang) * rad - 0.5);
      group.add(seat);
    }
    // Speaker & Executive center podium
    const pod = cyl(1.2, 1.3, 0.6, 16, mat(fell ? 0xdc2626 : 0x0284c7, { emissive: fell ? 0x991b1b : 0x0369a1, emissiveIntensity: 0.3 }), 0, -1.55, -2.0);
    group.add(pod);
    pick(pod, 'Parliamentary Chamber', 'संसद व लोकतांत्रिक सभा');
    addLabel(new THREE.Vector3(0, 0.2, -2.0), fell ? 'Lost Confidence' : `Majority ${support}%`, fell ? 'विश्वासमत खोया' : `बहुमत ${support}%`);
    addLabel(new THREE.Vector3(3.4, -0.4, 1.5), 'Elected Seats', 'निर्वाचित प्रतिनिधि');
  },

  // T07: 3D Constituency Hex Grid & Seat Parliament Towers
  T07(tk, S) {
    const { THREE, group, mat, box, cyl, addLabel, addPlinth, pick } = tk;
    addPlinth(0xdbe4ee, 0x475569, 15.5, 10);
    const cols = [0xdc2626, 0x2563eb, 0x16a34a, 0xd97706];
    const names = ['R', 'B', 'G', 'Y'];
    const swing = S.swing ?? 0;
    const blueBoost = Math.max(0, Math.round(swing / 4));
    for (let i = 0; i < 10; i++) {
      const r = Math.floor(i / 5), c = i % 5;
      const partyIdx = i < (3 + blueBoost) ? 1 : i < 7 ? 0 : i < 9 ? 2 : 3;
      const h = 1.1 + ((i * 7 + Math.abs(swing)) % 4) * 0.45;
      const hex = cyl(0.95, 1.0, h, 6, mat(cols[partyIdx]), -4.8 + c * 2.4, -1.9 + h / 2, -1.6 + r * 2.8);
      group.add(hex);
      pick(hex, `Constituency ${i + 1} (${names[partyIdx]})`, `क्षेत्र ${i + 1} (${names[partyIdx]})`);
    }
    addLabel(new THREE.Vector3(0, 1.4, -0.2), '10 Constituencies → Seat Towers', '10 निर्वाचन क्षेत्र → सीट स्तंभ');
  },

  // T08: Terraced Farm & Craft Resource Island (PPF / Scarcity / Safety Net)
  T08(tk, S) {
    const { THREE, group, mat, box, cyl, sph, addTree, addHouse, addLabel, addPlinth, pick } = tk;
    addPlinth(0x7ca965, 0x6b4e3d, 15.5, 10);
    const a = S.a ?? 5, b = S.b ?? 5;
    const wheatN = Math.max(1, Math.min(8, Math.round((a / 12) * 8)));
    const vegN = Math.max(1, Math.min(8, Math.round((b / 12) * 8)));
    for (let i = 0; i < wheatN; i++) {
      const plot = box(1.2, 0.5 + (i % 2) * 0.25, 1.6, mat(0xeab308), -5.6 + (i % 4) * 1.45, -1.6, -1.8 + Math.floor(i / 4) * 2.2);
      group.add(plot);
      pick(plot, 'Golden Wheat Plots', 'गेहूँ के खेत');
    }
    for (let i = 0; i < vegN; i++) {
      const plot = box(1.2, 0.45 + (i % 2) * 0.2, 1.6, mat(0x16a34a), 1.4 + (i % 4) * 1.45, -1.6, -1.8 + Math.floor(i / 4) * 2.2);
      group.add(plot);
      pick(plot, 'Vegetable Terraces', 'सब्ज़ी की खेती');
    }
    addHouse(0, -1.88, 2.7, 0xf2dfc2, 0xb8522d, 1.15, !!S.tech);
    if (S.tech) {
      const solar = box(1.8, 0.14, 1.1, mat(0x2563eb, { emissive: 0x1d4ed8, emissiveIntensity: 0.4 }), 0, -0.1, 2.7);
      solar.rotation.x = 0.35;
      group.add(solar);
    }
    addTree(-6.2, -1.85, 3.0, 1.0);
    addLabel(new THREE.Vector3(-3.4, 0.1, -0.7), 'Grain Production', 'अनाज उत्पादन');
    addLabel(new THREE.Vector3(3.6, 0.1, -0.7), 'Vegetable & Craft Choice', 'सब्ज़ी व शिल्प विकल्प');
  },

};
