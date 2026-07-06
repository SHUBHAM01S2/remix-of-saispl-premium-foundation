import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShieldAlert, LogOut, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export type WrongRoleMode = "client-on-admin" | "admin-on-client";

/**
 * Premium-styled full-screen notice shown when a signed-in user visits a
 * route intended for the other role (client hits /admin, or admin hits
 * /shivi). Explains the correct entry point and signs them out on request
 * so they can re-authenticate through the right flow.
 */
export function WrongRoleNotice({
  mode,
  email,
}: {
  mode: WrongRoleMode;
  email?: string | null;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const copy =
    mode === "client-on-admin"
      ? {
          eyebrow: "Restricted area",
          title: "This dashboard is for admins only",
          body:
            "You're signed in as a client. The admin panel is limited to SAISPL staff accounts. Head back to your client portal to review onboarding, share assets, and track your project.",
          primaryTo: "/client-portal" as const,
          primaryLabel: "Go to client portal",
          secondaryHint:
            "If you believe you should have admin access, contact your SAISPL account owner.",
        }
      : {
          eyebrow: "Restricted area",
          title: "This private sign-in is for admins",
          body:
            "You're signed in as a client account, so the /shivi console won't let you continue. Please sign in with the public Sign In button — it opens the client portal.",
          primaryTo: "/client-portal" as const,
          primaryLabel: "Open client portal",
          secondaryHint:
            "Admins: sign out below and sign back in with your admin credentials.",
        };

  const handleSignOutAndGo = async (to: "/client-portal" | "/") => {
    try {
      setBusy(true);
      await supabase.auth.signOut();
    } finally {
      setBusy(false);
      navigate({ to, replace: true });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0f] px-4 py-16 text-white">
      <div className="mx-auto flex max-w-lg flex-col items-start">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-amber-300">
          <ShieldAlert className="h-3.5 w-3.5" />
          {copy.eyebrow}
        </span>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
          {copy.body}
        </p>

        {email && (
          <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50">
            Signed in as{" "}
            <span className="font-medium text-white/80">{email}</span>
          </p>
        )}

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            to={copy.primaryTo}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            {copy.primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() =>
              handleSignOutAndGo(
                mode === "admin-on-client" ? "/client-portal" : "/",
              )
            }
            disabled={busy}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/25 hover:text-white disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Sign out
          </button>
        </div>

        <p className="mt-6 text-xs text-white/40">{copy.secondaryHint}</p>
      </div>
    </div>
  );
}
