-- Admins table for admin panel access control
-- Run this in the Supabase SQL editor.

create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

grant select on public.admins to authenticated;
grant all on public.admins to service_role;

alter table public.admins enable row level security;

-- Admins can read their own row (used by the app to verify admin status)
drop policy if exists "Admins can read own row" on public.admins;
create policy "Admins can read own row"
on public.admins for select
to authenticated
using (id = auth.uid());
