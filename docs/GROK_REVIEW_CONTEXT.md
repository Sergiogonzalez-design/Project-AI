# AIKinora / Physioguide — context for external code review

**Repository:** [Sergiogonzalez-design/Project-AI](https://github.com/Sergiogonzalez-design/Project-AI)  
**Last major push:** `main` — Physioguide clinical reasoning library + elbow/wrist expansion  
**Primary language (product UI):** Spanish (`es`), with English (`en`) labels in adaptive questionnaires  
**Audience for this doc:** Grok (or any external reviewer) before reading the codebase

---

## 1. What this project is

**AIKinora** (mobile app name; web often deployed as **Project-AI / Kinora**) is a physiotherapy-oriented health platform:

- **Patients** describe pain or injury in natural language, complete structured questionnaires, and receive an AI-assisted orientation report (not a diagnosis).
- **Physiotherapists** link to patients, review consults, run clinical reasoning flows, and complete structured reports.
- **Clinics** (newer surface) manage a public directory profile, team, and branded space.

The clinical brain of the product is **Physioguide**: a deterministic + RAG-backed musculoskeletal reasoning library. The AI is designed as a **hypothesis assistant**, never an automatic diagnostician.

**Hard clinical rule (everywhere):** use language like *compatible con*, *podría explorarse*, *evidencia limitada/mixta*. Never *el problema es X*, never *negativo descarta*, never invent Sn/Sp/LR without a cited source.

---

## 2. Tech stack

| Layer | Technology |
|-------|------------|
| Web | Next.js 16 (App Router), React 19, Tailwind 4 |
| Mobile | Expo / React Native (`mobile/`), TestFlight as **AIKinora** |
| Backend | Supabase (Auth, Postgres, Storage, Edge Functions) |
| AI | OpenAI via Supabase Edge Function `ai-consult` |
| RAG | `document_chunks` table + embeddings; ingest scripts in `scripts/` |
| Deploy | Vercel (web), EAS/TestFlight (iOS), Supabase Edge (AI) |

**Supabase project ref:** `klxlzzgrymkexvuelzex` (name: projectai)

Secrets live in `.env.local` (web) and `mobile/.env` — **never committed**. See `.env.example` for variable names only.

---

## 3. User types and main surfaces

### Account types (`lib/account-type.ts`)

- `patient` — athlete / general user
- `physio` — individual physiotherapist
- `clinic` — clinic organization account

### Web routes (high level)

| Path | Purpose |
|------|---------|
| `/` | Marketing / site |
| `/consulta` (chat) | Patient AI consult flow |
| `/fisio` | Physio dashboard, patient linking, reports |
| `/clinica` | Clinic workspace (team, consulta, equipo) |
| `/buscar`, `/centro/[slug]` | Public clinic directory |
| `/admin/conocimientos` | Upload PDFs into RAG knowledge base |
| Auth | login, signup, forgot/reset password, onboarding |

### Mobile (`mobile/`)

Mirrors web consult + physio flows. Brand: **AIKinora**. Critical boot/auth handling in `mobile/App.tsx` and `mobile/index.ts` (TestFlight splash hang fixes documented in `.cursor/rules/next-testflight-aikinora.mdc`).

---

## 4. Core patient consult flow

This is the product’s main loop:

```
User: "me duele el hombro" (or any body region)
  ↓
Triage (lib/consulta-triage.ts + edge TRIAGE_SYSTEM_PROMPT)
  ↓
Adaptive questionnaire BEFORE any AI report
  (region-specific step UI where implemented)
  ↓
Formatted answers → Edge function ai-consult
  ↓
Structured report (Spanish sections + Fuente: citations)
  ↓
If not urgent and ≥24–36h: functional test battery (yes/no)
  ↓
Follow-up / physio report path
```

### Adaptive questionnaires (full step UI)

Implemented for: **shoulder, elbow, wrist_hand, finger, neck, back, hip, knee, ankle_foot**

Each region has:

- `lib/consulta-{region}-adaptive.ts` — question definitions, validation, summary text for AI
- `components/consulta-adaptive-{region}.tsx` — web UI
- `mobile/src/components/ConsultaAdaptive{Region}.tsx` — mobile UI

### AI report format (must stay consistent)

Sections include: Resumen, Estructuras, Posibles lesiones, Qué hacer mientras tanto, Qué debes hacer ahora, ¿Contactar fisio?, **Fuentes consultadas**.

Urgent cases: add imaging / medical referral guidance; skip long functional-test lists.

Non-urgent &lt;24h: rest, cold, explain swelling; retest at 24–36h.

---

## 5. Physioguide — the clinical reasoning system

Physioguide is **dual-synced**. Every clinical module change must update **both**:

### A) Deterministic code (always injected into AI prompts)

1. **Markdown module** — `knowledge/clinical-reasoning/<module>.md`
2. **TypeScript rules constant** — `lib/physioguide-<module>-rules.ts`
3. **Wire into:**
   - `lib/ai-consult-rules.ts` (web)
   - `mobile/src/lib/ai-consult-rules.ts` (mobile)
   - `supabase/functions/ai-consult/response-rules.ts` (edge — must match web)
4. **Region trees** — `lib/clinical-reasoning/trees.ts` (+ mobile copy with **relative imports**, not `@/`)
5. **Adaptive questionnaires** where patient-facing tests apply
6. **Deploy** `ai-consult` after rule changes:
   ```bash
   npx supabase functions deploy ai-consult --project-ref klxlzzgrymkexvuelzex
   ```

### B) RAG knowledge (retrieved + citable in reports)

1. Same markdown (or evidence files under `knowledge/evidence/`)
2. Ingest:
   ```bash
   node scripts/ingest-clinical-reasoning.mjs
   ```
3. Chunks land in `document_chunks` with titles like `Physioguide — Codo — epicondilalgia lateral/medial`
4. PDFs for Admin upload: `docs/knowledge-ingest/` (12 elbow/wrist expansion PDFs + README)

**Who uses what:**

| Surface | Hardcoded rules | RAG |
|---------|-----------------|-----|
| Patient consult | Yes | Yes (`fetchRagContext`) |
| /fisio report | Yes | Yes |
| Physio chat | Yes | Yes |

Never ship code-only modules without running ingest.

---

## 6. Clinical reasoning library (Sep 2026 — complete)

Master index: `knowledge/PHYSIOGUIDE_CLINICAL_REASONING_LIBRARY.md`  
Gap audit (all green): `knowledge/PHYSIOGUIDE_REASONING_LIBRARY_GAP_AUDIT_2026-09-01.md`

### Regional clinical modules (`knowledge/clinical-reasoning/`)

Body regions with master integration + branch modules:

- Hip / groin, knee, shoulder, ankle-foot, elbow-wrist-hand, spine (cervical + lumbar), finger, head
- Global cross-region integration
- Elbow/wrist expansion pack: distal biceps/triceps, UCL, PLRI, radial tunnel, Guyon, TFCC, DRUJ, carpal SL/LT, fine differentials

### Evidence DB (`knowledge/evidence/`)

Structured tests + clusters (format in master doc §21). **No invented Sn/Sp.** Mark mixed evidence explicitly.

Key files: `*-tests.md`, `clusters-*.md`, `negative-test-reasoning.md`, `evidence-levels-A-D.md`, `referred-pain-*.md`

### Reasoning modes (not region-specific)

- Hypothesis exploration, clarity / no overdiagnosis, persistence / reevaluation, no-imaging decision
- MTrP framework + muscle atlas (**traditional = evidence level D**; no Travell verbatim)
- Differential matrices by location

### Relations JSON (`knowledge/relations/`)

Pilot structured relations (shoulder, cervical, thoracic, lumbar, hip, knee, ankle-foot, elbow-wrist, head). Schema: `knowledge/schema/clinical-relation.schema.json`. **Local packs — not RAG ingested.**

### Rules entry point

`lib/physioguide-clinical-reasoning-library-rules.ts` (+ mobile + edge)

---

## 7. Clinician-facing tools (physio tab)

### Clinical reasoning flow

- `components/clinical-reasoning-flow.tsx` / mobile mirror
- `lib/clinical-reasoning/trees.ts` — decision trees per body part
- `lib/clinical-reasoning/test-catalog.ts` — test metadata for illustrated special tests
- `lib/clinical-test-images.ts`, `lib/clinical-test-videos.ts` — CDN assets (Supabase + local fallbacks in `public/clinical-tests/`)

Trees include illustrated tests (Lachman, Cozen, Maudsley, Durkan, WHAT, hook, Watson, jersey/mallet/trigger, etc.). Some tests are **clinician-only** (e.g. PLRI pivot-shift, LT ballottement) — not patient yes/no in adaptive forms.

### Functional tests (patient)

- `lib/consulta-functional-tests.ts` — fallback bank
- `lib/consulta-functional-protocols.ts` — region protocols (quad, hamstring, calf/Achilles, etc.)
- Primary source of truth: RAG knowledge docs, not the local bank

---

## 8. Repository map (where to look first)

```
app/                    Next.js pages (consulta, fisio, clinica, auth, site)
components/             React UI (chat, adaptive forms, clinic, physio)
lib/                    Shared logic: triage, adaptive Q, AI rules, Physioguide rules
mobile/                 Expo app (mirror lib/ + screens)
supabase/
  functions/ai-consult/ Edge AI (index.ts + response-rules.ts)
  migrations/           Postgres schema (clinics, profiles, RAG, reports)
knowledge/
  clinical-reasoning/   Physioguide clinical modules (source of truth)
  evidence/             Tests + clusters evidence DB
  relations/            JSON relation pilots
  PHYSIOGUIDE_*.md      Master docs, audits, roadmap
scripts/
  ingest-clinical-reasoning.mjs   RAG ingest
  test-rag-retrieval.mjs          Debug RAG
public/clinical-tests/  Test images + videos (also CDN)
docs/                   This file + knowledge-ingest PDFs
.cursor/rules/          Agent rules (dual-sync, TestFlight, clinical library)
```

### Files that must stay in sync (common review failure)

| Web | Mobile | Edge |
|-----|--------|------|
| `lib/ai-consult-rules.ts` | `mobile/src/lib/ai-consult-rules.ts` | `supabase/functions/ai-consult/response-rules.ts` |
| `lib/physioguide-*-rules.ts` | `mobile/src/lib/physioguide-*-rules.ts` | (inlined in response-rules.ts) |
| `lib/clinical-reasoning/trees.ts` | `mobile/src/lib/clinical-reasoning/trees.ts` | — |
| `lib/consulta-*-adaptive.ts` | `mobile/src/lib/consulta-*-adaptive.ts` | — |

When copying web → mobile, **fix imports** (`@/lib/...` → relative `./` or `../`).

---

## 9. Recent work (what changed in latest `main`)

The latest large commit (`cabf565`) includes:

1. **Full Physioguide clinical reasoning library** (all regions, referred pain, MTrP, negative tests, matrices)
2. **Elbow/wrist/hand expansion** — Maudsley, Durkan, WHAT, hook/UCL/PLRI, TFCC/DRUJ/SL/LT modules + trees + wrist adaptive yes/no (fóvea, Durkan, WHAT)
3. **Finger tree** — jersey, mallet, trigger-a1, froment test nodes + catalog
4. **Clinic surfaces** — web `/clinica`, directory `/buscar`, migrations for clinic orgs
5. **Auth** — forgot/reset password (web + mobile)
6. **12 expansion PDFs** for Admin RAG (`docs/knowledge-ingest/`)
7. **Relations JSON** cited pilots (hook, Durkan, fóvea, Watson, Maudsley)
8. **`ai-consult` rules** updated and deployed

Status doc: `knowledge/PHYSIOGUIDE_PROJECT_STATUS_AND_ROADMAP.md`  
Elbow/wrist gap closure: `knowledge/PHYSIOGUIDE_ELBOW_WRIST_HAND_GAPS_2026-08-31.md`

---

## 10. Permanent constraints (do not “fix” these away)

| Constraint | Why |
|------------|-----|
| No invented Sn/Sp/LR | Clinical safety + honesty |
| No Travell & Simons full text ingest | Copyright |
| Traditional myofascial maps = level **D** only | Evidence policy |
| Negative test ≠ exclusion | Core Physioguide philosophy |
| Meñique solo ≠ STC | Neural territory rules |
| FOOSH + tabaquera → escafoides before “sprain” | Trauma gate |
| PLRI pivot-shift = clinician only | Unsafe for patient self-test |
| Phalen/Durkan/Cozen/Maudsley alone ≠ confirmed diagnosis | Cluster reasoning |

---

## 11. Suggested review focus for Grok

### High value

1. **Dual-sync drift** — Do web, mobile, and `response-rules.ts` still match after the big commit?
2. **Clinical safety language** — Any prompt or UI text that states diagnosis as fact?
3. **Adaptive questionnaire → AI summary** — Does `format*Adaptive()` pass enough context without inventing findings?
4. **Tree logic** — Dead nodes, broken `entryByTestId`, circular branches in `trees.ts`
5. **RLS / auth** — Clinic migrations, account types, delete-account flows
6. **Mobile import paths** — Any `@/` left in `mobile/src/lib/` after copies from web

### Medium value

7. RAG ingest title consistency (`Physioguide — …` prefix)
8. Functional test protocol timing (24–36h rule) in chat + mobile reminders
9. Clinic billing stubs (`lib/clinic-billing.ts`) — not live yet

### Lower priority / out of scope

- `onix-app-store-screenshots/` (not in repo — local only)
- `Notes.txt`, `scripts/.tmp/`, `supabase/.temp/` (gitignored / local)
- Generic Next.js README (still boilerplate)

---

## 12. How to run locally (reviewer)

```bash
# Web
cp .env.example .env.local   # fill Supabase + OpenAI keys
npm install
npm run dev

# Mobile
cd mobile && npm install
# mobile/.env from .env.example pattern
npx expo start

# RAG ingest (needs OPENAI + service role in .env.local)
node scripts/ingest-clinical-reasoning.mjs

# Edge deploy (after rule changes)
npx supabase functions deploy ai-consult --project-ref klxlzzgrymkexvuelzex
```

---

## 13. Key documents to read before deep review

| Document | Purpose |
|----------|---------|
| `knowledge/PHYSIOGUIDE_CLINICAL_REASONING_LIBRARY.md` | Master clinical philosophy + modes |
| `knowledge/PHYSIOGUIDE_MASTER_CLINICAL_DOCUMENT.md` | Global Physioguide principles |
| `knowledge/PHYSIOGUIDE_REASONING_LIBRARY_GAP_AUDIT_2026-09-01.md` | What is complete vs blocked |
| `HANDOFF.md` | Consult UX, triage, 24h rule, file pointers |
| `.cursor/rules/physioguide-dual-sync.mdc` | Required workflow for any clinical change |
| `.cursor/rules/physioguide-clinical-reasoning-library.mdc` | MTrP / referred / negative-test rules |

---

## 14. One-sentence summary

**AIKinora is a Spanish-first physio platform where patients answer structured MSK questionnaires and receive cited, safety-first AI orientation; Physioguide supplies deterministic clinical rules + RAG knowledge so the AI assists hypothesis formation instead of diagnosing — and every clinical change must stay synced across markdown, TypeScript rules, mobile, and the Supabase edge function.**

---

*Generated for external review — Sep 2026. Update this file when major architecture or Physioguide scope changes.*
