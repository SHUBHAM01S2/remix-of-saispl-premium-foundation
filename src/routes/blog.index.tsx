import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Tag, ArrowRight, Calendar, ArrowUpRight, Sparkles } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string | null;
  author_name: string | null;
  published_at: string | null;
};

// Fallback seed content used when the Supabase table is empty.
export const SEED: BlogPost[] = [
  {
    id: "s1",
    title: "How Much Does a Website Cost in Himachal Pradesh in 2026?",
    slug: "website-cost-himachal-pradesh-2026",
    excerpt:
      "A transparent breakdown of website pricing in HP — from single-page sites in Shimla to full e-commerce builds in Solan.",
    content:
      "Website pricing in Himachal Pradesh varies widely...\n\nA well-scoped small business site in 2026 typically ranges between Rs.35,000 and Rs.1,50,000 depending on pages, integrations, and the depth of design work.",
    cover_image_url: null,
    category: "Pricing",
    author_name: "Shivaryan Team",
    published_at: "2026-06-15T10:00:00Z",
  },
  {
    id: "s2",
    title: "Why Every School in HP Needs a Website in 2026",
    slug: "why-every-school-in-hp-needs-a-website-2026",
    excerpt:
      "Admissions, notices, fee updates and parent trust — how a modern website is now table stakes for schools across Himachal.",
    content:
      "In 2026 parents research schools online before ever visiting the campus...\n\nA good school website turns enquiries into admissions and reduces the workload on the front office.",
    cover_image_url: null,
    category: "Education",
    author_name: "Shivaryan Team",
    published_at: "2026-06-05T10:00:00Z",
  },
  {
    id: "s3",
    title: "How WhatsApp Automation Is Helping Clinics in Shimla",
    slug: "whatsapp-automation-clinics-shimla",
    excerpt:
      "Appointment reminders, prescription follow-ups and lead capture — real WhatsApp automation flows for clinics in Shimla.",
    content:
      "Clinics in Shimla are using WhatsApp automation to confirm appointments, share prescriptions and follow up with patients — without adding staff.",
    cover_image_url: null,
    category: "Automation",
    author_name: "Shivaryan Team",
    published_at: "2026-05-28T10:00:00Z",
  },
  {
    id: "s4",
    title: "5 Things to Check Before Hiring a Web Designer in Solan",
    slug: "5-things-to-check-before-hiring-web-designer-solan",
    excerpt:
      "Portfolio, ownership of code, ongoing support, timelines and pricing clarity — the checklist before you sign anything in Solan.",
    content:
      "Before you hire a web designer in Solan, ask about code ownership, hosting, ongoing maintenance and payment milestones.",
    cover_image_url: null,
    category: "Hiring",
    author_name: "Shivaryan Team",
    published_at: "2026-05-20T10:00:00Z",
  },
  {
    id: "s5",
    title: "What is Monthly Website Maintenance and Why You Need It",
    slug: "what-is-monthly-website-maintenance",
    excerpt:
      "Security patches, backups, uptime checks and content updates — what actually happens on a monthly care plan.",
    content:
      "Monthly maintenance keeps your site fast, secure and up-to-date. It's the difference between a site that grows and one that quietly breaks.",
    cover_image_url: null,
    category: "Maintenance",
    author_name: "Shivaryan Team",
    published_at: "2026-05-10T10:00:00Z",
  },
  {
    id: "s6",
    title: "How to Get Your Hotel Found on Google in Manali",
    slug: "get-your-hotel-found-on-google-manali",
    excerpt:
      "Google Business Profile, local keywords and review strategy that helps Manali hotels show up when travellers search.",
    content:
      "A well-optimised Google Business Profile and steady stream of reviews will pull in far more direct bookings than paid ads alone.",
    cover_image_url: null,
    category: "Local SEO",
    author_name: "Shivaryan Team",
    published_at: "2026-05-02T10:00:00Z",
  },
];

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts" as never)
    .select(
      "id, title, slug, excerpt, content, cover_image_url, category, author_name, published_at",
    )
    .order("published_at", { ascending: false });
  if (error || !Array.isArray(data) || data.length === 0) return SEED;
  return data as unknown as BlogPost[];
}

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog & Insights — Local SEO, Web Design & Automation | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Articles on web design pricing, school websites, WhatsApp automation, hiring web designers and local SEO for businesses across Himachal Pradesh.",
      },
      { property: "og:title", content: "Shivaryan Infotech Blog & Insights" },
      {
        property: "og:description",
        content:
          "Guides for local businesses in Shimla, Solan, Hamirpur, Manali and beyond — pricing, SEO, automation and website care.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blog" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Shivaryan Infotech Blog & Insights" },
      {
        name: "twitter:description",
        content: "Web, SEO and automation guides for businesses in Himachal Pradesh.",
      },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function formatDate(iso: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>(SEED);
  const [active, setActive] = useState<string>("All");

  useEffect(() => {
    let cancelled = false;
    fetchBlogPosts().then((rows) => {
      if (!cancelled) setPosts(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [posts]);

  const filtered = posts.filter(
    (p) => active === "All" || p.category === active,
  );

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
            Insights from the <span className="text-brand">Shivaryan</span> team
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Practical guides on web design, local SEO and automation — written
            for businesses across Himachal Pradesh and beyond.
          </p>
        </ScrollReveal>
      </section>

      {/* Filters */}
      <section className="bg-background pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
              <Tag className="h-3.5 w-3.5" /> Category
            </span>
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
        </div>
      </section>

      {/* Posts */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <StaggerItem key={post.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface transition-colors hover:border-brand/40"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-background">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5">
                        <BookOpen className="h-10 w-10 text-brand/60" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {post.category && (
                      <span className="inline-flex w-fit items-center rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                        {post.category}
                      </span>
                    )}
                    <h2 className="mt-3 text-lg font-semibold leading-snug text-foreground group-hover:text-brand">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.published_at) || "Draft"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-brand">
                        Read <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filtered.length === 0 && (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              No posts match that filter yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
