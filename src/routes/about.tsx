import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, Award, Handshake, User } from "lucide-react";

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

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Shivaryan Infotech" },
      { name: "description", content: "Learn about Shivaryan Infotech's mission, story, and values. We innovate and push technological boundaries to create exceptional digital experiences." },
      { property: "og:title", content: "About Us — Shivaryan Infotech" },
      { property: "og:description", content: "Learn about Shivaryan Infotech's mission, story, and values. We innovate and push technological boundaries to create exceptional digital experiences." },
    ],
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
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            About <span className="text-brand">Shivaryan Infotech</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Driving innovation through technological excellence — building the
            digital infrastructure that powers tomorrow's industry leaders.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
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
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Values
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            The principles that guide every decision we make and every product we
            build.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="group relative rounded-2xl border border-border/50 bg-surface p-8 transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-1"
              >
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
            );
          })}
        </div>
      </section>
    </div>
  );
}
