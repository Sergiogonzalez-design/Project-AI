/**
 * Physioguide — anterior knee / PFPS / patellar tendon rules for AI consult.
 * Source: knowledge/clinical-reasoning/knee-anterior-pain.md
 * Keep in sync with lib/physioguide-knee-anterior-rules.ts
 */

export const AI_KNEE_ANTERIOR_PAIN_RULES = `DOLOR ANTERIOR DE RODILLA / PFPS / TENDÓN ROTULIANO (Physioguide — CRÍTICO cuando localización = anterior/rótula/tendón rotuliano):

FLUJO:
localización exacta (rótula vs tendón vs suprarrotuliano) → dolor familiar → historia/mecanismo/carga → palpación → carga funcional (escaleras/sentadilla/salto/sentado) → diferencial → red flags → recomendación.

REGLAS:
- NUNCA: dolor anterior = condromalacia/artrosis confirmada. Condromalacia = hallazgo de imagen.
- NUNCA: un solo test (p. ej. sentadilla dolorosa) = PFPS confirmado sin cluster.
- NUNCA: confundir PFPS con LCA/menisco si hay torsión + pop + hinchazón + inestabilidad/bloqueo.
- Pregunta clave si falta: «¿Es el mismo dolor al bajar escaleras, agacharte o saltar?» (dolor familiar).

CLUSTER PFPS (compatibilidad, no inventar scores):
dolor anterior/retropatelar + escaleras (bajada) / sentadilla / sentado prolongado familiar + SIN bloqueo mecánico ni inestabilidad rotatoria → PFPS ↑.

CLUSTER TENDÓN ROTULIANO:
dolor INFERIOR a rótula (tendón) + salto/aterrizaje/sentadilla profunda + palpación tendón familiar → tendinopatía rotuliana ↑ (jumper's knee).

DIFERENCIAL OBLIGATORIO:
- PFPS / patelofemoral
- tendinopatía rotuliana
- Hoffa / fat pad (extensión forzada)
- prepatelar bursitis (golpe + hinchazón superficial)
- Osgood-Schlatter (adolescente + tuberosidad)
- cuádriceps tendinopathy (suprarrotuliano)
- inestabilidad/luxación rotuliana (episodio desplazamiento — otro bloque cuestionario)
- menisco / LCA (torsión, bloqueo, pop — NO priorizar PFPS)
- gonartrosis (edad + rigidez global)
- referido cadera/lumbar (patrón atípico, irradiación)

CRIBADO CADERA/LUMBAR: si tests patelofemorales no reproducen dolor familiar pero hay irradiación/ parestesias / cuadro atípico → cribar proximal.

PRUEBAS FUNCIONALES (lenguaje cotidiano, solo rodilla anterior):
- ¿Duele más al bajar escaleras que al subir?
- ¿Duele al agacharte o levantarte de una silla?
- ¿Duele después de estar sentado mucho rato (al levantarte)?
- ¿Duele al saltar o al aterrizar?
- ¿Duele si presionas justo debajo de la rótula?

RED FLAGS:
- No puede levantar la pierna estirada (extensión activa) → rotura mecanismo extensor — URGENCIA.
- Rótula desplazada/luxación no reducida.
- Fiebre + hinchazón → artritis séptica.
- Trauma + no apoyo.

IMAGEN: eco tendón/bursa; RMN si persistencia/duda meniscal; RX Osgood/OA. Hallazgo imagen ≠ causa automática.

LENGUAJE: «compatible con síndrome patelofemoral», «compatible con tendinopatía rotuliana». Evitar diagnóstico definitivo por un test.`;
