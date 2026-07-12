import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Wallet, CheckCircle2, Clock, CalendarClock, TrendingUp } from "lucide-react";
import { listMyReferrals, getMyStats } from "@/lib/partners.functions";
import { fmtDate, fmtMoney, PayoutChip } from "@/lib/partners-ui";
import { EmptyState } from "./partner";

export const Route = createFileRoute("/partner/earnings")({
  component: EarningsPage,
});

function EarningsPage() {
  const statsFn = useServerFn(getMyStats);
  const listFn = useServerFn(listMyReferrals);
  const s = useQuery({ queryKey: ["partner", "stats"], queryFn: () => statsFn() });
  const l = useQuery({ queryKey: ["partner", "referrals"], queryFn: () => listFn() });

  const earning = (l.data ?? []).filter((r) => r.commission_amount && r.commission_amount > 0);
  const nextPayout = (() => { const d = new Date(); d.setMonth(d.getMonth() + 1, 5); return d; })();

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-4">
        <MoneyCard icon={Wallet}        tint="bg-teal-500/15 text-teal-300"       label="Total commission"  value={fmtMoney(s.data?.commissionTotal)} sub="Lifetime earned" />
        <MoneyCard icon={CheckCircle2}  tint="bg-emerald-500/15 text-emerald-300" label="Paid out"          value={fmtMoney(s.data?.paidTotal)}       sub="Cleared payouts" />
        <MoneyCard icon={Clock}         tint="bg-amber-500/15 text-amber-300"     label="Pending payout"    value={fmtMoney(s.data?.pendingPayout)}   sub={`Next: ${fmtDate(nextPayout.toISOString())}`} />
        <MoneyCard icon={TrendingUp}    tint="bg-cyan-500/15 text-cyan-300"       label="Deal value"        value={fmtMoney(s.data?.dealValue)}       sub="Pipeline + closed" />
      </div>

      <section className="rounded-2xl border border-white/5 bg-gradient-to-br from-teal-500/10 via-white/[0.02] to-transparent p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-500/15 text-teal-300"><CalendarClock className="h-5 w-5" /></span>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-teal-300/80">Next payout window</p>
            <h3 className="mt-0.5 text-lg font-semibold">{fmtDate(nextPayout.toISOString())}</h3>
            <p className="text-sm text-slate-400">Approved commissions land on the 5th of every month via your chosen method.</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-slate-400">Pending</p>
          <p className="text-2xl font-semibold text-amber-300">{fmtMoney(s.data?.pendingPayout)}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-sm font-semibold">Commission ledger</h2>
          <p className="text-xs text-slate-400">Every closed deal that earned you a commission.</p>
        </div>
        {l.isLoading ? (
          <div className="p-10 text-center text-sm text-slate-400"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>
        ) : earning.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No commissions yet"
            body="Once a referral closes, your commission will appear here. Keep those referrals coming!"
            cta={{ to: "/partner/referrals/new", label: "Add a referral" }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead className="text-left text-xs text-slate-400 bg-white/[0.02]">
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
                  <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                    <td className="px-5 py-3">
                      <div className="font-medium">{r.client_name}</div>
                      <div className="text-xs text-slate-500">{r.company ?? "—"}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{r.package_selected ?? "—"}</td>
                    <td className="px-5 py-3">{fmtMoney(r.deal_value)}</td>
                    <td className="px-5 py-3 text-slate-400">{r.commission_pct ?? "—"}%</td>
                    <td className="px-5 py-3 font-semibold text-emerald-300">{fmtMoney(r.commission_amount)}</td>
                    <td className="px-5 py-3"><PayoutChip status={r.payout_status} /></td>
                    <td className="px-5 py-3 text-slate-400">{fmtDate(r.updated_at)}</td>
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

function MoneyCard({ icon: Icon, tint, label, value, sub }: { icon: any; tint: string; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/10 transition">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{label}</p>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${tint}`}><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </div>
  );
}
