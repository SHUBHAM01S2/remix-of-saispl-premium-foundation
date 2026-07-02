"use client";

import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Our Works", to: "/our-works" },
  { label: "Career", to: "/career" },
  { label: "Contact", to: "/contact" },
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

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { location } = useRouterState();
  const pathname = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {/* Logo */}
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.to === "/"
                ? pathname === "/"
                : pathname.startsWith(link.to);
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

        {/* Desktop CTA */}
        <div className="hidden shrink-0 lg:block">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground transition-all hover:bg-cta/90 hover:shadow-lg hover:shadow-cta/25"
          >
            Get In Touch
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
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
                {/* Mobile Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                  <Logo />
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
                  {navLinks.map((link) => {
                    const active =
                      link.to === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.to);
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

                {/* Mobile CTA */}
                <div className="border-t border-border px-4 py-6">
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
