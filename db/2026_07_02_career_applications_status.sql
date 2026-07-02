-- Add status column to career_applications
ALTER TABLE public.career_applications
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';

ALTER TABLE public.career_applications
  DROP CONSTRAINT IF EXISTS career_applications_status_check;

ALTER TABLE public.career_applications
  ADD CONSTRAINT career_applications_status_check
  CHECK (status IN ('new', 'reviewed', 'interviewed', 'hired', 'rejected'));

CREATE INDEX IF NOT EXISTS career_applications_status_idx
  ON public.career_applications (status);
