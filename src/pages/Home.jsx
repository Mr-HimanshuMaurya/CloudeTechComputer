import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowRight, ShieldCheck, Server, Headset } from "lucide-react";
import NetworkScene from "../three/NetworkScene";
import Reveal from "../components/Reveal";
import { Eyebrow, FadeShell } from "../components/PageShell";
import ServiceCard from "../components/ServiceCard";
import TeamCard from "../components/TeamCard";
import { company, stats, services, team } from "../data/content";

export default function Home() {
  const headlineRef = useRef(null);

  useEffect(() => {
    const words = headlineRef.current?.querySelectorAll(".word");
    if (!words) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      gsap.set(words, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      words,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.15,
      },
    );
  }, []);

  const headline = "Infrastructure that stays up while you build.";

  return (
    <FadeShell className="relative z-10">
      {/* ---------------- HERO ---------------- */}
      <section className="relative min-h-[92vh] flex items-center pt-24 overflow-hidden">
        <NetworkScene className="absolute inset-0 w-full h-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-base/20 via-transparent to-base pointer-events-none" />

        <div className="container-px relative w-full grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-9">
            <h1
              ref={headlineRef}
              className="font-display font-semibold text-[2.5rem] leading-[1.08] sm:text-6xl md:text-7xl tracking-tight text-text max-w-4xl"
            >
              {headline.split(" ").map((w, i) => (
                <span key={i} className="word inline-block mr-[0.28em]">
                  {w}
                </span>
              ))}
            </h1>

            <p className="mt-7 text-base md:text-lg text-muted max-w-xl leading-relaxed">
              {company.description}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <NavLink
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-signal text-base font-semibold text-sm hover:bg-white transition-colors"
              >
                Talk to our team
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </NavLink>
              <NavLink
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-line text-text font-semibold text-sm hover:border-signal/50 hover:text-signal transition-colors"
              >
                View services
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STATUS / STATS STRIP ---------------- */}
      <section className="border-y border-line bg-surface/60 relative">
        <div className="container-px py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-mono text-2xl md:text-3xl font-semibold text-signal glow-text">
                {s.value}
              </p>
              <p className="text-xs md:text-sm text-muted-2 mt-1.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- WHY US ---------------- */}
      <section className="py-24 md:py-32">
        <div className="container-px grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>Why CloudTech</Eyebrow>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-text leading-tight">
                One team behind everything that keeps your business online.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Server,
                title: "Full-stack ownership",
                body: "Hosting, servers, networks and the software on top — handled by one accountable team, not five vendors.",
              },
              {
                icon: ShieldCheck,
                title: "Security-first setup",
                body: "Firewalls, hardened servers and monitored access from day one, not bolted on after an incident.",
              },
              {
                icon: Headset,
                title: "Real response times",
                body: "A dedicated point of contact who picks up — average first response under 15 minutes.",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="card-border rounded-xl p-6 h-full">
                  <f.icon
                    size={20}
                    className="text-signal mb-4"
                    strokeWidth={1.75}
                  />
                  <h3 className="font-display font-semibold text-text mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES PREVIEW ---------------- */}
      <section className="py-24 md:py-32 border-t border-line bg-surface/40">
        <div className="container-px">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <Reveal>
              <Eyebrow>What we run</Eyebrow>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-text max-w-lg">
                Eleven services. One phone call.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <NavLink
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-signal hover:gap-3 transition-all"
              >
                See all services <ArrowRight size={15} />
              </NavLink>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.slice(0, 6).map((s, i) => (
              <Reveal key={s.code} delay={(i % 3) * 0.08}>
                <ServiceCard {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TEAM PREVIEW ---------------- */}
      <section className="py-24 md:py-32">
        <div className="container-px">
          <Reveal>
            <Eyebrow>The people behind it</Eyebrow>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text max-w-lg mb-14">
              A small team, deliberately.
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.slice(0, 3).map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <TeamCard {...m} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-10">
            <NavLink
              to="/team"
              className="inline-flex items-center gap-2 text-sm font-semibold text-signal hover:gap-3 transition-all"
            >
              Meet the full team <ArrowRight size={15} />
            </NavLink>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="py-24 border-t border-line">
        <div className="container-px">
          <Reveal className="card-border rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="relative">
              <h2 className="font-display text-3xl md:text-5xl font-semibold text-text max-w-2xl mx-auto leading-tight">
                Ready to stop managing servers yourself?
              </h2>
              <p className="text-muted mt-5 max-w-md mx-auto">
                Tell us what you're running today — we'll tell you exactly what
                it needs.
              </p>
              <NavLink
                to="/contact"
                className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-signal text-base font-semibold text-sm hover:bg-white transition-colors"
              >
                Get in touch <ArrowRight size={16} />
              </NavLink>
            </div>
          </Reveal>
        </div>
      </section>
    </FadeShell>
  );
}
