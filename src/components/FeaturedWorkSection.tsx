import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Boxes, HeartPulse, LineChart, Truck, MapPin } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { resolveCaseStudySlug } from "@/lib/case-study-slugs";

type FeaturedProject = {
  id: string;
  title: string;
  client_industry: string;
  results: string | null;
  thumbnail_url: string | null;
  location?: string;
};

const fallbackProjects: (FeaturedProject & { location: string })[] = [
  { id: "1", title: "Global Trade Platform", client_industry: "Portal", results: "Reduced order processing time by 68% with AI automation. Unified 12 international exchanges.", thumbnail_url: null, location: "Mumbai" },
  { id: "2", title: "MediCare Connect", client_industry: "Healthcare", results: "Streamlined patient intake for 12,000+ daily users. Synced 40+ hospital branches into a single cloud EHR.", thumbnail_url: null, location: "Delhi" },
  { id: "3", title: "FinVue Analytics", client_industry: "Analytics", results: "Delivered real-time insights for $2B+ in managed assets. Cut portfolio risk detection time by 72 hours.", thumbnail_url: null, location: "Bengaluru" },
];

const iconFor = (industry: string) => {
  const s = industry?.toLowerCase() ?? "";
  if (s.includes("health") || s.includes("medi")) return HeartPulse;
  if (s.includes("fin") || s.includes("analytic")) return LineChart;
  if (s.includes("logistic") || s.includes("fleet")) return Truck;
  return Boxes;
};

export function FeaturedWorkSection() {
  const [projects, setProjects] = useState<FeaturedProject[]>(fallbackProjects);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await (supabase as any)
        .from("portfolio_projects")
        .select("id, title, client_industry, results, thumbnail_url")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (!active) return;
      if (!error && data && data.length > 0) setProjects(data as FeaturedProject[]);
    })();
    return () => { active = false; };
  }, []);

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
            Featured Work
          </span>
          <h2 className="text-5xl font-extrabold tracking-tighter text-foreground md:text-6xl">
            Real solutions. <span className="text-muted-foreground">Measurable impact.</span>
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const Icon = iconFor(project.client_industry);
            const loc = (project as any).location ?? project.client_industry;
            return (
              <StaggerItem key={project.id}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:border-white/25">
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-white/[0.02]">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <>
                        <div
                          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(to top right, color-mix(in oklab, var(--color-brand) 8%, transparent), transparent)",
                          }}
                        />
                        <Icon className="h-14 w-14 text-brand/30 transition-all duration-500 group-hover:scale-110 group-hover:text-brand" />
                      </>
                    )}
                    <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-md">
                      {project.client_industry}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-brand">
                      {project.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <MapPin className="h-3 w-3 text-brand" />
                      {loc}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {project.results}
                    </p>
                    <Link
                      to="/our-works"
                      className="group/link mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground"
                    >
                      View Case Study
                      <span className="block h-px w-4 bg-white/30 transition-all group-hover/link:w-8 group-hover/link:bg-brand" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <ScrollReveal className="mt-14 text-center" delay={0.2}>
          <Link
            to="/our-works"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-white/20 hover:bg-white/[0.05]"
          >
            View All Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
