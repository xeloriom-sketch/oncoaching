export const SITE = {
  name:        "ON Coaching",
  url:         "https://www.oncoaching.fr",
  locale:      "fr_FR",
  twitter:     "@oncoaching_",
  description: "Coaching certifié ICF à Mâcon. Coaching scolaire, jeunes adultes, neurofeedback et coaching d'équipe. Premier rendez-vous offert, sans engagement.",
  phone:       "+33663041812",
  email:       "contact@oncoaching.fr",
  address:     "14 rue des écureuils, 71000 Sancé",
  city:        "Sancé (Mâcon), Bourgogne",
} as const;

export const ROUTES = {
  home:           "/",
  about:          "/about",
  media:          "/presse-medias",
  tarifs:         "/nos-tarifs",
  contact:        "/contact",
  partenaires:    "/partenaires",
  scolaire:       "/coaching-scolaire",
  jeunes:         "/coaching-jeunes",
  neurofeedback:  "/coaching-neurofeedback",
  equipe:         "/coaching-equipe",
} as const;

export const NAV_LINKS = [
  { label: "Accueil",    href: ROUTES.home   },
  { label: "À Propos",  href: ROUTES.about   },
  { label: "Presse",    href: ROUTES.media   },
  { label: "Nos Tarifs", href: ROUTES.tarifs  },
] as const;

export const SERVICES = [
  { label: "Coaching scolaire & étudiant",    href: ROUTES.scolaire      },
  { label: "Coaching jeunes & jeunes adultes", href: ROUTES.jeunes        },
  { label: "Coaching & Neurofeedback",         href: ROUTES.neurofeedback },
  { label: "Coaching d'équipe",               href: ROUTES.equipe        },
  { label: "Partenaires & Institutions",      href: ROUTES.partenaires   },
] as const;

export const SOCIAL = [
  { platform: "Facebook",  href: "https://www.facebook.com/profile.php?id=100050783821185" },
  { platform: "Instagram", href: "https://www.instagram.com/oncoaching_" },
] as const;

/** Tailwind-unsafe dynamic color configs for 3-card pattern */
export const CARD_CONFIGS = [
  { bg: "#0B0B0C", text: "text-white",     sub: "text-white/50",  iconBg: "bg-[#1ab5c7]", iconColor: "text-white",     itemColor: "text-white/60", checkColor: "text-[#1ab5c7]" },
  { bg: "#1ab5c7", text: "text-white",     sub: "text-white/70",  iconBg: "bg-white",      iconColor: "text-[#1ab5c7]", itemColor: "text-white/80", checkColor: "text-white"     },
  { bg: "#F3F4F6", text: "text-[#0B0B0C]", sub: "text-gray-500",  iconBg: "bg-[#0B0B0C]", iconColor: "text-[#1ab5c7]", itemColor: "text-gray-600", checkColor: "text-[#0B0B0C]" },
] as const;
