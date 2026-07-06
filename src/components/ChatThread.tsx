import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Paperclip, X, FileText, Download, Lock, EyeOff } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import type { ChatAttachment, ChatMessage } from "@/lib/messages.functions";
import {
  signMessageAttachmentDownload,
  signMessageAttachmentUpload,
} from "@/lib/messages.functions";

type SendPayload = { body: string; attachments: ChatAttachment[]; is_internal?: boolean };

type Props = {
  messages: ChatMessage[];
  isSending: boolean;
  onSend: (payload: SendPayload) => void | Promise<void>;
  placeholder?: string;
  emptyHint?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  disabled?: boolean;
  disabledHint?: string;
  /** When true, hides the paperclip button (e.g. anonymous / disabled uploads). */
  allowAttachments?: boolean;
  /** When true, shows an "Internal note" toggle (admin-only). */
  allowInternalNote?: boolean;
  /** Onboarding id needed so admin uploads can be scoped to the correct thread. */
  uploadOnboardingId?: string | null;
};

const MAX_FILES = 6;
const MAX_BYTES = 15 * 1024 * 1024;

function formatTs(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function formatBytes(n: number): string {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
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
  allowAttachments = true,
  allowInternalNote = false,
  uploadOnboardingId = null,
}: Props) {
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<ChatAttachment[]>([]);
  const [isInternal, setIsInternal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const signUpload = useServerFn(signMessageAttachmentUpload);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const body = draft.trim();
    if ((!body && pending.length === 0) || isSending || disabled || uploading) return;
    setDraft("");
    const atts = pending;
    setPending([]);
    const internalFlag = isInternal;
    setIsInternal(false);
    await onSend({ body, attachments: atts, is_internal: internalFlag });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    if (pending.length + files.length > MAX_FILES) {
      setUploadError(`You can attach up to ${MAX_FILES} files per message.`);
      return;
    }
    setUploading(true);
    try {
      const added: ChatAttachment[] = [];
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) {
          throw new Error(`${file.name} is larger than 15 MB.`);
        }
        const signed = await signUpload({
          data: {
            file_name: file.name,
            content_type: file.type,
            onboarding_id: uploadOnboardingId ?? undefined,
          },
        });
        const up = await fetch(signed.signedUrl, {
          method: "PUT",
          headers: file.type ? { "Content-Type": file.type } : undefined,
          body: file,
        });
        if (!up.ok) throw new Error(`Upload failed for ${file.name}`);
        added.push({
          path: signed.path,
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
        });
      }
      setPending((prev) => [...prev, ...added]);
    } catch (err: any) {
      setUploadError(err?.message ?? "Attachment upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePending = (path: string) => {
    setPending((prev) => prev.filter((a) => a.path !== path));
  };

  return (
    <div className="flex h-[calc(100vh-16rem)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-elegant backdrop-blur">
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
            !prev ||
            new Date(prev.created_at).toDateString() !==
              new Date(m.created_at).toDateString();
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
          <>
            {pending.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {pending.map((a) => (
                  <span
                    key={a.path}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/70 px-2.5 py-1 text-xs"
                  >
                    <FileText className="h-3.5 w-3.5 text-brand" />
                    <span className="max-w-[180px] truncate">{a.name}</span>
                    <span className="text-[10px] text-muted-foreground">{formatBytes(a.size)}</span>
                    <button
                      type="button"
                      onClick={() => removePending(a.path)}
                      className="ml-1 rounded-full p-0.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      aria-label={`Remove ${a.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {uploadError && (
              <p className="mb-2 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-[11px] text-red-300">
                {uploadError}
              </p>
            )}
            <div className="flex items-end gap-2">
              {allowAttachments && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || isSending}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border/60 bg-background/70 text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                    title="Attach files"
                    aria-label="Attach files"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Paperclip className="h-4 w-4" />
                    )}
                  </button>
                </>
              )}
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) submit();
                }}
                rows={1}
                placeholder={isInternal ? "Internal note — clients cannot see this…" : placeholder}
                maxLength={4000}
                className={`max-h-40 min-h-[44px] flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 ${
                  isInternal
                    ? "border-amber-400/40 bg-amber-500/5 focus:border-amber-400/60 focus:ring-amber-400/30"
                    : "border-border/60 bg-background/70 focus:border-brand/60 focus:ring-brand/30"
                }`}
              />
              <button
                type="submit"
                disabled={(!draft.trim() && pending.length === 0) || isSending || uploading}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-elegant transition-opacity hover:opacity-90 disabled:opacity-40 ${
                  isInternal
                    ? "bg-amber-500 text-black"
                    : "bg-brand text-brand-foreground"
                }`}
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isInternal ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isInternal ? "Save note" : "Send"}
              </button>
            </div>
            {allowInternalNote && (
              <div className="mt-2 flex items-center justify-between px-1">
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border/60 bg-background text-amber-500 focus:ring-amber-400/40"
                  />
                  <EyeOff className="h-3.5 w-3.5" />
                  Internal note — team-only, not shown to client
                </label>
                {isInternal && (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300">
                    Internal
                  </span>
                )}
              </div>
            )}
          </>
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
          className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
            mine
              ? "rounded-br-md bg-brand text-brand-foreground"
              : "rounded-bl-md border border-border/60 bg-muted/40 text-foreground"
          }`}
        >
          {msg.body && (
            <div className="whitespace-pre-wrap break-words">{msg.body}</div>
          )}
          {msg.attachments.length > 0 && (
            <div className={`${msg.body ? "mt-2" : ""} flex flex-col gap-1.5`}>
              {msg.attachments.map((a) => (
                <AttachmentChip key={a.path} attachment={a} mine={mine} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          {!mine && msg.sender_name && <span className="font-medium">{msg.sender_name}</span>}
          <span>{formatTs(msg.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

function AttachmentChip({
  attachment,
  mine,
}: {
  attachment: ChatAttachment;
  mine: boolean;
}) {
  const signDownload = useServerFn(signMessageAttachmentDownload);
  const [loading, setLoading] = useState(false);

  const open = async () => {
    setLoading(true);
    try {
      const r = await signDownload({ data: { path: attachment.path } });
      window.open(r.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      // swallow — chip stays; user can retry
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={open}
      className={`group inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition ${
        mine
          ? "border-white/20 bg-white/10 text-brand-foreground hover:bg-white/20"
          : "border-border/60 bg-background/60 hover:bg-background"
      }`}
    >
      <FileText className="h-3.5 w-3.5 shrink-0 opacity-80" />
      <span className="max-w-[220px] truncate text-left">{attachment.name}</span>
      <span className="text-[10px] opacity-70">{formatBytes(attachment.size)}</span>
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin opacity-70" />
      ) : (
        <Download className="h-3 w-3 opacity-70 transition group-hover:opacity-100" />
      )}
    </button>
  );
}
