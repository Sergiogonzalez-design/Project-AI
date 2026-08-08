-- Public contact form submissions from Sobre nosotros / About us.

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  age integer not null,
  inquiry text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint contact_inquiries_full_name_len check (char_length(trim(full_name)) between 2 and 120),
  constraint contact_inquiries_email_len check (char_length(trim(email)) between 5 and 254),
  constraint contact_inquiries_inquiry_len check (char_length(trim(inquiry)) between 5 and 4000),
  constraint contact_inquiries_age_range check (age between 1 and 120)
);

create index if not exists contact_inquiries_created_at_idx
  on public.contact_inquiries (created_at desc);

alter table public.contact_inquiries enable row level security;

drop policy if exists "contact_inquiries_insert_public" on public.contact_inquiries;
create policy "contact_inquiries_insert_public"
  on public.contact_inquiries
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "contact_inquiries_select_admin" on public.contact_inquiries;
create policy "contact_inquiries_select_admin"
  on public.contact_inquiries
  for select
  to authenticated
  using (public.is_admin());

grant insert on table public.contact_inquiries to anon, authenticated;
grant select on table public.contact_inquiries to authenticated;
