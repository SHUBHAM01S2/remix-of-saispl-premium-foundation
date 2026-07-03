import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code,
  Bot,
  LayoutDashboard,
  PenTool,
  Cloud,
  Headset,
  ArrowRight,
  ArrowUpRight,
  Search,
  Layers,
  Wrench,
  Rocket,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const services = [
  {
    icon: Code,
    tag: "Engineering",
    title: "Web & Software Development",
    description:
      "Scalable web apps and custom software built with modern stacks to power your business growth.",
    meta: "React · Node · TS",
  },
  {
    icon: Bot,
    tag: "AI · Automation",
    title: "AI Agents & Automation",
    description:
      "Intelligent AI agents and automated workflows that reduce costs and accelerate outcomes.",
    meta: "LLMs · RAG · Agents",
  },
  {
    icon: LayoutDashboard,
    tag: "Platforms",
    title: "Custom Portals & Dashboards",
    description:
      "Tailored dashboards and portals that unify data and give teams real-time visibility.",
    meta: "Dashboards · APIs",
  },
  {
    icon: PenTool,
    tag: "Design",
    title: "UI/UX & Product Design",
    description:
      "User-centered design and prototyping that transforms ideas into intuitive digital products.",
    meta: "UX · UI · Motion",
  },
  {
    icon: Cloud,
    tag: "Infrastructure",
    title: "Cloud & DevOps",
    description:
      "Reliable cloud infrastructure, CI/CD pipelines, and DevOps practices for seamless delivery.",
    meta: "AWS · CI/CD · K8s",
  },
  {
    icon: Headset,
    tag: "Support",
    title: "Ongoing Support & Maintenance",
    description:
      "Proactive monitoring, updates, and dedicated support to keep your systems running smoothly.",
    meta: "24/7 · SLAs",
  },
];


const processSteps = [
  {
    step: "01",
    icon: Search,
    title: "Discovery & Consultation",
    description:
      "We dive deep into your goals, challenges, and users to shape a clear roadmap before a single line of code is written.",
  },
  {
    step: "02",
    icon: Layers,
    title: "Design & Prototyping",
    description:
      "Wireframes and interactive prototypes bring ideas to life early, so we can refine the experience together.",
  },
  {
    step: "03",
    icon: Wrench,
    title: "Development & Testing",
    description:
      "Clean, scalable engineering with rigorous QA ensures your product is fast, secure, and built to last.",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Launch & Support",
    description:
      "Smooth deployment followed by proactive monitoring and ongoing support to keep you ahead.",
  },
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

function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our <span className="text-brand">Services</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            End-to-end digital and AI solutions tailored to modernize,
            automate, and scale your business.
          </p>
        </ScrollReveal>
      </section>

      {/* Service Cards */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <StaggerItem key={svc.title} className="h-full">
                  <Link
                    to="/contact"
                    className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
                  >
                    {/* glow */}
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

                    <h3 className="relative mt-6 text-lg font-semibold text-foreground">
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
        </div>
      </section>

      {/* Process Timeline */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How We <span className="text-brand">Work</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              A proven 4-step process designed to deliver clarity, quality, and momentum from day one.
            </p>
          </ScrollReveal>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="absolute top-12 left-0 right-0 hidden h-px bg-border md:block" />

            <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {processSteps.map((s) => {
                const Icon = s.icon;
                return (
                  <StaggerItem key={s.step}>
                    <div className="relative flex flex-col items-center text-center">
                      {/* Step number + icon */}
                      <div className="relative z-10 mb-6 flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface transition-all duration-300 hover:border-brand/30 hover:-translate-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand">
                          {s.step}
                        </span>
                        <Icon className="mt-1 h-5 w-5 text-brand" />
                      </div>

                      <h3 className="text-base font-semibold text-foreground">
                        {s.title}
                      </h3>
                      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                        {s.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
