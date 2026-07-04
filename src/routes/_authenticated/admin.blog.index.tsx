import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";

import { checkIsAdmin } from "@/lib/admin.functions";
import {
  listBlogPosts,
  deleteBlogPost,
  toggleBlogPublish,
} from "@/lib/blog-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/blog/")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin, isSuperAdmin: result.isSuperAdmin };
  },
  component: BlogListPage,
  head: () => ({
    meta: [
      { title: "Blog Posts — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function BlogListPage() {
  const qc = useQueryClient();
  const { isSuperAdmin } = Route.useRouteContext();
  const listFn = useServerFn(listBlogPosts);
  const deleteFn = useServerFn(deleteBlogPost);
  const toggleFn = useServerFn(toggleBlogPublish);


  const [status, setStatus] = useState<"all" | "published" | "draft">("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: () => listFn(),
  });

  const counts = {
    all: data?.length ?? 0,
    published: data?.filter((p) => !!p.published_at).length ?? 0,
    draft: data?.filter((p) => !p.published_at).length ?? 0,
  };

  const filtered =
    data?.filter((p) => {
      if (status === "all") return true;
      if (status === "published") return !!p.published_at;
      return !p.published_at;
    }) ?? [];


  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "blog"] }),
  });

  const toggle = useMutation({
    mutationFn: (v: { id: string; publish: boolean }) => toggleFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "blog"] }),
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog Posts</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage articles published on the public site.</p>
          </div>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add New Post
          </Link>
        </div>

        <div className="mt-6 inline-flex rounded-lg border border-border/60 bg-muted/40 p-1 text-sm">
          {(
            [
              { key: "all", label: "All" },
              { key: "published", label: "Published" },
              { key: "draft", label: "Drafts" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setStatus(t.key)}
              className={
                "rounded-md px-3 py-1.5 font-medium transition-colors " +
                (status === t.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {t.label}
              <span className="ml-1.5 text-xs text-muted-foreground">({counts[t.key]})</span>
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          {isLoading ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="px-6 py-8 text-sm text-red-600">
              {error instanceof Error ? error.message : "Failed to load"}
            </p>
          ) : filtered.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">
              {status === "all" ? "No posts yet." : `No ${status === "published" ? "published posts" : "drafts"} yet.`}
            </p>

          ) : (
            <div className="overflow-hidden">
              <table className="w-full table-fixed text-sm">

                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="w-[40%] px-4 py-3 text-left">Post</th>
                    <th className="w-[14%] px-4 py-3 text-left">Category</th>
                    <th className="w-[10%] px-4 py-3 text-left">Status</th>
                    <th className="w-[12%] px-4 py-3 text-left">Created</th>
                    <th className="w-[24%] px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60">
                  {filtered.map((p) => {
                    const isPublished = !!p.published_at;
                    return (
                      <tr key={p.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.cover_image_url ? (
                              <img src={p.cover_image_url} alt="" className="h-10 w-14 rounded object-cover" />
                            ) : (
                              <div className="h-10 w-14 rounded bg-muted" />
                            )}
                            <div className="min-w-0">
                              <div className="truncate font-medium text-foreground">{p.title}</div>
                              <div className="truncate text-xs text-muted-foreground">/{p.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.category ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              isPublished
                                ? "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                : "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                            }
                          >
                            {isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => toggle.mutate({ id: p.id, publish: !isPublished })}
                              disabled={toggle.isPending}
                              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-60"
                            >
                              {isPublished ? (
                                <>
                                  <EyeOff className="h-3.5 w-3.5" /> Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3.5 w-3.5" /> Publish
                                </>
                              )}
                            </button>
                            <Link
                              to="/admin/blog/$id/edit"
                              params={{ id: p.id }}
                              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </Link>
                            {isSuperAdmin && (
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
                            )}
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
