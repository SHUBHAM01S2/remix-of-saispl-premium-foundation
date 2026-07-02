import { createFileRoute, Link, notFound , redirect } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { JobForm } from "@/components/admin/JobForm";

export const Route = createFileRoute("/_authenticated/admin/jobs/new")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    if (!result.isSuperAdmin) throw redirect({ to: "/admin" });
    return { admin: result.admin };
  },
  component: NewJobPage,
  head: () => ({
    meta: [
      { title: "New Job Opening — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function NewJobPage() {
  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/admin/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Add New Job</h1>
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <JobForm />
        </div>
      </div>
    </div>
  );
}
