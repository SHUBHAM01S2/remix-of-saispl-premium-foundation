import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Search, Plus, Users, Filter, AlertTriangle, RefreshCw, X, Calendar,
  IndianRupee, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Eye,
  Pencil, Copy, Check, Sparkles, TrendingUp, BookOpen,
} from "lucide-react";
import { listMyReferrals, REFERRAL_STATUSES, type ReferralStatus } from "@/lib/partners.functions";
import { fmtDate, fmtDateTime, fmtMoney, StatusChip, PayoutChip } from "@/lib/partners-ui";
import { useOpenNewReferral } from "@/components/partner/new-referral-context";
import { PartnerEmptyState, ReferralIllustration } from "@/components/partner/EmptyState";

export const Route = createFileRoute("/partner/referrals")({
  component: MyReferralsPage,
});

type Tab = "all" | "pending" | "active" | "won" | "lost";
type SortKey = "referral_date" | "client_name" | "company" | "deal_value" | "commission_amount" | "status" | "updated_at";
type SortDir = "asc" | "desc";

const TABS: { key: Tab; label: string; match: (s: ReferralStatus) => boolean }[] = [
  { key: "all",     label: "All",     match: () => true },
  { key: "pending", label: "Pending", match: (s) => s === "new" || s === "contacted" },
  { key: "active",  label: "Active",  match: (s) => s === "in_discussion" || s === "onboarding" },
  { key: "won",     label: "Won",     match: (s) => s === "won" },
  { key: "lost",    label: "Lost",    match: (s) => s === "lost" },
];

function MyReferralsPage() {
  const listFn = useServerFn(listMyReferrals);
  const q = useQuery({ queryKey: ["partner", "referrals"], queryFn: () => listFn() });
  const openNewReferral = useOpenNewReferral();

  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReferralStatus | "">("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [minValue, setMinValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("referral_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const all = q.data ?? [];

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { all: all.length, pending: 0, active: 0, won: 0, lost: 0 };
    for (const r of all) for (const t of TABS) if (t.key !== "all" && t.match(r.status)) c[t.key]++;
    return c;
  }, [all]);

  const rows = useMemo(() => {
    const tabMatch = TABS.find((t) => t.key === tab)!.match;
    const s = search.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom).getTime() : null;
    const to = dateTo ? new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1 : null;
    const min = minValue ? Number(minValue) : null;
    const max = maxValue ? Number(maxValue) : null;

    const filtered = all.filter((r) => {
      if (!tabMatch(r.status)) return false;
      if (status && r.status !== status) return false;
      if (from || to) {
        const t = new Date(r.referral_date).getTime();
        if (from && t < from) return false;
        if (to && t > to) return false;
      }
      if (min !== null && Number(r.deal_value ?? 0) < min) return false;
      if (max !== null && Number(r.deal_value ?? 0) > max) return false;
      if (s) {
        const hay = `${r.client_name} ${r.company ?? ""} ${r.email ?? ""} ${r.phone ?? ""} ${r.package_selected ?? ""} ${r.service_interested ?? ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    filtered.sort((a: any, b: any) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av === bv) return 0;
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return filtered;
  }, [all, tab, search, status, dateFrom, dateTo, minValue, maxValue, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("desc"); }
  };

  const clearFilters = () => {
    setSearch(""); setStatus(""); setDateFrom(""); setDateTo(""); setMinValue(""); setMaxValue("");
  };
  const activeChips = [
    status && { key: "status", label: `Status: ${REFERRAL_STATUSES.find((r) => r.value === status)?.label}`, clear: () => setStatus("") },
    dateFrom && { key: "from", label: `From ${fmtDate(dateFrom)}`, clear: () => setDateFrom("") },
    dateTo && { key: "to", label: `To ${fmtDate(dateTo)}`, clear: () => setDateTo("") },
    minValue && { key: "min", label: `Min ₹${Number(minValue).toLocaleString("en-IN")}`, clear: () => setMinValue("") },
    maxValue && { key: "max", label: `Max ₹${Number(maxValue).toLocaleString("en-IN")}`, clear: () => setMaxValue("") },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const copyDetails = async (r: any) => {
    const text = [
      `Lead: ${r.client_name}`,
      r.company && `Company: ${r.company}`,
      r.email && `Email: ${r.email}`,
      r.phone && `Phone: ${r.phone}`,
      r.service_interested && `Service: ${r.service_interested}`,
      r.deal_value && `Deal value: ${fmtMoney(r.deal_value)}`,
      `Status: ${r.status}`,
      `Referred: ${fmtDate(r.referral_date)}`,
    ].filter(Boolean).join("\n");
    try { await navigator.clipboard.writeText(text); setCopiedId(r.id); setTimeout(() => setCopiedId(null), 1600); } catch {}
    setOpenMenu(null);
  };

  const totalValue = rows.reduce((sum, r) => sum + Number(r.deal_value ?? 0), 0);
  const totalCommission = rows.reduce((sum, r) => sum + Number(r.commission_amount ?? 0), 0);
  const hasAny = all.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 sm:p-7">
        <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-teal-300/80">Referral pipeline</p>
            <h1 className="mt-1 truncate text-2xl sm:text-3xl font-semibold tracking-tight">My Referrals</h1>
            <p className="mt-1.5 text-sm text-slate-400 max-w-xl">Track every lead you've introduced — status, deal value, and expected commission at a glance.</p>
          </div>
          <button
            onClick={openNewReferral}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-4 py-2.5 text-sm shadow-lg shadow-teal-500/25 hover:brightness-110 transition shrink-0"
          >
            <Plus className="h-4 w-4" /> Submit New Referral
          </button>
        </div>

        {/* Mini stats */}
        <div className="relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MiniStat label="Showing" value={String(rows.length)} sub={`of ${all.length}`} />
          <MiniStat label="Pipeline value" value={fmtMoney(totalValue)} icon={<IndianRupee className="h-3.5 w-3.5" />} />
          <MiniStat label="Expected commission" value={fmtMoney(totalCommission)} icon={<TrendingUp className="h-3.5 w-3.5" />} />
          <MiniStat label="Conversion" value={all.length ? Math.round((all.filter((r) => r.status === "won").length / all.length) * 100) + "%" : "—"} />
        </div>
      </section>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full items-center gap-1.5 rounded-2xl border border-white/5 bg-white/[0.02] p-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm transition whitespace-nowrap ${
                tab === t.key
                  ? "bg-gradient-to-r from-teal-400/15 to-cyan-500/10 text-teal-100 shadow-inner ring-1 ring-teal-400/25"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]"
              }`}
            >
              {t.label}
              <span className={`inline-flex min-w-[22px] justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${tab === t.key ? "bg-teal-400/20 text-teal-100" : "bg-white/5 text-slate-400"}`}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 sm:p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))_auto]">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads, company, email, service…"
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20"
            />
          </div>
          <FilterSelect
            icon={<Filter className="h-4 w-4" />}
            value={status}
            onChange={(v) => setStatus(v as any)}
            options={[{ value: "", label: "All statuses" }, ...REFERRAL_STATUSES.map((s) => ({ value: s.value, label: s.label }))]}
          />
          <FilterInput icon={<Calendar className="h-4 w-4" />} type="date" value={dateFrom} onChange={setDateFrom} placeholder="From" />
          <FilterInput icon={<Calendar className="h-4 w-4" />} type="date" value={dateTo} onChange={setDateTo} placeholder="To" />
          <div className="grid grid-cols-2 gap-2 md:col-span-1">
            <FilterInput icon={<IndianRupee className="h-4 w-4" />} type="number" value={minValue} onChange={setMinValue} placeholder="Min" />
            <FilterInput icon={<IndianRupee className="h-4 w-4" />} type="number" value={maxValue} onChange={setMaxValue} placeholder="Max" />
          </div>
          <button
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05] whitespace-nowrap"
          >
            <X className="h-4 w-4" /> Clear
          </button>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500">Active filters:</span>
            {activeChips.map((c) => (
              <button key={c.key} onClick={c.clear} className="inline-flex items-center gap-1 rounded-full border border-teal-400/25 bg-teal-400/10 px-2.5 py-1 text-xs text-teal-100 hover:bg-teal-400/15">
                {c.label} <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {q.error && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-500/15 text-rose-300"><AlertTriangle className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-rose-100">We couldn't load your referrals</p>
            <p className="text-xs text-rose-200/80 truncate">{(q.error as any)?.message ?? "Unknown error"}</p>
          </div>
          <button onClick={() => q.refetch()} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs font-medium text-rose-100 hover:bg-rose-400/20">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Body */}
      {q.isLoading ? (
        <TableSkeleton />
      ) : !hasAny ? (
        <FirstReferralEmpty onOpen={openNewReferral} />
      ) : rows.length === 0 ? (
        <NoResults onClear={clearFilters} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-sm">
                <thead className="text-left text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                  <tr>
                    <Th label="Lead" k="client_name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <Th label="Company" k="company" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <th className="px-5 py-3 font-medium">Contact</th>
                    <Th label="Submitted" k="referral_date" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <Th label="Deal value" k="deal_value" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                    <Th label="Status" k="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <Th label="Expected commission" k="commission_amount" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
                    <Th label="Last updated" k="updated_at" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.03] transition group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-500/25 to-cyan-500/10 text-teal-200 text-xs font-semibold ring-1 ring-teal-400/20">
                            {initials(r.client_name)}
                          </div>
                          <div className="min-w-0">
                            <Link to="/partner/referrals/$id" params={{ id: r.id }} className="block truncate font-medium hover:text-teal-300">{r.client_name}</Link>
                            <div className="truncate text-xs text-slate-500">{r.service_interested ?? "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 max-w-[220px]">
                        <div className="truncate">{r.company ?? "—"}</div>
                        <div className="truncate text-xs text-slate-500">{r.package_selected ?? ""}</div>
                      </td>
                      <td className="px-5 py-3.5 max-w-[220px]">
                        <div className="truncate text-slate-300">{r.email ?? "—"}</div>
                        <div className="truncate text-xs text-slate-500">{r.phone ?? ""}</div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-300">{fmtDate(r.referral_date)}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right tabular-nums">{fmtMoney(r.deal_value)}</td>
                      <td className="px-5 py-3.5"><StatusChip status={r.status} /></td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right tabular-nums">
                        <div>{fmtMoney(r.commission_amount)}</div>
                        {r.commission_pct != null && <div className="text-[11px] text-slate-500">{r.commission_pct}%</div>}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-400">{fmtDateTime(r.updated_at)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <RowActions
                          id={r.id}
                          openMenu={openMenu}
                          setOpenMenu={setOpenMenu}
                          onCopy={() => copyDetails(r)}
                          copied={copiedId === r.id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / tablet cards */}
          <div className="grid gap-3 lg:hidden">
            {rows.map((r) => (
              <article key={r.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-500/25 to-cyan-500/10 text-teal-200 text-xs font-semibold ring-1 ring-teal-400/20">
                      {initials(r.client_name)}
                    </div>
                    <div className="min-w-0">
                      <Link to="/partner/referrals/$id" params={{ id: r.id }} className="block truncate font-medium hover:text-teal-300">{r.client_name}</Link>
                      <div className="truncate text-xs text-slate-500">{r.company ?? "—"}</div>
                    </div>
                  </div>
                  <StatusChip status={r.status} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Field label="Deal value" value={fmtMoney(r.deal_value)} />
                  <Field label="Commission" value={fmtMoney(r.commission_amount)} />
                  <Field label="Submitted" value={fmtDate(r.referral_date)} />
                  <Field label="Updated" value={fmtDateTime(r.updated_at)} />
                </div>
                {(r.email || r.phone) && (
                  <div className="mt-3 truncate text-xs text-slate-500">
                    {r.email}{r.email && r.phone ? " · " : ""}{r.phone}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <PayoutChip status={r.payout_status} />
                  <div className="ml-auto flex items-center gap-1.5">
                    <Link to="/partner/referrals/$id" params={{ id: r.id }} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06]">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Link>
                    <button onClick={() => copyDetails(r)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06]">
                      {copiedId === r.id ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- small building blocks ---------- */

function MiniStat({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-950/30 p-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        {icon && <span className="text-teal-300">{icon}</span>}
        <span className="text-lg font-semibold tabular-nums">{value}</span>
        {sub && <span className="text-xs text-slate-500">{sub}</span>}
      </div>
    </div>
  );
}

function FilterSelect({ icon, value, onChange, options }: { icon: React.ReactNode; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="relative min-w-0">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/40 pl-9 pr-8 py-2.5 text-sm outline-none focus:border-teal-400/50"
      >
        {options.map((o) => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
      </select>
    </div>
  );
}

function FilterInput({ icon, type, value, onChange, placeholder }: { icon: React.ReactNode; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative min-w-0">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-slate-950/40 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20 [color-scheme:dark]"
      />
    </div>
  );
}

function Th({ label, k, sortKey, sortDir, onSort, align = "left" }: { label: string; k: SortKey; sortKey: SortKey; sortDir: SortDir; onSort: (k: SortKey) => void; align?: "left" | "right" }) {
  const active = sortKey === k;
  return (
    <th className={`px-5 py-3 font-medium ${align === "right" ? "text-right" : ""}`}>
      <button onClick={() => onSort(k)} className={`inline-flex items-center gap-1 hover:text-slate-200 ${active ? "text-teal-300" : ""}`}>
        {label}
        {active ? (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-50" />}
      </button>
    </th>
  );
}

function RowActions({ id, openMenu, setOpenMenu, onCopy, copied }: { id: string; openMenu: string | null; setOpenMenu: (v: string | null) => void; onCopy: () => void; copied: boolean }) {
  const open = openMenu === id;
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpenMenu(open ? null : id)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/[0.06]"
        aria-label="Row actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" onClick={() => setOpenMenu(null)} aria-hidden />
          <div className="absolute right-0 z-20 mt-1.5 w-44 rounded-xl border border-white/10 bg-slate-950/95 backdrop-blur p-1 shadow-2xl">
            <Link to="/partner/referrals/$id" params={{ id }} onClick={() => setOpenMenu(null)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.06]">
              <Eye className="h-4 w-4" /> View
            </Link>
            <Link to="/partner/referrals/$id" params={{ id }} onClick={() => setOpenMenu(null)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.06]">
              <Pencil className="h-4 w-4" /> Edit
            </Link>
            <button onClick={onCopy} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.06]">
              {copied ? <><Check className="h-4 w-4 text-emerald-400" /> Copied</> : <><Copy className="h-4 w-4" /> Copy details</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-3 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))] items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10" />
            <div className="space-y-1.5">
              <div className="h-3 w-32 rounded bg-white/10" />
              <div className="h-2.5 w-20 rounded bg-white/5" />
            </div>
          </div>
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-3 w-20 rounded bg-white/5" />
          <div className="h-5 w-16 rounded-full bg-white/10 justify-self-start" />
          <div className="h-3 w-16 rounded bg-white/10 justify-self-end" />
        </div>
      ))}
    </div>
  );
}

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <PartnerEmptyState
      icon={Search}
      tone="indigo"
      title="No referrals match your filters"
      body="Try broadening your search, changing the status tab, or clearing the active filters."
      cta={{ label: "Clear filters", onClick: onClear, icon: X }}
      quickLinks={[
        { label: "Submit a referral", to: "/partner/referrals/new", icon: Sparkles },
        { label: "View commission rules", to: "/partner/earnings", icon: BookOpen },
      ]}
      compact
    />
  );
}

function FirstReferralEmpty({ onOpen }: { onOpen: () => void }) {
  return (
    <PartnerEmptyState
      illustration={<ReferralIllustration Icon={Users} />}
      eyebrow="Your referrals live here"
      title="You haven't submitted any referrals yet"
      body="Start by adding your first lead and we'll help you track every stage — from first intro to closed deal and paid commission."
      cta={{ label: "Submit your first referral", onClick: onOpen, icon: Sparkles }}
      quickLinks={[
        { label: "How commissions work", to: "/partner/earnings", icon: BookOpen },
        { label: "Copy invite link", to: "/partner/profile", icon: Copy },
      ]}
      steps={[
        { title: "Introduce a business", body: "Anyone who could benefit from our engineering, AI, or automation services." },
        { title: "Submit their details", body: "Add company, contact, and the service they're interested in — takes under a minute." },
        { title: "Earn on conversion", body: "You get paid commission the moment the deal closes and the client onboards." },
      ]}
    />
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}
