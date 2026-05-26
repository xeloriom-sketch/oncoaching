-- ═══════════════════════════════════════════════════════════════════════════
-- ON Coaching — Schéma Supabase complet
-- Coller dans Supabase → SQL Editor → Run
-- Idempotent : peut être exécuté plusieurs fois sans erreur
-- ═══════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. TABLES
-- ─────────────────────────────────────────────────────────────────────────────

-- Contenu des pages (textes modifiables depuis l'admin)
CREATE TABLE IF NOT EXISTS page_content (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key   TEXT UNIQUE NOT NULL,
  content    JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Messages reçus via formulaire contact et prise de RDV
CREATE TABLE IF NOT EXISTS submissions (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type            TEXT NOT NULL CHECK (type IN ('contact', 'rdv')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  read            BOOLEAN DEFAULT false,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  service         TEXT,
  subject         TEXT,
  message         TEXT,
  preferred_date  TEXT,
  preferred_time  TEXT,
  preferred_date2 TEXT,
  preferred_time2 TEXT,
  session_format  TEXT,
  note            TEXT
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RLS — Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions  ENABLE ROW LEVEL SECURITY;

-- page_content : lecture publique, écriture réservée aux admins connectés
DROP POLICY IF EXISTS "Lecture publique"           ON page_content;
DROP POLICY IF EXISTS "Écriture admin authentifié" ON page_content;

CREATE POLICY "Lecture publique" ON page_content
  FOR SELECT USING (true);

CREATE POLICY "Écriture admin authentifié" ON page_content
  FOR ALL USING (auth.role() = 'authenticated');

-- submissions : n'importe qui peut insérer (formulaire public), seul l'admin lit/modifie
DROP POLICY IF EXISTS "Insertion publique"              ON submissions;
DROP POLICY IF EXISTS "Lecture/MAJ admin authentifié"   ON submissions;

CREATE POLICY "Insertion publique" ON submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Lecture/MAJ admin authentifié" ON submissions
  FOR ALL USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. INDEX
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_page_content_key       ON page_content (page_key);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions  (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_read       ON submissions  (read);
CREATE INDEX IF NOT EXISTS idx_submissions_type       ON submissions  (type);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. TRIGGER updated_at
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_page_content_updated_at ON page_content;
CREATE TRIGGER trg_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. DONNÉES — Contenu des 11 pages
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO page_content (page_key, content) VALUES

-- ── Page d'accueil ────────────────────────────────────────────────────────────
('index', '{
  "hero": {
    "title": "Développez votre potentiel infini.",
    "subtitle": "Coach certifié à Mâcon (Sancé, 71) — accompagnement personnalisé pour particuliers et entreprises. 26 ans d''expérience en sciences humaines.",
    "buttonPrimary": "Prendre rendez-vous",
    "buttonSecondary": "Notre approche",
    "image": "imgHeroicon.png"
  },
  "servicesSection": {
    "title": "Un accompagnement unique pour des résultats durables",
    "subtitle": "Coaching certifié à Mâcon et à distance — scolaire, jeunes adultes, neurofeedback et équipe en Saône-et-Loire (71)."
  },
  "services": [
    {"key":"scolaire","title":"Coaching scolaire & étudiant","description":"Soutien, méthodologie et orientation pour réussir sa scolarité ou ses études à Mâcon et en Saône-et-Loire.","link":"/coaching-scolaire"},
    {"key":"jeunes","title":"Coaching jeunes & jeunes adultes","description":"Accompagnement lors des choix d''orientation, insertion pro, confiance et construction du projet de vie — 15 à 30 ans à Mâcon.","link":"/coaching-jeunes"},
    {"key":"neurofeedback","title":"Coaching & Neurofeedback","description":"Neurofeedback NeurOptimal® non invasif à Mâcon : réduction du stress, concentration, sommeil et performances cognitives.","link":"/coaching-neurofeedback"},
    {"key":"equipe","title":"Coaching d''équipe","description":"Développez la cohésion, la performance et l''intelligence collective de votre équipe — TPE/PME en Saône-et-Loire.","link":"/coaching-equipe"}
  ],
  "whyUsSection": {
    "title": "Pourquoi choisir ON Coaching à Mâcon ?",
    "subtitle": "Coach certifié à Mâcon, Noureddine Omar combine 26 ans d''expérience enseignant et une expertise en neurofeedback pour des résultats concrets.",
    "items": [
      {"key":"certifies","title":"Coach certifié à Mâcon","description":"Certifié par Prisme Évolution, Noureddine Omar est l''un des rares coachs certifiés à Mâcon et en Saône-et-Loire (71)."},
      {"key":"mesure","title":"Approche sur mesure","description":"Chaque programme de coaching à Mâcon est personnalisé pour répondre précisément à vos besoins et objectifs spécifiques."},
      {"key":"methodes","title":"Méthodes éprouvées","description":"Nos techniques combinent coaching certifié et neurofeedback NeurOptimal® — approches scientifiques et validées cliniquement."}
    ]
  },
  "cta": {
    "title": "Passez au niveau supérieur.",
    "subtitle": "1er rendez-vous offert à Mâcon (Sancé, 71) ou en visioconférence. Sans engagement.",
    "buttonText": "Prendre rendez-vous",
    "buttonLink": "/contact"
  },
  "stats": [
    {"value":"26 ans","label":"Enseignant SES"},
    {"value":"100+","label":"Accompagnements"},
    {"value":"Certifié","label":"Prisme Évolution"},
    {"value":"4","label":"Programmes spécialisés"}
  ],
  "steps": [
    {"num":"01","title":"Consultation","desc":"Premier RDV offert, diagnostic complet"},
    {"num":"02","title":"Plan sur mesure","desc":"Programme aligné avec vos objectifs"},
    {"num":"03","title":"Transformation","desc":"Résultats mesurables et durables"}
  ],
  "servicesCards": [
    {"key":"scolaire","title":"Coaching scolaire & étudiant","desc":"Soutien, méthodologie et orientation pour réussir sa scolarité ou ses études.","tag":"Collégiens · Lycéens · Étudiants"},
    {"key":"jeunes","title":"Coaching jeunes & jeunes adultes","desc":"Accompagnement lors des choix d''orientation, insertion pro et construction du projet de vie.","tag":"15 – 30 ans"},
    {"key":"neurofeedback","title":"Coaching & Neurofeedback","desc":"Entraînement cérébral NeurOptimal® : réduction du stress, concentration, sommeil, performances cognitives. Non invasif, dès 6 à 10 séances.","tag":"NeurOptimal® · Non invasif"},
    {"key":"equipe","title":"Coaching d''équipe","desc":"Développez la cohésion, la performance et l''intelligence collective de votre équipe.","tag":"Entreprises · TPE/PME"}
  ]
}'::jsonb),

-- ── À propos ──────────────────────────────────────────────────────────────────
('about', '{
  "hero": {
    "title": "À propos d''ON Coaching",
    "paragraph1": "Fondé sur des valeurs d''excellence, d''empathie et d''innovation, ON Coaching accompagne les particuliers et les entreprises dans leur développement.",
    "paragraph2": "Notre mission est de vous aider à libérer votre potentiel, à surmonter les obstacles et à atteindre vos objectifs personnels et professionnels.",
    "image": "faviconNoText.png",
    "imageAlt": "ON Coaching"
  },
  "whoSection": {
    "title": "Qui suis-je ?",
    "subtitle": "Coach certifié et passionné par l''accompagnement humain",
    "paragraph1": "Coach certifié, formé par Prisme Évolution, j''ai consacré 26 années de ma vie professionnelle à enseigner les sciences économiques et sociales à des lycéens.",
    "paragraph2": "Titulaire d''un diplôme en sciences sociales, j''ai toujours eu à cœur de comprendre l''humain dans sa globalité : ses comportements, ses motivations, ses freins, ses potentiels.",
    "differenceTitle": "Ma différence",
    "paragraph3": "Ce qui me distingue ? C''est l''alliance entre une solide base théorique, issue des sciences humaines, et une expérience de terrain riche.",
    "paragraph4": "Je crois profondément en la capacité de chacun à évoluer, à retrouver du sens, de l''énergie et à reprendre le pouvoir sur sa trajectoire de vie."
  },
  "valuesSection": {
    "title": "Nos valeurs",
    "subtitle": "Chez ON Coaching, nos valeurs fondamentales guident toutes nos interactions et notre approche du coaching.",
    "values": [
      {"key":"empathie","title":"Empathie","description":"Nous créons un espace de confiance où vous vous sentez écouté et compris sans jugement."},
      {"key":"excellence","title":"Excellence","description":"Nous nous engageons à offrir un accompagnement de haute qualité et à poursuivre constamment notre développement professionnel."},
      {"key":"innovation","title":"Innovation","description":"Nous intégrons les dernières recherches et approches pour vous offrir des techniques de coaching efficaces et innovantes."}
    ]
  },
  "cta": {
    "title": "Découvrez comment nous pouvons vous accompagner",
    "subtitle": "Prenez rendez-vous pour une première séance de découverte et discutons de vos objectifs et besoins.",
    "buttonText": "Contactez-nous",
    "buttonLink": "/contact"
  }
}'::jsonb),

-- ── Coaching scolaire ─────────────────────────────────────────────────────────
('coaching-scolaire', '{
  "page": {
    "title": "Coaching scolaire & étudiant",
    "subtitle": "Pour réussir, se révéler et trouver son chemin."
  },
  "tabs": [
    {"key":"accompagnement","label":"Accompagnement sur mesure","paragraphs":["Coach certifié et enseignant de lycée depuis 26 ans, j''ai accompagné des milliers de jeunes dans leur construction personnelle et dans leurs apprentissages.","Parce que chaque parcours est unique, je propose un accompagnement personnalisé, bienveillant et structuré."]},
    {"key":"jeunes","label":"J''accompagne les jeunes à…","items":["Retrouver la motivation et le goût d''apprendre","Améliorer leurs méthodes de travail et leur organisation","Gérer le stress, la pression scolaire et les examens","Renforcer leur confiance en eux et leur estime personnelle","Clarifier leur orientation et leurs choix d''avenir","Se remettre en mouvement après un décrochage ou une perte de repères"]},
    {"key":"parents","label":"J''accompagne aussi les parents à…","items":["Mieux comprendre les besoins et les blocages de leur enfant","Adopter une posture de soutien juste, sans surprotéger ni culpabiliser","Retrouver un dialogue apaisé en famille autour des enjeux scolaires"]},
    {"key":"methodes","label":"Méthode et outils","items":["L''écoute active et l''alliance avec le jeune","Analyse fine des freins et des leviers","Outils concrets et adaptés à chaque profil","Posture de coach : ni professeur, ni psychologue, mais accompagnant vers l''autonomie"]},
    {"key":"propose","label":"Ce que je propose concrètement","items":["Bilan personnalisé en début d''accompagnement","Séances individuelles (présentiel, visio ou à domicile)","Outils pratiques : gestion du temps, planification, auto-évaluation","Points réguliers avec les parents si nécessaire"]},
    {"key":"resultats","label":"Pour quels résultats ?","items":["Un jeune qui reprend confiance en lui","Un climat familial apaisé face aux enjeux scolaires","Un projet d''orientation plus clair, choisi, non subi","Des progrès visibles à l''école comme dans la posture personnelle"],"quote":"On ne motive pas un jeune en lui mettant la pression. On l''aide à se reconnecter à ses ressources."}
  ],
  "cta": {
    "title": "Prêt à avancer ?",
    "subtitle": "Réservez votre première séance dès maintenant.",
    "buttonText": "Je prends rendez-vous",
    "buttonLink": "/contact"
  }
}'::jsonb),

-- ── Coaching jeunes ───────────────────────────────────────────────────────────
('coaching-jeunes', '{
  "page": {
    "title": "Coaching jeunes & jeunes adultes",
    "subtitle": "Retrouver confiance, clarté et direction."
  },
  "tabs": [
    {"key":"accompagnement","label":"Accompagnement sur mesure","paragraphs":["Tu te sens parfois perdu ? En questionnement sur ton avenir, ton identité ou tes choix ?","Coach certifié et enseignant depuis 26 ans, je propose un espace d''écoute bienveillant et structuré pour t''accompagner à ton rythme."]},
    {"key":"concretement","label":"Concrètement, je t''aide à…","items":["Clarifier tes envies, tes projets, ton orientation","Retrouver confiance en toi et en tes capacités","Apprendre à mieux t''organiser et gérer ton temps","Gérer ton stress, ta pression et tes émotions","Sortir de l''auto-sabotage, du doute, de la procrastination","Trouver du sens et reconnecter avec ce qui te motive"]},
    {"key":"propose","label":"Ce que je propose","items":["Un bilan de départ pour faire le point","Des séances individuelles en visio, en présentiel ou à domicile","Des outils concrets et personnalisés","Une relation de confiance basée sur l''écoute active"]},
    {"key":"pourquoi","label":"Pourquoi me faire confiance ?","items":["Double expertise : 26 ans auprès de jeunes dans le monde éducatif","Une posture d''écoute, pas de jugement","Un accompagnement humain, adapté à chacun"]},
    {"key":"pourqui","label":"Pour qui ?","items":["Ceux qui cherchent un cap","Ceux qui veulent mieux se connaître","Ceux qui veulent se relever après un échec ou un blocage","Ceux qui veulent juste avancer, autrement"],"quote":"Tu n''as pas besoin d''avoir toutes les réponses. Tu as besoin d''un espace pour les faire émerger."}
  ],
  "cta": {
    "title": "Prêt à passer à l''action ?",
    "subtitle": "Réservez dès maintenant votre séance découverte.",
    "buttonText": "Je prends rendez-vous",
    "buttonLink": "/contact"
  }
}'::jsonb),

-- ── Coaching neurofeedback ────────────────────────────────────────────────────
('coaching-neurofeedback', '{
  "page": {
    "title": "Coaching & Neurofeedback",
    "subtitle": "Entraîner le cerveau pour améliorer performance et bien-être."
  },
  "tabs": [
    {"key":"accompagnement","label":"Accompagnement par Neurofeedback","paragraphs":["Grâce à ma certification en neurofeedback, je propose un accompagnement permettant d''entraîner le cerveau à retrouver équilibre et flexibilité.","Le neurofeedback vient compléter mes pratiques de coaching, en offrant un outil concret et efficace pour développer son potentiel."]},
    {"key":"definition","label":"Qu''est-ce que le neurofeedback ?","paragraph":"Le neurofeedback est une méthode douce et non invasive qui permet au cerveau d''apprendre à mieux s''autoréguler. Au fil des séances, le cerveau développe de nouveaux automatismes favorisant l''équilibre émotionnel, la concentration et le bien-être."},
    {"key":"pourqui","label":"Pour qui ?","items":["Stress, anxiété, burn-out, peurs, hyperactivité, troubles du sommeil, fatigue chronique","Troubles neurodéveloppementaux : TDA/H, troubles Dys (dyslexie, dysorthographie, dyscalculie…)","Performance : musiciens, athlètes, dirigeants souhaitant optimiser leur performance"]},
    {"key":"resultats","label":"Résultats attendus","items":["Diminution du stress, anxiété, impulsivité, insomnies","Amélioration de l''attention, concentration, mémoire, confiance en soi, bien-être global"]},
    {"key":"deroulement","label":"Déroulement d''une séance","steps":["Accueil & échanges : définition des besoins et objectifs","Installation : cinq capteurs sur le cuir chevelu mesurent l''activité cérébrale","Entraînement : installé dans un fauteuil, vous écoutez de la musique ou regardez un film","Bilan : retour d''expérience et suivi personnalisé — 45 à 60 minutes"],"note":"L''entraînement se déroule de façon simple, naturelle et non contraignante."},
    {"key":"complementarite","label":"Complémentarité Neurofeedback & Coaching","paragraph":"Le neurofeedback entraîne votre cerveau à être plus stable et détendu. Le coaching vous aide ensuite à transformer ce potentiel en actions concrètes."}
  ],
  "cta": {
    "title": "Essayez dès maintenant",
    "subtitle": "Séance découverte ou programme personnalisé combinant coaching & Neurofeedback.",
    "buttonText": "Je prends rendez-vous",
    "buttonLink": "/contact"
  }
}'::jsonb),

-- ── Coaching équipe ───────────────────────────────────────────────────────────
('coaching-equipe', '{
  "page": {
    "title": "Coaching d''équipe",
    "subtitle": "Renforcer la cohésion et la performance collective.",
    "intro": "Fort de 26 ans d''enseignement en sciences économiques et sociales, j''accompagne les équipes et les dirigeants en mobilisant une double expertise : pédagogue et coach certifié spécialisé en coaching d''équipe."
  },
  "tabs": [
    {"key":"vision","label":"Ma vision","tagline":"Renforcer la cohésion – Fédérer autour d''une vision – Agir ensemble"},
    {"key":"objectifs","label":"Objectifs","items":["Créer ou renforcer les liens entre les membres","Améliorer la communication et l''écoute active","Développer la confiance mutuelle et la solidarité","Clarifier les valeurs partagées, les missions, les rôles","Identifier les forces collectives et les leviers de performance","La gestion de conflits"]},
    {"key":"methodes","label":"Méthodes & Outils","items":["Ateliers expérientiels (jeux de coopération, mises en situation)","Outils issus du coaching d''équipe et de la dynamique des groupes","Techniques de facilitation : codéveloppement, photolangage, cercles de parole","Évaluation des besoins en amont + bilan à chaud/froid"]}
  ],
  "cta": {
    "title": "Faites grandir votre équipe",
    "subtitle": "Planifiez une séance d''accompagnement dès maintenant.",
    "buttonText": "Je prends rendez-vous",
    "buttonLink": "/contact"
  }
}'::jsonb),

-- ── Nos tarifs ────────────────────────────────────────────────────────────────
('nos-tarifs', '{
  "particuliers": {
    "title": "Coaching particuliers",
    "subtitle": "Ados, jeunes adultes, étudiants, parents et familles",
    "cards": [
      {"key":"individuel","title":"Coaching individuel","items":["Séance 1h : 60 €","Séance approfondie 1h30 : 90 €"]},
      {"key":"parental","title":"Coaching parental & familial","items":["Séance 1h : 70 €","Séance duo parent + ado (1h30) : 100 €"]},
      {"key":"forfaits","title":"Forfaits","items":["Forfait scolaire 5 séances (1h) : 270 €","Forfait parentalité 3 séances (1h) : 190 €"]}
    ]
  },
  "entreprises": {
    "title": "Coaching en entreprise",
    "subtitle": "PME, équipes, dirigeants, managers, salariés",
    "items": ["½ journée (3h) : sur devis","Journée complète (6-7h) : sur devis"]
  },
  "neurofeedback": {
    "title": "Neurofeedback",
    "subtitle": "Amélioration de la concentration, gestion du stress, sommeil et régulation émotionnelle",
    "cards": [
      {"key":"seances","title":"Séances individuelles","items":["Séance 30 min : 60 €","Pack 5 séances (30 min) : 280 €","Pack 10 séances (30 min) : 500 €"]},
      {"key":"combo","title":"Coaching + Neurofeedback","items":["Séance combinée 1h30 : 110 €"]},
      {"key":"entreprise","title":"En entreprise","description":"Gestion du stress, prévention du burn-out, amélioration de la concentration.","note":"Tarifs sur devis"}
    ]
  },
  "faqItems": [
    {"q":"Le premier rendez-vous est-il vraiment gratuit ?","a":"Oui, absolument. La première consultation de 45 minutes est entièrement offerte, sans engagement."},
    {"q":"Les tarifs sont-ils négociables ?","a":"Nous proposons des ajustements tarifaires pour les étudiants et les situations particulières. N''hésitez pas à nous en parler."},
    {"q":"Proposez-vous des forfaits ?","a":"Oui, nous proposons des forfaits de 5 et 10 séances avec une réduction respective de 5% et 10%."},
    {"q":"Le neurofeedback est-il remboursé par la mutuelle ?","a":"Certaines mutuelles remboursent partiellement les séances de neurofeedback. Nous vous fournissons les justificatifs nécessaires."}
  ],
  "steps": [
    {"num":"01","title":"Consultation gratuite","desc":"45 min pour évaluer vos besoins et présenter nos programmes"},
    {"num":"02","title":"Programme personnalisé","desc":"Choix du programme et du rythme adapté à votre situation"},
    {"num":"03","title":"Accompagnement suivi","desc":"Séances régulières avec bilan et ajustements en continu"}
  ],
  "cta": {
    "title": "Prenez rendez-vous dès aujourd''hui",
    "subtitle": "Discutons ensemble de vos besoins et construisons un accompagnement sur mesure.",
    "buttonText": "Contactez-nous",
    "buttonLink": "/contact"
  }
}'::jsonb),

-- ── Partenaires ───────────────────────────────────────────────────────────────
('partenaires', '{
  "hero": {
    "title": "Partenaires & Institutions",
    "subtitle": "Accompagnement des publics en insertion et en transition",
    "intro": "J''accompagne les structures (associations, fondations, organismes d''insertion, établissements éducatifs) dans le développement des compétences psychosociales."
  },
  "expertise": {
    "title": "Une expertise au service des structures d''accompagnement",
    "points": [
      "Plus de 26 ans d''expérience dans l''enseignement des sciences sociales",
      "Une pratique professionnelle du coaching individuel et collectif, enrichie par le neurofeedback et la CNV"
    ]
  },
  "publics": {
    "title": "Publics accompagnés",
    "items": ["Jeunes en difficulté d''orientation ou de décrochage","Jeunes adultes en recherche de projet professionnel","Adultes en reconversion ou en insertion","Publics issus de la diversité ou de parcours migratoires"]
  },
  "modalites": {
    "title": "Modalités d''intervention",
    "items": [
      {"key":"ateliers","title":"Ateliers collectifs","items":["Développement des compétences psychosociales","Communication et gestion des relations","Construction du projet professionnel"]},
      {"key":"individuel","title":"Coaching individuel","items":["Remobilisation et accompagnement au changement","Clarification des objectifs personnels et professionnels"]},
      {"key":"neurofeedback","title":"Approche spécifique : Neurofeedback","items":["Amélioration de la concentration","Régulation émotionnelle","Réduction du stress"]}
    ]
  },
  "cta": {
    "title": "Construisons ensemble votre dispositif",
    "subtitle": "Je suis disponible pour co-construire des interventions adaptées à vos besoins.",
    "buttonText": "Prendre contact",
    "buttonLink": "/contact"
  }
}'::jsonb),

-- ── Contact ───────────────────────────────────────────────────────────────────
('contact', '{
  "coordonnees": {
    "title": "Nos coordonnées",
    "subtitle": "Plusieurs façons de nous joindre pour discuter de vos besoins.",
    "adresse":   {"label":"Notre adresse","value":"14 rue des écureuils\n71000 Sancé, France"},
    "telephone": {"label":"Téléphone","value":"+33 06 63 04 18 12"},
    "email":     {"label":"Email","value":"contact@oncoaching.fr"},
    "horaires":  {"label":"Horaires","lines":["Lundi: 14h00 - 19h00","Mardi: 8h00 - 12h00 / 17h00 - 19h00","Mercredi: Fermé","Jeudi: Fermé","Vendredi: 8h00 - 12h00 / 14h00 - 19h00","Samedi: 8h00 - 13h00","Dimanche: Fermé"]}
  },
  "faq": [
    {"q":"Comment se déroule le premier rendez-vous ?","a":"La première consultation est offerte. Elle dure environ 45 minutes et permet de faire un bilan complet de votre situation."},
    {"q":"Quels sont les modes de paiement acceptés ?","a":"Nous acceptons les paiements par virement bancaire, chèque ou espèces. Des facilités de paiement peuvent être envisagées."},
    {"q":"Les séances peuvent-elles se faire à distance ?","a":"Oui, les séances en visioconférence sont possibles et tout aussi efficaces. Nous utilisons Zoom ou Teams selon votre préférence."},
    {"q":"Combien de séances sont nécessaires ?","a":"Cela dépend de vos objectifs. En moyenne, un accompagnement comprend entre 6 et 12 séances, espacées d''une à deux semaines."}
  ],
  "timeOptions": [
    {"value":"matin","label":"Matin (8h–12h)"},
    {"value":"apres-midi","label":"Après-midi (14h–18h)"},
    {"value":"flexible","label":"Flexible"}
  ],
  "formulaire": {
    "title": "Formulaire de contact",
    "subtitle": "Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.",
    "fields": {
      "name":"Nom complet","email":"Email","phone":"Téléphone",
      "service":"Service qui vous intéresse","subject":"Sujet","message":"Message",
      "submitButton":"Envoyer le message","submittingButton":"Envoi en cours..."
    },
    "services": [
      {"value":"coaching-de-vie","label":"Coaching scolaire & étudiant"},
      {"value":"coaching-de-carriere","label":"Coaching jeunes & jeunes adultes"},
      {"value":"coaching-d-equipe","label":"Coaching & Neurofeedback"},
      {"value":"coaching-de-dirigeants","label":"Coaching d''équipe"},
      {"value":"autre","label":"Autre"}
    ],
    "messages": {
      "successTitle":"Message envoyé !","successDescription":"Nous vous contacterons très bientôt.",
      "errorTitle":"Erreur","errorDefault":"Une erreur est survenue."
    }
  }
}'::jsonb),

-- ── Presse & Médias ───────────────────────────────────────────────────────────
('presse-medias', '{
  "heroTitle": "Ils parlent de nous",
  "heroSubtitle": "Explorez nos revues de presse, émissions vidéo, interventions audio et profils officiels validés.",
  "sections": [
    {
      "type": "facebook",
      "title": "Le JSL",
      "embedUrl": "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FLeJSL71%2Fposts%2Fpfbid026cn9growEgiYZ7sjMSMWyJhdENBm3N6szFVMAAwsaYDkgmgSmaVuh5gLFVn4r5opl&show_text=true&width=500",
      "externalUrl": "https://www.facebook.com/LeJSL71/posts/pfbid026cn9growEgiYZ7sjMSMWyJhdENBm3N6szFVMAAwsaYDkgmgSmaVuh5gLFVn4r5opl"
    },
    {
      "type": "linkedin",
      "title": "Partage & Réflexions",
      "embedUrl": "https://www.linkedin.com/embed/feed/update/urn:li:share:7386461943089291270?collapsed=1",
      "externalUrl": "https://www.linkedin.com/feed/update/urn:li:share:7386461943089291270"
    },
    {
      "type": "linkedin",
      "title": "Dernières Actualités",
      "embedUrl": "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7454573698885459968",
      "externalUrl": "https://www.linkedin.com/feed/update/urn:li:ugcPost:7454573698885459968"
    },
    {
      "type": "youtube",
      "title": "Podcast et Compagnie — L''Émission",
      "embedUrl": "https://www.youtube.com/embed/Yu9CM4-DIXk",
      "externalUrl": "https://www.youtube.com/watch?v=Yu9CM4-DIXk"
    },
    {
      "type": "acast",
      "title": "Le Podcast au Format Audio",
      "embedUrl": "https://embed.acast.com/64a44bff1355cb0011b8142a/6978f315e23c68f310aa204c",
      "externalUrl": "https://play.acast.com/s/64a44bff1355cb0011b8142a/6978f315e23c68f310aa204c"
    }
  ]
}'::jsonb),

-- ── Paramètres du site ────────────────────────────────────────────────────────
('site-settings', '{
  "siteName": "ON Coaching",
  "tagline": "Coaching certifié à Mâcon. Coaching scolaire, jeunes adultes, neurofeedback et coaching d''équipe.",
  "phone": "+33663041812",
  "email": "contact@oncoaching.fr",
  "address": "14 rue des écureuils, 71000 Sancé",
  "social": {
    "facebook": "https://www.facebook.com/profile.php?id=100050783821185",
    "instagram": "https://www.instagram.com/oncoaching_",
    "linkedin": "",
    "youtube": ""
  },
  "podcast": {
    "title": "Podcast et Compagnie - Noureddine Omar",
    "description": "Écoutez nos épisodes sur le coaching, la performance et le développement personnel.",
    "coverUrl": "https://assets.pippa.io/shows/64a44bff1355cb0011b8142a/1769533670960-407c032a-8a77-477e-971a-d909a4ba3cb3.jpeg",
    "acastUrl": "https://play.acast.com/s/64a44bff1355cb0011b8142a/6978f315e23c68f310aa204c",
    "spotifyUrl": "",
    "applePodcastsUrl": ""
  }
}'::jsonb)

ON CONFLICT (page_key) DO UPDATE
  SET content    = EXCLUDED.content,
      updated_at = now();
