import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import type { ChatMessage } from "@/lib/messages.functions";

type Props = {
  messages: ChatMessage[];
  isSending: boolean;
  onSend: (body: string) => void | Promise<void>;
  placeholder?: string;
  emptyHint?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  disabled?: boolean;
  disabledHint?: string;
};

function formatTs(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function ChatThread({
  messages,
  isSending,
  onSend,
  placeholder = "Type a message…",
  emptyHint = "No messages yet — say hello.",
  headerLeft,
  headerRight,
  disabled,
  disabledHint,
}: Props) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const body = draft.trim();
    if (!body || isSending || disabled) return;
    setDraft("");
    await onSend(body);
  };

  return (
    <div className="flex h-[calc(100vh-16rem)] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-elegant backdrop-blur">
      {(headerLeft || headerRight) && (
        <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-background/40 px-5 py-3">
          <div className="min-w-0 flex-1 text-sm">{headerLeft}</div>
          <div className="shrink-0 text-xs text-muted-foreground">{headerRight}</div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.length === 0 && (
          <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
            {emptyHint}
          </div>
        )}
        {messages.map((m, idx) => {
          const prev = messages[idx - 1];
          const showDate =
            !prev || new Date(prev.created_at).toDateString() !== new Date(m.created_at).toDateString();
          return (
            <div key={m.id}>
              {showDate && (
                <div className="my-4 flex items-center justify-center">
                  <span className="rounded-full bg-muted/50 px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              <MessageBubble msg={m} />
            </div>
          );
        })}
      </div>

      <form onSubmit={submit} className="border-t border-border/60 bg-background/40 p-3 sm:p-4">
        {disabled ? (
          <p className="px-2 py-3 text-center text-xs text-muted-foreground">{disabledHint}</p>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) submit();
              }}
              rows={1}
              placeholder={placeholder}
              maxLength={4000}
              className="max-h-40 min-h-[44px] flex-1 resize-none rounded-xl border border-border/60 bg-background/70 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60 focus:ring-2 focus:ring-brand/30"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isSending}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-elegant transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const mine = msg.is_mine;
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] flex-col ${mine ? "items-end" : "items-start"}`}>
        <div
          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
            mine
              ? "rounded-br-md bg-brand text-brand-foreground"
              : "rounded-bl-md border border-border/60 bg-muted/40 text-foreground"
          }`}
        >
          {msg.body}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          {!mine && msg.sender_name && <span className="font-medium">{msg.sender_name}</span>}
          <span>{formatTs(msg.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
