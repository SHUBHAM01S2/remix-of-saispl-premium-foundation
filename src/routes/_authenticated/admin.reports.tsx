import { createFileRoute, Link, notFound , redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, ExternalLink, Trash2, Pencil } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  listReports,
  deleteReport,
  slugifyClient,
} from "@/lib/reports-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/reports")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    if (!result.isSuperAdmin) throw redirect({ to: "/admin" });
    return { admin: result.admin };
  },
  component: ReportsPage,
  head: () => ({
    meta: [
      { title: "Client Reports — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function ReportsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listReports);
  const delFn = useServerFn(deleteReport);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "reports"],
    queryFn: () => listFn(),
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reports"] }),
  });

  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Client Reports
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monthly performance reports per client.
            </p>
          </div>
          <Link
            to="/admin/reports/new"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add Monthly Report
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          {isLoading ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="px-6 py-8 text-sm text-red-600">
              {error instanceof Error ? error.message : "Failed to load"}
            </p>
          ) : !data || data.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">
              No reports yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Client</th>
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-left">Uptime</th>
                    <th className="px-4 py-3 text-left">Visitors</th>
                    <th className="px-4 py-3 text-left">Leads</th>
                    <th className="px-4 py-3 text-left">WhatsApp</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.map((r) => {
                    const slug = slugifyClient(r.client_name);
                    return (
                      <tr key={r.id}>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {r.client_name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(r.month).toLocaleDateString(undefined, {
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {Number(r.uptime_percentage).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {r.site_visitors.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {r.leads_from_forms}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {r.whatsapp_taps}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to="/client-reports/$clientSlug"
                              params={{ clientSlug: slug }}
                              target="_blank"
                              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground hover:bg-accent"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              View
                            </Link>
                            <Link
                              to="/admin/reports/$id/edit"
                              params={{ id: r.id }}
                              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground hover:bg-accent"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </Link>
                            <button
                              type="button"
                              disabled={
                                del.isPending && del.variables === r.id
                              }
                              onClick={() => {
                                if (
                                  confirm(
                                    `Delete report for ${r.client_name} (${new Date(r.month).toLocaleDateString(undefined, { month: "short", year: "numeric" })})?`,
                                  )
                                )
                                  del.mutate(r.id);
                              }}
                              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-background px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
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
