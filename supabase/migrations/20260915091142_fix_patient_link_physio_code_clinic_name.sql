-- Fix ambiguous clinic_name in patient_link_physio_code (RETURNS TABLE OUT param
-- clashes with profiles.clinic_name in UPDATE SET expressions).

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

    update public.profiles as me
    set
      physio_id = target.id,
      clinic_id = coalesce(staff_clinic_id, me.clinic_id),
      clinic_name = coalesce(staff_clinic_name, target.clinic_name, me.clinic_name)
    where me.id = auth.uid();

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
  update public.profiles as me
  set
    physio_id = recipient,
    clinic_id = clinic_row.id,
    clinic_name = clinic_row.name
  where me.id = auth.uid();

  physio_id := recipient;
  select p.display_name into physio_name
  from public.profiles p where p.id = recipient;
  clinic_name := clinic_row.name;
  return next;
end;
$$;

grant execute on function public.patient_link_physio_code(text) to authenticated;
