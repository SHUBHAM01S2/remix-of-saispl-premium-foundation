-- Grant admin access to an existing auth user.
-- Replace the email below with the user you want to promote.
--
-- IMPORTANT: The default role for every new sign-up is "client" (i.e. NO
-- row in public.admins). Only rows explicitly inserted here or through
-- the Manage Admins UI grant admin privileges. Never insert a client
-- account into public.admins.
--
-- Roles:
--   super_admin  -> full access (default for the very first admin)
--   editor       -> content-only access (Portfolio / Blog / Testimonials / Capabilities)

insert into public.admins (id, email, role)
select id, email, 'super_admin'
from auth.users
where email = 'you@example.com'
on conflict (id) do nothing;
