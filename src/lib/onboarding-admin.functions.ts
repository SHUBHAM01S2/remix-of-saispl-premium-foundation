import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAnyAdmin } from "@/lib/admin-auth";

export type OnboardingStatus =
  | "pending"
  | "waiting_on_client"
  | "in_review"
  | "kickoff_ready"
  | "active_project";

export const ONBOARDING_STATUSES: { value: OnboardingStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "waiting_on_client", label: "Waiting on Client" },
  { value: "in_review", label: "In Review" },
  { value: "kickoff_ready", label: "Kickoff Ready" },
  { value: "active_project", label: "Active Project" },
];

export const ASSET_KEYS = [
  "logo",
  "brand_kit",
  "website_content",
  "images",
  "domain",
  "hosting_details",
  "social_links",
  "legal_pages",
] as const;

export const ACCESS_KEYS = [
  "domain_access",
  "hosting_vps",
  "business_email",
  "google_analytics",
  "search_console",
  "meta_access",
  "cal_com",
  "whatsapp_api",
  "crm_access",
] as const;

export const CHECKLIST_KEYS = [
  "intake_complete",
  "scope_confirmed",
  "assets_received",
  "access_received",
  "kickoff_call_scheduled",
] as const;

export type OnboardingRow = {
  id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  project_type: string | null;
  project_manager: string | null;
  status: OnboardingStatus;
  project_goals: string | null;
  package_selected: string | null;
  target_launch_date: string | null;
  pages_needed: string | null;
  features_needed: string | null;
  integrations_needed: string | null;
  assets: Record<string, boolean>;
  access: Record<string, boolean>;
  checklist: Record<string, boolean>;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const COLS =
  "id, company_name, contact_person, email, phone, project_type, project_manager, status, project_goals, package_selected, target_launch_date, pages_needed, features_needed, integrations_needed, assets, access, checklist, notes, created_at, updated_at";

function normalize(row: any): OnboardingRow {
  return {
    ...row,
    assets: row.assets ?? {},
    access: row.access ?? {},
    checklist: row.checklist ?? {},
  } as OnboardingRow;
}

export const listOnboarding = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<OnboardingRow[]> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .select(COLS)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(normalize);
  });

export const getOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }): Promise<OnboardingRow | null> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .select(COLS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return row ? normalize(row) : null;
  });

export const createOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { company_name: string; contact_person?: string; email?: string }) => {
    if (!data?.company_name || !data.company_name.trim()) throw new Error("Company name required");
    return data;
  })
  .handler(async ({ context, data }): Promise<OnboardingRow> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .insert({
        company_name: data.company_name.trim(),
        contact_person: data.contact_person?.trim() || null,
        email: data.email?.trim() || null,
      })
      .select(COLS)
      .single();
    if (error) throw error;
    return normalize(row);
  });

export const updateOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; patch: Partial<OnboardingRow> }) => {
    if (!data?.id) throw new Error("id required");
    if (!data.patch || typeof data.patch !== "object") throw new Error("patch required");
    return data;
  })
  .handler(async ({ context, data }): Promise<OnboardingRow> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, created_at, updated_at, ...allowed } = data.patch as any;
    const { data: row, error } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .update(allowed)
      .eq("id", data.id)
      .select(COLS)
      .single();
    if (error) throw error;
    return normalize(row);
  });

export const deleteOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true, id: data.id };
  });
