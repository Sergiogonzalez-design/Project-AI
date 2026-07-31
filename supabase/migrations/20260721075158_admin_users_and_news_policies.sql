-- Admin flag on profiles + helpers for user/news management

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- Mark the configured owner account as admin (and skip onboarding gate)
update public.profiles p
set
  is_admin = true,
  onboarding_completed = true
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('sergiogonzalez.usa@icloud.com');

-- In case profile row is missing, create it
insert into public.profiles (id, is_admin, onboarding_completed)
select u.id, true, true
from auth.users u
where lower(u.email) = lower('sergiogonzalez.usa@icloud.com')
  and not exists (select 1 from public.profiles p where p.id = u.id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  display_name text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  onboarding_completed boolean,
  primary_sport text,
  is_admin boolean,
  is_premium boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  return query
  select
    u.id,
    u.email::text,
    p.display_name,
    u.created_at,
    u.last_sign_in_at,
    coalesce(p.onboarding_completed, false),
    p.primary_sport,
    coalesce(p.is_admin, false),
    coalesce(p.is_premium, false)
  from auth.users u
  left join public.profiles p on p.id = u.id
  order by u.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;

create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'cannot delete your own admin account';
  end if;

  if exists (
    select 1 from public.profiles p
    where p.id = target_user_id and p.is_admin = true
  ) then
    raise exception 'cannot delete another admin account';
  end if;

  delete from auth.users where id = target_user_id;
end;
$$;

revoke all on function public.admin_delete_user(uuid) from public;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- News: admins can create / update / delete
drop policy if exists "news_admin_insert" on public.news;
create policy "news_admin_insert"
  on public.news for insert to authenticated
  with check (public.is_admin());

drop policy if exists "news_admin_update" on public.news;
create policy "news_admin_update"
  on public.news for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "news_admin_delete" on public.news;
create policy "news_admin_delete"
  on public.news for delete to authenticated
  using (public.is_admin());
