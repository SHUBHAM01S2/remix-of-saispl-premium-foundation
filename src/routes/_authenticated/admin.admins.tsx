import { useState } from "react";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, ShieldCheck, Loader2, History } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  listAdmins,
  listAdminRoleAudit,
  updateAdminRole,
  deleteAdmin,
  addAdminByUserId,
  ADMIN_ROLES,
} from "@/lib/admins-admin.functions";


export const Route = createFileRoute("/_authenticated/admin/admins")({
  beforeLoad: async () => {
    const result = await checkIsAdmin();
    if (!result.isAdmin) throw notFound();
    if (!result.isSuperAdmin)
      throw redirect({ to: "/admin" });
    return { admin: result.admin };
  },
  component: AdminsPage,
  head: () => ({
    meta: [
      { title: "Admin Accounts — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminsPage() {
  const qc = useQueryClient();
  const meFn = useServerFn(checkIsAdmin);
  const listFn = useServerFn(listAdmins);
  const auditFn = useServerFn(listAdminRoleAudit);
  const updateFn = useServerFn(updateAdminRole);
  const delFn = useServerFn(deleteAdmin);
  const addFn = useServerFn(addAdminByUserId);

  const { data: me } = useQuery({ queryKey: ["admin", "me"], queryFn: () => meFn() });
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "admins"],
    queryFn: () => listFn(),
  });
  const auditQ = useQuery({
    queryKey: ["admin", "admin-role-audit"],
    queryFn: () => auditFn(),
  });

  const update = useMutation({
    mutationFn: (v: { id: string; role: string }) => updateFn({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "admins"] });
      qc.invalidateQueries({ queryKey: ["admin", "admin-role-audit"] });
    },
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "admins"] });
      qc.invalidateQueries({ queryKey: ["admin", "admin-role-audit"] });
    },
  });

  const [newUserId, setNewUserId] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<string>("editor");
  const [confirmClientOverride, setConfirmClientOverride] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const add = useMutation({
    mutationFn: () =>
      addFn({ data: { userId: newUserId, email: newEmail, role: newRole, confirmClientOverride } }),
    onSuccess: () => {
      setNewUserId("");
      setNewEmail("");
      setNewRole("editor");
      setConfirmClientOverride(false);
      setAddError(null);
      qc.invalidateQueries({ queryKey: ["admin", "admins"] });
      qc.invalidateQueries({ queryKey: ["admin", "admin-role-audit"] });
    },
    onError: (e) => setAddError(e instanceof Error ? e.message : "Failed"),
  });


  return (
    <div className="min-h-[80vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="mt-4 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-brand" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Accounts
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage admin users and their roles. Only super admins can access this page.
        </p>

        {/* Add form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setAddError(null);
            add.mutate();
          }}
          className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-foreground">Grant admin access</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            The person must already have signed up in the app; paste their Supabase
            Auth user ID and email to grant a role.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_180px_auto]">
            <input
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder="Auth user ID (UUID)"
              required
              className={inputCls}
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              required
              className={inputCls}
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className={inputCls}
            >
              {ADMIN_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={add.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60"
            >
              {add.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add
            </button>
          </div>
          <label className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={confirmClientOverride}
              onChange={(e) => setConfirmClientOverride(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              This email is registered as a client — I still want to promote them.
              Leave unchecked unless you are certain. Client accounts should never be admins.
            </span>
          </label>
          {addError && <p className="mt-2 text-sm text-red-600">{addError}</p>}
        </form>


        {/* List */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          {isLoading ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">Loading…</p>
          ) : error ? (
            <p className="px-6 py-8 text-sm text-red-600">
              {error instanceof Error ? error.message : "Failed to load"}
            </p>
          ) : !data || data.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted-foreground">No admin accounts yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.map((a) => {
                    const isSelf = me?.admin?.id === a.id;
                    return (
                      <tr key={a.id}>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {a.email}
                          {isSelf && (
                            <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                              you
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={a.role === "editor" ? "editor" : "super_admin"}
                            onChange={(e) =>
                              update.mutate({ id: a.id, role: e.target.value })
                            }
                            disabled={
                              (update.isPending && update.variables?.id === a.id) ||
                              isSelf
                            }
                            className="rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground disabled:opacity-60"
                          >
                            {ADMIN_ROLES.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(a.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                confirm(
                                  `Revoke admin access for ${a.email}? They will no longer be able to sign into the admin panel.`,
                                )
                              )
                                del.mutate(a.id);
                            }}
                            disabled={
                              isSelf ||
                              (del.isPending && del.variables === a.id)
                            }
                            className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-background px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
                            title={isSelf ? "You cannot delete yourself" : "Delete admin"}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit log */}
        <AuditSection />
      </div>
    </div>
  );
}

function AuditSection() {
  const auditFn = useServerFn(listAdminRoleAudit);
  const [q, setQ] = useState("");
  const [action, setAction] = useState<"all" | "grant" | "update" | "revoke">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Reset to page 1 whenever filters change
  const filterKey = `${q}|${action}|${from}|${to}`;
  const lastKey = useRef(filterKey);
  if (lastKey.current !== filterKey) {
    lastKey.current = filterKey;
    if (page !== 1) setPage(1);
  }

  const auditQ = useQuery({
    queryKey: ["admin", "admin-role-audit", { q, action, from, to, page, pageSize }],
    queryFn: () =>
      auditFn({
        data: {
          q: q || undefined,
          action,
          from: from ? new Date(from).toISOString() : undefined,
          to: to ? new Date(to + "T23:59:59").toISOString() : undefined,
          page,
          pageSize,
        },
      }),
    placeholderData: (prev) => prev,
  });

  const rows = auditQ.data?.rows ?? [];
  const total = auditQ.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center gap-2">
        <History className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Role change audit</h2>
      </div>
      <p className="text-xs text-muted-foreground">
        Every admin grant, role change, and revoke is logged with the acting super admin.
        Visible to super admins only.
      </p>

      <div className="mt-4 grid gap-3 rounded-2xl border border-border/60 bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search actor or target email…"
          className={inputCls + " lg:col-span-2"}
        />
        <select
          value={action}
          onChange={(e) => setAction(e.target.value as typeof action)}
          className={inputCls}
        >
          <option value="all">All actions</option>
          <option value="grant">Grant</option>
          <option value="update">Update</option>
          <option value="revoke">Revoke</option>
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className={inputCls}
          aria-label="From date"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={inputCls}
          aria-label="To date"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        {auditQ.isLoading ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">No changes match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">When</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Target</th>
                  <th className="px-4 py-3 text-left">Change</th>
                  <th className="px-4 py-3 text-left">Actor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={
                        row.action === "grant"  ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300"
                      : row.action === "revoke" ? "rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-300"
                                                : "rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-300"
                      }>
                        {row.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{row.target_email}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.from_role ?? "—"} → {row.to_role ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.actor_email ?? "system"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {total === 0 ? "0 results" : `Page ${page} of ${totalPages} · ${total} total`}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || auditQ.isFetching}
            className="rounded-md border border-border/60 px-3 py-1 hover:bg-muted/40 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || auditQ.isFetching}
            className="rounded-md border border-border/60 px-3 py-1 hover:bg-muted/40 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand";

