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
      {/* Subtle grid + radial glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, color-mix(in oklab, var(--color-brand) 10%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mb-16 text-center">
          <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Featured Work
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Real solutions. <span className="text-brand">Measurable impact.</span>
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => {
            const Icon = iconFor(project.client_industry);
            const loc = (project as any).location ?? project.client_industry;
            const slug = resolveCaseStudySlug(project.title);
            const n = String(idx + 1).padStart(2, "0");
            return (
              <StaggerItem key={project.id}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white/[0.04] hover:shadow-[0_0_30px_-10px_color-mix(in_oklab,var(--color-brand)_50%,transparent)]">
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-white p-6">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <Icon className="h-14 w-14 text-brand/40 transition-all duration-500 group-hover:scale-110 group-hover:text-brand" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_color-mix(in_oklab,var(--color-brand)_80%,transparent)]" />
                      <span className="font-mono text-[11px] font-medium tracking-[0.15em] text-brand">
                        {n} · {project.client_industry}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-brand md:text-xl">
                      {project.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      <MapPin className="h-3 w-3 text-brand" />
                      {loc}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {project.results}
                    </p>
                    {slug ? (
                      <Link
                        to="/our-works/$caseStudyId"
                        params={{ caseStudyId: slug }}
                        className="group/link mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-brand"
                      >
                        View Case Study
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    ) : (
                      <Link
                        to="/our-works"
                        className="group/link mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-brand"
                      >
                        View All Work
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    )}
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
