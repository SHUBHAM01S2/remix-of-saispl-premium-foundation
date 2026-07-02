import { createFileRoute, Link, notFound , redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { checkIsAdmin, getSubmissionDetail } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/shivi/contact/$id")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    if (!result.isSuperAdmin) throw redirect({ to: "/shivi" });
    return { admin: result.admin };
  },
  component: ContactDetailPage,
  head: () => ({
    meta: [
      { title: "Contact Submission — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function ContactDetailPage() {
  const { id } = Route.useParams();
  const fn = useServerFn(getSubmissionDetail);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "contact", id],
    queryFn: () => fn({ data: { type: "contact", id } }),
  });

  const row = data?.row;

  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/shivi"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          Contact Submission
        </h1>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="text-sm text-red-600">
              {error instanceof Error ? error.message : "Failed to load"}
            </p>
          ) : !row ? (
            <p className="text-sm text-muted-foreground">Not found.</p>
          ) : (
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={row.name} />
              <Field label="Email" value={row.email ?? "—"} />
              <Field label="Phone" value={row.phone ?? "—"} />
              <Field label="Company" value={row.company ?? "—"} />
              <Field label="Received" value={new Date(row.created_at).toLocaleString()} />
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Message
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                  {row.message}
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
