import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Wallet, CheckCircle2, Clock, CalendarClock, TrendingUp, Download, Info,
  ShieldCheck, Sparkles, ArrowUpRight, ArrowDownRight, FileText, ChevronRight,
  AlertTriangle, RefreshCw, BookOpen, Copy,
} from "lucide-react";
import { listMyReferrals, getMyStats } from "@/lib/partners.functions";
import { fmtDate, fmtMoney, PayoutChip } from "@/lib/partners-ui";
import { useOpenNewReferral } from "@/components/partner/new-referral-context";
import { PartnerEmptyState, CoinsIllustration } from "@/components/partner/EmptyState";

export const Route = createFileRoute("/partner/earnings")({
  component: EarningsPage,
});

type TxStatus = "pending" | "approved" | "processed" | "paid";
const TX_STYLES: Record<TxStatus, string> = {
  pending:   "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  approved:  "bg-blue-500/15 text-blue-300 border-blue-500/30",
  processed: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  paid:      "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};
const TX_LABEL: Record<TxStatus, string> = { pending: "Pending", approved: "Approved", processed: "Processed", paid: "Paid" };

function EarningsPage() {
  const statsFn = useServerFn(getMyStats);
  const listFn = useServerFn(listMyReferrals);
  const s = useQuery({ queryKey: ["partner", "stats"], queryFn: () => statsFn() });
  const l = useQuery({ queryKey: ["partner", "referrals"], queryFn: () => listFn() });
  const openNewReferral = useOpenNewReferral();
  const [ledgerFilter, setLedgerFilter] = useState<"all" | TxStatus>("all");

  const list = l.data ?? [];
  const earning = list.filter((r) => r.commission_amount && r.commission_amount > 0);

  const now = new Date();
  const nextPayout = useMemo(() => { const d = new Date(); d.setMonth(d.getMonth() + 1, 5); d.setHours(0,0,0,0); return d; }, []);
  const daysToPayout = Math.max(0, Math.ceil((nextPayout.getTime() - now.getTime()) / (24 * 3600 * 1000)));
  const cutoff = useMemo(() => { const d = new Date(); d.setMonth(d.getMonth() + 1, 1); return d; }, []);

  const thisMonthEarnings = useMemo(() => {
    const y = now.getFullYear(), m = now.getMonth();
    return earning.reduce((sum, r) => {
      const d = new Date(r.updated_at || r.referral_date);
      return d.getFullYear() === y && d.getMonth() === m ? sum + Number(r.commission_amount ?? 0) : sum;
    }, 0);
  }, [earning]);

  const lastMonthEarnings = useMemo(() => {
    const d0 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const y = d0.getFullYear(), m = d0.getMonth();
    return earning.reduce((sum, r) => {
      const d = new Date(r.updated_at || r.referral_date);
      return d.getFullYear() === y && d.getMonth() === m ? sum + Number(r.commission_amount ?? 0) : sum;
    }, 0);
  }, [earning]);

  const momDelta = lastMonthEarnings === 0
    ? (thisMonthEarnings > 0 ? { dir: "up" as const, value: "New" } : null)
    : (() => {
      const pct = Math.round(((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100);
      return { dir: pct >= 0 ? "up" as const : "down" as const, value: `${pct >= 0 ? "+" : ""}${pct}%` };
    })();

  // 6-month sparkline series
  const trend = useMemo(() => {
    const months: { key: string; label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString(undefined, { month: "short" }), value: 0 });
    }
    for (const r of earning) {
      const d = new Date(r.updated_at || r.referral_date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = months.find((m) => m.key === key);
      if (bucket) bucket.value += Number(r.commission_amount ?? 0);
    }
    return months;
  }, [earning]);

  // Map referral -> payout tx status
  const txOf = (r: any): TxStatus => {
    if (r.payout_status === "paid") return "paid";
    if (r.payout_status === "approved") return daysToPayout <= 3 ? "processed" : "approved";
    return "pending";
  };

  const filteredEarning = ledgerFilter === "all" ? earning : earning.filter((r) => txOf(r) === ledgerFilter);
  const counts = {
    all: earning.length,
    pending: earning.filter((r) => txOf(r) === "pending").length,
    approved: earning.filter((r) => txOf(r) === "approved").length,
    processed: earning.filter((r) => txOf(r) === "processed").length,
    paid: earning.filter((r) => txOf(r) === "paid").length,
  };

  const totalCommission = Number(s.data?.commissionTotal ?? 0);
  const paidTotal = Number(s.data?.paidTotal ?? 0);
  const pendingPayout = Number(s.data?.pendingPayout ?? 0);

  const exportCsv = () => {
    const rows = [
      ["Client", "Company", "Package", "Deal Value", "Commission %", "Commission", "Payout Status", "Payout Stage", "Date"],
      ...earning.map((r) => [
        r.client_name, r.company ?? "", r.package_selected ?? "",
        Number(r.deal_value ?? 0), Number(r.commission_pct ?? 0),
        Number(r.commission_amount ?? 0), r.payout_status, TX_LABEL[txOf(r)],
        new Date(r.updated_at || r.referral_date).toISOString().slice(0, 10),
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `earnings-statement-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-5 sm:p-7">
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] uppercase tracking-widest text-emerald-200">
              <ShieldCheck className="h-3 w-3" /> Verified partner earnings
            </div>
            <h1 className="mt-3 truncate text-2xl sm:text-3xl font-semibold tracking-tight">Earnings & Payouts</h1>
            <p className="mt-1.5 text-sm text-slate-400 max-w-xl">Review every commission you've earned, monitor payouts in progress, and view a complete history of payments already released to your account.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={exportCsv}
              disabled={earning.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" /> Export statement
            </button>
          </div>
        </div>

        {/* Hero stats grid */}
        <div className="relative mt-6 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <HeroMoney tint="from-teal-500/25 to-cyan-500/5" icon={Wallet} label="Total earnings" value={fmtMoney(totalCommission)} sub="Lifetime commission" loading={s.isLoading} />
          <HeroMoney tint="from-amber-500/25 to-orange-500/5" icon={Clock} label="Pending payout" value={fmtMoney(pendingPayout)} sub={`Releases in ${daysToPayout} days`} loading={s.isLoading} />
          <HeroMoney tint="from-emerald-500/25 to-teal-500/5" icon={CheckCircle2} label="Paid to date" value={fmtMoney(paidTotal)} sub="Successfully cleared" loading={s.isLoading} />
          <HeroMoney tint="from-violet-500/25 to-fuchsia-500/5" icon={TrendingUp} label="This month" value={fmtMoney(thisMonthEarnings)} sub={momDelta ? `${momDelta.value} vs. last month` : "First month of earnings"} delta={momDelta ?? undefined} loading={l.isLoading} />
        </div>
      </section>

      {/* Errors */}
      {(s.error || l.error) && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-500/15 text-rose-300"><AlertTriangle className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-rose-100">We couldn't load your earnings</p>
            <p className="text-xs text-rose-200/80 truncate">{((s.error ?? l.error) as any)?.message ?? "Unknown error"}</p>
          </div>
          <button onClick={() => { s.refetch(); l.refetch(); }} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs font-medium text-rose-100 hover:bg-rose-400/20">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Trend + Payout cycle */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">Earnings trend</h2>
              <p className="text-xs text-slate-400">Commission earned over the last 6 months</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">6-month total</div>
              <div className="text-lg font-semibold tabular-nums">{fmtMoney(trend.reduce((a, b) => a + b.value, 0))}</div>
            </div>
          </div>
          <div className="mt-5">
            <EarningsChart data={trend} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/5 bg-gradient-to-br from-teal-500/10 via-white/[0.02] to-transparent p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/20"><CalendarClock className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-teal-300/80">Payout cycle</p>
              <h3 className="mt-0.5 truncate text-base font-semibold">Next payout · {fmtDate(nextPayout.toISOString())}</h3>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-white/5 bg-slate-950/40 p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Amount</div>
                <div className="text-2xl font-semibold text-amber-300 tabular-nums">{fmtMoney(pendingPayout)}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">In</div>
                <div className="text-lg font-semibold tabular-nums">{daysToPayout}d</div>
              </div>
            </div>
            <PayoutProgress days={daysToPayout} />
          </div>
          <ol className="mt-5 space-y-3">
            <TimelineStep title="Cutoff for approvals" meta={fmtDate(cutoff.toISOString())} state="done" />
            <TimelineStep title="Processing initiated" meta="1st of every month" state="active" />
            <TimelineStep title="Payout released" meta={`5th · ${fmtDate(nextPayout.toISOString())}`} state="upcoming" />
          </ol>
        </section>
      </div>

      {/* Breakdown + Policy */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-white/5">
            <div>
              <h2 className="text-sm font-semibold">Payout history</h2>
              <p className="text-xs text-slate-400">Commission breakdown per referral, with payout stage.</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(["all", "pending", "approved", "processed", "paid"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setLedgerFilter(k)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition ${
                    ledgerFilter === k
                      ? "bg-gradient-to-r from-teal-400/15 to-cyan-500/10 text-teal-100 ring-1 ring-teal-400/25"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                  }`}
                >
                  {k === "all" ? "All" : TX_LABEL[k]}
                  <span className={`inline-flex min-w-[18px] justify-center rounded-full px-1 text-[10px] ${ledgerFilter === k ? "bg-teal-400/20 text-teal-100" : "bg-white/5 text-slate-500"}`}>
                    {counts[k]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {l.isLoading ? (
            <LedgerSkeleton />
          ) : earning.length === 0 ? (
            <EarningsEmpty onOpen={openNewReferral} />
          ) : filteredEarning.length === 0 ? (
            <div className="p-5">
              <PartnerEmptyState
                icon={Wallet}
                tone="indigo"
                compact
                title="No payouts in this stage right now"
                body="There are no commissions at this payout stage yet. Switch to another tab to review activity, or keep the pipeline moving by submitting a new referral."
                cta={{ label: "Submit a new referral", onClick: openNewReferral, icon: Sparkles }}
                quickLinks={[
                  { label: "View all payouts", onClick: () => setLedgerFilter("all"), icon: ArrowUpRight },
                  { label: "Review commission policy", to: "/partner/profile", icon: BookOpen },
                ]}
              />
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm min-w-[860px]">
                  <thead className="text-left text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                    <tr>
                      <th className="px-5 py-3 font-medium">Client / Deal</th>
                      <th className="px-5 py-3 font-medium">Deal value</th>
                      <th className="px-5 py-3 font-medium">Rate</th>
                      <th className="px-5 py-3 font-medium text-right">Commission</th>
                      <th className="px-5 py-3 font-medium">Payout stage</th>
                      <th className="px-5 py-3 font-medium">Payout state</th>
                      <th className="px-5 py-3 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEarning.map((r) => {
                      const tx = txOf(r);
                      return (
                        <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                          <td className="px-5 py-3.5">
                            <div className="font-medium truncate">{r.client_name}</div>
                            <div className="truncate text-xs text-slate-500">{r.company ?? "—"} · {r.package_selected ?? "—"}</div>
                          </td>
                          <td className="px-5 py-3.5 tabular-nums whitespace-nowrap">{fmtMoney(r.deal_value)}</td>
                          <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{r.commission_pct ?? "—"}%</td>
                          <td className="px-5 py-3.5 text-right font-semibold text-emerald-300 tabular-nums whitespace-nowrap">{fmtMoney(r.commission_amount)}</td>
                          <td className="px-5 py-3.5"><TxChip status={tx} /></td>
                          <td className="px-5 py-3.5"><PayoutChip status={r.payout_status} /></td>
                          <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{fmtDate(r.updated_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden grid gap-3 p-4">
                {filteredEarning.map((r) => {
                  const tx = txOf(r);
                  return (
                    <div key={r.id} className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-medium">{r.client_name}</div>
                          <div className="truncate text-xs text-slate-500">{r.company ?? "—"} · {r.package_selected ?? "—"}</div>
                        </div>
                        <TxChip status={tx} />
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-500">Deal</div>
                          <div className="tabular-nums">{fmtMoney(r.deal_value)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-500">Rate</div>
                          <div>{r.commission_pct ?? "—"}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500">Commission</div>
                          <div className="font-semibold text-emerald-300 tabular-nums">{fmtMoney(r.commission_amount)}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <PayoutChip status={r.payout_status} />
                        <span className="text-xs text-slate-500">{fmtDate(r.updated_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* Policy */}
        <aside className="space-y-4">
          <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/15 text-indigo-300"><Info className="h-4 w-4" /></span>
              <h3 className="text-sm font-semibold">Commission policy</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <PolicyItem label="Standard rate" value="10% of closed deal value" />
              <PolicyItem label="Enterprise deals" value="Up to 15% (per agreement)" />
              <PolicyItem label="Approval SLA" value="Within 5 business days of deal close" />
              <PolicyItem label="Payout cadence" value="Monthly, on the 5th" />
              <PolicyItem label="Minimum payout" value="₹1,000" />
              <PolicyItem label="Payment methods" value="Bank transfer, UPI" />
            </ul>
            <div className="mt-5 rounded-xl border border-white/5 bg-slate-950/40 p-3 flex items-start gap-3">
              <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">Read the full partner agreement for tax, tiering, and clawback details.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-gradient-to-br from-teal-500/10 to-transparent p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500/15 text-teal-300"><Sparkles className="h-4 w-4" /></span>
              <h3 className="text-sm font-semibold">Grow your earnings</h3>
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">Submit one referral this week — the average partner earns 3× more within 90 days.</p>
            <button onClick={openNewReferral} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-3.5 py-2 text-sm shadow-lg shadow-teal-500/25 hover:brightness-110 transition">
              Submit a referral <ChevronRight className="h-4 w-4" />
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ---------- pieces ---------- */

function HeroMoney({ tint, icon: Icon, label, value, sub, delta, loading }: {
  tint: string; icon: any; label: string; value: string; sub: string;
  delta?: { dir: "up" | "down"; value: string }; loading?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 p-5">
      <div className={`absolute inset-x-0 -top-12 h-24 bg-gradient-to-b ${tint} blur-2xl opacity-70`} />
      <div className="relative flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-widest text-slate-400">{label}</p>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-200"><Icon className="h-4 w-4" /></span>
      </div>
      {loading ? (
        <div className="mt-3 h-7 w-24 rounded bg-white/10 animate-pulse" />
      ) : (
        <p className="relative mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      )}
      <div className="relative mt-1 flex items-center gap-2 text-xs text-slate-500">
        {delta && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${delta.dir === "up" ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>
            {delta.dir === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta.value}
          </span>
        )}
        <span className="truncate">{sub}</span>
      </div>
    </div>
  );
}

function EarningsChart({ data }: { data: { label: string; value: number }[] }) {
  const w = 640, h = 180, padL = 40, padR = 16, padT = 12, padB = 28;
  const max = Math.max(1, ...data.map((d) => d.value));
  const nice = niceMax(max);
  const cw = w - padL - padR;
  const ch = h - padT - padB;
  const step = data.length > 1 ? cw / (data.length - 1) : cw;
  const points = data.map((d, i) => {
    const x = padL + i * step;
    const y = padT + ch - (d.value / nice) * ch;
    return { x, y, ...d };
  });
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${padT + ch} L${points[0].x},${padT + ch} Z`;
  const grid = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-[200px]">
        <defs>
          <linearGradient id="earnArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(45 212 191)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(45 212 191)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {grid.map((g, i) => {
          const y = padT + ch * g;
          const val = nice * (1 - g);
          return (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 4" />
              <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="rgba(148,163,184,0.7)">
                {shortMoney(val)}
              </text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#earnArea)" />
        <path d={linePath} fill="none" stroke="rgb(45 212 191)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="rgb(15 23 42)" stroke="rgb(45 212 191)" strokeWidth="1.5" />
            <text x={p.x} y={h - 8} textAnchor="middle" fontSize="10" fill="rgba(148,163,184,0.9)">{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function niceMax(n: number) {
  if (n <= 0) return 1000;
  const pow = Math.pow(10, Math.floor(Math.log10(n)));
  const norm = n / pow;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return nice * pow;
}
function shortMoney(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  if (n >= 1e3) return `₹${Math.round(n / 1e3)}k`;
  return `₹${Math.round(n)}`;
}

function PayoutProgress({ days }: { days: number }) {
  const total = 30;
  const pct = Math.max(4, Math.min(100, Math.round(((total - days) / total) * 100)));
  return (
    <div className="mt-4">
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-wider text-slate-500">
        <span>Cycle start</span><span>Payout</span>
      </div>
    </div>
  );
}

function TimelineStep({ title, meta, state }: { title: string; meta: string; state: "done" | "active" | "upcoming" }) {
  const dot = state === "done" ? "bg-emerald-400" : state === "active" ? "bg-teal-300 ring-4 ring-teal-400/20" : "bg-white/20";
  const text = state === "upcoming" ? "text-slate-400" : "text-slate-100";
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <div className="min-w-0 flex-1">
        <div className={`text-sm ${text}`}>{title}</div>
        <div className="text-xs text-slate-500">{meta}</div>
      </div>
    </li>
  );
}

function TxChip({ status }: { status: TxStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TX_STYLES[status]}`}>
      {TX_LABEL[status]}
    </span>
  );
}

function PolicyItem({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-100 text-right">{value}</span>
    </li>
  );
}

function LedgerSkeleton() {
  return (
    <div className="p-5 space-y-3 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))] items-center gap-4">
          <div className="space-y-1.5">
            <div className="h-3 w-40 rounded bg-white/10" />
            <div className="h-2.5 w-24 rounded bg-white/5" />
          </div>
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="h-3 w-12 rounded bg-white/5" />
          <div className="h-4 w-20 rounded bg-emerald-500/10 justify-self-end" />
          <div className="h-5 w-16 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

function EarningsEmpty({ onOpen }: { onOpen: () => void }) {
  return (
    <PartnerEmptyState
      illustration={<CoinsIllustration />}
      tone="emerald"
      eyebrow="Your earnings will land here"
      title="No commissions yet — but they're on the way"
      body="Once one of your referrals closes, you'll see the commission calculated, its payout stage, and every payment we send you — all in one clean ledger."
      cta={{ label: "Submit your first referral", onClick: onOpen, icon: Sparkles }}
      quickLinks={[
        { label: "How commissions work", to: "/partner/profile", icon: BookOpen },
        { label: "Copy invite link", to: "/partner/profile", icon: Copy },
      ]}
      steps={[
        { title: "Deal closes", body: "We mark your referral as won." },
        { title: "Commission approved", body: "Reviewed within 5 business days." },
        { title: "Payout on the 5th", body: "Sent to your chosen method." },
      ]}
    />
  );
}
