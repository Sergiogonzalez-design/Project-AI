# Physioguide — Elbow / wrist / hand gaps vs ChatGPT clusters (31 Aug 2026)

**Source chat:** [Cluster pruebas codo mano](https://chatgpt.com/share/6a958c67-1718-83eb-9f6e-67b0dc37ae93)  
**Note:** [https://chatgpt.com/share/6a958bcd-b90c-83eb-adca-ac8066418973](https://chatgpt.com/share/6a958bcd-b90c-83eb-adca-ac8066418973) is the **shoulder** chat (already expanded 31 Aug). Ignore for this pass.

**Media pack:** [`public/clinical-tests/ELBOW_WRIST_HAND_NEW_TESTS_VIDEO_PROMPTS.md`](../public/clinical-tests/ELBOW_WRIST_HAND_NEW_TESTS_VIDEO_PROMPTS.md)  
**PDFs para Admin → Conocimientos:** [`docs/knowledge-ingest/`](../docs/knowledge-ingest/) (texto seleccionable; regenerar con `node docs/generate-ehw-knowledge-pdfs.mjs`)

Rules: no invented Sn/Sp; never “STC / De Quervain / TFCC / UCL confirmado” from one test.

---

## Already covered (keep; refine only)

| Area | In AI today |
|------|-------------|
| LET / medial epicondylalgia | `elbow-epicondylalgia.md` + Cozen, Mill, resisted wrist flexion (+ videos) |
| STC / cubital | `elbow-wrist-neural.md` + Phalen, Tinel, elbow-flexion-cubital (+ videos) |
| De Quervain | `wrist-dequervain.md` + Finkelstein (+ video) |
| Escafoides | `wrist-trauma-scaphoid.md` + snuffbox, thumb-axial-load (+ videos) |
| TFCC (light) | `tfcc-ulnar-load` image/video + adaptive wording; **no dedicated module / fovea / piano-key** |
| CMC OA | `cmc-grind` (+ video) |
| UCL pulgar | `thumb-ucl-stress` (+ video) + finger clusters |
| Trigger / jersey / mallet | `finger-hand-tests.md` + `finger-digital-pain` rules — **no catalog videos** |
| Cervical screen | Spurling / ULTT / distraction |
| Master router | `elbow-wrist-master-integration.md` |

---

## Still needs to go into the AI (code + RAG)

### A. Evidence DB (`knowledge/evidence/`)

Add §21 entries (Purpose…AI rule + Citation; mixed evidence explicit):

| Priority | Test | Why |
|----------|------|-----|
| P0 | **Maudsley** (middle-finger extension) | LET cluster + radial tunnel differential |
| P0 | **Durkan** / carpal compression | STC cluster (Phalen+Tinel alone incomplete) |
| P0 | **WHAT** (wrist hyperflexion + thumb abduction) | De Quervain cluster with Finkelstein |
| P0 | **Hook test** (+ biceps squeeze as text) | Distal biceps rupture |
| P1 | **Moving valgus** + **Milking** | Elbow UCL (throwers) |
| P1 | **Watson / scaphoid shift** | Scapholunate instability |
| P1 | **Fovea sign** + **Press test** (text OK) | TFCC cluster with ulnar load |
| P1 | **Piano-key / DRUJ ballottement** | DRUJ vs TFCC |
| P1 | **Froment** (± Wartenberg text) | Cubital motor deficit |
| P2 | Lateral pivot-shift / chair push-up | PLRI (specialist; text-first OK) |
| P2 | LT ballottement / Kleinman / Reagan | LT instability (text-first) |
| P2 | CMC lever | Optional next to grind |

Update `clusters-elbow-wrist.md` + `clusters-finger-hand.md` with **Tier A/B/C** like shoulder:

| Tier | Clusters to add/upgrade |
|------|-------------------------|
| **A** | STC: history + **Durkan** + Phalen ± Tinel; De Quervain: palpation + **WHAT** ± Finkelstein |
| **B** | LET: palpation + Cozen + Mill ± **Maudsley**; Cubital: symptoms + elbow flexion ± Tinel ± **Froment**; Distal biceps: **Hook** + contour/strength; TFCC: fovea + ulnar load ± piano-key |
| **C** | Elbow UCL (moving valgus + milking); SL (Watson); PLRI; LT; CMC lever; distal triceps |

### B. Clinical modules

| New / expand | File |
|--------------|------|
| **NEW** Distal biceps rupture | `knowledge/clinical-reasoning/elbow-distal-biceps.md` |
| **NEW** Elbow UCL / medial instability | `knowledge/clinical-reasoning/elbow-ucl-medial.md` |
| **NEW** TFCC / ulnar wrist | `knowledge/clinical-reasoning/wrist-tfcc-ulnar.md` |
| **NEW** Carpal instability (SL ± LT) | `knowledge/clinical-reasoning/wrist-carpal-instability.md` |
| Expand LET | Maudsley + radial tunnel note in `elbow-epicondylalgia.md` |
| Expand STC | Durkan in `elbow-wrist-neural.md` |
| Expand De Quervain | WHAT in `wrist-dequervain.md` |
| Expand master | Wire new branches in `elbow-wrist-master-integration.md` |
| Optional P2 | PLRI / LCL module (text clusters only first) |

### C. Dual-sync wiring (same as shoulder)

- `lib/physioguide-*-rules.ts` (+ mobile mirrors)
- `lib/ai-consult-rules.ts`, mobile copy, `supabase/functions/ai-consult/response-rules.ts`
- `lib/clinical-reasoning/trees.ts` (+ mobile) entryByTestId for new ids
- Adaptive questionnaire YES/NO where patient-facing is safe (no jargon)
- Append region rules to physio_chat / physio_report in `ai-consult/index.ts`
- Ingest: `node scripts/ingest-clinical-reasoning.mjs` (elbow/wrist/finger files)
- Deploy `ai-consult`

### D. Illustrated catalog

Register new ids in `lib/clinical-test-images.ts` (+ mobile) after webp+mp4 exist — see media pack.

---

## Explicit non-goals

- No invented LR / Sn / Sp from the ChatGPT tables
- No “confirmado” from special tests alone
- No full PLRI OR suite as patient YES/NO bank (clinician-oriented text is enough for P2)
- Second ChatGPT URL = shoulder — already done
