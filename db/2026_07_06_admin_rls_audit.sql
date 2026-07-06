-- RLS audit + hardening for admin-only tables.
-- Idempotent: safe to re-run.
--
-- Goal: no admin data may be read/written without the caller having a row
-- in public.admins (mapped by auth.uid()). Client accounts (Anuj, etc.) must
-- fail even if they bypass the UI and hit PostgREST directly.

-- =========================================================
-- Helper: is the current JWT tied to an admin row?
-- Security-definer so RLS on public.admins doesn't recurse.
-- =========================================================
create or replace function public.is_admin(_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.id = _uid)
$$;

create or replace function public.is_super_admin(_uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where a.id = _uid and a.role <> 'editor'
  )
$$;

grant execute on function public.is_admin(uuid) to authenticated;
grant execute on function public.is_super_admin(uuid) to authenticated;

-- =========================================================
-- public.admins — self-read only. All writes via service_role.
-- =========================================================
alter table public.admins enable row level security;

revoke insert, update, delete on public.admins from authenticated, anon;

drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins
  for select to authenticated
  using (id = auth.uid());

-- =========================================================
-- public.admin_role_audit — read-only for super-admins. Writes: service_role.
-- =========================================================
alter table public.admin_role_audit enable row level security;
revoke insert, update, delete on public.admin_role_audit from authenticated, anon;

drop policy if exists "super admins read role audit" on public.admin_role_audit;
create policy "super admins read role audit" on public.admin_role_audit
  for select to authenticated
  using (public.is_super_admin());

-- =========================================================
-- Admin-only operational tables: block anon + client reads.
-- Editors + super-admins may read via public.is_admin().
-- All writes flow through server functions (service_role) after an
-- assertAdmin() check, so no INSERT/UPDATE/DELETE policies are needed here.
-- =========================================================
do $$
declare
  t text;
  tables text[] := array[
    'contact_submissions',
    'career_applications',
    'affiliate_enquiries',
    'client_reports',
    'admin_role_audit'
  ];
begin
  foreach t in array tables loop
    if to_regclass('public.'||t) is not null then
      execute format('alter table public.%I enable row level security', t);
      execute format('revoke insert, update, delete on public.%I from authenticated, anon', t);
      execute format('drop policy if exists "admins read %s" on public.%I', t, t);
      execute format(
        'create policy "admins read %s" on public.%I for select to authenticated using (public.is_admin())',
        t, t
      );
    end if;
  end loop;
end $$;

-- =========================================================
-- Verification queries (run manually in SQL editor; commented out):
--
--   -- Every admin-only table must have RLS ON and NO policy that grants
--   -- SELECT/INSERT/UPDATE/DELETE to `anon`:
--   select schemaname, tablename, policyname, roles, cmd, qual
--   from pg_policies
--   where schemaname = 'public'
--     and 'anon' = any(roles);
--
--   -- Any table in `public` without RLS is a red flag:
--   select relname from pg_class c
--   join pg_namespace n on n.oid = c.relnamespace
--   where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;
-- =========================================================
