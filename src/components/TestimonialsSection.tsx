import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollReveal } from "@/components/ScrollReveal";

type Testimonial = {
  id: string;
  client_name: string;
  company: string | null;
  country: string | null;
  quote: string;
  rating: number;
};

const FALLBACK: Testimonial[] = [
  {
    id: "f1",
    client_name: "Priya Sharma",
    company: "Himalayan Retreats",
    country: "India",
    quote:
      "Shivaryan Infotech rebuilt our booking flow end-to-end. Direct bookings are up 3x and we finally have a site that matches our brand.",
    rating: 5,
  },
  {
    id: "f2",
    client_name: "James O'Connor",
    company: "Northline Logistics",
    country: "United Kingdom",
    quote:
      "Their team delivered a custom operations portal on time and on budget. Communication across time zones was flawless.",
    rating: 5,
  },
  {
    id: "f3",
    client_name: "Aditi Verma",
    company: "Shivalik Clinic",
    country: "India",
    quote:
      "The WhatsApp automation books appointments while we sleep. It has genuinely changed how our front desk operates.",
    rating: 5,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(FALLBACK);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("testimonials" as never)
        .select("id, client_name, company, country, quote, rating, is_featured, created_at")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(9);
      if (cancelled) return;
      if (!error && Array.isArray(data) && data.length > 0) {
        setItems(data as unknown as Testimonial[]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => items.slice(0, Math.max(3, items.length)), [items]);
  const total = visible.length;

  useEffect(() => {
    if (total <= 1 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => window.clearInterval(id);
  }, [total, paused]);

  const current = visible[index] ?? visible[0];
  const go = (n: number) => setIndex(((n % total) + total) % total);

  return (
    <ScrollReveal>
      <section
        className="relative overflow-hidden border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Backdrop: subtle grid + radial brand glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_hsl(var(--brand))]" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Client Feedback
                </span>
              </div>
              <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Trusted by teams building{" "}
                <span className="text-brand">serious products.</span>
              </h2>
            </div>

            {total > 1 && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                  <span className="mx-1 opacity-40">/</span>
                  {String(total).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous testimonial"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-foreground/80 backdrop-blur transition hover:border-brand/40 hover:bg-brand/10 hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next testimonial"
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-foreground/80 backdrop-blur transition hover:border-brand/40 hover:bg-brand/10 hover:text-foreground"
                >
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Featured quote card */}
          <div className="relative mt-12">
            {/* Soft glow behind card */}
            <div className="pointer-events-none absolute -inset-x-6 -inset-y-6 rounded-[2rem] bg-gradient-to-br from-brand/10 via-transparent to-transparent blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl sm:rounded-3xl sm:p-8 md:p-14">
              {/* Corner ornament */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-3xl" />
              <Quote
                className="pointer-events-none absolute right-6 top-6 h-28 w-28 text-brand/10 md:h-40 md:w-40"
                aria-hidden="true"
              />

              <AnimatePresence mode="wait">
                <motion.figure
                  key={current.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-brand text-brand drop-shadow-[0_0_6px_hsl(var(--brand)/0.6)]"
                      />
                    ))}
                  </div>

                  <blockquote className="mt-6 max-w-4xl text-lg font-medium leading-relaxed tracking-tight text-foreground sm:text-2xl md:text-3xl md:leading-[1.35]">
                    <span className="text-brand">“</span>
                    {current.quote}
                    <span className="text-brand">”</span>
                  </blockquote>

                  <figcaption className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-brand/30 to-brand/5 font-mono text-sm font-semibold text-foreground">
                      {initials(current.client_name)}
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-foreground">
                        {current.client_name}
                      </div>
                      <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {current.company ?? "Independent"}
                        {current.country ? ` · ${current.country}` : ""}
                      </div>
                    </div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Marquee row - right to left */}
        {total > 1 && (
          <div
            className="relative mt-14 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
            aria-hidden="true"
          >
            <style>{`
              @keyframes testimonials-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .testimonials-marquee-track {
                animation: testimonials-marquee 40s linear infinite;
              }
              .testimonials-marquee-wrap:hover .testimonials-marquee-track {
                animation-play-state: paused;
              }
              @media (prefers-reduced-motion: reduce) {
                .testimonials-marquee-track { animation: none; }
              }
            `}</style>
            <div className="testimonials-marquee-wrap">
              <div className="testimonials-marquee-track flex w-max gap-4 sm:gap-6">
                {[...visible, ...visible].map((t, i) => (
                  <div
                    key={`${t.id}-${i}`}
                    className="w-[280px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl sm:w-[340px] md:w-[380px]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-brand/30 to-brand/5 font-mono text-[10px] font-semibold text-foreground">
                          {initials(t.client_name)}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold text-foreground">
                            {t.client_name}
                          </div>
                          {t.company && (
                            <div className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                              {t.company}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-0.5">
                        {Array.from({ length: t.rating }).map((_, s) => (
                          <Star key={s} className="h-3 w-3 fill-brand text-brand" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/80">
                      “{t.quote}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </ScrollReveal>
  );
}
