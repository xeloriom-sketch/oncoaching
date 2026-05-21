import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Clock, Mail, MapPin, Phone, ArrowUpRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePageContent } from "@/hooks/usePageContent";
import { fadeInUp, stagger, VP } from "@/lib/motion";
import type { ContactContent } from "@/types";

const inputCls =
  "w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-[13px] focus:outline-none focus:border-[#1ab5c7]/40 transition-colors";

const Contact = () => {
  const { toast }   = useToast();
  const { content, loading } = usePageContent<ContactContent>("contact");

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "", service: "coaching-de-vie",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setIsSubmitting(true);
    const msgs = content.formulaire.messages;
    try {
      const response = await fetch("/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || msgs.errorDefault);
      }
      toast({ title: msgs.successTitle, description: msgs.successDescription, duration: 5000 });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", service: "coaching-de-vie" });
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
        <div className="min-h-screen flex items-center justify-center bg-white" aria-label="Chargement…">
          <div className="w-8 h-8 border-2 border-[#1ab5c7] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const { coordonnees, formulaire } = content;
  const fields = formulaire.fields;

  return (
    <Layout>
      <SEO
        title="Contactez-nous — Prendre Rendez-vous"
        description="Contactez ON Coaching : 14 rue des écureuils, 71000 Sancé. Tél : 06 63 04 18 12. Premier rendez-vous offert, sans engagement."
        canonical="/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type":    "ContactPage",
          "name":     "Contact | ON Coaching",
          "url":      "https://www.oncoaching.fr/contact",
        }}
      />

      <div className="w-full bg-white min-h-screen px-4 py-6 md:px-12 md:py-8 space-y-6">

        {/* ── HERO ────────────────────────────────── */}
        <motion.section
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2"
          aria-labelledby="contact-h1"
        >
          <motion.div variants={fadeInUp} className="lg:col-span-8">
            <p className="text-[11px] font-mono tracking-widest uppercase text-gray-400 mb-4" aria-hidden="true">
              ↳ Contactez-nous
            </p>
            <h1 id="contact-h1" className="text-[clamp(2.2rem,6vw,5rem)] font-semibold leading-[0.95] tracking-tight text-[#0B0B0C]">
              Commençons<br />
              <span style={{ color: "#1ab5c7", WebkitTextStroke: "1px #0B0B0C" }}>votre parcours.</span>
            </h1>
          </motion.div>
          <motion.div variants={fadeInUp} className="lg:col-span-4 flex flex-col justify-end gap-3">
            <p className="text-[14px] text-gray-500 leading-relaxed">{coordonnees.subtitle}</p>
            <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-full px-4 py-2 w-fit">
              <div className="w-2 h-2 rounded-full bg-[#1ab5c7] animate-pulse" aria-hidden="true" />
              <span className="text-[12px] font-bold text-[#0B0B0C]">1er RDV offert</span>
            </div>
          </motion.div>
        </motion.section>

        {/* ── MAIN: info + form ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Left: coordonnées */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={VP} variants={stagger}
            className="flex flex-col gap-4"
            aria-label="Coordonnées"
          >
            {/* Adresse */}
            <motion.div variants={fadeInUp} className="bg-[#0B0B0C] rounded-[28px] p-7 flex items-start gap-5">
              <div className="w-10 h-10 rounded-xl bg-[#1ab5c7] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <MapPin className="w-5 h-5 text-[#0B0B0C]" strokeWidth={2} />
              </div>
              <address className="not-italic">
                <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-1">{coordonnees.adresse.label}</p>
                <p className="text-white font-semibold text-[15px] whitespace-pre-line leading-snug">{coordonnees.adresse.value}</p>
              </address>
            </motion.div>

            {/* Téléphone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={fadeInUp} className="bg-[#F3F4F6] rounded-[28px] p-6 flex flex-col gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0B0B0C] flex items-center justify-center" aria-hidden="true">
                  <Phone className="w-4 h-4 text-[#1ab5c7]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-1">{coordonnees.telephone.label}</p>
                  <a
                    href={`tel:${coordonnees.telephone.value.replace(/\s/g, "")}`}
                    className="font-bold text-[#0B0B0C] text-[14px] hover:text-[#1ab5c7] transition-colors"
                  >
                    {coordonnees.telephone.value}
                  </a>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-[#F3F4F6] rounded-[28px] p-6 flex flex-col gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0B0B0C] flex items-center justify-center" aria-hidden="true">
                  <Mail className="w-4 h-4 text-[#1ab5c7]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-1">{coordonnees.email.label}</p>
                  <a
                    href={`mailto:${coordonnees.email.value}`}
                    className="font-bold text-[#0B0B0C] text-[13px] break-all hover:text-[#1ab5c7] transition-colors"
                  >
                    {coordonnees.email.value}
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Horaires */}
            <motion.div variants={fadeInUp} className="bg-[#F3F4F6] rounded-[28px] p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-[#0B0B0C] flex items-center justify-center" aria-hidden="true">
                  <Clock className="w-4 h-4 text-[#1ab5c7]" strokeWidth={2} />
                </div>
                <p className="font-bold text-[#0B0B0C] text-[14px]">{coordonnees.horaires.label}</p>
              </div>
              <ul className="space-y-2">
                {coordonnees.horaires.lines.map((line, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px]">
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${line.includes("Fermé") ? "bg-gray-300" : "bg-[#1ab5c7]"}`}
                      aria-hidden="true"
                    />
                    <span className={line.includes("Fermé") ? "text-gray-300" : "text-gray-600"}>{line}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Right: formulaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={VP} transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#0B0B0C] rounded-[32px] p-7 md:p-10 relative overflow-hidden"
            id="form"
          >
            <p className="text-[10px] font-mono tracking-widest uppercase text-white/30 mb-2" aria-hidden="true">
              {formulaire.title}
            </p>
            <h2 className="font-bold text-white text-[1.3rem] tracking-tight mb-8 leading-snug">
              {formulaire.subtitle}
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Nom + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1.5">
                    {fields.name} *
                  </label>
                  <input
                    type="text" id="name" name="name"
                    required autoComplete="name"
                    value={formData.name} onChange={handleChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1.5">
                    {fields.email} *
                  </label>
                  <input
                    type="email" id="email" name="email"
                    required autoComplete="email"
                    value={formData.email} onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Téléphone + Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone" className="block text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1.5">
                    {fields.phone}
                  </label>
                  <input
                    type="tel" id="phone" name="phone"
                    autoComplete="tel"
                    value={formData.phone} onChange={handleChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1.5">
                    {fields.service}
                  </label>
                  <select
                    id="service" name="service"
                    value={formData.service} onChange={handleChange}
                    className={inputCls}
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    {formulaire.services.map(s => (
                      <option key={s.value} value={s.value} style={{ background: "#1a1a1a", color: "#fff" }}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sujet */}
              <div>
                <label htmlFor="subject" className="block text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1.5">
                  {fields.subject} *
                </label>
                <input
                  type="text" id="subject" name="subject"
                  required
                  value={formData.subject} onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1.5">
                  {fields.message} *
                </label>
                <textarea
                  id="message" name="message"
                  rows={4} required
                  value={formData.message} onChange={handleChange}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-[#1ab5c7] text-white font-bold text-[14px] py-4 rounded-2xl transition-opacity disabled:opacity-50 min-h-[52px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B0B0C] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    Envoi…
                  </>
                ) : (
                  <>{fields.submitButton} <ArrowUpRight className="w-4 h-4" aria-hidden="true" /></>
                )}
              </motion.button>

              <p className="text-white/20 text-[11px] text-center flex items-center justify-center gap-1.5">
                <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
                Consultation initiale gratuite · Sans engagement
              </p>
            </form>
          </motion.div>
        </div>

      </div>
    </Layout>
  );
};

export default Contact;
