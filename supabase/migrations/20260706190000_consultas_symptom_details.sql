alter table public.consultas
  add column if not exists symptom_details jsonb;

comment on column public.consultas.symptom_details is 'Detailed per-consultation symptom questionnaire answers';
