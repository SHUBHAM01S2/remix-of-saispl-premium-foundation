import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Monitor, ArrowRight, MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { resolveCaseStudySlug } from "@/lib/case-study-slugs";

const displayFont = { fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" };

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
            caseStudySlug: resolveCaseStudySlug(p.title) ?? undefined,
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

          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, idx) => {
              const CardTag: any = project.caseStudySlug ? Link : "div";
              const cardProps = project.caseStudySlug
                ? {
                    to: "/our-works/$caseStudyId",
                    params: { caseStudyId: project.caseStudySlug },
                  }
                : {};
              const num = String(idx + 1).padStart(2, "0");
              const resultLines = project.result.split("\n").filter(Boolean);
              return (
                <StaggerItem key={project.id}>
                  <CardTag
                    {...cardProps}
                    className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]"
                  >
                    {/* hover glow */}
                    <div
                      className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                      style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
                    />
                    {/* grid overlay */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.12]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
                        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
                      }}
                    />
                    {/* giant background number */}
                    <div
                      className="pointer-events-none absolute -right-2 -bottom-6 select-none text-[8rem] font-black leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-brand/10"
                      style={displayFont}
                    >
                      {num}
                    </div>

                    <div className="relative flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-brand" />
                        {project.category}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-zinc-600">{num}</span>
                    </div>

                    <div className="relative mt-8 flex items-center gap-4">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-inner transition-all duration-500 group-hover:border-brand/40 group-hover:from-brand/20">
                        {project.thumbnail_url ? (
                          <img src={project.thumbnail_url} alt={project.name} className="h-full w-full rounded-2xl object-cover" loading="lazy" />
                        ) : (
                          <Monitor className="h-6 w-6 text-foreground/90 transition-colors group-hover:text-brand" />
                        )}
                        <span className="absolute inset-0 rounded-2xl opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" style={{ background: "color-mix(in oklab, var(--color-brand) 30%, transparent)" }} />
                      </div>
                      <ArrowUpRight className="ml-auto h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" />
                    </div>

                    <h3 className="relative mt-6 text-xl font-bold leading-tight text-foreground" style={displayFont}>
                      {project.name}
                    </h3>
                    <p className="relative mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-brand" />
                      {project.city}
                    </p>

                    {resultLines.length > 0 && (
                      <ul className="relative mt-5 space-y-2">
                        {resultLines.map((line) => (
                          <li key={line} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
                            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="relative mt-6 flex-1" />

                    <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand">
                        <Sparkles className="h-3 w-3" />
                        {project.caseStudySlug ? "View Case Study" : "Project Highlight"}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                        {project.category}
                      </span>
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
        <section className="relative overflow-hidden border-t border-border bg-background px-4 py-28 sm:px-6 lg:px-8">
          {/* Grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(to right,#121212 1px,transparent 1px),linear-gradient(to bottom,#121212 1px,transparent 1px)",
              backgroundSize: "4rem 4rem",
              maskImage:
                "radial-gradient(ellipse 70% 55% at 50% 50%, #000 55%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 55% at 50% 50%, #000 55%, transparent 100%)",
            }}
          />
          {/* Halo glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--brand) / 0.35), transparent 70%)",
            }}
          />
          {/* Giant ghost word */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[18vw] font-black leading-none tracking-tighter text-white/[0.03] sm:text-[14vw]"
          >
            BUILD
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-10 backdrop-blur-sm sm:p-14 md:p-20">
              {/* Card halo */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, hsl(var(--brand) / 0.25), transparent 70%)",
                }}
              />
              {/* Corner accents */}
              <div className="pointer-events-none absolute left-6 top-6 h-6 w-6 border-l border-t border-brand/60" />
              <div className="pointer-events-none absolute right-6 top-6 h-6 w-6 border-r border-t border-brand/60" />
              <div className="pointer-events-none absolute bottom-6 left-6 h-6 w-6 border-b border-l border-brand/60" />
              <div className="pointer-events-none absolute bottom-6 right-6 h-6 w-6 border-b border-r border-brand/60" />

              <div className="relative text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-brand">
                  <Sparkles className="h-3 w-3" />
                  Ready when you are
                </span>

                <h2 className="mt-6 text-4xl font-black leading-[0.95] tracking-tighter text-foreground sm:text-5xl md:text-6xl">
                  Let&apos;s Build{" "}
                  <span className="bg-gradient-to-r from-brand via-indigo-400 to-brand bg-clip-text text-transparent">
                    Yours
                  </span>
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Have a project in mind? We turn ambitious ideas into award-winning
                  digital products—crafted with speed, precision, and taste.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-cta px-8 py-3.5 text-sm font-semibold text-cta-foreground shadow-[0_10px_40px_-10px_hsl(var(--brand)/0.6)] transition-all hover:brightness-110 hover:shadow-[0_15px_50px_-10px_hsl(var(--brand)/0.8)] focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2 focus:ring-offset-background"
                  >
                    Start a Project
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-brand/40 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  >
                    Email Us
                  </Link>
                </div>

                {/* Trust strip */}
                <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-6 border-t border-white/5 pt-8">
                  {[
                    { k: "12+", v: "Countries served" },
                    { k: "72h", v: "Avg. first response" },
                    { k: "100%", v: "Client satisfaction" },
                  ].map((s) => (
                    <div key={s.v} className="text-center">
                      <div className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        {s.k}
                      </div>
                      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 sm:text-[11px]">
                        {s.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}
