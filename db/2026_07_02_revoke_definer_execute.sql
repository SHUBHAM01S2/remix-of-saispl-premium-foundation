-- Revoke EXECUTE on the SECURITY DEFINER event-trigger function from public API roles.
-- rls_auto_enable() runs as an event trigger and must not be callable via the Data API.

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
