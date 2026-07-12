import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check, Copy, Eye, EyeOff, Plus, RefreshCw, Search, X, Users, TrendingUp,
  Trophy, Wallet, ArrowUpDown, ChevronRight, Mail, Phone, UserPlus,
} from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { adminListPartners, adminCreatePartner } from "@/lib/partners.functions";
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

type SortKey = "name" | "referrals" | "won" | "commission" | "unpaid";

function PartnersPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListPartners);
  const createFn = useServerFn(adminCreatePartner);
  const q = useQuery({ queryKey: ["admin", "partners"], queryFn: () => listFn() });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">("all");
  const [sortKey, setSortKey] = useState<SortKey>("commission");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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

  const allRows = q.data ?? [];

  const counts = useMemo(() => {
    const c = { all: allRows.length, active: 0, paused: 0 };
    for (const p of allRows) {
      if (p.status === "active") c.active++;
      else if (p.status === "paused") c.paused++;
    }
    return c;
  }, [allRows]);

  const totals = useMemo(() => {
    const t = { commission: 0, unpaid: 0, referrals: 0, won: 0 };
    for (const p of allRows) {
      t.commission += Number(p.stats?.commission ?? 0);
      t.unpaid += Number(p.stats?.unpaid ?? 0);
      t.referrals += Number(p.stats?.total ?? 0);
      t.won += Number(p.stats?.won ?? 0);
    }
    return t;
  }, [allRows]);

  const topEarner = useMemo(() => {
    if (allRows.length === 0) return null;
    return [...allRows].sort((a: any, b: any) => (b.stats?.commission ?? 0) - (a.stats?.commission ?? 0))[0];
  }, [allRows]);

  const rows = useMemo(() => {
    const s = search.trim().toLowerCase();
    let filtered = allRows.filter((p: any) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!s) return true;
      return p.full_name.toLowerCase().includes(s)
        || (p.company ?? "").toLowerCase().includes(s)
        || p.email.toLowerCase().includes(s);
    });
    const cmp = (a: any, b: any) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.full_name.localeCompare(b.full_name) * dir;
      const av = Number(a.stats?.[sortKey === "referrals" ? "total" : sortKey] ?? 0);
      const bv = Number(b.stats?.[sortKey === "referrals" ? "total" : sortKey] ?? 0);
      return (av - bv) * dir;
    };
    filtered = [...filtered].sort(cmp);
    return filtered;
  }, [allRows, search, statusFilter, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir(k === "name" ? "asc" : "desc"); }
  };

  const m = useMutation({
    mutationFn: () => createFn({ data: {
      email: form.email, full_name: form.full_name,
      company: form.company || null, phone: form.phone || null,
      default_commission_pct: Number(form.default_commission_pct) || 10,
      mode: authMode,
      password: authMode === "password" ? password : null,
    }}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "partners"] });
      if (authMode === "password") {
        setCreatedPwd(password); setCreatedMode("password"); setCreatedEmail(form.email);
        toast.success("Partner created with password.");
      } else {
        setCreatedPwd(null); setCreatedMode("invite"); setCreatedEmail(form.email);
        toast.success("Invite email sent to partner.");
      }
      setOpen(false); resetForm();
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to add"),
  });

  const copyPwd = async (value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div className="space-y-5">
      {/* KPI strip */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Users} label="Total partners" value={counts.all} sub={`${counts.active} active · ${counts.paused} paused`} />
        <MetricCard icon={TrendingUp} label="Referrals sourced" value={totals.referrals} sub={`${totals.won} closed won`} tone="cyan" />
        <MetricCard icon={Wallet} label="Commission (all-time)" value={fmtMoney(totals.commission)} sub={`${fmtMoney(totals.unpaid)} unpaid`} tone="emerald" money />
        <MetricCard
          icon={Trophy} label="Top earner"
          value={topEarner ? topEarner.full_name : "—"}
          sub={topEarner ? fmtMoney(topEarner.stats?.commission ?? 0) : "No data yet"}
          tone="amber" small
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
            className="w-full rounded-xl border border-border/70 bg-card/60 pl-9 pr-3 py-2 text-sm outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20"
          />
        </div>
        <div className="inline-flex rounded-xl border border-border/70 bg-card/60 p-1">
          {(["all", "active", "paused"] as const).map((s) => {
            const active = statusFilter === s;
            const label = s === "all" ? "All" : s[0].toUpperCase() + s.slice(1);
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/70"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                <span className={`inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                  active ? "bg-cyan-500/15 text-cyan-200" : "bg-muted/40 text-muted-foreground"
                }`}>{counts[s]}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-cyan-400 to-cyan-600 px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_24px_-8px_rgba(6,182,212,0.5)] transition hover:from-cyan-300 hover:to-cyan-500"
        >
          <Plus className="h-3.5 w-3.5" /> Add partner
        </button>
      </div>

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur">
        {q.isLoading ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <EmptyPartners hasFilter={statusFilter !== "all" || !!search} onAdd={() => setOpen(true)} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <SortableTh onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir}>Partner</SortableTh>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <SortableTh onClick={() => toggleSort("referrals")} active={sortKey === "referrals"} dir={sortDir} align="right">Referrals</SortableTh>
                  <SortableTh onClick={() => toggleSort("won")} active={sortKey === "won"} dir={sortDir} align="right">Won</SortableTh>
                  <th className="px-5 py-3 font-semibold w-[120px]">Win rate</th>
                  <SortableTh onClick={() => toggleSort("commission")} active={sortKey === "commission"} dir={sortDir} align="right">Commission</SortableTh>
                  <SortableTh onClick={() => toggleSort("unpaid")} active={sortKey === "unpaid"} dir={sortDir} align="right">Unpaid</SortableTh>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((p: any) => {
                  const winRate = p.stats.total > 0 ? Math.round((p.stats.won / p.stats.total) * 100) : 0;
                  return (
                    <tr key={p.id} className="group border-t border-border/40 transition-colors hover:bg-muted/15">
                      <td className="px-5 py-3.5">
                        <Link to="/admin/affiliates/partners/$id" params={{ id: p.id }} className="flex min-w-0 items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-500/10 text-[11px] font-semibold text-cyan-200 ring-1 ring-cyan-400/25">
                            {initials(p.full_name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium group-hover:text-cyan-200">{p.full_name}</span>
                            <span className="block truncate text-xs text-muted-foreground">{p.company ?? "—"}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{p.email}</span>
                        </div>
                        {p.phone && (
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span className="truncate">{p.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={p.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">{p.stats.total}</td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        <span className={p.stats.won > 0 ? "text-emerald-300 font-medium" : "text-muted-foreground"}>{p.stats.won}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${winRate}%` }} />
                          </div>
                          <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">{winRate}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-cyan-200">{fmtMoney(p.stats.commission)}</td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        <span className={Number(p.stats.unpaid) > 0 ? "text-amber-300" : "text-muted-foreground"}>{fmtMoney(p.stats.unpaid)}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <Link to="/admin/affiliates/partners/$id" params={{ id: p.id }} className="inline-flex text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-cyan-200">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

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
            <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); m.mutate(); }}>
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
                <button disabled={m.isPending}
                  className="rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 text-slate-950 px-4 py-2 text-sm font-semibold disabled:opacity-50">
                  {m.isPending ? "Adding…" : "Add partner"}
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
                <button onClick={() => { setCreatedMode(null); setCreatedPwd(null); setShowPwd(false); }}
                  className="rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 text-slate-950 px-4 py-2 text-sm font-semibold">
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

function MetricCard({
  icon: Icon, label, value, sub, tone, money, small,
}: {
  icon: any; label: string; value: React.ReactNode; sub?: string;
  tone?: "cyan" | "emerald" | "amber"; money?: boolean; small?: boolean;
}) {
  const t =
    tone === "cyan" ? "text-cyan-200"
    : tone === "emerald" ? "text-emerald-300"
    : tone === "amber" ? "text-amber-300"
    : "";
  const iconTone =
    tone === "cyan" ? "bg-cyan-500/10 text-cyan-300 ring-cyan-400/25"
    : tone === "emerald" ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/25"
    : tone === "amber" ? "bg-amber-500/10 text-amber-300 ring-amber-400/25"
    : "bg-muted/30 text-muted-foreground ring-border/60";
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur transition-colors hover:border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
          <p className={`mt-1.5 truncate ${money || small ? "text-lg" : "text-2xl"} font-semibold tabular-nums tracking-tight ${t}`}>
            {value}
          </p>
          {sub && <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</p>}
        </div>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ${iconTone}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

function SortableTh({
  children, onClick, active, dir, align = "left",
}: {
  children: React.ReactNode; onClick: () => void; active: boolean; dir: "asc" | "desc"; align?: "left" | "right";
}) {
  return (
    <th className={`px-5 py-3 font-semibold ${align === "right" ? "text-right" : ""}`}>
      <button onClick={onClick} className={`inline-flex items-center gap-1 transition-colors ${active ? "text-cyan-200" : "hover:text-foreground"}`}>
        {children}
        <ArrowUpDown className={`h-3 w-3 transition-transform ${active && dir === "asc" ? "rotate-180" : ""}`} />
      </button>
    </th>
  );
}

function StatusPill({ status }: { status: "active" | "paused" }) {
  const cls = status === "active"
    ? "bg-emerald-500/10 text-emerald-200 border-emerald-400/25"
    : "bg-zinc-500/10 text-zinc-300 border-zinc-400/25";
  const dot = status === "active" ? "bg-emerald-400" : "bg-zinc-400";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot} ${status === "active" ? "animate-pulse" : ""}`} />
      {status[0].toUpperCase() + status.slice(1)}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/25" style={{ animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  );
}

function EmptyPartners({ hasFilter, onAdd }: { hasFilter: boolean; onAdd: () => void }) {
  if (hasFilter) {
    return (
      <div className="grid place-items-center gap-2 px-6 py-16 text-center">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-muted/30 text-muted-foreground ring-1 ring-border/60">
          <Search className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium">No partners match your filters</p>
        <p className="text-xs text-muted-foreground">Adjust the search or clear the status filter.</p>
      </div>
    );
  }
  return (
    <div className="grid place-items-center gap-3 px-6 py-16 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/25">
        <UserPlus className="h-4 w-4" />
      </span>
      <div className="max-w-sm">
        <p className="text-sm font-medium">Build your affiliate network</p>
        <p className="mt-1 text-xs text-muted-foreground">Invite your first sales partner. They'll get access to the partner portal to submit referrals and track commissions.</p>
      </div>
      <button onClick={onAdd} className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 px-3 py-1.5 text-xs font-semibold text-slate-950">
        <Plus className="h-3.5 w-3.5" /> Add first partner
      </button>
    </div>
  );
}

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

const inp = "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none transition focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs text-muted-foreground">{label}</span><div className="mt-1">{children}</div></label>;
}
