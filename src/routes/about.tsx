import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, Award, Handshake, User } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We challenge the status quo with every project. By embracing emerging technologies and unconventional thinking, we deliver solutions that redefine what's possible for our clients.",
  },
  {
    icon: Award,
    title: "Quality Without Compromise",
    description:
      "From clean architecture to pixel-perfect interfaces, we refuse to cut corners. Rigorous testing, thoughtful design, and disciplined engineering are non-negotiables in everything we ship.",
  },
  {
    icon: Handshake,
    title: "Long-Term Partnerships",
    description:
      "We don't believe in one-off transactions. We invest in relationships, aligning our success with yours. Your growth is our mission — today, tomorrow, and years from now.",
  },
];

const stats = [
  { label: "Projects Delivered", value: "150+" },
  { label: "Happy Clients", value: "80+" },
  { label: "Years of Experience", value: "8+" },
  { label: "Countries Served", value: "12+" },
];

const team = [
  { name: "Rahul Sharma", role: "Founder & CEO" },
  { name: "Priya Patel", role: "Lead Developer" },
  { name: "Amit Verma", role: "AI & Automation Lead" },
  { name: "Neha Gupta", role: "Product Designer" },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Shivaryan Infotech — AI & Software Team from Himachal Pradesh" },
      {
        name: "description",
        content:
          "Shivaryan Infotech is an AI automation and software development company based in Himachal Pradesh, India, building custom software, AI agents, and web platforms for global clients.",
      },
      {
        name: "keywords",
        content:
          "about Shivaryan Infotech, AI company Himachal Pradesh, software development team India, AI automation experts, custom software developers, global software partner",
      },
      { property: "og:title", content: "About Shivaryan Infotech — AI & Software Team from Himachal Pradesh" },
      {
        property: "og:description",
        content:
          "AI automation and software development from Himachal Pradesh, serving clients across India and worldwide.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Shivaryan Infotech — AI & Software Team from Himachal Pradesh" },
      {
        name: "twitter:description",
        content:
          "AI and software development from Himachal Pradesh for global clients.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),

  component: About,
});

function About() {
  return (
    <div className="relative">
      {/* Hero / Header */}
      <section className="relative overflow-hidden pb-16 pt-24 md:pt-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12), transparent)",
          }}
        />
        <ScrollReveal className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            About <span className="text-brand">Shivaryan Infotech</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Driving innovation through technological excellence — building the
            digital infrastructure that powers tomorrow's industry leaders.
          </p>
        </ScrollReveal>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-border/50 bg-surface p-8 md:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Our Story
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Shivaryan Infotech was founded with a singular vision: to be the
                technology partner that businesses rely on when ordinary solutions
                won't do. From our base in Himachal Pradesh, we have grown into a
                global force — serving ambitious teams across continents with
                cutting-edge software, intelligent automation, and transformative
                digital products.
              </p>
              <p>
                We don't just write code; we engineer outcomes. Every project begins
                with deep curiosity about our client's business, followed by
                relentless execution. We push technological boundaries not for the
                sake of novelty, but because the problems we solve demand it.
              </p>
              <p>
                Today, Shivaryan Infotech stands at the intersection of AI,
                automation, and human-centered design — helping organizations scale
                faster, operate smarter, and lead their industries with confidence.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Values
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            The principles that guide every decision we make and every product we
            build.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <StaggerItem key={value.title}>
                <div className="group relative rounded-2xl border border-border/50 bg-surface p-8 transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-1">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="rounded-2xl border border-border/50 bg-surface p-6 text-center transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated">
                <div className="text-3xl font-bold text-brand sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Meet the Team
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            The people behind the products.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <StaggerItem key={member.name}>
              <div className="group relative rounded-2xl border border-border/50 bg-surface p-6 text-center transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-1">
                <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                  <User className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {member.role}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
}
