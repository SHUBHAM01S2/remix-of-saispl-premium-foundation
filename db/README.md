# Database SQL

Run these files in order in the Supabase SQL editor for the connected project.

1. `001_create_admins.sql` — creates the `admins` table with RLS.
2. `002_seed_admin.sql` — promotes an existing auth user to admin (edit the email first).

After running `001`, sign up at `/auth`, then edit and run `002` to grant yourself admin access.
