import { createFileRoute, Link, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Users, TrendingUp, User as UserIcon, LogOut, Loader2, Sparkles,
  ArrowUpRight, ArrowDownRight, BadgeDollarSign, CheckCircle2, Handshake, XCircle,
  Eye, EyeOff, Bell, Menu, X, Copy, Check, Trophy, Target, HelpCircle,
  Wallet, CalendarClock, Rocket, Clock, Award,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyPartnerProfile, getMyStats, listMyReferrals } from "@/lib/partners.functions";
import { fmtDate, fmtMoney, StatusChip } from "@/lib/partners-ui";

export const Route = createFileRoute("/partner")({
  ssr: false,
  component: PartnerShell,
  head: () => ({
    meta: [
      { title: "Partner Dashboard — SAISPL" },
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

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  "/partner": { title: "Partner Performance", sub: "Track referrals, deals and payouts in one place." },
  "/partner/referrals": { title: "My Referrals", sub: "Every client you have referred to SAISPL." },
  "/partner/earnings": { title: "Earnings & Payouts", sub: "What you've earned and what's on the way." },
  "/partner/profile": { title: "Profile & Payouts", sub: "Keep this current so payouts reach you." },
};

function PartnerShell() {
  const location = useLocation();
  const router = useRouter();
  const [session, setSession] = useState<{ email?: string } | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

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
      <div className="min-h-screen bg-[#0a0f1a] text-slate-100 grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-slate-100 grid place-items-center px-4 py-8 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(20,184,166,0.15),transparent_70%)]" />
        <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/20">
              <Handshake className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold truncate">SAISPL Partner Portal</h1>
              <p className="text-xs text-slate-400">Sign in to manage your referrals</p>
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
              <label className="text-xs text-slate-400">Email</label>
              <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2.5 text-base sm:text-sm outline-none focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Password</label>
              <div className="relative mt-1">
                <input required type={showPw ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2.5 pr-11 text-base sm:text-sm outline-none focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20" />
                <button type="button" onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-100">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {err && <p className="text-sm text-rose-400">{err}</p>}
            <button disabled={busy}
              className="w-full rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold py-2.5 hover:brightness-110 disabled:opacity-50 transition">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-5 text-xs text-slate-400 text-center">
            Not a partner yet? <Link to="/affiliate-enquiry" className="text-teal-300 hover:underline">Apply to the affiliate program</Link>
          </p>
        </div>
      </div>
    );
  }

  if (profileQ.isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-slate-100 grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!profileQ.data) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-slate-100 grid place-items-center px-4">
        <div className="max-w-md w-full text-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-500/15 text-amber-300 grid place-items-center">
            <XCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold">Not registered as a sales partner</h2>
          <p className="mt-2 text-sm text-slate-400">
            Your account <span className="text-slate-100">{session.email}</span> is signed in but has no partner profile yet.
            Ask an admin to add you, or apply to the affiliate program.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Link to="/affiliate-enquiry" className="rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-4 py-2 text-sm">Apply as affiliate</Link>
            <button onClick={async () => { await supabase.auth.signOut(); router.invalidate(); }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  const partner = profileQ.data;
  const path = location.pathname.replace(/\/$/, "") || "/partner";
  const header = PAGE_TITLES[path] ?? PAGE_TITLES[Object.keys(PAGE_TITLES).find((k) => path.startsWith(k)) ?? "/partner"] ?? PAGE_TITLES["/partner"];
  const initials = (partner.full_name ?? partner.email ?? "P").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-100">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(70%_60%_at_20%_0%,rgba(20,184,166,0.10),transparent_60%),radial-gradient(60%_50%_at_80%_10%,rgba(56,189,248,0.08),transparent_60%)]" />

      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-white/5 bg-[#0b1220]/80 backdrop-blur-xl lg:flex lg:flex-col">
        <SidebarInner partner={partner} path={path} onNav={() => {}} onSignOut={async () => { await supabase.auth.signOut(); router.invalidate(); }} />
      </aside>

      {/* Sidebar (mobile drawer) */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileNav(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] max-w-[85%] border-r border-white/5 bg-[#0b1220] flex flex-col">
            <SidebarInner partner={partner} path={path} onNav={() => setMobileNav(false)} onSignOut={async () => { await supabase.auth.signOut(); router.invalidate(); }} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[248px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0a0f1a]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-16">
            <button onClick={() => setMobileNav(true)} className="lg:hidden p-2 -ml-2 text-slate-300 hover:text-white" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-semibold truncate">{header.title}</h1>
              <p className="hidden sm:block text-xs text-slate-400 truncate">{header.sub}</p>
            </div>
            <Link to="/partner/referrals/new"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-4 py-2 text-sm shadow-lg shadow-teal-500/20 hover:brightness-110 transition">
              <Sparkles className="h-4 w-4" /> New referral
            </Link>
            <button className="relative p-2 rounded-lg border border-white/5 text-slate-300 hover:text-white hover:bg-white/5" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-teal-400" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-white/5">
              <div className="hidden md:block text-right">
                <p className="text-xs font-medium leading-tight truncate max-w-[140px]">{partner.full_name ?? "Partner"}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{partner.company ?? partner.email}</p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 text-xs font-bold shadow shadow-teal-500/20">
                {initials}
              </span>
            </div>
          </div>
          {/* Mobile primary CTA */}
          <div className="sm:hidden px-4 pb-3">
            <Link to="/partner/referrals/new"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-4 py-2.5 text-sm">
              <Sparkles className="h-4 w-4" /> New referral
            </Link>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-[1280px]">
            {path === "/partner" ? <PartnerHome partner={partner} /> : <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarInner({ partner, path, onNav, onSignOut }: { partner: any; path: string; onNav: () => void; onSignOut: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 shadow shadow-teal-500/20">
            <Handshake className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">SAISPL</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Partner Portal</p>
          </div>
        </div>
        <button className="lg:hidden text-slate-400 hover:text-white" onClick={onNav} aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest text-slate-500">Workspace</p>
        {NAV.map((item) => {
          const active = item.end ? path === item.to : path === item.to || path.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} onClick={onNav}
              className={`group relative mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-gradient-to-r from-teal-500/15 to-cyan-500/5 text-white ring-1 ring-teal-400/25"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}>
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r bg-teal-400" />}
              <Icon className={`h-4 w-4 ${active ? "text-teal-300" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/5 p-3 space-y-2">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Award className="h-3.5 w-3.5 text-teal-300" /> Partner tier
          </div>
          <p className="mt-1 text-sm font-semibold">{partner.company ? "Verified Partner" : "Getting Started"}</p>
        </div>
        <button onClick={onSignOut}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </>
  );
}

/* ============================ Dashboard Home ============================ */

function KpiCard({
  label, value, icon: Icon, tint, trend, hint,
}: { label: string; value: string | number; icon: any; tint: string; trend?: { dir: "up" | "down"; value: string }; hint?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/10 hover:bg-white/[0.035] transition">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(80%_60%_at_100%_0%,rgba(20,184,166,0.08),transparent_60%)]" />
      <div className="relative flex items-center justify-between">
        <p className="text-xs text-slate-400">{label}</p>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${tint}`}><Icon className="h-4 w-4" /></span>
      </div>
      <p className="relative mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <div className="relative mt-2 flex items-center gap-2 text-xs">
        {trend && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${
            trend.dir === "up" ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"
          }`}>
            {trend.dir === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
        {hint && <span className="text-slate-500">{hint}</span>}
      </div>
    </div>
  );
}

function PartnerHome({ partner }: { partner: any }) {
  const statsFn = useServerFn(getMyStats);
  const listFn = useServerFn(listMyReferrals);
  const statsQ = useQuery({ queryKey: ["partner", "stats"], queryFn: () => statsFn() });
  const listQ = useQuery({ queryKey: ["partner", "referrals"], queryFn: () => listFn() });

  const s = statsQ.data;
  const list = listQ.data ?? [];
  const recent = list.slice(0, 5);
  const [copied, setCopied] = useState(false);

  const referralLink = useMemo(() => {
    const code = partner.referral_code ?? partner.id ?? "";
    if (typeof window === "undefined") return `https://shivaryaninfotech.com/?ref=${code}`;
    return `${window.location.origin}/?ref=${code}`;
  }, [partner]);

  const goal = 10;
  const wonCount = s?.won ?? 0;
  const goalPct = Math.min(100, Math.round((wonCount / goal) * 100));

  const bestReferral = useMemo(() => {
    return [...list].sort((a, b) => Number(b.deal_value ?? 0) - Number(a.deal_value ?? 0))[0];
  }, [list]);

  const nextPayout = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1, 5);
    return d;
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 sm:p-6">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-5 justify-between">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-teal-300/80">Welcome back</p>
            <h2 className="mt-1 text-xl sm:text-2xl font-semibold">
              Hi {partner.full_name?.split(" ")[0] ?? "Partner"} 👋
            </h2>
            <p className="mt-1 text-sm text-slate-400 max-w-lg">
              Here's how your referrals are performing. Share your link, close deals, get paid — it's that simple.
            </p>
          </div>
          <div className="w-full md:w-auto md:min-w-[360px]">
            <label className="text-[11px] uppercase tracking-widest text-slate-400">Your referral link</label>
            <div className="mt-2 flex items-stretch gap-2 rounded-xl border border-white/10 bg-slate-950/40 p-1.5">
              <input readOnly value={referralLink}
                className="flex-1 min-w-0 bg-transparent px-2 text-xs sm:text-sm text-slate-200 outline-none" />
              <button onClick={() => { navigator.clipboard?.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-3 py-1.5 text-xs">
                {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total leads"     value={s?.total ?? 0}     icon={Users}           tint="bg-teal-500/15 text-teal-300"       trend={{ dir: "up",   value: "+12%" }} hint="vs last month" />
        <KpiCard label="Active"          value={s?.active ?? 0}    icon={Rocket}          tint="bg-violet-500/15 text-violet-300"   trend={{ dir: "up",   value: "+3" }}   hint="in pipeline" />
        <KpiCard label="Pending"         value={s?.pending ?? 0}   icon={Clock}           tint="bg-amber-500/15 text-amber-300"     hint="awaiting first contact" />
        <KpiCard label="Won"             value={s?.won ?? 0}       icon={CheckCircle2}    tint="bg-emerald-500/15 text-emerald-300" trend={{ dir: "up",   value: "+2" }}   hint="this quarter" />
        <KpiCard label="Lost"            value={s?.lost ?? 0}      icon={XCircle}         tint="bg-rose-500/15 text-rose-300"       hint="closed lost" />
        <KpiCard label="Conversion"      value={(s?.conversionRate ?? 0) + "%"} icon={ArrowUpRight} tint="bg-cyan-500/15 text-cyan-300" hint="leads → won" />
      </div>

      {/* Money row */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <KpiCard label="Deal value"        value={fmtMoney(s?.dealValue)}       icon={BadgeDollarSign} tint="bg-amber-500/15 text-amber-300"   hint="pipeline + closed" />
        <KpiCard label="Total commission"  value={fmtMoney(s?.commissionTotal)} icon={Wallet}          tint="bg-emerald-500/15 text-emerald-300" hint="lifetime earned" />
        <KpiCard label="Pending payout"    value={fmtMoney(s?.pendingPayout)}   icon={CalendarClock}   tint="bg-violet-500/15 text-violet-300" hint={`Next payout ~ ${fmtDate(nextPayout.toISOString())}`} />
      </div>

      {/* Snapshot + Payout + Goal */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Performance snapshot</h3>
              <p className="text-xs text-slate-400">A quick read on your last 30 days.</p>
            </div>
            <Link to="/partner/referrals" className="text-xs text-teal-300 hover:underline">View all →</Link>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <SnapshotBar label="Won"      value={s?.won ?? 0}      total={Math.max(s?.total ?? 1, 1)} className="from-emerald-400 to-emerald-500" />
            <SnapshotBar label="Active"   value={s?.active ?? 0}   total={Math.max(s?.total ?? 1, 1)} className="from-teal-400 to-cyan-500" />
            <SnapshotBar label="Pending"  value={s?.pending ?? 0}  total={Math.max(s?.total ?? 1, 1)} className="from-amber-400 to-amber-500" />
          </div>

          <div className="mt-6 border-t border-white/5 pt-4 grid gap-3 sm:grid-cols-2">
            <InfoRow icon={Trophy}   label="Best-performing referral" value={bestReferral ? `${bestReferral.client_name} • ${fmtMoney(bestReferral.deal_value)}` : "No wins yet"} />
            <InfoRow icon={Target}   label="Deals to next tier"       value={`${Math.max(0, goal - wonCount)} more wins`} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/5 bg-gradient-to-br from-teal-500/10 via-white/[0.02] to-white/[0.01] p-5">
          <div className="flex items-center gap-2 text-xs text-teal-300">
            <Target className="h-3.5 w-3.5" /> Quarterly goal
          </div>
          <p className="mt-2 text-3xl font-semibold">{wonCount}<span className="text-slate-500 text-lg font-normal"> / {goal}</span></p>
          <p className="text-xs text-slate-400">deals closed this quarter</p>
          <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all" style={{ width: `${goalPct}%` }} />
          </div>
          <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/40 p-3">
            <div className="flex items-center gap-2 text-xs text-slate-400"><CalendarClock className="h-3.5 w-3.5" /> Next payout</div>
            <p className="mt-1 text-sm font-medium">{fmtDate(nextPayout.toISOString())}</p>
            <p className="text-xs text-slate-500">Approved commissions are paid on the 5th of each month.</p>
          </div>
        </section>
      </div>

      {/* Recent referrals table */}
      <section className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h3 className="text-sm font-semibold">Recent referrals</h3>
            <p className="text-xs text-slate-400">Your five latest submissions.</p>
          </div>
          <Link to="/partner/referrals" className="text-xs text-teal-300 hover:underline">View all →</Link>
        </div>
        {listQ.isLoading ? (
          <div className="p-10 text-center text-slate-400 text-sm"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading your referrals…</div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={Rocket}
            title="Add your first referral"
            body="Introduce us to a business you know. We'll take it from there and you earn on every win."
            cta={{ to: "/partner/referrals/new", label: "Submit a referral" }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="text-left text-xs text-slate-400 bg-white/[0.02]">
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
                  <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                    <td className="px-5 py-3">
                      <Link to="/partner/referrals/$id" params={{ id: r.id }} className="hover:text-teal-300">
                        <div className="font-medium">{r.client_name}</div>
                        <div className="text-xs text-slate-500">{r.company ?? "—"}</div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{r.service_interested ?? "—"}</td>
                    <td className="px-5 py-3"><StatusChip status={r.status} /></td>
                    <td className="px-5 py-3 font-medium">{fmtMoney(r.deal_value)}</td>
                    <td className="px-5 py-3 text-slate-400">{fmtDate(r.referral_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Info tiles */}
      <div className="grid gap-4 md:grid-cols-3">
        <InfoTile
          icon={HelpCircle}
          title="How referrals work"
          body="Submit a lead → we qualify & pitch → deal closes → you earn commission on the invoiced value."
        />
        <InfoTile
          icon={BadgeDollarSign}
          title="Commission policy"
          body="Standard 10–15% on first-year contract value. Recurring deals earn recurring commissions."
        />
        <InfoTile
          icon={CalendarClock}
          title="Payout schedule"
          body="Approved commissions are paid on the 5th of every month via your chosen method."
        />
      </div>
    </div>
  );
}

function SnapshotBar({ label, value, total, className }: { label: string; value: number; total: number; className: string }) {
  const pct = Math.min(100, Math.round((value / total) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${className}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-[10px] text-slate-500">{pct}% of total</p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-500/10 text-teal-300"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/10 transition">
      <span className="inline-grid h-9 w-9 place-items-center rounded-lg bg-teal-500/10 text-teal-300"><Icon className="h-4 w-4" /></span>
      <h4 className="mt-3 text-sm font-semibold">{title}</h4>
      <p className="mt-1 text-xs text-slate-400 leading-relaxed">{body}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, body, cta }: { icon: any; title: string; body: string; cta?: { to: string; label: string } }) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 text-teal-300 ring-1 ring-teal-400/20">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="mt-4 text-base font-semibold">{title}</h4>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-400">{body}</p>
      {cta && (
        <Link to={cta.to} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-4 py-2 text-sm shadow-lg shadow-teal-500/20">
          <Sparkles className="h-4 w-4" /> {cta.label}
        </Link>
      )}
    </div>
  );
}
