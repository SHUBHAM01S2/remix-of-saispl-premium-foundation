import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const metrics = [
  { k: "120+", v: "Global teams" },
  { k: "68%", v: "Avg. time saved" },
  { k: "24h", v: "Scoping call" },
  { k: "9y+", v: "Shipping software" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* radial dot backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* soft blue wash top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, color-mix(in oklab, var(--color-brand) 14%, transparent), transparent 70%)",
        }}
      />
      {/* soft floor glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          background:
            "radial-gradient(ellipse 50% 100% at 50% 100%, color-mix(in oklab, var(--color-brand) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col items-center justify-center px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          Now booking Q3 2026 — 3 slots left
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl text-center text-6xl font-extrabold tracking-tighter text-foreground sm:text-7xl md:text-8xl lg:text-[7rem] leading-[0.92]"
        >
          Intelligent{" "}
          <span className="text-brand">software</span>,
          <br />
          engineered to ship.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-8 max-w-xl text-center text-base text-muted-foreground sm:text-lg leading-relaxed"
        >
          AI agents, automation and custom platforms — built by Shivaryan
          Infotech to help global teams ship faster and operate smarter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background transition-all hover:scale-[1.02]"
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
        </motion.div>

        {/* metric strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-4"
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
        </motion.div>
      </div>
    </section>
  );
}
