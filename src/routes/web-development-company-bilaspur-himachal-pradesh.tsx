import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Globe,
  Cpu,
  LayoutDashboard,
  PenTool,
  Search,
  Wrench,
  Check,
  Plus,
  Minus,
  Building2,
  GraduationCap,
  Hotel,
  Home,
  Store,
  Mountain,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";

const CITY = "Bilaspur";
const REGION = "Himachal Pradesh";
const LOCATION = `${CITY}, ${REGION}`;
const URL_PATH = "/web-development-company-bilaspur-himachal-pradesh";

const SEO_TITLE = `Web Development & Software Company in ${LOCATION} | SAISPL`;
const SEO_DESCRIPTION = `Looking for a web development, software, or AI automation company in ${LOCATION}? Shivaryan Infotech (SAISPL) is a ${CITY}-based team building custom websites, business portals, and AI workflows for local businesses across ${REGION} and clients in 12+ countries.`;

const faqs = [
  {
    q: `Are you a local web development company based in ${CITY}?`,
    a: `Yes. Shivaryan Infotech (SAISPL) is headquartered in ${CITY}, ${REGION}. Our design, development, and support team works from ${CITY} and serves clients across Himachal Pradesh — Shimla, Mandi, Kullu, Manali, Solan, Hamirpur, Una, Bilaspur — and globally.`,
  },
  {
    q: `Do you work with small businesses and shops in ${REGION}?`,
    a: `Absolutely. A large share of our local clients are hotels, home-stays, clinics, coaching institutes, real-estate agents, and retail shops across ${REGION}. We offer starter website packages designed specifically for small ${REGION} businesses that need an online presence fast.`,
  },
  {
    q: `Can you meet in person in ${CITY} for project discussions?`,
    a: `Yes. Clients based in ${CITY} and nearby towns can visit our office for scoping, design reviews, and training. For clients further away in ${REGION}, we run everything on Google Meet / Zoom and travel on-site for larger engagements.`,
  },
  {
    q: `How much does a business website cost in ${REGION}?`,
    a: `Starter local business websites begin at an affordable ${REGION} price point, with growth and premium tiers for larger brands. Every quote is scoped after a free discovery call so you only pay for what your business actually needs. See our pricing page for tier details.`,
  },
  {
    q: `Do you build websites in Hindi as well as English?`,
    a: `Yes. We build bilingual and multi-language websites, which is especially useful for tourism, hospitality, and government-adjacent businesses in ${REGION} that serve both Hindi- and English-speaking audiences.`,
  },
  {
    q: `Can you also handle Google Business Profile and local SEO in ${CITY}?`,
    a: `Yes. Alongside website design, we set up and optimise your Google Business Profile, local citations, and on-page SEO so your business shows up when people in ${CITY} and ${REGION} search for your services on Google Maps and Search.`,
  },
];

const services = [
  {
    icon: Globe,
    title: "Website Design & Development",
    desc: `Custom, mobile-first websites for ${REGION} businesses — hotels, clinics, schools, real estate, retail, and startups.`,
    to: "/web-design-development",
  },
  {
    icon: Cpu,
    title: "AI Automation & AI Agents",
    desc: `WhatsApp bots, booking automations, and AI agents that handle enquiries and back-office work for ${CITY}-area businesses.`,
    to: "/automation-ai-services",
  },
  {
    icon: LayoutDashboard,
    title: "Custom Portals & Software",
    desc: `Admin dashboards, booking systems, CRM, and internal tools built for how your ${REGION} team actually operates.`,
    to: "/custom-portals-software",
  },
  {
    icon: Search,
    title: "SEO & Digital Marketing",
    desc: `Local SEO, Google Business Profile, and content marketing so ${CITY} customers find you first.`,
    to: "/seo-digital-marketing",
  },
  {
    icon: PenTool,
    title: "Branding & Graphic Design",
    desc: `Logo, identity, and print design that positions your ${REGION} brand as premium and trustworthy.`,
    to: "/branding-graphic-design",
  },
  {
    icon: Wrench,
    title: "Care & Maintenance",
    desc: `Hosting, security patches, backups, and content updates so your site stays fast and safe.`,
    to: "/care-maintenance",
  },
];

const audience = [
  { icon: Hotel, label: `Hotels & Home-stays in ${REGION}` },
  { icon: Building2, label: "Clinics & Hospitals" },
  { icon: GraduationCap, label: "Schools & Coaching Institutes" },
  { icon: Home, label: "Real Estate Agencies" },
  { icon: Store, label: "Retail & Local Service Businesses" },
  { icon: Mountain, label: "Tourism & Adventure Operators" },
];

const whyLocal = [
  {
    title: `Based in ${CITY}, working across ${REGION}`,
    desc: `We're not a remote-only vendor. Our team lives and works in ${CITY} — so we understand ${REGION} customers, seasons (peak tourism months, exam cycles, festival demand), and local buying behaviour.`,
  },
  {
    title: "In-person meetings and on-site support",
    desc: `Prefer face-to-face? We meet ${CITY} clients in person for scoping, design reviews, and training. On-site visits for larger engagements across Shimla, Mandi, Manali, Solan, and Hamirpur are included in enterprise plans.`,
  },
  {
    title: "Fast turnaround, honest quotes in INR",
    desc: `Transparent pricing in ₹ (no hidden dollar-priced surprises), realistic timelines, and starter packages sized for ${REGION} SMB budgets. Growth and premium tiers scale up as you do.`,
  },
  {
    title: "Global engineering standards",
    desc: `Even though we're a local ${CITY} team, we ship the same Next.js / TanStack / TypeScript stack we use for clients in the UK, US, UAE, and Australia — so ${REGION} businesses get world-class code, not a template.`,
  },
];

export const Route = createFileRoute("/web-development-company-bilaspur-himachal-pradesh")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESCRIPTION },
      {
        name: "keywords",
        content: `web development company ${CITY}, website design ${CITY}, software company ${REGION}, AI automation ${REGION}, web developer ${CITY}, best web design company ${REGION}, ${CITY} website designer, local SEO ${CITY}, Shivaryan Infotech ${CITY}, SAISPL`,
      },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "geo.region", content: "IN-HP" },
      { name: "geo.placename", content: `${CITY}, ${REGION}` },
      { name: "geo.position", content: "31.3383;76.7615" },
      { name: "ICBM", content: "31.3383, 76.7615" },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL_PATH },
      { property: "og:site_name", content: "Shivaryan Infotech" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ShivaryanInfotech" },
      { name: "twitter:title", content: SEO_TITLE },
      { name: "twitter:description", content: SEO_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL_PATH }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${URL_PATH}#localbusiness`,
          name: "Shivaryan Infotech (SAISPL)",
          alternateName: "SAISPL",
          description: SEO_DESCRIPTION,
          url: `https://shivaryaninfotech.com${URL_PATH}`,
          telephone: "+91-94180-31050",
          email: "shivaryaninfotech@gmail.com",
          image: "https://shivaryaninfotech.com/saispl-logo.png",
          priceRange: "₹₹",
          address: {
            "@type": "PostalAddress",
            streetAddress: CITY,
            addressLocality: CITY,
            addressRegion: REGION,
            postalCode: "174001",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 31.3383,
            longitude: 76.7615,
          },
          areaServed: [
            { "@type": "City", name: CITY },
            { "@type": "City", name: "Shimla" },
            { "@type": "City", name: "Mandi" },
            { "@type": "City", name: "Kullu" },
            { "@type": "City", name: "Manali" },
            { "@type": "City", name: "Solan" },
            { "@type": "City", name: "Hamirpur" },
            { "@type": "City", name: "Una" },
            { "@type": "AdministrativeArea", name: REGION },
          ],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "09:30",
              closes: "19:00",
            },
          ],
          makesOffer: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              url: s.to,
              areaServed: LOCATION,
            },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Services", item: "/services" },
            {
              "@type": "ListItem",
              position: 3,
              name: `Web Development in ${LOCATION}`,
              item: URL_PATH,
            },
          ],
        }),
      },
    ],
  }),
  component: BilaspurLandingPage,
});

function BilaspurLandingPage() {
  return (
    <div className="bg-background text-zinc-300">
      {/* HERO */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--color-brand)_14%,transparent),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            <MapPin className="h-3 w-3" />
            {LOCATION} · India
          </span>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Web Development & AI Automation Company in{" "}
            <span className="bg-gradient-to-b from-brand to-indigo-400 bg-clip-text italic text-transparent">
              {LOCATION}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Shivaryan Infotech (SAISPL) is a {CITY}-based software team building
            fast, SEO-ready websites, custom business portals, and AI automations
            for hotels, clinics, schools, real-estate agents, and startups across{" "}
            {REGION} — and clients in 12+ countries.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background transition-transform hover:scale-[1.02]"
            >
              Get a Free Local Quote
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+919418031050"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-bold text-foreground hover:border-brand/40"
            >
              <Phone className="h-4 w-4" />
              +91 94180 31050
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand" /> Local {CITY} team</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand" /> Transparent INR pricing</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand" /> Hindi + English support</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand" /> 9+ years shipping software</span>
          </div>
        </div>
      </section>

      {/* WHY LOCAL */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mb-10">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Why {CITY} businesses choose SAISPL
          </span>
          <h2 className="max-w-3xl text-3xl font-black tracking-tight text-foreground md:text-4xl">
            A software team that actually knows {REGION}.
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Most agencies pitching {REGION} businesses are based in Delhi,
            Chandigarh, or Bengaluru — they don't know the local market, don't
            answer in your timezone-adjacent hours, and don't understand what a{" "}
            {CITY} clinic or a Manali hotel actually needs from a website. We do.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {whyLocal.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-brand/30"
            >
              <h3 className="text-lg font-bold text-foreground">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-y border-white/5 bg-white/[0.01] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              Services in {LOCATION}
            </span>
            <h2 className="max-w-3xl text-3xl font-black tracking-tight text-foreground md:text-4xl">
              End-to-end software & marketing under one roof.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white/[0.06]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                    Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mb-10">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Who we build for in {REGION}
          </span>
          <h2 className="max-w-3xl text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Trusted by local {REGION} businesses.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {audience.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <span className="text-xs font-semibold text-foreground/90">
                  {a.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* AREAS SERVED */}
      <section className="border-y border-white/5 bg-white/[0.01] py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            Areas We Serve
          </span>
          <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            {CITY} & every district of {REGION}.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We work with clients across ${REGION}. Common project locations
            include:
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Bilaspur", "Shimla", "Mandi", "Kullu", "Manali", "Solan", "Hamirpur", "Una", "Chamba", "Kangra", "Dharamshala", "Nahan"].map(
              (c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-foreground/85"
                >
                  {c}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
            {CITY} FAQs
          </span>
          <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Common questions from {REGION} clients.
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-[#050505] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-foreground md:text-5xl">
            Let's build something great in {CITY}.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Book a free 30-minute strategy call. We'll audit your current
            website, understand your {REGION} audience, and share a clear next
            step — no pressure, no jargon.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background hover:scale-[1.02]"
            >
              Book a Free Call <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:shivaryaninfotech@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-bold text-foreground hover:border-brand/40"
            >
              <Mail className="h-4 w-4" />
              shivaryaninfotech@gmail.com
            </a>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            Explore our{" "}
            <Link to="/" className="text-brand hover:underline">home</Link>,{" "}
            <Link to="/services" className="text-brand hover:underline">all services</Link>,{" "}
            <Link to="/pricing" className="text-brand hover:underline">pricing</Link>, and{" "}
            <Link to="/our-works" className="text-brand hover:underline">portfolio</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
      >
        <span className="text-base font-semibold text-foreground">{q}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-brand">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0">
          <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}
