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

export type CustomChecklistItem = { id: string; label: string; done: boolean };
export type TimelineEntry = {
  ts: string;
  kind: "status" | "checklist" | "custom" | "created" | "update";
  message: string;
};

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
  checklist: Record<string, any>;
  custom_checklist: CustomChecklistItem[];
  timeline: TimelineEntry[];
  maintenance_plan: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const COLS =
  "id, company_name, contact_person, email, phone, project_type, project_manager, status, project_goals, package_selected, target_launch_date, pages_needed, features_needed, integrations_needed, assets, access, checklist, notes, created_at, updated_at";

// The `checklist` jsonb column holds the standard boolean keys plus two
// reserved keys: `__custom` (CustomChecklistItem[]) and `__timeline`
// (TimelineEntry[]). Extract them into first-class row fields for the UI.
function splitChecklist(raw: any): {
  standard: Record<string, boolean>;
  custom: CustomChecklistItem[];
  timeline: TimelineEntry[];
  maintenance_plan: string | null;
} {
  const src = raw && typeof raw === "object" ? raw : {};
  const custom = Array.isArray(src.__custom) ? (src.__custom as CustomChecklistItem[]) : [];
  const timeline = Array.isArray(src.__timeline) ? (src.__timeline as TimelineEntry[]) : [];
  const maintenance_plan =
    typeof src.__maintenance_plan === "string" ? src.__maintenance_plan : null;
  const standard: Record<string, boolean> = {};
  for (const k of Object.keys(src)) {
    if (k === "__custom" || k === "__timeline" || k === "__maintenance_plan") continue;
    standard[k] = !!src[k];
  }
  return { standard, custom, timeline, maintenance_plan };
}

function normalize(row: any): OnboardingRow {
  const { standard, custom, timeline, maintenance_plan } = splitChecklist(row.checklist);
  return {
    ...row,
    assets: row.assets ?? {},
    access: row.access ?? {},
    checklist: standard,
    custom_checklist: custom,
    timeline,
    maintenance_plan,
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
  .inputValidator((data: {
    company_name: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    project_type?: string;
    package_selected?: string;
    project_manager?: string;
    target_launch_date?: string;
    project_goals?: string;
  }) => {
    if (!data?.company_name || !data.company_name.trim()) throw new Error("Company name required");
    return data;
  })
  .handler(async ({ context, data }): Promise<OnboardingRow> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const clean = (v?: string) => (v && v.trim() ? v.trim() : null);
    const initialTimeline: TimelineEntry[] = [
      { ts: new Date().toISOString(), kind: "created", message: `Onboarding created for ${data.company_name.trim()}` },
    ];
    const { data: row, error } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .insert({
        company_name: data.company_name.trim(),
        contact_person: clean(data.contact_person),
        email: clean(data.email),
        phone: clean(data.phone),
        project_type: clean(data.project_type),
        package_selected: clean(data.package_selected),
        project_manager: clean(data.project_manager),
        target_launch_date: clean(data.target_launch_date),
        project_goals: clean(data.project_goals),
        checklist: { __timeline: initialTimeline, __custom: [] },
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

    // Read previous state so we can diff and append to the timeline.
    const { data: prevRaw, error: prevErr } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .select(COLS)
      .eq("id", data.id)
      .maybeSingle();
    if (prevErr) throw prevErr;
    if (!prevRaw) throw new Error("Onboarding record not found");
    const prev = normalize(prevRaw);

    const {
      id: _id,
      created_at: _c,
      updated_at: _u,
      custom_checklist: patchCustom,
      timeline: _t,
      checklist: patchChecklist,
      status: patchStatus,
      ...restPatch
    } = data.patch as any;

    const nextStandardChecklist: Record<string, boolean> =
      patchChecklist && typeof patchChecklist === "object"
        ? { ...prev.checklist, ...patchChecklist }
        : prev.checklist;
    const nextCustom: CustomChecklistItem[] = Array.isArray(patchCustom)
      ? patchCustom
      : prev.custom_checklist;
    const nextStatus: OnboardingStatus = patchStatus ?? prev.status;

    // Diff → new timeline entries
    const newEntries: TimelineEntry[] = [];
    const now = () => new Date().toISOString();

    if (patchStatus && patchStatus !== prev.status) {
      const label = (v: string) => ONBOARDING_STATUSES.find((s) => s.value === v)?.label ?? v;
      newEntries.push({
        ts: now(),
        kind: "status",
        message: `Status changed: ${label(prev.status)} → ${label(patchStatus)}`,
      });
    }

    if (patchChecklist && typeof patchChecklist === "object") {
      for (const k of Object.keys(patchChecklist)) {
        const before = !!prev.checklist[k];
        const after = !!patchChecklist[k];
        if (before !== after) {
          newEntries.push({
            ts: now(),
            kind: "checklist",
            message: `${after ? "Completed" : "Reopened"} checklist item: ${k}`,
          });
        }
      }
    }

    if (Array.isArray(patchCustom)) {
      const prevById = new Map(prev.custom_checklist.map((i) => [i.id, i]));
      const nextById = new Map(nextCustom.map((i) => [i.id, i]));
      for (const [id, item] of nextById) {
        const before = prevById.get(id);
        if (!before) {
          newEntries.push({ ts: now(), kind: "custom", message: `Added item: ${item.label}` });
        } else if (before.done !== item.done) {
          newEntries.push({
            ts: now(),
            kind: "custom",
            message: `${item.done ? "Completed" : "Reopened"} item: ${item.label}`,
          });
        } else if (before.label !== item.label) {
          newEntries.push({
            ts: now(),
            kind: "custom",
            message: `Renamed item: ${before.label} → ${item.label}`,
          });
        }
      }
      for (const [id, item] of prevById) {
        if (!nextById.has(id)) {
          newEntries.push({ ts: now(), kind: "custom", message: `Removed item: ${item.label}` });
        }
      }
    }

    const mergedTimeline: TimelineEntry[] = [...prev.timeline, ...newEntries];

    const updatePayload: any = {
      ...restPatch,
      status: nextStatus,
      checklist: {
        ...nextStandardChecklist,
        __custom: nextCustom,
        __timeline: mergedTimeline,
      },
    };

    const { data: row, error } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .update(updatePayload)
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
