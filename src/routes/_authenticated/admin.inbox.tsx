import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import {
  Inbox,
  Loader2,
  MessageSquare,
  Search,
  UserRound,
  CircleDot,
  Building2,
  ExternalLink,
  Calendar,
  Package,
  Wrench,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";

import {
  CONVERSATION_STATUSES,
  getThreadForAdmin,
  listAssignableAdmins,
  listInboxThreads,
  sendAdminMessage,
  setConversationAssignee,
  setConversationStatus,
  type AssignableAdmin,
  type ConversationStatus,
  type InboxThread,
  type ThreadContext,
} from "@/lib/messages.functions";
import { ChatThread } from "@/components/ChatThread";
import { WrongRoleNotice } from "@/components/WrongRoleNotice";

const inboxSearchSchema = z.object({
  thread: fallback(z.string().uuid().optional(), undefined),
});

export const Route = createFileRoute("/_authenticated/admin/inbox")({
  validateSearch: zodValidator(inboxSearchSchema),
  component: AdminInboxPage,
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-lg rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200 mt-8">
      <p className="font-semibold">Couldn't load the inbox</p>
      <p className="mt-2 text-red-200/80">{(error as Error)?.message ?? "Unknown error"}</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs hover:bg-red-500/20"
      >
        Try again
      </button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-lg rounded-2xl border border-border/60 bg-card/60 p-6 text-sm text-muted-foreground mt-8">
      Inbox not available.
    </div>
  ),
  head: () => ({
    meta: [
      { title: "Client Inbox — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});


const STATUS_STYLES: Record<ConversationStatus, string> = {
  unread: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  waiting_on_team: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  waiting_on_client: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const STATUS_LABEL: Record<ConversationStatus, string> = Object.fromEntries(
  CONVERSATION_STATUSES.map((s) => [s.value, s.label]),
) as Record<ConversationStatus, string>;

function fmtRelative(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

function AdminInboxPage() {
  const parentCtx = Route.useRouteContext() as {
    isAdminRole?: boolean;
    currentUserEmail?: string | null;
  };
  const qc = useQueryClient();
  const navigate = useNavigate({ from: "/admin/inbox" });
  const search = Route.useSearch();
  const listFn = useServerFn(listInboxThreads);
  const adminsFn = useServerFn(listAssignableAdmins);
  const [selected, setSelected] = useState<string | null>(search.thread ?? null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ConversationStatus>("all");


  // Sync selection ← URL (deep-link from onboarding "Messages" card).
  useEffect(() => {
    if (search.thread && search.thread !== selected) {
      setSelected(search.thread);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.thread]);

  const setActive = (id: string) => {
    setSelected(id);
    navigate({ search: { thread: id }, replace: true });
  };

  const isAdmin = parentCtx?.isAdminRole !== false; // undefined = fallback allow, server will still enforce
  const threadsQ = useQuery({
    queryKey: ["admin-inbox", "list"],
    queryFn: () => listFn(),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    enabled: isAdmin,
  });

  const adminsQ = useQuery({
    queryKey: ["admin-inbox", "admins"],
    queryFn: () => adminsFn(),
    staleTime: 60_000,
    enabled: isAdmin,
  });


  const threads = threadsQ.data ?? [];
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return threads.filter((t) => {
      if (statusFilter !== "all" && t.conversation_status !== statusFilter) return false;
      if (!term) return true;
      return (
        t.company_name.toLowerCase().includes(term) ||
        (t.email ?? "").toLowerCase().includes(term) ||
        (t.contact_person ?? "").toLowerCase().includes(term) ||
        (t.last_message ?? "").toLowerCase().includes(term)
      );
    });
  }, [threads, q, statusFilter]);

  const currentId =
    selected ??
    filtered.find((t) => t.unread_for_admin > 0)?.onboarding_id ??
    filtered[0]?.onboarding_id ??
    null;

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-inbox", "list"] });
    if (currentId) qc.invalidateQueries({ queryKey: ["admin-inbox", "thread", currentId] });
  };

  const totals = useMemo(() => {
    return {
      unread: threads.filter((t) => t.conversation_status === "unread").length,
      waiting_team: threads.filter((t) => t.conversation_status === "waiting_on_team").length,
      waiting_client: threads.filter((t) => t.conversation_status === "waiting_on_client").length,
      resolved: threads.filter((t) => t.conversation_status === "resolved").length,
    };
  }, [threads]);

  if (!isAdmin) {
    return <WrongRoleNotice mode="client-on-admin" email={parentCtx?.currentUserEmail ?? null} />;
  }

  return (

    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <Inbox className="h-6 w-6 text-brand" /> Client Inbox
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Shared conversation for every client. One thread per project.
          </p>
        </div>
        {threadsQ.isFetching && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> syncing…
          </span>
        )}
      </header>

      {/* Status filter chips */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterChip
          label={`All (${threads.length})`}
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
        />
        <FilterChip
          label={`Unread (${totals.unread})`}
          tone="amber"
          active={statusFilter === "unread"}
          onClick={() => setStatusFilter("unread")}
        />
        <FilterChip
          label={`Waiting on Team (${totals.waiting_team})`}
          tone="violet"
          active={statusFilter === "waiting_on_team"}
          onClick={() => setStatusFilter("waiting_on_team")}
        />
        <FilterChip
          label={`Waiting on Client (${totals.waiting_client})`}
          tone="sky"
          active={statusFilter === "waiting_on_client"}
          onClick={() => setStatusFilter("waiting_on_client")}
        />
        <FilterChip
          label={`Resolved (${totals.resolved})`}
          tone="emerald"
          active={statusFilter === "resolved"}
          onClick={() => setStatusFilter("resolved")}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)_320px]">
        {/* Threads list */}
        <aside className="flex h-[calc(100vh-14rem)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-elegant backdrop-blur">
          <div className="border-b border-border/60 p-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search clients…"
                className="w-full rounded-lg border border-border/60 bg-background/60 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60 focus:ring-2 focus:ring-brand/30"
              />
            </label>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threadsQ.isLoading && (
              <div className="grid h-40 place-items-center text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {!threadsQ.isLoading && filtered.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No conversations match this filter.
              </div>
            )}
            <ul className="divide-y divide-border/40">
              {filtered.map((t) => (
                <ThreadRow
                  key={t.onboarding_id}
                  thread={t}
                  active={t.onboarding_id === currentId}
                  onSelect={() => setActive(t.onboarding_id)}
                />
              ))}
            </ul>
          </div>
        </aside>

        {/* Conversation + context */}
        {currentId ? (
          <ThreadPane
            key={currentId}
            onboardingId={currentId}
            admins={adminsQ.data ?? []}
            onChange={invalidateAll}
          />
        ) : (
          <>
            <div className="grid h-[calc(100vh-14rem)] min-h-[560px] place-items-center rounded-2xl border border-border/60 bg-card/60 text-sm text-muted-foreground shadow-elegant lg:col-span-2">
              Select a conversation to get started.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  tone,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: "amber" | "violet" | "sky" | "emerald";
}) {
  const toneCls = tone
    ? {
        amber: "border-amber-500/30 text-amber-300",
        violet: "border-violet-500/30 text-violet-300",
        sky: "border-sky-500/30 text-sky-300",
        emerald: "border-emerald-500/30 text-emerald-300",
      }[tone]
    : "border-border/60 text-muted-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-brand/15 border-brand/40 text-brand-foreground shadow-sm"
          : `${toneCls} bg-background/50 hover:bg-background`
      }`}
    >
      {label}
    </button>
  );
}

function ThreadRow({
  thread,
  active,
  onSelect,
}: {
  thread: InboxThread;
  active: boolean;
  onSelect: () => void;
}) {
  const t = thread;
  const preview = t.last_message
    ? (t.last_sender_role === "admin" ? "You: " : "") + t.last_message
    : "No messages yet";
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
          active ? "bg-brand/10" : "hover:bg-accent/40"
        }`}
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted/60 text-xs font-semibold text-foreground">
          {t.company_name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{t.company_name}</p>
            {t.last_message_at && (
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {fmtRelative(t.last_message_at)}
              </span>
            )}
          </div>
          <p
            className={`truncate text-xs ${
              t.unread_for_admin > 0 ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {preview}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${STATUS_STYLES[t.conversation_status]}`}
            >
              <CircleDot className="h-2.5 w-2.5" />
              {STATUS_LABEL[t.conversation_status]}
            </span>
            {t.assignee_name && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <UserRound className="h-2.5 w-2.5" />
                {t.assignee_name}
              </span>
            )}
            {t.package_selected && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Package className="h-2.5 w-2.5" />
                {t.package_selected}
              </span>
            )}
          </div>
        </div>
        {t.unread_for_admin > 0 && (
          <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-semibold text-brand-foreground">
            {t.unread_for_admin}
          </span>
        )}
      </button>
    </li>
  );
}

function ThreadPane({
  onboardingId,
  admins,
  onChange,
}: {
  onboardingId: string;
  admins: AssignableAdmin[];
  onChange: () => void;
}) {
  const qc = useQueryClient();
  const getFn = useServerFn(getThreadForAdmin);
  const sendFn = useServerFn(sendAdminMessage);
  const statusFn = useServerFn(setConversationStatus);
  const assignFn = useServerFn(setConversationAssignee);

  const q = useQuery({
    queryKey: ["admin-inbox", "thread", onboardingId],
    queryFn: () => getFn({ data: { onboarding_id: onboardingId } }),
    refetchInterval: 4000,
    refetchOnWindowFocus: true,
  });

  const sendMut = useMutation({
    mutationFn: (payload: { body: string; attachments: any[]; is_internal?: boolean }) =>
      sendFn({ data: { onboarding_id: onboardingId, ...payload } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inbox", "thread", onboardingId] });
      onChange();
    },
  });

  const statusMut = useMutation({
    mutationFn: (status: ConversationStatus) =>
      statusFn({ data: { onboarding_id: onboardingId, status } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inbox", "thread", onboardingId] });
      onChange();
    },
  });

  const assignMut = useMutation({
    mutationFn: (assignee_id: string | null) =>
      assignFn({ data: { onboarding_id: onboardingId, assignee_id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inbox", "thread", onboardingId] });
      onChange();
    },
  });

  if (q.isLoading) {
    return (
      <>
        <div className="grid h-[calc(100vh-14rem)] min-h-[560px] place-items-center rounded-2xl border border-border/60 bg-card/60 text-sm text-muted-foreground lg:col-span-2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </>
    );
  }
  if (q.error || !q.data) {
    return (
      <>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200 lg:col-span-2">
          {(q.error as Error)?.message ?? "Failed to load conversation"}
        </div>
      </>
    );
  }

  const t = q.data.thread;
  const messages = q.data.messages;

  return (
    <>
      <section>
        <ChatThread
          messages={messages}
          isSending={sendMut.isPending}
          uploadOnboardingId={onboardingId}
          allowInternalNote
          onSend={async (payload) => {
            await sendMut.mutateAsync(payload);
          }}
          placeholder={`Reply to ${t.contact_person ?? t.company_name}…`}
          emptyHint="No messages yet. Start the conversation or leave an internal note."
          headerLeft={
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-brand" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{t.company_name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t.contact_person ? `${t.contact_person} · ` : ""}
                  {t.email ?? "no email on file"}
                </p>
              </div>
            </div>
          }
          headerRight={
            <div className="flex items-center gap-2">
              <StatusMenu
                value={t.conversation_status}
                onChange={(s) => statusMut.mutate(s)}
                pending={statusMut.isPending}
              />
              {sendMut.error && (
                <span className="text-red-400">{(sendMut.error as Error).message}</span>
              )}
            </div>
          }
        />
      </section>

      <ContextPanel
        thread={t}
        admins={admins}
        onAssign={(id) => assignMut.mutate(id)}
        assignPending={assignMut.isPending}
      />
    </>
  );
}

function StatusMenu({
  value,
  onChange,
  pending,
}: {
  value: ConversationStatus;
  onChange: (s: ConversationStatus) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[value]} disabled:opacity-60`}
      >
        <CircleDot className="h-3 w-3" />
        {STATUS_LABEL[value]}
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>
      {open && (
        <div
          className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-lg border border-border/60 bg-popover shadow-xl"
          onMouseLeave={() => setOpen(false)}
        >
          {CONVERSATION_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                setOpen(false);
                onChange(s.value);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-accent/50 ${
                s.value === value ? "bg-accent/30" : ""
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  s.tone === "amber"
                    ? "bg-amber-400"
                    : s.tone === "violet"
                    ? "bg-violet-400"
                    : s.tone === "sky"
                    ? "bg-sky-400"
                    : "bg-emerald-400"
                }`}
              />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ContextPanel({
  thread,
  admins,
  onAssign,
  assignPending,
}: {
  thread: ThreadContext;
  admins: AssignableAdmin[];
  onAssign: (id: string | null) => void;
  assignPending: boolean;
}) {
  return (
    <aside className="flex h-[calc(100vh-14rem)] min-h-[560px] flex-col gap-4 overflow-y-auto rounded-2xl border border-border/60 bg-card/60 p-5 shadow-elegant backdrop-blur">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" /> Client
        </div>
        <p className="mt-1 text-lg font-semibold">{thread.company_name}</p>
        {thread.contact_person && (
          <p className="text-sm text-muted-foreground">{thread.contact_person}</p>
        )}
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          {thread.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> {thread.email}
            </div>
          )}
          {thread.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> {thread.phone}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-background/40 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Assignee
        </p>
        <select
          value={thread.assignee_id ?? ""}
          onChange={(e) => onAssign(e.target.value || null)}
          disabled={assignPending}
          className="mt-2 w-full rounded-lg border border-border/60 bg-background/70 px-2.5 py-1.5 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
        >
          <option value="">— Unassigned —</option>
          {admins.map((a) => (
            <option key={a.id} value={a.id}>
              {a.email}
            </option>
          ))}
        </select>
        {thread.assignee_name && (
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Owned by <span className="text-foreground">{thread.assignee_name}</span>
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border/40 bg-background/40 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Project
        </p>
        <dl className="mt-2 space-y-1.5 text-xs">
          <ContextRow icon={CircleDot} label="Onboarding" value={thread.status.replace(/_/g, " ")} />
          <ContextRow icon={UserRound} label="PM" value={thread.project_manager ?? "—"} />
          <ContextRow icon={Package} label="Package" value={thread.package_selected ?? "—"} />
          <ContextRow icon={Wrench} label="Maintenance" value={thread.maintenance_plan ?? "—"} />
          <ContextRow
            icon={Calendar}
            label="Launch"
            value={
              thread.target_launch_date
                ? new Date(thread.target_launch_date).toLocaleDateString()
                : "—"
            }
          />
        </dl>
      </div>

      <div className="rounded-xl border border-border/40 bg-background/40 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Last response
        </p>
        <dl className="mt-2 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">From client</span>
            <span className="font-medium">{fmtRelative(thread.last_client_at)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">From team</span>
            <span className="font-medium">{fmtRelative(thread.last_admin_at)}</span>
          </div>
        </dl>
      </div>

      <Link
        to="/admin/onboarding/$id"
        params={{ id: thread.onboarding_id }}
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Open full onboarding record
      </Link>
    </aside>
  );
}

function ContextRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <span className="max-w-[60%] truncate text-right font-medium capitalize">{value}</span>
    </div>
  );
}
