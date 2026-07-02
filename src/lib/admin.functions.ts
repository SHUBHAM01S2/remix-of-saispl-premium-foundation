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
