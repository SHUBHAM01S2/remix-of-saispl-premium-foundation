import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  FileText,
  MessagesSquare,
  MousePointerClick,
  Wrench,
  Lightbulb,
  Activity,
  BarChart3,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

type Report = {
  id: string;
  client_name: string;
  month: string;
  site_visitors: number;
  top_pages: string[];
  leads_from_forms: number;
  whatsapp_taps: number;
  work_done_this_month: string | null;
  next_month_recommendation: string | null;
  uptime_percentage: number;
  created_at: string;
};

export const Route = createFileRoute("/reports/$id")({
  head: () => ({
    meta: [
      { title: "Monthly Client Report | Shivaryan Infotech" },
      { name: "description", content: "Your monthly website performance and care report." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { id } = Route.useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from("client_reports")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) setErr(error.message);
      setReport(data as Report | null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-32 text-center text-muted-foreground">
        Loading report…
      </div>
    );
  }

  if (err || !report) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-32 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Report not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {err ?? "This report does not exist or is no longer available."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-sm font-medium uppercase tracking-wide text-brand">
              Monthly Report — {report.month}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {report.client_name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Prepared by Shivaryan Infotech
            </p>
          </ScrollReveal>

          {/* 1. Performance Report */}
          <ScrollReveal delay={0.1} className="mt-10">
            <div className="rounded-2xl border border-border/50 bg-surface p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">1. Performance Report</h2>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Stat icon={Users} label="Site Visitors" value={report.site_visitors.toLocaleString()} />
                <Stat icon={FileText} label="Leads from Forms" value={report.leads_from_forms.toLocaleString()} />
                <Stat icon={MousePointerClick} label="WhatsApp Taps" value={report.whatsapp_taps.toLocaleString()} />
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Top Pages
                </h3>
                {report.top_pages.length ? (
                  <ol className="mt-3 space-y-2">
                    {report.top_pages.map((p, i) => (
                      <li
                        key={p + i}
                        className="flex items-center gap-3 rounded-lg border border-border/50 bg-background px-4 py-2 text-sm text-foreground"
                      >
                        <span className="text-xs font-semibold text-brand">#{i + 1}</span>
                        <span className="truncate">{p}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">No page data this month.</p>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* 2. Work Done */}
          <ScrollReveal delay={0.15} className="mt-6">
            <Section
              icon={Wrench}
              title="2. Work Done This Month"
              body={report.work_done_this_month}
            />
          </ScrollReveal>

          {/* 3. Next Month Recommendation */}
          <ScrollReveal delay={0.2} className="mt-6">
            <Section
              icon={Lightbulb}
              title="3. Next Month Recommendation"
              body={report.next_month_recommendation}
            />
          </ScrollReveal>

          {/* 4. Uptime Log */}
          <ScrollReveal delay={0.25} className="mt-6">
            <div className="rounded-2xl border border-border/50 bg-surface p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Activity className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">4. Uptime Log</h2>
              </div>
              <p className="mt-4 text-base text-foreground">
                Your site was live{" "}
                <span className="text-2xl font-bold text-brand">
                  {Number(report.uptime_percentage).toFixed(2)}%
                </span>{" "}
                of the month.
              </p>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${Math.min(100, Number(report.uptime_percentage))}%` }}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-background p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof MessagesSquare;
  title: string;
  body: string | null;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-surface p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        {body ?? "Nothing recorded for this month yet."}
      </p>
    </div>
  );
}
