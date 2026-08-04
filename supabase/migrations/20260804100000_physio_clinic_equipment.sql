-- Physio clinic equipment captured at onboarding, used to ground physio_chat recommendations.

alter table public.profiles
  add column if not exists clinic_equipment text[] not null default '{}',
  add column if not exists clinic_equipment_notes text;

comment on column public.profiles.clinic_equipment is
  'Equipment/material IDs available in the physio clinic (see lib/physio-equipment-options.ts).';
comment on column public.profiles.clinic_equipment_notes is
  'Free-text notes about clinic equipment not covered by clinic_equipment.';
