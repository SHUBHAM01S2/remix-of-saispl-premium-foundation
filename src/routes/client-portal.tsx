import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogIn, Lock, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";

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

function ClientPortalPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setSignedIn(true);
        const r = await checkIsAdmin().catch(() => ({ isAdmin: false }));
        if (r.isAdmin) navigate({ to: "/admin", replace: true });
      }
      setChecking(false);
    })();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const r = await checkIsAdmin().catch(() => ({ isAdmin: false }));
      if (r.isAdmin) navigate({ to: "/admin", replace: true });
      else setSignedIn(true);
    } catch (err: any) {
      setError(err?.message ?? "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSignedIn(false);
  };

  const handleReset = async () => {
    if (!email) {
      setError("Enter your email above first, then tap reset.");
      return;
    }
    setError(null);
    setNotice(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setNotice("Password reset email sent. Check your inbox.");
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--brand)_18%,transparent),transparent_70%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold tracking-wide text-foreground">
            SAISPL
          </Link>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to site
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-2">
          {/* Left: pitch */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Client Portal · Preview
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Your project,{" "}
              <span className="bg-gradient-to-r from-brand to-emerald-400 bg-clip-text text-transparent">
                one place.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Sign in to view onboarding progress, upload missing assets,
              share platform access, and track your project status with our
              delivery team.
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

          {/* Right: auth card */}
          <div className="mx-auto w-full max-w-md rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl shadow-black/20 backdrop-blur">
            {checking ? (
              <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking session…
              </div>
            ) : signedIn ? (
              <div>
                <h2 className="text-xl font-semibold">You're signed in</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  The full client portal is launching soon. In the meantime,
                  your delivery manager will share your onboarding updates
                  directly.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
                  >
                    Go to homepage <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Client sign in</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use the credentials shared by your project manager.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Email
                  </label>
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
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Password
                  </label>
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
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  Sign in
                </button>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="hover:text-foreground"
                  >
                    Forgot password?
                  </button>
                  <Link to="/contact" className="hover:text-foreground">
                    Need access?
                  </Link>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
