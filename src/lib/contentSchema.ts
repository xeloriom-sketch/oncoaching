export interface FieldDef {
  key: string;
  label: string;
  section?: string;
  hint?: string;
  type: "short" | "long" | "url" | "readonly" | "text" | "textarea" | "array" | "json";
}

export interface PageDef {
  key: string;
  label: string;
  route: string;
  icon: string;
  fields: FieldDef[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function gen(n: number, fn: (i: number) => FieldDef): FieldDef[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}

// ── Shared blocks ─────────────────────────────────────────────────────────────

const benefitFields = (count = 6): FieldDef[] => [
  { key: "benefitsLabel", label: "Label section Bénéfices",  section: "Bénéfices", type: "short" },
  { key: "benefitsTitle", label: "Titre section Bénéfices",  section: "Bénéfices", type: "short" },
  ...gen(count, i => ({ key: `benefits.${i}.title`, label: `Bénéfice ${i + 1} — Titre`, section: "Bénéfices", type: "short" as const })),
  ...gen(count, i => ({ key: `benefits.${i}.desc`,  label: `Bénéfice ${i + 1} — Description`, section: "Bénéfices", type: "long" as const })),
];

const heroServiceFields = (hasTargetAudience = true): FieldDef[] => [
  { key: "heroLabel",             label: "Label héro (↳ Coaching X)", section: "Héro", type: "short" },
  { key: "page.subtitle",        label: "Description héro",           section: "Héro", type: "long"  },
  { key: "hero.ctaBtnPrimary",   label: "Bouton CTA principal",       section: "Héro", type: "short" },
  { key: "hero.ctaBtnSecondary", label: "Bouton CTA secondaire",      section: "Héro", type: "short" },
  ...(hasTargetAudience ? [{ key: "hero.targetAudience", label: "Badge audience cible", section: "Héro", type: "short" as const }] : []),
];

const pricingFeaturesFields = (count = 4): FieldDef[] =>
  gen(count, i => ({ key: `pricing.features.${i}`, label: `Tarif — Avantage ${i + 1}`, section: "Tarif", type: "short" as const }));

const coachSectionFields = (): FieldDef[] => [
  { key: "coachLabel", label: "Label section Coach",  section: "Section Coach", type: "short" },
  { key: "coachTitle", label: "Titre section Coach",  section: "Section Coach", type: "short" },
  { key: "coachBio",   label: "Bio du coach",         section: "Section Coach", type: "long"  },
];

// ── Index ─────────────────────────────────────────────────────────────────────

const indexFields: FieldDef[] = [
  // Héro
  { key: "hero.title",           label: "Titre héro",             section: "Héro",    hint: "Grand titre animé", type: "short" },
  { key: "hero.subtitle",        label: "Sous-titre héro",        section: "Héro",    type: "long"  },
  { key: "hero.buttonPrimary",   label: "Bouton CTA doré",        section: "Héro",    type: "short" },
  { key: "hero.buttonSecondary", label: "Lien secondaire",        section: "Héro",    type: "short" },
  { key: "hero.trustSignal",     label: "Signal de confiance",    section: "Héro",    hint: "Texte sous les boutons", type: "short" },
  // Services
  { key: "servicesSection.labelSmall", label: "Label section Services",     section: "Section Services", type: "short" },
  { key: "servicesSection.title",      label: "Titre section Services",     section: "Section Services", type: "short" },
  { key: "servicesSection.subtitle",   label: "Sous-titre section Services",section: "Section Services", type: "long"  },
  { key: "services.discoverText",      label: "Texte lien Découvrir (cartes)", section: "Section Services", type: "short" },
  ...gen(4, i => ({ key: `services.${i}.title`,       label: `Service ${i + 1} — Titre`,       section: "Section Services", type: "short" as const })),
  ...gen(4, i => ({ key: `services.${i}.description`, label: `Service ${i + 1} — Description`, section: "Section Services", type: "long"  as const })),
  // Neurofeedback spotlight
  { key: "neurofeedback.labelSmall",   label: "Label spotlight Neurofeedback", section: "Spotlight Neurofeedback", type: "short" },
  { key: "neurofeedback.title",        label: "Titre Neurofeedback",            section: "Spotlight Neurofeedback", type: "short" },
  { key: "neurofeedback.longDescription", label: "Description Neurofeedback",  section: "Spotlight Neurofeedback", type: "long"  },
  ...gen(4, i => ({ key: `neurofeedback.useCases.${i}`, label: `Neurofeedback — Cas d'usage ${i + 1}`, section: "Spotlight Neurofeedback", type: "short" as const })),
  { key: "neurofeedback.ctaText",      label: "Lien CTA Neurofeedback",         section: "Spotlight Neurofeedback", type: "short" },
  // Coach section
  { key: "coachSection.labelSmall",          label: "Label section Coach",          section: "Section Coach", type: "short" },
  { key: "coachSection.coachName",           label: "Nom du coach",                 section: "Section Coach", type: "short" },
  { key: "coachSection.bioParagraph",        label: "Paragraphe bio",               section: "Section Coach", type: "long"  },
  { key: "coachSection.quote",               label: "Citation du coach",            section: "Section Coach", type: "long"  },
  { key: "coachSection.discoverLinkText",    label: "Lien \"En savoir plus\"",      section: "Section Coach", type: "short" },
  { key: "coachSection.certificationLinkText", label: "Lien certifications",        section: "Section Coach", type: "short" },
  // Processus
  { key: "stepsSection.labelSmall", label: "Label section Processus",  section: "Section Processus", type: "short" },
  { key: "stepsSection.title",      label: "Titre section Processus",  section: "Section Processus", type: "short" },
  { key: "stepsSection.ctaText",    label: "Bouton CTA Processus",     section: "Section Processus", type: "short" },
  // Vidéo
  { key: "videoSection.labelSmall", label: "Label section Vidéo",  section: "Section Vidéo", type: "short" },
  { key: "videoSection.description",label: "Description Vidéo",    section: "Section Vidéo", type: "long"  },
  { key: "videoSection.linkText",   label: "Lien sous la vidéo",   section: "Section Vidéo", type: "short" },
  // Témoignage
  { key: "testimonial.quote",      label: "Citation témoignage",   section: "Témoignage", type: "long"  },
  { key: "testimonial.authorName", label: "Nom de l'auteur",       section: "Témoignage", type: "short" },
  { key: "testimonial.authorTitle",label: "Titre de l'auteur",     section: "Témoignage", type: "short" },
  // Pourquoi ON Coaching
  { key: "whyUsSection.title",                label: "Titre section Pourquoi",          section: "Pourquoi ON Coaching", type: "short" },
  { key: "whyUsSection.subtitle",             label: "Sous-titre Pourquoi",             section: "Pourquoi ON Coaching", type: "long"  },
  { key: "whyUsSection.items.0.title",        label: "Avantage 1 — Titre",              section: "Pourquoi ON Coaching", type: "short" },
  { key: "whyUsSection.items.0.description",  label: "Avantage 1 — Description",        section: "Pourquoi ON Coaching", type: "long"  },
  { key: "whyUsSection.items.1.title",        label: "Avantage 2 — Titre",              section: "Pourquoi ON Coaching", type: "short" },
  { key: "whyUsSection.items.1.description",  label: "Avantage 2 — Description",        section: "Pourquoi ON Coaching", type: "long"  },
  { key: "whyUsSection.items.2.title",        label: "Avantage 3 — Titre",              section: "Pourquoi ON Coaching", type: "short" },
  { key: "whyUsSection.items.2.description",  label: "Avantage 3 — Description",        section: "Pourquoi ON Coaching", type: "long"  },
  // Presse
  { key: "pressSection.labelSmall", label: "Label section Presse", section: "Section Presse", type: "short" },
  { key: "pressSection.title",      label: "Titre section Presse", section: "Section Presse", type: "short" },
  { key: "pressSection.moreLink",   label: "Lien \"Voir plus\"",   section: "Section Presse", type: "short" },
  // CTA bas de page
  { key: "cta.title",          label: "Titre CTA",          section: "Appel à l'action", type: "short" },
  { key: "cta.subtitle",       label: "Sous-titre CTA",     section: "Appel à l'action", type: "long"  },
  { key: "cta.buttonText",     label: "Bouton CTA principal",section: "Appel à l'action", type: "short" },
  { key: "finalCta.pricesLink",label: "Lien tarifs (CTA)",  section: "Appel à l'action", type: "short" },
];

// ── About ─────────────────────────────────────────────────────────────────────

const aboutFields: FieldDef[] = [
  // Héro
  { key: "hero.title",            label: "Titre héro",             section: "Héro", type: "short" },
  { key: "hero.paragraph1",       label: "Texte accroche héro",    section: "Héro", type: "long"  },
  { key: "hero.badgeCertified",   label: "Badge certification",    section: "Héro", type: "short" },
  { key: "hero.badgeExperience",  label: "Badge expérience",       section: "Héro", type: "short" },
  { key: "hero.badgeLocation",    label: "Badge localisation",     section: "Héro", type: "short" },
  { key: "hero.availableStatus",  label: "Statut disponibilité",   section: "Héro", type: "short" },
  // Qui suis-je
  { key: "whoSection.title",          label: "Titre \"Qui suis-je\"",  section: "Qui suis-je", type: "short" },
  { key: "whoSection.subtitle",       label: "Sous-titre",             section: "Qui suis-je", type: "long"  },
  { key: "whoSection.paragraph1",     label: "Paragraphe 1 — Bio",     section: "Qui suis-je", type: "long"  },
  { key: "whoSection.paragraph2",     label: "Paragraphe 2 — Parcours",section: "Qui suis-je", type: "long"  },
  { key: "whoSection.differenceTitle",label: "Titre \"Ma différence\"", section: "Qui suis-je", type: "short" },
  { key: "whoSection.paragraph3",     label: "Paragraphe 3 — Différence", section: "Qui suis-je", type: "long" },
  { key: "whoSection.paragraph4",     label: "Paragraphe 4 — Engagement", section: "Qui suis-je", type: "long" },
  // Parcours (timeline)
  { key: "timelineSection.labelSmall", label: "Label section Parcours", section: "Parcours", type: "short" },
  { key: "timelineSection.title",      label: "Titre section Parcours", section: "Parcours", type: "short" },
  ...gen(4, i => ({ key: `timeline.items.${i}.period`,      label: `Étape ${i + 1} — Période`,      section: "Parcours", type: "short" as const })),
  ...gen(4, i => ({ key: `timeline.items.${i}.title`,       label: `Étape ${i + 1} — Titre`,        section: "Parcours", type: "short" as const })),
  ...gen(4, i => ({ key: `timeline.items.${i}.description`, label: `Étape ${i + 1} — Description`,  section: "Parcours", type: "long"  as const })),
  // Valeurs
  { key: "valuesSection.title",                label: "Titre section Valeurs",   section: "Valeurs", type: "short" },
  { key: "valuesSection.subtitle",             label: "Sous-titre Valeurs",      section: "Valeurs", type: "long"  },
  { key: "valuesSection.values.0.title",       label: "Valeur 1 — Titre",        section: "Valeurs", type: "short" },
  { key: "valuesSection.values.0.description", label: "Valeur 1 — Description",  section: "Valeurs", type: "long"  },
  { key: "valuesSection.values.1.title",       label: "Valeur 2 — Titre",        section: "Valeurs", type: "short" },
  { key: "valuesSection.values.1.description", label: "Valeur 2 — Description",  section: "Valeurs", type: "long"  },
  { key: "valuesSection.values.2.title",       label: "Valeur 3 — Titre",        section: "Valeurs", type: "short" },
  { key: "valuesSection.values.2.description", label: "Valeur 3 — Description",  section: "Valeurs", type: "long"  },
  // Certifications
  { key: "certificationSection.labelSmall", label: "Label section Certifications", section: "Certifications", type: "short" },
  { key: "certificationSection.title",      label: "Titre Certifications",         section: "Certifications", type: "short" },
  { key: "certificationSection.subtitle",   label: "Sous-titre Certifications",    section: "Certifications", type: "short" },
  { key: "certificationSection.description",label: "Description Certifications",   section: "Certifications", type: "long"  },
  { key: "certificationSection.ctaText",    label: "Bouton CTA Certifications",   section: "Certifications", type: "short" },
  // CTA
  { key: "cta.title",      label: "Titre CTA",           section: "Appel à l'action", type: "short" },
  { key: "cta.subtitle",   label: "Sous-titre CTA",      section: "Appel à l'action", type: "long"  },
  { key: "cta.buttonText", label: "Bouton CTA principal",section: "Appel à l'action", type: "short" },
  { key: "cta.pricesLink", label: "Lien tarifs (CTA)",   section: "Appel à l'action", type: "short" },
];

// ── CoachingScolaire ──────────────────────────────────────────────────────────

const coachingScolaireFields: FieldDef[] = [
  ...heroServiceFields(),
  // Pour toi si…
  { key: "forWhoLabel", label: "Label section Pour qui", section: "Pour qui", type: "short" },
  { key: "forWhoTitle", label: "Titre section Pour qui", section: "Pour qui", type: "short" },
  ...gen(6, i => ({ key: `forWho.${i}.text`, label: `Critère ${i + 1}`, section: "Pour qui", type: "long" as const })),
  // Bénéfices
  ...benefitFields(6),
  // Coach
  ...coachSectionFields(),
  // Tarif
  { key: "pricingLabel",        label: "Label section Tarif",    section: "Tarif", type: "short" },
  { key: "pricing.amount",      label: "Montant (ex : 60€)",     section: "Tarif", type: "short" },
  { key: "pricing.unit",        label: "Unité (ex : / séance)",  section: "Tarif", type: "short" },
  { key: "pricing.description", label: "Description séance",     section: "Tarif", type: "long"  },
  ...pricingFeaturesFields(),
  // CTA
  { key: "cta.buttonText", label: "Bouton CTA principal", section: "Appel à l'action", type: "short" },
  { key: "cta.footnote",   label: "Note bas de CTA",      section: "Appel à l'action", type: "short" },
];

// ── CoachingJeunes ────────────────────────────────────────────────────────────

const coachingJeunesFields: FieldDef[] = [
  { key: "page.title", label: "Titre SEO de la page", section: "Héro", type: "short" },
  ...heroServiceFields(),
  // Défis
  { key: "problemsLabel", label: "Label section Défis", section: "Défis", type: "short" },
  { key: "problemsTitle", label: "Titre section Défis", section: "Défis", type: "short" },
  ...gen(6, i => ({ key: `problems.${i}.text`, label: `Défi ${i + 1}`, section: "Défis", type: "long" as const })),
  // Bénéfices
  ...benefitFields(6),
  // Coach
  ...coachSectionFields(),
  // Tarif
  { key: "pricingLabel",   label: "Label section Tarif",    section: "Tarif", type: "short" },
  { key: "pricing.amount", label: "Montant (ex : 60€)",     section: "Tarif", type: "short" },
  { key: "pricing.unit",   label: "Unité (ex : / séance)",  section: "Tarif", type: "short" },
  ...pricingFeaturesFields(),
  // CTA
  { key: "cta.buttonText", label: "Bouton CTA principal", section: "Appel à l'action", type: "short" },
  { key: "cta.footnote",   label: "Note bas de CTA",      section: "Appel à l'action", type: "short" },
];

// ── CoachingNeurofeedback ─────────────────────────────────────────────────────

const coachingNeurofeedbackFields: FieldDef[] = [
  { key: "heroLabel",       label: "Label héro",      section: "Héro", type: "short" },
  { key: "page.subtitle",   label: "Description héro",section: "Héro", type: "long"  },
  { key: "hero.ctaBtnPrimary",   label: "Bouton CTA principal",  section: "Héro", type: "short" },
  { key: "hero.ctaBtnSecondary", label: "Bouton CTA secondaire", section: "Héro", type: "short" },
  { key: "hero.tagline",         label: "Tagline héro",          section: "Héro", type: "short" },
  // Étapes
  { key: "stepsLabel", label: "Label section Étapes", section: "Étapes", type: "short" },
  { key: "stepsTitle", label: "Titre section Étapes", section: "Étapes", type: "short" },
  ...gen(4, i => ({ key: `steps.${i}.title`, label: `Étape ${i + 1} — Titre`,       section: "Étapes", type: "short" as const })),
  ...gen(4, i => ({ key: `steps.${i}.desc`,  label: `Étape ${i + 1} — Description`, section: "Étapes", type: "long"  as const })),
  // Bénéfices
  { key: "benefitsLabel", label: "Label section Bénéfices", section: "Bénéfices", type: "short" },
  { key: "benefitsTitle", label: "Titre section Bénéfices", section: "Bénéfices", type: "short" },
  { key: "benefits.intro",label: "Intro Bénéfices",         section: "Bénéfices", type: "long"  },
  ...gen(6, i => ({ key: `benefits.${i}.title`, label: `Bénéfice ${i + 1} — Titre`,       section: "Bénéfices", type: "short" as const })),
  ...gen(6, i => ({ key: `benefits.${i}.desc`,  label: `Bénéfice ${i + 1} — Description`, section: "Bénéfices", type: "long"  as const })),
  // Technologie
  { key: "technologyLabel", label: "Label section Technologie", section: "Technologie", type: "short" },
  { key: "technologyName",  label: "Nom technologie",           section: "Technologie", type: "short" },
  { key: "loopTitle",       label: "Titre boucle neurofeedback",section: "Technologie", type: "short" },
  { key: "loopDescription", label: "Description boucle",        section: "Technologie", type: "long"  },
  // Q&A
  ...gen(3, i => ({ key: `qa.${i}.title`, label: `Q&A ${i + 1} — Question`, section: "Q&A", type: "short" as const })),
  ...gen(3, i => ({ key: `qa.${i}.text`,  label: `Q&A ${i + 1} — Réponse`,  section: "Q&A", type: "long"  as const })),
  // Vidéo
  { key: "videoTitle", label: "Titre section Vidéo", section: "Vidéo", type: "short" },
  // Ressources médias
  { key: "resourcesLabel", label: "Label section Ressources", section: "Ressources", type: "short" },
  { key: "resourcesTitle", label: "Titre section Ressources", section: "Ressources", type: "short" },
  { key: "resourcesIntro", label: "Intro ressources",         section: "Ressources", type: "long"  },
  ...gen(3, i => ({ key: `mediaSection.${i}.title`,     label: `Média ${i + 1} — Titre`,       section: "Ressources", type: "short" as const })),
  ...gen(3, i => ({ key: `mediaSection.${i}.desc`,      label: `Média ${i + 1} — Description`, section: "Ressources", type: "long"  as const })),
  ...gen(3, i => ({ key: `mediaSection.${i}.linkLabel`, label: `Média ${i + 1} — Texte lien`,  section: "Ressources", type: "short" as const })),
  // Praticien
  { key: "practitionerLabel", label: "Label section Praticien", section: "Praticien", type: "short" },
  { key: "practitionerTitle", label: "Titre section Praticien", section: "Praticien", type: "short" },
  { key: "practitionerBio",   label: "Bio du praticien",        section: "Praticien", type: "long"  },
  // Tarif
  { key: "pricingLabel",   label: "Label section Tarif",    section: "Tarif", type: "short" },
  { key: "pricing.amount", label: "Montant (ex : 60€)",     section: "Tarif", type: "short" },
  { key: "pricing.unit",   label: "Unité (ex : / séance)",  section: "Tarif", type: "short" },
  ...pricingFeaturesFields(),
  // CTA
  { key: "cta.buttonText", label: "Bouton CTA principal", section: "Appel à l'action", type: "short" },
  { key: "cta.footnote",   label: "Note bas de CTA",      section: "Appel à l'action", type: "short" },
];

// ── CoachingEquipe ────────────────────────────────────────────────────────────

const coachingEquipeFields: FieldDef[] = [
  ...heroServiceFields(),
  // Profils
  { key: "profilesLabel", label: "Label section Profils", section: "Profils", type: "short" },
  { key: "profilesTitle", label: "Titre section Profils", section: "Profils", type: "short" },
  ...gen(3, i => ({ key: `profiles.${i}.title`, label: `Profil ${i + 1} — Titre`,       section: "Profils", type: "short" as const })),
  ...gen(3, i => ({ key: `profiles.${i}.desc`,  label: `Profil ${i + 1} — Description`, section: "Profils", type: "long"  as const })),
  // Bénéfices
  ...benefitFields(6),
  // Coach
  ...coachSectionFields(),
  // Tarif
  { key: "pricingLabel",    label: "Label section Tarif",    section: "Tarif", type: "short" },
  { key: "pricing.text",    label: "Texte principal tarif",  section: "Tarif", type: "short" },
  { key: "pricing.subtitle",label: "Sous-texte tarif",       section: "Tarif", type: "short" },
  ...pricingFeaturesFields(),
  // CTA
  { key: "cta.primaryBtn",  label: "Bouton CTA principal",   section: "Appel à l'action", type: "short" },
  { key: "cta.secondaryBtn",label: "Bouton CTA secondaire",  section: "Appel à l'action", type: "short" },
  { key: "cta.footnote",    label: "Note bas de CTA",        section: "Appel à l'action", type: "short" },
];

// ── NosTarifs ─────────────────────────────────────────────────────────────────

const nosTarifsFields: FieldDef[] = [
  // Héro
  { key: "hero.badge", label: "Badge héro", section: "Héro", type: "short" },
  // Section principale
  { key: "tarifs.sectionLabel", label: "Label section Formules", section: "Section Formules", type: "short" },
  { key: "tarifs.sectionTitle", label: "Titre section Formules", section: "Section Formules", type: "short" },
  // Particuliers
  { key: "particuliers.badge",               label: "Badge Particuliers",         section: "Particuliers", type: "short" },
  { key: "particuliers.subtitle",            label: "Sous-titre Particuliers",    section: "Particuliers", type: "long"  },
  { key: "particuliers.cards.0.price",       label: "Coaching individuel — Prix", section: "Particuliers", type: "short" },
  { key: "particuliers.cards.0.unit",        label: "Coaching individuel — Unité",section: "Particuliers", type: "short" },
  { key: "particuliers.cards.0.description", label: "Coaching individuel — Desc", section: "Particuliers", type: "long"  },
  { key: "particuliers.cards.0.buttonText",  label: "Coaching individuel — Bouton",section: "Particuliers", type: "short" },
  // Neurofeedback
  { key: "neurofeedback.badge",          label: "Badge Neurofeedback",          section: "Neurofeedback", type: "short" },
  { key: "neurofeedback.popularBadge",   label: "Badge \"Populaire\"",          section: "Neurofeedback", type: "short" },
  { key: "neurofeedback.subtitle",       label: "Sous-titre Neurofeedback",     section: "Neurofeedback", type: "long"  },
  { key: "neurofeedback.cards.0.price",  label: "Neurofeedback — Prix",         section: "Neurofeedback", type: "short" },
  { key: "neurofeedback.cards.0.unit",   label: "Neurofeedback — Unité",        section: "Neurofeedback", type: "short" },
  { key: "neurofeedback.cards.0.buttonText", label: "Neurofeedback — Bouton",   section: "Neurofeedback", type: "short" },
  // Entreprises
  { key: "entreprises.badge",           label: "Badge Entreprises",       section: "Entreprises", type: "short" },
  { key: "entreprises.subtitle",        label: "Sous-titre Entreprises",  section: "Entreprises", type: "long"  },
  { key: "entreprises.cards.0.title",   label: "Entreprises — Titre",     section: "Entreprises", type: "short" },
  { key: "entreprises.cards.0.price",   label: "Entreprises — Prix",      section: "Entreprises", type: "short" },
  { key: "entreprises.cards.0.buttonText", label: "Entreprises — Bouton", section: "Entreprises", type: "short" },
  // Processus
  { key: "process.sectionLabel", label: "Label section Processus", section: "Processus", type: "short" },
  { key: "process.sectionTitle", label: "Titre section Processus", section: "Processus", type: "short" },
  // FAQ
  { key: "faq.sectionLabel", label: "Label section FAQ", section: "FAQ", type: "short" },
  { key: "faq.sectionTitle", label: "Titre section FAQ", section: "FAQ", type: "short" },
  // CTA
  { key: "cta.sectionLabel",      label: "Label CTA",             section: "Appel à l'action", type: "short" },
  { key: "cta.title",             label: "Titre CTA",             section: "Appel à l'action", type: "short" },
  { key: "cta.buttonText",        label: "Bouton CTA principal",  section: "Appel à l'action", type: "short" },
  { key: "cta.secondaryButtonText",label: "Bouton CTA secondaire",section: "Appel à l'action", type: "short" },
];

// ── Contact ───────────────────────────────────────────────────────────────────

const contactFields: FieldDef[] = [
  // Héro
  { key: "hero.responseLabel", label: "Label délai réponse", section: "Héro", type: "short" },
  // Formulaire
  { key: "formulaire.title",              label: "Titre formulaire",              section: "Formulaire", type: "short" },
  { key: "formulaire.subtitle",           label: "Sous-titre formulaire",         section: "Formulaire", type: "long"  },
  { key: "formulaire.contactTabLabel",    label: "Onglet \"Message\"",            section: "Formulaire", type: "short" },
  { key: "formulaire.rdvTabLabel",        label: "Onglet \"RDV\"",               section: "Formulaire", type: "short" },
  { key: "formulaire.rdvSubtitle",        label: "Sous-titre onglet RDV",        section: "Formulaire", type: "short" },
  { key: "formulaire.rdvDescription",     label: "Description onglet RDV",       section: "Formulaire", type: "long"  },
  { key: "formulaire.buttons.submitRdv",  label: "Bouton envoyer RDV",           section: "Formulaire", type: "short" },
  { key: "formulaire.buttons.submitContact", label: "Bouton envoyer message",    section: "Formulaire", type: "short" },
  { key: "formulaire.footerRdv",          label: "Note pied formulaire RDV",     section: "Formulaire", type: "short" },
  { key: "formulaire.footerContact",      label: "Note pied formulaire message", section: "Formulaire", type: "short" },
  // Coordonnées
  { key: "coordonnees.sectionLabel",    label: "Label section Coordonnées", section: "Coordonnées", type: "short" },
  { key: "coordonnees.sectionTitle",    label: "Titre section Coordonnées", section: "Coordonnées", type: "short" },
  { key: "coordonnees.subtitle",        label: "Sous-titre Coordonnées",   section: "Coordonnées", type: "short" },
  { key: "coordonnees.horairesLabel",   label: "Label horaires",           section: "Coordonnées", type: "short" },
  { key: "coordonnees.adresse.value",   label: "Adresse",                  section: "Coordonnées", type: "short" },
  { key: "coordonnees.telephone.value", label: "Téléphone",                section: "Coordonnées", type: "short" },
  { key: "coordonnees.email.value",     label: "Email de contact",         section: "Coordonnées", type: "short" },
  // FAQ
  { key: "faq.sectionLabel", label: "Label section FAQ", section: "FAQ", type: "short" },
  { key: "faq.sectionTitle", label: "Titre section FAQ", section: "FAQ", type: "short" },
  // CTA
  { key: "cta.sectionLabel",    label: "Label CTA",          section: "Appel à l'action", type: "short" },
  { key: "cta.description",     label: "Description CTA",    section: "Appel à l'action", type: "long"  },
  { key: "cta.callButtonText",  label: "Bouton appel",       section: "Appel à l'action", type: "short" },
  { key: "cta.emailButtonText", label: "Bouton email",       section: "Appel à l'action", type: "short" },
];

// ── Partenaires ───────────────────────────────────────────────────────────────

const partenairesFields: FieldDef[] = [
  { key: "hero.breadcrumb",     label: "Label héro (↳ Structures)", section: "Héro",             type: "short" },
  { key: "page.title",          label: "Titre de la page",          section: "Héro",             type: "short" },
  { key: "page.subtitle",       label: "Sous-titre",                section: "Héro",             type: "long"  },
  { key: "expertise.sectionLabel", label: "Label \"Double expertise\"", section: "Expertise",   type: "short" },
  { key: "exemples.sectionLabel",  label: "Label \"Cas concrets\"",     section: "Exemples",    type: "short" },
  { key: "cta.title",           label: "Titre CTA",                 section: "Appel à l'action", type: "short" },
  { key: "cta.buttonText",      label: "Bouton CTA",                section: "Appel à l'action", type: "short" },
];

// ── Presse & Médias ───────────────────────────────────────────────────────────

const presseMediasFields: FieldDef[] = [
  { key: "heroTitle",    label: "Titre principal",  section: "Héro", type: "short" },
  { key: "heroSubtitle", label: "Sous-titre",       section: "Héro", type: "long"  },
  { key: "hero.sectionLabel", label: "Label section (↳ Références)", section: "Héro", type: "short" },
  // LinkedIn
  { key: "profiles.linkedin.title",       label: "LinkedIn — Titre réseau",   section: "Profil LinkedIn", type: "short" },
  { key: "profiles.linkedin.name",        label: "LinkedIn — Nom",            section: "Profil LinkedIn", type: "short" },
  { key: "profiles.linkedin.description", label: "LinkedIn — Description",    section: "Profil LinkedIn", type: "long"  },
  // Resalib
  { key: "profiles.resalib.title",        label: "Resalib — Titre réseau",    section: "Profil Resalib",  type: "short" },
  { key: "profiles.resalib.name",         label: "Resalib — Nom",             section: "Profil Resalib",  type: "short" },
  { key: "profiles.resalib.platform",     label: "Resalib — Plateforme",      section: "Profil Resalib",  type: "short" },
  { key: "profiles.resalib.description",  label: "Resalib — Description",     section: "Profil Resalib",  type: "long"  },
];

// ── PAGES export ──────────────────────────────────────────────────────────────

export const PAGES: PageDef[] = [
  {
    key:    "index",
    label:  "Page d'accueil",
    route:  "/",
    icon:   "Home",
    fields: indexFields,
  },
  {
    key:    "about",
    label:  "À Propos",
    route:  "/about",
    icon:   "User",
    fields: aboutFields,
  },
  {
    key:    "coaching-scolaire",
    label:  "Coaching Scolaire",
    route:  "/coaching-scolaire",
    icon:   "GraduationCap",
    fields: coachingScolaireFields,
  },
  {
    key:    "coaching-jeunes",
    label:  "Coaching Jeunes",
    route:  "/coaching-jeunes",
    icon:   "Zap",
    fields: coachingJeunesFields,
  },
  {
    key:    "coaching-neurofeedback",
    label:  "Coaching Neurofeedback",
    route:  "/coaching-neurofeedback",
    icon:   "Brain",
    fields: coachingNeurofeedbackFields,
  },
  {
    key:    "coaching-equipe",
    label:  "Coaching Équipe",
    route:  "/coaching-equipe",
    icon:   "Users",
    fields: coachingEquipeFields,
  },
  {
    key:    "nos-tarifs",
    label:  "Nos Tarifs",
    route:  "/nos-tarifs",
    icon:   "CreditCard",
    fields: nosTarifsFields,
  },
  {
    key:    "contact",
    label:  "Contact",
    route:  "/contact",
    icon:   "MessageSquare",
    fields: contactFields,
  },
  {
    key:    "partenaires",
    label:  "Partenaires",
    route:  "/partenaires",
    icon:   "Building2",
    fields: partenairesFields,
  },
  {
    key:    "presse-medias",
    label:  "Presse & Médias",
    route:  "/presse-medias",
    icon:   "Newspaper",
    fields: presseMediasFields,
  },
  {
    key:    "site-settings",
    label:  "Paramètres du site",
    route:  "/admin/settings",
    icon:   "Settings",
    fields: [
      { key: "siteName", label: "Nom du site",           section: "Général",          type: "text" },
      { key: "tagline",  label: "Accroche",              section: "Général",          type: "text" },
      { key: "phone",    label: "Téléphone",             section: "Coordonnées",      type: "text" },
      { key: "email",    label: "Email de contact",      section: "Coordonnées",      type: "text" },
      { key: "address",  label: "Adresse",               section: "Coordonnées",      type: "text" },
      { key: "social",   label: "Réseaux sociaux (JSON)", section: "Réseaux sociaux", type: "json" },
      { key: "podcast",  label: "Podcast (JSON)",         section: "Podcast",         type: "json" },
    ],
  },
];

export const getPageDef = (key: string): PageDef | undefined =>
  PAGES.find((p) => p.key === key);
