# AKADIA – Plateforme LMS Intelligente de Nouvelle Génération
> Brut immuable — prompt projet complet reçu de Johan le 2026-06-23. Ne pas modifier.

## CONTEXTE
Équipe : Product Manager Senior, UX/UI Designer Senior, Architecte Logiciel Senior, Développeur Full Stack Senior, Expert LMS, Expert IA Générative, Expert Formation Professionnelle, Expert Accessibilité, Expert SaaS B2B.

Mission : concevoir et développer **AKADIA**, une plateforme LMS intelligente permettant de créer, gérer, vendre, animer et suivre des formations professionnelles. AKADIA n'est PAS dédiée à une seule formation : produit SaaS évolutif hébergeant un nombre illimité de formations sur n'importe quel sujet (IA Générative, Protection des données, RGPD, Excel, Power BI, Audit, Comptabilité, Fiscalité, Cybersécurité, Data Analytics, Développement logiciel, Management, etc.). Objectif : un « Learning Operating System » moderne rivalisant avec Coursera, OpenClassrooms, DataCamp, Udemy Business, Moodle moderne, 360Learning.

## STACK TECHNIQUE
- Frontend : Next.js 15, React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion.
- Backend : Supabase.
- Services : Authentification, Base de données, Stockage fichiers, Temps réel, Analytics.
- Architecture : SaaS Multi-Tenant, Scalable, Clean Architecture, Responsive Mobile First.

## DESIGN SYSTEM
Identité premium. Style : Moderne, Professionnel, Élégant, Cabinet de conseil haut de gamme, Minimaliste.
Couleurs : Primaire = Bleu nuit profond ; Secondaire = Blanc ; Accent = Bleu électrique subtil ; Neutres = Gris très clair à gris foncé.
Typographie : Inter, Geist.
Interface : Cartes modernes, Ombres légères, Coins arrondis, Animations douces.
Inspirations : Notion, Linear, Stripe, DataCamp, Deloitte Digital.

## STRUCTURE GLOBALE
Espaces : 1) Site public, 2) Portail apprenant, 3) Portail formateur, 4) Portail administrateur, 5) Moteur IA pédagogique, 6) Marketplace de formations.

## SITE PUBLIC
Pages : Accueil, Catalogue des formations, À propos, Blog, Contact, Tarifs, Connexion, Inscription.

## PAGE D'ACCUEIL
Hero — Titre : « Développez les compétences de demain avec AKADIA ». Sous-titre : « Une plateforme intelligente qui transforme l'apprentissage professionnel grâce à l'IA. » Boutons : Découvrir les formations / Créer un compte.
Sections : Chiffres clés, Formations populaires, Fonctionnalités, Témoignages, FAQ, Appel à l'action.

## GESTION DES FORMATIONS
Un administrateur crée un nombre illimité de formations. Chaque formation : Titre, Description, Image, Auteur, Catégorie, Difficulté, Durée, Prix, Tags, Objectifs pédagogiques. Statuts : Brouillon, Publiée, Archivée.

## STRUCTURE D'UNE FORMATION
Formation → Modules → Chapitres → Leçons → Exercices → Quiz → Études de cas → Projet final. Chaque niveau modifiable via interface.

## TYPES DE CONTENU
Leçon texte, Leçon interactive, Présentation, PDF, Fichier téléchargeable, Étude de cas, Quiz, Atelier, Challenge, Escape Game, Simulation, Classe virtuelle, Capsule vidéo, Webinaire.

## ESPACE APPRENANT
Dashboard moderne : Progression globale, Temps d'apprentissage, Formations en cours, Certifications obtenues, Badges, Activités récentes. Widgets dynamiques.

## PAGE DE COURS
Disposition : Menu gauche / Contenu centre / Assistant IA droite. Contenu principal supporte : texte enrichi, images, schémas, tableaux, PDF, vidéos, exercices. Navigation fluide.

## ASSISTANT IA PEDAGOGIQUE
Nom : AKA. Fonctions : répondre aux questions des apprenants ; expliquer notions, exercices, études de cas ; adapter son niveau (débutant, intermédiaire, avancé) ; générer exemples, analogies, résumés, fiches mémo.

## GÉNÉRATEUR DE FORMATIONS IA
Fonction critique. L'admin saisit un titre (ex. « Protection des données et IA »). AKADIA génère : Objectifs pédagogiques, Modules, Plan détaillé, Leçons, Quiz, Exercices, Cas pratiques, Projet final, Glossaire, Bibliographie. Contenu généré éditable.

## GÉNÉRATEUR DE CAPSULES VIDÉO IA
Pour chaque leçon. L'admin clique « Générer une capsule vidéo ». Le système produit : 1) Script pédagogique, 2) Slides illustrés, 3) Voix off, 4) Sous-titres, 5) Capsule vidéo. Durée 60–120 s. Objectif : expliquer un concept rapidement (ex. Qu'est-ce qu'un LLM ? Qu'est-ce que le RGPD ? Comment fonctionne un prompt ?). Vidéo intégrée automatiquement dans le cours.

## LABORATOIRE IA
Zone pratique. L'utilisateur teste des prompts, simule des demandes, expérimente. Le système analyse contexte, précision, contraintes, format attendu. Retour : Score /100, axes d'amélioration, version optimisée du prompt.

## GÉNÉRATEUR DE PROMPTS
L'utilisateur choisit un domaine (Comptabilité, Audit, Fiscalité, Contrôle de gestion, RH, Juridique, Marketing, Autre). Le système génère automatiquement un prompt professionnel.

## BIBLIOTHÈQUE DE PROMPTS
Bibliothèque consultable : recherche, filtres, favoris, copier-coller. Classement : Débutant, Intermédiaire, Expert.

## QUIZ INTELLIGENTS
Types : QCM, Vrai/Faux, Glisser-déposer, Cas pratique, Réponse libre. Correction automatique. Feedback détaillé. Explications pédagogiques.

## GAMIFICATION
XP, Niveaux, Badges, Récompenses, Classements, Succès déblocables. Exemples de badges : Explorateur, Prompt Master, Analyste IA, Expert IA, Formateur IA.

## MODE FORMATEUR PRÉSENTIEL
Espace pour formations en salle/hybrides.
- Pilotage de session : lancer une session, ouvrir un quiz, lancer un atelier/challenge/escape game.
- Vue temps réel : participants connectés, progression, scores, réponses, questions.
- Gestion des groupes : créer équipes, groupes de travail, ateliers ; suivi individuel et collectif.
- Timer intelligent : chronomètre, compte à rebours, alertes.
- Mode projection : plein écran (slides, quiz, résultats, classements).
- Tableau de bord live : apprenants bloqués, taux de réussite, progression moyenne, sujets difficiles.

## CLASSES VIRTUELLES
Intégration Teams, Zoom, Google Meet. Planification (date, heure, durée). Rappels automatiques.

## CERTIFICATIONS ET ATTESTATIONS
1) Attestation de suivi (condition : progression minimum). 2) Attestation de réussite (condition : score minimum configurable). Génération PDF automatique incluant Nom, Formation, Date, QR Code, Signature numérique.

## MARKETPLACE
Catalogue de formations. Filtres : catégorie, prix, difficulté, durée. Pages détaillées. Paiement intégré.

## ANALYTICS
Tableaux de bord complets. Mesures : progression, temps passé, taux de complétion, réussite, engagement, activité. Graphiques interactifs.

## ACCESSIBILITÉ
Respect WCAG. Mode clair/sombre. Navigation clavier. Responsive mobile/tablette/desktop.

## ADMINISTRATION
Gestion : utilisateurs, formations, contenus, quiz, badges, attestations, statistiques. Permissions : Super Admin, Administrateur, Formateur, Apprenant.

## BASE DE DONNÉES
Schéma complet Supabase. Tables : users, organizations, formations, modules, chapitres, lessons, videos, documents, quizzes, questions, attempts, badges, achievements, certificates, attestations, sessions, groups, prompt_library, prompt_tests, analytics, notifications, payments, subscriptions, roles, permissions. Créer aussi : relations, contraintes, index, policies RLS.

## IA INTÉGRÉE PARTOUT
IA disponible dans toute la plateforme : résumer, reformuler, générer, expliquer, créer des quiz/exercices/cas pratiques/slides/capsules vidéo/fiches de révision.

## LIVRABLE ATTENDU
1) Architecture complète, 2) Arborescence détaillée, 3) Base de données complète, 4) Schéma SQL Supabase, 5) Toutes les pages, 6) Tous les composants React, 7) Tous les endpoints API, 8) Toutes les routes, 9) Jeu de données de démonstration, 10) Documentation technique, 11) Documentation administrateur, 12) Documentation formateur, 13) Documentation apprenant. Résultat prêt pour mise en production SaaS professionnelle.
