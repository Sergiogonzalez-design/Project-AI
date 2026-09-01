# PHYSIOGUIDE — MARCO DE FIABILIDAD Y PRECISIÓN DE PRUEBAS

**Capa:** Evidencia  
**Regla:** **Nunca inventar** ICC, kappa, Sn, Sp, LR, AUC ni %. Si RAG Physioguide no trae una cifra citada, hablar en **cualitativo** (limitada / mixta / no excluye).

Companion: `negative-test-reasoning.md`, `evidence-levels-A-D.md`, `../clinical-reasoning/mtrp-framework.md`, tests regionales (`shoulder-tests.md`, `hip-tests.md`, `knee-tests.md`, `spine-tests.md`, etc.).

---

## PRINCIPIOS (nivel de evidencia conceptual: A como método)

1. Fiabilidad ≠ validez: un test repetible puede no medir la estructura que se nombra.  
2. Un test poco fiable no debe usarse para **excluir ni confirmar** aislado.  
3. Preferir **clusters** (historia + localización + dolor familiar + 1–2 tests) sobre un signo.  
4. Precisión depende de **población** (pretest); no extrapolar atletas ↔ dolor crónico indiscriminadamente.  
5. Si la literatura es mixta → decirlo.

---

## MTrP / PALPACIÓN (evidencia de cautela)

| Afirmación | Nivel | Fuente |
|------------|-------|--------|
| Criterios diagnósticos de MTrP varían entre estudios | B (revisión de criterios) | Tough EA et al. Variability of criteria used to diagnose myofascial trigger point pain syndrome — evidence review, 2007 |
| Fiabilidad de la identificación manual de MTrP es limitada / insuficiente para prueba diagnóstica independiente | B | Lucas N, Macaskill P, Irwig L, Moran R, Bogduk N. Reliability of physical examination for diagnosis of myofascial trigger points. *Clin J Pain.* 2009 |
| MTrP hallado ≠ causa demostrada; ausente ≠ exclusión miofascial | A (lógica clínica + las dos anteriores) | Framework Physioguide |

**AI rule:** Declarar controversia. No usar palpación como gold standard.

---

## TESTS REGIONALES — QUÉ DICE LA LITERATURA (CUALITATIVO)

Cifras exactas **solo** si aparecen en un chunk Physioguide citado; aquí solo el **sentido** respaldado por revisiones:

| Dominio | Mensaje basado en evidencia | Fuentes ancla |
|---------|-----------------------------|---------------|
| Hombro (Neer/Hawkins/Jobe aislados) | Precisión **mixta/limitada** en aislamiento; no confirman «pinzamiento»; negativos no excluyen RCRSP | Hegedus EJ et al. BJSM systematic reviews of shoulder exam; Lewis J. RCRSP papers; JOSPT rotator cuff CPG |
| Cervical radiculopatía | Cluster (Wainner) > test aislado; Spurling más útil para **subir** sospecha que para **excluir** | Wainner RS et al. *Spine* 2003; Tong/Haig Spurling; Blanpied JOSPT Neck Pain 2017 |
| LCA (Lachman) | De los mejores tests clínicos de LCA en metaanálisis; **aún imperfecto** (agudo/guarda) | Benjaminse A et al. JOSPT 2006; van Eck et al.; Logerstedt JOSPT knee ligament CPG |
| Menisco (McMurray/Thessaly) | Precisión aislada **limitada/mixta**; negativos no excluyen | Hegedus / meniscal exam reviews; JOSPT meniscus CPG (Logerstedt et al.) |
| Cadera FADIR | Útil para **hip-related** groin; **no** confirma FAI; morfología ≠ dolor | Griffin et al. Warwick Agreement *BJSM* 2016; Reiman hip exam reviews |
| STC (Phalen/Tinel) | Mejores en **cluster** (historia + compresión); un negativo no descarta | D’Arcy CA, McGee S. JAMA Rational Clinical Exam CTS; JOSPT CTS CPG 2019 |
| Fractura tobillo | Ottawa Rules: cribado de **imagen**, no de esguince | Stiell IG et al. Ottawa Ankle Rules |
| Fractura cervical trauma | Canadian C-spine / NEXUS **antes** de Spurling | Stiell / Hoffman |
| SLR | Útil en contexto de ciática familiar; **no** confirma hernia; negativo no excluye | van der Windt et al. Cochrane-related SLR diagnostic literature (cualitativo) |

---

## DOLOR REFERIDO COMO FENÓMENO vs MAPAS

| Tipo | Qué implica | Nivel típico |
|------|-------------|--------------|
| **Experimental** | El músculo/tejido estimulado en laboratorio puede producir dolor a distancia (fenómeno). Facetas/SIJ/cadera bajo provocación pueden referir (Dwyer/Bogduk, Dreyfuss, McCall, Fortin, Lesher) | B (mecanismo / mapa de provocación) — **no** valida un mapa comercial muscular ni un test de palpación |
| **Clínica** | Patrón descrito en pacientes / CPG / clusters | A–C según fuente |
| **Tradicional** | Mapas clásicos de atlas | D / insufficient para causalidad |

**Citation (experimental phenomenon):** Graven-Nielsen T, Arendt-Nielsen L. work on experimental muscle pain and referred pain mechanisms (p. ej. *Nat Rev Rheumatol* y literatura de suero hipertónico) — usar para «el referido existe como fenómeno», **no** para copiar mapas musculares.

---

## RELACIÓN CON PRUEBA NEGATIVA

Si fiabilidad o sensibilidad son limitadas/mixtas → un negativo **reduce poco** la probabilidad pretest → no excluir.

Ver `negative-test-reasoning.md`.

## AI rule

Citar revisiones/CPG por nombre. Nunca inventar números. Palpación MTrP = hipótesis, no test definitivo.
