import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import { usePageContent } from "@/hooks/usePageContent";
import { useTilt } from "@/hooks/useTilt";
import {
  fadeInUp,
  blurInUp,
  springLeft,
  springRight,
  stagger,
  staggerFast,
  btnHoverProps,
  liftHoverProps,
  pulseDot,
  VP,
} from "@/lib/motion";
import { MapPin, Phone, Mail, ChevronDown, ArrowUpRight, Check, MessageSquare, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ContactContent } from "@/types";

const WORDS = ["Parlons", "de", "votre", "projet."];

const FAQ = [
  {
    q: "Est-ce que le 1er rendez-vous est vraiment gratuit ?",
    a: "Oui, absolument. Le premier rendez-vous est offert, sans engagement de votre part. C'est l'occasion d'échanger sur vos besoins et de voir si nous sommes faits pour travailler ensemble.",
  },
  {
    q: "Comment se déroule une séance de coaching ?",
    a: "Chaque séance dure entre 45 minutes et 1 heure. Elle peut se tenir en présentiel dans notre cabinet à Sancé ou à distance en visioconférence, selon votre préférence.",
  },
  {
    q: "Combien de séances sont nécessaires ?",
    a: "Le nombre de séances varie selon vos objectifs et votre rythme d'évolution. En général, 6 à 10 séances permettent d'atteindre des résultats concrets. Nous définissons ensemble le parcours adapté.",
  },
  {
    q: "Proposez-vous des forfaits ou des tarifs spéciaux ?",
    a: "Oui, nous proposons des forfaits séances qui offrent une réduction par rapport au tarif à l'unité. Consultez notre page Tarifs ou demandez-nous directement lors du 1er RDV.",
  },
];

const TIME_PREFS = [
  { value: "matin", label: "Matin (9h – 12h)" },
  { value: "après-midi", label: "Après-midi (14h – 17h)" },
  { value: "flexible", label: "Flexible" },
];

function FloatingField({
  id, label, type = "text", name, value, onChange, required = false, autoComplete,
}: {
  id: string; label: string; type?: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={id} name={name} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        required={required} autoComplete={autoComplete}
        className="peer w-full bg-white border-2 border-gray-200 rounded-2xl px-4 pt-6 pb-2 text-[15px] text-[#0B0B0C] outline-none transition-all duration-200 focus:border-[#1ab5c7] focus:shadow-[0_0_0_4px_rgba(26,181,199,0.12)]"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 transition-all duration-200 origin-left"
        style={{
          top: active ? "8px" : "50%",
          transform: active ? "translateY(0) scale(0.75)" : "translateY(-50%) scale(1)",
          color: focused ? "#1ab5c7" : "#9ca3af",
          fontSize: "15px", fontWeight: 500,
        }}
      >
        {label}{required && " *"}
      </label>
    </div>
  );
}

function FloatingTextarea({
  id, label, name, value, onChange, required = false,
}: {
  id: string; label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <textarea
        id={id} name={name} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        required={required} rows={4}
        className="peer w-full bg-white border-2 border-gray-200 rounded-2xl px-4 pt-7 pb-3 text-[15px] text-[#0B0B0C] outline-none resize-none transition-all duration-200 focus:border-[#1ab5c7] focus:shadow-[0_0_0_4px_rgba(26,181,199,0.12)]"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-4 transition-all duration-200 origin-left"
        style={{
          transform: active ? "translateY(-6px) scale(0.75)" : "translateY(0) scale(1)",
          color: focused ? "#1ab5c7" : "#9ca3af",
          fontSize: "15px", fontWeight: 500,
        }}
      >
        {label}{required && " *"}
      </label>
    </div>
  );
}

const Contact = () => {
  const { toast } = useToast();
  const { content, loading } = usePageContent<ContactContent>("contact");
  const tilt = useTilt(8);

  const [formType, setFormType] = useState<"contact" | "rdv">("contact");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "", service: "coaching-de-vie",
    preferredDate: "", preferredTime: "flexible",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const msgs = content?.formulaire.messages ?? {
      successTitle: "Envoyé !",
      successDescription: "Nous vous répondrons très bientôt.",
      errorTitle: "Erreur",
      errorDefault: "Une erreur est survenue.",
    };
    try {
      const response = await fetch("/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: formType }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || msgs.errorDefault);
      }
      const successMsg = formType === "rdv"
        ? { title: "Demande envoyée !", description: "Nous confirmerons votre rendez-vous dans les 24h." }
        : { title: msgs.successTitle, description: msgs.successDescription };
      toast({ ...successMsg, duration: 6000 });
      setFormData({
        name: "", email: "", phone: "", subject: "", message: "", service: "coaching-de-vie",
        preferredDate: "", preferredTime: "flexible",
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : msgs.errorDefault;
      toast({ title: msgs.errorTitle, description: msg, variant: "destructive", duration: 7000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-2 border-[#1ab5c7] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const { coordonnees, formulaire } = content;
  const services = formulaire.services ?? [];
  const isRdv = formType === "rdv";

  return (
    <Layout>
      <SEO
        title="Contactez-nous — Prendre Rendez-vous"
        description="Contactez ON Coaching : 14 rue des écureuils, 71000 Sancé. Tél : 06 63 04 18 12. Premier rendez-vous offert, sans engagement."
        canonical="/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact | ON Coaching",
          url: "https://www.oncoaching.fr/contact",
        }}
      />

      <div className="w-full bg-white">

        {/* ── HERO ───────────────────────────────────────────────── */}
        <section className="pt-10 pb-8 max-w-7xl mx-auto px-5 md:px-12">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-start gap-6">
            <motion.div variants={blurInUp} className="flex items-center gap-2">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-[#1ab5c7]"
                animate={pulseDot.animate}
                transition={pulseDot.transition}
              />
              <span className="text-[13px] font-semibold tracking-widest uppercase text-[#1ab5c7]">
                Réponse sous 24h
              </span>
            </motion.div>

            <h1
              aria-label="Parlons de votre projet."
              className="leading-[1.1] font-bold tracking-tight text-[#0B0B0C]"
              style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}
            >
              {WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.08 }}
                  className={`inline-block mr-[0.22em] ${word === "projet." ? "text-[#1ab5c7]" : ""}`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p variants={blurInUp} className="text-[17px] text-gray-500 leading-relaxed max-w-xl">
              {coordonnees.subtitle}
            </motion.p>
          </motion.div>
        </section>

        {/* ── GRID CONTACT ────────────────────────────────────────── */}
        <section className="py-0 pb-20 md:pb-28 max-w-7xl mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* ── GAUCHE : Formulaire ──────────────────────────── */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={VP} variants={stagger}
              className="flex flex-col gap-5"
            >
              {/* Mode switcher */}
              <motion.div variants={springLeft}>
                <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl mb-2">
                  <button
                    type="button"
                    onClick={() => setFormType("contact")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[14px] font-semibold transition-all duration-200 ${
                      !isRdv
                        ? "bg-white text-[#0B0B0C] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" strokeWidth={2} />
                    Envoyer un message
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("rdv")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[14px] font-semibold transition-all duration-200 ${
                      isRdv
                        ? "bg-[#1ab5c7] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" strokeWidth={2} />
                    Prendre rendez-vous
                  </button>
                </div>

                <p className="text-[12px] font-mono tracking-widest uppercase text-gray-400 mb-1 mt-4">
                  {isRdv ? "RÉSERVATION" : formulaire.title}
                </p>
                <h2 className="text-[1.65rem] font-bold text-[#0B0B0C] leading-snug tracking-tight">
                  {isRdv
                    ? "Choisissez vos disponibilités"
                    : formulaire.subtitle}
                </h2>
                {isRdv && (
                  <p className="text-[14px] text-gray-500 mt-2 leading-relaxed">
                    Indiquez vos créneaux préférés — nous vous confirmons le rendez-vous sous 24h.
                  </p>
                )}
              </motion.div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <motion.div
                  variants={staggerFast} initial="hidden" whileInView="visible" viewport={VP}
                  className="flex flex-col gap-4"
                >
                  {/* Nom / Email */}
                  <motion.div variants={springLeft} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FloatingField id="name" label="Nom complet" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" />
                    <FloatingField id="email" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
                  </motion.div>

                  {/* Téléphone / Service */}
                  <motion.div variants={springLeft} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FloatingField id="phone" label="Téléphone" type="tel" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" />
                    <div className="relative">
                      <select
                        id="service" name="service" value={formData.service} onChange={handleChange}
                        className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 pt-6 pb-2 text-[15px] text-[#0B0B0C] outline-none transition-all duration-200 focus:border-[#1ab5c7] focus:shadow-[0_0_0_4px_rgba(26,181,199,0.12)] appearance-none cursor-pointer"
                      >
                        {services.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <label htmlFor="service" className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                        Service
                      </label>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                    </div>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {isRdv ? (
                      <motion.div
                        key="rdv-fields"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-4"
                      >
                        <FloatingField
                          id="preferredDate" label="Date souhaitée" type="date" name="preferredDate"
                          value={formData.preferredDate} onChange={handleChange} required
                        />

                        <div className="relative">
                          <select
                            id="preferredTime" name="preferredTime" value={formData.preferredTime} onChange={handleChange}
                            className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 pt-6 pb-2 text-[15px] text-[#0B0B0C] outline-none transition-all duration-200 focus:border-[#1ab5c7] focus:shadow-[0_0_0_4px_rgba(26,181,199,0.12)] appearance-none cursor-pointer"
                          >
                            {TIME_PREFS.map((t) => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                          <label htmlFor="preferredTime" className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                            Créneau préféré
                          </label>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" strokeWidth={2} />
                        </div>

                        <FloatingTextarea
                          id="message" label="Un mot sur votre besoin (optionnel)"
                          name="message" value={formData.message} onChange={handleChange}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="contact-fields"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-4"
                      >
                        <motion.div variants={springLeft}>
                          <FloatingField id="subject" label="Sujet" name="subject" value={formData.subject} onChange={handleChange} required />
                        </motion.div>
                        <motion.div variants={springLeft}>
                          <FloatingTextarea id="message" label="Votre message" name="message" value={formData.message} onChange={handleChange} required />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.div variants={springLeft}>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      {...btnHoverProps}
                      className={`w-full flex items-center justify-center gap-2 text-white font-bold text-[15px] py-4 rounded-2xl transition-opacity disabled:opacity-50 min-h-[56px] ${
                        isRdv
                          ? "bg-[#1ab5c7] shadow-[0_8px_32px_rgba(26,181,199,0.35)]"
                          : "bg-[#0B0B0C] shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Envoi en cours…
                        </>
                      ) : isRdv ? (
                        <>
                          <CalendarDays className="w-4 h-4" />
                          Demander ce rendez-vous
                        </>
                      ) : (
                        <>
                          Envoyer le message
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>

                  <motion.p
                    variants={fadeInUp}
                    className="text-gray-400 text-[13px] text-center flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-[#1ab5c7]" strokeWidth={3} />
                    {isRdv ? "Confirmation sous 24h · 1er RDV offert" : "Consultation initiale gratuite · Sans engagement"}
                  </motion.p>
                </motion.div>
              </form>
            </motion.div>

            {/* ── DROITE : Carte dark ──────────────────────────── */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={VP} variants={springRight}
              className="flex flex-col"
            >
              <SpotlightCard
                className="bg-[#0B0B0C] rounded-[32px] p-8 md:p-10 h-full flex flex-col gap-8"
                spotlightColor="rgba(26,181,199,0.15)"
              >
                <div
                  ref={tilt.ref}
                  onMouseMove={tilt.onMouseMove}
                  onMouseLeave={tilt.onMouseLeave}
                  onMouseEnter={tilt.onMouseEnter}
                  className="flex flex-col gap-6 flex-1"
                  style={{ willChange: "transform" }}
                >
                  <div>
                    <p className="text-[11px] font-mono tracking-widest uppercase text-white/30 mb-1">Retrouvez-nous</p>
                    <h3 className="text-white font-bold text-[1.4rem] leading-snug">Nos coordonnées</h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    <motion.a
                      href="https://maps.google.com/?q=14+rue+des+écureuils,+71000+Sancé"
                      target="_blank" rel="noopener noreferrer"
                      {...liftHoverProps}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#1ab5c7]/10 border border-[#1ab5c7]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1ab5c7]/20 transition-colors">
                        <MapPin className="w-5 h-5 text-[#1ab5c7]" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono tracking-widest uppercase text-white/30 mb-0.5">{coordonnees.adresse.label}</p>
                        <p className="text-white font-semibold text-[15px] leading-snug whitespace-pre-line group-hover:text-[#1ab5c7] transition-colors">
                          {coordonnees.adresse.value}
                        </p>
                      </div>
                    </motion.a>

                    <div className="h-px bg-white/5" />

                    <motion.a
                      href={`tel:${coordonnees.telephone.value.replace(/\s/g, "")}`}
                      {...liftHoverProps}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#1ab5c7]/10 border border-[#1ab5c7]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1ab5c7]/20 transition-colors">
                        <Phone className="w-5 h-5 text-[#1ab5c7]" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono tracking-widest uppercase text-white/30 mb-0.5">{coordonnees.telephone.label}</p>
                        <p className="text-white font-semibold text-[15px] group-hover:text-[#1ab5c7] transition-colors">
                          {coordonnees.telephone.value}
                        </p>
                      </div>
                    </motion.a>

                    <div className="h-px bg-white/5" />

                    <motion.a
                      href={`mailto:${coordonnees.email.value}`}
                      {...liftHoverProps}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#1ab5c7]/10 border border-[#1ab5c7]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1ab5c7]/20 transition-colors">
                        <Mail className="w-5 h-5 text-[#1ab5c7]" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono tracking-widest uppercase text-white/30 mb-0.5">{coordonnees.email.label}</p>
                        <p className="text-white font-semibold text-[15px] break-all group-hover:text-[#1ab5c7] transition-colors">
                          {coordonnees.email.value}
                        </p>
                      </div>
                    </motion.a>
                  </div>

                  {/* Horaires */}
                  {coordonnees.horaires?.lines?.length > 0 && (
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[11px] font-mono tracking-widest uppercase text-white/30 mb-3">Horaires</p>
                      <div className="flex flex-col gap-1.5">
                        {coordonnees.horaires.lines.map((line: string, i: number) => (
                          <p key={i} className="text-white/60 text-[13px]">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-white/5">
                    <motion.div
                      className="flex items-center gap-3 bg-[#1ab5c7]/10 border border-[#1ab5c7]/20 rounded-2xl px-5 py-4 w-fit"
                      whileHover={{ scale: 1.04, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                    >
                      <motion.div
                        className="w-3 h-3 rounded-full bg-[#1ab5c7]"
                        animate={pulseDot.animate}
                        transition={pulseDot.transition}
                      />
                      <span className="text-[#1ab5c7] font-bold text-[14px]">1er RDV offert</span>
                      <span className="text-white/40 text-[13px]">· Sans engagement</span>
                    </motion.div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-[#F3F4F6]">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden" whileInView="visible" viewport={VP} variants={stagger}
              className="max-w-3xl mx-auto"
            >
              <motion.p variants={blurInUp} className="text-[12px] font-mono tracking-widest uppercase text-[#1ab5c7] mb-3 text-center">
                Questions fréquentes
              </motion.p>
              <motion.h2
                variants={blurInUp}
                className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[#0B0B0C] text-center mb-12 leading-tight tracking-tight"
              >
                Vous avez des questions ?
              </motion.h2>

              <motion.div variants={stagger} className="flex flex-col gap-3">
                {FAQ.map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                      aria-expanded={openFaq === i}
                    >
                      <span className="font-semibold text-[15px] text-[#0B0B0C] group-hover:text-[#1ab5c7] transition-colors leading-snug pr-2">
                        {item.q}
                      </span>
                      <motion.div
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F3F4F6] group-hover:bg-[#1ab5c7]/10 flex items-center justify-center transition-colors"
                      >
                        <ChevronDown className={`w-4 h-4 transition-colors ${openFaq === i ? "text-[#1ab5c7]" : "text-gray-400"}`} strokeWidth={2.5} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-5 text-[15px] text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp}>
              <SpotlightCard
                className="bg-[#0B0B0C] rounded-[40px] py-20 px-8 md:px-16 text-center"
                spotlightColor="rgba(26,181,199,0.18)"
              >
                <motion.p variants={blurInUp} initial="hidden" whileInView="visible" viewport={VP}
                  className="text-[12px] font-mono tracking-widest uppercase text-[#1ab5c7] mb-4"
                >
                  Prêt à commencer ?
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
                  transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.1 }}
                  className="text-white font-bold leading-tight tracking-tight mb-5"
                  style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}
                >
                  Votre premier pas<br />
                  <span className="text-[#1ab5c7]">ne coûte rien.</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-white/50 text-[16px] max-w-md mx-auto mb-10 leading-relaxed"
                >
                  Réservez votre premier rendez-vous offert et découvrez comment le coaching peut transformer votre quotidien.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={VP}
                  transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <motion.a
                    href="tel:+33663041812" {...btnHoverProps}
                    className="inline-flex items-center gap-2 bg-[#1ab5c7] text-white font-bold text-[15px] px-8 py-4 rounded-2xl shadow-[0_8px_40px_rgba(26,181,199,0.4)] cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler maintenant
                  </motion.a>
                  <motion.a
                    href={`mailto:${coordonnees.email.value}`} {...liftHoverProps}
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white font-semibold text-[15px] px-6 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    Écrire un email
                  </motion.a>
                </motion.div>
              </SpotlightCard>
            </motion.div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default Contact;
