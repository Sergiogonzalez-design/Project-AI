-- Patient clinic directory: listing, contact email, favorites, novedades.

alter table public.clinics
  add column if not exists contact_email text,
  add column if not exists is_listed boolean not null default true;

create or replace function public.clinic_is_directory_visible(c public.clinics)
returns boolean
language sql
immutable
as $$
  select
    c.is_listed
    and nullif(btrim(coalesce(c.city, '')), '') is not null
    and (
      nullif(btrim(coalesce(c.phone, '')), '') is not null
      or nullif(btrim(coalesce(c.contact_email, '')), '') is not null
    );
$$;

create table if not exists public.clinic_favorites (
  patient_id uuid not null references public.profiles(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (patient_id, clinic_id)
);

create index if not exists clinic_favorites_clinic_idx
  on public.clinic_favorites (clinic_id);

create table if not exists public.clinic_posts (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  body text not null,
  image_url text,
  created_at timestamptz not null default now(),
  constraint clinic_posts_body_len check (char_length(body) between 1 and 500)
);

create index if not exists clinic_posts_clinic_created_idx
  on public.clinic_posts (clinic_id, created_at desc);

alter table public.clinic_favorites enable row level security;
alter table public.clinic_posts enable row level security;

drop policy if exists clinic_favorites_own on public.clinic_favorites;
create policy clinic_favorites_own
  on public.clinic_favorites for all
  to authenticated
  using (patient_id = auth.uid())
  with check (patient_id = auth.uid());

drop policy if exists clinic_posts_public_select on public.clinic_posts;
create policy clinic_posts_public_select
  on public.clinic_posts for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.clinics c
      where c.id = clinic_id
        and public.clinic_is_directory_visible(c)
    )
    or public.clinic_is_staff(clinic_id)
  );

drop policy if exists clinic_posts_owner_write on public.clinic_posts;
create policy clinic_posts_owner_write
  on public.clinic_posts for insert
  to authenticated
  with check (public.clinic_is_manager(clinic_id));

drop policy if exists clinic_posts_owner_update on public.clinic_posts;
create policy clinic_posts_owner_update
  on public.clinic_posts for update
  to authenticated
  using (public.clinic_is_manager(clinic_id))
  with check (public.clinic_is_manager(clinic_id));

drop policy if exists clinic_posts_owner_delete on public.clinic_posts;
create policy clinic_posts_owner_delete
  on public.clinic_posts for delete
  to authenticated
  using (public.clinic_is_manager(clinic_id));

-- clinic_update_own: add contact_email + is_listed
drop function if exists public.clinic_update_own(
  text, text, text, text, text, text, text, text, text, double precision, double precision, text, text
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
  p_is_listed boolean default null
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
    contact_email = coalesce(p_contact_email, contact_email),
    is_listed = coalesce(p_is_listed, is_listed),
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
  is_listed boolean
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
    c.contact_email, c.is_listed
  from public.clinics c
  where c.slug = p_slug
    and (
      public.clinic_is_directory_visible(c)
      or public.clinic_is_staff(c.id)
    )
  limit 1;
end;
$$;

create or replace function public.clinic_search(p_query text default '', p_city text default '')
returns table (
  id uuid,
  name text,
  slug text,
  description text,
  logo_url text,
  city text,
  phone text,
  contact_email text
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
    c.id, c.name, c.slug, c.description, c.logo_url, c.city, c.phone, c.contact_email
  from public.clinics c
  where public.clinic_is_directory_visible(c)
    and (city_q = '' or lower(c.city) like '%' || city_q || '%')
    and (
      q = ''
      or lower(c.name) like '%' || q || '%'
      or lower(coalesce(c.description, '')) like '%' || q || '%'
      or lower(coalesce(c.city, '')) like '%' || q || '%'
    )
  order by c.name
  limit 80;
end;
$$;

create or replace function public.clinic_favorite_toggle(p_clinic_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  now_saved boolean;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if exists (
    select 1 from public.clinic_favorites f
    where f.patient_id = auth.uid() and f.clinic_id = p_clinic_id
  ) then
    delete from public.clinic_favorites
    where patient_id = auth.uid() and clinic_id = p_clinic_id;
    now_saved := false;
  else
    insert into public.clinic_favorites (patient_id, clinic_id)
    values (auth.uid(), p_clinic_id);
    now_saved := true;
  end if;
  return now_saved;
end;
$$;

create or replace function public.clinic_is_favorited(p_clinic_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.clinic_favorites f
    where f.patient_id = auth.uid()
      and f.clinic_id = p_clinic_id
  );
$$;

create or replace function public.clinic_list_favorites()
returns table (
  id uuid,
  name text,
  slug text,
  description text,
  logo_url text,
  city text,
  phone text,
  contact_email text
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
    c.id, c.name, c.slug, c.description, c.logo_url, c.city, c.phone, c.contact_email
  from public.clinic_favorites f
  join public.clinics c on c.id = f.clinic_id
  where f.patient_id = auth.uid()
    and public.clinic_is_directory_visible(c)
  order by f.created_at desc;
end;
$$;

create or replace function public.clinic_list_posts(p_slug text)
returns table (
  id uuid,
  body text,
  image_url text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
  select p.id, p.body, p.image_url, p.created_at
  from public.clinic_posts p
  join public.clinics c on c.id = p.clinic_id
  where c.slug = p_slug
    and (
      public.clinic_is_directory_visible(c)
      or public.clinic_is_staff(c.id)
    )
  order by p.created_at desc
  limit 40;
end;
$$;

create or replace function public.clinic_list_own_posts()
returns table (
  id uuid,
  body text,
  image_url text,
  created_at timestamptz
)
language plpgsql
stable
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
  select p.id, p.body, p.image_url, p.created_at
  from public.clinic_posts p
  where p.clinic_id = cid
  order by p.created_at desc
  limit 40;
end;
$$;

create or replace function public.clinic_create_post(p_body text, p_image_url text default null)
returns public.clinic_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  row public.clinic_posts;
  txt text := btrim(coalesce(p_body, ''));
begin
  if not public.is_clinic_owner() then
    raise exception 'not authorized';
  end if;
  select c.id into cid from public.clinics c where c.owner_id = auth.uid();
  if cid is null then
    raise exception 'clinic not found';
  end if;
  if char_length(txt) < 1 or char_length(txt) > 500 then
    raise exception 'post body must be 1–500 characters';
  end if;
  insert into public.clinic_posts (clinic_id, body, image_url)
  values (cid, txt, nullif(btrim(coalesce(p_image_url, '')), ''))
  returning * into row;
  return row;
end;
$$;

create or replace function public.clinic_delete_post(p_id uuid)
returns void
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
  delete from public.clinic_posts
  where id = p_id and clinic_id = cid;
end;
$$;

create or replace function public.clinic_feed_posts()
returns table (
  post_id uuid,
  clinic_id uuid,
  clinic_name text,
  clinic_slug text,
  clinic_logo_url text,
  clinic_city text,
  body text,
  image_url text,
  created_at timestamptz,
  from_saved boolean
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
  select
    p.id,
    c.id,
    c.name,
    c.slug,
    c.logo_url,
    c.city,
    p.body,
    p.image_url,
    p.created_at,
    exists (
      select 1 from public.clinic_favorites f
      where f.clinic_id = c.id
        and f.patient_id = auth.uid()
    ) as from_saved
  from public.clinic_posts p
  join public.clinics c on c.id = p.clinic_id
  where public.clinic_is_directory_visible(c)
  order by
    exists (
      select 1 from public.clinic_favorites f
      where f.clinic_id = c.id
        and f.patient_id = auth.uid()
    ) desc,
    p.created_at desc
  limit 50;
end;
$$;

revoke all on function public.clinic_is_directory_visible(public.clinics) from public;
revoke all on function public.clinic_update_own(text, text, text, text, text, text, text, text, text, double precision, double precision, text, text, text, boolean) from public;
revoke all on function public.clinic_get_public(text) from public;
revoke all on function public.clinic_search(text, text) from public;
revoke all on function public.clinic_favorite_toggle(uuid) from public;
revoke all on function public.clinic_is_favorited(uuid) from public;
revoke all on function public.clinic_list_favorites() from public;
revoke all on function public.clinic_list_posts(text) from public;
revoke all on function public.clinic_list_own_posts() from public;
revoke all on function public.clinic_create_post(text, text) from public;
revoke all on function public.clinic_delete_post(uuid) from public;
revoke all on function public.clinic_feed_posts() from public;

grant execute on function public.clinic_is_directory_visible(public.clinics) to anon, authenticated;
grant execute on function public.clinic_update_own(text, text, text, text, text, text, text, text, text, double precision, double precision, text, text, text, boolean) to authenticated;
grant execute on function public.clinic_get_public(text) to anon, authenticated;
grant execute on function public.clinic_search(text, text) to anon, authenticated;
grant execute on function public.clinic_favorite_toggle(uuid) to authenticated;
grant execute on function public.clinic_is_favorited(uuid) to authenticated;
grant execute on function public.clinic_list_favorites() to authenticated;
grant execute on function public.clinic_list_posts(text) to anon, authenticated;
grant execute on function public.clinic_list_own_posts() to authenticated;
grant execute on function public.clinic_create_post(text, text) to authenticated;
grant execute on function public.clinic_delete_post(uuid) to authenticated;
grant execute on function public.clinic_feed_posts() to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'clinic-posts',
  'clinic-posts',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists clinic_posts_storage_read on storage.objects;
create policy clinic_posts_storage_read
  on storage.objects for select
  to authenticated, anon
  using (bucket_id = 'clinic-posts');

drop policy if exists clinic_posts_storage_insert on storage.objects;
create policy clinic_posts_storage_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'clinic-posts'
    and public.clinic_is_manager(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists clinic_posts_storage_update on storage.objects;
create policy clinic_posts_storage_update
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'clinic-posts'
    and public.clinic_is_manager(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'clinic-posts'
    and public.clinic_is_manager(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists clinic_posts_storage_delete on storage.objects;
create policy clinic_posts_storage_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'clinic-posts'
    and public.clinic_is_manager(((storage.foldername(name))[1])::uuid)
  );
