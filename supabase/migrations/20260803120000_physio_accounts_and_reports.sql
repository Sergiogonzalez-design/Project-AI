-- Physio accounts and pre-visit reports
-- Adds a second account type ("physio") that can create patient accounts and
-- receive an automatically generated clinician-oriented report once a linked
-- patient completes a body-area consult.

-- 1. Profile fields ----------------------------------------------------------

alter table public.profiles
  add column if not exists account_type text not null default 'patient'
    check (account_type in ('patient', 'physio')),
  add column if not exists physio_id uuid references public.profiles(id) on delete set null,
  add column if not exists clinic_name text;

create index if not exists profiles_physio_id_idx on public.profiles (physio_id);

-- 2. Prevent clients from self-granting account_type/physio_id via RLS update
-- (extends the existing is_admin protection trigger with the same pattern).

create or replace function public.profiles_protect_is_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then
      new.is_admin := false;
      new.account_type := 'patient';
      new.physio_id := null;
    end if;
  elsif tg_op = 'UPDATE' then
    if auth.uid() is not null then
      new.is_admin := old.is_admin;
      new.account_type := old.account_type;
      new.physio_id := old.physio_id;
    end if;
  end if;
  return new;
end;
$$;

-- Trigger already exists (profiles_protect_is_admin on public.profiles) and
-- will pick up this updated function body automatically.

-- 3. is_physio() helper (mirrors public.is_admin()) --------------------------

create or replace function public.is_physio()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.account_type = 'physio'
  );
$$;

revoke all on function public.is_physio() from public;
grant execute on function public.is_physio() to authenticated;

-- 4. physio_list_patients() RPC (mirrors public.admin_list_users()) ----------

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
  order by u.created_at desc;
end;
$$;

revoke all on function public.physio_list_patients() from public;
grant execute on function public.physio_list_patients() to authenticated;

-- 5. clinical_reports table ---------------------------------------------------

create table if not exists public.clinical_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  patient_id uuid references auth.users(id) on delete cascade not null,
  physio_id uuid references auth.users(id) on delete cascade not null,
  conversation_id uuid references public.conversations(id) on delete set null,
  body_area text,
  patient_summary text,
  physio_report text not null,
  status text not null default 'new' check (status in ('new', 'viewed')),
  viewed_at timestamptz
);

create index if not exists clinical_reports_physio_idx on public.clinical_reports (physio_id, created_at desc);
create index if not exists clinical_reports_patient_idx on public.clinical_reports (patient_id, created_at desc);

alter table public.clinical_reports enable row level security;

-- Patient can create a report only for the physio actually linked to them.
create policy "clinical_reports_patient_insert"
  on public.clinical_reports for insert to authenticated
  with check (
    patient_id = auth.uid()
    and physio_id = (select p.physio_id from public.profiles p where p.id = auth.uid())
  );

-- Patient can read their own reports (cross-reference with what the physio sees).
create policy "clinical_reports_patient_select"
  on public.clinical_reports for select to authenticated
  using (patient_id = auth.uid());

-- Physio can read reports addressed to them.
create policy "clinical_reports_physio_select"
  on public.clinical_reports for select to authenticated
  using (physio_id = auth.uid());

-- Physio can mark reports as viewed.
create policy "clinical_reports_physio_update"
  on public.clinical_reports for update to authenticated
  using (physio_id = auth.uid())
  with check (physio_id = auth.uid());
