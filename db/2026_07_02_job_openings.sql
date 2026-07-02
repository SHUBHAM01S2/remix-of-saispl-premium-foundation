-- Job openings shown on the /career page.
CREATE TABLE IF NOT EXISTS public.job_openings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  type text NOT NULL CHECK (type IN ('full-time', 'part-time', 'remote')),
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Data API grants: anyone can read active openings; only service role can write.
GRANT SELECT ON public.job_openings TO anon, authenticated;
GRANT ALL ON public.job_openings TO service_role;

ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active job openings"
  ON public.job_openings
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Seed initial openings
INSERT INTO public.job_openings (title, department, location, type, description) VALUES
  ('Senior Full-Stack Developer', 'Engineering', 'Remote (India / International)', 'remote', 'Build scalable web applications using modern frameworks.'),
  ('AI / ML Engineer', 'AI Labs', 'Remote (India / International)', 'remote', 'Design and ship AI agents, RAG systems, and automation workflows.'),
  ('UI/UX Designer', 'Design', 'Remote (India / International)', 'remote', 'Craft delightful product experiences for global clients.'),
  ('DevOps Engineer', 'Platform', 'Remote (India / International)', 'remote', 'Own CI/CD, infrastructure, and reliability across our stack.'),
  ('Product Manager', 'Product', 'Remote (India / International)', 'remote', 'Drive discovery and delivery of client-facing products.'),
  ('Business Development Executive', 'Sales', 'Remote (India / International)', 'remote', 'Grow our international client base and partnerships.');
