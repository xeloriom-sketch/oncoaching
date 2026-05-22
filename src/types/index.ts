// ─── Content Types ────────────────────────────────────────────────────────────

export interface PageMeta {
  title: string;
  subtitle: string;
  intro?: string;
}

export interface Tab {
  key: string;
  label: string;
  tagline?: string;
  paragraphs?: string[];
  paragraph?: string;
  items?: string[];
  steps?: string[];
  quote?: string;
  note?: string;
}

export interface CTA {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

// ─── Service Pages ─────────────────────────────────────────────────────────────

export interface ServicePageContent {
  page: PageMeta;
  tabs: Tab[];
  cta: CTA;
}

// ─── About ────────────────────────────────────────────────────────────────────

export interface HeroSection {
  title: string;
  paragraph1: string;
}

export interface WhoSection {
  title: string;
  subtitle: string;
  paragraph1: string;
  paragraph2: string;
  differenceTitle: string;
  paragraph3: string;
  paragraph4: string;
}

export interface ValueItem {
  key: string;
  title: string;
  description: string;
}

export interface ValuesSection {
  title: string;
  values: ValueItem[];
}

export interface AboutContent {
  hero: HeroSection;
  whoSection: WhoSection;
  valuesSection: ValuesSection;
  cta: CTA;
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface ContactField {
  label: string;
  value: string;
}

export interface Coordonnees {
  subtitle: string;
  adresse: ContactField;
  telephone: ContactField;
  email: ContactField;
  horaires: {
    label: string;
    lines: string[];
  };
}

export interface FormService {
  value: string;
  label: string;
}

export interface FormMessages {
  successTitle: string;
  successDescription: string;
  errorTitle: string;
  errorDefault: string;
}

export interface Formulaire {
  title: string;
  subtitle: string;
  fields: {
    name: string;
    email: string;
    phone: string;
    service: string;
    subject: string;
    message: string;
    submitButton: string;
  };
  services: FormService[];
  messages: FormMessages;
}

export interface ContactContent {
  coordonnees: Coordonnees;
  formulaire: Formulaire;
}

// ─── Tarifs ───────────────────────────────────────────────────────────────────

export interface PricingCard {
  key: string;
  title: string;
  items: string[];
  description?: string;
  note?: string;
}

export interface ParticuliersSection {
  title: string;
  subtitle: string;
  cards: PricingCard[];
}

export interface EntreprisesSection {
  title: string;
  subtitle: string;
  items: string[];
}

export interface NeurofeedbackSection {
  title: string;
  subtitle: string;
  cards: PricingCard[];
}

export interface TarifsContent {
  particuliers: ParticuliersSection;
  entreprises: EntreprisesSection;
  neurofeedback: NeurofeedbackSection;
  cta: CTA;
}

// ─── Index / Home ──────────────────────────────────────────────────────────────
export interface ServiceItem {
  key: string;
  title: string;
  description: string;
  link: string;
}

export interface WhyUsItem {
  key: string;
  title: string;
  description: string;
}

export interface WhyUsSection {
  title: string;
  subtitle: string;
  items: WhyUsItem[];
}

export interface ServicesSection {
  title: string;
  subtitle: string;
}

export interface HeroIndex {
  title: string;
  subtitle: string;
  buttonPrimary: string;
  buttonSecondary: string;
  image: string;
}

export interface IndexContent {
  hero: HeroIndex;
  servicesSection: ServicesSection;
  services: ServiceItem[];
  whyUsSection: WhyUsSection;
  cta: CTA;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export type CardConfig = {
  bg: string;
  text: string;
  sub: string;
  iconBg: string;
  iconColor: string;
  itemColor?: string;
  checkColor?: string;
};
