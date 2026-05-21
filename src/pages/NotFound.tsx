import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center flex flex-col items-center gap-6"
      >
        <span className="font-mono text-[clamp(5rem,20vw,10rem)] font-black leading-none text-[#F3F4F6] select-none">
          404
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-[clamp(1.4rem,4vw,2rem)] font-bold text-[#0B0B0C] tracking-tight">
            Page introuvable
          </h1>
          <p className="text-gray-500 text-[15px]">
            Cette page n'existe pas ou a été déplacée.
          </p>
        </div>
        <Link
          to="/"
          className="bg-[#0B0B0C] text-white font-semibold text-[15px] px-6 py-3.5 rounded-full hover:opacity-85 transition-opacity"
        >
          Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
