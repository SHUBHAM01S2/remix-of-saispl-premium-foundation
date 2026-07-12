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
  Handshake,
  AlertTriangle,
  Clock,
  UserX,
  CheckCircle2,
  BarChart3,
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
            Command center · Live
          </div>
          <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight sm:text-[28px]">
            Affiliate Program
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Referral operations, partner performance, pipeline, and payouts at a glance.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/admin/affiliates/payouts"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 px-3.5 py-2 text-xs font-semibold text-foreground/90 transition hover:border-cyan-400/40 hover:bg-cyan-500/5 hover:text-foreground"
          >
            <Wallet className="h-3.5 w-3.5" /> Payout Queue
          </Link>
          <Link
            to="/admin/affiliates/partners"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_10px_28px_-10px_rgba(6,182,212,0.55)] transition hover:from-cyan-300 hover:to-cyan-500"
          >
            <Plus className="h-3.5 w-3.5" /> New Partner
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

  return (
    <div className="space-y-6">
      {/* KPI clusters */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ClusterCard title="Partners" hint="Network health" icon={Users}>
          <KpiTile label="Total" value={loading ? "—" : d?.totalPartners ?? 0} />
          <KpiTile
            label="Active"
            value={loading ? "—" : d?.activePartners ?? 0}
            tone="emerald"
          />
          <KpiTile
            label="Inactive"
            value={loading ? "—" : inactivePartners}
            tone={inactivePartners > 0 ? "amber" : undefined}
          />
        </ClusterCard>

        <ClusterCard title="Pipeline" hint="Deal flow" icon={TrendingUp}>
          <KpiTile label="Referrals" value={loading ? "—" : d?.totalReferrals ?? 0} />
          <KpiTile
            label="Won this mo."
            value={loading ? "—" : d?.wonThisMonth ?? 0}
            tone="emerald"
          />
          <KpiTile
            label="Open value"
            value={loading ? "—" : fmtMoney(openPipelineValue)}
            tone="cyan"
            money
          />
        </ClusterCard>

        <ClusterCard title="Commissions" hint="Cash position" icon={Wallet}>
          <KpiTile
            label="Pending"
            value={loading ? "—" : fmtMoney(d?.pendingPayout ?? 0)}
            tone="amber"
            money
          />
          <KpiTile
            label="Approved"
            value={loading ? "—" : fmtMoney(approvedTotal)}
            tone="cyan"
            money
          />
          <KpiTile
            label="Paid"
            value={loading ? "—" : fmtMoney(paidTotal)}
            tone="emerald"
            money
          />
        </ClusterCard>
      </div>

      {/* Attention / signals */}
      <section className="grid gap-3 md:grid-cols-3">
        <SignalCard
          tone={stalled.length > 0 ? "amber" : "neutral"}
          icon={Clock}
          label="Stalled referrals"
          value={loading ? "—" : stalled.length}
          hint={`No activity in ${STALL_DAYS}+ days`}
          cta={stalled.length > 0 ? { to: "/admin/affiliates/referrals", label: "Review" } : undefined}
        />
        <SignalCard
          tone={inactivePartners > 0 ? "amber" : "neutral"}
          icon={UserX}
          label="Inactive partners"
          value={loading ? "—" : inactivePartners}
          hint="Paused or dormant partners"
          cta={inactivePartners > 0 ? { to: "/admin/affiliates/partners", label: "View" } : undefined}
        />
        <SignalCard
          tone={(d?.pendingPayout ?? 0) > 0 ? "cyan" : "neutral"}
          icon={BadgeDollarSign}
          label="Awaiting release"
          value={loading ? "—" : fmtMoney(d?.pendingPayout ?? 0)}
          hint="Approve to release funds"
          cta={(d?.pendingPayout ?? 0) > 0 ? { to: "/admin/affiliates/payouts", label: "Approve" } : undefined}
        />
      </section>

      {/* Two-column body */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* Top partners */}
        <Panel
          eyebrow="Leaderboard"
          title="Top partners by commission"
          action={
            <Link
              to="/admin/affiliates/partners"
              className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
            >
              All partners <ArrowUpRight className="h-3 w-3" />
            </Link>
          }
        >
          {loading ? (
            <PanelLoading />
          ) : !d || d.leaderboard.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No partner activity yet"
              body="Once partners start closing referrals, top performers appear here ranked by commission earned."
              cta={{ to: "/admin/affiliates/partners", label: "Invite a partner" }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-5 py-2.5 font-semibold">#</th>
                    <th className="px-5 py-2.5 font-semibold">Partner</th>
                    <th className="px-5 py-2.5 text-right font-semibold">Won</th>
                    <th className="px-5 py-2.5 text-right font-semibold">Commission</th>
                    <th className="px-5 py-2.5 font-semibold w-[120px]">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {d.leaderboard.map((b, i) => {
                    const top = d.leaderboard[0].commission || 1;
                    const pct = Math.max(4, Math.round((b.commission / top) * 100));
                    return (
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
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-500/10 text-[11px] font-semibold text-cyan-200 ring-1 ring-cyan-400/25">
                              {initials(b.name)}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-foreground group-hover:text-cyan-200">
                                {b.name}
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {b.company ?? "—"}
                              </span>
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-2.5 text-right tabular-nums">{b.won}</td>
                        <td className="px-5 py-2.5 text-right font-semibold tabular-nums text-cyan-200">
                          {fmtMoney(b.commission)}
                        </td>
                        <td className="px-5 py-2.5">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
                              style={{ width: `${pct}%` }}
                            />
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

        {/* Side rail */}
        <div className="space-y-5">
          <Panel eyebrow="Conversion" title="Program performance">
            {loading ? (
              <PanelLoading rows={2} />
            ) : (
              <div className="space-y-3 p-5">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">Win rate</span>
                    <span className="text-lg font-semibold tabular-nums">{wonRate}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                      style={{ width: `${Math.min(100, wonRate)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Won this month vs. all referrals
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <MiniStat label="Total deal value" value={fmtMoney(d?.dealValue ?? 0)} />
                  <MiniStat label="Open pipeline" value={fmtMoney(openPipelineValue)} />
                </div>
              </div>
            )}
          </Panel>

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
  icon: Icon, title, body, cta,
}: {
  icon: any; title: string; body: string; cta?: { to: string; label: string };
}) {
  return (
    <div className="grid place-items-center gap-3 px-6 py-12 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-cyan-500/5 text-cyan-300 ring-1 ring-cyan-400/20">
        <Icon className="h-4 w-4" />
      </span>
      <div className="max-w-xs">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-cyan-400/40 hover:text-cyan-200"
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
