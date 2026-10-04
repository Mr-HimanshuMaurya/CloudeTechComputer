import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Cpu } from "lucide-react";

const LOGO_CHARS = "CLOUD TECH".split("");

export default function Loader({ onComplete }) {
  const progressRef = useRef(0);
  const loaderRef = useRef(null);
  const counterRef = useRef(null);
  const logoCharsRef = useRef([]);
  const lineRef = useRef(null);
  const [showLoader, setShowLoader] = useState(true);
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("cloudtech_loaded");
    if (hasVisited || prefersReduced) {
      setShowLoader(false);
      if (onComplete) onComplete();
      return;
    }

    const root = loaderRef.current;
    if (!root) return;

    document.body.style.overflow = "hidden";

    const charSpans = root.querySelectorAll(".logo-char");
    logoCharsRef.current = Array.from(charSpans);

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("cloudtech_loaded", "true");
        document.body.style.overflow = "";
        if (onComplete) onComplete();
      },
    });

    const simulateProgress = () => {
      const duration = 2.0 + Math.random() * 0.4;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = (now - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);
        progressRef.current = eased * 100;

        if (counterRef.current) {
          counterRef.current.textContent = Math.round(eased * 100)
            .toString()
            .padStart(3, "0");
        }
        if (lineRef.current) {
          lineRef.current.style.width = `${eased * 100}%`;
        }

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    };

    simulateProgress();

    tl.set(root, { opacity: 1 })
      .fromTo(
        logoCharsRef.current,
        { opacity: 0, y: "100%", rotateX: -90 },
        {
          opacity: 1,
          y: "0%",
          rotateX: 0,
          duration: 1.1,
          stagger: 0.045,
          ease: "expo.out",
        },
        0.15
      )
      .fromTo(
        ".loader-tagline",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        0.4
      )
      .fromTo(
        ".progress-track",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.6, ease: "power2.inOut" },
        0.5
      )
      .to(
        ".progress-fill",
        { width: "100%", duration: 1.6, ease: "power2.inOut" },
        0.5
      )
      .to(
        ".loader-counter",
        { opacity: 0, y: -10, duration: 0.4, ease: "power2.in" },
        1.8
      )
      .to(
        ".logo-row",
        { opacity: 0, y: -30, duration: 0.5, ease: "expo.in" },
        2.1
      )
      .to(
        ".loader-tagline",
        { opacity: 0, y: -20, duration: 0.4, ease: "expo.in" },
        2.15
      )
      .to(
        ".progress-track",
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        2.2
      )
      .set(".reveal-curtain", { display: "block" })
      .fromTo(
        ".reveal-curtain",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.1,
          ease: "expo.inOut",
        },
        2.3
      )
      .to(
        ".reveal-curtain",
        { clipPath: "inset(0 0% 0 100%)", duration: 0.7, ease: "expo.inOut" },
        3.3
      )
      .set(root, { display: "none" });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (!showLoader) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base"
      role="status"
      aria-label="Loading Cloud Tech Computer"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="logo-row flex items-center gap-2">
          <span className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-surface border border-line">
            <Cpu size={22} className="text-signal" strokeWidth={1.75} />
          </span>
          <span className="font-display font-semibold text-2xl md:text-4xl tracking-tight text-text">
            {LOGO_CHARS.map((c, i) => (
              <span
                key={i}
                className="logo-char inline-block opacity-0"
                style={{ display: "inline-block" }}
              >
                {c === " " ? "\u00A0" : c}
              </span>
            ))}
          </span>
        </div>

        <p className="loader-tagline mono-label text-signal/70 opacity-0">
          Infrastructure that stays up while you build.
        </p>

        <div className="relative w-full max-w-md mt-8">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="font-mono text-xs text-muted-2">Loading assets</span>
            <span
              ref={counterRef}
              className="loader-counter font-mono text-xl font-semibold text-signal tabular-nums"
            >
              000
            </span>
          </div>
          <div className="progress-track h-1 bg-surface-2 rounded-full overflow-hidden">
            <div
              ref={lineRef}
              className="progress-fill h-full bg-signal rounded-full relative"
              style={{ width: "0%", boxShadow: "0 0 12px #00D9C0, 0 0 24px #00D9C0" }}
            />
          </div>
        </div>
      </div>

      <div
        className="reveal-curtain fixed inset-0 bg-base z-10 pointer-events-none"
        style={{ display: "none", clipPath: "inset(0 100% 0 0)" }}
        aria-hidden="true"
      />
    </div>
  );
}