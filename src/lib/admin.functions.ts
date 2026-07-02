import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
