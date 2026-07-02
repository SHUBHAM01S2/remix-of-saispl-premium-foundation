import { Zap, ShieldCheck, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Technical Excellence & Innovation",
    description:
      "We architect cutting-edge solutions using the latest frameworks and AI models — always pushing boundaries to keep you ahead.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Delivery & Communication",
    description:
      "Transparent timelines, proactive updates, and disciplined execution. We treat every deadline as a commitment, not a suggestion.",
  },
  {
    icon: TrendingUp,
    title: "Scalable AI-Driven Solutions",
    description:
      "Systems designed to grow with you. From startup traction to enterprise scale, our platforms adapt, automate, and accelerate.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Global Clients Choose{" "}
            <span className="text-brand">Shivaryan Infotech</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Trusted by ambitious teams worldwide for quality, speed, and
            scale-ready technology.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="group relative rounded-2xl border border-border/50 bg-surface p-8 transition-all duration-300 hover:border-brand/30 hover:bg-surface-elevated hover:-translate-y-1"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
