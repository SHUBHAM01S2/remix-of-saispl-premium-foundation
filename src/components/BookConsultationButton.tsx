import { useState } from "react";
import { CalendarClock, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Replace with your real Cal.com or Calendly link.
const BOOKING_URL = "https://cal.com/shivaryan/discovery";

export function BookConsultationButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Book a free consultation"
        className="fixed bottom-24 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2 focus:ring-offset-background"
      >
        <CalendarClock className="h-4 w-4" />
        <span className="hidden sm:inline">Book Free Consultation</span>
        <span className="sm:hidden">Book Call</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl overflow-hidden p-0 sm:max-w-4xl">
          <DialogHeader className="border-b border-border/50 px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="h-4 w-4 text-brand" />
              Book a free discovery call
            </DialogTitle>
          </DialogHeader>
          <div className="relative h-[70vh] w-full bg-background">
            <iframe
              title="Book a consultation"
              src={BOOKING_URL}
              className="h-full w-full border-0"
              allow="camera; microphone; fullscreen"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close booking"
              className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-muted-foreground shadow ring-1 ring-border hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="border-t border-border/50 px-6 py-3 text-center text-xs text-muted-foreground">
            International clients welcome — flexible time zones. Trouble loading?{" "}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline"
            >
              Open scheduler in a new tab
            </a>
            .
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
