// Shared helpers for email-CTA → /contact routing, analytics + mailto fallback.

export const SUPPORT_EMAIL = "shivaryaninfotech@gmail.com";

export type EmailContactSource =
  | "footer"
  | "cta-section"
  | "contact-page"
  | "our-works"
  | "privacy"
  | "terms"
  | "unknown";

export interface EmailContactPayload {
  source: EmailContactSource;
  service?: string;
  subject?: string;
}

/**
 * Fire an analytics event when a user clicks an email CTA that we route to
 * /contact. Fans out to gtag, GTM dataLayer, and a DOM CustomEvent so any
 * analytics stack (or a test harness) can observe the click.
 */
export function trackEmailContactClick(payload: EmailContactPayload) {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: Array<Record<string, unknown>>;
    };
    const detail = {
      event: "email_contact_click",
      ...payload,
      ts: Date.now(),
    };
    if (typeof w.gtag === "function") {
      w.gtag("event", "email_contact_click", payload);
    }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push(detail);
    }
    window.dispatchEvent(new CustomEvent("email_contact_click", { detail }));
    if (import.meta.env.DEV) {
      // Helpful signal in preview to confirm tracking fires.
      // eslint-disable-next-line no-console
      console.info("[analytics] email_contact_click", detail);
    }
  } catch {
    // Analytics must never block the click.
  }
}

export function buildMailtoHref(email: string, subject?: string) {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  return `mailto:${email}${params.length ? `?${params.join("&")}` : ""}`;
}
