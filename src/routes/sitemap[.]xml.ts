import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://shivaryaninfotech.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/web-design-development", changefreq: "monthly", priority: "0.9" },
  { path: "/seo-digital-marketing", changefreq: "monthly", priority: "0.9" },
  { path: "/automation-ai-services", changefreq: "monthly", priority: "0.9" },
  { path: "/custom-portals-software", changefreq: "monthly", priority: "0.9" },
  { path: "/branding-graphic-design", changefreq: "monthly", priority: "0.8" },
  { path: "/care-maintenance", changefreq: "monthly", priority: "0.8" },
  { path: "/pricing", changefreq: "monthly", priority: "0.8" },
  { path: "/our-works", changefreq: "weekly", priority: "0.8" },
  { path: "/web-development-company-bilaspur-himachal-pradesh", changefreq: "monthly", priority: "0.9" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/affiliate", changefreq: "monthly", priority: "0.6" },
  { path: "/affiliate-enquiry", changefreq: "monthly", priority: "0.5" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/blog/ai-automation-small-business-india", changefreq: "monthly", priority: "0.7" },
  { path: "/career", changefreq: "weekly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        const [blogRes, worksRes] = await Promise.all([
          supabase
            .from("blog_posts")
            .select("slug, published_at, updated_at")
            .not("published_at", "is", null)
            .lte("published_at", new Date().toISOString()),
          supabase
            .from("portfolio_projects")
            .select("id, updated_at, created_at"),
        ]);

        const blogEntries: SitemapEntry[] = (blogRes.data ?? []).map((p: any) => ({
          path: `/blog/${p.slug}`,
          lastmod: toIsoDate(p.updated_at ?? p.published_at),
          changefreq: "monthly",
          priority: "0.7",
        }));

        const workEntries: SitemapEntry[] = (worksRes.data ?? []).map((w: any) => ({
          path: `/our-works/${w.id}`,
          lastmod: toIsoDate(w.updated_at ?? w.created_at),
          changefreq: "monthly",
          priority: "0.6",
        }));

        // Dedup by path (keep first occurrence).
        const seen = new Set<string>();
        const entries = [
          ...STATIC_ENTRIES.map((e) => ({ ...e, lastmod: e.lastmod ?? today })),
          ...blogEntries,
          ...workEntries,
        ].filter((e) => {
          if (seen.has(e.path)) return false;
          seen.add(e.path);
          return true;
        });

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${escapeXml(`${BASE_URL}${e.path}`)}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
