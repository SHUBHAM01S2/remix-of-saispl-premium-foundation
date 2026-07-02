-- Quarterly retention add-ons tracker
CREATE TABLE IF NOT EXISTS public.quarterly_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  quarter text NOT NULL,
  addon_type text NOT NULL CHECK (addon_type IN (
    'New seasonal landing page',
    'WhatsApp broadcast campaign setup',
    'Speed and SEO audit + implementation',
    'Year-end website refresh'
  )),
  status text NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled','In Progress','Completed')),
  scheduled_date date,
  completed_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.quarterly_addons TO authenticated;
GRANT SELECT ON public.quarterly_addons TO anon;
GRANT ALL ON public.quarterly_addons TO service_role;

ALTER TABLE public.quarterly_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quarterly addons"
  ON public.quarterly_addons FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "Authenticated can insert quarterly addons"
  ON public.quarterly_addons FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update quarterly addons"
  ON public.quarterly_addons FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete quarterly addons"
  ON public.quarterly_addons FOR DELETE
  TO authenticated USING (true);
