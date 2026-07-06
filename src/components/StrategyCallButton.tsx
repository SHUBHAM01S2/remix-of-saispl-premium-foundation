import { useEffect, useState, type ReactNode } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_CAL_LINK = "shivaryan-infotech-ozoylu/consultation";
const DEFAULT_NAMESPACE = "consultation";

type AnalyticsPayload = {
  event: string;
  location?: string;
  [key: string]: unknown;
};

type Props = {
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
  calLink?: string;
  namespace?: string;
  title?: string;
  /** Fires when a booking is successfully created inside the Cal embed. */
  onBookingSuccessful?: (detail: unknown) => void;
  /** When set, an analytics event fires on button click and on booking success. */
  analytics?: AnalyticsPayload;
};

function fireAnalytics(payload: AnalyticsPayload) {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: Array<Record<string, unknown>>;
    };
    const detail = { ...payload, ts: Date.now() };
    if (typeof w.gtag === "function") w.gtag("event", payload.event, payload);
    if (Array.isArray(w.dataLayer)) w.dataLayer.push(detail);
    window.dispatchEvent(new CustomEvent(payload.event, { detail }));
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info("[analytics]", payload.event, detail);
    }
  } catch {
    /* analytics must never block */
  }
}

export function StrategyCallButton({
  children,
  className,
  ariaLabel,
  calLink,
  namespace,
  title,
  onBookingSuccessful,
  analytics,
}: Props) {
  const CAL_LINK = calLink ?? DEFAULT_CAL_LINK;
  const NAMESPACE = namespace ?? DEFAULT_NAMESPACE;
  const [open, setOpen] = useState(false);
  const [booked, setBooked] = useState(false);

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
      cal("on", {
        action: "bookingSuccessful",
        callback: (e: unknown) => {
          setBooked(true);
          const detail = (e as { detail?: unknown } | undefined)?.detail;
          onBookingSuccessful?.(detail);
          if (analytics) {
            fireAnalytics({ ...analytics, event: `${analytics.event}_booked` });
          }
        },
      });
    })();
  }, [NAMESPACE, onBookingSuccessful, analytics]);

  const handleClick = () => {
    setBooked(false);
    setOpen(true);
    if (analytics) fireAnalytics(analytics);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
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
        <DialogContent className="w-[95vw] max-w-4xl overflow-hidden border-white/10 bg-[#0a0a0a] p-0 sm:max-w-5xl">
          <DialogHeader className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
            <DialogTitle className="flex items-center gap-2 text-sm text-foreground sm:text-base">
              <CalendarClock className="h-4 w-4 text-brand" />
              {title ?? "Book a strategy call"}
            </DialogTitle>
          </DialogHeader>

          <div className="h-[80vh] max-h-[calc(100vh-8rem)] w-full bg-background sm:h-[78vh]">
            {open && !booked && (
              <Cal
                namespace={NAMESPACE}
                calLink={CAL_LINK}
                style={{ width: "100%", height: "100%", overflow: "auto" }}
                config={{ layout: "month_view", theme: "dark", useSlotsViewOnSmallScreen: true } as never}
              />
            )}
            {booked && (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-white sm:text-xl">Booking request received</h3>
                <p className="max-w-md text-sm text-zinc-400">
                  Thanks — your booking is confirmed. Check your inbox for the calendar invite and
                  next-step details. You can close this window.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-all hover:brightness-110"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
