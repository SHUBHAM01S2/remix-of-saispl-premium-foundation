import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { iconForCapability } from "@/lib/capability-icons";


type CapabilityRow = {
  id: string;
  tag: string;
  title: string;
  description: string;
  meta: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
};

const fallback: CapabilityRow[] = [
  { id: "f1", tag: "Engineering", title: "Web & Software Development",
    description: "Scalable web apps and custom software built with modern stacks to power your business growth.",
    meta: "React · Node · TS", icon: "Globe", sort_order: 10, is_active: true },
  { id: "f2", tag: "AI · Automation", title: "AI & Automation Solutions",
    description: "Intelligent automation and AI-driven workflows that cut cost, eliminate bottlenecks, and accelerate outcomes.",
    meta: "LLMs · RAG · Agents", icon: "Cpu", sort_order: 20, is_active: true },
  { id: "f3", tag: "Platforms", title: "Custom Business Portals",
    description: "Tailored dashboards and portals that unify data, streamline operations, and give teams real-time visibility.",
    meta: "Dashboards · APIs", icon: "LayoutDashboard", sort_order: 30, is_active: true },
  { id: "f4", tag: "Design", title: "Digital Product Design",
    description: "User-centered design and prototyping that turns complex ideas into intuitive, high-converting products.",
    meta: "UX · UI · Motion", icon: "PenTool", sort_order: 40, is_active: true },
];

export function WhatWeDoSection() {
  const { data } = useQuery({
    queryKey: ["public", "capabilities"],
    queryFn: async (): Promise<CapabilityRow[]> => {
      const { data, error } = await (supabase as any)
        .from("capabilities")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error || !data || data.length === 0) return fallback;
      return data as CapabilityRow[];
    },
  });

  const capabilities = data ?? fallback;

  const filters = useMemo(() => {
    const tags = Array.from(new Set(capabilities.map((c) => c.tag)));
    return ["All", ...tags];
  }, [capabilities]);

  const [active, setActive] = useState<string>("All");
  const visible = active === "All" ? capabilities : capabilities.filter((c) => c.tag === active);

  return (
    <section className="relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              What we do
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl leading-[1.05]">
              End-to-end capabilities to <span className="italic text-muted-foreground">modernize, automate & scale.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  active === f
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <StaggerContainer key={active} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((cap) => {
            const Icon = iconForCapability(cap.icon);
            return (
              <StaggerItem key={cap.id} className="h-full">
                <Link
                  to="/contact"
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
                >
                  <div
                    className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "color-mix(in oklab, var(--color-brand) 40%, transparent)" }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {cap.tag}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>

                  <div className="relative mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-inner">
                    <Icon className="h-6 w-6 text-foreground/85" />
                  </div>

                  <h3 className="relative mt-6 text-lg font-semibold text-foreground">
                    {cap.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {cap.description}
                  </p>

                  {cap.meta && (
                    <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      <span>{cap.meta}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    </div>
                  )}
                </Link>
              </StaggerItem>

            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
