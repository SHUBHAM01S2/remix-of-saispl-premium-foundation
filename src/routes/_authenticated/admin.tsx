import {
  createFileRoute,
  Link,
  notFound,
  Outlet,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  Briefcase,
  FolderKanban,
  FileText,
  
  Sparkles,
  MessageSquare,
  Layers,
  BadgeCheck,
  ShieldCheck,
  BarChart3,
  Handshake,
  LogOut,
  Settings,
  ArrowRight,
} from "lucide-react";
import { checkIsAdmin, getDashboardStats, getRecentActivity } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin };
  },
  component: AdminShell,
  head: () => ({
    meta: [
      { title: "Admin Panel — SAISPL" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminShell() {
  const location = useLocation();
  if (location.pathname.replace(/\/$/, "") !== "/admin") {
    return <Outlet />;
  }
  return <AdminDashboard />;
}

type ModuleDef = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  accent: string;
  superOnly?: boolean;
};

const WORKSPACE_MODULES: ModuleDef[] = [
  {
    label: "Client Onboarding",
    to: "/admin/onboarding",
    icon: Handshake,
    desc: "Intake, assets, access & kickoff readiness",
    accent: "from-brand/30 to-brand/5 text-brand",
  },
  {
    label: "Client Reports",
    to: "/admin/reports",
    icon: BarChart3,
    desc: "Deliver monthly performance reports",
    accent: "from-emerald-500/30 to-emerald-500/5 text-emerald-300",
    superOnly: true,
  },
];

const CONTENT_MODULES: ModuleDef[] = [
  {
    label: "Portfolio",
    to: "/admin/portfolio",
    icon: FolderKanban,
    desc: "Case studies & featured work",
    accent: "from-amber-500/25 to-amber-500/5 text-amber-300",
  },
  {
    label: "Blog",
    to: "/admin/blog",
    icon: FileText,
    desc: "Articles & thought leadership",
    accent: "from-violet-500/25 to-violet-500/5 text-violet-300",
  },
  {
    label: "Testimonials",
    to: "/admin/testimonials",
    icon: MessageSquare,
    desc: "Client quotes & social proof",
    accent: "from-sky-500/25 to-sky-500/5 text-sky-300",
  },
  {
    label: "Capabilities",
    to: "/admin/capabilities",
    icon: Layers,
    desc: "Services & offering pages",
    accent: "from-fuchsia-500/25 to-fuchsia-500/5 text-fuchsia-300",
  },
];

const OPERATIONS_MODULES: ModuleDef[] = [
  {
    label: "Contact Submissions",
    to: "/admin/contacts",
    icon: Mail,
    desc: "Inbound enquiries from the website",
    accent: "from-blue-500/25 to-blue-500/5 text-blue-300",
    superOnly: true,
  },
  {
    label: "Affiliate Enquiries",
    to: "/admin/affiliate-enquiries",
    icon: BadgeCheck,
    desc: "Applications from partners",
    accent: "from-teal-500/25 to-teal-500/5 text-teal-300",
    superOnly: true,
  },
  {
    label: "Career Applications",
    to: "/admin/careers",
    icon: Briefcase,
    desc: "Candidate applications",
    accent: "from-rose-500/25 to-rose-500/5 text-rose-300",
    superOnly: true,
  },
  {
    label: "Job Openings",
    to: "/admin/jobs",
    icon: Sparkles,
    desc: "Manage roles listed on /career",
    accent: "from-indigo-500/25 to-indigo-500/5 text-indigo-300",
    superOnly: true,
  },
];

const ADMIN_MODULES: ModuleDef[] = [
  {
    label: "Manage Admins",
    to: "/admin/admins",
    icon: ShieldCheck,
    desc: "Roles & access control",
    accent: "from-red-500/25 to-red-500/5 text-red-300",
    superOnly: true,
  },
];

function AdminDashboard() {
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
    enabled: !!me?.isSuperAdmin,
  });

  const isSuper = me?.isSuperAdmin ?? false;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
    window.location.href = "/shivi";
  };

  const filterModules = (arr: ModuleDef[]) =>
    arr.filter((m) => !m.superOnly || isSuper);

  const kpiCards = [
    isSuper && {
      label: "Contact Submissions",
      value: stats?.contactSubmissions,
      icon: Mail,
      accent: "bg-brand/10 text-brand",
    },
    isSuper && {
      label: "Career Applications",
      value: stats?.careerApplications,
      icon: Briefcase,
      accent: "bg-rose-500/10 text-rose-300",
    },
    {
      label: "Portfolio Projects",
      value: stats?.portfolioProjects,
      icon: FolderKanban,
      accent: "bg-amber-500/10 text-amber-300",
    },
    {
      label: "Blog Posts",
      value: stats?.blogPosts,
      icon: FileText,
      accent: "bg-violet-500/10 text-violet-300",
    },
  ].filter(Boolean) as {
    label: string;
    value: number | undefined;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
  }[];

  return (
    <div className="min-h-[80vh] bg-background">
      {/* Header */}
      <div className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <Settings className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                SAISPL Control Panel
              </p>
              <h1 className="text-lg font-semibold text-foreground">
                Welcome back, {me?.admin?.email?.split("@")[0] ?? "admin"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-border/60 bg-card px-3 py-1 text-xs text-muted-foreground sm:inline">
              {me?.admin?.role ?? "admin"}
            </span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* KPI stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </p>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.accent}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                  {statsLoading ? "…" : statsError ? "—" : (c.value ?? 0).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {statsError && (
          <p className="mt-4 text-sm text-red-500">
            Unable to load stats: {statsError instanceof Error ? statsError.message : "Unknown error"}
          </p>
        )}

        {/* Grouped modules */}
        <ModuleGroup title="Workspaces" modules={filterModules(WORKSPACE_MODULES)} />
        <ModuleGroup title="Content" modules={filterModules(CONTENT_MODULES)} />
        {isSuper && <ModuleGroup title="Operations" modules={filterModules(OPERATIONS_MODULES)} />}
        {isSuper && <ModuleGroup title="Administration" modules={filterModules(ADMIN_MODULES)} />}

        {/* Recent activity */}
        {isSuper && (
          <div className="mt-12 rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
                <p className="text-xs text-muted-foreground">
                  Latest contact submissions and career applications
                </p>
              </div>
            </div>
            {activityLoading ? (
              <p className="px-6 py-8 text-sm text-muted-foreground">Loading…</p>
            ) : activityError ? (
              <p className="px-6 py-8 text-sm text-red-500">
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
                      : "bg-rose-500/10 text-rose-300";
                  return (
                    <li key={`${item.type}-${item.id}`} className="flex items-center gap-4 px-6 py-4">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${badge}`}
                      >
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
                        View
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleGroup({ title, modules }: { title: string; modules: ModuleDef[] }) {
  if (modules.length === 0) return null;
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
        <div className="h-px flex-1 bg-border/60" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.to}
              to={m.to}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-lg"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity group-hover:opacity-100 ${m.accent}`}
                aria-hidden
              />
              <div className="relative flex items-start justify-between gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 backdrop-blur ${m.accent
                    .split(" ")
                    .filter((c) => c.startsWith("text-"))
                    .join(" ")}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              <div className="relative mt-4">
                <p className="text-base font-semibold text-foreground">{m.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
