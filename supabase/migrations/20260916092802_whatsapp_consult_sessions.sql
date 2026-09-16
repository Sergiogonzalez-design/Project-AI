-- WhatsApp consulta previa sessions (same product, second channel).
-- Access is service-role / edge only — no public client policies.

create table if not exists public.whatsapp_consult_sessions (
  id uuid primary key default gen_random_uuid(),
  phone_e164 text not null,
  invite_code text,
  physio_id uuid references public.profiles (id) on delete set null,
  clinic_id uuid references public.clinics (id) on delete set null,
  patient_id uuid references public.profiles (id) on delete set null,
  conversation_id uuid references public.conversations (id) on delete set null,
  phase text not null default 'idle'
    check (
      phase in (
        'idle',
        'awaiting_code',
        'name',
        'intake',
        'questionnaire',
        'functional',
        'complete'
      )
    ),
  state jsonb not null default '{}'::jsonb,
  last_wa_message_id text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists whatsapp_consult_sessions_active_phone_uidx
  on public.whatsapp_consult_sessions (phone_e164)
  where completed_at is null;

create index if not exists whatsapp_consult_sessions_physio_idx
  on public.whatsapp_consult_sessions (physio_id);

create index if not exists whatsapp_consult_sessions_patient_idx
  on public.whatsapp_consult_sessions (patient_id);

create or replace function public.set_whatsapp_consult_sessions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_whatsapp_consult_sessions_updated_at
  on public.whatsapp_consult_sessions;
create trigger trg_whatsapp_consult_sessions_updated_at
  before update on public.whatsapp_consult_sessions
  for each row
  execute function public.set_whatsapp_consult_sessions_updated_at();

alter table public.whatsapp_consult_sessions enable row level security;

-- No policies for anon/authenticated — only service role bypasses RLS.
revoke all on public.whatsapp_consult_sessions from anon, authenticated;
grant all on public.whatsapp_consult_sessions to service_role;
