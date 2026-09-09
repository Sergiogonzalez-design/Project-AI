# PHYSIOGUIDE — READAPTACIÓN — MARCO MAESTRO

**Capa:** Fase 3 evidence DB (readaptación / ejercicio terapéutico)  
**Regla:** no prescribir diagnóstico. No inventar Sn/Sp, porcentajes de curación ni tiempos fijos de RTS. Usar «compatible con», «evidencia mixta/limitada», «podría explorarse».

**Relación con catálogo:** los ejercicios referencian `id` del catálogo readaptación (`lib/readaptation-exercise-catalog.ts`).

---

## PROPÓSITO DEL MARCO

**Purpose:** Unificar criterios de progresión, monitorización del dolor, gestión de carga y lenguaje clínico para prescripción de ejercicio en Physioguide (consulta paciente, informe fisioterapia, chat fisio).

**Clinical meaning:** La readaptación no es una lista de ejercicios genéricos: es **carga graduada** adaptada a fase tisular, tolerancia individual y objetivos funcionales. El ejercicio terapéutico tiene evidencia sólida en muchas condiciones musculoesqueléticas (Cochrane themes: ejercicio vs pasivo en lumbalgia, cervicalgia, hombro, rodilla), pero la **dosificación exacta** sigue siendo clínica y contextual.

**AI rule:** Nunca digas «haz estos ejercicios y sanarás». Propón fases, reglas de dolor y progresión condicionada. Si hay red flags, prioriza derivación sobre ejercicio.

**Citation:** Cochrane reviews exercise for musculoskeletal pain (multiple conditions); JOSPT clinical practice guidelines (shoulder, knee, neck, LBP); Gabbett TJ — training-load and injury-risk themes; Rio E et al. — isometric loading in tendinopathy themes.

---

## FASES DE READAPTACIÓN

| Fase | Nombre interno | Objetivo | Carga típica | Criterio de salida (orientativo) |
|------|----------------|----------|--------------|----------------------------------|
| 1 | **protection** | Reducir irritación, mantener capacidad, educación | Isométricos, movilidad suave, AVD modificadas | Dolor en reposo/controlado; AVD básicas toleradas |
| 2 | **loading** | Restaurar capacidad de carga tisular (fuerza, tendón, estabilidad) | Isométricos → isotónicos → excéntricos graduados | Fuerza simétrica ~80% lado sano en tests simples; dolor ≤3/10 en sesión |
| 3 | **functional** | Transferencia a patrones de vida/deporte (bisagra, step-down, carries) | Carga multiplanar, excéntricos funcionales, equilibrio dinámico | Tareas funcionales clave sin empeoramiento 24 h |
| 4 | **return_to_sport (RTS)** | Reintroducir velocidad, impacto, cambios de dirección | Plyometría graduada, sport-specific (solo si indicado) | Criterios funcional + confianza + ausencia de empeoramiento post-esfuerzo |

**Clinical meaning:** Las fases son **flexibles**, no calendario rígido. Un paciente con tendinopatía rotuliana puede permanecer en loading más tiempo que uno con PFPS leve. La progresión depende de respuesta (regla 24 h), no de «semana 3 = funcional».

**Limitations:** No existe un consenso único de nomenclatura entre autores (protection/loading vs acute/subacute). Physioguide usa cuatro fases alineadas al catálogo de ejercicios.

**AI rule:** «Estás en fase de carga/protección según tolerancia, no por días desde la lesión.» No prometas RTS en X semanas.

**Citation:** JOSPT CPGs (progressive loading themes); tendinopathy loading literature (Rio, Cook, Purdam — qualitative); ACL/RTS frameworks (Logerstedt, Padua — criteria-based, not time-based).

---

## REGLAS DE MONITORIZACIÓN DEL DOLOR

### Regla ≤3/10 durante y después

**Purpose:** Mantener estímulo suficiente sin irritación excesiva del tejido.

**Procedure (clínico):** Escala 0–10. Durante ejercicio: dolor aceptable habitualmente **≤3/10** (tendinopatías activas a veces toleran hasta ~4/10 de forma transitoria — evidencia mixta; ser conservador en consulta no presencial).

**Positive (progresión segura):** Dolor durante ejercicio ≤3/10 y **sin empeoramiento relevante en las 24 h siguientes**.

**Clinical meaning:** El dolor leve durante carga puede ser compatible con adaptación en tendinopatía y algunos cuadros crónicos; el criterio decisivo es la **respuesta retardada** (irritabilidad).

**AI rule:** «Si el dolor supera 3/10 durante el ejercicio o empeora al día siguiente, reduce carga o regresa a la fase anterior. No es «no hagas nada» automático: ajusta volumen, rango o tipo.»

**Citation:** Rio E et al. isometric pain-modulation themes; clinical tendinopathy loading consensus (qualitative); JOSPT exercise dosage themes.

### Regla de las 24 horas

**Purpose:** Detectar irritabilidad tisular post-carga.

**Procedure:** Tras sesión o nuevo ejercicio, valorar al día siguiente: dolor en reposo, rigidez matutina, funcionalidad (subir escaleras, agacharse, etc.).

**Positive (stop / regress):** Empeoramiento claro de dolor o función **>24 h** tras introducir carga nueva o aumentar volumen.

**Clinical meaning:** Compatible con modelo de **irritabilidad** (alta vs baja): pacientes muy irritables necesitan más tiempo en protection y incrementos menores (10–20% volumen/semana si tolerado).

**AI rule:** «¿Cómo amaneciste al día siguiente?» es pregunta obligatoria antes de progresar. Empeoramiento persistente → regresión, no «aguanta».

**Citation:** Cook JL, Purdam CR — tendinopathy irritability framework (qualitative); Gabbett — acute:chronic workload themes.

---

## GESTIÓN DE CARGA (LOAD MANAGEMENT)

**Purpose:** Equilibrar estímulo adaptativo vs sobrecarga.

**Clinical meaning:**

- **Volumen:** series × repeticiones × sesiones/semana.
- **Intensidad:** RPE, %1RM, banda, tempo.
- **Densidad:** descanso entre series y entre días de carga del mismo tejido.
- **Carga aguda:crónica (ACWR):** Gabbett popularizó la relación entre carga reciente y carga habitual; **evidencia mixta** en predicción de lesión — útil como concepto de «no subir demasiado rápido», no como fórmula mágica.

**Procedure (Physioguide):**

1. Establecer línea base tolerada (ej. 3×12 sin empeoramiento 24 h).
2. Progresar **una variable** a la vez (carga O volumen O complejidad).
3. Incremento orientativo **10–20%/semana** si respuesta favorable (evidencia limitada para cifra exacta — criterio clínico conservador).
4. Días de carga alternos en tendinopatías irritables.

**AI rule:** No cites ratios ACWR numéricos como regla. Di: «sube la carga poco a poco si no empeoras al día siguiente». En deportistas, coordinar con entrenador.

**Citation:** Gabbett TJ. The training-injury prevention paradox. *Br J Sports Med.* 2016 (themes). Hulin BT et al. — ACWR debate (mixed evidence). Cochrane — exercise progression in chronic MSK pain.

---

## ISOMÉTRICOS TEMPRANOS (TEMA RIO)

**Purpose:** Reducir dolor tendinoso y permitir inicio de carga cuando isotónica plena irrita.

**Clinical meaning:** Isométricos de **alta carga submáxima** (RPE ~6–7/10, holds 30–45 s) pueden tener efecto analgésico transitorio en tendinopatías. **No sustituyen** progresión isotónica/excéntrica a medio plazo.

**Procedure:** 4–5 series × 30–45 s, 2×/día, en ángulo tolerado (Spanish squat rodilla, isometric wrist ext codo, isometric ER hombro).

**Limitations:** Evidencia más sólida en tendón rotuliano/Aquiles/hombro que en todas las tendinopatías. Respuesta individual variable.

**AI rule:** «Los isométricos pueden calmar el dolor tendinoso y son un buen primer paso; luego hay que progresar a excéntricos/funcionales si toleras.»

**Citation:** Rio E et al. Isometric exercise induces analgesia and reduces inhibition in patellar tendinopathy. *Br J Sports Med.* 2015. Rio E, Moseley GL — isometric loading themes. Cochrane — mixed for long-term superiority vs other exercise.

---

## TEMAS COCHRANE — EJERCICIO TERAPÉUTICO

**Purpose:** Anclar afirmaciones en revisiones sistemáticas sin inventar tamaños de efecto.

**Clinical meaning (qualitative themes):**

| Condición | Tema Cochrane (resumen cualitativo) |
|-----------|-------------------------------------|
| Lumbalgia inespecífica | Ejercicio **probablemente** mejor que no hacer nada / pasivo a medio plazo; tipo de ejercicio menos claro (evidencia mixta entre McKenzie, estabilización, aeróbico) |
| Cervicalgia | Ejercicio + educación **compatible con** beneficio; multimodal suele incluir fuerza cervical profunda |
| Hombro doloroso | Ejercicio supervisado **compatible con** mejor función vs solo ultrasonido/pasivo (evidencia heterogénea) |
| Epicondilalgia lateral | Excéntricos y multimodal **compatibles con** mejora; no un solo protocolo ganador |
| Esguince tobillo | Movilización temprana y fortalecimiento **compatibles con** mejor recuperación vs inmovilización prolongada |
| Gonartrosis | Ejercicio de fuerza y aeróbico **recomendados** en guías; Cochrane apoya ejercicio terapéutico |

**AI rule:** Nunca digas «Cochrane demuestra que X cura Y». Di «revisiones sistemáticas apoyan el ejercicio activo frente a enfoques pasivos en muchos cuadros musculoesqueléticos, con variabilidad según condición».

**Citation:** Cochrane Library — exercise for low back pain (van Middelkoop et al. themes); neck pain (Kay et al.); lateral epicondylitis (Coombes et al.); ankle sprain (Doherty et al.); shoulder (Hanratty et al. themes).

---

## GUÍAS JOSPT (CPG) — READAPTACIÓN

**Purpose:** Alinear progresión con práctica clínica basada en guías.

**Clinical meaning:** JOSPT CPGs en hombro, rodilla, cuello y lumbar enfatizan:

- Clasificación clínica antes de ejercicio específico
- Ejercicio activo progresivo vs modalidades pasivas aisladas
- Educación en autocuidado y carga
- Criterios de derivación (red flags, fallo conservador razonable)

**AI rule:** Referencia cualitativa: «las guías JOSPT recomiendan ejercicio progresivo y educación en [condición]». No copies recomendaciones de grado sin contexto individual.

**Citation:** JOSPT CPG — neck pain (Blanpied et al.); knee OA (Logerstedt et al.); patellofemoral pain (Powers et al.); shoulder pain (Hanratty et al.); low back pain (Delitto et al. / subsequent updates — themes).

---

## RED FLAGS — DETENER O NO INICIAR EJERCICIO

**Purpose:** Seguridad antes que progresión.

| Red flag | Acción |
|----------|--------|
| Dolor nocturno progresivo, pérdida de peso inexplicada, fiebre | No ejercicio específico; derivación médica |
| Déficit neurológico motor nuevo (foot drop, debilidad progresiva) | Detener; urgencia según contexto |
| Síntomas de cauda equina | Emergencia; no movilización lumbar agresiva |
| Fractura aguda no filiada, inestabilidad articular aguda | No carga; valoración médica/imagen |
| Dolor torácico, disnea, palpitaciones con esfuerzo | No ejercicio; derivación |
| Luxación reciente, postoperatorio sin criterio médico | Solo según protocolo autorizado |
| Tendinopatía + snap agudo + incapacidad funcional brusca | Sospecha rotura; derivación |
| Esguince grado III / no apoyo | No progresión funcional hasta valoración |

**AI rule:** Ante red flag, **no** sugieras «prueba este ejercicio suave». Indica valoración presencial/urgente según gravedad.

**Citation:** JOSPT red flag themes; NICE / clinical MSK safety guidance; cauda equina consensus.

---

## NIVELES DE EVIDENCIA (READAPTACIÓN)

Ver `evidence-levels-A-D.md`. Resumen aplicado:

| Nivel | Ejemplo readaptación |
|-------|----------------------|
| **A** | Ejercicio vs reposo en lumbalgia crónica (Cochrane); movilización temprana esguince (Cochrane) |
| **B** | Isométricos Rio tendinopatía; Copenhagen aducción prevención (contexto deporte) |
| **C** | Protocolos excéntricos específicos (Tyler Twist) — beneficio clínico compatible, heterogeneidad |
| **D** | Tradición clínica sin RCT fuerte (algunos neural glides agresivos) |

**AI rule:** Etiqueta evidencia mixta/limitada cuando corresponda. No upgrades a certeza.

---

## LENGUAJE IA — READAPTACIÓN

**Permitido:**

- «Compatible con fase de protección/carga según tu respuesta»
- «Este ejercicio podría explorarse si el dolor se mantiene ≤3/10»
- «Evidencia limitada para una secuencia única; progresión individualizada»
- «Si empeora al día siguiente, reduce carga»

**Prohibido:**

- «Tienes epicondilitis, haz Tyler Twist 6 semanas y curarás»
- «El test negativo descarta que el ejercicio te sirva»
- «Estadística inventada» (%, Sn, Sp, tiempo fijo RTS)
- «Diagnóstico confirmado por ejercicio»

---

## CUÁNDO DERIVAR (REFER)

**Purpose:** Criterios de escalado más allá de readaptación domiciliaria.

| Situación | Derivación |
|-----------|------------|
| Red flags (tabla anterior) | Médico / urgencias |
| Fractura, luxación, rotura completa sospechada | Traumatología / RMN según contexto |
| Déficit neurológico progresivo | Neurocirugía / neurología urgente |
| Fallo conservador 6–12 semanas con adherencia | Reevaluación especializada (criterio orientativo, no absoluto) |
| Inestabilidad articular recurrente | Valoración ortopédica |
| Dolor dominante no mecánico | Medicina interna / reumatología |
| Postoperatorio fuera de protocolo conocido | Cirujano tratante |
| Túnel carpiano con atrofia tenar | Cirugía / EMG según guías |

**AI rule:** La derivación es **opción clínica**, no castigo por «no esforzarse». Plantéala cuando seguridad o estancamiento lo justifiquen.

**Citation:** JOSPT CPG referral themes; NICE MSK referral guidance.

---

## PLANTILLA DE DOSIS (GLOBAL)

Para cualquier ejercicio del catálogo:

- **Frecuencia:** 1–2×/día (protection) → 3×/semana por grupo (loading) según tolerancia
- **Series/reps:** 3×10–15 o 3× holds 30–45 s (isométricos)
- **RPE:** 4–7/10 según fase
- **Progresión:** +1 serie O +10% reps O +carga ligera (una variable)
- **Regresión:** menos rango, menos carga, ejercicio alternativo misma fase

**AI rule:** Al citar ejercicio, incluir `id` del catálogo cuando exista para coherencia app.

---

## CRITERIOS RTS (ORIENTATIVOS, NO ABSOLUTOS)

**Purpose:** Marco cualitativo return-to-sport; detalle por región en protocolos específicos.

**Clinical meaning:** RTS moderno enfatiza **criterios** (fuerza, hop tests, confianza, carga tolerada) sobre tiempo desde lesión. Evidencia mixta en baterías específicas.

**Ejemplos cualitativos:**

- Rodilla: simetría de fuerza cuádriceps/isquios; hop test sin dolor; step-down controlado
- Tobillo: hop unilateral; equilibrio monopodal; calf raise unilateral
- Hombro: ER/Fuerza simétrica; arco funcional; sin dolor nocturno

**AI rule:** «Volver al deporte depende de criterios funcionales y médicos, no solo de semanas. Valoración presencial recomendada antes de RTS completo.»

**Citation:** Ardern CL et al. RTS after ACL — criteria themes. JOSPT knee ligament CPG. BJSM consensus statements (qualitative, sport-specific).

---

## INTEGRACIÓN RAG + REGLAS DURAS

| Superficie | Catálogo + reglas | Este documento (RAG) |
|------------|-------------------|----------------------|
| Consulta paciente | Sí | Sí |
| Informe fisioterapia | Sí | Sí |
| Chat fisio | Sí | Sí |

**AI rule final:** Readaptación Physioguide = **marco + catálogo + respuesta individual**. Nunca contradecir red flags ni inventar estadísticas.

**Citation:** Physioguide dual-sync policy; Cochrane MSK exercise corpus; JOSPT CPG collection; Gabbett load; Rio isometrics.
