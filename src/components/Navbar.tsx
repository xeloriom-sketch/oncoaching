import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Building2, ChevronDown, GraduationCap, Menu, Users, X, Zap } from "lucide-react";
import { NAV_LINKS, ROUTES, SERVICES } from "@/lib/config";
import { LogoMark } from "@/components/Logo";

/* ── Couleurs issues du logo ON Coaching ── */
const NAVY = "#1C3A52";   // "N" + silhouette du logo
const GOLD = "#C4903E";   // "O" + étoile du logo

const SERVICE_ICONS: Record<string, React.ElementType> = {
  [ROUTES.scolaire]:      GraduationCap,
  [ROUTES.jeunes]:        Zap,
  [ROUTES.neurofeedback]: Brain,
  [ROUTES.equipe]:        Users,
  [ROUTES.partenaires]:   Building2,
};

const SERVICE_DESC: Record<string, string> = {
  [ROUTES.scolaire]:      "Collégiens · Lycéens · Étudiants",
  [ROUTES.jeunes]:        "15 – 30 ans · Orientation · Pro",
  [ROUTES.neurofeedback]: "Non invasif · Scientifique",
  [ROUTES.equipe]:        "Entreprises · TPE / PME",
  [ROUTES.partenaires]:   "Institutions · Associations",
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.045, duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Navbar = () => {
  const [isOpen,    setIsOpen]    = useState(false);
  const [svcOpen,   setSvcOpen]   = useState(false);
  const [mobileSvc, setMobileSvc] = useState(false);
  const [hidden,    setHidden]    = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const closeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastY    = useRef(0);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false); setSvcOpen(false); setMobileSvc(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > lastY.current + 6 && y > 100) setHidden(true);
      else if (y < lastY.current - 6) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => { if (closeRef.current) clearTimeout(closeRef.current); }, []);

  const openSvc = useCallback(() => {
    if (closeRef.current) clearTimeout(closeRef.current);
    setSvcOpen(true);
  }, []);

  const scheduleSvcClose = useCallback(() => {
    closeRef.current = setTimeout(() => setSvcOpen(false), 120);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const isServiceActive = SERVICES.some(s => location.pathname.startsWith(s.href));

  return (
    <motion.header
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/96 backdrop-blur-xl shadow-[0_2px_20px_rgba(28,58,82,0.10)] border-b border-[#E5E7EB]"
          : "bg-[#FBFBFB]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-12 py-4 flex items-center justify-between gap-4">

        {/* ── Logo — tout à gauche ── */}
        <Link to="/" aria-label="ON Coaching — Accueil" className="flex items-center gap-2.5 flex-shrink-0 group">
          <LogoMark size={32} animate />
          <span className="font-bold tracking-tight text-[15px]">
            <span style={{ color: GOLD }}>ON</span>
            <span
              className="transition-colors duration-200"
              style={{ color: NAVY }}
            >
              Coaching
            </span>
          </span>
        </Link>

        {/* ── Pilule navy — liens desktop ── */}
        <nav
          className="hidden lg:flex items-center rounded-full px-2 py-1.5 shadow-sm"
          style={{ background: NAVY }}
          aria-label="Navigation principale"
        >
          <ul className="flex items-center gap-1 list-none m-0 p-0 text-[13px] font-medium text-white/70" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  to={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className="px-4 py-2 rounded-full block transition-colors duration-150 hover:text-white"
                  style={isActive(href) ? { color: "white", background: "rgba(255,255,255,0.12)" } : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Services dropdown */}
            <li className="relative" onMouseEnter={openSvc} onMouseLeave={scheduleSvcClose}>
              <button
                aria-haspopup="true"
                aria-expanded={svcOpen}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors duration-150 hover:text-white"
                style={isServiceActive ? { color: "white", background: "rgba(255,255,255,0.12)" } : undefined}
              >
                Services
                <motion.span
                  animate={{ rotate: svcOpen ? 180 : 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex"
                >
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                </motion.span>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[320px] pt-3 pointer-events-none">
                <AnimatePresence>
                  {svcOpen && (
                    <motion.div
                      role="menu"
                      onMouseEnter={openSvc}
                      onMouseLeave={scheduleSvcClose}
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0,  scale: 1    }}
                      exit={{    opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="pointer-events-auto border border-white/10 rounded-[24px] overflow-hidden shadow-2xl"
                      style={{ background: NAVY, boxShadow: "0 24px 60px rgba(28,58,82,0.45)" }}
                    >
                      {/* Accent line or */}
                      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                      <div className="p-3">
                        {SERVICES.map(({ label, href }, i) => {
                          const Icon = SERVICE_ICONS[href] ?? Brain;
                          const desc = SERVICE_DESC[href] ?? "";
                          const active = location.pathname === href;
                          return (
                            <motion.div key={href} custom={i} initial="hidden" animate="visible" variants={itemVariants}>
                              <Link
                                to={href}
                                role="menuitem"
                                aria-current={active ? "page" : undefined}
                                className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-150 group"
                                style={active ? { background: "rgba(255,255,255,0.07)" } : undefined}
                                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = ""; }}
                              >
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                                  style={{ background: active ? GOLD : "rgba(196,144,62,0.15)" }}
                                  aria-hidden="true"
                                >
                                  <Icon className="w-4 h-4" style={{ color: active ? "white" : GOLD }} strokeWidth={1.7} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[13px] font-semibold leading-tight text-white/80 group-hover:text-white transition-colors">
                                    {label}
                                  </span>
                                  <span className="text-[11px] text-white/35 mt-0.5 leading-tight truncate">{desc}</span>
                                </div>
                                {active && (
                                  <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} aria-hidden="true" />
                                )}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="px-3 pb-3 pt-1">
                        <Link
                          to="/contact"
                          className="flex items-center justify-center gap-1.5 w-full py-3 text-[#1C3A52] text-[12px] font-bold rounded-xl transition-opacity hover:opacity-90"
                          style={{ background: GOLD }}
                        >
                          Consultation gratuite <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          </ul>
        </nav>

        {/* ── Droite : CTA or + toggle mobile ── */}
        <div className="flex items-center gap-3">
          <motion.div className="hidden lg:block" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact"
              className="inline-block font-semibold text-[13px] px-6 py-3 rounded-full transition-all duration-200 shadow-sm hover:opacity-90"
              style={{ background: GOLD, color: "#fff" }}
            >
              Prendre RDV
            </Link>
          </motion.div>

          <motion.button
            onClick={() => setIsOpen(v => !v)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 -mr-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ color: NAVY }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen
                ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" aria-hidden="true" />
                  </motion.span>
                : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" aria-hidden="true" />
                  </motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Menu mobile ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            aria-label="Menu mobile"
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.97, y: -6 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="mx-4 mb-3 border border-white/10 rounded-[24px] p-4 shadow-2xl overflow-hidden"
            style={{ background: NAVY }}
          >
            <div className="flex flex-col gap-0.5 mb-3">
              {[...NAV_LINKS, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
                <Link
                  key={href}
                  to={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className="px-4 py-3 rounded-xl text-[15px] font-medium transition-colors min-h-[44px] flex items-center gap-2.5 text-white/65 hover:text-white hover:bg-white/[0.06]"
                  style={isActive(href) ? { color: "white", background: "rgba(255,255,255,0.08)" } : undefined}
                >
                  {isActive(href) && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} aria-hidden="true" />
                  )}
                  {label}
                </Link>
              ))}

              <button
                onClick={() => setMobileSvc(v => !v)}
                aria-expanded={mobileSvc}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors min-h-[44px] w-full text-white/65 hover:text-white hover:bg-white/[0.06]"
                style={isServiceActive ? { color: "white", background: "rgba(255,255,255,0.08)" } : undefined}
              >
                <span className="flex items-center gap-2.5">
                  {isServiceActive && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} aria-hidden="true" />}
                  Services
                </span>
                <motion.span
                  animate={{ rotate: mobileSvc ? 180 : 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex"
                >
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {mobileSvc && (
                  <motion.div
                    key="mobile-svc"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{    opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-3 pb-1 flex flex-col gap-0.5">
                      {SERVICES.map(({ label, href }) => {
                        const Icon = SERVICE_ICONS[href] ?? Brain;
                        const active = location.pathname === href;
                        return (
                          <Link
                            key={href}
                            to={href}
                            aria-current={active ? "page" : undefined}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors min-h-[44px] text-white/55 hover:text-white hover:bg-white/[0.04]"
                            style={active ? { color: "white", background: "rgba(255,255,255,0.08)" } : undefined}
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: active ? GOLD : "rgba(196,144,62,0.18)" }}
                              aria-hidden="true"
                            >
                              <Icon className="w-3.5 h-3.5" style={{ color: active ? "white" : GOLD }} strokeWidth={1.7} />
                            </div>
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/contact"
              className="flex items-center justify-center w-full font-bold text-[14px] py-3.5 rounded-2xl min-h-[44px] transition-opacity hover:opacity-90"
              style={{ background: GOLD, color: "#1C3A52" }}
            >
              Prendre rendez-vous →
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
