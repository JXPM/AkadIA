---
type: system
tags: [akadia, cours, lecteur, ui]
updated: 2026-06-23
status: stable
sources: ["[[2026-06-23 - Spec AKADIA - Plateforme LMS]]"]
---

# 22 — Page de cours

Écran de consommation d'une leçon. **Disposition 3 colonnes** :

```
┌───────────┬─────────────────────┬───────────────┐
│ Menu      │ Contenu (centre)    │ Assistant IA  │
│ gauche    │                     │ (AKA, droite) │
│ (sommaire)│                     │               │
└───────────┴─────────────────────┴───────────────┘
```

- **Menu gauche** : sommaire Formation→Modules→Chapitres→Leçons ([[10 - Gestion & structure des formations]]).
- **Contenu centre** : supporte texte enrichi, images, schémas, tableaux, PDF, vidéos, exercices ([[11 - Types de contenu]]).
- **Colonne droite** : [[30 - Assistant IA pédagogique (AKA)|AKA]] contextuel.

Navigation **fluide** (Framer Motion, [[02 - Stack technique & architecture]]). Capsules vidéo intégrées automatiquement ([[32 - Générateur de capsules vidéo IA]]). Quiz en ligne ([[12 - Quiz intelligents]]).

## Liens
[[21 - Espace apprenant]] · [[35 - IA intégrée partout]] · [[42 - Accessibilité]].
