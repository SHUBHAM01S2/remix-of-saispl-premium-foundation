import { createFileRoute, Link, Outlet, useLocation, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { BadgeDollarSign, Users, TrendingUp, LayoutDashboard, Wallet, Trophy } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { adminOverview } from "@/lib/partners.functions";
import { fmtMoney } from "@/lib/partners-ui";

export const Route = createFileRoute("/_authenticated/admin/affiliates")({
  beforeLoad: async () => {
    const r = await checkIsAdmin();
    if (!r.isAdmin) throw notFound();
    return { admin: r.admin };
  },
  component: AffiliatesShell,
  head: () => ({
    meta: [
      { title: "Affiliates — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const TABS = [
  { to: "/admin/affiliates", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/affiliates/partners", label: "Sales Partners", icon: Users },
  { to: "/admin/affiliates/referrals", label: "All Referrals", icon: TrendingUp },
  { to: "/admin/affiliates/payouts", label: "Payouts", icon: Wallet },
];

function AffiliatesShell() {
  const location = useLocation();
  const path = location.pathname.replace(/\/$/, "");
  const isIndex = path === "/admin/affiliates";

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-brand/80">Affiliate program</p>
        <h1 className="mt-1 text-2xl font-semibold">Referral management</h1>
        <p className="text-sm text-muted-foreground">All partners, referrals, and payouts in one place.</p>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
        {TABS.map((t) => {
          const active = t.end ? path === t.to : path === t.to || path.startsWith(t.to + "/");
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm ${active ? "bg-brand/15 text-foreground ring-1 ring-brand/30" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`}>
              <Icon className="h-4 w-4" /> {t.label}
            </Link>
          );
        })}
      </nav>

      {isIndex ? <AffiliatesOverview /> : <Outlet />}
    </div>
  );
}

function AffiliatesOverview() {
  const fn = useServerFn(adminOverview);
  const q = useQuery({ queryKey: ["admin", "affiliates", "overview"], queryFn: () => fn() });
  const d = q.data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <KPI label="Total partners" value={d?.totalPartners ?? "—"} icon={Users} tint="bg-brand/15 text-brand" />
        <KPI label="Active" value={d?.activePartners ?? "—"} icon={Users} tint="bg-emerald-500/15 text-emerald-300" />
        <KPI label="Total referrals" value={d?.totalReferrals ?? "—"} icon={TrendingUp} tint="bg-violet-500/15 text-violet-300" />
        <KPI label="Won this month" value={d?.wonThisMonth ?? "—"} icon={Trophy} tint="bg-amber-500/15 text-amber-300" />
        <KPI label="Deal value" value={fmtMoney(d?.dealValue)} icon={BadgeDollarSign} tint="bg-cyan-500/15 text-cyan-300" />
        <KPI label="Pending payout" value={fmtMoney(d?.pendingPayout)} icon={Wallet} tint="bg-rose-500/15 text-rose-300" />
      </div>

      <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur overflow-hidden">
        <div className="p-5 border-b border-border/60 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Top partners</h2>
          <Link to="/admin/affiliates/partners" className="text-xs text-brand hover:underline">View all →</Link>
        </div>
        {!d || d.leaderboard.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No partners with referrals yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Partner</th>
                <th className="px-5 py-3 font-medium">Won deals</th>
                <th className="px-5 py-3 font-medium">Total commission</th>
              </tr>
            </thead>
            <tbody>
              {d.leaderboard.map((b) => (
                <tr key={b.partner_id} className="border-t border-border/50">
                  <td className="px-5 py-3">
                    <Link to="/admin/affiliates/partners/$id" params={{ id: b.partner_id }} className="hover:text-brand">
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-muted-foreground">{b.company ?? "—"}</div>
                    </Link>
                  </td>
                  <td className="px-5 py-3">{b.won}</td>
                  <td className="px-5 py-3">{fmtMoney(b.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function KPI({ label, value, icon: Icon, tint }: { label: string; value: any; icon: any; tint: string }) {
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
