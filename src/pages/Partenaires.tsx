import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2, Users, Target, Layers, CheckCircle2, ArrowUpRight,
  Check, Lightbulb, Heart, Workflow,
} from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { usePageContent } from "@/hooks/usePageContent";
import { fadeInUp, staggerContainer, VP } from "@/lib/motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ModaliteItem {
  key: string;
  title: string;
  items: string[];
}

interface PartenairesContent {
  hero:          { title: string; subtitle: string; intro: string };
  expertise:     { title: string; subtitle: string; points: string[] };
  publics:       { title: string; items: string[] };
  problematiques:{ title: string; items: string[] };
  modalites:     { title: string; items: ModaliteItem[] };
  methodologie:  { title: string; subtitle: string; steps: string[]; approche: { title: string; items: string[] } };
  formats:       { title: string; items: string[] };
  valeur:        { title: string; items: string[] };
  exemples:      { title: string; items: string[] };
  cta:           { title: string; subtitle: string; buttonText: string; buttonLink: string };
}

const MODALITE_ICONS: Record<string, React.ElementType> = {
  ateliers:     Users,
  individuel:   Target,
  neurofeedback: Layers,
};

const MODALITE_CONFIGS = [
  { bg: "#1C3A52", text: "text-white",     sub: "text-white/50",  iconBg: "bg-[#C4903E]", iconColor: "text-[#1C3A52]", check: "text-[#C4903E]" },
  { bg: "#C4903E", text: "text-[#1C3A52]", sub: "text-black/60",  iconBg: "bg-[#1C3A52]", iconColor: "text-[#C4903E]", check: "text-[#1C3A52]" },
  { bg: "#F3F4F6", text: "text-[#1C3A52]", sub: "text-gray-500",  iconBg: "bg-[#1C3A52]", iconColor: "text-[#C4903E]", check: "text-[#1C3A52]" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Partenaires = () => {
  const { content, loading } = usePageContent<PartenairesContent>("partenaires");

  if (loading || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]" aria-label="Chargement…">
          <div className="w-8 h-8 border-2 border-[#C4903E] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const { hero, expertise, publics, problematiques, modalites, methodologie, formats, valeur, exemples, cta } = content;

  return (
    <Layout>
      <SEO
        title="Partenaires & Institutions — Coaching & Neurofeedback Mâcon (71) | ON Coaching"
        description="Coach certifié partenaire des associations et organismes en Saône-et-Loire (71). Neurofeedback, compétences psychosociales, insertion. 26 ans d'expérience."
        canonical="/partenaires"
        keywords="coaching associations mâcon, neurofeedback institutions saône-et-loire, coach insertion professionnelle 71, compétences psychosociales bourgogne, coaching établissements scolaires mâcon"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://www.oncoaching.fr/partenaires#webpage",
            name: "Partenaires & Institutions | ON Coaching Mâcon",
            url: "https://www.oncoaching.fr/partenaires",
            isPartOf: { "@id": "https://www.oncoaching.fr/#website" },
            about: { "@id": "https://www.oncoaching.fr/#business" },
            description: "ON Coaching — partenaire de confiance des associations, fondations et organismes d'insertion en Saône-et-Loire (71, Mâcon).",
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://www.oncoaching.fr/partenaires#service",
            name: "Accompagnement institutionnel — Coaching & Neurofeedback Mâcon",
            url: "https://www.oncoaching.fr/partenaires",
            description: "Coaching et neurofeedback certifiés pour associations, fondations et organismes d'insertion en Saône-et-Loire. Développement des compétences psychosociales et accompagnement des publics en difficulté.",
            provider: { "@id": "https://www.oncoaching.fr/#business" },
            areaServed: [
              { "@type": "City", name: "Mâcon" },
              { "@type": "AdministrativeArea", name: "Saône-et-Loire" },
              { "@type": "AdministrativeArea", name: "Bourgogne-Franche-Comté" },
            ],
            audience: {
              "@type": "Audience",
              audienceType: "Associations, fondations, organismes d'insertion, établissements éducatifs, collectivités en Saône-et-Loire",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
              { "@type": "ListItem", position: 2, name: "Partenaires & Institutions", item: "https://www.oncoaching.fr/partenaires" },
            ],
          },
        ]}
      />

      <div className="w-full bg-[#FBFBFB] min-h-screen px-4 py-6 md:px-12 md:py-8 space-y-6 overflow-x-hidden">

        {/* ── HERO ────────────────────────────────── */}
        <motion.header
          initial="hidden" animate="visible" variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-16 sm:pt-20 md:pt-24"
          aria-labelledby="partenaires-h1"
        >
          <motion.div variants={fadeInUp} className="lg:col-span-8 space-y-4">
            <p className="text-[11px] font-mono tracking-widest uppercase text-gray-400" aria-hidden="true">
              ↳ Structures &amp; Organisations
            </p>
            <h1 id="partenaires-h1" className="text-[clamp(1.8rem,6vw,5rem)] font-semibold leading-[0.95] tracking-tight text-[#1C3A52]">
              {hero.title}
            </h1>
            <p className="text-[1rem] md:text-[1.1rem] text-gray-500 font-medium max-w-lg leading-relaxed">
              {hero.subtitle}
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="lg:col-span-4 flex flex-col justify-end gap-4">
            <p className="text-[14px] text-gray-500 leading-relaxed">{hero.intro}</p>
            <div className="flex flex-wrap gap-2">
              {["Associations", "Fondations", "Insertion", "Éducatif"].map(tag => (
                <span key={tag} className="text-[11px] bg-[#F3F4F6] text-[#1C3A52] rounded-full px-3 py-1 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.header>

        {/* ── IMAGE HERO ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[260px] sm:h-[360px] rounded-[32px] overflow-hidden border border-gray-100"
        >
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400&q=80&auto=format&fit=crop"
            alt="Accompagnement des publics en insertion — ON Coaching partenaires institutionnels"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
          <div className="absolute bottom-5 left-5 flex flex-wrap gap-3">
            <div className="bg-[#C4903E] text-white px-4 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase font-semibold">
              Structures d'accompagnement
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-[#C4903E] animate-pulse" aria-hidden="true" />
              <span className="text-white text-[11px] font-semibold">Disponible pour collaboration</span>
            </div>
          </div>
        </motion.div>

        {/* ── EXPERTISE ───────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={VP} transition={{ duration: 0.6 }}
          className="bg-[#1C3A52] rounded-[32px] p-5 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          aria-labelledby="expertise-title"
        >
          <div className="lg:col-span-5">
            <div className="w-12 h-12 rounded-xl bg-[#C4903E] flex items-center justify-center mb-5" aria-hidden="true">
              <Building2 className="w-6 h-6 text-[#1C3A52]" strokeWidth={1.8} />
            </div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-3" aria-hidden="true">
              Double expertise
            </p>
            <h2 id="expertise-title" className="text-[1.8rem] md:text-[2.2rem] font-semibold tracking-tight text-white leading-[1.05]">
              {expertise.title}
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-5">
            <p className="text-[14px] text-white/50 leading-relaxed">{expertise.subtitle}</p>
            {expertise.points.map((point, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
                <div className="w-7 h-7 rounded-full bg-[#C4903E]/20 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                  <span className="text-[#C4903E] text-[11px] font-mono font-bold">{i + 1}</span>
                </div>
                <p className="text-[14px] text-white/70 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── PUBLICS + PROBLÉMATIQUES ─────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          aria-label="Publics et problématiques"
        >
          {/* Publics */}
          <motion.div variants={fadeInUp} className="bg-[#F3F4F6] rounded-[28px] p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1C3A52] flex items-center justify-center" aria-hidden="true">
                <Users className="w-5 h-5 text-[#C4903E]" strokeWidth={1.8} />
              </div>
              <h2 className="font-bold text-[#1C3A52] text-[1.1rem] tracking-tight">{publics.title}</h2>
            </div>
            <ul className="space-y-3">
              {publics.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-gray-600">
                  <Check className="w-4 h-4 text-[#1C3A52] flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Problématiques */}
          <motion.div variants={fadeInUp} className="bg-[#1C3A52] rounded-[28px] p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C4903E] flex items-center justify-center" aria-hidden="true">
                <Target className="w-5 h-5 text-[#1C3A52]" strokeWidth={1.8} />
              </div>
              <h2 className="font-bold text-white text-[1.1rem] tracking-tight">{problematiques.title}</h2>
            </div>
            <ul className="space-y-3">
              {problematiques.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-white/60">
                  <Check className="w-4 h-4 text-[#C4903E]/70 flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* ── MODALITÉS D'INTERVENTION ─────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
          aria-labelledby="modalites-title"
        >
          <div className="mb-6">
            <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-2" aria-hidden="true">Intervention</p>
            <h2 id="modalites-title" className="text-[2rem] md:text-[2.6rem] font-semibold tracking-tight text-[#1C3A52] leading-tight">
              {modalites.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modalites.items.map((mod, i) => {
              const Icon = MODALITE_ICONS[mod.key] ?? Layers;
              const c    = MODALITE_CONFIGS[i];
              return (
                <motion.article
                  key={mod.key}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[28px] p-5 sm:p-7 flex flex-col"
                  style={{ background: c.bg }}
                >
                  <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center mb-5`} aria-hidden="true">
                    <Icon className={`w-5 h-5 ${c.iconColor}`} strokeWidth={1.8} />
                  </div>
                  <h3 className={`font-bold text-[1rem] tracking-tight mb-4 ${c.text}`}>{mod.title}</h3>
                  <ul className="space-y-2.5 flex-1">
                    {mod.items.map((item, j) => (
                      <li key={j} className={`flex items-start gap-2.5 text-[14px] ${c.sub}`}>
                        <Check className={`w-3.5 h-3.5 ${c.check} flex-shrink-0 mt-0.5`} strokeWidth={2.5} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* ── MÉTHODOLOGIE ─────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={VP} transition={{ duration: 0.6 }}
          className="bg-[#1C3A52] rounded-[32px] p-5 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10"
          aria-labelledby="methodo-title"
        >
          {/* Étapes */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C4903E] flex items-center justify-center" aria-hidden="true">
                <Workflow className="w-5 h-5 text-[#1C3A52]" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-white/30" aria-hidden="true">Process</p>
                <h2 id="methodo-title" className="font-bold text-white text-[1.1rem] tracking-tight">{methodologie.title}</h2>
              </div>
            </div>
            <p className="text-white/40 text-[13px] mb-5">{methodologie.subtitle}</p>
            <ol className="space-y-3">
              {methodologie.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="w-7 h-7 rounded-full bg-[#C4903E]/20 text-[#C4903E] text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className="text-white/60 text-[14px] leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Approche */}
          <div className="lg:border-l border-white/8 lg:pl-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center" aria-hidden="true">
                <Heart className="w-5 h-5 text-[#C4903E]" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-white/30" aria-hidden="true">Posture</p>
                <h3 className="font-bold text-white text-[1.1rem] tracking-tight">Mon approche</h3>
              </div>
            </div>
            <p className="text-white/40 text-[13px] mb-5">{methodologie.approche.title}</p>
            <ul className="space-y-3">
              {methodologie.approche.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/60 text-[14px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4903E] flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* ── FORMATS + VALEUR AJOUTÉE ─────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          aria-label="Formats de collaboration et valeur ajoutée"
        >
          {/* Formats */}
          <motion.div variants={fadeInUp} className="bg-[#C4903E] rounded-[28px] p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1C3A52] flex items-center justify-center" aria-hidden="true">
                <Layers className="w-5 h-5 text-[#C4903E]" strokeWidth={1.8} />
              </div>
              <h2 className="font-bold text-[#1C3A52] text-[1.1rem] tracking-tight">{formats.title}</h2>
            </div>
            <ul className="space-y-3">
              {formats.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-black/70">
                  <Check className="w-4 h-4 text-[#1C3A52] flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Valeur ajoutée */}
          <motion.div variants={fadeInUp} className="bg-[#F3F4F6] rounded-[28px] p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1C3A52] flex items-center justify-center" aria-hidden="true">
                <Lightbulb className="w-5 h-5 text-[#C4903E]" strokeWidth={1.8} />
              </div>
              <h2 className="font-bold text-[#1C3A52] text-[1.1rem] tracking-tight">{valeur.title}</h2>
            </div>
            <ul className="space-y-3">
              {valeur.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-[#1C3A52] flex-shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* ── EXEMPLES D'ACCOMPAGNEMENT ────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={VP} transition={{ duration: 0.6 }}
          className="bg-[#F3F4F6] rounded-[32px] p-5 sm:p-8 md:p-10"
          aria-labelledby="exemples-title"
        >
          <div className="mb-8">
            <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-2" aria-hidden="true">Cas concrets</p>
            <h2 id="exemples-title" className="text-[2rem] md:text-[2.4rem] font-semibold tracking-tight text-[#1C3A52] leading-tight">
              {exemples.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exemples.items.map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-5">
                <div
                  className="w-8 h-8 rounded-full bg-[#C4903E] flex items-center justify-center flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <span className="text-[#1C3A52] text-[11px] font-mono font-bold">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── CTA ─────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={VP} transition={{ duration: 0.6 }}
          className="text-center py-10 sm:py-14 md:py-20 space-y-6"
        >
          <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight">
            {cta.title}
          </h2>
          <p className="text-gray-500 text-[14px] max-w-lg mx-auto leading-relaxed">{cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={cta.buttonLink}
              className="w-full sm:w-auto bg-[#1C3A52] text-white font-bold text-[14px] px-7 py-3.5 rounded-full flex items-center justify-center gap-2 hover:opacity-80 transition-opacity min-h-[44px]"
            >
              {cta.buttonText} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a
              href="https://www.oncoaching.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#F3F4F6] text-[#1C3A52] font-bold text-[14px] px-7 py-3.5 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center min-h-[44px]"
            >
              oncoaching.fr
            </a>
          </div>
        </motion.section>

      </div>
    </Layout>
  );
};

export default Partenaires;
