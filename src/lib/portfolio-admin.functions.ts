import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertContentEditor, assertSuperAdmin } from "@/lib/admin-auth";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("admins")
    .select("id")
    .eq("id", ctx.userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Forbidden");
}

export type PortfolioProject = {
  id: string;
  title: string;
  client_industry: string;
  category: string;
  thumbnail_url: string | null;
  screenshot_urls: string[];
  challenge: string | null;
  solution: string | null;
  results: string | null;
  is_featured: boolean;
  created_at: string;
};

export const listPortfolioProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortfolioProject[]> => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("portfolio_projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as PortfolioProject[];
  });

export const getPortfolioProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }): Promise<PortfolioProject | null> => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("portfolio_projects")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return (row ?? null) as PortfolioProject | null;
  });

export type UpsertPortfolioInput = {
  id?: string;
  title: string;
  client_industry: string;
  category: string;
  thumbnail_url: string | null;
  screenshot_urls: string[];
  challenge: string | null;
  solution: string | null;
  results: string | null;
  is_featured: boolean;
};

export const upsertPortfolioProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: UpsertPortfolioInput) => {
    if (!data.title?.trim()) throw new Error("Title is required");
    if (!data.client_industry?.trim()) throw new Error("Client industry is required");
    if (!data.category?.trim()) throw new Error("Category is required");
    if (!Array.isArray(data.screenshot_urls)) throw new Error("Invalid screenshots");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      title: data.title.trim(),
      client_industry: data.client_industry.trim(),
      category: data.category.trim(),
      thumbnail_url: data.thumbnail_url,
      screenshot_urls: data.screenshot_urls,
      challenge: data.challenge,
      solution: data.solution,
      results: data.results,
      is_featured: data.is_featured,
    };
    const admin = supabaseAdmin as any;
    if (data.id) {
      const { data: row, error } = await admin
        .from("portfolio_projects")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw error;
      return row as PortfolioProject;
    } else {
      const { data: row, error } = await admin
        .from("portfolio_projects")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return row as PortfolioProject;
    }
  });

export const deletePortfolioProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("portfolio_projects")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
