import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export function useScrollReveal(threshold = 0.2) {
  const { ref, inView } = useInView({ threshold, triggerOnce: true });
  return { ref, inView };
}

export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const rect = el.getBoundingClientRect();
      const offsetTop = rect.top + scrolled;
      const relativeScroll = scrolled - offsetTop;
      el.style.transform = `translateY(${relativeScroll * speed}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
}

export function useMagneticEffect(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = "transform 0.1s ease";
    };

    const handleMouseLeave = () => {
      el.style.transform = "translate(0, 0)";
      el.style.transition = "transform 0.4s ease";
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return ref;
}

export function useCursorGlow() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "cursor-glow";
    cursor.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 20px; height: 20px; border-radius: 50%;
      background: radial-gradient(circle, rgba(26,154,166,0.6) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s, opacity 0.3s;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(cursor);

    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cursor.remove();
    };
  }, []);
}
