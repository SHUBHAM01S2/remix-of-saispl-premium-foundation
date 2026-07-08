import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Eye, EyeOff, Loader2, Plus, RefreshCw, Search, X } from "lucide-react";
import { checkIsAdmin } from "@/lib/admin.functions";
import { adminListPartners, adminCreatePartner } from "@/lib/partners.functions";
import { fmtMoney, PARTNER_STATUS_STYLES } from "@/lib/partners-ui";

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

function PartnersPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListPartners);
  const createFn = useServerFn(adminCreatePartner);
  const q = useQuery({ queryKey: ["admin", "partners"], queryFn: () => listFn() });
  const [search, setSearch] = useState("");
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
    setAuthMode("invite");
    setPassword("");
    setShowPwd(false);
    setCopied(false);
  };

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
      mode: authMode,
      password: authMode === "password" ? password : null,
    }}),
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["admin", "partners"] });
      if (authMode === "password") {
        setCreatedPwd(password);
        setCreatedMode("password");
        setCreatedEmail(form.email);
        toast.success("Partner created with password.");
      } else {
        setCreatedPwd(null);
        setCreatedMode("invite");
        setCreatedEmail(form.email);
        toast.success("Invite email sent to partner.");
      }
      setOpen(false);
      resetForm();
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to add"),
  });

  const copyPwd = async (value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };


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
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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

              {/* Auth mode section */}
              <div className="rounded-xl border border-border/70 bg-background/40 p-3 space-y-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Login access</div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setAuthMode("invite")}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${authMode === "invite" ? "border-brand bg-brand/10 text-foreground" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    Send invite link
                  </button>
                  <button type="button" onClick={() => setAuthMode("password")}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${authMode === "password" ? "border-brand bg-brand/10 text-foreground" : "border-border text-muted-foreground hover:border-border/80"}`}>
                    Set password
                  </button>
                </div>

                {authMode === "invite" ? (
                  <p className="text-xs text-muted-foreground">
                    The partner will receive an email with a secure link to set their own password.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <label className="block">
                      <span className="text-xs text-muted-foreground">Password (min 12 chars) *</span>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            required
                            type={showPwd ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Generate or type a strong password"
                            className={`${inp} pr-20 font-mono`}
                          />
                          <div className="absolute inset-y-0 right-1 flex items-center gap-1">
                            <button type="button" onClick={() => setShowPwd((v) => !v)}
                              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/40" title={showPwd ? "Hide" : "Show"}>
                              {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                            <button type="button" onClick={() => password && copyPwd(password)}
                              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/40" title="Copy">
                              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                        <button type="button"
                          onClick={() => { setPassword(generateStrongPassword(16)); setShowPwd(true); }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-2 text-xs hover:border-brand">
                          <RefreshCw className="h-3.5 w-3.5" /> Generate
                        </button>
                      </div>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Password is sent securely to Supabase Auth and never stored in the database. Copy and share it with the partner over a secure channel — it won't be shown again.
                    </p>
                  </div>
                )}
              </div>

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

      {/* Post-create summary: show generated password once, or invite confirmation */}
      {createdMode && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Partner created</h3>
              <button onClick={() => { setCreatedMode(null); setCreatedPwd(null); }}><X className="h-4 w-4" /></button>
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
                    <input readOnly value={showPwd ? createdPwd : "•".repeat(createdPwd.length)}
                      className={`${inp} font-mono`} />
                    <button type="button" onClick={() => setShowPwd((v) => !v)}
                      className="rounded-lg border border-border p-2 hover:border-brand" title={showPwd ? "Hide" : "Show"}>
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button type="button" onClick={() => copyPwd(createdPwd)}
                      className="rounded-lg border border-border p-2 hover:border-brand" title="Copy">
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-amber-400/90">
                    Copy this password now — it will not be shown again. Share it with the partner over a secure channel.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  An invite email has been sent. The partner will follow the link to set their own password and can then log in from the client/partner portal.
                </p>
              )}
              <div className="flex justify-end pt-2">
                <button onClick={() => { setCreatedMode(null); setCreatedPwd(null); setShowPwd(false); }}
                  className="rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium">
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


const inp = "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs text-muted-foreground">{label}</span><div className="mt-1">{children}</div></label>;
}
