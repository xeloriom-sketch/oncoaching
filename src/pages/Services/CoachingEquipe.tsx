import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import { useTilt } from "@/hooks/useTilt";
import {
  Users, Target, Settings, Check, ArrowUpRight, ChevronRight,
  MessageSquare, Handshake, Zap, TrendingUp, Shield, Lightbulb,
  GraduationCap, Brain,
} from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import {
  fadeInUp, blurInUp, staggerContainer, staggerFast,
  springUp, springLeft, springRight, btnHoverProps,
  VP, VP2,
} from "@/lib/motion";
import type { ServicePageContent } from "@/types";

const TAB_ICONS: Record<string, React.ElementType> = {
  vision:    Users,
  objectifs: Target,
  methodes:  Settings,
};

const HERO_IMG    = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85";
const COACH_PHOTO = `${import.meta.env.BASE_URL}patron.png`;

const PROBLEMS = [
  { icon: MessageSquare, text: "Communication difficile entre les membres de l'équipe" },
  { icon: Shield,        text: "Manque de confiance et tensions relationnelles" },
  { icon: Target,        text: "Objectifs flous ou mal alignés au sein du groupe" },
  { icon: TrendingUp,    text: "Performance collective en dessous du potentiel réel" },
  { icon: Zap,           text: "Conflits récurrents qui freinent la productivité" },
  { icon: Handshake,     text: "Difficulté à fédérer autour d'une vision commune" },
];

const BENEFITS = [
  {
    icon: Handshake,
    title: "Cohésion renforcée",
    desc: "Tisser des liens solides entre les membres de l'équipe pour créer un sentiment d'appartenance et de solidarité durable.",
  },
  {
    icon: MessageSquare,
    title: "Communication fluide",
    desc: "Développer une culture d'écoute active et d'expression constructive pour résoudre les malentendus et aligner les perspectives.",
  },
  {
    icon: Target,
    title: "Vision partagée",
    desc: "Clarifier les valeurs, la mission et les objectifs communs pour que chaque membre sache pourquoi et comment il contribue.",
  },
  {
    icon: TrendingUp,
    title: "Performance décuplée",
    desc: "Identifier et activer les leviers collectifs pour dépasser les blocages et libérer le plein potentiel du groupe.",
  },
  {
    icon: Shield,
    title: "Gestion des conflits",
    desc: "Transformer les tensions en opportunités de croissance grâce à des outils de médiation et de dialogue constructif.",
  },
  {
    icon: Lightbulb,
    title: "Intelligence collective",
    desc: "Mobiliser la créativité et l'expertise de chacun pour innover, résoudre les problèmes et décider ensemble.",
  },
];

const HERO_WORDS = ["Coaching", "d'Équipe"];

const CoachingEquipe = () => {
  const { content, loading } = usePageContent<ServicePageContent>("coaching-equipe");
  const [activeTab, setActiveTab] = useState("vision");

  const tilt0 = useTilt(10);
  const tilt1 = useTilt(10);
  const tilt2 = useTilt(10);
  const tilt3 = useTilt(10);
  const tilt4 = useTilt(10);
  const tilt5 = useTilt(10);
  const tiltRefs = [tilt0, tilt1, tilt2, tilt3, tilt4, tilt5];

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
        title="Coaching d'Équipe — Cohésion & Performance — ON Coaching Mâcon"
        description="Coaching d'équipe certifié ICF à Mâcon. Cohésion, communication et intelligence collective pour TPE, PME et organisations. 26 ans d'expérience. 1er RDV offert."
        canonical="/coaching-equipe"
        structuredData={{
          "@context": "https://schema.org",
          "@type":    "Service",
          "name":     "Coaching d'Équipe",
          "url":      "https://www.oncoaching.fr/coaching-equipe",
          "provider": { "@id": "https://www.oncoaching.fr/#business" },
        }}
      />

      <div className="w-full bg-white min-h-screen overflow-x-hidden">

        {/* ── HERO SPLIT ──────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <motion.div
              initial="hidden" animate="visible" variants={staggerContainer}
              className="space-y-7"
              aria-labelledby="equipe-h1"
            >
              <motion.p variants={fadeInUp} className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7]" aria-hidden="true">
                ↳ Coaching d'Équipe
              </motion.p>

              <h1 id="equipe-h1" className="text-[clamp(2.8rem,6vw,5.5rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1.05] overflow-hidden">
                {HERO_WORDS.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 160, delay: i * 0.12 }}
                    className="block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p variants={blurInUp} className="text-gray-500 text-[16px] leading-relaxed max-w-md">
                {page.subtitle} Transformer vos groupes de travail en équipes engagées, alignées et performantes.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-bold text-[14px] px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
                    aria-label="Réserver un diagnostic équipe gratuit"
                  >
                    Diagnostic équipe gratuit <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.div>
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/nos-tarifs"
                    className="inline-flex items-center gap-2 bg-[#F3F4F6] text-[#0B0B0C] font-semibold text-[14px] px-7 py-3.5 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Voir les tarifs
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={springRight}
              initial="hidden"
              animate="visible"
              className="relative h-[450px] rounded-[32px] overflow-hidden group"
            >
              <motion.img
                src={HERO_IMG}
                alt="Coaching d'équipe — cohésion et performance collective — ON Coaching Mâcon"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/60 via-transparent to-transparent" />
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-5 left-5 bg-[#1ab5c7] text-white px-4 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase font-semibold"
              >
                Cohésion &amp; Performance Collective
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── PROBLÈMES / DÉFIS ──────────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-[#F3F4F6]">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="font-mono tracking-widest uppercase text-[10px] text-gray-400 mb-3" aria-hidden="true">
                Votre équipe concernée ?
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight mb-10"
              >
                Ces défis vous sont familiers&nbsp;?
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROBLEMS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={springUp}
                      className="bg-white rounded-[20px] px-6 py-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#1ab5c7]/10 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                        <Icon className="w-4 h-4 text-[#1ab5c7]" strokeWidth={1.8} />
                      </div>
                      <p className="text-[#0B0B0C] text-[15px] leading-snug font-medium">{item.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── BÉNÉFICES — DARK + SPOTLIGHT + TILT ───────────────────── */}
        <section className="py-20 md:py-28 bg-[#0B0B0C]">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7]/70 mb-3" aria-hidden="true">
                Bénéfices
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-white leading-tight mb-10"
              >
                Ce que votre équipe va gagner
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {BENEFITS.map((b, i) => {
                  const Icon = b.icon;
                  const tilt = tiltRefs[i];
                  return (
                    <motion.div key={i} variants={springUp} className="h-full">
                      <SpotlightCard
                        className="h-full rounded-[24px] border border-white/8 bg-white/[0.03]"
                        spotlightColor="rgba(26,181,199,0.15)"
                      >
                        <div
                          ref={tilt.ref}
                          onMouseMove={tilt.onMouseMove}
                          onMouseLeave={tilt.onMouseLeave}
                          onMouseEnter={tilt.onMouseEnter}
                          className="p-7 flex flex-col gap-5 h-full"
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <motion.div
                            className="w-11 h-11 rounded-xl bg-[#1ab5c7] flex items-center justify-center flex-shrink-0"
                            whileHover={{ rotate: [0, -12, 12, 0], transition: { duration: 0.4 } }}
                            aria-hidden="true"
                          >
                            <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                          </motion.div>
                          <h3 className="text-white font-bold text-[17px] leading-snug">{b.title}</h3>
                          <p className="text-white/60 text-[14px] leading-relaxed flex-1">{b.desc}</p>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── TABS PANEL ─────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 md:px-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp}
            className="bg-[#0B0B0C] rounded-[32px] overflow-hidden"
            aria-label="Services de coaching d'équipe"
          >
            <div className="flex flex-col lg:flex-row min-h-[480px]">
              <nav aria-label="Onglets coaching équipe" className="lg:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/8">
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
                          isActive ? "bg-white text-[#0B0B0C]" : "text-white/40 hover:bg-white/5 hover:text-white/70"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            isActive ? "bg-[#1ab5c7]" : "bg-white/5"
                          }`}
                          aria-hidden="true"
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-white/40"}`} strokeWidth={1.8} />
                        </div>
                        <span className="font-semibold text-[13px] tracking-tight leading-snug flex-1">{tab.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 text-[#1ab5c7] flex-shrink-0" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </nav>

              <div id="tab-panel-equipe" role="tabpanel" className="flex-1 p-8 lg:p-10">
                <AnimatePresence mode="wait">
                  {activeData && (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <h2 className="font-semibold tracking-tight text-white text-[1.3rem] mb-5 leading-snug">
                        {activeData.label}
                      </h2>

                      {activeData.tagline && (
                        <p className="text-[#1ab5c7]/80 text-[13px] font-mono tracking-wide mb-5">
                          {activeData.tagline}
                        </p>
                      )}

                      {page.intro && activeTab === "vision" && (
                        <p className="text-white/55 text-[15px] leading-relaxed mb-4">{page.intro}</p>
                      )}

                      {activeData.paragraphs?.map((p, i) => (
                        <p key={i} className="text-white/55 text-[15px] leading-relaxed mb-4">{p}</p>
                      ))}

                      {activeData.items && (
                        <ul className="space-y-3 mt-2">
                          {activeData.items.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.07, duration: 0.3 }}
                              className="flex items-start gap-3 text-white/65 text-[14px]"
                            >
                              <Check className="w-4 h-4 text-[#1ab5c7] flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      )}

                      {activeData.quote && (
                        <blockquote className="mt-7 text-white/45 text-[13px] italic border-l-2 border-[#1ab5c7]/40 pl-5 leading-relaxed">
                          {activeData.quote}
                        </blockquote>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-8 py-5 border-t border-white/8">
              <p className="text-white/20 text-[12px] font-mono">Diagnostic initial gratuit · Sans engagement</p>
              <motion.div {...btnHoverProps}>
                <Link
                  to={cta.buttonLink}
                  className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-semibold text-[13px] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  {cta.buttonText} <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── COACH BIO DARK ─────────────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-[#0B0B0C]">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div
                variants={springLeft}
                className="relative h-[380px] rounded-[32px] overflow-hidden group"
              >
                <img
                  src={COACH_PHOTO}
                  alt="Noureddine Omar — Coach certifié ICF, spécialiste coaching d'équipe — ON Coaching Mâcon"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  <span className="bg-[#1ab5c7] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full">Coach certifié ICF</span>
                  <span className="bg-white/10 text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">26 ans d'exp.</span>
                </div>
              </motion.div>

              <motion.div variants={springRight} className="space-y-6">
                <div>
                  <p className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7]/70 mb-3" aria-hidden="true">Le coach d'équipe</p>
                  <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold tracking-tight text-white leading-tight">
                    Pédagogue, sociologue &amp; coach certifié
                  </h2>
                </div>
                <p className="text-white/60 text-[15px] leading-relaxed">
                  Fort de 26 ans d'enseignement en sciences économiques et sociales, j'ai développé une expertise
                  unique sur les dynamiques collectives et les organisations. Coach certifié ICF spécialisé en
                  coaching d'équipe, j'allie analyse sociologique et outils de coaching pour transformer vos équipes.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: GraduationCap, label: "26 ans d'enseignement SES — dynamiques sociales" },
                    { icon: Users,         label: "Coach certifié ICF — spécialiste équipes" },
                    { icon: Brain,         label: "Double expertise : pédagogie & intelligence collective" },
                    { icon: Lightbulb,     label: "Méthodes expérientielles et facilitation active" },
                  ].map(({ icon: Icon, label }, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VP2}
                      transition={{ delay: i * 0.08, type: "spring", damping: 22, stiffness: 180 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#1ab5c7] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
                      </div>
                      <span className="text-white/70 text-[14px]">{label}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-bold text-[14px] px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Prendre rendez-vous <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── TARIF + CTA ─────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-[#1ab5c7]" aria-label="Tarif et prise de rendez-vous coaching équipe">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden" whileInView="visible" viewport={VP} variants={staggerFast}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            >
              <motion.div variants={springLeft} className="space-y-6">
                <p className="font-mono tracking-widest uppercase text-[10px] text-white/60" aria-hidden="true">Tarif</p>
                <div>
                  <span className="text-[3.5rem] font-bold text-white leading-none">Sur devis</span>
                  <p className="text-white/70 text-[15px] mt-2">Adapté à la taille de votre équipe et à vos objectifs</p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Diagnostic de l'équipe offert — sans engagement",
                    "Programme sur mesure selon vos besoins",
                    "Ateliers en présentiel ou en format hybride",
                    "Évaluation à chaud et à froid incluse",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white text-[15px]">
                      <Check className="w-4 h-4 text-white/70 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={springRight} className="space-y-4">
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0B0B0C] text-white font-bold text-[16px] px-8 py-5 rounded-2xl hover:opacity-90 transition-opacity"
                    aria-label="Demander un devis pour coaching d'équipe"
                  >
                    Demander un devis <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                </motion.div>
                <p className="text-center text-white/60 text-[13px] font-mono">Diagnostic offert · Confidentiel · Sans engagement</p>
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/nos-tarifs"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold text-[14px] px-8 py-4 rounded-2xl hover:bg-white/25 transition-colors backdrop-blur-sm"
                  >
                    Voir tous les tarifs
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default CoachingEquipe;
