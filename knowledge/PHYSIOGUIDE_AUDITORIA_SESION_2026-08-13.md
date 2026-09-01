# AUDITORÍA PHYSIOGUIDE — sesión 13 agosto 2026

**Para:** ChatGPT (revisor clínico + técnico)  
**Repo:** `project-ai` (AIKinora)  
**Proyecto Supabase:** `klxlzzgrymkexvuelzex` (`projectai`)  
**Función edge:** `ai-consult` (desplegada al cerrar codo/muñeca)  
**Fecha del trabajo:** 13 agosto 2026  
**Autor de la implementación:** Cursor (Composer) según instrucción del usuario

Este documento describe **lo implementado hoy**, no el estado histórico de Physioguide. Úsalo para **comprobar** si el trabajo es completo, coherente y fiel a las reglas clínicas. No asumas que existe un módulo clínico de hombro/raquis/codo: hoy esas regiones solo tienen **capa de evidencia de tests** (Fase 3).

---

## 0. Cómo debes auditar (instrucción para ChatGPT)

1. Distingue **dos capas** y no las mezcles:
   - **Fase 1 — módulos clínicos** = cómo razonar un caso (localización → historia → cluster → diferencial). Solo se implementaron **cadera** y **rodilla**.
   - **Fase 3 — evidence DB** = qué significa **una prueba** / **un cluster**, qué **no** confirma, qué cita usar. Se implementó para **cadera, rodilla, hombro, raquis, pie/tobillo, codo/muñeca**.
2. Regla de oro: **nunca** prueba aislada = diagnóstico. **Nunca** inventar Sn/Sp/LR/%. Si la evidencia es mixta, debe decirlo.
3. Dual-sync obligatorio (código + RAG). Un markdown sin ingest o unas reglas sin cablear es un fallo.
4. Comprueba las **tres superficies** de IA:
   - Consulta paciente (`lib/ai-consult-rules.ts` + copia mobile)
   - Chat fisioterapeuta (`physio_chat` en `supabase/functions/ai-consult/index.ts`)
   - Informe pre-visita (`physio_report` en el mismo `index.ts`)
5. Al final entrega: (a) qué está bien, (b) huecos reales, (c) errores clínicos si los hay, (d) siguiente tarea recomendada. No reinicies módulos ya hechos.

---

## 1. Contexto y regla de trabajo

Se añadió la regla persistente:

- `.cursor/rules/physioguide-dual-sync.mdc`

**Código (siempre aplicado):**

- Markdown clínico en `knowledge/clinical-reasoning/<modulo>.md`
- Constantes en `lib/physioguide-<modulo>-rules.ts` + copia `mobile/src/lib/`
- Cableado en `lib/ai-consult-rules.ts`, `mobile/src/lib/ai-consult-rules.ts`, `supabase/functions/ai-consult/response-rules.ts`
- Cuestionario adaptativo + `lib/clinical-reasoning/trees.ts` (+ copia mobile)
- Deploy de `ai-consult`
- En módulos de región: las mismas reglas en prompts **physio_chat** y **physio_report**

**RAG (después del código):**

```bash
node scripts/ingest-clinical-reasoning.mjs <archivo.md>
```

Títulos RAG:

- Módulos clínicos: `Physioguide — …`
- Evidence: `Physioguide — Evidencia — …`

Script: `scripts/ingest-clinical-reasoning.mjs` (escanea `knowledge/clinical-reasoning/` y `knowledge/evidence/`).

---

## 2. Orden real de la sesión

1. Limpieza de RAG basura
2. Cerrar hueco **Groin Doha + hip-related** (código + RAG; el resto de cadera ya estaba en código)
3. Módulos clínicos de **rodilla** (anterior → medial → lateral → ACL/inestabilidad → maestro)
4. Aclarar Fase 3 vs Fase 1
5. Fase 3 evidence DB: cadera/rodilla → hombro → raquis → pie/tobillo → **codo/muñeca**
6. Este documento de auditoría

---

## 3. Limpieza RAG (inicio de sesión)

**Script:** `scripts/cleanup-knowledge-junk.mjs` (ejecutado)

| Métrica | Valor |
|---------|--------|
| Chunks antes | 23.262 |
| Chunks después | **22.446** |
| Eliminados | **816** |
| Fuentes distintas tras limpieza | 442 |

**Qué se borró:**

- Basura de scrape: reCAPTCHA, “checking your browser”, bloqueos NCBI (~302)
- Shells PMC vacíos (Cite / Collections / Permalink) (~36)
- Fuentes por nombre (~478): errores NCBI, Google Libros, innerbody fallido, duplicados de groin, PDFs `(1).pdf`, stubs meta (`PARA LA BASE`, `RESUMEN PARA PHYSIOGUIDE`, etc.)

**Se conservó** la fuente canónica `ADDUCTOR-RELATED GROIN PAIN` (126 chunks). El módulo Physioguide Doha se ingirió **después** como capa de razonamiento, no como reemplazo de esos PDFs.

---

## 4. FASE 1 — módulos clínicos (cadera + rodilla)

### 4.1 Cadera (completa)

Árbol: `HIP_TREE` en `lib/clinical-reasoning/trees.ts`  
Entrada: `hp_master_entry` → `hp_master_trauma_gate` → `hp_master_location` → ramas (groin Doha, lateral, posterior, trauma).  
Cuestionario: `lib/consulta-hip-adaptive.ts` (+ mobile). Secciones relevantes: `red_flags`, `core`, `groin_doha`, `trauma`, `c_sign_impingement`, `posterior`, `adductor`, `lateral_trochanter`, etc.

| Archivo markdown | Reglas TS | Título RAG | Chunks RAG (SQL 13-ago) |
|------------------|-----------|------------|-------------------------|
| `hip-master-integration.md` | `physioguide-hip-master-rules.ts` | Physioguide — Cadera — integración maestro hip/groin | 14 |
| `hip-groin-doha.md` | `physioguide-hip-groin-rules.ts` | Physioguide — Cadera — ingle Doha + hip-related | 11 |
| `hip-traumatic.md` | `physioguide-hip-traumatic-rules.ts` | Physioguide — Cadera — trauma y pelvis aguda | 11 |
| `hip-lateral-pain.md` | `physioguide-hip-lateral-rules.ts` | Physioguide — Cadera — dolor lateral / GTPS | 15 |
| `hip-posterior-pain.md` | `physioguide-hip-posterior-rules.ts` | Physioguide — Cadera — dolor posterior / isquio / glúteo | 10 |
| **Total cadera Physioguide** | | | **61** |

**Contenido clínico esperado (comprobar en los .md):**

- **Master:** red flags → localización exacta → rama; coexistencia permitida (hip+adductor, hip+lumbar, etc.)
- **Doha:** adductor / iliopsoas / inguinal / pubic-related + hip-related (FAI/labrum/OA/displasia/snapping interno); FADIR/FABER/ROM/bone stress; localización con un dedo
- **Lateral:** GTPS, glúteo medio/mínimo, bursal, snapping externo, ITB, diferencial L5/SI/cadera
- **Posterior:** isquio proximal, deep gluteal, piriforme, isquiofemoral, QF, SI/lumbar
- **Trauma:** flexor/recto/adductor/isquio agudo, avulsión, fractura, luxación, labrum traumático, criterios de urgencia (apoyo, pop, hematoma)

**Orden de reglas en prompts:** Master → Groin Doha → Trauma → Lateral → Posterior.

### 4.2 Rodilla (completa — hecha hoy)

Árbol: `KNEE_TREE`  
Entrada: `knee_master_entry` → `knee_master_mechanism_gate` → `knee_master_location` → clusters `knee_anterior_cluster`, `knee_medial_cluster`, `knee_lateral_cluster`, `knee_posterior_cluster`, `knee_instability_cluster`.  
Cuestionario: `lib/consulta-knee-adaptive.ts` (+ mobile). Secciones: `anterior_pfp`, `medial`, `lateral`, `posterior`, `instability_acl`.

| Archivo markdown | Reglas TS | Título RAG | Chunks RAG |
|------------------|-----------|------------|------------|
| `knee-master-integration.md` | `physioguide-knee-master-rules.ts` | Physioguide — Rodilla — integración maestro | 14 |
| `knee-anterior-pain.md` | `physioguide-knee-anterior-rules.ts` | Physioguide — Rodilla — dolor anterior / PFPS / tendón rotuliano | 9 |
| `knee-medial-pain.md` | `physioguide-knee-medial-rules.ts` | Physioguide — Rodilla — dolor medial / LCM / menisco / pes anserino | 6 |
| `knee-lateral-pain.md` | `physioguide-knee-lateral-rules.ts` | Physioguide — Rodilla — dolor lateral / LCL / menisco / ITB | 7 |
| `knee-instability-acl.md` | `physioguide-knee-instability-acl-rules.ts` | Physioguide — Rodilla — inestabilidad / LCA / LCP | 8 |
| **Total rodilla Physioguide** | | | **44** |

**Contenido clínico esperado:**

- **Master:** red flags → mecanismo (torsión/pop/ceder) → localización; cribado cadera/lumbar; coexistencia
- **Anterior:** PFPS (no “condromalacia”), tendón rotuliano, Hoffa/prepatelar/Osgood, red flags aparato extensor
- **Medial:** LCM, menisco medial, pes anserino, plica/OA
- **Lateral:** LCL, menisco lateral, ITB, bíceps femoral/OA
- **Inestabilidad:** cluster LCA (torsión + pop + no continuar + hinchazón horas + giving-way); Lachman apoya, no confirma rotura completa; LCP (salpicadero); PLC/tríada; giving-way funcional vs rotuliana

**Orden de reglas en prompts:** Master → Anterior → Medial → Lateral → Instability/ACL.

### 4.3 Cableado de código (debe existir en los tres sitios)

Constantes importadas / inyectadas:

- `AI_HIP_MASTER_INTEGRATION_RULES`
- `AI_HIP_GROIN_DOHA_RULES`
- `AI_HIP_TRAUMATIC_RULES`
- `AI_HIP_LATERAL_PAIN_RULES`
- `AI_HIP_POSTERIOR_PAIN_RULES`
- `AI_KNEE_MASTER_INTEGRATION_RULES`
- `AI_KNEE_ANTERIOR_PAIN_RULES`
- `AI_KNEE_MEDIAL_PAIN_RULES`
- `AI_KNEE_LATERAL_PAIN_RULES`
- `AI_KNEE_INSTABILITY_ACL_RULES`
- `AI_EVIDENCE_DB_RULES`

Archivos:

- `lib/ai-consult-rules.ts`
- `mobile/src/lib/ai-consult-rules.ts`
- `supabase/functions/ai-consult/response-rules.ts` (las reglas hip/knee/evidence están **inline** aquí, no importan los `.ts` de `lib/`)
- `supabase/functions/ai-consult/index.ts` — **physio_chat** y **physio_report** (aprox. líneas 511–590)

Copia mobile de reglas: `mobile/src/lib/physioguide-hip-*-rules.ts` y `physioguide-knee-*-rules.ts` + `physioguide-evidence-db-rules.ts`.

Árboles: `lib/clinical-reasoning/trees.ts` y `mobile/src/lib/clinical-reasoning/trees.ts`.

---

## 5. FASE 3 — evidence DB (catálogo ilustrado)

**Carpeta:** `knowledge/evidence/`  
**Formato por test (master §21):** Purpose · Position · Procedure · Positive · Pain location · Familiar pain · Clinical meaning · Limitations · Differential · AI rule · Citation  

**Prohibido:** inventar sensibilidad, especificidad o likelihood ratios. Preferir cluster. Marcar evidencia MIXTA.

**Reglas AI (atajos):** `lib/physioguide-evidence-db-rules.ts`  
Copias: mobile + `response-rules.ts` (`AI_EVIDENCE_DB_RULES`).  
Header actual: *cadera, rodilla, hombro, raquis, pie/tobillo, codo/muñeca*.

**README:** `knowledge/evidence/README.md`

### 5.1 Archivos, tests/clusters y RAG (conteo SQL 13-ago)

| Archivo | Contenido | Título RAG | Chunks |
|---------|-----------|------------|--------|
| `hip-tests.md` | FADIR, FABER, Trendelenburg, abd/aducción resistida, SLR resistido, hop, SLR | Physioguide — Evidencia — tests de cadera | 9 |
| `knee-tests.md` | Lachman, cajón ant., pivot, McMurray, Thessaly, valgo, varo, cajón post./sag | Physioguide — Evidencia — tests de rodilla | 9 |
| `clusters-hip-knee.md` | Doha adductor/iliopsoas, hip-related/FAIS, GTPS, LCA, menisco, LCM, PFPS, tendón rotuliano, ITB | Physioguide — Evidencia — clusters cadera y rodilla | 5 |
| `shoulder-tests.md` | Neer, Hawkins, Jobe, arco doloroso, drop arm, apprehension/relocation, Speed, Yergason, cross-body AC, Spurling (cribado cervical) | Physioguide — Evidencia — tests de hombro | 13 |
| `clusters-shoulder.md` | RCRSP, rotura manguito, inestabilidad anterior, bíceps/no-SLAP, AC, referido cervical, capsulitis | Physioguide — Evidencia — clusters de hombro | 4 |
| `spine-tests.md` | Spurling, ULTT, distracción, C-spine/NEXUS, SLR, crossed SLR, Kemp, Schober | Physioguide — Evidencia — tests de raquis (cervical/lumbar) | 9 |
| `clusters-spine.md` | Wainner, cervicalgia mecánica, trauma→imagen, ciática, lumbalgia inespecífica, faceta (cautela), inflamatorio/AS, cauda | Physioguide — Evidencia — clusters de raquis | 3 |
| `ankle-foot-tests.md` | Ottawa, cajón ATFL, Thompson, Matles, heel-raise, Windlass, hop, sindesmosis | Physioguide — Evidencia — tests de tobillo y pie | 8 |
| `clusters-ankle-foot.md` | Fractura Ottawa, esguince lateral, sindesmosis, rotura Aquiles, tendinopatía Aquiles, fascia, referido S1 | Physioguide — Evidencia — clusters tobillo y pie | 3 |
| `elbow-wrist-tests.md` | Cozen, Mill, flexión muñeca resistida, Phalen, Tinel mediano, Tinel/flexión cubital, Finkelstein vs Eichhoff, tabaquera/escafoides, ULTT cross-ref | Physioguide — Evidencia — tests de codo y muñeca | 9 |
| `clusters-elbow-wrist.md` | LET, golfista, STC, cubital, De Quervain, referido cervical, escafoides/trauma | Physioguide — Evidencia — clusters codo y muñeca | 3 |
| **Total evidence Physioguide** | | | **75** |

**Total fuentes `Physioguide —%` en RAG: 180 chunks** (61 cadera + 44 rodilla + 75 evidence).

### 5.2 Atajos que DEBEN estar en `AI_EVIDENCE_DB_RULES`

Comprueba que el texto de reglas coincida con esto (no hace falta literal, sí el sentido):

**Cadera:** FADIR familiar inguinal ≠ FAI confirmado (Warwick). FABER: anotar DÓNDE duele. Aducción resistida = adductor-related, no rotura. Monopodal + palpación trocánter = GTPS, no bursitis automática. Hop: no si no apoya.

**Rodilla:** cluster LCA = torsión+pop+no continuar+hinchazón+ceder; Lachman apoya. McMurray/Thessaly en cluster; Thessaly MIXTA. Valgo = LCM, no inventar grado. PFPS ≠ condromalacia. ITB ≠ LCL.

**Hombro:** Neer/Hawkins/arco = RCRSP en cluster, no “pinzamiento confirmado” (Hegedus; Lewis). Jobe débil + drop arm → rotura importante ↑, no tamaño. Aprensión = miedo a que se salga, no solo dolor (Farber). Speed/Yergason ≠ SLAP. Cross-body = AC. Hormigueo/cuello → Spurling. RE pasiva limitada → capsulitis.

**Raquis:** C-spine/NEXUS ANTES de Spurling si trauma (Stiell/Hoffman). Wainner: ULTT+Spurling+distracción+rotación <60°. ULTT aislado poco específico. SLR = ciática familiar, no hernia. Crossed SLR más específico. Kemp ≠ faceta. Schober = cribado inflamatorio. Cauda → hospital.

**Pie/tobillo:** Ottawa primero (Stiell). Cajón ATFL más fiable a 4–5 días. Thompson + no puntillas + pop = Aquiles completo. Windlass negativo no excluye fascia. Dolor tibiofibular alto = sindesmosis. Hormigueo plantar + lumbar → S1, no fascitis automática.

**Codo/muñeca:** Cozen/Mill + palpación = LET en cluster, no inflamación; hormigueo/cuello → PIN o C6–C7 (Zwerus; Vicenzino). Medial + flexión muñeca = golfista; cribado cubital 4.º–5.º. Phalen/Tinel + noche + sacudir = STC (D’Arcy JAMA; JOSPT CTS 2019); negativo no descarta; meñique solo ≠ STC. Cubital = 4.º–5.º + codo flexionado. De Quervain: Finkelstein real; Eichhoff (pulgar en el puño) falsos positivos. Caída + tabaquera → imagen escafoides.

**Citas cualitativas permitidas (sin números inventados):** Doha 2015, Warwick 2016, JOSPT CPG, Benjaminse 2006, Hegedus BJSM, Crossley 2016, Grimaldi/Fearon, Lewis RCRSP, Wainner 2003, van der Windt Cochrane, Stiell Ottawa/C-spine, Maffulli Aquiles, D’Arcy/McGee JAMA STC, JOSPT CTS 2019.

### 5.3 Catálogo ilustrado (`test-catalog.ts`)

Actualizado en:

- `lib/clinical-reasoning/test-catalog.ts`
- `mobile/src/lib/clinical-reasoning/test-catalog.ts`

Notas de evidencia relevantes (comprobar que **no** digan “confirma diagnóstico” ni Sn/Sp inventados):

- `phalen`, `tinel`, `cozen`, `mill` (codo/muñeca, hoy)
- También hay notas previas/hoy en Lachman, McMurray, Thessaly, Neer, Hawkins, Jobe, FADIR, FABER, Trendelenburg, Thompson, Ottawa/cajón, Windlass, Spurling, ULTT, SLR, Kemp, Schober, Speed, Yergason, etc.

---

## 6. Documento maestro

`knowledge/PHYSIOGUIDE_MASTER_CLINICAL_DOCUMENT.md`

- §3 cadera: marcada completa.
- §3 rodilla: marcada completa.
- §31 “SIGUIENTE TAREA”: **FASE 3 EVIDENCE DB — CATÁLOGO ILUSTRADO COMPLETO (✓)** incluyendo codo/muñeca.

**Inconsistencia a corregir (menor, documental):**

- §3 “PENDIENTE” de cadera todavía dice que Fase 3 está hecha como catálogo completo (línea ~180) — texto residual confuso respecto a “pendiente”.
- §3 “Pendiente rodilla” (~línea 231) todavía dice “Ampliar a otras regiones (hombro, raquis, pie)” — **eso ya se hizo** en Fase 3.

La implementación está por delante de esos dos párrafos. El §31 es el estado correcto.

---

## 7. Qué NO se hizo hoy (no es un fallo de dual-sync)

No hay módulos clínicos Fase 1 nuevos de:

- hombro
- raquis (cervical/lumbar)
- tobillo/pie
- codo/muñeca

Esas regiones **sí** tienen evidence DB (tests + clusters + reglas de atajo + RAG). El cuestionario adaptativo de codo/muñeca/hombro **ya existía** en la app; no se reescribió como módulo Physioguide clínico tipo cadera/rodilla.

No se inventaron porcentajes diagnósticos.  
No se sustituyó el principio: síntoma → localización → historia → mecanismo → cluster → compatibilidad.

---

## 8. Deploy e ingest (hechos)

Ingesta: `node scripts/ingest-clinical-reasoning.mjs` por módulo (y al cierre: `elbow-wrist-tests.md` + `clusters-elbow-wrist.md` → 12 chunks).

Deploy:

```bash
npx supabase functions deploy ai-consult --project-ref klxlzzgrymkexvuelzex
```

Último deploy: 13 ago 2026, tras reglas de codo/muñeca. Subió `index.ts` + `response-rules.ts`.

---

## 9. Checklist de verificación (marca sí/no)

### Dual-sync cadera

- [ ] 5 markdown en `knowledge/clinical-reasoning/hip-*.md`
- [ ] 5 archivos `lib/physioguide-hip-*-rules.ts` + 5 copias mobile
- [ ] Inyectados en consulta + physio_chat + physio_report
- [ ] `HIP_TREE` empieza en `hp_master_entry`
- [ ] 61 chunks RAG con los 5 `source_name` de la tabla §4.1

### Dual-sync rodilla

- [ ] 5 markdown `knee-*.md`
- [ ] 5 reglas lib + 5 mobile
- [ ] Inyectados en las 3 superficies
- [ ] `KNEE_TREE` empieza en `knee_master_entry` con mechanism gate
- [ ] Cuestionario con secciones anterior_pfp / medial / lateral / posterior / instability_acl
- [ ] 44 chunks RAG tabla §4.2

### Fase 3

- [ ] 11 markdown evidence (10 clínicos + README no se ingiere)
- [ ] 10 fuentes RAG `Physioguide — Evidencia — …` = 75 chunks
- [ ] `AI_EVIDENCE_DB_RULES` incluye atajos de codo/muñeca en **lib, mobile y response-rules**
- [ ] Ningún test .md afirma un Sn/Sp numérico inventado
- [ ] Clusters dicen explícitamente que un test aislado no confirma
- [ ] FADIR no confirma FAI; Neer no confirma pinzamiento; Phalen no confirma STC; Cozen no confirma inflamación; Kemp no confirma faceta; Thessaly marcada MIXTA

### Seguridad clínica

- [ ] Red flags / urgencia (fractura, cauda, luxación, no apoyo, escafoides, C-spine) no se “tranquilizan” con un test de tejidos blandos
- [ ] Lenguaje: “compatible con”, “aumenta la sospecha”, “en cluster”
- [ ] Al paciente: sin jerga de nombres de tests como diagnóstico

### Documentación

- [ ] §31 del master = Fase 3 completa
- [ ] §3 pendiente rodilla está desactualizado (documentar como deuda menor)

---

## 10. Prompt listo para pegar en ChatGPT

Copia desde aquí:

```
Eres revisor clínico y técnico de Physioguide AI (AIKinora).

Te paso el documento de auditoría de la sesión del 13 agosto 2026 (archivo knowledge/PHYSIOGUIDE_AUDITORIA_SESION_2026-08-13.md del repo).

Tarea:
1. Comprueba coherencia clínica: localización primero, cluster > test aislado, no Sn/Sp inventados, red flags, coexistencia de entidades, familiar pain.
2. Distingue Fase 1 (módulos de razonamiento: solo cadera y rodilla) vs Fase 3 (evidence DB de tests: cadera, rodilla, hombro, raquis, pie/tobillo, codo/muñeca). No pidas módulos clínicos de hombro/codo como si se hubieran prometido hoy.
3. Señala huecos reales (contenido clínico flojo, reglas que contradicen el markdown, RAG que no cubre un módulo, cableado incompleto).
4. Lista errores si un atajo de AI podría diagnosticar de más (p. ej. Cozen = epicondilitis confirmada).
5. Propón la SIGUIENTE tarea exacta, sin reiniciar cadera/rodilla/Fase 3 del catálogo ilustrado.

Responde en español, con: (A) veredicto, (B) hallazgos, (C) riesgos, (D) siguiente tarea.
```

---

## 11. Totales rápidos

| Capa | Módulos / archivos | Chunks RAG |
|------|--------------------|------------|
| Limpieza RAG | −816 chunks basura | base ~22.446 tras limpieza; luego se añadieron Physioguide |
| Fase 1 cadera | 5 | 61 |
| Fase 1 rodilla | 5 | 44 |
| Fase 3 evidence | 10 md ingestados | 75 |
| **Physioguide total** | **20 fuentes** | **180** |

Fin del informe de sesión.
