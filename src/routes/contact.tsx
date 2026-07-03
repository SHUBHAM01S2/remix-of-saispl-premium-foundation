import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { toast } from "sonner";
import {
  MapPin,
  Mail,
  MessageSquare,
  Send,
  ArrowRight,
  Clock,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

const contactSearchSchema = z.object({
  service: fallback(z.string().max(100), "").default(""),
  subject: fallback(z.string().max(200), "").default(""),
});


const OFFICE = {
  address: "Shivaryan Infotech, Bilaspur, Himachal Pradesh 174001, India",
  phone: "+91 94180-31050",
  phoneHref: "+919418031050",
  email: "shubhamshar98050@gmail.com",
  whatsapp:
    "https://web.whatsapp.com/send?phone=919418031050&text=Hi%20Shivaryan%20Infotech,%20I%20would%20like%20to%20discuss%20a%20project.",
};

export const Route = createFileRoute("/contact")({
  validateSearch: zodValidator(contactSearchSchema),
  head: () => ({
    meta: [
      { title: "Contact Shivaryan Infotech — Bilaspur, Himachal Pradesh" },
      {
        name: "description",
        content:
          "Contact Shivaryan Infotech in Bilaspur, Himachal Pradesh for web design, custom software, SEO and WhatsApp automation. We respond within 4 business hours.",
      },
      { property: "og:title", content: "Contact Shivaryan Infotech — Bilaspur, HP" },
      {
        property: "og:description",
        content:
          "Talk to our team in Bilaspur, HP about your website, portal or automation project. We respond within 4 business hours.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact Shivaryan Infotech — Bilaspur, HP" },
      {
        name: "twitter:description",
        content: "Reach our team in Bilaspur, Himachal Pradesh. We respond within 4 business hours.",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const { service, subject } = Route.useSearch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: service ?? "",
    message: subject ? `Regarding: ${subject}\n\n` : "",
  });


  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const businessType = form.businessType.trim();
    const message = form.message.trim();

    if (!name || !phone || !message) {
      toast.error("Please share your name, phone and a short message.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (
      name.length > 100 ||
      email.length > 255 ||
      phone.length > 30 ||
      businessType.length > 100 ||
      message.length > 2000
    ) {
      toast.error("One of your fields is too long. Please shorten it.");
      return;
    }

    setSubmitting(true);
    const { error } = await (supabase as any)
      .from("contact_submissions")
      .insert({
        name,
        email: email || null,
        phone,
        business_type: businessType || null,
        message,
      });
    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.success("Thanks! We respond within 4 business hours.");
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", businessType: "", message: "" });
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/40";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-zinc-200 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Orbs & Grid */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20 md:px-12 md:py-28">
        <div className="grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Editorial content */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>
                Available for new projects
              </div>
              <h1
                className="text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl"
                style={{ fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif" }}
              >
                Let's build the{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  intelligent
                </span>{" "}
                future.
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-zinc-400">
                Partner with our studio to ship modern websites, portals, and
                AI automation. Tell us about your project — we respond within
                4 business hours.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Office
                </h3>
                <p className="leading-relaxed text-zinc-300">
                  Bilaspur, Himachal Pradesh 174001,
                  <br />
                  India
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Direct Connect
                </h3>
                <div className="flex flex-col space-y-2">
                  <a
                    href={OFFICE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-zinc-300 transition-colors hover:text-blue-400"
                  >
                    <span>{OFFICE.phone}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${OFFICE.email}`}
                    target="_self"
                    rel="noopener"
                    className="relative z-10 inline-block cursor-pointer text-zinc-300 transition-colors [pointer-events:auto] hover:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.location.href = `mailto:${OFFICE.email}`;
                    }}
                  >
                    {OFFICE.email}
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Response
                </h3>
                <p className="flex items-center gap-2 text-zinc-300">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Within 4 business hours
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Prefer chat
                </h3>
                <a
                  href={OFFICE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-zinc-300 transition-colors hover:text-blue-400"
                >
                  <MessageSquare className="h-4 w-4 text-green-400" />
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>

          {/* Right: Glassmorphism Form */}
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 opacity-20 blur" />
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-400">
                    <Send className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Message sent
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-zinc-400">
                    We respond within 4 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-xs font-medium uppercase tracking-tighter text-zinc-400"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-xs font-medium uppercase tracking-tighter text-zinc-400"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-xs font-medium uppercase tracking-tighter text-zinc-400"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 00000-00000"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="businessType"
                      className="text-xs font-medium uppercase tracking-tighter text-zinc-400"
                    >
                      Business Type
                    </label>
                    <input
                      id="businessType"
                      name="businessType"
                      type="text"
                      placeholder="School, Hotel, Clinic, Real Estate..."
                      value={form.businessType}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-xs font-medium uppercase tracking-tighter text-zinc-400"
                    >
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us about your automation goals..."
                      value={form.message}
                      onChange={handleChange}
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative w-full overflow-hidden rounded-xl bg-white px-6 py-4 font-bold text-black transition-all hover:bg-zinc-200 disabled:opacity-60"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <span>{submitting ? "Sending..." : "Send Message"}</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>

                  <p className="pt-2 text-center text-[10px] uppercase tracking-widest text-zinc-500">
                    Expected response time: &lt; 4 business hours
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:px-12 md:pb-28">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <iframe
            title="Shivaryan Infotech Office — Bilaspur, HP"
            src="https://maps.google.com/maps?q=Bilaspur,Himachal+Pradesh,174001&hl=en&t=m&z=14&ie=UTF8&iwloc=B&output=embed"
            width="100%"
            height="360"
            style={{ border: 0, filter: "grayscale(0.6) invert(0.9) hue-rotate(180deg)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block"
          />
          <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3">
            <MapPin className="h-4 w-4 shrink-0 text-blue-400" />
            <p className="text-sm font-medium text-white">Bilaspur Office</p>
            <span className="ml-auto text-xs text-zinc-500">
              Bilaspur, Himachal Pradesh 174001, India
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
