import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Mail } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    content: [
      "We collect information that you provide directly to us, such as your name, email address, phone number, company name, and any other information you choose to provide when filling out contact forms, requesting services, or communicating with us.",
      "We may also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, pages viewed, and the dates and times of your visits. This information helps us understand how visitors interact with our site and improve our services.",
    ],
  },
  {
    title: "How We Use Information",
    content: [
      "We use the information we collect to provide, maintain, and improve our services; to respond to your inquiries and communicate with you; to process transactions and send related information; and to send promotional communications, marketing materials, and other information that may be of interest to you.",
      "We may also use your information to monitor and analyze trends, usage, and activities in connection with our services; to detect, investigate, and prevent fraudulent transactions and other illegal activities; and to protect the rights and property of Shivaryan Infotech and others.",
    ],
  },
  {
    title: "Cookies",
    content: [
      "We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.",
      "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our services. We use both session and persistent cookies for various purposes, including to enable certain functions, provide analytics, and store preferences.",
    ],
  },
  {
    title: "Third-Party Services",
    content: [
      "We may employ third-party companies and individuals to facilitate our services, provide services on our behalf, perform service-related services, or assist us in analyzing how our services are used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.",
      "Our website may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third-party's site. We strongly advise you to review the privacy policy of every site you visit, as we have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.",
      "We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. These measures include internal reviews of our data collection, storage, and processing practices, as well as security measures to protect against unauthorized access to systems where we store personal data.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "Depending on your location, you may have certain rights regarding your personal information, including the right to access, update, or delete the personal information we have on you; the right to rectification if your information is inaccurate or incomplete; the right to object to our processing of your personal information; and the right to data portability.",
      "To exercise any of these rights, please contact us using the contact information provided below. We will respond to your request within a reasonable timeframe and in accordance with applicable laws. Please note that we may ask you to verify your identity before responding to such requests.",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "If you have any questions about this Privacy Policy, please contact us. We will do our best to address your concerns and provide clarity on how we handle your personal information.",
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
            Last updated: July 2, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-border/50 bg-surface p-8 md:p-10"
            >
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
                {section.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 rounded-2xl border border-border/50 bg-surface p-8 md:p-10">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Questions About This Policy?
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
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
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              <Mail className="h-4 w-4" />
              Email Us
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}
