-- Role-based access control hardening + audit log.
-- Safe to re-run.

-- =========================================================
-- 1. Defense-in-depth: explicitly REVOKE all writes on public.admins
--    from `authenticated`. Only the service role (used by super-admin
--    server functions) may mutate admin rows.
--
--    RLS already blocks this, but stripping the grants means a policy
--    misconfiguration cannot open a hole.
-- =========================================================
revoke insert, update, delete on public.admins from authenticated;
revoke insert, update, delete on public.admins from anon;

-- (SELECT stays granted so a logged-in user can read their own row.)

-- =========================================================
-- 2. Admin role-change audit log
-- =========================================================
create table if not exists public.admin_role_audit (
  id           uuid primary key default gen_random_uuid(),
  actor_id     uuid,                        -- who performed the change
  actor_email  text,
  target_id    uuid not null,               -- which admin was affected
  target_email text not null,
  action       text not null check (action in ('grant','update','revoke')),
  from_role    text,
  to_role      text,
  reason       text,
  created_at   timestamptz not null default now()
);

create index if not exists admin_role_audit_created_idx
  on public.admin_role_audit(created_at desc);
create index if not exists admin_role_audit_target_idx
  on public.admin_role_audit(target_id, created_at desc);

grant select on public.admin_role_audit to authenticated;
grant all on public.admin_role_audit to service_role;
-- No insert/update/delete for `authenticated`: only server-role code writes.

alter table public.admin_role_audit enable row level security;

-- Only current super admins may read the audit trail. Anyone else gets no rows.
drop policy if exists "super admins read role audit" on public.admin_role_audit;
create policy "super admins read role audit" on public.admin_role_audit
  for select to authenticated
  using (
    exists (
      select 1 from public.admins a
      where a.id = auth.uid()
        and a.role <> 'editor'      -- editor is the only non-super role
    )
  );
