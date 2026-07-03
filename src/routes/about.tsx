import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Zap, Users, ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import ankitImg from "@/assets/team-ankit.jpg";
import shubhamImg from "@/assets/team-shubham.jpg";
import anujImg from "@/assets/team-anuj.jpg";
import studioImg from "@/assets/about-studio.jpg";

const stats = [
  { label: "Projects Delivered", value: "150+" },
  { label: "Happy Clients", value: "80+" },
  { label: "Years of Experience", value: "8+" },
  { label: "Countries Served", value: "12+" },
];

const values = [
  {
    icon: ShieldCheck,
    accent: "text-[#FF6B4E]",
    title: "Innovation First",
    description:
      "We challenge the status quo with every project — embracing emerging tech and unconventional thinking to deliver solutions that redefine what's possible for our clients.",
  },
  {
    icon: Zap,
    accent: "text-sky-500",
    title: "Quality Without Compromise",
    description:
      "From clean architecture to pixel-perfect interfaces, we refuse to cut corners. Rigorous testing and disciplined engineering are non-negotiables in everything we ship.",
  },
  {
    icon: Users,
    accent: "text-emerald-500",
    title: "Long-Term Partnerships",
    description:
      "We don't believe in one-off transactions. We invest in relationships, aligning our success with yours — today, tomorrow, and years from now.",
  },
];

const team = [
  { name: "Ankit Chandle", role: "Founder", img: ankitImg },
  { name: "Shubham Sharma", role: "Product Manager", img: shubhamImg },
  { name: "Anuj", role: "Full Stack Developer", img: anujImg },
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
      { property: "og:title", content: "About Shivaryan Infotech — AI & Software Team from Himachal Pradesh" },
      {
        property: "og:description",
        content:
          "AI automation and software development from Himachal Pradesh, serving clients across India and worldwide.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Shivaryan Infotech" },
      { name: "twitter:description", content: "AI and software development from Himachal Pradesh for global clients." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="relative isolate overflow-hidden bg-background text-foreground">
      {/* ambient background */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, color-mix(in oklab, var(--color-brand) 18%, transparent), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
        {/* Hero */}
        <section className="mb-24 flex flex-col items-center justify-between gap-16 lg:mb-28 lg:flex-row">
          <ScrollReveal className="max-w-2xl">
            <nav className="mb-8 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              <span>Home</span>
              <span className="h-px w-4 bg-white/20" />
              <span className="text-foreground">About</span>
            </nav>
            <h1 className="mb-8 text-5xl font-semibold leading-[0.98] tracking-tight md:text-6xl lg:text-7xl">
              Engineering the{" "}
              <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent italic">
                intelligent future.
              </span>
            </h1>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
              Driven by design. Powered by data. Focused on people. Shivaryan Infotech
              helps teams unlock their full potential with ethical, scalable, and
              user-first AI technology.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all hover:brightness-110"
              >
                Get in Touch
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="hidden text-sm font-medium text-muted-foreground sm:block">
                Trusted by 80+ teams worldwide
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal className="flex w-full flex-1 justify-center lg:justify-end">
            <div className="relative flex aspect-square w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur">
              <div
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                style={{ background: "color-mix(in oklab, var(--color-brand) 30%, transparent)" }}
              />
              <div className="relative mb-8 h-36 w-36">
                <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border-8 border-brand border-t-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-foreground">
                  98%
                </div>
              </div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Client Satisfaction
              </p>
              <p className="text-6xl font-bold tracking-tighter">150+</p>
              <p className="mt-1 text-xs text-muted-foreground">Projects Delivered</p>
            </div>
          </ScrollReveal>
        </section>

        {/* Story */}
        <section className="mb-24 grid items-center gap-16 lg:mb-28 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
              <img
                src={studioImg}
                alt="Shivaryan Infotech studio"
                width={1200}
                height={900}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
              Our story
            </p>
            <h2 className="mb-8 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              It all started with a frustration.
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              We were tired of bloated, clunky software that slowed teams down instead
              of lifting them up. So we built a better way — combining clean design,
              ethical AI, and intuitive functionality from our base in Himachal Pradesh.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              What began as a small side project is now a growing platform trusted by
              teams across the globe. Our mission remains the same: engineer outcomes,
              not just code — and make work more human along the way.
            </p>
          </ScrollReveal>
        </section>

        {/* Stats */}
        <section className="mb-24 lg:mb-28">
          <StaggerContainer className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 transition-all hover:border-white/20 hover:-translate-y-1 md:p-10">
                  <div
                    className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
                  />
                  <p className="relative mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="relative text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                    {stat.value}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Values */}
        <section className="mb-24 lg:mb-28">
          <ScrollReveal>
            <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                  What we believe in
                </p>
                <h2 className="text-4xl font-semibold tracking-tight md:text-5xl leading-[1.05]">
                  Principles that shape{" "}
                  <span className="italic text-muted-foreground">everything we ship.</span>
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Our values guide everything we create — from product design to how we
                work as a team.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <StaggerItem key={value.title}>
                  <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 transition-all duration-300 hover:border-white/20 hover:-translate-y-1 md:p-10">
                    <div
                      className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: "color-mix(in oklab, var(--color-brand) 35%, transparent)" }}
                    />
                    <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-inner">
                      <Icon className="h-6 w-6 text-foreground/90" />
                    </div>
                    <h3 className="relative mb-4 text-xl font-semibold text-foreground md:text-2xl">
                      {value.title}
                    </h3>
                    <p className="relative text-sm leading-relaxed text-muted-foreground md:text-base">
                      {value.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        {/* Why choose SAISPL */}
        <section className="mb-24 lg:mb-28">
          <ScrollReveal>
            <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                  Why SAISPL
                </p>
                <h2 className="text-4xl font-semibold tracking-tight md:text-5xl leading-[1.05]">
                  Why businesses{" "}
                  <span className="italic text-muted-foreground">choose SAISPL.</span>
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                We combine strategy, design, development, and automation to help
                businesses build stronger digital systems—not just better-looking
                websites. Every project is planned around performance, scalability,
                and measurable business impact.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { n: "01", title: "Strategy-First Thinking", desc: "Every build starts with clear goals, user research, and a roadmap tied to business outcomes." },
              { n: "02", title: "Full-Service Digital Execution", desc: "Strategy, design, engineering, and automation delivered under one accountable team." },
              { n: "03", title: "Conversion-Focused Delivery", desc: "We design for measurable impact—leads, sign-ups, and revenue, not vanity metrics." },
              { n: "04", title: "Transparent Communication", desc: "Clear timelines, honest updates, and direct access to the people building your product." },
              { n: "05", title: "Custom, Not Template-Based", desc: "Every interface and system is engineered around your brand, workflow, and audience." },
              { n: "06", title: "Fast & Scalable Builds", desc: "Modern stacks and clean architecture that ship quickly and grow with your business." },
              { n: "07", title: "Automation-Ready Systems", desc: "AI workflows and integrations baked in from day one to reduce cost and manual work." },
              { n: "08", title: "Reliable Ongoing Support", desc: "Care plans, monitoring, and a team that stays with you long after launch day." },
              { n: "09", title: "Global Quality Standards", desc: "Built to serve clients across India, the UK, Europe, and the US with world-class polish." },
              { n: "10", title: "Long-Term Growth Partnership", desc: "We invest in your roadmap—iterating, optimising, and scaling as your business evolves." },
            ].map((item) => (
              <StaggerItem key={item.n}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_10px_40px_-15px_color-mix(in_oklab,var(--color-brand)_60%,transparent)]">
                  <div
                    className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 35%, transparent)" }}
                  />
                  <p className="relative mb-5 font-mono text-[11px] font-semibold tracking-[0.2em] text-brand">
                    {item.n}
                  </p>
                  <h3 className="relative mb-3 text-base font-semibold leading-snug text-foreground md:text-lg">
                    {item.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal className="mt-12 flex flex-col items-center gap-4 text-center md:mt-14">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
            <p className="text-base font-medium tracking-tight text-foreground md:text-lg">
              Let's build something that{" "}
              <span className="italic text-muted-foreground">moves your business forward.</span>
            </p>
          </ScrollReveal>
        </section>

        {/* Team */}
        <section>
          <ScrollReveal className="mb-16 text-center lg:mb-20">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
              The team
            </p>
            <h2 className="mb-5 text-4xl font-semibold tracking-tight md:text-5xl leading-[1.05]">
              Meet the{" "}
              <span className="italic text-muted-foreground">founders.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              A close-knit team of designers, engineers, and thinkers united by one
              mission: building technology that makes life simpler, smarter, and more
              human.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <div className="group text-center">
                  <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                    <img
                      src={member.img}
                      alt={member.name}
                      width={640}
                      height={800}
                      loading="lazy"
                      className="h-full w-full scale-100 object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground md:text-2xl">{member.name}</h3>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
                    {member.role}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </div>
    </div>
  );
}
