# Gap audit — Clinical reasoning library vs Physioguide

**Date:** 1 Sep 2026 (updated — evidence-anchor pass)  
**Spec:** user brief §1–26 + `PHYSIOGUIDE_CLINICAL_REASONING_LIBRARY.md`

Legend: ✅ present · 🟡 parcial · ❌ ausente · 🧱 bloqueado (copyright / no inventar Sn-Sp)

---

## Por sección del brief

| § | Tema | Estado | Notas |
|---|------|--------|-------|
| 1 | Objetivo (miofascial, referido, LR, diferencial) | ✅ | Framework MTrP + atlas + referred-pain-* all regions + negative-test + matrices |
| 2 | Principio (no “negativo → otro músculo”) | ✅ | `negative-test-reasoning.md` + `AI_NEGATIVE_TEST_LIBRARY_RULES` |
| 3 | Hipótesis no diagnósticos | ✅ | «compatible con» en rules + evidence DB |
| 4A | Presentación clara → no inundar | ✅ | `clarity-and-no-overdiagnosis.md` + rules |
| 4B | Pruebas negativas (checklist 1–9) | ✅ | Completo multi-región |
| 5 | Modo duda / exploración hipótesis | ✅ | `hypothesis-exploration-mode.md` + wiring |
| 6 | Paciente vuelve con dolor | ✅ | `persistence-reevaluation.md` + follow-up rules |
| 7 | DB dolor referido + tipos evidencia | ✅ | cervical, shoulder, thoracic, lumbar, hip, knee, ankle-foot, elbow-wrist, head + `referred-pain-sources.md` |
| 8 | MTrP + controversia | ✅ | `mtrp-framework.md` + `mtrp-muscle-atlas.md` (tradicional=D; no Travell) |
| 9 | DB fiabilidad tests | ✅ | `test-reliability-framework.md` + evidence DB cualitativa (**🧱 no inventar cifras**) |
| 10 | Módulo “qué significa negativo” | ✅ | Completo |
| 11 | Matriz diferencial por localización | ✅ | Incluye torácica y cabeza |
| 12 | Relaciones A→patrón→B→prueba | ✅ | relations JSON: shoulder, lumbar, cervical, thoracic, hip, knee, ankle-foot, elbow-wrist, head |
| 13 | Sin eco/imagen | ✅ | `no-imaging-decision.md` + rules |
| 14 | Priorización 1+2 alternativas | ✅ | Hypothesis-mode format |
| 15 | No sobrediagnóstico | ✅ | Clarity mode |
| 16 | Red flags | ✅ | Cervical/lumbar/global + Ottawa + SNOOP + pecho AHA/ACC cualitativo |
| 17–18 | Fuentes / niveles A–D | ✅ | `evidence-levels-A-D.md` + `referred-pain-sources.md` |
| 19 | Nunca inventar relaciones | ✅ | Schema exige references + evidence_level; si no hay fuente → no afirmar |
| 20 | Modelo de datos | ✅ | `schema/clinical-relation.schema.json` |
| 21–22 | Ejemplos hombro/lumbar | ✅ | Shoulder + lumbar packs + matrix |
| 23 | Preguntas tipo “¿negativo descarta?” | ✅ | Negative-test + hypothesis mode |
| 24–26 | Compatible vs demostrado; pipeline; filosofía | ✅ | Master + rules |

**Bloqueo permanente (no es gap de contenido):** 🧱 no ingerir Travell & Simons verbatim; 🧱 no inventar Sn/Sp/LR numéricos sin cita.

---

## Anclas de evidencia (no mapas comerciales)

Relaciones **experimentales/clínicas** citadas (cualitativo; sin cifras inventadas):

- Facetas cervicales → cintura escapular: Dwyer/Aprill/Bogduk 1990; Fukui 1996  
- Facetas torácicas: Dreyfuss 1994  
- Elementos posteriores lumbares / facetas: McCall 1979; Fukui 1997  
- SIJ: Fortin 1994; clusters Laslett (precisión mixta)  
- Cadera → muslo/rodilla: Lesher 2008  
- Tests: Hegedus, Wainner, Benjaminse, D’Arcy/McGee, Warwick, CPG JOSPT  
- Miofascial: Tough 2007; Lucas 2009 (cautela). Mapas musculares = **D / tradicional**  
- Fenómeno de referido muscular: Graven-Nielsen / Kellgren — **no** valida atlas comerciales  
- Cefalea: ICHD-3; Bogduk/Govind 2009  
- Pecho: AHA/ACC Chest Pain 2021 (seguridad)

---

## Inventario

### Razonamiento
- hypothesis-exploration-mode, clarity-and-no-overdiagnosis, persistence-reevaluation, no-imaging-decision, differential-matrices-by-location

### Miofascial
- mtrp-framework, mtrp-muscle-atlas

### Referido
- referred-pain-{cervical,shoulder-lateral,thoracic,lumbar,hip,knee,ankle-foot,elbow-wrist,head}
- referred-pain-sources (bibliografía ancla)

### Evidencia
- negative-test-reasoning, evidence-levels-A-D, test-reliability-framework

### Relations JSON
- shoulder-lateral, lumbar, cervical, thoracic, hip, knee, ankle-foot, elbow-wrist, head

### Código
- `lib/physioguide-clinical-reasoning-library-rules.ts` (+ mobile + edge `response-rules.ts`)
- Wired in web / mobile / edge `ai-consult`
