# PHYSIOGUIDE AI — THORACIC MASTER INTEGRATION

**Status:** ACTIVE (router torácico — orquesta RF + TSP mecánico + referidos)  
**Evidence:** Ver `thoracic-redflags-visceral.md`, `thoracic-spine-pain.md`, `referred-pain-thoracic.md`, OPTIMa 2015, Briganti 2023, AHA/ACC 2021.  
**Spine master:** Extiende `spine-master-integration.md` (cuello + lumbar + **torácico**).

---

## 1. DEFINITION

Capa de **enrutamiento** para dolor de **espalda media / interescapular / pared torácica** percibido como MSK.

No inventa CPG donde no existe. Prioriza **seguridad**, luego **compatibilidad** mecánica y referidos (cervical, hombro, costal).

---

## 2. MASTER FLOW

```
MID-BACK / CHEST WALL / INTERSCAPULAR
    ↓
VISCERAL / CARDIAC / PULMONARY / AORTIC GATE  →  URGENCIAS
    ↓
FRACTURE / FRAGILITY / TRAUMA GATE  →  imagen/médico
    ↓
¿DOMINA CUELLO O HOMBRO?
    → cervical / shoulder modules
    ↓
TSP MECÁNICO NO ESPECÍFICO (thoracic-spine-pain.md)
    ↓
REFERIDOS (referred-pain-thoracic.md) + coexistencia
    ↓
RECOMENDACIÓN (educación / carga / multimodal cauteloso)
```

---

## 3. MODULE MAP

| Rama | Módulo |
|------|--------|
| Seguridad visceral/fractura | `thoracic-redflags-visceral.md` |
| Mecánico no específico | `thoracic-spine-pain.md` |
| Referidos T / costilla / escápula | `referred-pain-thoracic.md` |
| Cuello | `cervical-neck-pain.md` |
| Hombro | módulos shoulder |
| Lumbar bajo / ciática | módulos lumbar (si localización baja) |

---

## 4. AI RULES (resumen)

- Sin CPG torácica específica → no fingir certeza diagnóstica estructural.  
- OPTIMa: evidencia de tratamiento **escasa**; no vender manipulación como superior a placebo de forma robusta.  
- Dreyfuss faceta T = mapa experimental ≠ diagnóstico de consultorio.  
- «T4 syndrome» = evidencia limitada / tradicional.  
- Siempre lenguaje «compatible con».

---

## 5. CITATIONS

Briganti 2023 (PMC10197218); OPTIMa / Southerst 2015 (PMID 26141077); AHA/ACC Chest Pain 2021; Dreyfuss 1994 *Spine*.
`}
