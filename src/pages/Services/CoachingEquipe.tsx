import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import { useTilt } from "@/hooks/useTilt";
import {
  Users, Target, Handshake, MessageSquare, Zap, TrendingUp,
  Shield, Lightbulb, GraduationCap, Brain, ArrowUpRight, Check,
  Building2, Briefcase, Network,
} from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import {
  fadeInUp, blurInUp, staggerContainer, staggerFast,
  springUp, springLeft, springRight, btnHoverProps,
  VP, VP2,
} from "@/lib/motion";
import type { ServicePageContent } from "@/types";

const HERO_IMG    = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85";
const COACH_PHOTO = `${import.meta.env.BASE_URL}patron.webp`;

const HERO_WORDS = ["Coaching", "d'équipe"];

const PROFILES = [
  {
    icon: Zap,
    title: "TPE & Startups",
    desc: "Renforcer la dynamique d'une jeune équipe, poser des fondations solides et embarquer tout le monde dans une même direction dès le départ.",
  },
  {
    icon: Briefcase,
    title: "PME",
    desc: "Améliorer la communication interne, fluidifier la collaboration entre services et aligner les équipes sur des objectifs communs.",
  },
  {
    icon: Network,
    title: "Grandes équipes",
    desc: "Maintenir la cohésion sur des projets complexes, dépasser les silos et créer une culture collective forte à travers les niveaux hiérarchiques.",
  },
];

const BENEFITS = [
  {
    icon: MessageSquare,
    title: "Communication améliorée",
    desc: "Développer une culture d'écoute active et d'expression constructive pour résoudre les malentendus et aligner les perspectives.",
  },
  {
    icon: Handshake,
    title: "Cohésion renforcée",
    desc: "Tisser des liens solides entre les membres pour créer un sentiment d'appartenance et de solidarité durable au sein du groupe.",
  },
  {
    icon: Target,
    title: "Objectifs alignés",
    desc: "Clarifier la mission et les priorités partagées pour que chaque membre comprenne comment sa contribution sert le collectif.",
  },
  {
    icon: Shield,
    title: "Conflits résolus",
    desc: "Transformer les tensions en opportunités de croissance grâce à des outils de médiation et de dialogue constructif.",
  },
  {
    icon: TrendingUp,
    title: "Leadership développé",
    desc: "Faire émerger les leaders naturels au sein de l'équipe et distribuer la responsabilité pour libérer l'initiative collective.",
  },
  {
    icon: Users,
    title: "Performance collective",
    desc: "Identifier et activer les leviers communs pour dépasser les blocages et libérer le plein potentiel du groupe en action.",
  },
];

const CoachingEquipe = () => {
  const { content, loading } = usePageContent<ServicePageContent>("coaching-equipe");

  const t0 = useTilt(8);
  const t1 = useTilt(8);
  const t2 = useTilt(8);

  const b0 = useTilt(10);
  const b1 = useTilt(10);
  const b2 = useTilt(10);
  const b3 = useTilt(10);
  const b4 = useTilt(10);
  const b5 = useTilt(10);

  const profileTilts = [t0, t1, t2];
  const benefitTilts = [b0, b1, b2, b3, b4, b5];

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
        title="Coaching d'Équipe à Mâcon (71) — Cohésion, Performance & Intelligence Collective"
        description="Coaching d'équipe certifié à Mâcon, Saône-et-Loire (71). Cohésion, communication, leadership pour TPE/PME et associations. 26 ans d'expérience. Diagnostic offert."
        canonical="/coaching-equipe"
        keywords="coaching équipe mâcon, coaching entreprise mâcon 71, team building saône-et-loire, cohésion équipe bourgogne, coach PME mâcon, intelligence collective, management bienveillant, coaching d'équipe certifié"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://www.oncoaching.fr/coaching-equipe#service",
            name: "Coaching d'Équipe Mâcon — TPE PME Saône-et-Loire",
            description: "Coaching d'équipe certifié pour TPE, PME et associations à Mâcon (Sancé, 71). Cohésion, communication, performance collective. Diagnostic offert.",
            url: "https://www.oncoaching.fr/coaching-equipe",
            provider: { "@id": "https://www.oncoaching.fr/#business" },
            areaServed: [
              { "@type": "City", name: "Mâcon" },
              { "@type": "City", name: "Sancé" },
              { "@type": "City", name: "Chalon-sur-Saône" },
              { "@type": "City", name: "Bourg-en-Bresse" },
              { "@type": "AdministrativeArea", name: "Saône-et-Loire" },
              { "@type": "AdministrativeArea", name: "Bourgogne-Franche-Comté" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Qu'est-ce que le coaching d'équipe à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Le coaching d'équipe à Mâcon (ON Coaching, Sancé 71) accompagne les équipes professionnelles pour améliorer leur cohésion, communication et performance collective. Coach certifié, Noureddine Omar intervient auprès des TPE/PME et associations de Saône-et-Loire." }
              },
              {
                "@type": "Question",
                name: "Quel est le prix du coaching d'équipe à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Le coaching d'équipe à Mâcon est proposé sur devis selon la taille de l'équipe et les objectifs. ON Coaching offre un diagnostic initial gratuit pour les entreprises de Mâcon, Sancé et Saône-et-Loire (71)." }
              },
              {
                "@type": "Question",
                name: "Le coaching d'équipe à Mâcon est-il adapté aux petites entreprises ?",
                acceptedAnswer: { "@type": "Answer", text: "Oui, ON Coaching à Mâcon est spécialisé dans l'accompagnement des TPE et PME de Saône-et-Loire. Le coach certifié Noureddine Omar adapte chaque programme à la réalité des petites structures locales." }
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://www.oncoaching.fr/#services" },
              { "@type": "ListItem", position: 3, name: "Coaching Équipe Mâcon", item: "https://www.oncoaching.fr/coaching-equipe" },
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

      <div className="w-full bg-[#FBFBFB] min-h-screen overflow-x-hidden">

        <section className="pt-28 pb-16 max-w-7xl mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-7"
              aria-labelledby="equipe-h1"
            >
              <motion.p
                variants={fadeInUp}
                className="font-mono tracking-widest uppercase text-[10px] text-[#C4903E]"
                aria-hidden="true"
              >
                ↳ Coaching d'équipe
              </motion.p>

              <h1
                id="equipe-h1"
                className="text-[clamp(2.2rem,6vw,5rem)] font-semibold tracking-tight text-[#1C3A52] leading-[1.05] overflow-hidden"
              >
                {HERO_WORDS.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 160, delay: i * 0.12 }}
                    className="block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                variants={blurInUp}
                className="text-gray-500 text-[16px] leading-relaxed max-w-md"
              >
                {page.subtitle} Transformer vos groupes de travail en équipes engagées, alignées et performantes pour une cohésion et une performance collective durables.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-[#C4903E] text-white font-bold text-[14px] px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
                    aria-label="Réserver un diagnostic équipe gratuit"
                  >
                    Diagnostic équipe gratuit <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.div>
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/nos-tarifs"
                    className="inline-flex items-center gap-2 bg-[#F3F4F6] text-[#1C3A52] font-semibold text-[14px] px-7 py-3.5 rounded-full hover:bg-gray-200 transition-colors"
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
                src={HERO_IMG}
                alt="Coaching d'équipe — cohésion et performance collective — ON Coaching Mâcon"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                Entreprises · TPE/PME
              </motion.div>
            </motion.div>

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
                Pour qui
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight mb-10"
              >
                Quel type d'équipe accompagnons-nous&nbsp;?
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {PROFILES.map((item, i) => {
                  const Icon = item.icon;
                  const tilt = profileTilts[i];
                  return (
                    <motion.div key={i} variants={springUp}>
                      <div
                        ref={tilt.ref}
                        onMouseMove={tilt.onMouseMove}
                        onMouseLeave={tilt.onMouseLeave}
                        onMouseEnter={tilt.onMouseEnter}
                        className="bg-white rounded-[24px] p-5 sm:p-7 flex flex-col gap-4 sm:gap-5 h-full shadow-sm hover:shadow-md transition-shadow"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div
                          className="w-11 h-11 rounded-xl bg-[#C4903E]/10 flex items-center justify-center flex-shrink-0"
                          aria-hidden="true"
                        >
                          <Icon className="w-5 h-5 text-[#C4903E]" strokeWidth={1.8} />
                        </div>
                        <h3 className="text-[#1C3A52] font-bold text-[17px] leading-snug">{item.title}</h3>
                        <p className="text-gray-500 text-[15px] leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-[#1C3A52]">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
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
                Bénéfices
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-white leading-tight mb-10"
              >
                Ce que votre équipe va gagner
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {BENEFITS.map((b, i) => {
                  const Icon = b.icon;
                  const tilt = benefitTilts[i];
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

        <section className="py-20 bg-[#FBFBFB]">
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
                className="relative h-[300px] sm:h-[360px] lg:h-[420px] rounded-[32px] overflow-hidden group shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
              >
                <img
                  src={COACH_PHOTO}
                  alt="Noureddine Omar — Coach certifié, spécialiste coaching d'équipe — ON Coaching Mâcon"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C3A52]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  <span className="bg-[#C4903E] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full">Coach certifié</span>
                  <span className="bg-white/10 text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">26 ans d'exp.</span>
                </div>
              </motion.div>

              <motion.div variants={springRight} className="space-y-6">
                <div>
                  <p
                    className="font-mono tracking-widest uppercase text-[10px] text-[#C4903E] mb-3"
                    aria-hidden="true"
                  >
                    Le coach d'équipe
                  </p>
                  <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold tracking-tight text-[#1C3A52] leading-tight">
                    Pédagogue, sociologue &amp; coach certifié
                  </h2>
                </div>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  Fort de 26 ans d'enseignement en sciences économiques et sociales, j'ai développé
                  une expertise unique sur les dynamiques collectives et les organisations humaines.
                  Coach certifié spécialisé en coaching d'équipe, j'allie analyse sociologique et
                  outils de coaching pour transformer vos équipes de l'intérieur.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: GraduationCap, label: "26 ans d'enseignement SES — dynamiques sociales et organisationnelles" },
                    { icon: Users,         label: "Coach certifié — spécialiste coaching d'équipe en entreprise" },
                    { icon: Brain,         label: "Double expertise : pédagogie & intelligence collective" },
                    { icon: Lightbulb,     label: "Méthodes expérientielles et facilitation active" },
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
                      <span className="text-gray-600 text-[14px]">{label}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-[#C4903E] text-white font-bold text-[14px] px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Prendre rendez-vous <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section
          className="py-20 bg-[#C4903E]"
          aria-label="Tarif et prise de rendez-vous coaching équipe"
        >
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerFast}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={springLeft} className="space-y-6">
                <p
                  className="font-mono tracking-widest uppercase text-[10px] text-white/60"
                  aria-hidden="true"
                >
                  Tarif
                </p>
                <div className="text-center sm:text-left">
                  <span className="text-[clamp(2.8rem,5vw,3.5rem)] font-bold text-white leading-none">Sur devis</span>
                  <p className="text-white/70 text-[15px] mt-2">Adapté à la taille de votre équipe et à vos objectifs</p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Demi-journée d'intervention possible",
                    "Journée complète en immersion",
                    "Programme multi-séances sur mesure",
                    "À mon cabinet, chez vous ou à distance",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white text-[15px]">
                      <Check className="w-4 h-4 text-white/70 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={springRight} className="space-y-4">
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/contact"
                    className="flex sm:inline-flex justify-center w-full sm:w-auto items-center gap-2 bg-[#1C3A52] text-white font-bold text-[16px] px-8 py-5 rounded-2xl hover:opacity-90 transition-opacity"
                    aria-label="Demander un devis pour coaching d'équipe"
                  >
                    Demander un devis <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                  </Link>
                </motion.div>
                <p className="text-center text-white/60 text-[13px] font-mono">
                  Diagnostic offert · Confidentiel · Sans engagement
                </p>
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/nos-tarifs"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold text-[14px] px-8 py-4 rounded-2xl hover:bg-white/25 transition-colors backdrop-blur-sm"
                  >
                    Voir tous les tarifs
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default CoachingEquipe;
