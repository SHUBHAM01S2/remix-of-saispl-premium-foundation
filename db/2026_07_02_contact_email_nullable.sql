-- Allow contact form to submit without an email (Business Type / Phone-only inquiries)
ALTER TABLE public.contact_submissions
  ALTER COLUMN email DROP NOT NULL;
