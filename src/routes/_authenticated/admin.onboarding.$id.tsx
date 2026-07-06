import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Loader2,
  Pencil,
  Plus,
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
  X,
  AlertTriangle,
  MessageSquare,
  ArrowUpRight,
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
  type CustomChecklistItem,
  type OnboardingRow,
  type OnboardingStatus,
} from "@/lib/onboarding-admin.functions";
import { getOnboardingAccessSubmissions } from "@/lib/onboarding-admin.functions";
import { getRecentMessagesForAdmin, type ConversationStatus } from "@/lib/messages.functions";

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

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");

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
      ...row.custom_checklist.map((i) => i.done),
    ];
    const done = all.filter(Boolean).length;
    const total = all.length || 1;
    return { done, total: all.length, pct: Math.round((done / total) * 100) };
  }, [row]);

  if (isLoading) return <PageShell><p className="text-sm text-muted-foreground">Loading…</p></PageShell>;
  if (error) return <PageShell><p className="text-sm text-red-500">{(error as Error).message}</p></PageShell>;
  if (!row) return <PageShell><p className="text-sm text-muted-foreground">Not found.</p></PageShell>;

  const patch = (p: Partial<OnboardingRow>) => setRow({ ...row, ...p });
  const patchGroup = (
    group: "assets" | "access",
    key: string,
    value: boolean,
  ) => setRow({ ...row, [group]: { ...row[group], [key]: value } });

  // Toggling checklist items writes through the server immediately so the
  // timeline captures the change chronologically.
  const toggleStandardChecklist = (key: string, value: boolean) => {
    updateMut.mutate({ checklist: { ...row.checklist, [key]: value } });
  };

  const toggleCustomItem = (itemId: string, value: boolean) => {
    const next = row.custom_checklist.map((i) => (i.id === itemId ? { ...i, done: value } : i));
    updateMut.mutate({ custom_checklist: next });
  };

  const addCustomItem = () => {
    const label = newItemLabel.trim();
    if (!label) return;
    const next: CustomChecklistItem[] = [
      ...row.custom_checklist,
      { id: crypto.randomUUID(), label, done: false },
    ];
    setNewItemLabel("");
    updateMut.mutate({ custom_checklist: next });
  };

  const removeCustomItem = (itemId: string) => {
    const next = row.custom_checklist.filter((i) => i.id !== itemId);
    updateMut.mutate({ custom_checklist: next });
  };

  const changeStatus = (status: OnboardingStatus) => {
    if (status === row.status) return;
    updateMut.mutate({ status });
  };

  const saveAll = (overrides?: Partial<OnboardingRow>) => {
    const base = { ...row, ...(overrides ?? {}) };
    updateMut.mutate({
      company_name: base.company_name,
      contact_person: base.contact_person,
      email: base.email,
      phone: base.phone,
      project_type: base.project_type,
      project_manager: base.project_manager,
      status: base.status,
      project_goals: base.project_goals,
      package_selected: base.package_selected,
      target_launch_date: base.target_launch_date,
      pages_needed: base.pages_needed,
      features_needed: base.features_needed,
      integrations_needed: base.integrations_needed,
      assets: base.assets,
      access: base.access,
      notes: base.notes,
    });
  };

  const kickoffReady =
    row.status === "kickoff_ready" || row.status === "active_project" || progress.pct >= 90;

  const currentIdx = ONBOARDING_STATUSES.findIndex((s) => s.value === row.status);
  const prevStatus = currentIdx > 0 ? ONBOARDING_STATUSES[currentIdx - 1] : null;
  const nextStatus =
    currentIdx >= 0 && currentIdx < ONBOARDING_STATUSES.length - 1
      ? ONBOARDING_STATUSES[currentIdx + 1]
      : null;

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
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground hover:bg-surface"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
          <button
            onClick={() => saveAll()}
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
          <div className="mt-6 grid grid-cols-4 gap-3 text-center text-xs">
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
            <MiniStat
              label="Custom"
              done={row.custom_checklist.filter((i) => i.done).length}
              total={row.custom_checklist.length}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Current status</p>
          <div className="mt-3">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[row.status]}`}
            >
              {ONBOARDING_STATUSES.find((s) => s.value === row.status)?.label}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => prevStatus && changeStatus(prevStatus.value)}
              disabled={!prevStatus || updateMut.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {prevStatus ? `Back to ${prevStatus.label}` : "Start"}
            </button>
            <button
              onClick={() => nextStatus && changeStatus(nextStatus.value)}
              disabled={!nextStatus || updateMut.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-brand-foreground hover:bg-brand/90 disabled:opacity-40"
            >
              {nextStatus ? `Advance to ${nextStatus.label}` : "At final stage"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Status transition rail */}
      <section className="mt-6 rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          {ONBOARDING_STATUSES.map((s, i) => {
            const isCurrent = s.value === row.status;
            const isReached = i <= currentIdx;
            return (
              <button
                key={s.value}
                onClick={() => changeStatus(s.value)}
                disabled={updateMut.isPending || isCurrent}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isCurrent
                    ? STATUS_STYLES[s.value] + " ring-2 ring-brand/40"
                    : isReached
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300 hover:bg-emerald-500/10"
                    : "border-border/60 bg-background text-muted-foreground hover:text-foreground hover:border-border"
                } disabled:cursor-not-allowed`}
              >
                {isReached ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                {s.label}
              </button>
            );
          })}
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

      {/* 4b. Client-submitted credentials (decrypted admin-only) */}
      <ClientAccessSubmissions id={row.id} labels={ACCESS_LABELS} />



      {/* 5. Onboarding checklist (standard, writes-through) */}
      <SectionCard
        icon={ClipboardCheck}
        title="Onboarding Checklist"
        subtitle="Toggles save immediately and update the timeline"
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {CHECKLIST_KEYS.map((k) => {
            const done = !!row.checklist?.[k];
            return (
              <button
                key={k}
                type="button"
                onClick={() => toggleStandardChecklist(k, !done)}
                disabled={updateMut.isPending}
                className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-70 ${
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
                  {CHECKLIST_LABELS[k]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom checklist */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Custom checklist ({row.custom_checklist.filter((i) => i.done).length}/{row.custom_checklist.length})
            </p>
          </div>
          <div className="space-y-2">
            {row.custom_checklist.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No custom items yet. Add project-specific tasks below.
              </p>
            )}
            {row.custom_checklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                  item.done
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-border/60 bg-background"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleCustomItem(item.id, !item.done)}
                  disabled={updateMut.isPending}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => removeCustomItem(item.id)}
                  disabled={updateMut.isPending}
                  className="text-muted-foreground hover:text-red-400"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomItem();
                }
              }}
              placeholder="Add a custom checklist item…"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={addCustomItem}
              disabled={updateMut.isPending || !newItemLabel.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
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

      {/* Messages preview — quick view of latest thread */}
      <MessagesCard onboardingId={row.id} />

      {/* Status Timeline */}

      <SectionCard icon={Clock} title="Status Timeline" subtitle="Auto-updated when status or checklist items change">
        {row.timeline.length === 0 ? (
          <p className="text-xs text-muted-foreground">No activity yet.</p>
        ) : (
          <ol className="relative border-l border-border/60 pl-6">
            {[...row.timeline].reverse().map((entry, i) => (
              <li key={i} className="mb-5 last:mb-0">
                <span
                  className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border ${
                    entry.kind === "status"
                      ? "bg-brand border-brand"
                      : entry.kind === "created"
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-background border-border"
                  }`}
                >
                  {(entry.kind === "status" || entry.kind === "created") && (
                    <Check className="h-3 w-3 text-brand-foreground" />
                  )}
                </span>
                <p className="text-sm font-medium text-foreground">{entry.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.ts).toLocaleString()}
                  <span className="ml-2 inline-flex items-center rounded-full border border-border/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {entry.kind}
                  </span>
                </p>
              </li>
            ))}
          </ol>
        )}
      </SectionCard>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => saveAll()}
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

      {editOpen && (
        <EditModal
          row={row}
          isSaving={updateMut.isPending}
          error={updateMut.error as Error | null}
          onClose={() => setEditOpen(false)}
          onSave={(overrides) => {
            saveAll(overrides);
            setEditOpen(false);
          }}
        />
      )}

      {deleteOpen && (
        <DeleteDialog
          row={row}
          isDeleting={deleteMut.isPending}
          error={deleteMut.error as Error | null}
          progressPct={progress.pct}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={() => deleteMut.mutate()}
        />
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

const CONV_STATUS_STYLES: Record<ConversationStatus, string> = {
  unread: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  waiting_on_team: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  waiting_on_client: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const CONV_STATUS_LABEL: Record<ConversationStatus, string> = {
  unread: "Unread",
  waiting_on_team: "Waiting on Team",
  waiting_on_client: "Waiting on Client",
  resolved: "Resolved",
};

function MessagesCard({ onboardingId }: { onboardingId: string }) {
  const getFn = useServerFn(getRecentMessagesForAdmin);
  const q = useQuery({
    queryKey: ["admin", "onboarding", onboardingId, "messages-preview"],
    queryFn: () => getFn({ data: { onboarding_id: onboardingId, limit: 5 } }),
    refetchInterval: 15000,
  });

  const data = q.data;
  return (
    <SectionCard icon={MessageSquare} title="Messages" subtitle="Latest chat with this client">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {data && (
            <>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${CONV_STATUS_STYLES[data.conversation_status]}`}
              >
                {CONV_STATUS_LABEL[data.conversation_status]}
              </span>
              {data.assignee_name && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                  <User className="h-3 w-3" /> {data.assignee_name}
                </span>
              )}
              {data.unread_for_admin > 0 && (
                <span className="inline-flex items-center rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-brand-foreground">
                  {data.unread_for_admin} unread
                </span>
              )}
            </>
          )}
        </div>
        <Link
          to="/admin/inbox"
          search={{ thread: onboardingId }}
          className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Open conversation <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {q.isLoading ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : !data || data.messages.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No messages yet. Open the inbox to start the conversation.
        </p>
      ) : (
        <ul className="divide-y divide-border/40 rounded-xl border border-border/40 bg-background/30">
          {data.messages.map((m) => (
            <li key={m.id} className="flex items-start gap-3 px-3 py-2.5">
              <span
                className={`mt-1 inline-block h-2 w-2 shrink-0 rounded-full ${
                  m.is_internal
                    ? "bg-amber-400"
                    : m.sender_role === "client"
                    ? "bg-sky-400"
                    : "bg-brand"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {m.sender_name ?? (m.sender_role === "client" ? "Client" : "Team")}
                  </span>
                  {m.is_internal && (
                    <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-amber-300">
                      Internal
                    </span>
                  )}
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm text-foreground">
                  {m.body || (m.attachments.length ? `📎 ${m.attachments.length} attachment(s)` : "—")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
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

function EditModal({
  row,
  isSaving,
  error,
  onClose,
  onSave,
}: {
  row: OnboardingRow;
  isSaving: boolean;
  error: Error | null;
  onClose: () => void;
  onSave: (overrides: Partial<OnboardingRow>) => void;
}) {
  const [draft, setDraft] = useState<OnboardingRow>(row);
  const set = <K extends keyof OnboardingRow>(k: K, v: OnboardingRow[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Edit Client Onboarding</h2>
            <p className="text-xs text-muted-foreground">
              Update details — changes reflect instantly across the workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name *">
            <input
              value={draft.company_name}
              onChange={(e) => set("company_name", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Contact person">
            <input
              value={draft.contact_person ?? ""}
              onChange={(e) => set("contact_person", (e.target.value || null) as any)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={draft.email ?? ""}
              onChange={(e) => set("email", (e.target.value || null) as any)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Phone">
            <input
              value={draft.phone ?? ""}
              onChange={(e) => set("phone", (e.target.value || null) as any)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Project type">
            <input
              value={draft.project_type ?? ""}
              onChange={(e) => set("project_type", (e.target.value || null) as any)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Project manager">
            <input
              value={draft.project_manager ?? ""}
              onChange={(e) => set("project_manager", (e.target.value || null) as any)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Package selected">
            <input
              value={draft.package_selected ?? ""}
              onChange={(e) => set("package_selected", (e.target.value || null) as any)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Target launch date">
            <input
              type="date"
              value={draft.target_launch_date ?? ""}
              onChange={(e) => set("target_launch_date", (e.target.value || null) as any)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Status">
            <select
              value={draft.status}
              onChange={(e) => set("status", e.target.value as OnboardingStatus)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {ONBOARDING_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Project goals" full>
            <textarea
              value={draft.project_goals ?? ""}
              onChange={(e) => set("project_goals", (e.target.value || null) as any)}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Pages needed">
            <textarea
              value={draft.pages_needed ?? ""}
              onChange={(e) => set("pages_needed", (e.target.value || null) as any)}
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Features needed">
            <textarea
              value={draft.features_needed ?? ""}
              onChange={(e) => set("features_needed", (e.target.value || null) as any)}
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Integrations needed" full>
            <textarea
              value={draft.integrations_needed ?? ""}
              onChange={(e) => set("integrations_needed", (e.target.value || null) as any)}
              rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Notes" full>
            <textarea
              value={draft.notes ?? ""}
              onChange={(e) => set("notes", (e.target.value || null) as any)}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
        </div>

        {error && <p className="mt-3 text-xs text-red-500">{error.message}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving || !draft.company_name.trim()}
            onClick={() => onSave(draft)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteDialog({
  row,
  isDeleting,
  error,
  progressPct,
  onCancel,
  onConfirm,
}: {
  row: OnboardingRow;
  isDeleting: boolean;
  error: Error | null;
  progressPct: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState("");
  const confirmMatch = typed.trim() === row.company_name.trim();
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">Delete onboarding record?</h2>
            <p className="text-xs text-muted-foreground">
              This permanently removes the client onboarding workspace. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-border/60 bg-background p-3 text-sm">
          <p className="font-semibold text-foreground">{row.company_name}</p>
          <dl className="mt-2 grid grid-cols-2 gap-y-1 text-xs text-muted-foreground">
            <dt>Contact</dt>
            <dd className="text-foreground">{row.contact_person || "—"}</dd>
            <dt>Status</dt>
            <dd className="text-foreground">
              {ONBOARDING_STATUSES.find((s) => s.value === row.status)?.label}
            </dd>
            <dt>Package</dt>
            <dd className="text-foreground">{row.package_selected || "—"}</dd>
            <dt>Progress</dt>
            <dd className="text-foreground">{progressPct}%</dd>
            <dt>Created</dt>
            <dd className="text-foreground">{new Date(row.created_at).toLocaleDateString()}</dd>
          </dl>
        </div>

        <label className="block text-xs text-muted-foreground">
          Type <span className="font-mono text-foreground">{row.company_name}</span> to confirm
        </label>
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          autoFocus
        />

        {error && <p className="mt-3 text-xs text-red-500">{error.message}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting || !confirmMatch}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500/90 disabled:opacity-40"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete record
          </button>
        </div>
      </div>
    </div>
  );
}

function ClientAccessSubmissions({
  id,
  labels,
}: {
  id: string;
  labels: Record<string, string>;
}) {
  const fetchSubs = useServerFn(getOnboardingAccessSubmissions);
  const q = useQuery({
    queryKey: ["onboarding-access-submissions", id],
    queryFn: () => fetchSubs({ data: { id } }),
  });
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const rows = q.data ?? [];

  return (
    <SectionCard
      icon={KeyRound}
      title="Client-submitted credentials"
      subtitle="Encrypted at rest (AES-256-GCM). Only visible to admins."
    >
      {q.isLoading && (
        <p className="text-xs text-muted-foreground">Loading submissions…</p>
      )}
      {q.error && (
        <p className="text-xs text-red-400">
          Failed to load: {(q.error as Error).message}
        </p>
      )}
      {!q.isLoading && rows.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No credentials submitted yet.
        </p>
      )}
      {rows.length > 0 && (
        <ul className="space-y-2">
          {rows.map((r, i) => {
            const show = !!revealed[i];
            return (
              <li
                key={i}
                className="rounded-lg border border-border/60 bg-background/40 p-3 text-sm"
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="font-medium">{labels[r.key] ?? r.key}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.submitted_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <pre className="min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-xs text-muted-foreground">
                    {show
                      ? r.plaintext ?? "(unable to decrypt)"
                      : "•••••••• hidden"}
                  </pre>
                  <button
                    type="button"
                    onClick={() => setRevealed((s) => ({ ...s, [i]: !s[i] }))}
                    className="shrink-0 rounded-md border border-border/60 px-2 py-1 text-xs hover:bg-accent/40"
                  >
                    {show ? "Hide" : "Reveal"}
                  </button>
                </div>
                {!r.encrypted && (
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-amber-400">
                    Legacy plaintext entry — pre-encryption
                  </p>
                )}
                {r.error && (
                  <p className="mt-1 text-[10px] text-red-400">{r.error}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
