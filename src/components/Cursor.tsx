import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [visible,  setVisible]  = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const [clicking, setClicking] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const dotX = useSpring(mx, { stiffness: 900, damping: 55, mass: 0.3 });
  const dotY = useSpring(my, { stiffness: 900, damping: 55, mass: 0.3 });
  const ringX = useSpring(mx, { stiffness: 180, damping: 24, mass: 0.5 });
  const ringY = useSpring(my, { stiffness: 180, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      setHovered(!!el.closest("a,button,[role='button'],input,select,textarea,label,[data-cursor]"));
    };
    const onDown  = () => setClicking(true);
    const onUp    = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mouseover",  onOver,  { passive: true });
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseover",  onOver);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [mx, my]);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer:fine)").matches) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%", backgroundColor: "#1ab5c7" }}
        animate={{
          width:   clicking ? 4  : hovered ? 10 : 6,
          height:  clicking ? 4  : hovered ? 10 : 6,
          opacity: visible  ? 1  : 0,
        }}
        transition={{ duration: 0.12 }}
      />

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border"
        style={{
          x: ringX, y: ringY,
          translateX: "-50%", translateY: "-50%",
          borderColor: "rgba(26,181,199,0.55)",
        }}
        animate={{
          width:           clicking ? 24 : hovered ? 52 : 38,
          height:          clicking ? 24 : hovered ? 52 : 38,
          opacity:         visible  ? 1  : 0,
          backgroundColor: hovered ? "rgba(26,181,199,0.07)" : "transparent",
          scale:           clicking ? 0.82 : 1,
          borderWidth:     hovered  ? 1.5 : 1,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}
