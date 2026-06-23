import type { Formation, PromptEntry, BadgeDef } from "./types";

export const categories = [
  "IA Générative",
  "RGPD & Données",
  "Bureautique",
  "Data Analytics",
  "Audit & Comptabilité",
  "Fiscalité",
  "Cybersécurité",
  "Management",
  "Développement",
] as const;

export const stats = [
  { label: "Apprenants actifs", value: "48 200+" },
  { label: "Formations publiées", value: "1 350+" },
  { label: "Taux de complétion", value: "87 %" },
  { label: "Organisations clientes", value: "320+" },
];

export const features = [
  {
    icon: "Sparkles",
    titre: "Générateur de formations IA",
    desc: "Saisissez un titre, AKADIA produit objectifs, modules, leçons, quiz et projet final — entièrement éditables.",
  },
  {
    icon: "Video",
    titre: "Capsules vidéo automatiques",
    desc: "Script, slides, voix off et sous-titres générés en quelques secondes pour chaque concept clé.",
  },
  {
    icon: "Bot",
    titre: "Assistant pédagogique AKA",
    desc: "Un tuteur IA qui explique, reformule et s'adapte au niveau de chaque apprenant.",
  },
  {
    icon: "MonitorPlay",
    titre: "Mode formateur présentiel",
    desc: "Pilotez vos sessions en salle : quiz live, ateliers, escape games, projection et tableau de bord temps réel.",
  },
  {
    icon: "FlaskConical",
    titre: "Laboratoire de prompts",
    desc: "Entraînez-vous au prompting, obtenez un score sur 100 et une version optimisée de vos prompts.",
  },
  {
    icon: "Trophy",
    titre: "Gamification complète",
    desc: "XP, niveaux, badges, classements et succès déblocables pour maximiser l'engagement.",
  },
];

export const temoignages = [
  {
    nom: "Sophie Marchand",
    role: "Responsable Formation, Cabinet Delvaux",
    texte:
      "Nous avons digitalisé 40 formations en un mois. Le générateur IA nous a fait gagner un temps colossal.",
  },
  {
    nom: "Karim Benali",
    role: "Directeur Data, FinScale",
    texte:
      "Les capsules vidéo et l'assistant AKA ont transformé l'expérience de nos apprenants. Engagement x2.",
  },
  {
    nom: "Élodie Fontaine",
    role: "Formatrice indépendante",
    texte:
      "Le mode présentiel est bluffant : quiz live, escape games, classements projetés. Mes sessions n'ont jamais été aussi vivantes.",
  },
];

export const faq = [
  {
    q: "AKADIA est-elle limitée à un type de formation ?",
    r: "Non. AKADIA est un LMS SaaS multi-tenant : hébergez un nombre illimité de formations sur n'importe quel sujet.",
  },
  {
    q: "Comment fonctionne le générateur de formations IA ?",
    r: "Vous saisissez un titre, l'IA génère le plan complet (modules, leçons, quiz, projet, glossaire, bibliographie), que vous pouvez ensuite éditer librement.",
  },
  {
    q: "Peut-on animer des formations en présentiel ?",
    r: "Oui. Le mode formateur présentiel permet de piloter des sessions en salle ou hybrides avec vue temps réel, groupes, timer et projection.",
  },
  {
    q: "Les formations sont-elles certifiantes ?",
    r: "AKADIA génère des attestations de suivi et de réussite en PDF, avec QR code et signature numérique.",
  },
  {
    q: "AKADIA respecte-t-elle l'accessibilité ?",
    r: "Oui : conformité WCAG, mode clair/sombre, navigation clavier et design responsive mobile-first.",
  },
];


export const badges: BadgeDef[] = [
  { id: "b1", nom: "Explorateur", description: "Première formation démarrée", icone: "Compass", obtenu: true },
  { id: "b2", nom: "Prompt Master", description: "Score de 90+ au laboratoire IA", icone: "Wand2", obtenu: true },
  { id: "b3", nom: "Analyste IA", description: "5 cas pratiques réussis", icone: "BarChart3", obtenu: true },
  { id: "b4", nom: "Expert IA", description: "Formation IA avancée terminée", icone: "BrainCircuit", obtenu: false },
  { id: "b5", nom: "Formateur IA", description: "Première formation publiée", icone: "GraduationCap", obtenu: false },
];

export const promptLibrary: PromptEntry[] = [
  {
    id: "p1",
    titre: "Analyse d'un bilan comptable",
    domaine: "Comptabilité",
    niveau: "Intermédiaire",
    contenu:
      "Tu es expert-comptable. Analyse le bilan suivant et identifie les 3 principaux risques financiers, avec pour chacun une recommandation chiffrée. Format : tableau.",
  },
  {
    id: "p2",
    titre: "Plan d'audit interne",
    domaine: "Audit",
    niveau: "Avancé",
    contenu:
      "Agis comme auditeur senior. Élabore un plan d'audit interne pour un processus achats, en listant objectifs, risques, contrôles testés et échantillonnage.",
  },
  {
    id: "p3",
    titre: "Synthèse RGPD pour dirigeants",
    domaine: "Juridique",
    niveau: "Débutant",
    contenu:
      "Explique les obligations RGPD clés d'une PME en 5 points actionnables, sans jargon, à destination d'un dirigeant non juriste.",
  },
  {
    id: "p4",
    titre: "Campagne marketing B2B",
    domaine: "Marketing",
    niveau: "Intermédiaire",
    contenu:
      "Tu es growth marketer. Propose une séquence d'emails B2B en 4 étapes pour promouvoir une formation, avec objet, accroche et CTA pour chaque email.",
  },
];

export const formations: Formation[] = [
  {
    id: "f1",
    slug: "maitriser-ia-generative",
    titre: "Maîtriser l'IA Générative en entreprise",
    description:
      "De zéro à expert : comprenez les LLM, rédigez des prompts professionnels et déployez l'IA générative dans vos processus métier en toute sécurité.",
    image: "gradient-1",
    auteur: "Dr. Camille Roy",
    categorie: "IA Générative",
    difficulte: "Intermédiaire",
    duree: 12,
    tags: ["LLM", "Prompt Engineering", "Productivité", "RGPD"],
    objectifs: [
      "Comprendre le fonctionnement des LLM",
      "Rédiger des prompts professionnels efficaces",
      "Identifier les cas d'usage métier à fort ROI",
      "Déployer l'IA en conformité RGPD",
    ],
    status: "publiee",
    note: 4.8,
    apprenants: 3240,
    modules: [
      {
        id: "m1",
        titre: "Fondations de l'IA générative",
        chapitres: [
          {
            id: "c1",
            titre: "Comprendre les LLM",
            lessons: [
              { id: "l1", type: "capsule_video", titre: "Qu'est-ce qu'un LLM ?", duree: 2 },
              { id: "l2", type: "texte", titre: "Tokens, contexte et limites", duree: 12 },
              { id: "l3", type: "quiz", titre: "Quiz : les bases", duree: 5 },
            ],
          },
          {
            id: "c2",
            titre: "L'art du prompt",
            lessons: [
              { id: "l4", type: "texte", titre: "Anatomie d'un bon prompt", duree: 15 },
              { id: "l5", type: "atelier", titre: "Atelier : réécrire un prompt", duree: 20 },
              { id: "l6", type: "etude_de_cas", titre: "Cas : assistant juridique", duree: 18 },
            ],
          },
        ],
      },
      {
        id: "m2",
        titre: "Déploiement & gouvernance",
        chapitres: [
          {
            id: "c3",
            titre: "IA & conformité",
            lessons: [
              { id: "l7", type: "capsule_video", titre: "IA et RGPD", duree: 2 },
              { id: "l8", type: "presentation", titre: "Cadre de gouvernance IA", duree: 14 },
              { id: "l9", type: "challenge", titre: "Challenge final", duree: 30 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "f2",
    slug: "rgpd-protection-donnees",
    titre: "RGPD & Protection des données",
    description:
      "Mettez votre organisation en conformité : registre des traitements, droits des personnes, analyses d'impact et gestion des violations.",
    image: "gradient-2",
    auteur: "Maître Julien Caron",
    categorie: "RGPD & Données",
    difficulte: "Débutant",
    duree: 8,
    tags: ["RGPD", "Conformité", "DPO", "Sécurité"],
    objectifs: [
      "Maîtriser les principes du RGPD",
      "Tenir un registre des traitements",
      "Gérer les droits des personnes",
      "Réagir à une violation de données",
    ],
    status: "publiee",
    note: 4.7,
    apprenants: 2110,
    modules: [
      {
        id: "m1",
        titre: "Les fondamentaux",
        chapitres: [
          {
            id: "c1",
            titre: "Principes clés",
            lessons: [
              { id: "l1", type: "capsule_video", titre: "Qu'est-ce que le RGPD ?", duree: 2 },
              { id: "l2", type: "texte", titre: "Les 6 principes", duree: 10 },
              { id: "l3", type: "quiz", titre: "Quiz de validation", duree: 5 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "f3",
    slug: "power-bi-data-analytics",
    titre: "Power BI & Data Analytics",
    description:
      "Transformez vos données en décisions : modélisation, DAX, visualisations interactives et tableaux de bord percutants.",
    image: "gradient-3",
    auteur: "Nadia El Amrani",
    categorie: "Data Analytics",
    difficulte: "Intermédiaire",
    duree: 16,
    tags: ["Power BI", "DAX", "Dataviz", "BI"],
    objectifs: [
      "Modéliser des données proprement",
      "Écrire des mesures DAX",
      "Créer des dashboards interactifs",
      "Partager et sécuriser les rapports",
    ],
    status: "publiee",
    note: 4.9,
    apprenants: 1890,
    modules: [
      {
        id: "m1",
        titre: "Prise en main",
        chapitres: [
          {
            id: "c1",
            titre: "Connexion aux données",
            lessons: [
              { id: "l1", type: "texte", titre: "Sources et Power Query", duree: 14 },
              { id: "l2", type: "atelier", titre: "Atelier : premier rapport", duree: 25 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "f4",
    slug: "cybersecurite-essentiels",
    titre: "Cybersécurité : les essentiels",
    description:
      "Protégez votre organisation : hygiène numérique, phishing, gestion des accès et réponse aux incidents.",
    image: "gradient-4",
    auteur: "Thomas Lefèvre",
    categorie: "Cybersécurité",
    difficulte: "Débutant",
    duree: 6,
    tags: ["Sécurité", "Phishing", "MFA", "Incident"],
    objectifs: [
      "Adopter les bons réflexes de sécurité",
      "Reconnaître le phishing",
      "Sécuriser ses accès",
      "Réagir à un incident",
    ],
    status: "publiee",
    note: 4.6,
    apprenants: 2670,
    modules: [
      {
        id: "m1",
        titre: "Hygiène numérique",
        chapitres: [
          {
            id: "c1",
            titre: "Les menaces courantes",
            lessons: [
              { id: "l1", type: "capsule_video", titre: "Anatomie d'un phishing", duree: 2 },
              { id: "l2", type: "simulation", titre: "Simulation : email piégé", duree: 15 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "f5",
    slug: "excel-pro",
    titre: "Excel pour les professionnels",
    description:
      "Devenez efficace sur Excel : formules avancées, tableaux croisés dynamiques, Power Query et automatisations.",
    image: "gradient-5",
    auteur: "Laure Dubois",
    categorie: "Bureautique",
    difficulte: "Intermédiaire",
    duree: 10,
    tags: ["Excel", "TCD", "Formules", "Automatisation"],
    objectifs: [
      "Maîtriser les formules avancées",
      "Construire des TCD",
      "Nettoyer les données avec Power Query",
      "Automatiser les tâches répétitives",
    ],
    status: "publiee",
    note: 4.7,
    apprenants: 4120,
    modules: [
      {
        id: "m1",
        titre: "Formules avancées",
        chapitres: [
          {
            id: "c1",
            titre: "Recherche & logique",
            lessons: [
              { id: "l1", type: "texte", titre: "RECHERCHEX et SI imbriqués", duree: 18 },
              { id: "l2", type: "quiz", titre: "Quiz formules", duree: 6 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "f6",
    slug: "audit-financier",
    titre: "Audit financier appliqué",
    description:
      "Conduisez une mission d'audit de bout en bout : planification, contrôles, échantillonnage et rapport.",
    image: "gradient-6",
    auteur: "Pierre Vasseur",
    categorie: "Audit & Comptabilité",
    difficulte: "Avancé",
    duree: 14,
    tags: ["Audit", "Contrôle interne", "Risques", "Normes"],
    objectifs: [
      "Planifier une mission d'audit",
      "Évaluer le contrôle interne",
      "Réaliser des tests de substance",
      "Rédiger un rapport d'audit",
    ],
    status: "brouillon",
    note: 4.8,
    apprenants: 760,
    modules: [
      {
        id: "m1",
        titre: "Planification",
        chapitres: [
          {
            id: "c1",
            titre: "Approche par les risques",
            lessons: [
              { id: "l1", type: "texte", titre: "Cartographie des risques", duree: 20 },
              { id: "l2", type: "etude_de_cas", titre: "Cas : cycle achats", duree: 25 },
            ],
          },
        ],
      },
    ],
  },
];

export function getFormation(slug: string) {
  return formations.find((f) => f.slug === slug);
}

export const lessonTypeLabels: Record<string, string> = {
  texte: "Leçon texte",
  interactive: "Leçon interactive",
  presentation: "Présentation",
  pdf: "PDF",
  fichier: "Fichier",
  etude_de_cas: "Étude de cas",
  quiz: "Quiz",
  atelier: "Atelier",
  challenge: "Challenge",
  escape_game: "Escape Game",
  simulation: "Simulation",
  classe_virtuelle: "Classe virtuelle",
  capsule_video: "Capsule vidéo",
  webinaire: "Webinaire",
};
