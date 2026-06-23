---
description: Filer la dernière réponse comme page de synthèse
argument-hint: [slug-optionnel]
---

Filer la réponse précédente de l'assistant dans `wiki/syntheses/<slug>.md`.

Slug : $ARGUMENTS (si vide, dériver un slug kebab-case concis du contenu).

Étapes :
1. Écrire la page de synthèse avec frontmatter (`type: synthesis`, `created`, `updated`, `tags`, `sources`).
2. Préserver les `[[wikilinks]]` et ajouter une section `## Références`.
3. Mettre à jour `wiki/index.md` (lister la nouvelle synthèse).
4. Ajouter une entrée à `wiki/log.md` (`## [AAAA-MM-JJ] save | <slug>`).
