import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PageLoaderProps {
  onDone?: () => void;
}

export default function PageLoader({ onDone }: PageLoaderProps) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const goneId = setTimeout(() => setGone(true), 1400);
    return () => {
      clearTimeout(goneId);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (gone) onDone?.();
  }, [gone, onDone]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[200] bg-[#0B0B0C] flex items-center justify-center"
          aria-label="Chargement…"
        >
          <motion.div
            className="on-loader"
            aria-hidden="true"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <svg width="0" height="0" viewBox="0 0 64 64" className="on-absolute">
              <defs xmlns="http://www.w3.org/2000/svg">
                <linearGradient id="on-grad-ring" x1="0" y1="64" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0ea5b7" />
                  <stop offset="0.52" stopColor="#1ab5c7" />
                  <stop offset="1" stopColor="#b8f4fa" />
                  <animateTransform
                    attributeName="gradientTransform"
                    type="rotate"
                    values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                    keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                    keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </linearGradient>
                <linearGradient id="on-grad-n" x1="0" y1="62" x2="0" y2="2" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="0.55" stopColor="#8BE6EF" />
                  <stop offset="1" stopColor="#1ab5c7" />
                </linearGradient>
              </defs>
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="122" width="122" className="on-inline">
              <path
                className="on-spin"
                pathLength="360"
                stroke="url(#on-grad-ring)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M32 32 m0 -27 a27 27 0 1 1 0 54 a27 27 0 1 1 0 -54"
              />
            </svg>

            <div className="on-gap-sm" />

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="122" width="122" className="on-inline">
              <path
                className="on-dash"
                pathLength="360"
                stroke="url(#on-grad-n)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 54 V10 L52 54 V10"
              />
            </svg>
          </motion.div>

          <style>{`
            .on-absolute { position: absolute; }
            .on-inline { display: inline-block; }
            .on-loader { display: flex; align-items: center; margin: 0.25em 0; }
            .on-gap-sm { width: 0.38em; }
            .on-dash {
              animation: onDashArray 2.2s ease-in-out infinite, onDashOffset 2.2s linear infinite;
            }
            .on-spin {
              animation: onSpinDashArray 2s ease-in-out infinite, onSpin 7s ease-in-out infinite, onDashOffset 2s linear infinite;
              transform-origin: center;
            }
            @keyframes onDashArray {
              0% { stroke-dasharray: 0 1 359 0; }
              50% { stroke-dasharray: 0 359 1 0; }
              100% { stroke-dasharray: 359 1 0 0; }
            }
            @keyframes onSpinDashArray {
              0% { stroke-dasharray: 270 90; }
              50% { stroke-dasharray: 0 360; }
              100% { stroke-dasharray: 270 90; }
            }
            @keyframes onDashOffset {
              0% { stroke-dashoffset: 365; }
              100% { stroke-dashoffset: 5; }
            }
            @keyframes onSpin {
              0% { rotate: 0deg; }
              12.5%, 25% { rotate: 270deg; }
              37.5%, 50% { rotate: 540deg; }
              62.5%, 75% { rotate: 810deg; }
              87.5%, 100% { rotate: 1080deg; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
