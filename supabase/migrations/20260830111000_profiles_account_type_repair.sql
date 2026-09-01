-- Allow JWT app_metadata to set/repair account_type (patient → physio|clinic).
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
      if old.account_type = 'patient'
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
