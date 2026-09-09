# PHYSIOGUIDE — READAPTACIÓN — PROTOCOLOS MIEMBRO INFERIOR

**Capa:** Fase 3 evidence DB (readaptación)  
**Región:** cadera, rodilla, tobillo, pie  
**Regla:** progresión por fases, regla 24 h, ids del catálogo. No inventar % curación ni tiempos RTS fijos.

**Marco general:** ver `readaptation-master.md`.

---

## CONDICIÓN: GTPS / DOLOR LATERAL CADERA

**Purpose:** Fortalecer glúteo medio/menor y reducir carga compressiva sobre trocánter mayor.

**Clinical meaning:** Ejercicio de fortalecimiento glúteo **compatible con** mejora en GTPS (evidencia clínica moderada; revisiones JOSPT/BJSM). Evitar estiramientos agresivos ITB/trocánter en fase irritable. Progresión lateral loading gradual.

**Limitations:** Dolor nocturno severo, pérdida peso, fiebre → descartar otras causas. Fractura por estrés no filiada → no carga.

### Tabla progresión GTPS

| Fase | id ejercicios | Criterio avance |
|------|---------------|-----------------|
| protection | `hip_flexor_stretch`, `hip_faber_stretch` (suave), `lumbar_clamshell` | Dolor lateral ≤3/10 en AVD |
| loading | `hip_sidelying_abduction`, `hip_glute_bridge`, `lumbar_clamshell` | 3×15 abducción sin empeoramiento 24 h |
| functional | `hip_hitch`, `hip_single_leg_stance` | Marcha monopodal estable |
| RTS | `general_y_balance_reach` | Deporte sin dolor lateral persistente |

### Plan semanas 1–4 (GTPS)

| Semana | Contenido |
|--------|-----------|
| 1 | Clamshell 3×15; estiramiento flexores suave 3×30 s; evitar lado afectado al dormir si irrita |
| 2 | Puente glúteo 3×12; abducción lateral 3×12 sin banda |
| 3 | Abducción + banda ligera; hip hitch 3×10 |
| 4 | Monopodal 3×30 s; evaluar progresión funcional |

**AI rule:** «GTPS: fortalecer glúteo medio con abducción lateral y clamshell; evita cruces de piernas prolongados si irritan. Progresa si no empeoras en 24 h.»

**Citation:** Grimaldi A et al. GTPS exercise themes; JOSPT hip/groin guidance; Cochrane gluteal tendinopathy (emerging, mixed).

---

## CONDICIÓN: DOLOR INGUINAL / PUBALGIA (ADDUCTORES)

**Purpose:** Fortalecer aductores y estabilizadores con progresión Copenhagen.

**Clinical meaning:** Programa Copenhagen **compatible con** reducción incidencia lesiones aductores en deportes (Harøy et al. — contexto prevención). En pubalgia activa, empezar **palanca corta** y evitar dolor inguinal >3/10.

**Limitations:** Pubalgia no valorada, hernia inguinal, dolor testicular → derivación.

### Tabla progresión ingle

| Fase | id | Notas |
|------|-----|-------|
| protection | `hip_flexor_stretch`, isométrico adducción lateral (sin id — evitar si no catalogado) | Reposo relativo deporte |
| loading | `hip_copenhagen_short_lever` | Palanca corta obligatoria al inicio |
| functional | `hip_copenhagen_short_lever` → larga; `hip_single_leg_stance` | Solo si 24 h OK |

### Plan semanas 1–4 (ingle)

| Semana | Contenido |
|--------|-----------|
| 1 | Movilidad suave; sin Copenhagen si dolor agudo |
| 2 | Copenhagen corto 3×8×5 s |
| 3 | Copenhagen corto 3×10; monopodal asistido |
| 4 | Valorar palanca larga solo si sin dolor inguinal 24 h |

**AI rule:** «Pubalgia/ingle: Copenhagen progresivo desde palanca corta; dolor inguinal con ejercicio = regresar. Valoración médica si persiste.»

**Citation:** Harøy J et al. Copenhagen adduction study themes; Weir et al. groin pain clinical frameworks.

---

## EXERCISE: [id=hip_sidelying_abduction] Abducción cadera decúbito lateral

**Purpose:** Fortalecer glúteo medio.

**Phase:** loading

**Dosage template:** 3×15/lado, RPE 5–6/10.

**Progression:** Banda; holds 3 s arriba.

**Regression:** Clamshell; rango menor.

**Contraindications:** Trocanteritis aguda severa — ajustar rango.

**AI rule:** «Ejercicio central GTPS y control rodilla (Powers).»

**Citation:** Powers CM PFPS/JOSPT; Grimaldi GTPS themes.

---

## EXERCISE: [id=hip_copenhagen_short_lever] Copenhagen aducción (palanca corta)

**Purpose:** Carga aductores en cadena cerrada controlada.

**Phase:** loading → functional

**Dosage template:** 3×8–10 holds 5 s, progresar gradualmente.

**Progression:** Palanca larga (tobillo en banco).

**Regression:** Isométrico adducción lateral sin elevación pélvica.

**Contraindications:** Dolor inguinal agudo no valorado.

**AI rule:** «Compatible con fortalecimiento aductores; empieza corto siempre en pubalgia.»

**Citation:** Harøy et al. Copenhagen program.

---

## EXERCISE: [id=hip_glute_bridge] Puente de glúteos

**Purpose:** Activación glúteo mayor; cadena posterior.

**Phase:** loading (cadera, lumbar)

**Dosage template:** 3×12–15, pausa 2 s arriba.

**Progression:** Monopodal; banda rodillas.

**Regression:** Rango parcial.

**Contraindications:** Dolor extensión cadera agudo.

**AI rule:** «Puente antes de bisagra cargada; vigilar compensación lumbar.»

**Citation:** Cochrane LBP/hip exercise themes.

---

## CONDICIÓN: PFPS / DOLOR ANTERIOR RODILLA

**Purpose:** Fortalecer cuádriceps y glúteos; mejorar control patelar (step-down, TKE).

**Clinical meaning:** JOSPT CPG patellofemoral pain (Powers): ejercicio de cadera + rodilla **recomendado**; no hay un solo ejercicio «ganador». Evidencia mixta sobre tape/bracing vs ejercicio.

### Tabla progresión PFPS

| Fase | id |
|------|-----|
| protection | `knee_quad_set_tke` |
| loading | `knee_terminal_extension`, `hip_sidelying_abduction`, `knee_patellar_isometric_wall_sit` (si tendón no dominante) |
| functional | `knee_step_down`, `knee_sit_to_stand` |
| RTS | `knee_single_leg_balance`, `general_y_balance_reach` |

### Plan semanas 1–4 (PFPS)

| Semana | Contenido |
|--------|-----------|
| 1 | Quad set/TKE 3×15; clamshell 3×15 |
| 2 | TKE con banda 3×12; puente glúteo 3×12 |
| 3 | Step-down bajo 3×8; sit-to-stand 3×10 |
| 4 | Monopodal 3×30 s; progresar step-down altura |

**AI rule:** «PFPS: cuádriceps + glúteo medio; control rodilla en step-down. Dolor anterior ≤3/10 en sesión.»

**Citation:** Powers CM et al. JOSPT CPG patellofemoral pain; Cochrane PFPS exercise themes.

---

## CONDICIÓN: TENDINOPATÍA ROTULIANA

**Purpose:** Isométricos → isotónicos → carga funcional tendón rotuliano.

**Clinical meaning:** Isométricos Spanish squat / wall sit **compatibles con** analgesia temprana (Rio). Progresión excéntrica/isotónica evidencia **mixta** vs otros protocolos. No jugar/deportar con dolor tendinoso persistente sin plan.

### Tabla progresión tendón rotuliano

| Fase | id |
|------|-----|
| protection | `knee_patellar_isometric_wall_sit`, `knee_quad_set_tke` |
| loading | `knee_spanish_squat_isometric`, `knee_heel_raise_straight_bent` |
| functional | `knee_sit_to_stand`, `knee_step_down` |
| RTS | Saltos solo tras criterios (hop prep tobillo/rodilla) |

### Plan semanas 1–4 (rotuliano)

| Semana | Contenido |
|--------|-----------|
| 1 | Wall sit superficial 4×30 s; quad set 3×15 |
| 2 | Spanish squat isométrica 4×30 s |
| 3 | Sit-to-stand 3×10; calf raises 3×12 |
| 4 | Step-down si tendón tolera; regla 24 h estricta |

**AI rule:** «Tendinopatía rotuliana: isométricos primero; dolor ≤4/10 durante puede ser OK si 24 h estable — si empeora, baja carga.»

**Citation:** Rio E et al. BJSM 2015; van Ark M et al. patellar tendinopathy loading reviews.

---

## EXERCISE: [id=knee_spanish_squat_isometric] Sentadilla española isométrica

**Purpose:** Carga cuádriceps/tendón en ángulo controlado.

**Phase:** loading

**Dosage template:** 4–5×30–45 s, RPE 6–7/10.

**Progression:** Más tiempo; sentadilla isotónica asistida.

**Regression:** Menor inclinación; holds cortos.

**Contraindications:** Tendinopatía muy irritable sin graduar.

**AI rule:** «Isométrico clave rotuliano; monitorizar respuesta 24 h.»

**Citation:** Rio isometric themes; patellar tendinopathy clinical loading.

---

## EXERCISE: [id=knee_quad_set_tke] Contracción cuádriceps / TKE

**Purpose:** Activación VMO/cuádriceps post-agudo o PFPS.

**Phase:** protection

**Dosage template:** 3×10–15 holds 5–10 s, varias veces/día.

**Progression:** `knee_terminal_extension` con banda.

**Regression:** Isométrico sin extensión completa.

**Contraindications:** Artrofibrosis con bloqueo extensión — valoración médica.

**AI rule:** «Base ACL conservador temprano y PFPS.»

**Citation:** JOSPT ACL rehab themes; Logerstedt CPG.

---

## EXERCISE: [id=knee_step_down] Step-down controlado

**Purpose:** Control excéntrico rodilla + glúteo en funcional.

**Phase:** functional

**Dosage template:** 3×8–10/pierna, escalón 15–20 cm.

**Progression:** Escalón más alto; peso.

**Regression:** Escalón bajo; apoyo parcial.

**Contraindications:** PF agudo con excéntrico intolerable.

**AI rule:** «Ejercicio funcional PFPS; alinea rodilla sobre 2.º–3.er dedo.»

**Citation:** Powers JOSPT PFPS CPG.

---

## CONDICIÓN: LCA — REHABILITACIÓN CONSERVADORA FASE TEMPRANA

**Purpose:** Mantener extensión, activar cuádriceps, evitar atrofia en manejo conservador o pre-quirúrgico.

**Clinical meaning:** JOSPT CPG ligamentos rodilla: movilidad temprana y activación cuádriceps **compatibles con** mejor outcomes. **No** sustituye valoración ortopédica. Progresión conservadora según estabilidad.

**Limitations:** Rodilla inestable funcional, bloqueo, hemartros recurrente → derivación.

### Tabla fase temprana LCA conservador

| Fase | id | Notas |
|------|-----|-------|
| protection | `knee_quad_set_tke`, `knee_patellar_isometric_wall_sit` (suave) | Objetivo extensión completa |
| loading | `knee_terminal_extension`, `knee_heel_raise_straight_bent`, `knee_nordic_assisted` (solo fase tardía loading) | Nordic solo si isquios toleran |
| functional | `knee_sit_to_stand`, `knee_single_leg_balance` | Criterios médicos para RTS |

### Plan semanas 1–4 (LCA conservador temprano — orientativo)

| Semana | Contenido |
|--------|-----------|
| 1 | TKE/quad set frecuente; elevación; hielo/educación según agudo |
| 2 | TKE banda 3×12; wall sit muy superficial si tolerado |
| 3 | Terminal extension 3×12; equilibrio bilateral |
| 4 | Sit-to-stand; **no** pivotar ni deporte; seguimiento especialista |

**AI rule:** «LCA conservador temprano: cuádriceps cuanto antes; no prometas estabilidad solo con ejercicio. Valoración ortopédica recomendada.»

**Citation:** Logerstedt DS JOSPT knee ligament CPG; van Grinsven et al. ACL rehab review themes.

---

## EXERCISE: [id=knee_nordic_assisted] Nórdico asistido

**Purpose:** Excéntrico isquiotibiales (prevención/rehab tardía).

**Phase:** loading (no fase aguda LCA)

**Dosage template:** 3×5–8 asistidos, 2×/semana.

**Progression:** Menos asistencia manos.

**Regression:** Rango parcial con banda.

**Contraindications:** Distensión isquio aguda.

**AI rule:** «No en semana 1–2 LCA agudo; compatible con fortalecimiento isquios en fase loading avanzada.»

**Citation:** van der Horst et al. Nordic hamstring prevention themes.

---

## CONDICIÓN: ESGUINCE LATERAL TOBILLO

**Purpose:** Movilización temprana, fortalecimiento peroneos, propiocepción, RTS con saltos graduados.

**Clinical meaning:** Cochrane esguince: movilización funcional temprana **mejor** que inmovilización prolongada. Propiocepción **compatible con** reducción recidiva (evidencia mixta en baterías específicas).

### Tabla progresión esguince

| Fase | id |
|------|-----|
| protection | `ankle_alphabet` |
| loading | `ankle_band_eversion`, `ankle_calf_raise` |
| functional | `ankle_balance_foam`, `hip_single_leg_stance` |
| RTS | `ankle_hop_prep_bilateral` → unilateral progresivo |

### Plan semanas 1–4 (esguince grado I–II)

| Semana | Contenido |
|--------|-----------|
| 1 | Alfabeto 3–4×/día; apoyo según tolerancia; RICE relativo |
| 2 | Eversión banda 3×15; calf raise bilateral 3×12 |
| 3 | Monopodal 3×30 s; calf raise unilateral si tolerado |
| 4 | Foam balance; hop prep bajo solo si sin dolor marcha/carrera |

**AI rule:** «Esguince: mueve pronto; fortalece peroneos y gemelos. Saltos solo al final si criterios OK.»

**Citation:** Doherty C et al. Cochrane ankle sprain; Vuurberg G et al. ankle sprain review.

---

## EXERCISE: [id=ankle_alphabet] Alfabeto de tobillo

**Purpose:** Movilidad temprana post-esguince.

**Phase:** protection

**Dosage template:** 1–2 alfabetos completos, 3–4×/día.

**Progression:** Resistencia banda ligera.

**Regression:** Medio alfabeto.

**Contraindications:** Fractura no consolidada.

**AI rule:** «Primer ejercicio habitual post-esguince lateral.»

**Citation:** Cochrane early mobilization ankle sprain.

---

## EXERCISE: [id=ankle_band_eversion] Eversión con banda

**Purpose:** Fortalecer peroneos.

**Phase:** loading

**Dosage template:** 3×15, banda progresiva.

**Progression:** Monopodal durante eversión.

**Regression:** Eversión activa sin banda.

**Contraindications:** Dolor lateral agudo sin valoración.

**AI rule:** «Prevención recidiva esguince; combinar con propiocepción.»

**Citation:** Cochrane/brace+exercise ankle themes.

---

## EXERCISE: [id=ankle_hop_prep_bilateral] Preparación saltos bilaterales

**Purpose:** Introducir impacto controlado pre-RTS.

**Phase:** return_to_sport

**Dosage template:** 3×10 saltos bajos, solo si caminar y calf raises sin dolor.

**Progression:** Saltos forward/lateral; unilateral.

**Regression:** Saltos asistidos.

**Contraindications:** Esguince agudo; fractura estrés.

**AI rule:** «Última fase esguince; no saltar si aún cojeas.»

**Citation:** RTS ankle sprain clinical frameworks (mixed evidence).

---

## CONDICIÓN: FASCIOPATÍA PLANTAR / TALÓN

**Purpose:** Movilidad windlass, fortalecimiento intrínsecos, carga gradual.

**Clinical meaning:** Estiramiento fascia + fortalecimiento **compatibles con** mejora en fascitis plantar (Cochrane themes — heterogeneidad). Short foot para arco (McKeon foot core).

### Tabla progresión pie plantar

| Fase | id |
|------|-----|
| protection | `foot_windlass_stretch`, `foot_short_foot` (suave) |
| loading | `foot_short_foot`, `ankle_calf_raise` |
| functional | `foot_marble_pickups`, `general_farmer_carry` |

### Plan semanas 1–4 (fascia plantar)

| Semana | Contenido |
|--------|-----------|
| 1 | Windlass 3×30 s; short foot sentado 3×10 |
| 2 | Short foot de pie 3×10; calf raise bilateral |
| 3 | Marble pickups 2×15; caminata graduada |
| 4 | Integrar short foot en monopodal |

**AI rule:** «Fascitis plantar: estiramiento windlass suave + intrínsecos; calzado y carga de marcha importan tanto como ejercicio.»

**Citation:** Cochrane plantar fasciitis; McKeon et al. foot core; Rathleff MS et al. loading programs.

---

## EXERCISE: [id=foot_windlass_stretch] Estiramiento windlass suave

**Purpose:** Tensión controlada fascia plantar.

**Phase:** protection

**Dosage template:** 3×30 s, 2×/día.

**Progression:** Mayor extensión MTP si tolerado.

**Regression:** Solo toalla sentado.

**Contraindications:** Dolor plantar severo sin graduar.

**AI rule:** «Suave; empeoramiento matutino persistente → revisar carga global.»

**Citation:** Cochrane plantar fasciitis stretch themes.

---

## EXERCISE: [id=foot_short_foot] Short foot (pie corto)

**Purpose:** Activación intrínsecos y arco.

**Phase:** loading

**Dosage template:** 3×10 holds 5–10 s, 2×/día.

**Progression:** Durante equilibrio/marcha.

**Regression:** Sentado.

**Contraindications:** Fascitis muy irritable aguda.

**AI rule:** «Foot core compatible con control arco; no confundir con flexionar dedos.»

**Citation:** McKeon et al. foot core concept.

---

## RED FLAGS MIEMBRO INFERIOR

- Incapacidad de apoyo tras trauma (considerar fractura/Ottawa)
- Rodilla «a valgo» en pivote funcional no valorada
- Dolor inguinal con masa o fiebre
- Dolor pantorrilla agudo + Thompson positivo (Aquiles)
- Claudicación glútea / déficit vascular

**AI rule:** Detener progresión; derivación según gravedad.

**Citation:** JOSPT; Ottawa ankle rules; vascular red flag themes.

---

## RESUMEN IA — MIEMBRO INFERIOR

1. GTPS → glúteo medio; ingle → Copenhagen cauteloso
2. PFPS → cuádriceps + cadera + step-down
3. Rotuliano → isométricos Rio-style antes de funcional
4. LCA temprano → cuádriceps; no RTS sin criterios
5. Esguince → movilizar pronto; saltos al final
6. Fascia plantar → windlass + short foot + calf

**Citation:** Physioguide readaptation lower protocols; JOSPT CPGs; Cochrane; Rio; Gabbett load themes.
