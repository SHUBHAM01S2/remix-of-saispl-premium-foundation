import { Fragment, useMemo, useState } from "react";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  Loader2,
  Search,
} from "lucide-react";

import { checkIsAdmin } from "@/lib/admin.functions";
import {
  AFFILIATE_ENQUIRY_STATUSES,
  listAffiliateEnquiries,
  updateAffiliateEnquiryStatus,
  type AffiliateEnquiry,
  type AffiliateEnquiryStatus,
} from "@/lib/affiliate-enquiries.functions";

export const Route = createFileRoute("/_authenticated/admin/affiliate-enquiries")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    if (!result.isSuperAdmin) throw redirect({ to: "/admin" });
    return { admin: result.admin };
  },
  component: AffiliateEnquiriesPage,
  head: () => ({
    meta: [
      { title: "Affiliate Enquiries — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type SortKey = "full_name" | "email" | "company" | "status" | "created_at";
type SortDir = "asc" | "desc";

const STATUS_STYLES: Record<AffiliateEnquiryStatus, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-amber-100 text-amber-700 border-amber-200",
  in_progress: "bg-violet-100 text-violet-700 border-violet-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
  closed: "bg-zinc-200 text-zinc-700 border-zinc-300",
};

function AffiliateEnquiriesPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAffiliateEnquiries);
  const updateFn = useServerFn(updateAffiliateEnquiryStatus);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AffiliateEnquiryStatus | "">("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "affiliate-enquiries"],
    queryFn: () => listFn(),
  });

  const update = useMutation({
    mutationFn: (v: { id: string; status: AffiliateEnquiryStatus }) => updateFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "affiliate-enquiries"] }),
  });

  const rows = useMemo(() => {
    if (!data) return [] as AffiliateEnquiry[];
    const q = search.trim().toLowerCase();
    let filtered = data.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.company ?? "").toLowerCase().includes(q) ||
        (r.location ?? "").toLowerCase().includes(q) ||
        (r.website ?? "").toLowerCase().includes(q) ||
        (r.audience_type ?? "").toLowerCase().includes(q) ||
        r.message.toLowerCase().includes(q)
      );
    });
    filtered = [...filtered].sort((a, b) => {
      const av = ((a[sortKey] ?? "") as string).toString();
      const bv = ((b[sortKey] ?? "") as string).toString();
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return filtered;
  }, [data, search, statusFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "created_at" ? "desc" : "asc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-50" />;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 inline h-3 w-3" />
    );
  };

  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Affiliate Enquiries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review applications from the affiliate program, update status, and drill into each
            enquiry.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company, message…"
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AffiliateEnquiryStatus | "")}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          >
            <option value="">All statuses</option>
            {AFFILIATE_ENQUIRY_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            {rows.length} {rows.length === 1 ? "result" : "results"}
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          {isLoading ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="px-6 py-8 text-sm text-red-600">
              {error instanceof Error ? error.message : "Failed to load"}
            </p>
          ) : rows.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">No affiliate enquiries yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <Th onClick={() => toggleSort("full_name")}>
                      Name <SortIcon k="full_name" />
                    </Th>
                    <Th onClick={() => toggleSort("email")}>
                      Email <SortIcon k="email" />
                    </Th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <Th onClick={() => toggleSort("company")}>
                      Company <SortIcon k="company" />
                    </Th>
                    <th className="px-4 py-3 text-left">Audience</th>
                    <th className="px-4 py-3 text-left">Referrals / mo</th>
                    <Th onClick={() => toggleSort("created_at")}>
                      Date <SortIcon k="created_at" />
                    </Th>
                    <Th onClick={() => toggleSort("status")}>
                      Status <SortIcon k="status" />
                    </Th>
                    <th className="px-4 py-3 text-left">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {rows.map((r) => (
                    <Fragment key={r.id}>
                      <tr key={r.id} className="align-top">
                        <td className="px-4 py-3 font-medium text-foreground">{r.full_name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <a href={`mailto:${r.email}`} className="hover:underline">
                            {r.email}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {r.phone}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{r.company ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {r.audience_type ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {r.expected_referrals ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="inline-flex items-center gap-2">
                            <select
                              value={r.status}
                              onChange={(e) =>
                                update.mutate({
                                  id: r.id,
                                  status: e.target.value as AffiliateEnquiryStatus,
                                })
                              }
                              disabled={
                                update.isPending && update.variables?.id === r.id
                              }
                              className={`rounded-md border px-2 py-1 text-xs font-medium outline-none focus:ring-1 focus:ring-brand ${STATUS_STYLES[r.status]}`}
                            >
                              {AFFILIATE_ENQUIRY_STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                            {update.isPending && update.variables?.id === r.id && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                          >
                            {expanded === r.id ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>
                      {expanded === r.id && (
                        <tr key={`${r.id}-details`} className="bg-muted/20">
                          <td colSpan={9} className="px-4 py-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              <Detail label="Location" value={r.location} />
                              <Detail
                                label="Website / social"
                                value={
                                  r.website ? (
                                    <a
                                      href={
                                        r.website.startsWith("http")
                                          ? r.website
                                          : `https://${r.website}`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-brand hover:underline"
                                    >
                                      {r.website}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : null
                                }
                              />
                              <Detail label="Heard about us via" value={r.hear_about} />
                              <Detail
                                label="Referral experience"
                                value={r.experience}
                                wide
                              />
                              <Detail label="Message" value={r.message} wide />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Th({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className="cursor-pointer select-none px-4 py-3 text-left hover:text-foreground"
    >
      {children}
    </th>
  );
}

function Detail({
  label,
  value,
  wide,
}: {
  label: string;
  value: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2 lg:col-span-3" : ""}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 whitespace-pre-wrap text-sm text-foreground">
        {value ? value : <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}
