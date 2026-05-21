import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      n = Math.min(n + Math.ceil(Math.random() * 5 + 2), 100);
      setProgress(n);
      if (n >= 100) {
        clearInterval(id);
        setTimeout(() => setGone(true), 600);
      }
    }, 18);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[200] bg-[#0B0B0C] flex flex-col items-center justify-center"
          aria-label="Chargement…"
        >
          {/* Logo avec halo pulsant */}
          <div className="relative flex items-center justify-center mb-12">
            {/* Halo externe */}
            <motion.div
              className="absolute rounded-2xl"
              style={{ width: 72, height: 72, background: "rgba(26,181,199,0.08)" }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Halo proche */}
            <motion.div
              className="absolute rounded-2xl"
              style={{ width: 64, height: 64, background: "rgba(26,181,199,0.12)" }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.8, 0.1, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            {/* Logo */}
            <motion.img
              src={`${import.meta.env.BASE_URL}favicon_dark.png`}
              alt="ON Coaching"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-14 h-14 object-contain rounded-xl z-10"
            />
          </div>

          {/* Barre de progression */}
          <div className="w-24 h-[2px] bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#1ab5c7] rounded-full origin-left"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.02 }}
            />
          </div>

          {/* Pourcentage discret */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-[10px] font-mono text-white/20 tabular-nums"
          >
            {progress}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
