import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const WHATSAPP_URL =
  "https://wa.me/919418031050?text=Hi%20Shivaryan%20Infotech%2C%20I%20have%20a%20question.";

type QA = { q: string; a: string };
type Category = { id: string; title: string; description: string; items: QA[] };

const categories: Category[] = [
  {
    id: "general",
    title: "General",
    description: "About Shivaryan Infotech (SAISPL) and what we do.",
    items: [
      {
        q: "What is Shivaryan Infotech (SAISPL)?",
        a: "SAISPL is a full-service digital studio building web platforms, custom business portals, AI & automation solutions, and product design for growing brands across India and globally.",
      },
      {
        q: "Where are you based and do you work with clients outside India?",
        a: "We're headquartered in Bilaspur, Himachal Pradesh, India and work remotely with clients across the world. Time zone, currency and communication preferences are handled during onboarding.",
      },
      {
        q: "What industries do you specialize in?",
        a: "We've delivered work across SaaS, e-commerce, travel, healthcare, real estate, education and D2C brands. Our stack is industry-agnostic — the process adapts to your domain.",
      },
      {
        q: "How can I get in touch with your team?",
        a: "You can reach us through the Contact page, WhatsApp us at +91 94180 31050, or email shivaryaninfotech@gmail.com. We reply within one business day.",
      },
    ],
  },
  {
    id: "services",
    title: "Services & Process",
    description: "How engagements start, run, and ship.",
    items: [
      {
        q: "What services do you offer?",
        a: "Web design & development, custom portals & software, AI & automation, branding & graphic design, SEO & digital marketing, and long-term care & maintenance. See the Services page for the full breakdown.",
      },
      {
        q: "What does your typical project process look like?",
        a: "Discovery call → scoping & proposal → design & prototyping → build in weekly sprints → QA and staging review → launch → post-launch support. You get async updates and a shared workspace throughout.",
      },
      {
        q: "Do you handle both design and development?",
        a: "Yes. Our designers and engineers work together from day one, so what you approve in Figma is exactly what ships in production — no handoff gaps.",
      },
      {
        q: "Can you work with our existing team or codebase?",
        a: "Absolutely. We regularly extend in-house teams, take over legacy codebases, or plug into existing design systems and CI/CD pipelines.",
      },
      {
        q: "Do you sign NDAs?",
        a: "Yes. We're happy to sign a mutual NDA before sharing any sensitive scope or credentials.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & Packages",
    description: "How our pricing works and what's included.",
    items: [
      {
        q: "How is pricing structured?",
        a: "We offer fixed-scope packages for well-defined projects and monthly retainers for ongoing product work. Both include design, development, QA and project management — no surprise add-ons.",
      },
      {
        q: "Do you offer custom quotes?",
        a: "Yes. After a short discovery call we send a written proposal with scope, timeline, deliverables and a fixed price or retainer band.",
      },
      {
        q: "Are there quarterly add-ons available?",
        a: "Yes. Retainer clients can bolt on quarterly modules like new feature sprints, SEO growth, analytics dashboards or automation workflows without renegotiating the base plan.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Bank transfer (NEFT/IMPS/RTGS), UPI, Razorpay/Stripe for cards, and international wire for overseas clients. Invoices are GST-compliant.",
      },
      {
        q: "Do you require an upfront deposit?",
        a: "Fixed-scope projects typically run on a 40/30/30 milestone schedule. Retainers are billed monthly in advance.",
      },
    ],
  },
  {
    id: "timeline",
    title: "Timeline",
    description: "How quickly we can start and ship.",
    items: [
      {
        q: "How soon can you start a new project?",
        a: "Most new engagements kick off within 5–10 business days of signing. If you have a hard deadline, tell us early — we can often accommodate expedited starts.",
      },
      {
        q: "What is the typical delivery timeline?",
        a: "Marketing sites: 3–5 weeks. Custom portals & SaaS MVPs: 8–14 weeks. AI/automation workflows: 2–6 weeks depending on integrations.",
      },
      {
        q: "How do you handle scope changes mid-project?",
        a: "Small tweaks land inside the sprint. Larger scope changes get a short change-order with updated timeline and cost — approved before we build.",
      },
      {
        q: "What if I need something urgent?",
        a: "We offer priority slots for launches, funding demos and production hotfixes. WhatsApp us and we'll confirm availability the same day.",
      },
    ],
  },
  {
    id: "portal",
    title: "Client Portal & Communication",
    description: "How we keep you in the loop.",
    items: [
      {
        q: "How do we communicate during the project?",
        a: "Every client gets access to our Client Portal for tasks, files, invoices and messages. We also use email, WhatsApp and scheduled calls — whatever fits your team.",
      },
      {
        q: "Will I have a single point of contact?",
        a: "Yes. A dedicated project lead owns delivery end-to-end and is your go-to person for status, decisions and escalations.",
      },
      {
        q: "How often will I receive project updates?",
        a: "Weekly written summaries plus a live demo at the end of each sprint. Async updates land in the portal so nothing gets lost in inboxes.",
      },
      {
        q: "Can I track progress in real time?",
        a: "Yes — the Client Portal shows the live sprint board, uploaded assets, latest staging link and open questions.",
      },
    ],
  },
  {
    id: "support",
    title: "Support & Maintenance",
    description: "Life after launch.",
    items: [
      {
        q: "Do you offer post-launch support?",
        a: "Yes. Every launch includes a 30-day warranty for bug fixes. Beyond that, our Care & Maintenance plans cover uptime, updates, backups and small enhancements.",
      },
      {
        q: "What is included in your maintenance plans?",
        a: "Security patches, dependency updates, uptime monitoring, weekly backups, monthly performance reports, and a bank of support hours for content or UI changes.",
      },
      {
        q: "How do I request changes or fixes after launch?",
        a: "Log a ticket in the Client Portal or WhatsApp us. Critical issues are acknowledged within an hour during business hours.",
      },
      {
        q: "Do you provide training or documentation?",
        a: "Yes. Every project ships with a written handover, Loom walkthroughs of the admin/CMS, and a live training session for your team.",
      },
    ],
  },
  {
    id: "affiliate",
    title: "Affiliate Program",
    description: "Refer clients and earn with us.",
    items: [
      {
        q: "How does the SAISPL Affiliate Program work?",
        a: "You refer a qualified lead through the Affiliate portal. When they sign a project, you earn a percentage of the contract value as commission.",
      },
      {
        q: "How much can I earn as a partner?",
        a: "Commission tiers scale with deal size — typically 5–15% of the invoiced project value, with recurring commission on retainer renewals.",
      },
      {
        q: "When and how are payouts made?",
        a: "Payouts are processed monthly to Indian bank accounts (NEFT/UPI) or via wire for overseas partners, once the client's milestone invoice is cleared.",
      },
      {
        q: "How do I join the Affiliate Program?",
        a: "Head to the Affiliate page, submit a short enquiry, and our team will onboard you with a partner dashboard, referral links and marketing assets.",
      },
    ],
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Shivaryan Infotech (SAISPL)" },
      {
        name: "description",
        content:
          "Answers to the most common questions about SAISPL's services, pricing, timelines, client portal, support, and affiliate program.",
      },
      { property: "og:title", content: "FAQ — Shivaryan Infotech (SAISPL)" },
      {
        property: "og:description",
        content:
          "Everything you need to know about working with SAISPL — services, pricing, timelines, support and the affiliate program.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* ambient glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 0%, color-mix(in oklab, var(--color-brand) 18%, transparent), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 40% at 50% 10%, black 40%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 40% at 50% 10%, black 40%, transparent 80%)",
          }}
        />

        <section className="relative mx-auto max-w-4xl px-4 pb-8 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              <HelpCircle className="h-3.5 w-3.5" />
              Support Center
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.05]">
              Frequently Asked{" "}
              <span className="italic text-muted-foreground">Questions</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Quick answers about our services, pricing, timelines and how we
              work with clients around the world.
            </p>
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {categories.map((cat) => (
              <CategoryBlock key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* Still have questions */}
        <section className="relative mx-auto max-w-4xl px-4 pb-28 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8 text-center sm:p-12">
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "color-mix(in oklab, var(--color-brand) 35%, transparent)",
              }}
            />
            <h2 className="relative text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Still have questions?
            </h2>
            <p className="relative mt-3 text-sm text-muted-foreground sm:text-base">
              Talk to our team — we usually reply within a few hours.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-[0_10px_40px_-10px_var(--color-brand)] transition-all hover:brightness-110"
              >
                Contact us
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/[0.08]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function CategoryBlock({ category }: { category: Category }) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <div>
      <div className="mb-5 border-b border-white/10 pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {category.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {category.description}
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className="space-y-3"
      >
        {category.items.map((item, idx) => {
          const value = `${category.id}-${idx}`;
          return (
            <AccordionItem
              key={value}
              value={value}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-5 transition-colors hover:border-white/20 data-[state=open]:border-white/25 data-[state=open]:bg-white/[0.04]"
            >
              <AccordionTrigger className="py-5 text-left text-sm font-medium text-foreground hover:no-underline sm:text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 pr-6 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
