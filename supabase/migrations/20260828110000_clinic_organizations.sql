-- Clinic organizations: a clinic owner account can manage branding + staff physios.
-- Billing (Stripe) comes later — see billing_status + public.clinic_billing_enforced().

-- 1. account_type: clinic --------------------------------------------------------

alter table public.profiles
  drop constraint if exists profiles_account_type_check;

alter table public.profiles
  add constraint profiles_account_type_check
  check (account_type in ('patient', 'physio', 'clinic'));

-- 2. clinics ---------------------------------------------------------------------

create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  phone text,
  website text,
  address text,
  city text,
  postal_code text,
  country text not null default 'ES',
  lat double precision,
  lng double precision,
  google_place_id text,
  google_maps_url text,
  -- Stripe (unused until CLINIC_BILLING_REQUIRED). Default pending so we can
  -- require payment to create/activate a clinic without a schema change.
  billing_status text not null default 'pending'
    check (billing_status in ('pending', 'trial', 'active', 'past_due', 'canceled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  billing_plan text
);

create index if not exists clinics_owner_idx on public.clinics (owner_id);
create index if not exists clinics_slug_idx on public.clinics (slug);

alter table public.profiles
  add column if not exists clinic_id uuid references public.clinics(id) on delete set null;

create index if not exists profiles_clinic_id_idx on public.profiles (clinic_id);

create table if not exists public.clinic_members (
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'physio')),
  created_at timestamptz not null default now(),
  primary key (clinic_id, user_id)
);

create index if not exists clinic_members_user_idx on public.clinic_members (user_id);

create table if not exists public.clinic_invites (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  email text not null,
  display_name text,
  token text not null unique,
  invited_by uuid not null references public.profiles(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz
);

create index if not exists clinic_invites_clinic_idx on public.clinic_invites (clinic_id);
create unique index if not exists clinic_invites_pending_email_uidx
  on public.clinic_invites (clinic_id, email)
  where accepted_at is null;

-- 3. Protect clinic_id / account_type -------------------------------------------

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
      new.account_type := old.account_type;
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

-- 4. Helpers ---------------------------------------------------------------------

-- Flip to true when Stripe checkout is live. Until then owners can set up a clinic.
create or replace function public.clinic_billing_enforced()
returns boolean
language sql
immutable
as $$
  select false;
$$;

create or replace function public.clinic_has_paid_access(p_status text)
returns boolean
language sql
immutable
as $$
  select (not public.clinic_billing_enforced())
    or p_status in ('active', 'trial');
$$;

create or replace function public._slugify(p text)
returns text
language plpgsql
immutable
as $$
declare
  s text;
begin
  s := lower(trim(both from coalesce(p, '')));
  s := translate(s, 'áàäâãåéèëêíìïîóòöôõúùüûñç', 'aaaaaaeeeeiiiiooooouuuunc');
  s := regexp_replace(s, '[^a-z0-9]+', '-', 'g');
  s := regexp_replace(s, '(^-+|-+$)', '', 'g');
  if s is null or s = '' then
    s := 'clinica';
  end if;
  return left(s, 48);
end;
$$;

create or replace function public._unique_clinic_slug(p_name text)
returns text
language plpgsql
as $$
declare
  base text := public._slugify(p_name);
  candidate text := base;
  i int := 2;
begin
  while exists (select 1 from public.clinics c where c.slug = candidate) loop
    candidate := left(base, 40) || '-' || i::text;
    i := i + 1;
  end loop;
  return candidate;
end;
$$;

create or replace function public.is_clinic_owner()
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
      and p.account_type = 'clinic'
  );
$$;

create or replace function public.clinic_is_staff(p_clinic uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.clinic_members m
    where m.clinic_id = p_clinic
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.clinic_is_manager(p_clinic uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.clinic_members m
    where m.clinic_id = p_clinic
      and m.user_id = auth.uid()
      and m.role in ('owner', 'admin')
  );
$$;

revoke all on function public.is_clinic_owner() from public;
revoke all on function public.clinic_is_staff(uuid) from public;
revoke all on function public.clinic_is_manager(uuid) from public;
grant execute on function public.is_clinic_owner() to authenticated;
grant execute on function public.clinic_is_staff(uuid) to authenticated;
grant execute on function public.clinic_is_manager(uuid) to authenticated;

-- 5. Owner RPCs ------------------------------------------------------------------

create or replace function public.clinic_create_own(p_name text, p_description text default null)
returns public.clinics
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.clinics;
  nm text := trim(both from coalesce(p_name, ''));
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if not public.is_clinic_owner() then
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
  values (auth.uid(), nm, public._unique_clinic_slug(nm), nullif(trim(both from coalesce(p_description, '')), ''), 'pending')
  returning * into row;

  insert into public.clinic_members (clinic_id, user_id, role)
  values (row.id, auth.uid(), 'owner');

  perform set_config('app.linking_clinic', '1', true);
  update public.profiles
  set clinic_id = row.id,
      clinic_name = row.name,
      updated_at = now()
  where id = auth.uid();

  return row;
end;
$$;

create or replace function public.clinic_get_own()
returns public.clinics
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.clinics;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  select c.* into row
  from public.clinics c
  join public.clinic_members m on m.clinic_id = c.id
  where m.user_id = auth.uid()
  order by case when m.role = 'owner' then 0 else 1 end
  limit 1;
  return row;
end;
$$;

create or replace function public.clinic_update_own(
  p_name text default null,
  p_description text default null,
  p_logo_url text default null,
  p_phone text default null,
  p_website text default null,
  p_address text default null,
  p_city text default null,
  p_postal_code text default null,
  p_country text default null,
  p_lat double precision default null,
  p_lng double precision default null,
  p_google_place_id text default null,
  p_google_maps_url text default null
)
returns public.clinics
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  row public.clinics;
  nm text;
begin
  if not public.is_clinic_owner() then
    raise exception 'not authorized';
  end if;
  select c.id into cid from public.clinics c where c.owner_id = auth.uid();
  if cid is null then
    raise exception 'clinic not found';
  end if;

  nm := nullif(trim(both from coalesce(p_name, '')), '');

  update public.clinics
  set
    name = coalesce(nm, name),
    description = coalesce(p_description, description),
    logo_url = coalesce(p_logo_url, logo_url),
    phone = coalesce(p_phone, phone),
    website = coalesce(p_website, website),
    address = coalesce(p_address, address),
    city = coalesce(p_city, city),
    postal_code = coalesce(p_postal_code, postal_code),
    country = coalesce(nullif(trim(both from coalesce(p_country, '')), ''), country),
    lat = coalesce(p_lat, lat),
    lng = coalesce(p_lng, lng),
    google_place_id = coalesce(p_google_place_id, google_place_id),
    google_maps_url = coalesce(p_google_maps_url, google_maps_url),
    updated_at = now()
  where id = cid
  returning * into row;

  if nm is not null then
    update public.profiles
    set clinic_name = nm, updated_at = now()
    where clinic_id = cid;
  end if;

  return row;
end;
$$;

create or replace function public.clinic_list_members()
returns table (
  user_id uuid,
  email text,
  display_name text,
  role text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  if not public.is_clinic_owner() then
    raise exception 'not authorized';
  end if;
  select c.id into cid from public.clinics c where c.owner_id = auth.uid();
  if cid is null then
    raise exception 'clinic not found';
  end if;

  return query
  select
    m.user_id,
    u.email::text,
    p.display_name,
    m.role,
    m.created_at
  from public.clinic_members m
  join public.profiles p on p.id = m.user_id
  join auth.users u on u.id = m.user_id
  where m.clinic_id = cid
  order by case m.role when 'owner' then 0 when 'admin' then 1 else 2 end, m.created_at;
end;
$$;

create or replace function public.clinic_create_invite(p_email text, p_display_name text default null)
returns table (token text, expires_at timestamptz, email text)
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  em text := lower(trim(both from coalesce(p_email, '')));
  tok text := replace(gen_random_uuid()::text, '-', '');
begin
  if not public.is_clinic_owner() then
    raise exception 'not authorized';
  end if;
  if em !~ '^[^@]+@[^@]+\.[^@]+$' then
    raise exception 'invalid email';
  end if;
  select c.id into cid from public.clinics c where c.owner_id = auth.uid();
  if cid is null then
    raise exception 'clinic not found';
  end if;
  if exists (select 1 from auth.users u where lower(u.email) = em) then
    raise exception 'email already registered';
  end if;

  insert into public.clinic_invites (clinic_id, email, display_name, token, invited_by)
  values (cid, em, nullif(trim(both from coalesce(p_display_name, '')), ''), tok, auth.uid());

  return query
  select tok, (now() + interval '14 days')::timestamptz, em;
end;
$$;

create or replace function public.clinic_list_invites()
returns table (
  id uuid,
  email text,
  display_name text,
  created_at timestamptz,
  expires_at timestamptz,
  accepted_at timestamptz,
  token text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  if not public.is_clinic_owner() then
    raise exception 'not authorized';
  end if;
  select c.id into cid from public.clinics c where c.owner_id = auth.uid();
  if cid is null then
    raise exception 'clinic not found';
  end if;

  return query
  select i.id, i.email, i.display_name, i.created_at, i.expires_at, i.accepted_at, i.token
  from public.clinic_invites i
  where i.clinic_id = cid
  order by i.created_at desc;
end;
$$;

-- Called by service role after creating the physio auth user.
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

create or replace function public.clinic_lookup_invite(p_token text)
returns table (
  clinic_name text,
  email text,
  display_name text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select c.name, i.email, i.display_name, i.expires_at
  from public.clinic_invites i
  join public.clinics c on c.id = i.clinic_id
  where i.token = p_token
    and i.accepted_at is null
    and i.expires_at > now();
end;
$$;

-- 6. Public directory (no Stripe fields) ----------------------------------------

create or replace function public.clinic_get_public(p_slug text)
returns table (
  id uuid,
  name text,
  slug text,
  description text,
  logo_url text,
  phone text,
  website text,
  address text,
  city text,
  postal_code text,
  country text,
  lat double precision,
  lng double precision,
  google_maps_url text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
  select
    c.id, c.name, c.slug, c.description, c.logo_url, c.phone, c.website,
    c.address, c.city, c.postal_code, c.country, c.lat, c.lng, c.google_maps_url
  from public.clinics c
  where c.slug = p_slug
  limit 1;
end;
$$;

create or replace function public.clinic_list_physios_public(p_slug text)
returns table (display_name text)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
  select p.display_name
  from public.clinics c
  join public.clinic_members m on m.clinic_id = c.id and m.role = 'physio'
  join public.profiles p on p.id = m.user_id
  where c.slug = p_slug
    and p.display_name is not null
  order by p.display_name;
end;
$$;

-- 7. Linked physio shows org name when the therapist belongs to a clinic --------

create or replace function public.patient_get_linked_physio()
returns table (
  physio_id uuid,
  physio_name text,
  clinic_name text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  return query
  select
    target.id,
    target.display_name,
    coalesce(cl.name, target.clinic_name)
  from public.profiles me
  join public.profiles target on target.id = me.physio_id
  left join public.clinics cl on cl.id = target.clinic_id
  where me.id = auth.uid();
end;
$$;

revoke all on function public.clinic_create_own(text, text) from public;
revoke all on function public.clinic_get_own() from public;
revoke all on function public.clinic_update_own(text, text, text, text, text, text, text, text, text, double precision, double precision, text, text) from public;
revoke all on function public.clinic_list_members() from public;
revoke all on function public.clinic_create_invite(text, text) from public;
revoke all on function public.clinic_list_invites() from public;
revoke all on function public.clinic_accept_invite(text, uuid) from public;
revoke all on function public.clinic_lookup_invite(text) from public;
revoke all on function public.clinic_get_public(text) from public;
revoke all on function public.clinic_list_physios_public(text) from public;

grant execute on function public.clinic_create_own(text, text) to authenticated;
grant execute on function public.clinic_get_own() to authenticated;
grant execute on function public.clinic_update_own(text, text, text, text, text, text, text, text, text, double precision, double precision, text, text) to authenticated;
grant execute on function public.clinic_list_members() to authenticated;
grant execute on function public.clinic_create_invite(text, text) to authenticated;
grant execute on function public.clinic_list_invites() to authenticated;
grant execute on function public.clinic_lookup_invite(text) to anon, authenticated;
grant execute on function public.clinic_get_public(text) to anon, authenticated;
grant execute on function public.clinic_list_physios_public(text) to anon, authenticated;
-- clinic_accept_invite: service role only (no grant to authenticated/anon)

-- 8. RLS -------------------------------------------------------------------------

alter table public.clinics enable row level security;
alter table public.clinic_members enable row level security;
alter table public.clinic_invites enable row level security;

drop policy if exists clinics_staff_select on public.clinics;
create policy clinics_staff_select
  on public.clinics for select
  to authenticated
  using (public.clinic_is_staff(id));

drop policy if exists clinics_owner_update on public.clinics;
create policy clinics_owner_update
  on public.clinics for update
  to authenticated
  using (public.clinic_is_manager(id))
  with check (public.clinic_is_manager(id));

drop policy if exists clinic_members_staff_select on public.clinic_members;
create policy clinic_members_staff_select
  on public.clinic_members for select
  to authenticated
  using (public.clinic_is_staff(clinic_id));

drop policy if exists clinic_invites_owner_select on public.clinic_invites;
create policy clinic_invites_owner_select
  on public.clinic_invites for select
  to authenticated
  using (public.clinic_is_manager(clinic_id));

-- 9. Logo storage ----------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'clinic-logos',
  'clinic-logos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists clinic_logos_read on storage.objects;
create policy clinic_logos_read
  on storage.objects for select
  to authenticated, anon
  using (bucket_id = 'clinic-logos');

drop policy if exists clinic_logos_insert on storage.objects;
create policy clinic_logos_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'clinic-logos'
    and public.clinic_is_manager(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists clinic_logos_update on storage.objects;
create policy clinic_logos_update
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'clinic-logos'
    and public.clinic_is_manager(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'clinic-logos'
    and public.clinic_is_manager(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists clinic_logos_delete on storage.objects;
create policy clinic_logos_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'clinic-logos'
    and public.clinic_is_manager(((storage.foldername(name))[1])::uuid)
  );
