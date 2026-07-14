import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { RelatedLinks } from "@/components/RelatedLinks";
import {
  Monitor,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Wrench,
  TrendingUp,
  Clock,
  Building2,
  Tag,
} from "lucide-react";

interface CaseStudy {
  id: string;
  name: string;
  client: string;
  industry: string;
  category: string;
  duration: string;
  heroGradient: string;
  challenge: string;
  solution: string;
  results: string;
  stats: { value: string; label: string }[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "global-trade-platform",
    name: "Global Trade Platform",
    client: "Vertex Global Markets",
    industry: "Finance / Trading",
    category: "Web",
    duration: "4 months",
    heroGradient: "from-indigo-500/20 to-blue-500/10",
    challenge:
      "Vertex Global Markets was drowning in manual order processing across 12 international exchanges. Their legacy system caused an average delay of 8 minutes per trade, leading to missed arbitrage opportunities and significant revenue loss. Compliance reporting was fragmented across 4 different spreadsheets, creating audit risk.",
    solution:
      "We architected a unified trading portal with real-time WebSocket feeds, AI-powered order matching, and automated compliance reporting. The platform integrates with 15+ exchange APIs and uses machine learning to predict optimal execution windows, reducing manual intervention by 94%.",
    results:
      "The new platform went live ahead of schedule and immediately transformed operations. Order processing became near-instant, compliance reports generate automatically, and the AI matching engine has identified over $2M in additional arbitrage opportunities in the first quarter alone.",
    stats: [
      { value: "68%", label: "Faster order processing" },
      { value: "$2M+", label: "New arbitrage captured" },
      { value: "94%", label: "Manual work reduced" },
    ],
  },
  {
    id: "medicare-connect",
    name: "MediCare Connect",
    client: "HealthFirst Network",
    industry: "Healthcare",
    category: "Software",
    duration: "6 months",
    heroGradient: "from-emerald-500/20 to-teal-500/10",
    challenge:
      "HealthFirst Network operated 40+ hospital branches with completely disconnected patient intake systems. Patients waited an average of 45 minutes to check in, duplicate records were rampant, and staff spent 3+ hours daily on manual data reconciliation across locations.",
    solution:
      "We built a centralized cloud-native patient management system with biometric check-in kiosks, real-time EHR synchronization, and an intelligent scheduling algorithm that optimizes doctor availability across all branches. A unified patient identity layer eliminated duplicate records entirely.",
    results:
      "Patient intake time dropped from 45 minutes to under 5 minutes. Staff reconciliation workload disappeared entirely. The system now handles 12,000+ daily active users seamlessly, and patient satisfaction scores improved by 34% within the first two months.",
    stats: [
      { value: "12,000+", label: "Daily active users" },
      { value: "89%", label: "Faster patient intake" },
      { value: "34%", label: "Higher satisfaction" },
    ],
  },
  {
    id: "finvue-analytics",
    name: "FinVue Analytics",
    client: "Apex Wealth Management",
    industry: "FinTech",
    category: "AI/Automation",
    duration: "5 months",
    heroGradient: "from-violet-500/20 to-purple-500/10",
    challenge:
      "Apex Wealth Management managed over $2B in assets but lacked real-time visibility into portfolio risk. Their quarterly manual reviews missed sudden market shifts, and clients received outdated performance reports that undermined trust and retention.",
    solution:
      "We developed an AI-driven analytics platform that ingests market data from 50+ sources in real time, runs continuous Monte Carlo risk simulations, and delivers personalized client dashboards with predictive alerts. Natural language generation produces human-readable portfolio commentaries automatically.",
    results:
      "Portfolio managers now catch risk exposures 72 hours earlier on average. Client retention improved 28% thanks to transparent, always-current reporting. The AI commentary engine saves 120+ analyst hours per month while delivering more detailed narratives than manual reports ever could.",
    stats: [
      { value: "$2B+", label: "Assets under management" },
      { value: "72 hrs", label: "Earlier risk detection" },
      { value: "28%", label: "Improved retention" },
    ],
  },
  {
    id: "logistics-hub-ai",
    name: "Logistics Hub AI",
    client: "SwiftRoute Transport",
    industry: "Logistics",
    category: "AI/Automation",
    duration: "7 months",
    heroGradient: "from-amber-500/20 to-orange-500/10",
    challenge:
      "SwiftRoute Transport operated a fleet of 800+ vehicles with routing decisions made by dispatchers using static maps and experience alone. Fuel costs were 23% above industry benchmark, on-time delivery hovered at 78%, and driver overtime was burning through the payroll budget.",
    solution:
      "We deployed an AI logistics platform that combines real-time traffic, weather, and delivery-window data to generate dynamic routes every 15 minutes. Predictive maintenance alerts prevent breakdowns before they happen, and an automated load-balancing system redistributes jobs across the fleet in real time.",
    results:
      "Fuel spend dropped by 42% in the first quarter after launch. On-time delivery jumped to 96.4%. Driver overtime decreased by 58% as the AI optimized shift lengths and route distances. The platform now manages 800+ vehicles with a single dispatcher.",
    stats: [
      { value: "42%", label: "Fleet cost reduction" },
      { value: "96.4%", label: "On-time delivery" },
      { value: "58%", label: "Less driver overtime" },
    ],
  },
  {
    id: "aura-mobile-experience",
    name: "Aura Mobile Experience",
    client: "Aura Consumer Tech",
    industry: "Consumer Tech",
    category: "Design",
    duration: "3 months",
    heroGradient: "from-pink-500/20 to-rose-500/10",
    challenge:
      "Aura Consumer Tech's mobile app suffered from a 68% drop-off rate during onboarding and an average session length of just 2.3 minutes. User research revealed confusion around navigation hierarchy, inconsistent visual language, and a frustrating checkout flow with 6 redundant steps.",
    solution:
      "We conducted a full UX audit with 40+ user interviews, then redesigned the entire experience from the ground up. A new design system unified 120+ components, onboarding was reduced to 3 progressive steps, and checkout was streamlined to a single-screen flow with smart defaults.",
    results:
      "Onboarding completion rose from 32% to 87%. Average session length more than tripled to 7.8 minutes. Most importantly, user retention at 30 days jumped by 55%, and App Store ratings climbed from 2.9 to 4.7 stars within two months of the redesign launch.",
    stats: [
      { value: "55%", label: "Higher 30-day retention" },
      { value: "4.7", label: "App Store rating" },
      { value: "3x", label: "Longer sessions" },
    ],
  },
  {
    id: "retailflow-erp",
    name: "RetailFlow ERP",
    client: "UrbanMart Retail Group",
    industry: "Retail",
    category: "Software",
    duration: "8 months",
    heroGradient: "from-cyan-500/20 to-sky-500/10",
    challenge:
      "UrbanMart Retail Group ran 200+ store locations using 6 disconnected systems for inventory, sales, HR, and accounting. Data reconciliation took 4 days every month, stock-outs were frequent because inventory didn't sync in real time, and new store onboarding required 3 weeks of IT setup.",
    solution:
      "We built RetailFlow, a unified cloud ERP with real-time inventory synchronization across all locations, integrated POS with automated accounting, and a self-service HR portal. A headless API architecture allows each store to connect custom peripherals while maintaining a single source of truth.",
    results:
      "Monthly reconciliation shrank from 4 days to 45 minutes. Stock-outs decreased by 61% thanks to real-time inventory visibility. New store onboarding now takes 2 days instead of 3 weeks. The system processes 1.2M+ transactions daily with 99.99% uptime.",
    stats: [
      { value: "200+", label: "Store locations unified" },
      { value: "61%", label: "Fewer stock-outs" },
      { value: "99.99%", label: "Platform uptime" },
    ],
  },
  {
    id: "greenenergy-portal",
    name: "GreenEnergy Portal",
    client: "EcoPower Foundation",
    industry: "Energy",
    category: "Web",
    duration: "3.5 months",
    heroGradient: "from-green-500/20 to-lime-500/10",
    challenge:
      "EcoPower Foundation needed a public-facing platform to transparently display carbon offset metrics for 50+ partner projects. Their existing PDF reports were static, unengaging, and failed to build public trust. They wanted real-time dashboards that anyone could access.",
    solution:
      "We designed and built a visually rich sustainability portal with live IoT data feeds from partner installations, interactive maps showing carbon impact by region, and automated quarterly report generation. Gamification features encourage visitors to pledge personal offsets.",
    results:
      "The portal now serves 85,000+ monthly visitors with real-time data from 50+ active projects. Public engagement tripled, and partner onboarding requests increased 40% because the transparent metrics became a powerful marketing tool for EcoPower's collaborators.",
    stats: [
      { value: "85K+", label: "Monthly visitors" },
      { value: "50+", label: "Live project feeds" },
      { value: "3x", label: "Public engagement" },
    ],
  },
  {
    id: "nexgen-brand-identity",
    name: "NexGen Brand Identity",
    client: "NexGen Robotics",
    industry: "Technology",
    category: "Design",
    duration: "2.5 months",
    heroGradient: "from-fuchsia-500/20 to-pink-500/10",
    challenge:
      "NexGen Robotics was preparing for a Series A fundraise but their visual identity looked dated and inconsistent across pitch decks, product UI, and marketing materials. Investor meetings showed confusion about what the company actually built. They needed a brand that communicated innovation and trust simultaneously.",
    solution:
      "We developed a complete brand system including logo, typography, color palette, motion language, and component library. The new identity bridges human warmth with robotic precision. We redesigned the pitch deck, product UI, and marketing website as a unified expression of the brand.",
    results:
      "Investor engagement during the Series A roadshow increased 3x compared to the previous round. The round closed at 140% of the target. The design system now powers 12+ product teams, ensuring every customer touchpoint remains consistent as NexGen scales.",
    stats: [
      { value: "3x", label: "Investor engagement" },
      { value: "140%", label: "Funding target reached" },
      { value: "12+", label: "Product teams using system" },
    ],
  },
];

export const Route = createFileRoute("/our-works/$caseStudyId")({
  head: ({ params }) => {
    const study = caseStudies.find((s) => s.id === params.caseStudyId);
    const title = study
      ? `${study.name} — Case Study | Shivaryan Infotech`
      : "Case Study — Shivaryan Infotech";
    const description = study
      ? `See how Shivaryan Infotech helped ${study.client} in the ${study.industry} sector achieve measurable results.`
      : "Explore detailed case studies of digital transformation projects by Shivaryan Infotech.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CaseStudyDetail,
});

function CaseStudyDetail() {
  const { caseStudyId } = Route.useParams();
  const study = caseStudies.find((s) => s.id === caseStudyId);

  if (!study) {
    throw notFound();
  }

  const currentIndex = caseStudies.findIndex((s) => s.id === caseStudyId);
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background pb-16 pt-20 md:pb-24 md:pt-28">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${study.heroGradient} opacity-60`}
        />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/our-works"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Our Works
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Text */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                  <Tag className="h-3 w-3" />
                  {study.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {study.duration}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {study.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-brand" />
                  {study.client}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-brand" />
                  {study.industry}
                </span>
              </div>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {study.results}
              </p>
            </div>

            {/* Hero image placeholder */}
            <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-surface sm:h-80 lg:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated/50 to-transparent" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <Monitor className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {study.stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <span className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content sections */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Challenge */}
            <div className="rounded-2xl border border-border/50 bg-surface p-8 md:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  The Challenge
                </h2>
              </div>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                {study.challenge}
              </p>
            </div>

            {/* Solution */}
            <div className="rounded-2xl border border-border/50 bg-surface p-8 md:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Wrench className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Our Solution
                </h2>
              </div>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                {study.solution}
              </p>
            </div>

            {/* Results */}
            <div className="rounded-2xl border border-border/50 bg-surface p-8 md:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Results & Impact
                </h2>
              </div>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                {study.results}
              </p>

              {/* Stat cards */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {study.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/50 bg-background p-5 text-center transition-colors hover:border-brand/30"
                  >
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Project */}
      <section className="border-t border-border/50 bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Next Project
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {nextStudy.name}
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {nextStudy.industry} — {nextStudy.category}
          </p>
          <div className="mt-8">
            <Link
              to="/our-works/$caseStudyId"
              params={{ caseStudyId: nextStudy.id }}
              className="group inline-flex items-center gap-2 rounded-full bg-cta px-8 py-3.5 text-sm font-semibold text-cta-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2 focus:ring-offset-surface"
            >
              View Case Study
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
      <RelatedLinks currentPath="/our-works" heading="Explore related services" eyebrow="What powered this project" />
    </div>
  );
}

