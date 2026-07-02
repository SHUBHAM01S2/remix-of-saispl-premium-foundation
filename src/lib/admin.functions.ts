import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isSuperAdminRole, canEditContent } from "@/lib/admin-auth";

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any)
      .from("admins")
      .select("id, email, role")
      .eq("id", context.userId)
      .maybeSingle();

    if (error) throw error;
    const admin = data as { id: string; email: string; role: string } | null;
    return {
      isAdmin: !!admin,
      admin,
      isSuperAdmin: admin ? isSuperAdminRole(admin.role) : false,
      canEditContent: admin ? canEditContent(admin.role) : false,
      email: (context.claims as { email?: string } | undefined)?.email ?? null,
    };
  });

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Verify caller is an admin before using elevated access.
    const { data: adminRow, error: adminErr } = await (context.supabase as any)
      .from("admins")
      .select("id")
      .eq("id", context.userId)
      .maybeSingle();
    if (adminErr) throw adminErr;
    if (!adminRow) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const countOf = async (table: string) => {
      const { count, error } = await (supabaseAdmin as any)
        .from(table)
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    };

    const [contactSubmissions, careerApplications, portfolioProjects, blogPosts] =
      await Promise.all([
        countOf("contact_submissions"),
        countOf("career_applications"),
        countOf("portfolio_projects"),
        countOf("blog_posts"),
      ]);

    return { contactSubmissions, careerApplications, portfolioProjects, blogPosts };
  });

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("admins")
    .select("id")
    .eq("id", ctx.userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Forbidden");
}

export type ActivityItem = {
  id: string;
  type: "contact" | "career";
  name: string;
  subtitle: string;
  createdAt: string;
};

export const getRecentActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ActivityItem[]> => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;

    const [contacts, careers] = await Promise.all([
      admin
        .from("contact_submissions")
        .select("id, name, email, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      admin
        .from("career_applications")
        .select("id, name, position_applied, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    if (contacts.error) throw contacts.error;
    if (careers.error) throw careers.error;

    const items: ActivityItem[] = [
      ...(contacts.data ?? []).map((r: any) => ({
        id: r.id,
        type: "contact" as const,
        name: r.name,
        subtitle: r.email ?? "Contact submission",
        createdAt: r.created_at,
      })),
      ...(careers.data ?? []).map((r: any) => ({
        id: r.id,
        type: "career" as const,
        name: r.name,
        subtitle: `Applied: ${r.position_applied}`,
        createdAt: r.created_at,
      })),
    ];

    items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return items.slice(0, 10);
  });

export const getSubmissionDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { type: "contact" | "career"; id: string }) => {
    if (data.type !== "contact" && data.type !== "career") throw new Error("Invalid type");
    if (typeof data.id !== "string" || !data.id) throw new Error("Invalid id");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const table = data.type === "contact" ? "contact_submissions" : "career_applications";
    const { data: row, error } = await (supabaseAdmin as any)
      .from(table)
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return { type: data.type, row: row as Record<string, any> | null };
  });
