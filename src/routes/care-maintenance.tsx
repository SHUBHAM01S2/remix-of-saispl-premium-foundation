import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

type Plan = {
  name: string;
  fee: string;
  inclusions: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Care Basic",
    fee: "Rs.3,000 – Rs.6,000",
    inclusions: "Security updates, uptime check, 1 change/month, backup",
  },
  {
    name: "Care Plus",
    fee: "Rs.7,000 – Rs.12,000",
    inclusions: "2–4 changes/mo, speed check, quarterly report",
    highlighted: true,
  },
  {
    name: "Growth Plan",
    fee: "Rs.15,000 – Rs.25,000",
    inclusions: "Landing pages, SEO hygiene, monthly review call",
  },
  {
    name: "Growth + Automation",
    fee: "Rs.25,000 – Rs.45,000",
    inclusions: "Automation tweaks, WhatsApp/CRM support, KPI dashboard",
  },
];

export const Route = createFileRoute("/care-maintenance")({
  head: () => ({
    meta: [
      { title: "Monthly Website Care & Maintenance Plans India | SAISPL" },
      {
        name: "description",
        content:
          "Monthly website care & maintenance plans from Rs.3,000 — security updates, uptime, SEO hygiene, and content changes. Start your care plan today.",
      },
      {
        name: "keywords",
        content:
          "website maintenance India, website care plans, uptime monitoring, security updates, SEO maintenance, Shivaryan Infotech, SAISPL",
      },
      { property: "og:title", content: "Monthly Website Care & Maintenance Plans India | SAISPL" },
      {
        property: "og:description",
        content:
          "Monthly plans from Rs.3,000 to keep your website secure, fast, and growing. Start your care plan today.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/care-maintenance" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Monthly Website Care & Maintenance Plans India | SAISPL" },
      {
        name: "twitter:description",
        content: "Monthly website care plans starting at Rs.3,000 — security, updates, and growth support.",
      },
    ],
    links: [{ rel: "canonical", href: "/care-maintenance" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Website Care & Maintenance",
          serviceType: "Website Maintenance",
          provider: { "@id": "https://shivaryaninfotech.com/#organization" },
          areaServed: [
            { "@type": "AdministrativeArea", name: "Himachal Pradesh" },
            { "@type": "Country", name: "India" },
          ],
          url: "/care-maintenance",
          description:
            "Security updates, uptime monitoring, content changes, SEO hygiene, and automation support.",
          offers: {
            "@type": "Offer",
            price: "3000",
            priceCurrency: "INR",
            url: "/care-maintenance",
          },
        }),
      },
    ],
  }),

  component: CareMaintenance,
});

function CareMaintenance() {
  const included = [
    {
      title: "Security & updates",
      body: "WordPress core, plugin, and theme updates on a scheduled cadence, plus proactive vulnerability patching and malware scans so your site never becomes the weak link.",
    },
    {
      title: "Uptime & performance monitoring",
      body: "24/7 uptime checks from multiple regions, plus monthly Core Web Vitals and PageSpeed reviews with actionable fixes — not just screenshots of a score.",
    },
    {
      title: "Backups & recovery",
      body: "Daily off-site backups with a 30-day retention window and a documented restore path, so a bad plugin update never turns into a lost weekend.",
    },
    {
      title: "Content & change requests",
      body: "Small edits, new landing pages, blog uploads, banner swaps, and form tweaks — batched into a predictable monthly cycle rather than ad-hoc chaos.",
    },
    {
      title: "SEO hygiene",
      body: "Broken-link sweeps, redirect cleanup, schema validation, sitemap regeneration, and Search Console monitoring so the SEO work you already paid for keeps compounding.",
    },
    {
      title: "Reporting you'll actually read",
      body: "One concise monthly report covering uptime, traffic, top pages, and what we changed — no 40-page PDFs written for other agencies.",
    },
  ];

  const faqs = [
    {
      q: "Do I have to be an existing SAISPL client to sign up?",
      a: "No. We onboard sites built elsewhere too. We start with a technical audit (free with any care plan) and hand you a written baseline before the first billing cycle.",
    },
    {
      q: "What's the minimum commitment?",
      a: "Care plans are month-to-month with a 30-day cancellation window. Growth and automation plans work best on a 3-month cycle because the work compounds — but there's no annual lock-in.",
    },
    {
      q: "Who fixes it if my site goes down at 2 a.m.?",
      a: "Uptime monitors alert our on-call engineer immediately. For Care Plus and above, we act within one business hour on weekdays and best-effort on weekends and holidays.",
    },
    {
      q: "What counts as a 'change'?",
      a: "Text edits, image swaps, adding a testimonial, publishing a blog post, wiring a new form, or updating a menu. Larger builds — new templates, integrations, redesigns — are quoted separately.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Monthly <span className="text-brand">Care & Maintenance</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Predictable monthly plans that keep your website secure, fast, and moving
            forward — from routine updates and backups to SEO hygiene and growth
            experiments. Pick the level of care that fits your stage.
          </p>
        </ScrollReveal>
      </section>

      {/* What's included */}
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What's included in every plan
            </h2>
            <p className="mt-3 text-muted-foreground">
              A shared baseline across all four tiers — higher plans layer on
              faster response times, more monthly changes, and strategic input.
            </p>
          </ScrollReveal>
          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item) => (
              <StaggerItem key={item.title}>
                <div className="h-full rounded-2xl border border-border/60 bg-surface p-6">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Plans Table */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Care plans and pricing
            </h2>
            <p className="mt-3 text-muted-foreground">
              Transparent monthly pricing in INR. All tiers are billed monthly with a
              30-day cancellation window — no long lock-ins.
            </p>
          </ScrollReveal>
          {/* Desktop table */}
          <ScrollReveal className="hidden overflow-hidden rounded-2xl border border-border/60 bg-surface md:block">
            <table className="w-full text-left">
              <thead className="border-b border-border/60 bg-surface-elevated">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Monthly Fee
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Inclusions
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, idx) => (
                  <tr
                    key={plan.name}
                    className={`border-b border-border/40 last:border-b-0 transition-colors hover:bg-surface-elevated/60 ${
                      plan.highlighted ? "bg-brand/5" : ""
                    } ${idx % 2 === 1 && !plan.highlighted ? "bg-surface-elevated/30" : ""}`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-foreground">
                          {plan.name}
                        </span>
                        {plan.highlighted && (
                          <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                            Popular
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-foreground">
                      {plan.fee}
                    </td>
                    <td className="px-6 py-5 text-sm leading-relaxed text-muted-foreground">
                      {plan.inclusions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollReveal>

          {/* Mobile cards */}
          <StaggerContainer className="grid gap-4 md:hidden">
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <div
                  className={`rounded-2xl border p-5 ${
                    plan.highlighted
                      ? "border-brand/40 bg-brand/5"
                      : "border-border/60 bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {plan.name}
                    </h3>
                    {plan.highlighted && (
                      <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-brand">{plan.fee}</p>
                  <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>{plan.inclusions}</span>
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why choose SAISPL for care */}
      <section className="border-y border-border/40 bg-surface/40 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why teams keep their site on a SAISPL care plan
              </h2>
              <p className="mt-4 text-muted-foreground">
                Most agencies treat maintenance as an afterthought — a checkbox after
                launch. We treat it as the phase where growth actually happens. A live
                website is a compounding asset: every month of attention adds up to
                better SEO, faster pages, and fewer surprises.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand">
                  One team, one invoice
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Developers, designers, and SEO specialists on the same account —
                  no more chasing three vendors when one field breaks.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand">
                  Response SLAs in writing
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every plan ships with an SLA document covering response, resolution,
                  and escalation paths for downtime and security events.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand">
                  Built for Indian businesses
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  INR billing, GST invoices, WhatsApp support, and a team that
                  understands local hosting, payment gateways, and compliance.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand">
                  Upgrade or downgrade any month
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start on Care Basic, move to Growth when you're ready to run
                  campaigns, drop back down after a launch push — no penalty.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Straight answers about how our care plans work day to day.
            </p>
          </ScrollReveal>
          <StaggerContainer className="space-y-4">
            {faqs.map((f) => (
              <StaggerItem key={f.q}>
                <details className="group rounded-2xl border border-border/60 bg-surface p-5 open:bg-surface-elevated/50">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold text-foreground">
                    {f.q}
                    <span className="mt-0.5 text-brand transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA */}
          <ScrollReveal className="mt-12 text-center" delay={0.15}>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-cta px-8 py-3.5 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl"
            >
              Talk to us about a plan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
