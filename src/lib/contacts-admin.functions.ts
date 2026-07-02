import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("admins")
    .select("id")
    .eq("id", ctx.userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Forbidden");
}

export type ContactStatus = "new" | "contacted" | "in_progress" | "closed";

export const CONTACT_STATUSES: { value: ContactStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

export type ContactSubmission = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string;
  status: ContactStatus;
  created_at: string;
};

export const listContactSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ContactSubmission[]> => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("contact_submissions")
      .select("id, name, email, phone, company, message, status, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      ...r,
      status: (r.status ?? "new") as ContactStatus,
    })) as ContactSubmission[];
  });

export const updateContactStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; status: ContactStatus }) => {
    if (!data?.id) throw new Error("id required");
    if (!CONTACT_STATUSES.some((s) => s.value === data.status))
      throw new Error("Invalid status");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("contact_submissions")
      .update({ status: data.status })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row as ContactSubmission;
  });
