import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Loader2, User as UserIcon, Wallet, ShieldCheck, Building2, Phone, Mail,
  FileText, Bell, Lock, Link2, Copy, Eye, EyeOff, Check, Sparkles,
  BadgeCheck, AlertCircle,
} from "lucide-react";
import { getMyPartnerProfile, updateMyPartnerProfile } from "@/lib/partners.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/partner/profile")({
  component: ProfilePage,
});

type Form = {
  full_name: string; company: string; phone: string;
  address: string; website: string;
  payout_method: string; upi: string; account: string; ifsc: string; bank_name: string; account_holder: string; paypal: string;
  gstin: string; pan: string; business_type: string;
  notify_referral_updates: boolean; notify_payouts: boolean; notify_product: boolean; notify_marketing: boolean;
};

const emptyForm: Form = {
  full_name: "", company: "", phone: "",
  address: "", website: "",
  payout_method: "upi", upi: "", account: "", ifsc: "", bank_name: "", account_holder: "", paypal: "",
  gstin: "", pan: "", business_type: "individual",
  notify_referral_updates: true, notify_payouts: true, notify_product: true, notify_marketing: false,
};

function ProfilePage() {
  const qc = useQueryClient();
  const getFn = useServerFn(getMyPartnerProfile);
  const updateFn = useServerFn(updateMyPartnerProfile);
  const q = useQuery({ queryKey: ["partner", "me"], queryFn: () => getFn() });

  const [form, setForm] = useState<Form>(emptyForm);
  const [initial, setInitial] = useState<Form>(emptyForm);

  useEffect(() => {
    if (q.data) {
      const d: any = q.data.payout_details ?? {};
      const next: Form = {
        full_name: q.data.full_name ?? "",
        company: q.data.company ?? "",
        phone: q.data.phone ?? "",
        address: d.address ?? "",
        website: d.website ?? "",
        payout_method: q.data.payout_method ?? "upi",
        upi: d.upi ?? "",
        account: d.account ?? "",
        ifsc: d.ifsc ?? "",
        bank_name: d.bank_name ?? "",
        account_holder: d.account_holder ?? "",
        paypal: d.paypal ?? "",
        gstin: d.gstin ?? "",
        pan: d.pan ?? "",
        business_type: d.business_type ?? "individual",
        notify_referral_updates: d.notify_referral_updates ?? true,
        notify_payouts: d.notify_payouts ?? true,
        notify_product: d.notify_product ?? true,
        notify_marketing: d.notify_marketing ?? false,
      };
      setForm(next); setInitial(next);
    }
  }, [q.data]);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);

  const m = useMutation({
    mutationFn: () => updateFn({ data: {
      full_name: form.full_name,
      company: form.company || null,
      phone: form.phone || null,
      payout_method: form.payout_method || null,
      payout_details: {
        address: form.address, website: form.website,
        upi: form.upi, account: form.account, ifsc: form.ifsc, bank_name: form.bank_name, account_holder: form.account_holder, paypal: form.paypal,
        gstin: form.gstin, pan: form.pan, business_type: form.business_type,
        notify_referral_updates: form.notify_referral_updates,
        notify_payouts: form.notify_payouts,
        notify_product: form.notify_product,
        notify_marketing: form.notify_marketing,
      },
    }}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["partner", "me"] }); toast.success("Profile updated"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update"),
  });

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const bind = (k: keyof Form) => ({
    value: form[k] as any,
    onChange: (e: any) => set(k, (e?.target?.value ?? "") as any),
  });

  if (q.isLoading) {
    return (
      <div className="p-10 text-center text-sm text-slate-400">
        <Loader2 className="inline h-4 w-4 animate-spin mr-2" />Loading your profile…
      </div>
    );
  }

  const initials = (q.data?.full_name ?? q.data?.email ?? "P").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const referralCode = (q.data?.id ?? "").slice(0, 8).toUpperCase();
  const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/partners?ref=${referralCode}` : `/partners?ref=${referralCode}`;

  const completion = calcCompletion(form);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); m.mutate(); }}
      className="grid gap-6 lg:grid-cols-[300px,1fr] items-start"
    >
      {/* Sidebar summary */}
      <aside className="space-y-4 lg:sticky lg:top-6">
        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-5 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 -top-16 h-32 bg-gradient-to-b from-teal-500/20 to-transparent blur-2xl" />
          <span className="relative mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 text-xl font-bold shadow-lg shadow-teal-500/30 ring-4 ring-slate-950">
            {initials}
          </span>
          <p className="relative mt-3 text-base font-semibold">{q.data?.full_name || "Partner"}</p>
          <p className="relative text-xs text-slate-400 truncate">{q.data?.email}</p>
          <span className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
            <BadgeCheck className="h-3 w-3" /> Verified partner
          </span>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-300">Profile completion</p>
            <span className="text-xs font-semibold text-teal-300 tabular-nums">{completion}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all" style={{ width: `${completion}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">Complete every section to unlock faster payouts and a higher commission tier.</p>
        </div>

        <nav className="rounded-2xl border border-white/5 bg-white/[0.02] p-2 hidden lg:block">
          {[
            { id: "personal", label: "Personal info", icon: UserIcon },
            { id: "company", label: "Company", icon: Building2 },
            { id: "payout", label: "Payout", icon: Wallet },
            { id: "tax", label: "Tax & compliance", icon: FileText },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Lock },
            { id: "referral", label: "Referral link", icon: Link2 },
          ].map((n) => (
            <a key={n.id} href={`#${n.id}`} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] transition">
              <n.icon className="h-3.5 w-3.5" /> {n.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="space-y-6 min-w-0">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Account settings</h1>
            <p className="mt-1 text-sm text-slate-400">Manage your identity, payout details, and how we keep in touch.</p>
          </div>
          <div className="flex items-center gap-2">
            {dirty && <span className="inline-flex items-center gap-1 text-xs text-amber-300"><AlertCircle className="h-3.5 w-3.5" /> Unsaved changes</span>}
            <button
              type="submit"
              disabled={m.isPending || !dirty}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-4 py-2.5 text-sm shadow-lg shadow-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {m.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {m.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </header>

        {/* Personal */}
        <Card id="personal" icon={UserIcon} tint="text-teal-300 bg-teal-500/10" title="Personal information" desc="How SAISPL identifies and contacts you across the partner platform.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" hint="This name appears on all payouts and official communications." required>
              <input {...bind("full_name")} placeholder="e.g. Ananya Sharma" className={inp} />
            </Field>
            <Field label="Email address" hint="Contact support if you need to update your email.">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input value={q.data?.email ?? ""} readOnly className={`${inp} pl-9 opacity-60 cursor-not-allowed`} />
              </div>
            </Field>
            <Field label="Phone number" hint="Used only for time-sensitive deal coordination.">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input {...bind("phone")} placeholder="+91 90000 00000" className={`${inp} pl-9`} />
              </div>
            </Field>
            <Field label="Website" hint="Your personal or professional site (optional).">
              <input {...bind("website")} placeholder="https://" className={inp} />
            </Field>
          </div>
        </Card>

        {/* Company */}
        <Card id="company" icon={Building2} tint="text-cyan-300 bg-cyan-500/10" title="Company details" desc="Information about the business you represent.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Company name" hint="Leave blank if you're operating as an independent partner.">
              <input {...bind("company")} placeholder="Acme Pvt Ltd" className={inp} />
            </Field>
            <Field label="Business entity">
              <select {...bind("business_type")} className={inp}>
                <option value="individual">Individual / Freelancer</option>
                <option value="proprietor">Sole Proprietor</option>
                <option value="partnership">Partnership / LLP</option>
                <option value="pvt_ltd">Private Limited</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Registered business address" hint="Used on invoices and for tax reporting.">
                <textarea {...bind("address")} rows={3} placeholder="Street, City, State, PIN" className={`${inp} resize-none`} />
              </Field>
            </div>
          </div>
        </Card>

        {/* Payout */}
        <Card id="payout" icon={Wallet} tint="text-emerald-300 bg-emerald-500/10" title="Payout details" desc="Select how you'd like to receive your commissions." accent>
          <div className="grid gap-5">
            <Field label="Preferred payout method" hint="You can change methods at any time — updates apply to the next payout cycle.">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { v: "upi", label: "UPI" },
                  { v: "bank", label: "Bank" },
                  { v: "paypal", label: "PayPal" },
                  { v: "other", label: "Other" },
                ].map((o) => {
                  const active = form.payout_method === o.v;
                  return (
                    <button
                      type="button"
                      key={o.v}
                      onClick={() => set("payout_method", o.v)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "border-teal-400/40 bg-teal-400/10 text-teal-100 shadow-inner shadow-teal-500/10"
                          : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/20 hover:text-slate-100"
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            {form.payout_method === "upi" && (
              <Field label="UPI ID" hint="Example: yourname@okhdfcbank">
                <input {...bind("upi")} placeholder="name@bank" className={inp} />
              </Field>
            )}
            {form.payout_method === "bank" && (
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Account holder name"><input {...bind("account_holder")} className={inp} /></Field>
                <Field label="Bank name"><input {...bind("bank_name")} className={inp} /></Field>
                <Field label="Account number"><input {...bind("account")} className={inp} /></Field>
                <Field label="IFSC / SWIFT" hint="11 characters for IFSC."><input {...bind("ifsc")} className={inp} /></Field>
              </div>
            )}
            {form.payout_method === "paypal" && (
              <Field label="PayPal email"><input {...bind("paypal")} type="email" className={inp} /></Field>
            )}

            <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5 flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">Your payout details are encrypted at rest. Only you and our finance team can access them.</p>
            </div>
          </div>
        </Card>

        {/* Tax */}
        <Card id="tax" icon={FileText} tint="text-amber-300 bg-amber-500/10" title="Tax & compliance" desc="Optional — required only to unlock invoicing above ₹20,000 per month.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="PAN" hint="10-character alphanumeric identifier (e.g. ABCDE1234F).">
              <input {...bind("pan")} maxLength={10} className={`${inp} uppercase tracking-wider`} />
            </Field>
            <Field label="GSTIN" hint="Provide only if you are GST-registered.">
              <input {...bind("gstin")} maxLength={15} className={`${inp} uppercase tracking-wider`} />
            </Field>
          </div>
        </Card>

        {/* Notifications */}
        <Card id="notifications" icon={Bell} tint="text-indigo-300 bg-indigo-500/10" title="Notification preferences" desc="Choose which partner updates you'd like to receive.">
          <div className="divide-y divide-white/5">
            <Toggle
              label="Referral activity"
              hint="Deal status changes and messages from the SAI team on your active referrals."
              checked={form.notify_referral_updates}
              onChange={(v) => set("notify_referral_updates", v)}
            />
            <Toggle
              label="Payouts & commissions"
              hint="Alerts when a commission is approved and when a payout has been released."
              checked={form.notify_payouts}
              onChange={(v) => set("notify_payouts", v)}
            />
            <Toggle
              label="Product & platform updates"
              hint="New partner tools, dashboard improvements, and occasional best-practice tips."
              checked={form.notify_product}
              onChange={(v) => set("notify_product", v)}
            />
            <Toggle
              label="Marketing & partner offers"
              hint="Campaigns you can share with prospects and partner-exclusive incentives."
              checked={form.notify_marketing}
              onChange={(v) => set("notify_marketing", v)}
            />
          </div>
        </Card>

        {/* Security */}
        <Card id="security" icon={Lock} tint="text-rose-300 bg-rose-500/10" title="Password & security" desc="Manage the credentials that protect your partner account.">
          <PasswordSection />
        </Card>

        {/* Referral link */}
        <Card id="referral" icon={Link2} tint="text-fuchsia-300 bg-fuchsia-500/10" title="Your partner referral link" desc="Share this link to attribute new partner sign-ups to your account.">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-[auto,1fr] items-stretch">
              <div className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-fuchsia-300" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">Referral code</div>
                  <div className="text-base font-semibold tracking-wider tabular-nums">{referralCode || "—"}</div>
                </div>
              </div>
              <CopyField label="Invite link" value={inviteLink} />
            </div>
            <p className="text-xs text-slate-500">Every partner who signs up through your link is automatically attributed to you — they'll appear in your team view when it launches.</p>
          </div>
        </Card>

        {/* Sticky footer save */}
        <div className="sticky bottom-4 z-10">
          <div className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 backdrop-blur transition ${
            dirty
              ? "border-teal-400/25 bg-slate-950/80 shadow-xl shadow-teal-500/10"
              : "border-white/5 bg-slate-950/50"
          }`}>
            <p className="text-xs text-slate-400">
              {dirty ? "You have unsaved changes — don't forget to save." : "All changes saved."}
            </p>
            <div className="flex gap-2">
              {dirty && (
                <button
                  type="button"
                  onClick={() => setForm(initial)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06]"
                >
                  Discard
                </button>
              )}
              <button
                type="submit"
                disabled={m.isPending || !dirty}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-4 py-2 text-xs shadow disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {m.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

/* ---------- password section ---------- */
function PasswordSection() {
  const [pwd, setPwd] = useState({ next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const strength = calcStrength(pwd.next);
  const canSubmit = pwd.next.length >= 8 && pwd.next === pwd.confirm && !busy;

  const submit = async () => {
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pwd.next });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setPwd({ next: "", confirm: "" });
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="New password" hint="Minimum 8 characters. Use a mix of letters, numbers, and symbols.">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pwd.next}
              onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
              className={`${inp} pr-10`}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <Field label="Confirm password">
          <input
            type={show ? "text" : "password"}
            value={pwd.confirm}
            onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
            className={inp}
            autoComplete="new-password"
          />
        </Field>
      </div>

      <div>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i < strength.score ? strength.color : "bg-white/5"}`} />
          ))}
        </div>
        <p className="mt-1.5 text-xs text-slate-500">Strength: <span className={strength.textColor}>{strength.label}</span></p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Update password
        </button>
        {pwd.next && pwd.next !== pwd.confirm && (
          <span className="text-xs text-rose-300">Passwords don't match.</span>
        )}
      </div>
    </div>
  );
}

function calcStrength(p: string) {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const map = [
    { label: "Too short", color: "bg-slate-700", textColor: "text-slate-500" },
    { label: "Weak", color: "bg-rose-500/70", textColor: "text-rose-300" },
    { label: "Fair", color: "bg-amber-400/80", textColor: "text-amber-300" },
    { label: "Good", color: "bg-teal-400/80", textColor: "text-teal-300" },
    { label: "Strong", color: "bg-emerald-400", textColor: "text-emerald-300" },
  ];
  return { score, ...map[score] };
}

function calcCompletion(f: Form) {
  const checks = [
    !!f.full_name, !!f.phone, !!f.company, !!f.address,
    !!(f.payout_method === "upi" ? f.upi : f.payout_method === "bank" ? f.account && f.ifsc : f.payout_method === "paypal" ? f.paypal : true),
    !!f.pan,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

/* ---------- primitives ---------- */

function Card({
  id, icon: Icon, tint, title, desc, accent, children,
}: {
  id?: string; icon: any; tint: string; title: string; desc?: string; accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-6 rounded-2xl border border-white/5 overflow-hidden ${
        accent ? "bg-gradient-to-br from-emerald-500/[0.04] to-white/[0.01]" : "bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-white/5">
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${tint}`}><Icon className="h-4 w-4" /></span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{title}</h2>
          {desc && <p className="mt-0.5 text-xs text-slate-400">{desc}</p>}
        </div>
      </div>
      <div className="px-5 sm:px-6 py-5">{children}</div>
    </section>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">{label}{required && <span className="text-rose-300 ml-0.5">*</span>}</span>
      </div>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">{hint}</p>}
    </label>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-100">{label}</div>
        {hint && <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? "bg-gradient-to-r from-teal-400 to-cyan-500" : "bg-white/10"}`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); toast.success(`${label} copied`); setTimeout(() => setCopied(false), 1500); }
    catch { toast.error("Copy failed"); }
  };
  return (
    <div className="flex items-stretch gap-2 rounded-xl border border-white/10 bg-slate-950/60 pl-3 pr-1.5 py-1.5">
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
        <div className="truncate text-sm text-slate-100">{value}</div>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] px-3 text-xs text-slate-100 transition"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

const inp =
  "w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20 transition";
