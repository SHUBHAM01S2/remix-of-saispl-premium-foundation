import { useEffect, useState } from "react";
import { Star } from "lucide-react";
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("testimonials" as never)
        .select("id, client_name, company, country, quote, rating, is_featured, created_at")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(12);
      if (cancelled) return;
      if (!error && Array.isArray(data) && data.length > 0) {
        setItems(data as unknown as Testimonial[]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Ensure enough cards for a smooth loop
  const base = items.length < 6 ? [...items, ...items, ...items].slice(0, Math.max(6, items.length)) : items;
  const loop = [...base, ...base];

  return (
    <ScrollReveal>
      <section className="relative overflow-hidden border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8">
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
        <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[880px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col items-start gap-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_hsl(var(--brand))]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Client Feedback
              </span>
            </div>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Trusted by teams building{" "}
              <span className="text-brand">serious products.</span>
            </h2>
          </div>
        </div>

        {/* Marquee row - right to left */}
        <div
          className="relative mt-14 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <style>{`
            @keyframes testimonials-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .testimonials-marquee-track {
              animation: testimonials-marquee 60s linear infinite;
              will-change: transform;
            }
            .testimonials-marquee-wrap:hover .testimonials-marquee-track {
              animation-play-state: paused;
            }
            @media (prefers-reduced-motion: reduce) {
              .testimonials-marquee-track { animation: none; }
            }
          `}</style>
          <div className="testimonials-marquee-wrap">
            <div className="testimonials-marquee-track flex w-max items-stretch gap-4 sm:gap-6">
              {loop.map((t, i) => (
                <article
                  key={`${t.id}-${i}`}
                  className="flex min-h-[200px] w-[280px] min-w-[280px] shrink-0 flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-[0_0_0_1px_hsl(var(--brand)/0)] backdrop-blur-xl transition-colors hover:border-brand/30 hover:shadow-[0_0_40px_-12px_hsl(var(--brand)/0.35)] sm:w-[340px] sm:min-w-[320px] md:w-[360px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-brand/30 to-brand/5 font-mono text-[11px] font-semibold text-foreground">
                        {initials(t.client_name)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-foreground">
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
                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-foreground/80">
                    “{t.quote}”
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
