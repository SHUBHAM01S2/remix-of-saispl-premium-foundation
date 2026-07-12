import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Download, Filter, Clock, AlertTriangle, X, TrendingUp, MoreHorizontal,
  Eye, Pencil, ArrowRight, CheckCircle2, XCircle, Bookmark, BookmarkPlus, Trash2,
  Users, Target, Trophy, Ban, Flame,
} from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  adminListReferrals, adminUpdateReferral, REFERRAL_STATUSES,
  type ReferralStatus, type ReferralDealStage,
} from "@/lib/partners.functions";
import {
  fmtDate, fmtDateTime, fmtMoney, StatusChip, PayoutChip,
  STATUS_LABEL, STATUS_DOT, STAGE_LABEL,
} from "@/lib/partners-ui";

export const Route = createFileRoute("/_authenticated/admin/affiliates/referrals")({
  beforeLoad: async () => { const r = await checkIsAdmin(); if (!r.isAdmin) throw notFound(); return {}; },
  component: AllReferralsPage,
  head: () => ({ meta: [{ title: "All Referrals — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

const STALL_DAYS = 14;
const STALL_MS = STALL_DAYS * 24 * 60 * 60 * 1000;
const OPEN_STATUSES = new Set<ReferralStatus>(["new", "contacted", "in_discussion", "onboarding"]);
const SAVED_KEY = "admin.referrals.savedFilters.v1";

type Filters = {
  search: string;
  status: ReferralStatus | "";
  partnerId: string;
  pkg: string;
  from: string;
  to: string;
  minValue: string;
  maxValue: string;
  stalledOnly: boolean;
};
const EMPTY: Filters = {
  search: "", status: "", partnerId: "", pkg: "", from: "", to: "",
  minValue: "", maxValue: "", stalledOnly: false,
};

function AllReferralsPage() {
  const fn = useServerFn(adminListReferrals);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "referrals"], queryFn: () => fn() });

  const updateFn = useServerFn(adminUpdateReferral);
  const update = useMutation({
    mutationFn: (v: Parameters<typeof adminUpdateReferral>[0]["data"]) => updateFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "referrals"] }),
  });

  const [f, setF] = useState<Filters>(EMPTY);
  const patch = (p: Partial<Filters>) => setF((s) => ({ ...s, ...p }));

  // saved filters
  const [saved, setSaved] = useState<{ name: string; filters: Filters }[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {}
  }, []);
  const persistSaved = (next: { name: string; filters: Filters }[]) => {
    setSaved(next); try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch {}
  };

  const all = q.data ?? [];

  const partners = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of all) if (r.partner) seen.set(r.partner.id, r.partner.full_name);
    return Array.from(seen.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [all]);
  const packages = useMemo(
    () => Array.from(new Set(all.map((r) => r.package_selected).filter(Boolean) as string[])).sort(),
    [all]
  );

  const now = Date.now();
  const isStalled = (r: any) => {
    if (!OPEN_STATUSES.has(r.status)) return false;
    const ts = new Date(r.last_activity_at ?? r.created_at).getTime();
    return now - ts > STALL_MS;
  };

  const rows = useMemo(() => {
    const s = f.search.trim().toLowerCase();
    const mn = f.minValue ? Number(f.minValue) : null;
    const mx = f.maxValue ? Number(f.maxValue) : null;
    return all.filter((r) => {
      if (f.status && r.status !== f.status) return false;
      if (f.partnerId && r.partner_id !== f.partnerId) return false;
      if (f.pkg && r.package_selected !== f.pkg) return false;
      if (f.from && r.referral_date < f.from) return false;
      if (f.to && r.referral_date > f.to) return false;
      if (mn !== null && Number(r.deal_value ?? 0) < mn) return false;
      if (mx !== null && Number(r.deal_value ?? 0) > mx) return false;
      if (f.stalledOnly && !isStalled(r)) return false;
      if (!s) return true;
      return (
        r.client_name.toLowerCase().includes(s) ||
        r.id.toLowerCase().includes(s) ||
        (r.company ?? "").toLowerCase().includes(s) ||
        (r.email ?? "").toLowerCase().includes(s) ||
        (r.partner?.full_name ?? "").toLowerCase().includes(s)
      );
    });
  }, [all, f]);

  // summary across ALL referrals (not filtered)
  const summary = useMemo(() => {
    const total = all.length;
    const active = all.filter((r) => OPEN_STATUSES.has(r.status));
    const won = all.filter((r) => r.status === "won");
    const lost = all.filter((r) => r.status === "lost");
    const stalled = all.filter(isStalled);
    const activeValue = active.reduce((s, r) => s + Number(r.deal_value ?? 0), 0);
    const wonValue = won.reduce((s, r) => s + Number(r.deal_value ?? 0), 0);
    return {
      total, activeCount: active.length, wonCount: won.length, lostCount: lost.length,
      stalledCount: stalled.length, activeValue, wonValue,
    };
  }, [all]);

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { "": all.length };
    for (const r of all) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [all]);

  const exportCsv = () => {
    const headers = ["ID","Date","Client","Company","Email","Phone","Service","Package","Partner","Status","Stage","Deal","Commission","Payout","LastUpdated"];
    const lines = [headers.join(",")];
    for (const r of rows) {
      const row = [r.id, r.referral_date, r.client_name, r.company ?? "", r.email ?? "", r.phone ?? "",
        r.service_interested ?? "", r.package_selected ?? "", r.partner?.full_name ?? "",
        r.status, r.deal_stage, r.deal_value ?? "", r.commission_amount ?? "", r.payout_status,
        r.updated_at ?? ""];
      lines.push(row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `referrals-${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const anyFilter = f.search || f.status || f.partnerId || f.pkg || f.from || f.to ||
    f.minValue || f.maxValue || f.stalledOnly;
  const clearFilters = () => setF(EMPTY);

  const saveCurrent = () => {
    const name = prompt("Name this view (e.g. 'Stalled high-value')")?.trim();
    if (!name) return;
    persistSaved([{ name, filters: f }, ...saved.filter((s) => s.name !== name)].slice(0, 8));
  };

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [preview, setPreview] = useState<any | null>(null);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">All Referrals</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Referral operations across every partner. Filter, triage, and progress deals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={saveCurrent} disabled={!anyFilter}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40">
            <BookmarkPlus className="h-3.5 w-3.5" /> Save view
          </button>
          <button onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200">
            <Download className="h-3.5 w-3.5" /> Export ({rows.length})
          </button>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Main column */}
        <div className="space-y-4 min-w-0">
          {/* Status chip strip */}
          <div className="flex flex-wrap items-center gap-1.5">
            <ChipTab
              active={f.status === ""} onClick={() => patch({ status: "" })}
              label="All" count={statusCounts[""] ?? 0} dot="bg-muted-foreground"
            />
            {REFERRAL_STATUSES.map((s) => (
              <ChipTab key={s.value}
                active={f.status === s.value}
                onClick={() => patch({ status: f.status === s.value ? "" : s.value })}
                label={STATUS_LABEL[s.value]}
                count={statusCounts[s.value] ?? 0}
                dot={STATUS_DOT[s.value]}
              />
            ))}
            <ChipTab
              active={f.stalledOnly}
              onClick={() => patch({ stalledOnly: !f.stalledOnly })}
              label="Needs attention" count={summary.stalledCount}
              dot="bg-amber-400"
              tone="amber"
              icon={<AlertTriangle className="h-3 w-3" />}
            />
          </div>

          {/* Filter bar */}
          <div className="space-y-2.5 rounded-2xl border border-border/60 bg-card/40 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={f.search} onChange={(e) => patch({ search: e.target.value })}
                  placeholder="Search referral ID, lead, company, partner, email…"
                  className="w-full rounded-lg border border-border/70 bg-background/40 pl-9 pr-3 py-2 text-sm outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20" />
              </div>
              {anyFilter && (
                <button onClick={clearFilters}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Filter className="h-3 w-3" /> Refine
              </div>
              <select value={f.partnerId} onChange={(e) => patch({ partnerId: e.target.value })} className={fsel}>
                <option value="">All partners</option>
                {partners.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
              <select value={f.pkg} onChange={(e) => patch({ pkg: e.target.value })} className={fsel}>
                <option value="">All packages</option>
                {packages.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                From <input type="date" value={f.from} onChange={(e) => patch({ from: e.target.value })} className={fsel} />
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                To <input type="date" value={f.to} onChange={(e) => patch({ to: e.target.value })} className={fsel} />
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                Deal ₹
                <input type="number" min={0} value={f.minValue} placeholder="min"
                  onChange={(e) => patch({ minValue: e.target.value })}
                  className={`${fsel} w-20`} />
                <span className="text-muted-foreground/60">–</span>
                <input type="number" min={0} value={f.maxValue} placeholder="max"
                  onChange={(e) => patch({ maxValue: e.target.value })}
                  className={`${fsel} w-20`} />
              </label>
            </div>

            {saved.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Bookmark className="h-3 w-3" /> Saved
                </span>
                {saved.map((v) => (
                  <span key={v.name} className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/40 px-2 py-0.5 text-[11px]">
                    <button onClick={() => setF(v.filters)} className="hover:text-cyan-200">{v.name}</button>
                    <button onClick={() => persistSaved(saved.filter((s) => s.name !== v.name))}
                      className="text-muted-foreground hover:text-rose-300" aria-label={`Delete ${v.name}`}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Table */}
          <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur">
            {q.isLoading ? (
              <TableSkeleton />
            ) : rows.length === 0 ? (
              <EmptyState anyFilter={!!anyFilter} onClear={clearFilters} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1180px] text-sm">
                  <thead className="bg-muted/10">
                    <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <th className="px-4 py-3">Ref ID</th>
                      <th className="px-4 py-3">Lead</th>
                      <th className="px-4 py-3">Partner</th>
                      <th className="px-4 py-3">Stage</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Deal value</th>
                      <th className="px-4 py-3 text-right">Commission</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Last updated</th>
                      <th className="px-3 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const stalled = isStalled(r);
                      return (
                        <tr key={r.id}
                          className={`group cursor-pointer border-t border-border/40 transition-colors hover:bg-muted/15 ${stalled ? "bg-amber-500/[0.03]" : ""}`}
                          onClick={() => setPreview(r)}
                        >
                          <td className="px-4 py-3.5">
                            <span className="rounded-md border border-border/60 bg-background/50 px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">
                              #{r.id.slice(0, 8)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              {stalled && (
                                <span title={`No activity in ${STALL_DAYS}+ days`}
                                  className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30">
                                  <AlertTriangle className="h-2.5 w-2.5" />
                                </span>
                              )}
                              <div className="min-w-0">
                                <div className="truncate font-medium">{r.client_name}</div>
                                <div className="truncate text-xs text-muted-foreground">{r.company ?? "—"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {r.partner ? (
                              <div className="min-w-0">
                                <div className="truncate">{r.partner.full_name}</div>
                                <div className="truncate text-xs text-muted-foreground">{r.partner.company ?? ""}</div>
                              </div>
                            ) : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="px-4 py-3.5"><StageBadge stage={r.deal_stage} /></td>
                          <td className="px-4 py-3.5"><StatusChip status={r.status} /></td>
                          <td className="px-4 py-3.5 text-right tabular-nums">{fmtMoney(r.deal_value)}</td>
                          <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-cyan-200">{fmtMoney(r.commission_amount)}</td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">{fmtDate(r.referral_date)}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5 text-xs">
                              <Clock className={`h-3 w-3 ${stalled ? "text-amber-300" : "text-muted-foreground"}`} />
                              <span className={stalled ? "text-amber-300" : "text-muted-foreground"}>{timeAgo(r.updated_at ?? r.created_at)}</span>
                            </div>
                            <div className="mt-0.5"><PayoutChip status={r.payout_status} /></div>
                          </td>
                          <td className="px-2 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <RowMenu
                              open={openMenu === r.id}
                              onOpenChange={(o) => setOpenMenu(o ? r.id : null)}
                              onView={() => setPreview(r)}
                              onEdit={() => setEditing(r)}
                              onApprove={() => update.mutate({ id: r.id, status: "won" })}
                              onReject={() => update.mutate({ id: r.id, status: "lost" })}
                              onNextStage={() => {
                                const next = nextStage(r.deal_stage);
                                if (next) update.mutate({ id: r.id, deal_stage: next });
                              }}
                              disableProgress={r.deal_stage === "closed_won" || r.deal_stage === "closed_lost"}
                              partnerId={r.partner?.id}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Side summary panel */}
        <aside className="space-y-3">
          <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/70 to-card/40 p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/25">
                <TrendingUp className="h-3 w-3" />
              </span>
              <p className="text-[11px] font-semibold tracking-tight">Program summary</p>
            </div>
            <div className="mt-3 space-y-2">
              <StatRow icon={<Users className="h-3.5 w-3.5" />} label="Total referrals" value={summary.total.toString()} />
              <StatRow icon={<Target className="h-3.5 w-3.5" />} label="Active pipeline"
                value={`${summary.activeCount}`} sub={fmtMoney(summary.activeValue)} tone="cyan" />
              <StatRow icon={<Trophy className="h-3.5 w-3.5" />} label="Won deals"
                value={`${summary.wonCount}`} sub={fmtMoney(summary.wonValue)} tone="emerald" />
              <StatRow icon={<Ban className="h-3.5 w-3.5" />} label="Lost deals"
                value={`${summary.lostCount}`} tone="rose" />
              <StatRow icon={<Flame className="h-3.5 w-3.5" />} label={`Stalled ${STALL_DAYS}d+`}
                value={`${summary.stalledCount}`} tone="amber" />
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Needs attention</p>
              {summary.stalledCount > 0 && (
                <button onClick={() => patch({ stalledOnly: true })}
                  className="text-[11px] text-amber-300 hover:text-amber-200">See all</button>
              )}
            </div>
            {summary.stalledCount === 0 ? (
              <p className="text-xs text-muted-foreground">Nothing stalled. Pipeline is healthy.</p>
            ) : (
              <ul className="space-y-1.5">
                {all.filter(isStalled).slice(0, 5).map((r) => (
                  <li key={r.id}>
                    <button onClick={() => setPreview(r)}
                      className="flex w-full items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-500/[0.04] px-2 py-1.5 text-left text-xs hover:border-amber-400/40">
                      <AlertTriangle className="h-3 w-3 shrink-0 text-amber-300" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{r.client_name}</div>
                        <div className="truncate text-[10px] text-muted-foreground">
                          {r.partner?.full_name ?? "—"} · {timeAgo(r.last_activity_at ?? r.created_at)}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {editing && (
        <EditModal
          row={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            update.mutate({ id: editing.id, ...patch });
            setEditing(null);
          }}
          saving={update.isPending}
        />
      )}
      {preview && !editing && (
        <PreviewDrawer row={preview} onClose={() => setPreview(null)} onEdit={() => setEditing(preview)} />
      )}
    </div>
  );
}

/* -------------------- pieces -------------------- */

function ChipTab({
  active, onClick, label, count, dot, tone, icon,
}: {
  active: boolean; onClick: () => void; label: string; count: number;
  dot: string; tone?: "amber"; icon?: React.ReactNode;
}) {
  const activeCls = tone === "amber"
    ? "border-amber-400/40 bg-amber-500/10 text-amber-100"
    : "border-cyan-400/40 bg-cyan-500/10 text-cyan-100";
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
        active ? activeCls : "border-border/70 bg-card/50 text-muted-foreground hover:text-foreground"
      }`}>
      {icon ?? <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
      {label}
      <span className="rounded-full bg-background/60 px-1.5 py-0.5 text-[10px] tabular-nums">{count}</span>
    </button>
  );
}

const STAGE_STYLES: Record<ReferralDealStage, string> = {
  lead: "bg-slate-500/10 text-slate-200 border-slate-400/25",
  qualified: "bg-blue-500/10 text-blue-200 border-blue-400/25",
  proposal: "bg-violet-500/10 text-violet-200 border-violet-400/25",
  negotiation: "bg-amber-500/10 text-amber-200 border-amber-400/25",
  closed_won: "bg-emerald-500/10 text-emerald-200 border-emerald-400/25",
  closed_lost: "bg-rose-500/10 text-rose-200 border-rose-400/25",
};
function StageBadge({ stage }: { stage: ReferralDealStage }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${STAGE_STYLES[stage]}`}>
      {STAGE_LABEL[stage]}
    </span>
  );
}

function StatRow({
  icon, label, value, sub, tone,
}: { icon: React.ReactNode; label: string; value: string; sub?: string; tone?: "cyan" | "emerald" | "rose" | "amber" }) {
  const toneCls =
    tone === "cyan" ? "text-cyan-200" :
    tone === "emerald" ? "text-emerald-200" :
    tone === "rose" ? "text-rose-200" :
    tone === "amber" ? "text-amber-200" : "text-foreground";
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/30 px-2.5 py-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-muted-foreground/80">{icon}</span>
        {label}
      </div>
      <div className="text-right">
        <div className={`text-sm font-semibold tabular-nums ${toneCls}`}>{value}</div>
        {sub && <div className="text-[10px] text-muted-foreground tabular-nums">{sub}</div>}
      </div>
    </div>
  );
}

function RowMenu({
  open, onOpenChange, onView, onEdit, onApprove, onReject, onNextStage, disableProgress, partnerId,
}: {
  open: boolean; onOpenChange: (o: boolean) => void;
  onView: () => void; onEdit: () => void; onApprove: () => void; onReject: () => void; onNextStage: () => void;
  disableProgress: boolean; partnerId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onOpenChange(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, onOpenChange]);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => onOpenChange(!open)}
        className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted/30 hover:text-foreground">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-52 overflow-hidden rounded-lg border border-border/70 bg-popover/95 shadow-lg backdrop-blur">
          <MenuBtn icon={<Eye className="h-3.5 w-3.5" />} label="View details" onClick={() => { onView(); onOpenChange(false); }} />
          <MenuBtn icon={<Pencil className="h-3.5 w-3.5" />} label="Edit" onClick={() => { onEdit(); onOpenChange(false); }} />
          <MenuBtn icon={<ArrowRight className="h-3.5 w-3.5" />} label="Move to next stage"
            onClick={() => { onNextStage(); onOpenChange(false); }} disabled={disableProgress} />
          {partnerId && (
            <Link to="/admin/affiliates/partners/$id" params={{ id: partnerId }}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 border-t border-border/40 px-3 py-2 text-xs hover:bg-muted/30">
              <Users className="h-3.5 w-3.5" /> View partner
            </Link>
          )}
          <div className="border-t border-border/40" />
          <MenuBtn icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />} label="Mark as Won"
            onClick={() => { onApprove(); onOpenChange(false); }} />
          <MenuBtn icon={<XCircle className="h-3.5 w-3.5 text-rose-300" />} label="Mark as Lost"
            onClick={() => { onReject(); onOpenChange(false); }} />
        </div>
      )}
    </div>
  );
}
function MenuBtn({ icon, label, onClick, disabled }: { icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-40">
      {icon} {label}
    </button>
  );
}

function EmptyState({ anyFilter, onClear }: { anyFilter: boolean; onClear: () => void }) {
  return (
    <div className="grid place-items-center gap-2 px-6 py-16 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-muted/30 text-muted-foreground ring-1 ring-border/60">
        <Search className="h-4 w-4" />
      </span>
      <p className="text-sm font-medium">
        {anyFilter ? "No referrals match your filters" : "No referrals yet"}
      </p>
      <p className="text-xs text-muted-foreground">
        {anyFilter ? "Try clearing filters or widening the date range." : "Referrals submitted by partners will land here."}
      </p>
      {anyFilter && (
        <button onClick={onClear}
          className="mt-1 rounded-lg border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200">
          Clear all filters
        </button>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/25" style={{ animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  );
}

function PreviewDrawer({ row, onClose, onEdit }: { row: any; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border/60 bg-card/95 p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase text-muted-foreground">#{row.id.slice(0, 8)}</div>
            <h3 className="mt-1 text-lg font-semibold">{row.client_name}</h3>
            <p className="text-xs text-muted-foreground">{row.company ?? "—"}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted/30">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusChip status={row.status} />
          <StageBadge stage={row.deal_stage} />
          <PayoutChip status={row.payout_status} />
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Deal value" value={fmtMoney(row.deal_value)} />
          <Info label="Commission" value={fmtMoney(row.commission_amount)} accent />
          <Info label="Partner" value={row.partner?.full_name ?? "—"} />
          <Info label="Service" value={row.service_interested ?? "—"} />
          <Info label="Package" value={row.package_selected ?? "—"} />
          <Info label="Email" value={row.email ?? "—"} />
          <Info label="Phone" value={row.phone ?? "—"} />
          <Info label="Submitted" value={fmtDate(row.referral_date)} />
          <Info label="Last activity" value={fmtDateTime(row.last_activity_at ?? row.updated_at)} />
          <Info label="Last updated" value={fmtDateTime(row.updated_at)} />
        </dl>
        {row.notes && (
          <div className="mt-4 rounded-lg border border-border/50 bg-background/40 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</p>
            <p className="mt-1 whitespace-pre-wrap text-xs">{row.notes}</p>
          </div>
        )}
        <div className="mt-5 flex gap-2">
          <Link to="/admin/affiliates/referrals/$id" params={{ id: row.id }}
            className="flex-1 rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-center text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200">
            Open full record
          </Link>
          <button onClick={onEdit}
            className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-100 hover:bg-cyan-500/20">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
function Info({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={`mt-0.5 tabular-nums ${accent ? "font-semibold text-cyan-200" : ""}`}>{value}</dd>
    </div>
  );
}

function EditModal({
  row, onClose, onSave, saving,
}: {
  row: any; onClose: () => void; saving: boolean;
  onSave: (patch: { status?: ReferralStatus; deal_stage?: ReferralDealStage; deal_value?: number | null; commission_pct?: number | null; notes?: string | null }) => void;
}) {
  const [status, setStatus] = useState<ReferralStatus>(row.status);
  const [stage, setStage] = useState<ReferralDealStage>(row.deal_stage);
  const [dealValue, setDealValue] = useState<string>(row.deal_value?.toString() ?? "");
  const [pct, setPct] = useState<string>(row.commission_pct?.toString() ?? "");
  const [notes, setNotes] = useState<string>(row.notes ?? "");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card/95 p-5 shadow-2xl">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold">Edit referral</h3>
            <p className="text-xs text-muted-foreground">{row.client_name} · #{row.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted/30">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value as ReferralStatus)} className={fsel}>
                {REFERRAL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Stage">
              <select value={stage} onChange={(e) => setStage(e.target.value as ReferralDealStage)} className={fsel}>
                {(["lead","qualified","proposal","negotiation","closed_won","closed_lost"] as ReferralDealStage[]).map((s) => (
                  <option key={s} value={s}>{STAGE_LABEL[s]}</option>
                ))}
              </select>
            </Field>
            <Field label="Deal value (₹)">
              <input type="number" min={0} value={dealValue} onChange={(e) => setDealValue(e.target.value)} className={fsel} />
            </Field>
            <Field label="Commission %">
              <input type="number" min={0} max={100} step="0.1" value={pct} onChange={(e) => setPct(e.target.value)} className={fsel} />
            </Field>
          </div>
          <Field label="Notes">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              className={`${fsel} w-full resize-none`} />
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-border/70 bg-background/40 px-3 py-1.5 text-xs">
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={() => onSave({
              status, deal_stage: stage,
              deal_value: dealValue === "" ? null : Number(dealValue),
              commission_pct: pct === "" ? null : Number(pct),
              notes: notes.trim() === "" ? null : notes,
            })}
            className="rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-cyan-100 hover:bg-cyan-500/25 disabled:opacity-50">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
function nextStage(s: ReferralDealStage): ReferralDealStage | null {
  const order: ReferralDealStage[] = ["lead", "qualified", "proposal", "negotiation", "closed_won"];
  const i = order.indexOf(s);
  if (i < 0 || i >= order.length - 1) return null;
  return order[i + 1];
}

const fsel = "rounded-lg border border-border/70 bg-background/40 px-2.5 py-1.5 text-xs outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20";
