import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { ReportForm } from "@/components/admin/ReportForm";

export const Route = createFileRoute("/_authenticated/admin/reports/new")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin };
  },
  component: NewReportPage,
  head: () => ({
    meta: [
      { title: "New Client Report — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function NewReportPage() {
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
          Add Monthly Report
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new monthly performance report for a client.
        </p>
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <ReportForm />
        </div>
      </div>
    </div>
  );
}
