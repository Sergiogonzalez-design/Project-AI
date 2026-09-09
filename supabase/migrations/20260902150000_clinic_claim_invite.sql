-- Fix physio↔clinic linking: allow claim by code, harden accept_invite.

-- Service-role accept: do not block when auth.uid() is unexpectedly set
-- (PostgREST/service key edge cases). Function is already revoked from
-- authenticated/anon.
create or replace function public.clinic_accept_invite(
  p_token text,
  p_user_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.clinic_invites;
  cname text;
  key text := upper(trim(both from coalesce(p_token, '')));
begin
  if p_user_id is null then
    raise exception 'user required';
  end if;

  select * into inv
  from public.clinic_invites
  where accepted_at is null
    and expires_at > now()
    and (
      token = trim(both from coalesce(p_token, ''))
      or upper(invite_code) = key
    )
  limit 1;
  if not found then
    raise exception 'invite not found or expired';
  end if;

  if inv.email is not null
     and exists (
       select 1 from auth.users u
       where u.id = p_user_id
         and lower(u.email) is distinct from lower(inv.email)
     ) then
    raise exception 'invite email mismatch';
  end if;

  select name into cname from public.clinics where id = inv.clinic_id;

  insert into public.clinic_members (clinic_id, user_id, role)
  values (inv.clinic_id, p_user_id, 'physio')
  on conflict (clinic_id, user_id) do update set role = excluded.role;

  perform set_config('app.linking_clinic', '1', true);
  update public.profiles
  set clinic_id = inv.clinic_id,
      clinic_name = cname,
      display_name = coalesce(nullif(display_name, ''), inv.display_name),
      account_type = 'physio',
      updated_at = now()
  where id = p_user_id;

  update public.clinic_invites
  set accepted_at = now()
  where id = inv.id;

  return inv.clinic_id;
end;
$$;

revoke all on function public.clinic_accept_invite(text, uuid) from public;
revoke all on function public.clinic_accept_invite(text, uuid) from anon;
revoke all on function public.clinic_accept_invite(text, uuid) from authenticated;

-- Logged-in physio claims an invite code (for Expo Go / already-created accounts).
create or replace function public.clinic_claim_invite(p_token text)
returns public.clinics
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  inv public.clinic_invites;
  row public.clinics;
  key text := upper(trim(both from coalesce(p_token, '')));
  cur_type text;
  existing_cid uuid;
  user_email text;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  select p.account_type, p.clinic_id
    into cur_type, existing_cid
  from public.profiles p
  where p.id = uid;

  if cur_type is distinct from 'physio' then
    raise exception 'Solo las cuentas de fisioterapeuta pueden usar este código.';
  end if;

  if existing_cid is not null
     or exists (select 1 from public.clinic_members m where m.user_id = uid) then
    select c.* into row
    from public.clinics c
    join public.clinic_members m on m.clinic_id = c.id
    where m.user_id = uid
    order by case when m.role = 'owner' then 0 else 1 end
    limit 1;
    if found then
      return row;
    end if;
  end if;

  if key = '' then
    raise exception 'Introduce el código de alta de la clínica.';
  end if;

  select * into inv
  from public.clinic_invites
  where accepted_at is null
    and expires_at > now()
    and (
      token = trim(both from coalesce(p_token, ''))
      or upper(invite_code) = key
    )
  limit 1;
  if not found then
    raise exception 'Código no válido o caducado.';
  end if;

  select lower(u.email) into user_email from auth.users u where u.id = uid;
  if inv.email is not null and lower(inv.email) is distinct from user_email then
    raise exception 'Este código está reservado para %', inv.email;
  end if;

  insert into public.clinic_members (clinic_id, user_id, role)
  values (inv.clinic_id, uid, 'physio')
  on conflict (clinic_id, user_id) do update set role = excluded.role;

  perform set_config('app.linking_clinic', '1', true);
  update public.profiles
  set clinic_id = inv.clinic_id,
      clinic_name = (select name from public.clinics where id = inv.clinic_id),
      account_type = 'physio',
      updated_at = now()
  where id = uid;

  update public.clinic_invites
  set accepted_at = now()
  where id = inv.id;

  select c.* into row from public.clinics c where c.id = inv.clinic_id;
  return row;
end;
$$;

revoke all on function public.clinic_claim_invite(text) from public;
revoke all on function public.clinic_claim_invite(text) from anon;
grant execute on function public.clinic_claim_invite(text) to authenticated;
