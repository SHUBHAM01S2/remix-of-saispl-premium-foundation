-- Portfolio projects table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client_industry text NOT NULL,
  category text NOT NULL,
  thumbnail_url text,
  screenshot_urls text[] NOT NULL DEFAULT '{}',
  challenge text,
  solution text,
  results text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolio projects"
  ON public.portfolio_projects
  FOR SELECT
  TO anon, authenticated
  USING (true);
