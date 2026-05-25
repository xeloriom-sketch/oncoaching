import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoMark } from "@/components/Logo";

interface PageLoaderProps {
  onDone?: () => void;
}

export default function PageLoader({ onDone }: PageLoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      document.body.style.overflow = "";
      setVisible(false);
      onDone?.();
    }, 900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] bg-[#FBFBFB] flex flex-col items-center justify-center gap-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <LogoMark size={52} animate />

          {/* Barre de progression fine */}
          <div className="w-24 h-[2px] bg-[#E5E7EB] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#C4903E" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
