-- Affiliate program enquiries submitted from the /affiliate-enquiry page.
-- Public can INSERT only; admins read/update via the service role (server functions).

CREATE TABLE IF NOT EXISTS public.affiliate_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text,
  location text,
  website text,
  audience_type text,
  experience text,
  expected_referrals text,
  hear_about text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_enquiries
  DROP CONSTRAINT IF EXISTS affiliate_enquiries_status_check;
ALTER TABLE public.affiliate_enquiries
  ADD CONSTRAINT affiliate_enquiries_status_check
  CHECK (status IN ('new', 'contacted', 'in_progress', 'approved', 'rejected', 'closed'));

CREATE INDEX IF NOT EXISTS idx_affiliate_enquiries_status
  ON public.affiliate_enquiries (status);
CREATE INDEX IF NOT EXISTS idx_affiliate_enquiries_created_at
  ON public.affiliate_enquiries (created_at DESC);

-- RLS: public INSERT only. Reads/updates happen via server functions using service role.
ALTER TABLE public.affiliate_enquiries ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.affiliate_enquiries FROM anon, authenticated;
GRANT INSERT ON public.affiliate_enquiries TO anon, authenticated;
GRANT ALL ON public.affiliate_enquiries TO service_role;

DROP POLICY IF EXISTS "Public can insert affiliate enquiries" ON public.affiliate_enquiries;
CREATE POLICY "Public can insert affiliate enquiries"
  ON public.affiliate_enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
