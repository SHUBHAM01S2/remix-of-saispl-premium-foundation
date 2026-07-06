import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Search, X } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { adminListPartners, adminCreatePartner } from "@/lib/partners.functions";
import { fmtMoney, PARTNER_STATUS_STYLES } from "@/lib/partners-ui";

export const Route = createFileRoute("/_authenticated/admin/affiliates/partners")({
  beforeLoad: async () => {
    const r = await checkIsAdmin(); if (!r.isAdmin) throw notFound(); return {};
  },
  component: PartnersPage,
  head: () => ({ meta: [{ title: "Sales Partners — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

function PartnersPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListPartners);
  const createFn = useServerFn(adminCreatePartner);
  const q = useQuery({ queryKey: ["admin", "partners"], queryFn: () => listFn() });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", full_name: "", company: "", phone: "", default_commission_pct: "10" });

  const rows = useMemo(() => {
    const items = q.data ?? [];
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p: any) =>
      p.full_name.toLowerCase().includes(s) || (p.company ?? "").toLowerCase().includes(s) || p.email.toLowerCase().includes(s));
  }, [q.data, search]);

  const m = useMutation({
    mutationFn: () => createFn({ data: {
      email: form.email, full_name: form.full_name,
      company: form.company || null, phone: form.phone || null,
      default_commission_pct: Number(form.default_commission_pct) || 10,
    }}),
    onSuccess: () => {
      toast.success("Partner added. An invite was sent if the user is new.");
      qc.invalidateQueries({ queryKey: ["admin", "partners"] });
      setOpen(false);
      setForm({ email: "", full_name: "", company: "", phone: "", default_commission_pct: "10" });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to add"),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search partners…"
            className="w-full rounded-xl border border-border bg-card/60 pl-9 pr-3 py-2 text-sm outline-none focus:border-brand" />
        </div>
        <button onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand text-brand-foreground px-4 py-2 text-sm font-medium">
          <Plus className="h-4 w-4" /> Add partner
        </button>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur overflow-hidden">
        {q.isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No partners yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Partner</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Referrals</th>
                  <th className="px-5 py-3 font-medium">Won</th>
                  <th className="px-5 py-3 font-medium">Commission</th>
                  <th className="px-5 py-3 font-medium">Unpaid</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p: any) => (
                  <tr key={p.id} className="border-t border-border/50 hover:bg-muted/20">
                    <td className="px-5 py-3">
                      <Link to="/admin/affiliates/partners/$id" params={{ id: p.id }} className="hover:text-brand">
                        <div className="font-medium">{p.full_name}</div>
                        <div className="text-xs text-muted-foreground">{p.company ?? "—"}</div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      <div>{p.email}</div>
                      <div className="text-xs">{p.phone ?? ""}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${PARTNER_STATUS_STYLES[p.status as "active"|"paused"]}`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-3">{p.stats.total}</td>
                    <td className="px-5 py-3">{p.stats.won}</td>
                    <td className="px-5 py-3">{fmtMoney(p.stats.commission)}</td>
                    <td className="px-5 py-3">{fmtMoney(p.stats.unpaid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add sales partner</h3>
              <button onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); m.mutate(); }}>
              <F label="Full name *"><input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inp} /></F>
              <F label="Email *"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} /></F>
              <F label="Company"><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inp} /></F>
              <F label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp} /></F>
              <F label="Default commission %"><input type="number" value={form.default_commission_pct} onChange={(e) => setForm({ ...form, default_commission_pct: e.target.value })} className={inp} /></F>
              <p className="text-xs text-muted-foreground">If this email isn't a user yet, they'll receive a Supabase invite to set a password.</p>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
                <button disabled={m.isPending} className="rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium disabled:opacity-50">
                  {m.isPending ? "Adding…" : "Add partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs text-muted-foreground">{label}</span><div className="mt-1">{children}</div></label>;
}
