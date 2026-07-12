import type {
  ReferralStatus,
  ReferralDealStage,
  ReferralPayoutStatus,
  PartnerStatus,
} from "@/lib/partners.functions";

/* Semantic-classic status palette
   pending → amber · approved → cyan · paid → emerald · stalled/lost → rose */
export const STATUS_STYLES: Record<ReferralStatus, string> = {
  new: "bg-cyan-500/10 text-cyan-200 ring-1 ring-inset ring-cyan-400/30",
  contacted: "bg-amber-500/10 text-amber-200 ring-1 ring-inset ring-amber-400/30",
  in_discussion: "bg-violet-500/10 text-violet-200 ring-1 ring-inset ring-violet-400/30",
  onboarding: "bg-blue-500/10 text-blue-200 ring-1 ring-inset ring-blue-400/30",
  won: "bg-emerald-500/10 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  lost: "bg-rose-500/10 text-rose-200 ring-1 ring-inset ring-rose-400/30",
};
export const STATUS_DOT: Record<ReferralStatus, string> = {
  new: "bg-cyan-400",
  contacted: "bg-amber-400",
  in_discussion: "bg-violet-400",
  onboarding: "bg-blue-400",
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
  pending: "bg-amber-500/10 text-amber-200 ring-1 ring-inset ring-amber-400/30",
  approved: "bg-cyan-500/10 text-cyan-200 ring-1 ring-inset ring-cyan-400/30",
  paid: "bg-emerald-500/10 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  on_hold: "bg-rose-500/10 text-rose-200 ring-1 ring-inset ring-rose-400/30",
};
export const PAYOUT_DOT: Record<ReferralPayoutStatus, string> = {
  pending: "bg-amber-400",
  approved: "bg-cyan-400",
  paid: "bg-emerald-400",
  on_hold: "bg-rose-400",
};
export const PAYOUT_LABEL: Record<ReferralPayoutStatus, string> = {
  pending: "Pending", approved: "Approved", paid: "Paid", on_hold: "On Hold",
};

export const PARTNER_STATUS_STYLES: Record<PartnerStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
  paused: "bg-zinc-500/10 text-zinc-300 ring-1 ring-inset ring-zinc-400/25",
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
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
export function PayoutChip({ status }: { status: ReferralPayoutStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${PAYOUT_STYLES[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${PAYOUT_DOT[status]}`} />
      {PAYOUT_LABEL[status]}
    </span>
  );
}
