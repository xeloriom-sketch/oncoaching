import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, ArrowRight, Check,
  Briefcase, LineChart, Users, Target,
  Award, GraduationCap, Brain, Zap,
  ChevronRight,
} from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { fadeInUp, springUp, staggerContainer, cardHoverProps, VP } from "@/lib/motion";
import { ROUTES } from "@/lib/config";

// ─── Contenu réel du site ─────────────────────────────────────────────────────
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
    desc: "Accompagnement lors des choix d'orientation, insertion pro, confiance et construction du projet de vie.",
    href: ROUTES.jeunes,
    tag: "15 – 30 ans",
  },
  {
    key: "neurofeedback",
    Icon: Brain,
    title: "Coaching & Neurofeedback",
    desc: "Amélioration des capacités cognitives, gestion du stress et du mental grâce au neurofeedback.",
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

const POLES = [
  {
    id: "01",
    title: "Coaching scolaire & étudiant",
    desc: "Retrouver la motivation, améliorer les méthodes de travail, gérer le stress et clarifier son orientation.",
    href: ROUTES.scolaire,
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "Coaching jeunes & jeunes adultes",
    desc: "Traverser les transitions de vie avec clarté, confiance et construction d'un projet personnel.",
    href: ROUTES.jeunes,
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Coaching & Neurofeedback",
    desc: "Entraîner le cerveau pour réduire le stress, améliorer la concentration et optimiser les performances.",
    href: ROUTES.neurofeedback,
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "Coaching d'équipe",
    desc: "Fédérer, renforcer la cohésion, clarifier les rôles et développer l'intelligence collective.",
    href: ROUTES.equipe,
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80&auto=format&fit=crop",
  },
];

const STATS = [
  { Icon: GraduationCap, label: "26 ans",       desc: "Enseignant SES" },
  { Icon: Award,         label: "ICF Certifié",  desc: "Prisme Évolution" },
  { Icon: Users,         label: "Particuliers",  desc: "Coaching sur mesure" },
  { Icon: Briefcase,     label: "Entreprises",   desc: "Coaching d'équipe" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Index() {
  const [activePole, setActivePole] = useState(0);

  return (
    <Layout>
      <SEO
        title="ON Coaching — Coaching Particuliers &amp; Entreprises à Mâcon"
        description="Coach certifié ICF à Mâcon (Sancé). 26 ans d'expérience. Coaching scolaire, jeunes adultes, neurofeedback et coaching d'équipe. Premier rendez-vous offert."
        canonical="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type":    "WebPage",
          "name":     "ON Coaching — Accueil",
          "url":      "https://www.oncoaching.fr/",
          "isPartOf": { "@id": "https://www.oncoaching.fr/#website" },
        }}
      />

      <div className="w-full bg-white min-h-screen px-4 py-6 md:px-12 md:py-8 space-y-10 md:space-y-14">

        {/* ── 01. HERO ────────────────────────────────────────────────── */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 items-start"
          aria-labelledby="home-h1"
        >
          <motion.div variants={fadeInUp} className="lg:col-span-8">
            <motion.p
              variants={fadeInUp}
              className="text-[11px] font-mono tracking-widest uppercase text-gray-400 mb-4 flex items-center gap-2"
              aria-hidden="true"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1ab5c7] inline-block animate-pulse" />
              Coaching certifié ICF · Mâcon, France
            </motion.p>
            <h1
              id="home-h1"
              className="text-[clamp(2.2rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tight text-[#0B0B0C]"
            >
              {"Développez votre".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden:  { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20, delay: i * 0.08 } },
                  }}
                  className="inline-block mr-[0.22em]"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {"potentiel infini.".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden:  { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.24 + i * 0.08 } },
                  }}
                  className="inline-block mr-[0.22em]"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:col-span-4 lg:pt-2 space-y-5 flex flex-col justify-end">
            <p className="text-[14px] text-gray-500 leading-relaxed max-w-[340px]">
              Accompagnement personnalisé pour particuliers et entreprises. Coach certifié, 26 ans d'expérience en sciences humaines.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={ROUTES.contact}
                  className="bg-[#0B0B0C] text-white rounded-full py-3 px-5 flex items-center gap-2 text-[13px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Prendre RDV
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center" aria-hidden="true">
                    <ArrowUpRight className="w-3 h-3 text-white" />
                  </div>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={ROUTES.about}
                  className="bg-[#F3F4F6] text-[#0B0B0C] rounded-full py-3 px-5 text-[13px] font-semibold hover:bg-gray-200 transition-colors"
                >
                  Notre approche
                </Link>
              </motion.div>
            </div>
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <span className="text-[#1ab5c7]" aria-hidden="true">☉</span>
              1er rendez-vous offert · Sans engagement
            </p>

          </motion.div>
        </motion.header>

        {/* ── 02. HERO IMAGE ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[300px] sm:h-[400px] md:h-[520px] rounded-[32px] overflow-hidden border border-gray-100"
        >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&q=90&auto=format&fit=crop"
            alt="Coaching professionnel — ON Coaching Mâcon"
            className="w-full h-full object-cover scale-[1.02]"
            loading="eager"
            decoding="async"
            style={{ filter: "contrast(1.05) brightness(0.95)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" aria-hidden="true" />

          {/* Badge flottant */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[#0B0B0C]/80 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-[24px] max-w-[260px] hidden sm:block shadow-2xl"
          >
            <p className="text-[11px] font-mono tracking-widest uppercase opacity-40 mb-2 text-[#1ab5c7]" aria-hidden="true">↳ VISION ON</p>
            <p className="text-[13px] font-semibold leading-tight mb-2 text-white">
              Le changement commence là où la zone de confort s'arrête.
            </p>
            <p className="text-[11px] text-white/50">
              Programmes sur-mesure alignés avec vos objectifs de performance.
            </p>
          </motion.div>

          {/* Badge disponibilité */}
          <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-[#1ab5c7] animate-pulse" aria-hidden="true" />
            <span className="text-white text-[11px] font-semibold">Disponible pour nouveaux accompagnements</span>
          </div>
        </motion.div>

        {/* ── 03. STATS STRIP ─────────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          variants={staggerContainer}
          className="bg-[#F3F4F6] rounded-[24px] p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          aria-label="Points forts"
        >
          {STATS.map(({ Icon, label, desc }, i) => (
            <motion.div
              key={i}
              variants={springUp}
              whileHover={{ y: -6, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex flex-col items-center justify-center p-2 group cursor-default"
            >
              <motion.div
                className="p-2.5 rounded-xl bg-white shadow-sm group-hover:bg-[#1ab5c7] transition-colors duration-300"
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                aria-hidden="true"
              >
                <Icon className="w-5 h-5 text-[#0B0B0C] group-hover:text-white transition-colors" strokeWidth={1.5} />
              </motion.div>
              <p className="text-[13px] font-bold text-[#0B0B0C] mt-2">{label}</p>
              <p className="text-[11px] text-gray-400">{desc}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ── 04. SECTION TITLE ───────────────────────────────────────── */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-[11px] font-mono tracking-widest uppercase text-gray-400" aria-hidden="true">Nos services</p>
          <h2 className="text-[2rem] md:text-[3rem] font-semibold tracking-tight text-[#0B0B0C] leading-none">
            Un accompagnement unique<br className="hidden sm:block" /> pour des résultats durables
          </h2>
        </div>

        {/* ── 05. SERVICES GRID ───────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          aria-label="Nos services de coaching"
        >
          {SERVICES.map(({ key, Icon, title, desc, href, tag }, i) => {
            const configs = [
              { bg: "#0B0B0C", text: "text-white",     sub: "text-white/50",  tagColor: "bg-white/10 text-white/60", icon: "bg-[#1ab5c7] text-white", link: "text-[#1ab5c7]" },
              { bg: "#1ab5c7", text: "text-[#0B0B0C]", sub: "text-black/60",  tagColor: "bg-black/10 text-black/60", icon: "bg-[#0B0B0C] text-[#1ab5c7]", link: "text-[#0B0B0C]" },
              { bg: "#F3F4F6", text: "text-[#0B0B0C]", sub: "text-gray-500",  tagColor: "bg-[#0B0B0C]/8 text-gray-500", icon: "bg-[#0B0B0C] text-[#1ab5c7]", link: "text-[#0B0B0C]" },
              { bg: "#0B0B0C", text: "text-white",     sub: "text-white/50",  tagColor: "bg-white/10 text-white/60", icon: "bg-[#1ab5c7] text-white", link: "text-[#1ab5c7]" },
            ];
            const c = configs[i];
            return (
              <motion.article
                key={key}
                variants={springUp}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="rounded-[28px] p-7 flex flex-col gap-4 cursor-default"
                style={{ background: c.bg }}
              >
                <div className="flex items-start justify-between gap-4">
                  <motion.div
                    className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}
                    whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                  </motion.div>
                  <span className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full flex-shrink-0 ${c.tagColor}`}>
                    {tag}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-[1rem] tracking-tight mb-2 ${c.text}`}>{title}</h3>
                  <p className={`text-[13px] leading-relaxed ${c.sub}`}>{desc}</p>
                </div>
                <Link
                  to={href}
                  className={`flex items-center gap-1.5 text-[12px] font-bold transition-all hover:gap-2.5 ${c.link}`}
                >
                  En savoir plus <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </motion.article>
            );
          })}
        </motion.section>

        {/* ── 06. COACH SECTION ───────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6 }}
          className="bg-[#F3F4F6] rounded-[32px] p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center overflow-hidden"
          aria-labelledby="coach-title"
        >
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-full sm:w-[220px] h-[240px] rounded-[24px] overflow-hidden shadow-sm flex-shrink-0">
              <img
                src="https://tewufxbicqopmgwh.public.blob.vercel-storage.com/landing-pages/b482799c-ade7-4574-9136-60f1249636a0/images/1775986388549-photo_pour_r_seaux.jpg"
                alt="Noureddine Omar — Coach certifié ICF, ON Coaching Mâcon"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-2" aria-hidden="true">Notre coach</p>
                <h2 id="coach-title" className="text-[1.8rem] sm:text-[2.2rem] font-semibold leading-[1.1] tracking-tight text-[#0B0B0C]">
                  Parce que chaque parcours compte.
                </h2>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed max-w-[340px]">
                Coach certifié, formé par Prisme Évolution, 26 ans enseignant SES. Une double expertise pédagogique et humaine au service de votre évolution.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] bg-[#0B0B0C] text-white rounded-full px-3 py-1 font-medium">ICF Certifié</span>
                <span className="text-[11px] bg-[#0B0B0C] text-white rounded-full px-3 py-1 font-medium">Prisme Évolution</span>
                <span className="text-[11px] bg-[#0B0B0C] text-white rounded-full px-3 py-1 font-medium">26 ans d'expérience</span>
              </div>
              <Link
                to={ROUTES.about}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full py-2.5 px-5 text-[12px] font-bold text-[#0B0B0C] hover:bg-[#1ab5c7] hover:border-[#1ab5c7] transition-all"
              >
                Découvrir notre approche <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Focus session */}
          <div className="lg:col-span-5 bg-[#1ab5c7] rounded-[28px] overflow-hidden p-6 flex flex-col justify-between h-[280px] group">
            <div className="relative w-full h-[130px] rounded-[18px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80&auto=format&fit=crop"
                alt="Session de coaching professionnel"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute top-2 left-2 bg-[#0B0B0C] text-white text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full" aria-hidden="true">
                SÉANCE
              </span>
            </div>
            <div className="pt-4 flex justify-between items-end gap-2">
              <div>
                <h3 className="font-bold text-[16px] text-[#0B0B0C]">Consultation Découverte</h3>
                <p className="text-[11px] text-black/60 mt-0.5">Évaluation & plan d'accompagnement sur-mesure.</p>
                <p className="text-[13px] font-mono font-bold mt-1 text-[#0B0B0C]">1er RDV offert</p>
              </div>
              <Link
                to={ROUTES.contact}
                aria-label="Prendre rendez-vous"
                className="w-10 h-10 rounded-full bg-[#0B0B0C] flex items-center justify-center text-white hover:scale-110 transition-transform flex-shrink-0"
              >
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ── 07. OFFRE / DIAGNOSTIC ──────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            className="md:col-span-5 bg-[#1ab5c7] rounded-[32px] p-5 flex flex-col justify-between relative overflow-hidden h-[230px]"
          >
            <div>
              <h2 className="text-[16px] font-bold text-[#0B0B0C] tracking-tight mb-3">Consultation Initiale Gratuite</h2>
              <ul className="text-[12px] space-y-1.5 text-black/80">
                {[
                  "Évaluation complète de votre situation",
                  "Définition précise de vos objectifs",
                  "Plan d'accompagnement sur-mesure",
                  "Sans engagement · Confidentiel",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3 h-3 flex-shrink-0" strokeWidth={3} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between border border-white/20">
              <div className="flex items-baseline gap-1">
                <span className="text-[18px] font-mono font-bold text-[#0B0B0C]">1er RDV</span>
                <span className="text-[10px] text-black/60 ml-1">offert</span>
              </div>
              <Link
                to={ROUTES.contact}
                className="bg-[#0B0B0C] text-white text-[11px] font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
              >
                Réserver →
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ delay: 0.1 }}
            className="md:col-span-7 relative rounded-[32px] overflow-hidden h-[230px] border border-gray-100"
          >
            <img
              src="https://tewufxbicqopmgwh.public.blob.vercel-storage.com/landing-pages/b482799c-ade7-4574-9136-60f1249636a0/images/1775986388549-photo_pour_r_seaux.jpg"
              alt="Noureddine Omar — Coach certifié ICF, ON Coaching Mâcon"
              className="w-full h-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <p className="text-[11px] font-bold text-[#0B0B0C]">Garantie ON Coaching</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Suivi d'excellence basé sur la confiance mutuelle et le secret professionnel.</p>
            </div>
          </motion.div>
        </section>

        {/* ── 08. ACCORDION DARK — NOS PÔLES ─────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6 }}
          className="bg-[#0B0B0C] text-white rounded-[36px] p-6 md:p-10 relative overflow-hidden"
          aria-labelledby="poles-title"
        >
          <div className="mb-8">
            <p className="text-[11px] text-white/40 font-mono mb-2" aria-hidden="true">ON COACHING FRANCE ☉ EXPERTISE COMPLÈTE</p>
            <h2 id="poles-title" className="text-[24px] md:text-[32px] font-semibold tracking-tight">
              Nos pôles d'accompagnement
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            {POLES.map((pole, idx) => {
              const isActive = activePole === idx;
              return (
                <div key={pole.id}>
                  <button
                    onClick={() => setActivePole(idx)}
                    aria-expanded={isActive}
                    className={`w-full relative py-5 flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-colors duration-300 text-left ${
                      isActive ? "text-[#1ab5c7]" : "text-white hover:text-white/80"
                    }`}
                  >
                    <div className="flex items-center gap-4 md:w-1/3">
                      <span className="text-[11px] font-mono tracking-widest opacity-40" aria-hidden="true">{pole.id}</span>
                      <span className="text-[16px] sm:text-[18px] font-bold tracking-tight uppercase">{pole.title}</span>
                    </div>
                    <p className="text-[12px] text-white/50 max-w-sm mt-1 md:mt-0 flex-1 md:px-4">{pole.desc}</p>
                    <motion.div
                      animate={{ rotate: isActive ? 45 : 0 }}
                      className={`mt-2 md:mt-0 w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isActive ? "border-[#1ab5c7] bg-[#1ab5c7] text-white" : "border-white/20 text-white"
                      }`}
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.div>

                    {/* Image dynamique desktop */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, rotate: -3, x: 30 }}
                          animate={{ opacity: 1, scale: 1, rotate: 4, x: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotate: -3, x: 30 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="absolute right-[15%] top-[-10px] hidden lg:block w-[180px] h-[110px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white pointer-events-none z-20"
                          aria-hidden="true"
                        >
                          <img
                            src={pole.img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>

                  {/* Lien en savoir plus quand actif */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5">
                          <Link
                            to={pole.href}
                            className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white text-[12px] font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                          >
                            Découvrir ce service <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 09. TÉMOIGNAGE ──────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6 }}
          className="bg-[#F3F4F6] rounded-[32px] p-8 md:p-10"
          aria-label="Témoignage client"
        >
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center gap-1" aria-label="5 étoiles" role="img">
              {Array(5).fill(null).map((_, i) => (
                <span key={i} className="text-[#1ab5c7] text-lg" aria-hidden="true">★</span>
              ))}
            </div>
            <blockquote className="text-[1.1rem] md:text-[1.25rem] font-medium text-[#0B0B0C] leading-relaxed italic">
              "L'accompagnement d'ON Coaching m'a permis de structurer ma vision et de retrouver une parfaite synergie entre ma vie professionnelle et personnelle. Un coach à l'écoute, bienveillant et efficace."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0B0B0C] flex items-center justify-center" aria-hidden="true">
                <span className="text-[#1ab5c7] text-[12px] font-bold">M.A</span>
              </div>
              <div className="text-left">
                <p className="text-[13px] font-bold text-[#0B0B0C]">Marc A.</p>
                <p className="text-[11px] text-gray-500">Directeur Associé</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── 10. CTA FINAL ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6 }}
          className="text-center py-4 space-y-6"
        >
          <h2 className="text-[1.8rem] sm:text-[2.5rem] md:text-[3rem] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
            Passez au niveau supérieur.<br />
            <span style={{ color: "#1ab5c7", WebkitTextStroke: "1px #0B0B0C" }}>Activez votre potentiel.</span>
          </h2>
          <p className="text-gray-500 text-[14px] max-w-md mx-auto">
            Consultation initiale offerte. Sans engagement. Disponible pour de nouveaux accompagnements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to={ROUTES.contact}
              className="bg-[#0B0B0C] text-white text-[13px] font-bold px-7 py-3.5 rounded-full flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              Contacter un coach <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <Link
              to={ROUTES.tarifs}
              className="bg-[#F3F4F6] text-[#0B0B0C] text-[13px] font-bold px-7 py-3.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Voir nos tarifs
            </Link>
          </div>
          {/* Liens rapides */}
          <nav aria-label="Liens rapides" className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-gray-400 uppercase tracking-wider">
            {[
              { label: "Accueil",       href: ROUTES.home },
              { label: "À Propos",      href: ROUTES.about },
              { label: "Nos Tarifs",    href: ROUTES.tarifs },
              { label: "Contact",       href: ROUTES.contact },
              { label: "Coaching Scolaire", href: ROUTES.scolaire },
              { label: "Coaching Jeunes",   href: ROUTES.jeunes },
            ].map(({ label, href }) => (
              <Link key={href} to={href} className="hover:text-[#0B0B0C] transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </motion.section>

      </div>
    </Layout>
  );
}
