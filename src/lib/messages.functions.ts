import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAnyAdmin } from "@/lib/admin-auth";

export type ChatMessage = {
  id: string;
  onboarding_id: string;
  sender_role: "client" | "admin";
  sender_name: string | null;
  body: string;
  created_at: string;
  is_mine: boolean;
};

export type InboxThread = {
  onboarding_id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  status: string;
  last_message: string | null;
  last_message_at: string | null;
  last_sender_role: "client" | "admin" | null;
  unread_for_admin: number;
};

const MSG_COLS =
  "id, onboarding_id, sender_role, sender_id, sender_name, body, created_at, read_by_client_at, read_by_admin_at";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                       */
/* ------------------------------------------------------------------ */

async function loadClientOnboarding(context: any) {
  const email = (context.claims?.email ?? "").toString().trim().toLowerCase();
  if (!email) throw new Error("No email associated with your account.");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: adminRow } = await (supabaseAdmin as any)
    .from("admins")
    .select("id")
    .eq("id", context.userId)
    .maybeSingle();
  if (adminRow) throw new Error("Admins cannot use the client chat.");

  const { data, error } = await (supabaseAdmin as any)
    .from("client_onboarding")
    .select("id, company_name, contact_person, email")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return { row: data ?? null, email };
}

function toChatMessage(row: any, viewerRole: "client" | "admin"): ChatMessage {
  return {
    id: row.id,
    onboarding_id: row.onboarding_id,
    sender_role: row.sender_role,
    sender_name: row.sender_name ?? null,
    body: row.body,
    created_at: row.created_at,
    is_mine: row.sender_role === viewerRole,
  };
}

/* ------------------------------------------------------------------ */
/* Client-side server functions                                         */
/* ------------------------------------------------------------------ */

export const getMyThread = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{
    thread: { onboarding_id: string; company_name: string } | null;
    messages: ChatMessage[];
  }> => {
    const { row } = await loadClientOnboarding(context);
    if (!row) return { thread: null, messages: [] };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("client_messages")
      .select(MSG_COLS)
      .eq("onboarding_id", row.id)
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) throw error;
    // Mark all admin messages as read by this client.
    const now = new Date().toISOString();
    await (supabaseAdmin as any)
      .from("client_messages")
      .update({ read_by_client_at: now })
      .eq("onboarding_id", row.id)
      .eq("sender_role", "admin")
      .is("read_by_client_at", null);
    return {
      thread: { onboarding_id: row.id, company_name: row.company_name },
      messages: (data ?? []).map((r: any) => toChatMessage(r, "client")),
    };
  });

export const sendMyMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { body: string }) => {
    const body = (data?.body ?? "").toString().trim();
    if (!body) throw new Error("Message cannot be empty");
    if (body.length > 4000) throw new Error("Message too long (4000 char max)");
    return { body };
  })
  .handler(async ({ context, data }): Promise<ChatMessage> => {
    const { row } = await loadClientOnboarding(context);
    if (!row) throw new Error("No onboarding record linked to your account.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const senderName = row.contact_person || row.company_name || null;
    const { data: inserted, error } = await (supabaseAdmin as any)
      .from("client_messages")
      .insert({
        onboarding_id: row.id,
        sender_role: "client",
        sender_id: context.userId,
        sender_name: senderName,
        body: data.body,
        read_by_client_at: new Date().toISOString(),
      })
      .select(MSG_COLS)
      .single();
    if (error) throw error;
    return toChatMessage(inserted, "client");
  });

/* ------------------------------------------------------------------ */
/* Admin-side server functions                                          */
/* ------------------------------------------------------------------ */

export const listInboxThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<InboxThread[]> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // All onboardings — even those with zero messages — should appear so an
    // admin can start a thread. Then fold in message stats.
    const { data: onboardings, error: oErr } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .select("id, company_name, contact_person, email, status")
      .order("created_at", { ascending: false })
      .limit(500);
    if (oErr) throw oErr;

    const { data: messages, error: mErr } = await (supabaseAdmin as any)
      .from("client_messages")
      .select("onboarding_id, sender_role, body, created_at, read_by_admin_at")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (mErr) throw mErr;

    const byThread = new Map<string, any[]>();
    for (const m of messages ?? []) {
      const list = byThread.get(m.onboarding_id) ?? [];
      list.push(m);
      byThread.set(m.onboarding_id, list);
    }

    const threads: InboxThread[] = (onboardings ?? []).map((o: any) => {
      const list = byThread.get(o.id) ?? [];
      const latest = list[0] ?? null;
      const unread = list.filter(
        (m: any) => m.sender_role === "client" && !m.read_by_admin_at,
      ).length;
      return {
        onboarding_id: o.id,
        company_name: o.company_name,
        contact_person: o.contact_person ?? null,
        email: o.email ?? null,
        status: o.status,
        last_message: latest?.body ?? null,
        last_message_at: latest?.created_at ?? null,
        last_sender_role: (latest?.sender_role ?? null) as any,
        unread_for_admin: unread,
      };
    });

    // Sort: unread first, then by last activity, then by company name.
    threads.sort((a, b) => {
      if ((b.unread_for_admin > 0 ? 1 : 0) - (a.unread_for_admin > 0 ? 1 : 0) !== 0) {
        return (b.unread_for_admin > 0 ? 1 : 0) - (a.unread_for_admin > 0 ? 1 : 0);
      }
      const at = a.last_message_at ?? "";
      const bt = b.last_message_at ?? "";
      if (at !== bt) return at < bt ? 1 : -1;
      return a.company_name.localeCompare(b.company_name);
    });

    return threads;
  });

export const getThreadForAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { onboarding_id: string }) => {
    if (!data?.onboarding_id) throw new Error("onboarding_id required");
    return data;
  })
  .handler(async ({ context, data }): Promise<{
    thread: { onboarding_id: string; company_name: string; contact_person: string | null; email: string | null };
    messages: ChatMessage[];
  }> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: onboarding, error: oErr } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .select("id, company_name, contact_person, email")
      .eq("id", data.onboarding_id)
      .maybeSingle();
    if (oErr) throw oErr;
    if (!onboarding) throw new Error("Onboarding record not found");

    const { data: msgs, error } = await (supabaseAdmin as any)
      .from("client_messages")
      .select(MSG_COLS)
      .eq("onboarding_id", data.onboarding_id)
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) throw error;

    // Mark all client messages as read by admin.
    const now = new Date().toISOString();
    await (supabaseAdmin as any)
      .from("client_messages")
      .update({ read_by_admin_at: now })
      .eq("onboarding_id", data.onboarding_id)
      .eq("sender_role", "client")
      .is("read_by_admin_at", null);

    return {
      thread: {
        onboarding_id: onboarding.id,
        company_name: onboarding.company_name,
        contact_person: onboarding.contact_person ?? null,
        email: onboarding.email ?? null,
      },
      messages: (msgs ?? []).map((r: any) => toChatMessage(r, "admin")),
    };
  });

export const sendAdminMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { onboarding_id: string; body: string }) => {
    if (!data?.onboarding_id) throw new Error("onboarding_id required");
    const body = (data?.body ?? "").toString().trim();
    if (!body) throw new Error("Message cannot be empty");
    if (body.length > 4000) throw new Error("Message too long (4000 char max)");
    return { onboarding_id: data.onboarding_id, body };
  })
  .handler(async ({ context, data }): Promise<ChatMessage> => {
    const admin = await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const senderName = admin.email?.split("@")[0] ?? "SAISPL Team";
    const { data: inserted, error } = await (supabaseAdmin as any)
      .from("client_messages")
      .insert({
        onboarding_id: data.onboarding_id,
        sender_role: "admin",
        sender_id: admin.id,
        sender_name: senderName,
        body: data.body,
        read_by_admin_at: new Date().toISOString(),
      })
      .select(MSG_COLS)
      .single();
    if (error) throw error;
    return toChatMessage(inserted, "admin");
  });
