# PHYSIOGUIDE — GRAFO DE RELACIONES: KNEE (ACTIVE)

**Capa:** Evidencia / relations graph  
**Status:** ACTIVE v2 (upgraded from pilot)  
**JSON:** [`../relations/knee.json`](../relations/knee.json)  
**Schema:** [`../schema/clinical-relation.schema.json`](../schema/clinical-relation.schema.json)  
**Companions:** [`referred-pain-knee.md`](./referred-pain-knee.md)

**Regla:** No inventar Sn/Sp. Etiquetar experimental / clínica / tradicional. Red flags antes de mapas.

---

## PROPÓSITO

Grafo activo de rodilla: referido cadera/lumbar, negativos meniscales/LCA, PFPS, colaterales, bloqueo mecánico, miofascial D.

---

## RELACIONES CLAVE (RESUMEN)

| id | relationship | evidence | class |
|----|--------------|----------|-------|
| hip-may-refer-or-mimic-knee-pain | may_refer_pain_to | B | clinical |
| mcmurray-negative-does-not-exclude-meniscal-injury | negative_test_does_not_exclude | B | n/a |
| thessaly-negative-does-not-exclude-meniscal-injury | negative_test_does_not_exclude | C | n/a |
| lachman-negative-does-not-perfectly-exclude-acl | negative_test_does_not_exclude | B | n/a |
| pfps-may-coexist-with-meniscal-or-oa-features | may_coexist_with | B | clinical |
| lumbar-may-refer-or-mimic-knee-pain | may_refer_pain_to | C | clinical |
| acl-tested-by-lachman-cluster | tested_by | B | clinical |
| meniscal-tested-by-history-jointline-cluster | tested_by | B | clinical |
| pfps-differentiated-by-load-pattern-without-trauma | differentiated_by | B | clinical |
| collateral-may-mimic-jointline-meniscal-pain | may_mimic | B | clinical |
| locked-knee-red-flag-if-true-mechanical-block | red_flag_if | A | n/a |
| quadriceps-may-mimic-anterior-knee-pain-traditional | may_mimic | D | traditional |

---

## AI RULE

Rodilla: niño → cribar cadera; trauma → LCA/menisco/colateral por mecanismo + cluster (McMurray−/Lachman− no excluyen); PFPS por carga sin pivot; bloqueo verdadero = vía urgente; miofascial solo D. Fuente: pack `knee` v2.

**Citation:** Willy PFPS CPG 2019; Crossley consensus 2016; Benjaminse ACL 2006; Solomon JAMA RCE 2001; Hegedus knee reviews; Kocher/SCFE caution; Reiman hip referred.

