import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound, Outlet, useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, ArrowRight, Search } from "lucide-react";

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


const STATUS_STYLES: Record<OnboardingStatus, string> = {
  pending: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  waiting_on_client: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  in_review: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  kickoff_ready: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  active_project: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
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

function OnboardingListPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listOnboarding);
  const createFn = useServerFn(createOnboarding);
  const deleteFn = useServerFn(deleteOnboarding);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | "all">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ["admin", "onboarding", "list"],
    queryFn: () => listFn(),
  });

  const createMut = useMutation({
    mutationFn: (input: { company_name: string; contact_person?: string; email?: string }) =>
      createFn({ data: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "onboarding", "list"] });
      setNewCompany("");
      setNewContact("");
      setNewEmail("");
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
        (r.email ?? "").toLowerCase().includes(needle)
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

  return (
    <div className="min-h-[80vh] bg-background px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground">
              ← Back to dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              Client Onboarding
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track every new client from intake through kickoff.
            </p>
          </div>
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            <Plus className="h-4 w-4" /> New Client
          </button>
        </div>

        {/* Status pipeline */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ONBOARDING_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() =>
                setStatusFilter((cur) => (cur === s.value ? "all" : s.value))
              }
              className={`rounded-2xl border p-4 text-left transition-colors ${
                statusFilter === s.value
                  ? "border-brand bg-brand/10"
                  : "border-border/60 bg-card hover:border-border"
              }`}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">{summary[s.value] ?? 0}</p>
            </button>
          ))}
        </div>

        {showCreate && (
          <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">Create a client onboarding</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCompany.trim()) return;
                createMut.mutate({
                  company_name: newCompany,
                  contact_person: newContact || undefined,
                  email: newEmail || undefined,
                });
              }}
              className="mt-4 grid gap-3 sm:grid-cols-3"
            >
              <input
                placeholder="Company / brand *"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                required
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                placeholder="Contact person"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                placeholder="Email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <div className="sm:col-span-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMut.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
                >
                  {createMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create
                </button>
              </div>
              {createMut.error && (
                <p className="sm:col-span-3 text-xs text-red-500">
                  {(createMut.error as Error).message}
                </p>
              )}
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by company, contact, email…"
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {rows.length}
          </p>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card">
          {isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="p-6 text-sm text-red-500">
              {error instanceof Error ? error.message : "Failed to load."}
            </p>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No clients yet. Click <span className="text-foreground">New Client</span> to start.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Client</th>
                  <th className="px-4 py-3 text-left font-medium">Contact</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Progress</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((r) => {
                  const p = calcProgress(r);
                  return (
                    <tr key={r.id} className="hover:bg-surface/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{r.company_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.project_type ?? "—"} · Created{" "}
                          {new Date(r.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-foreground">{r.contact_person ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{r.email ?? "—"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}
                        >
                          {statusLabel(r.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface">
                            <div
                              className="h-full bg-brand transition-all"
                              style={{ width: `${p.pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{p.pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to="/admin/onboarding/$id"
                            params={{ id: r.id }}
                            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                          >
                            Open <ArrowRight className="h-3 w-3" />
                          </Link>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete onboarding for "${r.company_name}"?`))
                                deleteMut.mutate(r.id);
                            }}
                            disabled={deleteMut.isPending}
                            className="inline-flex items-center rounded-md border border-input bg-background p-1.5 text-xs text-red-400 hover:bg-red-500/10"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
