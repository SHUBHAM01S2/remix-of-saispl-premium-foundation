import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  FileUp,
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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["client-portal", "me"],
    queryFn: () => getFn(),
  });

  const [tab, setTab] = useState<"overview" | "assets" | "access" | "timeline">("overview");

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

  return (
    <ShellFrame signedIn onSignOut={handleSignOut}>
      <div className="pb-16 pt-8">
        <ProjectHeader row={row} />

        <nav className="mt-8 flex flex-wrap gap-2 border-b border-border/60">
          {[
            { key: "overview", label: "Overview" },
            { key: "assets", label: "Assets" },
            { key: "access", label: "Access" },
            { key: "timeline", label: "Timeline" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "border-brand text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          {tab === "overview" && <OverviewTab row={row} onJump={setTab} />}
          {tab === "assets" && <AssetsTab row={row} onChanged={invalidate} />}
          {tab === "access" && <AccessTab row={row} onChanged={invalidate} />}
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
}: {
  children: React.ReactNode;
  signedIn?: boolean;
  onSignOut?: () => void;
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
  onJump: (t: "assets" | "access" | "timeline") => void;
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

  const mut = useMutation({
    mutationFn: (v: string) => submitFn({ data: { key: keyName, value: v } }),
    onSuccess: () => {
      setValue("");
      setOpen(false);
      onChanged();
    },
  });
  const submitFn = useServerFn(submitClientAccess);

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
