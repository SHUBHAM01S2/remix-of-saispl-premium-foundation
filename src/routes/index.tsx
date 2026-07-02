import { createFileRoute } from "@tanstack/react-router";
import { CTASection } from "@/components/CTASection";
import { FeaturedWorkSection } from "@/components/FeaturedWorkSection";
import { HeroSection } from "@/components/HeroSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TrustedByStrip } from "@/components/TrustedByStrip";
import { WhatWeDoSection } from "@/components/WhatWeDoSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shivaryan Infotech — AI Automation & Custom Software Development" },
      {
        name: "description",
        content:
          "Shivaryan Infotech (SAISPL) builds AI agents, automation, and custom software for startups and enterprises. Based in Himachal Pradesh, India, serving global clients worldwide.",
      },
      {
        name: "keywords",
        content:
          "AI automation, AI agents, custom software development, web development India, Shivaryan Infotech, SAISPL, software company Himachal Pradesh, global software development, business automation, enterprise software",
      },
      { property: "og:title", content: "Shivaryan Infotech — AI Automation & Custom Software Development" },
      {
        property: "og:description",
        content:
          "AI agents, automation, and custom software for startups and enterprises — from Himachal Pradesh to global clients worldwide.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Shivaryan Infotech — AI Automation & Custom Software Development" },
      {
        name: "twitter:description",
        content:
          "AI agents, automation, and custom software for global clients — built from Himachal Pradesh.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
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
