import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

/**
 * Curseur magnétique personnalisé — desktop uniquement (pointer: fine).
 *
 * Anneau extérieur  : spring lent → effet de traîne premium
 * Point intérieur   : spring serré → suit la souris quasi instantanément
 * mix-blend-mode: difference → inversion auto de couleur selon le fond
 *
 * Éléments interactifs :
 *   [data-cursor="magnetic"] → anneau 64px + point masqué (boutons principaux)
 *   <a>, <button>            → anneau 52px + point réduit
 */
export default function CustomCursor() {
  /* ── Positions brutes de la souris ── */
  const cx = useMotionValue(-140);
  const cy = useMotionValue(-140);

  /* ── Point (dot) — spring serré ── */
  const dx = useSpring(cx, { stiffness: 900, damping: 42, mass: 0.4 });
  const dy = useSpring(cy, { stiffness: 900, damping: 42, mass: 0.4 });

  /* ── Anneau (ring) — spring lâche → traîne visible ── */
  const rx = useSpring(cx, { stiffness: 140, damping: 18, mass: 0.9 });
  const ry = useSpring(cy, { stiffness: 140, damping: 18, mass: 0.9 });

  /* ── Taille de l'anneau et scale du point ── */
  const ringW    = useMotionValue(40);
  const ringH    = useMotionValue(40);
  const ringWS   = useSpring(ringW,  { stiffness: 320, damping: 26 });
  const ringHS   = useSpring(ringH,  { stiffness: 320, damping: 26 });
  const dotSc    = useMotionValue(1);
  const dotScS   = useSpring(dotSc,  { stiffness: 400, damping: 30 });

  /* État courant pour éviter les appels animate() inutiles */
  const state = useRef<"default" | "link" | "magnetic">("default");

  useEffect(() => {
    /* Ne rien faire sur les appareils tactiles */
    if (window.matchMedia("(pointer: coarse)").matches) return;

    /* ── Suivi de la position ── */
    const onMove = (e: MouseEvent) => {
      cx.set(e.clientX);
      cy.set(e.clientY);
    };

    /* ── Clic : compression de l'anneau ── */
    const onDown = () => {
      const compressed = state.current === "magnetic" ? 52 : 30;
      animate(ringW, compressed, { type: "spring", stiffness: 500, damping: 30 });
      animate(ringH, compressed, { type: "spring", stiffness: 500, damping: 30 });
      animate(dotSc, 0.55, { duration: 0.1 });
    };
    const onUp = () => {
      const size = state.current === "magnetic" ? 64 : state.current === "link" ? 52 : 40;
      animate(ringW, size, { type: "spring", stiffness: 400, damping: 26 });
      animate(ringH, size, { type: "spring", stiffness: 400, damping: 26 });
      animate(dotSc, state.current === "magnetic" ? 0 : 1, { duration: 0.12 });
    };

    /* ── Détection du type d'élément survolé ── */
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const next: typeof state.current = t.closest("[data-cursor='magnetic']")
        ? "magnetic"
        : t.closest("a, button, [role='button']")
        ? "link"
        : "default";

      if (next === state.current) return;
      state.current = next;

      if (next === "magnetic") {
        animate(ringW, 64, { type: "spring", stiffness: 280, damping: 22 });
        animate(ringH, 64, { type: "spring", stiffness: 280, damping: 22 });
        animate(dotSc, 0, { duration: 0.14 });
      } else if (next === "link") {
        animate(ringW, 52, { type: "spring", stiffness: 320, damping: 24 });
        animate(ringH, 52, { type: "spring", stiffness: 320, damping: 24 });
        animate(dotSc, 0.55, { duration: 0.14 });
      } else {
        animate(ringW, 40, { type: "spring", stiffness: 320, damping: 24 });
        animate(ringH, 40, { type: "spring", stiffness: 320, damping: 24 });
        animate(dotSc, 1,  { duration: 0.14 });
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup",   onUp);
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup",   onUp);
      document.removeEventListener("mouseover", onOver);
    };
  }, [cx, cy, ringW, ringH, dotSc]);

  return (
    <>
      {/* Anneau — mix-blend-difference → inversion auto selon le fond */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference will-change-transform rounded-full"
        style={{
          x: rx,
          y: ry,
          translateX: "-50%",
          translateY: "-50%",
          width:  ringWS,
          height: ringHS,
          border: "1.5px solid white",
        }}
      />

      {/* Point — serré, toujours devant */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference will-change-transform rounded-full bg-white"
        style={{
          x: dx,
          y: dy,
          scale: dotScS,
          translateX: "-50%",
          translateY: "-50%",
          width:  8,
          height: 8,
        }}
      />
    </>
  );
}
