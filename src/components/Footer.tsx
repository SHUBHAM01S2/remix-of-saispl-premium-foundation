import { Link } from "@tanstack/react-router";
import { MapPin, Mail, Phone, ArrowUpRight, Github, Linkedin, Twitter, Instagram } from "lucide-react";

import { formatPhoneDisplay, toTelHref } from "@/lib/format";

const PHONE_RAW = "+919418031050";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Our Works", to: "/our-works" },
  { label: "Career", to: "/career" },
  { label: "Contact", to: "/contact" },
];

const legalLinks = [
  { label: "Terms", to: "/terms" },
  { label: "Privacy", to: "/privacy" },
];

const socials = [
  { label: "GitHub", href: "https://github.com", Icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand">
        <span className="text-base font-bold text-brand-foreground">S</span>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
          SAISPL
        </span>
        <span className="text-[10px] leading-tight tracking-wide text-muted-foreground uppercase">
          Shivaryan Infotech
        </span>
      </div>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-background">
      {/* ambient glows */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 h-64"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 100%, color-mix(in oklab, var(--color-brand) 18%, transparent), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA band */}
        <div className="border-b border-white/10 py-14 md:py-16">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                Let's build together
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-[1.05]">
                Have a project in mind?{" "}
                <span className="italic text-muted-foreground">Let's talk.</span>
              </h2>
            </div>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all hover:brightness-110"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-14 md:py-16">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
            {/* Brand */}
            <div className="space-y-6 lg:col-span-5">
              <Logo />
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                AI-powered software, automation and custom platforms — built by
                Shivaryan Infotech to help global teams ship faster and operate smarter.
              </p>
              <div className="flex items-center gap-2">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="space-y-5 lg:col-span-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Navigate
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1.5 text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-5 lg:col-span-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Get in touch
              </h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                    <MapPin className="h-3.5 w-3.5 text-brand" />
                  </span>
                  <span className="pt-1 text-sm text-foreground/80">
                    Bilaspur, Himachal Pradesh, 174001
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                    <Mail className="h-3.5 w-3.5 text-brand" />
                  </span>
                  <a
                    href="mailto:Help@saispl.com"
                    className="pt-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    Help@saispl.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                    <Phone className="h-3.5 w-3.5 text-brand" />
                  </span>
                  <a
                    href={`tel:${toTelHref(PHONE_RAW)}`}
                    className="pt-1 text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {formatPhoneDisplay(PHONE_RAW)}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Shivaryan Infotech (SAISPL). All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
