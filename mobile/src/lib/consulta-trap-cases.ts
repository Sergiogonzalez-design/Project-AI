/**
 * Tricky / trap differentials the model must actively consider.
 * Keep compact for prompt injection. Expand validation battery separately.
 */

export const AI_TRAP_CASES_RULES = `CASOS TRAMPA / DIFÍCILES (OBLIGATORIO considerar cuando el patrón encaje — no te quedes en el diagnóstico “obvio” local):

1) Parece epicondilitis lateral → piensa **radiculopatía C7** si: dolor cara lateral del codo + empeora al coger peso + hormigueo en dedo medio + dolor/rigidez cervical + debilidad al extender el codo. Prioriza cervical/nervio sobre tendón.
2) Parece lesión de rodilla → piensa **coxartrosis / cadera** si: dolor de rodilla + cojera + dificultad ponerse calcetines + rotación interna de cadera limitada/dolorosa (RX rodilla puede ser normal). Muchos solo consultan por la rodilla: CRIBA LA CADERA.
3) Parece tendinitis del psoas → piensa **fractura de estrés del cuello femoral** si: corredor + dolor inguinal progresivo + dolor nocturno + empeora corriendo + salto monopodal imposible. Deriva / imagen urgente según gravedad (no trates como tendinitis benigna).
4) Parece tendinopatía de cadera → piensa **necrosis avascular de cabeza femoral** si: dolor profundo de cadera sin trauma + dolor nocturno + RI muy dolorosa + fuerza relativamente conservada. Eleva sospecha y deriva a valoración médica/imagen.
5) Parece epicondilitis → piensa **síndrome del túnel radial** si: dolor lateral del codo NO exactamente en el epicóndilo, más distal + debilidad al extender dedos + no mejora con reposo típico de epicondilitis.
6) Parece “nada / rareza” o parálisis → piensa **neuropatía del interóseo posterior (PIN)** si: poca/nula dolor importante + incapacidad para extender dedos + muñeca ligeramente caída + sensibilidad normal.
7) Parece manguito rotador → piensa **síndrome del desfiladero torácico (TOS)** si: dolor hombro + hormigueo de todo el brazo + empeora con mochila o brazos elevados + mano fría/cambios vasculares.
8) Parece manguito → piensa **SLAP** si: lanzador + chasquidos + dolor profundo + sensación de bloqueo + fuerza casi normal.
9) Parece esguince de muñeca “leve” / RX normal → piensa **fractura de escafoides oculta** si: caída + dolor en el “valle” de la base del pulgar + dolor al pellizcar + dolor axial del pulgar. No des de alta con RX normal si la clínica es típica.
10) Parece fascitis plantar → piensa **túnel tarsiano (nervio tibial)** si: ardor plantar + hormigueo + peor por la noche + dolor medial del tobillo + Tinel/golpeo sensible en tobillo medial.
11) Parece fascitis → piensa **radiculopatía S1** si: dolor plantar + hormigueo + dolor lumbar + debilidad de gemelo + reflejo aquíleo disminuido.
12) Parece tendinitis de Aquiles → piensa **rotura parcial de Aquiles** si: chasquido + aún camina + no puede elevación unilateral de talón + Thompson dudoso + dolor localizado.
13) Parece menisco → piensa **radiculopatía L4** si: dolor de rodilla + hormigueo cara medial + dolor lumbar + reflejo rotuliano disminuido.
14) Parece lesión de hombro → piensa **rotura de pectoral mayor** si: press banca + hematoma axilar + debilidad de aducción + hombro relativamente móvil.
15) Parece hombro musculoesquelético → piensa **infarto / causa cardíaca** si: hombro izquierdo + NO aumenta claramente con movimiento del hombro + sudor frío + náuseas + opresión torácica → **URGENCIAS YA** (no tests funcionales).

NIVEL EXPERTO — dolor referido / trampas frecuentes (cribado activo):
- Rodilla ← cadera | Hombro ← cuello | Lumbar ← sacroilíaca | Glúteo ← piriforme / ciático | Plantar ← S1 | Codo lateral ← nervio radial | Codo medial ← nervio cubital | Escápula ← irritación diafragmática / visceral | Hombro ← IAM | Lumbar inflamatorio ≠ mecánica | Fractura estrés con RX inicial normal | Mielopatía cervical incipiente | Claudicación vascular ≠ ciática | Pantorrilla ← TVP | CECS ≠ periostitis tibial.

REGLA: si el cuadro “típico” local NO explica síntomas clave (neurológicos, cervicales/lumbares, vasculares, sistémicos, imposibilidad de apoyo/salto, RX normal con clínica ósea), SUBE la hipótesis trampa/referida en el ranking y explícalo.`;

/** Compact prompt block for injection into system prompts. */
export function buildTrapCasesPromptBlock(): string {
  return AI_TRAP_CASES_RULES;
}
