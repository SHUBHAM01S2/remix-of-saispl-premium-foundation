import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  X, Send, Loader2, Sparkles, CheckCircle2, Copy, Check, ArrowRight,
} from "lucide-react";
import {
  createMyReferral,
  REFERRAL_STATUSES,
  type ReferralRow,
  type ReferralStatus,
} from "@/lib/partners.functions";

type FormState = {
  company: string;
  client_name: string;
  email: string;
  phone: string;
  status: ReferralStatus;
  deal_value: string;
  notes: string;
};

const INITIAL: FormState = {
  company: "",
  client_name: "",
  email: "",
  phone: "",
  status: "new",
  deal_value: "",
  notes: "",
};

export function NewReferralModal({
  open, onClose, referralLink,
}: {
  open: boolean;
  onClose: () => void;
  referralLink: string;
}) {
  const qc = useQueryClient();
  const createFn = useServerFn(createMyReferral);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errBanner, setErrBanner] = useState<string | null>(null);
  const [created, setCreated] = useState<ReferralRow | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(INITIAL);
      setErrBanner(null);
      setCreated(null);
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const m = useMutation({
    mutationFn: (d: FormState) => createFn({
      data: {
        client_name: d.client_name.trim(),
        company: d.company.trim() || null,
        email: d.email.trim() || null,
        phone: d.phone.trim() || null,
        status: d.status,
        deal_value: d.deal_value ? Number(d.deal_value) : null,
        notes: d.notes.trim() || null,
      },
    }),
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Referral submitted");
      setCreated(row);
    },
    onError: (e: any) => {
      const msg = e?.message ?? "Failed to submit referral";
      setErrBanner(msg);
    },
  });

  if (!open) return null;

  const bind = (k: keyof FormState) => ({
    value: form[k],
    onChange: (e: any) => setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20";

  const shareLink = created
    ? `${referralLink}${referralLink.includes("?") ? "&" : "?"}rid=${created.id}`
    : referralLink;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => (m.isPending ? null : onClose())}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/60"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/5 bg-[#0b1220]/95 backdrop-blur px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 shadow shadow-teal-500/20">
              {created ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold truncate">
                {created ? "Referral submitted" : "Submit a new referral"}
              </h2>
              <p className="text-xs text-slate-400 truncate">
                {created
                  ? "We've saved this and our team will take it from here."
                  : "Give us the essentials — you can refine the details later."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={m.isPending}
            className="p-2 -mr-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {created ? (
          <SuccessBody
            created={created}
            shareLink={shareLink}
            copied={copied}
            onCopy={() => {
              navigator.clipboard?.writeText(shareLink);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            onAddAnother={() => {
              setCreated(null);
              setForm(INITIAL);
              setErrBanner(null);
            }}
            onClose={onClose}
          />
        ) : (
          <form
            className="p-5 sm:p-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setErrBanner(null);
              m.mutate(form);
            }}
          >
            {errBanner && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {errBanner}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company">
                <input placeholder="Acme Pvt Ltd" {...bind("company")} className={inputCls} />
              </Field>
              <Field label="Contact name *">
                <input required placeholder="Full name" {...bind("client_name")} className={inputCls} />
              </Field>
              <Field label="Email">
                <input type="email" placeholder="name@company.com" {...bind("email")} className={inputCls} />
              </Field>
              <Field label="Phone">
                <input placeholder="+91…" {...bind("phone")} className={inputCls} />
              </Field>
              <Field label="Stage">
                <select {...bind("status")} className={inputCls}>
                  {REFERRAL_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Estimated deal value (₹)">
                <input
                  type="number" min="0" step="1000" inputMode="numeric"
                  placeholder="e.g., 250000"
                  {...bind("deal_value")}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Notes">
              <textarea
                rows={4}
                placeholder="Anything the team should know before reaching out."
                {...bind("notes")}
                className={inputCls}
              />
            </Field>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={m.isPending}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={m.isPending || !form.client_name.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-5 py-2.5 text-sm shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {m.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {m.isPending ? "Submitting…" : "Submit referral"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function SuccessBody({
  created, shareLink, copied, onCopy, onAddAnother, onClose,
}: {
  created: ReferralRow;
  shareLink: string;
  copied: boolean;
  onCopy: () => void;
  onAddAnother: () => void;
  onClose: () => void;
}) {
  return (
    <div className="p-5 sm:p-6 space-y-5">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-100">
              {created.company ?? created.client_name} is on our pipeline
            </p>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Reference ID <span className="font-mono">{created.id.slice(0, 8)}</span> · Stage:{" "}
              <span className="capitalize">{String(created.status).replace(/_/g, " ")}</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-slate-400">
          Your shareable referral link
        </label>
        <div className="mt-1.5 flex items-stretch gap-2 rounded-xl border border-white/10 bg-slate-950/40 p-1.5">
          <input
            readOnly
            value={shareLink}
            className="flex-1 min-w-0 bg-transparent px-2 text-xs text-slate-200 outline-none"
          />
          <button
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-100 px-2.5 py-1.5 text-xs hover:bg-white/10"
          >
            {copied ? (<><Check className="h-3.5 w-3.5" /> Copied</>) : (<><Copy className="h-3.5 w-3.5" /> Copy</>)}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Send it to the client so they know we're expecting them — helpful for warm intros.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-300">What happens next</p>
        <ol className="mt-3 space-y-3">
          <NextStep n={1} title="We reach out within 24h" body="Our team qualifies and books an intro call with the client." />
          <NextStep n={2} title="You get status updates" body="Track stage, deal value and payout right from your dashboard." />
          <NextStep n={3} title="Commission on close" body="Approved commissions clear on the 5th of every month." />
        </ol>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
        <button
          onClick={onAddAnother}
          className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5"
        >
          Add another referral
        </button>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to="/partner/referrals/$id"
            params={{ id: created.id }}
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-100 hover:bg-white/5"
          >
            View referral <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-semibold px-5 py-2.5 text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function NextStep({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-500/15 text-teal-300 text-[11px] font-semibold">
        {n}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-200">{title}</p>
        <p className="text-[11px] text-slate-500 leading-relaxed">{body}</p>
      </div>
    </li>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
