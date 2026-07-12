import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Search, Download, Filter, Clock, AlertTriangle, ChevronRight, X, TrendingUp,
} from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { adminListReferrals, REFERRAL_STATUSES, type ReferralStatus } from "@/lib/partners.functions";
import { fmtDate, fmtMoney, StatusChip, PayoutChip, STATUS_LABEL, STATUS_DOT } from "@/lib/partners-ui";

export const Route = createFileRoute("/_authenticated/admin/affiliates/referrals")({
  beforeLoad: async () => { const r = await checkIsAdmin(); if (!r.isAdmin) throw notFound(); return {}; },
  component: AllReferralsPage,
  head: () => ({ meta: [{ title: "All Referrals — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

const STALL_DAYS = 14;
const STALL_MS = STALL_DAYS * 24 * 60 * 60 * 1000;
const OPEN_STATUSES = new Set(["new", "contacted", "in_discussion", "onboarding"]);

function AllReferralsPage() {
  const fn = useServerFn(adminListReferrals);
  const q = useQuery({ queryKey: ["admin", "referrals"], queryFn: () => fn() });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReferralStatus | "">("");
  const [partnerId, setPartnerId] = useState("");
  const [pkg, setPkg] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stalledOnly, setStalledOnly] = useState(false);

  const all = q.data ?? [];

  const partners = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of all) if (r.partner) seen.set(r.partner.id, r.partner.full_name);
    return Array.from(seen.entries());
  }, [all]);
  const packages = useMemo(() => Array.from(new Set(all.map((r) => r.package_selected).filter(Boolean) as string[])), [all]);

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { "": all.length };
    for (const r of all) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [all]);

  const now = Date.now();
  const isStalled = (r: any) => {
    if (!OPEN_STATUSES.has(r.status)) return false;
    const ts = new Date(r.last_activity_at ?? r.created_at).getTime();
    return now - ts > STALL_MS;
  };
  const stalledCount = useMemo(() => all.filter(isStalled).length, [all]);

  const rows = useMemo(() => {
    const s = search.trim().toLowerCase();
    return all.filter((r) => {
      if (status && r.status !== status) return false;
      if (partnerId && r.partner_id !== partnerId) return false;
      if (pkg && r.package_selected !== pkg) return false;
      if (from && r.referral_date < from) return false;
      if (to && r.referral_date > to) return false;
      if (stalledOnly && !isStalled(r)) return false;
      if (!s) return true;
      return (
        r.client_name.toLowerCase().includes(s) ||
        (r.company ?? "").toLowerCase().includes(s) ||
        (r.email ?? "").toLowerCase().includes(s) ||
        (r.partner?.full_name ?? "").toLowerCase().includes(s)
      );
    });
  }, [all, search, status, partnerId, pkg, from, to, stalledOnly]);

  const openPipelineValue = useMemo(
    () => rows.filter((r) => OPEN_STATUSES.has(r.status)).reduce((s, r) => s + Number(r.deal_value ?? 0), 0),
    [rows]
  );
  const totalCommission = useMemo(() => rows.reduce((s, r) => s + Number(r.commission_amount ?? 0), 0), [rows]);

  const exportCsv = () => {
    const headers = ["Date","Client","Company","Email","Phone","Service","Package","Partner","Status","Stage","Deal","Commission","Payout"];
    const lines = [headers.join(",")];
    for (const r of rows) {
      const row = [r.referral_date, r.client_name, r.company ?? "", r.email ?? "", r.phone ?? "",
        r.service_interested ?? "", r.package_selected ?? "", r.partner?.full_name ?? "",
        r.status, r.deal_stage, r.deal_value ?? "", r.commission_amount ?? "", r.payout_status];
      lines.push(row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `referrals-${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch(""); setStatus(""); setPartnerId(""); setPkg(""); setFrom(""); setTo(""); setStalledOnly(false);
  };
  const anyFilter = search || status || partnerId || pkg || from || to || stalledOnly;

  return (
    <div className="space-y-5">
      {/* Pipeline strip */}
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card/70 to-card/40 backdrop-blur">
        <header className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/25">
              <TrendingUp className="h-3 w-3" />
            </span>
            <div>
              <p className="text-[11px] font-semibold tracking-tight">Pipeline snapshot</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Referral funnel across selected view</p>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-[11px] text-muted-foreground sm:flex">
            <span>Open value <span className="ml-1 text-sm font-semibold text-cyan-200 tabular-nums">{fmtMoney(openPipelineValue)}</span></span>
            <span>Commission <span className="ml-1 text-sm font-semibold tabular-nums">{fmtMoney(totalCommission)}</span></span>
          </div>
        </header>
        <div className="grid grid-cols-3 divide-x divide-border/40 sm:grid-cols-6">
          {REFERRAL_STATUSES.map((s) => {
            const count = rows.filter((r) => r.status === s.value).length;
            return (
              <button
                key={s.value}
                onClick={() => setStatus(status === s.value ? "" : s.value)}
                className={`group px-3 py-3 text-left transition-colors hover:bg-muted/20 ${status === s.value ? "bg-cyan-500/[0.04]" : ""}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s.value]}`} />
                  {STATUS_LABEL[s.value]}
                </div>
                <p className="mt-1 text-lg font-semibold tabular-nums">{count}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search client, company, partner, email…"
              className="w-full rounded-xl border border-border/70 bg-card/60 pl-9 pr-3 py-2 text-sm outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20" />
          </div>

          <button
            onClick={() => setStalledOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
              stalledOnly
                ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
                : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Stalled
            <span className="rounded-full bg-background/60 px-1.5 py-0.5 text-[10px] tabular-nums">{stalledCount}</span>
          </button>

          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200">
            <Download className="h-3.5 w-3.5" /> Export ({rows.length})
          </button>

          {anyFilter && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
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
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className={fsel}>
            <option value="">All statuses</option>
            {REFERRAL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label} · {statusCounts[s.value] ?? 0}</option>)}
          </select>
          <select value={pkg} onChange={(e) => setPkg(e.target.value)} className={fsel}>
            <option value="">All packages</option>
            {packages.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            From
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={fsel} />
          </label>
          <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            To
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={fsel} />
          </label>
        </div>
      </div>

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur">
        {q.isLoading ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <div className="grid place-items-center gap-2 px-6 py-16 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-muted/30 text-muted-foreground ring-1 ring-border/60">
              <Search className="h-4 w-4" />
            </span>
            <p className="text-sm font-medium">No referrals match your filters</p>
            <p className="text-xs text-muted-foreground">Try clearing filters or widening the date range.</p>
            {anyFilter && (
              <button onClick={clearFilters} className="mt-1 rounded-lg border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-sm">
              <thead>
                <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Partner</th>
                  <th className="px-5 py-3 font-semibold">Service / Package</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Deal</th>
                  <th className="px-5 py-3 text-right font-semibold">Commission</th>
                  <th className="px-5 py-3 font-semibold">Payout</th>
                  <th className="px-5 py-3 font-semibold">Last activity</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const stalled = isStalled(r);
                  const activityTs = (r as any).last_activity_at ?? r.created_at;
                  return (
                    <tr key={r.id} className={`group border-t border-border/40 transition-colors hover:bg-muted/15 ${stalled ? "bg-amber-500/[0.02]" : ""}`}>
                      <td className="px-5 py-3.5">
                        <Link to="/admin/affiliates/referrals/$id" params={{ id: r.id }} className="hover:text-cyan-200">
                          <div className="flex items-center gap-2 font-medium">
                            {stalled && (
                              <span title={`No activity in ${STALL_DAYS}+ days`} className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30">
                                <AlertTriangle className="h-2.5 w-2.5" />
                              </span>
                            )}
                            <span className="truncate">{r.client_name}</span>
                          </div>
                          <div className="mt-0.5 truncate text-xs text-muted-foreground">{r.company ?? "—"}</div>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        {r.partner ? (
                          <Link to="/admin/affiliates/partners/$id" params={{ id: r.partner.id }} className="hover:text-cyan-200">
                            <div className="truncate">{r.partner.full_name}</div>
                            <div className="truncate text-xs text-muted-foreground">{r.partner.company ?? ""}</div>
                          </Link>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="truncate">{r.service_interested ?? "—"}</div>
                        <div className="truncate text-xs text-muted-foreground">{r.package_selected ?? ""}</div>
                      </td>
                      <td className="px-5 py-3.5"><StatusChip status={r.status} /></td>
                      <td className="px-5 py-3.5 text-right tabular-nums">{fmtMoney(r.deal_value)}</td>
                      <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-cyan-200">{fmtMoney(r.commission_amount)}</td>
                      <td className="px-5 py-3.5"><PayoutChip status={r.payout_status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className={`h-3 w-3 ${stalled ? "text-amber-300" : "text-muted-foreground"}`} />
                          <span className={stalled ? "text-amber-300" : "text-muted-foreground"}>{timeAgo(activityTs)}</span>
                        </div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">{fmtDate(r.referral_date)}</div>
                      </td>
                      <td className="px-3 py-3.5">
                        <Link to="/admin/affiliates/referrals/$id" params={{ id: r.id }} className="inline-flex text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-cyan-200">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
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

function TableSkeleton() {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/25" style={{ animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
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

const fsel = "rounded-lg border border-border/70 bg-card/60 px-2.5 py-1.5 text-xs outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20";
