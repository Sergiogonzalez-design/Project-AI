-- Separate name / specialty / city filters for Explorar directory search.

drop function if exists public.clinic_search(text, text);

create or replace function public.clinic_search(
  p_name text default '',
  p_specialty text default '',
  p_city text default ''
)
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
  name_q text := lower(btrim(coalesce(p_name, '')));
  spec_q text := lower(btrim(coalesce(p_specialty, '')));
  city_q text := lower(btrim(coalesce(p_city, '')));
begin
  return query
  select
    c.id, c.name, c.slug, c.description, c.logo_url, c.city, c.phone, c.contact_email,
    c.cover_url, c.tagline, c.accent_color, c.specialties
  from public.clinics c
  where public.clinic_is_directory_visible(c)
    and (city_q = '' or lower(coalesce(c.city, '')) like '%' || city_q || '%')
    and (
      name_q = ''
      or lower(c.name) like '%' || name_q || '%'
      or lower(coalesce(c.tagline, '')) like '%' || name_q || '%'
    )
    and (
      spec_q = ''
      or exists (
        select 1 from unnest(c.specialties) s
        where lower(s) like '%' || spec_q || '%'
      )
      or lower(coalesce(c.description, '')) like '%' || spec_q || '%'
      or lower(coalesce(c.tagline, '')) like '%' || spec_q || '%'
    )
  order by c.name
  limit 80;
end;
$$;

revoke all on function public.clinic_search(text, text, text) from public;
grant execute on function public.clinic_search(text, text, text) to anon, authenticated;
