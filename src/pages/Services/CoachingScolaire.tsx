import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import {
  GraduationCap, UserCheck, BookOpen, Heart, Target, Check,
  ArrowUpRight, ChevronRight, ChevronDown, Star, AlertCircle,
  Lightbulb, TrendingUp, Brain, CalendarCheck, Users,
} from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { fadeInUp, staggerContainer, springUp, cardHoverProps, VP } from "@/lib/motion";
import type { ServicePageContent } from "@/types";

const TAB_ICONS: Record<string, React.ElementType> = {
  accompagnement: GraduationCap,
  jeunes:         UserCheck,
  parents:        Heart,
  methodes:       BookOpen,
  propose:        BookOpen,
  resultats:      Target,
};

const HERO_IMG =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&q=80&auto=format&fit=crop";

const COACH_PHOTO =
  "https://tewufxbicqopmgwh.public.blob.vercel-storage.com/landing-pages/b482799c-ade7-4574-9136-60f1249636a0/images/1775986388549-photo_pour_r_seaux.jpg";

/* ── Données statiques issues de thecoachpilot ───────────────────── */
const PROBLEMS = [
  "Manque de motivation scolaire",
  "Difficultés à travailler de façon autonome",
  "Résultats en baisse malgré les efforts",
  "Tensions et conflits à la maison autour de l'école",
  "Malgré vos efforts, rien ne change vraiment",
];

const BENEFITS = [
  {
    icon: BookOpen,
    title: "Méthodes d'apprentissage efficaces",
    desc: "Apprendre à organiser son travail et utiliser des techniques d'étude adaptées pour retenir plus facilement et gagner en autonomie.",
  },
  {
    icon: TrendingUp,
    title: "Confiance en soi renforcée",
    desc: "Identifier les blocages, booster la motivation pour aborder les examens et les cours avec assurance.",
  },
  {
    icon: CalendarCheck,
    title: "Suivi personnalisé et régulier",
    desc: "Un accompagnement sur-mesure qui s'adapte aux besoins spécifiques de votre enfant pour progresser à son rythme.",
  },
  {
    icon: Brain,
    title: "Gestion du stress et organisation",
    desc: "Des outils pratiques pour gérer le stress des examens et mieux planifier les devoirs afin d'éviter la surcharge.",
  },
  {
    icon: Star,
    title: "Amélioration durable des résultats",
    desc: "Des progrès visibles et durables qui préparent votre enfant à réussir tout au long de sa scolarité.",
  },
];

const TESTIMONIALS = [
  {
    name: "Fatima",
    role: "Maman d'un élève de troisième",
    text: "Nous avons bénéficié de l'appui et de l'accompagnement de Mr Noureddine Omar. Il a été bienveillant, professionnel et éclairant sur plusieurs aspects. Mention spéciale pour les séances de Neurofeedback qui ont été vraiment et assurément d'une grande efficacité. Je recommande vivement le coaching de Noureddine Omar.",
  },
  {
    name: "Sarah",
    role: "Jeune salariée — La relance",
    text: "C'est principalement grâce à l'accompagnement coaching de M. OMAR que j'ai pu identifier clairement ce qui me freinait, mettre des mots sur mes blocages et surtout comprendre comment avancer. Les séances m'ont permis de prendre du recul et de prendre confiance en moi.",
  },
];

const PRICING = [
  {
    label: "Coaching Individuel",
    badge: "Populaire",
    price: "60€",
    unit: "/ séance",
    items: [
      "Reprise de confiance en soi",
      "Méthodes efficaces pour mieux travailler",
      "Progression rapide et durable",
    ],
    dark: true,
  },
  {
    label: "Coaching + Neurofeedback",
    badge: null,
    price: "80€",
    unit: "/ séance",
    desc: "Un accompagnement complet pour des résultats plus rapides et en profondeur",
    items: [
      "Amélioration de la concentration",
      "Réduction du stress et de l'anxiété",
      "Travail en profondeur sur les blocages",
    ],
    dark: false,
  },
];

const FAQS = [
  {
    q: "À quel âge mon enfant peut-il commencer le coaching scolaire ?",
    a: "Le coaching scolaire est adapté dès le collège (à partir de 11 ans) jusqu'aux études supérieures. Chaque séance est calibrée sur l'âge et le niveau de maturité du jeune.",
  },
  {
    q: "Comment se déroule une séance de coaching ?",
    a: "Chaque séance dure environ 1 heure. On commence par un point sur la semaine, puis on travaille sur un objectif précis (méthode, motivation, organisation) avec des outils concrets. Les séances sont disponibles en présentiel à Sancé (Mâcon), en visio ou à domicile.",
  },
  {
    q: "Le coaching peut-il aider un élève en grande difficulté ?",
    a: "Oui. Le coaching est particulièrement efficace pour les jeunes en décrochage, en perte de sens ou en grande difficulté. L'approche bienveillante et personnalisée permet de repartir sur de bonnes bases.",
  },
  {
    q: "À quelle fréquence les séances sont-elles recommandées ?",
    a: "Une séance par semaine ou toutes les deux semaines est idéale au démarrage pour créer une dynamique. Le rythme peut être ajusté selon les besoins et les objectifs.",
  },
  {
    q: "Le coaching scolaire remplace-t-il les cours particuliers ?",
    a: "Non — le coaching scolaire ne remplace pas les cours particuliers. Il les complète. Là où les cours particuliers apportent des savoirs, le coaching développe la méthode, la motivation et la confiance. Les deux sont complémentaires.",
  },
];

/* ────────────────────────────────────────────────────────────────── */

const CoachingScolaire = () => {
  const { content, loading } = usePageContent<ServicePageContent>("coaching-scolaire");
  const [activeTab, setActiveTab]   = useState("accompagnement");
  const [openFaq,   setOpenFaq]     = useState<number | null>(null);

  if (loading || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white" aria-label="Chargement…">
          <div className="w-8 h-8 border-2 border-[#1ab5c7] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const { page, tabs, cta } = content;
  const activeData = tabs.find(t => t.key === activeTab);

  return (
    <Layout>
      <SEO
        title="Coaching Scolaire & Étudiant — ON Coaching Mâcon"
        description="Coach certifié ICF, 26 ans enseignant SES. Accompagnement scolaire à Sancé (Mâcon) : méthodes de travail, motivation, gestion du stress. 1er RDV offert."
        canonical="/coaching-scolaire"
        structuredData={{
          "@context": "https://schema.org",
          "@type":    "Service",
          "name":     "Coaching Scolaire & Étudiant",
          "url":      "https://www.oncoaching.fr/coaching-scolaire",
          "provider": { "@id": "https://www.oncoaching.fr/#business" },
        }}
      />

      <div className="w-full bg-white min-h-screen px-4 py-6 md:px-12 md:py-8 space-y-6">

        {/* ── HERO TEXT ─────────────────────────────── */}
        <motion.header
          initial="hidden" animate="visible" variants={staggerContainer}
          className="space-y-3"
          aria-labelledby="scolaire-h1"
        >
          <motion.p variants={fadeInUp} className="font-mono tracking-widest uppercase text-[10px] text-gray-400" aria-hidden="true">
            ↳ Coaching Scolaire
          </motion.p>
          <motion.h1
            id="scolaire-h1"
            variants={fadeInUp}
            className="text-[clamp(2.2rem,6vw,5rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1]"
          >
            {page.title}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-500 text-[15px] max-w-xl">
            Votre enfant manque de motivation, décroche ou ne trouve plus sa place à l'école ?<br />
            Je l'aide à retrouver confiance, méthode et sérénité en quelques semaines.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-bold text-[13px] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Réserver un premier échange gratuit <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.header>

        {/* ── HERO IMAGE ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[260px] sm:h-[380px] rounded-[32px] overflow-hidden"
        >
          <img
            src={HERO_IMG}
            alt="Coaching scolaire et étudiant à Mâcon — ON Coaching"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute bottom-4 left-4 bg-[#1ab5c7] text-white px-4 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase font-semibold"
          >
            Coaching Scolaire &amp; Étudiant
          </motion.div>
        </motion.div>

        {/* ── PROBLÈMES ─────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp}
          className="bg-[#F3F4F6] rounded-[32px] p-8 md:p-12"
          aria-label="Situations difficiles"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-[#0B0B0C]" strokeWidth={1.8} aria-hidden="true" />
            <h2 className="font-semibold text-[1.1rem] text-[#0B0B0C] tracking-tight">
              Vous vous reconnaissez dans cette situation ?
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PROBLEMS.map((p, i) => (
              <li key={i} className="flex items-start gap-3 bg-white rounded-2xl px-5 py-4 text-[13px] text-[#0B0B0C] font-medium shadow-sm">
                <span className="w-5 h-5 rounded-full bg-[#0B0B0C] text-[#1ab5c7] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" aria-hidden="true">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* ── BÉNÉFICES ─────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
          aria-label="Bénéfices du coaching scolaire"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <p className="font-mono tracking-widest uppercase text-[10px] text-gray-400 mb-2" aria-hidden="true">Résultats</p>
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
              Les bénéfices du coaching
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.article
                  key={i}
                  variants={springUp}
                  {...cardHoverProps}
                  className="bg-[#0B0B0C] rounded-[24px] p-6 flex flex-col gap-4 cursor-default"
                >
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-[#1ab5c7] flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
                  </motion.div>
                  <h3 className="text-white font-semibold text-[14px] leading-snug">{b.title}</h3>
                  <p className="text-white/50 text-[13px] leading-relaxed flex-1">{b.desc}</p>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* ── TABS PANEL ────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp}
          className="bg-[#0B0B0C] rounded-[32px] overflow-hidden"
          aria-label="Services de coaching scolaire"
        >
          <div className="flex flex-col lg:flex-row min-h-[500px]">

            {/* Left nav */}
            <nav aria-label="Onglets" className="lg:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/8">
              <div className="p-6 space-y-1">
                {tabs.map(tab => {
                  const Icon     = TAB_ICONS[tab.key] ?? Target;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      aria-selected={isActive}
                      aria-controls="tab-panel"
                      role="tab"
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 min-h-[44px] ${
                        isActive ? "bg-white text-[#0B0B0C]" : "text-white/40 hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive ? "bg-[#1ab5c7] text-white" : "bg-white/5"
                        }`}
                        aria-hidden="true"
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#0B0B0C]" : "text-white/40"}`} strokeWidth={1.8} />
                      </div>
                      <span className="font-semibold text-[13px] tracking-tight leading-snug flex-1">{tab.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 text-[#1ab5c7] flex-shrink-0" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Right content */}
            <div id="tab-panel" role="tabpanel" className="flex-1 p-8 lg:p-10">
              <AnimatePresence mode="wait">
                {activeData && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h2 className="font-semibold tracking-tight text-white text-[1.25rem] mb-5 leading-snug">
                      {activeData.label}
                    </h2>
                    {activeData.paragraphs?.map((p, i) => (
                      <p key={i} className="text-white/50 text-[14px] leading-relaxed mb-4">{p}</p>
                    ))}
                    {activeData.items && (
                      <ul className="space-y-3 mt-2">
                        {activeData.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-white/60 text-[13px]">
                            <Check className="w-4 h-4 text-[#1ab5c7]/70 flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {activeData.quote && (
                      <blockquote className="mt-6 text-white/40 text-[13px] italic border-l-2 border-[#1ab5c7]/30 pl-4 leading-relaxed">
                        {activeData.quote}
                      </blockquote>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-8 py-5 border-t border-white/8">
            <p className="text-white/20 text-[12px] font-mono">Consultation initiale gratuite · Sans engagement</p>
            <Link
              to={cta.buttonLink}
              className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-semibold text-[13px] px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              {cta.buttonText} <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </motion.section>

        {/* ── À PROPOS DU COACH ─────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
          className="bg-[#0B0B0C] rounded-[32px] overflow-hidden"
          aria-label="À propos du coach"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Photo */}
            <motion.div
              variants={springUp}
              className="relative h-[320px] lg:h-auto min-h-[360px] overflow-hidden"
            >
              <img
                src={COACH_PHOTO}
                alt="Noureddine Omar — Coach certifié ICF, ON Coaching Mâcon"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-[#1ab5c7] text-[10px] font-mono tracking-widest uppercase">Noureddine Omar</p>
                <p className="text-white font-semibold text-[14px]">Coach certifié ICF</p>
              </div>
            </motion.div>

            {/* Texte */}
            <motion.div variants={fadeInUp} className="p-8 lg:p-10 space-y-6">
              <div>
                <p className="font-mono tracking-widest uppercase text-[10px] text-white/30 mb-3" aria-hidden="true">Le coach</p>
                <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-tight text-white leading-tight">
                  Qui suis-je pour vous accompagner ?
                </h2>
              </div>
              <blockquote className="space-y-3 border-l-2 border-[#1ab5c7] pl-5 not-italic">
                <p className="text-white/60 text-[13px] leading-relaxed">
                  Pendant plus de 26 ans, j'ai accompagné des jeunes, des adolescents et des familles au cœur des enjeux scolaires, éducatifs et personnels.
                </p>
                <p className="text-white/60 text-[13px] leading-relaxed">
                  Au fil de mon expérience d'enseignant en SES, j'ai constaté que les difficultés scolaires ne sont pas uniquement liées aux capacités… mais souvent à la confiance, à la motivation et à la gestion du stress.
                </p>
                <p className="text-white/60 text-[13px] leading-relaxed">
                  Formé en neurofeedback, j'intègre une compréhension fine du fonctionnement du cerveau pour aider chaque jeune à dépasser ses blocages.
                </p>
              </blockquote>
              <ul className="space-y-3">
                {[
                  { icon: GraduationCap, label: "26 ans d'expérience en enseignement SES" },
                  { icon: Users,         label: "Coach certifié ICF — Prisme Évolution" },
                  { icon: Brain,         label: "Formé en neurofeedback" },
                  { icon: Lightbulb,     label: "Double expertise pédagogique & humaine" },
                ].map(({ icon: Icon, label }, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#1ab5c7] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
                    </div>
                    <span className="text-white/70 text-[13px]">{label}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* ── TÉMOIGNAGES ───────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
          aria-label="Témoignages clients"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <p className="font-mono tracking-widest uppercase text-[10px] text-gray-400 mb-2" aria-hidden="true">Témoignages</p>
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
              Ils m'ont fait confiance
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.article
                key={i}
                variants={springUp}
                {...cardHoverProps}
                className="bg-[#F3F4F6] rounded-[24px] p-7 flex flex-col gap-4 cursor-default"
              >
                <div className="flex gap-1" aria-label="5 étoiles">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#1ab5c7] text-[#1ab5c7]" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-gray-600 text-[13px] leading-relaxed flex-1">
                  "{t.text}"
                </blockquote>
                <footer className="mt-2">
                  <p className="font-semibold text-[#0B0B0C] text-[13px]">{t.name}</p>
                  <p className="text-gray-400 text-[11px]">{t.role}</p>
                </footer>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* ── TARIFS ────────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
          aria-label="Tarifs du coaching scolaire"
        >
          <motion.div variants={fadeInUp} className="mb-2">
            <p className="font-mono tracking-widest uppercase text-[10px] text-gray-400 mb-2" aria-hidden="true">Tarifs</p>
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
              Choisissez l'accompagnement adapté
            </h2>
            <p className="text-gray-500 text-[14px] mt-2 max-w-xl">
              Chaque jeune est unique. Commencez par un bilan gratuit et choisissez ensuite l'accompagnement le plus adapté.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {PRICING.map((plan, i) => (
              <motion.article
                key={i}
                variants={fadeInUp}
                className={`rounded-[24px] p-8 flex flex-col gap-5 relative ${
                  plan.dark ? "bg-[#0B0B0C] text-white" : "bg-[#F3F4F6] text-[#0B0B0C]"
                }`}
              >
                {plan.badge && (
                  <span className="absolute top-6 right-6 bg-[#1ab5c7] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {plan.badge}
                  </span>
                )}
                <div>
                  <h3 className={`font-semibold text-[15px] mb-1 ${plan.dark ? "text-white" : "text-[#0B0B0C]"}`}>
                    {plan.label}
                  </h3>
                  {plan.desc && (
                    <p className={`text-[12px] leading-relaxed ${plan.dark ? "text-white/50" : "text-gray-500"}`}>
                      {plan.desc}
                    </p>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-[2.5rem] font-bold tracking-tight ${plan.dark ? "text-white" : "text-[#0B0B0C]"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-[13px] ${plan.dark ? "text-white/40" : "text-gray-400"}`}>{plan.unit}</span>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[13px]">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.dark ? "text-[#1ab5c7]" : "text-[#0B0B0C]"}`}
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span className={plan.dark ? "text-white/70" : "text-gray-600"}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`inline-flex items-center justify-center gap-2 font-semibold text-[13px] px-6 py-3 rounded-full hover:opacity-90 transition-opacity ${
                    plan.dark
                      ? "bg-[#1ab5c7] text-white"
                      : "bg-[#0B0B0C] text-white"
                  }`}
                >
                  Prendre rendez-vous <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* ── FAQ ───────────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={staggerContainer}
          aria-label="Questions fréquentes"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <p className="font-mono tracking-widest uppercase text-[10px] text-gray-400 mb-2" aria-hidden="true">FAQ</p>
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-semibold tracking-tight text-[#0B0B0C] leading-tight">
              Questions fréquentes
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp} className="space-y-2">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="bg-[#F3F4F6] rounded-[20px] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 min-h-[60px]"
                  >
                    <span className="font-medium text-[#0B0B0C] text-[14px] leading-snug">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-gray-500 text-[13px] leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* ── CTA FINAL ─────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp}
          className="bg-[#0B0B0C] rounded-[32px] p-10 md:p-16 text-center space-y-5"
          aria-label="Appel à l'action"
        >
          <h2 className="text-[clamp(1.6rem,4vw,3rem)] font-semibold tracking-tight text-white leading-tight">
            Réservez votre bilan gratuit<br />dès maintenant
          </h2>
          <p className="text-white/50 text-[14px] max-w-md mx-auto">
            Faites le point sur la situation de votre enfant et découvrez les solutions adaptées pour retrouver motivation, confiance et sérénité.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-bold text-[14px] px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
          >
            Prendre rendez-vous <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <p className="text-white/25 text-[11px] font-mono">Sans engagement · Confidentiel</p>
        </motion.section>

      </div>
    </Layout>
  );
};

export default CoachingScolaire;
