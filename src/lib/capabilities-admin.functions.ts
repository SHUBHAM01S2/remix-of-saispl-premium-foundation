import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertContentEditor } from "@/lib/admin-auth";

export type Capability = {
  id: string;
  tag: string;
  title: string;
  description: string;
  meta: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export const CAPABILITY_ICONS = [
  "Globe",
  "Cpu",
  "LayoutDashboard",
  "PenTool",
  "Zap",
  "Rocket",
  "Shield",
  "Database",
  "Sparkles",
  "Code",
  "Bot",
  "Cloud",
  "Server",
  "Layers",
  "LineChart",
  "Smartphone",
] as const;

export const listCapabilities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Capability[]> => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("capabilities")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Capability[];
  });

export const getCapability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }): Promise<Capability | null> => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("capabilities")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return (row ?? null) as Capability | null;
  });

export type UpsertCapabilityInput = {
  id?: string;
  tag: string;
  title: string;
  description: string;
  meta: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

export const upsertCapability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: UpsertCapabilityInput) => {
    if (!data.tag?.trim()) throw new Error("Tag is required");
    if (!data.title?.trim()) throw new Error("Title is required");
    if (!data.description?.trim()) throw new Error("Description is required");
    if (!data.icon?.trim()) throw new Error("Icon is required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as any;
    const payload = {
      tag: data.tag.trim(),
      title: data.title.trim(),
      description: data.description.trim(),
      meta: (data.meta ?? "").trim(),
      icon: data.icon.trim(),
      sort_order: Number.isFinite(data.sort_order) ? data.sort_order : 0,
      is_active: data.is_active,
    };
    if (data.id) {
      const { data: row, error } = await admin
        .from("capabilities")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw error;
      return row as Capability;
    } else {
      const { data: row, error } = await admin
        .from("capabilities")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return row as Capability;
    }
  });

export const deleteCapability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("capabilities")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const toggleCapabilityActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; active: boolean }) => {
    if (!data?.id) throw new Error("id required");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertContentEditor(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin as any)
      .from("capabilities")
      .update({ is_active: data.active })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row as Capability;
  });
