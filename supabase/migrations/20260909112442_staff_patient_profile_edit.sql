-- Allow physio / clinic owner (and platform admin) to read & edit optional
-- demographic fields on linked patients — especially invite-code guests who
-- never completed athlete onboarding.

create or replace function public._can_staff_manage_patient(p_patient_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  if auth.uid() is null or p_patient_id is null then
    return false;
  end if;

  if public.is_admin() then
    return exists (
      select 1
      from public.profiles p
      where p.id = p_patient_id
        and coalesce(p.account_type, 'patient') = 'patient'
    );
  end if;

  if public.is_physio()
    and exists (
      select 1
      from public.profiles p
      where p.id = p_patient_id
        and coalesce(p.account_type, 'patient') = 'patient'
        and p.physio_id = auth.uid()
    )
  then
    return true;
  end if;

  cid := public._clinic_owned_id();
  if cid is null then
    return false;
  end if;

  return exists (
    select 1
    from public.profiles p
    where p.id = p_patient_id
      and coalesce(p.account_type, 'patient') = 'patient'
      and not exists (
        select 1
        from public.clinic_members m
        where m.user_id = p.id
          and m.clinic_id = cid
      )
      and (
        p.clinic_id = cid
        or p.physio_id in (
          select m.user_id
          from public.clinic_members m
          where m.clinic_id = cid
        )
        or exists (
          select 1
          from public.clinical_reports cr
          where cr.patient_id = p.id
            and public._is_clinic_report_visible(cr.physio_id)
        )
      )
  );
end;
$$;

revoke all on function public._can_staff_manage_patient(uuid) from public;

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
    u.email::text,
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

revoke all on function public.staff_get_patient_profile(uuid) from public;
grant execute on function public.staff_get_patient_profile(uuid) to authenticated;

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
  is_guest boolean
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

revoke all on function public.staff_update_patient_profile(uuid, text, integer, text, numeric, numeric, text) from public;
grant execute on function public.staff_update_patient_profile(uuid, text, integer, text, numeric, numeric, text) to authenticated;
