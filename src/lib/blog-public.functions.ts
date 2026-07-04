import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export type PublicBlogMeta = {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  author_name: string | null;
  published_at: string | null;
};

export const getPublicBlogPostMeta = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => {
    if (!data?.slug || typeof data.slug !== "string") throw new Error("slug required");
    return data;
  })
  .handler(async ({ data }): Promise<PublicBlogMeta | null> => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return null;
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: row, error } = await client
      .from("blog_posts" as never)
      .select(
        "title, slug, excerpt, cover_image_url, category, author_name, published_at",
      )
      .eq("slug", data.slug)
      .not("published_at", "is", null)
      .maybeSingle();
    if (error || !row) return null;
    return row as unknown as PublicBlogMeta;
  });
