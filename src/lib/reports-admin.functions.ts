import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertSuperAdmin } from "@/lib/admin-auth";

export function slugifyClient(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ClientReport = {
  id: string;
  client_name: string;
  month: string; // YYYY-MM-DD (first of month)
  uptime_percentage: number;
  site_visitors: number;
  leads_from_forms: number;
  whatsapp_taps: number;
  top_pages: string[];
  work_done_this_month: string | null;
  next_month_recommendation: string | null;
  created_at: string;
};

export type ReportInput = {
  id?: string;
  client_name: string;
  month: string;
  uptime_percentage: number;
  site_visitors: number;
  leads_from_forms: number;
  whatsapp_taps: number;
  top_pages: string[];
  work_done_this_month: string | null;
  next_month_recommendation: string | null;
};

export const listReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ClientReport[]> => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("client_reports")
      .select("*")
      .order("month", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ClientReport[];
  });

export const getReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }): Promise<ClientReport | null> => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("client_reports")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return (row ?? null) as ClientReport | null;
  });

export const upsertReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: ReportInput) => {
    if (!data?.client_name?.trim()) throw new Error("client_name required");
    if (!data?.month) throw new Error("month required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      client_name: data.client_name.trim(),
      month: data.month,
      uptime_percentage: data.uptime_percentage,
      site_visitors: data.site_visitors,
      leads_from_forms: data.leads_from_forms,
      whatsapp_taps: data.whatsapp_taps,
      top_pages: data.top_pages,
      work_done_this_month: data.work_done_this_month,
      next_month_recommendation: data.next_month_recommendation,
    };
    const q = data.id
      ? (supabaseAdmin as any)
          .from("client_reports")
          .update(payload)
          .eq("id", data.id)
          .select()
          .single()
      : (supabaseAdmin as any)
          .from("client_reports")
          .insert(payload)
          .select()
          .single();
    const { data: row, error } = await q;
    if (error) throw error;
    return row as ClientReport;
  });

export const deleteReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("client_reports")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// Public: fetch all reports for a client slug (no auth required).
export const getReportsBySlug = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => {
    if (!data?.slug) throw new Error("slug required");
    return data;
  })
  .handler(
    async ({
      data,
    }): Promise<{ clientName: string; reports: ClientReport[] } | null> => {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: rows, error } = await (supabaseAdmin as any)
        .from("client_reports")
        .select("*")
        .order("month", { ascending: false });
      if (error) throw error;
      const matches = (rows ?? []).filter(
        (r: ClientReport) => slugifyClient(r.client_name) === data.slug,
      );
      if (matches.length === 0) return null;
      return {
        clientName: matches[0].client_name,
        reports: matches as ClientReport[],
      };
    },
  );
