import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAnyAdmin } from "@/lib/admin-auth";

export type ChatAttachment = {
  path: string;
  name: string;
  size: number;
  type: string;
};

export type ChatMessage = {
  id: string;
  onboarding_id: string;
  sender_role: "client" | "admin";
  sender_name: string | null;
  body: string;
  created_at: string;
  is_mine: boolean;
  is_internal: boolean;
  attachments: ChatAttachment[];
};

export type ConversationStatus =
  | "unread"
  | "waiting_on_team"
  | "waiting_on_client"
  | "resolved";

export const CONVERSATION_STATUSES: {
  value: ConversationStatus;
  label: string;
  tone: "amber" | "sky" | "violet" | "emerald";
}[] = [
  { value: "unread", label: "Unread", tone: "amber" },
  { value: "waiting_on_team", label: "Waiting on Team", tone: "violet" },
  { value: "waiting_on_client", label: "Waiting on Client", tone: "sky" },
  { value: "resolved", label: "Resolved", tone: "emerald" },
];

export type InboxThread = {
  onboarding_id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  status: string;
  package_selected: string | null;
  project_manager: string | null;
  target_launch_date: string | null;
  maintenance_plan: string | null;
  conversation_status: ConversationStatus;
  assignee_id: string | null;
  assignee_name: string | null;
  last_client_at: string | null;
  last_admin_at: string | null;
  last_message: string | null;
  last_message_at: string | null;
  last_sender_role: "client" | "admin" | null;
  unread_for_admin: number;
};

export type ThreadContext = {
  onboarding_id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  project_manager: string | null;
  project_type: string | null;
  package_selected: string | null;
  target_launch_date: string | null;
  maintenance_plan: string | null;
  conversation_status: ConversationStatus;
  assignee_id: string | null;
  assignee_name: string | null;
  last_client_at: string | null;
  last_admin_at: string | null;
};

export type AssignableAdmin = { id: string; email: string; role: string };

const MSG_COLS =
  "id, onboarding_id, sender_role, sender_id, sender_name, body, created_at, read_by_client_at, read_by_admin_at, attachments, is_internal";

const ONBOARDING_INBOX_COLS =
  "id, company_name, contact_person, email, phone, status, project_manager, project_type, package_selected, target_launch_date, checklist, conversation_status, conversation_assignee_id, conversation_assignee_name, conversation_last_client_at, conversation_last_admin_at";

const CHAT_BUCKET = "client-onboarding-assets";
const MAX_ATTACHMENTS = 6;
const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024; // 15 MB per file

function sanitizeFileName(name: string): string {
  return (
    name
      .replace(/[^\w.\-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 120) || "file"
  );
}

function extractMaintenance(checklist: any): string | null {
  if (checklist && typeof checklist === "object" && typeof checklist.__maintenance_plan === "string") {
    return checklist.__maintenance_plan;
  }
  return null;
}

function validateAttachments(input: unknown): ChatAttachment[] {
  if (input == null) return [];
  if (!Array.isArray(input)) throw new Error("attachments must be an array");
  if (input.length > MAX_ATTACHMENTS)
    throw new Error(`Too many attachments (max ${MAX_ATTACHMENTS})`);
  return input.map((raw: any) => {
    if (!raw || typeof raw !== "object") throw new Error("Invalid attachment");
    const path = String(raw.path ?? "");
    const name = String(raw.name ?? "").slice(0, 200);
    const size = Number(raw.size ?? 0);
    const type = String(raw.type ?? "").slice(0, 120);
    if (!path.startsWith("messages/")) throw new Error("Invalid attachment path");
    if (!name) throw new Error("Attachment name required");
    if (!Number.isFinite(size) || size < 0 || size > MAX_ATTACHMENT_BYTES)
      throw new Error("Attachment too large");
    return { path, name, size, type };
  });
}

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
  const rawAtt = Array.isArray(row.attachments) ? row.attachments : [];
  const attachments: ChatAttachment[] = rawAtt.map((a: any) => ({
    path: String(a?.path ?? ""),
    name: String(a?.name ?? "file"),
    size: Number(a?.size ?? 0),
    type: String(a?.type ?? ""),
  }));
  return {
    id: row.id,
    onboarding_id: row.onboarding_id,
    sender_role: row.sender_role,
    sender_name: row.sender_name ?? null,
    body: row.body,
    created_at: row.created_at,
    is_mine: row.sender_role === viewerRole,
    is_internal: !!row.is_internal,
    attachments,
  };
}

function toThreadContext(o: any): ThreadContext {
  return {
    onboarding_id: o.id,
    company_name: o.company_name,
    contact_person: o.contact_person ?? null,
    email: o.email ?? null,
    phone: o.phone ?? null,
    status: o.status,
    project_manager: o.project_manager ?? null,
    project_type: o.project_type ?? null,
    package_selected: o.package_selected ?? null,
    target_launch_date: o.target_launch_date ?? null,
    maintenance_plan: extractMaintenance(o.checklist),
    conversation_status: (o.conversation_status ?? "unread") as ConversationStatus,
    assignee_id: o.conversation_assignee_id ?? null,
    assignee_name: o.conversation_assignee_name ?? null,
    last_client_at: o.conversation_last_client_at ?? null,
    last_admin_at: o.conversation_last_admin_at ?? null,
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
      .eq("is_internal", false)
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) throw error;
    // Mark all client-visible admin messages as read by this client.
    const now = new Date().toISOString();
    await (supabaseAdmin as any)
      .from("client_messages")
      .update({ read_by_client_at: now })
      .eq("onboarding_id", row.id)
      .eq("sender_role", "admin")
      .eq("is_internal", false)
      .is("read_by_client_at", null);
    return {
      thread: { onboarding_id: row.id, company_name: row.company_name },
      messages: (data ?? []).map((r: any) => toChatMessage(r, "client")),
    };
  });

export const sendMyMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { body?: string; attachments?: unknown }) => {
    const body = (data?.body ?? "").toString().trim();
    const attachments = validateAttachments(data?.attachments);
    if (!body && attachments.length === 0) throw new Error("Message cannot be empty");
    if (body.length > 4000) throw new Error("Message too long (4000 char max)");
    return { body, attachments };
  })
  .handler(async ({ context, data }): Promise<ChatMessage> => {
    const { row } = await loadClientOnboarding(context);
    if (!row) throw new Error("No onboarding record linked to your account.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    for (const a of data.attachments) {
      if (!a.path.startsWith(`messages/${row.id}/`)) {
        throw new Error("Attachment does not belong to this conversation");
      }
    }
    const senderName = row.contact_person || row.company_name || null;
    const now = new Date().toISOString();
    const { data: inserted, error } = await (supabaseAdmin as any)
      .from("client_messages")
      .insert({
        onboarding_id: row.id,
        sender_role: "client",
        sender_id: context.userId,
        sender_name: senderName,
        body: data.body,
        attachments: data.attachments,
        is_internal: false,
        read_by_client_at: now,
      })
      .select(MSG_COLS)
      .single();
    if (error) throw error;
    // Auto-flip conversation state: client just messaged → team owes reply.
    await (supabaseAdmin as any)
      .from("client_onboarding")
      .update({
        conversation_status: "waiting_on_team",
        conversation_last_client_at: now,
      })
      .eq("id", row.id);
    return toChatMessage(inserted, "client");
  });

/**
 * Non-mutating summary for the signed-in client. Powers the unread badge,
 * bell menu and toast notifications inside the client portal without
 * marking anything as read (only opening the Messages tab marks read).
 */
export type ClientNotification = {
  id: string;
  sender_name: string | null;
  body: string;
  created_at: string;
  has_attachments: boolean;
};

export const getMyThreadSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{
    onboarding_id: string | null;
    unread_count: number;
    latest_admin_at: string | null;
    recent_admin: ClientNotification[];
  }> => {
    const { row } = await loadClientOnboarding(context);
    if (!row) {
      return { onboarding_id: null, unread_count: 0, latest_admin_at: null, recent_admin: [] };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: recent, error } = await (supabaseAdmin as any)
      .from("client_messages")
      .select("id, sender_name, body, created_at, attachments, read_by_client_at")
      .eq("onboarding_id", row.id)
      .eq("sender_role", "admin")
      .eq("is_internal", false)
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw error;
    const list = (recent ?? []) as any[];
    const unread_count = list.filter((m) => !m.read_by_client_at).length;
    return {
      onboarding_id: row.id,
      unread_count,
      latest_admin_at: list[0]?.created_at ?? null,
      recent_admin: list.map((m) => ({
        id: m.id,
        sender_name: m.sender_name ?? null,
        body: m.body ?? "",
        created_at: m.created_at,
        has_attachments: Array.isArray(m.attachments) && m.attachments.length > 0,
      })),
    };
  });

/* ------------------------------------------------------------------ */
/* Attachment upload / download signing                                 */
/* ------------------------------------------------------------------ */

export const signMessageAttachmentUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { file_name: string; content_type?: string; onboarding_id?: string }) => {
    const file_name = sanitizeFileName(String(data?.file_name ?? ""));
    if (!file_name) throw new Error("file_name required");
    return {
      file_name,
      content_type: String(data?.content_type ?? ""),
      onboarding_id: data?.onboarding_id ? String(data.onboarding_id) : null,
    };
  })
  .handler(async ({ context, data }): Promise<{
    path: string;
    token: string;
    signedUrl: string;
  }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Admin path: onboarding_id supplied → use it after verifying admin role.
    let targetOnboardingId: string | null = null;
    const { data: adminRow } = await (supabaseAdmin as any)
      .from("admins")
      .select("id")
      .eq("id", context.userId)
      .maybeSingle();
    if (adminRow) {
      if (!data.onboarding_id) throw new Error("onboarding_id required for admin uploads");
      targetOnboardingId = data.onboarding_id;
    } else {
      const { row } = await loadClientOnboarding(context);
      if (!row) throw new Error("No onboarding record linked to your account.");
      targetOnboardingId = row.id;
    }
    const path = `messages/${targetOnboardingId}/${crypto.randomUUID()}-${data.file_name}`;
    const { data: signed, error } = await (supabaseAdmin as any).storage
      .from(CHAT_BUCKET)
      .createSignedUploadUrl(path);
    if (error) throw error;
    return { path, token: signed.token, signedUrl: signed.signedUrl };
  });

export const signMessageAttachmentDownload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { path: string }) => {
    if (!data?.path || !data.path.startsWith("messages/")) {
      throw new Error("Invalid attachment path");
    }
    return { path: data.path };
  })
  .handler(async ({ context, data }): Promise<{ url: string; name: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: adminRow } = await (supabaseAdmin as any)
      .from("admins")
      .select("id")
      .eq("id", context.userId)
      .maybeSingle();
    if (!adminRow) {
      const { row } = await loadClientOnboarding(context);
      if (!row) throw new Error("Not authorized");
      if (!data.path.startsWith(`messages/${row.id}/`)) {
        throw new Error("Not authorized for this file");
      }
    }
    const { data: signed, error } = await (supabaseAdmin as any).storage
      .from(CHAT_BUCKET)
      .createSignedUrl(data.path, 300);
    if (error) throw error;
    const name = data.path.split("/").pop() ?? "file";
    return { url: signed.signedUrl, name };
  });

/* ------------------------------------------------------------------ */
/* Admin-side server functions                                          */
/* ------------------------------------------------------------------ */

export const listInboxThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<InboxThread[]> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: onboardings, error: oErr } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .select(ONBOARDING_INBOX_COLS)
      .order("created_at", { ascending: false })
      .limit(500);
    if (oErr) throw oErr;

    const { data: messages, error: mErr } = await (supabaseAdmin as any)
      .from("client_messages")
      .select("onboarding_id, sender_role, body, created_at, read_by_admin_at, is_internal")
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
      // "Last message" excludes internal notes so preview matches client view.
      const clientVisible = list.filter((m: any) => !m.is_internal);
      const latest = clientVisible[0] ?? null;
      const unread = list.filter(
        (m: any) => m.sender_role === "client" && !m.read_by_admin_at,
      ).length;
      const ctx = toThreadContext(o);
      return {
        onboarding_id: o.id,
        company_name: o.company_name,
        contact_person: o.contact_person ?? null,
        email: o.email ?? null,
        status: o.status,
        package_selected: ctx.package_selected,
        project_manager: ctx.project_manager,
        target_launch_date: ctx.target_launch_date,
        maintenance_plan: ctx.maintenance_plan,
        conversation_status: ctx.conversation_status,
        assignee_id: ctx.assignee_id,
        assignee_name: ctx.assignee_name,
        last_client_at: ctx.last_client_at,
        last_admin_at: ctx.last_admin_at,
        last_message: latest?.body ?? null,
        last_message_at: latest?.created_at ?? null,
        last_sender_role: (latest?.sender_role ?? null) as any,
        unread_for_admin: unread,
      };
    });

    // Sort: unread first, then waiting_on_team, then by last activity.
    const stateWeight: Record<ConversationStatus, number> = {
      unread: 0,
      waiting_on_team: 1,
      waiting_on_client: 2,
      resolved: 3,
    };
    threads.sort((a, b) => {
      const aUnread = a.unread_for_admin > 0 ? 0 : 1;
      const bUnread = b.unread_for_admin > 0 ? 0 : 1;
      if (aUnread !== bUnread) return aUnread - bUnread;
      const sw = stateWeight[a.conversation_status] - stateWeight[b.conversation_status];
      if (sw !== 0) return sw;
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
    thread: ThreadContext;
    messages: ChatMessage[];
  }> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: onboarding, error: oErr } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .select(ONBOARDING_INBOX_COLS)
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

    // If thread was flagged unread, promote it to waiting_on_team so the
    // status reflects the fact that admin has now seen it.
    if (onboarding.conversation_status === "unread") {
      await (supabaseAdmin as any)
        .from("client_onboarding")
        .update({ conversation_status: "waiting_on_team" })
        .eq("id", data.onboarding_id);
      onboarding.conversation_status = "waiting_on_team";
    }

    return {
      thread: toThreadContext(onboarding),
      messages: (msgs ?? []).map((r: any) => toChatMessage(r, "admin")),
    };
  });

export const sendAdminMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    onboarding_id: string;
    body?: string;
    attachments?: unknown;
    is_internal?: boolean;
  }) => {
    if (!data?.onboarding_id) throw new Error("onboarding_id required");
    const body = (data?.body ?? "").toString().trim();
    const attachments = validateAttachments(data?.attachments);
    if (!body && attachments.length === 0) throw new Error("Message cannot be empty");
    if (body.length > 4000) throw new Error("Message too long (4000 char max)");
    return {
      onboarding_id: data.onboarding_id,
      body,
      attachments,
      is_internal: !!data.is_internal,
    };
  })
  .handler(async ({ context, data }): Promise<ChatMessage> => {
    const admin = await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const senderName = admin.email?.split("@")[0] ?? "SAISPL Team";
    const now = new Date().toISOString();
    const { data: inserted, error } = await (supabaseAdmin as any)
      .from("client_messages")
      .insert({
        onboarding_id: data.onboarding_id,
        sender_role: "admin",
        sender_id: admin.id,
        sender_name: senderName,
        body: data.body,
        attachments: data.attachments,
        is_internal: data.is_internal,
        // Internal notes never surface to client; mark them as already-read
        // by client so they don't skew unread counts elsewhere.
        read_by_admin_at: now,
        read_by_client_at: data.is_internal ? now : null,
      })
      .select(MSG_COLS)
      .single();
    if (error) throw error;

    // Client-visible replies flip status to waiting_on_client. Internal notes
    // never change the client-facing state.
    if (!data.is_internal) {
      await (supabaseAdmin as any)
        .from("client_onboarding")
        .update({
          conversation_status: "waiting_on_client",
          conversation_last_admin_at: now,
        })
        .eq("id", data.onboarding_id);
    }
    return toChatMessage(inserted, "admin");
  });

export const setConversationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { onboarding_id: string; status: ConversationStatus }) => {
    if (!data?.onboarding_id) throw new Error("onboarding_id required");
    const allowed: ConversationStatus[] = [
      "unread",
      "waiting_on_team",
      "waiting_on_client",
      "resolved",
    ];
    if (!allowed.includes(data.status)) throw new Error("Invalid status");
    return { onboarding_id: data.onboarding_id, status: data.status };
  })
  .handler(async ({ context, data }): Promise<{ ok: true }> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .update({ conversation_status: data.status })
      .eq("id", data.onboarding_id);
    if (error) throw error;
    return { ok: true };
  });

export const setConversationAssignee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { onboarding_id: string; assignee_id: string | null }) => {
    if (!data?.onboarding_id) throw new Error("onboarding_id required");
    return {
      onboarding_id: data.onboarding_id,
      assignee_id: data.assignee_id ? String(data.assignee_id) : null,
    };
  })
  .handler(async ({ context, data }): Promise<{ ok: true; name: string | null }> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let name: string | null = null;
    if (data.assignee_id) {
      const { data: a, error } = await (supabaseAdmin as any)
        .from("admins")
        .select("id, email")
        .eq("id", data.assignee_id)
        .maybeSingle();
      if (error) throw error;
      if (!a) throw new Error("Assignee not found");
      name = a.email?.split("@")[0] ?? a.email ?? null;
    }
    const { error } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .update({
        conversation_assignee_id: data.assignee_id,
        conversation_assignee_name: name,
      })
      .eq("id", data.onboarding_id);
    if (error) throw error;
    return { ok: true, name };
  });

export const listAssignableAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AssignableAdmin[]> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("admins")
      .select("id, email, role")
      .order("email", { ascending: true });
    if (error) throw error;
    return (data ?? []) as AssignableAdmin[];
  });

/* ------------------------------------------------------------------ */
/* Recent messages preview (used on onboarding detail page)             */
/* ------------------------------------------------------------------ */

export const getRecentMessagesForAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { onboarding_id: string; limit?: number }) => {
    if (!data?.onboarding_id) throw new Error("onboarding_id required");
    const limit = Math.min(Math.max(Number(data.limit ?? 5), 1), 20);
    return { onboarding_id: data.onboarding_id, limit };
  })
  .handler(async ({ context, data }): Promise<{
    messages: ChatMessage[];
    unread_for_admin: number;
    conversation_status: ConversationStatus;
    assignee_name: string | null;
  }> => {
    await assertAnyAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: msgs, error } = await (supabaseAdmin as any)
      .from("client_messages")
      .select(MSG_COLS)
      .eq("onboarding_id", data.onboarding_id)
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (error) throw error;
    const messages = (msgs ?? [])
      .reverse()
      .map((r: any) => toChatMessage(r, "admin"));
    const { data: unreadRows } = await (supabaseAdmin as any)
      .from("client_messages")
      .select("id", { count: "exact", head: true })
      .eq("onboarding_id", data.onboarding_id)
      .eq("sender_role", "client")
      .is("read_by_admin_at", null);
    const { data: o } = await (supabaseAdmin as any)
      .from("client_onboarding")
      .select("conversation_status, conversation_assignee_name")
      .eq("id", data.onboarding_id)
      .maybeSingle();
    return {
      messages,
      unread_for_admin: (unreadRows as any)?.length ?? 0,
      conversation_status: (o?.conversation_status ?? "unread") as ConversationStatus,
      assignee_name: o?.conversation_assignee_name ?? null,
    };
  });
