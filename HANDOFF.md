# Kinora — Handoff / Where we left off

**Date:** 25 Jul 2026  
**Project:** `c:\Users\sergi\project-ai` (Next.js web + Expo mobile + Supabase)  
**Supabase project:** `klxlzzgrymkexvuelzex` (projectai)  
**Edge function:** `ai-consult` (deployed with latest triage + response rules)

Use this note to continue tomorrow. Paste into chat if needed.

---

## Goal of the recent work

1. Feed clinical knowledge (PDFs) into Kinora RAG.
2. Change how the AI answers consults: sources, urgency vs non-urgency, 24h rule, functional tests later.
3. Always ask structured questions **before** the AI report (like shoulder), for every body part — starting with neck.

---

## What is DONE

### A) Knowledge PDFs (Parts 1–23)

Stored under `knowledge/`. Catalog in `knowledge/README.md`.

Examples already generated / uploaded for RAG: UE, thoracic, lumbar, pelvis, hip, knee, lower leg, ankle, foot, cervical, ribs, TMJ, head/face, PNS, vascular, red flags, imaging, exercises, outcomes, clinical DB templates, etc.

Regenerate scripts live under `scripts/generate_*_knowledge_pdf.py` (+ helpers like `_kinora_pdf_common.py`).

### B) AI consult response behaviour (edge + Next)

**Primary path:** web + mobile call Supabase Edge `ai-consult`.

**Rules (keep in sync):**
- `lib/ai-consult-rules.ts` (Next)
- `supabase/functions/ai-consult/response-rules.ts` (edge copy — must stay aligned)

**Format (same as before when it worked well):**
- Resumen / Estructuras / Posibles lesiones / Qué hacer mientras tanto / Qué debes hacer ahora / ¿Contactar fisio? / Fuentes consultadas

**Urgent:** same format + **Pruebas de imagen recomendadas**; hospital / doctor when needed; no long functional-test battery.

**Not urgent:**
- Same recommendation style as always.
- If injury **&lt; ~24 h:** rest + cold + elevate; explain swelling / hematoma not ready for tests; ask to come back at **24–36 h**.
- If **≥ ~24–36 h:** after usual sections, add **Preguntas de valoración funcional** (3–5 tests), then refine on follow-up.

**Sources:** each important conclusion should have a `Fuente: …` line; RAG chunks are labeled with `source_name`; footer **Fuentes consultadas**. Web styles those as links to `/conocimientos`.

**Tests source of truth:** uploaded knowledge docs (Functional Assessment / Special Tests / Clinical Tests via RAG). Local bank in `lib/consulta-functional-tests.ts` is **fallback only**.

### C) Questionnaires before AI answer

**Before:** only shoulder / elbow / wrist / finger opened the step UI. Neck (and other zones) jumped to a clinical reply → bug you saw with “me duele el cuello”.

**Now:**
- Triage routes personal pain in **any** zone to a questionnaire first.
- Parts with **full adaptive UI** (step-by-step like shoulder):  
  `shoulder`, `elbow`, `wrist_hand`, `finger`, **`neck`**
- Parts that start questionnaire but still use **generic** form until dedicated UI exists:  
  `back`, `hip`, `knee`, `ankle_foot`

**Key files:**
| Area | Path |
|------|------|
| Triage (web) | `lib/consulta-triage.ts` |
| Triage (mobile) | `mobile/src/lib/consulta-triage.ts` |
| Body detect / intros | `lib/detect-body-part.ts` (+ mobile copy) |
| Edge triage prompt | `supabase/functions/ai-consult/index.ts` (`TRIAGE_SYSTEM_PROMPT`) |
| Neck adaptive | `lib/consulta-neck-adaptive.ts` |
| Neck UI web | `components/consulta-adaptive-neck.tsx` |
| Neck UI mobile | `mobile/src/components/ConsultaAdaptiveNeck.tsx` |
| Chat wiring web | `components/chat-interface.tsx` |
| Chat wiring mobile | `mobile/src/screens/AIInquiriesScreen.tsx` |

### D) Time-since-onset options (all questionnaires)

Added at the start of evolution / “cuánto tiempo” lists:
- **Ha sido ahora**
- **Reciente (1-4 horas)**

Updated in shoulder, elbow, neck, wrist, finger (+ generic via shoulder’s `EVOLUTION_OPTIONS`), web + mobile.

---

## What is NOT done yet / next for you

1. **Paste more movement / functional tests per body part**  
   Protocols in `lib/consulta-functional-protocols.ts` (+ mobile mirror):
   - **Quad**: 5 yes/no → ≥60% → rest 24–36h → retest ~36h → ultrasound if still positive
   - **Hamstring**: history (running/pedrada, hand back, keep running, heavy deadlift) + tests (knee flexion, toe touch knee straight, pain 1–10, Nordic curl) → rest 24–36h → retest ~36h → ultrasound if still hurts
   - **Gemelo / Aquiles**: same yes/no battery (pedrada, arranque en frío, apoyo completo, inflamación, saltar, estirar gemelo, talón+dedos al aire, puntillas) → rest 24–36h → retest ~36h → ultrasound (gemelo vs Aquiles)
   Add more regions the same way. Structured protocol questions should be **SÍ/NO** for clearer AI context.

2. **Full adaptive questionnaires still missing** (same structure as shoulder/neck):
   - Espalda (`back`)
   - Cadera (`hip`)
   - Rodilla (`knee`) — questionnaire still generic; quad + hamstring functional protocols are wired into AI + mobile reminders
   - Tobillo/pie (`ankle_foot`)  
   Today they open the **generic** short form after triage.

3. **Optional polish**
   - Keep `lib/ai-consult-rules.ts` and `supabase/functions/ai-consult/response-rules.ts` in sync whenever you edit prompts; then `npx supabase functions deploy ai-consult --project-ref klxlzzgrymkexvuelzex`.
   - Mobile and web questionnaire banks should stay mirrored when you add regions/tests.

---

## How a consult should feel (target UX)

1. User: “me duele el X”
2. Physio intro + **questionnaire** (urgency → core → branches → history), not an instant report.
3. After submit → AI structured answer (same sections as before).
4. If urgent → imaging / go to hospital.
5. If **not urgent** (universal for every body part):
   - **Tests** (region battery / RAG / structured protocol)
   - **24–36 h relative rest** if tests suggest injury
   - **Retest** same questions (~36 h notification on mobile)
   - If still hurts / no improvement → **imaging adapted to the zone** (US / X-ray / MRI)
6. Citations under conclusions (`Fuente: …`).

---

## Quick test checklist for tomorrow

- [ ] New consulta: “me duele el cuello” → Paso 1, Comprobación de urgencia (not an instant report).
- [ ] “me duele el hombro” → still full shoulder adaptive.
- [ ] “me duele la rodilla” → questionnaire starts (generic for now).
- [ ] Evolution options include **Ha sido ahora** and **Reciente (1-4 horas)**.
- [ ] Non-urgent acute case mentions rest / cold / elevate and waiting ~24h before tests.
- [ ] Answer shows `Fuente:` / Fuentes consultadas when RAG hits.

---

## Paste-ready one-liner for Cursor tomorrow

> Continue Kinora from the handoff in `HANDOFF.md`: AI rules already deployed (sources, urgent vs not, 24h then functional tests from RAG). Neck has full adaptive questionnaire; back/hip/knee/ankle still use generic. Next: paste my per-region movement tests into `consulta-functional-tests.ts` / knowledge, then build adaptive questionnaires for back, hip, knee, ankle_foot like shoulder/neck.

---

*End of handoff.*
