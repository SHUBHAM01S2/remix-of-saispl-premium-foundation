import { createFileRoute } from "@tanstack/react-router";
import { CTASection } from "@/components/CTASection";
import { FeaturedWorkSection } from "@/components/FeaturedWorkSection";
import { HeroSection } from "@/components/HeroSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TrustedByStrip } from "@/components/TrustedByStrip";
import { WhatWeDoSection } from "@/components/WhatWeDoSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";

const TITLE =
  "Shivaryan Infotech — AI Automation, Custom Software & Web Development Company";
const DESCRIPTION =
  "Shivaryan Infotech (SAISPL) builds AI agents, workflow automation, custom web apps, and business portals for founders and ops leaders across 12+ countries.";
const CANONICAL = "/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "AI automation company India, AI agents, custom software development, web development company, business process automation, LLM integration, RAG, workflow automation, custom business portals, SaaS development, Shivaryan Infotech, SAISPL, software company Himachal Pradesh",
      },
      { name: "author", content: "Shivaryan Infotech (SAISPL)" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      // Open Graph
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:site_name", content: "Shivaryan Infotech" },
      { property: "og:locale", content: "en_US" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ShivaryanInfotech" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "/#webpage",
          url: "/",
          name: TITLE,
          description: DESCRIPTION,
          isPartOf: { "@id": "/#website" },
          about: { "@id": "/#organization" },
          primaryImageOfPage: { "@type": "ImageObject", url: "/favicon.png" },
          inLanguage: "en",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "@id": "/#service-provider",
          name: "Shivaryan Infotech (SAISPL)",
          description:
            "AI automation, custom software development, and business portal engineering for global clients.",
          url: "/",
          areaServed: "Worldwide",
          serviceType: [
            "AI Automation",
            "AI Agents & LLM Integration",
            "Custom Software Development",
            "Web Application Development",
            "Custom Business Portals",
            "Product Design (UX/UI)",
            "SEO & Digital Marketing",
            "Software Care & Maintenance",
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Shivaryan Infotech Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "AI Automation & AI Agents",
                  url: "/automation-ai-services",
                  description:
                    "LLM-powered agents, RAG systems, and workflow automations that cut cost and eliminate operational bottlenecks.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Web & Software Development",
                  url: "/web-design-development",
                  description:
                    "Scalable web apps and custom software built with React, Node, and TypeScript.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Custom Business Portals",
                  url: "/custom-portals-software",
                  description:
                    "Dashboards and internal portals that unify data and give teams real-time visibility.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Branding & Product Design",
                  url: "/branding-graphic-design",
                  description:
                    "User-centered design and prototyping for high-conversion digital products.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "SEO & Digital Marketing",
                  url: "/seo-digital-marketing",
                  description:
                    "Technical SEO, content, and AI-search optimization to grow qualified traffic.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Care & Maintenance",
                  url: "/care-maintenance",
                  description:
                    "Ongoing engineering, monitoring, and support to keep production software healthy.",
                },
              },
            ],
          },
          provider: { "@id": "/#organization" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <HeroSection />
      <TrustedByStrip />
      <WhatWeDoSection />
      <WhyChooseUsSection />
      <FeaturedWorkSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
