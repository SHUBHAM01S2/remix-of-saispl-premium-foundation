import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Zap, TrendingUp, MapPin, Users, ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Careers — Shivaryan Infotech" },
      { name: "description", content: "Join Shivaryan Infotech and build the future of AI and software with our growing global team." },
      { property: "og:title", content: "Careers — Shivaryan Infotech" },
      { property: "og:description", content: "Join Shivaryan Infotech and build the future of AI and software with our growing global team." },
    ],
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

const openings = [
  {
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Remote (India / International)",
  },
  {
    title: "AI / ML Engineer",
    department: "AI Labs",
    location: "Remote (India / International)",
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote (India / International)",
  },
  {
    title: "DevOps Engineer",
    department: "Platform",
    location: "Remote (India / International)",
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Remote (India / International)",
  },
  {
    title: "Business Development Executive",
    department: "Sales",
    location: "Remote (India / International)",
  },
];

function Career() {
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
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <StaggerItem key={b.title}>
                  <div className="group rounded-2xl border border-border/50 bg-surface p-6 transition-all hover:border-brand/30 hover:-translate-y-1">
                    <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-brand/10 p-3">
                      <Icon className="h-6 w-6 text-brand" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
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
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {openings.map((job) => (
              <StaggerItem key={job.title}>
                <div className="flex flex-col rounded-2xl border border-border/50 bg-surface p-6 transition-all hover:border-brand/30 hover:-translate-y-1">
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
                  </div>
                  <div className="mt-5 flex items-center gap-3 pt-2">
                    <a
                      href={`mailto:Help@saispl.com?subject=Application for ${encodeURIComponent(job.title)}`}
                      className="inline-flex items-center justify-center rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-cta-foreground transition-all hover:bg-cta/90"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
