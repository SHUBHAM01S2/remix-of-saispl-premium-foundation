import type {
  ReferralStatus,
  ReferralDealStage,
  ReferralPayoutStatus,
  PartnerStatus,
} from "@/lib/partners.functions";

export const STATUS_STYLES: Record<ReferralStatus, string> = {
  new: "bg-blue-500/10 text-blue-200 border-blue-400/25",
  contacted: "bg-amber-500/10 text-amber-200 border-amber-400/25",
  in_discussion: "bg-violet-500/10 text-violet-200 border-violet-400/25",
  onboarding: "bg-cyan-500/10 text-cyan-200 border-cyan-400/25",
  won: "bg-emerald-500/10 text-emerald-200 border-emerald-400/25",
  lost: "bg-rose-500/10 text-rose-200 border-rose-400/25",
};
export const STATUS_DOT: Record<ReferralStatus, string> = {
  new: "bg-blue-400",
  contacted: "bg-amber-400",
  in_discussion: "bg-violet-400",
  onboarding: "bg-cyan-400",
  won: "bg-emerald-400",
  lost: "bg-rose-400",
};
export const STATUS_LABEL: Record<ReferralStatus, string> = {
  new: "New",
  contacted: "Contacted",
  in_discussion: "In Discussion",
  onboarding: "Onboarding",
  won: "Won",
  lost: "Lost",
};

export const STAGE_LABEL: Record<ReferralDealStage, string> = {
  lead: "Lead",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export const PAYOUT_STYLES: Record<ReferralPayoutStatus, string> = {
  pending: "bg-zinc-500/10 text-zinc-200 border-zinc-400/25",
  approved: "bg-blue-500/10 text-blue-200 border-blue-400/25",
  paid: "bg-emerald-500/10 text-emerald-200 border-emerald-400/25",
  on_hold: "bg-amber-500/10 text-amber-200 border-amber-400/25",
};
export const PAYOUT_DOT: Record<ReferralPayoutStatus, string> = {
  pending: "bg-zinc-400",
  approved: "bg-blue-400",
  paid: "bg-emerald-400",
  on_hold: "bg-amber-400",
};
export const PAYOUT_LABEL: Record<ReferralPayoutStatus, string> = {
  pending: "Pending", approved: "Approved", paid: "Paid", on_hold: "On Hold",
};

export const PARTNER_STATUS_STYLES: Record<PartnerStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-200 border-emerald-400/25",
  paused: "bg-zinc-500/10 text-zinc-200 border-zinc-400/25",
};

export function fmtMoney(n: number | null | undefined) {
  if (n === null || n === undefined || isNaN(Number(n))) return "—";
  return "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function fmtDate(s: string | null | undefined) {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); }
  catch { return s; }
}
export function fmtDateTime(s: string | null | undefined) {
  if (!s) return "—";
  try { return new Date(s).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }); }
  catch { return s; }
}

export function StatusChip({ status }: { status: ReferralStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-tight ${STATUS_STYLES[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
export function PayoutChip({ status }: { status: ReferralPayoutStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-tight ${PAYOUT_STYLES[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${PAYOUT_DOT[status]}`} />
      {PAYOUT_LABEL[status]}
    </span>
  );
}
