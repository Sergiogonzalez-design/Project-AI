/**
 * Physioguide — lateral hip pain reasoning rules for AI consult.
 * Source: knowledge/clinical-reasoning/hip-lateral-pain.md
 * Keep in sync with supabase/functions/ai-consult/response-rules.ts
 */

export const AI_HIP_LATERAL_PAIN_RULES = `DOLOR LATERAL DE CADERA / GTPS (Physioguide — CRÍTICO cuando la localización es lateral/trocantérica):

FLUJO (no saltar pasos):
localización exacta → dolor familiar → historia/mecanismo/carga → palpación → pruebas resistidas → apoyo monopodal → funcionales → diferencial → red flags → recomendación.

REGLAS:
- NUNCA: Trendelenburg positivo = GTPS confirmado. Puede ser glúteo medio, inhibición por dolor, L5 o cadera.
- NUNCA: palpación trocantérica dolorosa = bursitis automática. Preferir «compatible con GTPS / tendinopatía glútea / irritación peritrocantérica».
- NUNCA: una prueba resistida aislada confirma rotura tendinosa.
- Pregunta clave si falta: «¿Es el mismo dolor que notas al caminar/correr/dormir de lado?» (dolor familiar).
- Agravantes GTPS típicos: dormir de lado, escaleras, apoyo monopodal, caminar largo, cruzar piernas.

CLUSTER DE COMPATIBILIDAD (no inventar scores ni sensibilidad):
dolor lateral + sensibilidad trocánter + dolor con carga monopodal + dolor con abducción resistida (familiar) → compatibilidad GTPS/glúteo ↑.

DIFERENCIAL OBLIGATORIO:
- GTPS / glúteo medio-mínimo
- peritrocantérico (puede coexistir)
- snapping externo (ITB/glúteo mayor) si hay chasquido reproducible
- ITB (más distal)
- lumbar referido / L5 si hay síntomas lumbares, SLR, parestesias muslo lateral
- SI si FABER posterior (no inguinal)
- cadera intraarticular SOLO si persiste dolor profundo inguinal / FADIR familiar / ROM sugestivo — FADIR positivo ≠ FAI

PRUEBAS FUNCIONALES (solo zona lateral; lenguaje cotidiano para paciente):
- ¿Duele al dormir sobre ese lado?
- ¿Duele al subir/bajar escaleras o mantener el peso en una sola pierna?
- ¿Duele al separar la pierna hacia fuera contra resistencia?
- ¿Duele al apretar con los dedos el hueso del lateral de la cadera?
- ¿Notas un chasquido en el lateral al caminar o mover la pierna?

PATOLOGÍAS COEXISTENTES: permitir GTPS + lumbar, GTPS + cadera leve, glúteo + ITB. No forzar una sola causa.

LENGUAJE: «compatible con», «aumenta la sospecha de», «requiere correlación clínica». Evitar diagnóstico definitivo por una prueba.

IMAGEN: US/MRI si persistencia o duda; hallazgo en imagen ≠ causa automática del dolor.

RED FLAGS lateral: trauma mayor + no apoyo, fiebre, dolor nocturno progresivo inexplicado, déficit neurológico, hop con dolor óseo intenso → valoración médica.`;
