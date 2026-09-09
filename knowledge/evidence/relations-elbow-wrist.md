# PHYSIOGUIDE — GRAFO DE RELACIONES: ELBOW / WRIST (ACTIVE)

**Capa:** Evidencia / relations graph  
**Status:** ACTIVE v2 (upgraded from pilot)  
**JSON:** [`../relations/elbow-wrist.json`](../relations/elbow-wrist.json)  
**Schema:** [`../schema/clinical-relation.schema.json`](../schema/clinical-relation.schema.json)  
**Companions:** [`referred-pain-elbow-wrist.md`](./referred-pain-elbow-wrist.md)

**Regla:** No inventar Sn/Sp. Etiquetar experimental / clínica / tradicional. Red flags antes de mapas.

---

## PROPÓSITO

Grafo activo codo/muñeca: cervical vs LET, Cozen/Phalen/Tinel/Finkelstein/Hook/Watson negativos, Durkan/fovea, scaphoid FOOSH, coexistencia.

---

## RELACIONES CLAVE (RESUMEN)

| id | relationship | evidence | class |
|----|--------------|----------|-------|
| cervical-may-refer-or-mimic-lateral-elbow-pain | may_mimic | B | clinical |
| cozen-negative-does-not-exclude-let | negative_test_does_not_exclude | B | n/a |
| phalen-negative-does-not-exclude-cts | negative_test_does_not_exclude | B | n/a |
| tinel-negative-does-not-exclude-entrapment-neuropathy | negative_test_does_not_exclude | C | n/a |
| finkelstein-negative-does-not-exclude-dequervain | negative_test_does_not_exclude | B | n/a |
| hook-test-negative-does-not-exclude-partial-distal-biceps | negative_test_does_not_exclude | B | n/a |
| durkan-raises-suspicion-cts-in-cluster | raises_suspicion_when | B | n/a |
| fovea-sign-raises-suspicion-tfcc | raises_suspicion_when | C | n/a |
| watson-shift-negative-does-not-exclude-sl-instability | negative_test_does_not_exclude | C | n/a |
| maudsley-may-mimic-radial-tunnel | may_mimic | C | clinical |
| let-may-coexist-with-cervical-contribution | may_coexist_with | B | clinical |
| cts-differentiated-by-night-median-digit-map | differentiated_by | B | clinical |
| scaphoid-red-flag-if-foosh-snuffbox | red_flag_if | A | n/a |

---

## AI RULE

Codo/muñeca: FOOSH+tabaquera → scaphoid; LET cluster (Cozen− no excluye) + cervical; CTS por noches+mapa mediano (Phalen/Tinel− no excluyen); De Quervain/TFCC/SL con cautela; Hook− no limpia parcial de bíceps. Fuente: pack `elbow-wrist` v2.

**Citation:** Wainner 2003; Blanpied 2017; D'Arcy/McGee JAMA CTS 2000; Durkan 1991; O'Driscoll hook 2005; Tay fovea 2007; Watson 1988; Zwerus elbow 2018; Goubau WHAT 2014.

