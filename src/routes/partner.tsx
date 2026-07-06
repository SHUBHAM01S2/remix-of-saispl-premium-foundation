import { createFileRoute, Link, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, TrendingUp, User as UserIcon, LogOut, Loader2, Sparkles,
  ArrowUpRight, BadgeDollarSign, CheckCircle2, Handshake, XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyPartnerProfile, getMyStats, listMyReferrals } from "@/lib/partners.functions";
import { fmtDate, fmtMoney, StatusChip } from "@/lib/partners-ui";

export const Route = createFileRoute("/partner")({
  ssr: false,
  component: PartnerShell,
  head: () => ({
    meta: [
      { title: "Sales Partner Dashboard — SAISPL" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const NAV = [
  { to: "/partner", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/partner/referrals", label: "My Referrals", icon: Users },
  { to: "/partner/earnings", label: "Earnings", icon: TrendingUp },
  { to: "/partner/profile", label: "Profile", icon: UserIcon },
];

function PartnerShell() {
  const location = useLocation();
  const router = useRouter();
  const [session, setSession] = useState<{ email?: string } | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSession(data.user ? { email: data.user.email ?? "" } : null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s?.user ? { email: s.user.email ?? "" } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const profileFn = useServerFn(getMyPartnerProfile);
  const profileQ = useQuery({
    queryKey: ["partner", "me"],
    queryFn: () => profileFn(),
    enabled: !!session,
  });

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand/60 text-brand-foreground">
              <Handshake className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold">Sales Partner Portal</h1>
              <p className="text-xs text-muted-foreground">Sign in to view your referrals</p>
            </div>
          </div>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr(null); setBusy(true);
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              setBusy(false);
              if (error) setErr(error.message);
            }}
          >
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand" />
            </div>
            {err && <p className="text-sm text-rose-400">{err}</p>}
            <button disabled={busy} className="w-full rounded-lg bg-brand text-brand-foreground font-medium py-2 hover:opacity-90 disabled:opacity-50">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Not a partner yet? <Link to="/affiliate-enquiry" className="text-brand hover:underline">Apply to the affiliate program</Link>
          </p>
        </div>
      </div>
    );
  }

  if (profileQ.isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profileQ.data) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center px-4">
        <div className="max-w-md w-full text-center rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-500/15 text-amber-300 grid place-items-center">
            <XCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold">Not registered as a sales partner</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account <span className="text-foreground">{session.email}</span> is signed in but has no partner profile yet.
            Ask an admin to add you, or apply to the affiliate program.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Link to="/affiliate-enquiry" className="rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium">Apply as affiliate</Link>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.invalidate(); }}
              className="rounded-lg border border-border px-4 py-2 text-sm">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  const partner = profileQ.data;
  const path = location.pathname.replace(/\/$/, "");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur lg:flex">
          <div className="flex items-center gap-3 border-b border-border/60 px-5 py-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand/60 text-brand-foreground shadow-lg shadow-brand/20">
              <Handshake className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">Partner Portal</p>
              <p className="text-[11px] text-muted-foreground">{partner.company ?? partner.full_name}</p>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            {NAV.map((item) => {
              const active = item.end ? path === item.to : path === item.to || path.startsWith(item.to + "/");
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to}
                  className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? "bg-brand/15 text-foreground ring-1 ring-brand/30" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border/60 p-3">
            <button
              onClick={async () => { await supabase.auth.signOut(); router.invalidate(); }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {path === "/partner" ? <PartnerHome /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tint }: { label: string; value: string | number; icon: any; tint: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${tint}`}><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function PartnerHome() {
  const statsFn = useServerFn(getMyStats);
  const listFn = useServerFn(listMyReferrals);
  const statsQ = useQuery({ queryKey: ["partner", "stats"], queryFn: () => statsFn() });
  const listQ = useQuery({ queryKey: ["partner", "referrals"], queryFn: () => listFn() });

  const s = statsQ.data;
  const recent = (listQ.data ?? []).slice(0, 5);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand/80">Partner overview</p>
          <h1 className="mt-1 text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your referrals, deals, and payouts.</p>
        </div>
        <Link to="/partner/referrals/new" className="inline-flex items-center gap-2 rounded-xl bg-brand text-brand-foreground px-4 py-2 text-sm font-medium hover:opacity-90">
          <Sparkles className="h-4 w-4" /> New referral
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total leads"    value={s?.total ?? "—"}          icon={Users}          tint="bg-brand/15 text-brand" />
        <StatCard label="Active"         value={s?.active ?? "—"}         icon={TrendingUp}     tint="bg-violet-500/15 text-violet-300" />
        <StatCard label="Pending"        value={s?.pending ?? "—"}        icon={LayoutDashboard} tint="bg-amber-500/15 text-amber-300" />
        <StatCard label="Won"            value={s?.won ?? "—"}            icon={CheckCircle2}   tint="bg-emerald-500/15 text-emerald-300" />
        <StatCard label="Lost"           value={s?.lost ?? "—"}           icon={XCircle}        tint="bg-rose-500/15 text-rose-300" />
        <StatCard label="Conversion"     value={(s?.conversionRate ?? 0) + "%"} icon={ArrowUpRight} tint="bg-cyan-500/15 text-cyan-300" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Deal value"     value={fmtMoney(s?.dealValue)}     icon={BadgeDollarSign} tint="bg-amber-500/15 text-amber-300" />
        <StatCard label="Total commission" value={fmtMoney(s?.commissionTotal)} icon={BadgeDollarSign} tint="bg-emerald-500/15 text-emerald-300" />
        <StatCard label="Pending payout" value={fmtMoney(s?.pendingPayout)} icon={BadgeDollarSign} tint="bg-violet-500/15 text-violet-300" />
      </div>

      <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur">
        <div className="flex items-center justify-between p-5 border-b border-border/60">
          <h2 className="text-sm font-semibold">Recent referrals</h2>
          <Link to="/partner/referrals" className="text-xs text-brand hover:underline">View all →</Link>
        </div>
        {listQ.isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No referrals yet. <Link to="/partner/referrals/new" className="text-brand hover:underline">Add your first</Link>.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Deal value</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-t border-border/50 hover:bg-muted/20">
                  <td className="px-5 py-3">
                    <Link to="/partner/referrals/$id" params={{ id: r.id }} className="hover:text-brand">
                      <div className="font-medium">{r.client_name}</div>
                      <div className="text-xs text-muted-foreground">{r.company ?? "—"}</div>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{r.service_interested ?? "—"}</td>
                  <td className="px-5 py-3"><StatusChip status={r.status} /></td>
                  <td className="px-5 py-3">{fmtMoney(r.deal_value)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{fmtDate(r.referral_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
