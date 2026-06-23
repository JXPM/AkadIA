# AKADIA — Guide administrateur

L'espace d'administration (`/admin`) permet de piloter votre organisation (tenant).

## Vue d'ensemble (`/admin`)
KPIs clés : apprenants, formations actives, taux de complétion, revenus. Graphique d'activité 7 jours et top formations.

## Gérer les formations (`/admin/formations`)
- Tableau de toutes les formations avec **statut** : Brouillon · Publiée · Archivée.
- Chaque formation possède : titre, description, image, auteur, catégorie, difficulté, durée, tags, objectifs.
- Actions : créer, éditer, publier, archiver.
- Hiérarchie éditable : **Formation → Modules → Chapitres → Leçons** (+ exercices, quiz, études de cas, projet final).

## Générateur de formations IA (`/admin/formations/nouvelle`)
1. Saisir un **titre** (ex. « Protection des données et IA »).
2. L'IA génère : objectifs, modules (avec leçons et quiz), projet final, glossaire, bibliographie.
3. Le plan est **éditable** avant création.

> Mode démo si `AI_GATEWAY_API_KEY` absent.

## Rôles & permissions
| Rôle | Portée |
|------|--------|
| Super Admin | toute la plateforme (multi-tenant) |
| Administrateur | une organisation |
| Formateur | animer/créer, sessions live |
| Apprenant | suivre les formations |

## Autres leviers
- **Gamification** : badges, XP, niveaux, classements.
- **Certifications / attestations** : suivi & réussite (PDF + QR + signature).
- **Accès** : c'est l'académie qui ouvre l'accès d'une organisation cliente à une formation, pour une période définie (table `acces_formations`). Pas de vente à l'unité ni de paiement en ligne.
- **Analytics** : progression, complétion, engagement.
