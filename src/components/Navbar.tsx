import { useState, useEffect, useRef } from "react";
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

const Navbar = () => {
  const [isOpen,  setIsOpen]  = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [hidden,  setHidden]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setSvcOpen(false);
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

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const isServiceActive = SERVICES.some(s => location.pathname.startsWith(s.href));

  return (
    <motion.header
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-4 pt-4"
    >
      <nav
        aria-label="Navigation principale"
        className={`text-white rounded-full py-2.5 px-5 flex items-center justify-between max-w-7xl mx-auto shadow-xl shadow-black/25 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-[#0B0B0C]/90 backdrop-blur-xl border border-white/10"
            : "bg-[#0B0B0C] border border-transparent"
        }`}
      >
        {/* Logo */}
        <Link to="/" aria-label="ON Coaching — Accueil" className="flex items-center gap-2.5 flex-shrink-0 group">
          <LogoMark size={30} animate color="white" />
          <span className="font-bold tracking-tight text-[15px] uppercase group-hover:text-[#1ab5c7] transition-colors">
            Coaching
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7 text-white/60 text-[13px] font-medium list-none m-0 p-0" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                to={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`relative hover:text-white transition-colors group py-1 ${isActive(href) ? "text-white" : ""}`}
              >
                {label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-[#1ab5c7] rounded-full transition-all duration-300 ease-out ${
                    isActive(href) ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  }`}
                />
              </Link>
            </li>
          ))}

          {/* Services dropdown */}
          <li
            className="relative"
            onMouseEnter={() => setSvcOpen(true)}
            onMouseLeave={() => setSvcOpen(false)}
          >
            <button
              aria-haspopup="true"
              aria-expanded={svcOpen}
              className={`flex items-center gap-1 hover:text-white transition-colors py-1 group relative ${isServiceActive ? "text-white" : ""}`}
            >
              Services
              <motion.span
                animate={{ rotate: svcOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ChevronDown className="w-3 h-3" aria-hidden="true" />
              </motion.span>
              <span
                className={`absolute -bottom-0.5 left-0 h-[2px] bg-[#1ab5c7] rounded-full transition-all duration-300 ease-out ${
                  isServiceActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                }`}
              />
            </button>

            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[300px] pt-3">
              <AnimatePresence>
                {svcOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#0B0B0C] border border-white/10 rounded-[20px] p-2 shadow-2xl"
                  >
                    {SERVICES.map(({ label, href }) => {
                      const Icon = SERVICE_ICONS[href] ?? Brain;
                      const active = location.pathname === href;
                      return (
                        <motion.div
                          key={href}
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 24 }}
                        >
                          <Link
                            to={href}
                            role="menuitem"
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${active ? "bg-white/8" : "hover:bg-white/5"}`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${active ? "bg-[#1ab5c7]" : "bg-white/8 group-hover:bg-[#1ab5c7]/20"}`} aria-hidden="true">
                              <Icon className={`w-3.5 h-3.5 transition-colors ${active ? "text-white" : "text-[#1ab5c7]"}`} strokeWidth={1.8} />
                            </div>
                            <span className={`text-[12px] font-medium transition-colors ${active ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                              {label}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                    <div className="border-t border-white/8 mt-1 pt-2 px-2">
                      <Link
                        to="/contact"
                        className="flex items-center justify-center w-full py-2.5 bg-[#1ab5c7] text-white text-[12px] font-bold rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Consultation gratuite →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </li>
        </ul>

        {/* Desktop CTA */}
        <motion.div className="hidden lg:block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
          <Link
            to="/contact"
            className="bg-[#1ab5c7] text-white px-5 py-2 rounded-full font-bold text-[12px] hover:opacity-90 transition-opacity"
          >
            Prendre RDV
          </Link>
        </motion.div>

        {/* Mobile toggle */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          whileTap={{ scale: 0.9 }}
          className="lg:hidden text-white p-2 -mr-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            aria-label="Menu mobile"
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="mt-2 bg-[#0B0B0C] border border-white/10 rounded-[24px] p-5 max-w-7xl mx-auto shadow-2xl"
          >
            <div className="flex flex-col gap-1 mb-4">
              {[...NAV_LINKS, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
                <Link
                  key={href}
                  to={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`px-4 py-3 rounded-xl text-[15px] font-medium transition-colors min-h-[44px] flex items-center gap-2.5 ${
                    isActive(href) ? "text-white bg-white/8" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive(href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1ab5c7] flex-shrink-0" aria-hidden="true" />
                  )}
                  {label}
                </Link>
              ))}

              <button
                onClick={() => setSvcOpen(!svcOpen)}
                aria-expanded={svcOpen}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-colors min-h-[44px] ${
                  isServiceActive ? "text-white bg-white/8" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform ${svcOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>

              <AnimatePresence>
                {svcOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-2 overflow-hidden"
                  >
                    {SERVICES.map(({ label, href }) => {
                      const Icon = SERVICE_ICONS[href] ?? Brain;
                      return (
                        <Link
                          key={href}
                          to={href}
                          aria-current={location.pathname === href ? "page" : undefined}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] transition-colors min-h-[44px] ${
                            location.pathname === href ? "text-white bg-white/8" : "text-white/55 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-[#1ab5c7]" strokeWidth={1.8} aria-hidden="true" />
                          {label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/contact"
              className="block w-full text-center bg-[#1ab5c7] text-white font-bold text-[14px] py-3.5 rounded-full min-h-[44px] flex items-center justify-center"
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
