import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe, CheckCircle2, Phone } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const features = [
  "Custom-designed responsive websites",
  "Fast, SEO-ready pages built on modern stacks",
  "Content management setup and training",
  "Booking, contact, and lead-capture flows",
  "Multi-language and multi-currency support",
  "Ongoing performance and accessibility tuning",
];

export const Route = createFileRoute("/web-design-development")({
  head: () => ({
    meta: [
      { title: "Web Design & Development | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Custom website design and development — fast, responsive, SEO-ready sites built for hotels, clinics, schools, and local businesses.",
      },
      { property: "og:title", content: "Web Design & Development | Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Custom-designed, SEO-ready websites built for conversion, speed, and long-term growth.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/web-design-development" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Web Design & Development | Shivaryan Infotech" },
      {
        name: "twitter:description",
        content: "Custom, responsive, SEO-ready websites for growing businesses.",
      },
    ],
    links: [{ rel: "canonical", href: "/web-design-development" }],
  }),
  component: WebDesignDevelopment,
});

function WebDesignDevelopment() {
  return (
    <div>
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Globe className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Websites Built to{" "}
            <span className="text-brand">Convert & Grow</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            We design and build custom websites that load fast, rank well, and
            turn visitors into customers.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-background pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What's <span className="text-brand">Included</span>
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2">
            {features.map((item) => (
              <StaggerItem key={item}>
                <div className="flex h-full items-start gap-3 rounded-xl border border-border/50 bg-surface p-5 transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-0.5">
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

      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="rounded-2xl border border-brand/30 bg-brand/5 p-8 text-center md:p-10">
              <p className="text-lg font-semibold text-foreground md:text-xl">
                Starter websites from{" "}
                <span className="text-brand">Rs.45,000</span>.
              </p>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Free discovery call before any quote.
              </p>
              <Link
                to="/contact"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl"
              >
                <Phone className="h-4 w-4" />
                Book a Free Call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
