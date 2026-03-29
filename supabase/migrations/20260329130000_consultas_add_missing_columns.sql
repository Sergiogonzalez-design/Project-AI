-- Run this if `consultas` was created without pain_level, had_trauma, description
alter table public.consultas
  add column if not exists pain_level smallint not null default 5
    check (pain_level >= 1 and pain_level <= 10);

alter table public.consultas
  add column if not exists had_trauma text not null default 'No';

alter table public.consultas
  add column if not exists description text;

-- Optional: drop defaults so new rows must send values from the app (uncomment if you want)
-- alter table public.consultas alter column pain_level drop default;
-- alter table public.consultas alter column had_trauma drop default;
