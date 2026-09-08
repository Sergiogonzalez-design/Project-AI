# PHYSIOGUIDE AI — SPINE MASTER INTEGRATION (CERVICAL + TORÁCICO + LUMBAR)

**Status:** ACTIVE (Fase 3 — router raquis; integra módulos cervicales, **torácicos** y lumbares)  
**Evidence:** `spine-tests.md`, `clusters-spine.md`, `thoracic-tests.md`, `clusters-thoracic.md` (NO recrear métricas); JOSPT Neck + Low Back CPGs; OPTIMa thoracic 2015; Briganti 2023 (sin CPG TSP); AHA/ACC Chest Pain 2021; Wainner; Canadian C-spine/NEXUS; NICE red flags  
**Principles:** Ver `knowledge/PHYSIOGUIDE_MASTER_CLINICAL_DOCUMENT.md`

---

## 1. DEFINITION

**Spine master integration** = capa de **enrutamiento clínico** que unifica la evaluación de **cuello**, **espalda media/torácica** y **espalda baja** bajo un flujo común: red flags → trauma/imagen → región → radicular vs mecánico → localización exacta → cluster → referidos cruzados → coexistencia → recomendación.

No sustituye los módulos específicos. Los **orquesta**.

**Reglas absolutas:**

- NUNCA: Spurling o SLR = hernia confirmada  
- NUNCA: Kemp = faceta confirmada  
- NUNCA: faceta T / T4 / costilla «confirmada»  
- NUNCA: inventar Sn/Sp ni nivel de raíz sin mapa clínico  
- NUNCA: tests provocativos antes de cribado trauma/red flags / visceral torácico

---

## 2. MASTER FLOW

```
NECK OR MID-BACK OR LOW BACK SYMPTOM
    ↓
REGION GATE: ¿CUELLO / TORÁCICO / LUMBAR? (o varios)
    ↓
RED FLAGS (cauda / mielopatía / visceral cardíaco / trauma / inflamatorio / infección / cáncer)
    ↓ NO (o gestionado)
TRAUMA / FRACTURE GATE
    ↓
RADICULAR vs MECHANICAL GATE (según región)
    ↓
EXACT LOCATION + FAMILIAR PAIN
    ↓
CLUSTER (Wainner / TSP mecánico / SLR / SI / inflamatorio)
    ↓
REFERRED SCREEN
    ↓
COEXISTENCE → CONFIDENCE → RECOMMENDATION
```

---

## 3. MODULE MAP

| Rama clínica | Módulo | Cuándo abrir |
|--------------|--------|--------------|
| Cervical mecánico + radicular | `cervical-neck-pain.md` | Cuello, sin RF mayor, trauma cribado |
| Cervical trauma / mielopatía / vascular | `cervical-trauma-redflags.md` | Trauma, mielopatía, disección, meningismo |
| Torácico RF visceral/fractura | `thoracic-redflags-visceral.md` | Pecho/disnea/fragilidad/Scheuermann |
| Torácico mecánico | `thoracic-spine-pain.md` | Espalda media / interescapular post-RF |
| Torácico master | `thoracic-master-integration.md` | Router T |
| Lumbar mecánico + ciática | `lumbar-back-pain.md` | Espalda baja, sin cauda/RF urgente |
| Cauda / inflamatorio / urgencia lumbar | `lumbar-redflags-inflammatory.md` | Perineal, esfínteres, inflamatorio |
| Hombro (referido cervical) | `shoulder-lateral-rcrsp.md` etc. | Dolor anterolateral hombro |
| Cadera (referido lumbar) | módulos hip | Glúteo/ingle |

---

## 4. RED FLAGS — SIEMPRE PRIMERO

### Cervical (→ trauma module / urgente)

- Trauma mayor no cribado → Canadian C-spine / NEXUS  
- Mielopatía: manos torpes, marcha, hiperreflexia, Lhermitte  
- Disección: cefalea súbita distinta + neurológicos post-manipulación  
- Meningismo: fiebre + rigidez extrema  
- Déficit neurológico progresivo

### Torácico (→ thoracic RF module / urgente)

- Dolor pecho opresivo ± brazo/mandíbula ± disnea ± sudoración → **vía cardíaca** (AHA/ACC 2021)  
- Disnea aguda / hemoptisis / sospecha TEP o pleural → médico/urgencias  
- Fractura / osteoporosis / trauma mínimo → imagen  
- Scheuermann / neuro progresivo según contexto  

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
- Brazo / hormigueo → Wainner ± Bakody  
- Solo local → mecánico cervical  

### Torácico
- Tras RF: AROM T familiar → TSP mecánico no específico  
- Cuello/hombro cambian síntoma → referidos  

### Lumbar
- Pierna bajo rodilla → SLR / ciática  
- Solo local → mecánico / SI / inflamatorio  

---

## 7. LANGUAGE

«Compatible con», «apoya/baja», «evidencia limitada» en torácico. Nunca diagnósticos estructurales cerrados por un test.

---

## 8. CITATIONS

JOSPT Neck/LBP CPGs; OPTIMa / Southerst 2015 PMID 26141077; Briganti 2023 PMC10197218; AHA/ACC Chest Pain 2021; Wainner 2003; Stiell C-spine; Dreyfuss 1994 (faceta T experimental).
