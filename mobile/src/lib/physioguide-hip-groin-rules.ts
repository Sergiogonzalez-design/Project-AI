/**
 * Physioguide — groin pain (Doha) + hip-related groin rules for AI consult.
 * Source: knowledge/clinical-reasoning/hip-groin-doha.md
 * Keep in sync with lib/physioguide-hip-groin-rules.ts
 */

export const AI_HIP_GROIN_DOHA_RULES = `DOLOR DE INGLE / GROIN DOHA + HIP-RELATED (Physioguide — CRÍTICO cuando localización = ingle/medial/pubis/canal/profundo):

FLUJO:
localización exacta (dedo único) → dolor familiar → historia/mecanismo/carga → subtipo Doha → palpación → tests resistidos → FABER/FADIR (registrar dónde duele) → ROM → diferencial → coexistencia → red flags → recomendación.

REGLAS TRANSVERSALES:
- NUNCA: una prueba resistida aislada confirma adductor, iliopsoas, pubis o FAI.
- NUNCA: FADIR positivo = FAI confirmado.
- NUNCA: pubic pain = osteítis del pubis automáticamente.
- NUNCA: CAM/morfología en imagen = causa del dolor sin correlación clínica.
- NO priorizar labrum/FAI si el paciente solo describe ingle medial/aductor SIN dolor profundo al sentarse/chasquido/bloqueo.

MARCO DOHA — PATRONES DE COMPATIBILIDAD (clusters, no inventar Sn/Sp):
1) ADDUCTOR-RELATED: dolor MEDIAL + sensibilidad aductor + aducción resistida familiar (apretar rodillas/patear) ↑.
2) ILIOPSOAS-RELATED: dolor ANTERIOR + flexión cadera resistida/SLR resistido + estiramiento flexor ↑.
3) INGUINAL-RELATED: localización canal inguinal + palpación canal + carga abdominal (tos/Valsalva orientativo, no diagnóstico aislado) ↑.
4) PUBIC-RELATED: dolor central pubis + palpación sínfisis/hueso pubiano adyacente + dolor familiar ↑.

HIP-RELATED GROIN (profundo + mecánico intraarticular):
Deep groin + sentarse/coche + flexión/rotación + FADIR reproduce dolor profundo familiar + FABER inguinal → ↑ cadera (FAI/labrum/OA/displasia/snapping interno/fractura estrés).
FABER: registrar INGLE vs POSTERIOR vs LATERAL. Posterior → SI/lumbar; lateral → GTPS (otros módulos).

ROM: IR limitada + dolor profundo inguinal → ↑ cadera. Activo limitado + pasivo normal → muscular/tendinoso.

SÍNTOMAS MECÁNICOS: clicking/catching profundo → ↑ intraarticular; giving way ≠ labrum automático; true locking → valoración médica.

BONE STRESS: corredor + ingle progresiva + hop óseo + dolor nocturno → fractura estrés/cuello femoral ↑ — no tratar como tendinitis benigna.

PATOLOGÍAS COEXISTENTES: adductor + pubic, hip + iliopsoas, adductor + hip leve — permitir 2 entidades.

PRUEBAS FUNCIONALES (solo ingle — lenguaje cotidiano):
- ¿Duele al apretar las rodillas o al patear?
- ¿Duele al levantar la rodilla hacia el pecho contra resistencia?
- ¿Duele si presionas el centro del pubis?
- ¿Empeora al toser o estornudar?
- ¿Duele al sentarte en el coche o al llevar la rodilla al pecho?

RED FLAGS: trauma + no apoyo, fiebre, dolor vascular súbito, déficit neurológico, síntomas sistémicos → urgencias/médico.

IMAGEN: RMN/artro-RMN si labrum/FAI persistente; RX si fractura/OA/morfología; eco iliopsoas/snapping. Hallazgo ≠ causa automática.

LENGUAJE: «compatible con adductor-related groin pain (marco Doha)», «aumenta sospecha de participación de cadera».`;
