import { createFileRoute, useNavigate, useRouter, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/shivi-login")({
  ssr: false,
  component: ShiviLogin,
  head: () => ({
    meta: [
      { title: "Sign In" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function ShiviLogin() {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await router.invalidate();
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setNotice("If that email is registered, a reset link has been sent.");
      setResetOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#111118] p-8 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-white">Sign in</h1>
          <p className="mt-1 text-xs text-white/50">Restricted area</p>
        </div>

        {!resetOpen ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-white/70">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-white/70">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
            {notice && <p className="text-xs text-emerald-400">{notice}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => { setResetOpen(true); setResetEmail(email); setError(null); setNotice(null); }}
              className="block w-full text-center text-xs text-white/50 hover:text-white/80"
            >
              Forgot password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-xs font-medium text-white/70">Email</label>
              <input
                id="reset-email"
                type="email"
                required
                autoComplete="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
              <p className="mt-1.5 text-xs text-white/40">We'll email you a reset link.</p>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {resetLoading ? "Sending…" : "Send reset link"}
            </button>
            <button
              type="button"
              onClick={() => { setResetOpen(false); setError(null); }}
              className="block w-full text-center text-xs text-white/50 hover:text-white/80"
            >
              Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
