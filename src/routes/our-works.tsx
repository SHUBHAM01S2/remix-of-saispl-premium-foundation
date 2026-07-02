import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Monitor, ArrowRight, MapPin } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

type Category = "All" | "Website" | "Portal" | "Automation" | "SEO";

const filters: Category[] = ["All", "Website", "Portal", "Automation", "SEO"];

type Project = {
  id: string;
  name: string;
  category: string;
  city: string;
  result: string;
  thumbnail_url: string | null;
  caseStudySlug?: string;
};

const fallbackProjects: Project[] = [
  { id: "1", name: "Global Trade Platform", category: "Portal", city: "Mumbai", result: "Reduced order processing time by 68% with AI automation.\nUnified 12 international exchanges into one trading portal.", thumbnail_url: null, caseStudySlug: "global-trade-platform" },
  { id: "2", name: "MediCare Connect", category: "Portal", city: "Delhi", result: "Streamlined patient intake for 12,000+ daily users.\nSynced 40+ hospital branches into a single cloud EHR.", thumbnail_url: null, caseStudySlug: "medicare-connect" },
  { id: "3", name: "FinVue Analytics", category: "Automation", city: "Bengaluru", result: "Delivered real-time insights for $2B+ in managed assets.\nCut portfolio risk detection time by 72 hours.", thumbnail_url: null, caseStudySlug: "finvue-analytics" },
  { id: "4", name: "Logistics Hub AI", category: "Automation", city: "Chandigarh", result: "Cut fleet routing costs by 42% with predictive AI models.\nLifted on-time delivery to 96.4% across 800+ vehicles.", thumbnail_url: null, caseStudySlug: "logistics-hub-ai" },
  { id: "5", name: "Shimla Heritage Homestay", category: "Website", city: "Shimla", result: "Redesigned booking site increased inquiries by 3x.\nRanked page-1 for 'Shimla homestay' in 90 days.", thumbnail_url: null },
  { id: "6", name: "Solan Auto Care", category: "SEO", city: "Solan", result: "Grew local Google traffic by 240% in six months.\nRanked #1 for 'car service Solan' and 12 related terms.", thumbnail_url: null },
  { id: "7", name: "GreenEnergy Portal", category: "Website", city: "Pune", result: "Public sustainability dashboard serving 85K+ monthly visitors.\nTripled partner onboarding requests in one quarter.", thumbnail_url: null, caseStudySlug: "greenenergy-portal" },
  { id: "8", name: "Hamirpur Blood Bank", category: "Portal", city: "Hamirpur", result: "Digital donor management replaced 4 paper registers.\nCut emergency donor-match time from hours to minutes.", thumbnail_url: null },
];

export const Route = createFileRoute("/our-works")({
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
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await (supabase as any)
        .from("portfolio_projects")
        .select("id, title, client_industry, category, thumbnail_url, results")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (!error && data && data.length > 0) {
        setProjects(
          (data as Array<{ id: string; title: string; client_industry: string; category: string; thumbnail_url: string | null; results: string | null }>).map((p) => ({
            id: p.id,
            name: p.title,
            category: p.category,
            city: p.client_industry,
            result: p.results ?? "",
            thumbnail_url: p.thumbnail_url,
          })),
        );
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div>
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

      <section className="bg-background pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => {
              const CardTag: any = project.caseStudySlug ? Link : "div";
              const cardProps = project.caseStudySlug
                ? {
                    to: "/our-works/$caseStudyId",
                    params: { caseStudyId: project.caseStudySlug },
                  }
                : {};
              return (
                <StaggerItem key={project.id}>
                  <CardTag
                    {...cardProps}
                    className="group relative block h-full overflow-hidden rounded-2xl border border-border/50 bg-surface transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-1"
                  >
                    <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-surface-elevated to-surface">
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                          <Monitor className="h-8 w-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                      <span className="absolute right-3 top-3 rounded-full border border-border/50 bg-surface/80 px-3 py-1 text-xs font-medium text-brand backdrop-blur-sm">
                        {project.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-foreground">
                        {project.name}
                      </h3>
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 text-brand" />
                        {project.city}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {project.result}
                      </p>
                      {project.caseStudySlug && (
                        <div className="mt-4">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand opacity-80 transition-opacity group-hover:opacity-100">
                            View Case Study
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      )}
                    </div>
                  </CardTag>
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

      <ScrollReveal>
        <section className="relative overflow-hidden border-t border-border bg-surface px-4 py-20 sm:px-6 lg:px-8">
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
