-- Clinic branding: allow any valid accent hex; harden logo/cover storage for owners.

-- 1) Accept any #RRGGBB / #RGB accent (not only the 8 swatches)
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
      accent := null; -- ignore invalid; keep previous
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

revoke all on function public.clinic_update_own(
  text, text, text, text, text, text, text, text, text, double precision, double precision,
  text, text, text, boolean, text, text, text, text[], text, text[]
) from public;
grant execute on function public.clinic_update_own(
  text, text, text, text, text, text, text, text, text, double precision, double precision,
  text, text, text, boolean, text, text, text, text[], text, text[]
) to authenticated;

-- 2) Owner can manage their clinic folder even if membership row is missing
create or replace function public.clinic_can_manage_storage(p_clinic uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    p_clinic is not null
    and auth.uid() is not null
    and (
      public.clinic_is_manager(p_clinic)
      or exists (
        select 1 from public.clinics c
        where c.id = p_clinic and c.owner_id = auth.uid()
      )
    );
$$;

revoke all on function public.clinic_can_manage_storage(uuid) from public;
grant execute on function public.clinic_can_manage_storage(uuid) to authenticated;

-- 3) Storage bucket: keep public read; allow common image MIME types
update storage.buckets
set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]
where id = 'clinic-logos';

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
    and public.clinic_can_manage_storage(
      nullif((storage.foldername(name))[1], '')::uuid
    )
  );

drop policy if exists clinic_logos_update on storage.objects;
create policy clinic_logos_update
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'clinic-logos'
    and public.clinic_can_manage_storage(
      nullif((storage.foldername(name))[1], '')::uuid
    )
  )
  with check (
    bucket_id = 'clinic-logos'
    and public.clinic_can_manage_storage(
      nullif((storage.foldername(name))[1], '')::uuid
    )
  );

drop policy if exists clinic_logos_delete on storage.objects;
create policy clinic_logos_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'clinic-logos'
    and public.clinic_can_manage_storage(
      nullif((storage.foldername(name))[1], '')::uuid
    )
  );
