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
const COACH_PHOTO = `${import.meta.env.BASE_URL}patron.webp`;

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

const HERO_WORDS = ["&", "Jeunes", "Adultes"];

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
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]" aria-label="Chargement…">
          <div className="w-8 h-8 border-2 border-[#C4903E] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const { page, cta } = content;

  return (
    <Layout>
      <SEO
        title="Coaching Jeunes & Jeunes Adultes à Mâcon (71) — Orientation, Confiance, Projet de Vie"
        description="Coaching pour les 15-30 ans à Mâcon (Sancé, 71). Orientation scolaire & pro, confiance en soi, projet de vie. Coach certifié, 26 ans d'expérience. 1er RDV offert."
        canonical="/coaching-jeunes"
        keywords="coaching jeunes mâcon, coach jeunes adultes mâcon 71, orientation scolaire sancé, projet de vie bourgogne, confiance en soi mâcon, insertion professionnelle saône-et-loire, coach certifié jeunes"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://www.oncoaching.fr/coaching-jeunes#service",
            name: "Coaching Jeunes Adultes Mâcon — ON Coaching",
            description: "Coaching pour les 15-30 ans à Mâcon (Sancé, 71). Orientation scolaire et professionnelle, confiance en soi, projet de vie. Coach certifié.",
            url: "https://www.oncoaching.fr/coaching-jeunes",
            provider: { "@id": "https://www.oncoaching.fr/#business" },
            areaServed: [
              { "@type": "City", name: "Mâcon" },
              { "@type": "City", name: "Sancé" },
              { "@type": "City", name: "Bourg-en-Bresse" },
              { "@type": "AdministrativeArea", name: "Saône-et-Loire" },
              { "@type": "AdministrativeArea", name: "Bourgogne-Franche-Comté" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Le coaching pour jeunes adultes à Mâcon, c'est pour qui ?",
                acceptedAnswer: { "@type": "Answer", text: "Le coaching jeunes adultes à Mâcon s'adresse aux 15-30 ans qui cherchent leur voie, doutent de leurs choix d'orientation, manquent de confiance en eux ou veulent construire un projet de vie clair. ON Coaching à Sancé (71) propose un accompagnement sur mesure." }
              },
              {
                "@type": "Question",
                name: "Comment le coaching aide-t-il les jeunes adultes à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Le coaching pour jeunes adultes à Mâcon (ON Coaching, Sancé 71) clarifie les objectifs de vie, développe la confiance en soi et aide à surmonter les blocages. Coach certifié et ex-enseignant 26 ans, Noureddine Omar connaît parfaitement les défis des jeunes en Bourgogne." }
              },
              {
                "@type": "Question",
                name: "Peut-on faire du coaching jeunes adultes en ligne depuis Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Oui, ON Coaching propose des séances de coaching jeunes adultes en visioconférence depuis Mâcon, Sancé (71) et toute la Bourgogne-Franche-Comté. Idéal pour les étudiants ou jeunes professionnels avec des emplois du temps chargés." }
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://www.oncoaching.fr/#services" },
              { "@type": "ListItem", position: 3, name: "Coaching Jeunes Mâcon", item: "https://www.oncoaching.fr/coaching-jeunes" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://www.oncoaching.fr/#business",
            name: "ON Coaching",
            telephone: "+33663041812",
            url: "https://www.oncoaching.fr",
            address: { "@type": "PostalAddress", streetAddress: "14 rue des écureuils", addressLocality: "Sancé", postalCode: "71000", addressRegion: "Saône-et-Loire", addressCountry: "FR" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: "12", bestRating: "5" },
          },
        ]}
      />

      <div className="w-full bg-[#FBFBFB] min-h-screen overflow-x-hidden">

        {/* 01. HERO */}
        <section className="pt-20 md:pt-28 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">

              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-5 sm:space-y-7"
                aria-labelledby="jeunes-h1"
              >
                <motion.p
                  variants={fadeInUp}
                  className="font-mono tracking-widest uppercase text-[10px] text-[#C4903E]"
                  aria-hidden="true"
                >
                  ↳ Coaching Jeunes
                </motion.p>

                <h1
                  id="jeunes-h1"
                  className="text-[clamp(2rem,6vw,5rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight"
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
                  <motion.div className="w-full sm:w-auto" {...btnHoverProps}>
                    <Link
                      to="/contact"
                      className="flex justify-center sm:inline-flex items-center gap-2 bg-[#C4903E] text-white font-bold text-[14px] px-7 py-3.5 min-h-[44px] rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto"
                      aria-label="Réserver un premier échange gratuit"
                    >
                      1er échange gratuit <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </motion.div>
                  <motion.div className="w-full sm:w-auto" {...btnHoverProps}>
                    <Link
                      to="/nos-tarifs"
                      className="flex justify-center sm:inline-flex items-center gap-2 bg-[#F3F4F6] text-[#1C3A52] font-semibold text-[14px] px-7 py-3.5 min-h-[44px] rounded-full hover:bg-gray-200 transition-colors w-full sm:w-auto"
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
                className="relative h-[220px] sm:h-[300px] md:h-[380px] rounded-[32px] overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              >
                <img
                  src={HERO_IMG}
                  alt="Coaching jeunes et jeunes adultes — ON Coaching Mâcon"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  width="1200"
                  height="800"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C3A52]/60 via-transparent to-transparent" />
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-5 left-5 bg-[#C4903E] text-white px-4 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase font-semibold shadow-md"
                >
                  Coaching Jeunes &amp; Jeunes Adultes
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 02. DÉFIS */}
        <section className="py-12 md:py-20 bg-[#F3F4F6]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
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
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight mb-10"
              >
                Ces défis te parlent&nbsp;?
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-10 gap-y-5 sm:gap-y-7">
                {PROBLEMS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={springUp}
                      className="flex items-start gap-4"
                    >
                      <div
                        className="w-9 h-9 rounded-full bg-[#C4903E]/15 flex items-center justify-center flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        <Icon className="w-4 h-4 text-[#C4903E]" strokeWidth={1.8} />
                      </div>
                      <p className="text-[#1C3A52] text-[15px] leading-snug font-medium pt-1.5">
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
        <section className="py-12 md:py-20 bg-[#1C3A52]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerContainer}
            >
              <motion.p
                variants={fadeInUp}
                className="font-mono tracking-widest uppercase text-[10px] text-[#C4903E]/70 mb-3"
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
                spotlightColor="rgba(196,144,62,0.12)"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8 rounded-[32px] overflow-hidden">
                  {BENEFITS.map((b, i) => {
                    const Icon = b.icon;
                    const tilt = tiltRefs[i];
                    return (
                      <motion.div key={i} variants={springUp} className="bg-[#1C3A52]">
                        <div
                          ref={tilt.ref}
                          onMouseMove={tilt.onMouseMove}
                          onMouseLeave={tilt.onMouseLeave}
                          onMouseEnter={tilt.onMouseEnter}
                          className="p-5 sm:p-7 flex flex-col gap-4 sm:gap-5 h-full border border-white/10 hover:border-white/20 transition-colors duration-300"
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <motion.div
                            className="w-11 h-11 rounded-xl bg-[#C4903E] flex items-center justify-center flex-shrink-0"
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
        <section className="py-12 md:py-20 bg-[#FBFBFB]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center"
            >
              <motion.div
                variants={springLeft}
                className="relative h-[300px] sm:h-[380px] md:h-[440px] rounded-[32px] overflow-hidden group shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
              >
                <img
                  src={COACH_PHOTO}
                  alt="Noureddine Omar — Coach certifié, ON Coaching Mâcon"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  width="600"
                  height="800"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C3A52]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex gap-2 flex-wrap">
                  <span className="bg-[#C4903E] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full">
                    Coach certifié
                  </span>
                  <span className="bg-white/15 text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
                    26 ans d'expérience
                  </span>
                </div>
              </motion.div>

              <motion.div variants={springRight} className="space-y-6">
                <div>
                  <p className="font-mono tracking-widest uppercase text-[10px] text-[#C4903E] mb-3" aria-hidden="true">
                    Le coach
                  </p>
                  <h2 className="text-[clamp(1.6rem,3.5vw,2rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight">
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
                    { icon: Users,         label: "Coach certifié — Prisme Évolution" },
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
                        className="w-8 h-8 rounded-xl bg-[#C4903E] flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
                      </div>
                      <span className="text-[#1C3A52]/70 text-[14px]">{label}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div className="w-full sm:w-auto" {...btnHoverProps}>
                  <Link
                    to="/contact"
                    className="flex justify-center sm:inline-flex items-center gap-2 bg-[#C4903E] text-white font-bold text-[14px] px-7 py-3.5 min-h-[44px] rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto"
                  >
                    Prendre rendez-vous <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 05. TARIF + CTA */}
        <section className="py-12 md:py-20 bg-[#C4903E]" aria-label="Tarif et prise de rendez-vous">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
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
                <div className="text-center sm:text-left">
                  <span className="text-[clamp(2.8rem,5vw,4.5rem)] font-bold text-white leading-none">
                    À partir de 60€
                  </span>
                  <span className="text-white/60 text-[16px] ml-2">/ séance</span>
                </div>
                <ul className="space-y-3">
                  {[
                    "Bilan de départ offert — sans engagement",
                    "À mon cabinet, chez vous ou à distance",
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
                    className="flex sm:inline-flex justify-center w-full sm:w-auto items-center gap-2 bg-[#1C3A52] text-white font-bold text-[16px] px-8 py-5 min-h-[44px] rounded-2xl hover:opacity-90 transition-opacity"
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
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold text-[14px] px-8 py-4 min-h-[44px] rounded-2xl hover:bg-white/25 transition-colors backdrop-blur-sm"
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
