---
type: source
tags: [akadia, lms, spec, produit]
updated: 2026-06-23
status: stable
captured: "[[2026-06-23 - Spec AKADIA (prompt complet)]]"
---

# Source — Spec AKADIA · Plateforme LMS intelligente

> Prompt projet complet reçu de Johan le 2026-06-23. Brut intégral : `assets/2026-06-23 - Spec AKADIA (prompt complet).md`.
> C'est **la** source fondatrice du wiki : elle définit tout le périmètre. Toutes les pages `pages/` en découlent.

## En une phrase
**AKADIA** = un *Learning Operating System* SaaS multi-tenant qui permet de **créer, gérer, vendre, animer et suivre** des formations professionnelles illimitées, avec l'**IA générative intégrée partout** (génération de formations, capsules vidéo, assistant pédagogique AKA, labo de prompts). Concurrents visés : Coursera, OpenClassrooms, DataCamp, Udemy Business, Moodle, 360Learning.

## Takeaways clés
1. **Produit, pas contenu** : AKADIA héberge un nombre **illimité** de formations sur tout sujet — ce n'est pas une formation unique. → [[01 - Vue d'ensemble]]
2. **IA = cœur du produit**, pas un gadget : générateur de formations complètes, générateur de capsules vidéo (script→slides→voix off→sous-titres), assistant AKA, laboratoire & bibliothèque de prompts. → [[30 - Assistant IA pédagogique (AKA)]], [[31 - Générateur de formations IA]], [[32 - Générateur de capsules vidéo IA]]
3. **Double usage e-learning + présentiel** : un *Mode formateur présentiel* (pilotage de session live, projection, groupes, timer) en plus du e-learning asynchrone. → [[23 - Mode formateur présentiel]]
4. **Stack arrêtée** : Next.js 15 + React + TS + Tailwind + shadcn/ui + Framer Motion ; **Supabase** (auth, DB, storage, realtime) ; multi-tenant. → [[02 - Stack technique & architecture]]
5. **Design premium** « cabinet de conseil » : bleu nuit + blanc + bleu électrique, Inter/Geist, inspirations Notion/Linear/Stripe/DataCamp/Deloitte. → [[03 - Design System]]
6. **6 espaces** : site public, portail apprenant, portail formateur, portail admin, moteur IA, marketplace. → [[01 - Vue d'ensemble]]
7. **25 tables Supabase** spécifiées avec relations/contraintes/index/RLS. → [[40 - Base de données Supabase]]

## Ce que ça change dans le wiki
Cette source **fonde tout le wiki**. Pages créées (familles : 0x fondations, 1x métier, 2x espaces/UI, 3x IA, 4x infra/data, 5x référence) :

- 0x : [[01 - Vue d'ensemble]] · [[02 - Stack technique & architecture]] · [[03 - Design System]]
- 1x : [[10 - Gestion & structure des formations]] · [[11 - Types de contenu]] · [[12 - Quiz intelligents]] · [[13 - Certifications & attestations]] · [[14 - Gamification]] · [[15 - Marketplace]]
- 2x : [[20 - Site public & page d'accueil]] · [[21 - Espace apprenant]] · [[22 - Page de cours]] · [[23 - Mode formateur présentiel]] · [[24 - Classes virtuelles]] · [[25 - Administration, rôles & permissions]]
- 3x : [[30 - Assistant IA pédagogique (AKA)]] · [[31 - Générateur de formations IA]] · [[32 - Générateur de capsules vidéo IA]] · [[33 - Laboratoire IA]] · [[34 - Générateur & bibliothèque de prompts]] · [[35 - IA intégrée partout]]
- 4x : [[40 - Base de données Supabase]] · [[41 - Analytics]] · [[42 - Accessibilité]]
- 5x : [[50 - Livrables attendus]]

Le volet design relie [[aura.build]] (patterns Course/Bootcamp/Curriculum) et [[Awwwards]] (références) + [[uipro]] (implémentation).

## Questions ouvertes (à creuser)
- Quel **fournisseur LLM** pour les générateurs IA (Claude via AI Gateway ? quotas, coûts) ?
- **Capsules vidéo IA** : quelle pile TTS + génération de slides + assemblage vidéo ?
- **Multi-tenant** : isolation par `organization_id` + RLS, ou schéma par tenant ?
- **Paiements** : Stripe ? abonnements B2B vs achat de formation à l'unité ?
- Le `prompt_library` / `prompt_tests` suggère un fort focus **formations IA/prompting** — est-ce le segment de lancement ?
