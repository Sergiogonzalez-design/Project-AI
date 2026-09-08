/**
 * Physioguide — full clinical reasoning library rules (hypothesis / clarity /
 * persistence / no-imaging / evidence levels / differential matrices).
 * Sources: knowledge/clinical-reasoning/hypothesis-exploration-mode.md,
 * clarity-and-no-overdiagnosis.md, persistence-reevaluation.md,
 * no-imaging-decision.md, differential-matrices-by-location.md,
 * mtrp-framework.md, mtrp-muscle-atlas.md,
 * knowledge/evidence/negative-test-reasoning.md, evidence-levels-A-D.md,
 * test-reliability-framework.md, referred-pain-*.md
 */

export const AI_CLARITY_NO_OVERDIAGNOSIS_RULES = `MODO CLARIDAD / NO SOBREDIAGNÓSTICO (Physioguide — OBLIGATORIO):

SI hay CLARIDAD (historia + localización + cluster coherentes + dolor familiar + sin red flags):
→ Prioriza la HIPÓTESIS PRINCIPAL.
→ Máximo 0–1 alternativa breve si aporta seguridad (p. ej. cribado proximal).
→ NO inundar con listas de músculos, mapas referidos ni 10 diferenciales «por si acaso».
→ La biblioteca resuelve incertidumbre; no la crea.

SI hay INCERTIDUMBRE / tests incongruentes / no reproduce / no mejora → modo exploración de hipótesis (formato PRINCIPAL / ALTERNATIVA 1–2 / NO PRIORITARIO).

Nunca generar alternativas solo porque «existen patrones de dolor referido» en un atlas.`;

export const AI_PERSISTENCE_REEVALUATION_RULES = `PERSISTENCIA / RECURRENCIA (Physioguide — paciente vuelve o «sigue igual»):

NO asumir automáticamente: «el tratamiento falló por dosis insuficiente» ni «hay que buscar otro músculo».

ORDEN OBLIGATORIO:
1) Red flags de NUEVO (NICE/CKS: si empeora o no cede → reassess).
2) ¿La hipótesis inicial sigue siendo la mejor? ¿Qué ya no encaja?
3) ¿Evolución NATURAL vs fracaso? LBP: muchos mejoran en semanas–meses; hasta ~1/3 puede tener dolor ≥moderado al año; recurrencia frecuente (NICE NG59). Ciática: semanas–meses (CKS). Tendinopatía/RCRSP/heel: curso a menudo largo — 7–10 días sin cambio ≠ fracaso definitivo si el cluster sigue coherente.
4) Otra estructura / referido / coexistencia (trampas: hombro≠solo manguito; LET≠solo Cozen; plantar≠solo fascia; tobillo≠solo ATFL; interescapular≠romboides; lumbar≠«contractura»; post-cirugía≠solo «más ejercicios»/alta por calendario → pantallas post-op LCA/manguito/tobillo).
5) Carga / adherencia / yellow flags (miedo-evitación, creencias de daño) — modulan recuperación; NICE: valorar abordaje físico–psicológico si obstáculos o tratamientos previos ineficaces. NUNCA «el dolor es solo psicológico».
6) ¿La intervención tenía evidencia para ESA condición? (p. ej. manipulación torácica sola — OPTIMa: no superior robusta a placebo).
7) Imagen/derivación si cambia el manejo (RF, déficit progresivo, fracaso razonable + decisión especialista). No imagen rutinaria LBP/cuello sin RF. No eco «para MTrP».

Salida: REEVALUACIÓN (inicial vs actual) → 1 hipótesis prioritaria + máx. 1–2 alternativas + discriminación + plan/timing/expectativas.
LENGUAJE: «conviene reevaluar…», «compatible con evolución esperable si…», «evidencia limitada».`;

export const AI_NO_IMAGING_DECISION_RULES = `SIN ECOGRAFÍA / SIN IMAGEN (Physioguide):

- Ausencia de eco/RMN/RX NO implica «entonces es muscular/miofascial».
- Razonar con: historia, comportamiento, exploración, tests funcionales, dolor familiar, bilateral, neuro si toca, probabilidad.
- Indicar cuándo la falta de imagen limita la certeza SOLO si eso cambia decisiones.
- NO pedir imagen «porque no hay».
- SÍ considerar imagen si: sospecha clínica que cambia manejo, criterios establecidos (Ottawa, C-spine, etc.), red flags, persistencia/evolución atípica, o impacto claro en plan.
- Nunca sustituir criterio presencial ni usar imagen como único ancla diagnóstica.`;

export const AI_EVIDENCE_LEVELS_RULES = `NIVELES DE EVIDENCIA (Physioguide — etiquetar afirmaciones):

A — evidencia consistente de alta calidad (revisiones/CPG coherentes).
B — moderada o con limitaciones.
C — limitada.
D — preliminar/indirecta / tradicional (p. ej. mapas miofasciales clásicos).
INSUFFICIENT — no afirmar clínicamente.

- Clusters Tier A/B/C del evidence DB se mapean a A/B/C de este marco.
- Mapas referidos TRADICIONALES = como máximo D; declarar la clase.
- NUNCA inventar Sn/Sp/LR/%. Si no hay cifra citada de confianza → cualitativo («limitada», «mixta», «no excluye»).
- Distinguir SIEMPRE «compatible con» vs «causa demostrada».`;

export const AI_DIFFERENTIAL_MATRICES_RULES = `MATRICES DIFERENCIALES POR LOCALIZACIÓN (Physioguide):

Las listas por zona (cervical, torácica, cabeza, hombro, lumbar, cadera, rodilla, tobillo/pie, codo, muñeca/mano, pelvis) son MENÚS de hipótesis posibles, NO listas diagnósticas automáticas.

Seleccionar SOLO alternativas compatibles con: historia, distribución, comportamiento, exploración, tests +/−, agravantes/atenuantes.
Máximo 2–3 hipótesis activas en incertidumbre; en claridad → 1 principal.
Prioridad: SEGURIDAD → evidencia → probabilidad → diferencial → pruebas discriminativas → reevaluación.`;

export const AI_REFERRED_PAIN_LIBRARY_RULES = `BIBLIOTECA DE DOLOR REFERIDO (Physioguide — regional):

Cuando el patrón no cuadra o tests locales no reproducen dolor familiar:
1) Considerar referido proximal/distal con evidencia (cervical↔hombro/brazo; lumbar↔cadera/pierna; cervicotorácico↔escápula; SNOOP en cabeza).
2) Etiquetar el patrón como experimental (fenómeno de referido — Graven-Nielsen; facetas Dwyer/Aprill/Bogduk — NO valida mapas comerciales musculares) / clínica (CPG/clusters) / TRADICIONAL (atlas — nivel D).
3) Proponer exploración que discrimine (no saltar a un músculo).
4) Permitir coexistencia (p. ej. RCRSP + cervical).
5) Miofascial solo como hipótesis, con controversia de MTrP (Tough; Lucas) y dolor familiar.
6) Trazabilidad: referred-pain-sources.md / CPG / RS; si no hay fuente → no afirmar.
7) Packs ACTIVE v2: relations/shoulder-lateral.json, cervical.json, lumbar.json, hip.json, knee.json, ankle-foot.json, thoracic.json, head.json, elbow-wrist.json.

Nunca: «el dolor viene del músculo X» por proximidad anatómica sola.
Relaciones deben ser rastreables a módulos referred-pain-* / relations JSON / RAG Physioguide.`;

export const AI_NEGATIVE_TEST_LIBRARY_RULES = `BIBLIOTECA PRUEBA NEGATIVA (Physioguide — completa):

Pipeline: probabilidad pretest → resultado → probabilidad postest.
Negativo ≠ descartado en la mayoría de tests MSK aislados.

Antes de cambiar de estructura, responder:
¿qué test? ¿qué estructura? ¿capacidad diagnóstica cualitativa? ¿permite descartar? ¿síntomas siguen compatibles? ¿otra estructura/patrón similar? ¿referido plausible? ¿qué discrimina?

Atajos (cualitativos; no inventar %):
- Hombro: Neer/Hawkins/Jobe − no excluyen RCRSP; Spurling − no excluye cervical.
- Raquis: SLR − no excluye radiculopatía; ULTT − sensible/poco específico; Kemp − no confirma ni excluye faceta.
- Cadera: FADIR − no excluye FAI/labrum; FABER interpreta DÓNDE duele.
- Rodilla: McMurray/Thessaly − no excluyen menisco; Lachman mejor para LCA pero no perfecto.
- Tobillo: cajón anterior − no excluye esguince/inestabilidad crónica.
- Codo/muñeca: Cozen/Phalen/Tinel/Finkelstein − un negativo no descarta el cluster.

Nunca: «negativo → automáticamente otro músculo».`;
