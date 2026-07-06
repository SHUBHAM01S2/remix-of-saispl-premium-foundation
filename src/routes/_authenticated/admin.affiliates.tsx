import { createFileRoute, Link, Outlet, useLocation, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeDollarSign,
  Users,
  TrendingUp,
  LayoutDashboard,
  Wallet,
  Trophy,
  Plus,
  ArrowUpRight,
  Activity,
  Handshake,
  Loader2,
  Sparkles,
} from "lucide-react";
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
    <div className="space-y-5">
      {/* Header */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            Affiliate program
          </div>
          <h1 className="mt-1.5 truncate text-xl font-semibold tracking-tight sm:text-2xl">
            Referral operations
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Partners, pipeline, and payouts at a glance.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/admin/affiliates/payouts"
            className="hidden items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted/40 hover:text-foreground sm:inline-flex"
          >
            <Wallet className="h-3.5 w-3.5" /> Payout queue
          </Link>
          <Link
            to="/admin/affiliates/partners"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground shadow-sm shadow-brand/20 transition hover:-translate-y-px hover:shadow-brand/30"
          >
            <Plus className="h-3.5 w-3.5" /> New partner
          </Link>
        </div>
      </header>

      {/* Tabs — segmented pill row */}
      <nav
        className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto rounded-xl border border-border/60 bg-card/40 p-1 backdrop-blur"
        aria-label="Affiliate sections"
      >
        {TABS.map((t) => {
          const active = t.end ? path === t.to : path === t.to || path.startsWith(t.to + "/");
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
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
  const loading = q.isLoading;

  const inactivePartners =
    d ? Math.max(0, (d.totalPartners ?? 0) - (d.activePartners ?? 0)) : 0;

  return (
    <div className="space-y-5">
      {/* KPI strip — 2 → 3 → 6 columns, compact */}
      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
        <KPI
          label="Partners"
          value={loading ? "—" : d?.totalPartners ?? 0}
          hint={loading ? "" : `${d?.activePartners ?? 0} active`}
          icon={Users}
          tint="text-brand"
        />
        <KPI
          label="Active"
          value={loading ? "—" : d?.activePartners ?? 0}
          hint={loading ? "" : `${inactivePartners} inactive`}
          icon={Handshake}
          tint="text-emerald-300"
        />
        <KPI
          label="Referrals"
          value={loading ? "—" : d?.totalReferrals ?? 0}
          hint="All time"
          icon={TrendingUp}
          tint="text-violet-300"
        />
        <KPI
          label="Won this mo."
          value={loading ? "—" : d?.wonThisMonth ?? 0}
          hint="Closed deals"
          icon={Trophy}
          tint="text-amber-300"
        />
        <KPI
          label="Deal value"
          value={loading ? "—" : fmtMoney(d?.dealValue)}
          hint="Pipeline total"
          icon={BadgeDollarSign}
          tint="text-cyan-300"
        />
        <KPI
          label="Pending payout"
          value={loading ? "—" : fmtMoney(d?.pendingPayout)}
          hint="Awaiting release"
          icon={Wallet}
          tint="text-rose-300"
        />
      </section>

      {/* Two-column body */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* Top partners */}
        <Panel
          eyebrow="Leaderboard"
          title="Top partners"
          action={
            <Link
              to="/admin/affiliates/partners"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          }
        >
          {loading ? (
            <PanelLoading />
          ) : !d || d.leaderboard.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No partner activity yet"
              body="Once your partners start closing referrals, top performers will appear here ranked by commission earned."
              cta={{ to: "/admin/affiliates/partners", label: "Invite a partner" }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">#</th>
                    <th className="px-5 py-2.5 font-medium">Partner</th>
                    <th className="px-5 py-2.5 text-right font-medium">Won</th>
                    <th className="px-5 py-2.5 text-right font-medium">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {d.leaderboard.map((b, i) => (
                    <tr
                      key={b.partner_id}
                      className="border-t border-border/40 transition-colors hover:bg-muted/20"
                    >
                      <td className="px-5 py-2.5 text-xs tabular-nums text-muted-foreground">
                        <RankBadge index={i} />
                      </td>
                      <td className="px-5 py-2.5">
                        <Link
                          to="/admin/affiliates/partners/$id"
                          params={{ id: b.partner_id }}
                          className="group flex min-w-0 items-center gap-2.5"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-semibold text-brand ring-1 ring-brand/20">
                            {initials(b.name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium text-foreground group-hover:text-brand">
                              {b.name}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {b.company ?? "—"}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums">{b.won}</td>
                      <td className="px-5 py-2.5 text-right font-medium tabular-nums">
                        {fmtMoney(b.commission)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        {/* Side rail */}
        <div className="space-y-5">
          <Panel eyebrow="Cash" title="Payout snapshot">
            {loading ? (
              <PanelLoading rows={2} />
            ) : (
              <div className="space-y-3 p-5">
                <SummaryRow
                  label="Awaiting release"
                  value={fmtMoney(d?.pendingPayout ?? 0)}
                  accent="text-rose-300"
                />
                <SummaryRow
                  label="Pipeline deal value"
                  value={fmtMoney(d?.dealValue ?? 0)}
                  accent="text-cyan-300"
                />
                <Link
                  to="/admin/affiliates/payouts"
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted/40"
                >
                  <Wallet className="h-3.5 w-3.5" /> Review payout queue
                </Link>
              </div>
            )}
          </Panel>

          <Panel eyebrow="Signals" title="Program health">
            {loading ? (
              <PanelLoading rows={3} />
            ) : (
              <div className="space-y-2.5 p-5 text-sm">
                <HealthRow
                  icon={Users}
                  label="Active partners"
                  value={`${d?.activePartners ?? 0}/${d?.totalPartners ?? 0}`}
                  ok={(d?.activePartners ?? 0) > 0}
                />
                <HealthRow
                  icon={Activity}
                  label="Won deals this month"
                  value={String(d?.wonThisMonth ?? 0)}
                  ok={(d?.wonThisMonth ?? 0) > 0}
                />
                <HealthRow
                  icon={Sparkles}
                  label="Referrals in pipeline"
                  value={String(d?.totalReferrals ?? 0)}
                  ok={(d?.totalReferrals ?? 0) > 0}
                />
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function KPI({
  label,
  value,
  hint,
  icon: Icon,
  tint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: any;
  tint: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/60 px-3.5 py-3 backdrop-blur transition-colors hover:border-border">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <Icon className={`h-3.5 w-3.5 shrink-0 ${tint}`} />
      </div>
      <p className="mt-1.5 truncate text-xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {hint && (
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur">
      <header className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-3">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
              {eyebrow}
            </p>
          )}
          <h2 className="truncate text-sm font-semibold">{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function PanelLoading({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 animate-pulse rounded-lg bg-muted/30"
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: any;
  title: string;
  body: string;
  cta?: { to: string; label: string };
}) {
  return (
    <div className="grid place-items-center gap-3 px-6 py-10 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-background/40 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="max-w-xs">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted/40"
        >
          <Plus className="h-3.5 w-3.5" /> {cta.label}
        </Link>
      )}
    </div>
  );
}

function RankBadge({ index }: { index: number }) {
  const tone =
    index === 0
      ? "bg-amber-400/15 text-amber-300 ring-amber-400/30"
      : index === 1
      ? "bg-zinc-300/10 text-zinc-200 ring-zinc-300/20"
      : index === 2
      ? "bg-orange-500/10 text-orange-300 ring-orange-500/25"
      : "bg-muted/30 text-muted-foreground ring-border/60";
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ring-1 ${tone}`}
    >
      {index + 1}
    </span>
  );
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${accent ?? ""}`}>{value}</span>
    </div>
  );
}

function HealthRow({
  icon: Icon,
  label,
  value,
  ok,
}: {
  icon: any;
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/30 px-3 py-2">
      <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium tabular-nums ${
          ok ? "text-emerald-300" : "text-muted-foreground"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-muted-foreground/50"}`}
        />
        {value}
      </span>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
