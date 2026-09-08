# PHYSIOGUIDE — GRAFO DE RELACIONES: ANKLE / FOOT (ACTIVE)

**Capa:** Evidencia / relations graph  
**Status:** ACTIVE v2 (upgraded from pilot)  
**JSON:** [`../relations/ankle-foot.json`](../relations/ankle-foot.json)  
**Schema:** [`../schema/clinical-relation.schema.json`](../schema/clinical-relation.schema.json)  
**Companions:** [`referred-pain-ankle-foot.md`](./referred-pain-ankle-foot.md)

**Regla:** No inventar Sn/Sp. Etiquetar experimental / clínica / tradicional. Red flags antes de mapas.

---

## PROPÓSITO

Grafo activo tobillo/pie: Ottawa, drawer−, syndesmosis, Thompson, fascitis/Windlass−, estrés calcáneo, S1 mimic, miofascial D.

---

## RELACIONES CLAVE (RESUMEN)

| id | relationship | evidence | class |
|----|--------------|----------|-------|
| ottawa-raises-suspicion-when-malleolar-or-midfoot-criteria-met | raises_suspicion_when | A | n/a |
| anterior-drawer-negative-does-not-exclude-atfl-sprain | negative_test_does_not_exclude | B | n/a |
| lumbar-s1-may-refer-or-mimic-lateral-foot-pain | may_mimic | B | clinical |
| thompson-raises-suspicion-when-absent-plantarflexion-squeeze | raises_suspicion_when | B | n/a |
| plantar-fascia-may-coexist-with-proximal-contributors | may_coexist_with | B | clinical |
| syndesmosis-may-mimic-lateral-sprain | may_mimic | B | clinical |
| windlass-negative-does-not-exclude-plantar-heel-pain | negative_test_does_not_exclude | B | n/a |
| peroneal-may-mimic-lateral-ankle-pain | may_mimic | C | clinical |
| calcaneal-stress-fracture-raises-suspicion-when | raises_suspicion_when | B | clinical |
| ottawa-midfoot-red-flag-if-navicular-or-fifth-mt-criteria | red_flag_if | A | n/a |
| achilles-may-coexist-with-plantar-heel-load-factors | may_coexist_with | C | clinical |
| gastrocnemius-may-mimic-heel-calf-pain-traditional | may_mimic | D | traditional |

---

## AI RULE

Tobillo/pie agudo: Ottawa primero; drawer− no limpia ATFL; sospecha syndesmosis/peroneos; Thompson si pop; talón: Windlass− no excluye fascitis; squeeze si estrés; S1 solo con pistas proximales. Fuente: pack `ankle-foot` v2.

**Citation:** Stiell Ottawa 1993; Bachmann 2003; Vuurberg BJSM 2018; Martin Heel Pain CPG 2014; Thompson/Simmonds; Delitto LBP referred; Tough/Lucas.

