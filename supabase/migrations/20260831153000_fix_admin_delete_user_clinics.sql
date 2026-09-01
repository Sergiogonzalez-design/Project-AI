-- Self-serve and admin account deletion must remove owned clinics first.
-- clinics.owner_id references profiles(id) ON DELETE RESTRICT, which blocked
-- profile / auth.users deletes and left accounts appearing to "survive" delete.

create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  clinic_ids uuid[];
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

  select coalesce(array_agg(c.id), '{}'::uuid[])
    into clinic_ids
  from public.clinics c
  where c.owner_id = target_user_id;

  if array_length(clinic_ids, 1) is not null then
    update public.profiles
      set clinic_id = null
      where clinic_id = any (clinic_ids);

    delete from public.clinics
      where id = any (clinic_ids);
  end if;

  update public.profiles
    set physio_id = null
    where physio_id = target_user_id;

  delete from public.profiles where id = target_user_id;

  delete from auth.users where id = target_user_id;
end;
$$;
