import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Globe,
  Search,
  Bot,
  LayoutDashboard,
  Palette,
  LifeBuoy,
  ArrowUpRight,
  Check,
  Sparkles,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const services = [
  {
    num: "01",
    icon: Globe,
    tag: "Websites",
    title: "Website Design & Development",
    to: "/web-design-development",
    description:
      "Custom business websites built for speed, trust, SEO readiness, and lead generation.",
    features: [
      "Responsive & mobile-first builds",
      "SEO-ready architecture",
      "CMS or headless setup",
      "Blazing-fast Core Web Vitals",
    ],
    deliverable: "Live site in 3–5 weeks",
    meta: "WEBSITES · SEO · CMS",
  },
  {
    num: "02",
    icon: Search,
    tag: "Marketing",
    title: "SEO & Local Digital Marketing",
    to: "/seo-digital-marketing",
    description:
      "Improve visibility, rankings, and local discovery to generate more qualified enquiries.",
    features: [
      "Technical & on-page SEO",
      "Google Business optimisation",
      "Local citations & backlinks",
      "Monthly performance reports",
    ],
    deliverable: "Rank tracking from week 1",
    meta: "SEO · LOCAL · CONTENT",
  },
  {
    num: "03",
    icon: Bot,
    tag: "Automation",
    title: "WhatsApp & AI Automation",
    to: "/automation-ai-services",
    description:
      "Automate lead capture, responses, follow-ups, and customer workflows with smart systems.",
    features: [
      "WhatsApp Business API setup",
      "AI chatbots & auto-replies",
      "CRM & lead sync",
      "Drip follow-up sequences",
    ],
    deliverable: "Save 20+ hrs / week",
    meta: "WHATSAPP · AI · WORKFLOWS",
  },
  {
    num: "04",
    icon: LayoutDashboard,
    tag: "Software",
    title: "Custom Portals & Software",
    to: "/custom-portals-software",
    description:
      "Tailored portals, dashboards, and workflow tools built around your business operations.",
    features: [
      "Admin & client dashboards",
      "Role-based access control",
      "API & 3rd-party integrations",
      "Scalable cloud hosting",
    ],
    deliverable: "MVP in 4–6 weeks",
    meta: "PORTALS · DASHBOARDS · APIS",
  },
  {
    num: "05",
    icon: Palette,
    tag: "Design",
    title: "Branding & Graphic Design",
    to: "/branding-graphic-design",
    description:
      "Professional brand identity, creatives, and design assets that strengthen credibility.",
    features: [
      "Logo & visual identity",
      "Brand guidelines",
      "Social & ad creatives",
      "Pitch decks & brochures",
    ],
    deliverable: "Full brand kit delivered",
    meta: "LOGO · BRANDING · CREATIVES",
  },
  {
    num: "06",
    icon: LifeBuoy,
    tag: "Support",
    title: "Website Maintenance & Support",
    to: "/care-maintenance",
    description:
      "Ongoing updates, security, monitoring, and improvements to keep your website performing reliably.",
    features: [
      "24/7 uptime monitoring",
      "Security patches & backups",
      "Content & design updates",
      "Priority support SLA",
    ],
    deliverable: "Avg. response < 2 hrs",
    meta: "SUPPORT · UPDATES · SECURITY",
  },
];



const processSteps = [
  {
    step: "01",
    title: "Discovery & Consultation",
    description:
      "We dive deep into your goals, challenges, and users to shape a clear roadmap before a single line of code is written.",
  },
  {
    step: "02",
    title: "Design & Prototyping",
    description:
      "Wireframes and interactive prototypes bring ideas to life early, so we can refine the experience together.",
  },
  {
    step: "03",
    title: "Development & Testing",
    description:
      "Clean, scalable engineering with rigorous QA ensures your product is fast, secure, and built to last.",
  },
  {
    step: "04",
    title: "Launch & Support",
    description:
      "Smooth deployment followed by proactive monitoring and ongoing support to keep you ahead.",
  },
];

const stats = [
  { value: "98%", label: "Client Retention" },
  { value: "120+", label: "Projects Delivered" },
  { value: "15ms", label: "Average Latency" },
  { value: "24/7", label: "Support Coverage" },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Websites, SEO, Automation & Software | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "SAISPL services: website design & development, SEO & local digital marketing, WhatsApp & AI automation, custom portals & software, branding & graphic design, and website maintenance & support.",
      },
      {
        name: "keywords",
        content:
          "website design and development, SEO services, local digital marketing, WhatsApp automation, AI automation, custom portals, business software, branding, graphic design, website maintenance, Shivaryan Infotech services, SAISPL",
      },
      { property: "og:title", content: "Services — Websites, SEO, Automation & Software | Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Websites, SEO, WhatsApp & AI automation, custom portals, branding, and website maintenance — built by SAISPL for growing businesses.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Services — Websites, SEO, Automation & Software | Shivaryan Infotech" },
      {
        name: "twitter:description",
        content:
          "Websites, SEO, WhatsApp & AI automation, custom portals, branding, and maintenance — by SAISPL.",
      },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),

  component: Services,
});

const displayFont = { fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" };

function Services() {
  return (
    <div className="bg-background text-zinc-400 selection:bg-brand/30 selection:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--color-brand)_10%,transparent),transparent_55%)]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right,#121212 1px,transparent 1px),linear-gradient(to bottom,#121212 1px,transparent 1px)",
            backgroundSize: "4rem 4rem",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
          }}
        />
        <ScrollReveal className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="mb-6 block text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            Our Services
          </span>
          <h1
            className="max-w-5xl text-5xl font-black leading-[0.9] tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={displayFont}
          >
            SERVICES BUILT FOR{" "}
            <span className="bg-gradient-to-r from-brand to-indigo-400 bg-clip-text text-transparent">
              GROWTH, VISIBILITY,
            </span>{" "}
            AND AUTOMATION.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            From websites and SEO to WhatsApp automation, portals, branding, and
            maintenance—we help businesses build digital systems that attract leads
            and support long-term growth.
          </p>
        </ScrollReveal>
      </section>

      {/* Stats strip */}
      <div className="border-y border-white/5 bg-white/[0.02] py-10 md:py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="text-3xl font-bold text-foreground" style={displayFont}>
                {s.value}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-zinc-600">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services grid — homepage style */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <StaggerItem key={svc.title} className="h-full">
                <Link
                  to="/contact"
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]"
                >
                  {/* hover glow */}
                  <div
                    className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
                  />
                  {/* subtle grid overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                      maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
                      WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
                    }}
                  />
                  {/* giant background number */}
                  <div
                    className="pointer-events-none absolute -right-2 -bottom-6 select-none text-[8rem] font-black leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-brand/10"
                    style={displayFont}
                  >
                    {svc.num}
                  </div>

                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-brand" />
                      {svc.tag}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-zinc-600">
                      {svc.num}
                    </span>
                  </div>

                  <div className="relative mt-8 flex items-center gap-4">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-inner transition-all duration-500 group-hover:border-brand/40 group-hover:from-brand/20">
                      <Icon className="h-6 w-6 text-foreground/90 transition-colors group-hover:text-brand" />
                      <span className="absolute inset-0 rounded-2xl opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" style={{ background: "color-mix(in oklab, var(--color-brand) 30%, transparent)" }} />
                    </div>
                    <ArrowUpRight className="ml-auto h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" />
                  </div>

                  <h3 className="relative mt-6 text-xl font-bold leading-tight text-foreground" style={displayFont}>
                    {svc.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {svc.description}
                  </p>

                  <ul className="relative mt-5 space-y-2">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
                        <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10">
                          <Check className="h-2.5 w-2.5 text-brand" strokeWidth={3} />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-6 flex-1" />

                  <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand">
                      <Sparkles className="h-3 w-3" />
                      {svc.deliverable}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                      {svc.meta.split(" · ")[0]}
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>


      {/* Process timeline */}
      <section className="border-y border-white/5 bg-white/[0.01] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end md:mb-20">
            <div>
              <h2
                className="mb-4 text-4xl font-black tracking-tight text-foreground md:text-5xl"
                style={displayFont}
              >
                HOW WE WORK
              </h2>
              <p className="max-w-md text-muted-foreground">
                A methodical approach to excellence, refined over hundreds of successful deployments.
              </p>
            </div>
            <div className="hidden h-[2px] flex-grow bg-white/10 md:mx-8 md:block" />
            <div className="font-mono text-sm uppercase tracking-widest text-brand">
              Four stages of success
            </div>
          </ScrollReveal>

          <StaggerContainer className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <StaggerItem key={s.step} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]">
                  {/* hover glow */}
                  <div
                    className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
                  />
                  {/* giant background number */}
                  <div
                    className="pointer-events-none absolute -right-2 -bottom-8 select-none text-[9rem] font-black leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-brand/10"
                    style={displayFont}
                  >
                    {s.step}
                  </div>

                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-brand" />
                      Step {s.step}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-zinc-600">
                      0{i + 1}/0{processSteps.length}
                    </span>
                  </div>

                  <div className="relative mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-inner transition-all duration-500 group-hover:border-brand/40 group-hover:from-brand/20">
                    <span className="font-mono text-lg font-bold text-foreground/90 transition-colors group-hover:text-brand" style={displayFont}>
                      {s.step}
                    </span>
                  </div>

                  <h4 className="relative mt-6 text-xl font-bold leading-tight text-foreground" style={displayFont}>
                    {s.title}
                  </h4>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>

                  <div className="relative mt-6 flex-1" />

                  <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                      Phase {s.step}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-brand transition-all duration-500 group-hover:shadow-[0_0_12px_2px_color-mix(in_oklab,var(--color-brand)_60%,transparent)]" />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA band — premium */}
      <section className="relative overflow-hidden border-y border-white/10 bg-[#050505] px-6 py-24 md:py-32">
        {/* aurora glow */}
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
        {/* grid */}
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
            {/* corner accents */}
            <div className="pointer-events-none absolute left-6 top-6 h-6 w-6 border-l-2 border-t-2 border-brand/50" />
            <div className="pointer-events-none absolute right-6 top-6 h-6 w-6 border-r-2 border-t-2 border-brand/50" />
            <div className="pointer-events-none absolute bottom-6 left-6 h-6 w-6 border-b-2 border-l-2 border-brand/50" />
            <div className="pointer-events-none absolute bottom-6 right-6 h-6 w-6 border-b-2 border-r-2 border-brand/50" />

            <div className="relative text-center">
              {/* live pill */}
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                Now booking — Q3 slots open
              </span>

              <h2
                className="text-5xl font-extrabold leading-[0.95] tracking-tight text-foreground md:text-7xl"
                style={displayFont}
              >
                Ready to elevate{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-b from-brand via-brand to-indigo-400 bg-clip-text italic text-transparent">
                    your stack
                  </span>
                  <span className="pointer-events-none absolute inset-0 -z-10 blur-2xl" style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }} />
                </span>
                ?
              </h2>

              <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Book a scoping call and get a tailored plan within 24 hours — no
                pressure, no templates.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/contact"
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-[1.03] sm:w-auto"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  <span className="relative">Start a Project</span>
                  <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/our-works"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-10 py-5 text-sm font-bold text-foreground transition-all hover:border-brand/40 hover:bg-white/[0.08] sm:w-auto"
                >
                  View Portfolio
                </Link>
              </div>

              {/* trust strip */}
              <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 md:grid-cols-4">
                {[
                  { v: "24h", l: "Response time" },
                  { v: "120+", l: "Projects shipped" },
                  { v: "12+", l: "Countries served" },
                  { v: "98%", l: "Client retention" },
                ].map((t) => (
                  <div key={t.l} className="text-center">
                    <div className="text-2xl font-bold text-foreground md:text-3xl" style={displayFont}>
                      {t.v}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
                      {t.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
