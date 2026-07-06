-- Extend profiles with athlete onboarding fields
alter table public.profiles
  add column if not exists age integer,
  add column if not exists sex text,
  add column if not exists height_cm numeric(5,1),
  add column if not exists weight_kg numeric(5,1),
  add column if not exists dominant_hand text,
  add column if not exists dominant_foot text,
  add column if not exists primary_sport text,
  add column if not exists sport_position text,
  add column if not exists competitive_level text,
  add column if not exists sessions_per_week integer,
  add column if not exists hours_per_week numeric(4,1),
  add column if not exists current_season text,
  add column if not exists performance_goals text[] default '{}',
  add column if not exists onboarding_completed boolean not null default false;

-- Existing users keep access without re-onboarding
update public.profiles
set onboarding_completed = true
where onboarding_completed = false
  and display_name is not null;
