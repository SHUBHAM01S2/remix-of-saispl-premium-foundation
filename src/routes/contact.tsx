import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Building2,
  User,
  AtSign,
  Smartphone,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Shivaryan Infotech" },
      {
        name: "description",
        content:
          "Get in touch with Shivaryan Infotech. Reach out for software development, AI automation, and digital transformation solutions.",
      },
      {
        property: "og:title",
        content: "Contact — Shivaryan Infotech",
      },
      {
        property: "og:description",
        content:
          "Get in touch with Shivaryan Infotech for enterprise software and AI solutions.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // No backend attached — just a UI feedback for now
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Get In <span className="text-brand">Touch</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Ready to build something exceptional? Share your vision and we will
            get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form + Details */}
      <section className="bg-background pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Left — Form */}
            <div className="rounded-2xl border border-border/50 bg-surface p-7 sm:p-9">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Send className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Message Sent!
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    Thank you for reaching out. We will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        message: "",
                      });
                    }}
                    className="mt-6 inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Phone
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 00000 00000"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label
                      htmlFor="company"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Company
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Your company name"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>

                  {/* Message */}
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
                      placeholder="Tell us about your project or inquiry..."
                      value={form.message}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-input bg-background p-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-1 focus:ring-brand resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground transition-all hover:bg-cta/90 hover:shadow-lg hover:shadow-cta/25"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </button>

                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/919418031050?text=Hi%20Shivaryan%20Infotech,%20I%20would%20like%20to%20discuss%20a%20project."
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

            {/* Right — Details + Map */}
            <div className="flex flex-col gap-8">
              {/* Contact Details */}
              <div className="rounded-2xl border border-border/50 bg-surface p-7 sm:p-9">
                <h3 className="text-lg font-semibold text-foreground">
                  Contact Details
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Prefer to reach out directly? Here is how you can find us.
                </p>

                <ul className="mt-6 space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Address
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Bilaspur, Himachal Pradesh, 174001
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Email
                      </p>
                      <a
                        href="mailto:Help@saispl.com"
                        className="mt-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Help@saispl.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Phone
                      </p>
                      <a
                        href="tel:+919418031050"
                        className="mt-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        +91 94180-31050
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map */}
              <div className="overflow-hidden rounded-2xl border border-border/50 bg-surface">
                <iframe
                  title="Shivaryan Infotech Office Location"
                  src="https://maps.google.com/maps?q=Shivaryan+Infotech,Bilaspur,Himachal+Pradesh,174001&hl=en&t=m&z=15&ie=UTF8&iwloc=B&output=embed"
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
                  <p className="text-sm font-medium text-foreground">
                    Shivaryan Infotech Office
                  </p>
                  <span className="ml-auto text-xs text-muted-foreground">
                    Bilaspur, HP 174001
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
