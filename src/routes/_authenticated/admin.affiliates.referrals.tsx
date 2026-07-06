import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Loader2, Search, Download } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { adminListReferrals, REFERRAL_STATUSES, type ReferralStatus } from "@/lib/partners.functions";
import { fmtDate, fmtMoney, StatusChip, PayoutChip } from "@/lib/partners-ui";

export const Route = createFileRoute("/_authenticated/admin/affiliates/referrals")({
  beforeLoad: async () => { const r = await checkIsAdmin(); if (!r.isAdmin) throw notFound(); return {}; },
  component: AllReferralsPage,
  head: () => ({ meta: [{ title: "All Referrals — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

function AllReferralsPage() {
  const fn = useServerFn(adminListReferrals);
  const q = useQuery({ queryKey: ["admin", "referrals"], queryFn: () => fn() });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReferralStatus | "">("");
  const [partnerId, setPartnerId] = useState("");
  const [pkg, setPkg] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const partners = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of q.data ?? []) if (r.partner) seen.set(r.partner.id, r.partner.full_name);
    return Array.from(seen.entries());
  }, [q.data]);
  const packages = useMemo(() => Array.from(new Set((q.data ?? []).map((r) => r.package_selected).filter(Boolean) as string[])), [q.data]);

  const rows = useMemo(() => {
    const items = q.data ?? [];
    const s = search.trim().toLowerCase();
    return items.filter((r) => {
      if (status && r.status !== status) return false;
      if (partnerId && r.partner_id !== partnerId) return false;
      if (pkg && r.package_selected !== pkg) return false;
      if (from && r.referral_date < from) return false;
      if (to && r.referral_date > to) return false;
      if (!s) return true;
      return (
        r.client_name.toLowerCase().includes(s) ||
        (r.company ?? "").toLowerCase().includes(s) ||
        (r.email ?? "").toLowerCase().includes(s) ||
        (r.partner?.full_name ?? "").toLowerCase().includes(s)
      );
    });
  }, [q.data, search, status, partnerId, pkg, from, to]);

  const exportCsv = () => {
    const headers = ["Date","Client","Company","Email","Phone","Service","Package","Partner","Status","Stage","Deal","Commission","Payout"];
    const lines = [headers.join(",")];
    for (const r of rows) {
      const row = [r.referral_date, r.client_name, r.company ?? "", r.email ?? "", r.phone ?? "",
        r.service_interested ?? "", r.package_selected ?? "", r.partner?.full_name ?? "",
        r.status, r.deal_stage, r.deal_value ?? "", r.commission_amount ?? "", r.payout_status];
      lines.push(row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `referrals-${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
            className="w-full rounded-xl border border-border bg-card/60 pl-9 pr-3 py-2 text-sm outline-none focus:border-brand" />
        </div>
        <select value={partnerId} onChange={(e) => setPartnerId(e.target.value)} className={fsel}>
          <option value="">All partners</option>
          {partners.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className={fsel}>
          <option value="">All statuses</option>
          {REFERRAL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={pkg} onChange={(e) => setPkg(e.target.value)} className={fsel}>
          <option value="">All packages</option>
          {packages.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-6">
        <label className="text-sm md:col-span-1">
          <span className="text-xs text-muted-foreground">From</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={fsel + " mt-1"} />
        </label>
        <label className="text-sm md:col-span-1">
          <span className="text-xs text-muted-foreground">To</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={fsel + " mt-1"} />
        </label>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur overflow-hidden">
        {q.isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No referrals match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1000px]">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Partner</th>
                  <th className="px-5 py-3 font-medium">Service / Package</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Deal</th>
                  <th className="px-5 py-3 font-medium">Commission</th>
                  <th className="px-5 py-3 font-medium">Payout</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border/50 hover:bg-muted/20">
                    <td className="px-5 py-3">
                      <Link to="/admin/affiliates/referrals/$id" params={{ id: r.id }} className="hover:text-brand">
                        <div className="font-medium">{r.client_name}</div>
                        <div className="text-xs text-muted-foreground">{r.company ?? "—"}</div>
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      {r.partner ? (
                        <Link to="/admin/affiliates/partners/$id" params={{ id: r.partner.id }} className="hover:text-brand">
                          <div>{r.partner.full_name}</div>
                          <div className="text-xs text-muted-foreground">{r.partner.company ?? ""}</div>
                        </Link>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div>{r.service_interested ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{r.package_selected ?? ""}</div>
                    </td>
                    <td className="px-5 py-3"><StatusChip status={r.status} /></td>
                    <td className="px-5 py-3">{fmtMoney(r.deal_value)}</td>
                    <td className="px-5 py-3">{fmtMoney(r.commission_amount)}</td>
                    <td className="px-5 py-3"><PayoutChip status={r.payout_status} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{fmtDate(r.referral_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

const fsel = "rounded-xl border border-border bg-card/60 px-3 py-2 text-sm w-full";
