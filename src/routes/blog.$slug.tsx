import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, User, BookOpen } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { getPublicBlogPostMeta } from "@/lib/blog-public.functions";
import { BLOG_PROSE_CLASSES } from "@/lib/blog-content-styles";
import { htmlToVisibleText, sanitizeBlogContentHtml } from "@/lib/blog-content-sanitize";
import { SEED, type BlogPost } from "./blog.index";

const SEED_INDEX: Record<string, BlogPost> = Object.fromEntries(
  SEED.map((p) => [p.slug, p]),
);

async function fetchBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts" as never)
    .select(
      "id, title, slug, excerpt, content, cover_image_url, category, author_name, published_at",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (!error && data) return data as unknown as BlogPost;
  return SEED_INDEX[slug] ?? null;
}

async function fetchRelated(
  category: string | null,
  excludeSlug: string,
): Promise<BlogPost[]> {
  let query = supabase
    .from("blog_posts" as never)
    .select(
      "id, title, slug, excerpt, content, cover_image_url, category, author_name, published_at",
    )
    .neq("slug", excludeSlug)
    .order("published_at", { ascending: false })
    .limit(3);
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error || !Array.isArray(data)) return [];
  return data as unknown as BlogPost[];
}

const SITE = "Shivaryan Infotech";

function truncate(s: string, n: number) {
  const clean = s.replace(/\s+/g, " ").trim();
  if (clean.length <= n) return clean;
  return clean.slice(0, n - 1).trimEnd() + "…";
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, " ");
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    try {
      const meta = await getPublicBlogPostMeta({ data: { slug: params.slug } });
      if (meta) return { meta };
    } catch {
      // Ignore — fall through to seed lookup.
    }
    const seed = SEED_INDEX[params.slug];
    if (seed) {
      return {
        meta: {
          title: seed.title,
          slug: seed.slug,
          excerpt: seed.excerpt,
          cover_image_url: seed.cover_image_url,
          category: seed.category,
          author_name: seed.author_name,
          published_at: seed.published_at,
        },
      };
    }
    return { meta: null };
  },
  head: ({ params, loaderData }) => {
    const m = loaderData?.meta;
    const url = `/blog/${params.slug}`;
    const rawTitle = m?.title?.trim() || params.slug.replace(/-/g, " ");
    const title = truncate(`${rawTitle} — ${SITE} Blog`, 65);
    const description = truncate(
      stripHtml(m?.excerpt || `${rawTitle} — insights from the ${SITE} team.`),
      160,
    );
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ];
    if (m?.cover_image_url) {
      meta.push(
        { property: "og:image", content: m.cover_image_url },
        { name: "twitter:image", content: m.cover_image_url },
      );
    }
    if (m?.author_name) meta.push({ name: "author", content: m.author_name });
    if (m?.category) meta.push({ property: "article:section", content: m.category });
    if (m?.published_at)
      meta.push({ property: "article:published_time", content: m.published_at });

    const scripts = m
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: rawTitle,
              description,
              image: m.cover_image_url || undefined,
              datePublished: m.published_at || undefined,
              author: m.author_name
                ? { "@type": "Person", name: m.author_name }
                : { "@type": "Organization", name: SITE },
              publisher: { "@type": "Organization", name: SITE },
              mainEntityOfPage: url,
              articleSection: m.category || undefined,
            }),
          },
        ]
      : undefined;

    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  component: BlogPostPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Link to="/blog" className="mt-6 inline-block text-brand hover:underline">
        ← Back to blog
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn't find the article you're looking for.
      </p>
      <Link to="/blog" className="mt-6 inline-block text-brand hover:underline">
        ← Back to blog
      </Link>
    </div>
  ),
});

function formatDate(iso: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMissing(false);
    (async () => {
      const found = await fetchBySlug(slug);
      if (cancelled) return;
      if (!found) {
        setMissing(true);
        setLoading(false);
        return;
      }
      setPost(found);
      const rel = await fetchRelated(found.category, found.slug);
      if (!cancelled) setRelated(rel);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (missing) {
    throw notFound();
  }

  if (loading || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">
        Loading article…
      </div>
    );
  }

  const rawContent = post.content ?? "";
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(rawContent);
  const sanitizedContent = looksLikeHtml ? sanitizeBlogContentHtml(rawContent) : "";
  const hasVisibleHtmlContent = htmlToVisibleText(sanitizedContent).length > 0;
  const paragraphs = looksLikeHtml ? [] : rawContent.split(/\n{2,}/).filter(Boolean);


  return (
    <article>
      {/* Cover */}
      <div className="relative aspect-[16/6] max-h-[420px] w-full overflow-hidden bg-background sm:aspect-[16/5]">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5">
            <BookOpen className="h-16 w-16 text-brand/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
      </div>

      {/* Header */}
      <ScrollReveal>
        <header className="mx-auto mt-8 max-w-3xl px-4 sm:px-6 lg:px-8">

          <div className="mb-6 border-b border-border/60 pb-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
            </Link>
          </div>
          {post.category && (
            <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
              {post.category}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.author_name && (
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {post.author_name}
              </span>
            )}
            {post.published_at && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(post.published_at)}
              </span>
            )}
          </div>
        </header>
      </ScrollReveal>

      {/* Body */}
      <ScrollReveal>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {post.excerpt && (
            <p className="mb-8 border-l-4 border-brand/60 pl-4 text-lg italic text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          <div className={`space-y-1 ${BLOG_PROSE_CLASSES}`}>
            {looksLikeHtml && hasVisibleHtmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            ) : paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">
                Full article coming soon.
              </p>
            )}
          </div>
        </div>
      </ScrollReveal>


      {/* Related */}
      {related.length > 0 && (
        <ScrollReveal>
          <section className="border-t border-border/50 bg-surface/40 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground">
                Related Posts
              </h2>
              <StaggerContainer className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {related.map((r) => (
                  <StaggerItem key={r.id}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: r.slug }}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface transition-colors hover:border-brand/40"
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-background">
                        {r.cover_image_url ? (
                          <img
                            src={r.cover_image_url}
                            alt={r.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5">
                            <BookOpen className="h-8 w-8 text-brand/60" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        {r.category && (
                          <span className="inline-flex w-fit items-center rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
                            {r.category}
                          </span>
                        )}
                        <h3 className="mt-2 text-base font-semibold leading-snug text-foreground group-hover:text-brand">
                          {r.title}
                        </h3>
                        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-brand">
                          Read <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </ScrollReveal>
      )}
    </article>
  );
}
