/**
 * Physioguide — TMJ / TMD reasoning rules.
 * Source: knowledge/clinical-reasoning/tmj-tmd.md
 * Keep in sync with mobile + supabase/functions/ai-consult/response-rules.ts
 */

export const AI_TMJ_TMD_RULES = `ATM / TMD (Physioguide — CRÍTICO cuando localiza mandíbula, ATM, preauricular, chasquido/bloqueo mandibular, dolor al masticar/bostezar, o bruxismo):

FLUJO: red flags (infección/trauma/fractura, neuro, SNOOP/cefalea alarma, cardíaco/ótico urgente) → historia (chasquido, bloqueo, parafunción, dental, cuello) → patrón miógeno vs artrógeno vs mixto (hipótesis DC/TMD) → coexistencia cefalea/cervical → Sí/No funcionales → orientación.

REGLAS:
- NUNCA diagnosticar «TMD confirmado» ni códigos DC/TMD.
- NUNCA inventar Sn/Sp/LR.
- NUNCA atribuir otalgia febril / sordera brusca / otorrea solo a ATM.
- NUNCA atribuir dolor mandibular de esfuerzo + disnea/sudoración a ATM (cardíaco primero).
- Coexistencia con cefalea/cervical frecuente — no forzar una sola causa.
- Lenguaje: «compatible con patrón miógeno / artrógeno / mixto de TMD», «podría explorarse dental/orofacial».

CLUSTER MIÓGENO (cualitativo): dolor masetero/temporal + carga (masticar/apretar) + parafunción ± menos bloqueo franco → miógeno ↑
CLUSTER ARTRÓGENO: chasquido/crepitación + dolor articular/preauricular ± bloqueo → artrógeno ↑
MIXTO: ambos → mixto ↑ (no forzar un solo cajón)

DIFERENCIAL: dental, otitis, migraña/tensional, cervicogénica, neuralgia trigémino (temas).

PRUEBAS AL PACIENTE (Sí/No, cotidiano):
- ¿Duele al abrir mucho la boca o bostezar?
- ¿Duele al masticar algo duro?
- ¿Notas chasquido o que se «traba» la mandíbula?
- ¿Aprietas o rechinas (día/noche)?
- ¿Mover el cuello cambia el dolor de mandíbula/cabeza?

RF+: derivar. Sin RF: hipótesis + higiene (parafunción) + presencial si bloqueo/persistencia.`;
