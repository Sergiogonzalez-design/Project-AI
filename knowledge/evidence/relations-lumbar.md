# PHYSIOGUIDE — GRAFO DE RELACIONES: LUMBAR (ACTIVE)

**Capa:** Evidencia / relations graph  
**Status:** ACTIVE v2 (upgraded from pilot)  
**JSON:** [`../relations/lumbar.json`](../relations/lumbar.json)  
**Schema:** [`../schema/clinical-relation.schema.json`](../schema/clinical-relation.schema.json)  
**Companions:** [`referred-pain-lumbar.md`](./referred-pain-lumbar.md), [`../clinical-reasoning/lumbar-referred-differential.md`](../clinical-reasoning/lumbar-referred-differential.md)

**Regla:** No inventar Sn/Sp. Etiquetar experimental / clínica / tradicional. Red flags antes de mapas.

---

## PROPÓSITO

Hacer recuperable por RAG el **grafo activo** lumbar: referido a glúteo/muslo, hip–spine, negativos (SLR/Kemp), SIJ, estenosis, inflamatorio, cauda, miofascial D.

---

## RELACIONES CLAVE (RESUMEN)

| id | relationship | evidence | class |
|----|--------------|----------|-------|
| hip-may-refer-or-mimic-lumbar-buttock-pain | may_mimic | B | clinical |
| slr-negative-does-not-exclude-lumbar-radiculopathy | negative_test_does_not_exclude | B | n/a |
| kemp-negative-does-not-exclude-mechanical-lbp | negative_test_does_not_exclude | C | n/a |
| lumbar-may-refer-pain-to-buttock-thigh | may_refer_pain_to | B | clinical |
| cauda-equina-red-flag-if-saddle-or-sphincter-change | red_flag_if | A | n/a |
| lumbar-facet-may-refer-to-buttock-thigh | may_refer_pain_to | B | experimental |
| sij-may-mimic-lumbar-buttock-pain | may_mimic | C | clinical |
| lumbar-may-coexist-with-hip-contribution | may_coexist_with | B | clinical |
| radiculopathy-tested-by-slr-neuro-cluster | tested_by | B | clinical |
| stenosis-differentiated-by-neurogenic-claudication-pattern | differentiated_by | B | clinical |
| gluteus-medius-may-mimic-buttock-pain-traditional | may_mimic | D | traditional |
| inflammatory-back-pain-raises-suspicion-when-inflammatory-features | raises_suspicion_when | B | clinical |

---

## AI RULE

Lumbalgia / glúteo / pierna: cauda y red flags → neuro + SLR/cluster (SLR− no excluye) → hip–spine / SIJ limitados → patrón estenosis o inflamatorio si encaja → miofascial solo D/tradicional. Nunca «es la faceta L4» ni «es el glúteo medio» por mapa. Fuente: pack `lumbar` v2.

**Citation:** Delitto JOSPT 2012; van der Windt Cochrane 2010; Hancock 2007; Bogduk referred/radicular; McCall/Fukui facet maps; Laslett SIJ; NICE/cauda; ASAS inflammatory features; Tough 2007; Lucas 2009; Reiman hip–spine.

