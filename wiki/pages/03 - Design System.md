---
type: system
tags: [akadia, design, ui, design-system]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 03 — Design System

Identité **premium**, façon **cabinet de conseil haut de gamme** : moderne, professionnel, élégant, minimaliste.

## Couleurs
| Rôle | Couleur |
|------|---------|
| Primaire | **Bleu nuit profond** |
| Secondaire | **Blanc** |
| Accent | **Bleu électrique subtil** |
| Neutres | Gris très clair → gris foncé |

> [!note] Tokens exacts (hex) non fournis. À définir comme variables CSS / thème Tailwind + shadcn (mode clair/sombre, cf. [[42 - Accessibilité]]).

## Typographie
- **Inter** + **Geist**.

## Interface
- Cartes modernes · ombres légères · coins arrondis · animations douces ([[02 - Stack technique & architecture|Framer Motion]]).

## Inspirations
**Notion**, **Linear**, **Stripe**, **DataCamp**, **Deloitte Digital**.

## Sources de patterns & implémentation
- [[aura.build]] — sections réutilisables (Hero Course/Bootcamp, Curriculum grid, Feature, Testimonials) pour [[20 - Site public & page d'accueil]].
- [[Awwwards]] — références visuelles haut de gamme (parallax, micro-interactions).
- [[uipro]] — scaffolding des composants shadcn/Tailwind (`uipro init --ai claude`).

> [!tip] Prochaine étape design : figer une **palette en hex** + échelle typographique + tokens shadcn, puis décliner les composants clés (cartes formation, dashboard widgets, lecteur de cours).
