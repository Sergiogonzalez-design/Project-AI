# Clinical relation data model

JSON Schema: [`clinical-relation.schema.json`](./clinical-relation.schema.json)

## Packs — ALL ACTIVE v2

| Pack | File |
|------|------|
| shoulder-lateral | [`../relations/shoulder-lateral.json`](../relations/shoulder-lateral.json) |
| cervical | [`../relations/cervical.json`](../relations/cervical.json) |
| lumbar | [`../relations/lumbar.json`](../relations/lumbar.json) |
| hip | [`../relations/hip.json`](../relations/hip.json) |
| knee | [`../relations/knee.json`](../relations/knee.json) |
| ankle-foot | [`../relations/ankle-foot.json`](../relations/ankle-foot.json) |
| thoracic | [`../relations/thoracic.json`](../relations/thoracic.json) |
| head | [`../relations/head.json`](../relations/head.json) |
| elbow-wrist | [`../relations/elbow-wrist.json`](../relations/elbow-wrist.json) |

RAG companions: `evidence/relations-*.md`. Cited numbers (when allowed): `evidence/cited-diagnostic-accuracy.md`.

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
2. Never invent Sn/Sp/LR; leave `diagnostic_accuracy` empty or mark `mixed` / `unknown`, unless citing `cited-diagnostic-accuracy.md`.  
3. `limitations` required when evidence_level is C, D, or insufficient.  
4. Copyrighted book prose must not be stored verbatim.  
