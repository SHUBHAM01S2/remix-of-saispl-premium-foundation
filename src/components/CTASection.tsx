import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GlobalReachNote } from "@/components/GlobalReachNote";

const STATS = [
  { value: "24h", label: "Scoping call" },
  { value: "60+", label: "Projects shipped" },
  { value: "12", label: "Countries served" },
  { value: "5★", label: "Avg. client rating" },
];

export function CTASection() {
  return (
    <ScrollReveal>
      <section className="relative overflow-hidden border-y border-white/10 bg-[#050505] px-6 py-32 md:py-40">
        {/* Aurora blobs */}
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: "color-mix(in oklab, var(--color-brand) 14%, transparent)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-40 left-[15%] h-[380px] w-[520px] rounded-full blur-[130px]"
          style={{ background: "color-mix(in oklab, var(--color-brand) 8%, transparent)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-40 right-[10%] h-[340px] w-[420px] rounded-full blur-[130px]"
          style={{ background: "color-mix(in oklab, #a855f7 6%, transparent)" }}
        />

        {/* Grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
          }}
        />

        {/* Noise / vignette */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute left-[8%] top-[22%] hidden md:block">
          <div className="h-2 w-2 animate-pulse rounded-full bg-brand shadow-[0_0_20px_hsl(var(--brand))]" />
        </div>
        <div className="pointer-events-none absolute right-[10%] top-[38%] hidden md:block">
          <div
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand shadow-[0_0_16px_hsl(var(--brand))]"
            style={{ animationDelay: "1.2s" }}
          />
        </div>
        <div className="pointer-events-none absolute left-[18%] bottom-[22%] hidden md:block">
          <div
            className="h-1 w-1 animate-pulse rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            style={{ animationDelay: "0.6s" }}
          />
        </div>

        {/* Corner brackets */}
        <div className="pointer-events-none absolute left-6 top-6 hidden h-8 w-8 border-l border-t border-white/20 md:block" />
        <div className="pointer-events-none absolute right-6 top-6 hidden h-8 w-8 border-r border-t border-white/20 md:block" />
        <div className="pointer-events-none absolute left-6 bottom-6 hidden h-8 w-8 border-b border-l border-white/20 md:block" />
        <div className="pointer-events-none absolute right-6 bottom-6 hidden h-8 w-8 border-b border-r border-white/20 md:block" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Availability pill */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/80">
              Now booking · Q3 2026
            </span>
          </div>

          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-brand" />
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
              <Sparkles className="h-3 w-3" />
              Let&apos;s build something exceptional
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-brand" />
          </div>

          <h2 className="text-5xl font-extrabold leading-[0.95] tracking-tighter text-foreground md:text-7xl lg:text-8xl">
            Let&apos;s Build{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-br from-brand via-brand to-brand/50 bg-clip-text italic text-transparent">
                Yours
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/40 to-transparent bg-clip-text italic text-transparent blur-2xl"
              >
                Yours
              </span>
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Have a project in mind? We turn ambitious ideas into
            production-grade digital products through deep technical expertise.
            Scoping call within 24 hours.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background shadow-[0_20px_60px_-15px_rgba(255,255,255,0.35)] transition-all hover:scale-[1.03] hover:shadow-[0_25px_70px_-15px_rgba(255,255,255,0.5)] sm:w-auto"
            >
              <span className="relative z-10">Start a Project</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <a
              href="https://web.whatsapp.com/send?phone=919418031050"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-10 py-5 text-sm font-bold text-foreground backdrop-blur-xl transition-all hover:border-brand/40 hover:bg-brand/[0.08] sm:w-auto"
            >
              <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
              Chat on WhatsApp
            </a>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Or drop us a line at{" "}
            <EmailContactLink
              source="cta-section"
              subject="Project enquiry from CTA"
              className="font-medium text-foreground underline underline-offset-4 transition hover:text-brand"
            >
              Help@saispl.com
            </EmailContactLink>
          </p>


          {/* Stats strip */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="group relative bg-[#0a0a0a]/80 px-4 py-5 transition-colors hover:bg-brand/[0.06]"
              >
                <div className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.label}
                </div>
                <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px scale-x-0 bg-brand/60 transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <GlobalReachNote />
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
