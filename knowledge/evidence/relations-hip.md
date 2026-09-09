# PHYSIOGUIDE — GRAFO DE RELACIONES: HIP / INGLE / GTPS (ACTIVE)

**Capa:** Evidencia / relations graph  
**Status:** ACTIVE v2 (upgraded from pilot)  
**JSON:** [`../relations/hip.json`](../relations/hip.json)  
**Schema:** [`../schema/clinical-relation.schema.json`](../schema/clinical-relation.schema.json)  
**Companions:** [`referred-pain-hip.md`](./referred-pain-hip.md), [`../clinical-reasoning/hip-referred-differential.md`](../clinical-reasoning/hip-referred-differential.md)

**Regla:** No inventar Sn/Sp. Etiquetar experimental / clínica / tradicional. Red flags antes de mapas.

---

## PROPÓSITO

Grafo activo de cadera/ingle: referido lumbar, FADIR/FABER/Trendelenburg negativos, Doha, GTPS, AVN/fractura, piriformis tradicional.

---

## RELACIONES CLAVE (RESUMEN)

| id | relationship | evidence | class |
|----|--------------|----------|-------|
| lumbar-may-refer-pain-to-groin-or-lateral-hip | may_refer_pain_to | B | clinical |
| fadir-negative-does-not-exclude-intraarticular-hip | negative_test_does_not_exclude | B | n/a |
| faber-negative-does-not-exclude-hip-or-sij-contribution | negative_test_does_not_exclude | C | n/a |
| trendelenburg-negative-does-not-exclude-gtps | negative_test_does_not_exclude | B | n/a |
| adductor-related-may-coexist-with-hip-joint-pain | may_coexist_with | B | clinical |
| gtps-may-mimic-lumbar-or-intraarticular-hip | may_mimic | B | clinical |
| iliopsoas-may-mimic-groin-pain | may_mimic | B | clinical |
| hip-oa-may-coexist-with-lumbar-pain | may_coexist_with | B | clinical |
| intraarticular-hip-tested-by-fadir-cluster-familiar-pain | tested_by | B | clinical |
| avn-fracture-red-flag-if-unable-weightbear-or-risk | red_flag_if | A | n/a |
| piriformis-may-mimic-buttock-sciatica-traditional | may_mimic | D | traditional |
| doha-groin-differentiated-by-entity-checklist | differentiated_by | B | clinical |

---

## AI RULE

Ingle / trocánter / glúteo: red flags óseas (carga, AVN) → lumbar + FADIR cluster (FADIR− no limpia articulación) → entidades Doha (no todo es FAI) → GTPS cluster → piriformis solo D. Fuente: pack `hip` v2.

**Citation:** Weir Doha 2015; Griffin Warwick 2016; Reiman hip tests 2015; Grimaldi/Fearon GTPS; French GTPS; Hancock SIJ; Tough/Lucas MTrP caution.

