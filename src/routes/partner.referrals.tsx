import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Loader2, Search, Plus } from "lucide-react";
import { listMyReferrals, REFERRAL_STATUSES, type ReferralStatus } from "@/lib/partners.functions";
import { fmtDate, fmtMoney, StatusChip, PayoutChip } from "@/lib/partners-ui";

export const Route = createFileRoute("/partner/referrals")({
  component: MyReferralsPage,
});

function MyReferralsPage() {
  const listFn = useServerFn(listMyReferrals);
  const q = useQuery({ queryKey: ["partner", "referrals"], queryFn: () => listFn() });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReferralStatus | "">("");

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

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand/80">Referrals</p>
          <h1 className="mt-1 text-2xl font-semibold">My referrals</h1>
          <p className="text-sm text-muted-foreground">Every client you have referred to SAISPL.</p>
        </div>
        <Link to="/partner/referrals/new" className="inline-flex items-center gap-2 rounded-xl bg-brand text-brand-foreground px-4 py-2 text-sm font-medium">
          <Plus className="h-4 w-4" /> New referral
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client, company, email…"
            className="w-full rounded-xl border border-border bg-card/60 pl-9 pr-3 py-2 text-sm outline-none focus:border-brand" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}
          className="rounded-xl border border-border bg-card/60 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {REFERRAL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur overflow-hidden">
        {q.isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No referrals match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="text-left text-xs text-muted-foreground">
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
                  <tr key={r.id} className="border-t border-border/50 hover:bg-muted/20">
                    <td className="px-5 py-3">
                      <Link to="/partner/referrals/$id" params={{ id: r.id }} className="hover:text-brand">
                        <div className="font-medium">{r.client_name}</div>
                        <div className="text-xs text-muted-foreground">{r.company ?? "—"}</div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      <div>{r.email ?? "—"}</div>
                      <div className="text-xs">{r.phone ?? ""}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div>{r.service_interested ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{r.package_selected ?? ""}</div>
                    </td>
                    <td className="px-5 py-3"><StatusChip status={r.status} /></td>
                    <td className="px-5 py-3">{fmtMoney(r.deal_value)}</td>
                    <td className="px-5 py-3">{fmtMoney(r.commission_amount)}</td>
                    <td className="px-5 py-3"><PayoutChip status={r.payout_status} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{fmtDate(r.referral_date)}</td>
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
