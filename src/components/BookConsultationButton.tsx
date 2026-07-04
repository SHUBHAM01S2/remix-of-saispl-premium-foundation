import { CalendarClock } from "lucide-react";
import { StrategyCallButton } from "@/components/StrategyCallButton";

export function BookConsultationButton() {
  return (
    <StrategyCallButton
      ariaLabel="Book a free consultation"
      className="fixed bottom-24 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2 focus:ring-offset-background"
    >
      <CalendarClock className="h-4 w-4" />
      <span className="hidden sm:inline">Book Free Consultation</span>
      <span className="sm:hidden">Book Call</span>
    </StrategyCallButton>
  );
}
