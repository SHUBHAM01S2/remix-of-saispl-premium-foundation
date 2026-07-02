import { Link } from "@tanstack/react-router";
import { ArrowRight, Monitor } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const projects = [
  {
    name: "Global Trade Platform",
    result: "Reduced order processing time by 68% with AI automation.",
    placeholder: "Trading Dashboard",
  },
  {
    name: "MediCare Connect",
    result: "Streamlined patient intake for 12,000+ daily users.",
    placeholder: "Healthcare Portal",
  },
  {
    name: "FinVue Analytics",
    result: "Delivered real-time insights for $2B+ in managed assets.",
    placeholder: "Analytics Suite",
  },
  {
    name: "Logistics Hub AI",
    result: "Cut fleet routing costs by 42% using predictive AI models.",
    placeholder: "Logistics Dashboard",
  },
];

export function FeaturedWorkSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Featured Work
          </h2>
          <p className="mt-3 text-lg text-secondary">
            Real solutions. Measurable impact.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <StaggerItem key={project.name}>
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-brand/40 hover:bg-surface-elevated hover:shadow-lg hover:shadow-brand/5">
                {/* Screenshot placeholder */}
                <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-surface-elevated to-surface">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                    <Monitor className="h-8 w-8" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-primary">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {project.result}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal className="mt-12 text-center" delay={0.2}>
          <Link
            to="/our-works"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-brand/40 hover:bg-surface-elevated hover:text-brand"
          >
            View All Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
