import { createFileRoute, Link } from "@tanstack/react-router";
import { RelatedLinks } from "@/components/RelatedLinks";
import { useState } from "react";
import {
  Palette,
  Type,
  Instagram,
  FileText,
  Globe,
  Megaphone,
  ArrowUpRight,
  Check,
  Sparkles,
  Plus,
  Minus,
  Rocket,
  RefreshCw,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Store,
  Tag,
  Feather,
  Layers,
  Eye,
  Compass,
  Wand2,
  PenTool,
  BookOpen,
  Presentation,
  Image as ImageIcon,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const displayFont = { fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" };

export const Route = createFileRoute("/branding-graphic-design")({
  head: () => ({
    meta: [
      { title: "Branding { title: "Branding & Graphic Design Services in India | SAISPL" } Graphic Design | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Logos, brand identity systems, and social/print creatives that make your business look premium. Book a free branding consultation with SAISPL today.",
      },
      {
        name: "keywords",
        content:
          "branding India, logo design, brand identity, graphic design, social media kit, brand guidelines, Shivaryan Infotech, SAISPL",
      },
      { property: "og:title", content: "Branding & Graphic Design Services in India | SAISPL" },
      {
        property: "og:description",
        content:
          "Logos, identity systems, and social creatives that make your brand look premium. Book a free consultation today.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/branding-graphic-design" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Branding & Graphic Design Services in India | SAISPL" },
    ],
    links: [{ rel: "canonical", href: "/branding-graphic-design" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Branding & Graphic Design",
          serviceType: "Graphic Design",
          provider: { "@id": "https://shivaryaninfotech.com/#organization" },
          areaServed: [
            { "@type": "AdministrativeArea", name: "Himachal Pradesh" },
            { "@type": "Country", name: "India" },
          ],
          url: "/branding-graphic-design",
          description:
            "Logo design, brand identity, social media kits, and print-ready creatives.",
        }),
      },
    ],
  }),

  component: BrandingGraphicDesignPage,
});

const included = [
  { icon: PenTool, title: "Logo Design", desc: "Custom marks, wordmarks, and monograms crafted to be distinctive, scalable, and timeless." },
  { icon: Palette, title: "Brand Colors & Typography", desc: "A cohesive palette and type system engineered for contrast, legibility, and personality." },
  { icon: Instagram, title: "Social Media Kit", desc: "Editable templates for posts, stories, reels covers, and highlights — plug-and-play consistency." },
  { icon: FileText, title: "Business Cards & Brochures", desc: "Print-ready stationery, brochures, and menu design with premium finishes in mind." },
  { icon: Globe, title: "Website Brand Alignment", desc: "Design tokens, hero visuals, and component styling that carry your identity onto the web." },
  { icon: Megaphone, title: "Campaign Graphics & Banners", desc: "Launch creatives, ad banners, and seasonal campaign kits — ready across every channel." },
];

const audience = [
  { icon: Rocket, label: "New Businesses" },
  { icon: RefreshCw, label: "Rebranding" },
  { icon: Stethoscope, label: "Clinics & Schools" },
  { icon: Briefcase, label: "Service Brands" },
  { icon: Store, label: "Local Businesses" },
  { icon: Tag, label: "New Offer Launches" },
];

const deliverables = [
  { icon: Feather, title: "Logo Concepts", desc: "2–4 unique directions crafted from your brief, presented in real-world mockups." },
  { icon: Palette, title: "Color Palette", desc: "Primary, secondary, and neutral system with HEX / RGB / CMYK values." },
  { icon: Type, title: "Font System", desc: "Display + body pairing with usage rules across web, print, and social." },
  { icon: Instagram, title: "Social Post Templates", desc: "Editable Canva / Figma templates for posts, stories, and carousels." },
  { icon: Presentation, title: "Presentation & Brochure Assets", desc: "Branded deck template, brochure layouts, and letterhead ready to use." },
  { icon: BookOpen, title: "Brand Guidelines PDF", desc: "A concise guideline document — logo usage, spacing, color, and do's/don'ts." },
];

const process = [
  { step: "01", icon: Compass, title: "Brand Discovery", desc: "We understand your audience, positioning, and competitors — the strategy behind the visuals." },
  { step: "02", icon: Layers, title: "Moodboard & Direction", desc: "Visual references, tone-of-voice, and 2–3 stylistic directions to align before we design." },
  { step: "03", icon: Wand2, title: "Concept Design", desc: "Logo concepts, palette, type system, and hero applications presented in polished mockups." },
  { step: "04", icon: Eye, title: "Revisions & Final Delivery", desc: "Two rounds of refinement, then final files — vector, raster, and source, all organized." },
];

const why = [
  { icon: Globe, title: "Aligned With Web & Marketing", desc: "Branding built by the same team that handles your website and campaigns — one system, everywhere." },
  { icon: Layers, title: "Consistency Across Channels", desc: "One brand voice across Instagram, print, decks, and the site — nothing feels off-brand." },
  { icon: Sparkles, title: "Look Premium & Trustworthy", desc: "Design that earns credibility on first impression — the visual quality of a much bigger company." },
  { icon: ImageIcon, title: "Bundle-Ready", desc: "Effortless plug-in with our website packages — brand and site launch together, in sync." },
];

const palette = [
  { name: "Ink", hex: "#050505" },
  { name: "Signal", hex: "#3B82F6" },
  { name: "Halo", hex: "#93C5FD" },
  { name: "Fog", hex: "#E4E4E7" },
  { name: "Ember", hex: "#F59E0B" },
];

const pricing = [
  {
    name: "Logo Only",
    tag: "Starter",
    highlight: "Just the mark, done right",
    features: [
      "2 unique concepts",
      "2 revision rounds",
      "Final vector files (AI, SVG)",
      "Raster exports (PNG, JPG)",
      "Basic usage sheet",
    ],
  },
  {
    name: "Basic Branding Kit",
    tag: "Popular",
    highlight: "Everything to launch",
    features: [
      "Logo + variations",
      "Color palette & typography",
      "Business card design",
      "5 social post templates",
      "Mini brand guideline",
    ],
    popular: true,
  },
  {
    name: "Full Brand System",
    tag: "Complete",
    highlight: "A full identity system",
    features: [
      "Full logo suite",
      "Complete visual system",
      "Stationery + brochure",
      "12+ social templates",
      "Full brand guideline PDF",
    ],
  },
  {
    name: "Branding + Website",
    tag: "Bundle",
    highlight: "Brand & site, together",
    features: [
      "Full brand system",
      "Website design & build",
      "Aligned tokens & assets",
      "Launch campaign kit",
      "Priority delivery",
    ],
  },
];

const faqs = [
  {
    q: "How many logo concepts do you provide?",
    a: "Depending on the package, 2 to 4 unique concept directions — each fully explored, not just color swaps. You'll see them applied in real mockups so you can judge how the mark actually lives in the world.",
  },
  {
    q: "Do you include revisions?",
    a: "Yes. Every package includes two rounds of revisions on the chosen direction. Further rounds are available at a small per-round fee — but two rounds is usually enough to land it.",
  },
  {
    q: "Will I get editable files?",
    a: "Absolutely. You receive vector source files (AI, SVG, PDF), raster exports (PNG, JPG), and editable social templates (Canva / Figma). You own the final identity outright.",
  },
  {
    q: "Can you redesign my current brand?",
    a: "Yes — rebrands are one of our favorite engagements. We start with a discovery call to understand what's working, what isn't, and what you want the new identity to signal.",
  },
  {
    q: "Can branding be bundled with website development?",
    a: "Yes, and it's often the smartest option. Bundling saves time, keeps the visual system perfectly aligned, and unlocks priority delivery on both projects.",
  },
];

function BrandingGraphicDesignPage() {
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
            <Palette className="h-3 w-3" />
            Branding & Graphic Design
          </span>
          <h1
            className="text-5xl font-black leading-[0.95] tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={displayFont}
          >
            Build a Brand That Looks{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                Professional Everywhere
              </span>
              <span
                className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
                style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
              />
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            From logos to brand systems and social creatives, we design visuals that make your
            business look credible and memorable.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-[1.03] sm:w-auto"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative">Get Branding Quote</span>
              <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/our-works"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-10 py-5 text-sm font-bold text-foreground transition-all hover:border-brand/40 hover:bg-white/[0.08] sm:w-auto"
            >
              See Brand Work
            </Link>
          </div>

          {/* Palette strip — signature expressive touch */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            {palette.map((c) => (
              <div
                key={c.name}
                className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-4 transition-all hover:border-brand/40 hover:bg-white/[0.06]"
              >
                <span
                  className="h-6 w-6 rounded-full ring-1 ring-white/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  {c.name} · {c.hex}
                </span>
              </div>
            ))}
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
            A complete visual toolkit for your business.
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
                Brands ready to look the part.
              </h2>
            </div>
            <div className="font-mono text-sm uppercase tracking-widest text-brand">
              Businesses we design for
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

      {/* DELIVERABLES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <ScrollReveal className="mb-14 md:mb-16">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Deliverables
          </span>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
            Exactly what lands in your inbox.
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((u) => {
            const Icon = u.icon;
            return (
              <StaggerItem key={u.title} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]">
                  <div
                    className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
                  />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-inner transition-all group-hover:border-brand/40 group-hover:from-brand/20">
                    <Icon className="h-6 w-6 text-foreground/90 transition-colors group-hover:text-brand" />
                  </div>
                  <h3 className="relative mt-6 text-lg font-bold text-foreground" style={displayFont}>
                    {u.title}
                  </h3>
                  <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {u.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* PROCESS */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-14 md:mb-16">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              Process
            </span>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
              A four-step path from brief to brand.
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
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <ScrollReveal className="mb-14 md:mb-16">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Why Choose SAISPL
          </span>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
            A design partner, wired into your growth.
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
      </section>

      {/* PRICING */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-14 md:mb-16">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              Pricing Preview
            </span>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
              Pick the depth that fits your stage.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Transparent packages — every tier ships with editable source files and clean handover.
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
            Custom rebrands and large systems quoted on request
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

      <RelatedLinks currentPath="/branding-graphic-design" />
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
                Free brand discovery call — no obligation
              </span>

              <h2
                className="text-4xl font-extrabold leading-[1] tracking-tight text-foreground md:text-6xl"
                style={displayFont}
              >
                Need Your Business to Look as Strong as{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                    the Service You Provide?
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
                  <span className="relative">Request Branding Quote</span>
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
