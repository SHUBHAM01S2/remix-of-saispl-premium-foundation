import { Link } from "@tanstack/react-router";
import { Sparkles, BookOpen, ArrowRight, type LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

type QuickLink = {
  to?: string;
  href?: string;
  onClick?: () => void;
  label: string;
  icon?: LucideIcon;
};

export type PartnerEmptyStateProps = {
  /** Optional visual illustration replacement. If omitted, an icon medallion is rendered. */
  illustration?: ReactNode;
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  body: string;
  cta?: { label: string; to?: string; onClick?: () => void; icon?: LucideIcon };
  quickLinks?: QuickLink[];
  steps?: { title: string; body: string }[];
  tone?: "teal" | "emerald" | "amber" | "indigo" | "rose";
  compact?: boolean;
  className?: string;
};

const TONES: Record<NonNullable<PartnerEmptyStateProps["tone"]>, {
  medallion: string; blob1: string; blob2: string; ring: string; chip: string; ctaShadow: string;
}> = {
  teal: {
    medallion: "from-teal-500/25 to-cyan-500/10 text-teal-300",
    blob1: "bg-teal-500/10",
    blob2: "bg-cyan-500/10",
    ring: "ring-teal-400/25",
    chip: "bg-teal-400/15 text-teal-300 ring-teal-400/25",
    ctaShadow: "shadow-teal-500/25",
  },
  emerald: {
    medallion: "from-emerald-500/25 to-teal-500/10 text-emerald-300",
    blob1: "bg-emerald-500/10",
    blob2: "bg-teal-500/10",
    ring: "ring-emerald-400/25",
    chip: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/25",
    ctaShadow: "shadow-emerald-500/25",
  },
  amber: {
    medallion: "from-amber-500/25 to-orange-500/10 text-amber-300",
    blob1: "bg-amber-500/10",
    blob2: "bg-orange-500/10",
    ring: "ring-amber-400/25",
    chip: "bg-amber-400/15 text-amber-300 ring-amber-400/25",
    ctaShadow: "shadow-amber-500/25",
  },
  indigo: {
    medallion: "from-indigo-500/25 to-violet-500/10 text-indigo-300",
    blob1: "bg-indigo-500/10",
    blob2: "bg-violet-500/10",
    ring: "ring-indigo-400/25",
    chip: "bg-indigo-400/15 text-indigo-300 ring-indigo-400/25",
    ctaShadow: "shadow-indigo-500/25",
  },
  rose: {
    medallion: "from-rose-500/25 to-fuchsia-500/10 text-rose-300",
    blob1: "bg-rose-500/10",
    blob2: "bg-fuchsia-500/10",
    ring: "ring-rose-400/25",
    chip: "bg-rose-400/15 text-rose-300 ring-rose-400/25",
    ctaShadow: "shadow-rose-500/25",
  },
};

/**
 * Premium partner-portal empty state. Always shows an illustration area,
 * one-line explanation, and a clear primary CTA. Add `quickLinks` for
 * secondary actions like "View commission rules".
 */
export function PartnerEmptyState({
  illustration,
  icon,
  eyebrow,
  title,
  body,
  cta,
  quickLinks,
  steps,
  tone = "teal",
  compact,
  className = "",
}: PartnerEmptyStateProps) {
  const t = TONES[tone];
  const Icon = icon;
  const CtaIcon = cta?.icon ?? Sparkles;

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] text-center ${
        compact ? "px-6 py-10" : "px-6 py-12 sm:px-10 sm:py-14"
      } ${className}`}
    >
      <div className={`pointer-events-none absolute -top-20 -left-16 h-56 w-56 rounded-full blur-3xl ${t.blob1}`} />
      <div className={`pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full blur-3xl ${t.blob2}`} />

      <div className="relative">
        {/* Illustration */}
        <div className="mx-auto flex justify-center">
          {illustration ?? (
            <div className={`relative grid ${compact ? "h-14 w-14" : "h-16 w-16"} place-items-center rounded-2xl bg-gradient-to-br ${t.medallion} ring-1 ${t.ring}`}>
              {Icon ? <Icon className={compact ? "h-6 w-6" : "h-7 w-7"} /> : <Sparkles className="h-6 w-6" />}
              <span className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
            </div>
          )}
        </div>

        {eyebrow && (
          <p className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest ring-1 ${t.chip}`}>
            {eyebrow}
          </p>
        )}

        <h3 className={`mt-4 font-semibold tracking-tight ${compact ? "text-lg" : "text-xl"}`}>{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400 leading-relaxed">{body}</p>

        {steps && steps.length > 0 && (
          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3 text-left">
            {steps.map((s, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                <div className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-semibold ring-1 ${t.chip}`}>{i + 1}</div>
                <div className="mt-2 text-sm font-semibold">{s.title}</div>
                <div className="mt-1 text-xs text-slate-400 leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>
        )}

        {cta && (
          <div className="mt-6 flex justify-center">
            {cta.to ? (
              <Link
                to={cta.to}
                className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-5 py-2.5 text-sm shadow-lg ${t.ctaShadow} hover:brightness-110 transition`}
              >
                <CtaIcon className="h-4 w-4" /> {cta.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={cta.onClick}
                className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-5 py-2.5 text-sm shadow-lg ${t.ctaShadow} hover:brightness-110 transition`}
              >
                <CtaIcon className="h-4 w-4" /> {cta.label}
              </button>
            )}
          </div>
        )}

        {quickLinks && quickLinks.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            {quickLinks.map((ql, i) => {
              const QLIcon = ql.icon ?? ArrowRight;
              const cls =
                "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300 hover:text-slate-100 hover:bg-white/[0.07] hover:border-white/20 transition";
              const inner = (
                <>
                  <QLIcon className="h-3.5 w-3.5" /> {ql.label}
                </>
              );
              if (ql.to) return <Link key={i} to={ql.to} className={cls}>{inner}</Link>;
              if (ql.href) return <a key={i} href={ql.href} className={cls}>{inner}</a>;
              return (
                <button key={i} type="button" onClick={ql.onClick} className={cls}>
                  {inner}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------- Illustrations --------------------- */

export function ReferralIllustration({ Icon }: { Icon?: ComponentType<{ className?: string }> }) {
  return (
    <div className="relative h-24 w-56">
      <div className="absolute inset-x-6 bottom-0 h-16 rounded-t-2xl border border-teal-400/20 bg-gradient-to-b from-teal-400/10 to-transparent" />
      <div className="absolute left-1/2 top-1 -translate-x-1/2 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 shadow-xl shadow-teal-500/30 ring-4 ring-slate-950">
        {Icon ? <Icon className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </div>
      <div className="absolute left-2 bottom-3 h-9 w-16 rounded-xl border border-white/10 bg-slate-950/70" />
      <div className="absolute right-2 bottom-3 h-9 w-16 rounded-xl border border-white/10 bg-slate-950/70" />
    </div>
  );
}

export function CoinsIllustration() {
  return (
    <div className="relative h-24 w-40">
      <div className="absolute left-2 bottom-1 h-14 w-14 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg shadow-amber-500/30 ring-4 ring-slate-950" />
      <div className="absolute left-12 bottom-3 h-16 w-16 rounded-full bg-gradient-to-br from-emerald-300 to-teal-500 shadow-lg shadow-emerald-500/30 ring-4 ring-slate-950" />
      <div className="absolute left-24 bottom-1 h-14 w-14 rounded-full bg-gradient-to-br from-cyan-300 to-sky-500 shadow-lg shadow-cyan-500/30 ring-4 ring-slate-950" />
    </div>
  );
}
