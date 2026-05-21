import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Users, GraduationCap, Brain, Briefcase, Package, Check, ArrowUpRight } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { fadeInUp, stagger, VP } from "@/lib/motion";
import { CARD_CONFIGS } from "@/lib/config";
import type { TarifsContent } from "@/types";

const PART_ICONS: Record<string, React.ElementType> = {
  individuel: GraduationCap, parental: Users, forfaits: Package,
};

const Nostarifs = () => {
  const { content, loading } = usePageContent<TarifsContent>("nos-tarifs");

  if (loading || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white" aria-label="Chargement…">
          <div className="w-8 h-8 border-2 border-[#1ab5c7] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const { particuliers, entreprises, neurofeedback, cta } = content;

  return (
    <Layout>
      <SEO
        title="Nos Tarifs — Coaching Transparent"
        description="Découvrez nos tarifs clairs et justes pour le coaching individuel, parental et d'équipe. Premier rendez-vous offert, sans engagement."
        canonical="/NosTarifs"
        structuredData={{
          "@context": "https://schema.org",
          "@type":    "ItemList",
          "name":     "Tarifs de coaching | ON Coaching",
          "url":      "https://www.oncoaching.fr/NosTarifs",
        }}
      />

      <div className="w-full bg-white min-h-screen px-4 py-6 md:px-12 md:py-8 space-y-6">

        {/* ── HERO ────────────────────────────────── */}
        <motion.section
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2"
          aria-labelledby="tarifs-h1"
        >
          <motion.div variants={fadeInUp} className="lg:col-span-8">
            <p className="text-[11px] font-mono tracking-widest uppercase text-gray-400 mb-4" aria-hidden="true">
              ↳ Tarifs transparents
            </p>
            <h1 id="tarifs-h1" className="text-[clamp(2.2rem,6vw,5rem)] font-semibold leading-[0.95] tracking-tight text-[#0B0B0C]">
              Des tarifs<br />
              <span style={{ color: "#1ab5c7", WebkitTextStroke: "1px #0B0B0C" }}>clairs &amp; justes.</span>
            </h1>
          </motion.div>
          <motion.div variants={fadeInUp} className="lg:col-span-4 flex flex-col justify-end gap-4">
            <p className="text-[14px] text-gray-500 leading-relaxed">{particuliers.subtitle}</p>
            <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-4 py-2 w-fit">
              <div className="w-2 h-2 rounded-full bg-[#1ab5c7]" aria-hidden="true" />
              <span className="text-[12px] font-bold text-[#0B0B0C]">1er RDV offert</span>
            </div>
          </motion.div>
        </motion.section>

        {/* ── PARTICULIERS ────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={stagger}
          aria-labelledby="tarifs-particuliers"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-2" aria-hidden="true">
                Particuliers
              </p>
              <h2 id="tarifs-particuliers" className="text-[2rem] md:text-[2.6rem] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
                {particuliers.title}
              </h2>
            </div>
            <Link
              to="/contact"
              className="hidden sm:flex items-center gap-2 bg-[#0B0B0C] text-white font-bold text-[12px] px-5 py-2.5 rounded-full hover:opacity-80 transition-opacity flex-shrink-0"
            >
              Prendre RDV <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {particuliers.cards.map((card, i) => {
              const Icon = PART_ICONS[card.key] ?? GraduationCap;
              const c    = CARD_CONFIGS[i];
              return (
                <motion.article
                  key={card.key}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[28px] p-7 flex flex-col"
                  style={{ background: c.bg }}
                >
                  <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center mb-5`} aria-hidden="true">
                    <Icon className={`w-5 h-5 ${c.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <h3 className={`font-bold text-[1rem] tracking-tight mb-5 ${c.text}`}>{card.title}</h3>
                  <ul className="space-y-3 flex-1">
                    {card.items.map((item, j) => (
                      <li key={j} className={`flex items-start gap-2.5 text-[13px] font-medium ${c.itemColor}`}>
                        <Check className={`w-4 h-4 ${c.checkColor} flex-shrink-0 mt-0.5`} strokeWidth={2.5} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <Link
                      to="/contact"
                      className={`text-[12px] font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all ${c.text}`}
                    >
                      Prendre RDV <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* ── ENTREPRISES + NEUROFEEDBACK — dark panel ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={VP} transition={{ duration: 0.6 }}
          className="bg-[#0B0B0C] rounded-[32px] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden"
        >
          {/* Entreprises */}
          <div className="lg:border-r border-white/8 lg:pr-10 pb-10 lg:pb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1ab5c7] flex items-center justify-center" aria-hidden="true">
                <Briefcase className="w-5 h-5 text-[#0B0B0C]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-white/30" aria-hidden="true">Entreprises</p>
                <h2 className="font-bold text-white text-[1.1rem] tracking-tight">{entreprises.title}</h2>
              </div>
            </div>
            <p className="text-white/35 text-[13px] leading-relaxed mb-7">{entreprises.subtitle}</p>
            <ul className="space-y-3 mb-8">
              {entreprises.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/60 text-[13px] font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1ab5c7] flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#0B0B0C] font-bold text-[13px] px-6 py-3 rounded-full hover:bg-[#1ab5c7] transition-colors"
            >
              Demander un devis <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Neurofeedback */}
          <div className="lg:pl-10 pt-10 lg:pt-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center" aria-hidden="true">
                <Brain className="w-5 h-5 text-[#1ab5c7]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#1ab5c7]/50" aria-hidden="true">Neurofeedback</p>
                <h2 className="font-bold text-white text-[1.1rem] tracking-tight">{neurofeedback.title}</h2>
              </div>
            </div>
            <p className="text-white/35 text-[13px] leading-relaxed mb-7">{neurofeedback.subtitle}</p>

            <div className="space-y-5">
              {neurofeedback.cards.map(card => (
                <div key={card.key} className="border-b border-white/8 pb-5 last:border-0 last:pb-0">
                  <h3 className="font-bold text-[#1ab5c7] text-[13px] mb-3 tracking-tight">{card.title}</h3>
                  {card.items && (
                    <ul className="space-y-2">
                      {card.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2.5 text-white/50 text-[13px]">
                          <Check className="w-3.5 h-3.5 text-[#1ab5c7]/60 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {card.description && (
                    <p className="text-white/40 text-[13px] leading-relaxed">
                      {card.description} — <span className="text-[#1ab5c7] font-bold">{card.note}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── CTA ─────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={VP} transition={{ duration: 0.6 }}
          className="text-center py-12 space-y-6"
        >
          <h2 className="text-[2rem] md:text-[3rem] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
            {cta.title}
          </h2>
          <p className="text-gray-500 text-[14px] max-w-md mx-auto">{cta.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to={cta.buttonLink}
              className="bg-[#0B0B0C] text-white font-bold text-[13px] px-7 py-3.5 rounded-full flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {cta.buttonText} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/about"
              className="bg-[#F3F4F6] text-[#0B0B0C] font-bold text-[13px] px-7 py-3.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Notre approche
            </Link>
          </div>
        </motion.section>

      </div>
    </Layout>
  );
};

export default Nostarifs;
