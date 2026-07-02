import { createFileRoute } from "@tanstack/react-router";
import { FeaturedWorkSection } from "@/components/FeaturedWorkSection";
import { HeroSection } from "@/components/HeroSection";
import { WhatWeDoSection } from "@/components/WhatWeDoSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <HeroSection />
      <WhatWeDoSection />
      <WhyChooseUsSection />
    </div>
  );
}
