import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Heart, LightbulbIcon, ArrowUpRight, MapPin, CheckCircle2, Sparkles, GraduationCap, Rocket, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import { useTilt } from "@/hooks/useTilt";
import { usePageContent } from "@/hooks/usePageContent";
import {
  blurInUp,
  springUp,
  springLeft,
  springRight,
  stagger,
  staggerSlow,
  fadeInScale,
  iconWobble,
  btnHoverProps,
  floatAnim,
  pulseDot,
  VP,
  VP2,
} from "@/lib/motion";
import type { AboutContent } from "@/types";

const COACH_IMG =
  `${import.meta.env.BASE_URL}patron.png`;

const VALUES_ICONS: Record<string, React.ElementType> = {
  empathie: Heart,
  excellence: Award,
  innovation: LightbulbIcon,
};

const CARD_CONFIGS = [
  { bg: "#0B0B0C", text: "text-white",     sub: "text-white/60",  iconBg: "bg-[#1ab5c7]", iconColor: "text-[#0B0B0C]", border: "border-white/10" },
  { bg: "#1ab5c7", text: "text-[#0B0B0C]", sub: "text-black/70",  iconBg: "bg-[#0B0B0C]", iconColor: "text-[#1ab5c7]", border: "border-transparent" },
  { bg: "#F3F4F6", text: "text-[#0B0B0C]", sub: "text-gray-600",  iconBg: "bg-[#0B0B0C]", iconColor: "text-[#1ab5c7]", border: "border-gray-200" },
];

const TIMELINE_STEPS = [
  {
    num: "01",
    icon: GraduationCap,
    title: "Enseignant SES",
    period: "26 ans",
    text: "26 années consacrées à l'enseignement des sciences économiques et sociales, forgeant une écoute fine et une compréhension profonde des dynamiques humaines.",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "Formation coaching",
    period: "Prisme Évolution",
    text: "Certification ICF obtenue auprès de Prisme Évolution, une des formations les plus exigeantes du secteur, ancrée dans les neurosciences et l'approche systémique.",
  },
  {
    num: "03",
    icon: MapPin,
    title: "Lancement ON Coaching",
    period: "Mâcon",
    text: "Création d'ON Coaching à Sancé (Mâcon) — un espace dédié à l'accompagnement individuel, scolaire, professionnel et au neurofeedback.",
  },
  {
    num: "04",
    icon: Users,
    title: "100+ accompagnements",
    period: "Résultats mesurables",
    text: "Plus de 100 personnes accompagnées : jeunes, adultes, équipes. Chaque trajectoire réinventée, chaque potentiel libéré renforce la mission d'ON Coaching.",
  },
];

const STATS = [
  { value: "26", label: "ans d'exp.", suffix: "" },
  { value: "100", label: "accompagnements", suffix: "+" },
  { value: "ICF", label: "Certification", suffix: "" },
  { value: "Mâcon", label: "& à distance", suffix: "" },
];


function WordByWord({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden:  { opacity: 0, y: 30, filter: "blur(8px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", damping: 20, stiffness: 200 } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

function WordByWordInView({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");
  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden:  { opacity: 0, y: 24, filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", damping: 22, stiffness: 200 } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

function TiltValueCard({ val, i }: { val: { key: string; title: string; description: string }; i: number }) {
  const tilt = useTilt(10);
  const Icon = VALUES_ICONS[val.key] ?? Heart;
  const c = CARD_CONFIGS[i];
  return (
    <motion.article
      variants={springUp}
      className={`rounded-[28px] p-8 flex flex-col border ${c.border} cursor-default`}
      style={{ background: c.bg, willChange: "transform" }}
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onMouseEnter={tilt.onMouseEnter}
      aria-label={`Valeur : ${val.title}`}
    >
      <motion.div
        className={`w-12 h-12 rounded-2xl ${c.iconBg} flex items-center justify-center mb-7`}
        {...iconWobble}
        aria-hidden="true"
      >
        <Icon className={`w-6 h-6 ${c.iconColor}`} strokeWidth={1.8} />
      </motion.div>
      <h3 className={`font-bold text-[1.15rem] tracking-tight mb-3 ${c.text}`}>{val.title}</h3>
      <p className={`text-[15px] leading-relaxed flex-1 ${c.sub}`}>{val.description}</p>
    </motion.article>
  );
}

const About = () => {
  const { content, loading } = usePageContent<AboutContent>("about");

  if (loading || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white" aria-label="Chargement…">
          <motion.div
            className="w-10 h-10 border-2 border-[#1ab5c7] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </Layout>
    );
  }

  const { hero, whoSection, valuesSection, cta } = content;

  return (
    <Layout>
      <SEO
        title="À Propos — Coach ICF Certifié à Mâcon | ON Coaching"
        description="Noureddine Omar, coach certifié ICF par Prisme Évolution. Ancien enseignant SES, 26 ans d'expérience humaine. Coaching à Sancé (Mâcon) et à distance."
        canonical="/about"
        keywords="coach certifié ICF mâcon, Noureddine Omar, prisme évolution, coach scolaire, coaching professionnel mâcon, coach de vie bourgogne"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": "https://www.oncoaching.fr/about#webpage",
            name: "À Propos — ON Coaching",
            url: "https://www.oncoaching.fr/about",
            isPartOf: { "@id": "https://www.oncoaching.fr/#website" },
          },
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://www.oncoaching.fr/#coach",
            name: "Noureddine Omar",
            jobTitle: "Coach certifié ICF",
            description: "Coach certifié ICF, formé par Prisme Évolution. Ancien enseignant SES avec 26 ans d'expérience dans l'accompagnement humain.",
            url: "https://www.oncoaching.fr/about",
            image: "https://www.oncoaching.fr/patron.png",
            sameAs: [
              "https://www.facebook.com/profile.php?id=100050783821185",
              "https://www.instagram.com/oncoaching_",
            ],
            worksFor: { "@id": "https://www.oncoaching.fr/#business" },
            knowsAbout: ["ICF Coaching", "Neurofeedback", "Coaching scolaire", "Coaching jeunes adultes", "Coaching d'équipe", "Sciences économiques et sociales"],
            hasCredential: {
              "@type": "EducationalOccupationalCredential",
              name: "Certification ICF — Coach Professionnel",
              credentialCategory: "certification",
              recognizedBy: { "@type": "Organization", name: "International Coaching Federation (ICF)" },
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: "14 rue des écureuils",
              addressLocality: "Sancé",
              postalCode: "71000",
              addressCountry: "FR",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
              { "@type": "ListItem", position: 2, name: "À Propos", item: "https://www.oncoaching.fr/about" },
            ],
          },
        ]}
      />

      <div className="w-full bg-white overflow-x-hidden">

        {/* ══ 01 — HERO ══════════════════════════════════════════════════ */}
        <section
          className="max-w-7xl mx-auto px-5 md:px-12 py-20 md:py-28"
          aria-labelledby="about-h1"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              className="space-y-7"
            >
              <motion.p
                variants={blurInUp}
                className="text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]"
                aria-hidden="true"
              >
                ↳ À propos
              </motion.p>

              <h1
                id="about-h1"
                className="text-[clamp(2rem,5vw,5rem)] font-bold leading-[0.95] tracking-tight text-[#0B0B0C]"
              >
                <WordByWord text={hero.title} />
              </h1>

              <motion.p
                variants={blurInUp}
                className="text-[16px] text-gray-500 leading-relaxed max-w-md"
              >
                {hero.paragraph1}
              </motion.p>

              <motion.div variants={blurInUp} className="flex flex-wrap gap-3">
                <motion.div
                  className="flex items-center gap-2 bg-[#0B0B0C] rounded-full px-5 py-2.5"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#1ab5c7]"
                    {...pulseDot}
                    aria-hidden="true"
                  />
                  <span className="text-[12px] font-bold text-white tracking-wide">ICF Certifié</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-5 py-2.5"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <span className="text-[12px] font-bold text-[#0B0B0C]">26 ans d'expérience</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-5 py-2.5"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <MapPin className="w-3 h-3 text-[#1ab5c7]" aria-hidden="true" />
                  <span className="text-[12px] font-bold text-[#0B0B0C]">Mâcon & à distance</span>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInScale}
              className="relative"
            >
              <div className="relative rounded-[36px] overflow-hidden aspect-[4/5] md:max-h-[560px] shadow-2xl">
                <img
                  src={COACH_IMG}
                  alt="Coach ON Coaching — coach certifié ICF à Mâcon"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden="true" />

                <motion.div
                  className="absolute bottom-5 left-5 bg-[#1ab5c7] rounded-2xl px-5 py-3.5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, type: "spring", damping: 20, stiffness: 200 }}
                >
                  <p className="text-[10px] font-mono tracking-widest uppercase text-black/50 mb-0.5" aria-hidden="true">Certifié ICF</p>
                  <p className="text-[13px] font-bold text-[#0B0B0C] leading-tight">Prisme Évolution</p>
                </motion.div>

                <motion.div
                  className="absolute top-5 right-5 flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, type: "spring", damping: 20, stiffness: 200 }}
                >
                  <motion.div className="w-2 h-2 rounded-full bg-[#1ab5c7]" {...pulseDot} aria-hidden="true" />
                  <span className="text-white text-[11px] font-semibold">Disponible</span>
                </motion.div>
              </div>

              <motion.div
                className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-[#1ab5c7] flex items-center justify-center shadow-lg shadow-[#1ab5c7]/30"
                {...floatAnim}
                aria-hidden="true"
              >
                <CheckCircle2 className="w-7 h-7 text-[#0B0B0C]" strokeWidth={2} />
              </motion.div>

              <motion.div
                className="absolute -top-5 -left-5 w-10 h-10 rounded-full border-2 border-[#1ab5c7]/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
              />
            </motion.div>
          </div>
      </section>

        {/* ══ 02 — STATS ROW ══════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-5 md:px-12 pb-20 md:pb-24" aria-label="Chiffres clés">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="bg-[#F3F4F6] rounded-[32px] px-8 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-gray-200"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={springUp}
                className="flex flex-col items-center text-center px-4"
              >
                <span className="font-mono font-black text-[clamp(2rem,5vw,3.5rem)] text-[#0B0B0C] leading-none tracking-tight">
                  {stat.value}{stat.suffix}
                </span>
                <span className="text-[13px] text-gray-500 mt-2 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══ 03 — QUI SUIS-JE (dark + SpotlightCard) ═══════════════════ */}
        <section className="max-w-7xl mx-auto px-5 md:px-12 pb-20 md:pb-28" aria-labelledby="about-who">
          <SpotlightCard
            className="bg-[#0B0B0C] rounded-[40px] p-8 md:p-14 overflow-hidden"
            spotlightColor="rgba(26,181,199,0.10)"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative">

              <motion.div
                className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#1ab5c7]/5 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />

              <div className="lg:col-span-5 relative z-10">
                <motion.p
                  initial="hidden" whileInView="visible" viewport={VP}
                  variants={blurInUp}
                  className="text-[10px] font-mono tracking-widest uppercase text-[#1ab5c7]/70 mb-5"
                  aria-hidden="true"
                >
                  ON COACHING ☉ {whoSection.title}
                </motion.p>
                <h2
                  id="about-who"
                  className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-tight text-white leading-[1.1] mb-6"
                >
                  <WordByWordInView text={whoSection.subtitle} />
                </h2>
                <motion.div
                  initial="hidden" whileInView="visible" viewport={VP2}
                  variants={springRight}
                  className="relative rounded-[24px] overflow-hidden aspect-square max-w-[260px] hidden lg:block mt-4"
                >
                  <img
                    src={COACH_IMG}
                    alt="Portrait du coach ON Coaching"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-[24px] border-2 border-[#1ab5c7]/40"
                    animate={{ rotate: [0, 2, 0, -2, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    aria-hidden="true"
                  />
                </motion.div>
              </div>

              <div className="lg:col-span-7 space-y-6 relative z-10">
                <motion.p
                  initial="hidden" whileInView="visible" viewport={VP}
                  variants={blurInUp}
                  className="text-[16px] text-white/60 leading-relaxed"
                >
                  {whoSection.paragraph1}
                </motion.p>
                <motion.p
                  initial="hidden" whileInView="visible" viewport={VP2}
                  variants={blurInUp}
                  className="text-[16px] text-white/60 leading-relaxed"
                >
                  {whoSection.paragraph2}
                </motion.p>
                <motion.div
                  initial="hidden" whileInView="visible" viewport={VP2}
                  variants={blurInUp}
                  className="border-t border-white/10 pt-7 mt-3 space-y-4"
                >
                  <h3 className="text-[16px] font-bold text-[#1ab5c7]">{whoSection.differenceTitle}</h3>
                  <p className="text-[15px] text-white/55 leading-relaxed">{whoSection.paragraph3}</p>
                  <p className="text-[15px] text-white/55 leading-relaxed">{whoSection.paragraph4}</p>
                </motion.div>
              </div>
            </div>
          </SpotlightCard>
        </section>

        {/* ══ 04 — PARCOURS / TIMELINE ════════════════════════════════════ */}
        <section
          className="max-w-7xl mx-auto px-5 md:px-12 pb-20 md:pb-28"
          aria-labelledby="about-timeline"
        >
          <motion.div
            initial="hidden" whileInView="visible" viewport={VP}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="mb-12"
          >
            <motion.p
              variants={blurInUp}
              className="text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7] mb-3"
              aria-hidden="true"
            >
              ↳ Mon parcours
            </motion.p>
            <h2
              id="about-timeline"
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-tight text-[#0B0B0C] leading-tight"
            >
              <WordByWordInView text="Une trajectoire construite sur l'humain" />
            </h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={VP2}
            variants={staggerSlow}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {TIMELINE_STEPS.map((step) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  variants={springLeft}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 350, damping: 22 } }}
                  className="group relative rounded-[28px] border border-gray-100 bg-white p-8 overflow-hidden cursor-default"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#1ab5c7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="flex items-start gap-5">
                    <span
                      className="font-mono font-black text-[clamp(2.8rem,5vw,3.5rem)] leading-none tracking-tighter text-gray-100 select-none flex-shrink-0"
                      aria-hidden="true"
                    >
                      {step.num}
                    </span>
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-xl bg-[#0B0B0C] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                          <StepIcon className="w-4 h-4 text-[#1ab5c7]" strokeWidth={1.8} />
                        </div>
                        <span className="text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]">{step.period}</span>
                      </div>
                      <h3 className="text-[1.1rem] font-bold text-[#0B0B0C] tracking-tight">{step.title}</h3>
                      <p className="text-[15px] text-gray-500 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ══ 05 — VALEURS (useTilt cards) ════════════════════════════════ */}
        <section
          className="max-w-7xl mx-auto px-5 md:px-12 pb-20 md:pb-28"
          aria-labelledby="about-values"
        >
          <motion.div
            initial="hidden" whileInView="visible" viewport={VP}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4"
          >
            <div>
              <motion.p
                variants={blurInUp}
                className="text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7] mb-3"
                aria-hidden="true"
              >
                ↳ {valuesSection.title}
              </motion.p>
              <h2
                id="about-values"
                className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-tight text-[#0B0B0C] leading-tight"
              >
                <WordByWordInView text="Ce qui nous distingue" />
              </h2>
            </div>
            <motion.p
              variants={blurInUp}
              className="text-[15px] text-gray-500 max-w-xs leading-relaxed"
            >
              Des valeurs qui guident chaque accompagnement, sans compromis.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={VP2}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {valuesSection.values.map((val, i) => (
              <TiltValueCard key={val.key} val={val} i={i} />
            ))}
          </motion.div>
        </section>

        {/* ══ 06 — CTA (dark full-width) ══════════════════════════════════ */}
        <section
          className="max-w-7xl mx-auto px-5 md:px-12 pb-20 md:pb-28"
          aria-labelledby="about-cta"
        >
          <SpotlightCard
            className="relative bg-[#0B0B0C] rounded-[40px] px-8 md:px-16 py-16 md:py-20 overflow-hidden"
            spotlightColor="rgba(26,181,199,0.12)"
          >
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full bg-[#1ab5c7]/8 blur-3xl pointer-events-none"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />

            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-[#1ab5c7]/20"
              {...floatAnim}
              aria-hidden="true"
            />
            <motion.div
              className="absolute bottom-10 left-10 w-6 h-6 rounded-full bg-[#1ab5c7]/30"
              animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center text-center gap-7">
              <motion.p
                initial="hidden" whileInView="visible" viewport={VP}
                variants={blurInUp}
                className="text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]/70"
                aria-hidden="true"
              >
                ↳ Première séance gratuite
              </motion.p>

              <h2
                id="about-cta"
                className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight text-white leading-[1.05]"
              >
                <WordByWordInView text={cta.title} />
              </h2>

              <motion.p
                initial="hidden" whileInView="visible" viewport={VP2}
                variants={blurInUp}
                className="text-[16px] text-white/50 max-w-lg leading-relaxed"
              >
                {cta.subtitle}
              </motion.p>

              <motion.div
                initial="hidden" whileInView="visible" viewport={VP2}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <motion.div variants={springUp}>
                  <motion.div {...btnHoverProps}>
                    <Link
                      to={cta.buttonLink}
                      className="bg-[#1ab5c7] text-[#0B0B0C] font-bold text-[14px] px-8 py-4 rounded-full flex items-center gap-2.5 shadow-lg shadow-[#1ab5c7]/30"
                    >
                      {cta.buttonText}
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </motion.div>
                </motion.div>
                <motion.div variants={springUp}>
                  <motion.div {...btnHoverProps}>
                    <Link
                      to="/NosTarifs"
                      className="bg-white/10 border border-white/20 text-white font-bold text-[14px] px-8 py-4 rounded-full flex items-center gap-2.5 hover:bg-white/15 transition-colors"
                    >
                      Voir nos tarifs
                      <Rocket className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </SpotlightCard>
        </section>

      </div>
    </Layout>
  );
};

export default About;
