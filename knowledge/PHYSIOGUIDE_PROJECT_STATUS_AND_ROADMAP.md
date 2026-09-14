# PHYSIOGUIDE AI — PROJECT STATUS & ROADMAP

Source: ChatGPT audit aligned with repo (13–14 ago 2026); refreshed 2026-09-11.

## Phase 1 clinical reasoning
- [x] Hip, Knee, Shoulder, Ankle/Foot, Elbow/Wrist, Cervical/Lumbar, Global cross-region

## Phase 1bis (finger / head)
- [x] Finger digital pain (STC vs local)
- [x] Head headache master (SNOOP / cervicogénica / primaria)

## Phase 1ter (coverage polish — 2026-09)
- [x] TMJ / TMD dedicated module
- [x] Lower leg / compartment (ACS first, MTSS/CECS/calf)
- [x] Pelvic floor / PGP (complements SI)
- [x] Post-surgery expansion: meniscus, THA/TKA, lumbar

## Phase 3 Evidence DB
- [x] All regions incl. finger/hand + head clusters
- [x] Cited accuracy polish (Wainner / Ottawa ankle / Lachman + qualitative anchors)

## QA / audit
- [x] Full end-to-end clinical QA
- [x] Final dual-sync audit — **GREEN PERFECT**  
  → `knowledge/PHYSIOGUIDE_QA_AUDIT_FINAL_2026-08-13.md`

## Still optional (not blocking)
- Illustrated test media packs (webp/mp4) where still pending
- Runtime consumer for `knowledge/relations/*.json` graphs
- Ever-broader post-op niches beyond the common screens

## Rules
- Do NOT restart completed modules unless fixing a verified bug.
- Never: positive test → confirmed diagnosis.
- Global layer supplements regional reasoning; does not replace it.
- Never invent Sn/Sp; ACS never invents mmHg cutoffs in chat.

## Status
**Physioguide clinical stack complete** for defined MSK + TMJ/lower-leg/PGP + common post-op screens. Re-run ingest after MD changes; deploy `ai-consult` after rule changes.
