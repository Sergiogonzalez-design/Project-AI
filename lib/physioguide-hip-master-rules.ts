/**
 * Physioguide — hip/groin master integration routing rules for AI consult.
 * Source: knowledge/clinical-reasoning/hip-master-integration.md
 * Keep in sync with supabase/functions/ai-consult/response-rules.ts
 */

export const AI_HIP_MASTER_INTEGRATION_RULES = `CADERA / INGLE / PELVIS — ÁRBOL MAESTRO PHYSIOGUIDE (SIEMPRE aplicar primero en casos de cadera/ingle/pelvis):

FLUJO OBLIGATORIO (no saltar pasos):
RED FLAGS → ¿trauma agudo dominante? → LOCALIZACIÓN EXACTA (dedo único) → historia/mecanismo/carga → rama clínica → palpación → test principal → tests complementarios → diferencial → patologías coexistentes → confianza → recomendación.

NUNCA: PRUEBA POSITIVA AISLADA → DIAGNÓSTICO DEFINITIVO.

PASO 1 — RED FLAGS (antes de tests):
Trauma + no apoyo, deformidad, pie frío/déficit neurovascular, cauda equina, fiebre+hinchazón, dolor vascular súbito intenso → URGENCIAS/HOSPITAL. No pedir hop/salto si no puede apoyar.

PASO 2 — TRAUMA AGUDO (prioridad si caída/golpe/sprint/chute/pop):
Activar rama traumatic (ver bloque TRAUMÁTICO abajo). Hop imposible o dolor óseo intenso → sospecha ósea/avulsión/fractura.

PASO 3 — ENRUTAR POR LOCALIZACIÓN EXACTA (usar lo que marcó el paciente, no la categoría «cadera» del sistema):
| Localización | Rama |
| Ingle anterior/delantera | Groin Doha (adductor vs iliopsoas vs inguinal vs pubic vs hip-related) |
| Muslo interno/medial | Adductor-related groin pain |
| Sobre pubis/centro | Pubic-related groin pain |
| Canal inguinal | Inguinal-related groin pain |
| Profundo en cadera | Hip-related groin (FAI/labrum/OA/dysplasia/snapping interno) |
| Lateral/trocánter | GTPS/lateral (bloque LATERAL abajo) |
| Posterior/glúteo/isquion | Posterior (bloque POSTERIOR abajo) |

Si hay VARIAS localizaciones → evaluar cada rama y PERMITIR 2 entidades coexistentes (p. ej. GTPS + adductor, hip + pubic, lumbar + posterior). No forzar una sola causa.

DOLOR FAMILIAR (transversal — preguntar si falta):
«¿Es el mismo dolor que notas al caminar/correr/entrenar/dormir de lado?»
Test que reproduce dolor HABITUAL → peso clínico ↑. Molestia nueva/inespecífica en maniobra → peso ↓.

GROIN DOHA (cuando ingle/medial/pubis/canal inguinal):
- Adductor: dolor MEDIAL + aducción resistida familiar + palpación aductor — NO confirmar solo por resistencia.
- Iliopsoas: dolor ANTERIOR + flexión resistida/SLR resistido + estiramiento flexor.
- Inguinal: canal inguinal + carga abdominal (tos/Valsalva orientativo, no diagnóstico aislado).
- Pubic: sensibilidad sínfisis/hueso pubiano adyacente — pubic pain ≠ osteítis automática.

HIP-RELATED GROIN (solo si profundo + mecánico intraarticular):
FADIR positivo = reproduce dolor profundo familiar → ↑ cadera (NO = FAI confirmado).
FABER: registrar si duele en INGLE vs POSTERIOR vs LATERAL.
ROM IR limitada + dolor profundo → ↑ cadera. CAM en imagen sin correlación clínica ≠ causa del dolor.

CRIBADO LUMBAR/SI (cuando proceda):
Tests locales no reproducen dolor familiar; SLR + lumbar; FABER posterior; parestesias → lumbar/SI/radicular ↑.

LENGUAJE: «compatible con», «aumenta la sospecha de», «requiere correlación clínica».
IMAGEN: indicar cuando persistencia/duda/trauma óseo; hallazgo en imagen ≠ causa automática.

Después de enrutar, aplicar el bloque específico de la rama activada (trauma / lateral / posterior) y chunks RAG recuperados.`;
