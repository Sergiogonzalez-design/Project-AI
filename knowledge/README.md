# Kinora Knowledge Base — Full Clinical Orientation Library

Structured clinical orientation documents for **Kinora AI** training and RAG (retrieval-augmented generation).

## PDFs

| File | Purpose |
|------|---------|
| `Kinora_Upper_Extremity_AI_Orientation.pdf` | Part 1 — UE anatomy, exam, pathology, rehab |
| `Kinora_Upper_Extremity_Vascular_Fascia_Biomechanics.pdf` | Part 2 — UE vascular, fascia, EMG, kinetic chain |
| `Kinora_Thoracic_Back_AI_Orientation.pdf` | Part 3 — full thoracic spine + ribs orientation (deep) |
| `Kinora_Clinical_Reasoning_Practice_AI_Orientation.pdf` | Part 4 — clinical reasoning, outcomes, prevention |
| `Kinora_Lumbar_Spine_AI_Orientation.pdf` | Part 5 — full lumbar orientation (**largest regional PDF**) |
| `Kinora_Pelvis_AI_Orientation.pdf` | Part 6 — pelvis / SI / pelvic floor |
| `Kinora_Hip_AI_Orientation.pdf` | Part 7 — hip |
| `Kinora_Knee_AI_Orientation.pdf` | Part 8 — knee |
| `Kinora_Lower_Leg_AI_Orientation.pdf` | Part 9 — lower leg / compartments |
| `Kinora_Ankle_AI_Orientation.pdf` | Part 10 — ankle |
| `Kinora_Foot_AI_Orientation.pdf` | Part 11 — foot |
| `Kinora_Cervical_Spine_AI_Orientation.pdf` | Part 12 — cervical vertebrae C1–C7, joints, ligaments, muscles, nerves, biomechanics, pathologies |
| `Kinora_Rib_Cage_Thorax_AI_Orientation.pdf` | Part 13 — ribs, sternum, costal joints, breathing, TOS |
| `Kinora_TMJ_AI_Orientation.pdf` | Part 14 — TMJ bones/disc, mastication, mechanics, TMD |
| `Kinora_Head_Face_AI_Orientation.pdf` | Part 15 — facial muscles, CNs, headache, concussion, vestibular basics |
| `Kinora_Peripheral_Nervous_System_AI_Orientation.pdf` | Part 16 — master PNS (UE/LE nerves + plexuses) |
| `Kinora_Vascular_System_AI_Orientation.pdf` | Part 17 — arteries/veins, pulses, DVT/PE, compartment syndrome |
| `Kinora_Red_Flags_Master_AI_Orientation.pdf` | Part 18 — cross-region red flags master |
| `Kinora_Imaging_Clinical_Decision_AI_Orientation.pdf` | Part 19 — XR/MRI/CT/US + Ottawa / Canadian C-Spine / NEXUS |
| `Kinora_Exercise_Library_AI_Orientation.pdf` | Part 20 — 25 flagship exercises with progressions |
| `Kinora_Clinical_Outcome_Measures_AI_Orientation.pdf` | Part 21 — NDI, ODI, QuickDASH, LEFS, FAAM, KOOS/HOOS, Oxford, VAS/NPRS, PSFS, TUG, YBT, VISA, CAIT |
| `Kinora_Thoracic_Spine_Clinical_Database_AI_Orientation.pdf` | Part 22 — thoracic clinical DB template (complements Part 3) |
| `Kinora_Lumbar_Spine_Clinical_Database_AI_Orientation.pdf` | Part 23 — lumbar clinical DB template (complements Part 5) |

### How to use

1. **Generate or refresh** (optional):
   ```bash
   python scripts/generate_ue_knowledge_pdf.py
   python scripts/generate_ue_vascular_biomechanics_pdf.py
   python scripts/generate_thoracic_back_knowledge_pdf.py
   python scripts/generate_clinical_reasoning_pdf.py
   python scripts/generate_lumbar_spine_knowledge_pdf.py
   python scripts/generate_pelvis_knowledge_pdf.py
   python scripts/generate_hip_knowledge_pdf.py
   python scripts/generate_knee_knowledge_pdf.py
   python scripts/generate_lower_leg_knowledge_pdf.py
   python scripts/generate_ankle_knowledge_pdf.py
   python scripts/generate_foot_knowledge_pdf.py
   python scripts/generate_cervical_spine_knowledge_pdf.py
   python scripts/generate_clinical_master_databases_pdf.py
   ```
2. **Admin → Conocimientos** — upload the PDFs needed for RAG orientation.

### Notes on depth

- **Deep regional PDFs (ankle/pelvis depth):** Parts 1–12 (cervical newly added at Part 12).
- **Deep existing spine:** Part 3 (thoracic) and Part 5 (lumbar) remain the primary deep spine modules.
- **Parts 13–21:** master/cross-cutting databases (ribs/TMJ/head/PNS/vascular/red flags/imaging/exercises/outcomes).
- **Parts 22–23:** template-style thoracic/lumbar clinical DBs that **complement** Parts 3 and 5 (not replacements).

### Disclaimer

Educational AI orientation only — not a substitute for licensed clinical judgment. Red flags — especially **cauda equina**, **cervical myelopathy**, **CAD/stroke features**, **DVT/PE**, **septic joint**, and **acute compartment syndrome** — require **urgent emergency medical referral**.
