import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Sparkles, Bot, Boxes, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GlobalReachNote } from "@/components/GlobalReachNote";

export function CTASection() {
  return (
    <ScrollReveal>
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-10 md:p-16">
          {/* background glows */}
          <div
            className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: "color-mix(in oklab, var(--color-brand) 30%, transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)",
            }}
          />

          <div className="relative grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center">
            {/* left: copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                Let&apos;s build something exceptional
              </span>

              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl leading-[1.05]">
                Ready to ship your next{" "}
                <span className="italic text-muted-foreground">AI-powered</span> product?
              </h2>
              <p className="mt-6 max-w-lg text-base text-muted-foreground">
                From AI agents and automation to full custom platforms — we turn
                ambitious ideas into production-grade software. Talk to us and get a
                scoping call within 24 hours.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all hover:brightness-110"
                >
                  Start a project
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="https://web.whatsapp.com/send?phone=919418031050"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-white/[0.06]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Or drop us a line at{" "}
                <a
                  href="mailto:Help@saispl.com"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-brand"
                >
                  Help@saispl.com
                </a>
              </p>

              <div className="mt-8">
                <GlobalReachNote />
              </div>
            </div>

            {/* right: floating tiles composition */}
            <div className="relative hidden h-[360px] md:block">
              {[
                { Icon: Bot,      cls: "top-4 left-8 h-24 w-24 rotate-[-8deg]" },
                { Icon: Boxes,    cls: "top-12 right-4 h-28 w-28 rotate-[10deg]" },
                { Icon: Workflow, cls: "bottom-10 left-16 h-20 w-20 rotate-[6deg]" },
                { Icon: Sparkles, cls: "bottom-4 right-12 h-24 w-24 rotate-[-12deg]" },
              ].map(({ Icon, cls }, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  className={`absolute flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02] backdrop-blur-xl ${cls}`}
                  style={{
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.1), 0 30px 80px -20px color-mix(in oklab, var(--color-brand) 45%, transparent)",
                  }}
                >
                  <Icon className="h-1/2 w-1/2 text-foreground/85" />
                </motion.div>
              ))}
              {/* center pulse */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.15] to-white/[0.03] backdrop-blur-xl">
                  <div
                    className="absolute inset-0 rounded-3xl opacity-70 blur-2xl"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 60%, transparent)" }}
                  />
                  <span className="relative text-2xl font-bold tracking-tight text-foreground">S</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
