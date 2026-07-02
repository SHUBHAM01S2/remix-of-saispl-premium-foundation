import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  listTestimonials,
  deleteTestimonial,
} from "@/lib/testimonials-admin.functions";

export const Route = createFileRoute("/_authenticated/shivi/testimonials")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin, isSuperAdmin: result.isSuperAdmin };
  },
  component: TestimonialsListPage,
  head: () => ({
    meta: [
      { title: "Testimonials — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function TestimonialsListPage() {
  const qc = useQueryClient();
  const { isSuperAdmin } = Route.useRouteContext();
  const listFn = useServerFn(listTestimonials);
  const deleteFn = useServerFn(deleteTestimonial);


  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: () => listFn(),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "testimonials"] }),
  });

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"? This cannot be undone.`)) return;
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Testimonials</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage client quotes shown on the public site.</p>
          </div>
          <Link
            to="/admin/testimonials/new"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add New Testimonial
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
            <p className="px-6 py-8 text-sm text-muted-foreground">No testimonials yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Client</th>
                    <th className="px-4 py-3 text-left">Company</th>
                    <th className="px-4 py-3 text-left">Country</th>
                    <th className="px-4 py-3 text-left">Rating</th>
                    <th className="px-4 py-3 text-left">Quote</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <span>{t.client_name}</span>
                          {t.is_featured && (
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{t.company ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.country ?? "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              className={
                                n <= t.rating
                                  ? "h-3.5 w-3.5 fill-amber-500 text-amber-500"
                                  : "h-3.5 w-3.5 text-muted-foreground/40"
                              }
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-muted-foreground">{t.quote}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to="/admin/testimonials/$id/edit"
                            params={{ id: t.id }}
                            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Link>
                          {isSuperAdmin && (
                            <button
                              onClick={() => handleDelete(t.id, t.client_name)}
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
                          )}
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
