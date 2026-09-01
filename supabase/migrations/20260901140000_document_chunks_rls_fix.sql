-- Drop legacy permissive policies (Postgres ORs INSERT policies — admin-only is not enough alone).
drop policy if exists chunks_insert_service on public.document_chunks;
drop policy if exists chunks_select_service on public.document_chunks;

-- RAG corpus: authenticated read only (no anon dump of embeddings/content).
drop policy if exists document_chunks_select on public.document_chunks;
create policy document_chunks_select
  on public.document_chunks for select
  to authenticated
  using (true);
