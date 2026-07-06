import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Building2, Mail, Phone, Calendar, Package, Tag, BadgeDollarSign } from "lucide-react";
import { getMyReferral } from "@/lib/partners.functions";
import { fmtDate, fmtDateTime, fmtMoney, StatusChip, PayoutChip, STAGE_LABEL } from "@/lib/partners-ui";

export const Route = createFileRoute("/partner/referrals/$id")({
  component: ReferralDetailPage,
});

function ReferralDetailPage() {
  const { id } = Route.useParams();
  const fn = useServerFn(getMyReferral);
  const q = useQuery({ queryKey: ["partner", "referral", id], queryFn: () => fn({ data: { id } }) });

  if (q.isLoading) return <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>;
  if (q.isError || !q.data) return <div className="p-8 text-sm text-rose-400">Failed to load referral.</div>;

  const { referral: r, activity } = q.data;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link to="/partner/referrals" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Back to referrals
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{r.client_name}</h1>
            <p className="text-sm text-muted-foreground">{r.company ?? "Individual"}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusChip status={r.status} />
            <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-2.5 py-0.5 text-xs">Stage: {STAGE_LABEL[r.deal_stage]}</span>
            <PayoutChip status={r.payout_status} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard>
          <SectionTitle>Contact</SectionTitle>
          <Row icon={Mail} value={r.email ?? "—"} />
          <Row icon={Phone} value={r.phone ?? "—"} />
          <Row icon={Building2} value={r.company ?? "—"} />
        </InfoCard>
        <InfoCard>
          <SectionTitle>Project</SectionTitle>
          <Row icon={Package} value={r.service_interested ?? "—"} />
          <Row icon={Tag} value={r.package_selected ?? "—"} />
          <Row icon={Calendar} value={`Referred ${fmtDate(r.referral_date)}`} />
        </InfoCard>
        <InfoCard>
          <SectionTitle>Commission</SectionTitle>
          <Row icon={BadgeDollarSign} value={`Deal: ${fmtMoney(r.deal_value)}`} />
          <Row icon={BadgeDollarSign} value={`Rate: ${r.commission_pct ?? "—"}%`} />
          <Row icon={BadgeDollarSign} value={`Payout: ${fmtMoney(r.commission_amount)}`} />
        </InfoCard>
      </div>

      {r.notes && (
        <InfoCard>
          <SectionTitle>Notes</SectionTitle>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.notes}</p>
        </InfoCard>
      )}

      <InfoCard>
        <SectionTitle>Activity history</SectionTitle>
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ol className="space-y-3">
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                <div className="flex-1">
                  <div className="text-foreground">{formatActivity(a)}</div>
                  <div className="text-xs text-muted-foreground">{fmtDateTime(a.created_at)}</div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </InfoCard>
    </div>
  );
}

function formatActivity(a: any): string {
  const p = a.payload ?? {};
  switch (a.type) {
    case "created": return "Referral submitted";
    case "status_change": return `Status changed from ${p.from} → ${p.to}`;
    case "stage_change": return `Deal stage moved to ${p.to}`;
    case "payout": return `Payout status: ${p.from} → ${p.to}`;
    case "commission": return `Commission set to ${p.amount ? "₹" + p.amount : "—"}`;
    case "note": return p.note ?? "Note added";
    default: return a.type;
  }
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5 space-y-3">{children}</div>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{children}</h3>;
}
function Row({ icon: Icon, value }: { icon: any; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{value}</span>
    </div>
  );
}
