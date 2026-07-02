import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export const Route = createFileRoute("/_authenticated/shivi/portfolio/new")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin };
  },
  component: NewPortfolioPage,
  head: () => ({
    meta: [
      { title: "New Portfolio Project — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function NewPortfolioPage() {
  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/shivi/portfolio" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Add New Project</h1>
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <PortfolioForm />
        </div>
      </div>
    </div>
  );
}
