import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import { useTilt } from "@/hooks/useTilt";
import {
  Check, ArrowUpRight, ExternalLink,
  Zap, Focus, Wind, Brain, Star, Smile,
  BrainCircuit, GraduationCap, BookOpen, Video, Stethoscope,
} from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import {
  fadeInUp, blurInUp, staggerContainer, staggerFast,
  springUp, springLeft, springRight, btnHoverProps,
  VP, VP2,
} from "@/lib/motion";
import type { ServicePageContent } from "@/types";

const HERO_IMG      = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85";
const COACH_PHOTO   = `${import.meta.env.BASE_URL}patron.webp`;
const SESSION_PHOTO = "https://www.neurofeedbacktraining.com/hubfs/woman-braintraining-at-home-neuroptimal-system-.webp";
const NF_VIDEO_ID   = "SFXTfvAz8q4";

const HERO_WORDS = ["Coaching", "&", "Neurofeedback"];

const STEPS = [
  {
    num: "01",
    title: "Capteurs EEG",
    desc: "Cinq capteurs positionnés sur la tête mesurent l'activité électrique du cerveau en temps réel.",
  },
  {
    num: "02",
    title: "Analyse NeurOptimal®",
    desc: "Le logiciel analyse le signal 256 fois par seconde selon 4 paramètres (DIFS) et détecte les micro-changements.",
  },
  {
    num: "03",
    title: "Feedback instantané",
    desc: "De légères interruptions dans le flux musical ou vidéo signalent au cerveau ses propres fluctuations.",
  },
  {
    num: "04",
    title: "Autorégulation",
    desc: "Le système nerveux réagit naturellement et développe flexibilité et résilience au fil des séances.",
  },
];

const MEDIA_SECTIONS = [
  {
    icon: Stethoscope,
    title: "Ce que disent les professionnels de la santé",
    desc: "Médecins, neuropsychologues et thérapeutes partagent leurs observations sur les bénéfices du neurofeedback NeurOptimal® au quotidien.",
    link: "https://dbneurofeedback.com",
    linkLabel: "Explorer les témoignages",
  },
  {
    icon: BookOpen,
    title: "Littérature scientifique",
    desc: "Des dizaines d'études publiées documentent l'efficacité du neurofeedback sur le stress, la concentration, le sommeil et les performances cognitives.",
    link: "https://dbneurofeedback.com",
    linkLabel: "Consulter les articles",
  },
  {
    icon: Video,
    title: "Articles & Vidéos",
    desc: "Retrouvez des explications visuelles, des reportages et des ressources pédagogiques pour comprendre concrètement le fonctionnement du neurofeedback.",
    link: "https://dbneurofeedback.com",
    linkLabel: "Voir les ressources",
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
        title="Neurofeedback à Mâcon (71) — Stress, Concentration, Sommeil | ON Coaching"
        description="Neurofeedback certifié à Mâcon, Sancé (71) : entraînement cérébral non invasif. Réduction du stress, concentration, sommeil, performances cognitives. 1er RDV offert."
        canonical="/coaching-neurofeedback"
        keywords="neurofeedback mâcon, neurofeedback sancé 71, neurofeedback bourgogne, entraînement cérébral, réduire stress mâcon, améliorer concentration, neurofeedback enfant mâcon, biofeedback saône-et-loire, neurofeedback dynamique"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "MedicalTherapy",
            "@id": "https://www.oncoaching.fr/coaching-neurofeedback#therapy",
            name: "Neurofeedback dynamique",
            alternateName: "Neurofeedback non invasif Mâcon",
            description: "Technique de neurofeedback dynamique non invasif à Mâcon (Sancé, 71). Améliore concentration, gestion du stress, sommeil et performances cognitives.",
            url: "https://www.oncoaching.fr/coaching-neurofeedback",
            provider: { "@id": "https://www.oncoaching.fr/#business" },
            areaServed: [
              { "@type": "City", name: "Mâcon" },
              { "@type": "City", name: "Sancé" },
              { "@type": "City", name: "Chalon-sur-Saône" },
              { "@type": "City", name: "Bourg-en-Bresse" },
              { "@type": "AdministrativeArea", name: "Saône-et-Loire" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Qu'est-ce que le neurofeedback dynamique à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Le neurofeedback dynamique est une technique non invasive qui entraîne le cerveau à s'auto-réguler. Proposé à Mâcon (Sancé, 71) par ON Coaching, il améliore la concentration, réduit le stress et optimise le sommeil sans médicaments. Chaque séance dure 45 à 60 minutes." }
              },
              {
                "@type": "Question",
                name: "Le neurofeedback est-il efficace pour les enfants et adolescents à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Oui, le neurofeedback est particulièrement efficace pour les enfants et adolescents présentant des difficultés de concentration, TDAH, anxiété scolaire ou troubles du sommeil. ON Coaching propose ce suivi à Mâcon et Sancé (71) pour les jeunes de 8 à 18 ans." }
              },
              {
                "@type": "Question",
                name: "Combien coûte une séance de neurofeedback à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Une séance de neurofeedback à Mâcon (ON Coaching, Sancé 71) est proposée à 80€. Des forfaits sont disponibles. Le 1er rendez-vous de bilan est offert sans engagement." }
              },
              {
                "@type": "Question",
                name: "Combien de séances de neurofeedback faut-il à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "En général, 10 à 20 séances de neurofeedback suffisent pour observer des résultats durables. Le protocole est établi lors du bilan initial offert par ON Coaching à Mâcon (Sancé, Saône-et-Loire)." }
              },
              {
                "@type": "Question",
                name: "Le neurofeedback remplace-t-il le coaching à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Non, le neurofeedback complète le coaching. ON Coaching à Mâcon propose une approche combinée : neurofeedback pour réguler le cerveau et coaching certifié pour développer les ressources personnelles et professionnelles." }
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://www.oncoaching.fr/#services" },
              { "@type": "ListItem", position: 3, name: "Neurofeedback Mâcon", item: "https://www.oncoaching.fr/coaching-neurofeedback" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://www.oncoaching.fr/#business",
            name: "ON Coaching",
            telephone: "+33663041812",
            url: "https://www.oncoaching.fr",
            address: {
              "@type": "PostalAddress",
              streetAddress: "14 rue des écureuils",
              addressLocality: "Sancé",
              postalCode: "71000",
              addressRegion: "Saône-et-Loire",
              addressCountry: "FR",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5",
              reviewCount: "12",
              bestRating: "5",
            },
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
                className="relative h-[320px] sm:h-[400px] md:h-[460px] rounded-[32px] overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              >
                <motion.img
                  src={SESSION_PHOTO}
                  alt="Séance de neurofeedback NeurOptimal® — capteurs EEG — ON Coaching Mâcon"
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
                          className="p-5 sm:p-7 flex flex-col gap-4 sm:gap-5 h-full border border-white/10 hover:border-white/20 transition-colors duration-300"
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

        {/* ══ BOUCLE DU NEUROFEEDBACK ══════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerContainer}
            >
              <motion.p
                variants={fadeInUp}
                className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7] mb-3"
                aria-hidden="true"
              >
                NeurOptimal® · Zengar Institute
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight mb-4"
              >
                La boucle du Neurofeedback
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-500 text-[16px] leading-relaxed max-w-2xl mb-12">
                Le Dynamical Neurofeedback® NeurOptimal® communique avec le système nerveux central en utilisant son propre langage. Il n'introduit aucun courant, fréquence ou signal externe dans le cerveau — toute l'expertise est intégrée dans le logiciel.
              </motion.p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                {/* Schéma de la boucle */}
                <motion.div variants={springLeft} className="bg-[#0B0B0C] rounded-[32px] p-8 flex flex-col gap-6">
                  <p className="text-[#1ab5c7] font-mono text-[11px] tracking-widest uppercase">Boucle de feedback</p>

                  {[
                    { step: "01", label: "Capteurs EEG", detail: "Actifs en C3 et C4 · Référence aux oreilles · Terre sur le lobe" },
                    { step: "02", label: "zAmp — Amplification", detail: "Amplifie le signal EEG · Conversion analogique → numérique" },
                    { step: "03", label: "Analyse DIFS × 256/s", detail: "Durée · Intensité · Fréquence · Shift (changement)" },
                    { step: "04", label: "Feedback médiatique", detail: "Légères interruptions dans la musique ou le film" },
                    { step: "05", label: "Autorégulation du SNC", detail: "Le système nerveux réagit · Flexibilité et résilience renforcées" },
                  ].map((item, i, arr) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-[#1ab5c7] flex items-center justify-center">
                          <span className="text-[11px] font-bold text-[#0B0B0C] font-mono">{item.step}</span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className="w-px h-6 bg-[#1ab5c7]/30 mt-1" />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="text-white font-semibold text-[14px]">{item.label}</p>
                        <p className="text-white/50 text-[12px] mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-2 pt-5 border-t border-white/10">
                    <p className="text-white/60 text-[12px] leading-relaxed italic">
                      © 2025 Zengar Institute Inc. — NeurOptimal® est diagnostiquement agnostique : programme d'entraînement pour toutes les personnes de tous âges.
                    </p>
                  </div>
                </motion.div>

                {/* Texte descriptif */}
                <motion.div variants={springRight} className="flex flex-col gap-6">
                  {[
                    {
                      title: "Comment se déroule une séance ?",
                      text: "Pendant la séance, vous êtes installé confortablement dans un fauteuil, face à un écran. Cinq capteurs positionnés sur votre tête permettent de mesurer et d'analyser l'activité électrique de votre cerveau. Durant l'entraînement, vous profitez d'un moment agréable en écoutant de la musique ou en regardant un film de votre choix. L'entraînement se déroule de façon simple, naturelle et non contraignante.",
                    },
                    {
                      title: "Quel est le nombre de séances ?",
                      text: "La technologie NeurOptimal® permet d'observer des évolutions positives dès 6 à 10 séances. De nombreuses personnes constatent rapidement des changements : un sommeil plus réparateur, une sensation de mieux-être général, une vision plus positive du quotidien ou encore des relations plus sereines avec leur entourage.",
                    },
                    {
                      title: "Un entraînement adapté à chacun",
                      text: "Le rythme des séances se construit en fonction de vos besoins, de vos objectifs et de votre mode de vie. Comme dans tout apprentissage, la régularité favorise l'évolution et permet d'ancrer durablement les bénéfices dans le temps.",
                    },
                  ].map((block, i) => (
                    <div key={i} className="bg-[#F3F4F6] rounded-[24px] p-6">
                      <h3 className="text-[#0B0B0C] font-bold text-[16px] mb-3">{block.title}</h3>
                      <p className="text-gray-500 text-[14px] leading-relaxed">{block.text}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ MÉDIAS & RESSOURCES ══════════════════════════════════════════ */}
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
                Références
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight mb-4"
              >
                Médias & Ressources
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-500 text-[16px] leading-relaxed max-w-2xl mb-12">
                Pour comprendre le neurofeedback et lui faire confiance, voici les ressources qui en font la légitimité : témoignages de professionnels de santé, études scientifiques et vidéos explicatives.
              </motion.p>

              {/* Vidéo explicative NeurOptimal® */}
              <motion.div variants={fadeInUp} className="mb-12">
                <p className="text-[#0B0B0C] font-bold text-[17px] mb-4">
                  Comprendre NeurOptimal® en vidéo — comment ça marche ?
                </p>
                <div className="w-full bg-white rounded-[24px] p-4 shadow-sm">
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${NF_VIDEO_ID}`}
                      title="NeurOptimal® — Comment fonctionne le neurofeedback ?"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MEDIA_SECTIONS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i} variants={springUp} className="bg-white rounded-[24px] p-7 flex flex-col gap-4 shadow-sm">
                      <div className="w-11 h-11 rounded-xl bg-[#1ab5c7] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      <h3 className="text-[#0B0B0C] font-bold text-[17px] leading-snug">{item.title}</h3>
                      <p className="text-gray-500 text-[14px] leading-relaxed flex-1">{item.desc}</p>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#1ab5c7] font-semibold text-[13px] hover:opacity-70 transition-opacity mt-auto"
                      >
                        {item.linkLabel} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ PRATICIEN ════════════════════════════════════════════════════ */}
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
                  alt="Noureddine Omar — Coach certifié & Neurofeedback, ON Coaching Mâcon"
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
                    Coach certifié
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
                  Certifié en neurofeedback et coach certifié, je combine la compréhension fine du fonctionnement cérébral
                  avec des outils de coaching puissants. Cette double approche permet d'agir à la fois sur les
                  mécanismes neurologiques et sur les comportements pour des résultats durables.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: BrainCircuit,  label: "Certifié praticien en Neurofeedback" },
                    { icon: GraduationCap, label: "Coach certifié — Prisme Évolution" },
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
                    "Non invasif · aucune ordonnance requise",
                    "Évolutions observées dès 6 à 10 séances",
                    "À mon cabinet · Sancé, Mâcon",
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
