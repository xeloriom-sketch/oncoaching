import React, { useRef, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Zap,
  Brain,
  Users,
  Newspaper,
  Podcast,
  Linkedin,
  Award,
} from "lucide-react";
import Layout from "@/components/Layout";
import VideoPlayer from "@/components/VideoPlayer";
import SEO from "@/components/SEO";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  fadeInScale,
  springUp,
  staggerContainer,
  cardHoverProps,
  VP,
} from "@/lib/motion";
import { ROUTES } from "@/lib/config";
import { usePageContent } from "@/hooks/usePageContent";
import type { IndexContent } from "@/types";
import { E } from "@/components/cms/E";
import { useEditMode } from "@/contexts/EditModeContext";

const COACH_IMG = `${import.meta.env.BASE_URL}patron.webp`;

const HERO_VIDEOS = [
  { webm: `${import.meta.env.BASE_URL}hero-1.webm`, mp4: `${import.meta.env.BASE_URL}8799147-hd_1920_1080_24fps.mp4` },
  { webm: `${import.meta.env.BASE_URL}hero-2.webm`, mp4: `${import.meta.env.BASE_URL}8558449-uhd_1440_2560_24fps.mp4` },
  { webm: `${import.meta.env.BASE_URL}hero-3.webm`, mp4: `${import.meta.env.BASE_URL}5697350-uhd_2160_3840_24fps.mp4` },
];

const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
  scolaire: GraduationCap,
  jeunes: Zap,
  neurofeedback: Brain,
  equipe: Users,
};

const SERVICE_HREF_MAP: Record<string, string> = {
  scolaire: ROUTES.scolaire,
  jeunes: ROUTES.jeunes,
  neurofeedback: ROUTES.neurofeedback,
  equipe: ROUTES.equipe,
};

const SERVICE_COLORS = [
  {
    bg: "#1C3A52",
    text: "text-white",
    sub: "text-white/55",
    tag: "bg-white/10 text-white/60",
    icon: "bg-[#C4903E] text-white",
    link: "text-[#C4903E]",
  },
  {
    bg: "#C4903E",
    text: "text-[#1C3A52]",
    sub: "text-black/65",
    tag: "bg-black/10 text-black/60",
    icon: "bg-[#1C3A52] text-[#C4903E]",
    link: "text-[#1C3A52]",
  },
  {
    bg: "#F3F4F6",
    text: "text-[#1C3A52]",
    sub: "text-gray-500",
    tag: "bg-[#1C3A52]/8 text-gray-500",
    icon: "bg-[#1C3A52] text-[#C4903E]",
    link: "text-[#1C3A52]",
  },
  {
    bg: "#1C3A52",
    text: "text-white",
    sub: "text-white/55",
    tag: "bg-white/10 text-white/60",
    icon: "bg-[#C4903E] text-white",
    link: "text-[#C4903E]",
  },
];


/* ── Bouton CTA avec fond coulissant (liquid fill) ───────────────────────── */
interface LiquidCTAProps {
  to: string;
  label?: string;
  baseClass: string;
  fillClass: string;
  hoverTextClass?: string;
  children: React.ReactNode;
}
function LiquidCTA({ to, label, baseClass, fillClass, hoverTextClass = "", children }: LiquidCTAProps) {
  const [hovered, setHovered] = useState(false);
  const [textActive, setTextActive] = useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHoverStart = () => {
    setHovered(true);
    // Applique la couleur du texte seulement quand le fond a à moitié recouvert le bouton
    timerRef.current = setTimeout(() => setTextActive(true), 220);
  };
  const handleHoverEnd = () => {
    setHovered(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setTextActive(false);
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-full w-full sm:w-auto"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      whileTap={{ scale: 0.97 }}
      data-cursor="magnetic"
    >
      <motion.span
        className={`absolute inset-0 rounded-full ${fillClass}`}
        animate={{ x: hovered ? "0%" : "-105%" }}
        transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />
      <Link
        to={to}
        aria-label={label}
        className={`relative z-10 flex items-center justify-center gap-2.5 py-3.5 px-6 text-[15px] font-semibold transition-colors duration-[200ms] ${baseClass} ${textActive ? hoverTextClass : ""}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default function Index() {
  const { content } = usePageContent<IndexContent>("index");
  const { isEditMode } = useEditMode();

  /* ── Carousel vidéo hero ───────────────────────────────────── */
  const [videoIdx,   setVideoIdx]   = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  const nextVideo = useCallback(() => {
    setVideoReady(false);
    setVideoIdx(i => (i + 1) % HERO_VIDEOS.length);
  }, []);

  const handleCanPlay = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoReady(true);
    void (e.currentTarget as HTMLVideoElement).play().catch(() => {});
  }, []);

  // iOS Safari + <source> children : load() explicite sans ref sur motion.video
  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>(`[data-hero="${videoIdx}"]`);
    if (video) video.load();
  }, [videoIdx]);

  /* ── Parallaxe souris — Hero ───────────────────────────────── */
  const heroRef = useRef<HTMLElement>(null);
  const rawX    = useMotionValue(0);
  const rawY    = useMotionValue(0);

  /* Photo : déplacement très lent (profondeur basse) */
  const photoX = useTransform(rawX, [-800, 800], [-10, 10]);
  const photoY = useTransform(rawY, [-600, 600], [-7,   7]);
  const sPhX   = useSpring(photoX, { stiffness: 100, damping: 22, mass: 1.2 });
  const sPhY   = useSpring(photoY, { stiffness: 100, damping: 22, mass: 1.2 });


  const handleHeroMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(e.clientX - r.left  - r.width  / 2);
    rawY.set(e.clientY - r.top   - r.height / 2);
  }, [rawX, rawY]);

  const handleHeroLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);


  return (
    <Layout>
      <SEO
        title="Neurofeedback Mâcon (71) — Praticien NeurOptimal® & Coach ICF | ON Coaching | 1er Bilan Offert"
        description="Praticien Neurofeedback NeurOptimal® et coach ICF certifié à Mâcon, Sancé (71). Stress, anxiété, concentration, sommeil, TDAH. Coaching scolaire, jeunes adultes, équipe. 1er bilan offert, sans engagement."
        canonical="/"
        keywords="neurofeedback mâcon, neurofeedback sancé 71, NeurOptimal mâcon, coach certifié mâcon, neurofeedback stress mâcon, neurofeedback concentration, coaching mâcon, coach jeunes adultes, coaching scolaire mâcon, Noureddine Omar, saône-et-loire bourgogne"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://www.oncoaching.fr/#webpage",
            name: "ON Coaching — Coach certifié à Mâcon (71)",
            url: "https://www.oncoaching.fr/",
            isPartOf: { "@id": "https://www.oncoaching.fr/#website" },
            about: { "@id": "https://www.oncoaching.fr/#business" },
            description: "Coach certifié à Mâcon, Sancé (71). Coaching scolaire, jeunes adultes, neurofeedback et coaching d'équipe. 1er rendez-vous offert.",
            primaryImageOfPage: { "@type": "ImageObject", url: "https://www.oncoaching.fr/patron.webp" },
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Services de coaching — ON Coaching Mâcon",
            description: "Tous les services de coaching certifié proposés par ON Coaching à Mâcon (Sancé, 71)",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Coaching scolaire & étudiant à Mâcon", url: "https://www.oncoaching.fr/coaching-scolaire" },
              { "@type": "ListItem", position: 2, name: "Coaching jeunes & jeunes adultes à Mâcon", url: "https://www.oncoaching.fr/coaching-jeunes" },
              { "@type": "ListItem", position: 3, name: "Neurofeedback à Mâcon", url: "https://www.oncoaching.fr/coaching-neurofeedback" },
              { "@type": "ListItem", position: 4, name: "Coaching d'équipe en Saône-et-Loire", url: "https://www.oncoaching.fr/coaching-equipe" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: { "@id": "https://www.oncoaching.fr/#business" },
            author: { "@type": "Person", name: "Marc A." },
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            reviewBody: "L'accompagnement d'ON Coaching m'a permis de structurer ma vision et de retrouver une parfaite synergie entre ma vie professionnelle et personnelle. Un coach à l'écoute, bienveillant et efficace.",
          },
        ]}
      />

      {/* ── 01. HERO ─────────────────────────────────────────────────── */}
      <section
          ref={heroRef}
          className="w-full relative bg-[#FBFBFB] min-h-[calc(100svh-72px)] lg:h-[calc(100vh-82px)] flex flex-col lg:flex-row lg:items-center overflow-x-hidden"
          aria-labelledby="home-h1"
          onMouseMove={handleHeroMove}
          onMouseLeave={handleHeroLeave}
      >
        {/* Grain subtil pour la texture */}
        <div className="hero-grain absolute inset-0 pointer-events-none opacity-30" aria-hidden="true" />

        <div className="w-full lg:h-full grid grid-cols-1 lg:grid-cols-[56%_44%] lg:items-center relative z-10">

          {/* ── GAUCHE : Vidéo derrière 3 ovales inclinés ── */}
          <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ x: sPhX, y: sPhY }}
              className="relative w-full h-[45vh] sm:h-[50vh] lg:h-[74vh] order-first lg:order-first"
          >
            {/* Masque SVG composite — les 3 ovals d'un coup */}
            <svg width="0" height="0" className="absolute" aria-hidden="true">
              <defs>
                <clipPath id="ovals-clip" clipPathUnits="objectBoundingBox">
                  <ellipse cx="0.62" cy="0.43" rx="0.31" ry="0.42" transform="rotate(-38 0.62 0.43)" />
                  <ellipse cx="0.35" cy="0.65" rx="0.20" ry="0.27" transform="rotate(-30 0.35 0.65)" />
                  <ellipse cx="0.11" cy="0.86" rx="0.09" ry="0.12" transform="rotate(-22 0.11 0.86)" />
                </clipPath>
              </defs>
            </svg>

            {/* Vidéos en crossfade à travers les 3 ovals */}
            <div
              className="absolute inset-0"
              style={{ clipPath: "url(#ovals-clip)", WebkitClipPath: "url(#ovals-clip)" }}
            >
              <AnimatePresence mode="sync">
                <motion.video
                  key={videoIdx}
                  data-hero={videoIdx}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: videoReady ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onCanPlay={handleCanPlay}
                  onEnded={nextVideo}
                >
                  <source src={HERO_VIDEOS[videoIdx].webm} type="video/webm" />
                  <source src={HERO_VIDEOS[videoIdx].mp4} type="video/mp4" />
                </motion.video>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
            </div>

          </motion.div>

          {/* ── DROITE : Contenu textuel ── */}
          <div className="flex flex-col gap-6 lg:gap-7 px-5 py-6 sm:px-8 sm:py-10 md:px-12 lg:px-10 lg:py-0 text-center lg:text-left items-center lg:items-start">

            {/* H1 — 3 lignes, reveal ligne par ligne */}
            <h1
                id="home-h1"
                className="font-bold leading-[1.15] tracking-tight text-[#1C3A52] max-w-full text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.8rem] xl:text-[3.8rem] 2xl:text-[5rem]"
            >
              {isEditMode ? (
                <E fieldKey="hero.title">
                  {content?.hero?.title ?? "Développez votre potentiel infini."}
                </E>
              ) : (
                <>
                  {[
                    { text: "Développez", delay: 0 },
                    { text: "votre potentiel", delay: 0.06 },
                  ].map(({ text, delay }) => (
                    <span key={text} className="word-mask block">
                      <motion.span
                        className="inline-block"
                        initial={{ y: "105%" }}
                        animate={{ y: "0%" }}
                        transition={{ type: "spring", stiffness: 200, damping: 26, delay }}
                      >
                        {text}
                      </motion.span>
                    </span>
                  ))}
                  <span className="word-mask block">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.12 }}
                    >
                      <span className="infini-word">infini.</span>
                    </motion.span>
                  </span>
                </>
              )}
            </h1>

            {/* Sous-titre descriptif */}
            <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                className="text-[0.95rem] sm:text-[1.05rem] text-[#1C3A52]/70 leading-relaxed max-w-lg text-center lg:text-left px-4 sm:px-0"
            >
              <E fieldKey="hero.subtitle">{content?.hero?.subtitle ?? "Coach certifié à Mâcon — accompagnement personnalisé pour particuliers et entreprises. 26 ans d'expérience en sciences humaines."}</E>
            </motion.p>

            {/* Boutons d'actions (CTAs) liquides */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.68 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto"
            >
              <LiquidCTA
                  to={ROUTES.contact}
                  label="Prendre rendez-vous avec ON Coaching"
                  baseClass="bg-[#1C3A52] text-white shadow-[0_8px_24px_rgba(28,58,82,0.15)] rounded-full px-6 py-3.5 flex items-center justify-center gap-2 font-medium w-full sm:w-auto"
                  fillClass="bg-[#C4903E]"
              >
                <E fieldKey="hero.buttonPrimary">{content?.hero?.buttonPrimary ?? "Prendre RDV"}</E>
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </LiquidCTA>

              <LiquidCTA
                  to={ROUTES.about}
                  label="Découvrir l'approche de coaching"
                  baseClass="bg-white text-[#1C3A52] border border-[#E5E7EB] rounded-full px-6 py-3.5 font-medium w-full sm:w-auto justify-center"
                  fillClass="bg-[#C4903E]"
              >
                <E fieldKey="hero.buttonSecondary">{content?.hero?.buttonSecondary ?? "Notre approche"}</E>
              </LiquidCTA>
            </motion.div>

            {/* Signal de confiance / Réassurance */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.84 }}
                className="text-xs sm:text-sm text-[#1C3A52]/50 flex items-center justify-center lg:justify-start gap-2 mt-1"
            >
              <span className="text-[#C4903E] text-base" aria-hidden="true">☉</span>
              <E fieldKey="hero.trustSignal">{content?.hero?.trustSignal ?? "1er rendez-vous offert · Sans engagement"}</E>
            </motion.p>

          </div>

        </div>
      </section>

      {/* ── 02. STATS ────────────────────────────────────────────────── */}
      <section className="py-8 md:py-12 bg-[#FBFBFB]" aria-label="Points forts">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="bg-[#F3F4F6] rounded-[28px] px-4 sm:px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center"
          >
            {(content?.stats ?? []).map(({ value, label }, i) => (
              <motion.div
                key={i}
                variants={springUp}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className="text-[clamp(1.3rem,4vw,3rem)] font-bold tracking-tight text-[#1C3A52] leading-none font-mono"
                  aria-label={value}
                >
                  {value}
                </span>
                <span className="text-[14px] text-gray-500 leading-tight max-w-[120px]">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 03. SERVICES ─────────────────────────────────────────────── */}
      <section
        className="py-12 md:py-20 lg:py-28 bg-[#FBFBFB]"
        aria-labelledby="services-title"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex flex-col gap-8 md:gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="text-center flex flex-col gap-4"
          >
            <motion.p
              variants={fadeInUp}
              className="text-[13px] font-mono tracking-widest uppercase text-gray-400"
              aria-hidden="true"
            >
              <E fieldKey="servicesSection.labelSmall">{content?.servicesSection?.labelSmall ?? "Nos services"}</E>
            </motion.p>
            <motion.h2
              id="services-title"
              variants={fadeInUp}
              className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-[1.05]"
            >
              <E fieldKey="servicesSection.title">{content?.servicesSection?.title ?? "Un accompagnement unique pour des résultats durables"}</E>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-[0.95rem] sm:text-[1.05rem] text-[#1C3A52]/60 leading-relaxed max-w-2xl mx-auto"
            >
              <E fieldKey="servicesSection.subtitle">{content?.servicesSection?.subtitle ?? "Coaching certifié à Mâcon et à distance — scolaire, jeunes adultes, neurofeedback et équipe en Saône-et-Loire (71)."}</E>
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
            aria-label="Nos services de coaching"
          >
            {(content?.servicesCards ?? []).map((card, i) => {
              const c = SERVICE_COLORS[i];
              const Icon = SERVICE_ICON_MAP[card.key];
              const href = SERVICE_HREF_MAP[card.key] ?? "/";
              return (
                <motion.article
                  key={card.key}
                  variants={springUp}
                  {...cardHoverProps}
                  className="rounded-[28px] p-6 sm:p-8 flex flex-col gap-5 cursor-default shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-shadow duration-300"
                  style={{ background: c.bg }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}
                      aria-hidden="true"
                    >
                      {Icon && <Icon className="w-6 h-6" strokeWidth={1.6} />}
                    </div>
                    <span
                      className={`text-[11px] sm:text-[12px] font-mono tracking-wide sm:tracking-widest uppercase px-2 sm:px-3 py-0.5 sm:py-1 rounded-full min-w-0 shrink ${c.tag}`}
                    >
                      {card.tag}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <h3
                      className={`font-bold text-[18px] tracking-tight ${c.text}`}
                    >
                      <E fieldKey={`services.${i}.title`}>{card.title}</E>
                    </h3>
                    <p className={`text-[15px] leading-relaxed ${c.sub}`}>
                      <E fieldKey={`services.${i}.description`}>{card.desc}</E>
                    </p>
                  </div>

                  <Link
                    to={href}
                    className={`flex items-center gap-2 text-[14px] font-bold transition-all hover:gap-3 w-fit min-h-[44px] ${c.link}`}
                    aria-label={`Découvrir ${card.title}`}
                  >
                    <E fieldKey="services.discoverText">{content?.services?.discoverText ?? "Découvrir"}</E> <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── 03b. NEUROFEEDBACK SPOTLIGHT ─────────────────────────────── */}
      <section className="py-12 md:py-20 lg:py-28 bg-[#FBFBFB]" aria-label="Neurofeedback NeurOptimal®">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center"
          >
            <motion.div variants={fadeInLeft} className="flex flex-col gap-5">
              <p className="text-[11px] font-mono tracking-widest uppercase text-[#C4903E]">
                <E fieldKey="neurofeedback.labelSmall">{content?.neurofeedback?.labelSmall ?? "Technologie · Zengar Institute"}</E>
              </p>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight">
                <E fieldKey="neurofeedback.title">{content?.neurofeedback?.title ?? "Neurofeedback NeurOptimal®"}</E>
              </h2>
              <p className="text-gray-500 text-[15px] sm:text-[16px] leading-relaxed max-w-lg">
                <E fieldKey="neurofeedback.longDescription">{content?.neurofeedback?.longDescription ?? "Une technologie d'entraînement cérébral non invasive qui permet au système nerveux de développer flexibilité et résilience. Dès 6 à 10 séances, les clients rapportent un sommeil plus réparateur, une clarté mentale accrue, un calme intérieur et des performances renforcées."}</E>
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  content?.neurofeedback?.useCases?.[0] ?? "Stress, anxiété, burn-out",
                  content?.neurofeedback?.useCases?.[1] ?? "Concentration, mémoire, TDA/H",
                  content?.neurofeedback?.useCases?.[2] ?? "Sommeil, fatigue chronique",
                  content?.neurofeedback?.useCases?.[3] ?? "Performance cognitive et sportive",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-gray-500 text-[14px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C4903E] flex-shrink-0" />
                    <E fieldKey={`neurofeedback.useCases.${i}`}>{item}</E>
                  </li>
                ))}
              </ul>
              <Link
                to={ROUTES.neurofeedback}
                className="inline-flex items-center justify-center gap-2 bg-[#1C3A52] text-white font-bold text-[14px] px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity w-full sm:w-fit mt-2 min-h-[44px]"
              >
                <E fieldKey="neurofeedback.ctaText">{content?.neurofeedback?.ctaText ?? "Découvrir le Neurofeedback"}</E> <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div variants={fadeInRight} className="relative">
              <div aria-hidden="true" className="absolute -bottom-5 -left-5 w-[60%] h-[50%] rounded-[28px]"
                style={{ background: "rgba(196,144,62,0.15)" }} />
              <div aria-hidden="true" className="absolute -top-4 -right-4 w-[35%] h-[40%] rounded-[24px]"
                style={{ background: "rgba(28,58,82,0.10)" }} />
              <div className="relative h-[220px] sm:h-[300px] md:h-[340px] rounded-[28px] overflow-hidden z-10">
              <img
                src="https://dbneurofeedback.com/wp-content/uploads/2024/12/NEUROPTIMAL-1.jpg"
                alt="Séance de neurofeedback NeurOptimal® — capteurs EEG"
                className="w-full h-full object-cover"
                width="800"
                height="600"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                <span className="bg-[#C4903E] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full font-bold">
                  Non invasif
                </span>
                <span className="bg-white/90 text-[#1C3A52] text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
                  NeurOptimal®
                </span>
              </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 04. COACH BIO ────────────────────────────────────────────── */}
      <section
        className="py-12 md:py-20 lg:py-28 bg-[#1C3A52]"
        aria-labelledby="coach-title"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={fadeInLeft}
            className="relative"
          >
            {/* Bulle décorative derrière la photo */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 w-[55%] h-[45%] rounded-[28px]"
              style={{ background: "rgba(196,144,62,0.18)" }}
            />
            <div className="h-[300px] sm:h-[380px] md:h-[420px] rounded-[24px] overflow-hidden relative z-10">
              <img
                src={COACH_IMG}
                alt="Noureddine Omar — Coach certifié, ONCoaching Mâcon"
                className="w-full h-full object-cover object-top"
                width="600"
                height="800"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="flex flex-col gap-6"
          >
            <motion.p
              variants={fadeInUp}
              className="text-[13px] font-mono tracking-widest uppercase text-white/60"
              aria-hidden="true"
            >
              <E fieldKey="coachSection.labelSmall">{content?.coachSection?.labelSmall ?? "Notre coach"}</E>
            </motion.p>
            <motion.h2
              id="coach-title"
              variants={fadeInUp}
              className="text-[clamp(2rem,5vw,3.2rem)] font-semibold tracking-tight text-white leading-[1.05]"
            >
              <E fieldKey="coachSection.coachName">{content?.coachSection?.coachName ?? "Noureddine Omar"}</E>
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-2"
            >
              {["Certifié", "26 ans", "Neurofeedback"].map((badge) => (
                <span
                  key={badge}
                  className="bg-white/10 border border-white/15 text-white text-[13px] font-medium px-3 py-1 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-[15px] text-white/65 leading-relaxed max-w-md"
            >
              <E fieldKey="coachSection.bioParagraph">{content?.coachSection?.bioParagraph ?? "Coach certifié, formé par Prisme Évolution, 26 ans enseignant SES. Praticien en neurofeedback NeurOptimal® — une double expertise pour agir à la fois sur le cerveau et sur les comportements, au service de votre évolution."}</E>
            </motion.p>

            <motion.blockquote
              variants={fadeInUp}
              className="border-l-2 border-[#C4903E] pl-5 text-[14px] sm:text-[15px] italic text-white/50 leading-relaxed"
            >
              <E fieldKey="coachSection.quote">{content?.coachSection?.quote ?? "\"Le changement commence là où la zone de confort s'arrête.\""}</E>
            </motion.blockquote>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
              <Link
                to={ROUTES.about}
                className="flex items-center justify-center gap-2.5 bg-[#C4903E] text-[#1C3A52] font-bold text-[15px] px-6 py-4 rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto min-h-[44px]"
                aria-label="Découvrir l'approche de Noureddine Omar"
              >
                <E fieldKey="coachSection.discoverLinkText">{content?.coachSection?.discoverLinkText ?? "Découvrir l'approche"}</E>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href={`${import.meta.env.BASE_URL}certification.webp`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-white/20 text-white/70 text-[14px] px-5 py-4 rounded-full hover:bg-white/10 hover:text-white transition-all w-full sm:w-auto min-h-[44px]"
                aria-label="Voir la certification NeurOptimal®"
              >
                <Award className="w-4 h-4" aria-hidden="true" />
                <E fieldKey="coachSection.certificationLinkText">{content?.coachSection?.certificationLinkText ?? "Voir la certification"}</E>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 05. PROCESSUS ────────────────────────────────────────────── */}
      <section
        className="py-12 md:py-20 lg:py-28 bg-[#FBFBFB]"
        aria-labelledby="processus-title"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex flex-col gap-8 md:gap-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="text-center flex flex-col gap-4"
          >
            <motion.p
              variants={fadeInUp}
              className="text-[13px] font-mono tracking-widest uppercase text-gray-400"
              aria-hidden="true"
            >
              <E fieldKey="stepsSection.labelSmall">{content?.stepsSection?.labelSmall ?? "Comment ça marche"}</E>
            </motion.p>
            <motion.h2
              id="processus-title"
              variants={fadeInUp}
              className="text-[clamp(1.8rem,4.5vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-[1.05]"
            >
              <E fieldKey="stepsSection.title">{content?.stepsSection?.title ?? "Trois étapes vers votre transformation"}</E>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 items-start"
          >
            {(content?.steps ?? []).map(({ num, title, desc }, i, arr) => (
              <motion.div
                key={num}
                variants={springUp}
                className="flex flex-col gap-5 bg-[#F3F4F6] md:bg-transparent rounded-[24px] md:rounded-none p-5 sm:p-6 md:p-0 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:shadow-none"
              >
                <div className="flex items-center gap-4 md:block md:space-y-5">
                  <span
                    className="font-mono text-[clamp(2rem,5vw,4.5rem)] font-bold leading-none text-gray-300 select-none"
                    aria-hidden="true"
                  >
                    {num}
                  </span>
                  {i < 2 && (
                    <ArrowRight
                      className="hidden md:block w-6 h-6 text-gray-200 absolute translate-x-[calc(100%+1.5rem)] top-1/2"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[18px] font-bold text-[#1C3A52]">
                    {title}
                  </h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div className="md:hidden flex justify-center">
                    <ArrowRight
                      className="w-5 h-5 text-gray-200 rotate-90"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={fadeInScale}
            className="flex justify-center"
          >
            <Link
              to={ROUTES.contact}
              className="w-full sm:w-auto justify-center bg-[#1C3A52] text-white font-bold text-[15px] px-8 py-4 rounded-full flex items-center gap-2.5 hover:opacity-85 transition-opacity shadow-[0_8px_32px_rgba(28,58,82,0.25)]"
              aria-label="Commencer la consultation gratuite"
            >
              <E fieldKey="stepsSection.ctaText">{content?.stepsSection?.ctaText ?? "Démarrer gratuitement"}</E>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 06. VIDÉO ────────────────────────────────────────────────── */}
      <section className="py-12 md:py-20 lg:py-28 bg-[#F3F4F6]" aria-label="Vidéo ON Coaching">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center"
          >
            {/* Texte */}
            <motion.div variants={fadeInLeft} className="flex flex-col gap-5">
              <p className="text-[12px] font-mono tracking-widest uppercase text-[#C4903E]" aria-hidden="true">
                <E fieldKey="videoSection.labelSmall">{content?.videoSection?.labelSmall ?? "ONCoaching · En action"}</E>
              </p>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-[1.05]">
                Découvrez<br />
                <span className="text-[#C4903E]">notre approche</span><br />
                en vidéo.
              </h2>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-md">
                <E fieldKey="videoSection.description">{content?.videoSection?.description ?? "Une séance, une transformation. Voyez comment le coaching ON change concrètement la trajectoire de nos clients."}</E>
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="self-start">
                <a
                  href="https://www.facebook.com/reel/2910146945849990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1C3A52] text-white font-bold text-[14px] px-6 py-3.5 rounded-full hover:opacity-85 transition-opacity"
                  aria-label="Voir la vidéo ON Coaching sur Facebook"
                >
                  <E fieldKey="videoSection.linkText">{content?.videoSection?.linkText ?? "Voir sur Facebook"}</E>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </motion.div>
            </motion.div>

            {/* Lecteur vidéo custom 16:9 */}
            <motion.div variants={fadeInRight}>
              <VideoPlayer
                src={`${import.meta.env.BASE_URL}coaching-reel.mp4`}
                webmSrc={`${import.meta.env.BASE_URL}coaching-reel.webm`}
                facebookUrl="https://www.facebook.com/reel/2910146945849990"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 07. AVIS CLIENTS ─────────────────────────────────────────── */}
      <section
        className="py-12 md:py-20 lg:py-28 bg-[#F3F4F6]"
        aria-labelledby="avis-title"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex flex-col gap-8 md:gap-12">

          {/* En-tête */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="text-center flex flex-col gap-3"
          >
            <motion.p variants={fadeInUp} className="text-[13px] font-mono tracking-widest uppercase text-[#C4903E]" aria-hidden="true">
              Avis vérifiés
            </motion.p>
            <motion.h2 id="avis-title" variants={fadeInUp} className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-[1.05]">
              Ce que disent nos clients
            </motion.h2>
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-1.5">
              {Array(5).fill(null).map((_, i) => (
                <span key={i} className="text-[#C4903E] text-[1.2rem]" aria-hidden="true">★</span>
              ))}
              <span className="text-[14px] font-semibold text-[#1C3A52] ml-2">5 / 5</span>
              <span className="text-[14px] text-gray-400 ml-1">· Resalib</span>
            </motion.div>
          </motion.div>

          {/* Cartes avis */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {[
              {
                initials: "SR",
                name: "Sarah R.",
                date: "19 décembre 2025",
                context: "Suite à un rendez-vous en décembre 2025",
                quote: "Très bon coaching, beaucoup de bienveillance et d'écoute. De très bons conseils pour s'améliorer.",
                reply: "Merci Sarah. Tu pourras toujours compter sur moi en cas de difficultés.",
              },
              {
                initials: "R",
                name: "R.",
                date: "10 novembre 2025",
                context: "Suite à un rendez-vous en août 2025",
                quote: "J'ai été accompagnée par Noureddine dans le cadre d'une création d'activité. Son écoute et sa bienveillance sont très appréciables et m'ont aidée à lever certaines barrières que je me mettais.",
                reply: "Merci pour cet avis. Je te souhaite toute la réussite que tu mérites. Bonne continuation.",
              },
            ].map(({ initials, name, date, context, quote, reply }) => (
              <motion.article
                key={name}
                variants={springUp}
                className="bg-white rounded-[24px] p-6 sm:p-8 flex flex-col gap-5 shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.11)] transition-shadow duration-300"
              >
                {/* Auteur + étoiles */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#1C3A52] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#C4903E] text-[13px] font-bold">{initials}</span>
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#1C3A52] leading-tight">{name}</p>
                      <p className="text-[12px] text-gray-400">{date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0" role="img" aria-label="5 étoiles sur 5">
                    {Array(5).fill(null).map((_, i) => (
                      <span key={i} className="text-[#C4903E] text-[0.9rem]" aria-hidden="true">★</span>
                    ))}
                  </div>
                </div>

                {/* Avis */}
                <blockquote className="text-[15px] text-gray-600 leading-relaxed italic flex-1">
                  "{quote}"
                </blockquote>

                <p className="text-[11px] font-mono tracking-wide text-gray-300 uppercase">{context}</p>

                {/* Réponse du praticien */}
                <div className="border-t border-[#F3F4F6] pt-4 flex flex-col gap-1.5">
                  <p className="text-[11px] font-bold text-[#C4903E] uppercase tracking-widest">Réponse du praticien</p>
                  <p className="text-[14px] text-gray-500 leading-relaxed italic">"{reply}"</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 08. PRESSE ───────────────────────────────────────────────── */}
      <section className="py-12 md:py-20 lg:py-28 bg-[#FBFBFB]" aria-labelledby="presse-title">
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex flex-col gap-8 md:gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="text-center flex flex-col gap-4"
          >
            <motion.p variants={fadeInUp} className="text-[13px] font-mono tracking-widest uppercase text-[#C4903E]" aria-hidden="true">
              <E fieldKey="pressSection.labelSmall">{content?.pressSection?.labelSmall ?? "Ils parlent de nous"}</E>
            </motion.p>
            <motion.h2 id="presse-title" variants={fadeInUp} className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-[1.05]">
              <E fieldKey="pressSection.title">{content?.pressSection?.title ?? "Presse & Médias"}</E>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {[
              {
                Icon: Newspaper,
                source: "Le JSL",
                label: "Journal de Saône-et-Loire",
                quote: "Noureddine Omar, coach certifié, accompagne les jeunes et les entreprises de la région mâconnaise vers l'excellence.",
                href: "https://www.facebook.com/LeJSL71/posts/pfbid026cn9growEgiYZ7sjMSMWyJhdENBm3N6szFVMAAwsaYDkgmgSmaVuh5gLFVn4r5opl",
              },
              {
                Icon: Podcast,
                source: "Podcast et Compagnie",
                label: "Interview vidéo",
                quote: "Une discussion captivante sur les méthodes de coaching cognitif et l'impact du neurofeedback sur la performance.",
                href: "https://www.youtube.com/watch?v=Yu9CM4-DIXk",
              },
              {
                Icon: Linkedin,
                source: "LinkedIn",
                label: "Profil professionnel",
                quote: "Coach professionnel certifié, praticien NeurOptimal® et ancien enseignant. Rejoignez le réseau ONCoaching.",
                href: "https://www.linkedin.com/in/noureddine-omar-587620346/",
              },
            ].map(({ Icon, source, label, quote, href }, i) => (
              <motion.a
                key={i}
                variants={springUp}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-4 bg-white border border-[#E5E7EB] rounded-[24px] p-6 min-h-[200px] hover:shadow-[0_12px_40px_rgba(28,58,82,0.1)] hover:-translate-y-1 transition-all duration-300"
                aria-label={`Lire l'article ${source}`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#1C3A52]/6 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1C3A52]" strokeWidth={1.6} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#C4903E] transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-mono tracking-widest uppercase text-[#C4903E]">{source}</span>
                  <span className="text-[14px] font-semibold text-[#1C3A52]">{label}</span>
                </div>
                <p className="text-[14px] text-gray-500 leading-relaxed flex-1 italic">"{quote}"</p>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={fadeInScale}
            className="flex justify-center"
          >
            <Link
              to={ROUTES.media}
              className="inline-flex items-center gap-2.5 border-2 border-[#1C3A52] text-[#1C3A52] font-bold text-[15px] px-7 py-3.5 rounded-full hover:bg-[#1C3A52] hover:text-white transition-all duration-300"
            >
              <E fieldKey="pressSection.moreLink">{content?.pressSection?.moreLink ?? "En savoir plus"}</E>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 09. CTA FINAL ────────────────────────────────────────────── */}
      <section
        className="py-12 md:py-20 lg:py-28 bg-[#1C3A52]"
        aria-labelledby="cta-title"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="flex flex-col items-center text-center gap-8"
          >
            <motion.h2
              id="cta-title"
              variants={fadeInUp}
              className="text-[clamp(1.6rem,5vw,3.5rem)] font-semibold tracking-tight text-white leading-[1.05]"
            >
              <E fieldKey="cta.title">{content?.cta?.title ?? "Passez au niveau supérieur."}</E>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-[1rem] text-white/55 w-full sm:max-w-md leading-relaxed"
            >
              <E fieldKey="cta.subtitle">{content?.cta?.subtitle ?? "Consultation initiale offerte. Sans engagement. Disponible pour de nouveaux accompagnements."}</E>
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={ROUTES.contact}
                  className="bg-[#C4903E] text-[#1C3A52] font-bold text-[15px] px-7 py-4 rounded-full flex items-center justify-center gap-2.5 hover:opacity-90 transition-opacity w-full sm:w-auto"
                  aria-label="Contacter un coach ON Coaching"
                >
                  Contacter un coach
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={ROUTES.tarifs}
                  className="border border-white/25 text-white font-bold text-[15px] px-7 py-4 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  <E fieldKey="finalCta.pricesLink">{content?.finalCta?.pricesLink ?? "Voir les tarifs"}</E>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
