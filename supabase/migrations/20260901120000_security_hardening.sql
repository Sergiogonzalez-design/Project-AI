-- Security hardening (Grok review): clinic RPCs, patient physio binding, RAG writes.

-- 1. clinic_accept_invite — service role only (block authenticated/anon callers)
create or replace function public.clinic_accept_invite(
  p_token text,
  p_user_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.clinic_invites;
  cname text;
begin
  if auth.uid() is not null then
    raise exception 'not authorized';
  end if;

  select * into inv
  from public.clinic_invites
  where token = p_token
    and accepted_at is null
    and expires_at > now();
  if not found then
    raise exception 'invite not found or expired';
  end if;

  select name into cname from public.clinics where id = inv.clinic_id;

  insert into public.clinic_members (clinic_id, user_id, role)
  values (inv.clinic_id, p_user_id, 'physio')
  on conflict (clinic_id, user_id) do nothing;

  perform set_config('app.linking_clinic', '1', true);
  update public.profiles
  set clinic_id = inv.clinic_id,
      clinic_name = cname,
      display_name = coalesce(nullif(display_name, ''), inv.display_name),
      account_type = 'physio',
      updated_at = now()
  where id = p_user_id;

  update public.clinic_invites
  set accepted_at = now()
  where id = inv.id;

  return inv.clinic_id;
end;
$$;

revoke all on function public.clinic_accept_invite(text, uuid) from public;
revoke all on function public.clinic_accept_invite(text, uuid) from anon;
revoke all on function public.clinic_accept_invite(text, uuid) from authenticated;

-- 2. clinic_create_own — no patient self-promotion without clinic signup metadata
create or replace function public.clinic_create_own(p_name text, p_description text default null)
returns public.clinics
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.clinics;
  nm text := trim(both from coalesce(p_name, ''));
  meta_type text := coalesce(auth.jwt()->'app_metadata'->>'account_type', '');
  cur_type text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select p.account_type into cur_type
  from public.profiles p
  where p.id = auth.uid();

  if cur_type is null then
    raise exception 'not authorized';
  end if;

  if cur_type <> 'clinic' then
    if meta_type <> 'clinic' then
      raise exception 'not authorized';
    end if;
    perform set_config('app.linking_clinic', '1', true);
    update public.profiles
    set account_type = 'clinic', updated_at = now()
    where id = auth.uid();
    cur_type := 'clinic';
  end if;

  if cur_type <> 'clinic' then
    raise exception 'not authorized';
  end if;

  if char_length(nm) < 2 then
    raise exception 'clinic name required';
  end if;

  select * into row from public.clinics c where c.owner_id = auth.uid() limit 1;
  if found then
    return row;
  end if;

  insert into public.clinics (owner_id, name, slug, description, billing_status)
  values (
    auth.uid(),
    nm,
    public._unique_clinic_slug(nm),
    nullif(trim(both from coalesce(p_description, '')), ''),
    'pending'
  )
  returning * into row;

  insert into public.clinic_members (clinic_id, user_id, role)
  values (row.id, auth.uid(), 'owner');

  perform set_config('app.linking_clinic', '1', true);
  update public.profiles
  set clinic_id = row.id,
      clinic_name = row.name,
      account_type = 'clinic',
      updated_at = now()
  where id = auth.uid();

  return row;
end;
$$;

-- 3. patient_submit_clinical_report — drop arbitrary physio fallback
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

  v_physio_id := coalesce(v_physio_id, v_conv_physio);

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

-- 4. document_chunks — block authenticated RAG poisoning; reads stay open
alter table if exists public.document_chunks enable row level security;

drop policy if exists "Enable insert for authenticated users only" on public.document_chunks;
drop policy if exists "Allow authenticated insert" on public.document_chunks;
drop policy if exists document_chunks_authenticated_insert on public.document_chunks;
drop policy if exists document_chunks_insert on public.document_chunks;
drop policy if exists document_chunks_public_insert on public.document_chunks;

drop policy if exists document_chunks_select on public.document_chunks;
create policy document_chunks_select
  on public.document_chunks for select
  to anon, authenticated
  using (true);

drop policy if exists document_chunks_admin_insert on public.document_chunks;
create policy document_chunks_admin_insert
  on public.document_chunks for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists document_chunks_admin_update on public.document_chunks;
create policy document_chunks_admin_update
  on public.document_chunks for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists document_chunks_admin_delete on public.document_chunks;
create policy document_chunks_admin_delete
  on public.document_chunks for delete
  to authenticated
  using (public.is_admin());
