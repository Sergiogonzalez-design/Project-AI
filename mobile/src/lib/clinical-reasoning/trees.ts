import type { BodyPartId } from "../body-parts";
import { branch, conclusionNode, testNode } from "./node-helpers";
import type { ClinicalReasoningTree } from "./types";

/** Árbol tobillo / pie — esguince lateral, Aquiles, fascitis (evidencia Ottawa / MSK reviews). */
const ANKLE_FOOT_TREE: ClinicalReasoningTree = {
  bodyPart: "ankle_foot",
  title: "Razonamiento clínico — Tobillo / Pie",
  entryNodeId: "af_master_entry",
  entryByTestId: {
    "anterior-drawer-ankle": "ankle_drawer",
    thompson: "ankle_thompson",
    matles: "ankle_matles",
    windlass: "ankle_windlass",
    "heel-raise": "ankle_heel_raise",
    "slr-lasegue": "ankle_slr",
    "hop-test": "ankle_hop",
  },
  nodes: {
    af_master_entry: conclusionNode(
      "af_master_entry",
      "Tobillo / pie — árbol maestro Physioguide",
      "Flujo: red flags → Ottawa (trauma) → mecanismo → localización → rama (lateral/sindesmosis, Aquiles, plantar, referido) → cluster. Nunca cajón = grado III.",
      [
        {
          name: "Enrutar por Ottawa, mecanismo y localización",
          probability: "alta",
          rationale:
            "Trauma → Ottawa. Inversión → lateral. Pop posterior → Aquiles. Primeros pasos → fascia. Lumbar → S1.",
        },
        {
          name: "Permitir coexistencia",
          probability: "media",
          rationale: "Esguince + contusión ósea; fascia + S1; tendinopatía + gemelo.",
        },
      ],
      { nextNodeId: "af_ottawa_gate" }
    ),
    af_ottawa_gate: testNode(
      "af_ottawa_gate",
      "route-ankle-ottawa",
      branch("af_ottawa_positive", "Criterios Ottawa positivos / no 4 pasos + dolor óseo"),
      branch("af_mechanism_gate", "Ottawa negativo o no trauma agudo"),
      {
        title: "¿Criterios de Ottawa para radiografía?",
        description:
          "No 4 pasos y/o dolor óseo en maléolo (borde posterior/punta), navicular o base del 5.º MT → RX antes de clasificar esguince.",
        procedure: "Enrutado clínico Ottawa (Stiell). No es un test de esguince.",
        evidenceNote:
          "Ottawa+ → RX. Ottawa− → fractura muy poco probable; esguince sigue posible (Bachmann BMJ).",
      }
    ),
    af_ottawa_positive: conclusionNode(
      "af_ottawa_positive",
      "Indicado valorar radiografía (Ottawa)",
      "Criterios positivos: pedir RX. No tranquilizar «solo esguince» sin valorar hueso. Tras imagen o si RX normal, continuar por mecanismo/localización.",
      [
        {
          name: "Sospecha de fractura / necesidad de RX",
          probability: "alta",
          rationale: "Ottawa ankle/foot rules.",
        },
        {
          name: "Esguince / partes blandas tras RX normal",
          probability: "media",
          rationale: "Ottawa orienta imagen, no diagnostica esguince.",
        },
      ],
      { nextNodeId: "af_mechanism_gate" }
    ),
    af_mechanism_gate: testNode(
      "af_mechanism_gate",
      "route-ankle-achilles",
      branch("af_achilles_cluster", "Pop posterior / no puntillas / Aquiles"),
      branch("af_loc_lateral", "Sin cuadro Aquiles dominante"),
      {
        title: "¿Cuadro de Aquiles dominante (pop / no puntillas)?",
        description:
          "Pop posterior + imposibilidad de heel-raise → rama Aquiles (Thompson). Si es inversión o talón plantar, continúa por localización.",
        procedure: "Enrutado por mecanismo.",
        evidenceNote: "Cluster rotura: pop + no monopodal + Thompson (Maffulli).",
      }
    ),
    af_loc_lateral: testNode(
      "af_loc_lateral",
      "route-ankle-lateral",
      branch("af_lateral_cluster", "Lateral / inversión / ATFL"),
      branch("af_loc_plantar", "No es el dolor dominante"),
      {
        title: "¿Dolor lateral o mecanismo de inversión?",
        description:
          "Tobillo por fuera, inversión, ATFL → esguince lateral. Dolor tibiofibular alto → sindesmosis (misma rama).",
        procedure: "Enrutado por localización/mecanismo.",
      }
    ),
    af_loc_plantar: testNode(
      "af_loc_plantar",
      "route-ankle-plantar",
      branch("af_plantar_cluster", "Planta / talón / primeros pasos"),
      branch("af_referral_cluster", "Difuso / lumbar / otra zona"),
      {
        title: "¿Dolor plantar o de talón (fascial)?",
        description:
          "Planta, arco o primeros pasos matutinos → fasciopatía. Si lumbar/hormigueo domina → referido.",
        procedure: "Enrutado por localización.",
      }
    ),
    af_lateral_cluster: conclusionNode(
      "af_lateral_cluster",
      "Compatible con esguince lateral (± sindesmosis)",
      "Inversión + dolor lateral → ATFL±CFL. Dolor tibiofibular alto + RE → sindesmosis (no ATFL simple). Cajón mejor diferido; no inventar grado.",
      [
        {
          name: "Esguince complejo lateral (ATFL ± CFL)",
          probability: "alta",
          rationale: "Inversión + dolor/hinchazón lateral.",
        },
        {
          name: "Lesión de sindesmosis",
          probability: "media",
          rationale: "Dolor anterior alto + rotación externa.",
        },
      ],
      { nextNodeId: "ankle_drawer" }
    ),
    af_achilles_cluster: conclusionNode(
      "af_achilles_cluster",
      "Compatible con patología del Aquiles",
      "Pop + no heel-raise + Thompson+ → rotura completa ↑↑ (médico/eco). Thompson− + carga dolorosa → tendinopatía. No confundir con tirón de gemelo sin cluster.",
      [
        {
          name: "Rotura completa de Aquiles",
          probability: "alta",
          rationale: "Pop + no puntillas + Thompson.",
        },
        {
          name: "Tendinopatía aquílea",
          probability: "media",
          rationale: "Thompson− con dolor en carga.",
        },
      ],
      { nextNodeId: "ankle_thompson" }
    ),
    af_plantar_cluster: conclusionNode(
      "af_plantar_cluster",
      "Compatible con fasciopatía plantar / talón",
      "Primeros pasos + palpación inserción medial ± Windlass. Windlass negativo no excluye. Cribar S1 si lumbar/hormigueo.",
      [
        {
          name: "Fasciopatía plantar",
          probability: "alta",
          rationale: "Patrón matutino + inserción medial.",
        },
        {
          name: "Referido S1 / túnel tarsiano",
          probability: "media",
          rationale: "Si tests locales pobres o síntomas neurales.",
        },
      ],
      { nextNodeId: "ankle_windlass" }
    ),
    af_referral_cluster: conclusionNode(
      "af_referral_cluster",
      "Valorar referido lumbar / cuadro mixto",
      "Sin patrón local claro: cribar SLR/lumbar, medial (PTT), o trauma residual. Permitir coexistencia.",
      [
        {
          name: "Referido radicular L5–S1",
          probability: "media",
          rationale: "Lumbar + planta/pantorrilla.",
        },
        {
          name: "Patología local coexistente",
          probability: "media",
          rationale: "No excluir tobillo/pie local.",
        },
      ],
      { nextNodeId: "ankle_slr" }
    ),
    ankle_drawer: testNode(
      "ankle_drawer",
      "anterior-drawer-ankle",
      branch("ankle_lat_sprain_high", "Laxitud / dolor ATFL familiar"),
      branch("ankle_syndesmosis_hint", "Sin laxitud significativa")
    ),
    ankle_lat_sprain_high: conclusionNode(
      "ankle_lat_sprain_high",
      "Compatible con esguince lateral de tobillo",
      "Cajón/dolor ATFL con inversión apoya complejo lateral. Más fiable diferido 4–5 días. No grado I–III automático.",
      [
        {
          name: "Esguince del ligamento talofibular anterior (ATFL)",
          probability: "alta",
          rationale: "Mecanismo de inversión + hallazgo lateral.",
        },
        {
          name: "Esguince CFL / complejo lateral más amplio",
          probability: "media",
          rationale: "Dolor más distal o inestabilidad persistente.",
        },
      ],
      { nextNodeId: "ankle_hop" }
    ),
    ankle_syndesmosis_hint: conclusionNode(
      "ankle_syndesmosis_hint",
      "Valorar sindesmosis u otra estructura",
      "Sin cajón claro: si dolor tibiofibular alto o rotación externa → sindesmosis. Si no, contusión leve o diferir exploración.",
      [
        {
          name: "Posible sindesmosis / esguince alto",
          probability: "media",
          rationale: "Dolor anterior alto sin laxitud ATFL típica.",
        },
        {
          name: "Esguince leve / contusión sin laxitud detectable",
          probability: "media",
          rationale: "Agudo con guarda o microlesión.",
        },
      ],
      { nextNodeId: "ankle_hop" }
    ),
    ankle_thompson: testNode(
      "ankle_thompson",
      "thompson",
      branch("ankle_achilles_rupture", "Sin flexión plantar"),
      branch("ankle_matles", "Flexión plantar presente — complementar Matles")
    ),
    ankle_matles: testNode(
      "ankle_matles",
      "matles",
      branch("ankle_achilles_rupture", "Pie caído vs contralateral"),
      branch("ankle_heel_raise", "Ángulo de reposo simétrico")
    ),
    ankle_achilles_rupture: conclusionNode(
      "ankle_achilles_rupture",
      "Sospecha alta de rotura completa del Aquiles",
      "Thompson positivo en contexto de pop + no heel-raise. Derivar médico/eco. No inventar parcial vs completa solo por un test.",
      [
        {
          name: "Rotura completa del tendón de Aquiles",
          probability: "alta",
          rationale: "Cluster clínico Maffulli / JOSPT Achilles.",
        },
      ]
    ),
    ankle_heel_raise: testNode(
      "ankle_heel_raise",
      "heel-raise",
      branch("ankle_achilles_tendinopathy", "Dolor / déficit con flexión plantar presente"),
      branch("ankle_windlass", "Simétrico y sin dolor Aquiles")
    ),
    ankle_achilles_tendinopathy: conclusionNode(
      "ankle_achilles_tendinopathy",
      "Compatible con tendinopatía aquílea / tríceps",
      "Thompson negativo con dolor en carga → tendinopatía ↑. Rotura parcial posible si déficit marcado; eco si duda.",
      [
        {
          name: "Tendinopatía aquílea",
          probability: "alta",
          rationale: "Dolor en tendón + carga + Thompson−.",
        },
        {
          name: "Rotura parcial / lesión de gemelo",
          probability: "media",
          rationale: "Si pop o déficit importante con Thompson−.",
        },
      ],
      { nextNodeId: "ankle_windlass" }
    ),
    ankle_windlass: testNode(
      "ankle_windlass",
      "windlass",
      branch("ankle_plantar_fasciitis", "Dolor arco / inserción familiar"),
      branch("ankle_hop", "Sin dolor fascial")
    ),
    ankle_plantar_fasciitis: conclusionNode(
      "ankle_plantar_fasciitis",
      "Compatible con fasciopatía plantar",
      "Windlass familiar apoya; negativo no excluye. Integrar primeros pasos y palpación. Cribar S1 si procede.",
      [
        {
          name: "Fasciopatía plantar",
          probability: "alta",
          rationale: "Patrón talón/arco + provocación fascial.",
        },
        {
          name: "Referido S1 / otra causa de talón",
          probability: "baja",
          rationale: "Si cuadro neural o tests locales pobres.",
        },
      ],
      { nextNodeId: "ankle_hop" }
    ),
    ankle_hop: testNode(
      "ankle_hop",
      "hop-test",
      branch("ankle_functional_instability", "Dolor / inestabilidad / no tolera"),
      branch("ankle_mild_contusion", "Buen control")
    ),
    ankle_functional_instability: conclusionNode(
      "ankle_functional_instability",
      "Inestabilidad funcional o irritación residual",
      "Hop doloroso o sensación de ceder tras esguince. Valorar CAI vs sindesmosis residual. Solo si Ottawa permitido.",
      [
        {
          name: "Inestabilidad funcional post-esguince",
          probability: "alta",
          rationale: "Déficit de control en carga dinámica.",
        },
        {
          name: "Irritación de sindesmosis",
          probability: "media",
          rationale: "Dolor anterior alto con carga.",
        },
      ]
    ),
    ankle_mild_contusion: conclusionNode(
      "ankle_mild_contusion",
      "Cuadro leve / buena tolerancia funcional",
      "Pruebas poco provocativas y buen hop. Contusión o esguince leve posible; reevaluar si empeora.",
      [
        {
          name: "Contusión / esguince leve",
          probability: "alta",
          rationale: "Sin laxitud ni déficit Aquiles ni fascial claro.",
        },
      ]
    ),
    ankle_slr: testNode(
      "ankle_slr",
      "slr-lasegue",
      branch("ankle_radicular", "Dolor radicular / ciático familiar"),
      branch("af_lateral_cluster", "Sin irradiación radicular")
    ),
    ankle_radicular: conclusionNode(
      "ankle_radicular",
      "Compatible con dolor referido / radicular",
      "SLR familiar sugiere origen lumbar más que lesión aislada de pie. Puede coexistir patología local.",
      [
        {
          name: "Irritación radicular L5–S1",
          probability: "alta",
          rationale: "Ciática / SLR familiar.",
        },
        {
          name: "Patología de tobillo/pie coexistente",
          probability: "media",
          rationale: "No excluir local automáticamente.",
        },
      ]
    ),
  },
};

/** Árbol rodilla — master routing + anterior PFPS + LCA/menisco. */
const KNEE_TREE: ClinicalReasoningTree = {
  bodyPart: "knee",
  title: "Razonamiento clínico — Rodilla",
  entryNodeId: "knee_master_entry",
  entryByTestId: {
    lachman: "knee_lachman",
    "anterior-drawer-knee": "knee_drawer",
    mcmurray: "knee_mcmurray",
    thessaly: "knee_thessaly",
    "pivot-shift": "knee_pivot",
    "valgus-stress-mcl": "knee_valgus",
    "varus-stress-lcl": "knee_varus",
    "posterior-drawer-pcl": "knee_posterior_drawer",
  },
  nodes: {
    knee_master_entry: conclusionNode(
      "knee_master_entry",
      "Rodilla — árbol maestro Physioguide",
      "Flujo: red flags → mecanismo (torsión/pop/LCA) → localización exacta → rama (anterior / medial / lateral / posterior / inestabilidad) → historia/carga → tests cluster → diferencial → coexistencia.",
      [
        {
          name: "Enrutar por mecanismo y localización",
          probability: "alta",
          rationale:
            "Torsión+pop → LCA primero. Anterior → PFPS/tendón; medial → LCM/menisco/pes; lateral → LCL/ITB; poplíteo → Baker/LCP.",
        },
        {
          name: "Permitir patologías coexistentes",
          probability: "media",
          rationale: "LCA + menisco, PFPS + ITB, LCM + pes son combinaciones válidas.",
        },
      ],
      { nextNodeId: "knee_master_mechanism_gate" }
    ),
    knee_master_mechanism_gate: testNode(
      "knee_master_mechanism_gate",
      "route-knee-acl",
      branch("knee_route_instability", "Torsión / pop / no continuar / ceder al girar"),
      branch("knee_loc_anterior", "Sin mecanismo estructural dominante"),
      {
        title: "¿Mecanismo de inestabilidad / LCA dominante?",
        description:
          "Torsión o corte + pop + no pudo continuar + hinchazón en horas, o golpe en tibia anterior (salpicadero) → rama inestabilidad. Si es sobreuso o dolor localizado sin pop/ceder, continúa por localización.",
        procedure:
          "Enrutado clínico (no es un test físico). Elige según la historia del informe.",
        evidenceNote:
          "Cluster LCA: torsión + pop + no continuar + hinchazón + giving-way. Un pop aislado no confirma rotura.",
      }
    ),
    knee_loc_anterior: testNode(
      "knee_loc_anterior",
      "route-knee-anterior",
      branch("knee_anterior_cluster", "Anterior / rótula / tendón rotuliano"),
      branch("knee_loc_medial", "No es el dolor dominante"),
      {
        title: "¿El dolor es anterior (rótula / tendón)?",
        description:
          "Dolor en cara anterior, rótula, detrás de la rótula o tendón rotuliano → rama PFPS / tendón. Si no, sigue a medial / lateral / posterior.",
        procedure: "Enrutado por localización exacta del paciente.",
        evidenceNote: "Localización primero. No condromalacia automática.",
      }
    ),
    knee_loc_medial: testNode(
      "knee_loc_medial",
      "route-knee-medial",
      branch("knee_route_medial", "Cara interna / línea medial / pes anserino"),
      branch("knee_loc_lateral", "No es el dolor dominante"),
      {
        title: "¿El dolor es medial (cara interna)?",
        description:
          "Cara interna, línea articular medial o pes anserino → LCM / menisco / pes. Si no, lateral o posterior.",
        procedure: "Enrutado por localización exacta del paciente.",
      }
    ),
    knee_loc_lateral: testNode(
      "knee_loc_lateral",
      "route-knee-lateral",
      branch("knee_route_lateral", "Cara externa / ITB / línea lateral"),
      branch("knee_posterior_cluster", "Hueco poplíteo u otra zona posterior"),
      {
        title: "¿El dolor es lateral (cara externa / ITB)?",
        description:
          "Cara externa, línea lateral o banda iliotibial → LCL / menisco lateral / ITB. Si el dolor es detrás de la rodilla → posterior / poplíteo.",
        procedure: "Enrutado por localización exacta del paciente.",
      }
    ),
    knee_master_location: conclusionNode(
      "knee_master_location",
      "Enrutar por localización exacta",
      "Anterior/rótula/tendón → PFPS. Cara interna → LCM/menisco/pes. Cara externa → LCL/ITB. Poplíteo → Baker/menisco posterior. Línea articular → menisco del lado.",
      [
        {
          name: "Anterior / patelofemoral / tendón",
          probability: "alta",
          rationale: "Dolor rótula/tendón sin cluster LCA.",
        },
        {
          name: "Medial / LCM / menisco / pes",
          probability: "media",
          rationale: "Cara interna o línea medial.",
        },
        {
          name: "Lateral / LCL / ITB",
          probability: "media",
          rationale: "Cara externa, línea lateral o patrón carrera.",
        },
        {
          name: "Posterior / poplíteo",
          probability: "baja",
          rationale: "Hueco detrás de la rodilla: Baker, menisco posterior o LCP.",
        },
      ],
      { nextNodeId: "knee_anterior_cluster" }
    ),
    knee_anterior_cluster: conclusionNode(
      "knee_anterior_cluster",
      "Compatible con patología anterior (PFPS / tendón rotuliano)",
      "Escaleras/sentadilla/sentado/salto familiar + localización anterior → PFPS o tendinopatía rotuliana según zona; no condromalacia automática.",
      [
        {
          name: "PFPS / patelofemoral",
          probability: "alta",
          rationale: "Dolor retropatelar + escaleras/sentadilla/sentado.",
        },
        {
          name: "Tendinopatía rotuliana",
          probability: "media",
          rationale: "Dolor tendón inferior + salto/carga.",
        },
      ],
      { nextNodeId: "knee_patellofemoral" }
    ),
    knee_route_instability: conclusionNode(
      "knee_route_instability",
      "Rama inestabilidad / LCA / menisco",
      "Torsión + pop/hinchazón/bloqueo → cluster LCA/LCP primero; luego Lachman/Thessaly/McMurray si es seguro.",
      [
        {
          name: "Lesión LCA / menisco",
          probability: "alta",
          rationale: "Mecanismo rotacional + signos estructurales.",
        },
      ],
      { nextNodeId: "knee_instability_cluster" }
    ),
    knee_instability_cluster: conclusionNode(
      "knee_instability_cluster",
      "Compatible con inestabilidad estructural (LCA / LCP / combinada)",
      "Torsión/corte + pop + no continuar + hinchazón en horas + cede al girar → LCA ↑. Salpicadero → LCP. Rótula que se sale → no LCA.",
      [
        {
          name: "Lesión LCA",
          probability: "alta",
          rationale: "No-contacto/corte + pop + hemartros + giving-way.",
        },
        {
          name: "Lesión LCP",
          probability: "media",
          rationale: "Golpe tibia anterior con rodilla flexionada.",
        },
        {
          name: "Lesión combinada / PLC",
          probability: "media",
          rationale: "Valgo/varo o hiperextensión + inestabilidad multiplanar.",
        },
        {
          name: "Giving-way funcional o rotuliana",
          probability: "baja",
          rationale: "Cede por dolor o «rótula se sale» sin pop/hemartros clásico.",
        },
      ],
      { nextNodeId: "knee_lachman" }
    ),
    knee_medial_cluster: conclusionNode(
      "knee_medial_cluster",
      "Compatible con patología medial (LCM / menisco / pes anserino)",
      "Cara interna o línea medial + contacto/valgo → LCM (estrés en valgo); torsión + bloqueo → menisco; anteromedial inferior + carrera → pes anserino.",
      [
        {
          name: "Esguince LCM",
          probability: "alta",
          rationale: "Contacto/valgo + dolor LCM familiar.",
        },
        {
          name: "Lesión meniscal medial",
          probability: "media",
          rationale: "Línea articular + torsión/bloqueo.",
        },
        {
          name: "Pes anserinus bursitis/tendinopathy",
          probability: "media",
          rationale: "Dolor anteromedial inferior + carrera sin bloqueo.",
        },
      ],
      { nextNodeId: "knee_valgus" }
    ),
    knee_route_medial: conclusionNode(
      "knee_route_medial",
      "Rama medial — LCM / menisco / pes anserino",
      "Localización medial predominante; valgo primero, luego McMurray/Thessaly si torsión/bloqueo.",
      [
        {
          name: "Patología medial estructural",
          probability: "alta",
          rationale: "Dolor cara interna o línea medial.",
        },
      ],
      { nextNodeId: "knee_medial_cluster" }
    ),
    knee_lateral_cluster: conclusionNode(
      "knee_lateral_cluster",
      "Compatible con patología lateral (LCL / menisco / ITB)",
      "Cara externa o línea lateral + contacto/varo → LCL (estrés en varo); torsión + bloqueo → menisco; carrera/escaleras sin trauma → ITB.",
      [
        {
          name: "Esguince LCL",
          probability: "alta",
          rationale: "Contacto/varo + dolor LCL familiar.",
        },
        {
          name: "Lesión meniscal lateral",
          probability: "media",
          rationale: "Línea articular lateral + torsión/bloqueo.",
        },
        {
          name: "Síndrome banda iliotibial (ITB)",
          probability: "media",
          rationale: "Dolor lateral ITB + carrera/escaleras sin bloqueo.",
        },
      ],
      { nextNodeId: "knee_lateral_trauma_gate" }
    ),
    knee_route_lateral: conclusionNode(
      "knee_route_lateral",
      "Rama lateral — LCL / menisco / ITB",
      "Localización lateral predominante; diferenciar trauma/varo (LCL) vs sobreuso (ITB) antes de menisco.",
      [
        {
          name: "Patología lateral estructural o ITB",
          probability: "alta",
          rationale: "Dolor cara externa, línea lateral o ITB.",
        },
      ],
      { nextNodeId: "knee_lateral_cluster" }
    ),
    knee_posterior_cluster: conclusionNode(
      "knee_posterior_cluster",
      "Compatible con patología posterior / poplítea",
      "Hueco poplíteo + bulto/limitación flexión → Baker ↑. Torsión + línea posterior → menisco. Salpicadero → LCP (cajón posterior).",
      [
        {
          name: "Quiste de Baker",
          probability: "alta",
          rationale: "Bulto posterior + limitación flexión; a menudo OA/menisco asociado.",
        },
        {
          name: "Menisco posterior",
          probability: "media",
          rationale: "Torsión + dolor línea posterior / bloqueo.",
        },
        {
          name: "LCP",
          probability: "baja",
          rationale: "Golpe tibia anterior con rodilla flexionada.",
        },
      ],
      { nextNodeId: "knee_pcl_gate" }
    ),
    knee_route_posterior: conclusionNode(
      "knee_route_posterior",
      "Rama posterior — poplíteo / Baker / LCP",
      "Localización hueco poplíteo; cribar LCP si salpicadero, luego menisco posterior.",
      [
        {
          name: "Patología poplítea",
          probability: "alta",
          rationale: "Dolor o bulto detrás de la rodilla.",
        },
      ],
      { nextNodeId: "knee_posterior_cluster" }
    ),
    knee_lateral_trauma_gate: testNode(
      "knee_lateral_trauma_gate",
      "route-knee-lateral-trauma",
      branch("knee_varus", "Contacto / varo / trauma lateral"),
      branch("knee_itb_cluster", "Carrera / escaleras sin trauma (ITB)"),
      {
        title: "¿Trauma o contacto en varo en la cara externa?",
        description:
          "Golpe/contacto o mecanismo en varo → estrés LCL. Dolor lateral reproducible en carrera/escaleras sin trauma → ITB primero.",
        procedure: "Enrutado clínico (no test físico).",
        evidenceNote:
          "ITB = sobreuso; LCL = trauma/varo. No etiquetar LCL por carrera sola.",
      }
    ),
    knee_pcl_gate: testNode(
      "knee_pcl_gate",
      "route-knee-pcl",
      branch("knee_posterior_drawer", "Salpicadero / golpe tibia anterior"),
      branch("knee_mcmurray", "Sin mecanismo LCP — menisco/Baker"),
      {
        title: "¿Mecanismo de LCP (salpicadero)?",
        description:
          "Golpe en la tibia anterior con rodilla flexionada → cajón posterior. Sin eso → menisco posterior / Baker.",
        procedure: "Enrutado clínico por mecanismo.",
      }
    ),
    knee_valgus: testNode(
      "knee_valgus",
      "valgus-stress-mcl",
      branch("knee_mcl_high", "Dolor LCM familiar y/o holgura medial"),
      branch("knee_mcmurray", "Valgo no familiar — valorar menisco/pes")
    ),
    knee_mcl_high: conclusionNode(
      "knee_mcl_high",
      "Compatible con esguince del LCM",
      "Valgo doloroso/holgura en cara medial. No inventar grado. Cribar menisco/LCA coexistentes (tríada) con McMurray/Lachman si el mecanismo lo sugiere.",
      [
        {
          name: "Esguince LCM",
          probability: "alta",
          rationale: "Estrés en valgo familiar ± apertura medial.",
        },
        {
          name: "Menisco medial coexistente",
          probability: "media",
          rationale: "Línea articular + torsión/bloqueo.",
        },
        {
          name: "LCA asociado (tríada)",
          probability: "media",
          rationale: "Si pop/hinchazón/giving-way además del valgo.",
        },
      ],
      { nextNodeId: "knee_mcmurray" }
    ),
    knee_varus: testNode(
      "knee_varus",
      "varus-stress-lcl",
      branch("knee_lcl_high", "Dolor LCL familiar y/o holgura lateral"),
      branch("knee_mcmurray", "Varo no familiar — valorar menisco lateral")
    ),
    knee_lcl_high: conclusionNode(
      "knee_lcl_high",
      "Compatible con esguince del LCL (± PLC)",
      "Varo doloroso/holgura lateral. Si hiperextensión o inestabilidad multiplanar → PLC ↑. No confundir con ITB.",
      [
        {
          name: "Esguince LCL",
          probability: "alta",
          rationale: "Estrés en varo familiar ± apertura lateral.",
        },
        {
          name: "PLC / lesión combinada",
          probability: "media",
          rationale: "Varo + hiperextensión o multiplanar.",
        },
        {
          name: "Menisco lateral coexistente",
          probability: "media",
          rationale: "Línea lateral + torsión/bloqueo.",
        },
      ],
      { nextNodeId: "knee_mcmurray" }
    ),
    knee_itb_cluster: conclusionNode(
      "knee_itb_cluster",
      "Compatible con síndrome de banda iliotibial (ITB)",
      "Dolor lateral en cóndilo/ITB reproducible con carrera o escaleras, sin trauma ni holgura en varo. No es LCL.",
      [
        {
          name: "Síndrome banda iliotibial",
          probability: "alta",
          rationale: "Sobreuso + dolor lateral familiar en carga cíclica.",
        },
        {
          name: "Menisco lateral / LCL (menos probable)",
          probability: "baja",
          rationale: "Si aparece bloqueo o trauma diferido, reevaluar.",
        },
      ],
      { nextNodeId: "knee_mcmurray" }
    ),
    knee_posterior_drawer: testNode(
      "knee_posterior_drawer",
      "posterior-drawer-pcl",
      branch("knee_pcl_high", "Sag / cajón posterior aumentado"),
      branch("knee_mcmurray", "Sin sag — menisco/Baker")
    ),
    knee_pcl_high: conclusionNode(
      "knee_pcl_high",
      "Sospecha de lesión del LCP",
      "Cajón posterior/sag + mecanismo tibia anterior. No etiquetar LCA. Agudo puede ser poco fiable por dolor.",
      [
        {
          name: "Lesión LCP",
          probability: "alta",
          rationale: "Sag/cajón posterior + mecanismo salpicadero.",
        },
        {
          name: "PLC / combinada",
          probability: "media",
          rationale: "Si también varo o hiperextensión.",
        },
      ]
    ),
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
      "McMurray/Thessaly positivo con dolor/chasquido en compartimento; registrar medial vs lateral según localización.",
      [
        {
          name: "Lesión meniscal medial",
          probability: "alta",
          rationale: "Dolor línea medial + torsión/bloqueo + test positivo.",
        },
        {
          name: "Lesión meniscal lateral",
          probability: "media",
          rationale: "Si dolor/compartimento lateral predominante.",
        },
        {
          name: "Sinovitis / condropatía",
          probability: "baja",
          rationale: "Dolor difuso sin bloqueo mecánico claro.",
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
      "Cuadro no meniscal / no LCA claro",
      "McMurray/Thessaly negativos. Según localización: anterior → PFPS/tendón; medial sin valgo → pes anserino; lateral sin varo → ITB leve; trauma leve → contusión/esguince I.",
      [
        {
          name: "Síndrome patelofemoral / tendinopatía rotuliana",
          probability: "alta",
          rationale: "Dolor anterior sin signos meniscales/LCA.",
        },
        {
          name: "Pes anserino / sobrecarga medial",
          probability: "media",
          rationale: "Anteromedial inferior sin holgura en valgo ni bloqueo.",
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
  entryNodeId: "sh_master_entry",
  entryByTestId: {
    neer: "sh_neer",
    "hawkins-kennedy": "sh_hawkins",
    "jobe-empty-can": "sh_jobe",
    apprehension: "sh_apprehension",
    "drop-arm": "sh_drop_arm",
    "painful-arc": "sh_painful_arc",
    speed: "sh_speed",
    yergason: "sh_yergason",
    "cross-body": "sh_cross_body",
  },
  nodes: {
    sh_master_entry: conclusionNode(
      "sh_master_entry",
      "Hombro — árbol maestro Physioguide",
      "Flujo: red flags → cervical si procede → trauma/luxación → localización exacta → rama (RCRSP / anterior / AC / inestabilidad) → cluster → diferencial → coexistencia. Nunca Neer = pinzamiento confirmado.",
      [
        {
          name: "Enrutar por mecanismo y localización",
          probability: "alta",
          rationale:
            "Luxación/«se sale» → inestabilidad. Lateral → RCRSP. Anterior → bíceps. Superior → AC. Cuello/hormigueo → cervical.",
        },
        {
          name: "Permitir patologías coexistentes",
          probability: "media",
          rationale: "RCRSP + AC, manguito + cervical, bíceps + RCRSP son válidas.",
        },
      ],
      { nextNodeId: "sh_master_trauma_gate" }
    ),
    sh_master_trauma_gate: testNode(
      "sh_master_trauma_gate",
      "route-shoulder-trauma",
      branch("sh_route_instability", "Luxación / «se sale» / trauma dominante"),
      branch("sh_loc_lateral", "Sin trauma/inestabilidad dominante"),
      {
        title: "¿Mecanismo de trauma o inestabilidad dominante?",
        description:
          "Luxación, subluxación, «se sale», caída FOOSH o deformidad → rama inestabilidad/trauma. Si es overhead/sobreuso sin luxación, continúa por localización.",
        procedure: "Enrutado clínico (no es un test físico).",
        evidenceNote:
          "Aprensión = miedo a que se salga, no solo dolor. Cluster Farber/Hegedus.",
      }
    ),
    sh_loc_lateral: testNode(
      "sh_loc_lateral",
      "route-shoulder-lateral",
      branch("sh_rcrsp_cluster", "Lateral / deltoides / anterolateral"),
      branch("sh_loc_anterior", "No es el dolor dominante"),
      {
        title: "¿El dolor es lateral / anterolateral?",
        description:
          "Cara lateral, deltoides o anterolateral con elevación → rama RCRSP/manguito. Si no, anterior / AC / posterior.",
        procedure: "Enrutado por localización exacta del paciente.",
        evidenceNote: "RCRSP en cluster; no pinzamiento confirmado (Lewis; Hegedus).",
      }
    ),
    sh_loc_anterior: testNode(
      "sh_loc_anterior",
      "route-shoulder-anterior",
      branch("sh_anterior_cluster", "Parte delantera / surco bicipital"),
      branch("sh_loc_superior", "No es el dolor dominante"),
      {
        title: "¿El dolor es anterior (surco / delante)?",
        description:
          "Parte delantera o surco bicipital → bíceps/anterior. Speed/Yergason no confirman SLAP.",
        procedure: "Enrutado por localización exacta del paciente.",
      }
    ),
    sh_loc_superior: testNode(
      "sh_loc_superior",
      "route-shoulder-ac",
      branch("sh_ac_cluster", "Punta / clavícula / AC"),
      branch("sh_posterior_cervical", "Posterior / escapular / cuello / difuso"),
      {
        title: "¿El dolor es superior (AC / clavícula)?",
        description:
          "Puede señalar la puntita con un dedo + cross-body → AC. Si es posterior/escapular o cuello → referido/cervical.",
        procedure: "Enrutado por localización exacta del paciente.",
      }
    ),
    sh_route_instability: conclusionNode(
      "sh_route_instability",
      "Compatible con inestabilidad / trauma de hombro",
      "Historia de luxación/«se sale» o trauma dominante. Aprensión (miedo) apoya; dolor solo no confirma. Cribar fractura y manguito traumático si >40 años + debilidad.",
      [
        {
          name: "Inestabilidad anterior",
          probability: "alta",
          rationale: "Luxación/ABD-RE + aprensión.",
        },
        {
          name: "Rotura traumática de manguito",
          probability: "media",
          rationale: "Trauma + debilidad franca (esp. edad >40).",
        },
        {
          name: "AC / fractura",
          probability: "media",
          rationale: "Caída sobre punta o FOOSH.",
        },
      ],
      { nextNodeId: "sh_apprehension" }
    ),
    sh_rcrsp_cluster: conclusionNode(
      "sh_rcrsp_cluster",
      "Compatible con RCRSP / irritación del manguito",
      "Dolor lateral/anterolateral + elevación + arco/Neer/Hawkins familiar. No «pinzamiento confirmado». Si debilidad + drop arm → rotura importante ↑. Si PROM limitado global → capsulitis.",
      [
        {
          name: "RCRSP / tendinopatía del manguito",
          probability: "alta",
          rationale: "Cluster elevación + dolor familiar sin debilidad franca.",
        },
        {
          name: "Rotura importante de manguito",
          probability: "media",
          rationale: "Debilidad + drop arm / Jobe débil.",
        },
        {
          name: "Capsulitis / rigid shoulder",
          probability: "media",
          rationale: "Limitación activa y pasiva global.",
        },
      ],
      { nextNodeId: "sh_neer" }
    ),
    sh_anterior_cluster: conclusionNode(
      "sh_anterior_cluster",
      "Compatible con dolor anterior / bíceps",
      "Surco bicipital + Speed/Yergason familiar → bíceps ↑. No SLAP automático. Cribado RCRSP e inestabilidad.",
      [
        {
          name: "Tendinopatía / irritación del bíceps largo",
          probability: "alta",
          rationale: "Surco + provocación familiar.",
        },
        {
          name: "RCRSP con componente anterior",
          probability: "media",
          rationale: "Coexistencia frecuente.",
        },
      ],
      { nextNodeId: "sh_speed" }
    ),
    sh_ac_cluster: conclusionNode(
      "sh_ac_cluster",
      "Compatible con patología acromioclavicular",
      "Dedo en la AC + cross-body familiar. No confundir con RCRSP deltoideo.",
      [
        {
          name: "Irritación / esguince / OA AC",
          probability: "alta",
          rationale: "Localización puntual + aducción horizontal.",
        },
      ],
      { nextNodeId: "sh_cross_body" }
    ),
    sh_posterior_cervical: conclusionNode(
      "sh_posterior_cervical",
      "Posterior / escapular — cribado cervical y local",
      "Dolor posterior o escapular: valorar referido cervical, disfunción escapular y manguito posterior. Spurling negativo no excluye cuello.",
      [
        {
          name: "Dolor referido cervical",
          probability: "alta",
          rationale: "Cuello, hormigueo o tests locales pobres.",
        },
        {
          name: "Sobrecarga posterior / escapular",
          probability: "media",
          rationale: "Sin patrón cervical claro.",
        },
      ]
    ),
    sh_neer: testNode(
      "sh_neer",
      "neer",
      branch("sh_rcrsp_cluster", "Dolor anterolateral familiar"),
      branch("sh_hawkins", "Neer no reproduce el dolor habitual")
    ),
    sh_hawkins: testNode(
      "sh_hawkins",
      "hawkins-kennedy",
      branch("sh_rcrsp_cluster", "Hawkins familiar"),
      branch("sh_jobe", "Hawkins no familiar")
    ),
    sh_jobe: testNode(
      "sh_jobe",
      "jobe-empty-can",
      branch("sh_cuff_weak", "Debilidad franca o dolor intenso"),
      branch("sh_drop_arm", "Jobe poco provocativo")
    ),
    sh_cuff_weak: conclusionNode(
      "sh_cuff_weak",
      "Compatible con afectación del manguito (valorar rotura si debilidad)",
      "Jobe débil o muy doloroso apoya manguito; debilidad franca + drop arm eleva rotura importante. No inventar tamaño.",
      [
        {
          name: "RCRSP / supraespinoso",
          probability: "alta",
          rationale: "Dolor o debilidad en empty can.",
        },
        {
          name: "Rotura importante de manguito",
          probability: "media",
          rationale: "Debilidad clara vs contralateral.",
        },
      ],
      { nextNodeId: "sh_drop_arm" }
    ),
    sh_drop_arm: testNode(
      "sh_drop_arm",
      "drop-arm",
      branch("sh_cuff_tear", "No controla el descenso"),
      branch("sh_apprehension", "Descenso controlado")
    ),
    sh_cuff_tear: conclusionNode(
      "sh_cuff_tear",
      "Compatible con rotura importante de manguito",
      "Drop arm + debilidad apoyan rotura sustancial (clínica). Imagen si déficit persiste. No completa vs parcial automática.",
      [
        {
          name: "Rotura importante del manguito",
          probability: "alta",
          rationale: "Incapacidad para controlar el descenso + debilidad.",
        },
      ]
    ),
    sh_apprehension: testNode(
      "sh_apprehension",
      "apprehension",
      branch("sh_instability", "Miedo / aprensión de que se salga"),
      branch("sh_painful_arc", "Solo dolor sin miedo")
    ),
    sh_instability: conclusionNode(
      "sh_instability",
      "Compatible con inestabilidad glenohumeral anterior",
      "Aprensión (miedo) ± relocation. Dolor sin aprensión ≠ inestabilidad.",
      [
        {
          name: "Inestabilidad anterior",
          probability: "alta",
          rationale: "Aprensión + historia de luxación/ABD-RE.",
        },
      ]
    ),
    sh_painful_arc: testNode(
      "sh_painful_arc",
      "painful-arc",
      branch("sh_rcrsp_cluster", "Arco 60–120° familiar"),
      branch("sh_posterior_cervical", "Sin arco típico")
    ),
    sh_speed: testNode(
      "sh_speed",
      "speed",
      branch("sh_anterior_cluster", "Dolor en surco familiar"),
      branch("sh_yergason", "Speed no familiar")
    ),
    sh_yergason: testNode(
      "sh_yergason",
      "yergason",
      branch("sh_anterior_cluster", "Dolor/salto en surco familiar"),
      branch("sh_rcrsp_cluster", "Yergason no familiar")
    ),
    sh_cross_body: testNode(
      "sh_cross_body",
      "cross-body",
      branch("sh_ac_cluster", "Dolor en la puntita AC"),
      branch("sh_rcrsp_cluster", "Dolor más deltoideo / no AC")
    ),
  },
};

/** Árbol codo — LET, medial, posterior, cubital. */
const ELBOW_TREE: ClinicalReasoningTree = {
  bodyPart: "elbow",
  title: "Razonamiento clínico — Codo",
  entryNodeId: "el_master_entry",
  entryByTestId: {
    cozen: "el_cozen",
    mill: "el_mill",
    "resisted-wrist-flexion": "el_resisted_flexion",
    "elbow-flexion-cubital": "el_cubital_flexion",
    phalen: "el_phalen_hint",
    tinel: "el_phalen_hint",
    spurling: "el_cervical_hint",
  },
  nodes: {
    el_master_entry: conclusionNode(
      "el_master_entry",
      "Codo — árbol maestro Physioguide",
      "Flujo: ¿neural/cuello? → localización (lateral/medial/posterior/anterior) → cluster LET (Cozen/Mill) o medial (flexión muñeca) o cubital (flexión codo) → diferencial. Nunca Cozen = diagnóstico confirmado.",
      [
        {
          name: "Enrutar por localización y síntomas neurales",
          probability: "alta",
          rationale:
            "Lateral → LET. Medial → golfista ± cubital. Posterior → olecranon. Anterior + pop → bíceps distal. Hormigueo → neural/cervical.",
        },
      ],
      { nextNodeId: "el_neural_gate" }
    ),
    el_neural_gate: testNode(
      "el_neural_gate",
      "route-elbow-neural",
      branch("el_neural_territory", "Hormigueo / cuello dominante"),
      branch("el_loc_lateral", "Sin cuadro neural dominante"),
      {
        title: "¿Síntomas neurales o cervicales dominantes?",
        description:
          "Hormigueo 4.º–5.º + flexión codo → cubital. 1.º–3.º nocturno → mediano/STC. Cuello + brazo → cervical. Solo dolor mecánico en epicóndilo → localización.",
        procedure: "Enrutado clínico (no test físico).",
      }
    ),
    el_neural_territory: testNode(
      "el_neural_territory",
      "route-elbow-neural-territory",
      branch("el_cubital_cluster", "4.º–5.º / borde cubital"),
      branch("el_cervical_hint", "Cuello / brazo / territorio atípico"),
      {
        title: "¿Territorio cubital (anular y meñique)?",
        description:
          "Anular + meñique ± empeora al apoyar el codo → rama cubital. Si cuello/brazo o 1.º–3.º → cervical/mediano.",
        procedure: "Enrutado por territorio neural.",
      }
    ),
    el_loc_lateral: testNode(
      "el_loc_lateral",
      "route-elbow-lateral",
      branch("el_let_cluster", "Epicóndilo lateral / agarre"),
      branch("el_loc_medial", "No es el dolor dominante"),
      {
        title: "¿Dolor lateral (codo de tenista)?",
        description: "Parte externa + agarre/ratón/verter → LET. Si interna → medial.",
        procedure: "Enrutado por localización.",
      }
    ),
    el_loc_medial: testNode(
      "el_loc_medial",
      "route-elbow-medial",
      branch("el_medial_cluster", "Epicóndilo medial"),
      branch("el_loc_posterior", "No es el dolor dominante"),
      {
        title: "¿Dolor medial (codo de golfista)?",
        description:
          "Parte interna + flexión/pronación → epicondilalgia medial; cribado cubital obligatorio.",
        procedure: "Enrutado por localización.",
      }
    ),
    el_loc_posterior: testNode(
      "el_loc_posterior",
      "route-elbow-posterior",
      branch("el_posterior_cluster", "Olecranon / punta posterior"),
      branch("el_anterior_gate", "No es posterior"),
      {
        title: "¿Dolor posterior (olecranon)?",
        description:
          "Punta del codo ± hinchazón → bursitis/contusión. Si no, valorar anterior (bíceps distal) u otro.",
        procedure: "Enrutado por localización.",
      }
    ),
    el_anterior_gate: testNode(
      "el_anterior_gate",
      "route-elbow-anterior",
      branch("el_distal_biceps_cluster", "Anterior + pop / debilidad flexión-supinación"),
      branch("el_unclear_cluster", "Sin patrón claro"),
      {
        title: "¿Dolor anterior con pop o debilidad?",
        description:
          "Pop + hueco en antebrazo + debilidad flexión/supinación → sospecha bíceps distal. Sin eso → ampliar anamnesis.",
        procedure: "Enrutado clínico de trauma/rotura.",
      }
    ),
    el_let_cluster: conclusionNode(
      "el_let_cluster",
      "Compatible con epicondilalgia lateral (LET)",
      "Cluster: epicóndilo lateral + Cozen/Mill familiar + agarre. No confirmado por un test. Cribar cervical/PIN si hormigueo.",
      [
        {
          name: "Tendinopatía extensora / LET",
          probability: "alta",
          rationale: "Patrón de carga lateral familiar.",
        },
        {
          name: "Referido cervical / PIN",
          probability: "media",
          rationale: "Si cuello u hormigueo asociados.",
        },
      ],
      { nextNodeId: "el_cozen" }
    ),
    el_medial_cluster: conclusionNode(
      "el_medial_cluster",
      "Compatible con epicondilalgia medial (± cubital)",
      "Dolor medial + flexión muñeca/pronación. Si parestesias 4.º–5.º → túnel cubital coexistente o dominante.",
      [
        {
          name: "Epicondilalgia medial",
          probability: "alta",
          rationale: "Carga flexora-pronadora.",
        },
        {
          name: "Neuropatía cubital en el codo",
          probability: "media",
          rationale: "Hormigueo anular/meñique + flexión codo.",
        },
      ],
      { nextNodeId: "el_resisted_flexion" }
    ),
    el_posterior_cluster: conclusionNode(
      "el_posterior_cluster",
      "Compatible con patología posterior (olecranon)",
      "Bursitis olecraneana / contusión / sobrecarga de tríceps. No forzar LET ni medial si el epicóndilo no es familiar.",
      [
        {
          name: "Bursitis olecraneana / contusión",
          probability: "alta",
          rationale: "Punta posterior ± hinchazón.",
        },
        {
          name: "Tendinopatía de tríceps / sobrecarga",
          probability: "media",
          rationale: "Dolor al extender el codo contra resistencia.",
        },
      ]
    ),
    el_distal_biceps_cluster: conclusionNode(
      "el_distal_biceps_cluster",
      "Sospecha de lesión de bíceps distal — valoración médica",
      "Pop + debilidad flexión/supinación ± hueco. No tratar como epicondilalgia. Imagen/cirugía según protocolo.",
      [
        {
          name: "Rotura / lesión de bíceps distal (sospecha)",
          probability: "alta",
          rationale: "Trauma + pop + déficit de fuerza.",
        },
      ]
    ),
    el_unclear_cluster: conclusionNode(
      "el_unclear_cluster",
      "Cuadro de codo sin patrón epicondílico claro",
      "Revisar trauma, cabeza radial, neural y cervical. Evitar etiquetar LET sin cluster.",
      [
        {
          name: "Cuadro inespecífico — ampliar anamnesis",
          probability: "alta",
          rationale: "Sin localización ni carga familiar típicas.",
        },
        {
          name: "Referido cervical / neural",
          probability: "media",
          rationale: "Si hay cuello o parestesias parciales.",
        },
      ],
      { nextNodeId: "el_cervical_hint" }
    ),
    el_cubital_cluster: conclusionNode(
      "el_cubital_cluster",
      "Compatible con neuropatía cubital en el codo",
      "Parestesias 4.º–5.º + flexión/apoyo del codo. Flexión de codo / Tinel apoyan; no confirman. No llamar STC.",
      [
        {
          name: "Neuropatía cubital (túnel cubital)",
          probability: "alta",
          rationale: "Territorio cubital + provocación en flexión.",
        },
        {
          name: "Epicondilalgia medial coexistente",
          probability: "media",
          rationale: "Si también duele el epicóndilo medial a la carga.",
        },
      ],
      { nextNodeId: "el_cubital_flexion" }
    ),
    el_cervical_hint: conclusionNode(
      "el_cervical_hint",
      "Compatible con referido cervical / neural proximal",
      "Cuello + brazo o territorio atípico. Spurling/ULTT en árbol de cuello; no forzar LET.",
      [
        {
          name: "Referido cervical / irritación neural",
          probability: "alta",
          rationale: "Síntomas proximales o cuello dominante.",
        },
        {
          name: "PIN / túnel radial",
          probability: "media",
          rationale: "Si debilidad extensión dedos/muñeca sin epicóndilo claro.",
        },
      ],
      { nextNodeId: "el_phalen_hint" }
    ),
    el_phalen_hint: conclusionNode(
      "el_phalen_hint",
      "Cribado neural distal (STC vs cubital)",
      "Integrar Phalen/Tinel (mediano) o flexión de codo (cubital) según territorio. Ver árbol muñeca/dedos si STC.",
      [
        {
          name: "Valorar STC vs cubital vs cervical",
          probability: "alta",
          rationale: "Según dedos afectos y cuello.",
        },
      ]
    ),
    el_cozen: testNode(
      "el_cozen",
      "cozen",
      branch("el_let_cluster", "Dolor epicóndilo lateral familiar"),
      branch("el_mill", "Cozen no familiar")
    ),
    el_mill: testNode(
      "el_mill",
      "mill",
      branch("el_let_cluster", "Mill familiar"),
      branch("el_loc_medial", "Mill no familiar")
    ),
    el_resisted_flexion: testNode(
      "el_resisted_flexion",
      "resisted-wrist-flexion",
      branch("el_medial_cluster", "Dolor epicóndilo medial familiar"),
      branch("el_cubital_flexion", "No familiar — cribado cubital")
    ),
    el_cubital_flexion: testNode(
      "el_cubital_flexion",
      "elbow-flexion-cubital",
      branch("el_cubital_cluster", "Parestesias 4.º–5.º familiares"),
      branch("el_medial_cluster", "Sin neural cubital — priorizar medial local")
    ),
  },
};

/** Árbol muñeca/mano — escafoides, STC/cubital, De Quervain, TFCC, CMC. */
const WRIST_HAND_TREE: ClinicalReasoningTree = {
  bodyPart: "wrist_hand",
  title: "Razonamiento clínico — Muñeca / Mano",
  entryNodeId: "wh_master_entry",
  entryByTestId: {
    phalen: "wh_phalen",
    tinel: "wh_tinel",
    ultt: "wh_ultt",
    finkelstein: "wh_finkelstein",
    "snuffbox-palpation": "wh_snuffbox",
    "thumb-axial-load": "wh_thumb_axial",
    "tfcc-ulnar-load": "wh_tfcc",
    "cmc-grind": "wh_cmc_grind",
    "elbow-flexion-cubital": "wh_cubital_flexion",
  },
  nodes: {
    wh_master_entry: conclusionNode(
      "wh_master_entry",
      "Muñeca / mano — árbol maestro Physioguide",
      "Flujo: FOOSH/tabaquera (escafoides) → neural (STC vs cubital/Guyon vs cervical) → radial (De Quervain/CMC) → cubital (TFCC) → mecánico. Nunca Phalen = STC confirmado.",
      [
        {
          name: "Enrutar por trauma, territorio neural y localización",
          probability: "alta",
          rationale:
            "Tabaquera → escafoides. Noche mediano → STC. Meñique → cubital. Radial pulgar → De Quervain/CMC. Lado cubital → TFCC.",
        },
      ],
      { nextNodeId: "wh_scaphoid_gate" }
    ),
    wh_scaphoid_gate: testNode(
      "wh_scaphoid_gate",
      "route-wrist-scaphoid",
      branch("wh_scaphoid_path", "FOOSH + tabaquera / sospecha ósea"),
      branch("wh_neural_gate", "Sin sospecha escafoides dominante"),
      {
        title: "¿Trauma FOOSH con dolor en tabaquera?",
        description:
          "Caída sobre la mano + valle junto al pulgar → priorizar imagen (escafoides). RX inicial puede ser normal.",
        procedure: "Enrutado clínico de trauma.",
        evidenceNote: "No tranquilizar «solo esguince» sin pensar en escafoides.",
      }
    ),
    wh_scaphoid_path: conclusionNode(
      "wh_scaphoid_path",
      "Sospecha de escafoides — confirmar tabaquera / carga axial",
      "FOOSH + dolor radial. Palpación de tabaquera y carga axial apoyan el cluster; no confirman. Imagen obligada si positivo.",
      [
        {
          name: "Fractura de escafoides (sospecha clínica)",
          probability: "alta",
          rationale: "Trauma FOOSH + tabaquera.",
        },
      ],
      { nextNodeId: "wh_snuffbox" }
    ),
    wh_neural_gate: testNode(
      "wh_neural_gate",
      "route-wrist-neural",
      branch("wh_neural_territory", "Parestesias / hormigueo dominante"),
      branch("wh_radial_gate", "Sin cuadro neural dominante"),
      {
        title: "¿Hormigueo o parestesias dominantes?",
        description:
          "Noche / territorio digital → rama neural. Solo dolor mecánico de muñeca → radial/TFCC/mecánico.",
        procedure: "Enrutado por territorio neural.",
      }
    ),
    wh_neural_territory: testNode(
      "wh_neural_territory",
      "route-wrist-neural-territory",
      branch("wh_cts_cluster", "1.º–3.º / nocturno / mediano"),
      branch("wh_cubital_wrist_cluster", "Solo meñique / Guyon / cubital"),
      {
        title: "¿Territorio mediano (STC)?",
        description:
          "Pulgar–índice–medio ± noche/sacudir → STC. Solo meñique → cubital (codo o Guyon), no STC. Cuello → cervical.",
        procedure: "Enrutado por territorio neural.",
      }
    ),
    wh_radial_gate: testNode(
      "wh_radial_gate",
      "route-wrist-dequervain",
      branch("wh_radial_subtype", "Estiloides radial / base pulgar"),
      branch("wh_ulnar_gate", "No es el dolor radial dominante"),
      {
        title: "¿Dolor radial / pulgar?",
        description:
          "Borde del pulgar o estiloides → De Quervain vs CMC. Si lado meñique → TFCC. Si otra zona → mecánico.",
        procedure: "Enrutado por localización.",
      }
    ),
    wh_radial_subtype: testNode(
      "wh_radial_subtype",
      "route-wrist-radial-subtype",
      branch("wh_dequervain_cluster", "Estiloides / 1.er compartimento (De Quervain)"),
      branch("wh_cmc_cluster", "Base del pulgar / CMC"),
      {
        title: "¿Dolor en estiloides o en la base del pulgar (CMC)?",
        description:
          "Estiloides + uso del pulgar → De Quervain. Base CMC + edad/crepitación → artrosis CMC (grind).",
        procedure: "Enrutado por localización exacta.",
      }
    ),
    wh_ulnar_gate: testNode(
      "wh_ulnar_gate",
      "route-wrist-ulnar",
      branch("wh_tfcc_cluster", "Lado cubital / meñique / torsión-apoyo"),
      branch("wh_mechanical_cluster", "Otra zona / mecánico inespecífico"),
      {
        title: "¿Dolor en el lado cubital (TFCC)?",
        description:
          "Dolor lado meñique tras torsión, apoyo o rotación → TFCC. Si no → esguince/sobrecarga inespecífica.",
        procedure: "Enrutado por localización.",
      }
    ),
    wh_scaphoid_cluster: conclusionNode(
      "wh_scaphoid_cluster",
      "Sospecha de fractura de escafoides — priorizar imagen",
      "FOOSH + tabaquera ± carga axial familiar. No «solo esguince». RX inicial puede ser normal; seguimiento/RM si persiste.",
      [
        {
          name: "Fractura de escafoides (sospecha clínica)",
          probability: "alta",
          rationale: "Cluster trauma + tabaquera ± axial.",
        },
      ]
    ),
    wh_cts_cluster: conclusionNode(
      "wh_cts_cluster",
      "Compatible con síndrome del túnel carpiano",
      "Historia nocturna + territorio mediano ± Phalen/Tinel. Tests negativos no descartan. Meñique solo ≠ STC.",
      [
        {
          name: "Túnel carpiano (STC)",
          probability: "alta",
          rationale: "Patrón clásico de parestesias medianas.",
        },
        {
          name: "Referido cervical / otra neuropatía",
          probability: "media",
          rationale: "Si cuello o territorio atípico.",
        },
      ],
      { nextNodeId: "wh_phalen" }
    ),
    wh_cubital_wrist_cluster: conclusionNode(
      "wh_cubital_wrist_cluster",
      "Compatible con neuropatía cubital (codo o Guyon)",
      "Solo meñique/borde cubital. Flexión de codo apoya túnel cubital; trauma muñeca/ciclismo → Guyon. No llamar STC.",
      [
        {
          name: "Neuropatía cubital (codo o Guyon)",
          probability: "alta",
          rationale: "Territorio 4.º–5.º sin patrón mediano.",
        },
        {
          name: "Referido cervical (C8–T1)",
          probability: "media",
          rationale: "Si cuello o brazo proximal.",
        },
      ],
      { nextNodeId: "wh_cubital_flexion" }
    ),
    wh_dequervain_cluster: conclusionNode(
      "wh_dequervain_cluster",
      "Compatible con De Quervain",
      "Estiloides radial + uso del pulgar ± Finkelstein familiar. Eichhoff solo da falsos positivos. Diferencial CMC.",
      [
        {
          name: "Tenosinovitis de De Quervain",
          probability: "alta",
          rationale: "1.er compartimento / pulgar.",
        },
        {
          name: "Artrosis CMC / escafoides",
          probability: "media",
          rationale: "Si dolor más en base del pulgar o trauma.",
        },
      ],
      { nextNodeId: "wh_finkelstein" }
    ),
    wh_cmc_cluster: conclusionNode(
      "wh_cmc_cluster",
      "Compatible con artrosis / dolor CMC del pulgar",
      "Base del pulgar + pinza/apertura de tarros. Grind apoya; no confirma grado. Diferencial De Quervain.",
      [
        {
          name: "Artrosis CMC del pulgar",
          probability: "alta",
          rationale: "Base CMC + carga axial/rotación familiar.",
        },
        {
          name: "De Quervain coexistente",
          probability: "media",
          rationale: "Si también duele el estiloides.",
        },
      ],
      { nextNodeId: "wh_cmc_grind" }
    ),
    wh_tfcc_cluster: conclusionNode(
      "wh_tfcc_cluster",
      "Compatible con lesión / irritación del TFCC",
      "Dolor cubital + torsión/apoyo ± carga cubital familiar. No confirma rotura. Imagen si trauma + persistencia.",
      [
        {
          name: "TFCC / complejo fibrocartílago triangular",
          probability: "alta",
          rationale: "Lado cubital + carga/rotación familiar.",
        },
        {
          name: "Esguince cubital / estiloides cubital",
          probability: "media",
          rationale: "Trauma sin cluster TFCC claro.",
        },
      ],
      { nextNodeId: "wh_tfcc" }
    ),
    wh_mechanical_cluster: conclusionNode(
      "wh_mechanical_cluster",
      "Patología mecánica de muñeca (sin cluster claro)",
      "Esguince, sobrecarga o tendinopatía inespecífica. Cribar cervical si síntomas mixtos.",
      [
        {
          name: "Esguince / sobrecarga de muñeca",
          probability: "alta",
          rationale: "Sin STC, De Quervain, TFCC ni escafoides típicos.",
        },
        {
          name: "Referido cervical / neural",
          probability: "media",
          rationale: "Si hay cuello o parestesias parciales.",
        },
      ],
      { nextNodeId: "wh_ultt" }
    ),
    wh_cervical_cluster: conclusionNode(
      "wh_cervical_cluster",
      "Compatible con componente cervical / neurodinámico",
      "ULTT/Spurling apoyan referido; no confirman raíz. Integrar cuello.",
      [
        {
          name: "Referido cervical / irritación neural",
          probability: "alta",
          rationale: "Síntomas proximales o ULTT familiar.",
        },
      ]
    ),
    wh_snuffbox: testNode(
      "wh_snuffbox",
      "snuffbox-palpation",
      branch("wh_scaphoid_cluster", "Tabaquera familiar"),
      branch("wh_thumb_axial", "Tabaquera no clara — carga axial")
    ),
    wh_thumb_axial: testNode(
      "wh_thumb_axial",
      "thumb-axial-load",
      branch("wh_scaphoid_cluster", "Dolor radial/tabaquera familiar"),
      branch("wh_ulnar_gate", "Sin cluster escafoides — otras ramas")
    ),
    wh_phalen: testNode(
      "wh_phalen",
      "phalen",
      branch("wh_cts_cluster", "Parestesias medianas familiares"),
      branch("wh_tinel", "Phalen no familiar")
    ),
    wh_tinel: testNode(
      "wh_tinel",
      "tinel",
      branch("wh_cts_cluster", "Tinel mediano familiar"),
      branch("wh_ultt", "Tinel no familiar")
    ),
    wh_cubital_flexion: testNode(
      "wh_cubital_flexion",
      "elbow-flexion-cubital",
      branch("wh_cubital_wrist_cluster", "Parestesias 4.º–5.º familiares"),
      branch("wh_ultt", "Sin cubital claro — cribado cervical")
    ),
    wh_ultt: testNode(
      "wh_ultt",
      "ultt",
      branch("wh_cervical_cluster", "Tensión neural / síntomas proximales"),
      branch("wh_mechanical_cluster", "ULTT no familiar")
    ),
    wh_finkelstein: testNode(
      "wh_finkelstein",
      "finkelstein",
      branch("wh_dequervain_cluster", "Dolor estiloides radial familiar"),
      branch("wh_cmc_grind", "No familiar — valorar CMC")
    ),
    wh_cmc_grind: testNode(
      "wh_cmc_grind",
      "cmc-grind",
      branch("wh_cmc_cluster", "Dolor/crepitación base pulgar familiar"),
      branch("wh_ulnar_gate", "Grind no familiar")
    ),
    wh_tfcc: testNode(
      "wh_tfcc",
      "tfcc-ulnar-load",
      branch("wh_tfcc_cluster", "Dolor cubital familiar"),
      branch("wh_mechanical_cluster", "Carga cubital no familiar")
    ),
  },
};

/** Árbol dedos — STC vs local (trigger, jersey, mallet, UCL). */
const FINGER_TREE: ClinicalReasoningTree = {
  bodyPart: "finger",
  title: "Razonamiento clínico — Dedos",
  entryNodeId: "fg_master_entry",
  entryByTestId: {
    tinel: "fg_tinel",
    phalen: "fg_phalen",
    "thumb-ucl-stress": "fg_ucl_stress",
    "elbow-flexion-cubital": "fg_cubital_flexion",
  },
  nodes: {
    fg_master_entry: conclusionNode(
      "fg_master_entry",
      "Dedos — enrutado Physioguide",
      "Flujo: ¿parestesias? (mediano vs cubital) → trauma (jersey/mallet/UCL) → trigger/A1 → esguince IF. Phalen/Tinel apoyan STC; no confirman. Meñique solo ≠ STC.",
      [
        {
          name: "Enrutar neural vs trauma vs local",
          probability: "alta",
          rationale:
            "Noche + 1.º–3.º → STC. Meñique → cubital. Chasquido → A1. Trauma flexión/extensión → jersey/mallet.",
        },
      ],
      { nextNodeId: "fg_neural_gate" }
    ),
    fg_neural_gate: testNode(
      "fg_neural_gate",
      "route-finger-neural",
      branch("fg_neural_territory", "Parestesias / hormigueo dominante"),
      branch("fg_trauma_gate", "Sin cuadro neural dominante"),
      {
        title: "¿Hormigueo o parestesias dominantes?",
        description:
          "Hormigueo nocturno o al usar la mano → rama neural. Solo dolor/bloqueo mecánico del dedo → trauma/local.",
        procedure: "Enrutado clínico.",
      }
    ),
    fg_neural_territory: testNode(
      "fg_neural_territory",
      "route-finger-neural-territory",
      branch("fg_cts_cluster", "1.º–3.º / territorio mediano / nocturno"),
      branch("fg_cubital_cluster", "Solo meñique / borde cubital"),
      {
        title: "¿Territorio mediano (pulgar–índice–medio)?",
        description:
          "1.º–3.º ± mitad radial del anular + noche/sacudir → STC. Solo meñique → cubital (no STC). Cuello atípico → cervical.",
        procedure: "Enrutado por territorio neural.",
      }
    ),
    fg_trauma_gate: testNode(
      "fg_trauma_gate",
      "route-finger-trauma",
      branch("fg_trauma_type", "Trauma agudo / deporte / golpe"),
      branch("fg_trigger_gate", "Sin trauma dominante"),
      {
        title: "¿Hubo trauma agudo en el dedo?",
        description:
          "Balón, agarre de camiseta, caída, valgo de pulgar → rama trauma. Sin trauma → trigger o esguince por uso.",
        procedure: "Enrutado clínico.",
      }
    ),
    fg_trauma_type: testNode(
      "fg_trauma_type",
      "route-finger-trauma-type",
      branch("fg_jersey_mallet_gate", "Flexión forzada / golpe en punta"),
      branch("fg_thumb_gate", "Valgo / esguince de pulgar u otro"),
      {
        title: "¿Mecanismo jersey/mallet (flexión o golpe en punta)?",
        description:
          "Agarre forzado + no flexiona IFP → jersey. Golpe en punta + no extiende IFD → mallet. Valgo MCP pulgar → UCL.",
        procedure: "Enrutado por mecanismo.",
      }
    ),
    fg_jersey_mallet_gate: testNode(
      "fg_jersey_mallet_gate",
      "route-finger-jersey-mallet",
      branch("fg_jersey_cluster", "No flexiona activamente la IFP (jersey)"),
      branch("fg_mallet_cluster", "No extiende activamente la IFD (mallet)"),
      {
        title: "¿Falla la flexión activa de la IFP?",
        description:
          "Incapacidad de flexionar la IFP tras trauma en flexión → jersey (FDP). Si el déficit es extensión de la punta (IFD) → mallet.",
        procedure: "Test activo de flexión IFP vs extensión IFD.",
        evidenceNote:
          "Jersey/mallet: déficit activo; pasivo puede estar conservado. Valoración médica/imagen.",
      }
    ),
    fg_thumb_gate: testNode(
      "fg_thumb_gate",
      "route-finger-thumb",
      branch("fg_ucl_cluster", "MCP pulgar / mecanismo en valgo"),
      branch("fg_sprain_cluster", "Esguince IF / otra lesión local"),
      {
        title: "¿Dolor/inestabilidad en la base del pulgar (MCP)?",
        description:
          "Tras forzar el pulgar hacia fuera (esquí, balón) → UCL. Si IF de otro dedo tras torsión → esguince IF.",
        procedure: "Enrutado por localización y mecanismo.",
      }
    ),
    fg_trigger_gate: testNode(
      "fg_trigger_gate",
      "route-finger-trigger",
      branch("fg_trigger_cluster", "Chasquido / bloqueo / dolor A1"),
      branch("fg_sprain_cluster", "Sin trigger claro"),
      {
        title: "¿Chasquido o bloqueo al flexionar (trigger)?",
        description:
          "Nudillo palmar (A1) + chasquido/bloqueo matutino → trigger. Sin eso → esguince/local inespecífico.",
        procedure: "Enrutado clínico.",
      }
    ),
    fg_cts_cluster: conclusionNode(
      "fg_cts_cluster",
      "Compatible con STC (síntomas digitales)",
      "Historia nocturna + territorio mediano. Phalen/Tinel apoyan el cluster; negativos no descartan. Cribar cervical.",
      [
        {
          name: "Túnel carpiano (STC)",
          probability: "alta",
          rationale: "Patrón de parestesias medianas.",
        },
        {
          name: "Referido cervical",
          probability: "media",
          rationale: "Si cuello o territorio atípico.",
        },
      ],
      { nextNodeId: "fg_tinel" }
    ),
    fg_cubital_cluster: conclusionNode(
      "fg_cubital_cluster",
      "Compatible con neuropatía cubital (no STC)",
      "Solo meñique/borde cubital. No etiquetar túnel carpiano. Flexión de codo / Tinel cubital apoyan.",
      [
        {
          name: "Neuropatía cubital",
          probability: "alta",
          rationale: "Territorio 4.º–5.º sin patrón mediano.",
        },
        {
          name: "Referido cervical (C8–T1)",
          probability: "media",
          rationale: "Si cuello o brazo proximal asociados.",
        },
      ],
      { nextNodeId: "fg_cubital_flexion" }
    ),
    fg_jersey_cluster: conclusionNode(
      "fg_jersey_cluster",
      "Sospecha de jersey finger (FDP) — valoración médica",
      "Trauma en flexión + incapacidad de flexión activa IFP. No esguince simple. Imagen/cirugía según protocolo.",
      [
        {
          name: "Jersey finger / rotura FDP (sospecha)",
          probability: "alta",
          rationale: "Déficit activo de flexión IFP post-trauma.",
        },
      ]
    ),
    fg_mallet_cluster: conclusionNode(
      "fg_mallet_cluster",
      "Sospecha de mallet finger — valoración / inmovilización",
      "Golpe en punta + no mantiene extensión activa IFD. RX para avulsión. No tratar solo como esguince.",
      [
        {
          name: "Mallet finger (extensor IFD)",
          probability: "alta",
          rationale: "Déficit activo de extensión de la punta.",
        },
      ]
    ),
    fg_ucl_cluster: conclusionNode(
      "fg_ucl_cluster",
      "Compatible con lesión UCL del pulgar",
      "Mecanismo en valgo + dolor/inestabilidad MCP. Estrés valgo apoya; no confirma grado. Imagen si persiste.",
      [
        {
          name: "Lesión UCL pulgar (skier's / gamekeeper)",
          probability: "alta",
          rationale: "Valgo + MCP ulnar familiar ± laxitud.",
        },
        {
          name: "Contusión MCP / esguince parcial",
          probability: "media",
          rationale: "Dolor sin inestabilidad clara.",
        },
      ],
      { nextNodeId: "fg_ucl_stress" }
    ),
    fg_trigger_cluster: conclusionNode(
      "fg_trigger_cluster",
      "Compatible con trigger finger / tenosinovitis A1",
      "Dolor palmar A1 + chasquido/bloqueo. Diferencial: artrosis IF, esguince, STC si hormigueo domina.",
      [
        {
          name: "Trigger finger / tenosinovitis A1",
          probability: "alta",
          rationale: "Chasquido o bloqueo en flexión + A1.",
        },
        {
          name: "Artrosis interfalángica",
          probability: "media",
          rationale: "Rigidez/dolor IF sin bloqueo típico A1.",
        },
      ]
    ),
    fg_sprain_cluster: conclusionNode(
      "fg_sprain_cluster",
      "Compatible con esguince interfalángico / local",
      "Trauma o sobrecarga con flexión/extensión activa conservada. Si falla FDP o mallet → no esguince simple.",
      [
        {
          name: "Esguince interfalángico",
          probability: "alta",
          rationale: "Dolor articular IF + función activa parcial.",
        },
        {
          name: "Contusión / sobrecarga digital",
          probability: "media",
          rationale: "Sin inestabilidad ni déficit tendinoso.",
        },
      ]
    ),
    fg_tinel: testNode(
      "fg_tinel",
      "tinel",
      branch("fg_cts_cluster", "Parestesias medianas familiares"),
      branch("fg_phalen", "Tinel no familiar")
    ),
    fg_phalen: testNode(
      "fg_phalen",
      "phalen",
      branch("fg_cts_cluster", "Phalen familiar"),
      branch("fg_trauma_gate", "Phalen no familiar — valorar local")
    ),
    fg_cubital_flexion: testNode(
      "fg_cubital_flexion",
      "elbow-flexion-cubital",
      branch("fg_cubital_cluster", "Parestesias 4.º–5.º familiares"),
      branch("fg_cts_cluster", "No cubital — reconsiderar mediano/cervical")
    ),
    fg_ucl_stress: testNode(
      "fg_ucl_stress",
      "thumb-ucl-stress",
      branch("fg_ucl_cluster", "Dolor/laxitud MCP familiar"),
      branch("fg_sprain_cluster", "Sin inestabilidad UCL")
    ),
  },
};

/** Árbol cuello — Wainner (Spurling/ULTT/distracción/rotación) + mecánico. */
const NECK_TREE: ClinicalReasoningTree = {
  bodyPart: "neck",
  title: "Razonamiento clínico — Cuello",
  entryNodeId: "nk_master_entry",
  entryByTestId: {
    spurling: "nk_spurling",
    ultt: "nk_ultt",
    "cervical-distraction": "nk_distraction",
  },
  nodes: {
    nk_master_entry: conclusionNode(
      "nk_master_entry",
      "Cuello — árbol maestro Physioguide",
      "Flujo: red flags/trauma (C-spine) → ¿radicular vs mecánico vs cefalea? → cluster Wainner (Spurling + ULTT + distracción + rotación <60°) → diferencial hombro. Nunca Spurling = hernia confirmada.",
      [
        {
          name: "Enrutar por seguridad y patrón radicular vs local",
          probability: "alta",
          rationale:
            "Trauma → imagen. Brazo/hormigueo → Wainner. Solo cuello → mecánico. Nuca→sien → cervicogénica.",
        },
      ],
      { nextNodeId: "nk_trauma_gate" }
    ),
    nk_trauma_gate: testNode(
      "nk_trauma_gate",
      "route-neck-trauma",
      branch("nk_trauma_cluster", "Trauma mayor / inestable / mielopatía / disección"),
      branch("nk_radicular_gate", "Estable — sin RF de trauma"),
      {
        title: "¿Trauma cervical o red flag urgente?",
        description:
          "Trauma mayor → C-spine/NEXUS (no Spurling). Mielopatía, disección, VBI o meningismo → urgencias.",
        procedure: "Enrutado de seguridad.",
      }
    ),
    nk_radicular_gate: testNode(
      "nk_radicular_gate",
      "route-neck-radicular",
      branch("nk_radiculopathy_cluster", "Brazo / hormigueo / patrón radicular"),
      branch("nk_headache_gate", "Sin irradiación a brazo dominante"),
      {
        title: "¿Síntomas en brazo (dolor/hormigueo)?",
        description:
          "Irradiación/hormigueo → cluster Wainner. Solo local o con cefalea → ramas mecánicas/cervicogénicas.",
        procedure: "Enrutado clínico.",
      }
    ),
    nk_headache_gate: testNode(
      "nk_headache_gate",
      "route-neck-headache",
      branch("nk_cervicogenic_cluster", "Cefalea occipital → sien relacionada con cuello"),
      branch("nk_mechanical_cluster", "Solo dolor local de cuello"),
      {
        title: "¿Cefalea relacionada con el cuello?",
        description:
          "Nuca → sien/ojo que empeora al mover el cuello → cervicogénica. Solo cuello local → mecánica.",
        procedure: "Enrutado clínico.",
      }
    ),
    nk_trauma_cluster: conclusionNode(
      "nk_trauma_cluster",
      "Priorizar imagen / urgencias — no tests provocativos",
      "Trauma no bajo riesgo, mielopatía, disección o meningismo. Canadian C-spine/NEXUS. No Spurling ni distracción.",
      [
        {
          name: "Trauma cervical / RF — valoración urgente",
          probability: "alta",
          rationale: "Seguridad antes que cluster radicular.",
        },
      ]
    ),
    nk_radiculopathy_cluster: conclusionNode(
      "nk_radiculopathy_cluster",
      "Compatible con radiculopatía cervical",
      "Cluster Wainner (ULTT + Spurling + distracción que alivia + rotación ipsilateral <60°). Spurling negativo no excluye. No inventar nivel de raíz ni hernia confirmada.",
      [
        {
          name: "Radiculopatía cervical",
          probability: "alta",
          rationale: "Patrón brazo + provocación cervical.",
        },
        {
          name: "RCRSP / hombro coexistente",
          probability: "media",
          rationale: "Si dolor anterolateral sin neural claro.",
        },
      ],
      { nextNodeId: "nk_rotation_gate" }
    ),
    nk_cervicogenic_cluster: conclusionNode(
      "nk_cervicogenic_cluster",
      "Compatible con cefalea cervicogénica (desde cuello)",
      "Cefalea unilateral occipital→sien + provocación cervical. Spurling puede apoyar si reproduce cefalea familiar; no confirma. Ver también árbol de cabeza.",
      [
        {
          name: "Cefalea cervicogénica",
          probability: "alta",
          rationale: "Provocación cervical familiar de la cefalea.",
        },
        {
          name: "Cervicalgia mecánica coexistente",
          probability: "media",
          rationale: "Dolor local + cefalea parcial.",
        },
      ],
      { nextNodeId: "nk_spurling" }
    ),
    nk_mechanical_cluster: conclusionNode(
      "nk_mechanical_cluster",
      "Compatible con cervicalgia mecánica",
      "Dolor local + movimiento mecánico + neural no familiar. No forzar hernia. Diferencial hombro si dolor anterolateral.",
      [
        {
          name: "Cervicalgia mecánica / sobrecarga",
          probability: "alta",
          rationale: "Sin cluster radicular.",
        },
        {
          name: "Disfunción articular / postural",
          probability: "media",
          rationale: "Pantallas, postura, rigidez local.",
        },
      ],
      { nextNodeId: "nk_shoulder_gate" }
    ),
    nk_rotation_gate: testNode(
      "nk_rotation_gate",
      "route-neck-rotation",
      branch("nk_spurling", "Rotación ipsilateral <60° o dolor al girar"),
      branch("nk_ultt", "Rotación conservada — seguir cluster"),
      {
        title: "¿Rotación cervical ipsilateral limitada (<60°)?",
        description:
          "Parte del cluster Wainner. Limitación + brazo → eleva radiculopatía. Rotación libre no excluye.",
        procedure: "ROM activo de rotación cervical (comparar lados).",
        evidenceNote: "Wainner Spine 2003: rotación ipsilateral <60° en el cluster.",
      }
    ),
    nk_shoulder_gate: testNode(
      "nk_shoulder_gate",
      "route-neck-shoulder",
      branch("nk_shoulder_diff", "Dolor anterolateral de hombro dominante"),
      branch("nk_ultt", "Sin patrón de hombro dominante"),
      {
        title: "¿El dolor parece más de hombro que de cuello?",
        description:
          "Anterolateral + elevación/arco sin hormigueo → cribar RCRSP (árbol hombro). Si cuello local → ULTT de cribado.",
        procedure: "Enrutado diferencial cuello vs hombro.",
      }
    ),
    nk_shoulder_diff: conclusionNode(
      "nk_shoulder_diff",
      "Diferencial hombro (RCRSP) — no cerrar solo como cervical",
      "Dolor anterolateral sin neural claro. Continuar con árbol de hombro (arco, Neer/Hawkins, Jobe). Puede coexistir con cervicalgia.",
      [
        {
          name: "RCRSP / patología de hombro (diferencial)",
          probability: "alta",
          rationale: "Patrón de elevación sin cluster radicular.",
        },
        {
          name: "Cervicalgia mecánica coexistente",
          probability: "media",
          rationale: "Si también hay dolor local de cuello.",
        },
      ]
    ),
    nk_spurling: testNode(
      "nk_spurling",
      "spurling",
      branch("nk_radiculopathy_cluster", "Reproduce dolor/hormigueo de brazo familiar"),
      branch("nk_distraction", "Spurling no familiar / solo cuello")
    ),
    nk_distraction: testNode(
      "nk_distraction",
      "cervical-distraction",
      branch("nk_radiculopathy_cluster", "Alivia síntomas de brazo familiares"),
      branch("nk_ultt", "Sin alivio — continuar ULTT")
    ),
    nk_ultt: testNode(
      "nk_ultt",
      "ultt",
      branch("nk_radiculopathy_cluster", "Reproduce síntomas familiares de brazo"),
      branch("nk_mechanical_cluster", "Solo tirantez inespecífica")
    ),
  },
};

/** Árbol espalda — cauda, ciática (SLR/cruzado), mecánico, SI, inflamatorio. */
const BACK_TREE: ClinicalReasoningTree = {
  bodyPart: "back",
  title: "Razonamiento clínico — Espalda",
  entryNodeId: "bk_master_entry",
  entryByTestId: {
    "slr-lasegue": "bk_slr",
    "crossed-slr": "bk_crossed_slr",
    kemp: "bk_kemp",
    schober: "bk_schober",
    faber: "bk_faber",
  },
  nodes: {
    bk_master_entry: conclusionNode(
      "bk_master_entry",
      "Lumbar — árbol maestro Physioguide",
      "Flujo: cauda/RF → trauma/fractura → ¿ciática vs mecánico vs nalga/SI vs inflamatorio? → SLR ± cruzado / Kemp / FABER / Schober. Nunca SLR = hernia; nunca Kemp = faceta.",
      [
        {
          name: "Enrutar por urgencia y patrón radicular vs local",
          probability: "alta",
          rationale:
            "Cauda → hospital. Pierna bajo rodilla → ciática. Nalga/SI → FABER. Rigidez inflamatoria → Schober. Solo lumbar → mecánico.",
        },
      ],
      { nextNodeId: "bk_cauda_gate" }
    ),
    bk_cauda_gate: testNode(
      "bk_cauda_gate",
      "route-back-cauda",
      branch("bk_cauda_cluster", "Silla de montar / esfínteres / paresia grave"),
      branch("bk_trauma_gate", "Sin cauda"),
      {
        title: "¿Red flags de cauda equina u otra urgencia?",
        description:
          "Silla de montar, retención/incontinencia, anestesia perineal, paresia grave → HOSPITAL. También fiebre/cáncer según contexto.",
        procedure: "Enrutado de urgencia.",
      }
    ),
    bk_trauma_gate: testNode(
      "bk_trauma_gate",
      "route-back-trauma",
      branch("bk_fracture_cluster", "Trauma mayor / osteoporosis / imposibilidad de apoyar"),
      branch("bk_radicular_gate", "Sin sospecha de fractura dominante"),
      {
        title: "¿Trauma mayor o sospecha de fractura?",
        description:
          "Caída/golpe + dolor óseo intenso, edad/osteoporosis o no puede apoyar → imagen. Sin eso → patrón radicular/mecánico.",
        procedure: "Enrutado de seguridad.",
      }
    ),
    bk_radicular_gate: testNode(
      "bk_radicular_gate",
      "route-back-sciatica",
      branch("bk_sciatica_cluster", "Dolor irradiado (típ. bajo la rodilla)"),
      branch("bk_buttock_gate", "Sin irradiación ciática clara"),
      {
        title: "¿Irradiación tipo ciática?",
        description:
          "Pierna (sobre todo bajo rodilla) ± hormigueo → SLR ± cruzado. Solo lumbar/nalga → otras ramas.",
        procedure: "Enrutado clínico.",
      }
    ),
    bk_buttock_gate: testNode(
      "bk_buttock_gate",
      "route-back-buttock",
      branch("bk_si_cluster", "Nalga / sacroilíaca dominante"),
      branch("bk_inflammatory_gate", "Dolor lumbar local / otro"),
      {
        title: "¿Dolor dominante en nalga o sacroilíaca?",
        description:
          "Nalga unilateral ± sentarse → cribado SI (FABER posterior). Solo lumbar → mecánico/inflamatorio.",
        procedure: "Enrutado por localización.",
      }
    ),
    bk_inflammatory_gate: testNode(
      "bk_inflammatory_gate",
      "route-back-inflammatory",
      branch("bk_inflammatory_path", "Rigidez matutina >30–45 min / joven / mejora con actividad"),
      branch("bk_stenosis_gate", "Sin patrón inflamatorio"),
      {
        title: "¿Patrón inflamatorio (SpA)?",
        description:
          "Joven + rigidez matutina prolongada + mejora con actividad/empeora en reposo → Schober + derivación. Si no → estenosis o mecánico.",
        procedure: "Enrutado clínico ASAS-orientativo.",
      }
    ),
    bk_stenosis_gate: testNode(
      "bk_stenosis_gate",
      "route-back-stenosis",
      branch("bk_stenosis_cluster", "Claudicación / empeora al caminar / mejora al flexionar"),
      branch("bk_mechanical_cluster", "Lumbalgia mecánica local"),
      {
        title: "¿Patrón de estenosis / claudicación?",
        description:
          "Camina peor, mejora al sentarse/flexionar, bilateral o piernas → estenosis ↑. Dolor local mecánico → Kemp.",
        procedure: "Enrutado clínico.",
      }
    ),
    bk_cauda_cluster: conclusionNode(
      "bk_cauda_cluster",
      "Sospecha de cauda equina / urgencia — HOSPITAL",
      "No tests de consulta. Derivación inmediata.",
      [
        {
          name: "Cauda equina / urgencia neurológica",
          probability: "alta",
          rationale: "Síntomas de alarma perineales/esfinterianos/paresia.",
        },
      ]
    ),
    bk_fracture_cluster: conclusionNode(
      "bk_fracture_cluster",
      "Sospecha de fractura vertebral — priorizar imagen",
      "Trauma/osteoporosis + dolor óseo o imposibilidad de apoyar. No Kemp/SLR agresivos.",
      [
        {
          name: "Fractura vertebral (sospecha)",
          probability: "alta",
          rationale: "Mecanismo + contexto de fragilidad o trauma.",
        },
      ]
    ),
    bk_sciatica_cluster: conclusionNode(
      "bk_sciatica_cluster",
      "Compatible con irritación nerviosa / ciática",
      "SLR familiar apoya; cruzado más específico si positivo. No confirma hernia. Cribar cadera/pie.",
      [
        {
          name: "Radiculopatía lumbar / ciática",
          probability: "alta",
          rationale: "Irradiación + SLR familiar.",
        },
        {
          name: "Referido de cadera / otra causa",
          probability: "media",
          rationale: "Si patrón atípico.",
        },
      ],
      { nextNodeId: "bk_slr" }
    ),
    bk_si_cluster: conclusionNode(
      "bk_si_cluster",
      "Compatible con dolor sacroilíaco / nalga",
      "Nalga dominante. FABER con dolor posterior apoya SI/lumbar posterior; dolor inguinal → cadera. No confirma disfunción SI.",
      [
        {
          name: "Dolor sacroilíaco / nalga",
          probability: "alta",
          rationale: "Localización nalga ± provocación FABER posterior.",
        },
        {
          name: "Cadera / deep gluteal",
          probability: "media",
          rationale: "Si FABER inguinal o patrón de cadera.",
        },
      ],
      { nextNodeId: "bk_faber" }
    ),
    bk_inflammatory_path: conclusionNode(
      "bk_inflammatory_path",
      "Cribado inflamatorio — Schober + valoración",
      "Patrón inflamatorio clínico. Schober apoya rigidez; no diagnostica AS. Derivación si cluster ASAS.",
      [
        {
          name: "Posible dolor inflamatorio / SpA (cribado)",
          probability: "alta",
          rationale: "Historia inflamatoria ± edad joven.",
        },
      ],
      { nextNodeId: "bk_schober" }
    ),
    bk_stenosis_cluster: conclusionNode(
      "bk_stenosis_cluster",
      "Compatible con estenosis lumbar / claudicación",
      "Empeora al caminar, mejora al flexionar. Diferencial vascular. SLR puede ser negativo. No hernia confirmada.",
      [
        {
          name: "Estenosis lumbar / claudicación neurógena",
          probability: "alta",
          rationale: "Patrón de marcha + alivio en flexión.",
        },
        {
          name: "Claudicación vascular",
          probability: "media",
          rationale: "Si pulsos/contexto vascular.",
        },
      ],
      { nextNodeId: "bk_slr" }
    ),
    bk_mechanical_cluster: conclusionNode(
      "bk_mechanical_cluster",
      "Compatible con lumbalgia mecánica inespecífica",
      "Sin cluster radicular ni RF. No inventar faceta/disco/SI definitivos. Kemp = dolor mecánico local, no faceta confirmada.",
      [
        {
          name: "Lumbalgia mecánica inespecífica",
          probability: "alta",
          rationale: "Patrón mecánico local.",
        },
        {
          name: "Cribado inflamatorio si aparece rigidez prolongada",
          probability: "baja",
          rationale: "Schober + historia ASAS → derivación.",
        },
      ],
      { nextNodeId: "bk_kemp" }
    ),
    bk_slr: testNode(
      "bk_slr",
      "slr-lasegue",
      branch("bk_crossed_slr", "Dolor ciático familiar en la pierna"),
      branch("bk_hip_diff_gate", "Solo tirón isquiotibial / no familiar")
    ),
    bk_crossed_slr: testNode(
      "bk_crossed_slr",
      "crossed-slr",
      branch("bk_sciatica_high", "Reproduce ciática en el lado malo"),
      branch("bk_sciatica_cluster", "Cruzado negativo — ciática sigue posible")
    ),
    bk_sciatica_high: conclusionNode(
      "bk_sciatica_high",
      "Ciática con SLR cruzado positivo — sospecha neural alta",
      "Cruzado positivo sube especificidad de compromiso radicular/disco. Sigue sin confirmar hernia ni nivel exacto.",
      [
        {
          name: "Radiculopatía / compromiso discal (sospecha alta)",
          probability: "alta",
          rationale: "SLR + cruzado familiares.",
        },
      ]
    ),
    bk_hip_diff_gate: testNode(
      "bk_hip_diff_gate",
      "route-back-hip",
      branch("bk_faber", "Ingle / cadera / patrón atípico de pierna"),
      branch("bk_kemp", "Sin patrón de cadera — mecánico local"),
      {
        title: "¿Dolor más de cadera/ingle que lumbar?",
        description:
          "Ingle o FABER inguinal → árbol de cadera. Si lumbar local → Kemp.",
        procedure: "Enrutado diferencial lumbar vs cadera.",
      }
    ),
    bk_faber: testNode(
      "bk_faber",
      "faber",
      branch("bk_si_cluster", "Dolor posterior / SI familiar"),
      branch("bk_hip_referral", "Dolor inguinal — priorizar cadera")
    ),
    bk_hip_referral: conclusionNode(
      "bk_hip_referral",
      "Diferencial de cadera — no cerrar solo como lumbar",
      "FABER inguinal o patrón de ingle. Continuar con árbol de cadera (FADIR/FABER). Puede coexistir con lumbalgia.",
      [
        {
          name: "Patología de cadera (diferencial)",
          probability: "alta",
          rationale: "Dolor inguinal / FABER anterior.",
        },
        {
          name: "Lumbalgia coexistente",
          probability: "media",
          rationale: "Si también hay dolor lumbar local.",
        },
      ]
    ),
    bk_kemp: testNode(
      "bk_kemp",
      "kemp",
      branch("bk_mechanical_local", "Dolor lumbar local en extensión/cuadrante"),
      branch("bk_schober", "Kemp no familiar")
    ),
    bk_mechanical_local: conclusionNode(
      "bk_mechanical_local",
      "Dolor mecánico local (no «faceta confirmada»)",
      "Kemp/cuadrante doloroso local. Evidencia limitada para síndrome facetario. No indicar infiltración por un test.",
      [
        {
          name: "Dolor lumbar mecánico local",
          probability: "alta",
          rationale: "Extensión/cuadrante familiar.",
        },
      ],
      { nextNodeId: "bk_schober" }
    ),
    bk_schober: testNode(
      "bk_schober",
      "schober",
      branch("bk_inflammatory", "Limitación de flexión + contexto inflamatorio"),
      branch("bk_nonspecific", "Schober no sugestivo / sin contexto SpA")
    ),
    bk_inflammatory: conclusionNode(
      "bk_inflammatory",
      "Cribado inflamatorio — valorar derivación",
      "Schober reducido + joven + rigidez matutina + mejora con actividad → SpA cribado. No diagnosticar AS ni hernia por Schober solo.",
      [
        {
          name: "Posible dolor inflamatorio / SpA (cribado)",
          probability: "media",
          rationale: "Patrón inflamatorio + Schober.",
        },
        {
          name: "Lumbalgia mecánica con espasmo",
          probability: "media",
          rationale: "Sin contexto inflamatorio claro.",
        },
      ]
    ),
    bk_nonspecific: conclusionNode(
      "bk_nonspecific",
      "Lumbalgia mecánica sin signos estructurales mayores",
      "Sin radicular claro ni RF. Reevaluar si aparecen alarmas.",
      [
        {
          name: "Lumbalgia mecánica inespecífica",
          probability: "alta",
          rationale: "Sin cluster ciático ni inflamatorio.",
        },
      ]
    ),
  },
};

/** Árbol cadera — master integration + intra/extraarticular + lateral/posterior/trauma. */
const HIP_TREE: ClinicalReasoningTree = {
  bodyPart: "hip",
  title: "Razonamiento clínico — Cadera / ingle / muslo",
  entryNodeId: "hp_master_entry",
  entryByTestId: {
    faber: "hp_faber",
    fadir: "hp_fadir",
    trendelenburg: "hp_lateral_trendelenburg",
    "slr-lasegue": "hp_posterior_slr",
    "hop-test": "hp_trauma_hop",
  },
  nodes: {
    hp_master_entry: conclusionNode(
      "hp_master_entry",
      "Cadera / ingle — árbol maestro Physioguide",
      "Flujo: red flags → trauma agudo → localización exacta → rama (groin Doha / hip-related / lateral / posterior) → historia/carga → palpación → test principal → diferencial → coexistencia.",
      [
        {
          name: "Enrutar por localización del paciente",
          probability: "alta",
          rationale:
            "Ingle → groin Doha; lateral → GTPS; posterior → isquio/deep gluteal; profundo → hip-related; trauma → hop/apoyo.",
        },
        {
          name: "Permitir patologías coexistentes",
          probability: "media",
          rationale: "GTPS + adductor, hip + pubic, lumbar + posterior son combinaciones válidas.",
        },
      ],
      { nextNodeId: "hp_master_trauma_gate" }
    ),
    hp_master_trauma_gate: testNode(
      "hp_master_trauma_gate",
      "route-hip-trauma",
      branch("hp_route_trauma", "Trauma agudo / pop / no apoyo"),
      branch("hp_loc_groin", "Sin trauma dominante"),
      {
        title: "¿Trauma agudo dominante?",
        description:
          "Caída, golpe, sprint, chute o pop reciente con hematoma o imposibilidad de apoyo → rama traumática (hop, no tests agresivos). Si es sobreuso o progresivo, continúa por localización.",
        procedure: "Enrutado clínico (no es un test físico). Elige según la historia del informe.",
        evidenceNote: "No apoyo + deformidad → urgencia. No hop si no puede apoyar.",
      }
    ),
    hp_loc_groin: testNode(
      "hp_loc_groin",
      "route-hip-groin",
      branch("hp_groin_doha", "Ingle / medial / pubis / canal / profundo"),
      branch("hp_loc_lateral", "No es el dolor dominante"),
      {
        title: "¿El dolor es inguinal / medial / púbico / profundo?",
        description:
          "Ingle, muslo interno, pubis, canal inguinal o profundo en la cadera → marco Doha + hip-related. Si no, valora lateral o posterior.",
        procedure: "Enrutado por localización exacta (un dedo).",
        evidenceNote: "Ningún test resistido aislado confirma adductor ni FAI.",
      }
    ),
    hp_loc_lateral: testNode(
      "hp_loc_lateral",
      "route-hip-lateral",
      branch("hp_route_lateral", "Lateral / trocánter / dormir de lado"),
      branch("hp_route_posterior", "Posterior / glúteo / isquion"),
      {
        title: "¿El dolor es lateral (trocánter) o posterior (glúteo/isquion)?",
        description:
          "Costado / hueso de fuera / dormir de lado → GTPS. Glúteo, isquion o al sentarse → rama posterior.",
        procedure: "Enrutado por localización exacta.",
      }
    ),
    hp_master_location: conclusionNode(
      "hp_master_location",
      "Enrutar por localización exacta",
      "Anterior/medial/pubis/inguinal → groin Doha + FABER. Lateral → Trendelenburg. Posterior → SLR. Profundo → FADIR.",
      [
        {
          name: "Groin Doha (adductor / iliopsoas / inguinal / pubic)",
          probability: "alta",
          rationale: "Dolor inguinal o medial predominante.",
        },
        {
          name: "Hip-related groin (intraarticular)",
          probability: "media",
          rationale: "Dolor profundo inguinal + flexión/rotación mecánica.",
        },
        {
          name: "Lateral / posterior",
          probability: "media",
          rationale: "Trocánter o glúteo/isquion según mapa corporal.",
        },
      ],
      { nextNodeId: "hp_groin_doha" }
    ),
    hp_groin_doha: conclusionNode(
      "hp_groin_doha",
      "Groin pain — marco Doha",
      "Adductor: medial + aducción resistida familiar. Iliopsoas: anterior + flexión resistida. Inguinal: canal + Valsalva orientativo. Pubic: sínfisis. Ningún test aislado confirma.",
      [
        {
          name: "Adductor-related groin pain",
          probability: "media",
          rationale: "Dolor medial + aducción resistida + palpación aductor.",
        },
        {
          name: "Iliopsoas-related groin pain",
          probability: "media",
          rationale: "Dolor anterior + flexión resistida/SLR resistido.",
        },
        {
          name: "Pubic / inguinal-related",
          probability: "baja",
          rationale: "Palpación pubis o canal inguinal + carga abdominal.",
        },
      ],
      { nextNodeId: "hp_faber" }
    ),
    hp_route_trauma: conclusionNode(
      "hp_route_trauma",
      "Rama traumatic — cadera/pelvis aguda",
      "Hop test + apoyo + deformidad. Dolor óseo intenso → fractura/avulsión.",
      [
        {
          name: "Distensión musculotendinosa aguda",
          probability: "media",
          rationale: "Puede apoyar/saltar con dolor muscular localizado.",
        },
        {
          name: "Sospecha ósea / avulsión",
          probability: "media",
          rationale: "Hop imposible, no apoyo o pop + adolescente.",
        },
      ],
      { nextNodeId: "hp_trauma_hop" }
    ),
    hp_route_lateral: conclusionNode(
      "hp_route_lateral",
      "Rama lateral — GTPS / trocánter",
      "Dolor lateral familiar + palpación trocantérica + monopodal → GTPS ↑.",
      [
        {
          name: "GTPS / tendinopatía glútea",
          probability: "alta",
          rationale: "Patrón trocantérico + carga monopodal.",
        },
      ],
      { nextNodeId: "hp_lateral_branch" }
    ),
    hp_route_posterior: conclusionNode(
      "hp_route_posterior",
      "Rama posterior — isquio / glúteo / ciática",
      "Diferenciar isquiotibial proximal vs deep gluteal vs lumbar/radicular.",
      [
        {
          name: "Isquiotibial proximal",
          probability: "media",
          rationale: "Isquion + sentarse + estirar isquio.",
        },
        {
          name: "Deep gluteal / radicular",
          probability: "media",
          rationale: "Glúteo profundo sentado o SLR familiar.",
        },
      ],
      { nextNodeId: "hp_posterior_slr" }
    ),
    hp_faber: testNode(
      "hp_faber",
      "faber",
      branch("hp_intraarticular", "Dolor inguinal"),
      branch("hp_faber_non_inguinal", "Dolor posterior, lateral u otro")
    ),
    hp_faber_non_inguinal: conclusionNode(
      "hp_faber_non_inguinal",
      "Valorar origen posterior vs lateral vs SI",
      "FABER sin dolor inguinal → cribar posterior (isquio/deep gluteal/ciática) y lateral (GTPS) según localización.",
      [
        {
          name: "Origen posterior / isquio / glúteo",
          probability: "media",
          rationale: "Dolor posterior o isquial reportado.",
        },
        {
          name: "GTPS / lateral",
          probability: "media",
          rationale: "Si dolor lateral trocantérico predominante.",
        },
        {
          name: "SI / lumbar referido",
          probability: "baja",
          rationale: "FABER posterior sin inguinal.",
        },
      ],
      { nextNodeId: "hp_posterior_slr" }
    ),
    hp_posterior_slr: testNode(
      "hp_posterior_slr",
      "slr-lasegue",
      branch("hp_posterior_radicular", "Reproduce dolor posterior/ciático"),
      branch("hp_posterior_hamstring", "SLR negativo o no familiar")
    ),
    hp_posterior_radicular: conclusionNode(
      "hp_posterior_radicular",
      "Compatible con irritación ciática / radicular",
      "SLR positivo familiar → lumbar/radicular o deep gluteal con componente neural; exploración neurológica completa.",
      [
        {
          name: "Radiculopatía lumbar / ciática",
          probability: "alta",
          rationale: "SLR familiar + posible síntomas lumbares.",
        },
        {
          name: "Deep gluteal syndrome",
          probability: "media",
          rationale: "Dolor glúteo profundo + sentarse; diferenciar de lumbar.",
        },
        {
          name: "Isquiotibial proximal",
          probability: "baja",
          rationale: "Si patrón isquial claro predomina sobre neural.",
        },
      ],
      { nextNodeId: "hp_extraarticular" }
    ),
    hp_posterior_hamstring: conclusionNode(
      "hp_posterior_hamstring",
      "Compatible con isquiotibial proximal",
      "SLR negativo + sentarse/estirar isquio/flexión resistida → tendinopatía proximal de isquiotibiales / lesión muscular ↑.",
      [
        {
          name: "Tendinopatía isquiotibial proximal",
          probability: "alta",
          rationale: "Dolor isquion + sentarse + estirar isquio + carga.",
        },
        {
          name: "Distensión isquiotibial aguda",
          probability: "media",
          rationale: "Si mecanismo sprint/chute reciente.",
        },
        {
          name: "Deep gluteal / ciático",
          probability: "baja",
          rationale: "Si dolor glúteo profundo predomina sobre isquion.",
        },
      ],
      { nextNodeId: "hp_lateral_branch" }
    ),
    hp_posterior_deep_gluteal: conclusionNode(
      "hp_posterior_deep_gluteal",
      "Compatible con deep gluteal / irritación ciática",
      "Dolor glúteo profundo + empeora sentado + posible parestesia sin patrón isquial claro.",
      [
        {
          name: "Deep gluteal syndrome",
          probability: "alta",
          rationale: "Patrón sentarse + glúteo profundo.",
        },
        {
          name: "Piriformis-related",
          probability: "media",
          rationale: "Diagnóstico de exclusión; no confirmar por un test.",
        },
        {
          name: "Ischiofemoral impingement",
          probability: "baja",
          rationale: "Dolor posterolateral profundo.",
        },
      ]
    ),
    hp_lateral_branch: testNode(
      "hp_lateral_branch",
      "trendelenburg",
      branch("hp_gtps_cluster", "Pelvis cae / dolor lateral"),
      branch("hp_lateral_lumbar", "Trendelenburg negativo")
    ),
    hp_lateral_trendelenburg: testNode(
      "hp_lateral_trendelenburg",
      "trendelenburg",
      branch("hp_gtps_cluster", "Pelvis cae / dolor lateral familiar"),
      branch("hp_lateral_lumbar", "Sin caída pelviana")
    ),
    hp_gtps_cluster: conclusionNode(
      "hp_gtps_cluster",
      "Compatible con GTPS / tendinopatía glútea",
      "Dolor lateral + carga monopodal/Trendelenburg + palpación trocantérica (si consta) sugieren GTPS; no confirman bursitis ni rotura aisladas.",
      [
        {
          name: "GTPS / tendinopatía glúteo medio",
          probability: "alta",
          rationale:
            "Dolor lateral trocantérico + apoyo monopodal + abducción resistida familiar.",
        },
        {
          name: "Irritación peritrocantérica",
          probability: "media",
          rationale: "Puede coexistir; no asumir bursitis aislada sin correlación.",
        },
        {
          name: "Snapping externo (ITB/glúteo mayor)",
          probability: "baja",
          rationale: "Valorar si hay chasquido lateral reproducible.",
        },
      ],
      { nextNodeId: "hp_lateral_faber_screen" }
    ),
    hp_lateral_faber_screen: testNode(
      "hp_lateral_faber_screen",
      "faber",
      branch("hp_lateral_hip_joint", "Dolor inguinal profundo"),
      branch("hp_lateral_lumbar", "Sin dolor inguinal")
    ),
    hp_lateral_hip_joint: conclusionNode(
      "hp_lateral_hip_joint",
      "Posible participación de cadera intraarticular",
      "Dolor inguinal profundo además de lateral → considerar coexistencia hip joint + GTPS.",
      [
        {
          name: "Patología intraarticular de cadera (FAI/labrum/OA)",
          probability: "media",
          rationale: "FABER inguinal positivo; valorar FADIR/ROM si procede.",
        },
        {
          name: "GTPS coexistente",
          probability: "media",
          rationale: "Patologías laterales e intraarticulares pueden coexistir.",
        },
      ],
      { nextNodeId: "hp_fadir" }
    ),
    hp_lateral_lumbar: conclusionNode(
      "hp_lateral_lumbar",
      "Considerar origen lumbar / L5 referido",
      "Dolor lateral sin patrón trocantérico claro o con síntomas lumbares → cribado proximal.",
      [
        {
          name: "Dolor lumbar referido (L5 / facetas)",
          probability: "media",
          rationale: "Trendelenburg negativo + lumbar sx o SLR positivo.",
        },
        {
          name: "GTPS leve / incipiente",
          probability: "baja",
          rationale: "Si palpación trocantérica familiar positiva, reconsiderar.",
        },
      ]
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
      "FADIR positivo refuerza sospecha de pinzamiento anterior; NO confirma FAI sin correlación clínica e imagen.",
      [
        {
          name: "FAI cam/pincer",
          probability: "alta",
          rationale: "Flexión-aducción-RI dolorosa familiar.",
        },
      ]
    ),
    hp_trendelenburg: testNode(
      "hp_trendelenburg",
      "trendelenburg",
      branch("hp_gtps_cluster", "Pelvis cae"),
      branch("hp_mild", "Trendelenburg negativo")
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
    hp_trauma_hop: testNode(
      "hp_trauma_hop",
      "hop-test",
      branch("hp_trauma_bone", "Dolor óseo intenso / no puede saltar"),
      branch("hp_trauma_muscle", "Puede saltar / dolor muscular")
    ),
    hp_trauma_bone: conclusionNode(
      "hp_trauma_bone",
      "Sospecha ósea / avulsión / fractura",
      "Hop imposible o dolor óseo intenso tras trauma o carga → no tratar como tirón; imagen y/o urgencias según apoyo y deformidad.",
      [
        {
          name: "Fractura de cadera o pelvis",
          probability: "alta",
          rationale: "Trauma + no salto/no apoyo; edad avanzada aumenta riesgo.",
        },
        {
          name: "Avulsión apofisaria",
          probability: "media",
          rationale: "Joven + pop + dolor óseo local (ASIS/AIIS/isquion).",
        },
        {
          name: "Fractura de estrés (si no hubo golpe único)",
          probability: "baja",
          rationale: "Corredor + ingle progresiva + hop óseo.",
        },
      ]
    ),
    hp_trauma_muscle: conclusionNode(
      "hp_trauma_muscle",
      "Compatible con lesión musculotendinosa aguda",
      "Puede apoyar/saltar con dolor muscular → flexor, recto, aductor o isquio según localización; no inventar grado.",
      [
        {
          name: "Distensión flexor / recto femoral",
          probability: "alta",
          rationale: "Ingle anterior + chute/sprint.",
        },
        {
          name: "Distensión aductor aguda",
          probability: "media",
          rationale: "Ingle medial + apretar rodillas / abertura.",
        },
        {
          name: "Distensión isquiotibial proximal",
          probability: "media",
          rationale: "Isquion/posterior + sprint.",
        },
        {
          name: "Labrum traumático",
          probability: "baja",
          rationale: "Si pivote + pop inguinal + chasquido/bloqueo.",
        },
      ]
    ),
  },
};

/** Árbol cabeza — SNOOP → trauma → cervicogénico vs primario. */
const HEAD_TREE: ClinicalReasoningTree = {
  bodyPart: "head",
  title: "Razonamiento clínico — Cabeza",
  entryNodeId: "hd_master_entry",
  entryByTestId: {
    spurling: "hd_spurling",
    ultt: "hd_ultt",
  },
  nodes: {
    hd_master_entry: conclusionNode(
      "hd_master_entry",
      "Cabeza — enrutado Physioguide",
      "Flujo: SNOOP/red flags → trauma → ¿provocación cervical? → Spurling/movilidad (apoyan cervicogénica) → patrón migraña vs tensional. Spurling no confirma ni excluye.",
      [
        {
          name: "Seguridad primero, luego primario vs cervicogénico",
          probability: "alta",
          rationale: "SNOOP+ → médico. Sin RF: historia + provocación cervical, no un test solo.",
        },
      ],
      { nextNodeId: "hd_snoop_gate" }
    ),
    hd_snoop_gate: testNode(
      "hd_snoop_gate",
      "route-head-snoop",
      branch("hd_redflag_cluster", "SNOOP+ / déficit neurológico / peor cefalea de la vida"),
      branch("hd_trauma_gate", "Sin red flags dominantes"),
      {
        title: "¿Red flags SNOOP o neurológicas?",
        description:
          "Sistémico, neurológico, onset thunderclap/nuevo >50, other (trauma/embarazo/VIH), pattern change (progresiva, vómitos matutinos). Cualquiera → no Spurling como vía principal.",
        procedure: "Cribado de historia clínica (SNOOP).",
        evidenceNote:
          "Do et al. SNOOP4; NICE NG150. Sin inventar Sn/Sp del mnemotécnico.",
      }
    ),
    hd_trauma_gate: testNode(
      "hd_trauma_gate",
      "route-head-trauma",
      branch("hd_posttraumatic_cluster", "Trauma craneal/cervical reciente"),
      branch("hd_cervical_gate", "Sin trauma reciente dominante"),
      {
        title: "¿Trauma reciente de cabeza o cuello?",
        description:
          "Golpe + cefalea nueva/empeorada (± vómitos/confusión) → rama postraumática/médica. Sin trauma → provocación cervical vs primaria.",
        procedure: "Enrutado clínico de trauma.",
      }
    ),
    hd_cervical_gate: testNode(
      "hd_cervical_gate",
      "route-head-cervical",
      branch("hd_cervicogenic_path", "Empeora al mover el cuello / nuca→sien"),
      branch("hd_migraine_gate", "Sin provocación cervical clara"),
      {
        title: "¿La cefalea empeora al mover el cuello?",
        description:
          "Unilateral occipital→sien + cuello + movimiento cervical familiar → rama cervicogénica. Sin eso → patrones primarios.",
        procedure: "Enrutado clínico + movilidad cervical activa.",
        evidenceNote:
          "Cluster cervicogénica: provocación cervical ± Spurling familiar. Negativo no excluye.",
      }
    ),
    hd_migraine_gate: testNode(
      "hd_migraine_gate",
      "route-head-migraine",
      branch("hd_migraine_cluster", "Pulsátil / náuseas / fotofobia / aura"),
      branch("hd_tension_cluster", "Bilateral presión / estrés / pantallas"),
      {
        title: "¿Patrón migrañoso (pulsátil, náuseas, fotofobia)?",
        description:
          "Hemicraneal pulsátil ± náuseas/fotofobia/aura → migraña. Bilateral opresiva + estrés → tensional.",
        procedure: "Enrutado por patrón ICHD-orientativo (sin confirmar diagnóstico).",
      }
    ),
    hd_cervicogenic_path: conclusionNode(
      "hd_cervicogenic_path",
      "Compatible con cefalea cervicogénica — confirmar provocación",
      "Historia cervical favorable. Spurling/movilidad apoyan si reproducen la cefalea familiar; no confirman. Coexistencia con migraña/tensional posible.",
      [
        {
          name: "Cefalea cervicogénica",
          probability: "alta",
          rationale: "Provocación cervical / patrón occipital→sien.",
        },
        {
          name: "Radiculopatía cervical alta",
          probability: "media",
          rationale: "Si brazo/hormigueo asociados.",
        },
      ],
      { nextNodeId: "hd_spurling" }
    ),
    hd_redflag_cluster: conclusionNode(
      "hd_redflag_cluster",
      "Red flags / SNOOP+ — valoración médica o urgente",
      "No continuar con cluster cervicogénico tranquilizador. Derivar según gravedad (thunderclap, déficit, fiebre+rigidez, trauma con confusión).",
      [
        {
          name: "Cefalea secundaria / RF — derivación",
          probability: "alta",
          rationale: "SNOOP+ o signos de alarma.",
        },
      ]
    ),
    hd_posttraumatic_cluster: conclusionNode(
      "hd_posttraumatic_cluster",
      "Cefalea postraumática — cribado médico",
      "No Spurling como primera maniobra tras trauma significativo. Vómitos, somnolencia o confusión → urgente. Leve sin RF → seguimiento médico.",
      [
        {
          name: "Cefalea postraumática / contusión",
          probability: "alta",
          rationale: "Temporalidad post-golpe.",
        },
        {
          name: "Lesión cervical asociada",
          probability: "media",
          rationale: "Si también hay cuello; C-spine si trauma mayor.",
        },
      ]
    ),
    hd_cervicogenic: conclusionNode(
      "hd_cervicogenic",
      "Compatible con cefalea cervicogénica",
      "Provocación cervical familiar apoya origen cervical; no es diagnóstico definitivo. Valorar red flags y diferencial con migraña.",
      [
        {
          name: "Cefalea cervicogénica",
          probability: "alta",
          rationale: "Dolor unilateral occipital/temporal con provocación cervical familiar.",
        },
        {
          name: "Coexistencia migraña + cervical",
          probability: "media",
          rationale: "Si también hay náuseas/fotofobia.",
        },
      ]
    ),
    hd_migraine_cluster: conclusionNode(
      "hd_migraine_cluster",
      "Compatible con migraña (cefalea primaria)",
      "Patrón migrañoso sin SNOOP+. Puede coexistir con dolor cervical mecánico — declarar dominante + coexistente.",
      [
        {
          name: "Migraña",
          probability: "alta",
          rationale: "Pulsátil/náuseas/fotofobia/aura + historia.",
        },
        {
          name: "Componente cervical coexistente",
          probability: "media",
          rationale: "Si hay cuello sin provocación clara de la cefalea.",
        },
      ],
      { nextNodeId: "hd_ultt" }
    ),
    hd_tension_cluster: conclusionNode(
      "hd_tension_cluster",
      "Compatible con cefalea tensional",
      "Bilateral opresiva + estrés/pantallas sin RF. Solapamiento frecuente con cervicalgia mecánica.",
      [
        {
          name: "Cefalea tensional",
          probability: "alta",
          rationale: "Patrón bilateral de presión sin RF.",
        },
        {
          name: "Cervicalgia mecánica coexistente",
          probability: "media",
          rationale: "Rigidez de cuello sin reproducción clara de cefalea.",
        },
      ],
      { nextNodeId: "hd_ultt" }
    ),
    hd_primary: conclusionNode(
      "hd_primary",
      "Compatible con cefalea primaria (sin provocación cervical)",
      "Spurling/movilidad no reproducen cefalea familiar. Migraña/tensional siguen en diferencial según patrón.",
      [
        {
          name: "Migraña / cefalea tensional",
          probability: "alta",
          rationale: "Sin signos cervicales provocables familiares.",
        },
        {
          name: "Cefalea inespecífica — reevaluar RF",
          probability: "baja",
          rationale: "Si el patrón no encaja, volver a SNOOP.",
        },
      ]
    ),
    hd_arm_gate: testNode(
      "hd_arm_gate",
      "route-head-arm",
      branch("hd_radicular_hint", "Brazo / hormigueo asociados"),
      branch("hd_cervicogenic", "Sin brazo — cervicogénica local"),
      {
        title: "¿Hay irradiación a brazo u hormigueo?",
        description:
          "Si sí → priorizar radiculopatía (árbol cuello / ULTT). Si no → cerrar cervicogénica local.",
        procedure: "Enrutado clínico.",
      }
    ),
    hd_radicular_hint: conclusionNode(
      "hd_radicular_hint",
      "Cefalea + brazo — priorizar radiculopatía cervical",
      "No cerrar solo como cervicogénica. Integrar Spurling/ULTT/distracción del árbol de cuello (cluster Wainner).",
      [
        {
          name: "Radiculopatía cervical alta (diferencial)",
          probability: "alta",
          rationale: "Cefalea occipital + síntomas de brazo.",
        },
        {
          name: "Cefalea cervicogénica coexistente",
          probability: "media",
          rationale: "Si la cefalea también se provoca con el cuello.",
        },
      ],
      { nextNodeId: "hd_ultt" }
    ),
    hd_spurling: testNode(
      "hd_spurling",
      "spurling",
      branch("hd_arm_gate", "Reproduce cefalea familiar"),
      branch("hd_primary", "No reproduce cefalea familiar")
    ),
    hd_ultt: testNode(
      "hd_ultt",
      "ultt",
      branch("hd_radicular_hint", "Reproduce síntomas de brazo familiares"),
      branch("hd_primary", "Solo tirantez inespecífica")
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
