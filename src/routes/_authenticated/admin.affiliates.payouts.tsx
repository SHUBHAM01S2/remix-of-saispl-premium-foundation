import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, BadgeCheck, CheckCircle2, PauseCircle, Lock } from "lucide-react";
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

  const rows = useMemo(() => {
    const items = (q.data ?? []).filter((r) => r.commission_amount && r.commission_amount > 0);
    return filter === "all" ? items : items.filter((r) => r.payout_status === filter);
  }, [q.data, filter]);

  const totals = useMemo(() => {
    const items = q.data ?? [];
    return {
      pending: items.filter((r) => r.payout_status === "pending").reduce((s, r) => s + Number(r.commission_amount ?? 0), 0),
      approved: items.filter((r) => r.payout_status === "approved").reduce((s, r) => s + Number(r.commission_amount ?? 0), 0),
      paid: items.filter((r) => r.payout_status === "paid").reduce((s, r) => s + Number(r.commission_amount ?? 0), 0),
    };
  }, [q.data]);

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


  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <KPI label="Pending" value={fmtMoney(totals.pending)} accent="text-amber-300" />
        <KPI label="Approved" value={fmtMoney(totals.approved)} accent="text-blue-300" />
        <KPI label="Paid" value={fmtMoney(totals.paid)} accent="text-emerald-300" />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all","pending","approved","paid","on_hold"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f as any)}
            className={`rounded-xl px-3 py-1.5 text-sm border ${filter === f ? "bg-brand/15 text-foreground border-brand/30" : "text-muted-foreground border-border hover:text-foreground"}`}>
            {f === "all" ? "All" : PAYOUT_STATUSES.find((p) => p.value === f)?.label ?? f}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur overflow-hidden">
        {q.isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Nothing here.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Partner</th>
                  <th className="px-5 py-3 font-medium">Deal</th>
                  <th className="px-5 py-3 font-medium">Commission</th>
                  <th className="px-5 py-3 font-medium">Current status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border/50">
                    <td className="px-5 py-3">
                      <Link to="/admin/affiliates/referrals/$id" params={{ id: r.id }} className="hover:text-brand font-medium">
                        {r.client_name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{r.company ?? "—"}</div>
                    </td>
                    <td className="px-5 py-3">{r.partner?.full_name ?? "—"}</td>
                    <td className="px-5 py-3">{fmtMoney(r.deal_value)}</td>
                    <td className="px-5 py-3 font-medium">{fmtMoney(r.commission_amount)}</td>
                    <td className="px-5 py-3"><PayoutChip status={r.payout_status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {r.payout_status === "pending" && (
                          <>
                            <ActionBtn icon={BadgeCheck} label="Approve" tone="blue"
                              onClick={() => approve.mutate(r.id)} />
                            <ActionBtn icon={PauseCircle} label="Hold" tone="muted"
                              onClick={() => setPayout.mutate({ id: r.id, payout_status: "on_hold" })} />
                          </>
                        )}
                        {r.payout_status === "approved" && (
                          <>
                            <ActionBtn icon={CheckCircle2} label="Mark paid" tone="emerald"
                              onClick={() => markPaid.mutate(r.id)} />
                            <ActionBtn icon={PauseCircle} label="Hold" tone="muted"
                              onClick={() => setPayout.mutate({ id: r.id, payout_status: "on_hold" })} />
                          </>
                        )}
                        {r.payout_status === "on_hold" && (
                          <ActionBtn icon={BadgeCheck} label="Resume → Pending" tone="muted"
                            onClick={() => setPayout.mutate({ id: r.id, payout_status: "pending" })} />
                        )}
                        {r.payout_status === "paid" && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Lock className="h-3 w-3" /> Locked
                          </span>
                        )}
                      </div>
                    </td>

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

function KPI({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
