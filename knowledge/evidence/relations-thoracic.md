# PHYSIOGUIDE — GRAFO DE RELACIONES: THORACIC (ACTIVE)

**Capa:** Evidencia / relations graph  
**Status:** ACTIVE v2 (upgraded from pilot)  
**JSON:** [`../relations/thoracic.json`](../relations/thoracic.json)  
**Schema:** [`../schema/clinical-relation.schema.json`](../schema/clinical-relation.schema.json)  
**Companions:** [`referred-pain-thoracic.md`](./referred-pain-thoracic.md)

**Regla:** No inventar Sn/Sp. Etiquetar experimental / clínica / tradicional. Red flags antes de mapas.

---

## PROPÓSITO

Grafo activo torácico: visceral/cardíaco/PE primero, faceta experimental, cervical referido, costilla/hombro, mielopatía, romboides/serrato D.

---

## RELACIONES CLAVE (RESUMEN)

| id | relationship | evidence | class |
|----|--------------|----------|-------|
| cardiac-visceral-red-flag-if-chest-or-interscapular-pain | red_flag_if | A | clinical |
| thoracic-facet-may-refer-pain-to-axial-or-interscapular | may_refer_pain_to | C | experimental |
| cervical-may-refer-pain-to-medial-scapula | may_refer_pain_to | B | clinical |
| rhomboid-may-mimic-interscapular-pain-traditional | may_mimic | D | traditional |
| thoracic-may-coexist-with-cervical-contribution | may_coexist_with | C | clinical |
| rib-may-mimic-thoracic-or-chest-wall-pain | may_mimic | C | clinical |
| shoulder-may-refer-or-mimic-interscapular-pain | may_mimic | B | clinical |
| thoracic-mechanical-tested-by-arom-familiar-pain | tested_by | C | clinical |
| pe-pulmonary-red-flag-if-dyspnoea-pleuritic | red_flag_if | A | n/a |
| thoracic-disc-may-refer-pain-to-chest-wall | may_refer_pain_to | C | clinical |
| myelopathy-red-flag-if-gait-or-hand-clumsiness-with-thoracic-pain | red_flag_if | A | n/a |
| serratus-may-mimic-lateral-chest-pain-traditional | may_mimic | D | traditional |

---

## AI RULE

Dolor interescapular/tórax: visceral/ACS/PE/aorta primero → mielopatía si tractos largos → cervical + torácico AROM + hombro → faceta experimental ≠ palpación → miofascial solo D. Fuente: pack `thoracic` v2.

**Citation:** Gulati Chest Pain 2021; Dreyfuss thoracic facet 1994; Dwyer/Fukui cervical; Blanpied 2017; OPTIMa/Briganti; Cook myelopathy; Tough/Lucas.

