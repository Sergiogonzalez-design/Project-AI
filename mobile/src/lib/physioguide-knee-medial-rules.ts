/**
 * Physioguide — medial knee pain rules for AI consult.
 * Source: knowledge/clinical-reasoning/knee-medial-pain.md
 * Keep in sync with lib/physioguide-knee-medial-rules.ts
 */

export const AI_KNEE_MEDIAL_PAIN_RULES = `DOLOR MEDIAL DE RODILLA / LCM / MENISCO MEDIAL / PES ANSERINO (Physioguide — CRÍTICO cuando localización = cara interna / línea articular medial / pes anserino):

FLUJO:
localización exacta (LCM vs línea articular vs pes anserino) → dolor familiar → mecanismo (contacto/valgo vs torsión vs carrera progresiva) → hinchazón/bloqueo → palpación → tests cluster → diferencial → red flags.

REGLAS:
- NUNCA: McMurray positivo aislado = menisco confirmado.
- NUNCA: dolor en valgo aislado = LCM grado III confirmado.
- NUNCA: confundir pes anserino (2–3 cm bajo línea anteromedial) con LCM proximal sin palpación/localización.
- Pregunta clave: «¿Es el mismo dolor al pivotar, bajar escaleras o tras un contacto por dentro?»

CLUSTER LCM (compatibilidad):
dolor cara interna + mecanismo contacto/valgo + palpación LCM + estrés en valgo familiar → esguince LCM ↑.

CLUSTER MENISCO MEDIAL:
dolor línea articular medial + torsión/pivot + (bloqueo/chasquido/hinchazón si consta) + carga rotacional dolorosa familiar → menisco medial ↑.

CLUSTER PES ANSERINO:
dolor anteromedial INFERIOR a línea (zona tendones) + carrera/escaleras/obesidad/edad + palpación pes familiar + SIN bloqueo/torsión clara → pes anserinus ↑.

DIFERENCIAL OBLIGATORIO:
- esguince LCM (I–III según inestabilidad)
- lesión meniscal medial
- bursitis/tendinopatía pes anserino
- plica medial
- OA compartimento medial
- LCA asociado (torsión + inestabilidad — no olvidar)
- fractura/osteocondral (trauma + no apoyo)
- referido lumbar L4 / cadera (medial knee + irradiación/lumbar)

PATOLOGÍAS COEXISTENTES: LCM + menisco medial post-trauma; pes anserino + OA medial.

PRUEBAS FUNCIONALES (lenguaje cotidiano, solo zona medial):
- ¿Te dolió por un golpe o contacto en la parte de dentro de la rodilla?
- ¿Duele en la línea de la articulación por dentro?
- ¿Duele más abajo, en la zona interna bajo la rodilla?
- ¿Duele al girar o pivotar apoyando el peso?
- ¿Se bloquea al estirarla o doblarla del todo?

RED FLAGS: no apoyo post trauma, bloqueo irreductible, fiebre+hinchazón, déficit neurovascular.

IMAGEN: RMN si persistencia/menisco/LCM; RX fractura/OA; eco pes anserino. Hallazgo ≠ causa automática.

LENGUAJE: «compatible con esguince del ligamento colateral medial», «compatible con irritación meniscal medial», «compatible con pes anserino».`;
