import { createFileRoute, Link, notFound , redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { ReportForm } from "@/components/admin/ReportForm";
import { getReport } from "@/lib/reports-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/reports/$id/edit")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    if (!result.isSuperAdmin) throw redirect({ to: "/admin" });
    return { admin: result.admin };
  },
  component: EditReportPage,
  head: () => ({
    meta: [
      { title: "Edit Client Report — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function EditReportPage() {
  const { id } = Route.useParams();
  const fn = useServerFn(getReport);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "reports", id],
    queryFn: () => fn({ data: { id } }),
  });

  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/admin/reports"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to reports
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          Edit Monthly Report
        </h1>
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="text-sm text-red-600">
              {error instanceof Error ? error.message : "Failed to load"}
            </p>
          ) : !data ? (
            <p className="text-sm text-muted-foreground">Not found.</p>
          ) : (
            <ReportForm existing={data} />
          )}
        </div>
      </div>
    </div>
  );
}
