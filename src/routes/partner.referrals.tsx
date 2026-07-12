import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Plus, Users, Filter, AlertTriangle, RefreshCw } from "lucide-react";
import { listMyReferrals, REFERRAL_STATUSES, type ReferralStatus } from "@/lib/partners.functions";
import { fmtDate, fmtMoney, StatusChip, PayoutChip } from "@/lib/partners-ui";
import { EmptyState } from "./partner";
import { useOpenNewReferral } from "@/components/partner/new-referral-context";

export const Route = createFileRoute("/partner/referrals")({
  component: MyReferralsPage,
});

function MyReferralsPage() {
  const listFn = useServerFn(listMyReferrals);
  const q = useQuery({ queryKey: ["partner", "referrals"], queryFn: () => listFn() });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReferralStatus | "">("");
  const openNewReferral = useOpenNewReferral();

  const rows = useMemo(() => {
    const items = q.data ?? [];
    const s = search.trim().toLowerCase();
    return items.filter((r) => {
      if (status && r.status !== status) return false;
      if (!s) return true;
      return (
        r.client_name.toLowerCase().includes(s) ||
        (r.company ?? "").toLowerCase().includes(s) ||
        (r.email ?? "").toLowerCase().includes(s) ||
        (r.package_selected ?? "").toLowerCase().includes(s)
      );
    });
  }, [q.data, search, status]);

  const hasData = (q.data ?? []).length > 0;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client, company, email…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20" />
          </div>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select value={status} onChange={(e) => setStatus(e.target.value as any)}
              className="appearance-none rounded-xl border border-white/10 bg-white/[0.02] pl-9 pr-8 py-2.5 text-sm outline-none focus:border-teal-400/50">
              <option value="">All statuses</option>
              {REFERRAL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <button onClick={openNewReferral} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-4 py-2.5 text-sm shadow-lg shadow-teal-500/20">
          <Plus className="h-4 w-4" /> New referral
        </button>
      </div>

      {q.error && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-500/15 text-rose-300">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-rose-100">We couldn't load your referrals</p>
            <p className="text-xs text-rose-200/80 truncate">{(q.error as any)?.message ?? "Unknown error"}</p>
          </div>
          <button onClick={() => q.refetch()} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs font-medium text-rose-100 hover:bg-rose-400/20">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      <section className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        {q.isLoading ? (
          <div className="p-5 space-y-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-40 rounded bg-white/10" />
                <div className="h-4 w-32 rounded bg-white/5" />
                <div className="h-4 w-24 rounded bg-white/5" />
                <div className="ml-auto h-4 w-16 rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : !hasData ? (
          <EmptyState
            icon={Users}
            title="No referrals yet"
            body="You haven't submitted any referrals. Introduce us to a business and start earning commissions."
            cta={{ onClick: openNewReferral, label: "Submit your first referral" }}
          />
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">No referrals match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="text-left text-xs text-slate-400 bg-white/[0.02]">
                <tr>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Service / Package</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Deal</th>
                  <th className="px-5 py-3 font-medium">Commission</th>
                  <th className="px-5 py-3 font-medium">Payout</th>
                  <th className="px-5 py-3 font-medium">Referred</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.03] transition">
                    <td className="px-5 py-3">
                      <Link to="/partner/referrals/$id" params={{ id: r.id }} className="hover:text-teal-300">
                        <div className="font-medium">{r.client_name}</div>
                        <div className="text-xs text-slate-500">{r.company ?? "—"}</div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      <div>{r.email ?? "—"}</div>
                      <div className="text-xs">{r.phone ?? ""}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div>{r.service_interested ?? "—"}</div>
                      <div className="text-xs text-slate-500">{r.package_selected ?? ""}</div>
                    </td>
                    <td className="px-5 py-3"><StatusChip status={r.status} /></td>
                    <td className="px-5 py-3">{fmtMoney(r.deal_value)}</td>
                    <td className="px-5 py-3">{fmtMoney(r.commission_amount)}</td>
                    <td className="px-5 py-3"><PayoutChip status={r.payout_status} /></td>
                    <td className="px-5 py-3 text-slate-400">{fmtDate(r.referral_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
