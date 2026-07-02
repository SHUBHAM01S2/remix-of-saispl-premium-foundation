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
  return (
    <section
      aria-label="Technology partners"
      className="border-t border-border/60 bg-background px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Technology partners & platforms we build with
        </p>
        <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {PARTNERS.map((name) => (
            <li key={name} className="flex justify-center">
              <div
                className="group flex h-11 min-w-[110px] items-center justify-center rounded-md border border-dashed border-border/40 px-3 text-xs font-semibold tracking-wide text-muted-foreground grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:border-brand/40 hover:text-brand"
                title={`${name} (logo placeholder)`}
              >
                {name}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
