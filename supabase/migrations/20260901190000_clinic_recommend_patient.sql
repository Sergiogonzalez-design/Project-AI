-- Patient city + clinic equipment, and same-city clinic recommendations for Consulta.

alter table public.profiles
  add column if not exists city text;

alter table public.clinics
  add column if not exists equipment text[] not null default '{}';

comment on column public.profiles.city is
  'Patient city for matching registered clinics in Consulta (not used for clinicians).';

comment on column public.clinics.equipment is
  'Org-level equipment IDs (same catalog as profiles.clinic_equipment), e.g. diagnostic_ultrasound.';

drop function if exists public.clinic_update_own(
  text, text, text, text, text, text, text, text, text, double precision, double precision,
  text, text, text, boolean, text, text, text, text[], text
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
  p_equipment text[] default null
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
    equipment = coalesce(p_equipment, equipment),
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

create or replace function public.clinic_recommend_for_patient(
  p_city text,
  p_need_tags text[] default '{}',
  p_specialty_tags text[] default '{}',
  p_limit int default 5
)
returns table (
  id uuid,
  name text,
  slug text,
  city text,
  address text,
  phone text,
  specialties text[],
  equipment text[],
  match_score int
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  city_q text := lower(btrim(coalesce(p_city, '')));
  lim int := least(greatest(coalesce(p_limit, 5), 1), 8);
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if city_q = '' then
    return;
  end if;

  return query
  with ranked as (
    select
      c.id as clinic_id,
      c.name as clinic_name,
      c.slug as clinic_slug,
      c.city as clinic_city,
      c.address as clinic_address,
      c.phone as clinic_phone,
      c.specialties as clinic_specialties,
      coalesce((
        select array_agg(distinct e order by e)
        from (
          select unnest(coalesce(c.equipment, '{}'::text[])) as e
          union
          select unnest(coalesce(p.clinic_equipment, '{}'::text[]))
          from public.clinic_members m
          join public.profiles p on p.id = m.user_id
          where m.clinic_id = c.id
        ) eq
        where nullif(btrim(e), '') is not null
      ), '{}'::text[]) as equipment,
      (
        coalesce((
          select count(*)::int
          from unnest(coalesce(c.equipment, '{}')) e
          where e = any(coalesce(p_need_tags, '{}'))
        ), 0)
        + coalesce((
          select count(*)::int
          from public.clinic_members m
          join public.profiles p on p.id = m.user_id
          cross join unnest(coalesce(p.clinic_equipment, '{}')) e
          where m.clinic_id = c.id
            and e = any(coalesce(p_need_tags, '{}'))
        ), 0)
      ) * 4
      + coalesce((
          select count(*)::int
          from unnest(coalesce(c.specialties, '{}')) s
          where exists (
            select 1
            from unnest(coalesce(p_specialty_tags, '{}')) t
            where t <> '' and lower(s) like '%' || lower(t) || '%'
          )
        ), 0) * 3
      as score
    from public.clinics c
    where public.clinic_is_directory_visible(c)
      and (
        lower(btrim(c.city)) = city_q
        or (
          char_length(city_q) >= 4
          and (
            lower(btrim(c.city)) like '%' || city_q || '%'
            or city_q like '%' || lower(btrim(c.city)) || '%'
          )
        )
      )
  )
  select
    r.clinic_id,
    r.clinic_name,
    r.clinic_slug,
    r.clinic_city,
    r.clinic_address,
    r.clinic_phone,
    r.clinic_specialties,
    r.equipment,
    r.score
  from ranked r
  order by r.score desc, r.clinic_name
  limit lim;
end;
$$;

revoke all on function public.clinic_update_own(
  text, text, text, text, text, text, text, text, text, double precision, double precision,
  text, text, text, boolean, text, text, text, text[], text, text[]
) from public;

revoke all on function public.clinic_recommend_for_patient(text, text[], text[], int) from public;

grant execute on function public.clinic_update_own(
  text, text, text, text, text, text, text, text, text, double precision, double precision,
  text, text, text, boolean, text, text, text, text[], text, text[]
) to authenticated;

grant execute on function public.clinic_recommend_for_patient(text, text[], text[], int) to authenticated;
