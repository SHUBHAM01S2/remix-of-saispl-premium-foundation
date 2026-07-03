-- Capabilities shown in the "What we do" section on the homepage.
-- Managed via the admin panel; publicly readable.
CREATE TABLE IF NOT EXISTS public.capabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  meta text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Globe',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.capabilities TO anon, authenticated;
GRANT ALL ON public.capabilities TO service_role;

ALTER TABLE public.capabilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active capabilities"
  ON public.capabilities
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Seed the initial four items so the section is not empty on first load.
INSERT INTO public.capabilities (tag, title, description, meta, icon, sort_order)
VALUES
  ('Engineering', 'Web & Software Development',
   'Scalable web apps and custom software built with modern stacks to power your business growth.',
   'React · Node · TS', 'Globe', 10),
  ('AI · Automation', 'AI & Automation Solutions',
   'Intelligent automation and AI-driven workflows that cut cost, eliminate bottlenecks, and accelerate outcomes.',
   'LLMs · RAG · Agents', 'Cpu', 20),
  ('Platforms', 'Custom Business Portals',
   'Tailored dashboards and portals that unify data, streamline operations, and give teams real-time visibility.',
   'Dashboards · APIs', 'LayoutDashboard', 30),
  ('Design', 'Digital Product Design',
   'User-centered design and prototyping that turns complex ideas into intuitive, high-converting products.',
   'UX · UI · Motion', 'PenTool', 40)
ON CONFLICT DO NOTHING;
