# PHYSIOGUIDE AI — ELBOW / WRIST MASTER INTEGRATION

**Status:** ACTIVE (Phase 1)  
**Evidence:** `elbow-wrist-tests.md`, `elbow-wrist-tests-expansion.md`, `clusters-elbow-wrist.md`, `clusters-elbow-wrist-hand-tiers.md` (NO recrear Sn/Sp)  
**Principles:** Ver `knowledge/PHYSIOGUIDE_MASTER_CLINICAL_DOCUMENT.md`

---

## 1. DEFINITION

**Master integration codo/muñeca/mano** = router clínico que organiza la evaluación de síntomas en miembro superior distal bajo un flujo único: **red flags → trauma (escafoides) → neural (mediano/cubital/cervical) → localización exacta → rama tendinosa/local → cluster → coexistencia → recomendación**.

No sustituye los módulos específicos; los **activa** según presentación.

**Reglas absolutas:**

- NUNCA: Cozen o Maudsley = epicondilitis / nervio radial confirmado  
- NUNCA: Phalen o Durkan = STC confirmado  
- NUNCA: Finkelstein o WHAT = De Quervain confirmado  
- Cribado cervical obligatorio si hormigueo  
- FOOSH + tabaquera → escafoides antes de «esguince leve»  
- Pop anterior + no engancha bíceps → `elbow-distal-biceps.md`, no LET

---

## 2. MASTER FLOW

```
ELBOW / WRIST / HAND SYMPTOM
    ↓
RED FLAGS (deformidad, NV deficit, infección)
    ↓
TRAUMA GATE (FOOSH / tabaquera → escafoides module)
    ↓
NEURAL SCREEN (territorio + cuello + noche)
    ↓
EXACT LOCATION (finger-point)
    ↓
┌────────────┬────────────┬────────────┬──────────────┐
│ CODO       │ CODO       │ MUÑECA     │ MUÑECA       │
│ LATERAL    │ MEDIAL /   │ RADIAL /   │ PALMAR /     │
│ (LET)      │ CUBITAL    │ DE QUERVAIN│ STC          │
└────────────┴────────────┴────────────┴──────────────┘
    ↓
CLUSTER (Evidence DB — no scores inventados)
    ↓
DIFFERENTIAL + CERVICAL SI PROCEDE
    ↓
COEXISTENCE (LET+STC, cubital+medial, cervical+local)
    ↓
CONFIDENCE + RECOMMENDATION
```

---

## 3. RED FLAGS (stop / medical)

- Deformidad / luxación codo o muñeca  
- No mueve codo/muñeca post-trauma  
- Dedos fríos / pálidos / déficit vascular  
- Herida abierta / fiebre + articulación caliente  
- FOOSH + tabaquera dolorosa → **imagen** (escafoides; RX inicial puede ser normal)  
- Debilidad franca agarre + déficit neurológico marcado  
- Pop anterior codo + incapacidad supinación (cabeza radial)  
- Progresión rápida atrofia tenar

**Regla:** red flag presente → no continuar solo con razonamiento tendinoso.

---

## 4. TRAUMA GATE

Activar `wrist-trauma-scaphoid.md` cuando:

- Caída sobre mano extendida (FOOSH)  
- Dolor tabaquera anatómica  
- Dolor axial pulgar / pinza post-trauma  
- Incapacidad de usar la mano tras trauma

```
FOOSH + TABAQUERA DOLOROSA
→ ESCAFOIDES RISK ↑
→ IMAGEN (no alta tranquilizadora solo con RX normal)
```

Después de descartar fractura → esguince, TFCC, De Quervain, STC según residuo.

---

## 5. NEURAL SCREEN (antes de cerrar local)

| Pregunta | Si sí → |
|----------|---------|
| ¿Hormigueo nocturno 1.º–3.º? | STC branch |
| ¿Meñique/anular 4.º–5.º? | Cubital branch |
| ¿Cuello + brazo? | Cervical branch |
| ¿Sacudir mano alivia? | STC ↑ |

**Regla:** neural dominante → `elbow-wrist-neural.md` primero; tendinoso puede coexistir.

---

## 6. LOCATION ROUTING

| Localización (finger-point) | Rama | Módulo |
|--------------|------|--------|
| Epicóndilo lateral / agarre | LET | `elbow-epicondylalgia.md` (Cozen/Mill/**Maudsley**) |
| Maudsley duele más antebrazo que hueso | Túnel radial / PIN | `elbow-radial-tunnel.md` |
| Epicóndilo medial | Medial ± cubital | `elbow-epicondylalgia.md` + neural |
| Lanzador + valgo medial | UCL | `elbow-ucl-medial.md` |
| Pop anterior + déficit supinación | Bíceps distal | `elbow-distal-biceps.md` |
| Aprensión al empujarse palmas arriba | PLRI | `elbow-plri.md` (no pivot-shift en casa) |
| Posterior olecranon | Tríceps / bursitis / trauma | `elbow-distal-triceps.md` + red flags |
| Hormigueo 1.º–3.º (noche) | STC | `elbow-wrist-neural.md` (Durkan/Phalen/Tinel) |
| Hormigueo 4.º–5.º + flexión codo | Túnel cubital | `elbow-wrist-neural.md` |
| Hormigueo 4.º–5.º + presión palmar | Guyon | `elbow-wrist-guyon.md` |
| Estiloides radial / base pulgar | De Quervain | `wrist-dequervain.md` (**WHAT**/Finkelstein) |
| FOOSH + tabaquera | Escafoides | `wrist-trauma-scaphoid.md` |
| Cuello + brazo | Cervical | `elbow-wrist-neural.md` |
| Dolor cubital / giro / fóvea | TFCC ± DRUJ | `wrist-tfcc-ulnar.md`, `wrist-druj.md` |
| Click dorso central post-FOOSH | SL | `wrist-carpal-instability.md` (Watson tras cribado escafoides) |
| Dorso cubital + shear | LT | `wrist-carpal-instability.md` |

**Regla:** localización exacta ≠ diagnóstico; activa rama + cluster.

---

## 7. FAMILIAR PAIN (transversal)

> «¿Es el mismo dolor al agarrar, girar un pomo, usar el ratón, flexionar la muñeca o al despertar con hormigueo?»

Registrar en:

- Cozen/Mill/**Maudsley** (LET; Maudsley: ¿hueso o antebrazo?)  
- Durkan/Phalen/Tinel (STC)  
- WHAT/Finkelstein (De Quervain)  
- Fóvea / carga cubital / piano-key (TFCC/DRUJ)  
- Palpación epicóndilo / tabaquera / estiloides

**Familiar pain** aumenta peso del cluster; nunca confirma diagnóstico único.

---

## 8. CLUSTERS (Evidence DB — referencia)

| Cluster | Componentes clave | Módulo |
|---------|-------------------|--------|
| LET | Lateral + palpación + Cozen/Mill/**Maudsley** óseo + agarre | epicondylalgia |
| Medial | Medial + flexión/pronación resistida | epicondylalgia |
| UCL | Lanzador + moving valgus / milking | ucl-medial |
| Bíceps distal | Pop + hook ausente + déficit supinación | distal-biceps |
| STC | Nocturno mediano ± **Durkan**/Phalen/Tinel | neural |
| Cubital | 4.º–5.º + flexión codo ± Froment | neural / guyon |
| De Quervain | Estiloides + pulgar + **WHAT**/Finkelstein | dequervain |
| TFCC | Fóvea ± press ± carga cubital | tfcc-ulnar |
| DRUJ | Piano-key asimétrico doloroso | druj |
| SL / LT | Watson / ballottement (clínico) | carpal-instability |
| Cervical | Cuello + Spurling + locales pobres | neural |
| Escafoides | FOOSH + tabaquera | scaphoid |

Ver detalle en `clusters-elbow-wrist.md` y `clusters-elbow-wrist-hand-tiers.md`. **No recrear Sn/Sp.**

---

## 9. COEXISTING PATHOLOGY

Permitir y declarar:

- LET + STC (trabajo repetitivo)  
- Medial + túnel cubital  
- De Quervain + STC leve  
- Cervical + LET (dolor referido + local)  
- Escafoides descartado + esguince + TFCC

**Output:** dominant entity + coexisting + uncertain + needs further assessment.

---

## 10. BRANCH-SPECIFIC QUICK RULES

### Codo lateral (LET)

- Cluster palpación + Cozen/Mill/**Maudsley** (dolor en el **hueso**) + agarre  
- Maudsley en antebrazo proximal → túnel radial, no LET puro  
- Si hormigueo → PIN/cervical antes de cerrar

### Codo medial

- Flexión/pronación resistida + palpación  
- Cribado 4.º–5.º obligatorio  
- Lanzador + valgo → UCL (`elbow-ucl-medial.md`), no solo golfista

### Muñeca radial (De Quervain)

- Pulgar + estiloides; **WHAT** ± Finkelstein (no solo Eichhoff)

### Muñeca palmar (STC)

- Historia nocturna > Durkan/Phalen aislado

### Muñeca cubital

- Fóvea/press → TFCC; piano-key → DRUJ; shear dorsal → LT

### Trauma

- Ottawa no aplica muñeca igual que tobillo; usar cluster escafoides  
- Pop antecubital → hook (bíceps distal)

---

## 11. DECISION TREE (compact)

```
SÍNTOMA CODO/MUÑECA/MANO
↓
¿RED FLAG? → URGENT/MEDICAL
↓
¿FOOSH + TABAQUERA? → SCAPHOID PATH
↓
¿PARESTESIAS DOMINANTES? → NEURAL PATH
↓
FINGER-POINT LOCATION → BRANCH MODULE
↓
CLUSTER + FAMILIAR PAIN
↓
DIFFERENTIAL ABIERTO? → CERVICAL / TRAUMA / COEXISTENCE
↓
CLASSIFICATION + NEXT STEP
```

---

## 12. IMAGING ROUTER

| Situación | Considerar |
|-----------|------------|
| FOOSH + tabaquera | RX muñeca; considerar RM si RX normal + clínica típica |
| Trauma codo deformidad | RX codo |
| STC persistente + déficit | EMG; médico |
| De Quervain persistente | US (contexto clínico) |
| LET sin respuesta prolongada | US/MRI si indicado clínicamente |

**Regla:** imagen ≠ causa sin correlación clínica.

---

## 13. AI LANGUAGE RULES

**Usar:**

- «Según localización y cluster, compatible con…»  
- «Hay que descartar escafoides antes de clasificar como esguince leve…»  
- «Phalen negativo no descarta STC si la historia es típica…»  
- «Puede coexistir tendinopatía local y compresión neural…»

**Evitar:**

- «Es epicondilitis porque Cozen duele.»  
- «Solo esguince de muñeca.» (sin trauma gate)  
- «Phalen confirma túnel carpiano.»

---

## 14. FINAL CLASSIFICATION

| Clasificación | Criterio orientativo |
|---------------|---------------------|
| **LOW RISK / INFO** | Leve, sin red flags, educación + reevaluación |
| **PHYSIOTHERAPY ASSESSMENT** | MSK/neural leve-moderado, plan carga/ergonomía |
| **MEDICAL ASSESSMENT** | Trauma sospecha fractura, déficit neural, persistencia |
| **URGENT / EMERGENCY** | Luxación, NV compromise, infección, fractura abierta |

---

## 15. MODULE MAP

| Módulo | Activa cuando |
|--------|---------------|
| `elbow-epicondylalgia.md` | Dolor epicóndilo lateral/medial |
| `elbow-radial-tunnel.md` | Dolor antebrazo proximal dorsal / Maudsley muscular |
| `elbow-distal-biceps.md` | Pop anterior + déficit supinación |
| `elbow-distal-triceps.md` | Pop posterior + déficit extensión |
| `elbow-ucl-medial.md` | Lanzador + valgo medial |
| `elbow-plri.md` | Aprensión al empujarse palmas arriba (no pivot-shift paciente) |
| `elbow-wrist-neural.md` | Parestesias, STC, cubital, cervical |
| `elbow-wrist-guyon.md` | Cubital + presión palmar / manillar |
| `elbow-wrist-hand-differentials.md` | Solapes finos LET/PIN/UCL/TFCC/SL |
| `wrist-dequervain.md` | Estiloides radial + pulgar |
| `wrist-trauma-scaphoid.md` | FOOSH, tabaquera |
| `wrist-tfcc-ulnar.md` | Dolor cubital / fóvea |
| `wrist-druj.md` | Piano-key / giro doloroso |
| `wrist-carpal-instability.md` | Click dorsal SL o shear LT |
| Evidence DB | `elbow-wrist-tests.md` + expansión + tiers |

---

## 16. EVIDENCE NOTE

Referencias centralizadas en `elbow-wrist-tests.md`, `elbow-wrist-tests-expansion.md`, `clusters-elbow-wrist.md` y `clusters-elbow-wrist-hand-tiers.md`.

No inventar sensibilidad/especificidad. Historia + cluster > test aislado.

---

## 17. INTEGRATION WITH OTHER REGIONS

- **Cervical module:** Spurling/ULTT cuando cuello + brazo  
- **Shoulder:** dolor referido antebrazo raro; no saltarse localización muñeca  
- **Global cross-region:** postura/trabajo bilateral mano

---

END OF ELBOW / WRIST MASTER INTEGRATION MODULE
