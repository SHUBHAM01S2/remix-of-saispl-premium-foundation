import { Link, useRouterState } from "@tanstack/react-router";
import { MapPin, Mail, Phone, ArrowUpRight, Sparkles, MessageCircle } from "lucide-react";


import { formatPhoneDisplay, toTelHref } from "@/lib/format";
import { EmailContactLink } from "@/components/EmailContactLink";
import { StrategyCallButton } from "@/components/StrategyCallButton";

const PHONE_RAW = "+919418031050";
const WHATSAPP_URL =
  "https://wa.me/919418031050?text=Hi%20Shivaryan%20Infotech%2C%20I%20need%20support%20with%20a%20project.";


const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Our Works", to: "/our-works" },
  { label: "Careers", to: "/career" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const productLinks = [
  { label: "Web Development", to: "/web-design-development" },
  { label: "AI & Automation", to: "/automation-ai-services" },
  { label: "Custom Portals", to: "/custom-portals-software" },
  { label: "UI/UX Design", to: "/branding-graphic-design" },
  { label: "Pricing", to: "/pricing" },
];


const resourceLinks = [
  { label: "Case Studies", to: "/our-works" },
  { label: "Services", to: "/services" },
  { label: "FAQ", to: "/contact" },
];


const socials = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "GitHub", href: "https://github.com" },
];

export function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideCta = pathname === "/contact";
  return (

    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505]">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 0%, color-mix(in oklab, var(--color-brand) 22%, transparent), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 50% at 50% 30%, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 30%, black 40%, transparent 80%)",
        }}
      />

      <div className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${hideCta ? "pt-12" : "pt-24"}`}>
        {/* centered logo tile */}
        {!hideCta && (
        <div className="flex flex-col items-center text-center">
          <div className="relative">

            <div
              className="absolute inset-0 -z-10 blur-2xl"
              style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
            />
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand shadow-[0_0_60px_-8px_var(--color-brand)]">
              <Sparkles className="h-7 w-7 text-brand-foreground" />
            </div>
          </div>

          <h2 className="mt-8 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Start Building Smarter with{" "}
            <span className="italic text-muted-foreground">Shivaryan</span>
          </h2>

          <StrategyCallButton
            ariaLabel="Book a demo"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-[0_10px_40px_-10px_var(--color-brand)] transition-all hover:brightness-110"
          >
            Book a Demo
            <ArrowUpRight className="h-4 w-4" />
          </StrategyCallButton>
        </div>
        )}


        {/* Link columns */}
        <div className={`grid grid-cols-2 gap-y-10 gap-x-6 border-t border-white/10 pt-14 sm:grid-cols-3 lg:grid-cols-5 ${hideCta ? "mt-0" : "mt-24"}`}>
          <FooterColumn title="Company">
            {companyLinks.map((l) => (
              <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Products">
            {productLinks.map((l) => (
              <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Resources">
            {resourceLinks.map((l) => (
              <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>
            ))}
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                Support
              </a>
            </li>

          </FooterColumn>

          <FooterColumn title="Contact Us">
            <li className="flex items-start gap-2 text-sm text-foreground/70">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
              <span>Bilaspur, Himachal Pradesh 174001, India</span>
            </li>
            <li>
              <a
                href={`tel:${toTelHref(PHONE_RAW)}`}
                className="flex items-start gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                {formatPhoneDisplay(PHONE_RAW)}
              </a>
            </li>
            <li>
              <EmailContactLink
                source="footer"
                subject="Enquiry from footer"
                className="flex items-start gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <span className="break-all">shivaryaninfotech@gmail.com</span>
              </EmailContactLink>
            </li>
          </FooterColumn>


          <FooterColumn title="Social">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1 text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {s.label}
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Copyright Shivaryan Infotech {new Date().getFullYear()}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/terms" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="pointer-events-none relative -mb-6 select-none overflow-hidden sm:-mb-10 md:-mb-16">
          <h3
            className="bg-gradient-to-b from-white/10 to-white/[0.02] bg-clip-text text-center text-[22vw] font-black leading-none tracking-tighter text-transparent"
            style={{ fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" }}
          >
            Shivaryan Infotech
          </h3>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
