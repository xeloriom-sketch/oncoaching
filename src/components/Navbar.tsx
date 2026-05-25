import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Building2, ChevronDown, GraduationCap, Menu, Users, X, Zap } from "lucide-react";
import { NAV_LINKS, ROUTES, SERVICES } from "@/lib/config";
import { LogoMark } from "@/components/Logo";

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
    opacity: 1,
    x: 0,
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
    setIsOpen(false);
    setSvcOpen(false);
    setMobileSvc(false);
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
          ? "bg-white/95 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border-b border-[#E5E7EB]"
          : "bg-[#FBFBFB]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-12 py-4 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/" aria-label="ON Coaching — Accueil" className="flex items-center gap-2.5 flex-shrink-0 group">
          <LogoMark size={30} animate />
          <span className="font-bold tracking-tight text-[15px] text-[#0B0B0C]">
            <span className="text-[#1ab5c7]">ON</span>
            <span className="group-hover:text-[#1ab5c7] transition-colors">Coaching</span>
          </span>
        </Link>

        {/* ── Pilule centrale — liens desktop ── */}
        <nav
          className="hidden lg:flex items-center bg-[#0B0B0C] rounded-full px-2 py-1.5 shadow-sm"
          aria-label="Navigation principale"
        >
          <ul className="flex items-center gap-1 list-none m-0 p-0 text-[13px] font-medium text-white/70" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  to={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`px-4 py-2 rounded-full block transition-colors duration-150 ${
                    isActive(href)
                      ? "text-white bg-white/10"
                      : "hover:text-white hover:bg-white/[0.07]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Services dropdown */}
            <li
              className="relative"
              onMouseEnter={openSvc}
              onMouseLeave={scheduleSvcClose}
            >
              <button
                aria-haspopup="true"
                aria-expanded={svcOpen}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors duration-150 ${
                  isServiceActive ? "text-white bg-white/10" : "hover:text-white hover:bg-white/[0.07]"
                }`}
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
                      className="pointer-events-auto bg-[#0B0B0C] border border-white/10 rounded-[24px] overflow-hidden shadow-2xl shadow-black/40"
                    >
                      <div className="h-[2px] w-full bg-gradient-to-r from-[#1ab5c7]/60 via-[#1ab5c7] to-[#1ab5c7]/60" />
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
                                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-150 group ${
                                  active ? "bg-white/[0.07]" : "hover:bg-white/[0.05]"
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                  active ? "bg-[#1ab5c7]" : "bg-white/[0.07] group-hover:bg-[#1ab5c7]/20"
                                }`} aria-hidden="true">
                                  <Icon className={`w-4 h-4 transition-colors ${
                                    active ? "text-white" : "text-[#1ab5c7]"
                                  }`} strokeWidth={1.7} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className={`text-[13px] font-semibold leading-tight transition-colors ${
                                    active ? "text-white" : "text-white/80 group-hover:text-white"
                                  }`}>
                                    {label}
                                  </span>
                                  <span className="text-[11px] text-white/35 mt-0.5 leading-tight truncate">
                                    {desc}
                                  </span>
                                </div>
                                {active && (
                                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1ab5c7] flex-shrink-0" aria-hidden="true" />
                                )}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="px-3 pb-3 pt-1">
                        <Link
                          to="/contact"
                          className="flex items-center justify-center gap-1.5 w-full py-3 bg-[#1ab5c7] hover:bg-[#16a3b4] text-white text-[12px] font-bold rounded-xl transition-colors"
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

        {/* ── Droite : CTA lime + toggle mobile ── */}
        <div className="flex items-center gap-3">
          <motion.div className="hidden lg:block" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact"
              className="inline-block bg-[#d4f799] text-[#163324] font-semibold text-[13px] px-6 py-3 rounded-full hover:bg-[#c3e887] transition-all duration-200 shadow-sm"
            >
              Prendre RDV
            </Link>
          </motion.div>

          <motion.button
            onClick={() => setIsOpen(v => !v)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden text-[#0B0B0C] p-2 -mr-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
            className="mx-4 mb-3 bg-[#0B0B0C] border border-white/10 rounded-[24px] p-4 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-0.5 mb-3">
              {[...NAV_LINKS, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
                <Link
                  key={href}
                  to={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`px-4 py-3 rounded-xl text-[15px] font-medium transition-colors min-h-[44px] flex items-center gap-2.5 ${
                    isActive(href) ? "text-white bg-white/[0.07]" : "text-white/65 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {isActive(href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1ab5c7] flex-shrink-0" aria-hidden="true" />
                  )}
                  {label}
                </Link>
              ))}

              <button
                onClick={() => setMobileSvc(v => !v)}
                aria-expanded={mobileSvc}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors min-h-[44px] w-full ${
                  isServiceActive ? "text-white bg-white/[0.07]" : "text-white/65 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {isServiceActive && <span className="w-1.5 h-1.5 rounded-full bg-[#1ab5c7] flex-shrink-0" aria-hidden="true" />}
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
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors min-h-[44px] ${
                              active ? "text-white bg-white/[0.07]" : "text-white/55 hover:text-white hover:bg-white/[0.04]"
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              active ? "bg-[#1ab5c7]" : "bg-white/[0.07]"
                            }`} aria-hidden="true">
                              <Icon className={`w-3.5 h-3.5 ${active ? "text-white" : "text-[#1ab5c7]"}`} strokeWidth={1.7} />
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
              className="flex items-center justify-center w-full bg-[#d4f799] text-[#163324] font-bold text-[14px] py-3.5 rounded-2xl min-h-[44px] hover:bg-[#c3e887] transition-colors"
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
