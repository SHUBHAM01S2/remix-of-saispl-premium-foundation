import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Fire-and-forget deny logger, invoked from the client when a user renders
 * the WrongRoleNotice (i.e. tried to reach a page for the other role) or
 * when the router blocks a route. Records actor identity + attempted route.
 */
export const logAdminAccessDenied = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { route: string; reason?: string; userAgent?: string }) => {
    if (!d?.route) throw new Error("route required");
    return d;
  })
  .handler(async ({ context, data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const email = (context.claims as { email?: string } | undefined)?.email ?? null;
      await (supabaseAdmin as any)
        .from("admin_access_denied")
        .insert({
          actor_id: context.userId ?? null,
          actor_email: email,
          route: data.route,
          kind: "route",
          reason: data.reason ?? "wrong role",
          user_agent: data.userAgent ?? null,
        });
    } catch (err) {
      console.error("[admin-audit] logAdminAccessDenied insert failed:", err);
    }
    return { ok: true };
  });
