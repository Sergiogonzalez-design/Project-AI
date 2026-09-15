-- Hide synthetic guest emails from staff-facing patient RPCs.
-- Auth still uses guest.<uuid>@guests.aikinora.app internally.

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
  is_guest boolean
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
    ) as is_guest
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.id = p_patient_id;
end;
$$;

create or replace function public.physio_list_patients()
returns table (
  id uuid,
  email text,
  display_name text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  onboarding_completed boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_physio() then
    raise exception 'not authorized';
  end if;

  return query
  select
    u.id,
    case
      when coalesce(u.raw_app_meta_data->>'is_guest', '') = 'true'
        or u.email ilike '%@guests.aikinora.app'
      then null
      else u.email::text
    end as email,
    p.display_name,
    u.created_at,
    u.last_sign_in_at,
    coalesce(p.onboarding_completed, false)
  from public.profiles p
  join auth.users u on u.id = p.id
  where coalesce(p.account_type, 'patient') = 'patient'
    and p.physio_id = auth.uid()
  order by u.created_at desc;
end;
$$;

create or replace function public.clinic_list_patients()
returns table (
  id uuid,
  email text,
  display_name text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  onboarding_completed boolean,
  physio_id uuid,
  physio_name text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid := public._clinic_owned_id();
begin
  if cid is null then
    raise exception 'not authorized';
  end if;

  return query
  select
    u.id,
    case
      when coalesce(u.raw_app_meta_data->>'is_guest', '') = 'true'
        or u.email ilike '%@guests.aikinora.app'
      then null
      else u.email::text
    end as email,
    p.display_name,
    u.created_at,
    u.last_sign_in_at,
    coalesce(p.onboarding_completed, false),
    p.physio_id,
    ph.display_name
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.profiles ph on ph.id = p.physio_id
  where coalesce(p.account_type, 'patient') = 'patient'
    and not exists (
      select 1 from public.clinic_members m
      where m.user_id = p.id and m.clinic_id = cid
    )
    and (
      p.clinic_id = cid
      or p.physio_id in (
        select m.user_id from public.clinic_members m where m.clinic_id = cid
      )
      or exists (
        select 1
        from public.clinical_reports cr
        where cr.patient_id = p.id
          and public._is_clinic_report_visible(cr.physio_id)
      )
    )
  order by u.created_at desc;
end;
$$;

grant execute on function public.staff_get_patient_profile(uuid) to authenticated;
grant execute on function public.physio_list_patients() to authenticated;
grant execute on function public.clinic_list_patients() to authenticated;
