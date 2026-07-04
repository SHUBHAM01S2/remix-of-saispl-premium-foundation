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

const LIGHT_GREY = "#e5e7eb";

const LOGOS = [
  { name: "Rukoo Services", src: rukoo.url },
  { name: "Accupressure E-learning", src: acupressure.url },
  { name: "Hotel Bandla Heights", src: bandla.url },
  { name: "Manali Miles", src: manaliMiles.url },
  { name: "Derma Epsilon", src: derma.url, bg: LIGHT_GREY },
  { name: "Button Craft", src: buttonCraft.url },
  { name: "Dogra Ji Tours & Travels", src: dogra.url },
  { name: "AvtTours", src: avttours.url },
  { name: "Jevar by Shagun", src: jevar.url, bg: LIGHT_GREY },
  { name: "Sumit Enterprises", src: sumit.url, bg: LIGHT_GREY },
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
