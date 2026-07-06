-- Client Onboarding — V1 lean workspace
-- Run in Supabase SQL editor.

DO $$ BEGIN
  CREATE TYPE public.onboarding_status AS ENUM (
    'pending','waiting_on_client','in_review','kickoff_ready','active_project'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.client_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 1. Client profile
  company_name text NOT NULL,
  contact_person text,
  email text,
  phone text,
  project_type text,
  project_manager text,
  status public.onboarding_status NOT NULL DEFAULT 'pending',
  -- 2. Project intake
  project_goals text,
  package_selected text,
  target_launch_date date,
  pages_needed text,
  features_needed text,
  integrations_needed text,
  -- 3/4/5. Checklists + kickoff notes (jsonb: { key: boolean })
  assets jsonb NOT NULL DEFAULT '{}'::jsonb,
  access jsonb NOT NULL DEFAULT '{}'::jsonb,
  checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_onboarding_created_at_idx
  ON public.client_onboarding (created_at DESC);
CREATE INDEX IF NOT EXISTS client_onboarding_status_idx
  ON public.client_onboarding (status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_onboarding TO authenticated;
GRANT ALL ON public.client_onboarding TO service_role;

ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;

-- All app access goes through admin-checked server functions using service role.
-- Deny direct client access explicitly.
DROP POLICY IF EXISTS "client_onboarding_no_direct" ON public.client_onboarding;
CREATE POLICY "client_onboarding_no_direct"
  ON public.client_onboarding
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.client_onboarding_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS client_onboarding_touch ON public.client_onboarding;
CREATE TRIGGER client_onboarding_touch
  BEFORE UPDATE ON public.client_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.client_onboarding_touch_updated_at();
