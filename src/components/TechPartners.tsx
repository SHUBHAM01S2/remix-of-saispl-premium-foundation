const PARTNERS = [
  "Supabase",
  "n8n",
  "OpenAI",
  "Vapi",
  "Retell AI",
  "Cal.com",
  "WhatsApp Business",
  "Stripe",
  "Cloudflare",
  "Vercel",
  "PostgreSQL",
  "Twilio",
];

export function TechPartners() {
  // Duplicate list so the marquee loop is seamless
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <section
      aria-label="Technology partners"
      className="border-y border-border/60 bg-background px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Technology partners & platforms we build with
        </p>

        <div
          className="group relative mt-8 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <ul className="flex w-max animate-marquee-rtl gap-4 group-hover:[animation-play-state:paused]">
            {loop.map((name, i) => (
              <li key={`${name}-${i}`} className="shrink-0">
                <div
                  className="flex h-11 min-w-[140px] items-center justify-center rounded-md border border-dashed border-border/40 px-4 text-xs font-semibold tracking-wide text-muted-foreground grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:border-brand/40 hover:text-brand"
                  title={`${name} (logo placeholder)`}
                >
                  {name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
