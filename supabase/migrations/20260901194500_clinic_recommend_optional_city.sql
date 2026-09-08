-- Empty patient city: still recommend listed clinics ranked by injury fit.

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
        city_q = ''
        or lower(btrim(c.city)) = city_q
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
