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
  "valgus-stress-mcl": {
    id: "valgus-stress-mcl",
    title: "Estrés en valgo (LCM)",
    procedure:
      "Supino. Valgo suave a ~30° (aísla más LCM) y a 0° (cápsula/LCA si holgura). Comparar con contralateral. Registrar dolor familiar en LCM y/o apertura medial.",
    evidenceNote:
      "JOSPT CPG knee ligament (Logerstedt): dolor/holgura → LCM ↑. No inventar grado I–III por dolor solo. Coexiste a menudo con menisco/LCA (tríada).",
  },
  "varus-stress-lcl": {
    id: "varus-stress-lcl",
    title: "Estrés en varo (LCL)",
    procedure:
      "Supino. Varo a 0° y ~30°. Comparar con contralateral. Registrar dolor LCL familiar y/o apertura lateral.",
    evidenceNote:
      "JOSPT CPG knee ligament: LCL ↑. Varo + hiperextensión → pensar PLC. No confundir con ITB (sobreuso, sin trauma).",
  },
  "posterior-drawer-pcl": {
    id: "posterior-drawer-pcl",
    title: "Cajón posterior / sag (LCP)",
    procedure:
      "Supino, rodilla ~90°. Observar sag tibial; empujar tibia hacia atrás. No confundir con cajón anterior (falsa «corrección»).",
    evidenceNote:
      "JOSPT CPG: LCP ↑ si mecanismo tibia anterior + rodilla flexionada (salpicadero). Agudo doloroso poco fiable.",
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
  "resisted-wrist-flexion": {
    id: "resisted-wrist-flexion",
    title: "Flexión de muñeca resistida (medial)",
    procedure:
      "Codo extendido o semiflexionado, palma hacia arriba. Resistencia a la flexión de muñeca y/o pronación. Registrar si el dolor en epicóndilo medial es familiar.",
    evidenceNote:
      "Cluster medial epicondylalgia (palpación + carga). Menos estudiado que LET. Cribado cubital (4.º–5.º) obligatorio. No confirma rotura.",
  },
  "elbow-flexion-cubital": {
    id: "elbow-flexion-cubital",
    title: "Test de flexión de codo (cubital)",
    procedure:
      "Flexión máxima de codo sostenida (± percusión Tinel en canal cubital detrás del epicóndilo medial). Positivo si reproduce parestesias familiares en anular y meñique.",
    evidenceNote:
      "Buehler/Thayer; Novak/Mackinnon: precisión aislada limitada. Cluster: 4.º–5.º + empeora al apoyar/flexionar el codo. No es STC.",
  },
  "cervical-distraction": {
    id: "cervical-distraction",
    title: "Distracción cervical",
    procedure:
      "Tracción axial suave (supino o sentado). Positivo si alivia el dolor/hormigueo familiar del brazo.",
    evidenceNote:
      "Wainner Spine 2003: parte del cluster (ULTT + Spurling + distracción + rotación <60°). No usar sola. Contraindicada si trauma/inestabilidad no cribados.",
  },
  "thumb-ucl-stress": {
    id: "thumb-ucl-stress",
    title: "Estrés UCL del pulgar (valgo MCP)",
    procedure:
      "Pulgar en ligera flexión MCP (~30°). Estrés en valgo en la MCP comparando con el contralateral. Registrar dolor familiar e inestabilidad.",
    evidenceNote:
      "Skier's/gamekeeper thumb. Dolor + laxitud vs contralateral apoyan UCL en cluster; no confirma grado. RX si sospecha avulsión.",
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
  "snuffbox-palpation": {
    id: "snuffbox-palpation",
    title: "Palpación de la tabaquera anatómica",
    procedure:
      "Con el pulgar en extensión, palpar el valle entre EPL y EPB/APL en la cara radial de la muñeca. Registrar si el dolor es familiar.",
    evidenceNote:
      "FOOSH + tabaquera dolorosa → sospecha escafoides ↑. No confirma fractura; RX inicial puede ser normal. No «solo esguince».",
  },
  "thumb-axial-load": {
    id: "thumb-axial-load",
    title: "Carga axial del pulgar (escafoides)",
    procedure:
      "Compresión axial a lo largo del metacarpiano del pulgar hacia el escafoides. Positivo si reproduce dolor en tabaquera/muñeca radial familiar.",
    evidenceNote:
      "Complemento de tabaquera post-FOOSH. Apoya cribado óseo; no confirma. Imagen si cluster positivo.",
  },
  "tfcc-ulnar-load": {
    id: "tfcc-ulnar-load",
    title: "Carga cubital / fosa cubital (TFCC)",
    procedure:
      "Desviación cubital ± carga axial en muñeca en pronación/supinación. Palpar fosa cubital (entre cúbito y piramidal). Positivo si dolor cubital dorsal/familiar.",
    evidenceNote:
      "Cluster TFCC clínico (dolor lado meñique + torsión/apoyo). No confirma rotura; imagen si trauma + persistencia.",
  },
  "cmc-grind": {
    id: "cmc-grind",
    title: "Grind test CMC del pulgar",
    procedure:
      "Sujetar metacarpiano del pulgar y aplicar compresión axial + rotación en la CMC. Positivo si dolor/crepitación en base del pulgar familiar.",
    evidenceNote:
      "Compatible con artrosis CMC. Diferencial con De Quervain (estiloides vs base). No confirma grado radiológico.",
  },
  "crossed-slr": {
    id: "crossed-slr",
    title: "SLR cruzado (well-leg)",
    procedure:
      "Supino. Elevación de la pierna asintomática. Positivo si reproduce ciática familiar en la pierna dolorosa.",
    evidenceNote:
      "van der Windt Cochrane / Devillé: más específico y menos sensible que SLR ipsilateral. Apoya, no confirma hernia. Negativo no excluye.",
  },
  yergason: {
    id: "yergason",
    title: "Test de Yergason",
    procedure:
      "Codo a 90° pegado al tronco; supinación resistida (± rotación externa). Dolor o salto en surco bicipital.",
    evidenceNote:
      "Dolor o salto en surco → bíceps/corredera. NO confirma SLAP (Hegedus / literatura labrum).",
  },
  "full-can": {
    id: "full-can",
    title: "Full can / Jobe pulgar arriba",
    procedure:
      "Brazos ~90° en plano escapular, pulgares hacia ARRIBA. Resistencia a la abducción. Registrar dolor vs debilidad franca.",
    evidenceNote:
      "Misma familia que empty can (Hegedus; Itoi). Full-can suele tolerarse mejor. Debilidad + drop arm → rotura ↑ en cluster, no aislado.",
  },
  surprise: {
    id: "surprise",
    title: "Surprise / Release (inestabilidad anterior)",
    procedure:
      "Tras relocation en ABD-RE: retirar suavemente la presión posterior. Positivo si reaparece aprensión (miedo), no solo dolor.",
    evidenceNote:
      "Farber JBJS 2006: cluster Apprehension + Relocation ± Surprise (Tier A). No forzar en luxación aguda. Dolor sin miedo ≠ inestabilidad.",
  },
  paxinos: {
    id: "paxinos",
    title: "Paxinos (AC)",
    procedure:
      "Pulgar en espina escapular, índice en clavícula distal; comprimir la AC. Positivo si dolor localizado en la puntita, familiar.",
    evidenceNote:
      "Walton / Chronopoulos: cluster AC Tier A con O'Brien (serie) o Hawkins (screening). No confundir con dolor deltoideo.",
  },
  obrien: {
    id: "obrien",
    title: "O'Brien / Active compression",
    procedure:
      "Flexión 90°, ligera aducción, pulgar abajo, resistencia hacia abajo. Dolor en puntita AC → AC; dolor profundo anterior → screening labral.",
    evidenceNote:
      "Interpretación por LOCALIZACIÓN. AC: Paxinos+O'Brien (Tier A). SLAP: screening con Crank (Tier B) — NUNCA SLAP confirmado.",
  },
  uppercut: {
    id: "uppercut",
    title: "Uppercut (bíceps)",
    procedure:
      "Codo flexionado, antebrazo supinado. Resistencia a un gesto de uppercut. Dolor en surco bicipital familiar.",
    evidenceNote:
      "Batería bíceps Tier C con Speed/Yergason. No confirma SLAP (Hegedus).",
  },
  crank: {
    id: "crank",
    title: "Crank (screening labral)",
    procedure:
      "Supino, abducción ~90–120°, carga axial + rotación. Positivo si dolor anterior profundo familiar o chasquido profundo (no AC superficial).",
    evidenceNote:
      "Metaanálisis combinaciones SLAP: O'Brien + Crank aumenta sensibilidad de SCREENING. Precisión limitada. No SLAP confirmado.",
  },
  "er-lag": {
    id: "er-lag",
    title: "ER lag sign",
    procedure:
      "Codo 90° pegado al tronco; llevar a máxima RE y pedir que mantenga. Positivo si el antebrazo «cae» hacia rotación interna (lag), no solo dolor.",
    evidenceNote:
      "Hertel lag signs / Hegedus: cluster manguito posterior (RE débil + ER lag + Hornblower). No gradúa tamaño de rotura.",
  },
  "belly-press": {
    id: "belly-press",
    title: "Belly press / Napoleon",
    procedure:
      "Mano en abdomen, codo adelantado; presionar el abdomen. Positivo si el codo cae atrás, hay debilidad franca o dolor anterior familiar.",
    evidenceNote:
      "Barth / Hegedus: cluster subescapular (IR lag, Bear hug, Lift-off). Mayor especificidad que sensibilidad en revisiones.",
  },
  "lift-off": {
    id: "lift-off",
    title: "Lift-off / Gerber",
    procedure:
      "Mano en la región lumbar; intentar separar la mano de la espalda. Positivo si no puede o hay lag posterior de la mano.",
    evidenceNote:
      "Gerber / Barth: cluster subescapular. Limitado por rigidez/capsulitis. No tamaño de rotura automático.",
  },
  "kim-test": {
    id: "kim-test",
    title: "Kim test (inestabilidad posterior)",
    procedure:
      "Brazo flexionado ~90°, aducido, RI; carga posterior sobre el húmero proximal. Positivo si dolor posterior familiar o sensación de que «se sale» atrás.",
    evidenceNote:
      "Kim et al.: cluster posterior Tier B con Jerk. Menor evidencia que Apprehension-Relocation-Surprise. Dolor solo ≠ inestabilidad.",
  },
  "jerk-test": {
    id: "jerk-test",
    title: "Jerk test (inestabilidad posterior)",
    procedure:
      "Flexión ~90°, aducción, RI; compresión axial hacia la glenoides. Positivo si chasquido o dolor posterior familiar.",
    evidenceNote:
      "Kim + Jerk = cluster clínico posterior (Tier B). No mismo peso que cluster anterior validado.",
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
  maudsley: {
    id: "maudsley",
    title: "Maudsley (extensión resistida del 3.er dedo)",
    procedure:
      "Codo extendido o casi. Antebrazo en pronación. Resistir la extensión del 3.er dedo (MCP). Registrar DÓNDE duele (epicóndilo vs antebrazo proximal dorsal).",
    evidenceNote:
      "Cluster LET (Cozen/Mill/palpación). Zwerus: precisión aislada limitada. Dolor óseo → LET ↑; músculo proximal → túnel radial. NO = nervio radial lesionado.",
  },
  durkan: {
    id: "durkan",
    title: "Durkan / compresión carpiana",
    procedure:
      "Presión firme mantenida (~30 s) sobre el túnel carpiano. Positivo si parestesias FAMILIARES en territorio mediano.",
    evidenceNote:
      "Cluster STC con historia nocturna (Durkan 1991; D’Arcy JAMA; JOSPT CTS 2019). Evidencia de precisión MIXTA. Negativo no descarta. Meñique solo ≠ STC.",
  },
  "what-test": {
    id: "what-test",
    title: "WHAT (Wrist Hyperflexion and Abduction of the Thumb)",
    procedure:
      "Muñeca en hiperflexión; el paciente abduce el pulgar contra resistencia. Dolor familiar en estiloides radial / 1.er compartimento.",
    evidenceNote:
      "Cluster De Quervain con palpación ± Finkelstein (Goubau). Eichhoff da más falsos +. No confirma tenosinovitis.",
  },
  "hook-test": {
    id: "hook-test",
    title: "Hook test (bíceps distal)",
    procedure:
      "Codo flexionado ~90°, antebrazo supinado. Intentar enganchar el tendón distal del bíceps con el índice desde lateral. Ausencia de gancho + déficit de supinación → completa ↑.",
    evidenceNote:
      "O’Driscoll AJSM 2005 (completas). Hook enganchable no descarta parcial. Squeeze (Ruland) como complemento. No LET.",
  },
  "moving-valgus": {
    id: "moving-valgus",
    title: "Moving valgus (UCL medial)",
    procedure:
      "Valgo mantenido mientras se mueve el codo ~70–120°. Positivo si dolor medial FAMILIAR en el arco de aceleración (lanzador).",
    evidenceNote:
      "O’Driscoll AJSM 2005 describe el test. Cluster C con milking/historia. No confirma rotura de UCL. No inventar LR.",
  },
  "milking-maneuver": {
    id: "milking-maneuver",
    title: "Milking maneuver (UCL)",
    procedure:
      "Hombro ABD, codo ~70–90°. Tracción del pulgar que aplica valgo. Dolor medial familiar en lanzadores.",
    evidenceNote:
      "Complemento de moving valgus (cluster C). No confirma UCL. Cubital puede coexistir.",
  },
  "fovea-sign": {
    id: "fovea-sign",
    title: "Signo de la fóvea (TFCC)",
    procedure:
      "Palpación en el hueco palmar-cubital distal al cúbito, proximal al pisiforme. Positivo si dolor FAMILIAR en ese punto.",
    evidenceNote:
      "Tay JHS 2007 (serie). Cluster TFCC con press/carga cubital. No confirma rotura. No extraer cifras universales.",
  },
  "piano-key": {
    id: "piano-key",
    title: "Piano-key / ballottement DRUJ",
    procedure:
      "Antebrazo pronado. Empujar la cabeza cubital dorsal como tecla y comparar con el lado sano. Positivo si asimetría DOLOROSA (no laxitud simétrica indolora).",
    evidenceNote:
      "Cluster C DRUJ/TFCC (Adams). Fractura reciente de radio: no forzar. Laxitud constitucional ≠ patológica.",
  },
  "watson-scaphoid-shift": {
    id: "watson-scaphoid-shift",
    title: "Watson / scaphoid shift (SL)",
    procedure:
      "Presión sobre el polo palmar del escafoides mientras se lleva la muñeca de cubital a radial. Positivo si dolor/clunk dorsal SL familiar.",
    evidenceNote:
      "Watson JHS 1988. Cluster C. FOOSH + tabaquera → RX primero (no agresivo sobre fractura oculta). + no confirma rotura SL; − no excluye.",
  },
  froment: {
    id: "froment",
    title: "Signo de Froment (cubital motor)",
    procedure:
      "Pinza papel pulgar–índice. Positivo si flexiona IFP del pulgar (FPL) para compensar aductor débil.",
    evidenceNote:
      "Motor cubital; no localiza codo vs Guyon. Usar historia (flexión codo vs presión palmar). Cluster cubital B.",
  },
  "jersey-finger": {
    id: "jersey-finger",
    title: "Jersey finger (flexión activa IFP / FDP)",
    procedure:
      "Pedir flexión activa aislada de la IFP (sujetar la IFD si hace falta). Positivo: no flexiona activamente la IFP tras trauma en flexión (agarre de camiseta). El pasivo puede estar conservado.",
    evidenceNote:
      "Sospecha de avulsión FDP. No esguince simple. Valoración médica/imagen. No inventar grado.",
  },
  "mallet-finger": {
    id: "mallet-finger",
    title: "Mallet finger (extensión activa IFD)",
    procedure:
      "Pedir extensión activa de la punta (IFD). Positivo: no mantiene la extensión activa de la IFD tras golpe en punta. Comparar con el contralateral.",
    evidenceNote:
      "Sospecha de lesión del extensor terminal ± avulsión. RX si hay. No tratar solo como esguince.",
  },
  "trigger-a1": {
    id: "trigger-a1",
    title: "Trigger / polea A1",
    procedure:
      "Palpar el nudillo palmar (A1) mientras el paciente flexiona y extiende. Positivo: chasquido, bloqueo o dolor familiar en A1.",
    evidenceNote:
      "Compatible con trigger / tenosinovitis A1 en cluster. No confirma grado. Diferencial: artrosis IF, STC si hormigueo domina.",
  },
  "lt-ballottement": {
    id: "lt-ballottement",
    title: "Ballottement LT / Reagan / Kleinman shear (clínico)",
    procedure:
      "Fijar semilunar y desplazar piramidal palmar-dorsal (Reagan/ballottement) o cizalla Kleinman del intervalo LT. Positivo: dolor en intervalo LT + holgura vs contralateral — más dorsal-cubital que la fóvea pura.",
    evidenceNote:
      "Cluster C de inestabilidad LT (Reagan JHS). Precisión limitada. Diferencial TFCC/ECU. No confirmar rotura. No SÍ/NO de paciente.",
  },
  "cmc-lever": {
    id: "cmc-lever",
    title: "CMC lever (rizartrosis) — clínico",
    procedure:
      "Estabilizar trapecio. Palanca dorsal/radial del 1.er metacarpiano. Positivo: dolor familiar en la BASE del pulgar (CMC), no en estiloides ni tabaquera.",
    evidenceNote:
      "Complemento del grind. Cluster OA CMC (edad, pinza, grind + lever + palpación). Sin métricas robustas aisladas. No De Quervain si el 1.er compartimento está silente.",
  },
};

export function getTestMeta(testId: string): ClinicalTestMeta | undefined {
  return CLINICAL_TEST_META[testId];
}
