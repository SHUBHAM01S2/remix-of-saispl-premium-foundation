import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,185,241,0.08), transparent)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 80% 60%, rgba(0,46,110,0.04), transparent)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,46,110,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,46,110,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
          >
            We innovate and push technological boundaries to create{" "}
            <span className="bg-gradient-to-r from-brand to-cta bg-clip-text text-transparent">
              exceptional digital experiences
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
          >
            We build AI-powered software, intelligent automation, and transformative
            digital products that help global businesses scale faster, operate smarter,
            and lead their industries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="bg-cta text-cta-foreground hover:bg-cta/90 rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-cta/20"
              asChild
            >
              <Link to="/contact">
                Get In Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold border-2 border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <Link to="/our-works">View Our Work</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
