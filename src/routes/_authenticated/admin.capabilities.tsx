import { createFileRoute, Link, notFound, Outlet, useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Power, PowerOff } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  deleteCapability,
  listCapabilities,
  toggleCapabilityActive,
} from "@/lib/capabilities-admin.functions";
import { iconForCapability } from "@/lib/capability-icons";

export const Route = createFileRoute("/_authenticated/admin/capabilities")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin };
  },
  component: CapabilitiesRoute,
  head: () => ({
    meta: [
      { title: "Capabilities — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function CapabilitiesRoute() {
  const location = useLocation();
  if (location.pathname.replace(/\/$/, "") !== "/admin/capabilities") return <Outlet />;
  return <CapabilitiesListPage />;
}

function CapabilitiesListPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listCapabilities);
  const deleteFn = useServerFn(deleteCapability);
  const toggleFn = useServerFn(toggleCapabilityActive);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "capabilities"],
    queryFn: () => listFn(),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "capabilities"] }),
  });

  const toggle = useMutation({
    mutationFn: (v: { id: string; active: boolean }) => toggleFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "capabilities"] }),
  });

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    del.mutate(id);
  };

  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Capabilities</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Cards shown in the "What we do" section on the homepage.
            </p>
          </div>
          <Link
            to="/admin/capabilities/new"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add New Capability
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          {isLoading ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="px-6 py-8 text-sm text-red-600">
              {error instanceof Error ? error.message : "Failed to load"}
            </p>
          ) : !data || data.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">No capabilities yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Icon</th>
                    <th className="px-4 py-3 text-left">Tag</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Meta</th>
                    <th className="px-4 py-3 text-left">Order</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.map((c) => {
                    const Icon = iconForCapability(c.icon);
                    return (
                      <tr key={c.id}>
                        <td className="px-4 py-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input bg-background">
                            <Icon className="h-4 w-4 text-foreground" />
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{c.tag}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{c.title}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.meta || "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.sort_order}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              c.is_active
                                ? "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                : "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                            }
                          >
                            {c.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => toggle.mutate({ id: c.id, active: !c.is_active })}
                              disabled={toggle.isPending}
                              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-60"
                            >
                              {c.is_active ? (
                                <><PowerOff className="h-3.5 w-3.5" /> Deactivate</>
                              ) : (
                                <><Power className="h-3.5 w-3.5" /> Activate</>
                              )}
                            </button>
                            <Link
                              to="/admin/capabilities/$id/edit"
                              params={{ id: c.id }}
                              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(c.id, c.title)}
                              disabled={del.isPending}
                              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                            >
                              {del.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
