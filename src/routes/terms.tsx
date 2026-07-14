import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Mail } from "lucide-react";
import { EmailContactLink } from "@/components/EmailContactLink";


type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

type Section = { title: string; blocks: Block[] };

const sections: Section[] = [
  {
    title: "Introduction",
    blocks: [
      { type: "p", text: 'These Terms and Conditions ("Terms") govern your access to and use of the ShivAryan Infotech Services ("SAISPL," "we," "us," "our") website and services. By accessing our website, submitting an enquiry, or engaging our services, you agree to these Terms in full.' },
      { type: "p", text: "If you do not agree with any part of these Terms, please discontinue use of our website and services." },
    ],
  },
  {
    title: "1. About SAISPL",
    blocks: [
      { type: "p", text: "SAISPL is a website design, development, automation, and digital growth company based in Himachal Pradesh, India. We offer:" },
      { type: "ul", items: [
        "Website design and development",
        "Website maintenance and support plans",
        "SEO and local digital marketing",
        "AI voice agents, WhatsApp automation, and workflow automation",
        "Custom web applications and portals",
      ] },
      { type: "p", text: "Specific deliverables, pricing, and timelines for each engagement are outlined in a separate proposal or service agreement, which becomes part of these Terms once accepted." },
    ],
  },
  {
    title: "2. Eligibility",
    blocks: [
      { type: "p", text: "By using our services, you confirm that you are at least 18 years old, or that you represent a business entity with proper authority to enter into agreements on its behalf." },
    ],
  },
  {
    title: "3. Client Responsibilities",
    blocks: [
      { type: "p", text: "To ensure smooth, timely project delivery, clients agree to:" },
      { type: "ul", items: [
        "Provide accurate and complete project information",
        "Share content, assets, and feedback within agreed timelines",
        "Review and approve deliverables promptly",
        "Ensure they hold proper rights to any content, images, or branding materials provided to us",
      ] },
      { type: "p", text: "Delays caused by incomplete information, late approvals, or unresponsiveness may extend project timelines without penalty to SAISPL." },
    ],
  },
  {
    title: "4. Payment Terms",
    blocks: [
      { type: "ul", items: [
        "Projects typically require an advance payment before work begins, with the balance due at agreed milestones or upon completion.",
        "Monthly maintenance, SEO, and automation retainer plans are billed in advance on a recurring basis.",
        "Invoices are due within the timeframe specified on the invoice unless otherwise agreed.",
        "Late payments may result in paused work, suspended access, or additional late fees.",
        "All fees are exclusive of applicable taxes unless explicitly stated.",
      ] },
    ],
  },
  {
    title: "5. Intellectual Property Rights",
    blocks: [
      { type: "p", text: "Upon full and final payment, clients receive ownership of the final website design and custom code created specifically for their project, unless otherwise agreed in writing." },
      { type: "p", text: "SAISPL retains ownership of any proprietary frameworks, reusable code libraries, automation templates, or internal tools used to build the client's project." },
      { type: "p", text: "Until payment is completed in full, all deliverables remain the intellectual property of SAISPL." },
      { type: "p", text: "Clients are solely responsible for ensuring they have proper rights to use any third-party content, images, logos, or trademarks provided to us." },
    ],
  },
  {
    title: "6. Revisions and Scope of Work",
    blocks: [
      { type: "p", text: "Each project package includes a defined number of revision rounds, as specified in the proposal. Any requests beyond the agreed scope — including new pages, additional features, or major design changes after approval — will be treated as separate work and quoted accordingly." },
    ],
  },
  {
    title: "7. Website Maintenance & Retainer Plans",
    blocks: [
      { type: "p", text: "Ongoing plans (such as Care Basic, Care Plus, Growth, or Growth + Automation) include only the services explicitly listed under that plan. Requests outside plan scope will be quoted as additional work. Clients may upgrade, downgrade, or cancel plans with prior written notice, as detailed in their service agreement." },
    ],
  },
  {
    title: "8. Third-Party Tools and Services",
    blocks: [
      { type: "p", text: "Our services may involve third-party platforms such as hosting providers, domain registrars, payment gateways, WhatsApp Business API, Cal.com, CRM systems, or AI service providers (e.g., Vapi, ElevenLabs, Sarvam AI). SAISPL is not responsible for outages, price changes, feature removals, or policy changes made by these third-party providers, though we will make reasonable efforts to help clients adapt when such changes occur." },
    ],
  },
  {
    title: "9. Confidentiality",
    blocks: [
      { type: "p", text: "Both SAISPL and the client agree to keep confidential any sensitive business information, credentials, source code, or proprietary data exchanged during the engagement, and to use such information solely for delivering the agreed services." },
    ],
  },
  {
    title: "10. Limitation of Liability",
    blocks: [
      { type: "p", text: "SAISPL is committed to delivering high-quality, reliable work. However:" },
      { type: "ul", items: [
        "We are not liable for indirect, incidental, or consequential damages, including loss of profits, data, or business opportunities.",
        "We do not guarantee specific business outcomes (such as search rankings, lead volume, or conversion rates), as these depend on factors outside our direct control, including market conditions and third-party platform algorithms.",
        "Our total liability for any claim shall not exceed the amount paid by the client for the specific service in question during the three (3) months preceding the claim.",
      ] },
    ],
  },
  {
    title: "11. Termination of Services",
    blocks: [
      { type: "p", text: "Either party may terminate an active service agreement with written notice, as specified in the individual project or retainer contract. Upon termination:" },
      { type: "ul", items: [
        "All outstanding payments for completed work become immediately due.",
        "Access to hosting, maintenance, or support services will end as per the agreed notice period.",
        "SAISPL may offer handover assistance (source files, documentation, credentials) for an additional fee, if requested.",
      ] },
      { type: "p", text: "SAISPL reserves the right to suspend or terminate services immediately in cases of non-payment, misuse, or breach of these Terms." },
    ],
  },
  {
    title: "12. Disclaimer",
    blocks: [
      { type: "p", text: 'Our website and services are provided on an "as is" and "as available" basis. While we take every reasonable measure to ensure quality, accuracy, and uptime, we do not guarantee that our website or services will be completely uninterrupted, error-free, or immune to all security risks.' },
    ],
  },
  {
    title: "13. Governing Law and Dispute Resolution",
    blocks: [
      { type: "p", text: "These Terms are governed by the laws of Himachal Pradesh, India. In the event of a dispute, both parties agree to first attempt resolution through good-faith discussion. If unresolved within thirty (30) days, the dispute will be subject to the exclusive jurisdiction of courts located in Himachal Pradesh." },
    ],
  },
  {
    title: "14. Changes to These Terms",
    blocks: [
      { type: "p", text: "We may update these Terms periodically to reflect changes in our services, business practices, or legal requirements. Material changes will be communicated with reasonable advance notice. Continued use of our services after such updates constitutes acceptance of the revised Terms." },
    ],
  },
  {
    title: "15. Contact Us",
    blocks: [
      { type: "p", text: "For questions regarding these Terms and Conditions, please contact:" },
      { type: "ul", items: [
        "Email: shivaryaninfotech@gmail.com",
        "Location: Himachal Pradesh, India",
      ] },
    ],
  },
];

function renderBlocks(blocks: Block[]) {
  return blocks.map((block, idx) => {
    if (block.type === "ul") {
      return (
        <ul key={idx} className="ml-5 list-disc space-y-2">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p key={idx}>{block.text}</p>;
  });
}


export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms { title: "Terms and Conditions — Shivaryan Infotech" } Conditions | Shivaryan Infotech" },
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
                {renderBlocks(section.blocks)}
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
            <EmailContactLink
              source="terms"
              subject="Question about Terms of Service"
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
