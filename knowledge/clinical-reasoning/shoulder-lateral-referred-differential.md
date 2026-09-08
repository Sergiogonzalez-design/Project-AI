# PHYSIOGUIDE AI — DOLOR LATERAL HOMBRO: REFERIDO Y DIFERENCIAL (ACTIVE)

**Status:** ACTIVE (relations pack v2 — upgraded from pilot)  
**Companion:** `shoulder-lateral-rcrsp.md`, `evidence/referred-pain-shoulder-lateral.md`, `evidence/relations-shoulder-lateral.md`, `evidence/negative-test-reasoning.md`  
**Relations JSON:** `relations/shoulder-lateral.json`

---

## 1. ESCENARIO

Dolor **lateral / anterolateral / deltoideo**. El clínico duda, los tests de manguito son negativos o no reproducen dolor familiar, o no hay eco.

**No responder:** «Es el trapecio / infraespinoso.»  
**Sí:** reordenar hipótesis con evidencia y exploración discriminativa.

---

## 2. HIPÓTESIS A CONSIDERAR (priorizar, no listar 20)

| Prioridad típica | Hipótesis | Cuándo subir |
|------------------|-----------|--------------|
| 0 | Cardíaco / visceral | Pecho, disnea, sudoración, patrón de esfuerzo |
| 1 | RCRSP / manguito (Lewis) | Overhead, arco, familiar pain en elevación aunque 1 test especial sea − |
| 2 | Rotura importante | Debilidad franca, drop arm, lag |
| 3 | Cervical (C5–C6 / radiculopatía / faceta experimental) | Cuello, hormigueo, Spurling cluster, locales pobres |
| 4 | AC | Dolor en “puntita”, cross-body |
| 5 | Bíceps LHBT | Surco anterior; no diagnosticar SLAP por un test |
| 6 | Capsulitis / rigidez | PROM y AROM limitados (sobre todo RE) |
| 7 | Inestabilidad | Aprensión / trauma |
| 8 | Miofascial escapular (infraespinoso) | Solo si familiar pain; evidencia **tradicional/D** |

**Coexistencia permitida:** RCRSP + cervical.

---

## 3. PRUEBAS NEGATIVAS

- Neer/Hawkins/Jobe aislados **negativos** → **no** excluyen RCRSP.  
- Spurling negativo → **no** excluye contribución cervical.  
- Preguntar: ¿se reprodujo el **dolor familiar**?

Ver `negative-test-reasoning.md` y pack JSON.

---

## 4. FLUJO

```
Red flags hombro/cuello/cardíaco
→ ¿Cluster RCRSP o rotura (debilidad)?
→ Si locales − / no familiar → cribado cervical
→ AC / bíceps / capsulitis / inestabilidad según localización
→ Miofascial solo como hipótesis D + familiar pain
→ Formato HIPÓTESIS PRINCIPAL / ALTERNATIVA / NO PRIORITARIO
→ Si no mejora: reevaluar (no solo más carga al manguito)
```

---

## 5. SIN ECOGRAFÍA

Razonar con historia + familiar pain + fuerza + cervical.  
Eco/RMN si: sospecha rotura importante, no mejora, trauma, o cambia manejo — no «porque no hay eco».

---

## AI RULE

En dolor lateral de hombro con duda o tests −: no saltar a un músculo. Actualizar probabilidad RCRSP vs cervical vs AC/bíceps/capsulitis/inestabilidad; miofascial solo con límites explícitos. Fuente: pack relations `shoulder-lateral` v2.
