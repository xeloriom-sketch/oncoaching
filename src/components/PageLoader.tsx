import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageLoaderProps {
    onDone?: () => void;
}

const EXPO = [0.83, 0, 0.17, 1] as [number, number, number, number];

export default function PageLoader({ onDone }: PageLoaderProps) {
    const [exiting, setExiting] = useState(false);
    const [gone, setGone] = useState(false);

    // Bloque le scroll dès le montage
    useEffect(() => {
        const originalStyle = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    if (gone) return null;

    const handleAnimationComplete = () => {
        document.body.style.overflow = "";
        setGone(true);
        onDone?.();
    };

    return (
        <div className="fixed inset-0 z-[200] overflow-hidden select-none" role="status" aria-label="Chargement…">

            {/* ── Barre de progression supérieure ── */}
            <motion.div
                className="absolute top-0 left-0 h-[2px] z-[205] pointer-events-none"
                style={{ background: "linear-gradient(90deg, #0ea5b7, #1ab5c7, #b8f4fa)" }}
                initial={{ width: "0%" }}
                // La barre se remplit pendant l'apparition du logo, puis passe à 100% lors de la sortie
                animate={exiting ? { width: "100%", opacity: 0 } : { width: "75%" }}
                transition={
                    exiting
                        ? { width: { duration: 0.2 }, opacity: { delay: 0.1, duration: 0.2 } }
                        : { duration: 0.6, ease: "easeOut" }
                }
            />

            {/* ── Logo + Halo central ── */}
            <AnimatePresence>
                {!exiting && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center z-[204] pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.2, ease: "easeIn" }}
                    >
                        {/* Halo lumineux */}
                        <div
                            aria-hidden="true"
                            className="absolute w-96 h-96 rounded-full opacity-80 animate-[haloBreath_2.8s_ease-in-out_infinite]"
                            style={{
                                background: "radial-gradient(circle, rgba(26,181,199,0.2) 0%, rgba(26,181,199,0.05) 50%, transparent 70%)",
                                filter: "blur(32px)",
                            }}
                        />

                        {/* Conteneur des SVGs (ON) */}
                        <motion.div
                            className="relative z-10 flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.85, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            // Durée de l'apparition initiale (ajustable au besoin)
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            // C'est ICI que la magie opère : dès que le ON est complètement affiché, on lance la sortie
                            onAnimationComplete={() => {
                                setTimeout(() => setExiting(true), 350);
                            }}
                        >
                            {/* Définitions des dégradés */}
                            <svg className="absolute w-0 h-0" aria-hidden="true">
                                <defs>
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

                            {/* Cercle Spinner */}
                            <svg fill="none" viewBox="0 0 64 64" height="120" width="120" className="inline-block">
                                <path className="animate-[onSpinDashArray_2s_ease-in-out_infinite,onSpin_7s_ease-in-out_infinite,onDashOffset_2s_linear_infinite] origin-center" pathLength="360" stroke="url(#on-grad-ring)" strokeWidth="9" strokeLinecap="round" d="M32 32 m0 -27 a27 27 0 1 1 0 54 a27 27 0 1 1 0 -54" />
                            </svg>

                            {/* Lettre N */}
                            <svg fill="none" viewBox="0 0 64 64" height="120" width="120" className="inline-block">
                                <path className="animate-[onDashArray_2.2s_ease-in-out_infinite,onDashOffset_2.2s_linear_infinite]" pathLength="360" stroke="url(#on-grad-n)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" d="M12 54 V10 L52 54 V10" />
                            </svg>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Panel haut ── */}
            <motion.div
                className="absolute left-0 top-0 w-full bg-[#0B0B0C] z-[203] origin-top"
                style={{ height: "50vh" }}
                animate={exiting ? { scaleY: 0 } : { scaleY: 1 }}
                transition={{ duration: 0.75, ease: EXPO }}
            />

            {/* ── Panel bas ── */}
            <motion.div
                className="absolute left-0 bottom-0 w-full bg-[#0B0B0C] z-[203] origin-bottom"
                style={{ height: "50vh" }}
                animate={exiting ? { scaleY: 0 } : { scaleY: 1 }}
                transition={{ duration: 0.75, ease: EXPO }}
                onAnimationComplete={(definition) => {
                    if (exiting && typeof definition === "object" && "scaleY" in definition && definition.scaleY === 0) {
                        handleAnimationComplete();
                    }
                }}
            />

            {/* ── Ligne centrale de découpe ── */}
            <motion.div
                className="absolute left-0 z-[206] w-full h-[1px] top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={exiting ? { opacity: [0, 0.8, 0], scaleX: [0, 1, 0.7] } : { opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ background: "linear-gradient(90deg, transparent, #1ab5c7, transparent)" }}
            />

            <style>{`
        @keyframes haloBreath {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.12); opacity: 1; }
        }
        @keyframes onDashArray {
          0% { stroke-dasharray: 0 1 359 0; }
          50% { stroke-dasharray: 0 359 1 0; }
          100% { stroke-dasharray: 359 1 0 0; }
        }
        @keyframes onSpinDashArray {
          0%, 100% { stroke-dasharray: 270 90; }
          50% { stroke-dasharray: 0 360; }
        }
        @keyframes onDashOffset {
          0% { stroke-dashoffset: 365; }
          100% { stroke-dashoffset: 5; }
        }
        @keyframes onSpin {
          0% { transform: rotate(0deg); }
          12.5%, 25% { transform: rotate(270deg); }
          37.5%, 50% { transform: rotate(540deg); }
          62.5%, 75% { transform: rotate(810deg); }
          87.5%, 100% { transform: rotate(1080deg); }
        }
      `}</style>
        </div>
    );
}