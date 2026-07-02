-- Lock down contact_submissions and career_applications to INSERT-only from the frontend.
-- Reads/updates/deletes are only available via the Supabase dashboard (service_role).

-- =========================
-- contact_submissions
-- =========================
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop any pre-existing policies to guarantee a clean state
DROP POLICY IF EXISTS "Anyone can submit a contact request" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can insert contact submissions" ON public.contact_submissions;

-- Revoke all table privileges from public-facing roles, then grant only INSERT
REVOKE ALL ON public.contact_submissions FROM anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT ALL ON public.contact_submissions TO service_role;

-- INSERT-only policy (no SELECT/UPDATE/DELETE policies = denied by RLS)
CREATE POLICY "Public can insert contact submissions"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- =========================
-- career_applications
-- =========================
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a career application" ON public.career_applications;
DROP POLICY IF EXISTS "Public can insert career applications" ON public.career_applications;

REVOKE ALL ON public.career_applications FROM anon, authenticated;
GRANT INSERT ON public.career_applications TO anon, authenticated;
GRANT ALL ON public.career_applications TO service_role;

CREATE POLICY "Public can insert career applications"
  ON public.career_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
