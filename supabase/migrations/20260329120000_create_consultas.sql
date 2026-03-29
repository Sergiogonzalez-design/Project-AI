-- Consultation form submissions (PhysioGuide)
create table public.consultas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  body_area text,
  started_when text not null,
  onset_type text not null,
  pain_level smallint not null check (pain_level >= 1 and pain_level <= 10),
  had_trauma text not null,
  description text
);

comment on table public.consultas is 'Consulta: datos enviados desde el formulario';

create index consultas_created_at_idx on public.consultas (created_at desc);

alter table public.consultas enable row level security;

-- Lectura solo desde el dashboard o service_role; el cliente público no lista filas ajenas
-- Inserción permitida con la clave anónima (usuarios sin login)
create policy "consultas_insert_anon"
  on public.consultas
  for insert
  to anon
  with check (true);

create policy "consultas_insert_authenticated"
  on public.consultas
  for insert
  to authenticated
  with check (true);

grant insert on table public.consultas to anon, authenticated;
