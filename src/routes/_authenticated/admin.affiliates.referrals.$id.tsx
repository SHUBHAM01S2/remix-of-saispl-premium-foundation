import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Send, CheckCircle2, BadgeCheck, Lock } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  adminGetReferral, adminUpdateReferral, adminAddReferralNote,
  adminApprovePayout, adminMarkPayoutPaid,
  REFERRAL_STATUSES, DEAL_STAGES, PAYOUT_STATUSES,
  type ReferralStatus, type ReferralDealStage, type ReferralPayoutStatus,
} from "@/lib/partners.functions";
import { fmtDate, fmtDateTime, fmtMoney, StatusChip, PayoutChip, STAGE_LABEL } from "@/lib/partners-ui";


export const Route = createFileRoute("/_authenticated/admin/affiliates/referrals/$id")({
  beforeLoad: async () => { const r = await checkIsAdmin(); if (!r.isAdmin) throw notFound(); return {}; },
  component: ReferralDetailAdmin,
  head: () => ({ meta: [{ title: "Referral — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

function ReferralDetailAdmin() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetReferral);
  const updateFn = useServerFn(adminUpdateReferral);
  const noteFn = useServerFn(adminAddReferralNote);
  const approveFn = useServerFn(adminApprovePayout);
  const markPaidFn = useServerFn(adminMarkPayoutPaid);
  const q = useQuery({ queryKey: ["admin", "referral", id], queryFn: () => getFn({ data: { id } }) });


  const [status, setStatus] = useState<ReferralStatus>("new");
  const [stage, setStage] = useState<ReferralDealStage>("lead");
  const [dealValue, setDealValue] = useState("");
  const [commissionPct, setCommissionPct] = useState("");
  const [notes, setNotes] = useState("");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const r = q.data?.referral;
    if (!r) return;
    setStatus(r.status); setStage(r.deal_stage);
    setDealValue(r.deal_value != null ? String(r.deal_value) : "");
    setCommissionPct(r.commission_pct != null ? String(r.commission_pct) : "");
    setNotes(r.notes ?? "");
  }, [q.data]);

  const save = useMutation({
    mutationFn: () => updateFn({ data: {
      id, status, deal_stage: stage,
      deal_value: dealValue === "" ? null : Number(dealValue),
      commission_pct: commissionPct === "" ? null : Number(commissionPct),
      notes: notes || null,
    }}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "referral", id] }); toast.success("Saved"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });


  const addNote = useMutation({
    mutationFn: () => noteFn({ data: { id, note: newNote } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "referral", id] }); setNewNote(""); toast.success("Note added"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const approve = useMutation({
    mutationFn: () => approveFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "referral", id] }); toast.success("Payout approved"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const markPaid = useMutation({
    mutationFn: () => markPaidFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "referral", id] }); toast.success("Marked as paid"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });


  if (q.isLoading) return <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>;
  if (!q.data) return <div className="p-8 text-sm text-rose-400">Not found</div>;
  const { referral: r, activity } = q.data;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/affiliates/referrals" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> All referrals
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{r.client_name}</h1>
            <p className="text-sm text-muted-foreground">
              {r.company ?? "Individual"} · Referred by{" "}
              {r.partner ? (
                <Link to="/admin/affiliates/partners/$id" params={{ id: r.partner.id }} className="text-brand hover:underline">
                  {r.partner.full_name}
                </Link>
              ) : "unknown"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusChip status={r.status} />
            <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-2.5 py-0.5 text-xs">Stage: {STAGE_LABEL[r.deal_stage]}</span>
            <PayoutChip status={r.payout_status} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Client details">
            <Row k="Email" v={r.email ?? "—"} />
            <Row k="Phone" v={r.phone ?? "—"} />
            <Row k="Company" v={r.company ?? "—"} />
            <Row k="Service interested" v={r.service_interested ?? "—"} />
            <Row k="Package" v={r.package_selected ?? "—"} />
            <Row k="Referral source" v={r.source ?? "—"} />
            <Row k="Referred on" v={fmtDate(r.referral_date)} />
            {r.onboarding_id && (
              <Row k="Onboarding" v={<Link to="/admin/onboarding/$id" params={{ id: r.onboarding_id }} className="text-brand hover:underline">Open onboarding →</Link>} />
            )}
          </Card>

          <Card title="Notes">
            <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-brand" />
            <p className="text-xs text-muted-foreground">Saved as part of the referral record.</p>
          </Card>

          <Card title="Activity">
            <div className="mb-4 flex gap-2">
              <input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Log an internal note…"
                className="flex-1 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand" />
              <button onClick={() => newNote && addNote.mutate()} disabled={addNote.isPending || !newNote}
                className="inline-flex items-center gap-1 rounded-lg bg-brand text-brand-foreground px-3 py-2 text-sm disabled:opacity-50">
                <Send className="h-3 w-3" /> Add
              </button>
            </div>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <ol className="space-y-3">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 text-sm">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                    <div className="flex-1">
                      <div>{formatActivity(a)}</div>
                      <div className="text-xs text-muted-foreground">{fmtDateTime(a.created_at)} · {a.actor_role ?? "system"}</div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <aside className="space-y-4">
          <Card title="Admin controls">
            <Field label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value as ReferralStatus)} className={inp}>
                {REFERRAL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Deal stage">
              <select value={stage} onChange={(e) => setStage(e.target.value as ReferralDealStage)} className={inp}>
                {DEAL_STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Deal value (₹)">
              <input value={dealValue} onChange={(e) => setDealValue(e.target.value)} className={inp} />
            </Field>
            <Field label="Commission %">
              <input value={commissionPct} onChange={(e) => setCommissionPct(e.target.value)} className={inp} />
            </Field>
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-2">
                Computed commission: <span className="text-foreground">{fmtMoney(
                  dealValue && commissionPct ? Number(dealValue) * Number(commissionPct) / 100 : r.commission_amount,
                )}</span>
              </div>
              <button onClick={() => save.mutate()} disabled={save.isPending}
                className="w-full rounded-lg bg-brand text-brand-foreground py-2 text-sm font-medium disabled:opacity-50">
                {save.isPending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </Card>

          <Card title="Payout">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current</span>
              <PayoutChip status={r.payout_status} />
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              {r.payout_approved_at && (
                <div>Approved {fmtDateTime(r.payout_approved_at)}</div>
              )}
              {r.payout_paid_at && (
                <div>Paid {fmtDateTime(r.payout_paid_at)}</div>
              )}
              {!r.payout_approved_at && !r.payout_paid_at && (
                <div>Awaiting approval.</div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2 pt-1">
              {r.payout_status !== "paid" && (
                <button
                  onClick={() => approve.mutate()}
                  disabled={approve.isPending || r.payout_status === "approved"}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-400/40 bg-blue-500/10 text-blue-200 py-2 text-sm disabled:opacity-50">
                  <BadgeCheck className="h-4 w-4" />
                  {r.payout_status === "approved" ? "Approved" : "Approve payout"}
                </button>
              )}
              {r.payout_status === "approved" && (
                <button
                  onClick={() => markPaid.mutate()}
                  disabled={markPaid.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 py-2 text-sm disabled:opacity-50">
                  <CheckCircle2 className="h-4 w-4" /> Mark as paid
                </button>
              )}
              {r.payout_status === "paid" && (
                <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-muted/30 py-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> Locked — payout complete
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Payouts follow Pending → Approved → Paid. Set a deal value and commission % before approving.
            </p>
          </Card>

        </aside>
      </div>
    </div>
  );
}

function formatActivity(a: any): string {
  const p = a.payload ?? {};
  switch (a.type) {
    case "created": return "Referral submitted";
    case "status_change": return `Status: ${p.from} → ${p.to}`;
    case "stage_change": return `Stage: ${p.from} → ${p.to}`;
    case "payout": return `Payout: ${p.from} → ${p.to}`;
    case "commission": return `Commission set to ${p.amount ? "₹" + p.amount : "—"}`;
    case "note": return p.note ?? "Note";
    default: return a.type;
  }
}

const inp = "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand";
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5 space-y-3">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-3 text-sm"><span className="text-muted-foreground">{k}</span><span className="text-right">{v}</span></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs text-muted-foreground">{label}</span><div className="mt-1">{children}</div></label>;
}
