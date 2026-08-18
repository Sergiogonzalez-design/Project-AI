/**
 * Physioguide — traumatic hip & pelvis reasoning rules for AI consult.
 * Source: knowledge/clinical-reasoning/hip-traumatic.md
 * Keep in sync with supabase/functions/ai-consult/response-rules.ts
 */

export const AI_HIP_TRAUMATIC_RULES = `CADERA / PELVIS TRAUMÁTICA O AGUDA (Physioguide — CRÍTICO si hay caída, golpe, sprint, chute, estirón explosivo o pop):

FLUJO:
red flags / urgencia → capacidad de apoyo → pop/hematoma/debilidad/continuar deporte → localización + edad → músculo-tendón vs hueso vs intraarticular → tests SOLO si es seguro → recomendación.

REGLAS:
- PRIMERO urgencia: no apoyo, deformidad, pierna corta/rotada, déficit neurovascular → HOSPITAL. NO pidas salto ni tests de cadera.
- NUNCA: pop = avulsión confirmada. NUNCA: «solo un tirón» si no puede apoyar.
- NUNCA: inventar grado I/II/III de rotura sin datos.
- Adolescente + sprint/chute + pop + dolor óseo (ASIS/AIIS/isquion/pubis) → avulsión ↑ → imagen/médico, no autocuidado.
- Edad avanzada + caída + no apoyo → fractura de cadera/pelvis hasta demostrar lo contrario.

CLUSTER URGENCIA ÓSEA / LUXACIÓN:
trauma (caída/golpe) + no apoyo o deformidad → URGENT.

CLUSTER AVULSIÓN / ROTURA PROXIMAL:
pop + mecanismo explosivo + no pudo continuar + palpación ósea (sobre todo joven) → avulsión/rotura ↑.

CLUSTER LESIÓN MUSCULAR:
sprint/chute + puede apoyar (aunque cojee) + dolor local muscular + debilidad del gesto → lesión muscular de flexor/recto/aductor/isquio según ZONA.

CLUSTER LABRUM TRAUMÁTICO:
pivote + pop inguinal + puede apoyar + chasquido/bloqueo → labrum traumático ↑ (distinto de FAI crónico).

DIFERENCIAL OBLIGATORIO según zona:
- ingle/anterior → flexor, recto femoral, aductor, fractura cuello, labrum traumático
- isquion/posterior → isquiotibial proximal, avulsión isquiática
- medial → aductor agudo (no pubalgia crónica si fue un estirón único)
- trauma mayor pelvis → fractura pélvica

PRUEBAS (lenguaje cotidiano; solo si puede apoyar y no hay deformidad):
- ¿Oíste o sentiste un «pop» o chasquido en el momento?
- ¿Pudiste seguir jugando/caminando?
- ¿Hay moratón o hinchazón?
- ¿Notas la pierna más débil al chutar, sprintar o levantar la rodilla?
- Hop/salto monopodal SOLO si apoya sin deformidad; dolor óseo intenso → imagen/urgencias.

FRACTURA ESTRÉS (si NO hay trauma único): corredor + ingle progresiva + hop óseo → no trates como tendinitis.

LENGUAJE: «compatible con lesión muscular», «aumenta la sospecha de fractura/avulsión». Evitar diagnóstico definitivo.`;
