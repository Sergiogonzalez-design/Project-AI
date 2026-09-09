# PHYSIOGUIDE — FASE 3 EVIDENCE DB

Capa **aparte** de los módulos clínicos (Fase 1 razonamiento). No diagnostica. Complementa.

| Capa | Qué responde |
|------|----------------|
| Fisioguide clínico | ¿Cómo razonar este caso? (localización → cluster → diferencial) |
| **Fase 3 evidence** | ¿Qué significa **esta prueba**? ¿Qué **no** confirma? ¿Qué cita usar? |

## Formato de cada test (master doc §21)

Purpose · Position · Procedure · Positive · Pain location · Familiar pain · Clinical meaning · Limitations · Differential · AI rule · Citation

**Prohibido:** inventar sensibilidad, especificidad o LR. Si la evidencia es mixta, decirlo. Preferir **cluster**.

## Archivos

| Archivo | Contenido |
|---------|-----------|
| `hip-tests.md` | FADIR, FABER, Trendelenburg, abducción/aducción resistida, hop, SLR |
| `knee-tests.md` | Lachman, cajón, pivot, McMurray, Thessaly, valgo/varo, posterior drawer |
| `clusters-hip-knee.md` | Clusters Doha, GTPS, FAI, ACL, menisco, PFPS, ITB, LCM |
| `shoulder-tests.md` | Neer, Hawkins, Jobe, Full Can, arco, drop arm, lags, apprehension/surprise, Speed, Yergason, Uppercut, AC (cross-body, Paxinos, O'Brien), SLAP screening (Crank), Kim/Jerk, escapular, Spurling |
| `clusters-shoulder.md` | Tier A/B/C: RCRSP, rotura manguito, inestabilidad ant/post, bíceps/SLAP screen, AC, cervical, capsulitis, escapular, MDI |
| `spine-tests.md` | Spurling, ULTT, distracción, C-spine rule, SLR, crossed SLR, Kemp, Schober |
| `clusters-spine.md` | Wainner, ciática, lumbalgia mecánica, faceta (cautela), inflamatorio, cauda |
| `ankle-foot-tests.md` | Ottawa, cajón ATFL, Thompson, Matles, heel-raise, Windlass, hop, sindesmosis |
| `clusters-ankle-foot.md` | Fractura Ottawa, esguince lateral, sindesmosis, Aquiles, fascia, S1 |
| `elbow-wrist-tests.md` | Cozen, Mill, medial, Phalen, Tinel, cubital, De Quervain, escafoides |
| `elbow-wrist-tests-expansion.md` | Maudsley, Durkan, WHAT, Hook/squeeze, UCL codo, Watson, TFCC/DRUJ, Froment, PLRI, LT, CMC lever |
| `clusters-elbow-wrist.md` | LET, golfista, STC, cubital, De Quervain, cervical, escafoides |
| `clusters-elbow-wrist-hand-tiers.md` | Tier A/B/C STC, De Quervain, LET, cubital, bíceps distal, TFCC, UCL, SL/LT, PLRI |
| `finger-hand-tests.md` | Phalen, Tinel, trigger, jersey, mallet, UCL pulgar |
| `clusters-finger-hand.md` | STC, trigger, jersey, mallet, UCL, IF sprain |
| `head-tests.md` | SNOOP, Spurling (cefalea), movilidad cervical, patrón migrañoso |
| `clusters-head.md` | Cervicogénica, migraña, tensional, postraumática, coexistencia |
| `negative-test-reasoning.md` | Pretest→postest multi-región (hombro, raquis, cadera, rodilla, tobillo, codo/muñeca) |
| `evidence-levels-A-D.md` | Jerarquía A–D / insufficient |
| `test-reliability-framework.md` | Fiabilidad cualitativa; MTrP cautela |
| `referred-pain-*.md` | Cervical, hombro, lumbar, cadera, rodilla, tobillo/pie, codo/muñeca, cabeza |
| `readaptation-master.md` | Marco fases, dolor ≤3/10, regla 24 h, carga Gabbett, Rio isométricos, red flags |
| `readaptation-protocols-upper.md` | Hombro RCRSP, inestabilidad prep, codo, muñeca/mano, cervical |
| `readaptation-protocols-lower.md` | GTPS, ingle, PFPS, rotuliano, LCA temprano, esguince, fascia plantar |
| `readaptation-protocols-spine-core.md` | Lumbar McGill/McKenzie cautela, torácica, core, respiración |

Razonamiento transversal (también ingestables):

| Archivo | Contenido |
|---------|-----------|
| `../clinical-reasoning/hypothesis-exploration-mode.md` | Modo duda / no mejora / tests − |
| `../clinical-reasoning/clarity-and-no-overdiagnosis.md` | Modo claridad |
| `../clinical-reasoning/persistence-reevaluation.md` | Persistencia → reevaluar hipótesis |
| `../clinical-reasoning/no-imaging-decision.md` | Sin eco ≠ músculo |
| `../clinical-reasoning/differential-matrices-by-location.md` | Matrices por zona |
| `../clinical-reasoning/mtrp-framework.md` | MTrP + controversia |
| `../clinical-reasoning/mtrp-muscle-atlas.md` | Atlas regional (tradicional=D) |
| `../clinical-reasoning/shoulder-lateral-referred-differential.md` | Diferencial hombro lateral |

Ingest: `node scripts/ingest-clinical-reasoning.mjs hip-tests.md`

Prefijo RAG: `Physioguide — Evidencia — …`
