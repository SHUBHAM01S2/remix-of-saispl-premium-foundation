import { useNavigate } from "@tanstack/react-router";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

import {
  buildMailtoHref,
  SUPPORT_EMAIL,
  trackEmailContactClick,
  type EmailContactSource,
} from "@/lib/email-contact";

interface EmailContactLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> {
  /** Where the click originated — used for analytics attribution. */
  source: EmailContactSource;
  /** Optional prefill values sent to /contact via search params. */
  service?: string;
  subject?: string;
  /** Override the email used in the mailto fallback. */
  email?: string;
  children?: ReactNode;
}

/**
 * Renders an anchor whose href is a real `mailto:` link (so right-click
 * "Copy email", long-press, and no-JS all still work), but on click we
 * preventDefault, fire analytics, and client-navigate to /contact with the
 * relevant prefill. If the SPA navigation fails for any reason we fall back
 * to the mailto so the user is never stranded.
 */
export const EmailContactLink = forwardRef<HTMLAnchorElement, EmailContactLinkProps>(
  function EmailContactLink(
    { source, service, subject, email = SUPPORT_EMAIL, children, ...rest },
    ref,
  ) {
    const navigate = useNavigate();
    const mailtoHref = buildMailtoHref(email, subject);

    return (
      <a
        ref={ref}
        href={mailtoHref}
        data-email-cta={source}
        {...rest}
        onClick={(event) => {
          // Let users open in a new tab / window with modifier keys — they
          // clearly want the mail client in that case.
          if (
            event.defaultPrevented ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
          ) {
            return;
          }
          try {
            trackEmailContactClick({ source, service, subject });
            const search: Record<string, string> = {};
            if (service) search.service = service;
            if (subject) search.subject = subject;
            event.preventDefault();
            const result = navigate({ to: "/contact", search }) as unknown;
            if (result && typeof (result as Promise<unknown>).then === "function") {
              (result as Promise<unknown>).catch(() => {
                window.location.href = mailtoHref;
              });
            }
          } catch {
            // Fall through to the browser handling the mailto href.
          }
        }}
      >
        {children ?? email}
      </a>
    );
  },
);
