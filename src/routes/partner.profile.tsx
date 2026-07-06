import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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

  if (q.isLoading) return <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading…</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <p className="text-xs uppercase tracking-widest text-brand/80">Profile</p>
        <h1 className="mt-1 text-2xl font-semibold">Profile & payout details</h1>
        <p className="text-sm text-muted-foreground">Keep this up to date so payouts reach you correctly.</p>
      </header>

      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }}
        className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold">Contact</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name"><input {...bind("full_name")} className={inp} /></Field>
            <Field label="Company"><input {...bind("company")} className={inp} /></Field>
            <Field label="Phone"><input {...bind("phone")} className={inp} /></Field>
            <Field label="Email"><input value={q.data?.email ?? ""} readOnly className={`${inp} opacity-60 cursor-not-allowed`} /></Field>
          </div>
        </section>

        <section className="space-y-4 border-t border-border/60 pt-6">
          <h2 className="text-sm font-semibold">Payout details</h2>
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
        </section>

        <div className="flex justify-end">
          <button disabled={m.isPending}
            className="rounded-xl bg-brand text-brand-foreground px-5 py-2 text-sm font-medium disabled:opacity-50">
            {m.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inp = "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs text-muted-foreground">{label}</span><div className="mt-1">{children}</div></label>;
}
