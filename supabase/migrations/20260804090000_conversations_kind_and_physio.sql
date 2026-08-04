-- Separates the Fisioterapia (physio-linked, code-gated) consult history from the
-- regular Consulta chat, and records which physio + clinic each Fisioterapia
-- conversation belongs to so the patient sidebar can group by physiotherapist.

alter table public.conversations
  add column if not exists kind text not null default 'consulta',
  add column if not exists physio_id uuid references public.profiles(id) on delete set null,
  add column if not exists physio_name text,
  add column if not exists clinic_name text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'conversations_kind_check'
  ) then
    alter table public.conversations
      add constraint conversations_kind_check check (kind in ('consulta', 'fisioterapia'));
  end if;
end $$;

create index if not exists conversations_user_kind_idx
  on public.conversations (user_id, kind, created_at desc);
