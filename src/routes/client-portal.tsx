import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  FileUp,
  Paperclip,
  KeyRound,
  Link as LinkIcon,
  LogIn,
  LogOut,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  getMyOnboarding,
  signClientAssetUrl,
  STATUS_LABELS,
  submitClientAccess,
  submitClientAsset,
  type ClientOnboardingView,
} from "@/lib/client-portal.functions";
import {
  ACCESS_KEYS,
  ASSET_KEYS,
  ONBOARDING_STATUSES,
  type OnboardingStatus,
} from "@/lib/onboarding-admin.functions";
import {
  getMyThread,
  getMyThreadSummary,
  markMyMessagesRead,
  sendMyMessage,
  signMessageAttachmentDownload,
  type ClientNotification,
} from "@/lib/messages.functions";
import { ChatThread } from "@/components/ChatThread";

export const Route = createFileRoute("/client-portal")({
  ssr: false,
  component: ClientPortalPage,
  head: () => ({
    meta: [
      { title: "Client Portal — SAISPL" },
      {
        name: "description",
        content:
          "Sign in to the SAISPL client portal to review onboarding progress, share assets and access, and track your project status.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const ASSET_LABELS: Record<(typeof ASSET_KEYS)[number], string> = {
  logo: "Logo",
  brand_kit: "Brand kit",
  website_content: "Website content",
  images: "Images / photography",
  domain: "Domain",
  hosting_details: "Hosting details",
  social_links: "Social links",
  legal_pages: "Legal pages (privacy, terms)",
};

const ACCESS_LABELS: Record<(typeof ACCESS_KEYS)[number], string> = {
  domain_access: "Domain registrar access",
  hosting_vps: "Hosting / VPS access",
  business_email: "Business email access",
  google_analytics: "Google Analytics",
  search_console: "Search Console",
  meta_access: "Meta (Facebook / Instagram)",
  cal_com: "Cal.com",
  whatsapp_api: "WhatsApp API",
  crm_access: "CRM access",
};

const STATUS_STYLES: Record<OnboardingStatus, string> = {
  pending: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  waiting_on_client: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  in_review: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  kickoff_ready: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  active_project: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

function ClientPortalPage() {
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [rejectMessage, setRejectMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const r = await checkIsAdmin().catch(() => ({ isAdmin: false }));
        if (r.isAdmin) {
          await supabase.auth.signOut();
          setRejectMessage(
            "This sign-in is for client accounts only. Admin access uses the private admin sign-in route.",
          );
          setSignedIn(false);
        } else {
          setSignedIn(true);
        }
      }
      setChecking(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") setSignedIn(false);
      if (event === "SIGNED_IN") setSignedIn(true);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <ShellFrame>
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking session…
        </div>
      </ShellFrame>
    );
  }

  if (!signedIn) {
    return <SignInView initialError={rejectMessage} onSignedIn={() => setSignedIn(true)} />;
  }

  return <Dashboard />;
}

/* ------------------------------------------------------------------ */
/* Sign-in                                                             */
/* ------------------------------------------------------------------ */

function SignInView({
  initialError,
  onSignedIn,
}: {
  initialError: string | null;
  onSignedIn: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await router.invalidate();
      const r = await checkIsAdmin().catch(() => ({ isAdmin: false }));
      if (r.isAdmin) {
        await supabase.auth.signOut();
        await router.invalidate();
        setError(
          "This sign-in is for client accounts only. Admin access uses the private admin sign-in route.",
        );
        return;
      }
      onSignedIn();
    } catch (err: any) {
      setError(err?.message ?? "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError("Enter your email above first, then tap reset.");
      return;
    }
    setError(null);
    setNotice(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password?flow=client`,
    });
    if (error) setError(error.message);
    else setNotice("Password reset email sent. Check your inbox.");
  };

  return (
    <ShellFrame>
      <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Client Portal
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Your project,{" "}
            <span className="bg-gradient-to-r from-brand to-emerald-400 bg-clip-text text-transparent">
              one place.
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            Sign in to view onboarding progress, upload missing assets, share
            platform access, and track your project status with our delivery team.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {[
              "Live onboarding checklist & completion state",
              "Secure asset & access submission",
              "Kickoff readiness and launch tracking",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl shadow-black/20 backdrop-blur">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Client sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the credentials shared by your project manager.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition hover:bg-cta/90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Sign in
            </button>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button type="button" onClick={handleReset} className="hover:text-foreground">
                Forgot password?
              </button>
              <Link to="/contact" className="hover:text-foreground">
                Need access?
              </Link>
            </div>
          </form>
        </div>
      </section>
    </ShellFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getFn = useServerFn(getMyOnboarding);
  const summaryFn = useServerFn(getMyThreadSummary);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["client-portal", "me"],
    queryFn: () => getFn(),
  });

  const [tab, setTab] = useState<"overview" | "assets" | "access" | "messages" | "timeline">("overview");

  const summaryQ = useQuery({
    queryKey: ["client-portal", "notif-summary"],
    queryFn: () => summaryFn(),
    // Realtime pushes updates instantly; poll acts as a safety net.
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    enabled: !!data,
  });

  // Supabase Realtime: new admin messages / status changes → instant refresh.
  const onboardingId = summaryQ.data?.onboarding_id ?? null;
  useEffect(() => {
    if (!onboardingId) return;
    const ch = supabase
      .channel(`client-thread-${onboardingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "client_messages",
          filter: `onboarding_id=eq.${onboardingId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ["client-portal", "notif-summary"] });
          qc.invalidateQueries({ queryKey: ["client-portal", "thread"] });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "client_onboarding",
          filter: `id=eq.${onboardingId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ["client-portal", "notif-summary"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [onboardingId, qc]);

  // Toast when new admin messages arrive (compare against last seen id).
  const lastSeenIdRef = useRef<string | null>(null);
  const bootedRef = useRef(false);
  useEffect(() => {
    const s = summaryQ.data;
    if (!s) return;
    const topId = s.recent_admin[0]?.id ?? null;
    if (!bootedRef.current) {
      bootedRef.current = true;
      lastSeenIdRef.current = topId;
      return;
    }
    if (topId && topId !== lastSeenIdRef.current && s.unread_count > 0) {
      const newOnes: ClientNotification[] = [];
      for (const m of s.recent_admin) {
        if (m.id === lastSeenIdRef.current) break;
        newOnes.push(m);
      }
      const first = newOnes[0];
      if (first && tab !== "messages") {
        const attNote =
          first.attachment_count > 0
            ? ` · 📎 ${first.attachment_count} attachment${first.attachment_count > 1 ? "s" : ""}`
            : "";
        toast.message(`New message from ${first.sender_name ?? "SAISPL Team"}`, {
          description:
            (first.body ? first.body.slice(0, 140) : "New update on your project") + attNote,
          action: {
            label: "Open",
            onClick: () => setTab("messages"),
          },
        });
      }
      lastSeenIdRef.current = topId;
    }
  }, [summaryQ.data, tab]);

  // Clear unread badge cache the moment user opens Messages tab —
  // getMyThread server-side will mark read, then refetch summary.
  useEffect(() => {
    if (tab === "messages") {
      const t = setTimeout(() => {
        qc.invalidateQueries({ queryKey: ["client-portal", "notif-summary"] });
      }, 500);
      return () => clearTimeout(t);
    }
  }, [tab, qc]);

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["client-portal", "me"] });

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/client-portal", replace: true });
  };

  if (isLoading) {
    return (
      <ShellFrame>
        <div className="flex flex-1 items-center justify-center py-24 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading your project…
        </div>
      </ShellFrame>
    );
  }

  if (error) {
    return (
      <ShellFrame>
        <div className="mx-auto mt-20 max-w-lg rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
          <p className="font-semibold">Couldn't load your dashboard</p>
          <p className="mt-2 text-red-200/80">{(error as Error).message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs hover:bg-red-500/20"
          >
            Try again
          </button>
        </div>
      </ShellFrame>
    );
  }

  if (!data) return <NotLinkedYet onSignOut={handleSignOut} />;

  const row = data;
  const unread = summaryQ.data?.unread_count ?? 0;
  const recent = summaryQ.data?.recent_admin ?? [];
  const convStatus = summaryQ.data?.conversation_status ?? null;

  const markAllReadFn = useServerFn(markMyMessagesRead);
  const markAllRead = async () => {
    try {
      await markAllReadFn();
      await qc.invalidateQueries({ queryKey: ["client-portal", "notif-summary"] });
      await qc.invalidateQueries({ queryKey: ["client-portal", "thread"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Couldn't mark messages as read");
    }
  };

  return (
    <ShellFrame
      signedIn
      onSignOut={handleSignOut}
      bell={
        <NotificationBell
          unread={unread}
          recent={recent}
          onOpenMessages={() => setTab("messages")}
          onMarkAllRead={markAllRead}
        />
      }
    >
      <div className="pb-16 pt-8">
        <ProjectHeader row={row} />

        <nav className="mt-8 flex flex-wrap gap-2 border-b border-border/60">
          {[
            { key: "overview", label: "Overview" },
            { key: "assets", label: "Assets" },
            { key: "access", label: "Access" },
            { key: "messages", label: "Messages" },
            { key: "timeline", label: "Timeline" },
          ].map((t) => {
            const isMsg = t.key === "messages";
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as any)}
                className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "border-brand text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                {isMsg && unread > 0 && (
                  <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold leading-none text-brand-foreground shadow-[0_0_0_2px_var(--background)]">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-8">
          {tab === "overview" && <OverviewTab row={row} onJump={setTab} />}
          {tab === "assets" && <AssetsTab row={row} onChanged={invalidate} />}
          {tab === "access" && <AccessTab row={row} onChanged={invalidate} />}
          {tab === "messages" && (
            <MessagesTab row={row} unread={unread} convStatus={convStatus} />
          )}
          {tab === "timeline" && <TimelineTab row={row} />}
        </div>
      </div>
    </ShellFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Layout / header                                                     */
/* ------------------------------------------------------------------ */

function ShellFrame({
  children,
  signedIn,
  onSignOut,
  bell,
}: {
  children: React.ReactNode;
  signedIn?: boolean;
  onSignOut?: () => void;
  bell?: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--brand)_18%,transparent),transparent_70%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold tracking-wide text-foreground">
            SAISPL
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              ← Back to site
            </Link>
            {bell}
            {signedIn && onSignOut && (
              <button
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            )}
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}

function NotificationBell({
  unread,
  recent,
  onOpenMessages,
  onMarkAllRead,
}: {
  unread: number;
  recent: ClientNotification[];
  onOpenMessages: () => void;
  onMarkAllRead: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const downloadFn = useServerFn(signMessageAttachmentDownload);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("[data-notif-root]")) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const openAttachment = async (path: string) => {
    try {
      const { url } = await downloadFn({ data: { path } });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      toast.error(e?.message ?? "Couldn't open attachment");
    }
  };

  const handleMarkAll = async () => {
    setBusy(true);
    try {
      await onMarkAllRead();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative" data-notif-root>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition hover:text-foreground"
        aria-label={unread > 0 ? `${unread} new messages` : "Notifications"}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <>
            <span className="absolute -right-1 -top-1 inline-flex min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-brand-foreground shadow-[0_0_0_2px_var(--background)]">
              {unread > 9 ? "9+" : unread}
            </span>
            <span className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-brand/50" />
          </>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-40 w-[340px] overflow-hidden rounded-xl border border-border/60 bg-card/95 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Notifications</p>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {unread > 0 ? `${unread} new` : "All caught up"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={busy || unread === 0}
              className="text-[11px] font-medium text-brand transition hover:text-brand/80 disabled:cursor-not-allowed disabled:text-muted-foreground/60"
            >
              {busy ? "Marking…" : "Mark all as read"}
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">
                No messages from the SAISPL team yet.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {recent.map((m, i) => {
                  const isUnread = i < unread;
                  return (
                    <li key={m.id}>
                      <div
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                          isUnread ? "bg-brand/[0.06]" : ""
                        }`}
                      >
                        <span
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                            isUnread ? "bg-brand" : "bg-transparent"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => {
                              setOpen(false);
                              onOpenMessages();
                            }}
                            className="block w-full text-left hover:opacity-90"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-xs font-medium">
                                {m.sender_name ?? "SAISPL Team"}
                              </p>
                              <span className="shrink-0 text-[10px] text-muted-foreground">
                                {relTime(m.created_at)}
                              </span>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              {m.body ||
                                (m.has_attachments ? "Sent you an attachment" : "New update")}
                            </p>
                          </button>
                          {m.attachments && m.attachments.length > 0 && (
                            <ul className="mt-1.5 space-y-1">
                              {m.attachments.map((a) => (
                                <li key={a.path}>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openAttachment(a.path);
                                    }}
                                    className="inline-flex max-w-full items-center gap-1 truncate rounded-md border border-border/60 bg-background/60 px-1.5 py-0.5 text-[10px] text-brand hover:bg-brand/10"
                                    title={a.name}
                                  >
                                    <Paperclip className="h-3 w-3 shrink-0" />
                                    <span className="truncate">{a.name}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <button
            onClick={() => {
              setOpen(false);
              onOpenMessages();
            }}
            className="flex w-full items-center justify-center gap-1 border-t border-border/60 bg-background/40 px-4 py-2.5 text-xs font-medium text-brand hover:bg-brand/10"
          >
            Open messages <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}


function ProjectHeader({ row }: { row: ClientOnboardingView }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-brand" /> Client dashboard
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {row.company_name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {row.package_selected ?? "Custom engagement"}
            {row.project_type ? ` · ${row.project_type}` : ""}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[row.status]}`}
        >
          {STATUS_LABELS[row.status]}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Onboarding progress</span>
          <span className="font-medium text-foreground">
            {row.progress.pct}% · {row.progress.done}/{row.progress.total} items
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full bg-gradient-to-r from-brand to-emerald-400 transition-all"
            style={{ width: `${row.progress.pct}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetaCard icon={User} label="Project manager" value={row.project_manager ?? "To be assigned"} />
        <MetaCard
          icon={Clock}
          label="Target launch"
          value={row.target_launch_date ? new Date(row.target_launch_date).toLocaleDateString() : "TBD"}
        />
        <MetaCard icon={ShieldCheck} label="Maintenance plan" value={row.maintenance_plan ?? "—"} />
        <MetaCard icon={Mail} label="Account email" value={row.email ?? "—"} />
      </div>
    </div>
  );
}

function MetaCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

function OverviewTab({
  row,
  onJump,
}: {
  row: ClientOnboardingView;
  onJump: (t: "assets" | "access" | "messages" | "timeline") => void;
}) {
  const currentIdx = ONBOARDING_STATUSES.findIndex((s) => s.value === row.status);
  const pendingAssets = ASSET_KEYS.filter((k) => !row.assets?.[k]);
  const pendingAccess = ACCESS_KEYS.filter((k) => !row.access?.[k]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card
          title="Where you are"
          subtitle="Your onboarding journey with the SAISPL delivery team"
        >
          <ol className="grid gap-3 sm:grid-cols-5">
            {ONBOARDING_STATUSES.map((s, i) => {
              const reached = i <= currentIdx;
              const current = i === currentIdx;
              return (
                <li
                  key={s.value}
                  className={`rounded-lg border p-3 text-xs ${
                    current
                      ? "border-brand/50 bg-brand/10 text-foreground"
                      : reached
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-200"
                        : "border-border/60 bg-background text-muted-foreground"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-1">
                    {reached ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                    <span className="text-[10px] uppercase tracking-wider">Step {i + 1}</span>
                  </div>
                  <p className="font-medium">{s.label}</p>
                </li>
              );
            })}
          </ol>
        </Card>

        <Card
          title="What we still need from you"
          subtitle="These items are pending — submit them from the Assets & Access tabs."
        >
          {pendingAssets.length === 0 && pendingAccess.length === 0 ? (
            <p className="text-sm text-emerald-300">
              All caught up. Nothing pending from your side right now. 🎉
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryList
                label="Assets pending"
                empty="All assets received"
                items={pendingAssets.map((k) => ASSET_LABELS[k])}
                onOpen={() => onJump("assets")}
              />
              <SummaryList
                label="Access pending"
                empty="All access received"
                items={pendingAccess.map((k) => ACCESS_LABELS[k])}
                onOpen={() => onJump("access")}
              />
            </div>
          )}
        </Card>

        {row.project_goals && (
          <Card title="Project goals">
            <p className="whitespace-pre-line text-sm text-muted-foreground">{row.project_goals}</p>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card title="Recent activity">
          {row.timeline.length === 0 ? (
            <p className="text-xs text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {[...row.timeline]
                .reverse()
                .slice(0, 5)
                .map((e, i) => (
                  <li key={i} className="text-xs">
                    <p className="text-foreground">{e.message}</p>
                    <p className="mt-0.5 text-muted-foreground">{new Date(e.ts).toLocaleString()}</p>
                  </li>
                ))}
            </ul>
          )}
          <button
            onClick={() => onJump("timeline")}
            className="mt-4 inline-flex items-center gap-1 text-xs text-brand hover:underline"
          >
            View full timeline <ArrowRight className="h-3 w-3" />
          </button>
        </Card>

        <Card title="Need help?">
          <p className="text-xs text-muted-foreground">
            Your project manager{row.project_manager ? ` (${row.project_manager})` : ""} is your single
            point of contact. Reach out any time.
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/25"
            >
              <Phone className="h-3.5 w-3.5" /> WhatsApp our team
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-xs hover:bg-surface"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Contact form
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryList({
  label,
  empty,
  items,
  onOpen,
}: {
  label: string;
  empty: string;
  items: string[];
  onOpen: () => void;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-emerald-300">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-1.5 text-sm">
          {items.slice(0, 6).map((i) => (
            <li key={i} className="flex items-center gap-2 text-foreground">
              <Circle className="h-3 w-3 shrink-0 text-amber-300" /> {i}
            </li>
          ))}
          {items.length > 6 && (
            <li className="text-xs text-muted-foreground">+{items.length - 6} more…</li>
          )}
        </ul>
      )}
      <button
        onClick={onOpen}
        className="mt-3 inline-flex items-center gap-1 text-xs text-brand hover:underline"
      >
        Open <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */

function AssetsTab({ row, onChanged }: { row: ClientOnboardingView; onChanged: () => void }) {
  return (
    <Card
      title="Submit assets"
      subtitle="Upload files, share URLs (e.g. Google Drive), or drop a quick note. Each submission is delivered securely to your project manager."
    >
      <div className="space-y-4">
        {ASSET_KEYS.map((key) => (
          <AssetItem
            key={key}
            keyName={key}
            label={ASSET_LABELS[key]}
            done={!!row.assets?.[key]}
            submissions={row.submissions.assets[key] ?? []}
            onChanged={onChanged}
          />
        ))}
      </div>
    </Card>
  );
}

function AssetItem({
  keyName,
  label,
  done,
  submissions,
  onChanged,
}: {
  keyName: string;
  label: string;
  done: boolean;
  submissions: import("@/lib/client-portal.functions").AssetSubmission[];
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"file" | "link" | "note">("file");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAssetFn = useServerFn(submitClientAsset);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "file") {
        if (!file) throw new Error("Choose a file first");
        const { data: userRes } = await supabase.auth.getUser();
        const uid = userRes.user?.id;
        if (!uid) throw new Error("Session expired");
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
        const path = `${uid}/${keyName}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("client-onboarding-assets")
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        await submitAssetFn({ data: { key: keyName, kind: "file", name: file.name, path } });
      } else if (mode === "link") {
        if (!/^https?:\/\//i.test(url)) throw new Error("Enter a valid URL starting with http(s)://");
        await submitAssetFn({ data: { key: keyName, kind: "link", url } });
      } else {
        if (!note.trim()) throw new Error("Enter a note");
        await submitAssetFn({ data: { key: keyName, kind: "note", note } });
      }
      setUrl("");
      setNote("");
      setFile(null);
      setOpen(false);
      onChanged();
    } catch (err: any) {
      setError(err?.message ?? "Submission failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`rounded-xl border p-4 ${
        done ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/60 bg-background/40"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {done ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <Circle className="h-4 w-4 text-amber-300" />
          )}
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">
              {submissions.length === 0
                ? "Not submitted yet"
                : `${submissions.length} submission${submissions.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs hover:bg-surface"
        >
          {open ? "Close" : done ? "Add more" : "Submit"}
        </button>
      </div>

      {submissions.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3 text-xs">
          {submissions.map((s, i) => (
            <SubmissionRow key={i} sub={s} />
          ))}
        </ul>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-border/60 pt-4">
          <div className="flex flex-wrap gap-2 text-xs">
            {(["file", "link", "note"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 capitalize ${
                  mode === m
                    ? "border-brand bg-brand/15 text-foreground"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "file" ? (
                  <FileUp className="h-3 w-3" />
                ) : m === "link" ? (
                  <LinkIcon className="h-3 w-3" />
                ) : (
                  <MessageSquare className="h-3 w-3" />
                )}
                {m}
              </button>
            ))}
          </div>

          {mode === "file" && (
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-brand-foreground hover:file:bg-brand/90"
            />
          )}
          {mode === "link" && (
            <input
              type="url"
              placeholder="https://drive.google.com/…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />
          )}
          {mode === "note" && (
            <textarea
              rows={3}
              placeholder="Anything the team should know…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />
          )}

          {error && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-cta px-3 py-2 text-xs font-semibold text-cta-foreground hover:bg-cta/90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

function SubmissionRow({ sub }: { sub: import("@/lib/client-portal.functions").AssetSubmission }) {
  const [signed, setSigned] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const signFn = useServerFn(signClientAssetUrl);

  const openFile = async () => {
    if (!sub.path) return;
    setLoading(true);
    try {
      const r = await signFn({ data: { path: sub.path } });
      setSigned(r.url);
      window.open(r.url, "_blank", "noopener");
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="flex items-center justify-between gap-3 text-muted-foreground">
      <span className="truncate">
        {sub.kind === "file" && (sub.name ?? sub.path)}
        {sub.kind === "link" && sub.url}
        {sub.kind === "note" && sub.note}
      </span>
      <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
        <span>{new Date(sub.submitted_at).toLocaleDateString()}</span>
        {sub.kind === "file" && sub.path && (
          <button
            onClick={openFile}
            disabled={loading}
            className="inline-flex items-center gap-1 text-brand hover:underline"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ExternalLink className="h-3 w-3" />}
            {signed ? "Reopen" : "Open"}
          </button>
        )}
        {sub.kind === "link" && sub.url && (
          <a
            href={sub.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-brand hover:underline"
          >
            <ExternalLink className="h-3 w-3" /> Open
          </a>
        )}
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Access                                                              */
/* ------------------------------------------------------------------ */

function AccessTab({ row, onChanged }: { row: ClientOnboardingView; onChanged: () => void }) {
  return (
    <Card
      title="Submit access credentials"
      subtitle="Only your project manager can see these details. For maximum safety, prefer inviting our team to your platforms rather than sharing passwords."
    >
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-brand/30 bg-brand/5 p-4 text-xs text-brand">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Submissions are stored securely and only visible to the SAISPL delivery team. Whenever
          possible, share invite links or delegated access instead of raw passwords.
        </p>
      </div>
      <div className="space-y-4">
        {ACCESS_KEYS.map((key) => (
          <AccessItem
            key={key}
            keyName={key}
            label={ACCESS_LABELS[key]}
            done={!!row.access?.[key]}
            submissions={row.submissions.access[key] ?? []}
            onChanged={onChanged}
          />
        ))}
      </div>
    </Card>
  );
}

function AccessItem({
  keyName,
  label,
  done,
  submissions,
  onChanged,
}: {
  keyName: string;
  label: string;
  done: boolean;
  submissions: import("@/lib/client-portal.functions").AccessSubmission[];
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const submitFn = useServerFn(submitClientAccess);
  const mut = useMutation({
    mutationFn: (v: string) => submitFn({ data: { key: keyName, value: v } }),
    onSuccess: () => {
      setValue("");
      setOpen(false);
      onChanged();
    },
  });

  return (
    <div
      className={`rounded-xl border p-4 ${
        done ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/60 bg-background/40"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {done ? (
            <KeyRound className="h-4 w-4 text-emerald-400" />
          ) : (
            <KeyRound className="h-4 w-4 text-amber-300" />
          )}
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">
              {submissions.length === 0
                ? "Not submitted yet"
                : `${submissions.length} submission${submissions.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs hover:bg-surface"
        >
          {open ? "Close" : done ? "Update" : "Submit"}
        </button>
      </div>

      {submissions.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          {submissions.map((s, i) => (
            <li key={i} className="flex items-center justify-between">
              <span>Received — encrypted note stored securely</span>
              <span>{new Date(s.submitted_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) mut.mutate(value);
          }}
          className="mt-4 space-y-3 border-t border-border/60 pt-4"
        >
          <textarea
            rows={3}
            placeholder={`Invite link, delegated access details, or credentials for ${label}…`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
          />
          {mut.error && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {(mut.error as Error).message}
            </p>
          )}
          <button
            type="submit"
            disabled={mut.isPending || !value.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-cta px-3 py-2 text-xs font-semibold text-cta-foreground hover:bg-cta/90 disabled:opacity-60"
          >
            {mut.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Submit securely
          </button>
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

function TimelineTab({ row }: { row: ClientOnboardingView }) {
  return (
    <Card title="Project timeline" subtitle="Every status change and submission, in order.">
      {row.timeline.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here yet.</p>
      ) : (
        <ol className="relative border-l border-border/60 pl-6">
          {[...row.timeline].reverse().map((e, i) => (
            <li key={i} className="mb-5 last:mb-0">
              <span
                className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border ${
                  e.kind === "status"
                    ? "bg-brand border-brand"
                    : e.kind === "created"
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-background border-border"
                }`}
              >
                {(e.kind === "status" || e.kind === "created") && (
                  <CheckCircle2 className="h-3 w-3 text-brand-foreground" />
                )}
              </span>
              <p className="text-sm font-medium text-foreground">{e.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(e.ts).toLocaleString()}
                <span className="ml-2 inline-flex items-center rounded-full border border-border/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                  {e.kind}
                </span>
              </p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Common                                                              */
/* ------------------------------------------------------------------ */

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
      <header className="mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function NotLinkedYet({ onSignOut }: { onSignOut: () => void }) {
  return (
    <ShellFrame signedIn onSignOut={onSignOut}>
      <div className="mx-auto mt-24 max-w-lg rounded-2xl border border-border/60 bg-card/80 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Your project isn't linked yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in, but we couldn't find a project record for your email. Your project
          manager will link your account shortly — please reach out if this doesn't resolve within a
          business day.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
          >
            Contact the team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </ShellFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Messages                                                             */
/* ------------------------------------------------------------------ */

function MessagesTab({
  row,
  unread,
  convStatus,
}: {
  row: ClientOnboardingView;
  unread: number;
  convStatus: import("@/lib/messages.functions").ConversationStatus | null;
}) {
  const qc = useQueryClient();
  const getThreadFn = useServerFn(getMyThread);
  const sendFn = useServerFn(sendMyMessage);

  const q = useQuery({
    queryKey: ["client-portal", "thread"],
    queryFn: () => getThreadFn(),
    refetchInterval: 4000,
    refetchOnWindowFocus: true,
  });

  const mut = useMutation({
    mutationFn: (payload: { body: string; attachments: any[] }) =>
      sendFn({ data: payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client-portal", "thread"] }),
  });

  if (q.isLoading) {
    return (
      <div className="grid h-72 place-items-center text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your conversation…
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

  const messages = q.data?.messages ?? [];
  const pmName = row.project_manager?.trim() || "SAISPL project team";
  const initials = row.company_name.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      {unread > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 px-4 py-2.5 text-xs text-brand">
          <Bell className="h-3.5 w-3.5" />
          <span className="font-medium">
            {unread} new message{unread > 1 ? "s" : ""} from the SAISPL team
          </span>
          <span className="text-brand/70">— they'll be marked as read as you scroll.</span>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-elegant backdrop-blur sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand/30 to-emerald-400/20 text-sm font-semibold text-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {row.company_name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Project chat · {pmName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${STATUS_STYLES[row.status]}`}
          >
            {STATUS_LABELS[row.status]}
          </span>
          <span className="hidden items-center gap-1 sm:inline-flex">
            <ShieldCheck className="h-3 w-3" /> Private &amp; encrypted in transit
          </span>
        </div>
      </div>


      <ChatThread
        messages={messages}
        isSending={mut.isPending}
        onSend={async (payload) => {
          await mut.mutateAsync(payload);
        }}
        placeholder="Message your project manager…"
        emptyHint="No messages yet. Send a note and your project manager will reply here."
        headerLeft={
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-brand" />
            <span className="font-semibold">Conversation with your SAISPL team</span>
          </div>
        }
        headerRight={
          mut.error ? (
            <span className="text-red-400">{(mut.error as Error).message}</span>
          ) : q.isFetching ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> syncing
            </span>
          ) : null
        }
      />

      <p className="px-1 text-[11px] text-muted-foreground">
        Files up to 15 MB · Messages are visible only to you and the SAISPL team assigned to your project.
      </p>
    </div>
  );
}

