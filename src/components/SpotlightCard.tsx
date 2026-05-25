import { useRef, useCallback } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(196,144,62,0.12)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - left}px`);
    el.style.setProperty("--sy", `${e.clientY - top}px`);
  }, []);

  return (
    <div ref={ref} onMouseMove={onMouseMove} className={`relative ${className}`}>
      {/* Glow overlay — au-dessus du fond, sous le contenu */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at var(--sx, -999px) var(--sy, -999px), ${spotlightColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
