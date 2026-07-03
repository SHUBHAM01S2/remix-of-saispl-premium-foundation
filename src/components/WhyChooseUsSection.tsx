import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const reasons = [
  {
    n: "01",
    title: "Technical Excellence & Innovation",
    description:
      "We architect cutting-edge solutions using the latest frameworks and AI models — always pushing boundaries to keep you ahead.",
  },
  {
    n: "02",
    title: "Reliable Delivery & Communication",
    description:
      "Transparent timelines, proactive updates, and disciplined execution. We treat every deadline as a commitment, not a suggestion.",
  },
  {
    n: "03",
    title: "Scalable AI-Driven Solutions",
    description:
      "Systems designed to grow with you. From startup traction to enterprise scale, our platforms adapt, automate, and accelerate.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="relative py-16 md:py-20">
      {/* Subtle grid + radial glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, color-mix(in oklab, var(--color-brand) 10%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-14 text-center">
          <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Core Values
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Why Global Clients Choose{" "}
            <span className="text-brand">Shivaryan Infotech</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Trusted by ambitious teams worldwide for quality, speed, and
            scale-ready technology.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {reasons.map((reason) => (
            <StaggerItem key={reason.title}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white/[0.04] hover:shadow-[0_0_30px_-10px_color-mix(in_oklab,var(--color-brand)_50%,transparent)] md:p-8">
                <div className="relative mb-6 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_color-mix(in_oklab,var(--color-brand)_80%,transparent)]" />
                  <span className="font-mono text-[11px] font-medium tracking-[0.15em] text-brand">
                    {reason.n}
                  </span>
                </div>
                <h3 className="relative mb-3 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
                  {reason.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
