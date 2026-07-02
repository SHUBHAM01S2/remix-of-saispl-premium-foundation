import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import {
  checkIsAdmin,
} from "@/lib/admin.functions";
import {
  listPortfolioProjects,
  deletePortfolioProject,
} from "@/lib/portfolio-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/portfolio")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin, isSuperAdmin: result.isSuperAdmin };
  },
  component: PortfolioListPage,
  head: () => ({
    meta: [
      { title: "Portfolio Projects — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function PortfolioListPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listPortfolioProjects);
  const deleteFn = useServerFn(deletePortfolioProject);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "portfolio"],
    queryFn: () => listFn(),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "portfolio"] }),
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Portfolio Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage case studies shown on the public site.</p>
          </div>
          <Link
            to="/admin/portfolio/new"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add New Project
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
            <p className="px-6 py-8 text-sm text-muted-foreground">No projects yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Project</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Industry</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.thumbnail_url ? (
                            <img src={p.thumbnail_url} alt="" className="h-10 w-10 rounded object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded bg-muted" />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                              <span className="truncate">{p.title}</span>
                              {p.is_featured && (
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.client_industry}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to="/admin/portfolio/$id/edit"
                            params={{ id: p.id }}
                            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            disabled={del.isPending}
                            className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                          >
                            {del.isPending ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
