import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import { useTilt } from "@/hooks/useTilt";
import {
  Check, ArrowUpRight,
  Zap, Focus, Wind, Brain, Star, Smile,
  BrainCircuit, GraduationCap,
} from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import {
  fadeInUp, blurInUp, staggerContainer, staggerFast,
  springUp, springLeft, springRight, btnHoverProps,
  VP, VP2,
} from "@/lib/motion";
import type { ServicePageContent } from "@/types";

const HERO_IMG    = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85";
const COACH_PHOTO = `${import.meta.env.BASE_URL}patron.webp`;

const HERO_WORDS = ["Coaching", "&", "Neurofeedback"];

const STEPS = [
  {
    num: "01",
    title: "Bilan neurologique",
    desc: "Évaluation de votre activité cérébrale",
  },
  {
    num: "02",
    title: "Séances d'entraînement",
    desc: "Le cerveau apprend à s'auto-réguler",
  },
  {
    num: "03",
    title: "Résultats durables",
    desc: "Amélioration cognitive et émotionnelle mesurable",
  },
];

const BENEFITS = [
  {
    icon: Zap,
    title: "Réduction du stress et de l'anxiété",
    desc: "Entraîner le cerveau à s'autoréguler pour diminuer significativement le stress, l'anxiété et l'émotivité.",
  },
  {
    icon: Focus,
    title: "Amélioration de la concentration",
    desc: "Attention, mémoire de travail et flexibilité mentale renforcées pour performer durablement.",
  },
  {
    icon: Wind,
    title: "Meilleure qualité de sommeil",
    desc: "Rééquilibrer les ondes cérébrales pour retrouver un sommeil profond et des nuits véritablement récupératrices.",
  },
  {
    icon: Brain,
    title: "Gestion des émotions",
    desc: "Protocoles spécifiques pour mieux réguler vos réponses émotionnelles et retrouver l'équilibre intérieur.",
  },
  {
    icon: Star,
    title: "Performance cognitive accrue",
    desc: "Optimiser la créativité et la prise de décision pour les sportifs, artistes et dirigeants.",
  },
  {
    icon: Smile,
    title: "Confiance et sérénité retrouvées",
    desc: "Un cerveau plus équilibré se traduit par plus de sérénité, de confiance et une meilleure qualité de vie.",
  },
];

const CoachingNeurofeedback = () => {
  const { content, loading } = usePageContent<ServicePageContent>("coaching-neurofeedback");

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
        title="Neurofeedback à Mâcon — Entraînement Cérébral Non Invasif | ON Coaching"
        description="Neurofeedback certifié à Mâcon (Sancé) : entraînement cérébral non invasif pour stress, concentration, sommeil et performances cognitives. 1er RDV offert."
        canonical="/coaching-neurofeedback"
        keywords="neurofeedback mâcon, neurofeedback bourgogne, entraînement cérébral, réduction stress, améliorer concentration, neurofeedback enfant, biofeedback"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://www.oncoaching.fr/coaching-neurofeedback#service",
            name: "Coaching & Neurofeedback",
            url: "https://www.oncoaching.fr/coaching-neurofeedback",
            description: "Neurofeedback non invasif : entraînement des ondes cérébrales pour réduire le stress, améliorer la concentration, le sommeil et les performances cognitives.",
            provider: { "@id": "https://www.oncoaching.fr/#business" },
            areaServed: { "@type": "City", name: "Mâcon" },
            offers: { "@type": "Offer", price: "80", priceCurrency: "EUR" },
            serviceType: "Neurofeedback",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Le neurofeedback est-il dangereux ?", acceptedAnswer: { "@type": "Answer", text: "Non, le neurofeedback est une technique non invasive et sans effet secondaire. Il consiste à lire l'activité cérébrale et à la renvoyer en temps réel sous forme de signaux sonores ou visuels." } },
              { "@type": "Question", name: "Pour qui le neurofeedback est-il recommandé ?", acceptedAnswer: { "@type": "Answer", text: "Le neurofeedback convient aux enfants, adolescents et adultes souffrant de stress, de difficultés de concentration, de troubles du sommeil ou souhaitant améliorer leurs performances." } },
              { "@type": "Question", name: "Combien de séances faut-il ?", acceptedAnswer: { "@type": "Answer", text: "Un protocole standard est de 20 séances pour des résultats durables, mais des améliorations sont souvent perceptibles dès les premières sessions." } },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://www.oncoaching.fr/#services" },
              { "@type": "ListItem", position: 3, name: "Neurofeedback", item: "https://www.oncoaching.fr/coaching-neurofeedback" },
            ],
          },
        ]}
      />

      <div className="w-full bg-white min-h-screen overflow-x-hidden">

        <section className="pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-7"
                aria-labelledby="nf-h1"
              >
                <motion.p
                  variants={fadeInUp}
                  className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7]"
                  aria-hidden="true"
                >
                  ↳ Neurofeedback
                </motion.p>

                <h1
                  id="nf-h1"
                  className="text-[clamp(2.2rem,6vw,5rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1.15]"
                >
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

                <motion.p
                  variants={blurInUp}
                  className="text-gray-500 text-[16px] leading-relaxed max-w-md"
                >
                  {page.subtitle} Entraîner le cerveau pour une performance cognitive durable, une régulation émotionnelle profonde et un bien-être retrouvé.
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
                      to="/NosTarifs"
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
                className="relative h-[320px] sm:h-[400px] md:h-[460px] rounded-[32px] overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
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
                  className="absolute bottom-5 left-5 bg-[#1ab5c7] text-white px-4 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase font-semibold shadow-md"
                >
                  Non invasif · Scientifique
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

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
                Protocole
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight mb-12"
              >
                Comment ça fonctionne
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    variants={springLeft}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-[24px] p-8 flex flex-col gap-4"
                  >
                    <span className="font-mono text-[clamp(3rem,5vw,4rem)] font-bold text-[#1ab5c7]/20 leading-none select-none">
                      {step.num}
                    </span>
                    <h3 className="text-[#0B0B0C] font-bold text-[18px] leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-[14px] leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

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
                Résultats
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-white leading-tight mb-10"
              >
                Bénéfices
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
                          className="p-5 sm:p-7 flex flex-col gap-4 sm:gap-5 h-full shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
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
                className="relative h-[300px] sm:h-[380px] md:h-[440px] rounded-[32px] overflow-hidden group shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
              >
                <img
                  src={COACH_PHOTO}
                  alt="Noureddine Omar — Coach certifié ICF & Neurofeedback, ON Coaching Mâcon"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  <span className="bg-[#1ab5c7] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full">
                    Certifié Neurofeedback
                  </span>
                  <span className="bg-white/20 text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
                    Coach ICF
                  </span>
                </div>
              </motion.div>

              <motion.div variants={springRight} className="space-y-6">
                <div>
                  <p
                    className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7] mb-3"
                    aria-hidden="true"
                  >
                    Le praticien
                  </p>
                  <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
                    Expertise neuroscientifique &amp; coaching
                  </h2>
                </div>
                <p className="text-gray-500 text-[15px] leading-relaxed">
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
                <p
                  className="font-mono tracking-widest uppercase text-[10px] text-white/60"
                  aria-hidden="true"
                >
                  Tarif
                </p>
                <div className="text-center sm:text-left">
                  <span className="text-[clamp(3rem,6vw,4.5rem)] font-bold text-white leading-none">80€</span>
                  <span className="text-white/70 text-[18px] ml-2 font-medium">/ séance</span>
                </div>
                <ul className="space-y-3">
                  {[
                    "Séance de 45 à 60 min",
                    "Non invasif",
                    "Sur ordonnance non requise",
                    "Résultats dès la 3e séance",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white text-[15px]">
                      <Check className="w-4 h-4 text-white/80 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={springRight} className="space-y-4">
                <motion.div {...btnHoverProps}>
                  <Link
                    to={cta.buttonLink}
                    className="flex sm:inline-flex justify-center w-full sm:w-auto items-center gap-2 bg-[#0B0B0C] text-white font-bold text-[16px] px-8 py-5 rounded-2xl hover:opacity-90 transition-opacity"
                    aria-label="Prendre rendez-vous pour une séance neurofeedback"
                  >
                    {cta.buttonText} <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                </motion.div>
                <p className="text-center text-white/70 text-[13px] font-mono">
                  1er RDV offert · Confidentiel · Sans engagement
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default CoachingNeurofeedback;
