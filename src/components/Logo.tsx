import { motion } from "framer-motion";

interface LogoMarkProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

/** Logo réel du client — faviconNoText.webp (couleurs d'origine : or + bleu marine) */
export const LogoMark = ({ size = 36, animate: doAnimate = false, className = "" }: LogoMarkProps) => (
  <motion.img
    src={`${import.meta.env.BASE_URL}faviconNoText.webp`}
    alt="ON Coaching — Logo"
    style={{ width: size, height: size }}
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
  <div className="flex items-center gap-2 whitespace-nowrap">
    <div className="bg-white rounded-[8px] p-[3px] flex-shrink-0">
      <LogoMark size={size - 6} animate />
    </div>
    {showText && (
      <span className="font-bold tracking-tight text-[15px]">
        <span className="text-[#1ab5c7]">ON</span><span className={textColor}>Coaching</span>
      </span>
    )}
  </div>
);

export default Logo;
