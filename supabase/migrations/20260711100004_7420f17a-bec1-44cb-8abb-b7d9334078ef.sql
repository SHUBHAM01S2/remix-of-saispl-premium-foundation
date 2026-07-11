GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;

GRANT INSERT ON public.career_applications TO anon, authenticated;
GRANT SELECT, UPDATE ON public.career_applications TO authenticated;
GRANT ALL ON public.career_applications TO service_role;

GRANT INSERT ON public.affiliate_enquiries TO anon, authenticated;
GRANT SELECT, UPDATE ON public.affiliate_enquiries TO authenticated;
GRANT ALL ON public.affiliate_enquiries TO service_role;