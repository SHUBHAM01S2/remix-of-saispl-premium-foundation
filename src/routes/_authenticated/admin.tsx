import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Mail, Briefcase, FolderKanban, FileText } from "lucide-react";
import { checkIsAdmin, getDashboardStats, getRecentActivity } from "@/lib/admin.functions";
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
  const meFn = useServerFn(checkIsAdmin);
  const statsFn = useServerFn(getDashboardStats);
  const activityFn = useServerFn(getRecentActivity);

  const { data: me } = useQuery({ queryKey: ["admin", "me"], queryFn: () => meFn() });
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () => statsFn(),
  });
  const { data: activity, isLoading: activityLoading, error: activityError } = useQuery({
    queryKey: ["admin", "recent-activity"],
    queryFn: () => activityFn(),
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
    window.location.href = "/shivi";
  };

  const cards = [
    {
      label: "Contact Submissions",
      value: stats?.contactSubmissions,
      icon: Mail,
      accent: "bg-brand/10 text-brand",
    },
    {
      label: "Career Applications",
      value: stats?.careerApplications,
      icon: Briefcase,
      accent: "bg-cta/10 text-cta",
    },
    {
      label: "Portfolio Projects",
      value: stats?.portfolioProjects,
      icon: FolderKanban,
      accent: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Blog Posts",
      value: stats?.blogPosts,
      icon: FileText,
      accent: "bg-violet-500/10 text-violet-600",
    },
  ];

  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as {me?.admin?.email ?? me?.email} · Role: {me?.admin?.role}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/portfolio"
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Manage Portfolio
            </Link>
            <Link
              to="/admin/blog"
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Manage Blog
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.accent}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                  {statsLoading ? "…" : statsError ? "—" : (c.value ?? 0).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Total</p>
              </div>
            );
          })}
        </div>

        {statsError && (
          <p className="mt-6 text-sm text-red-600">
            Unable to load stats: {statsError instanceof Error ? statsError.message : "Unknown error"}
          </p>
        )}

        <div className="mt-12 rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
              <p className="text-xs text-muted-foreground">
                Latest contact submissions and career applications
              </p>
            </div>
          </div>

          {activityLoading ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">Loading…</p>
          ) : activityError ? (
            <p className="px-6 py-8 text-sm text-red-600">
              {activityError instanceof Error ? activityError.message : "Failed to load activity"}
            </p>
          ) : !activity || activity.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {activity.map((item) => {
                const Icon = item.type === "contact" ? Mail : Briefcase;
                const badge =
                  item.type === "contact"
                    ? "bg-brand/10 text-brand"
                    : "bg-cta/10 text-cta";
                return (
                  <li key={`${item.type}-${item.id}`} className="flex items-center gap-4 px-6 py-4">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${badge}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <div className="hidden text-xs text-muted-foreground sm:block">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                    <Link
                      to={item.type === "contact" ? "/admin/contact/$id" : "/admin/career/$id"}
                      params={{ id: item.id }}
                      className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      View Details
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

