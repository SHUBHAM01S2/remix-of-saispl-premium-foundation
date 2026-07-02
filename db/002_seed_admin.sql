-- Grant admin access to an existing auth user.
-- Replace the email below with the user you want to promote.

insert into public.admins (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'you@example.com'
on conflict (id) do nothing;
