-- Client Portal V1 — asset uploads bucket + RLS
-- Run in Supabase SQL editor.

insert into storage.buckets (id, name, public)
values ('client-onboarding-assets', 'client-onboarding-assets', false)
on conflict (id) do nothing;

-- Authenticated users may upload/read/delete files ONLY under a top-level
-- folder named after their auth.uid(). Server-side (service role) can read
-- everything to serve them to admins.
drop policy if exists "co_assets_own_insert" on storage.objects;
create policy "co_assets_own_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'client-onboarding-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "co_assets_own_select" on storage.objects;
create policy "co_assets_own_select"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'client-onboarding-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "co_assets_own_update" on storage.objects;
create policy "co_assets_own_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'client-onboarding-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'client-onboarding-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "co_assets_own_delete" on storage.objects;
create policy "co_assets_own_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'client-onboarding-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
