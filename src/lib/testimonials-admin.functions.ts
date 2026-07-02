import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertContentEditor, assertSuperAdmin } from "@/lib/admin-auth";

export type Testimonial = {
  id: string;
  client_name: string;
  company: string | null;
  country: string | null;
  quote: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
};

export const listTestimonials = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Testimonial[]> => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Testimonial[];
  });

export const getTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }): Promise<Testimonial | null> => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("testimonials")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return (row ?? null) as Testimonial | null;
  });

export type UpsertTestimonialInput = {
  id?: string;
  client_name: string;
  company: string | null;
  country: string | null;
  quote: string;
  rating: number;
  is_featured: boolean;
};

export const upsertTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: UpsertTestimonialInput) => {
    if (!data.client_name?.trim()) throw new Error("Client name is required");
    if (!data.quote?.trim()) throw new Error("Quote is required");
    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5)
      throw new Error("Rating must be between 1 and 5");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const payload = {
      client_name: data.client_name.trim(),
      company: data.company?.trim() || null,
      country: data.country?.trim() || null,
      quote: data.quote.trim(),
      rating: data.rating,
      is_featured: data.is_featured,
    };
    if (data.id) {
      const { data: row, error } = await admin
        .from("testimonials")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw error;
      return row as Testimonial;
    } else {
      const { data: row, error } = await admin
        .from("testimonials")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return row as Testimonial;
    }
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("testimonials")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const toggleTestimonialFeatured = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; featured: boolean }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("testimonials")
      .update({ is_featured: data.featured })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row as Testimonial;
  });
