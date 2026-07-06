import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertSuperAdmin } from "@/lib/admin-auth";

export type AffiliateEnquiryStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "approved"
  | "rejected"
  | "closed";

export const AFFILIATE_ENQUIRY_STATUSES: { value: AffiliateEnquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "closed", label: "Closed" },
];

export type AffiliateEnquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  location: string | null;
  website: string | null;
  audience_type: string | null;
  experience: string | null;
  expected_referrals: string | null;
  hear_about: string | null;
  message: string;
  status: AffiliateEnquiryStatus;
  created_at: string;
};

const SELECT_COLS =
  "id, full_name, email, phone, company, location, website, audience_type, experience, expected_referrals, hear_about, message, status, created_at";

export const listAffiliateEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AffiliateEnquiry[]> => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("affiliate_enquiries")
      .select(SELECT_COLS)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      ...r,
      status: (r.status ?? "new") as AffiliateEnquiryStatus,
    })) as AffiliateEnquiry[];
  });

export const updateAffiliateEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; status: AffiliateEnquiryStatus }) => {
    if (!data?.id) throw new Error("id required");
    if (!AFFILIATE_ENQUIRY_STATUSES.some((s) => s.value === data.status))
      throw new Error("Invalid status");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("affiliate_enquiries")
      .update({ status: data.status })
      .eq("id", data.id)
      .select(SELECT_COLS)
      .single();
    if (error) throw error;
    return row as AffiliateEnquiry;
  });
