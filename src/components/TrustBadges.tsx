import { ShieldCheck, Lock, FileCheck, Globe2 } from "lucide-react";

/**
 * Trust badges intended to signal security/privacy posture to international
 * clients. Wording is intentionally soft (aligned / commitments) because
 * formal certifications require independent verification. Update the
 * disclaimer note below once a certification is formally issued.
 */
const BADGES = [
  {
    icon: Lock,
    label: "SSL Encrypted",
    detail: "All traffic served over HTTPS (TLS 1.2+).",
  },
  {
    icon: ShieldCheck,
    label: "GDPR-Aligned Practices",
    detail: "Data minimisation and user consent by default.",
  },
  {
    icon: FileCheck,
    label: "ISO 27001 Roadmap",
    detail: "Security controls modelled on ISO 27001.",
  },
  {
    icon: Globe2,
    label: "Data Residency Options",
    detail: "EU / US / India regions available on request.",
  },
];

export function TrustBadges() {
  return (
    <section
      aria-label="Security and compliance commitments"
      className="border-t border-border/60 bg-surface/40 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Built with security & privacy in mind
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {BADGES.map(({ icon: Icon, label, detail }) => (
            <li
              key={label}
              className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/60 p-4 transition-colors hover:border-brand/40"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  {detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-[11px] leading-snug text-muted-foreground">
          Badges represent operational commitments. Formal certifications are
          in progress — contact us for our current compliance status or a signed
          DPA.
        </p>
      </div>
    </section>
  );
}
