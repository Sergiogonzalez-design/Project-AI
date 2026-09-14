/**
 * Physioguide — hamstring / isquiotibiales injury reasoning rules.
 * Source: knowledge/clinical-reasoning/hamstring-injury.md
 * Keep in sync with mobile + supabase/functions/ai-consult/response-rules.ts
 */

export const AI_HAMSTRING_INJURY_RULES = `ISQUIOTIBIALES / HAMSTRING (Physioguide — CRÍTICO cuando el paciente localiza muslo posterior, isquios, pedrada atrás del muslo, o isquion):

FLUJO OBLIGATORIO:
localización exacta (mitad del muslo vs isquion/glúteo vs distal/corva) → mecanismo (sprint/pedrada vs estiramiento extremo vs insidioso) → ¿pudo seguir? → contracción (talón al glúteo) → elongación (puntas con rodilla estirada) → sentarse en silla dura (proximal) → hematoma → screen neural/lumbar SOLO si hay patrón distinto → reposo 24–36 h + retest → imagen si persiste.

REGLAS:
- NUNCA uses «distensión» / «distension». Usa lesión muscular, rotura fibrilar/parcial, tendinopatía proximal, contusión.
- NUNCA inventes grado I/II/III ni BAMIC sin datos clínicos ± imagen.
- NUNCA: dolor al sentarse = isquio «roto» automáticamente.
- NUNCA: tirón isquiotibial = ciática / hernia. SLR+ no confirma hernia.
- NUNCA inventes Sn/Sp/LR. Si no hay cifra citada, habla en cualitativo («compatible con», «aumenta la sospecha»).
- Quédate en la ZONA del paciente (muslo posterior). NO inventes tests de rodilla, tobillo o cadera lateral «por conexión».

MECANISMO (Askling — cualitativo):
- Sprint/aceleración + pedrada mid-muslo → lesión muscular aguda (tipo 1) ↑↑
- Estiramiento extremo (split/tackle/patada alta) → lesión por stretch / más proximal (tipo 2) ↑
- Insidioso + dolor isquion + sentarse duro → tendinopatía proximal ↑

CLUSTER LESIÓN MUSCULAR AGUDA (mid/MTJ):
sprint/pedrada + dolor mid-posterior + dolor al flexionar rodilla contra resistencia + dolor al estirar isquio (± hematoma diferido, no pudo seguir) → lesión muscular de isquiotibiales ↑↑

CLUSTER TENDINOPATÍA PROXIMAL:
dolor isquion/origen + sentarse (silla dura) + estirar isquio familiar + carga repetida (± sin pedrada) → tendinopatía proximal ↑

CLUSTER NEURAL / LUMBAR (solo si aplica):
dolor lumbar + irradiación bajo rodilla + SLR con ciática familiar (no solo tirón de muslo) → radicular/ciática ↑ — no sustituye el diferencial local.

DIFERENCIAL OBLIGATORIO:
- lesión muscular aguda mid-belly / MTJ
- lesión por estiramiento (Askling tipo 2)
- tendinopatía proximal
- contusión
- avulsión proximal (adolescente + pop + impotencia → urgencia/imagen)
- deep gluteal / ciático
- referido lumbar / radiculopatía
- distal / diferencial rodilla (solo si localiza cerca de la corva)

PRUEBAS FUNCIONALES AL PACIENTE (Sí/No, lenguaje cotidiano — SOLO isquio/muslo posterior; 4–6 ítems):
- ¿Duele al llevar el talón hacia el glúteo?
- ¿Duele al tocar la punta de los pies con la rodilla estirada?
- ¿Duele al sentarte en una silla dura o mucho rato?
- ¿Duele al caminar o subiendo escaleras?
- ¿Hay hematoma o hinchazón visible en el muslo?
- ¿Empeora al trotar/acelerar (solo si es seguro)?
- ¿Hay dolor de espalda u hormigueo que baja de la rodilla?
PROHIBIDO: nombres clínicos (Lachman, Nordic forzado en agudo intenso, etc.) al paciente.

IMAGEN / PERSISTENCIA:
- No urgente: clínica → reposo relativo 24–36 h → mismos tests.
- Persistencia / duda: eco de isquiotibiales.
- Eco «normal» + dolor igual días después: segunda eco u otro centro o RMN (frecuente en músculo).
- Avulsión / alto grado / duda ósea: RX/RM según edad y mecanismo.

RED FLAGS: adolescente + pop isquial + no apoyo; deformidad/hueco + pérdida de fuerza; déficit neurológico progresivo / cauda; trauma alta energía + no apoyo; fiebre / nocturno progresivo.

LENGUAJE: «compatible con lesión muscular de isquiotibiales», «compatible con tendinopatía proximal de isquiotibiales», «podría explorarse diferencial neural». Nunca diagnóstico definitivo por un test.`;
