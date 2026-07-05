-- El acceso al sitio exige cuenta; las consultas solo desde usuarios autenticados
drop policy if exists "consultas_insert_anon" on public.consultas;

revoke insert on table public.consultas from anon;
