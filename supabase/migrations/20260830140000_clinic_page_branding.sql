-- Clinic public-page branding: cover, tagline, accent, specialties, hours.

alter table public.clinics
  add column if not exists cover_url text,
  add column if not exists tagline text,
  add column if not exists accent_color text not null default '#2563EB',
  add column if not exists specialties text[] not null default '{}',
  add column if not exists hours text;

drop function if exists public.clinic_update_own(
  text, text, text, text, text, text, text, text, text, double precision, double precision, text, text, text, boolean
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
  p_hours text default null
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
begin
  if not public.is_clinic_owner() then
    raise exception 'not authorized';
  end if;
  select c.id into cid from public.clinics c where c.owner_id = auth.uid();
  if cid is null then
    raise exception 'clinic not found';
  end if;

  nm := nullif(trim(both from coalesce(p_name, '')), '');
  accent := upper(nullif(btrim(coalesce(p_accent_color, '')), ''));
  if accent is not null and accent not in (
    '#2563EB', '#0284C7', '#0D9488', '#059669', '#7C3AED', '#E11D48', '#D97706', '#0F172A'
  ) then
    accent := '#2563EB';
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
  hours text
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
    c.specialties, c.hours
  from public.clinics c
  where c.slug = p_slug
    and (
      public.clinic_is_directory_visible(c)
      or public.clinic_is_staff(c.id)
    )
  limit 1;
end;
$$;

drop function if exists public.clinic_search(text, text);

create or replace function public.clinic_search(p_query text default '', p_city text default '')
returns table (
  id uuid,
  name text,
  slug text,
  description text,
  logo_url text,
  city text,
  phone text,
  contact_email text,
  cover_url text,
  tagline text,
  accent_color text,
  specialties text[]
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  q text := lower(btrim(coalesce(p_query, '')));
  city_q text := lower(btrim(coalesce(p_city, '')));
begin
  return query
  select
    c.id, c.name, c.slug, c.description, c.logo_url, c.city, c.phone, c.contact_email,
    c.cover_url, c.tagline, c.accent_color, c.specialties
  from public.clinics c
  where public.clinic_is_directory_visible(c)
    and (city_q = '' or lower(c.city) like '%' || city_q || '%')
    and (
      q = ''
      or lower(c.name) like '%' || q || '%'
      or lower(coalesce(c.description, '')) like '%' || q || '%'
      or lower(coalesce(c.city, '')) like '%' || q || '%'
      or lower(coalesce(c.tagline, '')) like '%' || q || '%'
      or exists (
        select 1 from unnest(c.specialties) s
        where lower(s) like '%' || q || '%'
      )
    )
  order by c.name
  limit 80;
end;
$$;

drop function if exists public.clinic_list_favorites();

create or replace function public.clinic_list_favorites()
returns table (
  id uuid,
  name text,
  slug text,
  description text,
  logo_url text,
  city text,
  phone text,
  contact_email text,
  cover_url text,
  tagline text,
  accent_color text,
  specialties text[]
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  return query
  select
    c.id, c.name, c.slug, c.description, c.logo_url, c.city, c.phone, c.contact_email,
    c.cover_url, c.tagline, c.accent_color, c.specialties
  from public.clinic_favorites f
  join public.clinics c on c.id = f.clinic_id
  where f.patient_id = auth.uid()
    and public.clinic_is_directory_visible(c)
  order by f.created_at desc;
end;
$$;

revoke all on function public.clinic_update_own(text, text, text, text, text, text, text, text, text, double precision, double precision, text, text, text, boolean, text, text, text, text[], text) from public;
revoke all on function public.clinic_get_public(text) from public;
revoke all on function public.clinic_search(text, text) from public;
revoke all on function public.clinic_list_favorites() from public;

grant execute on function public.clinic_update_own(text, text, text, text, text, text, text, text, text, double precision, double precision, text, text, text, boolean, text, text, text, text[], text) to authenticated;
grant execute on function public.clinic_get_public(text) to anon, authenticated;
grant execute on function public.clinic_search(text, text) to anon, authenticated;
grant execute on function public.clinic_list_favorites() to authenticated;
