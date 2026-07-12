import {
  createFileRoute,
  Link,
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
  LayoutDashboard,
  ArrowUpRight,
  Activity,
  Command,
  Bell,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { checkIsAdmin, getDashboardStats, getRecentActivity } from "@/lib/admin.functions";
import { getAdminInboxSummary, type AdminInboxNotification } from "@/lib/messages.functions";
import { supabase } from "@/integrations/supabase/client";
import { WrongRoleNotice } from "@/components/WrongRoleNotice";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    return {
      admin: result.admin,
      isAdminRole: result.isAdmin,
      currentUserEmail: result.email,
    };
  },
  component: AdminShell,
  head: () => ({
    meta: [
      { title: "Admin Panel — SAISPL" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  superOnly?: boolean;
};

type NavGroup = { title: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Workspaces",
    items: [
      { label: "Client Onboarding", to: "/admin/onboarding", icon: Handshake, desc: "Intake, assets, access & kickoff readiness" },
      { label: "Client Inbox", to: "/admin/inbox", icon: MessageSquare, desc: "Shared client conversations" },
      { label: "Client Reports", to: "/admin/reports", icon: BarChart3, desc: "Deliver monthly performance reports", superOnly: true },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Portfolio", to: "/admin/portfolio", icon: FolderKanban, desc: "Case studies & featured work" },
      { label: "Blog", to: "/admin/blog", icon: FileText, desc: "Articles & thought leadership" },
      { label: "Testimonials", to: "/admin/testimonials", icon: MessageSquare, desc: "Client quotes & proof" },
      { label: "Capabilities", to: "/admin/capabilities", icon: Layers, desc: "Services & offering pages" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Contact Submissions", to: "/admin/contacts", icon: Mail, desc: "Inbound enquiries", superOnly: true },
      { label: "Affiliate Enquiries", to: "/admin/affiliate-enquiries", icon: BadgeCheck, desc: "Partner applications", superOnly: true },
      { label: "Affiliate Program", to: "/admin/affiliates", icon: Handshake, desc: "Sales partners & referrals" },
      { label: "Career Applications", to: "/admin/careers", icon: Briefcase, desc: "Candidate applications", superOnly: true },
      { label: "Job Openings", to: "/admin/jobs", icon: Sparkles, desc: "Manage roles listed on /career", superOnly: true },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Manage Admins", to: "/admin/admins", icon: ShieldCheck, desc: "Roles & access control", superOnly: true },
    ],
  },
];

const BREADCRUMBS: Record<string, string> = {
  "/admin": "Overview",
  "/admin/onboarding": "Client Onboarding",
  "/admin/inbox": "Client Inbox",
  "/admin/reports": "Client Reports",
  "/admin/portfolio": "Portfolio",
  "/admin/blog": "Blog",
  "/admin/testimonials": "Testimonials",
  "/admin/capabilities": "Capabilities",
  "/admin/contacts": "Contact Submissions",
  "/admin/affiliate-enquiries": "Affiliate Enquiries",
  "/admin/affiliates": "Affiliate Program",
  "/admin/careers": "Career Applications",
  "/admin/jobs": "Job Openings",
  "/admin/admins": "Manage Admins",
};

function AdminShell() {
  const location = useLocation();
  const router = useRouter();
  const { isAdminRole, currentUserEmail } = Route.useRouteContext();

  const meFn = useServerFn(checkIsAdmin);
  const inboxSummaryFn = useServerFn(getAdminInboxSummary);

  const { data: me } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => meFn(),
    enabled: isAdminRole,
  });
  const inboxSummaryQ = useQuery({
    queryKey: ["admin", "inbox-summary"],
    queryFn: () => inboxSummaryFn(),
    refetchInterval: 8000,
    refetchOnWindowFocus: true,
    enabled: isAdminRole,
  });

  const inboxUnread = inboxSummaryQ.data?.total_unread ?? 0;
  const inboxRecent = inboxSummaryQ.data?.recent ?? [];
  const lastTopIdRef = useRef<string | null>(null);
  const bootedRef = useRef(false);
  useEffect(() => {
    const s = inboxSummaryQ.data;
    if (!s) return;
    const topId = s.recent[0] ? `${s.recent[0].onboarding_id}:${s.recent[0].created_at}` : null;
    if (!bootedRef.current) {
      bootedRef.current = true;
      lastTopIdRef.current = topId;
      return;
    }
    if (topId && topId !== lastTopIdRef.current) {
      const first = s.recent[0];
      if (first) {
        toast.message(`New message from ${first.company_name}`, {
          description: first.body ? first.body.slice(0, 140) : first.has_attachments ? "Sent an attachment" : "New reply in the inbox",
          action: {
            label: "Open inbox",
            onClick: () => { window.location.href = `/admin/inbox?thread=${first.onboarding_id}`; },
          },
        });
      }
      lastTopIdRef.current = topId;
    }
  }, [inboxSummaryQ.data]);

  const isSuper = me?.isSuperAdmin ?? false;
  const groups = NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.superOnly || isSuper),
  })).filter((g) => g.items.length > 0);

  const [mobileNav, setMobileNav] = useState(false);
  useEffect(() => { setMobileNav(false); }, [location.pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
    window.location.href = "/shivi";
  };

  if (!isAdminRole) {
    return <WrongRoleNotice mode="client-on-admin" email={currentUserEmail} />;
  }

  const path = location.pathname.replace(/\/$/, "") || "/admin";
  const isOverview = path === "/admin";
  const crumbKey = Object.keys(BREADCRUMBS).find((k) => path === k || path.startsWith(k + "/")) ?? "/admin";
  const crumb = BREADCRUMBS[crumbKey] ?? "Admin";

  const displayName = me?.admin?.email?.split("@")[0] ?? "admin";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-border/60 bg-card/60 backdrop-blur lg:flex">
        <AdminSidebarInner
          groups={groups}
          me={me}
          initials={initials}
          inboxUnread={inboxUnread}
          onSignOut={handleSignOut}
          onNav={() => {}}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileNav(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85%] flex-col border-r border-border/60 bg-card shadow-2xl">
            <AdminSidebarInner
              groups={groups}
              me={me}
              initials={initials}
              inboxUnread={inboxUnread}
              onSignOut={handleSignOut}
              onNav={() => setMobileNav(false)}
              onClose={() => setMobileNav(false)}
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
          <div className="mx-auto flex h-[60px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileNav(true)}
              className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground">
              <span>Admin</span>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="truncate text-foreground">{crumb}</span>
            </div>
            <button className="hidden items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground md:inline-flex">
              <Command className="h-3.5 w-3.5" /> Quick search
              <kbd className="ml-2 rounded border border-border/60 bg-background px-1.5 text-[10px]">⌘K</kbd>
            </button>
            <AdminBell unread={inboxUnread} recent={inboxRecent} />
            <button
              onClick={handleSignOut}
              className="hidden items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors hover:bg-surface sm:inline-flex lg:hidden"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {isOverview ? <AdminDashboardContent me={me} isSuper={isSuper} groups={groups} displayName={displayName} inboxUnread={inboxUnread} /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}

function AdminSidebarInner({
  groups, me, initials, inboxUnread, onSignOut, onNav, onClose,
}: {
  groups: NavGroup[];
  me: any;
  initials: string;
  inboxUnread: number;
  onSignOut: () => void;
  onNav: () => void;
  onClose?: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand/60 text-brand-foreground shadow-lg shadow-brand/20">
            <LayoutDashboard className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">SAISPL</p>
            <p className="truncate text-sm font-semibold">Control Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground lg:hidden" aria-label="Close menu">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarLink to="/admin" label="Overview" icon={LayoutDashboard} onNav={onNav} exact />
        {groups.map((g) => (
          <div key={g.title} className="mt-5">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">{g.title}</p>
            <div className="space-y-0.5">
              {g.items.map((it) => (
                <SidebarLink
                  key={it.to}
                  to={it.to}
                  label={it.label}
                  icon={it.icon}
                  onNav={onNav}
                  badge={it.to === "/admin/inbox" && inboxUnread > 0 ? inboxUnread : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/60 p-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-xs font-semibold text-brand">{initials}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{me?.admin?.email ?? me?.email ?? ""}</p>
            <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">{me?.admin?.role ?? "admin"}</p>
          </div>
          <button onClick={onSignOut} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground" aria-label="Sign out" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

function SidebarLink({
  to, label, icon: Icon, badge, onNav, exact,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  onNav?: () => void;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onNav}
      activeOptions={{ exact: !!exact }}
      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
      activeProps={{ className: "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-brand/10 text-brand" }}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1 truncate">{label}</span>
      {badge && badge > 0 ? (
        <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold leading-none text-brand-foreground">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

/* ============================ Dashboard content ============================ */

function AdminDashboardContent({
  me, isSuper, groups, displayName, inboxUnread: _inboxUnread,
}: {
  me: any;
  isSuper: boolean;
  groups: NavGroup[];
  displayName: string;
  inboxUnread: number;
}) {
  const statsFn = useServerFn(getDashboardStats);
  const activityFn = useServerFn(getRecentActivity);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () => statsFn(),
  });
  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["admin", "recent-activity"],
    queryFn: () => activityFn(),
    enabled: !!me?.isSuperAdmin,
  });

  const kpis = [
    isSuper && { label: "Contacts", hint: "Total inbound", value: stats?.contactSubmissions, icon: Mail, tint: "text-brand", ring: "ring-brand/30", glow: "from-brand/25" },
    isSuper && { label: "Careers", hint: "Applications received", value: stats?.careerApplications, icon: Briefcase, tint: "text-rose-300", ring: "ring-rose-500/30", glow: "from-rose-500/20" },
    { label: "Portfolio", hint: "Published projects", value: stats?.portfolioProjects, icon: FolderKanban, tint: "text-amber-300", ring: "ring-amber-500/30", glow: "from-amber-500/20" },
    { label: "Blog", hint: "Articles authored", value: stats?.blogPosts, icon: FileText, tint: "text-violet-300", ring: "ring-violet-500/30", glow: "from-violet-500/20" },
  ].filter(Boolean) as {
    label: string; hint: string; value: number | undefined;
    icon: React.ComponentType<{ className?: string }>;
    tint: string; ring: string; glow: string;
  }[];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-background p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {displayName}</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">Here's what's happening across your studio today — clients, content and inbound in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/onboarding" className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 hover:shadow-brand/30">
              <Handshake className="h-4 w-4" /> New Client Onboarding
            </Link>
            {isSuper && (
              <Link to="/admin/reports" className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-4 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-surface">
                <BarChart3 className="h-4 w-4" /> Client Reports
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="mt-8">
        <SectionHeader eyebrow="At a glance" title="Studio metrics" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border">
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${k.glow} to-transparent opacity-60`} aria-hidden />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{k.label}</p>
                    <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight">
                      {statsLoading ? <span className="inline-block h-8 w-14 animate-pulse rounded bg-surface" /> : (k.value ?? 0).toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
                  </div>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-background/60 ring-1 ${k.ring} ${k.tint}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modules + Activity split */}
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {groups.map((g) => (
            <section key={g.title}>
              <SectionHeader eyebrow={g.title} title={groupTitleFor(g.title)} />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {g.items.map((it) => <ModuleCard key={it.to} item={it} />)}
              </div>
            </section>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <SectionHeader eyebrow="Live" title="Recent activity" />
          <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card">
            <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/70" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <p className="text-xs font-medium text-muted-foreground">Live inbound feed</p>
            </div>
            {!isSuper ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">Activity is super-admin only</p>
                <p className="text-xs text-muted-foreground">Ask a super admin for access to see live inbound.</p>
              </div>
            ) : activityLoading ? (
              <div className="space-y-3 p-5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-surface" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-surface" />
                      <div className="h-2.5 w-1/2 animate-pulse rounded bg-surface" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !activity || activity.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">Nothing new yet.</p>
            ) : (
              <ul className="divide-y divide-border/60">
                {activity.map((item) => {
                  const Icon = item.type === "contact" ? Mail : Briefcase;
                  const badge = item.type === "contact" ? "bg-brand/15 text-brand ring-brand/30" : "bg-rose-500/15 text-rose-300 ring-rose-500/30";
                  return (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        to={item.type === "contact" ? "/admin/contact/$id" : "/admin/career/$id"}
                        params={{ id: item.id }}
                        className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-surface/40"
                      >
                        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${badge}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-medium">{item.name}</p>
                            <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">{timeAgo(item.createdAt)}</span>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>

      <p className="mt-10 pb-6 text-center text-xs text-muted-foreground">SAISPL Control Panel · v1.0</p>
    </>
  );
}

function AdminBell({ unread, recent }: { unread: number; recent: AdminInboxNotification[] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("[data-admin-bell]")) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return (
    <div className="relative" data-admin-bell>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        aria-label={unread > 0 ? `${unread} unread client messages` : "Notifications"}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <>
            <span className="absolute -right-1 -top-1 inline-flex min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-brand-foreground shadow-[0_0_0_2px_var(--background)]">
              {unread > 9 ? "9+" : unread}
            </span>
            <span className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-brand/50" />
          </>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-40 w-[340px] overflow-hidden rounded-xl border border-border/60 bg-card/95 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <p className="text-sm font-semibold">Client inbox</p>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{unread > 0 ? `${unread} unread` : "All caught up"}</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">No unread client messages.</p>
            ) : (
              <ul className="divide-y divide-border/60">
                {recent.map((m) => (
                  <li key={`${m.onboarding_id}-${m.created_at}`}>
                    <Link
                      to="/admin/inbox"
                      search={{ thread: m.onboarding_id } as any}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface/60"
                    >
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-semibold">{m.company_name}</p>
                          <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(m.created_at)}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {m.sender_name ? `${m.sender_name}: ` : ""}
                          {m.body || (m.has_attachments ? "Sent an attachment" : "New reply")}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link
            to="/admin/inbox"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 border-t border-border/60 bg-background/40 px-4 py-2.5 text-xs font-medium text-brand hover:bg-brand/10"
          >
            Open shared inbox <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}

function ModuleCard({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-surface to-background text-foreground ring-1 ring-border/60 transition-colors group-hover:from-brand/15 group-hover:text-brand group-hover:ring-brand/40">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">{item.label}</p>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
      </div>
    </Link>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
      </div>
    </div>
  );
}

function groupTitleFor(t: string): string {
  switch (t) {
    case "Workspaces": return "Client workspaces";
    case "Content": return "Content studio";
    case "Operations": return "Operations & inbound";
    case "Administration": return "Administration";
    default: return t;
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  return new Date(iso).toLocaleDateString();
}
