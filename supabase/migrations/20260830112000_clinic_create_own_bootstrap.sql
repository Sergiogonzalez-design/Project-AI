-- Allow clinic bootstrap to promote patient → clinic while linking_clinic is set.
create or replace function public.profiles_protect_is_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_type text;
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then
      new.is_admin := false;
      meta_type := coalesce(auth.jwt()->'app_metadata'->>'account_type', 'patient');
      if meta_type in ('physio', 'clinic') then
        new.account_type := meta_type;
      else
        new.account_type := 'patient';
      end if;
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
      meta_type := coalesce(auth.jwt()->'app_metadata'->>'account_type', '');

      if coalesce(current_setting('app.linking_clinic', true), '') = '1'
         and new.account_type = 'clinic'
         and old.account_type in ('patient', 'clinic') then
        null;
      elsif old.account_type = 'patient'
         and meta_type in ('physio', 'clinic')
         and new.account_type = meta_type then
        null;
      else
        new.account_type := old.account_type;
      end if;

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

-- Create clinic even when signup left the profile as patient (incomplete onboarding).
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
