import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/HeroSection";
import { WhatWeDoSection } from "@/components/WhatWeDoSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}
