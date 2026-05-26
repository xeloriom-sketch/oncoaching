export interface FieldDef {
  key: string;
  label: string;
  section: string;
  hint?: string;
  type: "short" | "long" | "url" | "readonly";
}

export interface PageDef {
  key: string;
  label: string;
  route: string;
  icon: string;
  fields: FieldDef[];
}

const coachingServiceFields: FieldDef[] = [
  { key: "page.title",        label: "Titre de la page",       section: "En-tête",          type: "short" },
  { key: "page.subtitle",     label: "Sous-titre",             section: "En-tête",          type: "long"  },
  { key: "page.intro",        label: "Texte d'introduction",   section: "En-tête",          type: "long"  },
  { key: "tabs.0.label",      label: "Onglet 1 — Label",       section: "Onglets",          type: "short" },
  { key: "tabs.0.tagline",    label: "Onglet 1 — Accroche",    section: "Onglets",          type: "short" },
  { key: "cta.title",         label: "Titre CTA",              section: "Appel à l'action", type: "short" },
  { key: "cta.subtitle",      label: "Sous-titre CTA",         section: "Appel à l'action", type: "long"  },
  { key: "cta.buttonText",    label: "Texte bouton",           section: "Appel à l'action", type: "short" },
];

export const PAGES: PageDef[] = [
  {
    key: "index",
    label: "Page d'accueil",
    route: "/",
    icon: "Home",
    fields: [
      { key: "hero.title",                        label: "Titre héro",                         section: "Bandeau héro",              hint: "Grand titre animé — première chose visible", type: "short" },
      { key: "hero.subtitle",                     label: "Sous-titre héro",                    section: "Bandeau héro",              hint: "Texte descriptif sous le titre",              type: "long"  },
      { key: "hero.buttonPrimary",                label: "Bouton CTA doré",                    section: "Bandeau héro",              hint: "Bouton \"Prendre rendez-vous\"",              type: "short" },
      { key: "hero.buttonSecondary",              label: "Lien secondaire",                    section: "Bandeau héro",              hint: "Lien \"Notre approche\"",                     type: "short" },
      { key: "servicesSection.title",             label: "Titre section Services",             section: "Section Services",          type: "short" },
      { key: "servicesSection.subtitle",          label: "Sous-titre section Services",        section: "Section Services",          type: "long"  },
      { key: "services.0.title",                  label: "Coaching scolaire — Titre carte",    section: "Section Services",          type: "short" },
      { key: "services.0.description",            label: "Coaching scolaire — Description",   section: "Section Services",          type: "long"  },
      { key: "services.1.title",                  label: "Coaching jeunes — Titre carte",      section: "Section Services",          type: "short" },
      { key: "services.1.description",            label: "Coaching jeunes — Description",      section: "Section Services",          type: "long"  },
      { key: "services.2.title",                  label: "Neurofeedback — Titre carte",        section: "Section Services",          type: "short" },
      { key: "services.2.description",            label: "Neurofeedback — Description",        section: "Section Services",          type: "long"  },
      { key: "services.3.title",                  label: "Coaching équipe — Titre carte",      section: "Section Services",          type: "short" },
      { key: "services.3.description",            label: "Coaching équipe — Description",      section: "Section Services",          type: "long"  },
      { key: "whyUsSection.title",                label: "Titre section Pourquoi nous",        section: "Section Pourquoi ON Coaching", type: "short" },
      { key: "whyUsSection.subtitle",             label: "Sous-titre Pourquoi",                section: "Section Pourquoi ON Coaching", type: "long"  },
      { key: "whyUsSection.items.0.title",        label: "Avantage 1 — Titre",                 section: "Section Pourquoi ON Coaching", type: "short" },
      { key: "whyUsSection.items.0.description",  label: "Avantage 1 — Description",           section: "Section Pourquoi ON Coaching", type: "long"  },
      { key: "whyUsSection.items.1.title",        label: "Avantage 2 — Titre",                 section: "Section Pourquoi ON Coaching", type: "short" },
      { key: "whyUsSection.items.1.description",  label: "Avantage 2 — Description",           section: "Section Pourquoi ON Coaching", type: "long"  },
      { key: "whyUsSection.items.2.title",        label: "Avantage 3 — Titre",                 section: "Section Pourquoi ON Coaching", type: "short" },
      { key: "whyUsSection.items.2.description",  label: "Avantage 3 — Description",           section: "Section Pourquoi ON Coaching", type: "long"  },
      { key: "cta.title",                         label: "Titre CTA bas de page",              section: "Appel à l'action",          type: "short" },
      { key: "cta.subtitle",                      label: "Sous-titre CTA",                     section: "Appel à l'action",          type: "long"  },
      { key: "cta.buttonText",                    label: "Texte bouton CTA",                   section: "Appel à l'action",          type: "short" },
    ],
  },
  {
    key: "about",
    label: "À Propos",
    route: "/about",
    icon: "User",
    fields: [
      { key: "hero.title",                         label: "Titre héro",                  section: "Bandeau héro",        type: "short" },
      { key: "hero.paragraph1",                    label: "Paragraphe intro 1",          section: "Bandeau héro",        type: "long"  },
      { key: "whoSection.title",                   label: "Titre \"Qui suis-je\"",       section: "Section Qui suis-je", type: "short" },
      { key: "whoSection.subtitle",                label: "Sous-titre",                  section: "Section Qui suis-je", type: "long"  },
      { key: "whoSection.paragraph1",              label: "Paragraphe 1 — Bio",          section: "Section Qui suis-je", type: "long"  },
      { key: "whoSection.paragraph2",              label: "Paragraphe 2 — Parcours",     section: "Section Qui suis-je", type: "long"  },
      { key: "whoSection.differenceTitle",         label: "Titre \"Ma différence\"",     section: "Section Qui suis-je", type: "short" },
      { key: "whoSection.paragraph3",              label: "Paragraphe 3 — Différence",   section: "Section Qui suis-je", type: "long"  },
      { key: "whoSection.paragraph4",              label: "Paragraphe 4 — Engagement",   section: "Section Qui suis-je", type: "long"  },
      { key: "valuesSection.title",                label: "Titre section Valeurs",       section: "Section Valeurs",     type: "short" },
      { key: "valuesSection.subtitle",             label: "Sous-titre Valeurs",          section: "Section Valeurs",     type: "long"  },
      { key: "valuesSection.values.0.title",       label: "Valeur 1 — Titre",            section: "Section Valeurs",     type: "short" },
      { key: "valuesSection.values.0.description", label: "Valeur 1 — Description",      section: "Section Valeurs",     type: "long"  },
      { key: "valuesSection.values.1.title",       label: "Valeur 2 — Titre",            section: "Section Valeurs",     type: "short" },
      { key: "valuesSection.values.1.description", label: "Valeur 2 — Description",      section: "Section Valeurs",     type: "long"  },
      { key: "valuesSection.values.2.title",       label: "Valeur 3 — Titre",            section: "Section Valeurs",     type: "short" },
      { key: "valuesSection.values.2.description", label: "Valeur 3 — Description",      section: "Section Valeurs",     type: "long"  },
      { key: "cta.title",                          label: "Titre CTA",                   section: "Appel à l'action",    type: "short" },
      { key: "cta.subtitle",                       label: "Sous-titre CTA",              section: "Appel à l'action",    type: "long"  },
      { key: "cta.buttonText",                     label: "Texte bouton",                section: "Appel à l'action",    type: "short" },
    ],
  },
  {
    key: "coaching-scolaire",
    label: "Coaching Scolaire",
    route: "/coaching-scolaire",
    icon: "GraduationCap",
    fields: coachingServiceFields,
  },
  {
    key: "coaching-jeunes",
    label: "Coaching Jeunes",
    route: "/coaching-jeunes",
    icon: "Zap",
    fields: coachingServiceFields,
  },
  {
    key: "coaching-neurofeedback",
    label: "Coaching Neurofeedback",
    route: "/coaching-neurofeedback",
    icon: "Brain",
    fields: coachingServiceFields,
  },
  {
    key: "coaching-equipe",
    label: "Coaching Équipe",
    route: "/coaching-equipe",
    icon: "Users",
    fields: coachingServiceFields,
  },
  {
    key: "nos-tarifs",
    label: "Nos Tarifs",
    route: "/nos-tarifs",
    icon: "CreditCard",
    fields: [
      { key: "particuliers.title",          label: "Titre section Particuliers",   section: "Particuliers",     type: "short" },
      { key: "particuliers.subtitle",       label: "Sous-titre Particuliers",      section: "Particuliers",     type: "long"  },
      { key: "particuliers.cards.0.title",  label: "Forfait 1 — Titre",            section: "Particuliers",     type: "short" },
      { key: "particuliers.cards.1.title",  label: "Forfait 2 — Titre",            section: "Particuliers",     type: "short" },
      { key: "particuliers.cards.2.title",  label: "Forfait 3 — Titre",            section: "Particuliers",     type: "short" },
      { key: "entreprises.title",           label: "Titre section Entreprises",    section: "Entreprises",      type: "short" },
      { key: "entreprises.subtitle",        label: "Sous-titre Entreprises",       section: "Entreprises",      type: "long"  },
      { key: "neurofeedback.title",         label: "Titre section Neurofeedback",  section: "Neurofeedback",    type: "short" },
      { key: "neurofeedback.subtitle",      label: "Sous-titre Neurofeedback",     section: "Neurofeedback",    type: "long"  },
      { key: "cta.title",                   label: "Titre CTA",                    section: "Appel à l'action", type: "short" },
      { key: "cta.buttonText",              label: "Texte bouton",                 section: "Appel à l'action", type: "short" },
    ],
  },
  {
    key: "partenaires",
    label: "Partenaires",
    route: "/partenaires",
    icon: "Building2",
    fields: [
      { key: "page.title",      label: "Titre de la page",  section: "En-tête",          type: "short" },
      { key: "page.subtitle",   label: "Sous-titre",        section: "En-tête",          type: "long"  },
      { key: "cta.title",       label: "Titre CTA",         section: "Appel à l'action", type: "short" },
      { key: "cta.buttonText",  label: "Texte bouton",      section: "Appel à l'action", type: "short" },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    route: "/contact",
    icon: "MessageSquare",
    fields: [
      { key: "coordonnees.subtitle",        label: "Sous-titre coordonnées",  section: "Coordonnées", type: "short" },
      { key: "coordonnees.adresse.value",   label: "Adresse",                 section: "Coordonnées", type: "short" },
      { key: "coordonnees.telephone.value", label: "Téléphone",               section: "Coordonnées", type: "short" },
      { key: "coordonnees.email.value",     label: "Email de contact",        section: "Coordonnées", type: "short" },
      { key: "formulaire.title",            label: "Titre formulaire",        section: "Formulaire",  type: "short" },
      { key: "formulaire.subtitle",         label: "Sous-titre formulaire",   section: "Formulaire",  type: "long"  },
    ],
  },
];

export const getPageDef = (key: string): PageDef | undefined =>
  PAGES.find((p) => p.key === key);
