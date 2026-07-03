import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Mail } from "lucide-react";

const sections = [
  {
    title: "Introduction",
    content: [
      "Welcome to Shivaryan Infotech (SAISPL). These Terms and Conditions govern your use of our website, services, and any related digital products or platforms operated by us. By accessing or using any part of our services, you agree to be bound by these terms in full.",
      "If you do not agree with any part of these terms, you must not use our website or services. We reserve the right to update or modify these terms at any time without prior notice, and it is your responsibility to review them periodically.",
    ],
  },
  {
    title: "Use of Services",
    content: [
      "You agree to use our services only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the services. Prohibited behaviour includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our services.",
      "We may suspend or terminate your access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the terms.",
      "All services are provided on an 'as is' and 'as available' basis unless otherwise expressly stated. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the services.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "Unless otherwise stated, Shivaryan Infotech and/or its licensors own the intellectual property rights for all material on this website and in our deliverables. All intellectual property rights are reserved. You may view and/or print pages from our website for your own personal use subject to restrictions set in these terms.",
      "You must not republish material from our website or deliverables, sell, rent, or sub-license material, reproduce, duplicate, copy, or otherwise exploit material for a commercial purpose, or redistribute content from Shivaryan Infotech unless content is specifically made for redistribution.",
      "Any custom software, designs, or other deliverables created specifically for you as part of a service agreement shall be subject to the intellectual property terms outlined in your individual contract or statement of work.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "In no event shall Shivaryan Infotech, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of, or inability to access or use, our services.",
      "Shivaryan Infotech's total liability to you for all claims arising from or relating to these terms or your use of the services shall not exceed the total amount paid by you to Shivaryan Infotech, if any, in the twelve (12) months immediately preceding the event giving rise to the liability.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Himachal Pradesh, India.",
      "If any provision of these terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.",
    ],
  },
  {
    title: "Contact Information",
    content: [
      "If you have any questions about these Terms and Conditions, please contact us. We are happy to clarify any concerns and welcome your feedback.",
    ],
  },
];

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Terms and Conditions governing use of Shivaryan Infotech's website and AI, software, and web development services for clients in India and worldwide.",
      },
      {
        name: "keywords",
        content:
          "Shivaryan Infotech terms, service agreement, AI software terms and conditions, website terms India",
      },
      { property: "og:title", content: "Terms and Conditions — Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Terms governing use of Shivaryan Infotech's website and services.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
      { name: "robots", content: "noindex, follow" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Terms and Conditions — Shivaryan Infotech" },
      { name: "twitter:description", content: "Terms governing use of Shivaryan Infotech's website and services." },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),

  component: Terms,
});

function Terms() {
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
            Terms and <span className="text-brand">Conditions</span>
          </h1>
          <p className="mx-auto mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
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
            Questions About These Terms?
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            If you have any questions or concerns regarding these Terms and
            Conditions, feel free to reach out to us. We're here to help.
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
