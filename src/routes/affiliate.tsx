import { useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BadgeDollarSign, CheckCircle2, Handshake, TrendingUp, Users } from "lucide-react";

import { StrategyCallButton } from "@/components/StrategyCallButton";
import { EmailContactLink } from "@/components/EmailContactLink";


export const Route = createFileRoute("/affiliate")({
  head: () => ({
    meta: [
      { title: "Affiliate Program — Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Earn recurring commissions by referring clients to Shivaryan Infotech for web design, custom software, SEO, and WhatsApp & AI automation.",
      },
      { property: "og:title", content: "Affiliate Program — Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Partner with Shivaryan Infotech and earn commissions for every client you refer. Transparent tracking, monthly payouts.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/affiliate" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Affiliate Program — Shivaryan Infotech" },
      {
        name: "twitter:description",
        content: "Refer clients, earn recurring commissions. Join the Shivaryan Infotech affiliate program.",
      },
    ],
    links: [{ rel: "canonical", href: "/affiliate" }],
  }),
  component: AffiliatePage,
});

const perks = [
  {
    icon: BadgeDollarSign,
    title: "Up to 15% commission",
    desc: "Earn generous commissions on every project referred — one-time builds and recurring care plans.",
  },
  {
    icon: TrendingUp,
    title: "Recurring payouts",
    desc: "Get paid every month your referral stays on a maintenance, automation, or hosting plan.",
  },
  {
    icon: Users,
    title: "Dedicated partner support",
    desc: "A named point of contact, co-branded pitch decks, and priority responses for your leads.",
  },
  {
    icon: Handshake,
    title: "Transparent tracking",
    desc: "Personal referral link, real-time dashboard, and detailed monthly statements.",
  },
];

const steps = [
  { step: "01", title: "Apply", desc: "Fill out a short form and tell us about your audience or network." },
  { step: "02", title: "Get your link", desc: "We approve your account and share your unique referral link and assets." },
  { step: "03", title: "Refer clients", desc: "Send prospects our way — websites, portals, SEO, or AI automation." },
  { step: "04", title: "Earn commissions", desc: "Get paid monthly via bank transfer or UPI for every closed deal." },
];

function AffiliatePage() {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const handleBooked = () => {
    setBookingConfirmed(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (

    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-zinc-200">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
        {bookingConfirmed && (
          <div
            role="status"
            aria-live="polite"
            className="mb-10 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-100"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
            <div>
              <p className="font-semibold text-white">Your affiliate booking is confirmed</p>
              <p className="mt-1 text-sm text-emerald-100/80">
                Thanks for signing up. We've emailed the calendar invite and onboarding
                details — check your inbox (and spam) for next steps.
              </p>
            </div>
          </div>
        )}
        <div className="max-w-3xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400">
            Partner with us
          </div>
          <h1
            className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl"
            style={{ fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif" }}
          >
            Affiliate{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Program
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Refer businesses to Shivaryan Infotech and earn recurring commissions on
            websites, custom software, SEO, and WhatsApp & AI automation projects.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <StrategyCallButton
              ariaLabel="Join the affiliate program"
              calLink="shivaryan-infotech-ozoylu/affiliate-member"
              namespace="affiliate-member"
              title="Affiliate member booking"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-[0_10px_40px_-10px_var(--color-brand)] transition-all hover:brightness-110"
            >
              Become an affiliate
              <ArrowUpRight className="h-4 w-4" />
            </StrategyCallButton>
            <EmailContactLink
              source="affiliate"
              subject="Affiliate program enquiry"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Email us
            </EmailContactLink>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p.icon className="h-6 w-6 text-brand" />
              <h3 className="mt-4 text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <h2
            className="text-3xl font-bold tracking-tight text-white md:text-4xl"
            style={{ fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif" }}
          >
            How it works
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  {s.step}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 rounded-3xl border border-white/10 bg-white/5 p-8 text-center md:p-12">
          <h2
            className="text-3xl font-bold tracking-tight text-white md:text-4xl"
            style={{ fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif" }}
          >
            Ready to start earning?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Book a quick call to get your affiliate account, referral link, and marketing assets.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <StrategyCallButton
              ariaLabel="Book an affiliate onboarding call"
              calLink="shivaryan-infotech-ozoylu/affiliate-member"
              namespace="affiliate-member"
              title="Affiliate member booking"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-[0_10px_40px_-10px_var(--color-brand)] transition-all hover:brightness-110"
            >
              Book onboarding call
              <ArrowUpRight className="h-4 w-4" />
            </StrategyCallButton>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </div>

        <AffiliateTerms />
      </section>
    </div>
  );
}

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "1. How the Program Works",
    body: (
      <>
        <p>Our affiliate model is simple:</p>
        <ul>
          <li>You refer a business that needs website design, development, SEO, automation, or related digital services.</li>
          <li>We evaluate the lead and handle the sales, scope, and delivery process.</li>
          <li>If the client closes a paid project through SAISPL, you receive a 15% commission on the eligible project amount.</li>
        </ul>
        <p>
          This program is designed for people who already have access to business owners, startups, agencies, local
          enterprises, or professional networks and want a clean way to monetize referrals.
        </p>
      </>
    ),
  },
  {
    title: "2. Eligible Services",
    body: (
      <>
        <p>Commission may apply to projects such as:</p>
        <ul>
          <li>Website design and development</li>
          <li>Landing pages and lead generation websites</li>
          <li>Maintenance and support retainers</li>
          <li>SEO and local digital marketing services</li>
          <li>Automation projects</li>
          <li>AI and chatbot integrations</li>
          <li>Custom portals and web applications</li>
        </ul>
        <p>Commission eligibility may vary depending on the project type, pricing model, and service agreement.</p>
      </>
    ),
  },
  {
    title: "3. Commission Structure",
    body: (
      <>
        <p>The standard commission under this Affiliate Program is:</p>
        <ul>
          <li>15% commission on the net value of the qualifying project</li>
          <li>
            &ldquo;Net value&rdquo; means the amount actually received by SAISPL for the project, excluding taxes,
            payment gateway charges, refunds, discounts, or pass-through third-party costs unless otherwise agreed in
            writing.
          </li>
          <li>Commission is calculated only on the amount that is successfully paid by the client and collected by SAISPL.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. When Commission Is Paid",
    body: (
      <>
        <p>Commission is released after the client payment has been received and cleared by SAISPL.</p>
        <p>For milestone-based projects:</p>
        <ul>
          <li>Commission may be paid proportionally as client payments are received.</li>
          <li>If a client pays in installments, commission may also be paid in installments.</li>
        </ul>
        <p>For recurring retainers:</p>
        <ul>
          <li>Commission may be paid on the first invoice only, or</li>
          <li>In some cases, a recurring commission may be approved in writing for the affiliate.</li>
        </ul>
        <p>Any special payment arrangement must be confirmed in writing before the referral is considered active.</p>
      </>
    ),
  },
  {
    title: "5. Referral Rules",
    body: (
      <>
        <p>To qualify for commission:</p>
        <ul>
          <li>The lead must be introduced by you.</li>
          <li>The client must not already be in active discussion with SAISPL.</li>
          <li>The referral should be identifiable by name, email, phone number, or written introduction.</li>
          <li>The client must close the project directly with SAISPL.</li>
        </ul>
        <p>
          If a client was already in our pipeline before your introduction, commission may not apply unless we agree
          otherwise in writing.
        </p>
      </>
    ),
  },
  {
    title: "6. Affiliate Responsibilities",
    body: (
      <>
        <p>As an affiliate, you agree to:</p>
        <ul>
          <li>Represent SAISPL honestly and professionally.</li>
          <li>Avoid false promises, inflated claims, or misleading pricing statements.</li>
          <li>Share only accurate information about our services.</li>
          <li>Respect client privacy and not misuse confidential business details.</li>
        </ul>
        <p>Affiliates are independent partners, not employees, agents, or legal representatives of SAISPL.</p>
      </>
    ),
  },
  {
    title: "7. Tracking and Verification",
    body: (
      <>
        <p>We may track referrals through:</p>
        <ul>
          <li>Email introductions</li>
          <li>Referral forms</li>
          <li>Direct messages</li>
          <li>Shared lead sheets</li>
          <li>Written confirmation from the client</li>
          <li>Other agreed tracking methods</li>
        </ul>
        <p>
          If more than one person claims the same lead, the commission will be assigned based on the earliest verified
          introduction, unless we decide otherwise.
        </p>
      </>
    ),
  },
  {
    title: "8. Payment Timeline",
    body: (
      <>
        <p>
          Once commission becomes due, payment will generally be made within a reasonable time after client funds are
          received and verified.
        </p>
        <p>Payment method may include:</p>
        <ul>
          <li>Bank transfer</li>
          <li>UPI</li>
          <li>PayPal</li>
          <li>Wise</li>
          <li>Any other mutually agreed method</li>
        </ul>
        <p>The affiliate is responsible for providing correct payout details.</p>
      </>
    ),
  },
  {
    title: "9. Non-Eligible Cases",
    body: (
      <>
        <p>No commission will be paid if:</p>
        <ul>
          <li>The client does not pay SAISPL.</li>
          <li>The lead was already active with us before your introduction.</li>
          <li>The project is canceled before payment is received.</li>
          <li>The referral violates the rules of the program.</li>
          <li>The project value includes non-commissionable items, unless agreed otherwise.</li>
        </ul>
      </>
    ),
  },
  {
    title: "10. Confidentiality",
    body: (
      <p>
        Any business, pricing, strategy, proposal, or client information shared through this program must be kept
        confidential. You may not disclose SAISPL pricing, internal process details, or client information to
        unauthorized parties.
      </p>
    ),
  },
  {
    title: "11. Termination",
    body: (
      <>
        <p>We may suspend or terminate affiliate participation at any time if:</p>
        <ul>
          <li>The affiliate violates these terms.</li>
          <li>The affiliate misrepresents SAISPL.</li>
          <li>Fraud, abuse, or unethical behavior is detected.</li>
          <li>The affiliate damages client trust or brand reputation.</li>
        </ul>
        <p>
          Upon termination, any commission already earned on eligible, collected payments will still be honored unless
          the referral involved fraud or a policy violation.
        </p>
      </>
    ),
  },
  {
    title: "12. No Guarantee of Earnings",
    body: (
      <p>
        The Affiliate Program is an opportunity-based arrangement, not a promise of income. Earnings depend entirely on
        referral quality, client conversion, project scope, and successful payment collection.
      </p>
    ),
  },
  {
    title: "13. Changes to This Program",
    body: (
      <p>
        We may update these terms, commission rates, or eligibility rules at any time. If changes are material, we will
        make reasonable efforts to notify affiliates in advance. Continued participation after changes means acceptance
        of the updated terms.
      </p>
    ),
  },
  {
    title: "14. Contact Us",
    body: (
      <>
        <p>If you have questions about this Affiliate Program, commission eligibility, or payout status, contact us at:</p>
        <ul>
          <li>
            Email:{" "}
            <EmailContactLink
              source="affiliate"
              subject="Affiliate program enquiry"
              className="text-blue-400 underline-offset-4 hover:underline"
            >
              shivaryaninfotech@gmail.com
            </EmailContactLink>
          </li>
          <li>Company: ShivAryan Infotech Services (SAISPL)</li>
          <li>Location: Himachal Pradesh, India</li>
        </ul>
      </>
    ),
  },
];

function AffiliateTerms() {
  return (
    <div className="mt-24">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400">
          Program terms
        </div>
        <h2
          className="mt-6 text-3xl font-bold tracking-tight text-white md:text-4xl"
          style={{ fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif" }}
        >
          Affiliate Program Terms
        </h2>
        <p className="mt-4 text-zinc-400">
          ShivAryan Infotech Services (&ldquo;SAISPL,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
          invites partners, creators, freelancers, consultants, and business connectors to join our Affiliate Program.
          If you refer a client to us and that client purchases one of our eligible services, you will earn a 15%
          commission on the qualifying project value, subject to the terms below.
        </p>
      </div>

      <div className="mt-10 grid gap-6">
        {sections.map((s) => (
          <article
            key={s.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8"
          >
            <h3 className="text-xl font-semibold text-white">{s.title}</h3>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-300 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
              {s.body}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

