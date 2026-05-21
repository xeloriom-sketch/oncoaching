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
const COACH_PHOTO = `${import.meta.env.BASE_URL}patron.png`;

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
        <div className="min-h-screen flex items-center justify-center bg-white" aria-label="Chargement…">
          <div className="w-8 h-8 border-2 border-[#1ab5c7] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const { page, cta } = content;

  return (
    <Layout>
      <SEO
        title="Coaching d'Équipe à Mâcon — Cohésion, Communication & Performance"
        description="Coaching d'équipe ICF certifié à Mâcon. Cohésion, intelligence collective, communication et leadership pour TPE/PME et associations. 26 ans d'expérience. 1er RDV offert."
        canonical="/coaching-equipe"
        keywords="coaching équipe mâcon, team building bourgogne, cohésion équipe, coach entreprise mâcon, management bienveillant, intelligence collective, coaching PME"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://www.oncoaching.fr/coaching-equipe#service",
            name: "Coaching d'Équipe",
            url: "https://www.oncoaching.fr/coaching-equipe",
            description: "Coaching collectif certifié ICF pour renforcer la cohésion, améliorer la communication et développer l'intelligence collective des équipes professionnelles.",
            provider: { "@id": "https://www.oncoaching.fr/#business" },
            areaServed: [
              { "@type": "City", name: "Mâcon" },
              { "@type": "State", name: "Bourgogne-Franche-Comté" },
            ],
            audience: { "@type": "Audience", audienceType: "TPE, PME, associations, collectivités" },
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", description: "1er rendez-vous de diagnostic offert" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "En quoi le coaching d'équipe diffère-t-il de la formation ?", acceptedAnswer: { "@type": "Answer", text: "Le coaching d'équipe travaille sur la dynamique réelle du groupe, les relations interpersonnelles et les blocages collectifs — pas sur l'acquisition de compétences techniques." } },
              { "@type": "Question", name: "Combien de personnes peuvent participer à un coaching d'équipe ?", acceptedAnswer: { "@type": "Answer", text: "Un coaching d'équipe fonctionne idéalement pour des groupes de 4 à 15 personnes. Au-delà, des formats adaptés (ateliers, workshops) peuvent être proposés." } },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://www.oncoaching.fr/#services" },
              { "@type": "ListItem", position: 3, name: "Coaching Équipe", item: "https://www.oncoaching.fr/coaching-equipe" },
            ],
          },
        ]}
      />

      <div className="w-full bg-white min-h-screen overflow-x-hidden">

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
                className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7]"
                aria-hidden="true"
              >
                ↳ Coaching d'équipe
              </motion.p>

              <h1
                id="equipe-h1"
                className="text-[clamp(2.2rem,6vw,5rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1.05] overflow-hidden"
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
                    className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-bold text-[14px] px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
                    aria-label="Réserver un diagnostic équipe gratuit"
                  >
                    Diagnostic équipe gratuit <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.div>
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/nos-tarifs"
                    className="inline-flex items-center gap-2 bg-[#F3F4F6] text-[#0B0B0C] font-semibold text-[14px] px-7 py-3.5 rounded-full hover:bg-gray-200 transition-colors"
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
              className="relative h-[460px] rounded-[32px] overflow-hidden group"
            >
              <motion.img
                src={HERO_IMG}
                alt="Coaching d'équipe — cohésion et performance collective — ON Coaching Mâcon"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/60 via-transparent to-transparent" />
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-5 left-5 bg-[#1ab5c7] text-white px-4 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase font-semibold"
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
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight mb-10"
              >
                Quel type d'équipe accompagnons-nous&nbsp;?
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                        className="bg-white rounded-[24px] p-7 flex flex-col gap-5 h-full shadow-sm hover:shadow-md transition-shadow"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div
                          className="w-11 h-11 rounded-xl bg-[#1ab5c7]/10 flex items-center justify-center flex-shrink-0"
                          aria-hidden="true"
                        >
                          <Icon className="w-5 h-5 text-[#1ab5c7]" strokeWidth={1.8} />
                        </div>
                        <h3 className="text-[#0B0B0C] font-bold text-[17px] leading-snug">{item.title}</h3>
                        <p className="text-gray-500 text-[15px] leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-[#0B0B0C]">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerContainer}
            >
              <motion.p
                variants={fadeInUp}
                className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7]/70 mb-3"
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
                        spotlightColor="rgba(26,181,199,0.15)"
                      >
                        <div
                          ref={tilt.ref}
                          onMouseMove={tilt.onMouseMove}
                          onMouseLeave={tilt.onMouseLeave}
                          onMouseEnter={tilt.onMouseEnter}
                          className="p-7 flex flex-col gap-5 h-full"
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <motion.div
                            className="w-11 h-11 rounded-xl bg-[#1ab5c7] flex items-center justify-center flex-shrink-0"
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

        <section className="py-20 bg-white">
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
                className="relative h-[420px] rounded-[32px] overflow-hidden group"
              >
                <img
                  src={COACH_PHOTO}
                  alt="Noureddine Omar — Coach certifié ICF, spécialiste coaching d'équipe — ON Coaching Mâcon"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  <span className="bg-[#1ab5c7] text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full">Coach certifié ICF</span>
                  <span className="bg-white/10 text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">26 ans d'exp.</span>
                </div>
              </motion.div>

              <motion.div variants={springRight} className="space-y-6">
                <div>
                  <p
                    className="font-mono tracking-widest uppercase text-[10px] text-[#1ab5c7] mb-3"
                    aria-hidden="true"
                  >
                    Le coach d'équipe
                  </p>
                  <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
                    Pédagogue, sociologue &amp; coach certifié
                  </h2>
                </div>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  Fort de 26 ans d'enseignement en sciences économiques et sociales, j'ai développé
                  une expertise unique sur les dynamiques collectives et les organisations humaines.
                  Coach certifié ICF spécialisé en coaching d'équipe, j'allie analyse sociologique et
                  outils de coaching pour transformer vos équipes de l'intérieur.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: GraduationCap, label: "26 ans d'enseignement SES — dynamiques sociales et organisationnelles" },
                    { icon: Users,         label: "Coach certifié ICF — spécialiste coaching d'équipe en entreprise" },
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
                        className="w-8 h-8 rounded-xl bg-[#1ab5c7] flex items-center justify-center flex-shrink-0"
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
                    className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-bold text-[14px] px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Prendre rendez-vous <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section
          className="py-20 bg-[#1ab5c7]"
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
                <div>
                  <span className="text-[3.5rem] font-bold text-white leading-none">Sur devis</span>
                  <p className="text-white/70 text-[15px] mt-2">Adapté à la taille de votre équipe et à vos objectifs</p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Demi-journée d'intervention possible",
                    "Journée complète en immersion",
                    "Programme multi-séances sur mesure",
                    "Présentiel ou visioconférence",
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
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0B0B0C] text-white font-bold text-[16px] px-8 py-5 rounded-2xl hover:opacity-90 transition-opacity"
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
