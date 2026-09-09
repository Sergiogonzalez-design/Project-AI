-- Allow clinic owners to remove unused pending staff invites.

create or replace function public.clinic_delete_invite(p_invite_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  deleted int;
begin
  if auth.uid() is null then
    raise exception 'No autorizado.';
  end if;
  if not public.is_clinic_owner() then
    raise exception 'No autorizado.';
  end if;

  select c.id into cid from public.clinics c where c.owner_id = auth.uid();
  if cid is null then
    raise exception 'No se encontró la clínica.';
  end if;

  delete from public.clinic_invites i
  where i.id = p_invite_id
    and i.clinic_id = cid
    and i.accepted_at is null;

  get diagnostics deleted = row_count;
  if deleted = 0 then
    raise exception 'Invitación no encontrada o ya aceptada.';
  end if;
end;
$$;

revoke all on function public.clinic_delete_invite(uuid) from public;
revoke all on function public.clinic_delete_invite(uuid) from anon;
grant execute on function public.clinic_delete_invite(uuid) to authenticated;
