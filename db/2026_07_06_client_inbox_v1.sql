-- Client Inbox V1: conversation state, assignee, and internal notes.
-- Extends the existing client_messages / client_onboarding tables. Run once
-- via the Supabase SQL editor.

-- 1) Per-message "internal note" flag. Internal notes are visible only to
--    admins in the inbox — the client portal filters them out at query time.
ALTER TABLE public.client_messages
  ADD COLUMN IF NOT EXISTS is_internal boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS client_messages_thread_internal_idx
  ON public.client_messages (onboarding_id, is_internal, created_at);

-- 2) Conversation-level state lives on the client_onboarding record so each
--    client keeps exactly one primary thread (V1 constraint).
DO $$ BEGIN
  CREATE TYPE public.conversation_status AS ENUM (
    'unread',
    'waiting_on_team',
    'waiting_on_client',
    'resolved'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.client_onboarding
  ADD COLUMN IF NOT EXISTS conversation_status public.conversation_status
    NOT NULL DEFAULT 'unread',
  ADD COLUMN IF NOT EXISTS conversation_assignee_id uuid,
  ADD COLUMN IF NOT EXISTS conversation_assignee_name text,
  ADD COLUMN IF NOT EXISTS conversation_last_client_at timestamptz,
  ADD COLUMN IF NOT EXISTS conversation_last_admin_at timestamptz;

CREATE INDEX IF NOT EXISTS client_onboarding_conversation_status_idx
  ON public.client_onboarding (conversation_status);
