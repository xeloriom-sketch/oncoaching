import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Users, Target, Settings, Check, ArrowUpRight, ChevronRight } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { fadeInUp, staggerContainer, VP } from "@/lib/motion";
import type { ServicePageContent } from "@/types";

const TAB_ICONS: Record<string, React.ElementType> = {
  vision:    Users,
  objectifs: Target,
  methodes:  Settings,
};

const HERO_IMG =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=80&auto=format&fit=crop";

const CoachingEquipe = () => {
  const { content, loading } = usePageContent<ServicePageContent>("coaching-equipe");
  const [activeTab, setActiveTab] = useState("vision");

  if (loading || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white" aria-label="Chargement…">
          <div className="w-8 h-8 border-2 border-[#1ab5c7] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const { page, tabs, cta } = content;
  const activeData = tabs.find(t => t.key === activeTab);

  return (
    <Layout>
      <SEO
        title="Coaching d'Équipe — Cohésion & Performance"
        description="Coaching d'équipe certifié ICF à Mâcon. Cohésion, communication et intelligence collective pour TPE, PME et organisations. 26 ans d'expérience."
        canonical="/coaching-equipe"
        structuredData={{
          "@context": "https://schema.org",
          "@type":    "Service",
          "name":     "Coaching d'Équipe",
          "url":      "https://www.oncoaching.fr/coaching-equipe",
          "provider": { "@id": "https://www.oncoaching.fr/#business" },
        }}
      />

      <div className="w-full bg-white min-h-screen px-4 py-6 md:px-12 md:py-8 space-y-6">

        {/* ── HERO TEXT ───────────────────────────── */}
        <motion.header
          initial="hidden" animate="visible" variants={staggerContainer}
          className="space-y-3"
          aria-labelledby="equipe-h1"
        >
          <motion.p variants={fadeInUp} className="font-mono tracking-widest uppercase text-[10px] text-gray-400" aria-hidden="true">
            ↳ Coaching d'Équipe
          </motion.p>
          <motion.h1
            id="equipe-h1"
            variants={fadeInUp}
            className="text-[clamp(2.2rem,6vw,5rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1]"
          >
            {page.title}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-500 text-[15px] max-w-xl">
            {page.subtitle}
          </motion.p>
        </motion.header>

        {/* ── HERO IMAGE ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[260px] sm:h-[380px] rounded-[32px] overflow-hidden"
        >
          <img
            src={HERO_IMG}
            alt="Coaching d'équipe — cohésion et performance collective — ON Coaching"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute bottom-4 left-4 bg-[#1ab5c7] text-white px-4 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase font-semibold"
          >
            Cohésion &amp; Performance Collective
          </motion.div>
        </motion.div>

        {/* ── DARK TABS PANEL ─────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp}
          className="bg-[#0B0B0C] rounded-[32px] overflow-hidden"
          aria-label="Services de coaching d'équipe"
        >
          <div className="flex flex-col lg:flex-row min-h-[500px]">

            {/* Left nav */}
            <nav aria-label="Onglets" className="lg:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/8">
              <div className="p-6 space-y-1">
                {tabs.map(tab => {
                  const Icon     = TAB_ICONS[tab.key] ?? Target;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      aria-selected={isActive}
                      aria-controls="tab-panel-equipe"
                      role="tab"
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 min-h-[44px] ${
                        isActive ? "bg-white text-[#0B0B0C]" : "text-white/40 hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive ? "bg-[#1ab5c7] text-white" : "bg-white/5"
                        }`}
                        aria-hidden="true"
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#0B0B0C]" : "text-white/40"}`} strokeWidth={1.8} />
                      </div>
                      <span className="font-semibold text-[13px] tracking-tight leading-snug flex-1">{tab.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 text-[#1ab5c7] flex-shrink-0" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Right content */}
            <div id="tab-panel-equipe" role="tabpanel" className="flex-1 p-8 lg:p-10">
              <AnimatePresence mode="wait">
                {activeData && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h2 className="font-semibold tracking-tight text-white text-[1.25rem] mb-5 leading-snug">
                      {activeData.label}
                    </h2>

                    {activeData.tagline && (
                      <p className="text-[#1ab5c7]/80 text-[13px] font-mono tracking-wide mb-4">
                        {activeData.tagline}
                      </p>
                    )}

                    {page.intro && activeTab === "vision" && (
                      <p className="text-white/50 text-[14px] leading-relaxed mb-4">{page.intro}</p>
                    )}

                    {activeData.paragraphs?.map((p, i) => (
                      <p key={i} className="text-white/50 text-[14px] leading-relaxed mb-4">{p}</p>
                    ))}

                    {activeData.items && (
                      <ul className="space-y-3 mt-2">
                        {activeData.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-white/60 text-[13px]">
                            <Check className="w-4 h-4 text-[#1ab5c7]/70 flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {activeData.quote && (
                      <blockquote className="mt-6 text-white/40 text-[13px] italic border-l-2 border-[#1ab5c7]/30 pl-4 leading-relaxed">
                        {activeData.quote}
                      </blockquote>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom CTA bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-8 py-5 border-t border-white/8">
            <p className="text-white/20 text-[12px] font-mono">Consultation initiale gratuite · Sans engagement</p>
            <Link
              to={cta.buttonLink}
              className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-semibold text-[13px] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              {cta.buttonText} <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </motion.section>

        {/* ── CTA ─────────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp}
          className="text-center py-10 space-y-5"
        >
          <h2 className="text-[clamp(1.6rem,4vw,3rem)] font-semibold tracking-tight text-[#0B0B0C]">{cta.title}</h2>
          <p className="text-gray-500 text-[14px] max-w-md mx-auto">{cta.subtitle}</p>
          <Link
            to={cta.buttonLink}
            className="inline-flex items-center gap-2 bg-[#0B0B0C] text-white font-medium text-[13px] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            {cta.buttonText} <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </motion.section>

      </div>
    </Layout>
  );
};

export default CoachingEquipe;
