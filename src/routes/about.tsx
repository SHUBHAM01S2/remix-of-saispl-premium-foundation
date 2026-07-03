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
    <div className="bg-[#FDFDFD] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-28">
        {/* Hero */}
        <section className="mb-32 flex flex-col items-center justify-between gap-16 lg:mb-40 lg:flex-row">
          <ScrollReveal className="max-w-2xl">
            <nav className="mb-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-400">
              <span>Home</span>
              <span className="h-px w-4 bg-slate-200" />
              <span className="text-slate-900">About</span>
            </nav>
            <h1 className="mb-10 text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              Engineering the intelligent future.
            </h1>
            <p className="mb-12 max-w-lg text-lg leading-relaxed text-slate-500 md:text-xl">
              Driven by design. Powered by data. Focused on people. Shivaryan Infotech
              helps teams unlock their full potential with ethical, scalable, and
              user-first AI technology.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/contact"
                className="group flex items-center gap-2 rounded-full bg-[#FF6B4E] px-10 py-5 font-semibold text-white shadow-xl shadow-orange-100 transition-all hover:bg-[#EE5A3D]"
              >
                Get in Touch
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="hidden font-medium text-slate-400 sm:block">
                Trusted by 80+ teams worldwide
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal className="flex w-full flex-1 justify-center lg:justify-end">
            <div className="relative flex aspect-square w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-[3rem] border border-slate-100 bg-slate-50 p-10 text-center">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-100/40 blur-3xl" />
              <div className="relative mb-8 h-36 w-36">
                <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border-8 border-[#FF6B4E] border-t-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-slate-800">
                  98%
                </div>
              </div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Client Satisfaction
              </p>
              <p className="text-6xl font-bold tracking-tighter">150+</p>
              <p className="mt-1 text-xs text-slate-400">Projects Delivered</p>
            </div>
          </ScrollReveal>
        </section>

        {/* Story */}
        <section className="mb-32 grid items-center gap-16 lg:mb-40 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal>
            <div className="overflow-hidden rounded-[2.5rem]">
              <img
                src={studioImg}
                alt="Shivaryan Infotech studio"
                width={1200}
                height={900}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <h2 className="mb-10 text-3xl font-bold leading-tight md:text-4xl">
              It all started with a frustration.
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-slate-500">
              We were tired of bloated, clunky software that slowed teams down instead
              of lifting them up. So we built a better way — combining clean design,
              ethical AI, and intuitive functionality from our base in Himachal Pradesh.
            </p>
            <p className="text-lg leading-relaxed text-slate-500">
              What began as a small side project is now a growing platform trusted by
              teams across the globe. Our mission remains the same: engineer outcomes,
              not just code — and make work more human along the way.
            </p>
          </ScrollReveal>
        </section>

        {/* Stats */}
        <section className="mb-32 lg:mb-40">
          <StaggerContainer className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="rounded-[2rem] border border-slate-100 bg-white p-8 transition-colors hover:border-slate-200 md:p-10">
                  <p className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-bold tracking-tighter md:text-5xl">
                    {stat.value}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Values */}
        <section className="mb-32 lg:mb-40">
          <ScrollReveal>
            <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end lg:mb-20">
              <div className="max-w-xl">
                <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                  What we believe in.
                </h2>
                <div className="h-1 w-20 rounded-full bg-[#FF6B4E]" />
              </div>
              <p className="max-w-xs leading-relaxed text-slate-500">
                Our values guide everything we create — from product design to how we
                work as a team.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <StaggerItem key={value.title}>
                  <div className="group h-full rounded-[2.5rem] border border-slate-100/60 bg-slate-50 p-10 transition-all duration-500 hover:border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-100 md:p-12">
                    <div
                      className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ${value.accent}`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-6 text-2xl font-bold">{value.title}</h3>
                    <p className="leading-relaxed text-slate-500">
                      {value.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        {/* Team */}
        <section>
          <ScrollReveal className="mb-20 text-center lg:mb-24">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Meet the founders.
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500">
              A close-knit team of designers, engineers, and thinkers united by one
              mission: building technology that makes life simpler, smarter, and more
              human.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <div className="group text-center">
                  <div className="relative mb-8 aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100">
                    <img
                      src={member.img}
                      alt={member.name}
                      width={640}
                      height={800}
                      loading="lazy"
                      className="h-full w-full scale-100 object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
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
