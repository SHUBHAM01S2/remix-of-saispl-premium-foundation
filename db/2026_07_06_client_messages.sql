-- Client ↔ Admin messaging (V1)
-- One conversation thread per client_onboarding record.
-- All access is via admin-checked server functions (service role), so the
-- table denies direct client access at the RLS layer.

CREATE TABLE IF NOT EXISTS public.client_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id uuid NOT NULL REFERENCES public.client_onboarding(id) ON DELETE CASCADE,
  sender_role text NOT NULL CHECK (sender_role IN ('client','admin')),
  sender_id uuid,
  sender_name text,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_by_client_at timestamptz,
  read_by_admin_at timestamptz,
  CONSTRAINT client_messages_body_len CHECK (char_length(body) BETWEEN 1 AND 4000)
);

CREATE INDEX IF NOT EXISTS client_messages_thread_idx
  ON public.client_messages (onboarding_id, created_at);

GRANT SELECT, INSERT, UPDATE ON public.client_messages TO authenticated;
GRANT ALL ON public.client_messages TO service_role;

ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "client_messages_no_direct" ON public.client_messages;
CREATE POLICY "client_messages_no_direct"
  ON public.client_messages
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);
