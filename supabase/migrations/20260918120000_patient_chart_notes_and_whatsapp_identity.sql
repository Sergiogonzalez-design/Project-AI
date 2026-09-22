-- Patient chart notes + durable WhatsApp phone identity so returning
-- patients accumulate consultas on the same profile.

alter table public.profiles
  add column if not exists staff_notes text,
  add column if not exists whatsapp_phone text;

alter table public.clinical_reports
  add column if not exists staff_notes text;

comment on column public.profiles.staff_notes is
  'Free-text clinical/admin notes written by physio or clinic staff.';
comment on column public.profiles.whatsapp_phone is
  'Digits-only WhatsApp phone for guest patient identity reuse.';
comment on column public.clinical_reports.staff_notes is
  'Per-consulta notes written by physio or clinic staff.';

-- Backfill phone from auth metadata (WhatsApp guests).
update public.profiles p
set whatsapp_phone = nullif(
  regexp_replace(
    coalesce(u.raw_user_meta_data->>'whatsapp_phone', ''),
    '\D',
    '',
    'g'
  ),
  ''
)
from auth.users u
where u.id = p.id
  and p.whatsapp_phone is null
  and coalesce(u.raw_user_meta_data->>'whatsapp_phone', '') <> '';

-- Backfill from completed/active WhatsApp sessions.
update public.profiles p
set whatsapp_phone = nullif(regexp_replace(s.phone_e164, '\D', '', 'g'), '')
from (
  select distinct on (patient_id)
    patient_id,
    phone_e164
  from public.whatsapp_consult_sessions
  where patient_id is not null
  order by patient_id, updated_at desc
) s
where p.id = s.patient_id
  and p.whatsapp_phone is null
  and coalesce(s.phone_e164, '') <> '';

-- Historical WhatsApp guests often duplicated the same phone. Keep the
-- profile with the most clinical reports (then oldest), clear the rest.
with ranked as (
  select
    p.id,
    p.whatsapp_phone,
    row_number() over (
      partition by p.whatsapp_phone
      order by coalesce(rc.report_count, 0) desc, u.created_at asc nulls last, p.id asc
    ) as rn
  from public.profiles p
  join auth.users u on u.id = p.id
  left join (
    select patient_id, count(*)::int as report_count
    from public.clinical_reports
    group by patient_id
  ) rc on rc.patient_id = p.id
  where p.whatsapp_phone is not null
    and coalesce(p.account_type, 'patient') = 'patient'
)
update public.profiles p
set whatsapp_phone = null
from ranked r
where p.id = r.id
  and r.rn > 1;

create unique index if not exists profiles_whatsapp_phone_uidx
  on public.profiles (whatsapp_phone)
  where whatsapp_phone is not null
    and coalesce(account_type, 'patient') = 'patient';

create index if not exists profiles_whatsapp_phone_idx
  on public.profiles (whatsapp_phone)
  where whatsapp_phone is not null;

drop function if exists public.staff_get_patient_profile(uuid);
drop function if exists public.staff_update_patient_profile(uuid, text, integer, text, numeric, numeric, text);

-- ---------------------------------------------------------------------------
-- staff_get_patient_profile: include notes + phone
-- ---------------------------------------------------------------------------
create or replace function public.staff_get_patient_profile(p_patient_id uuid)
returns table (
  id uuid,
  email text,
  display_name text,
  age integer,
  sex text,
  height_cm numeric,
  weight_kg numeric,
  city text,
  is_guest boolean,
  staff_notes text,
  whatsapp_phone text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public._can_staff_manage_patient(p_patient_id) then
    raise exception 'not authorized';
  end if;

  return query
  select
    p.id,
    case
      when coalesce(u.raw_app_meta_data->>'is_guest', '') = 'true'
        or u.email ilike '%@guests.aikinora.app'
      then null
      else u.email::text
    end as email,
    p.display_name,
    p.age,
    p.sex,
    p.height_cm,
    p.weight_kg,
    p.city,
    (
      coalesce(u.raw_app_meta_data->>'is_guest', '') = 'true'
      or u.email ilike '%@guests.aikinora.app'
    ) as is_guest,
    p.staff_notes,
    p.whatsapp_phone
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.id = p_patient_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- staff_update_patient_profile: keep demographics; return expanded row
-- ---------------------------------------------------------------------------
create or replace function public.staff_update_patient_profile(
  p_patient_id uuid,
  p_display_name text default null,
  p_age integer default null,
  p_sex text default null,
  p_height_cm numeric default null,
  p_weight_kg numeric default null,
  p_city text default null
)
returns table (
  id uuid,
  email text,
  display_name text,
  age integer,
  sex text,
  height_cm numeric,
  weight_kg numeric,
  city text,
  is_guest boolean,
  staff_notes text,
  whatsapp_phone text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := nullif(trim(both from coalesce(p_display_name, '')), '');
  v_sex text := nullif(trim(both from coalesce(p_sex, '')), '');
  v_city text := nullif(trim(both from coalesce(p_city, '')), '');
begin
  if not public._can_staff_manage_patient(p_patient_id) then
    raise exception 'not authorized';
  end if;

  if p_age is not null and (p_age < 1 or p_age > 120) then
    raise exception 'invalid age';
  end if;
  if p_height_cm is not null and (p_height_cm < 50 or p_height_cm > 280) then
    raise exception 'invalid height';
  end if;
  if p_weight_kg is not null and (p_weight_kg < 15 or p_weight_kg > 400) then
    raise exception 'invalid weight';
  end if;

  update public.profiles p
  set
    display_name = v_name,
    age = p_age,
    sex = v_sex,
    height_cm = p_height_cm,
    weight_kg = p_weight_kg,
    city = v_city,
    updated_at = now()
  where p.id = p_patient_id;

  return query
  select *
  from public.staff_get_patient_profile(p_patient_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- Dedicated notes updater (patient chart)
-- ---------------------------------------------------------------------------
create or replace function public.staff_update_patient_notes(
  p_patient_id uuid,
  p_staff_notes text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_notes text := nullif(trim(both from coalesce(p_staff_notes, '')), '');
begin
  if not public._can_staff_manage_patient(p_patient_id) then
    raise exception 'not authorized';
  end if;

  update public.profiles
  set
    staff_notes = v_notes,
    updated_at = now()
  where id = p_patient_id;

  return v_notes;
end;
$$;

-- ---------------------------------------------------------------------------
-- Per-consulta notes
-- ---------------------------------------------------------------------------
create or replace function public.staff_update_report_notes(
  p_report_id uuid,
  p_staff_notes text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_notes text := nullif(trim(both from coalesce(p_staff_notes, '')), '');
  v_patient_id uuid;
begin
  select cr.patient_id into v_patient_id
  from public.clinical_reports cr
  where cr.id = p_report_id;

  if v_patient_id is null then
    raise exception 'report not found';
  end if;

  if not public._can_staff_manage_patient(v_patient_id) then
    raise exception 'not authorized';
  end if;

  update public.clinical_reports
  set staff_notes = v_notes
  where id = p_report_id;

  return v_notes;
end;
$$;

revoke all on function public.staff_get_patient_profile(uuid) from public;
grant execute on function public.staff_get_patient_profile(uuid) to authenticated;

revoke all on function public.staff_update_patient_profile(uuid, text, integer, text, numeric, numeric, text) from public;
grant execute on function public.staff_update_patient_profile(uuid, text, integer, text, numeric, numeric, text) to authenticated;

revoke all on function public.staff_update_patient_notes(uuid, text) from public;
grant execute on function public.staff_update_patient_notes(uuid, text) to authenticated;

revoke all on function public.staff_update_report_notes(uuid, text) from public;
grant execute on function public.staff_update_report_notes(uuid, text) to authenticated;
