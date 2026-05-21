import { motion } from "framer-motion";

interface LogoMarkProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

/** Logo réel du client — faviconNoText.png en blanc ou noir via CSS filter */
export const LogoMark = ({ size = 36, animate: doAnimate = false, className = "", color = "white" }: LogoMarkProps & { color?: "white" | "black" }) => (
  <motion.img
    src={`${import.meta.env.BASE_URL}faviconNoText.png`}
    alt="ON Coaching — Logo"
    style={{
      width: size,
      height: size,
      filter: color === "white"
        ? "brightness(0) invert(1)"
        : "brightness(0)",
    }}
    className={`object-contain flex-shrink-0 ${className}`}
    {...(doAnimate
      ? { whileHover: { scale: 1.1, rotate: 5 }, whileTap: { scale: 0.95 } }
      : {})}
  />
);

interface LogoProps {
  showText?: boolean;
  textColor?: string;
  size?: number;
}

/** Logo complet = marque + wordmark */
const Logo = ({ showText = true, textColor = "text-white", size = 34 }: LogoProps) => (
  <div className="flex items-center gap-2.5">
    <LogoMark size={size} animate />
    {showText && (
      <span className={`font-bold tracking-tight text-[15px] uppercase ${textColor}`}>
        Coaching
      </span>
    )}
  </div>
);

export default Logo;
