import { useRef, useCallback, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Zap,
  Brain,
  Users,
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

const COACH_IMG = `${import.meta.env.BASE_URL}patron.webp`;

const SERVICES = [
  {
    key: "scolaire",
    Icon: GraduationCap,
    title: "Coaching scolaire & étudiant",
    desc: "Soutien, méthodologie et orientation pour réussir sa scolarité ou ses études.",
    href: ROUTES.scolaire,
    tag: "Collégiens · Lycéens · Étudiants",
  },
  {
    key: "jeunes",
    Icon: Zap,
    title: "Coaching jeunes & jeunes adultes",
    desc: "Accompagnement lors des choix d'orientation, insertion pro et construction du projet de vie.",
    href: ROUTES.jeunes,
    tag: "15 – 30 ans",
  },
  {
    key: "neurofeedback",
    Icon: Brain,
    title: "Coaching & Neurofeedback",
    desc: "Entraînement cérébral NeurOptimal® : réduction du stress, concentration, sommeil, performances cognitives. Non invasif, dès 6 à 10 séances.",
    href: ROUTES.neurofeedback,
    tag: "NeurOptimal® · Non invasif",
  },
  {
    key: "equipe",
    Icon: Users,
    title: "Coaching d'équipe",
    desc: "Développez la cohésion, la performance et l'intelligence collective de votre équipe.",
    href: ROUTES.equipe,
    tag: "Entreprises · TPE/PME",
  },
];

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

const STATS = [
  { value: "26 ans", label: "Enseignant SES" },
  { value: "100+", label: "Accompagnements" },
  { value: "Certifié", label: "Prisme Évolution" },
  { value: "4", label: "Programmes spécialisés" },
];

const STEPS = [
  {
    num: "01",
    title: "Consultation",
    desc: "Premier RDV offert, diagnostic complet",
  },
  {
    num: "02",
    title: "Plan sur mesure",
    desc: "Programme aligné avec vos objectifs",
  },
  {
    num: "03",
    title: "Transformation",
    desc: "Résultats mesurables et durables",
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
  return (
    <motion.div
      className="relative overflow-hidden rounded-full"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      data-cursor="magnetic"
    >
      {/* Fond coulissant de gauche à droite */}
      <motion.span
        className={`absolute inset-0 rounded-full ${fillClass}`}
        animate={{ x: hovered ? "0%" : "-105%" }}
        transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />
      <Link
        to={to}
        aria-label={label}
        className={`relative z-10 flex items-center justify-center gap-2.5 py-3.5 px-6 text-[15px] font-semibold transition-colors duration-300 ${baseClass} ${hovered ? hoverTextClass : ""}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default function Index() {
  const { content } = usePageContent<IndexContent>("index");

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

  const mergedServices = SERVICES.map((s) => {
    const fromJson = content?.services?.find((j) => j.key === s.key);
    return {
      ...s,
      title: fromJson?.title ?? s.title,
      desc: fromJson?.description ?? s.desc,
    };
  });

  return (
    <Layout>
      <SEO
        title="ON Coaching — Coach Certifié à Mâcon, Sancé (71) | 1er RDV Offert"
        description="Coach certifié à Mâcon, Sancé (71, Saône-et-Loire). 26 ans d'expérience. Coaching scolaire, jeunes adultes, neurofeedback, équipe. 1er rendez-vous offert."
        canonical="/"
        keywords="coaching mâcon, coach certifié mâcon, coaching scolaire mâcon, neurofeedback mâcon, coach jeunes adultes, coaching équipe saône-et-loire, sancé 71, bourgogne, Noureddine Omar"
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
          className="w-full relative bg-[#FBFBFB] min-h-[92vh] flex items-center py-12 md:py-16 overflow-hidden"
          aria-labelledby="home-h1"
          onMouseMove={handleHeroMove}
          onMouseLeave={handleHeroLeave}
      >
        {/* Grain subtil pour la texture */}
        <div className="hero-grain absolute inset-0 pointer-events-none opacity-30" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">

          {/* ── GAUCHE : Une vidéo derrière 3 formes organiques unifiées ── */}
          <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative w-full h-[520px] sm:h-[660px] lg:h-[800px] order-last lg:order-first"
          >
            {/* ── Cercle 1 — grand dominant, centre-droite ── */}
            <motion.div
              style={{
                position: "absolute",
                top: "2%", right: "0%",
                width: "84%",
                aspectRatio: "1",
                borderRadius: "50%",
                overflow: "hidden",
                zIndex: 10,
                x: sPhX,
                y: sPhY,
              }}
            >
              <iframe
                src="https://player.vimeo.com/video/1155511920?background=1&autoplay=1&loop=1&muted=1"
                style={{
                  position: "absolute",
                  top: "-15%", left: "-15%",
                  width: "130%", height: "130%",
                  border: "none", pointerEvents: "none",
                }}
                allow="autoplay; fullscreen"
                title="Vidéo coaching hero"
              />
            </motion.div>

            {/* ── Cercle 2 — moyen, bas-gauche ── */}
            <motion.div
              style={{
                position: "absolute",
                bottom: "0%", left: "-2%",
                width: "38%",
                aspectRatio: "1",
                borderRadius: "50%",
                overflow: "hidden",
                zIndex: 11,
                x: sPhX,
                y: sPhY,
              }}
            >
              <iframe
                src="https://player.vimeo.com/video/1155511920?background=1&autoplay=1&loop=1&muted=1"
                style={{
                  position: "absolute",
                  top: "-15%", left: "-15%",
                  width: "130%", height: "130%",
                  border: "none", pointerEvents: "none",
                }}
                allow="autoplay; fullscreen"
                title="Vidéo coaching hero"
              />
            </motion.div>

            {/* ── Cercle 3 — petit accent, bas-centre ── */}
            <motion.div
              style={{
                position: "absolute",
                bottom: "4%", left: "34%",
                width: "14%",
                aspectRatio: "1",
                borderRadius: "50%",
                overflow: "hidden",
                zIndex: 12,
                x: sPhX,
                y: sPhY,
              }}
            >
              <iframe
                src="https://player.vimeo.com/video/1155511920?background=1&autoplay=1&loop=1&muted=1"
                style={{
                  position: "absolute",
                  top: "-15%", left: "-15%",
                  width: "130%", height: "130%",
                  border: "none", pointerEvents: "none",
                }}
                allow="autoplay; fullscreen"
                title="Vidéo coaching hero"
              />
            </motion.div>

          </motion.div>

          {/* ── DROITE : Contenu textuel (Fidèle à tes textes et animations) ── */}
          <div className="flex flex-col gap-7 lg:pl-6">

            {/* Badge de localisation d'entrée */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
        <span className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#1C3A52] text-xs md:text-sm font-medium px-4 py-2 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#C4903E] animate-pulse" aria-hidden="true" />
          Coaching certifié · Mâcon
        </span>
            </motion.div>

            {/* H1 — 3 lignes, reveal ligne par ligne */}
            <h1
                id="home-h1"
                className="font-bold leading-[1.05] tracking-tight text-[#1C3A52]"
                style={{ fontSize: "clamp(2rem, 5.5vw, 5.6rem)" }}
            >
              {[
                { text: "Développez", delay: 0.18 },
                { text: "votre potentiel", delay: 0.30 },
              ].map(({ text, delay }) => (
                <span key={text} className="word-mask block overflow-hidden">
                  <motion.span
                    className="inline-block whitespace-nowrap"
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ type: "spring", stiffness: 160, damping: 22, delay }}
                  >
                    {text}
                  </motion.span>
                </span>
              ))}
              <span className="word-mask block overflow-hidden">
                <motion.span
                  className="inline-block whitespace-nowrap"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.42 }}
                >
                  <span className="infini-word">infini.</span>
                </motion.span>
              </span>
            </h1>

            {/* Sous-titre descriptif */}
            <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.58 }}
                className="text-[1.05rem] text-[#1C3A52]/70 leading-relaxed max-w-lg"
            >
              {content?.hero?.subtitle ?? "Accompagnement personnalisé pour particuliers et entreprises. Coach certifié, 26 ans d'expérience en sciences humaines."}
            </motion.p>

            {/* Boutons d'actions (CTAs) liquides */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.68 }}
                className="flex flex-wrap gap-4 items-center"
            >
              <LiquidCTA
                  to={ROUTES.contact}
                  label="Prendre rendez-vous avec ON Coaching"
                  baseClass="bg-[#1C3A52] text-white shadow-[0_8px_24px_rgba(28,58,82,0.15)] rounded-full px-6 py-3.5 flex items-center gap-2 font-medium"
                  fillClass="bg-[#C4903E]"
              >
                Prendre RDV
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </LiquidCTA>

              <LiquidCTA
                  to={ROUTES.about}
                  label="Découvrir l'approche de coaching"
                  baseClass="bg-white text-[#1C3A52] border border-[#E5E7EB] rounded-full px-6 py-3.5 font-medium"
                  fillClass="bg-[#1C3A52]"
                  hoverTextClass="text-white"
              >
                Notre approche
              </LiquidCTA>
            </motion.div>

            {/* Signal de confiance / Réassurance */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.84 }}
                className="text-sm text-[#1C3A52]/50 flex items-center gap-2 mt-2"
            >
              <span className="text-[#C4903E] text-base" aria-hidden="true">☉</span>
              1er rendez-vous offert · Sans engagement
            </motion.p>

          </div>

        </div>
      </section>

      {/* ── 02. STATS ────────────────────────────────────────────────── */}
      <section className="py-8 md:py-12 bg-white" aria-label="Points forts">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="bg-[#F3F4F6] rounded-[28px] px-4 sm:px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center"
          >
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={i}
                variants={springUp}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-tight text-[#1C3A52] leading-none font-mono"
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
        className="py-20 md:py-28 bg-white"
        aria-labelledby="services-title"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex flex-col gap-12">
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
              Nos services
            </motion.p>
            <motion.h2
              id="services-title"
              variants={fadeInUp}
              className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-[1.05]"
            >
              {content?.servicesSection?.title ?? "Un accompagnement unique pour des résultats durables"}
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            aria-label="Nos services de coaching"
          >
            {mergedServices.map(({ key, Icon, title, desc, href, tag }, i) => {
              const c = SERVICE_COLORS[i];
              return (
                <motion.article
                  key={key}
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
                      <Icon className="w-6 h-6" strokeWidth={1.6} />
                    </div>
                    <span
                      className={`text-[12px] font-mono tracking-widest uppercase px-3 py-1 rounded-full flex-shrink-0 ${c.tag}`}
                    >
                      {tag}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <h3
                      className={`font-bold text-[18px] tracking-tight ${c.text}`}
                    >
                      {title}
                    </h3>
                    <p className={`text-[15px] leading-relaxed ${c.sub}`}>
                      {desc}
                    </p>
                  </div>

                  <Link
                    to={href}
                    className={`flex items-center gap-2 text-[14px] font-bold transition-all hover:gap-3 w-fit ${c.link}`}
                    aria-label={`Découvrir ${title}`}
                  >
                    Découvrir <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── 03b. NEUROFEEDBACK SPOTLIGHT ─────────────────────────────── */}
      <section className="py-20 bg-white" aria-label="Neurofeedback NeurOptimal®">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            <motion.div variants={fadeInLeft} className="flex flex-col gap-5">
              <p className="text-[11px] font-mono tracking-widest uppercase text-[#C4903E]">
                Technologie · Zengar Institute
              </p>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight">
                Neurofeedback NeurOptimal®
              </h2>
              <p className="text-gray-500 text-[16px] leading-relaxed max-w-lg">
                Une technologie d'entraînement cérébral non invasive qui permet au système nerveux de développer flexibilité et résilience. Dès 6 à 10 séances, les clients rapportent un sommeil plus réparateur, une clarté mentale accrue, un calme intérieur et des performances renforcées.
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "Stress, anxiété, burn-out",
                  "Concentration, mémoire, TDA/H",
                  "Sommeil, fatigue chronique",
                  "Performance cognitive et sportive",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-gray-500 text-[14px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C4903E] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to={ROUTES.neurofeedback}
                className="inline-flex items-center gap-2 bg-[#1C3A52] text-white font-bold text-[14px] px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity w-fit mt-2"
              >
                Découvrir le Neurofeedback <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div variants={fadeInRight} className="relative">
              <div aria-hidden="true" className="absolute -bottom-5 -left-5 w-[60%] h-[50%] rounded-[28px]"
                style={{ background: "rgba(196,144,62,0.15)" }} />
              <div aria-hidden="true" className="absolute -top-4 -right-4 w-[35%] h-[40%] rounded-[24px]"
                style={{ background: "rgba(28,58,82,0.10)" }} />
              <div className="relative h-[260px] sm:h-[340px] rounded-[28px] overflow-hidden z-10">
              <img
                src="https://dbneurofeedback.com/wp-content/uploads/2024/12/NEUROPTIMAL-1.jpg"
                alt="Séance de neurofeedback NeurOptimal® — capteurs EEG"
                className="w-full h-full object-cover"
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
        className="py-20 md:py-28 bg-[#1C3A52]"
        aria-labelledby="coach-title"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
            <div className="h-[340px] sm:h-[420px] rounded-[24px] overflow-hidden relative z-10">
              <img
                src={COACH_IMG}
                alt="Noureddine Omar — Coach certifié, ONCoaching Mâcon"
                className="w-full h-full object-cover object-top"
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
              className="text-[13px] font-mono tracking-widest uppercase text-white/40"
              aria-hidden="true"
            >
              Notre coach
            </motion.p>
            <motion.h2
              id="coach-title"
              variants={fadeInUp}
              className="text-[clamp(2rem,5vw,3.2rem)] font-semibold tracking-tight text-white leading-[1.05]"
            >
              Noureddine Omar
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
              Coach certifié, formé par Prisme Évolution, 26 ans enseignant SES.
              Praticien en neurofeedback NeurOptimal® — une double expertise pour agir à la fois
              sur le cerveau et sur les comportements, au service de votre évolution.
            </motion.p>

            <motion.blockquote
              variants={fadeInUp}
              className="border-l-2 border-[#C4903E] pl-5 text-[15px] italic text-white/50 leading-relaxed"
            >
              "Le changement commence là où la zone de confort s'arrête."
            </motion.blockquote>

            <motion.div variants={fadeInUp}>
              <Link
                to={ROUTES.about}
                className="flex sm:inline-flex items-center justify-center gap-2.5 bg-[#C4903E] text-[#1C3A52] font-bold text-[15px] px-6 py-4 rounded-full hover:opacity-90 transition-opacity"
                aria-label="Découvrir l'approche de Noureddine Omar"
              >
                Découvrir l'approche
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 05. PROCESSUS ────────────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 bg-white"
        aria-labelledby="processus-title"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 flex flex-col gap-14">
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
              Comment ça marche
            </motion.p>
            <motion.h2
              id="processus-title"
              variants={fadeInUp}
              className="text-[clamp(1.8rem,4.5vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-[1.05]"
            >
              Trois étapes vers votre transformation
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 items-start"
          >
            {STEPS.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                variants={springUp}
                className="flex flex-col gap-5 bg-[#F3F4F6] md:bg-transparent rounded-[24px] md:rounded-none p-6 md:p-0 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:shadow-none"
              >
                <div className="flex items-center gap-4 md:block md:space-y-5">
                  <span
                    className="font-mono text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none text-[#F3F4F6] select-none"
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
                {i < STEPS.length - 1 && (
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
              Démarrer gratuitement
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 06. VIDÉO ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F3F4F6]" aria-label="Vidéo ON Coaching">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          >
            {/* Texte */}
            <motion.div variants={fadeInLeft} className="flex flex-col gap-5">
              <p className="text-[12px] font-mono tracking-widest uppercase text-[#C4903E]" aria-hidden="true">
                ONCoaching · En action
              </p>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-[1.05]">
                Découvrez<br />
                <span className="text-[#C4903E]">notre approche</span><br />
                en vidéo.
              </h2>
              <p className="text-[15px] text-gray-500 leading-relaxed max-w-md">
                Une séance, une transformation. Voyez comment le coaching ON change concrètement la trajectoire de nos clients.
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="self-start">
                <a
                  href="https://www.facebook.com/reel/2910146945849990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1C3A52] text-white font-bold text-[14px] px-6 py-3.5 rounded-full hover:opacity-85 transition-opacity"
                  aria-label="Voir la vidéo ON Coaching sur Facebook"
                >
                  Voir sur Facebook
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </motion.div>
            </motion.div>

            {/* Lecteur vidéo custom 16:9 */}
            <motion.div variants={fadeInRight}>
              <VideoPlayer
                src={`${import.meta.env.BASE_URL}coaching-reel.mp4`}
                facebookUrl="https://www.facebook.com/reel/2910146945849990"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 07. TÉMOIGNAGE ───────────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 bg-[#F3F4F6]"
        aria-label="Témoignage client"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={fadeInScale}
            className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6"
          >
            <div
              className="flex gap-1"
              role="img"
              aria-label="Note 5 étoiles sur 5"
            >
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <span
                    key={i}
                    className="text-[#C4903E] text-[1.4rem]"
                    aria-hidden="true"
                  >
                    ★
                  </span>
                ))}
            </div>

            <blockquote className="text-[1.25rem] md:text-[1.5rem] font-medium text-[#1C3A52] leading-relaxed italic">
              "L'accompagnement d'ON Coaching m'a permis de structurer ma vision
              et de retrouver une parfaite synergie entre ma vie professionnelle
              et personnelle. Un coach à l'écoute, bienveillant et efficace."
            </blockquote>

            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full bg-[#1C3A52] flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <span className="text-[#C4903E] text-[13px] font-bold">
                  MA
                </span>
              </div>
              <div className="text-left">
                <p className="text-[15px] font-bold text-[#1C3A52]">Marc A.</p>
                <p className="text-[14px] text-gray-500">Directeur Associé</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 08. CTA FINAL ────────────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 bg-[#1C3A52]"
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
              className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-white leading-[1.05]"
            >
              {content?.cta?.title ?? "Passez au niveau supérieur."}
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-[1rem] text-white/55 max-w-md leading-relaxed"
            >
              {content?.cta?.subtitle ?? "Consultation initiale offerte. Sans engagement. Disponible pour de nouveaux accompagnements."}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={ROUTES.contact}
                  className="bg-[#C4903E] text-[#1C3A52] font-bold text-[15px] px-7 py-4 rounded-full flex items-center gap-2.5 hover:opacity-90 transition-opacity"
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
                  className="border border-white/25 text-white font-bold text-[15px] px-7 py-4 rounded-full hover:bg-white/10 transition-colors"
                >
                  Voir les tarifs
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
