import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle, Lock, ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { auth } from "@/lib/adminAuth";

/* ── Constants ─────────────────────────────────────────────── */
const LOCKOUT_AFTER   = 3;
const LOCKOUT_SECONDS = 30;
const BRAIN_IMG = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1400&q=85";

/* ── Error mapping ──────────────────────────────────────────── */
function mapError(raw: string): string {
  const r = (raw ?? "").toLowerCase();
  if (r.includes("invalid login credentials") || r.includes("invalid_credentials"))
    return "Email ou mot de passe incorrect.";
  if (r.includes("email not confirmed"))
    return "Compte non confirmé — vérifiez vos emails.";
  if (r.includes("too many requests") || r.includes("rate limit"))
    return "Trop de tentatives — réessayez dans quelques minutes.";
  return "Une erreur est survenue. Veuillez réessayer.";
}

/* ── Animation variants ─────────────────────────────────────── */
const panelVariants = {
  hidden: { opacity: 0, x: -32 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Input component ────────────────────────────────────────── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError: boolean;
  suffix?: React.ReactNode;
}
function Field({ hasError, suffix, className = "", ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        className={`w-full bg-white text-[#1C3A52] placeholder-gray-300 text-[15px] rounded-xl px-4 py-3.5 outline-none transition-all duration-200 ${suffix ? "pr-12" : ""} ${className}`}
        style={{
          border: `1.5px solid ${hasError ? "#ef4444" : focused ? "#C4903E" : "#E5E7EB"}`,
          boxShadow: focused
            ? hasError
              ? "0 0 0 3px rgba(239,68,68,0.10)"
              : "0 0 0 3px rgba(196,144,62,0.14)"
            : "0 1px 2px rgba(0,0,0,0.04)",
        }}
      />
      {suffix && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function AdminLogin() {
  const navigate = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockout,  setLockout]  = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Lockout countdown */
  useEffect(() => {
    if (lockout <= 0) return;
    intervalRef.current = setInterval(() => {
      setLockout(s => {
        if (s <= 1) { clearInterval(intervalRef.current!); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [lockout > 0]);

  const isLocked = lockout > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || loading) return;
    setError(null);
    setLoading(true);

    const { error: authError } = await auth.login(email, password);

    if (authError) {
      const next = attempts + 1;
      setAttempts(next);
      setError(mapError(authError));
      if (next >= LOCKOUT_AFTER) {
        setLockout(LOCKOUT_SECONDS);
        setAttempts(0);
      }
      setLoading(false);
    } else {
      navigate("/admin");
    }
  };

  const hasError = !!error || isLocked;
  const canSubmit = !loading && !isLocked && email.length > 0 && password.length > 0;

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">

      {/* ══ LEFT PANEL ════════════════════════════════════════ */}
      <motion.aside
        variants={panelVariants}
        initial="hidden"
        animate="show"
        className="hidden lg:flex relative flex-col w-[52%] xl:w-[55%] overflow-hidden"
        aria-hidden="true"
      >
        {/* Background image */}
        <img
          src={BRAIN_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />

        {/* Navy overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(28,58,82,0.87)" }}
        />

        {/* Bottom-to-top darkening gradient */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,24,36,0.7) 0%, transparent 55%)" }}
        />

        {/* Top-to-bottom subtle darkening */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(10,24,36,0.4) 0%, transparent 35%)" }}
        />

        {/* Gold vertical divider — right edge */}
        <div className="absolute right-0 top-10 bottom-10 w-px bg-[#C4903E]/50" />

        {/* Decorative gold circles */}
        <div
          className="absolute top-16 right-10 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{ border: "1px solid #C4903E" }}
        />
        <div
          className="absolute top-24 right-16 w-20 h-20 rounded-full opacity-15 pointer-events-none"
          style={{ border: "1px solid #C4903E" }}
        />
        <div
          className="absolute bottom-32 left-12 w-48 h-48 rounded-full opacity-[0.07] pointer-events-none"
          style={{ border: "1.5px solid #C4903E" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full px-10 xl:px-14 py-12">

          {/* Top — logo + brand */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-2.5 w-fit">
              <LogoMark size={44} />
            </div>
            <div>
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#C4903E] mb-1">
                ON Coaching
              </p>
              <div className="w-8 h-px bg-[#C4903E]/60" />
            </div>
          </div>

          {/* Center — headline */}
          <div className="flex flex-col gap-6">
            <div>
              <h1
                className="text-white font-black leading-[0.92] tracking-[-0.03em]"
                style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
              >
                Espace<br />
                <span className="text-[#C4903E]">Admin</span>
              </h1>
            </div>

            <p className="text-white/55 text-[15px] leading-relaxed max-w-xs">
              Gérez le contenu, les messages et les paramètres de votre plateforme de coaching.
            </p>

            {/* Security badge */}
            <div className="flex items-center gap-2.5 w-fit">
              <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-full"
                style={{
                  background: "rgba(196,144,62,0.12)",
                  border: "1px solid rgba(196,144,62,0.3)",
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C4903E]" strokeWidth={2} />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#C4903E]">
                  Accès sécurisé
                </span>
              </div>
            </div>
          </div>

          {/* Bottom — quote */}
          <div className="flex flex-col gap-3">
            <div className="w-6 h-px bg-[#C4903E]/60" />
            <blockquote className="text-white/45 text-[13px] italic leading-relaxed max-w-[260px]">
              "Le changement commence là où la zone de confort s'arrête."
            </blockquote>
            <p className="text-white/25 text-[11px] font-mono tracking-wider">
              — Noureddine Omar, ON Coaching
            </p>
          </div>
        </div>
      </motion.aside>

      {/* ══ RIGHT PANEL ═══════════════════════════════════════ */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-10 bg-white">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="w-full max-w-[400px]"
        >

          {/* Mobile logo */}
          <motion.div variants={fadeUp} className="flex lg:hidden justify-center mb-10">
            <div className="bg-[#1C3A52] rounded-2xl p-2.5">
              <LogoMark size={40} />
            </div>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeUp} className="mb-9">
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#C4903E] mb-4">
              Espace Administration
            </p>
            <h2
              className="font-black text-[#1C3A52] leading-tight tracking-[-0.02em] mb-2"
              style={{ fontSize: "2.4rem" }}
            >
              Connexion
            </h2>
            <p className="text-[14px] text-gray-400 leading-snug">
              Accès réservé au personnel autorisé.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Error / Lockout alert */}
            <AnimatePresence mode="wait">
              {(error || isLocked) && (
                <motion.div
                  key={isLocked ? "lock" : "err"}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0,   scale: 1    }}
                  exit={{    opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  role="alert"
                  aria-live="assertive"
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-[13px] font-semibold text-red-700 leading-snug">
                      {isLocked
                        ? `Accès temporairement bloqué — réessayez dans ${lockout}s.`
                        : error}
                    </p>
                    {isLocked && (
                      <p className="text-[12px] text-red-500 mt-0.5">
                        Trop de tentatives échouées consécutives.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Attempts warning */}
            <AnimatePresence>
              {attempts > 0 && !isLocked && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[12px] text-amber-600 font-medium -mt-1"
                >
                  {LOCKOUT_AFTER - attempts} tentative{LOCKOUT_AFTER - attempts > 1 ? "s" : ""} restante{LOCKOUT_AFTER - attempts > 1 ? "s" : ""} avant blocage temporaire.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Email field */}
            <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-[12px] font-bold text-[#1C3A52] tracking-wide uppercase">
                Adresse email
              </label>
              <Field
                id="login-email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null); }}
                autoComplete="email"
                placeholder="votre@email.com"
                required
                disabled={isLocked || loading}
                hasError={hasError}
              />
            </motion.div>

            {/* Password field */}
            <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
              <label htmlFor="login-pwd" className="text-[12px] font-bold text-[#1C3A52] tracking-wide uppercase">
                Mot de passe
              </label>
              <Field
                id="login-pwd"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null); }}
                autoComplete="current-password"
                placeholder="••••••••••••"
                required
                disabled={isLocked || loading}
                hasError={hasError}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    tabIndex={-1}
                    className="text-gray-350 hover:text-[#1C3A52] transition-colors"
                    style={{ color: "#9CA3AF" }}
                  >
                    {showPwd
                      ? <EyeOff className="w-4 h-4" strokeWidth={2} />
                      : <Eye    className="w-4 h-4" strokeWidth={2} />}
                  </button>
                }
              />
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp} className="pt-1">
              <motion.button
                type="submit"
                disabled={!canSubmit}
                whileHover={canSubmit ? { scale: 1.015 } : {}}
                whileTap={canSubmit  ? { scale: 0.985 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full rounded-full py-4 font-bold text-[15px] flex items-center justify-center gap-2.5 transition-opacity duration-200"
                style={{
                  background: canSubmit
                    ? "linear-gradient(135deg, #C4903E 0%, #d9a84e 50%, #C4903E 100%)"
                    : "#E5E7EB",
                  backgroundSize: "200% auto",
                  color: canSubmit ? "#1C3A52" : "#9CA3AF",
                  boxShadow: canSubmit ? "0 6px 24px rgba(196,144,62,0.35)" : "none",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Vérification…
                  </>
                ) : isLocked ? (
                  <>
                    <Lock size={14} />
                    Bloqué — {lockout}s
                  </>
                ) : (
                  "Se connecter"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Security note */}
          <motion.div
            variants={fadeUp}
            className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gray-300" strokeWidth={2} />
            <p className="text-[11px] text-gray-350" style={{ color: "#CBD5E1" }}>
              Connexion chiffrée · Session sécurisée
            </p>
          </motion.div>

          {/* Back link */}
          <motion.div variants={fadeUp} className="mt-6 flex justify-center">
            <a
              href="/"
              className="text-[12px] text-gray-400 hover:text-[#1C3A52] transition-colors duration-200"
            >
              ← Retour au site
            </a>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
