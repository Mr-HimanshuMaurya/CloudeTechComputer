import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHero, setIsHero] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReduced) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.85, duration: 0.1, ease: "power2.out" });
      gsap.to(follower, { scale: 1.3, duration: 0.15, ease: "power2.out" });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
      gsap.to(follower, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    function lerp() {
      const cursorEl = cursorRef.current;
      const followerEl = followerRef.current;
      if (!cursorEl || !followerEl) return;

      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.18;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.18;

      cursorEl.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%) scale(${isHovering ? 1.4 : 1})`;
      followerEl.style.transform = `translate(${followerPos.current.x}px, ${followerPos.current.y}px) translate(-50%, -50%) scale(${isHovering ? 0 : 1})`;

      requestAnimationFrame(lerp);
    }
    lerp();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isHovering, isHero]);

  useEffect(() => {
    if (prefersReduced) return;

    const handleHover = (e) => {
      const target = e.target.closest("a, button, [role=button], .cursor-hover, .service-card, .team-card");
      if (target) {
        setIsHovering(true);
        setIsClickable(target.matches("a, button, [role=button]"));
      }
    };

    const handleLeave = (e) => {
      const target = e.target.closest("a, button, [role=button], .cursor-hover, .service-card, .team-card");
      if (target) {
        setIsHovering(false);
        setIsClickable(false);
      }
    };

    document.addEventListener("mouseover", handleHover);
    document.addEventListener("mouseout", handleLeave);

    return () => {
      document.removeEventListener("mouseover", handleHover);
      document.removeEventListener("mouseout", handleLeave);
    };
  }, []);

  if (prefersReduced) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-200"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: "translate(-50%, -50%)",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "var(--color-signal)",
          boxShadow: "0 0 8px var(--color-signal), 0 0 16px var(--color-signal)",
          mixBlendMode: "screen",
        }}
        aria-hidden="true"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-opacity duration-300"
        style={{
          opacity: isVisible ? 0.35 : 0,
          transform: "translate(-50%, -50%)",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1.5px solid var(--color-signal)",
          background: "transparent",
          mixBlendMode: "screen",
        }}
        aria-hidden="true"
      />
    </>
  );
}