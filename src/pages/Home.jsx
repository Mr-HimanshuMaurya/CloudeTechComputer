import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ShieldCheck, Server, Headset, Monitor, HardDrive, Lock, Globe, Zap, Users, ChevronRight } from "lucide-react";
import HeroScene from "../three/HeroScene";
import Reveal from "../components/Reveal";
import { Eyebrow, FadeShell } from "../components/PageShell";
import ServiceCard from "../components/ServiceCard";
import TeamCard from "../components/TeamCard";
import Loader from "../components/Loader";
import { company, stats, services, team } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const statsRef = useRef(null);
  const whyUsRef = useRef(null);
  const servicesRef = useRef(null);
  const teamRef = useRef(null);
  const ctaRef = useRef(null);
  const servicesTrackRef = useRef(null);

  // Initialize ScrollTriggers after loader completes
  useEffect(() => {
    if (!loaderDone) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Hero headline reveal
    const headlineWords = headlineRef.current?.querySelectorAll(".word");
    if (headlineWords && !prefersReduced) {
      gsap.fromTo(
        headlineWords,
        { opacity: 0, y: 30, rotateX: -15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.055,
          ease: "expo.out",
          delay: 0.2,
        }
      );
    } else if (headlineWords) {
      gsap.set(headlineWords, { opacity: 1, y: 0, rotateX: 0 });
    }

    // Hero description reveal
    gsap.fromTo(
      ".hero-description",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.5,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          toggleActions: "play none none none",
        },
      }
    );

    // Hero CTAs reveal
    gsap.fromTo(
      ".hero-cta",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.7,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          toggleActions: "play none none none",
        },
      }
    );

    // Stats counter animation
    const statNumbers = statsRef.current?.querySelectorAll(".stat-number");
    if (statNumbers && !prefersReduced) {
      statNumbers.forEach((el, i) => {
        const target = parseFloat(el.dataset.value);
        const suffix = el.dataset.suffix || "";
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = obj.val.toFixed(target % 1 === 0 ? 0 : 1) + suffix;
          },
        });
      });
    }

    // Stats cards stagger
    gsap.fromTo(
      ".stat-card",
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // Why Us section - staggered grid
    gsap.fromTo(
      ".why-us-card",
      { opacity: 0, y: 40, rotateY: 8 },
      {
        opacity: 1,
        y: 0,
        rotateY: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: whyUsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Why Us header
    gsap.fromTo(
      ".why-us-header > *",
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: whyUsRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // Services preview - horizontal scroll jacking
    const servicesTrack = servicesTrackRef.current;
    const serviceCards = servicesRef.current?.querySelectorAll(".service-card");
    if (servicesTrack && serviceCards && serviceCards.length > 0 && !prefersReduced) {
      const trackWidth = servicesTrack.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      // Create the horizontal scroll tween
      const horizontalTween = gsap.to(servicesTrack, {
        x: () => -(trackWidth - viewportWidth) * 0.8,
        ease: "none",
      });
      
      // Create ScrollTrigger with the animation
      const horizontalST = ScrollTrigger.create({
        trigger: servicesRef.current,
        start: "top top",
        end: () => `+=${trackWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        animation: horizontalTween,
      });

      // Card scale/opacity as they enter center
      serviceCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0.4, scale: 0.9, filter: "blur(4px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left 70%",
              end: "left 30%",
              scrub: 0.5,
            },
          }
        );
      });
    } else if (serviceCards) {
      // Fallback for reduced motion or no horizontal scroll
      gsap.fromTo(
        serviceCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Services header
    gsap.fromTo(
      ".services-header > *",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // Team preview - staggered with parallax
    gsap.fromTo(
      ".team-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: teamRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Team header
    gsap.fromTo(
      ".team-header > *",
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: teamRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    // CTA section - expanding reveal
    gsap.fromTo(
      ".cta-content > *",
      { opacity: 0, y: 30, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    // CTA background glow pulse
    gsap.to(".cta-glow", {
      opacity: 0.6,
      scale: 1.1,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play pause resume pause",
      },
    });

    // Refresh ScrollTrigger after all animations are set up
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [loaderDone]);

  const headline = "Infrastructure that stays up while you build.";

  return (
    <>
      <Loader onComplete={() => setLoaderDone(true)} />
      
      {loaderDone && (
        <FadeShell className="relative z-10">
          {/* ---------------- HERO ---------------- */}
          <section
            ref={heroRef}
            className="relative min-h-screen flex items-center pt-24"
            style={{ height: "200vh" }}
          >
            {/* Three.js Hero Scene - full viewport background */}
            <div className="fixed inset-0 -z-10 w-full h-[200vh] pointer-events-none" style={{ top: 0, left: 0 }}>
              <HeroScene className="w-full h-full" />
              {/* Subtle gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-base/40 via-base/20 to-base/90 pointer-events-none" />
            </div>

            <div className="container-px relative w-full grid lg:grid-cols-12 gap-8 items-start pt-20 pb-32">
              <div className="lg:col-span-8 lg:col-start-2">
                <h1
                  ref={headlineRef}
                  className="font-display font-semibold text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-text max-w-4xl"
                >
                  {headline.split(" ").map((w, i) => (
                    <span key={i} className="word inline-block mr-[0.25em]">
                      {w}
                    </span>
                  ))}
                </h1>

                <p className="hero-description mt-8 text-base md:text-lg lg:text-xl text-muted max-w-2xl leading-relaxed">
                  {company.description}
                </p>

                <div className="hero-cta mt-12 flex flex-wrap items-center gap-4">
                  <NavLink
                    to="/contact"
                    className="group inline-flex items-center gap-2 px-7 py-4 rounded-md bg-signal text-base font-semibold text-sm hover:bg-white transition-colors cursor-none"
                  >
                    Talk to our team
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </NavLink>
                  <NavLink
                    to="/services"
                    className="hero-cta inline-flex items-center gap-2 px-7 py-4 rounded-md border border-line text-text font-semibold text-sm hover:border-signal/50 hover:text-signal transition-colors cursor-none"
                  >
                    View services
                    <ArrowRight size={16} />
                  </NavLink>
                </div>

                {/* Scroll indicator */}
                <div className="hero-cta mt-16 flex items-center gap-3 text-sm text-muted-2 opacity-60">
                  <svg width="20" height="32" viewBox="0 0 20 32" fill="none" className="animate-bounce">
                    <rect x="9" y="0" width="2" height="32" rx="1" fill="currentColor" opacity="0.3" />
                    <path d="M10 28V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4 16L10 22L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="mono-label">Scroll to explore</span>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- STATUS / STATS STRIP ---------------- */}
          <section
            ref={statsRef}
            className="border-y border-line bg-surface/60 relative"
          >
            <div className="container-px py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="stat-card relative text-center group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-signal/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <p
                      className="stat-number font-mono text-3xl md:text-4xl lg:text-5xl font-semibold text-signal glow-text relative"
                      data-value={parseFloat(s.value.replace(/[^\d.]/g, ""))}
                      data-suffix={s.value.replace(/[\d.]/g, "")}
                    >
                      {s.value}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm text-muted-2 mt-3 mono-label tracking-wider">
                    {s.label}
                  </p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-signal group-hover:w-3/4 transition-all duration-500" />
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- WHY US ---------------- */}
          <section
            ref={whyUsRef}
            className="py-24 md:py-32 relative"
          >
            <div className="container-px grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 why-us-header">
                <Reveal>
                  <Eyebrow>Why CloudTech</Eyebrow>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text leading-tight">
                    One team behind everything that keeps your business online.
                  </h2>
                </Reveal>
                <Reveal delay={0.2} className="mt-6">
                  <p className="text-muted leading-relaxed max-w-xs">
                    We don't just manage servers. We own the outcome — from the rack to the application layer, with a single point of accountability.
                  </p>
                </Reveal>
              </div>
              <div className="lg:col-span-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {
                    icon: Monitor,
                    title: "Proactive monitoring",
                    body: "We catch issues before they become incidents — 24/7 observability with intelligent alerting.",
                  },
                  {
                    icon: HardDrive,
                    title: "Backup & disaster recovery",
                    body: "Automated, tested backups with RPO/RTO targets defined per workload — not hoped for.",
                  },
                  {
                    icon: Lock,
                    title: "Compliance ready",
                    body: "Audit-ready configurations, encrypted data paths, and documented controls for regulated industries.",
                  },
                ].map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.07} className="why-us-card">
                    <div className="card-border rounded-xl p-6 h-full transition-all duration-500 hover:border-signal/30 hover:shadow-[0_0_40px_rgba(0,217,192,0.08)] group">
                      <div className="relative mb-4">
                        <f.icon
                          size={22}
                          className="text-signal"
                          strokeWidth={1.75}
                        />
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-signal/30 group-hover:scale-150 transition-transform duration-500" />
                      </div>
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

          {/* ---------------- SERVICES PREVIEW - Horizontal Scroll ---------------- */}
          <section
            ref={servicesRef}
            className="relative border-t border-line bg-surface/40"
          >
            <div className="container-px py-16 services-header">
              <Reveal>
                <Eyebrow>What we run</Eyebrow>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text max-w-lg mt-2">
                  Eleven services. One phone call.
                </h2>
              </Reveal>
            </div>

            <div className="relative overflow-hidden">
              <div
                ref={servicesTrackRef}
                className="services-track flex gap-6 pb-8"
                style={{ width: "max-content" }}
              >
                {services.map((s, i) => (
                  <Reveal key={s.code} delay={0} className="service-card flex-shrink-0 w-[320px] sm:w-[360px]">
                    <ServiceCard {...s} />
                  </Reveal>
                ))}
              </div>
              
              {/* Gradient fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface/40 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface/40 to-transparent pointer-events-none" />
            </div>
          </section>

          {/* ---------------- TEAM PREVIEW ---------------- */}
          <section
            ref={teamRef}
            className="py-24 md:py-32 relative"
          >
            <div className="container-px">
              <div className="team-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                <div>
                  <Reveal>
                    <Eyebrow>The people behind it</Eyebrow>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-text max-w-lg mt-2">
                      A small team, deliberately.
                    </h2>
                  </Reveal>
                </div>
                <Reveal delay={0.2} className="mt-6 md:mt-0">
                  <NavLink
                    to="/team"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-signal hover:gap-3 transition-all cursor-none"
                  >
                    Meet the full team
                    <ChevronRight size={15} />
                  </NavLink>
                </Reveal>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.slice(0, 6).map((m, i) => (
                  <Reveal key={m.name} delay={i * 0.08} className="team-card">
                    <TeamCard {...m} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- CTA ---------------- */}
          <section
            ref={ctaRef}
            className="py-24 md:py-32 border-t border-line relative overflow-hidden"
          >
            <div className="absolute inset-0 cta-glow" style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(0,217,192,0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
              transformOrigin: 'center',
            }} />
            
            <div className="container-px relative">
              <Reveal className="cta-content card-border rounded-2xl p-10 md:p-16 lg:p-20 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold text-text max-w-3xl mx-auto leading-tight">
                    Ready to stop managing servers yourself?
                  </h2>
                  <p className="text-muted mt-6 max-w-md mx-auto text-lg leading-relaxed">
                    Tell us what you're running today — we'll tell you exactly what it needs.
                  </p>
                  <NavLink
                    to="/contact"
                    className="mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-md bg-signal text-base font-semibold text-sm hover:bg-white transition-colors cursor-none"
                  >
                    Get in touch
                    <ArrowRight size={18} />
                  </NavLink>
                </div>
                
                {/* Decorative circuit lines */}
                <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden="true">
                  <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00D9C0" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#7C6FFF" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <path d="M50,200 Q200,100 400,200 Q600,300 750,200" stroke="url(#circuitGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <path d="M50,280 Q200,380 400,280 Q600,180 750,280" stroke="url(#circuitGrad)" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
                    <circle cx="400" cy="200" r="60" fill="none" stroke="url(#circuitGrad)" strokeWidth="1" opacity="0.3" />
                    <circle cx="400" cy="200" r="100" fill="none" stroke="url(#circuitGrad)" strokeWidth="0.5" opacity="0.2" strokeDasharray="8,4" />
                  </svg>
                </div>
              </Reveal>
            </div>
          </section>
        </FadeShell>
      )}
    </>
  );
}