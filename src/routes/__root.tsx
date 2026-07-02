import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppChatButton } from "@/components/WhatsAppChatButton";
import { BookConsultationButton } from "@/components/BookConsultationButton";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-24">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-cta/10 blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
          Error 404
        </p>
        <h1 className="mt-4 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl">
          Page not found
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist, has moved, or was never
          built. Let's get you back on track.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-cta px-7 py-3 text-sm font-semibold text-cta-foreground shadow-lg shadow-cta/20 transition-all hover:brightness-110 hover:shadow-xl"
          >
            ← Back to Home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full border border-border/60 bg-transparent px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-surface"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Shivaryan Infotech — Business Software & AI Automation" },
      { name: "description", content: "SAISPL delivers enterprise-grade business software and AI automation solutions for international high-performing clients." },
      { name: "author", content: "Shivaryan Infotech (SAISPL)" },
      { property: "og:title", content: "Shivaryan Infotech — Business Software & AI Automation" },
      { property: "og:description", content: "SAISPL delivers enterprise-grade business software and AI automation solutions for international high-performing clients." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ShivaryanInfotech" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Shivaryan Infotech",
          legalName: "Shivaryan Infotech (SAISPL)",
          url: "/",
          email: "Help@saispl.com",
          telephone: "+91-94180-31050",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Bilaspur",
            addressLocality: "Bilaspur",
            addressRegion: "Himachal Pradesh",
            postalCode: "174001",
            addressCountry: "IN",
          },
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+91-94180-31050",
              email: "Help@saispl.com",
              contactType: "customer support",
              areaServed: "Worldwide",
              availableLanguage: ["English", "Hindi"],
            },
          ],
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <main className="pt-16">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <WhatsAppChatButton />
      <BookConsultationButton />
    </QueryClientProvider>
  );
}
