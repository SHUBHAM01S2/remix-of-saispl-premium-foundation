/**
 * International-friendly formatting helpers.
 * - Dates: `DD Mon YYYY` (e.g. "8 Jul 2026")
 * - Phone: E.164-visible with country code (e.g. "+91 94180 31050")
 * - Currency: dual display for INR with approximate USD hint when useful
 */

export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return "";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(input: string | Date | null | undefined): string {
  if (!input) return "";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  return `${formatDate(d)}, ${d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
}

/**
 * Formats a phone number for display with the country code always visible.
 * Accepts raw digits or a leading `+`.
 */
export function formatPhoneDisplay(raw: string): string {
  const cleaned = raw.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+91") || cleaned.startsWith("91")) {
    const digits = cleaned.replace(/^\+?91/, "").padStart(10, "0").slice(-10);
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (cleaned.startsWith("+")) return cleaned;
  return `+${cleaned}`;
}

export function toTelHref(raw: string): string {
  const cleaned = raw.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
