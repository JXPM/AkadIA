---
description: Vérifier la santé du wiki (contradictions, orphelins, trous)
argument-hint:
---

Exécute le workflow **LINT** défini dans `wiki/CLAUDE.md` §5.3.

Passer en revue tout `wiki/` et rapporter :
- **Contradictions** entre pages, **affirmations périmées**.
- **Pages orphelines** (aucun lien entrant).
- **Concepts cités sans page dédiée**.
- **Cross-références manquantes**.
- **Trous de données** comblables par lecture de code ou recherche web.
- Frontmatter non conforme (`type` manquant, etc.).

Proposer les **prochaines sources** à ingérer et **questions** à creuser. Journaliser (`## [AAAA-MM-JJ] lint | …`).

$ARGUMENTS
