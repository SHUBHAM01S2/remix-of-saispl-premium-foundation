-- Monthly client reports
CREATE TABLE IF NOT EXISTS public.client_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  month text NOT NULL,
  site_visitors integer NOT NULL DEFAULT 0,
  top_pages text[] NOT NULL DEFAULT '{}',
  leads_from_forms integer NOT NULL DEFAULT 0,
  whatsapp_taps integer NOT NULL DEFAULT 0,
  work_done_this_month text,
  next_month_recommendation text,
  uptime_percentage numeric(5,2) NOT NULL DEFAULT 100.00,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.client_reports TO anon, authenticated;
GRANT ALL ON public.client_reports TO service_role;

ALTER TABLE public.client_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view client reports"
  ON public.client_reports
  FOR SELECT
  TO anon, authenticated
  USING (true);
