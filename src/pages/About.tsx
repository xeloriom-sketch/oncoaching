import { motion } from "framer-motion";
import { Award, Heart, LightbulbIcon, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { usePageContent } from "@/hooks/usePageContent";
import { fadeInUp, stagger, VP } from "@/lib/motion";
import type { AboutContent } from "@/types";

const VALUES_ICONS: Record<string, React.ElementType> = {
  empathie: Heart, excellence: Award, innovation: LightbulbIcon,
};

const CARD_CONFIGS = [
  { bg: "#0B0B0C", text: "text-white",     sub: "text-white/50",  iconBg: "bg-[#1ab5c7]", iconColor: "text-[#0B0B0C]" },
  { bg: "#1ab5c7", text: "text-[#0B0B0C]", sub: "text-black/60",  iconBg: "bg-[#0B0B0C]", iconColor: "text-[#1ab5c7]" },
  { bg: "#F3F4F6", text: "text-[#0B0B0C]", sub: "text-gray-500",  iconBg: "bg-[#0B0B0C]", iconColor: "text-[#1ab5c7]" },
];

const COACH_IMG = "https://tewufxbicqopmgwh.public.blob.vercel-storage.com/landing-pages/b482799c-ade7-4574-9136-60f1249636a0/images/1775986388549-photo_pour_r_seaux.jpg";

const About = () => {
  const { content, loading } = usePageContent<AboutContent>("about");

  if (loading || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white" aria-label="Chargement…">
          <div className="w-8 h-8 border-2 border-[#1ab5c7] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const { hero, whoSection, valuesSection, cta } = content;

  return (
    <Layout>
      <SEO
        title="À Propos — Coach ICF Certifié"
        description="Coach certifié ICF, formé par Prisme Évolution. Ancien enseignant SES, 26 ans d'expérience. Accompagnement à Sancé (Mâcon) et à distance."
        canonical="/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type":    "AboutPage",
          "name":     "À Propos | ON Coaching",
          "url":      "https://www.oncoaching.fr/about",
        }}
      />

      <div className="w-full bg-white min-h-screen px-4 py-6 md:px-12 md:py-8 space-y-6">

        {/* ── HERO ────────────────────────────────── */}
        <motion.section
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2"
          aria-labelledby="about-h1"
        >
          <motion.div variants={fadeInUp} className="lg:col-span-8 space-y-4">
            <p className="text-[11px] font-mono tracking-widest uppercase text-gray-400" aria-hidden="true">
              ↳ Notre histoire
            </p>
            <h1 id="about-h1" className="text-[clamp(2.2rem,6vw,5rem)] font-semibold leading-[0.95] tracking-tight text-[#0B0B0C]">
              {hero.title}
            </h1>
          </motion.div>
          <motion.div variants={fadeInUp} className="lg:col-span-4 lg:pt-4 space-y-4 flex flex-col justify-end">
            <p className="text-[14px] text-gray-500 leading-relaxed">{hero.paragraph1}</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-[#1ab5c7]" aria-hidden="true" />
                <span className="text-[12px] font-bold text-[#0B0B0C]">ICF Certifié</span>
              </div>
              <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-4 py-2">
                <span className="text-[12px] font-bold text-[#0B0B0C]">26 ans exp.</span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ── IMAGE HERO ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[260px] sm:h-[380px] md:h-[480px] rounded-[32px] overflow-hidden border border-gray-100"
        >
          <img
            src={COACH_IMG}
            alt="Coach ON Coaching — coach certifié ICF à Mâcon"
            className="w-full h-full object-cover object-top"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
            <div className="bg-[#1ab5c7] rounded-[16px] px-5 py-4 max-w-xs hidden sm:block">
              <p className="text-[11px] font-mono tracking-widest uppercase text-black/60 mb-1" aria-hidden="true">↳ Certifié ICF</p>
              <p className="text-[13px] font-semibold text-[#0B0B0C] leading-tight">
                Former enseignant SES · Coach certifié Prisme Évolution
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#1ab5c7] animate-pulse" aria-hidden="true" />
              <span className="text-white text-[11px] font-semibold">Disponible</span>
            </div>
          </div>
        </motion.div>

        {/* ── QUI SUIS-JE — dark panel ─────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={VP} transition={{ duration: 0.6 }}
          className="bg-[#0B0B0C] rounded-[32px] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start overflow-hidden"
          aria-labelledby="about-who"
        >
          <div className="lg:col-span-5">
            <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-4" aria-hidden="true">
              ON COACHING ☉ {whoSection.title}
            </p>
            <h2 id="about-who" className="text-[1.8rem] md:text-[2.5rem] font-semibold tracking-tight text-white leading-[1.05] mb-2">
              {whoSection.subtitle}
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[14px] text-white/50 leading-relaxed">{whoSection.paragraph1}</p>
            <p className="text-[14px] text-white/50 leading-relaxed">{whoSection.paragraph2}</p>
            <div className="border-t border-white/8 pt-5 mt-5">
              <h3 className="text-[15px] font-bold text-[#1ab5c7] mb-3">{whoSection.differenceTitle}</h3>
              <p className="text-[14px] text-white/50 leading-relaxed mb-3">{whoSection.paragraph3}</p>
              <p className="text-[14px] text-white/50 leading-relaxed">{whoSection.paragraph4}</p>
            </div>
          </div>
        </motion.section>

        {/* ── VALEURS ────────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={stagger}
          aria-labelledby="about-values"
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-2" aria-hidden="true">
                {valuesSection.title}
              </p>
              <h2 id="about-values" className="text-[2rem] md:text-[2.8rem] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
                Ce qui nous<br />distingue
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {valuesSection.values.map((val, i) => {
              const Icon = VALUES_ICONS[val.key] ?? Heart;
              const c    = CARD_CONFIGS[i];
              return (
                <motion.article
                  key={val.key}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[28px] p-7 flex flex-col"
                  style={{ background: c.bg }}
                >
                  <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center mb-6`} aria-hidden="true">
                    <Icon className={`w-5 h-5 ${c.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <h3 className={`font-bold text-[1.1rem] tracking-tight mb-2 ${c.text}`}>{val.title}</h3>
                  <p className={`text-[13px] leading-relaxed flex-1 ${c.sub}`}>{val.description}</p>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* ── CTA ──────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={VP} transition={{ duration: 0.6 }}
          className="text-center py-12 space-y-6"
        >
          <h2 className="text-[2rem] md:text-[3rem] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
            {cta.title}
          </h2>
          <p className="text-gray-500 text-[14px] max-w-md mx-auto">{cta.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to={cta.buttonLink}
              className="bg-[#0B0B0C] text-white font-bold text-[13px] px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {cta.buttonText} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/NosTarifs"
              className="bg-[#F3F4F6] text-[#0B0B0C] font-bold text-[13px] px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              Voir nos tarifs
            </Link>
          </div>
        </motion.section>

      </div>
    </Layout>
  );
};

export default About;
