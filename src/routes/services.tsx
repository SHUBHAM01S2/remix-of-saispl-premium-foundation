import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code,
  Bot,
  LayoutDashboard,
  PenTool,
  Cloud,
  Headset,
  ArrowUpRight,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const services = [
  {
    icon: Code,
    tag: "Engineering",
    title: "Web & Software Development",
    description:
      "Scalable web apps and custom software engineered for performance, security, and long-term growth.",
    meta: "React · Node · TS",
  },
  {
    icon: Bot,
    tag: "AI · Automation",
    title: "AI Agents & Automation",
    description:
      "Intelligent AI agents and automated workflows that cut costs, remove bottlenecks, and accelerate outcomes.",
    meta: "LLMs · RAG · Agents",
  },
  {
    icon: LayoutDashboard,
    tag: "Platforms",
    title: "Custom Portals & Dashboards",
    description:
      "Tailored dashboards and portals that unify data and give teams real-time operational visibility.",
    meta: "Dashboards · APIs",
  },
  {
    icon: PenTool,
    tag: "Design",
    title: "UI/UX & Product Design",
    description:
      "User-centered design and prototyping that transforms complex ideas into intuitive, high-converting products.",
    meta: "UX · UI · Motion",
  },
  {
    icon: Cloud,
    tag: "Cloud · DevOps",
    title: "Cloud & DevOps",
    description:
      "Reliable cloud infrastructure, CI/CD pipelines, and DevOps practices for seamless, zero-downtime delivery.",
    meta: "AWS · GCP · K8s",
  },
  {
    icon: Headset,
    tag: "Support",
    title: "Ongoing Support & Maintenance",
    description:
      "Proactive monitoring, updates, and dedicated support to keep your systems running smoothly around the clock.",
    meta: "24/7 · SLAs",
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
      { title: "Services — AI Automation & Software Development | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "End-to-end services from Shivaryan Infotech: AI agents & automation, custom web and software development, portals, UI/UX design, cloud & DevOps for startups and enterprises in Himachal Pradesh, India, and worldwide.",
      },
      {
        name: "keywords",
        content:
          "AI automation services, software development company Himachal Pradesh, custom web development, AI agents, cloud DevOps, UI UX design, business automation India, Shivaryan Infotech services",
      },
      { property: "og:title", content: "Services — AI Automation & Software Development | Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "AI automation, custom software, portals, design, and cloud services for global clients — from Himachal Pradesh to the world.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Services — AI Automation & Software Development | Shivaryan Infotech" },
      {
        name: "twitter:description",
        content:
          "AI automation, custom software, portals, design, and cloud services for global clients.",
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
            className="max-w-4xl text-5xl font-black leading-[0.9] tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
            style={displayFont}
          >
            WE BUILD{" "}
            <span className="bg-gradient-to-r from-brand to-indigo-400 bg-clip-text text-transparent">
              DIGITAL
            </span>{" "}
            MOMENTUM.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Transforming complex challenges into seamless digital experiences through
            strategic design and high-performance engineering.
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

      {/* Expressive services grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Large feature card */}
          <StaggerItem className="md:col-span-8">
            <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-brand/50 hover:bg-white/[0.05] md:p-10">
              <div className="relative z-10">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-brand/20 text-brand transition-all group-hover:bg-brand group-hover:text-white">
                  <FeatureIcon className="h-6 w-6" />
                </div>
                <h3
                  className="mb-4 text-3xl font-bold text-foreground md:text-4xl"
                  style={displayFont}
                >
                  {feature.title}
                </h3>
                <p className="mb-8 max-w-md text-lg text-muted-foreground">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {feature.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-brand/10 blur-[100px] transition-all group-hover:bg-brand/20" />
            </div>
          </StaggerItem>

          {/* Vertical card */}
          <StaggerItem className="md:col-span-4">
            <Link
              to="/contact"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-brand/50 hover:bg-white/[0.05] md:p-10"
            >
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-brand/20 text-brand transition-all group-hover:bg-brand group-hover:text-white">
                <VerticalIcon className="h-6 w-6" />
              </div>
              <div>
                <h3
                  className="mb-4 text-2xl font-bold text-foreground"
                  style={displayFont}
                >
                  {vertical.title}
                </h3>
                <p className="text-muted-foreground">{vertical.description}</p>
              </div>
              <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </StaggerItem>

          {/* Remaining cards */}
          {rest.map((svc) => {
            const Icon = svc.icon;
            return (
              <StaggerItem key={svc.title} className="md:col-span-4">
                <Link
                  to="/contact"
                  className="group relative flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-brand/50 hover:bg-white/[0.05]"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground/85 transition-all group-hover:border-brand/40 group-hover:text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3
                    className="mb-2 text-xl font-bold text-foreground"
                    style={displayFont}
                  >
                    {svc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{svc.description}</p>
                  <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
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

          <StaggerContainer className="relative grid grid-cols-1 gap-12 md:grid-cols-4">
            {processSteps.map((s) => (
              <StaggerItem key={s.step} className="group relative">
                <div
                  className="absolute -left-4 -top-8 text-7xl font-black text-white/5 transition-all duration-500 group-hover:text-brand/20"
                  style={displayFont}
                >
                  {s.step}
                </div>
                <div className="relative z-10">
                  <h4 className="mb-4 text-xl font-bold text-foreground transition-colors group-hover:text-brand">
                    {s.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden border-y border-white/10 bg-[#070707] px-6 py-24 md:py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ background: "color-mix(in oklab, var(--color-brand) 8%, transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-block text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
            Ready when you are
          </span>
          <h2
            className="text-5xl font-extrabold leading-[0.95] tracking-tight text-foreground md:text-7xl"
            style={displayFont}
          >
            Ready to elevate{" "}
            <span className="bg-gradient-to-b from-brand to-brand/60 bg-clip-text italic text-transparent">
              your stack
            </span>
            ?
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Book a scoping call and get a tailored plan within 24 hours — no
            pressure, no templates.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-105 sm:w-auto"
            >
              Start a Project
            </Link>
            <Link
              to="/our-works"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-10 py-5 text-sm font-bold text-foreground transition-all hover:border-white/20 hover:bg-white/[0.06] sm:w-auto"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
