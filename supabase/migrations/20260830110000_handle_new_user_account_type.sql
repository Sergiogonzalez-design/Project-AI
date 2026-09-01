-- New auth users inherit account_type from app_metadata (patient|physio|clinic).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_type text := coalesce(new.raw_app_meta_data->>'account_type', 'patient');
begin
  if meta_type not in ('patient', 'physio', 'clinic') then
    meta_type := 'patient';
  end if;

  insert into public.profiles (id, display_name, account_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    meta_type
  )
  on conflict (id) do update
    set account_type = excluded.account_type
    where public.profiles.account_type = 'patient'
      and excluded.account_type in ('physio', 'clinic');

  return new;
end;
$$;
