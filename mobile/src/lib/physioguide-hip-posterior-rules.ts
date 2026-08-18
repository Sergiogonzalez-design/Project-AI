/**
 * Physioguide — posterior hip pain reasoning rules for AI consult.
 * Source: knowledge/clinical-reasoning/hip-posterior-pain.md
 * Keep in sync with lib/physioguide-hip-posterior-rules.ts
 */

export const AI_HIP_POSTERIOR_PAIN_RULES = `DOLOR POSTERIOR DE CADERA / GLÚTEO / ISQUION (Physioguide — CRÍTICO cuando la localización es posterior/glúteo/isquion):

FLUJO:
localización exacta (isquion vs glúteo profundo vs posterolateral) → dolor familiar → historia/mecanismo → sentarse/estirar/sprint → screen neurológico → SLR → palpación → FABER (registrar dónde duele) → diferencial → red flags.

REGLAS:
- NUNCA: dolor al sentarse = isquiotibial roto automáticamente.
- NUNCA: dolor glúteo = piriformis confirmado.
- NUNCA: SLR positivo = hernia discal confirmada.
- Diferenciar UBICACIÓN: isquion (sentarse duro + estirar isquio) vs glúteo profundo (sentarse + posible ciática) vs lumbar referido.

CLUSTER ISQUIOTIBIAL PROXIMAL (compatibilidad clínica, no inventar scores):
dolor isquion/posterior + dolor al sentarse (superficie dura) + dolor al estirar isquiotibial (familiar) + mecanismo sobrecarga/sprint si aplica → tendinopatía proximal de isquiotibiales / lesión muscular ↑.

CLUSTER DEEP GLUTEAL / CIÁTICO:
dolor glúteo profundo + empeora sentado (silla dura) + posible parestesia + patrón menos claro de estiramiento isquio → deep gluteal / irritación ciática ↑ (diferenciar lumbar).

CLUSTER LUMBAR/RADICULAR:
SLR positivo familiar + síntomas lumbares + distribución neural → radiculopatía/ciática ↑.

DIFERENCIAL OBLIGATORIO:
- tendinopatía isquiotibial proximal
- lesión muscular aguda de isquiotibiales
- deep gluteal syndrome
- piriformis-related (diagnóstico de exclusión)
- ischiofemoral impingement
- cuádriceps femoris posterior
- cadera posterior / SI
- lumbar referido / radiculopatía

FABER: registrar si el dolor es posterior (SI/lumbar) vs inguinal (cadera — otro módulo).

PRUEBAS FUNCIONALES (lenguaje cotidiano, solo zona posterior):
- ¿Duele al sentarte mucho rato o en una silla dura?
- ¿Duele al estirar la parte de atrás del muslo?
- ¿Hay hormigueo en el glúteo al sentarte?
- ¿Empeora al correr, sprintar o chutar?
- ¿Tienes también dolor lumbar?

PATOLOGÍAS COEXISTENTES: isquio + lumbar, deep gluteal + GTPS lateral, SI + lumbar.

RED FLAGS: trauma + no apoyo, déficit neurológico progresivo, cauda equina, fiebre, dolor nocturno progresivo, pop + incapacidad (avulsión adolescente).

LENGUAJE: «compatible con», «aumenta la sospecha de». Evitar diagnóstico definitivo por un test.`;
