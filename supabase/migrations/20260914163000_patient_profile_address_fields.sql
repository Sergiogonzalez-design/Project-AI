-- Full address fields for patient onboarding (Maps-style location).
alter table public.profiles
  add column if not exists address text,
  add column if not exists postal_code text,
  add column if not exists country text;

comment on column public.profiles.address is 'Street / line address from place autocomplete';
comment on column public.profiles.postal_code is 'Postal / ZIP code from place autocomplete';
comment on column public.profiles.country is 'Country from place autocomplete';
