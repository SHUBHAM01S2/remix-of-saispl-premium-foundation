// Shared admin role assertions. Uses the request-authed supabase from
// requireSupabaseAuth middleware — safe to import from *.functions.ts.

export type AdminRole = "super_admin" | "editor";

export type AdminRow = {
  id: string;
  email: string;
  role: string;
};

type Ctx = { supabase: any; userId: string };

async function fetchAdmin(ctx: Ctx): Promise<AdminRow | null> {
  const { data, error } = await ctx.supabase
    .from("admins")
    .select("id, email, role")
    .eq("id", ctx.userId)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as AdminRow | null;
}

/** True if role should have super-admin privileges. */
export function isSuperAdminRole(role: string | null | undefined): boolean {
  // Anything that isn't explicitly 'editor' is treated as super_admin.
  // Preserves backwards compatibility with pre-existing role values.
  return !!role && role !== "editor";
}

/** True if role may edit content (portfolio, blog, testimonials). */
export function canEditContent(role: string | null | undefined): boolean {
  return isSuperAdminRole(role) || role === "editor";
}

async function logDenied(
  ctx: Ctx,
  reason: string,
  route?: string,
): Promise<void> {
  // Fire-and-forget. Never let audit failure mask the primary Forbidden error.
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = (ctx as any).claims?.email ?? null;
    await (supabaseAdmin as any)
      .from("admin_access_denied")
      .insert({
        actor_id: ctx.userId ?? null,
        actor_email: email,
        route: route ?? null,
        kind: "endpoint",
        reason,
      });
  } catch (err) {
    console.error("[admin-audit] logDenied insert failed:", err);
  }
}

/** Assert caller is any admin (super or editor). Returns the admin row. */
export async function assertAnyAdmin(ctx: Ctx, route?: string): Promise<AdminRow> {
  const row = await fetchAdmin(ctx);
  if (!row) {
    await logDenied(ctx, "not an admin", route);
    throw new Error("Forbidden");
  }
  return row;
}

/** Assert caller has super_admin role. */
export async function assertSuperAdmin(ctx: Ctx, route?: string): Promise<AdminRow> {
  const row = await fetchAdmin(ctx);
  if (!row || !isSuperAdminRole(row.role)) {
    await logDenied(ctx, row ? "not super_admin" : "not an admin", route);
    throw new Error("Forbidden: super_admin role required");
  }
  return row;
}

/** Assert caller may edit content (editor or super_admin). */
export async function assertContentEditor(ctx: Ctx, route?: string): Promise<AdminRow> {
  const row = await fetchAdmin(ctx);
  if (!row || !canEditContent(row.role)) {
    await logDenied(ctx, row ? "insufficient role" : "not an admin", route);
    throw new Error("Forbidden: editor or super_admin role required");
  }
  return row;
}
