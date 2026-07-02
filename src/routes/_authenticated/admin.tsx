import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { checkIsAdmin } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    // Signed-in but not an admin — hide the panel behind 404.
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin };
  },
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin Panel — SAISPL" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminPage() {
  const router = useRouter();
  const fn = useServerFn(checkIsAdmin);
  const { data } = useQuery({ queryKey: ["admin", "me"], queryFn: () => fn() });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
    window.location.href = "/shivi";
  };

  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Panel</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as {data?.admin?.email ?? data?.email} · Role: {data?.admin?.role}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Sign out
          </button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Welcome</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This area is restricted to admin users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
