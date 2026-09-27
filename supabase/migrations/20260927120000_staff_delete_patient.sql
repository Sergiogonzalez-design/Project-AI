-- Staff can remove a patient from their roster (profile detail → eliminar).
-- Guests: hard-delete auth user (cascade cleans profile/reports).
-- Registered patients: unlink physio_id + clinic_id; delete this staff's reports.

create or replace function public.staff_delete_patient(p_patient_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_guest boolean := false;
begin
  if auth.uid() is null or p_patient_id is null then
    raise exception 'not authorized';
  end if;

  if not public._can_staff_manage_patient(p_patient_id) then
    raise exception 'not authorized';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = p_patient_id
      and coalesce(p.account_type, 'patient') = 'patient'
  ) then
    raise exception 'not a patient';
  end if;

  select
    coalesce(u.raw_app_meta_data->>'is_guest', '') = 'true'
    or u.email ilike '%@guests.aikinora.app'
  into v_is_guest
  from auth.users u
  where u.id = p_patient_id;

  -- Drop clinical reports this staff relationship can see.
  delete from public.clinical_reports cr
  where cr.patient_id = p_patient_id
    and (
      public.is_admin()
      or cr.physio_id = auth.uid()
      or (
        public._clinic_owned_id() is not null
        and public._is_clinic_report_visible(cr.physio_id)
      )
    );

  -- Clear WhatsApp consult sessions tied to this patient when present.
  begin
    delete from public.whatsapp_consult_sessions
    where patient_id = p_patient_id;
  exception
    when undefined_table then
      null;
  end;

  if coalesce(v_is_guest, false) then
    -- Guest consulta previa: remove the temporary account entirely.
    delete from auth.users where id = p_patient_id;
  else
    -- Registered patient: unlink from this clinic/physio roster only.
    perform set_config('app.linking_physio', '1', true);
    perform set_config('app.linking_clinic', '1', true);
    update public.profiles
    set
      physio_id = case
        when public.is_physio() and physio_id = auth.uid() then null
        when public._clinic_owned_id() is not null then null
        when public.is_admin() then null
        else physio_id
      end,
      clinic_id = case
        when public._clinic_owned_id() is not null
          and clinic_id = public._clinic_owned_id() then null
        when public.is_admin() then null
        else clinic_id
      end
    where id = p_patient_id;
  end if;

  return true;
end;
$$;

revoke all on function public.staff_delete_patient(uuid) from public;
grant execute on function public.staff_delete_patient(uuid) to authenticated;
