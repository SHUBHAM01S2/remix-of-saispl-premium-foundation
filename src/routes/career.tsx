import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe, Zap, TrendingUp, MapPin, Users, ArrowRight, ArrowUpRight, Sparkles, Briefcase, Loader2 } from "lucide-react";

const displayFont = { fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" };
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { ApplyForm } from "@/components/ApplyForm";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Careers — AI & Software Jobs at Shivaryan Infotech (Himachal Pradesh & Remote)" },
      {
        name: "description",
        content:
          "Explore careers at Shivaryan Infotech. Join our AI, software, and design team in Himachal Pradesh or work remotely on global projects for clients around the world.",
      },
      {
        name: "keywords",
        content:
          "careers Shivaryan Infotech, AI jobs India, software developer jobs Himachal Pradesh, remote developer jobs, AI automation careers, tech jobs Bilaspur",
      },
      { property: "og:title", content: "Careers — AI & Software Jobs at Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Join our AI, software, and design team in Himachal Pradesh or remotely on global projects.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/career" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Careers — AI & Software Jobs at Shivaryan Infotech" },
      {
        name: "twitter:description",
        content:
          "Build AI and software for global clients — from Himachal Pradesh or remote.",
      },
    ],
    links: [{ rel: "canonical", href: "/career" }],
  }),

  component: Career,
});

const benefits = [
  {
    icon: Globe,
    title: "Remote-friendly culture",
    description: "Work from anywhere with flexible hours. We trust our team to deliver great results on their own schedule.",
  },
  {
    icon: Zap,
    title: "Cutting-edge projects",
    description: "Build AI agents, automation systems, and enterprise platforms used by clients across the globe.",
  },
  {
    icon: TrendingUp,
    title: "Growth opportunities",
    description: "Clear career paths, mentorship, and a learning budget so you can level up your skills every year.",
  },
];

type JobOpening = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string | null;
};

function Career() {
  const [activePosition, setActivePosition] = useState<string | null>(null);
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await (supabase as any)
        .from("job_openings")
        .select("id, title, department, location, type, description")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setOpenings((data as JobOpening[]) ?? []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-20 lg:px-8 lg:pt-40 lg:pb-28">
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-brand/20 blur-3xl" />
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Join <span className="text-brand">Shivaryan Infotech</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Build the future of AI and software with a growing global team that values craft, curiosity, and collaboration.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#openings"
              className="inline-flex items-center justify-center rounded-lg bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground transition-all hover:bg-cta/90 hover:shadow-lg hover:shadow-cta/25"
            >
              View Openings
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-elevated"
            >
              Contact Us
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Why Work With Us */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Work With <span className="text-brand">Us</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              We are building a workplace where great people do their best work.
            </p>
          </ScrollReveal>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              const num = String(idx + 1).padStart(2, "0");
              return (
                <StaggerItem key={b.title}>
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]">
                    <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }} />
                    <div className="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.12]" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "24px 24px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)" }} />
                    <div className="pointer-events-none absolute -right-2 -bottom-6 select-none text-[8rem] font-black leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-brand/10" style={displayFont}>{num}</div>

                    <div className="relative flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-brand" />
                        Culture
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-zinc-600">{num}</span>
                    </div>

                    <div className="relative mt-8 flex items-center gap-4">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] shadow-inner transition-all duration-500 group-hover:border-brand/40 group-hover:from-brand/20">
                        <Icon className="h-6 w-6 text-foreground/90 transition-colors group-hover:text-brand" />
                        <span className="absolute inset-0 rounded-2xl opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" style={{ background: "color-mix(in oklab, var(--color-brand) 30%, transparent)" }} />
                      </div>
                    </div>

                    <h3 className="relative mt-6 text-xl font-bold leading-tight text-foreground" style={displayFont}>{b.title}</h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Current Openings */}
      <section id="openings" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Current <span className="text-brand">Openings</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Find a role that matches your skills and ambitions. All positions are remote-friendly.
            </p>
          </ScrollReveal>
          {loading ? (
            <div className="flex justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-sm text-destructive">Unable to load openings right now. Please try again later.</p>
          ) : openings.length === 0 ? (
            <p className="text-center text-muted-foreground">No open positions at the moment — check back soon!</p>
          ) : (
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {openings.map((job) => (
                <StaggerItem key={job.id}>
                  <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-surface p-6 transition-all hover:border-brand/30 hover:-translate-y-1">
                    <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium capitalize text-brand">
                        {job.type}
                      </span>
                    </div>
                    {job.description && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{job.description}</p>
                    )}
                    <div className="mt-5 flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setActivePosition(job.title)}
                        className="inline-flex items-center justify-center rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-cta-foreground transition-all hover:bg-cta/90"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      <ApplyForm
        open={activePosition !== null}
        onOpenChange={(v) => { if (!v) setActivePosition(null); }}
        position={activePosition ?? ""}
      />
    </div>
  );
}
