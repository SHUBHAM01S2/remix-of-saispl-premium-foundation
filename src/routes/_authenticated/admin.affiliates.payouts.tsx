import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck, CheckCircle2, PauseCircle, Wallet, Clock, ArrowRight, Zap,
  AlertTriangle, Search, Download, FileText, MoreHorizontal, Eye, X,
  Filter, ShieldCheck, TrendingUp, Banknote, CalendarClock, RefreshCw,
} from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  adminListReferrals, adminUpdateReferral, adminApprovePayout, adminMarkPayoutPaid,
  PAYOUT_STATUSES, type ReferralPayoutStatus,
} from "@/lib/partners.functions";
import { fmtDate, fmtMoney, PayoutChip } from "@/lib/partners-ui";

export const Route = createFileRoute("/_authenticated/admin/affiliates/payouts")({
  beforeLoad: async () => { const r = await checkIsAdmin(); if (!r.isAdmin) throw notFound(); return {}; },
  component: PayoutsPage,
  head: () => ({ meta: [{ title: "Payouts — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

// Delayed = approved and not paid for 7+ days
const DELAY_DAYS = 7;
const DELAY_MS = DELAY_DAYS * 24 * 60 * 60 * 1000;

type FilterStatus = ReferralPayoutStatus | "all" | "scheduled" | "delayed";

function PayoutsPage() {
  const qc = useQueryClient();
  const fn = useServerFn(adminListReferrals);
  const updateFn = useServerFn(adminUpdateReferral);
  const approveFn = useServerFn(adminApprovePayout);
  const markPaidFn = useServerFn(adminMarkPayoutPaid);
  const q = useQuery({ queryKey: ["admin", "referrals"], queryFn: () => fn() });

  const [status, setStatus] = useState<FilterStatus>("pending");
  const [search, setSearch] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [method, setMethod] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<any | null>(null);

  const withCommission = useMemo(
    () => (q.data ?? []).filter((r) => r.commission_amount && Number(r.commission_amount) > 0),
    [q.data]
  );

  const now = Date.now();
  const isDelayed = (r: any) =>
    r.payout_status === "approved" &&
    r.payout_approved_at &&
    now - new Date(r.payout_approved_at).getTime() > DELAY_MS;

  const partners = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of withCommission) if (r.partner) seen.set(r.partner.id, r.partner.full_name);
    return Array.from(seen.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [withCommission]);
  const methods = useMemo(
    () => Array.from(new Set(withCommission.map((r) => r.partner?.payout_method).filter(Boolean) as string[])),
    [withCommission]
  );

  const filteredByAll = useMemo(() => {
    const s = search.trim().toLowerCase();
    return withCommission.filter((r) => {
      if (partnerId && r.partner_id !== partnerId) return false;
      if (method && (r.partner?.payout_method ?? "") !== method) return false;
      const ref = r.referral_date;
      if (from && ref < from) return false;
      if (to && ref > to) return false;
      if (!s) return true;
      return (
        r.client_name.toLowerCase().includes(s) ||
        (r.partner?.full_name ?? "").toLowerCase().includes(s) ||
        (r.company ?? "").toLowerCase().includes(s)
      );
    });
  }, [withCommission, partnerId, method, from, to, search]);

  const rows = useMemo(() => {
    return filteredByAll.filter((r) => {
      if (status === "all") return true;
      if (status === "scheduled") return r.payout_status === "approved" && !isDelayed(r);
      if (status === "delayed") return isDelayed(r);
      return r.payout_status === status;
    });
  }, [filteredByAll, status]);

  // Top summary — over the ENTIRE dataset, not filtered
  const summary = useMemo(() => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);
    let pending = 0, approved = 0, paidLifetime = 0, paidThisMonth = 0, onHold = 0, delayed = 0;
    let pendingCount = 0, approvedCount = 0, delayedCount = 0;
    for (const r of withCommission) {
      const c = Number(r.commission_amount ?? 0);
      if (r.payout_status === "pending") { pending += c; pendingCount++; }
      if (r.payout_status === "approved") {
        approved += c; approvedCount++;
        if (isDelayed(r)) { delayed += c; delayedCount++; }
      }
      if (r.payout_status === "on_hold") onHold += c;
      if (r.payout_status === "paid") {
        paidLifetime += c;
        if (r.payout_paid_at && new Date(r.payout_paid_at) >= startOfMonth) paidThisMonth += c;
      }
    }
    return { pending, approved, paidLifetime, paidThisMonth, onHold, delayed,
      pendingCount, approvedCount, delayedCount };
  }, [withCommission]);

  // Bucket counts on filtered scope for the chip tabs
  const buckets = useMemo(() => {
    const b: Record<FilterStatus, { count: number; total: number }> = {
      all: { count: filteredByAll.length, total: filteredByAll.reduce((s, r) => s + Number(r.commission_amount ?? 0), 0) },
      pending: { count: 0, total: 0 },
      approved: { count: 0, total: 0 },
      scheduled: { count: 0, total: 0 },
      paid: { count: 0, total: 0 },
      on_hold: { count: 0, total: 0 },
      delayed: { count: 0, total: 0 },
    };
    for (const r of filteredByAll) {
      const c = Number(r.commission_amount ?? 0);
      const k = r.payout_status ?? "pending";
      if (b[k]) { b[k].count++; b[k].total += c; }
      if (r.payout_status === "approved") {
        if (isDelayed(r)) { b.delayed.count++; b.delayed.total += c; }
        else { b.scheduled.count++; b.scheduled.total += c; }
      }
    }
    return b;
  }, [filteredByAll]);

  const setPayout = useMutation({
    mutationFn: (v: { id: string; payout_status: ReferralPayoutStatus }) => updateFn({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "referrals"] }); toast.success("Updated"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
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

  const toggleSelect = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const eligibleForBatch = rows.filter((r) => r.payout_status === "pending" || r.payout_status === "approved").map((r) => r.id);
  const toggleSelectAll = () =>
    setSelected((prev) => eligibleForBatch.every((id) => prev.has(id)) && prev.size > 0 ? new Set() : new Set(eligibleForBatch));

  const selectedRows = rows.filter((r) => selected.has(r.id));
  const selectedTotal = selectedRows.reduce((s, r) => s + Number(r.commission_amount ?? 0), 0);
  const canApproveSelected = selectedRows.length > 0 && selectedRows.every((r) => r.payout_status === "pending");
  const canPaySelected = selectedRows.length > 0 && selectedRows.every((r) => r.payout_status === "approved");

  const batchApprove = async () => { for (const r of selectedRows) await approve.mutateAsync(r.id); setSelected(new Set()); };
  const batchMarkPaid = async () => { for (const r of selectedRows) await markPaid.mutateAsync(r.id); setSelected(new Set()); };
  const batchHold = async () => {
    for (const r of selectedRows) await setPayout.mutateAsync({ id: r.id, payout_status: "on_hold" });
    setSelected(new Set());
  };

  const exportCsv = (dataset: typeof rows, filename: string) => {
    const headers = ["Payout ID","Referral","Company","Partner","Method","Deal","Commission","Status","ApprovedAt","PaidAt"];
    const lines = [headers.join(",")];
    for (const r of dataset) {
      const row = [r.id, r.client_name, r.company ?? "", r.partner?.full_name ?? "",
        r.partner?.payout_method ?? "", r.deal_value ?? "", r.commission_amount ?? "",
        r.payout_status, r.payout_approved_at ?? "", r.payout_paid_at ?? ""];
      lines.push(row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    a.click(); URL.revokeObjectURL(url);
  };

  const anyFilter = search || partnerId || method || from || to;
  const clearFilters = () => { setSearch(""); setPartnerId(""); setMethod(""); setFrom(""); setTo(""); };

  const delayedRows = withCommission.filter(isDelayed);
  const onHoldRows = withCommission.filter((r) => r.payout_status === "on_hold");

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Payout Operations</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Finance ledger for partner commissions — review, approve, release, and audit every payout cycle.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => qc.invalidateQueries({ queryKey: ["admin", "referrals"] })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => exportCsv(withCommission, `payouts-full-${Date.now()}.csv`)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200">
            <FileText className="h-3.5 w-3.5" /> Full ledger
          </button>
          <button onClick={() => exportCsv(rows, `payouts-${status}-${Date.now()}.csv`)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/20">
            <Download className="h-3.5 w-3.5" /> Export view ({rows.length})
          </button>
        </div>
      </header>

      {/* Top summary — 4 finance KPIs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          tone="amber"
          icon={Clock}
          label="Pending Payout"
          value={fmtMoney(summary.pending)}
          sub={`${summary.pendingCount} awaiting review`}
          onClick={() => setStatus("pending")}
        />
        <KpiCard
          tone="cyan"
          icon={BadgeCheck}
          label="Approved for Release"
          value={fmtMoney(summary.approved)}
          sub={`${summary.approvedCount} scheduled${summary.delayedCount ? ` · ${summary.delayedCount} delayed` : ""}`}
          onClick={() => setStatus("approved")}
          badge={summary.delayedCount > 0 ? { label: `${summary.delayedCount} delayed`, tone: "rose" } : undefined}
        />
        <KpiCard
          tone="emerald"
          icon={Banknote}
          label="Paid This Month"
          value={fmtMoney(summary.paidThisMonth)}
          sub={new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          onClick={() => setStatus("paid")}
        />
        <KpiCard
          tone="violet"
          icon={TrendingUp}
          label="Total Lifetime Payout"
          value={fmtMoney(summary.paidLifetime)}
          sub="All partners, all time"
        />
      </section>

      {/* Alerts row */}
      {(delayedRows.length > 0 || onHoldRows.length > 0) && (
        <section className="rounded-2xl border border-rose-400/25 bg-rose-500/[0.04] p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30">
              <AlertTriangle className="h-3 w-3" />
            </span>
            <h3 className="text-sm font-semibold">Payout alerts</h3>
            <span className="text-[11px] text-muted-foreground">
              Requires finance attention
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {delayedRows.length > 0 && (
              <button
                onClick={() => { setStatus("delayed"); clearFilters(); }}
                className="flex items-center justify-between rounded-lg border border-rose-400/30 bg-rose-500/[0.06] px-3 py-2 text-left hover:bg-rose-500/[0.1]"
              >
                <div>
                  <div className="text-sm font-medium text-rose-100">Delayed releases</div>
                  <div className="text-[11px] text-rose-200/70">
                    {delayedRows.length} approved payout{delayedRows.length === 1 ? "" : "s"} not paid within {DELAY_DAYS} days
                  </div>
                </div>
                <div className="text-sm font-semibold tabular-nums text-rose-100">{fmtMoney(summary.delayed)}</div>
              </button>
            )}
            {onHoldRows.length > 0 && (
              <button
                onClick={() => { setStatus("on_hold"); clearFilters(); }}
                className="flex items-center justify-between rounded-lg border border-amber-400/30 bg-amber-500/[0.06] px-3 py-2 text-left hover:bg-amber-500/[0.1]"
              >
                <div>
                  <div className="text-sm font-medium text-amber-100">On hold</div>
                  <div className="text-[11px] text-amber-200/70">
                    {onHoldRows.length} payout{onHoldRows.length === 1 ? "" : "s"} awaiting resolution
                  </div>
                </div>
                <div className="text-sm font-semibold tabular-nums text-amber-100">{fmtMoney(summary.onHold)}</div>
              </button>
            )}
          </div>
        </section>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4 min-w-0">
          {/* Filter bar */}
          <div className="space-y-2.5 rounded-2xl border border-border/60 bg-card/40 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search partner, referral, company…"
                  className="w-full rounded-lg border border-border/70 bg-background/40 pl-9 pr-3 py-2 text-sm outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20" />
              </div>
              {anyFilter && (
                <button onClick={clearFilters}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Filter className="h-3 w-3" /> Refine
              </div>
              <select value={partnerId} onChange={(e) => setPartnerId(e.target.value)} className={fsel}>
                <option value="">All partners</option>
                {partners.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className={fsel}>
                <option value="">All methods</option>
                {methods.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={fsel} />
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={fsel} />
              </label>
            </div>
          </div>

          {/* Status chip strip */}
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusChip active={status === "all"} label="All" count={buckets.all.count}
              amount={buckets.all.total} onClick={() => setStatus("all")} />
            <StatusChip active={status === "pending"} tone="amber" label="Pending Review"
              count={buckets.pending.count} amount={buckets.pending.total} onClick={() => setStatus("pending")} />
            <StatusChip active={status === "approved"} tone="cyan" label="Approved"
              count={buckets.approved.count} amount={buckets.approved.total} onClick={() => setStatus("approved")} />
            <StatusChip active={status === "scheduled"} tone="cyan" label="Scheduled"
              count={buckets.scheduled.count} amount={buckets.scheduled.total} onClick={() => setStatus("scheduled")} />
            <StatusChip active={status === "paid"} tone="emerald" label="Paid"
              count={buckets.paid.count} amount={buckets.paid.total} onClick={() => setStatus("paid")} />
            <StatusChip active={status === "delayed"} tone="rose" label="Delayed"
              count={buckets.delayed.count} amount={buckets.delayed.total} onClick={() => setStatus("delayed")} />
            <StatusChip active={status === "on_hold"} tone="amber" label="On Hold"
              count={buckets.on_hold.count} amount={buckets.on_hold.total} onClick={() => setStatus("on_hold")} />
          </div>

          {/* Batch action bar */}
          {selected.size > 0 && (
            <div className="sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-400/30 bg-cyan-500/[0.06] p-3 backdrop-blur">
              <div className="text-sm">
                <span className="font-semibold text-cyan-200 tabular-nums">{selected.size}</span>
                <span className="text-muted-foreground"> selected · </span>
                <span className="font-semibold tabular-nums">{fmtMoney(selectedTotal)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setSelected(new Set())} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">Clear</button>
                {canApproveSelected && (
                  <button onClick={batchApprove} disabled={approve.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/25 disabled:opacity-50">
                    <Zap className="h-3.5 w-3.5" /> Approve {selected.size}
                  </button>
                )}
                {canPaySelected && (
                  <button onClick={batchMarkPaid} disabled={markPaid.isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/25 disabled:opacity-50">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark {selected.size} paid
                  </button>
                )}
                <button onClick={batchHold} disabled={setPayout.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-500/25 disabled:opacity-50">
                  <PauseCircle className="h-3.5 w-3.5" /> Hold
                </button>
                <button onClick={() => exportCsv(selectedRows, `payouts-batch-${Date.now()}.csv`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200">
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
              </div>
            </div>
          )}

          {/* Queue table */}
          <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur">
            {q.isLoading ? (
              <TableSkeleton />
            ) : rows.length === 0 ? (
              <EmptyPayouts status={status} onReset={() => setStatus("all")} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead className="bg-muted/10">
                    <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <th className="px-4 py-3 w-8">
                        <input type="checkbox"
                          className="h-3.5 w-3.5 rounded border-border/70 bg-background/60 accent-cyan-500"
                          checked={eligibleForBatch.length > 0 && eligibleForBatch.every((id) => selected.has(id))}
                          onChange={toggleSelectAll} />
                      </th>
                      <th className="px-4 py-3">Partner</th>
                      <th className="px-4 py-3 text-right">Referrals</th>
                      <th className="px-4 py-3 text-right">Approved commission</th>
                      <th className="px-4 py-3 text-right">Adjustments</th>
                      <th className="px-4 py-3 text-right">Final payout</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Release date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-3 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const selectable = r.payout_status === "pending" || r.payout_status === "approved";
                      const isSelected = selected.has(r.id);
                      const delayed = isDelayed(r);
                      const commission = Number(r.commission_amount ?? 0);
                      const releaseDate =
                        r.payout_status === "paid" ? r.payout_paid_at :
                        r.payout_status === "approved" ? r.payout_approved_at :
                        null;
                      return (
                        <tr key={r.id}
                          className={`group cursor-pointer border-t border-border/40 transition-colors hover:bg-muted/15 ${isSelected ? "bg-cyan-500/[0.04]" : ""} ${delayed ? "ring-1 ring-inset ring-rose-400/15" : ""}`}
                          onClick={() => setPreview(r)}
                        >
                          <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                            {selectable && (
                              <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(r.id)}
                                className="h-3.5 w-3.5 rounded border-border/70 bg-background/60 accent-cyan-500" />
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            {r.partner ? (
                              <div className="min-w-0">
                                <div className="truncate font-medium">{r.partner.full_name}</div>
                                <div className="truncate text-xs text-muted-foreground">
                                  {r.partner.company || r.partner.email}
                                </div>
                              </div>
                            ) : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="tabular-nums">1</div>
                            <div className="truncate text-[10px] text-muted-foreground">{r.client_name}</div>
                          </td>
                          <td className="px-4 py-3.5 text-right tabular-nums">{fmtMoney(commission)}</td>
                          <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">—</td>
                          <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-cyan-200">{fmtMoney(commission)}</td>
                          <td className="px-4 py-3.5">
                            <MethodBadge method={r.partner?.payout_method ?? null} />
                          </td>
                          <td className="px-4 py-3.5">
                            {releaseDate ? (
                              <div className="flex items-center gap-1.5 text-xs">
                                <CalendarClock className={`h-3 w-3 ${delayed ? "text-rose-300" : "text-muted-foreground"}`} />
                                <span className={delayed ? "text-rose-200" : ""}>{fmtDate(releaseDate)}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                            {delayed && (
                              <div className="mt-0.5 text-[10px] text-rose-300">
                                Delayed {Math.floor((now - new Date(r.payout_approved_at!).getTime()) / (24 * 3600 * 1000))}d
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            {delayed ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-200">
                                <AlertTriangle className="h-2.5 w-2.5" /> Delayed
                              </span>
                            ) : r.payout_status === "approved" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-cyan-200">
                                <CalendarClock className="h-2.5 w-2.5" /> Scheduled
                              </span>
                            ) : (
                              <PayoutChip status={r.payout_status} />
                            )}
                          </td>
                          <td className="px-2 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <RowMenu
                              row={r}
                              onReview={() => setPreview(r)}
                              onApprove={() => approve.mutate(r.id)}
                              onHold={() => setPayout.mutate({ id: r.id, payout_status: "on_hold" })}
                              onResume={() => setPayout.mutate({ id: r.id, payout_status: "pending" })}
                              onMarkPaid={() => markPaid.mutate(r.id)}
                              onDownload={() => exportCsv([r], `statement-${r.id.slice(0, 8)}.csv`)}
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

        {/* Right rail */}
        <aside className="space-y-3">
          {/* Payout policy card */}
          <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/70 to-card/40 p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/25">
                <ShieldCheck className="h-3 w-3" />
              </span>
              <p className="text-[11px] font-semibold tracking-tight">Payout Policy</p>
            </div>
            <dl className="mt-3 space-y-2.5 text-sm">
              <PolicyRow label="Payout cycle" value="Monthly (5th)" />
              <PolicyRow label="Minimum threshold" value={fmtMoney(5000)} />
              <PolicyRow label="Approval SLA" value={`${DELAY_DAYS} days from approval`} />
              <PolicyRow label="Approval required by" value="Finance admin" />
            </dl>
            <div className="mt-3 rounded-lg border border-border/50 bg-background/30 p-2.5 text-[11px] text-muted-foreground">
              Only referrals with a deal value and commission % can be approved. Once paid, entries are locked to preserve audit trail.
            </div>
          </div>

          {/* Cash flow snapshot */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cash flow snapshot</p>
            <div className="mt-3 space-y-2">
              <FlowRow label="Awaiting review" value={fmtMoney(summary.pending)} tone="amber" />
              <FlowRow label="Ready for release" value={fmtMoney(summary.approved)} tone="cyan" />
              <FlowRow label="On hold" value={fmtMoney(summary.onHold)} tone="muted" />
              <div className="mt-1.5 border-t border-border/40 pt-2">
                <FlowRow label="Paid this month" value={fmtMoney(summary.paidThisMonth)} tone="emerald" bold />
                <FlowRow label="Paid lifetime" value={fmtMoney(summary.paidLifetime)} tone="muted" />
              </div>
            </div>
          </div>

          {/* Reporting quick actions */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Reports</p>
            <div className="mt-3 space-y-1.5">
              <ReportBtn label="Monthly payout report" hint="Paid this month · CSV"
                onClick={() => {
                  const start = new Date(); start.setDate(1); start.setHours(0,0,0,0);
                  exportCsv(
                    withCommission.filter((r) => r.payout_status === "paid" && r.payout_paid_at && new Date(r.payout_paid_at) >= start),
                    `payouts-month-${Date.now()}.csv`
                  );
                }} />
              <ReportBtn label="Pending queue report" hint="Awaiting review · CSV"
                onClick={() => exportCsv(withCommission.filter((r) => r.payout_status === "pending"), `payouts-pending-${Date.now()}.csv`)} />
              <ReportBtn label="Delayed releases report" hint={`Approved > ${DELAY_DAYS}d · CSV`}
                onClick={() => exportCsv(delayedRows, `payouts-delayed-${Date.now()}.csv`)} />
              <ReportBtn label="Full ledger export" hint="Every commission · CSV"
                onClick={() => exportCsv(withCommission, `payouts-full-${Date.now()}.csv`)} />
            </div>
          </div>
        </aside>
      </div>

      {preview && <PreviewDrawer row={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

/* -------------- building blocks -------------- */

function KpiCard({
  tone, icon: Icon, label, value, sub, onClick, badge,
}: {
  tone: "amber" | "cyan" | "emerald" | "violet";
  icon: any; label: string; value: string; sub?: string;
  onClick?: () => void;
  badge?: { label: string; tone: "rose" | "amber" };
}) {
  const map = {
    amber:   { text: "text-amber-200",   ring: "ring-amber-400/25",   bg: "bg-amber-500/10   text-amber-300",   accent: "from-amber-500/10 to-transparent" },
    cyan:    { text: "text-cyan-200",    ring: "ring-cyan-400/25",    bg: "bg-cyan-500/10    text-cyan-300",    accent: "from-cyan-500/10 to-transparent" },
    emerald: { text: "text-emerald-200", ring: "ring-emerald-400/25", bg: "bg-emerald-500/10 text-emerald-300", accent: "from-emerald-500/10 to-transparent" },
    violet:  { text: "text-violet-200",  ring: "ring-violet-400/25",  bg: "bg-violet-500/10  text-violet-300",  accent: "from-violet-500/10 to-transparent" },
  }[tone];
  const badgeCls = badge?.tone === "rose"
    ? "border-rose-400/30 bg-rose-500/10 text-rose-200"
    : "border-amber-400/30 bg-amber-500/10 text-amber-200";
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-4 text-left transition ${onClick ? "hover:border-cyan-400/40 hover:bg-card/80" : "cursor-default"}`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${map.accent}`} />
      <div className="relative flex items-start justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${map.bg} ${map.ring}`}>
          <Icon className="h-4 w-4" />
        </span>
        {badge && (
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeCls}`}>
            <AlertTriangle className="h-2.5 w-2.5" /> {badge.label}
          </span>
        )}
      </div>
      <p className="relative mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`relative mt-0.5 truncate text-xl font-semibold tabular-nums tracking-tight ${map.text}`}>{value}</p>
      {sub && <p className="relative mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </button>
  );
}

function StatusChip({
  active, label, count, amount, tone, onClick,
}: {
  active: boolean; label: string; count: number; amount: number;
  tone?: "amber" | "cyan" | "emerald" | "rose"; onClick: () => void;
}) {
  const toneCls =
    tone === "amber" ? "border-amber-400/40 bg-amber-500/10 text-amber-100" :
    tone === "cyan"  ? "border-cyan-400/40  bg-cyan-500/10  text-cyan-100"  :
    tone === "emerald" ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100" :
    tone === "rose"  ? "border-rose-400/40  bg-rose-500/10  text-rose-100"  :
    "border-cyan-400/40 bg-cyan-500/10 text-cyan-100";
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
        active ? toneCls : "border-border/70 bg-card/50 text-muted-foreground hover:text-foreground"
      }`}>
      {label}
      <span className="rounded-full bg-background/60 px-1.5 py-0.5 text-[10px] tabular-nums">{count}</span>
      {amount > 0 && (
        <span className="hidden text-[10px] text-muted-foreground/80 tabular-nums sm:inline">· {fmtMoney(amount)}</span>
      )}
    </button>
  );
}

function MethodBadge({ method }: { method: string | null }) {
  if (!method) return <span className="text-xs text-muted-foreground">Not set</span>;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-background/40 px-1.5 py-0.5 text-[11px] text-foreground">
      <Wallet className="h-2.5 w-2.5 text-muted-foreground" /> {method}
    </span>
  );
}

function PolicyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/30 px-2.5 py-1.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-xs font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function FlowRow({
  label, value, tone, bold,
}: { label: string; value: string; tone: "amber" | "cyan" | "emerald" | "muted"; bold?: boolean }) {
  const cls =
    tone === "amber"   ? "text-amber-200"   :
    tone === "cyan"    ? "text-cyan-200"    :
    tone === "emerald" ? "text-emerald-200" :
    "text-foreground";
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${bold ? "text-sm font-semibold" : "text-sm"} ${cls}`}>{value}</span>
    </div>
  );
}

function ReportBtn({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg border border-border/40 bg-background/30 px-2.5 py-2 text-left transition hover:border-cyan-400/40 hover:bg-cyan-500/[0.04]">
      <div>
        <div className="text-xs font-medium">{label}</div>
        <div className="text-[10px] text-muted-foreground">{hint}</div>
      </div>
      <Download className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

function RowMenu({
  row, onReview, onApprove, onHold, onResume, onMarkPaid, onDownload,
}: {
  row: any;
  onReview: () => void; onApprove: () => void; onHold: () => void;
  onResume: () => void; onMarkPaid: () => void; onDownload: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const status = row.payout_status as ReferralPayoutStatus;
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted/30 hover:text-foreground">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-52 overflow-hidden rounded-lg border border-border/70 bg-popover/95 shadow-lg backdrop-blur">
          <MenuBtn icon={<Eye className="h-3.5 w-3.5" />} label="Review" onClick={() => { onReview(); setOpen(false); }} />
          {status === "pending" && (
            <MenuBtn icon={<BadgeCheck className="h-3.5 w-3.5 text-cyan-300" />} label="Approve"
              onClick={() => { onApprove(); setOpen(false); }} />
          )}
          {status === "approved" && (
            <MenuBtn icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />} label="Mark paid"
              onClick={() => { onMarkPaid(); setOpen(false); }} />
          )}
          {(status === "pending" || status === "approved") && (
            <MenuBtn icon={<PauseCircle className="h-3.5 w-3.5 text-amber-300" />} label="Put on hold"
              onClick={() => { onHold(); setOpen(false); }} />
          )}
          {status === "on_hold" && (
            <MenuBtn icon={<BadgeCheck className="h-3.5 w-3.5" />} label="Resume"
              onClick={() => { onResume(); setOpen(false); }} />
          )}
          <div className="border-t border-border/40" />
          <MenuBtn icon={<Download className="h-3.5 w-3.5" />} label="Download statement"
            onClick={() => { onDownload(); setOpen(false); }} />
          <Link to="/admin/affiliates/referrals/$id" params={{ id: row.id }}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 border-t border-border/40 px-3 py-2 text-xs hover:bg-muted/30">
            <ArrowRight className="h-3.5 w-3.5" /> Open referral
          </Link>
        </div>
      )}
    </div>
  );
}
function MenuBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-muted/30">
      {icon} {label}
    </button>
  );
}

function PreviewDrawer({ row, onClose }: { row: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border/60 bg-card/95 p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase text-muted-foreground">#{row.id.slice(0, 8)}</div>
            <h3 className="mt-1 text-lg font-semibold">Payout review</h3>
            <p className="text-xs text-muted-foreground">{row.partner?.full_name ?? "—"} → {row.client_name}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted/30">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-4"><PayoutChip status={row.payout_status} /></div>
        <div className="rounded-xl border border-border/50 bg-background/40 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">Approved commission
            <span className="font-medium tabular-nums text-foreground">{fmtMoney(row.commission_amount)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">Adjustments
            <span className="tabular-nums">—</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-sm">
            <span className="font-semibold">Final payout</span>
            <span className="font-semibold tabular-nums text-cyan-200">{fmtMoney(row.commission_amount)}</span>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Info label="Deal value" value={fmtMoney(row.deal_value)} />
          <Info label="Method" value={row.partner?.payout_method ?? "Not set"} />
          <Info label="Partner email" value={row.partner?.email ?? "—"} />
          <Info label="Company" value={row.company ?? "—"} />
          <Info label="Referral date" value={fmtDate(row.referral_date)} />
          <Info label="Approved" value={fmtDate(row.payout_approved_at)} />
          <Info label="Paid" value={fmtDate(row.payout_paid_at)} />
          <Info label="Status" value={row.payout_status} />
        </dl>
        <div className="mt-5 flex gap-2">
          <Link to="/admin/affiliates/referrals/$id" params={{ id: row.id }}
            className="flex-1 rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-center text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200">
            Open full referral
          </Link>
        </div>
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 tabular-nums">{value}</dd>
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

function EmptyPayouts({ status, onReset }: { status: FilterStatus; onReset: () => void }) {
  type Copy = {
    title: string;
    body: string;
    icon: any;
    primary?: { label: string; to?: string; onClick?: () => void };
    secondary?: { label: string; to?: string; onClick?: () => void };
  };
  const map: Partial<Record<FilterStatus, Copy>> = {
    all: {
      title: "No commissions yet",
      body: "Once partners close deals, commissions land here for review and payout. Start by activating partners and confirming your commission rules.",
      icon: Wallet,
      primary: { label: "Review partners", to: "/admin/affiliates/partners" },
      secondary: { label: "See referral pipeline", to: "/admin/affiliates/referrals" },
    },
    pending: {
      title: "Payout queue is clear",
      body: "No commissions are waiting for review. New wins from partners will appear here the moment a deal is marked won.",
      icon: CheckCircle2,
      primary: { label: "View all commissions", onClick: onReset },
      secondary: { label: "Open referral pipeline", to: "/admin/affiliates/referrals" },
    },
    approved: {
      title: "Nothing approved yet",
      body: "Approved commissions wait here until you mark them paid. Review pending payouts and approve them to release funds to partners.",
      icon: ShieldCheck,
      primary: { label: "Review pending", onClick: () => { /* handled by parent via reset then user filters */ onReset(); } },
      secondary: { label: "View all commissions", onClick: onReset },
    },
    scheduled: {
      title: "Nothing scheduled",
      body: "Approved payouts stay here until they're marked paid. Approve pending payouts to build the release queue.",
      icon: CalendarClock,
      primary: { label: "Review pending", onClick: onReset },
    },
    paid: {
      title: "No paid payouts yet",
      body: "Once you mark approved payouts as paid, they show here for the audit trail. Approve outstanding payouts to move them forward.",
      icon: BadgeCheck,
      primary: { label: "Review pending", onClick: onReset },
    },
    on_hold: {
      title: "Nothing on hold",
      body: "Payouts you flag for review appear here until you resume them. Use hold when a deal needs verification before release.",
      icon: PauseCircle,
      primary: { label: "View all commissions", onClick: onReset },
    },
    delayed: {
      title: "No delayed payouts",
      body: `You're on schedule — nothing approved has been sitting for more than ${DELAY_DAYS} days. Keep releasing payouts on cycle to stay clear.`,
      icon: Zap,
      primary: { label: "Review approved queue", onClick: onReset },
    },
  };
  const m = map[status] ?? map.all!;
  const Icon = m.icon;
  return (
    <div className="relative overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.10),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-md place-items-center gap-3 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-teal-500/10 text-cyan-200 ring-1 ring-cyan-400/25 shadow-[0_8px_24px_-10px_rgba(34,211,238,0.45)]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{m.title}</p>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">{m.body}</p>
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {m.primary && (
            m.primary.to ? (
              <Link
                to={m.primary.to}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_6px_18px_-6px_rgba(34,211,238,0.55)] transition hover:brightness-110"
              >
                {m.primary.label}
              </Link>
            ) : (
              <button
                onClick={m.primary.onClick}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_6px_18px_-6px_rgba(34,211,238,0.55)] transition hover:brightness-110"
              >
                {m.primary.label}
              </button>
            )
          )}
          {m.secondary && (
            m.secondary.to ? (
              <Link
                to={m.secondary.to}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:border-cyan-400/40 hover:text-cyan-200"
              >
                {m.secondary.label}
              </Link>
            ) : (
              <button
                onClick={m.secondary.onClick}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:border-cyan-400/40 hover:text-cyan-200"
              >
                {m.secondary.label}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}


const fsel = "rounded-lg border border-border/70 bg-background/40 px-2.5 py-1.5 text-xs outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20";

// silence unused imports if any
void PAYOUT_STATUSES;
