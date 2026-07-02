import { Globe, Cpu, LayoutDashboard, PenTool } from "lucide-react";

const capabilities = [
  {
    icon: Globe,
    title: "Web & Software Development",
    description:
      "Scalable web applications and custom software built with modern technologies to power your business growth.",
  },
  {
    icon: Cpu,
    title: "AI & Automation Solutions",
    description:
      "Intelligent automation and AI-driven workflows that reduce costs, eliminate bottlenecks, and accelerate outcomes.",
  },
  {
    icon: LayoutDashboard,
    title: "Custom Business Portals",
    description:
      "Tailored dashboards and portals that unify data, streamline operations, and give teams real-time visibility.",
  },
  {
    icon: PenTool,
    title: "Digital Product Design",
    description:
      "User-centered design and prototyping that transforms complex ideas into intuitive, high-converting digital products.",
  },
];

export function WhatWeDoSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What We Do
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            End-to-end technology capabilities designed to modernize, automate,
            and scale your business.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="group rounded-2xl border border-border/50 bg-surface p-7 transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {cap.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
