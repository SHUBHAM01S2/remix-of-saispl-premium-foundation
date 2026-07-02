import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Loader2,
  Download,
} from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  listCareerApplications,
  updateCareerStatus,
  getResumeDownloadUrl,
  CAREER_STATUSES,
  type CareerStatus,
  type CareerApplication,
} from "@/lib/careers-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/careers")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    return { admin: result.admin };
  },
  component: CareersPage,
  head: () => ({
    meta: [
      { title: "Career Applications — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type SortKey = "name" | "email" | "position_applied" | "status" | "created_at";
type SortDir = "asc" | "desc";

const STATUS_STYLES: Record<CareerStatus, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  reviewed: "bg-amber-100 text-amber-700 border-amber-200",
  interviewed: "bg-violet-100 text-violet-700 border-violet-200",
  hired: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
};

function CareersPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listCareerApplications);
  const updateFn = useServerFn(updateCareerStatus);
  const signFn = useServerFn(getResumeDownloadUrl);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CareerStatus | "">("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "careers"],
    queryFn: () => listFn(),
  });

  const update = useMutation({
    mutationFn: (v: { id: string; status: CareerStatus }) => updateFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "careers"] }),
  });

  const rows = useMemo(() => {
    if (!data) return [] as CareerApplication[];
    const q = search.trim().toLowerCase();
    let filtered = data.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.position_applied.toLowerCase().includes(q) ||
        (r.phone ?? "").toLowerCase().includes(q)
      );
    });
    filtered = [...filtered].sort((a, b) => {
      const av = (a[sortKey] ?? "") as string;
      const bv = (b[sortKey] ?? "") as string;
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
    if (sortKey !== k)
      return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-50" />;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 inline h-3 w-3" />
    );
  };

  const handleDownload = async (row: CareerApplication) => {
    if (!row.resume_url) return;
    try {
      setDownloadingId(row.id);
      const { url } = await signFn({ data: { path: row.resume_url } });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to get resume URL");
    } finally {
      setDownloadingId(null);
    }
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Career Applications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review applications, download resumes, and update their status.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, position…"
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CareerStatus | "")}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          >
            <option value="">All statuses</option>
            {CAREER_STATUSES.map((s) => (
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
            <p className="px-6 py-8 text-sm text-muted-foreground">
              No applications match.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <Th onClick={() => toggleSort("name")}>
                      Name <SortIcon k="name" />
                    </Th>
                    <Th onClick={() => toggleSort("position_applied")}>
                      Position Applied <SortIcon k="position_applied" />
                    </Th>
                    <Th onClick={() => toggleSort("email")}>
                      Email <SortIcon k="email" />
                    </Th>
                    <th className="px-4 py-3 text-left">Resume</th>
                    <Th onClick={() => toggleSort("created_at")}>
                      Date <SortIcon k="created_at" />
                    </Th>
                    <Th onClick={() => toggleSort("status")}>
                      Status <SortIcon k="status" />
                    </Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {rows.map((r) => (
                    <tr key={r.id} className="align-top">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <Link
                          to="/admin/career/$id"
                          params={{ id: r.id }}
                          className="hover:underline"
                        >
                          {r.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {r.position_applied}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <a
                          href={`mailto:${r.email}`}
                          className="hover:underline"
                        >
                          {r.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        {r.resume_url ? (
                          <button
                            type="button"
                            onClick={() => handleDownload(r)}
                            disabled={downloadingId === r.id}
                            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
                          >
                            {downloadingId === r.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="h-3.5 w-3.5" />
                            )}
                            Download
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
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
                                status: e.target.value as CareerStatus,
                              })
                            }
                            disabled={
                              update.isPending &&
                              update.variables?.id === r.id
                            }
                            className={`rounded-md border px-2 py-1 text-xs font-medium outline-none focus:ring-1 focus:ring-brand ${STATUS_STYLES[r.status]}`}
                          >
                            {CAREER_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          {update.isPending &&
                            update.variables?.id === r.id && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                            )}
                        </div>
                      </td>
                    </tr>
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
