import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertSuperAdmin } from "@/lib/admin-auth";

export type AdminAccount = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export type AdminRoleAuditRow = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  target_id: string;
  target_email: string;
  action: "grant" | "update" | "revoke";
  from_role: string | null;
  to_role: string | null;
  reason: string | null;
  created_at: string;
};

export const ADMIN_ROLES = [
  { value: "super_admin", label: "Super Admin (full access)" },
  { value: "editor", label: "Editor (content only)" },
] as const;

const ALLOWED_ROLES = new Set(["super_admin", "editor"]);

async function logRoleChange(
  admin: any,
  entry: Omit<AdminRoleAuditRow, "id" | "created_at">,
) {
  // Fire-and-forget: never let audit failure block the primary action, but do
  // surface the error to the server logs so we notice a misconfigured table.
  const { error } = await admin.from("admin_role_audit").insert(entry);
  if (error) console.error("[admin-audit] failed to log role change:", error);
}

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminAccount[]> => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("admins")
      .select("id, email, role, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as AdminAccount[];
  });

export type AdminRoleAuditQuery = {
  q?: string;              // free-text (matches actor or target email)
  actor?: string;          // exact actor email (ilike)
  target?: string;         // exact target email (ilike)
  action?: "grant" | "update" | "revoke" | "all";
  from?: string;           // ISO date (>=)
  to?: string;             // ISO date (<=)
  page?: number;           // 1-based
  pageSize?: number;       // default 25, max 100
};

export type AdminRoleAuditPage = {
  rows: AdminRoleAuditRow[];
  total: number;
  page: number;
  pageSize: number;
};

export const listAdminRoleAudit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data?: AdminRoleAuditQuery) => data ?? {})
  .handler(async ({ context, data }): Promise<AdminRoleAuditPage> => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;

    const page = Math.max(1, data.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, data.pageSize ?? 25));
    const rangeFrom = (page - 1) * pageSize;
    const rangeTo = rangeFrom + pageSize - 1;

    let q = admin
      .from("admin_role_audit")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (data.q && data.q.trim()) {
      const needle = `%${data.q.trim()}%`;
      q = q.or(`actor_email.ilike.${needle},target_email.ilike.${needle}`);
    }
    if (data.actor) q = q.ilike("actor_email", data.actor);
    if (data.target) q = q.ilike("target_email", data.target);
    if (data.action && data.action !== "all") q = q.eq("action", data.action);
    if (data.from) q = q.gte("created_at", data.from);
    if (data.to) q = q.lte("created_at", data.to);

    const { data: rows, error, count } = await q.range(rangeFrom, rangeTo);
    if (error) throw error;
    return {
      rows: (rows ?? []) as AdminRoleAuditRow[],
      total: count ?? 0,
      page,
      pageSize,
    };
  });

export const updateAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; role: string; reason?: string }) => {
    if (!data?.id) throw new Error("id required");
    if (!ALLOWED_ROLES.has(data.role)) throw new Error("Invalid role");
    return data;
  })
  .handler(async ({ context, data }) => {
    const caller = await assertSuperAdmin(context as any);
    // Prevent demoting yourself — you'd lock yourself out.
    if (data.id === caller.id && data.role !== "super_admin") {
      throw new Error("You cannot demote your own account.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;

    const { data: before } = await admin
      .from("admins").select("id, email, role").eq("id", data.id).maybeSingle();
    if (!before) throw new Error("Admin not found");

    const { data: row, error } = await admin
      .from("admins")
      .update({ role: data.role })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;

    await logRoleChange(admin, {
      actor_id: caller.id,
      actor_email: caller.email,
      target_id: before.id,
      target_email: before.email,
      action: "update",
      from_role: before.role,
      to_role: data.role,
      reason: data.reason ?? null,
    });

    return row as AdminAccount;
  });

export const deleteAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; reason?: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    const caller = await assertSuperAdmin(context as any);
    if (data.id === caller.id) {
      throw new Error("You cannot delete your own admin account.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;

    const { data: before } = await admin
      .from("admins").select("id, email, role").eq("id", data.id).maybeSingle();
    if (!before) return { ok: true };

    const { error } = await admin.from("admins").delete().eq("id", data.id);
    if (error) throw error;

    await logRoleChange(admin, {
      actor_id: caller.id,
      actor_email: caller.email,
      target_id: before.id,
      target_email: before.email,
      action: "revoke",
      from_role: before.role,
      to_role: null,
      reason: data.reason ?? null,
    });

    return { ok: true };
  });

export const addAdminByUserId = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    userId: string;
    email: string;
    role: string;
    reason?: string;
    confirmClientOverride?: boolean;
  }) => {
    if (!data?.userId) throw new Error("userId required");
    if (!data?.email) throw new Error("email required");
    if (!ALLOWED_ROLES.has(data.role)) throw new Error("Invalid role");
    return data;
  })
  .handler(async ({ context, data }) => {
    const caller = await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;

    // Safety net: never promote a client account by accident. If the target
    // email is currently attached to a client_onboarding record, require the
    // super admin to opt in explicitly.
    const normalizedEmail = data.email.trim().toLowerCase();
    if (!data.confirmClientOverride) {
      const { data: clientRow } = await admin
        .from("client_onboarding")
        .select("id")
        .ilike("contact_email", normalizedEmail)
        .limit(1)
        .maybeSingle();
      if (clientRow) {
        throw new Error(
          `${data.email} is registered as a client. Confirm the promotion by re-submitting with confirmClientOverride=true.`,
        );
      }
    }

    const { data: row, error } = await admin
      .from("admins")
      .insert({ id: data.userId, email: normalizedEmail, role: data.role })
      .select()
      .single();
    if (error) throw error;

    await logRoleChange(admin, {
      actor_id: caller.id,
      actor_email: caller.email,
      target_id: data.userId,
      target_email: normalizedEmail,
      action: "grant",
      from_role: null,
      to_role: data.role,
      reason: data.reason ?? null,
    });

    return row as AdminAccount;
  });
