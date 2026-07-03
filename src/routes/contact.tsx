import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Building2,
  User,
  Smartphone,
  Clock,
} from "lucide-react";

import { ScrollReveal } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const OFFICE = {
  address: "Shivaryan Infotech, Bilaspur, Himachal Pradesh 174001",
  phone: "+91 94180-31050",
  phoneHref: "+919418031050",
  email: "Help@saispl.com",
  whatsapp:
    "https://web.whatsapp.com/send?phone=919418031050&text=Hi%20Shivaryan%20Infotech,%20I%20would%20like%20to%20discuss%20a%20project.",
};

export const Route = createFileRoute("/contact")({
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
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
        company: businessType || null,
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

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        </div>
        <ScrollReveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Let's <span className="text-brand">Talk</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Tell us a little about your business — website, portal, SEO or automation. We reply fast.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <Clock className="h-4 w-4" />
            We respond within 4 business hours.
          </div>
        </ScrollReveal>
      </section>

      {/* Form + Details */}
      <section className="bg-background pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Form */}
            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-border/50 bg-surface p-7 sm:p-9">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Send className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Message sent</h3>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                      We respond within 4 business hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-6 inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Field id="name" label="Name" icon={User}>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </Field>

                    <Field id="email" label="Email" icon={Mail}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </Field>



                    <Field id="phone" label="Phone" icon={Smartphone}>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+91 00000 00000"
                        value={form.phone}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </Field>

                    <Field id="businessType" label="Business Type" icon={Building2}>
                      <input
                        id="businessType"
                        name="businessType"
                        type="text"
                        placeholder="e.g. School, Hotel, Clinic, Real Estate"
                        value={form.businessType}
                        onChange={handleChange}
                        className={inputCls}
                      />
                    </Field>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us what you're looking to build or improve..."
                        value={form.message}
                        onChange={handleChange}
                        className="w-full resize-none rounded-xl border border-input bg-background p-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand"
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground transition-all hover:bg-cta/90 hover:shadow-lg hover:shadow-cta/25 disabled:opacity-60"
                      >
                        <Send className="h-4 w-4" />
                        {submitting ? "Sending..." : "Send Message"}
                      </button>

                      <a
                        href={OFFICE.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <MessageSquare className="h-4 w-4 text-green-400" />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Details + Map */}
            <div className="flex flex-col gap-8">
              <ScrollReveal delay={0.2}>
                <div className="rounded-2xl border border-border/50 bg-surface p-7 sm:p-9">
                  <h3 className="text-lg font-semibold text-foreground">Contact Details</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Prefer to reach us directly? Here's how.
                  </p>

                  <ul className="mt-6 space-y-5">
                    <Detail icon={MapPin} label="Office">
                      {OFFICE.address}
                    </Detail>
                    <Detail icon={Phone} label="Phone">
                      <a href={`tel:${OFFICE.phoneHref}`} className="hover:text-foreground">
                        {OFFICE.phone}
                      </a>
                    </Detail>
                    <Detail icon={Mail} label="Email">
                      <a href={`mailto:${OFFICE.email}`} className="hover:text-foreground">
                        {OFFICE.email}
                      </a>
                    </Detail>
                    <Detail icon={MessageSquare} label="WhatsApp">
                      <a
                        href={OFFICE.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                      >
                        Chat on WhatsApp
                      </a>
                    </Detail>
                    <Detail icon={Clock} label="Response Time">
                      We respond within 4 business hours.
                    </Detail>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-surface">
                  <iframe
                    title="Shivaryan Infotech Office — Nahan, HP"
                    src="https://maps.google.com/maps?q=Bilaspur,Himachal+Pradesh,174001&hl=en&t=m&z=14&ie=UTF8&iwloc=B&output=embed"
                    width="100%"
                    height="360"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block"
                  />
                  <div className="flex items-center gap-2 border-t border-border/50 bg-surface px-5 py-3">
                    <MapPin className="h-4 w-4 shrink-0 text-brand" />
                    <p className="text-sm font-medium text-foreground">Nahan Office</p>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Nahan, HP 173001
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand";

function Field({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}
