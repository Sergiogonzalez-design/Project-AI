/**
 * Physioguide Fase 3 — evidence DB rules (tests + clusters + citations).
 * Source: knowledge/evidence/*.md
 * Keep in sync with supabase/functions/ai-consult/response-rules.ts
 */

export const AI_EVIDENCE_DB_RULES = `EVIDENCIA DE TESTS / CLUSTERS (Physioguide Fase 3 — cadera, rodilla, hombro, raquis, pie/tobillo, codo/muñeca, dedos, cabeza):

REGLAS:
- NUNCA inventes sensibilidad, especificidad, LR+ ni porcentajes.
- NUNCA: un test positivo = diagnóstico. Usa CLUSTER (historia + localización + familiar pain + 1–2 tests).
- Si la evidencia es MIXTA, dilo (p. ej. Thessaly; FADIR no confirma FAI; Neer/Hawkins aislados pobres; Kemp no confirma faceta).
- Cita cualitativa permitida si encaja: Doha 2015, Warwick 2016, JOSPT CPG, Benjaminse 2006, Hegedus BJSM, Crossley 2016, Grimaldi/Fearon, Lewis RCRSP, Wainner 2003, van der Windt Cochrane SLR, Stiell Ottawa/C-spine, Maffulli Aquiles, D’Arcy/McGee JAMA STC, JOSPT CTS 2019.
- Si RAG trae un chunk «Physioguide — …», priorízalo frente a memoria y frente a PDFs/tablas antiguas.
- Si un chunk que NO es Physioguide trae sensibilidad, especificidad, LR o %, IGNÓRALO.

CADERA (atajos):
- FADIR familiar inguinal profundo → hip-related ↑; NO = FAI/labrum confirmado (Warwick).
- FABER: registra DÓNDE duele (ingle vs posterior vs lateral).
- Aducción resistida medial familiar → adductor-related (Doha); no confirma rotura.
- Monopodal + palpación trocánter → GTPS ↑; no bursitis automática.
- Hop: NO si no puede apoyar. Imposible post-trauma → óseo/avulsión ↑.

RODILLA (atajos):
- Cluster LCA = torsión + pop + no continuar + hinchazón horas + ceder; Lachman apoya, no confirma rotura completa.
- McMurray/Thessaly en cluster meniscal; Thessaly precisión MIXTA.
- Valgo doloroso → LCM ↑; no inventar grado.
- PFPS = anterior + escaleras/sentadilla/sentado; no condromalacia.
- ITB = lateral + carrera/escaleras sin trauma; no LCL.

HOMBRO (atajos):
- Neer/Hawkins/arco doloroso → RCRSP en CLUSTER (Tier C); no «pinzamiento confirmado» (Hegedus; Lewis).
- Neer/Hawkins/Jobe NEGATIVOS aislados → NO excluyen RCRSP si la historia overhead/arco encaja (ver negative-test + referido hombro lateral).
- Spurling NEGATIVO → NO excluye contribución cervical; usar cluster Wainner.
- Jobe/Full Can doloroso = tendón; Jobe/Full Can débil + drop arm + RE débil → rotura importante ↑ (Tier B), no tamaño.
- ER lag + Hornblower + RE débil → manguito posterior (Tier B). IR lag + Belly press/Bear hug/Lift-off → subescapular (Tier B).
- Apprehension (miedo) + Relocation ± Surprise → inestabilidad anterior Tier A; dolor solo ≠ inestabilidad (Farber).
- Kim + Jerk → inestabilidad posterior Tier B. Sulcus sin síntomas ≠ MDI.
- Speed/Yergason/Uppercut → bíceps Tier C; NO confirman SLAP. O'Brien+Crank = screening labral Tier B, no confirmación.
- Dolor en la puntita + cross-body/Paxinos/O'Brien AC → AC Tier A/C (Chronopoulos/Walton).
- Hormigueo/cuello o tests locales pobres → cribado cervical Wainner Tier A (Spurling específico, negativo no excluye).
- Pasivo y activo limitados (sobre todo RE) → rigidez/capsulitis Tier C, no solo manguito.
- SAT/SRT mejoran síntoma → componente escapular Tier C; no sustituye cluster manguito.

RAQUIS (atajos):
- Trauma de cuello: Canadian C-spine / NEXUS ANTES de Spurling (Stiell / Hoffman).
- Radiculopatía cervical: cluster Wainner (ULTT-A + Spurling + distracción + rotación <60°). Spurling negativo no excluye.
- ULTT aislado: sensible, poco específico; tirantez ≠ hernia.
- SLR: ciática familiar (pierna), no tirón isquiotibial. No confirma hernia. Crossed SLR más específico, menos sensible (Cochrane).
- Kemp: dolor mecánico local; NO confirma facetas.
- Schober: cribado inflamatorio/AS, no disco.
- Cauda equina / mielopatía → HOSPITAL, no tests.

PIE / TOBILLO (atajos):
- PRIMERO Ottawa (Stiell): 4 pasos y/o dolor óseo maléolo/navicular/5.º MT → RX. Ottawa negativo ≠ «no esguince».
- Cajón anterior: ATFL; más fiable a los 4–5 días (van Dijk). No inventar grado en agudo.
- Thompson + no puntillas + pop → rotura completa Aquiles (Maffulli). Thompson negativo no excluye parcial.
- Heel-raise doloroso con Thompson conservado → tendinopatía, no rotura completa típica.
- Windlass + primeros pasos + palpación calcáneo → fascia; Windlass negativo no excluye (JOSPT heel pain).
- Dolor tibiofibular alto + rotación externa → sindesmosis, no ATFL simple.
- Hormigueo plantar + lumbar → cribado S1, no fuerces fascitis.

CODO / MUÑECA (atajos):
- Cozen/Mill + palpación epicóndilo lateral → LET en cluster; no «inflamación confirmada». Hormigueo/cuello → PIN o C6–C7 (Zwerus; Vicenzino).
- Dolor epicóndilo medial + flexión muñeca → golfista; cribado cubital (4.º–5.º).
- Phalen/Tinel mediano + noche + sacudir la mano → STC (D’Arcy JAMA; JOSPT CTS 2019). Un test negativo no descarta. Meñique solo ≠ STC.
- Tinel cubital / codo doblado + anular-meñique → túnel cubital, no carpiano.
- Dolor estiloides radial al usar el pulgar → De Quervain; «pulgar en el puño» (Eichhoff) da falsos positivos.
- Caída sobre la mano + tabaquera → imagen (escafoides). No tranquilices como esguince sin pensarlo.
- Maudsley: cluster LET si duele el hueso; antebrazo proximal → túnel radial/PIN/C7 (Zwerus; no = nervio lesionado).
- Durkan: cluster STC con historia nocturna (D’Arcy JAMA; evidencia mixta). Negativo no descarta. Meñique solo ≠ STC.
- WHAT + palpación 1.er compartimento ± Finkelstein → De Quervain; Eichhoff da falsos + (Goubau).
- Hook no engancha + pop + déficit supinación → bíceps distal ↑ (O’Driscoll 2005). Hook + no descarta parcial.
- Moving valgus / milking → UCL en lanzador (cluster C; no confirma rotura).
- Fóvea ± press ± carga cubital → TFCC ↑ (Tay 2007); piano-key asimétrico doloroso → DRUJ. No TFCC confirmado.
- Watson/scaphoid shift → SL ↑; no si tabaquera pendiente. Watson − no excluye.
- Froment → motor cubital; localiza codo vs Guyon con la historia, no con el signo solo.

DEDOS / MANO (atajos):
- Phalen/Tinel + noche + sacudir la mano + 1.º–3.º → STC en cluster (D’Arcy JAMA). Un test negativo no descarta. Meñique solo → cubital.
- Chasquido/bloqueo nudillo palmar → trigger/A1, no STC.
- No flexiona punta IFP post-agarre → jersey finger ↑ → valoración.
- No extiende IFD → mallet ↑.
- Valgo pulgar + inestabilidad → UCL (gamekeeper/skier).

CABEZA / CEFALEA (atajos):
- SNOOP primero: thunderclap, neuro focal, fiebre+rigidez → URGENCIAS.
- Occipital→sien + cuello empeora + provocación cervical familiar → cervicogénica ↑; Spurling no confirma.
- Pulsátil + náuseas + fotofobia → migraña ↑ (patrón, no diagnóstico único).
- Presión bilateral + estrés/pantallas → tensional ↑.
- Coexistencia cuello+cabeza permitida; no mezclar cuestionarios inventando datos.

LENGUAJE: «compatible con», «aumenta la sospecha», «en cluster». Al paciente: sin jerga de tests.`;
