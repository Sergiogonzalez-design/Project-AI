-- Conversations for the chat interface
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Nueva consulta',
  created_at timestamptz not null default now()
);
alter table public.conversations enable row level security;
create policy "conv_select" on public.conversations for select to authenticated using (auth.uid() = user_id);
create policy "conv_insert" on public.conversations for insert to authenticated with check (auth.uid() = user_id);
create policy "conv_update" on public.conversations for update to authenticated using (auth.uid() = user_id);
create index conversations_user_id_idx on public.conversations (user_id, created_at desc);

-- Messages within a conversation
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy "msg_select" on public.messages for select to authenticated using (
  exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid())
);
create policy "msg_insert" on public.messages for insert to authenticated with check (
  exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid())
);
create index messages_conversation_id_idx on public.messages (conversation_id, created_at asc);

-- News / announcements for the home page
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  published_at timestamptz not null default now()
);
alter table public.news enable row level security;
create policy "news_select" on public.news for select to authenticated using (true);
