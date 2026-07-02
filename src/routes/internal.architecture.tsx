import { createFileRoute } from "@tanstack/react-router";
import { Lock, Server, TrendingUp, Bot, Layers } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/internal/architecture")({
  head: () => ({
    meta: [
      { title: "Internal — Sticky Service Architecture" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
      { name: "description", content: "Internal reference document. Not for public distribution." },
    ],
  }),
  component: InternalArchitecture,
});

const levels = [
  {
    n: 1,
    name: "Entry",
    icon: Server,
    color: "text-sky-400",
    items: ["Hosting", "Domain renewal", "Plugin / security updates"],
  },
  {
    n: 2,
    name: "Growth",
    icon: TrendingUp,
    color: "text-emerald-400",
    items: ["SEO", "Blog", "GBP management", "Analytics report"],
  },
  {
    n: 3,
    name: "Automation",
    icon: Bot,
    color: "text-amber-400",
    items: ["WhatsApp auto-reply", "AI chat agent", "CRM dashboard"],
  },
  {
    n: 4,
    name: "Core Infrastructure",
    icon: Layers,
    color: "text-fuchsia-400",
    items: [
      "Custom portals",
      "Internal tools",
      "Booking / payment / HR integrations",
    ],
  },
];

function InternalArchitecture() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Lock className="h-3.5 w-3.5" />
            Internal — Admin Only
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sticky Service Architecture
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Reference document. Do not share externally. Defines the four service levels used
            to structure monthly retainers and long-term client relationships.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {levels.map((lvl, i) => (
            <ScrollReveal key={lvl.n} delay={0.05 * i}>
              <div className="h-full rounded-2xl border border-border/50 bg-surface p-6">
                <div className="flex items-center gap-3">
                  <div className={"grid h-10 w-10 place-items-center rounded-xl bg-background " + lvl.color}>
                    <lvl.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Level {lvl.n}
                    </p>
                    <h2 className="text-lg font-semibold text-foreground">{lvl.name}</h2>
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {lvl.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2 rounded-lg border border-border/40 bg-background px-3 py-2 text-sm text-foreground"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} className="mt-10">
          <div className="rounded-2xl border border-border/50 bg-surface p-6 text-sm text-muted-foreground">
            <strong className="text-foreground">Usage notes:</strong> Each level compounds on
            the previous one. A client on Level 3 also receives everything in Levels 1 and 2.
            Level 4 is reserved for clients with custom software or portal builds.
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
