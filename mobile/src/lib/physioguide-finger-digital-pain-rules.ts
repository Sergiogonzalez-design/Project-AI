/**
 * Physioguide — finger / digital pain reasoning rules.
 * Source: knowledge/clinical-reasoning/finger-digital-pain.md
 */
export const AI_FINGER_DIGITAL_PAIN_RULES = `DEDOS / MANO DIGITAL (Physioguide — CRÍTICO cuando la queja es dedo(s) específico(s)):

FLUJO: red flags → localización exacta + dolor familiar → ¿neural (STC/cervical) vs local? → mecanismo → cluster → diferencial → recomendación.

REGLAS:
- NUNCA Phalen/Tinel aislados = STC confirmado. Negativos no descartan; positivos no confirman.
- NUNCA meñique solo = STC (cubital ↑). Cuello + territorio atípico → cervical.
- NUNCA bloqueo/chasquido = STC automático → trigger/A1 ↑.
- NUNCA estrés UCL doloroso = rotura/Stener confirmados. Holgura marcada ± bump → sospecha completa/Stener → valoración/imagen (Stener 1962; sin Sn/Sp inventados).
- NUNCA hiperextensión IFP + dolor volar = «esguince banal» sin cribado placa volar/RX si hinchazón.
- Pregunta clave: «¿Es el mismo dolor/hormigueo que notas al usar la mano, de noche o al agarrar?» (dolor familiar).

NEURAL GATE — STC:
parestesias nocturnas 1.º–3.º (± mitad radial anular) + sacudir la mano + Phalen/Tinel apoyan → STC ↑.

LOCAL — trigger/A1:
nudillo palmar + chasquido/bloqueo al flexionar + agarre repetitivo → trigger finger ↑.

LOCAL — jersey (FDP):
trauma flexión IFP + no flexiona punta + deporte contacto → jersey finger ↑ → valoración/imagen.

LOCAL — mallet:
trauma IFD + no extiende punta → mallet ↑ → inmovilización/valoración.

LOCAL — UCL pulgar ± Stener:
valgo pulgar + inestabilidad pinza + esquí/bastón → UCL ↑. Holgura marcada / sin tope ± bump MCP → sospecha Stener ↑ → médica/imagen. No «Stener confirmado» solo por estrés.

LOCAL — placa volar IFP:
hiperextensión IFP + dolor VOLAR + flexión/extensión activas conservadas → placa volar ↑. No jersey (activos OK). RX si hinchazón/bloqueo/duda ósea.

LOCAL — esguince IF:
torsión/lateral + dolor articular + hinchazón sin patrón neural ni placa volar clara.

PRUEBAS (lenguaje cotidiano):
- ¿Hormigueo nocturno en pulgar-índice-medio que mejora al sacudir la mano?
- ¿El dedo se engancha o chasquido al flexionar?
- ¿No puedes flexionar la punta del dedo tras agarrar algo?
- ¿No puedes enderezar la punta tras un golpe?
- ¿Inestabilidad al forzar el pulgar hacia fuera? ¿Se abre mucho vs el otro?
- ¿Tras doblar el dedo hacia atrás duele la cara de la palma de la articulación media?

DIFERENCIAL: STC, trigger, jersey, mallet, UCL±Stener, placa volar IFP, IF sprain, fractura, tenosinovitis flexora infecciosa (fiebre), cervical referido.

LENGUAJE: «compatible con…». Déficit abducción pulgar o dedo frío/pálido → valoración médica urgente.`;
