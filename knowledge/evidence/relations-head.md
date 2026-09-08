# PHYSIOGUIDE — GRAFO DE RELACIONES: HEAD / CEFALEA (ACTIVE)

**Capa:** Evidencia / relations graph  
**Status:** ACTIVE v2 (upgraded from pilot)  
**JSON:** [`../relations/head.json`](../relations/head.json)  
**Schema:** [`../schema/clinical-relation.schema.json`](../schema/clinical-relation.schema.json)  
**Companions:** [`referred-pain-head.md`](./referred-pain-head.md)

**Regla:** No inventar Sn/Sp. Etiquetar experimental / clínica / tradicional. Red flags antes de mapas.

---

## PROPÓSITO

Grafo activo cefalea: SNOOP/GCA/concussion, cervicogénica, migraña coexistente, TMD, negativos cervicales, vestibular ≠ SCM, miofascial D.

---

## RELACIONES CLAVE (RESUMEN)

| id | relationship | evidence | class |
|----|--------------|----------|-------|
| snoop-red-flag-if-secondary-headache-features | red_flag_if | A | clinical |
| cervical-may-refer-pain-to-head-cervicogenic | may_refer_pain_to | B | clinical |
| migraine-pattern-may-mimic-cervicogenic-or-myofascial | may_mimic | B | clinical |
| upper-trap-scm-may-mimic-headache-traditional | may_mimic | D | traditional |
| tmd-may-mimic-or-coexist-with-headache | may_coexist_with | B | clinical |
| flexion-rotation-negative-does-not-exclude-cervicogenic | negative_test_does_not_exclude | C | n/a |
| cervicogenic-tested-by-neck-provocation-pattern | tested_by | B | clinical |
| migraine-may-coexist-with-cervical-pain | may_coexist_with | B | clinical |
| concussion-red-flag-if-trauma-worsening-neuro | red_flag_if | A | n/a |
| giant-cell-arteritis-red-flag-if-age-jaw-vision | red_flag_if | A | n/a |
| suboccipital-may-mimic-occipital-headache-traditional | may_mimic | D | traditional |
| vestibular-differentiated-by-dizziness-pattern-not-scm | differentiated_by | B | clinical |

---

## AI RULE

Cefalea: SNOOP / GCA / trauma primero → patrón ICHD (migraña/TTH) vs cervicogénica (cuello provoca tras seguridad) → TMD puede coexistir → flexión-rotación− no excluye → miofascial solo D; no atribuir vértigo al SCM. Fuente: pack `head` v2.

**Citation:** ICHD-3 2018; Bogduk/Govind 2009; Blanpied 2017; Tough 2007; Lucas 2009; GCA pathway literature.

