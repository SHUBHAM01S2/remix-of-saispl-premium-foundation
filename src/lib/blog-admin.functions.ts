import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertContentEditor } from "@/lib/admin-auth";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
};

export const listBlogPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<BlogPost[]> => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as BlogPost[];
  });

export const getBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }): Promise<BlogPost | null> => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("blog_posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return (row ?? null) as BlogPost | null;
  });

export type UpsertBlogInput = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
};

export const upsertBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: UpsertBlogInput) => {
    if (!data.title?.trim()) throw new Error("Title is required");
    if (!data.slug?.trim()) throw new Error("Slug is required");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug))
      throw new Error("Slug must be lowercase letters, numbers, and hyphens only");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const payload = {
      title: data.title.trim(),
      slug: data.slug.trim(),
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      cover_image_url: data.cover_image_url,
      author_name: data.author_name,
      published_at: data.published_at,
    };
    if (data.id) {
      const { data: row, error } = await admin
        .from("blog_posts")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw error;
      return row as BlogPost;
    } else {
      const { data: row, error } = await admin
        .from("blog_posts")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return row as BlogPost;
    }
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("blog_posts")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const toggleBlogPublish = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; publish: boolean }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("blog_posts")
      .update({ published_at: data.publish ? new Date().toISOString() : null })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row as BlogPost;
  });

export const BLOG_CATEGORIES = [
  "Announcements",
  "Engineering",
  "Design",
  "Case Studies",
  "Tutorials",
  "Company News",
] as const;
