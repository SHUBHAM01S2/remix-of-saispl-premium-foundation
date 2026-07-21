import { ScrollReveal } from "@/components/ScrollReveal";

const DARK_BG = "#1b1b1b";

const LOGOS = [
  { name: "Rukoo Services", src: "/logos/rukoo.png" },
  { name: "Accupressure E-learning", src: "/logos/acupressure.png" },
  { name: "Hotel Bandla Heights", src: "/logos/bandla.png" },
  { name: "Manali Miles", src: "/logos/manali-miles.png" },
  { name: "Derma Epsilon", src: "/logos/derma.png", bg: DARK_BG },
  { name: "Button Craft", src: "/logos/button-craft.png" },
  { name: "Dogra Ji Tours & Travels", src: "/logos/dogra.png" },
  { name: "AvtTours", src: "/logos/avttours.png" },
  { name: "Jevar by Shagun", src: "/logos/jevar.png", bg: DARK_BG },
  { name: "Sumit Enterprises", src: "/logos/sumit.png", bg: DARK_BG },
];



export function TrustedByStrip() {
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
            <ul className="flex w-max animate-marquee-rtl items-center gap-4 sm:gap-10 group-hover:[animation-play-state:paused]">
              {loop.map((logo, i) => (
                <li key={`${logo.name}-${i}`} className="shrink-0">
                  <div
                    className="flex h-24 w-[180px] items-center justify-center rounded-xl px-4 py-3 shadow-md ring-1 ring-black/10 transition-transform hover:-translate-y-0.5 sm:h-40 sm:w-[320px] sm:px-6 sm:py-5"
                    style={{ background: logo.bg ?? "#ffffff" }}
                    title={logo.name}
                  >
                    <img
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      loading="lazy"
                      className="max-h-20 max-w-full object-contain sm:max-h-36"
                    />
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
