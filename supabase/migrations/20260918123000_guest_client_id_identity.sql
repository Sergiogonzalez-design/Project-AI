-- Durable anonymous guest identity for web/mobile return visits.
-- Phone (whatsapp_phone) already links WhatsApp; guest_client_id links
-- the same browser/app so a later invite becomes consulta #2+.

alter table public.profiles
  add column if not exists guest_client_id text;

comment on column public.profiles.guest_client_id is
  'Stable client-generated UUID for anonymous guest return visits (web/mobile).';

create unique index if not exists profiles_guest_client_id_uidx
  on public.profiles (guest_client_id)
  where guest_client_id is not null
    and coalesce(account_type, 'patient') = 'patient';

create index if not exists profiles_guest_client_id_idx
  on public.profiles (guest_client_id)
  where guest_client_id is not null;
