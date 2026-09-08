# PHYSIOGUIDE — PRECISIÓN DIAGNÓSTICA CITADA (SOLO FUENTES NOMBRADAS)

**Capa:** Fase 3 evidence DB  
**Status:** ACTIVE (2026-09 polish)  
**Regla de oro:** Solo cifras que aparecen **en la cita nombrada**. Si no está aquí ni en un chunk Physioguide citado → **cualitativo** (mixta / limitada / no excluye). Nunca redondear de memoria ni inventar IC.

**Companion:** `test-reliability-framework.md`, `negative-test-reasoning.md`, packs `relations/*.json`

---

## CÓMO USARLO (AI)

1. Si citas un número → nombra el paper/meta y di que es **de esa fuente**, con IC si está abajo.  
2. IC anchos → no hables como certeza clínica.  
3. Un test/cluster **no** = diagnóstico confirmado.  
4. Preferir lenguaje: «según Wainner 2003…», «meta Bachmann 2003…».

---

## CLUSTER CERVICAL RADICULOPATÍA (Wainner 2003)

**Source:** Wainner RS et al. *Spine.* 2003;28:52-62.  
**Items (4):** ULTT A +, rotación ipsilateral <60°, Spurling A +, distracción +.

| Criterios + | Sn (IC95%) | Sp (IC95%) | LR+ (IC95%) | LR− |
|-------------|------------|------------|-------------|-----|
| 2/4 | 0.39 (0.16–0.61) | 0.56 (0.43–0.68) | ~0.9–2.5* | ~1.09 |
| 3/4 | 0.39 (0.16–0.61) | 0.94 (0.88–1.0) | **6.1 (2.0–18.6)** | 0.65 |
| 4/4 | 0.24 (0.05–0.43) | 0.99 (0.97–1.0) | **30.3 (1.7–538.2)** | 0.77 |

\*Ver tabla original; IC del LR+ en 2/4 es amplio / poco útil para subir sospecha.

**Limitations (del propio estudio):** n=82; IC del LR+ en 4/4 **muy ancho**; cluster de desarrollo — validación independiente posterior existe pero no sustituye juicio clínico. ULTT A fue el ítem más útil para **bajar** sospecha cuando negativo (cualitativo del paper: útil para ruling out relativo).

**AI rule:** Puedes citar LR+ 6.1 (3/4) y 30.3 (4/4) **solo** atribuyendo a Wainner 2003 + avisando IC anchos. Nunca «radiculopatía confirmada».

---

## OTTAWA ANKLE RULES (Bachmann 2003 meta)

**Source:** Bachmann LM et al. *BMJ.* 2003;326:417-419.  
**Purpose:** Excluir fractura de tobillo/mediopié para decidir radiografía — **no** diagnostica esguince.

| Métrica | Valor reportado |
|---------|-----------------|
| Sn pooled (estudios) | **97.6%** (IC95% 96.4–98.9) |
| Sp mediana | **31.5%** (IQR 23.8–44.4) |
| LR− pooled tobillo | **0.08** (0.03–0.18) |
| LR− pooled mediopié | **0.08** (0.03–0.20) |

**AI rule:** «Ottawa negativas → probabilidad de fractura clínicamente relevante baja según Bachmann 2003; Sp modesta → muchas RX siguen estando indicadas si reglas +.» No uses Ottawa para graduar esguince ATFL.

---

## LACHMAN — LCA (Benjaminse 2006 meta)

**Source:** Benjaminse A et al. *JOSPT.* 2006.  
**Lachman sin anestesia (pooled):**

| Métrica | Valor (IC95%) |
|---------|----------------|
| Sn | **85%** (83–87) |
| Sp | **94%** (92–95) |
| LR+ | **10.2** (4.6–22.7) |
| LR− | **0.2** (0.1–0.3) |

**Pivot shift (mismo meta):** Sp **98%** (96–99), Sn **24%** (21–27) — útil si +, malo para excluir.

**Limitations:** Heterogeneidad entre estudios; guarda aguda ↓ rendimiento; no sustituye RMN cuando cambia manejo; revisiones posteriores advierten posible sobreestimación en algunos contextos.

**AI rule:** Puedes citar Sn/Sp/LR de Benjaminse 2006 con atribución. Aún así: «compatible con LCA», no «rotura confirmada». Lachman − **no** exclusión perfecta (LR− 0.2).

---

## OTROS — SOLO CUALITATIVO AQUÍ

No rellenar cifras inventadas. Usar cualitativo + cita:

| Tema | Mensaje | Fuente ancla |
|------|---------|--------------|
| Spurling aislado | Suele ser más específico que sensible; − no excluye | Tong/Haig; Wainner; revisiones Spurling |
| Canadian C-Spine | Regla validada de imagen tras trauma; seguir protocolo local | Stiell JAMA 2001 |
| Menisco McMurray/Thessaly | Precisión aislada mixta/limitada | Hegedus; Solomon JAMA RCE |
| FADIR | No confirma FAI; morfología ≠ dolor | Warwick Agreement; Reiman |
| Laslett SI | Composite limitado; no confirma SIJ | Hancock; Laslett |
| MTrP palpación | Fiabilidad limitada | Tough 2007; Lucas 2009 |

---

## ACTUALIZACIÓN DE PACKS / TESTS

Cuando una cifra viva aquí, los módulos regionales pueden apuntar:

- `knee-tests.md` → Lachman Benjaminse  
- `ankle-foot-tests` / relations ankle → Ottawa Bachmann  
- `spine-tests` / relations cervical → Wainner cluster  

**AI rule global:** Si el usuario pide «¿qué sensibilidad tiene X?» y X no está en esta tabla ni en RAG citado → di «no tengo una cifra Physioguide citada fiable» y habla cualitativo. Nunca inventes.
