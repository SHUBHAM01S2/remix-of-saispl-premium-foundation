import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    // Do NOT reveal that a login page exists — 404 instead.
    if (error || !data.user) throw notFound();
    return { user: data.user };
  },
  component: () => <Outlet />,
});
