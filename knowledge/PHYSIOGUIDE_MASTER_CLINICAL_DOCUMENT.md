# PHYSIOGUIDE AI — MASTER CLINICAL DOCUMENT

## 1. PROPÓSITO

Documento maestro para continuar el desarrollo clínico de Physioguide AI en Cursor.

La IA debe funcionar como sistema de apoyo al razonamiento clínico musculoesquelético, no como un sistema que diagnostica a partir de una única prueba.

Flujo obligatorio:

LOCALIZACIÓN → HISTORIA → MECANISMO → COMPORTAMIENTO DEL DOLOR → SÍNTOMAS → RED FLAGS → EXPLORACIÓN → PRUEBA PRINCIPAL → PRUEBAS COMPLEMENTARIAS → DIFERENCIAL → COMPATIBILIDAD → RECOMENDACIÓN.

Nunca:

PRUEBA POSITIVA → DIAGNÓSTICO AUTOMÁTICO.

---

# 2. PRINCIPIOS CLÍNICOS FUNDAMENTALES

## 2.1 Localización primero

Preguntar:

“Señala con un dedo dónde te duele.”

Clasificar:

- anterior
- medial
- lateral
- posterior
- central/púbico
- profundo
- inguinal
- irradiado

La localización debe determinar el árbol de razonamiento.

## 2.2 Familiar pain

Siempre que sea posible preguntar:

“¿Este es el mismo dolor que notas durante tu actividad?”

Distinguir:

- dolor provocado inespecífico
- dolor familiar/reconocible

Una prueba que reproduce el dolor habitual tiene más relevancia clínica que una molestia nueva o inespecífica.

## 2.3 No usar una prueba aislada

La IA debe integrar:

- historia
- localización
- mecanismo
- carga
- palpación
- ROM
- pruebas funcionales
- pruebas provocativas
- síntomas mecánicos
- red flags
- imagen cuando corresponda

## 2.4 Patologías coexistentes

La IA debe permitir:

- una entidad dominante
- dos entidades coexistentes
- resultado incierto
- necesidad de evaluación adicional

Ejemplos:

- hip + adductor
- hip + iliopsoas
- hip + pubic
- pubic + adductor
- hip + lumbar

No forzar una única fuente de dolor.

---

# 3. ESTADO ACTUAL DE CADERA

## COMPLETADO

### Groin pain — marco Doha

1. Adductor-related groin pain
2. Iliopsoas-related groin pain
3. Inguinal-related groin pain
4. Pubic-related groin pain

### Hip-related groin pain

Ya se ha desarrollado el razonamiento para:

- Femoroacetabular impingement / FAIS
- CAM morphology
- Pincer morphology
- Labral/intra-articular differential
- Hip osteoarthritis
- Hip dysplasia
- Microinstability
- Internal snapping hip
- Hip joint pathology
- Bone stress injury screening
- Lumbar/neural differential
- Inguinal/pubic/adductor/iliopsoas differential
- Hip ROM
- FADIR
- FABER
- Log roll
- Stinchfield/resisted SLR
- Functional loading
- Red flags
- Imaging principles
- Decision trees
- Mixed pathology

### Lateral hip pain

Implementado en `knowledge/clinical-reasoning/hip-lateral-pain.md` + reglas AI + cuestionario + árbol.

- Greater trochanteric pain syndrome (GTPS)
- Gluteus medius/minimus tendinopathy
- Peritrochanteric/bursal pain
- External snapping hip
- IT band-related lateral hip pain
- Lumbar referred / L5 / SI / hip joint differential

### Posterior hip pain

Implementado en `knowledge/clinical-reasoning/hip-posterior-pain.md` + reglas AI + cuestionario + árbol.

- Proximal hamstring tendinopathy / strain
- Deep gluteal syndrome
- Piriformis-related pain
- Ischiofemoral impingement
- Quadratus femoris pathology
- Posterior hip joint / SI / lumbar radiculopathy

### Traumatic hip/pelvis

Implementado en `knowledge/clinical-reasoning/hip-traumatic.md` + reglas AI + cuestionario + árbol.

- Hip flexor / rectus femoris / adductor / proximal hamstring (agudo)
- Avulsion injuries
- Pelvic / hip fracture
- Hip dislocation
- Traumatic labral / intra-articular
- Bone stress cribado
- Emergency criteria (apoyo, pop, hematoma, continuar deporte)

### Groin pain — marco Doha + hip-related groin

Implementado en `knowledge/clinical-reasoning/hip-groin-doha.md` + reglas AI + cuestionario (sección groin Doha) + árbol.

- Adductor / iliopsoas / inguinal / pubic-related (Doha)
- Hip-related groin (FAI, labrum, OA, displasia, snapping interno)
- FADIR / FABER / ROM / bone stress screen

### Hip master integration

Implementado en `knowledge/clinical-reasoning/hip-master-integration.md` + reglas AI + cuestionario (dolor familiar + groin Doha) + árbol maestro.

- Fusión groin Doha + hip-related + lateral + posterior + traumatic
- Entrada por red flags → localización exacta → rama clínica
- Patologías coexistentes permitidas

## ESTADO / PENDIENTE

### Phase 1 clinical reasoning — COMPLETA
- [x] Hip, Knee, Shoulder, Ankle/Foot, Elbow/Wrist, Cervical/Lumbar, Global

### Phase 3 evidence DB — COMPLETA
No recrear.

### E2E QA + dual-sync audit — COMPLETA (13 ago 2026)
Informe: `knowledge/PHYSIOGUIDE_QA_AUDIT_FINAL_2026-08-13.md` — veredicto **GREEN** (YELLOW: RAG thin en módulos nuevos; finger/head solo árbol, soft-fix).

Ver también `knowledge/PHYSIOGUIDE_PROJECT_STATUS_AND_ROADMAP.md`.

## GLOBAL CROSS-REGION — COMPLETA

`global-cross-region-integration.md` + `AI_GLOBAL_CROSS_REGION_RULES`. Suplementa regiones; mapa hombro←cervical, rodilla←cadera, pie←S1, etc. Coexistencia permitida.

## RAQUIS — COMPLETA (Phase 1)

`spine-master-integration.md` + cervical + lumbar modules. Árboles `nk_master_entry` / `bk_master_entry`. Spurling/SLR/Kemp ya no «confirman» hernia/faceta.

## CODO / MUÑECA — COMPLETA (Phase 1)

Master + LET/medial + neural (STC/cubital/cervical) + De Quervain + escafoides. Árboles `el_master_entry` / `wh_master_entry`. Cuestionarios con localización + dolor familiar primero.

## TOBILLO / PIE — COMPLETA (Phase 1)

### Master + Ottawa

`ankle-foot-master-integration.md`, `ankle-trauma-ottawa.md` + `ANKLE_FOOT_TREE` (`af_master_entry`) + cuestionario lower-leg (localización + dolor familiar + Ottawa óseo).

### Lateral / sindesmosis / Aquiles / plantar

Módulos + reglas AI cableadas a consulta / physio_chat / physio_report.

## HOMBRO — COMPLETA (Phase 1)

### Master integration

Implementado en `knowledge/clinical-reasoning/shoulder-master-integration.md` + reglas AI + `SHOULDER_TREE` (`sh_master_entry`) + cuestionario (localización + dolor familiar antes de mecanismo).

### Lateral / RCRSP

`shoulder-lateral-rcrsp.md` — RCRSP, rotura (debilidad+drop arm), capsulitis diferencial. No «pinzamiento confirmado».

### Anterior / bíceps

`shoulder-anterior-pain.md` — bíceps; Speed/Yergason no = SLAP.

### Superior / AC

`shoulder-superior-ac.md` — dedo en AC + cross-body.

### Instability / trauma

`shoulder-instability-trauma.md` — luxación, aprensión=miedo, FOOSH, manguito traumático.

## RODILLA — COMPLETA

### Anterior / PFPS / tendón rotuliano

Implementado en `knowledge/clinical-reasoning/knee-anterior-pain.md` + reglas AI + cuestionario + árbol maestro entrada.

- PFPS / patelofemoral pain
- Patellar tendinopathy (jumper's knee)
- Hoffa / prepatelar / Osgood-Schlatter differential
- Red flags extensor mechanism

### Medial / LCM / menisco / pes anserino

Implementado en `knowledge/clinical-reasoning/knee-medial-pain.md` + reglas AI + cuestionario + árbol.

- Esguince LCM
- Lesión meniscal medial
- Pes anserinus bursitis/tendinopathy
- Plica / OA medial differential

### Lateral / LCL / menisco / ITB

Implementado en `knowledge/clinical-reasoning/knee-lateral-pain.md` + reglas AI + cuestionario + árbol.

- Esguince LCL
- Lesión meniscal lateral
- Síndrome banda iliotibial (ITBS)
- Bíceps femoral / plica / OA lateral differential

### Inestabilidad / LCA / LCP

Implementado en `knowledge/clinical-reasoning/knee-instability-acl.md` + reglas AI + cuestionario + árbol.

- Cluster LCA (torsión + pop + no continuar + hinchazón + giving-way)
- LCP (mecanismo salpicadero)
- PLC / lesión combinada / tríada
- Giving-way funcional vs rotuliana

### Master integration

Implementado en `knowledge/clinical-reasoning/knee-master-integration.md` + reglas AI + cuestionario (dolor familiar + poplíteo) + árbol maestro.

- Fusión anterior + medial + lateral + inestabilidad/LCA + posterior/poplíteo
- Entrada por red flags → mecanismo (LCA) → localización exacta → rama clínica
- Patologías coexistentes permitidas
- Cribado cadera/lumbar

### Pendiente rodilla

Fase 3 evidence DB de rodilla: **tests + clusters ingestados**. Otras regiones (hombro, raquis, pie, codo/muñeca) también cubiertas en Fase 3. No reiniciar.

---

# 4. GROIN PAIN — DOHA

## 4.1 Adductor-related

Patrón:

MEDIAL GROIN PAIN
+
ADDUCTOR TENDERNESS
+
PAIN WITH RESISTED ADDUCTION
→
ADDUCTOR-RELATED COMPATIBILITY ↑

La resistencia a la aducción por sí sola no confirma el diagnóstico.

La localización del dolor reproducido es esencial.

## 4.2 Iliopsoas-related

Patrón:

ANTERIOR GROIN PAIN
+
ILIOPSOAS-REGION FINDINGS
+
PAIN WITH HIP FLEXION/LOAD
→
ILIOPSOAS-RELATED COMPATIBILITY ↑

Considerar:

- resisted hip flexion
- resisted SLR
- hip flexor stretch
- palpation cuando corresponda
- dynamic assessment si hay snapping

No usar un único test para confirmar.

## 4.3 Inguinal-related

Patrón:

INGUINAL LOCATION
+
INGUINAL CANAL TENDERNESS
+
ABDOMINAL LOAD-RELATED SYMPTOMS
→
INGUINAL-RELATED COMPATIBILITY ↑

Cough/Valsalva/sneeze pueden aportar información, pero no diagnostican por sí solos.

## 4.4 Pubic-related

Criterio central:

LOCALIZED TENDERNESS OF THE PUBIC SYMPHYSIS AND/OR IMMEDIATELY ADJACENT PUBIC BONE.

Patrón:

CENTRAL PUBIC PAIN
+
PUBIC SYMPHYSIS TENDERNESS
+
FAMILIAR PAIN
→
PUBIC-RELATED COMPATIBILITY ↑

No existe una única prueba resistida que defina esta entidad.

Diferenciales:

- adductor
- rectus/abdominal
- inguinal
- hip
- bone stress

Pubic pain ≠ osteitis pubis automáticamente.

---

# 5. HIP-RELATED GROIN PAIN

Definición funcional:

DEEP GROIN PAIN
+
FINDINGS COMPATIBLE WITH HIP INVOLVEMENT.

Posibles entidades:

- FAIS
- labral/intra-articular pathology
- hip OA
- dysplasia
- microinstability
- internal snapping hip
- bone stress injury
- other hip joint pathology

---

# 6. FADIR — REGLA CRÍTICA

NUNCA:

FADIR POSITIVE = FAI.

Interpretación correcta:

FADIR reproduce dolor profundo familiar de ingle
→
aumenta la sospecha de participación de la cadera.

Después integrar:

- localización
- ROM
- flexión/rotación
- mecanismo
- síntomas mecánicos
- contexto deportivo
- otras pruebas
- imagen cuando esté indicada

FADIR es una prueba de provocación, no un diagnóstico aislado.

---

# 7. FABER

Registrar:

- groin pain
- posterior pain
- lateral pain
- familiar pain

FABER positivo ≠ diagnóstico específico.

Interpretar junto con historia, ROM, FADIR y diferencial.

---

# 8. HIP ROM

Evaluar:

- flexion
- extension
- internal rotation
- external rotation
- abduction
- adduction

Registrar:

- rango
- dolor
- lado
- diferencia entre lados
- familiar pain
- calidad de movimiento

Regla:

ACTIVE LIMITED + PASSIVE NORMAL
→ considerar dolor inhibitorio/músculo/tendón/control motor.

ACTIVE LIMITED + PASSIVE LIMITED
→ aumenta diferencial articular/estructural.

Dolor + limitación de IR + deep groin pain
→ aumenta sospecha de participación de cadera.

Pero:

limited IR ≠ OA automáticamente.

---

# 9. SÍNTOMAS MECÁNICOS

Preguntar:

- clicking?
- catching?
- locking?
- giving way?
- sensación de inestabilidad?

Interpretación:

### Clicking

Dolor profundo + clicking
→ aumenta diferencial intraarticular/snapping.

Clicking indoloro
→ puede ser incidental.

### Catching

Deep catching
→ considerar patología intraarticular.

### True locking

→ importante; considerar loose body o patología intraarticular significativa; valoración médica.

### Giving way

Puede deberse a:

- pain inhibition
- instability
- neural
- otras causas

Giving way ≠ labral tear automáticamente.

---

# 10. FAIS

Diferenciar:

### Morphology

CAM / pincer.

### Syndrome

FAIS requiere correlación de síntomas, signos clínicos y morfología relevante.

Nunca:

CAM en imagen = causa del dolor.

Patrón compatible:

- deep groin pain
- flexion/rotation-related pain
- FADIR positivo
- ROM reducido/doloroso
- síntomas con carga deportiva

La imagen caracteriza la morfología y debe correlacionarse clínicamente.

---

# 11. LABRAL / INTRA-ARTICULAR

Considerar:

- deep groin pain
- clicking
- catching
- locking
- rotational pain
- positive hip provocation
- contexto compatible

Pero:

click ≠ labral tear.

Ninguna prueba clínica aislada confirma un desgarro labral.

---

# 12. HIP OA

Considerar:

- progressive groin pain
- stiffness
- ROM loss
- functional limitation
- painful/limited IR
- dificultad para ponerse calcetines/zapatos
- coche
- escaleras
- caminar
- levantarse de una silla

Patrón:

PROGRESSIVE PAIN
+
STIFFNESS
+
ROM LOSS
+
FUNCTIONAL LIMITATION
→
OA DIFFERENTIAL ↑

Edad sola ≠ OA.

---

# 13. DYSPLASIA / MICROINSTABILITY

Considerar:

- groin pain
- apprehension
- giving way
- instability sensation
- high ROM demands
- symptoms with extension/abduction/external rotation
- structural context

Pain alone ≠ instability.

La displasia estructural requiere evaluación e imagen apropiadas.

---

# 14. INTERNAL SNAPPING HIP

Patrón:

ANTERIOR SNAP
+
REPRODUCIBLE FLEXION → EXTENSION
→
CONSIDER INTERNAL SNAPPING / ILIOPSOAS

Doloroso → clínicamente relevante.

Indoloro → puede ser incidental.

---

# 15. BONE STRESS / FRACTURE SCREEN

Considerar con:

- progressive load pain
- impact pain
- running pain
- hopping pain
- reduced load tolerance
- rest pain
- night pain
- bone-dominant tenderness
- inability to bear weight

HOP TEST no diagnostica bone stress injury.

Si reproduce dolor óseo importante:

STOP PROVOCATIVE LOADING
→
CONSIDER MEDICAL ASSESSMENT.

---

# 16. RED FLAGS

Screen obligatorio:

- major trauma
- inability to bear weight
- suspected fracture
- suspected dislocation
- fever
- systemic illness
- unexplained night pain
- significant rest pain
- progressive unexplained symptoms
- neurological deficit
- significant weakness
- concerning abdominal/genitourinary symptoms

Si hay red flag:

NO continuar con un árbol rutinario de lesión deportiva.

Escalar a valoración médica apropiada.

---

# 17. IMAGING

## X-ray

Puede ayudar a valorar:

- fracture
- OA
- CAM/pincer
- dysplasia
- bone morphology
- structural changes

Imaging finding ≠ symptomatic diagnosis.

## MRI

Puede valorar:

- bone marrow
- stress injury
- labrum
- cartilage
- muscle
- tendon
- joint/soft tissues

## MR Arthrography

Puede considerarse cuando la pregunta clínica requiere una evaluación detallada del labrum/intraarticular.

## Ultrasound

Útil para estructuras seleccionadas y estudios dinámicos:

- iliopsoas
- snapping
- algunos músculos/tendones

No sustituye todas las modalidades para patología intraarticular.

---

# 18. MAPA DE DIFERENCIAL DE INGLE

## CENTRAL/PUBIC

- pubic-related
- adductor origin
- rectus/abdominal
- bone stress
- hip referral

## MEDIAL

- adductor-related
- hip
- pubic
- neural/referred menos frecuente

## ANTERIOR

- iliopsoas
- hip
- rectus femoris
- inguinal dependiendo de localización exacta

## INGUINAL

- inguinal-related
- abdominal/hernia differential
- pubic
- hip referral

## DEEP GROIN

- hip joint
- FAIS
- labral/intra-articular
- OA
- dysplasia/instability
- bone stress

---

# 19. REGLAS DE LENGUAJE DE LA IA

Usar:

- “Los hallazgos son compatibles con...”
- “Aumenta la sospecha de...”
- “Existe posible participación de...”
- “Este resultado debe interpretarse junto con...”
- “Se recomienda valoración profesional...”

Evitar:

- “Tienes X lesión.”
- “Esta prueba confirma X.”
- “El MRI demuestra que X es la causa.”
- “FADIR positivo confirma FAI.”

---

# 20. FORMATO OBLIGATORIO PARA CADA NUEVO MÓDULO

Cada nueva patología/región debe seguir:

1. Definition
2. Typical location
3. History
4. Mechanism
5. Onset
6. Load/activity pattern
7. Characteristic symptoms
8. Palpation
9. Primary test
10. Secondary tests
11. Functional tests
12. Test interpretation
13. Differential diagnosis
14. Coexisting pathology
15. Red flags
16. Imaging
17. Clinical reasoning
18. Decision tree
19. AI language rules
20. Final classification

---

# 21. FORMATO OBLIGATORIO PARA CADA TEST

TEST NAME

Purpose:
Qué evalúa/provoca.

Position:
Posición del paciente.

Procedure:
Cómo se realiza.

Positive:
Qué cuenta como positivo.

Pain location:
Dónde aparece el dolor.

Familiar pain:
Si reproduce el dolor habitual.

Clinical meaning:
Qué aumenta en el diferencial.

Limitations:
Qué NO puede diagnosticar.

Differential:
Qué otras patologías pueden producirlo.

AI rule:
Qué debe decir la IA.

No inventar sensibilidad/especificidad.

---

# 22. ROADMAP INMEDIATO

## PRÓXIMO MÓDULO: LATERAL HIP PAIN

No reiniciar cadera.

Continuar directamente desde aquí.

Debe incluir como mínimo:

### GTPS

- Greater trochanteric pain syndrome
- gluteus medius tendinopathy
- gluteus minimus tendinopathy
- peritrochanteric/bursal pain
- abductor-related pain

### External snapping hip

- IT band
- gluteus maximus/ITB interaction
- lateral snapping

### IT band-related

Diferenciar de:

- GTPS
- gluteal tendinopathy
- lumbar referral
- hip joint pathology

### Differential

- lumbar referred pain
- L5 radiculopathy
- SI-related
- hip joint
- gluteal tendinopathy
- trochanteric bursal/peritrochanteric
- external snapping
- proximal femoral bone stress
- medical/systemic

---

# 23. LATERAL HIP — HISTORIA OBLIGATORIA

Preguntar:

- exact lateral pain location
- greater trochanter pain
- pain lying on affected side
- walking
- running
- stairs
- single-leg stance
- prolonged standing
- crossing legs
- getting out of chair
- lateral movements
- side-lying
- recent training-load change
- previous lateral hip injury
- lumbar symptoms
- neurological symptoms
- snapping

---

# 24. LATERAL HIP — EXPLORACIÓN OBLIGATORIA

Incluir:

- greater trochanter palpation
- gluteus medius/minimus region
- resisted hip abduction
- resisted external rotation when relevant
- single-leg stance
- Trendelenburg
- step-down
- single-leg squat
- walking/running
- side-lying provocation
- hip ROM
- FADIR/FABER if hip joint differential remains
- lumbar screen
- neurological screen when indicated

Trendelenburg positivo NO es un diagnóstico.

---

# 25. LATERAL HIP — CLUSTERS

No depender de un solo test.

Ejemplo:

LATERAL HIP PAIN
+
GREATER TROCHANTER TENDERNESS
+
PAIN WITH SINGLE-LEG LOAD
+
PAIN WITH RESISTED ABDUCTION
→
GLUTEAL/GTPS COMPATIBILITY ↑

Después diferenciar:

- tendon-dominant
- bursal/peritrochanteric
- lumbar referred
- hip joint
- other

No inventar scores validados.

---

# 26. DESPUÉS DE LATERAL: POSTERIOR HIP PAIN

Debe cubrir:

- proximal hamstring tendinopathy
- proximal hamstring strain
- deep gluteal syndrome
- piriformis-related
- ischiofemoral impingement
- quadratus femoris
- posterior hip joint
- SI/lumbar referral
- lumbar radiculopathy
- sciatic nerve-related symptoms

La localización debe distinguir:

- posterior hip
- buttock
- ischial tuberosity
- deep gluteal
- posterolateral hip
- low back

---

# 27. DESPUÉS DE POSTERIOR: TRAUMATIC HIP & PELVIS

Debe cubrir:

- hip flexor strain
- rectus femoris
- adductor strain
- proximal hamstring
- avulsion
- pelvic fracture
- hip fracture
- hip dislocation
- traumatic labral/intra-articular
- bone stress/fracture
- acute muscle/tendon injury

Incluir:

- mecanismo
- pop
- bruising
- swelling
- immediate pain
- weakness
- ability to continue sport
- weight bearing
- neurovascular screen
- emergency criteria

---

# 28. FINAL DE CADERA: HIP MASTER INTEGRATION

Cuando estén completos:

1. Groin pain
2. Hip-related groin pain
3. Lateral hip
4. Posterior hip
5. Traumatic hip/pelvis

Crear un único árbol:

HIP/GROIN PAIN
↓
RED FLAGS
↓
EXACT LOCATION
↓
ANTERIOR / MEDIAL / PUBIC / INGUINAL / DEEP / LATERAL / POSTERIOR
↓
HISTORY + MECHANISM
↓
LOAD
↓
ROM
↓
PALPATION
↓
PRIMARY TEST
↓
SECONDARY TESTS
↓
DIFFERENTIAL
↓
COEXISTING PATHOLOGY
↓
CONFIDENCE
↓
RECOMMENDATION

---

# 29. RECOMMENDATION ENGINE

Clasificación final:

## LOW RISK / INFORMATION

Solo si no hay red flags y el patrón es compatible con un cuadro musculoesquelético de bajo riesgo.

## PHYSIOTHERAPY ASSESSMENT

Cuando:

- persiste
- limita función
- hay patrón musculoesquelético
- se necesita exploración
- se necesita plan de carga/rehabilitación

## MEDICAL ASSESSMENT

Cuando:

- diagnóstico incierto
- síntomas persistentes/importantes
- sospecha estructural
- puede requerir imagen

## URGENT / EMERGENCY

Cuando:

- fracture/dislocation suspected
- inability to bear weight after major trauma
- severe neurological deficit
- systemic infection concern
- severe unexplained symptoms
- other urgent red flags

---

# 30. EVIDENCE RULES

Para cada módulo nuevo:

Priorizar:

- clinical practice guidelines
- systematic reviews
- diagnostic accuracy studies
- consensus statements
- BJSM
- JOSPT
- AAOS cuando sea apropiado
- literatura revisada por pares

No inventar sensibilidad/especificidad.

Si la evidencia es mixta:

indicar que es mixta.

Si una prueba funciona mejor en cluster:

indicarlo.

---

# 31. INSTRUCCIÓN DIRECTA PARA CURSOR

“Continúa Physioguide desde el punto exacto indicado en este documento. No reinicies módulos anteriores. Mantén la arquitectura de razonamiento clínico, el nivel de detalle y las reglas de seguridad. Desarrolla el siguiente módulo usando historia, localización, mecanismo, carga, palpación, pruebas principales, pruebas complementarias, pruebas funcionales, diferenciales, patologías coexistentes, red flags, imagen y árboles de decisión. Nunca conviertas una prueba positiva aislada en un diagnóstico definitivo. No inventes métricas diagnósticas. Cuando la evidencia sea limitada o mixta, indícalo.”

## SIGUIENTE TAREA EXACTA:

# QA / AUDIT FINAL — COMPLETA (✓)

Ver `knowledge/PHYSIOGUIDE_QA_AUDIT_FINAL_2026-08-13.md`.

Opcional no bloqueante: enriquecer MD thin (raquis/codo) + re-ingest; o Phase 1bis finger/head.

---

# 32. PRINCIPIO FINAL

Physioguide NO debe ser:

INJURY → TEST.

Debe ser:

SYMPTOM
→ LOCATION
→ HISTORY
→ MECHANISM
→ LOAD
→ EXAMINATION
→ TEST CLUSTER
→ DIFFERENTIAL
→ RED FLAGS
→ CONFIDENCE
→ NEXT STEP.

Este principio debe mantenerse en todos los módulos futuros.

END OF MASTER DOCUMENT
