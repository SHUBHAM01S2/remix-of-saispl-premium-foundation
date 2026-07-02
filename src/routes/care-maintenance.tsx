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
      { title: "Monthly Care & Maintenance Plans | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Monthly website care and maintenance plans from Shivaryan Infotech — security updates, uptime monitoring, content changes, SEO hygiene, and automation support starting at Rs.3,000/month.",
      },
      { property: "og:title", content: "Monthly Care & Maintenance Plans | Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Reliable monthly plans to keep your website secure, fast, and growing — from basic care to full growth + automation.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/care-maintenance" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Monthly Care & Maintenance Plans | Shivaryan Infotech" },
      {
        name: "twitter:description",
        content: "Monthly website care plans starting at Rs.3,000 — security, updates, and growth support.",
      },
    ],
    links: [{ rel: "canonical", href: "/care-maintenance" }],
  }),
  component: CareMaintenance,
});

function CareMaintenance() {
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
            Predictable monthly plans to keep your website secure, fast, and moving forward — pick the level of care that fits your stage.
          </p>
        </ScrollReveal>
      </section>

      {/* Plans Table */}
      <section className="bg-background pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
