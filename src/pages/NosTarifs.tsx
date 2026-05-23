import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import { useTilt } from "@/hooks/useTilt";
import { usePageContent } from "@/hooks/usePageContent";
import {
  staggerContainer,
  springUp,
  springLeft,
  blurInUp,
  VP,
  btnHoverProps,
} from "@/lib/motion";
import type { TarifsContent } from "@/types";
import { Check, ArrowUpRight, ChevronDown, Phone, CreditCard, Shield, Gift } from "lucide-react";

const WORDS_HERO = ["Des", "tarifs", "clairs", "&", "justes."];

const wordVariant = {
  hidden: { opacity: 0, y: 60, rotate: 4, scale: 0.88 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotate: 0, scale: 1,
    transition: { type: "spring", damping: 18, stiffness: 220, delay: i * 0.08 },
  }),
};

const accordionBody = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
  exit:   { height: 0, opacity: 0, transition: { duration: 0.28, ease: [0.7, 0, 0.84, 0] } },
};

const FAQ_ITEMS = [
  {
    icon: Shield,
    question: "Y a-t-il un engagement ?",
    answer: "Non, aucun engagement. Chaque séance est indépendante : vous venez quand vous le souhaitez, sans abonnement ni contrat.",
  },
  {
    icon: CreditCard,
    question: "Comment régler ?",
    answer: "Par chèque, virement bancaire ou espèces — directement en fin de séance, selon votre préférence.",
  },
  {
    icon: Phone,
    question: "Les séances sont-elles remboursables ?",
    answer: "Le coaching n'est pas pris en charge par la Sécurité sociale. En revanche, certaines mutuelles proposent des remboursements partiels ; renseignez-vous auprès de la vôtre.",
  },
  {
    icon: Gift,
    question: "Le 1er RDV est vraiment gratuit ?",
    answer: "Oui, la consultation découverte (30 min) est offerte et sans engagement. L'occasion de vous présenter, de comprendre vos besoins et de voir si l'accompagnement vous correspond.",
  },
];

const STEPS = [
  { num: "01", title: "Consultation découverte", desc: "Appel ou RDV offert — 30 min pour comprendre vos besoins et valider l'adéquation." },
  { num: "02", title: "Parcours sur-mesure", desc: "Nous co-construisons un plan adapté à votre rythme, vos objectifs et votre budget." },
  { num: "03", title: "Suivi & ajustements", desc: "Chaque séance est évaluée et le programme évolue avec vous au fil des progrès." },
];

const NosTarifs = () => {
  const { content, loading } = usePageContent<TarifsContent>("nos-tarifs");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tilt0 = useTilt(8);
  const tilt1 = useTilt(8);
  const tilt2 = useTilt(8);
  const tiltSteps = [useTilt(5), useTilt(5), useTilt(5)];

  if (loading || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            className="w-9 h-9 border-2 border-[#1ab5c7] border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    );
  }

  const { particuliers, entreprises, neurofeedback, cta } = content;

  const tiltRefs = [tilt0, tilt1, tilt2];

  return (
    <Layout>
      <SEO
        title="Tarifs Coaching Mâcon (71) — Prix Séances & Forfaits | ON Coaching"
        description="Prix clairs du coaching à Mâcon (71) : séance individuelle 60€, neurofeedback 80€, équipe sur devis. Forfaits disponibles. 1er rendez-vous offert sans engagement."
        canonical="/nos-tarifs"
        keywords="tarif coaching mâcon, prix séance coaching mâcon, forfait coaching scolaire sancé, neurofeedback tarif 71, coaching entreprise prix saône-et-loire, coach certifié tarif"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://www.oncoaching.fr/nos-tarifs#webpage",
            name: "Tarifs Coaching Mâcon (71) | ON Coaching",
            url: "https://www.oncoaching.fr/nos-tarifs",
            isPartOf: { "@id": "https://www.oncoaching.fr/#website" },
            about: { "@id": "https://www.oncoaching.fr/#business" },
            description: "Tarifs transparents du coaching certifié à Mâcon (Sancé, 71) : coaching individuel, neurofeedback, coaching d'équipe.",
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://www.oncoaching.fr/nos-tarifs#service-catalog",
            name: "Coaching professionnel certifié — ON Coaching Mâcon",
            provider: { "@id": "https://www.oncoaching.fr/#business" },
            areaServed: [
              { "@type": "City", name: "Mâcon", sameAs: "https://www.wikidata.org/wiki/Q178982" },
              { "@type": "AdministrativeArea", name: "Saône-et-Loire" },
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Formules de coaching à Mâcon (71)",
              itemListElement: [
                {
                  "@type": "Offer",
                  name: "Séance coaching individuel",
                  priceCurrency: "EUR",
                  price: "60",
                  availability: "https://schema.org/InStock",
                  url: "https://www.oncoaching.fr/nos-tarifs",
                  description: "Coaching scolaire, jeunes adultes. Séance 60 min. En présentiel à Sancé (Mâcon) ou visio.",
                  seller: { "@id": "https://www.oncoaching.fr/#business" },
                },
                {
                  "@type": "Offer",
                  name: "Séance neurofeedback",
                  priceCurrency: "EUR",
                  price: "80",
                  availability: "https://schema.org/InStock",
                  url: "https://www.oncoaching.fr/coaching-neurofeedback",
                  description: "Séance neurofeedback 45-60 min. Non invasif. Résultats dès la 3e séance.",
                  seller: { "@id": "https://www.oncoaching.fr/#business" },
                },
                {
                  "@type": "Offer",
                  name: "Consultation découverte — 1er RDV offert",
                  priceCurrency: "EUR",
                  price: "0",
                  availability: "https://schema.org/InStock",
                  description: "Première consultation offerte, 30 min, sans engagement.",
                  seller: { "@id": "https://www.oncoaching.fr/#business" },
                },
                {
                  "@type": "Offer",
                  name: "Coaching d'équipe en entreprise",
                  availability: "https://schema.org/InStock",
                  url: "https://www.oncoaching.fr/coaching-equipe",
                  description: "Coaching collectif TPE/PME. Sur devis selon taille équipe et objectifs.",
                  seller: { "@id": "https://www.oncoaching.fr/#business" },
                },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Y a-t-il un engagement pour le coaching à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Non, aucun engagement. Chaque séance est indépendante : vous venez quand vous le souhaitez, sans abonnement ni contrat." }
              },
              {
                "@type": "Question",
                name: "Comment régler les séances de coaching ?",
                acceptedAnswer: { "@type": "Answer", text: "Par chèque, virement bancaire ou espèces — directement en fin de séance, selon votre préférence." }
              },
              {
                "@type": "Question",
                name: "Les séances de coaching sont-elles remboursables ?",
                acceptedAnswer: { "@type": "Answer", text: "Le coaching n'est pas pris en charge par la Sécurité sociale. En revanche, certaines mutuelles proposent des remboursements partiels ; renseignez-vous auprès de la vôtre." }
              },
              {
                "@type": "Question",
                name: "Le 1er RDV coaching est vraiment gratuit ?",
                acceptedAnswer: { "@type": "Answer", text: "Oui, la consultation découverte (30 min) est offerte et sans engagement. L'occasion de vous présenter, de comprendre vos besoins et de voir si l'accompagnement vous correspond." }
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
              { "@type": "ListItem", position: 2, name: "Nos Tarifs", item: "https://www.oncoaching.fr/nos-tarifs" },
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
            priceRange: "€€",
          },
        ]}
      />

      <div className="w-full bg-white overflow-x-hidden">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="pt-20 md:pt-28 pb-10 max-w-7xl mx-auto px-5 md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#1ab5c7] mb-6 flex items-center gap-2"
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block w-2 h-2 rounded-full bg-[#1ab5c7]"
            />
            Tarifs transparents
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-x-5 gap-y-1 mb-8"
            aria-label="Des tarifs clairs & justes."
          >
            {WORDS_HERO.map((word, i) => (
              <motion.span
                key={word + i}
                custom={i}
                variants={wordVariant}
                className={`block font-bold leading-none tracking-tight ${
                  word === "&" || word === "justes."
                    ? "text-[#1ab5c7]"
                    : "text-[#0B0B0C]"
                }`}
                style={{ fontSize: "clamp(2.5rem,6vw,6rem)" }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <motion.p
              variants={blurInUp}
              initial="hidden"
              animate="visible"
              className="text-gray-500 text-[16px] leading-relaxed max-w-md"
            >
              {particuliers.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center gap-2.5 bg-[#F3F4F6] rounded-full px-5 py-2.5 flex-shrink-0 border border-transparent hover:border-[#1ab5c7]/40 transition-colors cursor-default"
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="inline-block w-2 h-2 rounded-full bg-[#1ab5c7] flex-shrink-0"
              />
              <span className="text-[13px] font-bold text-[#0B0B0C]">• 1er RDV offert</span>
            </motion.div>
          </div>
        </section>

        {/* ── CARTES TARIFS ─────────────────────────────────────────────── */}
        <section className="pb-20 md:pb-28 max-w-7xl mx-auto px-5 md:px-12" aria-labelledby="section-tarifs">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.p variants={springUp} className="text-[11px] font-mono tracking-[0.22em] uppercase text-gray-400 mb-3">
              Formules
            </motion.p>
            <motion.h2
              variants={springUp}
              id="section-tarifs"
              className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-[#0B0B0C] leading-tight"
            >
              Choisissez votre formule
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
          >

            {/* Carte 0 — Individuel */}
            <motion.div variants={springUp} style={{ willChange: "transform" }}>
              <div
                ref={tiltRefs[0].ref}
                onMouseMove={tiltRefs[0].onMouseMove}
                onMouseLeave={tiltRefs[0].onMouseLeave}
                onMouseEnter={tiltRefs[0].onMouseEnter}
                className="rounded-[28px] p-6 sm:p-8 flex flex-col h-full bg-[#F3F4F6] cursor-default"
                style={{ willChange: "transform" }}
              >
                <p className="text-[11px] font-mono tracking-widest uppercase text-gray-400 mb-3">Particuliers</p>
                <h3 className="text-[1.6rem] font-bold text-[#0B0B0C] leading-tight mb-1">Coaching<br />Individuel</h3>
                <div className="flex items-end gap-1 mt-4 mb-6">
                  <span className="text-[3rem] font-black text-[#0B0B0C] leading-none">60€</span>
                  <span className="text-gray-400 text-[14px] mb-2">/séance</span>
                </div>
                <p className="text-gray-500 text-[14px] mb-6">Particuliers, étudiants, jeunes adultes.</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {particuliers.cards[0]?.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-[15px] text-[#0B0B0C] font-medium">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#1ab5c7]/15 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#1ab5c7]" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-[#0B0B0C] text-white font-bold text-[14px] px-6 py-3.5 rounded-full hover:bg-[#1ab5c7] transition-colors"
                >
                  Prendre RDV <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Carte 1 — Neurofeedback (featured) */}
            <motion.div variants={springUp} style={{ willChange: "transform" }} className="md:-mt-4">
              <div
                ref={tiltRefs[1].ref}
                onMouseMove={tiltRefs[1].onMouseMove}
                onMouseLeave={tiltRefs[1].onMouseLeave}
                onMouseEnter={tiltRefs[1].onMouseEnter}
                className="rounded-[32px] overflow-hidden relative"
                style={{
                  scale: 1.05,
                  willChange: "transform",
                  boxShadow: "0 0 0 1.5px #1ab5c7, 0 24px 60px rgba(26,181,199,0.22), 0 8px 24px rgba(11,11,12,0.18)",
                }}
              >
                <SpotlightCard className="bg-[#0B0B0C] p-8 flex flex-col" spotlightColor="rgba(26,181,199,0.15)">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]/60">Spécialité</p>
                    <motion.span
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="text-[11px] font-black tracking-wide uppercase bg-[#1ab5c7] text-[#0B0B0C] px-3 py-1 rounded-full"
                    >
                      Populaire
                    </motion.span>
                  </div>
                  <h3 className="text-[1.6rem] font-bold text-white leading-tight mb-1">Neuro-<br />feedback</h3>
                  <div className="flex items-end gap-1 mt-4 mb-6">
                    <span className="text-[3rem] font-black text-[#1ab5c7] leading-none">60€</span>
                    <span className="text-white/40 text-[14px] mb-2">/30 min</span>
                  </div>
                  <p className="text-white/50 text-[14px] mb-6">{neurofeedback.subtitle}</p>
                  <ul className="space-y-3 flex-1 mb-8">
                    {neurofeedback.cards[0]?.items?.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-[15px] text-white/80 font-medium">
                        <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#1ab5c7]/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#1ab5c7]" strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="mt-auto inline-flex items-center justify-center gap-2 bg-[#1ab5c7] text-[#0B0B0C] font-black text-[14px] px-6 py-3.5 rounded-full hover:brightness-110 transition-all"
                  >
                    Prendre RDV <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </SpotlightCard>
              </div>
            </motion.div>

            {/* Carte 2 — Équipe */}
            <motion.div variants={springUp} style={{ willChange: "transform" }}>
              <div
                ref={tiltRefs[2].ref}
                onMouseMove={tiltRefs[2].onMouseMove}
                onMouseLeave={tiltRefs[2].onMouseLeave}
                onMouseEnter={tiltRefs[2].onMouseEnter}
                className="rounded-[28px] p-6 sm:p-8 flex flex-col h-full bg-[#1ab5c7] cursor-default"
                style={{ willChange: "transform" }}
              >
                <p className="text-[11px] font-mono tracking-widest uppercase text-[#0B0B0C]/50 mb-3">Entreprises</p>
                <h3 className="text-[1.6rem] font-bold text-[#0B0B0C] leading-tight mb-1">Coaching<br />Équipe</h3>
                <div className="flex items-end gap-1 mt-4 mb-6">
                  <span className="text-[2.4rem] font-black text-[#0B0B0C] leading-none">Sur devis</span>
                </div>
                <p className="text-[#0B0B0C]/70 text-[14px] mb-6">{entreprises.subtitle}</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {entreprises.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-[15px] text-[#0B0B0C] font-medium">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#0B0B0C]/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#0B0B0C]" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-[#0B0B0C] text-white font-bold text-[14px] px-6 py-3.5 rounded-full hover:opacity-85 transition-opacity"
                >
                  Demander un devis <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={staggerContainer}
              className="mb-12"
            >
              <motion.p variants={springUp} className="text-[11px] font-mono tracking-[0.22em] uppercase text-gray-400 mb-3">
                Processus
              </motion.p>
              <motion.h2
                variants={springUp}
                className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-[#0B0B0C] leading-tight"
              >
                Comment ça marche ?
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              className="bg-[#F3F4F6] rounded-[32px] p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6"
            >
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  variants={springLeft}
                  ref={tiltSteps[i].ref}
                  onMouseMove={tiltSteps[i].onMouseMove}
                  onMouseLeave={tiltSteps[i].onMouseLeave}
                  onMouseEnter={tiltSteps[i].onMouseEnter}
                  className="flex flex-col cursor-default"
                  style={{ willChange: "transform" }}
                >
                  <span className="text-[clamp(3.5rem,6vw,5rem)] font-black font-mono text-[#1ab5c7]/20 leading-none mb-4 select-none">
                    {step.num}
                  </span>
                  <h3 className="text-[1.15rem] font-bold text-[#0B0B0C] mb-3 leading-tight">{step.title}</h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FAQ TARIFS ────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.p variants={springUp} className="text-[11px] font-mono tracking-[0.22em] uppercase text-gray-400 mb-3">
              FAQ
            </motion.p>
            <motion.h2
              variants={springUp}
              className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-[#0B0B0C] leading-tight"
            >
              Questions fréquentes
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VP}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-3 max-w-3xl"
          >
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openFaq === i;
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={springUp}
                  className={`rounded-[20px] overflow-hidden border transition-colors duration-300 ${
                    isOpen
                      ? "border-[#1ab5c7]/40 bg-white shadow-[0_4px_24px_rgba(26,181,199,0.1)]"
                      : "border-[#F3F4F6] bg-[#F3F4F6] hover:border-[#1ab5c7]/20"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isOpen ? "bg-[#1ab5c7] text-[#0B0B0C]" : "bg-white text-[#1ab5c7]"
                    }`}>
                      <Icon className="w-4 h-4" strokeWidth={2} />
                    </span>
                    <span className="flex-1 font-bold text-[16px] text-[#0B0B0C]">{item.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className="flex-shrink-0 text-gray-400"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        variants={accordionBody}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 pl-[4.25rem] text-gray-500 text-[15px] leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── CTA DARK ──────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={VP}
            transition={{ type: "spring", damping: 22, stiffness: 160 }}
            className="max-w-7xl mx-auto px-5 md:px-12"
          >
            <div className="bg-[#0B0B0C] rounded-[32px] px-8 md:px-16 py-16 md:py-20 relative overflow-hidden text-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, #1ab5c7, transparent)" }}
              />

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ delay: 0.1 }}
                className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#1ab5c7] mb-6 relative z-10"
              >
                Passez à l'action
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ delay: 0.18, type: "spring", damping: 20, stiffness: 180 }}
                className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-tight tracking-tight mb-5 relative z-10"
              >
                {cta.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ delay: 0.26 }}
                className="text-white/50 text-[16px] max-w-md mx-auto mb-10 leading-relaxed relative z-10"
              >
                {cta.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ delay: 0.34 }}
                className="flex flex-wrap items-center justify-center gap-4 relative z-10"
              >
                <motion.div {...btnHoverProps}>
                  <Link
                    to={cta.buttonLink}
                    className="inline-flex items-center gap-2.5 bg-[#1ab5c7] text-[#0B0B0C] font-black text-[15px] px-8 py-4 rounded-full hover:brightness-110 transition-all"
                  >
                    {cta.buttonText} <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div {...btnHoverProps}>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2.5 bg-transparent border-2 border-white/20 text-white font-bold text-[15px] px-8 py-4 rounded-full hover:border-white/50 hover:bg-white/5 transition-all"
                  >
                    Notre approche
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

      </div>
    </Layout>
  );
};

export default NosTarifs;
