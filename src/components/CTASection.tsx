import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GlobalReachNote } from "@/components/GlobalReachNote";

export function CTASection() {
  return (
    <ScrollReveal>
      <section className="relative overflow-hidden border-y border-white/10 bg-[#070707] px-6 py-32 md:py-40">
        {/* radial glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ background: "color-mix(in oklab, var(--color-brand) 8%, transparent)" }}
        />
        {/* subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-block text-[11px] font-bold uppercase tracking-[0.28em] text-brand">
            Let&apos;s build something exceptional
          </span>
          <h2 className="text-5xl font-extrabold tracking-tighter text-foreground md:text-7xl leading-[0.95]">
            Let&apos;s Build{" "}
            <span className="bg-gradient-to-b from-brand to-brand/60 bg-clip-text text-transparent italic">
              Yours
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Have a project in mind? We turn ambitious ideas into
            production-grade digital products through deep technical expertise.
            Scoping call within 24 hours.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background transition-transform hover:scale-105 sm:w-auto"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://web.whatsapp.com/send?phone=919418031050"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-10 py-5 text-sm font-bold text-foreground transition-all hover:border-white/20 hover:bg-white/[0.06] sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Or drop us a line at{" "}
            <a
              href="mailto:Help@saispl.com"
              className="font-medium text-foreground underline underline-offset-4 hover:text-brand"
            >
              Help@saispl.com
            </a>
          </p>

          <div className="mt-10 flex justify-center">
            <GlobalReachNote />
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
