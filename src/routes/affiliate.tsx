import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BadgeDollarSign, Handshake, TrendingUp, Users } from "lucide-react";

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
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-zinc-200">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
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
      </section>
    </div>
  );
}
