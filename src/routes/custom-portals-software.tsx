import { createFileRoute, Link } from "@tanstack/react-router";
import { RelatedLinks } from "@/components/RelatedLinks";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Database,
  BarChart3,
  Plug,
  ShieldCheck,
  ArrowUpRight,
  Check,
  Sparkles,
  Plus,
  Minus,
  GraduationCap,
  Stethoscope,
  Droplet,
  Home,
  Building2,
  Table2,
  Search,
  PenTool,
  Code2,
  Rocket,
  Target,
  Layers,
  Wrench,
  Compass,
  Boxes,
  UserCog,
  FileBarChart,
  Calendar,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { StrategyCallButton } from "@/components/StrategyCallButton";

const displayFont = { fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" };

export const Route = createFileRoute("/custom-portals-software")({
  head: () => ({
    meta: [
      { title: "Custom Portals & Software | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Custom portals, admin dashboards, and business software built around your workflow. Book a free discovery call with SAISPL today.",
      },
      {
        name: "keywords",
        content:
          "custom software India, business portals, admin dashboards, internal systems, role-based portals, custom development, Shivaryan Infotech, SAISPL",
      },
      { property: "og:title", content: "Custom Portals & Business Software Development | SAISPL" },
      {
        property: "og:description",
        content:
          "Secure, role-based portals and dashboards built around your process. Book a free discovery call today.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/custom-portals-software" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Custom Portals & Business Software Development | SAISPL" },
    ],
    links: [{ rel: "canonical", href: "/custom-portals-software" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Custom Portals & Software Development",
          serviceType: "Custom Software Development",
          provider: { "@id": "https://shivaryaninfotech.com/#organization" },
          areaServed: [
            { "@type": "AdministrativeArea", name: "Himachal Pradesh" },
            { "@type": "Country", name: "India" },
          ],
          url: "/custom-portals-software",
          description:
            "Admin dashboards, role-based portals, database-driven systems, reporting, and API integrations.",
        }),
      },
    ],
  }),

  component: CustomPortalsSoftwarePage,
});

const included = [
  { icon: LayoutDashboard, title: "Admin Dashboards", desc: "Clean, high-density admin panels engineered for speed, filtering, and daily operational use." },
  { icon: Users, title: "Role-Based Portals", desc: "Granular roles and permissions — admins, managers, staff, and clients each see the right view." },
  { icon: Database, title: "Database-Driven Systems", desc: "Postgres / MySQL / Supabase back-ends structured for scale, integrity, and reporting." },
  { icon: BarChart3, title: "Reporting Modules", desc: "Charts, exports, and scheduled reports that turn raw data into board-ready insights." },
  { icon: Plug, title: "API Integrations", desc: "Payments, WhatsApp, SMS, ERPs, and third-party APIs wired into your workflows." },
  { icon: ShieldCheck, title: "Secure Business Workflows", desc: "Auth, audit logs, RLS, encrypted secrets — enterprise-grade security by default." },
];

const audience = [
  { icon: GraduationCap, label: "Schools & Institutions" },
  { icon: Stethoscope, label: "Clinics & Healthcare" },
  { icon: Droplet, label: "Blood Bank & Donor Systems" },
  { icon: Home, label: "Real Estate Businesses" },
  { icon: Building2, label: "Internal Business Teams" },
  { icon: Table2, label: "Outgrowing Spreadsheets" },
];

const solutions = [
  { icon: GraduationCap, title: "School Management Portal", desc: "Admissions, attendance, fees, timetables, staff, and parent portals — one login for every role." },
  { icon: Droplet, title: "Blood Bank Management System", desc: "Donor registry, inventory, requests, camps, and hospital coordination with real-time visibility." },
  { icon: Home, title: "Real Estate Lead Dashboard", desc: "Leads, listings, site visits, agent assignments, and pipeline reporting in one operations hub." },
  { icon: Calendar, title: "Booking Management Backend", desc: "Slots, staff, payments, cancellations, and calendar sync for clinics, salons, and services." },
  { icon: UserCog, title: "HR / Team Tracking Panel", desc: "Attendance, leaves, tasks, payroll inputs, and performance — a lightweight internal HR stack." },
  { icon: FileBarChart, title: "Client Reporting Portal", desc: "Branded dashboards for your clients to see progress, deliverables, and KPIs on demand." },
];

const process = [
  { step: "01", icon: Search, title: "Requirement Discovery", desc: "Stakeholder interviews, workflow mapping, and success metrics before a single line of code." },
  { step: "02", icon: PenTool, title: "Scope & Wireframes", desc: "Priority-ranked scope with wireframes, data models, and role matrix signed off by you." },
  { step: "03", icon: Code2, title: "Backend + Frontend Build", desc: "Modern stack — React / TanStack + Postgres — built in sprints with weekly demos." },
  { step: "04", icon: Rocket, title: "Testing, Launch & Training", desc: "QA, staged rollout, live launch, and hands-on training for admins and end users." },
];

const why = [
  { icon: Compass, title: "Product-Focused Thinking", desc: "We think like product owners — solving business problems, not just shipping tickets." },
  { icon: Layers, title: "Full-Stack UI + Backend", desc: "One team owning UX, APIs, database, and infra — no integration ping-pong." },
  { icon: Wrench, title: "Built for Long-Term Upgrades", desc: "Clean architecture, versioned APIs, and modular code that stays maintainable as you grow." },
  { icon: Target, title: "Operational Digital Transformation", desc: "We replace spreadsheets, WhatsApp chaos, and manual ops with reliable systems." },
  { icon: ShieldCheck, title: "Enterprise-Grade Security", desc: "RLS, RBAC, encrypted secrets, audit trails, and secure hosting on Cloudflare / Supabase." },
  { icon: Boxes, title: "Modular & Scalable", desc: "Start with an MVP, add modules over quarters — architecture that scales with headcount." },
];

const pricing = [
  {
    name: "Discovery Workshop",
    tag: "Start Here",
    highlight: "Clarity before code",
    features: [
      "Stakeholder interviews",
      "Workflow mapping",
      "Wireframes & data model",
      "Scope document",
      "Fixed-fee estimate",
    ],
  },
  {
    name: "MVP Development",
    tag: "Most Popular",
    highlight: "Ship the core in weeks",
    features: [
      "Core user flows",
      "Admin + role-based access",
      "Database & APIs",
      "Auth & security baseline",
      "Launch to real users",
    ],
    popular: true,
  },
  {
    name: "Full Implementation",
    tag: "Production",
    highlight: "Complete rollout",
    features: [
      "All modules & reports",
      "Third-party integrations",
      "Data migration",
      "Team training",
      "Hardened for production",
    ],
  },
  {
    name: "Monthly Support & Enhancement",
    tag: "Retainer",
    highlight: "Keeps evolving with you",
    features: [
      "Dedicated engineering hours",
      "New features quarterly",
      "Monitoring & security patches",
      "SLA-backed support",
      "Product roadmap reviews",
    ],
  },
];

const faqs = [
  {
    q: "How do you estimate software cost?",
    a: "We start with a paid Discovery Workshop that produces wireframes, a data model, and a scoped roadmap. From there we quote a fixed-fee MVP or a sprint-based build — no vague hourly bills.",
  },
  {
    q: "Can you build an MVP first?",
    a: "Yes — and we recommend it. We ship the highest-value core in 6–10 weeks, launch to real users, then expand modules based on feedback and priority.",
  },
  {
    q: "Do you provide admin panels?",
    a: "Every portal we build includes a full admin panel — CRUD, role management, reports, and audit logs — so your team owns operations without engineering help.",
  },
  {
    q: "Will my team get training?",
    a: "Yes. Launch always includes admin and end-user training, recorded walkthroughs, and written documentation your team can refer back to.",
  },
  {
    q: "Do you maintain the system after launch?",
    a: "Yes — our monthly support & enhancement retainer covers hosting, monitoring, security patches, new features, and priority fixes. Custom systems need care; we don't ship and disappear.",
  },
];

function CustomPortalsSoftwarePage() {
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
            <LayoutDashboard className="h-3 w-3" />
            Custom Portals & Software
          </span>
          <h1
            className="text-5xl font-black leading-[0.95] tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={displayFont}
          >
            Custom Portals Built Around{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                Your Workflow
              </span>
              <span
                className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
                style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
              />
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            We develop secure portals, dashboards, and internal systems that match your exact
            business process.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-[1.03] sm:w-auto"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative">Discuss Your Project</span>
              <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <StrategyCallButton
              ariaLabel="Get scope estimate"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-10 py-5 text-sm font-bold text-foreground transition-all hover:border-brand/40 hover:bg-white/[0.08] sm:w-auto"
            >
              Get Scope Estimate
            </StrategyCallButton>
          </div>
        </ScrollReveal>
      </section>

      {/* WHAT WE BUILD */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <ScrollReveal className="mb-14 md:mb-16">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            What We Build
          </span>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
            Full-stack systems, engineered end-to-end.
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
                Teams ready to outgrow spreadsheets.
              </h2>
            </div>
            <div className="font-mono text-sm uppercase tracking-widest text-brand">
              Sectors we build for
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

      {/* POPULAR SOLUTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <ScrollReveal className="mb-14 md:mb-16">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Popular Solutions
          </span>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
            Systems we've shipped before.
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((u) => {
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

      {/* BUILD PROCESS */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-14 md:mb-16">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              Build Process
            </span>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
              From requirement to production.
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
            An engineering partner, not a dev shop.
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
      </section>

      {/* ENGAGEMENT MODEL */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-14 md:mb-16">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              Engagement Model
            </span>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
              Engage the way that fits your stage.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Transparent phases and pricing — start small, scale as value is proven.
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
            Enterprise & compliance-heavy engagements quoted on request
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

      <RelatedLinks currentPath="/custom-portals-software" />
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
                Free scoping call — no obligation
              </span>

              <h2
                className="text-4xl font-extrabold leading-[1] tracking-tight text-foreground md:text-6xl"
                style={displayFont}
              >
                Need Software That Fits Your Business,{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                    Not the Other Way Around?
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
                  <span className="relative">Start Project Discussion</span>
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
