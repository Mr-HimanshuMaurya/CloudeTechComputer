import { PageShell, Eyebrow } from "../components/PageShell";
import Reveal from "../components/Reveal";
import ServiceCard from "../components/ServiceCard";
import { services } from "../data/content";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Services() {
  return (
    <PageShell>
      <section className="container-px">
        <Reveal>
          <Eyebrow>What we run</Eyebrow>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-text max-w-2xl leading-tight">
            Everything between your idea and it staying online.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted max-w-xl leading-relaxed">
            Eleven services, one accountable team. Pick one, or hand us the whole stack.
          </p>
        </Reveal>
      </section>

      <section className="container-px mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => (
          <Reveal key={s.code} delay={(i % 3) * 0.06}>
            <ServiceCard {...s} expanded />
          </Reveal>
        ))}
      </section>

      <section className="container-px mt-24">
        <Reveal className="card-border rounded-2xl p-10 md:p-14 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-text">
            Not sure which service fits?
          </h2>
          <p className="text-muted mt-3 max-w-md mx-auto">
            Tell us what's running today — we'll map out exactly what you need.
          </p>
          <NavLink
            to="/contact"
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-md bg-signal text-base font-semibold text-sm hover:bg-white transition-colors"
          >
            Start a conversation <ArrowRight size={16} />
          </NavLink>
        </Reveal>
      </section>
    </PageShell>
  );
}
