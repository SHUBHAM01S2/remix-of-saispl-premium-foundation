# Client Portal Storage — verification

Run once in the Supabase SQL editor for project `hrqxfuinvlevbgttabrn`:

  db/2026_07_06_client_portal_storage.sql

The bucket `client-onboarding-assets` and the four RLS policies
(`co_assets_own_{insert,select,update,delete}`) on `storage.objects` are
idempotent — safe to re-run.

## Confirm the bucket + policies are active

Run in the SQL editor:

```sql
-- 1. bucket exists and is private
select id, name, public from storage.buckets where id = 'client-onboarding-assets';

-- 2. all four policies exist and are scoped to auth.uid()
select policyname, cmd, roles::text, qual::text, with_check::text
from pg_policies
where schemaname = 'storage'
  and tablename  = 'objects'
  and policyname like 'co_assets_own_%';
```

Expect: `public = false`; four rows (`insert / select / update / delete`)
all with `roles = {authenticated}` and expressions containing
`bucket_id = 'client-onboarding-assets'` and
`(storage.foldername(name))[1] = auth.uid()::text`.

## RLS smoke test (paste user IDs of two real accounts)

```sql
-- Impersonate user A trying to read a file owned by user B — must return 0 rows.
set local role authenticated;
set local request.jwt.claims = '{"sub":"USER_A_UUID","role":"authenticated"}';
select name from storage.objects
where bucket_id = 'client-onboarding-assets'
  and name like 'USER_B_UUID/%';
reset role;
```

The same test with `USER_A_UUID/%` (their own folder) should return their files.

## End-to-end signed-upload check

The client portal upload path is exercised by `tests/e2e/client-portal.py`.
That script also verifies the encryption-at-rest contract for access
credentials — see the header of the file for the required env vars.
