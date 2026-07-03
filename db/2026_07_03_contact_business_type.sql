-- Rename/replace `company` with `business_type` on contact_submissions.
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS business_type text;

UPDATE public.contact_submissions
  SET business_type = company
  WHERE business_type IS NULL AND company IS NOT NULL;
