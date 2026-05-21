import type { Variants } from "framer-motion";

/* ── Entrées ───────────────────────────────────────────────────── */
export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const fadeInDown: Variants = {
  hidden:  { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const fadeInScale: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const fadeInLeft: Variants = {
  hidden:  { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 22, stiffness: 180 },
  },
};

export const fadeInRight: Variants = {
  hidden:  { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 22, stiffness: 180 },
  },
};

/* Spring — plus vivant que ease sur les cartes */
export const springUp: Variants = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 20, stiffness: 200 },
  },
};

/* ── Stagger containers ────────────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const staggerFast: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

export const staggerSlow: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.16 } },
};

/** Alias */
export const stagger = staggerContainer;

/* ── Hover / Tap interactions ──────────────────────────────────── */
export const cardHoverProps = {
  whileHover: { y: -6, scale: 1.02 },
  whileTap:   { scale: 0.98 },
  transition: { type: "spring", stiffness: 350, damping: 22 },
};

export const liftHoverProps = {
  whileHover: { y: -4 },
  transition: { type: "spring", stiffness: 400, damping: 24 },
};

export const iconSpinProps = {
  animate:    { rotate: 360 },
  transition: { duration: 8, repeat: Infinity, ease: "linear" as const },
};

export const pulseDot = {
  animate:    { scale: [1, 1.25, 1], opacity: [1, 0.6, 1] },
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
};

/* Flottement doux — pour éléments décoratifs */
export const floatAnim = {
  animate: { y: [0, -8, 0] },
  transition: {
    duration: 3.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

/* ── Shared IntersectionObserver config ────────────────────────── */
export const VP  = { once: true, margin: "-80px"  } as const;
export const VP2 = { once: true, margin: "-40px"  } as const;
