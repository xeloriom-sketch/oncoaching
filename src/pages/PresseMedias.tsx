import { motion } from "framer-motion";
import { Newspaper, Linkedin, Podcast, Users, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { VP, fadeInScale, fadeInUp, staggerContainer } from "@/lib/motion";

// URL de la photo de profil officielle de Noureddine Omar
const PATRON_IMG =
    "https://media.licdn.com/dms/image/v2/D4D03AQEuBIyw3ZLwyQ/profile-displayphoto-scale_400_400/B4DZmQ0z9EHYAg-/0/1759071390070?e=1781136000&v=beta&t=bNUjlCr-_iCl-cugb2NR0_3aPs6Ak2gii0DQHB7ssAI";

export default function PresseMedias() {
  return (
      <Layout>
        <SEO
            title="Presse & Médias — Noureddine Omar, Coach ICF à Mâcon (71) | ON Coaching"
            description="Revue de presse, podcasts et interviews de Noureddine Omar, coach certifié ICF à Mâcon (71). Découvrez les médias et références publiques d'ON Coaching."
            canonical="/presse-medias"
            keywords="Noureddine Omar presse, ON Coaching médias, coach mâcon médias, interview coach ICF, podcast coaching bourgogne, JSL mâcon coaching"
            structuredData={[
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": "https://www.oncoaching.fr/presse-medias#webpage",
                name: "Presse & Médias — Noureddine Omar, Coach ICF Mâcon",
                url: "https://www.oncoaching.fr/presse-medias",
                isPartOf: { "@id": "https://www.oncoaching.fr/#website" },
                about: { "@id": "https://www.oncoaching.fr/#coach" },
                description: "Revue de presse, podcasts et références médiatiques de Noureddine Omar, coach certifié ICF à Mâcon (Saône-et-Loire, 71).",
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

        <section className="bg-white pt-28 pb-20 md:pb-28" aria-labelledby="presse-title">
          <div className="max-w-7xl mx-auto px-5 md:px-12">

            {/* Header */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-12 md:mb-16">
              <motion.p variants={fadeInUp} className="text-[12px] font-mono tracking-widest uppercase text-[#1ab5c7]">
                Références publiques
              </motion.p>
              <motion.h1
                  id="presse-title"
                  variants={fadeInUp}
                  className="mt-3 text-[clamp(2rem,5vw,3.6rem)] font-semibold tracking-tight text-[#0B0B0C] leading-[1.02]"
              >
                Ils parlent de nous
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-4 text-[16px] text-gray-500 max-w-2xl leading-relaxed">
                Explorez nos revues de presse, émissions vidéo, interventions audio et profils officiels validés.
              </motion.p>
            </motion.div>

            {/* SECTION 1 : Le Social Wall en Direct (Facebook & 2x LinkedIn) */}
            <div className="mb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">

                {/* Bloc Facebook - Le JSL */}
                <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp} className="flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]">
                      <Newspaper className="w-3.5 h-3.5" /> Presse Locale
                    </span>
                      <h2 className="text-xl font-semibold text-[#0B0B0C] mt-1">Le JSL</h2>
                    </div>
                    <a
                        href="https://www.facebook.com/LeJSL71/posts/pfbid026cn9growEgiYZ7sjMSMWyJhdENBm3N6szFVMAAwsaYDkgmgSmaVuh5gLFVn4r5opl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#1ab5c7] transition-colors"
                        title="Ouvrir sur Facebook"
                    >
                      Voir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full flex justify-center bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="w-full max-w-[500px] overflow-hidden rounded-xl">
                      <iframe
                          src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FLeJSL71%2Fposts%2Fpfbid026cn9growEgiYZ7sjMSMWyJhdENBm3N6szFVMAAwsaYDkgmgSmaVuh5gLFVn4r5opl&show_text=true&width=500"
                          width="100%"
                          height="720"
                          style={{ border: 'none', overflow: 'hidden', height: '720px' }}
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
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]">
                      <Linkedin className="w-3.5 h-3.5" /> Actualités
                    </span>
                      <h2 className="text-xl font-semibold text-[#0B0B0C] mt-1">Partage & Réflexions</h2>
                    </div>
                    <a
                        href="https://www.linkedin.com/feed/update/urn:li:share:7386461943089291270"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#1ab5c7] transition-colors"
                        title="Ouvrir sur LinkedIn"
                    >
                      Voir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full flex justify-center bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="w-full max-w-[504px] overflow-hidden rounded-xl">
                      <iframe
                          src="https://www.linkedin.com/embed/feed/update/urn:li:share:7386461943089291270?collapsed=1"
                          height="750"
                          width="100%"
                          style={{ border: 'none', height: '750px' }}
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
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]">
                      <Linkedin className="w-3.5 h-3.5" /> En Direct
                    </span>
                      <h2 className="text-xl font-semibold text-[#0B0B0C] mt-1">Dernières Actualités</h2>
                    </div>
                    <a
                        href="https://www.linkedin.com/feed/update/urn:li:ugcPost:7454573698885459968"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#1ab5c7] transition-colors"
                        title="Ouvrir sur LinkedIn"
                    >
                      Voir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full flex justify-center bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="w-full max-w-[504px] overflow-hidden rounded-xl">
                      <iframe
                          src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7454573698885459968"
                          height="680"
                          width="100%"
                          style={{ border: 'none', height: '680px' }}
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
            <div className="border-t border-gray-100 pt-16 mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* Colonne Gauche / Centre (2/3) : Les lecteurs multimédias YouTube et Acast */}
                <div className="lg:col-span-2 space-y-12">

                  {/* Intégration YouTube */}
                  <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp} className="flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                      <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]">
                        <Newspaper className="w-3.5 h-3.5" /> Interview Vidéo
                      </span>
                        <h2 className="text-xl font-semibold text-[#0B0B0C] mt-1">Podcast et Compagnie — L'Émission</h2>
                      </div>
                      <a
                          href="https://www.youtube.com/watch?v=Yu9CM4-DIXk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#1ab5c7] transition-colors"
                      >
                        Regarder <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/Yu9CM4-DIXk"
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
                      <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]">
                        <Podcast className="w-3.5 h-3.5" /> Écoute Nomade
                      </span>
                        <h2 className="text-xl font-semibold text-[#0B0B0C] mt-1">Le Podcast au Format Audio</h2>
                      </div>
                      <a
                          href="https://play.acast.com/s/64a44bff1355cb0011b8142a/6978f315e23c68f310aa204c"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 hover:text-[#1ab5c7] transition-colors"
                      >
                        Écouter <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <div className="w-full rounded-xl overflow-hidden bg-white">
                        <iframe
                            title="Embed Player"
                            width="100%"
                            height="188px"
                            src="https://embed.acast.com/64a44bff1355cb0011b8142a/6978f315e23c68f310aa204c"
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
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]">
                      <Linkedin className="w-3.5 h-3.5" /> Réseau
                    </span>
                      <h2 className="text-lg font-semibold text-[#0B0B0C] mt-1">Profil Professionnel</h2>
                    </div>
                    <a
                        href="https://www.linkedin.com/in/noureddine-omar-587620346/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block w-full bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-2xl p-6 text-center transition-colors shadow-sm"
                    >
                      <img
                          src={PATRON_IMG}
                          alt="Noureddine Omar - LinkedIn"
                          className="h-28 w-28 mx-auto rounded-full object-cover border-4 border-[#1ab5c7]/10 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                      />
                      <h3 className="mt-4 text-base font-semibold text-[#0B0B0C] group-hover:text-[#1ab5c7] transition-colors inline-flex items-center gap-1.5 justify-center">
                        Noureddine Omar <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider mt-1">LinkedIn</p>
                      <p className="mt-3 text-[13px] text-gray-500 leading-relaxed">
                        Parcours académique, partages et réseau professionnel en Saône-et-Loire.
                      </p>
                    </a>
                  </motion.div>

                  {/* Carte Resalib */}
                  <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp} className="flex flex-col">
                    <div className="mb-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#1ab5c7]">
                      <Users className="w-3.5 h-3.5" /> Annuaire Praticiens
                    </span>
                      <h2 className="text-lg font-semibold text-[#0B0B0C] mt-1">Praticien Certifié</h2>
                    </div>
                    <a
                        href="https://www.resalib.fr/praticien/118187-on-coaching-et-neurofeedback-coach-professionnel-certifie-sance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block w-full bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-2xl p-6 text-center transition-colors shadow-sm"
                    >
                      <img
                          src={PATRON_IMG}
                          alt="Noureddine Omar - Resalib Sancé"
                          className="h-28 w-28 mx-auto rounded-full object-cover border-4 border-[#1ab5c7]/10 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                      />
                      <h3 className="mt-4 text-base font-semibold text-[#0B0B0C] group-hover:text-[#1ab5c7] transition-colors inline-flex items-center gap-1.5 justify-center">
                        Fiche Officielle Resalib <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-gray-400 font-mono text-[10px] uppercase tracking-wider mt-1">Avis & Spécialités</p>
                      <p className="mt-3 text-[13px] text-gray-500 leading-relaxed">
                        Retrouvez ses spécialités à Sancé : coaching de vie, coaching scolaire, neurofeedback dynamique, ainsi que les avis publics des clients accompagnés.
                      </p>
                    </a>
                  </motion.div>

                </div>

              </div>
            </div>

            {/* Bloc d'ancrage local final */}
            <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInScale} className="mt-16 rounded-2xl bg-[#0B0B0C] p-6 md:p-8">
              <h3 className="text-[#1ab5c7] font-mono text-[12px] uppercase tracking-widest mb-2">Ancrage régional & Accompagnement</h3>
              <p className="text-white/80 text-[15px] leading-relaxed">
                Basé à Sancé et actif sur l'ensemble du bassin de Mâcon, Noureddine Omar met à profit son double parcours pour proposer un accompagnement sur-mesure (coaching de vie, scolaire, professionnel et neurofeedback dynamique), validé par des retours concrets du terrain.
              </p>
            </motion.div>

          </div>
        </section>
      </Layout>
  );
}