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

export type CareerStatus =
  | "new"
  | "reviewed"
  | "interviewed"
  | "hired"
  | "rejected";

export const CAREER_STATUSES: { value: CareerStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "interviewed", label: "Interviewed" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

export type CareerApplication = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position_applied: string;
  resume_url: string | null;
  status: CareerStatus;
  created_at: string;
};

export const listCareerApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CareerApplication[]> => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("career_applications")
      .select("id, name, email, phone, position_applied, resume_url, status, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      ...r,
      status: (r.status ?? "new") as CareerStatus,
    })) as CareerApplication[];
  });

export const updateCareerStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; status: CareerStatus }) => {
    if (!data?.id) throw new Error("id required");
    if (!CAREER_STATUSES.some((s) => s.value === data.status))
      throw new Error("Invalid status");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("career_applications")
      .update({ status: data.status })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row as CareerApplication;
  });

export const getResumeDownloadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { path: string }) => {
    if (!data?.path) throw new Error("path required");
    return data;
  })
  .handler(async ({ context, data }): Promise<{ url: string }> => {
    await assertAdmin(context as any);
    // If already an absolute URL, return as-is.
    if (/^https?:\/\//i.test(data.path)) return { url: data.path };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await (supabaseAdmin as any).storage
      .from("resumes")
      .createSignedUrl(data.path, 60 * 10);
    if (error) throw error;
    return { url: signed.signedUrl as string };
  });
