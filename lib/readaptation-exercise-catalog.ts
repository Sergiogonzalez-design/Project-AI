import type { ReadaptExercise, ReadaptRegion } from "./readaptation-types";

/** Evidence-based readaptation exercise catalog — qualitative citations only. */
export const READAPTATION_EXERCISES: readonly ReadaptExercise[] = [
  // ── Shoulder ──────────────────────────────────────────────────────────────
  {
    id: "shoulder_ccft",
    nameEs: "Flexión cervical profunda (CCFT)",
    nameEn: "Craniocervical flexion (CCFT)",
    region: "shoulder",
    phase: "protection",
    targetMuscles: "Flexores cervicales profundos, estabilizadores cervicales",
    equipment: "Ninguno (opcional: toalla fina bajo nuca)",
    instructionsEs:
      "Acuéstate boca arriba con la cabeza apoyada. Realiza un leve jalonamiento de barbilla sin levantar la cabeza del suelo. Mantén la respiración tranquila y evita activar los músculos superficiales del cuello.",
    instructionsEn:
      "Lie on your back with your head supported. Gently nod your chin without lifting your head off the surface. Breathe calmly and avoid tensing the superficial neck muscles.",
    dosageEs:
      "3 series × 10 repeticiones de 10 s, 2–3 veces/día. Dolor ≤ 3/10 durante y después.",
    dosageEn:
      "3 sets × 10 reps of 10 s hold, 2–3×/day. Pain ≤ 3/10 during and after.",
    progressionEs: "Aumentar tiempo de mantenimiento o pasar a CCFT con presión de toalla graduada.",
    progressionEn: "Increase hold time or progress to graded towel-pressure CCFT.",
    regressionEs: "Mantener cabeza apoyada, repeticiones más cortas o menos series.",
    regressionEn: "Keep head fully supported; shorter holds or fewer sets.",
    contraindicationsEs: "Dolor cervical agudo severo, vértigo, síntomas neurológicos nuevos.",
    contraindicationsEn: "Severe acute neck pain, vertigo, new neurological symptoms.",
    evidenceEs:
      "Entrenamiento de flexores profundos recomendado en cervicalgia y como base de control escapular (Jull et al., temas JOSPT; revisiones clínicas).",
    evidenceEn:
      "Deep flexor training is recommended in neck pain and as a foundation for scapular control (Jull et al., JOSPT themes; clinical reviews).",
    aliases: ["ccft", "flexión cervical profunda", "deep neck flexor", "craniocervical flexion"],
  },
  {
    id: "shoulder_scapular_setting",
    nameEs: "Set escapular (retracción suave)",
    nameEn: "Scapular setting (gentle retraction)",
    region: "shoulder",
    phase: "protection",
    targetMuscles: "Trapecio medio/inferior, serrato anterior",
    equipment: "Ninguno",
    instructionsEs:
      "Sentado o de pie, lleva suavemente los omóplatos hacia abajo y atrás sin arquear la espalda baja. Mantén los hombros relajados y el cuello largo.",
    instructionsEn:
      "Seated or standing, gently draw shoulder blades down and back without arching your lower back. Keep shoulders relaxed and neck long.",
    dosageEs: "3 × 10 mantenimientos de 5–10 s, 1–2 veces/día. Sin dolor irradiado.",
    dosageEn: "3 × 10 holds of 5–10 s, 1–2×/day. No radiating pain.",
    progressionEs: "Integrar en elevaciones en plano de escápula o wall slides.",
    progressionEn: "Integrate into scapular-plane raises or wall slides.",
    regressionEs: "Apoyar antebrazos en mesa; rango más pequeño.",
    regressionEn: "Forearms on table; smaller range.",
    contraindicationsEs: "Inestabilidad glenohumeral aguda no valorada, dolor anterior intenso.",
    contraindicationsEn: "Unassessed acute glenohumeral instability, severe anterior pain.",
    evidenceEs:
      "Control escapular es componente central en hombro doloroso y RCRSP (Kibler et al.; revisiones JOSPT/BJSM).",
    evidenceEn:
      "Scapular control is a core component in painful shoulder and RCRSP (Kibler et al.; JOSPT/BJSM reviews).",
    aliases: ["set escapular", "scapular setting", "retracción escapular", "escápula"],
  },
  {
    id: "shoulder_sidelying_er",
    nameEs: "Rotación externa en decúbito lateral",
    nameEn: "Sidelying external rotation",
    region: "shoulder",
    phase: "loading",
    targetMuscles: "Infraespinoso, redondo menor",
    equipment: "Mancuerna ligera o banda (opcional)",
    instructionsEs:
      "Tumbado de lado, codo a 90° pegado al costado. Gira el antebrazo hacia arriba sin separar el codo del tronco. Baja con control.",
    instructionsEn:
      "Lie on your side, elbow bent 90° at your side. Rotate forearm upward without lifting the elbow off your trunk. Lower with control.",
    dosageEs: "3 × 12–15, carga ligera (RPE 4–5/10). Dolor ≤ 3/10.",
    dosageEn: "3 × 12–15, light load (RPE 4–5/10). Pain ≤ 3/10.",
    progressionEs: "Aumentar carga gradualmente o pasar a ER de pie con banda.",
    progressionEn: "Gradually increase load or progress to standing band ER.",
    regressionEs: "Sin peso; rango parcial sin dolor.",
    regressionEn: "No weight; pain-free partial range.",
    contraindicationsEs: "Dolor nocturno intenso, subluxación reciente.",
    contraindicationsEn: "Severe night pain, recent subluxation.",
    evidenceEs:
      "Rotación externa progresiva es pilar en tendinopatía manguito y RCRSP (Jonsson & Kjellberg; temas Cochrane/OA shoulder).",
    evidenceEn:
      "Progressive external rotation is foundational in cuff tendinopathy and RCRSP (Jonsson & Kjellberg; Cochrane/OA shoulder themes).",
    aliases: ["rotación externa lateral", "sidelying ER", "infraespinoso", "external rotation side lying"],
  },
  {
    id: "shoulder_serratus_punch",
    nameEs: "Serrato punch (protracción escapular)",
    nameEn: "Serratus punch (scapular protraction)",
    region: "shoulder",
    phase: "loading",
    targetMuscles: "Serrato anterior",
    equipment: "Banda elástica o pared",
    instructionsEs:
      "Con banda a la altura del pecho, empuja hacia adelante separando suavemente el omóplato del tórax. Evita encoger hombros.",
    instructionsEn:
      "With band at chest height, push forward gently separating the shoulder blade from your rib cage. Avoid shrugging.",
    dosageEs: "3 × 12–15, RPE 5/10. 1–2 veces/día.",
    dosageEn: "3 × 12–15, RPE 5/10. 1–2×/day.",
    progressionEs: "Plus en pared o plancha con protracción.",
    progressionEn: "Wall plus or plank with protraction.",
    regressionEs: "Protracción en pared sin banda.",
    regressionEn: "Wall protraction without band.",
    contraindicationsEs: "Dolor AC agudo, fractura reciente.",
    contraindicationsEn: "Acute AC pain, recent fracture.",
    evidenceEs:
      "Activación de serrato mejora cinemática escapular en hombro doloroso (Başkurt et al.; temas clínicos JOSPT).",
    evidenceEn:
      "Serratus activation improves scapular kinematics in painful shoulder (Başkurt et al.; JOSPT clinical themes).",
    aliases: ["serratus punch", "protracción", "serrato", "scapular protraction"],
  },
  {
    id: "shoulder_band_er",
    nameEs: "Rotación externa con banda",
    nameEn: "Band external rotation",
    region: "shoulder",
    phase: "loading",
    targetMuscles: "Manguito rotador (infraespinoso, redondo menor)",
    equipment: "Banda elástica",
    instructionsEs:
      "Codo pegado al costado a 90°. Rota el antebrazo hacia fuera contra la banda. Movimiento lento en ambas fases.",
    instructionsEn:
      "Elbow at side, bent 90°. Rotate forearm outward against the band. Move slowly in both directions.",
    dosageEs: "3 × 15, banda ligera-media. Dolor ≤ 3/10.",
    dosageEn: "3 × 15, light-medium band. Pain ≤ 3/10.",
    progressionEs: "Más resistencia o ER en abducción 90° cuando tolerado.",
    progressionEn: "More resistance or ER at 90° abduction when tolerated.",
    regressionEs: "Banda más ligera o decúbito lateral sin banda.",
    regressionEn: "Lighter band or sidelying without band.",
    contraindicationsEs: "Impingement agudo con dolor > 5/10 en arco doloroso.",
    contraindicationsEn: "Acute impingement with pain > 5/10 in painful arc.",
    evidenceEs:
      "Ejercicio excéntrico/isométrico del manguito apoyado en tendinopatía (Rio et al.; revisiones tendinopatía).",
    evidenceEn:
      "Eccentric/isometric cuff exercise supported in tendinopathy (Rio et al.; tendinopathy reviews).",
    aliases: ["rotación externa banda", "band ER", "manguito rotador banda"],
  },
  {
    id: "shoulder_pendulum",
    nameEs: "Péndulo (Codman)",
    nameEn: "Pendulum exercise (Codman)",
    region: "shoulder",
    phase: "protection",
    targetMuscles: "Movilidad glenohumeral pasiva-asistida",
    equipment: "Mesa o silla para apoyo",
    instructionsEs:
      "Inclínate apoyando la mano sana. Deja colgar el brazo afectado y realiza círculos pequeños con el tronco, no con deltoides.",
    instructionsEn:
      "Lean on your good hand. Let the affected arm hang and make small circles by moving your trunk, not the deltoid.",
    dosageEs: "2–3 minutos, 2–3 veces/día. Sin dolor agudo.",
    dosageEn: "2–3 minutes, 2–3×/day. No sharp pain.",
    progressionEs: "Aumentar amplitud o añadir flexo-extensión suave.",
    progressionEn: "Increase amplitude or add gentle flexion-extension.",
    regressionEs: "Círculos más pequeños o posición más vertical.",
    regressionEn: "Smaller circles or more upright position.",
    contraindicationsEs: "Inestabilidad no tratada, postoperatorio según protocolo restrictivo.",
    contraindicationsEn: "Untreated instability, post-op per restrictive protocol.",
    evidenceEs:
      "Movilización temprana pasiva-asistida habitual en capsulitis adhesiva y post-cirugía (temas clínicos JOSPT).",
    evidenceEn:
      "Early passive-assisted mobilization is standard in adhesive capsulitis and post-surgery (JOSPT clinical themes).",
    aliases: ["péndulo", "codman", "pendulum", "colgante hombro"],
  },
  {
    id: "shoulder_cross_body_stretch",
    nameEs: "Estiramiento horizontal adductor (con cautela)",
    nameEn: "Cross-body stretch (use caution)",
    region: "shoulder",
    phase: "protection",
    targetMuscles: "Porción posterior deltoides, infraespinoso",
    equipment: "Ninguno",
    instructionsEs:
      "Lleva el brazo horizontalmente al pecho con la otra mano. Estira suavemente solo si no reproduce dolor anterior o posterior intenso. Mantén 20–30 s.",
    instructionsEn:
      "Bring arm horizontally across chest with opposite hand. Stretch gently only if it does not reproduce severe anterior or posterior pain. Hold 20–30 s.",
    dosageEs: "2–3 × 20–30 s. Evitar si empeora síntomas > 24 h.",
    dosageEn: "2–3 × 20–30 s. Avoid if symptoms worsen > 24 h.",
    progressionEs: "Solo si mejora movilidad sin irritación posterior.",
    progressionEn: "Only if mobility improves without posterior irritation.",
    regressionEs: "Rango parcial o sustituir por movilización posterior guiada.",
    regressionEn: "Partial range or substitute guided posterior mobilization.",
    contraindicationsEs: "Inestabilidad posterior, dolor posterior agudo, luxación previa.",
    contraindicationsEn: "Posterior instability, acute posterior pain, prior dislocation.",
    evidenceEs:
      "Estiramiento posterior puede ayudar en rigidez pero se usa con cautela en inestabilidad (Kelley et al.; temas clínicos).",
    evidenceEn:
      "Posterior stretch may help stiffness but use caution with instability (Kelley et al.; clinical themes).",
    aliases: ["cross body stretch", "estiramiento horizontal", "adducción horizontal hombro"],
  },
  {
    id: "shoulder_wall_slide",
    nameEs: "Deslizamiento en pared (wall slide)",
    nameEn: "Wall slide",
    region: "shoulder",
    phase: "loading",
    targetMuscles: "Trapecio inferior, serrato, elevadores escapulares",
    equipment: "Pared",
    instructionsEs:
      "Espalda contra la pared, codos y muñecas apoyadas. Desliza los brazos hacia arriba manteniendo contacto sin encoger hombros.",
    instructionsEn:
      "Back against wall, elbows and wrists in contact. Slide arms upward keeping contact without shrugging.",
    dosageEs: "3 × 8–10 repeticiones lentas. Dolor ≤ 3/10.",
    dosageEn: "3 × 8–10 slow reps. Pain ≤ 3/10.",
    progressionEs: "Añadir banda ligera o aumentar rango.",
    progressionEn: "Add light band or increase range.",
    regressionEs: "Rango parcial sin perder contacto escapular.",
    regressionEn: "Partial range while maintaining scapular contact.",
    contraindicationsEs: "Dolor en arco doloroso severo sin modificar.",
    contraindicationsEn: "Severe painful arc without modification.",
    evidenceEs:
      "Ejercicios en plano de escápula mejoran control en hombro subacromial doloroso (temas JOSPT/Kibler).",
    evidenceEn:
      "Scapular-plane exercises improve control in painful subacromial shoulder (JOSPT/Kibler themes).",
    aliases: ["wall slide", "deslizamiento pared", "escápula pared"],
  },
  {
    id: "shoulder_ytw_light",
    nameEs: "Y-T-W ligero (prone o inclinado)",
    nameEn: "Light Y-T-W raises",
    region: "shoulder",
    phase: "loading",
    targetMuscles: "Trapecio inferior/medio, deltoides posterior, rotadores",
    equipment: "Mancuernas muy ligeras o peso corporal",
    instructionsEs:
      "Inclinado o prono, eleva brazos en Y, T y W con pulgar arriba y escápulas estabilizadas. Movimientos pequeños y controlados.",
    instructionsEn:
      "In inclined or prone position, raise arms in Y, T, and W with thumbs up and stable shoulder blades. Small controlled movements.",
    dosageEs: "2–3 × 8–10 por letra, carga mínima. RPE 4–5/10.",
    dosageEn: "2–3 × 8–10 per letter, minimal load. RPE 4–5/10.",
    progressionEs: "Más inclinación vertical o ligero peso.",
    progressionEn: "More upright angle or light weight.",
    regressionEs: "Sin peso, rango reducido.",
    regressionEn: "No weight, reduced range.",
    contraindicationsEs: "Dolor cervical con extensión, impingement severo.",
    contraindicationsEn: "Neck pain with extension, severe impingement.",
    evidenceEs:
      "Fortalecimiento de trapecio inferior y control escapular en programas de hombro (Cools et al.; temas clínicos).",
    evidenceEn:
      "Lower trapezius strengthening and scapular control in shoulder programs (Cools et al.; clinical themes).",
    aliases: ["ytw", "y t w hombro", "trapecio inferior", "ytw shoulder"],
  },
  {
    id: "shoulder_isometric_er",
    nameEs: "Rotación externa isométrica",
    nameEn: "Isometric external rotation",
    region: "shoulder",
    phase: "protection",
    targetMuscles: "Infraespinoso, redondo menor",
    equipment: "Toalla o pared",
    instructionsEs:
      "Codo a 90° pegado al costado. Empuja suavemente el dorso de la mano contra pared o toalla sin mover el hombro. Mantén 5–10 s.",
    instructionsEn:
      "Elbow 90° at side. Gently push back of hand against wall or towel without moving the shoulder. Hold 5–10 s.",
    dosageEs: "3 × 10 de 5–10 s, intensidad submáxima (RPE 5–6/10).",
    dosageEn: "3 × 10 of 5–10 s, submaximal effort (RPE 5–6/10).",
    progressionEs: "Pasar a isotónica ligera con banda.",
    progressionEn: "Progress to light isotonic band work.",
    regressionEs: "Menos fuerza o ángulo de codo más bajo.",
    regressionEn: "Less force or lower elbow angle.",
    contraindicationsEs: "Dolor agudo con contracción isométrica.",
    contraindicationsEn: "Acute pain with isometric contraction.",
    evidenceEs:
      "Isométricos tempranos útiles en tendinopatía y dolor tendinoso (Rio et al., isometric loading themes).",
    evidenceEn:
      "Early isometrics useful in tendinopathy and tendon pain (Rio et al., isometric loading themes).",
    aliases: ["isométrica rotación externa", "isometric ER", "isométrico manguito"],
  },

  // ── Elbow ─────────────────────────────────────────────────────────────────
  {
    id: "elbow_wrist_ext_eccentric",
    nameEs: "Excéntrico de extensores de muñeca (estilo Tyler Twist)",
    nameEn: "Wrist extensor eccentric (Tyler Twist style)",
    region: "elbow",
    phase: "loading",
    targetMuscles: "Extensores comunes del antebrazo (ECRB)",
    equipment: "FlexBar o banda con torsión",
    instructionsEs:
      "Sujeta la barra con la mano afectada abajo. La mano sana torsiona la barra y la mano afectada baja lentamente controlando la vuelta a la posición inicial.",
    instructionsEn:
      "Hold the bar with affected hand below. Unaffected hand twists the bar and affected hand lowers slowly controlling return to start.",
    dosageEs: "3 × 15 excéntricos, 1–2 veces/día. Dolor tolerable ≤ 4/10 durante ejercicio.",
    dosageEn: "3 × 15 eccentrics, 1–2×/day. Tolerable pain ≤ 4/10 during exercise.",
    progressionEs: "Más resistencia o velocidad más lenta controlada.",
    progressionEn: "More resistance or slower controlled speed.",
    regressionEs: "Excéntrico con banda más ligera o rango parcial.",
    regressionEn: "Eccentric with lighter band or partial range.",
    contraindicationsEs: "Ruptura aguda sospechada, dolor neurológico irradiado.",
    contraindicationsEn: "Suspected acute rupture, radiating neurological pain.",
    evidenceEs:
      "Protocolo excéntrico (Tyler Twist / Alfredson-style) apoyado en epicondilalgia lateral (Coombes et al., Cochrane themes; Tyler et al.).",
    evidenceEn:
      "Eccentric protocol (Tyler Twist / Alfredson-style) supported in lateral epicondylalgia (Coombes et al., Cochrane themes; Tyler et al.).",
    aliases: ["tyler twist", "flexbar", "excéntrico epicondilitis", "wrist extensor eccentric"],
  },
  {
    id: "elbow_isometric_wrist_ext",
    nameEs: "Isométrico de extensión de muñeca",
    nameEn: "Isometric wrist extension",
    region: "elbow",
    phase: "protection",
    targetMuscles: "Extensores de muñeca",
    equipment: "Mesa o mano contraria",
    instructionsEs:
      "Codo extendido, antebrazo apoyado. Intenta extender la muñeca contra resistencia de la otra mano o mesa sin movimiento. Mantén 15–30 s.",
    instructionsEn:
      "Elbow straight, forearm supported. Try to extend wrist against opposite hand or table without movement. Hold 15–30 s.",
    dosageEs: "4–5 × 30–45 s, RPE 6–7/10. 2 veces/día.",
    dosageEn: "4–5 × 30–45 s, RPE 6–7/10. 2×/day.",
    progressionEs: "Añadir excéntricos o isotónicos graduados.",
    progressionEn: "Add eccentrics or graded isotonics.",
    regressionEs: "Menor intensidad o codo flexionado.",
    regressionEn: "Lower intensity or elbow flexed.",
    contraindicationsEs: "Dolor agudo con carga isométrica máxima.",
    contraindicationsEn: "Acute pain with maximal isometric load.",
    evidenceEs:
      "Isométricos de alta carga pueden reducir dolor tendinoso (Rio et al.; temas tendinopatía lateral).",
    evidenceEn:
      "High-load isometrics may reduce tendon pain (Rio et al.; lateral tendinopathy themes).",
    aliases: ["isométrico muñeca", "isometric wrist extension", "epicondilitis isométrico"],
  },
  {
    id: "elbow_forearm_stretch",
    nameEs: "Estiramiento de extensores de antebrazo",
    nameEn: "Forearm extensor stretch",
    region: "elbow",
    phase: "protection",
    targetMuscles: "Extensores del antebrazo",
    equipment: "Ninguno",
    instructionsEs:
      "Brazo extendido, palma abajo. Con la otra mano flexiona suavemente la muñeca hasta tensión moderada en dorso del antebrazo. No rebotes.",
    instructionsEn:
      "Arm extended, palm down. With other hand gently flex wrist until moderate stretch on forearm extensors. No bouncing.",
    dosageEs: "3 × 30 s, 2–3 veces/día. Estiramiento suave.",
    dosageEn: "3 × 30 s, 2–3×/day. Gentle stretch.",
    progressionEs: "Mayor flexión de muñeca si tolerado.",
    progressionEn: "More wrist flexion if tolerated.",
    regressionEs: "Codo flexionado para menor tensión.",
    regressionEn: "Elbow flexed for less tension.",
    contraindicationsEs: "Irritación nerviosa con estiramiento.",
    contraindicationsEn: "Nerve irritation with stretching.",
    evidenceEs:
      "Movilidad y estiramiento suave como complemento en epicondilalgia (Cochrane themes; guías clínicas).",
    evidenceEn:
      "Gentle mobility and stretch as adjunct in epicondylalgia (Cochrane themes; clinical guidelines).",
    aliases: ["estiramiento antebrazo", "forearm stretch", "extensores antebrazo"],
  },
  {
    id: "elbow_grip_gradation",
    nameEs: "Gradación de agarre",
    nameEn: "Graduated grip training",
    region: "elbow",
    phase: "functional",
    targetMuscles: "Flexores/extensores de antebrazo, intrínsecos de mano",
    equipment: "Pelota de goma o espagueti terapéutico por niveles",
    instructionsEs:
      "Aprieta el material de resistencia adecuada manteniendo codo relajado. Mantén 3–5 s y suelta con control. Progresa resistencia según tolerancia.",
    instructionsEn:
      "Squeeze appropriate resistance material with relaxed elbow. Hold 3–5 s and release with control. Progress resistance per tolerance.",
    dosageEs: "3 × 10–15 repeticiones, 1–2 veces/día. Sin dolor > 4/10.",
    dosageEn: "3 × 10–15 reps, 1–2×/day. Pain not > 4/10.",
    progressionEs: "Mayor resistencia o agarre funcional (llave, pinza).",
    progressionEn: "Higher resistance or functional grip (key pinch).",
    regressionEs: "Espagueti más blando o menos repeticiones.",
    regressionEn: "Softer putty or fewer reps.",
    contraindicationsEs: "Fractura de estrés reciente en antebrazo.",
    contraindicationsEn: "Recent forearm stress fracture.",
    evidenceEs:
      "Fortalecimiento progresivo de agarre incluido en programas multimodales de epicondilalgia (Coombes et al.).",
    evidenceEn:
      "Progressive grip strengthening included in multimodal epicondylalgia programs (Coombes et al.).",
    aliases: ["agarre", "grip training", "pelota goma codo", "pinza mano"],
  },

  // ── Wrist / hand ──────────────────────────────────────────────────────────
  {
    id: "wrist_hand_tendon_glides_median",
    nameEs: "Deslizamiento tendinoso (tendon glides) mediano",
    nameEn: "Median tendon glides",
    region: "wrist_hand",
    phase: "protection",
    targetMuscles: "Flexores de dedos, tendones flexores",
    equipment: "Ninguno",
    instructionsEs:
      "Realiza la secuencia: puño cerrado → puño con dedos rectos → dedos en gancho → puño completo. Movimientos suaves sin dolor agudo.",
    instructionsEn:
      "Perform sequence: straight fist → flat fist → hook fist → full fist. Smooth movements without sharp pain.",
    dosageEs: "10 repeticiones de la secuencia, 3–4 veces/día.",
    dosageEn: "10 sequence reps, 3–4×/day.",
    progressionEs: "Añadir nerve glides si no hay irritación.",
    progressionEn: "Add nerve glides if no irritation.",
    regressionEs: "Solo 2 posiciones de la secuencia.",
    regressionEn: "Only 2 positions of sequence.",
    contraindicationsEs: "Síndrome compartimental agudo, herida abierta reciente.",
    contraindicationsEn: "Acute compartment syndrome, recent open wound.",
    evidenceEs:
      "Tendon glides estándar post-cirugía y en rigidez de mano (Curtis et al.; protocolos clínicos OT).",
    evidenceEn:
      "Tendon glides standard post-surgery and hand stiffness (Curtis et al.; OT clinical protocols).",
    aliases: ["tendon glides", "deslizamiento tendinoso", "flexores dedos"],
  },
  {
    id: "wrist_hand_median_nerve_glider",
    nameEs: "Deslizamiento nervioso mediano (suave)",
    nameEn: "Gentle median nerve glider",
    region: "wrist_hand",
    phase: "protection",
    targetMuscles: "Movilidad del nervio mediano",
    equipment: "Ninguno",
    instructionsEs:
      "Brazo extendido palma arriba. Extiende muñeca y dedos mientras inclinas suavemente la cabeza al lado opuesto. Vuelve a posición neutra. Sin estiramiento agresivo.",
    instructionsEn:
      "Arm extended palm up. Extend wrist and fingers while gently tilting head to opposite side. Return to neutral. No aggressive stretch.",
    dosageEs: "10 repeticiones lentas, 2–3 veces/día. Hormigueo debe ceder al parar.",
    dosageEn: "10 slow reps, 2–3×/day. Tingling should ease when stopped.",
    progressionEs: "Más amplitud solo si no hay aumento de síntomas > 1 h.",
    progressionEn: "More range only if no symptom increase > 1 h.",
    regressionEs: "Menos extensión de muñeca o sin inclinación cervical.",
    regressionEn: "Less wrist extension or no cervical tilt.",
    contraindicationsEs: "Síntomas motores nuevos, dolor neuropático severo.",
    contraindicationsEn: "New motor symptoms, severe neuropathic pain.",
    evidenceEs:
      "Movilización nerviosa puede ayudar en neuropatía periférica leve (Coppieters & Butler themes; revisiones clínicas).",
    evidenceEn:
      "Nerve gliding may help mild peripheral neuropathy (Coppieters & Butler themes; clinical reviews).",
    aliases: ["nerve glider mediano", "deslizamiento nervioso", "median nerve glide"],
  },
  {
    id: "wrist_hand_flexor_stretch",
    nameEs: "Estiramiento de flexores de muñeca",
    nameEn: "Wrist flexor stretch",
    region: "wrist_hand",
    phase: "protection",
    targetMuscles: "Flexores de muñeca y antebrazo",
    equipment: "Ninguno",
    instructionsEs:
      "Brazo extendido palma arriba. Con la otra mano extiende suavemente la muñeca hacia abajo hasta tensión moderada en palma/antebrazo.",
    instructionsEn:
      "Arm extended palm up. With other hand gently extend wrist downward until moderate tension in palm/forearm.",
    dosageEs: "3 × 30 s, 2 veces/día.",
    dosageEn: "3 × 30 s, 2×/day.",
    progressionEs: "Mayor extensión si no irrita túnel carpiano.",
    progressionEn: "More extension if no carpal tunnel irritation.",
    regressionEs: "Codo flexionado.",
    regressionEn: "Elbow flexed.",
    contraindicationsEs: "Síntomas de túnel carpiano que empeoran con estiramiento.",
    contraindicationsEn: "Carpal tunnel symptoms worsened by stretch.",
    evidenceEs:
      "Estiramiento suave como complemento en dolor de muñeca/mano (guías clínicas mano).",
    evidenceEn:
      "Gentle stretching as adjunct in wrist/hand pain (hand clinical guidelines).",
    aliases: ["estiramiento flexores muñeca", "wrist flexor stretch", "flexores antebrazo"],
  },

  // ── Cervical ──────────────────────────────────────────────────────────────
  {
    id: "cervical_ccft",
    nameEs: "Entrenamiento CCFT cervical",
    nameEn: "Cervical CCFT training",
    region: "cervical",
    phase: "protection",
    targetMuscles: "Flexores cervicales profundos (longus colli/capitis)",
    equipment: "Toalla fina (opcional)",
    instructionsEs:
      "Supino, jalonamiento de barbilla suave sin flexionar cuello superficial. Puedes usar presión de toalla bajo nuca progresivamente.",
    instructionsEn:
      "Supine, gentle chin nod without superficial neck flexion. Optional progressive towel pressure under neck.",
    dosageEs: "3 × 10 holds de 10 s, 2 veces/día.",
    dosageEn: "3 × 10 holds of 10 s, 2×/day.",
    progressionEs: "Presión de toalla graduada o posición sentada.",
    progressionEn: "Graded towel pressure or seated position.",
    regressionEs: "Solo jalonamiento sin presión.",
    regressionEn: "Nod only without pressure.",
    contraindicationsEs: "Vértigo, myelopatía, trauma reciente.",
    contraindicationsEn: "Vertigo, myelopathy, recent trauma.",
    evidenceEs:
      "Programa de flexores profundos mejora dolor y función cervical (Jull et al.; RCT themes).",
    evidenceEn:
      "Deep flexor program improves cervical pain and function (Jull et al.; RCT themes).",
    aliases: ["ccft cervical", "flexores profundos cuello", "cervical deep flexor"],
  },
  {
    id: "cervical_chin_tuck",
    nameEs: "Retracción cervical (chin tuck)",
    nameEn: "Chin tuck",
    region: "cervical",
    phase: "protection",
    targetMuscles: "Flexores profundos, retractores cervicales",
    equipment: "Ninguno",
    instructionsEs:
      "Sentado o de pie, desliza la cabeza hacia atrás como si hicieras una papada, manteniendo la mirada al frente. No inclines la cabeza hacia abajo.",
    instructionsEn:
      "Seated or standing, slide head back as if making a double chin while looking forward. Do not tilt head down.",
    dosageEs: "3 × 10 holds de 5 s, varias veces al día en posturas sedentarias.",
    dosageEn: "3 × 10 holds of 5 s, several times daily during sedentary postures.",
    progressionEs: "Mantener durante trabajo de hombros o en cuadrupedia.",
    progressionEn: "Hold during shoulder work or quadruped.",
    regressionEs: "Rango más pequeño supino.",
    regressionEn: "Smaller range supine.",
    contraindicationsEs: "Dolor con movimiento retrógrado agudo.",
    contraindicationsEn: "Acute pain with retraction.",
    evidenceEs:
      "Ejercicio postural frecuente en cervicalgia mecánica (Kay et al., Cochrane themes).",
    evidenceEn:
      "Common postural exercise in mechanical neck pain (Kay et al., Cochrane themes).",
    aliases: ["chin tuck", "retracción cervical", "papada", "cuello retracción"],
  },
  {
    id: "cervical_thoracic_extension_break",
    nameEs: "Pausa de extensión torácica",
    nameEn: "Thoracic extension break",
    region: "cervical",
    phase: "protection",
    targetMuscles: "Extensores torácicos, movilidad T-spine",
    equipment: "Silla con respaldo bajo o foam roller",
    instructionsEs:
      "Sentado, entrelaza manos tras nuca y extiende suavemente la zona torácica sobre el respaldo o roller. El cuello permanece neutro.",
    instructionsEn:
      "Seated, interlace hands behind head and gently extend thoracic spine over chair back or roller. Neck stays neutral.",
    dosageEs: "8–10 repeticiones cada 1–2 h si trabajo sedentario.",
    dosageEn: "8–10 reps every 1–2 h if sedentary work.",
    progressionEs: "Mayor rango o añadir rotación torácica.",
    progressionEn: "More range or add thoracic rotation.",
    regressionEs: "Extensión más pequeña sin apoyo.",
    regressionEn: "Smaller extension without support.",
    contraindicationsEs: "Osteoporosis severa, dolor torácico no diagnosticado.",
    contraindicationsEn: "Severe osteoporosis, undiagnosed thoracic pain.",
    evidenceEs:
      "Movilidad torácica asociada a mejor patrón cervical en dolor de cuello (Kapreli et al.; temas clínicos).",
    evidenceEn:
      "Thoracic mobility associated with better cervical patterns in neck pain (Kapreli et al.; clinical themes).",
    aliases: ["extensión torácica", "thoracic extension", "pausa postural cuello"],
  },
  {
    id: "cervical_upper_trap_stretch",
    nameEs: "Estiramiento de trapecio superior",
    nameEn: "Upper trapezius stretch",
    region: "cervical",
    phase: "protection",
    targetMuscles: "Trapecio superior",
    equipment: "Ninguno",
    instructionsEs:
      "Inclina la oreja hacia el hombro opuesto. Con la mano del mismo lado puedes ayudar suavemente. Mantén el hombro hacia abajo.",
    instructionsEn:
      "Tilt ear toward opposite shoulder. Same-side hand may assist gently. Keep shoulder down.",
    dosageEs: "3 × 30 s por lado, 1–2 veces/día.",
    dosageEn: "3 × 30 s per side, 1–2×/day.",
    progressionEs: "Solo si no aumenta dolor irradiado.",
    progressionEn: "Only if no increased radiating pain.",
    regressionEs: "Inclinación más pequeña sin asistencia manual.",
    regressionEn: "Smaller tilt without manual assist.",
    contraindicationsEs: "Radiculopatía aguda con estiramiento que empeora parestesias.",
    contraindicationsEn: "Acute radiculopathy worsened by stretch.",
    evidenceEs:
      "Estiramiento suave como parte de programas multimodales cervicales (Cochrane neck pain themes).",
    evidenceEn:
      "Gentle stretching as part of multimodal cervical programs (Cochrane neck pain themes).",
    aliases: ["estiramiento trapecio", "upper trap stretch", "trapecio superior"],
  },
  {
    id: "cervical_deep_neck_extensor_endurance",
    nameEs: "Resistencia de extensores cervicales profundos",
    nameEn: "Deep neck extensor endurance",
    region: "cervical",
    phase: "loading",
    targetMuscles: "Extensores cervicales profundos",
    equipment: "Ninguno (prono o cuadrupedia)",
    instructionsEs:
      "En prono, levanta ligeramente la cabeza manteniendo la mirada al suelo (extensión de upper cervical). Mantén sin encoger hombros.",
    instructionsEn:
      "Prone, lightly lift head keeping gaze toward floor (upper cervical extension). Hold without shrugging.",
    dosageEs: "3 × 10 holds de 10 s. Progresar según tolerancia.",
    dosageEn: "3 × 10 holds of 10 s. Progress per tolerance.",
    progressionEs: "Más tiempo o cuadrupedia con control.",
    progressionEn: "Longer holds or quadruped control.",
    regressionEs: "Supino con jalonamiento solamente.",
    regressionEn: "Supine nod only.",
    contraindicationsEs: "Dolor con extensión cervical aguda.",
    contraindicationsEn: "Acute pain with cervical extension.",
    evidenceEs:
      "Fortalecimiento de extensores incluido en ejercicio cervical multimodal (Blomgren et al.; JOSPT themes).",
    evidenceEn:
      "Extensor strengthening included in multimodal cervical exercise (Blomgren et al.; JOSPT themes).",
    aliases: ["extensores cervicales", "deep neck extensor", "cuello prono"],
  },

  // ── Lumbar ────────────────────────────────────────────────────────────────
  {
    id: "lumbar_mcgill_curl_up",
    nameEs: "Curl-up de McGill",
    nameEn: "McGill curl-up",
    region: "lumbar",
    phase: "loading",
    targetMuscles: "Recto abdominal, estabilizadores lumbares",
    equipment: "Colchoneta",
    instructionsEs:
      "Supino, una rodilla flexionada. Manos bajo la zona lumbar. Eleva ligeramente cabeza y hombros sin redondear la columna baja. Mantén respiración.",
    instructionsEn:
      "Supine, one knee bent. Hands under lower back. Lift head and shoulders slightly without rounding lower spine. Breathe steadily.",
    dosageEs: "3 × 10 holds de 8–10 s. Alternar rodilla flexionada.",
    dosageEn: "3 × 10 holds of 8–10 s. Alternate bent knee.",
    progressionEs: "Más tiempo o piernas extendidas según tolerancia McGill.",
    progressionEn: "Longer holds or extended legs per McGill tolerance.",
    regressionEs: "Solo contracción abdominal isométrica sin elevación.",
    regressionEn: "Abdominal isometric only without lift.",
    contraindicationsEs: "Dolor flexión agudo, postoperatorio según protocolo.",
    contraindicationsEn: "Acute flexion pain, post-op per protocol.",
    evidenceEs:
      "Big Three de McGill ampliamente usado en estabilización lumbar (McGill; temas clínicos lumbares).",
    evidenceEn:
      "McGill Big Three widely used in lumbar stabilization (McGill; lumbar clinical themes).",
    aliases: ["curl up mcgill", "mcgill curl-up", "abdominal mcgill"],
  },
  {
    id: "lumbar_bird_dog",
    nameEs: "Bird dog (cuadrupedia contralateral)",
    nameEn: "Bird dog",
    region: "lumbar",
    phase: "loading",
    targetMuscles: "Multífidos, glúteos, core",
    equipment: "Colchoneta",
    instructionsEs:
      "Cuadrupedia, extiende brazo y pierna contrarios manteniendo cadera nivelada y columna neutra. Vuelve con control.",
    instructionsEn:
      "Quadruped, extend opposite arm and leg keeping hips level and spine neutral. Return with control.",
    dosageEs: "3 × 8–10 por lado, holds de 5–8 s.",
    dosageEn: "3 × 8–10 per side, 5–8 s holds.",
    progressionEs: "Más tiempo o superficie inestable.",
    progressionEn: "Longer holds or unstable surface.",
    regressionEs: "Solo extensión de pierna o brazo.",
    regressionEn: "Leg or arm extension only.",
    contraindicationsEs: "Dolor en extensión lumbar aguda severa.",
    contraindicationsEn: "Severe acute extension pain.",
    evidenceEs:
      "Parte del Big Three de McGill para control lumbopélvico (McGill).",
    evidenceEn:
      "Part of McGill Big Three for lumbopelvic control (McGill).",
    aliases: ["bird dog", "cuadrupedia", "perro pájaro", "quadruped opposite"],
  },
  {
    id: "lumbar_side_plank_regressed",
    nameEs: "Plancha lateral regresada",
    nameEn: "Regressed side plank",
    region: "lumbar",
    phase: "loading",
    targetMuscles: "Oblicuos, cuadrado lumbar, glúteo medio",
    equipment: "Colchoneta",
    instructionsEs:
      "Apoya antebrazo y rodillas (versión regresada). Eleva cadera formando línea recta de rodillas a hombros. Mantén sin rotar tronco.",
    instructionsEn:
      "Forearm and knees supported (regressed). Lift hips forming straight line knees to shoulders. No trunk rotation.",
    dosageEs: "3 × 20–30 s por lado, 1–2 veces/día.",
    dosageEn: "3 × 20–30 s per side, 1–2×/day.",
    progressionEs: "Rodillas extendidas o pies apilados.",
    progressionEn: "Knees extended or feet stacked.",
    regressionEs: "Menos tiempo o apoyo superior en pared.",
    regressionEn: "Shorter hold or top hand on wall.",
    contraindicationsEs: "Dolor lateral agudo, inestabilidad de hombro.",
    contraindicationsEn: "Acute lateral pain, shoulder instability.",
    evidenceEs:
      "Side plank incluido en Big Three McGill para resistencia lateral (McGill).",
    evidenceEn:
      "Side plank in McGill Big Three for lateral endurance (McGill).",
    aliases: ["plancha lateral", "side plank", "plancha rodillas"],
  },
  {
    id: "lumbar_bridge",
    nameEs: "Puente de glúteos (bridge)",
    nameEn: "Glute bridge",
    region: "lumbar",
    phase: "loading",
    targetMuscles: "Glúteo mayor, isquios, estabilizadores lumbares",
    equipment: "Colchoneta",
    instructionsEs:
      "Supino, rodillas flexionadas. Eleva cadera apretando glúteos sin arquear excesivamente la lumbar. Baja con control.",
    instructionsEn:
      "Supine, knees bent. Lift hips squeezing glutes without excessive lumbar arch. Lower with control.",
    dosageEs: "3 × 12–15, RPE 5–6/10.",
    dosageEn: "3 × 12–15, RPE 5–6/10.",
    progressionEs: "Unilateral o banda en rodillas.",
    progressionEn: "Single leg or band at knees.",
    regressionEs: "Rango parcial o holds isométricos cortos.",
    regressionEn: "Partial range or short isometric holds.",
    contraindicationsEs: "Dolor en extensión lumbar agudo.",
    contraindicationsEn: "Acute lumbar extension pain.",
    evidenceEs:
      "Activación glútea en lumbalgia y control pélvico (Cochrane exercise themes; temas clínicos).",
    evidenceEn:
      "Glute activation in low back pain and pelvic control (Cochrane exercise themes; clinical themes).",
    aliases: ["puente", "bridge", "glute bridge lumbar"],
  },
  {
    id: "lumbar_hip_hinge_dowel",
    nameEs: "Bisagra de cadera con palo",
    nameEn: "Hip hinge with dowel",
    region: "lumbar",
    phase: "functional",
    targetMuscles: "Glúteos, isquios, control lumbopélvico",
    equipment: "Palo o escoba",
    instructionsEs:
      "Palo contactando sacro, torácico y occipital. Flexiona cadera empujando glúteos atrás manteniendo los tres contactos.",
    instructionsEn:
      "Dowel touching sacrum, mid-back, and head. Hinge at hips pushing glutes back maintaining three contacts.",
    dosageEs: "3 × 10 repeticiones lentas, aprender patrón antes de carga.",
    dosageEn: "3 × 10 slow reps, learn pattern before load.",
    progressionEs: "Añadir kettlebell muerto rumano ligero.",
    progressionEn: "Add light kettlebell RDL.",
    regressionEs: "Bisagra sentado en banco.",
    regressionEn: "Seated hinge on bench.",
    contraindicationsEs: "Dolor flexión lumbar agudo sin modificar.",
    contraindicationsEn: "Acute flexion pain without modification.",
    evidenceEs:
      "Patrón de bisagra enseñado para proteger columna en levantamiento (McGill; temas ergonómicos).",
    evidenceEn:
      "Hinge pattern taught to protect spine in lifting (McGill; ergonomic themes).",
    aliases: ["bisagra cadera", "hip hinge", "palo dowel", "deadlift pattern"],
  },
  {
    id: "lumbar_cat_camel",
    nameEs: "Gato-camello (cat-camel)",
    nameEn: "Cat-camel",
    region: "lumbar",
    phase: "protection",
    targetMuscles: "Movilidad segmentaria lumbar/torácica",
    equipment: "Colchoneta",
    instructionsEs:
      "Cuadrupedia, alterna flexión y extensión suave de columna sin forzar al final del rango. Movimiento fluido.",
    instructionsEn:
      "Quadruped, alternate gentle spinal flexion and extension without forcing end range. Fluid motion.",
    dosageEs: "2 × 10 repeticiones lentas, 1–2 veces/día.",
    dosageEn: "2 × 10 slow reps, 1–2×/day.",
    progressionEs: "Mayor control segmentario si tolerado.",
    progressionEn: "More segmental control if tolerated.",
    regressionEs: "Rango muy pequeño.",
    regressionEn: "Very small range.",
    contraindicationsEs: "Estenosis con extensión sintomática — modificar rango.",
    contraindicationsEn: "Stenosis with symptomatic extension — modify range.",
    evidenceEs:
      "Movilización suave para reducir rigidez sin agresividad (temas clínicos lumbares).",
    evidenceEn:
      "Gentle mobilization to reduce stiffness non-aggressively (lumbar clinical themes).",
    aliases: ["gato camello", "cat camel", "movilidad lumbar"],
  },
  {
    id: "lumbar_prone_press_up",
    nameEs: "Press-up en prono (estilo McKenzie)",
    nameEn: "Prone press-up (McKenzie style)",
    region: "lumbar",
    phase: "protection",
    targetMuscles: "Extensores lumbares, movilización en extensión",
    equipment: "Colchoneta",
    instructionsEs:
      "Prono, apoya manos bajo hombros y extiende codos dejando que la pelvis permanezca en el suelo. Solo si centraliza o no aumenta dolor.",
    instructionsEn:
      "Prone, hands under shoulders, extend elbows keeping pelvis on floor. Only if pain centralizes or does not increase.",
    dosageEs: "10 repeticiones, cada 2–3 h si indicado clínicamente.",
    dosageEn: "10 reps every 2–3 h if clinically indicated.",
    progressionEs: "Mayor extensión si síntomas periféricos disminuyen.",
    progressionEn: "More extension if peripheral symptoms decrease.",
    regressionEs: "Presión parcial sin extensión completa.",
    regressionEn: "Partial pressure without full extension.",
    contraindicationsEs: "Dolor que se peripheraliza, estenosis extensión-intolerante.",
    contraindicationsEn: "Peripheralizing pain, extension-intolerant stenosis.",
    evidenceEs:
      "Extensión repetida en deriva posterior centralizable (McKenzie/Direction preference themes; Cochrane mixed).",
    evidenceEn:
      "Repeated extension in centralizing posterior derangement (McKenzie/direction preference themes; Cochrane mixed).",
    aliases: ["press up", "mcKenzie", "extensión prono", "prone press up"],
  },
  {
    id: "lumbar_sciatic_slider",
    nameEs: "Deslizamiento ciático (slider)",
    nameEn: "Sciatic nerve slider",
    region: "lumbar",
    phase: "protection",
    targetMuscles: "Movilidad del nervio ciático",
    equipment: "Ninguno",
    instructionsEs:
      "Sentado o supino, extiende rodilla mientras flexionas cuello (o viceversa alternando). Movimiento suave sin estiramiento agresivo.",
    instructionsEn:
      "Seated or supine, extend knee while flexing neck (or alternate). Smooth motion without aggressive stretch.",
    dosageEs: "10–15 repeticiones, 2 veces/día. Sin aumento de dolor > 1 h.",
    dosageEn: "10–15 reps, 2×/day. No pain increase > 1 h.",
    progressionEs: "Más amplitud si tolerado.",
    progressionEn: "More range if tolerated.",
    regressionEs: "Menor extensión de rodilla.",
    regressionEn: "Less knee extension.",
    contraindicationsEs: "Déficit motor agudo, cauda equina.",
    contraindicationsEn: "Acute motor deficit, cauda equina.",
    evidenceEs:
      "Neural mobilization puede ayudar en ciática leve (Cochrane mixed; Butler/Coppieters themes).",
    evidenceEn:
      "Neural mobilization may help mild sciatica (Cochrane mixed; Butler/Coppieters themes).",
    aliases: ["sciatic slider", "deslizamiento ciático", "movilización nerviosa"],
  },
  {
    id: "lumbar_clamshell",
    nameEs: "Clamshell (almeja)",
    nameEn: "Clamshell",
    region: "lumbar",
    phase: "loading",
    targetMuscles: "Glúteo medio, estabilizadores cadera",
    equipment: "Colchoneta, banda opcional",
    instructionsEs:
      "Decúbito lateral, rodillas flexionadas. Abre rodilla superior sin rotar pelvis. Controla el cierre.",
    instructionsEn:
      "Side lying, knees bent. Open top knee without rotating pelvis. Control closing.",
    dosageEs: "3 × 15 por lado, banda ligera opcional.",
    dosageEn: "3 × 15 per side, optional light band.",
    progressionEs: "Banda más resistiva o posición side plank.",
    progressionEn: "More band resistance or side plank position.",
    regressionEs: "Sin banda, rango menor.",
    regressionEn: "No band, smaller range.",
    contraindicationsEs: "Dolor cadera lateral agudo.",
    contraindicationsEn: "Acute lateral hip pain.",
    evidenceEs:
      "Activación glúteo medio en lumbopelvic pain y rodilla (Powers et al.; temas clínicos).",
    evidenceEn:
      "Glute medius activation in lumbopelvic and knee pain (Powers et al.; clinical themes).",
    aliases: ["clamshell", "almeja", "glúteo medio lateral"],
  },
  {
    id: "lumbar_dead_bug",
    nameEs: "Dead bug",
    nameEn: "Dead bug",
    region: "lumbar",
    phase: "loading",
    targetMuscles: "Transverso, recto abdominal, control lumbopélvico",
    equipment: "Colchoneta",
    instructionsEs:
      "Supino, brazos al techo, caderas y rodillas 90°. Baja brazo y pierna contrarios manteniendo lumbar estable. Alterna.",
    instructionsEn:
      "Supine, arms up, hips and knees 90°. Lower opposite arm and leg keeping lumbar stable. Alternate.",
    dosageEs: "3 × 8–10 por lado, movimiento lento.",
    dosageEn: "3 × 8–10 per side, slow movement.",
    progressionEs: "Extensión completa o banda en pies.",
    progressionEn: "Full extension or band on feet.",
    regressionEs: "Solo pierna o brazo; rango parcial.",
    regressionEn: "Leg or arm only; partial range.",
    contraindicationsEs: "Dolor flexión agudo.",
    contraindicationsEn: "Acute flexion pain.",
    evidenceEs:
      "Ejercicios de anti-extensión en programas de core (Escamilla et al.; temas clínicos).",
    evidenceEn:
      "Anti-extension core exercises in clinical programs (Escamilla et al.; clinical themes).",
    aliases: ["dead bug", "bicho muerto", "core supino"],
  },
  {
    id: "lumbar_pallof_press",
    nameEs: "Pallof press anti-rotación",
    nameEn: "Pallof press",
    region: "lumbar",
    phase: "functional",
    targetMuscles: "Oblicuos, transverso, anti-rotación",
    equipment: "Banda anclada lateralmente",
    instructionsEs:
      "De pie perpendicular a la banda, sostén con ambas manos al pecho y empuja al frente resistiendo la rotación del tronco.",
    instructionsEn:
      "Stand perpendicular to band, hold at chest with both hands and press forward resisting trunk rotation.",
    dosageEs: "3 × 10–12 por lado, RPE 6/10.",
    dosageEn: "3 × 10–12 per side, RPE 6/10.",
    progressionEs: "Más resistencia o posición split stance.",
    progressionEn: "More resistance or split stance.",
    regressionEs: "Menos resistencia o holds isométricos.",
    regressionEn: "Less resistance or isometric holds.",
    contraindicationsEs: "Dolor rotación agudo.",
    contraindicationsEn: "Acute rotation pain.",
    evidenceEs:
      "Anti-rotación para transferencia funcional en core training (McGill themes; strength & conditioning literature).",
    evidenceEn:
      "Anti-rotation for functional transfer in core training (McGill themes; S&C literature).",
    aliases: ["pallof", "pallof press", "anti rotación", "anti-rotation"],
  },
  {
    id: "lumbar_graded_walking",
    nameEs: "Caminata graduada",
    nameEn: "Graded walking",
    region: "lumbar",
    phase: "functional",
    targetMuscles: "Global, tolerancia a carga axial",
    equipment: "Calzado cómodo",
    instructionsEs:
      "Camina a ritmo cómodo en superficie plana. Aumenta tiempo o distancia gradualmente según respuesta de dolor en 24 h.",
    instructionsEn:
      "Walk at comfortable pace on flat surface. Gradually increase time or distance per 24 h pain response.",
    dosageEs: "Empezar 10–15 min, progresar 10–20% semanal si tolerado.",
    dosageEn: "Start 10–15 min, progress 10–20% weekly if tolerated.",
    progressionEs: "Más distancia, ritmo o terreno variable.",
    progressionEn: "More distance, pace, or varied terrain.",
    regressionEs: "Intervalos cortos con pausas.",
    regressionEn: "Short intervals with rests.",
    contraindicationsEs: "Claudicación neurogénica severa sin valoración.",
    contraindicationsEn: "Severe neurogenic claudication without assessment.",
    evidenceEs:
      "Actividad aeróbica graduada recomendada en lumbalgia (Cochrane exercise for LBP themes).",
    evidenceEn:
      "Graded aerobic activity recommended in low back pain (Cochrane exercise for LBP themes).",
    aliases: ["caminata", "walking", "marcha graduada", "graded walking"],
  },

  // ── Hip ───────────────────────────────────────────────────────────────────
  {
    id: "hip_glute_bridge",
    nameEs: "Puente de glúteos",
    nameEn: "Glute bridge",
    region: "hip",
    phase: "loading",
    targetMuscles: "Glúteo mayor, isquiotibiales",
    equipment: "Colchoneta",
    instructionsEs:
      "Supino, empuja talones al suelo y eleva cadera contrayendo glúteos. Evita compensar con lumbar.",
    instructionsEn:
      "Supine, drive heels into floor and lift hips squeezing glutes. Avoid compensating with lumbar spine.",
    dosageEs: "3 × 12–15, pausa 2 s arriba.",
    dosageEn: "3 × 12–15, 2 s pause at top.",
    progressionEs: "Puente monopodal o banda.",
    progressionEn: "Single-leg bridge or band.",
    regressionEs: "Rango parcial.",
    regressionEn: "Partial range.",
    contraindicationsEs: "Dolor agudo en extensión cadera sin modificar.",
    contraindicationsEn: "Acute hip extension pain without modification.",
    evidenceEs:
      "Fortalecimiento glúteo en dolor hip/lumbopélvico (Cochrane; temas glúteo y rodilla).",
    evidenceEn:
      "Glute strengthening in hip/lumbopelvic pain (Cochrane; glute-knee themes).",
    aliases: ["puente glúteo", "hip bridge", "glute bridge hip"],
  },
  {
    id: "hip_sidelying_abduction",
    nameEs: "Abducción cadera en decúbito lateral",
    nameEn: "Sidelying hip abduction",
    region: "hip",
    phase: "loading",
    targetMuscles: "Glúteo medio",
    equipment: "Colchoneta, banda opcional",
    instructionsEs:
      "De lado, pierna superior recta. Eleva la pierna hacia el techo sin inclinar pelvis hacia atrás.",
    instructionsEn:
      "Side lying, top leg straight. Lift leg toward ceiling without rolling pelvis backward.",
    dosageEs: "3 × 15 por lado, RPE 5–6/10.",
    dosageEn: "3 × 15 per side, RPE 5–6/10.",
    progressionEs: "Banda o holds de 3 s arriba.",
    progressionEn: "Band or 3 s holds at top.",
    regressionEs: "Flexión de rodilla (clam) o rango menor.",
    regressionEn: "Knee bent (clam) or smaller range.",
    contraindicationsEs: "Trocanteritis aguda severa — ajustar rango.",
    contraindicationsEn: "Severe acute trochanteric pain — adjust range.",
    evidenceEs:
      "Glúteo medio en síndrome patelofemoral y cadera (Powers et al.; temas JOSPT).",
    evidenceEn:
      "Glute medius in patellofemoral and hip syndromes (Powers et al.; JOSPT themes).",
    aliases: ["abducción cadera", "hip abduction", "glúteo medio", "sidelying abduction"],
  },
  {
    id: "hip_hitch",
    nameEs: "Hip hitch (elevación pélvica lateral)",
    nameEn: "Hip hitch",
    region: "hip",
    phase: "functional",
    targetMuscles: "Glúteo medio, estabilizadores pélvicos",
    equipment: "Escalón bajo",
    instructionsEs:
      "De pie sobre un pie en escalón, baja el borde de la pelvis del lado libre y luego eleva la cadera hacia arriba usando glúteo de la pierna de apoyo.",
    instructionsEn:
      "Stand on one foot on step, drop free-side pelvis edge then hike hip up using stance-side glute.",
    dosageEs: "3 × 10–12 por lado, controlado.",
    dosageEn: "3 × 10–12 per side, controlled.",
    progressionEs: "Sin apoyo manual, más altura de escalón.",
    progressionEn: "No hand support, higher step.",
    regressionEs: "Sin escalón, movimiento más pequeño.",
    regressionEn: "No step, smaller movement.",
    contraindicationsEs: "Dolor carga monopodal agudo.",
    contraindicationsEn: "Acute single-leg loading pain.",
    evidenceEs:
      "Ejercicio funcional para control pélvico en marcha (temas clínicos cadera/rehab).",
    evidenceEn:
      "Functional exercise for pelvic control in gait (hip/rehab clinical themes).",
    aliases: ["hip hitch", "elevación pélvica", "pelvic drop"],
  },
  {
    id: "hip_short_foot",
    nameEs: "Short foot (pie corto)",
    nameEn: "Short foot exercise",
    region: "hip",
    phase: "loading",
    targetMuscles: "Intrínsecos pie, cadena posterior",
    equipment: "Ninguno",
    instructionsEs:
      "De pie, acorta el pie activando el arco sin flexionar dedos. Mantén 5–10 s y relaja.",
    instructionsEn:
      "Standing, shorten foot by activating arch without curling toes. Hold 5–10 s and relax.",
    dosageEs: "3 × 10 holds, integrar en apoyo monopodal.",
    dosageEn: "3 × 10 holds, integrate in single-leg stance.",
    progressionEs: "En single leg stance o sentadilla parcial.",
    progressionEn: "During single-leg stance or partial squat.",
    regressionEs: "Sentado o apoyado en pared.",
    regressionEn: "Seated or wall supported.",
    contraindicationsEs: "Dolor plantar agudo severo.",
    contraindicationsEn: "Severe acute plantar pain.",
    evidenceEs:
      "Activación intrínseca pie en control de arco y cadera (McKeon et al.; temas foot core).",
    evidenceEn:
      "Foot intrinsic activation in arch and hip control (McKeon et al.; foot core themes).",
    aliases: ["short foot", "pie corto", "arco pie"],
  },
  {
    id: "hip_copenhagen_short_lever",
    nameEs: "Copenhagen aducción (palanca corta)",
    nameEn: "Copenhagen adduction (short lever)",
    region: "hip",
    phase: "loading",
    targetMuscles: "Aductores, estabilizadores cadera",
    equipment: "Banco o cama",
    instructionsEs:
      "Decúbito lateral, pierna superior sobre banco a la altura rodilla. Eleva pelvis y mantén alineación. Empieza con apoyo cerca de rodilla (palanca corta).",
    instructionsEn:
      "Side lying, top leg on bench at knee height. Lift pelvis and maintain alignment. Start with support near knee (short lever).",
    dosageEs: "3 × 8–10 holds de 5 s, progresar gradualmente.",
    dosageEn: "3 × 8–10 holds of 5 s, progress gradually.",
    progressionEs: "Palanca larga (tobillo en banco).",
    progressionEn: "Long lever (ankle on bench).",
    regressionEs: "Isométrico side-lying adduction sin elevación pélvica.",
    regressionEn: "Side-lying adduction isometric without pelvic lift.",
    contraindicationsEs: "Dolor inguinal agudo, pubalgia no valorada.",
    contraindicationsEn: "Acute groin pain, unassessed pubalgia.",
    evidenceEs:
      "Programa Copenhagen reduce incidencia aductores en deportes (Harøy et al.; estudio Copenhagen themes).",
    evidenceEn:
      "Copenhagen program reduces adductor injury incidence in sport (Harøy et al.; Copenhagen study themes).",
    aliases: ["copenhagen", "copenhagen adduction", "aducción cadera"],
  },
  {
    id: "hip_flexor_stretch",
    nameEs: "Estiramiento de flexores de cadera",
    nameEn: "Hip flexor stretch",
    region: "hip",
    phase: "protection",
    targetMuscles: "Iliopsoas, recto femoral",
    equipment: "Ninguno",
    instructionsEs:
      "Estocada suave, retroversión pélvica y empuja cadera hacia adelante hasta tensión anterior moderada. No arquees lumbar.",
    instructionsEn:
      "Gentle lunge, posterior pelvic tilt, push hip forward until moderate anterior tension. Do not arch low back.",
    dosageEs: "3 × 30 s por lado.",
    dosageEn: "3 × 30 s per side.",
    progressionEs: "Mayor extensión cadera si tolerado.",
    progressionEn: "More hip extension if tolerated.",
    regressionEs: "Estocada corta o estiramiento supino rodilla al pecho opuesto.",
    regressionEn: "Short lunge or supine knee-to-opposite-chest.",
    contraindicationsEs: "Dolor anterior cadera que empeora.",
    contraindicationsEn: "Anterior hip pain that worsens.",
    evidenceEs:
      "Movilidad flexores como complemento en dolor lumbar y cadera (temas clínicos).",
    evidenceEn:
      "Hip flexor mobility as adjunct in low back and hip pain (clinical themes).",
    aliases: ["estiramiento flexores cadera", "hip flexor stretch", "psoas stretch"],
  },
  {
    id: "hip_faber_stretch",
    nameEs: "Estiramiento FABER suave",
    nameEn: "Gentle FABER stretch",
    region: "hip",
    phase: "protection",
    targetMuscles: "Rotadores cadera, glúteos",
    equipment: "Colchoneta",
    instructionsEs:
      "Supino, tobillo sobre rodilla contraria. Lleva suavemente la rodilla hacia el pecho opuesto hasta tensión moderada en glúteo.",
    instructionsEn:
      "Supine, ankle on opposite knee. Gently draw knee toward opposite chest until moderate glute stretch.",
    dosageEs: "3 × 30 s por lado, sin dolor > 4/10.",
    dosageEn: "3 × 30 s per side, pain not > 4/10.",
    progressionEs: "Mayor flexión si no irrita.",
    progressionEn: "More flexion if not irritating.",
    regressionEs: "Figura-4 con apoyo en suelo sin tracción.",
    regressionEn: "Figure-4 supported on floor without pull.",
    contraindicationsEs: "Impingement anterior agudo, labrum sintomático.",
    contraindicationsEn: "Acute anterior impingement, symptomatic labrum.",
    evidenceEs:
      "Estiramiento suave en rigidez cadera postural (guías clínicas cadera).",
    evidenceEn:
      "Gentle stretch for postural hip stiffness (hip clinical guidelines).",
    aliases: ["faber", "figura 4", "figure 4 stretch", "glúteo estiramiento"],
  },
  {
    id: "hip_single_leg_stance",
    nameEs: "Apoyo monopodal",
    nameEn: "Single-leg stance",
    region: "hip",
    phase: "functional",
    targetMuscles: "Glúteo medio/menor, estabilizadores tobillo",
    equipment: "Ninguno",
    instructionsEs:
      "De pie sobre una pierna, mantén pelvis nivelada y rodilla suavemente flexionada. Fija la mirada en un punto estable.",
    instructionsEn:
      "Stand on one leg, keep pelvis level and knee softly bent. Fix gaze on stable point.",
    dosageEs: "3 × 20–30 s por pierna, progresar a ojos cerrados si seguro.",
    dosageEn: "3 × 20–30 s per leg, progress to eyes closed if safe.",
    progressionEs: "Superficie blanda o inclinaciones de tronco.",
    progressionEn: "Soft surface or trunk leans.",
    regressionEs: "Apoyo dedos de mano en pared.",
    regressionEn: "Finger touch on wall.",
    contraindicationsEs: "Inestabilidad caídas reciente.",
    contraindicationsEn: "Recent fall instability.",
    evidenceEs:
      "Entrenamiento equilibrio en rehabilitación cadera/rodilla (Cochrane balance themes).",
    evidenceEn:
      "Balance training in hip/knee rehabilitation (Cochrane balance themes).",
    aliases: ["monopodal", "single leg stance", "equilibrio una pierna"],
  },

  // ── Knee ──────────────────────────────────────────────────────────────────
  {
    id: "knee_quad_set_tke",
    nameEs: "Contracción cuádriceps / TKE",
    nameEn: "Quad set / terminal knee extension",
    region: "knee",
    phase: "protection",
    targetMuscles: "Cuádriceps (VMO)",
    equipment: "Toalla enrollada opcional",
    instructionsEs:
      "Sentado o supino, extiende rodilla presionando parte posterior contra toalla o suelo. Mantén contracción 5–10 s.",
    instructionsEn:
      "Seated or supine, extend knee pressing back of knee into towel or floor. Hold contraction 5–10 s.",
    dosageEs: "3 × 10–15 holds, varias veces al día post-agudo.",
    dosageEn: "3 × 10–15 holds, several times daily post-acute.",
    progressionEs: "TKE sentado con banda o extensión resistida.",
    progressionEn: "Seated TKE with band or resisted extension.",
    regressionEs: "Contracción isométrica sin extensión completa.",
    regressionEn: "Isometric without full extension.",
    contraindicationsEs: "Artrofibrosis con extensión bloqueada — valoración médica.",
    contraindicationsEn: "Extension block from arthrofibrosis — medical review.",
    evidenceEs:
      "Activación temprana cuádriceps post-lesión rodilla (temas ACL/ACL rehab JOSPT).",
    evidenceEn:
      "Early quad activation post knee injury (ACL rehab JOSPT themes).",
    aliases: ["quad set", "tke", "terminal knee extension", "cuádriceps isométrico"],
  },
  {
    id: "knee_spanish_squat_isometric",
    nameEs: "Sentadilla española isométrica",
    nameEn: "Spanish squat isometric",
    region: "knee",
    phase: "loading",
    targetMuscles: "Cuádriceps, tendón rotuliano",
    equipment: "Cinta anclada a altura rodilla",
    instructionsEs:
      "Cinta detrás rodillas, inclínate hacia atrás en sentadilla con torso vertical. Mantén posición sin dolor excesivo en tendón.",
    instructionsEn:
      "Band behind knees, lean back into squat with upright torso. Hold without excessive tendon pain.",
    dosageEs: "4–5 × 30–45 s, RPE 6–7/10.",
    dosageEn: "4–5 × 30–45 s, RPE 6–7/10.",
    progressionEs: "Más tiempo o sentadilla isotónica asistida.",
    progressionEn: "Longer holds or assisted isotonic squat.",
    regressionEs: "Menor inclinación o holds más cortos.",
    regressionEn: "Less lean or shorter holds.",
    contraindicationsEs: "Tendinopatía rotuliana aguda muy irritable sin graduar.",
    contraindicationsEn: "Highly irritable acute patellar tendinopathy without grading.",
    evidenceEs:
      "Isométricos/isotónicos de cuádriceps en tendinopatía rotuliana (Rio et al.; patellar tendinopathy themes).",
    evidenceEn:
      "Quad isometrics/isotonics in patellar tendinopathy (Rio et al.; patellar tendinopathy themes).",
    aliases: ["spanish squat", "sentadilla española", "isométrico rodilla"],
  },
  {
    id: "knee_heel_raise_straight_bent",
    nameEs: "Elevación de talones recta y flexionada",
    nameEn: "Straight- and bent-knee heel raises",
    region: "knee",
    phase: "loading",
    targetMuscles: "Gastrocnemio, sóleo",
    equipment: "Escalón opcional",
    instructionsEs:
      "Realiza elevaciones de talón con rodilla recta y otra serie con rodilla flexionada 20–30° para cargar sóleo.",
    instructionsEn:
      "Perform heel raises with knee straight and another set with knee bent 20–30° to load soleus.",
    dosageEs: "3 × 12–15 cada variante, progresión bilateral a unilateral.",
    dosageEn: "3 × 12–15 each variant, bilateral to unilateral progression.",
    progressionEs: "Unilateral, peso adicional.",
    progressionEn: "Single leg, added load.",
    regressionEs: "Bilateral con apoyo dedos.",
    regressionEn: "Bilateral with finger support.",
    contraindicationsEs: "Ruptura Aquiles aguda.",
    contraindicationsEn: "Acute Achilles rupture.",
    evidenceEs:
      "Fortalecimiento pantorrilla en tendinopatía Aquiles y rodilla (Alfredson themes; calf loading).",
    evidenceEn:
      "Calf strengthening in Achilles and knee tendinopathy (Alfredson themes; calf loading).",
    aliases: ["heel raise", "elevación talones", "calf raise knee", "sóleo"],
  },
  {
    id: "knee_terminal_extension",
    nameEs: "Extensión terminal de rodilla",
    nameEn: "Terminal knee extension",
    region: "knee",
    phase: "loading",
    targetMuscles: "Cuádriceps",
    equipment: "Banda elástica",
    instructionsEs:
      "Banda detrás de rodilla anclada al frente. Extiende rodilla contra resistencia en últimos grados de extensión.",
    instructionsEn:
      "Band behind knee anchored in front. Extend knee against resistance in final degrees of extension.",
    dosageEs: "3 × 12–15, banda ligera-media.",
    dosageEn: "3 × 12–15, light-medium band.",
    progressionEs: "Más resistencia o step-down.",
    progressionEn: "More resistance or step-down.",
    regressionEs: "Quad set sin banda.",
    regressionEn: "Quad set without band.",
    contraindicationsEs: "Dolor patelofemoral severo en extensión final.",
    contraindicationsEn: "Severe patellofemoral pain in terminal extension.",
    evidenceEs:
      "TKE clásico en rehab ACL y dolor anterior rodilla (temas JOSPT).",
    evidenceEn:
      "Classic TKE in ACL rehab and anterior knee pain (JOSPT themes).",
    aliases: ["tke banda", "terminal extension", "extensión terminal"],
  },
  {
    id: "knee_sit_to_stand",
    nameEs: "Sentarse-levantarse",
    nameEn: "Sit-to-stand",
    region: "knee",
    phase: "functional",
    targetMuscles: "Cuádriceps, glúteos",
    equipment: "Silla estándar",
    instructionsEs:
      "Desde silla, levántate sin impulso de brazos si posible. Controla la bajada en 3 segundos.",
    instructionsEn:
      "From chair, stand without arm push if possible. Control descent over 3 seconds.",
    dosageEs: "3 × 10, altura silla según tolerancia.",
    dosageEn: "3 × 10, chair height per tolerance.",
    progressionEs: "Silla más baja o una sola pierna asistida.",
    progressionEn: "Lower chair or assisted single leg.",
    regressionEs: "Silla alta o apoyo de brazos.",
    regressionEn: "High chair or arm support.",
    contraindicationsEs: "Dolor agudo sin extensión suficiente.",
    contraindicationsEn: "Acute pain without sufficient extension.",
    evidenceEs:
      "Ejercicio funcional cuádriceps en OA rodilla y post-op (Cochrane OA knee themes).",
    evidenceEn:
      "Functional quad exercise in knee OA and post-op (Cochrane OA knee themes).",
    aliases: ["sit to stand", "sentarse levantarse", "chair rise"],
  },
  {
    id: "knee_step_down",
    nameEs: "Step-down controlado",
    nameEn: "Controlled step-down",
    region: "knee",
    phase: "functional",
    targetMuscles: "Cuádriceps excéntrico, glúteo medio",
    equipment: "Escalón 15–20 cm",
    instructionsEs:
      "De pie en escalón, baja lentamente el talón al suelo controlando rodilla alineada sobre 2.º–3.er dedo del pie.",
    instructionsEn:
      "Stand on step, slowly lower heel to floor controlling knee aligned over 2nd–3rd toe.",
    dosageEs: "3 × 8–10 por pierna.",
    dosageEn: "3 × 8–10 per leg.",
    progressionEs: "Escalón más alto o peso.",
    progressionEn: "Higher step or load.",
    regressionEs: "Escalón más bajo o apoyo parcial.",
    regressionEn: "Lower step or partial support.",
    contraindicationsEs: "Dolor PF agudo con carga excéntrica.",
    contraindicationsEn: "Acute PF pain with eccentric load.",
    evidenceEs:
      "Control excéntrico en síndrome patelofemoral (Powers et al.; temas JOSPT).",
    evidenceEn:
      "Eccentric control in patellofemoral syndrome (Powers et al.; JOSPT themes).",
    aliases: ["step down", "bajada escalón", "excéntrico rodilla"],
  },
  {
    id: "knee_nordic_assisted",
    nameEs: "Nórdico asistido",
    nameEn: "Assisted Nordic hamstring curl",
    region: "knee",
    phase: "loading",
    targetMuscles: "Isquiotibiales",
    equipment: "Compañero o anclaje rodillas",
    instructionsEs:
      "Rodillas ancladas, inclínate hacia adelante desde rodillas con manos listas para asistir. Controla descenso excéntrico.",
    instructionsEn:
      "Knees anchored, lean forward from knees with hands ready to assist. Control eccentric descent.",
    dosageEs: "3 × 5–8 repeticiones asistidas, 2 veces/semana.",
    dosageEn: "3 × 5–8 assisted reps, 2×/week.",
    progressionEs: "Menos asistencia de manos.",
    progressionEn: "Less hand assistance.",
    regressionEs: "Rango parcial con banda de asistencia.",
    regressionEn: "Partial range with assist band.",
    contraindicationsEs: "Distensión isquio aguda, dolor popliteo.",
    contraindicationsEn: "Acute hamstring strain, popliteal pain.",
    evidenceEs:
      "Nórdico reduce lesiones isquios en deportes (van der Horst et al.; Nordic hamstring themes).",
    evidenceEn:
      "Nordic reduces hamstring injuries in sport (van der Horst et al.; Nordic hamstring themes).",
    aliases: ["nordic", "nórdico", "nordic hamstring", "isquios excéntrico"],
  },
  {
    id: "knee_single_leg_balance",
    nameEs: "Equilibrio monopodal rodilla",
    nameEn: "Single-leg balance (knee)",
    region: "knee",
    phase: "functional",
    targetMuscles: "Propriocepción, cuádriceps, estabilizadores",
    equipment: "Ninguno",
    instructionsEs:
      "Apoya en pierna afectada, microflexión de rodilla. Mantén equilibrio sin valgo dinámico.",
    instructionsEn:
      "Stand on affected leg, slight knee bend. Maintain balance without dynamic valgus.",
    dosageEs: "3 × 30 s, progresar superficie inestable.",
    dosageEn: "3 × 30 s, progress unstable surface.",
    progressionEs: "Foam pad o lanzar/coger pelota.",
    progressionEn: "Foam pad or ball toss/catch.",
    regressionEs: "Apoyo dedos en pared.",
    regressionEn: "Finger wall support.",
    contraindicationsEs: "Inestabilidad ligamentaria aguda no tratada.",
    contraindicationsEn: "Untreated acute ligament instability.",
    evidenceEs:
      "Entrenamiento equilibrio post-lesión rodilla (Cochrane ACL/balance themes).",
    evidenceEn:
      "Balance training post knee injury (Cochrane ACL/balance themes).",
    aliases: ["equilibrio rodilla", "single leg balance knee", "propriocepción rodilla"],
  },
  {
    id: "knee_patellar_isometric_wall_sit",
    nameEs: "Wall sit superficial (isométrico rotuliano)",
    nameEn: "Shallow wall sit (patellar isometric)",
    region: "knee",
    phase: "loading",
    targetMuscles: "Cuádriceps, tendón rotuliano",
    equipment: "Pared",
    instructionsEs:
      "Espalda en pared, desliza solo hasta 30–45° de flexión de rodilla. Mantén sin dolor > 4/10 en tendón.",
    instructionsEn:
      "Back on wall, slide to only 30–45° knee flexion. Hold with tendon pain not > 4/10.",
    dosageEs: "4 × 30–45 s, RPE 6/10.",
    dosageEn: "4 × 30–45 s, RPE 6/10.",
    progressionEs: "Mayor ángulo o single leg parcial.",
    progressionEn: "Greater angle or partial single leg.",
    regressionEs: "Mayor ángulo (más alto) o holds cortos.",
    regressionEn: "Higher position (less flexion) or short holds.",
    contraindicationsEs: "Tendinopatía rotuliana muy irritable.",
    contraindicationsEn: "Highly irritable patellar tendinopathy.",
    evidenceEs:
      "Isométricos en tendinopatía rotuliana (Rio et al.; loading themes).",
    evidenceEn:
      "Isometrics in patellar tendinopathy (Rio et al.; loading themes).",
    aliases: ["wall sit", "sentadilla pared", "isométrico rotuliano", "patellar isometric"],
  },

  // ── Ankle / foot ──────────────────────────────────────────────────────────
  {
    id: "ankle_alphabet",
    nameEs: "Alfabeto de tobillo",
    nameEn: "Ankle alphabet",
    region: "ankle",
    phase: "protection",
    targetMuscles: "Movilidad tobillo, intrínsecos",
    equipment: "Ninguno",
    instructionsEs:
      "Sentado, dibuja letras del alfabeto con la punta del pie. Movimiento suave en todos los planos.",
    instructionsEn:
      "Seated, trace alphabet letters with foot tip. Smooth movement in all planes.",
    dosageEs: "1–2 series alfabeto completo, 3–4 veces/día post-esguince.",
    dosageEn: "1–2 full alphabet sets, 3–4×/day post-sprain.",
    progressionEs: "Con ligera resistencia de banda.",
    progressionEn: "With light band resistance.",
    regressionEs: "Solo mitad del alfabeto.",
    regressionEn: "Half alphabet only.",
    contraindicationsEs: "Fractura no consolidada, dolor agudo sin valorar.",
    contraindicationsEn: "Unhealed fracture, unassessed acute pain.",
    evidenceEs:
      "Movilización temprana en esguince lateral tobillo (Cochrane ankle sprain themes).",
    evidenceEn:
      "Early mobilization in lateral ankle sprain (Cochrane ankle sprain themes).",
    aliases: ["alfabeto tobillo", "ankle alphabet", "movilidad tobillo"],
  },
  {
    id: "ankle_band_eversion",
    nameEs: "Eversión con banda",
    nameEn: "Band eversion",
    region: "ankle",
    phase: "loading",
    targetMuscles: "Peroneos",
    equipment: "Banda elástica",
    instructionsEs:
      "Banda fijada lateralmente, pie en inversión. Rota el pie hacia fuera contra la banda. Controla vuelta.",
    instructionsEn:
      "Band fixed laterally, foot in inversion. Rotate foot outward against band. Control return.",
    dosageEs: "3 × 15, banda ligera progresiva.",
    dosageEn: "3 × 15, progressive light band.",
    progressionEs: "Más resistencia o apoyo monopodal.",
    progressionEn: "More resistance or single-leg stance.",
    regressionEs: "Sin banda, eversión activa.",
    regressionEn: "No band, active eversion.",
    contraindicationsEs: "Dolor agudo lateral tobillo sin valoración.",
    contraindicationsEn: "Acute lateral ankle pain without assessment.",
    evidenceEs:
      "Fortalecimiento peroneo en prevención esguince (Cochrane/brace+exercise themes).",
    evidenceEn:
      "Peroneal strengthening in sprain prevention (Cochrane/brace+exercise themes).",
    aliases: ["eversión banda", "band eversion", "peroneos", "eversion ankle"],
  },
  {
    id: "ankle_calf_raise",
    nameEs: "Elevación de talones",
    nameEn: "Calf raise",
    region: "ankle",
    phase: "loading",
    targetMuscles: "Gastrocnemio, sóleo",
    equipment: "Escalón opcional",
    instructionsEs:
      "De pie, eleva talones lo más alto posible y baja con control. Puedes usar apoyo ligero al inicio.",
    instructionsEn:
      "Standing, rise onto toes as high as possible and lower with control. Light support OK initially.",
    dosageEs: "3 × 12–15 bilateral, progresar unilateral.",
    dosageEn: "3 × 12–15 bilateral, progress to unilateral.",
    progressionEs: "Unilateral, peso, rango en escalón.",
    progressionEn: "Single leg, load, off step range.",
    regressionEs: "Bilateral con apoyo dedos.",
    regressionEn: "Bilateral with finger support.",
    contraindicationsEs: "Ruptura Aquiles aguda.",
    contraindicationsEn: "Acute Achilles rupture.",
    evidenceEs:
      "Progresión excéntrica/concentrica en tendinopatía Aquiles (Alfredson protocol themes).",
    evidenceEn:
      "Eccentric/concentric progression in Achilles tendinopathy (Alfredson protocol themes).",
    aliases: ["calf raise", "elevación talones", "gemelos", "talones"],
  },
  {
    id: "foot_short_foot",
    nameEs: "Short foot (pie corto)",
    nameEn: "Short foot",
    region: "foot",
    phase: "loading",
    targetMuscles: "Intrínsecos del pie",
    equipment: "Ninguno",
    instructionsEs:
      "De pie, acorta el pie levantando el arco sin arrugar dedos. Mantén 5–10 s.",
    instructionsEn:
      "Standing, shorten foot lifting arch without curling toes. Hold 5–10 s.",
    dosageEs: "3 × 10 holds, 2 veces/día.",
    dosageEn: "3 × 10 holds, 2×/day.",
    progressionEs: "Durante equilibrio o marcha.",
    progressionEn: "During balance or walking.",
    regressionEs: "Sentado.",
    regressionEn: "Seated.",
    contraindicationsEs: "Fascitis plantar aguda muy irritable.",
    contraindicationsEn: "Highly irritable acute plantar fasciitis.",
    evidenceEs:
      "Foot core training para arco y función (McKeon et al.).",
    evidenceEn:
      "Foot core training for arch and function (McKeon et al.).",
    aliases: ["short foot pie", "pie corto foot", "intrínsecos pie"],
  },
  {
    id: "foot_windlass_stretch",
    nameEs: "Estiramiento windlass suave",
    nameEn: "Gentle windlass stretch",
    region: "foot",
    phase: "protection",
    targetMuscles: "Fascia plantar, flexores dedos",
    equipment: "Toalla o escalón",
    instructionsEs:
      "Sentado, toalla bajo dedos y tira suavemente mientras extiendes rodilla. O escalón con talón colgando y big toe en borde — suave.",
    instructionsEn:
      "Seated, towel under toes and pull gently while extending knee. Or step with heel off edge and big toe on edge — gently.",
    dosageEs: "3 × 30 s, 2 veces/día. Sin dolor agudo.",
    dosageEn: "3 × 30 s, 2×/day. No sharp pain.",
    progressionEs: "Mayor extensión MTP si tolerado.",
    progressionEn: "More MTP extension if tolerated.",
    regressionEs: "Estiramiento sentado solo con toalla.",
    regressionEn: "Seated towel stretch only.",
    contraindicationsEs: "Dolor plantar severo matutino sin graduar.",
    contraindicationsEn: "Severe ungraded morning plantar pain.",
    evidenceEs:
      "Estiramiento fascia plantar componente habitual en fascitis (Cochrane/plantar fasciitis themes).",
    evidenceEn:
      "Plantar fascia stretch common component in fasciitis care (Cochrane/plantar fasciitis themes).",
    aliases: ["windlass", "fascia plantar estiramiento", "plantar stretch"],
  },
  {
    id: "foot_marble_pickups",
    nameEs: "Recogida de canicas",
    nameEn: "Marble pickups",
    region: "foot",
    phase: "functional",
    targetMuscles: "Flexores dedos, intrínsecos",
    equipment: "Canicas o tapones",
    instructionsEs:
      "Sentado, recoge canicas con los dedos del pie y suéltalas en un vaso. Alterna pies.",
    instructionsEn:
      "Seated, pick up marbles with toes and drop in cup. Alternate feet.",
    dosageEs: "2 × 10–15 recogidas por pie.",
    dosageEn: "2 × 10–15 pickups per foot.",
    progressionEs: "De pie o ojos cerrados.",
    progressionEn: "Standing or eyes closed.",
    regressionEs: "Toalla scrunch en suelo.",
    regressionEn: "Towel scrunch on floor.",
    contraindicationsEs: "Herida o úlcera en pie.",
    contraindicationsEn: "Foot wound or ulcer.",
    evidenceEs:
      "Ejercicios intrínsecos en pie plano y rehab pie (temas clínicos podología).",
    evidenceEn:
      "Intrinsic exercises in flat foot and foot rehab (podiatry clinical themes).",
    aliases: ["marbles", "canicas pie", "marble pickups", "dedos pie"],
  },
  {
    id: "ankle_balance_foam",
    nameEs: "Equilibrio en foam (opcional)",
    nameEn: "Balance on foam (optional)",
    region: "ankle",
    phase: "functional",
    targetMuscles: "Propriocepción tobillo, peroneos",
    equipment: "Almohadilla foam/balance pad",
    instructionsEs:
      "De pie sobre foam en dos piernas y luego una. Mantén equilibrio con rodilla blanda.",
    instructionsEn:
      "Stand on foam on two legs then one. Maintain balance with soft knee.",
    dosageEs: "3 × 30 s monopodal cuando bilateral dominado.",
    dosageEn: "3 × 30 s single leg when bilateral mastered.",
    progressionEs: "Ojos cerrados o inclinaciones cabeza.",
    progressionEn: "Eyes closed or head movements.",
    regressionEs: "Bilateral en suelo firme.",
    regressionEn: "Bilateral on firm ground.",
    contraindicationsEs: "Riesgo caídas alto.",
    contraindicationsEn: "High fall risk.",
    evidenceEs:
      "Entrenamiento propioceptivo post-esguince (Cochrane ankle rehabilitation themes).",
    evidenceEn:
      "Proprioceptive training post-sprain (Cochrane ankle rehabilitation themes).",
    aliases: ["foam balance", "equilibrio foam", "propriocepción tobillo"],
  },
  {
    id: "ankle_hop_prep_bilateral",
    nameEs: "Preparación de saltos bilaterales",
    nameEn: "Bilateral hop preparation",
    region: "ankle",
    phase: "return_to_sport",
    targetMuscles: "Cadena posterior, propulsión",
    equipment: "Ninguno",
    instructionsEs:
      "Saltos suaves en el sitio con aterrizaje silencioso y rodillas alineadas. Progresión de intensidad según tolerancia.",
    instructionsEn:
      "Gentle in-place hops with quiet landing and aligned knees. Progress intensity per tolerance.",
    dosageEs: "3 × 10 saltos bajos, solo si caminar y calf raises sin dolor.",
    dosageEn: "3 × 10 low hops, only if walking and calf raises pain-free.",
    progressionEs: "Saltos forward/lateral, mayor altura.",
    progressionEn: "Forward/lateral hops, more height.",
    regressionEs: "Saltos asistidos con agarre o sin despegue completo.",
    regressionEn: "Assisted hops or without full takeoff.",
    contraindicationsEs: "Esguince agudo, fractura por estrés.",
    contraindicationsEn: "Acute sprain, stress fracture.",
    evidenceEs:
      "Plyometría graduada en return-to-sport tobillo (temas RTS y esguince).",
    evidenceEn:
      "Graded plyometrics in ankle return-to-sport (RTS and sprain themes).",
    aliases: ["hop prep", "saltos bilaterales", "aterrizaje", "plyometric prep"],
  },

  // ── Core / general ────────────────────────────────────────────────────────
  {
    id: "core_diaphragmatic_breathing",
    nameEs: "Respiración diafragmática",
    nameEn: "Diaphragmatic breathing",
    region: "core",
    phase: "protection",
    targetMuscles: "Diafragma, core profundo",
    equipment: "Ninguno",
    instructionsEs:
      "Supino o sentado, una mano en pecho y otra en abdomen. Inspira por nariz expandiendo abdomen; exhala lento por boca.",
    instructionsEn:
      "Supine or seated, one hand on chest one on belly. Inhale through nose expanding abdomen; exhale slowly through mouth.",
    dosageEs: "5–10 minutos, 1–2 veces/día o antes de ejercicio.",
    dosageEn: "5–10 minutes, 1–2×/day or before exercise.",
    progressionEs: "Integrar con dead bug o bird dog.",
    progressionEn: "Integrate with dead bug or bird dog.",
    regressionEs: "Ciclos más cortos.",
    regressionEn: "Shorter cycles.",
    contraindicationsEs: "Ninguna habitual; disnea no explicada requiere valoración.",
    contraindicationsEn: "Usually none; unexplained dyspnea needs assessment.",
    evidenceEs:
      "Respiración y relajación como complemento en dolor musculoesquelético (temas biopsicosocial).",
    evidenceEn:
      "Breathing and relaxation as adjunct in MSK pain (biopsychosocial themes).",
    aliases: ["respiración diafragmática", "diaphragmatic breathing", "respiración abdominal"],
  },
  {
    id: "general_farmer_carry",
    nameEs: "Farmer carry ligero",
    nameEn: "Light farmer carry",
    region: "general",
    phase: "functional",
    targetMuscles: "Core, agarre, cadena posterior",
    equipment: "Mancuernas o kettlebells ligeras",
    instructionsEs:
      "Camina erguido llevando peso ligero a cada lado. Hombros abajo, pasos controlados.",
    instructionsEn:
      "Walk upright carrying light weight each side. Shoulders down, controlled steps.",
    dosageEs: "3 × 20–30 m, peso moderado (RPE 5–6/10).",
    dosageEn: "3 × 20–30 m, moderate weight (RPE 5–6/10).",
    progressionEs: "Más peso, una mano, o suitcase carry.",
    progressionEn: "More weight, one hand, or suitcase carry.",
    regressionEs: "Menos peso o distancia.",
    regressionEn: "Less weight or distance.",
    contraindicationsEs: "Dolor lumbar agudo con carga.",
    contraindicationsEn: "Acute load-related low back pain.",
    evidenceEs:
      "Carries funcionales en fortalecimiento global (McGill / S&C functional themes).",
    evidenceEn:
      "Functional carries in global strengthening (McGill / S&C functional themes).",
    aliases: ["farmer carry", "transporte peso", "carried load walk"],
  },
  {
    id: "general_y_balance_reach",
    nameEs: "Práctica de alcance Y-balance",
    nameEn: "Y-balance reach practice",
    region: "general",
    phase: "functional",
    targetMuscles: "Equilibrio dinámico, control monopodal",
    equipment: "Cinta métrica o líneas en suelo",
    instructionsEs:
      "Apoya en una pierna y alcanza con la otra en tres direcciones (anterior, posteromedial, posterolateral) sin perder equilibrio.",
    instructionsEn:
      "Stand on one leg and reach with other in three directions (anterior, posteromedial, posterolateral) without losing balance.",
    dosageEs: "3 × 3 alcances por dirección y pierna, comparar simetría.",
    dosageEn: "3 × 3 reaches per direction and leg, compare symmetry.",
    progressionEs: "Mayor distancia o superficie inestable.",
    progressionEn: "Greater reach or unstable surface.",
    regressionEs: "Alcance parcial con apoyo dedos.",
    regressionEn: "Partial reach with finger support.",
    contraindicationsEs: "Inestabilidad aguda no valorada.",
    contraindicationsEn: "Unassessed acute instability.",
    evidenceEs:
      "Y-balance usado en screening y rehab funcional (Plisky et al.; RTS themes).",
    evidenceEn:
      "Y-balance used in screening and functional rehab (Plisky et al.; RTS themes).",
    aliases: ["y balance", "y-balance", "alcance equilibrio", "star excursion"],
  },
] as const;

const EXERCISE_BY_ID = new Map<string, ReadaptExercise>(
  READAPTATION_EXERCISES.map((ex) => [ex.id, ex]),
);

/** Region keyword hints for free-text resolution (longest match wins). */
const REGION_KEYWORDS: { region: ReadaptRegion | "general"; patterns: RegExp[] }[] = [
  {
    region: "shoulder",
    patterns: [
      /hombro|manguito|rotador|supraespinoso|infraespinoso|escápula|escapula|rcrsp|tendinopatía.*hombro/i,
    ],
  },
  {
    region: "elbow",
    patterns: [/codo|epicondil|epitrocle|antebrazo lateral|tyler twist|flexbar/i],
  },
  {
    region: "wrist_hand",
    patterns: [
      /muñeca|muneca|mano|dedos|túnel carpiano|tunel carpiano|median nerve|flexor.*muñeca/i,
    ],
  },
  {
    region: "cervical",
    patterns: [/cervical|cuello|nuca|whiplash|latigillo|cervicalgia/i],
  },
  {
    region: "thoracic",
    patterns: [/torácic|toracic|dorsal|t-spine|t spine/i],
  },
  {
    region: "lumbar",
    patterns: [
      /lumbar|lumbalgia|ciática|ciatica|espalda baja|columna baja|disc|hernia|mcgill|mcKenzie/i,
    ],
  },
  {
    region: "hip",
    patterns: [
      /cadera|glúteo|gluteo|piriforme|trocánter|trocanter|inguinal|pubalgia|faber/i,
    ],
  },
  {
    region: "knee",
    patterns: [
      /rodilla|rotulian|patelar|cuádriceps|cuadriceps|menisco|ligamento cruzado|acl|lca|pfps/i,
    ],
  },
  {
    region: "ankle",
    patterns: [/tobillo|esguince.*tobillo|peroneo|talocrural/i],
  },
  {
    region: "foot",
    patterns: [/pie|planta|fascia plantar|metatar|calzado|windlass/i],
  },
  {
    region: "core",
    patterns: [/core|abdominal|transverso|diafragma|estabilización lumbar/i],
  },
  {
    region: "general",
    patterns: [/general|global|cuerpo entero|farmer|y-balance|equilibrio general/i],
  },
];

export function getReadaptExerciseById(id: string): ReadaptExercise | undefined {
  return EXERCISE_BY_ID.get(id);
}

export function getReadaptExercisesForRegion(
  region: ReadaptRegion,
): ReadaptExercise[] {
  return READAPTATION_EXERCISES.filter((ex) => ex.region === region);
}

export function resolveReadaptRegionFromText(text: string): ReadaptRegion | "general" {
  const normalized = text.trim();
  if (!normalized) return "general";

  for (const { region, patterns } of REGION_KEYWORDS) {
    if (patterns.some((re) => re.test(normalized))) {
      return region;
    }
  }

  for (const ex of READAPTATION_EXERCISES) {
    if (
      ex.aliases.some((alias) =>
        normalized.toLowerCase().includes(alias.toLowerCase()),
      )
    ) {
      return ex.region;
    }
  }

  return "general";
}

/** Total exercises in catalog (for sanity checks). */
export const READAPTATION_EXERCISE_COUNT = READAPTATION_EXERCISES.length;
