-- Switch admin helper functions to SECURITY INVOKER so signed-in users
-- executing them go through normal RLS (admins "self read" policy already
-- lets a user see only their own row, which is all these helpers need when
-- called with the default auth.uid()).
create or replace function public.is_admin(_uid uuid default auth.uid())
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.id = _uid)
$$;

create or replace function public.is_super_admin(_uid uuid default auth.uid())
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where a.id = _uid and a.role <> 'editor'
  )
$$;
