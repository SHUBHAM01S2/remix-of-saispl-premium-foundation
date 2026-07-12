import { createFileRoute, Link, Outlet, useLocation, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeDollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  LayoutDashboard,
  Wallet,
  Trophy,
  Plus,
  ArrowUpRight,
  Handshake,
  AlertTriangle,
  Clock,
  UserX,
  CheckCircle2,
  BarChart3,
  UserPlus,
  Settings2,
  Sparkles,
} from "lucide-react";

import { checkIsAdmin } from "@/lib/admin.functions";
import { adminOverview, adminListReferrals } from "@/lib/partners.functions";
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
  { to: "/admin/affiliates/partners", label: "Partners", icon: Users },
  { to: "/admin/affiliates/referrals", label: "Referrals", icon: TrendingUp },
  { to: "/admin/affiliates/payouts", label: "Payouts", icon: Wallet },
];

function AffiliatesShell() {
  const location = useLocation();
  const path = location.pathname.replace(/\/$/, "");
  const isIndex = path === "/admin/affiliates";

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_var(--tw-shadow-color)] shadow-cyan-400/60" />
            Operations command center · Live
          </div>
          <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight sm:text-[28px]">
            Affiliate Operations
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Monitor partner performance, referral pipeline, and payout activity from one operational view.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/admin/affiliates/payouts"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 px-3.5 py-2 text-xs font-semibold text-foreground/90 transition hover:border-cyan-400/40 hover:bg-cyan-500/5 hover:text-foreground"
          >
            <Wallet className="h-3.5 w-3.5" /> Payout queue
          </Link>
          <Link
            to="/admin/affiliates/partners"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_10px_28px_-10px_rgba(6,182,212,0.55)] transition hover:from-cyan-300 hover:to-cyan-500"
          >
            <Plus className="h-3.5 w-3.5" /> Add partner
          </Link>
        </div>
      </header>

      {/* Tabs — segmented rail */}
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
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                active
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/70"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${active ? "text-cyan-300" : ""}`} />
              {t.label}
            </Link>
          );
        })}
      </nav>

      {isIndex ? <AffiliatesOverview /> : <Outlet />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

const STALL_DAYS = 14;
const STALL_MS = STALL_DAYS * 24 * 60 * 60 * 1000;
const OPEN_STATUSES = new Set(["new", "contacted", "in_discussion", "onboarding"]);

function AffiliatesOverview() {
  const overviewFn = useServerFn(adminOverview);
  const refsFn = useServerFn(adminListReferrals);

  const q = useQuery({ queryKey: ["admin", "affiliates", "overview"], queryFn: () => overviewFn() });
  const refsQ = useQuery({ queryKey: ["admin", "referrals"], queryFn: () => refsFn() });

  const d = q.data;
  const refs = refsQ.data ?? [];
  const loading = q.isLoading || refsQ.isLoading;

  const inactivePartners = d ? Math.max(0, (d.totalPartners ?? 0) - (d.activePartners ?? 0)) : 0;
  const wonRate = d && d.totalReferrals ? Math.round(((d.wonThisMonth ?? 0) / d.totalReferrals) * 100) : 0;

  const now = Date.now();
  const stalled = refs.filter((r) => {
    if (!OPEN_STATUSES.has(r.status)) return false;
    const ts = new Date((r.last_activity_at as any) ?? r.created_at).getTime();
    return now - ts > STALL_MS;
  });
  const approvedTotal = refs
    .filter((r) => r.payout_status === "approved")
    .reduce((s, r) => s + Number(r.commission_amount ?? 0), 0);
  const paidTotal = refs
    .filter((r) => r.payout_status === "paid")
    .reduce((s, r) => s + Number(r.commission_amount ?? 0), 0);
  const openPipelineValue = refs
    .filter((r) => OPEN_STATUSES.has(r.status))
    .reduce((s, r) => s + Number(r.deal_value ?? 0), 0);

  const activeRate = d && d.totalPartners ? Math.round(((d.activePartners ?? 0) / d.totalPartners) * 100) : 0;
  const openReferrals = refs.filter((r) => OPEN_STATUSES.has(r.status)).length;
  const openRate = d && d.totalReferrals ? Math.round((openReferrals / d.totalReferrals) * 100) : 0;
  const paidCount = refs.filter((r) => r.payout_status === "paid").length;
  const pendingCount = refs.filter((r) => r.payout_status !== "paid" && Number(r.commission_amount ?? 0) > 0).length;
  const payoutReadiness = paidCount + pendingCount > 0
    ? Math.round((paidCount / (paidCount + pendingCount)) * 100)
    : 0;

  const recent = [...refs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const activePartnersWithRefs = new Set(refs.map((r) => r.partner_id)).size;
  const partnersNoActivity = d ? Math.max(0, (d.totalPartners ?? 0) - activePartnersWithRefs) : 0;
  const pendingReview = refs.filter((r) => r.payout_status === "pending").length;

  // Derived health scores (0–100, higher is healthier)
  const stallRate = openReferrals > 0 ? Math.round((stalled.length / openReferrals) * 100) : 0;
  const pipelineHealth = openReferrals === 0
    ? (d?.totalReferrals ? 30 : 0)
    : Math.max(0, 100 - stallRate);
  const activationScore = d?.avgActivationDays == null
    ? 0
    : d.avgActivationDays <= 7
    ? 100
    : d.avgActivationDays <= 14
    ? 75
    : d.avgActivationDays <= 30
    ? 50
    : 25;
  const healthScore = loading
    ? 0
    : Math.round(
        (activeRate +
          pipelineHealth +
          Math.min(100, wonRate * 2) +
          Math.max(0, 100 - stallRate) +
          payoutReadiness +
          activationScore) /
          6,
      );
  const healthLabel =
    healthScore >= 70 ? "Healthy" : healthScore >= 40 ? "Needs attention" : "At risk";


  return (
    <div className="space-y-6">
      {/* Hero action cards: pending payout + pipeline value */}
      <div className="grid gap-4 md:grid-cols-2">
        <HeroCard
          tone="amber"
          eyebrow="Awaiting release"
          label="Pending payout"
          value={loading ? "—" : fmtMoney(d?.pendingPayout ?? 0)}
          hint={`${pendingReview} referral${pendingReview === 1 ? "" : "s"} awaiting review`}
          icon={Wallet}
          cta={{ to: "/admin/affiliates/payouts", label: "Open payout queue" }}
        />
        <HeroCard
          tone="cyan"
          eyebrow="Live pipeline"
          label="Open pipeline value"
          value={loading ? "—" : fmtMoney(openPipelineValue)}
          hint={`${openReferrals} open deal${openReferrals === 1 ? "" : "s"} in motion`}
          icon={TrendingUp}
          cta={{ to: "/admin/affiliates/referrals", label: "Review pipeline" }}
        />
      </div>

      {/* KPI groups */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ClusterCard title="Partner network" hint="Coverage" icon={Users}>
          <KpiTile label="Total" value={loading ? "—" : d?.totalPartners ?? 0} />
          <KpiTile label="Active" value={loading ? "—" : d?.activePartners ?? 0} tone="emerald" />
          <KpiTile
            label="Inactive"
            value={loading ? "—" : inactivePartners}
            tone={inactivePartners > 0 ? "amber" : undefined}
          />
        </ClusterCard>

        <ClusterCard title="Pipeline throughput" hint="Deal flow" icon={TrendingUp}>
          <KpiTile label="Referrals" value={loading ? "—" : d?.totalReferrals ?? 0} />
          <KpiTile label="In pipeline" value={loading ? "—" : openReferrals} tone="cyan" />
          <KpiTile label="Won MTD" value={loading ? "—" : d?.wonThisMonth ?? 0} tone="emerald" />
        </ClusterCard>

        <ClusterCard title="Revenue & payouts" hint="Cash flow" icon={BadgeDollarSign}>
          <KpiTile label="Deal value" value={loading ? "—" : fmtMoney(d?.dealValue ?? 0)} money />
          <KpiTile label="Approved" value={loading ? "—" : fmtMoney(approvedTotal)} tone="cyan" money />
          <KpiTile label="Released" value={loading ? "—" : fmtMoney(paidTotal)} tone="emerald" money />
        </ClusterCard>
      </div>

      {/* Operational Health */}
      <Panel
        eyebrow="Operational Health"
        title="Program status"
        action={
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${healthScore >= 70 ? "bg-emerald-400" : healthScore >= 40 ? "bg-cyan-400" : "bg-amber-400"} animate-pulse`} />
            Overall {loading ? "—" : `${healthScore}%`} · {healthLabel}
          </span>
        }
      >
        <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3">
          <HealthMetric
            icon={Users}
            label="Active partners"
            value={loading ? "—" : `${activeRate}%`}
            supporting={loading ? "—" : `${d?.activePartners ?? 0} active · ${inactivePartners} idle`}
            pct={activeRate}
            status={activeRate >= 60 ? "healthy" : activeRate >= 30 ? "watch" : "critical"}
            warning={!loading && inactivePartners > 0 ? `${inactivePartners} inactive` : null}
            to="/admin/affiliates/partners"
            ctaLabel="Manage partners"
          />
          <HealthMetric
            icon={TrendingUp}
            label="Pipeline health"
            value={loading ? "—" : `${openReferrals}`}
            supporting={loading ? "—" : `${fmtMoney(openPipelineValue)} · ${openRate}% of all referrals`}
            pct={pipelineHealth}
            status={pipelineHealth >= 70 ? "healthy" : pipelineHealth >= 40 ? "watch" : "critical"}
            warning={!loading && stalled.length > 0 ? `${stalled.length} stalled` : null}
            to="/admin/affiliates/referrals"
            ctaLabel="Open pipeline"
          />
          <HealthMetric
            icon={CheckCircle2}
            label="Won this month"
            value={loading ? "—" : `${d?.wonThisMonth ?? 0}`}
            supporting={loading ? "—" : `${wonRate}% win rate all-time`}
            pct={Math.min(100, wonRate * 2)}
            status={wonRate >= 25 ? "healthy" : wonRate >= 10 ? "watch" : "critical"}
            warning={!loading && (d?.wonThisMonth ?? 0) === 0 && (d?.totalReferrals ?? 0) > 0 ? "No wins yet" : null}
            to="/admin/affiliates/referrals"
            ctaLabel="Review closed deals"
          />
          <HealthMetric
            icon={Clock}
            label="Stalled follow-ups"
            value={loading ? "—" : `${stalled.length}`}
            supporting={loading ? "—" : `>${STALL_DAYS}d inactive · ${stallRate}% of open pipeline`}
            pct={100 - stallRate}
            status={stallRate === 0 ? "healthy" : stallRate <= 20 ? "watch" : "critical"}
            warning={!loading && stalled.length > 0 ? "Needs follow-up" : null}
            to="/admin/affiliates/referrals"
            ctaLabel="Chase stalled deals"
          />
          <HealthMetric
            icon={Wallet}
            label="Pending payout load"
            value={loading ? "—" : fmtMoney(d?.pendingPayout ?? 0)}
            supporting={loading ? "—" : `${pendingReview} awaiting review · ${payoutReadiness}% cleared`}
            pct={payoutReadiness}
            status={payoutReadiness >= 70 ? "healthy" : payoutReadiness >= 40 ? "watch" : "critical"}
            warning={!loading && pendingReview >= 5 ? "Backlog building" : null}
            to="/admin/affiliates/payouts"
            ctaLabel="Process payouts"
          />
          <HealthMetric
            icon={Sparkles}
            label="Avg. partner activation"
            value={loading ? "—" : d?.avgActivationDays == null ? "—" : `${d.avgActivationDays}d`}
            supporting={
              loading
                ? "—"
                : d?.avgActivationDays == null
                ? "No activations yet"
                : `${d?.activatedPartners ?? 0} of ${d?.totalPartners ?? 0} activated · ${partnersNoActivity} pending`
            }
            pct={activationScore}
            status={
              d?.avgActivationDays == null
                ? "watch"
                : activationScore >= 70
                ? "healthy"
                : activationScore >= 40
                ? "watch"
                : "critical"
            }
            warning={!loading && partnersNoActivity > 0 ? `${partnersNoActivity} never active` : null}
            to="/admin/affiliates/partners"
            ctaLabel="Onboard partners"
          />
        </div>
      </Panel>


      {/* Two-column: leaderboard + side rail (alerts, recent, snapshot) */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          {/* Leaderboard */}
          <Panel
            eyebrow="Performance intelligence"
            title="Top-performing partners"
            action={
              <Link
                to="/admin/affiliates/partners"
                className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
              >
                View all partners <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
          >
            {loading ? (
              <PanelLoading />
            ) : !d || d.leaderboard.length === 0 ? (
              <LeaderboardEmpty />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <th className="px-5 py-2.5 font-semibold">#</th>
                      <th className="px-5 py-2.5 font-semibold">Partner</th>
                      <th className="px-5 py-2.5 text-right font-semibold">Referrals</th>
                      <th className="px-5 py-2.5 text-right font-semibold">Won</th>
                      <th className="px-5 py-2.5 text-right font-semibold">Deal value</th>
                      <th className="px-5 py-2.5 text-right font-semibold">Commission</th>
                      <th className="px-5 py-2.5 text-right font-semibold w-[92px]">Trend</th>
                      <th className="px-5 py-2.5 font-semibold w-[110px]">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.leaderboard.map((b: any, i: number) => {
                      const top = d.leaderboard[0].commission || 1;
                      const pct = Math.max(4, Math.round((b.commission / top) * 100));
                      return (
                        <tr
                          key={b.partner_id}
                          className="border-t border-border/40 transition-colors hover:bg-muted/20"
                        >
                          <td className="px-5 py-3 text-xs tabular-nums text-muted-foreground">
                            <RankBadge index={i} />
                          </td>
                          <td className="px-5 py-3">
                            <Link
                              to="/admin/affiliates/partners/$id"
                              params={{ id: b.partner_id }}
                              className="group flex min-w-0 items-center gap-2.5"
                            >
                              <PartnerAvatar name={b.name} index={i} />
                              <span className="min-w-0">
                                <span className="block truncate font-medium text-foreground group-hover:text-cyan-200">
                                  {b.name}
                                </span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  {b.company ?? "Independent"}
                                </span>
                              </span>
                            </Link>
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                            {b.referrals ?? 0}
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums">
                            <span className="font-medium text-foreground">{b.won}</span>
                          </td>
                          <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                            {fmtMoney(b.deal_value ?? 0)}
                          </td>
                          <td className="px-5 py-3 text-right font-semibold tabular-nums text-cyan-200">
                            {fmtMoney(b.commission)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <TrendPill pct={b.trendPct ?? null} />
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-[10px] tabular-nums text-muted-foreground">
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>


          {/* Recent referral activity */}
          <Panel
            eyebrow="Activity"
            title="Recent referrals"
            action={
              <Link
                to="/admin/affiliates/referrals"
                className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
              >
                All referrals <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
          >
            {loading ? (
              <PanelLoading rows={3} />
            ) : recent.length === 0 ? (
              <EmptyState
                icon={Handshake}
                title="No referrals yet"
                body="Share onboarding resources with partners so they know how to submit deals, or add the first referral manually to seed the pipeline."
                cta={{ to: "/admin/affiliates/referrals", label: "Add first referral" }}
                secondary={{ to: "/admin/affiliates/partners", label: "Review partners" }}
              />

            ) : (
              <ul className="divide-y divide-border/40">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-500/10 text-[10px] font-semibold text-cyan-200 ring-1 ring-cyan-400/25">
                      {initials(r.partner?.full_name ?? "—")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {r.client_name ?? "Untitled"}
                        </p>
                        <StatusPill status={r.status} />
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {r.partner?.full_name ?? "—"} · {timeAgo(r.created_at)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-cyan-200">
                      {fmtMoney(Number(r.deal_value ?? 0))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Side rail */}
        <div className="space-y-5">
          {/* Needs attention */}
          <Panel eyebrow="Operations" title="Needs attention">
            <div className="space-y-2.5 p-4">
              <AlertRow
                icon={UserX}
                tone={partnersNoActivity > 0 ? "amber" : "neutral"}
                label="Partners with no activity"
                value={loading ? "—" : partnersNoActivity}
                hint="Never submitted a referral"
                to="/admin/affiliates/partners"
              />
              <AlertRow
                icon={Clock}
                tone={stalled.length > 0 ? "amber" : "neutral"}
                label="Stuck referrals"
                value={loading ? "—" : stalled.length}
                hint={`No activity in ${STALL_DAYS}+ days`}
                to="/admin/affiliates/referrals"
              />
              <AlertRow
                icon={AlertTriangle}
                tone={pendingReview > 0 ? "cyan" : "neutral"}
                label="Payouts awaiting review"
                value={loading ? "—" : pendingReview}
                hint="Approve to release funds"
                to="/admin/affiliates/payouts"
              />
              {!loading && partnersNoActivity === 0 && stalled.length === 0 && pendingReview === 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-500/5 px-3 py-2.5 text-xs text-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  All clear — no operational issues.
                </div>
              )}
            </div>
          </Panel>

          {/* Payout snapshot */}
          <Panel eyebrow="Cash flow" title="Payout snapshot">
            {loading ? (
              <PanelLoading rows={3} />
            ) : (
              <div className="space-y-2.5 p-5">
                <PayoutRow tone="amber" label="Pending" value={fmtMoney(d?.pendingPayout ?? 0)} />
                <PayoutRow tone="cyan" label="Approved" value={fmtMoney(approvedTotal)} />
                <PayoutRow tone="emerald" label="Paid" value={fmtMoney(paidTotal)} />
                <Link
                  to="/admin/affiliates/payouts"
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-xs font-medium text-foreground transition hover:border-cyan-400/40 hover:bg-cyan-500/5"
                >
                  <BarChart3 className="h-3.5 w-3.5" /> Open payout workflow
                </Link>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Extra building blocks                                               */
/* ------------------------------------------------------------------ */

function HeroCard({
  tone, eyebrow, label, value, hint, icon: Icon, cta,
}: {
  tone: "amber" | "cyan";
  eyebrow: string;
  label: string;
  value: React.ReactNode;
  hint: string;
  icon: any;
  cta: { to: string; label: string };
}) {
  const styles =
    tone === "amber"
      ? {
          ring: "ring-amber-400/25",
          bg: "from-amber-500/[0.08] via-amber-500/[0.02] to-transparent",
          accent: "text-amber-200",
          dot: "bg-amber-400",
          btn: "border-amber-400/30 text-amber-100 hover:bg-amber-500/10",
          icon: "bg-amber-500/15 text-amber-200 ring-amber-400/30",
        }
      : {
          ring: "ring-cyan-400/25",
          bg: "from-cyan-500/[0.08] via-cyan-500/[0.02] to-transparent",
          accent: "text-cyan-200",
          dot: "bg-cyan-400",
          btn: "border-cyan-400/30 text-cyan-100 hover:bg-cyan-500/10",
          icon: "bg-cyan-500/15 text-cyan-200 ring-cyan-400/30",
        };
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.bg} p-5 ring-1 ${styles.ring}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
            {eyebrow}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{label}</p>
          <p className={`mt-1 text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl ${styles.accent}`}>
            {value}
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${styles.icon}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <Link
        to={cta.to}
        className={`mt-4 inline-flex items-center gap-1.5 rounded-lg border bg-background/20 px-3 py-1.5 text-xs font-semibold transition ${styles.btn}`}
      >
        {cta.label} <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function HealthBar({
  label, pct, caption, tone,
}: {
  label: string;
  pct: number;
  caption: string;
  tone: "emerald" | "cyan" | "amber";
}) {
  const bar =
    tone === "emerald" ? "from-emerald-500 to-teal-400"
    : tone === "amber" ? "from-amber-500 to-orange-400"
    : "from-cyan-500 to-teal-400";
  const txt =
    tone === "emerald" ? "text-emerald-300"
    : tone === "amber" ? "text-amber-300"
    : "text-cyan-200";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className={`text-sm font-semibold tabular-nums ${txt}`}>{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${bar}`}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
      <p className="mt-1.5 truncate text-[10px] uppercase tracking-wider text-muted-foreground">
        {caption}
      </p>
    </div>
  );
}

type HealthStatus = "healthy" | "watch" | "critical";

function HealthMetric({
  icon: Icon,
  label,
  value,
  supporting,
  pct,
  status,
  warning,
  to,
  ctaLabel,
}: {
  icon: any;
  label: string;
  value: string;
  supporting: string;
  pct: number;
  status: HealthStatus;
  warning?: string | null;
  to: string;
  ctaLabel: string;
}) {
  const styles =
    status === "healthy"
      ? {
          chipBg: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/25",
          bar: "from-emerald-500 to-teal-400",
          icon: "bg-emerald-500/10 text-emerald-200 ring-emerald-400/25",
          rail: "ring-emerald-400/15",
          chipLabel: "Healthy",
          dot: "bg-emerald-400",
        }
      : status === "watch"
      ? {
          chipBg: "bg-cyan-500/10 text-cyan-200 ring-cyan-400/25",
          bar: "from-cyan-500 to-sky-400",
          icon: "bg-cyan-500/10 text-cyan-200 ring-cyan-400/25",
          rail: "ring-cyan-400/15",
          chipLabel: "Watch",
          dot: "bg-cyan-400",
        }
      : {
          chipBg: "bg-amber-500/10 text-amber-200 ring-amber-400/30",
          bar: "from-amber-500 to-orange-400",
          icon: "bg-amber-500/10 text-amber-200 ring-amber-400/30",
          rail: "ring-amber-400/15",
          chipLabel: "At risk",
          dot: "bg-amber-400",
        };

  const clamped = Math.min(100, Math.max(0, pct));

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/40 p-4 ring-1 ${styles.rail} transition hover:border-border/70 hover:bg-background/60`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`grid h-8 w-8 place-items-center rounded-lg ring-1 ${styles.icon}`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${styles.chipBg}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
          {styles.chipLabel}
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          {value}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground tabular-nums">
          {clamped}%
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${styles.bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      <p className="min-h-[16px] truncate text-[11px] text-muted-foreground">
        {supporting}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/40 pt-3">
        {warning ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200 ring-1 ring-amber-400/25">
            <AlertTriangle className="h-3 w-3" /> {warning}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/[0.08] px-2 py-0.5 text-[10px] font-semibold text-emerald-300/90 ring-1 ring-emerald-400/20">
            <CheckCircle2 className="h-3 w-3" /> On track
          </span>
        )}
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-300 transition hover:text-cyan-200"
        >
          {ctaLabel} <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}


function AlertRow({
  icon: Icon, tone, label, value, hint, to,
}: {
  icon: any;
  tone: "amber" | "cyan" | "neutral";
  label: string;
  value: React.ReactNode;
  hint: string;
  to: string;
}) {
  const active = tone !== "neutral";
  const iconCls =
    tone === "amber" ? "text-amber-300 bg-amber-500/10 ring-amber-400/25"
    : tone === "cyan" ? "text-cyan-300 bg-cyan-500/10 ring-cyan-400/25"
    : "text-muted-foreground bg-muted/30 ring-border/60";
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/30 px-3 py-2.5 transition hover:border-cyan-400/40 hover:bg-cyan-500/5"
    >
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ${iconCls}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-xs font-medium text-foreground">{label}</p>
          <p className={`text-sm font-semibold tabular-nums ${active ? "text-foreground" : "text-muted-foreground"}`}>
            {value}
          </p>
        </div>
        <p className="truncate text-[10px] text-muted-foreground">{hint}</p>
      </div>
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-cyan-500/10 text-cyan-200 ring-cyan-400/25",
    contacted: "bg-cyan-500/10 text-cyan-200 ring-cyan-400/25",
    in_discussion: "bg-blue-500/10 text-blue-200 ring-blue-400/25",
    onboarding: "bg-violet-500/10 text-violet-200 ring-violet-400/25",
    won: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/25",
    lost: "bg-rose-500/10 text-rose-300 ring-rose-400/25",
  };
  const cls = map[status] ?? "bg-muted/30 text-muted-foreground ring-border/60";
  return (
    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  const mo = Math.floor(days / 30);
  return `${mo}mo ago`;
}

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function ClusterCard({
  title, hint, icon: Icon, children,
}: {
  title: string; hint: string; icon: any; children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card/70 to-card/40 backdrop-blur">
      <header className="flex items-center justify-between gap-3 border-b border-border/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20">
            <Icon className="h-3 w-3" />
          </span>
          <div>
            <p className="text-[11px] font-semibold tracking-tight">{title}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{hint}</p>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-3 divide-x divide-border/40">{children}</div>
    </section>
  );
}

function KpiTile({
  label, value, tone, money,
}: {
  label: string;
  value: React.ReactNode;
  tone?: "emerald" | "amber" | "cyan" | "rose";
  money?: boolean;
}) {
  const toneCls =
    tone === "emerald" ? "text-emerald-300"
    : tone === "amber" ? "text-amber-300"
    : tone === "cyan" ? "text-cyan-200"
    : tone === "rose" ? "text-rose-300"
    : "text-foreground";
  return (
    <div className="px-4 py-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className={`mt-1.5 truncate ${money ? "text-lg" : "text-xl"} font-semibold tabular-nums tracking-tight ${toneCls}`}>
        {value}
      </p>
    </div>
  );
}

function SignalCard({
  tone, icon: Icon, label, value, hint, cta,
}: {
  tone: "amber" | "cyan" | "neutral";
  icon: any;
  label: string;
  value: React.ReactNode;
  hint: string;
  cta?: { to: string; label: string };
}) {
  const ring =
    tone === "amber" ? "ring-amber-400/25 bg-amber-500/[0.03]"
    : tone === "cyan" ? "ring-cyan-400/25 bg-cyan-500/[0.03]"
    : "ring-border/60 bg-card/40";
  const iconCls =
    tone === "amber" ? "text-amber-300 bg-amber-500/10 ring-amber-400/25"
    : tone === "cyan" ? "text-cyan-300 bg-cyan-500/10 ring-cyan-400/25"
    : "text-muted-foreground bg-muted/30 ring-border/60";
  return (
    <div className={`flex items-center gap-3 rounded-xl p-4 ring-1 ${ring}`}>
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ${iconCls}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate text-lg font-semibold tabular-nums tracking-tight">{value}</p>
        <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="shrink-0 rounded-lg border border-border/60 bg-background/40 px-2.5 py-1.5 text-[11px] font-medium text-foreground transition hover:border-cyan-400/40 hover:text-cyan-200"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

function Panel({
  eyebrow, title, action, children,
}: {
  eyebrow?: string; title: string; action?: React.ReactNode; children: React.ReactNode;
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
  icon: Icon, title, body, cta, secondary,
}: {
  icon: any;
  title: string;
  body: string;
  cta?: { to: string; label: string };
  secondary?: { to: string; label: string };
}) {
  return (
    <div className="relative overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.10),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-sm place-items-center gap-3 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-teal-500/10 text-cyan-200 ring-1 ring-cyan-400/25 shadow-[0_8px_24px_-10px_rgba(34,211,238,0.45)]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
        </div>
        {(cta || secondary) && (
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            {cta && (
              <Link
                to={cta.to}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_6px_18px_-6px_rgba(34,211,238,0.55)] transition hover:brightness-110"
              >
                <Plus className="h-3.5 w-3.5" /> {cta.label}
              </Link>
            )}
            {secondary && (
              <Link
                to={secondary.to}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:border-cyan-400/40 hover:text-cyan-200"
              >
                {secondary.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
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
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ring-1 ${tone}`}>
      {index + 1}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function PayoutRow({
  tone, label, value,
}: {
  tone: "amber" | "cyan" | "emerald";
  label: string;
  value: string;
}) {
  const dot =
    tone === "amber" ? "bg-amber-400"
    : tone === "cyan" ? "bg-cyan-400"
    : "bg-emerald-400";
  const text =
    tone === "amber" ? "text-amber-300"
    : tone === "cyan" ? "text-cyan-200"
    : "text-emerald-300";
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/30 px-3 py-2">
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </span>
      <span className={`text-sm font-semibold tabular-nums ${text}`}>{value}</span>
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

const AVATAR_TONES = [
  "bg-gradient-to-br from-amber-400/25 to-amber-500/10 text-amber-200 ring-amber-400/30",
  "bg-gradient-to-br from-cyan-400/25 to-cyan-500/10 text-cyan-200 ring-cyan-400/30",
  "bg-gradient-to-br from-violet-400/25 to-violet-500/10 text-violet-200 ring-violet-400/30",
  "bg-gradient-to-br from-emerald-400/25 to-emerald-500/10 text-emerald-200 ring-emerald-400/30",
  "bg-gradient-to-br from-rose-400/25 to-rose-500/10 text-rose-200 ring-rose-400/30",
];

function PartnerAvatar({ name, index }: { name: string; index: number }) {
  const tone = AVATAR_TONES[index % AVATAR_TONES.length];
  return (
    <span
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold ring-1 ${tone}`}
    >
      {initials(name)}
    </span>
  );
}

function TrendPill({ pct }: { pct: number | null }) {
  if (pct === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        <Minus className="h-3 w-3" /> New
      </span>
    );
  }
  if (pct === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        <Minus className="h-3 w-3" /> Flat
      </span>
    );
  }
  const up = pct > 0;
  const cls = up
    ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
    : "border-rose-400/25 bg-rose-500/10 text-rose-300";
  const Icon = up ? TrendingUp : TrendingDown;
  const label = `${up ? "+" : ""}${pct}%`;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tabular-nums ${cls}`}
    >
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function LeaderboardEmpty() {
  return (
    <div className="relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      {/* Ghost rows preview */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
      >
        <div className="flex h-full flex-col justify-center gap-2.5 px-6">
          {[92, 74, 58, 44, 32].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="h-6 w-6 rounded-full bg-muted/40" />
              <span className="h-8 w-8 rounded-full bg-muted/40" />
              <span className="h-2 flex-1 rounded-full bg-muted/30" />
              <span
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500/40 to-teal-400/30"
                style={{ width: `${w}px` }}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      </div>

      <div className="relative mx-auto grid max-w-md place-items-center gap-4 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-cyan-500/10 text-amber-200 ring-1 ring-amber-400/25 shadow-[0_8px_30px_-10px_rgba(251,191,36,0.35)]">
          <Trophy className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            No ranked performance yet
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Once partners start generating qualified referrals and closed deals,
            this leaderboard will highlight top contributors with commission, deal
            value, and 30-day momentum.
          </p>
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/admin/affiliates/partners"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_6px_20px_-6px_rgba(34,211,238,0.55)] transition hover:brightness-110"
          >
            <UserPlus className="h-3.5 w-3.5" /> Invite a partner
          </Link>
          <Link
            to="/admin/affiliates/partners"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:border-cyan-400/40 hover:text-cyan-200"
          >
            <Settings2 className="h-3.5 w-3.5" /> Review partner setup
          </Link>
        </div>
        <p className="mt-1 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
          <Sparkles className="h-3 w-3 text-cyan-300" /> Auto-ranks by commission · Updates in real time
        </p>
      </div>
    </div>
  );
}

