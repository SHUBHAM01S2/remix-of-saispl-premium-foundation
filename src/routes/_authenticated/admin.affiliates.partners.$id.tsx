import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Target, Mail, ArrowRight } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { adminGetPartner, adminUpdatePartner } from "@/lib/partners.functions";
import { fmtDate, fmtMoney, StatusChip, PayoutChip, PARTNER_STATUS_STYLES } from "@/lib/partners-ui";

export const Route = createFileRoute("/_authenticated/admin/affiliates/partners/$id")({
  beforeLoad: async () => { const r = await checkIsAdmin(); if (!r.isAdmin) throw notFound(); return {}; },
  component: PartnerDetail,
  head: () => ({ meta: [{ title: "Partner — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

function PartnerDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetPartner);
  const updateFn = useServerFn(adminUpdatePartner);
  const q = useQuery({ queryKey: ["admin", "partner", id], queryFn: () => getFn({ data: { id } }) });

  const [pct, setPct] = useState("");
  const [status, setStatus] = useState<"active" | "paused">("active");
  useEffect(() => {
    if (q.data?.partner) {
      setPct(String(q.data.partner.default_commission_pct ?? ""));
      setStatus(q.data.partner.status);
    }
  }, [q.data]);

  const m = useMutation({
    mutationFn: (patch: any) => updateFn({ data: { id, ...patch } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "partner", id] }); qc.invalidateQueries({ queryKey: ["admin", "partners"] }); toast.success("Updated"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  if (q.isLoading) return <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>;
  if (!q.data) return <div className="p-8 text-sm text-rose-400">Not found</div>;
  const { partner: p, referrals } = q.data;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/affiliates/partners" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Back to partners
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{p.full_name}</h1>
            <p className="text-sm text-muted-foreground">{p.company ?? "—"} · {p.email}</p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${PARTNER_STATUS_STYLES[p.status]}`}>{p.status}</span>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5 space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Profile</h3>
          <div className="text-sm">Phone: <span className="text-muted-foreground">{p.phone ?? "—"}</span></div>
          <div className="text-sm">Payout method: <span className="text-muted-foreground">{p.payout_method ?? "—"}</span></div>
          <div className="text-sm">Payout details:
            <pre className="mt-1 text-xs bg-background/60 border border-border/60 rounded p-2 overflow-x-auto">{JSON.stringify(p.payout_details ?? {}, null, 2)}</pre>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5 space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Admin controls</h3>
          <label className="block text-sm">
            <span className="text-xs text-muted-foreground">Default commission %</span>
            <input value={pct} onChange={(e) => setPct(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="text-xs text-muted-foreground">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </label>
          <button onClick={() => m.mutate({ default_commission_pct: Number(pct), status })}
            className="rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium">Save</button>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur overflow-hidden">
        <div className="p-5 border-b border-border/60"><h2 className="text-sm font-semibold">All referrals ({referrals.length})</h2></div>
        {referrals.length === 0 ? (
          <div className="relative overflow-hidden px-6 py-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.10),transparent_65%)]" />
            <div className="relative mx-auto grid max-w-md place-items-center gap-3 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-600 ring-1 ring-cyan-400/25 dark:text-cyan-200">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">No referrals from this partner yet</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Send them the onboarding pack and confirm they can access the partner portal. A quick nudge often unlocks the first deal.
                </p>
              </div>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                {q.data?.partner?.email && (
                  <a
                    href={`mailto:${q.data.partner.email}?subject=Getting%20started%20with%20our%20partner%20program`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-foreground shadow-sm transition hover:brightness-110"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email onboarding pack
                  </a>
                )}
                <Link
                  to="/admin/affiliates/referrals"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:border-brand/40 hover:text-brand"
                >
                  Add a referral manually <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Deal</th>
                  <th className="px-5 py-3 font-medium">Commission</th>
                  <th className="px-5 py-3 font-medium">Payout</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr key={r.id} className="border-t border-border/50 hover:bg-muted/20">
                    <td className="px-5 py-3">
                      <Link to="/admin/affiliates/referrals/$id" params={{ id: r.id }} className="hover:text-brand">
                        <div className="font-medium">{r.client_name}</div>
                        <div className="text-xs text-muted-foreground">{r.company ?? "—"}</div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{r.service_interested ?? "—"}</td>
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
