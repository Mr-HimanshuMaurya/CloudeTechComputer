import { useState } from "react";
import { PageShell, Eyebrow } from "../components/PageShell";
import Reveal from "../components/Reveal";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { company, services } from "../data/content";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageShell>
      <section className="container-px">
        <Reveal>
          <Eyebrow>Get in touch</Eyebrow>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-text max-w-2xl leading-tight">
            Let's talk about what you're running.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted max-w-xl leading-relaxed">
            Share a few details and we'll get back to you — usually within a working day.
          </p>
        </Reveal>
      </section>

      <section className="container-px mt-16 grid lg:grid-cols-12 gap-10">
        <Reveal className="lg:col-span-4 space-y-5" y={20}>
          <div className="card-border rounded-xl p-6 flex items-start gap-4">
            <Mail size={19} className="text-signal shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text">Email</p>
              <p className="text-sm text-muted mt-1">{company.email}</p>
            </div>
          </div>
          <div className="card-border rounded-xl p-6 flex items-start gap-4">
            <Phone size={19} className="text-signal shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text">Phone</p>
              <p className="text-sm text-muted mt-1">{company.phone}</p>
            </div>
          </div>
          <div className="card-border rounded-xl p-6 flex items-start gap-4">
            <MapPin size={19} className="text-signal shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text">Based in</p>
              <p className="text-sm text-muted mt-1">{company.location} — remote support nationwide</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-8" delay={0.1} y={20}>
          <div className="card-border rounded-2xl p-6 md:p-10">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-14">
                <CheckCircle2 size={40} className="text-signal mb-5" />
                <h2 className="font-display text-2xl font-semibold text-text">Message sent</h2>
                <p className="text-muted mt-2 max-w-sm">
                  Thanks, {form.name.split(" ")[0] || "there"} — someone from our team will reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Full name">
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Umesh Yadav"
                      className="input"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="input"
                    />
                  </Field>
                </div>

                <Field label="Which service do you need?">
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s.code} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Tell us about your setup">
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="What are you running today, and what's not working?"
                    className="input resize-none"
                  />
                </Field>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-signal text-base font-semibold text-sm hover:bg-white transition-colors"
                >
                  Send message <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-mono uppercase tracking-wider text-muted-2 mb-2 block">
        {label}
      </span>
      {children}
    </label>
  );
}
