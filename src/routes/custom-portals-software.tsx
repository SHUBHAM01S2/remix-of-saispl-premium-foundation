import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LayoutDashboard, CheckCircle2, Phone } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const examples = [
  "School/college management portals (admissions, fees, attendance)",
  "Blood bank and donor management systems",
  "Real estate lead and inventory dashboards",
  "Restaurant and hotel booking backends",
  "Internal HR/team tracking tools",
  "Client-facing reporting portals",
];

export const Route = createFileRoute("/custom-portals-software")({
  head: () => ({
    meta: [
      { title: "Custom Portals & Software Development | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Custom business portals and software built the way you work — school ERPs, blood bank systems, real estate dashboards, booking backends, HR tools, and client reporting portals. Starts at Rs.2,50,000.",
      },
      { property: "og:title", content: "Custom Portals & Software Development | Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Purpose-built portals and internal software for schools, healthcare, real estate, hospitality, and HR — from Rs.2,50,000 with a free scoping call.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/custom-portals-software" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Custom Portals & Software | Shivaryan Infotech" },
      {
        name: "twitter:description",
        content: "Custom business tools that work the way you do — starts at Rs.2,50,000.",
      },
    ],
    links: [{ rel: "canonical", href: "/custom-portals-software" }],
  }),
  component: CustomPortalsSoftware,
});

function CustomPortalsSoftware() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Custom Business Tools That{" "}
            <span className="text-brand">Work the Way You Do</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            We design and build portals, dashboards, and internal software
            that fit your process — not the other way around.
          </p>
        </ScrollReveal>
      </section>

      {/* Examples */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What We <span className="text-brand">Build</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              A few examples of custom portals and tools we've delivered.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2">
            {examples.map((item) => (
              <StaggerItem key={item}>
                <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-surface p-5 transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-0.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {item}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing note */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="rounded-2xl border border-brand/30 bg-brand/5 p-8 text-center md:p-10">
              <p className="text-lg font-semibold text-foreground md:text-xl">
                Pricing starts at{" "}
                <span className="text-brand">Rs.2,50,000</span>.
              </p>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Free scoping call before any quote.
              </p>
              <Link
                to="/contact"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl"
              >
                <Phone className="h-4 w-4" />
                Book a Free Scoping Call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
