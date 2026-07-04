import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bot,
  MessageCircle,
  Zap,
  Workflow,
  Calendar,
  Database,
  Activity,
  ArrowUpRight,
  Check,
  Sparkles,
  Plus,
  Minus,
  Stethoscope,
  GraduationCap,
  Home,
  Hotel,
  Store,
  Search,
  PlugZap,
  Rocket,
  Target,
  Layers,
  Timer,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  BellRing,
  Headphones,
  GitBranch,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { StrategyCallButton } from "@/components/StrategyCallButton";

const displayFont = { fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" };

export const Route = createFileRoute("/automation-ai-services")({
  head: () => ({
    meta: [
      { title: "WhatsApp & AI Automation — SAISPL" },
      {
        name: "description",
        content:
          "Automate responses, capture leads, and close faster. WhatsApp routing, AI chat assistants, booking flows, CRM sync, and n8n workflows built by SAISPL.",
      },
      {
        name: "keywords",
        content:
          "WhatsApp automation, AI chatbot, n8n workflows, lead automation, CRM automation, booking automation, business automation, Shivaryan Infotech, SAISPL",
      },
      { property: "og:title", content: "WhatsApp & AI Automation — SAISPL" },
      {
        property: "og:description",
        content:
          "Connect your website with WhatsApp, AI chat, and automated workflows so no lead gets missed.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/automation-ai-services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "WhatsApp & AI Automation — SAISPL" },
    ],
    links: [{ rel: "canonical", href: "/automation-ai-services" }],
  }),
  component: AutomationAiServicesPage,
});

const included = [
  { icon: MessageCircle, title: "WhatsApp Lead Routing", desc: "Every enquiry lands in the right rep's WhatsApp instantly — no missed messages, no manual triage." },
  { icon: Zap, title: "Auto-Replies for Enquiries", desc: "Personalized instant replies on forms, WhatsApp, and chat so leads never wait." },
  { icon: Bot, title: "AI Website Chat Assistant", desc: "A trained AI agent that answers FAQs, qualifies leads, and hands off to your team." },
  { icon: Calendar, title: "Booking & Calendar Flows", desc: "Self-serve appointments, demos, and consultations synced to your calendar." },
  { icon: Database, title: "CRM Sync & Follow-Up Logic", desc: "Leads written to your CRM with tags, stages, and automated nurture sequences." },
  { icon: Activity, title: "KPI Dashboard & Monitoring", desc: "Live view of response time, conversion, and automation health — always transparent." },
];

const audience = [
  { icon: Stethoscope, label: "Clinics & Appointments" },
  { icon: GraduationCap, label: "Schools & Admissions" },
  { icon: Home, label: "Real Estate Teams" },
  { icon: Hotel, label: "Hotels & Bookings" },
  { icon: Store, label: "Service Businesses" },
  { icon: Headphones, label: "High-Volume Support" },
];

const useCases = [
  { icon: GraduationCap, title: "Admission Enquiry Automation", desc: "Route parent enquiries, send brochures, and book counselor calls automatically." },
  { icon: Calendar, title: "Appointment Booking Automation", desc: "Patients or clients self-book slots — synced to calendars with reminders." },
  { icon: UserCheck, title: "Lead Qualification", desc: "AI asks the right questions and scores leads before they hit your sales team." },
  { icon: HelpCircle, title: "FAQ Automation", desc: "Deflect repetitive questions with a trained assistant, freeing up your team." },
  { icon: BellRing, title: "Follow-Up Reminders", desc: "Automated WhatsApp and email nudges keep deals warm without manual work." },
  { icon: Headphones, title: "Customer Support Workflows", desc: "Ticket routing, status updates, and escalations handled end-to-end." },
];

const process = [
  { step: "01", icon: Search, title: "Understand Current Workflow", desc: "We map how leads, enquiries, and support flow today — and where they leak." },
  { step: "02", icon: PlugZap, title: "Connect Forms, WhatsApp & CRM", desc: "APIs, webhooks, and integrations wired between your existing tools." },
  { step: "03", icon: Workflow, title: "Build Automation Flows", desc: "n8n / native automations built for your logic — triggers, branches, fallbacks." },
  { step: "04", icon: Rocket, title: "Test, Launch & Monitor", desc: "QA end-to-end, ship live, and monitor with dashboards + alerts." },
];

const why = [
  { icon: GitBranch, title: "Strong n8n & Workflow Expertise", desc: "Deep hands-on n8n, Make, and custom API automations — not template drag-and-drop." },
  { icon: Layers, title: "Website + WhatsApp + CRM in One", desc: "One partner owning the full lead loop — site, chat, WhatsApp, CRM, dashboards." },
  { icon: Timer, title: "Faster Response Times", desc: "First-response measured in seconds, not hours — the #1 predictor of conversion." },
  { icon: Target, title: "Reduces Missed Leads", desc: "Every form, DM, and call captured, tagged, and routed — nothing falls through cracks." },
  { icon: ShieldCheck, title: "High-Retention Support", desc: "Monitoring, tuning, and iteration months after launch — automations that keep working." },
  { icon: Sparkles, title: "Business-First, Not Buzzwordy", desc: "We ship AI where it earns ROI. Practical automation over shiny demos." },
];

const pricing = [
  {
    name: "WhatsApp Automation Setup",
    tag: "Starter",
    highlight: "Route & reply, done right",
    features: [
      "WhatsApp Business API setup",
      "Lead-routing rules",
      "Auto-reply templates",
      "Form-to-WhatsApp handoff",
      "Basic reporting",
    ],
  },
  {
    name: "AI Chat Agent",
    tag: "Most Popular",
    highlight: "24/7 website AI",
    features: [
      "Trained on your content",
      "Lead qualification flows",
      "Human handoff to WhatsApp",
      "CRM lead logging",
      "Monthly tuning",
    ],
    popular: true,
  },
  {
    name: "Growth + Automation Retainer",
    tag: "Ongoing Ops",
    highlight: "Continuous optimization",
    features: [
      "WhatsApp + AI + CRM stack",
      "Monthly new automations",
      "KPI dashboard & alerts",
      "Response-time SLA",
      "Priority support",
    ],
  },
  {
    name: "Custom CRM / Workflow",
    tag: "Enterprise",
    highlight: "Built to your ops",
    features: [
      "Custom n8n workflows",
      "Multi-system integrations",
      "Role-based dashboards",
      "SLA & escalation logic",
      "Dedicated engineer",
    ],
  },
];

const faqs = [
  {
    q: "Can this work with my current website?",
    a: "Yes. We integrate with WordPress, Shopify, custom sites, and web apps. Most setups need only a small script or webhook — no rebuild required.",
  },
  {
    q: "Do I need WhatsApp Business API?",
    a: "For serious automation, yes — and we handle the full setup: Meta verification, template approvals, and provider configuration (Twilio, Gupshup, or 360dialog).",
  },
  {
    q: "Can it connect with Google Sheets or CRM?",
    a: "Absolutely. We integrate with Google Sheets, HubSpot, Zoho, Salesforce, Notion, Airtable, and custom databases via n8n and native APIs.",
  },
  {
    q: "Do you support after setup?",
    a: "Yes — our retainer plans include monitoring, tuning, new automations, and priority fixes. Automations need care; we don't ship and disappear.",
  },
  {
    q: "Can this be customized for my business type?",
    a: "Every workflow is built to your logic — clinic booking rules differ from real estate follow-ups. We start with your process, not a template.",
  },
];

function AutomationAiServicesPage() {
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
            <Bot className="h-3 w-3" />
            WhatsApp & AI Automation
          </span>
          <h1
            className="text-5xl font-black leading-[0.95] tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={displayFont}
          >
            Automate Responses, Capture Leads,{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                Close Faster
              </span>
              <span
                className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
                style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
              />
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            We connect your website with WhatsApp, AI chat, and automated workflows so no lead
            gets missed.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <StrategyCallButton
              ariaLabel="Book automation demo"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-[1.03] sm:w-auto"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative">Book Automation Demo</span>
              <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </StrategyCallButton>
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-10 py-5 text-sm font-bold text-foreground transition-all hover:border-brand/40 hover:bg-white/[0.08] sm:w-auto"
            >
              Talk to an Expert
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
            Your full automation stack.
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
                Built for teams drowning in enquiries.
              </h2>
            </div>
            <div className="font-mono text-sm uppercase tracking-widest text-brand">
              Industries we automate
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

      {/* USE CASES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <ScrollReveal className="mb-14 md:mb-16">
          <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Use Cases
          </span>
          <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
            Real workflows we ship every week.
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => {
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

      {/* HOW IT WORKS */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-14 md:mb-16">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              How It Works
            </span>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
              From workflow map to live automation.
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
            Automation engineers, not template installers.
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

      {/* PRICING PREVIEW */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-14 md:mb-16">
            <span className="mb-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              Pricing Preview
            </span>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl" style={displayFont}>
              Plans that scale with your ops.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Transparent packages built around real outcomes. Custom scopes on request.
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
            Custom workflows and enterprise integrations quoted on request
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
                Free demo — no obligation
              </span>

              <h2
                className="text-4xl font-extrabold leading-[1] tracking-tight text-foreground md:text-6xl"
                style={displayFont}
              >
                Want Your Website to Respond{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                    Even When You're Offline?
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
                  />
                </span>
              </h2>

              <div className="mt-10 flex justify-center">
                <StrategyCallButton
                  ariaLabel="Schedule automation demo"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-[1.03]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  <span className="relative">Schedule Automation Demo</span>
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
