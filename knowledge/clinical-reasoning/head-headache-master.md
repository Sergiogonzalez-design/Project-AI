# PHYSIOGUIDE AI — HEAD / HEADACHE MASTER MODULE

**Status:** ACTIVE (Fase 1bis — cabeza / cefalea)  
**Principles:** Ver `knowledge/PHYSIOGUIDE_MASTER_CLINICAL_DOCUMENT.md`  
**Evidence:** `knowledge/evidence/head-tests.md`, `clusters-head.md`  
**Related:** `cervical-neck-pain.md` (cuello separado; coexistencia frecuente)

---

## 1. DEFINITION

**Headache / head pain** = dolor referido a la **cabeza** (frontal, temporal, occipital, hemicraneal, global) que puede ser **primario** (migraña, tensional, otros) o **secundario/cervicogénico** (origen cervical, postraumático, médico).

No es un diagnóstico único. Es una **presentación** que exige **SNOOP/red flags primero**, patrón temporal, localización, síntomas asociados y **coexistencia cuello + cabeza**.

**Regla maestra:** Spurling y movilidad cervical **apoyan** cefalea cervicogénica; **no confirman** diagnóstico cervical ni descartan migraña/tensional.

---

## 2. SNOOP / RED FLAGS (SIEMPRE PRIMERO)

Cribado antes de tests provocativos:

| Letra | Criterio (orientativo) |
|-------|------------------------|
| **S** | Sistémico: fiebre, pérdida peso, inmunosupresión, cáncer previo |
| **N** | Neurológico: déficit focal, confusión, crisis, visión doble persistente |
| **O** | Onset: peor cefalea de la vida, inicio thunderclap, nuevo >50 años |
| **O** | Other: trauma reciente, embarazo/puerperio, VIH, anticoagulantes |
| **P** | Pattern change: cefalea progresiva, peor al tumbarse/toser, vómitos matutinos |

**Trauma reciente + cefalea** → rama postraumática / médica; no Spurling como primera maniobra.

**Regla:** cualquier RF positiva → **valoración médica/urgente** según gravedad; no continuar razonamiento MSK tranquilizador.

---

## 3. TYPICAL LOCATION

Preguntar:

> «¿Dónde te duele la cabeza? Señala la zona principal.»

| Ubicación | Interpretación orientativa |
|-----------|-------------------------|
| Occipital / nuca → sien/temporal | Cervicogénica ↑ (no confirmada) |
| Unilateral pulsátil + náuseas/fotofobia | Migraña ↑ |
| Bitemporal / frente, «presión» | Tensional ↑ |
| Detrás de un ojo | Cluster/migraña vs sinus vs cervical alta |
| Toda la cabeza difusa | Tensional, sistémico, valorar RF |
| Post-golpe local | Postraumática / contusión |

**Regla:** localización sola no clasifica; integrar patrón temporal y provocación cervical.

---

## 4. HISTORY (obligatoria)

- Evolución: agudo vs crónico vs episódico  
- Inicio: thunderclap vs gradual  
- Mecanismo: golpe, estrés, pantallas, cuello/postura  
- **Dolor familiar:** «¿Es el mismo dolor que notas ahora?»  
- Intensidad, duración episodio, frecuencia  
- Náuseas, vómitos, fotofobia, fonofobia, aura  
- Rigidez/dolor de cuello concurrente  
- **¿Mover el cuello empeora la cefalea?** (cervicogénica)  
- Antecedentes migraña/cefalea previa  
- Medicación analgésica / sobreuso  
- Síntomas visuales, mareo, debilidad

---

## 5. PRIMARY HEADACHE — MIGRAINE PATTERN

**Patrón compatible (clínico, no diagnóstico definitivo):**

```
CEFALEA UNILATERAL O HEMICRANEAL
+ PULSÁTIL / MODERADA–SEVERA
± NÁUSEAS / VÓMITOS
± FOTOFOBIA / FONOFOBIA
± AURA (visual, sensitiva)
± ANTECEDENTE SIMILAR
→ MIGRAÑA COMPATIBILITY ↑
```

**Limitación:** muchas cefaleas cumplen criterios parciales; no etiquetar sin integrar RF y cervical.

**Regla:** migraña puede coexistir con dolor cervical mecánico.

---

## 6. PRIMARY HEADACHE — TENSION-TYPE PATTERN

**Patrón compatible:**

```
CEFALEA BILATERAL «PRESIÓN» / OPRESIVA
+ ESTRÉS / PANTALLAS / TENSIÓN PERICRANEAL
± DOLOR LEVE–MODERADO
± SIN NÁUSEAS MARCADAS NI FOTOFOBIA INTENSA
→ TENSIONAL COMPATIBILITY ↑
```

**Diferencial:** cervicogénica occipital, sobreuso analgésicos, RF sistémicos.

---

## 7. CERVICOGENIC HEADACHE

**Definición clínica (orientativa):** cefalea unilateral, a menudo **occipital → temporal/frontal**, asociada a **dolor o rigidez cervical** y **empeoramiento con movimientos cervicales** o posturas sostenidas.

**Patrón compatible:**

```
CEFALEA UNILATERAL (OCCIPITAL → SIEN)
+ DOLOR/RIGIDEZ DE CUELLO CONCURRENTE
+ EMPEORA AL GIRAR/INCLINAR EL CUELLO
± SPURLING REPRODUCE CEFALEA FAMILIAR
± MOVILIDAD CERVICAL REDUCIDA MECÁNICA
→ CERVICOGÉNICA COMPATIBILITY ↑
```

**Reglas críticas:**

- Spurling **positivo** → apoya reproducción; **no confirma** cervicogénica  
- Spurling **negativo** → **no excluye** cervicogénica  
- Movilidad cervical limitada **apoya**; no confirma  
- Criterios IHS estrictos requieren bloqueo diagnóstico — fuera de alcance IA consulta

---

## 8. COEXISTENCIA CUELLO + CABEZA

Muy frecuente en consulta. **No forzar una sola etiqueta.**

```
CEFALEA + CUELLO
↓
¿RED FLAGS? → MÉDICO
↓ NO
¿PROVOCACIÓN CERVICAL FAMILIAR? → CERVICOGÉNICA ↑ (dominante o componente)
↓ PARCIAL / NO
¿PATRÓN MIGRAÑOSO (náuseas, fotofobia, pulsátil)? → PRIMARIA ↑
↓
POSIBLE: CERVICOGÉNICA + TENSIONAL
POSIBLE: MIGRAÑA + CERVICAL MECÁNICO COEXISTENTE
```

**Regla IA:** declarar **entidad dominante** + **coexistente** + **incierta**.

En flujos multi-zona (cabeza + cuello), evaluar cada región; conectar al final (ver `consulta-head-adaptive.ts`).

---

## 9. POST-TRAUMATIC / SECONDARY SCREEN

Si trauma reciente:

- Cefalea nueva o empeorada post golpe  
- Vómitos, somnolencia, confusión → urgente  
- Cefalea leve persistente sin RF neurológicos → seguimiento médico; no solo MSK

**No aplicar** cluster cervicogénico como vía tranquilizadora tras trauma significativo.

---

## 10. EXAMINATION (cuando procede, sin RF)

| Elemento | Propósito |
|----------|-----------|
| Movilidad cervical activa | Mecánico vs restricción familiar |
| Palpación suboccipital/ATM | Tensión, reproducción |
| Spurling | ¿Reproduce cefalea **familiar**? |
| ULTT | Solo si brazo/hormigueo — ver módulo cuello |

**Familiar pain:** la maniobra debe reproducir el **mismo** dolor de consulta.

---

## 11. TEST CLUSTERS

Ver `knowledge/evidence/clusters-head.md`. Resumen:

| Cluster | Componentes |
|---------|-------------|
| **Cervicogénica** | Unilateral occipital→sien + cuello + provocación cervical ± Spurling familiar |
| **Primaria (migraña)** | Pulsátil, náuseas, fotofobia, historia |
| **Primaria (tensional)** | Bilateral presión, estrés, sin RF |
| **Postraumática / RF** | Trauma, SNOOP+, derivación |

---

## 12. DECISION TREE

```
CEFALEA / DOLOR DE CABEZA
↓
SNOOP + RED FLAGS → SÍ → MÉDICO / URGENCIAS
↓ NO
LOCALIZACIÓN + PATRÓN TEMPORAL + SÍNTOMAS ASOCIADOS
↓
¿CUELLO CONCURRENTE O EMPEORA CON CUELLO?
↓ SÍ → PROVOCACIÓN CERVICAL (movilidad, Spurling) — apoyan, no confirman
↓
¿PATRÓN MIGRAÑOSO/TENSIONAL CLÁSICO SIN RF?
↓
COEXISTENCIA? → DOMINANTE + COEXISTENTE
↓
HIPÓTESIS + CONFIANZA + SIGUIENTE PASO
```

---

## 13. RED FLAGS (resumen operativo)

- Peor cefalea de la vida / thunderclap  
- Déficit neurológico focal, convulsión, alteración conciencia  
- Fiebre + rigidez nucal  
- Trauma significativo reciente  
- Cefalea progresiva + vómitos matutinos / peor decúbito  
- Embarazo/puerperio con cefalea severa  
- Inmunosupresión / cáncer / anticoagulación + cefalea nueva  
- Edad >50 con cefalea nueva sin antecedente

---

## 14. IMAGING / REFERRAL

| Situación | Acción |
|-----------|--------|
| RF neurológico / SNOOP+ | Médico / neuroimagen según criterio |
| Trauma + síntomas | Protocolo conmoción / médico |
| Cervicogénica persistente sin RF | Fisioterapia cervical; imagen si duda estructural |
| Cefalea primaria recurrente limitante | Valoración médica (profilaxis) |

**Regla:** IA no indica RM «por Spurling positivo» aislado.

---

## 15. AI LANGUAGE RULES

**Usar:**

- «Los hallazgos son compatibles con cefalea cervicogénica…»  
- «Spurling que reproduce el dolor habitual apoya origen cervical; no confirma el diagnóstico.»  
- «El patrón sugiere migraña/tensional; descartar red flags.»  
- «Puede coexistir dolor cervical mecánico y cefalea primaria.»

**Evitar:**

- «Spurling positivo = cefalea cervicogénica confirmada.»  
- «Es migraña» sin cribar SNOOP.  
- «Solo estrés» con RF o trauma.  
- Ignorar cuello cuando el paciente reporta ambos.

---

## 16. FINAL CLASSIFICATION

| Clasificación | Criterio |
|---------------|----------|
| **URGENT / EMERGENCY** | SNOOP+, neuro, fiebre/rigidez, trauma grave |
| **MEDICAL ASSESSMENT** | Cefalea nueva atípica, progresiva, embarazo, duda secundaria |
| **PHYSIOTHERAPY ASSESSMENT** | Cervicogénica probable, cuello mecánico, sin RF |
| **LOW RISK / SELF-CARE** | Tensional leve episódica, sin RF, reevaluación |

---

## 17. DIFFERENTIAL SUMMARY

| Entidad | Claves |
|---------|--------|
| Cervicogénica | Occipital→sien, cuello, provocación cervical |
| Migraña | Unilateral pulsátil, náuseas, fotofobia, historia |
| Tensional | Bilateral presión, estrés, pantallas |
| Postraumática | Golpe reciente, seguimiento médico |
| Secundaria grave | SNOOP+, derivación |

---

## 18. INTEGRATION

- **`cervical-neck-pain.md`:** radiculopatía, Wainner — si brazo/hormigueo  
- **`cervical-trauma-redflags.md`:** trauma cuello — no confundir con cabeza sola  
- **Árbol:** `hd_master_entry` → Spurling apoya cervicogénica vs primaria (`trees.ts`)  
- **Cuestionario:** `consulta-head-adaptive.ts` — sección `neck_link` para coexistencia

---

## 19. EVIDENCE NOTE

No inventar Sn/Sp para Spurling en cefalea.

Priorizar: IHS criteria (referencia), JOSPT Neck Pain CPG, revisiones cefalea cervicogénica (Blauenstein et al.), SNOOP4 framework (Do et al.).

Evidencia mixta en provocación cervical → indicarlo.

---

END OF HEAD / HEADACHE MASTER MODULE
