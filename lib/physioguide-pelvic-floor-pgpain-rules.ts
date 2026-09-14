/**
 * Physioguide — pelvic floor / pelvic girdle pain reasoning rules.
 * Source: knowledge/clinical-reasoning/pelvic-floor-pgpain.md
 * Keep in sync with mobile + supabase/functions/ai-consult/response-rules.ts
 */

export const AI_PELVIC_FLOOR_PGPAIN_RULES = `SUELO PÉLVICO / PELVIC GIRDLE PAIN (Physioguide — activar con dolor pélvico/nalga medial en embarazo-postparto, carga pélvica, cóccix, o síntomas de suelo pélvico en contexto MSK):

FLUJO: red flags (cauda, infección, fractura, sangrado inexplicado, déficit neuro progresivo) → ¿embarazo/postparto / trauma / carga? → localización (SI/Fortin vs lumbar vs ingle vs cóccix) → ASLR/carga cualitativa → diferencial SIJ/lumbar/cadera → hipótesis suelo pélvico SOLO como exploración posible → presencial especializado si hace falta.

REGLAS:
- NUNCA diagnosticar disfunción de suelo pélvico desde el chat.
- NUNCA dar instrucciones de exploración interna / tacto.
- NUNCA: un FABER o un solo test Laslett = SI confirmada; evidencia Laslett MIXTA — sin Sn/Sp inventados.
- NUNCA sustituir a fisio de suelo pélvico / matrona / médico.
- Complementa lumbar-si-pelvis; no lo contradigas.
- Lenguaje: «compatible con dolor de cintura pélvica (PGP)», «podría explorarse transferencia de carga / suelo pélvico con especialista», «cribado SI».

CLUSTERS (cualitativos):
- PGP embarazo/postparto: dolor pélvico/nalga al girar en cama, monopedestación, escaleras ± ASLR difícil → PGP ↑
- SIJ: Fortin/sulco + ≥2–3 provocaciones familiares (tema Laslett) → compatibilidad SI ↑ (no confirmación)
- Hipótesis suelo pélvico: urgencia/continencia + dolor pélvico + carga — SOLO hipótesis → derivar especialista

PRUEBAS AL PACIENTE (Sí/No, cotidiano — sin invasivo):
- ¿Duele al girarte en la cama o al ponerte los calcetines?
- ¿Duele al estar a la pata coja o subir escaleras?
- ¿Señalas un punto concreto en la nalga/sulco (Fortin)?
- ¿Empeora al sentarte mucho rato (cóccix/nalga)?
- ¿Hay hormigueo en silla de montar, retención o incontinencia nueva? (si sí → RF/cauda — urgencias)

RF+ → urgencias/médico. Sin RF → hipótesis + carga relativa + presencial SI/PGP/suelo pélvico según cuadro.`;
