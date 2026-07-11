"use client";

import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import saisplLogo from "@/assets/saispl-logo.png.asset.json";
import { resolveLovableAssetUrl } from "@/lib/lovable-asset-url";


type NavLink =
  | { label: string; to: string; children?: undefined }
  | { label: string; to: string; children: { label: string; to: string }[] };

const serviceLinks = [
  { label: "Website Design & Development", to: "/web-design-development" },
  
  { label: "SEO & Local Digital Marketing", to: "/seo-digital-marketing" },
  { label: "WhatsApp & AI Automation", to: "/automation-ai-services" },
  { label: "Custom Portals & Software", to: "/custom-portals-software" },
  { label: "Branding & Graphic Design", to: "/branding-graphic-design" },
];

const navLinks: NavLink[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services", children: serviceLinks },
  { label: "Pricing", to: "/pricing" },
  { label: "Portfolio", to: "/our-works" },
  { label: "Blog", to: "/blog" },
  { label: "Career", to: "/career" },
  { label: "Contact", to: "/contact" },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <img
        src={resolveLovableAssetUrl(saisplLogo.url)}
        alt="SAISPL Infotech Services"
        className="h-9 w-auto shrink-0 sm:h-10 md:h-12 lg:h-14"
      />
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { location } = useRouterState();
  const pathname = location.pathname;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/50 bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            if (link.children) {
              return (
                <div key={link.to} className="group relative">
                  <Link
                    to={link.to}
                    className={cn(
                      "relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                    {active && (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand" />
                    )}
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 w-[280px] -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                    <div className="rounded-xl border border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-md">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.to}
                          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA + Language */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            to="/client-portal"
            className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-transparent px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Sign In
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground transition-all hover:bg-cta/90 hover:shadow-lg hover:shadow-cta/25"
          >
            Get In Touch
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-border bg-background p-0 sm:w-[360px]">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                  <Logo />
                </div>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
                  {navLinks.map((link) => {
                    const active = isActive(link.to);
                    if (link.children) {
                      return (
                        <div key={link.to} className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => setServicesOpen((v) => !v)}
                            className={cn(
                              "flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors",
                              active
                                ? "bg-surface text-foreground"
                                : "text-muted-foreground hover:bg-surface hover:text-foreground"
                            )}
                          >
                            {link.label}
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                servicesOpen && "rotate-180"
                              )}
                            />
                          </button>
                          {servicesOpen && (
                            <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-border/60 pl-3">
                              {link.children.map((child) => (
                                <SheetClose asChild key={child.label}>
                                  <Link
                                    to={child.to}
                                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                                  >
                                    {child.label}
                                  </Link>
                                </SheetClose>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <SheetClose asChild key={link.to}>
                        <Link
                          to={link.to}
                          className={cn(
                            "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                            active
                              ? "bg-surface text-foreground"
                              : "text-muted-foreground hover:bg-surface hover:text-foreground"
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>

                <div className="flex flex-col gap-2 border-t border-border px-4 py-6">
                  <SheetClose asChild>
                    <Link
                      to="/client-portal"
                      className="flex w-full items-center justify-center rounded-lg border border-border bg-transparent px-5 py-3 text-base font-medium text-foreground transition-colors hover:bg-surface"
                    >
                      Sign In
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/contact"
                      className="flex w-full items-center justify-center rounded-lg bg-cta px-5 py-3 text-base font-semibold text-cta-foreground transition-all hover:bg-cta/90"
                    >
                      Get In Touch
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
