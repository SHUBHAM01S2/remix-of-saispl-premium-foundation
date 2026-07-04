import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Tag, ArrowRight, Calendar, ArrowUpRight } from "lucide-react";
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

async function fetchBlogPosts(): Promise<{ posts: BlogPost[]; source: "db" | "fallback" }> {
  const res = await (supabase as any)
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, cover_image_url, category, author_name, published_at",
    )
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  const rows = res.data as BlogPost[] | null;
  if (res.error || !Array.isArray(rows) || rows.length === 0) {
    return { posts: SEED, source: "fallback" };
  }
  return { posts: rows, source: "db" };
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
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);

  useEffect(() => {
    let cancelled = false;
    fetchBlogPosts().then((res) => {
      if (cancelled) return;
      setPosts(res.posts);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const paged = filtered.slice(pageStart, pageStart + pageSize);

  // Reset page when filter / page size change.
  useEffect(() => {
    setPage(1);
  }, [active, pageSize]);


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
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paged.map((post, idx) => {
              const num = String(pageStart + idx + 1).padStart(2, "0");

              const displayFont = { fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" };
              return (
                <StaggerItem key={post.id}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--color-brand)_45%,transparent)]"
                  >
                    <div
                      className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                      style={{ background: "color-mix(in oklab, var(--color-brand) 55%, transparent)" }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.12]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
                        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute -right-2 -bottom-6 select-none text-[8rem] font-black leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-brand/10"
                      style={displayFont}
                    >
                      {num}
                    </div>

                    {post.cover_image_url && (
                      <div className="relative -mx-6 -mt-6 mb-6 aspect-[16/9] overflow-hidden rounded-t-3xl bg-background">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/0 to-background/0" />
                      </div>
                    )}

                    <div className="relative flex items-center justify-between">
                      {post.category ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <span className="h-1 w-1 rounded-full bg-brand" />
                          {post.category}
                        </span>
                      ) : <span />}
                      <span className="font-mono text-[10px] tracking-widest text-zinc-600">{num}</span>
                    </div>

                    <div className="relative mt-6 flex items-center justify-end">
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" />
                    </div>


                    <h2 className="relative mt-6 text-xl font-bold leading-tight text-foreground group-hover:text-brand" style={displayFont}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="relative mt-6 flex-1" />

                    <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.published_at) || "Draft"}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-brand">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {filtered.length === 0 && (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              No posts match that filter yet.
            </p>
          )}

          {filtered.length > 0 && (
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
              <div className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{pageStart + 1}</span>–
                <span className="font-medium text-foreground">{Math.min(pageStart + pageSize, filtered.length)}</span>{" "}
                of <span className="font-medium text-foreground">{filtered.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Per page</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground outline-none focus:border-brand"
                >
                  {[6, 9, 12, 24].map((n) => (
                    <option key={n} value={n} className="bg-background text-foreground">{n}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="rounded-md border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground disabled:opacity-40 hover:border-brand/40"
                >
                  Prev
                </button>
                <span className="px-2 text-xs text-muted-foreground">
                  Page <span className="font-medium text-foreground">{currentPage}</span> / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="rounded-md border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground disabled:opacity-40 hover:border-brand/40"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
