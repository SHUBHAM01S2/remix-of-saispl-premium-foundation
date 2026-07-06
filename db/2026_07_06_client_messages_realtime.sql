-- Client Messages V2 — Realtime subscriptions + tightened storage scoping.
-- Run once in Supabase SQL editor. Idempotent.

-- ------------------------------------------------------------------
-- 1) Row-level SELECT policies so authenticated clients / admins can
--    receive Realtime `postgres_changes` for their own thread only.
--    Writes still go through the service-role server functions.
-- ------------------------------------------------------------------

DROP POLICY IF EXISTS "client_messages_client_realtime" ON public.client_messages;
CREATE POLICY "client_messages_client_realtime"
  ON public.client_messages
  FOR SELECT
  TO authenticated
  USING (
    is_internal = false
    AND EXISTS (
      SELECT 1 FROM public.client_onboarding co
      WHERE co.id = client_messages.onboarding_id
        AND lower(co.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

DROP POLICY IF EXISTS "client_messages_admin_realtime" ON public.client_messages;
CREATE POLICY "client_messages_admin_realtime"
  ON public.client_messages
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.id = auth.uid()));

DROP POLICY IF EXISTS "client_onboarding_admin_realtime" ON public.client_onboarding;
CREATE POLICY "client_onboarding_admin_realtime"
  ON public.client_onboarding
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.id = auth.uid()));

-- Add tables to the realtime publication (safe if already present).
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.client_messages;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.client_onboarding;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- ------------------------------------------------------------------
-- 2) Storage scoping for chat attachments (bucket: client-onboarding-assets)
--    Chat files live under `messages/<onboarding_id>/...` which does NOT
--    match the existing per-uid folder policies, so direct access is
--    already denied. These explicit policies make the intent auditable:
--    signed URLs issued by server functions remain the only access path,
--    and we additionally allow authenticated read only when the caller's
--    email matches the onboarding row that owns the file.
-- ------------------------------------------------------------------

DROP POLICY IF EXISTS "chat_attachments_client_select" ON storage.objects;
CREATE POLICY "chat_attachments_client_select"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'client-onboarding-assets'
    AND (storage.foldername(name))[1] = 'messages'
    AND EXISTS (
      SELECT 1 FROM public.client_onboarding co
      WHERE co.id::text = (storage.foldername(name))[2]
        AND lower(co.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

DROP POLICY IF EXISTS "chat_attachments_admin_select" ON storage.objects;
CREATE POLICY "chat_attachments_admin_select"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'client-onboarding-assets'
    AND (storage.foldername(name))[1] = 'messages'
    AND EXISTS (SELECT 1 FROM public.admins a WHERE a.id = auth.uid())
  );

-- Direct INSERT/UPDATE/DELETE on messages/* by end-users is intentionally
-- NOT granted. All writes flow through signed upload URLs minted by the
-- `signMessageAttachmentUpload` server function, which authorizes the
-- caller before issuing the token.
