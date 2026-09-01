/**
 * Physioguide — shoulder master integration routing rules for AI consult.
 * Source: knowledge/clinical-reasoning/shoulder-master-integration.md
 * Keep in sync with supabase/functions/ai-consult/response-rules.ts
 */

export const AI_SHOULDER_MASTER_INTEGRATION_RULES = `HOMBRO — ÁRBOL MAESTRO PHYSIOGUIDE (SIEMPRE aplicar primero en casos de hombro):

FLUJO OBLIGATORIO (no saltar pasos):
RED FLAGS → cribado CERVICAL si procede → ¿mecanismo trauma/luxación/«se sale»? → LOCALIZACIÓN EXACTA → historia/carga/dolor familiar → rama clínica → AROM/PROM/fuerza (si seguro) → CLUSTER (Evidence DB) → diferencial → coexistencia → confianza → recomendación.

NUNCA: PRUEBA POSITIVA AISLADA → DIAGNÓSTICO DEFINITIVO.
NUNCA: Neer/Hawkins/arco → «pinzamiento confirmado». Usar RCRSP / irritación del manguito.
NUNCA: reclasificar luxación/«se sale» como solo tendón porque el dolor sea lateral.

PASO 1 — RED FLAGS (antes de tests):
Deformidad / luxación no reducida, no mueve el brazo post-trauma, pérdida franca de fuerza o sensibilidad, fiebre+calor articular, dolor torácico/disnea, sospecha de fractura, déficit neurológico mayor → URGENCIAS/HOSPITAL.
No pedir apprehension forzada ni carga overhead agresiva si luxación aguda, fractura sospechosa o no mueve el brazo.

PASO 2 — CERVICAL SCREEN (cuando proceda):
Cuello, hormigueo, síntomas por debajo del codo, tests locales poco provocativos, Spurling reproduce el brazo → referido cervical ↑. Spurling negativo NO excluye cuello.

PASO 3 — MECHANISM GATE:
- Luxación / subluxación / «se sale» + ABD-RE → rama INESTABILIDAD/TRAUMA.
- Caída sobre hombro / FOOSH → trauma (± AC, fractura, cuff).
- Golpe en punta → AC.
- Overhead/lanzamiento progresivo → enrutar por localización (RCRSP / anterior / AC).
- Limitación GLOBAL activo+pasivo (esp. RE) → capsulitis en diferencial (no solo manguito).

PASO 4 — ENRUTAR POR LOCALIZACIÓN EXACTA (lo que marcó el paciente, no la categoría «hombro»):
| Localización | Rama |
| Lateral / deltoides / anterolateral | RCRSP / manguito (bloque LATERAL) |
| Parte delantera / surco bicipital | Anterior / bíceps |
| Cerca de la clavícula / punta superior | AC |
| Profundo | RCRSP ± inestabilidad ± capsulitis |
| Posterior / escapular | Posterior + cervical |
| Difuso / no seguro | Mecanismo + cervical + elevación |

Si hay VARIAS localizaciones → PERMITIR 2 entidades coexistentes (RCRSP+AC, manguito+cervical, bíceps+RCRSP).

DOLOR FAMILIAR (transversal):
«¿Es el mismo dolor al elevar, dormir de ese lado, lanzar o cruzar el brazo?»
Test que reproduce dolor HABITUAL → peso ↑. Molestia nueva → peso ↓.

CLUSTERS (Evidence DB — Tier A/B/C; no inventar Sn/Sp):
Tier A: inestabilidad anterior (Apprehension+Relocation±Surprise) | AC (Paxinos+O'Brien) | cervical Wainner.
Tier B: rotura manguito (Jobe/Full Can+RE débil+drop arm±lags) | infra/subescap subclusters | SLAP screening (O'Brien+Crank) | inestabilidad posterior (Kim+Jerk).
Tier C: RCRSP | bíceps (Uppercut+Speed+Yergason) | capsulitis | escapular (SAT/SRT) | MDI (Sulcus+historia).

LENGUAJE: «compatible con», «aumenta la sospecha», «apoya/baja la hipótesis».
IMAGEN: RX si trauma/fractura; eco/RMN si déficit de manguito o inestabilidad persistente. Hallazgo ≠ causa automática.

Después de enrutar, aplicar el bloque específico de la rama activada y chunks RAG recuperados.`;
