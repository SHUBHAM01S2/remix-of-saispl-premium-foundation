import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { getTestimonial } from "@/lib/testimonials-admin.functions";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const Route = createFileRoute("/_authenticated/admin/testimonials/$id/edit")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin };
  },
  component: EditTestimonialPage,
  head: () => ({
    meta: [
      { title: "Edit Testimonial — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function EditTestimonialPage() {
  const { id } = Route.useParams();
  const getFn = useServerFn(getTestimonial);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "testimonials", id],
    queryFn: () => getFn({ data: { id } }),
  });

  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/admin/testimonials" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to testimonials
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Edit Testimonial</h1>
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">
              {error instanceof Error ? error.message : "Failed to load"}
            </p>
          ) : !data ? (
            <p className="text-sm text-muted-foreground">Testimonial not found.</p>
          ) : (
            <TestimonialForm existing={data} />
          )}
        </div>
      </div>
    </div>
  );
}
