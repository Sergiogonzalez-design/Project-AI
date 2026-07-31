create policy "conv_delete"
  on public.conversations
  for delete
  to authenticated
  using (auth.uid() = user_id);
