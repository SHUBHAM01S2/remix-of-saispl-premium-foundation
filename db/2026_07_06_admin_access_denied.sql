-- Audit log for denied admin route / endpoint access attempts.
-- Safe to re-run.

create table if not exists public.admin_access_denied (
  id           uuid primary key default gen_random_uuid(),
  actor_id     uuid,
  actor_email  text,
  route        text,                    -- e.g. "/admin/admins", "adminListReferrals"
  kind         text not null default 'route' check (kind in ('route','endpoint')),
  reason       text,
  user_agent   text,
  created_at   timestamptz not null default now()
);

create index if not exists admin_access_denied_created_idx
  on public.admin_access_denied(created_at desc);
create index if not exists admin_access_denied_actor_idx
  on public.admin_access_denied(actor_id, created_at desc);

grant select on public.admin_access_denied to authenticated;
grant all on public.admin_access_denied to service_role;
revoke insert, update, delete on public.admin_access_denied from authenticated, anon;

alter table public.admin_access_denied enable row level security;

-- Only super admins can read the deny log.
drop policy if exists "super admins read access-denied log" on public.admin_access_denied;
create policy "super admins read access-denied log" on public.admin_access_denied
  for select to authenticated
  using (
    exists (
      select 1 from public.admins a
      where a.id = auth.uid() and a.role <> 'editor'
    )
  );
