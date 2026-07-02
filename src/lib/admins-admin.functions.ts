import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertSuperAdmin } from "@/lib/admin-auth";

export type AdminAccount = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export const ADMIN_ROLES = [
  { value: "super_admin", label: "Super Admin (full access)" },
  { value: "editor", label: "Editor (content only)" },
] as const;

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

export const updateAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; role: string }) => {
    if (!data?.id) throw new Error("id required");
    if (!["super_admin", "editor"].includes(data.role))
      throw new Error("Invalid role");
    return data;
  })
  .handler(async ({ context, data }) => {
    const caller = await assertSuperAdmin(context as any);
    // Prevent demoting yourself — you'd lock yourself out.
    if (data.id === caller.id && data.role !== "super_admin") {
      throw new Error("You cannot demote your own account.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("admins")
      .update({ role: data.role })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row as AdminAccount;
  });

export const deleteAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    const caller = await assertSuperAdmin(context as any);
    if (data.id === caller.id) {
      throw new Error("You cannot delete your own admin account.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("admins")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const addAdminByUserId = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; email: string; role: string }) => {
    if (!data?.userId) throw new Error("userId required");
    if (!data?.email) throw new Error("email required");
    if (!["super_admin", "editor"].includes(data.role))
      throw new Error("Invalid role");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("admins")
      .insert({ id: data.userId, email: data.email, role: data.role })
      .select()
      .single();
    if (error) throw error;
    return row as AdminAccount;
  });
