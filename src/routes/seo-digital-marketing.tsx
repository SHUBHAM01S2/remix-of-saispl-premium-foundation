import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, CheckCircle2, MapPin } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const servicesIncluded = [
  "Google Business Profile setup and optimization",
  "Local keyword research (Shimla, Solan, Hamirpur, Paonta Sahib, etc.)",
  "On-page SEO (title tags, schema, headings, alt text)",
  "Monthly blog articles targeting local searches",
  "Google Search Console monitoring",
  "Monthly ranking and traffic report",
];

export const Route = createFileRoute("/seo-digital-marketing")({
  head: () => ({
    meta: [
      { title: "Local SEO & Digital Marketing in Himachal Pradesh | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Get found on Google by people in your city. Local SEO and digital marketing services for Shimla, Solan, Hamirpur, Paonta Sahib and businesses across Himachal Pradesh.",
      },
      { property: "og:title", content: "Local SEO & Digital Marketing in Himachal Pradesh | Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Google Business Profile optimization, local keyword research, on-page SEO, monthly blogs, and ranking reports for businesses in Himachal Pradesh.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/seo-digital-marketing" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Local SEO & Digital Marketing | Shivaryan Infotech" },
      {
        name: "twitter:description",
        content: "Get found on Google by people in your city — local SEO built for Himachal Pradesh businesses.",
      },
    ],
    links: [{ rel: "canonical", href: "/seo-digital-marketing" }],
  }),
  component: SeoDigitalMarketing,
});

function SeoDigitalMarketing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-brand" />
            SEO & Digital Marketing
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Get Found on Google by{" "}
            <span className="text-brand">People in Your City</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Local SEO built for businesses in Himachal Pradesh — from
            Shimla and Solan to Hamirpur and Paonta Sahib. We put you in
            front of customers who are already searching.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl"
            >
              Start Ranking Locally
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Services Included */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 text-center">
            <div className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Search className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Services <span className="text-brand">Included</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Everything you need to show up, rank, and grow in local search results.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2">
            {servicesIncluded.map((item) => (
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
    </div>
  );
}
