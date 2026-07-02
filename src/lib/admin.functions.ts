import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("admins")
      .select("id, email, role")
      .eq("id", context.userId)
      .maybeSingle();

    if (error) throw error;
    return {
      isAdmin: !!data,
      admin: data ?? null,
      email: context.claims?.email ?? null,
    };
  });
