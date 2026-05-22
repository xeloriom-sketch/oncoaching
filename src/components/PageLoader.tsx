import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface PageLoaderProps {
  onDone?: () => void;
}

const EXPO = [0.76, 0, 0.24, 1] as [number,number,number,number];

export default function PageLoader({ onDone }: PageLoaderProps) {
  const [exiting, setExiting] = useState(false);
  const [gone,    setGone]    = useState(false);
  const cbRef = useRef(onDone);
  cbRef.current = onDone;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setExiting(true), 750);
    const t2 = setTimeout(() => {
      setGone(true);
      document.body.style.overflow = prev;
      cbRef.current?.();
    }, 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = prev;
    };
  }, []);

  if (gone) return null;

  return (
    <div className="fixed inset-0 z-[200]" role="status" aria-label="Chargement…">

      {/* ── Barre de progression ── */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] z-[205] pointer-events-none"
        style={{ background: "linear-gradient(90deg,#0ea5b7,#1ab5c7,#b8f4fa)" }}
        initial={{ width: "0%", opacity: 1 }}
        animate={exiting
          ? { width: "100%", opacity: 0, transition: { width: { duration: 0.15 }, opacity: { delay: 0.15, duration: 0.25 } } }
          : { width: "75%",  transition: { duration: 0.7, ease: "easeOut" } }
        }
      />

      {/* ── Logo + halo ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-[204] pointer-events-none"
        animate={exiting ? { opacity: 0, scale: 1.12, y: -8 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          aria-hidden="true"
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(26,181,199,0.22) 0%, rgba(26,181,199,0.06) 50%, transparent 70%)",
            filter: "blur(28px)",
            animation: "haloBreath 2.8s ease-in-out infinite",
          }}
        />
        <motion.div
          className="on-loader relative z-10"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        >
          <svg width="0" height="0" viewBox="0 0 64 64" className="on-absolute">
            <defs xmlns="http://www.w3.org/2000/svg">
              <linearGradient id="on-grad-ring" x1="0" y1="64" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5b7" />
                <stop offset="0.52" stopColor="#1ab5c7" />
                <stop offset="1" stopColor="#b8f4fa" />
                <animateTransform
                  attributeName="gradientTransform" type="rotate"
                  values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                  keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1"
                  keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                  dur="8s" repeatCount="indefinite"
                />
              </linearGradient>
              <linearGradient id="on-grad-n" x1="0" y1="62" x2="0" y2="2" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="0.55" stopColor="#8BE6EF" />
                <stop offset="1" stopColor="#1ab5c7" />
              </linearGradient>
            </defs>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="128" width="128" className="on-inline">
            <path className="on-spin" pathLength="360" stroke="url(#on-grad-ring)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" d="M32 32 m0 -27 a27 27 0 1 1 0 54 a27 27 0 1 1 0 -54" />
          </svg>
          <div className="on-gap-sm" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="128" width="128" className="on-inline">
            <path className="on-dash" pathLength="360" stroke="url(#on-grad-n)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" d="M12 54 V10 L52 54 V10" />
          </svg>
        </motion.div>
      </motion.div>

      {/* ── Panel haut ── */}
      <motion.div
        className="absolute left-0 top-0 w-full bg-[#0B0B0C] z-[203]"
        style={{ height: "51%" }}
        animate={exiting ? { y: "-101%" } : { y: "0%" }}
        transition={{ duration: 0.72, ease: EXPO, delay: exiting ? 0.28 : 0 }}
      />

      {/* ── Panel bas ── */}
      <motion.div
        className="absolute left-0 bottom-0 w-full bg-[#0B0B0C] z-[203]"
        style={{ height: "51%" }}
        animate={exiting ? { y: "101%" } : { y: "0%" }}
        transition={{ duration: 0.72, ease: EXPO, delay: exiting ? 0.28 : 0 }}
      />

      {/* ── Ligne centrale décorative (visible au moment du split) ── */}
      <motion.div
        className="absolute left-0 z-[206] w-full pointer-events-none overflow-hidden"
        style={{ top: "50%", height: "1px", marginTop: "-0.5px" }}
        initial={{ opacity: 0 }}
        animate={exiting ? { opacity: [0, 0.6, 0], transition: { duration: 0.5, delay: 0.28, times: [0, 0.3, 1] } } : { opacity: 0 }}
      >
        <motion.div
          className="h-full w-full"
          style={{ background: "linear-gradient(90deg, transparent, #1ab5c7, transparent)" }}
          animate={exiting ? { scaleX: [0, 1], transition: { duration: 0.4, delay: 0.28 } } : { scaleX: 0 }}
        />
      </motion.div>

      <style>{`
        @keyframes haloBreath {
          0%,100% { opacity:0.7; transform:scale(1); }
          50% { opacity:1; transform:scale(1.18); }
        }
        .on-absolute { position:absolute; }
        .on-inline   { display:inline-block; }
        .on-loader   { display:flex; align-items:center; margin:0.25em 0; }
        .on-gap-sm   { width:0.38em; }
        .on-dash  { animation: onDashArray 2.2s ease-in-out infinite, onDashOffset 2.2s linear infinite; }
        .on-spin  { animation: onSpinDashArray 2s ease-in-out infinite, onSpin 7s ease-in-out infinite, onDashOffset 2s linear infinite; transform-origin:center; }
        @keyframes onDashArray      { 0%{stroke-dasharray:0 1 359 0}  50%{stroke-dasharray:0 359 1 0}   100%{stroke-dasharray:359 1 0 0} }
        @keyframes onSpinDashArray  { 0%{stroke-dasharray:270 90}      50%{stroke-dasharray:0 360}        100%{stroke-dasharray:270 90} }
        @keyframes onDashOffset     { 0%{stroke-dashoffset:365}         100%{stroke-dashoffset:5} }
        @keyframes onSpin           { 0%{rotate:0deg} 12.5%,25%{rotate:270deg} 37.5%,50%{rotate:540deg} 62.5%,75%{rotate:810deg} 87.5%,100%{rotate:1080deg} }
      `}</style>
    </div>
  );
}
