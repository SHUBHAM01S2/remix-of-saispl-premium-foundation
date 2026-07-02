import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Palette, CheckCircle2, Phone } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const deliverables = [
  "Logo design and brand mark",
  "Colour palette and typography system",
  "Business cards, letterheads, and stationery",
  "Social media templates and post kits",
  "Brochures, flyers, and menu design",
  "Brand guidelines document",
];

export const Route = createFileRoute("/branding-graphic-design")({
  head: () => ({
    meta: [
      { title: "Branding & Graphic Design | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Logos, brand identity, and print/social design that make your business look professional and trustworthy.",
      },
      { property: "og:title", content: "Branding & Graphic Design | Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Distinctive branding, logos, and marketing collateral for growing businesses.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/branding-graphic-design" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Branding & Graphic Design | Shivaryan Infotech" },
      {
        name: "twitter:description",
        content: "Logos, identity systems, and marketing design that stands out.",
      },
    ],
    links: [{ rel: "canonical", href: "/branding-graphic-design" }],
  }),
  component: BrandingGraphicDesign,
});

function BrandingGraphicDesign() {
  return (
    <div>
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Palette className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Branding That{" "}
            <span className="text-brand">Sets You Apart</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            A distinctive brand identity, print collateral, and social design —
            all in one consistent system.
          </p>
        </ScrollReveal>
      </section>

      <section className="bg-background pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What You <span className="text-brand">Get</span>
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2">
            {deliverables.map((item) => (
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
                Brand packages from{" "}
                <span className="text-brand">Rs.25,000</span>.
              </p>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Free brand discovery call before any quote.
              </p>
              <Link
                to="/contact"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl"
              >
                <Phone className="h-4 w-4" />
                Start Your Brand
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
