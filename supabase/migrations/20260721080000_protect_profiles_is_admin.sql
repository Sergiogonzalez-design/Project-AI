-- Prevent clients from self-granting admin via profiles RLS update
create or replace function public.profiles_protect_is_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then
      new.is_admin := false;
    end if;
  elsif tg_op = 'UPDATE' then
    if auth.uid() is not null then
      new.is_admin := old.is_admin;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_is_admin on public.profiles;
create trigger profiles_protect_is_admin
  before insert or update on public.profiles
  for each row
  execute function public.profiles_protect_is_admin();
