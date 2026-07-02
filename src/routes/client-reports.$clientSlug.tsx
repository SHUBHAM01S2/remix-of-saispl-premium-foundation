import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Users,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  BarChart3,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { getReportsBySlug, type ClientReport } from "@/lib/reports-admin.functions";
import { ReportTrendsChart } from "@/components/client-reports/ReportTrendsChart";

export const Route = createFileRoute("/client-reports/$clientSlug")({
  component: ClientReportPage,
  head: ({ params }) => ({
    meta: [
      { title: `Monthly Report — ${params.clientSlug}` },
      {
        name: "description",
        content:
          "Sticky Services monthly performance report: uptime, visitors, leads, WhatsApp taps, work delivered, and next month's plan.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function formatMonth(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function ClientReportPage() {
  const { clientSlug } = Route.useParams();
  const fn = useServerFn(getReportsBySlug);

  const { data, isLoading, error } = useQuery({
    queryKey: ["client-reports", clientSlug],
    queryFn: () => fn({ data: { slug: clientSlug } }),
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const current = useMemo<ClientReport | null>(() => {
    if (!data?.reports?.length) return null;
    if (selectedId) {
      return data.reports.find((r) => r.id === selectedId) ?? data.reports[0];
    }
    return data.reports[0];
  }, [data, selectedId]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-background px-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">Loading report…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] bg-background px-4 py-24 text-center">
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load report"}
        </p>
      </div>
    );
  }

  if (!data || !current) {
    throw notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-gradient-to-br from-brand/10 via-background to-cta/10">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            <Sparkles className="h-4 w-4" />
            Sticky Services · Monthly Report
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {data.clientName}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your monthly website performance report — what happened, what we did,
            and what's next.
          </p>

          {data.reports.length > 1 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Reporting period:
              </span>
              <div className="flex flex-wrap gap-2">
                {data.reports.map((r) => {
                  const active = r.id === current.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedId(r.id)}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "border-brand bg-brand text-white"
                          : "border-input bg-background text-foreground hover:bg-accent"
                      }`}
                    >
                      <Calendar className="h-3 w-3" />
                      {formatMonth(r.month)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {data.reports.length === 1 && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatMonth(current.month)}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        {/* Stat cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Activity}
            label="Uptime"
            value={`${Number(current.uptime_percentage).toFixed(2)}%`}
            accent="bg-emerald-500/10 text-emerald-600"
            sub="Site availability"
          />
          <StatCard
            icon={Users}
            label="Site Visitors"
            value={current.site_visitors.toLocaleString()}
            accent="bg-brand/10 text-brand"
            sub="Unique visitors this month"
          />
          <StatCard
            icon={BarChart3}
            label="Leads Generated"
            value={current.leads_from_forms.toLocaleString()}
            accent="bg-cta/10 text-cta"
            sub="From website forms"
          />
          <StatCard
            icon={MessageCircle}
            label="WhatsApp Taps"
            value={current.whatsapp_taps.toLocaleString()}
            accent="bg-violet-500/10 text-violet-600"
            sub="Direct chat starts"
          />
        </section>

        {/* Month-over-month trends */}
        <section className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <BarChart3 className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Month-Over-Month Trends
              </h2>
              <p className="text-xs text-muted-foreground">
                Site visitors and leads generated over time
              </p>
            </div>
          </div>
          <ReportTrendsChart reports={data.reports} />
        </section>

        {/* Top pages */}
        {current.top_pages && current.top_pages.length > 0 && (
          <section className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Top Performing Pages
            </h2>
            <ul className="mt-4 divide-y divide-border/60">
              {current.top_pages.map((p, i) => (
                <li
                  key={`${p}-${i}`}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                      {i + 1}
                    </span>
                    <code className="text-foreground">{p}</code>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Work done */}
        <section className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">
              Work Done This Month
            </h2>
          </div>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {current.work_done_this_month || (
              <span className="text-muted-foreground">
                No work summary provided for this month.
              </span>
            )}
          </div>
        </section>

        {/* Recommendation */}
        <section className="mt-6 rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/5 to-cta/5 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <ArrowRight className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">
              Next Month's Recommendation
            </h2>
          </div>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {current.next_month_recommendation || (
              <span className="text-muted-foreground">
                No recommendation provided for this month.
              </span>
            )}
          </div>
        </section>

        <footer className="mt-16 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          Report generated by Sticky Services · Questions? Reply to your monthly
          email or{" "}
          <Link to="/contact" className="text-brand hover:underline">
            get in touch
          </Link>
          .
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
