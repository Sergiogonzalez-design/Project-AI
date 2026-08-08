import type { BodyPartId } from "../body-parts";
import { branch, conclusionNode, testNode } from "./node-helpers";
import type { ClinicalReasoningTree } from "./types";

/** Árbol tobillo / pie — esguince lateral, Aquiles, fascitis (evidencia Ottawa / MSK reviews). */
const ANKLE_FOOT_TREE: ClinicalReasoningTree = {
  bodyPart: "ankle_foot",
  title: "Razonamiento clínico — Tobillo / Pie",
  entryNodeId: "ankle_drawer",
  entryByTestId: {
    "anterior-drawer-ankle": "ankle_drawer",
    thompson: "ankle_thompson",
    windlass: "ankle_windlass",
    "heel-raise": "ankle_heel_raise",
    "slr-lasegue": "ankle_slr",
  },
  nodes: {
    ankle_drawer: testNode(
      "ankle_drawer",
      "anterior-drawer-ankle",
      branch("ankle_lat_sprain_high", "Laxitud / dolor ATFL"),
      branch("ankle_thompson", "Sin laxitud significativa")
    ),
    ankle_lat_sprain_high: conclusionNode(
      "ankle_lat_sprain_high",
      "Compatible con esguince lateral de tobillo",
      "Cajón anterior positivo con mecanismo de inversión sugiere lesión del complejo lateral, sobre todo ATFL.",
      [
        {
          name: "Esguince grado I–II del ligamento talofibular anterior (ATFL)",
          probability: "alta",
          rationale:
            "Laxitud anterior + dolor lateral + mecanismo típico (inversión).",
        },
        {
          name: "Esguince del ligamento calcaneofibular (CFL)",
          probability: "media",
          rationale: "Posible si inestabilidad persiste o dolor más distal/lateral.",
        },
        {
          name: "Contusión ósea / hematoma sin laxitud estructural",
          probability: "baja",
          rationale: "Menos probable si hay laxitud clara en cajón.",
        },
      ],
      { nextNodeId: "ankle_windlass" }
    ),
    ankle_thompson: testNode(
      "ankle_thompson",
      "thompson",
      branch("ankle_achilles_rupture", "Sin flexión plantar"),
      branch("ankle_heel_raise", "Flexión plantar conservada")
    ),
    ankle_achilles_rupture: conclusionNode(
      "ankle_achilles_rupture",
      "Sospecha alta de rotura del tendón de Aquiles",
      "Thompson positivo: ausencia de flexión plantar al comprimir gemelo.",
      [
        {
          name: "Rotura completa del tendón de Aquiles",
          probability: "alta",
          rationale: "Test de Thompson con alta sensibilidad en rotura completa.",
        },
        {
          name: "Rotura parcial / tendinopatía aguda grave",
          probability: "media",
          rationale: "Valorar hueco palpable, ecografía/RM si duda.",
        },
      ]
    ),
    ankle_heel_raise: testNode(
      "ankle_heel_raise",
      "heel-raise",
      branch("ankle_achilles_tendinopathy", "Dolor / déficit monopodal"),
      branch("ankle_windlass", "Simétrico y sin dolor")
    ),
    ankle_achilles_tendinopathy: conclusionNode(
      "ankle_achilles_tendinopathy",
      "Patología del tendón de Aquiles / tríceps sural",
      "Déficit o dolor en elevación de talones sugiere afectación tendinosa o muscular posterior.",
      [
        {
          name: "Tendinopatía aquílea (insercional o media)",
          probability: "alta",
          rationale: "Dolor en carga excéntrica/concéntrica de gemelo-Aquiles.",
        },
        {
          name: "Rotura parcial no detectada en Thompson",
          probability: "media",
          rationale: "Considerar ecografía si dolor intenso y déficit funcional.",
        },
      ],
      { nextNodeId: "ankle_windlass" }
    ),
    ankle_windlass: testNode(
      "ankle_windlass",
      "windlass",
      branch("ankle_plantar_fasciitis", "Dolor arco / fascial"),
      branch("ankle_hop", "Sin dolor fascial")
    ),
    ankle_plantar_fasciitis: conclusionNode(
      "ankle_plantar_fasciitis",
      "Compatible con fascitis plantar / patología del arco",
      "Windlass positivo reproduce dolor en fascia plantar o inserción calcaneal anterior.",
      [
        {
          name: "Fascitis plantar",
          probability: "alta",
          rationale: "Dolor con tensión del windlass + dolor matutino típico.",
        },
        {
          name: "Neuroma / metatarsalgia",
          probability: "baja",
          rationale: "Si dolor más distal en antepié, reconsiderar.",
        },
      ],
      { nextNodeId: "ankle_hop" }
    ),
    ankle_hop: testNode(
      "ankle_hop",
      "hop-test",
      branch("ankle_functional_instability", "Dolor / inestabilidad"),
      branch("ankle_mild_contusion", "Buen control")
    ),
    ankle_functional_instability: conclusionNode(
      "ankle_functional_instability",
      "Inestabilidad funcional residual",
      "Hop test positivo por dolor o sensación de ceder tras esguince.",
      [
        {
          name: "Inestabilidad crónica funcional post-esguince",
          probability: "alta",
          rationale: "Déficit de control en carga dinámica.",
        },
        {
          name: "Irritación de sindesmosis (tibio-peronea)",
          probability: "media",
          rationale: "Valorar dolor anterior, squeeze test, cajón en dorsiflexión.",
        },
      ]
    ),
    ankle_mild_contusion: conclusionNode(
      "ankle_mild_contusion",
      "Cuadro leve / contusión sin signos estructurales mayores",
      "Pruebas especiales negativas y buena tolerancia funcional.",
      [
        {
          name: "Contusión de tejidos blandos",
          probability: "alta",
          rationale: "Mecanismo traumático sin laxitud ni déficit Aquiles.",
        },
        {
          name: "Esguince grado I sin laxitud en exploración",
          probability: "media",
          rationale: "Posible microlesión ligamentosa.",
        },
      ]
    ),
    ankle_slr: testNode(
      "ankle_slr",
      "slr-lasegue",
      branch("ankle_radicular", "Dolor radicular"),
      branch("ankle_drawer", "Sin irradiación")
    ),
    ankle_radicular: conclusionNode(
      "ankle_radicular",
      "Dolor referido / radicular desde columna",
      "SLR positivo sugiere origen lumbar más que lesión aislada de tobillo.",
      [
        {
          name: "Irritación radicular L5–S1",
          probability: "alta",
          rationale: "Dolor ciático con SLR positivo.",
        },
        {
          name: "Patología de tobillo coexistente",
          probability: "media",
          rationale: "Puede coexistir; priorizar screening neurológico.",
        },
      ]
    ),
  },
};

/** Árbol rodilla — LCA, menisco (Lachman, McMurray, Thessaly). */
const KNEE_TREE: ClinicalReasoningTree = {
  bodyPart: "knee",
  title: "Razonamiento clínico — Rodilla",
  entryNodeId: "knee_lachman",
  entryByTestId: {
    lachman: "knee_lachman",
    "anterior-drawer-knee": "knee_drawer",
    mcmurray: "knee_mcmurray",
    thessaly: "knee_thessaly",
    "pivot-shift": "knee_pivot",
  },
  nodes: {
    knee_lachman: testNode(
      "knee_lachman",
      "lachman",
      branch("knee_acl_high", "Traslación anterior aumentada"),
      branch("knee_mcmurray", "Sin traslación significativa")
    ),
    knee_acl_high: conclusionNode(
      "knee_acl_high",
      "Sospecha de lesión del ligamento cruzado anterior (LCA)",
      "Lachman positivo con sensación de tope blando o aumento de traslación.",
      [
        {
          name: "Lesión del LCA (parcial o completa)",
          probability: "alta",
          rationale: "Lachman es la maniobra más sensible en fase subaguda.",
        },
        {
          name: "Lesión meniscal asociada",
          probability: "media",
          rationale: "Frecuente combinación en mecanismos de rotación.",
        },
      ],
      { nextNodeId: "knee_pivot" }
    ),
    knee_drawer: testNode(
      "knee_drawer",
      "anterior-drawer-knee",
      branch("knee_acl_high", "Cajón positivo"),
      branch("knee_mcmurray", "Cajón negativo")
    ),
    knee_pivot: testNode(
      "knee_pivot",
      "pivot-shift",
      branch("knee_acl_instability", "Pivot positivo"),
      branch("knee_mcmurray", "Pivot negativo / no valorable")
    ),
    knee_acl_instability: conclusionNode(
      "knee_acl_instability",
      "Inestabilidad rotatoria por LCA",
      "Pivot shift positivo aumenta especificidad de lesión LCA.",
      [
        {
          name: "Ruptura completa de LCA con inestabilidad rotatoria",
          probability: "alta",
          rationale: "Pivot positivo + Lachman positivo.",
        },
      ]
    ),
    knee_mcmurray: testNode(
      "knee_mcmurray",
      "mcmurray",
      branch("knee_meniscus", "Chasquido/dolor meniscal"),
      branch("knee_thessaly", "McMurray negativo")
    ),
    knee_meniscus: conclusionNode(
      "knee_meniscus",
      "Sospecha de lesión meniscal",
      "McMurray positivo con dolor/chasquido en compartimento.",
      [
        {
          name: "Lesión meniscal (medial o lateral)",
          probability: "alta",
          rationale: "Mecanismo de torsión + bloqueo/derrame + test positivo.",
        },
        {
          name: "Condropatía / sinovitis",
          probability: "media",
          rationale: "Si dolor difuso sin bloqueo mecánico.",
        },
      ]
    ),
    knee_thessaly: testNode(
      "knee_thessaly",
      "thessaly",
      branch("knee_meniscus", "Dolor en carga rotacional"),
      branch("knee_patellofemoral", "Thessaly negativo")
    ),
    knee_patellofemoral: conclusionNode(
      "knee_patellofemoral",
      "Cuadro compatible con patología patelofemoral / leve",
      "Tests estructurales negativos; valorar dolor anterior, escaleras, sentadilla.",
      [
        {
          name: "Síndrome patelofemoral / tendinopatía rotuliana",
          probability: "alta",
          rationale: "Dolor anterior sin signos meniscales/LCA.",
        },
        {
          name: "Contusión / esguince grado I colateral",
          probability: "media",
          rationale: "Trauma directo sin inestabilidad.",
        },
      ]
    ),
  },
};

/** Árbol hombro — manguito, inestabilidad, subacromial. */
const SHOULDER_TREE: ClinicalReasoningTree = {
  bodyPart: "shoulder",
  title: "Razonamiento clínico — Hombro",
  entryNodeId: "sh_neer",
  entryByTestId: {
    neer: "sh_neer",
    "hawkins-kennedy": "sh_hawkins",
    "jobe-empty-can": "sh_jobe",
    apprehension: "sh_apprehension",
    "drop-arm": "sh_drop_arm",
    "painful-arc": "sh_painful_arc",
  },
  nodes: {
    sh_neer: testNode(
      "sh_neer",
      "neer",
      branch("sh_impingement", "Dolor subacromial"),
      branch("sh_hawkins", "Neer negativo")
    ),
    sh_impingement: conclusionNode(
      "sh_impingement",
      "Conflicto subacromial / pinzamiento",
      "Neer positivo reproduce dolor en arco terminal.",
      [
        {
          name: "Síndrome de pinzamiento subacromial",
          probability: "alta",
          rationale: "Neer + arco doloroso frecuentes.",
        },
        {
          name: "Tendinopatía del manguito rotador",
          probability: "alta",
          rationale: "A menudo coexisten.",
        },
      ],
      { nextNodeId: "sh_jobe" }
    ),
    sh_hawkins: testNode(
      "sh_hawkins",
      "hawkins-kennedy",
      branch("sh_impingement", "Hawkins positivo"),
      branch("sh_apprehension", "Hawkins negativo")
    ),
    sh_jobe: testNode(
      "sh_jobe",
      "jobe-empty-can",
      branch("sh_supraspinatus", "Debilidad/dolor supraespinoso"),
      branch("sh_drop_arm", "Jobe negativo")
    ),
    sh_supraspinatus: conclusionNode(
      "sh_supraspinatus",
      "Afectación del supraespinoso",
      "Jobe positivo orienta a tendinopatía o rotura parcial.",
      [
        {
          name: "Tendinopatía del supraespinoso",
          probability: "alta",
          rationale: "Debilidad/dolor en empty can.",
        },
        {
          name: "Rotura parcial del manguito",
          probability: "media",
          rationale: "Valorar drop arm y RM si déficit importante.",
        },
      ]
    ),
    sh_drop_arm: testNode(
      "sh_drop_arm",
      "drop-arm",
      branch("sh_cuff_tear", "Caída del brazo"),
      branch("sh_apprehension", "Descenso controlado")
    ),
    sh_cuff_tear: conclusionNode(
      "sh_cuff_tear",
      "Posible rotura importante del manguito",
      "Drop arm positivo sugiere rotura sustancial.",
      [
        {
          name: "Rotura completa o casi completa del supraespinoso",
          probability: "alta",
          rationale: "Incapacidad para controlar descenso.",
        },
      ]
    ),
    sh_apprehension: testNode(
      "sh_apprehension",
      "apprehension",
      branch("sh_instability", "Aprensión / inestabilidad"),
      branch("sh_painful_arc", "Sin aprensión")
    ),
    sh_instability: conclusionNode(
      "sh_instability",
      "Inestabilidad glenohumeral anterior",
      "Apprehension positivo con mecanismo abducción-RE.",
      [
        {
          name: "Inestabilidad anterior / lesión de Bankart",
          probability: "alta",
          rationale: "Apprehension + relocation positivo.",
        },
        {
          name: "SLAP / inestabilidad multidireccional",
          probability: "media",
          rationale: "Valorar deportes de lanzamiento y tests adicionales.",
        },
      ]
    ),
    sh_painful_arc: testNode(
      "sh_painful_arc",
      "painful-arc",
      branch("sh_impingement", "Arco 60–120° doloroso"),
      branch("sh_referred_neck", "Sin arco típico")
    ),
    sh_referred_neck: conclusionNode(
      "sh_referred_neck",
      "Dolor de hombro sin patrón mecánico claro",
      "Considerar origen cervical referido o patología leve.",
      [
        {
          name: "Dolor referido cervical (C4–C6)",
          probability: "media",
          rationale: "Explorar Spurling si irradiación.",
        },
        {
          name: "Tendinopatía leve / sobrecarga",
          probability: "media",
          rationale: "Sin signos de inestabilidad ni rotura.",
        },
      ]
    ),
  },
};

/** Árbol codo — epicondilitis lateral/medial. */
const ELBOW_TREE: ClinicalReasoningTree = {
  bodyPart: "elbow",
  title: "Razonamiento clínico — Codo",
  entryNodeId: "el_cozen",
  entryByTestId: {
    cozen: "el_cozen",
    mill: "el_mill",
    speed: "el_speed",
    yergason: "el_yergason",
  },
  nodes: {
    el_cozen: testNode(
      "el_cozen",
      "cozen",
      branch("el_lateral_epicondylitis", "Dolor epicóndilo lateral"),
      branch("el_mill", "Cozen negativo")
    ),
    el_lateral_epicondylitis: conclusionNode(
      "el_lateral_epicondylitis",
      "Epicondilitis lateral (codo de tenista)",
      "Cozen positivo reproduce dolor en epicóndilo lateral.",
      [
        {
          name: "Epicondilitis lateral / tendinopatía extensora común",
          probability: "alta",
          rationale: "Resistencia extensión muñeca con codo extendido.",
        },
      ],
      { nextNodeId: "el_mill" }
    ),
    el_mill: testNode(
      "el_mill",
      "mill",
      branch("el_lateral_epicondylitis", "Mill positivo"),
      branch("el_yergason", "Mill negativo")
    ),
    el_yergason: testNode(
      "el_yergason",
      "yergason",
      branch("el_bicipital", "Dolor surco bicipital"),
      branch("el_speed", "Yergason negativo")
    ),
    el_bicipital: conclusionNode(
      "el_bicipital",
      "Tendinopatía / inestabilidad bicipital",
      "Yergason positivo en surco bicipital radial.",
      [
        {
          name: "Tendinopatía del bíceps distal o inestabilidad bicipital",
          probability: "alta",
          rationale: "Dolor en surco con supinación resistida.",
        },
      ]
    ),
    el_speed: testNode(
      "el_speed",
      "speed",
      branch("el_distal_biceps", "Dolor inserción bíceps"),
      branch("el_nonspecific", "Speed negativo")
    ),
    el_distal_biceps: conclusionNode(
      "el_distal_biceps",
      "Afectación del tendón bicipital distal",
      "Speed positivo con dolor anterior distal.",
      [
        {
          name: "Tendinopatía del bíceps braquial distal",
          probability: "alta",
          rationale: "Resistencia flexión-supinación.",
        },
      ]
    ),
    el_nonspecific: conclusionNode(
      "el_nonspecific",
      "Dolor de codo sin patrón epicondílico claro",
      "Tests específicos negativos.",
      [
        {
          name: "Contusión / sinovitis / olecranitis",
          probability: "media",
          rationale: "Trauma directo o sobrecarga.",
        },
        {
          name: "Neuropatía cubital en canal",
          probability: "baja",
          rationale: "Valorar parestesias 4.º–5.º dedo.",
        },
      ]
    ),
  },
};

/** Árbol muñeca/mano — túnel carpiano. */
const WRIST_HAND_TREE: ClinicalReasoningTree = {
  bodyPart: "wrist_hand",
  title: "Razonamiento clínico — Muñeca / Mano",
  entryNodeId: "wh_phalen",
  entryByTestId: {
    phalen: "wh_phalen",
    tinel: "wh_tinel",
    ultt: "wh_ultt",
  },
  nodes: {
    wh_phalen: testNode(
      "wh_phalen",
      "phalen",
      branch("wh_carpal_tunnel", "Parestesias mediano"),
      branch("wh_tinel", "Phalen negativo")
    ),
    wh_carpal_tunnel: conclusionNode(
      "wh_carpal_tunnel",
      "Síndrome del túnel carpiano",
      "Phalen positivo reproduce parestesias en territorio mediano.",
      [
        {
          name: "Síndrome del túnel carpiano",
          probability: "alta",
          rationale: "Flexión sostenida muñeca + síntomas nocturnos típicos.",
        },
      ],
      { nextNodeId: "wh_tinel" }
    ),
    wh_tinel: testNode(
      "wh_tinel",
      "tinel",
      branch("wh_carpal_tunnel", "Tinel positivo"),
      branch("wh_ultt", "Tinel negativo")
    ),
    wh_ultt: testNode(
      "wh_ultt",
      "ultt",
      branch("wh_neural_irritation", "Tensión neural positiva"),
      branch("wh_wrist_strain", "ULTT negativo")
    ),
    wh_neural_irritation: conclusionNode(
      "wh_neural_irritation",
      "Irritación del nervio mediano / cadena neural",
      "ULTT positivo sugiere componente neurodinámico.",
      [
        {
          name: "Neuropatía del mediano proximal",
          probability: "alta",
          rationale: "Tensión neural reproduce síntomas.",
        },
        {
          name: "Radiculopatía cervical C6–C7",
          probability: "media",
          rationale: "Valorar Spurling si dolor cervical asociado.",
        },
      ]
    ),
    wh_wrist_strain: conclusionNode(
      "wh_wrist_strain",
      "Patología mecánica de muñeca sin neuropatía clara",
      "Tests neuro negativos.",
      [
        {
          name: "Esguince / distensión de muñeca",
          probability: "alta",
          rationale: "Trauma en flexión/extensión.",
        },
        {
          name: "Tendinopatía de extensores/flexores",
          probability: "media",
          rationale: "Sobrecarga repetitiva.",
        },
      ]
    ),
  },
};

/** Árbol dedos — usa Tinel/Phalen si irradiación; foco en STC vs pulgar. */
const FINGER_TREE: ClinicalReasoningTree = {
  bodyPart: "finger",
  title: "Razonamiento clínico — Dedos",
  entryNodeId: "fg_tinel",
  entryByTestId: {
    tinel: "fg_tinel",
    phalen: "fg_phalen",
  },
  nodes: {
    fg_tinel: testNode(
      "fg_tinel",
      "tinel",
      branch("fg_carpal_tunnel", "Parestesias en dedos mediano"),
      branch("fg_phalen", "Sin parestesias")
    ),
    fg_carpal_tunnel: conclusionNode(
      "fg_carpal_tunnel",
      "Síntomas digitales por compresión mediana",
      "Tinel positivo con afectación 1.º–3.º dedo sugiere STC.",
      [
        {
          name: "Síndrome del túnel carpiano",
          probability: "alta",
          rationale: "Parestesias en territorio mediano.",
        },
      ]
    ),
    fg_phalen: testNode(
      "fg_phalen",
      "phalen",
      branch("fg_carpal_tunnel", "Phalen positivo"),
      branch("fg_pulley", "Phalen negativo")
    ),
    fg_pulley: conclusionNode(
      "fg_pulley",
      "Patología digital local",
      "Sin neuropatía mediana; valorar mecanismo de agarre.",
      [
        {
          name: "Lesión de pulgar (trigger finger / tenosinovitis A1)",
          probability: "alta",
          rationale: "Chasquido, bloqueo en flexión dedo.",
        },
        {
          name: "Esguince interfalángico",
          probability: "media",
          rationale: "Trauma directo en deporte.",
        },
        {
          name: "Fractura/lesión ligamentosa (Gamekeeper)",
          probability: "baja",
          rationale: "Inestabilidad UCL pulgar si mecanismo abducción.",
        },
      ]
    ),
  },
};

/** Árbol cuello — radiculopatía cervical. */
const NECK_TREE: ClinicalReasoningTree = {
  bodyPart: "neck",
  title: "Razonamiento clínico — Cuello",
  entryNodeId: "nk_spurling",
  entryByTestId: {
    spurling: "nk_spurling",
    ultt: "nk_ultt",
  },
  nodes: {
    nk_spurling: testNode(
      "nk_spurling",
      "spurling",
      branch("nk_radiculopathy", "Dolor/irradiación radicular"),
      branch("nk_ultt", "Spurling negativo")
    ),
    nk_radiculopathy: conclusionNode(
      "nk_radiculopathy",
      "Radiculopatía cervical",
      "Spurling positivo aumenta probabilidad de origen radicular.",
      [
        {
          name: "Radiculopatía cervical (C5–C7)",
          probability: "alta",
          rationale: "Compresión foraminal reproducible.",
        },
        {
          name: "Hernia discal cervical",
          probability: "media",
          rationale: "Si déficit motor/sensitivo asociado.",
        },
      ]
    ),
    nk_ultt: testNode(
      "nk_ultt",
      "ultt",
      branch("nk_neural_tension", "Tensión neural positiva"),
      branch("nk_mechanical", "ULTT negativo")
    ),
    nk_neural_tension: conclusionNode(
      "nk_neural_tension",
      "Componente de tensión neural",
      "ULTT positivo con síntomas en miembro superior.",
      [
        {
          name: "Neuropatía periférica / irritación mediano",
          probability: "alta",
          rationale: "Síntomas distales con tensión neural.",
        },
      ]
    ),
    nk_mechanical: conclusionNode(
      "nk_mechanical",
      "Dolor cervical mecánico inespecífico",
      "Tests radiculares negativos.",
      [
        {
          name: "Cervicalgia mecánica / contractura",
          probability: "alta",
          rationale: "Dolor local sin signos radiculares.",
        },
        {
          name: "Artrosis facetaria cervical",
          probability: "media",
          rationale: "Dolor con rotación/extensión repetida.",
        },
      ]
    ),
  },
};

/** Árbol espalda — radicular vs facetario. */
const BACK_TREE: ClinicalReasoningTree = {
  bodyPart: "back",
  title: "Razonamiento clínico — Espalda",
  entryNodeId: "bk_slr",
  entryByTestId: {
    "slr-lasegue": "bk_slr",
    kemp: "bk_kemp",
    schober: "bk_schober",
  },
  nodes: {
    bk_slr: testNode(
      "bk_slr",
      "slr-lasegue",
      branch("bk_radiculopathy", "Dolor radicular <60°"),
      branch("bk_kemp", "SLR negativo")
    ),
    bk_radiculopathy: conclusionNode(
      "bk_radiculopathy",
      "Ciática / radiculopatía lumbar",
      "SLR positivo sugiere irritación nerviosa L4–S1.",
      [
        {
          name: "Radiculopatía lumbar / ciática",
          probability: "alta",
          rationale: "Dolor ciático con SLR positivo.",
        },
        {
          name: "Hernia discal lumbar",
          probability: "media",
          rationale: "Si déficit neurológico o cruzado positivo.",
        },
      ]
    ),
    bk_kemp: testNode(
      "bk_kemp",
      "kemp",
      branch("bk_facet", "Dolor facetario"),
      branch("bk_schober", "Kemp negativo")
    ),
    bk_facet: conclusionNode(
      "bk_facet",
      "Dolor facetario / artrosis segmentaria",
      "Kemp positivo reproduce dolor lumbar en extensión-rotación.",
      [
        {
          name: "Síndrome facetario lumbar",
          probability: "alta",
          rationale: "Dolor con extensión y cuadrante.",
        },
      ]
    ),
    bk_schober: testNode(
      "bk_schober",
      "schober",
      branch("bk_inflammatory", "Limitación flexión"),
      branch("bk_nonspecific", "Schober normal")
    ),
    bk_inflammatory: conclusionNode(
      "bk_inflammatory",
      "Rigidez lumbar significativa",
      "Schober reducido sugiere limitación estructural/inflamatoria.",
      [
        {
          name: "Espondiloartropatía / rigidez inflamatoria",
          probability: "media",
          rationale: "Rigidez matutina + Schober bajo.",
        },
        {
          name: "Lumbalgia mecánica con espasmo",
          probability: "alta",
          rationale: "Contractura muscular limitante.",
        },
      ]
    ),
    bk_nonspecific: conclusionNode(
      "bk_nonspecific",
      "Lumbalgia inespecífica mecánica",
      "Sin signos radiculares ni facetarios claros.",
      [
        {
          name: "Lumbalgia mecánica inespecífica",
          probability: "alta",
          rationale: "Dolor local sin irradiación ni déficit.",
        },
      ]
    ),
  },
};

/** Árbol cadera — intra vs extraarticular. */
const HIP_TREE: ClinicalReasoningTree = {
  bodyPart: "hip",
  title: "Razonamiento clínico — Cadera",
  entryNodeId: "hp_faber",
  entryByTestId: {
    faber: "hp_faber",
    fadir: "hp_fadir",
    trendelenburg: "hp_trendelenburg",
  },
  nodes: {
    hp_faber: testNode(
      "hp_faber",
      "faber",
      branch("hp_intraarticular", "Dolor inguinal"),
      branch("hp_extraarticular", "Dolor lumbar/glúteo")
    ),
    hp_intraarticular: conclusionNode(
      "hp_intraarticular",
      "Patología intraarticular de cadera",
      "FABER con dolor inguinal sugiere cadera, no SI primaria.",
      [
        {
          name: "Conflictos femoroacetabulares (FAI)",
          probability: "alta",
          rationale: "Dolor inguinal con flexión-rotación.",
        },
        {
          name: "Lesión labrum acetabular",
          probability: "media",
          rationale: "Chasquido, bloqueo, deportes de pivotaje.",
        },
      ],
      { nextNodeId: "hp_fadir" }
    ),
    hp_fadir: testNode(
      "hp_fadir",
      "fadir",
      branch("hp_fai", "FADIR positivo"),
      branch("hp_trendelenburg", "FADIR negativo")
    ),
    hp_fai: conclusionNode(
      "hp_fai",
      "Conflicto femoroacetabular",
      "FADIR positivo refuerza sospecha de pinzamiento anterior.",
      [
        {
          name: "FAI cam/pincer",
          probability: "alta",
          rationale: "Flexión-aducción-RI dolorosa.",
        },
      ]
    ),
    hp_trendelenburg: testNode(
      "hp_trendelenburg",
      "trendelenburg",
      branch("hp_gluteus", "Pelvis cae"),
      branch("hp_mild", "Trendelenburg negativo")
    ),
    hp_gluteus: conclusionNode(
      "hp_gluteus",
      "Debilidad glútea media / cadera funcional",
      "Trendelenburg positivo indica control pelviano deficiente.",
      [
        {
          name: "Tendinopatía glúteo medio",
          probability: "alta",
          rationale: "Dolor lateral cadera + Trendelenburg.",
        },
        {
          name: "Radiculopatía L5",
          probability: "media",
          rationale: "Si asocia déficit dorsiflexión pie.",
        },
      ]
    ),
    hp_extraarticular: conclusionNode(
      "hp_extraarticular",
      "Dolor referido lumbosacro / SI",
      "FABER con dolor posterior sugiere origen extraarticular.",
      [
        {
          name: "Disfunción articulación sacroilíaca",
          probability: "media",
          rationale: "Dolor posterior sacroilíaco.",
        },
        {
          name: "Dolor lumbar referido",
          probability: "media",
          rationale: "Explorar SLR/Kemp si irradiación.",
        },
      ]
    ),
    hp_mild: conclusionNode(
      "hp_mild",
      "Cuadro leve de cadera",
      "Tests especiales no concluyentes.",
      [
        {
          name: "Sobrecarga / bursitis trocantérica leve",
          probability: "media",
          rationale: "Dolor lateral sin signos intraarticulares.",
        },
      ]
    ),
  },
};

/** Árbol cabeza — cervicogénico vs primario. */
const HEAD_TREE: ClinicalReasoningTree = {
  bodyPart: "head",
  title: "Razonamiento clínico — Cabeza",
  entryNodeId: "hd_spurling",
  entryByTestId: {
    spurling: "hd_spurling",
  },
  nodes: {
    hd_spurling: testNode(
      "hd_spurling",
      "spurling",
      branch("hd_cervicogenic", "Reproduce cefalea"),
      branch("hd_primary", "No reproduce cefalea")
    ),
    hd_cervicogenic: conclusionNode(
      "hd_cervicogenic",
      "Cefalea cervicogénica",
      "Spurling reproduce el patrón cefálico → origen cervical.",
      [
        {
          name: "Cefalea cervicogénica",
          probability: "alta",
          rationale: "Dolor unilateral occipital/temporal con provocación cervical.",
        },
        {
          name: "Radiculopatía cervical alta",
          probability: "media",
          rationale: "Si parestesias asociadas.",
        },
      ]
    ),
    hd_primary: conclusionNode(
      "hd_primary",
      "Cefalea primaria probable",
      "Sin reproducción con maniobras cervicales.",
      [
        {
          name: "Migraña / cefalea tensional",
          probability: "alta",
          rationale: "Patrón típico sin signos cervicales provocables.",
        },
        {
          name: "Cefalea postraumática (valorar red flags)",
          probability: "baja",
          rationale: "Si traumatismo reciente, descartar con médico.",
        },
      ]
    ),
  },
};

export const CLINICAL_REASONING_TREES: Partial<
  Record<BodyPartId, ClinicalReasoningTree>
> = {
  ankle_foot: ANKLE_FOOT_TREE,
  knee: KNEE_TREE,
  shoulder: SHOULDER_TREE,
  elbow: ELBOW_TREE,
  wrist_hand: WRIST_HAND_TREE,
  finger: FINGER_TREE,
  neck: NECK_TREE,
  back: BACK_TREE,
  hip: HIP_TREE,
  head: HEAD_TREE,
};

export const CLINICAL_REASONING_BODY_PARTS = Object.keys(
  CLINICAL_REASONING_TREES
) as BodyPartId[];
