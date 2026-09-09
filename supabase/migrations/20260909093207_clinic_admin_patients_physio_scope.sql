-- Clinic admin sees all clinic patients (with linked physio name).
-- Clinic physiotherapists only see patients linked to themselves.

-- 1) Backfill clinic_id for patients linked to a clinic staff physio/owner
update public.profiles pt
set clinic_id = m.clinic_id
from public.clinic_members m
where pt.physio_id = m.user_id
  and coalesce(pt.account_type, 'patient') = 'patient'
  and (pt.clinic_id is null or pt.clinic_id is distinct from m.clinic_id);

-- 2) When redeeming a personal physio code, attach clinic_id if staff belongs to a clinic
create or replace function public.patient_link_physio_code(p_code text)
returns table (
  physio_id uuid,
  physio_name text,
  clinic_name text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized text;
  target record;
  clinic_row record;
  recipient uuid;
  staff_clinic_id uuid;
  staff_clinic_name text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if exists (
    select 1 from public.profiles me
    where me.id = auth.uid() and me.account_type in ('physio', 'clinic')
  ) then
    raise exception 'los fisioterapeutas no pueden vincularse con un código';
  end if;

  normalized := upper(trim(coalesce(p_code, '')));
  if length(normalized) < 6 then
    raise exception 'código no válido';
  end if;

  -- A) Physio personal invite code
  select p.id, p.display_name, p.clinic_name
  into target
  from public.profiles p
  where p.account_type = 'physio'
    and p.invite_code = normalized
  limit 1;

  if target.id is not null then
    if target.id = auth.uid() then
      raise exception 'código no válido';
    end if;

    select m.clinic_id, c.name
    into staff_clinic_id, staff_clinic_name
    from public.clinic_members m
    join public.clinics c on c.id = m.clinic_id
    where m.user_id = target.id
    order by case m.role when 'owner' then 0 when 'admin' then 1 else 2 end, m.created_at
    limit 1;

    perform set_config('app.linking_physio', '1', true);
    if staff_clinic_id is not null then
      perform set_config('app.linking_clinic', '1', true);
    end if;

    update public.profiles
    set
      physio_id = target.id,
      clinic_id = coalesce(staff_clinic_id, clinic_id),
      clinic_name = coalesce(staff_clinic_name, target.clinic_name, clinic_name)
    where id = auth.uid();

    physio_id := target.id;
    physio_name := target.display_name;
    clinic_name := coalesce(staff_clinic_name, target.clinic_name);
    return next;
    return;
  end if;

  -- B) Clinic patient invite code (admin-generated)
  select c.id, c.name, c.slug
  into clinic_row
  from public.clinics c
  where c.patient_invite_code = normalized
  limit 1;

  if clinic_row.id is null then
    raise exception 'código no encontrado';
  end if;

  recipient := public._clinic_resolve_patient_recipient(clinic_row.id);
  if recipient is null then
    raise exception 'esta clínica aún no puede recibir pacientes';
  end if;

  if recipient = auth.uid() then
    raise exception 'código no válido';
  end if;

  perform set_config('app.linking_physio', '1', true);
  perform set_config('app.linking_clinic', '1', true);
  update public.profiles
  set
    physio_id = recipient,
    clinic_id = clinic_row.id,
    clinic_name = clinic_row.name
  where id = auth.uid();

  physio_id := recipient;
  select p.display_name into physio_name
  from public.profiles p where p.id = recipient;
  clinic_name := clinic_row.name;
  return next;
end;
$$;

-- 3) Clinic admin roster: all clinic patients + linked physio name
drop function if exists public.clinic_list_patients();

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
    u.email::text,
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

revoke all on function public.clinic_list_patients() from public;
grant execute on function public.clinic_list_patients() to authenticated;

-- 4) Physio roster: only own linked patients (never other clinic patients)
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
    u.email::text,
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

revoke all on function public.physio_list_patients() from public;
grant execute on function public.physio_list_patients() to authenticated;
