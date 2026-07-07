
-- 1. Set search_path on functions missing it
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
ALTER FUNCTION public.client_onboarding_touch_updated_at() SET search_path = public;
ALTER FUNCTION public.referrals_bump_last_activity() SET search_path = public;
ALTER FUNCTION public.referrals_compute_commission() SET search_path = public;
ALTER FUNCTION public.referrals_payout_gate() SET search_path = public;
ALTER FUNCTION public.referrals_sync_stage() SET search_path = public;

-- 2. Revoke EXECUTE on SECURITY DEFINER trigger-only function from API roles
REVOKE EXECUTE ON FUNCTION public.referrals_log_change() FROM PUBLIC, anon, authenticated;

-- Restrict admin-check helpers to signed-in users only (still needed by RLS policies)
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(uuid) TO authenticated;

-- 3. Fix always-true RLS policies
-- quarterly_addons: restrict writes to admins
DROP POLICY IF EXISTS "Authenticated can insert quarterly addons" ON public.quarterly_addons;
DROP POLICY IF EXISTS "Authenticated can update quarterly addons" ON public.quarterly_addons;
DROP POLICY IF EXISTS "Authenticated can delete quarterly addons" ON public.quarterly_addons;

CREATE POLICY "Admins can insert quarterly addons" ON public.quarterly_addons
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update quarterly addons" ON public.quarterly_addons
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete quarterly addons" ON public.quarterly_addons
  FOR DELETE TO authenticated USING (public.is_admin());

-- Public submission forms: replace WITH CHECK (true) with basic non-empty validation
DROP POLICY IF EXISTS "Public can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit a contact request" ON public.contact_submissions;
CREATE POLICY "Public can insert contact submissions" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(coalesce(name, '')) > 0 AND length(coalesce(message, '')) > 0);

DROP POLICY IF EXISTS "Public can insert affiliate enquiries" ON public.affiliate_enquiries;
CREATE POLICY "Public can insert affiliate enquiries" ON public.affiliate_enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(coalesce(full_name, '')) > 0
    AND length(coalesce(email, '')) > 0
    AND length(coalesce(phone, '')) > 0
    AND length(coalesce(message, '')) > 0
  );

DROP POLICY IF EXISTS "Public can insert career applications" ON public.career_applications;
CREATE POLICY "Public can insert career applications" ON public.career_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(coalesce(name, '')) > 0
    AND length(coalesce(email, '')) > 0
    AND length(coalesce(position_applied, '')) > 0
  );
