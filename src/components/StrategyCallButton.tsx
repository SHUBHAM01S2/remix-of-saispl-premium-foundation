import { useEffect, useState, type ReactNode } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

const CAL_LINK = "shivaryan-infotech-ozoylu/consultation";
const NAMESPACE = "consultation";

type Props = {
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function StrategyCallButton({ children, className, ariaLabel }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: {
          dark: { "cal-brand": "#3b82f6" },
          light: { "cal-brand": "#3b82f6" },
        },
      });
    })();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel ?? "Book a strategy call"}
        className={cn("cursor-pointer", className)}
      >
        {children ?? (
          <>
            <CalendarClock className="h-4 w-4" />
            Book a Strategy Call
          </>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl overflow-hidden border-white/10 bg-[#0a0a0a] p-0 sm:max-w-5xl">
          <DialogHeader className="border-b border-white/10 px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-base text-foreground">
              <CalendarClock className="h-4 w-4 text-brand" />
              Book a strategy call
            </DialogTitle>
          </DialogHeader>
          <div className="h-[75vh] w-full bg-background">
            {open && (
              <Cal
                namespace={NAMESPACE}
                calLink={CAL_LINK}
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                config={{ layout: "month_view", theme: "dark", useSlotsViewOnSmallScreen: true } as never}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
