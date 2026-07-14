import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  Handshake,
  Send,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/affiliate-enquiry")({
  head: () => ({
    meta: [
      { title: "Apply as Affiliate | Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Apply to the Shivaryan Infotech Affiliate Program. Share your audience details and start earning up to 15% commission on referred projects.",
      },
      { property: "og:title", content: "Apply as Affiliate — Shivaryan Infotech" },
      {
        property: "og:description",
        content:
          "Submit your affiliate enquiry — earn up to 15% commission on web design, custom software, SEO, and AI automation projects you refer.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/affiliate-enquiry" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Apply as Affiliate — Shivaryan Infotech" },
      {
        name: "twitter:description",
        content: "Apply to the Shivaryan Infotech Affiliate Program in under 2 minutes.",
      },
    ],
    links: [{ rel: "canonical", href: "/affiliate-enquiry" }],
  }),
  component: AffiliateEnquiryPage,
});

const AUDIENCE_TYPES = [
  "Agency / Studio",
  "Freelancer / Consultant",
  "Content creator / Influencer",
  "Business network / Community",
  "Sales / Reseller",
  "Existing client",
  "Other",
];

const REFERRAL_RANGES = [
  "1 – 2 per month",
  "3 – 5 per month",
  "6 – 10 per month",
  "10+ per month",
  "Not sure yet",
];

const HEAR_ABOUT_OPTIONS = [
  "Google search",
  "LinkedIn",
  "Instagram",
  "Facebook",
  "YouTube",
  "Referral from a friend / colleague",
  "Existing client",
  "Event / conference",
  "Blog / article",
  "Other",
];


const schema = z.object({
  full_name: z.string().trim().min(1, "Please enter your full name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a valid phone number.")
    .max(30, "Phone number is too long."),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  location: z.string().trim().max(150).optional().or(z.literal("")),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  audience_type: z.string().trim().max(100).optional().or(z.literal("")),
  experience: z.string().trim().max(1000).optional().or(z.literal("")),
  expected_referrals: z.string().trim().max(100).optional().or(z.literal("")),
  hear_about: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please tell us a little about your plans.").max(2000),
});

type FormState = z.input<typeof schema>;

const EMPTY: FormState = {
  full_name: "",
  email: "",
  phone: "",
  company: "",
  location: "",
  website: "",
  audience_type: "",
  experience: "",
  expected_referrals: "",
  hear_about: "",
  message: "",
};

function AffiliateEnquiryPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/40";
  const labelCls = "text-xs font-medium uppercase tracking-tighter text-zinc-400";

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Please review your details.";
      toast.error(first);
      setErrorMsg(first);
      return;
    }
    const v = parsed.data;

    setSubmitting(true);
    const payload = {
      full_name: v.full_name,
      email: v.email,
      phone: v.phone,
      company: v.company || null,
      location: v.location || null,
      website: v.website || null,
      audience_type: v.audience_type || null,
      experience: v.experience || null,
      expected_referrals: v.expected_referrals || null,
      hear_about: v.hear_about || null,
      message: v.message,
    };
    const { error } = await (supabase as any).from("affiliate_enquiries").insert(payload);
    setSubmitting(false);

    if (error) {
      const msg =
        "We couldn't submit your enquiry. Please try again in a moment or email us directly.";
      toast.error(msg);
      setErrorMsg(msg);
      return;
    }

    toast.success("Enquiry received. We'll reach out within 4 business hours.");
    setSubmitted(true);
    setForm(EMPTY);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-zinc-200 selection:bg-blue-500/30 selection:text-blue-200">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
        <Link
          to="/affiliate"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to affiliate program
        </Link>

        <div className="mt-8 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: pitch */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
                Affiliate application
              </div>
              <h1
                className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl"
                style={{ fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif" }}
              >
                Apply as an{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Affiliate
                </span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-zinc-400 md:text-lg">
                Tell us about your audience and how you'd like to refer clients. We review every
                application and reply within 4 business hours with next steps.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                {
                  icon: BadgeDollarSign,
                  title: "Up to 15% commission",
                  desc: "Paid on collected revenue for eligible projects and retainers.",
                },
                {
                  icon: Handshake,
                  title: "Dedicated support",
                  desc: "A named partner contact, pitch decks, and priority responses.",
                },
                {
                  icon: CheckCircle2,
                  title: "Transparent tracking",
                  desc: "Your referral link, monthly statements, and clear payout timeline.",
                },
              ].map((p) => (
                <li
                  key={p.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{p.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 opacity-20 blur" />
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 md:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Enquiry received</h3>
                  <p className="mt-2 max-w-sm text-sm text-zinc-400">
                    Thanks for applying to our affiliate program. Our team will review your
                    details and get back within 4 business hours.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                    >
                      Submit another enquiry
                    </button>
                    <Link
                      to="/affiliate"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-all hover:brightness-110"
                    >
                      Back to program
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {errorMsg && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                    >
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field label="Full name *" htmlFor="full_name">
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        maxLength={100}
                        autoComplete="name"
                        placeholder="Priya Sharma"
                        value={form.full_name}
                        onChange={(e) => set("full_name", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Email address *" htmlFor="email">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        maxLength={255}
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field label="Phone number *" htmlFor="phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        maxLength={30}
                        autoComplete="tel"
                        placeholder="+91 00000-00000"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Company / brand" htmlFor="company">
                      <input
                        id="company"
                        name="company"
                        type="text"
                        maxLength={150}
                        placeholder="Your company or personal brand"
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field label="Location" htmlFor="location">
                      <input
                        id="location"
                        name="location"
                        type="text"
                        maxLength={150}
                        placeholder="City, Country"
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Website or social profile" htmlFor="website">
                      <input
                        id="website"
                        name="website"
                        type="text"
                        maxLength={255}
                        placeholder="https://…"
                        value={form.website}
                        onChange={(e) => set("website", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field label="Audience / network type" htmlFor="audience_type">
                      <select
                        id="audience_type"
                        name="audience_type"
                        value={form.audience_type}
                        onChange={(e) => set("audience_type", e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select an option</option>
                        {AUDIENCE_TYPES.map((a) => (
                          <option key={a} value={a} className="bg-[#0a0a0a]">
                            {a}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Expected monthly referrals" htmlFor="expected_referrals">
                      <select
                        id="expected_referrals"
                        name="expected_referrals"
                        value={form.expected_referrals}
                        onChange={(e) => set("expected_referrals", e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select an option</option>
                        {REFERRAL_RANGES.map((r) => (
                          <option key={r} value={r} className="bg-[#0a0a0a]">
                            {r}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Experience in sales or referrals" htmlFor="experience">
                    <textarea
                      id="experience"
                      name="experience"
                      rows={3}
                      maxLength={1000}
                      placeholder="Share any past referral, partnership, or sales experience."
                      value={form.experience}
                      onChange={(e) => set("experience", e.target.value)}
                      className={inputCls}
                    />
                  </Field>

                  <Field label="How did you hear about us?" htmlFor="hear_about">
                    <select
                      id="hear_about"
                      name="hear_about"
                      value={form.hear_about}
                      onChange={(e) => set("hear_about", e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select an option</option>
                      {HEAR_ABOUT_OPTIONS.map((o) => (
                        <option key={o} value={o} className="bg-[#0a0a0a]">
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>


                  <Field label="Message *" htmlFor="message">
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      maxLength={2000}
                      placeholder="Tell us about the clients you'd like to refer and how you plan to promote us."
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      className={inputCls}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-[0_10px_40px_-10px_var(--color-brand)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit affiliate enquiry"}
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <p className="text-center text-xs text-zinc-500">
                    By submitting, you agree to our{" "}
                    <Link to="/affiliate" className="underline-offset-4 hover:underline">
                      affiliate program terms
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-tighter text-zinc-400"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
