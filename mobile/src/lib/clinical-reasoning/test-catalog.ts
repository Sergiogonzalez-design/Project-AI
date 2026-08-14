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
      "Benjaminse et al. JOSPT 2006: Lachman es el test físico más sensible para LCA; apoya el cluster, no confirma rotura completa. Guarda en agudo ↓ fiabilidad.",
  },
  "anterior-drawer-knee": {
    id: "anterior-drawer-knee",
    title: "Cajón anterior (rodilla)",
    procedure:
      "Paciente en decúbito supino, rodilla ~90° (pie apoyado). Traccionar la tibia hacia adelante respecto al fémur.",
    evidenceNote:
      "Benjaminse JOSPT 2006: menos sensible que Lachman en agudo (dolor/defensa). No usar aislado.",
  },
  "pivot-shift": {
    id: "pivot-shift",
    title: "Pivot Shift",
    procedure:
      "Valgo + flexión interna de cadera, tracción anterior de tibia y flexo-extensión progresiva de rodilla bajo valgo.",
    evidenceNote:
      "Más específico que sensible para inestabilidad rotatoria (Benjaminse 2006). Difícil en agudo; negativo no excluye LCA.",
  },
  mcmurray: {
    id: "mcmurray",
    title: "Test de McMurray",
    procedure:
      "Rodilla máxima flexión, rotación tibial + valgo (menisco medial) o varo (lateral) mientras se extiende.",
    evidenceNote:
      "Hegedus BJSM 2007/2015: precisión limitada aislado. Usar en cluster (línea articular + torsión ± bloqueo).",
  },
  thessaly: {
    id: "thessaly",
    title: "Test de Thessaly",
    procedure:
      "Paciente de pie, apoyo monopodal en la pierna afectada, rodilla ~5° y luego ~20° de flexión con rotación corporal.",
    evidenceNote:
      "Evidencia MIXTA: Karachalios 2005 muy preciso; estudios posteriores y Hegedus BJSM mucho menor. Cluster, no regla de oro.",
  },
  neer: {
    id: "neer",
    title: "Test de Neer",
    procedure:
      "Estabilizar escápula y elevar pasivamente el brazo en flexión forzando acercamiento acromio-humeral.",
    evidenceNote:
      "Hegedus BJSM 2008/2012: poca utilidad aislado. Cluster RCRSP (Lewis); no confirma pinzamiento.",
  },
  "hawkins-kennedy": {
    id: "hawkins-kennedy",
    title: "Hawkins-Kennedy",
    procedure:
      "Flexión de hombro 90° y rotación interna forzada del antebrazo.",
    evidenceNote:
      "Hegedus BJSM: inespecífico aislado. Michener 2009: mejor en combinación con otros tests de manguito.",
  },
  "jobe-empty-can": {
    id: "jobe-empty-can",
    title: "Jobe / Empty can",
    procedure:
      "Abducción 90° en plano escapular, pulgar hacia abajo. Resistencia a la abducción.",
    evidenceNote:
      "Dolor → supraespinoso/RCRSP. Debilidad + drop arm → rotura ↑ (dolor puede imitar debilidad). Hegedus BJSM.",
  },
  apprehension: {
    id: "apprehension",
    title: "Apprehension / Relocation",
    procedure:
      "Abducción + rotación externa progresiva. Positivo si aprensión; relocation al presionar humeral anterior.",
    evidenceNote:
      "Farber JBJS 2006: aprensión (miedo a que se salga) > dolor solo. Relocation refuerza. Historia de luxación pesa mucho.",
  },
  "drop-arm": {
    id: "drop-arm",
    title: "Drop arm",
    procedure:
      "Abducción activa máxima y descenso controlado del brazo.",
    evidenceNote:
      "Caída/no control al bajar → rotura importante ↑. Más específico que sensible en síntesis (Hegedus). No indica tamaño.",
  },
  "painful-arc": {
    id: "painful-arc",
    title: "Arco doloroso",
    procedure:
      "Abducción activa/pasiva observando dolor entre ~60° y 120°.",
    evidenceNote:
      "Arco medio (~60–120°) → RCRSP en cluster (Park/Michener). Dolor solo al final + cruzar pecho → AC.",
  },
  spurling: {
    id: "spurling",
    title: "Test de Spurling",
    procedure:
      "Extensión + inclinación + compresión axial cervical hacia el lado sintomático.",
    evidenceNote:
      "Tong/Wainner: más específico que sensible para radiculopatía. Negativo no excluye cuello. No es test de manguito.",
  },
  ultt: {
    id: "ultt",
    title: "ULTT / ULNT",
    procedure:
      "Tensión neural del mediano (depression-humeral, extensión codo/muñeca/dedos).",
    evidenceNote:
      "Wainner Spine 2003: sensible, poco específico aislado. Cluster con Spurling/distracción. Tirantez ≠ hernia ni túnel carpiano.",
  },
  thompson: {
    id: "thompson",
    title: "Test de Thompson",
    procedure:
      "Paciente prono o sentado, rodilla flexionada. Pellizcar gemelo: ausencia de flexión plantar sugiere rotura Aquiles.",
    evidenceNote:
      "Maffulli / JOSPT Achilles CPG: muy útil en rotura COMPLETA (no hay flexión plantar). Negativo no excluye parcial.",
  },
  matles: {
    id: "matles",
    title: "Test de Matles",
    procedure:
      "Decúbito prono, flexión de rodilla. Pie caído vs. contralateral.",
    evidenceNote:
      "Complemento de Thompson (ángulo de reposo). Cluster: pop + no puntillas + Thompson. No usar solo.",
  },
  "anterior-drawer-ankle": {
    id: "anterior-drawer-ankle",
    title: "Cajón anterior (tobillo)",
    procedure:
      "Tobillo ~20° plantarflexión, estabilizar tibia y traccionar calcáneo hacia adelante.",
    evidenceNote:
      "ATFL. van Dijk: más fiable a 4–5 días que en agudo. Dolor sin holgura ≠ cajón positivo. No inventar grado. Primero Ottawa.",
  },
  windlass: {
    id: "windlass",
    title: "Test de Windlass",
    procedure:
      "Extensión activa/pasiva del hallux (dedo gordo) con pie en carga o sentado.",
    evidenceNote:
      "JOSPT Heel Pain CPG; De Garceau 2003: aislado limitado (negativo no excluye). Cluster: primeros pasos + palpación calcáneo.",
  },
  "heel-raise": {
    id: "heel-raise",
    title: "Elevación de talones",
    procedure:
      "Bilateral y monopodal: elevar talones. Valorar dolor, fuerza y simetría.",
    evidenceNote:
      "Imposible monopodal + pop + Thompson → rotura completa ↑. Dolor con Thompson conservado → tendinopatía (Silbernagel / JOSPT Achilles).",
  },
  "hop-test": {
    id: "hop-test",
    title: "Hop test",
    procedure:
      "Salto monopodal en la pierna afectada comparando dolor, control y distancia.",
    evidenceNote:
      "Post-trauma: NO si no puede apoyar. Imposible o dolor óseo intenso → fractura/avulsión ↑. También criterio RTS (no es test de labrum).",
  },
  faber: {
    id: "faber",
    title: "FABER / Patrick",
    procedure:
      "Flexión, abducción y rotación externa de cadera (figura 4). Dolor inguinal vs. lumbar.",
    evidenceNote:
      "Registra DÓNDE duele: ingle → cadera; posterior → SI/lumbar; lateral → GTPS. Inespecífico como diagnóstico único.",
  },
  fadir: {
    id: "fadir",
    title: "FADIR",
    procedure:
      "Flexión, aducción y rotación interna de cadera.",
    evidenceNote:
      "Warwick Agreement (Griffin BJSM 2016): FADIR familiar inguinal profundo ↑ cadera; NO confirma FAI ni labrum. Baja especificidad.",
  },
  trendelenburg: {
    id: "trendelenburg",
    title: "Trendelenburg",
    procedure:
      "Apoyo monopodal: caída de pelvis contralateral indica debilidad glútea media.",
    evidenceNote:
      "Grimaldi & Fearon JOSPT 2015: cluster GTPS (palpación + carga monopodal). Caída pélvica ≠ rotura de glúteo; también L5.",
  },
  phalen: {
    id: "phalen",
    title: "Test de Phalen",
    procedure:
      "Flexión máxima de muñeca sostenida 60 s (posición de rezo).",
    evidenceNote:
      "D’Arcy & McGee JAMA 2000; JOSPT CTS CPG 2019: precisión moderada/mixta. Cluster (noche, sacudir la mano) > Phalen aislado. Negativo no descarta.",
  },
  tinel: {
    id: "tinel",
    title: "Signo de Tinel",
    procedure:
      "Percusión sobre el nervio mediano en el túnel carpiano.",
    evidenceNote:
      "Complemento de Phalen (a menudo menos sensible que la historia nocturna). Parestesias en territorio mediano, no dolor local. No confirma STC solo.",
  },
  cozen: {
    id: "cozen",
    title: "Test de Cozen",
    procedure:
      "Extensión de muñeca resistida con codo extendido y antebrazo en pronación.",
    evidenceNote:
      "Cluster LET (palpación + carga). Zwerus: evidencia de precisión limitada. No confirma inflamación. Cribado cervical/PIN si hormigueo.",
  },
  mill: {
    id: "mill",
    title: "Test de Mill",
    procedure:
      "Extensión pasiva de codo con muñeca flexionada y antebrazo pronado.",
    evidenceNote:
      "Estiramiento del extensor común. Complemento de Cozen; aislado inespecífico. Cluster, no regla de oro.",
  },
  speed: {
    id: "speed",
    title: "Test de Speed",
    procedure:
      "Codo extendido, antebrazo supinado; flexión de hombro resistida (~60–90°). Dolor en surco bicipital.",
    evidenceNote:
      "Dolor en surco bicipital → bíceps. Hegedus BJSM: NO confirma SLAP.",
  },
  "cross-body": {
    id: "cross-body",
    title: "Cross-body / aducción horizontal",
    procedure:
      "Aducción horizontal del brazo cruzando por delante del pecho hacia el hombro contralateral. Registrar si el dolor es en la puntita AC y familiar.",
    evidenceNote:
      "Chronopoulos / Walton: contribuye al diferencial AC. Positivo en la punta ≠ manguito; no inventa grado de separación AC.",
  },
  finkelstein: {
    id: "finkelstein",
    title: "Finkelstein (De Quervain)",
    procedure:
      "Desviación cubital del puño con el pulgar estabilizado (técnica de Finkelstein). Dolor en estiloides radial / 1.er compartimento familiar. No confundir con solo cerrar el puño sobre el pulgar (Eichhoff — más falsos +).",
    evidenceNote:
      "Cluster De Quervain: estiloides radial + uso del pulgar + palpación ± Finkelstein. Eichhoff aislado da falsos positivos.",
  },
  yergason: {
    id: "yergason",
    title: "Test de Yergason",
    procedure:
      "Codo a 90° pegado al tronco; supinación resistida (± rotación externa). Dolor o salto en surco bicipital.",
    evidenceNote:
      "Dolor o salto en surco → bíceps/corredera. NO confirma SLAP (Hegedus / literatura labrum).",
  },
  schober: {
    id: "schober",
    title: "Test de Schober",
    procedure:
      "Marca L5 y 10 cm arriba; flexión lumbar. Incremento <5 cm sugiere limitación.",
    evidenceNote:
      "ASAS / Schober modificado: cribado de rigidez inflamatoria, no hernia ni lumbalgia inespecífica.",
  },
  "slr-lasegue": {
    id: "slr-lasegue",
    title: "SLR / Lasègue",
    procedure:
      "Elevación pasiva de pierna recta. Dolor ciático / radicular antes de 60°.",
    evidenceNote:
      "van der Windt Cochrane: sensible, poco específico. Ciática familiar (pierna), no tirón isquiotibial. Cruzado más específico. No confirma hernia.",
  },
  kemp: {
    id: "kemp",
    title: "Kemp / cuadrante lumbar",
    procedure:
      "Extensión + inclinación lateral y rotación hacia el lado doloroso.",
    evidenceNote:
      "Evidencia LIMITADA como test facetario. Dolor mecánico local en extensión; no confirma artrosis ni indica infiltración (JOSPT LBP CPG).",
  },
};

export function getTestMeta(testId: string): ClinicalTestMeta | undefined {
  return CLINICAL_TEST_META[testId];
}
