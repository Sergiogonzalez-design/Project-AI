/**
 * Educational metadata for illustrated special tests (physio-facing).
 * Technique summaries align with common MSK literature / PubMed reviews.
 */

export type ClinicalTestMeta = {
  id: string;
  title: string;
  procedure: string;
  evidenceNote?: string;
};

export const CLINICAL_TEST_META: Record<string, ClinicalTestMeta> = {
  lachman: {
    id: "lachman",
    title: "Test de Lachman",
    procedure:
      "Rodilla ~20–30° de flexión, muslo estabilizado. Una mano fija el fémur y la otra tracciona la tibia hacia adelante comparando con la contralateral.",
    evidenceNote:
      "Alta sensibilidad para lesión del LCA en fase aguda/subaguda (revisiones Cochrane / meta-análisis clínicos).",
  },
  "anterior-drawer-knee": {
    id: "anterior-drawer-knee",
    title: "Cajón anterior (rodilla)",
    procedure:
      "Paciente en decúbito supino, rodilla ~90° (pie apoyado). Traccionar la tibia hacia adelante respecto al fémur.",
    evidenceNote:
      "Útil en LCA; sensibilidad menor que Lachman en fase muy aguda por dolor/defensa.",
  },
  "pivot-shift": {
    id: "pivot-shift",
    title: "Pivot Shift",
    procedure:
      "Valgo + flexión interna de cadera, tracción anterior de tibia y flexo-extensión progresiva de rodilla bajo valgo.",
    evidenceNote:
      "Alta especificidad para inestabilidad rotatoria por LCA; a menudo difícil en consulta por dolor.",
  },
  mcmurray: {
    id: "mcmurray",
    title: "Test de McMurray",
    procedure:
      "Rodilla máxima flexión, rotación tibial + valgo (menisco medial) o varo (lateral) mientras se extiende.",
    evidenceNote:
      "Sensibilidad/especificidad moderadas para lesión meniscal; combinar con anamnesis mecánica.",
  },
  thessaly: {
    id: "thessaly",
    title: "Test de Thessaly",
    procedure:
      "Paciente de pie, apoyo monopodal en la pierna afectada, rodilla ~5° y luego ~20° de flexión con rotación corporal.",
    evidenceNote:
      "Mejor rendimiento que McMurray en algunos estudios para sospecha meniscal.",
  },
  neer: {
    id: "neer",
    title: "Test de Neer",
    procedure:
      "Estabilizar escápula y elevar pasivamente el brazo en flexión forzando acercamiento acromio-humeral.",
    evidenceNote:
      "Sugiere conflicto subacromial / pinzamiento; baja especificidad aislada.",
  },
  "hawkins-kennedy": {
    id: "hawkins-kennedy",
    title: "Hawkins-Kennedy",
    procedure:
      "Flexión de hombro 90° y rotación interna forzada del antebrazo.",
    evidenceNote:
      "Frecuente en tendinopatía del manguito / subacromial; combinar con Neer y exploración activa.",
  },
  "jobe-empty-can": {
    id: "jobe-empty-can",
    title: "Jobe / Empty can",
    procedure:
      "Abducción 90° en plano escapular, pulgar hacia abajo. Resistencia a la abducción.",
    evidenceNote:
      "Orienta a afectación del supraespinoso; correlación moderada con RM/eco.",
  },
  apprehension: {
    id: "apprehension",
    title: "Apprehension / Relocation",
    procedure:
      "Abducción + rotación externa progresiva. Positivo si aprensión; relocation al presionar humeral anterior.",
    evidenceNote:
      "Clásico en inestabilidad anterior de hombro / Bankart funcional.",
  },
  "drop-arm": {
    id: "drop-arm",
    title: "Drop arm",
    procedure:
      "Abducción activa máxima y descenso controlado del brazo.",
    evidenceNote:
      "Caída brusca sugiere rotura importante del manguito (p. ej. supraespinoso).",
  },
  "painful-arc": {
    id: "painful-arc",
    title: "Arco doloroso",
    procedure:
      "Abducción activa/pasiva observando dolor entre ~60° y 120°.",
    evidenceNote:
      "Compatible con subacromial / tendinopatía del manguito.",
  },
  spurling: {
    id: "spurling",
    title: "Test de Spurling",
    procedure:
      "Extensión + inclinación + compresión axial cervical hacia el lado sintomático.",
    evidenceNote:
      "Aumenta especificidad de radiculopatía cervical vs. dolor referido de hombro.",
  },
  ultt: {
    id: "ultt",
    title: "ULTT / ULNT",
    procedure:
      "Tensión neural del mediano (depression-humeral, extensión codo/muñeca/dedos).",
    evidenceNote:
      "Sugiere irritación/neuropatía del mediano (túnel carpiano proximal).",
  },
  thompson: {
    id: "thompson",
    title: "Test de Thompson",
    procedure:
      "Paciente prono o sentado, rodilla flexionada. Pellizcar gemelo: ausencia de flexión plantar sugiere rotura Aquiles.",
    evidenceNote:
      "Alta sensibilidad para rotura del tendón de Aquiles completa.",
  },
  matles: {
    id: "matles",
    title: "Test de Matles",
    procedure:
      "Decúbito prono, flexión de rodilla. Pie caído vs. contralateral.",
    evidenceNote:
      "Complemento en sospecha de rotura Aquiles.",
  },
  "anterior-drawer-ankle": {
    id: "anterior-drawer-ankle",
    title: "Cajón anterior (tobillo)",
    procedure:
      "Tobillo ~20° plantarflexión, estabilizar tibia y traccionar calcáneo hacia adelante.",
    evidenceNote:
      "Sugiere lesión ATFL en esguince lateral; combinar con palpación y mecanismo.",
  },
  windlass: {
    id: "windlass",
    title: "Test de Windlass",
    procedure:
      "Extensión activa/pasiva del hallux (dedo gordo) con pie en carga o sentado.",
    evidenceNote:
      "Reproduce dolor en fascitis plantar / patología del arco media-pie.",
  },
  "heel-raise": {
    id: "heel-raise",
    title: "Elevación de talones",
    procedure:
      "Bilateral y monopodal: elevar talones. Valorar dolor, fuerza y simetría.",
    evidenceNote:
      "Déficit monopodal sugiere patología Aquiles o gemelo; útil en carga funcional.",
  },
  "hop-test": {
    id: "hop-test",
    title: "Hop test",
    procedure:
      "Salto monopodal en la pierna afectada comparando dolor, control y distancia.",
    evidenceNote:
      "Criterio funcional en retorno al deporte (LCA, esguince tobillo).",
  },
  faber: {
    id: "faber",
    title: "FABER / Patrick",
    procedure:
      "Flexión, abducción y rotación externa de cadera (figura 4). Dolor inguinal vs. lumbar.",
    evidenceNote:
      "Dolor inguinal: cadera (FAI, labrum); dolor lumbar/sacral: SI/ lumbar.",
  },
  fadir: {
    id: "fadir",
    title: "FADIR",
    procedure:
      "Flexión, aducción y rotación interna de cadera.",
    evidenceNote:
      "Sugiere conflicto femoroacetabular / lesión labrum anterior.",
  },
  trendelenburg: {
    id: "trendelenburg",
    title: "Trendelenburg",
    procedure:
      "Apoyo monopodal: caída de pelvis contralateral indica debilidad glútea media.",
    evidenceNote:
      "Patología de cadera (glúteo medio) o radiculopatía L5.",
  },
  phalen: {
    id: "phalen",
    title: "Test de Phalen",
    procedure:
      "Flexión máxima de muñeca sostenida 60 s (posición de rezo).",
    evidenceNote:
      "Clásico en síndrome del túnel carpiano (sensibilidad moderada).",
  },
  tinel: {
    id: "tinel",
    title: "Signo de Tinel",
    procedure:
      "Percusión sobre el nervio mediano en el túnel carpiano.",
    evidenceNote:
      "Parestesias en territorio mediano sugieren STC.",
  },
  cozen: {
    id: "cozen",
    title: "Test de Cozen",
    procedure:
      "Extensión de muñeca resistida con codo extendido y antebrazo en pronación.",
    evidenceNote:
      "Dolor en epicóndilo lateral sugiere epicondilitis lateral.",
  },
  mill: {
    id: "mill",
    title: "Test de Mill",
    procedure:
      "Extensión pasiva de codo con muñeca flexionada y antebrazo pronado.",
    evidenceNote:
      "Complemento en epicondilitis lateral (extensor común).",
  },
  speed: {
    id: "speed",
    title: "Test de Speed",
    procedure:
      "Extensión de codo resistida con antebrazo supinado.",
    evidenceNote:
      "Dolor en inserción distal del bíceps / tendinopatía proximal-distal.",
  },
  yergason: {
    id: "yergason",
    title: "Test de Yergason",
    procedure:
      "Flexión de codo resistida con antebrazo supinado.",
    evidenceNote:
      "Dolor en surco bicipital radial sugiere inestabilidad/tendinopatía bicipital.",
  },
  schober: {
    id: "schober",
    title: "Test de Schober",
    procedure:
      "Marca L5 y 10 cm arriba; flexión lumbar. Incremento <5 cm sugiere limitación.",
    evidenceNote:
      "Utilidad en espondiloartropatías / rigidez lumbar inflamatoria.",
  },
  "slr-lasegue": {
    id: "slr-lasegue",
    title: "SLR / Lasègue",
    procedure:
      "Elevación pasiva de pierna recta. Dolor ciático / radicular antes de 60°.",
    evidenceNote:
      "Sugiere irritación radicular L4-S1 o ciática; cruzado aumenta especificidad.",
  },
  kemp: {
    id: "kemp",
    title: "Kemp / cuadrante lumbar",
    procedure:
      "Extensión + inclinación lateral y rotación hacia el lado doloroso.",
    evidenceNote:
      "Reproduce dolor facetario / artrosis lumbar segmentaria.",
  },
};

export function getTestMeta(testId: string): ClinicalTestMeta | undefined {
  return CLINICAL_TEST_META[testId];
}
