import { ScrollReveal } from "@/components/ScrollReveal";

const LOGOS = [
  "Rukoo Services",
  "Accupressure E-learning",
  "Hotel Bandla Heights",
  "Manali Miles",
  "Derma Epsilon",
  "Button Craft",
  "Dogra Ji Tours & Travels",
  "AvtTours",
  "Jevar by Shagun",
  "Sumit Enterprises",
];

export function TrustedByStrip() {
  // Duplicate list for seamless marquee loop
  const loop = [...LOGOS, ...LOGOS];

  return (
    <ScrollReveal>
      <section
        aria-label="Trusted by"
        className="border-y border-border bg-background/60 px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by teams worldwide
          </p>

          <div
            className="group relative mt-6 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <ul className="flex w-max animate-marquee-rtl items-center gap-6 group-hover:[animation-play-state:paused]">
              {loop.map((name, i) => (
                <li key={`${name}-${i}`} className="shrink-0">
                  <div
                    className="flex h-12 w-[160px] items-center justify-center rounded-md border border-dashed border-border/40 px-4 text-sm font-semibold tracking-wide text-muted-foreground opacity-70 transition-all duration-300 hover:border-brand/30 hover:text-brand hover:opacity-100"
                    title={`${name} logo (placeholder)`}
                  >
                    {name}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
