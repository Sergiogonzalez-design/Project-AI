-- One clinical report per conversation: update if it already exists.
-- Also remove duplicate rows that were created by double-submit.

-- Keep the newest report per (patient_id, conversation_id); delete older dupes.
delete from public.clinical_reports cr
using public.clinical_reports newer
where cr.conversation_id is not null
  and cr.conversation_id = newer.conversation_id
  and cr.patient_id = newer.patient_id
  and cr.created_at < newer.created_at;

create unique index if not exists clinical_reports_conversation_unique
  on public.clinical_reports (conversation_id)
  where conversation_id is not null;

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

  select p.physio_id into v_physio_id
  from public.profiles p
  where p.id = v_patient_id;

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

  if v_physio_id = v_patient_id then
    raise exception 'código no válido';
  end if;

  if not exists (
    select 1 from public.profiles ph
    where ph.id = v_physio_id and ph.account_type = 'physio'
  ) then
    raise exception 'fisioterapeuta no válido';
  end if;

  perform set_config('app.linking_physio', '1', true);
  update public.profiles
  set physio_id = v_physio_id
  where id = v_patient_id
    and (physio_id is distinct from v_physio_id);

  -- Same conversation → replace the existing report instead of inserting a duplicate.
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

revoke all on function public.patient_submit_clinical_report(uuid, text, text, text, uuid) from public;
grant execute on function public.patient_submit_clinical_report(uuid, text, text, text, uuid) to authenticated;
