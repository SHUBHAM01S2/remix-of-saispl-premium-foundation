import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code,
  Bot,
  LayoutDashboard,
  PenTool,
  Cloud,
  Headset,
  ArrowRight,
  Search,
  Layers,
  Wrench,
  Rocket,
} from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Web & Software Development",
    description:
      "Scalable web apps and custom software built with modern stacks to power your business growth.",
  },
  {
    icon: Bot,
    title: "AI Agents & Automation",
    description:
      "Intelligent AI agents and automated workflows that reduce costs and accelerate outcomes.",
  },
  {
    icon: LayoutDashboard,
    title: "Custom Portals & Dashboards",
    description:
      "Tailored dashboards and portals that unify data and give teams real-time visibility.",
  },
  {
    icon: PenTool,
    title: "UI/UX & Product Design",
    description:
      "User-centered design and prototyping that transforms ideas into intuitive digital products.",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description:
      "Reliable cloud infrastructure, CI/CD pipelines, and DevOps practices for seamless delivery.",
  },
  {
    icon: Headset,
    title: "Ongoing Support & Maintenance",
    description:
      "Proactive monitoring, updates, and dedicated support to keep your systems running smoothly.",
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
      { title: "Our Services — Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Explore end-to-end digital and AI solutions from Shivaryan Infotech — web development, AI automation, custom portals, UI/UX design, cloud & DevOps, and ongoing support.",
      },
      {
        property: "og:title",
        content: "Our Services — Shivaryan Infotech",
      },
      {
        property: "og:description",
        content:
          "End-to-end digital and AI solutions tailored to modernize, automate, and scale your business.",
      },
    ],
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
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our <span className="text-brand">Services</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            End-to-end digital and AI solutions tailored to modernize,
            automate, and scale your business.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.title}
                  className="group rounded-2xl border border-border/50 bg-surface p-7 transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-1"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {svc.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {svc.description}
                  </p>
                  <div className="mt-5">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand/80"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
