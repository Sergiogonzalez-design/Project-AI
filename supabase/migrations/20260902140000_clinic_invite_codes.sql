-- Short invite codes + optional email for clinic physio invites.
-- Physios can join via link OR by typing the code at signup.

alter table public.clinic_invites
  alter column email drop not null;

alter table public.clinic_invites
  add column if not exists invite_code text;

-- Backfill short codes for existing invites (stable, unique enough from token).
update public.clinic_invites
set invite_code = upper(substr(replace(token, '-', ''), 1, 8))
where invite_code is null or invite_code = '';

alter table public.clinic_invites
  alter column invite_code set not null;

drop index if exists public.clinic_invites_pending_email_uidx;
create unique index if not exists clinic_invites_pending_email_uidx
  on public.clinic_invites (clinic_id, email)
  where accepted_at is null and email is not null;

create unique index if not exists clinic_invites_code_uidx
  on public.clinic_invites (invite_code);

create or replace function public.clinic_generate_invite_code()
returns text
language plpgsql
volatile
set search_path = public
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  candidate text;
  i int;
begin
  loop
    candidate := '';
    for i in 1..6 loop
      candidate := candidate || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (
      select 1 from public.clinic_invites ci where ci.invite_code = candidate
    );
  end loop;
  return candidate;
end;
$$;

revoke all on function public.clinic_create_invite(text, text) from public;
revoke all on function public.clinic_create_invite(text, text) from anon;
revoke all on function public.clinic_create_invite(text, text) from authenticated;

drop function if exists public.clinic_create_invite(text, text);
drop function if exists public.clinic_lookup_invite(text);
drop function if exists public.clinic_list_invites();

create or replace function public.clinic_create_invite(
  p_email text default null,
  p_display_name text default null
)
returns table (
  token text,
  invite_code text,
  expires_at timestamptz,
  email text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  em text := nullif(lower(trim(both from coalesce(p_email, ''))), '');
  tok text := replace(gen_random_uuid()::text, '-', '');
  code text := public.clinic_generate_invite_code();
  exp_at timestamptz := now() + interval '14 days';
begin
  if not public.is_clinic_owner() then
    raise exception 'No autorizado. Solo el titular de la clínica puede invitar.';
  end if;

  if em is not null and em !~ '^[^@]+@[^@]+\.[^@]+$' then
    raise exception 'Correo no válido.';
  end if;

  select c.id into cid from public.clinics c where c.owner_id = auth.uid();
  if cid is null then
    raise exception 'No se encontró la clínica. Completa el alta de clínica primero.';
  end if;

  if em is not null and exists (
    select 1 from auth.users u where lower(u.email) = em
  ) then
    raise exception 'Ese correo ya tiene una cuenta. Pídele que inicie sesión o usa otro correo.';
  end if;

  if em is not null and exists (
    select 1
    from public.clinic_invites i
    where i.clinic_id = cid
      and i.email = em
      and i.accepted_at is null
  ) then
    -- Reuse pending invite for same email (refresh expiry + return existing token/code).
    update public.clinic_invites i
    set expires_at = exp_at,
        display_name = coalesce(
          nullif(trim(both from coalesce(p_display_name, '')), ''),
          i.display_name
        )
    where i.clinic_id = cid
      and i.email = em
      and i.accepted_at is null
    returning i.token, i.invite_code, i.expires_at, i.email
    into tok, code, exp_at, em;

    return query select tok, code, exp_at, em;
    return;
  end if;

  insert into public.clinic_invites (
    clinic_id, email, display_name, token, invite_code, invited_by, expires_at
  )
  values (
    cid,
    em,
    nullif(trim(both from coalesce(p_display_name, '')), ''),
    tok,
    code,
    auth.uid(),
    exp_at
  );

  return query select tok, code, exp_at, em;
end;
$$;

create or replace function public.clinic_lookup_invite(p_token text)
returns table (
  clinic_name text,
  email text,
  display_name text,
  expires_at timestamptz,
  invite_code text,
  token text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  key text := upper(trim(both from coalesce(p_token, '')));
begin
  if key = '' then
    return;
  end if;

  return query
  select
    c.name,
    i.email,
    i.display_name,
    i.expires_at,
    i.invite_code,
    i.token
  from public.clinic_invites i
  join public.clinics c on c.id = i.clinic_id
  where i.accepted_at is null
    and i.expires_at > now()
    and (
      i.token = trim(both from p_token)
      or upper(i.invite_code) = key
    )
  limit 1;
end;
$$;

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
  if auth.uid() is not null then
    raise exception 'not authorized';
  end if;

  select * into inv
  from public.clinic_invites
  where accepted_at is null
    and expires_at > now()
    and (
      token = trim(both from p_token)
      or upper(invite_code) = key
    )
  limit 1;
  if not found then
    raise exception 'invite not found or expired';
  end if;

  select name into cname from public.clinics where id = inv.clinic_id;

  insert into public.clinic_members (clinic_id, user_id, role)
  values (inv.clinic_id, p_user_id, 'physio')
  on conflict (clinic_id, user_id) do nothing;

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

create or replace function public.clinic_list_invites()
returns table (
  id uuid,
  email text,
  display_name text,
  created_at timestamptz,
  expires_at timestamptz,
  accepted_at timestamptz,
  token text,
  invite_code text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  if not public.is_clinic_owner() then
    raise exception 'No autorizado.';
  end if;
  select c.id into cid from public.clinics c where c.owner_id = auth.uid();
  if cid is null then
    raise exception 'No se encontró la clínica.';
  end if;

  return query
  select
    i.id,
    i.email,
    i.display_name,
    i.created_at,
    i.expires_at,
    i.accepted_at,
    i.token,
    i.invite_code
  from public.clinic_invites i
  where i.clinic_id = cid
  order by i.created_at desc;
end;
$$;

revoke all on function public.clinic_generate_invite_code() from public;
revoke all on function public.clinic_create_invite(text, text) from public;
revoke all on function public.clinic_create_invite(text, text) from anon;
revoke all on function public.clinic_lookup_invite(text) from public;
revoke all on function public.clinic_list_invites() from public;

grant execute on function public.clinic_create_invite(text, text) to authenticated;
grant execute on function public.clinic_list_invites() to authenticated;
grant execute on function public.clinic_lookup_invite(text) to anon, authenticated;
