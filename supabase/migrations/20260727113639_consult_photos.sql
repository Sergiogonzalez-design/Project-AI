-- Injury photos attached to consult chat messages
alter table public.messages
  add column if not exists image_url text;

-- Public bucket so vision models can fetch the image URL
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'consult-photos',
  'consult-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read (needed for OpenAI vision fetch + chat thumbnails)
drop policy if exists "consult_photos_select" on storage.objects;
create policy "consult_photos_select"
  on storage.objects for select
  to authenticated, anon
  using (bucket_id = 'consult-photos');

-- Users may only write under their own folder: {user_id}/...
drop policy if exists "consult_photos_insert" on storage.objects;
create policy "consult_photos_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'consult-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "consult_photos_update" on storage.objects;
create policy "consult_photos_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'consult-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'consult-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "consult_photos_delete" on storage.objects;
create policy "consult_photos_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'consult-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
