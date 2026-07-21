import { createFileRoute } from "@tanstack/react-router";
import { CTASection } from "@/components/CTASection";
import { FeaturedWorkSection } from "@/components/FeaturedWorkSection";
import { HeroSection } from "@/components/HeroSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TrustedByStrip } from "@/components/TrustedByStrip";
import { WhatWeDoSection } from "@/components/WhatWeDoSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";

const TITLE =
  "Shivaryan Infotech | AI, Software & Web Development";
const DESCRIPTION =
  "SAISPL builds AI agents, workflow automation, custom web apps, and business portals for founders and ops leaders in 12+ countries.";
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
          "@id": "https://shivaryaninfotech.com/#webpage",
          url: "https://shivaryaninfotech.com/",
          name: TITLE,
          description: DESCRIPTION,
          isPartOf: { "@id": "https://shivaryaninfotech.com/#website" },
          about: { "@id": "https://shivaryaninfotech.com/#organization" },
          primaryImageOfPage: { "@type": "ImageObject", url: "https://shivaryaninfotech.com/favicon.png" },
          inLanguage: "en",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://shivaryaninfotech.com/#service-provider",
          name: "Shivaryan Infotech (SAISPL)",
          url: "https://shivaryaninfotech.com/",
          logo: "https://shivaryaninfotech.com/saispl-logo.png",
          image: "https://shivaryaninfotech.com/saispl-logo.png",
          telephone: "+91-94180-31050",
          email: "shivaryaninfotech@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Bilaspur",
            addressLocality: "Bilaspur",
            addressRegion: "Himachal Pradesh",
            postalCode: "174001",
            addressCountry: "IN",
          },
          areaServed: "Worldwide",
          sameAs: [
            "https://www.linkedin.com/company/shivaryan-infotech",
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
