-- Restrict vector search to Physioguide sources so clinical modules are recoverable
-- even when older PDFs dominate global similarity.

create or replace function public.match_document_chunks_prefixed(
  query_embedding vector,
  name_prefix text,
  match_count integer default 8,
  match_threshold double precision default 0.25
)
returns table(id uuid, source_name text, content text, similarity double precision)
language sql
stable
as $$
  select
    id, source_name, content,
    1 - (embedding <=> query_embedding) as similarity
  from public.document_chunks
  where source_name like name_prefix || '%'
    and 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

grant execute on function public.match_document_chunks_prefixed(vector, text, integer, double precision) to anon, authenticated, service_role;
