-- Add attachment metadata column to client_messages.
-- Each entry: { path: string, name: string, size: number, type: string }
-- Files themselves live in the `client-onboarding-assets` bucket
-- under the prefix `messages/<onboarding_id>/`.

ALTER TABLE public.client_messages
  ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;
