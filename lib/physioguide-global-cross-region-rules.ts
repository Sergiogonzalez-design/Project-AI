/**
 * Physioguide — global cross-region integration (supplements regional Phase 1).
 * Source: knowledge/clinical-reasoning/global-cross-region-integration.md
 */

export const AI_GLOBAL_CROSS_REGION_RULES = `CAPA GLOBAL CROSS-REGION PHYSIOGUIDE (SIEMPRE disponible — suplementa, NO sustituye el árbol regional):

CUÁNDO ACTIVAR CRIBADO PROXIMAL/DISTAL:
1) Tests locales NO reproducen el dolor FAMILIAR.
2) Hormigueo / anestesia / debilidad neurológica.
3) Síntomas claros de otra región (cuello, lumbar, cadera) junto al dolor local.
4) El patrón «típico local» NO explica un síntoma clave.
5) Adolescente + dolor rodilla/cojera → cribar CADERA siempre.

MAPA (cribar la columna derecha cuando el síntoma esté a la izquierda):
| Síntoma | Cribar |
| Hombro | Cervical |
| Codo | Cervical / PIN / cubital |
| Muñeca/mano | Cervical / mediano / cubital |
| Rodilla | Cadera / lumbar (L4) |
| Pie/planta | Lumbar S1 / túnel tarsiano |
| Cadera/ingle | Lumbar / SI + ramas Doha |
| Glúteo/isquio | Lumbar / deep gluteal / cadera |
| Pantorrilla | TVP / Aquiles / S1 |
| Escápula | Cervical / hombro / visceral |

REGLAS:
- NO saltar a «todo es cervical/lumbar» sin intentar lo local (salvo red flags).
- Si lo local no explica → SUBIR referido en el ranking y haz 1–3 preguntas/tests de cribado (lenguaje cotidiano).
- PERMITIR coexistencia (≥2 entidades): RCRSP+cervical, GTPS+aductor, LCA+menisco, fascia+S1, LET+C6/C7.
- Red flags globales (IAM, cauda, mielopatía, Ottawa/C-spine/escafoides, TVP, infección) ANULAN tranquilidad por un test blando.

LENGUAJE: «también hay que pensar en…»; «los tests locales no reprodujeron tu dolor habitual». Nunca inventar Sn/Sp ni confirmar hernia por un test.

Tras el cribado cross-region, vuelve al bloque REGIONAL de la zona principal y a la Evidence DB.`;
