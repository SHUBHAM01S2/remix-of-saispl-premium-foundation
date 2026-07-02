import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertSuperAdmin } from "@/lib/admin-auth";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("admins")
    .select("id")
    .eq("id", ctx.userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Forbidden");
}

export type JobOpening = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
] as const;

export const listJobOpenings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<JobOpening[]> => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("job_openings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as JobOpening[];
  });

export const getJobOpening = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }): Promise<JobOpening | null> => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("job_openings")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return (row ?? null) as JobOpening | null;
  });

export type UpsertJobInput = {
  id?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string | null;
  is_active: boolean;
};

export const upsertJobOpening = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: UpsertJobInput) => {
    if (!data.title?.trim()) throw new Error("Title is required");
    if (!data.department?.trim()) throw new Error("Department is required");
    if (!data.location?.trim()) throw new Error("Location is required");
    if (!data.type?.trim()) throw new Error("Type is required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const payload = {
      title: data.title.trim(),
      department: data.department.trim(),
      location: data.location.trim(),
      type: data.type.trim(),
      description: data.description,
      is_active: data.is_active,
    };
    if (data.id) {
      const { data: row, error } = await admin
        .from("job_openings")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw error;
      return row as JobOpening;
    } else {
      const { data: row, error } = await admin
        .from("job_openings")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return row as JobOpening;
    }
  });

export const deleteJobOpening = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("job_openings")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const toggleJobActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; active: boolean }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("job_openings")
      .update({ is_active: data.active })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row as JobOpening;
  });
