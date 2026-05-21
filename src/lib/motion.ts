import type { Variants } from "framer-motion";

/* ── Entrées classiques ─────────────────────────────────────────── */
export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

export const fadeInDown: Variants = {
  hidden:  { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export const fadeInScale: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export const fadeInLeft: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", damping: 22, stiffness: 180 } },
};

export const fadeInRight: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", damping: 22, stiffness: 180 } },
};

/* Blur + slide — effet très "Apple" */
export const blurInUp: Variants = {
  hidden:  { opacity: 0, y: 32, filter: "blur(12px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const blurIn: Variants = {
  hidden:  { opacity: 0, filter: "blur(16px)", scale: 0.97 },
  visible: {
    opacity: 1, filter: "blur(0px)", scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* Spring — plus vivant que ease */
export const springUp: Variants = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 20, stiffness: 200 } },
};

export const springLeft: Variants = {
  hidden:  { opacity: 0, x: -50, scale: 0.97 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 22, stiffness: 180 } },
};

export const springRight: Variants = {
  hidden:  { opacity: 0, x: 50, scale: 0.97 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 22, stiffness: 180 } },
};

/* Rotation légère à l'entrée */
export const rotateIn: Variants = {
  hidden:  { opacity: 0, rotate: -6, scale: 0.95 },
  visible: { opacity: 1, rotate: 0, scale: 1, transition: { type: "spring", damping: 18, stiffness: 160 } },
};

/* ── Stagger containers ─────────────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const staggerFast: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export const staggerSlow: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

export const stagger = staggerContainer;

/* ── Hover / Tap props ──────────────────────────────────────────── */
export const cardHoverProps = {
  whileHover: { y: -8, scale: 1.025, transition: { type: "spring" as const, stiffness: 350, damping: 22 } },
  whileTap:   { scale: 0.97 },
} as const;

export const liftHoverProps = {
  whileHover: { y: -4, transition: { type: "spring" as const, stiffness: 400, damping: 24 } },
} as const;

export const btnHoverProps = {
  whileHover: { scale: 1.06, transition: { type: "spring" as const, stiffness: 450, damping: 20 } },
  whileTap:   { scale: 0.96 },
} as const;

/* Icon wobble on hover */
export const iconWobble = {
  whileHover: { rotate: [0, -12, 12, -6, 0], transition: { duration: 0.5 } },
};

/* ── Animations en boucle ───────────────────────────────────────── */
export const iconSpinProps = {
  animate:    { rotate: 360 },
  transition: { duration: 8, repeat: Infinity, ease: "linear" as const },
};

export const pulseDot = {
  animate:    { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] },
  transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
};

export const floatAnim = {
  animate:    { y: [0, -10, 0] },
  transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
};

export const breathe = {
  animate:    { scale: [1, 1.04, 1] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
};

/* ── Helpers IntersectionObserver ───────────────────────────────── */
export const VP  = { once: true, margin: "-80px"  } as const;
export const VP2 = { once: true, margin: "-40px"  } as const;
export const VP3 = { once: true, margin: "-120px" } as const;
