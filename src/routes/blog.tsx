import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Tag, MapPin, ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Pricing" | "Education" | "Automation" | "Hiring" | "Maintenance" | "Local SEO";
  tags: string[];
  city?: string;
  readTime: string;
};

const posts: Post[] = [
  {
    slug: "website-cost-himachal-pradesh-2026",
    title: "How Much Does a Website Cost in Himachal Pradesh in 2026?",
    excerpt:
      "A transparent breakdown of website pricing in HP — from single-page sites in Shimla to full e-commerce builds in Solan.",
    category: "Pricing",
    tags: ["pricing", "himachal-pradesh", "web-design"],
    city: "Himachal Pradesh",
    readTime: "6 min read",
  },
  {
    slug: "why-every-school-in-hp-needs-a-website-2026",
    title: "Why Every School in HP Needs a Website in 2026",
    excerpt:
      "Admissions, notices, fee updates and parent trust — how a modern website is now table stakes for schools across Himachal.",
    category: "Education",
    tags: ["schools", "education", "himachal-pradesh"],
    city: "Himachal Pradesh",
    readTime: "5 min read",
  },
  {
    slug: "whatsapp-automation-clinics-shimla",
    title: "How WhatsApp Automation Is Helping Clinics in Shimla",
    excerpt:
      "Appointment reminders, prescription follow-ups and lead capture — real WhatsApp automation flows for clinics in Shimla.",
    category: "Automation",
    tags: ["whatsapp", "automation", "healthcare", "shimla"],
    city: "Shimla",
    readTime: "7 min read",
  },
  {
    slug: "5-things-to-check-before-hiring-web-designer-solan",
    title: "5 Things to Check Before Hiring a Web Designer in Solan",
    excerpt:
      "Portfolio, ownership of code, ongoing support, timelines and pricing clarity — the checklist before you sign anything in Solan.",
    category: "Hiring",
    tags: ["hiring", "web-design", "solan"],
    city: "Solan",
    readTime: "5 min read",
  },
  {
    slug: "what-is-monthly-website-maintenance",
    title: "What is Monthly Website Maintenance and Why You Need It",
    excerpt:
      "Security patches, backups, uptime checks and content updates — what actually happens on a monthly care plan.",
    category: "Maintenance",
    tags: ["maintenance", "care-plan", "security"],
    readTime: "6 min read",
  },
  {
    slug: "get-your-hotel-found-on-google-manali",
    title: "How to Get Your Hotel Found on Google in Manali",
    excerpt:
      "Google Business Profile, local keywords and review strategy that helps Manali hotels show up when travellers search.",
    category: "Local SEO",
    tags: ["seo", "hotels", "manali", "google-business-profile"],
    city: "Manali",
    readTime: "8 min read",
  },
];

const categories = ["All", "Pricing", "Education", "Automation", "Hiring", "Maintenance", "Local SEO"] as const;

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Local SEO, Web Design & Automation in Himachal | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Articles on web design pricing, school websites, WhatsApp automation, hiring web designers and local SEO for businesses across Himachal Pradesh.",
      },
      { property: "og:title", content: "Shivaryan Infotech Blog — Web, SEO & Automation in HP" },
      {
        property: "og:description",
        content:
          "Guides for local businesses in Shimla, Solan, Hamirpur, Manali and beyond — pricing, SEO, automation and website care.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blog" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Shivaryan Infotech Blog" },
      {
        name: "twitter:description",
        content: "Web, SEO and automation guides for businesses in Himachal Pradesh.",
      },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [],
  );

  const filtered = posts.filter((p) => {
    const catOk = active === "All" || p.category === active;
    const tagOk = !tag || p.tags.includes(tag);
    return catOk && tagOk;
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            The <span className="text-brand">Shivaryan</span> Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Practical guides on web design, local SEO and automation — written for businesses across Himachal Pradesh.
          </p>
        </ScrollReveal>
      </section>

      {/* Filters */}
      <section className="bg-background pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors " +
                  (active === c
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground")
                }
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
              <Tag className="h-3.5 w-3.5" /> Tags
            </span>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(tag === t ? null : t)}
                className={
                  "rounded-md border px-2.5 py-1 text-xs transition-colors " +
                  (tag === t
                    ? "border-brand/40 bg-brand/10 text-brand"
                    : "border-border bg-background text-muted-foreground hover:text-foreground")
                }
              >
                #{t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <StaggerItem key={post.slug}>
                <article className="group flex h-full flex-col rounded-2xl border border-border/50 bg-surface p-6 transition-colors hover:border-brand/40">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                      {post.category}
                    </span>
                    {post.city && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {post.city}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold leading-snug text-foreground group-hover:text-brand">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filtered.length === 0 && (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              No posts match those filters yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
