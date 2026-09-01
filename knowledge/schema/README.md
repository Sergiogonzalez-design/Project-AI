# Clinical relation data model

JSON Schema: [`clinical-relation.schema.json`](./clinical-relation.schema.json)  
Example packs: [`../relations/`](../relations/) (shoulder, cervical, thoracic, lumbar, hip, knee, ankle-foot, elbow-wrist, head).

## Entity types

| Type | Description |
|------|-------------|
| `structure` | Muscle, tendon, joint, nerve, disc, ligament, etc. |
| `region` | Pain location / symptom region |
| `test` | Clinical test or cluster |
| `relation` | Directed clinical relationship with evidence |

## Relation vocabulary (`relationship`)

- `may_refer_pain_to`
- `may_mimic`
- `may_coexist_with`
- `tested_by`
- `differentiated_by`
- `negative_test_does_not_exclude`
- `raises_suspicion_when`
- `red_flag_if`

## Evidence levels

- `A` — consistent high-quality evidence  
- `B` — moderate / some limitations  
- `C` — limited  
- `D` — preliminary / indirect  
- `insufficient` — do not assert clinically  

## Referred-pattern source class

- `experimental` — controlled reproduction  
- `clinical` — patient series / clinical studies  
- `traditional` — classical maps / textbooks (label explicitly; never treat as absolute anatomy)

## Rules

1. Every relation needs ≥1 `references` entry (citation string + optional DOI/PMID).  
2. Never invent Sn/Sp/LR; leave `diagnostic_accuracy` empty or mark `mixed` / `unknown`.  
3. `limitations` required when evidence_level is C, D, or insufficient.  
4. Copyrighted book prose must not be stored verbatim.  
