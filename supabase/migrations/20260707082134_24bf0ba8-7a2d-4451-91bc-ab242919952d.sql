GRANT INSERT ON public.career_applications TO anon, authenticated;
GRANT ALL ON public.career_applications TO service_role;

DROP POLICY IF EXISTS "Public can insert career applications" ON public.career_applications;
CREATE POLICY "Public can insert career applications"
  ON public.career_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Storage upload policy for resumes bucket
DROP POLICY IF EXISTS "Anyone can upload a resume" ON storage.objects;
CREATE POLICY "Anyone can upload a resume"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');