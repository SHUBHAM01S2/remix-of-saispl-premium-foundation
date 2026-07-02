-- Storage RLS for the private "portfolio" bucket.
-- Any authenticated user (admins are the only ones with accounts) can manage files.

drop policy if exists "Authenticated can read portfolio files" on storage.objects;
create policy "Authenticated can read portfolio files"
on storage.objects for select
to authenticated
using (bucket_id = 'portfolio');

drop policy if exists "Authenticated can upload portfolio files" on storage.objects;
create policy "Authenticated can upload portfolio files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated can update portfolio files" on storage.objects;
create policy "Authenticated can update portfolio files"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio');

drop policy if exists "Authenticated can delete portfolio files" on storage.objects;
create policy "Authenticated can delete portfolio files"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio');
