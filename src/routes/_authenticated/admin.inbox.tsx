import { useMemo, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, Loader2, MessageSquare, Search } from "lucide-react";

import { checkIsAdmin } from "@/lib/admin.functions";
import {
  getThreadForAdmin,
  listInboxThreads,
  sendAdminMessage,
  type InboxThread,
} from "@/lib/messages.functions";
import { ChatThread } from "@/components/ChatThread";

export const Route = createFileRoute("/_authenticated/admin/inbox")({
  beforeLoad: async () => {
    const r = await checkIsAdmin();
    if (!r.isAdmin) throw notFound();
    return { admin: r.admin };
  },
  component: AdminInboxPage,
  head: () => ({
    meta: [
      { title: "Client Inbox — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminInboxPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listInboxThreads);
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const threadsQ = useQuery({
    queryKey: ["admin-inbox", "list"],
    queryFn: () => listFn(),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const threads = threadsQ.data ?? [];
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return threads;
    return threads.filter(
      (t) =>
        t.company_name.toLowerCase().includes(term) ||
        (t.email ?? "").toLowerCase().includes(term) ||
        (t.contact_person ?? "").toLowerCase().includes(term) ||
        (t.last_message ?? "").toLowerCase().includes(term),
    );
  }, [threads, q]);

  // Auto-select first thread with unread, else first thread.
  const currentId =
    selected ??
    filtered.find((t) => t.unread_for_admin > 0)?.onboarding_id ??
    filtered[0]?.onboarding_id ??
    null;

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-inbox", "list"] });
    if (currentId) qc.invalidateQueries({ queryKey: ["admin-inbox", "thread", currentId] });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <Inbox className="h-6 w-6 text-brand" /> Client Inbox
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Shared conversation for every client. New client messages appear here in real time.
          </p>
        </div>
        {threadsQ.isFetching && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> syncing…
          </span>
        )}
      </header>

      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Threads list */}
        <aside className="flex h-[calc(100vh-11rem)] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-elegant backdrop-blur">
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
                No client threads found.
              </div>
            )}
            <ul className="divide-y divide-border/40">
              {filtered.map((t) => (
                <ThreadRow
                  key={t.onboarding_id}
                  thread={t}
                  active={t.onboarding_id === currentId}
                  onSelect={() => setSelected(t.onboarding_id)}
                />
              ))}
            </ul>
          </div>
        </aside>

        {/* Conversation */}
        <section>
          {currentId ? (
            <ThreadView key={currentId} onboardingId={currentId} onChange={invalidateAll} />
          ) : (
            <div className="grid h-[calc(100vh-11rem)] min-h-[520px] place-items-center rounded-2xl border border-border/60 bg-card/60 text-sm text-muted-foreground shadow-elegant">
              Select a client to view the conversation.
            </div>
          )}
        </section>
      </div>
    </div>
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
                {new Date(t.last_message_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
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

function ThreadView({
  onboardingId,
  onChange,
}: {
  onboardingId: string;
  onChange: () => void;
}) {
  const qc = useQueryClient();
  const getFn = useServerFn(getThreadForAdmin);
  const sendFn = useServerFn(sendAdminMessage);

  const q = useQuery({
    queryKey: ["admin-inbox", "thread", onboardingId],
    queryFn: () => getFn({ data: { onboarding_id: onboardingId } }),
    refetchInterval: 4000,
    refetchOnWindowFocus: true,
  });

  const mut = useMutation({
    mutationFn: (payload: { body: string; attachments: any[] }) =>
      sendFn({ data: { onboarding_id: onboardingId, ...payload } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inbox", "thread", onboardingId] });
      onChange();
    },
  });

  if (q.isLoading) {
    return (
      <div className="grid h-[calc(100vh-11rem)] min-h-[520px] place-items-center rounded-2xl border border-border/60 bg-card/60 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }
  if (q.error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
        {(q.error as Error).message}
      </div>
    );
  }

  const t = q.data!.thread;
  const messages = q.data!.messages;

  return (
    <ChatThread
      messages={messages}
      isSending={mut.isPending}
      onSend={async (payload) => {
        await mut.mutateAsync(payload);
      }}
      placeholder={`Reply to ${t.contact_person ?? t.company_name}…`}
      emptyHint="No messages yet. Start the conversation."
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
      headerRight={mut.error ? <span className="text-red-400">{(mut.error as Error).message}</span> : null}
    />
  );
}
