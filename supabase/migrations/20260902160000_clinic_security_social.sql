-- Grok PR #5: close invite/auth leaks, strip billing from owner RPCs,
-- reusable open team codes, public social fields.

-- ---------------------------------------------------------------------------
-- 1) Billing strip helper
-- ---------------------------------------------------------------------------
create or replace function public._clinic_without_billing(c public.clinics)
returns public.clinics
language plpgsql
immutable
set search_path = public
as $$
begin
  if c is null then
    return c;
  end if;
  c.stripe_customer_id := null;
  c.stripe_subscription_id := null;
  return c;
end;
$$;

revoke all on function public._clinic_without_billing(public.clinics) from public;

-- ---------------------------------------------------------------------------
-- 2) clinic_create_own — JWT app_metadata=clinic only (no incomplete-patient promote)
-- ---------------------------------------------------------------------------
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
    return public._clinic_without_billing(row);
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

  return public._clinic_without_billing(row);
end;
$$;

revoke all on function public.clinic_create_own(text, text) from public;
grant execute on function public.clinic_create_own(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 3) clinic_get_own / claim — never return Stripe ids
-- ---------------------------------------------------------------------------
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
  return public._clinic_without_billing(row);
end;
$$;

revoke all on function public.clinic_get_own() from public;
grant execute on function public.clinic_get_own() to authenticated;

-- ---------------------------------------------------------------------------
-- 4) Invite lookup: no token, rate-limited, keep email for reserved invites
-- ---------------------------------------------------------------------------
create table if not exists public.clinic_invite_lookup_hits (
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists clinic_invite_lookup_hits_ip_at_idx
  on public.clinic_invite_lookup_hits (ip_hash, created_at desc);

alter table public.clinic_invite_lookup_hits enable row level security;

revoke all on table public.clinic_invite_lookup_hits from public;
revoke all on table public.clinic_invite_lookup_hits from anon;
revoke all on table public.clinic_invite_lookup_hits from authenticated;

create or replace function public._client_ip_hash()
returns text
language plpgsql
stable
set search_path = public, extensions
as $$
declare
  hdrs jsonb := '{}'::jsonb;
  ip text;
begin
  begin
    hdrs := current_setting('request.headers', true)::jsonb;
  exception when others then
    hdrs := '{}'::jsonb;
  end;
  ip := coalesce(
    nullif(btrim(hdrs->>'cf-connecting-ip'), ''),
    nullif(btrim(split_part(coalesce(hdrs->>'x-forwarded-for', ''), ',', 1)), ''),
    nullif(btrim(hdrs->>'x-real-ip'), ''),
    'unknown'
  );
  return encode(digest(convert_to(ip, 'UTF8'), 'sha256'), 'hex');
end;
$$;

revoke all on function public._client_ip_hash() from public;

drop function if exists public.clinic_lookup_invite(text);

create or replace function public.clinic_lookup_invite(p_token text)
returns table (
  clinic_name text,
  email text,
  display_name text,
  expires_at timestamptz,
  invite_code text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  key text := upper(trim(both from coalesce(p_token, '')));
  h text;
  n int;
begin
  if key = '' then
    return;
  end if;

  h := public._client_ip_hash();
  insert into public.clinic_invite_lookup_hits (ip_hash) values (h);
  delete from public.clinic_invite_lookup_hits
  where created_at < now() - interval '1 day';

  select count(*) into n
  from public.clinic_invite_lookup_hits
  where ip_hash = h
    and created_at > now() - interval '10 minutes';
  if n > 20 then
    raise exception 'Demasiados intentos. Espera unos minutos.';
  end if;

  return query
  select
    c.name,
    i.email,
    i.display_name,
    i.expires_at,
    i.invite_code
  from public.clinic_invites i
  join public.clinics c on c.id = i.clinic_id
  where i.expires_at > now()
    and (
      (i.email is not null and i.accepted_at is null)
      or i.email is null
    )
    and (
      i.token = trim(both from coalesce(p_token, ''))
      or upper(i.invite_code) = key
    )
    and (i.email is null or i.accepted_at is null)
  limit 1;
end;
$$;

revoke all on function public.clinic_lookup_invite(text) from public;
grant execute on function public.clinic_lookup_invite(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5) Open (no-email) codes stay reusable until expiry; email-bound stay one-shot
-- ---------------------------------------------------------------------------
alter table public.clinic_invites
  add column if not exists use_count integer not null default 0;

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
  key text := upper(trim(both from coalesce(p_token, '')));
begin
  -- Service-role only. If grants ever leak, a user JWT cannot pick p_user_id.
  if auth.uid() is not null then
    raise exception 'not authorized';
  end if;
  if p_user_id is null then
    raise exception 'user required';
  end if;

  select * into inv
  from public.clinic_invites
  where expires_at > now()
    and (
      token = trim(both from coalesce(p_token, ''))
      or upper(invite_code) = key
    )
    and (
      (email is not null and accepted_at is null)
      or email is null
    )
  limit 1;
  if not found then
    raise exception 'invite not found or expired';
  end if;

  if inv.email is not null
     and exists (
       select 1 from auth.users u
       where u.id = p_user_id
         and lower(u.email) is distinct from lower(inv.email)
     ) then
    raise exception 'invite email mismatch';
  end if;

  select name into cname from public.clinics where id = inv.clinic_id;

  insert into public.clinic_members (clinic_id, user_id, role)
  values (inv.clinic_id, p_user_id, 'physio')
  on conflict (clinic_id, user_id) do update set role = excluded.role;

  perform set_config('app.linking_clinic', '1', true);
  update public.profiles
  set clinic_id = inv.clinic_id,
      clinic_name = cname,
      display_name = coalesce(nullif(display_name, ''), inv.display_name),
      account_type = 'physio',
      updated_at = now()
  where id = p_user_id;

  if inv.email is not null then
    update public.clinic_invites
    set accepted_at = now(), use_count = use_count + 1
    where id = inv.id;
  else
    update public.clinic_invites
    set use_count = use_count + 1
    where id = inv.id;
  end if;

  return inv.clinic_id;
end;
$$;

revoke all on function public.clinic_accept_invite(text, uuid) from public;
revoke all on function public.clinic_accept_invite(text, uuid) from anon;
revoke all on function public.clinic_accept_invite(text, uuid) from authenticated;

create or replace function public.clinic_claim_invite(p_token text)
returns public.clinics
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  inv public.clinic_invites;
  row public.clinics;
  key text := upper(trim(both from coalesce(p_token, '')));
  cur_type text;
  existing_cid uuid;
  user_email text;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  select p.account_type, p.clinic_id
    into cur_type, existing_cid
  from public.profiles p
  where p.id = uid;

  if cur_type is distinct from 'physio' then
    raise exception 'Solo las cuentas de fisioterapeuta pueden usar este código.';
  end if;

  if existing_cid is not null
     or exists (select 1 from public.clinic_members m where m.user_id = uid) then
    select c.* into row
    from public.clinics c
    join public.clinic_members m on m.clinic_id = c.id
    where m.user_id = uid
    order by case when m.role = 'owner' then 0 else 1 end
    limit 1;
    if found then
      return public._clinic_without_billing(row);
    end if;
  end if;

  if key = '' then
    raise exception 'Introduce el código de alta de la clínica.';
  end if;

  select * into inv
  from public.clinic_invites
  where expires_at > now()
    and (
      token = trim(both from coalesce(p_token, ''))
      or upper(invite_code) = key
    )
    and (
      (email is not null and accepted_at is null)
      or email is null
    )
  limit 1;
  if not found then
    raise exception 'Código no válido o caducado.';
  end if;

  select lower(u.email) into user_email from auth.users u where u.id = uid;
  if inv.email is not null and lower(inv.email) is distinct from user_email then
    raise exception 'Este código está reservado para %', inv.email;
  end if;

  insert into public.clinic_members (clinic_id, user_id, role)
  values (inv.clinic_id, uid, 'physio')
  on conflict (clinic_id, user_id) do update set role = excluded.role;

  perform set_config('app.linking_clinic', '1', true);
  update public.profiles
  set clinic_id = inv.clinic_id,
      clinic_name = (select name from public.clinics where id = inv.clinic_id),
      account_type = 'physio',
      updated_at = now()
  where id = uid;

  if inv.email is not null then
    update public.clinic_invites
    set accepted_at = now(), use_count = use_count + 1
    where id = inv.id;
  else
    update public.clinic_invites
    set use_count = use_count + 1
    where id = inv.id;
  end if;

  select c.* into row from public.clinics c where c.id = inv.clinic_id;
  return public._clinic_without_billing(row);
end;
$$;

revoke all on function public.clinic_claim_invite(text) from public;
revoke all on function public.clinic_claim_invite(text) from anon;
grant execute on function public.clinic_claim_invite(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 6) Public social fields + team ids
-- ---------------------------------------------------------------------------
alter table public.clinics
  add column if not exists whatsapp text,
  add column if not exists instagram text,
  add column if not exists tiktok text,
  add column if not exists booking_url text;

drop function if exists public.clinic_update_own(
  text, text, text, text, text, text, text, text, text, double precision, double precision,
  text, text, text, boolean, text, text, text, text[], text, text[]
);

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
  p_google_maps_url text default null,
  p_contact_email text default null,
  p_is_listed boolean default null,
  p_cover_url text default null,
  p_tagline text default null,
  p_accent_color text default null,
  p_specialties text[] default null,
  p_hours text default null,
  p_equipment text[] default null,
  p_whatsapp text default null,
  p_instagram text default null,
  p_tiktok text default null,
  p_booking_url text default null
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
  accent text;
  raw_accent text;
begin
  if not public.is_clinic_owner() then
    raise exception 'not authorized';
  end if;
  select c.id into cid from public.clinics c where c.owner_id = auth.uid();
  if cid is null then
    raise exception 'clinic not found';
  end if;

  nm := nullif(trim(both from coalesce(p_name, '')), '');

  raw_accent := nullif(btrim(coalesce(p_accent_color, '')), '');
  if raw_accent is not null then
    if left(raw_accent, 1) <> '#' then
      raw_accent := '#' || raw_accent;
    end if;
    raw_accent := upper(raw_accent);
    if raw_accent ~ '^#[0-9A-F]{6}$' then
      accent := raw_accent;
    elsif raw_accent ~ '^#[0-9A-F]{3}$' then
      accent := '#' ||
        substr(raw_accent, 2, 1) || substr(raw_accent, 2, 1) ||
        substr(raw_accent, 3, 1) || substr(raw_accent, 3, 1) ||
        substr(raw_accent, 4, 1) || substr(raw_accent, 4, 1);
    else
      accent := null;
    end if;
  else
    accent := null;
  end if;

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
    contact_email = coalesce(p_contact_email, contact_email),
    is_listed = coalesce(p_is_listed, is_listed),
    cover_url = coalesce(p_cover_url, cover_url),
    tagline = coalesce(p_tagline, tagline),
    accent_color = coalesce(accent, accent_color),
    specialties = coalesce(p_specialties, specialties),
    hours = coalesce(p_hours, hours),
    equipment = coalesce(p_equipment, equipment),
    whatsapp = coalesce(p_whatsapp, whatsapp),
    instagram = coalesce(p_instagram, instagram),
    tiktok = coalesce(p_tiktok, tiktok),
    booking_url = coalesce(p_booking_url, booking_url),
    updated_at = now()
  where id = cid
  returning * into row;

  if nm is not null then
    update public.profiles
    set clinic_name = nm, updated_at = now()
    where clinic_id = cid;
  end if;

  return public._clinic_without_billing(row);
end;
$$;

revoke all on function public.clinic_update_own(
  text, text, text, text, text, text, text, text, text, double precision, double precision,
  text, text, text, boolean, text, text, text, text[], text, text[], text, text, text, text
) from public;
grant execute on function public.clinic_update_own(
  text, text, text, text, text, text, text, text, text, double precision, double precision,
  text, text, text, boolean, text, text, text, text[], text, text[], text, text, text, text
) to authenticated;

drop function if exists public.clinic_get_public(text);

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
  google_maps_url text,
  contact_email text,
  is_listed boolean,
  cover_url text,
  tagline text,
  accent_color text,
  specialties text[],
  hours text,
  whatsapp text,
  instagram text,
  tiktok text,
  booking_url text
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
    c.address, c.city, c.postal_code, c.country, c.lat, c.lng, c.google_maps_url,
    c.contact_email, c.is_listed, c.cover_url, c.tagline, c.accent_color,
    c.specialties, c.hours, c.whatsapp, c.instagram, c.tiktok, c.booking_url
  from public.clinics c
  where c.slug = p_slug
    and (
      public.clinic_is_directory_visible(c)
      or public.clinic_is_staff(c.id)
    )
  limit 1;
end;
$$;

revoke all on function public.clinic_get_public(text) from public;
grant execute on function public.clinic_get_public(text) to anon, authenticated;

drop function if exists public.clinic_list_physios_public(text);

create or replace function public.clinic_list_physios_public(p_slug text)
returns table (user_id uuid, display_name text)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
  select p.id, p.display_name
  from public.clinics c
  join public.clinic_members m on m.clinic_id = c.id and m.role in ('physio', 'owner')
  join public.profiles p on p.id = m.user_id
  where c.slug = p_slug
    and p.display_name is not null
  order by case when m.role = 'owner' then 0 else 1 end, p.display_name;
end;
$$;

revoke all on function public.clinic_list_physios_public(text) from public;
grant execute on function public.clinic_list_physios_public(text) to anon, authenticated;

update storage.buckets
set file_size_limit = 1572864
where id = 'clinic-logos';
