# PHYSIOGUIDE — NIVELES DE EVIDENCIA A–D (Y «INSUFFICIENT»)

**Capa:** Fase 3 evidence + relations JSON  
**Regla:** Nunca inventar Sn/Sp/LR. Etiquetar claims; distinguir precisión diagnóstica vs utilidad clínica vs tradición.

---

## PROPÓSITO

Definir una jerarquía formal para que la IA **calibre el lenguaje** al citar pruebas, clusters, dolor referido y relaciones clínicas.  
Complementa (no sustituye) los **Tier A/B/C** de clusters regionales en `clusters-*.md`.

---

## JERARQUÍA

| Nivel | Significado | Cómo debe hablar la IA |
|-------|-------------|-------------------------|
| **A** | Evidencia consistente de calidad relativamente alta (p. ej. CPG fuertes, revisiones coherentes, reglas de decisión validadas en contexto adecuado) | «Respaldado por evidencia consistente…» / «compatible con criterios validados…». Aún **no** digas «diagnóstico confirmado» solo con clínica si el gold standard es imagen/cirugía. |
| **B** | Evidencia moderada o con limitaciones metodológicas / heterogeneidad | «Evidencia moderada…» / «sugiere…» / «cluster útil con cautela…». |
| **C** | Evidencia limitada, estudios pequeños, o hallazgos inconsistentes | «Evidencia limitada…» / «podría explorarse…». No afirmes exclusión ni confirmación. |
| **D** | Preliminar, indirecta, tradicional, o extrapolación | «Hipótesis / tradición / evidencia preliminar…». Obligatorio etiquetar clase de referido si aplica (`traditional` / `experimental` / `clinical`). |
| **insufficient** | No hay base suficiente para afirmar clínicamente | «No hay evidencia suficiente para afirmar…». **No uses** la relación como hecho. |

---

## REGLAS DE ETIQUETADO PARA LA IA

1. **Toda afirmación diagnóstica o de referido** debe poder mapearse a A/B/C/D/insufficient (en rules, modules o JSON `evidence_level`).  
2. Si el nivel es **C, D o insufficient** → enfatizar incertidumbre y alternativas.  
3. **Mapas miofasciales tradicionales** → máximo **D** + `referred_pattern_class: traditional` (nunca anatomía absoluta).  
3b. **Provocation maps articulares** (Dwyer/Aprill/Bogduk, Fukui, Dreyfuss, McCall, Fortin, Lesher) → `experimental` o `clinical`, nivel **B/C**. Describen que **una estructura puede referir**; **no** son Sn/Sp de palpación ni autorizan copiar figuras.  
3c. **Fenómeno de referido muscular experimental** (Graven-Nielsen, Kellgren) → `experimental` para el fenómeno; **no** eleva un mapa de atlas a B.  
4. **Tests aislados MSK** suelen ser **B o C** para precisión diagnóstica standalone; preferir **clusters**.  
5. **Negativo no excluye** es el default cuando Sn/LR− no son fiables o no se citan → ver `negative-test-reasoning.md`.  
6. Nunca rellenes campos numéricos de accuracy «de memoria». Usa `diagnostic_accuracy.status`: `unknown` | `mixed` | `cited` | `do_not_invent`.

### Frases prohibidas (cualquier nivel)

- «El problema es X» / «confirmado» / «descartado» por un solo test  
- «Seguro MTrP» / «el dolor viene de…»  
- Citar Travell u otros textos protegidos **verbatim**

### Frases preferidas

- «Compatible con…» / «podría explorarse…» / «evidencia mixta/limitada…»  
- «Negativo debilita poco la sospecha…» (si cualitativo)

---

## RIESGO DE SESGO (RISK OF BIAS) — NOTAS OPERATIVAS

Al interpretar literatura de tests clínicos, la IA debe asumir riesgos frecuentes:

| Sesgo / problema | Impacto clínico |
|------------------|-----------------|
| Espectro / población | Sn/Sp de urgencias ≠ consulta ambulatoria deportiva |
| Gold standard imperfecto | Imagen y artroscopia también tienen límites |
| Verificación parcial | Solo se imagenan positivos → sesgo |
| Falta de cegamiento | Infla accuracy del examinador |
| Heterogeneidad de umbrales | “Positivo” distinto entre estudios |
| Experiencia del examinador | Lachman, drawer, palpación MTrP |
| Publicación / replicación | Un estudio “bueno” no basta (p. ej. Thessaly) |

**AI rule:** Si hay duda de sesgo o aplicabilidad → bajar un nivel efectivo en el lenguaje (A→B, B→C) y decir «aplicabilidad incierta a este contexto».

---

## APLICABILIDAD

Antes de extrapolar un estudio o CPG:

1. ¿Misma región y constructo clínico?  
2. ¿Agudo vs crónico? ¿Irritabilidad?  
3. ¿Atleta / postparto / OA / postquirúrgico?  
4. ¿El test fue parte de cluster o aislado?  
5. ¿El outcome es “diagnóstico estructural” o “útil para manejar”?

Si no encaja → **no copies** la fuerza de la evidencia; marca limitaciones.

---

## MAPEO A TIERS DE CLUSTERS (A/B/C EXISTENTES)

Los archivos `clusters-shoulder.md`, `clusters-spine.md`, `clusters-elbow-wrist-hand-tiers.md`, etc. usan **Tier A/B/C** como prioridad de razonamiento clínico (qué cluster priorizar), no exactamente la misma escala académica.

| Tier de cluster (motor) | Nivel evidence A–D típico | Uso |
|-------------------------|---------------------------|-----|
| **Tier A** | Suele apoyarse en **A–B** (CPG, clusters más coherentes, red flags) | Priorizar en claridad |
| **Tier B** | Suele ser **B–C** | Diferencial activo |
| **Tier C** | Suele ser **C–D** o constructos cautelosos | Solo si el cuadro lo pide; no inundar |

**Importante:** Un cluster Tier A puede contener tests individuales de accuracy **mixta** (B/C). El tier habla del **patrón**, no de cada signo.

| Relations JSON `evidence_level` | Uso recomendado |
|---------------------------------|-----------------|
| A | Reglas validadas / CPG fuertes / red-flag pathways |
| B | Clusters clínicos útiles, revisiones con limitaciones |
| C | Tests aislados, series limitadas |
| D | Tradición MTrP, extrapolaciones |
| insufficient | No afirmar |

---

## RELACIÓN CON OTRAS CAPAS

| Documento | Rol |
|-----------|-----|
| `negative-test-reasoning.md` | Postest cuando el resultado es − |
| `test-reliability-framework.md` | Fiabilidad ≠ validity; palpación |
| `clusters-*.md` | Patrones Tier A/B/C |
| `knowledge/relations/*.json` | Campo `evidence_level` + `referred_pattern_class` |
| `clinical-reasoning/mtrp-framework.md` | Controversia MTrP |

---

## AI RULE GLOBAL

1. Etiqueta el claim (A/B/C/D/insufficient).  
2. Si C/D/insufficient → hipótesis + discriminación, no certeza.  
3. Separa: **fiabilidad del test**, **accuracy diagnóstica**, **utilidad para manejar**, **tradición**.  
4. Nunca inventes métricas; si el usuario pide cifras no citadas → «no inventar; evidencia cualitativa / consultar fuente primaria».

**Ingest title suggestion:** `Physioguide — Evidencia — Niveles A–D y etiquetado de claims`

<!-- FULL_MODULE_MARKER: evidence-levels-A-D v1 complete -->
