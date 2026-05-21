import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import { useTilt } from "@/hooks/useTilt";
import {
  BrainCircuit, Info, Users, Target, Activity, Brain,
  Check, ArrowUpRight, ChevronRight, Zap, Heart,
  Wind, Focus, Star, Smile, GraduationCap,
} from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import {
  fadeInUp, blurInUp, staggerContainer, staggerFast,
  springUp, springLeft, springRight, btnHoverProps,
  VP, VP2,
} from "@/lib/motion";
import type { ServicePageContent } from "@/types";

const TAB_ICONS: Record<string, React.ElementType> = {
  accompagnement:  BrainCircuit,
  definition:      Info,
  pourqui:         Users,
  resultats:       Target,
  deroulement:     Activity,
  complementarite: Brain,
};

const HERO_IMG    = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85";
const COACH_PHOTO = `${import.meta.env.BASE_URL}patron.png`;

const PROBLEMS = [
  { icon: Zap,         text: "Stress chronique et anxiété persistante" },
  { icon: Focus,       text: "Difficultés de concentration et d'attention (TDA/H)" },
  { icon: Wind,        text: "Troubles du sommeil et fatigue profonde" },
  { icon: Brain,       text: "Troubles Dys : dyslexie, dyscalculie, dyspraxie…" },
  { icon: Heart,       text: "Burn-out, épuisement émotionnel et surcharge" },
  { icon: Star,        text: "Recherche d'optimisation cognitive et de performance" },
];

const BENEFITS = [
  {
    icon: Zap,
    title: "Réduction du stress",
    desc: "Entraîner ton cerveau à s'autoréguler pour diminuer significativement le stress, l'anxiété et l'émotivité.",
  },
  {
    icon: Focus,
    title: "Concentration maximale",
    desc: "Amélioration de l'attention, de la mémoire de travail et de la flexibilité mentale pour performer durablement.",
  },
  {
    icon: Wind,
    title: "Sommeil réparateur",
    desc: "Rééquilibrer les ondes cérébrales pour retrouver un sommeil profond et des nuits véritablement récupératrices.",
  },
  {
    icon: Brain,
    title: "Dépasser les troubles Dys",
    desc: "Protocoles spécifiques pour les troubles neurodéveloppementaux : TDA/H, dyslexie, dyscalculie, dyspraxie.",
  },
  {
    icon: Star,
    title: "Performance cognitive",
    desc: "Optimiser la concentration, la créativité et la prise de décision pour les sportifs, artistes et dirigeants.",
  },
  {
    icon: Smile,
    title: "Bien-être global",
    desc: "Un cerveau plus équilibré se traduit par plus de sérénité, de confiance et une meilleure qualité de vie.",
  },
];

const HERO_WORDS = ["Coaching", "&", "Neurofeedback"];

const CoachingNeurofeedback = () => {
  const { content, loading } = usePageContent<ServicePageContent>("coaching-neurofeedback");
  const [activeTab, setActiveTab] = useState("accompagnement");

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
        title="Coaching & Neurofeedback — Entraînement cérébral — ON Coaching Mâcon"
        description="Neurofeedback certifié à Mâcon : entraînement cérébral non invasif pour réduire le stress, améliorer la concentration et les performances cognitives. 1er RDV offert."
        canonical="/coaching-neurofeedback"
        structuredData={{
          "@context": "https://schema.org",
          "@type":    "Service",
          "name":     "Coaching & Neurofeedback",
          "url":      "https://www.oncoaching.fr/coaching-neurofeedback",
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
              aria-labelledby="nf-h1"
            >
              <motion.p variants={fadeInUp} className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7]" aria-hidden="true">
                ↳ Neurofeedback
              </motion.p>

              <h1 id="nf-h1" className="text-[clamp(2.8rem,6vw,5.5rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1.05] overflow-hidden">
                {HERO_WORDS.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 160, delay: i * 0.1 }}
                    className={`inline-block mr-3 ${word === "&" ? "text-[#1ab5c7]" : ""}`}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p variants={blurInUp} className="text-gray-500 text-[16px] leading-relaxed max-w-md">
                {page.subtitle} Une approche douce et scientifiquement validée pour libérer le plein potentiel de votre cerveau.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-bold text-[14px] px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
                    aria-label="Réserver une séance découverte neurofeedback"
                  >
                    Séance découverte <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
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
                alt="Coaching et neurofeedback — entraînement cérébral — ON Coaching Mâcon"
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
                Coaching &amp; Neurofeedback
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
                Vous concerné ?
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight mb-10"
              >
                Ces difficultés vous parlent&nbsp;?
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
                Résultats
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-white leading-tight mb-10"
              >
                Ce que le neurofeedback vous apporte
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
            aria-label="Services de neurofeedback"
          >
            <div className="flex flex-col lg:flex-row min-h-[540px]">
              <nav aria-label="Onglets neurofeedback" className="lg:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/8">
                <div className="p-6 space-y-1">
                  {tabs.map(tab => {
                    const Icon     = TAB_ICONS[tab.key] ?? Target;
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        aria-selected={isActive}
                        aria-controls="tab-panel-nf"
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

              <div id="tab-panel-nf" role="tabpanel" className="flex-1 p-8 lg:p-10">
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

                      {activeData.paragraphs?.map((p, i) => (
                        <p key={i} className="text-white/55 text-[15px] leading-relaxed mb-4">{p}</p>
                      ))}

                      {activeData.paragraph && !activeData.paragraphs && (
                        <p className="text-white/55 text-[15px] leading-relaxed mb-4">{activeData.paragraph}</p>
                      )}

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

                      {activeData.steps && (
                        <ol className="space-y-3 mt-2 list-none">
                          {activeData.steps.map((step, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.07, duration: 0.3 }}
                              className="flex items-start gap-3 text-white/65 text-[14px]"
                            >
                              <span
                                className="w-5 h-5 rounded-full bg-[#1ab5c7]/20 text-[#1ab5c7] text-[10px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5"
                                aria-hidden="true"
                              >
                                {i + 1}
                              </span>
                              {step}
                            </motion.li>
                          ))}
                        </ol>
                      )}

                      {activeData.note && (
                        <p className="mt-4 text-white/30 text-[12px] italic">{activeData.note}</p>
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
              <p className="text-white/20 text-[12px] font-mono">Consultation initiale gratuite · Sans engagement</p>
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
                  alt="Noureddine Omar — Coach certifié ICF & Neurofeedback, ON Coaching Mâcon"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  <span className="bg-[#1ab5c7] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full">Certifié Neurofeedback</span>
                  <span className="bg-white/10 text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">Coach ICF</span>
                </div>
              </motion.div>

              <motion.div variants={springRight} className="space-y-6">
                <div>
                  <p className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7]/70 mb-3" aria-hidden="true">Le praticien</p>
                  <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold tracking-tight text-white leading-tight">
                    Expertise neuroscientifique &amp; coaching
                  </h2>
                </div>
                <p className="text-white/60 text-[15px] leading-relaxed">
                  Certifié en neurofeedback et coach ICF, je combine la compréhension fine du fonctionnement cérébral
                  avec des outils de coaching puissants. Cette double approche permet d'agir à la fois sur les
                  mécanismes neurologiques et sur les comportements pour des résultats durables.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: BrainCircuit,  label: "Certifié praticien en Neurofeedback" },
                    { icon: GraduationCap, label: "Coach certifié ICF — Prisme Évolution" },
                    { icon: Brain,         label: "26 ans d'expérience pédagogique et humaine" },
                    { icon: Smile,         label: "Approche douce, non invasive et scientifiquement validée" },
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
        <section className="py-20 md:py-28 bg-[#1ab5c7]" aria-label="Tarif et prise de rendez-vous">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden" whileInView="visible" viewport={VP} variants={staggerFast}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            >
              <motion.div variants={springLeft} className="space-y-6">
                <p className="font-mono tracking-widest uppercase text-[10px] text-white/60" aria-hidden="true">Tarif</p>
                <div>
                  <span className="text-[4rem] font-bold text-white leading-none">À partir de 60€</span>
                  <span className="text-white/60 text-[16px] ml-2">/ séance</span>
                </div>
                <ul className="space-y-3">
                  {[
                    "Bilan initial offert — sans engagement",
                    "Protocole personnalisé selon votre profil",
                    "Séances de 30 à 45 minutes",
                    "Suivi et ajustement tout au long du programme",
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
                    aria-label="Prendre rendez-vous pour une séance neurofeedback"
                  >
                    Prendre rendez-vous <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                </motion.div>
                <p className="text-center text-white/60 text-[13px] font-mono">1er RDV offert · Confidentiel · Sans engagement</p>
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

export default CoachingNeurofeedback;
