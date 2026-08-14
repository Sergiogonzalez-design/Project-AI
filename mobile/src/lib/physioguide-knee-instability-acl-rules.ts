/**
 * Physioguide — knee instability / ACL rules for AI consult.
 * Source: knowledge/clinical-reasoning/knee-instability-acl.md
 * Keep in sync with lib/physioguide-knee-instability-acl-rules.ts
 */

export const AI_KNEE_INSTABILITY_ACL_RULES = `INESTABILIDAD DE RODILLA / LCA / LCP / ROTATORIA (Physioguide — CRÍTICO cuando hay torsión, pop, hinchazón aguda, no pudo continuar o sensación de ceder):

FLUJO:
mecanismo (no-contacto/corte vs contacto vs salpicadero) → pop en el momento → ¿pudo continuar? → hinchazón en horas → giving-way al girar → diferencial rotuliana/menisco/LCP → tests cluster SOLO si seguro → red flags.

REGLAS:
- NUNCA: pop aislado = LCA confirmado.
- NUNCA: Lachman o cajón anterior aislado = rotura completa confirmada (sobre todo en agudo con guarda).
- NUNCA: ceder por dolor = rotura de LCA (puede ser giving-way funcional / PFPS / rotuliana).
- NUNCA: confundir «se sale la rótula» con inestabilidad de LCA.
- Pregunta clave: «¿Te torciste, sentiste un pop, se hinchó en horas y no pudiste seguir?»

CLUSTER LCA (compatibilidad):
torsión/corte (± no-contacto o valgo) + pop en el momento + no pudo continuar + hinchazón en horas + cede al girar → LCA ↑.
Lachman/pivot apoyan el cluster; no lo sustituyen.

CLUSTER LCP:
golpe en espinilla con rodilla flexionada (salpicadero / caída de rodillas) + inestabilidad posterior / bajada escaleras → LCP ↑.

CLUSTER PLC:
varo / hiperextensión + inestabilidad rotatoria + dolor posterolateral → complejo posterolateral ↑.

CLUSTER ROTULIANA (no LCA):
episodio de rótula que se desplaza/sale de sitio (± recolocación) → inestabilidad rotuliana, no LCA.

DIFERENCIAL OBLIGATORIO:
- lesión LCA (parcial/completa — no afirmar grado sin datos)
- LCP (mecanismo tibia anterior)
- PLC / LCL
- tríada / lesión combinada (LCA + LCM + menisco)
- menisco (bloqueo, línea articular)
- inestabilidad rotuliana
- giving-way funcional (dolor/inhibición sin pop/hemartros)
- fractura/osteocondral (trauma + no apoyo)

PATOLOGÍAS COEXISTENTES: LCA + menisco; LCA + LCM; LCP + PLC. No simplificar a un solo ligamento si el mecanismo es combinado.

PRUEBAS FUNCIONALES (lenguaje cotidiano):
- ¿Te torciste o cambiaste de dirección sin que te golpearan?
- ¿Sentiste o escuchaste un pop o chasquido en el momento?
- ¿Pudiste seguir jugando o entrenando después?
- ¿Se hinchó mucho la rodilla en las primeras horas?
- ¿La rodilla cede o falla al girar o cambiar de dirección?

RED FLAGS: no apoyo post trauma, deformidad/luxación, bloqueo irreductible, fiebre+hinchazón, déficit neurovascular, inestabilidad multiplanar (rodilla luxable), no levanta pierna estirada.

IMAGEN: RX si trauma/Segond/fractura; RMN si persistencia o planificación. Hallazgo «rotura parcial» ≠ gravedad automática.

LENGUAJE: «compatible con lesión del ligamento cruzado anterior», «compatible con inestabilidad rotatoria». No «rotura completa confirmada» por un test.`;
