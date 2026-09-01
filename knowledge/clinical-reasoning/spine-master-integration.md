# PHYSIOGUIDE AI — SPINE MASTER INTEGRATION (CERVICAL + LUMBAR)

**Status:** ACTIVE (Fase 3 — router raquis; integra módulos cervicales y lumbares)  
**Evidence:** `spine-tests.md`, `clusters-spine.md` (NO recrear métricas); JOSPT Neck + Low Back CPGs; Wainner cluster; Canadian C-spine/NEXUS; NICE red flags  
**Principles:** Ver `knowledge/PHYSIOGUIDE_MASTER_CLINICAL_DOCUMENT.md`

---

## 1. DEFINITION

**Spine master integration** = capa de **enrutamiento clínico** que unifica la evaluación de **cuello** y **espalda baja** bajo un flujo común: red flags → trauma/imagen → radicular vs mecánico → localización exacta → cluster → referidos cruzados (hombro/cadera/pie) → coexistencia → recomendación.

No sustituye los módulos específicos. Los **orquesta**.

**Reglas absolutas:**

- NUNCA: Spurling o SLR = hernia confirmada  
- NUNCA: Kemp = faceta confirmada  
- NUNCA: inventar Sn/Sp ni nivel de raíz sin mapa clínico  
- NUNCA: tests provocativos antes de cribado trauma/red flags

---

## 2. MASTER FLOW

```
NECK OR LOW BACK SYMPTOM
    ↓
REGION GATE: ¿CUELLO O LUMBAR? (o ambos)
    ↓
RED FLAGS (cauda / mielopatía / trauma / inflamatorio / vascular / infección / cáncer)
    ↓ NO (o gestionado)
TRAUMA GATE (cervical: Canadian C-spine/NEXUS)
    ↓
RADICULAR vs MECHANICAL GATE
    ↓
EXACT LOCATION + FAMILIAR PAIN
    ↓
CLUSTER (Wainner / SLR / mecánico / inflamatorio cribado)
    ↓
REFERRED SCREEN (hombro ← cervical; cadera/pie ← lumbar)
    ↓
COEXISTENCE → CONFIDENCE → RECOMMENDATION
```

---

## 3. MODULE MAP

| Rama clínica | Módulo | Cuándo abrir |
|--------------|--------|--------------|
| Cervical mecánico + radicular | `cervical-neck-pain.md` | Cuello, sin RF mayor, trauma cribado |
| Cervical trauma / mielopatía / vascular | `cervical-trauma-redflags.md` | Trauma, mielopatía, disección, meningismo |
| Lumbar mecánico + ciática | `lumbar-back-pain.md` | Espalda baja, sin cauda/RF urgente |
| Cauda / inflamatorio / urgencia lumbar | `lumbar-redflags-inflammatory.md` | Perineal, esfínteres, inflamatorio, cáncer, infección |
| Hombro (referido cervical) | `shoulder-lateral-rcrsp.md` etc. | Dolor anterolateral hombro sin neural claro |
| Cadera (referido lumbar) | módulos hip | Glúteo/ingle, FABER, overlap ciática |

---

## 4. RED FLAGS — SIEMPRE PRIMERO

### Cervical (→ trauma module / urgente)

- Trauma mayor no cribado → Canadian C-spine / NEXUS  
- Mielopatía: manos torpes, marcha, hiperreflexia, Lhermitte  
- Disección: cefalea súbita distinta + neurológicos post-manipulación  
- Meningismo: fiebre + rigidez extrema  
- Déficit neurológico progresivo

### Lumbar (→ red flags module / urgente)

- **Cauda equina:** silla de montar, esfínteres, retención, paresia grave → **HOSPITAL**  
- Fractura/trauma + osteoporosis  
- Infección: fiebre + dolor lumbar  
- Cáncer: antecedente + nocturno + pérdida peso  
- Inflamatorio/SpA: joven + rigidez matutina + nocturno + mejora actividad  
- Déficit neurológico progresivo bilateral

**Regla:** si cualquier RF mayor → **stop** tests provocativos (Spurling, SLR agresivo, thrust).

---

## 5. TRAUMA GATE (CERVICAL)

```
TRAUMA CERVICAL RECIENTE?
→ YES → Canadian C-spine / NEXUS
    → NO BAJO RIESGO → imagen/urgencias; NO Spurling
    → BAJO RIESGO → cervical-neck-pain.md
→ NO → continuar flujo MSK
```

**AI rule:** no «esguince leve» sin cribado documentado.

---

## 6. RADICULAR vs MECHANICAL GATE

### Cuello

| Pista | Radicular ↑ | Mecánico ↑ |
|-------|-------------|------------|
| Localización | Brazo/mano familiar | Cuello/nuca local |
| Spurling | Radicular familiar | Negativo o solo cuello |
| ULTT | Síntoma familiar | Tirantez no familiar |
| Rotación ipsilateral | <60° | Normal o dolor local |
| Cluster Wainner | ≥ varios positivos | Neural no familiar |

### Lumbar

| Pista | Radicular/ciática ↑ | Mecánico ↑ |
|-------|---------------------|------------|
| Localización | Bajo rodilla familiar | Lumbar ± glúteo |
| SLR | Radicular familiar | Tirón isquio o negativo |
| Crossed SLR | Positivo | Negativo |
| Kemp | Local sin irradiación | Dolor lumbar local |
| Déficit/reflejo | Si consta | Normal |

**Regla:** gates orientativos; integrar cluster completo, no un solo test.

---

## 7. EXACT LOCATION + FAMILIAR PAIN

Pregunta universal:

> «Señala con un dedo dónde te duele. ¿Es el mismo dolor en la consulta y en tu vida diaria?»

Registrar:

- **Primary region:** cervical / lumbar / glúteo / brazo / pierna / pie  
- **Familiar pain:** sí/no en cada test  
- **Distribution map:** no inventar dermatoma sin correlación

**Regla:** localización exacta evita sobre-diagnóstico de hernia o faceta.

---

## 8. TEST CLUSTERS (referencia — no inventar scores)

### Radiculopatía cervical (Wainner)

ULTT-A + Spurling + distracción alivia + rotación ipsilateral <60° → radiculopatía cervical compatibility ↑

### Cervicalgia mecánica

Dolor local + mecánico + neural no familiar + sin RF → cervicalgia mecánica ↑

### Ciática / irritación lumbar

Irradiación bajo rodilla + SLR familiar ± crossed SLR ± déficit → irritación nerviosa ↑

### Lumbalgia mecánica inespecífica

Lumbar ± glúteo + mecánico + SLR no radicular + sin RF → lumbalgia mecánica ↑

### Inflamatorio (cribado)

Joven + rigidez matutina + nocturno + mejora actividad ± Schober ↓ → cribado inflamatorio ↑

### Cauda equina

Perineal + esfínteres + paresia → **HOSPITAL** (no cluster de consulta)

Ver detalle en `clusters-spine.md`.

---

## 9. REFERRED PAIN ROUTES

### Cervical → hombro

- Dolor anterolateral hombro sin patrón neural claro → cribar RCRSP  
- Spurling no familiar + arc painful hombro → hombro primario posible  
- Coexistencia frecuente cervical + hombro

### Lumbar → cadera / pie

- Glúteo/lateral: GTPS, SI, radicular L5/S1  
- Inglú profundo: cadera (FABER inguinal)  
- Planta/dedos: S1 vs pie (tarsal, plantar fasciitis)  
- FABER: registrar **dónde** duele (inguinal / posterior / lateral)

**Regla:** referido no excluye primario; permitir ≥2 hipótesis.

---

## 10. FUNCTIONAL TESTS (lenguaje paciente — router)

**Cuello:**

- «¿Al inclinar la cabeza se va el dolor al brazo?»  
- «¿Girar hacia el lado doliente está muy limitado?»

**Lumbar:**

- «¿Agacharte empeora la espalda o te baja dolor por la pierna?»  
- «¿Sentado en el coche empeora el dolor de la pierna?»

**Red flags (ambos):**

- «¿Entumecimiento genital o problemas nuevos para orinar?»  
- «¿Cefalea súbita distinta tras manipulación de cuello?»  
- «¿Rigidez matutina más de media hora?»

---

## 11. COEXISTENCE (permitido)

- Cervical mecánico + RCRSP  
- Lumbar mecánico + ciática leve  
- Lumbar + cadera (GTPS/FAI)  
- Radiculopatía + estenosis  
- Inflamatorio + mecánico superpuesto  
- Cervical + lumbar (postura, compensación)

**Output:** dominant entity + coexisting + uncertain + needs further assessment.

---

## 12. DIFFERENTIAL SUMMARY (cross-region)

| Presentación | Considerar |
|--------------|------------|
| Cuello + brazo | Radicular vs RCRSP vs TOS |
| Cuello + cefalea | Cervicogénica vs primaria vs vascular |
| Lumbar + pierna | Ciática vs isquio vs gemelo |
| Lumbar + glúteo | SI vs hip vs radicular vs GTPS |
| Lumbar + pie | S1 vs plantar vs tarsal |
| Bilateral piernas + manos | Mielopatía cervical (urgente) |
| Joven + rigidez | SpA vs mecánico |

---

## 13. IMAGING (cuándo escalar)

| Región | Indicaciones orientativas |
|--------|---------------------------|
| Cervical RX/RM | Trauma (reglas), radiculopatía persistente, mielopatía, déficit |
| Lumbar RX/RM | RF selectivos, radiculopatía persistente, cauda descartada pero severo |
| Urgente RM | Cauda, déficit progresivo, infección |
| SI/SpA | RM SI + criterios ASAS (médico) |

**Regla global:** imagen ≠ causa sintomática sin correlación clínica.

---

## 14. DECISION TREE (COMPLETO)

```
SPINE SYMPTOM (neck and/or low back)
↓
CAUDA / MIELOPATÍA / MENINGISMO / DISECCIÓN?
→ YES → EMERGENCY PATH
↓ NO
CERVICAL TRAUMA? → TRAUMA GATE
LUMBAR RF (cauda screen, cancer, infection, inflammatory)?
→ YES → RED FLAGS MODULE
↓ NO
RADICULAR vs MECHANICAL (region-specific)
↓
EXACT LOCATION
↓
CLUSTER
↓
REFERRED (shoulder / hip / foot)
↓
COEXISTENCE
↓
CLASSIFICATION + RECOMMENDATION
```

---

## 15. AI LANGUAGE RULES

**Usar:**

- «Compatible con radiculopatía cervical / cervicalgia mecánica / lumbalgia mecánica / irritación nerviosa…»  
- «Los hallazgos se integran en cluster; ningún test aislado confirma hernia…»  
- «Spurling negativo no excluye afectación cervical; SLR negativo no excluye todo componente neural…»  
- «Kemp positivo indica dolor mecánico local; no confirma faceta…»

**Evitar:**

- Diagnósticos estructurales definitivos por un test  
- Inventar nivel C5/C6/C7 o L4/L5/S1 sin mapa  
- Minimizar red flags («probablemente es contractura»)  
- Sn/Sp inventados

---

## 16. FINAL CLASSIFICATION

| Clasificación | Criterio orientativo |
|---------------|---------------------|
| **URGENT / EMERGENCY** | Cauda, mielopatía, disección, meningismo, déficit progresivo, trauma inestable |
| **MEDICAL ASSESSMENT** | RF moderadas, inflamatorio, cáncer, imagen pendiente, radiculopatía persistente |
| **PHYSIOTHERAPY ASSESSMENT** | MSK sin RF, limitación funcional, plan conservador |
| **LOW RISK / INFO** | Leve, autolimitado, reevaluación |

---

## 17. INTEGRATION WITH OTHER REGIONS

- **Shoulder modules:** si cervical descartado como primario pero hombro positivo  
- **Hip modules:** si lumbar irradia a glúteo/ingle — FABER/FADIR context  
- **Global cross-region:** `global-cross-region-integration.md` — paciente multi-región  
- **Evidence DB:** tests individuales en `spine-tests.md`; clusters en `clusters-spine.md`

---

## 18. EVIDENCE NOTE

No inventar sensibilidad, especificidad, LR+, LR−.

Este módulo **referencia** evidencia; no la duplica con números.

Priorizar: JOSPT CPGs (cuello y lumbar), Wainner 2003, Canadian C-spine, NICE NG59, ASAS SpA, Cochrane SLR.

---

END OF SPINE MASTER INTEGRATION MODULE
