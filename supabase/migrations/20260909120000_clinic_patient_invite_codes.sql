-- Clinic admins: patient invite codes + visibility of linked patient reports.

-- 1. Patient invite code on clinics ------------------------------------------------

alter table public.clinics
  add column if not exists patient_invite_code text;

create unique index if not exists clinics_patient_invite_code_uidx
  on public.clinics (patient_invite_code)
  where patient_invite_code is not null;

create or replace function public._generate_clinic_patient_invite_code()
returns text
language plpgsql
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  candidate text;
  i int;
begin
  loop
    candidate := '';
    for i in 1..8 loop
      candidate := candidate || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (
      select 1 from public.clinics c where c.patient_invite_code = candidate
    )
    and not exists (
      select 1 from public.profiles p where p.invite_code = candidate
    );
  end loop;
  return candidate;
end;
$$;

create or replace function public.clinic_get_or_create_patient_invite_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  existing text;
  generated text;
begin
  if not public.is_clinic_owner() then
    raise exception 'not authorized';
  end if;

  select c.id, c.patient_invite_code into cid, existing
  from public.clinics c
  join public.clinic_members m on m.clinic_id = c.id
  where m.user_id = auth.uid() and m.role = 'owner'
  limit 1;

  if cid is null then
    raise exception 'clínica no encontrada';
  end if;

  if existing is not null and length(existing) > 0 then
    return existing;
  end if;

  generated := public._generate_clinic_patient_invite_code();
  update public.clinics
  set patient_invite_code = generated
  where id = cid;

  return generated;
end;
$$;

create or replace function public.clinic_regenerate_patient_invite_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  generated text;
begin
  if not public.is_clinic_owner() then
    raise exception 'not authorized';
  end if;

  select c.id into cid
  from public.clinics c
  join public.clinic_members m on m.clinic_id = c.id
  where m.user_id = auth.uid() and m.role = 'owner'
  limit 1;

  if cid is null then
    raise exception 'clínica no encontrada';
  end if;

  generated := public._generate_clinic_patient_invite_code();
  update public.clinics
  set patient_invite_code = generated
  where id = cid;

  return generated;
end;
$$;

revoke all on function public._generate_clinic_patient_invite_code() from public;
revoke all on function public.clinic_get_or_create_patient_invite_code() from public;
revoke all on function public.clinic_regenerate_patient_invite_code() from public;
grant execute on function public.clinic_get_or_create_patient_invite_code() to authenticated;
grant execute on function public.clinic_regenerate_patient_invite_code() to authenticated;

-- 2. Resolve who receives reports for a clinic patient ---------------------------

create or replace function public._clinic_resolve_patient_recipient(p_clinic_id uuid)
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  recipient uuid;
begin
  -- Prefer an active staff physiotherapist.
  select m.user_id into recipient
  from public.clinic_members m
  join public.profiles p on p.id = m.user_id
  where m.clinic_id = p_clinic_id
    and p.account_type = 'physio'
  order by
    case when m.role = 'physio' then 0 when m.role = 'admin' then 1 else 2 end,
    m.created_at asc nulls last
  limit 1;

  if recipient is not null then
    return recipient;
  end if;

  -- Fallback: clinic owner inbox (account_type = clinic).
  select m.user_id into recipient
  from public.clinic_members m
  where m.clinic_id = p_clinic_id
    and m.role = 'owner'
  limit 1;

  return recipient;
end;
$$;

revoke all on function public._clinic_resolve_patient_recipient(uuid) from public;

-- 3. Redeem: physio code OR clinic patient code ----------------------------------

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

    perform set_config('app.linking_physio', '1', true);
    update public.profiles
    set
      physio_id = target.id,
      clinic_name = coalesce(target.clinic_name, clinic_name)
    where id = auth.uid();

    physio_id := target.id;
    physio_name := target.display_name;
    clinic_name := target.clinic_name;
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

-- 4. Allow clinic owners as report recipients ------------------------------------

create or replace function public.patient_submit_clinical_report(
  p_conversation_id uuid,
  p_body_area text,
  p_patient_summary text,
  p_physio_report text,
  p_fallback_physio_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_patient_id uuid := auth.uid();
  v_physio_id uuid;
  v_report_id uuid;
begin
  if v_patient_id is null then
    raise exception 'not authenticated';
  end if;

  if p_physio_report is null or length(trim(p_physio_report)) < 20 then
    raise exception 'informe vacío';
  end if;

  select p.physio_id into v_physio_id
  from public.profiles p
  where p.id = v_patient_id;

  if v_physio_id is null then
    raise exception 'paciente no vinculado a un fisioterapeuta';
  end if;

  if v_physio_id = v_patient_id then
    raise exception 'código no válido';
  end if;

  if not exists (
    select 1 from public.profiles ph
    where ph.id = v_physio_id
      and ph.account_type in ('physio', 'clinic')
  ) then
    raise exception 'fisioterapeuta no válido';
  end if;

  if p_conversation_id is not null then
    if not exists (
      select 1 from public.conversations c
      where c.id = p_conversation_id and c.user_id = v_patient_id
    ) then
      raise exception 'conversación no válida';
    end if;
  end if;

  if p_conversation_id is not null then
    update public.clinical_reports
    set
      physio_id = v_physio_id,
      body_area = nullif(trim(coalesce(p_body_area, '')), ''),
      patient_summary = p_patient_summary,
      physio_report = p_physio_report,
      status = 'new',
      viewed_at = null
    where conversation_id = p_conversation_id
      and patient_id = v_patient_id
    returning id into v_report_id;

    if v_report_id is not null then
      return v_report_id;
    end if;
  end if;

  insert into public.clinical_reports (
    patient_id,
    physio_id,
    conversation_id,
    body_area,
    patient_summary,
    physio_report,
    status
  )
  values (
    v_patient_id,
    v_physio_id,
    p_conversation_id,
    nullif(trim(coalesce(p_body_area, '')), ''),
    p_patient_summary,
    p_physio_report,
    'new'
  )
  returning id into v_report_id;

  return v_report_id;
end;
$$;

-- 5. Clinic owner visibility helpers + list RPCs ---------------------------------

create or replace function public._clinic_owned_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select c.id
  from public.clinics c
  join public.clinic_members m on m.clinic_id = c.id
  where m.user_id = auth.uid() and m.role = 'owner'
  limit 1;
$$;

create or replace function public._is_clinic_report_visible(p_physio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    p_physio_id = auth.uid()
    or exists (
      select 1
      from public.clinic_members owner_m
      join public.clinic_members staff_m
        on staff_m.clinic_id = owner_m.clinic_id
      where owner_m.user_id = auth.uid()
        and owner_m.role = 'owner'
        and staff_m.user_id = p_physio_id
    );
$$;

drop policy if exists "clinical_reports_clinic_owner_select" on public.clinical_reports;
create policy "clinical_reports_clinic_owner_select"
  on public.clinical_reports for select to authenticated
  using (
    public.is_clinic_owner()
    and public._is_clinic_report_visible(physio_id)
  );

drop policy if exists "clinical_reports_clinic_owner_update" on public.clinical_reports;
create policy "clinical_reports_clinic_owner_update"
  on public.clinical_reports for update to authenticated
  using (
    public.is_clinic_owner()
    and public._is_clinic_report_visible(physio_id)
  )
  with check (
    public.is_clinic_owner()
    and public._is_clinic_report_visible(physio_id)
  );

create or replace function public.clinic_list_patients()
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
    coalesce(p.onboarding_completed, false)
  from public.profiles p
  join auth.users u on u.id = p.id
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

revoke all on function public._clinic_owned_id() from public;
revoke all on function public._is_clinic_report_visible(uuid) from public;
revoke all on function public.clinic_list_patients() from public;
grant execute on function public.clinic_list_patients() to authenticated;
