import { Link } from "@tanstack/react-router";
import { MapPin, Mail, Phone } from "lucide-react";
import { TrustBadges } from "@/components/TrustBadges";
import { TechPartners } from "@/components/TechPartners";
import { formatPhoneDisplay, toTelHref } from "@/lib/format";

const PHONE_RAW = "+919418031050";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Our Works", to: "/our-works" },
  { label: "Career", to: "/career" },
  { label: "Contact", to: "/contact" },
  { label: "Terms and Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
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
    <footer className="border-t border-border bg-background">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand Column */}
          <div className="space-y-5">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              We innovate and push technological boundaries to create exceptional digital experiences.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch Column */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Get In Touch
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span className="text-sm text-muted-foreground">
                  Bilaspur, Himachal Pradesh, 174001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand" />
                <a
                  href="mailto:Help@saispl.com"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Help@saispl.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand" />
                <a
                  href="tel:+919418031050"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  +91 94180-31050
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Shivaryan Infotech (SAISPL). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
