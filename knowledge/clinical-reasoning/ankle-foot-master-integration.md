# PHYSIOGUIDE AI — ANKLE / FOOT MASTER INTEGRATION MODULE

**Status:** ACTIVE (integración final tobillo/pie — tras Ottawa, lateral, Aquiles, plantar)  
**Evidence DB:** `ankle-foot-tests.md`, `clusters-ankle-foot.md` (NO recrear)  
**Questionnaire:** `lib/consulta-lower-leg-adaptive.ts` (ankle_foot)  
**Principles:** Ver `knowledge/PHYSIOGUIDE_MASTER_CLINICAL_DOCUMENT.md`

---

## 1. DEFINITION

**Ankle / foot master integration** = router clínico que enruta cada caso por **red flags**, **Ottawa (¿RX?)**, **mecanismo** y **localización exacta**, antes de activar rama (lateral/sindesmosis, Aquiles, plantar/talón, medial, referido S1).

No es un diagnóstico. Evita mezclar ramas, graduar esguinces por un test agudo o confirmar fascitis por Windlass aislado.

**Regla de oro:** NUNCA `PRUEBA POSITIVA → DIAGNÓSTICO AUTOMÁTICO`.

---

## 2. MASTER TREE (OBLIGATORIO)

```
ANKLE / FOOT PAIN
    ↓ RED FLAGS
    ↓ OTTAWA (¿RX?)
    ↓ MECHANISM GATE
        Inversión → lateral ± Ottawa
        Pop / no puntillas → Aquiles
        RE / dolor alto tibiofibular → sindesmosis
        Primeros pasos mañana → fascia
    ↓ EXACT LOCATION
    ↓ HISTORY + LOAD + FAMILIAR PAIN
    ↓ PALPATION + TEST (solo si seguro)
    ↓ CLUSTER (Evidence DB)
    ↓ DIFFERENTIAL (+ S1 si procede)
    ↓ COEXISTENCE → CONFIDENCE → RECOMMENDATION
```

**Prioridad mecanismo:** pop + no puntillas **no** se reclasifica como esguince lateral solo porque duele por fuera.

---

## 3. RED FLAGS (PASO 0)

Derivar **URGENCIAS / MÉDICO URGENTE** si:

- Deformidad / luxación  
- **No puede apoyar** + sospecha ósea no evaluada  
- Déficit neurovascular  
- Hinchazón pantorrilla unilateral (TVP)  
- Compartimental / dolor desproporcionado  
- Fiebre + calor articular  
- Pop Aquiles + **no heel-raise** → no «tirón de gemelo» automático

**No hop/cajón agresivo** si Ottawa + no evaluado o no apoyo absoluto.

---

## 4. OTTAWA (SIEMPRE EN TRAUMA AGUDO)

**Tobillo — RX** si dolor maléolar + (no **4 pasos** **o** dolor óseo borde posterior/punta maléolo).

**Pie — RX** si dolor mediopié + (4 pasos imposibles **o** dolor **navicular** / **base 5.º MT**).

```
OTTAWA + → RX / VÍA MÉDICA
OTTAWA − → FRACTURA MUY POCO PROBABLE; ESGUINCE/PARTES BLANDAS POSIBLES
```

Ottawa responde «¿RX?» — no diagnostica grado. Ver `ankle-trauma-ottawa.md`.

---

## 5. FAMILIAR PAIN (TRANSVERSAL)

> «¿Es el mismo dolor al caminar, torcer el pie, ponerse de puntillas o al dar los primeros pasos por la mañana?»

| Respuesta | Interpretación |
|-----------|----------------|
| Sí | Hallazgo relevante ↑ |
| No | Peso ↓; buscar otro cluster |
| No estoy seguro | Integrar con palpación y carga |

---

## 6. MECHANISM GATE

| Mecanismo | Rama | Módulo |
|-----------|------|--------|
| Inversión | Esguince lateral ATFL±CFL | `ankle-lateral-sprain.md` |
| RE / dorsiflexión forzada | Sindesmosis | `ankle-lateral-sprain.md` §7 |
| Pop posterior | Rotura Aquiles | `ankle-achilles.md` |
| Carga progresiva carrera | Tendinopatía Aquiles / fascia | Aquiles / plantar |
| Primeros pasos matutinos | Fasciopatía | `foot-plantar-heel.md` |
| No 4 pasos / dolor óseo | Ottawa → RX | `ankle-trauma-ottawa.md` |
| Lumbar + planta/hormigueo | Referido S1 | `foot-plantar-heel.md` §6 |

---

## 7. LOCATION ROUTING

| Localización | Rama | Módulo |
|--------------|------|--------|
| Tobillo por fuera | ATFL ± CFL | `ankle-lateral-sprain.md` |
| Anterior alto tibiofibular | Sindesmosis | `ankle-lateral-sprain.md` |
| Posterior / Aquiles | Aquiles | `ankle-achilles.md` |
| Planta / arco / talón medial | Fasciopatía | `foot-plantar-heel.md` |
| Tobillo por dentro | Medial / PTT | master §9 |
| Planta + lumbar/hormigueo | Referido S1 | plantar + master §10 |
| Base 5.º MT / navicular | Ottawa pie | `ankle-trauma-ottawa.md` |

**Regla:** el dedo exacto enruta; no asumir lateral si apunta al talón plantar.

---

## 8. PRIMARY CLUSTERS (Evidence DB — NO RECREAR)

Referencia: `knowledge/evidence/clusters-ankle-foot.md`

| Cluster | Componentes | AI output |
|---------|-------------|-----------|
| Ottawa | 4 pasos + dolor óseo | RX si + |
| Esguince lateral | Inversión + lateral + ATFL ± cajón | Compatible; no grado |
| Sindesmosis | RE + dolor alto + squeeze ± | No ATFL simple |
| Rotura Aquiles | Pop + no puntillas + Thompson | Médico urgente |
| Tendinopatía Aquiles | Dolor tendón + carga + Thompson − | Compatible |
| Fasciopatía | Mañana + inserción medial ± Windlass | Compatible |
| Referido lumbar | Planta + lumbar + SLR + tests locales pobres | S1 ↑ |

**NUNCA:** cajón = grado III. **NUNCA:** Windlass+ = fascitis confirmada.

---

## 9. MEDIAL ANKLE (RESUMEN)

Dolor medial: **esguince deltoideo** (eversión), **PTT** (pie plano, debilidad inversión), **fractura medial** (Ottawa), **túnel tarsiano** (ardor + parestesias).

**Regla:** no forzar ATFL si medial domina. Lateral + medial → multiplanar / sindesmosis.

---

## 10. LUMBAR / S1 REFERRAL

Activar si: planta/pantorrilla + lumbar/ciática; hormigueo; SLR familiar; Windlass/Aquiles poco provocativos.

**Regla:** no forzar fascitis si cuadro neural domina.

---

## 11. COEXISTENCE / FUNCTIONAL / IMAGING

**Coexistencia (≥2):** lateral + óseo; sindesmosis + ATFL; fascia + S1; CAI + peroneal. Dominante + coexistente + incierta.

**Carga funcional:** familiar pain al caminar, hop (Ottawa −), mañana, puntillas, inversión. Cojera = dato, no diagnóstico.

**Imagen:** Ottawa + → RX; persistencia → US/RM; sindesmosis/CAI → RM según protocolo. Imagen ≠ causa sin correlación.

---

## 12. AI LANGUAGE RULES

**Usar:** «Compatible con…»; «Aumenta la sospecha de…»; «Ottawa − reduce fractura; esguince posible»; «Integrar con palpación y mecanismo.»

**Evitar:** grado III por cajón; Windlass confirma fascitis; Ottawa − = nada importante. Ortografía: **Sindesmosis**.

---

## 13. FINAL CLASSIFICATION

| Clasificación | Criterio |
|---------------|----------|
| **LOW RISK / INFO** | Ottawa −, leve, autocuidado |
| **PHYSIOTHERAPY** | MSK persistente, rehab carga/propiocepción |
| **MEDICAL** | Ottawa +, sindesmosis, Aquiles, imagen |
| **URGENT** | Fractura/luxación, neurovascular, Aquiles completa, TVP |

---

## 14. MODULE MAP

| Módulo | Cuándo |
|--------|--------|
| `ankle-trauma-ottawa.md` | Trauma agudo |
| `ankle-lateral-sprain.md` | Inversión, lateral, sindesmosis, CAI |
| `ankle-achilles.md` | Posterior, pop, tendinopatía |
| `foot-plantar-heel.md` | Planta, talón, S1 |
| **Este master** | Router + coexistencia + lenguaje |

---

## 15. DECISION SUMMARY

```
PIE/TOBILLO → ¿Urgencia? → ¿Trauma? → Ottawa
→ ¿Mecanismo dominante? → ¿Dedo exacto?
→ Historia + carga + palpación → Cluster (compatible)
→ ¿Otra rama? → Coexistencia → Recomendación
```

---

## 16. EVIDENCE + INTEGRATION

No inventar Sn/Sp, LR+, grados por test, ni scores no publicados. Fuentes: Stiell/Bachmann, JOSPT CPGs, van Dijk, Maffulli, De Garceau.

**Spine/global:** pie difuso + SLR → no cerrar en fascia; `global-cross-region-integration.md` si multi-región; questionnaire alimenta gate + location.

---

END OF ANKLE / FOOT MASTER INTEGRATION MODULE
