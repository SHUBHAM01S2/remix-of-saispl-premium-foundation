import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star } from "lucide-react";
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

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(FALLBACK);
  const [index, setIndex] = useState(0);

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

  const visible = items.slice(0, Math.max(3, items.length));

  useEffect(() => {
    if (visible.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % visible.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [visible.length]);

  const current = visible[index] ?? visible[0];

  return (
    <ScrollReveal>
      <section className="relative overflow-hidden border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            Client Feedback
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Trusted by teams building serious products
          </h2>

          <div className="relative mt-12 min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-surface p-8 text-left shadow-lg md:p-10"
              >
                <Quote className="h-8 w-8 text-brand/60" />
                <blockquote className="mt-4 text-lg leading-relaxed text-foreground md:text-xl">
                  “{current.quote}”
                </blockquote>
                <div className="mt-6 flex items-center gap-1 text-cta">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {current.client_name}
                  </span>
                  {current.company ? `, ${current.company}` : ""}
                  {current.country ? ` — ${current.country}` : ""}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {visible.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-brand" : "w-2 bg-border hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
