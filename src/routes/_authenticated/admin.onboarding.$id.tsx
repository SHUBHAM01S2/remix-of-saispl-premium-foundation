import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  Loader2,
  Save,
  Trash2,
  User,
  Briefcase,
  ListChecks,
  KeyRound,
  ClipboardCheck,
  StickyNote,
  Clock,
  Building2,
} from "lucide-react";

import { checkIsAdmin } from "@/lib/admin.functions";
import {
  ACCESS_KEYS,
  ASSET_KEYS,
  CHECKLIST_KEYS,
  ONBOARDING_STATUSES,
  deleteOnboarding,
  getOnboarding,
  updateOnboarding,
  type OnboardingRow,
  type OnboardingStatus,
} from "@/lib/onboarding-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/onboarding/$id")({
  beforeLoad: async () => {
    const r = await checkIsAdmin();
    if (!r.isAdmin) throw notFound();
    return { admin: r.admin };
  },
  component: OnboardingDetailPage,
  head: () => ({
    meta: [
      { title: "Client Onboarding — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const ASSET_LABELS: Record<(typeof ASSET_KEYS)[number], string> = {
  logo: "Logo",
  brand_kit: "Brand kit",
  website_content: "Website content",
  images: "Images / photography",
  domain: "Domain",
  hosting_details: "Hosting details",
  social_links: "Social links",
  legal_pages: "Legal pages (privacy, terms)",
};

const ACCESS_LABELS: Record<(typeof ACCESS_KEYS)[number], string> = {
  domain_access: "Domain registrar access",
  hosting_vps: "Hosting / VPS access",
  business_email: "Business email access",
  google_analytics: "Google Analytics",
  search_console: "Search Console",
  meta_access: "Meta (Facebook / Instagram)",
  cal_com: "Cal.com",
  whatsapp_api: "WhatsApp API",
  crm_access: "CRM access",
};

const CHECKLIST_LABELS: Record<(typeof CHECKLIST_KEYS)[number], string> = {
  intake_complete: "Intake form complete",
  scope_confirmed: "Scope confirmed with client",
  assets_received: "All required assets received",
  access_received: "All required access received",
  kickoff_call_scheduled: "Kickoff call scheduled",
};

const STATUS_STYLES: Record<OnboardingStatus, string> = {
  pending: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  waiting_on_client: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  in_review: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  kickoff_ready: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  active_project: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

function OnboardingDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getFn = useServerFn(getOnboarding);
  const updateFn = useServerFn(updateOnboarding);
  const deleteFn = useServerFn(deleteOnboarding);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "onboarding", id],
    queryFn: () => getFn({ data: { id } }),
  });

  const [row, setRow] = useState<OnboardingRow | null>(null);
  useEffect(() => {
    if (data) setRow(data);
  }, [data]);

  const updateMut = useMutation({
    mutationFn: (patch: Partial<OnboardingRow>) => updateFn({ data: { id, patch } }),
    onSuccess: (next) => {
      setRow(next);
      qc.invalidateQueries({ queryKey: ["admin", "onboarding", "list"] });
      qc.setQueryData(["admin", "onboarding", id], next);
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "onboarding", "list"] });
      navigate({ to: "/admin/onboarding" });
    },
  });

  const progress = useMemo(() => {
    if (!row) return { pct: 0, done: 0, total: 0 };
    const all = [
      ...ASSET_KEYS.map((k) => !!row.assets?.[k]),
      ...ACCESS_KEYS.map((k) => !!row.access?.[k]),
      ...CHECKLIST_KEYS.map((k) => !!row.checklist?.[k]),
    ];
    const done = all.filter(Boolean).length;
    return { done, total: all.length, pct: Math.round((done / all.length) * 100) };
  }, [row]);

  if (isLoading) return <PageShell><p className="text-sm text-muted-foreground">Loading…</p></PageShell>;
  if (error) return <PageShell><p className="text-sm text-red-500">{(error as Error).message}</p></PageShell>;
  if (!row) return <PageShell><p className="text-sm text-muted-foreground">Not found.</p></PageShell>;

  const patch = (p: Partial<OnboardingRow>) => setRow({ ...row, ...p });
  const patchGroup = (
    group: "assets" | "access" | "checklist",
    key: string,
    value: boolean,
  ) => setRow({ ...row, [group]: { ...row[group], [key]: value } });

  const save = () => {
    if (!row) return;
    updateMut.mutate({
      company_name: row.company_name,
      contact_person: row.contact_person,
      email: row.email,
      phone: row.phone,
      project_type: row.project_type,
      project_manager: row.project_manager,
      status: row.status,
      project_goals: row.project_goals,
      package_selected: row.package_selected,
      target_launch_date: row.target_launch_date,
      pages_needed: row.pages_needed,
      features_needed: row.features_needed,
      integrations_needed: row.integrations_needed,
      assets: row.assets,
      access: row.access,
      checklist: row.checklist,
      notes: row.notes,
    });
  };

  const kickoffReady =
    row.status === "kickoff_ready" || row.status === "active_project" || progress.pct >= 90;

  return (
    <PageShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/admin/onboarding"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All clients
          </Link>
          <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground">
            <Building2 className="h-7 w-7 text-brand" />
            {row.company_name || "Untitled client"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Updated {new Date(row.updated_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm("Delete this onboarding record?")) deleteMut.mutate();
            }}
            disabled={deleteMut.isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
          <button
            onClick={save}
            disabled={updateMut.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
          >
            {updateMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </div>

      {/* Overview */}
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Onboarding progress
              </p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {progress.pct}%
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {progress.done} of {progress.total} items
                </span>
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                kickoffReady
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              }`}
            >
              {kickoffReady ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              {kickoffReady ? "Kickoff ready" : "In progress"}
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full bg-gradient-to-r from-brand to-emerald-400 transition-all"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            <MiniStat
              label="Assets"
              done={ASSET_KEYS.filter((k) => row.assets?.[k]).length}
              total={ASSET_KEYS.length}
            />
            <MiniStat
              label="Access"
              done={ACCESS_KEYS.filter((k) => row.access?.[k]).length}
              total={ACCESS_KEYS.length}
            />
            <MiniStat
              label="Checklist"
              done={CHECKLIST_KEYS.filter((k) => row.checklist?.[k]).length}
              total={CHECKLIST_KEYS.length}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Current status</p>
          <select
            value={row.status}
            onChange={(e) => patch({ status: e.target.value as OnboardingStatus })}
            className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {ONBOARDING_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="mt-3">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[row.status]}`}
            >
              {ONBOARDING_STATUSES.find((s) => s.value === row.status)?.label}
            </span>
          </div>
        </div>
      </section>

      {/* 1. Client Profile */}
      <SectionCard icon={User} title="Client Profile" subtitle="Who is the client?">
        <Grid cols={2}>
          <Field label="Company name *">
            <input
              value={row.company_name}
              onChange={(e) => patch({ company_name: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              required
            />
          </Field>
          <Field label="Contact person">
            <input
              value={row.contact_person ?? ""}
              onChange={(e) => patch({ contact_person: e.target.value || null })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={row.email ?? ""}
              onChange={(e) => patch({ email: e.target.value || null })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Phone">
            <input
              value={row.phone ?? ""}
              onChange={(e) => patch({ phone: e.target.value || null })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Project type">
            <input
              value={row.project_type ?? ""}
              onChange={(e) => patch({ project_type: e.target.value || null })}
              placeholder="Website, SEO, automation…"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Assigned project manager">
            <input
              value={row.project_manager ?? ""}
              onChange={(e) => patch({ project_manager: e.target.value || null })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
        </Grid>
      </SectionCard>

      {/* 2. Project Scope / Intake */}
      <SectionCard icon={Briefcase} title="Project Scope" subtitle="What did they buy?">
        <Grid cols={2}>
          <Field label="Package selected">
            <input
              value={row.package_selected ?? ""}
              onChange={(e) => patch({ package_selected: e.target.value || null })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Target launch date">
            <input
              type="date"
              value={row.target_launch_date ?? ""}
              onChange={(e) => patch({ target_launch_date: e.target.value || null })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Project goals" full>
            <textarea
              value={row.project_goals ?? ""}
              onChange={(e) => patch({ project_goals: e.target.value || null })}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Pages needed">
            <textarea
              value={row.pages_needed ?? ""}
              onChange={(e) => patch({ pages_needed: e.target.value || null })}
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Features needed">
            <textarea
              value={row.features_needed ?? ""}
              onChange={(e) => patch({ features_needed: e.target.value || null })}
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Integrations needed" full>
            <textarea
              value={row.integrations_needed ?? ""}
              onChange={(e) => patch({ integrations_needed: e.target.value || null })}
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
        </Grid>
      </SectionCard>

      {/* 3. Assets */}
      <SectionCard
        icon={ListChecks}
        title="Assets Needed"
        subtitle="What is still missing from the client?"
      >
        <ChecklistGrid
          items={ASSET_KEYS}
          labels={ASSET_LABELS}
          state={row.assets}
          onToggle={(k, v) => patchGroup("assets", k, v)}
        />
      </SectionCard>

      {/* 4. Access */}
      <SectionCard
        icon={KeyRound}
        title="Access Needed"
        subtitle="Credentials & platform access required for delivery"
      >
        <ChecklistGrid
          items={ACCESS_KEYS}
          labels={ACCESS_LABELS}
          state={row.access}
          onToggle={(k, v) => patchGroup("access", k, v)}
        />
      </SectionCard>

      {/* 5. Onboarding checklist */}
      <SectionCard
        icon={ClipboardCheck}
        title="Onboarding Checklist"
        subtitle="Is the project kickoff-ready?"
      >
        <ChecklistGrid
          items={CHECKLIST_KEYS}
          labels={CHECKLIST_LABELS}
          state={row.checklist}
          onToggle={(k, v) => patchGroup("checklist", k, v)}
        />
      </SectionCard>

      {/* Notes */}
      <SectionCard icon={StickyNote} title="Notes / Handoff">
        <textarea
          value={row.notes ?? ""}
          onChange={(e) => patch({ notes: e.target.value || null })}
          rows={5}
          placeholder="Anything the delivery team should know before kickoff…"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </SectionCard>

      {/* Status Timeline */}
      <SectionCard icon={Clock} title="Status Timeline">
        <ol className="relative border-l border-border/60 pl-6">
          {ONBOARDING_STATUSES.map((s, i) => {
            const currentIdx = ONBOARDING_STATUSES.findIndex((x) => x.value === row.status);
            const reached = i <= currentIdx;
            return (
              <li key={s.value} className="mb-6 last:mb-0">
                <span
                  className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border ${
                    reached
                      ? "bg-brand border-brand"
                      : "bg-background border-border"
                  }`}
                >
                  {reached && <Check className="h-3 w-3 text-brand-foreground" />}
                </span>
                <p className={`text-sm font-medium ${reached ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </p>
              </li>
            );
          })}
        </ol>
      </SectionCard>

      <div className="mt-8 flex justify-end">
        <button
          onClick={save}
          disabled={updateMut.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
        >
          {updateMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>
      {updateMut.error && (
        <p className="mt-3 text-right text-xs text-red-500">
          {(updateMut.error as Error).message}
        </p>
      )}
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] bg-background px-4 py-12">
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
      <header className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function Grid({ cols, children }: { cols: 2 | 3; children: React.ReactNode }) {
  return <div className={`grid gap-4 ${cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>{children}</div>;
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ChecklistGrid<K extends string>({
  items,
  labels,
  state,
  onToggle,
}: {
  items: readonly K[];
  labels: Record<K, string>;
  state: Record<string, boolean>;
  onToggle: (key: K, value: boolean) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((k) => {
        const done = !!state?.[k];
        return (
          <button
            key={k}
            type="button"
            onClick={() => onToggle(k, !done)}
            className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
              done
                ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                : "border-border/60 bg-background hover:border-border"
            }`}
          >
            {done ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className={done ? "" : "text-muted-foreground group-hover:text-foreground"}>
              {labels[k]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MiniStat({ label, done, total }: { label: string; done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-border/60 bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {done}/{total}
      </p>
      <p className="text-[10px] text-muted-foreground">{pct}%</p>
    </div>
  );
}
