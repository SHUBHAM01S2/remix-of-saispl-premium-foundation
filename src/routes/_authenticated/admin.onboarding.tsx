import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound, Outlet, useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Plus,
  Trash2,
  ArrowRight,
  Search,
  Handshake,
  Clock3,
  UserCheck,
  Eye,
  Rocket,
  PlayCircle,
  Building2,
  Mail,
  Phone,
  CalendarClock,
  Sparkles,
  Package,
  Layers,
  ShieldCheck,
  UserCog,
  X,
} from "lucide-react";

import { checkIsAdmin } from "@/lib/admin.functions";
import {
  ONBOARDING_STATUSES,
  ASSET_KEYS,
  ACCESS_KEYS,
  CHECKLIST_KEYS,
  createOnboarding,
  deleteOnboarding,
  listOnboarding,
  type OnboardingRow,
  type OnboardingStatus,
} from "@/lib/onboarding-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/onboarding")({
  beforeLoad: async () => {
    const r = await checkIsAdmin();
    if (!r.isAdmin) throw notFound();
    return { admin: r.admin };
  },
  component: OnboardingRoute,
  head: () => ({
    meta: [
      { title: "Client Onboarding — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function OnboardingRoute() {
  const location = useLocation();
  if (location.pathname.replace(/\/$/, "") !== "/admin/onboarding") return <Outlet />;
  return <OnboardingListPage />;
}

type StatusMeta = {
  icon: React.ComponentType<{ className?: string }>;
  chip: string;
  ring: string;
  bar: string;
  glow: string;
  iconBg: string;
};

const STATUS_META: Record<OnboardingStatus, StatusMeta> = {
  pending: {
    icon: Clock3,
    chip: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
    ring: "ring-zinc-500/40",
    bar: "bg-zinc-400",
    glow: "from-zinc-500/10",
    iconBg: "bg-zinc-500/10 text-zinc-300",
  },
  waiting_on_client: {
    icon: UserCheck,
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    ring: "ring-amber-500/40",
    bar: "bg-amber-400",
    glow: "from-amber-500/15",
    iconBg: "bg-amber-500/10 text-amber-300",
  },
  in_review: {
    icon: Eye,
    chip: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    ring: "ring-violet-500/40",
    bar: "bg-violet-400",
    glow: "from-violet-500/15",
    iconBg: "bg-violet-500/10 text-violet-300",
  },
  kickoff_ready: {
    icon: Rocket,
    chip: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    ring: "ring-blue-500/40",
    bar: "bg-blue-400",
    glow: "from-blue-500/15",
    iconBg: "bg-blue-500/10 text-blue-300",
  },
  active_project: {
    icon: PlayCircle,
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    ring: "ring-emerald-500/40",
    bar: "bg-emerald-400",
    glow: "from-emerald-500/15",
    iconBg: "bg-emerald-500/10 text-emerald-300",
  },
};

function calcProgress(row: OnboardingRow) {
  const all = [
    ...ASSET_KEYS.map((k) => !!row.assets?.[k]),
    ...ACCESS_KEYS.map((k) => !!row.access?.[k]),
    ...CHECKLIST_KEYS.map((k) => !!row.checklist?.[k]),
  ];
  const done = all.filter(Boolean).length;
  return { done, total: all.length, pct: Math.round((done / all.length) * 100) };
}

function statusLabel(v: OnboardingStatus) {
  return ONBOARDING_STATUSES.find((s) => s.value === v)?.label ?? v;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OnboardingListPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listOnboarding);
  const createFn = useServerFn(createOnboarding);
  const deleteFn = useServerFn(deleteOnboarding);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | "all">("all");
  const [showCreate, setShowCreate] = useState(false);

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["admin", "onboarding", "list"],
    queryFn: () => listFn(),
  });

  const createMut = useMutation({
    mutationFn: (input: Parameters<typeof createFn>[0]["data"]) => createFn({ data: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "onboarding", "list"] });
      setShowCreate(false);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "onboarding", "list"] }),
  });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        r.company_name.toLowerCase().includes(needle) ||
        (r.contact_person ?? "").toLowerCase().includes(needle) ||
        (r.email ?? "").toLowerCase().includes(needle) ||
        (r.project_manager ?? "").toLowerCase().includes(needle) ||
        (r.project_type ?? "").toLowerCase().includes(needle)
      );
    });
  }, [rows, q, statusFilter]);

  const summary = useMemo(() => {
    const byStatus = Object.fromEntries(
      ONBOARDING_STATUSES.map((s) => [s.value, 0]),
    ) as Record<OnboardingStatus, number>;
    for (const r of rows) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    return byStatus;
  }, [rows]);

  const readyPct = rows.length
    ? Math.round(
        rows.reduce((acc, r) => acc + calcProgress(r).pct, 0) / rows.length,
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--brand)_18%,transparent),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to dashboard
            </Link>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
                <Handshake className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-[2rem]">
                  Client Onboarding
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Track every new client from intake through kickoff — assets, access, and readiness in one place.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 text-right backdrop-blur sm:block">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Avg. readiness
              </p>
              <p className="text-lg font-semibold text-foreground">
                {readyPct}
                <span className="ml-0.5 text-sm text-muted-foreground">%</span>
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground shadow-lg shadow-cta/20 transition-all hover:bg-cta/90 hover:shadow-cta/30"
            >
              <Plus className="h-4 w-4" /> New Client
            </button>
          </div>
        </div>

        {/* Status pipeline */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ONBOARDING_STATUSES.map((s) => {
            const meta = STATUS_META[s.value];
            const Icon = meta.icon;
            const count = summary[s.value] ?? 0;
            const total = rows.length || 1;
            const pct = Math.round((count / total) * 100);
            const active = statusFilter === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setStatusFilter((cur) => (cur === s.value ? "all" : s.value))}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? `border-transparent ring-2 ${meta.ring} bg-card`
                    : "border-border/60 bg-card/70 hover:border-border hover:bg-card"
                }`}
              >
                <div
                  aria-hidden
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${meta.glow} to-transparent opacity-70`}
                />
                <div className="flex items-start justify-between">
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${meta.iconBg}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {pct}%
                  </span>
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                  {count}
                </p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface/70">
                  <div
                    className={`h-full ${meta.bar} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Search / filter bar */}
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-2 backdrop-blur">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search company, contact, email, PM…"
              className="w-full rounded-xl border-0 bg-transparent py-2.5 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-brand/40"
            />
          </div>
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filter <X className="h-3 w-3" />
            </button>
          )}
          <p className="px-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> of {rows.length}
          </p>
        </div>

        {/* Content */}
        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center rounded-2xl border border-border/60 bg-card p-16 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading clients…
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-300">
              {error instanceof Error ? error.message : "Failed to load."}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState onCreate={() => setShowCreate(true)} />
          ) : filtered.length === 0 ? (
            <FilteredEmpty onClear={() => { setQ(""); setStatusFilter("all"); }} />
          ) : (
            <ClientTable
              rows={filtered}
              onDelete={(r) => {
                if (window.confirm(`Delete onboarding for "${r.company_name}"?`))
                  deleteMut.mutate(r.id);
              }}
              deletingId={deleteMut.isPending ? (deleteMut.variables as string) : null}
            />
          )}
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onSubmit={(payload) => createMut.mutate(payload)}
          submitting={createMut.isPending}
          error={createMut.error instanceof Error ? createMut.error.message : null}
        />
      )}
    </div>
  );
}

/* ---------------- Table ---------------- */

function ClientTable({
  rows,
  onDelete,
  deletingId,
}: {
  rows: OnboardingRow[];
  onDelete: (r: OnboardingRow) => void;
  deletingId: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-surface/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 text-left font-semibold">Client</th>
              <th className="px-5 py-3 text-left font-semibold">Contact</th>
              <th className="px-5 py-3 text-left font-semibold">Project</th>
              <th className="px-5 py-3 text-left font-semibold">PM</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold">Completion</th>
              <th className="px-5 py-3 text-left font-semibold">Launch</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {rows.map((r) => {
              const p = calcProgress(r);
              const meta = STATUS_META[r.status];
              const Icon = meta.icon;
              return (
                <tr key={r.id} className="group transition-colors hover:bg-surface/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand/30 to-brand/10 text-xs font-semibold text-brand ring-1 ring-brand/20">
                        {initials(r.company_name)}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-foreground">
                          {r.company_name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Added {formatDate(r.created_at)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-foreground">{r.contact_person ?? "—"}</div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {r.email ?? r.phone ?? "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-foreground">{r.project_type ?? "—"}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {r.package_selected ?? "No package"}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground">
                    {r.project_manager ?? <span className="text-muted-foreground">Unassigned</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${meta.chip}`}
                    >
                      <Icon className="h-3 w-3" />
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface">
                        <div
                          className={`h-full ${meta.bar} transition-all`}
                          style={{ width: `${p.pct}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-xs font-medium text-foreground">
                        {p.pct}%
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {p.done}/{p.total} items
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {formatDate(r.target_launch_date)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/admin/onboarding/$id"
                        params={{ id: r.id }}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand"
                      >
                        Open <ArrowRight className="h-3 w-3" />
                      </Link>
                      <button
                        onClick={() => onDelete(r)}
                        disabled={deletingId === r.id}
                        className="inline-flex items-center rounded-md border border-border/60 bg-background p-1.5 text-red-400 opacity-0 transition-all hover:bg-red-500/10 group-hover:opacity-100"
                        aria-label="Delete"
                      >
                        {deletingId === r.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Empty states ---------------- */

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card to-card/60 px-6 py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_60%_at_50%_0%,color-mix(in_oklab,var(--brand)_22%,transparent),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-md">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-foreground">
          No client onboardings yet
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Start a new record when a client signs up. You'll capture their brand,
          scope, required assets, access, and drive them all the way to a smooth
          kickoff — from a single workspace.
        </p>

        <ul className="mx-auto mt-6 grid max-w-sm grid-cols-1 gap-2 text-left text-xs text-muted-foreground sm:grid-cols-2">
          {[
            "Intake & scope",
            "Assets checklist",
            "Access tracking",
            "Kickoff readiness",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {f}
            </li>
          ))}
        </ul>

        <button
          onClick={onCreate}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground shadow-lg shadow-cta/20 transition-all hover:bg-cta/90"
        >
          <Plus className="h-4 w-4" /> Create First Client Onboarding
        </button>
      </div>
    </div>
  );
}

function FilteredEmpty({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
      <p className="text-sm font-medium text-foreground">No matches</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Try adjusting your search or clearing filters.
      </p>
      <button
        onClick={onClear}
        className="mt-4 inline-flex items-center rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-brand/50"
      >
        Clear filters
      </button>
    </div>
  );
}

/* ---------------- Create modal ---------------- */

type CreatePayload = {
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  project_type?: string;
  package_selected?: string;
  project_manager?: string;
  target_launch_date?: string;
  project_goals?: string;
};

function CreateModal({
  onClose,
  onSubmit,
  submitting,
  error,
}: {
  onClose: () => void;
  onSubmit: (payload: CreatePayload) => void;
  submitting: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<CreatePayload>({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    project_type: "",
    package_selected: "",
    project_manager: "",
    target_launch_date: "",
    project_goals: "",
  });

  const set = <K extends keyof CreatePayload>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-t-3xl border border-border/60 bg-card shadow-2xl sm:rounded-3xl"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(50%_100%_at_50%_0%,color-mix(in_oklab,var(--brand)_25%,transparent),transparent)]"
        />

        <div className="relative flex items-start justify-between px-6 pb-2 pt-6 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/20">
              <Handshake className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">New client onboarding</h2>
              <p className="text-xs text-muted-foreground">
                Capture the essentials. You can complete assets & access next.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.company_name.trim()) return;
            onSubmit(form);
          }}
          className="relative max-h-[75vh] overflow-y-auto px-6 pb-6 sm:px-8"
        >
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Company / brand" required icon={Building2}>
              <input
                required
                value={form.company_name}
                onChange={(e) => set("company_name", e.target.value)}
                placeholder="Acme Studios"
                className={inputCls}
              />
            </Field>
            <Field label="Contact person">
              <input
                value={form.contact_person}
                onChange={(e) => set("contact_person", e.target.value)}
                placeholder="Jane Doe"
                className={inputCls}
              />
            </Field>
            <Field label="Email" icon={Mail}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="jane@acme.com"
                className={inputCls}
              />
            </Field>
            <Field label="Phone number" icon={Phone}>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 98xxx xxxxx"
                className={inputCls}
              />
            </Field>
            <Field label="Project type">
              <input
                value={form.project_type}
                onChange={(e) => set("project_type", e.target.value)}
                placeholder="Website · SEO · Automation…"
                className={inputCls}
              />
            </Field>
            <Field label="Package selected">
              <input
                value={form.package_selected}
                onChange={(e) => set("package_selected", e.target.value)}
                placeholder="Growth · Pro · Custom…"
                className={inputCls}
              />
            </Field>
            <Field label="Assigned project manager">
              <input
                value={form.project_manager}
                onChange={(e) => set("project_manager", e.target.value)}
                placeholder="Assign a PM"
                className={inputCls}
              />
            </Field>
            <Field label="Target launch date" icon={CalendarClock}>
              <input
                type="date"
                value={form.target_launch_date}
                onChange={(e) => set("target_launch_date", e.target.value)}
                className={inputCls}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Project goals / notes">
                <textarea
                  rows={4}
                  value={form.project_goals}
                  onChange={(e) => set("project_goals", e.target.value)}
                  placeholder="What is the client hoping to achieve? Any special requirements from sales handoff…"
                  className={`${inputCls} resize-y`}
                />
              </Field>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !form.company_name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground shadow-lg shadow-cta/20 transition-all hover:bg-cta/90 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand focus:ring-2 focus:ring-brand/20";

function Field({
  label,
  required,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
        {required && <span className="text-red-400">*</span>}
      </span>
      {children}
    </label>
  );
}
