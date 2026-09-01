-- Reliable clinical report insert for Fisioterapia (guest + account).
-- Fixes silent RLS failures when session linkedPhysio != profiles.physio_id,
-- and ensures physios always see patients who have reports addressed to them.

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
  v_conv_physio uuid;
begin
  if v_patient_id is null then
    raise exception 'not authenticated';
  end if;

  if p_physio_report is null or length(trim(p_physio_report)) < 20 then
    raise exception 'informe vacío';
  end if;

  -- Prefer lasting profile link.
  select p.physio_id into v_physio_id
  from public.profiles p
  where p.id = v_patient_id;

  -- Conversation may carry the physio from the invite redeem session.
  if p_conversation_id is not null then
    select c.physio_id into v_conv_physio
    from public.conversations c
    where c.id = p_conversation_id
      and c.user_id = v_patient_id;
  end if;

  v_physio_id := coalesce(v_physio_id, v_conv_physio, p_fallback_physio_id);

  if v_physio_id is null then
    raise exception 'paciente no vinculado a un fisioterapeuta';
  end if;

  -- Never allow submitting a report to yourself.
  if v_physio_id = v_patient_id then
    raise exception 'código no válido';
  end if;

  -- Target must be a physio account.
  if not exists (
    select 1 from public.profiles ph
    where ph.id = v_physio_id and ph.account_type = 'physio'
  ) then
    raise exception 'fisioterapeuta no válido';
  end if;

  -- Heal missing profile link so the patient appears in physio_list_patients.
  perform set_config('app.linking_physio', '1', true);
  update public.profiles
  set physio_id = v_physio_id
  where id = v_patient_id
    and (physio_id is distinct from v_physio_id);

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

revoke all on function public.patient_submit_clinical_report(uuid, text, text, text, uuid) from public;
grant execute on function public.patient_submit_clinical_report(uuid, text, text, text, uuid) to authenticated;

-- List patients linked OR who already have reports for this physio.
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
  where p.physio_id = auth.uid()
     or exists (
       select 1
       from public.clinical_reports cr
       where cr.patient_id = p.id
         and cr.physio_id = auth.uid()
     )
  order by u.created_at desc;
end;
$$;
