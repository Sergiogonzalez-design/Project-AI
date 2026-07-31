-- News cover images
alter table public.news
  add column if not exists image_url text;

-- Public bucket for news images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news',
  'news',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Anyone authenticated can view news images (bucket is also public)
drop policy if exists "news_images_select" on storage.objects;
create policy "news_images_select"
  on storage.objects for select
  to authenticated, anon
  using (bucket_id = 'news');

-- Only admins can upload / replace / delete
drop policy if exists "news_images_insert" on storage.objects;
create policy "news_images_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'news' and public.is_admin());

drop policy if exists "news_images_update" on storage.objects;
create policy "news_images_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'news' and public.is_admin())
  with check (bucket_id = 'news' and public.is_admin());

drop policy if exists "news_images_delete" on storage.objects;
create policy "news_images_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'news' and public.is_admin());
