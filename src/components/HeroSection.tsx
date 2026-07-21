import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Globe2 } from "lucide-react";


const metrics = [
  { k: "120+", v: "Global teams" },
  { k: "68%", v: "Avg. time saved" },
  { k: "24h", v: "Scoping call" },
  { k: "9y+", v: "Shipping software" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Fine grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 40%, transparent 85%)",
        }}
      />

      {/* Primary blue halo behind headline */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] h-[620px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--color-brand) 28%, transparent), transparent 70%)",
        }}
      />

      {/* Soft off-axis abstract blurs for depth */}
      <div
        className="pointer-events-none absolute -left-40 top-24 h-[320px] w-[320px] rounded-full opacity-60 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-brand) 22%, transparent), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-16 h-[360px] w-[360px] rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-brand) 18%, transparent), transparent 70%)",
        }}
      />

      {/* Bottom fade into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-5xl flex-col items-center justify-center px-4 py-24 sm:px-6 md:py-28 lg:px-8">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          Now booking Q3 2026 — 3 slots left
        </div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-center text-5xl font-extrabold tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-[6.25rem] leading-[0.94]"
        >
          Intelligent{" "}
          <span className="relative inline-block text-brand">
            software
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 blur-2xl opacity-70"
              style={{
                background:
                  "radial-gradient(ellipse at center, color-mix(in oklab, var(--color-brand) 55%, transparent), transparent 70%)",
              }}
            />
          </span>
          ,
          <br />
          engineered to ship.
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-7 max-w-xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          AI agents, automation and custom platforms — built by Shivaryan
          Infotech to help global teams ship faster and operate smarter.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background shadow-[0_10px_40px_-10px_hsl(var(--brand)/0.5)] transition-all hover:scale-[1.02]"
          >
            Start a project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/our-works"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-7 py-4 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-white/20 hover:bg-white/[0.05]"
          >
            View our work
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* metric strip */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-4"
        >
          {metrics.map((m) => (
            <div
              key={m.k}
              className="bg-background/80 px-6 py-6 text-center backdrop-blur"
            >
              <div className="text-3xl font-extrabold tracking-tighter text-foreground">
                {m.k}
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {m.v}
              </div>
            </div>
          ))}
        </div>

        {/* global-serving pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur"
        >
          <Globe2 className="h-3.5 w-3.5 text-brand" />
          Serving clients in 12+ countries
        </div>
      </div>
    </section>
  );
}
