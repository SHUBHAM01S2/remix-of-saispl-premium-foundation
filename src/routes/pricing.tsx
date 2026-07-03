import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Rocket,
  Building2,
  Layers,
  MessageSquare,
  Bot,
  PenTool,
  FileText,
  Palette,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { GlobalReachNote } from "@/components/GlobalReachNote";

type Currency = "INR" | "USD" | "GBP" | "EUR";

type Price = { INR: string; USD: string; GBP: string; EUR: string };

type Plan = {
  name: string;
  tagline: string;
  price: Price;
  suffix?: string;
  icon: typeof Zap;
  features: string[];
  highlighted?: boolean;
  badge?: string;
};

const webPackages: Plan[] = [
  {
    name: "Starter Site",
    tagline: "For new brands getting online",
    price: { INR: "₹35K – 60K", USD: "$800 – $1,500", GBP: "£600 – £1,100", EUR: "€700 – €1,300" },
    suffix: "one-time",
    icon: Zap,
    features: [
      "Up to 5 pages",
      "Mobile-ready responsive design",
      "Contact form + WhatsApp button",
      "Basic on-page SEO setup",
      "1 round of revisions",
    ],
  },
  {
    name: "Growth Business Site",
    tagline: "Most chosen by SMBs",
    price: { INR: "₹75K – 1.5L", USD: "$1,800 – $3,500", GBP: "£1,350 – £2,600", EUR: "€1,600 – €3,000" },
    suffix: "one-time",
    icon: Rocket,
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Up to 10 pages + CMS",
      "Blog & content system",
      "On-page SEO + schema",
      "WhatsApp / lead capture flows",
      "Analytics setup",
      "2 rounds of revisions",
    ],
  },
  {
    name: "Premium Conversion",
    tagline: "For serious growth",
    price: { INR: "₹1.75L – 3.5L", USD: "$3,800 – $7,000", GBP: "£2,900 – £5,300", EUR: "€3,300 – €6,100" },
    suffix: "one-time",
    icon: Sparkles,
    features: [
      "Fully custom design",
      "Conversion-focused copy",
      "A/B testing setup",
      "Advanced integrations",
      "Speed & Core Web Vitals",
      "3 rounds of revisions",
    ],
  },
  {
    name: "Portal / Web App",
    tagline: "Custom software builds",
    price: { INR: "₹2.5L+", USD: "$6,000+", GBP: "£4,500+", EUR: "€5,200+" },
    suffix: "starting",
    icon: Building2,
    features: [
      "Custom portal / dashboard",
      "User roles & auth",
      "Database + API design",
      "Third-party integrations",
      "Post-launch support",
    ],
  },
];




const addOns: {
  name: string;
  price: Price;
  note: string;
  icon: typeof MessageSquare;
}[] = [
  { name: "WhatsApp Automation", price: { INR: "₹15K – 35K", USD: "$300 – $700", GBP: "£225 – £525", EUR: "€260 – €610" }, note: "one-time", icon: MessageSquare },
  { name: "AI Website Chat Agent", price: { INR: "₹20K – 40K", USD: "$400 – $800", GBP: "£300 – £600", EUR: "€350 – €700" }, note: "one-time", icon: Bot },
  { name: "Logo + Branding Kit", price: { INR: "₹8K – 20K", USD: "$200 – $500", GBP: "£150 – £375", EUR: "€175 – €435" }, note: "one-time", icon: Palette },
  { name: "Extra Landing Page", price: { INR: "₹5K – 12K", USD: "$150 – $350", GBP: "£110 – £265", EUR: "€130 – €305" }, note: "per page", icon: PenTool },
  { name: "SEO Article", price: { INR: "₹2K – 4K", USD: "$60 – $120", GBP: "£45 – £90", EUR: "€52 – €105" }, note: "per piece", icon: FileText },
];

const faqs = [
  {
    q: "How is pricing decided within a range?",
    a: "Ranges depend on complexity, custom design work, integrations, and content readiness. We give a fixed quote after a short scoping call — no surprises later.",
  },
  {
    q: "Do you charge hourly?",
    a: "No. Every engagement is a fixed-scope, fixed-price package. If scope changes, we send a small change order first.",
  },
  {
    q: "Do you offer discounts for long engagements?",
    a: "Yes — multi-package or retainer engagements get preferential pricing. Ask us for a bundle quote.",
  },

  {
    q: "Do you work with international clients?",
    a: "Yes. We serve clients across India and globally. Payments in INR or USD.",
  },
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
      { name: "twitter:description", content: "Clear, honest pricing — no surprises." },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

function PlanCard({ plan, currency }: { plan: Plan; currency: Currency }) {
  const Icon = plan.icon;
  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-300 ${
        plan.highlighted
          ? "border-brand/60 bg-gradient-to-b from-brand/10 via-surface to-surface shadow-[0_20px_60px_-20px] shadow-brand/30 lg:-translate-y-2"
          : "border-border/60 bg-surface hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl"
      }`}
    >
      {plan.highlighted && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/25 blur-3xl" />
      )}

      {plan.badge && (
        <div className="absolute right-6 top-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cta-foreground shadow-lg shadow-brand/30">
            <Sparkles className="h-3 w-3" />
            {plan.badge}
          </span>
        </div>
      )}

      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
          plan.highlighted ? "bg-brand text-cta-foreground" : "bg-brand/10 text-brand"
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-foreground">
          {plan.price[currency]}
        </span>
        {plan.suffix && (
          <span className="text-sm text-muted-foreground">{plan.suffix}</span>
        )}
      </div>

      <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      <ul className="flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-foreground/90">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                plan.highlighted ? "bg-brand text-cta-foreground" : "bg-brand/10 text-brand"
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
          plan.highlighted
            ? "bg-cta text-cta-foreground shadow-lg shadow-cta/30 hover:brightness-110"
            : "border border-border bg-background text-foreground hover:border-brand/40 hover:bg-brand/5"
        }`}
      >
        Get Started
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function Pricing() {
  const [currency, setCurrency] = useState<Currency>("INR");
  const plans = webPackages;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-1/4 top-0 h-[28rem] w-[28rem] rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand/10 blur-3xl" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            Simple Pricing
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Pricing that scales{" "}
            <span className="bg-gradient-to-r from-brand to-brand/60 bg-clip-text text-transparent">
              with your business
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Fixed packages for websites, portals, and custom builds — no hourly
            billing, no scope-creep surprises.
          </p>

          {/* Currency Switch */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Currency
            </span>
            <div className="inline-flex flex-wrap rounded-full border border-border/60 bg-surface p-1.5 shadow-sm">
              {(["INR", "USD", "GBP", "EUR"] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    currency === c
                      ? "bg-brand text-cta-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={currency === c}
                >
                  {c === "INR" ? "₹ INR" : c === "USD" ? "$ USD" : c === "GBP" ? "£ GBP" : "€ EUR"}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>


      {/* Plans grid */}
      <section className="bg-background pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer
            key={currency}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >

            {plans.map((plan) => (
              <StaggerItem key={plan.name} className="h-full">
                <PlanCard plan={plan} currency={currency} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal className="mt-12">
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-brand/30 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent p-6 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/20 text-brand">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-sm leading-relaxed text-foreground md:text-base">
                <strong className="font-semibold">Fixed pricing, always.</strong>{" "}
                No hourly billing surprises. No scope-creep charges. Every quote
                is locked before we start.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="bg-surface/40 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Extend anything
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Add-Ons & Extras
            </h2>
            <p className="mt-3 text-muted-foreground">
              Bolt these onto any package or care plan whenever you're ready.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.name}>
                  <div className="group flex h-full items-start gap-4 rounded-2xl border border-border/60 bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-cta-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-brand">
                          {item.price[currency]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.note}
                        </span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-background py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently asked
            </h2>
            <p className="mt-3 text-muted-foreground">
              Answers to what most clients ask before starting.
            </p>
          </ScrollReveal>

          <StaggerContainer className="space-y-4">
            {faqs.map((f) => (
              <StaggerItem key={f.q}>
                <details className="group rounded-2xl border border-border/60 bg-surface p-5 open:border-brand/40 open:bg-surface-elevated">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-base font-semibold text-foreground">
                      {f.q}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-brand transition-transform group-open:rotate-45">
                      <ArrowRight className="h-4 w-4 -rotate-45" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/15 via-surface to-surface p-10 text-center md:p-14">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Not sure which fits?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Tell us about your project in 2 minutes and we'll send back a
                fixed, no-obligation quote within 4 business hours.
              </p>
              <Link
                to="/contact"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-cta px-8 py-3.5 text-sm font-semibold text-cta-foreground shadow-lg shadow-cta/30 transition-all hover:brightness-110 hover:shadow-xl"
              >
                Get a Free Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <div className="mt-8 flex justify-center">
                <GlobalReachNote />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
