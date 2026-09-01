# PHYSIOGUIDE AI — SHOULDER MASTER INTEGRATION MODULE

**Status:** ACTIVE (integración final de hombro — Phase 1)  
**Evidence DB:** `knowledge/evidence/shoulder-tests.md`, `clusters-shoulder.md` (NO recrear)  
**Principles:** Ver `knowledge/PHYSIOGUIDE_MASTER_CLINICAL_DOCUMENT.md`

---

## 1. DEFINITION

**Shoulder master integration** = marco que enruta cada caso de hombro por **red flags**, **mecanismo** (trauma/luxación vs sobreuso), **localización exacta** y **cribado cervical**, antes de activar la rama clínica (RCRSP lateral, anterior/bíceps, AC superior, inestabilidad/trauma, referido cervical/escapular).

No es un diagnóstico. Es el **router clínico**.

---

## 2. MASTER TREE (OBLIGATORIO)

```
SHOULDER PAIN
    ↓
RED FLAGS (urgencia primero)
    ↓
CERVICAL SCREEN (si cuello / hormigueo / síntomas distales)
    ↓
MECHANISM GATE
    ¿Trauma / luxación / «se sale» / caída sobre hombro?
        SÍ → rama Instability / Trauma (prioridad)
    ↓ (si no dominante, o además)
EXACT LOCATION
    ↓
┌──────────────┬──────────────┬──────────────┬─────────────────┐
│ LATERAL /    │ ANTERIOR /   │ SUPERIOR /   │ POSTERIOR /     │
│ ANTEROLATERAL│ SURCO /      │ AC /         │ ESCAPULAR /     │
│ DELTOIDES    │ BÍCEPS       │ CLAVÍCULA    │ CUELLO          │
│              │              │              │                 │
│ → RCRSP /    │ → Anterior   │ → AC         │ → Posterior /   │
│   manguito / │   / bíceps   │              │   cervical /    │
│   capsulitis │              │              │   referido      │
└──────────────┴──────────────┴──────────────┴─────────────────┘
    ↓
HISTORY + LOAD + FAMILIAR PAIN
    ↓
AROM / PROM / STRENGTH (solo si seguro)
    ↓
PRIMARY CLUSTER (Evidence DB — no test aislado)
    ↓
DIFFERENTIAL + COEXISTENCE
    ↓
COMPATIBILITY → RECOMMENDATION
```

**Regla de oro:** NUNCA `PRUEBA POSITIVA → DIAGNÓSTICO`. Neer/Hawkins ≠ «pinzamiento confirmado».

---

## 3. RED FLAGS (PASO 0 — SIEMPRE)

Derivar **URGENCIAS / HOSPITAL** si:

- Deformidad / luxación no reducida / «hombro fuera» ahora
- Trauma mayor + imposibilidad de mover el brazo
- Pérdida franca de fuerza o sensibilidad distal
- Fiebre + calor/hinchazón articular (sospecha séptica)
- Dolor torácico / disnea / irradiación cardíaca atípica
- Sospecha de fractura (caída + dolor óseo / crepitación)
- Déficit neurológico mayor / mielopatía cervical sospechosa

**No pedir** tests agresivos (apprehension forzada, carga overhead) si hay luxación aguda, fractura sospechosa o no mueve el brazo.

---

## 4. FAMILIAR PAIN (TRANSVERSAL)

> «¿Es el mismo dolor que notas al elevar el brazo, dormir de ese lado, lanzar o cruzar el brazo?»

| Respuesta | Interpretación |
|-----------|----------------|
| Sí — reproduce dolor habitual | Hallazgo clínicamente relevante ↑ |
| No — molestia nueva | Peso ↓; buscar otra rama / cervical |
| No estoy seguro | Integrar con localización y carga |

---

## 5. MECHANISM GATE

| Mecanismo | Rama |
|-----------|------|
| Luxación / subluxación / «se sale» + ABD-RE | Instability / Trauma |
| Caída sobre hombro / FOOSH | Trauma (± AC, fractura, cuff) |
| Golpe directo en punta del hombro | AC / contusión |
| Overhead / lanzamiento / natación progresivo | RCRSP o anterior según localización |
| Inicio gradual + pérdida global ROM (activo y pasivo) | Capsulitis (diferencial en RCRSP / master) |
| Cuello + brazo / hormigueo | Cribado cervical primero |

---

## 6. LOCATION ROUTING TABLE

| Localización del paciente | Rama | Módulo |
|---------------------------|------|--------|
| Parte lateral / deltoides / anterolateral | RCRSP / manguito | `shoulder-lateral-rcrsp.md` |
| Parte delantera / surco bicipital | Anterior / bíceps | `shoulder-anterior-pain.md` |
| Cerca de la clavícula / punta superior | AC | `shoulder-superior-ac.md` |
| Profundo dentro del hombro | RCRSP ± inestabilidad ± capsulitis | master + ramas |
| Posterior / escapular | Posterior + cervical | master §10 + cervical |
| No estoy seguro / difuso | Mecanismo + cervical + elevación | |

Si **varias** localizaciones → permitir **coexistencia** (p. ej. RCRSP + AC, manguito + cervical).

---

## 7. CERVICAL SCREEN (CUANDO PROCEDA)

Activar si: dolor de cuello, hormigueo/entumecimiento, síntomas por debajo del codo, tests locales de hombro poco provocativos, Spurling reproduce el síntoma del brazo.

**Cluster referido cervical** (Evidence DB): cuello + irradiación ± Spurling familiar.

Spurling **negativo no excluye** origen cervical.

---

## 8. PASSIVE ROM / CAPSULITIS

Si **activo y pasivo** limitados (esp. RE y elevación) en patrón global → no etiquetar solo «tendón / pinzamiento». Compatible con **capsulitis adhesiva / rigid shoulder**. Neer/Hawkins pueden ser positivos por falta de rango.

---

## 9. PRIMARY CLUSTERS (REUSAR EVIDENCE DB — TIER A/B/C)

| Tier | Cluster | Uso |
|------|---------|-----|
| **A** | Inestabilidad anterior | Apprehension + Relocation ± Surprise |
| **A** | AC | Paxinos + O'Brien (serie) / cross-body + palpación (paciente) |
| **A** | Cervical (Wainner) | Spurling + ULTT + distracción + rotación limitada |
| **B** | Rotura manguito | Jobe/Full Can + RE débil + drop arm ± lags |
| **B** | Infra / subescap | ER lag + Hornblower / IR lag + Belly press + Bear hug |
| **B** | SLAP screening | O'Brien + Crank / Yergason + Anterior slide — **no confirmar** |
| **B** | Inestabilidad posterior | Kim + Jerk ± posterior apprehension |
| **C** | RCRSP | Arco + Neer/Hawkins + Jobe doloroso |
| **C** | Bíceps | Uppercut + Speed + Yergason + surco |
| **C** | Capsulitis / artrosis | ROM global; artrosis → RX |
| **C** | Escapular | SAT/SRT mejora síntoma |
| **C** | MDI / laxitud | Sulcus + Gagey + historia inestabilidad |

Ver `clusters-shoulder.md` completo.

---

## 10. POSTERIOR / ESCAPULAR (RESUMEN EN MASTER)

Dolor posterior o escapular: valorar sobrecarga posterior del manguito, disfunción escapular, referido cervical, y en lanzadores *internal impingement* (clínica, sin métricas inventadas). Si cuello domina → priorizar cervical.

---

## 11. COEXISTENCE

Permitir ≥2 entidades: RCRSP + AC, RCRSP + cervical, inestabilidad + labrum sospechoso, bíceps + RCRSP.

---

## 12. LANGUAGE (AI)

- Usar: «compatible con», «aumenta la sospecha», «apoya / baja la hipótesis»
- Nunca: «pinzamiento confirmado», «Neer positivo = diagnóstico», Sn/Sp inventados
- Imagen: RX si trauma/fractura; eco/RMN si déficit de manguito o inestabilidad persistente — hallazgo ≠ causa automática

---

## 13. MODULE MAP

| Módulo | Archivo |
|--------|---------|
| Master (este) | `shoulder-master-integration.md` |
| Lateral / RCRSP | `shoulder-lateral-rcrsp.md` |
| Anterior | `shoulder-anterior-pain.md` |
| Superior / AC | `shoulder-superior-ac.md` |
| Instability / Trauma | `shoulder-instability-trauma.md` |
| Posterior instability | `shoulder-posterior-instability.md` |
| SLAP screening | `shoulder-slap-labrum-screen.md` |
