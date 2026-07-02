import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Monitor, ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

type Category = "All" | "Web" | "Software" | "AI/Automation" | "Design";

const filters: Category[] = ["All", "Web", "Software", "AI/Automation", "Design"];

type Project = {
  id: string;
  name: string;
  category: string;
  industry: string;
  result: string;
  thumbnail_url: string | null;
};

const fallbackProjects: Project[] = [
  { id: "1", name: "Global Trade Platform", category: "Web", industry: "Finance / Trading", result: "Reduced order processing time by 68% with AI automation and real-time trade execution.", thumbnail_url: null },
  { id: "2", name: "MediCare Connect", category: "Software", industry: "Healthcare", result: "Streamlined patient intake for 12,000+ daily users across 40+ hospital branches.", thumbnail_url: null },
  { id: "3", name: "FinVue Analytics", category: "AI/Automation", industry: "FinTech", result: "Delivered real-time insights and alerts for $2B+ in managed investment assets.", thumbnail_url: null },
  { id: "4", name: "Logistics Hub AI", category: "AI/Automation", industry: "Logistics", result: "Cut fleet routing costs by 42% using predictive AI models and dynamic scheduling.", thumbnail_url: null },
  { id: "5", name: "Aura Mobile Experience", category: "Design", industry: "Consumer Tech", result: "Increased user retention by 55% with a complete UX overhaul and design system.", thumbnail_url: null },
  { id: "6", name: "RetailFlow ERP", category: "Software", industry: "Retail", result: "Unified inventory, sales, and HR into one cloud ERP serving 200+ store locations.", thumbnail_url: null },
  { id: "7", name: "GreenEnergy Portal", category: "Web", industry: "Energy", result: "Built a public-facing sustainability dashboard tracking live carbon offset metrics.", thumbnail_url: null },
  { id: "8", name: "NexGen Brand Identity", category: "Design", industry: "Technology", result: "Crafted a modern brand system that 3x'd investor engagement during the Series A round.", thumbnail_url: null },
];

export const Route = createFileRoute("/our-works/")({
  head: () => ({
    meta: [
      { title: "Our Work — AI, Software & Web Portfolio | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Case studies from Shivaryan Infotech: AI automation, custom software, web platforms, and product design delivered to clients across Himachal Pradesh, India, and globally.",
      },
      {
        name: "keywords",
        content:
          "AI automation case studies, software development portfolio, web development projects, Shivaryan Infotech work, AI agents India, global software clients, Himachal Pradesh tech company",
      },
      { property: "og:title", content: "Our Work — AI, Software & Web Portfolio | Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Real projects with measurable impact — AI, software, and design work built for global clients.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/our-works" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Our Work — AI, Software & Web Portfolio | Shivaryan Infotech" },
      {
        name: "twitter:description",
        content:
          "AI, software, and design projects delivered for global clients.",
      },
    ],
    links: [{ rel: "canonical", href: "/our-works" }],
  }),

  component: OurWorks,
});

function OurWorks() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

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
            Our <span className="text-brand">Work</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A curated portfolio of digital products, AI solutions, and design systems built for global clients.
          </p>
        </ScrollReveal>
      </section>

      {/* Filter + Grid */}
      <section className="bg-background pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filter tabs */}
          <ScrollReveal className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-brand text-brand-foreground shadow-md shadow-brand/20"
                    : "border border-border/50 bg-surface text-foreground hover:border-brand/30 hover:bg-surface-elevated"
                }`}
              >
                {f}
              </button>
            ))}
          </ScrollReveal>

          {/* Portfolio grid */}
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => {
              const slug = project.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
              return (
                <StaggerItem key={project.name}>
                  <Link
                    to="/our-works/$caseStudyId"
                    params={{ caseStudyId: slug }}
                    className="group relative block overflow-hidden rounded-2xl border border-border/50 bg-surface transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-1"
                  >
                    {/* Screenshot placeholder */}
                    <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-surface-elevated to-surface">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                        <Monitor className="h-8 w-8" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                      <span className="absolute right-3 top-3 rounded-full border border-border/50 bg-surface/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                        {project.industry}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-foreground">
                        {project.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {project.result}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-block rounded-md bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
                          {project.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                          View Case Study
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {filtered.length === 0 && (
            <p className="py-20 text-center text-muted-foreground">
              No projects in this category yet.
            </p>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <ScrollReveal>
        <section className="relative overflow-hidden border-t border-[oklch(1_0_0_/_10%)] bg-surface px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Let&apos;s Build <span className="text-brand">Yours</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Have a project in mind? We turn ambitious ideas into award-winning digital products.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-cta px-8 py-3.5 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2 focus:ring-offset-surface"
              >
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="mailto:Help@saispl.com"
                className="inline-flex items-center gap-2 rounded-full border border-border/50 px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-surface"
              >
                Email Us
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
