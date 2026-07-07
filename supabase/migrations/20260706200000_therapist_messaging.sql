-- Premium flag + direct messaging with therapist (David Ramirez Moreno)
alter table public.profiles
  add column if not exists is_premium boolean not null default false;

create table if not exists public.therapist_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint therapist_threads_user_id_key unique (user_id)
);

create table if not exists public.therapist_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.therapist_threads(id) on delete cascade,
  sender_role text not null check (sender_role in ('user', 'therapist')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists therapist_messages_thread_created_idx
  on public.therapist_messages (thread_id, created_at);

alter table public.therapist_threads enable row level security;
alter table public.therapist_messages enable row level security;

create policy therapist_threads_select_own
  on public.therapist_threads for select to authenticated
  using (auth.uid() = user_id);

create policy therapist_threads_insert_own
  on public.therapist_threads for insert to authenticated
  with check (auth.uid() = user_id);

create policy therapist_messages_select_own
  on public.therapist_messages for select to authenticated
  using (
    exists (
      select 1 from public.therapist_threads t
      where t.id = thread_id and t.user_id = auth.uid()
    )
  );

create policy therapist_messages_insert_user
  on public.therapist_messages for insert to authenticated
  with check (
    sender_role = 'user'
    and exists (
      select 1 from public.therapist_threads t
      join public.profiles p on p.id = auth.uid()
      where t.id = thread_id
        and t.user_id = auth.uid()
        and p.is_premium = true
    )
  );

grant select, insert on public.therapist_threads to authenticated;
grant select, insert on public.therapist_messages to authenticated;

create or replace function public.seed_therapist_welcome()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.therapist_messages (thread_id, sender_role, content)
  values (
    new.id,
    'therapist',
    'Hola, soy David Ramirez Moreno, entrenador atlético de PhysioGuide AI. Este es tu canal directo conmigo. Cuando actives Premium podrás enviarme mensajes y te responderé personalmente lo antes posible.'
  );
  return new;
end;
$$;

drop trigger if exists therapist_thread_welcome on public.therapist_threads;
create trigger therapist_thread_welcome
  after insert on public.therapist_threads
  for each row execute function public.seed_therapist_welcome();

do $$
begin
  alter publication supabase_realtime add table public.therapist_messages;
exception
  when duplicate_object then null;
end $$;
