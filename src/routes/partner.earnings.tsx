import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { listMyReferrals, getMyStats } from "@/lib/partners.functions";
import { fmtDate, fmtMoney, PayoutChip } from "@/lib/partners-ui";

export const Route = createFileRoute("/partner/earnings")({
  component: EarningsPage,
});

function EarningsPage() {
  const statsFn = useServerFn(getMyStats);
  const listFn = useServerFn(listMyReferrals);
  const s = useQuery({ queryKey: ["partner", "stats"], queryFn: () => statsFn() });
  const l = useQuery({ queryKey: ["partner", "referrals"], queryFn: () => listFn() });

  const earning = (l.data ?? []).filter((r) => r.commission_amount && r.commission_amount > 0);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-brand/80">Earnings</p>
        <h1 className="mt-1 text-2xl font-semibold">Commissions & payouts</h1>
        <p className="text-sm text-muted-foreground">Track what you've earned and what's pending payout.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Total commission" value={fmtMoney(s.data?.commissionTotal)} />
        <Card label="Paid" value={fmtMoney(s.data?.paidTotal)} accent="text-emerald-300" />
        <Card label="Pending payout" value={fmtMoney(s.data?.pendingPayout)} accent="text-amber-300" />
      </div>

      <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur overflow-hidden">
        <div className="p-5 border-b border-border/60"><h2 className="text-sm font-semibold">Commission ledger</h2></div>
        {l.isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>
        ) : earning.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No commissions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Package</th>
                  <th className="px-5 py-3 font-medium">Deal value</th>
                  <th className="px-5 py-3 font-medium">Rate</th>
                  <th className="px-5 py-3 font-medium">Commission</th>
                  <th className="px-5 py-3 font-medium">Payout</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {earning.map((r) => (
                  <tr key={r.id} className="border-t border-border/50">
                    <td className="px-5 py-3">
                      <div className="font-medium">{r.client_name}</div>
                      <div className="text-xs text-muted-foreground">{r.company ?? "—"}</div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{r.package_selected ?? "—"}</td>
                    <td className="px-5 py-3">{fmtMoney(r.deal_value)}</td>
                    <td className="px-5 py-3">{r.commission_pct ?? "—"}%</td>
                    <td className="px-5 py-3 font-medium">{fmtMoney(r.commission_amount)}</td>
                    <td className="px-5 py-3"><PayoutChip status={r.payout_status} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{fmtDate(r.updated_at)}</td>
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

function Card({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
