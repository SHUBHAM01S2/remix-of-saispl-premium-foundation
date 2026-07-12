import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, User as UserIcon, Wallet, ShieldCheck } from "lucide-react";
import { getMyPartnerProfile, updateMyPartnerProfile } from "@/lib/partners.functions";

export const Route = createFileRoute("/partner/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const qc = useQueryClient();
  const getFn = useServerFn(getMyPartnerProfile);
  const updateFn = useServerFn(updateMyPartnerProfile);
  const q = useQuery({ queryKey: ["partner", "me"], queryFn: () => getFn() });

  const [form, setForm] = useState({
    full_name: "", company: "", phone: "",
    payout_method: "upi", upi: "", account: "", ifsc: "", bank_name: "", paypal: "",
  });

  useEffect(() => {
    if (q.data) {
      const d: any = q.data.payout_details ?? {};
      setForm({
        full_name: q.data.full_name ?? "",
        company: q.data.company ?? "",
        phone: q.data.phone ?? "",
        payout_method: q.data.payout_method ?? "upi",
        upi: d.upi ?? "",
        account: d.account ?? "",
        ifsc: d.ifsc ?? "",
        bank_name: d.bank_name ?? "",
        paypal: d.paypal ?? "",
      });
    }
  }, [q.data]);

  const m = useMutation({
    mutationFn: () => updateFn({ data: {
      full_name: form.full_name,
      company: form.company || null,
      phone: form.phone || null,
      payout_method: form.payout_method || null,
      payout_details: {
        upi: form.upi, account: form.account, ifsc: form.ifsc,
        bank_name: form.bank_name, paypal: form.paypal,
      },
    }}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["partner", "me"] }); toast.success("Profile updated"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update"),
  });

  const bind = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: any) => setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  if (q.isLoading) return <div className="p-10 text-center text-sm text-slate-400"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>;

  const initials = (q.data?.full_name ?? q.data?.email ?? "P").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="grid gap-6 lg:grid-cols-[280px,1fr] max-w-5xl">
      {/* Left summary */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 text-lg font-bold shadow-lg shadow-teal-500/20">
            {initials}
          </span>
          <p className="mt-3 text-sm font-semibold">{q.data?.full_name ?? "—"}</p>
          <p className="text-xs text-slate-400 truncate">{q.data?.email}</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
            <ShieldCheck className="h-3 w-3" /> Verified partner
          </span>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-widest text-slate-400">Why this matters</p>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Accurate contact and payout details keep your commissions moving. We use these to reach you and to release payouts on time.
          </p>
        </div>
      </aside>

      {/* Form */}
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-6">
        <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500/10 text-teal-300"><UserIcon className="h-4 w-4" /></span>
            <div>
              <h2 className="text-sm font-semibold">Contact details</h2>
              <p className="text-xs text-slate-400">Used for updates and deal coordination.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name"><input {...bind("full_name")} className={inp} /></Field>
            <Field label="Company"><input {...bind("company")} className={inp} /></Field>
            <Field label="Phone"><input {...bind("phone")} className={inp} /></Field>
            <Field label="Email"><input value={q.data?.email ?? ""} readOnly className={`${inp} opacity-60 cursor-not-allowed`} /></Field>
          </div>
        </section>

        <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-300"><Wallet className="h-4 w-4" /></span>
            <div>
              <h2 className="text-sm font-semibold">Payout details</h2>
              <p className="text-xs text-slate-400">Choose how you'd like to receive commissions.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <Field label="Payout method">
              <select {...bind("payout_method")} className={inp}>
                <option value="upi">UPI</option>
                <option value="bank">Bank transfer</option>
                <option value="paypal">PayPal</option>
                <option value="other">Other</option>
              </select>
            </Field>
            {form.payout_method === "upi" && (
              <Field label="UPI ID"><input {...bind("upi")} placeholder="name@bank" className={inp} /></Field>
            )}
            {form.payout_method === "bank" && (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Account number"><input {...bind("account")} className={inp} /></Field>
                <Field label="IFSC / SWIFT"><input {...bind("ifsc")} className={inp} /></Field>
                <Field label="Bank name"><input {...bind("bank_name")} className={inp} /></Field>
              </div>
            )}
            {form.payout_method === "paypal" && (
              <Field label="PayPal email"><input {...bind("paypal")} className={inp} /></Field>
            )}
          </div>
        </section>

        <div className="flex justify-end">
          <button disabled={m.isPending}
            className="rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-5 py-2.5 text-sm shadow-lg shadow-teal-500/20 disabled:opacity-50">
            {m.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inp = "w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm outline-none focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20 transition";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs text-slate-400">{label}</span><div className="mt-1">{children}</div></label>;
}
