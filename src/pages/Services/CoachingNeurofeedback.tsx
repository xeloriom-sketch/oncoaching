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
import { usePublicContent as usePageContent } from "@/hooks/usePublicContent";
import {
  fadeInUp, blurInUp, staggerContainer, staggerFast,
  springUp, springLeft, springRight, btnHoverProps,
  VP, VP2,
} from "@/lib/motion";
import type { ServicePageContent } from "@/types";
import { E } from "@/components/cms/E";

const HERO_IMG      = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85";
const COACH_PHOTO   = `${import.meta.env.BASE_URL}patron.webp`;
const SESSION_PHOTO    = "https://dbneurofeedback.com/wp-content/uploads/2024/12/NEUROPTIMAL-1.jpg";
const NF_VIDEO_ID      = "qg1BfBMl0SE";
const NEUROPTIMAL_LOGO = "https://neuroptimal.com/wp-content/uploads/2025/06/cropped-NO-head-logo-1024x1024-1-367x367.png";

const HERO_WORDS = ["Neurofeedback", "à Mâcon"];

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
        title="Neurofeedback Mâcon — Praticien NeurOptimal® | ON Coaching"
        description="Praticien NeurOptimal® à Mâcon (71). Stress, anxiété, concentration, sommeil, TDAH. Technique non invasive. 1er bilan offert. Tél : 06 63 04 18 12."
        canonical="/coaching-neurofeedback"
        keywords="neurofeedback mâcon, neurofeedback macon, praticien neurofeedback mâcon, NeurOptimal mâcon, neurofeedback sancé 71, neurofeedback bourgogne, neurofeedback saône-et-loire, neurofeedback dynamique mâcon, neurofeedback stress mâcon, neurofeedback concentration, neurofeedback sommeil, neurofeedback tdah mâcon, neurofeedback enfant adolescent mâcon, biofeedback mâcon 71"
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
              {
                "@type": "Question",
                name: "Où trouver un praticien neurofeedback à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "ON Coaching, cabinet de neurofeedback à Mâcon (Sancé, 71), est animé par Noureddine Omar, praticien certifié NeurOptimal®. Cabinet situé au 14 rue des écureuils, Sancé (Mâcon, 71000). Tél : 06 63 04 18 12. 1er bilan offert." }
              },
              {
                "@type": "Question",
                name: "Neurofeedback ou thérapie classique à Mâcon : quelle différence ?",
                acceptedAnswer: { "@type": "Answer", text: "Le neurofeedback à Mâcon proposé par ON Coaching est une technique non invasive et sans médicaments qui entraîne le cerveau à s'auto-réguler. Contrairement à une thérapie classique, le neurofeedback agit directement sur l'activité cérébrale pour des résultats rapides et durables. Idéal pour le stress, la concentration, le sommeil et les performances." }
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

      <div className="w-full bg-[#FBFBFB] min-h-screen overflow-x-hidden">

        <section className="pt-20 md:pt-28 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">

              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-5 sm:space-y-7"
                aria-labelledby="nf-h1"
              >
                <motion.p
                  variants={fadeInUp}
                  className="font-mono tracking-widest uppercase text-[10px] text-[#C4903E]"
                  aria-hidden="true"
                >
                  <E fieldKey="heroLabel">{ content?.heroLabel ?? "↳ Neurofeedback" }</E>
                </motion.p>

                <h1
                  id="nf-h1"
                  className="text-[clamp(2rem,6vw,5rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight"
                >
                  {HERO_WORDS.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", damping: 18, stiffness: 160, delay: i * 0.1 }}
                      className={`inline-block mr-3 ${word === "à" ? "text-[#C4903E]" : ""}`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>

                <motion.p
                  variants={blurInUp}
                  className="text-gray-500 text-[16px] leading-relaxed max-w-md"
                >
                  <E fieldKey="page.subtitle">{page.subtitle}</E> Entraîner le cerveau pour une performance cognitive durable, une régulation émotionnelle profonde et un bien-être retrouvé.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                  <motion.div className="w-full sm:w-auto" {...btnHoverProps}>
                    <Link
                      to="/contact"
                      className="flex justify-center sm:inline-flex items-center gap-2 bg-[#C4903E] text-white font-bold text-[14px] px-7 py-3.5 min-h-[44px] rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto"
                      aria-label="Réserver une séance découverte neurofeedback"
                    >
                      <E fieldKey="hero.ctaBtnPrimary">{ content?.hero?.ctaBtnPrimary ?? "Séance découverte" }</E> <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </motion.div>
                  <motion.div className="w-full sm:w-auto" {...btnHoverProps}>
                    <Link
                      to="/nos-tarifs"
                      className="flex justify-center sm:inline-flex items-center gap-2 bg-[#F3F4F6] text-[#1C3A52] font-semibold text-[14px] px-7 py-3.5 min-h-[44px] rounded-full hover:bg-gray-200 transition-colors w-full sm:w-auto"
                    >
                      <E fieldKey="hero.ctaBtnSecondary">{ content?.hero?.ctaBtnSecondary ?? "Voir les tarifs" }</E>
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
                <motion.img
                  src={SESSION_PHOTO}
                  alt="Séance de neurofeedback NeurOptimal® — capteurs EEG — ON Coaching Mâcon"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  width="800"
                  height="600"
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
                  <E fieldKey="hero.tagline">{ content?.hero?.tagline ?? "Non invasif · Scientifique" }</E>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

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
                <E fieldKey="stepsLabel">{ content?.stepsLabel ?? "Protocole" }</E>
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight mb-12"
              >
                <E fieldKey="stepsTitle">{ content?.stepsTitle ?? "Comment ça fonctionne" }</E>
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    variants={springLeft}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-[24px] p-5 sm:p-6 flex flex-col gap-4"
                  >
                    <span className="font-mono text-[clamp(3rem,5vw,4rem)] font-bold text-[#C4903E]/40 leading-none select-none">
                      {step.num}
                    </span>
                    <h3 className="text-[#1C3A52] font-bold text-[18px] leading-snug">
                      <E fieldKey={`steps.${i}.title`}>{ (content?.steps as any)?.[i]?.title ?? step.title }</E>
                    </h3>
                    <p className="text-gray-500 text-[14px] leading-relaxed">
                      <E fieldKey={`steps.${i}.desc`}>{ (content?.steps as any)?.[i]?.desc ?? step.desc }</E>
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

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
                <E fieldKey="benefitsLabel">{ content?.benefitsLabel ?? "Résultats" }</E>
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-white leading-tight mb-6"
              >
                <E fieldKey="benefitsTitle">{ content?.benefitsTitle ?? "Les bénéfices du Neurofeedback NeurOptimal®" }</E>
              </motion.h2>

              {/* Texte bienfaits */}
              <motion.div variants={fadeInUp} className="mb-12 max-w-3xl">
                <E fieldKey="benefits.intro">
                  <p className="text-white/70 text-[16px] leading-relaxed mb-4">
                    { (content?.benefits as any)?.intro ?? "Les sensations décrites par les clients incluent souvent une clarté mentale, un sentiment de légèreté et une profonde sérénité, perceptibles rapidement. Avec le temps, cet état de mieux-être devient naturel, comme un nouvel équilibre intérieur." }
                  </p>
                  <p className="text-white/70 text-[16px] leading-relaxed">
                    Même si un événement difficile peut perturber temporairement cet état, son impact émotionnel sera généralement moins marqué, et la capacité à retrouver son équilibre plus rapide.
                  </p>
                </E>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {BENEFITS.map((b, i) => {
                  const Icon = b.icon;
                  const tilt = tiltRefs[i];
                  return (
                    <motion.div key={i} variants={springUp} className="h-full">
                      <SpotlightCard
                        className="h-full rounded-[24px] border border-white/8 bg-white/[0.03]"
                        spotlightColor="rgba(196,144,62,0.15)"
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
                            className="w-11 h-11 rounded-xl bg-[#C4903E] flex items-center justify-center flex-shrink-0"
                            whileHover={{ rotate: [0, -12, 12, 0], transition: { duration: 0.4 } }}
                            aria-hidden="true"
                          >
                            <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                          </motion.div>
                          <h3 className="text-white font-bold text-[17px] leading-snug">
                            <E fieldKey={`benefits.${i}.title`}>{ (content?.benefits as any)?.[i]?.title ?? b.title }</E>
                          </h3>
                          <p className="text-white/60 text-[14px] leading-relaxed flex-1">
                            <E fieldKey={`benefits.${i}.desc`}>{ (content?.benefits as any)?.[i]?.desc ?? b.desc }</E>
                          </p>
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
        <section className="py-12 md:py-20 bg-[#FBFBFB]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerContainer}
            >
              {/* Logo NeurOptimal® / Zengar — crédibilité praticien certifié */}
              <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-6">
                <img
                  src={NEUROPTIMAL_LOGO}
                  alt="NeurOptimal® — Zengar Institute"
                  className="h-14 w-14 object-contain rounded-xl bg-white p-1 shadow-sm"
                  loading="lazy"
                />
                <div>
                  <p className="font-mono tracking-widest uppercase text-[10px] text-[#C4903E]">
                    <E fieldKey="technologyLabel">{ content?.technologyLabel ?? "Technologie certifiée · Zengar Institute" }</E>
                  </p>
                  <p className="text-[#1C3A52] font-semibold text-[15px]">
                    <E fieldKey="technologyName">{ content?.technologyName ?? "NeurOptimal® Dynamical Neurofeedback®" }</E>
                  </p>
                </div>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight mb-4"
              >
                <E fieldKey="loopTitle">{ content?.loopTitle ?? "La boucle du Neurofeedback" }</E>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-500 text-[16px] leading-relaxed max-w-2xl mb-12">
                <E fieldKey="loopDescription">{ content?.loopDescription ?? "Le Dynamical Neurofeedback® NeurOptimal® communique avec le système nerveux central en utilisant son propre langage. Il n'introduit aucun courant, fréquence ou signal externe dans le cerveau — toute l'expertise est intégrée dans le logiciel." }</E>
              </motion.p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start">

                {/* Schéma de la boucle */}
                <motion.div variants={springLeft} className="bg-[#1C3A52] rounded-[32px] p-5 sm:p-7 flex flex-col gap-5 sm:gap-6">
                  <p className="text-[#C4903E] font-mono text-[11px] tracking-widest uppercase">Boucle de feedback</p>

                  {[
                    { step: "01", label: "Capteurs EEG", detail: "Actifs en C3 et C4 · Référence aux oreilles · Terre sur le lobe" },
                    { step: "02", label: "zAmp — Amplification", detail: "Amplifie le signal EEG · Conversion analogique → numérique" },
                    { step: "03", label: "Analyse DIFS × 256/s", detail: "Durée · Intensité · Fréquence · Shift (changement)" },
                    { step: "04", label: "Feedback médiatique", detail: "Légères interruptions dans la musique ou le film" },
                    { step: "05", label: "Autorégulation du SNC", detail: "Le système nerveux réagit · Flexibilité et résilience renforcées" },
                  ].map((item, i, arr) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-[#C4903E] flex items-center justify-center">
                          <span className="text-[11px] font-bold text-[#1C3A52] font-mono">{item.step}</span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className="w-px h-6 bg-[#C4903E]/30 mt-1" />
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

                {/* Texte descriptif Q&A */}
                <motion.div variants={springRight} className="flex flex-col gap-6">
                  {[
                    {
                      title: "Comment se déroule une séance ?",
                      text: "Durant la séance, vous serez confortablement assis dans un fauteuil face à un écran. Cinq capteurs placés sur votre tête mesurent et analysent l'activité électrique de votre cerveau. Pendant l'entraînement, vous êtes invité à savourer un moment plaisant, en écoutant de la musique ou en visionnant un film de votre choix. L'entraînement se fait de manière naturelle.",
                    },
                    {
                      title: "Le nombre de séances",
                      text: "La technologie NeurOptimal® permet aujourd'hui d'observer des effets bénéfiques dès 6 à 10 séances. Beaucoup de clients rapportent, dès les premières séances, un sommeil plus réparateur, un meilleur état général, une vision plus optimiste de la vie ou encore des interactions plus apaisées avec leur entourage.",
                    },
                    {
                      title: "Un entraînement personnalisé",
                      text: "Le rythme des séances s'adapte à vos besoins et à votre mode de vie. Certains choisissent de revenir occasionnellement pour des séances de rappel, tandis que d'autres intègrent une pratique régulière, comme on le ferait avec un entraînement sportif. Comme pour toute discipline, la régularité et la pratique permettent de progresser et d'atteindre un niveau de maîtrise toujours plus élevé !",
                    },
                  ].map((block, i) => (
                    <div key={i} className="bg-[#F3F4F6] rounded-[24px] p-6">
                      <h3 className="text-[#1C3A52] font-bold text-[16px] mb-3">
                        <E fieldKey={`qa.${i}.title`}>{ (content?.qa as any)?.[i]?.title ?? block.title }</E>
                      </h3>
                      <p className="text-gray-500 text-[14px] leading-relaxed">
                        <E fieldKey={`qa.${i}.text`}>{ (content?.qa as any)?.[i]?.text ?? block.text }</E>
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>{/* fin grille 2 colonnes */}

              {/* Vidéo explicative NeurOptimal® — dans la section boucle */}
              <motion.div variants={fadeInUp} className="mt-12">
                <p className="text-[#1C3A52] font-bold text-[17px] mb-4">
                  <E fieldKey="videoTitle">{ content?.videoTitle ?? "Découvrir NeurOptimal® en vidéo" }</E>
                </p>
                <div className="w-full bg-[#F3F4F6] rounded-[24px] p-4">
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${NF_VIDEO_ID}`}
                      title="À la découverte du Neurofeedback NeurOptimal®"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* ══ MÉDIAS & RESSOURCES ══════════════════════════════════════════ */}
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
                <E fieldKey="resourcesLabel">{ content?.resourcesLabel ?? "Références" }</E>
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight mb-4"
              >
                <E fieldKey="resourcesTitle">{ content?.resourcesTitle ?? "Médias & Ressources" }</E>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-500 text-[16px] leading-relaxed max-w-2xl mb-12">
                <E fieldKey="resourcesIntro">{ content?.resourcesIntro ?? "Pour comprendre le neurofeedback et lui faire confiance, voici les ressources qui en font la légitimité : témoignages de professionnels de santé, études scientifiques et vidéos explicatives." }</E>
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {MEDIA_SECTIONS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i} variants={springUp} className="bg-white rounded-[24px] p-5 sm:p-7 flex flex-col gap-4 shadow-sm">
                      <div className="w-11 h-11 rounded-xl bg-[#C4903E] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      <h3 className="text-[#1C3A52] font-bold text-[17px] leading-snug">
                        <E fieldKey={`mediaSection.${i}.title`}>{ (content?.mediaSection as any)?.[i]?.title ?? item.title }</E>
                      </h3>
                      <p className="text-gray-500 text-[14px] leading-relaxed flex-1">
                        <E fieldKey={`mediaSection.${i}.desc`}>{ (content?.mediaSection as any)?.[i]?.desc ?? item.desc }</E>
                      </p>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#C4903E] font-semibold text-[13px] hover:opacity-70 transition-opacity mt-auto"
                      >
                        <E fieldKey={`mediaSection.${i}.linkLabel`}>{ (content?.mediaSection as any)?.[i]?.linkLabel ?? item.linkLabel }</E> <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ PRATICIEN ════════════════════════════════════════════════════ */}
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
                  alt="Noureddine Omar — Coach certifié & Neurofeedback, ON Coaching Mâcon"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  width="600"
                  height="800"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C3A52]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  <span className="bg-[#C4903E] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full">
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
                    className="font-mono tracking-widest uppercase text-[10px] text-[#C4903E] mb-3"
                    aria-hidden="true"
                  >
                    <E fieldKey="practitionerLabel">{ content?.practitionerLabel ?? "Le praticien" }</E>
                  </p>
                  <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight">
                    <E fieldKey="practitionerTitle">{ content?.practitionerTitle ?? "Expertise neuroscientifique & coaching" }</E>
                  </h2>
                </div>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  <E fieldKey="practitionerBio">{ content?.practitionerBio ?? "Certifié en neurofeedback et coach certifié, je combine la compréhension fine du fonctionnement cérébral avec des outils de coaching puissants. Cette double approche permet d'agir à la fois sur les mécanismes neurologiques et sur les comportements pour des résultats durables." }</E>
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
                <p
                  className="font-mono tracking-widest uppercase text-[10px] text-white/60"
                  aria-hidden="true"
                >
                  <E fieldKey="pricingLabel">{ content?.pricingLabel ?? "Tarif" }</E>
                </p>
                <div className="text-center sm:text-left">
                  <span className="text-[clamp(3rem,6vw,4.5rem)] font-bold text-white leading-none">
                    <E fieldKey="pricing.amount">{ (content?.pricing as any)?.amount ?? "80€" }</E>
                  </span>
                  <span className="text-white/70 text-[18px] ml-2 font-medium">
                    <E fieldKey="pricing.unit">{ (content?.pricing as any)?.unit ?? "/ séance" }</E>
                  </span>
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
                      <E fieldKey={`pricing.features.${i}`}>{ (content?.pricing as any)?.features?.[i] ?? item }</E>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={springRight} className="space-y-4">
                <motion.div {...btnHoverProps}>
                  <Link
                    to={cta.buttonLink}
                    className="flex sm:inline-flex justify-center w-full sm:w-auto items-center gap-2 bg-[#1C3A52] text-white font-bold text-[16px] px-8 py-5 min-h-[44px] rounded-2xl hover:opacity-90 transition-opacity"
                    aria-label="Prendre rendez-vous pour une séance neurofeedback"
                  >
                    <E fieldKey="cta.buttonText">{cta.buttonText}</E> <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                </motion.div>
                <p className="text-center text-white/70 text-[13px] font-mono">
                  <E fieldKey="cta.footnote">{ content?.cta?.footnote ?? "1er RDV offert · Confidentiel · Sans engagement" }</E>
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
