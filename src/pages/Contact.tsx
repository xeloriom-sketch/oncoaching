import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import { usePageContent } from "@/hooks/usePageContent";
import { useTilt } from "@/hooks/useTilt";
import { supabase } from "@/lib/supabase";
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
import { MapPin, Phone, Mail, ChevronDown, ArrowUpRight, Check, MessageSquare, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import { format, addMonths } from "date-fns";
import "react-day-picker/dist/style.css";
import { useToast } from "@/hooks/use-toast";
import type { ContactContent } from "@/types";

const WORDS = ["Parlons", "de", "votre", "projet."];

// Available booking days: Mon=1, Tue=2, Fri=5, Sat=6
const OPEN_DAYS = new Set([1, 2, 5, 6]);

function MiniCalendar({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = value ? new Date(value + "T12:00:00") : undefined;

  const isUnavailable = (date: Date) => {
    if (date < today) return true;
    return !OPEN_DAYS.has(date.getDay());
  };

  return (
    <div
      className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden max-w-full transition-all duration-200 hover:border-gray-300 rdp-wrapper"
      style={{ "--rdp-accent-color": "#C4903E", "--rdp-background-color": "rgba(196,144,62,0.08)" } as React.CSSProperties}
    >
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => date && onChange(format(date, "yyyy-MM-dd"))}
        locale={fr}
        disabled={isUnavailable}
        fromDate={today}
        toDate={addMonths(today, 3)}
        showOutsideDays={false}
        components={{
          IconLeft:  () => <ChevronLeft  className="w-4 h-4" strokeWidth={2.5} />,
          IconRight: () => <ChevronRight className="w-4 h-4" strokeWidth={2.5} />,
        }}
      />
      {selected && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-[#C4903E]/5">
          <p className="text-[12px] font-semibold text-[#C4903E] capitalize text-center">
            {format(selected, "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>
      )}
      <style>{`
        .rdp-wrapper .rdp { margin: 0; padding: 12px 16px; width: 100%; font-family: inherit; }
        .rdp-wrapper .rdp-months { width: 100%; }
        .rdp-wrapper .rdp-month { width: 100%; margin: 0 !important; }
        .rdp-wrapper .rdp-caption { margin-bottom: 8px; }
        .rdp-wrapper .rdp-caption_label { font-size: 14px; font-weight: 700; text-transform: capitalize; }
        .rdp-wrapper .rdp-table { width: 100% !important; max-width: 100% !important; table-layout: fixed; }
        .rdp-wrapper .rdp-head_cell { font-size: 11px; font-weight: 600; color: #9ca3af; text-align: center; padding: 4px 0; }
        .rdp-wrapper .rdp-cell { text-align: center; padding: 2px 0; }
        .rdp-wrapper .rdp-day { border-radius: 50%; font-size: 13px; font-weight: 500; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; }
        .rdp-wrapper .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background: rgba(196,144,62,0.08); color: #C4903E; }
        .rdp-wrapper .rdp-day_selected, .rdp-wrapper .rdp-day_selected:hover { background: #C4903E !important; color: white !important; box-shadow: 0 4px 12px rgba(196,144,62,0.35); }
        .rdp-wrapper .rdp-day_today:not(.rdp-day_selected) { border: 1.5px solid #C4903E; color: #C4903E; }
        .rdp-wrapper .rdp-button[disabled]:not(.rdp-day_selected) { opacity: 1 !important; color: #d1d5db !important; }
        .rdp-wrapper .rdp-nav_button { border-radius: 8px; color: #6b7280; }
        .rdp-wrapper .rdp-nav_button:hover { background: #f3f4f6; }
      `}</style>
    </div>
  );
}

function TimePicker({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 pl-0.5">Créneau préféré</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map(({ value: v, label }) => {
          const active = value === v;
          return (
            <button
              key={v} type="button" onClick={() => onChange(v)}
              className={`flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl border-2 transition-all duration-200 group ${
                active
                  ? "border-[#C4903E] bg-[#C4903E]/5 shadow-[0_0_0_3px_rgba(196,144,62,0.12)]"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className={`font-semibold text-[13px] transition-colors ${active ? "text-[#C4903E]" : "text-[#1C3A52]"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FloatingField({
  id, label, type = "text", name, value, onChange, required = false, autoComplete,
}: {
  id: string; label: string; type?: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const isDate = type === "date";
  const active = focused || value.length > 0 || isDate;

  return (
    <div className="relative">
      <input
        id={id} name={name} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        required={required} autoComplete={autoComplete}
        className="peer w-full bg-white border-2 border-gray-200 rounded-2xl px-4 pt-6 pb-2 text-base text-[#1C3A52] outline-none transition-all duration-200 focus:border-[#C4903E] focus:shadow-[0_0_0_4px_rgba(196,144,62,0.12)]"
        style={isDate ? { colorScheme: "light" } : {}}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 transition-all duration-200 origin-left"
        style={{
          top: active ? "8px" : "50%",
          transform: active ? "translateY(0) scale(0.75)" : "translateY(-50%) scale(1)",
          color: focused ? "#C4903E" : "#9ca3af",
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
        className="peer w-full bg-white border-2 border-gray-200 rounded-2xl px-4 pt-7 pb-3 text-base text-[#1C3A52] outline-none resize-none transition-all duration-200 focus:border-[#C4903E] focus:shadow-[0_0_0_4px_rgba(196,144,62,0.12)]"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-4 transition-all duration-200 origin-left"
        style={{
          transform: active ? "translateY(-6px) scale(0.75)" : "translateY(0) scale(1)",
          color: focused ? "#C4903E" : "#9ca3af",
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
      const { error: insertError } = await supabase.from("submissions").insert({
        type:            formType,
        name:            formData.name,
        email:           formData.email,
        phone:           formData.phone || null,
        service:         formData.service || null,
        subject:         formData.subject || null,
        message:         formData.message || null,
        preferred_date:  formData.preferredDate || null,
        preferred_time:  formData.preferredTime || null,
        preferred_date2: null,
        preferred_time2: null,
        session_format:  null,
        note:            null,
      });
      if (insertError) throw new Error(insertError.message || msgs.errorDefault);
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
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]">
          <div className="w-8 h-8 border-2 border-[#C4903E] border-t-transparent rounded-full animate-spin" />
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
        title="Contact & Rendez-vous — Coach certifié à Mâcon (71) | 1er RDV Gratuit"
        description="Contactez ON Coaching à Mâcon, Sancé (71). 1re consultation gratuite, réponse sous 24h. Présentiel ou visio. Coach certifié. Tél : 06 63 04 18 12."
        canonical="/contact"
        keywords="contact coach mâcon, prendre rendez-vous coaching mâcon, consultation coaching offerte sancé, coach sancé téléphone, coaching visio mâcon, coach certifié saône-et-loire"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "@id": "https://www.oncoaching.fr/contact#webpage",
            name: "Contact & Rendez-vous | ON Coaching Mâcon",
            url: "https://www.oncoaching.fr/contact",
            isPartOf: { "@id": "https://www.oncoaching.fr/#website" },
            about: { "@id": "https://www.oncoaching.fr/#business" },
            description: "Contactez ON Coaching à Mâcon (Sancé, 71). 1er rendez-vous gratuit, réponse sous 24h. Coach certifié Noureddine Omar.",
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://www.oncoaching.fr/#business",
            name: "ON Coaching",
            alternateName: "ON Coaching Mâcon",
            telephone: "+33663041812",
            email: "contact@oncoaching.fr",
            url: "https://www.oncoaching.fr",
            address: {
              "@type": "PostalAddress",
              streetAddress: "14 rue des écureuils",
              addressLocality: "Sancé",
              postalCode: "71000",
              addressRegion: "Saône-et-Loire",
              addressCountry: "FR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "46.3077",
              longitude: "4.8288",
            },
            openingHoursSpecification: [
              { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday"],   opens: "14:00", closes: "19:00" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday"],  opens: "08:00", closes: "12:00" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday"],   opens: "08:00", closes: "19:00" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "08:00", closes: "13:00" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Est-ce que le 1er rendez-vous est vraiment gratuit ?",
                acceptedAnswer: { "@type": "Answer", text: "Oui, absolument. Le premier rendez-vous est offert, sans engagement de votre part. C'est l'occasion d'échanger sur vos besoins et de voir si nous sommes faits pour travailler ensemble." }
              },
              {
                "@type": "Question",
                name: "Comment se déroule une séance de coaching à Mâcon ?",
                acceptedAnswer: { "@type": "Answer", text: "Chaque séance dure entre 45 minutes et 1 heure, en présentiel dans notre cabinet à Sancé (Mâcon, 71) ou à distance en visioconférence, selon votre préférence." }
              },
              {
                "@type": "Question",
                name: "Combien de séances sont nécessaires ?",
                acceptedAnswer: { "@type": "Answer", text: "En général, 6 à 10 séances permettent d'atteindre des résultats concrets. Nous définissons ensemble le parcours adapté à votre rythme et vos objectifs." }
              },
              {
                "@type": "Question",
                name: "Proposez-vous des forfaits ou des tarifs spéciaux ?",
                acceptedAnswer: { "@type": "Answer", text: "Oui, nous proposons des forfaits séances qui offrent une réduction par rapport au tarif à l'unité. Consultez notre page Tarifs ou demandez-nous directement lors du 1er RDV." }
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.oncoaching.fr/" },
              { "@type": "ListItem", position: 2, name: "Contact & Rendez-vous", item: "https://www.oncoaching.fr/contact" },
            ],
          },
        ]}
      />

      <div className="w-full bg-[#FBFBFB]">

        {/* ── HERO ───────────────────────────────────────────────── */}
        <section className="pt-20 pb-6 sm:pt-24 sm:pb-8 md:pt-28 max-w-7xl mx-auto px-5 md:px-12">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-start gap-6">
            <motion.div variants={blurInUp} className="flex items-center gap-2">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-[#C4903E]"
                animate={pulseDot.animate}
                transition={pulseDot.transition}
              />
              <span className="text-[13px] font-semibold tracking-widest uppercase text-[#C4903E]">
                Réponse sous 24h
              </span>
            </motion.div>

            <h1
              aria-label="Parlons de votre projet."
              className="leading-[1.1] font-bold tracking-tight text-[#1C3A52]"
              style={{ fontSize: "clamp(2rem,8vw,4rem)" }}
            >
              {WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.08 }}
                  className={`inline-block mr-[0.22em] ${word === "projet." ? "text-[#C4903E]" : ""}`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p variants={blurInUp} className="text-[15px] sm:text-[17px] text-gray-500 leading-relaxed max-w-xl">
              {coordonnees.subtitle}
            </motion.p>
          </motion.div>
        </section>

        {/* ── GRID CONTACT ────────────────────────────────────────── */}
        <section className="py-0 pb-10 md:pb-16 lg:pb-28 max-w-7xl mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">

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
                        ? "bg-white text-[#1C3A52] shadow-sm"
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
                        ? "bg-[#C4903E] text-white shadow-sm"
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
                <h2 className="text-[1.65rem] font-bold text-[#1C3A52] leading-snug tracking-tight">
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

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-col gap-4 sm:gap-5">
                  {/* Nom / Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <FloatingField id="name" label="Nom complet" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" />
                    <FloatingField id="email" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
                  </div>

                  {/* Téléphone / Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <FloatingField id="phone" label="Téléphone" type="tel" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" />
                    <div className="relative">
                      <select
                        id="service" name="service" value={formData.service} onChange={handleChange}
                        className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 pt-6 pb-2 text-base text-[#1C3A52] outline-none transition-all duration-200 focus:border-[#C4903E] focus:shadow-[0_0_0_4px_rgba(196,144,62,0.12)] appearance-none cursor-pointer"
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
                  </div>

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
                        <div>
                          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 pl-0.5">Date souhaitée *</p>
                          <MiniCalendar
                            value={formData.preferredDate}
                            onChange={(d) => setFormData(prev => ({ ...prev, preferredDate: d }))}
                          />
                        </div>

                        <TimePicker
                          value={formData.preferredTime}
                          onChange={(v) => setFormData(prev => ({ ...prev, preferredTime: v }))}
                          options={content.timeOptions ?? []}
                        />

                        <FloatingTextarea
                          id="rdv-message" label="Un mot sur votre besoin (optionnel)"
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
                        <FloatingField id="subject" label="Sujet" name="subject" value={formData.subject} onChange={handleChange} required />
                        <FloatingTextarea id="contact-message" label="Votre message" name="message" value={formData.message} onChange={handleChange} required />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    {...btnHoverProps}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold text-[15px] py-4 px-8 rounded-2xl transition-opacity disabled:opacity-50 min-h-[52px] sm:min-h-[56px] ${
                      isRdv
                        ? "bg-[#C4903E] shadow-[0_8px_32px_rgba(196,144,62,0.35)]"
                        : "bg-[#1C3A52] shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
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

                  <p className="text-gray-400 text-[13px] text-center flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#C4903E]" strokeWidth={3} />
                    {isRdv ? "Confirmation sous 24h · 1er RDV offert" : "Consultation initiale gratuite · Sans engagement"}
                  </p>
                </div>
              </form>
            </motion.div>

            {/* ── DROITE : Carte dark ──────────────────────────── */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={VP} variants={springRight}
              className="flex flex-col lg:self-start lg:sticky lg:top-28"
            >
              <SpotlightCard
                className="bg-[#1C3A52] rounded-[32px] p-5 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8"
                spotlightColor="rgba(196,144,62,0.15)"
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
                      <div className="w-11 h-11 rounded-xl bg-[#C4903E]/10 border border-[#C4903E]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C4903E]/20 transition-colors">
                        <MapPin className="w-5 h-5 text-[#C4903E]" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono tracking-widest uppercase text-white/30 mb-0.5">{coordonnees.adresse.label}</p>
                        <p className="text-white font-semibold text-[15px] leading-snug whitespace-pre-line group-hover:text-[#C4903E] transition-colors">
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
                      <div className="w-11 h-11 rounded-xl bg-[#C4903E]/10 border border-[#C4903E]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C4903E]/20 transition-colors">
                        <Phone className="w-5 h-5 text-[#C4903E]" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono tracking-widest uppercase text-white/30 mb-0.5">{coordonnees.telephone.label}</p>
                        <p className="text-white font-semibold text-[15px] group-hover:text-[#C4903E] transition-colors">
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
                      <div className="w-11 h-11 rounded-xl bg-[#C4903E]/10 border border-[#C4903E]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C4903E]/20 transition-colors">
                        <Mail className="w-5 h-5 text-[#C4903E]" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono tracking-widest uppercase text-white/30 mb-0.5">{coordonnees.email.label}</p>
                        <p className="text-white font-semibold text-[15px] break-all group-hover:text-[#C4903E] transition-colors">
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
                      className="flex items-center gap-3 bg-[#C4903E]/10 border border-[#C4903E]/20 rounded-2xl px-5 py-4 w-fit"
                      whileHover={{ scale: 1.04, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                    >
                      <motion.div
                        className="w-3 h-3 rounded-full bg-[#C4903E]"
                        animate={pulseDot.animate}
                        transition={pulseDot.transition}
                      />
                      <span className="text-[#C4903E] font-bold text-[14px]">1er RDV offert</span>
                      <span className="text-white/40 text-[13px]">· Sans engagement</span>
                    </motion.div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="py-10 md:py-16 lg:py-28 bg-[#F3F4F6]">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div
              initial="hidden" whileInView="visible" viewport={VP} variants={stagger}
              className="max-w-3xl mx-auto"
            >
              <motion.p variants={blurInUp} className="text-[12px] font-mono tracking-widest uppercase text-[#C4903E] mb-3 text-center">
                Questions fréquentes
              </motion.p>
              <motion.h2
                variants={blurInUp}
                className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[#1C3A52] text-center mb-8 md:mb-12 leading-tight tracking-tight"
              >
                Vous avez des questions ?
              </motion.h2>

              <motion.div variants={stagger} className="flex flex-col gap-3">
                {(content.faq ?? []).map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-5 text-left group min-h-[44px]"
                      aria-expanded={openFaq === i}
                    >
                      <span className="font-semibold text-[15px] text-[#1C3A52] group-hover:text-[#C4903E] transition-colors leading-snug pr-2">
                        {item.q}
                      </span>
                      <motion.div
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F3F4F6] group-hover:bg-[#C4903E]/10 flex items-center justify-center transition-colors"
                      >
                        <ChevronDown className={`w-4 h-4 transition-colors ${openFaq === i ? "text-[#C4903E]" : "text-gray-400"}`} strokeWidth={2.5} />
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
                          <p className="px-4 sm:px-6 pb-5 text-[14px] sm:text-[15px] text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
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
        <section className="py-10 md:py-16 lg:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-12">
            <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeInUp}>
              <SpotlightCard
                className="bg-[#1C3A52] rounded-[40px] py-12 md:py-20 px-6 sm:px-8 md:px-16 text-center"
                spotlightColor="rgba(196,144,62,0.18)"
              >
                <motion.p variants={blurInUp} initial="hidden" whileInView="visible" viewport={VP}
                  className="text-[12px] font-mono tracking-widest uppercase text-[#C4903E] mb-4"
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
                  <span className="text-[#C4903E]">ne coûte rien.</span>
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
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C4903E] text-white font-bold text-[15px] px-8 py-4 rounded-2xl shadow-[0_8px_40px_rgba(196,144,62,0.4)] cursor-pointer min-h-[52px]"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler maintenant
                  </motion.a>
                  <motion.a
                    href={`mailto:${coordonnees.email.value}`} {...liftHoverProps}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white/60 hover:text-white font-semibold text-[15px] px-6 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer min-h-[52px]"
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
