-- Job applications submitted from the /career page.
CREATE TABLE IF NOT EXISTS public.career_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  position_applied text NOT NULL,
  resume_url text,
  cover_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Data API grants
GRANT INSERT ON public.career_applications TO anon, authenticated;
GRANT ALL ON public.career_applications TO service_role;

-- RLS: anyone can apply; nobody can read via the API (admins use service role).
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a career application"
  ON public.career_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Storage: allow public uploads to the private 'resumes' bucket.
-- Reads stay admin-only (service role).
CREATE POLICY "Anyone can upload a resume"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');
