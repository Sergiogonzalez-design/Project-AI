-- Allow clinic self-serve signup again: incomplete onboarding patients may create
-- their clinic (Expo / TestFlight / live). JWT app_metadata=clinic also allowed.
-- Physio accounts remain invite-only (not via this function).

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
  done_onboarding boolean;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select p.account_type, coalesce(p.onboarding_completed, false)
    into cur_type, done_onboarding
  from public.profiles p
  where p.id = auth.uid();

  if cur_type is null then
    raise exception 'not authorized';
  end if;

  -- Promote to clinic when:
  -- 1) JWT already says clinic (proper signup), or
  -- 2) profile is still patient with incomplete onboarding (mobile clinic flow
  --    before signup API set metadata correctly).
  if cur_type <> 'clinic' then
    if meta_type = 'clinic'
       or (cur_type = 'patient' and done_onboarding = false) then
      perform set_config('app.linking_clinic', '1', true);
      update public.profiles
      set account_type = 'clinic', updated_at = now()
      where id = auth.uid();
      cur_type := 'clinic';
    else
      raise exception 'not authorized';
    end if;
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

revoke all on function public.clinic_create_own(text, text) from public;
grant execute on function public.clinic_create_own(text, text) to authenticated;
