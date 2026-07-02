-- Add status column to contact_submissions to track admin workflow.
-- Run this in the Supabase SQL editor.

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';

ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_submissions_status_check;

ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_submissions_status_check
  CHECK (status IN ('new', 'contacted', 'in_progress', 'closed'));

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status
  ON public.contact_submissions (status);
