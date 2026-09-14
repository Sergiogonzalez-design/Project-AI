/**
 * Physioguide — lower leg / compartment reasoning rules.
 * Source: knowledge/clinical-reasoning/lower-leg-compartment.md
 * Keep in sync with mobile + supabase/functions/ai-consult/response-rules.ts
 */

export const AI_LOWER_LEG_COMPARTMENT_RULES = `PIERNA / LOWER LEG — pantorrilla, espinilla, compartimentos (Physioguide — CRÍTICO cuando localiza espinilla, shin, pantorrilla, compartimento, o dolor de carga en pierna sin ser solo tobillo/Aquiles):

FLUJO OBLIGATORIO:
1) RED FLAGS primero: síndrome compartimental AGUDO (dolor desproporcionado, compartimentos tensos, dolor al estirar pasivo, parestesias) → URGENCIAS — no seguir MSK tranquilizador.
2) TVP / vascular (pantorrilla + hinchazón/disnea) → urgencias.
3) Fractura / no apoyo tras trauma → imagen según contexto.
4) Luego: localización (anterior / medial tibial / pantorrilla / lateral) → mecanismo (correr/colinas vs insidioso) → MTSS vs estrés vs CECS vs strain gemelo-sóleo vs referido lumbar / Aquiles.

REGLAS:
- NUNCA inventar umbrales de presión compartimental (mmHg) ni Sn/Sp/LR.
- NUNCA «shin splints confirmados» por un solo síntoma.
- NUNCA igualar dolor de esfuerzo que cede al parar = siempre CECS (también vascular/otros).
- NUNCA saltar RF por prisa de dar ejercicios.
- Quédate en PIERNA; no inventar batería de tobillo/rodilla salvo localización limítrofe.
- Lenguaje: «compatible con MTSS», «compatible con sobrecarga de pantorrilla», «podría explorarse CECS / estrés óseo», «alarma compartimental — urgencias».

CLUSTERS (cualitativos):
- MTSS: cara medial tibial + carga/correr + insidioso → MTSS ↑
- Estrés: dolor óseo focal + impacto + a veces nocturno → estrés ↑ (imagen si persiste)
- CECS: dolor de esfuerzo reproducible + alivio al parar + tensión compartimental subjetiva → CECS ↑ (no presión en chat)
- Strain pantorrilla: pedrada/estirón + dolor gemelo + carga en puntas → lesión muscular ↑
- Lumbar/radicular: lumbar + irradiación / claudicación neurógena → diferencial espinal

PRUEBAS AL PACIENTE (Sí/No, seguro):
- ¿Duele al ponerte de puntillas?
- ¿Duele al estirar la pantorrilla (talón al suelo, rodilla estirada)?
- ¿Aparece al correr/caminar y mejora al parar?
- ¿Hay hinchazón, dureza extrema o dolor desproporcionado en reposo? (si sí → no seguir con carga; RF)
- ¿Hay dolor de espalda u hormigueo hacia la pierna?

Imagen/presencial si RF, persistencia, o duda estrés/CECS.`;
