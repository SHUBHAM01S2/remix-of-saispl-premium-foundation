import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  ACCESS_KEYS,
  ASSET_KEYS,
  ONBOARDING_STATUSES,
  type CustomChecklistItem,
  type OnboardingStatus,
  type TimelineEntry,
} from "@/lib/onboarding-admin.functions";

export type AssetSubmission = {
  kind: "file" | "link" | "note";
  name?: string | null;
  path?: string | null;
  url?: string | null;
  note?: string | null;
  submitted_at: string;
};

export type AccessSubmission = {
  note: string;
  submitted_at: string;
};

export type ClientOnboardingView = {
  id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  project_type: string | null;
  project_manager: string | null;
  status: OnboardingStatus;
  package_selected: string | null;
  target_launch_date: string | null;
  project_goals: string | null;
  maintenance_plan: string | null;
  notes: string | null;
  assets: Record<string, boolean>;
  access: Record<string, boolean>;
  checklist: Record<string, boolean>;
  custom_checklist: CustomChecklistItem[];
  timeline: TimelineEntry[];
  submissions: {
    assets: Record<string, AssetSubmission[]>;
    access: Record<string, AccessSubmission[]>;
  };
  progress: { done: number; total: number; pct: number };
  updated_at: string;
};

const CLIENT_COLS =
  "id, company_name, contact_person, email, phone, project_type, project_manager, status, package_selected, target_launch_date, project_goals, notes, assets, access, checklist, updated_at";

const STANDARD_CHECKLIST_KEYS = [
  "intake_complete",
  "scope_confirmed",
  "assets_received",
  "access_received",
  "kickoff_call_scheduled",
] as const;

function splitChecklist(raw: any) {
  const src = raw && typeof raw === "object" ? raw : {};
  const custom = Array.isArray(src.__custom) ? (src.__custom as CustomChecklistItem[]) : [];
  const timeline = Array.isArray(src.__timeline) ? (src.__timeline as TimelineEntry[]) : [];
  const maintenance_plan =
    typeof src.__maintenance_plan === "string" ? src.__maintenance_plan : null;
  const subs = (src.__submissions && typeof src.__submissions === "object" ? src.__submissions : {}) as any;
  const submissions = {
    assets: (subs.assets && typeof subs.assets === "object" ? subs.assets : {}) as Record<string, AssetSubmission[]>,
    access: (subs.access && typeof subs.access === "object" ? subs.access : {}) as Record<string, AccessSubmission[]>,
  };
  const standard: Record<string, boolean> = {};
  for (const k of Object.keys(src)) {
    if (k.startsWith("__")) continue;
    standard[k] = !!src[k];
  }
  return { standard, custom, timeline, maintenance_plan, submissions };
}

function computeProgress(row: any, standard: Record<string, boolean>, custom: CustomChecklistItem[]) {
  const all = [
    ...ASSET_KEYS.map((k) => !!row.assets?.[k]),
    ...ACCESS_KEYS.map((k) => !!row.access?.[k]),
    ...STANDARD_CHECKLIST_KEYS.map((k) => !!standard?.[k]),
    ...custom.map((i) => i.done),
  ];
  const done = all.filter(Boolean).length;
  const total = all.length || 1;
  return { done, total: all.length, pct: Math.round((done / total) * 100) };
}

function toView(row: any): ClientOnboardingView {
  const { standard, custom, timeline, maintenance_plan, submissions } = splitChecklist(row.checklist);
  return {
    id: row.id,
    company_name: row.company_name,
    contact_person: row.contact_person ?? null,
    email: row.email ?? null,
    phone: row.phone ?? null,
    project_type: row.project_type ?? null,
    project_manager: row.project_manager ?? null,
    status: row.status,
    package_selected: row.package_selected ?? null,
    target_launch_date: row.target_launch_date ?? null,
    project_goals: row.project_goals ?? null,
    maintenance_plan,
    notes: row.notes ?? null,
    assets: row.assets ?? {},
    access: row.access ?? {},
    checklist: standard,
    custom_checklist: custom,
    timeline,
    submissions,
    progress: computeProgress(row, standard, custom),
    updated_at: row.updated_at,
  };
}

async function loadForCurrentUser(context: any) {
  const email = (context.claims?.email ?? "").toString().trim().toLowerCase();
  if (!email) throw new Error("No email associated with your account.");

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Deny if this account is actually an admin — client portal is client-only.
  const { data: adminRow } = await (supabaseAdmin as any)
    .from("admins")
    .select("id")
    .eq("id", context.userId)
    .maybeSingle();
  if (adminRow) {
    throw new Error("This sign-in is for client accounts only.");
  }

  const { data, error } = await (supabaseAdmin as any)
    .from("client_onboarding")
    .select(CLIENT_COLS)
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return { row: data ?? null, email };
}

export const getMyOnboarding = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ClientOnboardingView | null> => {
    const { row } = await loadForCurrentUser(context);
    return row ? toView(row) : null;
  });

function appendTimeline(rawChecklist: any, entry: TimelineEntry) {
  const src = rawChecklist && typeof rawChecklist === "object" ? { ...rawChecklist } : {};
  const timeline: TimelineEntry[] = Array.isArray(src.__timeline) ? [...src.__timeline] : [];
  timeline.push(entry);
  src.__timeline = timeline;
  return src;
}

async function writeChecklistUpdate(
  id: string,
  updater: (prev: any) => { checklist: any; assets?: any; access?: any },
): Promise<ClientOnboardingView> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: prev, error: prevErr } = await (supabaseAdmin as any)
    .from("client_onboarding")
    .select("id, assets, access, checklist")
    .eq("id", id)
    .single();
  if (prevErr) throw prevErr;
  const patch = updater(prev);
  const { data, error } = await (supabaseAdmin as any)
    .from("client_onboarding")
    .update(patch)
    .eq("id", id)
    .select(CLIENT_COLS)
    .single();
  if (error) throw error;
  return toView(data);
}

export const submitClientAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    key: string;
    kind: "file" | "link" | "note";
    name?: string;
    path?: string;
    url?: string;
    note?: string;
  }) => {
    if (!data?.key) throw new Error("key required");
    if (!(ASSET_KEYS as readonly string[]).includes(data.key)) throw new Error("Unknown asset key");
    if (data.kind === "file" && !data.path) throw new Error("File path required for file uploads");
    if (data.kind === "link" && !data.url) throw new Error("URL required for link submission");
    if (data.kind === "note" && !(data.note && data.note.trim())) throw new Error("Note text required");
    return data;
  })
  .handler(async ({ context, data }): Promise<ClientOnboardingView> => {
    const { row } = await loadForCurrentUser(context);
    if (!row) throw new Error("No onboarding record linked to your account. Contact your project manager.");

    return writeChecklistUpdate(row.id, (prev) => {
      const src = prev.checklist && typeof prev.checklist === "object" ? { ...prev.checklist } : {};
      const subs = { ...(src.__submissions ?? {}) };
      const assetSubs = { ...(subs.assets ?? {}) } as Record<string, AssetSubmission[]>;
      const existing = Array.isArray(assetSubs[data.key]) ? assetSubs[data.key] : [];
      const entry: AssetSubmission = {
        kind: data.kind,
        name: data.name ?? null,
        path: data.kind === "file" ? data.path ?? null : null,
        url: data.kind === "link" ? data.url ?? null : null,
        note: data.note ?? null,
        submitted_at: new Date().toISOString(),
      };
      assetSubs[data.key] = [...existing, entry];
      subs.assets = assetSubs;
      src.__submissions = subs;

      const nextAssets = { ...(prev.assets ?? {}), [data.key]: true };
      const labelBits =
        data.kind === "file"
          ? `file ${data.name ?? data.path}`
          : data.kind === "link"
            ? `link ${data.url}`
            : "note";
      const nextChecklist = appendTimeline(src, {
        ts: entry.submitted_at,
        kind: "update",
        message: `Client submitted asset "${data.key}" (${labelBits})`,
      });
      return { checklist: nextChecklist, assets: nextAssets };
    });
  });

export const submitClientAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { key: string; value: string }) => {
    if (!data?.key) throw new Error("key required");
    if (!(ACCESS_KEYS as readonly string[]).includes(data.key)) throw new Error("Unknown access key");
    if (!data.value || !data.value.trim()) throw new Error("Access details required");
    if (data.value.length > 8000) throw new Error("Access details too long");
    return data;
  })
  .handler(async ({ context, data }): Promise<ClientOnboardingView> => {
    const { row } = await loadForCurrentUser(context);
    if (!row) throw new Error("No onboarding record linked to your account. Contact your project manager.");

    return writeChecklistUpdate(row.id, (prev) => {
      const src = prev.checklist && typeof prev.checklist === "object" ? { ...prev.checklist } : {};
      const subs = { ...(src.__submissions ?? {}) };
      const accessSubs = { ...(subs.access ?? {}) } as Record<string, AccessSubmission[]>;
      const existing = Array.isArray(accessSubs[data.key]) ? accessSubs[data.key] : [];
      const entry: AccessSubmission = {
        note: data.value.trim(),
        submitted_at: new Date().toISOString(),
      };
      accessSubs[data.key] = [...existing, entry];
      subs.access = accessSubs;
      src.__submissions = subs;

      const nextAccess = { ...(prev.access ?? {}), [data.key]: true };
      const nextChecklist = appendTimeline(src, {
        ts: entry.submitted_at,
        kind: "update",
        message: `Client submitted access for "${data.key}"`,
      });
      return { checklist: nextChecklist, access: nextAccess };
    });
  });

export const signClientAssetUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { path: string }) => {
    if (!data?.path) throw new Error("path required");
    return data;
  })
  .handler(async ({ context, data }): Promise<{ url: string }> => {
    if (!data.path.startsWith(`${context.userId}/`)) {
      throw new Error("Not authorized for this file");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await (supabaseAdmin as any).storage
      .from("client-onboarding-assets")
      .createSignedUrl(data.path, 300);
    if (error) throw error;
    return { url: signed.signedUrl };
  });

export const STATUS_LABELS: Record<OnboardingStatus, string> = Object.fromEntries(
  ONBOARDING_STATUSES.map((s) => [s.value, s.label]),
) as Record<OnboardingStatus, string>;
