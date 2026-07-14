import { createFileRoute, Link } from "@tanstack/react-router";
import { RelatedLinks } from "@/components/RelatedLinks";
import { StrategyCallButton } from "@/components/StrategyCallButton";
import { useState } from "react";
import {
  Search,
  MapPin,
  FileSearch,
  Wrench,
  PenTool,
  BarChart3,
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
  Stethoscope,
  Target,
  Award,
  Layers,
  LineChart,
  PhoneCall,
  TrendingUp,
  Globe2,
  Trophy,
  Users,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const displayFont = { fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" };

export const Route = createFileRoute("/seo-digital-marketing")({
  head: () => ({
    meta: [
      { title: "SEO { title: "SEO & Local Digital Marketing in Himachal Pradesh | SAISPL" } Digital Marketing | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Local SEO & digital marketing in Himachal Pradesh — rank on Google, win real enquiries, and grow revenue. Get a free SEO audit from SAISPL today.",
      },
      {
        name: "keywords",
        content:
          "SEO services Himachal Pradesh, local SEO India, Google Business Profile, on-page SEO, technical SEO, SEO content, ranking reports, Shivaryan Infotech, SAISPL",
      },
      { property: "og:title", content: "SEO & Local Digital Marketing in Himachal Pradesh | SAISPL" },
      {
        property: "og:description",
        content:
          "Rank on Google and win real enquiries with strategy-led local SEO. Get a free SEO audit today.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/seo-digital-marketing" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SEO & Local Digital Marketing in Himachal Pradesh | SAISPL" },
    ],
    links: [{ rel: "canonical", href: "/seo-digital-marketing" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "SEO & Local Digital Marketing",
          serviceType: "Search Engine Optimization",
          provider: { "@id": "https://shivaryaninfotech.com/#organization" },
          areaServed: [
            { "@type": "AdministrativeArea", name: "Himachal Pradesh" },
            { "@type": "Country", name: "India" },
          ],
          url: "/seo-digital-marketing",
          description:
            "Local SEO, Google Business Profile optimization, on-page SEO, content, and monthly ranking reports.",
        }),
      },
    ],
  }),

  component: SeoDigitalMarketingPage,
});

const included = [
  { icon: MapPin, title: "Local Keyword Research", desc: "We map the exact terms your customers search — by city, service, and intent — not vanity keywords." },
  { icon: FileSearch, title: "On-Page SEO Optimization", desc: "Titles, meta, headings, schema, alt text, and internal links tuned page-by-page for ranking." },
  { icon: Globe2, title: "Google Business Profile Setup", desc: "Complete GBP optimization: categories, services, posts, images, and review workflow." },
  { icon: Wrench, title: "Technical SEO Checks", desc: "Core Web Vitals, crawl fixes, sitemap, robots, redirects, and schema — the invisible foundation." },
  { icon: PenTool, title: "Blog Strategy & SEO Content", desc: "Content calendars and articles built around real search demand — not filler blog posts." },
  { icon: BarChart3, title: "Monthly Ranking & Traffic Reports", desc: "Clear dashboards on keywords, positions, clicks, and enquiries — no jargon, no fluff." },
];

const audience = [
  { icon: Store, label: "Local Businesses" },
  { icon: GraduationCap, label: "Schools & Institutes" },
  { icon: Stethoscope, label: "Clinics & Hospitals" },
  { icon: Hotel, label: "Hotels & Tourism" },
  { icon: Home, label: "Real Estate Firms" },
  { icon: Building2, label: "Multi-Location Brands" },
];

const process = [
  { step: "01", icon: Search, title: "SEO Audit", desc: "Full technical, on-page, and content audit to expose exactly what's holding rankings back." },
  { step: "02", icon: Target, title: "Competitor & Keyword Research", desc: "Reverse-engineer competitor wins and lock in a keyword map by intent, difficulty, and volume." },
  { step: "03", icon: Wrench, title: "On-Page Fixes & Structure", desc: "Meta, schema, headings, internal links, page speed, and site architecture rebuilt for ranking." },
  { step: "04", icon: LineChart, title: "Content & Monthly Reporting", desc: "Publish SEO content on schedule and report ranking, traffic, and enquiry movement every month." },
];

const why = [
  { icon: Target, title: "High-Intent Local Keywords", desc: "We chase keywords that book calls — not vanity terms with zero commercial value." },
  { icon: Layers, title: "SEO + Landing Page + Lead Capture", desc: "One team wiring rankings, conversion pages, and forms into a single funnel." },
  { icon: Award, title: "Transparent Reports", desc: "Real numbers, plain English, monthly reviews — you always know what's working." },
  { icon: TrendingUp, title: "Affordable vs Big Agencies", desc: "Boutique quality without the retainer bloat — priced for growing SMBs." },
  { icon: Users, title: "Built for SMBs & Services", desc: "Playbooks proven for clinics, hotels, schools, and multi-location service brands." },
  { icon: MapPin, title: "HP-Based, Globally Delivered", desc: "A tight Bilaspur team serving local and international clients across 12+ countries." },
];

const results = [
  { icon: Globe2, title: "More Google Visibility", desc: "Rank for the terms your customers actually type — locally and nationally." },
  { icon: PhoneCall, title: "More Calls & Enquiries", desc: "Search traffic that converts into direct calls, form fills, and bookings." },
  { icon: Trophy, title: "Better Local Authority", desc: "Own your city on Maps, reviews, and category-defining keywords." },
  { icon: TrendingUp, title: "Higher Website Traffic", desc: "Sustainable, compounding organic traffic — not paid drip-feed." },
  { icon: LineChart, title: "Long-Term Lead Generation", desc: "An asset that keeps producing enquiries long after the work ships." },
];

const pricing = [
  {
    name: "Local SEO Starter",
    tag: "GBP + Foundation",
    highlight: "Own your city on Google",
    features: [
      "Google Business Profile setup",
      "Local keyword research",
      "5 on-page optimizations",
      "Citation & NAP cleanup",
      "Monthly light report",
    ],
  },
  {
    name: "Monthly Growth SEO",
    tag: "Most Popular",
    highlight: "Full ongoing SEO engine",
    features: [
      "Technical + on-page SEO",
      "GBP posts & review flow",
      "Keyword tracking dashboard",
      "2 blogs / month",
      "Monthly strategy call",
    ],
    popular: true,
  },
  {
    name: "Content + Ranking Plan",
    tag: "Content-Led SEO",
    highlight: "Rank through publishing",
    features: [
      "Content calendar & clusters",
      "4–6 SEO articles / month",
      "Internal link architecture",
      "On-page + schema updates",
      "Ranking + traffic report",
    ],
  },
  {
    name: "SEO + Landing Page Retainer",
    tag: "Full Funnel",
    highlight: "Rankings that convert",
    features: [
      "Everything in Growth SEO",
      "1 landing page / month",
      "Conversion tracking setup",
      "Lead-capture optimization",
      "Quarterly strategy review",
    ],
  },
];

const faqs = [
  {
    q: "How long does SEO take to show results?",
    a: "Local SEO and GBP wins can appear in 4–8 weeks. Competitive organic rankings usually take 3–6 months of consistent work. We report progress every month so you can see momentum build.",
  },
  {
    q: "Do you work on Google Business Profile?",
    a: "Yes — GBP is central to local visibility. We handle setup, categories, services, images, posts, Q&A, and a review-generation workflow so you own the local map pack.",
  },
  {
    q: "Will you write blog content for us?",
    a: "Yes. Every ongoing plan includes SEO-optimized articles written by our team, planned around real keyword demand and mapped to your service pages.",
  },
  {
    q: "Do you guarantee #1 rankings?",
    a: "No credible SEO agency does. We guarantee the process — audits, fixes, content, reporting — and share transparent monthly results so you see exactly what's moving.",
  },
  {
    q: "Can SEO be combined with a website redesign?",
    a: "Absolutely — that's the strongest combo. We migrate SEO equity, preserve URLs and backlinks, and rebuild pages with ranking baked in from day one.",
  },
];

function SeoDigitalMarketingPage() {
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
            <Search className="h-3 w-3" />
            SEO & Local Digital Marketing
          </span>
          <h1
            className="text-5xl font-black leading-[0.95] tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={displayFont}
          >
            Get Found by the Right{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                Customers on Google
              </span>
              <span
                className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
                style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
              />
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            We help businesses rank locally, increase organic traffic, and turn search visibility
            into real enquiries.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-[1.03] sm:w-auto"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative">Get SEO Audit</span>
              <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <StrategyCallButton
              className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-10 py-5 text-sm font-bold text-foreground transition-all hover:border-brand/40 hover:bg-white/[0.08] sm:w-auto"
            >
              Book a Strategy Call
            </StrategyCallButton>
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
            The full SEO stack, handled.
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
                Made for businesses that live on Google.
              </h2>
            </div>
            <div className="font-mono text-sm uppercase tracking-widest text-brand">
              Industries we rank
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
            How SEO Works With SAISPL
          </span>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
            Four steps. Compounding results.
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
              Strategy-led SEO. No guesswork.
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {/* RESULTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <ScrollReveal className="mb-14 md:mb-16">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            What Results Clients Want
          </span>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
            Outcomes we obsess over.
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {results.map((r) => {
            const Icon = r.icon;
            return (
              <StaggerItem key={r.title} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]">
                  <div
                    className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
                  />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-inner transition-all group-hover:border-brand/40 group-hover:from-brand/20">
                    <Icon className="h-5 w-5 text-foreground/90 transition-colors group-hover:text-brand" />
                  </div>
                  <h3 className="relative mt-5 text-base font-bold text-foreground" style={displayFont}>
                    {r.title}
                  </h3>
                  <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {r.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* PRICING PREVIEW */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-14 md:mb-16">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              Pricing Preview
            </span>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
              Simple plans. Real rankings.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Retainer-based SEO with transparent scope. Custom plans on request.
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
            Enterprise and multi-location SEO quoted on request
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
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
      </section>

      <RelatedLinks currentPath="/seo-digital-marketing" />
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
                Free SEO audit — no obligation
              </span>

              <h2
                className="text-4xl font-extrabold leading-[1] tracking-tight text-foreground md:text-6xl"
                style={displayFont}
              >
                Want More Calls and Enquiries{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                    From Google?
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
                  />
                </span>
              </h2>

              <div className="mt-10 flex justify-center">
                <Link
                  to="/contact"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-[1.03]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  <span className="relative">Request SEO Audit</span>
                  <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
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
