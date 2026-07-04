import { ScrollReveal } from "@/components/ScrollReveal";
import rukoo from "@/assets/logos/rukoo.png.asset.json";
import acupressure from "@/assets/logos/acupressure.png.asset.json";
import bandla from "@/assets/logos/bandla.png.asset.json";
import manaliMiles from "@/assets/logos/manali-miles.png.asset.json";
import derma from "@/assets/logos/derma.png.asset.json";
import buttonCraft from "@/assets/logos/button-craft.png.asset.json";
import dogra from "@/assets/logos/dogra.png.asset.json";
import avttours from "@/assets/logos/avttours.png.asset.json";
import jevar from "@/assets/logos/jevar.png.asset.json";
import sumit from "@/assets/logos/sumit.png.asset.json";

const LOGOS = [
  { name: "Rukoo Services", src: rukoo.url },
  { name: "Accupressure E-learning", src: acupressure.url },
  { name: "Hotel Bandla Heights", src: bandla.url },
  { name: "Manali Miles", src: manaliMiles.url },
  { name: "Derma Epsilon", src: derma.url },
  { name: "Button Craft", src: buttonCraft.url },
  { name: "Dogra Ji Tours & Travels", src: dogra.url },
  { name: "AvtTours", src: avttours.url },
  { name: "Jevar by Shagun", src: jevar.url },
  { name: "Sumit Enterprises", src: sumit.url },
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
            <ul className="flex w-max animate-marquee-rtl items-center gap-10 group-hover:[animation-play-state:paused]">
              {loop.map((logo, i) => (
                <li key={`${logo.name}-${i}`} className="shrink-0">
                  <div
                    className="flex h-16 w-[180px] items-center justify-center px-4"
                    title={logo.name}
                  >
                    <img
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      loading="lazy"
                      className="max-h-14 max-w-full object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
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
