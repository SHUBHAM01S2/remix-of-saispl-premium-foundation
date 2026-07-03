import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Bot, Code2, Cpu, LayoutGrid, Boxes, Zap, Workflow } from "lucide-react";
import { motion } from "framer-motion";

// px offsets from horizontal center of the hero container
const orbitTiles = [
  { icon: Bot,        x: -420, y: -40,  size: 92, rot: -14, delay: 0.0 },
  { icon: Code2,      x: -320, y: 220,  size: 76, rot: 10,  delay: 0.15 },
  { icon: Cpu,        x: -500, y: 120,  size: 64, rot: -6,  delay: 0.25 },
  { icon: LayoutGrid, x: 380,  y: -60,  size: 84, rot: 12,  delay: 0.1 },
  { icon: Boxes,      x: 470,  y: 180,  size: 96, rot: -10, delay: 0.2 },
  { icon: Workflow,   x: 320,  y: 260,  size: 68, rot: 8,   delay: 0.3 },
  { icon: Zap,        x: -80,  y: -220, size: 56, rot: -18, delay: 0.35 },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* deep vignette + spotlight, no theme change */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, color-mix(in oklab, var(--color-brand) 14%, transparent), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 75%)",
        }}
      />
      {/* soft floor glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 100%, color-mix(in oklab, var(--color-brand) 22%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col items-center justify-center px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        {/* eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          Now booking Q3 2026 — 3 slots left
        </motion.div>

        {/* orbit tiles + headline */}
        <div className="relative w-full">
          {orbitTiles.map((t, i) => {
            const Icon = t.icon;
            return (
              <div
                key={i}
                className="pointer-events-none absolute hidden animate-in fade-in zoom-in-75 md:block"
                style={{
                  left: `calc(50% + ${t.x}px)`,
                  top: `calc(50% + ${t.y}px)`,
                  width: t.size,
                  height: t.size,
                  marginLeft: -t.size / 2,
                  marginTop: -t.size / 2,
                  animationDuration: "900ms",
                  animationDelay: `${350 + t.delay * 1000}ms`,
                  animationFillMode: "both",
                }}
              >
                <div
                  className="flex h-full w-full items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.10] to-white/[0.02] backdrop-blur-xl"
                  style={{
                    transform: `rotate(${t.rot}deg)`,
                    animation: `hero-float ${6 + i}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.1), 0 30px 80px -20px color-mix(in oklab, var(--color-brand) 45%, transparent)",
                  }}
                >
                  <Icon className="text-foreground/85" style={{ width: t.size * 0.42, height: t.size * 0.42 }} />
                </div>
              </div>
            );
          })}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-4xl text-center text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.98]"
          >
            Discover your path to{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent italic">
                intelligent software
              </span>
              <Sparkles className="absolute -right-8 -top-4 h-6 w-6 text-brand md:-right-10 md:-top-6 md:h-8 md:w-8" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto mt-8 max-w-xl text-center text-base text-muted-foreground sm:text-lg"
          >
            AI-powered software, automation and custom platforms — built by
            Shivaryan Infotech to help global teams ship faster and operate smarter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all hover:brightness-110"
            >
              Start a project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/our-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-white/[0.06]"
            >
              View our work
            </Link>
          </motion.div>
        </div>

        {/* social proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="relative mt-16 flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur"
        >
          <div className="flex -space-x-2">
            {["#3b82f6", "#8b5cf6", "#22d3ee", "#f97316"].map((c, i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full border-2 border-background"
                style={{ background: `linear-gradient(135deg, ${c}, color-mix(in oklab, ${c} 40%, black))` }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            <span className="font-semibold text-foreground">120+ global teams</span>{" "}
            already building with us
          </p>
        </motion.div>
      </div>
    </section>
  );
}
