import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck, CheckCircle2, PauseCircle, Lock, Wallet, Clock, ArrowRight,
  Zap, ChevronRight,
} from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  adminListReferrals, adminUpdateReferral, adminApprovePayout, adminMarkPayoutPaid,
  PAYOUT_STATUSES, type ReferralPayoutStatus,
} from "@/lib/partners.functions";
import { fmtMoney, PayoutChip } from "@/lib/partners-ui";

export const Route = createFileRoute("/_authenticated/admin/affiliates/payouts")({
  beforeLoad: async () => { const r = await checkIsAdmin(); if (!r.isAdmin) throw notFound(); return {}; },
  component: PayoutsPage,
  head: () => ({ meta: [{ title: "Payouts — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

function PayoutsPage() {
  const qc = useQueryClient();
  const fn = useServerFn(adminListReferrals);
  const updateFn = useServerFn(adminUpdateReferral);
  const q = useQuery({ queryKey: ["admin", "referrals"], queryFn: () => fn() });
  const [filter, setFilter] = useState<ReferralPayoutStatus | "all">("pending");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const withCommission = useMemo(
    () => (q.data ?? []).filter((r) => r.commission_amount && r.commission_amount > 0),
    [q.data]
  );

  const rows = useMemo(
    () => (filter === "all" ? withCommission : withCommission.filter((r) => r.payout_status === filter)),
    [withCommission, filter]
  );

  const buckets = useMemo(() => {
    const b: Record<string, { count: number; total: number }> = {
      all: { count: withCommission.length, total: 0 },
      pending: { count: 0, total: 0 },
      approved: { count: 0, total: 0 },
      paid: { count: 0, total: 0 },
      on_hold: { count: 0, total: 0 },
    };
    for (const r of withCommission) {
      const c = Number(r.commission_amount ?? 0);
      b.all.total += c;
      const k = r.payout_status ?? "pending";
      if (b[k]) { b[k].count++; b[k].total += c; }
    }
    return b;
  }, [withCommission]);

  const setPayout = useMutation({
    mutationFn: (v: { id: string; payout_status: ReferralPayoutStatus }) => updateFn({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "referrals"] }); toast.success("Updated"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const approveFn = useServerFn(adminApprovePayout);
  const markPaidFn = useServerFn(adminMarkPayoutPaid);
  const approve = useMutation({
    mutationFn: (id: string) => approveFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "referrals"] }); toast.success("Payout approved"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const markPaid = useMutation({
    mutationFn: (id: string) => markPaidFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "referrals"] }); toast.success("Marked as paid"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    const eligible = rows.filter((r) => r.payout_status === "pending" || r.payout_status === "approved").map((r) => r.id);
    setSelected((prev) => {
      if (eligible.every((id) => prev.has(id))) return new Set();
      return new Set(eligible);
    });
  };

  const selectedRows = rows.filter((r) => selected.has(r.id));
  const selectedTotal = selectedRows.reduce((s, r) => s + Number(r.commission_amount ?? 0), 0);
  const canApproveSelected = selectedRows.length > 0 && selectedRows.every((r) => r.payout_status === "pending");
  const canPaySelected = selectedRows.length > 0 && selectedRows.every((r) => r.payout_status === "approved");

  const batchApprove = async () => {
    for (const r of selectedRows) await approve.mutateAsync(r.id);
    setSelected(new Set());
  };
  const batchMarkPaid = async () => {
    for (const r of selectedRows) await markPaid.mutateAsync(r.id);
    setSelected(new Set());
  };

  return (
    <div className="space-y-5">
      {/* Pipeline visualization */}
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card/70 to-card/40 backdrop-blur">
        <header className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/25">
              <Wallet className="h-3 w-3" />
            </span>
            <div>
              <p className="text-[11px] font-semibold tracking-tight">Payout workflow</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pending → Approved → Paid</p>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Total tracked <span className="ml-1 text-sm font-semibold tabular-nums text-foreground">{fmtMoney(buckets.all.total)}</span>
          </div>
        </header>
        <div className="grid grid-cols-1 items-stretch sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <StageTile
            tone="amber" icon={Clock} label="Pending"
            count={buckets.pending.count} amount={fmtMoney(buckets.pending.total)}
            active={filter === "pending"} onClick={() => setFilter("pending")}
          />
          <ArrowConnector />
          <StageTile
            tone="cyan" icon={BadgeCheck} label="Approved"
            count={buckets.approved.count} amount={fmtMoney(buckets.approved.total)}
            active={filter === "approved"} onClick={() => setFilter("approved")}
          />
          <ArrowConnector />
          <StageTile
            tone="emerald" icon={CheckCircle2} label="Paid"
            count={buckets.paid.count} amount={fmtMoney(buckets.paid.total)}
            active={filter === "paid"} onClick={() => setFilter("paid")}
          />
        </div>
      </section>

      {/* Filter chips + on hold */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl border border-border/70 bg-card/60 p-1">
          {(["all","pending","approved","paid","on_hold"] as const).map((f) => {
            const active = filter === f;
            const label = f === "all" ? "All" : PAYOUT_STATUSES.find((p) => p.value === f)?.label ?? f;
            const count = buckets[f].count;
            return (
              <button
                key={f}
                onClick={() => { setFilter(f); setSelected(new Set()); }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/70"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                <span className={`inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                  active ? "bg-cyan-500/15 text-cyan-200" : "bg-muted/40 text-muted-foreground"
                }`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Batch action bar */}
      {selected.size > 0 && (
        <div className="sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-400/30 bg-cyan-500/[0.06] p-3 backdrop-blur">
          <div className="text-sm">
            <span className="font-semibold text-cyan-200 tabular-nums">{selected.size}</span>
            <span className="text-muted-foreground"> selected · </span>
            <span className="font-semibold tabular-nums">{fmtMoney(selectedTotal)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelected(new Set())} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
            {canApproveSelected && (
              <button onClick={batchApprove} disabled={approve.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/25 disabled:opacity-50">
                <Zap className="h-3.5 w-3.5" /> Approve {selected.size}
              </button>
            )}
            {canPaySelected && (
              <button onClick={batchMarkPaid} disabled={markPaid.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/25 disabled:opacity-50">
                <CheckCircle2 className="h-3.5 w-3.5" /> Mark {selected.size} as paid
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur">
        {q.isLoading ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <EmptyPayouts filter={filter} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-5 py-3 w-8">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-border/70 bg-background/60 accent-cyan-500"
                      checked={rows.length > 0 && rows.filter((r) => r.payout_status === "pending" || r.payout_status === "approved").every((r) => selected.has(r.id)) && selected.size > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Partner</th>
                  <th className="px-5 py-3 text-right font-semibold">Deal</th>
                  <th className="px-5 py-3 text-right font-semibold">Commission</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const selectable = r.payout_status === "pending" || r.payout_status === "approved";
                  const isSelected = selected.has(r.id);
                  return (
                    <tr key={r.id} className={`group border-t border-border/40 transition-colors hover:bg-muted/15 ${isSelected ? "bg-cyan-500/[0.04]" : ""}`}>
                      <td className="px-5 py-3.5">
                        {selectable && (
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(r.id)}
                            className="h-3.5 w-3.5 rounded border-border/70 bg-background/60 accent-cyan-500" />
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link to="/admin/affiliates/referrals/$id" params={{ id: r.id }} className="font-medium hover:text-cyan-200">
                          {r.client_name}
                        </Link>
                        <div className="mt-0.5 truncate text-xs text-muted-foreground">{r.company ?? "—"}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        {r.partner ? (
                          <div>
                            <div className="truncate">{r.partner.full_name}</div>
                            <div className="truncate text-xs text-muted-foreground">{r.partner.company ?? ""}</div>
                          </div>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">{fmtMoney(r.deal_value)}</td>
                      <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-cyan-200">{fmtMoney(r.commission_amount)}</td>
                      <td className="px-5 py-3.5"><PayoutChip status={r.payout_status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {r.payout_status === "pending" && (
                            <>
                              <ActionBtn icon={BadgeCheck} label="Approve" tone="cyan" onClick={() => approve.mutate(r.id)} />
                              <ActionBtn icon={PauseCircle} label="Hold" tone="muted" onClick={() => setPayout.mutate({ id: r.id, payout_status: "on_hold" })} />
                            </>
                          )}
                          {r.payout_status === "approved" && (
                            <>
                              <ActionBtn icon={CheckCircle2} label="Mark paid" tone="emerald" onClick={() => markPaid.mutate(r.id)} />
                              <ActionBtn icon={PauseCircle} label="Hold" tone="muted" onClick={() => setPayout.mutate({ id: r.id, payout_status: "on_hold" })} />
                            </>
                          )}
                          {r.payout_status === "on_hold" && (
                            <ActionBtn icon={BadgeCheck} label="Resume" tone="muted" onClick={() => setPayout.mutate({ id: r.id, payout_status: "pending" })} />
                          )}
                          {r.payout_status === "paid" && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Lock className="h-3 w-3" /> Locked
                            </span>
                          )}
                          <Link to="/admin/affiliates/referrals/$id" params={{ id: r.id }}
                            className="ml-auto inline-flex text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-cyan-200">
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
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
  );
}

function StageTile({
  tone, icon: Icon, label, count, amount, active, onClick,
}: {
  tone: "amber" | "cyan" | "emerald";
  icon: any; label: string; count: number; amount: string;
  active?: boolean; onClick?: () => void;
}) {
  const toneMap = {
    amber: { text: "text-amber-300", icon: "bg-amber-500/10 text-amber-300 ring-amber-400/25", bar: "from-amber-500 to-amber-400", accent: "border-amber-400/30 bg-amber-500/[0.04]" },
    cyan: { text: "text-cyan-200", icon: "bg-cyan-500/10 text-cyan-300 ring-cyan-400/25", bar: "from-cyan-500 to-teal-400", accent: "border-cyan-400/30 bg-cyan-500/[0.04]" },
    emerald: { text: "text-emerald-300", icon: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/25", bar: "from-emerald-500 to-emerald-400", accent: "border-emerald-400/30 bg-emerald-500/[0.04]" },
  }[tone];
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 px-5 py-4 text-left transition-all hover:bg-muted/15 ${active ? toneMap.accent + " border-y" : ""}`}
    >
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ${toneMap.icon}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={`truncate text-lg font-semibold tabular-nums tracking-tight ${toneMap.text}`}>{amount}</p>
        <p className="text-[11px] text-muted-foreground tabular-nums">{count} referral{count === 1 ? "" : "s"}</p>
      </div>
    </button>
  );
}

function ArrowConnector() {
  return (
    <div className="hidden items-center justify-center px-2 sm:flex">
      <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
    </div>
  );
}

function ActionBtn({
  icon: Icon, label, tone, onClick,
}: { icon: any; label: string; tone: "cyan" | "emerald" | "muted"; onClick: () => void }) {
  const cls =
    tone === "cyan"    ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20"
  : tone === "emerald" ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                       : "border-border bg-muted/30 text-muted-foreground hover:text-foreground";
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition ${cls}`}>
      <Icon className="h-3 w-3" /> {label}
    </button>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/25" style={{ animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  );
}

function EmptyPayouts({ filter }: { filter: string }) {
  const map: Record<string, { title: string; body: string }> = {
    all: { title: "No commissions yet", body: "When partners close deals, commissions appear here for review and payout." },
    pending: { title: "No pending payouts", body: "You're all caught up. New commissions land here as soon as a partner wins a deal." },
    approved: { title: "Nothing approved", body: "Approve a pending payout to move it into the release queue." },
    paid: { title: "No paid commissions", body: "Once you mark approved payouts as paid, they appear here as an audit trail." },
    on_hold: { title: "Nothing on hold", body: "Payouts you pause during dispute or review will show up here." },
  };
  const { title, body } = map[filter] ?? map.all;
  return (
    <div className="grid place-items-center gap-3 px-6 py-16 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/25">
        <Wallet className="h-4 w-4" />
      </span>
      <div className="max-w-sm">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
