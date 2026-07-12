import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAnyAdmin } from "@/lib/admin-auth";

export type ReferralStatus =
  | "new" | "contacted" | "in_discussion" | "won" | "lost" | "onboarding";
export type ReferralDealStage =
  | "lead" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
export type ReferralPayoutStatus = "pending" | "approved" | "paid" | "on_hold";
export type PartnerStatus = "active" | "paused";

export const REFERRAL_STATUSES: { value: ReferralStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_discussion", label: "In Discussion" },
  { value: "onboarding", label: "Onboarding" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];
export const DEAL_STAGES: { value: ReferralDealStage; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
];
export const PAYOUT_STATUSES: { value: ReferralPayoutStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "on_hold", label: "On Hold" },
];

export type PartnerRow = {
  id: string;
  user_id: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  payout_method: string | null;
  payout_details: Record<string, any> | null;
  default_commission_pct: number | null;
  status: PartnerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ReferralRow = {
  id: string;
  partner_id: string;
  client_name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  service_interested: string | null;
  package_selected: string | null;
  source: string | null;
  referral_date: string;
  status: ReferralStatus;
  deal_stage: ReferralDealStage;
  deal_value: number | null;
  commission_pct: number | null;
  commission_amount: number | null;
  payout_status: ReferralPayoutStatus;
  payout_approved_at: string | null;
  payout_approved_by: string | null;
  payout_paid_at: string | null;
  payout_paid_by: string | null;
  last_status_change_at: string | null;
  last_activity_at: string | null;
  notes: string | null;
  onboarding_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ReferralActivityRow = {
  id: string;
  referral_id: string;
  actor_id: string | null;
  actor_role: string | null;
  type: string;
  payload: Record<string, any> | null;
  created_at: string;
};

const PARTNER_COLS =
  "id,user_id,full_name,company,email,phone,payout_method,payout_details,default_commission_pct,status,notes,created_at,updated_at";
const REFERRAL_COLS =
  "id,partner_id,client_name,company,email,phone,service_interested,package_selected,source,referral_date,status,deal_stage,deal_value,commission_pct,commission_amount,payout_status,payout_approved_at,payout_approved_by,payout_paid_at,payout_paid_by,last_status_change_at,last_activity_at,notes,onboarding_id,created_at,updated_at";

// Allowed payout transitions (mirrors DB trigger `referrals_payout_gate`).
const PAYOUT_TRANSITIONS: Record<ReferralPayoutStatus, ReferralPayoutStatus[]> = {
  pending:  ["approved", "on_hold"],
  approved: ["paid", "pending", "on_hold"],
  on_hold:  ["pending", "approved"],
  paid:     [],
};
function assertPayoutTransition(from: ReferralPayoutStatus, to: ReferralPayoutStatus) {
  if (from === to) return;
  if (!PAYOUT_TRANSITIONS[from].includes(to)) {
    throw new Error(
      from === "paid"
        ? "Payout is already marked paid and is locked."
        : `Cannot move payout from "${from}" to "${to}".`,
    );
  }
}


// ============================================================
// PARTNER-SCOPED
// ============================================================

export const getMyPartnerProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PartnerRow | null> => {
    const { data, error } = await (context.supabase as any)
      .from("sales_partners")
      .select(PARTNER_COLS)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as PartnerRow | null;
  });

export const updateMyPartnerProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    full_name?: string;
    company?: string | null;
    phone?: string | null;
    payout_method?: string | null;
    payout_details?: Record<string, any> | null;
  }) => d)
  .handler(async ({ context, data }): Promise<PartnerRow> => {
    const patch: any = {};
    for (const k of ["full_name","company","phone","payout_method","payout_details"] as const) {
      if (data[k] !== undefined) patch[k] = data[k];
    }
    const { data: row, error } = await (context.supabase as any)
      .from("sales_partners")
      .update(patch)
      .eq("user_id", context.userId)
      .select(PARTNER_COLS)
      .single();
    if (error) throw error;
    return row as PartnerRow;
  });

export const getMyStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: partner } = await (context.supabase as any)
      .from("sales_partners").select("id").eq("user_id", context.userId).maybeSingle();
    if (!partner) return null;
    const { data: rows, error } = await (context.supabase as any)
      .from("referrals")
      .select("status,deal_value,commission_amount,payout_status")
      .eq("partner_id", partner.id);
    if (error) throw error;
    const list = (rows ?? []) as any[];
    const by = (s: string) => list.filter((r) => r.status === s).length;
    const total = list.length;
    const won = by("won");
    const active = list.filter((r) => ["contacted","in_discussion","onboarding"].includes(r.status)).length;
    const pending = by("new");
    const lost = by("lost");
    const dealValue = list.reduce((s, r) => s + Number(r.deal_value ?? 0), 0);
    const commissionTotal = list.reduce((s, r) => s + Number(r.commission_amount ?? 0), 0);
    const paidTotal = list.filter((r) => r.payout_status === "paid")
      .reduce((s, r) => s + Number(r.commission_amount ?? 0), 0);
    const pendingPayout = list.filter((r) => r.payout_status !== "paid")
      .reduce((s, r) => s + Number(r.commission_amount ?? 0), 0);
    const conversionRate = total ? Math.round((won / total) * 100) : 0;
    return { total, active, pending, won, lost, dealValue, commissionTotal, paidTotal, pendingPayout, conversionRate };
  });

export const listMyReferrals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ReferralRow[]> => {
    const { data: partner } = await (context.supabase as any)
      .from("sales_partners").select("id").eq("user_id", context.userId).maybeSingle();
    if (!partner) return [];
    const { data, error } = await (context.supabase as any)
      .from("referrals").select(REFERRAL_COLS)
      .eq("partner_id", partner.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ReferralRow[];
  });

export const getMyReferral = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const { data: partner } = await (context.supabase as any)
      .from("sales_partners").select("id").eq("user_id", context.userId).maybeSingle();
    if (!partner) throw new Error("Not a partner");
    const { data: ref, error } = await (context.supabase as any)
      .from("referrals").select(REFERRAL_COLS)
      .eq("id", data.id).eq("partner_id", partner.id).maybeSingle();
    if (error) throw error;
    if (!ref) throw new Error("Not found");
    const { data: activity } = await (context.supabase as any)
      .from("referral_activity").select("*")
      .eq("referral_id", data.id).order("created_at", { ascending: false });
    return { referral: ref as ReferralRow, activity: (activity ?? []) as ReferralActivityRow[] };
  });

export const createMyReferral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    client_name: string;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    service_interested?: string | null;
    package_selected?: string | null;
    source?: string | null;
    notes?: string | null;
    status?: ReferralStatus | null;
    deal_stage?: ReferralDealStage | null;
    deal_value?: number | null;
  }) => {
    if (!d?.client_name?.trim()) throw new Error("Client name is required");
    return d;
  })
  .handler(async ({ context, data }): Promise<ReferralRow> => {
    const { data: partner } = await (context.supabase as any)
      .from("sales_partners").select("id,default_commission_pct")
      .eq("user_id", context.userId).maybeSingle();
    if (!partner) throw new Error("You are not registered as a sales partner");
    const insert: any = {
      partner_id: partner.id,
      client_name: data.client_name.trim(),
      company: data.company || null,
      email: data.email || null,
      phone: data.phone || null,
      service_interested: data.service_interested || null,
      package_selected: data.package_selected || null,
      source: data.source || null,
      notes: data.notes || null,
      commission_pct: partner.default_commission_pct,
    };
    if (data.status) insert.status = data.status;
    if (data.deal_stage) insert.deal_stage = data.deal_stage;
    if (data.deal_value !== undefined && data.deal_value !== null && !isNaN(Number(data.deal_value))) {
      insert.deal_value = Number(data.deal_value);
    }
    const { data: row, error } = await (context.supabase as any)
      .from("referrals")
      .insert(insert)
      .select(REFERRAL_COLS)
      .single();
    if (error) throw error;
    return row as ReferralRow;
  });


// ============================================================
// ADMIN-SCOPED
// ============================================================

export const adminListPartners = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: partners, error } = await admin
      .from("sales_partners").select(PARTNER_COLS)
      .order("created_at", { ascending: false });
    if (error) throw error;
    const { data: refs } = await admin
      .from("referrals").select("partner_id,status,deal_value,commission_amount,payout_status,last_activity_at,created_at");
    const stats = new Map<string, { total: number; won: number; commission: number; unpaid: number; dealValue: number; lastActive: string | null }>();
    for (const r of (refs ?? []) as any[]) {
      const s = stats.get(r.partner_id) ?? { total: 0, won: 0, commission: 0, unpaid: 0, dealValue: 0, lastActive: null };
      s.total += 1;
      if (r.status === "won") s.won += 1;
      s.commission += Number(r.commission_amount ?? 0);
      s.dealValue += Number(r.deal_value ?? 0);
      if (r.payout_status !== "paid") s.unpaid += Number(r.commission_amount ?? 0);
      const ts = r.last_activity_at ?? r.created_at ?? null;
      if (ts && (!s.lastActive || ts > s.lastActive)) s.lastActive = ts;
      stats.set(r.partner_id, s);
    }
    return (partners ?? []).map((p: any) => ({
      ...(p as PartnerRow),
      stats: stats.get(p.id) ?? { total: 0, won: 0, commission: 0, unpaid: 0, dealValue: 0, lastActive: null },
    }));
  });

export const adminGetPartner = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: partner, error } = await admin
      .from("sales_partners").select(PARTNER_COLS).eq("id", data.id).maybeSingle();
    if (error) throw error;
    if (!partner) throw new Error("Not found");
    const { data: refs } = await admin
      .from("referrals").select(REFERRAL_COLS)
      .eq("partner_id", data.id).order("created_at", { ascending: false });
    return { partner: partner as PartnerRow, referrals: (refs ?? []) as ReferralRow[] };
  });

export const adminListReferrals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d?: { partner_id?: string; status?: string; q?: string }) => d ?? {})
  .handler(async ({ context, data }) => {
    await assertAnyAdmin(context as any, "adminListReferrals");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    let q = admin
      .from("referrals")
      .select(`${REFERRAL_COLS}, partner:sales_partners(id,full_name,company,email,payout_method)`)
      .order("created_at", { ascending: false });
    if (data.partner_id) q = q.eq("partner_id", data.partner_id);
    if (data.status) q = q.eq("status", data.status);
    if (data.q && data.q.trim()) {
      const n = `%${data.q.trim()}%`;
      q = q.or(`client_name.ilike.${n},company.ilike.${n},email.ilike.${n}`);
    }
    const { data: rows, error } = await q;
    if (error) throw error;
    return (rows ?? []) as (ReferralRow & { partner: { id: string; full_name: string; company: string | null; email: string; payout_method: string | null } | null })[];
  });

export const adminGetReferral = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: ref, error } = await admin
      .from("referrals")
      .select(`${REFERRAL_COLS}, partner:sales_partners(id,full_name,company,email,phone)`)
      .eq("id", data.id).maybeSingle();
    if (error) throw error;
    if (!ref) throw new Error("Not found");
    const { data: activity } = await admin
      .from("referral_activity").select("*")
      .eq("referral_id", data.id).order("created_at", { ascending: false });
    return {
      referral: ref as ReferralRow & { partner: any },
      activity: (activity ?? []) as ReferralActivityRow[],
    };
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const [partnersRes, refsRes] = await Promise.all([
      admin.from("sales_partners").select("id,status,full_name,company,created_at"),
      admin.from("referrals").select("partner_id,status,deal_value,commission_amount,payout_status,created_at,last_activity_at"),
    ]);

    if (partnersRes.error) throw partnersRes.error;
    if (refsRes.error) throw refsRes.error;
    const partners = (partnersRes.data ?? []) as any[];
    const refs = (refsRes.data ?? []) as any[];
    const activePartners = partners.filter((p) => p.status === "active").length;
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const wonThisMonth = refs.filter((r) => r.status === "won" && r.created_at >= startMonth).length;
    const dealValue = refs.reduce((s, r) => s + Number(r.deal_value ?? 0), 0);
    const pendingPayout = refs.filter((r) => r.payout_status !== "paid")
      .reduce((s, r) => s + Number(r.commission_amount ?? 0), 0);
    // Leaderboard
    const msDay = 24 * 60 * 60 * 1000;
    const win30 = new Date(now.getTime() - 30 * msDay).toISOString();
    const win60 = new Date(now.getTime() - 60 * msDay).toISOString();
    type BoardRow = {
      partner_id: string;
      referrals: number;
      won: number;
      deal_value: number;
      commission: number;
      commission_recent: number;
      commission_prev: number;
    };
    const board = new Map<string, BoardRow>();
    for (const r of refs) {
      const s = board.get(r.partner_id) ?? {
        partner_id: r.partner_id,
        referrals: 0,
        won: 0,
        deal_value: 0,
        commission: 0,
        commission_recent: 0,
        commission_prev: 0,
      };
      s.referrals += 1;
      if (r.status === "won") {
        s.won += 1;
        s.deal_value += Number(r.deal_value ?? 0);
      }
      const c = Number(r.commission_amount ?? 0);
      s.commission += c;
      if (r.created_at >= win30) s.commission_recent += c;
      else if (r.created_at >= win60) s.commission_prev += c;
      board.set(r.partner_id, s);
    }
    const leaderboard = Array.from(board.values())
      .map((b) => {
        const p = partners.find((x) => x.id === b.partner_id);
        const prev = b.commission_prev;
        const rec = b.commission_recent;
        let trendPct: number | null = null;
        if (prev > 0) trendPct = Math.round(((rec - prev) / prev) * 100);
        else if (rec > 0) trendPct = 100;
        return {
          ...b,
          name: p?.full_name ?? "Unknown",
          company: p?.company ?? null,
          trendPct,
        };
      })
      .sort((a, b) => b.commission - a.commission || b.won - a.won || b.referrals - a.referrals)
      .slice(0, 5);

    return {
      totalPartners: partners.length,
      activePartners,
      totalReferrals: refs.length,
      wonThisMonth,
      dealValue,
      pendingPayout,
      leaderboard,
    };
  });

export const adminUpdateReferral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id: string;
    status?: ReferralStatus;
    deal_stage?: ReferralDealStage;
    deal_value?: number | null;
    commission_pct?: number | null;
    payout_status?: ReferralPayoutStatus;
    notes?: string | null;
    package_selected?: string | null;
    service_interested?: string | null;
    onboarding_id?: string | null;
  }) => {
    if (!d?.id) throw new Error("id required");
    return d;
  })
  .handler(async ({ context, data }): Promise<ReferralRow> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;

    // If payout is changing, validate the transition against the state machine.
    if (data.payout_status !== undefined) {
      const { data: current, error: curErr } = await admin
        .from("referrals").select("payout_status").eq("id", data.id).maybeSingle();
      if (curErr) throw curErr;
      if (!current) throw new Error("Referral not found");
      assertPayoutTransition(
        current.payout_status as ReferralPayoutStatus,
        data.payout_status,
      );
    }

    const patch: any = {};
    for (const k of [
      "status","deal_stage","deal_value","commission_pct","payout_status",
      "notes","package_selected","service_interested","onboarding_id",
    ] as const) {
      if (data[k] !== undefined) patch[k] = data[k];
    }
    const { data: row, error } = await admin
      .from("referrals").update(patch).eq("id", data.id)
      .select(REFERRAL_COLS).single();
    if (error) throw error;
    return row as ReferralRow;
  });

// Convenience: explicit admin approval action. Requires payout in `pending` or `on_hold`.
export const adminApprovePayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => { if (!d?.id) throw new Error("id required"); return d; })
  .handler(async ({ context, data }): Promise<ReferralRow> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: cur } = await admin.from("referrals").select("payout_status,commission_amount").eq("id", data.id).maybeSingle();
    if (!cur) throw new Error("Not found");
    if (!cur.commission_amount || Number(cur.commission_amount) <= 0) {
      throw new Error("Set a deal value and commission % before approving payout.");
    }
    assertPayoutTransition(cur.payout_status as ReferralPayoutStatus, "approved");
    const { data: row, error } = await admin
      .from("referrals").update({ payout_status: "approved" }).eq("id", data.id)
      .select(REFERRAL_COLS).single();
    if (error) throw error;
    return row as ReferralRow;
  });

// Convenience: mark an approved payout as paid.
export const adminMarkPayoutPaid = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => { if (!d?.id) throw new Error("id required"); return d; })
  .handler(async ({ context, data }): Promise<ReferralRow> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: cur } = await admin.from("referrals").select("payout_status").eq("id", data.id).maybeSingle();
    if (!cur) throw new Error("Not found");
    assertPayoutTransition(cur.payout_status as ReferralPayoutStatus, "paid");
    const { data: row, error } = await admin
      .from("referrals").update({ payout_status: "paid" }).eq("id", data.id)
      .select(REFERRAL_COLS).single();
    if (error) throw error;
    return row as ReferralRow;
  });

export const adminAddReferralNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; note: string }) => {
    if (!d?.id) throw new Error("id required");
    if (!d?.note?.trim()) throw new Error("note required");
    return d;
  })
  .handler(async ({ context, data }) => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("referral_activity").insert({
        referral_id: data.id,
        actor_id: context.userId,
        actor_role: "admin",
        type: "note",
        payload: { note: data.note.trim() },
      });
    if (error) throw error;
    return { ok: true };
  });


export const adminCreatePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    email: string;
    full_name: string;
    company?: string | null;
    phone?: string | null;
    default_commission_pct?: number | null;
    mode?: "invite" | "password";
    password?: string | null;
  }) => {
    if (!d?.email) throw new Error("email required");
    if (!d?.full_name) throw new Error("full_name required");
    if (d?.mode === "password") {
      if (!d.password || d.password.length < 12) {
        throw new Error("Password must be at least 12 characters");
      }
    }
    return d;
  })
  .handler(async ({ context, data }): Promise<PartnerRow & { auth_mode: "invite" | "password"; password_set: boolean }> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const mode: "invite" | "password" = data.mode === "password" ? "password" : "invite";

    // Find existing user (by email)
    let userId: string | null = null;
    const listRes = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = listRes?.data?.users?.find(
      (u: any) => (u.email ?? "").toLowerCase() === data.email.toLowerCase(),
    );

    if (existing) {
      userId = existing.id;
      if (mode === "password") {
        const upd = await admin.auth.admin.updateUserById(userId!, {
          password: data.password!,
          email_confirm: true,
        });
        if (upd.error) throw upd.error;
      }
    } else if (mode === "password") {
      // Create user directly with the chosen password so partner can log in immediately.
      const created = await admin.auth.admin.createUser({
        email: data.email,
        password: data.password!,
        email_confirm: true,
        user_metadata: { role: "sales_partner", full_name: data.full_name },
      });
      if (created.error) throw created.error;
      userId = created.data.user?.id ?? null;
    } else {
      // Invite mode: partner receives an email to set their own password.
      const invited = await admin.auth.admin.inviteUserByEmail(data.email, {
        data: { role: "sales_partner", full_name: data.full_name },
      });
      if (invited.error) throw invited.error;
      userId = invited.data.user?.id ?? null;
    }
    if (!userId) throw new Error("Could not resolve user id");

    // Safety: ensure this user is NOT an admin. Sales-partner role comes from
    // presence in sales_partners (has_role in DB derives from that table).
    await admin.from("admins").delete().eq("id", userId);

    const { data: row, error } = await admin
      .from("sales_partners")
      .upsert({
        user_id: userId,
        email: data.email,
        full_name: data.full_name,
        company: data.company ?? null,
        phone: data.phone ?? null,
        default_commission_pct: data.default_commission_pct ?? 10,
      }, { onConflict: "user_id" })
      .select(PARTNER_COLS)
      .single();
    if (error) throw error;
    return { ...(row as PartnerRow), auth_mode: mode, password_set: mode === "password" };
  });


export const adminUpdatePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id: string;
    status?: PartnerStatus;
    default_commission_pct?: number | null;
    notes?: string | null;
  }) => { if (!d?.id) throw new Error("id required"); return d; })
  .handler(async ({ context, data }) => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: any = {};
    for (const k of ["status","default_commission_pct","notes"] as const) {
      if (data[k] !== undefined) patch[k] = data[k];
    }
    const { data: row, error } = await (supabaseAdmin as any)
      .from("sales_partners").update(patch).eq("id", data.id)
      .select(PARTNER_COLS).single();
    if (error) throw error;
    return row as PartnerRow;
  });

export const adminResendPartnerInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => { if (!d?.id) throw new Error("id required"); return d; })
  .handler(async ({ context, data }) => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const { data: p, error } = await admin
      .from("sales_partners").select("id,email,full_name").eq("id", data.id).maybeSingle();
    if (error) throw error;
    if (!p?.email) throw new Error("Partner has no email on file");
    const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(p.email, {
      data: { full_name: p.full_name, role: "partner" },
    });
    if (inviteErr && !/already/i.test(inviteErr.message)) throw inviteErr;
    return { ok: true, email: p.email };
  });
