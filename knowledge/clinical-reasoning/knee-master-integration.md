# PHYSIOGUIDE AI — KNEE MASTER INTEGRATION MODULE

**Status:** ACTIVE (integración final de rodilla — tras Anterior, Medial, Lateral, Instability/ACL)  
**Principles:** Ver `knowledge/PHYSIOGUIDE_MASTER_CLINICAL_DOCUMENT.md`

---

## 1. DEFINITION

**Knee master integration** = un único marco de razonamiento que enruta cada caso de rodilla por **red flags**, **mecanismo** (torsión/pop vs sobreuso) y **localización exacta**, antes de activar la rama clínica correspondiente (inestabilidad/LCA, anterior/PFPS, medial, lateral, posterior/poplíteo).

No es un diagnóstico. Es el **router clínico** que evita mezclar ramas o saltar pasos.

---

## 2. MASTER TREE (OBLIGATORIO)

```
KNEE PAIN
    ↓
RED FLAGS (urgencia primero)
    ↓
MECHANISM GATE
    ¿Torsión / pop / no continuar / ceder al girar?
        SÍ → rama Instability / ACL (prioridad)
        TAMBIÉN: golpe tibia anterior flexionada → LCP
    ↓ (si no dominante, o además de)
EXACT LOCATION (lo que marcó el paciente)
    ↓
┌──────────────┬──────────────┬──────────────┬─────────────────┐
│ ANTERIOR /   │ MEDIAL /     │ LATERAL /    │ POSTERIOR /     │
│ RÓTULA /     │ LÍNEA /      │ LÍNEA /      │ POPLÍTEO        │
│ TENDÓN       │ PES ANSERINO │ ITB          │                 │
│              │              │              │                 │
│ → Anterior   │ → Medial     │ → Lateral    │ → Baker /       │
│   PFPS /     │   LCM /      │   LCL /      │   menisco post. │
│   tendón     │   menisco /  │   menisco /  │   / LCP         │
│              │   pes        │   ITB        │                 │
└──────────────┴──────────────┴──────────────┴─────────────────┘
    ↓
HISTORY + LOAD + FAMILIAR PAIN
    ↓
PALPATION (dónde se reproduce)
    ↓
PRIMARY TEST (según rama — solo si seguro)
    ↓
SECONDARY TESTS + FUNCTIONAL LOAD
    ↓
DIFFERENTIAL (+ cadera/lumbar referido)
    ↓
COEXISTING PATHOLOGY (permitir 2 entidades)
    ↓
CONFIDENCE
    ↓
RECOMMENDATION
```

**Regla de oro:** NUNCA `PRUEBA POSITIVA → DIAGNÓSTICO AUTOMÁTICO`.

**Prioridad mecanismo vs localización:** torsión + pop + hinchazón en horas **no** se reclasifica como PFPS solo porque el dolor sea anterior.

---

## 3. RED FLAGS (PASO 0 — SIEMPRE)

Derivar **URGENCIAS / HOSPITAL** si:

- Trauma mayor + **no puede apoyar**
- Deformidad / luxación no reducida
- Bloqueo irreductible (no estira)
- Fiebre + hinchazón (artritis séptica)
- Déficit neurovascular / pie frío
- Inestabilidad multiplanar (rodilla luxable)
- No levanta la pierna estirada (rotura mecanismo extensor)
- Dolor pantorrilla + hinchazón (vascular)

**No pedir tests agresivos** (pivot, salto, Thessaly) si no puede apoyar, hay deformidad o hinchazón aguda intensa.

---

## 4. FAMILIAR PAIN (TRANSVERSAL)

Pregunta clave en todas las ramas:

> «¿Es el mismo dolor que notas al bajar escaleras, agacharte, correr, saltar o girar?»

| Respuesta | Interpretación |
|-----------|----------------|
| Sí — reproduce dolor habitual | Hallazgo clínicamente relevante ↑ |
| No — molestia nueva/inespecífica | Peso diagnóstico ↓; buscar otro cluster |
| No estoy seguro | Integrar con palpación y carga |

---

## 5. MECHANISM GATE (ANTES DE LOCALIZACIÓN SI APLICA)

| Mecanismo | Rama |
|-----------|------|
| Torsión / corte ± no-contacto + pop + no continuar + hinchazón horas | Instability / ACL → `knee-instability-acl.md` |
| Golpe tibia anterior, rodilla flexionada | LCP (mismo módulo) |
| Contacto valgo | LCM ± LCA ± menisco (medial + ACL) |
| Contacto varo | LCL ± PLC (lateral + ACL) |
| Sobreuso / progresivo / carrera | Enrutar por localización (anterior / ITB / pes) |
| Golpe directo rótula | Anterior (contusión / bursitis / Hoffa) |

---

## 6. LOCATION ROUTING TABLE

| Localización del paciente | Rama Physioguide | Módulo |
|---------------------------|------------------|--------|
| Cara anterior / rótula | PFPS / patelofemoral | `knee-anterior-pain.md` |
| Debajo de la rótula / tendón | Tendinopatía rotuliana | `knee-anterior-pain.md` |
| Por encima de la rótula | Tendón cuádriceps / prepatelar | `knee-anterior-pain.md` |
| Cara interna | LCM / pes anserino / menisco medial | `knee-medial-pain.md` |
| Cara externa | LCL / ITB / menisco lateral | `knee-lateral-pain.md` |
| Línea de la articulación | Menisco ± colateral (lado que predomine) | medial o lateral |
| Hueco detrás de la rodilla | Quiste de Baker / menisco posterior / LCP | este master §10 |
| No estoy seguro / difuso | Mecanismo primero; cribado cadera/lumbar | |

**Regla:** si hay **varias localizaciones**, evaluar cada rama y permitir **patologías coexistentes** (p. ej. LCA + menisco, PFPS + ITB, LCM + pes + OA).

---

## 7. ANTERIOR (RESUMEN ENRUTADO)

Activar si localización = **rótula / tendón / anterior** Y no hay cluster LCA dominante.

Ver: `knee-anterior-pain.md`.

- PFPS: anterior/retropatelar + escaleras/sentadilla/sentado familiar
- Tendón rotuliano: inferior a rótula + salto/carga
- **NUNCA:** dolor anterior = condromalacia confirmada

---

## 8. MEDIAL (RESUMEN ENRUTADO)

Activar si localización = **cara interna / línea medial / pes**.

Ver: `knee-medial-pain.md`.

- LCM: contacto/valgo + palpación LCM
- Menisco medial: línea + torsión + bloqueo
- Pes anserino: anteromedial inferior + carrera sin bloqueo
- **NUNCA:** McMurray aislado = menisco confirmado

---

## 9. LATERAL (RESUMEN ENRUTADO)

Activar si localización = **cara externa / línea lateral / ITB**.

Ver: `knee-lateral-pain.md`.

- LCL: contacto/varo
- Menisco lateral: línea + torsión
- ITB: carrera/escaleras reproducible sin bloqueo
- **NUNCA:** varo doloroso aislado = LCL grado III

---

## 10. POSTERIOR / POPLITEAL

Activar si localización = **hueco poplíteo**.

| Patrón | Orientación |
|--------|-------------|
| Bulto posterior + limitación flexión | Quiste de Baker ↑ (a menudo menisco/OA asociado) |
| Línea posterior + torsión/bloqueo | Cuerno posterior menisco |
| Mecanismo salpicadero + inestabilidad | LCP |
| Irradiación + lumbar | Referido / ciática — no Baker automático |

---

## 11. INSTABILITY / ACL (RESUMEN ENRUTADO)

Activar si **torsión, pop, no continuar, hinchazón en horas o ceder al girar**.

Ver: `knee-instability-acl.md`.

Cluster LCA: mecanismo + pop + no continuar + hemartros + giving-way.

**NUNCA:** pop aislado o Lachman aislado = rotura completa.  
**NUNCA:** «se sale la rótula» = LCA.

---

## 12. PRIMARY TESTS BY BRANCH

| Rama | Test principal (fisioterapeuta) | Paciente (cotidiano) |
|------|----------------------------------|----------------------|
| Anterior PFPS | Escaleras / sentadilla | ¿Duele más al bajar escaleras o agacharte? |
| Tendón rotuliano | Carga salto / palpación tendón | ¿Duele al saltar o si presionas bajo la rótula? |
| Medial LCM | Estrés en valgo | ¿Duele si empujan la rodilla hacia dentro? |
| Menisco | Thessaly / McMurray (si seguro) | ¿Duele al girar con peso? ¿Se bloquea? |
| Lateral LCL | Estrés en varo | ¿Duele si empujan hacia fuera? |
| ITB | Noble / carrera-escaleras | ¿Siempre a la misma distancia o al bajar cuestas? |
| LCA | Lachman / pivot (si seguro) | Cluster historia primero; no tests agresivos en agudo |
| LCP | Cajón posterior (si seguro) | ¿Golpe en espinilla con rodilla doblada? |

---

## 13. DIFFERENTIAL — CROSS-BRANCH

| Hallazgo | Considerar |
|----------|------------|
| Anterior + torsión + pop | LCA, no PFPS primero |
| Medial + valgo + pop | Tríada (LCA + LCM + menisco) |
| Lateral + carrera sin trauma | ITB vs menisco vs GTPS referido |
| Posterior + flexión limitada | Baker vs menisco vs LCP |
| Dolor rodilla + cadera/ingle | Cadera referida (cribado) |
| Dolor rodilla + lumbar/parestesias | Lumbar L4–L5 |
| Cede sin pop/hinchazón | Giving-way funcional / rotuliana / PFPS |

---

## 14. COEXISTING PATHOLOGY (OBLIGATORIO PERMITIR)

La IA debe poder emitir:

- Una entidad dominante
- Dos entidades coexistentes
- Resultado incierto
- Necesidad de evaluación adicional

Ejemplos válidos: LCA + menisco; PFPS + ITB; LCM + pes anserino; Baker + OA/menisco; PFPS + fat pad.

**No forzar una única causa** cuando el cuadro es mixto.

---

## 15. HIP / LUMBAR SCREEN

Cribar origen proximal cuando:

- Tests locales no reproducen dolor familiar
- Dolor de rodilla **sin** carga típica de la zona marcada
- Ingle/cadera asociada, o solo rodilla anterior atípica
- Parestesias, irradiación, síntomas lumbares
- Adolescente con rodilla y cojera → no olvidar cadera (SCFE / Perthes contexto)

---

## 16. IMAGING PRINCIPLES

| Situación | Orientación |
|-----------|-------------|
| Trauma + no apoyo / deformidad | RX urgente |
| Cluster LCA/menisco persistente | RMN |
| Tendón / pes / ITB / Baker | Eco o RMN según contexto |
| OA / alineación | RX |

Hallazgo en imagen ≠ causa automática del dolor. Condromalacia RMN ≠ PFPS. «Rotura parcial LCA» ≠ gravedad clínica automática.

---

## 17. RECOMMENDATION ENGINE

| Clase | Cuándo |
|-------|--------|
| LOW RISK | PFPS/ITB/pes leve, sin red flags |
| PHYSIOTHERAPY | Limita deporte, cluster MSK, plan de carga |
| MEDICAL | Duda estructural, bloqueo, no responde, imagen |
| URGENT | No apoyo, extensor, infección, luxación, multiplanar |

---

## 18. AI LANGUAGE RULES

- Usar: «compatible con», «aumenta la sospecha de», «requiere correlación clínica»
- Evitar: diagnóstico definitivo por un test
- No inventar sensibilidad/especificidad
- Respetar localizaciones EXACTAS del paciente
- Categoría «rodilla» del sistema ≠ que el paciente haya dicho esa palabra
- Al paciente: sin jerga (Lachman, McMurray, PFPS) — traducir a gestos cotidianos

---

## 19. QUESTIONNAIRE INTEGRATION

El cuestionario adaptativo de rodilla enruta secciones por localización y mecanismo:

- `anterior_pfp` — rótula / tendón
- `medial` — cara interna / línea / pes
- `lateral` — cara externa / ITB
- `instability_acl` — torsión, pop, continuar, hinchazón, ceder
- `trauma` / `twist` — detalle de mecanismo
- `patellar_instability` — rótula se desplaza
- posterior/poplíteo — hueco detrás de la rodilla

Campo transversal: **dolor familiar**.

---

## 20. PHYSIO REASONING TREE INTEGRATION

Árbol clínico (`KNEE_TREE`): `knee_master_entry` → mechanism gate → localización → clusters (anterior / medial / lateral / inestabilidad / posterior) → tests (Lachman, McMurray, Thessaly, pivot).

`entryByTestId` mantiene acceso directo por test cuando el informe lista maniobras.

---

## 21. RAG / CONOCIMIENTOS

Este módulo se ingiere como:

`Physioguide — Rodilla — integración maestro`

Complementa (no sustituye) chunks anterior, medial, lateral e inestabilidad/LCA.

---

## 22. MODULE INDEX

| Módulo | Archivo |
|--------|---------|
| Anterior / PFPS / tendón | `knee-anterior-pain.md` |
| Medial / LCM / menisco / pes | `knee-medial-pain.md` |
| Lateral / LCL / menisco / ITB | `knee-lateral-pain.md` |
| Inestabilidad / LCA / LCP | `knee-instability-acl.md` |
| Master tree | Este documento §2 |

---

END OF KNEE MASTER INTEGRATION MODULE
