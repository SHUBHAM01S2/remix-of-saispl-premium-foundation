import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Monitor } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

type FeaturedProject = {
  id: string;
  title: string;
  client_industry: string;
  results: string | null;
  thumbnail_url: string | null;
};

const fallbackProjects: FeaturedProject[] = [
  { id: "1", title: "Global Trade Platform", client_industry: "Finance", results: "Reduced order processing time by 68% with AI automation.", thumbnail_url: null },
  { id: "2", title: "MediCare Connect", client_industry: "Healthcare", results: "Streamlined patient intake for 12,000+ daily users.", thumbnail_url: null },
  { id: "3", title: "FinVue Analytics", client_industry: "FinTech", results: "Delivered real-time insights for $2B+ in managed assets.", thumbnail_url: null },
  { id: "4", title: "Logistics Hub AI", client_industry: "Logistics", results: "Cut fleet routing costs by 42% using predictive AI models.", thumbnail_url: null },
];

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
        .limit(4);
      if (!active) return;
      if (!error && data && data.length > 0) setProjects(data as FeaturedProject[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Featured Work
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Real solutions. Measurable impact.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-brand/40 hover:bg-surface-elevated hover:shadow-lg hover:shadow-brand/5">
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-surface-elevated to-surface">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                      <Monitor className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {project.results}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal className="mt-12 text-center" delay={0.2}>
          <Link
            to="/our-works"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-brand/40 hover:bg-surface-elevated hover:text-brand"
          >
            View All Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
