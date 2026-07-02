import { ScrollReveal } from "@/components/ScrollReveal";

const LOGOS = [
  "Nexora",
  "Himalayan Retreats",
  "Northline",
  "Shivalik Clinic",
  "Solan Realty",
  "Paonta Motors",
];

export function TrustedByStrip() {
  return (
    <ScrollReveal>
      <section
        aria-label="Trusted by"
        className="border-y border-[oklch(1_0_0_/_6%)] bg-background/60 px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by teams worldwide
          </p>
          <ul className="mt-6 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-6">
            {LOGOS.map((name) => (
              <li key={name} className="flex justify-center">
                <div
                  className="group flex h-12 min-w-[120px] items-center justify-center rounded-md border border-dashed border-border/40 px-4 text-sm font-semibold tracking-wide text-muted-foreground grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:border-brand/30 hover:text-brand"
                  title={`${name} logo (placeholder)`}
                >
                  {name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ScrollReveal>
  );
}
