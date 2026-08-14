/**
 * Physioguide — knee master integration routing rules for AI consult.
 * Source: knowledge/clinical-reasoning/knee-master-integration.md
 * Keep in sync with supabase/functions/ai-consult/response-rules.ts
 */

export const AI_KNEE_MASTER_INTEGRATION_RULES = `RODILLA — ÁRBOL MAESTRO PHYSIOGUIDE (SIEMPRE aplicar primero en casos de rodilla):

FLUJO OBLIGATORIO (no saltar pasos):
RED FLAGS → ¿mecanismo de inestabilidad/LCA dominante? → LOCALIZACIÓN EXACTA → historia/carga/dolor familiar → rama clínica → palpación → test principal (solo si seguro) → tests complementarios → diferencial → patologías coexistentes → confianza → recomendación.

NUNCA: PRUEBA POSITIVA AISLADA → DIAGNÓSTICO DEFINITIVO.
NUNCA: reclasificar torsión+pop+hinchazón en horas como PFPS solo porque el dolor sea anterior.

PASO 1 — RED FLAGS (antes de tests):
No apoyo post trauma, deformidad/luxación, bloqueo irreductible, fiebre+hinchazón, déficit neurovascular, inestabilidad multiplanar, no levanta pierna estirada (extensor) → URGENCIAS/HOSPITAL.
No pedir pivot/salto/Thessaly si no puede apoyar o hinchazón aguda intensa.

PASO 2 — MECHANISM GATE (prioridad si torsión/pop/ceder):
- Torsión/corte ± no-contacto + pop + no continuar + hinchazón en horas + cede al girar → rama LCA (ver bloque INESTABILIDAD).
- Golpe tibia anterior con rodilla flexionada → LCP.
- Contacto valgo → LCM ± LCA ± menisco (coexistencia).
- Contacto varo → LCL ± PLC.
Si no hay mecanismo estructural dominante → continuar por localización.

PASO 3 — ENRUTAR POR LOCALIZACIÓN EXACTA (usar lo que marcó el paciente, no la categoría «rodilla» del sistema):
| Localización | Rama |
| Cara anterior / rótula | PFPS / patelofemoral (bloque ANTERIOR) |
| Debajo rótula / tendón | Tendinopatía rotuliana |
| Por encima de la rótula | Cuádriceps / prepatelar |
| Cara interna | LCM / menisco medial / pes anserino (bloque MEDIAL) |
| Cara externa | LCL / menisco lateral / ITB (bloque LATERAL) |
| Línea articular | Menisco ± colateral (lado que predomine) |
| Hueco poplíteo | Baker / menisco posterior / LCP |
| Difuso / no seguro | Mecanismo primero; cribado cadera/lumbar |

Si hay VARIAS localizaciones → evaluar cada rama y PERMITIR 2 entidades coexistentes (p. ej. LCA + menisco, PFPS + ITB, LCM + pes + OA). No forzar una sola causa.

DOLOR FAMILIAR (transversal — preguntar si falta):
«¿Es el mismo dolor al bajar escaleras, agacharte, correr, saltar o girar?»
Test que reproduce dolor HABITUAL → peso clínico ↑. Molestia nueva/inespecífica → peso ↓.

CRIBADO CADERA/LUMBAR (cuando proceda):
Tests locales no reproducen dolor familiar; ingle/cadera asociada; parestesias/lumbar; rodilla anterior atípica sin carga PF → referido ↑. Adolescente + cojera → no olvidar cadera.

LENGUAJE: «compatible con», «aumenta la sospecha de», «requiere correlación clínica».
IMAGEN: RX si trauma/no apoyo; RMN si cluster LCA/menisco persistente. Hallazgo ≠ causa automática (condromalacia ≠ PFPS).

Después de enrutar, aplicar el bloque específico de la rama activada (anterior / medial / lateral / inestabilidad) y chunks RAG recuperados.`;
