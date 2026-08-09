import { PageShell, Eyebrow } from "../components/PageShell";
import Reveal from "../components/Reveal";
import { Target, Users, Clock } from "lucide-react";
import { company, stats } from "../data/content";

export default function About() {
  return (
    <PageShell>
      <section className="container-px">
        <Reveal>
          <Eyebrow>About us</Eyebrow>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-text max-w-3xl leading-tight">
            We started CloudTech because IT support shouldn't feel like a black box.
          </h1>
          <p className="mt-7 text-base md:text-lg text-muted max-w-2xl leading-relaxed">
            {company.description} Most businesses end up juggling a web developer, a
            hosting provider, a networking vendor and a security consultant — none of
            whom talk to each other. We built CloudTech to be all four, under one
            roof, with one number to call.
          </p>
        </Reveal>
      </section>

      <section className="container-px mt-24 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Target,
            title: "Our approach",
            body: "We design infrastructure around how your business actually operates, not a one-size template. Every setup starts with an honest audit of what you have.",
          },
          {
            icon: Users,
            title: "Who we work with",
            body: "Small and mid-sized businesses that need enterprise-grade reliability without an in-house IT department to run it.",
          },
          {
            icon: Clock,
            title: "How we work",
            body: "Direct access to the engineer handling your account — not a ticket queue. Most issues get a real response in under 15 minutes.",
          },
        ].map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08}>
            <div className="card-border rounded-xl p-7 h-full">
              <f.icon size={20} className="text-signal mb-4" strokeWidth={1.75} />
              <h3 className="font-display font-semibold text-text mb-2.5">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="container-px mt-24 border-y border-line py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <Reveal key={s.label}>
              <p className="font-mono text-3xl font-semibold text-signal glow-text">{s.value}</p>
              <p className="text-sm text-muted-2 mt-1.5">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-px mt-24">
        <Reveal>
          <Eyebrow>Our principle</Eyebrow>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-text max-w-2xl leading-tight">
            "If it's not documented and monitored, it's not actually managed."
          </h2>
          <p className="mt-5 text-muted max-w-xl leading-relaxed">
            Every server we touch gets documented configuration, scheduled backups
            and active monitoring — before we consider the job done, not after
            something breaks.
          </p>
        </Reveal>
      </section>
    </PageShell>
  );
}
