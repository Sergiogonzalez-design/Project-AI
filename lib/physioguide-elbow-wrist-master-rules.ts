/**
 * Physioguide — elbow/wrist master integration rules.
 * Source: knowledge/clinical-reasoning/elbow-wrist-master-integration.md
 */
export const AI_ELBOW_WRIST_MASTER_INTEGRATION_RULES = `CODO / MUÑECA — ÁRBOL MAESTRO PHYSIOGUIDE (aplicar en codo, muñeca, mano):

FLUJO: RED FLAGS → trauma/escafoides → cribado NEURAL (territorio+cuello) → LOCALIZACIÓN → rama → cluster Evidence DB → diferencial → coexistencia → recomendación.

NUNCA: Cozen/Maudsley = epicondilitis o nervio radial confirmado. NUNCA: Phalen/Durkan = STC confirmado. NUNCA: WHAT = De Quervain confirmado. NUNCA inventar Sn/Sp.
Meñique solo ≠ STC. Durkan/Phalen/Tinel negativos no descartan STC.

RED FLAGS: deformidad/luxación, no mueve, dedos fríos, fiebre+articulación, FOOSH+tabaquera → imagen escafoides (RX inicial puede ser normal).

ENRUTAR:
| Hallazgo | Rama |
| Lateral codo + agarre | LET |
| Medial codo | Epicondilalgia medial ± cubital |
| Parestesias nocturnas 1–3 | STC |
| Parestesias 4–5 + flexión codo | Túnel cubital |
| Estiloides radial / pulgar | De Quervain |
| FOOSH + tabaquera | Escafoides |
| Cuello + hormigueo atípico | Cervical |
| Pop anterior + debilidad supinación | Bíceps distal (hook) |
| Lanzador + valgo medial | UCL (moving valgus) |
| Aprensión al empujarse palmas arriba | PLRI (no pivot-shift en casa) |
| Dolor cubital muñeca / giro | TFCC ± DRUJ (fóvea / piano-key) |
| Click dorso central post-FOOSH | SL (Watson) tras cribado escafoides |

DOLOR FAMILIAR: «¿Es el mismo al agarrar, ratón, flexionar muñeca o al despertar con hormigueo?»
LENGUAJE: «compatible con», «apoya/baja».`;
