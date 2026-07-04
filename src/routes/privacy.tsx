import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Mail } from "lucide-react";
import { EmailContactLink } from "@/components/EmailContactLink";

type Section = {
  title: string;
  intro?: string[];
  subsections?: { title: string; content: (string | string[])[] }[];
  content?: (string | string[])[];
};

const sections: Section[] = [
  {
    title: "1. Who This Policy Applies To",
    content: [
      "This policy applies to:",
      [
        "Visitors browsing our website",
        "Prospective clients submitting enquiries, quote requests, or consultation bookings",
        "Active clients using our web development, maintenance, SEO, or automation services",
        "Job applicants applying through our Careers page",
        "Newsletter or WhatsApp subscribers",
      ],
    ],
  },
  {
    title: "2. Information We Collect",
    subsections: [
      {
        title: "a) Information you give us directly",
        content: [
          [
            "Full name, email address, phone number, WhatsApp number",
            "Business name, industry, and project requirements",
            "Billing and payment details",
            "Resume, portfolio, or work samples (for job applicants)",
            "Messages, feedback, or files shared during a project",
          ],
        ],
      },
      {
        title: "b) Information collected automatically",
        content: [
          [
            "IP address, browser type, device type, operating system",
            "Pages visited, time spent on site, referral source",
            "Cookies used for analytics, session management, and site functionality",
          ],
        ],
      },
      {
        title: "c) Information from third-party tools",
        content: [
          [
            "Booking details from scheduling tools (e.g., Cal.com)",
            "Interaction data from WhatsApp Business API or chatbot conversations",
            "Analytics data from Google Analytics, Search Console, or similar tools",
          ],
          "We only collect what is genuinely needed to serve you better — nothing excessive, nothing unnecessary.",
        ],
      },
    ],
  },
  {
    title: "3. Why We Collect Your Information",
    content: [
      "We use your information to:",
      [
        "Respond to enquiries and provide quotes",
        "Deliver and manage website, automation, and maintenance projects",
        "Process payments and issue invoices",
        "Send project updates, service reminders, and support communication",
        "Improve our website, service quality, and customer experience",
        "Evaluate job applications",
        "Comply with legal, tax, or regulatory requirements",
        "Send occasional updates about new services (only if you opt in)",
      ],
    ],
  },
  {
    title: "4. How We Protect Your Data",
    content: [
      [
        "All sensitive data (passwords, API keys, credentials) is encrypted",
        "Access to client data is restricted to authorized team members only",
        "Servers and hosting environments follow standard security hardening practices",
        "Regular reviews are conducted to identify and fix vulnerabilities",
        "Client project files and environment variables are stored securely and never shared publicly",
      ],
      "While no system can guarantee 100% security, we follow industry best practices to keep your data safe at every step.",
    ],
  },
  {
    title: "5. When We Share Your Information",
    content: [
      "We do not sell your data. We may share information only in these situations:",
      [
        "With trusted service providers (hosting, payment gateways, analytics, automation tools) strictly to deliver our services",
        "With legal authorities, if required by law",
        "During a business transfer, merger, or acquisition, with prior notice",
        "With your explicit consent, for any other purpose",
      ],
    ],
  },
  {
    title: "6. Cookies",
    content: [
      "We use cookies to:",
      [
        "Keep our website functional and secure",
        "Remember your preferences",
        "Understand how visitors use our site, so we can improve it",
      ],
      "You can disable cookies anytime through your browser settings. Some website features may not work as intended if cookies are disabled.",
    ],
  },
  {
    title: "7. Your Rights",
    content: [
      "You have the right to:",
      [
        "Request a copy of the data we hold about you",
        "Ask us to correct inaccurate information",
        "Request deletion of your data (subject to legal or contractual retention requirements)",
        "Opt out of marketing communication anytime",
        "Ask questions about how your data is used",
      ],
      "To exercise these rights, email us at Help@saispl.com.",
    ],
  },
  {
    title: "8. Data Retention",
    content: [
      "We retain personal data only as long as necessary to:",
      [
        "Deliver ongoing services",
        "Meet legal, tax, or accounting obligations",
        "Resolve disputes, if any",
      ],
      "Once data is no longer needed, it is securely deleted or anonymized.",
    ],
  },
  {
    title: "9. Children's Privacy",
    content: [
      "Our services are intended for individuals 18 years and older. We do not knowingly collect data from anyone under 13. If you believe a minor has shared information with us, contact us immediately for removal.",
    ],
  },
  {
    title: "10. Third-Party Links",
    content: [
      "Our website or communications may contain links to third-party sites (e.g., Cal.com, payment gateways, social media). We are not responsible for the privacy practices of these external sites. Please review their policies separately.",
    ],
  },
  {
    title: "11. Updates to This Policy",
    content: [
      "We may revise this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. The updated version will always be posted here with a new effective date.",
    ],
  },
  {
    title: "12. Contact Us",
    content: [
      "For any questions about this Privacy Policy, reach out to:",
      [
        "Email: Help@saispl.com",
        "Location: Himachal Pradesh, India",
      ],
    ],
  },
];


export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Shivaryan Infotech" },
      {
        name: "description",
        content:
          "How Shivaryan Infotech collects, uses, and protects personal information across our AI, software, and web development services for clients in India and globally.",
      },
      {
        name: "keywords",
        content:
          "Shivaryan Infotech privacy policy, data protection, GDPR India, AI software privacy",
      },
      { property: "og:title", content: "Privacy Policy — Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "How Shivaryan Infotech collects, uses, and protects your personal information.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy" },
      { name: "robots", content: "noindex, follow" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Privacy Policy — Shivaryan Infotech" },
      { name: "twitter:description", content: "How we collect, use, and protect your personal information." },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),

  component: Privacy,
});

function renderBlocks(blocks: (string | string[])[]) {
  return blocks.map((block, idx) =>
    Array.isArray(block) ? (
      <ul key={idx} className="list-disc space-y-2 pl-6 marker:text-brand">
        {block.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ) : (
      <p key={idx}>{block}</p>
    ),
  );
}

function Privacy() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-24 md:pt-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,185,241,0.08), transparent)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Privacy <span className="text-brand">Policy</span>
          </h1>
          <p className="mx-auto mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            Last updated: April 08, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="rounded-2xl border border-border/50 bg-surface p-8 md:p-10">
          <div className="space-y-4 leading-relaxed text-muted-foreground">
            <p>
              ShivAryan Infotech Services ("SAISPL," "we," "our," or "us") is
              committed to protecting the privacy of everyone who visits our
              website, enquires about our services, or works with us as a
              client. This Privacy Policy explains what information we collect,
              why we collect it, how we use it, and the rights you have over
              your data.
            </p>
            <p>
              By using our website or services, you agree to the practices
              described in this policy.
            </p>
          </div>

        </div>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-border/50 bg-surface p-8 md:p-10"
            >
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {section.title}
              </h2>
              {section.content && (
                <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                  {renderBlocks(section.content)}
                </div>
              )}
              {section.subsections && (
                <div className="mt-6 space-y-8">
                  {section.subsections.map((sub) => (
                    <div key={sub.title}>
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        {sub.title}
                      </h3>
                      <div className="mt-3 space-y-4 leading-relaxed text-muted-foreground">
                        {renderBlocks(sub.content)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 rounded-2xl border border-border/50 bg-surface p-8 md:p-10">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Questions About This Policy?
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            If you have any questions or concerns regarding this Privacy Policy,
            feel free to reach out to us. We&apos;re here to help.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground transition-all hover:bg-cta/90 hover:shadow-lg hover:shadow-cta/25"
            >
              Contact Us
            </Link>
            <EmailContactLink
              source="privacy"
              subject="Question about Privacy Policy"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              <Mail className="h-4 w-4" />
              Email Us
            </EmailContactLink>
          </div>
        </div>
      </section>
    </div>
  );
}
