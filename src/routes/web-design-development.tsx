import { createFileRoute, Link } from "@tanstack/react-router";
import { RelatedLinks } from "@/components/RelatedLinks";
import { useState } from "react";
import {
  Globe,
  Zap,
  Layout,
  Settings,
  Languages,
  Gauge,
  ArrowUpRight,
  Check,
  Sparkles,
  Plus,
  Minus,
  Building2,
  GraduationCap,
  Hotel,
  Home,
  Store,
  Rocket,
  Search,
  PenTool,
  Code2,
  ShieldCheck,
  Target,
  Award,
  MapPin,
  Layers,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { StrategyCallButton } from "@/components/StrategyCallButton";

const displayFont = { fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" };

const SEO_TITLE =
  "Web Design "Web Design & Development Company in India | Custom Websites — SAISPL" Development | Shivaryan Infotech";
const SEO_DESCRIPTION =
  "Custom web design and development company in India. Shivaryan Infotech (SAISPL) builds fast, SEO-ready, mobile-first websites and web apps for clinics, hotels, schools, real estate, SaaS and local businesses — serving clients in 12+ countries.";
const SEO_URL = "/web-design-development";

export const Route = createFileRoute("/web-design-development")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESCRIPTION },
      {
        name: "keywords",
        content:
          "web design company India, website development company, custom website design, business website development, responsive website design, SEO website development, CMS website, Next.js development, React web app development, web design Himachal Pradesh, Shivaryan Infotech, SAISPL",
      },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SEO_URL },
      { property: "og:site_name", content: "Shivaryan Infotech" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ShivaryanInfotech" },
      { name: "twitter:title", content: SEO_TITLE },
      { name: "twitter:description", content: SEO_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SEO_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${SEO_URL}#service`,
          name: "Web Design & Development",
          serviceType: "Web Design & Development",
          provider: { "@id": "/#organization" },
          areaServed: [
            { "@type": "Country", name: "India" },
            { "@type": "Place", name: "Worldwide" },
          ],
          audience: {
            "@type": "BusinessAudience",
            audienceType:
              "Clinics, hotels, schools, real-estate agencies, local service businesses, SaaS startups",
          },
          url: SEO_URL,
          description: SEO_DESCRIPTION,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            offerCount: pricing.length,
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Website Packages",
            itemListElement: pricing.map((p) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: p.name,
                description: `${p.highlight}. Includes: ${p.features.join("; ")}.`,
              },
            })),
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://shivaryaninfotech.com/" },
            { "@type": "ListItem", position: 2, name: "Services", item: "https://shivaryaninfotech.com/services" },
            {
              "@type": "ListItem",
              position: 3,
              name: "Web Design & Development",
              item: `https://shivaryaninfotech.com${SEO_URL}`,
            },
          ],
        }),
      },
    ],
  }),

  component: WebsiteDesignDevelopmentPage,
});


const included = [
  { icon: Layout, title: "Custom-Designed Responsive Websites", desc: "Bespoke UI crafted for your brand — pixel-perfect on mobile, tablet, and desktop." },
  { icon: Zap, title: "Fast, SEO-Ready Pages", desc: "Modern stacks (Next.js / TanStack) with Core Web Vitals tuned from day one." },
  { icon: Settings, title: "CMS Setup & Training", desc: "Edit content yourself — Sanity, Strapi, or WordPress, configured and taught." },
  { icon: Target, title: "Booking, Contact & Lead-Capture", desc: "Smart forms, calendars, and CRM sync that turn traffic into pipeline." },
  { icon: Languages, title: "Multi-Language & Multi-Currency", desc: "Serve global audiences with localized content and regional pricing." },
  { icon: Gauge, title: "Ongoing Performance & A11y Tuning", desc: "We monitor, patch, and refine so your site keeps scoring 90+ on Lighthouse." },
];

const audience = [
  { icon: Building2, label: "Clinics & Hospitals" },
  { icon: GraduationCap, label: "Schools & Colleges" },
  { icon: Hotel, label: "Hotels & Resorts" },
  { icon: Home, label: "Real Estate Agencies" },
  { icon: Store, label: "Local Service Businesses" },
  { icon: Rocket, label: "SaaS & Startups" },
];

const process = [
  { step: "01", icon: Search, title: "Discovery & Planning", desc: "Goals, users, competitor teardown, and a scoped roadmap before design starts." },
  { step: "02", icon: PenTool, title: "Wireframe & UI Design", desc: "Low-fi flows, then a premium visual system reviewed and approved by you." },
  { step: "03", icon: Code2, title: "Development & Integrations", desc: "Clean, componentized builds with CMS, forms, payments, and analytics wired in." },
  { step: "04", icon: ShieldCheck, title: "QA, Launch & Support", desc: "Cross-device QA, SEO checks, launch day handling, and post-launch monitoring." },
];

const why = [
  { icon: Target, title: "Built for Lead Generation", desc: "Every section engineered to drive enquiries — not just look pretty." },
  { icon: Award, title: "Premium Design, Business-First UX", desc: "Luxury aesthetics balanced with clear paths to conversion." },
  { icon: MapPin, title: "HP-Based, Globally Delivering", desc: "A tight Bilaspur team serving clients across 12+ countries." },
  { icon: Layers, title: "Website + SEO + Automation", desc: "One partner covering design, growth, and ops — no agency ping-pong." },
];

const pricing = [
  {
    name: "Starter Site",
    tag: "Landing / Small Biz",
    highlight: "Perfect first web presence",
    features: [
      "Up to 5 pages",
      "Responsive design",
      "Basic SEO setup",
      "Contact form",
      "2 weeks delivery",
    ],
  },
  {
    name: "Growth Business Site",
    tag: "Most Popular",
    highlight: "Convert traffic into leads",
    features: [
      "Up to 12 pages",
      "CMS + blog",
      "Advanced SEO",
      "Lead-capture flows",
      "Analytics + reporting",
    ],
    popular: true,
  },
  {
    name: "Premium Conversion Site",
    tag: "Scale & Brand",
    highlight: "Enterprise-grade experience",
    features: [
      "Custom UI system",
      "Multi-language / currency",
      "CRM + email integrations",
      "Booking & payments",
      "A/B testing ready",
    ],
  },
  {
    name: "Portal / Web App",
    tag: "Custom Software",
    highlight: "Beyond a website",
    features: [
      "Auth & role-based access",
      "Custom dashboards",
      "APIs & third-party sync",
      "Cloud hosting",
      "Ongoing product support",
    ],
  },
];

const faqs = [
  {
    q: "How long does a website project take?",
    a: "Starter sites launch in 2 weeks. Business sites typically take 3–5 weeks. Larger portals or custom web apps run 6–10 weeks depending on scope.",
  },
  {
    q: "Do you provide content writing?",
    a: "Yes. Our team writes SEO-optimized copy in your brand voice, or we polish content you already have. Add-on service across all packages.",
  },
  {
    q: "Can you redesign an old website?",
    a: "Absolutely. We audit your current site, preserve what's working (SEO, backlinks, key pages), and rebuild the rest into a modern, faster experience.",
  },
  {
    q: "Will the site be mobile-friendly?",
    a: "Every site we ship is mobile-first, tested on real devices, and scored 90+ on Google's mobile usability and Core Web Vitals.",
  },
  {
    q: "Do you also maintain the website after launch?",
    a: "Yes — we offer monthly maintenance plans covering hosting, security updates, content changes, monitoring, and priority support.",
  },
];

function WebsiteDesignDevelopmentPage() {
  return (
    <div className="bg-background text-zinc-400 selection:bg-brand/30 selection:text-white">
      {/* HERO */}
      <section className="relative overflow-hidden pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--color-brand)_14%,transparent),transparent_60%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right,#121212 1px,transparent 1px),linear-gradient(to bottom,#121212 1px,transparent 1px)",
            backgroundSize: "4rem 4rem",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-32 h-[500px] w-[900px] -translate-x-1/2 rounded-full blur-[130px] opacity-40"
          style={{ background: "color-mix(in oklab, var(--color-brand) 30%, transparent)" }}
        />

        <ScrollReveal className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
            <Globe className="h-3 w-3" />
            Website Design & Development
          </span>
          <h1
            className="text-5xl font-black leading-[0.95] tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={displayFont}
          >
            Websites Built to{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                Convert & Grow
              </span>
              <span
                className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
                style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
              />
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            We design and build custom websites that load fast, rank well, and turn visitors into
            customers.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-[1.03] sm:w-auto"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative">Get a Free Quote</span>
              <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/our-works"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-10 py-5 text-sm font-bold text-foreground transition-all hover:border-brand/40 hover:bg-white/[0.08] sm:w-auto"
            >
              View Portfolio
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <ScrollReveal className="mb-14 md:mb-16">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            What's Included
          </span>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
            Everything you need in one build.
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {included.map((it) => {
            const Icon = it.icon;
            return (
              <StaggerItem key={it.title} className="h-full">
                <div className="group relative flex h-full gap-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]">
                  <div
                    className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
                  />
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-inner transition-all duration-500 group-hover:border-brand/40 group-hover:from-brand/20">
                    <Icon className="h-6 w-6 text-foreground/90 transition-colors group-hover:text-brand" />
                  </div>
                  <div className="relative">
                    <h3 className="text-lg font-bold text-foreground" style={displayFont}>
                      {it.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {it.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
                Who This Is For
              </span>
              <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
                Built for teams that need results.
              </h2>
            </div>
            <div className="font-mono text-sm uppercase tracking-widest text-brand">
              Industries we ship for
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {audience.map((a) => {
              const Icon = a.icon;
              return (
                <StaggerItem key={a.label}>
                  <div className="group relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:bg-white/[0.06]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.01] transition-all group-hover:border-brand/40 group-hover:from-brand/20">
                      <Icon className="h-5 w-5 text-foreground/85 transition-colors group-hover:text-brand" />
                    </div>
                    <span className="text-xs font-semibold text-foreground/90">{a.label}</span>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <ScrollReveal className="mb-14 md:mb-16">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Our Process
          </span>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
            Four stages. Zero surprises.
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => {
            const Icon = p.icon;
            return (
              <StaggerItem key={p.step} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]">
                  <div
                    className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
                  />
                  <div
                    className="pointer-events-none absolute -right-2 -bottom-8 select-none text-[9rem] font-black leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-brand/10"
                    style={displayFont}
                  >
                    {p.step}
                  </div>
                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-brand" />
                      Step {p.step}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-zinc-600">
                      0{i + 1}/04
                    </span>
                  </div>
                  <div className="relative mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-inner transition-all duration-500 group-hover:border-brand/40 group-hover:from-brand/20">
                    <Icon className="h-6 w-6 text-foreground/90 transition-colors group-hover:text-brand" />
                  </div>
                  <h4 className="relative mt-6 text-xl font-bold leading-tight text-foreground" style={displayFont}>
                    {p.title}
                  </h4>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* WHY CHOOSE */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-14 md:mb-16">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              Why Choose SAISPL
            </span>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
              A partner, not a vendor.
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {why.map((w) => {
              const Icon = w.icon;
              return (
                <StaggerItem key={w.title} className="h-full">
                  <div className="group relative flex h-full gap-5 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]">
                    <div
                      className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                      style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
                    />
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-inner transition-all group-hover:border-brand/40 group-hover:from-brand/20">
                      <Icon className="h-6 w-6 text-foreground/90 transition-colors group-hover:text-brand" />
                    </div>
                    <div className="relative">
                      <h3 className="text-lg font-bold text-foreground" style={displayFont}>
                        {w.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {w.desc}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <ScrollReveal className="mb-14 md:mb-16">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Pricing Preview
          </span>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
            Simple tiers. Real outcomes.
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Transparent packages built around business impact. Custom quotes on request.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pricing.map((p) => (
            <StaggerItem key={p.name} className="h-full">
              <div
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-500 hover:-translate-y-1.5 ${
                  p.popular
                    ? "border-brand/50 bg-gradient-to-b from-brand/10 to-white/[0.01] shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_55%,transparent)]"
                    : "border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]"
                }`}
              >
                <div
                  className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
                />
                <div className="relative flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${p.popular ? "border-brand/40 bg-brand/15 text-brand" : "border-white/10 bg-white/[0.04] text-muted-foreground"}`}>
                    <span className="h-1 w-1 rounded-full bg-brand" />
                    {p.tag}
                  </span>
                </div>
                <h3 className="relative mt-6 text-2xl font-bold text-foreground" style={displayFont}>
                  {p.name}
                </h3>
                <p className="relative mt-1 text-sm text-muted-foreground">{p.highlight}</p>

                <ul className="relative mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
                      <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10">
                        <Check className="h-2.5 w-2.5 text-brand" strokeWidth={3} />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-6 flex-1" />

                <Link
                  to="/contact"
                  className={`relative mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-transform hover:scale-[1.02] ${
                    p.popular
                      ? "bg-brand text-background"
                      : "border border-white/15 bg-white/[0.04] text-foreground hover:border-brand/40 hover:bg-white/[0.08]"
                  }`}
                >
                  Get a Quote
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <p className="mt-8 text-center text-xs uppercase tracking-widest text-zinc-600">
          <Sparkles className="mr-2 inline-block h-3 w-3 text-brand" />
          Custom, portal, and enterprise builds quoted on request
        </p>
      </section>

      {/* FAQ */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-14 text-center md:mb-16">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              Frequently Asked
            </span>
            <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
              Questions, answered.
            </h2>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* RELATED SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-8">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Related Services
          </span>
          <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl" style={displayFont}>
            Pair your website with growth & automation.
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/automation-ai-services", title: "AI & Automation", desc: "AI agents and workflow automation that scale operations." },
            { to: "/custom-portals-software", title: "Custom Portals & Software", desc: "Internal dashboards, APIs, and role-based portals." },
            { to: "/seo-digital-marketing", title: "SEO & Digital Marketing", desc: "Rank higher, convert better, get found in AI search." },
            { to: "/care-maintenance", title: "Care & Maintenance", desc: "Ongoing hosting, security, and content support." },
          ].map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white/[0.06]"
            >
              <div>
                <h3 className="text-base font-bold text-foreground" style={displayFont}>{r.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{r.desc}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                Explore <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Not sure which package fits?{" "}
          <Link to="/contact" className="font-semibold text-brand hover:underline">Talk to our team</Link>{" "}
          or{" "}
          <Link to="/pricing" className="font-semibold text-brand hover:underline">compare pricing</Link>.
        </p>
      </section>


      <RelatedLinks currentPath="/web-design-development" />
      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-y border-white/10 bg-[#050505] px-6 py-24 md:py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
          style={{ background: "color-mix(in oklab, var(--color-brand) 14%, transparent)" }}
        />
        <div
          className="pointer-events-none absolute left-[20%] top-0 h-[300px] w-[300px] rounded-full blur-[100px]"
          style={{ background: "color-mix(in oklab, var(--color-brand) 20%, transparent)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-[15%] h-[300px] w-[300px] rounded-full blur-[100px]"
          style={{ background: "color-mix(in oklab, #6366f1 18%, transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-8 backdrop-blur-sm md:p-16">
            <div className="pointer-events-none absolute left-6 top-6 h-6 w-6 border-l-2 border-t-2 border-brand/50" />
            <div className="pointer-events-none absolute right-6 top-6 h-6 w-6 border-r-2 border-t-2 border-brand/50" />
            <div className="pointer-events-none absolute bottom-6 left-6 h-6 w-6 border-b-2 border-l-2 border-brand/50" />
            <div className="pointer-events-none absolute bottom-6 right-6 h-6 w-6 border-b-2 border-r-2 border-brand/50" />

            <div className="relative text-center">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                Free discovery — no pressure
              </span>

              <h2
                className="text-4xl font-extrabold leading-[1] tracking-tight text-foreground md:text-6xl"
                style={displayFont}
              >
                Ready to Build a Website That Brings{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                    Real Business?
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
                  />
                </span>
              </h2>

              <div className="mt-10 flex justify-center">
                <StrategyCallButton
                  ariaLabel="Book a free discovery call"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-[1.03]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  <span className="relative">Book a Free Discovery Call</span>
                  <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </StrategyCallButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] transition-colors hover:border-brand/30">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
      >
        <span className="text-base font-semibold text-foreground md:text-lg" style={displayFont}>
          {q}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-brand transition-colors group-hover:border-brand/40">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0">
          <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}
