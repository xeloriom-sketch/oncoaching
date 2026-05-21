import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Zap,
  Brain,
  Users,
  Play,
} from "lucide-react";
import Layout from "@/components/Layout";
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

const COACH_IMG =
  `${import.meta.env.BASE_URL}patron.webp`;

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
    desc: "Amélioration des capacités cognitives et gestion du stress grâce au neurofeedback.",
    href: ROUTES.neurofeedback,
    tag: "Non invasif · Scientifique",
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
    bg: "#0B0B0C",
    text: "text-white",
    sub: "text-white/55",
    tag: "bg-white/10 text-white/60",
    icon: "bg-[#1ab5c7] text-white",
    link: "text-[#1ab5c7]",
  },
  {
    bg: "#1ab5c7",
    text: "text-[#0B0B0C]",
    sub: "text-black/65",
    tag: "bg-black/10 text-black/60",
    icon: "bg-[#0B0B0C] text-[#1ab5c7]",
    link: "text-[#0B0B0C]",
  },
  {
    bg: "#F3F4F6",
    text: "text-[#0B0B0C]",
    sub: "text-gray-500",
    tag: "bg-[#0B0B0C]/8 text-gray-500",
    icon: "bg-[#0B0B0C] text-[#1ab5c7]",
    link: "text-[#0B0B0C]",
  },
  {
    bg: "#0B0B0C",
    text: "text-white",
    sub: "text-white/55",
    tag: "bg-white/10 text-white/60",
    icon: "bg-[#1ab5c7] text-white",
    link: "text-[#1ab5c7]",
  },
];

const STATS = [
  { value: "26 ans", label: "Enseignant SES" },
  { value: "100+", label: "Accompagnements" },
  { value: "ICF", label: "Certifié Prisme Évolution" },
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

const H1_WORDS_A = "Développez votre".split(" ");
const H1_WORDS_B = "potentiel".split(" ");

export default function Index() {
  return (
    <Layout>
      <SEO
        title="ON Coaching — Coach Certifié ICF à Mâcon | Sancé"
        description="Coach certifié ICF à Mâcon (Sancé, 71). 26 ans d'expérience. Coaching scolaire, jeunes adultes, neurofeedback, équipe. 1er rendez-vous offert sans engagement."
        canonical="/"
        keywords="coaching mâcon, coach certifié ICF, coaching scolaire, neurofeedback mâcon, coaching jeunes, coaching équipe, sancé, bourgogne"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://www.oncoaching.fr/#webpage",
            name: "ON Coaching — Accueil",
            url: "https://www.oncoaching.fr/",
            isPartOf: { "@id": "https://www.oncoaching.fr/#website" },
            about: { "@id": "https://www.oncoaching.fr/#business" },
            description: "Coach certifié ICF à Mâcon. Coaching scolaire, jeunes adultes, neurofeedback et coaching d'équipe.",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://www.oncoaching.fr/#website",
            url: "https://www.oncoaching.fr",
            name: "ON Coaching",
            inLanguage: "fr-FR",
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: "https://www.oncoaching.fr/?s={search_term_string}" },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Services de coaching — ON Coaching",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Coaching scolaire & étudiant", url: "https://www.oncoaching.fr/coaching-scolaire" },
              { "@type": "ListItem", position: 2, name: "Coaching jeunes & jeunes adultes", url: "https://www.oncoaching.fr/coaching-jeunes" },
              { "@type": "ListItem", position: 3, name: "Coaching & Neurofeedback", url: "https://www.oncoaching.fr/coaching-neurofeedback" },
              { "@type": "ListItem", position: 4, name: "Coaching d'équipe", url: "https://www.oncoaching.fr/coaching-equipe" },
            ],
          },
        ]}
      />

      {/* ── 01. HERO ─────────────────────────────────────────────────── */}
      <section
        className="w-full bg-white min-h-[92vh] flex items-center py-12 md:py-16"
        aria-labelledby="home-h1"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-7"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 bg-[#F3F4F6] text-[#0B0B0C] text-sm font-medium px-4 py-2 rounded-full">
                <span
                  className="w-2 h-2 rounded-full bg-[#1ab5c7] animate-pulse"
                  aria-hidden="true"
                />
                Coaching certifié ICF · Mâcon
              </span>
            </motion.div>

            <h1
              id="home-h1"
              className="font-semibold leading-[1.0] tracking-tight text-[#0B0B0C]"
              style={{ fontSize: "clamp(2.2rem,7vw,6rem)" }}
            >
              {H1_WORDS_A.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 18,
                    delay: i * 0.1,
                  }}
                  className="inline-block mr-[0.2em]"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {H1_WORDS_B.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 18,
                    delay: 0.22 + i * 0.1,
                  }}
                  className="inline-block mr-[0.2em]"
                >
                  {word}
                </motion.span>
              ))}{" "}
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 18,
                  delay: 0.34,
                }}
                className="inline-block text-[#1ab5c7]"
              >
                infini.
              </motion.span>
            </h1>

            <motion.p
              variants={fadeInUp}
              className="text-[1rem] text-gray-500 leading-relaxed max-w-md"
            >
              Accompagnement personnalisé pour particuliers et entreprises.
              Coach certifié, 26 ans d'expérience en sciences humaines.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={ROUTES.contact}
                  className="bg-[#0B0B0C] text-white rounded-full py-3.5 px-6 flex items-center justify-center gap-2.5 text-[15px] font-semibold hover:opacity-90 transition-opacity shadow-[0_8px_24px_rgba(11,11,12,0.2)]"
                  aria-label="Prendre rendez-vous avec ON Coaching"
                >
                  Prendre RDV
                  <motion.span
                    whileHover={{ x: 2, y: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className="w-6 h-6 bg-white/15 rounded-full flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={ROUTES.about}
                  className="bg-[#F3F4F6] text-[#0B0B0C] rounded-full py-3.5 px-6 text-[15px] font-semibold hover:bg-gray-200 transition-colors"
                >
                  <motion.span whileHover={{ x: 1.5 }} transition={{ type: "spring", stiffness: 320, damping: 22 }} className="inline-block">
                    Notre approche
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-sm text-gray-400 flex items-center gap-2"
            >
              <span className="text-[#1ab5c7]" aria-hidden="true">
                ☉
              </span>
              1er rendez-vous offert · Sans engagement
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative"
          >
            <div className="relative overflow-hidden h-[320px] sm:h-[420px] lg:h-[600px]">
              <img
                src={COACH_IMG}
                alt="Noureddine Omar — Coach certifié ICF, ON Coaching Mâcon"
                className="w-full h-full object-cover object-top"
                fetchpriority="high"
                loading="eager"
                decoding="async"
              />

              {/* Dégradé bas */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.5) 75%, rgba(255,255,255,0.9) 90%, white 100%)" }}
                aria-hidden="true"
              />

              {/* Bulle "Coach certifié ICF" */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ y: -3 }}
                className="absolute bottom-14 right-4 bg-[#0B0B0C]/85 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-lg"
              >
                <p className="text-white text-[13px] font-semibold">Coach certifié ICF</p>
                <p className="text-white/50 text-[11px] mt-0.5">Prisme Évolution</p>
              </motion.div>

              {/* Bulle "Disponible" */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ y: -2 }}
                className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#0B0B0C]/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2.5 shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-[#1ab5c7] animate-pulse" aria-hidden="true" />
                <span className="text-white text-[12px] font-semibold">Disponible</span>
              </motion.div>
            </div>
          </motion.div>
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
                  className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-tight text-[#0B0B0C] leading-none font-mono"
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
              className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1.05]"
            >
              Un accompagnement unique
              <br className="hidden sm:block" /> pour des résultats durables
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
            {SERVICES.map(({ key, Icon, title, desc, href, tag }, i) => {
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

      {/* ── 04. COACH BIO ────────────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 bg-[#0B0B0C]"
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
            <div className="h-[340px] sm:h-[420px] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <img
                src={COACH_IMG}
                alt="Noureddine Omar — Coach certifié ICF, ON Coaching Mâcon"
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
              {["ICF", "26 ans"].map((badge) => (
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
              Une double expertise pédagogique et humaine au service de votre
              évolution personnelle et professionnelle.
            </motion.p>

            <motion.blockquote
              variants={fadeInUp}
              className="border-l-2 border-[#1ab5c7] pl-5 text-[15px] italic text-white/50 leading-relaxed"
            >
              "Le changement commence là où la zone de confort s'arrête."
            </motion.blockquote>

            <motion.div variants={fadeInUp}>
              <Link
                to={ROUTES.about}
                className="flex sm:inline-flex items-center justify-center gap-2.5 bg-[#1ab5c7] text-[#0B0B0C] font-bold text-[15px] px-6 py-4 rounded-full hover:opacity-90 transition-opacity"
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
              className="text-[clamp(1.8rem,4.5vw,3rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1.05]"
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
                  <h3 className="text-[18px] font-bold text-[#0B0B0C]">
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
              className="w-full sm:w-auto justify-center bg-[#0B0B0C] text-white font-bold text-[15px] px-8 py-4 rounded-full flex items-center gap-2.5 hover:opacity-85 transition-opacity shadow-[0_8px_32px_rgba(11,11,12,0.25)]"
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
              <p className="text-[12px] font-mono tracking-widest uppercase text-[#1ab5c7]" aria-hidden="true">
                On Coaching · En action
              </p>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1.05]">
                Découvrez<br />
                <span className="text-[#1ab5c7]">notre approche</span><br />
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
                  className="inline-flex items-center gap-2 bg-[#0B0B0C] text-white font-bold text-[14px] px-6 py-3.5 rounded-full hover:opacity-85 transition-opacity"
                  aria-label="Voir la vidéo ON Coaching sur Facebook"
                >
                  Voir sur Facebook
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </motion.div>
            </motion.div>

            {/* Carte vidéo cliquable */}
            <motion.div variants={fadeInRight}>
              <motion.a
                href="https://www.facebook.com/reel/2910146945849990"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="block relative w-full rounded-[24px] overflow-hidden bg-[#0B0B0C] group aspect-video"
                aria-label="Voir le reel ON Coaching sur Facebook"
              >
                {/* Gradient décoratif */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1ab5c7]/20 via-transparent to-[#0B0B0C]" aria-hidden="true" />

                {/* Bouton Play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[72px] h-[72px] bg-[#1ab5c7] rounded-full flex items-center justify-center shadow-[0_8px_40px_rgba(26,181,199,0.45)] group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 text-white ml-1" fill="currentColor" aria-hidden="true" />
                  </div>
                </div>

                {/* Label bas */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <span className="text-white/70 text-[13px] font-medium">ON Coaching · Reel</span>
                  <span className="bg-white/10 border border-white/15 text-white/60 text-[11px] px-3 py-1 rounded-full">
                    Facebook
                  </span>
                </div>
              </motion.a>
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
                    className="text-[#1ab5c7] text-[1.4rem]"
                    aria-hidden="true"
                  >
                    ★
                  </span>
                ))}
            </div>

            <blockquote className="text-[1.25rem] md:text-[1.5rem] font-medium text-[#0B0B0C] leading-relaxed italic">
              "L'accompagnement d'ON Coaching m'a permis de structurer ma vision
              et de retrouver une parfaite synergie entre ma vie professionnelle
              et personnelle. Un coach à l'écoute, bienveillant et efficace."
            </blockquote>

            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full bg-[#0B0B0C] flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <span className="text-[#1ab5c7] text-[13px] font-bold">
                  MA
                </span>
              </div>
              <div className="text-left">
                <p className="text-[15px] font-bold text-[#0B0B0C]">Marc A.</p>
                <p className="text-[14px] text-gray-500">Directeur Associé</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 08. CTA FINAL ────────────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 bg-[#0B0B0C]"
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
              Passez au niveau supérieur.
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-[1rem] text-white/55 max-w-md leading-relaxed"
            >
              Consultation initiale offerte. Sans engagement. Disponible pour de
              nouveaux accompagnements.
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
                  className="bg-[#1ab5c7] text-[#0B0B0C] font-bold text-[15px] px-7 py-4 rounded-full flex items-center gap-2.5 hover:opacity-90 transition-opacity"
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
