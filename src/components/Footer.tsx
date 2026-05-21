import { useState } from "react";
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowRight, Play, X } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SERVICES, SOCIAL, SITE } from "@/lib/config";

const NAV_FOOTER = [
  { label: "Accueil",    href: "/" },
  { label: "À Propos",  href: "/about" },
  { label: "Nos Tarifs", href: "/NosTarifs" },
  { label: "Contact",   href: "/contact" },
];

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  Facebook:  Facebook,
  Instagram: Instagram,
};

const Footer = () => {
  const year = new Date().getFullYear();
  const [playerOpen, setPlayerOpen] = useState(false);

  return (
    <>
      {/* ── Podcast player flottant ────────────────── */}
      <aside aria-label="Lecteur podcast" className="fixed bottom-6 right-6 z-50">
        {playerOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-72 rounded-[20px] overflow-hidden shadow-2xl border border-white/10 bg-[#0B0B0C]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1ab5c7] animate-pulse" aria-hidden="true" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#1ab5c7]">Podcast</span>
              </div>
              <button
                onClick={() => setPlayerOpen(false)}
                aria-label="Fermer le lecteur podcast"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X size={11} aria-hidden="true" />
              </button>
            </div>
            <iframe
              title="Podcast ON Coaching"
              width="100%"
              height="152"
              src="https://embed.acast.com/64a44bff1355cb0011b8142a/6978f315e23c68f310aa204c"
              scrolling="no"
              frameBorder="0"
              loading="lazy"
            />
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPlayerOpen(true)}
            aria-label="Ouvrir le lecteur podcast"
            className="w-14 h-14 bg-[#1ab5c7] text-white rounded-full shadow-xl flex items-center justify-center"
          >
            <Play size={18} className="ml-0.5 fill-white" aria-hidden="true" />
          </motion.button>
        )}
      </aside>

      {/* ── Footer principal ─────────────────────────── */}
      <footer className="bg-[#0B0B0C] text-white" aria-label="Pied de page">
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-20 pb-16">

          {/* CTA strip */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20">
            <div>
              <p className="text-[11px] font-mono tracking-widest uppercase text-white/30 mb-5" aria-hidden="true">
                ON COACHING · SANCÉ (MÂCON), FRANCE
              </p>
              <h2 className="text-[2.2rem] md:text-[3rem] font-semibold tracking-tight leading-[1.05] text-white">
                Passez au niveau<br />supérieur.
              </h2>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-4">
              <p className="text-white/40 text-[14px] font-light leading-relaxed max-w-xs lg:text-right">
                Consultation initiale offerte. Sans engagement. Disponible pour de nouveaux accompagnements.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="bg-[#1ab5c7] text-white font-bold text-[13px] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  Contacter un coach
                </Link>
                <Link
                  to="/about"
                  className="border border-white/15 text-white/60 hover:text-white font-medium text-[13px] px-6 py-3 rounded-full hover:border-white/30 transition-all"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-0 border-t border-white/8 mb-16" />

          {/* Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" aria-label="ON Coaching — Accueil" className="flex items-center gap-2.5 mb-4 group">
                <LogoMark size={28} color="white" />
                <span className="font-bold text-[14px] uppercase tracking-tight group-hover:text-[#1ab5c7] transition-colors">Coaching</span>
              </Link>
              <p className="text-white/35 text-[13px] leading-relaxed mb-5">
                Coaching certifié ICF. Mâcon, France. Pour les étudiants, les jeunes adultes et les équipes.
              </p>
              <nav aria-label="Réseaux sociaux" className="flex gap-2">
                {SOCIAL.map(({ platform, href }) => {
                  const Icon = SOCIAL_ICONS[platform] ?? ArrowRight;
                  return (
                    <a
                      key={platform}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      className="w-8 h-8 rounded-full bg-white/8 hover:bg-[#1ab5c7]/20 flex items-center justify-center text-white/40 hover:text-[#1ab5c7] transition-all border border-white/8"
                    >
                      <Icon size={13} aria-hidden="true" />
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Navigation */}
            <nav aria-label="Navigation principale">
              <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-4" aria-hidden="true">Navigation</p>
              <ul className="space-y-2.5">
                {NAV_FOOTER.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className="text-white/50 hover:text-[#1ab5c7] text-[13px] font-medium transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Services */}
            <nav aria-label="Nos services">
              <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-4" aria-hidden="true">Services</p>
              <ul className="space-y-2.5">
                {SERVICES.map(s => (
                  <li key={s.href}>
                    <Link
                      to={s.href}
                      className="text-white/50 hover:text-[#1ab5c7] text-[13px] font-medium transition-colors"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <address className="not-italic">
              <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-4" aria-hidden="true">Contact</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1ab5c7]/60 flex-shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <span className="text-white/40 text-[13px]">14 rue des écureuils, 71000 Sancé</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#1ab5c7]/60 flex-shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <a href={`tel:${SITE.phone}`} className="text-white/40 hover:text-white text-[13px] transition-colors">
                    +33 06 63 04 18 12
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#1ab5c7]/60 flex-shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <a href={`mailto:${SITE.email}`} className="text-white/40 hover:text-white text-[13px] transition-colors">
                    {SITE.email}
                  </a>
                </li>
              </ul>
            </address>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-8 border-t border-white/8">
            <p className="text-white/25 text-[11px] font-mono">
              © {year} ON Coaching · Tous droits réservés.{" "}
              Site par{" "}
              <a
                href="https://www.alhambra-web.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#1ab5c7] transition-colors font-semibold"
              >
                Alhambra Web
              </a>
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1ab5c7] animate-pulse" aria-hidden="true" />
              <span className="text-white/25 text-[11px] font-mono">Disponible pour de nouveaux accompagnements</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
