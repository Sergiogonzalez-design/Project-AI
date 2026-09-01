# Physioguide — Shoulder expansion (31 Aug 2026)

What was added to close the gap vs the evidence-based shoulder batteries / clusters (ChatGPT share: claustro de pruebas + clusters Tier A/B/C).

**Deployed:** `ai-consult` edge function on project `klxlzzgrymkexvuelzex`  
**RAG ingest:** 73 chunks (shoulder evidence + clinical modules)

---

## 1. Evidence DB (Fase 3)

### `knowledge/evidence/shoulder-tests.md`

New test entries (format §21 — Purpose…AI rule + Citation; **no invented Sn/Sp**):

| Test id (catalog) | Clinical name |
|-------------------|---------------|
| `full-can` | Full Can (Jobe variant, thumb up) |
| — | Resisted external rotation (infra) |
| `er-lag` | ER lag sign |
| — | Hornblower’s sign |
| — | Patte / ER at 90° abduction |
| — | Drop sign (infra) |
| `belly-press` | Belly press / Napoleon |
| — | Bear hug |
| `lift-off` | Lift-off / Gerber |
| — | IR lag / belly-off |
| `surprise` | Surprise / Release (anterior instability) |
| `paxinos` | Paxinos (AC) |
| `obrien` | O’Brien / Active compression |
| `uppercut` | Uppercut (biceps) |
| `crank` | Crank (labral screening) |
| — | Anterior slide (labral screening) |
| `kim-test` | Kim test (posterior instability) |
| `jerk-test` | Jerk test (posterior instability) |
| — | Posterior apprehension |
| — | Sulcus sign |
| — | Gagey / hyperabduction |
| — | Resisted internal rotation |
| — | Scapular assistance (SAT) |
| — | Scapular retraction (SRT) |

### `knowledge/evidence/clusters-shoulder.md`

New **Tier A / B / C** hierarchy:

| Tier | Clusters |
|------|----------|
| **A — Validated** | Anterior instability (Apprehension + Relocation ± Surprise); AC (Paxinos + O’Brien / Paxinos + Hawkins); Cervical Wainner |
| **B — Moderate** | Cuff tear (global + infra + subscap subclusters); SLAP screening (O’Brien+Crank / Yergason+Anterior slide — **never confirm**); Posterior instability (Kim + Jerk); Supraspinatus subcomponent |
| **C — Clinical battery** | RCRSP; Biceps PLB; Capsulitis; GH OA; Scapular dyskinesis; MDI / laxity |

---

## 2. Clinical reasoning modules

| File | Change |
|------|--------|
| `shoulder-lateral-rcrsp.md` | Full Can; infra/subscap Tier B subclusters; expanded exam |
| `shoulder-instability-trauma.md` | Surprise in Tier A; Sulcus/Gagey MDI (Tier C) |
| `shoulder-superior-ac.md` | Paxinos + O’Brien Tier A alongside cross-body |
| `shoulder-anterior-pain.md` | Uppercut; pointer to SLAP screen module |
| `shoulder-master-integration.md` | Full Tier A/B/C table + module map |
| **`shoulder-posterior-instability.md`** | **NEW** — Kim + Jerk Tier B |
| **`shoulder-slap-labrum-screen.md`** | **NEW** — screening only, never “SLAP confirmado” |

---

## 3. AI rules (code — dual sync)

| Path | Notes |
|------|--------|
| `lib/physioguide-shoulder-*-rules.ts` | Updated master, lateral, anterior, AC, instability |
| `lib/physioguide-shoulder-posterior-instability-rules.ts` | **NEW** |
| `lib/physioguide-shoulder-slap-labrum-screen-rules.ts` | **NEW** |
| `lib/physioguide-evidence-db-rules.ts` | Shoulder shortcuts Tier A/B/C |
| `lib/ai-consult-rules.ts` | Wired new blocks |
| `mobile/src/lib/*` | Mirrors of the above |
| `supabase/functions/ai-consult/response-rules.ts` | Edge copy synced |
| `supabase/functions/ai-consult/index.ts` | Imports + physio_chat / physio_report prompts |

---

## 4. Decision tree + patient bank

- `lib/clinical-reasoning/trees.ts` (+ mobile): entryByTestId + nodes for Surprise, Kim/Jerk, Full Can, ER lag, Belly press, Lift-off, Uppercut, Crank, O’Brien, Paxinos, SLAP screen
- `lib/consulta-functional-tests.ts`: extra shoulder YES/NO questions (drop-arm control, RE/RI strength, AC cross-body)

---

## 5. Illustrated catalog (IDs registered)

In `lib/clinical-test-images.ts` (CDN paths). **Media pending** until `.webp` + `.mp4` are generated:

`full-can`, `surprise`, `paxinos`, `obrien`, `uppercut`, `crank`, `er-lag`, `belly-press`, `lift-off`, `kim-test`, `jerk-test`

See companion doc: `public/clinical-tests/SHOULDER_NEW_TESTS_VIDEO_PROMPTS.md`

---

## 6. Explicit non-goals (by design)

- No invented sensitivity / specificity / LR numbers
- No “impingement confirmed” / “SLAP confirmed” from special tests alone
- Patient-facing language stays everyday YES/NO (no Neer/Hawkins jargon in patient UI)
- New illustrations/videos are a separate media pipeline (prompts + initial images doc)
