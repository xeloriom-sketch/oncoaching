import { motion } from "framer-motion";
import { Newspaper, Linkedin, Podcast, Users, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { VP, fadeInScale, fadeInUp, staggerContainer } from "@/lib/motion";
import { usePublicContent as usePageContent } from "@/hooks/usePublicContent";
import { E } from "@/components/cms/E";

interface MediaSection {
  type: "facebook" | "linkedin" | "youtube" | "acast";
  title: string;
  embedUrl: string;
  externalUrl: string;
}

interface PresseMediasContent {
  heroTitle?: string;
  heroSubtitle?: string;
  sections?: MediaSection[];
}

// URL de la photo de profil officielle de Noureddine Omar
const PATRON_IMG =
    "https://media.licdn.com/dms/image/v2/D4D03AQEuBIyw3ZLwyQ/profile-displayphoto-scale_400_400/B4DZmQ0z9EHYAg-/0/1759071390070?e=1781136000&v=beta&t=bNUjlCr-_iCl-cugb2NR0_3aPs6Ak2gii0DQHB7ssAI";

// Fallback embed URLs used when Supabase content is not yet loaded
const FALLBACK_SECTIONS: MediaSection[] = [
  {
    type: "facebook",
    title: "Le JSL",
    embedUrl: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FLeJSL71%2Fposts%2Fpfbid026cn9growEgiYZ7sjMSMWyJhdENBm3N6szFVMAAwsaYDkgmgSmaVuh5gLFVn4r5opl&show_text=true&width=500",
    externalUrl: "https://www.facebook.com/LeJSL71/posts/pfbid026cn9growEgiYZ7sjMSMWyJhdENBm3N6szFVMAAwsaYDkgmgSmaVuh5gLFVn4r5opl",
  },
  {
    type: "linkedin",
    title: "Partage & Réflexions",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:share:7386461943089291270?collapsed=1",
    externalUrl: "https://www.linkedin.com/feed/update/urn:li:share:7386461943089291270",
  },
  {
    type: "linkedin",
    title: "Dernières Actualités",
    embedUrl: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7454573698885459968",
    externalUrl: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7454573698885459968",
  },
  {
    type: "youtube",
    title: "Podcast et Compagnie — L'Émission",
    embedUrl: "https://www.youtube.com/embed/Yu9CM4-DIXk",
    externalUrl: "https://www.youtube.com/watch?v=Yu9CM4-DIXk",
  },
  {
    type: "acast",
    title: "Le Podcast au Format Audio",
    embedUrl: "https://embed.acast.com/64a44bff1355cb0011b8142a/6978f315e23c68f310aa204c",
    externalUrl: "https://play.acast.com/s/64a44bff1355cb0011b8142a/6978f315e23c68f310aa204c",
  },
];

export default function PresseMedias() {
  const { content } = usePageContent<PresseMediasContent>("presse-medias");
  const sections = content?.sections ?? FALLBACK_SECTIONS;
  const heroTitle    = content?.heroTitle    ?? "Ils parlent de nous";
  const heroSubtitle = content?.heroSubtitle ?? "Explorez nos revues de presse, émissions vidéo, interventions audio et profils officiels validés.";

  const facebookSection  = sections.find(s => s.type === "facebook");
  const linkedinSections = sections.filter(s => s.type === "linkedin");
  const youtubeSection   = sections.find(s => s.type === "youtube");
  const acastSection     = sections.find(s => s.type === "acast");

  return (
      <Layout>
        <SEO
            title="Presse & Médias — Noureddine Omar, Coach certifié à Mâcon (71) | ON Coaching"
            description="Revue de presse, podcasts et interviews de Noureddine Omar, coach certifié à Mâcon (71). Découvrez les médias et références publiques d'ON Coaching."
            canonical="/presse-medias"
            keywords="Noureddine Omar presse, ON Coaching médias, coach mâcon médias, interview coach certifié, podcast coaching bourgogne, JSL mâcon coaching"
            structuredData={[
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": "https://www.oncoaching.fr/presse-medias#webpage",
                name: "Presse & Médias — Noureddine Omar, Coach certifié Mâcon",
                url: "https://www.oncoaching.fr/presse-medias",
                isPartOf: { "@id": "https://www.oncoaching.fr/#website" },
                about: { "@id": "https://www.oncoaching.fr/#coach" },
                description: "Revue de presse, podcasts et références médiatiques de Noureddine Omar, coach certifié à Mâcon (Saône-et-Loire, 71).",
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "Références médias — ON Coaching Mâcon",
                description: "Publications, interviews et podcasts autour de Noureddine Omar et ON Coaching",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Article Le JSL (Journal de Saône-et-Loire)", url: "https://www.facebook.com/LeJSL71/posts/pfbid026cn9growEgiYZ7sjMSMWyJhdENBm3N6szFVMAAwsaYDkgmgSmaVuh5gLFVn4r5opl" },
                  { "@type": "ListItem", position: 2, name: "Podcast et Compagnie — Interview vidéo Noureddine Omar", url: "https://www.youtube.com/watch?v=Yu9CM4-DIXk" },
                  { "@type": "ListItem", position: 3, name: "Profil LinkedIn Noureddine Omar", url: "https://www.linkedin.com/in/noureddine-omar-587620346/" },
                  { "@type": "ListItem", position: 4, name: "Fiche praticien Resalib — ON Coaching Sancé", url: "https://www.resalib.fr/praticien/118187-on-coaching-et-neurofeedback-coach-professionnel-certifie-sance" },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
                  { "@type": "ListItem", position: 2, name: "Presse & Médias", item: "https://www.oncoaching.fr/presse-medias" },
                ],
              },
            ]}
        />

        <section className="bg-[#FBFBFB] pt-20 sm:pt-24 md:pt-28 pb-10 md:pb-16 lg:pb-28 overflow-x-hidden" aria-labelledby="presse-title">
          <div className="max-w-7xl mx-auto px-5 md:px-12">

            {/* Header */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-12 md:mb-16">
              <motion.p variants={fadeInUp} className="text-[12px] font-mono tracking-widest uppercase text-[#C4903E]">
                <E fieldKey="hero.sectionLabel">{content?.hero?.sectionLabel ?? "Références publiques"}</E>
              </motion.p>
              <motion.h1
                  id="presse-title"
                  variants={fadeInUp}
                  className="mt-3 text-[clamp(2rem,5vw,3.6rem)] font-semibold tracking-tight text-[#1C3A52] leading-[1.02]"
              >
                <E fieldKey="heroTitle">{heroTitle}</E>
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-4 text-[16px] text-gray-500 max-w-2xl leading-relaxed">
                <E fieldKey="heroSubtitle">{heroSubtitle}</E>
              </motion.p>
            </motion.div>

            {/* SECTION 1 : Le Social Wall en Direct (Facebook & 2x LinkedIn) */}
            <div className="mb-12 md:mb-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">

                {/* Bloc Facebook - Le JSL */}
                <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp} className="flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#C4903E]">
                      <Newspaper className="w-3.5 h-3.5" /> Presse Locale
                    </span>
                      <h2 className="text-xl font-semibold text-[#1C3A52] mt-1">{facebookSection?.title ?? "Le JSL"}</h2>
                    </div>
                    <a
                        href={facebookSection?.externalUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#C4903E] transition-colors"
                        title="Ouvrir sur Facebook"
                    >
                      Voir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full flex justify-center bg-gray-50 rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm overflow-hidden">
                    <div className="w-full max-w-full overflow-hidden rounded-xl">
                      <iframe
                          src={facebookSection?.embedUrl}
                          width="100%"
                          height="720"
                          style={{ border: 'none', overflow: 'hidden', height: '720px', maxWidth: '100%' }}
                          scrolling="no"
                          frameBorder="0"
                          allowFullScreen={true}
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          title="Article JSL Facebook"
                      ></iframe>
                    </div>
                  </div>
                </motion.div>

                {/* Bloc LinkedIn 1 */}
                <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp} className="flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#C4903E]">
                      <Linkedin className="w-3.5 h-3.5" /> Actualités
                    </span>
                      <h2 className="text-xl font-semibold text-[#1C3A52] mt-1">{linkedinSections[0]?.title ?? "Partage & Réflexions"}</h2>
                    </div>
                    <a
                        href={linkedinSections[0]?.externalUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#C4903E] transition-colors"
                        title="Ouvrir sur LinkedIn"
                    >
                      Voir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full flex justify-center bg-gray-50 rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm overflow-hidden">
                    <div className="w-full max-w-full overflow-hidden rounded-xl">
                      <iframe
                          src={linkedinSections[0]?.embedUrl}
                          height="750"
                          width="100%"
                          style={{ border: 'none', height: '750px', maxWidth: '100%' }}
                          frameBorder="0"
                          allowFullScreen={true}
                          title="Post LinkedIn integrated 1"
                      ></iframe>
                    </div>
                  </div>
                </motion.div>

                {/* Bloc LinkedIn 2 */}
                <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp} className="flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#C4903E]">
                      <Linkedin className="w-3.5 h-3.5" /> En Direct
                    </span>
                      <h2 className="text-xl font-semibold text-[#1C3A52] mt-1">{linkedinSections[1]?.title ?? "Dernières Actualités"}</h2>
                    </div>
                    <a
                        href={linkedinSections[1]?.externalUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#C4903E] transition-colors"
                        title="Ouvrir sur LinkedIn"
                    >
                      Voir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full flex justify-center bg-gray-50 rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm overflow-hidden">
                    <div className="w-full max-w-full overflow-hidden rounded-xl">
                      <iframe
                          src={linkedinSections[1]?.embedUrl}
                          height="680"
                          width="100%"
                          style={{ border: 'none', height: '680px', maxWidth: '100%' }}
                          frameBorder="0"
                          allowFullScreen={true}
                          title="Post LinkedIn integrated 2"
                      ></iframe>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* SECTION 2 : Émissions Multimédias & Profils Praticiens */}
            <div className="border-t border-gray-100 pt-10 md:pt-16 mb-10 md:mb-16 overflow-x-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* Colonne Gauche / Centre (2/3) : Les lecteurs multimédias YouTube et Acast */}
                <div className="lg:col-span-2 space-y-12">

                  {/* Intégration YouTube */}
                  <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp} className="flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                      <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#C4903E]">
                        <Newspaper className="w-3.5 h-3.5" /> Interview Vidéo
                      </span>
                        <h2 className="text-xl font-semibold text-[#1C3A52] mt-1">{youtubeSection?.title ?? "Podcast et Compagnie — L'Émission"}</h2>
                      </div>
                      <a
                          href={youtubeSection?.externalUrl ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#C4903E] transition-colors"
                      >
                        Regarder <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="w-full bg-gray-50 rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm overflow-hidden">
                      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black max-w-full">
                        <iframe
                            width="100%"
                            height="100%"
                            src={youtubeSection?.embedUrl}
                            title="Podcast et Compagnie - Noureddine Omar"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen={true}
                        ></iframe>
                      </div>
                    </div>
                  </motion.div>

                  {/* Intégration Lecteur Audio Acast */}
                  <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp} className="flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                      <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#C4903E]">
                        <Podcast className="w-3.5 h-3.5" /> Écoute Nomade
                      </span>
                        <h2 className="text-xl font-semibold text-[#1C3A52] mt-1">{acastSection?.title ?? "Le Podcast au Format Audio"}</h2>
                      </div>
                      <a
                          href={acastSection?.externalUrl ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#C4903E] transition-colors"
                      >
                        Écouter <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="w-full bg-gray-50 rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm overflow-hidden">
                      <div className="w-full rounded-xl overflow-hidden bg-white max-w-full">
                        <iframe
                            title="Embed Player"
                            width="100%"
                            height="188px"
                            src={acastSection?.embedUrl}
                            scrolling="no"
                            frameBorder="0"
                            style={{ border: 'none', overflow: 'hidden', display: 'block' }}
                        ></iframe>
                      </div>
                    </div>
                  </motion.div>

                </div>

                {/* Colonne Droite (1/3) : Les profils officiels avec visuels (LinkedIn & Resalib) */}
                <div className="flex flex-col space-y-8 lg:mt-0">

                  {/* Carte LinkedIn */}
                  <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp} className="flex flex-col">
                    <div className="mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#C4903E]">
                      <Linkedin className="w-3.5 h-3.5" /> Réseau
                    </span>
                      <h2 className="text-lg font-semibold text-[#1C3A52] mt-1"><E fieldKey="profiles.linkedin.title">{content?.profiles?.linkedin?.title ?? "Profil Professionnel"}</E></h2>
                    </div>
                    <a
                        href="https://www.linkedin.com/in/noureddine-omar-587620346/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block w-full bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-[20px] p-4 sm:p-6 text-center transition-colors shadow-sm min-h-[44px]"
                    >
                      <img
                          src={PATRON_IMG}
                          alt="Noureddine Omar - LinkedIn"
                          className="h-28 w-28 mx-auto rounded-full object-cover border-4 border-[#C4903E]/10 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                      />
                      <h3 className="mt-4 text-base font-semibold text-[#1C3A52] group-hover:text-[#C4903E] transition-colors inline-flex items-center gap-1.5 justify-center">
                        <E fieldKey="profiles.linkedin.name">{content?.profiles?.linkedin?.name ?? "Noureddine Omar"}</E> <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider mt-1">LinkedIn</p>
                      <p className="mt-3 text-[13px] text-gray-500 leading-relaxed">
                        <E fieldKey="profiles.linkedin.description">{content?.profiles?.linkedin?.description ?? "Parcours académique, partages et réseau professionnel en Saône-et-Loire."}</E>
                      </p>
                    </a>
                  </motion.div>

                  {/* Carte Resalib */}
                  <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp} className="flex flex-col">
                    <div className="mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#C4903E]">
                      <Users className="w-3.5 h-3.5" /> Annuaire Praticiens
                    </span>
                      <h2 className="text-lg font-semibold text-[#1C3A52] mt-1"><E fieldKey="profiles.resalib.title">{content?.profiles?.resalib?.title ?? "Praticien Certifié"}</E></h2>
                    </div>
                    <a
                        href="https://www.resalib.fr/praticien/118187-on-coaching-et-neurofeedback-coach-professionnel-certifie-sance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block w-full bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-[20px] p-4 sm:p-6 text-center transition-colors shadow-sm min-h-[44px]"
                    >
                      <img
                          src={PATRON_IMG}
                          alt="Noureddine Omar - Resalib Sancé"
                          className="h-28 w-28 mx-auto rounded-full object-cover border-4 border-[#C4903E]/10 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                      />
                      <h3 className="mt-4 text-base font-semibold text-[#1C3A52] group-hover:text-[#C4903E] transition-colors inline-flex items-center gap-1.5 justify-center">
                        <E fieldKey="profiles.resalib.name">{content?.profiles?.resalib?.name ?? "Fiche Officielle Resalib"}</E> <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider mt-1"><E fieldKey="profiles.resalib.platform">{content?.profiles?.resalib?.platform ?? "Avis & Spécialités"}</E></p>
                      <p className="mt-3 text-[13px] text-gray-500 leading-relaxed">
                        <E fieldKey="profiles.resalib.description">{content?.profiles?.resalib?.description ?? "Retrouvez ses spécialités à Sancé : coaching de vie, coaching scolaire, neurofeedback dynamique, ainsi que les avis publics des clients accompagnés."}</E>
                      </p>
                    </a>
                  </motion.div>

                </div>

              </div>
            </div>

            {/* Bloc d'ancrage local final */}
            <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInScale} className="mt-10 md:mt-16 rounded-2xl bg-[#1C3A52] p-5 sm:p-6 md:p-8 overflow-hidden">
              <h3 className="text-[#C4903E] font-mono text-[12px] uppercase tracking-widest mb-2">Ancrage régional & Accompagnement</h3>
              <p className="text-white/80 text-[15px] leading-relaxed">
                Basé à Sancé et actif sur l'ensemble du bassin de Mâcon, Noureddine Omar met à profit son double parcours pour proposer un accompagnement sur-mesure (coaching de vie, scolaire, professionnel et neurofeedback dynamique), validé par des retours concrets du terrain.
              </p>
            </motion.div>

          </div>
        </section>
      </Layout>
  );
}