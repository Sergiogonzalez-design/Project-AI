/**
 * Physioguide — lateral knee pain rules for AI consult.
 * Source: knowledge/clinical-reasoning/knee-lateral-pain.md
 * Keep in sync with supabase/functions/ai-consult/response-rules.ts
 */

export const AI_KNEE_LATERAL_PAIN_RULES = `DOLOR LATERAL DE RODILLA / LCL / MENISCO LATERAL / ITB (Physioguide — CRÍTICO cuando localización = cara externa / línea articular lateral / banda iliotibial):

FLUJO:
localización exacta (LCL vs línea articular vs ITB) → dolor familiar → mecanismo (contacto/varo vs torsión vs carrera progresiva) → hinchazón/bloqueo → palpación → tests cluster → diferencial → red flags.

REGLAS:
- NUNCA: McMurray positivo aislado = menisco confirmado.
- NUNCA: dolor en varo aislado = LCL grado III confirmado.
- NUNCA: confundir ITB (dolor lateral sobre cóndilo + patrón carrera/escaleras) con LCL post-trauma sin mecanismo ni palpación.
- Pregunta clave: «¿Es el mismo dolor al pivotar, correr/bajar cuestas o tras un contacto por fuera?»

CLUSTER LCL (compatibilidad):
dolor cara externa + mecanismo contacto/varo + palpación LCL + estrés en varo familiar → esguince LCL ↑.

CLUSTER MENISCO LATERAL:
dolor línea articular lateral + torsión/pivot + (bloqueo/chasquido/hinchazón si consta) + carga rotacional dolorosa familiar → menisco lateral ↑.

CLUSTER ITB (banda iliotibial):
dolor lateral ITB/cóndilo + carrera/ciclismo/escaleras/cuestas + patrón reproducible a misma distancia o bajada + SIN bloqueo/torsión clara → síndrome ITB ↑.

DIFERENCIAL OBLIGATORIO:
- esguince LCL (I–III según inestabilidad)
- lesión meniscal lateral
- síndrome banda iliotibial (ITBS)
- tendinopatía bíceps femoral
- plica lateral
- OA compartimento lateral
- LCA asociado (torsión + inestabilidad — no olvidar)
- fractura/osteocondral (trauma + no apoyo)
- GTPS / cadera referida (dolor lateral cadera + rodilla)
- referido lumbar L5 (lateral knee + irradiación/lumbar)

PATOLOGÍAS COEXISTENTES: LCL + menisco lateral post-trauma; ITB + PFPS en corredores.

PRUEBAS FUNCIONALES (lenguaje cotidiano, solo zona lateral):
- ¿Te dolió por un golpe o contacto en la parte de fuera de la rodilla?
- ¿Duele en la línea de la articulación por fuera?
- ¿Duele al correr, sobre todo siempre a la misma distancia o al bajar escaleras/cuestas?
- ¿Duele al girar o pivotar apoyando el peso?
- ¿Duele si empujan suavemente la rodilla hacia fuera?

RED FLAGS: no apoyo post trauma, bloqueo irreductible, fiebre+hinchazón, déficit neurovascular, inestabilidad rotatoria severa.

IMAGEN: RMN si persistencia/menisco/LCL; RX fractura/OA; eco ITB/LCL. Hallazgo ≠ causa automática.

LENGUAJE: «compatible con esguince del ligamento colateral lateral», «compatible con irritación meniscal lateral», «compatible con síndrome de la banda iliotibial (ITB)».`;
