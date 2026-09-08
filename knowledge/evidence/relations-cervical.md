# PHYSIOGUIDE — GRAFO DE RELACIONES: CERVICAL (ACTIVE)

**Capa:** Evidencia / relations graph  
**Status:** ACTIVE v2 (upgraded from pilot)  
**JSON:** [`../relations/cervical.json`](../relations/cervical.json)  
**Schema:** [`../schema/clinical-relation.schema.json`](../schema/clinical-relation.schema.json)  
**Companions:** [`referred-pain-cervical.md`](./referred-pain-cervical.md), [`../clinical-reasoning/cervical-referred-differential.md`](../clinical-reasoning/cervical-referred-differential.md)

**Regla:** No inventar Sn/Sp. Etiquetar experimental / clínica / tradicional. SNOOP / mielopatía / Canadian C-Spine antes de mapas.

---

## PROPÓSITO

Hacer recuperable por RAG el **grafo activo** cervical: referido a escápula/hombro/brazo/cabeza, negativos (Spurling/ULTT), coexistencia, red flags.

---

## RELACIONES CLAVE (RESUMEN)

| id | relationship | evidence | class |
|----|--------------|----------|-------|
| cervical-may-refer-pain-to-scapula-shoulder | may_refer_pain_to | B | clinical |
| cervical-facet-may-refer-to-scapula-shoulder-girdle | may_refer_pain_to | B | experimental |
| cervical-may-refer-pain-to-upper-limb | may_refer_pain_to | B | clinical |
| cervical-may-contribute-to-cervicogenic-headache-pattern | may_refer_pain_to | B | clinical |
| spurling-negative-does-not-exclude-cervical-radiculopathy | negative_test_does_not_exclude | B | n/a |
| ultt-negative-does-not-exclude-neural-contribution | negative_test_does_not_exclude | C | n/a |
| cervical-may-coexist-with-rcrsp | may_coexist_with | B | clinical |
| cervical-may-coexist-with-thoracic-contribution | may_coexist_with | C | clinical |
| radiculopathy-tested-by-wainner-type-cluster | tested_by | B | clinical |
| upper-trapezius-may-mimic-neck-shoulder-head-traditional | may_mimic | D | traditional |
| levator-scapulae-may-mimic-scapular-angle-pain-traditional | may_mimic | D | traditional |
| cervical-myelopathy-red-flag-if-gait-or-hand-clumsiness | red_flag_if | A | n/a |
| canadian-cspine-red-flag-if-trauma-criteria | red_flag_if | A | n/a |

---

## AI RULE

Cuello / escápula / brazo / cefalea con posible origen cervical: red flags (SNOOP, mielopatía, trauma/C-Spine) → cluster tipo Wainner + neuro → coexistencia hombro/torácico → miofascial solo D/tradicional con dolor familiar. Spurling− / ULTT− no excluyen. Nunca «es C5» ni «es el trapecio» por mapa. Fuente: pack `cervical` v2.

**Citation:** Wainner 2003; Tong/Haig Spurling; Blanpied JOSPT 2017; Dwyer/Aprill/Bogduk; Fukui 1996; Bogduk/Govind cervicogenic HA; Stiell Canadian C-Spine 2001; Cook myelopathy clusters; Tough 2007; Lucas 2009; OPTIMa/Briganti thoracic themes.
