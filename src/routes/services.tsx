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

      {/* Services grid — homepage style */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <StaggerItem key={svc.title} className="h-full">
                <Link
                  to="/contact"
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  <div
                    className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {svc.tag}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>

                  <div className="relative mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-inner">
                    <Icon className="h-6 w-6 text-foreground/85" />
                  </div>

                  <h3 className="relative mt-6 text-lg font-semibold text-foreground" style={displayFont}>
                    {svc.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {svc.description}
                  </p>

                  <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <span>{svc.meta}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
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
