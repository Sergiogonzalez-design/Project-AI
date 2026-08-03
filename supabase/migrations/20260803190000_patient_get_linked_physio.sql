-- Lets a patient look up the physio they're currently linked to (name + clinic),
-- without exposing the physios table to general profile RLS. Used by the
-- standalone "Fisioterapia" screen and the post-consult report banner.

create or replace function public.patient_get_linked_physio()
returns table (
  physio_id uuid,
  physio_name text,
  clinic_name text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  return query
  select target.id, target.display_name, target.clinic_name
  from public.profiles me
  join public.profiles target on target.id = me.physio_id
  where me.id = auth.uid();
end;
$$;

revoke all on function public.patient_get_linked_physio() from public;
grant execute on function public.patient_get_linked_physio() to authenticated;
