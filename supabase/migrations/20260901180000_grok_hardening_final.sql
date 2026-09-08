-- Grok review final hardening: RAG table grants, premium lock, conversation physio bind, consult-photos.

-- 1. document_chunks: explicit revoke writes; SELECT stays authenticated + admin policies.
drop policy if exists chunks_insert_service on public.document_chunks;
drop policy if exists chunks_select_service on public.document_chunks;

revoke insert, update, delete, truncate on table public.document_chunks from anon;
revoke insert, update, delete, truncate on table public.document_chunks from authenticated;
revoke select on table public.document_chunks from anon;
grant select on table public.document_chunks to authenticated;

-- 2. profiles.is_premium — clients cannot self-grant (mirror is_admin).
create or replace function public.profiles_protect_is_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_type text;
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then
      new.is_admin := false;
      new.is_premium := false;
      meta_type := coalesce(auth.jwt()->'app_metadata'->>'account_type', 'patient');
      if meta_type in ('physio', 'clinic') then
        new.account_type := meta_type;
      else
        new.account_type := 'patient';
      end if;
      if coalesce(current_setting('app.linking_physio', true), '') <> '1' then
        new.physio_id := null;
        new.invite_code := null;
      end if;
      if coalesce(current_setting('app.linking_clinic', true), '') <> '1' then
        new.clinic_id := null;
      end if;
    end if;
  elsif tg_op = 'UPDATE' then
    if auth.uid() is not null then
      new.is_admin := old.is_admin;
      new.is_premium := old.is_premium;
      meta_type := coalesce(auth.jwt()->'app_metadata'->>'account_type', '');

      if coalesce(current_setting('app.linking_clinic', true), '') = '1'
         and new.account_type = 'clinic'
         and old.account_type in ('patient', 'clinic') then
        null;
      elsif old.account_type = 'patient'
         and meta_type in ('physio', 'clinic')
         and new.account_type = meta_type then
        null;
      else
        new.account_type := old.account_type;
      end if;

      if coalesce(current_setting('app.linking_physio', true), '') = '1' then
        null;
      else
        new.physio_id := old.physio_id;
        new.invite_code := old.invite_code;
      end if;
      if coalesce(current_setting('app.linking_clinic', true), '') <> '1' then
        new.clinic_id := old.clinic_id;
      end if;
    end if;
  end if;
  return new;
end;
$$;

-- 3. conversations.physio_id — derive from profile on insert; block client writes on update.
create or replace function public.conversations_protect_physio()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  linked uuid;
  pname text;
  cname text;
begin
  if coalesce(current_setting('app.linking_conversation_physio', true), '') = '1' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.kind = 'fisioterapia' then
      select p.physio_id, ph.display_name, coalesce(cl.name, ph.clinic_name)
        into linked, pname, cname
      from public.profiles p
      left join public.profiles ph
        on ph.id = p.physio_id and ph.account_type = 'physio'
      left join public.clinics cl on cl.id = ph.clinic_id
      where p.id = new.user_id;

      new.physio_id := linked;
      new.physio_name := pname;
      new.clinic_name := cname;
    else
      new.physio_id := null;
      new.physio_name := null;
      new.clinic_name := null;
    end if;
  elsif tg_op = 'UPDATE' then
    new.physio_id := old.physio_id;
    new.physio_name := old.physio_name;
    new.clinic_name := old.clinic_name;
  end if;

  return new;
end;
$$;

drop trigger if exists conversations_protect_physio on public.conversations;
create trigger conversations_protect_physio
  before insert or update on public.conversations
  for each row
  execute function public.conversations_protect_physio();

-- 4. patient_submit_clinical_report — profile link only (not client-written conversation.physio_id).
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
    where ph.id = v_physio_id and ph.account_type = 'physio'
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

-- 5. consult-photos: private bucket; list/read own folder only (writes unchanged).
update storage.buckets
set public = false
where id = 'consult-photos';

drop policy if exists "consult_photos_select" on storage.objects;
create policy "consult_photos_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'consult-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
