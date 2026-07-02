import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function CTASection() {
  return (
    <ScrollReveal>
      <section className="relative overflow-hidden border-t border-[oklch(1_0_0_/_10%)] bg-[var(--color-surface)] px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl lg:text-5xl">
            Ready to build something exceptional?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-muted-foreground)]">
            Let&apos;s turn your ideas into powerful digital products. Whether it&apos;s AI-powered software, automation, or a complete digital transformation — we&apos;re here to make it happen.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-cta)] px-8 py-3.5 text-sm font-semibold text-[var(--color-cta-foreground)] shadow-lg transition-all hover:brightness-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cta)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]"
            >
              Get In Touch
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <a
              href="https://wa.me/919418031050"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[oklch(1_0_0_/_10%)] px-6 py-3.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-elevated)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">
            Or drop us a line at{" "}
            <a
              href="mailto:Help@saispl.com"
              className="font-medium text-[var(--color-brand)] underline underline-offset-4 transition-colors hover:text-[var(--color-foreground)]"
            >
              Help@saispl.com
            </a>
          </p>
        </div>
      </section>
    </ScrollReveal>
  );
}
