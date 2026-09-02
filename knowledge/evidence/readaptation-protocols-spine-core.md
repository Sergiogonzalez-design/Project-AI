# PHYSIOGUIDE — READAPTACIÓN — RAQUIS, CORE Y RESPIRACIÓN

**Capa:** Fase 3 evidence DB (readaptación)  
**Región:** lumbar, torácica, core, respiración  
**Regla:** no diagnosticar hernia/discopatía por respuesta a ejercicio. McKenzie/ McGill como **temas**, no religiones. Sciatic slider con cautela.

**Marco general:** ver `readaptation-master.md`.

---

## CONDICIÓN: LUMBALGIA MECÁNICA INESPECÍFICA

**Purpose:** Mantener actividad, mejorar control lumbopélvico y tolerancia a carga.

**Clinical meaning:** Cochrane LBP: ejercicio **probablemente** efectivo vs no tratamiento; **evidencia mixta** sobre si estabilización > general exercise. Enfoque multimodal (movilidad + fuerza + aeróbico) **compatible con** buena práctica (JOSPT LBP CPG).

**Limitations:** Radiculopatía progresiva, cauda equina, dolor inflamatorio nocturno → derivación.

### Tabla progresión lumbalgia mecánica

| Fase | id ejercicios | Objetivo |
|------|---------------|----------|
| protection | `lumbar_cat_camel`, `core_diaphragmatic_breathing`, `lumbar_bridge` (suave) | Movilidad + activación |
| loading | `lumbar_mcgill_curl_up`, `lumbar_bird_dog`, `lumbar_dead_bug`, `lumbar_clamshell` | Big Three + anti-extensión |
| functional | `lumbar_hip_hinge_dowel`, `lumbar_pallof_press`, `lumbar_graded_walking` | Patrones vida real |
| RTS | `general_farmer_carry`, deporte específico | Criterios individuales |

### Plan semanas 1–4 (lumbalgia mecánica)

| Semana | Contenido |
|--------|-----------|
| 1 | Respiración diafragmática 5 min; cat-camel 2×10; puente 3×12 |
| 2 | Curl-up McGill 3×10×8 s; bird dog 3×8/lado |
| 3 | Dead bug 3×8/lado; clamshell 3×15; caminata 15 min |
| 4 | Bisagra palo 3×10; evaluar respuesta 24 h antes de Pallof |

**AI rule:** «Lumbalgia mecánica: mantente activo; Big Three McGill **compatibles con** enfoque estabilización — no son la única opción con evidencia.»

**Citation:** Delitto A et al. JOSPT LBP CPG themes; Cochrane exercise for LBP; McGill S — Big Three clinical use.

---

## CONDICIÓN: CIÁTICA / RADICULOPATÍA LUMBAR LEVE

**Purpose:** Movilidad neural cautelosa + extensiones si **centralizan** (McKenzie direction preference).

**Clinical meaning:** Extensión repetida (press-up) **puede** ayudar si síntomas periféricos centralizan (evidencia mixta Cochrane). Neural sliders: evidencia **limitada/mixta** — solo sin déficit motor.

**Limitations:** Déficit motor, cauda equina, dolor progresivo → urgencia/neuro. No press-up si peripheraliza.

### Tabla progresión ciática leve

| Fase | id | Condición |
|------|-----|-----------|
| protection | `core_diaphragmatic_breathing`, `lumbar_cat_camel` | Sin peripheralización |
| protection (opcional) | `lumbar_prone_press_up` | Solo si centraliza |
| protection (opcional) | `lumbar_sciatic_slider` | Solo leve, sin déficit motor |
| loading | `lumbar_bird_dog`, `lumbar_bridge` | Cuando irritabilidad baja |

**AI rule:** «Ciática: si press-up empeora el dolor hacia el pie, **para**. Slider suave solo si no hay debilidad. Deriva déficit motor.»

**Citation:** McKenzie R — direction preference themes; Cochrane motor control LBP (mixed); Butler/Coppieters neural mobilization (mixed).

---

## EXERCISE: [id=lumbar_mcgill_curl_up] Curl-up de McGill

**Purpose:** Endurance recto abdominal con mínima flexión lumbar.

**Phase:** loading

**Dosage template:** 3×10 holds 8–10 s; alternar rodilla flexionada.

**Progression:** Más tiempo; piernas extendidas si tolerado.

**Regression:** Isométrico abdominal sin elevación.

**Contraindications:** Dolor flexión agudo; postoperatorio según protocolo.

**AI rule:** «Parte Big Three; no sustituye caminata ni educación carga.»

**Citation:** McGill S; lumbar stabilization clinical literature.

---

## EXERCISE: [id=lumbar_bird_dog] Bird dog (cuadrupedia contralateral)

**Purpose:** Control lumbopélvico; multífidos/glúteos.

**Phase:** loading

**Dosage template:** 3×8–10/lado, holds 5–8 s.

**Progression:** Superficie inestable; más tiempo.

**Regression:** Solo pierna o solo brazo.

**Contraindications:** Dolor extensión lumbar severa aguda.

**AI rule:** «Big Three; cadera nivelada, columna neutra.»

**Citation:** McGill Big Three.

---

## EXERCISE: [id=lumbar_side_plank_regressed] Plancha lateral regresada

**Purpose:** Resistencia lateral (oblicuos, QL).

**Phase:** loading

**Dosage template:** 3×20–30 s/lado.

**Progression:** Rodillas extendidas.

**Regression:** Menos tiempo; mano en pared.

**Contraindications:** Dolor lateral agudo; inestabilidad hombro.

**AI rule:** «Big Three; empieza rodillas si plena es demasiado.»

**Citation:** McGill Big Three.

---

## EXERCISE: [id=lumbar_dead_bug] Dead bug

**Purpose:** Anti-extensión; control lumbopélvico supino.

**Phase:** loading

**Dosage template:** 3×8–10/lado, movimiento lento.

**Progression:** Extensión completa brazo/pierna; banda pies.

**Regression:** Solo pierna o rango parcial.

**Contraindications:** Dolor flexión agudo.

**AI rule:** «Core anti-extensión; lumbar estable — no arquear.»

**Citation:** Escamilla et al. core exercise EMG/clinical themes.

---

## EXERCISE: [id=lumbar_prone_press_up] Press-up en prono (McKenzie)

**Purpose:** Extensión lumbar repetida; centralización síntomas.

**Phase:** protection (condicional)

**Dosage template:** 10 reps cada 2–3 h **solo si indicado clínicamente**.

**Progression:** Mayor extensión si periféricos disminuyen.

**Regression:** Presión parcial.

**Contraindications:** Peripheralización; estenosis extensión-intolerante.

**AI rule:** «Solo si centraliza o no empeora; no es para todos los discos/hernias. Evidencia mixta.»

**Citation:** McKenzie direction preference; Cochrane McKenzie vs other (mixed).

---

## EXERCISE: [id=lumbar_sciatic_slider] Deslizamiento ciático (slider)

**Purpose:** Movilidad neural ciático sin tensión estática prolongada.

**Phase:** protection (cautela)

**Dosage template:** 10–15 reps, 2×/día; sin aumento dolor >1 h.

**Progression:** Más amplitud si tolerado.

**Regression:** Menor extensión rodilla.

**Contraindications:** Déficit motor agudo; cauda equina.

**AI rule:** «Slider ≠ estiramiento isquios agresivo. Para si empeora irradiación.»

**Citation:** Butler DS; Cochrane neural mobilization (mixed); Coppieters.

---

## EXERCISE: [id=lumbar_cat_camel] Gato-camello

**Purpose:** Movilidad lumbar/torácica suave.

**Phase:** protection

**Dosage template:** 2×10 reps lentas, 1–2×/día.

**Progression:** Control segmentario.

**Regression:** Rango muy pequeño.

**Contraindications:** Estenosis con extensión sintomática — modificar.

**AI rule:** «Movilidad gentil; no forzar final de rango.»

**Citation:** Clinical LBP mobility themes.

---

## EXERCISE: [id=lumbar_hip_hinge_dowel] Bisagra de cadera con palo

**Purpose:** Enseñar patrón levantamiento seguro.

**Phase:** functional

**Dosage template:** 3×10 reps lentas, sin carga externa inicial.

**Progression:** RDL kettlebell ligero.

**Regression:** Bisagra sentado banco.

**Contraindications:** Flexión lumbar aguda intolerable.

**AI rule:** «Funcional clave antes de cargar suelos; tres contactos palo.»

**Citation:** McGill ergonomic/lifting themes.

---

## EXERCISE: [id=lumbar_pallof_press] Pallof press anti-rotación

**Purpose:** Core anti-rotación; transferencia funcional.

**Phase:** functional

**Dosage template:** 3×10–12/lado, RPE 6/10.

**Progression:** Más resistencia; split stance.

**Regression:** Holds isométricos cortos.

**Contraindications:** Dolor rotación agudo.

**AI rule:** «Anti-rotación para vida real; no es primer ejercicio semana 1.»

**Citation:** McGill / S&C anti-rotation themes.

---

## EXERCISE: [id=lumbar_graded_walking] Caminata graduada

**Purpose:** Aeróbico axial tolerado.

**Phase:** functional

**Dosage template:** 10–15 min inicial; +10–20%/semana si 24 h OK.

**Progression:** Distancia, ritmo, terreno.

**Regression:** Intervalos cortos.

**Contraindications:** Claudicación neurogénica severa sin valorar.

**AI rule:** «Cochrane apoya actividad aeróbica en LBP; caminar suele ser primer aeróbico.»

**Citation:** Cochrane exercise LBP aerobic themes.

---

## EXERCISE: [id=lumbar_bridge] Puente de glúteos

**Purpose:** Activación glúteos; descarga lumbar en extensión controlada.

**Phase:** loading

**Dosage template:** 3×12–15, RPE 5–6/10.

**Progression:** Unilateral; banda rodillas.

**Regression:** Rango parcial.

**Contraindications:** Dolor extensión lumbar agudo.

**AI rule:** «Enlace cadera-lumbar; evita hiperlordosis arriba.»

**Citation:** Cochrane LBP; hip-lumbar linkage themes.

---

## EXERCISE: [id=lumbar_clamshell] Clamshell

**Purpose:** Glúteo medio; estabilidad lumbopélvica.

**Phase:** loading

**Dosage template:** 3×15/lado, banda opcional.

**Progression:** Banda resistiva; side plank combo.

**Regression:** Sin banda.

**Contraindications:** Dolor cadera lateral agudo.

**AI rule:** «Útil lumbalgia + rodilla + GTPS; pelvis estable.»

**Citation:** Powers et al. lumbopelvic-hip complex.

---

## CONDICIÓN: MOVILIDAD TORÁCICA (T-SPINE)

**Purpose:** Mejorar extensión/rotación torácica para patrón cervical y hombro.

**Clinical meaning:** Restricción torácica **asociada** a cervicalgia y disfunción escapular (Kapreli themes — evidencia clínica, no causalidad fuerte). Ejercicios suaves **compatibles con** programas multimodales.

**Limitations:** Osteoporosis severa; dolor torácico no diagnosticado; fractura.

### Tabla progresión torácica

| Fase | id / actividad | Notas |
|------|----------------|-------|
| protection | `cervical_thoracic_extension_break` | Pausas posturales |
| loading | Rotaciones sentado; foam extension (sin id catalogado — describir cualitativo) | Sin dolor agudo |
| functional | Integrar en wall slide hombro | |

### Plan semanas 1–4 (torácica)

| Semana | Contenido |
|--------|-----------|
| 1 | Pausa extensión torácica 8–10 reps cada 1–2 h sedestación |
| 2 | Rotaciones sentado 2×10/lado suaves |
| 3 | Extensión sobre foam/respaldar 2×10 |
| 4 | Integrar con `shoulder_wall_slide` si hombro implicado |

**AI rule:** «Torácica rígida puede contribuir a cuello/hombro; movilidad suave, no crujidos forzados.»

**Citation:** Kapreli E et al. thoracic spine in neck pain; JOSPT thoracic manipulation/exercise themes (mixed).

---

## EXERCISE: [id=cervical_thoracic_extension_break] Pausa de extensión torácica

**Purpose:** Extensión torácica con cuello neutro; break postural.

**Phase:** protection (también torácica)

**Dosage template:** 8–10 reps cada 1–2 h si sedestación.

**Progression:** Mayor rango; rotación torácica.

**Regression:** Extensión mínima sin apoyo.

**Contraindications:** Osteoporosis severa; dolor torácico no filiado.

**AI rule:** «Cuello neutro; movimiento en T-spine, no hiperextender cervical.»

**Citation:** Kapreli; sedentary work MSK themes.

---

## CONDICIÓN: CORE / ESTABILIZACIÓN (TRANSVERSO, RESPIRACIÓN)

**Purpose:** Coordinar respiración diafragmática con activación core profundo.

**Clinical meaning:** Respiración diafragmática **compatible con** complemento biopsicosocial en dolor MSK. Dead bug / bird dog integran control sin máxima compressión lumbar (Escamilla themes).

### Tabla progresión core

| Fase | id |
|------|-----|
| protection | `core_diaphragmatic_breathing` |
| loading | `lumbar_dead_bug`, `lumbar_bird_dog`, `lumbar_mcgill_curl_up` |
| functional | `lumbar_pallof_press`, `general_farmer_carry` |

### Plan semanas 1–4 (core)

| Semana | Contenido |
|--------|-----------|
| 1 | Respiración 5–10 min/día; dead bug regresado 3×6 |
| 2 | Bird dog 3×8; curl-up McGill 3×8 |
| 3 | Side plank regresada 3×20 s |
| 4 | Pallof ligero 3×10 |

**AI rule:** «Core no es solo abdominales; incluye respiración y anti-rotación. Progresión por tolerancia lumbar.»

**Citation:** Cochrane LBP exercise; Escamilla core EMG; biopsychosocial breathing adjunct.

---

## EXERCISE: [id=core_diaphragmatic_breathing] Respiración diafragmática

**Purpose:** Relajación; activación diafragma; base dead bug/bird dog.

**Phase:** protection

**Dosage template:** 5–10 min, 1–2×/día o pre-ejercicio.

**Progression:** Integrar con dead bug.

**Regression:** Ciclos más cortos.

**Contraindications:** Disnea no explicada → valoración médica.

**AI rule:** «Complemento en dolor MSK; no trata patología orgánica pulmonar.»

**Citation:** Biopsychosocial MSK pain themes; clinical relaxation adjunct.

---

## INTEGRACIÓN McGILL «BIG THREE»

**Purpose:** Paquete curl-up + side plank + bird dog para endurance lumbopélvica.

**Clinical meaning:** Ampliamente **usado** en clínica; evidencia RCT específica **mixta** vs otros ejercicios. Útil como **opción** estructurada, no obligatoria universal.

**Procedure:** 3 ejercicios, 3× holds/reps según tolerancia, 3–4×/semana.

**AI rule:** «Big Three McGill: opción compatible con estabilización; si no toleras uno, regresa o sustituye (puente, dead bug).»

**Citation:** McGill S; Stanton R et al. McGill Big Three study themes; Cochrane (no single winner).

---

## RED FLAGS RAQUIS — DETENER EJERCICIO

- Síndrome cauda equina (anestesia silla, retención, bilateral ciática)
- Déficit motor progresivo
- Dolor torácico, disnea, sudoración con esfuerzo
- Fiebre + dolor columna
- Trauma mayor + deformidad
- Dolor nocturno severo progresivo + pérdida peso
- Osteoporosis + dolor agudo post-flexión (fractura)

**AI rule:** No press-up, no slider, no core agresivo ante red flags.

**Citation:** JOSPT LBP red flags; NICE cauda equina guidance.

---

## CUÁNDO DERIVAR (RAQUIS)

- Radiculopatía con déficit motor
- Claudicación neurogénica
- Sospecha fractura, infeión, neoplasia
- LBP >6–12 semanas sin mejora con adherencia (criterio orientativo)
- Estenosis severa sintomática no respondiente

**AI rule:** Derivación por seguridad o estancamiento, no por «falta de motivación».

**Citation:** JOSPT LBP CPG referral; clinical reasoning spine modules.

---

## RESUMEN IA — RAQUIS / CORE

1. Lumbalgia → activo + Big Three/dead bug + caminata
2. Ciática → press-up/slider **solo** si indicado y sin déficit motor
3. Torácica → extension breaks + rotaciones suaves
4. Core → respiración → anti-extensión → anti-rotación → bisagra
5. Regla 24 h y ≤3/10 siempre

**Citation:** Physioguide readaptation spine-core protocols; McGill; Cochrane LBP; JOSPT; Butler/Coppieters neural (mixed).
