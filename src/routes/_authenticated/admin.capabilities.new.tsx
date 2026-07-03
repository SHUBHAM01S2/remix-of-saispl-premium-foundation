import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { CapabilityForm } from "@/components/admin/CapabilityForm";

export const Route = createFileRoute("/_authenticated/admin/capabilities/new")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin };
  },
  component: NewCapabilityPage,
  head: () => ({
    meta: [
      { title: "New Capability — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function NewCapabilityPage() {
  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/admin/capabilities" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to capabilities
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Add New Capability</h1>
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <CapabilityForm />
        </div>
      </div>
    </div>
  );
}
