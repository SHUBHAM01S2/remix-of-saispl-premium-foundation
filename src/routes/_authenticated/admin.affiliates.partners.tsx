import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check, Copy, Eye, EyeOff, Plus, RefreshCw, Search, X, Users, UserCheck, UserX,
  Trophy, Wallet, ArrowUpDown, Mail, Phone, UserPlus, MoreHorizontal, Download,
  Power, PowerOff, Send, PencilLine, ArrowUpRight, Filter, AlertCircle,
} from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { adminListPartners, adminCreatePartner, adminUpdatePartner, adminResendPartnerInvite } from "@/lib/partners.functions";
import { fmtMoney } from "@/lib/partners-ui";

function generateStrongPassword(len = 16) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*-_=+?";
  const all = upper + lower + digits + symbols;
  const rand = (set: string) => set[Math.floor(Math.random() * set.length)];
  const chars = [rand(upper), rand(lower), rand(digits), rand(symbols)];
  const buf = new Uint32Array(len - chars.length);
  crypto.getRandomValues(buf);
  for (const n of buf) chars.push(all[n % all.length]);
  return chars.sort(() => Math.random() - 0.5).join("");
}

export const Route = createFileRoute("/_authenticated/admin/affiliates/partners")({
  beforeLoad: async () => {
    const r = await checkIsAdmin(); if (!r.isAdmin) throw notFound(); return {};
  },
  component: PartnersPage,
  head: () => ({ meta: [{ title: "Sales Partners — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

type SortKey = "name" | "referrals" | "won" | "dealValue" | "commission" | "unpaid" | "lastActive" | "joined";
type StatusFilter = "all" | "active" | "paused";

function PartnersPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const listFn = useServerFn(adminListPartners);
  const createFn = useServerFn(adminCreatePartner);
  const updateFn = useServerFn(adminUpdatePartner);
  const inviteFn = useServerFn(adminResendPartnerInvite);
  const q = useQuery({ queryKey: ["admin", "partners"], queryFn: () => listFn() });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("commission");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawer, setDrawer] = useState<any | null>(null);
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);

  // create modal state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", full_name: "", company: "", phone: "", default_commission_pct: "10" });
  const [authMode, setAuthMode] = useState<"invite" | "password">("invite");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createdPwd, setCreatedPwd] = useState<string | null>(null);
  const [createdMode, setCreatedMode] = useState<"invite" | "password" | null>(null);
  const [createdEmail, setCreatedEmail] = useState<string>("");

  const resetForm = () => {
    setForm({ email: "", full_name: "", company: "", phone: "", default_commission_pct: "10" });
    setAuthMode("invite"); setPassword(""); setShowPwd(false); setCopied(false);
  };

  const allRows: any[] = q.data ?? [];

  const counts = useMemo(() => {
    const c = { all: allRows.length, active: 0, paused: 0 };
    for (const p of allRows) {
      if (p.status === "active") c.active++;
      else if (p.status === "paused") c.paused++;
    }
    return c;
  }, [allRows]);

  const topEarner = useMemo(() => {
    if (allRows.length === 0) return null;
    return [...allRows].sort((a, b) => (b.stats?.commission ?? 0) - (a.stats?.commission ?? 0))[0];
  }, [allRows]);

  const noActivityCount = useMemo(
    () => allRows.filter((p) => (p.stats?.total ?? 0) === 0).length,
    [allRows],
  );

  const rows = useMemo(() => {
    const s = search.trim().toLowerCase();
    const filtered = allRows.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!s) return true;
      return p.full_name.toLowerCase().includes(s)
        || (p.company ?? "").toLowerCase().includes(s)
        || p.email.toLowerCase().includes(s);
    });
    const key = sortKey;
    const dir = sortDir === "asc" ? 1 : -1;
    const val = (p: any) => {
      switch (key) {
        case "name": return p.full_name.toLowerCase();
        case "referrals": return Number(p.stats?.total ?? 0);
        case "won": return Number(p.stats?.won ?? 0);
        case "dealValue": return Number(p.stats?.dealValue ?? 0);
        case "commission": return Number(p.stats?.commission ?? 0);
        case "unpaid": return Number(p.stats?.unpaid ?? 0);
        case "lastActive": return p.stats?.lastActive ? new Date(p.stats.lastActive).getTime() : 0;
        case "joined": return p.created_at ? new Date(p.created_at).getTime() : 0;
      }
    };
    return [...filtered].sort((a, b) => {
      const av = val(a); const bv = val(b);
      if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
      return ((av as number) - (bv as number)) * dir;
    });
  }, [allRows, search, statusFilter, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir(k === "name" ? "asc" : "desc"); }
  };

  const allSelectedOnPage = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleAllOnPage = () => {
    const next = new Set(selected);
    if (allSelectedOnPage) rows.forEach((r) => next.delete(r.id));
    else rows.forEach((r) => next.add(r.id));
    setSelected(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };
  const clearSelection = () => setSelected(new Set());

  const create = useMutation({
    mutationFn: () => createFn({ data: {
      email: form.email, full_name: form.full_name,
      company: form.company || null, phone: form.phone || null,
      default_commission_pct: Number(form.default_commission_pct) || 10,
      mode: authMode,
      password: authMode === "password" ? password : null,
    }}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "partners"] });
      if (authMode === "password") { setCreatedPwd(password); setCreatedMode("password"); setCreatedEmail(form.email); toast.success("Partner created with password."); }
      else { setCreatedPwd(null); setCreatedMode("invite"); setCreatedEmail(form.email); toast.success("Invite email sent to partner."); }
      setOpen(false); resetForm();
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to add"),
  });

  const setStatus = useMutation({
    mutationFn: (v: { id: string; status: "active" | "paused" }) => updateFn({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "partners"] }); },
    onError: (e: any) => toast.error(e?.message ?? "Update failed"),
  });

  const saveEdit = useMutation({
    mutationFn: (v: any) => updateFn({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "partners"] }); setEditing(null); toast.success("Partner updated."); },
    onError: (e: any) => toast.error(e?.message ?? "Update failed"),
  });

  const invite = useMutation({
    mutationFn: (id: string) => inviteFn({ data: { id } }),
    onSuccess: (r: any) => toast.success(`Invite re-sent to ${r?.email ?? "partner"}`),
    onError: (e: any) => toast.error(e?.message ?? "Could not send invite"),
  });

  const bulkSetStatus = async (status: "active" | "paused") => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    toast.loading(`Updating ${ids.length} partner${ids.length === 1 ? "" : "s"}…`, { id: "bulk" });
    try {
      await Promise.all(ids.map((id) => updateFn({ data: { id, status } })));
      qc.invalidateQueries({ queryKey: ["admin", "partners"] });
      toast.success(`${ids.length} partner${ids.length === 1 ? "" : "s"} ${status === "active" ? "activated" : "deactivated"}.`, { id: "bulk" });
      clearSelection();
    } catch (e: any) { toast.error(e?.message ?? "Bulk update failed", { id: "bulk" }); }
  };

  const exportCsv = () => {
    const src = selected.size ? allRows.filter((p) => selected.has(p.id)) : rows;
    if (!src.length) return toast.error("Nothing to export");
    const header = ["Name","Email","Company","Phone","Status","Referrals","Won","Deal Value","Commission","Unpaid","Joined","Last Active"];
    const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [header.join(",")].concat(
      src.map((p) => [
        p.full_name, p.email, p.company ?? "", p.phone ?? "", p.status,
        p.stats.total, p.stats.won, p.stats.dealValue, p.stats.commission, p.stats.unpaid,
        p.created_at, p.stats.lastActive ?? "",
      ].map(escape).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `partners-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const copyPwd = async (value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div className="space-y-5" onClick={() => setRowMenu(null)}>
      {/* Header */}
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_var(--tw-shadow-color)] shadow-cyan-400/60" />
            Channel operations
          </div>
          <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight sm:text-[28px]">Sales Partners</h1>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Manage the partner network — performance, payouts, and portal access in a single operational workspace.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 px-3.5 py-2 text-xs font-semibold text-foreground/90 transition hover:border-cyan-400/40 hover:bg-cyan-500/5">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_10px_28px_-10px_rgba(6,182,212,0.55)] transition hover:from-cyan-300 hover:to-cyan-500">
            <Plus className="h-3.5 w-3.5" /> New Partner
          </button>
        </div>
      </header>

      {/* Summary strip */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        <SummaryTile icon={Users} label="Total partners" value={counts.all} tone="neutral" />
        <SummaryTile icon={UserCheck} label="Active" value={counts.active} tone="emerald" />
        <SummaryTile icon={UserX} label="Inactive" value={counts.paused} tone="amber" />
        <SummaryTile
          icon={Trophy}
          label="Top performer"
          value={topEarner ? topEarner.full_name : "—"}
          sub={topEarner ? fmtMoney(topEarner.stats?.commission ?? 0) : "No data yet"}
          tone="cyan" small
        />
        <SummaryTile
          icon={AlertCircle}
          label="No activity"
          value={noActivityCount}
          sub="Never submitted a referral"
          tone={noActivityCount > 0 ? "rose" : "neutral"}
        />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, or email…"
            className="w-full rounded-xl border border-border/70 bg-card/60 pl-9 pr-9 py-2 text-sm outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="inline-flex items-center gap-1 rounded-xl border border-border/70 bg-card/60 p-1">
          <Filter className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
          {(["all", "active", "paused"] as const).map((s) => {
            const active = statusFilter === s;
            const label = s === "all" ? "All" : s === "paused" ? "Inactive" : "Active";
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active ? "bg-background text-foreground shadow-sm ring-1 ring-border/70" : "text-muted-foreground hover:text-foreground"
                }`}>
                {label}
                <span className={`inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                  active ? "bg-cyan-500/15 text-cyan-200" : "bg-muted/40 text-muted-foreground"
                }`}>{counts[s]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/[0.06] px-3 py-2">
          <span className="text-xs font-medium text-cyan-100">
            {selected.size} selected
          </span>
          <span className="mx-1 h-4 w-px bg-cyan-400/20" />
          <BulkBtn icon={Power} onClick={() => bulkSetStatus("active")}>Activate</BulkBtn>
          <BulkBtn icon={PowerOff} onClick={() => bulkSetStatus("paused")}>Deactivate</BulkBtn>
          <BulkBtn icon={Wallet} onClick={() => navigate({ to: "/admin/affiliates/payouts" })}>Payout review</BulkBtn>
          <BulkBtn icon={Download} onClick={exportCsv}>Export</BulkBtn>
          <button onClick={clearSelection} className="ml-auto text-[11px] text-muted-foreground hover:text-foreground">Clear</button>
        </div>
      )}

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur">
        {q.isLoading ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <EmptyPartners hasFilter={statusFilter !== "all" || !!search} onAdd={() => setOpen(true)} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-sm">
              <thead>
                <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground bg-background/30">
                  <th className="w-10 px-3 py-3">
                    <input type="checkbox" className="accent-cyan-500" checked={allSelectedOnPage} onChange={toggleAllOnPage} />
                  </th>
                  <SortableTh onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir}>Partner</SortableTh>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <SortableTh onClick={() => toggleSort("referrals")} active={sortKey === "referrals"} dir={sortDir} align="right">Refs</SortableTh>
                  <SortableTh onClick={() => toggleSort("won")} active={sortKey === "won"} dir={sortDir} align="right">Won</SortableTh>
                  <SortableTh onClick={() => toggleSort("dealValue")} active={sortKey === "dealValue"} dir={sortDir} align="right">Deal value</SortableTh>
                  <SortableTh onClick={() => toggleSort("commission")} active={sortKey === "commission"} dir={sortDir} align="right">Commission</SortableTh>
                  <SortableTh onClick={() => toggleSort("unpaid")} active={sortKey === "unpaid"} dir={sortDir} align="right">Pending</SortableTh>
                  <SortableTh onClick={() => toggleSort("lastActive")} active={sortKey === "lastActive"} dir={sortDir}>Last active</SortableTh>
                  <SortableTh onClick={() => toggleSort("joined")} active={sortKey === "joined"} dir={sortDir}>Joined</SortableTh>
                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const isSel = selected.has(p.id);
                  return (
                    <tr key={p.id}
                      className={`group border-t border-border/40 transition-colors cursor-pointer ${isSel ? "bg-cyan-500/[0.04]" : "hover:bg-muted/15"}`}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("button,input,a")) return;
                        setDrawer(p);
                      }}>
                      <td className="px-3 py-3.5">
                        <input type="checkbox" className="accent-cyan-500" checked={isSel} onChange={() => toggleOne(p.id)} onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-500/10 text-[11px] font-semibold text-cyan-200 ring-1 ring-cyan-400/25">
                            {initials(p.full_name)}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate font-medium group-hover:text-cyan-200">{p.full_name}</div>
                            <div className="truncate text-xs text-muted-foreground">{p.company ?? "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[200px]">{p.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><StatusPill status={p.status} /></td>
                      <td className="px-4 py-3.5 text-right tabular-nums">{p.stats.total}</td>
                      <td className="px-4 py-3.5 text-right tabular-nums">
                        <span className={p.stats.won > 0 ? "text-emerald-300 font-medium" : "text-muted-foreground"}>{p.stats.won}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium tabular-nums">{fmtMoney(p.stats.dealValue)}</td>
                      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-cyan-200">{fmtMoney(p.stats.commission)}</td>
                      <td className="px-4 py-3.5 text-right tabular-nums">
                        <span className={Number(p.stats.unpaid) > 0 ? "text-amber-300 font-medium" : "text-muted-foreground"}>{fmtMoney(p.stats.unpaid)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {p.stats.lastActive ? timeAgo(p.stats.lastActive) : <span className="text-muted-foreground/60">Never</span>}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(p.created_at)}</td>
                      <td className="px-3 py-3.5 relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setRowMenu(rowMenu === p.id ? null : p.id); }}
                          className="inline-flex rounded-md p-1.5 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {rowMenu === p.id && (
                          <div onClick={(e) => e.stopPropagation()} className="absolute right-2 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-border/70 bg-popover shadow-xl">
                            <MenuItem icon={ArrowUpRight} onClick={() => { setRowMenu(null); navigate({ to: "/admin/affiliates/partners/$id", params: { id: p.id } }); }}>View profile</MenuItem>
                            <MenuItem icon={PencilLine} onClick={() => { setRowMenu(null); setEditing(p); }}>Edit</MenuItem>
                            {p.status === "active" ? (
                              <MenuItem icon={PowerOff} onClick={() => { setRowMenu(null); setStatus.mutate({ id: p.id, status: "paused" }); }}>Disable</MenuItem>
                            ) : (
                              <MenuItem icon={Power} onClick={() => { setRowMenu(null); setStatus.mutate({ id: p.id, status: "active" }); }}>Enable</MenuItem>
                            )}
                            <MenuItem icon={Send} onClick={() => { setRowMenu(null); invite.mutate(p.id); }}>Resend invite</MenuItem>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Detail drawer */}
      {drawer && <PartnerDrawer partner={drawer} onClose={() => setDrawer(null)} onEdit={() => { setEditing(drawer); setDrawer(null); }} onInvite={() => invite.mutate(drawer.id)} onToggleStatus={() => setStatus.mutate({ id: drawer.id, status: drawer.status === "active" ? "paused" : "active" })} />}

      {/* Edit modal */}
      {editing && (
        <EditPartnerModal
          partner={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => saveEdit.mutate({ id: editing.id, ...patch })}
          saving={saveEdit.isPending}
        />
      )}

      {/* Create modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">Onboarding</p>
                <h3 className="text-lg font-semibold">Add sales partner</h3>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted/40 hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
              <F label="Full name *"><input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inp} /></F>
              <F label="Email *"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} /></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Company"><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inp} /></F>
                <F label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp} /></F>
              </div>
              <F label="Default commission %"><input type="number" value={form.default_commission_pct} onChange={(e) => setForm({ ...form, default_commission_pct: e.target.value })} className={inp} /></F>

              <div className="rounded-xl border border-border/70 bg-background/40 p-3 space-y-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Login access</div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setAuthMode("invite")}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${authMode === "invite" ? "border-cyan-400/40 bg-cyan-500/10 text-foreground" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    Send invite link
                  </button>
                  <button type="button" onClick={() => setAuthMode("password")}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${authMode === "password" ? "border-cyan-400/40 bg-cyan-500/10 text-foreground" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    Set password
                  </button>
                </div>

                {authMode === "invite" ? (
                  <p className="text-xs text-muted-foreground">The partner will receive an email with a secure link to set their own password.</p>
                ) : (
                  <div className="space-y-2">
                    <label className="block">
                      <span className="text-xs text-muted-foreground">Password (min 12 chars) *</span>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input required type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="Generate or type a strong password" className={`${inp} pr-20 font-mono`} />
                          <div className="absolute inset-y-0 right-1 flex items-center gap-1">
                            <button type="button" onClick={() => setShowPwd((v) => !v)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/40" title={showPwd ? "Hide" : "Show"}>
                              {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                            <button type="button" onClick={() => password && copyPwd(password)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/40" title="Copy">
                              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                        <button type="button" onClick={() => { setPassword(generateStrongPassword(16)); setShowPwd(true); }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-2 text-xs hover:border-cyan-400/40">
                          <RefreshCw className="h-3.5 w-3.5" /> Generate
                        </button>
                      </div>
                    </label>
                    <p className="text-xs text-muted-foreground">Password is sent securely to Supabase Auth and never stored in the database. Copy and share it with the partner over a secure channel — it won't be shown again.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted/30">Cancel</button>
                <button disabled={create.isPending} className="rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 text-slate-950 px-4 py-2 text-sm font-semibold disabled:opacity-50">
                  {create.isPending ? "Adding…" : "Add partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post-create */}
      {createdMode && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Partner created</h3>
              <button onClick={() => { setCreatedMode(null); setCreatedPwd(null); }} className="rounded-lg p-1 hover:bg-muted/40"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-lg border border-border/60 bg-background/40 px-3 py-2">
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-medium">{createdEmail}</div>
              </div>
              {createdMode === "password" && createdPwd ? (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Temporary password (shown once)</div>
                  <div className="flex items-center gap-2">
                    <input readOnly value={showPwd ? createdPwd : "•".repeat(createdPwd.length)} className={`${inp} font-mono`} />
                    <button type="button" onClick={() => setShowPwd((v) => !v)} className="rounded-lg border border-border p-2 hover:border-cyan-400/40" title={showPwd ? "Hide" : "Show"}>
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button type="button" onClick={() => copyPwd(createdPwd)} className="rounded-lg border border-border p-2 hover:border-cyan-400/40" title="Copy">
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-amber-400/90">Copy this password now — it will not be shown again.</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">An invite email has been sent. The partner will follow the link to set their own password.</p>
              )}
              <div className="flex justify-end pt-2">
                <button onClick={() => { setCreatedMode(null); setCreatedPwd(null); setShowPwd(false); }} className="rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 text-slate-950 px-4 py-2 text-sm font-semibold">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------- Building blocks --------------------------- */

function SummaryTile({
  icon: Icon, label, value, sub, tone, small,
}: {
  icon: any; label: string; value: React.ReactNode; sub?: string;
  tone: "cyan" | "emerald" | "amber" | "rose" | "neutral"; small?: boolean;
}) {
  const t =
    tone === "cyan" ? "text-cyan-200"
    : tone === "emerald" ? "text-emerald-300"
    : tone === "amber" ? "text-amber-300"
    : tone === "rose" ? "text-rose-300"
    : "";
  const iconTone =
    tone === "cyan" ? "bg-cyan-500/10 text-cyan-300 ring-cyan-400/25"
    : tone === "emerald" ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/25"
    : tone === "amber" ? "bg-amber-500/10 text-amber-300 ring-amber-400/25"
    : tone === "rose" ? "bg-rose-500/10 text-rose-300 ring-rose-400/25"
    : "bg-muted/30 text-muted-foreground ring-border/60";
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur transition-colors hover:border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
          <p className={`mt-1.5 truncate ${small ? "text-lg" : "text-2xl"} font-semibold tabular-nums tracking-tight ${t}`}>{value}</p>
          {sub && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</p>}
        </div>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ${iconTone}`}><Icon className="h-3.5 w-3.5" /></span>
      </div>
    </div>
  );
}

function SortableTh({
  children, onClick, active, dir, align = "left",
}: { children: React.ReactNode; onClick: () => void; active: boolean; dir: "asc" | "desc"; align?: "left" | "right" }) {
  return (
    <th className={`px-4 py-3 font-semibold whitespace-nowrap ${align === "right" ? "text-right" : ""}`}>
      <button onClick={onClick} className={`inline-flex items-center gap-1 transition-colors ${active ? "text-cyan-200" : "hover:text-foreground"}`}>
        {children}
        <ArrowUpDown className={`h-3 w-3 transition-transform ${active && dir === "asc" ? "rotate-180" : ""}`} />
      </button>
    </th>
  );
}

function StatusPill({ status }: { status: "active" | "paused" | "pending" | "suspended" }) {
  const map = {
    active:    { cls: "bg-emerald-500/10 text-emerald-200 border-emerald-400/25", dot: "bg-emerald-400", label: "Active", pulse: true },
    paused:    { cls: "bg-zinc-500/10 text-zinc-300 border-zinc-400/25",           dot: "bg-zinc-400",    label: "Inactive", pulse: false },
    pending:   { cls: "bg-amber-500/10 text-amber-200 border-amber-400/25",        dot: "bg-amber-400",   label: "Pending", pulse: false },
    suspended: { cls: "bg-rose-500/10 text-rose-200 border-rose-400/25",           dot: "bg-rose-400",    label: "Suspended", pulse: false },
  } as const;
  const s = map[status] ?? map.paused;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${s.pulse ? "animate-pulse" : ""}`} />
      {s.label}
    </span>
  );
}

function BulkBtn({ icon: Icon, children, onClick }: { icon: any; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-background/40 px-2.5 py-1.5 text-[11px] font-medium text-cyan-100 transition hover:bg-cyan-500/10">
      <Icon className="h-3.5 w-3.5" /> {children}
    </button>
  );
}

function MenuItem({ icon: Icon, children, onClick }: { icon: any; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground/90 transition hover:bg-muted/40">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {children}
    </button>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/25" style={{ animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  );
}

function EmptyPartners({ hasFilter, onAdd }: { hasFilter: boolean; onAdd: () => void }) {
  if (hasFilter) {
    return (
      <div className="grid place-items-center gap-2 px-6 py-16 text-center">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-muted/30 text-muted-foreground ring-1 ring-border/60"><Search className="h-4 w-4" /></span>
        <p className="text-sm font-medium">No partners match your filters</p>
        <p className="max-w-xs text-xs text-muted-foreground">Adjust the search, switch the status filter, or invite a new partner to grow the network.</p>
        <button
          onClick={onAdd}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium hover:border-cyan-400/40 hover:text-cyan-200"
        >
          <Plus className="h-3.5 w-3.5" /> Invite a partner
        </button>
      </div>
    );
  }

  return (
    <div className="relative grid place-items-center gap-4 overflow-hidden px-6 py-20 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.12),transparent_60%)]" />
      <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/25">
        <UserPlus className="h-6 w-6" />
      </span>
      <div className="relative max-w-md">
        <p className="text-base font-semibold">Activate the partner network</p>
        <p className="mt-1.5 text-sm text-muted-foreground">Invite your first sales partner. They'll gain access to the portal to submit referrals, track deal progress, and receive commission payouts automatically.</p>
      </div>
      <button onClick={onAdd} className="relative inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_10px_28px_-10px_rgba(6,182,212,0.55)]">
        <Plus className="h-4 w-4" /> Invite first partner
      </button>
    </div>
  );
}

function PartnerDrawer({ partner, onClose, onEdit, onInvite, onToggleStatus }: { partner: any; onClose: () => void; onEdit: () => void; onInvite: () => void; onToggleStatus: () => void }) {
  const winRate = partner.stats.total > 0 ? Math.round((partner.stats.won / partner.stats.total) * 100) : 0;
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <aside onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border/70 bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-card/95 px-5 py-3 backdrop-blur">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Partner overview</div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted/40"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-cyan-500/10 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/25">
              {initials(partner.full_name)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-semibold">{partner.full_name}</h3>
                <StatusPill status={partner.status} />
              </div>
              <p className="truncate text-sm text-muted-foreground">{partner.company ?? "Independent"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <DrawerField icon={Mail} label="Email" value={partner.email} />
            <DrawerField icon={Phone} label="Phone" value={partner.phone ?? "—"} />
            <DrawerField icon={Wallet} label="Commission %" value={`${partner.default_commission_pct ?? 10}%`} />
            <DrawerField icon={Users} label="Joined" value={fmtDate(partner.created_at)} />
          </div>

          <div className="rounded-xl border border-border/60 bg-background/30 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Performance</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <DrawerStat label="Referrals" value={partner.stats.total} />
              <DrawerStat label="Won" value={partner.stats.won} tone="emerald" />
              <DrawerStat label="Deal value" value={fmtMoney(partner.stats.dealValue)} />
              <DrawerStat label="Commission" value={fmtMoney(partner.stats.commission)} tone="cyan" />
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">Win rate</span>
                <span className="font-semibold tabular-nums text-cyan-200">{winRate}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${winRate}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-400/25 bg-amber-500/[0.04] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">Pending payout</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums text-amber-200">{fmtMoney(partner.stats.unpaid)}</div>
              </div>
              <Link to="/admin/affiliates/payouts" className="rounded-lg border border-amber-400/30 bg-background/30 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/10">Review</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link to="/admin/affiliates/partners/$id" params={{ id: partner.id }} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 px-3 py-2 text-xs font-semibold text-slate-950">
              <ArrowUpRight className="h-3.5 w-3.5" /> Full profile
            </Link>
            <button onClick={onEdit} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-xs font-medium hover:border-cyan-400/40">
              <PencilLine className="h-3.5 w-3.5" /> Edit
            </button>
            <button onClick={onInvite} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-xs font-medium hover:border-cyan-400/40">
              <Send className="h-3.5 w-3.5" /> Resend invite
            </button>
            <button onClick={onToggleStatus} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-xs font-medium hover:border-cyan-400/40">
              {partner.status === "active" ? <><PowerOff className="h-3.5 w-3.5" /> Disable</> : <><Power className="h-3.5 w-3.5" /> Enable</>}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DrawerField({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/30 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><Icon className="h-3 w-3" /> {label}</div>
      <div className="mt-0.5 truncate text-sm font-medium">{value}</div>
    </div>
  );
}
function DrawerStat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "emerald" | "cyan" }) {
  const t = tone === "emerald" ? "text-emerald-300" : tone === "cyan" ? "text-cyan-200" : "";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-lg font-semibold tabular-nums ${t}`}>{value}</div>
    </div>
  );
}

function EditPartnerModal({ partner, onClose, onSave, saving }: { partner: any; onClose: () => void; onSave: (patch: any) => void; saving: boolean }) {
  const [status, setStatus] = useState<"active" | "paused">(partner.status);
  const [pct, setPct] = useState<string>(String(partner.default_commission_pct ?? 10));
  const [notes, setNotes] = useState<string>(partner.notes ?? "");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit partner</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted/40"><X className="h-4 w-4" /></button>
        </div>
        <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); onSave({ status, default_commission_pct: Number(pct) || null, notes: notes || null }); }}>
          <F label="Status">
            <div className="grid grid-cols-2 gap-2">
              {(["active","paused"] as const).map((s) => (
                <button type="button" key={s} onClick={() => setStatus(s)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${status === s ? "border-cyan-400/40 bg-cyan-500/10 text-foreground" : "border-border text-muted-foreground hover:border-border/80"}`}>
                  {s === "active" ? "Active" : "Inactive"}
                </button>
              ))}
            </div>
          </F>
          <F label="Default commission %"><input type="number" value={pct} onChange={(e) => setPct(e.target.value)} className={inp} /></F>
          <F label="Internal notes"><textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inp} /></F>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted/30">Cancel</button>
            <button disabled={saving} className="rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 text-slate-950 px-4 py-2 text-sm font-semibold disabled:opacity-50">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); } catch { return "—"; }
}
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  const mo = Math.floor(days / 30);
  return `${mo}mo ago`;
}

const inp = "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs text-muted-foreground">{label}</span><div className="mt-1">{children}</div></label>;
}
