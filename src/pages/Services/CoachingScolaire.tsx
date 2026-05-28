import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import {
  GraduationCap, Users, Brain, Lightbulb,
  BookOpen, TrendingUp, CalendarCheck, Star, Zap, Compass,
  Check, ArrowUpRight,
} from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { useTilt } from "@/hooks/useTilt";
import {
  blurInUp, staggerContainer, springUp,
  btnHoverProps, VP,
} from "@/lib/motion";
import type { ServicePageContent } from "@/types";
import { E } from "@/components/cms/E";

const HERO_IMG =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=85";

const COACH_PHOTO = `${import.meta.env.BASE_URL}patron.webp`;

const H1_WORDS = ["Coaching", "Scolaire"];

const FOR_WHO = [
  { icon: BookOpen,     text: "Tu te perds dans tes révisions et n'arrives pas à t'organiser" },
  { icon: TrendingUp,   text: "Tes résultats stagnent malgré tous tes efforts" },
  { icon: Brain,        text: "Le stress des examens te paralyse" },
  { icon: Star,         text: "Tu manques de motivation et décroches peu à peu" },
  { icon: Compass,      text: "Tu ne sais pas quelle orientation choisir" },
  { icon: Zap,          text: "Tu veux gagner en autonomie et en confiance" },
];

const BENEFITS = [
  {
    icon: Star,
    title: "Motivation retrouvée",
    desc: "Redécouvre le plaisir d'apprendre et avance avec élan vers tes objectifs.",
  },
  {
    icon: BookOpen,
    title: "Méthodes de travail",
    desc: "Des techniques concrètes pour organiser tes révisions et retenir efficacement.",
  },
  {
    icon: Brain,
    title: "Gestion du stress d'examen",
    desc: "Outils pratiques pour aborder les épreuves avec sérénité et lucidité.",
  },
  {
    icon: Compass,
    title: "Clarté sur l'orientation",
    desc: "Identifie tes forces et dessine un projet scolaire qui te ressemble.",
  },
  {
    icon: TrendingUp,
    title: "Confiance en soi",
    desc: "Lève les blocages et crois enfin en ta capacité à réussir.",
  },
  {
    icon: CalendarCheck,
    title: "Autonomie durable",
    desc: "Tu deviens acteur de ta réussite, sans dépendre d'un soutien permanent.",
  },
];

const CoachingScolaire = () => {
  const { content, loading } = usePageContent<ServicePageContent>("coaching-scolaire");

  const t0 = useTilt(10);
  const t1 = useTilt(10);
  const t2 = useTilt(10);
  const t3 = useTilt(10);
  const t4 = useTilt(10);
  const t5 = useTilt(10);

  const tilts = [t0, t1, t2, t3, t4, t5];

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
        title="Coaching Scolaire à Mâcon (71) — Collégiens, Lycéens, Étudiants | ON Coaching"
        description="Coach scolaire certifié à Mâcon, Sancé (71). Ex-enseignant SES 26 ans. Méthodes de travail, motivation, gestion du stress d'examen. 1er RDV offert."
        canonical="/coaching-scolaire"
        keywords="coaching scolaire mâcon, coach scolaire mâcon 71, soutien scolaire sancé, coach lycéen mâcon, coach étudiant bourgogne, méthode de travail, motivation scolaire, gestion stress examen, orientation scolaire mâcon"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "@id": "https://www.oncoaching.fr/coaching-scolaire#service",
            name: "Coaching Scolaire Mâcon — ON Coaching",
            description: "Coaching scolaire certifié pour collégiens, lycéens et étudiants à Mâcon (Sancé, 71). Ex-enseignant SES 26 ans. Méthodes de travail, motivation, gestion du stress.",
            url: "https://www.oncoaching.fr/coaching-scolaire",
            provider: { "@id": "https://www.oncoaching.fr/#business" },
            areaServed: [
              { "@type": "City", name: "Mâcon" },
              { "@type": "City", name: "Sancé" },
              { "@type": "City", name: "Tournus" },
              { "@type": "City", name: "Chalon-sur-Saône" },
              { "@type": "AdministrativeArea", name: "Saône-et-Loire" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Comment fonctionne le coaching scolaire à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Le coaching scolaire à Mâcon (ON Coaching, Sancé 71) aide collégiens, lycéens et étudiants à améliorer leurs méthodes de travail, gérer leur stress d'examen et retrouver la motivation. Séances en présentiel à Sancé ou en visioconférence. 1er RDV offert." }
              },
              {
                "@type": "Question",
                name: "Quel est le prix du coaching scolaire à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Le coaching scolaire à Mâcon coûte 60€ par séance chez ON Coaching (Sancé, 71). Des forfaits sont disponibles pour réduire le coût. Le 1er rendez-vous est offert sans engagement pour évaluer les besoins de votre enfant." }
              },
              {
                "@type": "Question",
                name: "Le coaching scolaire est-il différent du soutien scolaire à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Oui. Le soutien scolaire répète les leçons ; le coaching scolaire à Mâcon travaille sur la méthode, la confiance en soi et la gestion des émotions. Coach certifié et ex-enseignant SES 26 ans, Noureddine Omar comprend parfaitement les exigences du système scolaire en Saône-et-Loire." }
              },
              {
                "@type": "Question",
                name: "À partir de quel âge peut-on faire du coaching scolaire à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "ON Coaching à Mâcon accompagne les élèves dès la 6e (collège), au lycée et en études supérieures. Le coaching scolaire est adapté à chaque profil et à chaque niveau scolaire à Mâcon et Sancé (71)." }
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://www.oncoaching.fr/#services" },
              { "@type": "ListItem", position: 3, name: "Coaching Scolaire Mâcon", item: "https://www.oncoaching.fr/coaching-scolaire" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://www.oncoaching.fr/#business",
            name: "ON Coaching",
            telephone: "+33663041812",
            url: "https://www.oncoaching.fr",
            address: { "@type": "PostalAddress", streetAddress: "14 rue des écureuils", addressLocality: "Sancé", postalCode: "71000", addressRegion: "Saône-et-Loire", addressCountry: "FR" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: "12", bestRating: "5" },
          },
        ]}
      />

      {/* ── 01. HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#FBFBFB] pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col gap-5 sm:gap-6"
            >
              <motion.p
                variants={blurInUp}
                className="font-mono tracking-widest uppercase text-[11px] text-[#C4903E] font-semibold"
                aria-hidden="true"
              >
                ↳ Coaching Scolaire
              </motion.p>

              <h1
                className="text-[clamp(2rem,6vw,5rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight"
              >
                {H1_WORDS.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 18, delay: i * 0.12 }}
                    className="inline-block mr-[0.22em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                variants={blurInUp}
                className="text-gray-500 text-[16px] leading-relaxed max-w-lg"
              >
                <E fieldKey="page.subtitle">{page.subtitle ?? "Ton enfant décroche, manque de méthode ou perd confiance ? Un accompagnement personnalisé pour retrouver motivation, organisation et sérénité."}</E>
              </motion.p>

              <motion.div variants={blurInUp} className="flex flex-wrap gap-3">
                <motion.span className="inline-block w-full sm:w-auto" {...btnHoverProps}>
                  <Link
                    to="/contact"
                    className="flex justify-center sm:inline-flex items-center gap-2 bg-[#C4903E] text-white font-bold text-[14px] px-6 py-3 min-h-[44px] rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto"
                  >
                    1er RDV offert <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </motion.span>
                <motion.span className="inline-block w-full sm:w-auto" {...btnHoverProps}>
                  <Link
                    to="/coaching-scolaire#tarif"
                    className="flex justify-center sm:inline-flex items-center gap-2 bg-[#F3F4F6] text-[#1C3A52] font-semibold text-[14px] px-6 py-3 min-h-[44px] rounded-full hover:bg-gray-200 transition-colors w-full sm:w-auto"
                  >
                    Voir les tarifs
                  </Link>
                </motion.span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="relative"
            >
              <div className="relative h-[220px] sm:h-[300px] md:h-[380px] rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <img
                  src={HERO_IMG}
                  alt="Coaching scolaire à Mâcon — ON Coaching"
                  className="w-full h-full object-cover"
                  width="1200"
                  height="800"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C3A52]/40 via-transparent to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm text-[#1C3A52] px-4 py-2 rounded-full text-[12px] font-semibold shadow-md"
              >
                Collégiens · Lycéens · Étudiants
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 02. POUR QUI ─────────────────────────────────────────── */}
      <section className="bg-[#F3F4F6] py-12 md:py-20" aria-label="Pour qui est ce coaching">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="flex flex-col gap-10"
          >
            <motion.div variants={blurInUp} className="flex flex-col gap-2">
              <p className="font-mono tracking-widest uppercase text-[11px] text-gray-400" aria-hidden="true">
                Pour toi si…
              </p>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight">
                Ce coaching est fait pour toi si…
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FOR_WHO.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    variants={springUp}
                    className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#C4903E]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Icon className="w-4.5 h-4.5 text-[#C4903E]" strokeWidth={1.8} />
                    </div>
                    <p className="text-[#1C3A52] text-[15px] font-semibold leading-snug">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 03. CE QUE TU VAS GAGNER ─────────────────────────────── */}
      <section className="bg-[#1C3A52] py-12 md:py-20" aria-label="Bénéfices du coaching">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="flex flex-col gap-10"
          >
            <motion.div variants={blurInUp} className="flex flex-col gap-2">
              <p className="font-mono tracking-widest uppercase text-[11px] text-white/30" aria-hidden="true">
                Résultats
              </p>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tight text-white leading-tight">
                Ce que tu vas gagner
              </h2>
            </motion.div>

            <SpotlightCard
              className="rounded-[32px]"
              spotlightColor="rgba(196,144,62,0.08)"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BENEFITS.map((b, i) => {
                  const Icon = b.icon;
                  const tilt = tilts[i];
                  return (
                    <motion.article
                      key={i}
                      variants={springUp}
                      ref={tilt.ref}
                      onMouseMove={tilt.onMouseMove}
                      onMouseLeave={tilt.onMouseLeave}
                      onMouseEnter={tilt.onMouseEnter}
                      className="bg-white/5 border border-white/8 rounded-[24px] p-5 sm:p-6 flex flex-col gap-4 cursor-default"
                      style={{ willChange: "transform" }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl bg-[#C4903E] flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                      </div>
                      <h3 className="text-white font-semibold text-[15px] leading-snug">{b.title}</h3>
                      <p className="text-white/50 text-[14px] leading-relaxed flex-1">{b.desc}</p>
                    </motion.article>
                  );
                })}
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* ── 04. COACH BIO ────────────────────────────────────────── */}
      <section className="bg-[#FBFBFB] py-12 md:py-20" aria-label="Le coach">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start">

              <motion.div variants={springUp} className="relative">
                <div className="relative h-[300px] sm:h-[380px] md:h-[440px] rounded-[32px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.18)]">
                  <img
                    src={COACH_PHOTO}
                    alt="Noureddine Omar — Coach certifié, ON Coaching Mâcon"
                    className="w-full h-full object-cover object-top"
                    width="600"
                    height="800"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C3A52]/50 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-5 left-5 flex flex-col gap-1">
                  <span className="bg-[#C4903E] text-white text-[11px] font-bold px-3 py-1 rounded-full w-fit">
                    Coach certifié
                  </span>
                  <span className="bg-white/90 backdrop-blur-sm text-[#1C3A52] text-[11px] font-semibold px-3 py-1 rounded-full w-fit">
                    26 ans enseignant SES
                  </span>
                </div>
              </motion.div>

              <motion.div variants={blurInUp} className="flex flex-col gap-7 pt-2">
                <div className="flex flex-col gap-2">
                  <p className="font-mono tracking-widest uppercase text-[11px] text-gray-400" aria-hidden="true">
                    Notre coach
                  </p>
                  <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight">
                    26 ans auprès des jeunes
                  </h2>
                </div>

                <p className="text-gray-500 text-[16px] leading-relaxed">
                  Enseignant en SES pendant 26 ans, j'ai accompagné des centaines de jeunes dans leurs parcours scolaires. Formé comme coach certifié chez Prisme Évolution, j'associe pédagogie de terrain et outils de coaching pour agir en profondeur sur la motivation, la méthode et la confiance.
                </p>

                <ul className="flex flex-col gap-3">
                  {[
                    { icon: GraduationCap, label: "26 ans d'expérience enseignant SES" },
                    { icon: Users,         label: "Coach certifié — Prisme Évolution" },
                    { icon: Brain,         label: "Formé en neurofeedback" },
                    { icon: Lightbulb,     label: "Double expertise pédagogique & humaine" },
                  ].map(({ icon: Icon, label }, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VP}
                      transition={{ delay: 0.1 + i * 0.07, type: "spring", stiffness: 240, damping: 22 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#C4903E] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
                      </div>
                      <span className="text-[#1C3A52] text-[14px]">{label}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.span className="inline-block w-full sm:w-auto" {...btnHoverProps}>
                  <Link
                    to="/contact"
                    className="flex justify-center sm:inline-flex items-center gap-2 bg-[#C4903E] text-white font-bold text-[14px] px-6 py-3 min-h-[44px] rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto"
                  >
                    Prendre contact <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </motion.span>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 05. TARIF + CTA ──────────────────────────────────────── */}
      <section id="tarif" className="bg-[#C4903E] py-12 md:py-20" aria-label="Tarif et prise de rendez-vous">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              <motion.div variants={blurInUp} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="font-mono tracking-widest uppercase text-[11px] text-white/60" aria-hidden="true">
                    Tarif
                  </p>
                  <div className="flex items-baseline gap-2 text-center sm:text-left">
                    <span className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold text-white leading-none tracking-tight">
                      60€
                    </span>
                    <span className="text-white/70 text-[18px] font-medium">/ séance</span>
                  </div>
                  <p className="text-white/80 text-[16px] leading-relaxed">
                    Séance individuelle de 60 min — à mon cabinet, chez vous ou à distance.
                  </p>
                </div>

                <ul className="flex flex-col gap-3">
                  {[
                    "Méthodes de travail personnalisées",
                    "Gestion du stress et des examens",
                    "Soutien à l'orientation scolaire",
                    "Suivi régulier adapté à ton rythme",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-white flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                      <span className="text-white text-[14px] font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={blurInUp} className="flex flex-col gap-5">
                <div className="bg-white/15 backdrop-blur-sm rounded-[28px] p-5 sm:p-8 flex flex-col gap-5">
                  <p className="text-white font-semibold text-[18px] leading-snug">
                    Prêt à changer les choses ?
                  </p>
                  <p className="text-white/80 text-[15px] leading-relaxed">
                    Le premier rendez-vous est offert. On fait le point ensemble et on voit si le coaching est la bonne option.
                  </p>
                  <motion.span className="inline-block w-fit" {...btnHoverProps}>
                    <Link
                      to={cta.buttonLink}
                      className="flex sm:inline-flex justify-center w-full sm:w-auto items-center gap-2 bg-[#1C3A52] text-white font-bold text-[14px] px-7 py-3.5 min-h-[44px] rounded-full hover:opacity-90 transition-opacity"
                    >
                      Prendre RDV <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </motion.span>
                  <p className="text-white/50 text-[12px] font-mono">
                    1er RDV offert · Sans engagement · Confidentiel
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
};

export default CoachingScolaire;
