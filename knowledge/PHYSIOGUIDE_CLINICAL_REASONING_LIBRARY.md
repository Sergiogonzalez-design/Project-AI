# Physioguide — Biblioteca de razonamiento clínico musculoesquelético

**Status:** ACTIVE (full library — all regions referred + MTrP atlas + negative-test + matrices + A–D)  
**Date:** 1 Sep 2026  
**Audience:** AI + fisioterapeuta (asistente de hipótesis, no diagnóstico automático)

Companion docs:

- Gap audit: [`PHYSIOGUIDE_REASONING_LIBRARY_GAP_AUDIT_2026-09-01.md`](./PHYSIOGUIDE_REASONING_LIBRARY_GAP_AUDIT_2026-09-01.md)
- Data model: [`schema/README.md`](./schema/README.md)
- Cursor rule: `.cursor/rules/physioguide-clinical-reasoning-library.mdc`

---

## 1. Objetivo

Ayudar al fisioterapeuta a **ampliar o reorganizar hipótesis** cuando la presentación no encaja, con foco en:

- Dolor miofascial / MTrP / dolor referido (con controversia explícita)
- Diagnóstico diferencial musculoesquelético
- Fiabilidad y limitaciones de pruebas
- Prueba negativa ≠ exclusión
- Persistencia/recurrencia → reevaluación de hipótesis
- Seguridad / red flags primero

**No** diagnosticar automáticamente. **Sí** priorizar hipótesis rastreables a evidencia.

---

## 2. Principio fundamental

> «La hipótesis inicial no explica suficientemente los hallazgos. ¿Qué otras estructuras, mecanismos o fuentes deberían considerarse?»

**No:** «La prueba es negativa → el problema es otro músculo.»

Una prueba negativa puede significar: estructura no implicada; sensibilidad insuficiente; prueba inadecuada; técnica incorrecta; no se reprodujo el síntoma familiar; otra estructura similar; referido; múltiples generadores; sensibilización; hipótesis inicial incorrecta.

---

## 3. Lenguaje obligatorio

Usar: «podría ser razonable explorar…», «otra estructura que podría contribuir…», «sensibilidad limitada → no descartar solo con esta prueba», «evidencia limitada/mixta», «comprobar mediante…».

Evitar: «el problema es…», «el dolor viene de…», «seguro que es un punto gatillo…», «negativo descarta…».

Distinguir siempre: **compatible con** vs **causa demostrada**.

---

## 4. Modos de comportamiento

| Modo | Cuándo | Qué hacer |
|------|--------|-----------|
| **Claridad** | Cluster coherente, hallazgos alineados | Priorizar hipótesis principal; no inundar con alternativas |
| **Pruebas negativas** | Tests − o no reproducen familiar | Revisar qué test, estructura, capacidad diagnóstica, LR− cualitativo, alternativas, exploración discriminativa |
| **Duda** | «No estoy seguro», «no cuadra», «sin eco» | Modo exploración de hipótesis (resumen → apoyos/contras → faltantes → alternativas priorizadas) |
| **No mejora** | Persistencia/recurrencia | Reevaluar hipótesis (no solo «más dosis»); red flags; factores perpetuadores; derivación si procede |
| **Red flags** | Fractura, infección, malignidad, cauda, vascular, neuro grave | Seguridad → derivación; no seguir buscando músculo |

---

## 5. Capas de la biblioteca

| Capa | Contenido | Prefijo RAG |
|------|-----------|-------------|
| Clínica regional (existente) | Árboles por zona | `Physioguide — …` |
| Evidencia tests/clusters (Fase 3) | Purpose…Citation; no inventar Sn/Sp | `Physioguide — Evidencia — …` |
| **MTrP framework** | Criterios, controversia, límites | `Physioguide — Miofascial — …` |
| **Dolor referido** | Relaciones source→pattern→mimic; tipo de evidencia | `Physioguide — Referido — …` |
| **Prueba negativa** | Pretest → resultado → postest; no exclusión automática | `Physioguide — Evidencia — Prueba negativa…` |
| **Modo hipótesis** | Triggers + formato de respuesta | `Physioguide — Razonamiento — …` |
| Relaciones JSON | Schema §20 | `knowledge/relations/*.json` |

### Tipos de evidencia de patrón referido

1. **Experimental** — reproducido en estudios controlados  
2. **Clínica** — descrito en pacientes / series  
3. **Tradicional** — mapas clásicos / textos de referencia  

La IA **debe etiquetar** cuál usa. Mapas tradicionales ≠ verdad anatómica absoluta.

### Copyright

No ingerir Travell & Simons u otros textos protegidos completos. Solo citas, notas propias o fuentes con derecho de uso.

---

## 6. Priorización de salida (fisioterapeuta / physio_chat)

```
### HIPÓTESIS PRINCIPAL
Evidencia: alta/moderada/baja · Por qué encaja · Qué contradice

### ALTERNATIVA 1 / 2
Por qué · Qué exploración discrimina · Nivel de evidencia

### NO PRIORITARIO
Breve: por qué no explorar primero
```

Máximo ~2–3 alternativas activas. No 20 opciones.

---

## 7. Filosofía (pipeline)

```
DATOS → HIPÓTESIS → PRUEBAS → CALIDAD DIAGNÓSTICA
→ ¿apoyan o debilitan? → si no: actualizar probabilidad
→ alternativas compatibles (evidencia) → exploración discriminativa
→ reevaluar → incertidumbre / derivación
```

**Prioridad absoluta:** SEGURIDAD → EVIDENCIA → PROBABILIDAD → DIFERENCIAL → PRUEBAS DISCRIMINATIVAS → REEVALUACIÓN.

---

## 8. Cobertura regional (v1 completa)

| Capa | Cobertura |
|------|-----------|
| Referido | cervical, hombro, torácica, lumbar, cadera, rodilla, tobillo/pie, codo/muñeca, cabeza |
| MTrP | framework + atlas por región (tradicional=D; no Travell verbatim) |
| Prueba negativa | hombro, raquis, cadera, rodilla, tobillo, codo/muñeca |
| Matrices diferenciales | cervical → cabeza/torácica/pelvis/mano |
| Relations JSON | shoulder, cervical, thoracic, lumbar, hip, knee, ankle-foot, elbow-wrist, head |
| Fuentes ancla | `evidence/referred-pain-sources.md` (CPG, RS, provocación articular, Tough/Lucas) |
| Modos | claridad, duda, persistencia, sin imagen |

**Evidencia:** relaciones clínicas/experimentales citadas (Dwyer/Aprill/Bogduk, Fukui, Dreyfuss, McCall, Fortin, Lesher, Hegedus, Wainner, CPG). Mapas musculares = **tradicional (D)** únicamente. **Nunca** inventar Sn/Sp/LR.
