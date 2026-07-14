import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

type Item = { to: string; title: string; desc: string; label: string };

const SERVICES: Item[] = [
  { to: "/web-design-development", title: "Web design & development", desc: "Conversion-focused websites and web apps built to scale.", label: "Service" },
  { to: "/seo-digital-marketing", title: "SEO & digital marketing", desc: "Organic growth, paid, and content that compounds.", label: "Service" },
  { to: "/automation-ai-services", title: "Automation & AI", desc: "Workflows, agents, and integrations that save hours.", label: "Service" },
  { to: "/branding-graphic-design", title: "Branding & graphic design", desc: "Identity systems, marketing assets, and brand guidelines.", label: "Service" },
  { to: "/custom-portals-software", title: "Custom portals & software", desc: "Client portals, dashboards, and internal tools.", label: "Service" },
  { to: "/care-maintenance", title: "Care & maintenance", desc: "Uptime, backups, security patches, and monthly updates.", label: "Service" },
];

const EXTRAS: Item[] = [
  { to: "/our-works", title: "Case studies", desc: "See how we build, launch, and scale for our clients.", label: "Work" },
  { to: "/blog/ai-automation-small-business-india", title: "AI automation for small business", desc: "Practical automations Indian SMBs can ship in a week.", label: "Blog" },
  { to: "/pricing", title: "Pricing & packages", desc: "Transparent packages across web, SEO, and automation.", label: "Pricing" },
  { to: "/web-development-company-bilaspur-himachal-pradesh", title: "Web development — Bilaspur (HP)", desc: "Local web development, SEO, and support for Himachal Pradesh businesses.", label: "Location" },
];

export function RelatedLinks({
  currentPath,
  heading = "Continue exploring",
  eyebrow = "Related",
  max = 6,
}: {
  currentPath: string;
  heading?: string;
  eyebrow?: string;
  max?: number;
}) {
  const items = [...SERVICES, ...EXTRAS].filter((i) => i.to !== currentPath).slice(0, max);
  return (
    <section aria-label={heading} className="border-t border-white/10 bg-[#0a0a0a] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{heading}</h2>
          </div>
          <Link to="/services" className="hidden text-sm font-semibold text-brand hover:underline md:inline">
            All services →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-colors hover:border-brand/40"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/80">{i.label}</span>
                <h3 className="mt-2 text-lg font-bold text-foreground">{i.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{i.desc}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                Read more <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
