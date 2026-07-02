import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset Password" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase recovery flow sets a session from the URL hash automatically.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut();
      navigate({ to: "/shivi-login", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#111118] p-8 shadow-2xl">
        <h1 className="text-xl font-semibold tracking-tight text-white">Set a new password</h1>
        <p className="mt-1 text-xs text-white/50">
          {ready ? "Enter your new password below." : "Verifying reset link…"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70">New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!ready}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/30 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70">Confirm password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={!ready}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/30 disabled:opacity-50"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || !ready}
            className="w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
