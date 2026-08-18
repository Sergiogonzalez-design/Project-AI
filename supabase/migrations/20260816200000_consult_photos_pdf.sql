-- Allow PDFs in consult attachments (gallery/camera photos stay images)
update storage.buckets
set
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  file_size_limit = 10485760
where id = 'consult-photos';
