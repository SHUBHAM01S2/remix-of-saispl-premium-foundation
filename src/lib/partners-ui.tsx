import type {
  ReferralStatus,
  ReferralDealStage,
  ReferralPayoutStatus,
  PartnerStatus,
} from "@/lib/partners.functions";

export const STATUS_STYLES: Record<ReferralStatus, string> = {
  new: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  contacted: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  in_discussion: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  onboarding: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  won: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  lost: "bg-rose-500/15 text-rose-300 border-rose-500/30",
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
  pending: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  approved: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  on_hold: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};
export const PAYOUT_LABEL: Record<ReferralPayoutStatus, string> = {
  pending: "Pending", approved: "Approved", paid: "Paid", on_hold: "On Hold",
};

export const PARTNER_STATUS_STYLES: Record<PartnerStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  paused: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
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
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
export function PayoutChip({ status }: { status: ReferralPayoutStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${PAYOUT_STYLES[status]}`}>
      {PAYOUT_LABEL[status]}
    </span>
  );
}
