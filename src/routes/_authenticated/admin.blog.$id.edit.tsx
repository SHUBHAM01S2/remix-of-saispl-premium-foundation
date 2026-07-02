import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { getBlogPost } from "@/lib/blog-admin.functions";
import { BlogForm } from "@/components/admin/BlogForm";

export const Route = createFileRoute("/_authenticated/admin/blog/$id/edit")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin };
  },
  component: EditBlogPage,
  head: () => ({
    meta: [
      { title: "Edit Blog Post — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function EditBlogPage() {
  const { id } = Route.useParams();
  const getFn = useServerFn(getBlogPost);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "blog", id],
    queryFn: () => getFn({ data: { id } }),
  });

  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/admin/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to posts
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Edit Post</h1>
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
            <p className="text-sm text-muted-foreground">Post not found.</p>
          ) : (
            <BlogForm existing={data} />
          )}
        </div>
      </div>
    </div>
  );
}
