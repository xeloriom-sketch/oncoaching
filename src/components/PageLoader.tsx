import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [gone,     setGone]     = useState(false);

  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      n = Math.min(n + Math.ceil(Math.random() * 4 + 2), 100);
      setProgress(n);
      if (n >= 100) {
        clearInterval(id);
        setTimeout(() => setGone(true), 550);
      }
    }, 20);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="loader"
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[200] bg-[#0B0B0C] flex flex-col items-center justify-center gap-6"
          aria-label="Chargement…"
        >
          {/* Logo */}
          <motion.img
            src={`${import.meta.env.BASE_URL}faviconNoText.png`}
            alt="ON Coaching"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />

          {/* Nom */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-[9px] font-mono tracking-[0.45em] uppercase text-white/35"
          >
            ON Coaching
          </motion.p>

          {/* Barre de progression fine */}
          <div className="w-28 h-px bg-white/10 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#1ab5c7] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.04 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
