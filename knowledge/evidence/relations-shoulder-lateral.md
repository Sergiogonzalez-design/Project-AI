# PHYSIOGUIDE — GRAFO DE RELACIONES: HOMBRO LATERAL (ACTIVE)

**Capa:** Evidencia / relations graph  
**Status:** ACTIVE v2 (upgraded from pilot)  
**JSON:** [`../relations/shoulder-lateral.json`](../relations/shoulder-lateral.json)  
**Schema:** [`../schema/clinical-relation.schema.json`](../schema/clinical-relation.schema.json)  
**Companions:** [`referred-pain-shoulder-lateral.md`](./referred-pain-shoulder-lateral.md), [`../clinical-reasoning/shoulder-lateral-referred-differential.md`](../clinical-reasoning/shoulder-lateral-referred-differential.md)

**Regla:** No inventar Sn/Sp. Etiquetar experimental / clínica / tradicional. Hipótesis, no diagnóstico.

---

## PROPÓSITO

Hacer recuperable por RAG el **grafo activo** de relaciones del dolor lateral/anterolateral de hombro: referido, negativos, coexistencia, red flags.

---

## RELACIONES CLAVE (RESUMEN)

| id | relationship | evidence | class |
|----|--------------|----------|-------|
| cervical-may-refer-to-lateral-shoulder | may_refer_pain_to | B | clinical |
| cervical-facet-may-refer-to-shoulder-girdle | may_refer_pain_to | B | experimental |
| neer-hawkins-negative-does-not-exclude-rcrsp | negative_test_does_not_exclude | B | n/a |
| jobe-negative-does-not-exclude-cuff-related-pain | negative_test_does_not_exclude | B | n/a |
| frank-weakness-raises-suspicion-important-cuff-tear | raises_suspicion_when | B | clinical |
| ac-joint-may-mimic-lateral-or-superior-shoulder | may_mimic | C | clinical |
| lhb-may-mimic-anterolateral-shoulder | may_mimic | C | clinical |
| capsulitis-differentiated-by-global-rom-loss | differentiated_by | B | clinical |
| anterior-instability-may-mimic-anterolateral-pain | may_mimic | B | clinical |
| infraspinatus-region-may-mimic-lateral-shoulder-pain-traditional | may_mimic | D | traditional |
| rcrsp-may-coexist-with-cervical-contribution | may_coexist_with | B | clinical |
| rcrsp-tested-by-load-cluster-familiar-pain | tested_by | B | clinical |
| cardiac-chest-pain-red-flag-if-shoulder-arm-symptoms | red_flag_if | A | clinical |

---

## AI RULE

En dolor lateral de hombro: seguridad (cardíaco/neuro) → cluster RCRSP/rotura → si locales pobres o cuello → cervical (facetario = experimental) → AC/LHB/capsulitis/inestabilidad → miofascial solo D/tradicional. Negativos aislados no excluyen. Coexistencia RCRSP+cervical permitida. Fuente: pack `shoulder-lateral` v2.

**Citation:** Wainner 2003; Blanpied JOSPT 2017; Dwyer/Aprill/Bogduk 1990; Fukui 1996; Hegedus BJSM; Lewis RCRSP; Farber 2006; Kelley adhesive capsulitis CPG themes; Gulati AHA/ACC 2021; Tough 2007; Lucas 2009.
