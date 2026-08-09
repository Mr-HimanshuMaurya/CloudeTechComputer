import { PageShell, Eyebrow } from "../components/PageShell";
import Reveal from "../components/Reveal";
import TeamCard from "../components/TeamCard";
import { team } from "../data/content";

export default function Team() {
  return (
    <PageShell>
      <section className="container-px">
        <Reveal>
          <Eyebrow>The people</Eyebrow>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-text max-w-2xl leading-tight">
            Five people, no middle management.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted max-w-xl leading-relaxed">
            When you call CloudTech, you reach the person who actually does the work —
            not a support rep reading from a script.
          </p>
        </Reveal>
      </section>

      <section className="container-px mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((m, i) => (
          <Reveal key={m.name} delay={(i % 3) * 0.07}>
            <TeamCard {...m} />
          </Reveal>
        ))}
      </section>
    </PageShell>
  );
}
