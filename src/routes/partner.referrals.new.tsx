import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { createMyReferral } from "@/lib/partners.functions";

export const Route = createFileRoute("/partner/referrals/new")({
  component: NewReferralPage,
});

function NewReferralPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const createFn = useServerFn(createMyReferral);
  const [form, setForm] = useState({
    client_name: "", company: "", email: "", phone: "",
    service_interested: "", package_selected: "", source: "", notes: "",
  });
  const m = useMutation({
    mutationFn: (d: typeof form) => createFn({ data: d }),
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Referral submitted");
      navigate({ to: "/partner/referrals/$id", params: { id: row.id } });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to submit"),
  });

  const bind = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: any) => setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link to="/partner/referrals" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Back to referrals
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">New referral</h1>
        <p className="text-sm text-muted-foreground">Share a client with SAISPL. Our team will follow up and keep this thread updated.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); m.mutate(form); }}
        className="space-y-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Client name *"><input required {...bind("client_name")} className={inputCls} /></Field>
          <Field label="Company"><input {...bind("company")} className={inputCls} /></Field>
          <Field label="Email"><input type="email" {...bind("email")} className={inputCls} /></Field>
          <Field label="Phone"><input {...bind("phone")} className={inputCls} /></Field>
          <Field label="Service interested">
            <input placeholder="e.g., Web Design, SEO, Automation" {...bind("service_interested")} className={inputCls} />
          </Field>
          <Field label="Package selected">
            <input placeholder="e.g., Growth Plan" {...bind("package_selected")} className={inputCls} />
          </Field>
          <Field label="Referral source">
            <input placeholder="LinkedIn, WhatsApp, event…" {...bind("source")} className={inputCls} />
          </Field>
        </div>
        <Field label="Notes">
          <textarea rows={4} {...bind("notes")} className={inputCls}
            placeholder="Anything the team should know before reaching out." />
        </Field>
        <div className="flex justify-end">
          <button disabled={m.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-brand text-brand-foreground px-5 py-2 text-sm font-medium disabled:opacity-50">
            <Send className="h-4 w-4" /> {m.isPending ? "Submitting…" : "Submit referral"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-brand";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
