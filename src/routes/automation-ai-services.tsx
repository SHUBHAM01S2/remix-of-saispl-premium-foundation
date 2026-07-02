import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Stethoscope,
  School,
  Building2,
  Hotel,
  Phone,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const servicesList = [
  "WhatsApp Automation — Auto-reply, appointment booking",
  "Appointment & Booking Flows — Sync with Cal.com or Google Calendar",
  "AI Chat Agents — 24/7 website chat that qualifies leads and books meetings",
  "CRM & Lead Nurturing — Auto-follow-ups, pipeline tracking, and deal management",
  "Review & Feedback Automation — Auto-request Google reviews after service completion",
];

const industryCards = [
  {
    icon: Stethoscope,
    title: "Clinics",
    description: "Auto-confirm appointments",
  },
  {
    icon: School,
    title: "Schools",
    description: "Auto-send admission info",
  },
  {
    icon: Building2,
    title: "Real estate",
    description: "Auto-qualify property enquiries",
  },
  {
    icon: Hotel,
    title: "Hotels and resorts",
    description: "Instant room availability",
  },
];

export const Route = createFileRoute("/automation-ai-services")({
  head: () => ({
    meta: [
      { title: "Automation & AI Services | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Turn enquiries into booked clients automatically with WhatsApp automation, AI chat agents, appointment booking flows, CRM nurturing, and review automation for clinics, schools, real estate, and hospitality.",
      },
      { property: "og:title", content: "Automation & AI Services | Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Automated workflows, AI chat agents, and lead nurturing that convert enquiries into booked clients — built for Himachal Pradesh businesses and beyond.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/automation-ai-services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Automation & AI Services | Shivaryan Infotech" },
      {
        name: "twitter:description",
        content: "Turn enquiries into booked clients automatically — WhatsApp, AI chat, CRM, and booking automation.",
      },
    ],
    links: [{ rel: "canonical", href: "/automation-ai-services" }],
  }),
  component: AutomationAIServices,
});

function AutomationAIServices() {
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
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Turn Enquiries Into Booked{" "}
            <span className="text-brand">Clients — Automatically</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            We build automation systems that respond instantly, qualify leads,
            book appointments, and follow up — so you never lose a customer to
            slow replies again.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl"
            >
              Book a Free Automation Audit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Services Included */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Services <span className="text-brand">Included</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              End-to-end automation that handles enquiries from first message to
              confirmed booking.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2">
            {servicesList.map((item) => (
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

      {/* Who This Is For */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Who This Is <span className="text-brand">For</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Built for local businesses that rely on fast, reliable
              communication with their customers.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industryCards.map((card) => {
              const Icon = card.icon;
              return (
                <StaggerItem key={card.title}>
                  <div className="flex flex-col items-center rounded-2xl border border-border/50 bg-surface p-6 text-center transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-1">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="rounded-2xl border border-brand/30 bg-brand/5 p-8 text-center md:p-10">
              <p className="text-lg font-semibold text-foreground md:text-xl">
                Want to see how much time and revenue you could recover?
              </p>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Free 15-minute automation audit — no commitment required.
              </p>
              <Link
                to="/contact"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-cta px-7 py-3 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl"
              >
                <Phone className="h-4 w-4" />
                Book Your Free Audit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
