import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import { useTilt } from "@/hooks/useTilt";
import {
  Compass, Zap, Clock, Shield, TrendingUp, Smile,
  Star, GraduationCap, Users, Target, ArrowUpRight, Check,
} from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import {
  fadeInUp, blurInUp, staggerContainer, staggerFast,
  springUp, springLeft, springRight,
  btnHoverProps, VP, VP2,
} from "@/lib/motion";
import type { ServicePageContent } from "@/types";

const HERO_IMG    = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=85";
const COACH_PHOTO = `${import.meta.env.BASE_URL}patron.png`;

const PROBLEMS = [
  { icon: Compass,    text: "Tu te sens perdu dans tes choix d'orientation" },
  { icon: Zap,        text: "La motivation n'est plus au rendez-vous" },
  { icon: Clock,      text: "Procrastination et gestion du temps difficile" },
  { icon: Shield,     text: "Stress, pression et gestion des émotions" },
  { icon: TrendingUp, text: "Auto-sabotage et manque de confiance" },
  { icon: Smile,      text: "Besoin de sens et de reconnexion avec toi-même" },
];

const BENEFITS = [
  {
    icon: Compass,
    title: "Clarté & Direction",
    desc: "Identifier tes envies profondes, construire un projet de vie qui te ressemble et avancer avec conviction.",
  },
  {
    icon: Shield,
    title: "Confiance en soi",
    desc: "Dépasser les blocages, l'auto-sabotage et les croyances limitantes pour te révéler à toi-même.",
  },
  {
    icon: Zap,
    title: "Énergie & Motivation",
    desc: "Retrouver l'élan et la motivation nécessaires pour agir, même face aux obstacles.",
  },
  {
    icon: Clock,
    title: "Organisation & Méthode",
    desc: "Des outils concrets pour mieux gérer ton temps, tes priorités et ton énergie au quotidien.",
  },
  {
    icon: Smile,
    title: "Équilibre émotionnel",
    desc: "Apprendre à réguler tes émotions, réduire le stress et cultiver un état d'esprit serein.",
  },
  {
    icon: Star,
    title: "Projet de vie épanouissant",
    desc: "Co-construire un cap personnalisé, trouver du sens et avancer vers ce qui compte vraiment pour toi.",
  },
];

const HERO_WORDS = ["Jeunes", "&", "Jeunes", "Adultes"];

const CoachingJeunes = () => {
  const { content, loading } = usePageContent<ServicePageContent>("coaching-jeunes");

  const t0 = useTilt(10);
  const t1 = useTilt(10);
  const t2 = useTilt(10);
  const t3 = useTilt(10);
  const t4 = useTilt(10);
  const t5 = useTilt(10);
  const tiltRefs = [t0, t1, t2, t3, t4, t5];

  if (loading || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white" aria-label="Chargement…">
          <div className="w-8 h-8 border-2 border-[#1ab5c7] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const { page, cta } = content;

  return (
    <Layout>
      <SEO
        title="Coaching Jeunes & Jeunes Adultes — ON Coaching Mâcon"
        description="Coach certifié pour jeunes et jeunes adultes (15-30 ans) à Sancé (Mâcon). Orientation, projet de vie, confiance en soi, gestion du stress. 1er RDV offert."
        canonical="/coaching-jeunes"
        structuredData={{
          "@context": "https://schema.org",
          "@type":    "Service",
          "name":     "Coaching Jeunes & Jeunes Adultes",
          "url":      "https://www.oncoaching.fr/coaching-jeunes",
          "provider": { "@id": "https://www.oncoaching.fr/#business" },
        }}
      />

      <div className="w-full bg-white min-h-screen overflow-x-hidden">

        {/* 01. HERO */}
        <section className="pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-7"
                aria-labelledby="jeunes-h1"
              >
                <motion.p
                  variants={fadeInUp}
                  className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7]"
                  aria-hidden="true"
                >
                  ↳ Coaching Jeunes
                </motion.p>

                <h1
                  id="jeunes-h1"
                  className="text-[clamp(2.2rem,6vw,5rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1.15]"
                >
                  <div>{page.title.split(" ").slice(0, 2).join(" ")}</div>
                  <div className="flex flex-wrap gap-x-3">
                    {HERO_WORDS.map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          damping: 18,
                          stiffness: 160,
                          delay: i * 0.08,
                        }}
                        className="inline-block"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                </h1>

                <motion.p
                  variants={blurInUp}
                  className="text-gray-500 text-[16px] leading-relaxed max-w-md"
                >
                  {page.subtitle} Un espace bienveillant pour traverser les transitions de vie avec clarté, confiance et élan.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                  <motion.div {...btnHoverProps}>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-bold text-[14px] px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
                      aria-label="Réserver un premier échange gratuit"
                    >
                      1er échange gratuit <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
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
                className="relative h-[460px] rounded-[32px] overflow-hidden group"
              >
                <img
                  src={HERO_IMG}
                  alt="Coaching jeunes et jeunes adultes — ON Coaching Mâcon"
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
                  Coaching Jeunes &amp; Jeunes Adultes
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 02. DÉFIS */}
        <section className="py-20 bg-[#F3F4F6]">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerContainer}
            >
              <motion.p
                variants={fadeInUp}
                className="font-mono tracking-widest uppercase text-[10px] text-gray-400 mb-3"
                aria-hidden="true"
              >
                Tu te reconnais ?
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight mb-10"
              >
                Ces défis te parlent&nbsp;?
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-7">
                {PROBLEMS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={springUp}
                      className="flex items-start gap-4"
                    >
                      <div
                        className="w-9 h-9 rounded-full bg-[#1ab5c7]/15 flex items-center justify-center flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        <Icon className="w-4 h-4 text-[#1ab5c7]" strokeWidth={1.8} />
                      </div>
                      <p className="text-[#0B0B0C] text-[15px] leading-snug font-medium pt-1.5">
                        {item.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 03. CE QUE TU VAS GAGNER */}
        <section className="py-20 bg-[#0B0B0C]">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerContainer}
            >
              <motion.p
                variants={fadeInUp}
                className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7]/70 mb-3"
                aria-hidden="true"
              >
                Bénéfices
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-white leading-tight mb-10"
              >
                Ce que tu vas gagner
              </motion.h2>

              <SpotlightCard
                className="rounded-[32px] border border-white/8 bg-transparent"
                spotlightColor="rgba(26,181,199,0.12)"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8 rounded-[32px] overflow-hidden">
                  {BENEFITS.map((b, i) => {
                    const Icon = b.icon;
                    const tilt = tiltRefs[i];
                    return (
                      <motion.div key={i} variants={springUp} className="bg-[#0B0B0C]">
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
                          <p className="text-white/60 text-[15px] leading-relaxed flex-1">{b.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </section>

        {/* 04. COACH BIO */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div
                variants={springLeft}
                className="relative h-[440px] rounded-[32px] overflow-hidden group"
              >
                <img
                  src={COACH_PHOTO}
                  alt="Noureddine Omar — Coach certifié ICF, ON Coaching Mâcon"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex gap-2 flex-wrap">
                  <span className="bg-[#1ab5c7] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full">
                    Coach certifié ICF
                  </span>
                  <span className="bg-white/15 text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
                    26 ans d'expérience
                  </span>
                </div>
              </motion.div>

              <motion.div variants={springRight} className="space-y-6">
                <div>
                  <p className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7] mb-3" aria-hidden="true">
                    Le coach
                  </p>
                  <h2 className="text-[clamp(1.6rem,3.5vw,2rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
                    Un accompagnateur qui te comprend
                  </h2>
                </div>
                <p className="text-gray-500 text-[16px] leading-relaxed">
                  Pendant plus de 26 ans, j'ai accompagné des jeunes au cœur des enjeux éducatifs et personnels.
                  Coach certifié et ancien enseignant en SES, je comprends les défis uniques que traversent les jeunes
                  et jeunes adultes d'aujourd'hui.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: GraduationCap, label: "26 ans d'expérience auprès des jeunes" },
                    { icon: Users,         label: "Coach certifié ICF — Prisme Évolution" },
                    { icon: Target,        label: "Spécialisé orientation & projet de vie" },
                    { icon: Smile,         label: "Posture bienveillante et sans jugement" },
                  ].map(({ icon: Icon, label }, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VP2}
                      transition={{ delay: i * 0.08, type: "spring", damping: 22, stiffness: 180 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-8 h-8 rounded-xl bg-[#1ab5c7] flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
                      </div>
                      <span className="text-[#0B0B0C]/70 text-[14px]">{label}</span>
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

        {/* 05. TARIF + CTA */}
        <section className="py-20 bg-[#1ab5c7]" aria-label="Tarif et prise de rendez-vous">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerFast}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            >
              <motion.div variants={springLeft} className="space-y-6">
                <p className="font-mono tracking-widest uppercase text-[10px] text-white/60" aria-hidden="true">
                  Tarif
                </p>
                <div>
                  <span className="text-[clamp(2.8rem,5vw,4.5rem)] font-bold text-white leading-none">
                    À partir de 60€
                  </span>
                  <span className="text-white/60 text-[16px] ml-2">/ séance</span>
                </div>
                <ul className="space-y-3">
                  {[
                    "Bilan de départ offert — sans engagement",
                    "Séances en présentiel, visio ou domicile",
                    "Outils personnalisés selon ton profil",
                    "Accompagnement sur mesure, à ton rythme",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white text-[15px]">
                      <Check className="w-4 h-4 text-white/70 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={springRight} className="space-y-4">
                <div className="text-center">
                  <span className="inline-block bg-white/20 text-white font-semibold text-[13px] px-5 py-2 rounded-full backdrop-blur-sm mb-5">
                    1er RDV offert
                  </span>
                </div>
                <motion.div {...btnHoverProps}>
                  <Link
                    to={cta.buttonLink}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0B0B0C] text-white font-bold text-[16px] px-8 py-5 rounded-2xl hover:opacity-90 transition-opacity"
                    aria-label="Prendre rendez-vous pour un coaching jeunes"
                  >
                    {cta.buttonText} <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                </motion.div>
                <p className="text-center text-white/60 text-[13px] font-mono">
                  Confidentiel · Sans engagement
                </p>
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/nos-tarifs"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold text-[14px] px-8 py-4 rounded-2xl hover:bg-white/25 transition-colors backdrop-blur-sm"
                  >
                    Voir les tarifs
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

export default CoachingJeunes;
