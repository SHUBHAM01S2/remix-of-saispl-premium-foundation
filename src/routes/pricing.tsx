import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Tag, ShieldCheck, Plus } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { GlobalReachNote } from "@/components/GlobalReachNote";

type Row = {
  name: string;
  fee: string;
  inclusions: string;
  highlighted?: boolean;
};

const webPackages: Row[] = [
  {
    name: "Starter Site",
    fee: "Rs.35,000 – Rs.60,000",
    inclusions: "Up to 5 pages, mobile-ready, contact form, basic SEO setup",
  },
  {
    name: "Growth Business Site",
    fee: "Rs.75,000 – Rs.1,50,000",
    inclusions: "Up to 10 pages, CMS, blog, on-page SEO, WhatsApp/lead capture",
    highlighted: true,
  },
  {
    name: "Premium Conversion Site",
    fee: "Rs.1,75,000 – Rs.3,50,000",
    inclusions: "Custom design, conversion copy, analytics, A/B testing, integrations",
  },
  {
    name: "Portal / Web App",
    fee: "Rs.2,50,000+",
    inclusions: "Custom portal, dashboards, user roles, database, integrations",
  },
];

const carePlans: Row[] = [
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

const addOns = [
  { name: "WhatsApp Automation Setup", price: "Rs.15,000 – Rs.35,000 one-time" },
  { name: "AI Website Chat Agent", price: "Rs.20,000 – Rs.40,000 one-time" },
  { name: "Logo + Branding Kit", price: "Rs.8,000 – Rs.20,000" },
  { name: "Extra landing page", price: "Rs.5,000 – Rs.12,000 per page" },
  { name: "SEO Article (1 blog post)", price: "Rs.2,000 – Rs.4,000 per piece" },
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Websites, Portals, Care Plans & Add-Ons | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Clear, honest pricing from Shivaryan Infotech: web design packages, monthly care plans, and add-ons like WhatsApp automation, AI chat agent, and SEO articles. Fixed pricing, no scope-creep charges.",
      },
      { property: "og:title", content: "Pricing — Websites, Portals & Care Plans | Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Fixed pricing for web design, custom portals, monthly care, and add-ons. No hourly billing surprises.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/pricing" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pricing | Shivaryan Infotech" },
      {
        name: "twitter:description",
        content: "Clear, honest pricing — no surprises.",
      },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

function PricingTable({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div>
      <ScrollReveal className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </ScrollReveal>

      {/* Desktop table */}
      <ScrollReveal className="hidden overflow-hidden rounded-2xl border border-border/60 bg-surface md:block">
        <table className="w-full text-left">
          <thead className="border-b border-border/60 bg-surface-elevated">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Package
              </th>
              <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Price
              </th>
              <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Inclusions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.name}
                className={`border-b border-border/40 last:border-b-0 transition-colors hover:bg-surface-elevated/60 ${
                  row.highlighted ? "bg-brand/5" : ""
                } ${idx % 2 === 1 && !row.highlighted ? "bg-surface-elevated/30" : ""}`}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-foreground">
                      {row.name}
                    </span>
                    {row.highlighted && (
                      <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                        Popular
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-medium text-foreground">
                  {row.fee}
                </td>
                <td className="px-6 py-5 text-sm leading-relaxed text-muted-foreground">
                  {row.inclusions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollReveal>

      {/* Mobile cards */}
      <StaggerContainer className="grid gap-4 md:hidden">
        {rows.map((row) => (
          <StaggerItem key={row.name}>
            <div
              className={`rounded-2xl border p-5 ${
                row.highlighted
                  ? "border-brand/40 bg-brand/5"
                  : "border-border/60 bg-surface"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  {row.name}
                </h3>
                {row.highlighted && (
                  <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-brand">{row.fee}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {row.inclusions}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

function Pricing() {
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
            <Tag className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Clear, Honest Pricing —{" "}
            <span className="text-brand">No Surprises</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Fixed packages for websites, portals, and monthly care — plus
            simple add-ons when you need more.
          </p>
        </ScrollReveal>
      </section>

      {/* Web Design Packages */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PricingTable title="Web Design Packages" rows={webPackages} />
        </div>
      </section>

      {/* Monthly Care Plans */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PricingTable title="Monthly Care Plans" rows={carePlans} />
        </div>
      </section>

      {/* Add-Ons */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Plus className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Add-Ons
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((item) => (
              <StaggerItem key={item.name}>
                <div className="h-full rounded-xl border border-border/50 bg-surface p-5 transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-0.5">
                  <h3 className="text-base font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-brand">
                    {item.price}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal className="mt-10">
            <div className="flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/5 p-6">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="text-sm leading-relaxed text-foreground md:text-base">
                All pricing is fixed. No hourly billing surprises. No scope
                creep charges.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-cta px-8 py-3.5 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl"
          >
            Get a Free Quote
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <div className="mt-8 flex justify-center">
            <GlobalReachNote />
          </div>
        </div>
      </section>
    </div>
  );
}
